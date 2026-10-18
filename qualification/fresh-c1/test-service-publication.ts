import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { digest, json, MAX_SECONDS, publish } from './common.ts';
import { verifyOwnership, serviceArguments } from './service.ts';
import { waitForGuardTerminal } from './service-test-support.ts';
import { bootId, durationTicks, enterPhase, identity, PHASE_BUDGETS, phase } from './supervisor.ts';

// Synthetic service envelopes with real subprocess identities. They are not
// systemd observations and cannot satisfy installed C1 reader admission.
function specimen(root: string): void {
  mkdirSync(root);
  const started = Date.now() - 1000, startedTick = process.hrtime.bigint() - durationTicks(1);
  const owner = identity(process.pid);
  const launch = { root, nonce: randomUUID(), unit: `aleph-fresh-c1-${randomUUID()}`,
    node: process.execPath, boot: bootId(), owner, started_at: started, deadline: started + MAX_SECONDS * 1000,
    started_tick: String(startedTick), deadline_tick: String(startedTick + durationTicks(MAX_SECONDS)),
    tooling_root: join(root, 'never-executed-tooling') };
  publish(join(root, 'launch.json'), launch);
  const hash = (name: string): string => digest(readFileSync(join(root, name)));
  const binding = { root, nonce: launch.nonce, launch_digest: hash('launch.json') };
  publish(join(root, 'service-command.json'), { ...binding, command: '/usr/bin/systemd-run',
    args: serviceArguments(launch.unit, launch.node,
      [join(launch.tooling_root, 'qualification/fresh-c1/driver.js'), 'run', root], root, MAX_SECONDS) });
  publish(join(root, 'service-start.json'), { ...binding, parent: owner, command_digest: hash('service-command.json'),
    started_at: started, finished_at: started + 10, status: 0, signal: null, error: null, stdout: '', stderr: '' });
  const properties = { Id: `${launch.unit}.service`, MainPID: String(owner.pid), ExecMainPID: String(owner.pid),
    InvocationID: 'a'.repeat(32), ControlGroup: `/synthetic-only/${launch.unit}.service`, Restart: 'no', KillMode: 'control-group',
    RuntimeMaxUSec: '1d', RemainAfterExit: 'yes', ActiveState: 'active', SubState: 'running' };
  publish(join(root, 'supervision.json'), { ...binding, properties, boot: bootId(), pid: owner.pid, identity: owner,
    invocation_id: properties.InvocationID, cgroup: `0::${properties.ControlGroup}\n`,
    command_digest: hash('service-command.json'), start_digest: hash('service-start.json') });
  publish(join(root, 'driver.json'), { ...binding, identity: owner, at: started + 20,
    invocation_id: properties.InvocationID, supervision_digest: hash('supervision.json') });
  mkdirSync(join(root, 'phases'));
  for (const [name, seconds, child] of PHASE_BUDGETS) enterPhase(root, name, seconds, child);
  publish(join(root, 'completion.json'), { verdict: 'PASS', finished_at: Date.now(),
    finished_tick: String(process.hrtime.bigint()), verification: 'synthetic-service-only-no-C1',
    ownership_digest: verifyOwnership(root).digest });
}

if (process.argv[2] === '--publisher') {
  const root = process.argv[3], kind = process.argv[4], owner = verifyOwnership(root);
  publish(join(root, 'guard.json'), { ownership_digest: owner.digest, identity: identity(process.pid),
    parent: identity(process.ppid), at: Date.now() });
  const hash = (name: string): string => digest(readFileSync(join(root, name)));
  publish(join(root, 'guard-result.json'), { verdict: 'PASS', ownership_digest: owner.digest,
    guard_digest: hash('guard.json'), completion_digest: hash('completion.json'), at: Date.now() });
  console.log('GUARD_RESULT_PUBLISHED');
  // IPC controls only the harmless publisher's timing, not the waiter's reads.
  const release = new Promise<void>(done => process.once('message', () => done()));
  process.send!({ guard_result_published: true });
  if (kind !== 'guard-exit') {
    await release;
    if (kind !== 'missing') {
      const completion = json(join(root, 'completion.json'));
      const terminal = { ...completion, verdict: kind === 'disagree' ? 'FAIL' : 'PASS',
        ownership_digest: kind === 'wrong-owner' ? 'sha256:foreign' : owner.digest,
        finished_at: kind === 'phase-deadline' ? phase(root).deadline : Date.now(),
        finished_tick: kind === 'phase-deadline' ? phase(root).deadline_tick : String(process.hrtime.bigint()),
        completion_digest: hash('completion.json'), guard_result_digest: hash('guard-result.json') };
      publish(join(root, 'terminal.json'), terminal);
      console.log('TERMINAL_PUBLISHED');
    }
  }
  process.disconnect();
} else {
  const root = mkdtempSync(join(tmpdir(), 'fresh-c1-service-publication-test-')), results = [];
  for (const kind of ['delayed', 'missing', 'guard-exit', 'disagree', 'normal', 'deadline', 'phase-deadline', 'wrong-owner']) {
    const directory = join(root, kind); specimen(directory);
    const child = spawn(process.execPath, [fileURLToPath(import.meta.url), '--publisher', directory, kind],
      { stdio: ['ignore', 'pipe', 'pipe', 'ipc'] });
    const stdout: Buffer[] = [], stderr: Buffer[] = [];
    child.stdout!.on('data', data => stdout.push(data)); child.stderr!.on('data', data => stderr.push(data));
    let closed = false, watchdogExpired = false;
    const exit = new Promise<{ status: number | null; signal: string | null }>(done =>
      child.once('close', (status, signal) => { closed = true; done({ status, signal }); }));
    const watchdog = setTimeout(() => { watchdogExpired = true; child.kill('SIGKILL'); }, 5000);
    let error: string | null = null, verdict: string | null = null, oldReadRejected = false;
    let releaseTimer: ReturnType<typeof setTimeout> | undefined;
    let deadline = 0, deadlineTick = 0n;
    try {
      await new Promise<void>((done, reject) => {
        child.once('error', reject);
        child.once('message', value => {
          try { assert.deepEqual(value, { guard_result_published: true }); done(); } catch (e) { reject(e); }
        });
        child.once('exit', () => reject(new Error('PUBLISHER_EXIT_BEFORE_READY')));
      });
      // This is the failing published test's actual sequence, with a real file
      // publication gap. No mocked filesystem, imports or module resolution.
      assert.equal(json(join(directory, 'guard-result.json')).verdict, 'PASS');
      assert.throws(() => json(join(directory, 'terminal.json')), { code: 'ENOENT' });
      oldReadRejected = true;
      const budget = ['missing', 'deadline'].includes(kind) ? 200 : 2000;
      deadline = Date.now() + budget; deadlineTick = process.hrtime.bigint() + BigInt(budget) * 1_000_000n;
      if (!['missing', 'guard-exit'].includes(kind)) {
        releaseTimer = setTimeout(() => child.send({ publish_terminal: true }), kind === 'deadline' ? 400 : kind === 'delayed' ? 100 : 0);
      }
      try {
        verdict = (await waitForGuardTerminal(directory, deadline, deadlineTick)).terminal.verdict;
      } catch (e) { error = String(e); }
      if (['delayed', 'normal'].includes(kind)) {
        assert.equal(error, null); assert.equal(verdict, 'PASS');
        assert(existsSync(join(directory, 'terminal.json')));
      } else {
        assert.equal(verdict, null, 'INVALID_PUBLICATION_ADMITTED');
        const expected = kind === 'guard-exit' ? /GUARD_EXIT_BEFORE_TERMINAL/
          : kind === 'disagree' ? /GUARD_TERMINAL_VERDICT/
            : kind === 'phase-deadline' ? /UNAUTHENTICATED_TERMINAL/
              : kind === 'wrong-owner' ? /TERMINAL_OWNER/ : /GUARD_SERVICE_TEST_DEADLINE/;
        assert.match(error!, expected);
      }
      if (kind === 'missing') {
        assert(!closed, 'MISSING_CASE_MUST_EXERCISE_LIVE_GUARD');
        assert(!existsSync(join(directory, 'terminal.json')));
        child.kill('SIGTERM');
      }
      const outcome = await exit;
      if (kind === 'missing') assert.equal(outcome.signal, 'SIGTERM');
      else { assert.equal(outcome.status, 0); assert.equal(outcome.signal, null); }
      if (kind === 'deadline') {
        assert(json(join(directory, 'terminal.json')).finished_at >= deadline);
        await assert.rejects(waitForGuardTerminal(directory, deadline, deadlineTick), /GUARD_SERVICE_TEST_DEADLINE/);
      }
      assert(!watchdogExpired, 'PUBLICATION_SUBPROCESS_WATCHDOG');
      assert.equal(Buffer.concat(stderr).length, 0);
      assert(Buffer.concat(stdout).toString().includes('GUARD_RESULT_PUBLISHED'));
      assert.equal(Buffer.concat(stdout).toString().includes('TERMINAL_PUBLISHED'), !['missing', 'guard-exit'].includes(kind));
      const result = { kind, result: 'PASS', admitted_verdict: verdict, rejected_with: error, old_read_rejected: oldReadRejected,
        deadline, deadline_tick: String(deadlineTick), subprocess: outcome, watchdog_expired: watchdogExpired };
      publish(join(directory, 'result.json'), result); results.push(result);
      console.log(`PASS guard publication ${kind}`);
    } finally {
      if (releaseTimer) clearTimeout(releaseTimer);
      if (!closed) child.kill('SIGKILL');
      const outcome = await exit; clearTimeout(watchdog);
      writeFileSync(join(directory, 'stdout.bin'), Buffer.concat(stdout));
      writeFileSync(join(directory, 'stderr.bin'), Buffer.concat(stderr));
      publish(join(directory, 'subprocess.json'), { ...outcome, watchdog_expired: watchdogExpired,
        stdout_digest: digest(Buffer.concat(stdout)), stderr_digest: digest(Buffer.concat(stderr)) });
    }
  }
  publish(join(root, 'result.json'), { result: 'PASS', controls: results.length, results,
    scope: 'Harmless subprocess publication only; synthetic service envelopes; no installed fixture or C1 execution.' });
  console.log(JSON.stringify({ result: 'PASS', evidence: root, controls: results.length, node: process.version }));
}

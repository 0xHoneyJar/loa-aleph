import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { digest, json, MAX_SECONDS, publish } from './common.ts';
import { alive, bootId, durationTicks, enterPhase, fixtureEnvironment, identity, phase, PHASE_BUDGETS, verifyCaseChild } from './supervisor.ts';
import { guardCase, inspectService, managerEnvironment, recordOwnership, serviceArguments, verifyOwnership } from './service.ts';

if (process.argv[2] === '--guard-fixture') {
  const root = process.argv[3], kind = process.argv[4];
  while (!existsSync(join(root, 'service-start.json'))) await new Promise(done => setTimeout(done, 5));
  recordOwnership(root); mkdirSync(join(root, 'phases'));
  if (kind === 'phase-timeout') {
    // Short synthetic timing fixture only. No installed run or canonical state.
    const tick = process.hrtime.bigint();
    publish(join(root, 'phases/1-setup.json'), { name: 'setup', started_at: Date.now(),
      started_tick: String(tick), deadline_tick: String(tick + durationTicks(2)),
      deadline: Date.now() + 2000, child_seconds: 1 });
  } else for (const [name, seconds, child] of PHASE_BUDGETS) enterPhase(root, name, seconds, child);
  const guardian = spawn(process.execPath, [fileURLToPath(import.meta.url), '--guard-only', root], { stdio: 'inherit' });
  const guardianExit = new Promise(done => guardian.once('close', done));
  while (!existsSync(join(root, 'guard.json'))) await new Promise(done => setTimeout(done, 5));
  if (kind === 'phase-timeout') {
    const request = { nonce: json(join(root, 'launch.json')).nonce, ordinal: 1, command: process.execPath,
      args: ['-e', 'process.exit(0)'], cwd: root, env: fixtureEnvironment(), expected: 0,
      deadline: phase(root).deadline, max_seconds: 1 };
    request.env.F03_FRESH_C1_ROOT = root;
    publish(join(root, 'child-1.json'), request);
    const collector = spawn(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), 'supervisor.js'),
      'child', join(root, 'child-1.json'), join(root, 'children/0001')], { stdio: 'inherit' });
    assert.equal(await new Promise(done => collector.once('close', done)), 0);
    const onTime = verifyCaseChild(root, join(root, 'children/0001'), 0);
    assert.equal(onTime.verdict, 'PASS');
    const descendant = spawn(process.execPath, ['-e', 'setInterval(()=>{},1000)'], { detached: true, stdio: 'ignore' });
    publish(join(root, 'grandchild.json'), identity(descendant.pid!));
    publish(join(root, 'readback-start.json'), { at: Date.now() });
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 5000);
    publish(join(root, 'readback-overran.json'), { at: Date.now() });
    process.exitCode = 9;
  } else {
    publish(join(root, 'completion.json'), { verdict: 'PASS', finished_at: Date.now(),
      finished_tick: String(process.hrtime.bigint()),
      verification: 'synthetic-service-only-no-C1', ownership_digest: verifyOwnership(root).digest });
    assert.equal(await guardianExit, 0);
    assert.equal(json(join(root, 'terminal.json')).verdict, 'PASS');
    assert.equal(json(join(root, 'guard-result.json')).verdict, 'PASS');
  }
} else if (process.argv[2] === '--guard-only') {
  await guardCase(process.argv[3]);
} else if (process.argv[2] === '--harmless-fixture') {
  const root = process.argv[3], kind = process.argv[4];
  publish(join(root, 'identity.json'), identity(process.pid));
  if (kind === 'timeout') {
    const grandchild = spawn(process.execPath, ['-e', 'setInterval(()=>{},1000)'], { detached: true, stdio: 'ignore' });
    publish(join(root, 'grandchild.json'), identity(grandchild.pid!));
    await new Promise(() => setInterval(() => {}, 1000));
  }
  await new Promise(done => setTimeout(done, 200));
  if (kind !== 'missing-receipt') publish(join(root, 'receipt.json'), { exit: kind === 'failure' ? 7 : 0 });
  process.exitCode = kind === 'failure' ? 7 : 0;
} else {
  const root = mkdtempSync(join(tmpdir(), 'fresh-c1-service-test-')), results = [];
  for (const kind of ['normal', 'failure', 'timeout', 'missing-receipt']) {
    const directory = join(root, kind), unit = `aleph-fresh-c1-${randomUUID()}`;
    const args = serviceArguments(unit, process.execPath,
      [fileURLToPath(import.meta.url), '--harmless-fixture', directory, kind], directory,
      kind === 'timeout' ? 1 : kind === 'normal' ? 86400 : 10);
    publish(join(directory, 'command.json'), { command: '/usr/bin/systemd-run', args });
    const started = spawnSync('/usr/bin/systemd-run', args, { env: managerEnvironment(), encoding: 'utf8', timeout: 5000 });
    assert.equal(started.status, 0, started.stderr);
    let properties: Record<string, string> = {};
    const deadline = Date.now() + 15000;
    for (;;) {
      properties = inspectService(unit);
      assert.equal(properties.Restart, 'no'); assert.equal(properties.KillMode, 'control-group');
      assert.equal(properties.RemainAfterExit, 'yes');
      if (properties.SubState === 'exited' || properties.ActiveState === 'failed') break;
      assert(Date.now() < deadline, 'HARMLESS_SERVICE_TEST_DEADLINE');
      await new Promise(done => setTimeout(done, 50));
    }
    assert(existsSync(join(directory, 'identity.json')), 'ACTUAL_CHILD_IDENTITY_REQUIRED');
    const receiptExists = existsSync(join(directory, 'receipt.json'));
    if (kind === 'normal') {
      assert.equal(properties.Result, 'success'); assert.equal(properties.ExecMainStatus, '0');
      assert.equal(properties.RuntimeMaxUSec, '1d');
      assert(receiptExists);
    } else if (kind === 'failure') {
      assert.equal(properties.Result, 'exit-code'); assert.equal(properties.ExecMainStatus, '7');
    } else if (kind === 'timeout') {
      assert.equal(properties.Result, 'timeout'); assert(!receiptExists);
      assert(!alive(JSON.parse(readFileSync(join(directory, 'grandchild.json'), 'utf8'))), 'ESCAPED_PROCESS_GROUP_SURVIVED_SERVICE');
    } else {
      assert.equal(properties.Result, 'success'); assert(!receiptExists);
      // Successful process termination alone does not supply an application receipt.
    }
    const result = { kind, unit, properties, receipt_exists: receiptExists,
      identity: JSON.parse(readFileSync(join(directory, 'identity.json'), 'utf8')) };
    publish(join(directory, 'result.json'), result); results.push(result);
    const stopped = spawnSync('/usr/bin/systemctl', ['--user', 'stop', unit],
      { env: managerEnvironment(), encoding: 'utf8', timeout: 5000 });
    assert.equal(stopped.status, 0, stopped.stderr);
    console.log(`PASS actual service ${kind}`);
  }
  for (const kind of ['guard-normal', 'phase-timeout']) {
    const directory = join(root, kind), unit = `aleph-fresh-c1-${randomUUID()}`;
    const tooling = join(directory, 'tooling'), stub = join(tooling, 'qualification/fresh-c1/driver.js');
    mkdirSync(join(tooling, 'qualification/fresh-c1'), { recursive: true });
    // This entry imports only the harmless service fixture, never the long driver.
    writeFileSync(stub, `process.argv = [process.execPath, ${JSON.stringify(fileURLToPath(import.meta.url))}, "--guard-fixture", ${JSON.stringify(directory)}, ${JSON.stringify(kind)}];\nimport(${JSON.stringify(import.meta.url)});\n`);
    const startedAt = Date.now(), startedTick = process.hrtime.bigint();
    const launch = { root: directory, nonce: randomUUID(), unit, node: process.execPath, owner: identity(process.pid),
      boot: bootId(), started_at: startedAt, deadline: startedAt + MAX_SECONDS * 1000, tooling_root: tooling };
    const timedLaunch = { ...launch, started_tick: String(startedTick), deadline_tick: String(startedTick + durationTicks(MAX_SECONDS)) };
    publish(join(directory, 'launch.json'), timedLaunch);
    const hash = (name: string): string => digest(readFileSync(join(directory, name)));
    const binding = { root: directory, nonce: launch.nonce, launch_digest: hash('launch.json') };
    const args = serviceArguments(unit, process.execPath, [stub, 'run', directory], directory, MAX_SECONDS);
    publish(join(directory, 'service-command.json'), { ...binding, command: '/usr/bin/systemd-run', args });
    const started = spawnSync('/usr/bin/systemd-run', args, { env: managerEnvironment(), encoding: 'utf8', timeout: 5000 });
    publish(join(directory, 'service-start.json'), { ...binding, parent: identity(process.pid),
      command_digest: hash('service-command.json'), started_at: startedAt, finished_at: Date.now(),
      status: started.status, signal: started.signal, error: started.error?.message ?? null,
      stdout: started.stdout, stderr: started.stderr });
    assert.equal(started.status, 0, started.stderr);
    const unrelated = spawn(process.execPath, ['-e', 'setInterval(()=>{},1000)'], { stdio: 'ignore' });
    const unrelatedExit = new Promise(done => unrelated.once('close', done));
    try {
      const deadline = Date.now() + 15000;
      while (!existsSync(join(directory, 'guard-result.json'))) {
        assert(Date.now() < deadline, `GUARD_SERVICE_TEST_DEADLINE ${directory}`);
        await new Promise(done => setTimeout(done, 25));
      }
      const result = json(join(directory, 'guard-result.json'));
      assert.equal(result.verdict, kind === 'phase-timeout' ? 'TIMEOUT' : 'PASS');
      assert.equal(json(join(directory, 'terminal.json')).verdict, result.verdict);
      verifyOwnership(directory);
      if (kind === 'phase-timeout') {
        assert.equal(verifyCaseChild(directory, join(directory, 'children/0001'), 0).verdict, 'PASS');
        while (alive(json(join(directory, 'grandchild.json')) as any)) {
          assert(Date.now() < deadline, 'PHASE_TIMEOUT_DESCENDANT_SURVIVED');
          await new Promise(done => setTimeout(done, 25));
        }
        assert(!existsSync(join(directory, 'readback-overran.json')), 'BLOCKED_READBACK_NOT_STOPPED');
      }
      assert(alive(identity(unrelated.pid!)), 'UNRELATED_PROCESS_TERMINATED');
      results.push({ kind, unit, result, scope: 'Harmless ownership/deadline fixture; no C1 driver' });
      console.log(`PASS actual service ${kind}`);
    } finally {
      unrelated.kill('SIGTERM'); await unrelatedExit;
      spawnSync('/usr/bin/systemctl', ['--user', 'stop', unit], { env: managerEnvironment(), encoding: 'utf8', timeout: 5000 });
    }
  }
  publish(join(root, 'result.json'), { result: 'PASS', results, scope: 'Harmless process fixtures only; no C1 driver launch.' });
  console.log(JSON.stringify({ result: 'PASS', evidence: root, controls: results.length }));
}

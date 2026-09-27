#!/usr/bin/env node
/** Local fixture callbacks and real process locks; no genuine worker execution. */
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { sha256Digest, stableJsonBytes, walkRegularFiles, makeTreeOwnerWritable } from '../src/fs.ts';

const mode = process.argv[2];
if (mode === '--lock-child' || mode === '--dispatch-child') {
  const [run, ready, release, rawPath] = process.argv.slice(3);
  function waitForRelease(): void {
    writeFileSync(ready, 'entered\n');
    if (rawPath === 'exit-with-lock') process.exit(86);
    const wait = new Int32Array(new SharedArrayBuffer(4)), until = Date.now() + 600000;
    while (!existsSync(release)) {
      assert(Date.now() < until, 'fixture barrier timed out');
      Atomics.wait(wait, 0, 0, 100);
    }
  }
  const base = join(run, 'control/runtime/bundle/runtime-js/adapters/loa/src');
  if (mode === '--lock-child') {
    const { withOrchestrationLock } = await import(pathToFileURL(join(base, 'orchestration.js')).href);
    withOrchestrationLock(run, waitForRelease);
  } else {
    const seed = JSON.parse(readFileSync(rawPath, 'utf8'));
    const { dispatchPreparedLoaWorker } = await import(pathToFileURL(join(base, 'worker-dispatch.js')).href);
    dispatchPreparedLoaWorker({ workerBundleRoot: seed.work.worker_bundle, returnRoot: seed.work.return_root,
      host: { invokeFreshContext(invocation: any) {
        assert.equal(invocation.inherit_context, false); assert.deepEqual(invocation.writable_paths, []);
        waitForRelease();
        return { receipt: { format: 'aleph-loa-worker-dispatch/v1', call_id: invocation.request.call_id,
          context_id: `CTX-${invocation.request.call_id}`, producer_context_id: invocation.producer_context_id,
          fresh_context: true, inherited_context: false, filesystem: 'bundle-read-only',
          model_identity: invocation.model_identity, simulation: { kind: 'fixture-simulated' } },
        structured_return: JSON.parse(readFileSync(seed.raw_path, 'utf8')) };
      } } });
  }
} else {
  const seedPath = resolve(mode), seedRoot = dirname(seedPath);
  const seed = JSON.parse(readFileSync(seedPath, 'utf8'));
  const s0 = JSON.parse(readFileSync(join(seedRoot, 's0-seed.json'), 'utf8'));
  const dispatchPath = join(seedRoot, 'dispatch-seed.json');
  const dispatch = JSON.parse(readFileSync(dispatchPath, 'utf8'));
  const root = mkdtempSync(join(tmpdir(), 'f03-concurrency-'));
  const run = join(seed.host, 'grimoires/loa/aleph/runs', seed.run_id);
  assert(seed.host.startsWith(join(tmpdir(), 'aleph-orchestration-process-')));
  const ignored = /^control\/(?:orchestration\/lock|ledger-writer\.lock|authority-transactions\.lock|s0-transaction\.lock)(?:\/|\.|$)/u;
  function inventory(path: string) {
    return walkRegularFiles(path).map((f) => ({ path: relative(path, f), mode: statSync(f).mode & 0o777,
      digest: sha256Digest(readFileSync(f)) })).filter((f) => !ignored.test(f.path));
  }
  const original = inventory(run), seeds = [seed, s0, dispatch].map((s) => ({ path: s.run, files: inventory(s.run) }));
  assert.deepEqual(original, seeds[0].files);
  assert.equal(JSON.parse(readFileSync(join(run, 'control/run-state.json'), 'utf8')).full_mode, 'fixture-simulated');
  function restore(from: string): void {
    makeTreeOwnerWritable(run); rmSync(run, { recursive: true }); cpSync(from, run, { recursive: true });
  }
  let attempt = 0;
  function invoke(args: string[], transport = false) {
    const command = transport
      ? [join(run, 'control/runtime/bundle/runtime-js/adapters/loa/src/worker-dispatch.js'), ...args, '--json']
      : [join(seed.host, '.claude/aleph/bin/loa-aleph.mjs'), '--root', seed.host, '--json',
        '--allow-fixture-simulation', ...args];
    const result = spawnSync(process.execPath, command, { encoding: 'utf8',
      env: { ...process.env, ALEPH_FIXTURE_WORK_FAULT: '' } });
    writeFileSync(join(root, `attempt-${++attempt}.json`), JSON.stringify({ command, ...result }, null, 2) + '\n');
    return result;
  }
  let serial = 0;
  const children: Array<{ release: string; done: Promise<number | null> }> = [];
  function child(kind: '--lock-child' | '--dispatch-child', stop = false, immediate = false) {
    const id = ++serial, ready = join(root, `child-${id}-ready`), release = join(root, `child-${id}-release`);
    if (immediate) writeFileSync(release, 'go\n');
    const args = [fileURLToPath(import.meta.url), kind, run, ready, release,
      kind === '--dispatch-child' ? dispatchPath : stop ? 'exit-with-lock' : ''];
    const proc = spawn(process.execPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '', stderr = '';
    proc.stdout.on('data', (b) => { stdout += b; }); proc.stderr.on('data', (b) => { stderr += b; });
    const done = new Promise<number | null>((resolve) => proc.on('close', (code) => {
      writeFileSync(join(root, `child-${id}.json`), JSON.stringify({ args, pid: proc.pid, code, stdout, stderr }) + '\n'); resolve(code);
    }));
    children.push({ release, done });
    return { ready, release, done, id };
  }
  async function entered(c: ReturnType<typeof child>) {
    const until = Date.now() + 600000;
    while (!existsSync(c.ready)) {
      assert(Date.now() < until, `child ${c.id} did not reach its fixture barrier`);
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  async function finish(c: ReturnType<typeof child>) {
    if (!existsSync(c.release)) writeFileSync(c.release, 'go\n');
    assert.equal(await c.done, 0);
  }
  const cases: string[] = [];
  function passed(name: string) {
    cases.push(name); cpSync(run, join(root, `case-${cases.length}-after`), { recursive: true });
    writeFileSync(join(root, 'results.json'), JSON.stringify({ result: 'IN_PROGRESS', root, cases }, null, 2) + '\n');
    console.log(`PASS ${name}`);
  }
  const gate = join(root, 'gate.json'), response = join(root, 'response.json');
  writeFileSync(gate, stableJsonBytes({ gateId: 'GATE-F03-CONCURRENCY', gateType: 'suspected-contamination',
    stage: 'S1', now: new Date().toISOString(), request: { basis: 'Synthetic process-boundary human stop.' } }));
  writeFileSync(response, stableJsonBytes({ gateId: 'GATE-F03-CONCURRENCY', authorityIdentity: 'fixture-simulated-authority',
    decision: 'decline', recordedAt: new Date().toISOString(), simulation: { kind: 'fixture-simulated' },
    response: { basis: 'Synthetic authority response; no acceptance.' } }));
  async function lockedRefusal(args: string[], label: string) {
    const c = child('--lock-child'); await entered(c);
    try {
      const before = inventory(run), result = invoke(args);
      assert.equal(result.status, 1, result.stdout + result.stderr);
      assert.match(result.stdout + result.stderr, /orchestration (?:recovery )?is already active/u);
      assert.deepEqual(inventory(run), before); passed(label);
    } finally { await finish(c); }
  }
  try {
    await lockedRefusal(['resume', seed.run_id], 'live orchestration owner excludes installed resume');
    await lockedRefusal(['--open-gate', gate, seed.run_id], 'live orchestration owner excludes installed human-gate mutation');
    const opened = invoke(['--open-gate', gate, seed.run_id]);
    assert.equal(opened.status, 0, opened.stdout + opened.stderr);
    await lockedRefusal(['--authority-response', response, seed.run_id], 'live orchestration owner excludes installed human response');
    const before = inventory(run), stale = invoke(['resume', seed.run_id]);
    assert.equal(stale.status, 1); assert.match(stale.stdout + stale.stderr, /WORK_CHECKPOINT_STALE/u);
    assert.deepEqual(inventory(run), before); passed('human halt makes previously accepted work stale without canonical writes');
    const declined = invoke(['--authority-response', response, seed.run_id]);
    assert.equal(declined.status, 0, declined.stdout + declined.stderr); passed('human response proceeds after orchestration owner releases');
    restore(s0.run);
    await lockedRefusal(['--authority-response', s0.response, seed.run_id], 'live orchestration owner excludes S0 freeze writer');
    const frozen = invoke(['--authority-response', s0.response, seed.run_id]);
    assert.equal(frozen.status, 0, frozen.stdout + frozen.stderr); passed('S0 freeze proceeds after orchestration owner releases');
    restore(seed.run);
    const dead = child('--lock-child', true); await entered(dead); assert.equal(await dead.done, 86);
    const recovered = invoke(['resume', seed.run_id]);
    assert.equal(recovered.status, 0, recovered.stdout + recovered.stderr);
    const recoveredBytes = inventory(run), repeat = invoke(['resume', seed.run_id]);
    assert.equal(repeat.status, 0); assert.deepEqual(inventory(run), recoveredBytes);
    passed('dead orchestration owner recovers once and repeated installed resume is idempotent');
    restore(dispatch.run);
    const running = child('--dispatch-child'); await entered(running);
    try {
      const before = inventory(run), pending = invoke(['resume', seed.run_id]);
      assert.equal(pending.status, 0, pending.stdout + pending.stderr);
      assert.equal(JSON.parse(pending.stdout).details.work.code, 'DISPATCH_OUTCOME_UNKNOWN');
      assert.deepEqual(inventory(run), before);
      const duplicate = child('--dispatch-child', false, true);
      assert.equal(await duplicate.done, 1); assert(!existsSync(duplicate.ready));
      assert.match(readFileSync(join(root, `child-${duplicate.id}.json`), 'utf8'), /DISPATCH_OUTCOME_UNKNOWN/u);
      assert.deepEqual(inventory(run), before); passed('live fixture dispatch cannot be duplicated or consumed by concurrent resume');
      const halted = invoke(['--open-gate', gate, seed.run_id]);
      assert.equal(halted.status, 0, halted.stdout + halted.stderr);
    } finally { await finish(running); }
    const beforeAcceptance = inventory(run);
    const rejected = invoke(['accept', '--worker-bundle', dispatch.work.worker_bundle, '--return-root', dispatch.work.return_root], true);
    assert.equal(rejected.status, 1); assert.match(rejected.stdout + rejected.stderr, /WORK_CHECKPOINT_STALE/u);
    assert.deepEqual(inventory(run), beforeAcceptance);
    assert(existsSync(join(run, 'control/orchestration/dispatch', `${dispatch.work.call_id}-complete.json`)));
    assert(!existsSync(join(run, 'control/orchestration/accepted', `${dispatch.work.call_id}.json`)));
    passed('human stop during fixture dispatch retains completed evidence but refuses stale acceptance');
    restore(dispatch.run);
    const first = child('--dispatch-child', false, true); assert.equal(await first.done, 0);
    const native = inventory(run), duplicate = child('--dispatch-child', false, true);
    assert.equal(await duplicate.done, 0); assert(!existsSync(duplicate.ready)); assert.deepEqual(inventory(run), native);
    const args = ['accept', '--worker-bundle', dispatch.work.worker_bundle, '--return-root', dispatch.work.return_root];
    const accepted = invoke(args, true); assert.equal(accepted.status, 0, accepted.stdout + accepted.stderr);
    const acceptedBytes = inventory(run); assert.equal(invoke(args, true).status, 0); assert.deepEqual(inventory(run), acceptedBytes);
    assert.equal(invoke(['resume', seed.run_id]).status, 0);
    passed('completed fixture dispatch and acceptance are idempotent and commit through installed resume');
    writeFileSync(join(root, 'results.json'), JSON.stringify({ result: 'PASS', root, cases,
      scope: 'Fixture callbacks and local process/authority locks only; no native provider or semantic acceptance.' }, null, 2) + '\n');
    console.log(JSON.stringify({ result: 'PASS', cases: cases.length, root }));
  } finally {
    for (const c of children) if (!existsSync(c.release)) writeFileSync(c.release, 'go\n');
    await Promise.all(children.map((c) => c.done));
    restore(seed.run); assert.deepEqual(inventory(run), original);
    for (const s of seeds) assert.deepEqual(inventory(s.path), s.files);
    console.error(`retained concurrency evidence: ${root}`);
  }
}

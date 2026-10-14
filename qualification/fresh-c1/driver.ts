import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { chmodSync, closeSync, existsSync, fsyncSync, mkdirSync, openSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { verifyRuntimeSnapshot } from '../../adapters/loa/src/runtime-snapshot.ts';
import { stripFixtureCalibrationInventory } from '../../scripts/compatibility-fixture-source.ts';
import { capture, digest, durableRoot, FAULTS, json, MAX_SECONDS, NODE_DIGEST, NODE_EXECUTABLE, object, OPERATION,
  PRODUCT, publish, safeRelative, syncDirectory, withoutLeases, type Json } from './common.ts';
import { alive, bootId, collectedSpawn, durationTicks, enterPhase, fixtureEnvironment, identity, phase, requireBudget, withinBudget } from './supervisor.ts';
import { verifyMatrix, verifyStartingBasis, type Evidence, type Observation } from './reader.ts';
import { managerEnvironment, recordOwnership, serviceArguments, verifyGuard, verifyOwnership } from './service.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
export const FIXTURE_FLAGS = {
  F03_PACKET: '1', F03_S2_CLOSE: '1', F03_NORMALIZE: 'usable',
  F03_S4: 'successor', F03_KEEP_TEST: '1',
};
export function validateFixtureFlags(env: NodeJS.ProcessEnv): void {
  for (const [key, value] of Object.entries(FIXTURE_FLAGS)) assert.equal(env[key], value, `FIXTURE_PROFILE ${key}`);
  for (const key of Object.keys(env).filter(k => k.startsWith('F03_'))) {
    assert(key in FIXTURE_FLAGS || ['F03_FRESH_C1_ROOT', 'F03_NODE_BINARY'].includes(key), `UNRELATED_CASE_FLAG ${key}`);
  }
  assert(!env.ALEPH_FIXTURE_WORK_FAULT, 'INHERITED_FAULT_FORBIDDEN');
}
export function sourcePaths(paths: string[]): string[] {
  return paths.filter(path => !path.split('/').some(p => p === 'calibration' || p.includes('closed-reference')))
    .map(path => { safeRelative(path); return path; });
}
export function freshRoot(): string | undefined { return process.env.F03_FRESH_C1_ROOT; }
export function fixtureRepository(defaultRoot: string): string {
  const root = freshRoot();
  if (!root) return defaultRoot;
  validateFixtureFlags(process.env);
  return json(join(root, 'source.json')).root;
}
export function fixtureScratch(defaultFactory: () => string): string {
  const root = freshRoot();
  if (!root) return defaultFactory();
  const path = join(root, 'fixture'); mkdirSync(path); return path;
}
export function installedFixture(host: string, bundle: string): void {
  const root = freshRoot(); if (!root) return;
  assert.equal(host, join(root, 'fixture/host'));
  const lock = json(join(bundle, 'bundle.lock.json'));
  assert.equal(lock.core.tree_digest, PRODUCT.core); assert.equal(lock.adapter.tree_digest, PRODUCT.adapter);
  assert.equal(lock.checker_digest, PRODUCT.checker);
  assert.equal(lock.bundle.payload_digest, PRODUCT.payload);
  publish(join(root, 'installed.json'), { host, bundle, lock, lock_digest: digest(readFileSync(join(bundle, 'bundle.lock.json'))),
    files: capture(join(host, '.claude/aleph')) });
}
export function startedFixture(run: string): void {
  const root = freshRoot(); if (!root) return;
  const launch = json(join(root, 'launch.json')), state = json(join(run, 'control/run-state.json'));
  assert.equal(readdirSync(dirname(run)).length, 1, 'EXACTLY_ONE_NEW_RUN');
  verifyRuntimeSnapshot(join(run, 'control/runtime/snapshot.json'), { allowSimulation: true });
  const snapshot = json(join(run, 'control/runtime/snapshot.json'));
  assert.equal(snapshot.node.executable, launch.node);
  assert.equal(snapshot.node.executable_digest, launch.node_digest);
  publish(join(root, 'identity.json'), { run, run_id: state.run_id, pins: state.identity, snapshot });
  enterPhase(root, 'prefix', 17 * 3600, 3 * 3600);
}
export function faultEnvironment(args: string[]): NodeJS.ProcessEnv {
  return freshRoot() && args.includes('resume')
    ? { ...process.env, ALEPH_FIXTURE_WORK_FAULT: `${OPERATION}:derived` } : process.env;
}
function receiptPath(root: string): string {
  const paths = readdirSync(join(root, 'children')).sort();
  assert(paths.length); return `children/${paths.at(-1)}`;
}
/** Called only for the first real C1-derived crash, including its legal S4 prefix. */
export function completeFreshC1(run: string, host: string, node: string, args: string[], firstStatus: number | null): never {
  const root = freshRoot()!; assert(root); assert.equal(firstStatus, 86);
  const initial = json(join(root, 'identity.json'));
  assert.equal(initial.run, run);
  assert.deepEqual(args, [join(host, '.claude/aleph/bin/loa-aleph.mjs'), '--root', host, '--json',
    '--allow-fixture-simulation', 'resume', initial.run_id]);
  const work = readdirSync(join(run, 'control/orchestration/work')).map(name => json(join(run, 'control/orchestration/work', name)))
    .filter(row => row.identity.work.obligation.operation === OPERATION);
  assert.equal(work.length, 1); const id = work[0].work_id;
  const intentPath = `control/orchestration/commits/${id}-intent.json`;
  const journalPath = `control/transactions/TXN-work-${id.slice(5)}.json`;
  const consumedPath = `control/orchestration/commits/${id}-consumed.json`;
  const evidence: Evidence = { format: 'f03-fresh-c1/v1', nonce: json(join(root, 'launch.json')).nonce,
    run, host, work_id: id, pins: initial.pins, prepared: {}, boundaries: [], resumes: [] };
  const observe = (index: number): void => {
    const started = requireBudget(root);
    const observation: Observation = { fault: `${OPERATION}:${FAULTS[index]}`,
      receipt: receiptPath(root), files: withinBudget(root, () => capture(run, join(root, 'objects'))),
      readback_started_at: started, readback_finished_at: started };
    evidence.boundaries.push(observation);
    if (index < 2) {
      assert(!observation.files[journalPath] && !observation.files[consumedPath]);
      assert.equal(Boolean(observation.files[intentPath]), index === 1);
      verifyStartingBasis(id, observation.files, entry => object(join(root, 'objects'), entry));
    }
    if (index === 2) {
      evidence.prepared = json(join(run, journalPath));
      publish(join(root, 'prepared.json'), evidence.prepared);
    }
    if (index >= 2) verifyMatrix(evidence, entry => object(join(root, 'objects'), entry), true);
    observation.readback_finished_at = requireBudget(root);
    publish(join(root, `boundary-${String(index + 1).padStart(2, '0')}.json`),
      { nonce: evidence.nonce, run, work_id: id, ...observation });
    requireBudget(root);
  };
  observe(0);
  enterPhase(root, 'faults', 4 * 3600, 1800);
  for (let index = 1; index < FAULTS.length; index++) {
    const result = collectedSpawn(node, args, { cwd: host, encoding: 'utf8',
      env: { ...process.env, ALEPH_FIXTURE_WORK_FAULT: `${OPERATION}:${FAULTS[index]}` } });
    assert.equal(result.status, 86, result.stderr); observe(index);
  }
  enterPhase(root, 'resumes', 3600, 1800);
  for (let index = 0; index < 2; index++) {
    const env = { ...process.env }; delete env.ALEPH_FIXTURE_WORK_FAULT;
    const result = collectedSpawn(node, args, { cwd: host, encoding: 'utf8', env });
    assert.equal(result.status, 0, result.stderr);
    const started = requireBudget(root);
    const report = JSON.parse(result.stdout);
    assert.equal(report.details.work.kind, 'proposal');
    assert.equal(report.details.work.operation, 'ambiguity.expressions');
    const observation = { fault: null, receipt: receiptPath(root), files: withinBudget(root, () => capture(run, join(root, 'objects'))),
      readback_started_at: started, readback_finished_at: started };
    assert.deepEqual(withoutLeases(observation.files), withoutLeases(evidence.boundaries[10].files));
    evidence.resumes.push(observation);
    observation.readback_finished_at = requireBudget(root);
    publish(join(root, `resume-${index + 1}.json`), { nonce: evidence.nonce, run, ...observation });
  }
  withinBudget(root, () => verifyMatrix(evidence, entry => object(join(root, 'objects'), entry)));
  publish(join(root, 'evidence.json'), evidence);
  enterPhase(root, 'verification', 5400, 5400);
  const verified = collectedSpawn(process.execPath, [join(HERE, 'reader.js'), root, '--verify-before-terminal'],
    { cwd: host, encoding: 'utf8', env: process.env });
  assert.equal(verified.status, 0, verified.stdout + verified.stderr);
  assert.equal(JSON.parse(verified.stdout).verdict, 'PASS');
  requireBudget(root);
  const owner = verifyOwnership(root);
  publish(join(root, 'completion.json'), { verdict: 'PASS', finished_at: requireBudget(root),
    finished_tick: String(process.hrtime.bigint()), verification: receiptPath(root), ownership_digest: owner.digest });
  // The independently scheduled guard owns terminal success as well as timeout.
  const wait = new Int32Array(new SharedArrayBuffer(4));
  while (!existsSync(join(root, 'terminal.json')) || !existsSync(join(root, 'guard-result.json'))) {
    requireBudget(root); assert(alive(verifyGuard(root).identity), 'INTERRUPTED_GUARD_LOST');
    Atomics.wait(wait, 0, 0, 10);
  }
  assert.equal(json(join(root, 'terminal.json')).verdict, 'PASS');
  assert.equal(json(join(root, 'guard-result.json')).verdict, 'PASS');
  process.exit(0);
}
export function sourceFromCommit(repository: string, root: string): string {
  const git = (args: string[]): Buffer => {
    const remaining = existsSync(join(root, 'launch.json')) ? Math.min(json(join(root, 'launch.json')).deadline,
      phase(root).deadline) - Date.now() : 30000;
    assert(remaining > 0, 'SETUP_TIMEOUT');
    const result = spawnSync('/usr/bin/git', args, { cwd: repository, env: fixtureEnvironment(),
      timeout: remaining, killSignal: 'SIGKILL', maxBuffer: 32 * 1024 * 1024 });
    assert.equal(result.status, 0, String(result.stderr)); return result.stdout;
  };
  assert.equal(git(['rev-parse', `${PRODUCT.commit}^{tree}`]).toString().trim(), PRODUCT.tree);
  const tree = git(['ls-tree', '-rz', PRODUCT.commit]).toString().split('\0').filter(Boolean)
    .map(row => { const [metadata, path] = row.split('\t'); return { path, mode: metadata.split(' ')[0] }; });
  const paths = sourcePaths(tree.map(row => row.path));
  const target = join(root, 'product-source'); mkdirSync(target);
  const records = [];
  for (const path of paths) {
    const mode = tree.find(row => row.path === path)!.mode;
    assert(['100644', '100755'].includes(mode), 'SOURCE_SYMLINK_OR_SPECIAL_FILE');
    // Filtered before cat-file: no excluded blob is read or copied.
    const data = git(['cat-file', 'blob', `${PRODUCT.commit}:${path}`]);
    mkdirSync(dirname(join(target, path)), { recursive: true }); writeFileSync(join(target, path), data);
    chmodSync(join(target, path), mode === '100755' ? 0o755 : 0o644);
    records.push({ path, digest: digest(data) });
  }
  stripFixtureCalibrationInventory(target);
  for (const args of [['init', '-q'], ['add', '--all'],
    ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'Synthetic pinned qualification source']]) {
    const result = spawnSync('/usr/bin/git', ['-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', ...args],
      { cwd: target, env: fixtureEnvironment(), timeout: 30000, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  }
  publish(join(root, 'source.json'), { root: target, product: PRODUCT, files: records }); return target;
}
export function freezeTooling(source: string, target: string): void {
  const inventory = capture(source); mkdirSync(target);
  for (const [path, record] of Object.entries(inventory)) {
    const data = readFileSync(join(source, path)); assert.equal(digest(data), record.digest);
    mkdirSync(dirname(join(target, path)), { recursive: true });
    const fd = openSync(join(target, path), 'wx', 0o400);
    try { writeFileSync(fd, data); fsyncSync(fd); } finally { closeSync(fd); }
    syncDirectory(dirname(join(target, path)));
  }
  if (!existsSync(join(target, 'package.json'))) publish(join(target, 'package.json'), { type: 'module' });
  syncDirectory(target); syncDirectory(dirname(target));
}
async function main(): Promise<void> {
  const [action, argument, permit] = process.argv.slice(2);
  if (action === 'launch') {
    assert.equal(permit, '--execute-c1', 'EXPLICIT_LONG_CASE_EXECUTION_REQUIRED');
    const config = json(resolve(argument)), root = durableRoot(config.root);
    assert.deepEqual(Object.keys(config).sort(), ['node', 'node_digest', 'product_commit', 'repository', 'root']);
    assert.equal(config.product_commit, PRODUCT.commit);
    assert.equal(config.node, NODE_EXECUTABLE, 'PINNED_NODE_PATH_REQUIRED');
    assert.equal(config.node_digest, NODE_DIGEST, 'PINNED_NODE_REQUIRED');
    assert.equal(digest(readFileSync(config.node)), config.node_digest);
    assert.equal(process.execPath, config.node, 'LAUNCH_WITH_PINNED_NODE');
    assert.match(spawnSync(config.node, ['--version'], { encoding: 'utf8' }).stdout, /^v20\./);
    assert(fileURLToPath(import.meta.url).endsWith('.js'), 'BUILD_NODE20_TOOLS_FIRST');
    const unit = `aleph-fresh-c1-${randomUUID()}`;
    mkdirSync(root); for (const name of ['children', 'phases', 'objects']) mkdirSync(join(root, name));
    const tooling = join(root, 'tooling');
    freezeTooling(resolve(HERE, '../..'), tooling);
    const started = Date.now(), startedTick = process.hrtime.bigint();
    publish(join(root, 'launch.json'), { ...config, unit, nonce: randomUUID(), boot: bootId(),
      started_at: started, deadline: started + MAX_SECONDS * 1000, owner: identity(process.pid),
      started_tick: String(startedTick), deadline_tick: String(startedTick + durationTicks(MAX_SECONDS)),
      tooling_root: tooling, tooling: capture(tooling) });
    const command = serviceArguments(unit, process.execPath,
      [join(tooling, 'qualification/fresh-c1/driver.js'), 'run', root], root, MAX_SECONDS);
    const binding = { root, nonce: json(join(root, 'launch.json')).nonce,
      launch_digest: digest(readFileSync(join(root, 'launch.json'))) };
    publish(join(root, 'service-command.json'), { ...binding, command: '/usr/bin/systemd-run', args: command });
    const serviceStarted = Date.now();
    const result = spawnSync('/usr/bin/systemd-run', command, { env: managerEnvironment(), encoding: 'utf8' });
    publish(join(root, 'service-start.json'), { ...binding, parent: identity(process.pid),
      command_digest: digest(readFileSync(join(root, 'service-command.json'))),
      started_at: serviceStarted, finished_at: Date.now(), status: result.status, signal: result.signal,
      error: result.error?.message ?? null, stdout: result.stdout, stderr: result.stderr });
    assert.equal(result.status, 0, result.stderr);
    console.log(JSON.stringify({ result: 'STARTED', root, unit, deadline: started + MAX_SECONDS * 1000 }));
  } else if (action === 'run') {
    const root = resolve(argument), launch = json(join(root, 'launch.json'));
    assert.equal(launch.boot, bootId()); assert(Date.now() < launch.deadline);
    assert.equal(launch.node_digest, NODE_DIGEST);
    const startBy = Math.min(launch.deadline, Date.now() + 10000);
    while (!existsSync(join(root, 'service-start.json'))) {
      assert(Date.now() < startBy, 'SERVICE_START_RECEIPT_MISSING');
      await new Promise(done => setTimeout(done, 10));
    }
    recordOwnership(root);
    assert.equal(digest(readFileSync(launch.node)), launch.node_digest);
    assert.deepEqual(capture(launch.tooling_root), launch.tooling, 'TOOLING_CHANGED');
    enterPhase(root, 'setup', 1800, 1800);
    const guard = spawn(process.execPath, [join(HERE, 'service.js'), 'guard', root],
      { env: fixtureEnvironment(), stdio: ['ignore', 'inherit', 'inherit'] });
    const guardBy = Math.min(phase(root).deadline, Date.now() + 10000);
    while (!existsSync(join(root, 'guard.json'))) {
      assert(Date.now() < guardBy && guard.exitCode === null, 'PHASE_GUARD_NOT_STARTED');
      await new Promise(done => setTimeout(done, 10));
    }
    verifyGuard(root);
    try {
      sourceFromCommit(launch.repository, root);
      for (const key of Object.keys(process.env)) if (key.startsWith('F03_') || key.startsWith('ALEPH_')) delete process.env[key];
      Object.assign(process.env, FIXTURE_FLAGS, { F03_FRESH_C1_ROOT: root, F03_NODE_BINARY: launch.node });
      await import(pathToFileURL(join(HERE, '../../adapters/loa/tests/test-orchestration-process.js')).href);
      throw Error('FOCUSED_DRIVER_DID_NOT_REACH_C1');
    } catch (error) {
      const verdict = bootId() !== launch.boot || String(error).includes('INTERRUPTED') ? 'INTERRUPTED'
        : Date.now() >= Math.min(launch.deadline, phase(root).deadline) || String(error).includes('TIMEOUT') ? 'TIMEOUT' : 'FAIL';
      if (!existsSync(join(root, 'terminal.json'))) publish(join(root, 'terminal.json'), { verdict, finished_at: Date.now(), error: String(error) });
      throw error;
    }
  } else console.log('Usage: driver.js launch <config.json> --execute-c1 (LONG RUN); reader.js <case-root> (read only)');
}
if (resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) await main();

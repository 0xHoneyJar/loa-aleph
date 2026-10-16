import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { capture, digest, durableRoot, json, MAX_SECONDS, NODE_DIGEST, NODE_EXECUTABLE, PRODUCT, publish } from './common.ts';
import { bootId, durationTicks, enterPhase, fixtureEnvironment, identity, phase } from './supervisor.ts';
import { managerEnvironment, recordOwnership, serviceArguments, verifyGuard } from './service.ts';
import { FIXTURE_FLAGS, FixtureBootstrapBoundary, freezeTooling, sourceFromCommit } from './fixture-support.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const fixtureUrl = pathToFileURL(join(HERE, '../../adapters/loa/tests/test-orchestration-process.js')).href;
// Both entry modes load the actual fixture at this one fixed URL.
async function loadFixture() { return import(fixtureUrl); }

async function main(): Promise<void> {
  const [action, argument, permit] = process.argv.slice(2);
  if (action === 'bootstrap-check') {
    assert.equal(process.argv.length, 3, 'BOOTSTRAP_ARGUMENTS');
    assert(!Object.keys(process.env).some(key => key.startsWith('F03_') || key.startsWith('ALEPH_')), 'BOOTSTRAP_ENVIRONMENT');
    try { await loadFixture(); } catch (error) {
      if (!(error instanceof FixtureBootstrapBoundary)) throw error;
      console.log(JSON.stringify({ result: 'BOOTSTRAP_READY', boundary: 'before-fixture-scratch',
        fixture: fixtureUrl, node: process.version, qualification: 'NOT_RUN' }));
      return;
    }
    throw Error('BOOTSTRAP_BOUNDARY_NOT_REACHED');
  } else if (action === 'launch') {
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
      await loadFixture();
      throw Error('FOCUSED_DRIVER_DID_NOT_REACH_C1');
    } catch (error) {
      const verdict = bootId() !== launch.boot || String(error).includes('INTERRUPTED') ? 'INTERRUPTED'
        : Date.now() >= Math.min(launch.deadline, phase(root).deadline) || String(error).includes('TIMEOUT') ? 'TIMEOUT' : 'FAIL';
      if (!existsSync(join(root, 'terminal.json'))) publish(join(root, 'terminal.json'), { verdict, finished_at: Date.now(), error: String(error) });
      throw error;
    }
  } else console.log('Usage: driver.js bootstrap-check (no fixture); driver.js launch <config.json> --execute-c1 (LONG RUN); reader.js <case-root> (read only)');
}
if (resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) await main();

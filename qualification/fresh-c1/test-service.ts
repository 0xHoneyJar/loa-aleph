import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publish } from './common.ts';
import { alive, identity } from './supervisor.ts';
import { inspectService, managerEnvironment, serviceArguments } from './service.ts';

if (process.argv[2] === '--harmless-fixture') {
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
  publish(join(root, 'result.json'), { result: 'PASS', results, scope: 'Harmless process fixtures only; no C1 driver launch.' });
  console.log(JSON.stringify({ result: 'PASS', evidence: root, controls: results.length }));
}

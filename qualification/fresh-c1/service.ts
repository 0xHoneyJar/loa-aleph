import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, lstatSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';
import { alive, bootId, durationTicks, fixtureEnvironment, identity, phase, requireBudget, tick, verifyPhases, type Identity } from './supervisor.ts';
import { bytes, digest, json, MAX_SECONDS, publish, type Json } from './common.ts';

export function managerEnvironment(): NodeJS.ProcessEnv {
  return { ...fixtureEnvironment(), XDG_RUNTIME_DIR: `/run/user/${process.getuid!()}`,
    DBUS_SESSION_BUS_ADDRESS: `unix:path=/run/user/${process.getuid!()}/bus` };
}
export function serviceArguments(unit: string, command: string, args: string[], root: string, seconds: number): string[] {
  assert(/^aleph-fresh-c1-[a-f0-9-]+$/.test(unit));
  assert(seconds > 0 && seconds <= MAX_SECONDS, 'SERVICE_DEADLINE_LIMIT');
  return ['--user', `--unit=${unit}`, '--service-type=exec',
    '--property=Restart=no', '--property=RemainAfterExit=yes',
    `--property=RuntimeMaxSec=${seconds}`, '--property=KillMode=control-group',
    '--property=TimeoutStopSec=10', '--property=SendSIGKILL=yes',
    `--property=StandardOutput=append:${join(root, 'driver.stdout')}`,
    `--property=StandardError=append:${join(root, 'driver.stderr')}`, command, ...args];
}
export function inspectService(unit: string): Record<string, string> {
  assert(/^aleph-fresh-c1-[a-f0-9-]+$/.test(unit));
  const result = spawnSync('/usr/bin/systemctl', ['--user', 'show', unit,
    '--property=MainPID', '--property=Restart', '--property=RuntimeMaxUSec', '--property=KillMode',
    '--property=ControlGroup', '--property=Result', '--property=ExecMainCode', '--property=ExecMainStatus',
    '--property=ActiveState', '--property=SubState', '--property=RemainAfterExit',
    '--property=InvocationID', '--property=Id', '--property=ExecMainPID'],
    { encoding: 'utf8', env: managerEnvironment(), timeout: 5000 });
  assert.equal(result.status, 0, result.stderr);
  return Object.fromEntries(result.stdout.trim().split('\n').map(line => {
    const split = line.indexOf('='); return [line.slice(0, split), line.slice(split + 1)];
  }));
}
function retained(root: string, name: string): { value: Json; digest: string } {
  const path = join(root, name), stat = lstatSync(path);
  assert(stat.isFile() && !stat.isSymbolicLink() && !(stat.mode & 0o222), `OWNERSHIP_CUSTODY ${name}`);
  return { value: json(path), digest: digest(readFileSync(path)) };
}
function processIdentity(value: Identity): void {
  assert(value && typeof value === 'object', 'OWNERSHIP_IDENTITY');
  for (const n of [value.pid, value.ppid, value.pgid, value.sid]) assert(Number.isSafeInteger(n) && n > 0, 'OWNERSHIP_PID');
  assert.match(value.start_ticks, /^\d+$/); assert(BigInt(value.start_ticks) > 0n);
  assert.match(value.boot, /^[a-f0-9-]{36}$/);
  assert.match(value.pid_namespace, /^pid:\[\d+\]$/);
  assert(value.executable.startsWith('/'));
}
/** Authenticates retained ownership, including after exit/reboot; no PID liveness inference. */
export function verifyOwnership(root: string): { driver: Json; driver_digest: string; digest: string } {
  const launch = retained(root, 'launch.json'), command = retained(root, 'service-command.json');
  const start = retained(root, 'service-start.json'), service = retained(root, 'supervision.json');
  const driver = retained(root, 'driver.json');
  const l = launch.value, s = service.value, d = driver.value;
  assert.equal(l.root, root); assert.equal(l.deadline - l.started_at, MAX_SECONDS * 1000);
  assert.equal(tick(l.deadline_tick) - tick(l.started_tick), durationTicks(MAX_SECONDS));
  assert(typeof l.nonce === 'string' && l.nonce.length > 0);
  for (const n of [l.started_at, l.deadline, d.at, start.value.started_at, start.value.finished_at]) {
    assert(Number.isSafeInteger(n) && n > 0, 'OWNERSHIP_TIME');
  }
  processIdentity(l.owner); processIdentity(d.identity);
  assert.equal(l.owner.boot, l.boot); assert.equal(d.identity.boot, l.boot);
  assert.equal(d.identity.executable, l.node);
  assert.equal(l.owner.executable, l.node);
  assert.equal(d.identity.pid_namespace, l.owner.pid_namespace);
  const binding = { root, nonce: l.nonce, launch_digest: launch.digest };
  for (const record of [command.value, start.value, s, d]) {
    for (const [key, value] of Object.entries(binding)) assert.equal(record[key], value, `OWNERSHIP_BINDING ${key}`);
  }
  assert.equal(command.value.command, '/usr/bin/systemd-run');
  assert.deepEqual(command.value.args, serviceArguments(l.unit, l.node,
    [join(l.tooling_root, 'qualification/fresh-c1/driver.js'), 'run', root], root, MAX_SECONDS), 'SERVICE_COMMAND_CHANGED');
  assert.equal(start.value.command_digest, command.digest);
  assert.deepEqual(start.value.parent, l.owner);
  assert.equal(start.value.status, 0); assert.equal(start.value.signal, null); assert.equal(start.value.error, null);
  assert(typeof start.value.stdout === 'string' && typeof start.value.stderr === 'string');
  assert(start.value.started_at >= l.started_at && start.value.finished_at >= start.value.started_at);
  assert(d.at >= start.value.finished_at && d.at < l.deadline);
  assert.equal(s.command_digest, command.digest); assert.equal(s.start_digest, start.digest);
  assert.equal(d.supervision_digest, service.digest);
  assert.deepEqual(s.identity, d.identity); assert.equal(s.boot, l.boot); assert.equal(s.pid, d.identity.pid);
  const p = s.properties;
  assert.equal(p.Id, `${l.unit}.service`);
  assert.match(p.InvocationID, /^[a-f0-9]{32}$/); assert.equal(d.invocation_id, p.InvocationID);
  assert.equal(s.invocation_id, p.InvocationID);
  assert.equal(p.MainPID, String(d.identity.pid)); assert.equal(p.ExecMainPID, String(d.identity.pid));
  assert.equal(p.Restart, 'no'); assert.equal(p.KillMode, 'control-group');
  assert.equal(p.RuntimeMaxUSec, '1d'); assert.equal(p.RemainAfterExit, 'yes');
  assert.equal(p.ActiveState, 'active'); assert.equal(p.SubState, 'running');
  assert(p.ControlGroup.startsWith('/') && p.ControlGroup.endsWith(`/${l.unit}.service`));
  assert.equal(s.cgroup, `0::${p.ControlGroup}\n`, 'SERVICE_CGROUP_IDENTITY');
  const records = { launch: launch.digest, command: command.digest, start: start.digest,
    service: service.digest, driver: driver.digest };
  return { driver: d, driver_digest: driver.digest, digest: digest(bytes(records)) };
}
export function recordOwnership(root: string): void {
  const launch = json(join(root, 'launch.json')), properties = inspectService(launch.unit);
  const current = identity(process.pid), cgroup = readFileSync('/proc/self/cgroup', 'utf8');
  assert.equal(properties.MainPID, String(current.pid), 'INDEPENDENT_SUPERVISOR_REQUIRED');
  const binding = { root, nonce: launch.nonce, launch_digest: digest(readFileSync(join(root, 'launch.json'))) };
  publish(join(root, 'supervision.json'), { ...binding, properties, boot: bootId(), pid: current.pid,
    identity: current, invocation_id: process.env.INVOCATION_ID, cgroup,
    command_digest: digest(readFileSync(join(root, 'service-command.json'))),
    start_digest: digest(readFileSync(join(root, 'service-start.json'))) });
  publish(join(root, 'driver.json'), { ...binding, identity: current, at: Date.now(),
    invocation_id: process.env.INVOCATION_ID, supervision_digest: digest(readFileSync(join(root, 'supervision.json'))) });
  verifyOwnership(root);
}
export function verifyGuard(root: string): Json {
  const owner = verifyOwnership(root), record = retained(root, 'guard.json').value;
  assert.equal(record.ownership_digest, owner.digest);
  processIdentity(record.identity); assert.deepEqual(record.parent, owner.driver.identity);
  assert.equal(record.identity.ppid, owner.driver.identity.pid);
  assert.equal(record.identity.boot, owner.driver.identity.boot);
  assert.equal(record.identity.pid_namespace, owner.driver.identity.pid_namespace);
  assert.equal(record.identity.executable, owner.driver.identity.executable);
  assert(record.at >= owner.driver.at && record.at < json(join(root, 'launch.json')).deadline);
  return record;
}
/** Independently scheduled inside the existing service: synchronous driver readback cannot block it. */
export async function guardCase(root: string): Promise<void> {
  const launch = json(join(root, 'launch.json')), owner = verifyOwnership(root);
  const wall = Date.now(), monotonic = performance.now();
  const now = (): number => Math.max(Date.now(), Math.ceil(wall + performance.now() - monotonic));
  assert.deepEqual(identity(process.ppid), owner.driver.identity, 'GUARD_PARENT');
  publish(join(root, 'guard.json'), { ownership_digest: owner.digest, identity: identity(process.pid),
    parent: identity(process.ppid), at: Date.now() });
  let verdict = 'FAIL', reason = '';
  for (;;) {
    if (existsSync(join(root, 'terminal.json'))) {
      const terminal = json(join(root, 'terminal.json'));
      verdict = terminal.verdict;
      if (verdict === 'PASS') {
        assert.equal(terminal.ownership_digest, owner.digest);
        assert(terminal.finished_at < Math.min(phase(root).deadline, launch.deadline), 'TIMEOUT_TERMINAL');
      }
      publish(join(root, 'guard-result.json'), { verdict, ownership_digest: owner.digest,
        guard_digest: digest(readFileSync(join(root, 'guard.json'))),
        terminal_digest: digest(readFileSync(join(root, 'terminal.json'))), at: Date.now() });
      return;
    }
    if (bootId() !== launch.boot || !alive(owner.driver.identity)) { verdict = 'INTERRUPTED'; reason = 'OWNER_LOST'; break; }
    try {
      requireBudget(root, now());
      if (existsSync(join(root, 'completion.json'))) {
        const completion = retained(root, 'completion.json');
        assert.equal(completion.value.verdict, 'PASS');
        assert.equal(completion.value.ownership_digest, owner.digest);
        verifyPhases(root, completion.value.finished_at, completion.value.finished_tick);
        publish(join(root, 'guard-result.json'), { verdict: 'PASS', ownership_digest: owner.digest,
          guard_digest: digest(readFileSync(join(root, 'guard.json'))), completion_digest: completion.digest,
          at: requireBudget(root, now()) });
        // Final PASS is published only after durable guard readback and another deadline check.
        const finished = requireBudget(root, now());
        publish(join(root, 'terminal.json'), { ...completion.value, finished_at: finished,
          finished_tick: String(process.hrtime.bigint()),
          completion_digest: completion.digest, guard_result_digest: digest(readFileSync(join(root, 'guard-result.json'))) });
        return;
      }
    } catch (error) {
      reason = String(error); verdict = reason.includes('INTERRUPTED') ? 'INTERRUPTED'
        : reason.includes('TIMEOUT') ? 'TIMEOUT' : 'FAIL'; break;
    }
    await new Promise(done => setTimeout(done, 25));
  }
  const result = { verdict, reason, finished_at: Date.now(), ownership_digest: owner.digest };
  if (!existsSync(join(root, 'terminal.json'))) publish(join(root, 'terminal.json'), result);
  if (!existsSync(join(root, 'guard-result.json'))) publish(join(root, 'guard-result.json'), {
    ...result, guard_digest: digest(readFileSync(join(root, 'guard.json'))),
    terminal_digest: digest(readFileSync(join(root, 'terminal.json'))) });
  // Reauthenticate the live service invocation before addressing its control group.
  // A reboot or lost owner is evidence loss, never permission to signal a reused PID/unit.
  if (bootId() === launch.boot && alive(owner.driver.identity)) {
    const properties = inspectService(launch.unit);
    assert.equal(properties.InvocationID, owner.driver.invocation_id);
    assert.equal(properties.MainPID, String(owner.driver.identity.pid));
    assert.equal(properties.ControlGroup, json(join(root, 'supervision.json')).properties.ControlGroup);
    publish(join(root, 'termination.json'), { ownership_digest: owner.digest, identity: identity(owner.driver.identity.pid),
      properties, command: '/usr/bin/systemctl', args: ['--user', '--no-block', 'stop', launch.unit], at: Date.now() });
    spawnSync('/usr/bin/systemctl', ['--user', '--no-block', 'stop', launch.unit],
      { env: managerEnvironment(), encoding: 'utf8', timeout: 5000 });
  }
}
if (resolve(process.argv[1] || '') === fileURLToPath(import.meta.url) && process.argv[2] === 'guard') {
  await guardCase(resolve(process.argv[3]));
}

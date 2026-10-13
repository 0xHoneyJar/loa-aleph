import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fixtureEnvironment } from './supervisor.ts';
import { MAX_SECONDS } from './common.ts';

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
    '--property=ActiveState', '--property=SubState', '--property=RemainAfterExit'],
    { encoding: 'utf8', env: managerEnvironment(), timeout: 5000 });
  assert.equal(result.status, 0, result.stderr);
  return Object.fromEntries(result.stdout.trim().split('\n').map(line => {
    const split = line.indexOf('='); return [line.slice(0, split), line.slice(split + 1)];
  }));
}

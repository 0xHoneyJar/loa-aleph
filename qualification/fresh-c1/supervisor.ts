import assert from 'node:assert/strict';
import { spawn, spawnSync as nativeSpawn, type SpawnSyncOptionsWithStringEncoding } from 'node:child_process';
import { closeSync, existsSync, fsyncSync, openSync, readFileSync, readlinkSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';
import { capture, digest, json, MAX_SECONDS, publish, type Json, type Verdict } from './common.ts';

export const bootId = (): string => readFileSync('/proc/sys/kernel/random/boot_id', 'utf8').trim();
export interface Identity {
  pid: number; ppid: number; pgid: number; sid: number; start_ticks: string;
  boot: string; pid_namespace: string; executable: string;
}
export function identity(pid: number): Identity {
  const root = `/proc/${pid}`, stat = readFileSync(`${root}/stat`, 'utf8');
  const fields = stat.slice(stat.lastIndexOf(')') + 2).split(' ');
  return { pid, ppid: Number(fields[1]), pgid: Number(fields[2]), sid: Number(fields[3]),
    start_ticks: fields[19], boot: bootId(), pid_namespace: readlinkSync(`${root}/ns/pid`),
    executable: readlinkSync(`${root}/exe`) };
}
export function alive(expected: Identity): boolean {
  try {
    const stat = readFileSync(`/proc/${expected.pid}/stat`, 'utf8');
    if (stat.slice(stat.lastIndexOf(')') + 2).startsWith('Z ')) return false;
    const current = identity(expected.pid);
    return current.boot === expected.boot && current.start_ticks === expected.start_ticks
      && current.pid_namespace === expected.pid_namespace;
  } catch { return false; }
}
export interface ChildRequest {
  nonce: string; ordinal: number; command: string; args: string[]; cwd: string;
  env: Record<string, string>; expected: number | number[]; deadline: number; max_seconds: number;
}
export interface ChildReceipt extends ChildRequest {
  format: 'f03-child/v1'; parent: Identity; child: Identity; executable_digest: string;
  started_at: number; finished_at: number; elapsed_ms: number; status: number | null;
  signal: string | null; verdict: Verdict; stdout: string; stderr: string;
  stdout_digest: string; stderr_digest: string; error: string | null;
}
/** A stopped exec trampoline makes even an immediately exiting target identifiable.
 * The shell exec preserves PID/start ticks; target bytes and argv are pinned before release. */
export async function supervise(request: ChildRequest, out: string): Promise<ChildReceipt> {
  assert(request.max_seconds > 0 && request.max_seconds <= MAX_SECONDS);
  assert(request.deadline > Date.now() && request.deadline <= Date.now() + MAX_SECONDS * 1000);
  assert(resolve(request.command) === request.command && request.args.every(x => typeof x === 'string'));
  const executableDigest = digest(readFileSync(request.command));
  publish(join(out, 'request.json'), request);
  const stdoutPath = join(out, 'stdout.bin'), stderrPath = join(out, 'stderr.bin');
  const stdout = openSync(stdoutPath, 'wx', 0o600), stderr = openSync(stderrPath, 'wx', 0o600);
  const started = Date.now(), monotonic = performance.now();
  const child = spawn('/usr/bin/bash', ['--noprofile', '--norc', '-c', 'kill -STOP $$; exec "$@"',
    'f03-exec', request.command, ...request.args], {
    cwd: request.cwd, env: request.env, detached: true, stdio: ['ignore', stdout, stderr],
  });
  let code: number | null = null, signal: string | null = null, error: string | null = null;
  let timedOut = false, interrupted = false, observed = false;
  let childIdentity: Identity | null = null;
  let hardKill: ReturnType<typeof setTimeout> | undefined;
  const finish = new Promise<void>(done => {
    child.once('error', e => { error = e.message; });
    child.once('close', (value, sig) => { code = value; signal = sig; observed = true; done(); });
  });
  const stop = (timeout: boolean): void => {
    timedOut ||= timeout; interrupted ||= !timeout;
    if (childIdentity && alive(childIdentity)) {
      assert.equal(identity(childIdentity.pid).pgid, childIdentity.pid);
      process.kill(-childIdentity.pid, 'SIGTERM');
      // A stopped trampoline needs CONT to process TERM; the released target is unaffected.
      process.kill(childIdentity.pid, 'SIGCONT');
      hardKill = setTimeout(() => {
        if (childIdentity && alive(childIdentity)) process.kill(-childIdentity.pid, 'SIGKILL');
      }, 1000);
    }
  };
  const onSignal = (): void => stop(false);
  process.once('SIGTERM', onSignal); process.once('SIGINT', onSignal);
  const timer = setTimeout(() => stop(true),
    Math.min(request.max_seconds * 1000, request.deadline - started));
  const flush = setInterval(() => { fsyncSync(stdout); fsyncSync(stderr); }, 1000);
  try {
    const readyBy = performance.now() + 5000;
    while (!observed && performance.now() < readyBy) {
      if (child.pid) {
        try {
          const stat = readFileSync(`/proc/${child.pid}/stat`, 'utf8');
          if (stat.slice(stat.lastIndexOf(')') + 2).startsWith('T ')) {
            childIdentity = identity(child.pid); break;
          }
        } catch { /* A genuine close is handled below, never inferred as success. */ }
      }
      await new Promise(done => setTimeout(done, 5));
    }
    assert(childIdentity, 'CHILD_IDENTITY_NOT_OBSERVED');
    assert.equal(childIdentity.pgid, child.pid);
    assert.equal(childIdentity.sid, child.pid);
    publish(join(out, 'process.json'), { parent: identity(process.pid), child: childIdentity,
      executable_digest: executableDigest, requested_executable: request.command,
      exec_trampoline: '/usr/bin/bash', target_released: false });
    assert.equal(digest(readFileSync(request.command)), executableDigest);
    if (timedOut || interrupted) stop(timedOut);
    else process.kill(childIdentity.pid, 'SIGCONT');
    await finish;
  } catch (e) {
    error = String(e); stop(false);
    if (!childIdentity) child.kill('SIGKILL');
    await finish;
  } finally {
    clearTimeout(timer); clearInterval(flush); if (hardKill) clearTimeout(hardKill);
    process.removeListener('SIGTERM', onSignal); process.removeListener('SIGINT', onSignal);
    fsyncSync(stdout); fsyncSync(stderr); closeSync(stdout); closeSync(stderr);
  }
  assert(childIdentity && observed, 'CHILD_CUSTODY_LOST_NO_EXIT_RECEIPT');
  const receipt: ChildReceipt = { ...request, format: 'f03-child/v1',
    parent: identity(process.pid), child: childIdentity, executable_digest: executableDigest,
    started_at: started, finished_at: Date.now(), elapsed_ms: performance.now() - monotonic,
    status: code, signal, verdict: timedOut ? 'TIMEOUT' : interrupted || childIdentity.boot !== bootId()
      ? 'INTERRUPTED' : !error && signal === null
        && (Array.isArray(request.expected) ? request.expected.includes(code!) : code === request.expected) ? 'PASS' : 'FAIL',
    stdout: stdoutPath, stderr: stderrPath, stdout_digest: digest(readFileSync(stdoutPath)),
    stderr_digest: digest(readFileSync(stderrPath)), error };
  publish(join(out, 'result.json'), receipt);
  return receipt;
}
export function verifyChild(out: string, nonce: string, expected: number): ChildReceipt {
  const request = json(join(out, 'request.json')), result = json(join(out, 'result.json')) as ChildReceipt;
  for (const [key, value] of Object.entries(request)) assert.deepEqual(result[key as keyof ChildReceipt], value, `CHILD_REQUEST ${key}`);
  assert.equal(result.format, 'f03-child/v1'); assert.equal(result.nonce, nonce);
  assert(Array.isArray(result.expected) ? result.expected.includes(expected) : result.expected === expected);
  const processRecord = json(join(out, 'process.json'));
  assert.deepEqual(result.child, processRecord.child);
  assert.deepEqual(result.parent, processRecord.parent);
  assert.equal(result.executable_digest, processRecord.executable_digest);
  assert.equal(result.child.boot, result.parent.boot);
  assert.equal(result.child.ppid, result.parent.pid);
  assert.equal(result.child.pgid, result.child.pid);
  assert.equal(result.child.sid, result.child.pid);
  assert(result.finished_at >= result.started_at && result.elapsed_ms >= 0);
  assert.equal(result.stdout, join(out, 'stdout.bin')); assert.equal(result.stderr, join(out, 'stderr.bin'));
  assert.equal(digest(readFileSync(result.stdout)), result.stdout_digest);
  assert.equal(digest(readFileSync(result.stderr)), result.stderr_digest);
  if (result.verdict === 'PASS') {
    assert.equal(result.status, expected); assert.equal(result.signal, null); assert.equal(result.error, null);
    assert(result.finished_at <= result.deadline, 'CHILD_PAST_DEADLINE');
    assert(result.elapsed_ms <= result.max_seconds * 1000 + 100, 'CHILD_PAST_LIMIT');
  }
  return result;
}
export function disposition(root: string): Verdict {
  if (!existsSync(root)) return 'NOT_RUN';
  if (!existsSync(join(root, 'launch.json'))) return 'FAIL';
  const launch = json(join(root, 'launch.json'));
  if (existsSync(join(root, 'terminal.json'))) {
    const verdict = json(join(root, 'terminal.json')).verdict;
    return ['PASS', 'FAIL', 'TIMEOUT', 'INTERRUPTED'].includes(verdict) ? verdict : 'FAIL';
  }
  if (launch.boot !== bootId()) return 'INTERRUPTED';
  if (Date.now() >= launch.deadline) return 'TIMEOUT';
  if (!existsSync(join(root, 'driver.json'))) return 'INTERRUPTED';
  return alive(json(join(root, 'driver.json')).identity) ? 'RUNNING' : 'INTERRUPTED';
}
export function fixtureEnvironment(input: NodeJS.ProcessEnv = {}): Record<string, string> {
  const result: Record<string, string> = { PATH: '/usr/bin:/bin', HOME: homedir(), LANG: 'C.UTF-8', TZ: 'UTC' };
  result.GIT_CONFIG_NOSYSTEM = '1'; result.GIT_CONFIG_GLOBAL = '/dev/null';
  for (const key of ['F03_FRESH_C1_ROOT', 'F03_NODE_BINARY', 'F03_PACKET', 'F03_S2_CLOSE',
    'F03_NORMALIZE', 'F03_S4', 'F03_KEEP_TEST', 'ALEPH_FIXTURE_WORK_FAULT']) {
    if (input[key] !== undefined) result[key] = input[key];
  }
  return result;
}
export function phase(root: string): Json {
  const directory = join(root, 'phases'), names = readdirSync(directory).sort();
  assert(names.length); return json(join(directory, names.at(-1)!));
}
export function enterPhase(root: string, name: string, seconds: number, childSeconds: number): void {
  const directory = join(root, 'phases'), ordinal = readdirSync(directory).length + 1;
  const now = Date.now();
  publish(join(directory, `${ordinal}-${name}.json`), {
    name, started_at: now, deadline: Math.min(json(join(root, 'launch.json')).deadline, now + seconds * 1000),
    child_seconds: childSeconds,
  });
}
/** Synchronous fixture adapter; the independently scheduled collector owns the timer. */
export function collectedSpawn(command: string, args: string[], options: SpawnSyncOptionsWithStringEncoding) {
  const root = process.env.F03_FRESH_C1_ROOT;
  if (!root) return nativeSpawn(command, args, options);
  const launch = json(join(root, 'launch.json')), progress = phase(root);
  assert.equal(launch.boot, bootId(), 'HOST_REBOOT_NO_RELAUNCH');
  assert.deepEqual(capture(launch.tooling_root), launch.tooling, 'QUALIFICATION_EXECUTABLE_CHANGED');
  if (existsSync(join(root, 'installed.json'))) {
    const installed = json(join(root, 'installed.json'));
    assert.deepEqual(capture(join(installed.host, '.claude/aleph')), installed.files, 'INSTALLED_EXECUTABLE_CHANGED');
  }
  const calls = join(root, 'children'), ordinal = readdirSync(calls).length + 1;
  const out = join(calls, String(ordinal).padStart(4, '0'));
  const env = fixtureEnvironment(options.env || process.env);
  const request: ChildRequest = { nonce: launch.nonce, ordinal, command, args, cwd: String(options.cwd ?? process.cwd()),
    env, expected: env.ALEPH_FIXTURE_WORK_FAULT ? 86 : 0,
    deadline: Math.min(launch.deadline, progress.deadline), max_seconds: progress.child_seconds };
  // A C1-derived probe may legitimately return zero while the prefix is still progressing.
  if (progress.name === 'prefix') request.expected = env.ALEPH_FIXTURE_WORK_FAULT ? [0, 86] : 0;
  const requestPath = join(root, `child-${ordinal}.json`); publish(requestPath, request);
  const result = nativeSpawn(process.execPath, [fileURLToPath(import.meta.url), 'child', requestPath, out],
    { cwd: String(options.cwd ?? process.cwd()), encoding: 'utf8', stdio: 'pipe', env: fixtureEnvironment(process.env) });
  assert.equal(result.status, 0, `COLLECTOR_LOST ${result.stderr}`);
  const receipt = json(join(out, 'result.json')) as ChildReceipt;
  assert(!['TIMEOUT', 'INTERRUPTED'].includes(receipt.verdict), receipt.verdict);
  return { pid: receipt.child.pid, status: receipt.status, signal: receipt.signal as NodeJS.Signals | null,
    stdout: readFileSync(receipt.stdout, 'utf8'), stderr: readFileSync(receipt.stderr, 'utf8'),
    output: [null, null, null], receipt: out };
}
const main = resolve(process.argv[1] || '') === fileURLToPath(import.meta.url);
if (main && process.argv[2] === 'child') {
  await supervise(json(process.argv[3]) as ChildRequest, process.argv[4]);
}

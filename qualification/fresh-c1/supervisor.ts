import assert from 'node:assert/strict';
import { spawn, spawnSync as nativeSpawn, type SpawnSyncOptionsWithStringEncoding } from 'node:child_process';
import { closeSync, existsSync, fsyncSync, openSync, readFileSync, readlinkSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';
import { bytes, capture, digest, json, MAX_SECONDS, publish, type Json, type Verdict } from './common.ts';
import { verifyGuard, verifyOwnership } from './service.ts';

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
const REQUEST_FIELDS = ['nonce', 'ordinal', 'command', 'args', 'cwd', 'env', 'expected', 'deadline', 'max_seconds'] as const;
export function validateRequest(value: unknown): asserts value is ChildRequest {
  assert(value && typeof value === 'object' && !Array.isArray(value), 'CHILD_REQUEST_OBJECT');
  const r = value as ChildRequest;
  assert.deepEqual(Object.keys(r).sort(), [...REQUEST_FIELDS].sort(), 'CHILD_REQUEST_FIELDS');
  const text = (s: unknown): s is string => typeof s === 'string' && !s.includes('\0');
  assert(text(r.nonce) && r.nonce.length > 0, 'CHILD_REQUEST_NONCE');
  assert(Number.isSafeInteger(r.ordinal) && r.ordinal > 0, 'CHILD_REQUEST_ORDINAL');
  for (const path of [r.command, r.cwd]) assert(text(path) && path.startsWith('/') && resolve(path) === path, 'CHILD_REQUEST_PATH');
  assert(Array.isArray(r.args) && r.args.every(text), 'CHILD_REQUEST_ARGS');
  assert(r.env && typeof r.env === 'object' && !Array.isArray(r.env), 'CHILD_REQUEST_ENV');
  for (const [key, val] of Object.entries(r.env)) assert(/^[A-Za-z_][A-Za-z0-9_]*$/.test(key) && text(val), 'CHILD_REQUEST_ENV');
  const exits = Array.isArray(r.expected) ? r.expected : [r.expected];
  assert(exits.length > 0 && new Set(exits).size === exits.length
    && exits.every(n => Number.isSafeInteger(n) && n >= 0 && n <= 255), 'CHILD_REQUEST_EXPECTED');
  assert(Number.isSafeInteger(r.deadline) && r.deadline > 0, 'CHILD_REQUEST_DEADLINE');
  assert(Number.isFinite(r.max_seconds) && r.max_seconds > 0 && r.max_seconds <= MAX_SECONDS, 'CHILD_REQUEST_LIMIT');
}
export interface ChildReceipt extends ChildRequest {
  format: 'f03-child/v1'; parent: Identity; child: Identity; executable_digest: string;
  started_at: number; finished_at: number; elapsed_ms: number; status: number | null;
  signal: string | null; verdict: Verdict; stdout: string; stderr: string;
  stdout_digest: string; stderr_digest: string; error: string | null;
  request_digest: string; process_digest: string; collector_parent: Identity; owner_digest: string | null;
}
/** A stopped exec trampoline makes even an immediately exiting target identifiable.
 * The shell exec preserves PID/start ticks; target bytes and argv are pinned before release. */
export async function supervise(request: ChildRequest, out: string): Promise<ChildReceipt> {
  validateRequest(request);
  assert(request.deadline > Date.now() && request.deadline <= Date.now() + MAX_SECONDS * 1000);
  assert(resolve(request.command) === request.command && request.args.every(x => typeof x === 'string'));
  const executableDigest = digest(readFileSync(request.command));
  publish(join(out, 'request.json'), request);
  const requestDigest = digest(bytes(request)), collectorParent = identity(process.ppid);
  const caseRoot = request.env.F03_FRESH_C1_ROOT;
  const ownerDigest = caseRoot ? digest(readFileSync(join(caseRoot, 'driver.json'))) : null;
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
      request_digest: requestDigest, collector_parent: collectorParent, owner_digest: ownerDigest,
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
  const finishedAt = Date.now(), elapsed = performance.now() - monotonic;
  timedOut ||= finishedAt >= request.deadline || elapsed >= request.max_seconds * 1000;
  const receipt: ChildReceipt = { ...request, format: 'f03-child/v1',
    parent: identity(process.pid), child: childIdentity, executable_digest: executableDigest,
    request_digest: requestDigest, process_digest: digest(readFileSync(join(out, 'process.json'))),
    collector_parent: collectorParent, owner_digest: ownerDigest,
    started_at: started, finished_at: finishedAt, elapsed_ms: elapsed,
    status: code, signal, verdict: interrupted || childIdentity.boot !== bootId()
      ? 'INTERRUPTED' : timedOut ? 'TIMEOUT' : !error && signal === null
        && (Array.isArray(request.expected) ? request.expected.includes(code!) : code === request.expected) ? 'PASS' : 'FAIL',
    stdout: stdoutPath, stderr: stderrPath, stdout_digest: digest(readFileSync(stdoutPath)),
    stderr_digest: digest(readFileSync(stderrPath)), error };
  publish(join(out, 'result.json'), receipt);
  return receipt;
}
export function verifyChild(out: string, nonce: string, expected: number): ChildReceipt {
  const request = json(join(out, 'request.json')), result = json(join(out, 'result.json')) as ChildReceipt;
  validateRequest(request);
  assert.deepEqual(Object.fromEntries(REQUEST_FIELDS.map(key => [key, result[key]])), request, 'CHILD_REQUEST_IDENTITY');
  assert.equal(result.request_digest, digest(readFileSync(join(out, 'request.json'))), 'CHILD_REQUEST_DIGEST');
  assert.equal(result.format, 'f03-child/v1'); assert.equal(result.nonce, nonce);
  assert(Array.isArray(result.expected) ? result.expected.includes(expected) : result.expected === expected);
  const processRecord = json(join(out, 'process.json'));
  assert.equal(result.process_digest, digest(readFileSync(join(out, 'process.json'))), 'CHILD_PROCESS_DIGEST');
  assert.equal(processRecord.request_digest, result.request_digest);
  assert.equal(processRecord.requested_executable, result.command);
  assert.equal(processRecord.exec_trampoline, '/usr/bin/bash'); assert.equal(processRecord.target_released, false);
  assert.deepEqual(result.collector_parent, processRecord.collector_parent);
  assert.equal(result.owner_digest, processRecord.owner_digest);
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
    assert(result.finished_at < result.deadline, 'CHILD_PAST_DEADLINE');
    assert(result.elapsed_ms < result.max_seconds * 1000, 'CHILD_PAST_LIMIT');
  }
  return result;
}
export function verifyCaseChild(root: string, out: string, expected: number): ChildReceipt {
  const launch = json(join(root, 'launch.json')), owner = verifyOwnership(root);
  const receipt = verifyChild(out, launch.nonce, expected);
  const requested = json(join(root, `child-${receipt.ordinal}.json`));
  validateRequest(requested);
  assert.deepEqual(requested, json(join(out, 'request.json')), 'DRIVER_REQUEST_SUBSTITUTED');
  assert.equal(digest(readFileSync(join(root, `child-${receipt.ordinal}.json`))), receipt.request_digest);
  assert.equal(receipt.owner_digest, owner.driver_digest, 'CHILD_OWNER_DIGEST');
  assert.deepEqual(receipt.collector_parent, owner.driver.identity, 'COLLECTOR_DRIVER_IDENTITY');
  assert.equal(receipt.parent.ppid, owner.driver.identity.pid);
  assert.equal(receipt.parent.boot, launch.boot);
  assert.equal(receipt.parent.pid_namespace, owner.driver.identity.pid_namespace);
  assert(BigInt(receipt.parent.start_ticks) >= BigInt(owner.driver.identity.start_ticks));
  assert.equal(receipt.parent.executable, launch.node);
  return receipt;
}
export function disposition(root: string): Verdict {
  if (!existsSync(root)) return 'NOT_RUN';
  if (!existsSync(join(root, 'launch.json'))) return 'FAIL';
  const launch = json(join(root, 'launch.json'));
  if (existsSync(join(root, 'terminal.json'))) {
    const terminal = json(join(root, 'terminal.json')), verdict = terminal.verdict;
    if (verdict === 'PASS') {
      try {
        const owner = verifyOwnership(root);
        assert.equal(terminal.ownership_digest, owner.digest);
        verifyPhases(root, terminal.finished_at, terminal.finished_tick);
        verifyGuard(root);
        const guard = json(join(root, 'guard-result.json'));
        assert.equal(guard.verdict, 'PASS'); assert.equal(guard.ownership_digest, owner.digest);
        assert.equal(guard.guard_digest, digest(readFileSync(join(root, 'guard.json'))));
        assert.equal(terminal.guard_result_digest, digest(readFileSync(join(root, 'guard-result.json'))));
        assert.equal(guard.completion_digest, terminal.completion_digest);
        assert.equal(guard.completion_digest, digest(readFileSync(join(root, 'completion.json'))));
        assert(Number.isSafeInteger(guard.at) && guard.at <= terminal.finished_at && guard.at >= owner.driver.at);
      } catch { return 'FAIL'; }
    }
    return ['PASS', 'FAIL', 'TIMEOUT', 'INTERRUPTED'].includes(verdict) ? verdict : 'FAIL';
  }
  if (launch.boot !== bootId()) return 'INTERRUPTED';
  if (!existsSync(join(root, 'driver.json'))) return 'INTERRUPTED';
  if (!alive(json(join(root, 'driver.json')).identity)) return 'INTERRUPTED';
  return Date.now() >= launch.deadline ? 'TIMEOUT' : 'RUNNING';
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
  const directory = join(root, 'phases'), names = readdirSync(directory).filter(name => /^\d+-[a-z]+\.json$/.test(name)).sort();
  assert(names.length); return json(join(directory, names.at(-1)!));
}
export const PHASE_BUDGETS = [
  ['setup', 1800, 1800], ['prefix', 61200, 10800], ['faults', 14400, 1800],
  ['resumes', 3600, 1800], ['verification', 5400, 5400],
] as const;
export const durationTicks = (seconds: number): bigint => BigInt(seconds) * 1_000_000_000n;
export function tick(value: unknown): bigint {
  assert(typeof value === 'string' && /^[1-9]\d*$/.test(value), 'MONOTONIC_TIMESTAMP_REQUIRED');
  return BigInt(value);
}
export function requireBudget(root: string, now = Date.now()): number {
  const launch = json(join(root, 'launch.json'));
  assert.equal(launch.boot, bootId(), 'INTERRUPTED_HOST_REBOOT');
  if (existsSync(join(root, 'terminal.json'))) {
    const verdict = json(join(root, 'terminal.json')).verdict;
    assert.equal(verdict, 'PASS', `EXECUTION_ALREADY_TERMINAL ${verdict}`);
  } else if (existsSync(join(root, 'guard.json'))) {
    assert(alive(json(join(root, 'guard.json')).identity), 'INTERRUPTED_GUARD_LOST');
  }
  const active = readdirSync(join(root, 'phases')).length ? phase(root) : launch;
  assert(now < Math.min(launch.deadline, active.deadline)
    && process.hrtime.bigint() < tick(launch.deadline_tick)
    && process.hrtime.bigint() < tick(active.deadline_tick), 'TIMEOUT_PHASE_OR_OVERALL');
  return now;
}
export function withinBudget<T>(root: string, action: () => T): T {
  requireBudget(root); const value = action(); requireBudget(root); return value;
}
export function verifyPhases(root: string, finishedAt?: number, finishedTick?: string): Json[] {
  const launch = json(join(root, 'launch.json'));
  assert.equal(launch.deadline - launch.started_at, MAX_SECONDS * 1000, 'EXACT_OVERALL_CEILING');
  assert.equal(tick(launch.deadline_tick) - tick(launch.started_tick), durationTicks(MAX_SECONDS), 'EXACT_MONOTONIC_CEILING');
  const names = PHASE_BUDGETS.map(([name], i) => `${i + 1}-${name}.json`);
  assert.deepEqual(readdirSync(join(root, 'phases')).sort(), names);
  const phases = names.map(name => json(join(root, 'phases', name)));
  for (const [i, p] of phases.entries()) {
    assert.equal(p.name, PHASE_BUDGETS[i][0]); assert.equal(p.child_seconds, PHASE_BUDGETS[i][2]);
    assert(Number.isSafeInteger(p.started_at));
    assert.equal(p.deadline, Math.min(launch.deadline, p.started_at + PHASE_BUDGETS[i][1] * 1000));
    assert(p.started_at >= (i ? phases[i - 1].started_at : launch.started_at));
    assert(p.started_at < (i ? phases[i - 1].deadline : launch.deadline), 'TIMEOUT_PHASE_TRANSITION');
    const previous = i ? phases[i - 1] : launch, started = tick(p.started_tick);
    const limit = started + durationTicks(PHASE_BUDGETS[i][1]), overall = tick(launch.deadline_tick);
    assert.equal(tick(p.deadline_tick), limit < overall ? limit : overall);
    assert(started >= tick(previous.started_tick), 'MONOTONIC_PHASE_ORDER');
    assert(started < tick(previous.deadline_tick), 'TIMEOUT_MONOTONIC_PHASE_TRANSITION');
  }
  if (finishedAt !== undefined) {
    assert(Number.isSafeInteger(finishedAt)
      && finishedAt >= phases[4].started_at && finishedAt < phases[4].deadline, 'TIMEOUT_TERMINAL');
    assert(tick(finishedTick) >= tick(phases[4].started_tick)
      && tick(finishedTick) < tick(phases[4].deadline_tick), 'TIMEOUT_MONOTONIC_TERMINAL');
  }
  return phases;
}
export function enterPhase(root: string, name: string, seconds: number, childSeconds: number): void {
  const directory = join(root, 'phases'), ordinal = readdirSync(directory).length + 1;
  const now = requireBudget(root);
  assert.deepEqual([name, seconds, childSeconds], PHASE_BUDGETS[ordinal - 1], 'EXACT_PHASE_BUDGET');
  const startedTick = process.hrtime.bigint(), limit = startedTick + durationTicks(seconds);
  const overall = tick(json(join(root, 'launch.json')).deadline_tick);
  // Check again after capturing the new timestamp, before publishing a transition.
  requireBudget(root);
  publish(join(directory, `${ordinal}-${name}.json`), {
    name, started_at: now, deadline: Math.min(json(join(root, 'launch.json')).deadline, now + seconds * 1000),
    started_tick: String(startedTick), deadline_tick: String(limit < overall ? limit : overall),
    child_seconds: childSeconds,
  });
}
/** Synchronous fixture adapter; the independently scheduled collector owns the timer. */
export function collectedSpawn(command: string, args: string[], options: SpawnSyncOptionsWithStringEncoding) {
  const root = process.env.F03_FRESH_C1_ROOT;
  if (!root) return nativeSpawn(command, args, options);
  const launch = json(join(root, 'launch.json')), progress = phase(root);
  requireBudget(root);
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
  const receipt = verifyCaseChild(root, out, request.expected === 86 ? 86
    : json(join(out, 'result.json')).status === 86 ? 86 : 0);
  assert(!['TIMEOUT', 'INTERRUPTED'].includes(receipt.verdict), receipt.verdict);
  return { pid: receipt.child.pid, status: receipt.status, signal: receipt.signal as NodeJS.Signals | null,
    stdout: readFileSync(receipt.stdout, 'utf8'), stderr: readFileSync(receipt.stderr, 'utf8'),
    output: [null, null, null], receipt: out };
}
const main = resolve(process.argv[1] || '') === fileURLToPath(import.meta.url);
if (main && process.argv[2] === 'child') {
  await supervise(json(process.argv[3]) as ChildRequest, process.argv[4]);
}

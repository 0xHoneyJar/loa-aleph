#!/usr/bin/env node
// Separate installed-process attacks on a fresh accepted, unconsumed S1 work.
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { sha256Digest, stableJsonBytes, walkRegularFiles, makeTreeOwnerWritable } from '../src/fs.ts';
const seed = JSON.parse(readFileSync(resolve(process.argv[2]), 'utf8')) as {
  run: string; host: string; run_id: string; work_id: string; call_id: string;
};
const root = mkdtempSync(join(tmpdir(), 'f03-controller-auth-'));
const cases: Array<{ name: string; host: string; exit: number | null; error: string }> = [];
const ignored = /^control\/(?:orchestration\/lock|ledger-writer\.lock)(?:\/|\.|$)/u;
function inventory(run: string) {
  return walkRegularFiles(run).map((path) => ({ path: relative(run, path),
    digest: sha256Digest(readFileSync(path)), mode: statSync(path).mode & 0o777 })).filter((f) => !ignored.test(f.path));
}
const seedInventory = inventory(seed.run);
const slot = join(seed.host, 'grimoires/loa/aleph/runs', seed.run_id);
assert(seed.host.startsWith(join(tmpdir(), 'aleph-orchestration-process-')));
assert.equal(JSON.parse(readFileSync(join(slot, 'control/run-state.json'), 'utf8')).full_mode, 'fixture-simulated');
assert.deepEqual(inventory(slot), seedInventory, 'purpose-built disposable slot must start at the exact accepted seed');
function restoreSlot(): void {
  makeTreeOwnerWritable(slot); rmSync(slot, { recursive: true });
  cpSync(seed.run, slot, { recursive: true });
}
function copy() {
  // Fixture fault injection at its authenticated location, not runtime
  // relocation or a product migration. Every completed outcome is archived.
  restoreSlot();
  return { host: seed.host, run: slot };
}
function replace(run: string, path: string, bytes: Buffer | string): void {
  const full = join(run, path), mode = statSync(full).mode & 0o777;
  rmSync(full); writeFileSync(full, bytes, { mode });
}
function alteredJson(run: string, path: string, mutate: (value: any) => void): void {
  const value = JSON.parse(readFileSync(join(run, path), 'utf8')); mutate(value); replace(run, path, stableJsonBytes(value));
}
const returned = `control/worker-returns/${seed.call_id}`;
const workRef = `control/orchestration/work/${seed.work_id}.json`;
const acceptedRef = `control/orchestration/accepted/${seed.call_id}.json`;
let attempts = 0;
function retainAttempt(output: { stdout: string; stderr: string }): void {
  attempts++;
  writeFileSync(join(root, `attempt-${attempts}.log`), output.stdout + output.stderr);
  cpSync(slot, join(root, `attempt-${attempts}-after`), { recursive: true });
}
const invoke = (host: string) => {
  const attempted = spawnSync(process.execPath, [join(host, '.claude/aleph/bin/loa-aleph.mjs'),
    '--root', host, '--json', '--allow-fixture-simulation', 'resume', seed.run_id],
  { encoding: 'utf8', env: { ...process.env, ALEPH_FIXTURE_WORK_FAULT: '' }, maxBuffer: 8 * 1024 * 1024 });
  retainAttempt(attempted); return attempted;
};
function result(name: string, host: string, processResult: { status: number | null; stdout: string; stderr: string }): void {
  cases.push({ name, host, exit: processResult.status, error: processResult.stderr });
  writeFileSync(join(root, `case-${cases.length}.log`), processResult.stdout + processResult.stderr);
  writeFileSync(join(root, 'results.json'), JSON.stringify({ result: 'IN_PROGRESS', cases }, null, 2) + '\n');
  assert.deepEqual(inventory(seed.run), seedInventory, 'seed changed');
  console.log(`PASS ${name}`);
}
try {
{
  const { host, run } = copy(), first = invoke(host);
  assert.equal(first.status, 0, first.stdout + first.stderr);
  assert.equal(JSON.parse(first.stdout).details.work.action, 'prepare');
  assert(existsSync(join(run, 'ledgers/extraction-criteria.md')));
  const state = readFileSync(join(run, 'control/run-state.json')), chain = readFileSync(join(run, 'control/ledger-chain.jsonl'));
  const repeated = invoke(host); assert.equal(repeated.status, 0, repeated.stdout + repeated.stderr);
  assert(readFileSync(join(run, 'control/run-state.json')).equals(state));
  assert(readFileSync(join(run, 'control/ledger-chain.jsonl')).equals(chain));
  result('valid accepted seed commits once through installed resume and returns the next worker', host, first);
}
{
  const { host, run } = copy();
  const start = () => new Promise<{ status: number | null; stdout: string; stderr: string }>((resolve, reject) => {
    const child = spawn(process.execPath, [join(host, '.claude/aleph/bin/loa-aleph.mjs'),
      '--root', host, '--json', '--allow-fixture-simulation', 'resume', seed.run_id]);
    let stdout = '', stderr = '';
    child.stdout.on('data', (bytes) => { stdout += bytes; }); child.stderr.on('data', (bytes) => { stderr += bytes; });
    child.on('error', reject); child.on('close', (status) => resolve({ status, stdout, stderr }));
  });
  const outputs = await Promise.all([start(), start()]);
  retainAttempt({ stdout: outputs.map((r) => r.stdout).join('\n'), stderr: outputs.map((r) => r.stderr).join('\n') });
  assert(outputs.some((r) => r.status === 0));
  for (const r of outputs) if (r.status !== 0) assert.match(r.stdout + r.stderr, /orchestration (?:recovery )?is already active/u);
  const journal = JSON.parse(readFileSync(join(run, `control/transactions/TXN-work-${seed.work_id.slice(5)}.json`), 'utf8'));
  const state = readFileSync(join(run, 'control/run-state.json')), chain = readFileSync(join(run, 'control/ledger-chain.jsonl'));
  assert.equal(journal.status, 'committed');
  assert.equal(journal.plan.effects.length, 3);
  const again = invoke(host); assert.equal(again.status, 0, again.stdout + again.stderr);
  assert(readFileSync(join(run, 'control/run-state.json')).equals(state));
  assert(readFileSync(join(run, 'control/ledger-chain.jsonl')).equals(chain));
  result('concurrent installed resume has one canonical transaction and one next work', host, again);
}
{
  const { host, run } = copy();
  rmSync(join(run, acceptedRef));
  rmSync(join(run, returned, 'native-dispatch.json'));
  const before = inventory(run);
  for (let n = 0; n < 2; n++) {
    const stopped = invoke(host);
    assert.equal(stopped.status, 0, stopped.stdout + stopped.stderr);
    assert.equal(JSON.parse(stopped.stdout).details.work.code, 'DISPATCH_OUTCOME_UNKNOWN');
    assert.equal(JSON.parse(stopped.stdout).details.work.execution, undefined);
    assert.deepEqual(inventory(run), before);
    if (n === 1) result('durable dispatch intent without completion repeatedly halts without redispatch', host, stopped);
  }
}
function refusal(name: string, mutate: (run: string) => void, token: RegExp): void {
  const { host, run } = copy(); mutate(run);
  const before = inventory(run), attempted = invoke(host);
  assert.equal(attempted.status, 1, `${name}: ${attempted.stdout}\n${attempted.stderr}`);
  assert.match(attempted.stdout + attempted.stderr, token, name);
  assert.deepEqual(inventory(run), before, `${name}: refusal changed durable files`);
  result(name, host, attempted);
}
for (const point of ['commit-intent', 'writer-prepared', 'effect:ledgers/extraction-criteria.md', 'chain', 'checkpoint', 'journal-committed']) {
  const { host, run } = copy();
  const launcher = join(host, '.claude/aleph/bin/loa-aleph.mjs');
  const crashed = spawnSync(process.execPath, [launcher, '--root', host, '--json', '--allow-fixture-simulation', 'resume', seed.run_id],
    { encoding: 'utf8', env: { ...process.env, ALEPH_FIXTURE_WORK_FAULT: `inventory.finalize:${point}` } });
  retainAttempt(crashed);
  assert.equal(crashed.status, 86, crashed.stdout + crashed.stderr);
  const before = inventory(run);
  for (const args of [['status', seed.run_id], ['status'], ['validate', seed.run_id]]) {
    const reader = spawnSync(process.execPath, [launcher, '--root', host, '--json', '--allow-fixture-simulation', ...args],
      { encoding: 'utf8', env: { ...process.env, ALEPH_FIXTURE_WORK_FAULT: '' } });
    retainAttempt(reader);
    assert.equal(reader.status, 0, reader.stdout + reader.stderr);
    const value = JSON.parse(reader.stdout);
    assert.equal(value.result, 'BLOCKED');
    const pending = args.length === 1 ? value.details.runs[0] : value.details;
    assert.equal(pending.kind, 'pending-transaction');
    assert.equal(pending.work_id, seed.work_id);
    assert.equal(pending.canonical_verification, 'not-run');
    assert.equal(value.stage, null);
    assert.deepEqual(inventory(run), before, 'pending reader must not mutate or consume work');
  }
  result(`installed readers authenticate and report pending ${point} without canonical verification`, host, crashed);
}
for (const [name, token] of [
  ['raw.json', /WORK_ACCEPTED_BYTES_CHANGED: raw\.json/u],
  ['validated.json', /WORK_ACCEPTED_BYTES_CHANGED: validated\.json/u],
  ['validation.json', /WORK_ACCEPTED_BYTES_CHANGED: validation\.json/u],
  ['native-return.json', /Loa native structured return is not canonical JSON/u],
  ['native-dispatch.json', /Loa native dispatch record is not canonical JSON/u],
  ['invocation.json', /Loa native worker invocation envelope is not canonical JSON/u],
  ['host-capabilities.json', /retained host capability receipt is not canonical JSON/u],
] as const) {
  refusal(`altered accepted ${name}`, (run) => replace(run, `${returned}/${name}`,
    Buffer.concat([readFileSync(join(run, returned, name)), Buffer.from('\n')])),
  token);
}
refusal('accepted receipt rebound to another run work', (run) => alteredJson(run, acceptedRef, (v) => {
  v.work_id = `WORK-${'0'.repeat(64)}`; delete v.digest; v.digest = sha256Digest(stableJsonBytes(v));
}), /WORK_ACCEPTANCE_BINDING|WORK_ACCEPTANCE/u);
refusal('work identity substitutes another stage and recomputes its content digest', (run) => alteredJson(run, workRef, (v) => {
  v.identity.work.obligation.stage = 'S2'; delete v.digest; v.digest = sha256Digest(stableJsonBytes(v));
}), /WORK_IDENTITY/u);
for (const [field, change] of [
  ['run', (v: any) => { v.identity.run_id += '-other'; }],
  ['subject', (v: any) => { v.identity.work.obligation.subject_id += '-other'; }],
  ['subphase', (v: any) => { v.identity.work.obligation.subphase = 'other'; }],
  ['DoD', (v: any) => { v.identity.work.obligation.dod += '-other'; }],
] as const) refusal(`work replay substitutes ${field} with a valid record digest`, (run) => alteredJson(run, workRef, (v) => {
  change(v); delete v.digest; v.digest = sha256Digest(stableJsonBytes(v));
}), /WORK_IDENTITY/u);
for (const [field, change] of [
  ['call', (v: any) => { v.call.call_id = `CALL-F03-${'0'.repeat(64)}`; }],
  ['missing selector', (v: any) => { delete v.call.output_selector; }],
  ['extra selector', (v: any) => { v.call.extra_output_selector = 'ledgers/lineage.md'; }],
  ['alternate selector', (v: any) => { v.call.output_selector = 'Role: Extractor (S2)'; }],
  ['changed task', (v: any) => { v.call.task_line += ' Change the task.'; }],
  ['changed allowlist', (v: any) => { v.call.allowlist = []; }],
] as const) refusal(`work call binding refuses ${field}`, (run) => alteredJson(run, workRef, (v) => {
  change(v); delete v.digest; v.digest = sha256Digest(stableJsonBytes(v));
}), /WORK_(?:CALL_BINDING|RECORD)/u);
for (const field of ['call_id', 'context_id', 'producer_context_id', 'basis_digest'] as const)
  refusal(`accepted return rebinds ${field}`, (run) => alteredJson(run, acceptedRef, (v) => {
    v[field] = field === 'basis_digest' ? `sha256:${'0'.repeat(64)}` : 'OTHER-IDENTITY';
    delete v.digest; v.digest = sha256Digest(stableJsonBytes(v));
  }), /WORK_ACCEPTANCE_BINDING/u);
refusal('stale checkpoint refuses accepted work before canonical changes', (run) => alteredJson(run, 'control/run-state.json', (v) => {
  v.execution.resume.sequence = String(Number(v.execution.resume.sequence) + 1);
}), /checkpoint|WORK_CHECKPOINT_STALE/u);
refusal('canonical prerequisite changed after acceptance', (run) => replace(run, 'corpus/manifest.md',
  readFileSync(join(run, 'corpus/manifest.md'), 'utf8') + '\nUnrelated edit.\n'), /WORK_PREREQUISITE_CHANGED/u);
refusal('missing sealed work basis member', (run) => {
  const work = JSON.parse(readFileSync(join(run, workRef), 'utf8'));
  rmSync(join(run, `control/orchestration/basis/${work.basis_digest.slice(7)}/manifest.json`));
}, /ENOENT|WORK_BASIS/u);
refusal('missing predecessor consumption leaves an ambiguous authenticated work queue', (run) => {
  const workDirectory = join(run, 'control/orchestration/work');
  const predecessor = readdirSync(workDirectory)
    .map((path) => JSON.parse(readFileSync(join(workDirectory, path), 'utf8')))
    .find((work) => work.identity.work.obligation.operation === 'criteria.prepare-samples');
  assert(predecessor && predecessor.work_id !== seed.work_id, 'seed must retain the actual completed predecessor');
  const consumption = join(run, `control/orchestration/commits/${predecessor.work_id}-consumed.json`);
  assert(existsSync(consumption), 'predecessor must be consumed before the mutation');
  assert(!existsSync(join(run, `control/orchestration/commits/${seed.work_id}-consumed.json`)),
    'accepted successor must still be unconsumed');
  rmSync(consumption);
}, /WORK_QUEUE_AMBIGUOUS/u);
refusal('changed installed immutable bundle refuses before work recovery', (run) => {
  const path = 'control/runtime/bundle/runtime-js/adapters/loa/src/orchestration.js';
  replace(run, path, Buffer.concat([readFileSync(join(run, path)), Buffer.from('\n// altered pinned bytes\n')]));
}, /digest|bundle.*(?:changed|differs)|payload/u);
refusal('caller-authored committed consumption without a writer journal', (run) => {
  const full = join(run, `control/orchestration/commits/${seed.work_id}-consumed.json`);
  mkdirSync(dirname(full), { recursive: true }); writeFileSync(full, '{}\n');
}, /WORK_RECORD|WORK_CONSUMPTION|WORK_CONTRACT/u);
const attempts = [
  ['append', "writer.append('ledgers/lineage.md', validated, () => { throw Error('RENDERER_EXECUTED'); })"],
  ['reserveMaterialUse', "writer.reserveMaterialUse(validated, {}, () => { throw Error('RENDERER_EXECUTED'); })"],
  ['appendMaterialUse', "writer.appendMaterialUse(validated, {}, () => { throw Error('RENDERER_EXECUTED'); })"],
  ['appendMaterialFindings', 'writer.appendMaterialFindings(validated)'],
  ['executeSemanticWrite', "writer.executeSemanticWrite({producer:validated,reviews:[],next:{'ledgers/lineage.md':'illicit'}})"],
  ['executeDuplicateWrite', "writer.executeDuplicateWrite({accepted:[validated],next:{'ledgers/lineage.md':'illicit'}})"],
  ['appendProceduralAuthorityResponse', "writer.appendProceduralAuthorityResponse('GATE-S4-AMB-0001-A1-Q1')"],
  ['openProceduralAuthorityFollowup', 'writer.openProceduralAuthorityFollowup({})'],
  ['advanceSlice5ClosurePhase', "writer.advanceSlice5ClosurePhase('S4-C1-relations-closed')"],
  ['enterS5AfterSlice5Closure', 'writer.enterS5AfterSlice5Closure()'],
] as const;
for (const [name, attempt] of attempts) {
  const { host, run } = copy(), before = inventory(run);
  const script = `import {pathToFileURL} from 'node:url'; import {readFileSync} from 'node:fs';
    const [run,call]=process.argv.slice(1), base=run+'/control/runtime/bundle/runtime-js/';
    const {LedgerWriter}=await import(pathToFileURL(run+'/control/runtime/bundle/runtime-js/adapters/loa/src/ledger-writer.js'));
    const {checkWorkerReturn}=await import(pathToFileURL(base+'adapters/loa/src/worker-return.js'));
    const {loadRun}=await import(pathToFileURL(base+'scripts/lib/run-model.js'));
    const returns=run+'/control/worker-returns/'+call;
    const checked=checkWorkerReturn({workerBundleRoot:run+'/control/worker-bundles/'+call,returnRoot:returns,
      raw:readFileSync(returns+'/raw.json'),dispatchReceipt:JSON.parse(readFileSync(returns+'/native-dispatch.json')).receipt},loadRun(run));
    const validated=checked.validated;
    if(!validated?.isAuthentic()) throw Error('STANDALONE_VALIDATOR_CONTROL_FAILED');
    const writer=new LedgerWriter(run); ${attempt};`;
  const attempted = spawnSync(process.execPath, ['--input-type=module', '-e', script, run, seed.call_id], { encoding: 'utf8' });
  retainAttempt(attempted);
  assert.equal(attempted.status, 1, name);
  assert.match(attempted.stderr, /WORK_AUTHENTICATED_TRANSITION_REQUIRED/u);
  assert(!attempted.stderr.includes('RENDERER_EXECUTED'));
  assert.deepEqual(inventory(run), before);
  result(`new-format ${name} cannot bypass durable work`, host, attempted);
}
writeFileSync(join(root, 'results.json'), JSON.stringify({ result: 'PASS', cases, seed, root, seed_unchanged: true,
  scope: 'Fresh installed fixture processes, accepted-return tamper and legacy-writer refusal; no genuine native or provider evidence.' }, null, 2) + '\n');
console.log(JSON.stringify({ result: 'PASS', cases: cases.length, root }));
} finally {
  restoreSlot();
  assert.deepEqual(inventory(slot), seedInventory, 'disposable slot must finish at the exact sealed baseline');
}

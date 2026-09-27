#!/usr/bin/env node
/** Rehashed consumed journals must reproduce the complete pinned Core plan. */
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256Digest, stableJsonBytes, walkRegularFiles, makeTreeOwnerWritable } from '../src/fs.ts';
import { workDigest, workJson } from '../../../scripts/lib/work-transitions.ts';

const seed = JSON.parse(readFileSync(resolve(process.argv[2]), 'utf8')) as {
  run: string; host: string; run_id: string; work_id: string; call_id: string;
};
const root = mkdtempSync(join(tmpdir(), 'f03-consumed-plan-auth-'));
const source = process.argv.includes('--source');
const slot = join(seed.host, 'grimoires/loa/aleph/runs', seed.run_id);
assert(seed.host.startsWith(join(tmpdir(), 'aleph-orchestration-process-')));
assert.equal(JSON.parse(readFileSync(join(slot, 'control/run-state.json'), 'utf8')).full_mode, 'fixture-simulated');
const ignored = /^control\/(?:orchestration\/lock|ledger-writer\.lock)(?:\/|\.|$)/u;
function inventory(run: string) {
  return walkRegularFiles(run).map((path) => ({ path: relative(run, path),
    digest: sha256Digest(readFileSync(path)), mode: statSync(path).mode & 0o777 })).filter((f) => !ignored.test(f.path));
}
const original = inventory(slot);
assert.deepEqual(original, inventory(seed.run), 'only the exact purpose-built accepted slot may be used');
function restore(from: string): void {
  makeTreeOwnerWritable(slot); rmSync(slot, { recursive: true }); cpSync(from, slot, { recursive: true });
}
let attempt = 0;
function invoke(fault = '') {
  const args = source && !fault ? ['--input-type=module', '-e',
    `import {pathToFileURL} from 'node:url';
     const {pendingOrchestrationCommitWork}=await import(pathToFileURL(process.argv[1]));
     console.log(JSON.stringify({pending:pendingOrchestrationCommitWork(process.argv[2])}));`,
    fileURLToPath(new URL('../src/orchestration.ts', import.meta.url)), slot]
    : [join(seed.host, '.claude/aleph/bin/loa-aleph.mjs'), '--root', seed.host,
      '--json', '--allow-fixture-simulation', 'resume', seed.run_id];
  const result = spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, ALEPH_FIXTURE_WORK_FAULT: fault } });
  writeFileSync(join(root, `attempt-${++attempt}.json`), JSON.stringify({ args, fault, ...result }, null, 2) + '\n');
  return result;
}
function rewrite(path: string, value: unknown): void {
  const full = join(slot, path), mode = statSync(full).mode & 0o777;
  rmSync(full); writeFileSync(full, stableJsonBytes(value), { mode });
}
function seal(value: any): void {
  delete value.digest; value.digest = sha256Digest(stableJsonBytes(value));
}
const zero = `sha256:${'0'.repeat(64)}`;
const mutations: Array<[string, (plan: any, intent: any, journal: any) => void]> = [
  ['effect destination', (p) => { p.effects[0].path = 'ledgers/forged-consumed-effect.md'; }],
  ['effect AFTER bytes', (p) => {
    const bytes = Buffer.concat([Buffer.from(p.effects[0].after_base64, 'base64'), Buffer.from('\nchanged\n')]);
    p.effects[0].after_base64 = bytes.toString('base64'); p.effects[0].after_digest = workDigest(bytes);
  }],
  ['effect count', (p) => { p.effects.pop(); }],
  ['effect order', (p) => { p.effects.reverse(); }],
  ['next stage', (p) => { p.next_execution.stage = 'S4'; }],
  ['stage status', (p) => { p.next_execution.stage_status = 'closed'; }],
  ['Core state', (p) => { p.next_execution.core_state = 'ACCEPTED'; }],
  ['authority gate and halt', (p) => { p.authority = { operation: 'apply', gate: null, halt: null }; }],
  ['operational halt', (p) => {
    p.operational_halt = { code: 'LATE_UNIT_LINEAGE_CORRECTION', reason: 'Changed', at: '2026-09-17T00:00:00.000Z', blocking: true };
  }],
  ['simulation marker', (p) => { p.simulation = !p.simulation; }],
  ['bootstrap composition', (p) => { p.s3_to_s4_bootstrap = { at: '2026-09-17T00:00:00.000Z' }; }],
  ['obligation', (p) => { p.obligation.dod += '-changed'; }],
  ['subject', (p) => { p.obligation.subject_id += '-changed'; }],
  ['work operation', (p) => { p.obligation.operation = 'stage.seal-S3'; }],
  ['accepted-return association', (_p, i) => { i.acceptance_digest = zero; }],
  ['work association', (_p, i) => { i.work_digest = zero; }],
  ['BEFORE checkpoint', (_p, i) => { i.before_checkpoint = zero; }],
  ['BEFORE chain', (_p, i) => { i.before_chain = zero; }],
  ['effect BEFORE digest', (p) => { p.effects[0].before_digest = zero; }],
  ['extra effect', (p) => { p.effects.push({ ...p.effects[0], path: 'ledgers/extra-effect.md' }); }],
  ['transition family', (p) => { p.family = 'stage'; }],
  ['field origins', (p) => { p.origins = []; }],
  ['source completion composition', (p) => { p.source_completion = {}; }],
  ['stationary capture composition', (p) => { p.stationary_capture = {}; }],
  ['S4 closure marker', (p) => { p.s4_closure = 'S4-C3-closed'; }],
  ['semantic composition', (p) => { p.semantic = {}; }],
  ['duplicate composition', (p) => { p.duplicate = {}; }],
  ['next blocked marker', (p) => { p.next_execution.blocked = !p.next_execution.blocked; }],
  ['unknown transition field', (p) => { p.unrecognized_transition_field = true; }],
  ['journal BEFORE state', (_p, _i, j) => { j.state_before.execution.stage = 'S4'; }],
  ['journal BEFORE chain bytes', (_p, _i, j) => { j.chain_before += '\n'; }],
  ['journal AFTER state', (_p, _i, j) => { j.state_after.execution.stage = 'S4'; }],
  ['journal AFTER chain bytes', (_p, _i, j) => { j.chain_after += '\n'; }],
];
const cases: Array<{ name: string; result: string; exit: number | null; error: string }> = [];
try {
  const crash = invoke('inventory.finalize:consumed');
  assert.equal(crash.status, 86, crash.stdout + crash.stderr);
  const baseline = join(root, 'intact-consumed'); cpSync(slot, baseline, { recursive: true });
  const jr = `control/transactions/TXN-work-${seed.work_id.slice(5)}.json`;
  const ir = `control/orchestration/commits/${seed.work_id}-intent.json`;
  const cr = `control/orchestration/commits/${seed.work_id}-consumed.json`;
  const intact = invoke(); assert.equal(intact.status, 0, intact.stdout + intact.stderr);
  const after = inventory(slot), repeated = invoke();
  assert.equal(repeated.status, 0, repeated.stdout + repeated.stderr);
  assert.deepEqual(inventory(slot), after, 'intact consumed resume is idempotent');
  cases.push({ name: 'intact consumed resume and repeated resume', result: 'PASS', exit: 0, error: '' });
  for (const [name, mutate] of mutations) {
    restore(baseline);
    const journal = JSON.parse(readFileSync(join(slot, jr), 'utf8'));
    const intent = JSON.parse(readFileSync(join(slot, ir), 'utf8'));
    const consumed = JSON.parse(readFileSync(join(slot, cr), 'utf8'));
    const beforeMutation = stableJsonBytes({ journal, intent });
    mutate(journal.plan, intent, journal);
    assert(!stableJsonBytes({ journal, intent }).equals(beforeMutation), `${name}: vacuous mutation`);
    intent.plan_digest = workDigest(workJson(journal.plan)); seal(intent); rewrite(ir, intent);
    journal.intent_digest = intent.digest;
    const { digest, status, ...body } = journal;
    journal.digest = sha256Digest(stableJsonBytes(body)); rewrite(jr, journal);
    consumed.commit_digest = intent.digest; consumed.journal_digest = sha256Digest(stableJsonBytes(journal));
    seal(consumed); rewrite(cr, consumed);
    const before = inventory(slot), result = invoke();
    cpSync(slot, join(root, `case-${cases.length}-after`), { recursive: true });
    cases.push({ name, result: result.status === 1 ? 'REFUSED' : 'ACCEPTED', exit: result.status, error: result.stdout + result.stderr });
    writeFileSync(join(root, 'results.json'), JSON.stringify({ result: 'IN_PROGRESS', cases, seed, root }, null, 2) + '\n');
    assert.equal(result.status, 1, `${name}: ${result.stdout}\n${result.stderr}`);
    assert.match(result.stdout + result.stderr, /WORK_CONSUMPTION_PLAN|WORK_COMMIT_BINDING|WORK_CONSUMPTION_TRANSACTION/u);
    assert.deepEqual(inventory(slot), before, `${name}: refusal changed durable bytes`);
    console.log(`PASS rehashed consumed ${name} refused by exact rederivation/binding`);
  }
  writeFileSync(join(root, 'results.json'), JSON.stringify({ result: 'PASS', cases, seed, root,
    controls: 1, adversarial: mutations.length, source, original_probe: '/tmp/f03-consumed-plan-probe-7VOvrt/result.json',
    scope: source ? 'Read-only source reauthentication of an installed consumed fixture; original runtime pins preserved.'
      : 'Installed fixture processes; original pins preserved; no native/provider execution.' }, null, 2) + '\n');
  console.log(JSON.stringify({ result: 'PASS', controls: 1, adversarial: mutations.length, root }));
} finally {
  restore(seed.run); assert.deepEqual(inventory(slot), original); assert.deepEqual(inventory(seed.run), original);
}

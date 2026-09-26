#!/usr/bin/env node
/** Synthetic Core composition controls; installed writer/recovery proof is separate. */
import assert from 'node:assert/strict';
import { chmodSync, cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { makeSemanticFixture, addFixtureNormalization, writeFixtureFile } from '../../../scripts/semantic-fixture-support.ts';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import type { WorkExecution, WorkTransition } from '../../../scripts/lib/work-transitions.ts';
const runtime = process.argv.includes('--runtime');
const core = await import(runtime ? '../../../runtime-js/scripts/lib/work-transitions.js'
  : '../../../scripts/lib/work-transitions.ts') as typeof import('../../../scripts/lib/work-transitions.ts');
const duplicate = await import(runtime ? '../../../runtime-js/scripts/lib/duplicate-review.js'
  : '../../../scripts/lib/duplicate-review.ts') as typeof import('../../../scripts/lib/duplicate-review.ts');
const semantic = await import(runtime ? '../../../runtime-js/scripts/lib/semantic-review.js'
  : '../../../scripts/lib/semantic-review.ts') as typeof import('../../../scripts/lib/semantic-review.ts');
const root = mkdtempSync(join(tmpdir(), 'f03-c09-bootstrap-'));
const f = addFixtureNormalization(makeSemanticFixture(join(root, 'before'), undefined, undefined, undefined,
  '1.9.0-provisional'), { noClaim: true });
const execution: WorkExecution = { stage: 'S3', stage_status: 'entered', core_state: 'DISTILLING', blocked: false };
const now = '2026-09-26T20:00:00Z', before = loadRun(f.run), work = core.selectNextWork(before, execution);
const options = { model: before, execution, work, now };
const plan = core.planS3ToS4Bootstrap(options);
const ledger = duplicate.DUPLICATE_PATH, seal = 'verification/harness/semantic-stage-seals/S3.json';
const empty = Buffer.from(duplicate.duplicateLedgerMarkdown(duplicate.emptyDuplicateLedger()));
let serial = 0;
function copy(from = f.run): string {
  const to = join(root, `case-${++serial}`); cpSync(from, to, { recursive: true }); return to;
}
function apply(p = plan): string {
  const to = copy(); for (const w of p.effects) writeFixtureFile(to, w.path, Buffer.from(w.after_base64, 'base64')); return to;
}
const afterPath = apply(), after = loadRun(afterPath);
const cases: Array<{ name: string; error?: string }> = [];
function test(name: string, action: () => string | void) {
  const error = action(); cases.push({ name, ...error ? { error } : {} }); console.log(`PASS ${name}`);
}
function refuses(action: () => unknown, pattern: RegExp): string {
  let error = ''; try { action(); } catch (e) { error = e instanceof Error ? e.message : String(e); }
  assert.match(error, pattern); return error;
}
function altered(path: string, bytes: Buffer): WorkTransition {
  const next = structuredClone(plan), w = next.effects.find((w) => w.path === path)!;
  w.after_base64 = bytes.toString('base64'); w.after_digest = core.workDigest(bytes); return next;
}
test('legal S3 has no duplicate artifact', () => {
  assert(!existsSync(join(f.run, ledger))); assert.equal(duplicate.validateDuplicateRun(before).discoveries, 0);
});
test('pre-S4 duplicate ledger is rejected by state and selection', () => {
  const run = copy(); writeFixtureFile(run, ledger, empty);
  refuses(() => core.selectNextWork(loadRun(run), execution), /DUP_WINDOW/u);
  return refuses(() => duplicate.validateDuplicateRun(loadRun(run)), /DUP_WINDOW/u);
});
test('exact S3 seal is derived by the existing constructor', () => {
  assert.equal(plan.effects[0].path, seal);
  assert(Buffer.from(plan.effects[0].after_base64, 'base64').equals(Buffer.from(semantic.semanticJson(
    semantic.semanticStageSeal(core.semanticLedger(before), 'S3')))));
});
test('exact existing S3 exit and S4 entry event is derived', () => {
  const expected = `${readFileSync(join(f.run, 'run-log.md'))}\n## ${now} — S3 — exit\n\nsemantic_stage: S3\n`
    + `semantic_review_seal_ref: ${seal}@${plan.effects[0].after_digest}\n\nCore normalization accounting closed.\n`
    + `\n## ${now} — S4 — entry\n\nCore duplicate, relation and ambiguity obligations begin.\n`;
  assert.equal(Buffer.from(plan.effects[1].after_base64, 'base64').toString(), expected);
});
test('zero claims and candidates still receive exactly the canonical six empty tables', () => {
  assert.equal(before.claims.length, 0); assert(readFileSync(join(afterPath, ledger)).equals(empty));
  assert.deepEqual(duplicate.parseDuplicateLedger(empty.toString()), duplicate.emptyDuplicateLedger());
});
test('dedicated planner and production derivation are identical', () => {
  assert.deepEqual(core.deriveWorkTransition(before, execution, work, null, now), plan);
});
test('final composite passes existing seal, duplicate and open-window predicates', () => {
  core.validateDerivedWorkTransition(before, after, plan); semantic.validateSemanticRun(after);
  duplicate.validateDuplicateRun(after); duplicate.assertDuplicateWindow(after);
  assert(!readFileSync(join(afterPath, 'run-log.md'), 'utf8').includes('closure_phase:'));
});
test('canonical AFTER selection uses initialized ledger without s4.initialize', () => {
  const next = core.selectNextWork(after, plan.next_execution);
  assert(next.kind === 'local'); assert.equal(next.obligation.operation, 's4.record-discovery');
});
for (const name of ['duplicate_bytes', 'stage_entry_bytes', 'destination_paths', 'after_images', 'projected_entry', 'write_allowlist']) {
  test(`caller-authored ${name} is rejected`, () => refuses(() =>
    core.planS3ToS4Bootstrap({ ...options, [name]: name } as typeof options), /WORK_BOOTSTRAP_INPUT/u));
}
for (const path of [seal, 'run-log.md', ledger]) {
  test(`changed ${path} invalidates composite even with recomputed digests`, () => {
    const mutation = altered(path, Buffer.concat([readFileSync(join(afterPath, path)), Buffer.from('\n')]));
    return refuses(() => core.validateDerivedWorkTransition(before, loadRun(apply(mutation)), mutation), /WORK_BOOTSTRAP_PLAN/u);
  });
  test(`changed ${path} AFTER bytes cannot reuse an unchanged composite`, () => {
    const run = copy(afterPath);
    writeFixtureFile(run, path, Buffer.concat([readFileSync(join(run, path)), Buffer.from('\n')]));
    return refuses(() => core.validateDerivedWorkTransition(before, loadRun(run), plan), /SEM_SUBJECT|DUP_SUBJECT/u);
  });
}
test('nonempty bootstrap ledger is rejected', () => {
  const rows = duplicate.emptyDuplicateLedger();
  rows.discoveries.push({ discovery_id: 'DCD-0001', record_path: 'verification/harness/duplicate-discovery/DCD-0001.json',
    record_digest: core.workDigest('synthetic'), discovered_by: 'synthetic' } as never);
  const mutation = altered(ledger, Buffer.from(duplicate.duplicateLedgerMarkdown(rows)));
  return refuses(() => core.validateDerivedWorkTransition(before, loadRun(apply(mutation)), mutation), /WORK_BOOTSTRAP_PLAN/u);
});
test('unrelated extra planned write is rejected', () => {
  const mutation = structuredClone(plan); mutation.effects.push(core.effect(before, 'ledgers/unrelated.md', Buffer.from('unrelated')));
  return refuses(() => core.validateDerivedWorkTransition(before, loadRun(apply(mutation)), mutation), /WORK_BOOTSTRAP_PLAN/u);
});
test('unplanned persisted projection or other artifact is rejected', () => {
  const run = copy(afterPath); writeFixtureFile(run, 'verification/projected-entry.json', '{}');
  return refuses(() => core.validateDerivedWorkTransition(before, loadRun(run), plan), /WORK_BOOTSTRAP_PLAN/u);
});
test('projected missing-ledger S4 is rejected by ordinary validation and selection', () => {
  const run = copy(afterPath); rmSync(join(run, ledger));
  refuses(() => duplicate.validateDuplicateRun(loadRun(run)), /DUP_FORMAT/u);
  return refuses(() => core.selectNextWork(loadRun(run), plan.next_execution), /DUP_FORMAT/u);
});
test('ordinary S3 semantic plan cannot include duplicate ledger', () => {
  const writes = plan.effects.map((w) => ({ path: w.path, before_hash: w.before_digest || core.workDigest(Buffer.alloc(0)),
    after_base64: w.after_base64, after_hash: w.after_digest }));
  return refuses(() => semantic.planSemanticWrite({ model: before, proposedModel: after, stage: 'S3',
    semantic_id: 'none', subject_digest: plan.effects[0].after_digest, operation: 'seal', record_id: 'S3',
    writes, prerequisite_paths: [] }), /SEM_WINDOW/u);
});
const duplicatePlan = (modelPath: string, includeLog = false) => duplicate.planDuplicateWrite({
  model: loadRun(modelPath), proposedModel: after, proposal_id: 'none', subject_digest: core.workDigest(empty),
  operation: 'initialize', record_id: 'S4', prerequisite_paths: [], acceptance_bindings: [],
  writes: plan.effects.filter((w) => w.path === ledger || includeLog && w.path === 'run-log.md').map((w) => ({
    path: w.path, before_hash: w.before_digest || core.workDigest(Buffer.alloc(0)), after_base64: w.after_base64, after_hash: w.after_digest })),
});
test('ordinary duplicate write in S3 retains DUP_WINDOW refusal', () => refuses(() => duplicatePlan(f.run), /DUP_WINDOW/u));
test('ordinary duplicate plan cannot write stage-transition log', () => {
  const projected = copy(afterPath); rmSync(join(projected, ledger));
  return refuses(() => duplicatePlan(projected, true), /DUP_WINDOW/u);
});
test('duplicate initializer cannot run twice even with a current preimage hash', () => refuses(() =>
  duplicate.planDuplicateWrite({ model: after, proposedModel: after, proposal_id: 'none',
    subject_digest: core.workDigest(empty), operation: 'initialize', record_id: 'S4',
    prerequisite_paths: [], acceptance_bindings: [], writes: [{ path: ledger, before_hash: core.workDigest(empty),
      after_base64: empty.toString('base64'), after_hash: core.workDigest(empty) }] }), /DUP_STATE.*only exact empty ledger at S4 entry/u));
test('bootstrap cannot reuse a consumed stage or initialize twice', () => refuses(() =>
  core.deriveWorkTransition(after, plan.next_execution, work, null, now), /WORK_STALE/u));
test('wrong stage is rejected', () => refuses(() => core.planS3ToS4Bootstrap({
  ...options, execution: plan.next_execution }), /WORK_STAGE/u));
test('stale or different run work is rejected', () => {
  assert(work.kind === 'local'); return refuses(() => core.planS3ToS4Bootstrap({ ...options,
    work: { ...work, obligation: { ...work.obligation, subject_id: 'RUN-other' } } }), /WORK_STALE/u);
});
test('changed authenticated S3 semantic history cannot reuse the plan', () => {
  const run = copy(); writeFixtureFile(run, semantic.SEMANTIC_PATH,
    readFileSync(join(run, semantic.SEMANTIC_PATH), 'utf8') + '\n');
  return refuses(() => core.validateDerivedWorkTransition(loadRun(run), after, plan), /WORK_BOOTSTRAP_PLAN/u);
});
test('missing S2 seal prerequisite refuses bootstrap', () => {
  const run = copy(); rmSync(join(run, 'verification/harness/semantic-stage-seals/S2.json'));
  return refuses(() => core.planS3ToS4Bootstrap({ ...options, model: loadRun(run) }), /CAPTURE_HASH.*S2.json.*missing path/u);
});
test('missing S3 review prerequisite refuses bootstrap', () => {
  const run = copy(), row = core.semanticLedger(before).results.at(-1)!; rmSync(join(run, row.result_path));
  return refuses(() => core.planS3ToS4Bootstrap({ ...options, model: loadRun(run) }), /SEM_REVIEW.*assigned JSON result missing/u);
});
test('altered BEFORE log cannot reuse the derived projection', () => {
  const run = copy(); writeFixtureFile(run, 'run-log.md', readFileSync(join(run, 'run-log.md'), 'utf8') + '\nChanged basis.\n');
  return refuses(() => core.validateDerivedWorkTransition(loadRun(run), after, plan), /WORK_BOOTSTRAP_PLAN/u);
});
test('predecessor format cannot acquire cumulative bootstrap', () => {
  const run = copy(); writeFixtureFile(run, 'run-manifest.md',
    readFileSync(join(run, 'run-manifest.md'), 'utf8').replaceAll('1.9.0-provisional', '1.8.0-provisional'));
  return refuses(() => core.planS3ToS4Bootstrap({ ...options, model: loadRun(run) }), /WORK_CAPABILITY/u);
});
test('read-only authenticated BEFORE can derive its disposable validator projection', () => {
  const run = copy(); chmodSync(join(run, 'run-log.md'), 0o400);
  core.validateDerivedWorkTransition(loadRun(run), after, plan);
  assert(readFileSync(join(run, 'run-log.md')).equals(readFileSync(join(f.run, 'run-log.md'))));
});
test('consumption requires the completed Core bootstrap anchors', () => {
  core.validateConsumedWorkTransition(afterPath, plan);
  return refuses(() => core.validateConsumedWorkTransition(f.run, plan), /CAPTURE_HASH.*S3.json/u);
});
test('consumed bootstrap cannot hide a missing duplicate ledger', () => {
  const run = copy(afterPath); rmSync(join(run, ledger));
  return refuses(() => core.validateConsumedWorkTransition(run, plan), /CAPTURE_HASH.*duplicate-review.md/u);
});
test('consumed bootstrap cannot change its S3 seal', () => {
  const run = copy(afterPath); writeFixtureFile(run, seal, '{}');
  return refuses(() => core.validateConsumedWorkTransition(run, plan), /WORK_CONSUMPTION/u);
});
test('later log appends preserve the exact bootstrap prefix', () => {
  const run = copy(afterPath); writeFixtureFile(run, 'run-log.md',
    readFileSync(join(run, 'run-log.md'), 'utf8') + '\nLater fixture bookkeeping.\n');
  core.validateConsumedWorkTransition(run, plan);
});
test('consumed composition cannot substitute alternate initial duplicate bytes', () => {
  const mutation = altered(ledger, Buffer.concat([empty, Buffer.from('\n')]));
  return refuses(() => core.validateConsumedWorkTransition(afterPath, mutation), /WORK_CONSUMPTION/u);
});
console.log(JSON.stringify({ result: 'PASS', runtime, cases, root,
  scope: 'Synthetic Core bootstrap composition; no installed/process proof, semantic acceptance or finding closure.' }));

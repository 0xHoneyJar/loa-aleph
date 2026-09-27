#!/usr/bin/env node
// Synthetic Core relation plans. Actual dispatch, journal and restart proof is separate.
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { duplicateFixtureBase } from '../../../scripts/duplicate-fixture-support.ts';
import { writeFixtureFile, TEXT_USE } from '../../../scripts/semantic-fixture-support.ts';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import { canonicalJsonBytes } from '../../../scripts/lib/bundle-format.ts';
import { semanticJson } from '../../../scripts/lib/semantic-review.ts';
import { relationReviewSubjectDigest, parseRelations } from '../../../scripts/lib/relations.ts';
import type { WorkValue, NextWork } from '../../../scripts/lib/work-transitions.ts';
const runtime = process.argv.includes('--runtime');
const rel = await import(runtime ? '../../../runtime-js/scripts/lib/work-transitions-relations.js'
  : '../../../scripts/lib/work-transitions-relations.ts') as typeof import('../../../scripts/lib/work-transitions-relations.ts');
const core = await import(runtime ? '../../../runtime-js/scripts/lib/work-transitions.js'
  : '../../../scripts/lib/work-transitions.ts') as typeof import('../../../scripts/lib/work-transitions.ts');
const sem = await import(runtime ? '../../../runtime-js/scripts/lib/semantic-review.js'
  : '../../../scripts/lib/semantic-review.ts') as typeof import('../../../scripts/lib/semantic-review.ts');
const material = await import(runtime ? '../../../runtime-js/scripts/lib/source-representation.js'
  : '../../../scripts/lib/source-representation.ts') as typeof import('../../../scripts/lib/source-representation.ts');
const scratch = mkdtempSync(join(tmpdir(), 'f03-relations-'));
let run = join(scratch, 'before'), serial = 0;
duplicateFixtureBase(run, undefined, undefined, { runFormatVersion: '1.9.0-provisional' });
const cases: Array<{ name: string; kind: 'control' | 'adversarial' }> = [];
function test(name: string, action: () => void, kind: 'control' | 'adversarial' = 'control') {
  action(); cases.push({ name, kind }); console.log(`PASS ${name}`);
}
function apply(work: NextWork, value: WorkValue | null): void {
  assert(work.kind === 'local' || work.kind === 'worker');
  const plan = rel.deriveRelationTransition(loadRun(run), work, value);
  const next = join(scratch, `after-${serial++}`); cpSync(run, next, { recursive: true });
  for (const e of plan.effects) writeFixtureFile(next, e.path, Buffer.from(e.after_base64, 'base64'));
  assert(plan.effects.every((e) => e.path !== 'ledgers/relations.md'), 'pre-C1 work cannot write REL');
  run = next;
}
function returned(work: NextWork, value: unknown, producerContext: string | null = null): WorkValue {
  assert(work.kind === 'worker');
  const call = work.call.prepared_call_id!, raw = canonicalJsonBytes(value);
  writeFixtureFile(run, `control/worker-returns/${call}/raw.json`, raw);
  return { call_id: call, role: work.call.role, context_id: `CTX-${call}`, producer_context_id: producerContext,
    raw_digest: core.workDigest(raw), receipt_digest: `sha256:${'a'.repeat(64)}`, simulation: true,
    value: JSON.parse(raw.toString()) as WorkValue['value'] };
}
const noCanonicalRelation = () => assert.equal(parseRelations(loadRun(run)).rows.length, 0);
const sourceSeal = readFileSync(join(run, 'verification/harness/semantic-stage-seals/S2.json'));
const semanticBefore = readFileSync(join(run, sem.SEMANTIC_PATH));
const prep = rel.selectRelationWork(loadRun(run))!;
test('Core selects one exact global relation preparation', () => {
  assert(prep.kind === 'local'); assert.equal(prep.obligation.operation, 's4.relation.prepare');
});
apply(prep, null);
const capture = rel.selectRelationWork(loadRun(run))!;
assert(capture.kind === 'worker');
const attachments = capture.call.allowlist.map((path) => ({ path, bytes: readFileSync(join(run, path)) }));
test('global relation delivery uses only the exact Core-derived view', () =>
  rel.validateRelationWorkDelivery(loadRun(run), capture.call.role, 'S4', capture.call.prepared_call_id!,
    capture.call.task_line, null, attachments));
for (const [name, role, stage, callId, task, context, shown] of [
  ['wrong relation delivery stage', capture.call.role, 'S3', capture.call.prepared_call_id!, capture.call.task_line, null, attachments],
  ['wrong relation delivery invocation', capture.call.role, 'S4', 'CALL-other', capture.call.task_line, null, attachments],
  ['caller-added relation task', capture.call.role, 'S4', capture.call.prepared_call_id!, `${capture.call.task_line} Choose my answer.`, null, attachments],
  ['caller-added relation context', capture.call.role, 'S4', capture.call.prepared_call_id!, capture.call.task_line, null,
    [...attachments, { path: 'answer-key.md', bytes: Buffer.from('hidden') }]],
  ['changed relation view bytes', capture.call.role, 'S4', capture.call.prepared_call_id!, capture.call.task_line, null,
    attachments.map((a) => ({ ...a, bytes: Buffer.concat([a.bytes, Buffer.from('\n')]) }))],
] as const) test(name, () => assert.throws(() =>
  rel.validateRelationWorkDelivery(loadRun(run), role, stage, callId, task, context, [...shown]),
  /WORK_RELATION_ISOLATION/u), 'adversarial');
const packet = loadRun(run).packets[0].values.packetId;
const subject = { format: 'aleph-relation-review-subject/v1', owner_stage: 'S4', family: 'source-context', type: 'qualifier-context',
  source_kind: 'PKT', source_id: packet, target_kind: 'null', target_id: 'none', target_source_id: 'none',
  target_locator: 'none', target_span_hash: 'none', record_state: 'explicitly-absent', null_reason: 'bounded-review-found-none',
  basis_packet_ids: [packet], proposed_by: `invocation:${capture.call.prepared_call_id}` };
function rawWith(s = subject) {
  const { format: _format, ...fields } = s;
  return { relation_proposals: [{ ...fields, review_subject_digest: core.workDigest(semanticJson(s)),
    rationale: 'Synthetic relation proposal only.', flags: [], material_use: TEXT_USE }], not_applicable: [], material_findings: [] };
}
const value = returned(capture, rawWith());
test('transport-sorted material use derives the exact retained relation capture', () => {
  const input = (value.value as any).relation_proposals[0].material_use;
  assert.deepEqual(Object.keys(input), Object.keys(input).sort());
  assert.notDeepEqual(Object.keys(input), Object.keys(TEXT_USE));
  const plan = rel.deriveRelationTransition(loadRun(run), capture, value);
  const retained = JSON.parse(Buffer.from(plan.effects[0].after_base64, 'base64').toString());
  assert.deepEqual(retained, value);
});
for (const [name, change] of [
  ['missing material-use field', (input: any) => { delete input.reason; }],
  ['unknown material-use field', (input: any) => { input.unknown = true; }],
  ['unknown material requirement field', (input: any) => { input.requirements[0].unknown = true; }],
] as const) test(name, () => {
  const altered = structuredClone(value);
  change((altered.value as any).relation_proposals[0].material_use);
  assert.throws(() => rel.deriveRelationTransition(loadRun(run), capture, altered), /UNDECLARED_FEATURE/u);
}, 'adversarial');
test('canonical ledger material-use validation still requires declared field order', () =>
  assert.throws(() => material.validateMaterialUseInput((value.value as any).relation_proposals[0].material_use),
    /UNDECLARED_FEATURE/u), 'adversarial');
for (const [name, change] of [
  ['wrong owner stage', { owner_stage: 'S3' }],
  ['wrong producer identity', { proposed_by: 'invocation:another-call' }],
  ['CC-only semantic prerequisite from PKT', { family: 'claim-dependency', type: 'semantic-prerequisite' }],
  ['missing source PKT', { source_id: 'PKT-9999' }],
] as const) test(name, () => {
  const altered = { ...value, value: rawWith({ ...subject, ...change }) as unknown as WorkValue['value'] };
  assert.throws(() => rel.deriveRelationTransition(loadRun(run), capture, altered));
}, 'adversarial');
test('wrong relation digest fails', () => {
  const altered = structuredClone(value); (altered.value as any).relation_proposals[0].review_subject_digest = `sha256:${'0'.repeat(64)}`;
  assert.throws(() => rel.deriveRelationTransition(loadRun(run), capture, altered));
}, 'adversarial');
apply(capture, value);
test('accepted proposal is retained without canonical REL', noCanonicalRelation);
const reserve = rel.selectRelationWork(loadRun(run))!; apply(reserve, null);
const review = rel.selectRelationWork(loadRun(run))!; assert(review.kind === 'worker');
test('L3R delivery binds the exact producer context and review view', () =>
  rel.validateRelationWorkDelivery(loadRun(run), review.call.role, 'S4', review.call.prepared_call_id!,
    review.call.task_line, value.context_id, review.call.allowlist.map((path) => ({ path, bytes: readFileSync(join(run, path)) }))));
test('L3R delivery refuses a substituted producer context', () => assert.throws(() =>
  rel.validateRelationWorkDelivery(loadRun(run), review.call.role, 'S4', review.call.prepared_call_id!,
    review.call.task_line, 'CTX-other', review.call.allowlist.map((path) => ({ path, bytes: readFileSync(join(run, path)) }))),
  /WORK_RELATION_ISOLATION/u), 'adversarial');
test('fresh L3R is selected for the exact unchanged subject', () => {
  assert.equal(review.call.role, 'verifier-l3r'); assert.equal(review.call.producer_dependency, value.call_id);
  assert.equal(review.call.allowlist.length, 1);
  const view = JSON.parse(readFileSync(join(run, review.call.allowlist[0]), 'utf8'));
  assert.deepEqual(view.subject, subject); assert.equal(view.review_subject_digest, core.workDigest(semanticJson(subject)));
  assert(!readFileSync(join(run, review.call.allowlist[0]), 'utf8').includes('Synthetic relation proposal only.'));
});
test('missing L3R blocks closure', () => assert.throws(() => rel.relationClosureEffects(loadRun(run))), 'adversarial');
const verdict = { verdict: 'upheld', rationale: 'Synthetic independent relation challenge.',
  attacks_tried: ['Challenged source kind and the declared absence.'], evidence_ids: [], candidate_evidence: [],
  missing_for_determination: null, flags: [] };
const reviewed = returned(review, verdict, value.context_id);
test('producer context cannot impersonate L3R', () =>
  assert.throws(() => rel.deriveRelationTransition(loadRun(run), review, { ...reviewed, context_id: value.context_id })), 'adversarial');
apply(review, reviewed);
test('L3R publication alone writes no canonical REL', noCanonicalRelation);
test('text-only proposal needs no invented L2F', () => assert.equal(rel.selectRelationWork(loadRun(run)), null));
const closure = rel.relationClosureEffects(loadRun(run));
test('only closure derives the canonical REL and exact USE', () => {
  assert(closure.effects.some((e) => e.path === 'ledgers/relations.md'));
  assert(closure.effects.some((e) => e.path === 'ledgers/representation-uses.md'));
  assert(closure.dependencies.includes(value.call_id)); assert(closure.dependencies.includes(reviewed.call_id));
  noCanonicalRelation();
});
const closed = join(scratch, 'closed'); cpSync(run, closed, { recursive: true });
for (const e of closure.effects) writeFixtureFile(closed, e.path, Buffer.from(e.after_base64, 'base64'));
writeFixtureFile(closed, 'run-log.md', `${readFileSync(join(closed, 'run-log.md'))}\n## 2026-09-26T12:00:00Z — S4 — C1\n\nclosure_phase: S4-C1-relations-closed\n`);
test('ordinary K2.16 validates the reviewed canonical subject', () => {
  rel.validateRelationClosure(loadRun(closed));
  const rows = parseRelations(loadRun(closed)).rows;
  assert.equal(rows.length, 1); assert.equal(rows[0].values.sourceId, packet);
  assert.equal(rows[0].values.reviewSubjectDigest, relationReviewSubjectDigest(rows[0].values));
});
test('S2 seal and predecessor semantic records remain exact', () => {
  assert(readFileSync(join(closed, 'verification/harness/semantic-stage-seals/S2.json')).equals(sourceSeal));
  assert(readFileSync(join(closed, sem.SEMANTIC_PATH)).equals(semanticBefore));
});
test('mutated accepted capture cannot mint another proposal', () => {
  const path = join(run, rel.RELATION_WORK_ROOT, 'capture.json'), before = readFileSync(path);
  const altered = JSON.parse(before.toString()); altered.value.relation_proposals[0].source_id = 'PKT-9999';
  writeFixtureFile(run, path.slice(run.length + 1), semanticJson(altered));
  try { assert.throws(() => rel.relationWorkProposals(loadRun(run)), /WORK_RELATION_BINDING/u); }
  finally { writeFixtureFile(run, path.slice(run.length + 1), before); }
}, 'adversarial');
console.log(JSON.stringify({ result: 'PASS', runtime, cases: cases.length,
  adversarial: cases.filter((c) => c.kind === 'adversarial').length, controls: cases.filter((c) => c.kind === 'control').length,
  scope: 'Synthetic Core relation derivation, not installed dispatch, full C1 composition, or semantic acceptance.', scratch, case_inventory: cases }));

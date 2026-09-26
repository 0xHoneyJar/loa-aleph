#!/usr/bin/env node
// Synthetic Core composition only; installed dispatch and recovery are separate.
import assert from 'node:assert/strict';
import { readFileSync, cpSync, mkdtempSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { duplicateFixtureBase, duplicateFixtureDiscovery, closeDuplicateFixture } from '../../../scripts/duplicate-fixture-support.ts';
import { writeFixtureFile } from '../../../scripts/semantic-fixture-support.ts';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import { mdLineSpan, sourceFilePath } from '../../../scripts/lib/check-helpers.ts';
import { semanticJson } from '../../../scripts/lib/semantic-review.ts';
import { searchBasisDigest, ambiguityReviewSubjectDigest, materialImpactSubjectDigest, parseInternalAmbiguities,
  buildProceduralAuthorityResponse, proceduralAuthorityResponseJson, exactTextBlob, type ProceduralAction,
  type AmbiguityReviewSubject } from '../../../scripts/lib/internal-ambiguity.ts';
import type { NextWork, WorkValue } from '../../../scripts/lib/work-transitions.ts';
const runtime = process.argv.includes('--runtime');
const c08 = process.argv.includes('--c08');
const classB = process.argv.includes('--class-b');
const classC = process.argv.includes('--class-c');
const unresolved = classB || classC;
const core = await import(runtime ? '../../../runtime-js/scripts/lib/work-transitions.js' : '../../../scripts/lib/work-transitions.ts') as typeof import('../../../scripts/lib/work-transitions.ts');
const amb = await import(runtime ? '../../../runtime-js/scripts/lib/work-transitions-ambiguities.js' : '../../../scripts/lib/work-transitions-ambiguities.ts') as typeof import('../../../scripts/lib/work-transitions-ambiguities.ts');
const s4 = await import(runtime ? '../../../runtime-js/scripts/lib/work-transitions-s4.js' : '../../../scripts/lib/work-transitions-s4.ts') as typeof import('../../../scripts/lib/work-transitions-s4.ts');
const authority = await import(runtime ? '../../../runtime-js/scripts/lib/work-transitions-authority.js' : '../../../scripts/lib/work-transitions-authority.ts') as typeof import('../../../scripts/lib/work-transitions-authority.ts');
const scratch = mkdtempSync(join(tmpdir(), 'f03-ambiguity-')); let run = join(scratch, 'before'), serial = 0;
const fixture = duplicateFixtureBase(run, undefined, undefined, { runFormatVersion: '1.9.0-provisional',
  ...(classC ? { sourceId: 'SRC-0701' } : {}), ...(c08 ? { sourceId: 'SRC-001' } : {}) });
duplicateFixtureDiscovery(fixture, []); closeDuplicateFixture(fixture);
const log = readFileSync(join(run, 'run-log.md'), 'utf8');
writeFixtureFile(run, 'run-log.md', log.slice(0, log.indexOf('\n## 2026-09-13 11:10')));
const lock = JSON.parse(readFileSync(join(run, 'control/runtime/bundle/bundle.lock.json'), 'utf8'));
for (const entry of lock.files.filter((e: any) => e.classification === 'core')) {
  const bytes = readFileSync(resolve(entry.path)); assert.equal(core.workDigest(bytes), entry.digest);
  writeFixtureFile(run, `control/runtime/bundle/${entry.path}`, bytes);
}
const cases: Array<{ name: string; kind: string }> = [];
let execution = { stage: 'S4', stage_status: 'running', core_state: 'DISTILLING', blocked: false };
let control: any = { run_id: loadRun(run).manifest!.runId, identity: { run_format_version: '1.9.0-provisional' },
  execution: { ...execution, gate: null, halt: null } };
if (classC) writeFixtureFile(run, 'control/run-state.json', semanticJson(control));
function test(name: string, action: () => void, kind = 'control') { action(); cases.push({ name, kind }); console.log(`PASS ${name}`); }
function apply(work: NextWork, value: WorkValue | null = null) {
  assert(work.kind === 'worker' || work.kind === 'local'); const model = loadRun(run);
  const plan = core.deriveWorkTransition(model, execution, work, value, '2026-09-26T15:00:00Z');
  const after = join(scratch, `after-${serial++}`); cpSync(run, after, { recursive: true });
  for (const e of plan.effects) writeFixtureFile(after, e.path, Buffer.from(e.after_base64, 'base64'));
  core.validateDerivedWorkTransition(model, loadRun(after), plan); run = after;
  execution = plan.next_execution;
  if (classC) {
    control.execution = { ...control.execution, ...execution,
      ...plan.authority ? { gate: plan.authority.gate, halt: plan.authority.halt } : {} };
    writeFixtureFile(run, 'control/run-state.json', semanticJson(control));
  }
}
function returned(work: NextWork, value: unknown, producerContext: string | null = null): WorkValue {
  assert(work.kind === 'worker'); const call = work.call.prepared_call_id!, raw = Buffer.from(semanticJson(value));
  writeFixtureFile(run, `control/worker-returns/${call}/raw.json`, raw);
  return { call_id: call, role: work.call.role, context_id: `CTX-${call}`, producer_context_id: producerContext,
    raw_digest: core.workDigest(raw), receipt_digest: `sha256:${'a'.repeat(64)}`, simulation: true, value: value as WorkValue['value'] };
}
function refuseAfter(work: NextWork, value: unknown) {
  assert(work.kind === 'worker');
  if (value && typeof value === 'object' && 'assessment' in value) {
    const v = value as typeof raw, a = v.assessment;
    const changed = { ...subject, search_completion_ref: a.search_completion_ref, candidate_refs: a.candidate_refs };
    changed.search_basis_digest = searchBasisDigest({ source_id: changed.source_id, source_hash: source.contentHash,
      source_length_bytes: Buffer.from(view.frozen_source_base64, 'base64').length, scope_kind: changed.search_scope_kind, scope_refs: [],
      completion_ref: changed.search_completion_ref, expression_start_byte: changed.expression_start_byte,
      expression_end_byte: changed.expression_end_byte, expression_sha256: changed.expression_sha256,
      basis_packet_ids: changed.basis_packet_ids, candidate_state: changed.candidate_state, candidate_refs: changed.candidate_refs });
    a.search_basis_digest = changed.search_basis_digest;
    a.review_subject_digest = ambiguityReviewSubjectDigest(changed);
  }
  const accepted = returned(work, value), before = loadRun(run);
  assert.throws(() => {
    const plan = core.deriveWorkTransition(before, execution, work, accepted, '2026-09-26T15:00:00Z');
    const after = join(scratch, `refused-${serial++}`); cpSync(run, after, { recursive: true });
    for (const e of plan.effects) writeFixtureFile(after, e.path, Buffer.from(e.after_base64, 'base64'));
    core.validateDerivedWorkTransition(before, loadRun(after), plan);
  }, /WORK_AMBIGUITY/u);
}
const packet = loadRun(run).packets[0].values;
const bytes = Buffer.from(packet.quote), source = loadRun(run).corpus.sources[0].values;
const selection = { format: 'aleph-ambiguity-expression-selection/v1', expressions: [{ source_entity_kind: 'PKT', source_entity_id: packet.packetId,
  source_id: packet.sourceId, locator: packet.locator, start_byte: 0, end_byte: bytes.length, basis_packet_ids: [packet.packetId] }] };
test('C2 first requests a bounded expression selection', () => assert.equal(amb.selectAmbiguityWork(loadRun(run))!.kind, 'proposal'));
test('exact frozen expression selection is valid metadata', () => assert.equal(amb.ambiguityExpressionSelection(loadRun(run), Buffer.from(semanticJson(selection))).length, 1));
for (const [name, fields] of [['wrong source entity', { source_entity_id: 'PKT-9999' }], ['wrong source', { source_id: 'SRC-9999' }],
  ['invalid source span', { end_byte: 999999 }], ['missing packet basis', { basis_packet_ids: [] }], ['caller-supplied meaning', { verdict: 'upheld' }]] as const)
  test(name, () => assert.throws(() => amb.ambiguityExpressionSelection(loadRun(run), Buffer.from(semanticJson({ ...selection,
    expressions: [{ ...selection.expressions[0], ...fields }] })))), 'adversarial');
writeFixtureFile(run, amb.AMBIGUITY_SELECTION_INPUT, semanticJson(selection));
apply(s4.selectS4Work(loadRun(run))); apply(s4.selectS4Work(loadRun(run)));
const producer = s4.selectS4Work(loadRun(run)); assert(producer.kind === 'worker');
const view = JSON.parse(readFileSync(join(run, producer.call.allowlist[0]), 'utf8')), expression = view.expression;
const completion = loadRun(run).sourceWalk.completions[0].values;
const subject: AmbiguityReviewSubject = { source_entity_kind: 'PKT', source_entity_id: packet.packetId, source_id: packet.sourceId,
  expression_locator: expression.locator, expression_start_byte: expression.start_byte, expression_end_byte: expression.end_byte,
  expression_sha256: expression.expression_sha256, expression_bytes_base64: expression.expression_bytes_base64,
  basis_packet_ids: expression.basis_packet_ids, search_scope_kind: 'full-same-source',
  search_completion_ref: `${packet.sourceId}@${completion.finalCursorId}@${completion.sourceHash}`, search_basis_digest: '', candidate_state: unresolved ? 'null-cannot-determine' : 'single',
  candidate_refs: unresolved ? [] : c08 ? [{ kind: 'source-locus', source_id: packet.sourceId, locator: packet.locator,
    span_hash: core.workDigest(mdLineSpan(sourceFilePath(run, source.locus)!, 1, 1)!.bytes!) }]
    : [{ kind: 'PKT', id: packet.packetId }], affected_relation_ids: [], resolution_state: unresolved ? 'unresolved' : 'resolved-local', carry_state: 'none',
  proposed_by: `invocation:${producer.call.prepared_call_id}` };
subject.search_basis_digest = searchBasisDigest({ source_id: subject.source_id, source_hash: source.contentHash,
  source_length_bytes: Buffer.from(view.frozen_source_base64, 'base64').length, scope_kind: subject.search_scope_kind, scope_refs: [],
  completion_ref: subject.search_completion_ref, expression_start_byte: subject.expression_start_byte, expression_end_byte: subject.expression_end_byte,
  expression_sha256: subject.expression_sha256, basis_packet_ids: subject.basis_packet_ids, candidate_state: subject.candidate_state, candidate_refs: subject.candidate_refs });
const raw = { definition: { source_entity_kind: subject.source_entity_kind, source_entity_id: subject.source_entity_id, source_id: subject.source_id,
  expression_locator: subject.expression_locator, expression_start_byte: subject.expression_start_byte, expression_end_byte: subject.expression_end_byte,
  expression_sha256: subject.expression_sha256, expression_bytes_base64: subject.expression_bytes_base64, basis_packet_ids: subject.basis_packet_ids,
  detected_by: subject.proposed_by }, assessment: { search_scope_kind: subject.search_scope_kind, search_source_id: subject.source_id,
  search_completion_ref: subject.search_completion_ref, search_basis_digest: subject.search_basis_digest, candidate_state: subject.candidate_state,
  candidate_refs: subject.candidate_refs, affected_relation_ids: subject.affected_relation_ids, resolution_state: subject.resolution_state,
  carry_state: subject.carry_state, proposed_by: subject.proposed_by, review_subject_digest: ambiguityReviewSubjectDigest(subject) }, flags: [] };
if (c08) {
  for (const id of ['SRC-01', 'SRC-777', 'SRC-0001']) test(`C08 expression rejects ${id}`, () =>
    assert.throws(() => amb.ambiguityExpressionSelection(loadRun(run), Buffer.from(semanticJson({ ...selection,
      expressions: [{ ...selection.expressions[0], source_id: id }] })))), 'adversarial');
  test('C08 duplicate frozen row is rejected by Core selection', () => {
    const duplicate = loadRun(run); duplicate.corpus.sources.push(duplicate.corpus.sources[0]);
    assert.throws(() => amb.ambiguityExpressionSelection(duplicate, Buffer.from(semanticJson(selection))), /WORK_AMBIGUITY_SOURCE/u);
  }, 'adversarial');
  for (const completionRef of [
    subject.search_completion_ref.replace('SRC-001@', 'SRC-0001@'),
    subject.search_completion_ref.replace('CUR-0702', 'CUR-702'),
  ]) test(`C08 completion refuses ${completionRef.split('@').slice(0, 2).join('@')}`, () => {
    const changed = structuredClone(raw); changed.assessment.search_completion_ref = completionRef;
    refuseAfter(producer, changed);
  }, 'adversarial');
  test('C08 search source must equal exact T5.1 source', () => {
    const changed = structuredClone(raw); changed.assessment.search_source_id = 'SRC-0001';
    refuseAfter(producer, changed);
  }, 'adversarial');
  if (!unresolved) for (const [name, candidate] of [
    ['alternate-width alias', { ...subject.candidate_refs[0], source_id: 'SRC-0001' }],
    ['absent source', { ...subject.candidate_refs[0], source_id: 'SRC-777' }],
    ['malformed locator', { ...subject.candidate_refs[0], locator: 'L01-L1' }],
    ['nonexistent locus', { ...subject.candidate_refs[0], locator: 'L999-L999' }],
    ['wrong span hash', { ...subject.candidate_refs[0], span_hash: `sha256:${'0'.repeat(64)}` }],
    ['short PKT', { kind: 'PKT', id: 'PKT-701' }],
  ]) test(`C08 candidate ${name} fails`, () => {
    const changed = structuredClone(raw);
    changed.assessment.candidate_refs = [candidate as AmbiguityReviewSubject['candidate_refs'][number]];
    refuseAfter(producer, changed);
  }, 'adversarial');
  if (!unresolved) test('C08 source-locus cannot cross to another existing frozen source', () => {
    const other = loadRun(run); other.corpus.sources.push({ ...other.corpus.sources[0],
      values: { ...other.corpus.sources[0].values, sourceId: 'SRC-002' } });
    const changed = structuredClone(raw);
    changed.assessment.candidate_refs = [{ kind: 'source-locus', source_id: 'SRC-002', locator: packet.locator,
      span_hash: (subject.candidate_refs[0] as { span_hash: string }).span_hash }];
    const value = returned(producer, changed);
    assert.throws(() => amb.deriveAmbiguityTransition(other, producer, value), /candidate crosses the bound frozen source/u);
  }, 'adversarial');
}
const accepted = returned(producer, raw);
test('changed producer expression fails before canonicalization', () => {
  const changed = structuredClone(accepted); (changed.value as any).definition.expression_start_byte = 1;
  assert.throws(() => amb.deriveAmbiguityTransition(loadRun(run), producer, changed), /WORK_AMBIGUITY_BINDING/u);
}, 'adversarial');
apply(producer, accepted);
test('accepted ambiguity subject creates no canonical T5 rows before fresh review', () => assert.equal(parseInternalAmbiguities(loadRun(run)).t5_2Rows.length, 0));
const reviewer = s4.selectS4Work(loadRun(run)); assert(reviewer.kind === 'worker');
test('fresh ambiguity review is selected with exact producer dependency', () => {
  assert.equal(reviewer.call.role, 'ambiguity-reviewer'); assert.equal(reviewer.call.producer_dependency, accepted.call_id);
});
const verdict = returned(reviewer, { target: `internal-ambiguity-review-subject:${ambiguityReviewSubjectDigest(subject)}`,
  verdict: 'upheld', shown: reviewer.call.allowlist[0], withheld: 'Producer rationale and authority context.', consequence: 'Synthetic upheld exact local resolution.', flags: [] }, accepted.context_id);
test('producer context cannot act as fresh reviewer', () => assert.throws(() => amb.deriveAmbiguityTransition(loadRun(run), reviewer,
  { ...verdict, context_id: accepted.context_id }), /WORK_AMBIGUITY_REVIEW/u), 'adversarial');
apply(reviewer, verdict); apply(s4.selectS4Work(loadRun(run)));
test('upheld exact assessment canonicalizes T5.1 and T5.2', () => {
  const rows = parseInternalAmbiguities(loadRun(run)); assert.equal(rows.t5_1Rows.length, 1); assert.equal(rows.t5_2Rows.length, 1);
  assert.equal(rows.t5_2Rows[0].values.reviewSubjectDigest, ambiguityReviewSubjectDigest(subject));
});
if (c08) test('C08 T5.1, T5.2, completion and reviewed source retain exact SRC-001', () => {
  const rows = parseInternalAmbiguities(loadRun(run));
  assert.equal(rows.t5_1Rows[0].values.sourceId, 'SRC-001');
  assert.equal(rows.t5_2Rows[0].values.searchSourceId, 'SRC-001');
  assert(rows.t5_2Rows[0].values.searchCompletionRef.startsWith('SRC-001@CUR-'));
  assert.equal(loadRun(run).corpus.sources[0].values.sourceId, 'SRC-001');
});
if (unresolved) {
  apply(s4.selectS4Work(loadRun(run)));
  const material = s4.selectS4Work(loadRun(run)); assert(material.kind === 'worker');
  test('unresolved assessment requires a separate material-impact producer', () => assert.equal(material.call.role, 'material-impact-producer'));
  const proposal = returned(material, { materiality_class: classC ? 'C' : 'B', operative_scope: classC ? {
    affected_ids: [packet.packetId], impact_rows: [{ affected_id: packet.packetId, operation_kind: 'load-bearing-reasoning',
      requirement_ref: 'core:docs/precis-wedge.md#Completeness contract (canonical: option A)',
      unresolved_treatment: 'carry-or-restriction', consequence_if_unresolved: 'Synthetic exact evidence use remains contingent.' }],
  } : { affected_ids: [], impact_rows: [] },
    source_locators: classC ? [`${packet.sourceId}:${packet.locator}`] : [], reviewed_unaffected_ids: [], unresolved_statement: 'Synthetic unresolved expression and declared operative impact.',
    proposed_by: `invocation:${material.call.prepared_call_id}`, flags: [] });
  test('material-impact producer identity cannot be substituted', () => {
    const altered = structuredClone(proposal); (altered.value as any).proposed_by = 'invocation:another-call';
    assert.throws(() => amb.deriveAmbiguityTransition(loadRun(run), material, altered), /WORK_AMBIGUITY_BINDING/u);
  }, 'adversarial');
  if (c08 && classC) {
    for (const locator of ['SRC-0001:L1-L1', 'SRC-777:L1-L1', 'SRC-001:L01-L1', 'SRC-001:L999-L999', 'SRC-001:L2-L1']) {
      test(`C08 material refuses ${locator}`, () => {
        const changed = structuredClone(proposal.value) as any; changed.source_locators = [locator];
        refuseAfter(material, changed);
      }, 'adversarial');
    }
    returned(material, proposal.value);
  }
  apply(material, proposal);
  const review = s4.selectS4Work(loadRun(run)); assert(review.kind === 'worker');
  const view = JSON.parse(readFileSync(join(run, review.call.allowlist[0]), 'utf8'));
  test('material class still requires fresh independent material-impact review', () => assert.equal(review.call.role, 'material-impact-reviewer'));
  test('unreviewed material scope is not published as a canonical M subject', () => assert(!loadRun(run).files.some((f) =>
    f.relativePath.startsWith('verification/harness/S4/material-impact-subjects/'))));
  const result = returned(review, { target: `internal-ambiguity-material-impact-review-subject:${materialImpactSubjectDigest(view.subject)}`,
    verdict: 'upheld', shown: review.call.allowlist[0], withheld: 'Human actions and producer rationale.',
    consequence: 'Synthetic exact material scope is upheld.', flags: [] }, proposal.context_id);
  test('material reviewer cannot reuse the producer context', () => assert.throws(() =>
    amb.deriveAmbiguityTransition(loadRun(run), review, { ...result, context_id: proposal.context_id }), /WORK_AMBIGUITY_REVIEW/u), 'adversarial');
  apply(review, result);
  test('reviewed material scope publishes one exact M subject before any authority action', () => {
    assert.equal(loadRun(run).files.filter((f) => f.relativePath.startsWith('verification/harness/S4/material-impact-subjects/')).length, 1);
    assert.equal(parseInternalAmbiguities(loadRun(run)).t5_3Rows.length, 0);
  });
}
if (classC) {
  const next = () => core.selectNextWork(loadRun(run), execution);
  test('Class C requires explicit contact metadata before request creation', () => {
    const work = next(); assert(work.kind === 'proposal'); assert.equal(work.operation, 'ambiguity.authority-contact');
  });
  for (const extra of [{ selected_action: 'carry-unresolved' }, { approved: true }, { destination: 'ledgers/claims.md' }])
    test(`contact cannot supply ${Object.keys(extra)[0]}`, () => assert.throws(() => authority.validateAuthorityContact(Buffer.from(semanticJson({
      format: 'aleph-ambiguity-authority-contact/v1', identity: 'fixture-human-only', ...extra }))), /WORK_AUTHORITY_CONTACT/u), 'adversarial');
  writeFixtureFile(run, authority.authorityContactPath('AMB-0001'), semanticJson({ format: 'aleph-ambiguity-authority-contact/v1', identity: 'fixture-human-only' }));
  apply(next());
  const t52 = readFileSync(join(run, 'ledgers/internal-ambiguities.md'));
  test('exact Class C request opens a halt without inventing an action', () => {
    assert.equal(control.execution.gate.id, 'GATE-S4-AMB-0001-A1-Q1'); assert.equal(control.execution.halt.code, 'HUMAN_AUTHORITY_GATE');
    assert.equal(parseInternalAmbiguities(loadRun(run)).t5_3Rows.length, 0);
  });
  for (const action of ['inspect-source', 'record-human-observation', 'block-at-current-barrier', 'carry-unresolved'] as ProceduralAction[]) {
    const requestPath = control.execution.gate.request_ref, requestBytes = readFileSync(join(run, requestPath));
    const request = JSON.parse(requestBytes.toString());
    const response = buildProceduralAuthorityResponse({ request, request_bytes: requestBytes, authority_identity: 'fixture-human-only',
      selected_action: action, observation: action === 'record-human-observation' ? exactTextBlob(Buffer.from('Fixture observation only; not evidence.')) : null,
      comment: null, recorded_at: '2026-09-26T15:01:00Z' });
    const responsePath = `control/gates/${request.request_id}-response.json`;
    writeFixtureFile(run, responsePath, proceduralAuthorityResponseJson(response));
    control.execution.gate = { ...control.execution.gate, status: 'approved', response_ref: responsePath };
    control.execution.halt = { code: 'S4_C2_RESPONSE_APPLICATION_REQUIRED', reason: 'Synthetic Core test response awaits application.',
      at: '2026-09-26T15:01:00Z', blocking: true };
    execution.blocked = true;
    writeFixtureFile(run, 'control/run-state.json', semanticJson(control));
    const work = next(); assert(work.kind === 'local'); assert.equal(work.obligation.operation, 's4.ambiguity.apply-authority');
    apply(work);
    test(`${action} applies one exact T5.3 action and preserves T5.2`, () => {
      const rows = parseInternalAmbiguities(loadRun(run)); assert.equal(rows.t5_3Rows.at(-1)!.values.action, action);
      assert(readFileSync(join(run, 'ledgers/internal-ambiguities.md')).subarray(0, t52.length - 1).equals(t52.subarray(0, t52.length - 1)));
    });
    test(`${action} cannot replay its consumed work basis`, () => assert.throws(() =>
      core.deriveWorkTransition(loadRun(run), execution, work, null, '2026-09-26T15:01:00Z'), /WORK_STALE/u), 'adversarial');
    if (action !== 'carry-unresolved') {
      const followup = next(); assert(followup.kind === 'local'); assert.equal(followup.obligation.operation, 's4.ambiguity.followup-authority');
      apply(followup);
      test(`${action} followup retains authority subject and increments only Q`, () => {
        const nextRequest = JSON.parse(readFileSync(join(run, control.execution.gate.request_ref), 'utf8'));
        assert.equal(nextRequest.authority_subject_digest, request.authority_subject_digest);
        assert.equal(nextRequest.request_id, request.request_id.replace(/Q(\d+)$/u, (_: string, q: string) => `Q${Number(q) + 1}`));
        assert.equal(control.execution.halt.code, 'HUMAN_AUTHORITY_GATE');
      });
    }
  }
}
const beforeSeals = new Map(['ledgers/relations.md', 'ledgers/semantic-review.md', 'ledgers/duplicate-review.md', 'ledgers/representation-uses.md']
  .map((p) => [p, readFileSync(join(run, p))]));
for (const phase of ['s4.close-C2', 's4.close-C3', 's4.enter-S5']) {
  const work = s4.selectS4Work(loadRun(run)); assert(work.kind === 'local'); assert.equal(work.obligation.operation, phase);
  apply(work); test(`${phase} preserves the C1 seals`, () => { for (const [p, b] of beforeSeals) assert(readFileSync(join(run, p)).equals(b)); });
}
test('S5 produces only an explicit unsupported-capability halt', () => {
  const next = core.selectNextWork(loadRun(run), { stage: 'S5', stage_status: 'entered', core_state: 'DISTILLING', blocked: false });
  assert(next.kind === 'halt'); assert.equal(next.code, 'WORK_UNSUPPORTED_CAPABILITY');
});
console.log(JSON.stringify({ result: 'PASS', runtime, classB, classC, cases: cases.length, adversarial: cases.filter((c) => c.kind === 'adversarial').length,
  case_inventory: cases, scratch, scope: `Synthetic Core C2 ${classC ? 'Class C procedural Q followups' : classB ? 'Class B material review' : 'resolved-local'} composition and C3/S5 boundary; not installed transport or M/A revision coverage.` }));

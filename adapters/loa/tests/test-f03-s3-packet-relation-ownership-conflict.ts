#!/usr/bin/env node
// C-06 discriminator only. No relation ownership policy is selected here.
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import { mdLineSpan } from '../../../scripts/lib/check-helpers.ts';
import { makeFragmentSemanticFixture, sealFixtureSemanticStage, writeFixtureFile,
  fixtureSemantics, MANUAL_REVIEWER, TEXT_USE } from '../../../scripts/semantic-fixture-support.ts';
import type { WorkExecution, WorkTransition, WorkValue } from '../../../scripts/lib/work-transitions.ts';
import type { RelationProjection, SemanticEntry } from '../../../scripts/lib/semantic-review.ts';

const runtime = process.argv.includes('--runtime');
const sem = await import(runtime ? '../../../runtime-js/scripts/lib/semantic-review.js' : '../../../scripts/lib/semantic-review.ts') as typeof import('../../../scripts/lib/semantic-review.ts');
const core = await import(runtime ? '../../../runtime-js/scripts/lib/work-transitions.js' : '../../../scripts/lib/work-transitions.ts') as typeof import('../../../scripts/lib/work-transitions.ts');
const widening = await import(runtime ? '../../../runtime-js/scripts/lib/packet-widening.js' : '../../../scripts/lib/packet-widening.ts') as typeof import('../../../scripts/lib/packet-widening.ts');
const relations = await import(runtime ? '../../../runtime-js/scripts/lib/checks-k2-relations.js' : '../../../scripts/lib/checks-k2-relations.ts') as typeof import('../../../scripts/lib/checks-k2-relations.ts');
const scratch = mkdtempSync(join(tmpdir(), 'f03-c06-ownership-'));
const base = join(scratch, 'before'), fixture = makeFragmentSemanticFixture(base, undefined, undefined, '1.9.0-provisional');
sealFixtureSemanticStage(fixture, 'S2');
writeFixtureFile(base, 'run-log.md', readFileSync(join(base, 'run-log.md'), 'utf8')
  + '\n## 2026-09-19 12:00 UTC — S3 — entry\nSynthetic C-06 discriminator, no native execution.\n');
const parentCall = `CALL-F03-${'a'.repeat(64)}`;
const binding = `control/semantic-producer-bindings/${parentCall}/claim-candidate-0.json`;
const original = { claims: [{ normalized_claim: 'The counter rose.', packets: ['PKT-0701'], claim_type: 'factual',
  widen_requests: [{ packet: 'PKT-0701', new_locator: 'L1-L2' }], rationale: 'Synthetic required packet context.',
  flags: [], material_use: TEXT_USE }], no_claim_packets: [], lineage_proposals: [], material_findings: [],
  semantic_units: [{ output_kind: 'claim-candidate', output_index: 0, review_mode: 'proposal',
    origin_unit_refs: ['SEM-0701/U1'], anchors: [fixture.entry.anchors[0]], semantics: fixtureSemantics('The counter rose.') }] };
const originalBytes = Buffer.from(sem.semanticJson(original)), originalHash = core.workDigest(originalBytes);
writeFixtureFile(base, `control/worker-returns/${parentCall}/raw.json`, originalBytes);
writeFixtureFile(base, `verification/harness/work-captures/S3/${parentCall}.json`, core.workJson({
  format: 'aleph-s3-work-capture/v1', call_id: parentCall, origin_semantic_id: 'SEM-0701', raw_digest: originalHash,
  context_id: 'synthetic-normalizer', producer_context_id: null, receipt_digest: `sha256:${'b'.repeat(64)}`, simulation: true,
  selectors: [{ output_kind: 'claim-candidate', output_index: '0', reserved_claim_id: 'CC-0701', binding_path: binding }],
}));
writeFixtureFile(base, binding, sem.semanticJson({ call_id: parentCall, context_id: 'synthetic-normalizer',
  raw_return_hash: originalHash, output_kind: 'claim-candidate', output_index: 0 }));
writeFixtureFile(base, `control/worker-returns/${parentCall}/native-dispatch.json`, JSON.stringify({ receipt: { context_id: 'synthetic-normalizer' } }));
writeFixtureFile(base, `control/worker-bundles/${parentCall}/request.json`, JSON.stringify({ role: 'normalizer' }));
writeFixtureFile(base, 'control/run-state.json', core.workJson({ full_mode: 'fixture-simulated',
  identity: { profile: { id: MANUAL_REVIEWER.profile_id, digest: null }, models: { 'verifier-l2s': 'human' } } }));
const execution: WorkExecution = { stage: 'S3', stage_status: 'entered', core_state: 'DISTILLING', blocked: false };
let assertions = 0;
function check(condition: unknown, message: string): asserts condition { assert(condition, message); assertions++; }
function apply(run: string, plan: WorkTransition, name: string): string {
  const next = join(scratch, name); cpSync(run, next, { recursive: true });
  for (const effect of plan.effects) writeFixtureFile(next, effect.path, Buffer.from(effect.after_base64, 'base64'));
  core.validateDerivedWorkTransition(loadRun(run), loadRun(next), plan);
  return next;
}
const basis = widening.derivePacketWideningBasis(loadRun(base), parentCall, 0, 0);
const preparation = core.deriveWorkTransition(loadRun(base), execution, core.selectNextWork(loadRun(base), execution), null, '2026-09-19T12:01:00Z');
const prepared = apply(base, preparation, 'prepared'), worker = core.selectNextWork(loadRun(prepared), execution);
check(worker.kind === 'worker' && worker.obligation.operation === 's3.capture-widening', 'dedicated S3 widening work required');
const call = widening.wideningCallId(basis), evidence: Array<Record<string, unknown>> = [];
for (const owner of ['control-no-relation', 'S3', 'S2'] as const) {
  const run = join(scratch, `producer-${owner}`); cpSync(prepared, run, { recursive: true });
  const packet = structuredClone((fixture.returned.packets as Array<Record<string, unknown>>)[0]);
  Object.assign(packet, { join_policy: 'single-fragment', fragments: [{ fragment_order: 1,
    locator: basis.request.new_locator, exact_bytes_base64: basis.exact_bytes_base64 }],
    rendered_text: 'The counter rose. Unrelated surrounding text.' });
  const entry: SemanticEntry = { output_kind: 'packet-candidate', output_index: 0, review_mode: 'proposal',
    origin_unit_refs: [], anchors: [fixture.entry.anchors[0]], semantics: fixtureSemantics('The counter rose.') };
  if (owner !== 'control-no-relation') {
    const target = mdLineSpan(join(run, basis.source_path), 1, 1)!;
    const subject: RelationProjection['subject'] = { format: 'aleph-relation-review-subject/v1',
      owner_stage: owner, family: 'source-context', type: 'qualifier-context', source_kind: 'PKT',
      source_id: 'PKT-0703', target_kind: 'source-locus', target_id: 'none', target_source_id: basis.source_id,
      target_locator: 'L1-L1', target_span_hash: core.workDigest(target.bytes!), record_state: 'asserted',
      null_reason: 'none', basis_packet_ids: ['PKT-0703'], proposed_by: `invocation:${call}` };
    entry.semantics.relation_proposals.push({ subject, review_subject_digest: core.workDigest(sem.semanticJson(subject)), material_use: TEXT_USE });
  }
  const returned = { format: widening.WIDENING_RETURN_FORMAT, source_id: basis.source_id, producer_invocation_id: call,
    packets: [packet], material_findings: [], semantic_units: [entry] };
  const raw = Buffer.from(sem.semanticJson(returned));
  const checked = sem.validateSemanticReturn('extractor', '1.9.0-provisional', returned, sem.packetWideningProducerView(loadRun(run), basis).context);
  check(checked.result === 'PASS' && checked.binding === 'checked', checked.errors.join('; '));
  writeFixtureFile(run, `control/worker-returns/${call}/raw.json`, raw);
  writeFixtureFile(run, `control/worker-returns/${call}/native-dispatch.json`, JSON.stringify({ receipt: { context_id: 'synthetic-widening' } }));
  writeFixtureFile(run, `control/worker-bundles/${call}/request.json`, JSON.stringify({ role: 'extractor' }));
  const accepted: WorkValue = { call_id: call, role: 'extractor', context_id: 'synthetic-widening', producer_context_id: null,
    raw_digest: core.workDigest(raw), receipt_digest: `sha256:${'c'.repeat(64)}`, simulation: true, value: returned as unknown as WorkValue['value'] };
  const capture = core.deriveWorkTransition(loadRun(run), execution, worker, accepted, '2026-09-19T12:02:00Z');
  const captured = apply(run, capture, `captured-${owner}`), model = loadRun(captured);
  const reserve = core.selectNextWork(model, execution);
  check(reserve.kind === 'local' && reserve.obligation.operation === 'sem.reserve-widening', 'new packet needs its own semantic subject');
  let failure: string | null = null, plan: WorkTransition | null = null;
  try { plan = core.deriveWorkTransition(model, execution, reserve, null, '2026-09-19T12:03:00Z'); }
  catch (error) { failure = String(error); }
  const rowProblems = owner === 'control-no-relation' ? [] : relations.relationProposalProblems(model,
    sem.semanticRelationRow(entry.semantics.relation_proposals[0]), true);
  if (owner === 'control-no-relation') {
    check(plan !== null && failure === null, 'ordinary widened packet semantic subject must build');
    const reserved = apply(captured, plan!, 'control-reserved');
    check(sem.parseSemanticLedger(readFileSync(join(reserved, sem.SEMANTIC_PATH), 'utf8')).subjects.at(-1)!.owner_stage === 'S3', 'C05 semantic owner is S3');
  } else if (owner === 'S3') {
    check(rowProblems.length === 1 && rowProblems[0].includes('S3 relation proposals require a CC source'), JSON.stringify(rowProblems));
    check(Boolean(failure?.includes('S3 relation proposals require a CC source')), failure || 'unexpected successful subject');
  } else {
    check(rowProblems.length === 0, 'S2 packet relation itself satisfies existing Slice 4');
    check(Boolean(failure?.includes('existing source/stage bounds')), failure || 'unexpected successful subject');
  }
  for (const path of ['ledgers/source-walk.md', 'ledgers/semantic-review.md', 'verification/harness/semantic-stage-seals/S2.json',
    'ledgers/claim-inventory.md', `control/worker-returns/${parentCall}/raw.json`])
    check(readFileSync(join(captured, path)).equals(readFileSync(join(run, path))), `${owner}: immutable history changed: ${path}`);
  check(readFileSync(join(captured, `control/worker-returns/${call}/raw.json`)).equals(raw), 'widening producer remains exact');
  check(model.claims.length === 0, 'no canonical claim is invented');
  check(capture.effects.every((effect) => effect.path !== 'ledgers/relations.md'), 'no canonical relation is invented');
  evidence.push({ variant: owner, producer_validation: checked.result, producer_binding: checked.binding,
    producer_raw_digest: core.workDigest(raw), semantic_owner: 'S3', output_selector: 'packet-candidate:0',
    original_claim_selector: basis.output_selector, new_packet_ids: widening.packetWideningCaptures(model)[0].selectors[0].packet_ids,
    declared_relation: entry.semantics.relation_proposals, relation_proposal_problems: rowProblems,
    semantic_construction_error: failure, canonical_claim_count: model.claims.length,
    s2_seal_digest: core.workDigest(readFileSync(join(captured, 'verification/harness/semantic-stage-seals/S2.json'))),
    canonical_packet_capture_completed: true, review_subject_created: plan !== null });
}
console.log(JSON.stringify({ result: 'EXPECTED_CONTRACT_CONFLICT', conflict: 'C-06', runtime, assertions,
  scope: 'synthetic Core transition discriminator; not native or installed production evidence',
  scratch, evidence }, null, 2));

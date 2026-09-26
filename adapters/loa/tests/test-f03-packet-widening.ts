#!/usr/bin/env node
// Synthetic Core transitions only; installed command/recovery is exercised separately.
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import { mdLineSpan } from '../../../scripts/lib/check-helpers.ts';
import { makeFragmentSemanticFixture, sealFixtureSemanticStage, writeFixtureFile,
  fixtureSemantics, fixtureResult, fixtureReview, MANUAL_REVIEWER, TEXT_USE } from '../../../scripts/semantic-fixture-support.ts';
import type { WorkExecution, WorkTransition, WorkValue } from '../../../scripts/lib/work-transitions.ts';
import type { SemanticEntry, SemanticSubject, SemanticAssignment } from '../../../scripts/lib/semantic-review.ts';
const runtime = process.argv.includes('--runtime');
const sem = await import(runtime ? '../../../runtime-js/scripts/lib/semantic-review.js' : '../../../scripts/lib/semantic-review.ts') as typeof import('../../../scripts/lib/semantic-review.ts');
const core = await import(runtime ? '../../../runtime-js/scripts/lib/work-transitions.js' : '../../../scripts/lib/work-transitions.ts') as typeof import('../../../scripts/lib/work-transitions.ts');
const widening = await import(runtime ? '../../../runtime-js/scripts/lib/packet-widening.js' : '../../../scripts/lib/packet-widening.ts') as typeof import('../../../scripts/lib/packet-widening.ts');
const rep = await import(runtime ? '../../../runtime-js/scripts/lib/source-representation.js' : '../../../scripts/lib/source-representation.ts') as typeof import('../../../scripts/lib/source-representation.ts');
const scratch = mkdtempSync(join(tmpdir(), 'f03-c05-binding-'));
const run = join(scratch, 'before'), fixture = makeFragmentSemanticFixture(run, undefined, undefined, '1.9.0-provisional');
sealFixtureSemanticStage(fixture, 'S2');
writeFixtureFile(run, 'run-log.md', readFileSync(join(run, 'run-log.md'), 'utf8')
  + '\n## 2026-09-18 12:00 UTC — S3 — entry\nSynthetic C-05 transition fixture.\n');
const parentCall = `CALL-F03-${'a'.repeat(64)}`, bindingPath = `control/semantic-producer-bindings/${parentCall}/claim-candidate-0.json`;
const original = { claims: [{ normalized_claim: 'The counter rose.', packets: ['PKT-0701'], claim_type: 'factual',
  widen_requests: [{ packet: 'PKT-0701', new_locator: 'L1-L2' }], rationale: 'Synthetic required packet context.',
  flags: [], material_use: TEXT_USE }], no_claim_packets: [], lineage_proposals: [], material_findings: [],
  semantic_units: [{ output_kind: 'claim-candidate', output_index: 0, review_mode: 'proposal',
    origin_unit_refs: ['SEM-0701/U1'], anchors: [fixture.entry.anchors[0]], semantics: fixtureSemantics('The counter rose.') }] };
const originalBytes = Buffer.from(sem.semanticJson(original)), originalHash = core.workDigest(originalBytes);
writeFixtureFile(run, `control/worker-returns/${parentCall}/raw.json`, originalBytes);
writeFixtureFile(run, `verification/harness/work-captures/S3/${parentCall}.json`, core.workJson({
  format: 'aleph-s3-work-capture/v1', call_id: parentCall, origin_semantic_id: 'SEM-0701', raw_digest: originalHash,
  context_id: 'synthetic-normalizer', producer_context_id: null, receipt_digest: `sha256:${'b'.repeat(64)}`, simulation: true,
  selectors: [{ output_kind: 'claim-candidate', output_index: '0', reserved_claim_id: 'CC-0701', binding_path: bindingPath }],
}));
writeFixtureFile(run, bindingPath, sem.semanticJson({ call_id: parentCall, context_id: 'synthetic-normalizer',
  raw_return_hash: originalHash, output_kind: 'claim-candidate', output_index: 0 }));
writeFixtureFile(run, `control/worker-returns/${parentCall}/native-dispatch.json`, JSON.stringify({ receipt: { context_id: 'synthetic-normalizer' } }));
writeFixtureFile(run, `control/worker-bundles/${parentCall}/request.json`, JSON.stringify({ role: 'normalizer' }));
writeFixtureFile(run, 'control/run-state.json', core.workJson({ full_mode: 'fixture-simulated',
  identity: { profile: { id: MANUAL_REVIEWER.profile_id, digest: null }, models: { 'verifier-l2s': 'human' } } }));
const execution: WorkExecution = { stage: 'S3', stage_status: 'entered', core_state: 'DISTILLING', blocked: false };
let count = 0;
function test(name: string, action: () => void) { action(); count++; console.log(`PASS C05 ${name}`); }
function apply(root: string, plan: WorkTransition, name: string): string {
  const next = join(scratch, name); cpSync(root, next, { recursive: true });
  for (const effect of plan.effects) writeFixtureFile(next, effect.path, Buffer.from(effect.after_base64, 'base64'));
  core.validateDerivedWorkTransition(loadRun(root), loadRun(next), plan);
  return next;
}
const model = loadRun(run), basis = widening.derivePacketWideningBasis(model, parentCall, 0, 0);
test('valid retained request binds original selector, exact bytes and completed S2 coverage', () => {
  assert.equal(basis.output_selector, 'claim-candidate:0'); assert.equal(basis.source_id, 'SRC-701');
  assert.equal(Buffer.from(basis.exact_bytes_base64, 'base64').toString(), 'The counter rose.\nUnrelated surrounding text.\n');
  widening.validatePacketWideningBasis(model, basis);
});
const selected = core.selectNextWork(model, execution);
test('normalizer widening is first unmet work before claim admission', () => {
  assert.equal(selected.kind, 'local'); if (selected.kind !== 'local') throw Error('fixture');
  assert.equal(selected.obligation.operation, 's3.prepare-widening');
});
const preparation = core.deriveWorkTransition(model, execution, selected, null, '2026-09-18T12:01:00Z');
const prepared = apply(run, preparation, 'prepared'), worker = core.selectNextWork(loadRun(prepared), execution);
test('dedicated producer is S3 and bounded to its exact Core view', () => {
  assert.equal(worker.kind, 'worker'); if (worker.kind !== 'worker') throw Error('fixture');
  assert.equal(worker.obligation.operation, 's3.capture-widening'); assert.equal(worker.call.role, 'extractor');
  assert.equal(worker.call.task_line, widening.WIDENING_TASK); assert.equal(worker.call.output_selector, widening.WIDENING_CONTRACT);
  assert.equal(worker.call.allowlist.length, 1);
});
assert(worker.kind === 'worker');
const call = widening.wideningCallId(basis);
const packet = structuredClone((fixture.returned.packets as Array<Record<string, unknown>>)[0]);
Object.assign(packet, { join_policy: 'single-fragment', fragments: [{ fragment_order: 1, locator: basis.request.new_locator,
  exact_bytes_base64: basis.exact_bytes_base64 }], rendered_text: 'The counter rose. Unrelated surrounding text.' });
const entry: SemanticEntry = { output_kind: 'packet-candidate', output_index: 0, review_mode: 'proposal',
  origin_unit_refs: [], anchors: [fixture.entry.anchors[0]], semantics: fixtureSemantics('The counter rose.') };
const producer = { format: widening.WIDENING_RETURN_FORMAT, source_id: 'SRC-701', producer_invocation_id: call,
  packets: [packet], material_findings: [], semantic_units: [entry] };
const producerBytes = Buffer.from(sem.semanticJson(producer));
const accepted: WorkValue = { call_id: call, role: 'extractor', context_id: 'synthetic-widening', producer_context_id: null,
  raw_digest: core.workDigest(producerBytes), receipt_digest: `sha256:${'c'.repeat(64)}`, simulation: true,
  value: producer as unknown as WorkValue['value'] };
writeFixtureFile(prepared, `control/worker-returns/${call}/raw.json`, producerBytes);
writeFixtureFile(prepared, `control/worker-returns/${call}/native-dispatch.json`, JSON.stringify({ receipt: { context_id: accepted.context_id } }));
writeFixtureFile(prepared, `control/worker-bundles/${call}/request.json`, JSON.stringify({ role: 'extractor' }));
test('dedicated return receives complete context-bound semantic validation', () => {
  const checked = sem.validateSemanticReturn('extractor', '1.9.0-provisional', producer,
    sem.packetWideningProducerView(loadRun(prepared), basis).context);
  assert.equal(checked.result, 'PASS', checked.errors.join('; ')); assert.equal(checked.binding, 'checked');
});
const capture = core.deriveWorkTransition(loadRun(prepared), execution, worker, accepted, '2026-09-18T12:02:00Z');
const captured = apply(prepared, capture, 'captured');
test('one new PKT and existing replace lineage; original packet remains immutable', () => {
  const after = loadRun(captured);
  assert.equal(after.packets.length, model.packets.length + 1);
  assert.deepEqual(after.packets.slice(0, model.packets.length).map((row) => row.cells), model.packets.map((row) => row.cells));
  assert(widening.isPostS2WidenedPacket(after, 'PKT-0703'));
  assert(!widening.isPostS2WidenedPacket(after, 'PKT-0701'));
});
test('capture does not change S2 seal, semantic prefix, source walk, original return, CC or REL', () => {
  for (const path of ['verification/harness/semantic-stage-seals/S2.json', 'ledgers/semantic-review.md',
    'ledgers/source-walk.md', 'ledgers/claim-inventory.md', `control/worker-returns/${parentCall}/raw.json`])
    assert(readFileSync(join(captured, path)).equals(readFileSync(join(prepared, path))));
  assert.equal(loadRun(captured).claims.length, 0);
  assert(capture.effects.every((effect) => !effect.path.includes('relations')));
});
test('S3 PKT receipt is strict and owned by the widening invocation', () => {
  const after = loadRun(captured), context = rep.readRepresentationContext(after);
  const use = context.uses.find((row) => row.subject_id === 'PKT-0703')!;
  assert.equal(use.owner_stage, 'S3'); assert.equal(use.established_by, call);
  rep.validateRepresentationUse(after, context, use);
  assert.throws(() => rep.validateRepresentationUse(after, context, { ...use, established_by: parentCall }));
  assert.throws(() => rep.validateRepresentationUse(after, context, { ...use, use_state: 'CANNOT_DETERMINE', reason: 'Missing material.' }));
});
const reserve = core.selectNextWork(loadRun(captured), execution);
test('changed packet bytes require their own S3 packet semantic subject', () => {
  assert.equal(reserve.kind, 'local'); if (reserve.kind !== 'local') throw Error('fixture');
  assert.equal(reserve.obligation.operation, 'sem.reserve-widening');
});
const reservation = core.deriveWorkTransition(loadRun(captured), execution, reserve, null, '2026-09-18T12:03:00Z');
const reserved = apply(captured, reservation, 'reserved');
test('fresh subject binds new PKT and widening bytes, not the old review', () => {
  const subjects = sem.parseSemanticLedger(readFileSync(join(reserved, sem.SEMANTIC_PATH), 'utf8')).subjects;
  const row = subjects.at(-1)!;
  const subject = JSON.parse(readFileSync(join(reserved, row.subject_path), 'utf8'));
  assert.equal(subject.owner_stage, 'S3'); assert.equal(subject.subject_kind, 'packet-group');
  assert.deepEqual(subject.output_binding.packet_ids, ['PKT-0703']);
  assert.notEqual(subject.producer_binding_hash, fixture.subject.producer_binding_hash);
  assert.equal(loadRun(reserved).claims.length, 0);
});
function review(root: string, verdict: 'upheld' | 'refuted' | 'cannot-determine' = 'upheld'): string {
  const next = join(scratch, `manual-reviewed-${count}-${verdict}`); cpSync(root, next, { recursive: true });
  const ledger = sem.parseSemanticLedger(readFileSync(join(next, sem.SEMANTIC_PATH), 'utf8'));
  const row = ledger.subjects.at(-1)!;
  const subject = JSON.parse(readFileSync(join(next, row.subject_path), 'utf8')) as SemanticSubject;
  const producer = JSON.parse(readFileSync(join(next, row.producer_receipt_ref.split('@')[0]), 'utf8'));
  const result = fixtureResult(subject);
  result.verdict = verdict; result.field_reviews[0].verdict = verdict;
  result.field_reviews[0].issue = verdict === 'upheld' ? 'none' : 'insufficient-context';
  if (verdict === 'cannot-determine') {
    result.missing_for_determination = 'Synthetic insufficient packet context.';
    result.unresolved_findings = [{ finding_id: 'F1', field_path: '/semantics/atomicity', code: 'atomicity-indeterminate',
      anchor_ids: ['A1'], material_requirement_indexes: [], unknown_dimension: 'none',
      missing: result.missing_for_determination, requested_context: [] }];
  }
  const id = `VER-${String(702 + ledger.results.length).padStart(4, '0')}`;
  const assignment: SemanticAssignment = { ...fixture.assignment, semantic_id: subject.semantic_id,
    subject_digest: core.workDigest(sem.semanticJson(subject)), producer_binding_hash: subject.producer_binding_hash,
    review_id: id, execution_kind: 'manual-separate-pass' };
  const f = { ...fixture, run: next, subject, producer, ledger, assignment, result };
  for (let index = 0; index < (verdict === 'cannot-determine' ? 2 : 1); index++) {
    const reviewId = `VER-${String(Number(id.slice(4)) + index).padStart(4, '0')}`;
    fixtureReview(f, result, reviewId);
    const call = `manual-pass-${reviewId}`;
    writeFixtureFile(next, `control/worker-returns/${call}/raw.json`, sem.semanticJson(result));
    writeFixtureFile(next, `control/worker-returns/${call}/native-dispatch.json`, JSON.stringify({ receipt: { context_id: call } }));
    writeFixtureFile(next, `control/worker-bundles/${call}/request.json`, JSON.stringify({ role: 'verifier-l2s' }));
  }
  sem.validateSemanticRun(loadRun(next));
  return next;
}
for (const verdict of ['refuted', 'cannot-determine'] as const) test(`${verdict} packet review preserves blocked original claim and S2 history`, () => {
  const reviewed = review(reserved, verdict), work = core.selectNextWork(loadRun(reviewed), execution);
  assert(work.kind === 'local' && work.obligation.operation === 'sem.resolve');
  const plan = core.deriveWorkTransition(loadRun(reviewed), execution, work, null, '2026-09-18T12:04:00Z');
  const resolved = apply(reviewed, plan, `resolved-${verdict}`);
  const halted = core.selectNextWork(loadRun(resolved), execution);
  assert(halted.kind === 'halt' && halted.code === 'WORK_WIDENING_PACKET_UNRESOLVED');
  assert.equal(loadRun(resolved).claims.length, 0);
  assert(readFileSync(join(resolved, 'verification/harness/semantic-stage-seals/S2.json')).equals(readFileSync(join(run, 'verification/harness/semantic-stage-seals/S2.json'))));
});
const reviewed = review(reserved), resolveWork = core.selectNextWork(loadRun(reviewed), execution);
const resolution = core.deriveWorkTransition(loadRun(reviewed), execution, resolveWork, null, '2026-09-18T12:05:00Z');
const packetAdmitted = apply(reviewed, resolution, 'packet-admitted');
test('upheld widened packet does not admit or alter original normalized claim', () => {
  assert.equal(loadRun(packetAdmitted).claims.length, 0);
  assert(readFileSync(join(packetAdmitted, `control/worker-returns/${parentCall}/raw.json`)).equals(originalBytes));
});
const originalReservationWork = core.selectNextWork(loadRun(packetAdmitted), execution);
const originalReservation = core.deriveWorkTransition(loadRun(packetAdmitted), execution, originalReservationWork, null, '2026-09-18T12:06:00Z');
const originalReserved = apply(packetAdmitted, originalReservation, 'original-reserved');
test('original claim selector retains its own semantic review obligation', () => {
  const ledger = sem.parseSemanticLedger(readFileSync(join(originalReserved, sem.SEMANTIC_PATH), 'utf8'));
  assert.equal(ledger.subjects.at(-1)!.producer_receipt_ref.split('@')[0], bindingPath);
  assert.equal(core.selectNextWork(loadRun(originalReserved), execution).kind, 'local');
});
const originalReviewed = review(originalReserved), revisionWork = core.selectNextWork(loadRun(originalReviewed), execution);
let revisionPrepared = '';
test('reviewed original proposal requests fresh normalization against new packet identity', () => {
  assert(revisionWork.kind === 'local' && revisionWork.obligation.operation === 's3.prepare-widening-revision');
  const revisionPlan = core.deriveWorkTransition(loadRun(originalReviewed), execution, revisionWork, null, '2026-09-18T12:07:00Z');
  revisionPrepared = apply(originalReviewed, revisionPlan, 'revision-prepared');
  const work = core.selectNextWork(loadRun(revisionPrepared), execution);
  assert(work.kind === 'worker' && work.call.role === 'normalizer' && work.call.prepared_call_id !== parentCall);
  assert.equal(loadRun(revisionPrepared).claims.length, 0);
});
const freshWork = core.selectNextWork(loadRun(revisionPrepared), execution);
assert(freshWork.kind === 'worker');
const freshCall = freshWork.call.prepared_call_id!;
const packetSubject = sem.parseSemanticLedger(readFileSync(join(revisionPrepared, sem.SEMANTIC_PATH), 'utf8')).subjects
  .find((row) => row.owner_stage === 'S3' && row.subject_kind === 'packet-group')!;
const freshReturn = structuredClone(original);
freshReturn.claims[0].packets = ['PKT-0703']; freshReturn.claims[0].widen_requests = [];
freshReturn.semantic_units[0].origin_unit_refs = [`${packetSubject.semantic_id}/U1`];
const freshBytes = Buffer.from(sem.semanticJson(freshReturn));
writeFixtureFile(revisionPrepared, `control/worker-returns/${freshCall}/raw.json`, freshBytes);
writeFixtureFile(revisionPrepared, `control/worker-returns/${freshCall}/native-dispatch.json`, JSON.stringify({ receipt: { context_id: 'synthetic-revision' } }));
writeFixtureFile(revisionPrepared, `control/worker-bundles/${freshCall}/request.json`, JSON.stringify({ role: 'normalizer' }));
const freshAccepted: WorkValue = { ...accepted, call_id: freshCall, role: 'normalizer', context_id: 'synthetic-revision',
  raw_digest: core.workDigest(freshBytes), value: freshReturn as unknown as WorkValue['value'] };
const freshCapturePlan = core.deriveWorkTransition(loadRun(revisionPrepared), execution, freshWork, freshAccepted, '2026-09-18T12:08:00Z');
const freshCaptured = apply(revisionPrepared, freshCapturePlan, 'fresh-captured');
const freshReserveWork = core.selectNextWork(loadRun(freshCaptured), execution);
const freshReservePlan = core.deriveWorkTransition(loadRun(freshCaptured), execution, freshReserveWork, null, '2026-09-18T12:09:00Z');
const freshReserved = apply(freshCaptured, freshReservePlan, 'fresh-reserved');
const linkWork = core.selectNextWork(loadRun(freshReserved), execution);
test('mechanically superseded original reservation links new proposal without canonical CC', () => {
  assert(linkWork.kind === 'local' && linkWork.obligation.operation === 'sem.resolve-widening-revision');
});
const linkPlan = core.deriveWorkTransition(loadRun(freshReserved), execution, linkWork, null, '2026-09-18T12:10:00Z');
const linked = apply(freshReserved, linkPlan, 'revision-linked');
test('fresh revision cannot be admitted before its own L2S', () => {
  assert.equal(loadRun(linked).claims.length, 0);
  const work = core.selectNextWork(loadRun(linked), execution);
  assert(work.kind === 'local' && work.obligation.operation === 'sem.assign');
});
const freshReviewed = review(linked), freshResolveWork = core.selectNextWork(loadRun(freshReviewed), execution);
const freshResolvePlan = core.deriveWorkTransition(loadRun(freshReviewed), execution, freshResolveWork, null, '2026-09-18T12:11:00Z');
const freshAdmitted = apply(freshReviewed, freshResolvePlan, 'fresh-admitted');
test('only freshly reviewed normalizer revision can create a canonical CC with the new PKT basis', () => {
  assert.equal(loadRun(freshAdmitted).claims.length, 1);
  assert.equal(loadRun(freshAdmitted).claims[0].values.packets, 'PKT-0703');
  assert.equal(loadRun(freshAdmitted).claims[0].values.normalizedClaim, freshReturn.claims[0].normalized_claim);
  assert(readFileSync(join(freshAdmitted, `control/worker-returns/${parentCall}/raw.json`)).equals(originalBytes));
});
for (const [name, mutate] of [
  ['changed locator', (value: typeof basis) => { value.request.new_locator = 'L1-L3'; }],
  ['wrong predecessor', (value: typeof basis) => { value.request.packet = 'PKT-0702'; }],
  ['wrong source', (value: typeof basis) => { value.source_id = 'SRC-999'; }],
  ['wrong original selector', (value: typeof basis) => { value.output_selector = 'claim-candidate:1'; }],
  ['wrong original raw', (value: typeof basis) => { value.normalizer_raw_digest = `sha256:${'0'.repeat(64)}`; }],
  ['changed source bounds', (value: typeof basis) => { value.end_byte = '10000'; }],
  ['changed chain-basis lineage', (value: typeof basis) => { value.lineage_digest = `sha256:${'0'.repeat(64)}`; }],
  ['changed S2 seal', (value: typeof basis) => { value.s2_seal_digest = `sha256:${'0'.repeat(64)}`; }],
] as const) test(`${name} is refused`, () => {
  const value = structuredClone(basis); mutate(value);
  assert.throws(() => widening.validatePacketWideningBasis(model, value), /WORK_WIDENING/u);
});
test('old work is stale after canonical capture; no duplicate successor', () => {
  assert.throws(() => core.deriveWorkTransition(loadRun(captured), execution, worker, accepted, '2026-09-18T12:02:00Z'), /WORK_STALE/u);
  assert.equal(loadRun(captured).packets.length, model.packets.length + 1);
});
test('ordinary S3 extractor view remains refused', () => {
  assert.throws(() => sem.semanticProducerSelections(model, 'extractor', 'S3', { source_id: 'SRC-701' }), /SEM_WINDOW/u);
});
for (const [name, mutate] of [
  ['wrong frozen source', (value: any) => { value.source_id = 'SRC-999'; }],
  ['broadened locus', (value: any) => { value.packets[0].fragments[0].locator = 'L1-L3'; }],
  ['outside source', (value: any) => { value.packets[0].fragments[0].locator = 'L1-L999'; }],
  ['rendered text used as exact bytes', (value: any) => { value.packets[0].fragments[0].exact_bytes_base64 = Buffer.from('Inferred reconstruction.').toString('base64'); }],
  ['old packet bytes reused', (value: any) => { value.packets[0].fragments = [structuredClone((fixture.returned.packets as any[])[0].fragments[0])]; }],
  ['ordinary primary intervals', (value: any) => { value.walk_intervals = []; }],
  ['ordinary source cursor', (value: any) => { value.next_cursor = {}; }],
  ['producer authored claim', (value: any) => { value.claims = []; }],
  ['duplicate semantic selector', (value: any) => { value.semantic_units.push(structuredClone(value.semantic_units[0])); }],
  ['omitted semantic selector', (value: any) => { value.semantic_units = []; }],
  ['missing material object', (value: any) => { value.packets[0].material_use.requirements[0].object_id = 'OBJ-9999'; }],
  ['missing material binding', (value: any) => { value.packets[0].material_use.requirements[0].binding_ids = ['BND-9999']; }],
] as const) test(`${name} is refused by context-bound producer validation`, () => {
  const value = structuredClone(producer); mutate(value);
  assert.equal(sem.validateSemanticReturn('extractor', '1.9.0-provisional', value,
    sem.packetWideningProducerView(loadRun(prepared), basis).context).result, 'FAIL');
});
test('whole-source binding remains an exact reference without exposing bytes outside the requested locus', () => {
  const view = JSON.parse(sem.packetWideningProducerView(loadRun(prepared), basis).bytes.toString());
  assert.deepEqual(view.material_context.retained_claim_material_use, original.claims[0].material_use);
  const selected = view.material_context.binding_references[0];
  assert.equal(selected.reference.binding_id, 'BND-0001');
  assert.equal(selected.authorized_exact_bytes_base64, null);
  assert(!Object.hasOwn(selected.reference, 'exact_bytes_base64'));
  assert.equal(selected.row_digest, rep.materialHash(sem.semanticJson(rep.readRepresentationContext(model).inventory.bindings[0])));
});
test('requested span outside accounted S2 coverage fails even with a claimed complete snapshot', () => {
  const changed = loadRun(run);
  for (const row of changed.sourceWalk.intervals) row.values.endByte = '1';
  assert.throws(() => widening.derivePacketWideningBasis(changed, parentCall, 0, 0), /coverage/u);
});
test('retained widening delivery reopens original immutable basis after packet replacement', () => {
  const before = sem.packetWideningProducerView(loadRun(prepared), basis);
  const after = sem.packetWideningProducerView(loadRun(captured), basis, true);
  assert(before.bytes.equals(after.bytes));
  const context = sem.validateSemanticProducerDelivery(loadRun(captured), 'extractor', 'S3', call, widening.WIDENING_TASK,
    [{ path: sem.semanticProducerViewPaths(call).view, bytes: before.bytes }], true);
  assert.equal(sem.validateSemanticReturn('extractor', '1.9.0-provisional', producer, context).result, 'PASS');
});
for (const [name, mutate] of [
  ['omitted original packet selector', (value: any) => { value.selectors = []; }],
  ['duplicate packet selector', (value: any) => { value.selectors.push(structuredClone(value.selectors[0])); }],
  ['packet recast as material finding', (value: any) => { value.selectors[0].output_kind = 'material-candidate'; }],
  ['changed original selector index', (value: any) => { value.selectors[0].output_index = '1'; }],
  ['predecessor substituted for new packet', (value: any) => { value.selectors[0].packet_ids = ['PKT-0701']; }],
  ['unrelated existing packet substituted', (value: any) => { value.selectors[0].packet_ids = ['PKT-0702']; }],
  ['missing fragment identity', (value: any) => { value.selectors[0].packet_ids = []; }],
  ['invented evidence identity', (value: any) => { value.selectors[0].evidence_key = 'EVID-9999'; }],
  ['old producer binding path reused', (value: any) => { value.selectors[0].binding_path = bindingPath; }],
  ['changed producer context', (value: any) => { value.context_id = 'another-context'; }],
  ['changed lineage identity', (value: any) => { value.lineage_id = 'LIN-9999'; }],
  ['wrong lineage cardinality', (value: any) => { value.lineage_type = 'split'; }],
  ['arbitrary capture after-image field', (value: any) => { value.admit_claim = 'CC-0701'; }],
  ['arbitrary retained widening basis field', (value: any) => { value.basis.reopen_s2 = true; }],
] as const) test(`${name} fails retained capture authentication`, () => {
  const root = join(scratch, `capture-mutation-${count}`); cpSync(captured, root, { recursive: true });
  const path = `${widening.WIDENING_CAPTURES}${call}.json`;
  const value = JSON.parse(readFileSync(join(root, path), 'utf8')); mutate(value);
  writeFixtureFile(root, path, core.workJson(value));
  assert.throws(() => widening.packetWideningCaptures(loadRun(root)), /WORK_WIDENING/u);
});
for (const [name, mutate] of [
  ['changed packet text', (model: ReturnType<typeof loadRun>) => { model.packets.at(-1)!.cells[4] = 'Invented text'; }],
  ['changed fragment bytes', (model: ReturnType<typeof loadRun>) => { model.exactEvidence.fragments.at(-1)!.cells[9] = 'ZmFrZQ=='; }],
  ['changed rendered derivative', (model: ReturnType<typeof loadRun>) => { model.exactEvidence.transformations.at(-1)!.cells[5] = 'Invented rendering'; }],
] as const) test(`${name} fails exact retained output projection`, () => {
  const model = loadRun(captured); mutate(model);
  assert.throws(() => widening.packetWideningCaptures(model), /WORK_WIDENING/u);
});
test('material refusal is captured and reviewed without packets, lineage, claims or a reopened S2', () => {
  const root = join(scratch, 'material-refusal'); cpSync(prepared, root, { recursive: true });
  const use = { requirements: [{ object_id: 'OBJ-0002', feature: 'formal-structure', binding_ids: ['BND-0001'] }],
    use_state: 'CANNOT_DETERMINE', fidelity_claim: 'none', limitation_refs: ['OBJ-0002'],
    reason: 'Synthetic exact widening cannot recover the required structure.' };
  const value = { ...producer, packets: [], material_findings: [{ object_id: 'OBJ-0002', material_use: use }],
    semantic_units: [{ output_kind: 'material-candidate', output_index: 0, review_mode: 'proposal',
      origin_unit_refs: [], anchors: [], semantics: { atomicity: 'CANNOT_DETERMINE', units: [], contexts: [],
        couplings: [], relation_proposals: [], unresolved_findings: [{ finding_id: 'F1',
          field_path: '/semantics/atomicity', code: 'material-unavailable', anchor_ids: [],
          material_requirement_indexes: [0], unknown_dimension: 'none', missing: use.reason, requested_context: [] }] } }] };
  const raw = Buffer.from(sem.semanticJson(value));
  writeFixtureFile(root, `control/worker-returns/${call}/raw.json`, raw);
  const plan = core.deriveWorkTransition(loadRun(root), execution, worker,
    { ...accepted, value: value as unknown as WorkValue['value'], raw_digest: core.workDigest(raw) }, '2026-09-19T12:12:00Z');
  assert(!plan.effects.some((effect) => ['ledgers/packet-index.md', 'ledgers/lineage.md',
    'ledgers/source-walk.md', 'ledgers/claim-inventory.md', 'ledgers/relations.md'].includes(effect.path)));
  const failed = apply(root, plan, 'material-refusal-captured'), recorded = widening.packetWideningCaptures(loadRun(failed))[0];
  assert.equal(recorded.lineage_id, null); assert.equal(recorded.lineage_type, null);
  assert.deepEqual(recorded.selectors.map((s) => s.output_kind), ['material-candidate']);
  const selected = core.selectNextWork(loadRun(failed), execution);
  assert(selected.kind === 'local' && selected.obligation.operation === 'sem.reserve-widening');
  const reservation = core.deriveWorkTransition(loadRun(failed), execution, selected, null, '2026-09-19T12:13:00Z');
  const reserved = apply(failed, reservation, 'material-refusal-reserved');
  const reviewed = review(reserved);
  const resolutionWork = core.selectNextWork(loadRun(reviewed), execution);
  const resolution = core.deriveWorkTransition(loadRun(reviewed), execution, resolutionWork, null, '2026-09-19T12:14:00Z');
  const resolved = apply(reviewed, resolution, 'material-refusal-resolved');
  const next = core.selectNextWork(loadRun(resolved), execution);
  assert(next.kind === 'halt' && next.code === 'WORK_WIDENING_PACKET_UNRESOLVED');
  assert(readFileSync(join(resolved, `control/worker-returns/${parentCall}/raw.json`)).equals(originalBytes));
  assert.equal(loadRun(resolved).claims.length, 0);
});
test('two exact fragments use existing split lineage and remain one semantic selector', () => {
  const root = join(scratch, 'split-prepared'); cpSync(prepared, root, { recursive: true });
  const value = structuredClone(producer), sourcePath = join(root, basis.source_path);
  value.packets[0].join_policy = 'adjacent-fragments';
  value.packets[0].fragments = [1, 2].map((line) => ({ fragment_order: line, locator: `L${line}-L${line}`,
    exact_bytes_base64: mdLineSpan(sourcePath, line, line)!.bytes!.toString('base64') }));
  const raw = Buffer.from(sem.semanticJson(value));
  writeFixtureFile(root, `control/worker-returns/${call}/raw.json`, raw);
  const plan = core.deriveWorkTransition(loadRun(root), execution, worker,
    { ...accepted, value: value as unknown as WorkValue['value'], raw_digest: core.workDigest(raw) }, '2026-09-18T12:12:00Z');
  const split = apply(root, plan, 'split-captured'), captures = widening.packetWideningCaptures(loadRun(split));
  assert.equal(captures[0].lineage_type, 'split'); assert.equal(captures[0].selectors.length, 1);
  assert.deepEqual(captures[0].selectors[0].packet_ids, ['PKT-0703', 'PKT-0704']);
  const work = core.selectNextWork(loadRun(split), execution);
  const reservation = core.deriveWorkTransition(loadRun(split), execution, work, null, '2026-09-18T12:13:00Z');
  const reserved = apply(split, reservation, 'split-reserved');
  const ledger = sem.parseSemanticLedger(readFileSync(join(reserved, sem.SEMANTIC_PATH), 'utf8'));
  const subject = JSON.parse(readFileSync(join(reserved, ledger.subjects.at(-1)!.subject_path), 'utf8')) as SemanticSubject;
  assert(subject.output_binding.kind === 'packet-group');
  assert.deepEqual(subject.output_binding.packet_ids, ['PKT-0703', 'PKT-0704']);
  const changed = loadRun(split), record = changed.files.find((f) => f.relativePath === `${widening.WIDENING_CAPTURES}${call}.json`)!;
  const valueAfter = JSON.parse(record.text); valueAfter.selectors[0].packet_ids.reverse();
  record.text = core.workJson(valueAfter).toString();
  assert.throws(() => widening.packetWideningCaptures(changed), /WORK_WIDENING/u);
});
for (const version of ['1.7.0-provisional', '1.8.0-provisional']) test(`${version} refuses the new producer contract`, () => {
  assert.equal(sem.validateSemanticReturn('extractor', version, producer).result, 'FAIL');
});
for (const [index, rendered] of ['Synthetic\nrendering\n', 'Synthetic & rendered | cell',
  'Synthetic\r\nrendering', '  Synthetic rendering  '].entries()) test(`rendered cell ${index} hashes its retained encoding and preserves raw/exact bytes`, () => {
  const root = join(scratch, `rendering-${index}`); cpSync(prepared, root, { recursive: true });
  const value = structuredClone(producer); value.packets[0].rendered_text = rendered;
  const raw = Buffer.from(sem.semanticJson(value));
  writeFixtureFile(root, `control/worker-returns/${call}/raw.json`, raw);
  const plan = core.deriveWorkTransition(loadRun(root), execution, worker,
    { ...accepted, value: value as unknown as WorkValue['value'], raw_digest: core.workDigest(raw) }, '2026-09-26T12:00:00Z');
  const after = apply(root, plan, `rendering-${index}-captured`), model = loadRun(after);
  const transformation = model.exactEvidence.transformations.at(-1)!;
  assert.match(transformation.values.transformKey, /^XFORM-[0-9]+$/u);
  assert.equal(transformation.values.outputText, sem.semanticClaimCell(rendered));
  assert.equal(transformation.values.outputTextHash, core.workDigest(transformation.values.outputText));
  assert.equal(model.exactEvidence.fragments.at(-1)!.values.exactBytesBase64, basis.exact_bytes_base64);
  assert(readFileSync(join(after, `control/worker-returns/${call}/raw.json`)).equals(raw));
  assert(readFileSync(join(after, basis.source_path)).equals(readFileSync(join(prepared, basis.source_path))));
  assert.equal(widening.packetWideningCaptures(model).length, 1);
});
console.log(JSON.stringify({ result: 'PASS', passed: count, runtime, scratch, scope: 'partial synthetic C05 Core transitions; not producer completion' }, null, 2));

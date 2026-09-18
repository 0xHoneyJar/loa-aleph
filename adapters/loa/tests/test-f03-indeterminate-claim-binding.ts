#!/usr/bin/env node
// C-04 structural fixtures only. The original conflict discriminator is unchanged.
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, cpSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import {
  makeSemanticFixture, sealFixtureSemanticStage, writeFixtureFile, MANUAL_REVIEWER,
  fixtureResult, fixtureReview, fixtureSemantics, TEXT_USE, addFixtureNormalization, addFixtureMaterialFinding,
  type SemanticFixture,
} from '../../../scripts/semantic-fixture-support.ts';
import type { MaterialUseInput, MaterialRow } from '../../../scripts/lib/source-representation.ts';
import type { SemanticSubject, SemanticEntry } from '../../../scripts/lib/semantic-review.ts';
const runtime = process.argv.includes('--runtime');
const sem = await import(runtime ? '../../../runtime-js/scripts/lib/semantic-review.js' : '../../../scripts/lib/semantic-review.ts') as typeof import('../../../scripts/lib/semantic-review.ts');
const rep = await import(runtime ? '../../../runtime-js/scripts/lib/source-representation.js' : '../../../scripts/lib/source-representation.ts') as typeof import('../../../scripts/lib/source-representation.ts');
const work = await import(runtime ? '../../../runtime-js/scripts/lib/work-transitions.js' : '../../../scripts/lib/work-transitions.ts') as typeof import('../../../scripts/lib/work-transitions.ts');
const root = mkdtempSync(join(tmpdir(), 'f03-c04-binding-'));
let ordinal = 0;
const results: Array<{ name: string; result: 'PASS' | 'FAIL'; error?: string }> = [];
function test(name: string, action: () => void): void {
  try { action(); results.push({ name, result: 'PASS' }); }
  catch (error) { results.push({ name, result: 'FAIL', error: String(error) }); }
}
const rawPath = 'verification/harness/semantic-process/manual-c04.raw.json';
const producerPath = 'verification/harness/semantic-process/producer-c04.json';
const canonicalPaths = ['ledgers/claim-inventory.md', 'ledgers/representation-uses.md', 'ledgers/lineage.md', 'ledgers/relations.md'];
function canonical(run: string): Array<string | null> {
  return canonicalPaths.map((path) => existsSync(join(run, path)) ? readFileSync(join(run, path)).toString('base64') : null);
}
function prepared(multiple = false, version = '1.9.0-provisional', separateMaterial = false) {
  const f = makeSemanticFixture(join(root, String(++ordinal)), undefined, undefined, undefined, version);
  if (separateMaterial) addFixtureMaterialFinding(f);
  sealFixtureSemanticStage(f, 'S2');
  writeFixtureFile(f.run, 'run-log.md', readFileSync(join(f.run, 'run-log.md'), 'utf8')
    + '\n## 2026-09-18 12:00 UTC — S3 — entry\n\nSynthetic C-04 structural fixture.\n');
  const before = canonical(f.run);
  const use: MaterialUseInput = {
    requirements: [{ object_id: 'OBJ-0002', feature: 'formal-structure', binding_ids: ['BND-0001'] },
      ...multiple ? [{ object_id: 'OBJ-0001', feature: 'table-grid' as const, binding_ids: ['BND-0001'] }] : []],
    use_state: 'CANNOT_DETERMINE', fidelity_claim: 'none', limitation_refs: ['OBJ-0002'],
    reason: 'The frozen synthetic representation does not supply the required structure.',
  };
  const entry: SemanticEntry = { output_kind: 'claim-candidate', output_index: 0, review_mode: 'proposal',
    origin_unit_refs: ['SEM-0701/U1'], anchors: f.entry.anchors,
    semantics: { atomicity: 'CANNOT_DETERMINE', units: [], contexts: [], couplings: [], relation_proposals: [],
      unresolved_findings: [{ finding_id: 'F1', field_path: '/semantics/atomicity', code: 'material-unavailable', anchor_ids: ['A1'],
        material_requirement_indexes: use.requirements.map((_, i) => i), unknown_dimension: 'none', missing: use.reason, requested_context: [] }] } };
  const returned = { claims: [{ normalized_claim: 'Tentative unadmitted interpretation of unavailable structure.',
    packets: ['PKT-0701'], claim_type: 'factual', widen_requests: [], rationale: use.reason, flags: [], material_use: use }],
  no_claim_packets: [], lineage_proposals: [], material_findings: [], semantic_units: [entry] };
  const model = loadRun(f.run);
  const view = sem.semanticProducerView(model, 'normalizer', 'S3',
    sem.semanticProducerSelections(model, 'normalizer', 'S3', { origin_semantic_ids: ['SEM-0701'] }));
  const checked = sem.validateSemanticReturn('normalizer', version, returned, view.context);
  assert.equal(checked.result, 'PASS', checked.errors.join('; ')); assert.equal(checked.binding, 'checked');
  const producer = { call_id: 'manual-c04', context_id: 'manual-c04-producer',
    raw_return_hash: rep.materialHash(sem.semanticJson(returned)), output_kind: 'claim-candidate', output_index: 0 };
  writeFixtureFile(f.run, rawPath, sem.semanticJson(returned));
  writeFixtureFile(f.run, producerPath, sem.semanticJson(producer));
  return { f, before, returned, producer, entry, use };
}
function fixture(multiple = false): SemanticFixture {
  const { f, before, returned, producer, entry, use } = prepared(multiple);
  const model = loadRun(f.run), binding = sem.indeterminateClaimBinding(model, returned, 0, 'CC-0702');
  const hash = sem.semanticProducerBinding(producer);
  const subject = sem.buildSemanticSubject(model, {
    semantic_id: 'SEM-0702', owner_stage: 'S3', subject_kind: 'indeterminate-claim',
    review_mode: entry.review_mode, predecessor_semantic_id: 'none', producer_binding_hash: hash,
    reviewer_profile: MANUAL_REVIEWER, output_binding: binding.output_binding, origin_unit_refs: entry.origin_unit_refs,
    origin_context: [sem.semanticOriginProjection(f.subject)], anchors: entry.anchors, semantics: entry.semantics,
    material_use: use, material_views: sem.semanticIndeterminateClaimMaterialViews(model, binding.output_binding, hash, use),
    lineage_context: [], relation_context: [], ambiguity_context: [],
  });
  f.ledger.subjects.push({ semantic_id: subject.semantic_id, owner_stage: 'S3', subject_kind: subject.subject_kind,
    subject_path: sem.semanticSubjectPath(subject.semantic_id), subject_digest: '', predecessor_semantic_id: 'none',
    producer_receipt_ref: `${producerPath}@${rep.materialHash(sem.semanticJson(producer))}` });
  f.ledger.resolutions.push({ resolution_id: 'SMR-0702', semantic_id: subject.semantic_id, outcome: 'not-admitted',
    review_ids: '[]', canonical_refs: '[]', origin_unit_refs: sem.semanticJson(entry.origin_unit_refs), followup_semantic_ids: '[]' });
  const result: SemanticFixture = { ...f, subject, entry, returned, producer, result: fixtureResult(subject),
    assignment: { ...f.assignment, semantic_id: subject.semantic_id, review_id: 'VER-0702', invocation_id: 'manual-pass-VER-0702',
      producer_binding_hash: hash } };
  retain(result);
  assert.deepEqual(sem.validateSemanticRun(loadRun(f.run)).pending, []);
  assert.deepEqual(canonical(f.run), before);
  return result;
}
function retain(f: SemanticFixture): void {
  const row = f.ledger.subjects.find((row) => row.semantic_id === f.subject.semantic_id)!;
  row.subject_digest = rep.materialHash(sem.semanticJson(f.subject)); row.subject_kind = f.subject.subject_kind;
  writeFixtureFile(f.run, row.subject_path, sem.semanticJson(f.subject));
  f.assignment.subject_digest = row.subject_digest; f.assignment.producer_binding_hash = f.subject.producer_binding_hash;
  f.result = fixtureResult(f.subject); fixtureReview(f, f.result);
}
function save(f: SemanticFixture): void { writeFixtureFile(f.run, sem.SEMANTIC_PATH, sem.semanticLedgerMarkdown(f.ledger)); }
function fails(f: SemanticFixture, pattern = /SEM_|USE_|UNDECLARED_FEATURE/u): void {
  assert.throws(() => sem.validateSemanticRun(loadRun(f.run)), pattern);
}
function mutation(name: string, mutate: (f: SemanticFixture) => void): void {
  test(name, () => { const f = fixture(true); mutate(f); retain(f); fails(f); });
}
test('one OBJ: exactly one original claim subject, proposal reservation and no canonical effects', () => {
  const f = fixture(), output = f.subject.output_binding;
  assert.equal(output.kind, 'indeterminate-claim'); if (output.kind !== 'indeterminate-claim') return;
  assert.equal(output.output_selector, 'claim-candidate:0'); assert.equal(output.output_index, 0);
  assert.equal(output.reserved_claim_id, 'CC-0702');
  assert.equal(f.ledger.subjects.filter((row) => row.subject_kind === 'indeterminate-claim').length, 1);
  assert.equal(loadRun(f.run).claims.length, 0);
  assert.equal(sem.claimProposalModel(loadRun(f.run), output).claims.length, 0);
  assert.equal(rep.readRepresentationContext(loadRun(f.run)).uses.some((row) => row.subject_kind === 'CC'), false);
});
test('multi OBJ: complete ordered requirements and one deterministic preview', () => {
  const f = fixture(true), output = f.subject.output_binding;
  assert.equal(output.kind, 'indeterminate-claim'); if (output.kind !== 'indeterminate-claim') return;
  assert.deepEqual(f.subject.material_use, (f.returned.claims as any[])[0].material_use);
  assert.equal(f.subject.material_use!.requirements.length, 2); assert.equal(f.subject.material_views.length, 1);
  assert.deepEqual(sem.semanticIndeterminateClaimMaterialViews(loadRun(f.run), output, f.subject.producer_binding_hash, f.subject.material_use!), f.subject.material_views);
});
test('raw accepted producer bytes and original selector remain exact', () => {
  const f = fixture(true);
  assert.equal(readFileSync(join(f.run, rawPath), 'utf8'), sem.semanticJson(f.returned));
  assert.equal(rep.materialHash(readFileSync(join(f.run, rawPath))), f.producer.raw_return_hash);
  assert.equal(sem.semanticProducerBinding(f.producer), f.subject.producer_binding_hash);
});
test('tentative text remains proposal only; no invented semantic content or usable declaration', () => {
  const f = fixture(), output = f.subject.output_binding;
  assert.equal(output.kind, 'indeterminate-claim'); if (output.kind !== 'indeterminate-claim') return;
  assert.equal(output.normalized_claim, (f.returned.claims as any[])[0].normalized_claim);
  assert.deepEqual(f.subject.semantics, f.entry.semantics);
  assert.equal(f.subject.semantics.atomicity, 'CANNOT_DETERMINE');
  for (const key of ['units', 'contexts', 'couplings', 'relation_proposals'] as const) assert.deepEqual(f.subject.semantics[key], []);
  assert.equal(f.subject.material_use!.use_state, 'CANNOT_DETERMINE');
  assert(sem.semanticAdmissionProblems(f.subject).includes('nonaffirmative proposal reservation is not a canonical CC'));
  assert(!sem.semanticJson(f.subject.material_views).includes('"subject_kind":"CC"'));
});
for (const [name, change] of [
  ['missing OBJ', (use: MaterialUseInput) => { use.requirements[0].object_id = 'OBJ-9999'; }],
  ['missing BND', (use: MaterialUseInput) => { use.requirements[0].binding_ids = ['BND-9999']; }],
  ['foreign limitation', (use: MaterialUseInput) => { use.limitation_refs = ['OBJ-9999']; }],
] as const) test(`${name} fails preview construction`, () => {
  const f = fixture(true), output = f.subject.output_binding;
  assert.equal(output.kind, 'indeterminate-claim'); if (output.kind !== 'indeterminate-claim') return;
  const use = structuredClone(f.subject.material_use!); change(use);
  assert.throws(() => sem.semanticIndeterminateClaimMaterialViews(loadRun(f.run), output, f.subject.producer_binding_hash, use), /USE_|UNDECLARED_FEATURE|REFERENCE/u);
});
test('existing BND owned by another object fails the noncanonical preview', () => {
  const f = fixture(), model = loadRun(f.run), context = rep.readRepresentationContext(model);
  const output = f.subject.output_binding; if (output.kind !== 'indeterminate-claim') throw Error('fixture');
  // An existing carrier binding does not imply membership in this OBJ.
  const other = { ...context.inventory.bindings[0], binding_id: 'BND-0002' };
  context.inventory.bindings.push(other);
  const use = structuredClone(f.subject.material_use!); use.requirements[0].binding_ids = [other.binding_id];
  assert.throws(() => rep.indeterminateClaimMaterialPreview(model, context, {
    producer_binding_hash: f.subject.producer_binding_hash, proposal_digest: rep.materialHash(sem.semanticJson(output)),
    packet_ids: output.packet_ids, source_ids: output.source_ids, material_use: use,
  }), /UNDECLARED_FEATURE|USE_CLOSURE/u);
});
test('nonaffirmative reservation cannot enter the canonical L2F reservation path', () => {
  const f = fixture();
  assert.throws(() => work.workMaterialReviewReservation(loadRun(f.run), f.subject.semantic_id), /WORK_MATERIAL_SUBJECT/u);
});
mutation('wrong OBJ cannot replace original declaration', (f) => { f.subject.material_use!.requirements[0].object_id = 'OBJ-0001'; });
mutation('changed requirement cannot replace original declaration', (f) => { f.subject.material_use!.requirements[0].feature = 'image'; });
mutation('dropped requirement fails', (f) => { f.subject.material_use!.requirements.pop(); });
mutation('retained requirement reordering fails', (f) => { f.subject.material_use!.requirements.reverse(); });
mutation('first OBJ only substitution fails', (f) => { f.subject.material_use!.requirements = f.subject.material_use!.requirements.slice(0, 1); });
mutation('arbitrary preview after-image fails', (f) => { (f.subject.material_views[0].view as any).objects = []; });
mutation('selector recast as material-only fails', (f) => {
  f.subject.subject_kind = 'material-only'; f.subject.output_binding = { kind: 'material-only', object_id: 'OBJ-0002' };
});
mutation('different original claim selector fails', (f) => { (f.subject.output_binding as any).output_selector = 'claim-candidate:1'; });
mutation('synthetic material-candidate selector fails', (f) => { (f.subject.output_binding as any).output_selector = 'material-candidate:0'; });
mutation('CANNOT_DETERMINE to usable fails', (f) => { f.subject.material_use!.use_state = 'usable'; f.subject.material_use!.reason = 'none'; });
mutation('invented semantic proposition fails even with resealed subject', (f) => { f.subject.semantics = fixtureSemantics(f.source.toString()); });
mutation('tentative text mutation fails even with a rebuilt preview', (f) => {
  const output = f.subject.output_binding; if (output.kind !== 'indeterminate-claim') throw Error('fixture');
  output.normalized_claim = 'An invented replacement.';
  f.subject.material_views = sem.semanticIndeterminateClaimMaterialViews(loadRun(f.run), output, f.subject.producer_binding_hash, f.subject.material_use!);
});
test('changed raw producer return fails', () => {
  const f = fixture(); writeFixtureFile(f.run, rawPath, readFileSync(join(f.run, rawPath), 'utf8') + '\n'); fails(f);
});
test('duplicate semantic subjects for one selector fail', () => {
  const f = fixture(), subject = { ...f.subject, semantic_id: 'SEM-0703' };
  const path = sem.semanticSubjectPath(subject.semantic_id), bytes = sem.semanticJson(subject);
  writeFixtureFile(f.run, path, bytes);
  f.ledger.subjects.push({ ...f.ledger.subjects.at(-1)!, semantic_id: subject.semantic_id, subject_path: path,
    subject_digest: rep.materialHash(bytes) }); save(f); fails(f, /duplicate semantic subject/u);
});
test('omitted selector cannot close L2S accounting', () => {
  const f = fixture(); f.ledger.subjects = f.ledger.subjects.filter((row) => row.semantic_id !== 'SEM-0702'); save(f); fails(f);
});
test('separate material finding cannot discharge the claim selector', () => {
  const { f } = prepared(false, '1.9.0-provisional', true);
  sealFixtureSemanticStage(f, 'S3');
  fails(f, /retained emitted producer candidate has no completed L2S review/u);
});
test('canonical CC fabricated from review fails', () => {
  const f = fixture();
  writeFixtureFile(f.run, 'ledgers/claim-inventory.md', readFileSync(join(f.run, 'ledgers/claim-inventory.md'), 'utf8')
    + '| CC-0702 | Invented proposition | PKT-0701 | SRC-701 | factual | | | | | active |\n');
  fails(f, /canonical claim lacks/u);
});
test('canonical CC plus CANNOT_DETERMINE USE remains rejected', () => {
  const f = fixture(), model = loadRun(f.run), output = f.subject.output_binding;
  assert.equal(output.kind, 'indeterminate-claim'); if (output.kind !== 'indeterminate-claim') return;
  const projected = sem.claimProposalModel(model, { kind: 'claim', reserved_claim_id: output.reserved_claim_id,
    normalized_claim: output.normalized_claim, packet_ids: output.packet_ids, source_ids: output.source_ids, claim_type: output.claim_type });
  const use = f.subject.material_use!, context = rep.readRepresentationContext(model);
  const row: MaterialRow = { use_id: 'USE-0702', owner_stage: 'S3', subject_kind: 'CC', subject_id: 'CC-0702',
    basis_packet_ids: sem.semanticJson(output.packet_ids), requirements: sem.semanticJson(use.requirements),
    use_state: use.use_state, fidelity_claim: use.fidelity_claim, limitation_refs: sem.semanticJson(use.limitation_refs),
    reason: use.reason, established_by: f.producer.call_id, review_subject_digest: '', reviewed_by: 'none' };
  row.review_subject_digest = rep.representationUseDigest(projected, context, row);
  assert.throws(() => rep.validateRepresentationUse(projected, context, row, false), /CANNOT_DETERMINE candidates require OBJ receipts/u);
});
for (const verdict of ['upheld', 'cannot-determine', 'refuted'] as const) test(`${verdict}: actual Core resolution plan creates no CC, USE, REL or lineage`, () => {
  const f = fixture(true), before = canonical(f.run), result = fixtureResult(f.subject);
  if (verdict !== 'upheld') {
    result.verdict = verdict; result.field_reviews[0].verdict = verdict; result.field_reviews[0].issue = 'missing-material';
    result.missing_for_determination = verdict === 'cannot-determine' ? 'Synthetic missing material.' : null;
    if (verdict === 'cannot-determine') result.unresolved_findings = structuredClone(f.subject.semantics.unresolved_findings);
  }
  fixtureReview(f, result);
  if (verdict === 'cannot-determine') fixtureReview(f, result, 'VER-0703');
  sem.validateSemanticRun(loadRun(f.run));
  const oldLedger = readFileSync(join(f.run, sem.SEMANTIC_PATH));
  const resolution = f.ledger.resolutions.pop()!; save(f);
  const model = loadRun(f.run), proposed = join(root, `resolution-${++ordinal}`);
  cpSync(f.run, proposed, { recursive: true });
  writeFixtureFile(proposed, sem.SEMANTIC_PATH, oldLedger);
  sem.planSemanticWrite({ model, proposedModel: loadRun(proposed), stage: 'S3', semantic_id: f.subject.semantic_id,
    subject_digest: rep.materialHash(sem.semanticJson(f.subject)), operation: 'resolve', record_id: resolution.resolution_id,
    prerequisite_paths: [], writes: [{ path: sem.SEMANTIC_PATH,
      before_hash: rep.materialHash(readFileSync(join(f.run, sem.SEMANTIC_PATH))),
      after_base64: oldLedger.toString('base64'), after_hash: rep.materialHash(oldLedger) }] });
  assert.deepEqual(canonical(proposed), before); assert.deepEqual(canonical(f.run), before);
  const checked = sem.validateSemanticReturn('verifier-l2s', '1.9.0-provisional', result);
  assert.equal(checked.result, 'PASS', checked.errors.join('; '));
});
test('cannot-determine needs the existing second fresh review', () => {
  const f = fixture(), result = fixtureResult(f.subject);
  result.verdict = 'cannot-determine'; result.field_reviews[0].verdict = 'cannot-determine';
  result.field_reviews[0].issue = 'missing-material'; result.missing_for_determination = 'Synthetic missing material.';
  result.unresolved_findings = structuredClone(f.subject.semantics.unresolved_findings);
  fixtureReview(f, result); fails(f, /second fresh assignment/u);
});
test('reviewer-authored replacement is refused', () => {
  const f = fixture(), result: any = fixtureResult(f.subject);
  result.normalized_claim = 'Reviewer replacement'; assert.throws(() => sem.validateSemanticResult(result, f.subject), /SEM_FORMAT/u);
});
test('ordinary usable claim retains its affirmative path', () => {
  const f = makeSemanticFixture(join(root, String(++ordinal)), undefined, undefined, undefined, '1.9.0-provisional');
  const claim = addFixtureNormalization(f, { materialUse: TEXT_USE });
  assert.equal(claim.subject.subject_kind, 'claim'); sem.validateSemanticRun(loadRun(claim.run));
  assert.equal(loadRun(claim.run).claims.length, 1);
});
for (const version of ['1.7.0-provisional', '1.8.0-provisional']) test(`${version} refuses dedicated binding`, () => {
  const { f, returned } = prepared(false, version);
  assert.throws(() => sem.indeterminateClaimBinding(loadRun(f.run), returned, 0, 'CC-0702'), /SEM_COMPATIBILITY/u);
});
for (const row of results) console.log(`${row.result} C04 ${row.name}${row.error ? `: ${row.error}` : ''}`);
console.log(JSON.stringify({ format: 'f03-c04-binding-tests/v1', passed: results.filter((row) => row.result === 'PASS').length,
  failed: results.filter((row) => row.result === 'FAIL').length, evidence_kind: 'synthetic Core fixtures and plans only', results }, null, 2));
if (results.some((row) => row.result === 'FAIL')) process.exitCode = 1;

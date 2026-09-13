#!/usr/bin/env node
/** Synthetic challenge families. Semantic declarations are not reference answers. */
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  duplicateFixtureBase, duplicateFixtureMultiSourceBase, duplicateFixtureDiscovery, duplicateFixtureProposal,
  duplicateFixtureReserve, duplicateFixtureReview, duplicateFixtureDecide, duplicateFixtureFinding,
  makeDuplicateFixture, makeDuplicateSuccessorFixture, closeDuplicateFixture, type DuplicateFixture,
  duplicateFixtureWorkingContext,
} from './duplicate-fixture-support.ts';
import { fixtureSemantics, makeFragmentSemanticFixture, addFixtureNormalization, sealFixtureSemanticStage, SEMANTIC_TEST_ROOT, TEXT_USE, writeFixtureFile } from './semantic-fixture-support.ts';
import { loadRun, hasRunCapability } from './lib/run-model.ts';
import { materialHash } from './lib/source-representation.ts';
import { semanticJson, semanticRelationRow, type FacetName, type Semantics } from './lib/semantic-review.ts';
import { parseRelations, relationReviewSubjectDigest } from './lib/relations.ts';
import type { DuplicateOutcome, DuplicateProposal, DuplicateVerdict } from './lib/duplicate-review.ts';
import { mdLineSpan, sourceFilePath } from './lib/check-helpers.ts';

const runtime = process.argv.includes('--runtime');
const modulePath = (name: string): string => new URL(runtime ? `../runtime-js/scripts/${name}.js` : `./${name}.ts`, import.meta.url).href;
const core = await import(modulePath('lib/duplicate-review')) as typeof import('./lib/duplicate-review.ts');
const { validateRun } = await import(modulePath('validate-run')) as typeof import('./validate-run.ts');
const temp = mkdtempSync(join(tmpdir(), 'aleph-duplicate-fixtures-'));
const records: Array<{ id: string; scenario: string; result: 'PASS' | 'FAIL'; cases: number; error?: string }> = [];
let cases = 0;
function check(f: DuplicateFixture): void {
  const report = validateRun({ run: f.run });
  assert.equal(report.result, 'PASS', JSON.stringify(report.checks.filter((c) => c.status === 'FAIL')));
  assert(report.checks.some((c) => c.id === 'K2.20' && c.status === 'PASS'));
  cases++;
}
function family(number: number, scenario: string, fn: () => void): void {
  const id = `D8-F${String(number).padStart(2, '0')}`, before = cases;
  try { fn(); records.push({ id, scenario, result: 'PASS', cases: cases - before }); }
  catch (error) { records.push({ id, scenario, result: 'FAIL', cases: cases - before, error: error instanceof Error ? error.message : String(error) }); }
}
function facet(text: string, name: FacetName, kind: string): Semantics {
  const s = fixtureSemantics(text);
  s.units[0][name] = { state: 'present', items: [{ kind, source_text: text,
    ...(name === 'attribution' ? { attributed_to: 'Synthetic observer' } : {}),
    ...(name === 'comparator' ? { subject_anchor_ids: ['A1'], baseline_anchor_ids: ['A1'], dimension_anchor_ids: ['A1'] } : {}),
    ...(name === 'metric' ? { quantity_anchor_ids: ['A1'], value_anchor_ids: ['A1'], unit_anchor_ids: ['A1'] } : {}),
    anchor_ids: ['A1'],
  }], basis_anchor_ids: ['A1'] } as never;
  return s;
}
function review(f: DuplicateFixture, outcome: DuplicateOutcome = 'distinct', verdict: DuplicateVerdict = 'upheld',
  change?: (proposal: DuplicateProposal) => void): DuplicateFixture {
  if (!f.discovery) duplicateFixtureDiscovery(f);
  const proposal = duplicateFixtureProposal(core.buildComparisonBasis(loadRun(f.run), f.discovery.candidates[0].member_ids), outcome);
  proposal.candidate_ref = `${f.discovery.discovery_id}/G1`;
  change?.(proposal);
  duplicateFixtureReserve(f, proposal);
  const rounds = [duplicateFixtureReview(f, verdict)];
  if (verdict === 'cannot-determine') rounds.push(duplicateFixtureReview(f, 'cannot-determine', 2));
  duplicateFixtureDecide(f, rounds, '0001', verdict === 'refuted' ? 'not-admitted' : 'kept-separate');
  return f;
}
function difference(n: number, first: string, last: string, name: FacetName, firstKind: string, lastKind = firstKind): void {
  const f = duplicateFixtureBase(join(temp, `F${n}`), first, last, {
    firstSemantics: facet(first, name, firstKind), lastSemantics: facet(last, name, lastKind),
  });
  review(f, 'duplicate', 'refuted'); check(f);
  assert(f.subject!.comparison_fields.some((field) => field.dimension === name && field.field_ref.endsWith('/items/0')));
  assert.equal(f.ledger.effects[0].effect, 'not-admitted');
}
try {
  family(1, 'Equal text retains two distinct frozen occurrence coordinates', () => {
    const f = makeDuplicateFixture(join(temp, 'F01'), { outcome: 'duplicate' }); check(f);
    assert.equal(f.subject!.proposal.provenance_union.occurrences.length, 2);
    assert.equal(new Set(f.subject!.proposal.provenance_union.occurrences.map(semanticJson)).size, 2);
  });
  family(2, 'Paraphrase proposal undergoes L3 followed by separate S4 SEM/L2S', () => {
    const f = duplicateFixtureBase(join(temp, 'F02'), 'The indicator lit during trial A.', 'During trial A the indicator was illuminated.');
    duplicateFixtureDiscovery(f);
    makeDuplicateSuccessorFixture(f.run, false, { base: f }); check(f);
    assert.equal(f.ledger.assignments.length, 1); assert.equal(f.ledger.effects[0].successor_id, 'CC-0803');
  });
  family(3, 'Enabled versus disabled condition', () => difference(3, 'The indicator lit with the switch enabled.', 'The indicator lit with the switch disabled.', 'conditions', 'condition'));
  family(4, 'Usually versus always qualifier', () => difference(4, 'The indicator usually lit.', 'The indicator always lit.', 'qualifiers', 'frequency'));
  family(5, 'One trial versus every trial scope', () => difference(5, 'The indicator lit in trial A.', 'The indicator lit in every trial.', 'scope', 'experiment-task', 'quantified'));
  family(6, 'Can versus must modality', () => difference(6, 'The indicator can light.', 'The indicator must light.', 'modality', 'capable', 'obligatory-must'));
  family(7, 'Observation, attributed interpretation and role remain distinguishable', () => {
    const first = 'The indicator lit.', last = 'The observer interpreted the light as readiness.';
    const interpretation = facet(last, 'attribution', 'source-author');
    interpretation.units[0].claim_roles = facet(last, 'claim_roles', 'interpretation-inference').units[0].claim_roles;
    interpretation.couplings.push({ kind: 'result-interpretation', unit_ids: ['U1'], anchor_ids: ['A1'], treatment: 'keep-together' });
    const f = duplicateFixtureBase(join(temp, 'F07'), first, last, { lastSemantics: interpretation });
    review(f, 'distinct'); check(f);
    assert(f.subject!.comparison_basis.semantic_projections[1].semantics.couplings.length);
  });
  family(8, 'Overlap keeps both current claims without a lineage/map mutation', () => {
    const f = makeDuplicateFixture(join(temp, 'F08'), { first: 'The indicator lit.', last: 'The indicator lit with the switch enabled.', outcome: 'overlap' });
    check(f); assert.equal(loadRun(f.run).merges.length, 0); assert.equal(loadRun(f.run).claims.length, 2);
  });
  family(9, 'Structured contradiction annotation preserves both claims without a truth winner', () => {
    const f = duplicateFixtureBase(join(temp, 'F09'), 'The indicator lit during trial A.', 'The indicator did not light during trial A.');
    review(f, 'distinct', 'upheld', (p) => p.contradiction_pairs.push({ a: p.member_ids[0], b: p.member_ids[1],
      distinction_refs: ['D1'], anchor_refs: [{ semantic_id: p.member_semantic_refs[0].semantic_id, anchor_id: 'A1' },
        { semantic_id: p.member_semantic_refs[1].semantic_id, anchor_id: 'A1' }], why: 'Synthetic conflicting bounded observations; neither is selected as true.' }));
    check(f); assert.equal(f.subject!.proposal.contradiction_pairs.length, 1);
  });
  family(10, 'Three source identities and occurrences survive equal source hashes', () => {
    const f = duplicateFixtureMultiSourceBase(join(temp, 'F10'));
    duplicateFixtureDiscovery(f, [['CC-0801', 'CC-0811', 'CC-0821']]); review(f, 'duplicate'); check(f);
    const p = f.subject!.proposal.provenance_union;
    assert.equal(p.packet_ids.length, 3); assert.equal(p.source_ids.length, 3); assert.equal(p.occurrences.length, 3);
    assert.equal(new Set(p.occurrences.map((o) => o.source_hash)).size, 1);
  });
  family(11, 'Material limitation remains explicit and requests frozen inspection without inferred values', () => {
    const f = duplicateFixtureBase(join(temp, 'F11'), 'The chart description reports a rise.', 'The table description reports a rise.', {
      firstMaterialUse: { ...TEXT_USE, limitation_refs: ['OBJ-0002'] }, suppliedTable: true,
    });
    review(f, 'CANNOT_DETERMINE', 'cannot-determine', (p) => {
      const basis = core.buildComparisonBasis(loadRun(f.run), p.member_ids), finding = p.unresolved_findings[0];
      const view = basis.material_views.find((v) => (v.use_subject as { limitation_refs: string[] }).limitation_refs.includes('OBJ-0002'))!;
      Object.assign(finding, { dimension: 'material', input_refs: ['/material_views'], material_refs: [{ use_subject_digest: view.use_subject_digest, limitation_id: 'OBJ-0002' }],
        missing: 'The frozen flattened description does not establish the required table association.', requested_context: [{ source_id: 'SRC-701', locator: 'L1-L3', purpose: 'material-inspection' }] });
    });
    check(f); assert.equal(loadRun(f.run).merges.length, 0);
    assert(f.subject!.comparison_basis.material_views.some((v) => (v.view as { objects: Array<{ kind: string }> }).objects.some((o) => o.kind === 'table')));
  });
  family(12, 'Unresolved antecedent remains a frozen-source finding', () => {
    const f = duplicateFixtureBase(join(temp, 'F12'), 'It lit during trial A.', 'It was illuminated during trial A.');
    review(f, 'CANNOT_DETERMINE', 'cannot-determine', (p) => Object.assign(p.unresolved_findings[0], {
      dimension: 'ambiguity', input_refs: ['/ambiguity_context'], missing: 'The antecedent of it remains unresolved in the frozen local context.',
      requested_context: [{ source_id: 'SRC-701', locator: 'L1-L3', purpose: 'same-source-referent-search' }],
    }));
    check(f); assert.equal(f.ledger.decisions[0].verdict, 'cannot-determine');
  });
  family(13, 'Conditional round two retains indeterminacy or refutation for all three verdicts', () => {
    for (const second of ['upheld', 'refuted', 'cannot-determine'] as const) {
      const f = makeDuplicateFixture(join(temp, `F13-${second}`), { verdict: 'cannot-determine', second });
      closeDuplicateFixture(f); check(f);
      assert.equal(f.ledger.assignments.length, 2);
      assert.equal(f.ledger.decisions[0].verdict, second === 'refuted' ? 'refuted' : 'cannot-determine');
      assert.equal(loadRun(f.run).merges.length, 0);
    }
  });
  family(14, 'Direct three-member subject covers all pairs with one L3 round', () => {
    const f = duplicateFixtureBase(join(temp, 'F14'), undefined, undefined, { third: 'During trial A the indicator was lit.' });
    duplicateFixtureDiscovery(f, [['CC-0801', 'CC-0802', 'CC-0804']]); review(f, 'duplicate'); check(f);
    assert.equal(f.subject!.proposal.member_ids.length, 3); assert.equal(f.ledger.assignments.length, 1);
    const result = JSON.parse(readFileSync(join(f.run, f.ledger.results[0].result_path), 'utf8'));
    assert.equal(result.pair_reviews.length, 3);
  });
  family(15, 'Faithful successor and complete synthetic C1/C2/C3 closure', () => {
    const f = makeDuplicateSuccessorFixture(join(temp, 'F15')); closeDuplicateFixture(f); check(f);
    assert.equal(f.ledger.effects[0].effect, 'canonicalized');
    const emit = process.argv.find((a) => a.startsWith('--emit='))?.slice(7);
    if (emit) cpSync(f.run, join(emit, 'positive'), { recursive: true });
  });
  family(16, 'L2S preservation failure retains upheld L3 without successor admission', () => {
    const f = makeDuplicateSuccessorFixture(join(temp, 'F16'), true); closeDuplicateFixture(f); check(f);
    assert.equal(f.ledger.decisions[0].verdict, 'upheld'); assert.equal(f.ledger.effects[0].effect, 'not-admitted');
    const emit = process.argv.find((a) => a.startsWith('--emit='))?.slice(7);
    if (emit) cpSync(f.run, join(emit, 'unresolved'), { recursive: true });
  });
  family(17, 'Competing semantic declarations over identical text both pass structure', () => {
    for (const outcome of ['distinct', 'CANNOT_DETERMINE'] as const) check(makeDuplicateFixture(join(temp, `F17-${outcome}`), { outcome }));
  });
  family(18, 'Semantically wrong declared condition collapse remains a structural PASS counterexample', () => {
    const first = 'The indicator lit only with power.', last = 'The indicator lit without power.';
    const f = duplicateFixtureBase(join(temp, 'F18'), first, last, {
      firstSemantics: facet(first, 'conditions', 'condition'), lastSemantics: facet(last, 'conditions', 'condition'),
    });
    duplicateFixtureDiscovery(f); makeDuplicateSuccessorFixture(f.run, false, { base: f }); check(f);
    assert.equal(f.subject!.proposal.distinctions.find((d) => d.dimension === 'conditions')!.treatment, 'collapsible');
  });
  family(19, 'Retained 1.0 through 1.7 pins and behavior plus inert source marker text', () => {
    const families = ['run-slice-2', 'exact-evidence-fragments', 'source-walk-accounting', 'lineage-accounting',
      'typed-relations', 'internal-ambiguity-lifecycle', 'formal-layout-bindings/positive', 'semantic-unit-review/positive'];
    for (const [i, name] of families.entries()) {
      const run = join(SEMANTIC_TEST_ROOT, 'docs/fixtures', name), before = materialHash(readFileSync(join(run, 'run-manifest.md')));
      assert.equal(hasRunCapability(`1.${i}.0-provisional`, 'duplicate-overlap-review'), false);
      assert.equal(validateRun({ run }).result, 'PASS', name); cases++;
      assert.equal(materialHash(readFileSync(join(run, 'run-manifest.md'))), before);
    }
    const run = join(temp, 'F19-markers'); cpSync(join(SEMANTIC_TEST_ROOT, 'docs/fixtures/run-slice-2'), run, { recursive: true });
    const path = 'corpus/sources/SRC-101-access-model.md', before = readFileSync(join(run, path));
    const after = Buffer.concat([before, Buffer.from('\nLiteral frozen data: 1.8.0-provisional duplicate-overlap-review aleph-duplicate-review-subject/v1 duplicate_review_closure_hash\n')]);
    writeFixtureFile(run, path, after);
    writeFixtureFile(run, 'corpus/manifest.md', readFileSync(join(run, 'corpus/manifest.md'), 'utf8').replace(materialHash(before), materialHash(after)));
    const model = loadRun(run); let packetBytes = readFileSync(join(run, 'ledgers/packet-index.md'), 'utf8');
    for (const packet of model.packets) {
      const source = model.corpus.sources.find((s) => s.values.sourceId === packet.values.sourceId)!;
      const match = /^L(\d+)-L(\d+)$/u.exec(packet.values.locator)!;
      packetBytes = packetBytes.replace(packet.values.spanHash, materialHash(mdLineSpan(sourceFilePath(run, source.values.locus)!, +match[1], +match[2])!.bytes!));
    }
    writeFixtureFile(run, 'ledgers/packet-index.md', packetBytes);
    assert.equal(validateRun({ run }).result, 'PASS'); cases++;
  });
  family(20, 'Repeated same-origin reporting does not become independent corroboration', () => {
    const f = duplicateFixtureMultiSourceBase(join(temp, 'F20'), 2);
    duplicateFixtureDiscovery(f, [['CC-0801', 'CC-0811']]); review(f, 'duplicate'); check(f);
    assert.equal(f.subject!.proposal.origin_assessment.corroboration, 'restatement');
    assert.equal(f.subject!.proposal.origin_assessment.occurrence_groups.length, 1);
    assert.equal(f.subject!.proposal.provenance_union.occurrences.length, 2);
  });
  family(21, 'Same topic but different assertion remains distinct', () => {
    check(makeDuplicateFixture(join(temp, 'F21'), { first: 'The indicator lit.', last: 'The indicator was replaced.', outcome: 'distinct' }));
  });
  family(22, 'Equivalence with unknown support origin cannot authorize absorption', () => {
    const f = duplicateFixtureBase(join(temp, 'F22'));
    review(f, 'duplicate', 'upheld', (p) => {
      const finding = duplicateFixtureFinding(core.buildComparisonBasis(loadRun(f.run), p.member_ids));
      Object.assign(finding, { dimension: 'support-origin', input_refs: ['/occurrences'], missing: 'The frozen source does not determine whether the reporting origins are independent.' });
      p.unresolved_findings = [finding]; p.origin_assessment.corroboration = 'CANNOT_DETERMINE'; p.origin_assessment.unresolved_finding_refs = ['F1'];
    });
    check(f); assert(core.duplicateAdmissionProblems(f.subject!, 'upheld').some((p) => p.includes('origin')));
  });
  family(23, 'Identical facet shapes with different meanings may receive a refutation', () => {
    const f = makeDuplicateFixture(join(temp, 'F23'), { first: 'The indicator lit.', last: 'The indicator broke.', outcome: 'duplicate', verdict: 'refuted' });
    check(f); assert.equal(f.ledger.decisions[0].verdict, 'refuted');
  });
  family(24, 'Different facet declarations do not deterministically forbid a duplicate', () => {
    const first = 'The indicator lit during trial A.', last = 'During trial A the indicator was illuminated.';
    const f = duplicateFixtureBase(join(temp, 'F24'), first, last, { lastSemantics: facet(last, 'scope', 'experiment-task') });
    duplicateFixtureDiscovery(f); makeDuplicateSuccessorFixture(f.run, false, { base: f }); check(f);
    assert.notDeepEqual(f.subject!.comparison_basis.semantic_projections[0].semantics, f.subject!.comparison_basis.semantic_projections[1].semantics);
  });
  family(25, 'Metric and comparator coverage uses exact source anchors', () => {
    const first = 'The trial measured 4 watts relative to standby.', last = 'The trial measured 4 volts relative to full power.';
    const a = facet(first, 'metric', 'measured-quantity'), b = facet(last, 'metric', 'measured-quantity');
    a.units[0].comparator = facet(first, 'comparator', 'comparison-basis').units[0].comparator;
    b.units[0].comparator = facet(last, 'comparator', 'comparison-basis').units[0].comparator;
    const f = duplicateFixtureBase(join(temp, 'F25'), first, last, { firstSemantics: a, lastSemantics: b });
    review(f, 'distinct'); check(f);
    assert(f.subject!.comparison_fields.some((r) => r.dimension === 'metric' && r.field_ref.endsWith('/items/0')));
  });
  family(26, 'Incident relation proposals remain visible without transferring L3R authority', () => {
    const text = 'The indicator lit during trial A.', semantics = fixtureSemantics(text);
    const proposal: Semantics['relation_proposals'][number] = { subject: {
      format: 'aleph-relation-review-subject/v1', owner_stage: 'S3', family: 'source-context', type: 'qualifier-context',
      source_kind: 'CC', source_id: 'CC-0801', target_kind: 'null', target_id: 'none', target_source_id: 'none',
      target_locator: 'none', target_span_hash: 'none', record_state: 'explicitly-absent', null_reason: 'bounded-review-found-none',
      basis_packet_ids: ['PKT-0701'], proposed_by: 'human:synthetic-relation-producer',
    }, review_subject_digest: '', material_use: TEXT_USE };
    proposal.review_subject_digest = relationReviewSubjectDigest(semanticRelationRow(proposal).values);
    semantics.relation_proposals.push(proposal);
    const f = duplicateFixtureBase(join(temp, 'F26'), text, text, { firstSemantics: semantics,
      firstRelationContext: [{ proposal_index: 0, target_units: [], target_anchors: [], target_packet_context: [] }] });
    review(f); check(f); assert.equal(f.subject!.comparison_basis.relation_context.length, 1);
    assert.equal(parseRelations(loadRun(f.run)).rows.length, 0);
    const working = duplicateFixtureBase(join(temp, 'F26-working'));
    duplicateFixtureWorkingContext(working.run, 'CC-0801');
    review(working, 'CANNOT_DETERMINE', 'cannot-determine'); check(working);
    assert(working.subject!.comparison_basis.ambiguity_context.some((c) => c.kind === 'slice5-working-subject'));
    assert(working.subject!.comparison_basis.inspection_anchors.some((a) => a.locator === 'L1-L3' && a.exact_bytes_base64.length > 0));
  });
  family(27, 'Zero candidates with full discovery and independent sweep closes structurally', () => {
    const f = makeDuplicateFixture(join(temp, 'F27'), { empty: true }); closeDuplicateFixture(f); check(f);
    assert.equal(f.ledger.proposals.length, 0); assert.equal(f.discovery.catalogue.length, 2);
    const run = join(temp, 'F27-zero-current'), semantic = makeFragmentSemanticFixture(run, undefined, undefined, '1.8.0-provisional');
    addFixtureNormalization(semantic, { number: '0811', noClaim: true, packets: ['PKT-0701'], origins: ['SEM-0701/U1'] });
    addFixtureNormalization(semantic, { number: '0812', noClaim: true, packets: ['PKT-0702'], origins: ['SEM-0701/U2'] });
    sealFixtureSemanticStage(semantic, 'S3');
    writeFixtureFile(run, 'run-log.md', readFileSync(join(run, 'run-log.md'), 'utf8') + '\n## 2026-09-13 12:00 UTC — S4 — entry\n\nSynthetic empty current catalogue.\n');
    writeFixtureFile(run, core.DUPLICATE_PATH, core.duplicateLedgerMarkdown(core.emptyDuplicateLedger()));
    const empty = { run, semantic, ledger: core.emptyDuplicateLedger() } as DuplicateFixture;
    duplicateFixtureDiscovery(empty, []); check(empty);
    assert.deepEqual(empty.discovery.catalogue, []); assert.deepEqual(empty.discovery.windows, []); assert.deepEqual(empty.discovery.sweep_refs, []);
  });
  family(28, 'Refuted mixed group and later reviewed subgroup retain separate immutable history', () => {
    const f = duplicateFixtureBase(join(temp, 'F28'), 'The indicator lit during trial A.', 'The indicator failed to light.', { third: 'The indicator lit during trial A.' });
    duplicateFixtureDiscovery(f, [['CC-0801', 'CC-0802', 'CC-0804']]); review(f, 'duplicate', 'refuted');
    duplicateFixtureDiscovery(f, [['CC-0801', 'CC-0804']], '0002');
    makeDuplicateSuccessorFixture(f.run, false, { base: f, proposalNumber: '0002', predecessor: 'DUP-0001' });
    closeDuplicateFixture(f); check(f);
    assert.equal(f.ledger.proposals.length, 2); assert.equal(f.ledger.decisions[0].verdict, 'refuted');
    assert.deepEqual(f.ledger.effects.map((e) => e.effect), ['not-admitted', 'canonicalized']);
    assert.equal(loadRun(f.run).merges.length, 1);
  });
} finally {
  const emit = process.argv.find((a) => a.startsWith('--emit='))?.slice(7);
  if (emit) writeFixtureFile(emit, 'cases.json', JSON.stringify({ notice: 'Synthetic challenge scenarios; no semantic reference answers.', records }, null, 2) + '\n');
  rmSync(temp, { recursive: true, force: true });
}
const report = { result: records.length === 28 && records.every((r) => r.result === 'PASS') ? 'PASS' : 'FAIL', families: records.length, cases, records };
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.result === 'PASS' ? 0 : 1;

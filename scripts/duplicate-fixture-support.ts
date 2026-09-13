/** Synthetic declarations only. These helpers do not execute human/model reviews. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  addFixtureNormalization, fixtureSemantics, fixtureTable, fixtureReview, makeFragmentSemanticFixture,
  sealFixtureSemanticStage, writeFixtureFile, makeSemanticFixture, fixtureResult, TEXT_USE, type SemanticFixture,
} from './semantic-fixture-support.ts';
import { loadRun } from './lib/run-model.ts';
import { materialHash, materialFragmentsHash, prepareRepresentationCapture, representationMarkdown, readRepresentationContext, representationUseDigest, representationUsesMarkdown, type MaterialRow } from './lib/source-representation.ts';
import { buildSemanticSubject, emptySemanticLedger, semanticJson, semanticSubjectPath, semanticLedgerMarkdown, semanticMaterialViews, semanticProducerBinding, SEMANTIC_PATH, type SemanticSubject, type LineageContext } from './lib/semantic-review.ts';
import { parseTables } from './lib/markdown.ts';
import { sourceWalkReviewBasisDigest } from './lib/checks-k2.ts';
import { RELATION_FORMAT, RELATION_TABLE_HEADER, parseRelations, relationReviewSubjectDigest } from './lib/relations.ts';
import { lineageCurrentClaimIds } from './lib/lineage.ts';
import { INTERNAL_AMBIGUITY_FORMAT, T5_1_HEADER, T5_2_HEADER, T5_3_HEADER,
  ambiguityReviewSubjectJson, searchBasisDigest, type AmbiguityReviewSubject } from './lib/internal-ambiguity.ts';
import { sourceFilePath } from './lib/check-helpers.ts';
import {
  buildComparisonBasis, buildDuplicateDiscovery, buildDuplicateSubject, duplicateComparisonFields,
  duplicateLedgerMarkdown, duplicatePairs, duplicatePath, duplicateProducerBinding, duplicateProvenanceUnion,
  duplicateProducerPaths, duplicateSweepView,
  duplicateQuorum, emptyDuplicateLedger, DUPLICATE_ASSIGNMENT_FORMAT, DUPLICATE_DIMENSIONS, DUPLICATE_EFFECT_FORMAT,
  DUPLICATE_PATH, DUPLICATE_RESULT_FORMAT, type ComparisonBasis, type DuplicateAssignment, type DuplicateDiscovery,
  type DuplicateEffect, type DuplicateFinding, type DuplicateLedger, type DuplicateOutcome, type DuplicateProposal,
  type DuplicateResult, type DuplicateSubject, type DuplicateVerdict,
} from './lib/duplicate-review.ts';

export const DUPLICATE_MANUAL_PROFILE = {
  profile_id: 'n/a (core-manual)', profile_digest: null, role: 'verifier-l3', model_identity: 'human',
} as const;
export const DUPLICATE_FIXTURE_NOTICE = '# Synthetic duplicate review\n\n```aleph-fixture\nkind: run\n```\n\n'
  + 'These are synthetic challenge declarations, not semantic ground truth. Actor/pass names represent static test data; '
  + 'no human or model review was executed. Passing structure carries no semantic warrant, exhaustive recall, or F-03 closure.\n';

export interface DuplicateFixture {
  run: string; semantic: SemanticFixture; ledger: DuplicateLedger; discovery: DuplicateDiscovery;
  subject?: DuplicateSubject; producer?: { call_id: string; context_id: string; raw_return_hash: string; output_kind: string; output_index: number };
}
export function duplicateFixtureWrite(f: DuplicateFixture): void {
  writeFixtureFile(f.run, DUPLICATE_PATH, duplicateLedgerMarkdown(f.ledger));
}
/** Existing Slice 5 working subject as static synthetic input, never a search execution claim. */
export function duplicateFixtureWorkingContext(run: string, claimId: string): string {
  const model = loadRun(run), row = model.claims.find((r) => r.values.claimId === claimId)!;
  const packet = row.values.packets.split(',')[0].trim();
  const semantic = model.files.filter((f) => /^verification\/harness\/semantic-subjects\/SEM-\d+\.json$/u.test(f.relativePath))
    .map((f) => JSON.parse(f.text) as SemanticSubject)
    .find((s) => s.output_binding.kind === 'claim' && s.output_binding.reserved_claim_id === claimId)!;
  const anchor = semantic.anchors[0], completion = model.sourceWalk.completions.find((r) => r.values.sourceId === anchor.source_id)!.values;
  const sourceRow = model.corpus.sources.find((r) => r.values.sourceId === anchor.source_id)!.values;
  const source = readFileSync(sourceFilePath(run, sourceRow.locus)!);
  const working: AmbiguityReviewSubject = { source_entity_kind: 'CC', source_entity_id: claimId, source_id: anchor.source_id,
    expression_locator: anchor.locator, expression_start_byte: anchor.start_byte, expression_end_byte: anchor.end_byte,
    expression_sha256: anchor.selection_hash, expression_bytes_base64: anchor.exact_bytes_base64, basis_packet_ids: [packet],
    search_scope_kind: 'full-same-source', search_completion_ref: `${anchor.source_id}@${completion.finalCursorId}@${completion.sourceHash}`,
    search_basis_digest: '', candidate_state: 'null-cannot-determine', candidate_refs: [], affected_relation_ids: [],
    resolution_state: 'unresolved', carry_state: 'none', proposed_by: 'human:synthetic-search-declaration' };
  working.search_basis_digest = searchBasisDigest({ source_id: anchor.source_id, source_hash: materialHash(source), source_length_bytes: source.length,
    scope_kind: working.search_scope_kind, scope_refs: [], completion_ref: working.search_completion_ref,
    expression_start_byte: anchor.start_byte, expression_end_byte: anchor.end_byte, expression_sha256: anchor.selection_hash,
    basis_packet_ids: working.basis_packet_ids, candidate_state: working.candidate_state, candidate_refs: working.candidate_refs });
  const path = 'verification/harness/semantic-process/duplicate-working-context.json';
  writeFixtureFile(run, path, ambiguityReviewSubjectJson(working));
  return path;
}
export function duplicateFixtureBase(run: string, first = 'The indicator lit during trial A.',
  last = 'The indicator lit during trial A.', options: {
    firstSemantics?: SemanticSubject['semantics'];
    lastSemantics?: SemanticSubject['semantics'];
    firstMaterialUse?: NonNullable<Parameters<typeof addFixtureNormalization>[1]>['materialUse'];
    firstRelationContext?: SemanticSubject['relation_context'];
    suppliedTable?: boolean;
    third?: string;
  } = {}): DuplicateFixture {
  const semantic = makeFragmentSemanticFixture(run, first, last, '1.8.0-provisional');
  if (options.suppliedTable) {
    const material = readRepresentationContext(loadRun(run)), inv = material.inventory;
    const asset = Buffer.from('Synthetic supplied one-cell table declaration; this is not an inferred chart value.');
    const bytes = Buffer.from(last), anchor = semantic.entry.anchors[1];
    writeFixtureFile(run, 'corpus/representation-assets/AST-0900.txt', asset);
    inv.assets.push({ asset_id: 'AST-0900', representation_id: 'REP-0001', role: 'structure-export',
      locus: 'corpus/representation-assets/AST-0900.txt', media_type: 'text/plain', encoding: 'utf8',
      byte_length: String(asset.length), content_hash: materialHash(asset) });
    inv.provenance.push({ provenance_id: 'RPR-0900', representation_id: 'REP-0001', type: 'supplied-structure',
      actor: 'synthetic-supplier', tool: 'synthetic-export', tool_version: '1', input_refs: '["SRC-701"]', output_refs: '["AST-0900"]',
      parameters_asset_id: 'none', declaration_asset_id: 'AST-0900' });
    inv.bindings.push({ binding_id: 'BND-0900', representation_id: 'REP-0001', carrier_id: 'SRC-701', start_byte: String(anchor.start_byte),
      end_byte: String(anchor.end_byte), page_id: 'none', region_id: 'none', byte_role: 'frozen-source-bytes',
      fragment_hash: materialHash(bytes), exact_bytes_base64: bytes.toString('base64') });
    for (const [object_id, kind, coordinates] of [
      ['OBJ-0900', 'table', '{"row_ids":["OBJ-0901"],"column_ids":["OBJ-0902"],"grid_state":"available"}'],
      ['OBJ-0901', 'row', '{"index":1}'], ['OBJ-0902', 'column', '{"index":1}'],
      ['OBJ-0903', 'cell', '{"row_ids":["OBJ-0901"],"column_ids":["OBJ-0902"]}'],
    ]) inv.objects.push({ object_id, representation_id: 'REP-0001', kind, parent_id: kind === 'table' ? 'OBJ-0001' : 'OBJ-0900',
      state: 'available', reason: 'none', provenance_id: 'RPR-0900', binding_ids: '["BND-0900"]',
      content_hash: materialFragmentsHash([bytes]), coordinates });
    inv.associations.push({ association_id: 'ASC-0900', representation_id: 'REP-0001', kind: 'caption-for',
      subject_id: 'OBJ-0900', target_ids: '[]', state: 'unsupported', reason: 'No supplied caption.',
      provenance_id: 'RPR-0900' });
    inv.associations.push({ association_id: 'ASC-0901', representation_id: 'REP-0001', kind: 'header-for',
      subject_id: 'OBJ-0903', target_ids: '[]', state: 'unsupported', reason: 'No supplied header.',
      provenance_id: 'RPR-0900' });
    const inventory = representationMarkdown(inv);
    writeFixtureFile(run, 'corpus/representations.md', inventory);
    writeFixtureFile(run, 'run-manifest.md', readFileSync(join(run, 'run-manifest.md'), 'utf8')
      .replace(/representation_inventory_hash: sha256:[0-9a-f]{64}/u, `representation_inventory_hash: ${materialHash(inventory)}`));
    let model = loadRun(run);
    const uses = material.uses.map((row) => ({ ...row, review_subject_digest: representationUseDigest(model, readRepresentationContext(model), row) }));
    writeFixtureFile(run, 'ledgers/representation-uses.md', representationUsesMarkdown(uses));
    const walk = readFileSync(join(run, 'ledgers/source-walk.md'), 'utf8');
    writeFixtureFile(run, 'ledgers/source-walk.md', walk.replace(model.sourceWalk.gapReviews[0].values.reviewBasisDigest,
      sourceWalkReviewBasisDigest(model, 'SRC-701', 'CUR-0702')!));
    model = loadRun(run);
    semantic.subject = buildSemanticSubject(model, { ...semantic.subject, anchors: semantic.entry.anchors,
      material_views: semanticMaterialViews(model, uses) });
    const digest = materialHash(semanticJson(semantic.subject));
    semantic.ledger.subjects[0].subject_digest = digest;
    semantic.assignment.subject_digest = digest;
    writeFixtureFile(run, semanticSubjectPath(semantic.subject.semantic_id), semanticJson(semantic.subject));
    fixtureReview(semantic, fixtureResult(semantic.subject));
  }
  writeFixtureFile(run, 'README.md', DUPLICATE_FIXTURE_NOTICE);
  addFixtureNormalization(semantic, { number: '0801', origins: ['SEM-0701/U1'], packets: ['PKT-0701'],
    anchors: [{ ...semantic.entry.anchors[0], anchor_id: 'A1' }], semantics: options.firstSemantics || fixtureSemantics(first),
    materialUse: options.firstMaterialUse, relationContext: options.firstRelationContext });
  addFixtureNormalization(semantic, { number: '0802', origins: ['SEM-0701/U2'], packets: ['PKT-0702'],
    anchors: [{ ...semantic.entry.anchors[1], anchor_id: 'A1' }], semantics: options.lastSemantics || fixtureSemantics(last),
    ...(options.suppliedTable ? { materialUse: { ...TEXT_USE, requirements: [
      { object_id: 'OBJ-0900', feature: 'table-grid', binding_ids: ['BND-0900'] },
    ] } } : {}) });
  if (options.third) {
    const semantics = fixtureSemantics(first);
    semantics.units[0].proposition = options.third;
    addFixtureNormalization(semantic, { number: '0804', origins: ['SEM-0701/U1'], packets: ['PKT-0701'],
      anchors: [{ ...semantic.entry.anchors[0], anchor_id: 'A1' }], semantics });
  }
  sealFixtureSemanticStage(semantic, 'S3');
  writeFixtureFile(run, 'run-log.md', readFileSync(join(run, 'run-log.md'), 'utf8')
    + '\n## 2026-09-13 10:00 UTC — S4 — entry\n\nSynthetic duplicate challenge accounting.\n');
  const f = { run, semantic, ledger: emptyDuplicateLedger() } as DuplicateFixture;
  duplicateFixtureWrite(f);
  return f;
}

/** Construct independent synthetic source coordinates before sealing any S2/S3 history. */
export function duplicateFixtureMultiSourceBase(run: string, count = 3): DuplicateFixture {
  const semantic = makeSemanticFixture(run, 'The indicator lit during trial A.', undefined, undefined, '1.8.0-provisional');
  const originals = Object.fromEntries(['corpus/manifest.md', 'ledgers/packet-index.md', 'ledgers/source-walk.md']
    .map((path) => [path, readFileSync(join(run, path), 'utf8')]));
  const transform = (text: string, i: number): string => text
    .replaceAll('SRC-701', `SRC-${701 + i}`).replaceAll('0701', `07${i}1`).replaceAll('0702', `07${i}2`)
    .replaceAll('sources/semantic.txt', `sources/semantic-${i}.txt`);
  for (const [path, original] of Object.entries(originals)) {
    const tableSets = Array.from({ length: count }, (_, i) => parseTables(transform(original, i)));
    const lines = original.split('\n'), tables = parseTables(original);
    for (let t = tables.length - 1; t >= 0; t--) {
      lines.splice(tables[t].line - 1, tables[t].rows.length + 2,
        fixtureTable(tables[t].header, tableSets.flatMap((set) => set[t].rows.map((row) => row.cells))).trimEnd());
    }
    writeFixtureFile(run, path, lines.join('\n'));
  }
  const sources = Array.from({ length: count }, (_, i) => ({ source_id: `SRC-${701 + i}`, bytes: semantic.source }));
  sources.forEach((source, i) => writeFixtureFile(run, `corpus/sources/semantic-${i}.txt`, source.bytes));
  const inventory = representationMarkdown(prepareRepresentationCapture(sources).inventory);
  writeFixtureFile(run, 'corpus/representations.md', inventory);
  writeFixtureFile(run, 'run-manifest.md', readFileSync(join(run, 'run-manifest.md'), 'utf8')
    .replace(/^-\srepresentation_inventory_hash: .+$/mu, `- representation_inventory_hash: ${materialHash(inventory)}`)
    .replace(/^-\scorpus_hash: .+$/mu, `- corpus_hash: ${materialHash(Buffer.concat(sources.map((s) => s.bytes)))}`));
  const walk = readFileSync(join(run, 'ledgers/source-walk.md'), 'utf8'), model = loadRun(run);
  const gapTable = parseTables(walk)[3], walkLines = walk.split('\n');
  for (let i = 0; i < count; i++) {
    const row = [...gapTable.rows[i].cells];
    row[5] = sourceWalkReviewBasisDigest(model, `SRC-${701 + i}`, `CUR-07${i}2`)!;
    walkLines[gapTable.rows[i].line - 1] = `| ${row.join(' | ')} |`;
  }
  writeFixtureFile(run, 'ledgers/source-walk.md', walkLines.join('\n'));
  const ledger = emptySemanticLedger(), useRows: MaterialRow[] = [];
  semantic.ledger = ledger;
  for (let i = 0; i < count; i++) {
    const number = `07${i}1`, material_use = { ...TEXT_USE, requirements: [{
      object_id: `OBJ-${String(i * 2 + 2).padStart(4, '0')}`, feature: 'text-bytes' as const,
      binding_ids: [`BND-${String(i + 1).padStart(4, '0')}`],
    }] };
    const entry = JSON.parse(transform(semanticJson(semantic.entry), i)) as SemanticFixture['entry'];
    const returned = JSON.parse(transform(semanticJson(semantic.returned), i)) as SemanticFixture['returned'];
    (returned.packets as Array<{ material_use: unknown }>)[0].material_use = material_use;
    const producer = { call_id: `manual-producer-${number}`, context_id: `manual-producer-pass-${number}`,
      raw_return_hash: materialHash(semanticJson(returned)), output_kind: 'packet-candidate', output_index: 0 };
    const receipt = `verification/harness/semantic-process/producer-${number}.json`;
    writeFixtureFile(run, receipt, semanticJson(producer));
    writeFixtureFile(run, `verification/harness/semantic-process/${producer.call_id}.raw.json`, semanticJson(returned));
    const use: MaterialRow = { use_id: `USE-${number}`, owner_stage: 'S2', subject_kind: 'PKT', subject_id: `PKT-${number}`,
      basis_packet_ids: semanticJson([`PKT-${number}`]), requirements: semanticJson(material_use.requirements), use_state: 'usable',
      fidelity_claim: 'none', limitation_refs: '[]', reason: 'none', established_by: 'synthetic-manual-producer', review_subject_digest: '', reviewed_by: 'none' };
    const current = loadRun(run), context = readRepresentationContext(current);
    use.review_subject_digest = representationUseDigest(current, context, use);
    useRows.push(use); writeFixtureFile(run, 'ledgers/representation-uses.md', representationUsesMarkdown(useRows));
    const subject = buildSemanticSubject(loadRun(run), { ...semantic.subject, semantic_id: `SEM-${number}`,
      producer_binding_hash: semanticProducerBinding(producer), output_binding: { kind: 'packet-group', evidence_keys: [`EVID-${number}`], packet_ids: [`PKT-${number}`] },
      anchors: entry.anchors, semantics: entry.semantics, material_use, material_views: semanticMaterialViews(loadRun(run), [use]) });
    const digest = materialHash(semanticJson(subject));
    writeFixtureFile(run, semanticSubjectPath(subject.semantic_id), semanticJson(subject));
    ledger.subjects.push({ semantic_id: subject.semantic_id, owner_stage: 'S2', subject_kind: 'packet-group',
      subject_path: semanticSubjectPath(subject.semantic_id), subject_digest: digest, predecessor_semantic_id: 'none',
      producer_receipt_ref: `${receipt}@${materialHash(semanticJson(producer))}` });
    ledger.resolutions.push({ resolution_id: `SMR-${number}`, semantic_id: subject.semantic_id, outcome: 'admitted',
      review_ids: semanticJson([`VER-${number}`]), canonical_refs: semanticJson([`PKT-${number}`]), origin_unit_refs: '[]', followup_semantic_ids: '[]' });
    const fixture = { ...semantic, subject, entry, returned, producer, assignment: { ...semantic.assignment, semantic_id: subject.semantic_id,
      subject_digest: digest, review_id: `VER-${number}`, producer_binding_hash: subject.producer_binding_hash }, ledger };
    fixtureReview(fixture, fixtureResult(subject));
  }
  writeFixtureFile(run, SEMANTIC_PATH, semanticLedgerMarkdown(ledger));
  for (let i = 0; i < count; i++) {
    const origin = JSON.parse(readFileSync(join(run, semanticSubjectPath(`SEM-07${i}1`)), 'utf8')) as SemanticSubject;
    addFixtureNormalization(semantic, { number: `08${i}1`, origins: [`${origin.semantic_id}/U1`], packets: [`PKT-07${i}1`],
      anchors: origin.anchors.map(({ anchor_id, source_id, locator, start_byte, end_byte, exact_bytes_base64 }) =>
        ({ anchor_id, source_id, locator, start_byte, end_byte, exact_bytes_base64 })), materialUse: origin.material_use! });
  }
  sealFixtureSemanticStage(semantic, 'S3');
  writeFixtureFile(run, 'README.md', DUPLICATE_FIXTURE_NOTICE);
  writeFixtureFile(run, 'run-log.md', readFileSync(join(run, 'run-log.md'), 'utf8')
    + '\n## 2026-09-13 10:00 UTC — S4 — entry\n\nSynthetic multi-source duplicate challenge.\n');
  const f = { run, semantic, ledger: emptyDuplicateLedger() } as DuplicateFixture;
  duplicateFixtureWrite(f); return f;
}
export function duplicateFixtureDiscovery(f: DuplicateFixture, groups: string[][] = [['CC-0801', 'CC-0802']],
  number = '0001', options: {
    flaggedPairs?: Array<{ a: string; b: string; why: string }>;
    seededCandidates?: DuplicateDiscovery['candidates'];
  } = {}): DuplicateDiscovery {
  const model = loadRun(f.run);
  const members = model.claims.map((c) => c.values.claimId).filter((id) => lineageCurrentClaimIds(model).has(id));
  if (!members.length) {
    const discovery = buildDuplicateDiscovery(model, { discovery_id: `DCD-${number}`, windows: [], candidates: [], sweep_refs: [], unresolved_findings: [] });
    const record_path = duplicatePath('discovery', discovery.discovery_id), bytes = semanticJson(discovery);
    writeFixtureFile(f.run, record_path, bytes);
    f.ledger.discoveries.push({ discovery_id: discovery.discovery_id, record_path, record_digest: materialHash(bytes) });
    f.discovery = discovery; duplicateFixtureWrite(f); return discovery;
  }
  const catalogue = members.map((claim_id) => {
    const row = f.semantic.ledger.resolutions.find((r) => r.outcome === 'admitted' && JSON.parse(r.canonical_refs).includes(claim_id))!;
    const s = JSON.parse(readFileSync(join(f.run, semanticSubjectPath(row.semantic_id)), 'utf8')) as SemanticSubject;
    if (s.output_binding.kind !== 'claim') throw new Error('fixture requires admitted claim');
    const c = s.output_binding, claim_projection = { normalized_claim: c.normalized_claim, packets: c.packet_ids, sources: c.source_ids, claim_type: c.claim_type };
    return { claim_id, claim_projection, semantic_id: s.semantic_id, semantic_subject_digest: materialHash(semanticJson(s)),
      packet_ids: c.packet_ids, source_ids: c.source_ids };
  });
  const candidates = groups.map((member_ids) => ({ member_ids,
    basis_refs: member_ids.map((id) => `/catalogue/${catalogue.findIndex((m) => m.claim_id === id)}`), signal: 'semantic-proposal' as const }));
  const returned = { candidates, unresolved_findings: [], rationale: 'Synthetic candidates exercise accounting; no equivalence conclusion.', flags: [] };
  const producer = { call_id: `discovery-${number}`, context_id: `discovery-pass-${number}`,
    raw_return_hash: materialHash(semanticJson(returned)), output_kind: 'duplicate-discovery', output_index: 0 };
  const producerPath = duplicatePath('process', `producer-discovery-${number}`);
  writeFixtureFile(f.run, producerPath, semanticJson(producer));
  writeFixtureFile(f.run, duplicatePath('process', `${producer.call_id}.raw`), semanticJson(returned));
  writeFixtureFile(f.run, duplicateProducerPaths(producer.call_id).selection, semanticJson({ member_ids: members }));
  writeFixtureFile(f.run, duplicateProducerPaths(producer.call_id).view, semanticJson(catalogue));
  const reviewId = `VER-9${number}`, verifierPath = `verification/harness/S4/${reviewId}.md`;
  const sweep = { verdict: options.flaggedPairs?.length ? 'refuted' : 'upheld', rationale: 'Synthetic independent contradiction sweep declaration; not semantic evidence.',
    attacks_tried: ['Counter-reading declared for every shown claim.'], evidence_ids: [], candidate_evidence: [],
    missing_for_determination: null, flags: [], flagged_pairs: options.flaggedPairs || [] };
  const sweepPath = duplicatePath('process', `sweep-${number}`), sweepBytes = semanticJson(sweep);
  const shownPath = duplicatePath('process', `sweep-${number}.view`), shownBytes = duplicateSweepView(model, catalogue);
  writeFixtureFile(f.run, shownPath, shownBytes);
  const companion = `# Verdict ${reviewId}\n\n` + fixtureTable(['field', 'value'], [['target', 'current-claim-catalogue'], ['lens', 'L5'], ['stage', 'S4'],
    ['shown', `${shownPath}@${materialHash(shownBytes)}`], ['withheld', 'Merge map and duplicate conclusions.'],
    ['verdict', sweep.verdict], ['consequence', 'Static synthetic declaration only.']]);
  writeFixtureFile(f.run, verifierPath, companion); writeFixtureFile(f.run, sweepPath, sweepBytes);
  const discovery = buildDuplicateDiscovery(loadRun(f.run), { discovery_id: `DCD-${number}`,
    windows: [{ window_id: 'W1', member_ids: members, shown_digest: materialHash(semanticJson(catalogue)),
      producer_binding_hash: duplicateProducerBinding(producer), execution_evidence_ref: `${producerPath}@${materialHash(semanticJson(producer))}` }],
    candidates: [...candidates.map((c, i) => ({ candidate_id: `G${i + 1}`, ...c })), ...(options.seededCandidates || [])],
    sweep_refs: [{ review_id: reviewId, verifier_ref: `${verifierPath}@${materialHash(companion)}`, result_ref: `${sweepPath}@${materialHash(sweepBytes)}`,
      window_member_ids: members, shown_digest: materialHash(shownBytes) }], unresolved_findings: [] });
  const record_path = duplicatePath('discovery', discovery.discovery_id), bytes = semanticJson(discovery);
  writeFixtureFile(f.run, record_path, bytes);
  f.ledger.discoveries.push({ discovery_id: discovery.discovery_id, record_path, record_digest: materialHash(bytes) });
  f.discovery = discovery; duplicateFixtureWrite(f); return discovery;
}
export function duplicateFixtureFinding(basis: ComparisonBasis): DuplicateFinding {
  return { finding_id: 'F1', dimension: 'proposition', input_refs: ['/semantic_projections/0/semantics/units/0/proposition'],
    anchor_refs: [{ semantic_id: basis.members[0].semantic_id, anchor_id: 'A1' }], material_refs: [],
    missing: 'The frozen basis leaves the declared comparison unresolved.', requested_context: [] };
}
export function duplicateFixtureProposal(basis: ComparisonBasis, outcome: DuplicateOutcome = 'distinct',
  candidate_ref = 'DCD-0001/G1'): DuplicateProposal {
  const fields = duplicateComparisonFields(basis), member_ids = basis.members.map((m) => m.claim_id);
  const provenance_union = duplicateProvenanceUnion(basis);
  return { candidate_ref, member_ids,
    member_semantic_refs: basis.members.map((m, i) => ({ claim_id: m.claim_id, semantic_id: m.semantic_id,
      subject_digest: m.semantic_subject_digest, unit_refs: basis.semantic_projections[i].semantics.units.map((u) => `${m.semantic_id}/${u.unit_id}`) })),
    comparison_basis_digest: materialHash(semanticJson(basis)), review_mode: outcome === 'CANNOT_DETERMINE' ? 'unresolved-record' : 'proposal',
    outcome, treatment: 'keep-separate',
    distinctions: DUPLICATE_DIMENSIONS.map((dimension, i) => ({
      distinction_id: `D${i + 1}`, dimension, member_ids,
      input_refs: fields.filter((f) => f.dimension === dimension).map((f) => f.field_ref), treatment: 'retained',
      retained_at: ['source-occurrence', 'support-origin', 'lineage'].includes(dimension) ? 'occurrence-history' : 'separate-claims',
      content_anchor_refs: [], context_refs: [], explanation: 'Synthetic declared distinction coverage only.',
    })), contradiction_pairs: [],
    origin_assessment: { corroboration: 'restatement', occurrence_groups: [{ occurrence_keys: provenance_union.occurrences.map(semanticJson),
      basis_refs: ['/occurrences'] }], basis_refs: ['/occurrences'], unresolved_finding_refs: [] },
    representative: null, successor_request: null, provenance_union,
    unresolved_findings: outcome === 'CANNOT_DETERMINE' ? [duplicateFixtureFinding(basis)] : [] };
}
export function duplicateFixtureReserve(f: DuplicateFixture, proposal?: DuplicateProposal, number = '0001',
  reservation: DuplicateSubject['reservation'] = null, predecessor: string | null = null): DuplicateSubject {
  proposal ||= duplicateFixtureProposal(buildComparisonBasis(loadRun(f.run), f.discovery.candidates[0].member_ids));
  const returned = { proposal, rationale: 'Synthetic comparison declaration; no semantic ground truth.', flags: [] };
  const producer = { call_id: `comparison-${number}`, context_id: `comparison-pass-${number}`,
    raw_return_hash: materialHash(semanticJson(returned)), output_kind: 'duplicate-proposal', output_index: 0 };
  const receipt = duplicatePath('process', `producer-comparison-${number}`);
  writeFixtureFile(f.run, receipt, semanticJson(producer));
  writeFixtureFile(f.run, duplicatePath('process', `${producer.call_id}.raw`), semanticJson(returned));
  writeFixtureFile(f.run, duplicateProducerPaths(producer.call_id).selection, semanticJson({ candidate_ref: proposal.candidate_ref }));
  writeFixtureFile(f.run, duplicateProducerPaths(producer.call_id).view, semanticJson({
    candidate_ref: proposal.candidate_ref, comparison_basis: buildComparisonBasis(loadRun(f.run), proposal.member_ids),
  }));
  const subject = buildDuplicateSubject(loadRun(f.run), { proposal_id: `DUP-${number}`, predecessor_proposal_id: predecessor,
    producer_binding_hash: duplicateProducerBinding(producer), proposal, reservation, reviewer_profile: DUPLICATE_MANUAL_PROFILE });
  const subject_path = duplicatePath('subjects', subject.proposal_id), bytes = semanticJson(subject);
  writeFixtureFile(f.run, subject_path, bytes);
  f.ledger.proposals.push({ proposal_id: subject.proposal_id, subject_path, subject_digest: materialHash(bytes),
    predecessor_proposal_id: predecessor || 'none', producer_receipt_ref: `${receipt}@${materialHash(semanticJson(producer))}` });
  f.subject = subject; f.producer = producer; duplicateFixtureWrite(f); return subject;
}
export function duplicateFixtureResult(subject: DuplicateSubject, verdict: DuplicateVerdict = 'upheld'): DuplicateResult {
  const unresolved_findings = verdict === 'cannot-determine' ? [duplicateFixtureFinding(subject.comparison_basis)] : [];
  return { format: DUPLICATE_RESULT_FORMAT, subject_digest: materialHash(semanticJson(subject)), verdict,
    assessed_outcome: verdict === 'cannot-determine' ? 'CANNOT_DETERMINE' : subject.proposal.outcome,
    dimension_reviews: DUPLICATE_DIMENSIONS.map((dimension, i) => ({ dimension,
      verdict: i === 0 ? verdict : 'upheld', input_refs: subject.comparison_fields.filter((f) => f.dimension === dimension).map((f) => f.field_ref),
      anchor_refs: [], material_refs: [], explanation: 'Synthetic structural challenge declaration.' })),
    distinction_reviews: subject.proposal.distinctions.map((d, i) => ({ distinction_id: d.distinction_id,
      verdict: i === 0 ? verdict : 'upheld', input_refs: d.input_refs, explanation: 'Synthetic declared field review.' })),
    pair_reviews: duplicatePairs(subject.proposal.member_ids).map((p) => ({ ...p, verdict,
      distinction_refs: subject.proposal.distinctions.map((d) => d.distinction_id), origin_basis_refs: ['/occurrences'],
      explanation: 'Synthetic pair accounting; no deterministic equivalence judgment.' })),
    contradiction_pairs: [], unresolved_findings, attacks_tried: ['Search for surviving proposition, condition, role, origin and context distinctions.'],
    missing_for_determination: verdict === 'cannot-determine' ? unresolved_findings[0].missing : null,
    rationale: 'This static synthetic declaration exercises structural accounting only.', candidate_evidence: [] };
}
export function duplicateFixtureReview(f: DuplicateFixture, verdict: DuplicateVerdict = 'upheld', round: 1 | 2 = 1,
  number = round === 1 ? '0811' : '0812'): { assignment: DuplicateAssignment; result: DuplicateResult } {
  const s = f.subject!, digest = materialHash(semanticJson(s)), review_id = `VER-${number}`;
  const assignment: DuplicateAssignment = { format: DUPLICATE_ASSIGNMENT_FORMAT, proposal_id: s.proposal_id,
    subject_digest: digest, review_id, role: 'verifier-l3', profile_digest: null, invocation_id: `synthetic-review-pass-${number}`,
    producer_binding_hash: s.producer_binding_hash, round, execution_kind: 'manual-separate-pass' };
  const result = duplicateFixtureResult(s, verdict);
  const evidencePath = duplicatePath('process', `reviewer-${number}`);
  const evidence = semanticJson({ producer_actor: 'synthetic-comparison-person', reviewer_actor: `synthetic-reviewer-${round}`,
    producer_pass_id: f.producer!.context_id, reviewer_pass_id: assignment.invocation_id, subject_digest: digest, shown_digest: digest,
    withheld_declaration: 'Only sealed subject and declared assets; no producer rationale, authority or previous review.' });
  const assignment_path = duplicatePath('assignments', review_id), result_path = duplicatePath('results', review_id);
  writeFixtureFile(f.run, assignment_path, semanticJson(assignment)); writeFixtureFile(f.run, result_path, semanticJson(result));
  writeFixtureFile(f.run, evidencePath, evidence);
  writeFixtureFile(f.run, `verification/harness/S4/${review_id}.md`, `# Verdict ${review_id}\n\n` + fixtureTable(['field', 'value'], [
    ['target', `duplicate-review-subject:${digest}`], ['lens', 'L3'], ['stage', 'S4'],
    ['shown', duplicatePath('subjects', s.proposal_id)], ['withheld', 'Producer identity/rationale, authority and previous reviews.'],
    ['verdict', verdict], ['consequence', 'Synthetic actor/pass evidence; no actual human review.']]));
  f.ledger.assignments.push({ review_id, proposal_id: s.proposal_id, assignment_path, assignment_digest: materialHash(semanticJson(assignment)) });
  f.ledger.results.push({ review_id, proposal_id: s.proposal_id, result_path, result_digest: materialHash(semanticJson(result)),
    execution_kind: assignment.execution_kind, execution_evidence_ref: `${evidencePath}@${materialHash(evidence)}` });
  duplicateFixtureWrite(f); return { assignment, result };
}
export function duplicateFixtureDecide(f: DuplicateFixture, rounds: Array<{ assignment: DuplicateAssignment; result: DuplicateResult }>,
  number = '0001', effect: DuplicateEffect['effect'] = 'kept-separate'): DuplicateEffect {
  const s = f.subject!, quorum = duplicateQuorum(rounds), decision_id = `DDR-${number}`, effect_id = `DUE-${number}`;
  f.ledger.decisions.push({ decision_id, proposal_id: s.proposal_id, review_ids: semanticJson(quorum.review_ids),
    verdict: quorum.verdict!, reviewed_outcome: quorum.verdict === 'upheld' ? s.proposal.outcome : 'none' });
  const reason: DuplicateEffect['reason'] = quorum.verdict === 'refuted' ? 'refuted-proposal'
    : quorum.verdict === 'cannot-determine' || s.proposal.outcome === 'CANNOT_DETERMINE' ? 'unresolved-equivalence'
    : s.proposal.origin_assessment.corroboration === 'CANNOT_DETERMINE' ? 'unresolved-origin'
    : s.proposal.outcome === 'duplicate' ? 'withdrawn-reservation' : 'reviewed-nonduplicate';
  if (reason === 'withdrawn-reservation') effect = 'not-admitted';
  const record: DuplicateEffect = { format: DUPLICATE_EFFECT_FORMAT, effect_id, proposal_id: s.proposal_id,
    subject_digest: materialHash(semanticJson(s)), decision_id, effect, reason,
    semantic_ids: [], lineage_id: null, successor_id: null, merge_row_digest: null,
    provenance_union_digest: materialHash(semanticJson(s.proposal.provenance_union)), predecessor_proposal_id: s.predecessor_proposal_id };
  const path = duplicatePath('effects', effect_id), bytes = semanticJson(record);
  writeFixtureFile(f.run, path, bytes);
  f.ledger.effects.push({ effect_id, proposal_id: s.proposal_id, decision_id, effect, semantic_id: 'none',
    lineage_id: 'none', successor_id: 'none', record_ref: `${path}@${materialHash(bytes)}` });
  duplicateFixtureWrite(f); return record;
}
export function makeDuplicateFixture(run: string, options: { first?: string; last?: string; outcome?: DuplicateOutcome;
  verdict?: DuplicateVerdict; second?: DuplicateVerdict; empty?: boolean } = {}): DuplicateFixture {
  const f = duplicateFixtureBase(run, options.first, options.last);
  duplicateFixtureDiscovery(f, options.empty ? [] : undefined);
  if (options.empty) return f;
  const proposal = duplicateFixtureProposal(buildComparisonBasis(loadRun(run), f.discovery.candidates[0].member_ids), options.outcome);
  duplicateFixtureReserve(f, proposal);
  const rounds = [duplicateFixtureReview(f, options.verdict)];
  if (options.verdict === 'cannot-determine') rounds.push(duplicateFixtureReview(f, options.second || 'cannot-determine', 2));
  duplicateFixtureDecide(f, rounds, '0001', rounds.some((r) => r.result.verdict === 'refuted') ? 'not-admitted' : 'kept-separate');
  return f;
}
export function closeDuplicateFixture(f: DuplicateFixture): void {
  const current = loadRun(f.run).claims.filter((c) => lineageCurrentClaimIds(loadRun(f.run)).has(c.values.claimId));
  const rows = current.map((c, i) => [`REL-08${String(i + 50).padStart(2, '0')}`, 'S4', 'source-context', 'qualifier-context', 'CC', c.values.claimId,
    'null', 'none', 'none', 'none', 'none', 'explicitly-absent', 'bounded-review-found-none', c.values.packets,
    'human:synthetic-relation-producer', 'pending', `VER-08${String(i + 50).padStart(2, '0')}`]);
  writeFixtureFile(f.run, 'ledgers/relations.md', `# Typed Relations\n\n- relation_format: ${RELATION_FORMAT}\n\n`
    + fixtureTable([...RELATION_TABLE_HEADER], rows));
  for (const [i, row] of parseRelations(loadRun(f.run)).rows.entries()) {
    rows[i][15] = relationReviewSubjectDigest(row.values);
    writeFixtureFile(f.run, `verification/harness/S4/${row.values.reviewedBy}.md`, `# Verdict ${row.values.reviewedBy}\n\n` + fixtureTable(['field', 'value'], [
      ['target', `relation-review-subject:${rows[i][15]}`], ['lens', 'L3R'], ['stage', 'S4'],
      ['shown', 'Exact synthetic typed-null relation and packet basis.'], ['withheld', 'Duplicate conclusions and authority records.'],
      ['verdict', 'upheld'], ['consequence', 'Synthetic explicit absence declaration only.']]));
  }
  writeFixtureFile(f.run, 'ledgers/relations.md', `# Typed Relations\n\n- relation_format: ${RELATION_FORMAT}\n\n`
    + fixtureTable([...RELATION_TABLE_HEADER], rows));
  const model = loadRun(f.run), material = readRepresentationContext(model);
  const uses = rows.map((r, i) => {
    const origin = material.uses.find((u) => u.subject_kind === 'CC' && u.subject_id === r[5])!;
    const use: MaterialRow = { ...origin, use_id: `USE-08${String(i + 50).padStart(2, '0')}`, owner_stage: 'S4', subject_kind: 'REL',
      subject_id: r[0], basis_packet_ids: semanticJson(r[13].split(',').map((p) => p.trim())), established_by: 'synthetic-relation-producer',
      requirements: semanticJson(TEXT_USE.requirements), limitation_refs: '[]', fidelity_claim: 'none', reviewed_by: 'none' };
    use.review_subject_digest = representationUseDigest(model, material, use); return use;
  });
  writeFixtureFile(f.run, 'ledgers/representation-uses.md', representationUsesMarkdown([...material.uses, ...uses]));
  writeFixtureFile(f.run, 'ledgers/internal-ambiguities.md', `# Internal ambiguities\n\n- internal_ambiguity_format: ${INTERNAL_AMBIGUITY_FORMAT}\n\n`
    + fixtureTable([...T5_1_HEADER], []) + '\n' + fixtureTable([...T5_2_HEADER], []) + '\n' + fixtureTable([...T5_3_HEADER], []));
  if (!model.merges.length) writeFixtureFile(f.run, 'ledgers/merge-map.md', '# Duplicate / Merge Map\n\n'
    + fixtureTable(['canonical', 'absorbs', 'basis', 'provenance retained', 'corroboration', 'status'], []));
  const log = readFileSync(join(f.run, 'run-log.md'), 'utf8');
  writeFixtureFile(f.run, 'run-log.md', log
    + '\n## 2026-09-13 11:00 UTC — S4 — closure\n\nclosure_phase: S4-C1-relations-closed\n'
    + `representation_use_closure_hash: ${materialHash(readFileSync(join(f.run, 'ledgers/representation-uses.md')))}\n`
    + `semantic_review_closure_hash: ${materialHash(readFileSync(join(f.run, SEMANTIC_PATH)))}\n`
    + `duplicate_review_closure_hash: ${materialHash(readFileSync(join(f.run, DUPLICATE_PATH)))}\n`
    + '\n## 2026-09-13 11:10 UTC — S4 — closure\n\nclosure_phase: S4-C2-ambiguities-finalized\n'
    + '\n## 2026-09-13 11:20 UTC — S4 — exit\n\nclosure_phase: S4-C3-exit\n');
}

export function duplicateFixtureSuccessorProposal(basis: ComparisonBasis, proposedClaim = basis.members[0].claim_projection.normalized_claim): DuplicateProposal {
  const proposal = duplicateFixtureProposal(basis, 'duplicate');
  proposal.treatment = 'new-successor';
  for (const d of proposal.distinctions) if (d.retained_at !== 'occurrence-history') {
    d.treatment = d.dimension === 'proposition' ? 'retained' : 'collapsible';
    d.retained_at = d.treatment === 'retained' ? 'successor-content' : null;
    if (d.treatment === 'retained') d.content_anchor_refs = [{ semantic_id: basis.members[0].semantic_id, anchor_id: 'A1' }];
  }
  proposal.representative = { basis_member_ids: [proposal.member_ids[0]], basis_unit_refs: [proposal.member_semantic_refs[0].unit_refs[0]],
    wording_basis: 'selected-member', retained_distinction_refs: proposal.distinctions.filter((d) => d.treatment === 'retained').map((d) => d.distinction_id) };
  proposal.successor_request = { lineage_type: 'duplicate', proposed_claim: proposedClaim, claim_type: 'factual',
    packet_ids: proposal.provenance_union.packet_ids, source_ids: proposal.provenance_union.source_ids,
    semantic_content_refs: ['/semantic_projections/0/semantics/units/0/proposition'], material_use: basis.semantic_projections[0].material_use! };
  return proposal;
}
export function makeDuplicateSuccessorFixture(run: string, rejected = false,
  options: { base?: DuplicateFixture; proposalNumber?: string; predecessor?: string; wording?: string; successorNumber?: string } = {}): DuplicateFixture {
  const f = options.base || duplicateFixtureBase(run);
  if (!options.base) duplicateFixtureDiscovery(f);
  const number = options.proposalNumber || '0001', proposalId = `DUP-${number}`, decisionId = `DDR-${number}`, effectId = `DUE-${number}`;
  const successorNumber = options.successorNumber || '0803', successorId = `CC-${successorNumber}`, lineageId = `LIN-${successorNumber}`, semanticId = `SEM-${successorNumber}`;
  const basis = buildComparisonBasis(loadRun(run), f.discovery.candidates[0].member_ids);
  const proposal = duplicateFixtureSuccessorProposal(basis, options.wording);
  proposal.candidate_ref = `${f.discovery.discovery_id}/G1`;
  duplicateFixtureReserve(f, proposal, number, { lineage_id: lineageId, successor_id: successorId,
    lineage_type: 'duplicate', predecessor_ids: proposal.member_ids }, options.predecessor || null);
  const review = duplicateFixtureReview(f, 'upheld', 1, options.base ? '0831' : '0811');
  f.ledger.decisions.push({ decision_id: decisionId, proposal_id: proposalId, review_ids: semanticJson([review.assignment.review_id]),
    verdict: 'upheld', reviewed_outcome: 'duplicate' });
  duplicateFixtureWrite(f);
  const row = { lineage_id: lineageId, owner_stage: 'S4', type: 'duplicate', predecessors: proposal.member_ids.join(', '),
    successors: successorId, basis: 'Synthetic duplicate subject reviewed separately from successor preservation.', established_by: 'synthetic-orchestrator' };
  writeFixtureFile(run, `verification/harness/semantic-process/${lineageId}.json`, semanticJson(row));
  const lineage: LineageContext = { lineage_id: row.lineage_id, row_digest: materialHash(semanticJson(Object.values(row))),
    event: { owner_stage: 'S4', type: 'duplicate', predecessors: proposal.member_ids, successors: [successorId] },
    unit_definitions: basis.members.map((m) => ({ kind: 'CC', id: m.claim_id, projection: m.claim_projection as never })) };
  const successor = addFixtureNormalization(f.semantic, { number: successorNumber, lineage,
    origins: proposal.member_semantic_refs.flatMap((m) => m.unit_refs), packets: proposal.provenance_union.packet_ids,
    anchors: f.semantic.entry.anchors,
    proposition: rejected ? 'The indicator lit.' : proposal.successor_request!.proposed_claim,
    outcome: rejected ? 'not-admitted' : 'admitted' });
  if (rejected) {
    successor.result.verdict = 'refuted';
    Object.assign(successor.result.field_reviews[0], { verdict: 'refuted', issue: 'unsupported-interpretation',
      explanation: 'Synthetic L2S challenge: the proposed expression omits the trial restriction.' });
    fixtureReview(successor, successor.result);
  }
  const map = [successorId, proposal.member_ids.join(', '), row.basis, proposal.provenance_union.source_ids.join(', '), 'restatement', 'active'];
  if (!rejected) writeFixtureFile(run, 'ledgers/merge-map.md', '# Duplicate / Merge Map\n\n'
    + fixtureTable(['canonical', 'absorbs', 'basis', 'provenance retained', 'corroboration', 'status'], [map]));
  const effect: DuplicateEffect = { format: DUPLICATE_EFFECT_FORMAT, effect_id: effectId, proposal_id: proposalId,
    subject_digest: materialHash(semanticJson(f.subject)), decision_id: decisionId, effect: rejected ? 'not-admitted' : 'canonicalized',
    reason: rejected ? 'successor-not-preserved' : 'reviewed-duplicate', semantic_ids: [semanticId], lineage_id: rejected ? null : lineageId,
    successor_id: rejected ? null : successorId, merge_row_digest: rejected ? null : materialHash(semanticJson(map)),
    provenance_union_digest: materialHash(semanticJson(proposal.provenance_union)), predecessor_proposal_id: options.predecessor || null };
  const path = duplicatePath('effects', effect.effect_id), bytes = semanticJson(effect);
  writeFixtureFile(run, path, bytes);
  f.ledger.effects.push({ effect_id: effect.effect_id, proposal_id: effect.proposal_id, decision_id: decisionId, effect: effect.effect,
    semantic_id: rejected ? 'none' : semanticId, lineage_id: effect.lineage_id || 'none', successor_id: effect.successor_id || 'none',
    record_ref: `${path}@${materialHash(bytes)}` });
  duplicateFixtureWrite(f);
  if (!rejected) duplicateFixtureDiscovery(f, [], String(Number(f.discovery.discovery_id.slice(4)) + 1).padStart(4, '0'));
  return f;
}

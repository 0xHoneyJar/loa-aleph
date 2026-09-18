#!/usr/bin/env node
// C-05 conflict discriminator. No widening policy is implemented here.
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import { parseTables } from '../../../scripts/lib/markdown.ts';
import { mdLineSpan } from '../../../scripts/lib/check-helpers.ts';
import { framedExactEvidenceHash } from '../../../scripts/lib/checks-k2.ts';
import {
  makeFragmentSemanticFixture, sealFixtureSemanticStage, writeFixtureFile, fixtureSemantics,
  fixtureTable, MANUAL_REVIEWER, TEXT_USE,
} from '../../../scripts/semantic-fixture-support.ts';
import type { SemanticEntry, SemanticSubject } from '../../../scripts/lib/semantic-review.ts';
import type { MaterialRow } from '../../../scripts/lib/source-representation.ts';
const runtime = process.argv.includes('--runtime');
const sem = await import(runtime ? '../../../runtime-js/scripts/lib/semantic-review.js' : '../../../scripts/lib/semantic-review.ts') as typeof import('../../../scripts/lib/semantic-review.ts');
const rep = await import(runtime ? '../../../runtime-js/scripts/lib/source-representation.js' : '../../../scripts/lib/source-representation.ts') as typeof import('../../../scripts/lib/source-representation.ts');
const scratch = mkdtempSync(join(tmpdir(), 'f03-c05-widening-'));
const evidence: Array<Record<string, unknown>> = [];
let assertions = 0;
function check(condition: unknown, message: string): asserts condition {
  assert(condition, message); assertions++;
}
function refusal(name: string, pattern: RegExp, action: () => void): string {
  let message = '';
  try { action(); } catch (error) { message = String(error); }
  check(pattern.test(message), `${name}: ${message || 'unexpected success'}`);
  return message;
}
function append(run: string, path: string, header: string, cells: string[]): void {
  const text = readFileSync(join(run, path), 'utf8'), tables = parseTables(text);
  const table = tables.find((table) => table.header[0] === header)!;
  assert(table && table.header.length === cells.length);
  const lines = text.split('\n');
  lines.splice(table.line + table.rows.length + 1, 0, fixtureTable(table.header, [cells]).trimEnd().split('\n')[2]);
  writeFixtureFile(run, path, lines.join('\n'));
}
for (const version of ['1.8.0-provisional', '1.9.0-provisional']) {
  const run = join(scratch, version), f = makeFragmentSemanticFixture(run, undefined, undefined, version);
  sealFixtureSemanticStage(f, 'S2');
  writeFixtureFile(run, 'run-log.md', readFileSync(join(run, 'run-log.md'), 'utf8')
    + '\n## 2026-09-18 12:00 UTC — S3 — entry\n\nSynthetic conflict discriminator, no real worker execution.\n');
  const model = loadRun(run), before = readFileSync(join(run, sem.SEMANTIC_PATH));
  const seal = readFileSync(join(run, 'verification/harness/semantic-stage-seals/S2.json'));
  check(sem.validateSemanticRun(model).pending.length === 0, 'S2 sealed control must validate');
  const middle = mdLineSpan(join(run, 'corpus/sources/semantic.txt'), 2, 2)!;
  const wide = mdLineSpan(join(run, 'corpus/sources/semantic.txt'), 1, 2)!;
  check(middle.bytes && wide.bytes, 'both requested frozen loci must reopen exactly');
  const inspection = { anchor_id: 'A2', source_id: 'SRC-701', locator: 'L2-L2',
    start_byte: middle.startByte!, end_byte: middle.endByte!, exact_bytes_base64: middle.bytes.toString('base64') };
  const view = sem.semanticProducerView(model, 'normalizer', 'S3', sem.semanticProducerSelections(model, 'normalizer', 'S3', {
    origin_semantic_ids: ['SEM-0701'], inspection_anchors: [inspection],
  }));
  const semantics = fixtureSemantics('The counter rose.');
  semantics.contexts.push({ context_id: 'C1', kind: 'necessary-local', applies_to_unit_ids: ['U1'],
    anchor_ids: ['A2'], material_requirement_indexes: [], use: 'required-for-interpretation' });
  const entry: SemanticEntry = { output_kind: 'claim-candidate', output_index: 0, review_mode: 'proposal',
    origin_unit_refs: ['SEM-0701/U1'], anchors: [f.entry.anchors[0], inspection], semantics };
  const returned = { claims: [{ normalized_claim: 'The counter rose.', packets: ['PKT-0701'], claim_type: 'factual',
    widen_requests: [{ packet: 'PKT-0701', new_locator: 'L1-L2' }], rationale: 'Synthetic declared need for retained surrounding context.',
    flags: [], material_use: TEXT_USE }], no_claim_packets: [], lineage_proposals: [], material_findings: [], semantic_units: [entry] };
  const checked = sem.validateSemanticReturn('normalizer', version, returned, view.context);
  check(checked.result === 'PASS' && checked.binding === 'checked', checked.errors.join('; '));
  const raw = Buffer.from(sem.semanticJson(returned));
  writeFixtureFile(run, 'verification/harness/c05/normalizer.raw.json', raw);
  check(!f.subject.packet_basis.some((packet) => packet.fragments.some((fragment) => fragment.locator === 'L2-L2')),
    'requested context must be outside existing packet provenance');
  const output: SemanticSubject['output_binding'] = { kind: 'claim', reserved_claim_id: 'CC-0701',
    normalized_claim: 'The counter rose.', packet_ids: ['PKT-0701'], source_ids: ['SRC-701'], claim_type: 'factual' };
  const proposed = sem.claimProposalModel(model, output), context = rep.readRepresentationContext(model);
  const use: MaterialRow = { use_id: 'USE-0703', owner_stage: 'S3', subject_kind: 'CC', subject_id: 'CC-0701',
    basis_packet_ids: '["PKT-0701"]', requirements: sem.semanticJson(TEXT_USE.requirements), use_state: 'usable',
    fidelity_claim: 'none', limitation_refs: '[]', reason: 'none', established_by: 'manual-c05',
    review_subject_digest: '', reviewed_by: 'none' };
  use.review_subject_digest = rep.representationUseDigest(proposed, context, use);
  const subject = sem.buildSemanticSubject(proposed, { semantic_id: 'SEM-0702', owner_stage: 'S3', subject_kind: 'claim',
    review_mode: 'proposal', predecessor_semantic_id: 'none',
    producer_binding_hash: sem.semanticProducerBinding({ call_id: 'manual-c05', context_id: 'manual-c05-producer',
      raw_return_hash: rep.materialHash(raw), output_kind: 'claim-candidate', output_index: 0 }),
    reviewer_profile: MANUAL_REVIEWER, output_binding: output, origin_unit_refs: entry.origin_unit_refs,
    origin_context: [sem.semanticOriginProjection(f.subject)], anchors: entry.anchors, semantics, material_use: TEXT_USE,
    material_views: sem.semanticMaterialViews(proposed, [use]), lineage_context: [], relation_context: [], ambiguity_context: [] });
  check(sem.semanticAdmissionProblems(subject).includes('required textual content is unpacketed'),
    'inspection cannot license affirmative claim admission');
  const extractorAtS3 = refusal('S3 extractor', /SEM_WINDOW.*legal semantic producer stage/u, () => {
    sem.semanticProducerSelections(model, 'extractor', 'S3', { source_id: 'SRC-701' });
  });
  const reopenS2 = refusal('sealed S2 packet L2S', /SEM_WINDOW.*already sealed/u, () => sem.assertSemanticWindow(model, 'S2'));
  const extra = structuredClone(returned) as Record<string, unknown>;
  extra.packets = (f.returned.packets as unknown[]);
  const illegalNormalizer = sem.validateSemanticReturn('normalizer', version, extra, view.context);
  check(illegalNormalizer.result === 'FAIL', 'normalizer cannot invent a packet output family');
  const retagged = sem.validateSemanticReturn('normalizer', version, f.returned);
  check(retagged.result === 'FAIL', 'extractor bytes cannot be recast as normalizer bytes');

  // Disposable diagnostic after-image: mechanically add the exact requested
  // packet and replacement lineage, without inventing a semantic declaration.
  const after = join(scratch, `${version}-exact-packet`); cpSync(run, after, { recursive: true });
  append(after, 'ledgers/packet-index.md', 'packet_id', ['PKT-0703', 'SRC-701', 'L1-L2',
    rep.materialHash(wide.bytes), wide.bytes.toString('utf8').trimEnd(), '1', 'active']);
  append(after, 'ledgers/packet-index.md', 'evidence_key', ['EVID-0702', 'PKT-0703', 'exact', '1',
    'single-fragment', `sha256:${framedExactEvidenceHash([wide.bytes])}`, 'none', 'none', 'none']);
  append(after, 'ledgers/packet-index.md', 'fragment_key', ['FRAG-0703', 'EVID-0702', 'PKT-0703', '1', 'SRC-701',
    'L1-L2', 'frozen-source', 'exact-source-bytes', rep.materialHash(wide.bytes), wide.bytes.toString('base64')]);
  append(after, 'ledgers/lineage.md', 'lineage_id', ['LIN-0701', 'S3', 'replace', 'PKT-0701', 'PKT-0703',
    'Synthetic diagnostic replacement only.', 'manual-c05']);
  const expanded = loadRun(after), expandedContext = rep.readRepresentationContext(expanded);
  const packetUse: MaterialRow = { ...context.uses[0], use_id: 'USE-0703', subject_id: 'PKT-0703',
    basis_packet_ids: '["PKT-0703"]', review_subject_digest: '' };
  packetUse.review_subject_digest = rep.representationUseDigest(expanded, expandedContext, packetUse);
  rep.validateRepresentationUse(expanded, expandedContext, packetUse);
  assertions++;
  const s3Use = refusal('S3 PKT receipt', /USE_CLOSURE.*owner_stage.*illegal write stage/u, () =>
    rep.validateRepresentationUse(expanded, expandedContext, { ...packetUse, owner_stage: 'S3' }));
  writeFixtureFile(after, 'ledgers/representation-uses.md', rep.representationUsesMarkdown([...context.uses, packetUse]));
  const missingGroup = refusal('replacement lineage alone', /SEM_ACCOUNTING PKT-0703.*no semantic group/u, () =>
    sem.validateSemanticRun(loadRun(after)));
  check(readFileSync(join(after, 'verification/harness/semantic-stage-seals/S2.json')).equals(seal), 'diagnostic preserves S2 seal');
  check(readFileSync(join(run, sem.SEMANTIC_PATH)).equals(before)
    && readFileSync(join(run, 'verification/harness/c05/normalizer.raw.json')).equals(raw), 'original ledger and raw declaration unchanged');
  evidence.push({ version, normalizer_validation: checked, original_selector: 'claim-candidate:0',
    widening_request: returned.claims[0].widen_requests[0], raw_digest: rep.materialHash(raw),
    requested_exact_bytes_base64: wide.bytes.toString('base64'), admission_problems: sem.semanticAdmissionProblems(subject),
    extractor_at_s3: extractorAtS3, reopen_s2: reopenS2, normalizer_packet_family: illegalNormalizer.errors,
    retagged_extractor_return: retagged.errors, s3_packet_use: s3Use, replacement_without_group: missingGroup,
    original_s2_seal_digest: rep.materialHash(seal), canonical_claim_count: model.claims.length });
}
console.log(JSON.stringify({ result: 'EXPECTED_CONTRACT_CONFLICT', conflict: 'C-05',
  runtime, assertions, simulation: 'static synthetic fixtures only', scratch, evidence }, null, 2));

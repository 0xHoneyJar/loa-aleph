#!/usr/bin/env node
// C-04 discriminator, not an implementation acceptance test. The producer
// stopped before choosing a policy for an indeterminate claim selector.
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  makeSemanticFixture, sealFixtureSemanticStage, writeFixtureFile, MANUAL_REVIEWER, TEXT_USE, fixtureSemantics,
} from '../../../scripts/semantic-fixture-support.ts';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import type { SemanticEntry, SemanticSubject } from '../../../scripts/lib/semantic-review.ts';
import type { MaterialUseInput, MaterialRow } from '../../../scripts/lib/source-representation.ts';
const runtime = process.argv.includes('--runtime');
const semantic = await import(runtime ? '../../../runtime-js/scripts/lib/semantic-review.js' : '../../../scripts/lib/semantic-review.ts') as typeof import('../../../scripts/lib/semantic-review.ts');
const material = await import(runtime ? '../../../runtime-js/scripts/lib/source-representation.js' : '../../../scripts/lib/source-representation.ts') as typeof import('../../../scripts/lib/source-representation.ts');
const scratch = mkdtempSync(join(tmpdir(), 'f03-c04-claim-contract-'));
let checks = 0;
const evidence: Array<Record<string, unknown>> = [];
function check(name: string, action: () => void): void {
  action(); checks++; console.log(`PASS C04 discriminator ${name}`);
}
for (const version of ['1.8.0-provisional', '1.9.0-provisional']) {
  const run = join(scratch, version);
  const f = makeSemanticFixture(run, 'The synthetic flattened rendering is incomplete.', undefined, undefined, version);
  sealFixtureSemanticStage(f, 'S2');
  writeFixtureFile(run, 'run-log.md', readFileSync(join(run, 'run-log.md'), 'utf8')
    + '\n## 2026-09-17 12:00 UTC — S3 — entry\n\nSynthetic discriminator only.\n');
  const model = loadRun(run), context = material.readRepresentationContext(model);
  const view = semantic.semanticProducerView(model, 'normalizer', 'S3',
    semantic.semanticProducerSelections(model, 'normalizer', 'S3', { origin_semantic_ids: ['SEM-0701'] }));
  for (const variant of ['usable-control', 'indeterminate-one-OBJ', 'indeterminate-two-OBJ']) {
    const indeterminate = variant !== 'usable-control';
    const use: MaterialUseInput = indeterminate ? {
      requirements: [
        { object_id: 'OBJ-0002', feature: 'formal-structure', binding_ids: [] },
        ...variant === 'indeterminate-two-OBJ' ? [{ object_id: 'OBJ-0001', feature: 'table-grid' as const, binding_ids: [] }] : [],
      ],
      use_state: 'CANNOT_DETERMINE', fidelity_claim: 'none', limitation_refs: ['OBJ-0002'],
      reason: 'The frozen text has no supplied formal structure.',
    } : structuredClone(TEXT_USE);
    const entry: SemanticEntry = { output_kind: 'claim-candidate', output_index: 0, review_mode: 'proposal',
      origin_unit_refs: ['SEM-0701/U1'], anchors: f.entry.anchors, semantics: indeterminate ? {
        atomicity: 'CANNOT_DETERMINE', units: [], contexts: [], couplings: [], relation_proposals: [],
        unresolved_findings: [{ finding_id: 'F1', field_path: '/semantics/atomicity', code: 'material-unavailable',
          anchor_ids: ['A1'], material_requirement_indexes: use.requirements.map((_, index) => index), unknown_dimension: 'none',
          missing: use.reason, requested_context: [] }],
      } : fixtureSemantics(f.source.toString()) };
    const returned = { claims: [{ normalized_claim: indeterminate
      ? 'Tentative candidate withheld because formal structure is unavailable.' : entry.semantics.units[0].proposition,
      packets: ['PKT-0701'], claim_type: 'factual', widen_requests: [], rationale: indeterminate ? use.reason : 'Synthetic control.',
      flags: [], material_use: use }], no_claim_packets: [], lineage_proposals: [], material_findings: [], semantic_units: [entry] };
    const raw = Buffer.from(semantic.semanticJson(returned));
    writeFixtureFile(run, `diagnostic-${variant}.raw.json`, raw);
    const label = `${version}/${variant}`;
    check(`${label}: declaration passes existing material validation`, () => {
      assert.deepEqual(material.validateMaterialUseInput(use), use);
      material.validateMaterialProducerReturn(returned);
    });
    const checked = semantic.validateSemanticReturn('normalizer', version, returned, view.context);
    check(`${label}: context-bound original claim selector passes`, () => {
      assert.equal(checked.result, 'PASS', checked.errors.join('; ')); assert.equal(checked.binding, 'checked');
      assert.equal(entry.output_kind, 'claim-candidate'); assert.equal(returned.material_findings.length, 0);
    });
    const output: SemanticSubject['output_binding'] = { kind: 'claim', reserved_claim_id: 'CC-0702',
      normalized_claim: returned.claims[0].normalized_claim, packet_ids: ['PKT-0701'], source_ids: ['SRC-701'], claim_type: 'factual' };
    const projected = semantic.canonicalClaimModel(model, output);
    const row: MaterialRow = { use_id: 'USE-0702', owner_stage: 'S3', subject_kind: 'CC', subject_id: 'CC-0702',
      basis_packet_ids: semantic.semanticJson(['PKT-0701']), requirements: semantic.semanticJson(use.requirements), use_state: use.use_state,
      fidelity_claim: use.fidelity_claim, limitation_refs: semantic.semanticJson(use.limitation_refs), reason: use.reason,
      established_by: 'synthetic-discriminator-producer', review_subject_digest: '', reviewed_by: 'none' };
    row.review_subject_digest = material.representationUseDigest(projected, context, row);
    const input = { semantic_id: 'SEM-0702', owner_stage: 'S3' as const, subject_kind: 'claim' as const,
      review_mode: entry.review_mode, predecessor_semantic_id: 'none', producer_binding_hash: semantic.semanticProducerBinding({
        call_id: 'synthetic-discriminator-producer', context_id: 'synthetic-context', raw_return_hash: material.materialHash(raw),
        output_kind: 'claim-candidate', output_index: 0 }), reviewer_profile: MANUAL_REVIEWER, output_binding: output,
      origin_unit_refs: entry.origin_unit_refs, origin_context: [semantic.semanticOriginProjection(f.subject)], anchors: entry.anchors,
      semantics: entry.semantics, material_use: use, lineage_context: [], relation_context: [], ambiguity_context: [] };
    let error: string | null = null;
    check(`${label}: ${indeterminate ? 'required retained material view refuses' : 'usable claim subject control passes'}`, () => {
      if (indeterminate) assert.throws(() => semantic.semanticMaterialViews(projected, [row]), (caught: unknown) => {
        error = (caught as Error).message;
        return error === 'USE_CLOSURE USE-0702 field use_state: CANNOT_DETERMINE candidates require OBJ receipts, not canonical packets/claims/relations';
      });
      else semantic.buildSemanticSubject(projected, { ...input, material_views: semantic.semanticMaterialViews(projected, [row]) });
    });
    if (indeterminate) check(`${label}: dropping the material view also refuses`, () => {
      assert.throws(() => semantic.buildSemanticSubject(projected, { ...input, material_views: [] }),
        /SEM_SUBJECT.*exact applicable material views required/u);
    });
    check(`${label}: raw selector and canonical state unchanged`, () => {
      assert(raw.equals(Buffer.from(semantic.semanticJson(returned))));
      assert(raw.equals(readFileSync(join(run, `diagnostic-${variant}.raw.json`))));
      assert.equal(loadRun(run).claims.length, 0);
      assert(!readFileSync(join(run, 'ledgers/semantic-review.md'), 'utf8').includes('SEM-0702'));
    });
    evidence.push({ version, variant, raw_digest: material.materialHash(raw), selector: 'claim-candidate:0',
      material_requirements: use.requirements, return_validation: checked.result, return_binding: checked.binding,
      retained_material_view_error: error, canonical_claims_created: 0, classification: indeterminate ? 'EXPECTED_CONTRACT_CONFLICT' : 'CONTROL_PASS' });
  }
}
console.log(JSON.stringify({ format: 'f03-c04-contract-discriminator/v1', runtime, checks, scratch, evidence,
  scope: 'synthetic Core contract discriminator only; no native worker, production-path proof, semantic validation or finding closure' }, null, 2));

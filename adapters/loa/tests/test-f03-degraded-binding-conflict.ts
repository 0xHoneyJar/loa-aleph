import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { makeSemanticFixture, addFixtureMaterialFinding, fixtureReview, fixtureResult, sealFixtureSemanticStage,
  writeFixtureFile, MANUAL_REVIEWER, type SemanticFixture } from '../../../scripts/semantic-fixture-support.ts';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import { materialHash, type MaterialUseInput } from '../../../scripts/lib/source-representation.ts';
import { validateSemanticReturn, validateSemanticRun, semanticJson, semanticProducerBinding, semanticSubjectPath,
  semanticLedgerMarkdown, SEMANTIC_PATH, degradedPacketBinding, semanticDegradedMaterialViews,
  semanticContextManifest, type SemanticSubject } from '../../../scripts/lib/semantic-review.ts';
import { deriveS2DegradedSubject } from '../../../scripts/lib/work-transitions.ts';
import type { WorkerJsonValue } from '../../../scripts/lib/worker-return-contract.ts';

// At 5e17212 this file reproduced C-01. The unchanged historical reproduction
// remains in calibration/src-001/core-design-basis/f03-degraded-candidate-binding-conflict-20260917.json.
// This successor tests the HUMAN clarification. Synthetic Core records only;
// it does not exercise native transport, production reachability or judgment.
const root = mkdtempSync(join(tmpdir(), 'f03-degraded-core-'));
const results: Array<{ name: string; result: 'PASS' | 'FAIL'; error?: string }> = [];
let ordinal = 0;
function test(name: string, action: () => void): void {
  try { action(); results.push({ name, result: 'PASS' }); }
  catch (error) { results.push({ name, result: 'FAIL', error: String(error) }); }
}
const rawPath = 'verification/harness/semantic-process/manual-degraded-0717.raw.json';
const producerPath = 'verification/harness/semantic-process/producer-0717.json';
function prepared(multiple = true, version = '1.9.0-provisional') {
  const f = makeSemanticFixture(join(root, String(++ordinal)), undefined, undefined, undefined, version);
  addFixtureMaterialFinding(f);
  const materialSubject = JSON.parse(readFileSync(join(f.run, semanticSubjectPath('SEM-0716')), 'utf8')) as SemanticSubject;
  const use = structuredClone(materialSubject.material_use)!;
  if (multiple) use.requirements.push({ object_id: 'OBJ-0001', feature: 'formal-structure', binding_ids: ['BND-0001'] });
  const semantics = structuredClone(materialSubject.semantics);
  semantics.unresolved_findings[0].material_requirement_indexes = use.requirements.map((_, i) => i);
  const returned = { ...f.returned, producer_invocation_id: 'manual-degraded-0717', walk_intervals: [], extraction_events: [],
    packets: [{ evidence_state: 'degraded-non-exact', join_policy: 'not-applicable', fragments: [],
      rendered_text: 'Synthetic unresolvable material.', degraded_source_locator: 'L1-L1',
      degradation_reason: 'Grouping cannot be determined.', criterion: 1, flags: [], material_use: use }],
    material_findings: [], semantic_units: [{ output_kind: 'packet-candidate', output_index: 0,
      review_mode: 'proposal', origin_unit_refs: [], anchors: [], semantics }] };
  const checked = validateSemanticReturn('extractor', version, returned, { model: loadRun(f.run), owner_stage: 'S2',
    legal_source_ids: ['SRC-701'], source_windows: [{ source_id: 'SRC-701', start_byte: 0, end_byte: f.source.length }],
    packet_ids: [], origin_unit_refs: [] });
  assert.equal(checked.result, 'PASS', checked.errors.join('; '));
  assert.equal(checked.binding, 'checked');
  return { f, returned, use };
}
function retain(f: SemanticFixture): void {
  const row = f.ledger.subjects.find((row) => row.semantic_id === f.subject.semantic_id)!;
  row.subject_digest = materialHash(semanticJson(f.subject)); row.subject_kind = f.subject.subject_kind;
  writeFixtureFile(f.run, semanticSubjectPath(f.subject.semantic_id), semanticJson(f.subject));
  f.assignment.subject_digest = row.subject_digest;
  f.assignment.producer_binding_hash = f.subject.producer_binding_hash;
  f.result = fixtureResult(f.subject);
  fixtureReview(f, f.result);
}
function fixture(multiple = true): SemanticFixture {
  const { f, returned } = prepared(multiple);
  const binding = degradedPacketBinding('1.9.0-provisional', returned, 0);
  const producer = { call_id: 'manual-degraded-0717', context_id: 'manual-degraded-pass-0717',
    raw_return_hash: materialHash(semanticJson(returned)), output_kind: 'packet-candidate', output_index: 0 };
  writeFixtureFile(f.run, rawPath, semanticJson(returned)); writeFixtureFile(f.run, producerPath, semanticJson(producer));
  const hash = semanticProducerBinding(producer), model = loadRun(f.run);
  const subject = deriveS2DegradedSubject(model, { call_id: producer.call_id, context_id: producer.context_id,
    role: 'extractor', producer_context_id: null, raw_digest: producer.raw_return_hash, receipt_digest: materialHash(semanticJson(producer)),
    simulation: true, value: returned as unknown as WorkerJsonValue }, 0, 'SEM-0717', MANUAL_REVIEWER);
  f.ledger.subjects.push({ semantic_id: subject.semantic_id, owner_stage: 'S2', subject_kind: subject.subject_kind,
    subject_path: semanticSubjectPath(subject.semantic_id), subject_digest: '', predecessor_semantic_id: 'none',
    producer_receipt_ref: `${producerPath}@${materialHash(semanticJson(producer))}` });
  f.ledger.resolutions.push({ resolution_id: 'SMR-0717', semantic_id: subject.semantic_id, outcome: 'not-admitted',
    review_ids: '[]', canonical_refs: '[]', origin_unit_refs: '[]', followup_semantic_ids: '[]' });
  const result: SemanticFixture = { ...f, subject, returned, producer, entry: binding.entry,
    assignment: { ...f.assignment, semantic_id: subject.semantic_id, review_id: 'VER-0717', invocation_id: 'manual-pass-VER-0717',
      producer_binding_hash: hash }, result: fixtureResult(subject) };
  retain(result);
  assert.equal(validateSemanticRun(loadRun(result.run)).subjects, 3);
  return result;
}
function fails(f: SemanticFixture, pattern: RegExp): void {
  assert.throws(() => validateSemanticRun(loadRun(f.run)), pattern);
}
function altered(name: string, mutate: (subject: SemanticSubject) => void, pattern = /SEM_(?:SUBJECT|REFERENCE|STATE|FORMAT|ENUM)/u): void {
  test(name, () => { const f = fixture(); mutate(f.subject); retain(f); fails(f, pattern); });
}
try {
  for (const multiple of [false, true]) test(`${multiple ? 'multiple' : 'single'} OBJ: dedicated subject and completed selector`, () => {
    const f = fixture(multiple);
    assert.equal(f.subject.subject_kind, 'degraded-packet');
    assert.equal(f.subject.material_use!.requirements.length, multiple ? 2 : 1);
    const before = readFileSync(join(f.run, rawPath));
    sealFixtureSemanticStage(f, 'S2');
    const checked = validateSemanticRun(loadRun(f.run));
    assert.deepEqual(checked.pending, []);
    assert.equal(f.ledger.subjects.filter((row) => row.subject_kind === 'degraded-packet').length, 1);
    assert.deepEqual(readFileSync(join(f.run, rawPath)), before);
  });
  test('complete ordered requirements and material declaration are retained', () => {
    const f = fixture();
    const candidate = (f.returned.packets as Array<{ material_use: MaterialUseInput }>)[0];
    assert.equal(semanticJson(f.subject.material_use), semanticJson(candidate.material_use));
    assert.deepEqual(f.subject.material_use!.requirements.map((r) => r.object_id), ['OBJ-0002', 'OBJ-0001']);
    const view = f.subject.material_views[0].use_subject as { material_use: unknown };
    assert.equal(semanticJson(view.material_use), semanticJson(candidate.material_use));
    assert(f.subject.context_manifest.some((entry) => entry.purpose === 'material-context'));
  });
  for (const field of ['source_id', 'degraded_source_locator', 'degradation_reason', 'criterion'] as const) {
    altered(`changed ${field} refused`, (s) => {
      assert.equal(s.output_binding.kind, 'degraded-packet');
      const output = s.output_binding as Extract<SemanticSubject['output_binding'], { kind: 'degraded-packet' }>;
      if (field === 'criterion') output.criterion = 2; else output[field] = field === 'source_id' ? 'SRC-999' : 'changed';
    }, /SEM_(?:SUBJECT|REFERENCE)|REP_/u);
  }
  for (const [name, mutation] of [
    ['missing requirement', (use: MaterialUseInput) => { use.requirements.pop(); }],
    ['reordered requirements', (use: MaterialUseInput) => { use.requirements.reverse(); }],
    ['first OBJ only', (use: MaterialUseInput) => { use.requirements = use.requirements.slice(0, 1); }],
    ['changed reason', (use: MaterialUseInput) => { use.reason = 'different limitation'; }],
    ['dropped limitation', (use: MaterialUseInput) => { use.limitation_refs = []; }],
  ] as const) altered(`${name} refused`, (s) => mutation(s.material_use!), /SEM_|STATE ledgers\/representation-uses.md field reason/u);
  test('recomputed material view cannot authorize changed producer requirement order', () => {
    const f = fixture(), before = readFileSync(join(f.run, rawPath));
    f.subject.material_use!.requirements.reverse();
    f.subject.material_views = semanticDegradedMaterialViews(loadRun(f.run),
      f.subject.output_binding as Extract<SemanticSubject['output_binding'], { kind: 'degraded-packet' }>,
      f.subject.producer_binding_hash, f.subject.material_use!);
    f.subject.context_manifest = semanticContextManifest(loadRun(f.run), f.subject);
    retain(f); fails(f, /SEM_SUBJECT material_use: selected producer declaration differs/u);
    assert.deepEqual(readFileSync(join(f.run, rawPath)), before);
  });
  altered('degraded packet cannot bind as material-only', (s) => {
    s.subject_kind = 'material-only'; s.output_binding = { kind: 'material-only', object_id: 'OBJ-0002' };
  }, /SEM_|REPRESENTATION_/u);
  altered('degraded packet cannot bind as packet-group', (s) => {
    s.subject_kind = 'packet-group'; s.output_binding = { kind: 'packet-group', evidence_keys: ['EVID-9999'], packet_ids: ['PKT-9999'] };
  });
  altered('fictitious PKT insertion refused', (s) => { (s.output_binding as unknown as Record<string, unknown>).packet_ids = ['PKT-9999']; });
  altered('fictitious CC insertion refused', (s) => { (s.output_binding as unknown as Record<string, unknown>).reserved_claim_id = 'CC-9999'; });
  altered('fictitious exact packet basis refused', (s) => { s.packet_basis.push({} as SemanticSubject['packet_basis'][number]); });
  altered('affirmative proposition refused', (s) => { s.semantics.atomicity = 'single-assertion'; });
  test('duplicate subject for original selector refused', () => {
    const f = fixture(); const duplicate = structuredClone(f.subject); duplicate.semantic_id = 'SEM-0718';
    writeFixtureFile(f.run, semanticSubjectPath(duplicate.semantic_id), semanticJson(duplicate));
    f.ledger.subjects.push({ ...f.ledger.subjects.at(-1)!, semantic_id: duplicate.semantic_id,
      subject_path: semanticSubjectPath(duplicate.semantic_id), subject_digest: materialHash(semanticJson(duplicate)) });
    writeFixtureFile(f.run, SEMANTIC_PATH, semanticLedgerMarkdown(f.ledger));
    fails(f, /SEM_ACCOUNTING .*duplicate semantic subject/u);
  });
  test('material finding cannot discharge absent degraded selector', () => {
    const f = fixture();
    for (const key of ['subjects', 'assignments', 'results', 'resolutions'] as const) {
      for (const row of f.ledger[key].filter((row) => row.semantic_id === 'SEM-0717')) {
        for (const path of [row.subject_path, row.assignment_path, row.result_path]) if (path) rmSync(join(f.run, path));
      }
      f.ledger[key] = f.ledger[key].filter((row) => row.semantic_id !== 'SEM-0717');
    }
    writeFixtureFile(f.run, SEMANTIC_PATH, semanticLedgerMarkdown(f.ledger));
    sealFixtureSemanticStage(f, 'S2');
    fails(f, /SEM_ACCOUNTING .*retained emitted producer candidate has no completed L2S review/u);
  });
  test('synthetic material selector cannot replace original packet selector', () => {
    const f = fixture(); f.producer.output_kind = 'material-candidate';
    writeFixtureFile(f.run, producerPath, semanticJson(f.producer));
    f.ledger.subjects.at(-1)!.producer_receipt_ref = `${producerPath}@${materialHash(semanticJson(f.producer))}`;
    f.subject.producer_binding_hash = semanticProducerBinding(f.producer);
    retain(f); fails(f, /SEM_SUBJECT/u);
  });
  test('no PKT, CC, exact fragment, claim or synthetic USE is created', () => {
    const f = fixture(); assert.deepEqual(f.subject.packet_basis, []); assert.deepEqual(f.subject.anchors, []);
    assert.deepEqual(f.subject.semantics.units, []);
    assert.equal(loadRun(f.run).packets.length, 1); assert.equal(loadRun(f.run).claims.length, 0);
    assert(!semanticJson(f.subject.output_binding).includes('PKT-')); assert(!semanticJson(f.subject.output_binding).includes('CC-'));
    assert(!readFileSync(join(f.run, 'ledgers/representation-uses.md'), 'utf8').includes('USE-0717'));
  });
  test('actual material-candidate remains singular material-only', () => {
    const f = fixture(); const original = JSON.parse(readFileSync(join(f.run, semanticSubjectPath('SEM-0716')), 'utf8'));
    assert.deepEqual(original.output_binding, { kind: 'material-only', object_id: 'OBJ-0002' });
    assert.equal(validateSemanticRun(loadRun(f.run)).subjects, 3);
  });
  for (const version of ['1.7.0-provisional', '1.8.0-provisional']) test(`${version} retains predecessor behavior and refuses new variant`, () => {
    const { f, returned } = prepared(true, version);
    assert.equal(validateSemanticRun(loadRun(f.run)).subjects, 2);
    assert.throws(() => degradedPacketBinding(version, returned, 0), /SEM_COMPATIBILITY/u);
    const newSubject = fixture().subject; newSubject.run_binding.run_format_version = version;
    writeFixtureFile(f.run, semanticSubjectPath('SEM-0717'), semanticJson(newSubject));
    f.ledger.subjects.push({ ...f.ledger.subjects[1], semantic_id: 'SEM-0717', subject_kind: 'degraded-packet',
      subject_path: semanticSubjectPath('SEM-0717'), subject_digest: materialHash(semanticJson(newSubject)) });
    writeFixtureFile(f.run, SEMANTIC_PATH, semanticLedgerMarkdown(f.ledger));
    fails(f, /SEM_COMPATIBILITY degraded-packet/u);
  });
  test('fresh process runtime projection validates the same retained subject', () => {
    const f = fixture();
    const script = `
      import {loadRun} from './runtime-js/scripts/lib/run-model.js';
      import {validateSemanticRun} from './runtime-js/scripts/lib/semantic-review.js';
      console.log(JSON.stringify(validateSemanticRun(loadRun(process.argv[1]))));
    `;
    const child = spawnSync(process.execPath, ['--input-type=module', '-e', script, f.run], { encoding: 'utf8' });
    assert.equal(child.status, 0, child.stderr);
    assert.deepEqual(JSON.parse(child.stdout), validateSemanticRun(loadRun(f.run)));
  });
  console.log(JSON.stringify({ evidence_kind: 'synthetic Core clarification regression; no native/live/semantic validation',
    passed: results.filter((r) => r.result === 'PASS').length, total: results.length, results }, null, 2));
  if (results.some((r) => r.result === 'FAIL')) process.exitCode = 1;
} finally { rmSync(root, { recursive: true, force: true }); }

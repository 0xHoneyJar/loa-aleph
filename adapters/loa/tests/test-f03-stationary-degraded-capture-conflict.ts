#!/usr/bin/env node
// C-07 historical discriminator. A passing test reproduces the implementation
// stop; it does not adopt a stationary-cursor or candidate-disposition policy.
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { makeSemanticFixture, writeFixtureFile } from '../../../scripts/semantic-fixture-support.ts';
import { parseTables } from '../../../scripts/lib/markdown.ts';
import type { WorkValue } from '../../../scripts/lib/work-transitions.ts';
const runtime = process.argv.includes('--runtime');
const core = await import(runtime ? '../../../runtime-js/scripts/lib/work-transitions.js' : '../../../scripts/lib/work-transitions.ts') as typeof import('../../../scripts/lib/work-transitions.ts');
const sem = await import(runtime ? '../../../runtime-js/scripts/lib/semantic-review.js' : '../../../scripts/lib/semantic-review.ts') as typeof import('../../../scripts/lib/semantic-review.ts');
const rep = await import(runtime ? '../../../runtime-js/scripts/lib/source-representation.js' : '../../../scripts/lib/source-representation.ts') as typeof import('../../../scripts/lib/source-representation.ts');
const walk = await import(runtime ? '../../../runtime-js/scripts/lib/source-walk-transition.js' : '../../../scripts/lib/source-walk-transition.ts') as typeof import('../../../scripts/lib/source-walk-transition.ts');
const { loadRun } = await import(runtime ? '../../../runtime-js/scripts/lib/run-model.js' : '../../../scripts/lib/run-model.ts') as typeof import('../../../scripts/lib/run-model.ts');
const { runK2 } = await import(runtime ? '../../../runtime-js/scripts/lib/checks-k2.js' : '../../../scripts/lib/checks-k2.ts') as typeof import('../../../scripts/lib/checks-k2.ts');
const { ResultCollector } = await import(runtime ? '../../../runtime-js/scripts/lib/results.js' : '../../../scripts/lib/results.ts') as typeof import('../../../scripts/lib/results.ts');
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const scratch = mkdtempSync(join(tmpdir(), 'f03-c07-stationary-'));
const fixture = makeSemanticFixture(join(scratch, 'run'), undefined, undefined, undefined, '1.9.0-provisional');
const run = fixture.run;
function clearRows(path: string): void {
  const text = readFileSync(join(run, path), 'utf8');
  const data = new Set(parseTables(text).flatMap((table) => table.rows.map((row) => row.line)));
  writeFixtureFile(run, path, text.split('\n').filter((_, index) => !data.has(index + 1)).join('\n'));
}
clearRows('ledgers/packet-index.md');
clearRows('ledgers/source-walk.md');
writeFixtureFile(run, sem.SEMANTIC_PATH, sem.semanticLedgerMarkdown(sem.emptySemanticLedger()));
writeFixtureFile(run, rep.REPRESENTATION_USE_PATH, rep.representationUsesMarkdown([]));
const source = loadRun(run).corpus.sources[0].values;
let bytes = core.appendRows(readFileSync(join(run, 'ledgers/source-walk.md')), 'cursor_id',
  [['CUR-0001', source.sourceId, '0', 'none', 'none', 'none', 'none', source.contentHash, 'initial']]);
bytes = core.appendRows(bytes, 'source_id', [[source.sourceId, source.contentHash, String(fixture.source.length),
  'CUR-0001', 'none', 'blocked', 'orchestrator', 'Synthetic initial source frontier.']]);
writeFixtureFile(run, 'ledgers/source-walk.md', bytes);
const cases: Array<{ name: string; kind: 'control' | 'adversarial'; result: 'PASS' }> = [];
function test(name: string, action: () => void, kind: 'control' | 'adversarial' = 'control'): void {
  action(); cases.push({ name, kind, result: 'PASS' });
}
function k214(model: ReturnType<typeof loadRun>) {
  const results = new ResultCollector('C07 synthetic stationary degraded capture');
  runK2(results, model, ROOT);
  return results.report().checks.filter((check) => check.id === 'K2.14');
}
const before = loadRun(run), baseline = k214(before);
test('initial frozen source and stationary blocked frontier pass K2.14', () => {
  assert(baseline.length > 0); assert(baseline.every((check) => check.status === 'PASS'));
});
test('manifest hash equals exact frozen source bytes', () => {
  assert.equal(source.contentHash, rep.materialHash(readFileSync(join(run, 'corpus/sources/semantic.txt'))));
});
const execution = { stage: 'S2', stage_status: 'entered', core_state: 'DISTILLING', blocked: false };
const prepare = core.selectNextWork(before, execution);
assert(prepare.kind === 'local');
test('Core selects the ordinary S2 preparation', () => {
  assert.equal(prepare.obligation.operation, 's2.prepare-extractor');
});
const prepared = core.deriveWorkTransition(before, execution, prepare, null, '2026-09-26T12:00:00Z');
for (const effect of prepared.effects) writeFixtureFile(run, effect.path, Buffer.from(effect.after_base64, 'base64'));
const model = loadRun(run), selected = core.selectNextWork(model, execution);
assert(selected.kind === 'worker');
test('Core selects ordinary S2 capture at the same initial cursor', () => {
  assert.equal(selected.obligation.operation, 's2.capture');
  assert.equal(model.sourceWalk.cursors.at(-1)!.values.byteOffset, '0');
});
const call = selected.call.prepared_call_id!;
const materialUse = { requirements: [{ object_id: 'OBJ-0002', feature: 'formal-structure', binding_ids: ['BND-0001'] }],
  use_state: 'CANNOT_DETERMINE', fidelity_claim: 'none', limitation_refs: ['OBJ-0002'],
  reason: 'Synthetic grouping unavailable.' };
const value = { source_id: source.sourceId, producer_invocation_id: call,
  walk_intervals: [{ start_byte: 0, end_byte: fixture.source.length, outcome: 'unsupported',
    packet_candidate_indexes: [], criterion_ref: 'none', closure_state: 'open', reason: materialUse.reason, closure_note: null }],
  packets: [{ evidence_state: 'degraded-non-exact', join_policy: 'not-applicable', fragments: [],
    rendered_text: 'Synthetic unresolvable material.', degraded_source_locator: 'L1-L1',
    degradation_reason: materialUse.reason, criterion: 1, flags: [], material_use: materialUse }],
  extraction_events: [], next_cursor: { byte_offset: 0, shared_position_key: null, next_event_ordinal: null,
    predecessor_walk_index: null, predecessor_event_index: null, source_hash: source.contentHash, reason: 'bounded-pause' },
  walk_exhausted: false, notes: [], material_findings: [], semantic_units: [{ output_kind: 'packet-candidate', output_index: 0,
    review_mode: 'proposal', origin_unit_refs: [], anchors: [], semantics: { atomicity: 'CANNOT_DETERMINE', units: [],
      contexts: [], couplings: [], relation_proposals: [], unresolved_findings: [{ finding_id: 'F1',
        field_path: '/semantics/atomicity', code: 'material-unavailable', anchor_ids: [], material_requirement_indexes: [0],
        unknown_dimension: 'none', missing: materialUse.reason, requested_context: [] }] } }] };
const paths = sem.semanticProducerViewPaths(call);
const selections = JSON.parse(readFileSync(join(run, paths.selections), 'utf8'));
const validation = sem.validateSemanticReturn('extractor', '1.9.0-provisional', value,
  sem.semanticProducerView(model, 'extractor', 'S2', selections).context);
test('stationary degraded producer return passes contextual validation', () => {
  assert.equal(validation.result, 'PASS'); assert.equal(validation.binding, 'checked');
});
const binding = sem.degradedPacketBinding('1.9.0-provisional', value, 0);
test('C01 dedicated binding preserves the original packet-candidate selector', () => {
  assert.equal(binding.output_binding.kind, 'degraded-packet');
  assert.equal(binding.entry.output_kind, 'packet-candidate'); assert.equal(binding.entry.output_index, 0);
});
test('C01 binding preserves the complete ordered material declaration', () => {
  assert.deepEqual(binding.material_use, materialUse);
});
test('degraded candidate has no exact evidence or affirmative semantic units', () => {
  assert.deepEqual(value.packets[0].fragments, []); assert.deepEqual(binding.entry.anchors, []);
  assert.deepEqual(binding.entry.semantics.units, []); assert.equal(binding.entry.semantics.atomicity, 'CANNOT_DETERMINE');
});
const raw = sem.semanticJson(value), accepted: WorkValue = { call_id: call, role: 'extractor',
  context_id: 'fixture-degraded', producer_context_id: null, raw_digest: core.workDigest(raw),
  receipt_digest: `sha256:${'a'.repeat(64)}`, simulation: true, value };
const currentBytes = new Map(model.files.map((file) => [file.relativePath, readFileSync(join(run, file.relativePath))]));
test('Core rejects stationary capture with exact WORK_CURSOR error', () => {
  assert.throws(() => core.deriveWorkTransition(model, execution, selected, accepted, '2026-09-26T12:01:00Z'),
    /^Error: WORK_CURSOR: frozen source and actual forward progress required$/u);
});
test('repeated direct derivation reproduces the same refusal', () => {
  assert.throws(() => core.deriveWorkTransition(loadRun(run), execution, selected, accepted, '2026-09-26T12:02:00Z'),
    /^Error: WORK_CURSOR: frozen source and actual forward progress required$/u);
});
test('rejected derivation changes no retained run file', () => {
  for (const [path, original] of currentBytes) assert(readFileSync(join(run, path)).equals(original), path);
});
test('rejected derivation retains raw selector and material bytes exactly', () => {
  assert.equal(sem.semanticJson(value), raw); assert.equal(core.workDigest(raw), accepted.raw_digest);
});
test('no canonical PKT or CC or representation USE is created', () => {
  assert.equal(loadRun(run).packets.length, 0); assert.equal(loadRun(run).claims.length, 0);
  assert(readFileSync(join(run, rep.REPRESENTATION_USE_PATH)).equals(currentBytes.get(rep.REPRESENTATION_USE_PATH)!));
});
test('no semantic subject can be selected after the rejected capture', () => {
  const repeated = core.selectNextWork(loadRun(run), execution);
  assert(repeated.kind === 'worker');
  assert.equal(repeated.obligation.operation, 's2.capture');
  assert.deepEqual(sem.parseSemanticLedger(readFileSync(join(run, sem.SEMANTIC_PATH), 'utf8')), sem.emptySemanticLedger());
});
const history = core.appendRows(readFileSync(join(run, 'ledgers/source-walk.md')), 'walk_id',
  [['WLK-0001', source.sourceId, '0', String(fixture.source.length), 'unsupported', 'none', 'none', call,
    'open', materialUse.reason, 'none']]);
const stationaryHistory = walk.projectSourceWalk(model, history.toString());
const projection = walk.deriveSourceWalkCompletion(model, stationaryHistory);
test('unsupported history with original cursor remains structurally blocked', () => {
  assert(k214(stationaryHistory).every((check) => check.status === 'PASS'));
});
test('keeping original cursor yields exact blocked completion no-op', () => {
  assert.equal(projection.completions[0].progression, 'blocked-no-op');
  assert.equal(projection.completions[0].after_row, projection.completions[0].before_row);
});
test('cursor advancement past the unsupported interval remains rejected by K2.14', () => {
  const advanced = core.appendRows(history, 'cursor_id', [['CUR-0002', source.sourceId, String(fixture.source.length),
    'none', 'none', 'WLK-0001', 'none', source.contentHash, 'source-complete']]);
  assert(k214(walk.projectSourceWalk(model, advanced.toString())).some((check) =>
    check.status === 'FAIL' && check.message.includes('jumps over open interval WLK-0001')));
}, 'adversarial');
test('changed frozen source hash remains rejected at work derivation', () => {
  const changed = structuredClone(value); changed.next_cursor.source_hash = `sha256:${'b'.repeat(64)}`;
  assert.throws(() => core.deriveWorkTransition(model, execution, selected,
    { ...accepted, value: changed, raw_digest: core.workDigest(sem.semanticJson(changed)) }, '2026-09-26T12:03:00Z'),
  /WORK_CURSOR/u);
}, 'adversarial');
// Observation only: a helper accepting a new cursor ID does not constitute
// human adoption of that ID as "frontier advancement" under C-02.
const newCursor = core.appendRows(history, 'cursor_id', [['CUR-0002', source.sourceId, '0',
  'none', 'none', 'none', 'none', source.contentHash, 'bounded-pause']]);
const newCursorProjection = walk.deriveSourceWalkCompletion(model, walk.projectSourceWalk(model, newCursor.toString()));
const evidence = { conflict: 'C-07', result: 'REPRODUCED — NO POLICY ADOPTED', runtime, simulation: true, scratch,
  cases, totals: { cases: cases.length, adversarial: cases.filter((entry) => entry.kind === 'adversarial').length },
  source_hash: source.contentHash, raw_return_digest: accepted.raw_digest, validation, binding,
  refusal: 'WORK_CURSOR: frozen source and actual forward progress required', baseline_k214: baseline,
  unchanged_cursor_projection: projection.completions,
  new_cursor_helper_observation_not_authority: newCursorProjection.completions,
  provider_model_calls: 0, genuine_native_workers: 0 };
writeFileSync(join(scratch, 'raw-return.json'), raw);
writeFileSync(join(scratch, 'evidence.json'), JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify(evidence, null, 2));

#!/usr/bin/env node
// Synthetic Core transactions. Installed transport/recovery is a separate suite.
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { makeSemanticFixture, writeFixtureFile, fixtureResult, fixtureReview, type SemanticFixture } from '../../../scripts/semantic-fixture-support.ts';
import { parseTables } from '../../../scripts/lib/markdown.ts';
import type { WorkTransition, WorkValue, NextWork } from '../../../scripts/lib/work-transitions.ts';
import type { SemanticSubject, SemanticEntry, SemanticAssignment } from '../../../scripts/lib/semantic-review.ts';
const runtime = process.argv.includes('--runtime');
const core = await import(runtime ? '../../../runtime-js/scripts/lib/work-transitions.js' : '../../../scripts/lib/work-transitions.ts') as typeof import('../../../scripts/lib/work-transitions.ts');
const stationary = await import(runtime ? '../../../runtime-js/scripts/lib/stationary-capture.js' : '../../../scripts/lib/stationary-capture.ts') as typeof import('../../../scripts/lib/stationary-capture.ts');
const sem = await import(runtime ? '../../../runtime-js/scripts/lib/semantic-review.js' : '../../../scripts/lib/semantic-review.ts') as typeof import('../../../scripts/lib/semantic-review.ts');
const rep = await import(runtime ? '../../../runtime-js/scripts/lib/source-representation.js' : '../../../scripts/lib/source-representation.ts') as typeof import('../../../scripts/lib/source-representation.ts');
const k2 = await import(runtime ? '../../../runtime-js/scripts/lib/checks-k2.js' : '../../../scripts/lib/checks-k2.ts') as typeof import('../../../scripts/lib/checks-k2.ts');
const { ResultCollector } = await import(runtime ? '../../../runtime-js/scripts/lib/results.js' : '../../../scripts/lib/results.ts') as typeof import('../../../scripts/lib/results.ts');
const { loadRun } = await import(runtime ? '../../../runtime-js/scripts/lib/run-model.js' : '../../../scripts/lib/run-model.ts') as typeof import('../../../scripts/lib/run-model.ts');
const scratch = mkdtempSync(join(tmpdir(), 'f03-c07-accounting-'));
const execution = { stage: 'S2', stage_status: 'entered', core_state: 'DISTILLING', blocked: false };
const cases: Array<{ name: string; kind: 'control' | 'adversarial'; result: 'PASS' }> = [];
function test(name: string, action: () => void, kind: 'control' | 'adversarial' = 'control') {
  action(); cases.push({ name, kind, result: 'PASS' }); console.log(`PASS C07 ${name}`);
}
const write = writeFixtureFile;
const read = (run: string, path: string): any => JSON.parse(readFileSync(join(run, path), 'utf8'));
const seal = (value: object): any => ({ ...value, digest: core.workDigest(core.workJson(value)) });
function checkpoint(state: any): string {
  const copy = structuredClone(state); copy.execution.resume.checkpoint_digest = '';
  return core.workDigest(core.workJson(copy));
}
function seed(name: string) {
  const f = makeSemanticFixture(join(scratch, name), undefined, undefined, undefined, '1.9.0-provisional');
  // This fresh synthetic fixture replaces only its own prebuilt manual example.
  rmSync(join(f.run, 'verification/harness'), { recursive: true, force: true });
  for (const path of ['ledgers/packet-index.md', 'ledgers/source-walk.md']) {
    const text = readFileSync(join(f.run, path), 'utf8');
    const rows = new Set(parseTables(text).flatMap((table) => table.rows.map((row) => row.line)));
    write(f.run, path, text.split('\n').filter((_, index) => !rows.has(index + 1)).join('\n'));
  }
  write(f.run, sem.SEMANTIC_PATH, sem.semanticLedgerMarkdown(sem.emptySemanticLedger()));
  write(f.run, rep.REPRESENTATION_USE_PATH, rep.representationUsesMarkdown([]));
  const model = loadRun(f.run), source = model.corpus.sources[0].values;
  let walk = core.appendRows(readFileSync(join(f.run, 'ledgers/source-walk.md')), 'cursor_id',
    [['CUR-0001', source.sourceId, '0', 'none', 'none', 'none', 'none', source.contentHash, 'initial']]);
  walk = core.appendRows(walk, 'source_id', [[source.sourceId, source.contentHash, String(f.source.length),
    'CUR-0001', 'none', 'blocked', 'orchestrator', 'Synthetic unchanged frontier.']]);
  write(f.run, 'ledgers/source-walk.md', walk);
  const state = { run_id: model.manifest!.runId, full_mode: 'fixture-simulated',
    identity: { run_format_version: '1.9.0-provisional', profile: { id: 'n/a (core-manual)', digest: null },
      core: { tree_digest: model.manifest!.forwardIdentity.coreDigest },
      adapter: { tree_digest: model.manifest!.forwardIdentity.adapterDigest },
      bundle: { digest: model.manifest!.forwardIdentity.bundleDigest },
      checker_digest: model.manifest!.forwardIdentity.checkerDigest,
      runtime: { digest: model.manifest!.forwardIdentity.runtimeSnapshotDigest },
      adapter_protocol_version: model.manifest!.forwardIdentity.adapterProtocolVersion,
      models: { 'verifier-l2s': 'human' } },
    execution: { ...execution, resume: { checkpoint_digest: '', sequence: '0' } },
    ledger: { chain_head: core.workDigest(''), sequence: '0', writer_id: 'loa-orchestrator' } };
  state.execution.resume.checkpoint_digest = checkpoint(state);
  write(f.run, 'control/run-state.json', core.workJson(state)); write(f.run, 'control/ledger-chain.jsonl', '');
  return f;
}
function selected(run: string): Extract<NextWork, { kind: 'worker' | 'local' }> {
  const next = core.selectNextWork(loadRun(run), execution);
  assert(next.kind === 'worker' || next.kind === 'local'); return next;
}
function syntheticWork(run: string, work: Extract<NextWork, { kind: 'worker' | 'local' }>, raw?: any) {
  const state = read(run, 'control/run-state.json');
  const directory = join(run, 'control/orchestration/work');
  const identity = { run_id: state.run_id, pins: state.identity, checkpoint: state.execution.resume.checkpoint_digest,
    ledger: state.ledger, ordinal: String((existsSync(directory) ? readdirSync(directory).length : 0) + 1),
    work, dependencies: [] };
  const id = `WORK-${core.workDigest(core.workJson(identity)).slice(7)}`;
  const call = work.kind === 'worker' ? { ...work.call, call_id: work.call.prepared_call_id, role: work.call.role, kind: work.call.kind } : null;
  const durable = seal({ format: 'aleph-loa-work-item/v1', work_id: id, identity,
    basis_digest: core.workDigest('synthetic Core fixture basis'), call, created_at: '2026-09-26T13:00:00Z' });
  write(run, `control/orchestration/work/${id}.json`, core.workJson(durable));
  let value: WorkValue | null = null;
  if (call) {
    const rawBytes = Buffer.from(sem.semanticJson(raw)), context = `synthetic-${call.call_id}`;
    const acceptance = seal({ format: 'aleph-loa-accepted-return/v1', work_id: id, work_digest: durable.digest,
      call_id: call.call_id, checkpoint: identity.checkpoint, basis_digest: durable.basis_digest,
      raw_digest: core.workDigest(rawBytes), context_id: context, producer_context_id: null, simulation: true });
    write(run, `control/orchestration/accepted/${call.call_id}.json`, core.workJson(acceptance));
    write(run, `control/worker-returns/${call.call_id}/raw.json`, rawBytes);
    write(run, `control/worker-returns/${call.call_id}/native-dispatch.json`, sem.semanticJson({ receipt: { call_id: call.call_id, context_id: context } }));
    write(run, `control/worker-bundles/${call.call_id}/request.json`, sem.semanticJson({ role: call.role }));
    value = { call_id: call.call_id!, role: call.role, context_id: context, producer_context_id: null,
      raw_digest: acceptance.raw_digest, receipt_digest: acceptance.digest, simulation: true, value: raw };
  }
  return { durable, value };
}
function commit(run: string, work: Extract<NextWork, { kind: 'worker' | 'local' }>, raw?: any) {
  const auth = syntheticWork(run, work, raw);
  const plan = core.deriveWorkTransition(loadRun(run), execution, work, auth.value, auth.durable.created_at);
  const state = read(run, 'control/run-state.json'), after = structuredClone(state);
  const chainBefore = readFileSync(join(run, 'control/ledger-chain.jsonl'), 'utf8'); let chain = chainBefore;
  const check = mkdtempSync(join(scratch, 'validation-')); cpSync(run, check, { recursive: true });
  for (const effect of plan.effects) write(check, effect.path, Buffer.from(effect.after_base64, 'base64'));
  core.validateDerivedWorkTransition(loadRun(run), loadRun(check), plan);
  for (const effect of plan.effects) {
    write(run, effect.path, Buffer.from(effect.after_base64, 'base64'));
    const body = { sequence: String(Number(after.ledger.sequence) + 1), path: effect.path,
      before_digest: effect.before_digest || core.workDigest(''), after_digest: effect.after_digest,
      previous_chain_digest: after.ledger.chain_head };
    after.ledger.sequence = body.sequence; after.ledger.chain_head = core.workDigest(core.workJson(body));
    chain += core.workJson({ ...body, chain_digest: after.ledger.chain_head }).toString();
  }
  after.execution.resume.sequence = String(Number(state.execution.resume.sequence) + 1);
  after.execution.resume.checkpoint_digest = checkpoint(after);
  const id = auth.durable.work_id, journalPath = `control/transactions/TXN-work-${id.slice(5)}.json`;
  const intent = seal({ format: 'aleph-loa-orchestration-commit/v1', work_id: id, work_digest: auth.durable.digest,
    acceptance_digest: auth.value?.receipt_digest || null, plan_digest: core.workDigest(core.workJson(plan)),
    before_checkpoint: state.execution.resume.checkpoint_digest, before_chain: state.ledger.chain_head, journal: journalPath });
  const journal = { ...seal({ format: 'aleph-loa-work-transaction/v1', work_id: id, intent_digest: intent.digest,
    plan, state_before: state, state_after: after, chain_before: chainBefore, chain_after: chain }), status: 'committed' };
  write(run, journalPath, core.workJson(journal));
  write(run, `control/orchestration/commits/${id}-intent.json`, core.workJson(intent));
  write(run, `control/orchestration/commits/${id}-consumed.json`, core.workJson(seal({
    format: 'aleph-loa-work-consumption/v1', work_id: id, commit_digest: intent.digest,
    journal_digest: core.workDigest(core.workJson(journal)), after_checkpoint: after.execution.resume.checkpoint_digest,
    after_chain: after.ledger.chain_head })));
  write(run, 'control/run-state.json', core.workJson(after)); write(run, 'control/ledger-chain.jsonl', chain);
  return { ...auth, plan };
}
function prepare(run: string) {
  const next = selected(run); assert.equal(next.obligation.operation, 's2.prepare-extractor'); commit(run, next);
  const worker = selected(run); assert(worker.kind === 'worker'); return worker;
}
function degraded(f: SemanticFixture, worker: Extract<NextWork, { kind: 'worker' }>, reasons = ['Synthetic grouping unavailable.']) {
  const source = loadRun(f.run).corpus.sources[0].values;
  return { source_id: source.sourceId, producer_invocation_id: worker.call.prepared_call_id!,
    walk_intervals: [{ start_byte: 0, end_byte: f.source.length, outcome: 'unsupported', packet_candidate_indexes: [],
      criterion_ref: 'none', closure_state: 'open', reason: reasons[0], closure_note: null }],
    packets: reasons.map((reason) => ({ evidence_state: 'degraded-non-exact', join_policy: 'not-applicable', fragments: [],
      rendered_text: 'Synthetic unresolvable material.', degraded_source_locator: 'L1-L1', degradation_reason: reason,
      criterion: 1, flags: [], material_use: { requirements: [{ object_id: 'OBJ-0002', feature: 'formal-structure', binding_ids: ['BND-0001'] }],
        use_state: 'CANNOT_DETERMINE', fidelity_claim: 'none', limitation_refs: ['OBJ-0002'], reason } })),
    extraction_events: [], next_cursor: { byte_offset: 0, shared_position_key: null, next_event_ordinal: null,
      predecessor_walk_index: null, predecessor_event_index: null, source_hash: source.contentHash, reason: 'bounded-pause' },
    walk_exhausted: false, notes: [], material_findings: [], semantic_units: reasons.map((reason, index) => ({
      output_kind: 'packet-candidate', output_index: index, review_mode: 'proposal', origin_unit_refs: [], anchors: [],
      semantics: { atomicity: 'CANNOT_DETERMINE', units: [], contexts: [], couplings: [], relation_proposals: [],
        unresolved_findings: [{ finding_id: 'F1', field_path: '/semantics/atomicity', code: 'material-unavailable',
          anchor_ids: [], material_requirement_indexes: [0], unknown_dimension: 'none', missing: reason, requested_context: [] }] } })) };
}
function manualReviews(f: SemanticFixture): void {
  const ledger = core.semanticLedger(loadRun(f.run));
  for (const row of ledger.subjects.filter((row) => !ledger.resolutions.some((resolution) => resolution.semantic_id === row.semantic_id))) {
    const subject = read(f.run, row.subject_path) as SemanticSubject;
    const producer = read(f.run, row.producer_receipt_ref.split('@')[0]);
    const returned = read(f.run, `control/worker-returns/${producer.call_id}/raw.json`);
    const entry = returned.semantic_units.find((entry: SemanticEntry) =>
      entry.output_kind === producer.output_kind && entry.output_index === producer.output_index);
    const reviewId = `VER-${row.semantic_id.slice(4)}`;
    const assignment: SemanticAssignment = { format: sem.SEMANTIC_ASSIGNMENT_FORMAT, semantic_id: subject.semantic_id,
      subject_digest: row.subject_digest, review_id: reviewId, role: 'verifier-l2s', profile_digest: null,
      invocation_id: `manual-pass-${reviewId}`, producer_binding_hash: subject.producer_binding_hash, execution_kind: 'manual-separate-pass' };
    ledger.resolutions.push({ resolution_id: `SMR-${row.semantic_id.slice(4)}`, semantic_id: row.semantic_id,
      outcome: 'not-admitted', review_ids: '[]', canonical_refs: '[]', origin_unit_refs: '[]', followup_semantic_ids: '[]' });
    fixtureReview({ ...f, ledger, subject, producer, returned, entry, assignment, result: fixtureResult(subject) }, fixtureResult(subject));
  }
  sem.validateSemanticRun(loadRun(f.run));
}
function clone(run: string, name: string): string {
  const target = join(scratch, name); cpSync(run, target, { recursive: true }); return target;
}
function changeJson(run: string, path: string, action: (value: any) => void): void {
  const value = read(run, path); action(value); write(run, path, sem.semanticJson(value));
}
const f = seed('single'), worker = prepare(f.run), returned = degraded(f, worker);
const initial = clone(f.run, 'prepared-generation-zero');
const beforeWalk = readFileSync(join(f.run, 'ledgers/source-walk.md'));
const first = commit(f.run, worker, returned);
test('stationary degraded capture is an authenticated accounting transaction', () => assert(first.plan.stationary_capture));
test('source-walk bytes and cursor stay exact', () => assert(readFileSync(join(f.run, 'ledgers/source-walk.md')).equals(beforeWalk)));
test('completion remains blocked at original cursor', () => {
  const value = loadRun(f.run).sourceWalk.completions[0].values;
  assert.equal(value.completionState, 'blocked'); assert.equal(value.finalCursorId, 'CUR-0001');
});
test('no PKT or CC is fabricated', () => {
  assert.equal(loadRun(f.run).packets.length, 0); assert.equal(loadRun(f.run).claims.length, 0);
});
test('original degraded selector has its dedicated published L2S subject', () => {
  const ledger = core.semanticLedger(loadRun(f.run)); assert.equal(ledger.subjects.length, 1);
  assert.equal(read(f.run, ledger.subjects[0].subject_path).subject_kind, 'degraded-packet');
});
test('consumption records accounting without source progress', () => {
  assert.equal(first.plan.stationary_capture!.outcome, 'stationary-accounting-only');
  assert(existsSync(join(f.run, `control/orchestration/commits/${first.durable.work_id}-consumed.json`)));
});
test('L2S is selected before a same-frontier retry', () => assert.equal(selected(f.run).obligation.operation, 'sem.assign'));
test('continuation generation is refused while L2S is outstanding', () => {
  assert.throws(() => stationary.captureGeneration(loadRun(f.run), 'SRC-701'), /L2S accounting remains outstanding/u);
}, 'adversarial');
manualReviews(f);
const continuation = prepare(f.run);
const retryBasis = clone(f.run, 'prepared-generation-one');
test('review completion allows a fresh deterministic capture identity', () => {
  assert.notEqual(continuation.call.prepared_call_id, worker.call.prepared_call_id);
  assert.equal(stationary.captureGeneration(loadRun(f.run), 'SRC-701').generation, '1');
});
const repeated = degraded(f, continuation);
const second = commit(f.run, continuation, repeated);
test('cross-invocation identical content is explicitly duplicate-accounted', () => {
  assert.equal(second.plan.stationary_capture!.selectors[0].disposition, 'duplicate-accounting');
  assert.deepEqual(second.plan.stationary_capture!.new_candidate_content_digests, []);
});
test('duplicate accounting reuses exact prior subject and review basis', () => {
  const selector = second.plan.stationary_capture!.selectors[0];
  assert.equal(selector.semantic_id, first.plan.stationary_capture!.selectors[0].semantic_id);
  assert(selector.review_basis_digest); assert.equal(core.semanticLedger(loadRun(f.run)).subjects.length, 1);
});
test('duplicate capture cannot advance bytes or event ordinals', () => assert(readFileSync(join(f.run, 'ledgers/source-walk.md')).equals(beforeWalk)));
const haltWork = selected(f.run);
test('no-new-effect generation selects a durable stationary halt', () => assert.equal(haltWork.obligation.operation, 's2.stationary-halt'));
commit(f.run, haltWork);
test('repeated resume returns the same halt instead of dispatch', () => {
  const halt = core.selectNextWork(loadRun(f.run), execution);
  assert.equal(halt.kind, 'halt'); assert(halt.kind === 'halt' && halt.code === 'WORK_STATIONARY_FRONTIER');
  assert.deepEqual(core.selectNextWork(loadRun(f.run), execution), halt);
});
const multi = seed('multiple'), multiWork = prepare(multi.run);
const multiple = commit(multi.run, multiWork, degraded(multi, multiWork, ['Grouping unavailable.', 'Ordering unavailable.']));
test('multi-candidate capture publishes every original selector exactly once', () => {
  assert.equal(multiple.plan.stationary_capture!.selectors.length, 2);
  assert.equal(core.semanticLedger(loadRun(multi.run)).subjects.length, 2);
});
const distinctRun = clone(retryBasis, 'new-content');
const distinct = commit(distinctRun, continuation, degraded({ ...f, run: distinctRun }, continuation, ['New exact producer limitation.']));
test('mechanically new content receives another subject without walk progress', () => {
  assert.equal(distinct.plan.stationary_capture!.selectors[0].disposition, 'new-accounting');
  assert.equal(core.semanticLedger(loadRun(distinctRun)).subjects.length, 2);
  assert(readFileSync(join(distinctRun, 'ledgers/source-walk.md')).equals(beforeWalk));
});
for (const [name, mutate] of [
  ['source locator', (value: any) => { value.packets[0].degraded_source_locator = 'L1-L2'; }],
  ['degradation reason', (value: any) => { value.packets[0].degradation_reason += ' Additional field content.'; }],
  ['criterion', (value: any) => { value.packets[0].criterion = 2; }],
  ['rendered text', (value: any) => { value.packets[0].rendered_text += ' '; }],
  ['semantic declaration', (value: any) => { value.semantic_units[0].semantics.unresolved_findings[0].missing += ' New.'; }],
  ['ordered material requirements', (value: any) => {
    value.packets[0].material_use.requirements.unshift({ object_id: 'OBJ-0001', feature: 'source-bytes', binding_ids: ['BND-0001'] });
  }],
  ['retained producer flags', (value: any) => { value.packets[0].flags.push('producer flag'); }],
] as const) test(`candidate content digest preserves ${name}`, () => {
  const value = structuredClone(returned); mutate(value);
  assert.notEqual(stationary.stationaryCandidateDigest(value, value.semantic_units[0] as SemanticEntry),
    stationary.stationaryCandidateDigest(returned, returned.semantic_units[0] as SemanticEntry));
});
test('candidate content digest excludes only invocation and selector position', () => {
  const value = structuredClone(returned); value.producer_invocation_id = 'CALL-distinct';
  value.packets.unshift(structuredClone(value.packets[0])); value.semantic_units[0].output_index = 1;
  assert.equal(stationary.stationaryCandidateDigest(value, value.semantic_units[0] as SemanticEntry),
    stationary.stationaryCandidateDigest(returned, returned.semantic_units[0] as SemanticEntry));
});
for (const [name, mutate] of [
  ['fabricated byte offset', (value: any) => { value.next_cursor.byte_offset = 1; }],
  ['fabricated event ordinal', (value: any) => { value.next_cursor.next_event_ordinal = 2; }],
  ['fabricated event commitment', (value: any) => {
    value.extraction_events.push({ start_byte: 0, end_byte: 1, shared_position_key: 'SP-9999', event_ordinal: 1,
      packet_candidate_index: 0, origin: 'primary' });
  }],
  ['fabricated exact packet', (value: any) => { value.packets[0].evidence_state = 'exact'; }],
  ['caller supplied generation', (value: any) => { value.capture_generation = '1'; }],
  ['caller stationary permission flag', (value: any) => { value.allow_stationary_capture = true; }],
  ['arbitrary stationary no-op without a candidate', (value: any) => { value.packets = []; value.semantic_units = []; }],
] as const) test(`rejects ${name}`, () => {
  const run = clone(initial, name.replaceAll(' ', '-')), value = structuredClone(returned);
  mutate(value);
  assert.throws(() => commit(run, worker, value), /WORK_RETURN|WORK_CURSOR|WORK_SOURCE_COMPLETION|WORK_EXACT_EVIDENCE|WORK_EVENT_BINDING/u);
}, 'adversarial');
for (const [name, path, mutate] of [
  ['content digest', `${stationary.STATIONARY_CAPTURES}${second.value!.call_id}.json`,
    (value: any) => { value.selectors[0].candidate_content_digest = core.workDigest('forged'); }],
  ['generation', `${stationary.STATIONARY_CAPTURES}${second.value!.call_id}.json`,
    (value: any) => { value.basis.generation = '2'; }],
  ['frontier digest', `${stationary.STATIONARY_CAPTURES}${second.value!.call_id}.json`,
    (value: any) => { value.basis.frontier_digest = core.workDigest('forged'); }],
  ['cursor identity', `${stationary.STATIONARY_CAPTURES}${second.value!.call_id}.json`,
    (value: any) => { value.basis.cursor_id = 'CUR-9999'; }],
  ['previous work identity', `${stationary.STATIONARY_CAPTURES}${second.value!.call_id}.json`,
    (value: any) => { value.basis.previous_work_id = first.durable.work_id.replace(/.$/u, 'f'); }],
  ['cumulative accounting basis', `${stationary.STATIONARY_CAPTURES}${second.value!.call_id}.json`,
    (value: any) => { value.basis.accounting_basis_digest = core.workDigest('forged'); }],
  ['duplicate subject', `${stationary.STATIONARY_CAPTURES}${second.value!.call_id}.json`,
    (value: any) => { value.selectors[0].semantic_id = 'SEM-9999'; }],
  ['duplicate review basis', `${stationary.STATIONARY_CAPTURES}${second.value!.call_id}.json`,
    (value: any) => { value.selectors[0].review_basis_digest = core.workDigest('forged'); }],
  ['selector omission', `${stationary.STATIONARY_CAPTURES}${second.value!.call_id}.json`,
    (value: any) => { value.selectors = []; }],
  ['accepted raw return', `control/worker-returns/${first.value!.call_id}/raw.json`,
    (value: any) => { value.packets[0].rendered_text += 'tampered'; }],
  ['producer binding', first.plan.stationary_capture!.selectors[0].binding_path,
    (value: any) => { value.output_index = 8; }],
  ['semantic subject', 'verification/harness/semantic-subjects/SEM-0001.json',
    (value: any) => { value.owner_stage = 'S3'; }],
  ['retained work', `control/orchestration/work/${first.durable.work_id}.json`,
    (value: any) => { value.identity.work.obligation.stage = 'S3'; }],
  ['retained consumption', `control/orchestration/commits/${first.durable.work_id}-consumed.json`,
    (value: any) => { value.after_checkpoint = core.workDigest('forged'); }],
  ['stale checkpoint', 'control/run-state.json',
    (value: any) => { value.execution.resume.checkpoint_digest = core.workDigest('stale'); }],
  ['stale chain', 'control/run-state.json',
    (value: any) => { value.ledger.chain_head = core.workDigest('stale'); value.execution.resume.checkpoint_digest = checkpoint(value); }],
  ['wrong run', 'control/run-state.json',
    (value: any) => { value.run_id = 'RUN-wrong'; value.execution.resume.checkpoint_digest = checkpoint(value); }],
] as const) test(`retained ${name} tamper fails closed`, () => {
  const run = clone(f.run, `tamper-${name.replaceAll(' ', '-')}`); changeJson(run, path, mutate);
  assert.throws(() => stationary.stationaryHistory(loadRun(run)), /WORK_STATIONARY_BINDING/u);
}, 'adversarial');
test('consumed capture identity cannot produce a second transaction', () => assert.throws(() =>
  core.deriveWorkTransition(loadRun(f.run), execution, worker, first.value, first.durable.created_at),
  /WORK_.*(?:STALE|CHANGED)|WORK_SELECTION|WORK_OBLIGATION/u), 'adversarial');
test('a rehashed consumption record with a foreign format cannot authorize generation', () => {
  const run = clone(f.run, 'foreign-consumption-format');
  const path = `control/orchestration/commits/${first.durable.work_id}-consumed.json`;
  const { digest: _digest, ...body } = read(run, path);
  body.format = 'caller-stationary-permission/v1'; write(run, path, core.workJson(seal(body)));
  assert.throws(() => stationary.stationaryHistory(loadRun(run)), /WORK_STATIONARY_BINDING/u);
}, 'adversarial');
for (const version of ['1.2.0-provisional', '1.3.0-provisional', '1.4.0-provisional', '1.5.0-provisional',
  '1.6.0-provisional', '1.7.0-provisional', '1.8.0-provisional']) test(`stationary extension refuses predecessor ${version}`, () => {
  const model = loadRun(initial);
  assert.throws(() => stationary.captureGeneration({ ...model, manifest: { ...model.manifest!, runFormatVersion: version } }, 'SRC-701'),
    /pinned cumulative 1.9 required/u);
}, 'adversarial');
for (const kind of ['walk-only', 'repeated-degraded', 'new-degraded'] as const) {
  const run = clone(retryBasis, `real-progress-${kind}`), value = degraded({ ...f, run }, continuation,
    kind === 'new-degraded' ? ['New material limitation with real progress.'] : undefined);
  value.walk_intervals = [{ start_byte: 0, end_byte: f.source.length, outcome: 'excluded',
    packet_candidate_indexes: [], criterion_ref: 'exclusion:scaffolding', closure_state: 'closed',
    reason: 'Synthetic legally traversed exclusion interval.', closure_note: null }];
  value.next_cursor.byte_offset = f.source.length; value.next_cursor.reason = 'source-complete';
  (value.next_cursor as any).predecessor_walk_index = 0; value.walk_exhausted = true;
  if (kind === 'walk-only') { value.packets = []; value.semantic_units = []; }
  const result = commit(run, continuation, value);
  test(`legal real progress after stationary review: ${kind}`, () => {
    assert.equal(result.plan.stationary_capture!.outcome, 'frontier-advanced');
    assert.equal(loadRun(run).sourceWalk.cursors.at(-1)!.values.byteOffset, String(f.source.length));
    assert.notEqual(result.plan.source_completion!.after_digest, result.plan.source_completion!.before_digest);
    stationary.stationaryHistory(loadRun(run));
    if (kind === 'repeated-degraded') {
      assert.equal(result.plan.stationary_capture!.selectors[0].disposition, 'duplicate-accounting');
      assert.equal(core.semanticLedger(loadRun(run)).subjects.length, 1);
    }
    if (kind === 'new-degraded') {
      assert.equal(result.plan.stationary_capture!.selectors[0].disposition, 'new-accounting');
      assert.equal(selected(run).obligation.operation, 'sem.reserve-S2');
    }
  });
}
test('strict K2.14 and exact frozen source identity survive stationary generations', () => {
  for (const run of [initial, retryBasis, f.run, distinctRun]) {
    const model = loadRun(run), checks = new ResultCollector('C07 exact stationary source');
    const sourceBytes = readFileSync(join(run, 'corpus/sources/semantic.txt'));
    assert.equal(core.workDigest(sourceBytes), model.corpus.sources[0].values.contentHash);
    k2.runK2(checks, model, process.cwd());
    const sourceChecks = checks.report().checks.filter((check) => check.id === 'K2.14');
    assert(sourceChecks.length && sourceChecks.every((check) => check.status === 'PASS'), JSON.stringify(sourceChecks));
  }
});
test('changed frozen source bytes remain a K2.14 failure', () => {
  const run = clone(f.run, 'frozen-source-tamper');
  write(run, 'corpus/sources/semantic.txt', 'Fabricated source content.');
  const checks = new ResultCollector('C07 changed frozen source');
  k2.runK2(checks, loadRun(run), process.cwd());
  assert(checks.report().checks.some((check) => check.id === 'K2.14' && check.status === 'FAIL'));
}, 'adversarial');
test('a retained pending event selects C03 commitment and cannot be consumed by stationary capture', () => {
  const pending = makeSemanticFixture(join(scratch, 'pending-event-priority'), 'A counter rose.', undefined, undefined, '1.9.0-provisional');
  let packets = readFileSync(join(pending.run, 'ledgers/packet-index.md'), 'utf8');
  for (const row of packets.split('\n').filter((line) => /^\| (?:PKT|EVID|FRAG)-0701 \|/u.test(line))) {
    packets = packets.replace(row, `${row}\n${row.replaceAll('0701', '0702')}`);
  }
  write(pending.run, 'ledgers/packet-index.md', packets);
  const model = loadRun(pending.run), firstEvent = model.sourceWalk.events[0].raw;
  const sibling = firstEvent.replaceAll('EVT-0701', 'EVT-0702').replaceAll('PKT-0701', 'PKT-0702')
    .replace('| 1 |', '| 2 |').replace('| committed |', '| pending |');
  const oldCursor = model.sourceWalk.cursors.at(-1)!.raw;
  const current = `| CUR-0702 | SRC-701 | 0 | SP-0701 | 2 | WLK-0701 | EVT-0701 | ${model.corpus.sources[0].values.contentHash} | bounded-pause |`;
  const walk = model.sourceWalkDocument!.text.replace(firstEvent, `${firstEvent}\n${sibling}`).replace(oldCursor, current)
    .replace(model.sourceWalk.gapReviews[0].raw + '\n', '')
    .replace(model.sourceWalk.intervals[0].raw, model.sourceWalk.intervals[0].raw.replace('| PKT-0701 |', '| PKT-0701, PKT-0702 |'))
    .replace(model.sourceWalk.completions[0].raw,
      model.sourceWalk.completions[0].raw.replace('GAP-0701', 'none').replace('| complete |', '| blocked |'));
  write(pending.run, 'ledgers/source-walk.md', walk);
  const checks = new ResultCollector('C07 pending event before-image');
  k2.runK2(checks, loadRun(pending.run), process.cwd());
  assert(checks.report().checks.filter((check) => check.id === 'K2.14').every((check) => check.status === 'PASS'));
  const next = core.selectNextWork(loadRun(pending.run), execution);
  assert(next.kind === 'local' && next.obligation.operation === 's2.commit-event');
  assert.equal(next.obligation.subject_id, 'EVT-0702');
  assert.throws(() => core.deriveWorkTransition(loadRun(pending.run), execution, worker, first.value,
    first.durable.created_at), /WORK_.*(?:STALE|CHANGED)|WORK_SELECTION|WORK_OBLIGATION/u);
  assert.equal(readFileSync(join(pending.run, 'ledgers/source-walk.md'), 'utf8'), walk);
  assert.equal(loadRun(pending.run).sourceWalk.events[1].values.status, 'pending');
});
const materialFixture = seed('stationary-with-material'), materialWorker = prepare(materialFixture.run);
const withMaterial: any = degraded(materialFixture, materialWorker);
withMaterial.material_findings.push({ object_id: 'OBJ-0002', material_use: structuredClone(withMaterial.packets[0].material_use) });
withMaterial.semantic_units.push({ ...structuredClone(withMaterial.semantic_units[0]), output_kind: 'material-candidate' });
const materialCapture = commit(materialFixture.run, materialWorker, withMaterial);
test('stationary packet and actual material selectors retain separate original accounting', () => {
  assert.deepEqual(materialCapture.plan.stationary_capture!.selectors.map((entry) => [entry.output_kind, entry.output_index]),
    [['packet-candidate', '0'], ['material-candidate', '0']]);
  assert.equal(core.semanticLedger(loadRun(materialFixture.run)).subjects.length, 1);
  assert.equal(rep.readRepresentationContext(loadRun(materialFixture.run)).uses.length, 1);
});
manualReviews(materialFixture);
const reserveMaterial = selected(materialFixture.run); assert.equal(reserveMaterial.obligation.operation, 'sem.reserve-S2');
commit(materialFixture.run, reserveMaterial);
test('actual material candidate receives its separate required C01 subject', () => {
  const rows = core.semanticLedger(loadRun(materialFixture.run)).subjects;
  assert.equal(rows.length, 2); assert.equal(read(materialFixture.run, rows[1].subject_path).subject_kind, 'material-only');
  assert.equal(read(materialFixture.run, rows[0].subject_path).subject_kind, 'degraded-packet');
});
manualReviews(materialFixture);
const retryMaterial = prepare(materialFixture.run);
const materialRepeat = structuredClone(withMaterial); materialRepeat.producer_invocation_id = retryMaterial.call.prepared_call_id;
const beforeUses = readFileSync(join(materialFixture.run, 'ledgers/representation-uses.md'));
const repeatedMaterial = commit(materialFixture.run, retryMaterial, materialRepeat);
test('repeated material and degraded selectors reuse exact reviews without another USE or subject', () => {
  assert(repeatedMaterial.plan.stationary_capture!.selectors.every((entry) => entry.disposition === 'duplicate-accounting'));
  assert.equal(core.semanticLedger(loadRun(materialFixture.run)).subjects.length, 2);
  assert(readFileSync(join(materialFixture.run, 'ledgers/representation-uses.md')).equals(beforeUses));
});
console.log(JSON.stringify({ result: 'PASS', runtime, cases, total: cases.length,
  adversarial: cases.filter((entry) => entry.kind === 'adversarial').length, scratch,
  scope: 'partial synthetic Core accounting controls; manual fixture review declarations, not installed transport or producer completion' }, null, 2));

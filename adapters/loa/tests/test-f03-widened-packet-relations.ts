#!/usr/bin/env node
// C-06 synthetic Core controls. Installed controller evidence remains separate.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import { RELATION_TABLE_HEADER, RELATION_FORMAT } from '../../../scripts/lib/relations.ts';
import { ResultCollector } from '../../../scripts/lib/results.ts';
import type { SemanticSubject, RelationProjection } from '../../../scripts/lib/semantic-review.ts';
import type { WorkValue, WorkTransition } from '../../../scripts/lib/work-transitions.ts';
const runtime = process.argv.includes('--runtime');
const sem: typeof import('../../../scripts/lib/semantic-review.ts') = await import(runtime ? '../../../runtime-js/scripts/lib/semantic-review.js' : '../../../scripts/lib/semantic-review.ts') as typeof import('../../../scripts/lib/semantic-review.ts');
const core = await import(runtime ? '../../../runtime-js/scripts/lib/work-transitions.js' : '../../../scripts/lib/work-transitions.ts') as typeof import('../../../scripts/lib/work-transitions.ts');
const relations = await import(runtime ? '../../../runtime-js/scripts/lib/checks-k2-relations.js' : '../../../scripts/lib/checks-k2-relations.ts') as typeof import('../../../scripts/lib/checks-k2-relations.ts');
const root = mkdtempSync(join(tmpdir(), 'f03-c06-core-'));
const historical = spawnSync(process.execPath, ['adapters/loa/tests/test-f03-s3-packet-relation-ownership-conflict.ts',
  ...runtime ? ['--runtime'] : []], { encoding: 'utf8' });
assert.equal(historical.status, 0, historical.stderr);
const original = JSON.parse(historical.stdout);
assert.equal(original.assertions, 37);
const execution = { stage: 'S3', stage_status: 'entered', core_state: 'DISTILLING', blocked: false };
const cases: Array<{ name: string; kind: 'control' | 'adversarial'; result: 'PASS' }> = [];
function test(name: string, action: () => void, kind: 'control' | 'adversarial' = 'control') {
  action(); cases.push({ name, kind, result: 'PASS' }); console.log(`PASS C06 ${name}`);
}
function write(run: string, path: string, bytes: Buffer | string) {
  mkdirSync(dirname(join(run, path)), { recursive: true }); writeFileSync(join(run, path), bytes);
}
function json(run: string, path: string): any { return JSON.parse(readFileSync(join(run, path), 'utf8')); }
function seal(value: object): any { return { ...value, digest: core.workDigest(core.workJson(value)) }; }
function checkpoint(value: any): string {
  const copy = structuredClone(value); copy.execution.resume.checkpoint_digest = '';
  return core.workDigest(core.workJson(copy));
}
function apply(run: string, plan: WorkTransition, name: string): string {
  const next = join(root, name); cpSync(run, next, { recursive: true });
  for (const effect of plan.effects) write(next, effect.path, Buffer.from(effect.after_base64, 'base64'));
  core.validateDerivedWorkTransition(loadRun(run), loadRun(next), plan);
  return next;
}
function prepare(name: string, alter?: (proposal: RelationProjection) => void) {
  const run = join(root, name); cpSync(join(original.scratch, 'producer-S3'), run, { recursive: true });
  const selected = core.selectNextWork(loadRun(run), execution);
  assert(selected.kind === 'worker' && selected.obligation.operation === 's3.capture-widening');
  const call = selected.call.prepared_call_id!, rawPath = `control/worker-returns/${call}/raw.json`;
  const returned = json(run, rawPath), proposal = returned.semantic_units[0].semantics.relation_proposals[0] as RelationProjection;
  const packetBytes = Buffer.from(returned.packets[0].fragments[0].exact_bytes_base64, 'base64');
  const targetLine = packetBytes.subarray(0, packetBytes.indexOf(10) + 1);
  Object.assign(returned.semantic_units[0].anchors[0], {
    locator: 'L1-L1', start_byte: 0, end_byte: targetLine.length, exact_bytes_base64: targetLine.toString('base64'),
  });
  returned.semantic_units[0].semantics.units[0].claim_roles.items[0].source_text = targetLine.toString();
  alter?.(proposal);
  proposal.review_subject_digest = core.workDigest(sem.semanticJson(proposal.subject));
  const raw = Buffer.from(sem.semanticJson(returned)); write(run, rawPath, raw);
  const state = json(run, 'control/run-state.json');
  state.run_id = loadRun(run).manifest!.runId;
  state.identity.run_format_version = '1.9.0-provisional';
  state.execution = { ...execution, resume: { checkpoint_digest: '', sequence: '0' } };
  state.ledger = { chain_head: core.workDigest(''), sequence: '0' };
  state.execution.resume.checkpoint_digest = checkpoint(state);
  write(run, 'control/run-state.json', core.workJson(state));
  const identity = { run_id: state.run_id, pins: state.identity, checkpoint: state.execution.resume.checkpoint_digest,
    ledger: state.ledger, ordinal: '1', work: selected,
    dependencies: [{ call_id: selected.accepted_dependencies![0], work_id: `WORK-${'a'.repeat(64)}` }] };
  const work = seal({ work_id: `WORK-${core.workDigest(core.workJson(identity)).slice(7)}`, identity,
    basis_digest: core.workDigest('synthetic basis'), call: { call_id: call, role: 'extractor', kind: 'producer',
      output_selector: selected.call.output_selector, task_line: selected.call.task_line } });
  const acceptance = seal({ work_id: work.work_id, work_digest: work.digest, call_id: call,
    checkpoint: identity.checkpoint, basis_digest: work.basis_digest, raw_digest: core.workDigest(raw),
    context_id: 'synthetic-widening', producer_context_id: null, simulation: true });
  const accepted: WorkValue = { call_id: call, role: 'extractor', context_id: acceptance.context_id,
    producer_context_id: null, raw_digest: acceptance.raw_digest, receipt_digest: acceptance.digest, simulation: true,
    value: returned, widening_work_provenance: {
      work_record_base64: core.workJson(work).toString('base64'),
      acceptance_record_base64: core.workJson(acceptance).toString('base64'),
    } };
  const capture = core.deriveWorkTransition(loadRun(run), execution, selected, accepted, '2026-09-26T12:00:00Z');
  const captured = apply(run, capture, `${name}-captured`), after = structuredClone(state);
  let chain = '';
  for (const effect of capture.effects) {
    const receipt = { sequence: String(Number(after.ledger.sequence) + 1), path: effect.path,
      before_digest: effect.before_digest || core.workDigest(''), after_digest: effect.after_digest,
      return_digest: accepted.raw_digest, previous_chain_digest: after.ledger.chain_head };
    const digest = core.workDigest(core.workJson(receipt));
    chain += core.workJson({ ...receipt, chain_digest: digest }).toString();
    after.ledger.sequence = receipt.sequence; after.ledger.chain_head = digest;
  }
  after.execution.resume.sequence = '1'; after.execution.resume.checkpoint_digest = checkpoint(after);
  const intent = { format: 'aleph-loa-orchestration-commit/v1', work_id: work.work_id, work_digest: work.digest,
    acceptance_digest: acceptance.digest, plan_digest: core.workDigest(core.workJson(capture)),
    before_checkpoint: identity.checkpoint, before_chain: state.ledger.chain_head,
    journal: `control/transactions/TXN-work-${work.work_id.slice(5)}.json` };
  const body = { format: 'aleph-loa-work-transaction/v1', work_id: work.work_id,
    intent_digest: core.workDigest(core.workJson(intent)), plan: capture, state_before: state, state_after: after,
    chain_before: '', chain_after: chain };
  write(captured, intent.journal, core.workJson({ ...seal(body), status: 'committed' }));
  write(captured, 'control/ledger-chain.jsonl', chain); write(captured, 'control/run-state.json', core.workJson(after));
  const reserve = core.selectNextWork(loadRun(captured), execution);
  return { run, captured, call, work, capture, reserve, proposal, journal: intent.journal };
}
const fixture = prepare('eligible');
const reservation = core.deriveWorkTransition(loadRun(fixture.captured), execution, fixture.reserve, null, '2026-09-26T12:01:00Z');
const reserved = apply(fixture.captured, reservation, 'reserved');
const ledger = sem.parseSemanticLedger(readFileSync(join(reserved, sem.SEMANTIC_PATH), 'utf8'));
const row = ledger.subjects.at(-1)!, subject = json(reserved, row.subject_path) as SemanticSubject;
const relation = sem.semanticRelationRow(subject.semantics.relation_proposals[0]);
function problems(run: string, value = relation, context: SemanticSubject | undefined = subject) {
  return relations.relationProposalProblems(loadRun(run), value, true, context);
}
function refusal(name: string, mutate: (run: string, subject: SemanticSubject) => void) {
  test(name, () => {
    const run = join(root, `mutation-${cases.length}`); cpSync(reserved, run, { recursive: true });
    const context = structuredClone(subject); mutate(run, context);
    let rejected = problems(run, sem.semanticRelationRow(context.semantics.relation_proposals[0]), context).length > 0;
    if (!rejected) {
      try { sem.validateSemanticSubject(context, loadRun(run)); }
      catch { rejected = true; }
    }
    assert(rejected);
  }, 'adversarial');
}
test('ordinary S2 PKT source remains legal', () => {
  const proposal = structuredClone(fixture.proposal);
  proposal.subject.owner_stage = 'S2'; proposal.subject.source_id = 'PKT-0701';
  proposal.subject.basis_packet_ids = ['PKT-0701'];
  proposal.review_subject_digest = core.workDigest(sem.semanticJson(proposal.subject));
  assert.deepEqual(relations.relationProposalProblems(loadRun(fixture.run), sem.semanticRelationRow(proposal), true), []);
});
test('ordinary S3 claim relation remains CC-sourced', () => {
  const model = sem.claimProposalModel(loadRun(fixture.run), { kind: 'claim', reserved_claim_id: 'CC-0701',
    normalized_claim: 'The counter rose.', packet_ids: ['PKT-0701'], source_ids: ['SRC-701'], claim_type: 'factual' });
  const proposal = structuredClone(fixture.proposal);
  proposal.subject.source_kind = 'CC'; proposal.subject.source_id = 'CC-0701'; proposal.subject.basis_packet_ids = ['PKT-0701'];
  proposal.review_subject_digest = core.workDigest(sem.semanticJson(proposal.subject));
  assert.deepEqual(relations.relationProposalProblems(model, sem.semanticRelationRow(proposal), true), []);
});
test('arbitrary S3 PKT without authenticated subject is rejected', () =>
  assert(relations.relationProposalProblems(loadRun(fixture.run), relation, true).some((p) => p.includes('CC source'))), 'adversarial');
test('authenticated widening semantic capture succeeds', () => assert.deepEqual(problems(reserved), []));
test('owner remains S3', () => assert.equal(subject.owner_stage, 'S3'));
test('source remains exact widened PKT', () => assert.equal(relation.values.sourceId, 'PKT-0703'));
refusal('S2 disguise fails subject ownership', (_run, context) => { context.semantics.relation_proposals[0].subject.owner_stage = 'S2'; });
refusal('another PKT fails exact source binding', (_run, context) => { context.semantics.relation_proposals[0].subject.source_id = 'PKT-0702'; });
refusal('historical predecessor PKT fails', (_run, context) => { context.semantics.relation_proposals[0].subject.source_id = 'PKT-0701'; });
const capturePath = `verification/harness/packet-widening/captures/${fixture.call}.json`;
refusal('missing durable work provenance fails', (run) => {
  const value = json(run, capturePath); delete value.work_provenance; write(run, capturePath, core.workJson(value));
});
refusal('forged durable work identity fails', (run) => {
  const value = json(run, capturePath), work = JSON.parse(Buffer.from(value.work_provenance.work_record_base64, 'base64').toString());
  work.work_id = `WORK-${'0'.repeat(64)}`; value.work_provenance.work_record_base64 = core.workJson(work).toString('base64');
  write(run, capturePath, core.workJson(value));
});
refusal('forged provenance with recomputed record hashes fails', (run) => {
  const value = json(run, capturePath);
  const { digest: _workDigest, ...work } = JSON.parse(Buffer.from(value.work_provenance.work_record_base64, 'base64').toString());
  work.identity.work.obligation.subject_id += '-forged';
  work.work_id = `WORK-${core.workDigest(core.workJson(work.identity)).slice(7)}`;
  const sealedWork = seal(work);
  const { digest: _receiptDigest, ...receipt } = JSON.parse(Buffer.from(value.work_provenance.acceptance_record_base64, 'base64').toString());
  const acceptance = seal({ ...receipt, work_id: work.work_id, work_digest: sealedWork.digest });
  value.work_provenance = { work_record_base64: core.workJson(sealedWork).toString('base64'),
    acceptance_record_base64: core.workJson(acceptance).toString('base64') };
  value.receipt_digest = acceptance.digest;
  write(run, capturePath, core.workJson(value));
});
refusal('wrong semantic subject digest fails', (_run, context) => { context.semantics.units[0].proposition += ' changed'; });
refusal('retained ledger subject digest mutation fails', (run) => {
  const rows = sem.parseSemanticLedger(readFileSync(join(run, sem.SEMANTIC_PATH), 'utf8'));
  rows.subjects.find((entry) => entry.semantic_id === subject.semantic_id)!.subject_digest = `sha256:${'0'.repeat(64)}`;
  write(run, sem.SEMANTIC_PATH, sem.semanticLedgerMarkdown(rows));
});
refusal('wrong stage fails', (run) => {
  const state = json(run, 'control/run-state.json'); state.execution.stage = 'S2';
  write(run, 'control/run-state.json', core.workJson(state));
});
for (const field of ['run_id', 'checkpoint', 'chain'] as const) refusal(`wrong ${field} fails`, (run) => {
  const state = json(run, 'control/run-state.json');
  if (field === 'run_id') state.run_id += '-wrong';
  else if (field === 'checkpoint') state.execution.resume.checkpoint_digest = `sha256:${'0'.repeat(64)}`;
  else state.ledger.chain_head = `sha256:${'0'.repeat(64)}`;
  write(run, 'control/run-state.json', core.workJson(state));
});
for (const type of ['semantic-prerequisite', 'none']) test(`CC-only claim-dependency/${type} stays rejected`, () => {
  const invalid = prepare(`cc-only-${type}`, (proposal) => {
    proposal.subject.family = 'claim-dependency'; proposal.subject.type = type;
    if (type === 'none') Object.assign(proposal.subject, { target_kind: 'null', target_id: 'none',
      target_source_id: 'none', target_locator: 'none', target_span_hash: 'none', record_state: 'indeterminate',
      null_reason: 'insufficient-frozen-context' });
  });
  assert.throws(() => core.deriveWorkTransition(loadRun(invalid.captured), execution, invalid.reserve, null, '2026-09-26T12:02:00Z'),
    /requires source_kind CC/u);
}, 'adversarial');
test('reserved CC is not substituted', () => assert.equal(relation.values.sourceKind, 'PKT'));
test('no canonical CC is created', () => assert.equal(loadRun(reserved).claims.length, 0));
test('semantic reservation creates no canonical REL', () => assert(reservation.effects.every((e) => e.path !== 'ledgers/relations.md')));
test('retained proposal reopens without a caller exception flag', () =>
  assert.deepEqual(relations.relationProposalProblems(loadRun(reserved), relation, true), []));
test('fresh L2S remains first required work', () => {
  const next = core.selectNextWork(loadRun(reserved), execution);
  assert(next.kind === 'local' && next.obligation.operation === 'sem.assign');
  assert.equal(ledger.results.filter((entry) => entry.semantic_id === subject.semantic_id).length, 0);
});
test('separate canonical relation review remains required', () => {
  const run = join(root, 'unreviewed-relation'); cpSync(reserved, run, { recursive: true });
  const p = fixture.proposal.subject;
  const cells = ['REL-0701', p.owner_stage, p.family, p.type, p.source_kind, p.source_id,
    p.target_kind, p.target_id, p.target_source_id, p.target_locator, p.target_span_hash,
    p.record_state, p.null_reason, p.basis_packet_ids.join(', '), p.proposed_by, fixture.proposal.review_subject_digest, 'none'];
  write(run, 'ledgers/relations.md', `# Relations\n\n- relation_format: ${RELATION_FORMAT}\n\n${core.table(RELATION_TABLE_HEADER, [cells])}`);
  const result = new ResultCollector('C06'); relations.runK2Relations(result, loadRun(run));
  assert(result.checks.some((check) => check.status === 'FAIL' && check.message.includes('reviewed_by')));
}, 'adversarial');
test('S2 seal remains byte-identical', () => assert(readFileSync(join(reserved, 'verification/harness/semantic-stage-seals/S2.json'))
  .equals(readFileSync(join(fixture.run, 'verification/harness/semantic-stage-seals/S2.json')))));
test('predecessor packet semantics remain byte-identical', () => {
  const previous = sem.parseSemanticLedger(readFileSync(join(fixture.run, sem.SEMANTIC_PATH), 'utf8'));
  for (const row of previous.subjects) assert(readFileSync(join(reserved, row.subject_path)).equals(readFileSync(join(fixture.run, row.subject_path))));
});
for (const version of ['1.7.0-provisional', '1.8.0-provisional']) test(`${version} keeps S3 PKT refusal`, () => {
  const model = loadRun(reserved); model.manifest!.runFormatVersion = version;
  assert(relations.relationProposalProblems(model, relation, true, subject).some((p) => p.includes('CC source')));
}, 'adversarial');
test('caller exception flag is rejected by the closed subject schema', () => {
  assert.throws(() => sem.validateSemanticSubject({ ...subject, allow_s3_pkt_relation: true }, loadRun(reserved)));
}, 'adversarial');
test('worker-authored exception flag is rejected by the return contract', () => {
  const returned = json(fixture.run, `control/worker-returns/${fixture.call}/raw.json`);
  returned.allow_s3_pkt_relation = true;
  const basis = json(fixture.captured, capturePath).basis;
  assert.equal(sem.validateSemanticReturn('extractor', '1.9.0-provisional', returned,
    sem.packetWideningProducerView(loadRun(fixture.run), basis).context).result, 'FAIL');
}, 'adversarial');
test('reloading retained bytes reconstructs identical eligibility', () => {
  const reopened = JSON.parse(readFileSync(join(reserved, row.subject_path), 'utf8'));
  sem.validateSemanticSubject(reopened, loadRun(reserved));
  assert.deepEqual(problems(reserved, relation, reopened), []);
});
test('repeated selection creates no duplicate subject or packet', () => {
  const first = core.selectNextWork(loadRun(reserved), execution), second = core.selectNextWork(loadRun(reserved), execution);
  assert.deepEqual(first, second); assert.equal(ledger.subjects.filter((s) => s.semantic_id === subject.semantic_id).length, 1);
  assert.equal(loadRun(reserved).packets.filter((p) => p.values.packetId === 'PKT-0703').length, 1);
});
for (const field of ['type', 'target_locator', 'source_id', 'owner_stage'] as const) refusal(`accepted relation ${field} mutation fails`, (_run, context) => {
  context.semantics.relation_proposals[0].subject[field] += '-changed';
});
refusal('accepted basis packet mutation fails', (_run, context) => { context.semantics.relation_proposals[0].subject.basis_packet_ids = ['PKT-0701']; });
refusal('accepted producer invocation mutation fails', (_run, context) => { context.semantics.relation_proposals[0].subject.proposed_by += '-changed'; });
refusal('accepted relation review digest mutation fails', (_run, context) => { context.semantics.relation_proposals[0].review_subject_digest = `sha256:${'0'.repeat(64)}`; });
refusal('replayed work cannot acquire another semantic subject', (_run, context) => { context.semantic_id = 'SEM-9999'; });
refusal('accepted work journal mutation fails', (run) => {
  const journal = json(run, fixture.journal); journal.work_id = `WORK-${'0'.repeat(64)}`;
  write(run, fixture.journal, core.workJson(journal));
});
test('accepted relation omission fails retained raw semantic binding', () => {
  const run = join(root, 'omission'); cpSync(reserved, run, { recursive: true });
  const changed = structuredClone(subject); changed.semantics.relation_proposals = []; changed.relation_context = [];
  write(run, row.subject_path, sem.semanticJson(changed));
  assert.throws(() => sem.validateSemanticRun(loadRun(run)));
}, 'adversarial');
console.log(JSON.stringify({ result: 'PASS', runtime, passed: cases.length, total: cases.length,
  adversarial: cases.filter((c) => c.kind === 'adversarial').length, cases, scratch: root,
  scope: 'synthetic Core controls; work and journal fixtures are simulated; installed authentication/recovery is separate' }, null, 2));

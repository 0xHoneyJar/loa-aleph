#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  makeDuplicateFixture, makeDuplicateSuccessorFixture, closeDuplicateFixture,
  duplicateFixtureResult, duplicateFixtureSuccessorProposal,
  duplicateFixtureBase, duplicateFixtureDiscovery, duplicateFixtureProposal, duplicateFixtureReserve, duplicateFixtureReview, duplicateFixtureDecide,
} from './duplicate-fixture-support.ts';
import { loadRun } from './lib/run-model.ts';
import { semanticJson } from './lib/semantic-review.ts';
import { materialHash } from './lib/source-representation.ts';
import type { DuplicateTask } from './lib/duplicate-review.ts';
import type { WorkerJsonValue } from './lib/worker-return-contract.ts';

const runtime = process.argv.includes('--runtime');
const modulePath = (name: string): string => new URL(runtime ? `../runtime-js/scripts/${name}.js` : `./${name}.ts`, import.meta.url).href;
const core = await import(modulePath('lib/duplicate-review')) as typeof import('./lib/duplicate-review.ts');
const { validateRun } = await import(modulePath('validate-run')) as typeof import('./validate-run.ts');
const { validateWorkerReturnContract, contractExemplarToJsonSchema } = await import(modulePath('lib/worker-return-contract')) as typeof import('./lib/worker-return-contract.ts');
const temp = mkdtempSync(join(tmpdir(), 'aleph-duplicate-contracts-'));
const records: Array<{ id: string; result: 'PASS' | 'FAIL'; error?: string }> = [];
function test(id: string, fn: () => void): void {
  try { fn(); records.push({ id, result: 'PASS' }); }
  catch (error) { records.push({ id, result: 'FAIL', error: error instanceof Error ? error.message : String(error) }); }
}
function check(run: string): void {
  const r = validateRun({ run });
  assert.equal(r.result, 'PASS', JSON.stringify(r.checks.filter((c) => c.status === 'FAIL')));
  assert(r.checks.some((c) => c.id === 'K2.20' && c.status === 'PASS'));
}
try {
  const f = makeDuplicateFixture(join(temp, 'separate'));
  test('D8-C01 complete same-text distinct run preserves separate occurrences', () => {
    check(f.run);
    assert.equal(f.subject!.proposal.provenance_union.occurrences.length, 2);
    assert.notEqual(semanticJson(f.subject!.proposal.provenance_union.occurrences[0]), semanticJson(f.subject!.proposal.provenance_union.occurrences[1]));
    assert.deepEqual(f.subject!.proposal.member_ids, ['CC-0801', 'CC-0802']);
    assert.equal(loadRun(f.run).merges.length, 0);
  });
  test('D8-C02 all four worker contracts share strict native/fallback shapes and detached binding is not-checked', () => {
    const values: Record<DuplicateTask, unknown> = {
      discovery: { candidates: [], unresolved_findings: [], rationale: 'No synthetic candidate proposed.', flags: [] },
      comparison: { proposal: f.subject!.proposal, rationale: 'Synthetic comparison declaration.', flags: [] },
      refutation: duplicateFixtureResult(f.subject!),
      'contradiction-discovery': { verdict: 'upheld', rationale: 'Synthetic contradiction sweep only.', attacks_tried: ['Counter-reading.'],
        evidence_ids: [], candidate_evidence: [], missing_for_determination: null, flags: [], flagged_pairs: [] },
    };
    for (const [task, value] of Object.entries(values)) {
      const contract = core.duplicateOutputContract(task as DuplicateTask);
      assert.deepEqual(contractExemplarToJsonSchema(contract), core.duplicateReturnJsonSchema(task as DuplicateTask, '1.8.0-provisional'));
      const detached = core.validateDuplicateReturn(task as DuplicateTask, '1.8.0-provisional', value);
      assert.equal(detached.result, 'PASS', detached.errors.join('; ')); assert.equal(detached.binding, 'not-checked');
      assert.equal(validateWorkerReturnContract(semanticJson(value), contract).result, 'PASS');
      assert.equal(validateWorkerReturnContract(semanticJson({ ...value as object, unexpected: true }), contract).result, 'FAIL');
    }
  });
  test('D8-C03 bound comparison and refutation validate against actual complete basis', () => {
    const model = loadRun(f.run), basis = f.subject!.comparison_basis;
    const proposal = core.validateDuplicateReturn('comparison', '1.8.0-provisional',
      { proposal: f.subject!.proposal, rationale: 'Synthetic comparison.', flags: [] }, { model, basis });
    assert.equal(proposal.result, 'PASS', proposal.errors.join('; ')); assert.equal(proposal.binding, 'checked');
    const review = core.validateDuplicateReturn('refutation', '1.8.0-provisional', duplicateFixtureResult(f.subject!), { model, subject: f.subject });
    assert.equal(review.result, 'PASS', review.errors.join('; ')); assert.equal(review.binding, 'checked');
  });
  test('D8-C04 same text with coherent cannot-determine remains structurally valid', () => {
    const unknown = makeDuplicateFixture(join(temp, 'unknown'), { outcome: 'CANNOT_DETERMINE' });
    check(unknown.run); assert.equal(core.duplicateAdmissionProblems(unknown.subject!, 'upheld').length > 0, true);
  });
  for (const second of ['upheld', 'refuted', 'cannot-determine'] as const) test(`D8-C05 conditional round two ${second}`, () => {
    const unknown = makeDuplicateFixture(join(temp, `round2-${second}`), { verdict: 'cannot-determine', second });
    closeDuplicateFixture(unknown); check(unknown.run);
    assert.equal(unknown.ledger.decisions[0].verdict, second === 'refuted' ? 'refuted' : 'cannot-determine');
    assert.equal(unknown.ledger.assignments.length, 2); assert.equal(loadRun(unknown.run).merges.length, 0);
  });
  test('D8-C06 eligible successor uses new identity with exact occurrence union and independent L2S', () => {
    const canonical = makeDuplicateSuccessorFixture(join(temp, 'canonical'));
    closeDuplicateFixture(canonical); check(canonical.run);
    assert.equal(canonical.ledger.assignments.length, 1);
    assert.equal(canonical.ledger.effects[0].successor_id, 'CC-0803');
    assert.equal(canonical.ledger.effects[0].semantic_id, 'SEM-0803');
    assert.equal(core.duplicateProposalState(canonical.ledger, 'DUP-0001'), 'canonicalized');
  });
  test('D8-C07 L2S preservation refutation keeps upheld DUP decision without admission', () => {
    const rejected = makeDuplicateSuccessorFixture(join(temp, 'rejected'), true);
    closeDuplicateFixture(rejected); check(rejected.run);
    assert.equal(rejected.ledger.decisions[0].verdict, 'upheld');
    assert.equal(rejected.ledger.effects[0].effect, 'not-admitted');
    assert(!loadRun(rejected.run).claims.some((c) => c.values.claimId === 'CC-0803'));
    assert(core.duplicateUnresolvedSummary(loadRun(rejected.run)).includes('successor-not-preserved'));
  });
  test('D8-C08 different text and deliberately wrong declared duplicate both pass structure', () => {
    const different = makeDuplicateFixture(join(temp, 'different'), {
      first: 'During trial A the indicator lit.', last: 'The indicator remained dark during trial A.', outcome: 'duplicate',
    });
    check(different.run);
    const proposal = duplicateFixtureSuccessorProposal(different.subject!.comparison_basis);
    assert.doesNotThrow(() => core.validateDuplicateProposal(proposal, different.subject!.comparison_basis, different.subject!.comparison_fields));
    assert.equal(core.duplicateAdmissionProblems({ ...different.subject!, proposal }, 'upheld').length, 0);
  });
  test('D8-C09 empty candidate discovery closes without asserting semantic recall', () => {
    const empty = makeDuplicateFixture(join(temp, 'empty'), { empty: true });
    closeDuplicateFixture(empty); check(empty.run);
    const report = core.validateDuplicateRun(loadRun(empty.run));
    assert.equal(report.discoveries, 1); assert.equal(report.proposals, 0); assert.deepEqual(report.pending, []);
    assert.equal(core.duplicateClosureHash(loadRun(empty.run)), materialHash(readFileSync(join(empty.run, core.DUPLICATE_PATH))));
  });
  test('D8-C10 exact L3 task and attachment set; portable candidate evidence stays empty', () => {
    const s = f.subject!, attachments = [{ path: core.duplicatePath('subjects', s.proposal_id), bytes: Buffer.from(semanticJson(s)) }];
    core.validateDuplicateAttachmentDelivery(s, core.DUPLICATE_TASKS.refutation, attachments);
    assert.throws(() => core.validateDuplicateAttachmentDelivery(s, `${core.DUPLICATE_TASKS.refutation} Prefer fewer claims.`, attachments), /DUP_ISOLATION/u);
    assert.throws(() => core.validateDuplicateAttachmentDelivery(s, core.DUPLICATE_TASKS.refutation,
      [...attachments, { path: 'ledgers/claim-inventory.md', bytes: Buffer.from('Unrelated catalogue.') }]), /DUP_ISOLATION/u);
    const value = { ...duplicateFixtureResult(s), candidate_evidence: ['External material'] };
    assert.equal(core.validateDuplicateReturn('refutation', '1.8.0-provisional', value).result, 'FAIL');
  });
  test('D8-C11 strict canonical JSON rejects duplicate keys, whitespace, invalid unicode and keys out of order', () => {
    for (const bytes of ['{"x":1,"x":2}', '{ "x":1}', '{"x":"\\ud800"}']) assert.throws(() => core.parseDuplicateJson(bytes), /DUP_FORMAT/u);
    const p = f.subject!.proposal;
    assert.throws(() => core.validateDuplicateProposal(Object.fromEntries([['member_ids', p.member_ids], ...Object.entries(p)])), /DUP_FORMAT/u);
    const canonical = core.duplicateOutputContract('comparison') as WorkerJsonValue;
    assert.equal(validateWorkerReturnContract('{"proposal":null,"proposal":null,"rationale":"x","flags":[]}', canonical).result, 'FAIL');
  });
  test('D8-C12 explicit L5 pair requires new discovery and cannot disappear before C1', () => {
    const seeded = duplicateFixtureBase(join(temp, 'l5-seed'));
    const first = duplicateFixtureDiscovery(seeded, [], '0001', { flaggedPairs: [{ a: 'CC-0801', b: 'CC-0802', why: 'Synthetic pair needing comparison.' }] });
    assert(core.validateDuplicateRun(loadRun(seeded.run)).pending.some((p) => p.includes('flagged_pairs/0')));
    const [path, digest] = first.sweep_refs[0].result_ref.split('@');
    duplicateFixtureDiscovery(seeded, [], '0002', { seededCandidates: [{ candidate_id: 'G1', member_ids: ['CC-0801', 'CC-0802'],
      basis_refs: [`${path}#/flagged_pairs/0@${digest}`], signal: 'semantic-proposal' }] });
    const proposal = duplicateFixtureProposal(core.buildComparisonBasis(loadRun(seeded.run), ['CC-0801', 'CC-0802']), 'distinct', 'DCD-0002/G1');
    duplicateFixtureReserve(seeded, proposal);
    duplicateFixtureDecide(seeded, [duplicateFixtureReview(seeded)]);
    closeDuplicateFixture(seeded); check(seeded.run);
    assert.deepEqual(core.validateDuplicateRun(loadRun(seeded.run)).pending, []);
  });
} finally { rmSync(temp, { recursive: true, force: true }); }
const report = { result: records.every((r) => r.result === 'PASS') ? 'PASS' : 'FAIL', records };
console.log(JSON.stringify(report, null, process.argv.includes('--json') ? 2 : undefined));
process.exitCode = report.result === 'PASS' ? 0 : 1;

#!/usr/bin/env node
/** Real internal transport/writer with fixture callbacks; no native model calls. */
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import { materialHash, readRepresentationContext, representationUseDigest, representationUsesMarkdown, type MaterialRow } from '../../../scripts/lib/source-representation.ts';
import {
  buildSemanticSubject, parseSemanticLedger, semanticJson, semanticLedgerMarkdown, semanticSubjectPath,
  semanticAssignmentPath, semanticResultPath, semanticOriginProjection, semanticMaterialViews, semanticProducerBinding,
  semanticProducerSelections, semanticProducerView, semanticProducerViewPaths, semanticProducerTask, semanticStageSeal,
  SEMANTIC_PATH, SEMANTIC_TASK, SEMANTIC_ASSIGNMENT_FORMAT, type SemanticSubject, type SemanticAssignment, type SemanticEntry,
} from '../../../scripts/lib/semantic-review.ts';
import {
  buildComparisonBasis, buildDuplicateDiscovery, buildDuplicateSubject, duplicateClosureHash, duplicateLedgerMarkdown,
  duplicatePath, duplicateProducerBinding, duplicateProducerPaths, duplicateProducerView, duplicateQuorum,
  emptyDuplicateLedger, DUPLICATE_PATH, DUPLICATE_TASKS, DUPLICATE_ASSIGNMENT_FORMAT, DUPLICATE_EFFECT_FORMAT,
  parseDuplicateLedger, duplicateAdmissionProblems,
  type DuplicateSubject, type DuplicateAssignment, type DuplicateEffect, type DuplicateOperation, type DuplicateResult,
} from '../../../scripts/lib/duplicate-review.ts';
import { duplicateFixtureResult, duplicateFixtureProposal, duplicateFixtureDiscovery, duplicateFixtureSuccessorProposal, duplicateFixtureWorkingContext, closeDuplicateFixture, makeDuplicateFixture,
  makeDuplicateSuccessorFixture, duplicateFixtureWrite, type DuplicateFixture } from '../../../scripts/duplicate-fixture-support.ts';
import { fixtureResult, fixtureCompanion, fixtureTable, writeFixtureFile } from '../../../scripts/semantic-fixture-support.ts';
import type { ValidatedWorkerReturn } from '../src/worker-return.ts';
import type { JsonValue, LoaRoleId } from '../src/types.ts';

const runtime = process.argv.includes('--runtime'), temp = mkdtempSync(join(tmpdir(), 'aleph-duplicate-process-'));
const recoveryNode = runtime && process.env.DUPLICATE_NODE20 || process.execPath;
const adapterModule = (name: string): string => new URL(runtime ? `../../../runtime-js/adapters/loa/src/${name}.js` : `../src/${name}.ts`, import.meta.url).href;
const { verifyAndLoadLoaBundle } = await import(adapterModule('core-loader')) as typeof import('../src/core-loader.ts');
const { loadLoaProfile, defaultProfilePath, validateResolvedHost } = await import(adapterModule('runtime-snapshot')) as typeof import('../src/runtime-snapshot.ts');
const { readRunState, writeRunState } = await import(adapterModule('run-control')) as typeof import('../src/run-control.ts');
const { assembleWorkerBundle, coreBlindPolicyReference, verifyWorkerBundle } = await import(adapterModule('worker-bundle')) as typeof import('../src/worker-bundle.ts');
const { dispatchLoaWorker } = await import(adapterModule('worker-dispatch')) as typeof import('../src/worker-dispatch.ts');
const { LedgerWriter, recoverPendingDuplicateTransactions } = await import(adapterModule('ledger-writer')) as typeof import('../src/ledger-writer.ts');
const { recoverPendingMaterialTransactions } = await import(adapterModule('ledger-writer')) as typeof import('../src/ledger-writer.ts');
const { validateWorkerReturn } = await import(adapterModule('worker-return')) as typeof import('../src/worker-return.ts');
const { validateRun } = await import(new URL(runtime ? '../../../runtime-js/scripts/validate-run.js' : '../../../scripts/validate-run.ts', import.meta.url).href) as typeof import('../../../scripts/validate-run.ts');
const { walkRegularFiles, inventoryTree, digestTreeRecords, stableJson, stableJsonBytes, makeTreeOwnerWritable, makeTreeReadOnly } = await import(adapterModule('fs')) as typeof import('../src/fs.ts');
const TIME = '2026-09-13T12:00:00.000Z', clock = { now: () => TIME };
const records: Array<{ id: string; result: string; evidence: string }> = [
  { id: 'D8-P01', result: 'NOT RUN', evidence: 'genuine native invocation requires separate authority' },
];
const mutations: Array<{ id: string; result: string; actual_tokens: string[] }> = [];
let run = join(temp, 'run');
const seed = spawnSync(process.execPath, [new URL('./test-semantic-review-process.ts', import.meta.url).pathname,
  `--duplicate-seed=${run}`, ...(runtime ? ['--runtime'] : [])], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
writeFixtureFile(temp, 'seed.log', `${seed.stdout}\n${seed.stderr}`);
assert.equal(seed.status, 0, seed.stderr || seed.stdout);
const bundle = verifyAndLoadLoaBundle(join(run, 'control/runtime/bundle'));
const profile = loadLoaProfile(defaultProfilePath(bundle.root));
const host = validateResolvedHost(JSON.parse(readFileSync(new URL('./fixtures/host-capabilities.json', import.meta.url), 'utf8')), profile.value, { allowSimulation: true });
let writer = new LedgerWriter(run, clock);
function pass(id: string, evidence: string): void {
  records.push({ id, result: 'PASS', evidence });
  writeFixtureFile(temp, 'progress.json', JSON.stringify(records, null, 2) + '\n');
}
const transactionCases: Array<{ operation: string; root: string; name: string; before: Record<string, Buffer | null>; state: Buffer; chain: Buffer }> = [];
function writableCopy(source: string, name: string): string {
  const target = join(temp, name); cpSync(source, target, { recursive: true });
  makeTreeOwnerWritable(target);
  return target;
}
function restoreFixture(snapshot: string): void {
  makeTreeOwnerWritable(run); rmSync(run, { recursive: true, force: true });
  cpSync(snapshot, run, { recursive: true }); makeTreeReadOnly(join(run, 'control/runtime'));
  writer = new LedgerWriter(run, clock);
}
function tracked(options: Parameters<InstanceType<typeof LedgerWriter>['executeDuplicateWrite']>[0]) {
  const before = Object.fromEntries(Object.keys(options.next).map((path) => [path, existsSync(join(run, path)) ? readFileSync(join(run, path)) : null]));
  const state = readFileSync(join(run, 'control/run-state.json')), chain = readFileSync(join(run, 'control/ledger-chain.jsonl'));
  const plan = writer.executeDuplicateWrite(options);
  const name = `TXN-duplicate-${materialHash(plan.key).slice(7)}.json`;
  if (!transactionCases.some((c) => c.operation === options.operation))
    transactionCases.push({ operation: options.operation, root: writableCopy(run, `checkpoint-${transactionCases.length}-${options.operation}`), name, before, state, chain });
  return plan;
}
function worker(callId: string, role: LoaRoleId, value: unknown, allowlist: string[], task: string, producerContext: string | null = null, transportFailure?: string) {
  const state = readRunState(run), coreRef = coreBlindPolicyReference(bundle, role, state.execution.stage, task);
  const withheld = walkRegularFiles(run).map((p) => relative(run, p)).filter((p) => !p.startsWith('control/') && !allowlist.includes(p))
    .map((selector) => ({ selector, core_ref: coreRef }));
  const sealed = assembleWorkerBundle({ bundle, runDir: run, callId, runId: state.run_id, stage: state.execution.stage, role,
    kind: role.startsWith('verifier-') ? 'refuter' : 'producer', allowlist, withheld, taskLine: task,
    modelIdentity: state.identity.models[role], producerContextId: producerContext });
  const dispatched = dispatchLoaWorker({ workerBundleRoot: sealed.root, returnRoot: join(run, 'control/worker-returns', callId), hostCapabilities: host,
    host: { invokeFreshContext(invocation) {
      assert.equal(invocation.inherit_context, false); assert.deepEqual(invocation.writable_paths, []);
      assert.equal(invocation.request.task_line, task);
      if (transportFailure) throw new Error(transportFailure);
      return { receipt: { format: 'aleph-loa-worker-dispatch/v1', call_id: callId, context_id: `CTX-${callId}`,
        producer_context_id: producerContext, fresh_context: true, inherited_context: false, filesystem: 'bundle-read-only',
        model_identity: invocation.model_identity, simulation: { kind: 'fixture-simulated' } }, structured_return: value as JsonValue };
    } } });
  assert(dispatched.validated, JSON.stringify(dispatched.report));
  return { ...dispatched, validated: dispatched.validated, root: sealed.root };
}
function normalize(number: string, origins: string[], duplicate?: DuplicateSubject, rejected = false) {
  const model = loadRun(run), stage = duplicate ? 'S4' : 'S3';
  const parents = origins.map((id) => JSON.parse(readFileSync(join(run, semanticSubjectPath(id)), 'utf8')) as SemanticSubject);
  const basis = parents[0], packets = [...new Set(parents.flatMap((p) => p.packet_basis.map((b) => b.packet_id)))];
  const callId = `CALL-NORMALIZE-${number}`, paths = semanticProducerViewPaths(callId);
  const selections = semanticProducerSelections(model, 'normalizer', stage, { origin_semantic_ids: origins, lineage_id: duplicate?.reservation?.lineage_id });
  const shown = semanticProducerView(model, 'normalizer', stage, selections);
  writeFixtureFile(run, paths.selections, semanticJson(selections)); writeFixtureFile(run, paths.view, shown.bytes);
  const normalized_claim = rejected ? 'The counter rose.' : duplicate?.proposal.successor_request?.proposed_claim || basis.semantics.units[0].proposition;
  const semantics = structuredClone(basis.semantics); semantics.units[0].proposition = normalized_claim;
  const anchors = basis.anchors.map(({ anchor_id, source_id, locator, start_byte, end_byte, exact_bytes_base64 }) =>
    ({ anchor_id, source_id, locator, start_byte, end_byte, exact_bytes_base64 }));
  const entry: SemanticEntry = { output_kind: 'claim-candidate', output_index: 0, review_mode: 'proposal',
    origin_unit_refs: parents.flatMap((p) => p.semantics.units.map((u) => `${p.semantic_id}/${u.unit_id}`)), anchors, semantics };
  const claim = { normalized_claim, packets, claim_type: 'factual', widen_requests: [], rationale: 'Synthetic successor expression for transport testing.',
    flags: [], material_use: basis.material_use };
  const value = { claims: [claim], no_claim_packets: [], lineage_proposals: [], material_findings: [], semantic_units: [entry] };
  const produced = worker(callId, 'normalizer', value, [paths.view], semanticProducerTask('normalizer', stage));
  const producer = { call_id: callId, context_id: produced.validated.contextId!, raw_return_hash: produced.validated.rawDigest,
    output_kind: 'claim-candidate', output_index: 0 };
  const producerPath = `control/worker-returns/${callId}/semantic-producer.json`;
  writeFixtureFile(run, producerPath, semanticJson(producer));
  const virtual = loadRun(run), material = readRepresentationContext(virtual), claimId = `CC-${number}`, semanticId = `SEM-${number}`, reviewId = `VER-${number}`;
  virtual.claims.push({ file: 'ledgers/claim-inventory.md', line: 0, raw: '', cells: [], values: {
    claimId, normalizedClaim: normalized_claim, packets: packets.join(', '), sources: 'SRC-701', claimType: 'factual',
    disposition: '', rationale: '', judgedBy: '', verified: '', status: 'active',
  } });
  const use: MaterialRow = { use_id: `USE-${number}`, owner_stage: stage, subject_kind: 'CC', subject_id: claimId,
    basis_packet_ids: semanticJson(packets), requirements: semanticJson(basis.material_use!.requirements), use_state: 'usable',
    fidelity_claim: 'none', limitation_refs: '[]', reason: 'none', established_by: callId, review_subject_digest: '', reviewed_by: 'none' };
  use.review_subject_digest = representationUseDigest(virtual, material, use);
  const claimInventory = readFileSync(join(run, 'ledgers/claim-inventory.md'), 'utf8')
    + fixtureTable(['claim_id', 'normalized claim', 'packets', 'sources', 'claim_type', 'disposition', 'rationale', 'judged_by', 'verified', 'status'],
      [[claimId, normalized_claim, packets.join(', '), 'SRC-701', 'factual', '', '', '', '', 'active']]).split('\n').slice(2).join('\n');
  const reserved = writer.reserveMaterialUse(produced.validated, use, () => ({ 'ledgers/claim-inventory.md': claimInventory }));
  const l2f = worker(`CALL-L2F-${number}`, 'verifier-l2f', { verdict: 'upheld', rationale: 'Synthetic material-use challenge only.',
    attacks_tried: ['Check supplied structure and byte support.'], evidence_ids: [use.review_subject_digest], candidate_evidence: [],
    missing_for_determination: null, flags: [] }, [reserved.review_path], 'Challenge the exact retained representation-use subject.', producer.context_id);
  const materialVerdict = `VER-9${number}`;
  writer.append(`verification/harness/${materialVerdict}.md`, l2f.validated, () => `# Verdict ${materialVerdict}\n\n`
    + fixtureTable(['field', 'value'], [['target', `representation-use-subject:${use.review_subject_digest}`], ['lens', 'L2F'], ['stage', stage],
      ['shown', reserved.review_path], ['withheld', 'Producer rationale and prior reviews.'], ['verdict', 'upheld'], ['consequence', 'Synthetic supplied-structure review only.']]));
  const subject = buildSemanticSubject(virtual, { semantic_id: semanticId, owner_stage: stage, subject_kind: 'claim', review_mode: 'proposal',
    predecessor_semantic_id: 'none', producer_binding_hash: semanticProducerBinding(producer), reviewer_profile: basis.reviewer_profile,
    output_binding: { kind: 'claim', reserved_claim_id: claimId, normalized_claim, packet_ids: packets, source_ids: ['SRC-701'], claim_type: 'factual' },
    origin_unit_refs: entry.origin_unit_refs, origin_context: parents.map(semanticOriginProjection), anchors, semantics: entry.semantics,
    material_use: basis.material_use, material_views: semanticMaterialViews(virtual, [use]), lineage_context: shown.context.successor ? [shown.context.successor] : [],
    relation_context: [], ambiguity_context: [] });
  const digest = materialHash(semanticJson(subject)), ledger = parseSemanticLedger(readFileSync(join(run, SEMANTIC_PATH), 'utf8'));
  const execute = (operation: 'reserve-subject' | 'assign-review' | 'record-review' | 'resolve' | 'admit', record_id: string, next: Record<string, string>, reviews: ValidatedWorkerReturn[] = []) =>
    writer.executeSemanticWrite({ producer: produced.validated, reviews, semantic_id: semanticId, subject_digest: digest, operation, record_id, next, prerequisite_paths: [] });
  ledger.subjects.push({ semantic_id: semanticId, owner_stage: stage, subject_kind: 'claim', subject_path: semanticSubjectPath(semanticId),
    subject_digest: digest, predecessor_semantic_id: 'none', producer_receipt_ref: `${producerPath}@${materialHash(semanticJson(producer))}` });
  execute('reserve-subject', semanticId, { [SEMANTIC_PATH]: semanticLedgerMarkdown(ledger), [semanticSubjectPath(semanticId)]: semanticJson(subject) });
  const assignment: SemanticAssignment = { format: SEMANTIC_ASSIGNMENT_FORMAT, semantic_id: semanticId, subject_digest: digest,
    review_id: reviewId, role: 'verifier-l2s', profile_digest: profile.digest, invocation_id: `CALL-L2S-${number}`,
    producer_binding_hash: subject.producer_binding_hash, execution_kind: 'fixture-simulated' };
  ledger.assignments.push({ review_id: reviewId, semantic_id: semanticId, assignment_path: semanticAssignmentPath(reviewId), assignment_digest: materialHash(semanticJson(assignment)) });
  execute('assign-review', reviewId, { [SEMANTIC_PATH]: semanticLedgerMarkdown(ledger), [semanticAssignmentPath(reviewId)]: semanticJson(assignment) });
  const result = fixtureResult(subject);
  if (rejected) {
    result.verdict = 'refuted';
    Object.assign(result.field_reviews[0], { verdict: 'refuted', issue: 'lost-condition',
      explanation: 'Synthetic preservation challenge: the expression omits the filter condition.' });
  }
  const l2s = worker(assignment.invocation_id, 'verifier-l2s', result, [semanticSubjectPath(semanticId)], SEMANTIC_TASK, producer.context_id);
  const evidence = `control/worker-returns/${assignment.invocation_id}/native-dispatch.json`;
  ledger.results.push({ review_id: reviewId, semantic_id: semanticId, result_path: semanticResultPath(reviewId), result_digest: materialHash(semanticJson(result)),
    execution_kind: 'fixture-simulated', execution_evidence_ref: `${evidence}@${materialHash(readFileSync(join(run, evidence)))}` });
  execute('record-review', reviewId, { [SEMANTIC_PATH]: semanticLedgerMarkdown(ledger), [semanticResultPath(reviewId)]: semanticJson(result),
    [`verification/harness/${stage}/${reviewId}.md`]: fixtureCompanion(subject, result) }, [l2s.validated]);
  ledger.resolutions.push({ resolution_id: `SMR-${number}`, semantic_id: semanticId, outcome: rejected ? 'not-admitted' : 'admitted', review_ids: semanticJson([reviewId]),
    canonical_refs: semanticJson(rejected ? [] : [claimId]), origin_unit_refs: semanticJson(entry.origin_unit_refs), followup_semantic_ids: '[]' });
  const next = { [SEMANTIC_PATH]: semanticLedgerMarkdown(ledger), 'ledgers/claim-inventory.md': claimInventory,
    'ledgers/representation-uses.md': representationUsesMarkdown([...material.uses, { ...use, reviewed_by: materialVerdict }]) };
  if (rejected) execute('resolve', `SMR-${number}`, { [SEMANTIC_PATH]: next[SEMANTIC_PATH] }, [l2s.validated]);
  else if (!duplicate) execute('admit', `SMR-${number}`, next, [l2s.validated, l2f.validated]);
  return { subject, next, accepted: [produced.validated, l2s.validated, l2f.validated], producer: produced.validated };
}
const second = normalize('0802', ['SEM-0701']);
const semantic = parseSemanticLedger(readFileSync(join(run, SEMANTIC_PATH), 'utf8'));
const sealPath = 'verification/harness/semantic-stage-seals/S3.json', seal = semanticJson(semanticStageSeal(semantic, 'S3'));
writer.executeSemanticWrite({ producer: second.producer, reviews: [], semantic_id: 'none', subject_digest: materialHash(seal), operation: 'seal', record_id: 'S3',
  next: { [sealPath]: seal, 'run-log.md': readFileSync(join(run, 'run-log.md'), 'utf8')
    + `\n## 2026-09-13 12:10 UTC — S3 — exit\n\nsemantic_stage: S3\nsemantic_review_seal_ref: ${sealPath}@${materialHash(seal)}\n` }, prerequisite_paths: [] });
const state = readRunState(run); state.execution.stage = 'S4'; writeRunState(run, state);
writer.append('run-log.md', second.producer, () => '\n## 2026-09-13 12:20 UTC — S4 — entry\n\nSynthetic duplicate process.\n');
let ledger = emptyDuplicateLedger();
const initial = duplicateLedgerMarkdown(ledger);
tracked({ accepted: [], proposal_id: 'none', subject_digest: materialHash(initial), operation: 'initialize', record_id: 'S4',
  next: { [DUPLICATE_PATH]: initial }, prerequisite_paths: [] });

const catalogueIds = ['CC-0702', 'CC-0802'];
function discovery(number: string, memberIds: string[], candidate: boolean) {
  const id = `CALL-DISCOVER-${number}`, paths = duplicateProducerPaths(id), model = loadRun(run);
  const view = duplicateProducerView(model, 'discovery', { member_ids: memberIds });
  writeFixtureFile(run, paths.selection, semanticJson({ member_ids: memberIds })); writeFixtureFile(run, paths.view, view.bytes);
  const candidates = candidate ? [{ member_ids: memberIds, basis_refs: memberIds.map((_, i) => `/catalogue/${i}`), signal: 'semantic-proposal' as const }] : [];
  const produced = worker(id, 'merge-judge', { candidates, unresolved_findings: [], rationale: 'Synthetic global candidate discovery only.', flags: [] },
    [paths.view], DUPLICATE_TASKS.discovery);
  const tuple = { call_id: id, context_id: produced.validated.contextId!, raw_return_hash: produced.validated.rawDigest, output_kind: 'duplicate-discovery', output_index: 0 };
  const receipt = `control/worker-returns/${id}/duplicate-producer.json`; writeFixtureFile(run, receipt, semanticJson(tuple));
  const l5id = `CALL-L5-${number}`, l5paths = duplicateProducerPaths(l5id), l5view = duplicateProducerView(model, 'contradiction-discovery', { member_ids: memberIds });
  writeFixtureFile(run, l5paths.selection, semanticJson({ member_ids: memberIds })); writeFixtureFile(run, l5paths.view, l5view.bytes);
  const sweep = { verdict: 'upheld', rationale: 'Synthetic independent contradiction sweep declaration.',
    attacks_tried: ['Search for incompatible readings of the shown claims.'], evidence_ids: [], candidate_evidence: [], missing_for_determination: null, flags: [], flagged_pairs: [] };
  const swept = worker(l5id, 'verifier-l5', sweep, [l5paths.view], DUPLICATE_TASKS['contradiction-discovery'], tuple.context_id);
  const reviewId = `VER-88${number}`, verPath = `verification/harness/S4/${reviewId}.md`;
  const companion = `# Verdict ${reviewId}\n\n` + fixtureTable(['field', 'value'], [['target', 'current-claim-catalogue'], ['lens', 'L5'], ['stage', 'S4'],
    ['shown', `${l5paths.view}@${materialHash(l5view.bytes)}`], ['withheld', 'Merge map, dispositions, discovery conclusions and prior reviews.'],
    ['verdict', 'upheld'], ['consequence', 'Fixture-simulated independent inventory sweep only.']]);
  writer.append(verPath, swept.validated, () => companion);
  const resultPath = `control/worker-returns/${l5id}/raw.json`;
  const d = buildDuplicateDiscovery(loadRun(run), { discovery_id: `DCD-${number}`,
    windows: [{ window_id: 'W1', member_ids: memberIds, shown_digest: materialHash(view.bytes), producer_binding_hash: duplicateProducerBinding(tuple),
      execution_evidence_ref: `${receipt}@${materialHash(semanticJson(tuple))}` }],
    candidates: candidates.map((c, i) => ({ candidate_id: `G${i + 1}`, ...c })), sweep_refs: [{ review_id: reviewId,
      verifier_ref: `${verPath}@${materialHash(companion)}`, result_ref: `${resultPath}@${materialHash(readFileSync(join(run, resultPath)))}`,
      window_member_ids: memberIds, shown_digest: materialHash(l5view.bytes) }], unresolved_findings: [] });
  const path = duplicatePath('discovery', d.discovery_id), bytes = semanticJson(d);
  ledger.discoveries.push({ discovery_id: d.discovery_id, record_path: path, record_digest: materialHash(bytes) });
  tracked({ accepted: [produced.validated, swept.validated], proposal_id: 'none', subject_digest: materialHash(bytes),
    operation: 'record-discovery', record_id: d.discovery_id, next: { [DUPLICATE_PATH]: duplicateLedgerMarkdown(ledger), [path]: bytes }, prerequisite_paths: [] });
  return d;
}
discovery('0001', catalogueIds, true);
const branchBase = writableCopy(run, 'conditional-review-base');
for (const [index, secondVerdict] of (['upheld', 'refuted', 'cannot-determine'] as const).entries()) {
  if (index) restoreFixture(branchBase);
  const branchLedger = parseDuplicateLedger(readFileSync(join(run, DUPLICATE_PATH), 'utf8'));
  const number = `10${index}1`, proposalId = `DUP-${number}`, callId = `CALL-UNKNOWN-${number}`, paths = duplicateProducerPaths(callId);
  const view = duplicateProducerView(loadRun(run), 'comparison', { candidate_ref: 'DCD-0001/G1' });
  writeFixtureFile(run, paths.selection, semanticJson({ candidate_ref: 'DCD-0001/G1' })); writeFixtureFile(run, paths.view, view.bytes);
  const proposal = duplicateFixtureProposal(buildComparisonBasis(loadRun(run), catalogueIds), 'duplicate');
  const produced = worker(callId, 'merge-judge', { proposal, rationale: 'Synthetic indeterminate comparison sequence.', flags: [] }, [paths.view], DUPLICATE_TASKS.comparison);
  const tuple = { call_id: callId, context_id: produced.validated.contextId!, raw_return_hash: produced.validated.rawDigest, output_kind: 'duplicate-proposal', output_index: 0 };
  const receiptPath = `control/worker-returns/${callId}/duplicate-producer.json`; writeFixtureFile(run, receiptPath, semanticJson(tuple));
  const subject = buildDuplicateSubject(loadRun(run), { proposal_id: proposalId, predecessor_proposal_id: null,
    producer_binding_hash: duplicateProducerBinding(tuple), proposal, reservation: null,
    reviewer_profile: { profile_id: profile.value.id, profile_digest: profile.digest, role: 'verifier-l3', model_identity: state.identity.models['verifier-l3'] as never } });
  const subjectPath = duplicatePath('subjects', proposalId), digest = materialHash(semanticJson(subject));
  branchLedger.proposals.push({ proposal_id: proposalId, subject_path: subjectPath, subject_digest: digest, predecessor_proposal_id: 'none',
    producer_receipt_ref: `${receiptPath}@${materialHash(semanticJson(tuple))}` });
  const accepted: ValidatedWorkerReturn[] = [produced.validated];
  const apply = (operation: DuplicateOperation, record_id: string, next: Record<string, string>) => tracked({ accepted, proposal_id: proposalId,
    subject_digest: digest, operation, record_id, next, prerequisite_paths: [] });
  apply('reserve-subject', proposalId, { [DUPLICATE_PATH]: duplicateLedgerMarkdown(branchLedger), [subjectPath]: semanticJson(subject) });
  const rounds: Array<{ assignment: DuplicateAssignment; result: DuplicateResult }> = [];
  for (const round of [1, 2] as const) {
    const reviewId = `VER-${number}${round}`, invocationId = `CALL-L3-${number}-${round}`, result = duplicateFixtureResult(subject, round === 1 ? 'cannot-determine' : secondVerdict);
    const assignment: DuplicateAssignment = { format: DUPLICATE_ASSIGNMENT_FORMAT, proposal_id: proposalId, subject_digest: digest, review_id: reviewId,
      role: 'verifier-l3', profile_digest: profile.digest, invocation_id: invocationId, producer_binding_hash: subject.producer_binding_hash,
      round, execution_kind: 'fixture-simulated' };
    const assignmentPath = duplicatePath('assignments', reviewId);
    branchLedger.assignments.push({ review_id: reviewId, proposal_id: proposalId, assignment_path: assignmentPath, assignment_digest: materialHash(semanticJson(assignment)) });
    apply('assign-review', reviewId, { [DUPLICATE_PATH]: duplicateLedgerMarkdown(branchLedger), [assignmentPath]: semanticJson(assignment) });
    if (index === 0 && round === 1) {
      const before = writableCopy(run, 'unreadable-transport-before');
      assert.throws(() => worker(invocationId, 'verifier-l3', result, [subjectPath], DUPLICATE_TASKS.refutation, tuple.context_id,
        'Fixture transport cannot read the complete supplied comparison closure.'), /cannot read.*comparison closure/u);
      assert.throws(() => writer.advanceSlice5ClosurePhase('S4-C1-relations-closed'), /DUP_ACCOUNTING/u);
      assert.equal(branchLedger.results.length, 0);
      writableCopy(run, 'unreadable-transport-quarantine');
      restoreFixture(before);
      pass('D8-P20', 'Actual sealed transport failure to read complete supplied context retains an unfinished assignment and blocks C1; no truncated or upheld result is substituted.');
    }
    const reviewed = worker(invocationId, 'verifier-l3', result, [subjectPath], DUPLICATE_TASKS.refutation, tuple.context_id);
    accepted.push(reviewed.validated);
    const evidence = `control/worker-returns/${invocationId}/native-dispatch.json`, resultPath = duplicatePath('results', reviewId);
    branchLedger.results.push({ review_id: reviewId, proposal_id: proposalId, result_path: resultPath, result_digest: materialHash(semanticJson(result)),
      execution_kind: 'fixture-simulated', execution_evidence_ref: `${evidence}@${materialHash(readFileSync(join(run, evidence)))}` });
    const companion = `# Verdict ${reviewId}\n\n` + fixtureTable(['field', 'value'], [['target', `duplicate-review-subject:${digest}`],
      ['lens', 'L3'], ['stage', 'S4'], ['shown', subjectPath], ['withheld', 'Producer rationale, previous reviews and unrelated inventory.'],
      ['verdict', result.verdict], ['consequence', 'Fixture-simulated indeterminacy remains blocking.']]);
    apply('record-review', reviewId, { [DUPLICATE_PATH]: duplicateLedgerMarkdown(branchLedger), [resultPath]: semanticJson(result),
      [`verification/harness/S4/${reviewId}.md`]: companion });
    rounds.push({ assignment, result });
  }
  const quorum = duplicateQuorum(rounds), decisionId = `DDR-${number}`, effectId = `DUE-${number}`;
  assert.equal(quorum.verdict, secondVerdict === 'refuted' ? 'refuted' : 'cannot-determine');
  assert(duplicateAdmissionProblems(subject, quorum.verdict).length);
  branchLedger.decisions.push({ decision_id: decisionId, proposal_id: proposalId, review_ids: semanticJson(quorum.review_ids),
    verdict: quorum.verdict!, reviewed_outcome: 'none' });
  apply('decide', decisionId, { [DUPLICATE_PATH]: duplicateLedgerMarkdown(branchLedger) });
  const effect: DuplicateEffect = { format: DUPLICATE_EFFECT_FORMAT, effect_id: effectId, proposal_id: proposalId, subject_digest: digest,
    decision_id: decisionId, effect: secondVerdict === 'refuted' ? 'not-admitted' : 'kept-separate',
    reason: secondVerdict === 'refuted' ? 'refuted-proposal' : 'unresolved-equivalence', semantic_ids: [], lineage_id: null, successor_id: null,
    merge_row_digest: null, provenance_union_digest: materialHash(semanticJson(proposal.provenance_union)), predecessor_proposal_id: null };
  const effectPath = duplicatePath('effects', effectId);
  branchLedger.effects.push({ effect_id: effectId, proposal_id: proposalId, decision_id: decisionId, effect: effect.effect, semantic_id: 'none',
    lineage_id: 'none', successor_id: 'none', record_ref: `${effectPath}@${materialHash(semanticJson(effect))}` });
  apply('record-effect', effectId, { [DUPLICATE_PATH]: duplicateLedgerMarkdown(branchLedger), [effectPath]: semanticJson(effect) });
  assert.equal(validateRun({ run }).result, 'PASS');
  writableCopy(run, `conditional-review-${secondVerdict}`);
}
restoreFixture(join(temp, 'conditional-review-upheld')); ledger = parseDuplicateLedger(readFileSync(join(run, DUPLICATE_PATH), 'utf8'));
{
  const copy = writableCopy(join(temp, 'conditional-review-upheld'), 'reviewer-context-reuse');
  const ledger = parseDuplicateLedger(readFileSync(join(copy, DUPLICATE_PATH), 'utf8'));
  const assignments = ledger.assignments.map((r) => JSON.parse(readFileSync(join(copy, r.assignment_path), 'utf8')) as DuplicateAssignment);
  const firstPath = `control/worker-returns/${assignments[0].invocation_id}/native-dispatch.json`;
  const secondPath = `control/worker-returns/${assignments[1].invocation_id}/native-dispatch.json`;
  const first = JSON.parse(readFileSync(join(copy, firstPath), 'utf8')), second = JSON.parse(readFileSync(join(copy, secondPath), 'utf8'));
  second.receipt.context_id = first.receipt.context_id;
  writeFixtureFile(copy, secondPath, JSON.stringify(second));
  ledger.results[1].execution_evidence_ref = `${secondPath}@${materialHash(readFileSync(join(copy, secondPath)))}`;
  writeFixtureFile(copy, DUPLICATE_PATH, duplicateLedgerMarkdown(ledger));
  assert.throws(() => validateWorkerReturn({ workerBundleRoot: join(copy, 'control/worker-bundles', assignments[1].invocation_id),
    returnRoot: join(copy, 'control/worker-returns', assignments[1].invocation_id), dispatchReceipt: second.receipt,
    raw: JSON.parse(readFileSync(join(copy, ledger.results[1].result_path), 'utf8')) }), /DUP_ISOLATION/u);
  pass('D8-P06', 'A retained fixture dispatch receipt reusing the first reviewer context is refused by actual sealed return acceptance.');
}
// A new existing Slice 5 working search basis is static scenario input, not a
// claimed human/model search execution. It changes the legal frozen closure.
const previousSubject = readFileSync(join(run, duplicatePath('subjects', 'DUP-1001')));
duplicateFixtureWorkingContext(run, catalogueIds[0]);
const proposal = duplicateFixtureSuccessorProposal(buildComparisonBasis(loadRun(run), catalogueIds));
const comparisonId = 'CALL-COMPARE-0001', comparisonPaths = duplicateProducerPaths(comparisonId);
const comparisonView = duplicateProducerView(loadRun(run), 'comparison', { candidate_ref: 'DCD-0001/G1' });
writeFixtureFile(run, comparisonPaths.selection, semanticJson({ candidate_ref: 'DCD-0001/G1' }));
writeFixtureFile(run, comparisonPaths.view, comparisonView.bytes);
const comparison = worker(comparisonId, 'merge-judge', { proposal, rationale: 'Synthetic reviewed comparison proposal.', flags: [] },
  [comparisonPaths.view], DUPLICATE_TASKS.comparison);
const producer = { call_id: comparisonId, context_id: comparison.validated.contextId!, raw_return_hash: comparison.validated.rawDigest,
  output_kind: 'duplicate-proposal', output_index: 0 };
const receipt = `control/worker-returns/${comparisonId}/duplicate-producer.json`;
writeFixtureFile(run, receipt, semanticJson(producer));
const subject = buildDuplicateSubject(loadRun(run), { proposal_id: 'DUP-0001', predecessor_proposal_id: 'DUP-1001', producer_binding_hash: duplicateProducerBinding(producer),
  proposal, reservation: { lineage_id: 'LIN-0803', successor_id: 'CC-0803', lineage_type: 'duplicate', predecessor_ids: catalogueIds },
  reviewer_profile: { profile_id: profile.value.id, profile_digest: profile.digest, role: 'verifier-l3', model_identity: state.identity.models['verifier-l3'] as never } });
const digest = materialHash(semanticJson(subject)), subjectPath = duplicatePath('subjects', subject.proposal_id);
const lineage = { lineage_id: 'LIN-0803', owner_stage: 'S4', type: 'duplicate', predecessors: catalogueIds.join(', '), successors: 'CC-0803',
  basis: 'Synthetic separately reviewed duplicate and successor preservation.', established_by: 'invocation:CALL-COMPARE-0001' };
ledger.proposals.push({ proposal_id: subject.proposal_id, subject_path: subjectPath, subject_digest: digest, predecessor_proposal_id: 'DUP-1001',
  producer_receipt_ref: `${receipt}@${materialHash(semanticJson(producer))}` });
const apply = (operation: DuplicateOperation, record_id: string, next: Record<string, string>, accepted: ValidatedWorkerReturn[] = []) =>
  tracked({ accepted: [comparison.validated, ...accepted], proposal_id: subject.proposal_id, subject_digest: digest,
    operation, record_id, next, prerequisite_paths: [] });
apply('reserve-subject', subject.proposal_id, { [DUPLICATE_PATH]: duplicateLedgerMarkdown(ledger), [subjectPath]: semanticJson(subject),
  'verification/harness/semantic-process/LIN-0803.json': semanticJson(lineage) });
const assignment: DuplicateAssignment = { format: DUPLICATE_ASSIGNMENT_FORMAT, proposal_id: subject.proposal_id, subject_digest: digest,
  review_id: 'VER-0811', role: 'verifier-l3', profile_digest: profile.digest, invocation_id: 'CALL-L3-0001', producer_binding_hash: subject.producer_binding_hash,
  round: 1, execution_kind: 'fixture-simulated' };
const assignmentPath = duplicatePath('assignments', assignment.review_id);
assert.throws(() => apply('decide', 'DDR-early', { [DUPLICATE_PATH]: duplicateLedgerMarkdown({
  ...ledger, decisions: [{ decision_id: 'DDR-0800', proposal_id: subject.proposal_id, review_ids: '[]', verdict: 'upheld', reviewed_outcome: 'duplicate' }],
}) }), /DUP_REVIEW|DUP_REFERENCE/u);
ledger.assignments.push({ review_id: assignment.review_id, proposal_id: subject.proposal_id, assignment_path: assignmentPath, assignment_digest: materialHash(semanticJson(assignment)) });
apply('assign-review', assignment.review_id, { [DUPLICATE_PATH]: duplicateLedgerMarkdown(ledger), [assignmentPath]: semanticJson(assignment) });
const result = duplicateFixtureResult(subject), l3 = worker(assignment.invocation_id, 'verifier-l3', result, [subjectPath], DUPLICATE_TASKS.refutation, producer.context_id);
const resultPath = duplicatePath('results', assignment.review_id), dispatchPath = `control/worker-returns/${assignment.invocation_id}/native-dispatch.json`;
ledger.results.push({ review_id: assignment.review_id, proposal_id: subject.proposal_id, result_path: resultPath, result_digest: materialHash(semanticJson(result)),
  execution_kind: 'fixture-simulated', execution_evidence_ref: `${dispatchPath}@${materialHash(readFileSync(join(run, dispatchPath)))}` });
const companion = `# Verdict ${assignment.review_id}\n\n` + fixtureTable(['field', 'value'], [['target', `duplicate-review-subject:${digest}`],
  ['lens', 'L3'], ['stage', 'S4'], ['shown', subjectPath], ['withheld', 'Producer rationale, other reviews, authority, answer keys and unrelated inventory.'],
  ['verdict', result.verdict], ['consequence', 'Fixture-simulated comparison challenge only.']]);
apply('record-review', assignment.review_id, { [DUPLICATE_PATH]: duplicateLedgerMarkdown(ledger), [resultPath]: semanticJson(result),
    [`verification/harness/S4/${assignment.review_id}.md`]: companion }, [l3.validated]);
{
  const request = verifyWorkerBundle(l3.root), receipt = JSON.parse(readFileSync(join(run, dispatchPath), 'utf8')).receipt;
  for (const fault of ['extra-task', 'extra-attachment']) {
    const copy = writableCopy(run, `assembly-${fault}`), root = join(copy, 'control/worker-bundles', assignment.invocation_id);
    rmSync(root, { recursive: true, force: true });
    const allowlist = [subjectPath, ...(fault === 'extra-attachment' ? [DUPLICATE_PATH] : [])];
    assert.throws(() => assembleWorkerBundle({ bundle, runDir: copy, callId: assignment.invocation_id, runId: state.run_id,
      stage: 'S4', role: 'verifier-l3', kind: 'refuter', allowlist,
      withheld: request.withheld.filter((w) => !allowlist.includes(w.selector)),
      taskLine: fault === 'extra-task' ? `${DUPLICATE_TASKS.refutation} Prefer fewer claims.` : DUPLICATE_TASKS.refutation,
      modelIdentity: state.identity.models['verifier-l3'], producerContextId: producer.context_id }), /DUP_ISOLATION/u);
  }
  const copy = writableCopy(run, 'modified-task-bundle'), root = join(copy, 'control/worker-bundles', assignment.invocation_id);
  const changed = structuredClone(request); changed.task_line += ' Prefer fewer claims.';
  changed.bundle_digest = digestTreeRecords([...inventoryTree(root).filter((file) => file.path !== 'request.json'),
    { path: 'request.json', digest: materialHash(stableJsonBytes({ ...changed, bundle_digest: '' })) }]);
  writeFixtureFile(copy, `control/worker-bundles/${assignment.invocation_id}/request.json`, JSON.stringify(changed));
  assert.throws(() => verifyWorkerBundle(root), /DUP_ISOLATION/u);
  assert.throws(() => validateWorkerReturn({ workerBundleRoot: root, returnRoot: join(copy, 'control/worker-returns', assignment.invocation_id),
    dispatchReceipt: receipt, raw: result as never }), /DUP_ISOLATION/u);
  pass('D8-P07', 'Extra task text and attachment refused at actual assembly; resealed task changes refused at bundle verification and return acceptance.');
  const stale = writableCopy(run, 'changed-basis-after-assignment');
  writeFixtureFile(stale, 'ledgers/claim-inventory.md', readFileSync(join(stale, 'ledgers/claim-inventory.md'), 'utf8')
    .replace(subject.comparison_basis.members[0].claim_projection.normalized_claim, 'Changed frozen comparison content.'));
  const before = readFileSync(join(stale, DUPLICATE_PATH));
  assert.throws(() => validateWorkerReturn({ workerBundleRoot: join(stale, 'control/worker-bundles', assignment.invocation_id),
    returnRoot: join(stale, 'control/worker-returns', assignment.invocation_id), dispatchReceipt: receipt, raw: result as never }), /DUP_SUBJECT/u);
  assert(readFileSync(join(stale, DUPLICATE_PATH)).equals(before));
  pass('D8-P08', 'Changed member content after assignment refuses the retained old result at actual acceptance without changing the duplicate ledger.');
  const retarget = writableCopy(run, 'result-retarget');
  const returned = { ...result, subject_digest: materialHash('different immutable comparison') };
  const retargetBefore = readFileSync(join(retarget, DUPLICATE_PATH));
  const refused = validateWorkerReturn({ workerBundleRoot: join(retarget, 'control/worker-bundles', assignment.invocation_id),
    returnRoot: join(retarget, 'control/worker-returns', assignment.invocation_id), dispatchReceipt: receipt, raw: returned as never });
  assert.equal(refused.report.result, 'FAIL');
  assert.equal(refused.validated, null);
  assert(refused.report.errors.some((error) => error.includes('DUP_SUBJECT')));
  assert(readFileSync(join(retarget, DUPLICATE_PATH)).equals(retargetBefore));
  pass('D8-P09', 'Retargeted result explicitly FAILs with DUP_SUBJECT, no validated return and no canonical duplicate mutation.');
  assert.deepEqual(request.allowlist.map((a) => a.run_path), [subjectPath]);
  assert(!readFileSync(join(l3.root, request.allowlist[0].attachment_path)).includes('WITHHELD-CANARY'));
  assert.notEqual(materialHash(comparisonView.bytes), digest);
  assert(!request.allowlist.some((a) => a.run_path === duplicateProducerPaths('CALL-DISCOVER-0001').view));
  pass('D8-P18', 'Actual discovery/comparison views differ from the exact sealed L3 subject; unrelated withheld canaries and global catalogue are absent from L3 attachments.');
}
{
  const copy = writableCopy(run, 'producer-context-reuse'), root = join(copy, 'control/worker-bundles', assignment.invocation_id);
  const receipt = JSON.parse(readFileSync(join(run, dispatchPath), 'utf8')).receipt;
  const before = readFileSync(join(copy, DUPLICATE_PATH));
  assert.throws(() => validateWorkerReturn({ workerBundleRoot: root, returnRoot: join(copy, 'control/worker-returns', assignment.invocation_id),
    dispatchReceipt: { ...receipt, context_id: producer.context_id }, raw: result as never }), /producer context/u);
  assert(readFileSync(join(copy, DUPLICATE_PATH)).equals(before));
  pass('D8-P05', 'Actual sealed return acceptance refuses a producer-context receipt before canonical write.');
}
const quorum = duplicateQuorum([{ assignment, result }]);
ledger.decisions.push({ decision_id: 'DDR-0001', proposal_id: subject.proposal_id, review_ids: semanticJson(quorum.review_ids),
  verdict: quorum.verdict!, reviewed_outcome: 'duplicate' });
apply('decide', 'DDR-0001', { [DUPLICATE_PATH]: duplicateLedgerMarkdown(ledger) }, [l3.validated]);
pass('D8-P02', 'Fixture callback used sealed discovery, comparison, assignment, fresh L3 dispatch, acceptance and canonical writer; labels remain fixture-simulated.');
{
  const before = writableCopy(run, 'successor-preservation-base');
  const failed = normalize('0803', ['SEM-0702', 'SEM-0802'], subject, true);
  const failure: DuplicateEffect = { format: DUPLICATE_EFFECT_FORMAT, effect_id: 'DUE-0001', proposal_id: subject.proposal_id, subject_digest: digest,
    decision_id: 'DDR-0001', effect: 'not-admitted', reason: 'successor-not-preserved', semantic_ids: ['SEM-0803'], lineage_id: null,
    successor_id: null, merge_row_digest: null, provenance_union_digest: materialHash(semanticJson(proposal.provenance_union)), predecessor_proposal_id: subject.predecessor_proposal_id };
  const path = duplicatePath('effects', failure.effect_id), branchLedger = structuredClone(ledger);
  branchLedger.effects.push({ effect_id: failure.effect_id, proposal_id: subject.proposal_id, decision_id: 'DDR-0001', effect: 'not-admitted',
    semantic_id: 'none', lineage_id: 'none', successor_id: 'none', record_ref: `${path}@${materialHash(semanticJson(failure))}` });
  apply('record-effect', failure.effect_id, { [DUPLICATE_PATH]: duplicateLedgerMarkdown(branchLedger), [path]: semanticJson(failure) }, [l3.validated, ...failed.accepted]);
  assert.equal(validateRun({ run }).result, 'PASS', JSON.stringify(validateRun({ run }).checks.filter((c) => c.status === 'FAIL')));
  assert(!loadRun(run).claims.some((c) => c.values.claimId === 'CC-0803'));
  assert.equal(branchLedger.decisions.find((r) => r.proposal_id === subject.proposal_id)!.verdict, 'upheld');
  writableCopy(run, 'successor-preservation-refuted');
  restoreFixture(before);
  pass('D8-P19', 'Actual synthetic normalizer/L2S dispatch, acceptance and writer retain preservation refutation and upheld DDR; no successor identity is admitted.');
}
const successor = normalize('0803', ['SEM-0702', 'SEM-0802'], subject);
const map = ['CC-0803', catalogueIds.join(', '), lineage.basis, 'SRC-701', 'restatement', 'active'];
const effect: DuplicateEffect = { format: DUPLICATE_EFFECT_FORMAT, effect_id: 'DUE-0001', proposal_id: subject.proposal_id, subject_digest: digest,
  decision_id: 'DDR-0001', effect: 'canonicalized', reason: 'reviewed-duplicate', semantic_ids: ['SEM-0803'], lineage_id: 'LIN-0803',
  successor_id: 'CC-0803', merge_row_digest: materialHash(semanticJson(map)), provenance_union_digest: materialHash(semanticJson(proposal.provenance_union)),
  predecessor_proposal_id: subject.predecessor_proposal_id };
const effectPath = duplicatePath('effects', effect.effect_id);
ledger.effects.push({ effect_id: effect.effect_id, proposal_id: subject.proposal_id, decision_id: 'DDR-0001', effect: 'canonicalized',
  semantic_id: 'SEM-0803', lineage_id: 'LIN-0803', successor_id: 'CC-0803', record_ref: `${effectPath}@${materialHash(semanticJson(effect))}` });
const admission = { ...successor.next, [DUPLICATE_PATH]: duplicateLedgerMarkdown(ledger), [effectPath]: semanticJson(effect),
  'ledgers/lineage.md': readFileSync(join(run, 'ledgers/lineage.md'), 'utf8') + `| ${Object.values(lineage).join(' | ')} |\n`,
  'ledgers/merge-map.md': '# Duplicate / Merge Map\n\n' + fixtureTable(['canonical', 'absorbs', 'basis', 'provenance retained', 'corroboration', 'status'], [map]) };
const before = Object.fromEntries(Object.keys(admission).map((path) => [path, existsSync(join(run, path)) ? readFileSync(join(run, path)) : null]));
assert.throws(() => apply('admit', effect.effect_id, admission, [l3.validated]), /DUP_ISOLATION/u);
for (const [path, bytes] of Object.entries(before)) assert(bytes === null ? !existsSync(join(run, path)) : readFileSync(join(run, path)).equals(bytes));
const plan = apply('admit', effect.effect_id, admission, [l3.validated, ...successor.accepted]);
assert(plan.writes.some((w) => w.path === DUPLICATE_PATH) && plan.writes.some((w) => w.path === SEMANTIC_PATH));
assert(readFileSync(join(run, duplicatePath('subjects', 'DUP-1001'))).equals(previousSubject));
assert.equal(ledger.decisions.find((r) => r.proposal_id === 'DUP-1001')!.verdict, 'cannot-determine');
pass('D8-P10', 'All three round-two branches used the identical sealed subject and remained blocking. A new static frozen working-context declaration required a new proposal, subject, fresh L3 and successor reviews through transport/writer; the earlier unknown and both results remain.');
pass('D8-P12', 'Missing accepted successor/L2S/L2F bindings refused without canonical changes; complete admission used one duplicate journal with semantic/material subplans.');
discovery('0002', ['CC-0803'], false);
{
  const callId = 'CALL-STALE-OVERLAP', paths = duplicateProducerPaths(callId);
  writeFixtureFile(run, paths.selection, semanticJson({ candidate_ref: 'DCD-0001/G1' }));
  writeFixtureFile(run, paths.view, comparisonView.bytes);
  const before = readFileSync(join(run, DUPLICATE_PATH)), coreRef = coreBlindPolicyReference(bundle, 'merge-judge', 'S4', DUPLICATE_TASKS.comparison);
  const withheld = walkRegularFiles(run).map((p) => relative(run, p)).filter((p) => !p.startsWith('control/') && p !== paths.view)
    .map((selector) => ({ selector, core_ref: coreRef }));
  assert.throws(() => assembleWorkerBundle({ bundle, runDir: run, callId, runId: state.run_id, stage: 'S4', role: 'merge-judge',
    kind: 'producer', allowlist: [paths.view], withheld, taskLine: DUPLICATE_TASKS.comparison, modelIdentity: state.identity.models['merge-judge'] }), /DUP_REFERENCE/u);
  assert(readFileSync(join(run, DUPLICATE_PATH)).equals(before));
  pass('D8-P16', 'Actual comparison assembly refuses an overlapping group whose predecessors were already consumed; canonical bytes stay unchanged.');
}
const currentReport = validateRun({ run });
assert.equal(currentReport.result, 'PASS', JSON.stringify(currentReport.checks.filter((c) => c.status === 'FAIL')));
let recoveredBoundaries = 0;
const recoveredOperations = new Set<string>();
for (const checkpoint of transactionCases) {
  if (recoveredOperations.has(checkpoint.operation)) continue;
  recoveredOperations.add(checkpoint.operation);
  const transaction = JSON.parse(readFileSync(join(checkpoint.root, 'control/transactions', checkpoint.name), 'utf8'));
  for (let partial = 0; partial <= transaction.plan.writes.length + 2; partial++) {
    const copy = writableCopy(checkpoint.root, `recover-${checkpoint.operation}-${recoveredBoundaries}`);
    writeFixtureFile(copy, `control/transactions/${checkpoint.name}`, semanticJson({ ...transaction, status: 'prepared' }));
    for (const [index, write] of transaction.plan.writes.entries()) if (index >= partial) {
      const bytes = checkpoint.before[write.path];
      if (bytes === null) rmSync(join(copy, write.path), { force: true }); else writeFixtureFile(copy, write.path, bytes);
    }
    if (partial <= transaction.plan.writes.length) writeFixtureFile(copy, 'control/ledger-chain.jsonl', checkpoint.chain);
    if (partial <= transaction.plan.writes.length + 1) writeFixtureFile(copy, 'control/run-state.json', checkpoint.state);
    const recovered = spawnSync(recoveryNode, ['--input-type=module', '-e',
      'const [m,r]=process.argv.slice(1);(await import(m)).recoverPendingDuplicateTransactions(r);', adapterModule('ledger-writer'), copy], { encoding: 'utf8' });
    assert.equal(recovered.status, 0, recovered.stderr);
    for (const write of transaction.plan.writes) assert(readFileSync(join(copy, write.path)).equals(Buffer.from(write.after_base64, 'base64')));
    assert(readFileSync(join(copy, 'control/run-state.json')).equals(readFileSync(join(checkpoint.root, 'control/run-state.json'))));
    recoverPendingDuplicateTransactions(copy); recoveredBoundaries++;
    rmSync(copy, { recursive: true, force: true });
  }
}
pass('D8-P13', `${recoveredBoundaries} fresh-process interruption boundaries recovered exactly once across retained duplicate operations and every composed admission write.`);
const admitted = transactionCases.find((c) => c.operation === 'admit')!;
const transaction = JSON.parse(readFileSync(join(admitted.root, 'control/transactions', admitted.name), 'utf8'));
for (const fault of ['preimage', 'lost-review', 'fork', 'journal-bytes']) {
  const copy = writableCopy(admitted.root, `refused-${fault}`);
  writeFixtureFile(copy, `control/transactions/${admitted.name}`, semanticJson({ ...transaction, status: 'prepared' }));
  if (fault === 'preimage') writeFixtureFile(copy, DUPLICATE_PATH, 'Changed preimage');
  if (fault === 'lost-review') rmSync(join(copy, `control/worker-returns/${assignment.invocation_id}/raw.json`));
  if (fault === 'fork') writeFixtureFile(copy, `control/transactions/TXN-duplicate-${'a'.repeat(64)}.json`, semanticJson({ ...transaction, status: 'prepared' }));
  if (fault === 'journal-bytes') writeFixtureFile(copy, `control/transactions/${admitted.name}`, semanticJson({ ...transaction, state_checkpoint: 'changed', status: 'prepared' }));
  const before = walkRegularFiles(copy).map((p) => [relative(copy, p), materialHash(readFileSync(p))]);
  assert.throws(() => recoverPendingDuplicateTransactions(copy), (error: unknown) => {
    const actual_tokens = [...new Set(String(error).match(/DUP_[A-Z]+/gu) || [])];
    assert(actual_tokens.some((token) => ['DUP_STATE', 'DUP_SUBJECT'].includes(token)));
    mutations.push({ id: `D8-M35-${fault}`, result: 'PASS', actual_tokens });
    return true;
  });
  assert.deepEqual(walkRegularFiles(copy).map((p) => [relative(copy, p), materialHash(readFileSync(p))]), before);
}
const retryBefore = walkRegularFiles(run).map((p) => [relative(run, p), materialHash(readFileSync(p))]);
writer.executeDuplicateWrite({ accepted: [comparison.validated, l3.validated, ...successor.accepted], proposal_id: subject.proposal_id,
  subject_digest: digest, operation: 'admit', record_id: effect.effect_id, next: admission, prerequisite_paths: [] });
assert.deepEqual(walkRegularFiles(run).map((p) => [relative(run, p), materialHash(readFileSync(p))]), retryBefore);
assert.throws(() => writer.executeDuplicateWrite({ accepted: [comparison.validated], proposal_id: subject.proposal_id,
  subject_digest: digest, operation: 'admit', record_id: effect.effect_id, next: { ...admission, [DUPLICATE_PATH]: admission[DUPLICATE_PATH] + '\n' },
  prerequisite_paths: [] }), (error: unknown) => {
  const actual_tokens = [...new Set(String(error).match(/DUP_[A-Z]+/gu) || [])];
  assert(actual_tokens.includes('DUP_STATE'));
  mutations.push({ id: 'D8-M35-idempotency-key', result: 'PASS', actual_tokens });
  return true;
});
pass('D8-P15', 'Completed exact retry after later discovery is a no-op; changed bytes, lost prerequisites, preimages and forked journals refuse before writing.');
// The existing relation/C2 semantic declarations are static fixture inputs.
// This proves the composed C1 persistence boundary, not relation production.
const closureInputs = writableCopy(run, 'static-closure-inputs');
closeDuplicateFixture({ run: closureInputs } as DuplicateFixture);
const staticState = readRunState(run);
let staticChain = readFileSync(join(run, 'control/ledger-chain.jsonl'), 'utf8');
const staticReceipts: unknown[] = [];
for (const path of ['ledgers/relations.md', 'ledgers/representation-uses.md', 'ledgers/internal-ambiguities.md',
  'verification/harness/S4/VER-0850.md']) {
  const before = existsSync(join(run, path)) ? readFileSync(join(run, path)) : Buffer.alloc(0), after = readFileSync(join(closureInputs, path));
  const receipt = { format: 'aleph-loa-ledger-receipt/v1', sequence: String(BigInt(staticState.ledger.sequence) + 1n), path,
    before_digest: materialHash(before), after_digest: materialHash(after), return_digest: materialHash('static-record: synthetic relation/C2 baseline'),
    previous_chain_digest: staticState.ledger.chain_head, writer: 'loa-orchestrator', written_at: TIME };
  const chain_digest = materialHash(stableJsonBytes(receipt));
  staticReceipts.push(receipt); staticChain += `${stableJson({ ...receipt, chain_digest })}\n`;
  staticState.ledger.sequence = receipt.sequence; staticState.ledger.chain_head = chain_digest;
  writeFixtureFile(run, path, after);
}
writeFixtureFile(run, 'control/ledger-chain.jsonl', staticChain); writeRunState(run, staticState);
writeFixtureFile(temp, 'static-relation-baseline.json', JSON.stringify({ execution_kind: 'static-record',
  notice: 'Synthetic relation/C2 rows and their consistent journal suffix are constructed fixture inputs. No accepted-return relation-production reachability is claimed.',
  receipts: staticReceipts }, null, 2) + '\n');
// Existing K2.16 admits canonical relation rows with the C1 barrier. Check the
// complete static after-image, then exercise the actual composite C1 write.
assert.equal(validateRun({ run: closureInputs }).result, 'PASS');
const c1Before = { log: readFileSync(join(run, 'run-log.md')), state: readFileSync(join(run, 'control/run-state.json')),
  chain: readFileSync(join(run, 'control/ledger-chain.jsonl')) };
writer.advanceSlice5ClosurePhase('S4-C1-relations-closed');
assert.equal(duplicateClosureHash(loadRun(run)), materialHash(readFileSync(join(run, DUPLICATE_PATH))));
const c1Name = `TXN-material-${materialHash(`representation-use-closure:${materialHash(readFileSync(join(run, 'ledgers/representation-uses.md')))}`).slice(7)}.json`;
const c1 = JSON.parse(readFileSync(join(run, 'control/transactions', c1Name), 'utf8'));
assert(c1.semantic_plan && c1.duplicate_plan);
let closureBoundaries = 0;
for (let partial = 0; partial <= 3; partial++) {
  const copy = writableCopy(run, `c1-recovery-${partial}`);
  writeFixtureFile(copy, `control/transactions/${c1Name}`, semanticJson({ ...c1, status: 'prepared' }));
  if (partial === 0) writeFixtureFile(copy, 'run-log.md', c1Before.log);
  if (partial <= 1) writeFixtureFile(copy, 'control/ledger-chain.jsonl', c1Before.chain);
  if (partial <= 2) writeFixtureFile(copy, 'control/run-state.json', c1Before.state);
  const recovered = spawnSync(recoveryNode, ['--input-type=module', '-e',
    'const [m,r]=process.argv.slice(1);(await import(m)).recoverPendingMaterialTransactions(r);', adapterModule('ledger-writer'), copy], { encoding: 'utf8' });
  assert.equal(recovered.status, 0, recovered.stderr);
  assert(readFileSync(join(copy, 'run-log.md')).equals(readFileSync(join(run, 'run-log.md'))));
  assert(readFileSync(join(copy, 'control/run-state.json')).equals(readFileSync(join(run, 'control/run-state.json'))));
  recoverPendingMaterialTransactions(copy); closureBoundaries++;
}
pass('D8-P14', `${closureBoundaries} C1 preparation/seal/chain/checkpoint boundaries recover one composed material/semantic/duplicate closure; relation/C2 rows and their journal suffix are explicitly static fixture inputs.`);
for (const path of [DUPLICATE_PATH, SEMANTIC_PATH, comparisonPaths.view, 'ledgers/lineage.md', 'ledgers/merge-map.md', 'ledgers/relations.md']) {
  const copy = writableCopy(run, `closed-refusal-${path.split('/').at(-1)}`);
  const before = readFileSync(join(copy, path));
  assert.throws(() => new LedgerWriter(copy, clock).append(path, comparison.validated, () => '\nAttempted post-C1 rewrite.\n'), /DUP_WINDOW|SEM_WINDOW|closed|C1|frozen|material/u);
  assert(readFileSync(join(copy, path)).equals(before));
}
writer.advanceSlice5ClosurePhase('S4-C2-ambiguities-finalized');
writer.advanceSlice5ClosurePhase('S4-C3-exit');
assert.equal(validateRun({ run }).result, 'PASS');
pass('D8-P17', 'C1-only resume preserves seals, refuses duplicate/semantic/REL rewrites and completes existing C2/C3 over explicitly static fixture declarations.');
{
  const manual = makeDuplicateFixture(join(temp, 'manual-declarations'), { verdict: 'cannot-determine', second: 'upheld' });
  assert.equal(validateRun({ run: manual.run }).result, 'PASS');
  assert.deepEqual(Object.keys(manual.subject!.reviewer_profile), ['profile_id', 'profile_digest', 'role', 'model_identity']);
  for (const fault of ['producer-actor', 'round2-actor', 'round2-pass']) {
    const copy = writableCopy(manual.run, `manual-${fault}`), ledger = parseDuplicateLedger(readFileSync(join(copy, DUPLICATE_PATH), 'utf8'));
    const first = JSON.parse(readFileSync(join(copy, ledger.results[0].execution_evidence_ref.split('@')[0]), 'utf8'));
    const row = ledger.results[fault === 'producer-actor' ? 0 : 1], path = row.execution_evidence_ref.split('@')[0];
    const evidence = JSON.parse(readFileSync(join(copy, path), 'utf8'));
    if (fault === 'producer-actor') evidence.reviewer_actor = evidence.producer_actor;
    if (fault === 'round2-actor') evidence.reviewer_actor = first.reviewer_actor;
    if (fault === 'round2-pass') evidence.reviewer_pass_id = first.reviewer_pass_id;
    writeFixtureFile(copy, path, semanticJson(evidence)); row.execution_evidence_ref = `${path}@${materialHash(semanticJson(evidence))}`;
    writeFixtureFile(copy, DUPLICATE_PATH, duplicateLedgerMarkdown(ledger));
    const report = validateRun({ run: copy });
    assert(report.checks.some((c) => c.id === 'K2.20' && c.status === 'FAIL' && c.message.includes('DUP_ISOLATION')));
  }
  pass('D8-P04', 'Synthetic manual actor/pass declarations pass; producer and conditional reviewer reuse fail. Actual human review NOT RUN; four-key profile is not independence evidence.');
  const staticFixture = makeDuplicateFixture(join(temp, 'static-record'));
  const arow = staticFixture.ledger.assignments[0], assignment = JSON.parse(readFileSync(join(staticFixture.run, arow.assignment_path), 'utf8'));
  assignment.execution_kind = 'static-record';
  writeFixtureFile(staticFixture.run, arow.assignment_path, semanticJson(assignment)); arow.assignment_digest = materialHash(semanticJson(assignment));
  const staticPath = 'verification/harness/duplicate-process/static-review.md';
  const bytes = readFileSync(join(staticFixture.run, 'verification/harness/S4/VER-0811.md'), 'utf8').replace('# Verdict VER-0811', '# Static fixture record');
  writeFixtureFile(staticFixture.run, staticPath, bytes);
  Object.assign(staticFixture.ledger.results[0], { execution_kind: 'static-record', execution_evidence_ref: `${staticPath}@${materialHash(bytes)}` });
  duplicateFixtureWrite(staticFixture);
  assert.equal(validateRun({ run: staticFixture.run }).result, 'PASS');
  const copy = writableCopy(run, 'agent-static-relabel'), ledger = parseDuplicateLedger(readFileSync(join(copy, DUPLICATE_PATH), 'utf8'));
  const row = ledger.assignments[0], a = JSON.parse(readFileSync(join(copy, row.assignment_path), 'utf8'));
  a.execution_kind = 'static-record'; writeFixtureFile(copy, row.assignment_path, semanticJson(a)); row.assignment_digest = materialHash(semanticJson(a));
  const companion = readFileSync(join(copy, `verification/harness/S4/${row.review_id}.md`), 'utf8').replace(/^# .*$/mu, '# Static fixture record');
  writeFixtureFile(copy, staticPath, companion);
  Object.assign(ledger.results[0], { execution_kind: 'static-record', execution_evidence_ref: `${staticPath}@${materialHash(companion)}` });
  writeFixtureFile(copy, DUPLICATE_PATH, duplicateLedgerMarkdown(ledger));
  assert(validateRun({ run: copy }).checks.some((c) => c.id === 'K2.20' && c.status === 'FAIL' && c.message.includes('DUP_ISOLATION')));
  pass('D8-P03', 'A static record passes only explicit fixture structure; the same evidence class cannot satisfy agent freshness.');
  const history = makeDuplicateSuccessorFixture(join(temp, 'failed-successor-history'), true);
  const oldSubject = readFileSync(join(history.run, duplicatePath('subjects', 'DUP-0001')));
  duplicateFixtureDiscovery(history, [['CC-0801', 'CC-0802']], '0002');
  makeDuplicateSuccessorFixture(history.run, false, { base: history, proposalNumber: '0002', predecessor: 'DUP-0001',
    successorNumber: '0805', wording: 'The indicator was lit during trial A.' });
  assert.equal(validateRun({ run: history.run }).result, 'PASS');
  assert(readFileSync(join(history.run, duplicatePath('subjects', 'DUP-0001'))).equals(oldSubject));
  assert.deepEqual(history.ledger.effects.map((e) => e.effect), ['not-admitted', 'canonicalized']);
  assert(readFileSync(join(history.run, duplicatePath('effects', 'DUE-0001')), 'utf8').includes('SEM-0803'));
  for (const verdict of ['upheld', 'refuted'] as const) {
    const retained = makeDuplicateFixture(join(temp, `historical-${verdict}`), { outcome: 'duplicate', verdict });
    const before = readFileSync(join(retained.run, duplicatePath('effects', 'DUE-0001')));
    assert(before.includes(Buffer.from(verdict === 'upheld' ? 'withdrawn-reservation' : 'refuted-proposal')));
    duplicateFixtureDiscovery(retained, [['CC-0801', 'CC-0802']], '0002');
    makeDuplicateSuccessorFixture(retained.run, false, { base: retained, proposalNumber: '0002', predecessor: 'DUP-0001' });
    assert.equal(validateRun({ run: retained.run }).result, 'PASS');
    assert(readFileSync(join(retained.run, duplicatePath('effects', 'DUE-0001'))).equals(before));
    assert.deepEqual(retained.ledger.effects.map((e) => e.effect), ['not-admitted', 'canonicalized']);
  }
  pass('D8-P11', 'Static fixture histories retain refuted, withdrawn and failed successor records beside later separately reviewed successes with new identities; no production reachability inferred.');
}
assert.deepEqual([...records.map((r) => r.id)].sort(), Array.from({ length: 20 }, (_, i) => `D8-P${String(i + 1).padStart(2, '0')}`));
if (runtime && process.env.DUPLICATE_NODE20) {
  const installed = join(run, 'control/runtime/bundle/runtime-js/scripts/validate-run.js');
  for (const target of [run, join(temp, 'agent-static-relabel')]) {
    const executed = spawnSync(recoveryNode, [installed, '--run', target, '--json'], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
    assert.equal(executed.status, target === run ? 0 : 1, executed.stderr);
    const source = spawnSync(process.execPath, [new URL('../../../scripts/validate-run.ts', import.meta.url).pathname,
      '--run', target, '--json'], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
    assert.equal(source.status, executed.status, source.stderr);
    assert.deepEqual(JSON.parse(executed.stdout), JSON.parse(source.stdout));
  }
}
const report = { result: 'PASS', records, mutations,
  evidence_directory: temp, native_model_calls: 0, recovered_boundaries: recoveredBoundaries, closure_boundaries: closureBoundaries };
writeFixtureFile(temp, 'report.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));

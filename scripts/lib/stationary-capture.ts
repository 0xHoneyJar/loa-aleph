import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { canonicalJsonBytes } from './bundle-format.ts';
import { hasRunCapability, type RunModel } from './run-model.ts';
import { parseStrictJson, type WorkerJsonValue } from './worker-return-contract.ts';
import { parseSemanticLedger, semanticJson, semanticProducerBinding, validateSemanticReturn, validateSemanticRun,
  type SemanticEntry, type SemanticSubject } from './semantic-review.ts';
import type { NextWork, WorkValue } from './work-transitions.ts';

export const STATIONARY_CAPTURES = 'verification/harness/stationary-captures/';
export const STATIONARY_HALTS = 'verification/harness/stationary-frontiers/';
export const STATIONARY_HALT = 'WORK_STATIONARY_FRONTIER';
const ORCHESTRATION = 'control/orchestration';
const WALK = 'ledgers/source-walk.md';
const SEMANTICS = 'ledgers/semantic-review.md';
const hash = (value: Buffer | string): string => `sha256:${createHash('sha256').update(value).digest('hex')}`;
const bytes = (model: RunModel, path: string): Buffer => readFileSync(join(model.runDir, path));
const same = (a: unknown, b: unknown): boolean => canonicalJsonBytes(a).equals(canonicalJsonBytes(b));
function requireStationary(value: unknown, reason: string): asserts value {
  if (!value) throw new Error(`WORK_STATIONARY_BINDING: ${reason}`);
}
function object(value: unknown, label: string): Record<string, any> {
  requireStationary(value !== null && typeof value === 'object' && !Array.isArray(value), label);
  return value as Record<string, any>;
}
function closed(value: unknown, keys: string[], label: string): Record<string, any> {
  const row = object(value, label);
  requireStationary(Object.keys(row).sort().join('\0') === keys.sort().join('\0'), `${label}: closed fields`);
  return row;
}
function json(model: RunModel, path: string): Record<string, any> {
  return object(parseStrictJson(bytes(model, path)), path);
}
function sealed(model: RunModel, path: string): Record<string, any> {
  const raw = bytes(model, path), row = json(model, path), { digest, ...body } = row;
  requireStationary(raw.equals(canonicalJsonBytes(row)) && digest === hash(canonicalJsonBytes(body)), `${path}: seal`);
  return row;
}
function checkpoint(state: Record<string, any>): string {
  const copy = structuredClone(state);
  object(object(copy.execution, 'execution').resume, 'resume').checkpoint_digest = '';
  return hash(canonicalJsonBytes(copy));
}
function requireCapability(model: RunModel): void {
  requireStationary(model.manifest?.runFormatVersion === '1.9.0-provisional'
    && hasRunCapability(model.manifest.runFormatVersion, 'orchestrator-work-transitions'), 'pinned cumulative 1.9 required');
}
export interface CaptureGeneration {
  format: 'aleph-s2-capture-generation/v1';
  run_id: string;
  bundle_digest: string;
  source_id: string;
  cursor_id: string;
  cursor_digest: string;
  cursor_row: string;
  frontier_digest: string;
  source_walk_digest: string;
  generation: string;
  previous_work_id: string | null;
  accounting_basis_digest: string;
}
export interface StationarySelector {
  output_kind: 'packet-candidate' | 'material-candidate';
  output_index: string;
  candidate_content_digest: string;
  disposition: 'new-accounting' | 'duplicate-accounting';
  binding_path: string;
  prior_call_id: string | null;
  prior_output_kind: string | null;
  prior_output_index: string | null;
  semantic_id: string | null;
  semantic_subject_digest: string | null;
  review_basis_digest: string | null;
  followup: 'L2S-required' | 'prior-L2S-accounted';
}
export interface StationaryCapture {
  format: 'aleph-stationary-capture/v1';
  outcome: 'stationary-accounting-only' | 'frontier-advanced';
  basis: CaptureGeneration;
  work_id: string;
  call_id: string;
  raw_digest: string;
  acceptance_digest: string;
  source_walk_before_digest: string;
  source_walk_after_digest: string;
  selectors: StationarySelector[];
  new_candidate_content_digests: string[];
}
function frontier(model: RunModel, sourceId: string): Omit<CaptureGeneration,
  'generation' | 'previous_work_id' | 'accounting_basis_digest'> {
  requireCapability(model);
  const cursor = model.sourceWalk.cursors.filter((row) => row.values.sourceId === sourceId).at(-1);
  const source = model.corpus.sources.find((row) => row.values.sourceId === sourceId);
  requireStationary(cursor && source && cursor.values.sourceHash === source.values.contentHash, 'exact retained source cursor');
  const identity = { run_id: model.manifest!.runId, bundle_digest: model.manifest!.forwardIdentity.bundleDigest,
    source_id: sourceId, cursor_id: cursor.values.cursorId, cursor_digest: hash(cursor.raw), cursor_row: cursor.raw };
  return { format: 'aleph-s2-capture-generation/v1', ...identity,
    frontier_digest: hash(canonicalJsonBytes(identity)), source_walk_digest: hash(bytes(model, WALK)) };
}
/** Selector positions identify returns; they do not change candidate content.
 * Every producer content field, including rendered text and flags, is retained.
 * No trimming, case folding, semantic similarity or array sorting occurs. */
export function stationaryCandidateDigest(returned: WorkerJsonValue, entry: SemanticEntry): string {
  const value = object(returned, 'producer');
  const { output_index, ...declaration } = entry;
  const collection = entry.output_kind === 'packet-candidate' ? value.packets : value.material_findings;
  requireStationary(['packet-candidate', 'material-candidate'].includes(entry.output_kind)
    && Array.isArray(collection) && collection[output_index], 'original candidate selector');
  return hash(semanticJson({ source_id: value.source_id, candidate: collection[output_index], declaration }));
}
export function stationaryCursor(model: RunModel, returned: WorkerJsonValue): boolean {
  const value = object(returned, 'producer'), next = object(value.next_cursor, 'next cursor');
  const prior = model.sourceWalk.cursors.filter((row) => row.values.sourceId === value.source_id).at(-1);
  if (!prior) return false;
  const nullable = (value: string) => value === 'none' ? null : value;
  return next.byte_offset === Number(prior.values.byteOffset)
    && next.source_hash === prior.values.sourceHash
    && next.shared_position_key === nullable(prior.values.sharedPositionKey)
    && next.next_event_ordinal === (prior.values.nextEventOrdinal === 'none' ? null : Number(prior.values.nextEventOrdinal))
    // No returned batch can manufacture a new cursor predecessor.
    && next.predecessor_walk_index === null && next.predecessor_event_index === null
    && value.walk_exhausted === false && next.reason !== 'source-complete';
}
function currentState(model: RunModel): Record<string, any> {
  const state = json(model, 'control/run-state.json');
  const pins = model.manifest!.forwardIdentity;
  requireStationary(state.run_id === model.manifest!.runId
    && state.identity.run_format_version === model.manifest!.runFormatVersion
    && state.identity.core?.tree_digest === pins.coreDigest
    && state.identity.adapter?.tree_digest === pins.adapterDigest
    && state.identity.bundle?.digest === pins.bundleDigest
    && state.identity.checker_digest === pins.checkerDigest
    && state.identity.runtime?.digest === pins.runtimeSnapshotDigest
    && state.identity.adapter_protocol_version === pins.adapterProtocolVersion
    && checkpoint(state) === state.execution.resume.checkpoint_digest, 'run/checkpoint identity');
  const lines = bytes(model, 'control/ledger-chain.jsonl').toString().trim().split('\n').filter(Boolean);
  let previous = hash(''), sequence = 0n;
  for (const line of lines) {
    const receipt = object(parseStrictJson(line), 'chain receipt'), { chain_digest, ...body } = receipt;
    requireStationary(chain_digest === hash(canonicalJsonBytes(body))
      && receipt.previous_chain_digest === previous && receipt.sequence === String(sequence + 1n), 'chain authentication');
    previous = chain_digest; sequence++;
  }
  requireStationary(previous === state.ledger.chain_head && String(sequence) === state.ledger.sequence, 'current chain head');
  return state;
}
/** Core reopens the retained work and acceptance, not a permission flag. The
 * adapter overlays these already-authenticated records in its planning copy. */
export function stationaryCaptureWork(model: RunModel, selected: Extract<NextWork, { kind: 'worker' }>,
  accepted: WorkValue): { work_id: string; acceptance_digest: string } {
  requireCapability(model);
  const state = currentState(model), directory = join(model.runDir, ORCHESTRATION, 'work');
  requireStationary(existsSync(directory), 'durable capture work missing');
  const works = readdirSync(directory).map((name) => {
    requireStationary(/^WORK-[0-9a-f]{64}\.json$/u.test(name), 'work path');
    return sealed(model, `${ORCHESTRATION}/work/${name}`);
  }).filter((work) => work.call?.call_id === accepted.call_id);
  requireStationary(works.length === 1, 'one exact capture work');
  const work = works[0], identity = object(work.identity, 'work identity');
  const receipt = sealed(model, `${ORCHESTRATION}/accepted/${accepted.call_id}.json`);
  requireStationary(work.format === 'aleph-loa-work-item/v1' && receipt.format === 'aleph-loa-accepted-return/v1'
    && work.work_id === `WORK-${hash(canonicalJsonBytes(identity)).slice(7)}`
    && same(identity.work, selected) && identity.run_id === state.run_id && same(identity.pins, state.identity)
    && identity.checkpoint === state.execution.resume.checkpoint_digest && same(identity.ledger, state.ledger)
    && state.execution.stage === 'S2' && selected.obligation.operation === 's2.capture'
    && work.call.role === 'extractor' && work.call.kind === 'producer'
    && receipt.work_id === work.work_id && receipt.work_digest === work.digest
    && receipt.call_id === accepted.call_id && receipt.digest === accepted.receipt_digest
    && receipt.raw_digest === accepted.raw_digest && receipt.context_id === accepted.context_id
    && receipt.producer_context_id === accepted.producer_context_id && receipt.simulation === accepted.simulation
    && receipt.basis_digest === work.basis_digest && receipt.checkpoint === identity.checkpoint
    && hash(bytes(model, `control/worker-returns/${accepted.call_id}/raw.json`)) === accepted.raw_digest,
  'capture work/return/run/stage/checkpoint/chain mismatch');
  requireStationary(!existsSync(join(model.runDir, ORCHESTRATION, 'commits', `${work.work_id}-consumed.json`)),
    'consumed capture cannot be replayed');
  return { work_id: work.work_id, acceptance_digest: receipt.digest };
}
function validateRecord(model: RunModel, value: unknown): StationaryCapture {
  const record = closed(value, ['format', 'outcome', 'basis', 'work_id', 'call_id', 'raw_digest', 'acceptance_digest',
    'source_walk_before_digest', 'source_walk_after_digest', 'selectors', 'new_candidate_content_digests'], 'stationary capture');
  closed(record.basis, ['format', 'run_id', 'bundle_digest', 'source_id', 'cursor_id', 'cursor_digest', 'cursor_row',
    'frontier_digest', 'source_walk_digest', 'generation', 'previous_work_id', 'accounting_basis_digest'], 'capture generation');
  requireStationary(record.format === 'aleph-stationary-capture/v1'
    && ['stationary-accounting-only', 'frontier-advanced'].includes(record.outcome)
    && record.basis.format === 'aleph-s2-capture-generation/v1' && /^(0|[1-9]\d*)$/u.test(record.basis.generation)
    && record.basis.run_id === model.manifest!.runId
    && record.basis.bundle_digest === model.manifest!.forwardIdentity.bundleDigest
    && (record.outcome === 'stationary-accounting-only'
      ? record.source_walk_before_digest === record.source_walk_after_digest
      : record.source_walk_before_digest !== record.source_walk_after_digest && record.basis.previous_work_id !== null)
    && record.source_walk_before_digest === record.basis.source_walk_digest
    && Array.isArray(record.selectors)
    && (record.outcome === 'frontier-advanced' || record.selectors.length > 0), 'stationary identity/outcome');
  const cursor = model.sourceWalk.cursors.find((row) => row.values.cursorId === record.basis.cursor_id);
  requireStationary(cursor, 'retained frontier cursor missing');
  const identity = { run_id: record.basis.run_id, bundle_digest: record.basis.bundle_digest,
    source_id: record.basis.source_id, cursor_id: record.basis.cursor_id,
    cursor_digest: record.basis.cursor_digest, cursor_row: record.basis.cursor_row };
  requireStationary(cursor.raw === record.basis.cursor_row && cursor.values.sourceId === record.basis.source_id
    && hash(cursor.raw) === record.basis.cursor_digest
    && hash(canonicalJsonBytes(identity)) === record.basis.frontier_digest, 'historical exact frontier');
  const preparation = json(model, `verification/harness/work-preparations/${record.call_id}.json`);
  requireStationary(same(preparation.capture_generation, record.basis)
    && preparation.source_id === record.basis.source_id && preparation.prior_cursor_id === record.basis.cursor_id
    && preparation.call_id === record.call_id
    && record.call_id === `CALL-F03-${hash(canonicalJsonBytes(record.basis)).slice(7)}`, 'retained generation preparation');
  const raw = bytes(model, `control/worker-returns/${record.call_id}/raw.json`);
  requireStationary(hash(raw) === record.raw_digest, 'retained candidate bytes changed');
  const returned = parseStrictJson(raw, true) as WorkerJsonValue;
  const validated = validateSemanticReturn('extractor', '1.9.0-provisional', returned);
  requireStationary(validated.result === 'PASS', 'retained return shape');
  const entries = object(returned, 'producer').semantic_units as SemanticEntry[];
  const producer = object(returned, 'producer');
  requireStationary(producer.producer_invocation_id === record.call_id && producer.source_id === record.basis.source_id
    && (record.outcome === 'frontier-advanced' || producer.packets.length > 0
      && producer.packets.every((candidate: any) => candidate.evidence_state === 'degraded-non-exact')
      && producer.extraction_events.length === 0
      && stationaryCursor({ ...model, sourceWalk: { ...model.sourceWalk, cursors: [cursor] } }, returned)),
  'stationary retained producer/frontier');
  requireStationary(entries.length === record.selectors.length, 'selector omission');
  record.selectors.forEach((selector: unknown, index: number) => {
    const row = closed(selector, ['output_kind', 'output_index', 'candidate_content_digest', 'disposition', 'binding_path',
      'prior_call_id', 'prior_output_kind', 'prior_output_index', 'semantic_id', 'semantic_subject_digest',
      'review_basis_digest', 'followup'], 'stationary selector');
    requireStationary(row.output_kind === entries[index].output_kind && row.output_index === String(entries[index].output_index)
      && row.candidate_content_digest === stationaryCandidateDigest(returned, entries[index])
      && row.binding_path === `control/semantic-producer-bindings/${record.call_id}/${row.output_kind}-${row.output_index}.json`
      && ['new-accounting', 'duplicate-accounting'].includes(row.disposition)
      && row.followup === (row.disposition === 'new-accounting' ? 'L2S-required' : 'prior-L2S-accounted'), 'selector content/identity');
    if (row.disposition === 'new-accounting') requireStationary(row.prior_call_id === null
      && row.prior_output_kind === null && row.prior_output_index === null && row.review_basis_digest === null,
    'new selector cannot assert a prior review');
  });
  requireStationary(same(record.new_candidate_content_digests, [...new Set(record.selectors
    .filter((selector: StationarySelector) => selector.disposition === 'new-accounting')
    .map((selector: StationarySelector) => selector.candidate_content_digest))]), 'new accounting digest set');
  return record as StationaryCapture;
}
function committed(model: RunModel, record: StationaryCapture): void {
  const state = currentState(model), work = sealed(model, `${ORCHESTRATION}/work/${record.work_id}.json`);
  const acceptance = sealed(model, `${ORCHESTRATION}/accepted/${record.call_id}.json`);
  const intent = sealed(model, `${ORCHESTRATION}/commits/${record.work_id}-intent.json`);
  const consumed = sealed(model, `${ORCHESTRATION}/commits/${record.work_id}-consumed.json`);
  const journalPath = `control/transactions/TXN-work-${record.work_id.slice(5)}.json`;
  const journal = json(model, journalPath), { digest, status, ...body } = journal;
  const identity = object(work.identity, 'work identity'), plan = object(journal.plan, 'capture plan');
  requireStationary(work.format === 'aleph-loa-work-item/v1' && acceptance.format === 'aleph-loa-accepted-return/v1'
    && work.work_id === record.work_id && record.work_id === `WORK-${hash(canonicalJsonBytes(identity)).slice(7)}`
    && identity.run_id === state.run_id && same(identity.pins, state.identity)
    && identity.work.obligation.operation === 's2.capture' && identity.work.obligation.stage === 'S2'
    && work.call.call_id === record.call_id && work.call.role === 'extractor'
    && acceptance.digest === record.acceptance_digest && acceptance.raw_digest === record.raw_digest
    && acceptance.call_id === record.call_id && acceptance.work_id === record.work_id && acceptance.work_digest === work.digest
    && acceptance.checkpoint === identity.checkpoint && acceptance.basis_digest === work.basis_digest,
  'retained capture work/acceptance');
  requireStationary(status === 'committed' && digest === hash(canonicalJsonBytes(body))
    && journal.work_id === record.work_id && journal.intent_digest === intent.digest
    && intent.work_id === record.work_id && intent.work_digest === work.digest
    && intent.acceptance_digest === acceptance.digest && intent.plan_digest === hash(canonicalJsonBytes(plan))
    && intent.before_checkpoint === identity.checkpoint && intent.before_chain === identity.ledger.chain_head
    && intent.journal === journalPath && same(plan.stationary_capture, record)
    && same(plan.obligation, identity.work.obligation)
    && same(journal.state_before.identity, identity.pins) && journal.state_before.run_id === identity.run_id
    && journal.state_before.execution.stage === 'S2'
    && checkpoint(journal.state_before) === identity.checkpoint
    && checkpoint(journal.state_after) === journal.state_after.execution.resume.checkpoint_digest,
  'retained stationary journal/intent/checkpoints');
  requireStationary(consumed.work_id === record.work_id && consumed.commit_digest === intent.digest
    && consumed.journal_digest === hash(bytes(model, journalPath))
    && consumed.after_checkpoint === journal.state_after.execution.resume.checkpoint_digest
    && consumed.after_chain === journal.state_after.ledger.chain_head
    && typeof journal.chain_after === 'string' && journal.chain_after.startsWith(journal.chain_before)
    && bytes(model, 'control/ledger-chain.jsonl').toString().startsWith(journal.chain_after),
  'retained stationary consumption/chain');
  const beforeLines = journal.chain_before.trim().split('\n').filter(Boolean);
  let head = beforeLines.length ? JSON.parse(beforeLines.at(-1)).chain_digest : hash('');
  let sequence = BigInt(journal.state_before.ledger.sequence);
  requireStationary(head === identity.ledger.chain_head && same(identity.ledger, journal.state_before.ledger),
    'capture chain before-image');
  const appended = journal.chain_after.slice(journal.chain_before.length).trim().split('\n').filter(Boolean);
  requireStationary(appended.length === plan.effects.length, 'one chain receipt per exact effect');
  plan.effects.forEach((effect: any, index: number) => {
    const receipt = jsonLine(appended[index]);
    requireStationary(receipt.path === effect.path && receipt.before_digest === (effect.before_digest || hash(''))
      && receipt.after_digest === effect.after_digest && receipt.previous_chain_digest === head
      && receipt.sequence === String(sequence + 1n), 'exact capture effect chain binding');
    head = receipt.chain_digest; sequence++;
    if (effect.path.startsWith('control/semantic-producer-bindings/')
      || effect.path.startsWith('verification/harness/semantic-subjects/')
      || effect.path.startsWith(STATIONARY_CAPTURES) || effect.path.startsWith('verification/harness/work-captures/')) {
      requireStationary(hash(bytes(model, effect.path)) === effect.after_digest, 'immutable accounting effect changed');
    }
  });
  requireStationary(head === journal.state_after.ledger.chain_head
    && String(sequence) === journal.state_after.ledger.sequence
    && journal.state_after.run_id === identity.run_id && same(journal.state_after.identity, identity.pins)
    && journal.state_after.execution.stage === 'S2'
    && BigInt(journal.state_after.execution.resume.sequence) === BigInt(journal.state_before.execution.resume.sequence) + 1n,
  'capture chain/checkpoint after-image');
  const capturePath = `${STATIONARY_CAPTURES}${record.call_id}.json`;
  const walkEffects = plan.effects.filter((effect: any) => effect.path === WALK);
  requireStationary(Array.isArray(plan.effects)
    && (record.outcome === 'stationary-accounting-only' ? walkEffects.length === 0
      : walkEffects.length === 1 && walkEffects[0].before_digest === record.source_walk_before_digest
        && walkEffects[0].after_digest === record.source_walk_after_digest)
    && plan.effects.filter((effect: any) => effect.path === capturePath).length === 1, 'stationary effects');
  const effect = plan.effects.find((effect: any) => effect.path === capturePath);
  requireStationary(effect.before_digest === null && effect.after_base64 === canonicalJsonBytes(record).toString('base64')
    && effect.after_digest === hash(canonicalJsonBytes(record)), 'stationary accounting after-image');
}
function jsonLine(line: string): Record<string, any> {
  const receipt = object(parseStrictJson(line), 'chain receipt'), { chain_digest, ...body } = receipt;
  requireStationary(chain_digest === hash(canonicalJsonBytes(body)), 'capture chain receipt seal');
  return receipt;
}
function accountedSubject(model: RunModel, record: StationaryCapture, selector: StationarySelector, reviewed: boolean) {
  const ledger = parseSemanticLedger(bytes(model, SEMANTICS).toString());
  const binding = bytes(model, selector.binding_path);
  const tuple = json(model, selector.binding_path);
  requireStationary(tuple.call_id === record.call_id && tuple.raw_return_hash === record.raw_digest
    && tuple.output_kind === selector.output_kind && tuple.output_index === Number(selector.output_index), 'original binding');
  const rows = ledger.subjects.filter((row) => row.producer_receipt_ref === `${selector.binding_path}@${hash(binding)}`);
  requireStationary(rows.length === 1, 'one prior accounted semantic subject');
  const row = rows[0], subject = json(model, row.subject_path) as SemanticSubject;
  requireStationary(row.owner_stage === 'S2' && subject.owner_stage === 'S2'
    && row.subject_digest === hash(bytes(model, row.subject_path))
    && subject.semantic_id === row.semantic_id
    && (selector.semantic_id === null || selector.semantic_id === row.semantic_id)
    && (selector.semantic_subject_digest === null || selector.semantic_subject_digest === row.subject_digest)
    && subject.producer_binding_hash === semanticProducerBinding(tuple as Parameters<typeof semanticProducerBinding>[0]),
  'accounted subject binding');
  const assignments = ledger.assignments.filter((entry) => entry.semantic_id === row.semantic_id);
  const results = ledger.results.filter((entry) => entry.semantic_id === row.semantic_id);
  const resolutions = ledger.resolutions.filter((entry) => entry.semantic_id === row.semantic_id);
  if (reviewed) requireStationary(assignments.length > 0 && assignments.every((entry) =>
    results.some((result) => result.review_id === entry.review_id)) && resolutions.length === 1,
  'required prior L2S accounting remains outstanding');
  for (const entry of assignments) requireStationary(hash(bytes(model, entry.assignment_path)) === entry.assignment_digest, 'assignment changed');
  for (const entry of results) requireStationary(hash(bytes(model, entry.result_path)) === entry.result_digest, 'review changed');
  return { semantic_id: row.semantic_id, semantic_subject_digest: row.subject_digest,
    review_basis_digest: hash(canonicalJsonBytes({ row, assignments, results, resolutions })) };
}
export function stationaryHistory(model: RunModel, sourceId?: string): StationaryCapture[] {
  requireCapability(model);
  const records = model.files.filter((file) => file.relativePath.startsWith(STATIONARY_CAPTURES)).map((file) => {
    const record = validateRecord(model, parseStrictJson(file.text));
    requireStationary(file.relativePath === `${STATIONARY_CAPTURES}${record.call_id}.json`, 'capture path');
    committed(model, record);
    return record;
  }).filter((record) => !sourceId || record.basis.source_id === sourceId)
    .sort((a, b) => a.basis.frontier_digest.localeCompare(b.basis.frontier_digest)
      || (BigInt(a.basis.generation) < BigInt(b.basis.generation) ? -1 : BigInt(a.basis.generation) > BigInt(b.basis.generation) ? 1 : 0));
  const frontiers = new Map<string, StationaryCapture[]>();
  for (const record of records) {
    const previous = frontiers.get(record.basis.frontier_digest) || [];
    requireStationary(record.basis.generation === String(previous.length)
      && record.basis.previous_work_id === (previous.at(-1)?.work_id || null)
      && record.basis.accounting_basis_digest === historyDigest(model, previous, true),
    'generation or cumulative accounting basis changed');
    for (const selector of record.selectors.filter((entry) => entry.disposition === 'duplicate-accounting')) {
      const prior = previous.find((entry) => entry.call_id === selector.prior_call_id);
      const original = prior?.selectors.find((entry) => entry.disposition === 'new-accounting'
        && entry.output_kind === selector.prior_output_kind && entry.output_index === selector.prior_output_index);
      requireStationary(prior && original && original.candidate_content_digest === selector.candidate_content_digest,
        'duplicate must bind an earlier exact same-frontier candidate');
      const subject = accountedSubject(model, prior, original, true);
      requireStationary(subject.semantic_id === selector.semantic_id
        && subject.semantic_subject_digest === selector.semantic_subject_digest
        && subject.review_basis_digest === selector.review_basis_digest, 'duplicate subject/review basis changed');
    }
    previous.push(record); frontiers.set(record.basis.frontier_digest, previous);
  }
  return records;
}
function historyDigest(model: RunModel, history: StationaryCapture[], reviewed: boolean): string {
  return hash(canonicalJsonBytes(history.map((record) => ({ work_id: record.work_id,
    capture_digest: hash(canonicalJsonBytes(record)), selectors: record.selectors.map((selector) => ({
      content_digest: selector.candidate_content_digest, disposition: selector.disposition,
      subject: selector.disposition === 'duplicate-accounting'
        ? { semantic_id: selector.semantic_id, semantic_subject_digest: selector.semantic_subject_digest, review_basis_digest: selector.review_basis_digest }
        : accountedSubject(model, record, selector, reviewed),
    })) }))));
}
export function captureGeneration(model: RunModel, sourceId: string): CaptureGeneration {
  const basis = frontier(model, sourceId);
  validateSemanticRun(model);
  const previous = stationaryHistory(model, sourceId).filter((record) => record.basis.frontier_digest === basis.frontier_digest);
  return { ...basis, generation: String(previous.length), previous_work_id: previous.at(-1)?.work_id || null,
    accounting_basis_digest: historyDigest(model, previous, true) };
}
export function stationaryPriorAccounting(model: RunModel, basis: CaptureGeneration, contentDigest: string) {
  const previous = stationaryHistory(model, basis.source_id).filter((record) => record.basis.frontier_digest === basis.frontier_digest);
  for (const record of previous) {
    const selector = record.selectors.find((entry) => entry.disposition === 'new-accounting' && entry.candidate_content_digest === contentDigest);
    if (selector) return { prior_call_id: record.call_id, prior_output_kind: selector.output_kind,
      prior_output_index: selector.output_index, ...accountedSubject(model, record, selector, true) };
  }
  return null;
}
export function stationaryDuplicateSubject(model: RunModel, callId: string, kind: string, index: number): string | null {
  if (model.manifest?.runFormatVersion !== '1.9.0-provisional') return null;
  const record = stationaryHistory(model).find((record) => record.call_id === callId);
  const selector = record?.selectors.find((entry) => entry.output_kind === kind && entry.output_index === String(index));
  return selector?.disposition === 'duplicate-accounting' ? selector.semantic_id : null;
}
export function stationaryHalt(model: RunModel, sourceId: string) {
  const basis = frontier(model, sourceId);
  const last = stationaryHistory(model, sourceId).filter((record) => record.basis.frontier_digest === basis.frontier_digest).at(-1);
  if (!last || last.outcome !== 'stationary-accounting-only' || last.new_candidate_content_digests.length) return null;
  return { format: 'aleph-stationary-frontier-halt/v1', code: STATIONARY_HALT, source_id: sourceId,
    cursor_id: basis.cursor_id, cursor_digest: basis.cursor_digest, cursor_row: basis.cursor_row,
    frontier_digest: basis.frontier_digest, last_work_id: last.work_id, generation: last.basis.generation,
    accepted_invocation: last.call_id, repeated_candidate_content_digests: last.selectors.map((selector) => selector.candidate_content_digest),
    reason: 'No source-walk progress, exact packet/event or mechanically new same-frontier accounting effect.' };
}

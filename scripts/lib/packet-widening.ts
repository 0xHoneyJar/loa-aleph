import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { mdLineSpan, sourceFilePath } from './check-helpers.ts';
import { lineageCurrentPacketIds, parseLineage } from './lineage.ts';
import { hasRunCapability, type RunModel } from './run-model.ts';
import { canonicalJsonBytes } from './bundle-format.ts';
import { parseStrictJson } from './worker-return-contract.ts';
import { framedExactEvidenceHash } from './checks-k2.ts';
import { semanticClaimCell, semanticJson, semanticProducerBinding, semanticRelationRow, parseSemanticLedger,
  semanticSubjectPath, validateSemanticSubjectShape, type SemanticSubject } from './semantic-review.ts';
import { relationReviewSubjectJson, type RelationRow } from './relations.ts';

export const WIDENING_RETURN_FORMAT = 'aleph-s3-packet-widening-return/v1';
export const WIDENING_CONTRACT = 'S3 — bounded packet widening (1.9)';
export const WIDENING_TASK = 'Propose exact packet semantics and material use only for the retained S3 widening request. Preserve the requested frozen source bounds and predecessor bytes. Emit no claims, primary walk intervals, extraction events or cursors.';
export const WIDENING_PREPARATIONS = 'verification/harness/packet-widening/preparations/';
export const WIDENING_CAPTURES = 'verification/harness/packet-widening/captures/';
export interface PacketWideningBasis {
  format: 'aleph-s3-packet-widening-basis/v1';
  run_id: string;
  run_format: string;
  capability: 'orchestrator-work-transitions';
  owner_stage: 'S3';
  normalizer_call_id: string;
  normalizer_raw_digest: string;
  output_selector: string;
  request_index: string;
  request: { packet: string; new_locator: string };
  source_id: string;
  source_path: string;
  source_hash: string;
  start_byte: string;
  end_byte: string;
  exact_bytes_base64: string;
  predecessor_cells: string[];
  s2_seal_digest: string;
  source_walk_digest: string;
  lineage_digest: string;
  packet_inventory_digest: string;
  operation_family: 'bounded-packet-widening';
  first_packet_id: string;
}
export interface PacketWideningCapture {
  format: 'aleph-s3-packet-widening-capture/v1';
  basis: PacketWideningBasis;
  call_id: string;
  raw_digest: string;
  context_id: string;
  producer_context_id: string | null;
  receipt_digest: string;
  simulation: boolean;
  lineage_id: string | null;
  lineage_type: 'replace' | 'split' | null;
  selectors: Array<{ output_kind: 'packet-candidate' | 'material-candidate'; output_index: string;
    packet_ids: string[]; evidence_key: string | null; binding_path: string }>;
  work_provenance?: { work_record_base64: string; acceptance_record_base64: string };
}
export function wideningHash(bytes: Buffer | string): string {
  return `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
}
export function assertWidening(condition: unknown, detail: string): asserts condition {
  if (!condition) throw new Error(`WORK_WIDENING: ${detail}`);
}
function bytes(model: RunModel, path: string): Buffer {
  const file = model.files.find((file) => file.relativePath === path);
  return file ? Buffer.from(file.text) : readFileSync(join(model.runDir, path));
}
function exactKeys(value: unknown, keys: readonly string[], label: string): void {
  assertWidening(value !== null && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).sort().join('\0') === [...keys].sort().join('\0'), `${label}: closed fields required`);
}
function same(left: unknown, right: unknown): boolean {
  return isDeepStrictEqual(left, right);
}
export function wideningCallId(basis: PacketWideningBasis): string {
  return `CALL-F03-${wideningHash(canonicalJsonBytes(basis)).slice(7)}`;
}
export function derivePacketWideningBasis(model: RunModel, normalizerCallId: string,
  outputIndex: number, requestIndex: number): PacketWideningBasis {
  assertWidening(hasRunCapability(model.manifest?.runFormatVersion || '', 'orchestrator-work-transitions'),
    'requires the pinned 1.9 orchestration capability');
  assertWidening(/^CALL-F03-[0-9a-f]{64}$/u.test(normalizerCallId)
    && Number.isSafeInteger(outputIndex) && outputIndex >= 0 && Number.isSafeInteger(requestIndex) && requestIndex >= 0,
  'exact original invocation and selector indexes required');
  const raw = bytes(model, `control/worker-returns/${normalizerCallId}/raw.json`);
  const returned = parseStrictJson(raw) as { claims: Array<{ packets: string[];
    widen_requests: Array<{ packet: string; new_locator: string }> }> };
  const capture = parseStrictJson(bytes(model, `verification/harness/work-captures/S3/${normalizerCallId}.json`)) as {
    format: string; call_id: string; raw_digest: string; selectors: Array<{ output_kind: string; output_index: string }>;
  };
  assertWidening(capture.format === 'aleph-s3-work-capture/v1' && capture.call_id === normalizerCallId
    && capture.raw_digest === wideningHash(raw) && capture.selectors.some((selector) =>
      selector.output_kind === 'claim-candidate' && selector.output_index === String(outputIndex)),
  'original accepted normalizer capture and claim selector required');
  const claim = returned.claims?.[outputIndex], request = claim?.widen_requests?.[requestIndex];
  assertWidening(request && Object.keys(request).sort().join(',') === 'new_locator,packet'
    && typeof request.packet === 'string' && typeof request.new_locator === 'string'
    && claim.packets.includes(request.packet), 'request must name its original candidate packet');
  const predecessor = model.packets.find((packet) => packet.values.packetId === request.packet);
  assertWidening(predecessor && lineageCurrentPacketIds(model).has(request.packet), 'current predecessor packet required');
  const source = model.corpus.sources.find((source) => source.values.sourceId === predecessor.values.sourceId);
  const sourcePath = source && sourceFilePath(model.runDir, source.values.locus);
  const locus = /^L([1-9]\d*)-L([1-9]\d*)$/u.exec(request.new_locator);
  const oldLocus = /^L([1-9]\d*)-L([1-9]\d*)$/u.exec(predecessor.values.locator);
  assertWidening(source && sourcePath && locus && oldLocus, 'existing exact md-lines source and requested locator required');
  const frozen = readFileSync(sourcePath), span = mdLineSpan(sourcePath, Number(locus[1]), Number(locus[2]));
  assertWidening(wideningHash(frozen) === source.values.contentHash && span?.bytes
    && span.startByte !== null && span.endByte !== null && Number(locus[1]) <= Number(oldLocus[1])
    && Number(locus[2]) >= Number(oldLocus[2]), 'requested widening must reopen exact frozen bytes and retain predecessor bounds');
  const completion = model.sourceWalk.completions.filter((row) => row.values.sourceId === source.values.sourceId);
  assertWidening(completion.length === 1 && completion[0].values.completionState === 'complete'
    && completion[0].values.sourceHash === source.values.contentHash
    && Number(completion[0].values.sourceLengthBytes) === frozen.length, 'completed S2 frozen-source coverage required');
  const covered = model.sourceWalk.intervals.filter((row) => row.values.sourceId === source.values.sourceId
    && row.values.closureState === 'closed').sort((a, b) => Number(a.values.startByte) - Number(b.values.startByte));
  let frontier = span.startByte;
  for (const row of covered) if (Number(row.values.startByte) <= frontier) frontier = Math.max(frontier, Number(row.values.endByte));
  assertWidening(frontier >= span.endByte, 'requested span escapes already-accounted S2 coverage');
  const seal = bytes(model, 'verification/harness/semantic-stage-seals/S2.json');
  const parsedSeal = parseStrictJson(seal) as { format: string; stage: string };
  assertWidening(parsedSeal.format === 'aleph-semantic-stage-seal/v1' && parsedSeal.stage === 'S2', 'original S2 seal required');
  return { format: 'aleph-s3-packet-widening-basis/v1', run_id: model.manifest!.runId,
    run_format: model.manifest!.runFormatVersion, capability: 'orchestrator-work-transitions', owner_stage: 'S3',
    normalizer_call_id: normalizerCallId, normalizer_raw_digest: wideningHash(raw),
    output_selector: `claim-candidate:${outputIndex}`, request_index: String(requestIndex), request: { ...request },
    source_id: source.values.sourceId, source_path: relative(model.runDir, sourcePath).replaceAll('\\', '/'),
    source_hash: source.values.contentHash, start_byte: String(span.startByte), end_byte: String(span.endByte),
    exact_bytes_base64: span.bytes.toString('base64'), predecessor_cells: [...predecessor.cells],
    s2_seal_digest: wideningHash(seal), source_walk_digest: wideningHash(bytes(model, 'ledgers/source-walk.md')),
    lineage_digest: wideningHash(bytes(model, 'ledgers/lineage.md')),
    packet_inventory_digest: wideningHash(bytes(model, 'ledgers/packet-index.md')), operation_family: 'bounded-packet-widening',
    first_packet_id: `PKT-${String(model.packets.reduce((max, row) => Math.max(max, Number(row.values.packetId.slice(4))), 0) + 1).padStart(4, '0')}` };
}

/** Reopening history never refreshes a saved request to the current checkpoint. */
export function validatePacketWideningBasis(model: RunModel, basis: PacketWideningBasis, retained = false): void {
  exactKeys(basis, ['format', 'run_id', 'run_format', 'capability', 'owner_stage', 'normalizer_call_id',
    'normalizer_raw_digest', 'output_selector', 'request_index', 'request', 'source_id', 'source_path', 'source_hash',
    'start_byte', 'end_byte', 'exact_bytes_base64', 'predecessor_cells', 's2_seal_digest', 'source_walk_digest',
    'lineage_digest', 'packet_inventory_digest', 'operation_family', 'first_packet_id'], 'widening basis');
  assertWidening(basis.format === 'aleph-s3-packet-widening-basis/v1' && basis.run_id === model.manifest?.runId
    && basis.run_format === model.manifest.runFormatVersion && basis.owner_stage === 'S3'
    && basis.capability === 'orchestrator-work-transitions' && basis.operation_family === 'bounded-packet-widening'
    && hasRunCapability(basis.run_format, basis.capability)
    && /^PKT-\d{4,}$/u.test(basis.first_packet_id), 'run, format, stage and family binding differs');
  const match = /^claim-candidate:(0|[1-9]\d*)$/u.exec(basis.output_selector);
  assertWidening(match, 'original claim selector required');
  if (!retained) {
    assertWidening(canonicalJsonBytes(derivePacketWideningBasis(model, basis.normalizer_call_id,
      Number(match[1]), Number(basis.request_index))).equals(canonicalJsonBytes(basis)), 'request/predecessor/source before-state changed');
    return;
  }
  const raw = bytes(model, `control/worker-returns/${basis.normalizer_call_id}/raw.json`);
  const returned = parseStrictJson(raw) as { claims: Array<{ packets: string[]; widen_requests: unknown[] }> };
  const claim = returned.claims[Number(match[1])], packet = model.packets.find((row) => row.values.packetId === basis.request.packet);
  assertWidening(wideningHash(raw) === basis.normalizer_raw_digest
    && canonicalJsonBytes(claim.widen_requests[Number(basis.request_index)]).equals(canonicalJsonBytes(basis.request))
    && claim.packets.includes(basis.request.packet) && packet?.values.sourceId === basis.source_id
    && canonicalJsonBytes(packet.cells).equals(canonicalJsonBytes(basis.predecessor_cells)),
  'retained request and original packet bytes differ');
  const source = model.corpus.sources.find((row) => row.values.sourceId === basis.source_id);
  const sourcePath = source && sourceFilePath(model.runDir, source.values.locus);
  assertWidening(sourcePath && relative(model.runDir, sourcePath).replaceAll('\\', '/') === basis.source_path,
    'retained frozen source identity differs');
  const frozen = readFileSync(sourcePath), locus = /^L([1-9]\d*)-L([1-9]\d*)$/u.exec(basis.request.new_locator);
  const span = locus && mdLineSpan(sourcePath, Number(locus[1]), Number(locus[2]));
  assertWidening(wideningHash(frozen) === basis.source_hash && source!.values.contentHash === basis.source_hash
    && span?.bytes && String(span.startByte) === basis.start_byte && String(span.endByte) === basis.end_byte
    && span.bytes.toString('base64') === basis.exact_bytes_base64, 'retained requested exact source locus differs');
  assertWidening(wideningHash(bytes(model, 'verification/harness/semantic-stage-seals/S2.json')) === basis.s2_seal_digest
    && wideningHash(bytes(model, 'ledgers/source-walk.md')) === basis.source_walk_digest,
  'post-S2 work changed sealed S2 or primary source-walk history');
}
export function packetWideningCaptures(model: RunModel): PacketWideningCapture[] {
  return model.files.filter((file) => file.relativePath.startsWith(WIDENING_CAPTURES)).map((file) => {
    const value = parseStrictJson(file.text) as unknown as PacketWideningCapture;
    exactKeys(value, ['format', 'basis', 'call_id', 'raw_digest', 'context_id', 'producer_context_id',
      'receipt_digest', 'simulation', 'lineage_id', 'lineage_type', 'selectors',
      ...Object.hasOwn(value, 'work_provenance') ? ['work_provenance'] : []], 'widening capture');
    assertWidening(value.format === 'aleph-s3-packet-widening-capture/v1'
      && file.relativePath === `${WIDENING_CAPTURES}${value.call_id}.json`
      && value.call_id === wideningCallId(value.basis) && typeof value.context_id === 'string'
      && value.context_id.length > 0 && (value.producer_context_id === null || typeof value.producer_context_id === 'string')
      && /^sha256:[0-9a-f]{64}$/u.test(value.receipt_digest) && typeof value.simulation === 'boolean'
      && Array.isArray(value.selectors), 'exact dedicated capture identity required');
    validatePacketWideningBasis(model, value.basis, true);
    const raw = bytes(model, `control/worker-returns/${value.call_id}/raw.json`);
    assertWidening(wideningHash(raw) === value.raw_digest, 'widening producer bytes changed');
    validateCapturedOutputs(model, value, raw);
    return value;
  });
}
function validateCapturedOutputs(model: RunModel, capture: PacketWideningCapture, raw: Buffer): void {
  const returned = parseStrictJson(raw) as { format: string; source_id: string; producer_invocation_id: string;
    packets: Array<{ criterion: unknown; join_policy: string; rendered_text: string;
      fragments: Array<{ fragment_order: number; locator: string; exact_bytes_base64: string }> }>;
    material_findings: unknown[]; semantic_units: Array<{ output_kind: string; output_index: number }> };
  assertWidening(returned.format === WIDENING_RETURN_FORMAT && returned.source_id === capture.basis.source_id
    && returned.producer_invocation_id === capture.call_id && Array.isArray(returned.packets)
    && Array.isArray(returned.material_findings) && Array.isArray(returned.semantic_units),
  'retained producer must use the dedicated source and invocation');
  const expected = [...returned.packets.map((_, index) => `packet-candidate:${index}`),
    ...returned.material_findings.map((_, index) => `material-candidate:${index}`)];
  assertWidening(expected.length > 0 && same(capture.selectors.map((s) => `${s.output_kind}:${s.output_index}`), expected)
    && same(returned.semantic_units.map((s) => `${s.output_kind}:${s.output_index}`), expected),
  'complete original ordered selectors required exactly once');
  const packetIds = new Set<string>(), evidenceIds = new Set<string>();
  for (const selector of capture.selectors) {
    exactKeys(selector, ['output_kind', 'output_index', 'packet_ids', 'evidence_key', 'binding_path'], 'widening selector');
    assertWidening(selector.binding_path === `control/semantic-producer-bindings/${capture.call_id}/${selector.output_kind}-${selector.output_index}.json`
      && Array.isArray(selector.packet_ids), 'original producer selector path required');
    const tuple = parseStrictJson(bytes(model, selector.binding_path));
    assertWidening(same(tuple, { call_id: capture.call_id, context_id: capture.context_id,
      raw_return_hash: capture.raw_digest, output_kind: selector.output_kind, output_index: Number(selector.output_index) }),
    'original producer binding differs');
    if (selector.output_kind === 'material-candidate') {
      assertWidening(selector.packet_ids.length === 0 && selector.evidence_key === null,
        'material findings cannot replace packet selectors');
      continue;
    }
    const candidate = returned.packets[Number(selector.output_index)];
    assertWidening(selector.evidence_key && /^EVID-\d{4,}$/u.test(selector.evidence_key)
      && !evidenceIds.has(selector.evidence_key) && selector.packet_ids.length === candidate.fragments.length
      && selector.packet_ids.length > 0, 'one exact evidence record per original packet candidate required');
    evidenceIds.add(selector.evidence_key);
    const exact = candidate.fragments.map((fragment) => Buffer.from(fragment.exact_bytes_base64, 'base64'));
    const hash = `sha256:${framedExactEvidenceHash(exact)}`;
    const evidence = model.exactEvidence.records.filter((row) => row.values.evidenceKey === selector.evidence_key);
    assertWidening(evidence.length === 1 && same(evidence[0].cells, [selector.evidence_key,
      selector.packet_ids.join(', '), 'exact', String(exact.length), String(candidate.join_policy), hash, 'none', 'none', 'none']),
    'canonical exact evidence differs from the widening candidate');
    const fragments = model.exactEvidence.fragments.filter((row) => row.values.evidenceKey === selector.evidence_key);
    assertWidening(fragments.length === exact.length, 'complete ordered fragment set required');
    selector.packet_ids.forEach((id, index) => {
      assertWidening(/^PKT-\d{4,}$/u.test(id) && !packetIds.has(id) && id !== capture.basis.request.packet,
        'unique new packet identities required');
      assertWidening(id === `PKT-${String(Number(capture.basis.first_packet_id.slice(4)) + packetIds.size).padStart(4, '0')}`,
        'new packets must follow the retained allocation in output/fragment order');
      packetIds.add(id);
      const fragment = candidate.fragments[index], packets = model.packets.filter((row) => row.values.packetId === id);
      assertWidening(packets.length === 1 && same(packets[0].cells,
        [id, capture.basis.source_id, fragment.locator, wideningHash(exact[index]), exact[index].toString('utf8'),
          String(candidate.criterion), 'active'].map(semanticClaimCell)), 'packet row differs from original producer fragment');
      assertWidening(same(fragments[index].cells.slice(1), [selector.evidence_key, id, String(fragment.fragment_order),
        capture.basis.source_id, fragment.locator, 'frozen-source', 'exact-source-bytes',
        wideningHash(exact[index]), fragment.exact_bytes_base64]), 'fragment identity, order or exact bytes differ');
    });
    const transformations = model.exactEvidence.transformations.filter((row) => row.values.evidenceKey === selector.evidence_key);
    assertWidening(transformations.length === 1 && same(transformations[0].cells.slice(1),
      [selector.evidence_key, 'rendered', hash, hash, candidate.rendered_text, wideningHash(candidate.rendered_text)].map(semanticClaimCell)),
    'rendered derivative differs from producer bytes');
  }
  if (packetIds.size === 0) {
    assertWidening(capture.lineage_id === null && capture.lineage_type === null,
      'material refusal creates no packet lineage');
    return;
  }
  const lineage = parseLineage(model).rows.filter((row) => row.values.lineageId === capture.lineage_id);
  assertWidening(lineage.length === 1 && lineage[0].values.ownerStage === 'S3'
    && lineage[0].values.establishedBy === capture.call_id && lineage[0].values.predecessors === capture.basis.request.packet
    && lineage[0].values.type === capture.lineage_type && capture.lineage_type === (packetIds.size === 1 ? 'replace' : 'split')
    && same(lineage[0].values.successors.split(',').map((id) => id.trim()), [...packetIds]),
  'exact retained predecessor/successor lineage required');
}
export function packetWideningReceiptAuthorized(model: RunModel, packetId: string, producerCallId: string): boolean {
  const matching = packetWideningCaptures(model).filter((capture) => capture.call_id === producerCallId
    && capture.selectors.some((selector) => selector.output_kind === 'packet-candidate' && selector.packet_ids.includes(packetId)));
  if (matching.length !== 1) return false;
  const capture = matching[0], lineage = parseLineage(model).rows.find((row) => row.values.lineageId === capture.lineage_id);
  const packets = capture.selectors.flatMap((selector) => selector.packet_ids);
  assertWidening(lineage?.values.ownerStage === 'S3' && lineage.values.establishedBy === producerCallId
    && lineage.values.predecessors === capture.basis.request.packet && lineage.values.type === capture.lineage_type
    && canonicalJsonBytes(lineage.values.successors.split(',').map((id) => id.trim())).equals(canonicalJsonBytes(packets)),
  'exact existing PKT lineage required');
  return true;
}
export function isPostS2WidenedPacket(model: RunModel, packetId: string): boolean {
  if (!hasRunCapability(model.manifest?.runFormatVersion || '', 'orchestrator-work-transitions')) return false;
  const captures = packetWideningCaptures(model).filter((capture) =>
    capture.selectors.some((selector) => selector.packet_ids.includes(packetId)));
  assertWidening(captures.length <= 1, 'one widening capture per new packet required');
  return captures.length === 1 && packetWideningReceiptAuthorized(model, packetId, captures[0].call_id);
}

/** C-06 witnesses are retained work/acceptance bytes, never a worker permission flag.
 * The adapter reauthenticates the original transport and dependencies separately.
 * Core checks the witness against the exact C-05 capture and its committed effect. */
export function widenedPacketRelationEligible(model: RunModel, row: RelationRow, subject?: SemanticSubject): boolean {
  if (model.manifest?.runFormatVersion !== '1.9.0-provisional'
    || !hasRunCapability(model.manifest.runFormatVersion, 'orchestrator-work-transitions')
    || row.values.ownerStage !== 'S3' || row.values.sourceKind !== 'PKT') return false;
  if (!subject) {
    const ledger = parseSemanticLedger(bytes(model, 'ledgers/semantic-review.md').toString());
    const matches = ledger.subjects.filter((entry) => entry.owner_stage === 'S3' && entry.subject_kind === 'packet-group').flatMap((entry) => {
      assertWidening(entry.subject_path === semanticSubjectPath(entry.semantic_id), 'C06 exact subject path required');
      const value = parseStrictJson(bytes(model, entry.subject_path));
      validateSemanticSubjectShape(value);
      return value.semantics.relation_proposals.some((proposal) => relationReviewSubjectJson(semanticRelationRow(proposal).values)
        === relationReviewSubjectJson(row.values)) ? [value] : [];
    });
    if (matches.length !== 1) return false;
    subject = matches[0];
  }
  if (subject.owner_stage !== 'S3' || subject.subject_kind !== 'packet-group'
    || subject.output_binding.kind !== 'packet-group' || row.values.ownerStage !== 'S3'
    || row.values.sourceKind !== 'PKT') return false;
  const packets = subject.output_binding.packet_ids;
  const captures = packetWideningCaptures(model).filter((capture) => capture.selectors.some((selector) =>
    selector.output_kind === 'packet-candidate' && same(selector.packet_ids, packets)
      && subject.producer_binding_hash === semanticProducerBinding({
        call_id: capture.call_id, context_id: capture.context_id, raw_return_hash: capture.raw_digest,
        output_kind: selector.output_kind, output_index: Number(selector.output_index),
      })));
  if (captures.length !== 1 || !captures[0].work_provenance) return false;
  const capture = captures[0], provenance = capture.work_provenance!;
  exactKeys(provenance, ['work_record_base64', 'acceptance_record_base64'], 'C06 work provenance');
  const record = (value: unknown, label: string): Record<string, unknown> => {
    assertWidening(value !== null && typeof value === 'object' && !Array.isArray(value), label);
    return value as Record<string, unknown>;
  };
  const sealed = (encoded: string, label: string) => {
    assertWidening(typeof encoded === 'string', label);
    const raw = Buffer.from(encoded, 'base64'), value = record(parseStrictJson(raw), label);
    assertWidening(raw.toString('base64') === encoded && raw.equals(canonicalJsonBytes(value)), `${label} canonical bytes`);
    const { digest, ...body } = value;
    assertWidening(digest === wideningHash(canonicalJsonBytes(body)), `${label} digest`);
    return value;
  };
  const work = sealed(provenance.work_record_base64, 'C06 work'), acceptance = sealed(provenance.acceptance_record_base64, 'C06 acceptance');
  const identity = record(work.identity, 'C06 identity'), selected = record(identity.work, 'C06 selected work');
  const obligation = record(selected.obligation, 'C06 obligation'), call = record(work.call, 'C06 call');
  const pins = record(identity.pins, 'C06 pins'), ledger = record(identity.ledger, 'C06 ledger');
  const state = record(parseStrictJson(bytes(model, 'control/run-state.json')), 'C06 current state');
  assertWidening(work.work_id === `WORK-${wideningHash(canonicalJsonBytes(identity)).slice(7)}`
    && identity.run_id === model.manifest.runId && state.run_id === identity.run_id
    && same(state.identity, pins) && pins.run_format_version === model.manifest.runFormatVersion
    && selected.kind === 'worker' && obligation.stage === 'S3' && obligation.operation === 's3.capture-widening'
    && obligation.subject_id === `${capture.basis.normalizer_call_id}:${capture.basis.output_selector}:widen-request:${capture.basis.request_index}`
    && obligation.subject_digest === wideningHash(canonicalJsonBytes(capture.basis))
    && call.call_id === capture.call_id && call.role === 'extractor' && call.kind === 'producer'
    && call.output_selector === WIDENING_CONTRACT && call.task_line === WIDENING_TASK,
  'C06 exact durable widening work required');
  assertWidening(acceptance.work_id === work.work_id && acceptance.work_digest === work.digest
    && acceptance.digest === capture.receipt_digest && acceptance.call_id === capture.call_id
    && acceptance.raw_digest === capture.raw_digest && acceptance.context_id === capture.context_id
    && acceptance.producer_context_id === capture.producer_context_id && acceptance.simulation === capture.simulation
    && acceptance.checkpoint === identity.checkpoint && acceptance.basis_digest === work.basis_digest
    && typeof identity.checkpoint === 'string' && /^sha256:[0-9a-f]{64}$/u.test(identity.checkpoint),
  'C06 work/acceptance/checkpoint binding differs');
  assertWidening(Array.isArray(identity.dependencies) && identity.dependencies.some((entry) =>
    record(entry, 'C06 dependency').call_id === capture.basis.normalizer_call_id),
  'C06 triggering normalizer dependency missing');
  const journal = record(parseStrictJson(bytes(model, `control/transactions/TXN-work-${String(work.work_id).slice(5)}.json`)), 'C06 journal');
  const { digest, status, ...body } = journal;
  const plan = record(journal.plan, 'C06 plan'), before = record(journal.state_before, 'C06 before');
  const execution = record(before.execution, 'C06 execution'), resume = record(execution.resume, 'C06 resume');
  const checkpoint = (state: Record<string, unknown>) => {
    const projected = structuredClone(state);
    record(record(projected.execution, 'C06 checkpoint execution').resume, 'C06 checkpoint resume').checkpoint_digest = '';
    return wideningHash(canonicalJsonBytes(projected));
  };
  assertWidening(status === 'committed' && digest === wideningHash(canonicalJsonBytes(body))
    && journal.work_id === work.work_id && same(plan.obligation, obligation)
    && same(before.identity, identity.pins) && before.run_id === identity.run_id
    && same(before.ledger, ledger) && execution.stage === 'S3' && resume.checkpoint_digest === identity.checkpoint
    && checkpoint(before) === identity.checkpoint
    && checkpoint(state) === record(record(state.execution, 'C06 state execution').resume, 'C06 state resume').checkpoint_digest,
  'C06 committed transaction stage/run/work/checkpoint differs');
  const intent = { format: 'aleph-loa-orchestration-commit/v1', work_id: work.work_id, work_digest: work.digest,
    acceptance_digest: acceptance.digest, plan_digest: wideningHash(canonicalJsonBytes(plan)),
    before_checkpoint: identity.checkpoint, before_chain: ledger.chain_head,
    journal: `control/transactions/TXN-work-${String(work.work_id).slice(5)}.json` };
  assertWidening(journal.intent_digest === wideningHash(canonicalJsonBytes(intent))
    && typeof journal.chain_before === 'string' && typeof journal.chain_after === 'string'
    && journal.chain_after.startsWith(journal.chain_before)
    && bytes(model, 'control/ledger-chain.jsonl').toString().startsWith(journal.chain_after),
  'C06 committed chain/intent differs');
  const chain = bytes(model, 'control/ledger-chain.jsonl').toString().trim().split('\n').filter(Boolean);
  let previous: unknown;
  for (const line of chain) {
    const receipt = record(parseStrictJson(line), 'C06 chain receipt'), { chain_digest, ...body } = receipt;
    assertWidening(chain_digest === wideningHash(canonicalJsonBytes(body))
      && (previous === undefined || receipt.previous_chain_digest === previous), 'C06 chain receipt differs');
    previous = chain_digest;
  }
  assertWidening(previous === record(state.ledger, 'C06 current ledger').chain_head, 'C06 current chain head differs');
  const effects = plan.effects;
  assertWidening(Array.isArray(effects), 'C06 effects required');
  const captured = effects.filter((effect) => record(effect, 'C06 effect').path === `${WIDENING_CAPTURES}${capture.call_id}.json`);
  assertWidening(captured.length === 1, 'C06 exact capture effect required');
  const effect = record(captured[0], 'C06 capture effect');
  assertWidening(effect.before_digest === null && effect.after_base64 === canonicalJsonBytes(capture).toString('base64')
    && effect.after_digest === wideningHash(canonicalJsonBytes(capture)), 'C06 accepted capture changed');
  const selector = capture.selectors.find((entry) => same(entry.packet_ids, packets))!;
  const returned = parseStrictJson(bytes(model, `control/worker-returns/${capture.call_id}/raw.json`)) as {
    semantic_units: Array<{ output_kind: string; output_index: number; semantics: unknown }> };
  const entry = returned.semantic_units.find((entry) => entry.output_kind === selector.output_kind
    && entry.output_index === Number(selector.output_index));
  assertWidening(entry && same(entry.semantics, subject.semantics)
    && subject.predecessor_semantic_id === 'none' && packets.includes(row.values.sourceId)
    && same(subject.packet_basis.map((basis) => basis.packet.packet_id), packets),
  'C06 fresh subject or exact producer semantics differs');
  const proposal = subject.semantics.relation_proposals.find((proposal) =>
    relationReviewSubjectJson(semanticRelationRow(proposal).values) === relationReviewSubjectJson(row.values));
  assertWidening(proposal && proposal.subject.owner_stage === subject.owner_stage
    && proposal.subject.proposed_by === `invocation:${capture.call_id}`
    && same(proposal.subject.basis_packet_ids, packets)
    && proposal.review_subject_digest === wideningHash(semanticJson(proposal.subject))
    && row.values.reviewSubjectDigest === proposal.review_subject_digest,
  'C06 exact relation/source/basis/digest differs');
  const semanticLedger = parseSemanticLedger(bytes(model, 'ledgers/semantic-review.md').toString());
  const rows = semanticLedger.subjects.filter((entry) => entry.semantic_id === subject.semantic_id);
  const owners = semanticLedger.subjects.filter((entry) => entry.producer_receipt_ref.startsWith(`${selector.binding_path}@`));
  assertWidening(owners.length <= 1 && (!owners.length || owners[0].semantic_id === subject.semantic_id),
    'C06 original selector cannot acquire another semantic subject');
  assertWidening(rows.length <= 1 && (!rows.length || rows[0].owner_stage === 'S3'
    && rows[0].subject_digest === wideningHash(semanticJson(subject))
    && bytes(model, rows[0].subject_path).equals(Buffer.from(semanticJson(subject)))),
  'C06 retained semantic subject digest differs');
  const currentStage = record(state.execution, 'C06 current execution').stage;
  assertWidening(typeof currentStage === 'string' && /^S(?:[3-9]|1[0-3])$/u.test(currentStage)
    && (rows.length === 1 || currentStage === 'S3'),
    'C06 fresh subject requires current S3');
  return true;
}

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { mdLineSpan, sourceFilePath } from './check-helpers.js';
import { lineageCurrentPacketIds, parseLineage } from './lineage.js';
import { hasRunCapability } from './run-model.js';
import { canonicalJsonBytes } from './bundle-format.js';
import { parseStrictJson } from './worker-return-contract.js';
import { framedExactEvidenceHash } from './checks-k2.js';
import { semanticClaimCell } from './semantic-review.js';
export const WIDENING_RETURN_FORMAT = 'aleph-s3-packet-widening-return/v1';
export const WIDENING_CONTRACT = 'S3 — bounded packet widening (1.9)';
export const WIDENING_TASK = 'Propose exact packet semantics and material use only for the retained S3 widening request. Preserve the requested frozen source bounds and predecessor bytes. Emit no claims, primary walk intervals, extraction events or cursors.';
export const WIDENING_PREPARATIONS = 'verification/harness/packet-widening/preparations/';
export const WIDENING_CAPTURES = 'verification/harness/packet-widening/captures/';
export function wideningHash(bytes) {
    return `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
}
export function assertWidening(condition, detail) {
    if (!condition)
        throw new Error(`WORK_WIDENING: ${detail}`);
}
function bytes(model, path) {
    const file = model.files.find((file) => file.relativePath === path);
    return file ? Buffer.from(file.text) : readFileSync(join(model.runDir, path));
}
function exactKeys(value, keys, label) {
    assertWidening(value !== null && typeof value === 'object' && !Array.isArray(value)
        && Object.keys(value).sort().join('\0') === [...keys].sort().join('\0'), `${label}: closed fields required`);
}
function same(left, right) {
    return isDeepStrictEqual(left, right);
}
export function wideningCallId(basis) {
    return `CALL-F03-${wideningHash(canonicalJsonBytes(basis)).slice(7)}`;
}
export function derivePacketWideningBasis(model, normalizerCallId, outputIndex, requestIndex) {
    assertWidening(hasRunCapability(model.manifest?.runFormatVersion || '', 'orchestrator-work-transitions'), 'requires the pinned 1.9 orchestration capability');
    assertWidening(/^CALL-F03-[0-9a-f]{64}$/u.test(normalizerCallId)
        && Number.isSafeInteger(outputIndex) && outputIndex >= 0 && Number.isSafeInteger(requestIndex) && requestIndex >= 0, 'exact original invocation and selector indexes required');
    const raw = bytes(model, `control/worker-returns/${normalizerCallId}/raw.json`);
    const returned = parseStrictJson(raw);
    const capture = parseStrictJson(bytes(model, `verification/harness/work-captures/S3/${normalizerCallId}.json`));
    assertWidening(capture.format === 'aleph-s3-work-capture/v1' && capture.call_id === normalizerCallId
        && capture.raw_digest === wideningHash(raw) && capture.selectors.some((selector) => selector.output_kind === 'claim-candidate' && selector.output_index === String(outputIndex)), 'original accepted normalizer capture and claim selector required');
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
    for (const row of covered)
        if (Number(row.values.startByte) <= frontier)
            frontier = Math.max(frontier, Number(row.values.endByte));
    assertWidening(frontier >= span.endByte, 'requested span escapes already-accounted S2 coverage');
    const seal = bytes(model, 'verification/harness/semantic-stage-seals/S2.json');
    const parsedSeal = parseStrictJson(seal);
    assertWidening(parsedSeal.format === 'aleph-semantic-stage-seal/v1' && parsedSeal.stage === 'S2', 'original S2 seal required');
    return { format: 'aleph-s3-packet-widening-basis/v1', run_id: model.manifest.runId,
        run_format: model.manifest.runFormatVersion, capability: 'orchestrator-work-transitions', owner_stage: 'S3',
        normalizer_call_id: normalizerCallId, normalizer_raw_digest: wideningHash(raw),
        output_selector: `claim-candidate:${outputIndex}`, request_index: String(requestIndex), request: { ...request },
        source_id: source.values.sourceId, source_path: relative(model.runDir, sourcePath).replaceAll('\\', '/'),
        source_hash: source.values.contentHash, start_byte: String(span.startByte), end_byte: String(span.endByte),
        exact_bytes_base64: span.bytes.toString('base64'), predecessor_cells: [...predecessor.cells],
        s2_seal_digest: wideningHash(seal), source_walk_digest: wideningHash(bytes(model, 'ledgers/source-walk.md')),
        lineage_digest: wideningHash(bytes(model, 'ledgers/lineage.md')),
        packet_inventory_digest: wideningHash(bytes(model, 'ledgers/packet-index.md')), operation_family: 'bounded-packet-widening' };
}
/** Reopening history never refreshes a saved request to the current checkpoint. */
export function validatePacketWideningBasis(model, basis, retained = false) {
    exactKeys(basis, ['format', 'run_id', 'run_format', 'capability', 'owner_stage', 'normalizer_call_id',
        'normalizer_raw_digest', 'output_selector', 'request_index', 'request', 'source_id', 'source_path', 'source_hash',
        'start_byte', 'end_byte', 'exact_bytes_base64', 'predecessor_cells', 's2_seal_digest', 'source_walk_digest',
        'lineage_digest', 'packet_inventory_digest', 'operation_family'], 'widening basis');
    assertWidening(basis.format === 'aleph-s3-packet-widening-basis/v1' && basis.run_id === model.manifest?.runId
        && basis.run_format === model.manifest.runFormatVersion && basis.owner_stage === 'S3'
        && basis.capability === 'orchestrator-work-transitions' && basis.operation_family === 'bounded-packet-widening'
        && hasRunCapability(basis.run_format, basis.capability), 'run, format, stage and family binding differs');
    const match = /^claim-candidate:(0|[1-9]\d*)$/u.exec(basis.output_selector);
    assertWidening(match, 'original claim selector required');
    if (!retained) {
        assertWidening(canonicalJsonBytes(derivePacketWideningBasis(model, basis.normalizer_call_id, Number(match[1]), Number(basis.request_index))).equals(canonicalJsonBytes(basis)), 'request/predecessor/source before-state changed');
        return;
    }
    const raw = bytes(model, `control/worker-returns/${basis.normalizer_call_id}/raw.json`);
    const returned = parseStrictJson(raw);
    const claim = returned.claims[Number(match[1])], packet = model.packets.find((row) => row.values.packetId === basis.request.packet);
    assertWidening(wideningHash(raw) === basis.normalizer_raw_digest
        && canonicalJsonBytes(claim.widen_requests[Number(basis.request_index)]).equals(canonicalJsonBytes(basis.request))
        && claim.packets.includes(basis.request.packet) && packet?.values.sourceId === basis.source_id
        && canonicalJsonBytes(packet.cells).equals(canonicalJsonBytes(basis.predecessor_cells)), 'retained request and original packet bytes differ');
    const source = model.corpus.sources.find((row) => row.values.sourceId === basis.source_id);
    const sourcePath = source && sourceFilePath(model.runDir, source.values.locus);
    assertWidening(sourcePath && relative(model.runDir, sourcePath).replaceAll('\\', '/') === basis.source_path, 'retained frozen source identity differs');
    const frozen = readFileSync(sourcePath), locus = /^L([1-9]\d*)-L([1-9]\d*)$/u.exec(basis.request.new_locator);
    const span = locus && mdLineSpan(sourcePath, Number(locus[1]), Number(locus[2]));
    assertWidening(wideningHash(frozen) === basis.source_hash && source.values.contentHash === basis.source_hash
        && span?.bytes && String(span.startByte) === basis.start_byte && String(span.endByte) === basis.end_byte
        && span.bytes.toString('base64') === basis.exact_bytes_base64, 'retained requested exact source locus differs');
    assertWidening(wideningHash(bytes(model, 'verification/harness/semantic-stage-seals/S2.json')) === basis.s2_seal_digest
        && wideningHash(bytes(model, 'ledgers/source-walk.md')) === basis.source_walk_digest, 'post-S2 work changed sealed S2 or primary source-walk history');
}
export function packetWideningCaptures(model) {
    return model.files.filter((file) => file.relativePath.startsWith(WIDENING_CAPTURES)).map((file) => {
        const value = parseStrictJson(file.text);
        exactKeys(value, ['format', 'basis', 'call_id', 'raw_digest', 'context_id', 'producer_context_id',
            'receipt_digest', 'simulation', 'lineage_id', 'lineage_type', 'selectors'], 'widening capture');
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
function validateCapturedOutputs(model, capture, raw) {
    const returned = parseStrictJson(raw);
    assertWidening(returned.format === WIDENING_RETURN_FORMAT && returned.source_id === capture.basis.source_id
        && returned.producer_invocation_id === capture.call_id && Array.isArray(returned.packets)
        && Array.isArray(returned.material_findings) && Array.isArray(returned.semantic_units), 'retained producer must use the dedicated source and invocation');
    const expected = [...returned.packets.map((_, index) => `packet-candidate:${index}`),
        ...returned.material_findings.map((_, index) => `material-candidate:${index}`)];
    assertWidening(expected.length > 0 && same(capture.selectors.map((s) => `${s.output_kind}:${s.output_index}`), expected)
        && same(returned.semantic_units.map((s) => `${s.output_kind}:${s.output_index}`), expected), 'complete original ordered selectors required exactly once');
    const packetIds = new Set(), evidenceIds = new Set();
    for (const selector of capture.selectors) {
        exactKeys(selector, ['output_kind', 'output_index', 'packet_ids', 'evidence_key', 'binding_path'], 'widening selector');
        assertWidening(selector.binding_path === `control/semantic-producer-bindings/${capture.call_id}/${selector.output_kind}-${selector.output_index}.json`
            && Array.isArray(selector.packet_ids), 'original producer selector path required');
        const tuple = parseStrictJson(bytes(model, selector.binding_path));
        assertWidening(same(tuple, { call_id: capture.call_id, context_id: capture.context_id,
            raw_return_hash: capture.raw_digest, output_kind: selector.output_kind, output_index: Number(selector.output_index) }), 'original producer binding differs');
        if (selector.output_kind === 'material-candidate') {
            assertWidening(selector.packet_ids.length === 0 && selector.evidence_key === null, 'material findings cannot replace packet selectors');
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
            selector.packet_ids.join(', '), 'exact', String(exact.length), String(candidate.join_policy), hash, 'none', 'none', 'none']), 'canonical exact evidence differs from the widening candidate');
        const fragments = model.exactEvidence.fragments.filter((row) => row.values.evidenceKey === selector.evidence_key);
        assertWidening(fragments.length === exact.length, 'complete ordered fragment set required');
        selector.packet_ids.forEach((id, index) => {
            assertWidening(/^PKT-\d{4,}$/u.test(id) && !packetIds.has(id) && id !== capture.basis.request.packet, 'unique new packet identities required');
            packetIds.add(id);
            const fragment = candidate.fragments[index], packets = model.packets.filter((row) => row.values.packetId === id);
            assertWidening(packets.length === 1 && same(packets[0].cells, [id, capture.basis.source_id, fragment.locator, wideningHash(exact[index]), exact[index].toString('utf8'),
                String(candidate.criterion), 'active'].map(semanticClaimCell)), 'packet row differs from original producer fragment');
            assertWidening(same(fragments[index].cells.slice(1), [selector.evidence_key, id, String(fragment.fragment_order),
                capture.basis.source_id, fragment.locator, 'frozen-source', 'exact-source-bytes',
                wideningHash(exact[index]), fragment.exact_bytes_base64]), 'fragment identity, order or exact bytes differ');
        });
        const transformations = model.exactEvidence.transformations.filter((row) => row.values.evidenceKey === selector.evidence_key);
        assertWidening(transformations.length === 1 && same(transformations[0].cells.slice(1), [selector.evidence_key, 'rendered', hash, hash, candidate.rendered_text, wideningHash(candidate.rendered_text)].map(semanticClaimCell)), 'rendered derivative differs from producer bytes');
    }
    if (packetIds.size === 0) {
        assertWidening(capture.lineage_id === null && capture.lineage_type === null, 'material refusal creates no packet lineage');
        return;
    }
    const lineage = parseLineage(model).rows.filter((row) => row.values.lineageId === capture.lineage_id);
    assertWidening(lineage.length === 1 && lineage[0].values.ownerStage === 'S3'
        && lineage[0].values.establishedBy === capture.call_id && lineage[0].values.predecessors === capture.basis.request.packet
        && lineage[0].values.type === capture.lineage_type && capture.lineage_type === (packetIds.size === 1 ? 'replace' : 'split')
        && same(lineage[0].values.successors.split(',').map((id) => id.trim()), [...packetIds]), 'exact retained predecessor/successor lineage required');
}
export function packetWideningReceiptAuthorized(model, packetId, producerCallId) {
    const matching = packetWideningCaptures(model).filter((capture) => capture.call_id === producerCallId
        && capture.selectors.some((selector) => selector.output_kind === 'packet-candidate' && selector.packet_ids.includes(packetId)));
    if (matching.length !== 1)
        return false;
    const capture = matching[0], lineage = parseLineage(model).rows.find((row) => row.values.lineageId === capture.lineage_id);
    const packets = capture.selectors.flatMap((selector) => selector.packet_ids);
    assertWidening(lineage?.values.ownerStage === 'S3' && lineage.values.establishedBy === producerCallId
        && lineage.values.predecessors === capture.basis.request.packet && lineage.values.type === capture.lineage_type
        && canonicalJsonBytes(lineage.values.successors.split(',').map((id) => id.trim())).equals(canonicalJsonBytes(packets)), 'exact existing PKT lineage required');
    return true;
}
export function isPostS2WidenedPacket(model, packetId) {
    if (!hasRunCapability(model.manifest?.runFormatVersion || '', 'orchestrator-work-transitions'))
        return false;
    const captures = packetWideningCaptures(model).filter((capture) => capture.selectors.some((selector) => selector.packet_ids.includes(packetId)));
    assertWidening(captures.length <= 1, 'one widening capture per new packet required');
    return captures.length === 1 && packetWideningReceiptAuthorized(model, packetId, captures[0].call_id);
}

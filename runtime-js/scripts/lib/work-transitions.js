import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseStrictJson } from './worker-return-contract.js';
import { canonicalJsonBytes } from './bundle-format.js';
import { hasRunCapability, parsePackets, parseExactEvidence } from './run-model.js';
import { parseTables, parseBulletFields } from './markdown.js';
import { mdLineSpan, sourceFilePath } from './check-helpers.js';
import { semanticClaimCell, SEMANTIC_PATH, emptySemanticLedger, semanticLedgerMarkdown, degradedPacketBinding, semanticProducerBinding, semanticDegradedMaterialViews, buildSemanticSubject, semanticProducerSelections, semanticProducerView, semanticProducerViewPaths, semanticProducerTask, semanticJson, validateSemanticReturn, parseSemanticLedger, semanticSubjectPath, semanticAssignmentPath, semanticResultPath, semanticAttachmentPaths, semanticMaterialViews, semanticAdmissionProblems, semanticStageSeal, planSemanticWrite, validateSemanticAcceptedBindings, validateSemanticRun, canonicalClaimModel, useRowFromSubject, semanticOriginProjection, SEMANTIC_ASSIGNMENT_FORMAT, SEMANTIC_TASK, } from './semantic-review.js';
import { framedExactEvidenceHash, runK2, sourceWalkReviewBasisDigest } from './checks-k2.js';
import { ResultCollector } from './results.js';
import { parseLineage, lineageCurrentPacketIds, LINEAGE_TABLE_HEADER } from './lineage.js';
import { deriveSourceWalkCompletion, derivePendingEventCommitment, validateSourceWalkCompletionWrite, projectSourceWalk } from './source-walk-transition.js';
import { readRepresentationContext, representationUseDigest, representationUsesMarkdown, validateRepresentationRun, planRepresentationUseWrite, validateRepresentationUse, REPRESENTATION_USE_PATH, materialFindingRows, selectRepresentationInventory, } from './source-representation.js';
export const WORK_TRANSITION_CAPABILITY = 'orchestrator-work-transitions';
export const WORK_STAGE_CONTRACT = 'docs/architecture/04-pipeline-stages-and-dod.md';
export const CRITERIA_REVIEW_TASK = 'Challenge candidacy agreement and sample adequacy using only the sealed criteria and frozen samples.';
export const INTAKE_WORK_TASK = 'Finalize the frozen source inventory and draft extraction criteria without conclusions or sensitivity rulings.';
export const CRITERIA_SUBJECT_PATH = 'verification/harness/S1/criteria-subject.json';
export const CRITERIA_SAMPLE_PROPOSAL_PATH = 'verification/harness/S1/criteria-sample-proposal.json';
export const CRITERIA_SAMPLE_INPUT_PATH = 'control/work-proposals/S1-criteria-samples.json';
export const CRITERIA_REVIEW_PATHS = [
    'verification/harness/S1/criteria-review-1.json',
    'verification/harness/S1/criteria-review-2.json',
];
/** Mechanical S2 derivation: one original selector, with no canonical PKT/CC/USE invention. */
export function deriveS2DegradedSubject(model, accepted, outputIndex, semanticId, reviewerProfile) {
    assertWork(accepted.role === 'extractor', 'WORK_ACCEPTANCE', 'degraded packet requires its extractor');
    const binding = degradedPacketBinding(model.manifest.runFormatVersion, accepted.value, outputIndex);
    const hash = semanticProducerBinding({ call_id: accepted.call_id, context_id: accepted.context_id,
        raw_return_hash: accepted.raw_digest, output_kind: 'packet-candidate', output_index: outputIndex });
    return buildSemanticSubject(model, { semantic_id: semanticId, owner_stage: 'S2', subject_kind: 'degraded-packet',
        review_mode: binding.entry.review_mode, predecessor_semantic_id: 'none', producer_binding_hash: hash,
        reviewer_profile: reviewerProfile, output_binding: binding.output_binding,
        origin_unit_refs: binding.entry.origin_unit_refs, origin_context: [], anchors: binding.entry.anchors,
        semantics: binding.entry.semantics, material_use: binding.material_use,
        material_views: semanticDegradedMaterialViews(model, binding.output_binding, hash, binding.material_use),
        lineage_context: [], relation_context: [], ambiguity_context: [] });
}
export function workDigest(bytes) {
    return `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
}
export function workJson(value) {
    const bytes = canonicalJsonBytes(value);
    parseStrictJson(bytes);
    return bytes;
}
export function workFailure(code, detail) {
    throw new Error(`${code}: ${detail}`);
}
export function assertWork(condition, code, detail) {
    if (!condition)
        workFailure(code, detail);
}
function record(value, keys, label) {
    assertWork(value !== null && typeof value === 'object' && !Array.isArray(value)
        && Object.keys(value).sort().join('\0') === [...keys].sort().join('\0'), 'WORK_CONTRACT', label);
}
function text(value, label) {
    assertWork(typeof value === 'string' && value.trim().length > 0, 'WORK_CONTRACT', label);
}
function file(model, path) {
    const found = model.files.find((entry) => entry.relativePath === path);
    if (!found && /^control\/semantic-producer-context\/CALL-F03-[0-9a-f]{64}\.json$/u.test(path)) {
        const full = join(model.runDir, path);
        return existsSync(full) ? readFileSync(full) : null;
    }
    return found ? Buffer.from(found.text, 'utf8') : null;
}
function required(model, path) {
    const bytes = file(model, path);
    assertWork(bytes, 'WORK_PREREQUISITE', path);
    return bytes;
}
function obligation(stage, dod, operation, subject, bytes) {
    return { stage, subphase: stage, dod, operation, subject_id: subject, subject_digest: workDigest(bytes) };
}
function effect(model, path, bytes) {
    const before = file(model, path);
    return { path, before_digest: before === null ? null : workDigest(before), after_base64: bytes.toString('base64'), after_digest: workDigest(bytes) };
}
function table(headers, rows) {
    return `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n`
        + rows.map((row) => `| ${row.map(semanticClaimCell).join(' | ')} |\n`).join('');
}
function appendRows(bytes, firstHeader, rows) {
    if (!rows.length)
        return bytes;
    const text = bytes.toString('utf8'), matches = parseTables(text).filter((entry) => entry.header[0] === firstHeader && entry.header.length === rows[0].length);
    assertWork(matches.length === 1, 'WORK_TABLE', `unique ${firstHeader} table required`);
    const target = matches[0], lines = text.split('\n');
    assertWork(rows.every((row) => row.length === target.header.length), 'WORK_TABLE', 'row arity');
    lines.splice(target.line + target.rows.length + 1, 0, ...table(target.header, rows).trimEnd().split('\n').slice(2));
    return Buffer.from(lines.join('\n'));
}
const PACKET_TABLES = [
    ['packet_id', 'source_id', 'locator', 'span_hash', 'quote', 'criterion', 'status'],
    ['evidence_key', 'packet_ids', 'evidence_state', 'fragment_count', 'join_policy', 'exact_evidence_hash', 'degraded_source_id', 'degraded_source_locator', 'degradation_reason'],
    ['fragment_key', 'evidence_key', 'packet_id', 'fragment_order', 'source_id', 'locator', 'source_relation', 'byte_role', 'fragment_hash', 'exact_bytes_base64'],
    ['transform_key', 'evidence_key', 'output_role', 'predecessor_exact_evidence_hash', 'effective_exact_evidence_hash', 'output_text', 'output_text_hash'],
];
const WALK_TABLES = [
    ['walk_id', 'source_id', 'start_byte', 'end_byte', 'outcome', 'packet_ids', 'criterion_ref', 'producer_invocation_id', 'closure_state', 'reason', 'closure_note'],
    ['event_id', 'source_id', 'start_byte', 'end_byte', 'shared_position_key', 'event_ordinal', 'packet_id', 'origin', 'producer_invocation_id', 'status'],
    ['cursor_id', 'source_id', 'byte_offset', 'shared_position_key', 'next_event_ordinal', 'predecessor_walk_id', 'predecessor_event_id', 'source_hash', 'reason'],
    ['gap_review_id', 'source_id', 'producer_invocation_id', 'reviewer_invocation_id', 'review_basis_cursor_id', 'review_basis_digest', 'result', 'candidate_start_byte', 'candidate_end_byte', 'proposed_packet_id', 'reconciliation_event_id', 'status', 'note'],
    ['source_id', 'source_hash', 'source_length_bytes', 'final_cursor_id', 'gap_review_ids', 'completion_state', 'declared_by', 'note'],
];
function projectedPackets(model, bytes) {
    const path = 'ledgers/packet-index.md', text = bytes.toString('utf8');
    const document = { path: join(model.runDir, path), relativePath: path, text, lines: text.split('\n'),
        tables: parseTables(text, path), bullets: parseBulletFields(text) };
    return { ...model, packetDocument: document, documents: new Map([...model.documents, [path, document]]),
        packets: parsePackets(document), exactEvidence: parseExactEvidence(document),
        files: [...model.files.filter((file) => file.relativePath !== path), { path: document.path, relativePath: path, text }] };
}
function s2Entry(model, now) {
    const packets = '# Packet Index\n\n- exact_evidence_format: aleph-exact-evidence/v1\n\n'
        + PACKET_TABLES.map((headers, index) => `## ${['Packets', 'Exact evidence records', 'Exact fragments', 'Evidence transformations'][index]}\n\n${table(headers, [])}\n`).join('');
    let walk = '# Source Walk Ledger\n\n- source_walk_format: aleph-source-walk/v1\n- source_position_format: zero-based-utf8-byte-half-open/v1\n\n'
        + WALK_TABLES.map((headers, index) => `## ${['Primary walk intervals', 'Extraction events', 'Resume cursors', 'Fresh gap reviews', 'Per-source completion'][index]}\n\n${table(headers, [])}\n`).join('');
    walk = appendRows(Buffer.from(walk), 'cursor_id', model.corpus.sources.map((source, index) => [`CUR-${String(index + 1).padStart(4, '0')}`, source.values.sourceId, '0', 'none', 'none', 'none', 'none', source.values.contentHash, 'initial'])).toString('utf8');
    const source_completion = deriveSourceWalkCompletion(model, projectSourceWalk(projectedPackets(model, Buffer.from(packets)), walk));
    walk = Buffer.from(source_completion.after_base64, 'base64').toString('utf8');
    const files = {
        'ledgers/packet-index.md': packets, 'ledgers/source-walk.md': walk,
        [SEMANTIC_PATH]: semanticLedgerMarkdown(emptySemanticLedger()),
        'ledgers/lineage.md': '# Unit Lineage\n\n- lineage_format: aleph-lineage/v1\n\n'
            + table(['lineage_id', 'owner_stage', 'type', 'predecessors', 'successors', 'basis', 'established_by'], []),
    };
    const effects = Object.entries(files).map(([path, text]) => {
        assertWork(!file(model, path), 'WORK_STAGE_ENTRY', `${path} predates S2 preparation`);
        return effect(model, path, Buffer.from(text));
    });
    assertWork(!model.manifest.states.some((row) => row.values.state === 'DISTILLING'), 'WORK_STAGE_ENTRY', 'DISTILLING already entered');
    effects.push(effect(model, 'run-manifest.md', appendRows(required(model, 'run-manifest.md'), '#', [[String(model.manifest.states.length + 1), 'DISTILLING', now, 'orchestrator', 'S1 criteria agreement recorded; bounded extraction begins.']])));
    return { effects, source_completion };
}
const S2_PREPARATIONS = 'verification/harness/work-preparations/';
const S2_CAPTURES = 'verification/harness/work-captures/';
const GAP_SUBJECTS = 'verification/harness/gap-review-subjects/';
const GAP_RETURNS = 'verification/harness/gap-review-returns/';
const GAP_PRODUCERS = 'verification/harness/gap-producer-subjects/';
const GAP_RECONCILIATIONS = 'verification/harness/gap-reconciliations/';
const GAP_TASK = 'Challenge primary recall using only this one frozen source, criteria, walk accounting, exact evidence and source-local material.';
function gapSubject(model, sourceId) {
    const source = model.corpus.sources.find((row) => row.values.sourceId === sourceId);
    const cursor = model.sourceWalk.cursors.filter((row) => row.values.sourceId === sourceId).at(-1);
    const digest = sourceWalkReviewBasisDigest(model, sourceId, cursor.values.cursorId);
    assertWork(digest && cursor.values.reason === 'source-complete', 'WORK_GAP_BASIS', 'terminal primary cursor required');
    const ids = model.sourceWalk.events.filter((row) => row.values.sourceId === sourceId && row.values.origin === 'primary')
        .map((row) => row.values.packetId);
    const evidence = model.exactEvidence.records.filter((row) => row.values.packetIds.split(',').some((id) => ids.includes(id.trim())));
    const inventory = selectRepresentationInventory(readRepresentationContext(model).inventory, [sourceId]);
    const material = { inventory, assets: inventory.assets.map((asset) => ({
            asset_id: asset.asset_id, content_hash: asset.content_hash,
            exact_bytes_base64: readFileSync(join(model.runDir, asset.locus)).toString('base64'),
        })) };
    const bytes = Buffer.from(semanticJson({
        format: 'aleph-source-gap-review-subject/v1', source_id: sourceId,
        source_hash: source.values.contentHash, review_basis_cursor_id: cursor.values.cursorId, review_basis_digest: digest,
        frozen_source_base64: readFileSync(sourceFilePath(model.runDir, source.values.locus)).toString('base64'),
        criteria_base64: required(model, 'ledgers/extraction-criteria.md').toString('base64'),
        primary_intervals: model.sourceWalk.intervals.filter((row) => row.values.sourceId === sourceId).map(({ values }) => {
            const { producerInvocationId: _producer, reason: _rationale, closureNote: _note, ...accounting } = values;
            return accounting;
        }),
        primary_events: model.sourceWalk.events.filter((row) => row.values.sourceId === sourceId && row.values.origin === 'primary').map(({ values }) => {
            const { producerInvocationId: _producer, ...accounting } = values;
            return accounting;
        }),
        packets: model.packets.filter((row) => ids.includes(row.values.packetId)).map((row) => row.values),
        evidence: evidence.map((row) => row.values),
        fragments: model.exactEvidence.fragments.filter((row) => ids.includes(row.values.packetId)).map((row) => row.values),
        transformations: model.exactEvidence.transformations.filter((row) => evidence.some((e) => e.values.evidenceKey === row.values.evidenceKey)).map((row) => row.values),
        material,
    }));
    return { bytes, digest, cursor, path: `${GAP_SUBJECTS}${digest.slice(7)}.json` };
}
function selectGapWork(model, sourceId) {
    const subject = gapSubject(model, sourceId);
    const calls = s2Captures(model).filter((capture) => capture.source_id === sourceId).map((capture) => capture.call_id);
    assertWork(calls.length > 0, 'WORK_GAP_BASIS', 'authenticated primary producer required');
    const resultPath = `${GAP_RETURNS}${subject.digest.slice(7)}.json`;
    if (file(model, resultPath)) {
        const completed = parseStrictJson(required(model, resultPath));
        if (completed.verdict === 'refuted' && !file(model, `${GAP_RECONCILIATIONS}${subject.digest.slice(7)}.json`)) {
            const targetPath = `${GAP_PRODUCERS}${subject.digest.slice(7)}.json`;
            if (!file(model, targetPath))
                return { kind: 'local', accepted_dependencies: [completed.call_id],
                    obligation: obligation('S2', 'S2.gap-producer.target', 's2.prepare-gap-target', sourceId, required(model, resultPath)) };
            const callId = `CALL-F03-${workDigest(workJson({ run_id: model.manifest.runId,
                operation: 's2.gap-producer', review_basis_digest: subject.digest })).slice(7)}`;
            const paths = semanticProducerViewPaths(callId);
            if (!file(model, paths.selections))
                return { kind: 'local', accepted_dependencies: [completed.call_id],
                    obligation: obligation('S2', 'S2.gap-producer.prepare', 's2.prepare-gap-producer', sourceId, required(model, targetPath)) };
            const view = semanticProducerView(model, 'extractor', 'S2', parseStrictJson(required(model, paths.selections)));
            assertWork(required(model, paths.view).equals(view.bytes), 'WORK_GAP_BASIS', paths.view);
            return { kind: 'worker', accepted_dependencies: [completed.call_id],
                obligation: obligation('S2', 'S2.gap-producer.reconciliation', 's2.reconcile-gap', sourceId, view.bytes),
                call: { prepared_call_id: callId, role: 'extractor', kind: 'producer', task_line: semanticProducerTask('extractor', 'S2', false, true),
                    allowlist: [paths.view, ...view.assets.map((asset) => asset.path)].sort(), producer_dependency: null,
                    output_selector: 'Role: Extractor (S2)' } };
        }
        return model.sourceWalk.completions.find((row) => row.values.sourceId === sourceId)?.values.completionState === 'complete'
            ? null : { kind: 'halt', code: 'S2_SOURCE_COMPLETION_UNMET', reason: `${sourceId}: retained gap or walk obligations remain unmet.` };
    }
    if (!file(model, subject.path))
        return { kind: 'local', accepted_dependencies: calls,
            obligation: obligation('S2', 'S2.gap-review.subject', 's2.prepare-gap-review', sourceId, subject.bytes) };
    assertWork(required(model, subject.path).equals(subject.bytes), 'WORK_GAP_BASIS', 'sealed review subject changed');
    return { kind: 'worker', accepted_dependencies: calls,
        obligation: obligation('S2', 'S2.gap-review', 's2.gap-review', sourceId, subject.bytes),
        call: { role: 'verifier-l1', kind: 'refuter', task_line: GAP_TASK, allowlist: [subject.path],
            producer_dependency: calls.at(-1), output_selector: 'L1 — coverage (S2 DoD)' } };
}
function deriveGapReview(model, work, accepted) {
    const sourceId = work.obligation.subject_id, subject = gapSubject(model, sourceId);
    const value = accepted.value;
    record(value, ['verdict', 'rationale', 'attacks_tried', 'evidence_ids', 'candidate_evidence', 'missing_for_determination', 'flags'], 'L1 return');
    assertWork(['upheld', 'refuted', 'cannot-determine'].includes(String(value.verdict))
        && Array.isArray(value.candidate_evidence) && (value.verdict === 'refuted' ? value.candidate_evidence.length > 0 : value.candidate_evidence.length === 0), 'WORK_GAP_RETURN', 'verdict/candidate cardinality');
    text(value.rationale, 'L1 rationale');
    assertWork(accepted.producer_context_id && accepted.producer_context_id !== accepted.context_id, 'WORK_GAP_ISOLATION', 'fresh context differs from the primary producer');
    const source = model.corpus.sources.find((row) => row.values.sourceId === sourceId);
    const sourcePath = sourceFilePath(model.runDir, source.values.locus);
    for (const candidate of value.candidate_evidence) {
        record(candidate, ['start_byte', 'end_byte', 'source_locator', 'exact_bytes_base64'], 'L1 candidate');
        const match = /^L([1-9][0-9]*)-L([1-9][0-9]*)$/u.exec(String(candidate.source_locator));
        const span = match && mdLineSpan(sourcePath, Number(match[1]), Number(match[2]));
        assertWork(span?.bytes && span.bytes.toString('base64') === candidate.exact_bytes_base64
            && Number.isSafeInteger(candidate.start_byte) && Number.isSafeInteger(candidate.end_byte)
            && Number(candidate.start_byte) >= span.startByte && Number(candidate.end_byte) <= span.endByte
            && Number(candidate.start_byte) < Number(candidate.end_byte), 'WORK_GAP_EVIDENCE', 'exact source-local candidate required');
    }
    const retained = effect(model, `${GAP_RETURNS}${subject.digest.slice(7)}.json`, Buffer.from(semanticJson({
        format: 'aleph-source-gap-review-return/v1', source_id: sourceId, review_basis_digest: subject.digest,
        review_basis_cursor_id: subject.cursor.values.cursorId, call_id: accepted.call_id, raw_digest: accepted.raw_digest,
        receipt_digest: accepted.receipt_digest, context_id: accepted.context_id, simulation: accepted.simulation, verdict: value.verdict,
        candidate_evidence: value.candidate_evidence,
    })));
    // A found candidate is retained for its separate producer proposal. L1
    // supplies neither MaterialUseInput nor atomicity semantics.
    if (value.verdict === 'refuted')
        return { effects: [retained] };
    const id = nextId('GAP', model.sourceWalk.gapReviews.map((row) => row.values.gapReviewId));
    const primary = model.sourceWalk.intervals.find((row) => row.values.walkId === subject.cursor.values.predecessorWalkId);
    const walk = appendRows(required(model, 'ledgers/source-walk.md'), 'gap_review_id', [[id, sourceId,
            primary.values.producerInvocationId, accepted.call_id, subject.cursor.values.cursorId, subject.digest,
            value.verdict === 'upheld' ? 'no-gap-candidate-found' : 'cannot-determine',
            'none', 'none', 'none', 'none', value.verdict === 'upheld' ? 'closed' : 'blocked', value.rationale]]);
    const source_completion = deriveSourceWalkCompletion(model, projectSourceWalk(model, walk.toString()));
    return { source_completion, effects: [retained,
            effect(model, 'ledgers/source-walk.md', Buffer.from(source_completion.after_base64, 'base64'))] };
}
const S3_PREPARATIONS = 'verification/harness/work-preparations/S3/';
const S3_CAPTURES = 'verification/harness/work-captures/S3/';
const CLAIM_HEADERS = ['claim_id', 'normalized claim', 'packets', 'sources', 'claim_type',
    'disposition', 'rationale', 'judged_by', 'verified', 'status'];
function s3Captures(model) {
    return model.files.filter((entry) => entry.relativePath.startsWith(S3_CAPTURES)).map((entry) => {
        const value = parseStrictJson(entry.text);
        record(value, ['format', 'call_id', 'origin_semantic_id', 'raw_digest', 'context_id', 'producer_context_id',
            'receipt_digest', 'simulation', 'selectors'], 'S3 capture');
        assertWork(value.format === 'aleph-s3-work-capture/v1' && typeof value.call_id === 'string'
            && /^CALL-F03-[0-9a-f]{64}$/u.test(value.call_id) && entry.relativePath === `${S3_CAPTURES}${value.call_id}.json`
            && Array.isArray(value.selectors), 'WORK_CAPTURE', entry.relativePath);
        for (const selector of value.selectors) {
            record(selector, ['output_kind', 'output_index', 'reserved_claim_id', 'binding_path'], 'S3 selector');
            assertWork(['claim-candidate', 'no-claim-candidate', 'material-candidate'].includes(String(selector.output_kind))
                && typeof selector.output_index === 'string' && /^(0|[1-9]\d*)$/u.test(selector.output_index)
                && (selector.output_kind === 'claim-candidate' ? /^CC-[0-9]{4,}$/u.test(String(selector.reserved_claim_id))
                    : selector.reserved_claim_id === null)
                && selector.binding_path === `control/semantic-producer-bindings/${value.call_id}/${selector.output_kind}-${selector.output_index}.json`, 'WORK_CAPTURE', 'original normalizer selector binding');
        }
        return value;
    });
}
function semanticDependencies(model, semanticId) {
    const ledger = semanticLedger(model), row = ledger.subjects.find((entry) => entry.semantic_id === semanticId);
    assertWork(row, 'WORK_SUBJECT', semanticId);
    const binding = parseStrictJson(readFileSync(join(model.runDir, row.producer_receipt_ref.split('@')[0])));
    return [binding.call_id, ...ledger.assignments.filter((entry) => entry.semantic_id === semanticId).map((entry) => parseStrictJson(required(model, entry.assignment_path)).invocation_id)];
}
function s3Preparation(model, id) {
    return { format: 'aleph-s3-work-preparation/v1', origin_semantic_id: id,
        call_id: `CALL-F03-${workDigest(workJson({ run_id: model.manifest.runId, operation: 's3.normalize',
            origin_semantic_id: id, subject_digest: workDigest(required(model, semanticSubjectPath(id))) })).slice(7)}` };
}
function selectS3Work(model) {
    const captures = s3Captures(model), ledger = semanticLedger(model);
    for (const capture of captures) {
        const next = selectSemanticWork(model, capture);
        if (next)
            return next;
    }
    const current = lineageCurrentPacketIds(model);
    for (const row of ledger.subjects.filter((entry) => entry.owner_stage === 'S2')) {
        const subject = parseStrictJson(required(model, row.subject_path));
        if (subject.output_binding.kind !== 'packet-group' || !subject.output_binding.packet_ids.some((id) => current.has(id)))
            continue;
        if (captures.some((capture) => capture.origin_semantic_id === row.semantic_id))
            continue;
        const reviews = ledger.results.filter((entry) => entry.semantic_id === row.semantic_id)
            .map((entry) => parseStrictJson(required(model, entry.result_path)));
        if (!reviews.length || reviews.some((entry) => entry.verdict !== 'upheld'))
            return {
                kind: 'halt', code: 'WORK_ORIGIN_REVIEW_UNMET', reason: `${row.semantic_id}: retained source semantics are not upheld; no normalization inferred.`
            };
        const prep = s3Preparation(model, row.semantic_id), paths = semanticProducerViewPaths(prep.call_id);
        if (!file(model, `${S3_PREPARATIONS}${prep.call_id}.json`))
            return { kind: 'local',
                accepted_dependencies: semanticDependencies(model, row.semantic_id),
                obligation: obligation('S3', 'S3.normalization.prepare', 's3.prepare-normalizer', row.semantic_id, required(model, row.subject_path)) };
        assertWork(required(model, `${S3_PREPARATIONS}${prep.call_id}.json`).equals(workJson(prep)), 'WORK_PREPARATION', row.semantic_id);
        const view = semanticProducerView(model, 'normalizer', 'S3', parseStrictJson(required(model, paths.selections)));
        assertWork(view.bytes.equals(required(model, paths.view)), 'WORK_SUBJECT_CHANGED', paths.view);
        return { kind: 'worker', accepted_dependencies: semanticDependencies(model, row.semantic_id),
            obligation: obligation('S3', 'S3.normalization.capture', 's3.capture', row.semantic_id, view.bytes),
            call: { prepared_call_id: prep.call_id, role: 'normalizer', kind: 'producer', task_line: semanticProducerTask('normalizer', 'S3'),
                allowlist: [paths.view, ...view.assets.map((entry) => entry.path)].sort(), producer_dependency: null,
                output_selector: 'Role: Normalizer (S3)' } };
    }
    return { kind: 'local', accepted_dependencies: ledger.subjects.flatMap((row) => semanticDependencies(model, row.semantic_id))
            .filter((call, index, calls) => calls.indexOf(call) === index),
        obligation: obligation('S3', 'S3.exit', 'stage.seal-S3', model.manifest.runId, required(model, SEMANTIC_PATH)) };
}
function deriveS3Capture(model, work, accepted) {
    const paths = semanticProducerViewPaths(accepted.call_id);
    const view = semanticProducerView(model, 'normalizer', 'S3', parseStrictJson(required(model, paths.selections)));
    const checked = validateSemanticReturn('normalizer', model.manifest.runFormatVersion, accepted.value, view.context);
    assertWork(checked.result === 'PASS', 'WORK_RETURN', checked.errors.join('; '));
    const value = accepted.value;
    const ids = [...model.claims.map((row) => row.values.claimId),
        ...s3Captures(model).flatMap((capture) => capture.selectors.flatMap((selector) => selector.reserved_claim_id ? [selector.reserved_claim_id] : []))];
    const selectors = [];
    for (const [array, kind] of [['claims', 'claim-candidate'], ['no_claim_packets', 'no-claim-candidate'], ['material_findings', 'material-candidate']]) {
        for (const index of value[array].keys()) {
            const id = kind === 'claim-candidate' ? nextId('CC', ids) : null;
            if (id)
                ids.push(id);
            selectors.push({ output_kind: kind, output_index: String(index), reserved_claim_id: id,
                binding_path: `control/semantic-producer-bindings/${accepted.call_id}/${kind}-${index}.json` });
        }
    }
    const capture = { format: 'aleph-s3-work-capture/v1', call_id: accepted.call_id, origin_semantic_id: work.obligation.subject_id,
        raw_digest: accepted.raw_digest, context_id: accepted.context_id, producer_context_id: accepted.producer_context_id,
        receipt_digest: accepted.receipt_digest, simulation: accepted.simulation, selectors };
    const context = readRepresentationContext(model), idsUsed = context.uses.map((row) => row.use_id);
    const uses = materialFindingRows(model, accepted.value, 'S3', accepted.call_id).map((row) => {
        row.use_id = nextId('USE', idsUsed);
        idsUsed.push(row.use_id);
        planRepresentationUseWrite({ model, proposedModel: model, row, stage: 'S3', subjectWrites: [] });
        return row;
    });
    return [effect(model, `${S3_CAPTURES}${accepted.call_id}.json`, workJson(capture)),
        ...selectors.map((selector) => effect(model, selector.binding_path, Buffer.from(semanticJson({
            call_id: accepted.call_id, context_id: accepted.context_id, raw_return_hash: accepted.raw_digest,
            output_kind: selector.output_kind, output_index: Number(selector.output_index)
        })))),
        ...uses.length ? [effect(model, REPRESENTATION_USE_PATH, Buffer.from(representationUsesMarkdown([...context.uses, ...uses])))] : []];
}
function reserveS3Subject(model, work) {
    const [callId, kind, index] = work.obligation.subject_id.split(':'), ledger = semanticLedger(model);
    const capture = s3Captures(model).find((entry) => entry.call_id === callId);
    assertWork(capture, 'WORK_CAPTURE', callId);
    const selector = capture.selectors.find((entry) => entry.output_kind === kind && entry.output_index === index);
    assertWork(selector, 'WORK_SELECTOR', work.obligation.subject_id);
    const raw = capturedValue(model, capture).value;
    const entry = raw.semantic_units.find((entry) => entry.output_kind === kind && entry.output_index === Number(index));
    assertWork(entry, 'WORK_ACCOUNTING', work.obligation.subject_id);
    const candidates = kind === 'claim-candidate' ? raw.claims : kind === 'no-claim-candidate' ? raw.no_claim_packets : raw.material_findings;
    const candidate = candidates[Number(index)];
    const output = kind === 'claim-candidate' ? {
        kind: 'claim', reserved_claim_id: selector.reserved_claim_id, normalized_claim: String(candidate.normalized_claim),
        packet_ids: candidate.packets, source_ids: [...new Set(candidate.packets
                .map((id) => model.packets.find((row) => row.values.packetId === id).values.sourceId))], claim_type: String(candidate.claim_type),
    } : kind === 'no-claim-candidate' ? { kind: 'no-claim', packet_id: String(candidate.packet), basis: String(candidate.basis) }
        : { kind: 'material-only', object_id: String(candidate.object_id) };
    const projected = canonicalClaimModel(model, output), context = readRepresentationContext(model);
    const input = output.kind === 'no-claim' ? null : candidate.material_use;
    let uses;
    if (output.kind === 'claim') {
        const row = { use_id: nextId('USE', context.uses.map((row) => row.use_id)), owner_stage: 'S3',
            subject_kind: 'CC', subject_id: output.reserved_claim_id, basis_packet_ids: semanticJson(output.packet_ids),
            requirements: semanticJson(input.requirements), use_state: input.use_state, fidelity_claim: input.fidelity_claim,
            limitation_refs: semanticJson(input.limitation_refs), reason: input.reason, established_by: callId,
            review_subject_digest: '', reviewed_by: 'none' };
        row.review_subject_digest = representationUseDigest(projected, context, row);
        uses = [row];
    }
    else
        uses = output.kind === 'no-claim'
            ? context.uses.filter((row) => row.subject_kind === 'PKT' && row.subject_id === output.packet_id)
            : context.uses.filter((row) => row.subject_kind === 'OBJ' && row.subject_id === output.object_id
                && row.requirements === semanticJson(input.requirements) && row.reason === input.reason).slice(-1);
    const id = nextId('SEM', ledger.subjects.map((row) => row.semantic_id));
    const subject = buildSemanticSubject(projected, { semantic_id: id, owner_stage: 'S3', subject_kind: output.kind,
        review_mode: entry.review_mode, predecessor_semantic_id: 'none', producer_binding_hash: semanticProducerBinding({
            call_id: callId, context_id: capture.context_id, raw_return_hash: capture.raw_digest, output_kind: kind, output_index: Number(index)
        }),
        reviewer_profile: semanticReviewer(model), output_binding: output, origin_unit_refs: entry.origin_unit_refs,
        origin_context: [...new Set(entry.origin_unit_refs.map((ref) => ref.split('/')[0]))].map((id) => semanticOriginProjection(parseStrictJson(required(model, semanticSubjectPath(id))))),
        anchors: entry.anchors, semantics: entry.semantics, material_use: input,
        material_views: semanticMaterialViews(projected, uses), lineage_context: [], relation_context: [], ambiguity_context: [] });
    const bytes = Buffer.from(semanticJson(subject)), digest = workDigest(bytes);
    ledger.subjects.push({ semantic_id: id, owner_stage: 'S3', subject_kind: subject.subject_kind, subject_path: semanticSubjectPath(id),
        subject_digest: digest, predecessor_semantic_id: 'none',
        producer_receipt_ref: `${selector.binding_path}@${workDigest(readFileSync(join(model.runDir, selector.binding_path)))}` });
    return { simulation: capture.simulation, effects: [effect(model, semanticSubjectPath(id), bytes),
            effect(model, SEMANTIC_PATH, Buffer.from(semanticLedgerMarkdown(ledger)))],
        semantic: { stage: 'S3', semantic_id: id, subject_digest: digest, operation: 'reserve-subject', record_id: id,
            producer_call_id: callId, reviewer_call_ids: [] } };
}
function s3Admission(model, subject, callId) {
    const output = subject.output_binding;
    if (output.kind === 'no-claim') {
        const id = nextId('LIN', parseLineage(model).rows.map((row) => row.values.lineageId));
        return { refs: [output.packet_id, id], effects: [effect(model, 'ledgers/lineage.md', appendRows(required(model, 'ledgers/lineage.md'), LINEAGE_TABLE_HEADER[0], [[id, 'S3', 'no-claim', output.packet_id, 'none', output.basis, callId]]))] };
    }
    assertWork(output.kind === 'claim', 'WORK_ADMISSION', 'only reviewed claims or no-claim outcomes may be admitted in S3');
    const use = useRowFromSubject(subject.material_views[0].use_subject), context = readRepresentationContext(model);
    use.use_id = nextId('USE', context.uses.map((row) => row.use_id));
    validateRepresentationUse(canonicalClaimModel(model, output), context, use);
    return { refs: [output.reserved_claim_id], effects: [
            effect(model, 'ledgers/claim-inventory.md', appendRows(required(model, 'ledgers/claim-inventory.md'), CLAIM_HEADERS[0], [[output.reserved_claim_id, output.normalized_claim, output.packet_ids.join(', '), output.source_ids.join(', '),
                    output.claim_type, '', '', '', '', 'active']])),
            effect(model, REPRESENTATION_USE_PATH, Buffer.from(representationUsesMarkdown([...context.uses, use])))
        ] };
}
function nextId(prefix, values) {
    const max = values.reduce((n, value) => {
        const match = new RegExp(`^${prefix}-([0-9]+)$`, 'u').exec(value);
        return Math.max(n, match ? Number(match[1]) : 0);
    }, 0);
    assertWork(Number.isSafeInteger(max + 1), 'WORK_IDENTITY', 'ID ordinal overflow');
    return `${prefix}-${String(max + 1).padStart(4, '0')}`;
}
function s2Preparation(model, sourceId) {
    const cursor = model.sourceWalk.cursors.filter((row) => row.values.sourceId === sourceId).at(-1);
    assertWork(cursor, 'WORK_PREREQUISITE', 'initial source cursor');
    const identity = { run_id: model.manifest.runId, bundle_digest: model.manifest.forwardIdentity.bundleDigest,
        source_id: sourceId, prior_cursor_id: cursor.values.cursorId, source_walk_digest: workDigest(required(model, 'ledgers/source-walk.md')) };
    return { format: 'aleph-s2-work-preparation/v1', source_id: sourceId, prior_cursor_id: cursor.values.cursorId,
        call_id: `CALL-F03-${workDigest(workJson(identity)).slice(7)}` };
}
function s2Captures(model) {
    return model.files.filter((entry) => entry.relativePath.startsWith(S2_CAPTURES)).map((file) => {
        const capture = parseStrictJson(file.text);
        record(capture, ['format', 'source_id', 'call_id', 'raw_digest', 'context_id', 'producer_context_id', 'receipt_digest',
            'simulation', 'cursor_id', 'selectors'], 'S2 capture');
        assertWork(capture.format === 'aleph-s2-work-capture/v1' && typeof capture.call_id === 'string'
            && /^CALL-F03-[0-9a-f]{64}$/u.test(capture.call_id) && file.relativePath === `${S2_CAPTURES}${capture.call_id}.json`
            && Array.isArray(capture.selectors) && typeof capture.cursor_id === 'string', 'WORK_CAPTURE', file.relativePath);
        for (const selector of capture.selectors) {
            record(selector, ['output_kind', 'output_index', 'packet_ids', 'evidence_key', 'binding_path'], 'S2 selector');
            assertWork(['packet-candidate', 'material-candidate'].includes(String(selector.output_kind))
                && typeof selector.output_index === 'string' && /^(0|[1-9]\d*)$/u.test(selector.output_index)
                && selector.binding_path === `control/semantic-producer-bindings/${capture.call_id}/${selector.output_kind}-${selector.output_index}.json`
                && Array.isArray(selector.packet_ids), 'WORK_CAPTURE', 'original selector binding');
        }
        return capture;
    }).sort((left, right) => model.sourceWalk.cursors.findIndex((row) => row.values.cursorId === left.cursor_id)
        - model.sourceWalk.cursors.findIndex((row) => row.values.cursorId === right.cursor_id));
}
function capturedValue(model, capture) {
    const bytes = readFileSync(join(model.runDir, `control/worker-returns/${capture.call_id}/raw.json`));
    assertWork(workDigest(bytes) === capture.raw_digest, 'WORK_CAPTURE', 'retained producer bytes changed');
    return { call_id: capture.call_id, role: capture.format === 'aleph-s2-work-capture/v1' ? 'extractor' : 'normalizer', context_id: capture.context_id, producer_context_id: capture.producer_context_id,
        raw_digest: capture.raw_digest, receipt_digest: capture.receipt_digest, simulation: capture.simulation,
        value: parseStrictJson(bytes, true) };
}
function semanticLedger(model) { return parseSemanticLedger(required(model, SEMANTIC_PATH).toString('utf8')); }
function selectSemanticWork(model, capture) {
    const stage = capture.format === 'aleph-s2-work-capture/v1' ? 'S2' : 'S3';
    const ledger = semanticLedger(model);
    for (const selector of capture.selectors) {
        const binding = readFileSync(join(model.runDir, selector.binding_path));
        const ref = `${selector.binding_path}@${workDigest(binding)}`;
        const reserved = ledger.subjects.filter((row) => row.producer_receipt_ref === ref);
        assertWork(reserved.length <= 1, 'WORK_ACCOUNTING', 'one SEM per original selector');
        if (!reserved.length)
            return { kind: 'local', accepted_dependencies: [capture.call_id],
                obligation: obligation(stage, `${stage}.L2S.reserve`, `sem.reserve-${stage}`, `${capture.call_id}:${selector.output_kind}:${selector.output_index}`, binding) };
        const row = reserved[0], subject = JSON.parse(required(model, row.subject_path).toString('utf8'));
        const assigned = ledger.assignments.filter((assignment) => assignment.semantic_id === row.semantic_id);
        const completed = ledger.results.filter((result) => result.semantic_id === row.semantic_id);
        const reviews = completed.map((result) => JSON.parse(required(model, result.result_path).toString('utf8')));
        const calls = assigned.map((entry) => JSON.parse(required(model, entry.assignment_path).toString('utf8')));
        if (!assigned.length || assigned.length === 1 && reviews[0]?.verdict === 'cannot-determine') {
            return { kind: 'local', accepted_dependencies: [capture.call_id, ...calls.filter((call) => completed.some((result) => result.review_id === call.review_id)).map((call) => call.invocation_id)],
                obligation: obligation(stage, `${stage}.L2S.assignment`, 'sem.assign', row.semantic_id, required(model, row.subject_path)) };
        }
        const pending = calls.find((assignment) => !completed.some((result) => result.review_id === assignment.review_id));
        if (pending)
            return { kind: 'worker', accepted_dependencies: [capture.call_id],
                obligation: obligation(stage, `${stage}.L2S.review`, 'sem.review', row.semantic_id, required(model, row.subject_path)),
                call: { prepared_call_id: pending.invocation_id, role: 'verifier-l2s', kind: 'refuter', task_line: SEMANTIC_TASK,
                    allowlist: semanticAttachmentPaths(subject), producer_dependency: capture.call_id,
                    output_selector: 'L2S — atomicity, context, and semantic preservation (S2/S3)' } };
        if (!ledger.resolutions.some((resolution) => resolution.semantic_id === row.semantic_id)) {
            if (reviews.every((review) => review.verdict === 'upheld') && subject.review_mode === 'proposal'
                && semanticAdmissionProblems(subject).length > 0) {
                return { kind: 'halt', code: 'WORK_SEMANTIC_PROPOSAL_INELIGIBLE',
                    reason: `${row.semantic_id}: ${semanticAdmissionProblems(subject).join('; ')}; no withdrawal or revised semantics inferred.` };
            }
            return { kind: 'local', accepted_dependencies: [capture.call_id, ...calls.map((call) => call.invocation_id)],
                obligation: obligation(stage, `${stage}.L2S.resolution`, 'sem.resolve', row.semantic_id, required(model, row.subject_path)) };
        }
    }
    return null;
}
function semanticReviewer(model) {
    const state = parseStrictJson(readFileSync(join(model.runDir, 'control/run-state.json')));
    return { profile_id: state.identity.profile.id, profile_digest: state.identity.profile.digest, role: 'verifier-l2s',
        model_identity: state.identity.models['verifier-l2s'] };
}
function semanticTransition(model, work, accepted) {
    const ledger = semanticLedger(model);
    const operation = work.obligation.operation;
    let subject, capture, producerCall;
    if (operation === 'sem.reserve-S2') {
        const [callId, kind, index] = work.obligation.subject_id.split(':');
        capture = s2Captures(model).find((entry) => entry.call_id === callId);
        assertWork(capture, 'WORK_CAPTURE', callId);
        const selector = capture.selectors.find((entry) => entry.output_kind === kind && entry.output_index === index);
        assertWork(selector, 'WORK_SELECTOR', work.obligation.subject_id);
        const value = capturedValue(model, capture), returned = value.value;
        const entry = returned.semantic_units.find((entry) => entry.output_kind === kind && entry.output_index === Number(index));
        assertWork(entry, 'WORK_ACCOUNTING', 'semantic entry missing');
        const id = nextId('SEM', ledger.subjects.map((row) => row.semantic_id)), profile = semanticReviewer(model);
        if (kind === 'packet-candidate' && returned.packets[Number(index)].evidence_state === 'degraded-non-exact') {
            subject = deriveS2DegradedSubject(model, value, Number(index), id, profile);
        }
        else {
            const output = kind === 'packet-candidate' ? { kind: 'packet-group', evidence_keys: [selector.evidence_key], packet_ids: selector.packet_ids }
                : { kind: 'material-only', object_id: String(returned.material_findings[Number(index)].object_id) };
            const candidate = (kind === 'packet-candidate' ? returned.packets : returned.material_findings)[Number(index)];
            const use = candidate.material_use, context = readRepresentationContext(model);
            const uses = output.kind === 'packet-group' ? output.packet_ids.map((id) => context.uses.find((row) => row.subject_kind === 'PKT' && row.subject_id === id))
                : [context.uses.find((row) => row.subject_kind === 'OBJ' && row.subject_id === output.object_id
                        && row.established_by === callId && row.requirements === semanticJson(use.requirements) && row.reason === use.reason)];
            assertWork(uses.every(Boolean), 'WORK_MATERIAL', 'exact canonical use context required');
            subject = buildSemanticSubject(model, { semantic_id: id, owner_stage: 'S2', subject_kind: output.kind,
                review_mode: entry.review_mode, predecessor_semantic_id: 'none',
                producer_binding_hash: semanticProducerBinding({ call_id: callId, context_id: capture.context_id, raw_return_hash: capture.raw_digest,
                    output_kind: kind, output_index: Number(index) }), reviewer_profile: profile, output_binding: output,
                origin_unit_refs: entry.origin_unit_refs, origin_context: [], anchors: entry.anchors, semantics: entry.semantics,
                material_use: use, material_views: semanticMaterialViews(model, uses), lineage_context: [], relation_context: [], ambiguity_context: [] });
        }
        const bytes = Buffer.from(semanticJson(subject)), digest = workDigest(bytes);
        const binding = readFileSync(join(model.runDir, selector.binding_path));
        ledger.subjects.push({ semantic_id: id, owner_stage: 'S2', subject_kind: subject.subject_kind, subject_path: semanticSubjectPath(id),
            subject_digest: digest, predecessor_semantic_id: 'none', producer_receipt_ref: `${selector.binding_path}@${workDigest(binding)}` });
        return { simulation: capture.simulation, effects: [effect(model, semanticSubjectPath(id), bytes),
                effect(model, SEMANTIC_PATH, Buffer.from(semanticLedgerMarkdown(ledger)))],
            semantic: { stage: 'S2', semantic_id: id, subject_digest: digest, operation: 'reserve-subject', record_id: id,
                producer_call_id: callId, reviewer_call_ids: [] } };
    }
    if (operation === 'sem.reserve-S3')
        return reserveS3Subject(model, work);
    const row = ledger.subjects.find((row) => row.semantic_id === work.obligation.subject_id);
    assertWork(row, 'WORK_SUBJECT', work.obligation.subject_id);
    subject = JSON.parse(required(model, row.subject_path).toString('utf8'));
    const binding = JSON.parse(readFileSync(join(model.runDir, row.producer_receipt_ref.split('@')[0]), 'utf8'));
    producerCall = binding.call_id;
    capture = [...s2Captures(model), ...s3Captures(model)].find((entry) => entry.call_id === producerCall);
    assertWork(capture, 'WORK_CAPTURE', producerCall);
    const meta = { stage: subject.owner_stage, semantic_id: subject.semantic_id, subject_digest: row.subject_digest,
        producer_call_id: producerCall, reviewer_call_ids: [] };
    const assigned = ledger.assignments.filter((row) => row.semantic_id === subject.semantic_id).map((row) => JSON.parse(required(model, row.assignment_path).toString('utf8')));
    if (operation === 'sem.assign') {
        const id = nextId('VER', ledger.assignments.map((row) => row.review_id));
        const call = `CALL-F03-${workDigest(workJson({ run_id: model.manifest.runId, subject_digest: row.subject_digest, round: String(assigned.length + 1) })).slice(7)}`;
        const state = parseStrictJson(readFileSync(join(model.runDir, 'control/run-state.json')));
        const assignment = { format: SEMANTIC_ASSIGNMENT_FORMAT, semantic_id: subject.semantic_id,
            subject_digest: row.subject_digest, review_id: id, role: 'verifier-l2s', profile_digest: subject.reviewer_profile.profile_digest,
            invocation_id: call, producer_binding_hash: subject.producer_binding_hash,
            execution_kind: state.full_mode === 'fixture-simulated' ? 'fixture-simulated' : 'native-dispatch' };
        const bytes = Buffer.from(semanticJson(assignment));
        ledger.assignments.push({ review_id: id, semantic_id: subject.semantic_id, assignment_path: semanticAssignmentPath(id), assignment_digest: workDigest(bytes) });
        return { simulation: capture.simulation, effects: [effect(model, semanticAssignmentPath(id), bytes),
                effect(model, SEMANTIC_PATH, Buffer.from(semanticLedgerMarkdown(ledger)))],
            semantic: { ...meta, operation: 'assign-review', record_id: id } };
    }
    if (operation === 'sem.review') {
        assertWork(accepted && work.kind === 'worker' && accepted.call_id === work.call.prepared_call_id, 'WORK_REVIEW_BINDING', 'exact assigned L2S required');
        const assignment = assigned.find((entry) => entry.invocation_id === accepted.call_id);
        assertWork(assignment && accepted.producer_context_id === capture.context_id && accepted.context_id !== capture.context_id, 'WORK_REVIEW_ISOLATION', 'actual producer context');
        const result = accepted.value;
        const checked = validateSemanticReturn('verifier-l2s', model.manifest.runFormatVersion, result, {
            model, subject, owner_stage: subject.owner_stage, legal_source_ids: subject.anchors.map((anchor) => anchor.source_id),
        });
        assertWork(checked.result === 'PASS', 'WORK_RETURN', checked.errors.join('; '));
        const id = assignment.review_id, bytes = Buffer.from(semanticJson(result)), nativePath = `control/worker-returns/${accepted.call_id}/native-dispatch.json`;
        ledger.results.push({ review_id: id, semantic_id: subject.semantic_id, result_path: semanticResultPath(id), result_digest: workDigest(bytes),
            execution_kind: assignment.execution_kind, execution_evidence_ref: `${nativePath}@${workDigest(readFileSync(join(model.runDir, nativePath)))}` });
        const companion = Buffer.from('# Retained L2S review\n\n' + table(['field', 'value'], [
            ['target', `semantic-review-subject:${row.subject_digest}`], ['lens', 'L2S'], ['stage', subject.owner_stage], ['shown', row.subject_path],
            ['withheld', 'Producer identity, rationale, prior verdicts and authority records.'], ['verdict', result.verdict],
            ['consequence', 'Retained worker judgment; all other Core admission predicates remain required.'],
        ]));
        return { simulation: capture.simulation || accepted.simulation, effects: [effect(model, semanticResultPath(id), bytes),
                effect(model, `verification/harness/${subject.owner_stage}/${id}.md`, companion), effect(model, SEMANTIC_PATH, Buffer.from(semanticLedgerMarkdown(ledger)))],
            semantic: { ...meta, operation: 'record-review', record_id: id, reviewer_call_ids: [accepted.call_id] } };
    }
    assertWork(operation === 'sem.resolve' && assigned.length > 0, 'WORK_OPERATION', operation);
    const reviews = assigned.map((assignment) => {
        const result = ledger.results.find((row) => row.review_id === assignment.review_id);
        assertWork(result, 'WORK_REVIEW_PENDING', assignment.review_id);
        return JSON.parse(required(model, result.result_path).toString('utf8'));
    });
    const allUpheld = reviews.every((review) => review.verdict === 'upheld');
    const outcome = allUpheld ? subject.review_mode === 'unresolved-record' ? 'unresolved-recorded'
        : subject.output_binding.kind === 'no-claim' ? 'no-claim' : 'admitted' : 'not-admitted';
    assertWork(!allUpheld || outcome === 'unresolved-recorded' || semanticAdmissionProblems(subject).length === 0, 'WORK_SEMANTIC_PROPOSAL_INELIGIBLE', 'no inferred withdrawal or admission');
    const id = nextId('SMR', ledger.resolutions.map((row) => row.resolution_id));
    const admission = subject.owner_stage === 'S3' && ['admitted', 'no-claim'].includes(outcome)
        ? s3Admission(model, subject, producerCall) : { effects: [], refs: outcome === 'admitted'
            && subject.output_binding.kind === 'packet-group' ? subject.output_binding.packet_ids : [] };
    ledger.resolutions.push({ resolution_id: id, semantic_id: subject.semantic_id, outcome,
        review_ids: semanticJson(assigned.map((assignment) => assignment.review_id)),
        canonical_refs: semanticJson(admission.refs),
        origin_unit_refs: semanticJson(subject.origin_unit_refs), followup_semantic_ids: '[]' });
    return { simulation: capture.simulation, effects: [...admission.effects, effect(model, SEMANTIC_PATH, Buffer.from(semanticLedgerMarkdown(ledger)))],
        semantic: { ...meta, operation: ['admitted', 'no-claim'].includes(outcome) ? 'admit' : 'resolve', record_id: id,
            reviewer_call_ids: assigned.map((assignment) => assignment.invocation_id) } };
}
function selectS2Work(model) {
    // C-03 consumes one already reserved event before any new worker batch.
    // Its accepted original producer is reauthenticated by the controller.
    for (const source of model.corpus.sources) {
        const cursor = model.sourceWalk.cursors.filter((row) => row.values.sourceId === source.values.sourceId).at(-1);
        const event = model.sourceWalk.events.find((row) => row.values.sourceId === source.values.sourceId
            && row.values.status === 'pending' && row.values.sharedPositionKey === cursor?.values.sharedPositionKey
            && row.values.eventOrdinal === cursor?.values.nextEventOrdinal);
        if (event)
            return { kind: 'local', accepted_dependencies: [event.values.producerInvocationId],
                obligation: obligation('S2', 'S2.primary-walk.event-commitment', 's2.commit-event', event.values.eventId, required(model, 'ledgers/source-walk.md')) };
    }
    // Review/accounting precedes another source batch; the capture's finite
    // original selectors remain the authoritative work set.
    const captures = s2Captures(model);
    for (const capture of captures) {
        const review = selectSemanticWork(model, capture);
        if (review)
            return review;
    }
    for (const source of model.corpus.sources) {
        const id = source.values.sourceId, cursor = model.sourceWalk.cursors.filter((row) => row.values.sourceId === id).at(-1);
        if (cursor?.values.reason === 'source-complete') {
            const gap = selectGapWork(model, id);
            if (gap)
                return gap;
            continue;
        }
        if (!cursor)
            return { kind: 'local', obligation: obligation('S2', 'S2.primary-walk.initial-cursor', 's2.initial-cursor', id, required(model, 'ledgers/source-walk.md')) };
        const prepared = model.files.filter((entry) => entry.relativePath.startsWith(S2_PREPARATIONS))
            .map((entry) => parseStrictJson(entry.text))
            .find((entry) => entry.source_id === id && entry.prior_cursor_id === cursor.values.cursorId);
        if (!prepared)
            return { kind: 'local', obligation: obligation('S2', 'S2.primary-walk.prepare', 's2.prepare-extractor', id, workJson(s2Preparation(model, id))) };
        const paths = semanticProducerViewPaths(prepared.call_id), view = semanticProducerView(model, 'extractor', 'S2', parseStrictJson(required(model, paths.selections)));
        assertWork(required(model, paths.view).equals(view.bytes), 'WORK_SUBJECT_CHANGED', paths.view);
        return { kind: 'worker', obligation: obligation('S2', 'S2.primary-walk.capture', 's2.capture', id, required(model, paths.view)),
            call: { prepared_call_id: prepared.call_id, role: 'extractor', kind: 'producer', task_line: semanticProducerTask('extractor', 'S2'),
                allowlist: [paths.view, ...view.assets.map((asset) => asset.path)].sort(), producer_dependency: null, output_selector: 'Role: Extractor (S2)' } };
    }
    validateSemanticRun(model);
    return { kind: 'local', accepted_dependencies: captures.map((capture) => capture.call_id),
        obligation: obligation('S2', 'S2.exit', 'stage.seal-S2', model.manifest.runId, required(model, SEMANTIC_PATH)) };
}
function deriveS2Preparation(model, work) {
    const id = work.obligation.subject_id;
    if (work.obligation.operation === 's2.initial-cursor') {
        const source = model.corpus.sources.find((source) => source.values.sourceId === id);
        const cursorId = nextId('CUR', model.sourceWalk.cursors.map((row) => row.values.cursorId));
        return [effect(model, 'ledgers/source-walk.md', appendRows(required(model, 'ledgers/source-walk.md'), 'cursor_id', [[cursorId, id, '0', 'none', 'none', 'none', 'none', source.values.contentHash, 'initial']]))];
    }
    const prep = s2Preparation(model, id), paths = semanticProducerViewPaths(prep.call_id);
    const selections = semanticProducerSelections(model, 'extractor', 'S2', { source_id: id });
    const view = semanticProducerView(model, 'extractor', 'S2', selections);
    return [effect(model, `${S2_PREPARATIONS}${prep.call_id}.json`, workJson(prep)),
        effect(model, paths.selections, Buffer.from(semanticJson(selections))), effect(model, paths.view, view.bytes)];
}
function deriveS2Capture(model, work, accepted) {
    assertWork(accepted.call_id === work.call.prepared_call_id, 'WORK_CALL_BINDING', 'prepared extractor identity');
    const paths = semanticProducerViewPaths(accepted.call_id), projected = semanticProducerView(model, 'extractor', 'S2', parseStrictJson(required(model, paths.selections)));
    const checked = validateSemanticReturn('extractor', model.manifest.runFormatVersion, accepted.value, projected.context);
    assertWork(checked.result === 'PASS', 'WORK_RETURN', checked.errors.join('; '));
    const returned = accepted.value;
    const gapCandidates = projected.context.gap_candidates;
    assertWork(Boolean(gapCandidates) === (work.obligation.operation === 's2.reconcile-gap'), 'WORK_GAP_BASIS', 'exact registered capture family required');
    assertWork(returned.producer_invocation_id === accepted.call_id && returned.source_id === work.obligation.subject_id, 'WORK_CALL_BINDING', 'source/invocation must equal sealed work');
    const source = model.corpus.sources.find((source) => source.values.sourceId === returned.source_id);
    const sourcePath = sourceFilePath(model.runDir, source.values.locus);
    const sourceBytes = readFileSync(sourcePath);
    const packetIds = model.packets.map((row) => row.values.packetId);
    const evidenceIds = model.exactEvidence.records.map((row) => row.values.evidenceKey);
    const fragmentIds = model.exactEvidence.fragments.map((row) => row.values.fragmentKey);
    const transformIds = model.exactEvidence.transformations.map((row) => row.values.transformKey);
    const packetRows = [], evidenceRows = [], fragmentRows = [], transformRows = [];
    const selected = [];
    for (const candidate of returned.packets) {
        const evidence = nextId('EVID', evidenceIds);
        evidenceIds.push(evidence);
        const ids = [], fragments = [], bytes = [];
        for (const fragment of candidate.fragments) {
            const locator = String(fragment.locator), match = /^L([1-9][0-9]*)-L([1-9][0-9]*)$/u.exec(locator);
            const span = match && mdLineSpan(sourcePath, Number(match[1]), Number(match[2]));
            assertWork(span?.bytes && span.startByte !== null && span.endByte !== null
                && span.bytes.toString('base64') === fragment.exact_bytes_base64, 'WORK_EXACT_EVIDENCE', locator);
            const id = nextId('PKT', packetIds);
            packetIds.push(id);
            ids.push(id);
            bytes.push(span.bytes);
            const fragmentId = nextId('FRAG', fragmentIds);
            fragmentIds.push(fragmentId);
            fragments.push({ packet: id, start: span.startByte, end: span.endByte });
            packetRows.push([id, source.values.sourceId, locator, workDigest(span.bytes), span.bytes.toString('utf8'), String(candidate.criterion), 'active']);
            fragmentRows.push([fragmentId, evidence, id, String(fragment.fragment_order), source.values.sourceId, locator,
                'frozen-source', 'exact-source-bytes', workDigest(span.bytes), span.bytes.toString('base64')]);
        }
        const exact = candidate.evidence_state === 'exact';
        assertWork(exact ? ids.length > 0 : ids.length === 0, 'WORK_EXACT_EVIDENCE', 'candidate evidence cardinality');
        const hash = exact ? `sha256:${framedExactEvidenceHash(bytes)}` : 'none';
        evidenceRows.push([evidence, ids.join(', ') || 'none', String(candidate.evidence_state), String(ids.length),
            String(candidate.join_policy), hash, exact ? 'none' : source.values.sourceId,
            exact ? 'none' : String(candidate.degraded_source_locator), exact ? 'none' : String(candidate.degradation_reason)]);
        const transform = nextId('TRN', transformIds);
        transformIds.push(transform);
        transformRows.push([transform, evidence, 'rendered', hash, hash, String(candidate.rendered_text), workDigest(String(candidate.rendered_text))]);
        selected.push({ ids, evidence, fragments, use: candidate.material_use });
    }
    let packets = required(model, 'ledgers/packet-index.md');
    for (const [i, rows] of [packetRows, evidenceRows, fragmentRows, transformRows].entries())
        packets = appendRows(packets, PACKET_TABLES[i][0], rows);
    const walkIds = model.sourceWalk.intervals.map((row) => row.values.walkId), eventIds = model.sourceWalk.events.map((row) => row.values.eventId);
    const newWalkIds = [], newEventIds = [], walkRows = [], eventRows = [];
    const indexes = (value, bound) => {
        assertWork(Array.isArray(value) && value.every((n) => Number.isSafeInteger(n) && Number(n) >= 0 && Number(n) < bound)
            && new Set(value).size === value.length, 'WORK_SELECTOR', 'existing unique candidate indexes');
        return value;
    };
    for (const interval of returned.walk_intervals) {
        const id = nextId('WLK', walkIds);
        walkIds.push(id);
        newWalkIds.push(id);
        const chosen = indexes(interval.packet_candidate_indexes, selected.length);
        assertWork(chosen.every((index) => selected[index].ids.length > 0), 'WORK_ACCOUNTING', 'degraded candidate is not an admitted packet');
        walkRows.push([id, source.values.sourceId, String(interval.start_byte), String(interval.end_byte), String(interval.outcome),
            chosen.flatMap((index) => selected[index].ids).join(', ') || 'none', String(interval.criterion_ref), accepted.call_id,
            String(interval.closure_state), interval.reason === null ? 'none' : String(interval.reason), interval.closure_note === null ? 'none' : String(interval.closure_note)]);
    }
    const cursor = returned.next_cursor;
    for (const event of returned.extraction_events) {
        const [index] = indexes([event.packet_candidate_index], selected.length);
        const matching = selected[index].fragments.filter((f) => Number(event.start_byte) >= f.start && Number(event.end_byte) <= f.end);
        assertWork(matching.length === 1 && event.origin === 'primary', 'WORK_EVENT_BINDING', 'one selected exact fragment for primary event');
        const id = nextId('EVT', eventIds);
        eventIds.push(id);
        newEventIds.push(id);
        const pending = cursor.shared_position_key !== null
            && (Number(event.start_byte) > Number(cursor.byte_offset)
                || event.shared_position_key === cursor.shared_position_key && Number(event.event_ordinal) >= Number(cursor.next_event_ordinal));
        eventRows.push([id, source.values.sourceId, String(event.start_byte), String(event.end_byte), String(event.shared_position_key),
            String(event.event_ordinal), matching[0].packet, 'primary', accepted.call_id, pending ? 'pending' : 'committed']);
    }
    const prior = model.sourceWalk.cursors.filter((row) => row.values.sourceId === source.values.sourceId).at(-1);
    const cursorId = gapCandidates ? prior.values.cursorId : nextId('CUR', model.sourceWalk.cursors.map((row) => row.values.cursorId));
    const predecessor = (value, ids, fallback) => {
        if (value === null)
            return fallback;
        assertWork(Number.isSafeInteger(value) && Number(value) >= 0 && Number(value) < ids.length, 'WORK_CURSOR', 'predecessor index');
        return ids[Number(value)];
    };
    assertWork(cursor.source_hash === source.values.contentHash && cursor.byte_offset !== null
        && Number(cursor.byte_offset) >= Number(prior.values.byteOffset)
        && (gapCandidates || Number(cursor.byte_offset) > Number(prior.values.byteOffset) || newEventIds.length > 0), 'WORK_CURSOR', 'frozen source and actual forward progress required');
    assertWork(returned.walk_exhausted === (Number(cursor.byte_offset) === sourceBytes.length && cursor.shared_position_key === null), 'WORK_CURSOR', 'source exhaustion differs from cursor');
    let walk = appendRows(required(model, 'ledgers/source-walk.md'), 'walk_id', walkRows);
    const gapEffects = [];
    if (gapCandidates) {
        const basis = gapSubject(model, source.values.sourceId);
        const review = parseStrictJson(required(model, `${GAP_RETURNS}${basis.digest.slice(7)}.json`));
        const primary = model.sourceWalk.intervals.find((row) => row.values.walkId === prior.values.predecessorWalkId);
        const gaps = [], ids = model.sourceWalk.gapReviews.map((row) => row.values.gapReviewId);
        const positions = model.sourceWalk.events.map((row) => ({ source: row.values.sourceId, start: Number(row.values.startByte),
            end: Number(row.values.endByte), key: row.values.sharedPositionKey, ordinal: Number(row.values.eventOrdinal) }));
        for (const [index, candidate] of gapCandidates.entries()) {
            const id = nextId('GAP', ids);
            ids.push(id);
            let packetId = 'none', eventId = 'none';
            if (selected.length) {
                assertWork(selected[index].ids.length === 1, 'WORK_GAP_EVIDENCE', 'one exact packet per L1 source-local fragment');
                packetId = selected[index].ids[0];
                const same = positions.filter((position) => position.source === source.values.sourceId
                    && position.start === candidate.start_byte && position.end === candidate.end_byte);
                const key = same[0]?.key || nextId('SP', positions.map((position) => position.key));
                assertWork(same.every((position) => position.key === key), 'WORK_GAP_EVIDENCE', 'existing shared position is ambiguous');
                const ordinal = Math.max(0, ...same.map((position) => position.ordinal)) + 1;
                positions.push({ source: source.values.sourceId, start: candidate.start_byte, end: candidate.end_byte, key, ordinal });
                eventId = nextId('EVT', eventIds);
                eventIds.push(eventId);
                eventRows.push([eventId, source.values.sourceId, String(candidate.start_byte), String(candidate.end_byte), key, String(ordinal),
                    packetId, 'gap-reconciliation', accepted.call_id, 'committed']);
            }
            gaps.push([id, source.values.sourceId, primary.values.producerInvocationId, review.call_id, prior.values.cursorId, basis.digest,
                'gap-candidate-found', String(candidate.start_byte), String(candidate.end_byte), packetId, eventId,
                selected.length ? 'reconciled' : 'open', selected.length
                    ? 'Retained L1 source position reopened exactly with its separate producer proposal; L2S remains required.'
                    : 'Retained L1 source position remains open after the separate producer returned a material refusal.']);
        }
        walk = appendRows(walk, 'gap_review_id', gaps);
        gapEffects.push(effect(model, `${GAP_RECONCILIATIONS}${basis.digest.slice(7)}.json`, workJson({
            format: 'aleph-gap-reconciliation/v1', review_call_id: review.call_id, review_raw_digest: review.raw_digest,
            review_receipt_digest: review.receipt_digest, producer_call_id: accepted.call_id,
            producer_raw_digest: accepted.raw_digest, producer_receipt_digest: accepted.receipt_digest, gap_ids: ids.slice(model.sourceWalk.gapReviews.length),
        })));
    }
    walk = appendRows(walk, 'event_id', eventRows);
    if (!gapCandidates)
        walk = appendRows(walk, 'cursor_id', [[cursorId, source.values.sourceId, String(cursor.byte_offset),
                cursor.shared_position_key === null ? 'none' : String(cursor.shared_position_key),
                cursor.next_event_ordinal === null ? 'none' : String(cursor.next_event_ordinal),
                predecessor(cursor.predecessor_walk_index, newWalkIds, prior.values.predecessorWalkId),
                predecessor(cursor.predecessor_event_index, newEventIds, prior.values.predecessorEventId),
                String(cursor.source_hash), String(cursor.reason)]]);
    const capture = { format: 'aleph-s2-work-capture/v1', source_id: source.values.sourceId,
        call_id: accepted.call_id, raw_digest: accepted.raw_digest, context_id: accepted.context_id,
        producer_context_id: accepted.producer_context_id, receipt_digest: accepted.receipt_digest, simulation: accepted.simulation, cursor_id: cursorId, selectors: [
            ...selected.map((entry, index) => ({ output_kind: 'packet-candidate', output_index: String(index), packet_ids: entry.ids, evidence_key: entry.evidence,
                binding_path: `control/semantic-producer-bindings/${accepted.call_id}/packet-candidate-${index}.json` })),
            ...returned.material_findings.map((_, index) => ({ output_kind: 'material-candidate', output_index: String(index), packet_ids: [], evidence_key: null,
                binding_path: `control/semantic-producer-bindings/${accepted.call_id}/material-candidate-${index}.json` })),
        ] };
    const proposedPackets = projectedPackets(model, packets);
    const source_completion = deriveSourceWalkCompletion(model, projectSourceWalk(proposedPackets, walk.toString('utf8')));
    walk = Buffer.from(source_completion.after_base64, 'base64');
    const proposed = projectSourceWalk(proposedPackets, walk.toString('utf8'));
    const context = validateRepresentationRun(model), uses = [], useIds = context.uses.map((row) => row.use_id);
    for (const candidate of selected)
        for (const id of candidate.ids) {
            const useId = nextId('USE', useIds);
            useIds.push(useId);
            const use = { use_id: useId, owner_stage: 'S2', subject_kind: 'PKT', subject_id: id,
                basis_packet_ids: semanticJson([id]), requirements: semanticJson(candidate.use.requirements),
                use_state: candidate.use.use_state, fidelity_claim: candidate.use.fidelity_claim,
                limitation_refs: semanticJson(candidate.use.limitation_refs), reason: candidate.use.reason,
                established_by: accepted.call_id, review_subject_digest: '', reviewed_by: 'none' };
            use.review_subject_digest = representationUseDigest(proposed, context, use);
            validateRepresentationUse(proposed, context, use);
            planRepresentationUseWrite({ model, proposedModel: proposed, row: use, stage: 'S2',
                subjectWrites: [['ledgers/packet-index.md', packets], ['ledgers/source-walk.md', walk]].map(([path, bytes]) => {
                    const p = path, b = bytes;
                    return { path: p, before_hash: workDigest(required(model, p)), after_base64: b.toString('base64'), after_hash: workDigest(b) };
                }) });
            uses.push(use);
        }
    for (const use of materialFindingRows(model, accepted.value, 'S2', accepted.call_id)) {
        use.use_id = nextId('USE', useIds);
        useIds.push(use.use_id);
        planRepresentationUseWrite({ model, proposedModel: proposed, row: use, stage: 'S2', subjectWrites: [] });
        uses.push(use);
    }
    const useBytes = uses.length ? appendRows(required(model, REPRESENTATION_USE_PATH), 'use_id', uses.map((use) => ['use_id', 'owner_stage', 'subject_kind', 'subject_id', 'basis_packet_ids', 'requirements', 'use_state',
        'fidelity_claim', 'limitation_refs', 'reason', 'established_by', 'review_subject_digest', 'reviewed_by'].map((field) => use[field]))) : null;
    return { source_completion, effects: [effect(model, 'ledgers/packet-index.md', packets), effect(model, 'ledgers/source-walk.md', walk),
            ...gapEffects,
            ...useBytes ? [effect(model, REPRESENTATION_USE_PATH, useBytes)] : [],
            effect(model, `${S2_CAPTURES}${accepted.call_id}.json`, workJson(capture)),
            ...capture.selectors.map((selector) => effect(model, selector.binding_path, Buffer.from(semanticJson({
                call_id: accepted.call_id, context_id: accepted.context_id, raw_return_hash: accepted.raw_digest,
                output_kind: selector.output_kind, output_index: Number(selector.output_index),
            }))))] };
}
export function criteriaReviewExemplar() {
    return {
        verdict: 'upheld|refuted|cannot-determine', rationale: '', attacks_tried: [''],
        sample_adequacy: 'adequate|inadequate|cannot-determine',
        judgments: [{ sample_id: '', candidacy: 'candidate|excluded|not-candidate|cannot-determine', criterion_refs: [''] }],
        missing_for_determination: null, flags: [''],
    };
}
export function validateCriteriaReview(value, subject) {
    record(value, ['verdict', 'rationale', 'attacks_tried', 'sample_adequacy', 'judgments', 'missing_for_determination', 'flags'], 'criteria review keys');
    assertWork(['upheld', 'refuted', 'cannot-determine'].includes(String(value.verdict)), 'WORK_CONTRACT', 'criteria verdict');
    text(value.rationale, 'criteria rationale');
    assertWork(Array.isArray(value.attacks_tried) && value.attacks_tried.length > 0
        && value.attacks_tried.every((entry) => typeof entry === 'string' && entry.trim()), 'WORK_CONTRACT', 'criteria attacks');
    assertWork(['adequate', 'inadequate', 'cannot-determine'].includes(String(value.sample_adequacy)), 'WORK_CONTRACT', 'sample adequacy');
    assertWork(Array.isArray(value.flags) && value.flags.every((entry) => typeof entry === 'string')
        && (value.missing_for_determination === null || typeof value.missing_for_determination === 'string'), 'WORK_CONTRACT', 'criteria metadata');
    assertWork(Array.isArray(value.judgments) && value.judgments.length === subject.samples.length, 'WORK_ACCOUNTING', 'sample coverage');
    const criteria = Buffer.from(subject.criteria_bytes_base64, 'base64').toString('utf8');
    const tables = parseTables(criteria);
    const admission = tables.find((entry) => entry.header[0] === '#')?.rows.map((row) => `admission:${row.cells[0]}`) || [];
    const exclusion = tables.find((entry) => entry.header[0] === 'class')?.rows.map((row) => `exclusion:${row.cells[0]}`) || [];
    value.judgments.forEach((judgment, index) => {
        record(judgment, ['sample_id', 'candidacy', 'criterion_refs'], 'sample judgment');
        assertWork(judgment.sample_id === subject.samples[index].sample_id
            && ['candidate', 'excluded', 'not-candidate', 'cannot-determine'].includes(String(judgment.candidacy)), 'WORK_ACCOUNTING', 'sample identity/candidacy');
        assertWork(Array.isArray(judgment.criterion_refs) && new Set(judgment.criterion_refs).size === judgment.criterion_refs.length
            && judgment.criterion_refs.every((ref) => [...admission, ...exclusion].includes(String(ref))), 'WORK_REFERENCE', 'criterion reference');
        if (judgment.candidacy === 'candidate')
            assertWork(judgment.criterion_refs.some((ref) => admission.includes(String(ref))), 'WORK_REFERENCE', 'candidate criterion');
        if (judgment.candidacy === 'excluded')
            assertWork(judgment.criterion_refs.some((ref) => exclusion.includes(String(ref))), 'WORK_REFERENCE', 'exclusion criterion');
    });
    if (value.verdict === 'upheld')
        assertWork(value.sample_adequacy === 'adequate'
            && value.judgments.every((entry) => entry.candidacy !== 'cannot-determine'), 'WORK_CONTRACT', 'indeterminate criteria cannot be upheld');
}
/**
 * Sample selection is a retained orchestration proposal, not a new Core
 * sampling policy. Core checks its frozen loci; reviewers assess adequacy.
 */
export function criteriaSampleProposal(model, criteria, proposalBytes = required(model, CRITERIA_SAMPLE_PROPOSAL_PATH)) {
    const samples = [];
    const proposal = parseStrictJson(proposalBytes);
    record(proposal, ['format', 'samples'], 'criteria sample proposal');
    assertWork(proposal.format === 'aleph-criteria-sample-proposal/v1' && Array.isArray(proposal.samples)
        && proposal.samples.length > 0, 'WORK_SAMPLE', 'recorded bounded samples required');
    for (const selected of proposal.samples) {
        record(selected, ['source_id', 'locator'], 'sample locus');
        const source = model.corpus.sources.find((entry) => entry.values.sourceId === selected.source_id);
        assertWork(source && typeof selected.locator === 'string', 'WORK_SAMPLE', 'frozen source and locator');
        const path = sourceFilePath(model.runDir, source.values.locus);
        assertWork(path && source.values.scheme === 'md-lines', 'WORK_SOURCE_UNSUPPORTED', source.values.sourceId);
        const bytes = readFileSync(path);
        assertWork(workDigest(bytes) === source.values.contentHash, 'WORK_SOURCE_CHANGED', source.values.sourceId);
        const match = /^L([1-9][0-9]*)-L([1-9][0-9]*)$/u.exec(selected.locator);
        assertWork(match, 'WORK_SAMPLE', 'exact md-lines locator');
        const span = mdLineSpan(path, Number(match[1]), Number(match[2]));
        assertWork(span?.bytes, 'WORK_SAMPLE', source.values.sourceId);
        assertWork(!samples.some((entry) => entry.source_id === selected.source_id && entry.locator === selected.locator), 'WORK_SAMPLE', 'duplicate sample');
        samples.push({ sample_id: `SAMPLE-${samples.length + 1}`, source_id: source.values.sourceId, locator: selected.locator,
            content_hash: source.values.contentHash, exact_bytes_base64: span.bytes.toString('base64') });
    }
    assertWork(samples.length > 0, 'WORK_SAMPLE', 'no nonempty frozen sample is available');
    return { format: 'aleph-criteria-subject/v1', run_id: model.manifest.runId,
        criteria_digest: workDigest(criteria), criteria_bytes_base64: criteria.toString('base64'),
        sample_proposal: { path: CRITERIA_SAMPLE_PROPOSAL_PATH, digest: workDigest(proposalBytes), claim: 'bounded-proposal-not-representative-coverage' },
        samples };
}
export function selectNextWork(model, execution) {
    assertWork(hasRunCapability(model.manifest?.runFormatVersion || '', WORK_TRANSITION_CAPABILITY), 'WORK_CAPABILITY', 'run does not select work transitions');
    if (execution.blocked)
        return { kind: 'halt', code: 'WORK_EXISTING_GATE_OR_HALT', reason: 'Retained authority or operational halt has precedence.' };
    if (execution.stage === 'S0') {
        assertWork(execution.stage_status === 'closed' && execution.core_state === 'CORPUS-FROZEN', 'WORK_STAGE', 'S0 freeze is incomplete');
        return { kind: 'local', obligation: obligation('S0', 'S0.frozen', 'stage.enter-S1', model.manifest.runId, required(model, 'run-manifest.md')) };
    }
    if (execution.stage === 'S1') {
        if (!file(model, CRITERIA_SAMPLE_PROPOSAL_PATH)) {
            const input = join(model.runDir, CRITERIA_SAMPLE_INPUT_PATH);
            if (!existsSync(input))
                return { kind: 'proposal', operation: 'criteria.samples', input_path: CRITERIA_SAMPLE_INPUT_PATH };
            const bytes = readFileSync(input);
            criteriaSampleProposal(model, Buffer.alloc(0), bytes);
            return { kind: 'local', obligation: obligation('S1', 'S1.criteria-sample-subject', 'criteria.prepare-samples', model.manifest.runId, bytes) };
        }
        const criteria = file(model, 'ledgers/extraction-criteria.md');
        if (!criteria)
            return { kind: 'worker',
                obligation: obligation('S1', 'S1.inventory-and-criteria', 'inventory.finalize', model.manifest.runId, required(model, 'corpus/manifest.md')),
                call: { role: 'intake-clerk', kind: 'producer', task_line: INTAKE_WORK_TASK,
                    allowlist: ['corpus/manifest.md', ...model.corpus.sources.map((source) => {
                            const locus = source.values.locus;
                            return locus.startsWith('corpus/') ? locus : `corpus/${locus}`;
                        })].sort(), producer_dependency: null, output_selector: 'Role: Intake Clerk (S0–S1)' } };
        const subjectBytes = required(model, CRITERIA_SUBJECT_PATH);
        const subject = parseStrictJson(subjectBytes);
        assertWork(subject.criteria_digest === workDigest(criteria)
            && workJson(criteriaSampleProposal(model, criteria)).equals(subjectBytes), 'WORK_SUBJECT_CHANGED', 'criteria/sample subject');
        for (const [index, path] of CRITERIA_REVIEW_PATHS.entries())
            if (!file(model, path)) {
                return { kind: 'worker', obligation: obligation('S1', 'S1.criteria-agreement', `criteria.review-${index + 1}`, model.manifest.runId, subjectBytes),
                    call: { role: 'criteria-reviewer', kind: 'refuter', task_line: CRITERIA_REVIEW_TASK,
                        allowlist: [CRITERIA_SUBJECT_PATH], producer_dependency: 'S1.inventory-and-criteria', output_selector: 'S1 — criteria agreement review' } };
            }
        const reviews = CRITERIA_REVIEW_PATHS.map((path) => parseStrictJson(required(model, path)));
        for (const review of reviews)
            validateCriteriaReview(review.value, subject);
        assertWork(reviews[0].context_id !== reviews[1].context_id, 'WORK_REVIEW_ISOLATION', 'criteria reviewers reused context');
        const values = reviews.map((review) => review.value);
        if (values.some((value) => value.verdict !== 'upheld')
            || !workJson(values[0].judgments).equals(workJson(values[1].judgments))) {
            return { kind: 'halt', code: 'S1_CRITERIA_AGREEMENT_UNMET', reason: 'The independent reviews do not establish matching determinate candidacy judgments.' };
        }
        return { kind: 'local', obligation: obligation('S1', 'S1.criteria-agreement', 'stage.enter-S2', model.manifest.runId, subjectBytes) };
    }
    if (execution.stage === 'S2')
        return selectS2Work(model);
    if (execution.stage === 'S3')
        return selectS3Work(model);
    return { kind: 'halt', code: 'WORK_FRONTIER_UNIMPLEMENTED', reason: `No work family is registered for ${execution.stage}.` };
}
function intakeEffects(model, accepted, now) {
    const returned = accepted.value;
    record(returned, ['sources', 'criteria'], 'intake');
    assertWork(Array.isArray(returned.sources) && returned.sources.length === model.corpus.sources.length, 'WORK_ACCOUNTING', 'inventory coverage');
    const sources = returned.sources;
    const rows = sources.map((value, index) => {
        record(value, ['source_id', 'kind', 'locus', 'scheme', 'content_hash', 'dates', 'trust_class', 'sensitivity', 'admission_note', 'flags'], 'intake source');
        const prior = model.corpus.sources[index].values;
        for (const [key, original] of Object.entries({ source_id: prior.sourceId, locus: prior.locus, scheme: prior.scheme, content_hash: prior.contentHash })) {
            assertWork(value[key] === original, 'WORK_SOURCE_CHANGED', `${prior.sourceId}/${key}`);
        }
        assertWork(['conversation-export', 'deep-research-output', 'design-note', 'spec', 'external-research-intake', 'authority-statement'].includes(String(value.kind))
            && ['first-party', 'model-generated', 'third-party', 'unverifiable'].includes(String(value.trust_class)), 'WORK_CONTRACT', 'source classification');
        text(value.admission_note, 'admission note');
        text(value.dates, 'source dates');
        assertWork(Array.isArray(value.flags) && value.flags.every((flag) => typeof flag === 'string')
            && Array.isArray(value.sensitivity) && value.sensitivity.every((label) => typeof label === 'string'), 'WORK_CONTRACT', 'source flags');
        const approved = prior.sensitivity.split(',').map((label) => label.trim());
        assertWork(value.sensitivity.every((label) => label === 'none' || approved.includes(String(label))), 'S1_SENSITIVITY_AUTHORITY_REQUIRED', prior.sourceId);
        return [prior.sourceId, String(value.kind), prior.locus, prior.scheme, prior.contentHash, String(value.dates),
            String(value.trust_class), prior.sensitivity, String(value.admission_note)];
    });
    const c = returned.criteria;
    record(c, ['candidate_definition', 'admission', 'exclusion_classes', 'granularity_policy', 'normalization_conventions'], 'criteria');
    for (const key of ['candidate_definition', 'granularity_policy', 'normalization_conventions'])
        text(c[key], key);
    assertWork(Array.isArray(c.admission) && c.admission.length > 0 && Array.isArray(c.exclusion_classes), 'WORK_CONTRACT', 'criteria arrays');
    const admissions = c.admission.map((value, index) => {
        record(value, ['n', 'criterion', 'example'], 'admission');
        assertWork(value.n === index + 1, 'WORK_CONTRACT', 'criteria must have contiguous positive numbers');
        text(value.criterion, 'criterion');
        text(value.example, 'example');
        return [String(value.n), value.criterion, value.example];
    });
    const exclusions = c.exclusion_classes.map((value) => {
        record(value, ['class', 'description', 'example'], 'exclusion');
        assertWork(typeof value.class === 'string' && /^[a-z][a-z0-9-]*$/u.test(value.class), 'WORK_CONTRACT', 'exclusion class');
        text(value.description, 'exclusion description');
        text(value.example, 'exclusion example');
        return [value.class, value.description, value.example];
    });
    assertWork(new Set(exclusions.map((row) => row[0])).size === exclusions.length, 'WORK_CONTRACT', 'duplicate exclusion class');
    const manifest = required(model, 'corpus/manifest.md').toString('utf8');
    const inventoryTables = parseTables(manifest).filter((entry) => entry.normalizedHeader[0] === 'source id'
        && entry.normalizedHeader.includes('admission note'));
    assertWork(inventoryTables.length === 1, 'WORK_PREREQUISITE', 'unique T2.1 inventory');
    const inventory = inventoryTables[0], lines = manifest.split('\n');
    lines.splice(inventory.line - 1, inventory.rows.length + 2, table(inventory.header, rows).trimEnd());
    const criteria = Buffer.from(`# Extraction Criteria — ${model.manifest.runId}\n\n- written: ${now}\n- author: ${accepted.call_id}\n\n`
        + `## Candidate-claim definition (this corpus)\n${semanticClaimCell(String(c.candidate_definition))}\n\n`
        + `## Admission criteria\n${table(['#', 'criterion', 'example span that qualifies'], admissions)}\n`
        + `## Exclusion classes\n${table(['class', 'description', 'example'], exclusions)}\n`
        + `## Granularity policy\n${semanticClaimCell(String(c.granularity_policy))}\n\n`
        + `## Normalization conventions\n${semanticClaimCell(String(c.normalization_conventions))}\n`);
    return { effects: [
            effect(model, 'corpus/manifest.md', Buffer.from(lines.join('\n'))),
            effect(model, 'ledgers/extraction-criteria.md', criteria),
            effect(model, CRITERIA_SUBJECT_PATH, workJson(criteriaSampleProposal(model, criteria))),
        ], origins: [
            { artifact: 'corpus/manifest.md', field: 'source inventory semantic fields', from: { kind: 'accepted', call_id: accepted.call_id, selector: '/sources' } },
            { artifact: 'corpus/manifest.md', field: 'scope/source identity/sensitivity', from: { kind: 'canonical', path: 'corpus/manifest.md', selector: 'T2.1 immutable identity and human rulings' } },
            { artifact: 'ledgers/extraction-criteria.md', field: 'criteria', from: { kind: 'accepted', call_id: accepted.call_id, selector: '/criteria' } },
            { artifact: CRITERIA_SUBJECT_PATH, field: '*', from: { kind: 'rule', rule: 'criteria-sample-proposal/v1' } },
        ] };
}
export function deriveWorkTransition(model, execution, work, accepted, now) {
    const expected = selectNextWork(model, execution);
    assertWork(work.kind !== 'halt' && work.kind !== 'proposal' && workJson(work).equals(workJson(expected)), 'WORK_STALE', 'work is not the first unmet obligation');
    assertWork(!Number.isNaN(Date.parse(now)), 'WORK_IDENTITY', 'retained operation time');
    const base = { format: 'aleph-core-work-transition/v1', obligation: work.obligation,
        next_execution: { ...execution }, simulation: accepted?.simulation || false };
    if (work.obligation.operation.startsWith('sem.'))
        return { ...base, family: 'semantic',
            ...semanticTransition(model, work, accepted),
            origins: [{ artifact: SEMANTIC_PATH, field: '*', from: { kind: 'rule', rule: work.obligation.operation } }] };
    if (work.kind === 'worker') {
        assertWork(accepted && accepted.role === work.call.role && accepted.context_id, 'WORK_ACCEPTANCE', 'exact required worker return');
        if (work.obligation.operation === 'inventory.finalize')
            return { ...base, family: 'inventory', ...intakeEffects(model, accepted, now) };
        if (['s2.capture', 's2.reconcile-gap'].includes(work.obligation.operation))
            return { ...base, family: 's2-capture',
                ...deriveS2Capture(model, work, accepted), origins: [{ artifact: 'ledgers/packet-index.md', field: 'packets/evidence/walk',
                        from: { kind: 'accepted', call_id: accepted.call_id, selector: '/packets,/walk_intervals,/extraction_events,/next_cursor' } }] };
        if (work.obligation.operation === 's2.gap-review')
            return { ...base, family: 's2-gap-review',
                ...deriveGapReview(model, work, accepted), origins: [{ artifact: 'ledgers/source-walk.md', field: 'gap result and source completion',
                        from: { kind: 'accepted', call_id: accepted.call_id, selector: '/verdict,/rationale,/candidate_evidence' } }] };
        if (work.obligation.operation === 's3.capture')
            return { ...base, family: 's3-capture',
                effects: deriveS3Capture(model, work, accepted), origins: [{ artifact: S3_CAPTURES, field: '*',
                        from: { kind: 'accepted', call_id: accepted.call_id, selector: '/claims,/no_claim_packets,/material_findings,/semantic_units' } }] };
        const index = ['criteria.review-1', 'criteria.review-2'].indexOf(work.obligation.operation);
        assertWork(index !== -1 && accepted.producer_context_id && accepted.context_id !== accepted.producer_context_id, 'WORK_REVIEW_ISOLATION', 'criteria review producer/context');
        validateCriteriaReview(accepted.value, parseStrictJson(required(model, CRITERIA_SUBJECT_PATH)));
        if (index === 1) {
            const first = parseStrictJson(required(model, CRITERIA_REVIEW_PATHS[0]));
            assertWork(first.context_id !== accepted.context_id, 'WORK_REVIEW_ISOLATION', 'independent criteria passes');
        }
        return { ...base, family: 'criteria-review', effects: [effect(model, CRITERIA_REVIEW_PATHS[index], workJson(accepted))],
            origins: [{ artifact: CRITERIA_REVIEW_PATHS[index], field: '*', from: { kind: 'accepted', call_id: accepted.call_id, selector: '' } }] };
    }
    assertWork(accepted === null, 'WORK_ACCEPTANCE', 'local transition must not borrow worker authority');
    if (work.obligation.operation === 's3.prepare-normalizer') {
        const prep = s3Preparation(model, work.obligation.subject_id), paths = semanticProducerViewPaths(prep.call_id);
        const selections = semanticProducerSelections(model, 'normalizer', 'S3', { origin_semantic_ids: [prep.origin_semantic_id] });
        const view = semanticProducerView(model, 'normalizer', 'S3', selections);
        return { ...base, family: 's3-preparation', effects: [effect(model, `${S3_PREPARATIONS}${prep.call_id}.json`, workJson(prep)),
                effect(model, paths.selections, Buffer.from(semanticJson(selections))), effect(model, paths.view, view.bytes)],
            origins: [{ artifact: paths.view, field: '*', from: { kind: 'rule', rule: 'T3.7:exact-reviewed-origin-packet-batch' } }] };
    }
    if (work.obligation.operation === 'stage.seal-S3') {
        validateSemanticRun(model);
        validateRepresentationRun(model);
        const sealPath = 'verification/harness/semantic-stage-seals/S3.json';
        const bytes = Buffer.from(semanticJson(semanticStageSeal(semanticLedger(model), 'S3'))), digest = workDigest(bytes);
        const log = Buffer.from(`${required(model, 'run-log.md')}\n## ${now} — S3 — exit\n\nsemantic_stage: S3\n`
            + `semantic_review_seal_ref: ${sealPath}@${digest}\n\nCore normalization accounting closed.\n`
            + `\n## ${now} — S4 — entry\n\nCore duplicate, relation and ambiguity obligations begin.\n`);
        return { ...base, family: 'semantic', next_execution: { stage: 'S4', stage_status: 'entered', core_state: 'DISTILLING', blocked: false },
            effects: [effect(model, sealPath, bytes), effect(model, 'run-log.md', log)],
            semantic: { stage: 'S3', semantic_id: 'none', subject_digest: digest, operation: 'seal', record_id: 'S3',
                producer_call_id: '', reviewer_call_ids: [] },
            origins: [{ artifact: sealPath, field: '*', from: { kind: 'rule', rule: 'T3.7:S3-prefix-seal' } }] };
    }
    if (work.obligation.operation === 's2.commit-event') {
        const event = model.sourceWalk.events.find((entry) => entry.values.eventId === work.obligation.subject_id);
        const capture = s2Captures(model).find((entry) => entry.call_id === event.values.producerInvocationId);
        assertWork(capture && work.accepted_dependencies?.length === 1 && work.accepted_dependencies[0] === capture.call_id, 'WORK_EVENT_BINDING', 'exact authenticated original producer dependency required');
        const value = capturedValue(model, capture);
        const source_completion = derivePendingEventCommitment(model, event.values.eventId);
        return { ...base, family: 's2-event-commitment', simulation: value.simulation, source_completion,
            effects: [effect(model, 'ledgers/source-walk.md', Buffer.from(source_completion.after_base64, 'base64'))],
            origins: [{ artifact: 'ledgers/source-walk.md', field: `event:${event.values.eventId}:status/cursor/completion`,
                    from: { kind: 'rule', rule: 'HUMAN-C03:same-identity-pending-event-commitment' } }] };
    }
    if (['s2.prepare-gap-target', 's2.prepare-gap-producer'].includes(work.obligation.operation)) {
        const sourceId = work.obligation.subject_id, basis = gapSubject(model, sourceId);
        const targetPath = `${GAP_PRODUCERS}${basis.digest.slice(7)}.json`;
        let effects;
        if (work.obligation.operation === 's2.prepare-gap-target') {
            const review = parseStrictJson(required(model, `${GAP_RETURNS}${basis.digest.slice(7)}.json`));
            effects = [effect(model, targetPath, Buffer.from(semanticJson({ format: 'aleph-gap-producer-subject/v1', source_id: sourceId,
                    review_basis_digest: basis.digest, review_basis_cursor_id: basis.cursor.values.cursorId, candidates: review.candidate_evidence })))];
        }
        else {
            const callId = `CALL-F03-${workDigest(workJson({ run_id: model.manifest.runId,
                operation: 's2.gap-producer', review_basis_digest: basis.digest })).slice(7)}`;
            const paths = semanticProducerViewPaths(callId);
            const selections = semanticProducerSelections(model, 'extractor', 'S2', { source_id: sourceId, gap_subject_path: targetPath });
            const view = semanticProducerView(model, 'extractor', 'S2', selections);
            effects = [effect(model, paths.selections, Buffer.from(semanticJson(selections))), effect(model, paths.view, view.bytes)];
        }
        return { ...base, family: 's2-preparation', effects, origins: [{ artifact: targetPath, field: '*',
                    from: { kind: 'rule', rule: 'T3.7:separate-producer-for-original-L1-source-positions' } }] };
    }
    if (work.obligation.operation === 'stage.seal-S2') {
        const checks = new ResultCollector('S2 closure');
        runK2(checks, model, join(model.runDir, 'control/runtime/bundle'));
        const failed = checks.checks.filter((check) => check.id === 'K2.14' && check.status === 'FAIL');
        assertWork(failed.length === 0 && model.sourceWalk.completions.every((row) => row.values.completionState === 'complete'), 'WORK_S2_CLOSURE', failed.map((check) => check.message).join('; '));
        validateRepresentationRun(model);
        const sealPath = 'verification/harness/semantic-stage-seals/S2.json';
        const bytes = Buffer.from(semanticJson(semanticStageSeal(semanticLedger(model), 'S2'))), digest = workDigest(bytes);
        const log = Buffer.from(`${required(model, 'run-log.md')}\n## ${now} — S2 — exit\n\nsemantic_stage: S2\n`
            + `semantic_review_seal_ref: ${sealPath}@${digest}\n\nCore source-walk and semantic obligations closed; no recall claim.\n`
            + `\n## ${now} — S3 — entry\n\nCore-authorized normalization begins.\n`);
        return { ...base, family: 'semantic', next_execution: { stage: 'S3', stage_status: 'entered', core_state: 'DISTILLING', blocked: false },
            effects: [effect(model, sealPath, bytes), effect(model, 'run-log.md', log),
                effect(model, 'ledgers/claim-inventory.md', Buffer.from('# Claim inventory\n\n' + table(CLAIM_HEADERS, [])))],
            semantic: { stage: 'S2', semantic_id: 'none', subject_digest: digest, operation: 'seal', record_id: 'S2',
                producer_call_id: '', reviewer_call_ids: [] },
            origins: [{ artifact: sealPath, field: '*', from: { kind: 'rule', rule: 'T3.7:S2-prefix-seal' } }] };
    }
    if (work.obligation.operation === 's2.prepare-gap-review') {
        const subject = gapSubject(model, work.obligation.subject_id);
        return { ...base, family: 's2-preparation', effects: [effect(model, subject.path, subject.bytes)],
            origins: [{ artifact: subject.path, field: '*', from: { kind: 'rule', rule: 'L1:one-source-primary-review-basis' } }] };
    }
    if (['s2.initial-cursor', 's2.prepare-extractor'].includes(work.obligation.operation))
        return {
            ...base, family: 's2-preparation', effects: deriveS2Preparation(model, work),
            origins: [{ artifact: 'verification/harness/work-preparations/', field: '*', from: { kind: 'rule', rule: work.obligation.operation } }],
        };
    if (work.obligation.operation === 'criteria.prepare-samples') {
        const bytes = readFileSync(join(model.runDir, CRITERIA_SAMPLE_INPUT_PATH));
        criteriaSampleProposal(model, Buffer.alloc(0), bytes);
        return { ...base, family: 'criteria-preparation',
            effects: [effect(model, CRITERIA_SAMPLE_PROPOSAL_PATH, workJson(parseStrictJson(bytes)))],
            origins: [{ artifact: CRITERIA_SAMPLE_PROPOSAL_PATH, field: '*',
                    from: { kind: 'rule', rule: 'criteria.samples:exact-frozen-loci-only' } }] };
    }
    const next = work.obligation.operation === 'stage.enter-S1' ? 'S1' : 'S2';
    assertWork(['stage.enter-S1', 'stage.enter-S2'].includes(work.obligation.operation), 'WORK_OPERATION', work.obligation.operation);
    const log = Buffer.from(`${required(model, 'run-log.md').toString('utf8')}\n## ${now} — ${execution.stage} — exit\n`
        + `Core obligation ${work.obligation.dod} satisfied by retained evidence.\n\n## ${now} — ${next} — entry\n`
        + 'Deterministic orchestration transition; no semantic or human acceptance asserted.\n');
    const entry = next === 'S2' ? s2Entry(model, now) : { effects: [] };
    return { ...base, ...entry, family: 'stage', next_execution: { stage: next, stage_status: 'entered', core_state: next === 'S1' ? 'CORPUS-FROZEN' : 'DISTILLING', blocked: false },
        effects: [effect(model, 'run-log.md', log), ...entry.effects],
        origins: [{ artifact: 'run-log.md', field: '*', from: { kind: 'rule', rule: work.obligation.operation } }] };
}
/** Existing Core plan validators remain mandatory for the exact derived bytes. */
export function validateDerivedWorkTransition(model, proposedModel, transition) {
    for (const write of transition.effects) {
        assertWork(workDigest(readFileSync(join(proposedModel.runDir, write.path))) === write.after_digest, 'WORK_PLAN', 'proposed bytes differ from Core derivation');
    }
    if (transition.source_completion) {
        assertWork(workJson(validateSourceWalkCompletionWrite(model, proposedModel)).equals(workJson(transition.source_completion)), 'WORK_PLAN', 'source-walk transition differs from Core lifecycle derivation');
    }
    if (!transition.semantic)
        return;
    const meta = transition.semantic;
    planSemanticWrite({ model, proposedModel, stage: meta.stage, semantic_id: meta.semantic_id, subject_digest: meta.subject_digest,
        operation: meta.operation, record_id: meta.record_id, prerequisite_paths: [],
        writes: transition.effects.map((write) => ({ path: write.path, before_hash: write.before_digest || workDigest(Buffer.alloc(0)),
            after_base64: write.after_base64, after_hash: write.after_digest })) });
    if (meta.operation === 'seal')
        return;
    const binding = (callId) => {
        const root = `control/worker-returns/${callId}`;
        const dispatch = parseStrictJson(readFileSync(join(proposedModel.runDir, root, 'native-dispatch.json')));
        const request = parseStrictJson(readFileSync(join(proposedModel.runDir, `control/worker-bundles/${callId}/request.json`)));
        return { call_id: callId, context_id: dispatch.receipt.context_id,
            raw_return_hash: workDigest(readFileSync(join(proposedModel.runDir, root, 'raw.json'))), role: request.role };
    };
    validateSemanticAcceptedBindings(proposedModel, meta.semantic_id, meta.operation, binding(meta.producer_call_id), meta.reviewer_call_ids.map(binding));
}

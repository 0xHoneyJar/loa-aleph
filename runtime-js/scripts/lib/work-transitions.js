import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseStrictJson } from './worker-return-contract.js';
import { canonicalJsonBytes } from './bundle-format.js';
import { hasRunCapability } from './run-model.js';
import { parseTables } from './markdown.js';
import { mdLineSpan, sourceFilePath } from './check-helpers.js';
import { semanticClaimCell, SEMANTIC_PATH, emptySemanticLedger, semanticLedgerMarkdown, degradedPacketBinding, semanticProducerBinding, semanticDegradedMaterialViews, buildSemanticSubject, } from './semantic-review.js';
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
function s2Entry(model, now) {
    const packets = '# Packet Index\n\n- exact_evidence_format: aleph-exact-evidence/v1\n\n'
        + PACKET_TABLES.map((headers, index) => `## ${['Packets', 'Exact evidence records', 'Exact fragments', 'Evidence transformations'][index]}\n\n${table(headers, [])}\n`).join('');
    const walk = '# Source Walk Ledger\n\n- source_walk_format: aleph-source-walk/v1\n- source_position_format: zero-based-utf8-byte-half-open/v1\n\n'
        + WALK_TABLES.map((headers, index) => `## ${['Primary walk intervals', 'Extraction events', 'Resume cursors', 'Fresh gap reviews', 'Per-source completion'][index]}\n\n${table(headers, [])}\n`).join('');
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
    return effects;
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
    if (work.kind === 'worker') {
        assertWork(accepted && accepted.role === work.call.role && accepted.context_id, 'WORK_ACCEPTANCE', 'exact required worker return');
        if (work.obligation.operation === 'inventory.finalize')
            return { ...base, family: 'inventory', ...intakeEffects(model, accepted, now) };
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
    return { ...base, family: 'stage', next_execution: { stage: next, stage_status: 'entered', core_state: next === 'S1' ? 'CORPUS-FROZEN' : 'DISTILLING', blocked: false },
        effects: [effect(model, 'run-log.md', log), ...next === 'S2' ? s2Entry(model, now) : []],
        origins: [{ artifact: 'run-log.md', field: '*', from: { kind: 'rule', rule: work.obligation.operation } }] };
}

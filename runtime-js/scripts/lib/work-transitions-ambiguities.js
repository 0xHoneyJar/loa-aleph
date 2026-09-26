import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { sourceFilePath, mdLineSpan } from './check-helpers.js';
import { hasRunCapability } from './run-model.js';
import { parseStrictJson } from './worker-return-contract.js';
import { lineageCurrentPacketIds, lineageCurrentClaimIds } from './lineage.js';
import { semanticJson, semanticPacketBasis } from './semantic-review.js';
import { parseRelations } from './relations.js';
import { runK2Ambiguities, validateSourceLocators } from './checks-k2-ambiguities.js';
import { ResultCollector } from './results.js';
import { INTERNAL_AMBIGUITY_FORMAT, T5_1_HEADER, T5_2_HEADER, T5_3_HEADER, ambiguityReviewSubjectJson, ambiguityReviewSubjectDigest, parseInternalAmbiguities, materialImpactSubjectJson, materialImpactSubjectDigest, materialImpactSubjectProblems, MATERIAL_IMPACT_SUBJECT_FORMAT, loadPinnedCoreAuthority, resolvePinnedCoreRequirement, closurePhases, buildProceduralAuthoritySubject, legalFrozenSourceRef, parseCandidateRefs, } from './internal-ambiguity.js';
import { selectProceduralWork, deriveProceduralTransition } from './work-transitions-authority.js';
import { assertWork, file, required, effect, obligation, workDigest, table, nextId, semanticLedger, semanticDependencies, appendRows } from './work-transitions.js';
export const AMBIGUITY_WORK_ROOT = 'verification/harness/ambiguity-work/';
export const AMBIGUITY_SELECTION_INPUT = 'control/work-proposals/S4-ambiguity-expressions.json';
const SELECTION = `${AMBIGUITY_WORK_ROOT}expression-selection.json`;
const LEDGER = 'ledgers/internal-ambiguities.md';
const b = (v) => Buffer.from(semanticJson(v));
const json = (v) => parseStrictJson(v, true);
const pathFor = (id, part) => `${AMBIGUITY_WORK_ROOT}${id}/${part}.json`;
export const AMBIGUITY_TASK = 'Propose the exact selected frozen-source expression and its bounded same-source ambiguity assessment.';
export const AMBIGUITY_REVIEW_TASK = 'Challenge the exact ambiguity subject and its sealed same-source basis without changing the proposal.';
export const IMPACT_TASK = 'Propose material impact for the exact upheld unresolved assessment under the supplied pinned Core requirements.';
export const IMPACT_REVIEW_TASK = 'Challenge the exact material-impact subject without selecting an action or changing the proposal.';
function fields(value, names, label) {
    assertWork(value && typeof value === 'object' && !Array.isArray(value)
        && Object.keys(value).sort().join('\0') === names.sort().join('\0'), 'WORK_AMBIGUITY_FORMAT', label);
}
function source(model, id) {
    assertWork(legalFrozenSourceRef(model, id), 'WORK_AMBIGUITY_SOURCE', 'exact unique frozen source required');
    const row = model.corpus.sources.find((s) => s.values.sourceId === id)?.values;
    assertWork(row?.scheme === 'md-lines', 'WORK_AMBIGUITY_SOURCE', 'exact supported frozen source required');
    const path = sourceFilePath(model.runDir, row.locus);
    assertWork(path, 'WORK_AMBIGUITY_SOURCE', id);
    const bytes = readFileSync(path);
    assertWork(workDigest(bytes) === row.contentHash, 'WORK_SOURCE_CHANGED', id);
    return { row, path, bytes };
}
function span(model, id, locator) {
    const s = source(model, id), match = /^L([1-9][0-9]*)-L([1-9][0-9]*)$/u.exec(locator);
    const slice = match && mdLineSpan(s.path, Number(match[1]), Number(match[2]));
    assertWork(slice?.bytes && slice.startByte !== null && slice.endByte !== null, 'WORK_AMBIGUITY_SOURCE', locator);
    return { start: slice.startByte, end: slice.endByte, bytes: slice.bytes };
}
/** A constrained selection of questions, not an ambiguity verdict or a writer plan. */
export function ambiguityExpressionSelection(model, bytes) {
    const value = json(bytes);
    fields(value, ['format', 'expressions'], 'expression selection');
    assertWork(value.format === 'aleph-ambiguity-expression-selection/v1' && Array.isArray(value.expressions), 'WORK_AMBIGUITY_FORMAT', 'registered expression-selection format');
    const expressions = value.expressions.map((e) => {
        fields(e, ['source_entity_kind', 'source_entity_id', 'source_id', 'locator', 'start_byte', 'end_byte', 'basis_packet_ids'], 'expression');
        const packet = e.source_entity_kind === 'PKT' && lineageCurrentPacketIds(model).has(e.source_entity_id)
            && model.packets.find((p) => p.values.packetId === e.source_entity_id)?.values;
        const claim = e.source_entity_kind === 'CC' && lineageCurrentClaimIds(model).has(e.source_entity_id)
            && model.claims.find((c) => c.values.claimId === e.source_entity_id)?.values;
        assertWork(packet && packet.sourceId === e.source_id || claim && claim.sources.split(',').map((s) => s.trim()).includes(e.source_id), 'WORK_AMBIGUITY_SOURCE', 'lineage-current same-source expression entity required');
        const s = source(model, e.source_id), locus = span(model, e.source_id, e.locator);
        assertWork(Number.isSafeInteger(e.start_byte) && Number.isSafeInteger(e.end_byte)
            && e.start_byte >= locus.start && e.end_byte <= locus.end && e.end_byte > e.start_byte, 'WORK_AMBIGUITY_SOURCE', 'exact expression interval');
        const exact = s.bytes.subarray(e.start_byte, e.end_byte);
        assertWork(Buffer.from(exact.toString('utf8')).equals(exact), 'WORK_AMBIGUITY_SOURCE', 'UTF-8 expression boundaries');
        assertWork(Array.isArray(e.basis_packet_ids) && e.basis_packet_ids.length > 0
            && new Set(e.basis_packet_ids).size === e.basis_packet_ids.length, 'WORK_AMBIGUITY_SOURCE', 'ordered unique packet basis');
        const basis = semanticPacketBasis(model, e.basis_packet_ids);
        assertWork(basis.every((p) => p.packet.source_id === e.source_id)
            && basis.some((p) => { const locus = span(model, e.source_id, p.packet.locator); return e.start_byte >= locus.start && e.end_byte <= locus.end; }), 'WORK_AMBIGUITY_SOURCE', 'expression requires exact same-source packet coverage');
        return { ...e, expression_sha256: workDigest(exact), expression_bytes_base64: exact.toString('base64') };
    });
    assertWork(new Set(expressions.map((e) => `${e.source_id}/${e.start_byte}/${e.end_byte}`)).size === expressions.length, 'WORK_AMBIGUITY_SOURCE', 'duplicate expression selection');
    return expressions;
}
function selection(model) { return ambiguityExpressionSelection(model, required(model, SELECTION)); }
function allocate(model, prefix) {
    return nextId(prefix, model.files.flatMap((f) => [...f.text.matchAll(new RegExp(`\\b${prefix}-\\d+\\b`, 'gu'))].map((m) => m[0])));
}
function local(op, id, basis, dependencies = []) {
    return { kind: 'local', accepted_dependencies: dependencies,
        obligation: obligation('S4', `S4.ambiguity.${op}`, `s4.ambiguity.${op}`, id, b(basis)) };
}
function sourceView(model, expression) {
    const s = source(model, expression.source_id), currentPackets = lineageCurrentPacketIds(model), currentClaims = lineageCurrentClaimIds(model);
    return { format: 'aleph-core-ambiguity-source-view/v1', expression, source: s.row, frozen_source_base64: s.bytes.toString('base64'),
        source_walk: { intervals: model.sourceWalk.intervals.filter((r) => r.values.sourceId === expression.source_id).map((r) => r.values),
            completion: model.sourceWalk.completions.filter((r) => r.values.sourceId === expression.source_id).map((r) => r.values) },
        packets: semanticPacketBasis(model, model.packets.filter((p) => currentPackets.has(p.values.packetId)
            && p.values.sourceId === expression.source_id).map((p) => p.values.packetId)),
        claims: model.claims.filter((c) => currentClaims.has(c.values.claimId) && c.values.sources.split(',').map((s) => s.trim()).includes(expression.source_id))
            .map((c) => ({ claim_id: c.values.claimId, normalized_claim: c.values.normalizedClaim, packets: c.values.packets, sources: c.values.sources })),
        c1_relations: parseRelations(model).rows.filter((r) => r.values.basisPacketIds.split(',').map((id) => id.trim()).some((id) => model.packets.some((p) => p.values.packetId === id && p.values.sourceId === expression.source_id))).map((r) => r.values) };
}
function preparations(model) {
    return model.files.filter((f) => new RegExp(`^${AMBIGUITY_WORK_ROOT}AMB-\\d+/preparation\\.json$`, 'u').test(f.relativePath))
        .map((f) => json(Buffer.from(f.text)));
}
function authenticateValue(model, value) {
    const raw = readFileSync(join(model.runDir, `control/worker-returns/${value.call_id}/raw.json`));
    assertWork(workDigest(raw) === value.raw_digest && isDeepStrictEqual(json(raw), value.value), 'WORK_AMBIGUITY_BINDING', 'retained accepted return changed');
}
function capture(model, p) {
    const raw = file(model, pathFor(p.ambiguity_id, 'capture'));
    if (!raw)
        return null;
    const c = json(raw);
    authenticateValue(model, c.accepted);
    assertWork(c.accepted.call_id === p.call_id && ambiguityReviewSubjectDigest(c.subject)
        === c.accepted.value.assessment.review_subject_digest, 'WORK_AMBIGUITY_BINDING', 'exact accepted subject');
    return c;
}
function retainedValue(model, id, part) {
    const bytes = file(model, pathFor(id, part));
    if (!bytes)
        return null;
    const v = json(bytes);
    authenticateValue(model, v);
    return v;
}
function worker(model, p, op, role, task, path, callId, dependencies, producer, output) {
    return { kind: 'worker', accepted_dependencies: dependencies,
        obligation: obligation('S4', `S4.ambiguity.${op}`, `s4.ambiguity.${op}`, p.ambiguity_id, required(model, path)),
        call: { prepared_call_id: callId, role, kind: producer ? 'refuter' : 'producer', task_line: task,
            allowlist: [path], producer_dependency: producer, output_selector: output } };
}
function call(id, part, basis) { return `CALL-F03-${workDigest(b({ id, part, basis })).slice(7)}`; }
const MATERIAL_CORE_PATHS = ['docs/architecture/04-pipeline-stages-and-dod.md', 'docs/architecture/03-artifact-contracts.md', 'docs/precis-wedge.md'];
function impactView(model, p, c) {
    const assessment = parseInternalAmbiguities(model).t5_2Rows.find((r) => r.values.ambiguityId === p.ambiguity_id);
    const authority = pinnedAmbiguityAuthority(model);
    return { format: 'aleph-core-material-impact-producer-view/v1', ambiguity_subject: ambiguitySubject(c.subject),
        assessment_row: assessment.raw, ambiguity_review: required(model, `verification/harness/${c.review_id}.md`).toString(),
        source_basis: sourceView(model, p.expression),
        current_packets: semanticPacketBasis(model, [...lineageCurrentPacketIds(model)]),
        current_claims: model.claims.filter((c) => lineageCurrentClaimIds(model).has(c.values.claimId))
            .map((c) => ({ claim_id: c.values.claimId, normalized_claim: c.values.normalizedClaim, packets: c.values.packets, sources: c.values.sources })),
        core_requirements: MATERIAL_CORE_PATHS.map((path) => {
            const bytes = authority.file_bytes.get(path);
            assertWork(bytes, 'WORK_AMBIGUITY_AUTHORITY', path);
            return { path, digest: workDigest(bytes), bytes_base64: bytes.toString('base64') };
        }) };
}
function materialSubject(model, p, c, value) {
    const raw = value.value;
    const assessment = parseInternalAmbiguities(model).t5_2Rows.find((r) => r.values.ambiguityId === p.ambiguity_id);
    assertWork(raw.proposed_by === `invocation:${value.call_id}`, 'WORK_AMBIGUITY_BINDING', 'exact material-impact producer');
    const subject = { format: MATERIAL_IMPACT_SUBJECT_FORMAT, run_id: model.manifest.runId,
        ambiguity_id: p.ambiguity_id, assessment_seq: Number(assessment.values.assessmentSeq), material_impact_seq: 1,
        t5_2_assessment_ref: `internal-ambiguity:T5.2:${p.ambiguity_id}:A${assessment.values.assessmentSeq}@${workDigest(assessment.raw)}`,
        t5_2_review_subject_digest: assessment.values.reviewSubjectDigest,
        t5_2_review_ref: `ambiguity-review-verdict:${c.review_id}@${workDigest(required(model, `verification/harness/${c.review_id}.md`))}`,
        c1_relation_basis_ref: c.subject.affected_relation_ids.length
            ? 'relations-basis:closure_phase=S4-C1-relations-closed;artifact=ledgers/relations.md' : 'none',
        materiality_class: raw.materiality_class, operative_scope: raw.operative_scope, source_locators: raw.source_locators,
        reviewed_unaffected_ids: raw.reviewed_unaffected_ids, unresolved_statement: raw.unresolved_statement,
        review_proposition: 'class-B-or-C-and-canonical-operative-scope-complete-and-accurate-under-cited-Core-requirements',
        proposed_by: raw.proposed_by };
    const problems = materialImpactSubjectProblems(subject);
    validateSourceLocators(model, p.expression.source_id, subject, (problem) => problems.push(problem), p.ambiguity_id);
    assertWork(!problems.length, 'WORK_AMBIGUITY_MATERIAL', problems.join('; '));
    const authority = pinnedAmbiguityAuthority(model);
    for (const row of subject.operative_scope.impact_rows) {
        const ref = resolvePinnedCoreRequirement(authority, row.requirement_ref);
        assertWork(MATERIAL_CORE_PATHS.includes(ref.path), 'WORK_AMBIGUITY_MATERIAL', 'requirement was not in the sealed producer basis');
    }
    return subject;
}
function impactCapture(model, p, c) {
    const bytes = file(model, pathFor(p.ambiguity_id, 'material-capture'));
    if (!bytes)
        return null;
    const m = json(bytes);
    authenticateValue(model, m.accepted);
    assertWork(materialImpactSubjectJson(m.subject) === materialImpactSubjectJson(materialSubject(model, p, c, m.accepted)), 'WORK_AMBIGUITY_BINDING', 'retained material-impact proposal changed');
    return m;
}
function impactReviewView(model, p, c, m) {
    return { format: 'aleph-core-material-impact-review-view/v1', subject: json(Buffer.from(materialImpactSubjectJson(m.subject))),
        basis: impactView(model, p, c) };
}
export function reviewedAmbiguityAuthorityBasis(model, id) {
    const p = preparations(model).find((p) => p.ambiguity_id === id);
    assertWork(p, 'WORK_AMBIGUITY_AUTHORITY', 'retained ambiguity work required');
    const c = capture(model, p), m = impactCapture(model, p, c);
    const review = retainedValue(model, id, 'review'), impactReview = retainedValue(model, id, 'material-review');
    assertWork(m?.subject.materiality_class === 'C' && review?.value?.verdict === 'upheld'
        && impactReview?.value?.verdict === 'upheld', 'WORK_AMBIGUITY_AUTHORITY', 'upheld Class C work required');
    assertWork(required(model, `verification/harness/S4/material-impact-subjects/${id}-A1-M1.json`)
        .equals(Buffer.from(materialImpactSubjectJson(m.subject))), 'WORK_AMBIGUITY_AUTHORITY', 'exact canonical material-impact subject');
    const subject = buildProceduralAuthoritySubject({
        run_id: model.manifest.runId, ambiguity_id: id, assessment_seq: 1,
        t5_2_assessment_ref: m.subject.t5_2_assessment_ref, t5_2_review_subject_digest: m.subject.t5_2_review_subject_digest,
        t5_2_review_ref: m.subject.t5_2_review_ref, prior_indeterminate_review_refs: [], candidate_state: c.subject.candidate_state,
        candidate_refs: c.subject.candidate_refs, carry_state: c.subject.carry_state, affected_relation_ids: c.subject.affected_relation_ids,
        c1_relation_basis_ref: m.subject.c1_relation_basis_ref, material_impact_seq: 1,
        material_impact_subject_ref: `material-impact-subject:${id}:A1:M1@${materialImpactSubjectDigest(m.subject)}`,
        material_impact_review_ref: `material-impact-verdict:${m.review_id}@${workDigest(required(model, `verification/harness/${m.review_id}.md`))}`,
        operative_scope: m.subject.operative_scope, source_locators: m.subject.source_locators,
        reviewed_unaffected_ids: m.subject.reviewed_unaffected_ids, unresolved_statement: m.subject.unresolved_statement,
    });
    return { subject, dependencies: [...p.dependencies, p.call_id, review.call_id, m.accepted.call_id, impactReview.call_id] };
}
export function pinnedAmbiguityAuthority(model) {
    return loadPinnedCoreAuthority({ bundle_lock_path: join(model.runDir, 'control/runtime/bundle/bundle.lock.json'),
        expected_bundle_digest: model.manifest.forwardIdentity.bundleDigest, expected_core_digest: model.manifest.forwardIdentity.coreDigest });
}
export function validateAmbiguityWorkState(model) {
    const checks = new ResultCollector('S4 ambiguity work');
    runK2Ambiguities(checks, model, pinnedAmbiguityAuthority(model));
    const failures = checks.checks.filter((c) => c.status === 'FAIL');
    assertWork(!failures.length, 'WORK_AMBIGUITY_STATE', failures.map((c) => c.message).join('; '));
}
export function selectAmbiguityWork(model) {
    assertWork(closurePhases(model.runLog).join(',') === 'S4-C1-relations-closed', 'WORK_AMBIGUITY_STAGE', 'C2 window only');
    if (!file(model, SELECTION)) {
        const path = join(model.runDir, AMBIGUITY_SELECTION_INPUT);
        if (!existsSync(path))
            return { kind: 'proposal', operation: 'ambiguity.expressions', input_path: AMBIGUITY_SELECTION_INPUT };
        const bytes = readFileSync(path);
        ambiguityExpressionSelection(model, bytes);
        return local('select', 'S4', json(bytes));
    }
    const selected = selection(model), preps = preparations(model);
    for (const [index, expression] of selected.entries()) {
        let p = preps.find((p) => semanticJson(p.expression) === semanticJson(expression));
        if (!p)
            return local('prepare', String(index), expression);
        assertWork(p.format === 'aleph-core-ambiguity-work-preparation/v1' && p.view_digest === workDigest(b(sourceView(model, expression)))
            && p.call_id === call(p.ambiguity_id, 'producer', p.view_digest)
            && required(model, pathFor(p.ambiguity_id, 'producer-view')).equals(b(sourceView(model, expression))), 'WORK_AMBIGUITY_BINDING', 'prepared source view changed');
        const c = capture(model, p);
        if (!c)
            return worker(model, p, 'capture', 'ambiguity-producer', AMBIGUITY_TASK, pathFor(p.ambiguity_id, 'producer-view'), p.call_id, p.dependencies, null, 'Role: Internal Ambiguity Producer (S4-C2)');
        assertWork(required(model, pathFor(p.ambiguity_id, 'review-view')).equals(b({
            format: 'aleph-core-ambiguity-review-view/v1', subject: ambiguitySubject(c.subject), source_basis: sourceView(model, expression)
        })), 'WORK_AMBIGUITY_BINDING', 'exact fresh ambiguity review view changed');
        const review = retainedValue(model, p.ambiguity_id, 'review');
        if (!review)
            return worker(model, p, 'review', 'ambiguity-reviewer', AMBIGUITY_REVIEW_TASK, pathFor(p.ambiguity_id, 'review-view'), c.review_call_id, [...p.dependencies, p.call_id], p.call_id, 'Role: Fresh Internal Ambiguity Reviewer (S4-C2)');
        if (review.value.verdict !== 'upheld')
            return { kind: 'halt', code: 'WORK_AMBIGUITY_REVIEW_UNRESOLVED', reason: `${p.ambiguity_id}: no upheld exact ambiguity review.` };
        const rows = parseInternalAmbiguities(model);
        if (!rows.t5_2Rows.some((r) => r.values.ambiguityId === p.ambiguity_id))
            return local('admit', p.ambiguity_id, c, [...p.dependencies, p.call_id, review.call_id]);
        if (c.subject.resolution_state === 'resolved-local')
            continue;
        const dependencies = [...p.dependencies, p.call_id, review.call_id], view = b(impactView(model, p, c));
        const materialViewPath = pathFor(p.ambiguity_id, 'material-producer-view');
        if (!file(model, materialViewPath))
            return local('material-prepare', p.ambiguity_id, json(view), dependencies);
        assertWork(required(model, materialViewPath).equals(view), 'WORK_AMBIGUITY_BINDING', 'material producer basis changed');
        const m = impactCapture(model, p, c);
        if (!m)
            return worker(model, p, 'material-capture', 'material-impact-producer', IMPACT_TASK, materialViewPath, call(p.ambiguity_id, 'material-producer', workDigest(view)), dependencies, null, 'Role: Material-Impact Producer (S4-C2)');
        const materialReviewPath = pathFor(p.ambiguity_id, 'material-review-view');
        assertWork(required(model, materialReviewPath).equals(b(impactReviewView(model, p, c, m))), 'WORK_AMBIGUITY_BINDING', 'material review basis changed');
        const materialReview = retainedValue(model, p.ambiguity_id, 'material-review');
        if (!materialReview)
            return worker(model, p, 'material-review', 'material-impact-reviewer', IMPACT_REVIEW_TASK, materialReviewPath, m.review_call_id, [...dependencies, m.accepted.call_id], m.accepted.call_id, 'Role: Fresh Material-Impact Reviewer (S4-C2)');
        if (materialReview.value.verdict !== 'upheld')
            return { kind: 'halt', code: 'WORK_MATERIAL_IMPACT_REVIEW_UNRESOLVED',
                reason: `${p.ambiguity_id}: material-impact scope has no upheld fresh review.` };
        if (m.subject.materiality_class === 'C') {
            const authority = selectProceduralWork(model, p.ambiguity_id);
            if (authority)
                return authority;
        }
    }
    validateAmbiguityWorkState(model);
    return null;
}
export function validateAmbiguityWorkDelivery(model, role, stage, callId, task, producerContext, attachments) {
    if (!['ambiguity-producer', 'ambiguity-reviewer', 'material-impact-producer', 'material-impact-reviewer'].includes(role)
        || !hasRunCapability(model.manifest?.runFormatVersion || '', 'orchestrator-work-transitions'))
        return;
    assertWork(stage === 'S4', 'WORK_AMBIGUITY_ISOLATION', 'S4 C2 work only');
    const selected = selectAmbiguityWork(model);
    assertWork(selected?.kind === 'worker' && selected.call.role === role && selected.call.prepared_call_id === callId
        && selected.call.task_line === task && selected.call.allowlist.length === attachments.length
        && selected.call.allowlist.every((path, i) => path === attachments[i].path && required(model, path).equals(attachments[i].bytes)), 'WORK_AMBIGUITY_ISOLATION', 'exact Core-derived invocation, task and attachments');
    const p = preparations(model).find((p) => p.ambiguity_id === selected.obligation.subject_id);
    const context = role === 'ambiguity-reviewer' ? capture(model, p).accepted.context_id
        : role === 'material-impact-reviewer' ? impactCapture(model, p, capture(model, p)).accepted.context_id : null;
    assertWork(producerContext === context, 'WORK_AMBIGUITY_ISOLATION', 'actual producer context withheld');
}
export function deriveAmbiguityTransition(model, work, value, now) {
    const op = work.obligation.operation.slice('s4.ambiguity.'.length), id = work.obligation.subject_id;
    if (['open-authority', 'apply-authority', 'followup-authority'].includes(op)) {
        assertWork(value === null, 'WORK_AMBIGUITY_AUTHORITY', 'worker cannot supply human authority');
        assertWork(now && !Number.isNaN(Date.parse(now)), 'WORK_AMBIGUITY_AUTHORITY', 'retained transaction time required');
        return deriveProceduralTransition(model, work, now);
    }
    const effects = [];
    if (op === 'select') {
        const input = readFileSync(join(model.runDir, AMBIGUITY_SELECTION_INPUT));
        ambiguityExpressionSelection(model, input);
        effects.push(effect(model, SELECTION, input));
        if (!file(model, LEDGER))
            effects.push(effect(model, LEDGER, Buffer.from(`# Internal Ambiguities\n\n- internal_ambiguity_format: ${INTERNAL_AMBIGUITY_FORMAT}\n\n`
                + '## T5.1 Ambiguity definitions\n\n' + table(T5_1_HEADER, []) + '\n## T5.2 Reviewed assessments\n\n' + table(T5_2_HEADER, [])
                + '\n## T5.3 Procedural authority\n\n' + table(T5_3_HEADER, []))));
    }
    else if (op === 'prepare') {
        const expression = selection(model)[Number(id)];
        assertWork(expression, 'WORK_AMBIGUITY_BINDING', 'exact expression index');
        const ambiguityId = allocate(model, 'AMB'), view = b(sourceView(model, expression));
        const dependencies = semanticLedger(model).subjects.filter((r) => {
            const s = json(required(model, r.subject_path));
            return s.packet_basis.some((p) => expression.basis_packet_ids.includes(p.packet_id));
        }).flatMap((r) => semanticDependencies(model, r.semantic_id));
        const p = { format: 'aleph-core-ambiguity-work-preparation/v1', ambiguity_id: ambiguityId, expression,
            call_id: call(ambiguityId, 'producer', workDigest(view)), view_digest: workDigest(view), dependencies: [...new Set(dependencies)] };
        effects.push(effect(model, pathFor(ambiguityId, 'preparation'), b(p)), effect(model, pathFor(ambiguityId, 'producer-view'), view));
    }
    else {
        const p = preparations(model).find((p) => p.ambiguity_id === id);
        assertWork(p, 'WORK_AMBIGUITY_BINDING', id);
        if (op.startsWith('material-')) {
            const c = capture(model, p);
            if (op === 'material-prepare')
                effects.push(effect(model, pathFor(id, 'material-producer-view'), b(impactView(model, p, c))));
            else if (op === 'material-capture') {
                assertWork(value?.role === 'material-impact-producer' && value.call_id === call(id, 'material-producer', workDigest(required(model, pathFor(id, 'material-producer-view')))), 'WORK_AMBIGUITY_BINDING', 'exact material-impact invocation');
                const subject = materialSubject(model, p, c, value), m = { accepted: value, subject,
                    review_id: allocate(model, 'VER'), review_call_id: call(id, 'material-review', materialImpactSubjectDigest(subject)) };
                effects.push(effect(model, pathFor(id, 'material-capture'), b(m)), effect(model, pathFor(id, 'material-review-view'), b(impactReviewView(model, p, c, m))));
            }
            else {
                const m = impactCapture(model, p, c);
                assertWork(op === 'material-review' && value?.role === 'material-impact-reviewer' && value.call_id === m.review_call_id
                    && value.producer_context_id === m.accepted.context_id && value.context_id !== m.accepted.context_id, 'WORK_AMBIGUITY_REVIEW', 'fresh material-impact reviewer required');
                const raw = value.value;
                assertWork(raw.target === `internal-ambiguity-material-impact-review-subject:${materialImpactSubjectDigest(m.subject)}`, 'WORK_AMBIGUITY_REVIEW', 'exact material-impact target');
                effects.push(effect(model, pathFor(id, 'material-review'), b(value)), effect(model, `verification/harness/S4/material-impact-subjects/${id}-A1-M1.json`, Buffer.from(materialImpactSubjectJson(m.subject))), effect(model, `verification/harness/${m.review_id}.md`, Buffer.from(`# Verdict ${m.review_id}\n\n`
                    + table(['field', 'value'], [['target', raw.target], ['lens', 'material-impact'], ['stage', 'S4'],
                        ['shown', pathFor(id, 'material-review-view')], ['withheld', 'Producer rationale, human response, action and downstream decisions'],
                        ['verdict', raw.verdict], ['consequence', raw.consequence]]))));
            }
        }
        else if (op === 'capture') {
            assertWork(value?.call_id === p.call_id && value.role === 'ambiguity-producer', 'WORK_AMBIGUITY_BINDING', 'exact producer');
            const raw = value.value, e = p.expression, d = raw.definition, a = raw.assessment;
            const definition = { source_entity_kind: e.source_entity_kind, source_entity_id: e.source_entity_id, source_id: e.source_id,
                expression_locator: e.locator, expression_start_byte: e.start_byte, expression_end_byte: e.end_byte,
                expression_sha256: e.expression_sha256, expression_bytes_base64: e.expression_bytes_base64, basis_packet_ids: e.basis_packet_ids,
                detected_by: `invocation:${value.call_id}` };
            assertWork(isDeepStrictEqual(d, definition) && a.search_source_id === e.source_id && a.proposed_by === `invocation:${value.call_id}`, 'WORK_AMBIGUITY_BINDING', 'producer cannot change selected expression or source');
            const candidates = parseCandidateRefs(JSON.stringify(a.candidate_refs), model);
            assertWork(candidates.clean, 'WORK_AMBIGUITY_SOURCE', candidates.error || 'invalid candidate references');
            for (const candidate of candidates.candidates) {
                if (candidate.kind === 'source-locus') {
                    assertWork(candidate.source_id === e.source_id, 'WORK_AMBIGUITY_SOURCE', 'candidate crosses the bound frozen source');
                    assertWork(workDigest(span(model, candidate.source_id, candidate.locator).bytes) === candidate.span_hash, 'WORK_AMBIGUITY_SOURCE', 'candidate does not reopen exact source bytes');
                }
            }
            if (a.search_scope_kind === 'full-same-source') {
                const completion = model.sourceWalk.completions.filter((row) => row.values.sourceId === e.source_id
                    && row.values.completionState === 'complete');
                assertWork(completion.length === 1 && a.search_completion_ref
                    === `${e.source_id}@${completion[0].values.finalCursorId}@${completion[0].values.sourceHash}`, 'WORK_AMBIGUITY_SOURCE', 'exact same-source completion reference required');
            }
            const { detected_by: _detected, ...expression } = definition;
            const subject = { ...expression, search_scope_kind: a.search_scope_kind,
                search_completion_ref: a.search_completion_ref, search_basis_digest: a.search_basis_digest,
                candidate_state: a.candidate_state, candidate_refs: a.candidate_refs, affected_relation_ids: a.affected_relation_ids,
                resolution_state: a.resolution_state, carry_state: a.carry_state, proposed_by: a.proposed_by };
            assertWork(ambiguityReviewSubjectDigest(subject) === a.review_subject_digest, 'WORK_AMBIGUITY_BINDING', 'exact review digest');
            const c = { accepted: value, subject, review_id: allocate(model, 'VER'),
                review_call_id: call(id, 'review', a.review_subject_digest) };
            effects.push(effect(model, pathFor(id, 'capture'), b(c)), effect(model, pathFor(id, 'review-view'), b({
                format: 'aleph-core-ambiguity-review-view/v1', subject: ambiguitySubject(subject), source_basis: sourceView(model, e)
            })));
        }
        else {
            const c = capture(model, p);
            if (op === 'review') {
                assertWork(value?.call_id === c.review_call_id && value.role === 'ambiguity-reviewer'
                    && value.producer_context_id === c.accepted.context_id && value.context_id !== c.accepted.context_id, 'WORK_AMBIGUITY_REVIEW', 'exact fresh ambiguity reviewer');
                const raw = value.value;
                assertWork(raw.target === `internal-ambiguity-review-subject:${ambiguityReviewSubjectDigest(c.subject)}`, 'WORK_AMBIGUITY_REVIEW', 'exact review target');
                effects.push(effect(model, pathFor(id, 'review'), b(value)), effect(model, `verification/harness/${c.review_id}.md`, Buffer.from(`# Verdict ${c.review_id}\n\n` + table(['field', 'value'], [['target', raw.target], ['lens', 'internal-ambiguity'],
                    ['stage', 'S4'], ['shown', pathFor(id, 'review-view')], ['withheld', 'producer rationale, human observations and downstream decisions'],
                    ['verdict', raw.verdict], ['consequence', raw.consequence]]))));
            }
            else {
                assertWork(op === 'admit' && value === null, 'WORK_AMBIGUITY_OPERATION', op);
                const reviewed = retainedValue(model, id, 'review');
                assertWork(reviewed.value.verdict === 'upheld', 'WORK_AMBIGUITY_REVIEW', 'only upheld canonicalizes');
                const s = c.subject, raw = c.accepted.value;
                const first = [id, s.source_entity_kind, s.source_entity_id, s.source_id, s.expression_locator,
                    String(s.expression_start_byte), String(s.expression_end_byte), s.expression_sha256, s.expression_bytes_base64,
                    s.basis_packet_ids.join(', '), raw.definition.detected_by];
                const second = [id, '1', 'none', s.search_scope_kind, s.source_id, s.search_completion_ref, s.search_basis_digest,
                    s.candidate_state, semanticJson(s.candidate_refs), s.affected_relation_ids.join(', ') || 'none', s.resolution_state, s.carry_state,
                    s.proposed_by, ambiguityReviewSubjectDigest(s), c.review_id];
                const ledger = appendRows(appendRows(required(model, LEDGER), 'ambiguity_id', [first]), 'ambiguity_id', [second]);
                effects.push(effect(model, LEDGER, ledger));
            }
        }
    }
    return { family: value ? 's4-capture' : 's4-preparation', effects,
        origins: effects.map((e) => ({ artifact: e.path, field: '*', from: value ? { kind: 'accepted', call_id: value.call_id, selector: op }
                : { kind: 'rule', rule: work.obligation.operation } })) };
}
function ambiguitySubject(s) { return json(Buffer.from(ambiguityReviewSubjectJson(s))); }

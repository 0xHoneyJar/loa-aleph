import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { hasRunCapability } from './run-model.js';
import { parseStrictJson } from './worker-return-contract.js';
import { semanticJson } from './semantic-review.js';
import { buildProceduralAuthorityRequest, validateProceduralAuthorityRequest, validateProceduralAuthorityResponse, proceduralAuthoritySubjectJson, buildProceduralAuthorityLedgerRow, nextProceduralAuthoritySequence, parseInternalAmbiguities, planProceduralAuthorityFollowup, closurePhases, } from './internal-ambiguity.js';
import { reviewedAmbiguityAuthorityBasis } from './work-transitions-ambiguities.js';
import { assertWork, obligation, effect, required, workDigest, appendRows } from './work-transitions.js';
const json = (bytes) => parseStrictJson(bytes, true);
const b = (value) => Buffer.from(semanticJson(value));
function state(model) { return json(readFileSync(join(model.runDir, 'control/run-state.json'))); }
export function authorityContactPath(id) {
    assertWork(/^AMB-\d{4,}$/u.test(id), 'WORK_AUTHORITY_CONTACT', 'exact ambiguity identity');
    return `control/work-proposals/S4-${id}-authority-contact.json`;
}
export function validateAuthorityContact(bytes) {
    const value = json(bytes);
    assertWork(value && Object.keys(value).sort().join(',') === 'format,identity'
        && value.format === 'aleph-ambiguity-authority-contact/v1' && typeof value.identity === 'string'
        && value.identity.length > 0 && value.identity.trim() === value.identity, 'WORK_AUTHORITY_CONTACT', 'exact human contact metadata only');
    return value;
}
function local(op, id, basis, dependencies) {
    return { kind: 'local', accepted_dependencies: dependencies,
        obligation: obligation('S4', `S4.ambiguity.${op}`, `s4.ambiguity.${op}`, id, b(basis)) };
}
function requests(model, id) {
    const root = join(model.runDir, 'control/gates'), prefix = `GATE-S4-${id}-A1-Q`;
    const paths = existsSync(root) ? readdirSync(root).filter((n) => n.startsWith(prefix) && n.endsWith('-request.json')) : [];
    return paths.map((path) => {
        const bytes = readFileSync(join(root, path)), request = json(bytes);
        assertWork(validateProceduralAuthorityRequest(request).equals(bytes) && `${request.request_id}-request.json` === path, 'WORK_AUTHORITY_BINDING', 'canonical retained request identity');
        return { request, bytes };
    }).sort((a, z) => Number(a.request.request_id.split('-Q')[1]) - Number(z.request.request_id.split('-Q')[1]));
}
function retained(model, id) {
    const basis = reviewedAmbiguityAuthorityBasis(model, id), history = requests(model, id);
    assertWork(history.every((h, i) => h.request.request_id === `GATE-S4-${id}-A1-Q${i + 1}`), 'WORK_AUTHORITY_BINDING', 'contiguous retained Q history');
    for (const h of history)
        assertWork(proceduralAuthoritySubjectJson(h.request.authority_subject)
            === proceduralAuthoritySubjectJson(basis.subject), 'WORK_AUTHORITY_BINDING', 'reviewed material/assessment basis changed');
    const latest = history.at(-1);
    if (!latest)
        return { basis, history, latest: null, response: null, responseBytes: null };
    const responsePath = join(model.runDir, 'control/gates', `${latest.request.request_id}-response.json`);
    const responseBytes = existsSync(responsePath) ? readFileSync(responsePath) : null;
    const response = responseBytes ? json(responseBytes) : null;
    if (response && responseBytes)
        assertWork(validateProceduralAuthorityResponse(latest.request, latest.bytes, response).equals(responseBytes), 'WORK_AUTHORITY_BINDING', 'exact retained human response');
    return { basis, history, latest, response, responseBytes };
}
export function selectProceduralWork(model, id) {
    assertWork(hasRunCapability(model.manifest?.runFormatVersion || '', 'orchestrator-work-transitions')
        && closurePhases(model.runLog).join(',') === 'S4-C1-relations-closed', 'WORK_AUTHORITY_WINDOW', 'bounded new-format C2 only');
    const r = retained(model, id), current = state(model);
    assertWork(current.execution.stage === 'S4', 'WORK_AUTHORITY_WINDOW', 'current S4 stage');
    if (!r.latest) {
        const path = authorityContactPath(id);
        if (!existsSync(join(model.runDir, path)))
            return { kind: 'proposal', operation: 'ambiguity.authority-contact', input_path: path };
        const contactBytes = readFileSync(join(model.runDir, path)), contact = validateAuthorityContact(contactBytes);
        assertWork(current.execution.gate?.status !== 'awaiting-authority' && current.execution.halt === null, 'WORK_AUTHORITY_WINDOW', 'an existing gate or halt has precedence');
        return local('open-authority', id, { subject: r.basis.subject, contact, contact_digest: workDigest(contactBytes) }, r.basis.dependencies);
    }
    const gate = current.execution.gate, request = r.latest.request;
    if (!r.response || !r.responseBytes)
        return { kind: 'halt', code: 'HUMAN_AUTHORITY_GATE', reason: `${request.request_id} requires its exact human response.` };
    const rows = parseInternalAmbiguities(model).t5_3Rows;
    const applied = rows.some((row) => row.values.authorityRef === `authority-response:${r.response.response_id}@${workDigest(r.responseBytes)}`);
    if (!applied) {
        assertWork(gate?.id === request.request_id && gate.status === 'approved'
            && gate.response_ref === `control/gates/${request.request_id}-response.json`
            && current.execution.halt?.code === 'S4_C2_RESPONSE_APPLICATION_REQUIRED', 'WORK_AUTHORITY_WINDOW', 'approved active response application only');
        return local('apply-authority', id, { request_digest: workDigest(r.latest.bytes), response_digest: workDigest(r.responseBytes), subject: r.basis.subject }, r.basis.dependencies);
    }
    const consequence = request.authority_subject.action_consequences.find((c) => c.action === r.response.selected_action);
    if (consequence.c2_effect === 'eligible-if-all-other-dod-pass')
        return null;
    if (consequence.current_run_effect === 'halted-successor-required')
        return {
            kind: 'halt', code: 'SUCCESSOR_CORPUS_RUN_REQUIRED', reason: 'The retained human action requires a successor corpus run; no current-run continuation.'
        };
    assertWork(gate?.id === request.request_id && gate.status === 'approved' &&
        ['BLOCKED_AT_S4_C2', 'S4_C2_FOLLOWUP_REQUEST_REQUIRED'].includes(current.execution.halt?.code || ''), 'WORK_AUTHORITY_WINDOW', 'exact applied nonterminal or suspensive response required');
    return local('followup-authority', id, { request_digest: workDigest(r.latest.bytes), response_digest: workDigest(r.responseBytes), subject: r.basis.subject }, r.basis.dependencies);
}
/** Called at resume entry. A newly produced halt is returned before the
 * controller can request another selection within the same resume call. */
export function selectBlockedProceduralWork(model) {
    const current = state(model), gate = current.execution.gate;
    if (current.execution.stage !== 'S4' || !gate || gate.type !== 'internal-ambiguity-procedural-decision'
        || !['S4_C2_RESPONSE_APPLICATION_REQUIRED', 'S4_C2_FOLLOWUP_REQUEST_REQUIRED', 'BLOCKED_AT_S4_C2'].includes(current.execution.halt?.code || ''))
        return null;
    const match = /^GATE-S4-(AMB-\d{4,})-A1-Q[1-9]\d*$/u.exec(gate.id);
    assertWork(match, 'WORK_AUTHORITY_BINDING', 'exact current request identity');
    return selectProceduralWork(model, match[1]);
}
export function deriveProceduralTransition(model, work, now) {
    const id = work.obligation.subject_id, op = work.obligation.operation, r = retained(model, id), current = state(model);
    const effects = [];
    let authority, coreState = 'DISTILLING', stageStatus = 'running';
    if (op.endsWith('apply-authority')) {
        assertWork(r.latest && r.response && r.responseBytes, 'WORK_AUTHORITY_BINDING', 'exact human response required');
        const row = buildProceduralAuthorityLedgerRow({ request: r.latest.request, request_bytes: r.latest.bytes,
            response: r.response, response_bytes: r.responseBytes,
            authority_seq: nextProceduralAuthoritySequence(parseInternalAmbiguities(model).t5_3Rows.map((r) => r.values), id) });
        const values = [row.ambiguityId, row.authoritySeq, row.assessmentSeq, row.action, row.selectedCandidateRef,
            row.authoritySubjectDigest, row.authorityRef, row.closureProvenance];
        effects.push(effect(model, 'ledgers/internal-ambiguities.md', appendRows(required(model, 'ledgers/internal-ambiguities.md'), 'ambiguity_id', [values])));
        const consequence = r.latest.request.authority_subject.action_consequences.find((c) => c.action === r.response.selected_action);
        const code = consequence.c2_effect === 'eligible-if-all-other-dod-pass' ? null
            : consequence.current_run_effect === 'halted-successor-required' ? 'SUCCESSOR_CORPUS_RUN_REQUIRED'
                : consequence.terminality === 'nonterminal-suspensive' ? 'BLOCKED_AT_S4_C2' : 'S4_C2_FOLLOWUP_REQUEST_REQUIRED';
        if (code === 'BLOCKED_AT_S4_C2' || code === 'SUCCESSOR_CORPUS_RUN_REQUIRED')
            coreState = 'BLOCKED';
        authority = { operation: 'apply', gate: current.execution.gate, halt: code ? {
                code, reason: `${r.response.selected_action} recorded exactly once; the existing Core consequence controls continuation.`, at: now, blocking: true
            } : null };
    }
    else {
        let request;
        if (op.endsWith('open-authority')) {
            const contactBytes = readFileSync(join(model.runDir, authorityContactPath(id))), contact = validateAuthorityContact(contactBytes);
            assertWork(!r.latest, 'WORK_AUTHORITY_BINDING', 'first Q only');
            request = buildProceduralAuthorityRequest({ request_seq: 1, subject: r.basis.subject, presentation: true,
                required_authority_identity: contact.identity, prepared_by: 'invocation:loa-orchestrator', requested_at: now });
            effects.push(effect(model, `verification/harness/ambiguity-work/${id}/authority-contact.json`, contactBytes));
        }
        else {
            assertWork(op.endsWith('followup-authority') && r.latest && r.response, 'WORK_AUTHORITY_BINDING', 'retained nonterminal basis');
            request = planProceduralAuthorityFollowup({ current_request: r.latest.request, current_request_bytes: r.latest.bytes,
                current_response: r.response, current_response_bytes: r.responseBytes,
                existing_request_ids: r.history.map((h) => h.request.request_id), retained_material_impact_seqs: [1],
                reason: current.execution.halt?.code === 'BLOCKED_AT_S4_C2' ? 'actual-resume-after-suspensive-block' : 'nonterminal-response',
                next_subject: r.basis.subject, presentation: true, required_authority_identity: r.latest.request.required_authority.identity,
                prepared_by: 'invocation:loa-orchestrator', requested_at: now });
        }
        const path = `control/gates/${request.request_id}-request.json`;
        assertWork(!existsSync(join(model.runDir, path)), 'WORK_AUTHORITY_BINDING', 'request identity already exists');
        effects.push(effect(model, path, validateProceduralAuthorityRequest(request)));
        authority = { operation: op.endsWith('open-authority') ? 'open' : 'followup', gate: { id: request.request_id,
                type: 'internal-ambiguity-procedural-decision', status: 'awaiting-authority', request_ref: path, response_ref: null },
            halt: { code: 'HUMAN_AUTHORITY_GATE', reason: `${request.request_id} requires a recorded human authority decision`, at: now, blocking: true } };
        stageStatus = 'awaiting-authority';
    }
    return { family: 'stage', effects, authority,
        next_execution: { stage: 'S4', stage_status: stageStatus, core_state: coreState, blocked: authority.halt !== null },
        origins: effects.map((e) => ({ artifact: e.path, field: '*', from: { kind: 'rule', rule: op } })) };
}

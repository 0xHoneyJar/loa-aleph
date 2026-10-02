import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { selectRelationWork, deriveRelationTransition, relationClosureEffects, validateRelationClosure } from './work-transitions-relations.js';
import { closurePhases } from './internal-ambiguity.js';
import { selectAmbiguityWork, deriveAmbiguityTransition, validateAmbiguityWorkState } from './work-transitions-ambiguities.js';
import { runK2Ambiguities } from './checks-k2-ambiguities.js';
import { ResultCollector } from './results.js';
import { parseStrictJson } from './worker-return-contract.js';
import { parseLineage, lineageCurrentClaimIds, LINEAGE_TABLE_HEADER } from './lineage.js';
import { semanticJson, semanticProducerSelections, semanticProducerView, semanticProducerViewPaths, semanticProducerTask, validateSemanticReturn, semanticAdmissionProblems, validateSemanticRun, planSemanticWrite, SEMANTIC_PATH } from './semantic-review.js';
import { readRepresentationContext, materialFindingRows, representationUsesMarkdown, REPRESENTATION_USE_PATH, planRepresentationUseWrite, validateRepresentationRun } from './source-representation.js';
import { DUPLICATE_PATH, DUPLICATE_TASKS, DUPLICATE_ASSIGNMENT_FORMAT, DUPLICATE_EFFECT_FORMAT, emptyDuplicateLedger, parseDuplicateLedger, duplicateLedgerMarkdown, duplicatePath, duplicateProducerPaths, duplicateProducerView, duplicateProducerBinding, buildDuplicateDiscovery, buildDuplicateSubject, duplicateAttachmentPaths, duplicateQuorum, duplicateAdmissionProblems, planDuplicateWrite, duplicateAdmissionSubplans, validateDuplicateRun, } from './duplicate-review.js';
import { assertWork, workDigest, workJson, file, required, obligation, effect, table, nextId, appendRows, selectSemanticWork, selectMaterialReview, semanticDependencies, semanticLedger, semanticTransition, materialReviewResult, } from './work-transitions.js';
const PREPARATIONS = 'verification/harness/work-preparations/S4/';
const CAPTURES = 'verification/harness/work-captures/S4/';
const SUCCESSORS = 'verification/harness/work-preparations/S4-successors/';
const SEMANTIC_CAPTURES = 'verification/harness/work-captures/S4-successors/';
export function s4SemanticCaptures(model) {
    return model.files.filter((entry) => entry.relativePath.startsWith(SEMANTIC_CAPTURES)).map((entry) => {
        const retained = json(Buffer.from(entry.text));
        assertWork(retained.format === 'aleph-s4-semantic-capture/v1'
            && entry.relativePath === `${SEMANTIC_CAPTURES}${retained.call_id}.json`
            && workDigest(readFileSync(join(model.runDir, `control/worker-returns/${retained.call_id}/raw.json`))) === retained.raw_digest, 'WORK_CAPTURE', 'S4 successor return binding');
        return retained;
    });
}
const json = (bytes) => parseStrictJson(bytes, true);
const ledger = (model) => parseDuplicateLedger(required(model, DUPLICATE_PATH).toString());
const currentIds = (model) => model.claims.map((row) => row.values.claimId).filter((id) => lineageCurrentClaimIds(model).has(id));
function allocate(model, prefix) {
    return nextId(prefix, model.files.flatMap((entry) => [...entry.text.matchAll(new RegExp(`\\b${prefix}-[0-9]+\\b`, 'gu'))].map((m) => m[0])));
}
function prep(model, task, selection, discoveryBasis) {
    const view = duplicateProducerView(model, task, selection);
    return { format: 'aleph-s4-work-preparation/v1', task,
        call_id: `CALL-F03-${workDigest(workJson({ run_id: model.manifest.runId, stage: 'S4', task,
            selection, view_digest: workDigest(view.bytes), lineage_digest: workDigest(Buffer.from(semanticJson(parseLineage(model).rows.map((r) => r.cells)))),
            ...(discoveryBasis ? { discovery_basis_digest: discoveryBasis } : {}) })).slice(7)}`,
        selection, view_digest: workDigest(view.bytes) };
}
function capture(model, callId) {
    const bytes = file(model, `${CAPTURES}${callId}.json`);
    if (!bytes)
        return null;
    const retained = json(bytes);
    assertWork(retained.format === 'aleph-s4-work-capture/v1' && retained.call_id === callId
        && workDigest(readFileSync(join(model.runDir, `control/worker-returns/${callId}/raw.json`))) === retained.raw_digest, 'WORK_CAPTURE', 'retained S4 return identity');
    return retained;
}
function producerWork(model, prepared, dependencies = [], basisDependencies = []) {
    if (capture(model, prepared.call_id))
        return null;
    const path = `${PREPARATIONS}${prepared.call_id}.json`, paths = duplicateProducerPaths(prepared.call_id);
    const view = duplicateProducerView(model, prepared.task, prepared.selection);
    const accepted_dependencies = [...new Set([...dependencies, ...basisDependencies])];
    if (!file(model, path))
        return { kind: 'local', accepted_dependencies,
            obligation: obligation('S4', 'S4.duplicate.prepare', 's4.prepare', prepared.call_id, workJson(prepared)) };
    assertWork(required(model, path).equals(workJson(prepared)) && required(model, paths.view).equals(view.bytes), 'WORK_PREPARATION', prepared.call_id);
    return { kind: 'worker', accepted_dependencies,
        obligation: obligation('S4', 'S4.duplicate.capture', 's4.capture', prepared.call_id, workJson(prepared)),
        call: { prepared_call_id: prepared.call_id, role: prepared.task === 'contradiction-discovery' ? 'verifier-l5' : 'merge-judge',
            kind: prepared.task === 'contradiction-discovery' ? 'refuter' : 'producer', task_line: DUPLICATE_TASKS[prepared.task],
            allowlist: [paths.view], producer_dependency: dependencies[0] || null,
            output_selector: prepared.task } };
}
function pendingPreparations(model) {
    return model.files.filter((entry) => entry.relativePath.startsWith(PREPARATIONS)).map((entry) => json(Buffer.from(entry.text)));
}
function subjectDependencies(model, subject) {
    const rows = ledger(model), row = rows.proposals.find((row) => row.proposal_id === subject.proposal_id);
    const tuple = json(readFileSync(join(model.runDir, row.producer_receipt_ref.split('@')[0])));
    return [tuple.call_id, ...rows.assignments.filter((row) => row.proposal_id === subject.proposal_id)
            .map((row) => json(required(model, row.assignment_path)).invocation_id)];
}
function local(model, operation, id, bytes, dependencies = []) {
    return { kind: 'local', accepted_dependencies: dependencies, obligation: obligation('S4', `S4.${operation}`, operation, id, bytes) };
}
function pendingL5Seeds(model) {
    const current = currentIds(model);
    const discoveries = ledger(model).discoveries.map((row) => json(required(model, row.record_path)));
    const seeds = [];
    for (const [index, discovery] of discoveries.entries())
        for (const sweep of discovery.sweep_refs) {
            const [path, digest] = sweep.result_ref.split('@');
            const match = /^control\/worker-returns\/(CALL-F03-[0-9a-f]{64})\/raw\.json$/u.exec(path);
            assertWork(match, 'WORK_CAPTURE', 'L5 seed requires an exact accepted return path');
            const bytes = readFileSync(join(model.runDir, path));
            assertWork(workDigest(bytes) === digest, 'WORK_CAPTURE', 'retained L5 seed bytes changed');
            const returned = json(bytes);
            for (const [ordinal, pair] of returned.flagged_pairs.entries()) {
                const member_ids = discovery.catalogue.filter((claim) => claim.claim_id === pair.a || claim.claim_id === pair.b).map((claim) => claim.claim_id);
                const reference = `${path}#/flagged_pairs/${ordinal}@${digest}`;
                if (discoveries.slice(index + 1).some((later) => later.candidates.some((candidate) => semanticJson(candidate.member_ids) === semanticJson(member_ids) && candidate.basis_refs.includes(reference))))
                    continue;
                assertWork(member_ids.length === 2 && member_ids.every((id) => current.includes(id)), 'WORK_CAPTURE', 'pending L5 seed requires its exact accepted return and current members');
                if (!seeds.some((seed) => seed.reference === reference))
                    seeds.push({ member_ids, reference, call_id: match[1] });
            }
        }
    return seeds;
}
function discoveryInputs(model, seeds = pendingL5Seeds(model)) {
    const selection = { member_ids: currentIds(model) };
    const basis = seeds.length ? workDigest(workJson(seeds)) : undefined;
    return { selection, seeds, seed_calls: [...new Set(seeds.map((seed) => seed.call_id))],
        discovery: prep(model, 'discovery', selection, basis), sweep: prep(model, 'contradiction-discovery', selection, basis) };
}
function selectDiscoveryWork(model, inputs) {
    if (inputs.selection.member_ids.length) {
        const discovery = producerWork(model, inputs.discovery, [], inputs.seed_calls);
        if (discovery)
            return discovery;
        const sweep = producerWork(model, inputs.sweep, [inputs.discovery.call_id], inputs.seed_calls);
        if (sweep)
            return sweep;
    }
    return local(model, 's4.record-discovery', 'current-claim-catalogue', workJson(inputs.seeds.length ? { selection: inputs.selection, seeds: inputs.seeds } : inputs.selection), inputs.selection.member_ids.length ? [...new Set([inputs.discovery.call_id, inputs.sweep.call_id, ...inputs.seed_calls])] : []);
}
function successorPreparation(model, subject) {
    const selection = semanticProducerSelections(model, 'normalizer', 'S4', {
        lineage_id: subject.reservation.lineage_id, origin_semantic_ids: subject.proposal.member_semantic_refs.map((m) => m.semantic_id)
    });
    const view = semanticProducerView(model, 'normalizer', 'S4', selection);
    const call_id = `CALL-F03-${workDigest(workJson({ run_id: model.manifest.runId, operation: 's4.normalize-successor',
        proposal_id: subject.proposal_id, subject_digest: workDigest(Buffer.from(semanticJson(subject))), view_digest: workDigest(view.bytes) })).slice(7)}`;
    return { call_id, selection, view };
}
function selectSuccessor(model, subject) {
    const p = successorPreparation(model, subject), path = `${SUCCESSORS}${p.call_id}.json`, paths = semanticProducerViewPaths(p.call_id);
    const dependencies = subjectDependencies(model, subject);
    if (!file(model, path))
        return local(model, 's4.prepare-successor', subject.proposal_id, Buffer.from(semanticJson(subject)), dependencies);
    assertWork(required(model, paths.view).equals(p.view.bytes) && required(model, paths.selections).equals(Buffer.from(semanticJson(p.selection))), 'WORK_SUBJECT_CHANGED', 'S4 successor preparation');
    const captured = s4SemanticCaptures(model).find((c) => c.call_id === p.call_id);
    if (!captured)
        return { kind: 'worker', accepted_dependencies: dependencies,
            obligation: obligation('S4', 'S4.successor.capture', 's4.capture-successor', subject.proposal_id, p.view.bytes),
            call: { prepared_call_id: p.call_id, role: 'normalizer', kind: 'producer', task_line: semanticProducerTask('normalizer', 'S4'),
                allowlist: [paths.view, ...p.view.assets.map((a) => a.path)].sort(), producer_dependency: null,
                output_selector: 'Role: Successor Semantic Normalizer (S4 pre-C1)' } };
    const pending = selectSemanticWork(model, captured, true);
    if (pending)
        return pending;
    const sem = semanticLedger(model), subjects = captured.selectors.map((selector) => sem.subjects.find((row) => row.producer_receipt_ref.startsWith(`${selector.binding_path}@`)));
    for (const row of subjects) {
        const s = json(required(model, row.subject_path));
        const reviews = sem.results.filter((r) => r.semantic_id === row.semantic_id).map((r) => json(required(model, r.result_path)));
        const negative = s.output_binding.kind !== 'claim' || reviews.some((r) => r.verdict !== 'upheld') || s.review_mode === 'unresolved-record';
        if (negative && !sem.resolutions.some((r) => r.semantic_id === s.semantic_id))
            return {
                kind: 'local', accepted_dependencies: semanticDependencies(model, s.semantic_id),
                obligation: obligation('S4', 'S4.successor.nonadmission', 'sem.resolve', s.semantic_id, required(model, row.subject_path))
            };
        if (!negative) {
            const problems = semanticAdmissionProblems(s);
            if (problems.length)
                return { kind: 'halt', code: 'WORK_SEMANTIC_PROPOSAL_INELIGIBLE', reason: `${s.semantic_id}: ${problems.join('; ')}` };
            const material = selectMaterialReview(model, s);
            if (material)
                return material;
        }
    }
    const admittedCandidate = subjects.find((row) => {
        const s = json(required(model, row.subject_path));
        return s.output_binding.kind === 'claim' && !sem.resolutions.some((r) => r.semantic_id === row.semantic_id);
    });
    const allCalls = [...new Set([...dependencies, ...subjects.flatMap((row) => {
                const s = json(required(model, row.subject_path)), material = materialReviewResult(model, s);
                return [...semanticDependencies(model, row.semantic_id), ...material ? [material.call_id] : []];
            })])];
    return local(model, admittedCandidate ? 's4.admit-successor' : 's4.failed-successor', subject.proposal_id, Buffer.from(semanticJson(subject)), allCalls);
}
export function selectS4Work(model) {
    const phases = closurePhases(model.runLog);
    if (phases.length) {
        if (phases.length === 1) {
            const ambiguity = selectAmbiguityWork(model);
            if (ambiguity)
                return ambiguity;
            return local(model, 's4.close-C2', 'C2', required(model, 'ledgers/internal-ambiguities.md'));
        }
        validateAmbiguityWorkState(model);
        return local(model, phases.length === 2 ? 's4.close-C3' : 's4.enter-S5', phases.length === 2 ? 'C3' : 'S5', required(model, 'run-log.md'));
    }
    if (!file(model, DUPLICATE_PATH))
        return local(model, 's4.initialize', 'S4', Buffer.from(duplicateLedgerMarkdown(emptyDuplicateLedger())));
    const rows = ledger(model);
    const seeds = pendingL5Seeds(model);
    if (seeds.length)
        return selectDiscoveryWork(model, discoveryInputs(model, seeds));
    for (const row of rows.proposals) {
        if (rows.effects.some((effect) => effect.proposal_id === row.proposal_id))
            continue;
        const bytes = required(model, row.subject_path), subject = json(bytes);
        const dependencies = subjectDependencies(model, subject);
        const rounds = rows.assignments.filter((a) => a.proposal_id === row.proposal_id).map((a) => {
            const result = rows.results.find((r) => r.review_id === a.review_id);
            return { assignment: json(required(model, a.assignment_path)),
                result: result ? json(required(model, result.result_path)) : undefined };
        });
        const quorum = duplicateQuorum(rounds);
        if (!quorum.complete) {
            const unreviewed = rounds.find((r) => !r.result);
            if (!unreviewed)
                return local(model, 's4.assign-review', row.proposal_id, bytes, dependencies);
            return { kind: 'worker', accepted_dependencies: dependencies.filter((id) => id !== unreviewed.assignment.invocation_id),
                obligation: obligation('S4', 'S4.L3', 's4.record-review', row.proposal_id, bytes),
                call: { prepared_call_id: unreviewed.assignment.invocation_id, role: 'verifier-l3', kind: 'refuter',
                    task_line: DUPLICATE_TASKS.refutation, allowlist: duplicateAttachmentPaths(subject),
                    producer_dependency: dependencies[0], output_selector: 'refutation' } };
        }
        if (!rows.decisions.some((d) => d.proposal_id === row.proposal_id))
            return local(model, 's4.decide', row.proposal_id, bytes, dependencies);
        if (duplicateAdmissionProblems(subject, quorum.verdict).length === 0)
            return selectSuccessor(model, subject);
        return local(model, 's4.record-effect', row.proposal_id, bytes, dependencies);
    }
    for (const row of rows.discoveries) {
        const discovery = json(required(model, row.record_path));
        for (const candidate of discovery.candidates) {
            const candidateRef = `${discovery.discovery_id}/${candidate.candidate_id}`;
            if (rows.proposals.some((p) => json(required(model, p.subject_path)).proposal.candidate_ref === candidateRef))
                continue;
            const prepared = prep(model, 'comparison', { candidate_ref: candidateRef });
            const pending = producerWork(model, prepared);
            if (pending)
                return pending;
            return local(model, 's4.reserve-subject', prepared.call_id, required(model, `${CAPTURES}${prepared.call_id}.json`), [prepared.call_id]);
        }
    }
    const last = rows.discoveries.at(-1), inputs = discoveryInputs(model, seeds);
    if (!last || semanticJson(json(required(model, last.record_path)).catalogue.map((c) => c.claim_id)) !== semanticJson(inputs.selection.member_ids)) {
        return selectDiscoveryWork(model, inputs);
    }
    const relation = selectRelationWork(model);
    if (relation)
        return relation;
    const closure = relationClosureEffects(model);
    return local(model, 's4.close-C1', 'C1', Buffer.from(semanticJson(closure)), closure.dependencies);
}
function selectedPreparation(model, work) {
    const existing = pendingPreparations(model).find((p) => p.call_id === work.obligation.subject_id);
    if (existing)
        return existing;
    const rows = ledger(model);
    for (const row of rows.discoveries)
        for (const c of json(required(model, row.record_path)).candidates) {
            const candidateRef = `${row.discovery_id}/${c.candidate_id}`;
            if (rows.proposals.some((p) => json(required(model, p.subject_path)).proposal.candidate_ref === candidateRef))
                continue;
            const p = prep(model, 'comparison', { candidate_ref: candidateRef });
            if (p.call_id === work.obligation.subject_id)
                return p;
        }
    const inputs = discoveryInputs(model);
    const found = [inputs.discovery, inputs.sweep].find((p) => p.call_id === work.obligation.subject_id);
    assertWork(found, 'WORK_PREPARATION', 'exact selected S4 producer');
    return found;
}
export function deriveS4Transition(model, work, accepted, now) {
    const operation = work.obligation.operation;
    if (operation.startsWith('s4.relation.'))
        return deriveRelationTransition(model, work, accepted);
    if (operation.startsWith('s4.ambiguity.'))
        return deriveAmbiguityTransition(model, work, accepted, now);
    if (['s4.close-C2', 's4.close-C3', 's4.enter-S5'].includes(operation)) {
        assertWork(accepted === null, 'WORK_S4_CLOSURE', 'closure consumes reviewed state only');
        validateAmbiguityWorkState(model);
        const s5 = operation === 's4.enter-S5', c2 = operation === 's4.close-C2';
        const phase = c2 ? 'S4-C2-ambiguities-finalized' : 'S4-C3-exit';
        return { family: 'stage', s4_closure: phase,
            ...(s5 ? { next_execution: { stage: 'S5', stage_status: 'entered', core_state: 'DISTILLING', blocked: false } }
                : !c2 ? { next_execution: { stage: 'S4', stage_status: 'closed', core_state: 'DISTILLING', blocked: false } } : {}),
            effects: [effect(model, 'run-log.md', Buffer.from(`${required(model, 'run-log.md')}\n## ${now} — ${s5 ? 'S5 — entry' : `S4 — ${c2 ? 'C2' : 'C3'}`}\n\n`
                    + (s5 ? 'S4 composite closure is durable; later orchestration is capability-bounded.\n' : `closure_phase: ${phase}\n`)))],
            origins: [{ artifact: 'run-log.md', field: '*', from: { kind: 'rule', rule: operation } }] };
    }
    if (operation === 's4.close-C1') {
        assertWork(accepted === null && closurePhases(model.runLog).length === 0, 'WORK_S4_CLOSURE', 'single deterministic C1 barrier');
        const semantic = validateSemanticRun(model), duplicate = validateDuplicateRun(model);
        assertWork(!semantic.pending.length && !duplicate.pending.length, 'WORK_S4_CLOSURE', 'semantic or duplicate work remains');
        validateRepresentationRun(model);
        const closure = relationClosureEffects(model);
        const uses = closure.effects.find((e) => e.path === REPRESENTATION_USE_PATH);
        const useBytes = uses ? Buffer.from(uses.after_base64, 'base64') : required(model, REPRESENTATION_USE_PATH);
        const log = Buffer.from(`${required(model, 'run-log.md')}\n## ${now} — S4 — C1\n\n`
            + 'closure_phase: S4-C1-relations-closed\n'
            + `representation_use_closure_hash: ${workDigest(useBytes)}\n`
            + `semantic_review_closure_hash: ${workDigest(required(model, SEMANTIC_PATH))}\n`
            + `duplicate_review_closure_hash: ${workDigest(required(model, DUPLICATE_PATH))}\n`);
        return { family: 'stage', s4_closure: 'S4-C1-relations-closed',
            effects: [...closure.effects, effect(model, 'run-log.md', log)],
            origins: [{ artifact: 'ledgers/relations.md', field: '*', from: { kind: 'rule', rule: 'S4-C1:exact-reviewed-proposals-and-composed-seals' } }] };
    }
    const origins = [{ artifact: DUPLICATE_PATH, field: '*', from: { kind: 'rule', rule: operation } }];
    if (operation === 's4.prepare-successor' || operation === 's4.capture-successor') {
        const row = ledger(model).proposals.find((row) => row.proposal_id === work.obligation.subject_id);
        const subject = json(required(model, row.subject_path)), p = successorPreparation(model, subject);
        const paths = semanticProducerViewPaths(p.call_id);
        if (operation === 's4.prepare-successor')
            return { family: 's4-preparation', origins, effects: [
                    effect(model, `${SUCCESSORS}${p.call_id}.json`, workJson({ call_id: p.call_id, proposal_id: subject.proposal_id, subject_digest: row.subject_digest })),
                    effect(model, paths.selections, Buffer.from(semanticJson(p.selection))), effect(model, paths.view, p.view.bytes)
                ] };
        assertWork(accepted?.call_id === p.call_id && accepted.role === 'normalizer', 'WORK_ACCEPTANCE', 'exact independent S4 normalizer');
        const checked = validateSemanticReturn('normalizer', model.manifest.runFormatVersion, accepted.value, p.view.context);
        assertWork(checked.result === 'PASS' && checked.binding === 'checked', 'WORK_RETURN', checked.errors.join('; '));
        const raw = accepted.value;
        const selectors = [
            ...raw.claims.map((_, i) => ({ output_kind: 'claim-candidate', output_index: String(i), reserved_claim_id: subject.reservation.successor_id,
                binding_path: `control/semantic-producer-bindings/${p.call_id}/claim-candidate-${i}.json` })),
            ...raw.material_findings.map((_, i) => ({ output_kind: 'material-candidate', output_index: String(i), reserved_claim_id: null,
                binding_path: `control/semantic-producer-bindings/${p.call_id}/material-candidate-${i}.json` })),
        ];
        const captured = { format: 'aleph-s4-semantic-capture/v1', proposal_id: subject.proposal_id,
            call_id: p.call_id, origin_semantic_id: subject.proposal.member_semantic_refs[0].semantic_id, raw_digest: accepted.raw_digest,
            context_id: accepted.context_id, producer_context_id: accepted.producer_context_id, receipt_digest: accepted.receipt_digest,
            simulation: accepted.simulation, selectors };
        const context = readRepresentationContext(model), used = context.uses.map((row) => row.use_id);
        const uses = materialFindingRows(model, accepted.value, 'S4', p.call_id).map((row) => {
            row.use_id = nextId('USE', used);
            used.push(row.use_id);
            planRepresentationUseWrite({ model, proposedModel: model, row, stage: 'S4', subjectWrites: [] });
            return row;
        });
        return { family: 's4-capture', origins, effects: [
                effect(model, `${SEMANTIC_CAPTURES}${p.call_id}.json`, workJson(captured)),
                ...selectors.map((selector) => effect(model, selector.binding_path, Buffer.from(semanticJson({
                    call_id: p.call_id, context_id: accepted.context_id, raw_return_hash: accepted.raw_digest,
                    output_kind: selector.output_kind, output_index: Number(selector.output_index)
                })))),
                ...uses.length ? [effect(model, REPRESENTATION_USE_PATH, Buffer.from(representationUsesMarkdown([...context.uses, ...uses])))] : []
            ] };
    }
    if (operation === 's4.prepare') {
        assertWork(accepted === null, 'WORK_ACCEPTANCE', 'S4 preparation is mechanical');
        const p = selectedPreparation(model, work), paths = duplicateProducerPaths(p.call_id), view = duplicateProducerView(model, p.task, p.selection);
        return { family: 's4-preparation', origins, effects: [effect(model, `${PREPARATIONS}${p.call_id}.json`, workJson(p)),
                effect(model, paths.selection, Buffer.from(semanticJson(p.selection))), effect(model, paths.view, view.bytes)] };
    }
    if (operation === 's4.capture') {
        assertWork(accepted && work.kind === 'worker' && accepted.call_id === work.call.prepared_call_id, 'WORK_ACCEPTANCE', 'exact S4 producer required');
        const p = selectedPreparation(model, work), bindings = p.task !== 'contradiction-discovery';
        const tuple = { call_id: accepted.call_id, context_id: accepted.context_id, raw_return_hash: accepted.raw_digest,
            output_kind: p.task === 'discovery' ? 'duplicate-discovery' : 'duplicate-proposal', output_index: 0 };
        const binding = bindings ? `control/worker-returns/${p.call_id}/duplicate-producer.json` : null;
        const reviewId = bindings ? null : allocate(model, 'VER');
        const captured = { format: 'aleph-s4-work-capture/v1', call_id: p.call_id, context_id: accepted.context_id,
            raw_digest: accepted.raw_digest, receipt_digest: accepted.receipt_digest, simulation: accepted.simulation, binding_path: binding, review_id: reviewId };
        const effects = [effect(model, `${CAPTURES}${p.call_id}.json`, workJson(captured))];
        if (binding)
            effects.push(effect(model, binding, Buffer.from(semanticJson(tuple))));
        if (reviewId)
            effects.push(effect(model, `verification/harness/S4/${reviewId}.md`, Buffer.from(`# Verdict ${reviewId}\n\n`
                + table(['field', 'value'], [['target', 'current-claim-catalogue'], ['lens', 'L5'], ['stage', 'S4'],
                    ['shown', `${duplicateProducerPaths(p.call_id).view}@${p.view_digest}`], ['withheld', 'Discovery conclusions, merge map and prior reviews.'],
                    ['verdict', String(accepted.value.verdict)], ['consequence', 'Retained independent contradiction sweep; no admission authority.']]))));
        return { family: 's4-capture', origins, effects };
    }
    const rows = file(model, DUPLICATE_PATH) ? ledger(model) : emptyDuplicateLedger();
    const calls = [...new Set([...(work.accepted_dependencies || []), ...(accepted ? [accepted.call_id] : [])])];
    const bounded = (operation, recordId, proposalId, digest, effects) => ({ family: 'duplicate', origins, effects,
        duplicate: { proposal_id: proposalId, subject_digest: digest, operation, record_id: recordId, accepted_call_ids: calls } });
    if (operation === 's4.initialize') {
        const bytes = Buffer.from(duplicateLedgerMarkdown(rows));
        return bounded('initialize', 'S4', 'none', workDigest(bytes), [effect(model, DUPLICATE_PATH, bytes)]);
    }
    if (operation === 's4.record-discovery') {
        const inputs = discoveryInputs(model), present = inputs.selection.member_ids.length > 0;
        const produced = present ? capture(model, inputs.discovery.call_id) : null, swept = present ? capture(model, inputs.sweep.call_id) : null;
        const raw = produced ? json(readFileSync(join(model.runDir, `control/worker-returns/${produced.call_id}/raw.json`))) : { candidates: [], unresolved_findings: [] };
        const coalesced = [];
        for (const candidate of raw.candidates) {
            const old = coalesced.find((c) => semanticJson(c.member_ids) === semanticJson(candidate.member_ids));
            if (old)
                old.basis_refs = [...new Set([...old.basis_refs, ...candidate.basis_refs])];
            else
                coalesced.push(structuredClone(candidate));
        }
        for (const seed of inputs.seeds) {
            const old = coalesced.find((candidate) => semanticJson(candidate.member_ids) === semanticJson(seed.member_ids));
            if (old)
                old.basis_refs = [...new Set([...old.basis_refs, seed.reference])];
            else
                coalesced.push({ member_ids: seed.member_ids, basis_refs: [seed.reference], signal: 'semantic-proposal' });
        }
        const d = buildDuplicateDiscovery(model, { discovery_id: allocate(model, 'DCD'),
            windows: produced ? [{ window_id: 'W1', member_ids: inputs.selection.member_ids, shown_digest: inputs.discovery.view_digest,
                    producer_binding_hash: duplicateProducerBinding(json(readFileSync(join(model.runDir, produced.binding_path)))),
                    execution_evidence_ref: `${produced.binding_path}@${workDigest(readFileSync(join(model.runDir, produced.binding_path)))}` }] : [],
            candidates: coalesced.map((c, i) => ({ candidate_id: `G${i + 1}`, ...c })),
            sweep_refs: swept ? [{ review_id: swept.review_id, verifier_ref: `verification/harness/S4/${swept.review_id}.md@${workDigest(required(model, `verification/harness/S4/${swept.review_id}.md`))}`,
                    result_ref: `control/worker-returns/${swept.call_id}/raw.json@${swept.raw_digest}`,
                    window_member_ids: inputs.selection.member_ids, shown_digest: inputs.sweep.view_digest }] : [],
            unresolved_findings: raw.unresolved_findings });
        const bytes = Buffer.from(semanticJson(d)), path = duplicatePath('discovery', d.discovery_id);
        rows.discoveries.push({ discovery_id: d.discovery_id, record_path: path, record_digest: workDigest(bytes) });
        return bounded('record-discovery', d.discovery_id, 'none', workDigest(bytes), [effect(model, DUPLICATE_PATH, Buffer.from(duplicateLedgerMarkdown(rows))), effect(model, path, bytes)]);
    }
    if (operation === 's4.reserve-subject') {
        const retained = capture(model, work.obligation.subject_id);
        const raw = json(readFileSync(join(model.runDir, `control/worker-returns/${retained.call_id}/raw.json`)));
        const state = json(readFileSync(join(model.runDir, 'control/run-state.json')));
        const reservation = raw.proposal.treatment === 'new-successor' ? { lineage_id: allocate(model, 'LIN'), successor_id: allocate(model, 'CC'),
            lineage_type: raw.proposal.successor_request.lineage_type, predecessor_ids: raw.proposal.member_ids } : null;
        const subject = buildDuplicateSubject(model, { proposal_id: allocate(model, 'DUP'), predecessor_proposal_id: null,
            producer_binding_hash: duplicateProducerBinding(json(readFileSync(join(model.runDir, retained.binding_path)))),
            proposal: raw.proposal, reservation, reviewer_profile: { profile_id: state.identity.profile.id,
                profile_digest: state.identity.profile.digest, role: 'verifier-l3', model_identity: state.identity.models['verifier-l3'] } });
        const bytes = Buffer.from(semanticJson(subject)), path = duplicatePath('subjects', subject.proposal_id);
        rows.proposals.push({ proposal_id: subject.proposal_id, subject_path: path, subject_digest: workDigest(bytes), predecessor_proposal_id: 'none',
            producer_receipt_ref: `${retained.binding_path}@${workDigest(readFileSync(join(model.runDir, retained.binding_path)))}` });
        const effects = [effect(model, DUPLICATE_PATH, Buffer.from(duplicateLedgerMarkdown(rows))), effect(model, path, bytes)];
        if (reservation)
            effects.push(effect(model, `verification/harness/semantic-process/${reservation.lineage_id}.json`, Buffer.from(semanticJson({
                lineage_id: reservation.lineage_id, owner_stage: 'S4', type: reservation.lineage_type,
                predecessors: reservation.predecessor_ids.join(', '), successors: reservation.successor_id,
                basis: `duplicate-review-subject:${workDigest(bytes)}`, established_by: `invocation:${retained.call_id}`,
            }))));
        return bounded('reserve-subject', subject.proposal_id, subject.proposal_id, workDigest(bytes), effects);
    }
    const row = rows.proposals.find((p) => p.proposal_id === work.obligation.subject_id);
    assertWork(row, 'WORK_SUBJECT', 'exact retained duplicate proposal');
    const subject = json(required(model, row.subject_path));
    const rounds = rows.assignments.filter((a) => a.proposal_id === row.proposal_id).map((a) => {
        const result = rows.results.find((r) => r.review_id === a.review_id);
        return { assignment: json(required(model, a.assignment_path)), result: result ? json(required(model, result.result_path)) : undefined };
    });
    if (operation === 's4.assign-review') {
        const id = allocate(model, 'VER'), assignment = {
            format: DUPLICATE_ASSIGNMENT_FORMAT, proposal_id: row.proposal_id, subject_digest: row.subject_digest, review_id: id,
            role: 'verifier-l3', profile_digest: subject.reviewer_profile.profile_digest,
            invocation_id: `CALL-F03-${workDigest(workJson({ proposal_id: row.proposal_id, subject_digest: row.subject_digest, review_id: id })).slice(7)}`,
            producer_binding_hash: subject.producer_binding_hash, round: rounds.length ? 2 : 1,
            execution_kind: json(readFileSync(join(model.runDir, 'control/run-state.json'))).full_mode === 'fixture-simulated' ? 'fixture-simulated' : 'native-dispatch'
        };
        const bytes = Buffer.from(semanticJson(assignment)), path = duplicatePath('assignments', id);
        rows.assignments.push({ review_id: id, proposal_id: row.proposal_id, assignment_path: path, assignment_digest: workDigest(bytes) });
        return bounded('assign-review', id, row.proposal_id, row.subject_digest, [effect(model, DUPLICATE_PATH, Buffer.from(duplicateLedgerMarkdown(rows))), effect(model, path, bytes)]);
    }
    if (operation === 's4.record-review') {
        const round = rounds.find((r) => !r.result);
        assertWork(accepted?.call_id === round.assignment.invocation_id && accepted.role === 'verifier-l3', 'WORK_ACCEPTANCE', 'exact fresh L3');
        const id = round.assignment.review_id, bytes = Buffer.from(semanticJson(accepted.value)), path = duplicatePath('results', id);
        const native = `control/worker-returns/${accepted.call_id}/native-dispatch.json`;
        rows.results.push({ review_id: id, proposal_id: row.proposal_id, result_path: path, result_digest: workDigest(bytes),
            execution_kind: round.assignment.execution_kind, execution_evidence_ref: `${native}@${workDigest(readFileSync(join(model.runDir, native)))}` });
        return bounded('record-review', id, row.proposal_id, row.subject_digest, [
            effect(model, DUPLICATE_PATH, Buffer.from(duplicateLedgerMarkdown(rows))), effect(model, path, bytes),
            effect(model, `verification/harness/S4/${id}.md`, Buffer.from(`# Verdict ${id}\n\n` + table(['field', 'value'], [
                ['target', `duplicate-review-subject:${row.subject_digest}`], ['lens', 'L3'], ['stage', 'S4'], ['shown', row.subject_path],
                ['withheld', 'Producer rationale and prior reviews.'], ['verdict', accepted.value.verdict],
                ['consequence', 'Reviewed comparison only; successor admission requires its separate predicates.']
            ]))),
        ]);
    }
    const quorum = duplicateQuorum(rounds);
    if (operation === 's4.decide') {
        const id = allocate(model, 'DDR');
        rows.decisions.push({ decision_id: id, proposal_id: row.proposal_id, review_ids: semanticJson(quorum.review_ids),
            verdict: quorum.verdict, reviewed_outcome: quorum.verdict === 'upheld' ? subject.proposal.outcome : 'none' });
        return bounded('decide', id, row.proposal_id, row.subject_digest, [effect(model, DUPLICATE_PATH, Buffer.from(duplicateLedgerMarkdown(rows)))]);
    }
    if (operation === 's4.admit-successor' || operation === 's4.failed-successor') {
        const captured = s4SemanticCaptures(model).find((c) => c.proposal_id === subject.proposal_id);
        const sem = semanticLedger(model), attempts = captured.selectors.map((selector) => sem.subjects.find((row) => row.producer_receipt_ref.startsWith(`${selector.binding_path}@`)));
        const id = allocate(model, 'DUE'), decision = rows.decisions.find((d) => d.proposal_id === row.proposal_id);
        const admitting = operation === 's4.admit-successor', reservation = subject.reservation;
        let effects = [];
        const claim = attempts.find((row) => row.subject_kind === 'claim' && !sem.resolutions.some((r) => r.semantic_id === row.semantic_id));
        const basis = `duplicate-review-subject:${row.subject_digest}`;
        const mergeRow = [reservation.successor_id, subject.proposal.member_ids.join(', '), basis,
            subject.proposal.provenance_union.source_ids.join(', '), subject.proposal.origin_assessment.corroboration, 'active'];
        if (admitting) {
            assertWork(claim, 'WORK_ADMISSION', 'reviewed successor subject required');
            const resolved = semanticTransition(model, { kind: 'local', obligation: obligation('S4', 'S4.successor.admit', 'sem.resolve', claim.semantic_id, required(model, claim.subject_path)) }, null);
            assertWork(resolved.semantic?.operation === 'admit', 'WORK_ADMISSION', 'fresh semantic admission predicates');
            effects = resolved.effects;
            const lineage = json(required(model, `verification/harness/semantic-process/${reservation.lineage_id}.json`));
            effects.push(effect(model, 'ledgers/lineage.md', appendRows(required(model, 'ledgers/lineage.md'), LINEAGE_TABLE_HEADER[0], [Object.values(lineage)])));
            const header = ['canonical', 'absorbs', 'basis', 'provenance retained', 'corroboration', 'status'];
            const before = file(model, 'ledgers/merge-map.md') || Buffer.from('# Duplicate / Merge Map\n\n' + table(header, []));
            effects.push(effect(model, 'ledgers/merge-map.md', appendRows(before, 'canonical', [mergeRow])));
        }
        const retained = { format: DUPLICATE_EFFECT_FORMAT, effect_id: id, proposal_id: row.proposal_id,
            subject_digest: row.subject_digest, decision_id: decision.decision_id, effect: admitting ? 'canonicalized' : 'not-admitted',
            reason: admitting ? 'reviewed-duplicate' : 'successor-not-preserved', semantic_ids: attempts.map((row) => row.semantic_id),
            lineage_id: admitting ? reservation.lineage_id : null, successor_id: admitting ? reservation.successor_id : null,
            merge_row_digest: admitting ? workDigest(Buffer.from(semanticJson(mergeRow))) : null,
            provenance_union_digest: workDigest(Buffer.from(semanticJson(subject.proposal.provenance_union))), predecessor_proposal_id: subject.predecessor_proposal_id };
        const bytes = Buffer.from(semanticJson(retained)), path = duplicatePath('effects', id);
        rows.effects.push({ effect_id: id, proposal_id: row.proposal_id, decision_id: decision.decision_id, effect: retained.effect,
            semantic_id: admitting ? claim.semantic_id : 'none', lineage_id: retained.lineage_id || 'none',
            successor_id: retained.successor_id || 'none', record_ref: `${path}@${workDigest(bytes)}` });
        effects.push(effect(model, DUPLICATE_PATH, Buffer.from(duplicateLedgerMarkdown(rows))), effect(model, path, bytes));
        return bounded(admitting ? 'admit' : 'record-effect', id, row.proposal_id, row.subject_digest, effects);
    }
    assertWork(operation === 's4.record-effect', 'WORK_OPERATION', operation);
    const decision = rows.decisions.find((d) => d.proposal_id === row.proposal_id), id = allocate(model, 'DUE');
    const refuted = quorum.verdict === 'refuted', unresolved = quorum.verdict === 'cannot-determine' || subject.proposal.outcome === 'CANNOT_DETERMINE';
    const separate = !refuted && (subject.proposal.treatment === 'keep-separate' || subject.proposal.origin_assessment.corroboration === 'CANNOT_DETERMINE');
    const retained = { format: DUPLICATE_EFFECT_FORMAT, effect_id: id, proposal_id: row.proposal_id,
        subject_digest: row.subject_digest, decision_id: decision.decision_id, effect: separate ? 'kept-separate' : 'not-admitted',
        reason: refuted ? 'refuted-proposal' : unresolved ? 'unresolved-equivalence'
            : subject.proposal.origin_assessment.corroboration === 'CANNOT_DETERMINE' ? 'unresolved-origin' : 'reviewed-nonduplicate',
        semantic_ids: [], lineage_id: null, successor_id: null, merge_row_digest: null,
        provenance_union_digest: workDigest(Buffer.from(semanticJson(subject.proposal.provenance_union))), predecessor_proposal_id: subject.predecessor_proposal_id };
    const bytes = Buffer.from(semanticJson(retained)), path = duplicatePath('effects', id);
    rows.effects.push({ effect_id: id, proposal_id: row.proposal_id, decision_id: decision.decision_id, effect: retained.effect,
        semantic_id: 'none', lineage_id: 'none', successor_id: 'none', record_ref: `${path}@${workDigest(bytes)}` });
    return bounded('record-effect', id, row.proposal_id, row.subject_digest, [effect(model, DUPLICATE_PATH, Buffer.from(duplicateLedgerMarkdown(rows))), effect(model, path, bytes)]);
}
export function validateS4Transition(model, proposedModel, transition) {
    if (transition.obligation.operation.startsWith('s4.ambiguity.')
        || transition.s4_closure && transition.s4_closure !== 'S4-C1-relations-closed') {
        validateAmbiguityWorkState(proposedModel);
        for (const path of ['ledgers/relations.md', 'ledgers/representation-uses.md', SEMANTIC_PATH, DUPLICATE_PATH]) {
            assertWork(required(model, path).equals(required(proposedModel, path)), 'WORK_S4_CLOSURE', `C2/C3 cannot rewrite ${path}`);
        }
        return;
    }
    if (transition.s4_closure === 'S4-C1-relations-closed') {
        validateRelationClosure(proposedModel);
        const phaseChecks = new ResultCollector('S4 C1 retained phase consistency');
        runK2Ambiguities(phaseChecks, proposedModel);
        const phaseFailures = phaseChecks.checks.filter((c) => c.status === 'FAIL');
        assertWork(phaseFailures.length === 0, 'WORK_S4_CLOSURE', phaseFailures.map((c) => c.message).join('; '));
        validateRepresentationRun(proposedModel);
        const writes = transition.effects.filter((w) => w.path === 'run-log.md').map((w) => ({
            path: w.path, before_hash: w.before_digest, after_base64: w.after_base64, after_hash: w.after_digest
        }));
        planSemanticWrite({ model, proposedModel, stage: 'S4', semantic_id: 'none',
            subject_digest: workDigest(required(model, SEMANTIC_PATH)), operation: 'seal', record_id: 'C1', prerequisite_paths: [], writes });
        planDuplicateWrite({ model, proposedModel, proposal_id: 'none', subject_digest: workDigest(required(model, DUPLICATE_PATH)),
            operation: 'seal', record_id: 'C1', prerequisite_paths: [], acceptance_bindings: [], writes });
        return;
    }
    const meta = transition.duplicate;
    const bindings = meta.accepted_call_ids.map((call_id) => {
        const root = join(proposedModel.runDir, `control/worker-returns/${call_id}`);
        const dispatch = json(readFileSync(join(root, 'native-dispatch.json')));
        const request = json(readFileSync(join(proposedModel.runDir, `control/worker-bundles/${call_id}/request.json`)));
        return { call_id, context_id: dispatch.receipt.context_id, raw_return_hash: workDigest(readFileSync(join(root, 'raw.json'))), role: request.role };
    });
    const plan = planDuplicateWrite({ model, proposedModel, proposal_id: meta.proposal_id, subject_digest: meta.subject_digest,
        operation: meta.operation, record_id: meta.record_id, prerequisite_paths: [], acceptance_bindings: bindings,
        writes: transition.effects.map((w) => ({ path: w.path, before_hash: w.before_digest || workDigest(Buffer.alloc(0)),
            after_base64: w.after_base64, after_hash: w.after_digest })) });
    duplicateAdmissionSubplans(model, proposedModel, plan);
}

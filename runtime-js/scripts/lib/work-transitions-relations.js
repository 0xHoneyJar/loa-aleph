import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { hasRunCapability } from './run-model.js';
import { parseTables, parseBulletFields } from './markdown.js';
import { parseStrictJson } from './worker-return-contract.js';
import { lineageCurrentClaimIds, lineageCurrentPacketIds, parseLineage } from './lineage.js';
import { semanticJson, semanticPacketBasis, semanticRelationRow } from './semantic-review.js';
import { RELATION_FORMAT, RELATION_TABLE_HEADER, relationReviewSubjectDigest, parseRelations } from './relations.js';
import { relationProposalProblems, runK2Relations } from './checks-k2-relations.js';
import { readRepresentationContext, validateMaterialUseInput, representationUseDigest, representationReviewView, representationUseNeedsReview, validateRepresentationUse, assertMaterialReviewUpheld, materialFindingRows, representationUsesMarkdown, REPRESENTATION_USE_PATH } from './source-representation.js';
import { ResultCollector } from './results.js';
import { assertWork, workDigest, file, required, obligation, effect, nextId, table, semanticLedger, semanticDependencies, MATERIAL_REVIEW_TASK } from './work-transitions.js';
export const RELATION_WORK_ROOT = 'verification/harness/relation-work/';
export const RELATION_PRODUCER_TASK = 'Propose complete typed relations from the exact current inventory and retained legal context.';
export const RELATION_REVIEW_TASK = 'Challenge this exact complete relation subject without changing any proposed field.';
const PRODUCER_VIEW = `${RELATION_WORK_ROOT}producer-view.json`;
const PREPARATION = `${RELATION_WORK_ROOT}preparation.json`;
const CAPTURE = `${RELATION_WORK_ROOT}capture.json`;
const bytes = (value) => Buffer.from(semanticJson(value));
const json = (value) => parseStrictJson(value, true);
const pathFor = (key, part) => `${RELATION_WORK_ROOT}${key}/${part}.json`;
function allocate(model, prefix) {
    return nextId(prefix, model.files.flatMap((f) => [...f.text.matchAll(new RegExp(`\\b${prefix}-\\d+\\b`, 'gu'))].map((m) => m[0])));
}
function local(operation, id, value, dependencies) {
    return { kind: 'local', accepted_dependencies: dependencies,
        obligation: obligation('S4', `S4.relation.${operation}`, `s4.relation.${operation}`, id, bytes(value)) };
}
function accepted(model, path, callId) {
    const retained = file(model, path);
    if (!retained)
        return null;
    const value = json(retained);
    assertWork(!callId || value.call_id === callId, 'WORK_RELATION_BINDING', 'accepted invocation changed');
    const raw = readFileSync(join(model.runDir, `control/worker-returns/${value.call_id}/raw.json`));
    assertWork(workDigest(raw) === value.raw_digest && isDeepStrictEqual(value.value, json(raw)), 'WORK_RELATION_BINDING', 'accepted relation return changed');
    return value;
}
function proposal(input) {
    return { key: workDigest(bytes(input)).slice(7), ...input };
}
/** Original semantic ownership and the complete original proposal are retained. */
function localProposals(model) {
    return semanticLedger(model).subjects.flatMap((row) => {
        const subjectBytes = required(model, row.subject_path), subject = json(subjectBytes);
        assertWork(workDigest(subjectBytes) === row.subject_digest, 'WORK_RELATION_BINDING', row.semantic_id);
        if (!subject.semantics.relation_proposals.length)
            return [];
        const bindingPath = row.producer_receipt_ref.split('@')[0], bindingBytes = readFileSync(join(model.runDir, bindingPath));
        assertWork(row.producer_receipt_ref === `${bindingPath}@${workDigest(bindingBytes)}`, 'WORK_RELATION_BINDING', 'producer binding changed');
        const binding = json(bindingBytes);
        assertWork(workDigest(readFileSync(join(model.runDir, `control/worker-returns/${binding.call_id}/raw.json`))) === binding.raw_return_hash, 'WORK_RELATION_BINDING', 'semantic producer return changed');
        return subject.semantics.relation_proposals.map((projection, index) => proposal({
            producer_call_id: binding.call_id, producer_context_id: binding.context_id, raw_digest: binding.raw_return_hash,
            selector: `${row.semantic_id}/semantics/relation_proposals/${index}`,
            semantic_id: row.semantic_id, semantic_subject_digest: row.subject_digest,
            projection, dependencies: semanticDependencies(model, row.semantic_id),
        }));
    });
}
function producerView(model) {
    const packetIds = lineageCurrentPacketIds(model), claimIds = lineageCurrentClaimIds(model);
    const packets = model.packets.filter((p) => packetIds.has(p.values.packetId));
    const claims = model.claims.filter((c) => claimIds.has(c.values.claimId));
    const subjects = semanticLedger(model).subjects.map((row) => json(required(model, row.subject_path)));
    const exactLoci = subjects.flatMap((s) => [...s.anchors, ...s.relation_context.flatMap((c) => c.target_anchors)])
        .map((a) => ({ source_id: a.source_id, locator: a.locator, start_byte: a.start_byte, end_byte: a.end_byte,
        exact_bytes_base64: a.exact_bytes_base64 }));
    return { format: 'aleph-core-global-relation-view/v1', run_id: model.manifest.runId,
        source_manifest: model.corpus.sources.map((s) => s.values),
        packets: semanticPacketBasis(model, packets.map((p) => p.values.packetId)),
        claims: claims.map((c) => ({ claim_id: c.values.claimId, normalized_claim: c.values.normalizedClaim,
            packets: c.values.packets, sources: c.values.sources, claim_type: c.values.claimType })),
        lineage: parseLineage(model).rows.map((r) => r.values),
        exact_loci: exactLoci.filter((a, i) => exactLoci.findIndex((b) => semanticJson(a) === semanticJson(b)) === i),
        retained_proposals: localProposals(model).map((p) => ({ selector: p.selector, projection: p.projection })), };
}
function preparation(model) {
    const view = bytes(producerView(model));
    return { format: 'aleph-core-global-relation-preparation/v1', view_digest: workDigest(view),
        call_id: `CALL-F03-${workDigest(bytes({ run_id: model.manifest.runId, operation: 's4.relation.capture', view_digest: workDigest(view) })).slice(7)}` };
}
function globalProjection(raw) {
    const s = { format: 'aleph-relation-review-subject/v1',
        owner_stage: raw.owner_stage, family: raw.family, type: raw.type,
        source_kind: raw.source_kind, source_id: raw.source_id,
        target_kind: raw.target_kind, target_id: raw.target_id,
        target_source_id: raw.target_source_id, target_locator: raw.target_locator,
        target_span_hash: raw.target_span_hash, record_state: raw.record_state,
        null_reason: raw.null_reason, basis_packet_ids: raw.basis_packet_ids, proposed_by: raw.proposed_by };
    return { subject: s, review_subject_digest: raw.review_subject_digest, material_use: validateMaterialUseInput(raw.material_use) };
}
export function relationWorkProposals(model) {
    const result = localProposals(model), captured = accepted(model, CAPTURE);
    if (!captured)
        return result;
    const raw = captured.value;
    return [...result, ...raw.relation_proposals.map((p, i) => proposal({
            producer_call_id: captured.call_id, producer_context_id: captured.context_id, raw_digest: captured.raw_digest,
            selector: `/relation_proposals/${i}`, semantic_id: null, semantic_subject_digest: null,
            projection: globalProjection(p), dependencies: [captured.call_id],
        }))];
}
function historical(model, p) {
    const s = p.projection.subject, claims = lineageCurrentClaimIds(model), packets = lineageCurrentPacketIds(model);
    return !(s.source_kind === 'CC' ? claims : packets).has(s.source_id)
        || (s.target_kind === 'CC' || s.target_kind === 'PKT') && !(s.target_kind === 'CC' ? claims : packets).has(s.target_id);
}
function reviewView(model, p) {
    const source = producerView(model), s = p.projection.subject;
    const claimIds = [s.source_kind === 'CC' ? s.source_id : '', s.target_kind === 'CC' ? s.target_id : ''];
    const claims = source.claims.filter((c) => claimIds.includes(c.claim_id));
    const packetIds = [...new Set([...s.basis_packet_ids, ...claims.flatMap((c) => c.packets.split(',').map((id) => id.trim())),
            ...s.source_kind === 'PKT' ? [s.source_id] : [], ...s.target_kind === 'PKT' ? [s.target_id] : []])];
    return { format: 'aleph-core-relation-review-view/v1', subject: p.projection.subject,
        review_subject_digest: p.projection.review_subject_digest, claims, packets: semanticPacketBasis(model, packetIds),
        current_inventory: { packets: [...lineageCurrentPacketIds(model)], claims: [...lineageCurrentClaimIds(model)] },
        exact_loci: s.target_kind === 'source-locus' ? source.exact_loci.filter((a) => a.source_id === s.target_source_id && a.locator === s.target_locator) : [] };
}
function reservation(model, p) {
    const retained = file(model, pathFor(p.key, 'reservation'));
    if (!retained)
        return null;
    const r = json(retained);
    assertWork(r.format === 'aleph-core-relation-reservation/v1' && semanticJson(r.proposal) === semanticJson(p)
        && r.view_digest === workDigest(bytes(reviewView(model, p)))
        && required(model, r.review_path).equals(bytes(reviewView(model, p)))
        && r.review_call_id === `CALL-F03-${workDigest(bytes({ key: p.key, lens: 'L3R', review_id: r.review_id })).slice(7)}`, 'WORK_RELATION_BINDING', 'exact retained relation reservation');
    return r;
}
/** In-memory prospective rows support existing USE predicates; no ledger bytes are published. */
export function relationProposalModel(model, values) {
    const text = relationLedger(values).toString(), path = 'ledgers/relations.md';
    const doc = { path: join(model.runDir, path), relativePath: path, text, lines: text.split('\n'),
        tables: parseTables(text, path), bullets: parseBulletFields(text) };
    return { ...model, documents: new Map([...model.documents, [path, doc]]) };
}
function relationLedger(values) {
    return Buffer.from(`# Relations\n\n- relation_format: ${RELATION_FORMAT}\n\n`
        + table(RELATION_TABLE_HEADER, values.map((v) => [v.relationId, v.ownerStage, v.family, v.type, v.sourceKind, v.sourceId,
            v.targetKind, v.targetId, v.targetSourceId, v.targetLocator, v.targetSpanHash, v.recordState, v.nullReason,
            v.basisPacketIds, v.proposedBy, v.reviewSubjectDigest, v.reviewedBy])));
}
function useRow(model, r) {
    const p = r.proposal, input = p.projection.material_use;
    const row = { use_id: r.use_id, owner_stage: 'S4', subject_kind: 'REL', subject_id: r.relation_id,
        basis_packet_ids: semanticJson(p.projection.subject.basis_packet_ids), requirements: semanticJson(input.requirements),
        use_state: input.use_state, fidelity_claim: input.fidelity_claim, limitation_refs: semanticJson(input.limitation_refs),
        reason: input.reason, established_by: `invocation:${p.producer_call_id}`, review_subject_digest: '', reviewed_by: 'none' };
    row.review_subject_digest = representationUseDigest(relationProposalModel(model, [{
            ...semanticRelationRow(p.projection).values, relationId: r.relation_id,
        }]), readRepresentationContext(model), row);
    return row;
}
export function relationMaterialReservation(model, key) {
    const p = relationWorkProposals(model).find((p) => p.key === key);
    assertWork(p, 'WORK_RELATION_BINDING', key);
    const r = reservation(model, p);
    assertWork(r, 'WORK_RELATION_BINDING', 'material review requires retained relation reservation');
    const row = useRow(model, r), context = readRepresentationContext(model);
    const view = representationReviewView(relationProposalModel(model, [{
            ...semanticRelationRow(p.projection).values, relationId: r.relation_id,
        }]), context, row);
    const digest = row.review_subject_digest;
    return { format: 'aleph-core-relation-material-reservation/v1', relation_key: key,
        producer_call_id: p.producer_call_id, producer_context_id: p.producer_context_id, raw_digest: p.raw_digest,
        inventory_hash: context.inventoryHash, row, review_path: `verification/harness/material-use-subjects/${digest.slice(7)}.json`,
        view_hash: workDigest(view), view_base64: Buffer.from(view).toString('base64'),
        reservation_path: `verification/harness/material-use-reservations/${digest.slice(7)}.json`,
        result_path: pathFor(key, 'L2F'), call_id: `CALL-F03-${workDigest(bytes({ key, lens: 'L2F', digest })).slice(7)}` };
}
export function selectRelationWork(model) {
    const prep = preparation(model), locals = localProposals(model), dependencies = [...new Set(locals.flatMap((p) => p.dependencies))];
    if (!file(model, PREPARATION))
        return local('prepare', 'S4', prep, dependencies);
    assertWork(required(model, PREPARATION).equals(bytes(prep)) && required(model, PRODUCER_VIEW).equals(bytes(producerView(model))), 'WORK_RELATION_BINDING', 'global relation preparation changed');
    if (!accepted(model, CAPTURE, prep.call_id))
        return { kind: 'worker', accepted_dependencies: dependencies,
            obligation: obligation('S4', 'S4.relation.capture', 's4.relation.capture', prep.call_id, bytes(prep)),
            call: { prepared_call_id: prep.call_id, role: 'relation-producer', kind: 'producer', task_line: RELATION_PRODUCER_TASK,
                allowlist: [PRODUCER_VIEW], producer_dependency: null, output_selector: 'Role: Global Relation Producer (S4)' } };
    for (const p of relationWorkProposals(model)) {
        if (historical(model, p)) {
            const disposition = { format: 'aleph-core-relation-disposition/v1', proposal: p, disposition: 'historical-endpoint-rejected' };
            if (!file(model, pathFor(p.key, 'disposition')))
                return local('reject-historical', p.key, disposition, p.dependencies);
            assertWork(required(model, pathFor(p.key, 'disposition')).equals(bytes(disposition)), 'WORK_RELATION_BINDING', 'historical disposition changed');
            continue;
        }
        const problems = relationProposalProblems(model, semanticRelationRow(p.projection));
        assertWork(problems.length === 0, 'WORK_RELATION_PROPOSAL', problems.join('; '));
        const r = reservation(model, p);
        if (!r)
            return local('reserve', p.key, p, p.dependencies);
        const l3r = accepted(model, pathFor(p.key, 'L3R'), r.review_call_id);
        if (!l3r)
            return { kind: 'worker', accepted_dependencies: p.dependencies,
                obligation: obligation('S4', 'S4.L3R', 's4.relation.review', p.key, bytes(r)),
                call: { prepared_call_id: r.review_call_id, role: 'verifier-l3r', kind: 'refuter', task_line: RELATION_REVIEW_TASK,
                    allowlist: [r.review_path], producer_dependency: p.producer_call_id, output_selector: 'L3R — typed-relation semantic challenge (S4 closure)' } };
        if (l3r.value.verdict !== 'upheld')
            return {
                kind: 'halt', code: 'WORK_RELATION_REVIEW_UNRESOLVED', reason: `${p.key}: the exact proposal lacks upheld L3R; no replacement or disposition inferred.`
            };
        if (p.projection.material_use.use_state !== 'usable')
            return {
                kind: 'halt', code: 'WORK_RELATION_MATERIAL_UNRESOLVED', reason: `${p.key}: no canonical REL may promote an unusable material declaration.`
            };
        if (representationUseNeedsReview(readRepresentationContext(model), p.projection.material_use)) {
            const material = relationMaterialReservation(model, p.key), deps = [...p.dependencies, l3r.call_id];
            if (!file(model, material.reservation_path))
                return local('prepare-material', p.key, material, deps);
            assertWork(required(model, material.reservation_path).equals(bytes(material))
                && required(model, material.review_path).equals(Buffer.from(material.view_base64, 'base64')), 'WORK_RELATION_BINDING', 'L2F reservation changed');
            const l2f = accepted(model, material.result_path, material.call_id);
            if (!l2f)
                return { kind: 'worker', accepted_dependencies: deps,
                    obligation: obligation('S4', 'S4.relation.L2F', 's4.relation.material-review', p.key, bytes(material)),
                    call: { prepared_call_id: material.call_id, role: 'verifier-l2f', kind: 'refuter', task_line: MATERIAL_REVIEW_TASK,
                        allowlist: [material.review_path], producer_dependency: p.producer_call_id, output_selector: 'L2F — formal/table/layout use challenge (S3/S4)' } };
            if (l2f.value.verdict !== 'upheld')
                return {
                    kind: 'halt', code: 'WORK_MATERIAL_REVIEW_UNRESOLVED', reason: `${p.key}: retained L2F blocks canonical relation use.`
                };
            assertMaterialReviewUpheld(l2f.value, material.row.review_subject_digest);
        }
    }
    return null;
}
/** The transport receives only the exact Core-selected proposal/review view. */
export function validateRelationWorkDelivery(model, role, stage, callId, task, producerContext, attachments) {
    if (role !== 'relation-producer' && role !== 'verifier-l3r')
        return;
    assertWork(hasRunCapability(model.manifest?.runFormatVersion || '', 'orchestrator-work-transitions')
        && stage === 'S4', 'WORK_RELATION_ISOLATION', 'bounded S4 relation work required');
    const selected = selectRelationWork(model);
    assertWork(selected?.kind === 'worker' && selected.call.role === role
        && selected.call.prepared_call_id === callId && selected.call.task_line === task
        && selected.call.allowlist.length === attachments.length
        && selected.call.allowlist.every((path, i) => path === attachments[i].path
            && required(model, path).equals(attachments[i].bytes)), 'WORK_RELATION_ISOLATION', 'exact Core-derived invocation, task and attachment bytes required');
    const proposal = role === 'verifier-l3r'
        ? relationWorkProposals(model).find((p) => p.key === selected.obligation.subject_id) : null;
    assertWork(producerContext === (proposal?.producer_context_id || null), 'WORK_RELATION_ISOLATION', 'exact producer context must remain withheld');
}
export function deriveRelationTransition(model, work, value) {
    const op = work.obligation.operation.slice('s4.relation.'.length), prep = preparation(model);
    const effects = [];
    if (op === 'prepare')
        effects.push(effect(model, PREPARATION, bytes(prep)), effect(model, PRODUCER_VIEW, bytes(producerView(model))));
    else if (op === 'capture') {
        assertWork(value?.call_id === prep.call_id && value.role === 'relation-producer', 'WORK_ACCEPTANCE', 'exact global relation producer');
        const raw = value.value;
        for (const rawProposal of raw.relation_proposals) {
            const p = globalProjection(rawProposal), row = semanticRelationRow(p), s = p.subject;
            assertWork(s.owner_stage === 'S4' && s.proposed_by === `invocation:${value.call_id}`
                && relationReviewSubjectDigest(row.values) === p.review_subject_digest, 'WORK_RELATION_BINDING', 'global producer/subject identity');
            assertWork(relationProposalProblems(model, row).length === 0, 'WORK_RELATION_PROPOSAL', relationProposalProblems(model, row).join('; '));
            if (s.target_kind === 'source-locus')
                assertWork(producerView(model).exact_loci.some((a) => a.source_id === s.target_source_id && a.locator === s.target_locator
                    && workDigest(Buffer.from(a.exact_bytes_base64, 'base64')) === s.target_span_hash), 'WORK_RELATION_CONTEXT', 'target locus was not in the sealed legal producer context');
        }
        effects.push(effect(model, CAPTURE, bytes(value)));
        const context = readRepresentationContext(model), findings = materialFindingRows(model, value.value, 'S4', value.call_id);
        if (findings.length)
            effects.push(effect(model, REPRESENTATION_USE_PATH, Buffer.from(representationUsesMarkdown([...context.uses, ...findings]))));
    }
    else {
        const p = relationWorkProposals(model).find((p) => p.key === work.obligation.subject_id);
        assertWork(p, 'WORK_RELATION_BINDING', 'exact proposal selection');
        if (op === 'reject-historical') {
            assertWork(historical(model, p), 'WORK_RELATION_BINDING', 'current proposal cannot be disguised as historical');
            effects.push(effect(model, pathFor(p.key, 'disposition'), bytes({
                format: 'aleph-core-relation-disposition/v1', proposal: p, disposition: 'historical-endpoint-rejected'
            })));
        }
        else if (op === 'reserve') {
            const reviewId = allocate(model, 'VER'), view = bytes(reviewView(model, p));
            const r = { format: 'aleph-core-relation-reservation/v1', proposal: p,
                relation_id: allocate(model, 'REL'), use_id: allocate(model, 'USE'), review_id: reviewId,
                review_call_id: `CALL-F03-${workDigest(bytes({ key: p.key, lens: 'L3R', review_id: reviewId })).slice(7)}`,
                review_path: pathFor(p.key, 'review-view'), view_digest: workDigest(view) };
            effects.push(effect(model, pathFor(p.key, 'reservation'), bytes(r)), effect(model, r.review_path, view));
        }
        else {
            const r = reservation(model, p);
            if (op === 'prepare-material') {
                const material = relationMaterialReservation(model, p.key);
                effects.push(effect(model, material.reservation_path, bytes(material)), effect(model, material.review_path, Buffer.from(material.view_base64, 'base64')));
            }
            else {
                const l2f = op === 'material-review', material = l2f ? relationMaterialReservation(model, p.key) : null;
                assertWork(op === 'review' || l2f, 'WORK_OPERATION', op);
                assertWork(value?.call_id === (material?.call_id || r.review_call_id) && value.role === (l2f ? 'verifier-l2f' : 'verifier-l3r')
                    && value.producer_context_id === p.producer_context_id && value.context_id !== p.producer_context_id, 'WORK_RELATION_REVIEW', 'exact independent reviewer required');
                const returned = value.value;
                assertWork(['upheld', 'refuted', 'cannot-determine'].includes(returned.verdict)
                    && returned.candidate_evidence.length === 0, 'WORK_RELATION_REVIEW', 'ordinary non-L1 verdict required');
                const id = l2f ? allocate(model, 'VER') : r.review_id;
                const target = l2f ? `representation-use-subject:${material.row.review_subject_digest}` : `relation-review-subject:${p.projection.review_subject_digest}`;
                const text = `# Verdict ${id}\n\n` + table(['field', 'value'], [['target', target], ['lens', l2f ? 'L2F' : 'L3R'],
                    ['stage', 'S4'], ['shown', material?.review_path || r.review_path], ['withheld', 'producer rationale, hidden context and downstream state'],
                    ['verdict', returned.verdict], ['consequence', returned.rationale]]);
                effects.push(effect(model, pathFor(p.key, l2f ? 'L2F' : 'L3R'), bytes(value)), effect(model, `verification/harness/${id}.md`, Buffer.from(text)));
                if (l2f)
                    effects.push(effect(model, pathFor(p.key, 'material-verdict'), bytes({ review_id: id })));
            }
        }
    }
    return { family: value ? 's4-capture' : 's4-preparation', effects,
        origins: effects.map((e) => ({ artifact: e.path, field: '*', from: value
                ? { kind: 'accepted', call_id: value.call_id, selector: work.obligation.subject_id }
                : { kind: 'rule', rule: work.obligation.operation } })) };
}
export function relationClosureEffects(model) {
    assertWork(selectRelationWork(model) === null, 'WORK_RELATION_CLOSURE', 'relation work remains');
    assertWork(parseRelations(model).rows.length === 0, 'WORK_RELATION_CLOSURE', 'canonical rows existed before C1');
    const values = [], context = readRepresentationContext(model), uses = [...context.uses];
    const dependencies = [accepted(model, CAPTURE).call_id];
    for (const p of relationWorkProposals(model)) {
        dependencies.push(...p.dependencies);
        if (historical(model, p))
            continue;
        const r = reservation(model, p), review = accepted(model, pathFor(p.key, 'L3R'), r.review_call_id);
        dependencies.push(review.call_id);
        values.push({ ...semanticRelationRow(p.projection).values, relationId: r.relation_id, reviewedBy: r.review_id });
        const row = useRow(model, r);
        if (representationUseNeedsReview(context, p.projection.material_use)) {
            const material = relationMaterialReservation(model, p.key), review = accepted(model, material.result_path, material.call_id);
            dependencies.push(review.call_id);
            row.reviewed_by = json(required(model, pathFor(p.key, 'material-verdict'))).review_id;
        }
        uses.push(row);
    }
    const proposed = relationProposalModel(model, values);
    for (const row of uses.filter((r) => r.subject_kind === 'REL'))
        validateRepresentationUse(proposed, context, row);
    return { effects: [effect(model, 'ledgers/relations.md', relationLedger(values)),
            ...uses.length !== context.uses.length ? [effect(model, REPRESENTATION_USE_PATH, Buffer.from(representationUsesMarkdown(uses)))] : []],
        dependencies: [...new Set(dependencies)] };
}
export function validateRelationClosure(model) {
    const checks = new ResultCollector('S4 relation closure');
    runK2Relations(checks, model);
    const failures = checks.checks.filter((c) => c.status === 'FAIL');
    assertWork(failures.length === 0, 'WORK_RELATION_CLOSURE', failures.map((c) => c.message).join('; '));
}

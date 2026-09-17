import { existsSync, readFileSync, mkdirSync, mkdtempSync, rmSync, linkSync, unlinkSync, openSync, closeSync, fsyncSync, readdirSync, lstatSync, writeFileSync, cpSync, } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { assertNoSymlinkComponents, assertSafeRelativePath, readStableRegularFile, stableJsonBytes, sha256Digest, walkRegularFiles, writeFileAtomic, } from './fs.js';
import { acquireDurableProcessLock, readRunState, verifyRetainedRuntimeIdentity, verifyRunControl, } from './run-control.js';
import { loadRun, hasRunCapability } from '../../../scripts/lib/run-model.js';
import { parseStrictJson } from '../../../scripts/lib/worker-return-contract.js';
import { selectNextWork, deriveWorkTransition, workDigest, workJson, assertWork, WORK_STAGE_CONTRACT, WORK_TRANSITION_CAPABILITY, CRITERIA_SAMPLE_INPUT_PATH, criteriaSampleProposal, validateDerivedWorkTransition, } from '../../../scripts/lib/work-transitions.js';
import { assembleWorkerBundle, verifyWorkerBundle, coreBlindPolicyReference } from './worker-bundle.js';
import { checkWorkerReturn } from './worker-return.js';
import { reopenNativeWorkerEvidence } from './worker-dispatch.js';
import { LedgerWriter } from './ledger-writer.js';
import { verifyAndLoadLoaBundle } from './core-loader.js';
const ROOT = 'control/orchestration';
const DIGEST = /^sha256:[0-9a-f]{64}$/u;
const WORK_ID = /^WORK-[0-9a-f]{64}$/u;
const CALL_ID = /^CALL-F03-[0-9a-f]{64}$/u;
const clockDefault = { now: () => new Date().toISOString() };
const heldLocks = new Set();
function canonicalPath(runDir, path) {
    assertSafeRelativePath(path);
    const full = join(runDir, path);
    assertNoSymlinkComponents(runDir, full);
    return full;
}
function immutable(runDir, path, bytes) {
    const full = canonicalPath(runDir, path);
    mkdirSync(dirname(full), { recursive: true });
    if (existsSync(full)) {
        assertWork(readStableRegularFile(full).bytes.equals(bytes), 'WORK_IMMUTABLE_CONFLICT', path);
        assertWork((lstatSync(full).mode & 0o222) === 0, 'WORK_CUSTODY', path);
        return;
    }
    const staging = mkdtempSync(join(dirname(full), '.unsealed-'));
    const staged = join(staging, 'value');
    try {
        writeFileAtomic(staged, bytes, 0o400);
        try {
            linkSync(staged, full);
        }
        catch (error) {
            if (error.code !== 'EEXIST')
                throw error;
            assertWork(readStableRegularFile(full).bytes.equals(bytes), 'WORK_IMMUTABLE_CONFLICT', path);
        }
        const directory = openSync(dirname(full), 'r');
        try {
            fsyncSync(directory);
        }
        finally {
            closeSync(directory);
        }
    }
    finally {
        rmSync(staging, { recursive: true, force: true });
    }
}
function seal(value) {
    return { ...value, digest: sha256Digest(stableJsonBytes(value)) };
}
function publish(runDir, path, value) {
    const sealed = seal(value);
    immutable(runDir, path, stableJsonBytes(sealed));
    return sealed;
}
function readSealed(runDir, path, keys) {
    const full = canonicalPath(runDir, path), bytes = readStableRegularFile(full).bytes;
    const value = parseStrictJson(bytes);
    assertWork(value && typeof value === 'object' && !Array.isArray(value)
        && Object.keys(value).sort().join('\0') === [...keys, 'digest'].sort().join('\0')
        && stableJsonBytes(value).equals(bytes) && (lstatSync(full).mode & 0o222) === 0, 'WORK_RECORD', path);
    const { digest, ...body } = value;
    assertWork(typeof digest === 'string' && DIGEST.test(digest) && digest === sha256Digest(stableJsonBytes(body)), 'WORK_RECORD_DIGEST', path);
    return value;
}
const WORK_KEYS = ['format', 'work_id', 'identity', 'created_at', 'basis_digest', 'core_stage_contract', 'call'];
function closedRecord(value, keys, label) {
    assertWork(value !== null && typeof value === 'object' && !Array.isArray(value)
        && Object.keys(value).sort().join('\0') === [...keys].sort().join('\0'), 'WORK_RECORD', label);
}
function workPath(id) {
    assertWork(WORK_ID.test(id), 'WORK_IDENTITY', id);
    return `${ROOT}/work/${id}.json`;
}
function acceptedPath(callId) {
    assertWork(CALL_ID.test(callId), 'WORK_CALL_IDENTITY', callId);
    return `${ROOT}/accepted/${callId}.json`;
}
export function orchestrationCommitPath(id) { workPath(id); return `${ROOT}/commits/${id}-intent.json`; }
function consumedPath(id) { workPath(id); return `${ROOT}/commits/${id}-consumed.json`; }
function execution(state) {
    return { stage: state.execution.stage, stage_status: state.execution.stage_status, core_state: state.execution.core_state,
        blocked: Boolean(state.execution.halt || state.execution.gate?.status === 'awaiting-authority') };
}
export function usesOrchestration(runDir) {
    return hasRunCapability(readRunState(runDir).identity.run_format_version, WORK_TRANSITION_CAPABILITY);
}
/** Abrupt-exit injection is confined to explicitly tainted fixture runs. */
export function orchestrationFixtureFault(runDir, operation, point) {
    const requested = process.env.ALEPH_FIXTURE_WORK_FAULT;
    if (!requested)
        return;
    assertWork(readRunState(runDir).full_mode === 'fixture-simulated', 'WORK_FIXTURE_ONLY', 'fault injection cannot affect a native run');
    if (requested === `${operation}:${point}`)
        process.exit(86);
}
export function withOrchestrationLock(runDir, action, clock = clockDefault) {
    if (heldLocks.has(runDir))
        return action();
    const release = acquireDurableProcessLock(join(runDir, ROOT, 'lock'), {
        format: 'aleph-loa-orchestration-lock/v1', label: 'orchestration', acquiredAt: clock.now(),
    });
    heldLocks.add(runDir);
    try {
        return action();
    }
    finally {
        heldLocks.delete(runDir);
        release();
    }
}
function captureBasis(runDir) {
    const members = [];
    for (const full of walkRegularFiles(runDir)) {
        const path = relative(runDir, full).replaceAll('\\', '/');
        if (path.startsWith(`${ROOT}/`))
            continue;
        const bytes = readStableRegularFile(full).bytes, digest = sha256Digest(bytes);
        const storage = path.startsWith('corpus/sources/') || path.startsWith('corpus/representation-assets/')
            || path.startsWith('control/runtime/bundle/') ? 'immutable-reference' : 'blob';
        if (storage === 'blob')
            immutable(runDir, `${ROOT}/blobs/${digest.slice(7)}`, bytes);
        members.push({ path, digest, byte_length: String(bytes.length), storage });
    }
    const basis = seal({ format: 'aleph-loa-work-basis/v1', members,
        canonical_paths: members.map((entry) => entry.path).filter((path) => !path.startsWith('control/')),
        absence_scope: 'complete-run-file-inventory-excluding-orchestration/v1' });
    immutable(runDir, `${ROOT}/basis/${basis.digest.slice(7)}/manifest.json`, stableJsonBytes(basis));
    return basis;
}
function readBasis(runDir, digest) {
    assertWork(DIGEST.test(digest), 'WORK_BASIS', digest);
    const basis = readSealed(runDir, `${ROOT}/basis/${digest.slice(7)}/manifest.json`, ['format', 'members', 'canonical_paths', 'absence_scope']);
    assertWork(basis.format === 'aleph-loa-work-basis/v1' && basis.digest === digest
        && basis.absence_scope === 'complete-run-file-inventory-excluding-orchestration/v1'
        && Array.isArray(basis.members) && Array.isArray(basis.canonical_paths), 'WORK_BASIS', digest);
    const paths = new Set();
    for (const member of basis.members) {
        assertWork(Object.keys(member).sort().join('\0') === ['byte_length', 'digest', 'path', 'storage'].join('\0')
            && DIGEST.test(member.digest) && /^(0|[1-9][0-9]*)$/u.test(member.byte_length)
            && ['blob', 'immutable-reference'].includes(member.storage), 'WORK_BASIS', 'invalid member');
        assertSafeRelativePath(member.path);
        assertWork(!paths.has(member.path) && !member.path.startsWith(`${ROOT}/`), 'WORK_BASIS', 'duplicate/recursive member');
        paths.add(member.path);
    }
    assertWork(stableJsonBytes(basis.canonical_paths).equals(stableJsonBytes(basis.members.map((member) => member.path).filter((path) => !path.startsWith('control/')))), 'WORK_BASIS', 'canonical inventory');
    return basis;
}
function basisBytes(runDir, member) {
    const path = member.storage === 'immutable-reference' ? member.path : `${ROOT}/blobs/${member.digest.slice(7)}`;
    const bytes = readStableRegularFile(canonicalPath(runDir, path)).bytes;
    assertWork(sha256Digest(bytes) === member.digest && String(bytes.length) === member.byte_length, 'WORK_BASIS_CHANGED', member.path);
    return bytes;
}
function withBasis(runDir, digest, action) {
    const basis = readBasis(runDir, digest), scratch = mkdtempSync(join(tmpdir(), 'aleph-work-basis-'));
    try {
        for (const member of basis.members) {
            const path = canonicalPath(scratch, member.path);
            mkdirSync(dirname(path), { recursive: true });
            // This private reconstruction is disposable, never a retained record.
            // Its input bytes are authenticated above; it needs no durable publish.
            writeFileSync(path, basisBytes(runDir, member), { mode: 0o400, flag: 'wx' });
        }
        return action(scratch);
    }
    finally {
        rmSync(scratch, { recursive: true, force: true });
    }
}
function assertApplicable(runDir, work) {
    const state = readRunState(runDir);
    assertWork(state.execution.resume.checkpoint_digest === work.identity.checkpoint, 'WORK_CHECKPOINT_STALE', work.work_id);
    const basis = readBasis(runDir, work.basis_digest);
    const current = walkRegularFiles(runDir).map((full) => relative(runDir, full).replaceAll('\\', '/')).filter((path) => !path.startsWith('control/'));
    assertWork(stableJsonBytes(current).equals(stableJsonBytes(basis.canonical_paths)), 'WORK_PREREQUISITE_CHANGED', 'canonical inventory/absence');
    for (const member of basis.members.filter((entry) => !entry.path.startsWith('control/'))) {
        assertWork(readStableRegularFile(canonicalPath(runDir, member.path)).bytes.equals(basisBytes(runDir, member)), 'WORK_PREREQUISITE_CHANGED', member.path);
    }
    assertWork(workJson(selectNextWork(loadRun(runDir), execution(state))).equals(workJson(work.identity.work)), 'WORK_STALE', 'first unmet obligation changed');
}
export function assertRecoveryPrerequisites(runDir, work, plan) {
    const basis = readBasis(runDir, work.basis_digest);
    const writes = new Map(plan.effects.map((effect) => [effect.path, effect]));
    const current = walkRegularFiles(runDir).map((full) => relative(runDir, full).replaceAll('\\', '/')).filter((path) => !path.startsWith('control/'));
    for (const path of current)
        assertWork(basis.canonical_paths.includes(path) || writes.has(path), 'WORK_PREREQUISITE_CHANGED', path);
    for (const member of basis.members.filter((entry) => !entry.path.startsWith('control/'))) {
        const full = canonicalPath(runDir, member.path), effect = writes.get(member.path);
        assertWork(existsSync(full), 'WORK_PREREQUISITE_CHANGED', member.path);
        const bytes = readStableRegularFile(full).bytes;
        assertWork(bytes.equals(basisBytes(runDir, member)) || effect && bytes.toString('base64') === effect.after_base64, 'WORK_PREREQUISITE_CHANGED', member.path);
    }
}
export function readOrchestrationWork(runDir, id) {
    const work = readSealed(runDir, workPath(id), WORK_KEYS);
    closedRecord(work.identity, ['run_id', 'pins', 'checkpoint', 'ledger', 'ordinal', 'work', 'dependencies'], 'work identity');
    closedRecord(work.core_stage_contract, ['path', 'digest'], 'stage contract');
    assertWork(/^[1-9][0-9]*$/u.test(work.identity.ordinal) && DIGEST.test(work.identity.checkpoint)
        && !Number.isNaN(Date.parse(work.created_at)) && Array.isArray(work.identity.dependencies), 'WORK_IDENTITY', id);
    for (const dependency of work.identity.dependencies) {
        closedRecord(dependency, ['work_id', 'consumption_digest', 'call_id', 'receipt_digest'], 'work dependency');
        assertWork(WORK_ID.test(dependency.work_id) && CALL_ID.test(dependency.call_id)
            && DIGEST.test(dependency.consumption_digest) && DIGEST.test(dependency.receipt_digest), 'WORK_DEPENDENCY', id);
        const parent = readSealed(runDir, workPath(dependency.work_id), WORK_KEYS);
        assertWork(BigInt(parent.identity.ordinal) < BigInt(work.identity.ordinal) && parent.call?.call_id === dependency.call_id, 'WORK_DEPENDENCY', 'dependency must be an earlier exact call');
    }
    const state = readRunState(runDir), runtime = verifyRetainedRuntimeIdentity(runDir, state);
    assertWork(work.format === 'aleph-loa-work-item/v1' && work.work_id === id
        && id === `WORK-${sha256Digest(stableJsonBytes(work.identity)).slice(7)}`
        && state.run_id === work.identity.run_id && stableJsonBytes(state.identity).equals(stableJsonBytes(work.identity.pins))
        && hasRunCapability(state.identity.run_format_version, WORK_TRANSITION_CAPABILITY), 'WORK_IDENTITY', id);
    assertWork(work.core_stage_contract.path === WORK_STAGE_CONTRACT
        && work.core_stage_contract.digest === verifyAndLoadLoaBundle(runtime.bundle.root).files.get(WORK_STAGE_CONTRACT)?.digest, 'WORK_CORE_CONTRACT', id);
    withBasis(runDir, work.basis_digest, (root) => {
        const basisState = readRunState(root);
        assertWork(basisState.run_id === work.identity.run_id
            && stableJsonBytes(basisState.identity).equals(stableJsonBytes(work.identity.pins))
            && stableJsonBytes(basisState.ledger).equals(stableJsonBytes(work.identity.ledger))
            && basisState.execution.resume.checkpoint_digest === work.identity.checkpoint
            && workJson(selectNextWork(loadRun(root), execution(basisState))).equals(workJson(work.identity.work)), 'WORK_BASIS', 'obligation does not reconstruct');
        const selected = work.identity.work;
        const requiredCalls = [...selected.accepted_dependencies || []];
        let producerContext = null;
        if (selected.kind === 'worker' && selected.call.producer_dependency) {
            const parents = work.identity.dependencies.map((dependency) => readSealed(runDir, workPath(dependency.work_id), WORK_KEYS));
            const matches = parents.filter((parent) => parent.call?.call_id === selected.call.producer_dependency
                || parent.identity.work.obligation.dod === selected.call.producer_dependency);
            assertWork(matches.length === 1 && matches[0].call, 'WORK_DEPENDENCY', 'exact Core producer dependency required');
            const receipt = acceptance(runDir, matches[0].call.call_id);
            const reference = work.identity.dependencies.find((dependency) => dependency.work_id === matches[0].work_id);
            assertWork(receipt.digest === reference.receipt_digest && receipt.work_digest === matches[0].digest, 'WORK_DEPENDENCY', 'producer receipt changed');
            producerContext = receipt.context_id;
            requiredCalls.unshift(matches[0].call.call_id);
        }
        assertWork(stableJsonBytes([...new Set(requiredCalls)]).equals(stableJsonBytes(work.identity.dependencies.map((dependency) => dependency.call_id))), 'WORK_DEPENDENCY', 'dependency set differs from Core work');
        const expectedCall = selected.kind === 'worker' ? deriveWorkCall(runDir, selected, basisState, runtime.bundle.root, id, readBasis(runDir, work.basis_digest), producerContext, root) : null;
        assertWork(stableJsonBytes(work.call).equals(stableJsonBytes(expectedCall)), 'WORK_CALL_BINDING', 'call tuple differs from exact Core work and basis');
    });
    return work;
}
function allWorkIds(runDir) {
    const root = canonicalPath(runDir, `${ROOT}/work`);
    if (!existsSync(root))
        return [];
    return readdirSync(root).map((name) => {
        assertWork(/^WORK-[0-9a-f]{64}\.json$/u.test(name), 'WORK_QUEUE', name);
        return name.slice(0, -5);
    });
}
function workForCall(runDir, callId) {
    // Index lookup is not authorization. Reconstruct the unique selected work
    // below; unrelated historical bases need not be materialized for a lookup.
    const found = allWorkIds(runDir).map((id) => readSealed(runDir, workPath(id), WORK_KEYS))
        .filter((work) => work.call?.call_id === callId);
    assertWork(found.length === 1, 'WORK_CALL_BINDING', callId);
    return readOrchestrationWork(runDir, found[0].work_id);
}
export function assertWorkRequest(runDir, request) {
    const work = workForCall(runDir, request.call_id), call = work.call;
    assertWork(request.run_id === work.identity.run_id && request.stage === work.identity.work.obligation.stage
        && request.role === call.role && request.kind === call.kind && request.task_line === call.task_line
        && stableJsonBytes(request.model_identity).equals(stableJsonBytes(call.model))
        && request.isolation.producer_context_id === call.producer_context_id
        && stableJsonBytes(request.allowlist.map((entry) => ({ path: entry.run_path, digest: entry.digest }))).equals(stableJsonBytes(call.allowlist))
        && stableJsonBytes(request.withheld).equals(stableJsonBytes(call.withheld))
        && request.downstream_operations.length === 0 && request.procedural_restrictions.length === 0, 'WORK_REQUEST_BINDING', request.call_id);
    return work;
}
function acceptance(runDir, callId) {
    return readSealed(runDir, acceptedPath(callId), ['format', 'work_id', 'work_digest', 'call_id', 'checkpoint', 'basis_digest',
        'request_digest', 'native', 'raw_digest', 'validation_digest', 'validated_digest', 'contract_digest', 'context_id', 'producer_context_id', 'simulation']);
}
export function reopenAcceptedWorkReturn(runDir, workId) {
    const work = readOrchestrationWork(runDir, workId);
    assertWork(work.call, 'WORK_ACCEPTANCE', 'local transition has no return');
    const receipt = acceptance(runDir, work.call.call_id), call = work.call;
    const root = join(runDir, 'control/worker-bundles', call.call_id), returns = join(runDir, 'control/worker-returns', call.call_id);
    const native = reopenNativeWorkerEvidence({ workerBundleRoot: root, returnRoot: returns });
    assertWork(assertWorkRequest(runDir, native.invocation.request).digest === work.digest, 'WORK_ACCEPTANCE', 'request belongs to another work');
    assertDispatchIntent(runDir, work, native.invocation.request, native.invocation.invocation_digest);
    const checked = withBasis(runDir, work.basis_digest, (basis) => checkWorkerReturn({
        workerBundleRoot: root, returnRoot: returns, raw: native.raw, dispatchReceipt: native.dispatch.receipt,
    }, loadRun(basis)));
    assertWork(checked.validated && checked.report.result === 'PASS', 'WORK_REVALIDATION', checked.report.errors.join('; '));
    const returned = checked.validated;
    assertWork(receipt.format === 'aleph-loa-accepted-return/v1' && receipt.work_id === workId && receipt.work_digest === work.digest
        && receipt.call_id === call.call_id && receipt.checkpoint === work.identity.checkpoint && receipt.basis_digest === work.basis_digest
        && receipt.request_digest === sha256Digest(stableJsonBytes(native.invocation.request))
        && receipt.raw_digest === returned.rawDigest && receipt.validation_digest === returned.validationDigest
        && receipt.validated_digest === returned.dataDigest && receipt.contract_digest === returned.contractDigest
        && receipt.context_id === returned.contextId && receipt.producer_context_id === returned.producerContextId
        && receipt.simulation === Boolean(returned.simulation), 'WORK_ACCEPTANCE_BINDING', call.call_id);
    const evidence = retainedNativeDigests(runDir, call.call_id, native.invocation.simulation !== null);
    assertWork(stableJsonBytes(evidence).equals(stableJsonBytes(receipt.native)), 'WORK_NATIVE_CHANGED', call.call_id);
    for (const [name, bytes] of [['raw.json', checked.rawBytes], ['validation.json', stableJsonBytes(checked.report)],
        ['validated.json', returned.canonicalBytes()]]) {
        const full = canonicalPath(runDir, `control/worker-returns/${call.call_id}/${name}`);
        assertWork(readStableRegularFile(full).bytes.equals(bytes) && (lstatSync(full).mode & 0o222) === 0, 'WORK_ACCEPTED_BYTES_CHANGED', name);
    }
    return { work, receipt, returned };
}
function retainedNativeDigests(runDir, callId, simulated) {
    return ['invocation.json', 'host-capabilities.json', 'native-dispatch.json', 'native-return.json', ...simulated ? [] : ['claude-stream.jsonl']].map((name) => {
        const path = `control/worker-returns/${callId}/${name}`, bytes = readStableRegularFile(canonicalPath(runDir, path)).bytes;
        return { path, digest: sha256Digest(bytes), byte_length: String(bytes.length) };
    });
}
export function acceptOrchestrationReturn(runDir, callId) {
    return withOrchestrationLock(runDir, () => {
        const work = workForCall(runDir, callId);
        if (existsSync(canonicalPath(runDir, acceptedPath(callId)))) {
            const accepted = reopenAcceptedWorkReturn(runDir, work.work_id);
            return { validated: accepted.returned, report: JSON.parse(readFileSync(join(runDir, `control/worker-returns/${callId}/validation.json`), 'utf8')),
                receipt: accepted.receipt };
        }
        assertApplicable(runDir, work);
        const root = join(runDir, 'control/worker-bundles', callId), returns = join(runDir, 'control/worker-returns', callId);
        const native = reopenNativeWorkerEvidence({ workerBundleRoot: root, returnRoot: returns });
        assertWorkRequest(runDir, native.invocation.request);
        assertDispatchIntent(runDir, work, native.invocation.request, native.invocation.invocation_digest);
        const checked = withBasis(runDir, work.basis_digest, (basis) => checkWorkerReturn({
            workerBundleRoot: root, returnRoot: returns, raw: native.raw, dispatchReceipt: native.dispatch.receipt,
        }, loadRun(basis)));
        assertWork(checked.validated && checked.report.result === 'PASS', 'WORK_RETURN_REJECTED', checked.report.errors.join('; '));
        const returned = checked.validated;
        immutable(runDir, `control/worker-returns/${callId}/raw.json`, checked.rawBytes);
        immutable(runDir, `control/worker-returns/${callId}/validation.json`, stableJsonBytes(checked.report));
        immutable(runDir, `control/worker-returns/${callId}/validated.json`, returned.canonicalBytes());
        const receipt = publish(runDir, acceptedPath(callId), {
            format: 'aleph-loa-accepted-return/v1', work_id: work.work_id, work_digest: work.digest, call_id: callId,
            checkpoint: work.identity.checkpoint, basis_digest: work.basis_digest, request_digest: sha256Digest(stableJsonBytes(native.invocation.request)),
            native: retainedNativeDigests(runDir, callId, native.invocation.simulation !== null), raw_digest: returned.rawDigest,
            validation_digest: returned.validationDigest, validated_digest: returned.dataDigest, contract_digest: returned.contractDigest,
            context_id: returned.contextId, producer_context_id: returned.producerContextId, simulation: Boolean(returned.simulation),
        });
        return { validated: returned, report: checked.report, receipt };
    });
}
function assertDispatchIntent(runDir, work, request, invocationDigest) {
    const intent = readSealed(runDir, `${ROOT}/dispatch/${request.call_id}-intent.json`, ['format', 'work_id', 'work_digest', 'call_id', 'invocation_digest', 'request_digest', 'checkpoint', 'pid', 'created_at']);
    assertWork(intent.format === 'aleph-loa-dispatch-intent/v1' && intent.work_id === work.work_id && intent.work_digest === work.digest
        && intent.call_id === request.call_id && intent.invocation_digest === invocationDigest
        && intent.checkpoint === work.identity.checkpoint && /^[1-9][0-9]*$/u.test(intent.pid)
        && !Number.isNaN(Date.parse(intent.created_at))
        && intent.request_digest === sha256Digest(stableJsonBytes(request)), 'WORK_DISPATCH_INTENT', request.call_id);
}
export function beginOrchestrationDispatch(runDir, request, invocationDigest) {
    return withOrchestrationLock(runDir, () => {
        const work = assertWorkRequest(runDir, request), path = `${ROOT}/dispatch/${request.call_id}-intent.json`;
        assertApplicable(runDir, work);
        if (existsSync(canonicalPath(runDir, path))) {
            assertDispatchIntent(runDir, work, request, invocationDigest);
            if (existsSync(join(runDir, 'control/worker-returns', request.call_id, 'native-dispatch.json'))) {
                reopenNativeWorkerEvidence({ workerBundleRoot: join(runDir, 'control/worker-bundles', request.call_id), returnRoot: join(runDir, 'control/worker-returns', request.call_id) });
                return 'retained';
            }
            throw new Error('DISPATCH_OUTCOME_UNKNOWN: a durable dispatch intent exists without authenticated completion; no automatic redispatch');
        }
        publish(runDir, path, { format: 'aleph-loa-dispatch-intent/v1', work_id: work.work_id, work_digest: work.digest,
            call_id: request.call_id, invocation_digest: invocationDigest, request_digest: sha256Digest(stableJsonBytes(request)),
            checkpoint: work.identity.checkpoint, pid: String(process.pid), created_at: new Date().toISOString() });
        return 'spawn';
    });
}
export function completeOrchestrationDispatch(runDir, request, invocationDigest, publishResult) {
    withOrchestrationLock(runDir, () => {
        const work = assertWorkRequest(runDir, request);
        assertDispatchIntent(runDir, work, request, invocationDigest);
        // Retain completion even if a human halt changed applicability while the
        // host was running. Acceptance/commit will refuse that stale checkpoint.
        publishResult();
        const native = reopenNativeWorkerEvidence({
            workerBundleRoot: join(runDir, 'control/worker-bundles', request.call_id),
            returnRoot: join(runDir, 'control/worker-returns', request.call_id),
        });
        publish(runDir, `${ROOT}/dispatch/${request.call_id}-complete.json`, {
            format: 'aleph-loa-dispatch-completion/v1', work_id: work.work_id,
            work_digest: work.digest, invocation_digest: native.invocation.invocation_digest,
            native: retainedNativeDigests(runDir, request.call_id, native.invocation.simulation !== null),
        });
    });
}
function valueOf(receipt, returned, role) {
    return { call_id: returned.callId, role, context_id: returned.contextId, producer_context_id: returned.producerContextId,
        raw_digest: returned.rawDigest, receipt_digest: receipt.digest, simulation: Boolean(returned.simulation), value: returned.data };
}
export function deriveAuthenticatedWork(runDir, id, recovering = false) {
    const work = readOrchestrationWork(runDir, id);
    if (!recovering)
        assertApplicable(runDir, work);
    const accepted = work.call ? reopenAcceptedWorkReturn(runDir, id) : null;
    for (const dependency of work.identity.dependencies) {
        const parent = reopenAcceptedWorkReturn(runDir, dependency.work_id);
        const consumed = readConsumption(runDir, dependency.work_id);
        assertWork(parent.receipt.digest === dependency.receipt_digest && consumed.digest === dependency.consumption_digest
            && parent.returned.callId === dependency.call_id, 'WORK_DEPENDENCY', id);
    }
    const derived = withBasis(runDir, work.basis_digest, (basis) => {
        if (work.call) {
            // The original basis remains sealed. Overlay only this already
            // reauthenticated call's transport proof in the disposable planning copy.
            for (const slot of ['worker-bundles', 'worker-returns']) {
                const path = `control/${slot}/${work.call.call_id}`;
                cpSync(join(runDir, path), join(basis, path), { recursive: true, force: false, errorOnExist: true });
            }
        }
        const beforeState = readRunState(basis), chainPath = join(basis, 'control/ledger-chain.jsonl');
        const model = loadRun(basis);
        const transition = deriveWorkTransition(model, execution(beforeState), work.identity.work, accepted ? valueOf(accepted.receipt, accepted.returned, work.call.role) : null, work.created_at);
        const proposed = mkdtempSync(join(tmpdir(), 'aleph-work-proposed-'));
        try {
            cpSync(basis, proposed, { recursive: true });
            for (const effect of transition.effects)
                writeFileAtomic(canonicalPath(proposed, effect.path), Buffer.from(effect.after_base64, 'base64'));
            validateDerivedWorkTransition(model, loadRun(proposed), transition);
        }
        finally {
            rmSync(proposed, { recursive: true, force: true });
        }
        return { beforeState, chainBefore: existsSync(chainPath) ? readFileSync(chainPath, 'utf8') : '', transition };
    });
    return { work, ...derived, acceptance: accepted?.receipt || null, returned: accepted?.returned || null };
}
export function prepareOrchestrationCommit(runDir, authenticated) {
    const work = authenticated.work;
    return publish(runDir, orchestrationCommitPath(work.work_id), {
        format: 'aleph-loa-orchestration-commit/v1', work_id: work.work_id, work_digest: work.digest,
        acceptance_digest: authenticated.acceptance?.digest || null, plan_digest: workDigest(workJson(authenticated.transition)),
        before_checkpoint: work.identity.checkpoint, before_chain: work.identity.ledger.chain_head,
        journal: `control/transactions/TXN-work-${work.work_id.slice(5)}.json`,
    });
}
export function readOrchestrationCommit(runDir, id) {
    return readSealed(runDir, orchestrationCommitPath(id), ['format', 'work_id', 'work_digest', 'acceptance_digest', 'plan_digest', 'before_checkpoint', 'before_chain', 'journal']);
}
function readConsumption(runDir, id) {
    const consumed = readSealed(runDir, consumedPath(id), ['format', 'work_id', 'commit_digest', 'journal_digest', 'after_checkpoint', 'after_chain']);
    const intent = readOrchestrationCommit(runDir, id);
    const journal = readStableRegularFile(canonicalPath(runDir, intent.journal)).bytes;
    assertWork(consumed.format === 'aleph-loa-work-consumption/v1' && consumed.work_id === id && consumed.commit_digest === intent.digest
        && consumed.journal_digest === sha256Digest(journal), 'WORK_CONSUMPTION', id);
    return consumed;
}
export function recordOrchestrationConsumption(runDir, id, state) {
    const intent = readOrchestrationCommit(runDir, id);
    publish(runDir, consumedPath(id), { format: 'aleph-loa-work-consumption/v1', work_id: id, commit_digest: intent.digest,
        journal_digest: sha256Digest(readStableRegularFile(canonicalPath(runDir, intent.journal)).bytes),
        after_checkpoint: state.execution.resume.checkpoint_digest, after_chain: state.ledger.chain_head });
}
function deriveWorkCall(runDir, selected, state, bundleRoot, id, basis, producerContext, sourceRoot = runDir) {
    const role = selected.call.role;
    const coreRef = coreBlindPolicyReference(verifyAndLoadLoaBundle(bundleRoot), role, selected.obligation.stage, selected.call.task_line);
    return { call_id: selected.call.prepared_call_id || `CALL-F03-${id.slice(5)}`, role, kind: selected.call.kind,
        task_line: selected.call.task_line, output_selector: selected.call.output_selector,
        allowlist: selected.call.allowlist.map((path) => ({ path, digest: sha256Digest(readStableRegularFile(canonicalPath(sourceRoot, path)).bytes) })),
        withheld: basis.canonical_paths.filter((path) => !selected.call.allowlist.includes(path)).map((selector) => ({ selector, core_ref: coreRef })),
        producer_context_id: producerContext, downstream_operations: [], model: state.identity.models[role] };
}
function createWork(runDir, selected, clock) {
    const state = readRunState(runDir), runtime = verifyRetainedRuntimeIdentity(runDir, state), previous = allWorkIds(runDir);
    const dependencies = [];
    let producerContext = null;
    const parents = previous.map((id) => readOrchestrationWork(runDir, id));
    const requiredCalls = [...selected.accepted_dependencies || []];
    if (selected.kind === 'worker' && selected.call.producer_dependency) {
        const matches = parents.filter((work) => work.call?.call_id === selected.call.producer_dependency
            || work.identity.work.obligation.dod === selected.call.producer_dependency);
        assertWork(matches.length === 1, 'WORK_DEPENDENCY', selected.call.producer_dependency);
        const accepted = reopenAcceptedWorkReturn(runDir, matches[0].work_id);
        requiredCalls.unshift(accepted.returned.callId);
        producerContext = accepted.returned.contextId;
    }
    for (const callId of new Set(requiredCalls)) {
        const matches = parents.filter((work) => work.call?.call_id === callId);
        assertWork(matches.length === 1, 'WORK_DEPENDENCY', callId);
        const parent = reopenAcceptedWorkReturn(runDir, matches[0].work_id), consumed = readConsumption(runDir, matches[0].work_id);
        dependencies.push({ work_id: matches[0].work_id, consumption_digest: consumed.digest,
            call_id: callId, receipt_digest: parent.receipt.digest });
    }
    const identity = { run_id: state.run_id, pins: state.identity, checkpoint: state.execution.resume.checkpoint_digest,
        ledger: state.ledger, ordinal: String(previous.length + 1), work: selected, dependencies };
    const id = `WORK-${sha256Digest(stableJsonBytes(identity)).slice(7)}`;
    const basis = captureBasis(runDir);
    const call = selected.kind === 'worker' ? deriveWorkCall(runDir, selected, state, runtime.bundle.root, id, basis, producerContext) : null;
    return publish(runDir, workPath(id), { format: 'aleph-loa-work-item/v1', work_id: id, identity,
        created_at: clock.now(), basis_digest: basis.digest, core_stage_contract: { path: WORK_STAGE_CONTRACT,
            digest: verifyAndLoadLoaBundle(runtime.bundle.root).files.get(WORK_STAGE_CONTRACT).digest }, call });
}
function transportAction(runDir, work) {
    assertWork(work.call, 'WORK_CALL_BINDING', work.work_id);
    const call = work.call, runtime = verifyRetainedRuntimeIdentity(runDir, readRunState(runDir));
    const bundleRoot = join(runDir, 'control/worker-bundles', call.call_id);
    if (!existsSync(bundleRoot))
        assembleWorkerBundle({ bundle: verifyAndLoadLoaBundle(runtime.bundle.root), runDir, callId: call.call_id, runId: work.identity.run_id,
            stage: work.identity.work.obligation.stage, role: call.role, kind: call.kind,
            allowlist: call.allowlist.map((entry) => entry.path), withheld: call.withheld, taskLine: call.task_line,
            modelIdentity: call.model, producerContextId: call.producer_context_id, downstreamOperations: [] });
    assertWorkRequest(runDir, verifyWorkerBundle(bundleRoot));
    const returns = join(runDir, 'control/worker-returns', call.call_id);
    const action = !existsSync(join(returns, 'invocation.json')) ? 'prepare'
        : existsSync(join(returns, 'native-dispatch.json')) ? 'accept' : 'dispatch';
    return { kind: 'worker', work_id: work.work_id, call_id: call.call_id, action,
        worker_bundle: bundleRoot, return_root: returns, host_capabilities: runtime.host_receipt.path,
        transport_cli: join(runtime.bundle.root, 'runtime-js/adapters/loa/src/worker-dispatch.js') };
}
export function resumeOrchestration(runDir, clock = clockDefault) {
    return withOrchestrationLock(runDir, () => {
        verifyRetainedRuntimeIdentity(runDir, readRunState(runDir));
        const writer = new LedgerWriter(runDir, clock);
        for (;;) {
            const works = allWorkIds(runDir).map((id) => readOrchestrationWork(runDir, id));
            const pending = works.filter((work) => !existsSync(canonicalPath(runDir, consumedPath(work.work_id))));
            assertWork(pending.length <= 1, 'WORK_QUEUE_AMBIGUOUS', 'multiple unconsumed work items');
            if (pending.length) {
                const work = pending[0];
                if (existsSync(canonicalPath(runDir, orchestrationCommitPath(work.work_id)))) {
                    writer.commitOrchestrationWork(work.work_id);
                    continue;
                }
                assertApplicable(runDir, work);
                if (work.call && !existsSync(canonicalPath(runDir, acceptedPath(work.call.call_id))))
                    return transportAction(runDir, work);
                writer.commitOrchestrationWork(work.work_id);
                continue;
            }
            const state = verifyRunControl(runDir), selected = selectNextWork(loadRun(runDir), execution(state));
            if (selected.kind === 'halt' || selected.kind === 'proposal')
                return selected;
            const work = createWork(runDir, selected, clock);
            if (work.call)
                return transportAction(runDir, work);
            writer.commitOrchestrationWork(work.work_id);
        }
    }, clock);
}
/** Metadata registration only. The next resume derives and journals its
 * canonical preparation effect; callers cannot supply destinations or plans. */
export function proposeOrchestrationSamples(runDir, raw, clock = clockDefault) {
    withOrchestrationLock(runDir, () => {
        const state = verifyRunControl(runDir);
        verifyRetainedRuntimeIdentity(runDir, state);
        const selected = selectNextWork(loadRun(runDir), execution(state));
        assertWork(selected.kind === 'proposal' && selected.operation === 'criteria.samples', 'WORK_PROPOSAL_WINDOW', 'criteria samples are not the first unmet preparation');
        assertWork(allWorkIds(runDir).every((id) => existsSync(canonicalPath(runDir, consumedPath(id)))), 'WORK_PROPOSAL_WINDOW', 'unconsumed work exists');
        criteriaSampleProposal(loadRun(runDir), Buffer.alloc(0), raw);
        immutable(runDir, CRITERIA_SAMPLE_INPUT_PATH, workJson(parseStrictJson(raw)));
    }, clock);
}

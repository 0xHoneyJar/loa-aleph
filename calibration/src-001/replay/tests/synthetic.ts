import { createHash, createPrivateKey, createPublicKey } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resealBundleLock, digestEntries } from '../../../../scripts/lib/bundle-format.ts';
import type { BundleLock } from '../../../../scripts/lib/bundle-format.ts';
import * as H from '../protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/src/index.ts';
import type { ArtifactRef, Data } from '../protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/src/index.ts';

export const REPLAY_ID = 'SYNTHETIC-HARNESS-CONTROL';
export const TIME = '2026-09-14T00:00:00Z';
// Publicly known synthetic test key; never a host or authority credential.
export const PRIVATE_KEY = createPrivateKey({ key: Buffer.from(`302e020100300506032b657004220420${'42'.repeat(32)}`, 'hex'), format: 'der', type: 'pkcs8' });
export const PUBLIC_KEY = createPublicKey(PRIVATE_KEY);
let sampleSequence = 0;
export function sample(rule: Data, artifact?: ArtifactRef, index = 0): any {
  if (rule.$ref) {
    const name = rule.$ref.slice(8);
    if (name === 'artifact-ref' && artifact) return structuredClone(artifact);
    return sample(H.schema.$defs[name], artifact, index);
  }
  if ('const' in rule) return rule.const;
  if (rule.enum) return rule.enum[index % rule.enum.length];
  if (rule.anyOf) return sample(rule.anyOf[0], artifact, index);
  if (rule.type === 'object') return Object.fromEntries(Object.entries(rule.properties).map(([k,v]) => [k, sample(v as Data, artifact, index)]));
  if (rule.type === 'array') return Array.from({ length: rule.minItems || 0 }, (_, n) => sample(rule.items, artifact, n));
  if (rule.type === 'boolean') return true;
  if (rule.type === 'null') return null;
  if (rule.format === 'relative-path') return `SYNTHETIC-file-${sampleSequence++}.txt`;
  if (rule.format === 'absolute-root') return `/replay/SYNTHETIC-root-${sampleSequence++}`;
  if (rule.format === 'utc') return TIME;
  if (rule.pattern?.includes('sha256')) return H.digest(`SYNTHETIC-${sampleSequence++}`);
  if (rule.pattern?.includes('{40}')) return 'a'.repeat(40);
  if (rule.pattern?.includes('SRC001')) return REPLAY_ID;
  if (rule.pattern === '^0[0-7]{3}$') return '0600';
  if (rule.pattern === '^(0|[1-9][0-9]*)$') return String(index);
  if (rule.pattern?.includes('A-Za-z_')) return `SYNTHETIC_VAR_${sampleSequence++}`;
  if (rule.pattern?.includes('A-Za-z0-9+/')) return Buffer.from('SYNTHETIC signature').toString('base64');
  return `SYNTHETIC-value-${sampleSequence++}`;
}
export function make(name: string, artifact: ArtifactRef, overrides: Data = {}): Data {
  return { ...sample(H.schema.$defs[name], artifact), ...overrides };
}
export class Factory {
  root = mkdtempSync(join(tmpdir(), 'SYNTHETIC-src001-'));
  stores = new H.Stores();
  private serial = 0;
  private cache = new Map<string, ArtifactRef>();
  put(name: string, value: unknown): ArtifactRef {
    const bytes = Buffer.isBuffer(value) ? value : H.canonicalBytes(value);
    const identity = `${name}:${H.digest(bytes)}`;
    const old = this.cache.get(identity); if (old) return old;
    const path = join(this.root, `store-${this.serial++}`);
    mkdirSync(path, { mode: 0o700 }); writeFileSync(join(path, name), bytes, { mode: 0o600, flag: 'wx' });
    const store = this.stores.sealSynthetic(path), ref = this.stores.ref(store, name);
    this.cache.set(identity, ref); return ref;
  }
}
export function fixture(options: { replay_id?: string; reference_id?: string; complete?: boolean } = {}) {
  sampleSequence = 0;
  const f = new Factory(), generic = f.put('SYNTHETIC-generic.txt', Buffer.from('SYNTHETIC ordinary generic contract\n'));
  const schemaRef=f.put('SYNTHETIC-pinned-comparison-schema.json',readFileSync(new URL('../protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/schemas/records.schema.json',import.meta.url)));
  const mk = (name: string, overrides: Data = {}) => make(name, generic, overrides);
  const source = readFileSync(new URL('../fixtures/SYNTHETIC-source.txt', import.meta.url));
  const criteria = readFileSync(new URL('../fixtures/SYNTHETIC-criteria.md', import.meta.url));
  const pdf = Buffer.from('%PDF-SYNTHETIC\nopaque artificial upstream fixture\n');
  const sourceRef = f.put('SYNTHETIC-source.txt', source), criteriaRef = f.put('SYNTHETIC-criteria.md', criteria);
  const pdfRef = f.put('SYNTHETIC-upstream.pdf', pdf), originalRef = f.put('SYNTHETIC-original.md', Buffer.concat([criteria, Buffer.from('\n')]));
  const descriptor = H.syntheticDescriptor(REPLAY_ID, source, pdf, sourceRef.path, pdfRef.path, 'SYNTHETIC-preparer');
  const descriptorRef = f.put('SYNTHETIC.aleph-representation.json', descriptor);
  const input = mk('input-lock', { replay_id: REPLAY_ID, entries: [
    { member_path: sourceRef.path, role: 'source', media_type: 'text/plain', artifact_ref: sourceRef },
    { member_path: criteriaRef.path, role: 'criteria', media_type: 'text/markdown', artifact_ref: criteriaRef },
    { member_path: originalRef.path, role: 'provenance-only', media_type: 'text/markdown', artifact_ref: originalRef },
    { member_path: pdfRef.path, role: 'upstream-asset', media_type: 'application/pdf', artifact_ref: pdfRef },
  ], representation_descriptor_ref: descriptorRef, criteria_version: 'SYNTHETIC-criteria-v1' });
  const inputRef = f.put('input-lock.json', input);

  const fileEntry = (path: string, ref: ArtifactRef) => ({ path, type: 'file', mode: '0600', byte_length: ref.byte_length, sha256: ref.sha256 });
  const coreInventory = [fileEntry('core/SYNTHETIC-contract.txt', generic)];
  const runtimeInventory = [fileEntry('runtime-js/SYNTHETIC-projection.mjs', generic)];
  const loaInventory = [...coreInventory, fileEntry('loa/SYNTHETIC-runtime.txt', generic), ...runtimeInventory];
  const rawCommit = `tree ${'b'.repeat(40)}\nauthor SYNTHETIC <fixture@example.invalid> 0 +0000\ncommitter SYNTHETIC <fixture@example.invalid> 0 +0000\n\nSYNTHETIC selector fixture\n`;
  const selectorCommit = createHash('sha1').update(`commit ${Buffer.byteLength(rawCommit)}\0${rawCommit}`).digest('hex');
  const vcs = { kind: 'git-dependency-closure-snapshot', object_format: 'sha1', commit: selectorCommit,
    commit_object: Buffer.from(rawCommit).toString('base64'), commit_tree: 'b'.repeat(40), resolved: true, mutable_ref: null, worktree_state: 'clean' };
  const files = loaInventory.map((e, i) => ({ path: e.path, classification: i === 0 ? 'core' : 'adapter', digest: e.sha256 }));
  const lock = resealBundleLock({
    lock_format: 'aleph-bundle-lock/v1', digest_algorithm: 'sha256-path-file-digest-v1', lock_digest: H.digest('unset'),
    bundle: { id: 'aleph-for-loa', version: 'SYNTHETIC-fixture', payload_digest: digestEntries(files), digest: H.digest('unset') },
    core: { id: 'SYNTHETIC-core', version: '0.1.0-provisional', tree_digest: digestEntries(files.slice(0,1)) },
    adapter: { id: 'loa', version: 'SYNTHETIC-fixture', lifecycle: 'implemented', tree_digest: digestEntries(files.slice(1)) },
    checker_digest: generic.sha256, adapter_protocol_version: '1.0.0-provisional', run_format_version: '1.8.0-provisional',
    source: { manifest_projection: { synthetic_fixture: true } as any, manifest_projection_digest: H.digest('unset'),
      assembly_tool: { path: generic.path, digest: generic.sha256 } },
    provenance: { format: 'aleph-source-provenance/v1', vcs: vcs as any, digest: H.digest('unset') }, files,
  } as BundleLock);
  const lockRef = f.put('bundle.lock.json', lock);
  const archiveRef = f.put('SYNTHETIC-release.tar.gz', Buffer.from('SYNTHETIC archive receipt bytes; no canonical release built\n'));
  const build = mk('build', {
    build_id: 'A', checkout_identity: H.digest('SYNTHETIC-build-A'),
    actual_build_checkout_commit: H.CANONICAL_BASE.commit, actual_build_checkout_tree: H.CANONICAL_BASE.tree,
    clean: true, full_history: true, replacements: [], selector_commit: selectorCommit, selector_tree: vcs.commit_tree,
    selector_commit_object_ref: f.put('SYNTHETIC-commit.raw', Buffer.from(rawCommit)),
    selector_ancestry_ref: f.put('SYNTHETIC-ancestry.json', { selector_commit: selectorCommit, canonical_commit: H.CANONICAL_BASE.commit, is_ancestor: true }),
    dependency_closure_commit: selectorCommit, dependency_closure_tree: vcs.commit_tree,
    core_inventory: coreInventory, loa_inventory: loaInventory, hermes_inventory: coreInventory, runtime_inventory: runtimeInventory,
    core_digest: lock.core.tree_digest, adapter_digest: lock.adapter.tree_digest, checker_digest: lock.checker_digest,
    protocol_digest: generic.sha256, payload_digest: lock.bundle.payload_digest, lock_file_ref: lockRef, internal_lock_digest: lock.lock_digest,
    bundle_digest: lock.bundle.digest, selected_projection_ref: f.put('SYNTHETIC-projection.json', lock.source.manifest_projection),
    provenance_ref: f.put('SYNTHETIC-provenance.json', lock.provenance), provenance_digest: lock.provenance.digest,
    archive_ref: archiveRef, archive_inventory: loaInventory,
    sidecar_ref: f.put('SYNTHETIC-release.sha256', Buffer.from(`${archiveRef.sha256.slice(7)}  ${archiveRef.path}\n`)),
    release_metadata_ref: f.put('SYNTHETIC-release.metadata.json', { source: { build_commit: selectorCommit, dependency_closure_commit: selectorCommit } }),
  });
  const release = mk('release-lock', { replay_id: REPLAY_ID, canonical_base: H.CANONICAL_BASE,
    targets: [{ target_id: 'aleph-for-loa', version: 'SYNTHETIC-fixture' }, { target_id: 'aleph-for-hermes', version: 'SYNTHETIC-fixture' }],
    builds: [build, { ...structuredClone(build), build_id: 'B', checkout_identity: H.digest('SYNTHETIC-build-B') }],
    installed_lock_ref: lockRef, run_lock_ref: lockRef, runtime_inventory: runtimeInventory });
  const releaseRef = f.put('release-lock.json', release);
  const mode = mk('execution-mode', { replay_id: REPLAY_ID, mode: 'agent', sanction_status: 'experimental/unsanctioned', evidence_kind: 'native-dispatch' });
  const modeRef = f.put('execution-mode.json', mode);
  const denyProbe = { namespace: 'SYNTHETIC-worker', route: '/withheld/SYNTHETIC-canary', operation: 'read', result: 'DENIED', evidence_ref: generic };
  const mount = { source_identity: H.digest('SYNTHETIC-image'), destination: '/worker', mode: 'read-only', inventory_ref: generic, principal: 'SYNTHETIC-worker' };
  const env = mk('environment', { replay_id: REPLAY_ID, mounts: [mount], inventory_ref: generic,
    roots: ['/replay/inputs','/replay/release','/replay/loa','/replay/recorder','/replay/evidence'],
    native_binding: { node_ref: generic, claude_code_ref: generic, bubblewrap_ref: generic, profile_ref: generic,
      provider: 'SYNTHETIC-provider', model_id: 'SYNTHETIC-model', role_context_effort_ref: generic,
      attestation_ref: generic, no_fallback: true, dispatch_refs: [] }, manual_binding: null, variables: [],
    empty_home: true, empty_sessions: true, empty_config: true, probe_receipts: [denyProbe] });
  const envRef = f.put('environment-manifest.json', env);
  const observation = mk('workspace-observation', { replay_id: REPLAY_ID, environment_digest: envRef.sha256,
    expected_inventory_ref: generic, observed_inventory_ref: generic, expected_mounts: [mount], observed_mounts: [mount],
    expected_channels: ['filesystem','mounts','environment','fds','binaries'], observed_channels: ['filesystem','mounts','environment','fds','binaries'],
    inherited_sessions: [], probe_receipts: [denyProbe] });
  const role = { stage: 'S2', role: 'SYNTHETIC-extractor', contract_ref: generic, prompt_selectors: ['SYNTHETIC-whole-contract'],
    output_contract_ref: generic, input_classes: ['source','criteria','generic'], task_contract_ref: generic };
  const visibility = mk('visibility', { replay_id: REPLAY_ID, environment_manifest_ref: envRef, input_lock_ref: inputRef, release_lock_ref: releaseRef,
    roots: env.roots, policy_ref: generic,
    allowed_entries: [
      { entry_id: 'SYNTHETIC-source', artifact_ref: sourceRef, class: 'source', consumers: [role.role], access: 'read-only', origin: 'frozen-input', derivation_ref: null },
      { entry_id: 'SYNTHETIC-criteria', artifact_ref: criteriaRef, class: 'criteria', consumers: [role.role], access: 'read-only', origin: 'frozen-input', derivation_ref: null },
      { entry_id: 'SYNTHETIC-generic', artifact_ref: generic, class: 'generic', consumers: [role.role], access: 'read-only', origin: 'generic-release', derivation_ref: null },
    ], derivation_rules: [], role_rules: [role],
    withheld_classes: H.WITHHELD_CLASSES.map((class_id) => ({ class_id, selectors: [`withheld/${class_id}/`],
      opaque_digests: [H.digest(`SYNTHETIC FORBIDDEN ${class_id}`)], exclusion_rule: 'allowlist-origin-closure' })) });
  const visibilityRef = f.put('visibility-manifest.json', visibility);
  const parts = [
    { channel: 'role', entry_id: 'SYNTHETIC-generic', run_path: generic.path, materialized_path: generic.path, artifact_ref: generic },
    { channel: 'attachment', entry_id: 'SYNTHETIC-source', run_path: sourceRef.path, materialized_path: sourceRef.path, artifact_ref: sourceRef },
  ];
  const submitted = f.put('SYNTHETIC-submission.raw', Buffer.concat([f.stores.read(generic), source]));
  const serialization = f.put('SYNTHETIC-serialization.json', { algorithm: 'recorded-pinned-host-reproduction/v1',
    parts_digest: H.digest(H.canonicalBytes(parts)), reproduced_submission_ref: submitted });
  const delivery = mk('delivery', { invocation_id: 'SYNTHETIC-call-1', run_id: 'SYNTHETIC-run', context_id: 'SYNTHETIC-context',
    producer_context_id: 'SYNTHETIC-producer-context', role: role.role, stage: role.stage, model_id: 'SYNTHETIC-model',
    environment_digest: envRef.sha256, visibility_digest: visibilityRef.sha256, parts, submitted_ref: submitted,
    serialization_contract_ref: serialization, fresh_context: true, inherited_context: false,
    execution_class: 'synthetic', recorded_execution_class: 'synthetic', output_contract_ref: generic });
  delivery.context_receipt_ref = f.put('SYNTHETIC-context.json', { invocation_id: delivery.invocation_id, context_id: delivery.context_id,
    execution_class: 'synthetic', submitted_sha256: submitted.sha256, environment_digest: envRef.sha256,
    fresh_context: true, inherited_context: false });
  const { recorder_observation_ref: discarded, ...actual } = delivery; void discarded;
  delivery.recorder_observation_ref = f.put('SYNTHETIC-recorder-observation.json', actual);
  const trust: H.VisibilityTrust = { initial_refs: [sourceRef,criteriaRef,generic], receipt_refs: [delivery.recorder_observation_ref],
    policy_ref: generic, role_rules: [role], derivation_rules: [] };
  const outcome = mk('outcome', { replay_id: REPLAY_ID, mechanical_integrity: 'PASS', execution: options.complete ? 'COMPLETED_TO_DECLARED_ENDPOINT' : 'HALTED', completion: options.complete ? 'COMPLETE_TO_DECLARED_ENDPOINT' : 'INCOMPLETE',
    core_checker_result: 'NOT_RUN', core_state: 'SYNTHETIC-HALTED', stage: 'S2', blocking_codes: options.complete ? [] : ['BLOCKED_F03_PRODUCTION_REACHABILITY'],
    non_claims: [...H.NON_CLAIMS] });
  const execution = mk('execution-evidence', { replay_id: REPLAY_ID, mode_ref: modeRef, declared_execution_class: 'synthetic',
    deliveries: [delivery], manual_passes: [], accepted_return_refs: [generic], quarantined_return_refs: [generic],
    production_effect_refs: options.complete ? [generic] : [], completion_evidence_ref: options.complete ? generic : null, no_fallback: true });
  const events: Data[] = [];
  function event(kind: string, refs: ArtifactRef[] = [], actor = 'SYNTHETIC-recorder'): Data {
    const e = { format: 'src001-replay-event/v1', replay_id: REPLAY_ID, sequence: String(events.length),
      previous_event_digest: events.length ? H.digest(H.canonicalBytes(events.at(-1))) : null,
      utc_time: TIME, actor, event_kind: kind, artifact_refs: refs };
    events.push(e); return e;
  }
  event('origin'); const stop = event('production-stop');
  const stopRef = f.put('production-stop.json', stop);
  const artifactContract = f.put('SYNTHETIC-stage-contract.json', { run_format: '1.8.0-provisional', stage: 'S2',
    paths: [{ path: 'control/run-state.json', status: 'present' }, { path: 'ledgers/claims.md', status: options.complete ? 'present' : 'missing-due' }] });
  const resultRoot = join(f.root, 'result');
  mkdirSync(join(resultRoot, 'run/control'), { recursive: true, mode: 0o700 });
  mkdirSync(join(resultRoot, 'run/quarantine/empty'), { recursive: true, mode: 0o700 });
  mkdirSync(join(resultRoot, 'execution-evidence'), { recursive: true, mode: 0o700 });
  const state = H.canonicalBytes({ fixture: 'SYNTHETIC', run_id: 'SYNTHETIC-run', state: 'HALTED', stage: 'S2' });
  writeFileSync(join(resultRoot, 'run/control/run-state.json'), state, { mode: 0o600 });
  writeFileSync(join(resultRoot, 'run/.hidden'), 'SYNTHETIC hidden evidence\n', { mode: 0o600 });
  writeFileSync(join(resultRoot, 'run/quarantine/accepted-return.json'), H.canonicalBytes({ fixture: 'SYNTHETIC', ledger_write: false }), { mode: 0o600 });
  writeFileSync(join(resultRoot, 'run/control/pending-journal.json'), H.canonicalBytes({ fixture: 'SYNTHETIC', pending: true }), { mode: 0o600 });
  const replayRecordBytes = Buffer.from(`{ \"id\": \"${options.replay_id || 'local-red'}\", \"observation\": \"lantern beside cube\" }\n`);
  writeFileSync(join(resultRoot, 'run/SYNTHETIC-replay-record.json'), replayRecordBytes, { mode: 0o600 });
  writeFileSync(join(resultRoot, 'run/SYNTHETIC-replay-record-2.json'),
    Buffer.from(`{"id":"${options.replay_id || 'local-red'}-second","observation":"drawer contents unobserved"}\n`), { mode: 0o600 });
  if (options.complete) {
    mkdirSync(join(resultRoot, 'run/ledgers'), { mode: 0o700 });
    writeFileSync(join(resultRoot, 'run/ledgers/claims.md'), 'SYNTHETIC artificial endpoint artifact\n', { mode: 0o600 });
  }
  const leak = mk('leak-check', { replay_id: REPLAY_ID, checks: ['R03','R04','R05'].map((check_id) => ({
    check_id, phase: 'evaluation-freeze', workspace_digest: envRef.sha256, context_digest: visibilityRef.sha256,
    observations: ['SYNTHETIC recorded boundary check'], evidence_refs: [generic], result: 'PASS' })), non_claims: H.NON_CLAIMS });
  for (const [name,value] of Object.entries({ 'input-lock.json': input, 'release-lock.json': release, 'execution-mode.json': mode,
    'environment-manifest.json': env, 'visibility-manifest.json': visibility, 'outcome.json': outcome,
    'execution-evidence.json': execution, 'leak-check.json': leak, 'events.json': events })) {
    writeFileSync(join(resultRoot, 'execution-evidence', name), H.canonicalBytes(value), { mode: 0o600 });
  }
  f.stores = f.stores.copySyntheticStores(join(resultRoot, 'execution-evidence/stores'));
  const snapshotId = f.stores.sealSynthetic(resultRoot);
  const snap = (path: string) => f.stores.ref(snapshotId, path);
  const inv = H.inventoryRecord(resultRoot, REPLAY_ID);
  const inventoryRef = f.put('replay-inventory.json', inv);
  const canonicalIndex = mk('canonical-artifact-index', { replay_id: REPLAY_ID, stage: 'S2', contract_ref: artifactContract,
    artifacts: [{ path: 'control/run-state.json', status: 'present', sha256: H.digest(state) }, { path: 'ledgers/claims.md',
      status: options.complete ? 'present' : 'missing-due', sha256: options.complete ? H.digest('SYNTHETIC artificial endpoint artifact\n') : null }] });
  const ledgerIndex = mk('ledger-index', { replay_id: REPLAY_ID, mode: 'agent', ledgers: [],
    ledger_chain_head: H.digest('SYNTHETIC empty chain'), transaction_inventory_ref: snap('run/control/pending-journal.json'), adapter_applicability: 'applicable' });
  const quiescence = mk('quiescence', { replay_id: REPLAY_ID, production_stop_ref: stopRef,
    terminated_contexts: ['SYNTHETIC-context'], remaining_contexts: [], open_writers: [], sealed_source: true,
    custody_inventory_digest: inv.inventory_digest, source_inventory_digest: inv.inventory_digest });
  const freeze = mk('freeze', { replay_id: REPLAY_ID, run_id: 'SYNTHETIC-run', planned_endpoint: options.complete ? 'SYNTHETIC-S2-ENDPOINT' : 'S12',
    observed_endpoint: options.complete ? 'SYNTHETIC-S2-ENDPOINT' : 'S2 blocked',
    input_lock_ref: snap('execution-evidence/input-lock.json'), release_lock_ref: snap('execution-evidence/release-lock.json'),
    execution_mode_ref: snap('execution-evidence/execution-mode.json'), environment_manifest_ref: snap('execution-evidence/environment-manifest.json'),
    visibility_manifest_ref: snap('execution-evidence/visibility-manifest.json'), run_state_ref: snap('run/control/run-state.json'),
    canonical_artifact_index_ref: f.put('canonical-artifact-index.json', canonicalIndex), ledger_index_ref: f.put('ledger-index.json', ledgerIndex),
    outcome_ref: snap('execution-evidence/outcome.json'), execution_evidence_index_ref: snap('execution-evidence/execution-evidence.json'),
    final_leak_check_ref: snap('execution-evidence/leak-check.json'), quiescence_receipt_ref: f.put('quiescence.json', quiescence),
    snapshot_storage_identity: snapshotId, replay_inventory_ref: inventoryRef, replay_inventory_digest: inv.inventory_digest,
    event_log_cut: { sequence: stop.sequence, head_digest: H.digest(H.canonicalBytes(stop)) }, frozen_at: TIME,
    authority_identity: 'SYNTHETIC-freeze-authority', recorder_identity: 'SYNTHETIC-recorder' });
  const freezeRef = f.put('freeze.payload.json', freeze);
  const attestation = H.syntheticAttestation(freeze, PRIVATE_KEY);
  const freezeEvidence = { stores: f.stores, result_root: resultRoot, events: structuredClone(events), attestation,
    detached_digest: Buffer.from(`${freezeRef.sha256.slice(7)}\n`), trusted_public_key: PUBLIC_KEY };
  const freezeEventRef = f.put('evaluation-freeze.json', event('evaluation-freeze', [freezeRef]));
  const grantEventRef = f.put('reference-grant.json', event('reference-grant', [freezeRef]));
  const openEventRef = f.put('reference-open.json', event('reference-open', [freezeRef]));
  const startEventRef = f.put('comparison-start.json', event('comparison-start', [freezeRef], 'SYNTHETIC-comparator'));
  const access = mk('access-receipt', { replay_id: REPLAY_ID, comparison_id: 'SYNTHETIC-comparison',
    freeze_receipt_sha256: freezeRef.sha256, freeze_event_ref: freezeEventRef, grant_event_ref: grantEventRef, first_open_event_ref: openEventRef,
    comparator_identity: 'SYNTHETIC-comparator', context_id: 'SYNTHETIC-comparator-context', fresh_context: true, inherited_context: false,
    replay_access: 'read-only', writable_aliases: [], writer_credentials: [], probe_receipts: [{ ...denyProbe, operation: 'write' }] });
  const referenceRecord = f.put('SYNTHETIC-reference-record.json', Buffer.from(`{ \"id\": \"${options.reference_id || 'independent-blue'}\", \"observation\": \"lantern beside cube\" }\n`));
  const referenceRecord2 = f.put('SYNTHETIC-reference-record-2.json',
    Buffer.from(`{"id":"${options.reference_id || 'independent-blue'}-second","observation":"drawer contents unobserved"}\n`));
  const referenceLock = mk('reference-lock', { replay_id: REPLAY_ID, members: [
    { role: 'human-reference', artifact_ref: referenceRecord, authority_refs: [generic] },
    { role: 'human-reference', artifact_ref: referenceRecord2, authority_refs: [generic] }] });
  const referenceRef = f.put('SYNTHETIC-reference-lock.json', referenceLock);
  const comparison = mk('comparison-manifest', { comparison_id: access.comparison_id, comparator_identity: access.comparator_identity,
    context_id: access.context_id, fresh_context: true, inherited_context: false, freeze_receipt_sha256: freezeRef.sha256,
    replay_inventory_digest: inv.inventory_digest, replay_id: REPLAY_ID, run_id: freeze.run_id, reference_lock_ref: referenceRef,
    access_receipt_ref: f.put('access-receipt.json', access), start_event_ref: startEventRef,comparison_schema_ref:schemaRef });
  const replayRecord = snap('run/SYNTHETIC-replay-record.json');
  const anchor = { source_ref: sourceRef, source_sha256: sourceRef.sha256, scheme: 'md-lines', locator: 'L1-L1',
    byte_ranges: [{ start: '0', end: String(source.indexOf(10) + 1) }], selected_sha256: H.digest(source.subarray(0, source.indexOf(10) + 1)), unavailable_reason: null };
  const selector = { kind: 'json-pointer', locator: '/observation', selected_sha256: H.digest(Buffer.from('\"lantern beside cube\"')) };
  const secondAnchor = { ...anchor, locator: 'L2-L2', byte_ranges: [{start:String(source.indexOf(10)+1),end:String(source.length)}],
    selected_sha256:H.digest(source.subarray(source.indexOf(10)+1)) };
  const secondSelector = { ...selector, selected_sha256:H.digest('"drawer contents unobserved"') };
  const secondEvidence = [
    {artifact_ref:snap('run/SYNTHETIC-replay-record-2.json'),record_selector:secondSelector,native_id:`${options.replay_id || 'local-red'}-second`,source_anchors:[secondAnchor]},
    {artifact_ref:referenceRecord2,record_selector:secondSelector,native_id:`${options.reference_id || 'independent-blue'}-second`,source_anchors:[secondAnchor]},
  ];
  const mapping = mk('mapping', { comparison_id: comparison.comparison_id, mapping_id: 'SYNTHETIC-mapping-1', replay_id: REPLAY_ID,
    freeze_receipt_sha256: freezeRef.sha256, replay_inventory_digest: inv.inventory_digest, reference_lock_sha256: referenceRef.sha256,
    record_kind: 'claim', replay_evidence: [{ artifact_ref: replayRecord, record_selector: selector, native_id: options.replay_id || 'local-red', source_anchors: [anchor] }],
    reference_evidence: [{ artifact_ref: referenceRecord, record_selector: selector, native_id: options.reference_id || 'independent-blue', source_anchors: [anchor] }],
    correspondence: 'CANNOT_DETERMINE', comparison_basis: [{ artifact_ref: replayRecord, record_selector: selector, basis_kind: 'record-field' }],
    explanation: 'Synthetic unresolved comparative judgment; no semantic truth is supplied.', uncertainty_refs: ['SYNTHETIC-finding'] });
  const common = { comparison_id: comparison.comparison_id, freeze_receipt_sha256: freezeRef.sha256, replay_inventory_digest: inv.inventory_digest,
    reference_lock_sha256: referenceRef.sha256, schema_sha256: schemaRef.sha256, author: comparison.comparator_identity,
    context_id: comparison.context_id, creation_event_ref: startEventRef, findings: ['SYNTHETIC-finding'], mechanical_validation: 'PASS' };
  const exact = mk('exact-byte-report', { ...common, rows: [{ proposition: 'evidence-byte-reopening', result: 'PASS', evidence_refs: [sourceRef],
    mapping_refs: [mapping.mapping_id], reason: 'Synthetic selected bytes reopen.' }] });
  const structural = mk('structural-report', { ...common, reached_stage: outcome.stage, rows: [{ proposition: 'reached-stage-accounting',
    result: 'CANNOT_DETERMINE', evidence_refs: [sourceRef], mapping_refs: [mapping.mapping_id], reason: 'Synthetic halted stage; later effects not reached.' }] });
  const semantic = mk('semantic-report', { ...common, rows: [{ mapping_ref: mapping.mapping_id, assessment: 'CANNOT_DETERMINE',
    evidence_refs: [sourceRef], reason: mapping.explanation }], metrics: [H.mappingCounts([mapping], outcome.stage)],
    non_claims: ['Comparative judgments are not deterministic truth or Core acceptance.'] });
  const finding = { finding_id: 'SYNTHETIC-finding', class: 'unreached-stage', mapping_refs: [mapping.mapping_id], evidence_refs: [sourceRef],
    assessment: 'CANNOT_DETERMINE', reason: 'Synthetic next stage was not reached.', required_evidence: ['Separately authorized later evidence'],
    carried_finding_refs: ['F-03 OPEN / MUST PRESERVE'], proposed_followup: 'Retain incomplete result; no repair or replay authorized.' };
  const uncertainty = mk('uncertainty-and-findings', { comparison_id: comparison.comparison_id, freeze_receipt_sha256: freezeRef.sha256, records: [finding] });
  return { f, generic, source, criteria, sourceRef, descriptor, input, trustedInput: structuredClone(input), trustedEnvironmentDigest: envRef.sha256,
    release, env, observation, mode, visibility, trust, delivery, execution, outcome,
    resultRoot, inv, events, freeze, freezeEvidence, access, comparison, mapping, secondEvidence, exact, structural, semantic, uncertainty, denyProbe, mk };
}
export type Fixture = ReturnType<typeof fixture>;
export function runChecks(c: Fixture): H.CheckResult[] {
  return [
    H.check('R01', () => H.inputIdentity(c.input, c.f.stores, c.trustedInput)),
    H.check('R02', () => H.releaseIdentity(c.release, c.f.stores)),
    H.check('R03', () => H.workspaceClosure(c.env,c.observation,c.f.stores,c.trustedEnvironmentDigest)),
    H.check('R04', () => H.deliveredContext(c.visibility,[c.delivery],c.f.stores,c.trust)),
    H.check('R05', () => H.executionHonesty(c.mode,c.execution,c.outcome,c.f.stores)),
    H.check('R06', () => H.evaluationFreeze(c.freeze,c.freezeEvidence)),
    H.check('R07', () => H.chronology(c.freeze,c.access,c.comparison,c.events,c.freezeEvidence)),
    H.check('R08', () => H.mappings([c.mapping],c.comparison,c.f.stores)),
    H.check('R09', () => H.reports(c.exact,c.structural,c.semantic,c.uncertainty,[c.mapping],c.comparison,c.outcome,c.f.stores)),
  ];
}

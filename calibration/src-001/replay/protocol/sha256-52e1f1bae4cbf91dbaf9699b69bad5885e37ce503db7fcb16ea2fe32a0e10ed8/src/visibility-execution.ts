import { artifactRefs, canonicalBytes, digest, parseRecord, parseStrictJson, requireFact, same, validateRecord } from './records.ts';
import type { ArtifactRef, Data } from './records.ts';
import type { Stores } from './storage.ts';

export const WITHHELD_CLASSES = [
  'human-answer-inventory', 'original-delta-conclusions', 'independent-audit-conclusions',
  'correction-addendum-overlay', 'expected-identities-outcomes', 'decision-correction-close-events',
  'evaluation-artifacts', 'inherited-context',
];
const key = (ref: ArtifactRef) => canonicalBytes(ref).toString();
export function workspaceClosure(environment: Data, observation: Data, stores: Stores, trustedEnvironmentDigest: string): void {
  validateRecord('environment', environment); validateRecord('workspace-observation', observation);
  requireFact(environment.replay_id === observation.replay_id && digest(canonicalBytes(environment)) === trustedEnvironmentDigest
    && observation.environment_digest === trustedEnvironmentDigest, 'FAIL_CONTEXT_LEAK', 'environment identity differs');
  requireFact(environment.empty_home && environment.empty_sessions && environment.empty_config
    && observation.inherited_sessions.length === 0, 'FAIL_CONTEXT_LEAK', 'inherited environment/session');
  requireFact(environment.native_binding === null !== (environment.manual_binding === null),
    'FAIL_CONTEXT_LEAK', 'exactly one environment execution binding');
  if (environment.native_binding) requireFact(environment.native_binding.no_fallback, 'FAIL_CONTEXT_LEAK', 'native fallback');
  for (const variable of environment.variables) requireFact(!variable.secret || (variable.nonsecret_value === null
    && variable.broker_permission_ref !== null), 'FAIL_CONTEXT_LEAK', 'secret value or missing permission identity');
  for (const ref of artifactRefs(environment)) stores.read(ref);
  requireFact(same(observation.expected_inventory_ref, environment.inventory_ref)
    && stores.read(observation.expected_inventory_ref).equals(stores.read(observation.observed_inventory_ref))
    && same(observation.expected_mounts, environment.mounts)
    && same(observation.expected_mounts, observation.observed_mounts)
    && same(observation.expected_channels, observation.observed_channels),
  'FAIL_CONTEXT_LEAK', 'unrecorded file/mount/config/FD/binary/channel ingress');
  for (const probe of [...environment.probe_receipts, ...observation.probe_receipts]) {
    stores.read(probe.evidence_ref);
    requireFact(probe.result === 'DENIED', 'FAIL_CONTEXT_LEAK', `forbidden route reachable or unmeasured: ${probe.route}`);
  }
}
export interface VisibilityTrust {
  initial_refs: ArtifactRef[];
  receipt_refs: ArtifactRef[];
  policy_ref: ArtifactRef;
  role_rules: Data[];
  derivation_rules: Data[];
}
export function visibilityClosure(manifest: Data, stores: Stores, trust: VisibilityTrust): Map<string, Data> {
  validateRecord('visibility', manifest);
  requireFact(same(manifest.policy_ref, trust.policy_ref) && same(manifest.role_rules, trust.role_rules)
    && same(manifest.derivation_rules, trust.derivation_rules), 'FAIL_CONTEXT_LEAK', 'unapproved role/policy/derivation contract');
  requireFact(same(manifest.withheld_classes.map((c: Data) => c.class_id).sort(), [...WITHHELD_CLASSES].sort()),
    'FAIL_CONTEXT_LEAK', 'withheld class catalog incomplete or duplicate');
  const forbidden = new Set(manifest.withheld_classes.flatMap((c: Data) => c.opaque_digests));
  const entries = new Map<string, Data>(), byArtifact = new Map<string, Data>();
  for (const entry of manifest.allowed_entries) {
    requireFact(!entries.has(entry.entry_id) && !byArtifact.has(key(entry.artifact_ref)),
      'FAIL_CONTEXT_LEAK', 'duplicate/alias visibility entry');
    requireFact(!forbidden.has(entry.artifact_ref.sha256), 'FAIL_CONTEXT_LEAK', 'forbidden opaque digest');
    stores.read(entry.artifact_ref); entries.set(entry.entry_id, entry); byArtifact.set(key(entry.artifact_ref), entry);
  }
  const initial = new Set(trust.initial_refs.map(key)), receipts = new Set(trust.receipt_refs.map(key));
  const visiting = new Set<string>(), done = new Set<string>();
  function visit(entry: Data): void {
    if (done.has(entry.entry_id)) return;
    requireFact(!visiting.has(entry.entry_id), 'FAIL_CONTEXT_LEAK', 'cyclic origin graph');
    visiting.add(entry.entry_id);
    if (entry.derivation_ref === null) {
      requireFact(initial.has(key(entry.artifact_ref)) && ['frozen-input', 'generic-release', 'mechanical-environment'].includes(entry.origin),
        'FAIL_CONTEXT_LEAK', `unapproved initial origin: ${entry.entry_id}`);
    } else {
      const derivation = parseRecord('derivation', stores.read(entry.derivation_ref));
      const rule = manifest.derivation_rules.find((r: Data) => r.rule_id === derivation.rule_id);
      requireFact(rule && derivation.replay_id === manifest.replay_id && same(derivation.output_ref, entry.artifact_ref)
        && rule.producing_principal === derivation.producer && rule.output_class === entry.class
        && same(rule.contract_ref, derivation.operation_ref) && receipts.has(key(derivation.invocation_or_gate_ref)),
      'FAIL_CONTEXT_LEAK', 'unrecorded derivation operation/invocation');
      for (const input of derivation.input_refs) {
        const parent = byArtifact.get(key(input));
        requireFact(parent && rule.input_classes.includes(parent.class), 'FAIL_CONTEXT_LEAK', 'unapproved derivation input');
        visit(parent);
      }
      stores.read(derivation.invocation_or_gate_ref);
    }
    visiting.delete(entry.entry_id); done.add(entry.entry_id);
  }
  for (const entry of entries.values()) visit(entry);
  return entries;
}
export function visibilityGenerations(generations: Data[], stores: Stores): void {
  let previous: string | null = null;
  generations.forEach((generation, index) => {
    validateRecord('visibility-generation', generation);
    requireFact(generation.generation === String(index) && generation.previous_digest === previous,
      'FAIL_CONTEXT_LEAK', 'visibility generation fork/mutation');
    for (const ref of artifactRefs(generation)) stores.read(ref);
    previous = digest(canonicalBytes(generation));
  });
}
export function deliveredContext(manifest: Data, deliveries: Data[], stores: Stores, trust: VisibilityTrust): void {
  const entries = visibilityClosure(manifest, stores, trust), receipts = new Set(trust.receipt_refs.map(key));
  const calls = new Set<string>(), contexts = new Set<string>();
  for (const delivery of deliveries) {
    validateRecord('delivery', delivery);
    requireFact(!calls.has(delivery.invocation_id) && !contexts.has(delivery.context_id), 'FAIL_CONTEXT_LEAK', 'reused invocation/context');
    calls.add(delivery.invocation_id); contexts.add(delivery.context_id);
    requireFact(delivery.fresh_context && !delivery.inherited_context && delivery.context_id !== delivery.producer_context_id,
      'FAIL_CONTEXT_LEAK', 'inherited or non-fresh context');
    requireFact(delivery.visibility_digest === digest(canonicalBytes(manifest))
      && delivery.environment_digest === manifest.environment_manifest_ref.sha256,
    'FAIL_CONTEXT_LEAK', 'delivery environment/visibility binding');
    const role = manifest.role_rules.find((r: Data) => r.role === delivery.role && r.stage === delivery.stage);
    requireFact(role && same(role.output_contract_ref, delivery.output_contract_ref), 'FAIL_CONTEXT_LEAK', 'role/output contract');
    const seen = new Set<string>();
    for (const part of delivery.parts) {
      const entry = entries.get(part.entry_id);
      requireFact(entry && !seen.has(`${part.channel}:${part.materialized_path}`) && entry.consumers.includes(delivery.role)
        && same(entry.artifact_ref, part.artifact_ref)
        && (role.input_classes.includes(entry.class) || ['system','role','stage','output-contract'].includes(part.channel)),
      'FAIL_CONTEXT_LEAK', 'unlisted/forbidden task, prompt or attachment');
      seen.add(`${part.channel}:${part.materialized_path}`);
      try { stores.read(part.artifact_ref); } catch { requireFact(false, 'FAIL_CONTEXT_LEAK', 'attachment swapped after sealing'); }
    }
    requireFact(receipts.has(key(delivery.recorder_observation_ref)), 'BLOCKED_CONTEXT_EVIDENCE', 'no independently retained recorder observation');
    const recorded = parseStrictJson(stores.read(delivery.recorder_observation_ref)) as Data;
    const { recorder_observation_ref: omitted, ...projection } = delivery;
    void omitted;
    requireFact(same(recorded, projection), 'FAIL_CONTEXT_LEAK', 'actual recorder submission/context receipt differs');
    // Recorder captures and independently reproduced serialization must both be retained.
    const serialization = parseStrictJson(stores.read(delivery.serialization_contract_ref)) as Data;
    requireFact(same(Object.keys(serialization).sort(), ['algorithm','parts_digest','reproduced_submission_ref'].sort())
      && serialization.algorithm === 'recorded-pinned-host-reproduction/v1'
      && serialization.parts_digest === digest(canonicalBytes(delivery.parts))
      && stores.read(serialization.reproduced_submission_ref).equals(stores.read(delivery.submitted_ref)),
    'BLOCKED_CONTEXT_EVIDENCE', 'missing or differing independently reproduced host submission');
    const context = parseStrictJson(stores.read(delivery.context_receipt_ref)) as Data;
    requireFact(same(context, { invocation_id: delivery.invocation_id, context_id: delivery.context_id,
      execution_class: delivery.recorded_execution_class, submitted_sha256: delivery.submitted_ref.sha256,
      environment_digest: delivery.environment_digest, fresh_context: true, inherited_context: false }),
    'FAIL_CONTEXT_LEAK', 'context receipt does not bind actual submission');
    requireFact(delivery.execution_class === delivery.recorded_execution_class, 'FAIL_CONTEXT_LEAK', 'execution class upgrade');
    for (const ref of artifactRefs(delivery)) stores.read(ref);
  }
}
export function gateProjection(gate: Data, stores: Stores, trustedGateRefs: ArtifactRef[]): void {
  validateRecord('gate-projection', gate);
  requireFact(trustedGateRefs.some((r) => same(r, gate.request_ref)), 'FAIL_CONTEXT_LEAK', 'gate request not independently recorded');
  requireFact(gate.projected_fields.every((f: string) => gate.allowed_fields.includes(f)), 'FAIL_CONTEXT_LEAK', 'unauthorized gate projection fields');
  if (gate.stage === 'S0') requireFact(gate.allowed_fields.every((f: string) =>
    ['scope','exclusions','sensitivity','authority_identity','freeze','criteria_ref'].includes(f)), 'FAIL_CONTEXT_LEAK', 'S0 semantic ingress');
  const projection = parseStrictJson(stores.read(gate.projected_ref)) as Data;
  requireFact(same(Object.keys(projection).sort(), [...gate.projected_fields].sort()), 'FAIL_CONTEXT_LEAK', 'actual gate projection mismatch');
  for (const ref of artifactRefs(gate)) stores.read(ref);
}
export function executionHonesty(mode: Data, execution: Data, outcome: Data, stores: Stores): void {
  validateRecord('execution-mode', mode); validateRecord('execution-evidence', execution); validateRecord('outcome', outcome);
  requireFact(mode.replay_id === execution.replay_id && mode.replay_id === outcome.replay_id
    && execution.no_fallback, 'BLOCKED_EXECUTION_MODE_POLICY', 'mode identity or fallback');
  const native = mode.mode === 'agent';
  requireFact(mode.sanction_status === (native ? 'experimental/unsanctioned' : 'sanctioned-manual-path')
    && mode.evidence_kind === (native ? 'native-dispatch' : 'manual-separate-pass'),
  'BLOCKED_EXECUTION_MODE_POLICY', 'mode/sanction/evidence disagreement');
  requireFact(same(parseRecord('execution-mode', stores.read(execution.mode_ref)), mode), 'BLOCKED_EXECUTION_MODE_POLICY', 'mode switched within replay');
  const synthetic = mode.replay_id.startsWith('SYNTHETIC-');
  requireFact(synthetic || native, 'BLOCKED_EXECUTION_MODE_POLICY', 'Q-R1 selects native for the first actual replay');
  requireFact(execution.declared_execution_class === (synthetic ? 'synthetic' : mode.evidence_kind),
    'BLOCKED_CONTEXT_EVIDENCE', 'synthetic/manual evidence upgraded to native');
  for (const delivery of execution.deliveries) requireFact(delivery.execution_class === execution.declared_execution_class
    && delivery.recorded_execution_class === execution.declared_execution_class && !delivery.inherited_context && delivery.fresh_context,
  'BLOCKED_CONTEXT_EVIDENCE', 'native receipt/declared context mismatch');
  if (!synthetic && native) {
    const authority = parseStrictJson(stores.read(mode.authority_ref)) as Data;
    requireFact(authority.q_r1 === 'EXPERIMENTAL_UNSANCTIONED_NATIVE_LOA'
      && authority.replay_id === mode.replay_id && authority.attestation_probes === true && authority.model_calls === true,
    'BLOCKED_EXECUTION_MODE_POLICY', 'separate native execution authority missing');
  }
  requireFact(!native || execution.manual_passes.length===0,'BLOCKED_CONTEXT_EVIDENCE','manual review records cannot be native execution');
  const usedPasses = new Set<string>(), producerPasses = new Set<string>();
  const subjects = new Map<string, Data[]>();
  for (const pass of execution.manual_passes) {
    const e = pass.evidence;
    requireFact(pass.profile.role === pass.role && e.producer_actor !== e.reviewer_actor
      && e.producer_pass_id !== e.reviewer_pass_id && !usedPasses.has(e.reviewer_pass_id),
    'BLOCKED_CONTEXT_EVIDENCE', 'manual actor/pass independence');
    usedPasses.add(e.reviewer_pass_id);
    producerPasses.add(e.producer_pass_id);
    if (pass.role === 'verifier-l3') {
      const group = subjects.get(e.subject_digest) || []; group.push(pass); subjects.set(e.subject_digest, group);
    }
  }
  requireFact([...usedPasses].every((pass)=>!producerPasses.has(pass)),'BLOCKED_CONTEXT_EVIDENCE','review pass reused for production/normalization');
  for (const group of subjects.values()) {
    const first = group[0], second = group[1];
    requireFact(first.round === '1' && group.length === (first.verdict === 'cannot-determine' ? 2 : 1),
      'BLOCKED_CONTEXT_EVIDENCE', 'manual L3 conditional rounds');
    if (second) requireFact(second.round === '2' && first.evidence.reviewer_actor !== second.evidence.reviewer_actor
      && same(first.evidence.shown_digest, second.evidence.shown_digest)
      && first.evidence.producer_actor === second.evidence.producer_actor,
    'BLOCKED_CONTEXT_EVIDENCE', 'conditional reviewer not independent/same subject');
    if(first.verdict==='cannot-determine')requireFact(outcome.completion==='INCOMPLETE',
      'BLOCKED_CONTEXT_EVIDENCE','conditional upheld cannot erase first-round indeterminacy');
  }
  for (const ref of artifactRefs(execution)) stores.read(ref);
  const missingEffect = execution.accepted_return_refs.length > 0 && execution.production_effect_refs.length === 0;
  if (missingEffect) requireFact(outcome.completion === 'INCOMPLETE'
    && outcome.execution !== 'COMPLETED_TO_DECLARED_ENDPOINT'
    && outcome.blocking_codes.includes('BLOCKED_F03_PRODUCTION_REACHABILITY'),
  'BLOCKED_F03_PRODUCTION_REACHABILITY', 'accepted/quarantined return has no canonical production effect');
  if (outcome.completion === 'COMPLETE_TO_DECLARED_ENDPOINT') requireFact(outcome.execution === 'COMPLETED_TO_DECLARED_ENDPOINT'
    && outcome.blocking_codes.length === 0 && execution.completion_evidence_ref !== null,
  'BLOCKED_F03_PRODUCTION_REACHABILITY', 'transport PASS is not endpoint completion evidence');
  if (outcome.blocking_codes.length || outcome.execution !== 'COMPLETED_TO_DECLARED_ENDPOINT')
    requireFact(outcome.completion === 'INCOMPLETE', 'BLOCKED_F03_PRODUCTION_REACHABILITY', 'blocked state promoted');
}

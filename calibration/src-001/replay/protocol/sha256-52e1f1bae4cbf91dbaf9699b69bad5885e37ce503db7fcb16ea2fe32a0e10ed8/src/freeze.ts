import { createPublicKey, sign, verify } from 'node:crypto';
import type { KeyObject } from 'node:crypto';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { artifactRefs, canonicalBytes, digest, parseRecord, parseStrictJson, requireFact, same, validateRecord } from './records.ts';
import type { ArtifactRef, Data } from './records.ts';
import { checkedRoot, exactFile, inventory, inventoryRecord, verifyInventory, writeOnce } from './storage.ts';
import type { Stores } from './storage.ts';

export function eventChain(events: Data[], replayId: string): string {
  requireFact(events.length > 0, 'FAIL_COMPARISON_CHRONOLOGY', 'empty event chain');
  let previous: string | null = null;
  events.forEach((event, index) => {
    validateRecord('event', event);
    requireFact(event.replay_id === replayId && event.sequence === String(index) && event.previous_event_digest === previous,
      'FAIL_COMPARISON_CHRONOLOGY', 'event fork, sequence reuse, mutation or wrong predecessor');
    requireFact(index !== 0 || event.event_kind === 'origin', 'FAIL_COMPARISON_CHRONOLOGY', 'missing origin');
    previous = digest(canonicalBytes(event));
  });
  return previous!;
}
export function appendSyntheticEvent(root: string, event: Data): void {
  requireFact(event.replay_id.startsWith('SYNTHETIC-'), 'SYNTHETIC_ONLY', 'no real replay event creation');
  checkedRoot(root);
  const files = readdirSync(root).sort();
  requireFact(files.every((p) => /^[0-9]{12}\.json$/u.test(p)), 'FAIL_COMPARISON_CHRONOLOGY', 'unexpected recorder path');
  const events = files.map((p) => parseRecord('event', exactFile(root, p)));
  eventChain([...events, event], event.replay_id);
  requireFact(BigInt(event.sequence) < 1000000000000n, 'FAIL_COMPARISON_CHRONOLOGY', 'sequence out of recorder range');
  // Exclusive create refuses concurrent writers choosing the same sequence.
  writeOnce(join(root, `${event.sequence.padStart(12, '0')}.json`), canonicalBytes(event));
}
export function validateAcyclicRefs(value: Data, stores: Stores): void {
  const active = new Set<string>(), done = new Set<string>();
  function visit(ref: ArtifactRef): void {
    const id = `${ref.store}/${ref.path}`;
    requireFact(!active.has(id), 'BLOCKED_FREEZE', 'cyclic ArtifactRef closure');
    if (done.has(id)) return;
    active.add(id);
    const raw = stores.read(ref);
    // Arbitrary raw evidence remains opaque. Only harness records define nested harness refs.
    if (ref.path.endsWith('.json')) {
      let parsed: Data | null = null;
      try { parsed = parseStrictJson(raw, true) as Data; } catch { /* opaque original evidence */ }
      if (parsed && typeof parsed.format === 'string' && parsed.format.startsWith('src001-replay-'))
        artifactRefs(parsed).forEach(visit);
    }
    active.delete(id); done.add(id);
  }
  artifactRefs(value).forEach(visit);
}
export function syntheticAttestation(payload: Data, privateKey: KeyObject): Data {
  requireFact(payload.replay_id.startsWith('SYNTHETIC-'), 'SYNTHETIC_ONLY', 'no real freeze attestation');
  validateRecord('freeze', payload);
  const publicKey = createPublicKey(privateKey).export({ type: 'spki', format: 'der' });
  const body = { format: 'src001-replay-freeze-attestation/v1', replay_id: payload.replay_id,
    freeze_receipt_sha256: digest(canonicalBytes(payload)), snapshot_storage_identity: payload.snapshot_storage_identity,
    authority_identity: payload.authority_identity, verification_key_identity: digest(publicKey) };
  return { ...body, signature: sign(null, canonicalBytes(body), privateKey).toString('base64') };
}
export interface FreezeEvidence {
  stores: Stores;
  result_root: string;
  events: Data[];
  attestation: Data;
  detached_digest: Buffer;
  trusted_public_key: KeyObject;
}
export function evaluationFreeze(payload: Data, evidence: FreezeEvidence): void {
  validateRecord('freeze', payload);
  const { stores, result_root: root, events, attestation, detached_digest: detached, trusted_public_key: publicKey } = evidence;
  const record = parseRecord('inventory', stores.read(payload.replay_inventory_ref));
  verifyInventory(record, root);
  requireFact(record.replay_id === payload.replay_id && record.inventory_digest === payload.replay_inventory_digest
    && same([...new Set(record.entries.map((e: Data) => e.path.split('/')[0]))].sort(), ['execution-evidence','run']),
  'BLOCKED_FREEZE', 'snapshot identity or complete result roots differ');
  requireFact(payload.snapshot_storage_identity === digest(canonicalBytes({ format: 'src001-store-lock/v1', entries: inventory(root) })),
    'BLOCKED_FREEZE', 'snapshot storage identity');
  requireFact(detached.equals(Buffer.from(`${digest(canonicalBytes(payload)).slice(7)}\n`)), 'FAIL_FREEZE_MUTATION', 'detached freeze digest');
  validateRecord('freeze-attestation', attestation);
  const { signature, ...attested } = attestation;
  requireFact(attested.replay_id === payload.replay_id && attested.freeze_receipt_sha256 === digest(canonicalBytes(payload))
    && attested.snapshot_storage_identity === payload.snapshot_storage_identity && attested.authority_identity === payload.authority_identity
    && attested.verification_key_identity === digest(publicKey.export({ type: 'spki', format: 'der' }))
    && verify(null, canonicalBytes(attested), publicKey, Buffer.from(signature, 'base64')),
  'BLOCKED_FREEZE', 'detached attestation/key binding');
  validateAcyclicRefs(payload, stores);
  const companions = new Set(['canonical_artifact_index_ref','ledger_index_ref','quiescence_receipt_ref',
    'replay_inventory_ref','freeze_authority_ref'].map((field) => canonicalBytes(payload[field]).toString()));
  const checked = new Set<string>();
  function retained(ref: ArtifactRef): void {
    const key = canonicalBytes(ref).toString();
    if (checked.has(key)) return; checked.add(key);
    const path = ref.store === payload.snapshot_storage_identity ? ref.path
      : `execution-evidence/stores/${ref.store.slice(7)}/${ref.path}`;
    requireFact(companions.has(key) || record.entries.some((entry: Data) => entry.path === path
      && entry.type === 'file' && entry.byte_length === ref.byte_length && entry.sha256 === ref.sha256),
    'BLOCKED_FREEZE', `proof bytes missing from snapshot: ${ref.path}`);
    const raw = stores.read(ref);
    if (ref.path.endsWith('.json')) {
      let value: Data | null = null;
      try { value = parseStrictJson(raw, true) as Data; } catch { /* Opaque original evidence stays opaque. */ }
      if (value && typeof value.format === 'string' && value.format.startsWith('src001-replay-'))
        artifactRefs(value).forEach(retained);
    }
  }
  artifactRefs(payload).forEach(retained);
  const quiescence = parseRecord('quiescence', stores.read(payload.quiescence_receipt_ref));
  requireFact(quiescence.replay_id === payload.replay_id && quiescence.remaining_contexts.length === 0
    && quiescence.open_writers.length === 0 && quiescence.sealed_source
    && quiescence.custody_inventory_digest === record.inventory_digest
    && quiescence.source_inventory_digest === record.inventory_digest,
  'BLOCKED_FREEZE', 'quiescence/source-custody equality missing');
  const cut = Number(payload.event_log_cut.sequence);
  requireFact(Number.isSafeInteger(cut) && events[cut]?.event_kind === 'production-stop'
    && eventChain(events.slice(0, cut + 1), payload.replay_id) === payload.event_log_cut.head_digest,
  'BLOCKED_FREEZE', 'causal production-stop cut missing');
  requireFact(stores.read(quiescence.production_stop_ref).equals(canonicalBytes(events[cut])),
    'BLOCKED_FREEZE', 'quiescence stop is not the sealed cut');
  const mode = parseRecord('execution-mode', stores.read(payload.execution_mode_ref));
  const outcome = parseRecord('outcome', stores.read(payload.outcome_ref));
  const index = parseRecord('canonical-artifact-index', stores.read(payload.canonical_artifact_index_ref));
  const ledgers = parseRecord('ledger-index', stores.read(payload.ledger_index_ref));
  const leak = parseRecord('leak-check', stores.read(payload.final_leak_check_ref));
  requireFact([mode,outcome,index,ledgers,leak].every((r) => r.replay_id === payload.replay_id)
    && outcome.mechanical_integrity === 'PASS' && leak.checks.every((c: Data) => c.result === 'PASS')
    && ['R03','R04','R05'].every((id) => leak.checks.some((c: Data) => c.check_id === id && c.phase === 'evaluation-freeze')),
  'BLOCKED_FREEZE', 'failed/incomplete integrity or final leak seal');
  const prescribed = parseStrictJson(stores.read(index.contract_ref)) as Data;
  requireFact(prescribed.run_format === index.run_format && prescribed.stage === index.stage
    && same(prescribed.paths, index.artifacts.map((a: Data) => ({ path: a.path, status: a.status }))),
  'BLOCKED_FREEZE', 'canonical artifact index differs from recorded stage requirements');
  for (const artifact of index.artifacts) {
    const entry = record.entries.find((e: Data) => e.path === `run/${artifact.path}` && e.type === 'file');
    requireFact(artifact.status === 'present' ? entry?.sha256 === artifact.sha256 : !entry && artifact.sha256 === null,
      'BLOCKED_FREEZE', 'artifact presence/due/hash mismatch');
    if (artifact.status === 'missing-due') requireFact(outcome.completion === 'INCOMPLETE', 'BLOCKED_FREEZE', 'missing required effect promoted');
  }
  requireFact(ledgers.mode === mode.mode && ledgers.adapter_applicability === (mode.mode === 'agent' ? 'applicable' : 'inapplicable-manual'),
    'BLOCKED_FREEZE', 'ledger applicability guessed from absence');
  if (mode.mode === 'agent') requireFact(ledgers.ledger_chain_head && ledgers.transaction_inventory_ref,
    'BLOCKED_FREEZE', 'native ledger chain/transaction inventory missing');
  for (const ledger of ledgers.ledgers) requireFact(record.entries.some((e: Data) => e.path === `run/${ledger.path}` && e.sha256 === ledger.sha256),
    'BLOCKED_FREEZE', 'ledger digest not in complete inventory');
  for (const field of ['input_lock_ref','release_lock_ref','execution_mode_ref','environment_manifest_ref','visibility_manifest_ref',
    'execution_evidence_index_ref','final_leak_check_ref','outcome_ref']) {
    const ref = payload[field];
    requireFact(ref.store === payload.snapshot_storage_identity && ref.path.startsWith('execution-evidence/'),
      'BLOCKED_FREEZE', `mutable/outside-snapshot ${field}`);
  }
  requireFact(payload.run_state_ref.store === payload.snapshot_storage_identity && payload.run_state_ref.path.startsWith('run/'),
    'BLOCKED_FREEZE', 'run state outside snapshot');
  const runState = parseStrictJson(stores.read(payload.run_state_ref), true) as Data;
  requireFact(runState.run_id === payload.run_id, 'BLOCKED_FREEZE', 'run state identity differs');
  if (mode.mode === 'agent') requireFact(payload.run_state_ref.path === 'run/control/run-state.json',
    'BLOCKED_FREEZE', 'native run-state path');
  requireFact(existsSync(join(root, 'execution-evidence/events.json')), 'BLOCKED_FREEZE', 'event prefix missing');
  requireFact(same(parseStrictJson(exactFile(root, 'execution-evidence/events.json')), events.slice(0, cut + 1)),
    'BLOCKED_FREEZE', 'snapshot event prefix differs');
}
export function chronology(payload: Data, access: Data, comparison: Data, events: Data[], evidence: FreezeEvidence): void {
  evaluationFreeze(payload, evidence);
  validateRecord('access-receipt', access); validateRecord('comparison-manifest', comparison);
  eventChain(events, payload.replay_id);
  const hash = digest(canonicalBytes(payload)), stores = evidence.stores;
  const find = (ref: ArtifactRef) => {
    const raw = stores.read(ref);
    const index = events.findIndex((e) => canonicalBytes(e).equals(raw));
    requireFact(index >= 0, 'FAIL_COMPARISON_CHRONOLOGY', 'event not in causal chain');
    return index;
  };
  const f = find(access.freeze_event_ref), g = find(access.grant_event_ref), o = find(access.first_open_event_ref), s = find(comparison.start_event_ref);
  requireFact(events[f].event_kind === 'evaluation-freeze' && events[g].event_kind === 'reference-grant'
    && events[o].event_kind === 'reference-open' && events[s].event_kind === 'comparison-start'
    && f > Number(payload.event_log_cut.sequence) && f < g && g < o && o <= s,
  'FAIL_COMPARISON_CHRONOLOGY', 'reference grant/open must causally follow evaluation freeze');
  for (const index of [f,g,o]) requireFact(events[index].artifact_refs.some((r: ArtifactRef) => r.sha256 === hash),
    'FAIL_COMPARISON_CHRONOLOGY', 'timestamp/S0-only receipt lacks evaluation-freeze digest');
  requireFact(access.replay_id === payload.replay_id && comparison.replay_id === payload.replay_id
    && comparison.run_id === payload.run_id && access.freeze_receipt_sha256 === hash
    && comparison.freeze_receipt_sha256 === hash && comparison.replay_inventory_digest === payload.replay_inventory_digest,
  'FAIL_COMPARISON_BINDING', 'comparison target differs');
  requireFact(access.comparison_id === comparison.comparison_id && access.comparator_identity === comparison.comparator_identity
    && access.context_id === comparison.context_id && access.fresh_context && comparison.fresh_context
    && !access.inherited_context && !comparison.inherited_context && access.writable_aliases.length === 0
    && access.writer_credentials.length === 0 && access.probe_receipts.every((p: Data) => p.operation === 'write' && p.result === 'DENIED')
    && !events.slice(0, f).some((e) => ['production-start','invocation'].includes(e.event_kind) && e.actor === comparison.comparator_identity),
  'FAIL_COMPARISON_CHRONOLOGY', 'comparator is not fresh/separate/read-only');
  for (const ref of artifactRefs(access)) stores.read(ref);
  verifyInventory(parseRecord('inventory', stores.read(payload.replay_inventory_ref)), evidence.result_root);
}

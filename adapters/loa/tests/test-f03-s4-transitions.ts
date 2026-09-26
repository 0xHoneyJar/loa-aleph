#!/usr/bin/env node
// Synthetic Core plan test. Native/fixture dispatch authentication is tested by the installed process suite.
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import { duplicateFixtureBase, duplicateFixtureProposal } from '../../../scripts/duplicate-fixture-support.ts';
import { writeFixtureFile } from '../../../scripts/semantic-fixture-support.ts';
import { semanticJson } from '../../../scripts/lib/semantic-review.ts';
import { buildComparisonBasis, DUPLICATE_PATH, parseDuplicateLedger } from '../../../scripts/lib/duplicate-review.ts';
import { selectNextWork, deriveWorkTransition, validateDerivedWorkTransition, workDigest, workJson,
  type WorkValue, type WorkExecution } from '../../../scripts/lib/work-transitions.ts';
const scratch = mkdtempSync(join(tmpdir(), 'f03-s4-core-'));
let run = join(scratch, 'before');
duplicateFixtureBase(run, undefined, undefined, { runFormatVersion: '1.9.0-provisional' });
// Start this supplemental S4 test at valid initialized S4. C09's installed
// bootstrap and the unchanged historical missing-ledger discriminator are separate.
writeFixtureFile(run, 'control/run-state.json', workJson({ full_mode: 'fixture-simulated',
  run_id: loadRun(run).manifest!.runId, execution: { stage: 'S4' },
  identity: { run_format_version: '1.9.0-provisional', profile: { id: 'n/a (core-manual)', digest: null }, models: { 'verifier-l3': 'human' } } }));
const execution: WorkExecution = { stage: 'S4', stage_status: 'entered', core_state: 'DISTILLING', blocked: false };
let count = 0;
const originalClaims = readFileSync(join(run, 'ledgers/claim-inventory.md'));
for (let step = 0; step < 14; step++) {
  const model = loadRun(run), selected = selectNextWork(model, execution);
  assert(selected.kind === 'local' || selected.kind === 'worker', JSON.stringify(selected));
  let accepted: WorkValue | null = null;
  if (selected.kind === 'worker') {
    if (selected.call.role === 'verifier-l3') {
      assert.equal(selected.obligation.operation, 's4.record-review');
      assert(selected.call.producer_dependency); assert.equal(selected.call.allowlist.length, 1);
      assert(readFileSync(join(run, 'ledgers/claim-inventory.md')).equals(originalClaims));
      console.log('PASS S4 discovery/comparison cannot mutate canonical claims before fresh L3 and separate successor predicates');
      console.log(`PASS S4 ${count} Core-derived transactions; actual L3 transport remains separately tested`);
      break;
    }
    const ids = model.claims.map((c) => c.values.claimId), call = selected.call.prepared_call_id!;
    const raw = selected.call.output_selector === 'discovery' ? {
      candidates: [{ member_ids: ids, basis_refs: ['/catalogue/0', '/catalogue/1'], signal: 'shared-packet' }],
      unresolved_findings: [], rationale: 'Synthetic candidate grouping only; no equivalence asserted.', flags: [],
    } : selected.call.output_selector === 'contradiction-discovery' ? {
      verdict: 'upheld', rationale: 'Synthetic independent contradiction challenge only.', attacks_tried: ['Inspect incompatible predicates.'],
      evidence_ids: [], candidate_evidence: [], missing_for_determination: null, flags: [], flagged_pairs: [],
    } : { proposal: duplicateFixtureProposal(buildComparisonBasis(model, ids), 'distinct'),
      rationale: 'Synthetic retained distinction proposal.', flags: [] };
    const bytes = Buffer.from(semanticJson(raw));
    writeFixtureFile(run, `control/worker-returns/${call}/raw.json`, bytes);
    writeFixtureFile(run, `control/worker-returns/${call}/native-dispatch.json`, JSON.stringify({ receipt: { context_id: `CTX-${call}` } }));
    writeFixtureFile(run, `control/worker-bundles/${call}/request.json`, JSON.stringify({ role: selected.call.role }));
    accepted = { call_id: call, context_id: `CTX-${call}`, role: selected.call.role, raw_digest: workDigest(bytes),
      receipt_digest: `sha256:${'a'.repeat(64)}`, producer_context_id: null, simulation: true, value: raw as unknown as WorkValue['value'] };
  }
  const plan = deriveWorkTransition(loadRun(run), execution, selected, accepted, '2026-09-18T12:00:00Z');
  const next = join(scratch, `after-${step}`); cpSync(run, next, { recursive: true });
  for (const effect of plan.effects) writeFixtureFile(next, effect.path, Buffer.from(effect.after_base64, 'base64'));
  validateDerivedWorkTransition(loadRun(run), loadRun(next), plan);
  run = next; count++;
  console.log(`PASS S4 ${plan.obligation.operation}`);
}
assert.equal(count, 9);
const rows = parseDuplicateLedger(readFileSync(join(run, DUPLICATE_PATH), 'utf8'));
assert.equal(rows.discoveries.length, 1); assert.equal(rows.proposals.length, 1);
assert.equal(rows.assignments.length, 1); assert.equal(rows.results.length, 0); assert.equal(rows.effects.length, 0);
console.log(`retained synthetic S4 evidence: ${scratch}`);

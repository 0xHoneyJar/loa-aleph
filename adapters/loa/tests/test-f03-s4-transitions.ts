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
import type { WorkValue, WorkExecution } from '../../../scripts/lib/work-transitions.ts';
const runtime = process.argv.includes('--runtime'), seed = process.argv.includes('--l5-seed'),
  coalescedSeed = process.argv.includes('--coalesced-l5-seed'), reversedPair = process.argv.includes('--reverse-l5-pair');
assert(!coalescedSeed || seed);
assert(!reversedPair || seed);
const { selectNextWork, deriveWorkTransition, validateDerivedWorkTransition, workDigest, workJson } =
  await import(runtime ? '../../../runtime-js/scripts/lib/work-transitions.js'
    : '../../../scripts/lib/work-transitions.ts') as typeof import('../../../scripts/lib/work-transitions.ts');
const { validateDuplicateDiscovery, validateDuplicateRun } =
  await import(runtime ? '../../../runtime-js/scripts/lib/duplicate-review.js'
    : '../../../scripts/lib/duplicate-review.ts') as typeof import('../../../scripts/lib/duplicate-review.ts');
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
let discoveryCalls = 0, sweepCalls = 0, firstSweep = '';
const calls = new Set<string>(), rawReturns = new Map<string, Buffer>();
const originalClaims = readFileSync(join(run, 'ledgers/claim-inventory.md'));
for (let step = 0; step < (seed ? 20 : 14); step++) {
  const model = loadRun(run), selected = selectNextWork(model, execution);
  assert.deepEqual(selectNextWork(model, execution), selected, 'unchanged basis has one deterministic next work');
  assert(selected.kind === 'local' || selected.kind === 'worker', JSON.stringify(selected));
  assert(!selected.obligation.operation.startsWith('s4.relation.') && selected.obligation.operation !== 's4.close-C1',
    'discovery and comparison obligations precede relation/C1');
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
    assert(!calls.has(call), 'new discovery basis cannot reuse a prior worker identity'); calls.add(call);
    if (selected.call.output_selector === 'discovery') {
      discoveryCalls++;
      assert.equal(selected.call.producer_dependency, null, 'prior L5 evidence cannot become inherited discovery context');
      if (seed && discoveryCalls === 2) assert(selected.accepted_dependencies?.includes(firstSweep));
    }
    if (selected.call.output_selector === 'contradiction-discovery') {
      sweepCalls++; if (sweepCalls === 1) firstSweep = call;
    }
    const raw = selected.call.output_selector === 'discovery' ? {
      candidates: !seed || discoveryCalls === 2 && coalescedSeed
        ? [{ member_ids: ids, basis_refs: ['/catalogue/0', '/catalogue/1'], signal: 'shared-packet' }] : [],
      unresolved_findings: [], rationale: 'Synthetic candidate grouping only; no equivalence asserted.', flags: [],
    } : selected.call.output_selector === 'contradiction-discovery' ? {
      verdict: seed && sweepCalls === 1 ? 'refuted' : 'upheld',
      rationale: 'Synthetic independent contradiction challenge only.', attacks_tried: ['Inspect incompatible predicates.'],
      evidence_ids: [], candidate_evidence: [], missing_for_determination: null, flags: [],
      flagged_pairs: seed && sweepCalls === 1
        ? [{ a: ids[reversedPair ? 1 : 0], b: ids[reversedPair ? 0 : 1], why: 'Synthetic explicit pair omitted by discovery.' }] : [],
    } : { proposal: duplicateFixtureProposal(buildComparisonBasis(model, ids), 'distinct', seed ? 'DCD-0002/G1' : 'DCD-0001/G1'),
      rationale: 'Synthetic retained distinction proposal.', flags: [] };
    const bytes = Buffer.from(semanticJson(raw));
    const path = `control/worker-returns/${call}/raw.json`;
    writeFixtureFile(run, path, bytes); rawReturns.set(path, bytes);
    writeFixtureFile(run, `control/worker-returns/${call}/native-dispatch.json`, JSON.stringify({ receipt: { context_id: `CTX-${call}` } }));
    writeFixtureFile(run, `control/worker-bundles/${call}/request.json`, JSON.stringify({ role: selected.call.role }));
    accepted = { call_id: call, context_id: `CTX-${call}`, role: selected.call.role, raw_digest: workDigest(bytes),
      receipt_digest: `sha256:${'a'.repeat(64)}`, producer_context_id: selected.call.producer_dependency
        ? `CTX-${selected.call.producer_dependency}` : null, simulation: true, value: raw as unknown as WorkValue['value'] };
  }
  const plan = deriveWorkTransition(loadRun(run), execution, selected, accepted, '2026-09-18T12:00:00Z');
  const next = join(scratch, `after-${step}`); cpSync(run, next, { recursive: true });
  for (const effect of plan.effects) writeFixtureFile(next, effect.path, Buffer.from(effect.after_base64, 'base64'));
  validateDerivedWorkTransition(loadRun(run), loadRun(next), plan);
  run = next; count++;
  for (const [path, bytes] of rawReturns) assert(readFileSync(join(run, path)).equals(bytes));
  console.log(`PASS S4 ${plan.obligation.operation}`);
}
assert.equal(count, seed ? 14 : 9);
const rows = parseDuplicateLedger(readFileSync(join(run, DUPLICATE_PATH), 'utf8'));
assert.equal(rows.discoveries.length, seed ? 2 : 1); assert.equal(rows.proposals.length, 1);
assert.equal(rows.assignments.length, 1); assert.equal(rows.results.length, 0); assert.equal(rows.effects.length, 0);
if (seed) {
  assert.equal(discoveryCalls, 2); assert.equal(sweepCalls, 2);
  const first = JSON.parse(readFileSync(join(run, rows.discoveries[0].record_path), 'utf8'));
  const second = JSON.parse(readFileSync(join(run, rows.discoveries[1].record_path), 'utf8'));
  const [path, digest] = first.sweep_refs[0].result_ref.split('@');
  const reference = `${path}#/flagged_pairs/0@${digest}`;
  assert.equal(first.candidates.length, 0); assert.equal(second.candidates.length, 1);
  assert.deepEqual(second.candidates[0].basis_refs,
    [...(coalescedSeed ? ['/catalogue/0', '/catalogue/1'] : []), reference]);
  assert.equal(second.candidates[0].signal, coalescedSeed ? 'shared-packet' : 'semantic-proposal');
  assert(!validateDuplicateRun(loadRun(run)).pending.some((item) => item.includes('flagged_pairs/')));
  const rawPair = JSON.parse(readFileSync(join(run, path), 'utf8')).flagged_pairs[0];
  assert.deepEqual(second.candidates[0].member_ids, reversedPair ? [rawPair.b, rawPair.a] : [rawPair.a, rawPair.b]);
  const discoveryPath = join(run, rows.discoveries[0].record_path), originalDiscovery = readFileSync(discoveryPath);
  try {
    const altered = structuredClone(first);
    altered.sweep_refs[0].result_ref = `../unrelated-fixture-file@${digest}`;
    writeFixtureFile(run, rows.discoveries[0].record_path, semanticJson(altered));
    assert.throws(() => selectNextWork(loadRun(run), execution), /CAPTURE_HASH .*unsafe relative path/u);
  } finally { writeFixtureFile(run, rows.discoveries[0].record_path, originalDiscovery); }
  console.log('PASS L5 seed refuses an unsafe source path before opening it');
  if (coalescedSeed) for (const [name, change] of [
    ['omitted producer basis', (value: typeof second) => value.candidates[0].basis_refs.shift()],
    ['non-L5 appended basis', (value: typeof second) => value.candidates[0].basis_refs.push('/catalogue/0')],
    ['unbound L5 ordinal', (value: typeof second) => { value.candidates[0].basis_refs[2] = reference.replace('/0@', '/99@'); }],
    ['changed producer signal', (value: typeof second) => { value.candidates[0].signal = 'semantic-proposal'; }],
  ] as const) {
    const altered = structuredClone(second); change(altered);
    assert.throws(() => validateDuplicateDiscovery(altered, loadRun(run)), /DUP_/u, name);
    console.log(`PASS L5 seed refuses ${name}`);
  }
  console.log('PASS explicit L5 seed retains exact source bytes and dependencies, fresh discovery calls and later candidate provenance');
}
console.log(`retained synthetic S4 evidence: ${scratch}`);
const retainedIndex = process.argv.indexOf('--successor-capture-run');
if (retainedIndex !== -1) {
  // An actual retained installed BEFORE state exercises the complete selector.
  // This read-only derivation is supplemental to fresh installed CLI qualification.
  const before = loadRun(process.argv[retainedIndex + 1]);
  const state = JSON.parse(readFileSync(join(before.runDir, 'control/run-state.json'), 'utf8'));
  assert.equal(state.full_mode, 'fixture-simulated');
  assert.equal(state.execution.stage, 'S4');
  const selected = selectNextWork(before, execution);
  assert(selected.kind === 'local' && selected.obligation.operation === 'sem.assign');
  for (const namespace of ['S4/', 'S4-successors/']) {
    assert(before.files.some((entry) => entry.relativePath.startsWith(`verification/harness/work-captures/${namespace}`)));
  }
  for (const path of ['unexpected.json', 'S2/unexpected.json', 'S4-unregistered/unexpected.json']) {
    const malformed = { ...before, files: [...before.files,
      { ...before.files[0], relativePath: `verification/harness/work-captures/${path}`, text: '{}' }] };
    assert.throws(() => deriveWorkTransition(malformed, execution, selected, null, '2026-10-01T15:03:41.095Z'),
      /WORK_CONTRACT: S2 capture/u, path);
    console.log(`PASS successor assignment retains malformed S2 refusal: ${path}`);
  }
  const plan = deriveWorkTransition(before, execution, selected, null, '2026-10-01T15:03:41.095Z');
  writeFixtureFile(scratch, 'retained-successor-plan.json', workJson(plan));
  assert.equal(plan.semantic?.stage, 'S4');
  assert.equal(plan.semantic?.operation, 'assign-review');
  assert.equal(plan.effects.length, 2);
  assert(plan.effects.every((effect) => effect.path === 'ledgers/semantic-review.md'
    || effect.path.startsWith('verification/harness/semantic-assignments/')));
  const after = join(scratch, 'retained-successor-after');
  cpSync(before.runDir, after, { recursive: true, filter: (path) => !path.split('/').includes('calibration') });
  for (const effect of plan.effects) writeFixtureFile(after, effect.path, Buffer.from(effect.after_base64, 'base64'));
  validateDerivedWorkTransition(before, loadRun(after), plan);
  const pending = selectNextWork(loadRun(after), execution);
  assert(pending.kind === 'worker' && pending.obligation.operation === 'sem.review');
  assert.equal(pending.obligation.stage, 'S4');
  assert.equal(pending.call.role, 'verifier-l2s');
  assert(pending.call.producer_dependency && pending.call.prepared_call_id !== pending.call.producer_dependency);
  assert(readFileSync(join(after, 'ledgers/claim-inventory.md')).equals(readFileSync(join(before.runDir, 'ledgers/claim-inventory.md'))));
  console.log('PASS exact retained successor: first-unmet assignment derives fresh S4 L2S work without canonical successor creation');
}

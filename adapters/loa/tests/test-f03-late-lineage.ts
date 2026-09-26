#!/usr/bin/env node
// Supplemental Core refusal controls. Installed S5 ingress is tested separately.
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { makeSemanticFixture, writeFixtureFile } from '../../../scripts/semantic-fixture-support.ts';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import type { WorkExecution } from '../../../scripts/lib/work-transitions.ts';
const runtime = process.argv.includes('--runtime');
const core = await import(runtime ? '../../../runtime-js/scripts/lib/work-transitions.js' : '../../../scripts/lib/work-transitions.ts') as typeof import('../../../scripts/lib/work-transitions.ts');
const root = mkdtempSync(join(tmpdir(), 'f03-late-lineage-'));
const fixture = makeSemanticFixture(join(root, 'before'), undefined, undefined, undefined, '1.9.0-provisional');
const run = fixture.run, execution: WorkExecution = { stage: 'S5', stage_status: 'entered', core_state: 'DISTILLING', blocked: false };
writeFixtureFile(run, 'control/run-state.json', core.workJson({ execution: { ...execution, halt: null, gate: null } }));
const raw = core.workJson({ format: 'aleph-late-lineage-proposal/v1', run_id: loadRun(run).manifest!.runId,
  type: 'replace', predecessors: ['PKT-0701'], basis: 'Synthetic late structural correction notice.' });
let cases = 0;
function test(name: string, action: () => void): void { action(); cases++; console.log(`PASS ${name}`); }
test('ordinary post-S4 work remains the explicit unsupported frontier', () => {
  assert.equal((core.selectNextWork(loadRun(run), execution) as { code: string }).code, 'WORK_UNSUPPORTED_CAPABILITY');
});
test('typed late proposal is data and has no successor or destination', () => core.validateLateLineageProposal(loadRun(run), execution, raw));
for (const [name, mutate] of [
  ['wrong run', (v: any) => { v.run_id = 'RUN-other'; }],
  ['unknown predecessor', (v: any) => { v.predecessors = ['PKT-9999']; }],
  ['duplicate predecessor', (v: any) => { v.predecessors = ['PKT-0701', 'PKT-0701']; }],
  ['unknown type', (v: any) => { v.type = 'rewind'; }],
  ['empty basis', (v: any) => { v.basis = ''; }],
  ['caller path', (v: any) => { v.path = 'ledgers/lineage.md'; }],
  ['caller after-image', (v: any) => { v.after_base64 = 'eA=='; }],
  ['caller successors', (v: any) => { v.successors = ['PKT-9999']; }],
] as const) test(name, () => {
  const value = JSON.parse(raw.toString()); mutate(value);
  assert.throws(() => core.validateLateLineageProposal(loadRun(run), execution, core.workJson(value)), /WORK_(?:CONTRACT|LATE_LINEAGE_PROPOSAL)/u);
});
test('pre-S5 proposal cannot open a new lineage write route', () => {
  assert.throws(() => core.validateLateLineageProposal(loadRun(run), { ...execution, stage: 'S4' }, raw), /WORK_LATE_LINEAGE_WINDOW/u);
});
test('predecessor format cannot opt into this controller metadata', () => {
  const model = loadRun(run); model.manifest!.runFormatVersion = '1.8.0-provisional';
  assert.throws(() => core.validateLateLineageProposal(model, execution, raw), /WORK_LATE_LINEAGE_WINDOW/u);
});
writeFixtureFile(run, core.LATE_LINEAGE_INPUT_PATH, raw);
const model = loadRun(run), work = core.selectNextWork(model, execution);
const plan = core.deriveWorkTransition(model, execution, work, null, '2026-09-26T22:00:00Z');
const after = join(root, 'after'); cpSync(run, after, { recursive: true });
for (const e of plan.effects) writeFixtureFile(after, e.path, Buffer.from(e.after_base64, 'base64'));
test('Core derives only the refusal receipt and durable blocked consequence', () => {
  assert.equal(plan.effects.length, 1);
  assert(plan.effects[0].path.startsWith('verification/harness/late-lineage-refusals/'));
  assert.equal(plan.operational_halt!.code, 'LATE_UNIT_LINEAGE_CORRECTION');
  assert.equal(plan.next_execution.stage, 'S5'); assert.equal(plan.next_execution.core_state, 'BLOCKED');
  core.validateDerivedWorkTransition(model, loadRun(after), plan);
});
test('receipt preserves exact proposal identity and semantic bytes', () => {
  const receipt = JSON.parse(Buffer.from(plan.effects[0].after_base64, 'base64').toString());
  assert.equal(receipt.proposal_digest, core.workDigest(raw));
  for (const f of model.files) assert(readFileSync(join(run, f.relativePath)).equals(readFileSync(join(after, f.relativePath))));
});
test('an unrelated existing halt takes precedence over late work', () => {
  assert.equal((core.selectNextWork(model, { ...execution, blocked: true }) as { code: string }).code, 'WORK_EXISTING_GATE_OR_HALT');
});
test('halt cannot rewind the retained stage', () => {
  const altered = structuredClone(plan); altered.next_execution.stage = 'S3';
  assert.throws(() => core.validateDerivedWorkTransition(model, loadRun(after), altered), /WORK_LATE_LINEAGE_PLAN/u);
});
test('refusal cannot acquire a canonical lineage write', () => {
  const altered = structuredClone(plan); altered.effects.push({ ...altered.effects[0], path: 'ledgers/lineage.md' });
  assert.throws(() => core.validateDerivedWorkTransition(model, loadRun(after), altered), /WORK_LATE_LINEAGE_PLAN/u);
});
test('unrelated after-image is rejected with unchanged plan', () => {
  const changed = join(root, 'changed'); cpSync(after, changed, { recursive: true });
  writeFixtureFile(changed, 'ledgers/lineage.md', '# Changed lineage\n');
  assert.throws(() => core.validateDerivedWorkTransition(model, loadRun(changed), plan), /WORK_LATE_LINEAGE_PLAN/u);
});
console.log(JSON.stringify({ result: 'PASS', cases, runtime, root, scope: 'Core fixture controls only; F-05 remains OPEN and bounded by F-03.' }));

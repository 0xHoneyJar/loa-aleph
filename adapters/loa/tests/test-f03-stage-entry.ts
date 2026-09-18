#!/usr/bin/env node
// Static Core transaction composition; installed process recovery is tested separately.
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import { makeSemanticFixture, sealFixtureSemanticStage, writeFixtureFile } from '../../../scripts/semantic-fixture-support.ts';
import type { WorkExecution, WorkTransition } from '../../../scripts/lib/work-transitions.ts';
const runtime = process.argv.includes('--runtime');
const core = await import(runtime ? '../../../runtime-js/scripts/lib/work-transitions.js' : '../../../scripts/lib/work-transitions.ts') as typeof import('../../../scripts/lib/work-transitions.ts');
const root = mkdtempSync(join(tmpdir(), 'f03-stage-entry-'));
const f = makeSemanticFixture(join(root, 'before'), undefined, undefined, undefined, '1.9.0-provisional');
rmSync(join(f.run, 'ledgers/claim-inventory.md'));
sealFixtureSemanticStage(f, 'S2');
const execution: WorkExecution = { stage: 'S2', stage_status: 'closed', core_state: 'DISTILLING', blocked: false };
function apply(run: string, plan: WorkTransition, suffix: string): string {
  const proposed = join(root, suffix); cpSync(run, proposed, { recursive: true });
  for (const write of plan.effects) writeFixtureFile(proposed, write.path, Buffer.from(write.after_base64, 'base64'));
  return proposed;
}
const closed = f.run;
assert(!existsSync(join(closed, 'ledgers/claim-inventory.md')));
assert(!readFileSync(join(closed, 'run-log.md'), 'utf8').includes('— S3 — entry'));
const entryWork = core.selectNextWork(loadRun(closed), execution);
assert.equal(entryWork.kind, 'local'); if (entryWork.kind !== 'local') throw Error('fixture');
assert.equal(entryWork.obligation.operation, 'stage.enter-S3'); assert.equal(entryWork.obligation.stage, 'S3');
const entry = core.deriveWorkTransition(loadRun(closed), execution, entryWork, null, '2026-09-18T12:01:00Z');
assert.deepEqual(entry.effects.map((write) => write.path), ['ledgers/claim-inventory.md', 'run-log.md']);
assert.equal(entry.family, 'stage'); assert.equal(entry.semantic, undefined);
const entered = apply(closed, entry, 'entered');
core.validateDerivedWorkTransition(loadRun(closed), loadRun(entered), entry);
assert.equal(loadRun(entered).claims.length, 0); assert.equal(entry.next_execution.stage, 'S3');
console.log('PASS exact registered S3 entry initializes an empty claim inventory without semantic content');
assert.deepEqual(core.selectNextWork(loadRun(closed), execution), entryWork);
assert.deepEqual(core.deriveWorkTransition(loadRun(closed), execution, entryWork, null, '2026-09-18T12:01:00Z'), entry);
assert.throws(() => core.deriveWorkTransition(loadRun(entered), entry.next_execution, entryWork, null, '2026-09-18T12:01:00Z'), /WORK_STALE/u);
console.log('PASS post-S2 restart rederives exact S3 entry; already-entered replay is stale');
console.log('RESULT: PASS (2/2; static Core transactions only)');

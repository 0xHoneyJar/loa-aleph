#!/usr/bin/env node
/** C09 discriminator only. PASS reproduces the unadopted entry-plan boundary. */
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { duplicateFixtureBase } from '../../../scripts/duplicate-fixture-support.ts';
import { writeFixtureFile } from '../../../scripts/semantic-fixture-support.ts';
import { loadRun } from '../../../scripts/lib/run-model.ts';
const runtime = process.argv.includes('--runtime');
const argument = process.argv.indexOf('--installed-run');
const installedRun = argument < 0 ? null : resolve(process.argv[argument + 1]);
const duplicate = await import(runtime ? '../../../runtime-js/scripts/lib/duplicate-review.js'
  : '../../../scripts/lib/duplicate-review.ts') as typeof import('../../../scripts/lib/duplicate-review.ts');
const semantic = await import(runtime ? '../../../runtime-js/scripts/lib/semantic-review.js'
  : '../../../scripts/lib/semantic-review.ts') as typeof import('../../../scripts/lib/semantic-review.ts');
const core = await import(runtime ? '../../../runtime-js/scripts/lib/work-transitions.js'
  : '../../../scripts/lib/work-transitions.ts') as typeof import('../../../scripts/lib/work-transitions.ts');
const scratch = mkdtempSync(join(tmpdir(), 'f03-c09-entry-')), after = join(scratch, 'valid-S4');
duplicateFixtureBase(after, undefined, undefined, { runFormatVersion: '1.9.0-provisional', sourceId: 'SRC-001' });
const ledger = duplicate.DUPLICATE_PATH, empty = Buffer.from(duplicate.duplicateLedgerMarkdown(duplicate.emptyDuplicateLedger()));
const log = readFileSync(join(after, 'run-log.md'));
const sourceLog = log.toString().split('\n## 2026-09-13 10:00 UTC — S4 — entry')[0];
assert(sourceLog.length < log.length);
const before = join(scratch, 'S3-closed'), missing = join(scratch, 'S4-missing-ledger'), early = join(scratch, 'S3-early-ledger');
cpSync(after, before, { recursive: true }); cpSync(after, missing, { recursive: true }); cpSync(after, early, { recursive: true });
writeFixtureFile(before, 'run-log.md', sourceLog); rmSync(join(before, ledger));
writeFixtureFile(early, 'run-log.md', sourceLog); rmSync(join(missing, ledger));
const cases: Array<{ name: string; observed_error?: string }> = [];
function test(name: string, action: () => string | void) { const error = action(); cases.push({ name, ...error ? { observed_error: error } : {} }); console.log(`PASS ${name}`); }
function refusal(action: () => unknown, expected: RegExp): string {
  let observed = ''; try { action(); } catch (error) { observed = error instanceof Error ? error.message : String(error); }
  assert.match(observed, expected); return observed;
}
const write = (path: string, beforeBytes: Buffer, afterBytes: Buffer) => ({ path, before_hash: core.workDigest(beforeBytes),
  after_base64: afterBytes.toString('base64'), after_hash: core.workDigest(afterBytes) });
const initialize = (modelPath: string) => duplicate.planDuplicateWrite({ model: loadRun(modelPath), proposedModel: loadRun(after),
  proposal_id: 'none', subject_digest: core.workDigest(empty), operation: 'initialize', record_id: 'S4',
  writes: [write(ledger, Buffer.alloc(0), empty)], prerequisite_paths: [], acceptance_bindings: [] });
test('S3 without duplicate artifacts passes the existing state predicate', () => { assert.equal(duplicate.validateDuplicateRun(loadRun(before)).discoveries, 0); });
test('S4 with exact empty duplicate ledger passes the existing state predicate', () => {
  assert(readFileSync(join(after, ledger)).equals(empty)); assert.equal(duplicate.validateDuplicateRun(loadRun(after)).discoveries, 0);
});
test('preinitializing duplicate ledger in S3 fails the existing stage rule', () =>
  refusal(() => duplicate.validateDuplicateRun(loadRun(early)), /DUP_WINDOW.*duplicate artifacts forbidden before S4/u));
test('entered S4 without duplicate ledger fails full state validation', () =>
  refusal(() => duplicate.validateDuplicateRun(loadRun(missing)), /DUP_FORMAT.*ledger required on real S4 entry/u));
test('Core selector independently identifies the missing S4 initialization work', () => {
  const selected = core.selectNextWork(loadRun(missing), { stage: 'S4', stage_status: 'entered', core_state: 'DISTILLING', blocked: false });
  assert.equal(selected.kind, 'local'); assert(selected.kind === 'local'); assert.equal(selected.obligation.operation, 's4.initialize');
});
let lawfulPlan: ReturnType<typeof initialize>;
test('standalone initializer accepts only its already-open S4 before-image', () => {
  lawfulPlan = initialize(missing); assert.equal(lawfulPlan.operation, 'initialize'); assert.equal(lawfulPlan.stage, 'S4');
});
test('same empty initialization plan from actual S3 before-image fails its window', () =>
  refusal(() => initialize(before), /DUP_WINDOW.*duplicate writes require open S4 before C1/u));
test('initializer cannot acquire the S4 entry run-log write', () =>
  refusal(() => duplicate.validateDuplicatePlan({ ...lawfulPlan, writes: [...lawfulPlan.writes,
    write('run-log.md', Buffer.from(sourceLog), log)] }), /DUP_WINDOW.*run-log.md.*outside exact operation path limits/u));
const seal = 'verification/harness/semantic-stage-seals/S3.json', sealBytes = readFileSync(join(after, seal));
const semanticPlan = { key: `semantic:none:${core.workDigest(sealBytes)}:seal:S3`, stage: 'S3' as const,
  semantic_id: 'none', subject_digest: core.workDigest(sealBytes), writes: [write('run-log.md', Buffer.from(sourceLog), log),
    write(seal, Buffer.alloc(0), sealBytes)], prerequisite_hashes: [] };
test('ordinary S3 semantic seal plan retains its exact two permitted paths', () => semantic.validateSemanticPlan(semanticPlan));
test('adding duplicate initialization to S3 seal is rejected by its plan limits', () =>
  refusal(() => semantic.validateSemanticPlan({ ...semanticPlan, writes: [...semanticPlan.writes,
    write(ledger, Buffer.alloc(0), empty)] }), /SEM_WINDOW.*duplicate-review.md.*outside bounded semantic operation/u));
test('positive empty ledger control fabricates no duplicate proposal or canonical successor', () => {
  const rows = duplicate.parseDuplicateLedger(empty.toString());
  assert(Object.values(rows).every((values) => values.length === 0));
  assert.equal(loadRun(after).claims.length, loadRun(before).claims.length);
  assert.equal(loadRun(after).packets.length, loadRun(before).packets.length);
});
const unchangedPaths = ['scripts/lib/duplicate-review.ts', 'scripts/lib/semantic-review.ts', 'scripts/lib/work-transitions.ts',
  'adapters/loa/src/run-control.ts', 'runtime-js/scripts/lib/duplicate-review.js', 'runtime-js/scripts/lib/semantic-review.js',
  'runtime-js/scripts/lib/work-transitions.js', 'runtime-js/adapters/loa/src/run-control.js'];
test('C08 did not change duplicate windows, semantic plan limits or full run verification', () => {
  for (const path of unchangedPaths) assert(readFileSync(path).equals(execFileSync('git',
    ['show', `5bfbe50209d240f8fe07af587484e842c034e691:${path}`], { maxBuffer: 4 * 1024 * 1024 })), path);
});
function inventory(root: string): Array<{ path: string; size: number; mode: number; digest: string }> {
  const rows: Array<{ path: string; size: number; mode: number; digest: string }> = [];
  function visit(relative: string) {
    for (const name of readdirSync(join(root, relative)).sort()) {
      const path = relative ? `${relative}/${name}` : name, absolute = join(root, path), s = statSync(absolute);
      if (s.isDirectory()) visit(path);
      else rows.push({ path, size: s.size, mode: s.mode & 0o777, digest: core.workDigest(readFileSync(absolute)) });
    }
  }
  visit(''); return rows;
}
let installed: unknown = null;
if (installedRun) {
  const beforeFiles = inventory(installedRun), state = JSON.parse(readFileSync(join(installedRun, 'control/run-state.json'), 'utf8'));
  const corpus = JSON.parse(readFileSync(join(installedRun, 'control/corpus.snapshot.json'), 'utf8'));
  test('retained installed failure reached real fixture S4 with exact frozen SRC-001', () => {
    assert.equal(state.full_mode, 'fixture-simulated'); assert.equal(state.identity.run_format_version, '1.9.0-provisional');
    assert.equal(state.execution.stage, 'S4'); assert.equal(corpus.files[0].source_id, 'SRC-001');
    assert(!existsSync(join(installedRun, ledger))); assert(existsSync(join(installedRun, seal)));
  });
  const workRoot = join(installedRun, 'control/orchestration/work');
  const works = readdirSync(workRoot).map((p) => JSON.parse(readFileSync(join(workRoot, p), 'utf8')));
  const sealed = works.filter((w) => w.identity.work.obligation.operation === 'stage.seal-S3');
  test('installed S3 seal transaction is consumed and did not initialize DUP', () => {
    assert.equal(sealed.length, 1);
    assert(existsSync(join(installedRun, `control/orchestration/commits/${sealed[0].work_id}-consumed.json`)));
  });
  const pinnedRoot = join(installedRun, 'control/runtime/bundle');
  const pinned = await import(pathToFileURL(join(pinnedRoot, 'runtime-js/adapters/loa/src/run-control.js')).href) as typeof import('../src/run-control.ts');
  test('original retained runtime refuses the installed state at full verification', () =>
    refusal(() => pinned.verifyRunControl(installedRun), /DUP_FORMAT.*ledger required on real S4 entry/u));
  test('current conflicting predicates equal the installed pinned predicate bytes', () => {
    for (const path of unchangedPaths.filter((p) => p.startsWith('runtime-js/') && !p.endsWith('/work-transitions.js')))
      assert(readFileSync(path).equals(readFileSync(join(pinnedRoot, path))), path);
  });
  const transitionPath = 'runtime-js/scripts/lib/work-transitions.js';
  const retainedTransitions = readFileSync(join(pinnedRoot, transitionPath)), currentTransitions = readFileSync(transitionPath);
  const sealBlock = (bytes: Buffer) => {
    const text = bytes.toString(), start = text.indexOf("    if (work.obligation.operation === 'stage.seal-S3') {");
    const end = text.indexOf("    if (work.obligation.operation === 's2.commit-event') {", start);
    assert(start >= 0 && end > start); return text.slice(start, end);
  };
  test('exact S3-seal/S4-entry block is unchanged despite later unrelated module additions', () =>
    assert.equal(sealBlock(currentTransitions), sealBlock(retainedTransitions)));
  test('read-only installed discrimination changes no run bytes, paths or modes', () => assert.deepEqual(inventory(installedRun), beforeFiles));
  installed = { run: installedRun, state, seal_work: sealed[0].work_id, files: beforeFiles,
    transition_code: { path: transitionPath, installed_digest: core.workDigest(retainedTransitions),
      current_digest: core.workDigest(currentTransitions), whole_file_equal: retainedTransitions.equals(currentTransitions),
      exact_seal_entry_block_digest: core.workDigest(sealBlock(currentTransitions)) },
    scope: 'Read-only replay of the retained original fixture failure; no new installed S4/C2 completion or run migration.' };
}
const evidence = { result: 'CONFLICT_REPRODUCED', runtime, assertions: cases.length, adversarial_mutations: 0, cases, scratch, installed,
  scope: 'C09 stage-entry plan-window discriminator. No Core rule repaired, no bootstrap exception adopted, no verification deferred.' };
writeFileSync(join(scratch, 'evidence.json'), JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify({ ...evidence, installed: installedRun, evidence: join(scratch, 'evidence.json') }));

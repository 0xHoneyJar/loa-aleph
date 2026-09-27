#!/usr/bin/env node
/** Installed F-05 notice accepts no effects and preserves a separate human halt.
 * Run only after the parent fixture has completed and released its original slot. */
import assert from 'node:assert/strict';
import { cpSync, lstatSync, mkdtempSync, readFileSync, readdirSync, readlinkSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, relative, resolve, sep } from 'node:path';
import { makeTreeOwnerWritable, sha256Digest, stableJsonBytes } from '../src/fs.ts';

const fixture = resolve(process.argv[2]);
assert(fixture.startsWith(join(tmpdir(), 'aleph-orchestration-process-')));
const seed = join(fixture, 'post-S4-before-late-notice');
const state = JSON.parse(readFileSync(join(seed, 'control/run-state.json'), 'utf8'));
assert.equal(state.full_mode, 'fixture-simulated');
assert.equal(state.identity.run_format_version, '1.9.0-provisional');
assert.equal(state.execution.stage, 'S5');
assert.equal(state.execution.halt, null);
const host = join(fixture, 'host'), slot = join(host, 'grimoires/loa/aleph/runs', state.run_id);
const completed = JSON.parse(readFileSync(join(slot, 'control/run-state.json'), 'utf8'));
assert.equal(completed.full_mode, 'fixture-simulated');
assert.equal(completed.execution.halt.code, 'LATE_UNIT_LINEAGE_CORRECTION');
assert.deepEqual(completed.identity, state.identity);
const notice = join(fixture, 'late-lineage-notice.json');
assert.equal(JSON.parse(readFileSync(notice, 'utf8')).run_id, state.run_id);
const node = process.env.F03_NODE_BINARY || process.execPath;
if (process.env.F03_NODE_BINARY) {
  const version = spawnSync(node, ['--version'], { encoding: 'utf8' });
  assert.equal(version.status, 0); assert.match(version.stdout, /^v20\./u);
}
const root = mkdtempSync(join(tmpdir(), 'f03-late-lineage-existing-halt-'));
function copy(from: string, to: string): void {
  cpSync(from, to, { recursive: true,
    filter: (path) => !relative(from, path).split(sep).includes('calibration') });
}
function inventory(run: string) {
  const rows: Array<{ path: string; mode: number; kind: string; digest?: string; target?: string }> = [];
  function visit(prefix: string): void {
    for (const name of readdirSync(join(run, prefix)).sort()) {
      assert.notEqual(name, 'calibration', 'fixture contains excluded calibration administration');
      const path = prefix ? `${prefix}/${name}` : name;
      if (/^control\/(?:orchestration\/lock|ledger-writer\.lock)(?:\/|\.|$)/u.test(path)) continue;
      const full = join(run, path), stat = lstatSync(full), mode = stat.mode & 0o777;
      if (stat.isSymbolicLink()) rows.push({ path, mode, kind: 'symlink', target: readlinkSync(full) });
      else if (stat.isDirectory()) { rows.push({ path, mode, kind: 'directory' }); visit(path); }
      else { assert(stat.isFile()); rows.push({ path, mode, kind: 'file', digest: sha256Digest(readFileSync(full)) }); }
    }
  }
  visit(''); return rows;
}
const seedBefore = inventory(seed), originalBefore = inventory(slot), original = join(root, 'original-completed-fixture');
copy(slot, original); assert.deepEqual(inventory(original), originalBefore);
function restore(from: string): void {
  makeTreeOwnerWritable(slot); rmSync(slot, { recursive: true }); copy(from, slot);
}
let attempts = 0;
function invoke(args: string[]) {
  const command = [join(host, '.claude/aleph/bin/loa-aleph.mjs'), '--root', host, '--json',
    '--allow-fixture-simulation', ...args];
  const result = spawnSync(node, command, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
    env: { ...process.env, ALEPH_FIXTURE_WORK_FAULT: '' } });
  writeFileSync(join(root, `attempt-${++attempts}.json`), JSON.stringify({ node, command, ...result }, null, 2) + '\n');
  return result;
}
const cases: string[] = [];
try {
  restore(seed); assert.deepEqual(inventory(slot), seedBefore);
  for (const [field, value] of [['path', 'ledgers/lineage.md'], ['after_base64', 'Y2FsbGVyIHBheWxvYWQ=']] as const) {
    const invalid = join(root, `caller-${field}.json`);
    writeFileSync(invalid, stableJsonBytes({ ...JSON.parse(readFileSync(notice, 'utf8')), [field]: value }));
    const refused = invoke(['--work-late-lineage', invalid, state.run_id]);
    assert.equal(refused.status, 1, refused.stdout + refused.stderr);
    assert.match(refused.stdout + refused.stderr, /WORK_CONTRACT/u);
    assert.deepEqual(inventory(slot), seedBefore, 'caller effect field changed the run');
    cases.push(`supported late notice refuses caller ${field}`);
  }
  const gate = join(root, 'budget-gate.json'), gateId = 'GATE-F03-LATE-NOTICE-BUDGET';
  writeFileSync(gate, stableJsonBytes({ gateId, gateType: 'budget-exhaustion', stage: 'S5',
    now: new Date().toISOString(), request: { basis: 'Synthetic unrelated budget halt; no semantic authority.' } }));
  const opened = invoke(['--open-gate', gate, state.run_id]);
  assert.equal(opened.status, 0, opened.stdout + opened.stderr);
  const halted = JSON.parse(readFileSync(join(slot, 'control/run-state.json'), 'utf8'));
  assert.equal(halted.execution.halt.code, 'HUMAN_AUTHORITY_GATE');
  assert.equal(halted.execution.gate.id, gateId);
  assert.equal(halted.execution.gate.status, 'awaiting-authority');
  assert.equal(halted.execution.gate.type, 'budget-exhaustion');
  const before = inventory(slot);
  copy(slot, join(root, 'unrelated-halt-before-notice'));
  cases.push('supported budget gate establishes an unrelated S5 halt');
  for (let n = 1; n <= 2; n++) {
    const refused = invoke(['--work-late-lineage', notice, state.run_id]);
    assert.equal(refused.status, 1, refused.stdout + refused.stderr);
    assert.match(refused.stdout + refused.stderr, /WORK_EXISTING_GATE_OR_HALT/u);
    assert.deepEqual(inventory(slot), before, 'late notice changed the unrelated gate or run');
    const resumed = invoke(['resume', state.run_id]);
    assert.equal(resumed.status, 0, resumed.stdout + resumed.stderr);
    assert.equal(JSON.parse(resumed.stdout).result, 'BLOCKED');
    assert.equal(JSON.parse(resumed.stdout).gate.id, gateId);
    assert.deepEqual(inventory(slot), before, 'resume changed the unrelated gate or run');
    cases.push(`late notice and resume ${n} preserve every retained file and mode`);
  }
  copy(slot, join(root, 'unrelated-halt-after-notices'));
} catch (error) {
  writeFileSync(join(root, 'results.json'), JSON.stringify({ result: 'FAIL', cases, attempts, root,
    error: String(error) }, null, 2) + '\n');
  throw error;
} finally {
  restore(original);
  assert.deepEqual(inventory(slot), originalBefore, 'completed parent fixture was not restored exactly');
  assert.deepEqual(inventory(seed), seedBefore, 'original S5 seed changed');
}
const result = { result: 'PASS', cases, attempts, root, fixture, node, seed_unchanged: true, parent_restored: true,
  scope: 'Installed pinned fixture processes only. No provider/native execution or finding closure. F-05 OPEN / MUST PRESERVE.' };
writeFileSync(join(root, 'results.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result));

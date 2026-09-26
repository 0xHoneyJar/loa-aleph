#!/usr/bin/env node
/** Exact partial subsets of a fresh installed, corrected prepared bootstrap.
 * These are fault/tamper copies, never repairs to the seed or historical C09. */
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { stableJsonBytes, sha256Digest } from '../src/fs.ts';
import { stateCheckpointDigest } from '../src/run-control.ts';
const seedRecord = JSON.parse(readFileSync(resolve(process.argv[2]), 'utf8')) as { run: string; host: string; work_id: string };
const seed = resolve(seedRecord.run), workId = seedRecord.work_id;
const root = mkdtempSync(join(tmpdir(), 'f03-c09-recovery-'));
const journalRef = `control/transactions/TXN-work-${workId.slice(5)}.json`;
const intentRef = `control/orchestration/commits/${workId}-intent.json`;
const consumedRef = `control/orchestration/commits/${workId}-consumed.json`;
const journal = JSON.parse(readFileSync(join(seed, journalRef), 'utf8'));
assert.equal(journal.status, 'prepared'); assert.equal(journal.state_before.full_mode, 'fixture-simulated');
assert.equal(journal.state_before.identity.run_format_version, '1.9.0-provisional');
assert(journal.plan.s3_to_s4_bootstrap);
assert.equal(journal.plan.effects.length, 3);
assert.equal(journal.state_before.execution.stage, 'S3');
assert.equal(journal.state_after.execution.stage, 'S4');
assert(!existsSync(join(seed, consumedRef)));
const effects = journal.plan.effects as Array<{ path: string; after_base64: string; after_digest: string }>;
const cases: Array<{ name: string; run: string; exit: number | null; error?: string }> = [];
function write(run: string, path: string, bytes: Buffer | string): void {
  const full = join(run, path); mkdirSync(dirname(full), { recursive: true });
  rmSync(full, { force: true }); writeFileSync(full, bytes);
}
function inventory(run: string): Array<{ path: string; mode: number; digest: string }> {
  const rows: Array<{ path: string; mode: number; digest: string }> = [];
  function visit(prefix: string) {
    for (const name of readdirSync(join(run, prefix)).sort()) {
      const path = prefix ? `${prefix}/${name}` : name;
      if (/^control\/(?:orchestration\/lock|ledger-writer\.lock)(?:\/|\.|$)/u.test(path)) continue;
      const s = statSync(join(run, path));
      if (s.isDirectory()) visit(path); else rows.push({ path, mode: s.mode & 0o777, digest: sha256Digest(readFileSync(join(run, path))) });
    }
  }
  visit(''); return rows;
}
const seedInventory = inventory(seed);
const script = `
import { pathToFileURL } from 'node:url';
const [run, id, action] = process.argv.slice(1);
const base = run + '/control/runtime/bundle/runtime-js/adapters/loa/src/';
if (action === 'resume') {
  const { resumeOrchestration } = await import(pathToFileURL(base + 'orchestration.js').href);
  resumeOrchestration(run);
} else {
  const { LedgerWriter } = await import(pathToFileURL(base + 'ledger-writer.js').href);
  new LedgerWriter(run).commitOrchestrationWork(id);
}
const { verifyRunControl } = await import(pathToFileURL(base + 'run-control.js').href);
verifyRunControl(run);
console.log('VERIFIED_FINAL_AFTER');
`;
function invoke(run: string, id = workId, action = 'commit') {
  return spawnSync(process.execPath, ['--input-type=module', '-e', script, run, id, action], {
    encoding: 'utf8', env: { ...process.env, ALEPH_FIXTURE_WORK_FAULT: '' }, maxBuffer: 8 * 1024 * 1024,
  });
}
function test(name: string, change: (run: string) => void, refusal?: RegExp, id = workId, action = 'commit'): void {
  const run = join(root, `case-${cases.length + 1}`); cpSync(seed, run, { recursive: true }); change(run);
  const before = inventory(run), result = invoke(run, id, action);
  writeFileSync(join(root, `case-${cases.length + 1}.log`), result.stdout + result.stderr);
  if (refusal) {
    assert.notEqual(result.status, 0, name); assert.match(result.stderr, refusal, name);
    assert.deepEqual(inventory(run), before, `${name}: rejected operation changed durable bytes`);
  } else {
    assert.equal(result.status, 0, `${name}: ${result.stdout}\n${result.stderr}`);
    assert.match(result.stdout, /VERIFIED_FINAL_AFTER/u);
    for (const effect of effects) assert.equal(readFileSync(join(run, effect.path)).toString('base64'), effect.after_base64);
    assert(readFileSync(join(run, 'control/run-state.json')).equals(stableJsonBytes(journal.state_after)));
    assert.equal(readFileSync(join(run, 'control/ledger-chain.jsonl'), 'utf8'), journal.chain_after);
    const consumed = JSON.parse(readFileSync(join(run, consumedRef), 'utf8'));
    assert.equal(consumed.after_checkpoint, journal.state_after.execution.resume.checkpoint_digest);
    assert.equal(consumed.after_chain, journal.state_after.ledger.chain_head);
    assert.equal(readFileSync(join(run, 'run-log.md'), 'utf8').split('— S4 — entry').length - 1, 1);
    const after = inventory(run), replay = invoke(run);
    assert.notEqual(replay.status, 0); assert.match(replay.stderr, /WORK_CONSUMED/u);
    assert.deepEqual(inventory(run), after, 'consumed replay must have zero durable effects');
  }
  cases.push({ name, run, exit: result.status, ...refusal ? { error: result.stderr } : {} });
  assert.deepEqual(inventory(seed), seedInventory);
  console.log(`PASS ${name}`);
  writeFileSync(join(root, 'results.json'), JSON.stringify({ result: 'IN_PROGRESS', cases }, null, 2) + '\n');
}
const allEffects = (run: string) => { for (const e of effects) write(run, e.path, Buffer.from(e.after_base64, 'base64')); };
for (let mask = 0; mask < 8; mask++) test(`prepared bootstrap partial canonical subset ${mask.toString(2).padStart(3, '0')}`,
  (run) => { for (const [i, e] of effects.entries()) if (mask & (1 << i)) write(run, e.path, Buffer.from(e.after_base64, 'base64')); });
test('all canonical bytes and chain before checkpoint', (run) => {
  allEffects(run); write(run, 'control/ledger-chain.jsonl', journal.chain_after);
});
test('checkpoint before work consumption', (run) => {
  allEffects(run); write(run, 'control/ledger-chain.jsonl', journal.chain_after);
  write(run, 'control/run-state.json', stableJsonBytes(journal.state_after));
});
test('committed journal before consumption', (run) => {
  allEffects(run); write(run, 'control/ledger-chain.jsonl', journal.chain_after);
  write(run, 'control/run-state.json', stableJsonBytes(journal.state_after));
  write(run, journalRef, stableJsonBytes({ ...journal, status: 'committed' }));
});
test('preparation not yet written retains legal BEFORE and can prepare', (run) => {
  rmSync(join(run, journalRef)); rmSync(join(run, intentRef));
});
test('intent without prepared journal and exact BEFORE can prepare', (run) => rmSync(join(run, journalRef)));
for (const [i, e] of effects.entries()) {
  test(`partial effect ${i} without matching journal fails closed`, (run) => {
    rmSync(join(run, journalRef)); write(run, e.path, Buffer.from(e.after_base64, 'base64'));
  }, /WORK_BOOTSTRAP_UNJOURNALED/u);
  test(`altered canonical effect ${i} is neither BEFORE nor AFTER`, (run) =>
    write(run, e.path, Buffer.from('unbound third image')), /WORK_(?:PREREQUISITE_CHANGED|EFFECT_CHANGED)/u);
  test(`altered journal effect ${i} with recomputed journal digest is rejected`, (run) => {
    const changed = structuredClone(journal);
    changed.plan.effects[i].after_base64 = Buffer.from('caller payload').toString('base64');
    changed.plan.effects[i].after_digest = sha256Digest('caller payload');
    const { digest: _digest, status: _status, ...body } = changed;
    changed.digest = sha256Digest(stableJsonBytes(body));
    write(run, journalRef, stableJsonBytes(changed));
  }, /WORK_JOURNAL_BINDING/u);
}
test('invalid prepared journal fails closed', (run) => write(run, journalRef, '{}'), /WORK_JOURNAL_BINDING/u);
test('partial bootstrap without intent or journal cannot acquire recovery authority', (run) => {
  rmSync(join(run, journalRef)); rmSync(join(run, intentRef));
  write(run, effects[1].path, Buffer.from(effects[1].after_base64, 'base64'));
}, /WORK_PREREQUISITE_CHANGED/u);
test('ordinary resume refuses bare S4 without ledger or recoverable bootstrap', (run) => {
  for (const path of [journalRef, intentRef, `control/orchestration/work/${workId}.json`]) rmSync(join(run, path));
  for (const e of effects.slice(0, 2)) write(run, e.path, Buffer.from(e.after_base64, 'base64'));
  write(run, 'control/ledger-chain.jsonl', journal.chain_after);
  write(run, 'control/run-state.json', stableJsonBytes(journal.state_after));
}, /DUP_FORMAT.*ledger required on real S4 entry/u, workId, 'resume');
test('ordinary resume refuses pre-S4 duplicate ledger without recoverable bootstrap', (run) => {
  for (const path of [journalRef, intentRef, `control/orchestration/work/${workId}.json`]) rmSync(join(run, path));
  write(run, effects[2].path, Buffer.from(effects[2].after_base64, 'base64'));
}, /DUP_WINDOW.*duplicate artifacts forbidden before S4/u, workId, 'resume');
test('unrelated additional canonical write fails closed', (run) => write(run, 'ledgers/unrelated.md', 'unrelated'), /WORK_PREREQUISITE_CHANGED/u);
test('stale chain fails closed', (run) => write(run, 'control/ledger-chain.jsonl', journal.chain_before + '{}\n'), /WORK_CHAIN_CHANGED/u);
test('stale checkpoint fails closed', (run) => {
  const state = structuredClone(journal.state_before); state.execution.resume.sequence = String(BigInt(state.execution.resume.sequence) + 100n);
  state.execution.resume.checkpoint_digest = stateCheckpointDigest(state); write(run, 'control/run-state.json', stableJsonBytes(state));
}, /WORK_JOURNAL_CHECKPOINT/u);
test('wrong stage/checkpoint fails closed', (run) => {
  const state = structuredClone(journal.state_before); state.execution.stage = 'S2';
  state.execution.resume.checkpoint_digest = stateCheckpointDigest(state); write(run, 'control/run-state.json', stableJsonBytes(state));
}, /WORK_JOURNAL_CHECKPOINT/u);
test('wrong run fails closed', (run) => {
  const state = structuredClone(journal.state_before); state.run_id = 'RUN-other';
  state.execution.resume.checkpoint_digest = stateCheckpointDigest(state); write(run, 'control/run-state.json', stableJsonBytes(state));
}, /WORK_IDENTITY|runtime snapshot/u);
test('unknown stale work ID fails closed', () => {}, /ENOENT|WORK_IDENTITY/u, `WORK-${'0'.repeat(64)}`);
test('resume refuses forged consumption before bootstrap completion', (run) => {
  const intent = JSON.parse(readFileSync(join(run, intentRef), 'utf8'));
  const body = { format: 'aleph-loa-work-consumption/v1', work_id: workId, commit_digest: intent.digest,
    journal_digest: sha256Digest(readFileSync(join(run, journalRef))),
    after_checkpoint: journal.state_after.execution.resume.checkpoint_digest, after_chain: journal.state_after.ledger.chain_head };
  write(run, consumedRef, stableJsonBytes({ ...body, digest: sha256Digest(stableJsonBytes(body)) }));
}, /WORK_CONSUMPTION/u, workId, 'resume');
const evidence = { result: 'PASS', cases, root, seed: seedRecord, seed_unchanged: true,
  scope: 'Fresh installed pinned writer in separate processes; authenticated partial subsets and tamper controls. Full CLI crash progression is separate. No provider/native/semantic evidence or finding closure.' };
writeFileSync(join(root, 'results.json'), JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify(evidence));

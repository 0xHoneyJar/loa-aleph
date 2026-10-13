import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { stableJsonBytes } from '../../adapters/loa/src/fs.ts';
import { digest, EFFECTS, FAULTS, LOCKS, OPERATION, publish, type Inventory, type Json } from './common.ts';
import { FIXTURE_FLAGS, freezeTooling, sourcePaths, validateFixtureFlags } from './driver.ts';
import { readFreshC1, verifyMatrix, verifyStartingBasis, type Evidence } from './reader.ts';
import { bootId, disposition, fixtureEnvironment, identity, supervise, verifyChild, type ChildRequest } from './supervisor.ts';

// Constructed unit-test records only. They cannot pass readFreshC1's installed
// identity, process custody and pinned-Core authentication gates.
function specimen() {
  const store = new Map<string, Buffer>(), id = `WORK-${'a'.repeat(64)}`;
  const add = (value: unknown, mode = 0o400) => {
    const data = Buffer.isBuffer(value) ? value : Buffer.from(JSON.stringify(value) + '\n');
    const hash = digest(data); store.set(hash, data); return { digest: hash, mode, size: data.length };
  };
  const before: Json = { run_id: 'synthetic-unit-only', identity: {}, full_mode: 'fixture-simulated',
    ledger: { sequence: '10', chain_head: 'old' }, execution: { stage: 'S4', resume: { sequence: '3', checkpoint_digest: 'before' } } };
  const after = structuredClone(before);
  after.ledger = { sequence: '13', chain_head: 'new' };
  after.execution.resume = { sequence: '4', checkpoint_digest: 'after' };
  const beforeEffects = [null, Buffer.from('old uses'), Buffer.from('old log')];
  const effects = EFFECTS.map((path, index) => ({ path, before_digest: beforeEffects[index] && digest(beforeEffects[index]),
    after_digest: digest(Buffer.from(`after ${path}`)), after_base64: Buffer.from(`after ${path}`).toString('base64') }));
  const seal = (value: Json): Json => ({ ...value, digest: digest(stableJsonBytes(value)) });
  const work = seal({ work_id: id, call: null, identity: {
    pins: {}, work: { obligation: { operation: OPERATION } }, checkpoint: 'before', ledger: { chain_head: 'old' } } });
  const journalPath = `control/transactions/TXN-work-${id.slice(5)}.json`;
  const intent = seal({ work_id: id, work_digest: work.digest,
    before_checkpoint: 'before', before_chain: 'old', journal: journalPath });
  const tx: Json = { ...seal({ format: 'aleph-loa-work-transaction/v1', work_id: id, intent_digest: intent.digest,
    state_before: before, state_after: after, chain_before: 'old\n', chain_after: 'old\none\ntwo\nthree\n',
    plan: { obligation: { operation: OPERATION }, effects } }), status: 'prepared' };
  const intentPath = `control/orchestration/commits/${id}-intent.json`;
  const consumedPath = `control/orchestration/commits/${id}-consumed.json`;
  const observations = FAULTS.map((point, index) => {
    const files: Inventory = {
      [`control/orchestration/work/${id}.json`]: add(work),
      'control/run-state.json': add(index >= 8 ? after : before, 0o600),
      'control/ledger-chain.jsonl': add(Buffer.from(index >= 7 ? tx.chain_after : tx.chain_before), 0o600),
    };
    effects.forEach((effect, n) => {
      if (index >= 3 && n < Math.min(index - 2, 3)) files[effect.path] = add(Buffer.from(effect.after_base64, 'base64'), 0o600);
      else if (beforeEffects[n]) files[effect.path] = add(beforeEffects[n], 0o600);
    });
    if (index >= 1) files[intentPath] = add(intent);
    if (index >= 2) files[journalPath] = add(stableJsonBytes({ ...tx, status: index >= 9 ? 'committed' : 'prepared' }));
    if (index === 10) files[consumedPath] = add(seal({ format: 'aleph-loa-work-consumption/v1',
      work_id: id, commit_digest: intent.digest, journal_digest: files[journalPath].digest,
      after_chain: 'new', after_checkpoint: 'after' }));
    return { fault: `${OPERATION}:${point}`, receipt: `children/${String(index + 1).padStart(4, '0')}`, files };
  });
  const evidence: Evidence = { format: 'f03-fresh-c1/v1', nonce: 'unit-only', run: '/unit-only/run', host: '/unit-only',
    pins: {}, work_id: id, prepared: tx, boundaries: observations,
    resumes: [12, 13].map(n => ({ fault: null, receipt: `children/00${n}`, files: structuredClone(observations[10].files) })) };
  const read = (entry: Inventory[string]): Buffer => {
    const value = store.get(entry.digest); assert(value, 'MISSING_OBJECT');
    assert.equal(value.length, entry.size); assert.equal(digest(value), entry.digest); return value;
  };
  return { evidence, read, add, intentPath, journalPath, consumedPath };
}
let passed = 0;
function check(name: string, action: () => void): void { action(); passed++; console.log(`PASS ${name}`); }
check('complete synthetic matrix satisfies pure invariants only', () => {
  const s = specimen(); verifyMatrix(s.evidence, s.read);
});
check('exact lease lifecycle retains evidence without counting it as canonical effects', () => {
  const s = specimen();
  for (const [n, row] of s.evidence.boundaries.entries()) for (const path of LOCKS) row.files[path] = s.add({ pid: String(n + 1) }, 0o600);
  verifyMatrix(s.evidence, s.read);
  s.evidence.resumes[0].files[LOCKS[0]] = s.add({ pid: 'stale' });
  assert.throws(() => verifyMatrix(s.evidence, s.read), /RESUME_LEFT_LEASE/);
});
check('sealed C1 BEFORE basis, exact bytes and absence scope', () => {
  const s = specimen(), files = structuredClone(s.evidence.boundaries[0].files);
  const members = Object.entries(files).filter(([path]) => !path.startsWith('control/orchestration/'))
    .map(([path, value]) => ({ path, digest: value.digest, byte_length: String(value.size), storage: 'blob' }));
  const body = { format: 'aleph-loa-work-basis/v1', members,
    canonical_paths: members.map(m => m.path).filter(path => !path.startsWith('control/')),
    absence_scope: 'complete-run-file-inventory-with-work-history/v2' };
  const seal = digest(stableJsonBytes(body));
  files[`control/orchestration/basis/${seal.slice(7)}/manifest.json`] = s.add({ ...body, digest: seal });
  const workPath = `control/orchestration/work/${s.evidence.work_id}.json`;
  const { digest: _old, ...work } = JSON.parse(s.read(files[workPath]).toString());
  work.basis_digest = seal; work.identity.run_id = 'synthetic-unit-only';
  files[workPath] = s.add({ ...work, digest: digest(stableJsonBytes(work)) });
  verifyStartingBasis(s.evidence.work_id, files, s.read);
  files['control/run-state.json'] = s.add({ replaced: true });
  assert.throws(() => verifyStartingBasis(s.evidence.work_id, files, s.read), /CANONICAL_BEFORE/);
});
const attacks: [string, (s: ReturnType<typeof specimen>) => void, RegExp][] = [
  ['ten boundaries', s => { s.evidence.boundaries.pop(); }, /ELEVEN_BOUNDARIES/],
  ['extra boundary', s => { s.evidence.boundaries.push(s.evidence.boundaries[0]); }, /ELEVEN_BOUNDARIES/],
  ['one resume', s => { s.evidence.resumes.pop(); }, /TWO_RESUMES/],
  ['reordered fault', s => { s.evidence.boundaries[1].fault = s.evidence.boundaries[0].fault; }, /FAULT_ORDER/],
  ['wrong work', s => { s.evidence.prepared.work_id = `WORK-${'b'.repeat(64)}`; }, /AssertionError/],
  ['wrong pins', s => { s.evidence.pins = { foreign: true }; }, /AssertionError/],
  ['different transaction body', s => {
    const row = s.evidence.boundaries[8].files[s.journalPath];
    s.evidence.boundaries[8].files[s.journalPath] = s.add({ ...JSON.parse(s.read(row).toString()), intent_digest: 'foreign' });
  }, /PREPARED_BODY/],
  ['third-state bytes', s => { s.evidence.boundaries[4].files[EFFECTS[0]] = s.add(Buffer.from('illegal')); }, /EXACT_EFFECT/],
  ['absent BEFORE replaced by empty file', s => { s.evidence.boundaries[0].files[EFFECTS[0]] = s.add(Buffer.alloc(0)); }, /EXACT_EFFECT/],
  ['chain advanced early', s => {
    s.evidence.boundaries[6].files['control/ledger-chain.jsonl'] = s.evidence.boundaries[7].files['control/ledger-chain.jsonl'];
  }, /EXACT_CHAIN/],
  ['checkpoint advanced early', s => {
    s.evidence.boundaries[7].files['control/run-state.json'] = s.evidence.boundaries[8].files['control/run-state.json'];
  }, /EXACT_CHECKPOINT/],
  ['early intent', s => { s.evidence.boundaries[0].files[s.intentPath] = s.evidence.boundaries[1].files[s.intentPath]; }, /INTENT_ORDER/],
  ['missing prepared journal', s => { delete s.evidence.boundaries[2].files[s.journalPath]; }, /JOURNAL_ORDER/],
  ['early consumption', s => { s.evidence.boundaries[9].files[s.consumedPath] = s.evidence.boundaries[10].files[s.consumedPath]; }, /CONSUMPTION_LAST/],
  ['wrong consumed journal bytes', s => {
    const row = s.evidence.boundaries[10].files[s.consumedPath];
    s.evidence.boundaries[10].files[s.consumedPath] = s.add({ ...JSON.parse(s.read(row).toString()), journal_digest: 'foreign' });
  }, /AssertionError/],
  ['writable consumption', s => { s.evidence.boundaries[10].files[s.consumedPath].mode = 0o600; }, /AssertionError/],
  ['altered prepared journal seal', s => {
    const row = s.evidence.boundaries[2].files[s.journalPath];
    s.evidence.boundaries[2].files[s.journalPath] = s.add(stableJsonBytes({ ...JSON.parse(s.read(row).toString()), digest: 'changed' }));
  }, /RECORD_SEAL/],
  ['noncanonical journal serialization', s => {
    const row = s.evidence.boundaries[2].files[s.journalPath];
    s.evidence.boundaries[2].files[s.journalPath] = s.add(Buffer.from(JSON.stringify(JSON.parse(s.read(row).toString()), null, 2)));
  }, /EXACT_JOURNAL_BYTES/],
  ['next work created', s => { s.evidence.resumes[0].files['control/orchestration/work/extra.json'] = s.add({}); }, /RESUME_NOT_IDEMPOTENT/],
  ['C2 selection exists', s => { s.evidence.boundaries[0].files['control/work-proposals/S4-ambiguity-expressions.json'] = s.add({}); }, /C2_SELECTION/],
  ['unexpected historical receipt inserted', s => {
    s.evidence.boundaries[7].files['control/orchestration/work/historical.json'] = s.add({});
  }, /UNEXPECTED_WORK_OR_EFFECT/],
  ['ten historical plus one fresh work', s => {
    const foreign = `control/orchestration/work/WORK-${'b'.repeat(64)}.json`;
    s.evidence.boundaries[10].files[foreign] = s.add({ work_id: `WORK-${'b'.repeat(64)}` });
  }, /UNEXPECTED_WORK_OR_EFFECT/],
];
for (const [name, mutate, pattern] of attacks) check(`reject ${name}`, () => {
  const s = specimen(); mutate(s); assert.throws(() => verifyMatrix(s.evidence, s.read), pattern);
});
check('source exclusion precedes blob access', () => {
  assert.deepEqual(sourcePaths(['safe.ts', 'calibration/closed-reference.txt', 'nested/calibration/a', 'closed-reference/b']), ['safe.ts']);
  assert.throws(() => sourcePaths(['../escape']), /EXCLUDED_OR_UNSAFE/);
});
check('fixture profile rejects campaign expansion and inherited faults', () => {
  validateFixtureFlags(FIXTURE_FLAGS);
  assert.throws(() => validateFixtureFlags({ ...FIXTURE_FLAGS, F03_C2: 'C' }), /UNRELATED_CASE_FLAG/);
  assert.throws(() => validateFixtureFlags({ ...FIXTURE_FLAGS, ALEPH_FIXTURE_WORK_FAULT: 'bad' }), /INHERITED_FAULT/);
});
check('child environment does not retain secrets or preload hooks', () => {
  const env = fixtureEnvironment({ AWS_SECRET_ACCESS_KEY: 'unit-only', BASH_ENV: '/bad', NODE_OPTIONS: '--bad', LD_PRELOAD: '/bad' });
  assert(!('AWS_SECRET_ACCESS_KEY' in env || 'BASH_ENV' in env || 'NODE_OPTIONS' in env || 'LD_PRELOAD' in env));
});
const scratch = mkdtempSync(join(tmpdir(), 'fresh-c1-offline-tests-'));
try {
  check('run-local tooling is an independent immutable copy; second publication refused', () => {
    const source = join(scratch, 'tool-source'), target = join(scratch, 'tool-frozen');
    mkdirSync(source); writeFileSync(join(source, 'example.js'), 'original');
    freezeTooling(source, target);
    writeFileSync(join(source, 'example.js'), 'changed');
    assert.equal(readFileSync(join(target, 'example.js'), 'utf8'), 'original');
    assert.equal(statSync(join(target, 'example.js')).mode & 0o222, 0);
    assert.throws(() => freezeTooling(source, target), /EEXIST/);
  });
  const base = { nonce: 'short-harmless-test', command: process.execPath, cwd: scratch,
    env: fixtureEnvironment(), expected: 0, deadline: Date.now() + 30000, max_seconds: 5 };
  for (const [name, args, expected, verdict] of [
    ['normal', ['-e', 'console.log("normal");console.error("stderr")'], 0, 'PASS'],
    ['failure', ['-e', 'process.exit(7)'], 0, 'FAIL'],
    ['expected-fault', ['-e', 'process.exit(86)'], 86, 'PASS'],
  ] as const) {
    const directory = join(scratch, name);
    const receipt = await supervise({ ...base, ordinal: passed, args: [...args], expected }, directory);
    assert.equal(receipt.verdict, verdict);
    assert.equal(verifyChild(directory, base.nonce, expected).status, receipt.status);
    passed++; console.log(`PASS supervisor ${name}`);
  }
  const normal = join(scratch, 'normal');
  check('mixed nonce and altered stdout refused', () => {
    assert.throws(() => verifyChild(normal, 'historical-nonce', 0));
    const path = join(normal, 'stdout.bin');
    const data = readFileSync(path);
    assert.equal(data.toString(), 'normal\n');
    writeFileSync(path, 'altered\n');
    assert.throws(() => verifyChild(normal, base.nonce, 0));
    writeFileSync(path, data);
  });
  const interruptionRequest: ChildRequest = { ...base, ordinal: passed,
    args: ['-e', 'setInterval(()=>{},1000)'] };
  const interruptionPath = join(scratch, 'interrupt-request.json'), interruptionOut = join(scratch, 'interrupt-child');
  publish(interruptionPath, interruptionRequest);
  const collector = spawn(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), 'supervisor.js'),
    'child', interruptionPath, interruptionOut], { stdio: 'ignore' });
  const collectorExit = new Promise<number | null>(done => collector.once('close', code => done(code)));
  const readyBy = Date.now() + 5000;
  while (!existsSync(join(interruptionOut, 'process.json'))) {
    assert(Date.now() < readyBy); await new Promise(done => setTimeout(done, 5));
  }
  collector.kill('SIGTERM');
  assert.equal(await collectorExit, 0);
  assert.equal(verifyChild(interruptionOut, base.nonce, 0).verdict, 'INTERRUPTED');
  passed++; console.log('PASS external interruption retains observed child exit');
  const unrelated = spawn(process.execPath, ['-e', 'setInterval(()=>{},1000)'], { stdio: 'ignore' });
  const unrelatedExit = new Promise<void>(done => unrelated.once('close', () => done()));
  try {
    const receipt = await supervise({ ...base, ordinal: passed, args: ['-e', 'setInterval(()=>{},1000)'],
      max_seconds: 0.15 }, join(scratch, 'timeout'));
    assert.equal(receipt.verdict, 'TIMEOUT'); assert.equal(receipt.signal, 'SIGTERM');
    assert.equal(unrelated.exitCode, null); assert.equal(identity(unrelated.pid!).pid, unrelated.pid);
    passed++; console.log('PASS child timeout preserves unrelated process');
    const overall = await supervise({ ...base, ordinal: passed, args: ['-e', 'setInterval(()=>{},1000)'],
      deadline: Date.now() + 150 }, join(scratch, 'overall'));
    assert.equal(overall.verdict, 'TIMEOUT');
    passed++; console.log('PASS overall deadline clips longer child limit');
  } finally { unrelated.kill('SIGTERM'); await unrelatedExit; }
  check('missing receipt never passes', () => {
    rmSync(join(normal, 'result.json'));
    assert.throws(() => verifyChild(normal, base.nonce, 0), /ENOENT/);
  });
  assert.equal((await readFreshC1(join(scratch, 'never-created'))).verdict, 'NOT_RUN'); passed++;
  const interrupted = join(scratch, 'interrupted'); mkdirSync(interrupted);
  publish(join(interrupted, 'launch.json'), { boot: 'simulated-previous-boot', deadline: Date.now() + 10000 });
  assert.equal(disposition(interrupted), 'INTERRUPTED'); passed++;
  const lost = join(scratch, 'lost'); mkdirSync(lost);
  publish(join(lost, 'launch.json'), { boot: bootId(), deadline: Date.now() + 10000 });
  publish(join(lost, 'driver.json'), { identity: { ...identity(process.pid), start_ticks: '-1' } });
  assert.equal(disposition(lost), 'INTERRUPTED'); passed++;
  const absent = join(scratch, 'absent-launch'); mkdirSync(absent);
  assert.equal(disposition(absent), 'FAIL'); passed++;
  publish(join(lost, 'terminal.json'), { verdict: 'PASS', finished_at: Date.now() });
  assert.equal((await readFreshC1(lost)).verdict, 'FAIL'); passed++;
  console.log(`RESULT: PASS (${passed} offline controls). No installed C1 case or model launched.`);
} finally { rmSync(scratch, { recursive: true, force: true }); }

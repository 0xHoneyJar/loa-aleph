import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { verifyRuntimeSnapshot } from '../../adapters/loa/src/runtime-snapshot.ts';
import { verifyLoaInstallation } from '../../adapters/loa/src/installer.ts';
import { stableJsonBytes } from '../../adapters/loa/src/fs.ts';
import { capture, digest, EFFECTS, FAULTS, inside, json, object, OPERATION, PRODUCT,
  LOCKS, NODE_DIGEST, NODE_EXECUTABLE, withoutLeases, type Inventory, type Json, type Verdict } from './common.ts';
import { alive, disposition, requireBudget, verifyCaseChild, verifyPhases, type ChildReceipt } from './supervisor.ts';
import { verifyGuard, verifyOwnership } from './service.ts';

export interface Observation {
  fault: string | null; receipt: string; files: Inventory;
  readback_started_at: number; readback_finished_at: number;
}
export interface Evidence {
  format: 'f03-fresh-c1/v1'; nonce: string; run: string; host: string; work_id: string;
  pins: Json; prepared: Json; boundaries: Observation[]; resumes: Observation[];
}
type Read = (entry: Inventory[string]) => Buffer;
export function verifyReadback(observation: Observation, childFinishedAt: number, deadline: number, nextPhaseAt: number): void {
  assert(Number.isSafeInteger(observation.readback_started_at) && Number.isSafeInteger(observation.readback_finished_at));
  assert(observation.readback_started_at >= childFinishedAt
    && observation.readback_finished_at >= observation.readback_started_at
    && observation.readback_finished_at < deadline, 'TIMEOUT_READBACK');
  assert(observation.readback_finished_at <= nextPhaseAt, 'READBACK_AFTER_PHASE_TRANSITION');
}
function verifySeal(value: Json, journal = false): void {
  const { digest: seal, ...body } = value;
  if (journal) delete body.status;
  assert.equal(digest(stableJsonBytes(body)), seal, 'RECORD_SEAL');
}
export function verifyStartingBasis(id: string, files: Inventory, read: Read): void {
  const sealed = (path: string): Json => {
    assert(files[path], `BASIS_MISSING ${path}`); assert.equal(files[path].mode & 0o222, 0);
    const value = JSON.parse(read(files[path]).toString()), { digest: seal, ...body } = value;
    assert.equal(digest(stableJsonBytes(body)), seal, `BASIS_SEAL ${path}`); return value;
  };
  const work = sealed(`control/orchestration/work/${id}.json`);
  assert.equal(work.work_id, id); assert.equal(work.call, null);
  assert.match(work.basis_digest, /^sha256:[a-f0-9]{64}$/);
  const basis = sealed(`control/orchestration/basis/${work.basis_digest.slice(7)}/manifest.json`);
  assert.equal(basis.digest, work.basis_digest);
  assert.equal(basis.format, 'aleph-loa-work-basis/v1');
  assert.equal(basis.absence_scope, 'complete-run-file-inventory-with-work-history/v2');
  const paths = new Set<string>();
  for (const member of basis.members) {
    assert(!paths.has(member.path)); paths.add(member.path);
    assert.equal(files[member.path]?.digest, member.digest, `CANONICAL_BEFORE ${member.path}`);
    assert.equal(String(files[member.path].size), member.byte_length);
  }
  assert.deepEqual(Object.keys(files).filter(path => !path.startsWith('control/')).sort(),
    basis.canonical_paths.slice().sort(), 'BEFORE_ABSENCE_SCOPE');
  assert.deepEqual(basis.canonical_paths.slice().sort(),
    [...paths].filter(path => !path.startsWith('control/')).sort());
  const state = JSON.parse(read(files['control/run-state.json']).toString());
  assert.equal(work.identity.checkpoint, state.execution.resume.checkpoint_digest);
  assert.deepEqual(work.identity.pins, state.identity);
  assert.equal(work.identity.run_id, state.run_id);
}
/** Pure checks are separately mutation-tested. They do not grant installed admission. */
export function verifyMatrix(evidence: Evidence, read: Read, prefixOnly = false): void {
  const { prepared: tx, work_id: id, boundaries, resumes } = evidence;
  assert.equal(evidence.format, 'f03-fresh-c1/v1');
  if (prefixOnly) assert(boundaries.length >= 3 && boundaries.length <= 11 && resumes.length === 0);
  else {
    assert.equal(boundaries.length, 11, 'ELEVEN_BOUNDARIES_REQUIRED');
    assert.equal(resumes.length, 2, 'TWO_RESUMES_REQUIRED');
  }
  assert.match(id, /^WORK-[a-f0-9]{64}$/);
  assert.equal(tx.status, 'prepared'); assert.equal(tx.work_id, id);
  assert.equal(tx.format, 'aleph-loa-work-transaction/v1');
  assert.deepEqual(tx.state_before.identity, evidence.pins);
  assert.deepEqual(tx.state_after.identity, evidence.pins);
  assert.equal(tx.state_before.full_mode, 'fixture-simulated');
  assert.equal(tx.state_after.full_mode, 'fixture-simulated');
  assert.equal(tx.plan.obligation.operation, OPERATION);
  assert.deepEqual(tx.plan.effects.map((effect: Json) => effect.path), EFFECTS, 'EXACT_C1_EFFECTS');
  assert.equal(tx.state_before.execution.stage, 'S4'); assert.equal(tx.state_after.execution.stage, 'S4');
  assert.equal(BigInt(tx.state_after.ledger.sequence), BigInt(tx.state_before.ledger.sequence) + 3n);
  assert.equal(BigInt(tx.state_after.execution.resume.sequence), BigInt(tx.state_before.execution.resume.sequence) + 1n);
  assert(tx.chain_after.startsWith(tx.chain_before));
  assert.equal(tx.chain_after.slice(tx.chain_before.length).trim().split('\n').length, 3);
  const workPath = `control/orchestration/work/${id}.json`;
  const intentPath = `control/orchestration/commits/${id}-intent.json`;
  const journalPath = `control/transactions/TXN-work-${id.slice(5)}.json`;
  const consumedPath = `control/orchestration/commits/${id}-consumed.json`;
  const changing = new Set([...EFFECTS, ...LOCKS, intentPath, journalPath, consumedPath,
    'control/run-state.json', 'control/ledger-chain.jsonl']);
  const parse = (files: Inventory, path: string): Json => {
    assert(files[path], `MISSING_REQUIRED_EVIDENCE ${path}`); return JSON.parse(read(files[path]).toString());
  };
  let previous: Inventory | undefined;
  for (const [index, observation] of boundaries.entries()) {
    assert.equal(observation.fault, `${OPERATION}:${FAULTS[index]}`, 'FAULT_ORDER');
    const files = observation.files;
    for (const entry of Object.values(files)) read(entry);
    const work = parse(files, workPath);
    assert.equal(work.work_id, id); assert.equal(work.identity.work.obligation.operation, OPERATION);
    assert.deepEqual(work.identity.pins, evidence.pins);
    assert.equal(work.call, null, 'C1_IS_LOCAL_WORK');
    assert.equal(work.identity.checkpoint, tx.state_before.execution.resume.checkpoint_digest);
    assert.equal(work.identity.ledger.chain_head, tx.state_before.ledger.chain_head);
    for (const [i, effect] of tx.plan.effects.entries()) {
      const after = Buffer.from(effect.after_base64, 'base64');
      assert.equal(digest(after), effect.after_digest);
      const applied = index >= 3 && i < Math.min(index - 2, 3);
      const expected = applied ? effect.after_digest : effect.before_digest;
      assert.equal(files[effect.path]?.digest ?? null, expected, `EXACT_EFFECT ${index} ${effect.path}`);
      if (applied) assert(read(files[effect.path]).equals(after));
    }
    assert.equal(read(files['control/ledger-chain.jsonl']).toString(), index >= 7 ? tx.chain_after : tx.chain_before, 'EXACT_CHAIN');
    assert.deepEqual(parse(files, 'control/run-state.json'), index >= 8 ? tx.state_after : tx.state_before, 'EXACT_CHECKPOINT');
    assert.equal(Boolean(files[intentPath]), index >= 1, 'INTENT_ORDER');
    if (index >= 1) {
      const intent = parse(files, intentPath);
      assert.equal(intent.work_id, id); assert.equal(intent.digest, tx.intent_digest);
      assert.equal(intent.journal, journalPath); assert.equal(intent.work_digest, work.digest);
      assert.equal(intent.before_checkpoint, tx.state_before.execution.resume.checkpoint_digest);
      assert.equal(intent.before_chain, tx.state_before.ledger.chain_head);
      assert.equal(files[intentPath].mode & 0o222, 0);
    }
    assert.equal(Boolean(files[journalPath]), index >= 2, 'JOURNAL_ORDER');
    if (index >= 2) {
      const journal = parse(files, journalPath);
      assert.deepEqual(Object.keys(journal).sort(), Object.keys(tx).sort());
      assert.equal(journal.status, index >= 9 ? 'committed' : 'prepared');
      for (const [key, value] of Object.entries(tx)) {
        if (!['status', 'digest'].includes(key)) assert.deepEqual(journal[key], value, `PREPARED_BODY ${key}`);
      }
      verifySeal(journal, true);
      assert(read(files[journalPath]).equals(stableJsonBytes(journal)), 'EXACT_JOURNAL_BYTES');
    }
    assert.equal(Boolean(files[consumedPath]), index === 10, 'CONSUMPTION_LAST');
    if (index === 10) {
      const consumed = parse(files, consumedPath);
      assert.equal(consumed.format, 'aleph-loa-work-consumption/v1');
      assert.equal(consumed.work_id, id); assert.equal(consumed.commit_digest, tx.intent_digest);
      assert.equal(consumed.journal_digest, files[journalPath].digest);
      assert.equal(consumed.after_chain, tx.state_after.ledger.chain_head);
      assert.equal(consumed.after_checkpoint, tx.state_after.execution.resume.checkpoint_digest);
      assert.equal(files[consumedPath].mode & 0o222, 0);
      for (const path of [...EFFECTS, journalPath, 'control/run-state.json', 'control/ledger-chain.jsonl']) {
        assert.deepEqual(files[path], previous![path], 'CONSUMPTION_CANNOT_REPEAT_EFFECTS');
      }
    }
    if (previous) {
      for (const path of new Set([...Object.keys(previous), ...Object.keys(files)])) {
        if (!changing.has(path)) assert.deepEqual(files[path], previous[path], `UNEXPECTED_WORK_OR_EFFECT ${path}`);
      }
    }
    assert(!files['control/work-proposals/S4-ambiguity-expressions.json'], 'C2_SELECTION_FORBIDDEN');
    verifySeal(work);
    for (const path of [intentPath, consumedPath]) if (files[path]) verifySeal(parse(files, path));
    previous = files;
  }
  verifySeal(tx, true);
  for (const observation of resumes) {
    assert.equal(observation.fault, null);
    assert.deepEqual(withoutLeases(observation.files), withoutLeases(previous!), 'RESUME_NOT_IDEMPOTENT');
    for (const path of LOCKS) assert(!observation.files[path], 'RESUME_LEFT_LEASE');
  }
}
export async function readFreshC1(root: string, verifyBeforeTerminal = false): Promise<{ verdict: Verdict; reason?: string }> {
  try {
    const state = disposition(root);
    if (['FAIL', 'TIMEOUT', 'INTERRUPTED'].includes(state)) return { verdict: state };
    if (!verifyBeforeTerminal && state === 'RUNNING') return { verdict: state };
    if (!existsSync(join(root, 'evidence.json'))) {
      return { verdict: state === 'PASS' ? 'FAIL' : state, reason: 'No complete fresh C1 evidence' };
    }
    const launch = json(join(root, 'launch.json')), evidence = json(join(root, 'evidence.json')) as Evidence;
    const owner = verifyOwnership(root), guard = verifyGuard(root);
    if (verifyBeforeTerminal) assert(alive(guard.identity), 'INTERRUPTED_GUARD_LOST');
    else {
      const result = json(join(root, 'guard-result.json'));
      assert.equal(result.guard_digest, digest(readFileSync(join(root, 'guard.json'))), 'GUARD_CHANGED');
      assert.equal(result.ownership_digest, owner.digest); assert.equal(result.verdict, 'PASS');
      const terminal = json(join(root, 'terminal.json')), completion = json(join(root, 'completion.json'));
      assert.equal(terminal.completion_digest, digest(readFileSync(join(root, 'completion.json'))));
      assert.equal(completion.ownership_digest, owner.digest); assert.equal(completion.verdict, 'PASS');
      assert.equal(completion.verification, terminal.verification);
      assert(completion.finished_at <= terminal.finished_at);
    }
    assert.equal(launch.root, root, 'CASE_PATH_CHANGED');
    assert(launch.deadline - launch.started_at === 86400 * 1000, 'EXACT_OVERALL_CEILING');
    assert.equal(evidence.nonce, launch.nonce, 'CASE_NONCE');
    assert.equal(launch.product_commit, PRODUCT.commit);
    assert.equal(evidence.host, join(root, 'fixture/host'));
    const runId = inside(join(evidence.host, 'grimoires/loa/aleph/runs'), evidence.run);
    assert(!runId.includes('/')); assert.equal(runId, json(join(root, 'identity.json')).run_id);
    assert.equal(evidence.prepared.state_before.run_id, runId);
    assert.equal(evidence.prepared.state_after.run_id, runId);
    assert.deepEqual(evidence.pins, json(join(root, 'identity.json')).pins);
    assert.deepEqual(json(join(root, 'prepared.json')), evidence.prepared, 'PREPARED_RECEIPT_CHANGED');
    for (const [index, observation] of evidence.boundaries.entries()) {
      assert.deepEqual(json(join(root, `boundary-${String(index + 1).padStart(2, '0')}.json`)),
        { nonce: evidence.nonce, run: evidence.run, work_id: evidence.work_id, ...observation }, 'BOUNDARY_RECEIPT_CHANGED');
    }
    for (const [index, observation] of evidence.resumes.entries()) {
      assert.deepEqual(json(join(root, `resume-${index + 1}.json`)),
        { nonce: evidence.nonce, run: evidence.run, ...observation }, 'RESUME_RECEIPT_CHANGED');
    }
    const store = join(root, 'objects');
    verifyMatrix(evidence, entry => object(store, entry));
    for (const observation of evidence.boundaries.slice(0, 2)) {
      verifyStartingBasis(evidence.work_id, observation.files, entry => object(store, entry));
    }
    const phases = verifyPhases(root, verifyBeforeTerminal ? undefined : json(join(root, 'terminal.json')).finished_at,
      verifyBeforeTerminal ? undefined : json(join(root, 'terminal.json')).finished_tick);
    const firstOrdinal = Number(evidence.boundaries[0].receipt.slice('children/'.length));
    let startCount = 0, prefixEnd = launch.started_at;
    for (let ordinal = 1; ordinal < firstOrdinal; ordinal++) {
      const receipt = verifyCaseChild(root, join(root, 'children', String(ordinal).padStart(4, '0')), 0);
      assert.equal(receipt.verdict, 'PASS'); assert.equal(receipt.ordinal, ordinal);
      assert.equal(receipt.command, launch.node); assert.equal(receipt.executable_digest, launch.node_digest);
      assert.equal(receipt.child.boot, launch.boot);
      assert(receipt.started_at >= prefixEnd);
      const p = phases[receipt.started_at < phases[1].started_at ? 0 : 1];
      assert.equal(receipt.deadline, p.deadline); assert.equal(receipt.max_seconds, p.child_seconds);
      prefixEnd = receipt.finished_at;
      if (receipt.args[0] === join(evidence.host, '.claude/aleph/bin/loa-aleph.mjs') && receipt.args.includes('start')) {
        startCount++;
        assert.equal(JSON.parse(readFileSync(receipt.stdout, 'utf8')).run_id, runId);
      }
    }
    assert.equal(startCount, 1, 'ONE_SUPPORTED_INSTALLED_START');
    const observations = [...evidence.boundaries, ...evidence.resumes], receipts: ChildReceipt[] = [];
    let previousEnd = prefixEnd;
    for (const [index, observation] of observations.entries()) {
      inside(root, join(root, observation.receipt));
      assert.match(observation.receipt, /^children\/\d{4}$/);
      const receipt = verifyCaseChild(root, join(root, observation.receipt), index < 11 ? 86 : 0);
      assert.equal(receipt.verdict, 'PASS'); assert.equal(receipt.status, index < 11 ? 86 : 0);
      assert.equal(receipt.child.boot, launch.boot, 'MIXED_BOOT');
      assert(receipt.started_at >= previousEnd && receipt.finished_at <= launch.deadline, 'STALE_OR_OVERLAPPING_RECEIPT');
      assert.equal(receipt.command, launch.node);
      assert.equal(receipt.executable_digest, launch.node_digest);
      assert.equal(receipt.ordinal, Number(observation.receipt.slice('children/'.length)));
      if (index > 0) assert.equal(receipt.ordinal, receipts[index - 1].ordinal + 1, 'UNADMITTED_CHILD_BETWEEN_BOUNDARIES');
      assert(receipt.max_seconds <= (index === 0 ? 10800 : 1800), 'PER_CHILD_LIMIT');
      const p = phases[index === 0 ? 1 : index < 11 ? 2 : 3];
      assert.equal(receipt.deadline, p.deadline); assert.equal(receipt.max_seconds, p.child_seconds);
      assert(receipt.started_at >= p.started_at);
      verifyReadback(observation, receipt.finished_at, p.deadline, phases[index === 0 ? 2 : index < 11 ? 3 : 4].started_at);
      assert.deepEqual(receipt.args, [join(evidence.host, '.claude/aleph/bin/loa-aleph.mjs'),
        '--root', evidence.host, '--json', '--allow-fixture-simulation', 'resume', runId], 'IDENTICAL_INSTALLED_ARGV');
      assert.equal(receipt.env.ALEPH_FIXTURE_WORK_FAULT ?? null, observation.fault, 'EXACT_FAULT_ENVIRONMENT');
      if (index > 0 && index < 11) assert.equal(receipt.expected, 86);
      if (index < 11) {
        for (const [i, path] of LOCKS.entries()) {
          assert(observation.files[path], 'FAULT_LEASE_EVIDENCE_REQUIRED');
          const lease = JSON.parse(object(store, observation.files[path]).toString());
          assert.equal(lease.format, i === 0 ? 'aleph-loa-orchestration-lock/v1' : 'aleph-loa-ledger-lock/v1');
          assert.equal(lease.pid, String(receipt.child.pid), 'STALE_LEASE_OWNER');
          assert.match(lease.nonce, /^sha256:[a-f0-9]{64}$/);
          assert(Date.parse(lease.acquired_at) >= receipt.started_at - 1000
            && Date.parse(lease.acquired_at) <= receipt.finished_at + 1000, 'LEASE_TIME');
        }
      }
      if (index >= 11) {
        const report = JSON.parse(readFileSync(receipt.stdout, 'utf8'));
        assert.equal(report.run_id, runId); assert.equal(report.stage, 'S4');
        assert.equal(report.details.work.kind, 'proposal');
        assert.equal(report.details.work.operation, 'ambiguity.expressions');
        assert.equal(report.details.work.input_path, 'control/work-proposals/S4-ambiguity-expressions.json');
        if (index === 12) assert.deepEqual(report.details.work,
          JSON.parse(readFileSync(receipts[11].stdout, 'utf8')).details.work);
      }
      previousEnd = observation.readback_finished_at; receipts.push(receipt);
    }
    assert.equal(new Set(receipts.map(r => `${r.child.boot}:${r.child.pid}:${r.child.start_ticks}`)).size, 13, 'FRESH_PROCESSES');
    assert.equal(new Set(observations.map(o => o.receipt)).size, 13, 'DUPLICATE_RECEIPT');
    if (!verifyBeforeTerminal) {
      const terminal = json(join(root, 'terminal.json'));
      assert.match(terminal.verification, /^children\/\d{4}$/);
      const verified = verifyCaseChild(root, join(root, terminal.verification), 0);
      assert.equal(verified.verdict, 'PASS');
      assert.equal(verified.ordinal, receipts[12].ordinal + 1);
      assert.equal(verified.command, launch.node);
      assert.equal(verified.executable_digest, launch.node_digest);
      assert.equal(verified.child.boot, launch.boot);
      assert(verified.started_at >= receipts[12].finished_at && verified.finished_at <= launch.deadline);
      assert.equal(verified.deadline, phases[4].deadline); assert.equal(verified.max_seconds, phases[4].child_seconds);
      assert.deepEqual(verified.args, [join(launch.tooling_root, 'qualification/fresh-c1/reader.js'), root, '--verify-before-terminal']);
      assert.equal(JSON.parse(readFileSync(verified.stdout, 'utf8')).verdict, 'PASS');
      assert(terminal.finished_at >= verified.finished_at && terminal.finished_at < phases[4].deadline);
    }
    assert.deepEqual(readdirSync(join(root, 'children')).sort(),
      Array.from({ length: receipts[12].ordinal + 1 }, (_, index) => String(index + 1).padStart(4, '0')),
      'NO_MISSING_OR_EXTRA_EXECUTION');
    assert.deepEqual(capture(launch.tooling_root), launch.tooling, 'RETAINED_TOOLING_CHANGED');
    assert.equal(launch.node_digest, NODE_DIGEST);
    assert.equal(launch.node, NODE_EXECUTABLE);
    assert.equal(evidence.pins.core.tree_digest, PRODUCT.core);
    assert.equal(evidence.pins.adapter.tree_digest, PRODUCT.adapter);
    assert.equal(evidence.pins.checker_digest, PRODUCT.checker);
    assert.equal(evidence.pins.bundle.payload_digest, PRODUCT.payload);
    const installed = json(join(root, 'installed.json'));
    assert.equal(installed.host, evidence.host);
    assert.deepEqual(capture(join(evidence.host, '.claude/aleph')), installed.files, 'INSTALLED_EXECUTABLE_CHANGED');
    const installation = verifyLoaInstallation(evidence.host);
    assert.equal(installation.result, 'PASS', installation.errors.join('; '));
    const snapshotPath = join(evidence.run, 'control/runtime/snapshot.json');
    verifyRuntimeSnapshot(snapshotPath, { allowSimulation: true });
    const snapshot = json(snapshotPath);
    assert.equal(snapshot.node.executable, launch.node);
    assert.equal(snapshot.node.executable_digest, launch.node_digest);
    const before = capture(evidence.run);
    assert.deepEqual(before, evidence.resumes[1].files, 'FINAL_STATE_CHANGED');
    // Runtime was authenticated before import. This read-only entry rederives every
    // consumed transaction from its sealed historical BEFORE basis and pinned Core.
    const module = join(evidence.run, 'control/runtime/bundle/runtime-js/adapters/loa/src/orchestration.js');
    const pinned = await import(pathToFileURL(module).href);
    assert.equal(pinned.pendingOrchestrationCommitWork(evidence.run), null, 'UNFINISHED_WORK');
    assert.deepEqual(capture(evidence.run), before, 'AUTHENTICATION_MUTATED_RUN');
    if (verifyBeforeTerminal) requireBudget(root);
    else verifyPhases(root, json(join(root, 'terminal.json')).finished_at, json(join(root, 'terminal.json')).finished_tick);
    return { verdict: 'PASS' };
  } catch (error) {
    return { verdict: String(error).includes('INTERRUPTED') ? 'INTERRUPTED'
      : String(error).includes('TIMEOUT') ? 'TIMEOUT' : 'FAIL', reason: String(error) };
  }
}
if (resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  const result = await readFreshC1(resolve(process.argv[2]), process.argv[3] === '--verify-before-terminal');
  console.log(JSON.stringify(result));
  process.exitCode = result.verdict === 'PASS' ? 0 : 1;
}

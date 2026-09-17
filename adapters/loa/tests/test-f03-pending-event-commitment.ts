// HUMAN C-03 regressions. Structural fixtures only; no provider/native calls.
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { makeSemanticFixture } from '../../../scripts/semantic-fixture-support.ts';
import { loadRun, type RunModel } from '../../../scripts/lib/run-model.ts';
import { runK2 } from '../../../scripts/lib/checks-k2.ts';
import { ResultCollector } from '../../../scripts/lib/results.ts';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const runtime = process.argv.includes('--runtime');
const core = await import(pathToFileURL(join(root, runtime
  ? 'runtime-js/scripts/lib/source-walk-transition.js' : 'scripts/lib/source-walk-transition.ts')).href
) as typeof import('../../../scripts/lib/source-walk-transition.ts');
const scratch = mkdtempSync(join(tmpdir(), 'aleph-c03-event-'));
const records: Array<{ id: string; result: 'PASS' }> = [];
function test(id: string, run: () => void) { run(); records.push({ id, result: 'PASS' }); }
function checks(model: RunModel) {
  const result = new ResultCollector('C03');
  runK2(result, model, root);
  return result.checks.filter((entry) => entry.id === 'K2.14');
}
try {
  makeSemanticFixture(scratch, 'A counter rose.', undefined, undefined, '1.9.0-provisional');
  let packets = readFileSync(join(scratch, 'ledgers/packet-index.md'), 'utf8');
  for (const line of packets.split('\n').filter((line) => /^\| (?:PKT|EVID|FRAG)-0701 \|/u.test(line))) {
    packets = packets.replace(line, [line, line.replaceAll('0701', '0702'), line.replaceAll('0701', '0703')].join('\n'));
  }
  writeFileSync(join(scratch, 'ledgers/packet-index.md'), packets);
  const full = loadRun(scratch), walk = full.sourceWalk;
  const first = walk.events[0].raw;
  const second = first.replace('EVT-0701', 'EVT-0702').replace('PKT-0701', 'PKT-0702')
    .replace('| 1 |', '| 2 |').replace('| committed |', '| pending |');
  const third = second.replaceAll('0702', '0703').replace('| 2 |', '| 3 |');
  const cursor = `| CUR-0702 | SRC-701 | 0 | SP-0701 | 2 | WLK-0701 | EVT-0701 | ${full.corpus.sources[0].values.contentHash} | bounded-pause |`;
  const before = core.projectSourceWalk(full, full.sourceWalkDocument!.text
    .replace(walk.gapReviews[0].raw + '\n', '')
    .replace(walk.intervals[0].raw, walk.intervals[0].raw.replace('| PKT-0701 |', '| PKT-0701, PKT-0702, PKT-0703 |'))
    .replace(first, [first, second, third].join('\n'))
    .replace(walk.cursors[1].raw, cursor)
    .replace(walk.completions[0].raw, walk.completions[0].raw.replace('GAP-0701', 'none').replace('| complete |', '| blocked |')));
  test('C03-01 legal paused K2.14 state', () => assert(checks(before).every((entry) => entry.status === 'PASS')));
  const plan = core.derivePendingEventCommitment(before, 'EVT-0702');
  const after = core.projectSourceWalk(before, Buffer.from(plan.after_base64, 'base64').toString());
  test('C03-02 pending to committed', () => assert.equal(after.sourceWalk.events[1].values.status, 'committed'));
  test('C03-03 exact nine-field identity', () => {
    const { status: _old, ...oldFields } = before.sourceWalk.events[1].values;
    const { status: _next, ...nextFields } = after.sourceWalk.events[1].values;
    assert.deepEqual(nextFields, oldFields);
    assert.equal(after.sourceWalk.events.length, before.sourceWalk.events.length);
  });
  test('C03-04 exact pending before-image', () => {
    assert.deepEqual(plan.event_commitments, [{ event_id: 'EVT-0702', before_row: second, after_row: after.sourceWalk.events[1].raw }]);
    assert.equal(plan.before_digest, 'sha256:' + createHash('sha256').update(before.sourceWalkDocument!.text).digest('hex'));
  });
  test('C03-05 next sibling pending', () => assert.equal(after.sourceWalk.events[2].raw, third));
  test('C03-06 cursor remains at next sibling', () => {
    const current = after.sourceWalk.cursors.at(-1)!.values;
    assert.equal(current.byteOffset, '0'); assert.equal(current.nextEventOrdinal, '3');
    assert.equal(current.sharedPositionKey, 'SP-0701'); assert.equal(current.predecessorEventId, 'EVT-0702');
  });
  test('C03-07 intermediate K2.14 state', () => assert(checks(after).every((entry) => entry.status === 'PASS')));
  test('C03-08 registered after-image validation', () => assert.deepEqual(core.validateSourceWalkCompletionWrite(before, after), plan));
  const finalPlan = core.derivePendingEventCommitment(after, 'EVT-0703');
  const final = core.projectSourceWalk(after, Buffer.from(finalPlan.after_base64, 'base64').toString());
  test('C03-09 final sibling legal cursor progress', () => {
    assert.equal(final.sourceWalk.cursors.at(-1)!.values.reason, 'source-complete');
    assert(final.sourceWalk.events.every((entry) => entry.values.status === 'committed'));
    assert(checks(final).every((entry) => entry.status === 'PASS'));
  });
  test('C03-10 repeated commitment no-op', () => {
    const repeated = core.derivePendingEventCommitment(final, 'EVT-0703');
    assert.equal(repeated.after_base64, finalPlan.after_base64); assert.equal(repeated.event_commitments.length, 0);
  });
  test('C03-11 deterministic derivation', () => assert.deepEqual(core.derivePendingEventCommitment(before, 'EVT-0702'), plan));
  const changed = (model: RunModel, old: string, next: string) => core.projectSourceWalk(model, model.sourceWalkDocument!.text.replace(old, next));
  const committed = after.sourceWalk.events[1].raw;
  for (const [name, field, value] of [
    ['event ID', 1, 'EVT-9999'], ['source ID', 2, 'SRC-999'], ['start byte', 3, '1'], ['end byte', 4, '2'],
    ['shared key', 5, 'SP-9999'], ['ordinal', 6, '9'], ['packet ID', 7, 'PKT-0701'],
    ['origin', 8, 'gap-reconciliation'], ['producer', 9, 'CALL-forged'],
  ] as const) test(`C03-negative changed ${name}`, () => {
    const cells = committed.split('|'); cells[field] = ` ${value} `;
    assert.throws(() => core.validateSourceWalkCompletionWrite(before, changed(after, committed, cells.join('|'))),
      /WORK_SOURCE_COMPLETION/u);
  });
  for (const [name, base, old, next] of [
    ['pending changed pending', before, second, second.replace('PKT-0702', 'PKT-0701')],
    ['committed to pending', before, first, first.replace('committed', 'pending')],
    ['committed changed committed', before, first, first.replace('PKT-0701', 'PKT-0702')],
    ['pending deletion', before, second + '\n', ''],
    ['committed deletion', before, first + '\n', ''],
    ['successor event', after, committed, committed + '\n' + committed.replace('EVT-0702', 'EVT-9999')],
    ['duplicate ordinal', after, third, third.replace('| 3 |', '| 2 |')],
  ] as const) test(`C03-negative ${name}`, () => assert.throws(
    () => core.validateSourceWalkCompletionWrite(before, changed(base, old, next)), /WORK_SOURCE_COMPLETION/u));
  test('C03-negative skip pending sibling', () => assert.throws(
    () => core.derivePendingEventCommitment(before, 'EVT-0703'), /current cursor does not expect/u));
  test('C03-negative cursor before commitment', () => assert.throws(
    () => core.validateSourceWalkCompletionWrite(before, changed(after, committed, second)), /WORK_SOURCE_COMPLETION/u));
  test('C03-negative missing packet', () => assert.throws(
    () => core.derivePendingEventCommitment({ ...before, packets: [] }, 'EVT-0702'), /WORK_SOURCE_COMPLETION/u));
  test('C03-negative missing exact fragment', () => assert.throws(
    () => core.derivePendingEventCommitment({ ...before, exactEvidence: { ...before.exactEvidence, fragments: [] } }, 'EVT-0702'),
    /WORK_SOURCE_COMPLETION/u));
  test('C03-negative caller-authored after-image', () => assert.throws(
    () => core.validateSourceWalkCompletionWrite(before, changed(after, 'Current procedural frontier;', 'Caller invented note;')),
    /WORK_SOURCE_COMPLETION/u));
  for (const version of ['1.2.0-provisional', '1.3.0-provisional', '1.4.0-provisional', '1.5.0-provisional',
    '1.6.0-provisional', '1.7.0-provisional', '1.8.0-provisional']) test(`C03 predecessor ${version}`, () => assert.throws(
    () => core.derivePendingEventCommitment({ ...before, manifest: { ...before.manifest!, runFormatVersion: version } }, 'EVT-0702'),
    /1.9 orchestration identity required/u));
  test('C03 K2.14 implementation unchanged', () => assert.equal(createHash('sha256')
    .update(readFileSync(join(root, 'scripts/lib/checks-k2.ts'))).digest('hex'),
  '23369afafd113f0012af4f321ef70dedd694ed883252d296f3edc7c9a4a7fcf3'));
  console.log(JSON.stringify({ result: 'PASS', evidence: 'fixture-structural only', records, passed: records.length, total: records.length }, null, 2));
} finally { rmSync(scratch, { recursive: true, force: true }); }

import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { makeSemanticFixture } from '../../../scripts/semantic-fixture-support.ts';
import { loadRun, parseSourceWalk, type RunModel } from '../../../scripts/lib/run-model.ts';
import { deriveSourceWalkCompletion, projectSourceWalk, validateSourceWalkCompletionWrite, SOURCE_WALK_PATH } from '../../../scripts/lib/source-walk-transition.ts';
import { materialHash, representationUsesMarkdown } from '../../../scripts/lib/source-representation.ts';
import { deriveWorkTransition, selectNextWork } from '../../../scripts/lib/work-transitions.ts';
import { semanticProducerViewPaths, validateSemanticProducerDelivery } from '../../../scripts/lib/semantic-review.ts';

// Synthetic Core snapshots only. CLI, authentication and journal tests remain
// separate proof obligations; this suite does not establish F-03 reachability.
const scratch = mkdtempSync(join(tmpdir(), 'f03-completion-'));
let count = 0;
function test(name: string, check: () => void): void { check(); count++; console.log(`PASS C02-${count} ${name}`); }
function alter(model: RunModel, transform: (text: string) => string): RunModel {
  return projectSourceWalk(model, transform(model.sourceWalkDocument!.text));
}
function completion(model: RunModel): string { return model.sourceWalk.completions[0].raw; }
function derive(before: RunModel, history: RunModel): RunModel {
  return projectSourceWalk(history, Buffer.from(deriveSourceWalkCompletion(before, history).after_base64, 'base64').toString('utf8'));
}
try {
  const afterRun = join(scratch, 'after');
  const seed = makeSemanticFixture(afterRun, undefined, undefined, undefined, '1.9.0-provisional');
  const fixture = loadRun(afterRun), original = fixture.sourceWalkDocument!.text;
  const fixtureComplete = completion(fixture);
  const initialRow = fixtureComplete.replace('CUR-0702', 'CUR-0701').replace('GAP-0701', 'none').replace('| complete |', '| blocked |');
  const initialText = original.split('\n').filter((line) => !/^\| (?:WLK|EVT|GAP)-/u.test(line)
    && (!/^\| CUR-/u.test(line) || line.startsWith('| CUR-0701 |'))).join('\n').replace(fixtureComplete, initialRow);
  const beforeRun = join(scratch, 'before'); cpSync(afterRun, beforeRun, { recursive: true });
  writeFileSync(join(beforeRun, SOURCE_WALK_PATH), initialText);
  writeFileSync(join(beforeRun, 'ledgers/packet-index.md'), readFileSync(join(beforeRun, 'ledgers/packet-index.md'), 'utf8')
    .split('\n').filter((line) => !/^\| (?:PKT|EVID|FRAG|TRN)-/u.test(line)).join('\n'));
  writeFileSync(join(beforeRun, 'ledgers/representation-uses.md'), representationUsesMarkdown([]));
  const initial = loadRun(beforeRun);
  const absent: RunModel = { ...initial, sourceWalkDocument: null, sourceWalk: parseSourceWalk(null),
    files: initial.files.filter((file) => file.relativePath !== SOURCE_WALK_PATH) };
  const frontierHistory = alter(fixture, (text) => text.split('\n').filter((line) => !line.startsWith('| GAP-')).join('\n')
    .replace(fixtureComplete, initialRow));
  const frontier = derive(initial, frontierHistory);
  const complete = derive(frontier, fixture);
  const gap = fixture.sourceWalk.gapReviews[0].raw;
  const indeterminate = gap.replace('no-gap-candidate-found', 'cannot-determine').replace('| closed |', '| blocked |');
  const blockedGap = derive(frontier, alter(fixture, (text) => text.replace(gap, indeterminate)));
  const additional = gap.replaceAll('GAP-0701', 'GAP-0702').replace('manual-gap-0701', 'manual-gap-0702');
  const twoGaps = derive(blockedGap, alter(blockedGap, (text) => text.replace(indeterminate, `${indeterminate}\n${additional}`)));
  test('absent to blocked', () => {
    const plan = deriveSourceWalkCompletion(absent, initial);
    assert.equal(plan.completions[0].progression, 'absent-to-blocked');
    assert.equal(plan.before_digest, null);
  });
  test('blocked frontier advances without premature completion', () => {
    assert.equal(frontier.sourceWalk.completions[0].values.finalCursorId, 'CUR-0702');
    assert.equal(frontier.sourceWalk.completions[0].values.completionState, 'blocked');
    assert.equal(deriveSourceWalkCompletion(initial, frontierHistory).completions[0].progression, 'blocked-to-blocked');
  });
  test('new gap reviews accumulate in retained order while indeterminate remains blocked', () => {
    assert.equal(twoGaps.sourceWalk.completions[0].values.gapReviewIds, 'GAP-0701, GAP-0702');
    assert.equal(twoGaps.sourceWalk.completions[0].values.completionState, 'blocked');
  });
  test('blocked to complete requires existing K2.14 predicates', () => {
    assert.equal(complete.sourceWalk.completions[0].values.completionState, 'complete');
    assert.equal(deriveSourceWalkCompletion(frontier, fixture).completions[0].progression, 'blocked-to-complete');
  });
  test('complete is an exact idempotent no-op', () => {
    const plan = deriveSourceWalkCompletion(complete, complete);
    assert.equal(plan.before_digest, plan.after_digest);
    assert.equal(plan.completions[0].progression, 'complete-no-op');
  });
  test('exact before row and file digest retained in Core proof', () => {
    const proof = deriveSourceWalkCompletion(initial, frontierHistory);
    assert.equal(proof.completions[0].before_row, initialRow);
    assert.equal(proof.before_digest, materialHash(initialText));
    assert.equal(proof.after_digest, materialHash(frontier.sourceWalkDocument!.text));
    assert(proof.prerequisite_hashes.some((entry) => entry.path === SOURCE_WALK_PATH && entry.digest === proof.before_digest));
  });
  test('repeated derivation is byte deterministic', () => {
    assert.deepEqual(deriveSourceWalkCompletion(initial, frontierHistory), deriveSourceWalkCompletion(initial, frontierHistory));
    assert.equal(derive(frontier, frontier).sourceWalkDocument!.text, frontier.sourceWalkDocument!.text);
  });
  const reject = (name: string, before: RunModel, after: RunModel) =>
    test(name, () => assert.throws(() => validateSourceWalkCompletionWrite(before, after), /WORK_SOURCE_COMPLETION/u));
  reject('duplicate completion row', initial, alter(frontier, (text) => text.replace(completion(frontier), `${completion(frontier)}\n${completion(frontier)}`)));
  reject('stale final cursor', initial, alter(frontier, (text) => text.replace(completion(frontier), completion(frontier).replace('CUR-0702', 'CUR-0701'))));
  const regressing = frontier.sourceWalk.cursors[0].raw.replace('CUR-0701', 'CUR-0799');
  reject('regressing cursor', frontier, alter(frontier, (text) => text.replace(frontier.sourceWalk.cursors.at(-1)!.raw,
    `${frontier.sourceWalk.cursors.at(-1)!.raw}\n${regressing}`)));
  for (const [name, from, to] of [
    ['source ID', 'SRC-701', 'SRC-799'], ['source hash', fixture.sourceWalk.completions[0].values.sourceHash, materialHash('changed')],
    ['source length', `| ${fixture.sourceWalk.completions[0].values.sourceLengthBytes} |`, '| 999 |'],
    ['unknown cursor', 'CUR-0702', 'CUR-9999'], ['arbitrary actor', 'orchestrator', 'parent-model'],
    ['arbitrary note', 'Current procedural frontier; source completion remains unmet.', 'Parent after-image.'],
  ]) reject(`changed ${name}`, initial, alter(frontier, (text) => text.replace(completion(frontier), completion(frontier).replace(from, to))));
  for (const [name, ids] of [['removed prior gap', 'GAP-0702'], ['reordered prior gaps', 'GAP-0702, GAP-0701'],
    ['invented gap', 'GAP-0701, GAP-0702, GAP-9999']]) {
    reject(name, twoGaps, alter(twoGaps, (text) => text.replace(completion(twoGaps), completion(twoGaps).replace('GAP-0701, GAP-0702', ids))));
  }
  reject('complete to blocked', complete, alter(complete, (text) => text.replace(completion(complete), completion(complete).replace('| complete |', '| blocked |'))));
  reject('materially different complete', complete, alter(complete, (text) => text.replace(completion(complete), `${completion(complete).slice(0, -1)}changed |`)));
  for (const key of ['intervals', 'events', 'cursors', 'gapReviews'] as const) {
    const historical = complete.sourceWalk[key][0].raw;
    reject(`historical ${key} mutation`, complete, alter(complete, (text) => text.replace(historical, `${historical} altered`)));
  }
  reject('non-row history mutation', initial, alter(frontier, (text) => text.replace('# Source Walk Ledger', '# Parent-authored replacement')));
  reject('forged before projection', alter(initial, (text) => text.replace(initialRow, initialRow.replace('CUR-0701', 'CUR-9999'))), frontier);
  test('1.8 cannot opt into the projection capability', () => {
    const old = { ...initial, manifest: { ...initial.manifest!, runFormatVersion: '1.8.0-provisional' } };
    assert.throws(() => deriveSourceWalkCompletion(old, frontierHistory), /1.9 orchestration identity required/u);
  });
  test('raw producer fixture bytes are unchanged', () => {
    const path = 'verification/harness/semantic-process/manual-producer-0701.raw.json';
    assert(readFileSync(join(afterRun, path)).equals(readFileSync(join(beforeRun, path))));
  });
  test('Core S2 preparation reopens its exact control recipe and derives an exact packet/walk projection', () => {
    const execution = { stage: 'S2', stage_status: 'entered', core_state: 'DISTILLING', blocked: false };
    const preparation = selectNextWork(initial, execution);
    assert.equal(preparation.kind, 'local');
    const prepared = deriveWorkTransition(initial, execution, preparation, null, '2026-09-17T00:00:00.000Z');
    for (const effect of prepared.effects) {
      mkdirSync(dirname(join(beforeRun, effect.path)), { recursive: true });
      writeFileSync(join(beforeRun, effect.path), Buffer.from(effect.after_base64, 'base64'));
    }
    const model = loadRun(beforeRun), work = selectNextWork(model, execution);
    assert.equal(work.kind, 'worker');
    if (work.kind !== 'worker') throw new Error('extractor required');
    const value = structuredClone(seed.returned); value.producer_invocation_id = work.call.prepared_call_id!;
    const transition = deriveWorkTransition(model, execution, work, {
      call_id: work.call.prepared_call_id!, role: 'extractor', context_id: 'synthetic-Core-discriminator',
      producer_context_id: null, raw_digest: materialHash(JSON.stringify(value)),
      receipt_digest: materialHash('fixture-only; no native receipt'), simulation: true, value: value as never,
    }, '2026-09-17T00:00:01.000Z');
    assert.equal(transition.family, 's2-capture');
    assert.equal(transition.source_completion!.completions[0].before_row, initialRow);
    assert.equal(transition.source_completion!.completions[0].progression, 'blocked-to-blocked');
    assert(transition.effects.some((effect) => effect.path === 'ledgers/representation-uses.md'));
    assert(Buffer.from(transition.effects.find((effect) => effect.path === 'ledgers/packet-index.md')!.after_base64, 'base64')
      .toString('utf8').includes('| PKT-0001 |'));
    const attachments = work.call.allowlist.map((path) => ({ path, bytes: readFileSync(join(beforeRun, path)) }));
    for (const effect of transition.effects) {
      mkdirSync(dirname(join(beforeRun, effect.path)), { recursive: true });
      writeFileSync(join(beforeRun, effect.path), Buffer.from(effect.after_base64, 'base64'));
    }
    const current = loadRun(beforeRun);
    assert.throws(() => validateSemanticProducerDelivery(current, 'extractor', 'S2', work.call.prepared_call_id!,
      work.call.task_line, attachments), /selected producer context changed/u);
    const historical = validateSemanticProducerDelivery(current, 'extractor', 'S2', work.call.prepared_call_id!,
      work.call.task_line, attachments, true);
    assert.deepEqual(historical.legal_source_ids, ['SRC-701']);
    const changed = attachments.map((entry) => ({ ...entry, bytes: Buffer.from(entry.bytes) }));
    const view = changed.find((entry) => entry.path === semanticProducerViewPaths(work.call.prepared_call_id!).view)!;
    view.bytes = Buffer.from(view.bytes.toString('utf8').replace('CUR-0701', 'CUR-9999'));
    assert.throws(() => validateSemanticProducerDelivery(current, 'extractor', 'S2', work.call.prepared_call_id!,
      work.call.task_line, changed, true), /retained producer view differs/u);
  });
  console.log(`${count}/${count} Core completion projection cases; fixture only. F-03 remains OPEN.`);
} finally { rmSync(scratch, { recursive: true, force: true }); }

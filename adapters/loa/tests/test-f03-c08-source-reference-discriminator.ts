#!/usr/bin/env node
/** Historical C-08 discriminator. PASS means the conflict reproduced, not
 * that the three-digit installed path works. No production rule is changed. */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const runtime = process.argv.includes('--runtime');
const installedArg = process.argv.indexOf('--installed-run');
const installedRun = installedArg < 0 ? null : resolve(process.argv[installedArg + 1]);
const scratch = mkdtempSync(join(tmpdir(), 'f03-c08-discriminator-'));
const intake = await import(runtime ? '../../../runtime-js/adapters/loa/src/intake.js' : '../src/intake.ts') as typeof import('../src/intake.ts');
const ambiguity = await import(runtime ? '../../../runtime-js/scripts/lib/internal-ambiguity.js' : '../../../scripts/lib/internal-ambiguity.ts') as typeof import('../../../scripts/lib/internal-ambiguity.ts');
const digest = (bytes: Buffer) => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
const cases: string[] = [];
function check(name: string, action: () => void) { action(); cases.push(name); console.log(`PASS ${name}`); }

const host = join(scratch, 'host'), run = join(host, 'run'), input = join(host, 'input.md');
mkdirSync(host); writeFileSync(input, 'Synthetic source-reference conflict only.\n');
const snapshot = intake.snapshotCorpus({ loaRoot: host, runDir: run, runId: 'RUN-C08-discriminator',
  inputs: [input], capturedAt: '2026-09-26T15:26:25Z', formalLayout: true });
check('ordinary intake allocates SRC-001', () => assert.equal(snapshot.files[0].source_id, 'SRC-001'));
check('intake snapshot reauthenticates exact source bytes', () => assert.deepEqual(intake.verifyCorpusSnapshot(run), snapshot));
const retained = readFileSync(join(run, snapshot.files[0].frozen_path));
check('allocated source hash equals the retained exact bytes', () => assert.equal(digest(retained), snapshot.files[0].digest));
const candidate = (id: string) => JSON.stringify([{ kind: 'source-locus', source_id: id, locator: 'L1-L1', span_hash: digest(retained) }]);
check('C2 source-locus grammar rejects the exact allocated source ID', () => {
  const parsed = ambiguity.parseCandidateRefs(candidate(snapshot.files[0].source_id));
  assert.equal(parsed.clean, false); assert.equal(parsed.error, 'source-locus candidate grammar is invalid');
});
check('four-digit spelling passes the retained grammar', () => assert.equal(ambiguity.parseCandidateRefs(candidate('SRC-0001')).clean, true));
check('four-digit spelling is not an alias in the retained corpus', () => assert(!snapshot.files.some((s) => s.source_id === 'SRC-0001')));
check('PKT candidate grammar is independent of this source-ID conflict', () =>
  assert.equal(ambiguity.parseCandidateRefs('[{"kind":"PKT","id":"PKT-0001"}]').clean, true));

// Reuse the exact retained synthetic composition test, changing only its
// source-ID construction input. Imports become absolute in the disposable
// copy. This is a test discriminator, never a retained-run migration.
const originPath = join(root, 'adapters/loa/tests/test-f03-ambiguity-work.ts');
const original = readFileSync(originPath), text = original.toString();
assert.equal(text.split("sourceId: 'SRC-0701'").length, 2);
const probes: Array<{ source_id: string; path: string; digest: string; exit: number | null; stdout: string; stderr: string }> = [];
for (const sourceId of ['SRC-001', 'SRC-0001']) {
  const probe = text.replace("sourceId: 'SRC-0701'", `sourceId: '${sourceId}'`)
    .replaceAll('../../../', `${pathToFileURL(root).href}/`);
  const path = join(scratch, `${sourceId}.ts`); writeFileSync(path, probe);
  const result = spawnSync(process.execPath, [path, '--class-c', ...runtime ? ['--runtime'] : []], { cwd: root, encoding: 'utf8' });
  probes.push({ source_id: sourceId, path, digest: digest(Buffer.from(probe)), exit: result.status, stdout: result.stdout, stderr: result.stderr });
}
const three = probes[0], four = probes[1];
check('three-digit C2 material publication fails the existing exact locator predicate', () => {
  assert.equal(three.exit, 1);
  assert.match(three.stderr, /WORK_AMBIGUITY_STATE:.*source locator SRC-001:L1-L1 is malformed/u);
});
check('the same synthetic composition with four-digit construction passes', () => {
  assert.equal(four.exit, 0, four.stderr);
  assert.match(four.stdout, /"classC":true,"cases":38,"adversarial":16/u);
});
check('discriminator leaves the original test bytes unchanged', () => assert(readFileSync(originPath).equals(original)));
check('discriminator never renames or rewrites the allocated source', () => {
  assert.deepEqual(intake.verifyCorpusSnapshot(run), snapshot);
  assert(readFileSync(join(run, snapshot.files[0].frozen_path)).equals(retained));
});
let installed: unknown = null;
if (installedRun) {
  const stateBytes = readFileSync(join(installedRun, 'control/run-state.json'));
  const snapshotBytes = readFileSync(join(installedRun, 'control/corpus.snapshot.json'));
  const state = JSON.parse(stateBytes.toString()), corpus = JSON.parse(snapshotBytes.toString());
  check('retained installed fixture is gated cumulative 1.9 simulation', () => {
    assert.equal(state.identity.run_format_version, '1.9.0-provisional'); assert.equal(state.full_mode, 'fixture-simulated');
  });
  check('actual installed allocation also supplies the rejected three-digit identity', () => {
    assert.equal(corpus.files[0].source_id, 'SRC-001');
    assert.equal(ambiguity.parseCandidateRefs(candidate(corpus.files[0].source_id)).clean, false);
  });
  check('retained installed state and snapshot remain byte-identical', () => {
    assert(readFileSync(join(installedRun, 'control/run-state.json')).equals(stateBytes));
    assert(readFileSync(join(installedRun, 'control/corpus.snapshot.json')).equals(snapshotBytes));
  });
  installed = { run: installedRun, state_digest: digest(stateBytes), snapshot_digest: digest(snapshotBytes),
    source_ids: corpus.files.map((f: { source_id: string }) => f.source_id),
    scope: 'Read-only installed intake evidence. The interrupted installed run did not reach C2; the C2 refusal is a separate synthetic Core composition.' };
}
const evidence = { result: 'CONFLICT_REPRODUCED', runtime, cases: cases.length, adversarial_mutations: 0,
  case_inventory: cases, scratch, installed, probe_origin: { path: originPath, digest: digest(original) }, probes,
  scope: 'Pre-clarification C08 discriminator only. Four-digit synthetic control is not installed S0–S4 reachability. No source-ID, locator, Core predicate or frozen run was repaired.' };
writeFileSync(join(scratch, 'evidence.json'), JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify({ ...evidence, probes: probes.map(({ stdout: _out, stderr: _err, ...p }) => p) }));

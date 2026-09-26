#!/usr/bin/env node
/** C08 mechanical Core controls. Installed C2 qualification is separate. */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import { duplicateFixtureBase } from '../../../scripts/duplicate-fixture-support.ts';
import type { MaterialImpactSubject, SearchBasis } from '../../../scripts/lib/internal-ambiguity.ts';
const runtime = process.argv.includes('--runtime');
const core = await import(runtime ? '../../../runtime-js/scripts/lib/internal-ambiguity.js'
  : '../../../scripts/lib/internal-ambiguity.ts') as typeof import('../../../scripts/lib/internal-ambiguity.ts');
const checks = await import(runtime ? '../../../runtime-js/scripts/lib/checks-k2-ambiguities.js'
  : '../../../scripts/lib/checks-k2-ambiguities.ts') as typeof import('../../../scripts/lib/checks-k2-ambiguities.ts');
const intake = await import(runtime ? '../../../runtime-js/adapters/loa/src/intake.js'
  : '../src/intake.ts') as typeof import('../src/intake.ts');
const scratch = mkdtempSync(join(tmpdir(), 'f03-c08-identity-')), run = join(scratch, 'model');
duplicateFixtureBase(run, undefined, undefined, { runFormatVersion: '1.9.0-provisional', sourceId: 'SRC-001' });
const model = loadRun(run), cases: Array<{ name: string; adversarial: boolean }> = [];
const test = (name: string, action: () => void, adversarial = false) => {
  action(); cases.push({ name, adversarial }); console.log(`PASS ${name}`);
};
const input = join(scratch, 'input'); mkdirSync(input);
const inputs = Array.from({ length: 1000 }, (_, i) => {
  const p = join(input, `${String(i).padStart(4, '0')}.md`); writeFileSync(p, `Synthetic source ${i}.\n`); return p;
});
const snapshot = intake.snapshotCorpus({ loaRoot: scratch, runDir: join(scratch, 'snapshot'), runId: 'RUN-C08-allocation',
  inputs, capturedAt: '2026-09-26T17:00:00Z', formalLayout: true });
const inventoryModel = loadRun(run);
inventoryModel.corpus.sources = snapshot.files.map((f) => ({ ...model.corpus.sources[0],
  values: { ...model.corpus.sources[0].values, sourceId: f.source_id } }));
for (const id of ['SRC-001', 'SRC-999', 'SRC-1000']) test(`naturally allocated exact ${id} is legal`, () => {
  assert(snapshot.files.some((s) => s.source_id === id)); assert(core.legalFrozenSourceRef(inventoryModel, id));
});
for (const id of ['SRC-01', 'SRC-777', 'SRC-0001']) test(`single-source inventory rejects ${id}`, () =>
  assert.equal(core.legalFrozenSourceRef(model, id), false), true);
test('duplicate exact frozen source rows fail', () => {
  const duplicate = loadRun(run); duplicate.corpus.sources.push(duplicate.corpus.sources[0]);
  assert.equal(core.legalFrozenSourceRef(duplicate, 'SRC-001'), false);
}, true);
const locus = (id: string, locator = 'L1-L1') => ({ kind: 'source-locus', source_id: id, locator, span_hash: `sha256:${'a'.repeat(64)}` });
test('C08 syntax is minimum three, not exactly three', () => {
  assert(core.legalSourceIdSyntax('SRC-1000')); assert(core.legalSourceIdSyntax('SRC-0001'));
  assert.equal(core.legalSourceIdSyntax('SRC-01'), false);
});
test('exact frozen SRC-001 candidate syntax and membership pass', () =>
  assert(core.parseCandidateRefs(JSON.stringify([locus('SRC-001')]), model).clean));
test('alternate-width candidate fails membership', () =>
  assert.equal(core.parseCandidateRefs(JSON.stringify([locus('SRC-0001')]), model).clean, false), true);
test('candidate numeric order retains exact source spelling', () => {
  const value = [locus('SRC-999'), locus('SRC-1000')];
  assert.deepEqual(core.parseCandidateRefs(JSON.stringify(value), inventoryModel).candidates, value);
  assert.equal(core.parseCandidateRefs(JSON.stringify([...value].reverse()), inventoryModel).clean, false);
});
for (const version of ['1.2.0-provisional', '1.3.0-provisional', '1.4.0-provisional',
  '1.5.0-provisional', '1.6.0-provisional', '1.7.0-provisional', '1.8.0-provisional']) {
  test(`${version} retains predecessor candidate grammar`, () => {
    const old = loadRun(run); old.manifest!.runFormatVersion = version;
    assert.equal(core.parseCandidateRefs(JSON.stringify([locus('SRC-001')]), old).clean, false);
    assert.equal(core.parseCandidateRefs(JSON.stringify([locus('SRC-0001')]), old).clean, true);
  });
}
test('unbound parser cannot enable cumulative C08 behavior', () =>
  assert.equal(core.parseCandidateRefs(JSON.stringify([locus('SRC-001')])).clean, false));
test('PKT four-digit grammar unchanged', () => {
  assert(core.parseCandidateRefs('[{"kind":"PKT","id":"PKT-0001"}]', model).clean);
  assert.equal(core.parseCandidateRefs('[{"kind":"PKT","id":"PKT-001"}]', model).clean, false);
}, true);
test('REL four-digit grammar unchanged', () => {
  assert(core.parseOrderedIds('REL-0001', 'REL').clean);
  assert.equal(core.parseOrderedIds('REL-001', 'REL').clean, false);
}, true);
test('WLK and CUR checker predicates remain exact pre-C08 bytes', () => {
  const prior = (path: string) => execFileSync('git', ['show', `5bfbe50209d240f8fe07af587484e842c034e691:${path}`]).toString();
  const local = (text: string) => text.slice(text.indexOf('function localScopeRefs('), text.indexOf('function completionRef('));
  const checker = 'scripts/lib/checks-k2-ambiguities.ts';
  assert.equal(local(readFileSync(checker, 'utf8')), local(prior(checker)));
  assert.equal(readFileSync('scripts/lib/checks-k2.ts', 'utf8'), prior('scripts/lib/checks-k2.ts'));
});
const basis: SearchBasis = { source_id: 'SRC-001', source_hash: `sha256:${'b'.repeat(64)}`, source_length_bytes: 10,
  scope_kind: 'full-same-source', scope_refs: [], completion_ref: `SRC-001@CUR-0001@sha256:${'b'.repeat(64)}`,
  expression_start_byte: 0, expression_end_byte: 1, expression_sha256: `sha256:${'c'.repeat(64)}`, basis_packet_ids: ['PKT-0001'],
  candidate_state: 'single', candidate_refs: [{ kind: 'PKT', id: 'PKT-0001' }] };
test('search serialization preserves exact frozen token', () =>
  assert.equal(JSON.parse(core.searchBasisJson(basis)).source_id, 'SRC-001'));
test('alternate source bytes change search basis digest', () =>
  assert.notEqual(core.searchBasisDigest(basis), core.searchBasisDigest({ ...basis, source_id: 'SRC-0001' })), true);
const failures = (values: string[], expected = 'SRC-001', target = model) => {
  const errors: string[] = [];
  checks.validateSourceLocators(target, expected, { source_locators: values } as MaterialImpactSubject,
    (message) => errors.push(message), 'C08 fixture');
  return errors;
};
test('exact material source locator reopens existing source', () => assert.deepEqual(failures(['SRC-001:L1-L1']), []));
for (const locator of ['SRC-0001:L1-L1', 'SRC-777:L1-L1', 'SRC-01:L1-L1', 'SRC-001:L01-L1',
  'SRC-001:L999-L999', 'SRC-001:L2-L1']) test(`material locator refuses ${locator}`, () =>
  assert(failures([locator]).length > 0), true);
test('material locator cannot cross to another existing source', () => {
  const two = loadRun(run); two.corpus.sources.push({ ...two.corpus.sources[0],
    values: { ...two.corpus.sources[0].values, sourceId: 'SRC-002' } });
  assert(failures(['SRC-002:L1-L1'], 'SRC-001', two).some((p) => p.includes('crosses')));
}, true);
test('unsupported source scheme is still refused', () => {
  const other = loadRun(run); other.corpus.sources[0].values.scheme = 'unsupported';
  assert(failures(['SRC-001:L1-L1'], 'SRC-001', other).length > 0);
}, true);
test('source allocation snapshot remains exact after all controls', () => {
  assert.deepEqual(intake.verifyCorpusSnapshot(join(scratch, 'snapshot')), snapshot);
  assert.equal(loadRun(run).corpus.sources[0].values.sourceId, 'SRC-001');
  assert(readFileSync(join(scratch, 'snapshot', snapshot.files[0].frozen_path)).length > 0);
});
const result = { result: 'PASS', runtime, cases: cases.length, adversarial: cases.filter((c) => c.adversarial).length,
  inventory: cases, scratch, scope: 'Synthetic mechanical Core controls; no installed C2 completion or predecessor runtime qualification claim.' };
writeFileSync(join(scratch, 'evidence.json'), JSON.stringify(result, null, 2) + '\n'); console.log(JSON.stringify(result));

#!/usr/bin/env node

import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { validateRun } from './validate-run.ts';

const ROOT = resolve('.');
const BASE = join(ROOT, 'docs/fixtures/internal-ambiguity-lifecycle');
let passed = 0;
let mutationCount = 0;

function replaceOne(path: string, before: string, after: string): void {
  const text = readFileSync(path, 'utf8');
  const first = text.indexOf(before);
  if (first < 0 || text.indexOf(before, first + before.length) >= 0) {
    throw new Error(`mutation anchor is not unique in ${path}: ${before}`);
  }
  writeFileSync(path, text.slice(0, first) + after + text.slice(first + before.length));
}

function duplicateLine(path: string, prefix: string): void {
  const text = readFileSync(path, 'utf8');
  const line = text.split('\n').find((candidate) => candidate.startsWith(prefix));
  if (!line) throw new Error(`missing line ${prefix}`);
  replaceOne(path, `${line}\n`, `${line}\n${line}\n`);
}

function replaceInLine(path: string, prefix: string, before: string, after: string): void {
  const text = readFileSync(path, 'utf8');
  const lines = text.split('\n');
  const indexes = lines.flatMap((line, index) => line.startsWith(prefix) ? [index] : []);
  if (indexes.length !== 1 || !lines[indexes[0]].includes(before)) {
    throw new Error(`line mutation anchor is not unique in ${path}: ${prefix} / ${before}`);
  }
  lines[indexes[0]] = lines[indexes[0]].replace(before, after);
  writeFileSync(path, lines.join('\n'));
}

function checkFailure(
  name: string,
  mutate: (run: string) => void,
  expected: RegExp,
): void {
  const temp = mkdtempSync(join(tmpdir(), 'aleph-s5-mutation-'));
  const run = join(temp, 'run');
  try {
    cpSync(BASE, run, { recursive: true });
    mutate(run);
    const report = validateRun({ root: ROOT, run, kind: 'run' });
    const messages = report.checks
      .filter((check) => check.status === 'FAIL')
      .map((check) => `${check.id} ${check.message}`)
      .join('\n');
    if (report.result !== 'FAIL' || !expected.test(messages)) {
      throw new Error(`expected ${String(expected)}, got ${messages || 'PASS'}`);
    }
    passed += 1;
    mutationCount += 1;
    console.log(`PASS ${name}`);
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

const ambiguity = (run: string) => join(run, 'ledgers/internal-ambiguities.md');
const manifest = (run: string) => join(run, 'run-manifest.md');
const runLog = (run: string) => join(run, 'run-log.md');
const relations = (run: string) => join(run, 'ledgers/relations.md');
const sourceWalk = (run: string) => join(run, 'ledgers/source-walk.md');
const verifier = (run: string, id: string) => join(run, `verification/harness/S4-ambiguities/${id}.md`);

const baseline = validateRun({ root: ROOT, run: BASE, kind: 'run' });
if (baseline.result !== 'PASS') throw new Error(`baseline failed: ${JSON.stringify(baseline.checks)}`);
console.log('PASS baseline 1.5 internal-ambiguity fixture');
passed += 1;

checkFailure('duplicate AMB identity', (run) => {
  duplicateLine(ambiguity(run), '| AMB-1501 | CC |');
}, /defined more than once/u);

checkFailure('duplicate exact expression definition', (run) => {
  replaceOne(
    ambiguity(run),
    '| AMB-1502 | CC | CC-0417 | SRC-0401 | L3-L3 | 66 | 77 | sha256:375acd8b163c1e68f5f434c904d81816d8331ad157ad05afd851937bcff9bc71 | U2hhcmVkIGJldGE=',
    '| AMB-1502 | CC | CC-0417 | SRC-0401 | L3-L3 | 44 | 56 | sha256:6d9d90463647c560b99be17d20a1790f424fdad2b57ac43597b1256166541564 | U2hhcmVkIGFscGhh',
  );
}, /duplicates an exact expression definition/u);

checkFailure('reversed expression interval', (run) => {
  replaceOne(ambiguity(run), '| L3-L3 | 44 | 56 |', '| L3-L3 | 56 | 44 |');
}, /expression interval is invalid/u);

checkFailure('invalid UTF-8 boundary', (run) => {
  replaceOne(ambiguity(run), '| L3-L3 | 44 | 56 |', '| L2-L2 | 30 | 31 |');
}, /valid UTF-8 boundaries/u);

checkFailure('bad expression hash', (run) => {
  replaceOne(ambiguity(run), 'sha256:6d9d90463647c560b99be17d20a1790f424fdad2b57ac43597b1256166541564', `sha256:${'0'.repeat(64)}`);
}, /expression hash is wrong/u);

checkFailure('bad expression base64', (run) => {
  replaceOne(ambiguity(run), 'U2hhcmVkIGFscGhh', 'U2hhcmVkIGFscGhi');
}, /base64 does not reopen exact bytes/u);

checkFailure('wrong source', (run) => {
  replaceOne(ambiguity(run), '| AMB-1501 | CC | CC-0414 | SRC-0401 |', '| AMB-1501 | CC | CC-0414 | SRC-9999 |');
}, /source entity is absent/u);

checkFailure('historical source packet', (run) => {
  replaceOne(ambiguity(run), '| AMB-1501 | CC | CC-0414 |', '| AMB-1501 | PKT | PKT-0402 |');
}, /source packet is historical/u);

checkFailure('illegal CC candidate', (run) => {
  replaceInLine(ambiguity(run), '| AMB-1501 | 1 |', '{"kind":"PKT","id":"PKT-0401"}', '{"kind":"CC","id":"CC-0414"}');
}, /candidate kind is not permitted/u);

checkFailure('malformed source-locus candidate', (run) => {
  replaceOne(ambiguity(run), '"span_hash":"sha256:25dea1997e39c2ed75262a33b34ccaa124831178e6466da208a9c19ecd556fb0"', '"span_hash":"bad"');
}, /source-locus candidate grammar is invalid/u);

checkFailure('cross-source candidate', (run) => {
  replaceOne(ambiguity(run), '"source_id":"SRC-0401","locator":"L5-L5"', '"source_id":"SRC-9999","locator":"L5-L5"');
}, /crosses the frozen source/u);

checkFailure('incomplete full-source accounting', (run) => {
  replaceOne(sourceWalk(run), '| complete | manual-fixture-orchestrator |', '| incomplete | manual-fixture-orchestrator |');
}, /requires exactly one completion row|full-same-source completion reference is invalid/u);

checkFailure('bad completion ref', (run) => {
  replaceInLine(ambiguity(run), '| AMB-1503 | 1 |', 'SRC-0401@CUR-0406@sha256:', 'SRC-0401@CUR-9999@sha256:');
}, /completion reference is invalid/u);

checkFailure('bad search digest', (run) => {
  replaceOne(ambiguity(run), 'sha256:e3b352cb1739eed4446639f9f9bf383d6945b9bda06bac156db028fe60e86914', `sha256:${'1'.repeat(64)}`);
}, /search_basis_digest is wrong/u);

checkFailure('stale review target', (run) => {
  replaceOne(verifier(run, 'VER-1501'), 'sha256:921eea5620f4f74f6af2eba7ca8d32fc3c8d5927a9984ece87e9b9cc8b763981', `sha256:${'2'.repeat(64)}`);
}, /requires one fresh upheld verifier/u);

checkFailure('wrong verifier identity', (run) => {
  replaceOne(ambiguity(run), '| VER-1501 |', '| VER-9999 |');
}, /requires one fresh upheld verifier/u);

checkFailure('duplicate review-subject digest inflation', (run) => {
  replaceOne(ambiguity(run), 'sha256:4b4569cb1cd81fb17b60ab90889f4983a593570d2573cc1a5146a3691f6f9378', 'sha256:921eea5620f4f74f6af2eba7ca8d32fc3c8d5927a9984ece87e9b9cc8b763981');
}, /duplicates a review-subject digest/u);

checkFailure('nonexistent affected relation', (run) => {
  replaceOne(ambiguity(run), '| REL-1405 | resolved-local |', '| REL-9999 | resolved-local |');
}, /affected relation REL-9999 is absent/u);

checkFailure('duplicate relation identity', (run) => {
  duplicateLine(relations(run), '| REL-1401 |');
}, /REL-1401 is defined more than once/u);

checkFailure('K2.16-invalid affected relation', (run) => {
  replaceOne(relations(run), '| REL-1405 | S2 |', '| REL-1405 | S9 |');
}, /owner_stage must be S2, S3, or S4/u);

checkFailure('post-C1 relation inconsistency', (run) => {
  replaceOne(relations(run), '| REL-1401 | S4 | claim-dependency | semantic-prerequisite |', '| REL-1401 | S4 | claim-dependency | antecedent-context |');
}, /family\/type mismatch/u);

checkFailure('C2 without C1', (run) => {
  replaceOne(runLog(run), 'closure_phase: S4-C1-relations-closed\n', '');
}, /duplicated, skipped, or out of order|require retained C1/u);

checkFailure('C1 marker without relations artifact', (run) => {
  unlinkSync(relations(run));
}, /C1 marker requires a complete nonempty canonical relations artifact/u);

checkFailure('resolved-local explicit empty matrix branch', (run) => {
  replaceOne(ambiguity(run), '| none | resolved-local | none | invocation:ambiguity-producer-01 |', '| none | resolved-local | explicit | invocation:ambiguity-producer-01 |');
}, /illegal resolution\/carry\/affected-set combination/u);

checkFailure('resolved-local explicit nonempty matrix branch', (run) => {
  replaceOne(ambiguity(run), '| REL-1405 | resolved-local | none | invocation:ambiguity-producer-02 |', '| REL-1405 | resolved-local | explicit | invocation:ambiguity-producer-02 |');
}, /illegal resolution\/carry\/affected-set combination/u);

checkFailure('unresolved none nonempty matrix branch', (run) => {
  replaceOne(ambiguity(run), '| REL-1401, REL-1409 | unresolved | explicit |', '| REL-1401, REL-1409 | unresolved | none |');
}, /illegal resolution\/carry\/affected-set combination/u);

checkFailure('unresolved explicit empty matrix branch', (run) => {
  replaceOne(ambiguity(run), '| [] | none | unresolved | none | invocation:ambiguity-producer-05 |', '| [] | none | unresolved | explicit | invocation:ambiguity-producer-05 |');
}, /illegal resolution\/carry\/affected-set combination/u);

checkFailure('wrong ambiguity format marker', (run) => {
  replaceOne(ambiguity(run), 'aleph-internal-ambiguity/v1', 'aleph-internal-ambiguity/v2');
}, /internal_ambiguity_format must equal/u);

checkFailure('extra canonical T5 table', (run) => {
  const path = ambiguity(run);
  writeFileSync(path, readFileSync(path, 'utf8') + [
    '',
    '| ambiguity_id | authority_seq | assessment_seq | action | selected_candidate_ref | authority_subject_digest | authority_ref | closure_provenance |',
    '|--------------|---------------|----------------|--------|------------------------|--------------------------|---------------|--------------------|',
    '',
  ].join('\n'));
}, /requires exactly three canonical/u);

checkFailure('wrong T5.1 columns', (run) => {
  replaceOne(ambiguity(run), '| ambiguity_id | source_entity_kind |', '| ambiguity_id | invented_column |');
}, /requires exactly three canonical/u);

checkFailure('forked assessment sequence', (run) => {
  duplicateLine(ambiguity(run), '| AMB-1501 | 1 | none |');
}, /forked or noncontiguous/u);

checkFailure('wrong assessment predecessor', (run) => {
  replaceOne(ambiguity(run), '| AMB-1501 | 1 | none |', '| AMB-1501 | 1 | 1 |');
}, /assessment predecessor is invalid/u);

checkFailure('local search typed-null result', (run) => {
  replaceInLine(ambiguity(run), '| AMB-1501 | 1 |', '| single | [{"kind":"PKT","id":"PKT-0401"}] | none | resolved-local |', '| null-no-candidate | [] | none | unresolved |');
}, /local search requires ordered intervals/u);

checkFailure('full search crosses source', (run) => {
  replaceInLine(ambiguity(run), '| AMB-1503 | 1 |', '| full-same-source | SRC-0401 |', '| full-same-source | SRC-9999 |');
}, /search source crosses/u);

checkFailure('candidate state/count mismatch', (run) => {
  replaceInLine(ambiguity(run), '| AMB-1501 | 1 |', '| single | [{"kind":"PKT","id":"PKT-0401"}] | none | resolved-local |', '| multiple | [{"kind":"PKT","id":"PKT-0401"}] | none | resolved-local |');
}, /candidate_state\/count mismatch/u);

checkFailure('affected relation order', (run) => {
  replaceOne(ambiguity(run), '| REL-1401, REL-1409 | unresolved |', '| REL-1409, REL-1401 | unresolved |');
}, /affected_relation_ids are not canonical/u);

checkFailure('source-locus hash mismatch', (run) => {
  replaceOne(ambiguity(run), 'sha256:25dea1997e39c2ed75262a33b34ccaa124831178e6466da208a9c19ecd556fb0', `sha256:${'f'.repeat(64)}`);
}, /does not reopen exact bytes/u);

checkFailure('authority identity used as detector', (run) => {
  replaceInLine(ambiguity(run), '| AMB-1501 | CC |', 'invocation:ambiguity-producer-01', 'human:authority-primary');
}, /detector identity is invalid or authority-owned/u);

checkFailure('populated rows before C1', (run) => {
  replaceOne(runLog(run), 'closure_phase: S4-C1-relations-closed\n', '');
  replaceOne(runLog(run), 'closure_phase: S4-C2-ambiguities-finalized\n', '');
  replaceOne(runLog(run), 'closure_phase: S4-C3-exit\n', '');
  replaceOne(runLog(run), '## 2026-08-14 09:06 UTC — S5 — entry', '## 2026-08-14 09:06 UTC — S4 — checkpoint');
}, /canonical ambiguity rows are forbidden before C1/u);

checkFailure('positive T5 under legacy 1.4 format', (run) => {
  replaceOne(manifest(run), 'run_format_version: 1.5.0-provisional', 'run_format_version: 1.4.0-provisional');
}, /must reject active 1.5 ambiguity artifacts/u);

checkFailure('unknown closure phase', (run) => {
  replaceOne(runLog(run), 'closure_phase: S4-C2-ambiguities-finalized', 'closure_phase: S4-C2-invented');
}, /unknown value/u);

checkFailure('duplicate closure phase', (run) => {
  replaceOne(runLog(run), 'closure_phase: S4-C2-ambiguities-finalized', 'closure_phase: S4-C1-relations-closed');
}, /duplicated, skipped, or out of order/u);

console.log(`RESULT: PASS (${String(passed)}/${String(passed)}; ${String(mutationCount)} deterministic mutations)`);

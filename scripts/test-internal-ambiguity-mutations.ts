#!/usr/bin/env node

import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import {
  buildProceduralAuthorityLedgerRow,
  buildProceduralAuthorityRequest,
  buildProceduralAuthorityResponse,
  buildProceduralAuthoritySubject,
  exactTextBlob,
  materialImpactSubjectDigest,
  materialImpactSubjectJson,
  proceduralAuthorityLedgerRowMarkdown,
  proceduralAuthorityRequestJson,
  proceduralAuthorityResponseJson,
  sha256Digest,
  type MaterialImpactSubject,
  type OperativeScope,
  type ProceduralAuthorityRequest,
  type ProceduralAuthorityResponse,
} from './lib/internal-ambiguity.ts';
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
  const indexes = lines.flatMap((line, index) => (
    line.startsWith(prefix) && line.includes(before) ? [index] : []
  ));
  if (indexes.length !== 1) {
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

function checkAuthorityFailure(
  base: string,
  name: string,
  mutate: (run: string) => void,
  expected: RegExp,
): void {
  const temp = mkdtempSync(join(tmpdir(), 'aleph-s5-authority-mutation-'));
  const run = join(temp, 'run');
  try {
    cpSync(base, run, { recursive: true });
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
const materialSubjectPath = (run: string, sequence = 1) => join(
  run,
  `verification/harness/S4/material-impact-subjects/AMB-1503-A1-M${String(sequence)}.json`,
);
const materialReviewPath = (run: string, id = 'VER-1591') => join(
  run,
  `verification/harness/S4-material-impact/${id}.md`,
);
const authorityRequestPath = (run: string, sequence = 1) => join(
  run,
  `control/gates/GATE-S4-AMB-1503-A1-Q${String(sequence)}-request.json`,
);
const authorityResponsePath = (run: string, sequence = 1) => join(
  run,
  `control/gates/GATE-S4-AMB-1503-A1-Q${String(sequence)}-response.json`,
);

function materialReviewText(
  id: string,
  digest: string,
  verdict: 'upheld' | 'refuted' | 'cannot-determine',
): string {
  return `# Verdict ${id}\n\n`
    + '| field | value |\n'
    + '|-------|-------|\n'
    + `| target | internal-ambiguity-material-impact-review-subject:${digest} |\n`
    + '| lens | fresh material-impact exact-subject challenge |\n'
    + '| stage | S4-C2 material-impact review |\n'
    + '| shown | exact material subject and bound retained basis |\n'
    + '| withheld | human response, observation, comment, preference, and desired conclusion |\n'
    + `| verdict | ${verdict} |\n`
    + '| consequence | deterministic authority mutation fixture only |\n';
}

function authorityScope(): OperativeScope {
  return {
    affected_ids: ['CC-0413'],
    impact_rows: [{
      affected_id: 'CC-0413',
      operation_kind: 'load-bearing-reasoning',
      requirement_ref: 'core:docs/architecture/04-pipeline-stages-and-dod.md#S5 — Disposition pass',
      unresolved_treatment: 'carry-or-restriction',
      consequence_if_unresolved: 'The exact downstream use remains contingent on the unresolved expression.',
    }],
  };
}

function buildAuthorityBaseline(run: string): void {
  const ambiguityText = readFileSync(ambiguity(run), 'utf8');
  const t52Line = ambiguityText.split('\n').find((line) => line.startsWith('| AMB-1503 | 1 |'));
  if (!t52Line) throw new Error('authority baseline lacks AMB-1503 T5.2');
  const ambiguityReview = readFileSync(verifier(run, 'VER-1503'));
  const material: MaterialImpactSubject = {
    format: 'aleph-internal-ambiguity-material-impact-review-subject/v1',
    run_id: 'RUN-internal-ambiguity-lifecycle',
    ambiguity_id: 'AMB-1503',
    assessment_seq: 1,
    material_impact_seq: 1,
    t5_2_assessment_ref: `internal-ambiguity:T5.2:AMB-1503:A1@${sha256Digest(t52Line)}`,
    t5_2_review_subject_digest: 'sha256:971c8b4b48522d87dc994a48823f1f4eabce05cd1c990b1bd08f506e5caf201d',
    t5_2_review_ref: `ambiguity-review-verdict:VER-1503@${sha256Digest(ambiguityReview)}`,
    c1_relation_basis_ref: 'none',
    materiality_class: 'C',
    operative_scope: authorityScope(),
    source_locators: ['SRC-0401:L8-L8'],
    reviewed_unaffected_ids: [],
    unresolved_statement: 'The frozen same-source bytes do not identify one local referent.',
    review_proposition: 'class-B-or-C-and-canonical-operative-scope-complete-and-accurate-under-cited-Core-requirements',
    proposed_by: 'invocation:material-impact-producer-mutation-fixture',
  };
  mkdirSync(dirname(materialSubjectPath(run)), { recursive: true });
  writeFileSync(materialSubjectPath(run), materialImpactSubjectJson(material));
  const materialDigest = materialImpactSubjectDigest(material);
  const reviewText = materialReviewText('VER-1591', materialDigest, 'upheld');
  mkdirSync(dirname(materialReviewPath(run)), { recursive: true });
  writeFileSync(materialReviewPath(run), reviewText);
  const subject = buildProceduralAuthoritySubject({
    run_id: material.run_id,
    ambiguity_id: material.ambiguity_id,
    assessment_seq: material.assessment_seq,
    t5_2_assessment_ref: material.t5_2_assessment_ref,
    t5_2_review_subject_digest: material.t5_2_review_subject_digest,
    t5_2_review_ref: material.t5_2_review_ref,
    prior_indeterminate_review_refs: [],
    candidate_state: 'null-no-candidate',
    candidate_refs: [],
    carry_state: 'none',
    affected_relation_ids: [],
    c1_relation_basis_ref: 'none',
    material_impact_seq: 1,
    material_impact_subject_ref: `material-impact-subject:AMB-1503:A1:M1@${materialDigest}`,
    material_impact_review_ref: `material-impact-verdict:VER-1591@${sha256Digest(reviewText)}`,
    operative_scope: authorityScope(),
    source_locators: material.source_locators,
    reviewed_unaffected_ids: [],
    unresolved_statement: material.unresolved_statement,
  });
  const request = buildProceduralAuthorityRequest({
    request_seq: 1,
    subject,
    presentation: true,
    required_authority_identity: 'human:fixture-operator',
    prepared_by: 'invocation:loa-orchestrator',
    requested_at: '2040-01-02T03:10:00.000Z',
  });
  const requestBytes = Buffer.from(proceduralAuthorityRequestJson(request), 'utf8');
  const response = buildProceduralAuthorityResponse({
    request,
    request_bytes: requestBytes,
    authority_identity: 'human:fixture-operator',
    selected_action: 'carry-unresolved',
    observation: null,
    comment: exactTextBlob(Buffer.from(' fixture-only non-operative comment ', 'utf8')),
    recorded_at: '2040-01-02T03:11:00.000Z',
  });
  const responseBytes = Buffer.from(proceduralAuthorityResponseJson(response), 'utf8');
  mkdirSync(dirname(authorityRequestPath(run)), { recursive: true });
  writeFileSync(authorityRequestPath(run), requestBytes);
  writeFileSync(authorityResponsePath(run), responseBytes);
  const row = buildProceduralAuthorityLedgerRow({
    request,
    request_bytes: requestBytes,
    response,
    response_bytes: responseBytes,
    authority_seq: 1,
  });
  writeFileSync(ambiguity(run), `${ambiguityText}${proceduralAuthorityLedgerRowMarkdown(row)}\n`);
}

function mutateJson<T>(path: string, mutate: (value: T) => void): void {
  const value = JSON.parse(readFileSync(path, 'utf8')) as T;
  mutate(value);
  writeFileSync(path, JSON.stringify(value));
}

const baseline = validateRun({ root: ROOT, run: BASE, kind: 'run' });
if (baseline.result !== 'PASS') throw new Error(`baseline failed: ${JSON.stringify(baseline.checks)}`);
console.log('PASS baseline 1.5 internal-ambiguity fixture');
passed += 1;
console.log('PASS mixed valid Class B/Class C C2 inventory with terminal Class C authority');
passed += 1;
console.log('PASS unresolved Class B with upheld material review and empty scope needs no authority request');
passed += 1;

checkFailure('C2 unresolved ambiguity without material-impact subject', (run) => {
  unlinkSync(join(
    run,
    'verification/harness/S4/material-impact-subjects/AMB-1505-A1-M1.json',
  ));
}, /latest unresolved T5\.2 assessment has no material-impact history at C2/u);

checkFailure('C2 Class C upheld material subject without T5.3', (run) => {
  const path = ambiguity(run);
  const text = readFileSync(path, 'utf8');
  writeFileSync(path, text.split('\n')
    .filter((line) => !line.startsWith('| AMB-1504 | 1 | 1 | restrict-downstream-use |'))
    .join('\n'));
}, /lacks a progression-enabling terminal T5\.3 action at C2/u);

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

const authorityTemp = mkdtempSync(join(tmpdir(), 'aleph-s5-authority-baseline-'));
const authorityBase = join(authorityTemp, 'run');
try {
  cpSync(BASE, authorityBase, { recursive: true });
  const authorityBaseline = validateRun({ root: ROOT, run: authorityBase, kind: 'run' });
  if (authorityBaseline.result !== 'PASS') {
    throw new Error(`authority baseline failed: ${JSON.stringify(authorityBaseline.checks)}`);
  }
  passed += 1;
  console.log('PASS authority-positive retained-state baseline');

  checkAuthorityFailure(authorityBase, 'malformed material-impact format', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.format = 'invalid' as MaterialImpactSubject['format'];
    });
  }, /material-impact format is invalid/u);

  checkAuthorityFailure(authorityBase, 'material-impact path identity mismatch', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.material_impact_seq = 2;
    });
  }, /identity does not match its canonical path/u);

  checkAuthorityFailure(authorityBase, 'noncanonical material-impact key order', (run) => {
    const value = JSON.parse(readFileSync(materialSubjectPath(run), 'utf8')) as MaterialImpactSubject;
    const { format, run_id: runId, ...remainder } = value;
    writeFileSync(materialSubjectPath(run), JSON.stringify({ run_id: runId, format, ...remainder }));
  }, /not exact canonical compact JSON/u);

  checkAuthorityFailure(authorityBase, 'Class B with nonempty operative scope', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.materiality_class = 'B';
    });
  }, /Class B operative scope must be empty/u);

  checkAuthorityFailure(authorityBase, 'Class C with empty operative scope', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.operative_scope = { affected_ids: [], impact_rows: [] };
    });
  }, /Class C operative scope must be nonempty/u);

  checkAuthorityFailure(authorityBase, 'illegal operative affected ID kind', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.operative_scope.affected_ids = ['SRC-0401'];
      value.operative_scope.impact_rows[0].affected_id = 'SRC-0401';
    });
  }, /illegal ID kind/u);

  checkAuthorityFailure(authorityBase, 'duplicate impact tuple', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.operative_scope.impact_rows.push(structuredClone(value.operative_scope.impact_rows[0]));
    });
  }, /duplicate tuple/u);

  checkAuthorityFailure(authorityBase, 'contradictory impact rows', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      const row = structuredClone(value.operative_scope.impact_rows[0]);
      row.unresolved_treatment = 'resolution-required';
      value.operative_scope.impact_rows.push(row);
    });
  }, /contradictory duplicate tuples/u);

  checkAuthorityFailure(authorityBase, 'malformed requirement_ref', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.operative_scope.impact_rows[0].requirement_ref = '../working-main#fuzzy';
    });
  }, /malformed requirement_ref/u);

  checkAuthorityFailure(authorityBase, 'duplicate material source locator', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.source_locators.push(value.source_locators[0]);
    });
  }, /source_locators is malformed or duplicated/u);

  checkAuthorityFailure(authorityBase, 'reviewed-unaffected overlaps affected scope', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.reviewed_unaffected_ids = ['CC-0413'];
    });
  }, /overlaps operative_scope\.affected_ids/u);

  checkAuthorityFailure(authorityBase, 'reviewed-unaffected IDs are unsorted', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.reviewed_unaffected_ids = ['CC-0423', 'CC-0414'];
    });
  }, /not in canonical order/u);

  checkAuthorityFailure(authorityBase, 'reviewed-unaffected ID is duplicated', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.reviewed_unaffected_ids = ['CC-0423', 'CC-0423'];
    });
  }, /reviewed_unaffected_ids is malformed or duplicated|contains duplicates/u);

  checkAuthorityFailure(authorityBase, 'reviewed-unaffected contains prose', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.reviewed_unaffected_ids = ['not an ID'];
    });
  }, /prose or an illegal ID kind/u);

  checkAuthorityFailure(authorityBase, 'reviewed-unaffected illegal ID kind', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.reviewed_unaffected_ids = ['SRC-0401'];
    });
  }, /prose or an illegal ID kind/u);

  checkAuthorityFailure(authorityBase, 'reviewed-unaffected nonexistent ID', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.reviewed_unaffected_ids = ['CC-9999'];
    });
  }, /absent or historical/u);

  checkAuthorityFailure(authorityBase, 'reviewed-unaffected historical ID', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.reviewed_unaffected_ids = ['CC-0401'];
    });
  }, /absent or historical/u);

  checkAuthorityFailure(authorityBase, 'source locator is prose', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.source_locators = ['not a locator at all'];
    });
  }, /source locator .* is malformed/u);

  checkAuthorityFailure(authorityBase, 'source locator does not exist', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.source_locators = ['SRC-0401:L999-L999'];
    });
  }, /does not reopen an existing exact Core locus/u);

  checkAuthorityFailure(authorityBase, 'source locator crosses source', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.source_locators = ['SRC-9999:L8-L8'];
    });
  }, /crosses the bound frozen source/u);

  checkAuthorityFailure(authorityBase, 'source locators are unsorted', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.source_locators = ['SRC-0401:L8-L8', 'SRC-0401:L7-L7'];
    });
  }, /not in deterministic order/u);

  checkAuthorityFailure(authorityBase, 'stale material T5.2 row binding', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.t5_2_assessment_ref = value.t5_2_assessment_ref.replace(/sha256:[a-f0-9]{64}$/u, `sha256:${'0'.repeat(64)}`);
    });
  }, /T5\.2 row or review-subject binding is stale/u);

  checkAuthorityFailure(authorityBase, 'wrong material C1 relation basis', (run) => {
    mutateJson<MaterialImpactSubject>(materialSubjectPath(run), (value) => {
      value.c1_relation_basis_ref = 'relations-basis:closure_phase=S4-C1-relations-closed;artifact=ledgers/relations.md';
    });
  }, /C1 relation basis reference is wrong/u);

  checkAuthorityFailure(authorityBase, 'wrong material verifier target', (run) => {
    replaceOne(materialReviewPath(run), 'internal-ambiguity-material-impact-review-subject:', 'internal-ambiguity-material-impact-review-subject:sha256:0000');
  }, /no exact fresh material-impact verdict/u);

  checkAuthorityFailure(authorityBase, 'refuted material verifier cannot continue', (run) => {
    replaceOne(materialReviewPath(run), '| verdict | upheld |', '| verdict | refuted |');
  }, /latest material-impact verdict must be upheld/u);

  checkAuthorityFailure(authorityBase, 'cannot-determine material verifier cannot continue', (run) => {
    replaceOne(materialReviewPath(run), '| verdict | upheld |', '| verdict | cannot-determine |');
  }, /latest material-impact verdict must be upheld/u);

  checkAuthorityFailure(authorityBase, 'forked material M sequence', (run) => {
    const value = JSON.parse(readFileSync(materialSubjectPath(run), 'utf8')) as MaterialImpactSubject;
    value.material_impact_seq = 3;
    writeFileSync(materialSubjectPath(run, 3), materialImpactSubjectJson(value));
  }, /material-impact M history is forked or noncontiguous/u);

  checkAuthorityFailure(authorityBase, 'producer-authored allowed action set', (run) => {
    mutateJson<ProceduralAuthorityRequest>(authorityRequestPath(run), (value) => {
      value.authority_subject.allowed_actions = ['inspect-source'];
    });
  }, /request is inconsistent/u);

  checkAuthorityFailure(authorityBase, 'producer-authored action consequence', (run) => {
    mutateJson<ProceduralAuthorityRequest>(authorityRequestPath(run), (value) => {
      value.authority_subject.action_consequences[0].c2_effect = 'not-eligible';
    });
  }, /request is inconsistent/u);

  checkAuthorityFailure(authorityBase, 'hidden operative presentation row', (run) => {
    mutateJson<ProceduralAuthorityRequest>(authorityRequestPath(run), (value) => {
      if (!value.presentation) throw new Error('baseline request has no presentation');
      value.presentation.operative_scope = { affected_ids: [], impact_rows: [] };
    });
  }, /request is inconsistent/u);

  checkAuthorityFailure(authorityBase, 'non-human required authority kind', (run) => {
    mutateJson<ProceduralAuthorityRequest>(authorityRequestPath(run), (value) => {
      value.required_authority.kind = 'model' as 'human';
    });
  }, /request is inconsistent/u);

  checkAuthorityFailure(authorityBase, 'response request digest mismatch', (run) => {
    mutateJson<ProceduralAuthorityResponse>(authorityResponsePath(run), (value) => {
      value.request_digest = `sha256:${'0'.repeat(64)}`;
    });
  }, /response is invalid/u);

  checkAuthorityFailure(authorityBase, 'response authority identity mismatch', (run) => {
    mutateJson<ProceduralAuthorityResponse>(authorityResponsePath(run), (value) => {
      value.authority.identity = 'human:other-operator';
    });
  }, /response is invalid/u);

  checkAuthorityFailure(authorityBase, 'observation bytes on non-observation action', (run) => {
    mutateJson<ProceduralAuthorityResponse>(authorityResponsePath(run), (value) => {
      value.observation = exactTextBlob(Buffer.from('illegal observation', 'utf8'));
    });
  }, /response is invalid/u);

  checkAuthorityFailure(authorityBase, 'bad exact human comment digest', (run) => {
    mutateJson<ProceduralAuthorityResponse>(authorityResponsePath(run), (value) => {
      value.comment = exactTextBlob(Buffer.from('fixture comment', 'utf8'));
      value.comment.sha256 = `sha256:${'0'.repeat(64)}`;
    });
  }, /response is invalid/u);

  checkAuthorityFailure(authorityBase, 'selected candidate in T5.3', (run) => {
    replaceInLine(ambiguity(run), '| AMB-1503 | 1 | 1 | carry-unresolved |', '| carry-unresolved | none |', '| carry-unresolved | PKT-0401 |');
  }, /selected_candidate_ref must equal none/u);

  checkAuthorityFailure(authorityBase, 'fabricated authority_ref in T5.3', (run) => {
    replaceInLine(ambiguity(run), '| AMB-1503 | 1 | 1 | carry-unresolved |', 'authority-response:RESP-S4-AMB-1503-A1-Q1@', 'authority-response:RESP-S4-AMB-1503-A1-Q9@');
  }, /does not resolve one retained request\/response pair/u);

  checkAuthorityFailure(authorityBase, 'obsolete provisional authority label', (run) => {
    replaceInLine(ambiguity(run), '| AMB-1503 | 1 | 1 | carry-unresolved |', 'carry-unresolved', 'preserve-unresolved');
  }, /T5\.3 action is invalid/u);

  checkAuthorityFailure(authorityBase, 'reused response in second T5.3 row', (run) => {
    const text = readFileSync(ambiguity(run), 'utf8');
    const row = text.split('\n').find((line) => line.startsWith('| AMB-1503 | 1 | 1 | carry-unresolved |'));
    if (!row) throw new Error('baseline T5.3 row is absent');
    writeFileSync(ambiguity(run), `${text}${row.replace('| AMB-1503 | 1 |', '| AMB-1503 | 2 |')}\n`);
  }, /reuses authority response/u);

  checkAuthorityFailure(authorityBase, 'forked Q request history', (run) => {
    const q1 = JSON.parse(readFileSync(authorityRequestPath(run), 'utf8')) as ProceduralAuthorityRequest;
    const q3 = buildProceduralAuthorityRequest({
      request_seq: 3,
      subject: q1.authority_subject,
      presentation: true,
      required_authority_identity: q1.required_authority.identity,
      prepared_by: q1.prepared_by,
      requested_at: '2040-01-02T03:12:00.000Z',
    });
    writeFileSync(authorityRequestPath(run, 3), proceduralAuthorityRequestJson(q3));
  }, /request Q history is forked or noncontiguous/u);

  checkAuthorityFailure(authorityBase, 'stale response after replacement request', (run) => {
    const q1 = JSON.parse(readFileSync(authorityRequestPath(run), 'utf8')) as ProceduralAuthorityRequest;
    const q2 = buildProceduralAuthorityRequest({
      request_seq: 2,
      subject: q1.authority_subject,
      presentation: false,
      required_authority_identity: q1.required_authority.identity,
      prepared_by: q1.prepared_by,
      requested_at: '2040-01-02T03:12:00.000Z',
    });
    writeFileSync(authorityRequestPath(run, 2), proceduralAuthorityRequestJson(q2));
    const text = readFileSync(ambiguity(run), 'utf8');
    const row = text.split('\n').find((line) => line.startsWith('| AMB-1503 | 1 | 1 | carry-unresolved |'));
    if (!row) throw new Error('baseline T5.3 row is absent');
    writeFileSync(ambiguity(run), text.replace(`${row}\n`, ''));
  }, /stale response to a replaced request/u);

  checkAuthorityFailure(authorityBase, 'C2 with active authority request', (run) => {
    unlinkSync(authorityResponsePath(run));
    const text = readFileSync(ambiguity(run), 'utf8');
    const row = text.split('\n').find((line) => line.startsWith('| AMB-1503 | 1 | 1 | carry-unresolved |'));
    if (!row) throw new Error('baseline T5.3 row is absent');
    writeFileSync(ambiguity(run), text.replace(`${row}\n`, ''));
  }, /C2 finalization is illegal while an authority request remains active/u);

  checkAuthorityFailure(authorityBase, 'nonterminal action cannot finalize C2', (run) => {
    const request = JSON.parse(readFileSync(authorityRequestPath(run), 'utf8')) as ProceduralAuthorityRequest;
    const requestBytes = readFileSync(authorityRequestPath(run));
    const response = buildProceduralAuthorityResponse({
      request,
      request_bytes: requestBytes,
      authority_identity: request.required_authority.identity,
      selected_action: 'inspect-source',
      observation: null,
      comment: null,
      recorded_at: '2040-01-02T03:11:00.000Z',
    });
    const responseBytes = Buffer.from(proceduralAuthorityResponseJson(response), 'utf8');
    writeFileSync(authorityResponsePath(run), responseBytes);
    const row = buildProceduralAuthorityLedgerRow({
      request, request_bytes: requestBytes, response, response_bytes: responseBytes, authority_seq: 1,
    });
    const text = readFileSync(ambiguity(run), 'utf8');
    const old = text.split('\n').find((line) => line.startsWith('| AMB-1503 | 1 | 1 | carry-unresolved |'));
    if (!old) throw new Error('baseline T5.3 row is absent');
    writeFileSync(ambiguity(run), text.replace(old, proceduralAuthorityLedgerRowMarkdown(row)));
  }, /no progression-enabling terminal response at C2/u);

  checkAuthorityFailure(authorityBase, 'successor-run action cannot finalize current C2', (run) => {
    const request = JSON.parse(readFileSync(authorityRequestPath(run), 'utf8')) as ProceduralAuthorityRequest;
    const requestBytes = readFileSync(authorityRequestPath(run));
    const response = buildProceduralAuthorityResponse({
      request,
      request_bytes: requestBytes,
      authority_identity: request.required_authority.identity,
      selected_action: 'request-successor-corpus-run',
      observation: null,
      comment: null,
      recorded_at: '2040-01-02T03:11:00.000Z',
    });
    const responseBytes = Buffer.from(proceduralAuthorityResponseJson(response), 'utf8');
    writeFileSync(authorityResponsePath(run), responseBytes);
    const row = buildProceduralAuthorityLedgerRow({
      request, request_bytes: requestBytes, response, response_bytes: responseBytes, authority_seq: 1,
    });
    const text = readFileSync(ambiguity(run), 'utf8');
    const old = text.split('\n').find((line) => line.startsWith('| AMB-1503 | 1 | 1 | carry-unresolved |'));
    if (!old) throw new Error('baseline T5.3 row is absent');
    writeFileSync(ambiguity(run), text.replace(old, proceduralAuthorityLedgerRowMarkdown(row)));
  }, /no progression-enabling terminal response at C2/u);

  checkAuthorityFailure(authorityBase, 'action appended after terminal response', (run) => {
    const q1 = JSON.parse(readFileSync(authorityRequestPath(run), 'utf8')) as ProceduralAuthorityRequest;
    const q2 = buildProceduralAuthorityRequest({
      request_seq: 2,
      subject: q1.authority_subject,
      presentation: true,
      required_authority_identity: q1.required_authority.identity,
      prepared_by: q1.prepared_by,
      requested_at: '2040-01-02T03:12:00.000Z',
    });
    const q2Bytes = Buffer.from(proceduralAuthorityRequestJson(q2), 'utf8');
    const r2 = buildProceduralAuthorityResponse({
      request: q2,
      request_bytes: q2Bytes,
      authority_identity: q2.required_authority.identity,
      selected_action: 'restrict-downstream-use',
      observation: null,
      comment: null,
      recorded_at: '2040-01-02T03:13:00.000Z',
    });
    const r2Bytes = Buffer.from(proceduralAuthorityResponseJson(r2), 'utf8');
    writeFileSync(authorityRequestPath(run, 2), q2Bytes);
    writeFileSync(authorityResponsePath(run, 2), r2Bytes);
    const row = buildProceduralAuthorityLedgerRow({
      request: q2, request_bytes: q2Bytes, response: r2, response_bytes: r2Bytes, authority_seq: 2,
    });
    writeFileSync(ambiguity(run), `${readFileSync(ambiguity(run), 'utf8')}${proceduralAuthorityLedgerRowMarkdown(row)}\n`);
  }, /conflicting action after a terminal response/u);
} finally {
  rmSync(authorityTemp, { recursive: true, force: true });
}

console.log(`RESULT: PASS (${String(passed)}/${String(passed)}; ${String(mutationCount)} deterministic mutations)`);

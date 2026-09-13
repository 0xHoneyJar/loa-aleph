#!/usr/bin/env node
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  makeDuplicateFixture, makeDuplicateSuccessorFixture, closeDuplicateFixture, duplicateFixtureProposal,
  duplicateFixtureReview, duplicateFixtureResult, duplicateFixtureWrite, type DuplicateFixture,
} from './duplicate-fixture-support.ts';
import { makeSemanticFixture, writeFixtureFile, fixtureTable } from './semantic-fixture-support.ts';
import { loadRun } from './lib/run-model.ts';
import { materialHash } from './lib/source-representation.ts';
import { semanticJson, SEMANTIC_PATH, semanticLedgerMarkdown, parseSemanticLedger, semanticSubjectPath } from './lib/semantic-review.ts';
import { RELATION_TABLE_HEADER, RELATION_FORMAT } from './lib/relations.ts';
import type { DuplicateSubject, DuplicateAssignment, DuplicateEffect, DuplicateResult } from './lib/duplicate-review.ts';

const runtime = process.argv.includes('--runtime');
const modulePath = (name: string): string => new URL(runtime ? `../runtime-js/scripts/${name}.js` : `./${name}.ts`, import.meta.url).href;
const core = await import(modulePath('lib/duplicate-review')) as typeof import('./lib/duplicate-review.ts');
const { validateRun } = await import(modulePath('validate-run')) as typeof import('./validate-run.ts');
const temp = mkdtempSync(join(tmpdir(), 'aleph-duplicate-mutations-'));
const records: Array<{ id: string; result: string; actual_tokens: string[]; error?: string }> = [];
const baseline = {
  separate: makeDuplicateFixture(join(temp, 'baseline-separate')),
  canonical: makeDuplicateSuccessorFixture(join(temp, 'baseline-canonical')),
  unknown: makeDuplicateFixture(join(temp, 'baseline-unknown'), { verdict: 'cannot-determine', second: 'upheld' }),
  closed: makeDuplicateFixture(join(temp, 'baseline-closed')),
};
closeDuplicateFixture(baseline.closed);
for (const f of Object.values(baseline)) {
  const report = validateRun({ run: f.run });
  assert.equal(report.result, 'PASS', JSON.stringify(report.checks.filter((c) => c.status === 'FAIL')));
}
function copy(id: string, kind: keyof typeof baseline): DuplicateFixture {
  const f = structuredClone(baseline[kind]); f.run = join(temp, id); f.semantic.run = f.run;
  cpSync(baseline[kind].run, f.run, { recursive: true }); return f;
}
function writeResult(f: DuplicateFixture, index: number, result: DuplicateResult): void {
  const row = f.ledger.results[index], bytes = semanticJson(result);
  writeFixtureFile(f.run, row.result_path, bytes); row.result_digest = materialHash(bytes);
  const path = `verification/harness/S4/${row.review_id}.md`;
  writeFixtureFile(f.run, path, readFileSync(join(f.run, path), 'utf8').replace(/\| verdict \| [^|]+ \|/u, `| verdict | ${result.verdict} |`));
  duplicateFixtureWrite(f);
}
function reseal(f: DuplicateFixture, mutate: (subject: DuplicateSubject) => void): void {
  const s = f.subject!; mutate(s);
  const producer = f.producer!, rawPath = core.duplicatePath('process', `${producer.call_id}.raw`);
  const raw = JSON.parse(readFileSync(join(f.run, rawPath), 'utf8')); raw.proposal = s.proposal;
  producer.raw_return_hash = materialHash(semanticJson(raw)); s.producer_binding_hash = core.duplicateProducerBinding(producer);
  writeFixtureFile(f.run, rawPath, semanticJson(raw));
  const row = f.ledger.proposals[0], producerPath = row.producer_receipt_ref.split('@')[0];
  writeFixtureFile(f.run, producerPath, semanticJson(producer)); row.producer_receipt_ref = `${producerPath}@${materialHash(semanticJson(producer))}`;
  writeFixtureFile(f.run, core.duplicateProducerPaths(producer.call_id).view, semanticJson({ candidate_ref: s.proposal.candidate_ref, comparison_basis: s.comparison_basis }));
  const bytes = semanticJson(s), digest = materialHash(bytes);
  writeFixtureFile(f.run, row.subject_path, bytes); row.subject_digest = digest;
  for (const row of f.ledger.assignments) {
    const a = JSON.parse(readFileSync(join(f.run, row.assignment_path), 'utf8')) as DuplicateAssignment;
    a.subject_digest = digest; a.producer_binding_hash = s.producer_binding_hash;
    writeFixtureFile(f.run, row.assignment_path, semanticJson(a)); row.assignment_digest = materialHash(semanticJson(a));
  }
  for (const [index, row] of f.ledger.results.entries()) {
    const result = JSON.parse(readFileSync(join(f.run, row.result_path), 'utf8')) as DuplicateResult;
    result.subject_digest = digest; writeResult(f, index, result);
    const path = row.execution_evidence_ref.split('@')[0], evidence = JSON.parse(readFileSync(join(f.run, path), 'utf8'));
    evidence.subject_digest = digest; evidence.shown_digest = digest;
    writeFixtureFile(f.run, path, semanticJson(evidence)); row.execution_evidence_ref = `${path}@${materialHash(semanticJson(evidence))}`;
    const companionPath = `verification/harness/S4/${row.review_id}.md`;
    writeFixtureFile(f.run, companionPath, readFileSync(join(f.run, companionPath), 'utf8')
      .replace(/duplicate-review-subject:sha256:[a-f0-9]{64}/u, `duplicate-review-subject:${digest}`));
  }
  for (const row of f.ledger.effects) {
    const path = row.record_ref.split('@')[0], effect = JSON.parse(readFileSync(join(f.run, path), 'utf8')) as DuplicateEffect;
    effect.subject_digest = digest; effect.provenance_union_digest = materialHash(semanticJson(s.proposal.provenance_union));
    writeFixtureFile(f.run, path, semanticJson(effect)); row.record_ref = `${path}@${materialHash(semanticJson(effect))}`;
  }
  duplicateFixtureWrite(f);
}
function mutate(id: string, expected: string[], change: (f: DuplicateFixture) => void, kind: keyof typeof baseline = 'separate',
  inspect?: (f: DuplicateFixture) => void): void {
  const f = copy(id, kind);
  let tokens: string[] = [];
  try {
    change(f);
    if (inspect) {
      let failure: unknown;
      try { inspect(f); } catch (error) { failure = error; }
      assert(failure, 'mutated Core operation unexpectedly succeeded');
      tokens = [...new Set(String(failure).match(/DUP_[A-Z]+|K2\.\d+/gu) || [])];
    } else {
      const report = validateRun({ run: f.run });
      assert.equal(report.result, 'FAIL', 'mutated complete run unexpectedly passed');
      tokens = [...new Set(report.checks.filter((c) => c.status === 'FAIL').flatMap((c) =>
        [...c.message.matchAll(/DUP_[A-Z]+/gu)].map((m) => m[0]).concat(c.id)))];
    }
    assert(expected.some((token) => tokens.includes(token)), `expected ${expected.join('/')} but reached ${tokens.join(', ')}`);
    records.push({ id, result: 'PASS', actual_tokens: tokens });
  } catch (error) { records.push({ id, result: 'FAIL', actual_tokens: tokens, error: error instanceof Error ? error.message : String(error) }); }
}
try {
  mutate('D8-M01', ['DUP_REFERENCE'], (f) => writeFixtureFile(f.run, 'ledgers/claim-inventory.md',
    readFileSync(join(f.run, 'ledgers/claim-inventory.md'), 'utf8').replace(/^\| CC-0801 \|.*\n/mu, '')));
  mutate('D8-M02', ['DUP_REFERENCE'], () => {}, 'canonical', (f) => core.buildComparisonBasis(loadRun(f.run), ['CC-0801', 'CC-0802']));
  mutate('D8-M03', ['DUP_REFERENCE'], (f) => reseal(f, (s) => s.proposal.member_ids.push(s.proposal.member_ids[0])));
  mutate('D8-M04', ['DUP_ACCOUNTING', 'DUP_EVIDENCE'], (f) => reseal(f, (s) => {
    const union = s.proposal.provenance_union; union.occurrences.pop();
    const keys = union.occurrences.map(semanticJson);
    for (const m of union.member_occurrences) { m.occurrence_keys = keys; for (const u of m.unit_occurrences) u.occurrence_keys = keys; }
    s.proposal.origin_assessment.occurrence_groups[0].occurrence_keys = keys;
  }));
  mutate('D8-M05', ['DUP_ACCOUNTING'], (f) => reseal(f, (s) => s.proposal.provenance_union.packet_ids.pop()));
  mutate('D8-M06', ['DUP_REFERENCE'], (f) => reseal(f, (s) => { s.proposal.representative!.basis_member_ids = ['CC-9999']; }), 'canonical');
  mutate('D8-M07', ['K2.15', 'DUP_ACCOUNTING'], (f) => writeFixtureFile(f.run, 'ledgers/lineage.md',
    readFileSync(join(f.run, 'ledgers/lineage.md'), 'utf8') + '| LIN-0999 | S4 | reject | CC-0801 | none | Synthetic double terminalization. | fixture |\n'), 'canonical');
  mutate('D8-M08', ['DUP_ACCOUNTING'], (f) => {
    const row = f.ledger.effects[0], path = row.record_ref.split('@')[0], e = JSON.parse(readFileSync(join(f.run, path), 'utf8'));
    e.lineage_id = 'LIN-9999'; row.lineage_id = e.lineage_id;
    writeFixtureFile(f.run, path, semanticJson(e)); row.record_ref = `${path}@${materialHash(semanticJson(e))}`; duplicateFixtureWrite(f);
  }, 'canonical');
  mutate('D8-M09', ['DUP_SUBJECT'], (f) => {
    const path = semanticSubjectPath('SEM-0801'), s = JSON.parse(readFileSync(join(f.run, path), 'utf8'));
    s.output_binding.normalized_claim = 'An altered synthetic assertion.'; s.semantics.units[0].proposition = s.output_binding.normalized_claim;
    writeFixtureFile(f.run, path, semanticJson(s));
    writeFixtureFile(f.run, 'ledgers/claim-inventory.md', readFileSync(join(f.run, 'ledgers/claim-inventory.md'), 'utf8')
      .replace('| CC-0801 | The indicator lit during trial A. |', '| CC-0801 | An altered synthetic assertion. |'));
  });
  mutate('D8-M10', ['DUP_REVIEW'], (f) => { f.ledger.assignments.pop(); duplicateFixtureWrite(f); }, 'unknown');
  mutate('D8-M11', ['DUP_REVIEW'], (f) => { f.ledger.results.pop(); duplicateFixtureWrite(f); }, 'unknown');
  mutate('D8-M10-round1', ['DUP_REVIEW'], (f) => { f.ledger.assignments = []; duplicateFixtureWrite(f); });
  mutate('D8-M11-round1', ['DUP_REVIEW'], (f) => { f.ledger.results = []; duplicateFixtureWrite(f); });
  mutate('D8-M12', ['DUP_SUBJECT'], (f) => {
    const r = duplicateFixtureResult(f.subject!); r.subject_digest = `sha256:${'e'.repeat(64)}`; writeResult(f, 0, r);
  });
  mutate('D8-M13', ['DUP_ISOLATION'], (f) => {
    const row = f.ledger.results[0], path = row.execution_evidence_ref.split('@')[0], evidence = JSON.parse(readFileSync(join(f.run, path), 'utf8'));
    evidence.reviewer_actor = evidence.producer_actor; writeFixtureFile(f.run, path, semanticJson(evidence));
    row.execution_evidence_ref = `${path}@${materialHash(semanticJson(evidence))}`; duplicateFixtureWrite(f);
  });
  mutate('D8-M14', ['DUP_ISOLATION'], () => {}, 'separate', (f) => core.validateDuplicateAttachmentDelivery(f.subject!, core.DUPLICATE_TASKS.refutation,
    [{ path: core.duplicatePath('subjects', 'DUP-0001'), bytes: Buffer.from(semanticJson(f.subject)) }, { path: 'producer-rationale.md', bytes: Buffer.from('Forbidden.') }]));
  mutate('D8-M15', ['DUP_ENUM'], (f) => reseal(f, (s) => { s.proposal.outcome = 'contradiction' as never; }));
  mutate('D8-M16', ['DUP_STATE'], (f) => {
    writeResult(f, 0, duplicateFixtureResult(f.subject!, 'cannot-determine'));
    duplicateFixtureReview(f, 'upheld', 2);
    Object.assign(f.ledger.decisions[0], { verdict: 'cannot-determine', reviewed_outcome: 'none', review_ids: '["VER-0811","VER-0812"]' });
    duplicateFixtureWrite(f);
  }, 'canonical');
  mutate('D8-M16-reviewer-finding', ['DUP_STATE'], (f) => {
    const result = duplicateFixtureResult(f.subject!);
    result.unresolved_findings = [{ finding_id: 'F1', dimension: 'conditions',
      input_refs: ['/semantic_projections/0/semantics/units/0/conditions'], anchor_refs: [], material_refs: [],
      missing: 'A surviving conditional distinction remains unresolved.', requested_context: [] }];
    writeResult(f, 0, result);
  }, 'canonical');
  for (const [id, dimension] of [['D8-M17', 'qualifiers'], ['D8-M18', 'conditions']]) mutate(id, ['DUP_ACCOUNTING'], (f) => reseal(f, (s) => {
    s.proposal.distinctions = s.proposal.distinctions.filter((d) => d.dimension !== dimension).map((d, i) => ({ ...d, distinction_id: `D${i + 1}` }));
  }));
  mutate('D8-M19', ['DUP_SUBJECT', 'DUP_EVIDENCE'], (f) => reseal(f, (s) => {
    s.comparison_basis.material_views = []; s.comparison_fields = core.duplicateComparisonFields(s.comparison_basis);
    s.proposal = duplicateFixtureProposal(s.comparison_basis);
  }));
  mutate('D8-M20', ['K2.16'], (f) => writeFixtureFile(f.run, 'ledgers/relations.md', `# Typed Relations\n\n- relation_format: ${RELATION_FORMAT}\n\n`
    + fixtureTable([...RELATION_TABLE_HEADER], [['REL-0999', 'S4', 'duplicate', 'overlap', 'CC', 'CC-0801', 'CC', 'CC-0802', 'none', 'none', 'none',
      'asserted', 'none', 'PKT-0701', 'human:fixture', `sha256:${'a'.repeat(64)}`, 'VER-0811']])));
  mutate('D8-M21', ['DUP_REVIEW', 'K2.19'], (f) => {
    const sem = parseSemanticLedger(readFileSync(join(f.run, SEMANTIC_PATH), 'utf8'));
    sem.results = sem.results.filter((r) => r.semantic_id !== 'SEM-0803');
    writeFixtureFile(f.run, SEMANTIC_PATH, semanticLedgerMarkdown(sem));
  }, 'canonical');
  mutate('D8-M22', ['DUP_WINDOW'], () => {}, 'closed', (f) => core.assertDuplicateWindow(loadRun(f.run)));
  {
    const old = makeSemanticFixture(join(temp, 'predecessor'));
    assert.equal(validateRun({ run: old.run }).result, 'PASS');
    writeFixtureFile(old.run, core.DUPLICATE_PATH, core.duplicateLedgerMarkdown(core.emptyDuplicateLedger()));
    const report = validateRun({ run: old.run }), tokens = report.checks.filter((c) => c.status === 'FAIL').flatMap((c) => c.message.match(/DUP_[A-Z]+/gu) || []);
    records.push({ id: 'D8-M23', result: tokens.includes('DUP_COMPATIBILITY') ? 'PASS' : 'FAIL', actual_tokens: tokens });
  }
  mutate('D8-M24', ['DUP_ACCOUNTING'], (f) => writeFixtureFile(f.run, core.DUPLICATE_PATH,
    core.duplicateLedgerMarkdown(core.emptyDuplicateLedger()) + '\nSelf-reported totals: 1 discovery, 1 proposal, 1 review, 1 effect.\n'));
  mutate('D8-M25', ['DUP_ISOLATION'], (f) => {
    const row = f.ledger.assignments[0], a = JSON.parse(readFileSync(join(f.run, row.assignment_path), 'utf8'));
    a.execution_kind = 'native-dispatch'; writeFixtureFile(f.run, row.assignment_path, semanticJson(a)); row.assignment_digest = materialHash(semanticJson(a));
    f.ledger.results[0].execution_kind = 'native-dispatch'; duplicateFixtureWrite(f);
  });
  mutate('D8-M26', ['DUP_SUBJECT'], (f) => writeFixtureFile(f.run, 'ledgers/claim-inventory.md',
    readFileSync(join(f.run, 'ledgers/claim-inventory.md'), 'utf8').replace('| CC-0801 | The indicator lit during trial A. |', '| CC-0801 | Changed content. |')));
  mutate('D8-M27', ['DUP_ACCOUNTING'], (f) => {
    for (const key of ['proposals', 'assignments', 'results', 'decisions', 'effects'] as const) f.ledger[key] = [];
    duplicateFixtureWrite(f);
  });
  mutate('D8-M28', ['DUP_STATE'], (f) => reseal(f, (s) => {
    const d = s.proposal.distinctions.find((d) => d.dimension === 'source-occurrence')!; d.treatment = 'collapsible'; d.retained_at = null;
  }));
  mutate('D8-M29', ['DUP_STATE'], (f) => reseal(f, (s) => {
    s.proposal.origin_assessment.corroboration = 'CANNOT_DETERMINE'; s.proposal.origin_assessment.unresolved_finding_refs = ['F1'];
    s.proposal.unresolved_findings = [{ finding_id: 'F1', dimension: 'support-origin', input_refs: ['/occurrences'], anchor_refs: [],
      material_refs: [], missing: 'Independent origin is not determined.', requested_context: [] }];
  }), 'canonical');
  mutate('D8-M30', ['DUP_ACCOUNTING'], (f) => { f.ledger.effects = []; duplicateFixtureWrite(f); }, 'canonical');
  mutate('D8-M30-omitted-successor-attempt', ['DUP_ACCOUNTING'], (f) => {
    const row = f.ledger.effects[0], path = row.record_ref.split('@')[0], effect = JSON.parse(readFileSync(join(f.run, path), 'utf8'));
    effect.semantic_ids = []; writeFixtureFile(f.run, path, semanticJson(effect));
    row.record_ref = `${path}@${materialHash(semanticJson(effect))}`; duplicateFixtureWrite(f);
  }, 'canonical');
  mutate('D8-M31', ['DUP_WINDOW'], (f) => writeFixtureFile(f.run, 'run-log.md',
    readFileSync(join(f.run, 'run-log.md'), 'utf8').replace(/duplicate_review_closure_hash: sha256:[0-9a-f]{64}/u,
      `duplicate_review_closure_hash: sha256:${'c'.repeat(64)}`)), 'closed');
  mutate('D8-M32', ['DUP_ISOLATION'], (f) => reseal(f, (s) => { s.reviewer_profile.model_identity = { model_id: 'fake-human' }; }));
  mutate('D8-M32-extra-effort', ['DUP_ISOLATION'], (f) => reseal(f, (s) => { Object.assign(s.reviewer_profile, { effort: 'xhigh' }); }));
  mutate('D8-M32-fake-digest', ['DUP_ISOLATION'], (f) => reseal(f, (s) => { s.reviewer_profile.profile_digest = `sha256:${'a'.repeat(64)}`; }));
  for (const field of ['reviewer_actor', 'reviewer_pass_id']) mutate(`D8-M32-round2-${field}`, ['DUP_ISOLATION'], (f) => {
    const first = JSON.parse(readFileSync(join(f.run, f.ledger.results[0].execution_evidence_ref.split('@')[0]), 'utf8'));
    const row = f.ledger.results[1], path = row.execution_evidence_ref.split('@')[0], second = JSON.parse(readFileSync(join(f.run, path), 'utf8'));
    second[field] = first[field]; writeFixtureFile(f.run, path, semanticJson(second));
    row.execution_evidence_ref = `${path}@${materialHash(semanticJson(second))}`; duplicateFixtureWrite(f);
  }, 'unknown');
  mutate('D8-M33', ['DUP_FORMAT'], (f) => {
    const path = core.duplicatePath('subjects', 'DUP-0001');
    writeFixtureFile(f.run, path, readFileSync(join(f.run, path), 'utf8').replace('{"format":', '{"format":"duplicate-key","format":'));
  });
  mutate('D8-M29-map-origin-laundering', ['DUP_STATE'], (f) => {
    const map = loadRun(f.run).merges[0].cells.map((cell) => cell.replaceAll('&#124;', '|'));
    map[2] = 'restatement'; map[4] = 'independent';
    writeFixtureFile(f.run, 'ledgers/merge-map.md', '# Duplicate / Merge Map\n\n'
      + fixtureTable(['canonical', 'absorbs', 'basis', 'provenance retained', 'corroboration', 'status'], [map]));
    const row = f.ledger.effects[0], path = row.record_ref.split('@')[0], effect = JSON.parse(readFileSync(join(f.run, path), 'utf8')) as DuplicateEffect;
    effect.merge_row_digest = materialHash(semanticJson(map));
    writeFixtureFile(f.run, path, semanticJson(effect));
    row.record_ref = `${path}@${materialHash(semanticJson(effect))}`; duplicateFixtureWrite(f);
  }, 'canonical');
  mutate('D8-M34', ['DUP_STATE'], (f) => {
    const a = JSON.parse(readFileSync(join(f.run, f.ledger.assignments[0].assignment_path), 'utf8')) as DuplicateAssignment;
    a.review_id = 'VER-0812'; a.invocation_id = 'extra-review-pass'; a.round = 2;
    const path = core.duplicatePath('assignments', a.review_id);
    writeFixtureFile(f.run, path, semanticJson(a));
    f.ledger.assignments.push({ review_id: a.review_id, proposal_id: a.proposal_id, assignment_path: path, assignment_digest: materialHash(semanticJson(a)) });
    duplicateFixtureWrite(f);
  });
  mutate('D8-M34-third-round', ['DUP_STATE'], (f) => {
    const a = JSON.parse(readFileSync(join(f.run, f.ledger.assignments[1].assignment_path), 'utf8')) as DuplicateAssignment;
    Object.assign(a, { review_id: 'VER-0813', invocation_id: 'third-round', round: 3 });
    const path = core.duplicatePath('assignments', a.review_id); writeFixtureFile(f.run, path, semanticJson(a));
    f.ledger.assignments.push({ review_id: a.review_id, proposal_id: a.proposal_id, assignment_path: path, assignment_digest: materialHash(semanticJson(a)) });
    duplicateFixtureWrite(f);
  }, 'unknown');
} finally { rmSync(temp, { recursive: true, force: true }); }
const report = { result: records.every((r) => r.result === 'PASS') ? 'PASS' : 'FAIL', records,
  process_mutation: 'D8-M35 is exercised against actual writer journals in test-duplicate-review-process.ts.' };
console.log(JSON.stringify(report, null, 2)); process.exitCode = report.result === 'PASS' ? 0 : 1;

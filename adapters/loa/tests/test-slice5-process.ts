#!/usr/bin/env node

import {
  chmodSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assembleBundles } from '../../../scripts/assemble-bundles.ts';
import {
  buildProceduralAuthorityRequest,
  buildProceduralAuthorityResponse,
  buildProceduralAuthoritySubject,
  exactTextBlob,
  materialImpactSubjectDigest,
  materialImpactSubjectJson,
  proceduralAuthorityRequestJson,
  resolvePinnedCoreRequirement,
  restrictionOverlay,
  type MaterialImpactSubject,
  type PinnedCoreAuthority,
  type ProceduralAction,
} from '../../../scripts/lib/internal-ambiguity.ts';
import { runK2Ambiguities } from '../../../scripts/lib/checks-k2-ambiguities.ts';
import { ResultCollector } from '../../../scripts/lib/results.ts';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import { verifyAndLoadLoaBundle } from '../src/core-loader.ts';
import {
  sha256Digest,
  walkRegularFiles,
} from '../src/fs.ts';
import { LedgerWriter } from '../src/ledger-writer.ts';
import {
  openHumanAuthorityGate,
  readRunState,
  recordHumanAuthorityDecision,
  writeRunState,
} from '../src/run-control.ts';
import {
  LOA_ROLE_IDS,
  LOA_RUN_STATE_FORMAT,
  type Clock,
  type ExactModelIdentity,
  type JsonValue,
  type LoaRoleId,
  type LoaRunState,
  type WorkerDispatchReceipt,
} from '../src/types.ts';
import {
  assembleWorkerBundle,
  coreBlindPolicyReference,
} from '../src/worker-bundle.ts';
import {
  validateWorkerReturn,
  type ValidatedWorkerReturn,
} from '../src/worker-return.ts';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const FIXTURE_ROOT = join(REPO_ROOT, 'docs/fixtures/internal-ambiguity-lifecycle');
const FIXED_TIME = '2040-01-02T03:10:00.000Z';
const CLOCK: Clock = { now: () => FIXED_TIME };
const CASES: string[] = [];

function expect(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function expectThrows(operation: () => unknown, pattern: RegExp, label: string): void {
  let thrown: unknown;
  try {
    operation();
  } catch (error) {
    thrown = error;
  }
  expect(thrown !== undefined, `${label} unexpectedly succeeded`);
  const message = thrown instanceof Error ? thrown.message : String(thrown);
  expect(pattern.test(message), `${label} failed with unexpected diagnostic: ${message}`);
}

function pass(name: string): void {
  CASES.push(name);
  console.log(`PASS ${name}`);
}

function makeWritable(path: string): void {
  if (!existsSync(path)) return;
  const stat = lstatSync(path);
  if (stat.isDirectory()) {
    chmodSync(path, 0o700);
    for (const entry of readdirSync(path)) makeWritable(join(path, entry));
  } else {
    chmodSync(path, 0o600);
  }
}

function fixtureModel(): ExactModelIdentity {
  return {
    provider: 'fixture',
    model_id: 'fixture-model',
    resolved_version: 'fixture-model@2040-01-02',
    identity_kind: 'fixture-simulated',
    immutable: true,
    context: 'fixture-context',
    effort: 'fixture-effort',
    budget: 'fixture-budget',
    cache: 'fixture-cache',
    batch: 'fixture-batch',
    fallback: false,
  };
}

function initialState(
  runId: string,
  bundle: ReturnType<typeof verifyAndLoadLoaBundle>,
): LoaRunState {
  const model = fixtureModel();
  const models = Object.fromEntries(
    LOA_ROLE_IDS.map((role) => [role, structuredClone(model)]),
  ) as LoaRunState['identity']['models'];
  return {
    format: LOA_RUN_STATE_FORMAT,
    run_id: runId,
    mode: 'agent',
    full_mode: 'fixture-simulated',
    identity: {
      core: bundle.lock.core,
      adapter: bundle.lock.adapter,
      bundle: {
        ...bundle.lock.bundle,
        lock_digest: bundle.lock.lock_digest,
        lock_ref: 'control/bundle.lock.json',
        installation_ref: 'fixture-simulated',
      },
      checker_digest: bundle.lock.checker_digest,
      adapter_protocol_version: bundle.lock.adapter_protocol_version,
      run_format_version: bundle.lock.run_format_version,
      host: {
        id: 'loa',
        version: 'fixture-simulated',
        build_id: 'fixture-simulated',
      },
      profile: {
        id: 'slice5-process-fixture',
        digest: `sha256:${'7'.repeat(64)}`,
      },
      models,
      runtime: {
        snapshot_ref: 'control/runtime/snapshot.json',
        digest: `sha256:${'8'.repeat(64)}`,
      },
    },
    corpus: {
      state: 'frozen',
      inventory_ref: 'corpus/manifest.md',
      tree_digest: `sha256:${'9'.repeat(64)}`,
    },
    execution: {
      core_state: 'DISTILLING',
      stage: 'S4',
      stage_status: 'running',
      gate: null,
      halt: null,
      resume: {
        sequence: '0',
        checkpoint_digest: '',
        last_verified_at: FIXED_TIME,
      },
    },
    ledger: {
      writer_id: 'loa-orchestrator',
      sequence: '0',
      chain_head: sha256Digest(Buffer.alloc(0)),
    },
  };
}

function preC1RunLog(finalLog: string): string {
  const boundary = '\n## 2026-08-14 09:00 UTC — S4 — C1\n';
  const index = finalLog.indexOf(boundary);
  expect(index >= 0, 'fixture run log omits the S4-C1 boundary');
  return `${finalLog.slice(0, index)}\n\n## 2026-08-14 08:55 UTC — S4 — entry\n\n`
    + 'Prepared the canonical relation ledger for the composite Slice 5 closure barrier.\n';
}

function emptyAmbiguityLedger(runId: string): string {
  return `# Internal Ambiguities — ${runId}\n\n`
    + '- internal_ambiguity_format: aleph-internal-ambiguity/v1\n\n'
    + '## T5.1 Ambiguity definitions\n\n'
    + '| ambiguity_id | source_entity_kind | source_entity_id | source_id | expression_locator | expression_start_byte | expression_end_byte | expression_sha256 | expression_bytes_base64 | basis_packet_ids | detected_by |\n'
    + '|--------------|--------------------|------------------|-----------|--------------------|-----------------------|---------------------|-------------------|-------------------------|------------------|-------------|\n\n'
    + '## T5.2 Reviewed assessments\n\n'
    + '| ambiguity_id | assessment_seq | predecessor_assessment_seq | search_scope_kind | search_source_id | search_completion_ref | search_basis_digest | candidate_state | candidate_refs | affected_relation_ids | resolution_state | carry_state | proposed_by | review_subject_digest | reviewed_by |\n'
    + '|--------------|----------------|----------------------------|-------------------|------------------|-----------------------|---------------------|-----------------|----------------|-----------------------|------------------|-------------|-------------|-----------------------|-------------|\n\n'
    + '## T5.3 Procedural authority\n\n'
    + '| ambiguity_id | authority_seq | assessment_seq | action | selected_candidate_ref | authority_subject_digest | authority_ref | closure_provenance |\n'
    + '|--------------|---------------|----------------|--------|------------------------|--------------------------|---------------|--------------------|\n';
}

function withheldInventory(
  bundle: ReturnType<typeof verifyAndLoadLoaBundle>,
  runDir: string,
  role: LoaRoleId,
  allowlist: string[],
) {
  const allowed = new Set(allowlist);
  const coreRef = coreBlindPolicyReference(bundle, role, 'S4');
  return walkRegularFiles(runDir)
    .map((path) => relative(runDir, path).split(sep).join('/'))
    .filter((path) => !path.startsWith('control/') && !allowed.has(path))
    .sort((left, right) => left.localeCompare(right))
    .map((selector) => ({ selector, core_ref: coreRef }));
}

function validatedFixtureReturn(
  bundle: ReturnType<typeof verifyAndLoadLoaBundle>,
  runDir: string,
  state: LoaRunState,
): ValidatedWorkerReturn<JsonValue> {
  const assembled = assembleWorkerBundle({
    bundle,
    runDir,
    callId: 'CALL-SLICE5-PROCESS-0001',
    runId: state.run_id,
    stage: 'S4',
    role: 'merge-judge',
    kind: 'producer',
    allowlist: [],
    withheld: withheldInventory(bundle, runDir, 'merge-judge', []),
    taskLine: 'Return the sealed fixture merge-judge exemplar.',
    modelIdentity: state.identity.models['merge-judge'],
  });
  const raw: JsonValue = {
    canonicalizations: [{
      lineage_type: 'merge',
      predecessors: ['CC-0401'],
      successor: {
        normalized_claim: 'Fixture-only canonical claim.',
        packets: ['PKT-0401'],
        claim_type: 'descriptive',
      },
      basis: 'Fixture-only validated return for writer process evidence.',
      corroboration: 'independent',
      rationale: 'Exercise the branded return boundary without semantic use.',
      flags: [],
    }],
    contradiction_pairs: [{
      a: 'CC-0401',
      b: 'CC-0402',
      why: 'Fixture-only structural pair.',
    }],
  };
  const receipt: WorkerDispatchReceipt = {
    format: 'aleph-loa-worker-dispatch/v1',
    call_id: assembled.request.call_id,
    context_id: 'CTX-SLICE5-PROCESS-0001',
    producer_context_id: null,
    fresh_context: true,
    inherited_context: false,
    filesystem: 'bundle-read-only',
    model_identity: assembled.request.model_identity,
    simulation: { kind: 'fixture-simulated' },
  };
  const result = validateWorkerReturn({
    workerBundleRoot: assembled.root,
    raw,
    dispatchReceipt: receipt,
  });
  expect(result.report.result === 'PASS' && result.validated !== null,
    `fixture worker return failed validation: ${result.report.errors.join('; ')}`);
  return result.validated as ValidatedWorkerReturn<JsonValue>;
}

function main(): void {
  const tempRoot = mkdtempSync(join(tmpdir(), 'aleph-slice5-process-'));
  const bundleOutput = join(REPO_ROOT, '.aleph-bundles', `slice5-process-${process.pid}`);
  try {
    const assembly = assembleBundles(REPO_ROOT, bundleOutput);
    expect(assembly.result === 'PASS', `temporary bundle assembly failed: ${assembly.errors.join('; ')}`);
    const bundle = verifyAndLoadLoaBundle(join(bundleOutput, 'aleph-for-loa'));
    expect(bundle.lock.run_format_version === '1.5.0-provisional',
      `temporary bundle retained ${bundle.lock.run_format_version}`);
    pass('immutable temporary Loa bundle activates run format 1.5');

    const pinnedCoreAuthority: PinnedCoreAuthority = {
      source_kind: 'retained-immutable-bundle',
      root: bundle.root,
      lock: bundle.lock,
      expected_bundle_digest: bundle.lock.bundle.digest,
      expected_core_digest: bundle.lock.core.tree_digest,
      files: bundle.files,
      file_bytes: bundle.fileBytes,
    };
    const requirementRef = 'core:docs/architecture/04-pipeline-stages-and-dod.md#S5 — Disposition pass';
    const resolvedRequirement = resolvePinnedCoreRequirement(pinnedCoreAuthority, requirementRef);
    expect(resolvedRequirement.path === 'docs/architecture/04-pipeline-stages-and-dod.md'
      && resolvedRequirement.selector === 'S5 — Disposition pass'
      && resolvedRequirement.selector_kind === 'heading'
      && resolvedRequirement.bytes.byteLength > 0,
    'pinned Core requirement did not reopen the exact retained heading bytes');
    pass('requirement_ref resolves only through the retained immutable bundle and exact Core bytes');

    const tamperedCoreBytes = new Map(bundle.fileBytes);
    tamperedCoreBytes.set(
      resolvedRequirement.path,
      Buffer.concat([tamperedCoreBytes.get(resolvedRequirement.path) || Buffer.alloc(0), Buffer.from('\nmutated\n')]),
    );
    expectThrows(
      () => resolvePinnedCoreRequirement({
        ...pinnedCoreAuthority,
        file_bytes: tamperedCoreBytes,
      }, requirementRef),
      /retained Core bytes are absent or disagree with the pinned inventory/u,
      'tampered retained Core requirement bytes',
    );
    pass('requirement_ref resolution fails closed on retained Core byte drift');

    const runDir = join(tempRoot, 'run');
    cpSync(FIXTURE_ROOT, runDir, { recursive: true });
    mkdirSync(join(runDir, 'control', 'transactions'), { recursive: true });
    mkdirSync(join(runDir, 'control', 'gates'), { recursive: true });
    const runId = 'RUN-internal-ambiguity-lifecycle';
    const fullAmbiguities = readFileSync(join(runDir, 'ledgers/internal-ambiguities.md'));
    const finalRunLog = readFileSync(join(runDir, 'run-log.md'), 'utf8');
    writeFileSync(join(runDir, 'run-log.md'), preC1RunLog(finalRunLog));
    writeFileSync(join(runDir, 'ledgers/internal-ambiguities.md'), emptyAmbiguityLedger(runId));
    const state = initialState(runId, bundle);
    writeRunState(runDir, state);
    const validated = validatedFixtureReturn(bundle, runDir, state);
    const writer = new LedgerWriter(runDir, CLOCK);

    const relationPath = join(runDir, 'ledgers/relations.md');
    const relationBefore = readFileSync(relationPath);
    writer.append(
      'ledgers/relations.md',
      validated,
      () => '<!-- fixture legal pre-C1 relation write -->',
    );
    expect(!readFileSync(relationPath).equals(relationBefore),
      'legal pre-C1 relation append left relation bytes unchanged');
    pass('relation append succeeds in the legal pre-C1 window');

    writer.advanceSlice5ClosurePhase('S4-C1-relations-closed');
    expect(readFileSync(join(runDir, 'run-log.md'), 'utf8')
      .includes('closure_phase: S4-C1-relations-closed'), 'C1 marker was not retained');
    pass('C1 advances only after prospective K2.16 validation');

    const relationAtC1 = readFileSync(relationPath);
    expectThrows(
      () => writer.append('ledgers/relations.md', validated, () => '<!-- forbidden append -->'),
      /post-C1 canonical relation append refused before bytes change/u,
      'post-C1 relation append',
    );
    expect(readFileSync(relationPath).equals(relationAtC1), 'post-C1 append changed relation bytes');
    pass('post-C1 relation append is refused before bytes change');

    expectThrows(
      () => writer.remove('ledgers/relations.md'),
      /post-C1 canonical relation delete refused before bytes change/u,
      'post-C1 relation deletion',
    );
    expect(readFileSync(relationPath).equals(relationAtC1), 'post-C1 deletion changed relation bytes');
    pass('post-C1 relation deletion is refused before bytes change');

    expectThrows(
      () => writer.replace('ledgers/relations.md', validated, () => 'forbidden'),
      /post-C1 canonical relation replace refused before bytes change/u,
      'post-C1 relation replacement',
    );
    expect(readFileSync(relationPath).equals(relationAtC1), 'post-C1 replacement changed relation bytes');
    pass('post-C1 relation edit/replacement is refused before bytes change');

    expectThrows(
      () => writer.retarget('ledgers/relations.md', validated, () => 'forbidden'),
      /post-C1 canonical relation retarget refused before bytes change/u,
      'post-C1 relation retarget',
    );
    expect(readFileSync(relationPath).equals(relationAtC1), 'post-C1 retarget changed relation bytes');
    pass('post-C1 relation retarget is refused before bytes change');

    const logAtC1 = readFileSync(join(runDir, 'run-log.md'));
    expectThrows(
      () => writer.advanceSlice5ClosurePhase('S4-C1-relations-closed'),
      /not the single next durable phase/u,
      'silent C1 rerun',
    );
    expect(readFileSync(join(runDir, 'run-log.md')).equals(logAtC1),
      'silent C1 rerun changed run-log bytes');
    pass('silent C1 rerun is refused before bytes change');

    const ambiguityPath = join(runDir, 'ledgers/internal-ambiguities.md');
    writeFileSync(ambiguityPath, fullAmbiguities);
    const t52Line = readFileSync(ambiguityPath, 'utf8')
      .split('\n')
      .find((line) => line.startsWith('| AMB-1503 | 1 |'));
    expect(t52Line !== undefined, 'fixture lacks AMB-1503 T5.2 row');
    const ambiguityReviewPath = join(
      runDir,
      'verification/harness/S4-ambiguities/VER-1503.md',
    );
    const operativeScope = {
      affected_ids: ['CC-0413'],
      impact_rows: [{
        affected_id: 'CC-0413',
        operation_kind: 'load-bearing-reasoning' as const,
        requirement_ref: 'core:docs/architecture/04-pipeline-stages-and-dod.md#S5 — Disposition pass',
        unresolved_treatment: 'carry-or-restriction' as const,
        consequence_if_unresolved: 'The downstream use remains explicitly contingent on the unresolved expression.',
      }],
    };
    const materialSubject: MaterialImpactSubject = {
      format: 'aleph-internal-ambiguity-material-impact-review-subject/v1',
      run_id: runId,
      ambiguity_id: 'AMB-1503',
      assessment_seq: 1,
      material_impact_seq: 1,
      t5_2_assessment_ref: `internal-ambiguity:T5.2:AMB-1503:A1@${sha256Digest(t52Line)}`,
      t5_2_review_subject_digest: 'sha256:971c8b4b48522d87dc994a48823f1f4eabce05cd1c990b1bd08f506e5caf201d',
      t5_2_review_ref: `ambiguity-review-verdict:VER-1503@${sha256Digest(readFileSync(ambiguityReviewPath))}`,
      c1_relation_basis_ref: 'none',
      materiality_class: 'C',
      operative_scope: operativeScope,
      source_locators: ['SRC-0401:L8-L8'],
      reviewed_unaffected_ids: [],
      unresolved_statement: 'The frozen same-source bytes do not identify one local referent.',
      review_proposition: 'class-B-or-C-and-canonical-operative-scope-complete-and-accurate-under-cited-Core-requirements',
      proposed_by: 'invocation:material-impact-producer-0001',
    };
    const materialSubjectText = materialImpactSubjectJson(materialSubject);
    const materialDigest = materialImpactSubjectDigest(materialSubject);
    const materialSubjectPath = join(
      runDir,
      'verification/harness/S4/material-impact-subjects/AMB-1503-A1-M1.json',
    );
    mkdirSync(dirname(materialSubjectPath), { recursive: true });
    writeFileSync(materialSubjectPath, materialSubjectText);
    const materialReviewPath = join(
      runDir,
      'verification/harness/S4-material-impact/VER-1591.md',
    );
    mkdirSync(dirname(materialReviewPath), { recursive: true });
    writeFileSync(
      materialReviewPath,
      '# Verdict VER-1591\n\n'
        + '| field | value |\n'
        + '|-------|-------|\n'
        + `| target | internal-ambiguity-material-impact-review-subject:${materialDigest} |\n`
        + '| lens | fresh material-impact exact-subject challenge |\n'
        + '| stage | S4-C2 material-impact review |\n'
        + '| shown | exact material subject, bound T5.2 review, cited Core requirement, reopened object, and C1 basis |\n'
        + '| withheld | human comments, observations, forecasts, desired actions, candidate preferences, and desired conclusions |\n'
        + '| verdict | upheld |\n'
        + '| consequence | fixture Class C basis may proceed to bounded human procedure |\n',
    );
    const authoritySubject = buildProceduralAuthoritySubject({
      run_id: runId,
      ambiguity_id: 'AMB-1503',
      assessment_seq: 1,
      t5_2_assessment_ref: materialSubject.t5_2_assessment_ref,
      t5_2_review_subject_digest: 'sha256:971c8b4b48522d87dc994a48823f1f4eabce05cd1c990b1bd08f506e5caf201d',
      t5_2_review_ref: materialSubject.t5_2_review_ref,
      prior_indeterminate_review_refs: [],
      candidate_state: 'null-no-candidate',
      candidate_refs: [],
      carry_state: 'none',
      affected_relation_ids: [],
      c1_relation_basis_ref: 'none',
      material_impact_seq: 1,
      material_impact_subject_ref: `material-impact-subject:AMB-1503:A1:M1@${materialDigest}`,
      material_impact_review_ref: `material-impact-verdict:VER-1591@${sha256Digest(readFileSync(materialReviewPath))}`,
      operative_scope: structuredClone(operativeScope),
      source_locators: ['SRC-0401:L8-L8'],
      reviewed_unaffected_ids: [],
      unresolved_statement: 'The frozen same-source bytes do not identify one local referent.',
    });
    const request = buildProceduralAuthorityRequest({
      request_seq: 1,
      subject: authoritySubject,
      presentation: true,
      required_authority_identity: 'human:fixture-operator',
      prepared_by: 'invocation:loa-orchestrator',
      requested_at: FIXED_TIME,
    });
    openHumanAuthorityGate(runDir, {
      gateId: request.request_id,
      gateType: 'internal-ambiguity-procedural-decision',
      stage: 'S4',
      now: FIXED_TIME,
      request: request as unknown as JsonValue,
    });
    expect(readRunState(runDir).execution.gate?.id === request.request_id,
      'procedural request did not become the one active gate');
    pass('Class C procedural request is retained as the one active human gate');

    expectThrows(
      () => openHumanAuthorityGate(runDir, {
        gateId: 'GATE-S4-AMB-1503-A1-Q2',
        gateType: 'internal-ambiguity-procedural-decision',
        stage: 'S4',
        now: FIXED_TIME,
        request: request as unknown as JsonValue,
      }),
      /already awaiting a response/u,
      'parallel procedural request',
    );
    pass('a parallel procedural request is refused while Q1 is active');

    const requestBytes = Buffer.from(proceduralAuthorityRequestJson(request), 'utf8');
    const authorityCheckpoint = join(tempRoot, 'authority-checkpoint');
    cpSync(runDir, authorityCheckpoint, { recursive: true });
    const actionCases: Array<{
      action: Exclude<ProceduralAction, 'carry-unresolved'>;
      halt: string | null;
      followup: 'nonterminal-response' | 'actual-resume-after-suspensive-block' | null;
    }> = [
      { action: 'restrict-downstream-use', halt: null, followup: null },
      { action: 'inspect-source', halt: 'S4_C2_FOLLOWUP_REQUEST_REQUIRED', followup: 'nonterminal-response' },
      { action: 'block-at-current-barrier', halt: 'BLOCKED_AT_S4_C2', followup: 'actual-resume-after-suspensive-block' },
      { action: 'request-successor-corpus-run', halt: 'SUCCESSOR_CORPUS_RUN_REQUIRED', followup: null },
      { action: 'record-human-observation', halt: 'S4_C2_FOLLOWUP_REQUEST_REQUIRED', followup: 'nonterminal-response' },
    ];
    for (const [index, actionCase] of actionCases.entries()) {
      const actionRun = join(tempRoot, `action-${actionCase.action}`);
      cpSync(authorityCheckpoint, actionRun, { recursive: true });
      const independentBefore = new Map([
        ['ledgers/disposition-ledger.md', readFileSync(join(actionRun, 'ledgers/disposition-ledger.md'))],
        ['ledgers/evidence-roles.md', readFileSync(join(actionRun, 'ledgers/evidence-roles.md'))],
        ['ledgers/external-referents.md', readFileSync(join(actionRun, 'ledgers/external-referents.md'))],
        ['ledgers/relations.md', readFileSync(join(actionRun, 'ledgers/relations.md'))],
      ]);
      const observationBytes = Buffer.from(' exact human observation bytes \n', 'utf8');
      const actionResponse = buildProceduralAuthorityResponse({
        request,
        request_bytes: requestBytes,
        authority_identity: 'human:fixture-operator',
        selected_action: actionCase.action,
        observation: actionCase.action === 'record-human-observation'
          ? exactTextBlob(observationBytes)
          : null,
        comment: actionCase.action === 'inspect-source'
          ? exactTextBlob(Buffer.from(' inspect only; no semantic instruction ', 'utf8'))
          : null,
        recorded_at: `2040-01-02T03:${String(20 + index).padStart(2, '0')}:00.000Z`,
      });
      recordHumanAuthorityDecision(actionRun, {
        gateId: request.request_id,
        authorityIdentity: 'human:fixture-operator',
        decision: 'approve',
        recordedAt: actionResponse.recorded_at,
        simulation: { kind: 'fixture-simulated' },
        response: actionResponse as unknown as JsonValue,
      });
      const actionWriter = new LedgerWriter(actionRun, CLOCK);
      actionWriter.appendProceduralAuthorityResponse(request.request_id);
      const actionLedger = readFileSync(join(actionRun, 'ledgers/internal-ambiguities.md'), 'utf8');
      expect(actionLedger.includes(`| AMB-1503 | 1 | 1 | ${actionCase.action} | none |`),
        `${actionCase.action} did not append the exact positive T5.3 row`);
      const actionState = readRunState(actionRun);
      expect(actionState.execution.halt?.code === actionCase.halt
        || (actionCase.halt === null && actionState.execution.halt === null),
      `${actionCase.action} produced the wrong retained halt state`);
      if (actionCase.action === 'record-human-observation') {
        const responseBytes = readFileSync(join(
          actionRun,
          `control/gates/${request.request_id}-response.json`,
        ));
        expect(responseBytes.includes(Buffer.from(exactTextBlob(observationBytes).bytes_base64, 'utf8')),
          'record-human-observation did not retain exact supplied bytes');
      }
      if (actionCase.action === 'restrict-downstream-use') {
        expect(JSON.stringify(restrictionOverlay(authoritySubject.operative_scope))
          === JSON.stringify([{
            affected_id: 'CC-0413',
            operation_kind: 'load-bearing-reasoning',
            requirement_ref: 'core:docs/architecture/04-pipeline-stages-and-dod.md#S5 — Disposition pass',
          }]), 'restriction overlay is not the exact surgical Core tuple projection');
      }
      if (actionCase.followup) {
        const q2 = actionWriter.openProceduralAuthorityFollowup({
          request_id: request.request_id,
          reason: actionCase.followup,
          next_subject: authoritySubject,
          presentation: true,
          required_authority_identity: 'human:fixture-operator',
          prepared_by: 'invocation:loa-orchestrator',
          requested_at: `2040-01-02T04:${String(20 + index).padStart(2, '0')}:00.000Z`,
        });
        expect(q2.request_id === 'GATE-S4-AMB-1503-A1-Q2'
          && readRunState(actionRun).execution.gate?.id === q2.request_id,
        `${actionCase.action} did not create exactly one active Q2 request`);
        const replayed = actionWriter.openProceduralAuthorityFollowup({
          request_id: request.request_id,
          reason: actionCase.followup,
          next_subject: authoritySubject,
          presentation: true,
          required_authority_identity: 'human:fixture-operator',
          prepared_by: 'invocation:loa-orchestrator',
          requested_at: `2040-01-02T04:${String(20 + index).padStart(2, '0')}:00.000Z`,
        });
        expect(replayed.request_id === q2.request_id,
          `${actionCase.action} Q2 recovery was not idempotent`);
        if (actionCase.action === 'block-at-current-barrier') {
          expect(readRunState(actionRun).execution.core_state === 'DISTILLING',
            'actual resume did not restore the same pinned distillation state');
        }
      }
      for (const [path, bytes] of independentBefore) {
        expect(readFileSync(join(actionRun, path)).equals(bytes),
          `${actionCase.action} mechanically mutated independent ${path}`);
      }
      pass(`${actionCase.action} is applied exactly once without S5/S6/S8 or relation conflation`);
    }

    const presentationRun = join(tempRoot, 'presentation-replacement');
    cpSync(authorityCheckpoint, presentationRun, { recursive: true });
    const presentationWriter = new LedgerWriter(presentationRun, CLOCK);
    const presentationQ2 = presentationWriter.openProceduralAuthorityFollowup({
      request_id: request.request_id,
      reason: 'presentation-only-replacement',
      next_subject: authoritySubject,
      presentation: false,
      required_authority_identity: 'human:fixture-operator',
      prepared_by: 'invocation:loa-orchestrator',
      requested_at: '2040-01-02T05:00:00.000Z',
    });
    expect(presentationQ2.presentation === null
      && presentationQ2.authority_subject_digest === request.authority_subject_digest,
    'presentation replacement changed the operative authority subject');
    expectThrows(
      () => recordHumanAuthorityDecision(presentationRun, {
        gateId: request.request_id,
        authorityIdentity: 'human:fixture-operator',
        decision: 'approve',
        recordedAt: '2040-01-02T05:01:00.000Z',
        simulation: { kind: 'fixture-simulated' },
        response: buildProceduralAuthorityResponse({
          request, request_bytes: requestBytes,
          authority_identity: 'human:fixture-operator', selected_action: 'carry-unresolved',
          observation: null, comment: null, recorded_at: '2040-01-02T05:01:00.000Z',
        }) as unknown as JsonValue,
      }),
      /not awaiting the named human authority gate/u,
      'stale Q1 response after presentation replacement',
    );
    pass('presentation-only replacement creates Q2 and makes unanswered Q1 stale');

    const materialRun = join(tempRoot, 'material-revision');
    cpSync(authorityCheckpoint, materialRun, { recursive: true });
    const revisedScope = structuredClone(operativeScope);
    revisedScope.impact_rows[0].consequence_if_unresolved = 'Re-reviewed explanatory consequence with unchanged typed treatment.';
    const materialSubjectM2: MaterialImpactSubject = {
      ...materialSubject,
      material_impact_seq: 2,
      operative_scope: revisedScope,
      proposed_by: 'invocation:material-impact-producer-0002',
    };
    const materialDigestM2 = materialImpactSubjectDigest(materialSubjectM2);
    const materialPathM2 = join(
      materialRun,
      'verification/harness/S4/material-impact-subjects/AMB-1503-A1-M2.json',
    );
    writeFileSync(materialPathM2, materialImpactSubjectJson(materialSubjectM2));
    const materialReviewM2 = join(
      materialRun,
      'verification/harness/S4-material-impact/VER-1592.md',
    );
    writeFileSync(
      materialReviewM2,
      '# Verdict VER-1592\n\n'
        + '| field | value |\n'
        + '|-------|-------|\n'
        + `| target | internal-ambiguity-material-impact-review-subject:${materialDigestM2} |\n`
        + '| lens | fresh material-impact exact-subject challenge |\n'
        + '| stage | S4-C2 material-impact review |\n'
        + '| shown | exact revised material subject and unchanged semantic basis |\n'
        + '| withheld | human response, observation, comment, preference, and desired conclusion |\n'
        + '| verdict | upheld |\n'
        + '| consequence | fixture revised Class C basis may be re-presented |\n',
    );
    const authoritySubjectM2 = buildProceduralAuthoritySubject({
      ...authoritySubject,
      material_impact_seq: 2,
      material_impact_subject_ref: `material-impact-subject:AMB-1503:A1:M2@${materialDigestM2}`,
      material_impact_review_ref: `material-impact-verdict:VER-1592@${sha256Digest(readFileSync(materialReviewM2))}`,
      operative_scope: revisedScope,
    });
    const materialWriter = new LedgerWriter(materialRun, CLOCK);
    const materialQ2 = materialWriter.openProceduralAuthorityFollowup({
      request_id: request.request_id,
      reason: 'material-impact-revision',
      next_subject: authoritySubjectM2,
      presentation: true,
      required_authority_identity: 'human:fixture-operator',
      prepared_by: 'invocation:loa-orchestrator',
      requested_at: '2040-01-02T05:10:00.000Z',
    });
    expect(materialQ2.request_id.endsWith('-Q2')
      && materialQ2.authority_subject.material_impact_seq === 2,
    'M2 material revision did not create exactly Q2');
    const materialResults = new ResultCollector(runId);
    runK2Ambiguities(materialResults, loadRun(materialRun));
    expect(materialResults.checks.find((check) => check.id === 'K2.17')?.status === 'PASS',
      'K2.17 rejected legal historical M1/Q1 plus active M2/Q2 retained state');
    pass('material-impact M2 creates Q2 while preserving historical M1/Q1 and immutable T5.2/C1 bytes');

    const response = buildProceduralAuthorityResponse({
      request,
      request_bytes: requestBytes,
      authority_identity: 'human:fixture-operator',
      selected_action: 'carry-unresolved',
      observation: null,
      comment: null,
      recorded_at: '2040-01-02T03:11:00.000Z',
    });
    recordHumanAuthorityDecision(runDir, {
      gateId: request.request_id,
      authorityIdentity: 'human:fixture-operator',
      decision: 'approve',
      recordedAt: response.recorded_at,
      simulation: { kind: 'fixture-simulated' },
      response: response as unknown as JsonValue,
    });
    const responsePending = readRunState(runDir);
    expect(responsePending.execution.halt?.code === 'S4_C2_RESPONSE_APPLICATION_REQUIRED',
      'retained response advanced run control before T5.3 application');
    expect(!readFileSync(ambiguityPath, 'utf8').includes('| AMB-1503 | 1 | 1 | carry-unresolved |'),
      'recording the response implicitly wrote T5.3');
    pass('response persistence halts before T5.3 and run-control application');

    const observationToken = 'SLICE5-HUMAN-OBSERVATION-EXACT-BYTES-DO-NOT-EXPOSE';
    const observationPath = 'control/gates/withheld-human-observation.txt';
    writeFileSync(join(runDir, observationPath), observationToken);
    const roleCases: Array<{
      role: LoaRoleId;
      kind: 'producer' | 'refuter';
      allowlist: string[];
      producerContextId?: string;
    }> = [
      {
        role: 'ambiguity-producer',
        kind: 'producer',
        allowlist: ['corpus/sources/SRC-0401-source-walk.txt', 'ledgers/source-walk.md'],
      },
      {
        role: 'ambiguity-reviewer',
        kind: 'refuter',
        allowlist: ['corpus/sources/SRC-0401-source-walk.txt', 'ledgers/internal-ambiguities.md'],
        producerContextId: 'CTX-AMBIGUITY-PRODUCER-0001',
      },
      {
        role: 'material-impact-producer',
        kind: 'producer',
        allowlist: ['ledgers/internal-ambiguities.md', 'ledgers/relations.md'],
      },
      {
        role: 'material-impact-reviewer',
        kind: 'refuter',
        allowlist: ['ledgers/internal-ambiguities.md', 'ledgers/relations.md'],
        producerContextId: 'CTX-MATERIAL-IMPACT-PRODUCER-0001',
      },
    ];
    for (const [index, roleCase] of roleCases.entries()) {
      const assembled = assembleWorkerBundle({
        bundle,
        runDir,
        callId: `CALL-SLICE5-WITHHOLD-${String(index + 1).padStart(4, '0')}`,
        runId,
        stage: 'S4',
        role: roleCase.role,
        kind: roleCase.kind,
        allowlist: roleCase.allowlist,
        withheld: withheldInventory(bundle, runDir, roleCase.role, roleCase.allowlist),
        taskLine: 'Return only the exact bounded Slice 5 structured result.',
        modelIdentity: readRunState(runDir).identity.models[roleCase.role],
        producerContextId: roleCase.producerContextId,
      });
      const bundleBytes = Buffer.concat(walkRegularFiles(assembled.root).map((path) => readFileSync(path)));
      expect(!bundleBytes.includes(Buffer.from(observationToken, 'utf8')),
        `${roleCase.role} bundle exposed exact human observation bytes`);
      expect(!bundleBytes.includes(Buffer.from('human:fixture-operator', 'utf8')),
        `${roleCase.role} bundle exposed retained authority identity/response bytes`);
    }
    expectThrows(
      () => assembleWorkerBundle({
        bundle,
        runDir,
        callId: 'CALL-SLICE5-WITHHOLD-ILLEGAL',
        runId,
        stage: 'S4',
        role: 'material-impact-producer',
        kind: 'producer',
        allowlist: [observationPath],
        withheld: withheldInventory(bundle, runDir, 'material-impact-producer', [observationPath]),
        taskLine: 'Return only the exact bounded Slice 5 structured result.',
        modelIdentity: readRunState(runDir).identity.models['material-impact-producer'],
      }),
      /may not expose adapter control state/u,
      'human observation allowlist injection',
    );
    pass('all four Slice 5 worker bundles withhold human response and observation bytes');

    const authorityReceipt = writer.appendProceduralAuthorityResponse(request.request_id);
    const authorityLedger = readFileSync(ambiguityPath, 'utf8');
    expect(authorityLedger.includes('| AMB-1503 | 1 | 1 | carry-unresolved | none |'),
      'exact Core-projected T5.3 row is absent');
    expect(readRunState(runDir).execution.halt === null,
      'progression-enabling response did not clear the application halt');
    pass('ambiguity/T5.3 append succeeds only after C1 and before progression');

    const replayedReceipt = writer.appendProceduralAuthorityResponse(request.request_id);
    expect(replayedReceipt.sequence === authorityReceipt.sequence
      && replayedReceipt.chain_digest === authorityReceipt.chain_digest
      && replayedReceipt.return_digest === authorityReceipt.return_digest,
      'idempotent response replay produced a different ledger receipt');
    expect(readFileSync(ambiguityPath, 'utf8').match(/\| AMB-1503 \| 1 \| 1 \| carry-unresolved \|/gu)?.length === 1,
      'idempotent response replay duplicated T5.3');
    pass('response/T5.3 application replay is exact-once and idempotent');

    expectThrows(
      () => recordHumanAuthorityDecision(runDir, {
        gateId: request.request_id,
        authorityIdentity: 'human:fixture-operator',
        decision: 'approve',
        recordedAt: response.recorded_at,
        simulation: { kind: 'fixture-simulated' },
        response: response as unknown as JsonValue,
      }),
      /not awaiting the named human authority gate/u,
      'reused procedural response',
    );
    pass('one retained response cannot be reused as a second human action');

    writer.advanceSlice5ClosurePhase('S4-C2-ambiguities-finalized');
    expect(readFileSync(join(runDir, 'run-log.md'), 'utf8')
      .includes('closure_phase: S4-C2-ambiguities-finalized'), 'C2 marker was not retained');
    pass('C2 advances only after prospective K2.16 and K2.17 validation');

    const ambiguityAtC2 = readFileSync(ambiguityPath);
    expectThrows(
      () => writer.append('ledgers/internal-ambiguities.md', validated, () => '<!-- forbidden -->'),
      /canonical ambiguity append is legal only during the S4-C2 write window/u,
      'post-C2 ambiguity append',
    );
    expect(readFileSync(ambiguityPath).equals(ambiguityAtC2),
      'post-C2 ambiguity append changed bytes');
    pass('post-C2 ambiguity write is refused before bytes change');

    writer.advanceSlice5ClosurePhase('S4-C3-exit');
    const finalState = readRunState(runDir);
    expect(finalState.execution.stage === 'S4' && finalState.execution.stage_status === 'closed',
      'C3 did not close the retained S4 stage');
    expect(readFileSync(join(runDir, 'run-log.md'), 'utf8')
      .includes('closure_phase: S4-C3-exit'), 'C3 marker was not retained');
    pass('C3 closes S4 only after the complete C2 durable state');

    console.log(`RESULT: PASS (${CASES.length}/${CASES.length} process cases)`);
  } finally {
    makeWritable(tempRoot);
    rmSync(tempRoot, { recursive: true, force: true });
    if (existsSync(bundleOutput)) {
      makeWritable(bundleOutput);
      rmSync(bundleOutput, { recursive: true, force: true });
    }
  }
}

main();

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
import { verifyAndLoadLoaBundle } from '../src/core-loader.ts';
import {
  sha256Digest,
  walkRegularFiles,
} from '../src/fs.ts';
import { LedgerWriter } from '../src/ledger-writer.ts';
import {
  readRunState,
  writeRunState,
} from '../src/run-control.ts';
import {
  LOA_ROLE_IDS,
  LOA_RUN_STATE_FORMAT,
  type Clock,
  type ExactModelIdentity,
  type JsonValue,
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
  allowlist: string[],
) {
  const allowed = new Set(allowlist);
  const coreRef = coreBlindPolicyReference(bundle, 'merge-judge', 'S4');
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
    withheld: withheldInventory(bundle, runDir, []),
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
    const ambiguityBefore = readFileSync(ambiguityPath);
    writer.append(
      'ledgers/internal-ambiguities.md',
      validated,
      () => '<!-- fixture legal C2 ambiguity write -->',
    );
    expect(!readFileSync(ambiguityPath).equals(ambiguityBefore),
      'legal C2 ambiguity append left bytes unchanged');
    pass('ambiguity append succeeds only after C1 in the C2 window');

    writeFileSync(ambiguityPath, fullAmbiguities);
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

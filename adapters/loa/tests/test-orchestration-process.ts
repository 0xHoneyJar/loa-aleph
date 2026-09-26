#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { assembleBundles } from '../../../scripts/assemble-bundles.ts';
import { predecessorSource } from '../../../scripts/compatibility-fixture-source.ts';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import { sourceWalkReviewBasisDigest } from '../../../scripts/lib/checks-k2.ts';
import { installLoaBundle } from '../src/installer.ts';
import { semanticJson, parseSemanticLedger, type SemanticSubject, type SemanticEntry } from '../../../scripts/lib/semantic-review.ts';
import { fixtureSemantics, fixtureResult, TEXT_USE } from '../../../scripts/semantic-fixture-support.ts';
import { makeTreeOwnerWritable, stableJsonBytes } from '../src/fs.ts';
import { materialHash, materialFragmentsHash, prepareRepresentationCapture, readRepresentationContext } from '../../../scripts/lib/source-representation.ts';
import { buildComparisonBasis, duplicateProducerPaths, parseDuplicateLedger, duplicateLedgerMarkdown,
  emptyDuplicateLedger, validateDuplicateRun, type DuplicateSubject } from '../../../scripts/lib/duplicate-review.ts';
import { duplicateFixtureProposal, duplicateFixtureSuccessorProposal, duplicateFixtureResult } from '../../../scripts/duplicate-fixture-support.ts';
import { relationReviewSubjectDigest, parseRelations } from '../../../scripts/lib/relations.ts';
import { semanticRelationRow } from '../../../scripts/lib/semantic-review.ts';
import { lineageCurrentPacketIds } from '../../../scripts/lib/lineage.ts';
import { searchBasisDigest, ambiguityReviewSubjectDigest, materialImpactSubjectDigest, parseInternalAmbiguities,
  buildProceduralAuthorityResponse, exactTextBlob, type ProceduralAction, type AmbiguityReviewSubject } from '../../../scripts/lib/internal-ambiguity.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
if (process.argv[2] === '--fixture-worker') {
  const [workerBundleRoot, returnRoot, rawPath] = process.argv.slice(3);
  const pinned = join(dirname(dirname(workerBundleRoot)), 'runtime/bundle/runtime-js/adapters/loa/src/worker-dispatch.js');
  const { dispatchPreparedLoaWorker } = await import(pathToFileURL(pinned).href) as typeof import('../src/worker-dispatch.ts');
  dispatchPreparedLoaWorker({ workerBundleRoot, returnRoot, host: { invokeFreshContext(invocation) {
    assert.equal(invocation.inherit_context, false);
    assert.deepEqual(invocation.writable_paths, []);
    return { receipt: { format: 'aleph-loa-worker-dispatch/v1', call_id: invocation.request.call_id,
      context_id: `CTX-${invocation.request.call_id}`, producer_context_id: invocation.producer_context_id,
      fresh_context: true, inherited_context: false, filesystem: 'bundle-read-only',
      model_identity: invocation.model_identity, simulation: { kind: 'fixture-simulated' } },
    structured_return: JSON.parse(readFileSync(rawPath, 'utf8')) };
  } } });
} else if (process.argv[2] === '--request-byte-regression') {
  const original = resolve(process.argv[3]);
  assert.equal(JSON.parse(readFileSync(join(original, 'control/run-state.json'), 'utf8')).full_mode, 'fixture-simulated');
  const scratch = mkdtempSync(join(tmpdir(), 'aleph-request-byte-regression-')), run = join(scratch, 'run');
  cpSync(original, run, { recursive: true });
  const works = readdirSync(join(run, 'control/orchestration/work'))
    .map((name) => JSON.parse(readFileSync(join(run, 'control/orchestration/work', name), 'utf8')));
  const work = works.find((entry) => entry.identity.work.obligation.operation === 's2.capture');
  assert(work?.call);
  const workerRoot = join(run, 'control/worker-bundles', work.call.call_id), path = join(workerRoot, 'request.json');
  const exact = readFileSync(path), request = JSON.parse(exact.toString()), before = readFileSync(join(original, 'control/worker-bundles', work.call.call_id, 'request.json'));
  const { verifyWorkerBundle } = await import(process.argv.includes('--runtime')
    ? '../../../runtime-js/adapters/loa/src/worker-bundle.js' : '../src/worker-bundle.ts') as typeof import('../src/worker-bundle.ts');
  assert.deepEqual(verifyWorkerBundle(workerRoot), request);
  const attacks = [
    ['trailing newline', Buffer.concat([exact, Buffer.from('\n')])],
    ['leading whitespace', Buffer.concat([Buffer.from(' '), exact])],
    ['key order', Buffer.from(JSON.stringify(Object.fromEntries(Object.entries(request).reverse())) + '\n')],
    ['JSON indentation', Buffer.from(JSON.stringify(request, null, 4) + '\n')],
    ['equivalent unicode escape', Buffer.from(exact.toString().replace('"format"', '"for\\u006dat"'))],
    ['duplicate unchanged field', Buffer.from(exact.toString().replace('{', `{\"format\":${JSON.stringify(request.format)},`))],
  ] as const;
  for (const [name, altered] of attacks) {
    assert.deepEqual(JSON.parse(altered.toString()), request, 'attack changes serialization only');
    chmodSync(path, 0o600); writeFileSync(path, altered); chmodSync(path, 0o400);
    assert.throws(() => verifyWorkerBundle(workerRoot), /WORK_REQUEST_BYTES_CHANGED/u);
    console.log(`PASS exact worker request refusal: ${name}`);
  }
  chmodSync(path, 0o600); writeFileSync(path, exact); chmodSync(path, 0o400);
  assert.deepEqual(verifyWorkerBundle(workerRoot), request);
  assert(readFileSync(join(original, 'control/worker-bundles', work.call.call_id, 'request.json')).equals(before));
  console.log(JSON.stringify({ result: 'PASS', controls: 2, adversarial: attacks.length, scratch,
    scope: 'Isolated copy of retained fixture evidence; direct bundle verifier regression, not installed resume or predecessor qualification.' }));
} else {
  const scratch = mkdtempSync(join(tmpdir(), 'aleph-orchestration-process-'));
  const keep = process.env.F03_KEEP_TEST === '1';
  try {
    const source = predecessorSource(ROOT, scratch, '1.9.0-provisional');
    const assembly = assembleBundles(source, join(scratch, 'bundles'));
    assert.equal(assembly.result, 'PASS', assembly.errors.join('; '));
    const host = join(scratch, 'host'), bundle = join(scratch, 'bundles/aleph-for-loa');
    const installation = installLoaBundle(bundle, host);
    assert.equal(installation.result, 'PASS', installation.errors.join('; '));
    const capabilities = join(host, 'grimoires/loa/aleph/host-capabilities.json');
    mkdirSync(dirname(capabilities), { recursive: true });
    cpSync(join(ROOT, 'adapters/loa/tests/fixtures/host-capabilities.json'), capabilities);
    const input = join(host, 'input.md');
    const wideningMode = process.env.F03_WIDEN === '1';
    const inputText = 'The synthetic counter increased.\n' + (wideningMode ? 'Under the retained synthetic condition.\n' : '');
    writeFileSync(input, inputText);
    let selectedInput = input;
    if (process.env.F03_L2F === '1') {
      const bytes = Buffer.from('The synthetic counter increased.');
      const captured = readFileSync(input);
      const descriptor = { format: 'aleph-supplied-representation/v1', source_path: 'input.md',
        origin_kind: 'supplied-extraction', extraction_surface: 'utf8-text', state: 'available', reason: 'none', assets: [],
        provenance: [{ provenance_id: 'RPR-0001', type: 'supplied-structure', actor: 'synthetic-fixture',
          tool: 'fixture-declaration', tool_version: '1', input_refs: ['source'], output_refs: ['declaration'],
          parameters_asset_id: 'none', declaration_asset_id: 'declaration' }],
        bindings: [{ binding_id: 'BND-0001', carrier_id: 'source', start_byte: '0', end_byte: String(bytes.length),
          page_id: 'none', region_id: 'none', byte_role: 'frozen-source-bytes', fragment_hash: materialHash(bytes),
          exact_bytes_base64: bytes.toString('base64') },
        { binding_id: 'BND-0002', carrier_id: 'source', start_byte: '0', end_byte: String(captured.length),
          page_id: 'none', region_id: 'none', byte_role: 'frozen-source-bytes', fragment_hash: materialHash(captured),
          exact_bytes_base64: captured.toString('base64') }],
        objects: ['source', 'text', 'formal'].map((kind, index) => ({ object_id: `OBJ-000${index + 1}`, kind,
          parent_id: index ? 'OBJ-0001' : 'none', state: 'available', reason: 'none',
          provenance_id: index ? 'RPR-0001' : 'capture', binding_ids: [index ? 'BND-0001' : 'BND-0002'],
          content_hash: materialFragmentsHash([index ? bytes : captured]),
          coordinates: kind === 'formal' ? { notation: 'source-markup', structure_ids: [], structure_state: 'available' } : {} })),
        associations: [{ association_id: 'ASC-0001', kind: 'caption-for', subject_id: 'OBJ-0003',
          target_ids: [], state: 'unsupported', reason: 'Synthetic fixture supplies no caption.', provenance_id: 'RPR-0001' }] };
      const declaration = Buffer.from(JSON.stringify(descriptor));
      prepareRepresentationCapture([{ source_id: 'SRC-001', bytes: readFileSync(input), descriptor: declaration }]);
      selectedInput = join(host, 'input.aleph-representation.json'); writeFileSync(selectedInput, declaration);
    }
    let run = '';
    let c09Exercised = false;
    function command(module: string, args: string[], expected = 0): any {
      const entrypoint = module === 'cli' ? join(host, '.claude/aleph/bin/loa-aleph.mjs')
        : join(run, `control/runtime/bundle/runtime-js/adapters/loa/src/${module}.js`);
      const c09Probe = process.env.F03_C09_FAULTS === '1' && !c09Exercised && module === 'cli' && args.includes('resume');
      let processResult = spawnSync(process.execPath, [entrypoint, ...args],
        { encoding: 'utf8', cwd: host, env: c09Probe
          ? { ...process.env, ALEPH_FIXTURE_WORK_FAULT: 'stage.seal-S3:derived' } : process.env });
      if (c09Probe && processResult.status === 86) {
        c09Exercised = true;
        const beforeState = readFileSync(join(run, 'control/run-state.json'));
        const beforeLog = readFileSync(join(run, 'run-log.md'));
        assert.equal(JSON.parse(beforeState.toString()).execution.stage, 'S3');
        assert(!existsSync(join(run, 'ledgers/duplicate-review.md')));
        assert(!existsSync(join(run, 'verification/harness/semantic-stage-seals/S3.json')));
        assert(!beforeLog.toString().includes('— S4 — entry'));
        console.log('PASS C09 installed pre-journal crash retains exact legal S3 BEFORE');
        const points = ['commit-intent', 'writer-prepared',
          'effect:verification/harness/semantic-stage-seals/S3.json', 'effect:run-log.md',
          'effect:ledgers/duplicate-review.md', 'canonical-bytes', 'chain', 'checkpoint', 'journal-committed', 'consumed'];
        for (const point of points) {
          const crash = spawnSync(process.execPath, [entrypoint, ...args], { encoding: 'utf8', cwd: host,
            env: { ...process.env, ALEPH_FIXTURE_WORK_FAULT: `stage.seal-S3:${point}` } });
          assert.equal(crash.status, 86, `${point}: ${crash.stdout}\n${crash.stderr}`);
          const works = readdirSync(join(run, 'control/orchestration/work'))
            .map((p) => JSON.parse(readFileSync(join(run, 'control/orchestration/work', p), 'utf8')));
          const seals = works.filter((w) => w.identity.work.obligation.operation === 'stage.seal-S3');
          assert.equal(seals.length, 1);
          const work = seals[0], consumed = join(run, `control/orchestration/commits/${work.work_id}-consumed.json`);
          assert.equal(existsSync(consumed), point === 'consumed');
          if (point === 'consumed') {
            assert(readFileSync(join(run, 'ledgers/duplicate-review.md')).equals(Buffer.from(duplicateLedgerMarkdown(emptyDuplicateLedger()))));
            validateDuplicateRun(loadRun(run));
          }
          if (point === 'commit-intent' || point === 'writer-prepared') {
            assert(readFileSync(join(run, 'control/run-state.json')).equals(beforeState));
            assert(readFileSync(join(run, 'run-log.md')).equals(beforeLog));
            assert(!existsSync(join(run, 'ledgers/duplicate-review.md')));
          }
          if (point === 'writer-prepared') {
            // Fresh corrected fixture only; seed for exhaustive authenticated
            // partial-subset/tamper controls in separate disposable copies.
            const seed = join(scratch, 'c09-prepared-run');
            cpSync(run, seed, { recursive: true });
            writeFileSync(join(scratch, 'c09-recovery-seed.json'), JSON.stringify({ run: seed, host, work_id: work.work_id }));
          }
          console.log(`PASS C09 installed restart recovery ${point}; consumption last`);
        }
        processResult = spawnSync(process.execPath, [entrypoint, ...args], { encoding: 'utf8', cwd: host });
        assert.equal(processResult.status, expected, `${processResult.stdout}\n${processResult.stderr}`);
        const work = JSON.parse(processResult.stdout).details.work;
        assert.equal(JSON.parse(processResult.stdout).stage, 'S4');
        assert.equal(work.action, 'prepare');
        validateDuplicateRun(loadRun(run));
        const afterState = readFileSync(join(run, 'control/run-state.json')), afterChain = readFileSync(join(run, 'control/ledger-chain.jsonl'));
        const repeat = spawnSync(process.execPath, [entrypoint, ...args], { encoding: 'utf8', cwd: host });
        assert.equal(repeat.status, expected, repeat.stderr);
        assert.deepEqual(JSON.parse(repeat.stdout).details.work, work);
        assert(readFileSync(join(run, 'control/run-state.json')).equals(afterState));
        assert(readFileSync(join(run, 'control/ledger-chain.jsonl')).equals(afterChain));
        assert.equal(readFileSync(join(run, 'run-log.md'), 'utf8').split('— S4 — entry').length - 1, 1);
        const works = readdirSync(join(run, 'control/orchestration/work'))
          .map((p) => JSON.parse(readFileSync(join(run, 'control/orchestration/work', p), 'utf8')));
        assert(!works.some((w) => w.identity.work.obligation.operation === 's4.initialize'));
        console.log('PASS C09 installed final S4 AFTER is verified, initialized and idempotent before ordinary work');
      }
      assert.equal(processResult.status, expected, `${processResult.stdout}\n${processResult.stderr}`);
      return JSON.parse(processResult.stdout);
    }
    const cli = (...args: string[]) => command('cli', ['--root', host, '--json', '--allow-fixture-simulation', ...args]);
    function crashSequence(operation: string, points: string[], verify: () => void, firstArgs: string[] = ['resume', id]): void {
      for (const [index, point] of points.entries()) {
        const crashed = spawnSync(process.execPath, [join(host, '.claude/aleph/bin/loa-aleph.mjs'),
          '--root', host, '--json', '--allow-fixture-simulation', ...index === 0 ? firstArgs : ['resume', id]],
        { encoding: 'utf8', cwd: host, env: { ...process.env, ALEPH_FIXTURE_WORK_FAULT: `${operation}:${point}` } });
        assert.equal(crashed.status, 86, `${operation}/${point}: ${crashed.stdout}\n${crashed.stderr}`);
        verify();
        console.log(`PASS supported CLI fixture crash/recovery ${operation}/${point}`);
      }
    }
    const started = cli('start', selectedInput);
    assert.equal(started.result, 'BLOCKED');
    const id = started.run_id; run = join(host, 'grimoires/loa/aleph/runs', id);
    const snapshot = JSON.parse(readFileSync(join(run, 'control/corpus.snapshot.json'), 'utf8'));
    const response = join(scratch, 'authority.json');
    writeFileSync(response, JSON.stringify({ format: 'aleph-loa-authority-response/v1', gate_id: 'S0', run_id: id,
      authority: { kind: 'human', identity: 'fixture-simulated-authority' }, decision: 'approve-freeze',
      declared_scope: 'Synthetic structural test input only.', exclusions: [],
      sensitivity_rulings: snapshot.files.map((file: { source_id: string }) => ({ source_id: file.source_id, labels: ['none'], decision: 'admit-exact-bytes' })),
      freeze: true, recorded_at: new Date().toISOString(), simulation: { kind: 'fixture-simulated' } }));
    assert.equal(cli('--authority-response', response, id).result, 'PASS');
    let resumed = cli('resume', id);
    assert.equal(resumed.details.work.kind, 'proposal');
    const proposal = join(scratch, 'samples.json');
    writeFileSync(proposal, JSON.stringify({ format: 'aleph-criteria-sample-proposal/v1',
      samples: [{ source_id: snapshot.files[0].source_id, locator: 'L1-L1' }] }));
    resumed = cli('--work-samples', proposal, id);
    const initialWork = resumed.details.work;
    assert.equal(initialWork.action, 'prepare');
    assert.deepEqual(cli('resume', id).details.work, initialWork, 'resume before dispatch must retain the same identity');
    function runFixture(work: any, raw: unknown): void {
      command('worker-dispatch', ['prepare', '--worker-bundle', work.worker_bundle, '--return-root', work.return_root, '--capabilities', work.host_capabilities, '--json']);
      const rawPath = join(scratch, `${work.call_id}.json`);
      writeFileSync(rawPath, semanticJson(raw));
      const dispatched = spawnSync(process.execPath, [join(source, 'adapters/loa/tests/test-orchestration-process.ts'),
        '--fixture-worker', work.worker_bundle, work.return_root, rawPath],
        { encoding: 'utf8', cwd: host });
      assert.equal(dispatched.status, 0, dispatched.stderr);
      command('worker-dispatch', ['accept', '--worker-bundle', work.worker_bundle, '--return-root', work.return_root, '--json']);
    }
    const sourceRow = loadRun(run).corpus.sources[0].values;
    runFixture(initialWork, { sources: [{ source_id: sourceRow.sourceId, kind: 'design-note', locus: sourceRow.locus,
      scheme: sourceRow.scheme, content_hash: sourceRow.contentHash, dates: '2026-09-17', trust_class: 'model-generated',
      sensitivity: ['none'], admission_note: 'Synthetic structural fixture only.', flags: [] }],
    criteria: { candidate_definition: 'Explicit observations.', admission: [{ n: 1, criterion: 'Explicit observations.', example: 'The counter increased.' }],
      exclusion_classes: [{ class: 'scaffolding', description: 'Headings without assertions.', example: 'Introduction' }],
      granularity_policy: 'One assertion per candidate.', normalization_conventions: 'Preserve scope and qualifiers.' } });
    assert(!existsSync(join(run, 'ledgers/extraction-criteria.md')), 'accept must not write canonical criteria');
    resumed = cli('resume', id);
    assert(existsSync(join(run, 'ledgers/extraction-criteria.md')), 'fresh resume must commit accepted intake');
    const firstReview = resumed.details.work;
    const criteriaResult = { verdict: 'upheld', rationale: 'Synthetic criterion and scope attacks failed.',
      attacks_tried: ['Attempted exclusion and alternative candidacy.'], sample_adequacy: 'adequate',
      judgments: [{ sample_id: 'SAMPLE-1', candidacy: 'candidate', criterion_refs: ['admission:1'] }],
      missing_for_determination: null, flags: [] };
    runFixture(firstReview, criteriaResult);
    resumed = cli('resume', id);
    assert.notEqual(firstReview.call_id, resumed.details.work.call_id);
    runFixture(resumed.details.work, criteriaResult);
    resumed = cli('resume', id);
    assert.equal(resumed.stage, 'S2');
    assert(readFileSync(join(run, 'run-manifest.md'), 'utf8').includes('| DISTILLING |'));
    assert.equal(readdirSync(join(run, 'control/orchestration/accepted')).length, 3);
    console.log('PASS supported CLI S0/S1 fixture transport, restart after accept, canonical writer and criteria agreement');
    const s2Before = loadRun(run);
    assert.equal(s2Before.sourceWalk.completions.length, 1);
    const priorRow = s2Before.sourceWalk.completions[0].raw;
    assert.equal(s2Before.sourceWalk.completions[0].values.completionState, 'blocked');
    const extractor = resumed.details.work;
    assert.equal(extractor.action, 'prepare');
    const sharedPause = process.env.F03_SHARED_PAUSE === '1';
    const packetMode = process.env.F03_PACKET === '1' || sharedPause;
    // C-07 is a stopped-policy discriminator, not an implemented continuation.
    // Preserve the original invalid end-cursor fixture as separate evidence.
    const stationaryMode = process.env.F03_C07_STATIONARY === '1';
    const stationaryAccounting = process.env.F03_C07_ACCOUNTING === '1';
    const degradedMode = process.env.F03_S2_DEGRADED === '1' || stationaryMode || stationaryAccounting;
    assert(!degradedMode || !packetMode && !wideningMode, 'degraded fixture has no affirmative packet');
    const fragment = Buffer.from('The synthetic counter increased.' + (wideningMode ? '\n' : ''));
    const extraction: any = {
      source_id: sourceRow.sourceId, producer_invocation_id: extractor.call_id,
      walk_intervals: [{ start_byte: 0, end_byte: Buffer.byteLength(inputText),
        outcome: packetMode ? 'admitted' : 'excluded', packet_candidate_indexes: packetMode ? [0] : [],
        criterion_ref: packetMode ? 'admission:1' : 'exclusion:scaffolding', closure_state: 'closed',
        reason: packetMode ? null : 'Synthetic declared exclusion; no semantic correctness claim.', closure_note: null }],
      packets: packetMode ? [{ evidence_state: 'exact', join_policy: 'single-fragment',
        fragments: [{ fragment_order: 1, locator: 'L1-L1', exact_bytes_base64: fragment.toString('base64') }],
        rendered_text: fragment.toString(), degraded_source_locator: null, degradation_reason: null,
        criterion: 1, flags: [], material_use: TEXT_USE }] : [],
      extraction_events: packetMode ? [{ start_byte: 0, end_byte: fragment.length, shared_position_key: 'SP-0001',
        event_ordinal: 1, packet_candidate_index: 0, origin: 'primary' }] : [],
      next_cursor: { byte_offset: Buffer.byteLength(inputText), shared_position_key: null,
        // The exact md-lines fragment excludes the trailing newline. The
        // terminal cursor follows the full walk, not an event ending earlier.
        next_event_ordinal: null, predecessor_walk_index: 0, predecessor_event_index: null,
        source_hash: sourceRow.contentHash, reason: 'source-complete' },
      walk_exhausted: true, notes: [], material_findings: [], semantic_units: packetMode ? [{
        output_kind: 'packet-candidate', output_index: 0, review_mode: 'proposal', origin_unit_refs: [],
        anchors: [{ anchor_id: 'A1', source_id: sourceRow.sourceId, locator: 'L1-L1', start_byte: 0,
          end_byte: fragment.length, exact_bytes_base64: fragment.toString('base64') }], semantics: fixtureSemantics(fragment.toString()),
      }] : [],
    };
    if (process.env.F03_S2_GAP === '1' && !packetMode) {
      // A missed candidate may reconcile a no-candidate primary interval.
      // An excluded interval instead retains its explicit exclusion, which
      // the ordinary K2.14 reconciliation predicate correctly refuses.
      extraction.walk_intervals[0] = { ...extraction.walk_intervals[0],
        outcome: 'no-candidate-observed', criterion_ref: 'none', reason: null };
    }
    if (degradedMode) {
      const use = { requirements: [{ object_id: 'OBJ-0002', feature: 'formal-structure', binding_ids: ['BND-0001'] }],
        use_state: 'CANNOT_DETERMINE', fidelity_claim: 'none', limitation_refs: ['OBJ-0002'],
        reason: 'Synthetic required grouping is unavailable.' };
      extraction.walk_intervals[0] = { ...extraction.walk_intervals[0], outcome: 'unsupported',
        criterion_ref: 'none', closure_state: 'open', reason: use.reason };
      extraction.packets = [{ evidence_state: 'degraded-non-exact', join_policy: 'not-applicable', fragments: [],
        rendered_text: 'Synthetic unresolvable material.', degraded_source_locator: 'L1-L1',
        degradation_reason: use.reason, criterion: 1, flags: [], material_use: use }];
      extraction.semantic_units = [{ output_kind: 'packet-candidate', output_index: 0, review_mode: 'proposal',
        origin_unit_refs: [], anchors: [], semantics: { atomicity: 'CANNOT_DETERMINE', units: [], contexts: [],
          couplings: [], relation_proposals: [], unresolved_findings: [{ finding_id: 'F1',
            field_path: '/semantics/atomicity', code: 'material-unavailable', anchor_ids: [],
            material_requirement_indexes: [0], unknown_dimension: 'none', missing: use.reason, requested_context: [] }] } }];
    }
    if (sharedPause) {
      extraction.packets = [0, 1, 2].map(() => structuredClone(extraction.packets[0]));
      extraction.walk_intervals[0].packet_candidate_indexes = [0, 1, 2];
      extraction.extraction_events = [0, 1, 2].map((index) => ({
        ...extraction.extraction_events[0], packet_candidate_index: index, event_ordinal: index + 1,
      }));
      extraction.semantic_units = [0, 1, 2].map((index) => ({
        ...structuredClone(extraction.semantic_units[0]), output_index: index,
      }));
      extraction.next_cursor = { byte_offset: 0, shared_position_key: 'SP-0001',
        next_event_ordinal: 2, predecessor_walk_index: 0, predecessor_event_index: 0,
        source_hash: sourceRow.contentHash, reason: 'bounded-pause' };
      extraction.walk_exhausted = false;
    }
    if (stationaryMode || stationaryAccounting) {
      extraction.next_cursor = { byte_offset: 0, shared_position_key: null, next_event_ordinal: null,
        predecessor_walk_index: null, predecessor_event_index: null,
        source_hash: sourceRow.contentHash, reason: 'bounded-pause' };
      extraction.walk_exhausted = false;
    }
    runFixture(extractor, extraction);
    const producerRawPath = join(run, 'control/worker-returns', extractor.call_id, 'raw.json');
    const producerRaw = readFileSync(producerRawPath);
    assert.equal(loadRun(run).sourceWalk.completions[0].raw, priorRow, 'accept leaves the old canonical projection intact');
    if (stationaryAccounting) {
      const walk = readFileSync(join(run, 'ledgers/source-walk.md'));
      const preserved = () => {
        assert(readFileSync(join(run, 'ledgers/source-walk.md')).equals(walk));
        assert.equal(loadRun(run).packets.length, 0); assert.equal(loadRun(run).claims.length, 0);
        assert.equal(loadRun(run).sourceWalk.completions[0].raw, priorRow);
        assert(readFileSync(producerRawPath).equals(producerRaw));
      };
      if (process.env.F03_C07_TAMPER === '1') {
        const canonical = new Map([...loadRun(run).files.map((entry) => entry.relativePath),
          'control/run-state.json', 'control/ledger-chain.jsonl']
          .map((path) => [path, materialHash(readFileSync(join(run, path)))]));
        const acceptancePath = `control/orchestration/accepted/${extractor.call_id}.json`;
        const acceptance = JSON.parse(readFileSync(join(run, acceptancePath), 'utf8'));
        const attacks: Array<{ name: string; path: string; replace?: (bytes: Buffer) => Buffer }> = [
          ...['raw.json', 'validation.json', 'validated.json', 'native-dispatch.json', 'native-return.json', 'invocation.json']
            .map((name) => ({ name, path: `control/worker-returns/${extractor.call_id}/${name}` })),
          { name: 'worker-bundle', path: `control/worker-bundles/${extractor.call_id}/request.json` },
          ...['intent', 'complete'].map((kind) => ({ name: `dispatch-${kind}`,
            path: `control/orchestration/dispatch/${extractor.call_id}-${kind}.json` })),
          ...acceptance.native.filter((entry: { path: string }) => /stream|event|completion/u.test(entry.path))
            .map((entry: { path: string }, index: number) => ({ name: `native-stream-${index}`, path: entry.path })),
          ...['run_id', 'stage', 'subject', 'checkpoint', 'chain', 'generation'].map((field) => ({
            name: `work-${field}`, path: `control/orchestration/work/${extractor.work_id}.json`,
            replace: (bytes: Buffer) => {
              const { digest: _digest, ...body } = JSON.parse(bytes.toString());
              if (field === 'run_id') body.identity.run_id += '-other';
              if (field === 'stage') body.identity.work.obligation.stage = 'S3';
              if (field === 'subject') body.identity.work.obligation.subject_id += '-other';
              if (field === 'checkpoint') body.identity.checkpoint = `sha256:${'0'.repeat(64)}`;
              if (field === 'chain') body.identity.ledger.chain_head = `sha256:${'0'.repeat(64)}`;
              if (field === 'generation') body.identity.work.capture_generation = '999';
              return stableJsonBytes({ ...body, digest: materialHash(stableJsonBytes(body)) });
            },
          })),
          { name: 'accepted-return-for-another-work', path: acceptancePath,
            replace: () => readFileSync(join(run, `control/orchestration/accepted/${initialWork.call_id}.json`)) },
        ];
        for (const attack of attacks) {
          const path = join(run, attack.path), exact = readFileSync(path), mode = statSync(path).mode & 0o777;
          try {
            chmodSync(path, 0o600);
            writeFileSync(path, attack.replace ? attack.replace(exact) : Buffer.concat([exact, Buffer.from('\n')]));
            chmodSync(path, mode);
            const refused = command('cli', ['--root', host, '--json', '--allow-fixture-simulation', 'resume', id], 1);
            assert.equal(refused.result, 'FAIL');
            for (const [path, digest] of canonical) assert.equal(materialHash(readFileSync(join(run, path))), digest);
            writeFileSync(join(scratch, `C07-${attack.name}-refusal.json`), JSON.stringify(refused, null, 2));
          } finally { chmodSync(path, 0o600); writeFileSync(path, exact); chmodSync(path, mode); }
          console.log(`PASS C07 installed retained-evidence tamper ${attack.name}; canonical BEFORE preserved`);
        }
      }
      if (process.env.F03_C07_FAULTS === '1') crashSequence('s2.capture', [
        'derived', 'commit-intent', 'writer-prepared', 'effect:verification/harness/semantic-subjects/SEM-0001.json',
        'canonical-bytes', 'chain', 'checkpoint', 'journal-committed', 'consumed',
      ], preserved);
      resumed = cli('resume', id); preserved();
      let lastCapture = extractor;
      for (let generation = 0; generation < 2; generation++) {
        const review = resumed.details.work;
        const request = JSON.parse(readFileSync(join(review.worker_bundle, 'request.json'), 'utf8'));
        assert.equal(request.role, 'verifier-l2s', 'stationary L2S precedes another extractor');
        const path = request.allowlist.find((entry: { run_path: string }) =>
          entry.run_path.startsWith('verification/harness/semantic-subjects/')).run_path;
        const subject = JSON.parse(readFileSync(join(run, path), 'utf8')) as SemanticSubject;
        assert.equal(subject.subject_kind, 'degraded-packet');
        runFixture(review, fixtureResult(subject));
        if (process.env.F03_C07_FAULTS === '1' && generation === 0) {
          crashSequence('sem.resolve', ['derived', 'commit-intent', 'writer-prepared', 'canonical-bytes',
            'chain', 'checkpoint', 'journal-committed', 'consumed'], preserved);
          crashSequence('s2.prepare-extractor', ['derived', 'commit-intent', 'writer-prepared',
            'canonical-bytes', 'chain', 'checkpoint', 'journal-committed', 'consumed'], preserved);
        }
        resumed = cli('resume', id); preserved();
        const next = resumed.details.work;
        assert.equal(JSON.parse(readFileSync(join(next.worker_bundle, 'request.json'), 'utf8')).role, 'extractor');
        assert.notEqual(next.call_id, lastCapture.call_id);
        const retry = structuredClone(extraction);
        retry.producer_invocation_id = next.call_id;
        retry.packets[0].degradation_reason = 'Synthetic second mechanically distinct grouping limitation.';
        retry.packets[0].material_use.reason = retry.packets[0].degradation_reason;
        retry.semantic_units[0].semantics.unresolved_findings[0].missing = retry.packets[0].degradation_reason;
        runFixture(next, retry);
        if (process.env.F03_C07_FAULTS === '1' && generation === 1) crashSequence('s2.capture',
          ['derived', 'commit-intent', 'writer-prepared', 'canonical-bytes', 'chain', 'checkpoint',
            'journal-committed', 'consumed'], preserved);
        if (process.env.F03_C07_FAULTS === '1' && generation === 1) crashSequence('s2.stationary-halt',
          ['derived', 'commit-intent', 'writer-prepared', 'canonical-bytes', 'chain', 'checkpoint',
            'journal-committed', 'consumed'], preserved);
        resumed = cli('resume', id); preserved(); lastCapture = next;
      }
      assert.equal(resumed.details.work.code, 'WORK_STATIONARY_FRONTIER');
      const records = readdirSync(join(run, 'verification/harness/stationary-captures'))
        .map((name) => JSON.parse(readFileSync(join(run, 'verification/harness/stationary-captures', name), 'utf8')))
        .sort((a, b) => Number(a.basis.generation) - Number(b.basis.generation));
      assert.deepEqual(records.map((entry) => entry.basis.generation), ['0', '1', '2']);
      assert.deepEqual(records.map((entry) => entry.selectors[0].disposition),
        ['new-accounting', 'new-accounting', 'duplicate-accounting']);
      assert.equal(parseSemanticLedger(readFileSync(join(run, 'ledgers/semantic-review.md'), 'utf8')).subjects.length, 2);
      assert.equal(records[2].selectors[0].semantic_id, records[1].selectors[0].semantic_id);
      const chain = readFileSync(join(run, 'control/ledger-chain.jsonl'));
      const workFiles = readdirSync(join(run, 'control/orchestration/work'));
      for (let attempt = 0; attempt < 2; attempt++) {
        const same = cli('resume', id); preserved();
        assert.deepEqual(same.details.work, resumed.details.work);
        assert(readFileSync(join(run, 'control/ledger-chain.jsonl')).equals(chain));
        assert.deepEqual(readdirSync(join(run, 'control/orchestration/work')), workFiles);
      }
      console.log('PASS C07 installed fresh-process stationary accounting, two reviewed generations, duplicate disposition and stable non-dispatch halt');
      console.log('EVIDENCE: fixture-simulated transport only; no provider invocation or semantic acceptance; F-03/F-04/F-05 OPEN.');
    } else if (stationaryMode) {
      const preserved = ['run-manifest.md', 'ledgers/source-walk.md', 'ledgers/packet-index.md',
        'ledgers/semantic-review.md', 'ledgers/representation-uses.md',
        'control/ledger-chain.jsonl', 'control/run-state.json'];
      const before = new Map(preserved.map((path) => [path, existsSync(join(run, path))
        ? readFileSync(join(run, path)) : null]));
      for (let attempt = 1; attempt <= 2; attempt++) {
        const refused = command('cli', ['--root', host, '--json', '--allow-fixture-simulation', 'resume', id], 1);
        assert.equal(refused.result, 'FAIL');
        assert.deepEqual(refused.errors, ['WORK_CURSOR: frozen source and actual forward progress required']);
        for (const [path, bytes] of before) {
          assert.equal(existsSync(join(run, path)), bytes !== null, path);
          if (bytes) assert(readFileSync(join(run, path)).equals(bytes), path);
        }
        assert(readFileSync(producerRawPath).equals(producerRaw));
        assert.equal(loadRun(run).sourceWalk.completions[0].raw, priorRow);
        assert.equal(loadRun(run).packets.length, 0);
        assert.equal(loadRun(run).claims.length, 0);
        writeFileSync(join(scratch, `C07-stationary-resume-${attempt}.json`), JSON.stringify(refused, null, 2));
        console.log(`PASS C07 installed discriminator resume ${attempt}: accepted stationary degraded return refuses WORK_CURSOR; canonical BEFORE preserved`);
      }
      console.log('C07 STOPPED: C-01 degraded subject remains unreachable without an adopted stationary capture/frontier/continuation rule.');
      console.log('EVIDENCE: fixture-simulated only; no C-07 policy implemented; F-03/F-04/F-05 OPEN / MUST PRESERVE.');
    } else if (sharedPause) {
      let beforeChain: Buffer | null = null, pendingRow = '';
      for (const point of ['derived', 'commit-intent', 'writer-prepared', 'effect:ledgers/source-walk.md',
        'canonical-bytes', 'chain', 'checkpoint', 'journal-committed', 'consumed']) {
        const crashed = spawnSync(process.execPath, [join(host, '.claude/aleph/bin/loa-aleph.mjs'),
          '--root', host, '--json', '--allow-fixture-simulation', 'resume', id],
        { encoding: 'utf8', cwd: host, env: { ...process.env, ALEPH_FIXTURE_WORK_FAULT: `s2.commit-event:${point}` } });
        assert.equal(crashed.status, 86, `${point}: ${crashed.stdout}\n${crashed.stderr}`);
        const model = loadRun(run), events = model.sourceWalk.events;
        assert.equal(events.length, 3);
        if (point === 'derived') {
          pendingRow = events[1].raw;
          beforeChain = readFileSync(join(run, 'control/ledger-chain.jsonl'));
        }
        const before = ['derived', 'commit-intent', 'writer-prepared'].includes(point);
        assert.equal(events[1].raw, before ? pendingRow : pendingRow.replace(/\bpending(?=\s*\|\s*$)/u, 'committed'));
        assert.equal(events[0].values.status, 'committed');
        assert.equal(events[2].values.status, 'pending', 'the next sibling cannot be skipped');
        assert.equal(model.sourceWalk.cursors.at(-1)!.values.byteOffset, '0');
        assert.equal(model.sourceWalk.cursors.at(-1)!.values.nextEventOrdinal, before ? '2' : '3');
        if (['derived', 'commit-intent', 'writer-prepared', 'effect:ledgers/source-walk.md', 'canonical-bytes'].includes(point)) {
          assert(readFileSync(join(run, 'control/ledger-chain.jsonl')).equals(beforeChain!));
        }
        if (point === 'writer-prepared') {
          const path = join(run, 'ledgers/source-walk.md'), exact = readFileSync(path);
          writeFileSync(path, exact.toString().replace(pendingRow, pendingRow.replace('| 2 |', '| 9 |')));
          const rejected = command('cli', ['--root', host, '--json', '--allow-fixture-simulation', 'resume', id], 1);
          assert.equal(rejected.result, 'FAIL');
          assert.deepEqual(rejected.errors, ['WORK_PREREQUISITE_CHANGED: ledgers/source-walk.md']);
          assert(readFileSync(join(run, 'control/ledger-chain.jsonl')).equals(beforeChain!));
          // Controlled attack fixture only: preserve the refusal receipt,
          // then restore the exact snapshot to continue the fault sequence.
          writeFileSync(join(scratch, 'C03-third-state-refusal.json'), JSON.stringify(rejected, null, 2));
          writeFileSync(path, exact);
        }
        console.log(`PASS C03 fixture CLI crash/restart at ${point}; exact event BEFORE/AFTER and sibling retained`);
      }
      resumed = cli('resume', id);
      const committed = loadRun(run);
      assert.equal(committed.sourceWalk.events.length, 3);
      assert(committed.sourceWalk.events.every((entry) => entry.values.status === 'committed'));
      assert.equal(committed.sourceWalk.cursors.at(-1)!.values.reason, 'source-complete');
      const journals = readdirSync(join(run, 'control/transactions'))
        .map((name) => JSON.parse(readFileSync(join(run, 'control/transactions', name), 'utf8')))
        .filter((entry) => entry.plan?.family === 's2-event-commitment');
      assert.equal(journals.length, 2, 'one effect for each original pending sibling');
      for (const journal of journals) {
        assert.equal(journal.status, 'committed');
        assert.equal(journal.plan.source_completion.event_commitments.length, 1);
        const event = journal.plan.source_completion.event_commitments[0];
        const work = JSON.parse(readFileSync(join(run, 'control/orchestration/work', `${journal.work_id}.json`), 'utf8'));
        const basis = JSON.parse(readFileSync(join(run, 'control/orchestration/basis', work.basis_digest.slice(7), 'manifest.json'), 'utf8'));
        const before = basis.members.find((entry: any) => entry.path === 'ledgers/source-walk.md');
        assert.equal(before.digest, journal.plan.source_completion.before_digest);
        assert(readFileSync(join(run, 'control/orchestration/blobs', before.digest.slice(7)), 'utf8').split('\n').includes(event.before_row));
        assert.equal(event.after_row, event.before_row.replace(/\bpending(?=\s*\|\s*$)/u, 'committed'));
        assert.equal(work.identity.dependencies[0].call_id, extractor.call_id);
      }
      const chain = readFileSync(join(run, 'control/ledger-chain.jsonl'));
      cli('resume', id);
      assert(readFileSync(join(run, 'control/ledger-chain.jsonl')).equals(chain));
      assert(readFileSync(producerRawPath).equals(producerRaw));
      console.log('PASS C03 supported CLI same-identity event commitment, third-state refusal, sibling continuation, journal before-images and exactly-once canonical effects');
      console.log('EVIDENCE: fixture-simulated only; original producer bytes unchanged; F-03 OPEN / MUST PRESERVE.');
    } else {
    if (process.env.F03_FAULT_MATRIX === '1') {
      const beforeChain = readFileSync(join(run, 'control/ledger-chain.jsonl'));
      for (const point of ['derived', 'commit-intent', 'writer-prepared', 'effect:ledgers/source-walk.md',
        'canonical-bytes', 'chain', 'checkpoint', 'journal-committed', 'consumed']) {
        const crashed = spawnSync(process.execPath, [join(host, '.claude/aleph/bin/loa-aleph.mjs'),
          '--root', host, '--json', '--allow-fixture-simulation', 'resume', id],
        { encoding: 'utf8', cwd: host, env: { ...process.env, ALEPH_FIXTURE_WORK_FAULT: `s2.capture:${point}` } });
        assert.equal(crashed.status, 86, `${point}: ${crashed.stdout}\n${crashed.stderr}`);
        const current = loadRun(run);
        assert.equal(current.sourceWalk.completions.length, 1, `${point}: one projection row`);
        if (['derived', 'commit-intent', 'writer-prepared'].includes(point)) {
          assert.equal(current.sourceWalk.completions[0].raw, priorRow, `${point}: BEFORE retained`);
        } else {
          assert.notEqual(current.sourceWalk.completions[0].raw, priorRow, `${point}: exact AFTER reached`);
        }
        if (['derived', 'commit-intent', 'writer-prepared', 'effect:ledgers/source-walk.md', 'canonical-bytes'].includes(point)) {
          assert(readFileSync(join(run, 'control/ledger-chain.jsonl')).equals(beforeChain), `${point}: chain still BEFORE`);
        }
        console.log(`PASS abrupt fixture CLI exit/restart at s2.capture:${point}`);
      }
    }
    resumed = cli('resume', id);
    const s2After = loadRun(run);
    assert.equal(s2After.sourceWalk.completions.length, 1);
    assert.equal(s2After.sourceWalk.completions[0].values.completionState, 'blocked', 'fresh L1 is still required');
    assert.notEqual(s2After.sourceWalk.completions[0].raw, priorRow);
    assert.equal(s2After.packets.length, packetMode ? 1 : 0, 'capture preserves exact declared candidate cardinality');
    for (const transform of s2After.exactEvidence.transformations) {
      assert.match(transform.values.transformKey, /^XFORM-[0-9]+$/u);
      assert.equal(transform.values.outputTextHash, materialHash(transform.values.outputText));
    }
    const journal = readdirSync(join(run, 'control/transactions')).map((name) => JSON.parse(readFileSync(join(run, 'control/transactions', name), 'utf8')))
      .find((entry) => entry.plan?.family === 's2-capture');
    assert.equal(journal.plan.source_completion.completions[0].before_row, priorRow);
    assert.equal(journal.plan.source_completion.completions[0].after_row, s2After.sourceWalk.completions[0].raw);
    assert.equal(journal.status, 'committed');
    const work = JSON.parse(readFileSync(join(run, 'control/orchestration/work', `${journal.work_id}.json`), 'utf8'));
    const basis = JSON.parse(readFileSync(join(run, 'control/orchestration/basis', work.basis_digest.slice(7), 'manifest.json'), 'utf8'));
    const beforeWalk = basis.members.find((entry: { path: string }) => entry.path === 'ledgers/source-walk.md');
    const retainedBefore = readFileSync(join(run, 'control/orchestration/blobs', beforeWalk.digest.slice(7)), 'utf8');
    assert(retainedBefore.split('\n').includes(priorRow), 'exact old row reopens from the work-bound before-file blob');
    assert.equal(beforeWalk.digest, journal.plan.source_completion.before_digest);
    const afterChain = readFileSync(join(run, 'control/ledger-chain.jsonl'));
    cli('resume', id);
    assert(readFileSync(join(run, 'control/ledger-chain.jsonl')).equals(afterChain), 'repeated resume adds no duplicate semantic effect');
    if (packetMode || degradedMode) {
      const review = resumed.details.work;
      const request = JSON.parse(readFileSync(join(review.worker_bundle, 'request.json'), 'utf8'));
      assert.equal(request.role, 'verifier-l2s');
      const path = request.allowlist.find((entry: { run_path: string }) => entry.run_path.startsWith('verification/harness/semantic-subjects/')).run_path;
      const subject = JSON.parse(readFileSync(join(run, path), 'utf8')) as SemanticSubject;
      if (degradedMode) {
        assert.equal(subject.subject_kind, 'degraded-packet');
        assert.equal(subject.output_binding.kind, 'degraded-packet');
      }
      runFixture(review, fixtureResult(subject));
      resumed = cli('resume', id);
      assert(readFileSync(join(run, 'ledgers/semantic-review.md'), 'utf8').includes(degradedMode ? '| not-admitted |' : '| admitted |'));
      console.log(degradedMode ? 'PASS supported CLI degraded packet retains its original selector and receives fresh L2S without admission'
        : 'PASS supported CLI exact packet capture, retained producer reauthentication, fresh fixture L2S and Core admission');
    }
    if (degradedMode) {
      const gap = resumed.details.work;
      assert.equal(JSON.parse(readFileSync(join(gap.worker_bundle, 'request.json'), 'utf8')).role, 'verifier-l1');
      runFixture(gap, { verdict: 'upheld', rationale: 'Synthetic challenge found no additional candidate; the unsupported interval remains open.',
        attacks_tried: ['Reopened the complete frozen source.'], evidence_ids: [], candidate_evidence: [],
        missing_for_determination: null, flags: [] });
      resumed = cli('resume', id);
      assert.equal(resumed.result, 'BLOCKED'); assert.equal(resumed.stage, 'S2');
      assert.equal(resumed.details.work.code, 'S2_SOURCE_COMPLETION_UNMET');
      const current = loadRun(run);
      assert.equal(current.packets.length, 0); assert.equal(current.claims.length, 0);
      assert.equal(readRepresentationContext(current).uses.length, 0);
      assert.equal(current.sourceWalk.intervals[0].values.closureState, 'open');
      assert.equal(current.sourceWalk.completions[0].values.completionState, 'blocked');
      assert(!existsSync(join(run, 'verification/harness/semantic-stage-seals/S2.json')));
      assert(readFileSync(producerRawPath).equals(producerRaw));
      console.log('PASS supported CLI degraded accounting preserves the open interval and halts S2 without canonical PKT, CC, USE or seal');
    }
    if (process.env.F03_S2_CLOSE === '1' && !degradedMode) {
      resumed = cli('resume', id);
      const gap = resumed.details.work;
      const request = JSON.parse(readFileSync(join(gap.worker_bundle, 'request.json'), 'utf8'));
      assert.equal(request.role, 'verifier-l1');
      const noGap = { verdict: 'upheld', rationale: 'Synthetic coverage challenge found no additional candidate.',
        attacks_tried: ['Rechecked each frozen source position against the fixture criteria.'],
        evidence_ids: [], candidate_evidence: [], missing_for_determination: null, flags: [] };
      if (process.env.F03_S2_GAP === '1') {
        const beforeGap = loadRun(run), primary = beforeGap.sourceWalk.intervals.map((row) => row.raw),
          cursors = beforeGap.sourceWalk.cursors.map((row) => row.raw);
        runFixture(gap, { ...noGap, verdict: 'refuted', rationale: 'Synthetic challenge identifies one missed exact candidate.',
          candidate_evidence: [{ start_byte: 0, end_byte: fragment.length, source_locator: 'L1-L1',
            exact_bytes_base64: fragment.toString('base64') }] });
        const l1RawPath = join(gap.return_root, 'raw.json'), l1Raw = readFileSync(l1RawPath);
        resumed = cli('resume', id);
        const producer = resumed.details.work;
        assert.equal(JSON.parse(readFileSync(join(producer.worker_bundle, 'request.json'), 'utf8')).role, 'extractor');
        const gapTargets = readdirSync(join(run, 'verification/harness/gap-producer-subjects'))
          .map((name) => JSON.parse(readFileSync(join(run, 'verification/harness/gap-producer-subjects', name), 'utf8')));
        assert.equal(gapTargets.length, 1);
        assert.deepEqual(Object.keys(gapTargets[0].candidates[0]), ['start_byte', 'end_byte', 'source_locator', 'exact_bytes_base64']);
        assert.deepEqual(gapTargets[0].candidates, JSON.parse(l1Raw.toString()).candidate_evidence);
        assert(readFileSync(l1RawPath).equals(l1Raw), 'gap projection preserves exact accepted L1 bytes');
        const gapExtraction = { source_id: sourceRow.sourceId, producer_invocation_id: producer.call_id,
          walk_intervals: [], packets: [{ evidence_state: 'exact', join_policy: 'single-fragment',
            fragments: [{ fragment_order: 1, locator: 'L1-L1', exact_bytes_base64: fragment.toString('base64') }],
            rendered_text: fragment.toString(), degraded_source_locator: null, degradation_reason: null,
            criterion: 1, flags: [], material_use: TEXT_USE }], extraction_events: [],
          next_cursor: { ...extraction.next_cursor, predecessor_walk_index: null, predecessor_event_index: null },
          walk_exhausted: true, notes: [], material_findings: [], semantic_units: [{ output_kind: 'packet-candidate',
            output_index: 0, review_mode: 'proposal', origin_unit_refs: [], anchors: [{ anchor_id: 'A1',
              source_id: sourceRow.sourceId, locator: 'L1-L1', start_byte: 0, end_byte: fragment.length,
              exact_bytes_base64: fragment.toString('base64') }], semantics: fixtureSemantics(fragment.toString()) }] };
        assert.deepEqual(Object.keys(gapExtraction), Object.keys(extraction), 'gap producer retains the ordinary extractor contract field order');
        runFixture(producer, gapExtraction);
        if (process.env.F03_S2_GAP_FAULTS === '1') crashSequence('s2.reconcile-gap',
          ['derived', 'commit-intent', 'writer-prepared', 'effect:ledgers/packet-index.md',
            'effect:ledgers/source-walk.md', 'canonical-bytes', 'chain', 'checkpoint', 'journal-committed', 'consumed'], () => {
            const current = loadRun(run);
            assert.deepEqual(current.sourceWalk.intervals.map((row) => row.raw), primary);
            assert.deepEqual(current.sourceWalk.cursors.map((row) => row.raw), cursors);
            assert([beforeGap.packets.length, beforeGap.packets.length + 1].includes(current.packets.length));
          });
        resumed = cli('resume', id);
        const review = resumed.details.work;
        const reviewed = JSON.parse(readFileSync(join(review.worker_bundle, 'request.json'), 'utf8'));
        assert.equal(reviewed.role, 'verifier-l2s');
        const subject = JSON.parse(readFileSync(join(run, reviewed.allowlist.find((entry: any) =>
          entry.run_path.startsWith('verification/harness/semantic-subjects/')).run_path), 'utf8')) as SemanticSubject;
        runFixture(review, fixtureResult(subject));
        const afterGap = loadRun(run);
        assert.deepEqual(afterGap.sourceWalk.intervals.map((row) => row.raw), primary);
        assert.deepEqual(afterGap.sourceWalk.cursors.map((row) => row.raw), cursors);
        assert.equal(afterGap.packets.length, beforeGap.packets.length + 1);
        assert.equal(afterGap.sourceWalk.events.filter((row) => row.values.origin === 'gap-reconciliation').length, 1);
        assert(afterGap.sourceWalk.gapReviews.some((row) => row.values.status === 'reconciled'));
        const cursor = beforeGap.sourceWalk.cursors.at(-1)!.values.cursorId;
        assert.equal(sourceWalkReviewBasisDigest(afterGap, sourceRow.sourceId, cursor),
          sourceWalkReviewBasisDigest(beforeGap, sourceRow.sourceId, cursor),
          'Core L1 basis excludes reconciliation additions; an extra L1 is not an adopted completion prerequisite');
        assert(readFileSync(producerRawPath).equals(producerRaw));
        console.log('PASS supported CLI L1 gap discovery, exact reconciliation and accepted fresh L2S; original review basis and primary history preserved');
      } else runFixture(gap, noGap);
      if (process.env.F03_S2_BOUNDARY_FAULTS === '1') {
        for (const operation of ['stage.seal-S2', 'stage.enter-S3']) {
          const effectPath = operation === 'stage.seal-S2' ? 'verification/harness/semantic-stage-seals/S2.json' : 'ledgers/claim-inventory.md';
          for (const point of ['derived', 'commit-intent', 'writer-prepared', `effect:${effectPath}`,
            'canonical-bytes', 'chain', 'checkpoint', 'journal-committed', 'consumed']) {
            const crashed = spawnSync(process.execPath, [join(host, '.claude/aleph/bin/loa-aleph.mjs'),
              '--root', host, '--json', '--allow-fixture-simulation', 'resume', id],
            { encoding: 'utf8', cwd: host, env: { ...process.env, ALEPH_FIXTURE_WORK_FAULT: `${operation}:${point}` } });
            assert.equal(crashed.status, 86, `${operation}/${point}: ${crashed.stdout}\n${crashed.stderr}`);
            if (operation === 'stage.seal-S2') {
              assert(!existsSync(join(run, 'ledgers/claim-inventory.md')), 'S2 may not initialize an S3 artifact');
              assert(!readFileSync(join(run, 'run-log.md'), 'utf8').includes('— S3 — entry'));
            }
            if (operation === 'stage.enter-S3' && ['derived', 'commit-intent', 'writer-prepared'].includes(point)) {
              assert(!existsSync(join(run, 'ledgers/claim-inventory.md')));
            }
            console.log(`PASS S2/S3 fixture crash/recovery ${operation}/${point}; exact transition boundary retained`);
          }
        }
      }
      resumed = cli('resume', id);
      assert.equal(resumed.stage, 'S3');
      assert.equal(loadRun(run).sourceWalk.completions[0].values.completionState, 'complete');
      assert(existsSync(join(run, 'verification/harness/semantic-stage-seals/S2.json')));
      if (process.env.F03_S2_GAP === '1') {
        const requests = readdirSync(join(run, 'control/worker-bundles')).map((call) =>
          JSON.parse(readFileSync(join(run, 'control/worker-bundles', call, 'request.json'), 'utf8')));
        assert.equal(requests.filter((request) => request.role === 'verifier-l1').length, 1);
        assert.equal(loadRun(run).sourceWalk.gapReviews[0].values.status, 'reconciled');
        console.log('PASS reconciled gap and fresh L2S close S2 without duplicating L1 or changing its primary review basis');
      }
      console.log('PASS supported CLI fresh fixture L1, complete source projection, S2 seal and S3 entry');
      const journals = readdirSync(join(run, 'control/transactions')).map((name) => JSON.parse(readFileSync(join(run, 'control/transactions', name), 'utf8')));
      const seal = journals.find((entry) => entry.plan?.obligation?.operation === 'stage.seal-S2');
      const entry = journals.find((entry) => entry.plan?.obligation?.operation === 'stage.enter-S3');
      assert(seal && entry);
      assert.deepEqual(seal.plan.effects.map((effect: any) => effect.path), ['verification/harness/semantic-stage-seals/S2.json', 'run-log.md']);
      assert.deepEqual(entry.plan.effects.map((effect: any) => effect.path), ['ledgers/claim-inventory.md', 'run-log.md']);
      assert.equal(seal.plan.next_execution.stage, 'S2'); assert.equal(seal.plan.next_execution.stage_status, 'closed');
      assert.equal(entry.plan.next_execution.stage, 'S3');
      if (process.env.F03_NORMALIZE) {
        const mode = process.env.F03_NORMALIZE;
        const normalizer = resumed.details.work;
        assert.equal(JSON.parse(readFileSync(join(normalizer.worker_bundle, 'request.json'), 'utf8')).role, 'normalizer');
        const model = loadRun(run), packet = model.packets[0].values.packetId;
        const ledger = parseSemanticLedger(readFileSync(join(run, 'ledgers/semantic-review.md'), 'utf8'));
        const origin = JSON.parse(readFileSync(join(run, ledger.subjects.find((row) => row.owner_stage === 'S2')!.subject_path), 'utf8')) as SemanticSubject;
        const anchors = origin.anchors.map(({ anchor_id, source_id, locator, start_byte, end_byte, exact_bytes_base64 }) =>
          ({ anchor_id, source_id, locator, start_byte, end_byte, exact_bytes_base64 }));
        const originRefs = origin.semantics.units.map((unit) => `${origin.semantic_id}/${unit.unit_id}`);
        const claims: any[] = [], noClaims: any[] = [], entries: SemanticEntry[] = [];
        if (mode === 'usable' || mode === 'mixed') {
          const use = structuredClone(TEXT_USE);
          if (process.env.F03_L2F === '1') use.requirements.push({ object_id: 'OBJ-0003', feature: 'formal-structure', binding_ids: ['BND-0001'] });
          claims.push({ normalized_claim: fragment.toString().trim(), packets: [packet], claim_type: 'factual',
            widen_requests: wideningMode ? [{ packet, new_locator: 'L1-L2' }] : [],
            rationale: 'Synthetic unchanged source proposition.', flags: [], material_use: use });
          entries.push({ output_kind: 'claim-candidate', output_index: 0, review_mode: 'proposal',
            origin_unit_refs: originRefs, anchors, semantics: fixtureSemantics(fragment.toString()) });
          if (process.env.F03_S4) {
            claims.push(structuredClone(claims[0]));
            entries.push({ ...structuredClone(entries[0]), output_index: 1 });
          }
        }
        if (mode.startsWith('indeterminate') || mode === 'mixed') {
          for (let variant = 0; variant < (mode === 'indeterminate-matrix' ? 6 : 1); variant++) {
          const use: any = { requirements: [{ object_id: 'OBJ-0002', feature: 'formal-structure', binding_ids: ['BND-0001'] },
            ...(mode === 'indeterminate-matrix' ? variant % 2 === 1 : mode !== 'indeterminate-one')
              ? [{ object_id: 'OBJ-0001', feature: 'table-grid', binding_ids: ['BND-0001'] }] : []],
          use_state: 'CANNOT_DETERMINE', fidelity_claim: 'none', limitation_refs: ['OBJ-0002'], reason: 'Synthetic required structure is unavailable.' };
          const index = claims.length;
          claims.push({ normalized_claim: 'Tentative unadmitted interpretation.', packets: [packet], claim_type: 'factual',
            widen_requests: [], rationale: use.reason, flags: [], material_use: use });
          entries.push({ output_kind: 'claim-candidate', output_index: index, review_mode: 'proposal', origin_unit_refs: originRefs, anchors,
            semantics: { atomicity: 'CANNOT_DETERMINE', units: [], contexts: [], couplings: [], relation_proposals: [],
              unresolved_findings: [{ finding_id: 'F1', field_path: '/semantics/atomicity', code: 'material-unavailable',
                anchor_ids: ['A1'], material_requirement_indexes: use.requirements.map((_: unknown, index: number) => index),
                unknown_dimension: 'none', missing: use.reason, requested_context: [] }] } });
          }
        }
        if (mode === 'no-claim') {
          noClaims.push({ packet, basis: 'Synthetic independently reviewed no-claim proposal.' });
          entries.push({ output_kind: 'no-claim-candidate', output_index: 0, review_mode: 'proposal', origin_unit_refs: originRefs,
            anchors, semantics: { atomicity: 'no-claim', units: [], contexts: [], couplings: [], relation_proposals: [], unresolved_findings: [] } });
        }
        const normalReturn = { claims, no_claim_packets: noClaims, lineage_proposals: [], material_findings: [], semantic_units: entries };
        const claimBefore = readFileSync(join(run, 'ledgers/claim-inventory.md'));
        runFixture(normalizer, normalReturn);
        const rawPath = join(normalizer.return_root, 'raw.json'), raw = readFileSync(rawPath);
        assert(readFileSync(join(run, 'ledgers/claim-inventory.md')).equals(claimBefore), 'acceptance cannot admit a CC');
        resumed = cli('resume', id);
        let reviews = 0;
        const nonaffirmative: SemanticSubject[] = [];
        let wideningInvocations = 0, revisionInvocations = 0;
        const historicalS2 = new Map(['verification/harness/semantic-stage-seals/S2.json', 'ledgers/source-walk.md']
          .map((path) => [path, readFileSync(join(run, path))]));
        while (resumed.stage === 'S3' && resumed.details.work?.action === 'prepare') {
          const work = resumed.details.work;
          const request = JSON.parse(readFileSync(join(work.worker_bundle, 'request.json'), 'utf8'));
          if (wideningMode && request.role === 'extractor') {
            assert.equal(wideningInvocations++, 0, 'one dedicated widening producer');
            assert.equal(request.stage, 'S3');
            const viewPath = request.allowlist[0].run_path;
            const view = JSON.parse(readFileSync(join(run, viewPath), 'utf8'));
            assert.equal(view.format, 'aleph-s3-packet-widening-view/v1');
            const widened = { format: 'aleph-s3-packet-widening-return/v1', source_id: sourceRow.sourceId,
              producer_invocation_id: work.call_id, packets: [{ ...extraction.packets[0],
                fragments: [{ fragment_order: 1, locator: 'L1-L2', exact_bytes_base64: view.basis.exact_bytes_base64 }],
                rendered_text: inputText }], material_findings: [],
              semantic_units: [structuredClone(extraction.semantic_units[0])] };
            if (process.env.F03_C06 === '1') {
              const relation = { format: 'aleph-relation-review-subject/v1', owner_stage: 'S3',
                family: 'source-context', type: 'qualifier-context', source_kind: 'PKT',
                source_id: view.basis.first_packet_id, target_kind: 'source-locus', target_id: 'none',
                target_source_id: sourceRow.sourceId, target_locator: 'L1-L1',
                target_span_hash: materialHash(fragment), record_state: 'asserted', null_reason: 'none',
                basis_packet_ids: [view.basis.first_packet_id], proposed_by: `invocation:${work.call_id}` };
              widened.semantic_units[0].semantics.relation_proposals.push({
                subject: relation, review_subject_digest: materialHash(semanticJson(relation)), material_use: TEXT_USE,
              });
            }
            const beforePackets = loadRun(run).packets.length;
            runFixture(work, widened);
            if (process.env.F03_C06_TAMPER === '1') {
              const before = new Map([...loadRun(run).files.map((file) => file.relativePath),
                'control/run-state.json', 'control/ledger-chain.jsonl']
                .map((path) => [path, materialHash(readFileSync(join(run, path)))]));
              const workPath = `control/orchestration/work/${work.work_id}.json`;
              const acceptancePath = `control/orchestration/accepted/${work.call_id}.json`;
              const acceptance = JSON.parse(readFileSync(join(run, acceptancePath), 'utf8'));
              const attacks: Array<{ name: string; path: string; replace?: (bytes: Buffer) => Buffer }> = [
                ...['raw.json', 'validation.json', 'validated.json', 'native-dispatch.json', 'native-return.json', 'invocation.json']
                  .map((name) => ({ name, path: `control/worker-returns/${work.call_id}/${name}` })),
                { name: 'worker-bundle', path: `control/worker-bundles/${work.call_id}/request.json` },
                ...['intent', 'complete'].map((kind) => ({ name: `dispatch-${kind}`,
                  path: `control/orchestration/dispatch/${work.call_id}-${kind}.json` })),
                ...acceptance.native.filter((entry: { path: string }) => /stream|event|completion/u.test(entry.path))
                  .map((entry: { path: string }, index: number) => ({ name: `native-stream-${index}`, path: entry.path })),
                ...['run_id', 'stage', 'subject', 'checkpoint', 'chain'].map((field) => ({
                  name: `work-${field}`, path: workPath, replace: (bytes: Buffer) => {
                    const value = JSON.parse(bytes.toString());
                    if (field === 'run_id') value.identity.run_id += '-other';
                    if (field === 'stage') value.identity.work.obligation.stage = 'S2';
                    if (field === 'subject') value.identity.work.obligation.subject_id += '-other';
                    if (field === 'checkpoint') value.identity.checkpoint = `sha256:${'0'.repeat(64)}`;
                    if (field === 'chain') value.identity.ledger.chain_head = `sha256:${'0'.repeat(64)}`;
                    return Buffer.from(JSON.stringify(value));
                  },
                })),
                { name: 'forged-widening-call-with-valid-record-digest', path: workPath, replace: (bytes) => {
                  const { digest: _digest, ...body } = JSON.parse(bytes.toString());
                  body.call.output_selector = 'Role: Extractor (S2)';
                  return stableJsonBytes({ ...body, digest: materialHash(stableJsonBytes(body)) });
                } },
                { name: 'accepted-return-for-another-work', path: acceptancePath, replace: () =>
                  readFileSync(join(run, `control/orchestration/accepted/${view.basis.normalizer_call_id}.json`)) },
              ];
              for (const attack of attacks) {
                const path = join(run, attack.path), exact = readFileSync(path), mode = statSync(path).mode & 0o777;
                try {
                  chmodSync(path, 0o600);
                  writeFileSync(path, attack.replace ? attack.replace(exact) : Buffer.concat([exact, Buffer.from('\n')]));
                  chmodSync(path, mode);
                  const rejected = command('cli', ['--root', host, '--json', '--allow-fixture-simulation', 'resume', id], 1);
                  assert.equal(rejected.result, 'FAIL');
                  for (const [path, digest] of before) assert.equal(materialHash(readFileSync(join(run, path))), digest);
                  writeFileSync(join(scratch, `C06-${attack.name}-refusal.json`), JSON.stringify(rejected, null, 2));
                } finally { chmodSync(path, 0o600); writeFileSync(path, exact); chmodSync(path, mode); }
                console.log(`PASS supported CLI C06 retained-evidence refusal ${attack.name}; no canonical effect`);
              }
            }
            if (process.env.F03_C05_FAULTS === '1' || process.env.F03_C06_FAULTS === '1') crashSequence('s3.capture-widening',
              ['derived', 'commit-intent', 'writer-prepared', 'effect:ledgers/packet-index.md',
                'effect:ledgers/lineage.md', 'canonical-bytes', 'chain', 'checkpoint', 'journal-committed', 'consumed'], () => {
                assert([beforePackets, beforePackets + 1].includes(loadRun(run).packets.length));
                assert.equal(loadRun(run).claims.length, 0);
                for (const [path, bytes] of historicalS2) assert(readFileSync(join(run, path)).equals(bytes));
                assert(readFileSync(rawPath).equals(raw));
              });
            if (process.env.F03_C06_FAULTS === '1') {
              const beforeSubjects = parseSemanticLedger(readFileSync(join(run, 'ledgers/semantic-review.md'), 'utf8')).subjects.length;
              crashSequence('sem.reserve-widening', ['derived', 'commit-intent', 'writer-prepared', 'canonical-bytes',
                'chain', 'checkpoint', 'journal-committed', 'consumed'], () => {
                const subjects = parseSemanticLedger(readFileSync(join(run, 'ledgers/semantic-review.md'), 'utf8')).subjects;
                assert([beforeSubjects, beforeSubjects + 1].includes(subjects.length));
                assert.equal(loadRun(run).packets.length, beforePackets + 1);
                assert.equal(loadRun(run).claims.length, 0);
                assert(!existsSync(join(run, 'ledgers/relations.md'))
                  || !readFileSync(join(run, 'ledgers/relations.md'), 'utf8').includes('| REL-'));
                for (const [path, bytes] of historicalS2) assert(readFileSync(join(run, path)).equals(bytes));
              });
            }
            resumed = cli('resume', id);
            assert.equal(loadRun(run).claims.length, 0);
            for (const [path, bytes] of historicalS2) assert(readFileSync(join(run, path)).equals(bytes));
            console.log('PASS supported CLI dedicated S3 widening capture; original S2 seal and source walk unchanged');
            continue;
          }
          if (wideningMode && request.role === 'normalizer') {
            assert.equal(revisionInvocations++, 0, 'one fresh claim revision');
            const retained = parseSemanticLedger(readFileSync(join(run, 'ledgers/semantic-review.md'), 'utf8'));
            const row = retained.subjects.find((row) => row.owner_stage === 'S3' && row.subject_kind === 'packet-group')!;
            const subject = JSON.parse(readFileSync(join(run, row.subject_path), 'utf8')) as SemanticSubject;
            assert(subject.output_binding.kind === 'packet-group');
            const revised = structuredClone(normalReturn);
            revised.claims[0].packets = subject.output_binding.packet_ids;
            revised.claims[0].widen_requests = [];
            revised.semantic_units[0].origin_unit_refs = subject.semantics.units.map((unit) => `${subject.semantic_id}/${unit.unit_id}`);
            runFixture(work, revised); resumed = cli('resume', id);
            assert(readFileSync(rawPath).equals(raw));
            console.log('PASS supported CLI fresh normalizer revision uses the newly reviewed packet identities');
            continue;
          }
          if (request.role === 'verifier-l2f') {
            assert.equal(process.env.F03_L2F, '1');
            assert.equal(loadRun(run).claims.length, 0, 'L2S cannot bypass required L2F');
            const verdict = process.env.F03_L2F_VERDICT || 'upheld';
            runFixture(work, { verdict, rationale: 'Synthetic material fidelity challenge.',
              attacks_tried: ['Tested omission of the declared formal structure.'], evidence_ids: [packet], candidate_evidence: [],
              missing_for_determination: verdict === 'cannot-determine' ? 'Synthetic missing material.' : null, flags: [] });
            resumed = cli('resume', id);
            console.log(`PASS supported CLI exact affirmative L2F ${verdict} before any canonical admission`);
            continue;
          }
          assert.equal(request.role, 'verifier-l2s');
          const path = request.allowlist.find((row: any) => row.run_path.startsWith('verification/harness/semantic-subjects/')).run_path;
          const subject = JSON.parse(readFileSync(join(run, path), 'utf8')) as SemanticSubject;
          const result = fixtureResult(subject);
          if (subject.subject_kind === 'indeterminate-claim') {
            if (!nonaffirmative.some((prior) => prior.semantic_id === subject.semantic_id)) nonaffirmative.push(subject);
            const index = subject.output_binding.kind === 'indeterminate-claim' ? subject.output_binding.output_index : 0;
            const verdict = mode === 'indeterminate-matrix' ? ['upheld', 'cannot-determine', 'refuted'][Math.floor(index / 2)]
              : process.env.F03_C04_VERDICT || 'upheld';
            if (verdict !== 'upheld') {
              assert(verdict === 'refuted' || verdict === 'cannot-determine');
              result.verdict = verdict; result.field_reviews[0].verdict = verdict; result.field_reviews[0].issue = 'missing-material';
              result.missing_for_determination = verdict === 'cannot-determine' ? 'Synthetic reviewer missing structure.' : null;
              if (verdict === 'cannot-determine') result.unresolved_findings = structuredClone(subject.semantics.unresolved_findings);
            }
          }
          const canonicalBeforeReview = new Map(['ledgers/claim-inventory.md', 'ledgers/representation-uses.md',
            'ledgers/lineage.md', 'ledgers/relations.md'].map((path) =>
            [path, existsSync(join(run, path)) ? readFileSync(join(run, path)) : null]));
          runFixture(work, result);
          if (process.env.F03_C04_FAULTS === '1' && subject.subject_kind === 'indeterminate-claim' && result.verdict !== 'cannot-determine')
            crashSequence('sem.resolve', ['derived', 'commit-intent', 'writer-prepared', 'effect:ledgers/semantic-review.md',
              'canonical-bytes', 'chain', 'checkpoint', 'journal-committed', 'consumed'], () => {
              for (const [path, bytes] of canonicalBeforeReview) {
                assert.equal(existsSync(join(run, path)), bytes !== null);
                if (bytes) assert(readFileSync(join(run, path)).equals(bytes));
              }
              assert(readFileSync(rawPath).equals(raw));
              for (const [path, bytes] of historicalS2) assert(readFileSync(join(run, path)).equals(bytes));
            });
          resumed = cli('resume', id); reviews++;
          assert(reviews <= entries.length + (wideningMode ? 3 : 1), 'no repeated fresh review until preferred verdict');
        }
        for (const subject of nonaffirmative) {
          assert.equal(subject.output_binding.kind, 'indeterminate-claim');
          if (subject.output_binding.kind !== 'indeterminate-claim') throw Error('fixture');
          const output = subject.output_binding;
          assert.equal(output.output_selector, `claim-candidate:${output.output_index}`);
          assert(!loadRun(run).claims.some((row) => row.values.claimId === output.reserved_claim_id));
          assert(!readFileSync(join(run, 'ledgers/representation-uses.md'), 'utf8').includes(`| CC | ${output.reserved_claim_id} |`));
          for (const path of ['ledgers/relations.md', 'ledgers/lineage.md']) {
            assert(!existsSync(join(run, path)) || !readFileSync(join(run, path), 'utf8').includes(output.reserved_claim_id));
          }
          assert.equal(subject.material_use!.use_state, 'CANNOT_DETERMINE'); assert.deepEqual(subject.semantics.units, []);
          const finalLedger = parseSemanticLedger(readFileSync(join(run, 'ledgers/semantic-review.md'), 'utf8'));
          const outcome = finalLedger.resolutions.find((row) => row.semantic_id === subject.semantic_id)!;
          assert.equal(outcome.outcome, 'not-admitted'); assert.equal(outcome.canonical_refs, '[]');
          assert.deepEqual(subject.material_use, claims[output.output_index].material_use);
        }
        if (mode === 'indeterminate-matrix') assert.equal(nonaffirmative.length, 6, 'one/multiple OBJ across all three L2S verdicts');
        assert(readFileSync(rawPath).equals(raw));
        if (wideningMode) {
          assert.equal(wideningInvocations, 1); assert.equal(revisionInvocations, 1);
          for (const [path, bytes] of historicalS2) assert(readFileSync(join(run, path)).equals(bytes));
        }
        assert.equal(loadRun(run).claims.length, (mode === 'usable' || mode === 'mixed')
          && (!process.env.F03_L2F_VERDICT || process.env.F03_L2F_VERDICT === 'upheld') ? process.env.F03_S4 ? 2 : 1 : 0);
        console.log(`PASS supported CLI S3 ${mode}/${process.env.F03_C04_VERDICT || 'upheld'}: ${reviews} fresh fixture reviews, original raw bytes and reservation/admission boundary`);
        if (process.env.F03_S4) {
          let steps = 0;
          while (resumed.stage === 'S4' && resumed.details.work?.action === 'prepare') {
            assert(steps++ < 24, 'bounded S4 fixture cycle');
            const work = resumed.details.work, request = JSON.parse(readFileSync(join(work.worker_bundle, 'request.json'), 'utf8'));
            const current = loadRun(run);
            let returned: unknown;
            if (request.role === 'merge-judge') {
              const path = duplicateProducerPaths(work.call_id).view;
              const shown = JSON.parse(readFileSync(join(run, path), 'utf8'));
              if (Array.isArray(shown)) {
                returned = { candidates: shown.length < 2 ? [] : [{ member_ids: shown.map((row: any) => row.claim_id),
                  basis_refs: ['/catalogue/0', '/catalogue/1'], signal: 'shared-packet' }], unresolved_findings: [],
                rationale: 'Synthetic global candidate discovery only.', flags: [] };
              } else {
                const members = shown.comparison_basis.members.map((row: any) => row.claim_id);
                const proposal = process.env.F03_S4 === 'successor'
                  ? duplicateFixtureSuccessorProposal(buildComparisonBasis(current, members))
                  : duplicateFixtureProposal(buildComparisonBasis(current, members), process.env.F03_S4 === 'overlap' ? 'overlap' : 'distinct');
                proposal.candidate_ref = shown.candidate_ref;
                returned = { proposal, rationale: 'Synthetic duplicate versus overlap proposal.', flags: [] };
              }
            } else if (request.role === 'verifier-l5') {
              returned = { verdict: 'upheld', rationale: 'Synthetic independent contradiction sweep.',
                attacks_tried: ['Compared incompatible conditions.'], evidence_ids: [], candidate_evidence: [],
                missing_for_determination: null, flags: [], flagged_pairs: [] };
            } else if (request.role === 'verifier-l3') {
              const path = request.allowlist.find((entry: any) => entry.run_path.includes('/duplicate-subjects/')).run_path;
              const subject = JSON.parse(readFileSync(join(run, path), 'utf8')) as DuplicateSubject;
              returned = duplicateFixtureResult(subject);
            } else if (request.role === 'normalizer') {
              const rows = parseDuplicateLedger(readFileSync(join(run, 'ledgers/duplicate-review.md'), 'utf8'));
              const subject = JSON.parse(readFileSync(join(run, rows.proposals.at(-1)!.subject_path), 'utf8')) as DuplicateSubject;
              const claim = subject.proposal.successor_request!, origins = subject.comparison_basis.semantic_projections;
              const entry: SemanticEntry = { output_kind: 'claim-candidate', output_index: 0, review_mode: 'proposal',
                origin_unit_refs: subject.proposal.member_semantic_refs.flatMap((m) => m.unit_refs),
                anchors: origins[0].anchors.map(({ anchor_id, source_id, locator, start_byte, end_byte, exact_bytes_base64 }) =>
                  ({ anchor_id, source_id, locator, start_byte, end_byte, exact_bytes_base64 })),
                semantics: structuredClone(origins[0].semantics) };
              entry.semantics.units[0].proposition = claim.proposed_claim;
              returned = { claims: [{ normalized_claim: claim.proposed_claim, packets: claim.packet_ids, claim_type: claim.claim_type,
                widen_requests: [], rationale: 'Synthetic fresh successor normalization.', flags: [], material_use: claim.material_use }],
              no_claim_packets: [], lineage_proposals: [], material_findings: [], semantic_units: [entry] };
            } else if (request.role === 'relation-producer') {
              const shown = JSON.parse(readFileSync(join(run, request.allowlist[0].run_path), 'utf8'));
              const source = shown.claims.at(-1);
              assert(source, 'nonempty S4 relation fixture requires its current claim');
              const subject = { format: 'aleph-relation-review-subject/v1', owner_stage: 'S4',
                family: 'source-context', type: 'qualifier-context', source_kind: 'CC', source_id: source.claim_id,
                target_kind: 'null', target_id: 'none', target_source_id: 'none', target_locator: 'none',
                target_span_hash: 'none', record_state: 'explicitly-absent', null_reason: 'bounded-review-found-none',
                basis_packet_ids: source.packets.split(',').map((id: string) => id.trim()), proposed_by: `invocation:${work.call_id}` };
              const { format: _format, ...fields } = subject;
              const projection = { subject, review_subject_digest: '', material_use: TEXT_USE };
              returned = { relation_proposals: [{ ...fields, review_subject_digest: relationReviewSubjectDigest(semanticRelationRow(projection).values),
                rationale: 'Synthetic bounded relation absence proposal.', flags: [], material_use: TEXT_USE }],
              not_applicable: [], material_findings: [] };
            } else if (request.role === 'verifier-l3r') {
              assert.equal(parseRelations(current).rows.length, 0, 'L3R precedes all canonical REL serialization');
              const shown = JSON.parse(readFileSync(join(run, request.allowlist[0].run_path), 'utf8'));
              assert(!JSON.stringify(shown).includes('Synthetic bounded relation absence proposal.'));
              returned = { verdict: 'upheld', rationale: 'Synthetic independent relation challenge.',
                attacks_tried: ['Challenged the declared bounded absence and exact current source.'],
                evidence_ids: [`relation-review-subject:${shown.review_subject_digest}`], candidate_evidence: [],
                missing_for_determination: null, flags: [] };
            } else if (request.role === 'verifier-l2s') {
              const path = request.allowlist.find((entry: any) => entry.run_path.includes('/semantic-subjects/')).run_path;
              returned = fixtureResult(JSON.parse(readFileSync(join(run, path), 'utf8')));
            } else {
              throw Error(`unfinished S4 fixture transport for ${request.role}`);
            }
            runFixture(work, returned);
            resumed = cli('resume', id);
            console.log(`PASS supported CLI S4 fixture ${request.role}; restart, reauthentication and exact work consumption`);
          }
          const rows = parseDuplicateLedger(readFileSync(join(run, 'ledgers/duplicate-review.md'), 'utf8'));
          assert(rows.effects.length > 0);
          assert.equal(loadRun(run).claims.length, process.env.F03_S4 === 'successor' ? 3 : 2);
          assert.equal(rows.effects[0].effect, process.env.F03_S4 === 'successor' ? 'canonicalized' : 'kept-separate');
          assert.equal(parseRelations(loadRun(run)).rows.length, 1);
          assert(readFileSync(join(run, 'run-log.md'), 'utf8').includes('closure_phase: S4-C1-relations-closed'));
          console.log('PASS supported CLI S4 duplicate, global relation producer, fresh L3R and composed C1; C2/C3 remain separately required');
          if (process.env.F03_C2) {
            const classC = process.env.F03_C2 === 'C', unresolved = classC || process.env.F03_C2 === 'B';
            assert.equal(resumed.details.work.operation, 'ambiguity.expressions');
            const model = loadRun(run), packet = model.packets.find((p) => lineageCurrentPacketIds(model).has(p.values.packetId))!.values;
            const semantic = model.files.filter((f) => f.relativePath.startsWith('verification/harness/semantic-subjects/'))
              .map((f) => JSON.parse(f.text) as SemanticSubject).find((s) => s.anchors.some((a) => a.source_id === packet.sourceId))!;
            const anchor = semantic.anchors.find((a) => a.source_id === packet.sourceId)!;
            const selectionPath = join(scratch, 'ambiguity-expressions.json');
            writeFileSync(selectionPath, semanticJson({ format: 'aleph-ambiguity-expression-selection/v1',
              expressions: [{ source_entity_kind: 'PKT', source_entity_id: packet.packetId, source_id: packet.sourceId,
                locator: anchor.locator, start_byte: anchor.start_byte, end_byte: anchor.end_byte, basis_packet_ids: [packet.packetId] }] }));
            const sealed = new Map(['ledgers/relations.md', 'ledgers/representation-uses.md', 'ledgers/semantic-review.md', 'ledgers/duplicate-review.md']
              .map((path) => [path, readFileSync(join(run, path))]));
            const preserved = () => { for (const [path, bytes] of sealed) assert(readFileSync(join(run, path)).equals(bytes)); };
            resumed = cli('--work-ambiguity-expressions', selectionPath, id);
            let calls = 0;
            while (resumed.stage === 'S4' && resumed.details.work?.action === 'prepare') {
              assert(calls++ < 4, 'bounded C2 fixture roles');
              const work = resumed.details.work, request = JSON.parse(readFileSync(join(work.worker_bundle, 'request.json'), 'utf8'));
              const view = JSON.parse(readFileSync(join(run, request.allowlist[0].run_path), 'utf8'));
              let returned: unknown, operation: string;
              if (request.role === 'ambiguity-producer') {
                const e = view.expression, completion = view.source_walk.completion[0];
                const subject: AmbiguityReviewSubject = { source_entity_kind: e.source_entity_kind, source_entity_id: e.source_entity_id,
                  source_id: e.source_id, expression_locator: e.locator, expression_start_byte: e.start_byte, expression_end_byte: e.end_byte,
                  expression_sha256: e.expression_sha256, expression_bytes_base64: e.expression_bytes_base64, basis_packet_ids: e.basis_packet_ids,
                  search_scope_kind: 'full-same-source', search_completion_ref: `${e.source_id}@${completion.finalCursorId}@${completion.sourceHash}`,
                  search_basis_digest: '', candidate_state: unresolved ? 'null-cannot-determine' : 'single',
                  candidate_refs: unresolved ? [] : [{ kind: 'PKT', id: e.source_entity_id }], affected_relation_ids: [],
                  resolution_state: unresolved ? 'unresolved' : 'resolved-local', carry_state: 'none', proposed_by: `invocation:${work.call_id}` };
                subject.search_basis_digest = searchBasisDigest({ source_id: e.source_id, source_hash: view.source.contentHash,
                  source_length_bytes: Buffer.from(view.frozen_source_base64, 'base64').length, scope_kind: subject.search_scope_kind,
                  scope_refs: [], completion_ref: subject.search_completion_ref, expression_start_byte: e.start_byte, expression_end_byte: e.end_byte,
                  expression_sha256: e.expression_sha256, basis_packet_ids: e.basis_packet_ids, candidate_state: subject.candidate_state,
                  candidate_refs: subject.candidate_refs });
                returned = { definition: { source_entity_kind: e.source_entity_kind, source_entity_id: e.source_entity_id, source_id: e.source_id,
                  expression_locator: e.locator, expression_start_byte: e.start_byte, expression_end_byte: e.end_byte, expression_sha256: e.expression_sha256,
                  expression_bytes_base64: e.expression_bytes_base64, basis_packet_ids: e.basis_packet_ids, detected_by: subject.proposed_by },
                assessment: { search_scope_kind: subject.search_scope_kind, search_source_id: e.source_id, search_completion_ref: subject.search_completion_ref,
                  search_basis_digest: subject.search_basis_digest, candidate_state: subject.candidate_state, candidate_refs: subject.candidate_refs,
                  affected_relation_ids: [], resolution_state: subject.resolution_state, carry_state: subject.carry_state, proposed_by: subject.proposed_by,
                  review_subject_digest: ambiguityReviewSubjectDigest(subject) }, flags: [] };
                operation = 'capture';
              } else if (request.role === 'material-impact-producer') {
                returned = { materiality_class: classC ? 'C' : 'B', operative_scope: classC ? {
                  affected_ids: [packet.packetId], impact_rows: [{ affected_id: packet.packetId, operation_kind: 'load-bearing-reasoning',
                    requirement_ref: 'core:docs/precis-wedge.md#Completeness contract (canonical: option A)',
                    unresolved_treatment: 'carry-or-restriction', consequence_if_unresolved: 'Synthetic exact evidence use remains contingent.' }],
                } : { affected_ids: [], impact_rows: [] }, source_locators: classC ? [`${packet.sourceId}:${packet.locator}`] : [], reviewed_unaffected_ids: [],
                  unresolved_statement: 'Synthetic declared unresolved material impact only.', proposed_by: `invocation:${work.call_id}`, flags: [] };
                operation = 'material-capture';
              } else {
                assert(['ambiguity-reviewer', 'material-impact-reviewer'].includes(request.role));
                const material = request.role === 'material-impact-reviewer';
                const digest = material ? materialImpactSubjectDigest(view.subject) : ambiguityReviewSubjectDigest(view.subject);
                returned = { target: `${material ? 'internal-ambiguity-material-impact' : 'internal-ambiguity'}-review-subject:${digest}`,
                  verdict: 'upheld', shown: request.allowlist[0].run_path, withheld: 'Human actions and producer rationale.',
                  consequence: 'Synthetic fresh review declaration only.', flags: [] };
                operation = material ? 'material-review' : 'review';
              }
              runFixture(work, returned);
              if (process.env.F03_C2_FAULTS === '1') crashSequence(`s4.ambiguity.${operation}`,
                ['derived', 'commit-intent', 'writer-prepared', 'canonical-bytes', 'chain', 'checkpoint', 'journal-committed', 'consumed'], preserved);
              if (request.role === 'ambiguity-reviewer' && process.env.F03_C2_FAULTS === '1')
                crashSequence('s4.ambiguity.admit', ['derived', 'commit-intent', 'writer-prepared', 'canonical-bytes', 'chain', 'checkpoint', 'journal-committed', 'consumed'], preserved);
              if (!classC && (request.role === 'material-impact-reviewer' || request.role === 'ambiguity-reviewer' && !unresolved)
                && process.env.F03_C2_FAULTS === '1') for (const phase of ['s4.close-C2', 's4.close-C3', 's4.enter-S5'])
                crashSequence(phase, ['derived', 'commit-intent', 'writer-prepared', 'canonical-bytes', 'chain', 'checkpoint', 'journal-committed', 'consumed'], preserved);
              resumed = cli('resume', id); preserved();
              console.log(`PASS supported CLI C2 fixture ${request.role}; exact retained subject and fresh-process work consumption`);
            }
            assert.equal(calls, unresolved ? 4 : 2);
            if (classC) {
              assert.equal(resumed.details.work.operation, 'ambiguity.authority-contact');
              const contact = join(scratch, 'authority-contact.json');
              writeFileSync(contact, semanticJson({ format: 'aleph-ambiguity-authority-contact/v1', identity: 'fixture-simulated-authority' }));
              const points = ['derived', 'commit-intent', 'writer-prepared', 'canonical-bytes', 'chain', 'checkpoint', 'journal-committed', 'consumed'];
              if (process.env.F03_C2_FAULTS === '1') {
                crashSequence('s4.ambiguity.open-authority', points, preserved, ['--work-authority-contact', contact, id]);
                resumed = cli('resume', id);
              } else resumed = cli('--work-authority-contact', contact, id);
              assert.equal(resumed.result, 'BLOCKED'); assert.equal(resumed.gate.status, 'awaiting-authority');
              for (const action of ['inspect-source', 'record-human-observation', 'block-at-current-barrier', 'carry-unresolved'] as ProceduralAction[]) {
                const stateBefore = readFileSync(join(run, 'control/run-state.json')), gate = JSON.parse(stateBefore.toString()).execution.gate;
                const requestBytes = readFileSync(join(run, gate.request_ref)), request = JSON.parse(requestBytes.toString());
                const repeat = cli('resume', id); assert.equal(repeat.result, 'BLOCKED');
                assert(readFileSync(join(run, 'control/run-state.json')).equals(stateBefore));
                const recordedAt = new Date().toISOString();
                const response = buildProceduralAuthorityResponse({ request, request_bytes: requestBytes, authority_identity: 'fixture-simulated-authority',
                  selected_action: action, observation: action === 'record-human-observation' ? exactTextBlob(Buffer.from('Fixture observation; not semantic evidence.')) : null,
                  comment: null, recorded_at: recordedAt });
                const responsePath = join(scratch, `${request.request_id}-human-fixture.json`);
                writeFileSync(responsePath, JSON.stringify({ gateId: gate.id, authorityIdentity: 'fixture-simulated-authority', decision: 'approve',
                  recordedAt, simulation: { kind: 'fixture-simulated' }, response }));
                assert.equal(cli('--authority-response', responsePath, id).result, 'BLOCKED');
                if (process.env.F03_C2_FAULTS === '1') crashSequence('s4.ambiguity.apply-authority', points, preserved);
                if (action === 'carry-unresolved' && process.env.F03_C2_FAULTS === '1')
                  for (const phase of ['s4.close-C2', 's4.close-C3', 's4.enter-S5']) crashSequence(phase, points, preserved);
                resumed = cli('resume', id); preserved();
                const rows = parseInternalAmbiguities(loadRun(run));
                assert.equal(rows.t5_3Rows.at(-1)!.values.action, action);
                if (action !== 'carry-unresolved') {
                  // If the process stopped after consumption, this resume is
                  // already the later actual resume allowed to create Q+1.
                  if (resumed.gate.id === gate.id) {
                    assert.equal(resumed.result, 'BLOCKED'); assert.equal(resumed.gate.status, 'approved');
                    if (process.env.F03_C2_FAULTS === '1') crashSequence('s4.ambiguity.followup-authority', points, preserved);
                    resumed = cli('resume', id);
                  }
                  assert.equal(resumed.gate.id, gate.id.replace(/Q(\d+)$/u, (_: string, q: string) => `Q${Number(q) + 1}`));
                  assert.equal(resumed.gate.status, 'awaiting-authority');
                  const nextRequest = JSON.parse(readFileSync(join(run, resumed.gate.request_ref), 'utf8'));
                  assert.equal(nextRequest.authority_subject_digest, request.authority_subject_digest);
                }
                console.log(`PASS supported CLI fixture Class C ${action}; exact response, T5.3 application and legal next gate or closure`);
              }
            }
            assert.equal(resumed.stage, 'S5'); assert.equal(resumed.details.work.code, 'WORK_UNSUPPORTED_CAPABILITY');
            assert.equal(parseInternalAmbiguities(loadRun(run)).t5_2Rows.length, 1);
            const state = readFileSync(join(run, 'control/run-state.json')), chain = readFileSync(join(run, 'control/ledger-chain.jsonl'));
            for (let n = 0; n < 2; n++) {
              const repeat = cli('resume', id); assert.equal(repeat.details.work.code, 'WORK_UNSUPPORTED_CAPABILITY');
              assert(readFileSync(join(run, 'control/run-state.json')).equals(state));
              assert(readFileSync(join(run, 'control/ledger-chain.jsonl')).equals(chain)); preserved();
            }
            console.log(`PASS supported CLI C2 ${process.env.F03_C2}, C3, S5 entry and repeated explicit capability halt; no S5 worker dispatch`);
          }
        }
      }
    }
    console.log('PASS supported CLI retained S2 capture and completion path; fixture controls only');
    console.log('EVIDENCE: fixture-simulated only. No provider/model/native/live execution. F-03 OPEN / MUST PRESERVE.');
    }
  } finally {
    if (keep) console.error(`retained test scratch: ${scratch}`);
    else {
      makeTreeOwnerWritable(scratch);
      rmSync(scratch, { recursive: true, force: true });
    }
  }
}

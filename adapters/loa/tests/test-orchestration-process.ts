#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { assembleBundles } from '../../../scripts/assemble-bundles.ts';
import { predecessorSource } from '../../../scripts/compatibility-fixture-source.ts';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import { installLoaBundle } from '../src/installer.ts';
import { semanticJson, parseSemanticLedger, type SemanticSubject, type SemanticEntry } from '../../../scripts/lib/semantic-review.ts';
import { fixtureSemantics, fixtureResult, TEXT_USE } from '../../../scripts/semantic-fixture-support.ts';
import { makeTreeOwnerWritable } from '../src/fs.ts';
import { materialHash, materialFragmentsHash, prepareRepresentationCapture } from '../../../scripts/lib/source-representation.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const SELF = fileURLToPath(import.meta.url);
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
    writeFileSync(input, 'The synthetic counter increased.\n');
    let selectedInput = input;
    if (process.env.F03_L2F === '1') {
      const bytes = Buffer.from('The synthetic counter increased.');
      const descriptor = { format: 'aleph-supplied-representation/v1', source_path: 'input.md',
        origin_kind: 'supplied-extraction', extraction_surface: 'utf8-text', state: 'available', reason: 'none', assets: [],
        provenance: [{ provenance_id: 'RPR-0001', type: 'supplied-structure', actor: 'synthetic-fixture',
          tool: 'fixture-declaration', tool_version: '1', input_refs: ['source'], output_refs: ['declaration'],
          parameters_asset_id: 'none', declaration_asset_id: 'declaration' }],
        bindings: [{ binding_id: 'BND-0001', carrier_id: 'source', start_byte: '0', end_byte: String(bytes.length),
          page_id: 'none', region_id: 'none', byte_role: 'frozen-source-bytes', fragment_hash: materialHash(bytes),
          exact_bytes_base64: bytes.toString('base64') }],
        objects: ['source', 'text', 'formal'].map((kind, index) => ({ object_id: `OBJ-000${index + 1}`, kind,
          parent_id: index ? 'OBJ-0001' : 'none', state: 'available', reason: 'none',
          provenance_id: index ? 'RPR-0001' : 'capture', binding_ids: ['BND-0001'], content_hash: materialFragmentsHash([bytes]),
          coordinates: kind === 'formal' ? { notation: 'source-markup', structure_ids: [], structure_state: 'available' } : {} })),
        associations: [{ association_id: 'ASC-0001', kind: 'caption-for', subject_id: 'OBJ-0003',
          target_ids: [], state: 'unsupported', reason: 'Synthetic fixture supplies no caption.', provenance_id: 'RPR-0001' }] };
      const declaration = Buffer.from(JSON.stringify(descriptor));
      prepareRepresentationCapture([{ source_id: 'SRC-001', bytes: readFileSync(input), descriptor: declaration }]);
      selectedInput = join(host, 'input.aleph-representation.json'); writeFileSync(selectedInput, declaration);
    }
    let run = '';
    function command(module: string, args: string[], expected = 0): any {
      const entrypoint = module === 'cli' ? join(host, '.claude/aleph/bin/loa-aleph.mjs')
        : join(run, `control/runtime/bundle/runtime-js/adapters/loa/src/${module}.js`);
      const processResult = spawnSync(process.execPath, [entrypoint, ...args],
        { encoding: 'utf8', cwd: host });
      assert.equal(processResult.status, expected, `${processResult.stdout}\n${processResult.stderr}`);
      return JSON.parse(processResult.stdout);
    }
    const cli = (...args: string[]) => command('cli', ['--root', host, '--json', '--allow-fixture-simulation', ...args]);
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
      const dispatched = spawnSync(process.execPath, [SELF, '--fixture-worker', work.worker_bundle, work.return_root, rawPath],
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
    const fragment = Buffer.from('The synthetic counter increased.');
    const extraction: any = {
      source_id: sourceRow.sourceId, producer_invocation_id: extractor.call_id,
      walk_intervals: [{ start_byte: 0, end_byte: Buffer.byteLength('The synthetic counter increased.\n'),
        outcome: packetMode ? 'admitted' : 'excluded', packet_candidate_indexes: packetMode ? [0] : [],
        criterion_ref: packetMode ? 'admission:1' : 'exclusion:scaffolding', closure_state: 'closed',
        reason: packetMode ? null : 'Synthetic declared exclusion; no semantic correctness claim.', closure_note: null }],
      packets: packetMode ? [{ evidence_state: 'exact', join_policy: 'single-fragment',
        fragments: [{ fragment_order: 1, locator: 'L1-L1', exact_bytes_base64: fragment.toString('base64') }],
        rendered_text: fragment.toString(), degraded_source_locator: null, degradation_reason: null,
        criterion: 1, flags: [], material_use: TEXT_USE }] : [],
      extraction_events: packetMode ? [{ start_byte: 0, end_byte: fragment.length, shared_position_key: 'SP-0001',
        event_ordinal: 1, packet_candidate_index: 0, origin: 'primary' }] : [],
      next_cursor: { byte_offset: Buffer.byteLength('The synthetic counter increased.\n'), shared_position_key: null,
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
    runFixture(extractor, extraction);
    const producerRawPath = join(run, 'control/worker-returns', extractor.call_id, 'raw.json');
    const producerRaw = readFileSync(producerRawPath);
    assert.equal(loadRun(run).sourceWalk.completions[0].raw, priorRow, 'accept leaves the old canonical projection intact');
    if (sharedPause) {
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
    if (packetMode) {
      const review = resumed.details.work;
      const request = JSON.parse(readFileSync(join(review.worker_bundle, 'request.json'), 'utf8'));
      assert.equal(request.role, 'verifier-l2s');
      const path = request.allowlist.find((entry: { run_path: string }) => entry.run_path.startsWith('verification/harness/semantic-subjects/')).run_path;
      const subject = JSON.parse(readFileSync(join(run, path), 'utf8')) as SemanticSubject;
      runFixture(review, fixtureResult(subject));
      resumed = cli('resume', id);
      assert(readFileSync(join(run, 'ledgers/semantic-review.md'), 'utf8').includes('| admitted |'));
      console.log('PASS supported CLI exact packet capture, retained producer reauthentication, fresh fixture L2S and Core admission');
    }
    if (process.env.F03_S2_CLOSE === '1') {
      resumed = cli('resume', id);
      const gap = resumed.details.work;
      const request = JSON.parse(readFileSync(join(gap.worker_bundle, 'request.json'), 'utf8'));
      assert.equal(request.role, 'verifier-l1');
      runFixture(gap, { verdict: 'upheld', rationale: 'Synthetic coverage challenge found no additional candidate.',
        attacks_tried: ['Rechecked each frozen source position against the fixture criteria.'],
        evidence_ids: [], candidate_evidence: [], missing_for_determination: null, flags: [] });
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
          claims.push({ normalized_claim: fragment.toString(), packets: [packet], claim_type: 'factual',
            widen_requests: [], rationale: 'Synthetic unchanged source proposition.', flags: [], material_use: use });
          entries.push({ output_kind: 'claim-candidate', output_index: 0, review_mode: 'proposal',
            origin_unit_refs: originRefs, anchors, semantics: fixtureSemantics(fragment.toString()) });
        }
        if (mode.startsWith('indeterminate') || mode === 'mixed') {
          const use: any = { requirements: [{ object_id: 'OBJ-0002', feature: 'formal-structure', binding_ids: ['BND-0001'] },
            ...mode !== 'indeterminate-one' ? [{ object_id: 'OBJ-0001', feature: 'table-grid', binding_ids: ['BND-0001'] }] : []],
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
        while (resumed.details.work?.action === 'prepare') {
          const work = resumed.details.work;
          const request = JSON.parse(readFileSync(join(work.worker_bundle, 'request.json'), 'utf8'));
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
            const verdict = process.env.F03_C04_VERDICT || 'upheld';
            if (verdict !== 'upheld') {
              assert(verdict === 'refuted' || verdict === 'cannot-determine');
              result.verdict = verdict; result.field_reviews[0].verdict = verdict; result.field_reviews[0].issue = 'missing-material';
              result.missing_for_determination = verdict === 'cannot-determine' ? 'Synthetic reviewer missing structure.' : null;
              if (verdict === 'cannot-determine') result.unresolved_findings = structuredClone(subject.semantics.unresolved_findings);
            }
          }
          runFixture(work, result); resumed = cli('resume', id); reviews++;
          assert(reviews <= entries.length + 1, 'no repeated fresh review until preferred verdict');
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
        assert(readFileSync(rawPath).equals(raw));
        assert.equal(loadRun(run).claims.length, (mode === 'usable' || mode === 'mixed')
          && (!process.env.F03_L2F_VERDICT || process.env.F03_L2F_VERDICT === 'upheld') ? 1 : 0);
        console.log(`PASS supported CLI S3 ${mode}/${process.env.F03_C04_VERDICT || 'upheld'}: ${reviews} fresh fixture reviews, original raw bytes and reservation/admission boundary`);
      }
    }
    console.log('PASS supported CLI S2 walk-only capture, process reauthentication, C-02 projection, before-row retention and repeated-resume idempotency');
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

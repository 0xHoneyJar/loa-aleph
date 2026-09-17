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
import { semanticJson, type SemanticSubject } from '../../../scripts/lib/semantic-review.ts';
import { fixtureSemantics, fixtureResult, TEXT_USE } from '../../../scripts/semantic-fixture-support.ts';
import { makeTreeOwnerWritable } from '../src/fs.ts';

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
    const started = cli('start', input);
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
    const packetMode = process.env.F03_PACKET === '1';
    const fragment = Buffer.from('The synthetic counter increased.');
    runFixture(extractor, {
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
    });
    assert.equal(loadRun(run).sourceWalk.completions[0].raw, priorRow, 'accept leaves the old canonical projection intact');
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
    console.log('PASS supported CLI S2 walk-only capture, process reauthentication, C-02 projection, before-row retention and repeated-resume idempotency');
    console.log('EVIDENCE: fixture-simulated only. No provider/model/native/live execution. F-03 OPEN / MUST PRESERVE.');
  } finally {
    if (keep) console.error(`retained test scratch: ${scratch}`);
    else {
      makeTreeOwnerWritable(scratch);
      rmSync(scratch, { recursive: true, force: true });
    }
  }
}

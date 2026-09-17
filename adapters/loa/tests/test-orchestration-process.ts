#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assembleBundles } from '../../../scripts/assemble-bundles.ts';
import { predecessorSource } from '../../../scripts/compatibility-fixture-source.ts';
import { loadRun } from '../../../scripts/lib/run-model.ts';
import { installLoaBundle } from '../src/installer.ts';
import { dispatchPreparedLoaWorker } from '../src/worker-dispatch.ts';
import { semanticJson } from '../../../scripts/lib/semantic-review.ts';
import { makeTreeOwnerWritable } from '../src/fs.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const SELF = fileURLToPath(import.meta.url);
if (process.argv[2] === '--fixture-worker') {
  const [workerBundleRoot, returnRoot, rawPath] = process.argv.slice(3);
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
    function command(module: string, args: string[], expected = 0): any {
      const processResult = spawnSync(process.execPath, [join(ROOT, `adapters/loa/src/${module}.ts`), ...args],
        { encoding: 'utf8', cwd: host });
      assert.equal(processResult.status, expected, `${processResult.stdout}\n${processResult.stderr}`);
      return JSON.parse(processResult.stdout);
    }
    const cli = (...args: string[]) => command('cli', ['--root', host, '--json', '--allow-fixture-simulation', ...args]);
    const started = cli('start', input);
    assert.equal(started.result, 'BLOCKED');
    const id = started.run_id, run = join(host, 'grimoires/loa/aleph/runs', id);
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
    console.log('EVIDENCE: fixture-simulated only. No provider/model/native/live execution. F-03 OPEN / MUST PRESERVE.');
  } finally {
    if (keep) console.error(`retained test scratch: ${scratch}`);
    else {
      makeTreeOwnerWritable(scratch);
      rmSync(scratch, { recursive: true, force: true });
    }
  }
}

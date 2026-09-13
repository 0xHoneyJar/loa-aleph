#!/usr/bin/env node
/** Compare actual reports from source and generated runtime; retain every attempt. */
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url)), evidence = mkdtempSync(join(tmpdir(), 'aleph-duplicate-parity-'));
const tests = [
  'scripts/test-duplicate-review-contracts.ts',
  'scripts/test-duplicate-review-fixtures.ts',
  'scripts/test-duplicate-review-mutations.ts',
  'adapters/loa/tests/test-duplicate-review-process.ts',
];
const records: Array<{ test: string; result: string; cases: number }> = [];
for (const [index, test] of tests.entries()) {
  const reports: Array<Record<string, unknown>> = [];
  for (const runtime of [false, true]) {
    const result = spawnSync(process.execPath, [resolve(root, test), '--json', ...(runtime ? ['--runtime'] : [])],
      { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
    const name = `${index}-${runtime ? 'runtime' : 'source'}`;
    writeFileSync(join(evidence, `${name}.stdout`), result.stdout || '');
    writeFileSync(join(evidence, `${name}.stderr`), result.stderr || '');
    assert.equal(result.status, 0, `${test} ${name}: ${result.stderr || result.stdout}`);
    const report = JSON.parse(result.stdout) as Record<string, unknown>;
    assert.equal(report.result, 'PASS');
    // Only the temporary evidence location differs; case records stay intact.
    const { evidence_directory: _directory, ...comparable } = report;
    reports.push(comparable);
  }
  assert.deepEqual(reports[0], reports[1], `source/runtime report differs: ${test}`);
  records.push({ test, result: 'PASS', cases: (reports[0].records as unknown[]).length });
}
const report = { result: 'PASS', records, evidence_directory: evidence, genuine_model_calls: 0 };
writeFileSync(join(evidence, 'report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));

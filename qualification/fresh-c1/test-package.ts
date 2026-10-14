import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assembleBundles, verifyDefaultBundleOutput } from '../../scripts/assemble-bundles.ts';
import { installLoaBundle } from '../../adapters/loa/src/installer.ts';
import { stripFixtureCalibrationInventory } from '../../scripts/compatibility-fixture-source.ts';
import { validateCoreBoundary } from '../../scripts/validate-core-boundary.ts';
import { freezeTooling, sourceFromCommit, sourcePaths } from './driver.ts';
import { capture, digest, json, PRODUCT, publish } from './common.ts';
import { fixtureEnvironment, supervise } from './supervisor.ts';

const repository = resolve(process.argv[2] || '.'), scratch = mkdtempSync(join(tmpdir(), 'fresh-c1-package-test-'));
// Validate this development package independently of the fixed product below.
// Only declared permitted source is copied; calibration is excluded before reads.
const manifest = json(join(repository, 'core.manifest.json'));
const current = join(scratch, 'current-package'); mkdirSync(current);
const inventory = [...manifest.files.core, ...Object.values(manifest.files.adapter).flat() as string[],
  ...manifest.files.packaging, ...manifest.files.repository_administration];
const tracked = spawnSync('/usr/bin/git', ['ls-files', '--cached', '-z'],
  { cwd: repository, encoding: 'utf8', env: fixtureEnvironment() });
assert.equal(tracked.status, 0, tracked.stderr);
for (const path of sourcePaths(tracked.stdout.split('\0').filter(Boolean))) {
  assert(inventory.includes(path), `UNCLASSIFIED_PACKAGE_PATH ${path}`);
}
for (const path of sourcePaths(inventory)) {
  mkdirSync(dirname(join(current, path)), { recursive: true });
  copyFileSync(join(repository, path), join(current, path));
}
stripFixtureCalibrationInventory(current);
for (const args of [['init', '-q'], ['add', '--all'],
  ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', 'Synthetic current package inventory']]) {
  const initialized = spawnSync('/usr/bin/git', ['-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', ...args],
    { cwd: current, env: fixtureEnvironment(), encoding: 'utf8' });
  assert.equal(initialized.status, 0, initialized.stderr);
}
const boundary = validateCoreBoundary({ root: current });
publish(join(scratch, 'current-package-boundary.json'), boundary);
assert.equal(boundary.result, 'PASS', JSON.stringify(boundary.checks.filter(check => check.status === 'FAIL')));
const currentBundles = join(scratch, 'current-bundles');
const currentAssembly = assembleBundles(current, currentBundles);
assert.equal(currentAssembly.result, 'PASS', currentAssembly.errors.join('; '));
const currentVerification = verifyDefaultBundleOutput(currentBundles);
assert.equal(currentVerification.result, 'PASS', currentVerification.errors.join('; '));
const toolingFiles = sourcePaths(inventory).filter(path => path.startsWith('qualification/fresh-c1/'));
for (const path of toolingFiles) {
  assert.equal(digest(readFileSync(join(currentBundles, 'aleph-for-loa', path))),
    digest(readFileSync(join(repository, path))), `QUALIFICATION_PACKAGE_BYTES ${path}`);
}
const compiled = resolve(dirname(fileURLToPath(import.meta.url)), '../..'), frozen = join(scratch, 'qualification-tools');
freezeTooling(compiled, frozen);
const compiledInventory = capture(compiled), frozenInventory = capture(frozen);
for (const [path, entry] of Object.entries(compiledInventory)) {
  assert.equal(frozenInventory[path].digest, entry.digest, `COMPILED_PACKAGE_BYTES ${path}`);
  assert.equal(frozenInventory[path].mode & 0o222, 0);
}
publish(join(scratch, 'qualification-package.json'), { result: 'PASS', source_files: toolingFiles,
  source: capture(join(currentBundles, 'aleph-for-loa/qualification/fresh-c1')),
  compiled: frozenInventory, assembly: currentAssembly, verification: currentVerification });
const source = sourceFromCommit(repository, scratch);
assert(!existsSync(join(source, 'calibration')));
assert.equal(json(join(scratch, 'source.json')).files.length, 715);
const assembled = assembleBundles(source, join(scratch, 'bundles'));
assert.equal(assembled.result, 'PASS', assembled.errors.join('; '));
const verified = verifyDefaultBundleOutput(join(scratch, 'bundles'));
assert.equal(verified.result, 'PASS', verified.errors.join('; '));
const bundle = join(scratch, 'bundles/aleph-for-loa'), lock = json(join(bundle, 'bundle.lock.json'));
assert.equal(lock.core.tree_digest, PRODUCT.core); assert.equal(lock.adapter.tree_digest, PRODUCT.adapter);
assert.equal(lock.checker_digest, PRODUCT.checker); assert.equal(lock.bundle.payload_digest, PRODUCT.payload);
const host = join(scratch, 'host'), installed = installLoaBundle(bundle, host);
assert.equal(installed.result, 'PASS', installed.errors.join('; '));
const status = await supervise({ nonce: 'offline-installation-only', ordinal: 1, command: process.execPath,
  args: [join(host, '.claude/aleph/bin/loa-aleph.mjs'), '--root', host, '--json', 'status'], cwd: host,
  env: fixtureEnvironment(), expected: 0, deadline: Date.now() + 30000, max_seconds: 30 }, join(scratch, 'status'));
assert.equal(status.verdict, 'PASS');
const report = JSON.parse(readFileSync(status.stdout, 'utf8'));
assert.deepEqual(report.details.runs, []);
assert(!existsSync(join(host, 'grimoires/loa/aleph/runs')));
publish(join(scratch, 'result.json'), { result: 'PASS', product: PRODUCT, status: report,
  scope: 'Pinned source exclusion, bundle and installation/status smoke only. No run/start/resume/C1 execution.' });
console.log(JSON.stringify({ result: 'PASS', evidence: scratch, source_paths: 715, product: PRODUCT,
  node: process.version, new_runs: 0 }));

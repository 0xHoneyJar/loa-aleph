#!/usr/bin/env node

import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import {
  canonicalJsonBytes,
  readJsonFile,
  sha256Digest,
  utf8Compare,
} from '../scripts/lib/bundle-format.ts';
import type { BundleLock, CoreManifest } from '../scripts/lib/bundle-format.ts';
import {
  assertReleasableLoaLock,
  deterministicGzip,
  packageLoaRelease,
  parseDeterministicTar,
  verifyLoaRelease,
} from './package-loa-release.ts';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(dirname(SCRIPT_PATH), '..');
const VERSION = '0.1.0-provisional';
const FIXED_GIT_DATE = '2000-01-01T00:00:00Z';

interface CaseResult {
  name: string;
  status: 'PASS' | 'FAIL';
  error?: string;
}

interface TestReport {
  result: 'PASS' | 'FAIL';
  cases: CaseResult[];
}

interface ReleasePaths {
  root: string;
  archive: string;
  checksum: string;
  metadata: string;
}

function fail(message: string): never {
  throw new Error(message);
}

function expect(condition: boolean, message: string): asserts condition {
  if (!condition) fail(message);
}

function expectMatch(value: string, pattern: RegExp, message: string): void {
  if (!pattern.test(value)) fail(`${message}: ${value}`);
}

function git(root: string, args: string[], fixedDate = false): string {
  const result = spawnSync('git', ['-C', root, ...args], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    env: fixedDate
      ? {
          ...process.env,
          GIT_AUTHOR_DATE: FIXED_GIT_DATE,
          GIT_COMMITTER_DATE: FIXED_GIT_DATE,
        }
      : process.env,
  });
  if (result.status !== 0) {
    fail(`git ${args.join(' ')} failed: ${result.stderr.trim()}`);
  }
  return result.stdout.trim();
}

function sourceInventory(): string[] {
  const manifest = readJsonFile(join(REPO_ROOT, 'core.manifest.json')) as CoreManifest;
  return [...new Set([
    ...manifest.files.core,
    ...Object.values(manifest.files.adapter).flat(),
    ...manifest.files.packaging,
    ...manifest.files.repository_administration,
  ])].sort(utf8Compare);
}

function createCleanSource(destination: string): void {
  mkdirSync(destination, { recursive: true });
  for (const path of sourceInventory()) {
    const source = join(REPO_ROOT, path);
    const target = join(destination, path);
    mkdirSync(dirname(target), { recursive: true });
    cpSync(source, target, { recursive: true });
  }
  git(destination, ['init', '-q']);
  git(destination, ['config', 'user.name', 'Aleph Release Tests']);
  git(destination, ['config', 'user.email', 'aleph-release-tests.invalid']);
  git(destination, ['add', '--all']);
  git(destination, ['commit', '-q', '-m', 'clean release source'], true);
  const modules = join(destination, 'node_modules');
  mkdirSync(join(modules, '@types'), { recursive: true });
  mkdirSync(join(modules, '@typescript'), { recursive: true });
  symlinkSync(join(REPO_ROOT, 'node_modules', 'typescript'), join(modules, 'typescript'), 'dir');
  symlinkSync(join(REPO_ROOT, 'node_modules', 'undici-types'), join(modules, 'undici-types'), 'dir');
  symlinkSync(
    join(REPO_ROOT, 'node_modules', '@types', 'node'),
    join(modules, '@types', 'node'),
    'dir',
  );
  symlinkSync(
    join(REPO_ROOT, 'node_modules', '@typescript', 'typescript-linux-x64'),
    join(modules, '@typescript', 'typescript-linux-x64'),
    'dir',
  );
}

function cloneCleanSource(source: string, destination: string): void {
  cpSync(source, destination, { recursive: true });
  expect(git(destination, ['status', '--porcelain=v1', '--untracked-files=all']) === '',
    'cloned source is dirty');
}

function packageOrFail(source: string, output: string): ReleasePaths {
  const report = packageLoaRelease({ root: source, output, version: VERSION });
  if (report.result !== 'PASS'
    || !report.archivePath
    || !report.checksumPath
    || !report.metadataPath) {
    fail(`release packaging failed: ${report.errors.join('; ')}`);
  }
  return {
    root: report.releasePath,
    archive: report.archivePath,
    checksum: report.checksumPath,
    metadata: report.metadataPath,
  };
}

function releasePaths(root: string): ReleasePaths {
  const names = readdirSync(root);
  const archive = names.find((name) => name.endsWith('.tar.gz'));
  const checksum = names.find((name) => name.endsWith('.sha256'));
  const metadata = names.find((name) => name.endsWith('.release.json'));
  if (!archive || !checksum || !metadata) fail('release file set is incomplete');
  return {
    root,
    archive: join(root, archive),
    checksum: join(root, checksum),
    metadata: join(root, metadata),
  };
}

function cloneRelease(source: ReleasePaths, destination: string): ReleasePaths {
  cpSync(source.root, destination, { recursive: true });
  return releasePaths(destination);
}

function assertSameRelease(left: ReleasePaths, right: ReleasePaths): void {
  const leftNames = readdirSync(left.root).sort(utf8Compare);
  const rightNames = readdirSync(right.root).sort(utf8Compare);
  expect(JSON.stringify(leftNames) === JSON.stringify(rightNames),
    'repeated release filenames differ');
  for (const name of leftNames) {
    expect(readFileSync(join(left.root, name)).equals(readFileSync(join(right.root, name))),
      `repeated release bytes differ: ${name}`);
  }
}

function expectPackageFailure(
  source: string,
  output: string,
  version: string,
  pattern: RegExp,
): void {
  const report = packageLoaRelease({ root: source, output, version });
  expect(report.result === 'FAIL', 'release packaging unexpectedly passed');
  expectMatch(report.errors.join('; '), pattern, 'release packaging failure mismatch');
}

function expectVerifyFailure(release: string, pattern: RegExp): void {
  const report = verifyLoaRelease(release);
  expect(report.result === 'FAIL', 'release verification unexpectedly passed');
  expectMatch(report.errors.join('; '), pattern, 'release verification failure mismatch');
}

function rewriteAssetBindings(paths: ReleasePaths, archive: Buffer): void {
  writeFileSync(paths.archive, archive);
  const digest = sha256Digest(archive);
  const archiveName = paths.archive.slice(paths.archive.lastIndexOf('/') + 1);
  writeFileSync(paths.checksum, `${digest.replace('sha256:', '')}  ${archiveName}\n`);
  const metadata = readJsonFile(paths.metadata) as Record<string, unknown>;
  const asset = metadata.asset as Record<string, unknown>;
  asset.digest = digest;
  writeFileSync(paths.metadata, canonicalJsonBytes(metadata));
}

function mutateFirstTarPath(paths: ReleasePaths, newPath: string): void {
  const tar = gunzipSync(readFileSync(paths.archive));
  tar.fill(0, 0, 100);
  Buffer.from(newPath, 'utf8').copy(tar, 0);
  tar.fill(0, 345, 500);
  tar.fill(0x20, 148, 156);
  const checksum = tar
    .subarray(0, 512)
    .reduce((sum, byte) => sum + byte, 0);
  Buffer.from(`${checksum.toString(8).padStart(6, '0')}\0 `, 'ascii').copy(tar, 148);
  rewriteAssetBindings(paths, deterministicGzip(tar));
}

function mutateFirstTarModeEncoding(paths: ReleasePaths): void {
  const tar = gunzipSync(readFileSync(paths.archive));
  tar[107] = 0x20;
  tar.fill(0x20, 148, 156);
  const checksum = tar
    .subarray(0, 512)
    .reduce((sum, byte) => sum + byte, 0);
  Buffer.from(`${checksum.toString(8).padStart(6, '0')}\0 `, 'ascii').copy(tar, 148);
  rewriteAssetBindings(paths, deterministicGzip(tar));
}

function readLoaLock(paths: ReleasePaths): BundleLock {
  const entries = parseDeterministicTar(gunzipSync(readFileSync(paths.archive)));
  const lock = entries.find((entry) => entry.path === 'aleph-for-loa/bundle.lock.json');
  if (!lock) fail('release archive omitted bundle lock');
  return JSON.parse(lock.bytes.toString('utf8')) as BundleLock;
}

function runCase(results: CaseResult[], name: string, action: () => void): void {
  try {
    action();
    results.push({ name, status: 'PASS' });
  } catch (error) {
    results.push({
      name,
      status: 'FAIL',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function main(): void {
  const json = process.argv.includes('--json');
  const unknown = process.argv.slice(2).filter((arg) => arg !== '--json');
  if (unknown.length > 0) {
    console.error(`unknown argument "${unknown[0]}"`);
    process.exitCode = 2;
    return;
  }
  const tempRoot = mkdtempSync(join(tmpdir(), 'aleph-loa-release-tests-'));
  const results: CaseResult[] = [];
  try {
    const cleanSource = join(tempRoot, 'clean-source');
    createCleanSource(cleanSource);
    const first = packageOrFail(cleanSource, join(tempRoot, 'release-output-1'));
    const second = packageOrFail(cleanSource, join(tempRoot, 'release-output-2'));

    runCase(results, 'clean source produces a round-trip verified release', () => {
      const report = verifyLoaRelease(first.root);
      expect(report.result === 'PASS', report.errors.join('; '));
      expect(Boolean(report.bundleDigest && report.archiveDigest),
        'verified report omitted digests');
    });

    runCase(results, 'package and verify CLI commands emit passing JSON', () => {
      const cliOutput = join(tempRoot, 'release-output-cli');
      const packageResult = spawnSync(process.execPath, [
        join(REPO_ROOT, 'packaging/package-loa-release.ts'),
        'package',
        '--root',
        cleanSource,
        '--output',
        cliOutput,
        '--version',
        VERSION,
        '--json',
      ], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
      expect(packageResult.status === 0, `package CLI failed: ${packageResult.stderr}`);
      const packaged = JSON.parse(packageResult.stdout) as { result?: string; releasePath?: string };
      expect(packaged.result === 'PASS' && Boolean(packaged.releasePath),
        'package CLI did not emit a passing report');
      const verifyResult = spawnSync(process.execPath, [
        join(REPO_ROOT, 'packaging/package-loa-release.ts'),
        'verify',
        '--release',
        packaged.releasePath || '',
        '--json',
      ], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
      expect(verifyResult.status === 0, `verify CLI failed: ${verifyResult.stderr}`);
      const verified = JSON.parse(verifyResult.stdout) as { result?: string };
      expect(verified.result === 'PASS', 'verify CLI did not emit a passing report');
    });

    runCase(results, 'repeated packaging is byte-identical', () => {
      assertSameRelease(first, second);
    });

    runCase(results, 'commit outside bundle closure preserves exact release bytes', () => {
      const source = join(tempRoot, 'administration-only-source');
      cloneCleanSource(cleanSource, source);
      writeFileSync(join(source, '.github', 'CODEOWNERS'), '\n# release-admin-only\n', {
        flag: 'a',
      });
      git(source, ['add', '.github/CODEOWNERS']);
      git(source, ['commit', '-q', '-m', 'administration only'], true);
      const third = packageOrFail(source, join(tempRoot, 'release-output-admin-only'));
      assertSameRelease(first, third);
    });

    runCase(results, 'archive is normalized and contains only locked Loa files', () => {
      const tar = gunzipSync(readFileSync(first.archive));
      const entries = parseDeterministicTar(tar);
      expect(entries.length > 1, 'release archive is unexpectedly empty');
      expect(entries.every((entry) => entry.path.startsWith('aleph-for-loa/')),
        'release archive escaped the Loa root');
      const lock = readLoaLock(first);
      expect(entries.length === lock.files.length + 1,
        'release archive inventory count disagrees with lock');
      expect(!entries.some((entry) => entry.path.includes('adapters/hermes/')),
        'release archive contains Hermes adapter bytes');
    });

    runCase(results, 'dirty tracked source fails closed', () => {
      const source = join(tempRoot, 'dirty-tracked-source');
      cloneCleanSource(cleanSource, source);
      writeFileSync(join(source, 'README.md'), '\nrelease dirt\n', { flag: 'a' });
      expectPackageFailure(source, join(tempRoot, 'dirty-tracked-output'), VERSION, /globally clean/i);
    });

    runCase(results, 'staged source fails closed', () => {
      const source = join(tempRoot, 'staged-source');
      cloneCleanSource(cleanSource, source);
      writeFileSync(join(source, 'README.md'), '\nstaged release dirt\n', { flag: 'a' });
      git(source, ['add', 'README.md']);
      expectPackageFailure(source, join(tempRoot, 'staged-output'), VERSION, /globally clean/i);
    });

    runCase(results, 'nonignored untracked source fails closed', () => {
      const source = join(tempRoot, 'untracked-source');
      cloneCleanSource(cleanSource, source);
      writeFileSync(join(source, 'release-dirt.txt'), 'untracked\n');
      expectPackageFailure(source, join(tempRoot, 'untracked-output'), VERSION, /globally clean/i);
    });

    runCase(results, 'shallow source history fails closed', () => {
      const source = join(tempRoot, 'shallow-source');
      const clone = spawnSync('git', [
        'clone',
        '--quiet',
        '--depth',
        '1',
        `file://${cleanSource}`,
        source,
      ], { encoding: 'utf8' });
      if (clone.status !== 0) fail(`shallow clone failed: ${clone.stderr.trim()}`);
      expectPackageFailure(source, join(tempRoot, 'shallow-output'), VERSION, /complete Git history/i);
    });

    runCase(results, 'version mismatch fails closed', () => {
      expectPackageFailure(
        cleanSource,
        join(tempRoot, 'version-output'),
        '0.1.1-provisional',
        /version disagrees/i,
      );
    });

    runCase(results, 'clean committed runtime projection drift fails closed', () => {
      const source = join(tempRoot, 'runtime-drift-source');
      cloneCleanSource(cleanSource, source);
      writeFileSync(
        join(source, 'adapters', 'loa', 'src', 'types.ts'),
        '\nexport const releaseProjectionDriftProbe = 1;\n',
        { flag: 'a' },
      );
      git(source, ['add', 'adapters/loa/src/types.ts']);
      git(source, ['commit', '-q', '-m', 'committed runtime drift'], true);
      expectPackageFailure(
        source,
        join(tempRoot, 'runtime-drift-output'),
        VERSION,
        /runtime projection differs/i,
      );
    });

    runCase(results, 'existing release is never overwritten', () => {
      expectPackageFailure(
        cleanSource,
        join(tempRoot, 'release-output-1'),
        VERSION,
        /already exists/i,
      );
      expect(verifyLoaRelease(first.root).result === 'PASS',
        'no-overwrite failure damaged the prior release');
    });

    runCase(results, 'modified provenance cannot be released', () => {
      const lock = structuredClone(readLoaLock(first));
      lock.provenance.vcs.worktree_state = 'modified';
      let error = '';
      try {
        assertReleasableLoaLock(lock, VERSION);
      } catch (caught) {
        error = caught instanceof Error ? caught.message : String(caught);
      }
      expectMatch(error, /provenance.*clean/i, 'modified provenance was accepted');
    });

    runCase(results, 'planned adapter cannot be released', () => {
      const lock = structuredClone(readLoaLock(first));
      lock.adapter.lifecycle = 'planned';
      let error = '';
      try {
        assertReleasableLoaLock(lock, VERSION);
      } catch (caught) {
        error = caught instanceof Error ? caught.message : String(caught);
      }
      expectMatch(error, /implemented-or-later/i, 'planned lifecycle was accepted');
    });

    runCase(results, 'archive tampering fails verification', () => {
      const paths = cloneRelease(first, join(tempRoot, 'tampered-archive-release'));
      const bytes = readFileSync(paths.archive);
      bytes[Math.floor(bytes.length / 2)] ^= 0x01;
      writeFileSync(paths.archive, bytes);
      expectVerifyFailure(paths.root, /archive digest/i);
    });

    runCase(results, 'checksum tampering fails verification', () => {
      const paths = cloneRelease(first, join(tempRoot, 'tampered-checksum-release'));
      writeFileSync(paths.checksum, `${'0'.repeat(64)}  fake.tar.gz\n`);
      expectVerifyFailure(paths.root, /checksum sidecar/i);
    });

    runCase(results, 'noncanonical metadata fails verification', () => {
      const paths = cloneRelease(first, join(tempRoot, 'noncanonical-metadata-release'));
      const value = readJsonFile(paths.metadata);
      writeFileSync(paths.metadata, `${JSON.stringify(value, null, 2)}\n`);
      expectVerifyFailure(paths.root, /not canonical/i);
    });

    runCase(results, 'metadata build commit tampering fails verification', () => {
      const paths = cloneRelease(first, join(tempRoot, 'tampered-build-commit-release'));
      const metadata = readJsonFile(paths.metadata) as Record<string, unknown>;
      const source = metadata.source as Record<string, unknown>;
      source.build_commit = '0'.repeat(40);
      writeFileSync(paths.metadata, canonicalJsonBytes(metadata));
      expectVerifyFailure(paths.root, /build commit mismatch/i);
    });

    runCase(results, 'extra release entry fails verification', () => {
      const paths = cloneRelease(first, join(tempRoot, 'extra-entry-release'));
      writeFileSync(join(paths.root, 'extra.txt'), 'forbidden\n');
      expectVerifyFailure(paths.root, /exactly one archive/i);
    });

    runCase(results, 'release symlink fails verification', () => {
      const paths = cloneRelease(first, join(tempRoot, 'symlink-release'));
      symlinkSync(paths.archive, join(paths.root, 'link.tar.gz'));
      expectVerifyFailure(paths.root, /non-regular entry/i);
    });

    runCase(results, 'archive traversal path fails verification', () => {
      const paths = cloneRelease(first, join(tempRoot, 'traversal-release'));
      mutateFirstTarPath(paths, '../outside');
      expectVerifyFailure(paths.root, /unsafe|outside aleph-for-loa/i);
    });

    runCase(results, 'noncanonical tar header encoding fails verification', () => {
      const paths = cloneRelease(first, join(tempRoot, 'noncanonical-tar-release'));
      mutateFirstTarModeEncoding(paths);
      expectVerifyFailure(paths.root, /canonical normalized ustar/i);
    });

    runCase(results, 'release output inside source is rejected', () => {
      expectPackageFailure(
        cleanSource,
        join(cleanSource, '.aleph-release-output'),
        VERSION,
        /outside the source repository/i,
      );
      expect(!existsSync(join(cleanSource, '.aleph-release-output')),
        'inside-source rejection created output');
    });
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
  const report: TestReport = {
    result: results.every((item) => item.status === 'PASS') ? 'PASS' : 'FAIL',
    cases: results,
  };
  if (json) console.log(JSON.stringify(report, null, 2));
  else {
    for (const item of results) {
      console.log(`${item.status} ${item.name}${item.error ? `: ${item.error}` : ''}`);
    }
    console.log(`RESULT: ${report.result} (${results.filter((item) => item.status === 'PASS').length}/${results.length})`);
  }
  process.exitCode = report.result === 'PASS' ? 0 : 1;
}

if (resolve(process.argv[1] || '') === SCRIPT_PATH) main();

#!/usr/bin/env node

import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import {
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
} from 'node:path';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import {
  canonicalJsonBytes,
  isRecord,
  normalizedRepositoryPath,
  readJsonFile,
  sha256Digest,
  utf8Compare,
} from '../scripts/lib/bundle-format.ts';
import type { BundleLock } from '../scripts/lib/bundle-format.ts';
import {
  assembleBundles,
  verifyBundle,
  verifyBundleSet,
} from '../scripts/assemble-bundles.ts';
import { checkRuntimeProjection } from './build-runtime-js.ts';

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const REPO_ROOT = resolve(dirname(SCRIPT_PATH), '..');
const RELEASE_FORMAT = 'aleph-loa-release/v1';
const BUNDLE_ID = 'aleph-for-loa';
const ADAPTER_ID = 'loa';
const TAR_BLOCK_SIZE = 512;
const RELEASE_VERSION_PATTERN = /^[0-9A-Za-z][0-9A-Za-z.-]*$/;
const SHA256_PATTERN = /^sha256:[0-9a-f]{64}$/;

interface PackageOptions {
  root: string;
  output: string;
  version: string;
}

interface ReleaseMetadata {
  format: typeof RELEASE_FORMAT;
  release: {
    id: typeof BUNDLE_ID;
    version: string;
    maturity: 'structural-prerelease';
  };
  source: {
    build_commit: string;
    dependency_closure_commit: string;
    provenance_digest: string;
  };
  bundle: {
    digest: string;
    payload_digest: string;
    lock_digest: string;
    core_digest: string;
    adapter_digest: string;
    checker_digest: string;
    adapter_lifecycle: string;
  };
  asset: {
    filename: string;
    digest: string;
    checksum_filename: string;
  };
}

export interface ReleaseReport {
  result: 'PASS' | 'FAIL';
  releasePath: string;
  archivePath?: string;
  checksumPath?: string;
  metadataPath?: string;
  bundleDigest?: string;
  archiveDigest?: string;
  errors: string[];
}

interface TarEntry {
  path: string;
  bytes: Buffer;
}

interface CliOptions {
  command: 'package' | 'verify' | '';
  root: string;
  output: string;
  version: string;
  release: string;
  json: boolean;
  help: boolean;
  error: string;
}

function pathInside(parent: string, child: string): boolean {
  const rel = relative(parent, child);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

function git(root: string, args: string[], allowFailure = false): string {
  const result = spawnSync('git', ['-C', root, ...args], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.status !== 0 && !allowFailure) {
    throw new Error(
      `git ${args.join(' ')} failed: ${
        result.stderr.trim() || result.error?.message || `status ${String(result.status)}`
      }`,
    );
  }
  return result.status === 0 ? result.stdout.trim() : '';
}

function assertCleanSource(root: string): string {
  if (git(root, ['rev-parse', '--is-inside-work-tree']) !== 'true') {
    throw new Error('release source must be a Git worktree');
  }
  if (git(root, ['rev-parse', '--is-shallow-repository']) !== 'false') {
    throw new Error('release source requires complete Git history');
  }
  const head = git(root, ['rev-parse', '--verify', 'HEAD']);
  if (!/^[0-9a-f]{40}$|^[0-9a-f]{64}$/.test(head)) {
    throw new Error('release source HEAD is unresolved');
  }
  const status = git(root, [
    'status',
    '--porcelain=v1',
    '--untracked-files=all',
  ]);
  if (status) {
    throw new Error('release source must be globally clean (tracked, staged, and untracked)');
  }
  return head;
}

function exactKeys(
  value: unknown,
  keys: readonly string[],
): value is Record<string, unknown> {
  if (!isRecord(value)) return false;
  const actual = Object.keys(value).sort(utf8Compare);
  const expected = [...keys].sort(utf8Compare);
  return actual.length === expected.length
    && actual.every((key, index) => key === expected[index]);
}

export function assertReleasableLoaLock(
  lock: BundleLock,
  version: string,
  head?: string,
  root?: string,
): void {
  if (lock.bundle.id !== BUNDLE_ID) throw new Error(`release bundle must be ${BUNDLE_ID}`);
  if (lock.bundle.version !== version) {
    throw new Error('requested release version disagrees with bundle version');
  }
  if (lock.adapter.id !== ADAPTER_ID) throw new Error(`release adapter must be ${ADAPTER_ID}`);
  if (lock.adapter.version !== version) {
    throw new Error('bundle and adapter versions must match');
  }
  if (!['implemented', 'validated', 'sanctioned'].includes(lock.adapter.lifecycle)) {
    throw new Error('Loa release requires an implemented-or-later adapter lifecycle');
  }
  if (lock.provenance.vcs.worktree_state !== 'clean') {
    throw new Error('release bundle provenance must record a clean worktree');
  }
  if (head && root) {
    const status = spawnSync('git', [
      '-C',
      root,
      'merge-base',
      '--is-ancestor',
      lock.provenance.vcs.commit,
      head,
    ]).status;
    if (status !== 0) {
      throw new Error('bundle dependency-closure commit is not reachable from release HEAD');
    }
  }
}

function recursiveFiles(root: string): string[] {
  const files: string[] = [];
  function visit(directory: string, prefix: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      const absolute = join(directory, entry.name);
      const stat = lstatSync(absolute);
      if (stat.isSymbolicLink()) throw new Error(`archive input contains symlink: ${path}`);
      if (stat.isDirectory()) visit(absolute, path);
      else if (stat.isFile()) files.push(path);
      else throw new Error(`archive input contains non-file entry: ${path}`);
    }
  }
  visit(root, '');
  return files.sort(utf8Compare);
}

function writeAsciiField(header: Buffer, offset: number, length: number, value: string): void {
  const bytes = Buffer.from(value, 'ascii');
  if (bytes.length > length) throw new Error(`tar field is too long: ${value}`);
  bytes.copy(header, offset);
}

function tarOctal(value: number, length: number): string {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error('invalid tar integer');
  const octal = value.toString(8);
  if (octal.length > length - 1) throw new Error('tar integer exceeds field width');
  return `${octal.padStart(length - 1, '0')}\0`;
}

function splitTarPath(path: string): { name: string; prefix: string } {
  if (Buffer.byteLength(path, 'utf8') <= 100) return { name: path, prefix: '' };
  const slashes = [...path.matchAll(/\//g)].map((match) => match.index);
  for (const index of slashes.reverse()) {
    const prefix = path.slice(0, index);
    const name = path.slice(index + 1);
    if (Buffer.byteLength(prefix, 'utf8') <= 155
      && Buffer.byteLength(name, 'utf8') <= 100) {
      return { name, prefix };
    }
  }
  throw new Error(`tar path exceeds ustar limits: ${path}`);
}

function tarHeader(path: string, size: number): Buffer {
  const { name, prefix } = splitTarPath(path);
  const header = Buffer.alloc(TAR_BLOCK_SIZE);
  writeAsciiField(header, 0, 100, name);
  writeAsciiField(header, 100, 8, tarOctal(0o644, 8));
  writeAsciiField(header, 108, 8, tarOctal(0, 8));
  writeAsciiField(header, 116, 8, tarOctal(0, 8));
  writeAsciiField(header, 124, 12, tarOctal(size, 12));
  writeAsciiField(header, 136, 12, tarOctal(0, 12));
  header.fill(0x20, 148, 156);
  header[156] = 0x30;
  writeAsciiField(header, 257, 6, 'ustar\0');
  writeAsciiField(header, 263, 2, '00');
  writeAsciiField(header, 329, 8, tarOctal(0, 8));
  writeAsciiField(header, 337, 8, tarOctal(0, 8));
  writeAsciiField(header, 345, 155, prefix);
  const checksum = header.reduce((sum, byte) => sum + byte, 0);
  writeAsciiField(header, 148, 8, `${checksum.toString(8).padStart(6, '0')}\0 `);
  return header;
}

function deterministicTarEntries(entries: TarEntry[]): Buffer {
  const chunks: Buffer[] = [];
  for (const entry of entries) {
    chunks.push(tarHeader(entry.path, entry.bytes.length), entry.bytes);
    const padding = (TAR_BLOCK_SIZE - (entry.bytes.length % TAR_BLOCK_SIZE)) % TAR_BLOCK_SIZE;
    if (padding) chunks.push(Buffer.alloc(padding));
  }
  chunks.push(Buffer.alloc(TAR_BLOCK_SIZE * 2));
  return Buffer.concat(chunks);
}

export function deterministicTar(bundleRoot: string): Buffer {
  return deterministicTarEntries(recursiveFiles(bundleRoot).map((relativePath) => ({
    path: `${BUNDLE_ID}/${relativePath}`,
    bytes: readFileSync(join(bundleRoot, relativePath)),
  })));
}

function parseTarOctal(field: Buffer, scope: string): number {
  const text = field.toString('ascii').replace(/\0.*$/s, '').trim();
  if (!/^[0-7]+$/.test(text)) throw new Error(`${scope} is not canonical octal`);
  const value = Number.parseInt(text, 8);
  if (!Number.isSafeInteger(value)) throw new Error(`${scope} is out of range`);
  return value;
}

function nullTerminated(field: Buffer): string {
  const zero = field.indexOf(0);
  return field.subarray(0, zero < 0 ? field.length : zero).toString('utf8');
}

export function parseDeterministicTar(bytes: Buffer): TarEntry[] {
  const entries: TarEntry[] = [];
  const seen = new Set<string>();
  let offset = 0;
  let terminators = 0;
  while (offset + TAR_BLOCK_SIZE <= bytes.length) {
    const header = bytes.subarray(offset, offset + TAR_BLOCK_SIZE);
    offset += TAR_BLOCK_SIZE;
    if (header.every((byte) => byte === 0)) {
      terminators += 1;
      if (terminators === 2) break;
      continue;
    }
    if (terminators) throw new Error('tar has data after a zero terminator block');
    const storedChecksum = parseTarOctal(header.subarray(148, 156), 'tar checksum');
    const checksumHeader = Buffer.from(header);
    checksumHeader.fill(0x20, 148, 156);
    const computedChecksum = checksumHeader.reduce((sum, byte) => sum + byte, 0);
    if (storedChecksum !== computedChecksum) throw new Error('tar header checksum mismatch');
    if (nullTerminated(header.subarray(257, 263)) !== 'ustar') {
      throw new Error('tar entry is not ustar');
    }
    if (header.subarray(263, 265).toString('ascii') !== '00') {
      throw new Error('tar entry has unsupported ustar version');
    }
    const type = header[156];
    if (type !== 0 && type !== 0x30) throw new Error('tar contains a non-regular entry');
    if (parseTarOctal(header.subarray(100, 108), 'tar mode') !== 0o644
      || parseTarOctal(header.subarray(108, 116), 'tar uid') !== 0
      || parseTarOctal(header.subarray(116, 124), 'tar gid') !== 0
      || parseTarOctal(header.subarray(136, 148), 'tar mtime') !== 0
      || parseTarOctal(header.subarray(329, 337), 'tar device major') !== 0
      || parseTarOctal(header.subarray(337, 345), 'tar device minor') !== 0) {
      throw new Error('tar entry ownership, mode, or timestamp is not normalized');
    }
    if (!header.subarray(157, 257).every((byte) => byte === 0)
      || !header.subarray(265, 329).every((byte) => byte === 0)
      || !header.subarray(500, 512).every((byte) => byte === 0)) {
      throw new Error('tar link, owner-name, group-name, or padding fields are not normalized');
    }
    const name = nullTerminated(header.subarray(0, 100));
    const prefix = nullTerminated(header.subarray(345, 500));
    const path = prefix ? `${prefix}/${name}` : name;
    if (!normalizedRepositoryPath(path)
      || !path.startsWith(`${BUNDLE_ID}/`)
      || path === `${BUNDLE_ID}/`) {
      throw new Error(`tar path is unsafe or outside ${BUNDLE_ID}: ${path}`);
    }
    if (seen.has(path)) throw new Error(`tar contains duplicate path: ${path}`);
    seen.add(path);
    const size = parseTarOctal(header.subarray(124, 136), 'tar size');
    if (offset + size > bytes.length) throw new Error(`tar entry is truncated: ${path}`);
    entries.push({ path, bytes: Buffer.from(bytes.subarray(offset, offset + size)) });
    const paddedSize = Math.ceil(size / TAR_BLOCK_SIZE) * TAR_BLOCK_SIZE;
    if (!bytes.subarray(offset + size, offset + paddedSize).every((byte) => byte === 0)) {
      throw new Error(`tar entry padding is not zeroed: ${path}`);
    }
    offset += paddedSize;
  }
  if (terminators !== 2 || offset !== bytes.length) {
    throw new Error('tar must end with exactly two zero blocks and no trailing bytes');
  }
  const paths = entries.map((entry) => entry.path);
  if (paths.length === 0
    || paths.some((path, index) => index > 0 && utf8Compare(paths[index - 1], path) >= 0)) {
    throw new Error('tar entries must be nonempty and ordered by UTF-8 path bytes');
  }
  if (!deterministicTarEntries(entries).equals(bytes)) {
    throw new Error('tar bytes are not the canonical normalized ustar encoding');
  }
  return entries;
}

function crc32(bytes: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function deterministicGzip(tar: Buffer): Buffer {
  const header = Buffer.from([0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff]);
  const blocks: Buffer[] = [];
  if (tar.length === 0) blocks.push(Buffer.from([0x01, 0x00, 0x00, 0xff, 0xff]));
  for (let offset = 0; offset < tar.length; offset += 0xffff) {
    const length = Math.min(0xffff, tar.length - offset);
    const block = Buffer.alloc(5 + length);
    block[0] = offset + length === tar.length ? 0x01 : 0x00;
    block.writeUInt16LE(length, 1);
    block.writeUInt16LE((~length) & 0xffff, 3);
    tar.copy(block, 5, offset, offset + length);
    blocks.push(block);
  }
  const trailer = Buffer.alloc(8);
  trailer.writeUInt32LE(crc32(tar), 0);
  trailer.writeUInt32LE(tar.length >>> 0, 4);
  return Buffer.concat([header, ...blocks, trailer]);
}

function assertDeterministicGzip(gzip: Buffer): Buffer {
  if (gzip.length < 10
    || gzip[0] !== 0x1f
    || gzip[1] !== 0x8b
    || gzip[2] !== 8
    || gzip[3] !== 0
    || !gzip.subarray(4, 8).every((byte) => byte === 0)
      || gzip[9] !== 255) {
    throw new Error('release archive gzip header is not normalized');
  }
  const tar = gunzipSync(gzip);
  if (!deterministicGzip(tar).equals(gzip)) {
    throw new Error('release archive does not use canonical stored-block gzip encoding');
  }
  return tar;
}

function releaseBase(version: string, bundleDigest: string): string {
  if (!RELEASE_VERSION_PATTERN.test(version)) throw new Error('release version is unsafe');
  if (!SHA256_PATTERN.test(bundleDigest)) throw new Error('bundle digest is malformed');
  return `${BUNDLE_ID}-${version}-${bundleDigest.replace('sha256:', 'sha256-')}`;
}

function releaseMetadata(
  lock: BundleLock,
  archiveFilename: string,
  archiveDigest: string,
  checksumFilename: string,
): ReleaseMetadata {
  return {
    format: RELEASE_FORMAT,
    release: {
      id: BUNDLE_ID,
      version: lock.bundle.version,
      maturity: 'structural-prerelease',
    },
    source: {
      build_commit: lock.provenance.vcs.commit,
      dependency_closure_commit: lock.provenance.vcs.commit,
      provenance_digest: lock.provenance.digest,
    },
    bundle: {
      digest: lock.bundle.digest,
      payload_digest: lock.bundle.payload_digest,
      lock_digest: lock.lock_digest,
      core_digest: lock.core.tree_digest,
      adapter_digest: lock.adapter.tree_digest,
      checker_digest: lock.checker_digest,
      adapter_lifecycle: lock.adapter.lifecycle,
    },
    asset: {
      filename: archiveFilename,
      digest: archiveDigest,
      checksum_filename: checksumFilename,
    },
  };
}

function releaseFiles(root: string): {
  archive: string;
  checksum: string;
  metadata: string;
} {
  if (!existsSync(root) || !lstatSync(root).isDirectory()) {
    throw new Error('release path is missing or not a directory');
  }
  const names = readdirSync(root).sort(utf8Compare);
  for (const name of names) {
    const stat = lstatSync(join(root, name));
    if (stat.isSymbolicLink() || !stat.isFile()) {
      throw new Error(`release contains a non-regular entry: ${name}`);
    }
  }
  const archives = names.filter((name) => name.endsWith('.tar.gz'));
  const checksums = names.filter((name) => name.endsWith('.sha256'));
  const metadata = names.filter((name) => name.endsWith('.release.json'));
  if (names.length !== 3
    || archives.length !== 1
    || checksums.length !== 1
    || metadata.length !== 1) {
    throw new Error('release must contain exactly one archive, checksum, and metadata file');
  }
  return { archive: archives[0], checksum: checksums[0], metadata: metadata[0] };
}

function parseMetadata(path: string): ReleaseMetadata {
  const raw = readFileSync(path);
  let value: unknown;
  try {
    value = JSON.parse(raw.toString('utf8')) as unknown;
  } catch (error) {
    throw new Error(`release metadata is invalid JSON: ${
      error instanceof Error ? error.message : String(error)
    }`);
  }
  if (!raw.equals(canonicalJsonBytes(value))) {
    throw new Error('release metadata is not canonical JSON plus one LF');
  }
  if (!exactKeys(value, ['format', 'release', 'source', 'bundle', 'asset'])) {
    throw new Error('release metadata top-level keys are malformed');
  }
  if (!exactKeys(value.release, ['id', 'version', 'maturity'])
    || !exactKeys(value.source, [
      'build_commit',
      'dependency_closure_commit',
      'provenance_digest',
    ])
    || !exactKeys(value.bundle, [
      'digest',
      'payload_digest',
      'lock_digest',
      'core_digest',
      'adapter_digest',
      'checker_digest',
      'adapter_lifecycle',
    ])
    || !exactKeys(value.asset, ['filename', 'digest', 'checksum_filename'])) {
    throw new Error('release metadata nested keys are malformed');
  }
  return value as unknown as ReleaseMetadata;
}

function extractEntries(entries: TarEntry[], destination: string): void {
  for (const entry of entries) {
    const output = join(destination, entry.path);
    if (!pathInside(destination, output)) throw new Error(`unsafe extraction path: ${entry.path}`);
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, entry.bytes, { flag: 'wx', mode: 0o644 });
  }
}

export function verifyLoaRelease(releasePath: string): ReleaseReport {
  const root = resolve(releasePath);
  try {
    const files = releaseFiles(root);
    const metadata = parseMetadata(join(root, files.metadata));
    if (metadata.format !== RELEASE_FORMAT
      || metadata.release.id !== BUNDLE_ID
      || metadata.release.maturity !== 'structural-prerelease') {
      throw new Error('release metadata identity or maturity is invalid');
    }
    if (!RELEASE_VERSION_PATTERN.test(metadata.release.version)) {
      throw new Error('release metadata version is unsafe');
    }
    for (const [scope, digest] of Object.entries({
      archive: metadata.asset.digest,
      bundle: metadata.bundle.digest,
      payload: metadata.bundle.payload_digest,
      lock: metadata.bundle.lock_digest,
      core: metadata.bundle.core_digest,
      adapter: metadata.bundle.adapter_digest,
      checker: metadata.bundle.checker_digest,
      provenance: metadata.source.provenance_digest,
    })) {
      if (!SHA256_PATTERN.test(digest)) {
        throw new Error(`release metadata ${scope} digest is malformed`);
      }
    }
    if (!/^[0-9a-f]{40}$|^[0-9a-f]{64}$/.test(metadata.source.build_commit)
      || !/^[0-9a-f]{40}$|^[0-9a-f]{64}$/
        .test(metadata.source.dependency_closure_commit)) {
      throw new Error('release metadata source commits are malformed');
    }
    if (metadata.asset.filename !== files.archive
      || metadata.asset.checksum_filename !== files.checksum) {
      throw new Error('release metadata asset names disagree with directory entries');
    }
    const expectedBase = releaseBase(metadata.release.version, metadata.bundle.digest);
    if (files.archive !== `${expectedBase}.tar.gz`
      || files.checksum !== `${expectedBase}.sha256`
      || files.metadata !== `${expectedBase}.release.json`) {
      throw new Error('release filenames disagree with version and bundle identity');
    }
    const archiveBytes = readFileSync(join(root, files.archive));
    const archiveDigest = sha256Digest(archiveBytes);
    if (archiveDigest !== metadata.asset.digest) {
      throw new Error('release archive digest disagrees with metadata');
    }
    const checksum = readFileSync(join(root, files.checksum), 'utf8');
    const expectedChecksum = `${archiveDigest.replace('sha256:', '')}  ${files.archive}\n`;
    if (checksum !== expectedChecksum) throw new Error('release checksum sidecar is invalid');
    const entries = parseDeterministicTar(assertDeterministicGzip(archiveBytes));
    const tempRoot = mkdtempSync(join(tmpdir(), 'aleph-loa-release-verify-'));
    try {
      extractEntries(entries, tempRoot);
      const bundleRoot = join(tempRoot, BUNDLE_ID);
      const verification = verifyBundle(bundleRoot);
      if (verification.result !== 'PASS' || !verification.summary) {
        throw new Error(`extracted bundle verification failed: ${verification.errors.join('; ')}`);
      }
      const lock = readJsonFile(join(bundleRoot, 'bundle.lock.json')) as BundleLock;
      assertReleasableLoaLock(lock, metadata.release.version);
      const comparisons: Array<[unknown, unknown, string]> = [
        [metadata.bundle.digest, lock.bundle.digest, 'bundle digest'],
        [metadata.bundle.payload_digest, lock.bundle.payload_digest, 'payload digest'],
        [metadata.bundle.lock_digest, lock.lock_digest, 'lock digest'],
        [metadata.bundle.core_digest, lock.core.tree_digest, 'Core digest'],
        [metadata.bundle.adapter_digest, lock.adapter.tree_digest, 'adapter digest'],
        [metadata.bundle.checker_digest, lock.checker_digest, 'checker digest'],
        [metadata.bundle.adapter_lifecycle, lock.adapter.lifecycle, 'adapter lifecycle'],
        [metadata.source.build_commit, lock.provenance.vcs.commit, 'build commit'],
        [metadata.source.dependency_closure_commit, lock.provenance.vcs.commit,
          'dependency-closure commit'],
        [metadata.source.provenance_digest, lock.provenance.digest, 'provenance digest'],
      ];
      for (const [actual, expected, scope] of comparisons) {
        if (actual !== expected) throw new Error(`release metadata ${scope} mismatch`);
      }
      const expectedEntries = [
        `${BUNDLE_ID}/bundle.lock.json`,
        ...lock.files.map((file) => `${BUNDLE_ID}/${file.path}`),
      ].sort(utf8Compare);
      const actualEntries = entries.map((entry) => entry.path);
      if (canonicalJsonBytes(actualEntries).compare(canonicalJsonBytes(expectedEntries)) !== 0) {
        throw new Error('release archive inventory disagrees with bundle lock');
      }
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
    return {
      result: 'PASS',
      releasePath: root,
      archivePath: join(root, files.archive),
      checksumPath: join(root, files.checksum),
      metadataPath: join(root, files.metadata),
      bundleDigest: metadata.bundle.digest,
      archiveDigest,
      errors: [],
    };
  } catch (error) {
    return {
      result: 'FAIL',
      releasePath: root,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}

export function packageLoaRelease(options: PackageOptions): ReleaseReport {
  const root = resolve(options.root);
  const output = resolve(options.output);
  let tempRoot = '';
  let stageRoot = '';
  let destination = '';
  try {
    if (pathInside(root, output)) {
      throw new Error('release output must be outside the source repository');
    }
    if (!RELEASE_VERSION_PATTERN.test(options.version)) {
      throw new Error('release version is unsafe');
    }
    const head = assertCleanSource(root);
    const runtimeProjection = checkRuntimeProjection(root);
    if (runtimeProjection.result !== 'PASS') {
      throw new Error(
        `runtime projection differs from the canonical TypeScript emit: ${runtimeProjection.errors.join('; ')}`,
      );
    }
    tempRoot = mkdtempSync(join(tmpdir(), 'aleph-loa-release-package-'));
    const bundleOutput = join(tempRoot, 'bundles');
    const assembly = assembleBundles(root, bundleOutput);
    if (assembly.result !== 'PASS') {
      throw new Error(`bundle assembly failed: ${assembly.errors.join('; ')}`);
    }
    const loaRoot = join(bundleOutput, BUNDLE_ID);
    const hermesRoot = join(bundleOutput, 'aleph-for-hermes');
    const releaseSet = verifyBundleSet(
      [loaRoot, hermesRoot],
      [BUNDLE_ID, 'aleph-for-hermes'],
    );
    if (releaseSet.result !== 'PASS') {
      throw new Error(`host-bundle release-set verification failed: ${releaseSet.errors.join('; ')}`);
    }
    const loaReport = releaseSet.bundles[0];
    if (loaReport.result !== 'PASS'
      || !loaReport.summary
      || loaReport.summary.preflight !== 'READY') {
      throw new Error('aleph-for-loa did not verify READY');
    }
    const lock = readJsonFile(join(loaRoot, 'bundle.lock.json')) as BundleLock;
    assertReleasableLoaLock(lock, options.version, head, root);
    if (assertCleanSource(root) !== head) {
      throw new Error('release source HEAD changed during packaging');
    }
    const base = releaseBase(options.version, lock.bundle.digest);
    destination = join(output, base);
    if (existsSync(destination)) throw new Error(`release already exists: ${destination}`);
    mkdirSync(output, { recursive: true });
    stageRoot = mkdtempSync(join(output, '.aleph-loa-release-stage-'));
    const archiveFilename = `${base}.tar.gz`;
    const checksumFilename = `${base}.sha256`;
    const metadataFilename = `${base}.release.json`;
    const archive = deterministicGzip(deterministicTar(loaRoot));
    const archiveDigest = sha256Digest(archive);
    writeFileSync(join(stageRoot, archiveFilename), archive, { flag: 'wx' });
    writeFileSync(
      join(stageRoot, checksumFilename),
      `${archiveDigest.replace('sha256:', '')}  ${archiveFilename}\n`,
      { flag: 'wx' },
    );
    const metadata = releaseMetadata(
      lock,
      archiveFilename,
      archiveDigest,
      checksumFilename,
    );
    writeFileSync(
      join(stageRoot, metadataFilename),
      canonicalJsonBytes(metadata),
      { flag: 'wx' },
    );
    const stagedVerification = verifyLoaRelease(stageRoot);
    if (stagedVerification.result !== 'PASS') {
      throw new Error(`staged release verification failed: ${stagedVerification.errors.join('; ')}`);
    }
    renameSync(stageRoot, destination);
    stageRoot = '';
    const finalVerification = verifyLoaRelease(destination);
    if (finalVerification.result !== 'PASS') {
      throw new Error(`final release verification failed: ${finalVerification.errors.join('; ')}`);
    }
    return finalVerification;
  } catch (error) {
    return {
      result: 'FAIL',
      releasePath: destination || output,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  } finally {
    if (stageRoot) rmSync(stageRoot, { recursive: true, force: true });
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
  }
}

function parseCli(args: string[]): CliOptions {
  const options: CliOptions = {
    command: '',
    root: REPO_ROOT,
    output: '',
    version: '',
    release: '',
    json: false,
    help: false,
    error: '',
  };
  const [command, ...rest] = args;
  if (command === 'package' || command === 'verify') options.command = command;
  else if (command === '--help' || command === '-h' || command === undefined) {
    options.help = true;
  } else options.error = `unknown command "${command}"`;
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index];
    if (arg === '--json') options.json = true;
    else if (arg === '--help' || arg === '-h') options.help = true;
    else if (['--root', '--output', '--version', '--release'].includes(arg)) {
      const value = rest[index + 1];
      if (!value) options.error = `${arg} requires a value`;
      else {
        if (arg === '--root') options.root = resolve(value);
        else if (arg === '--output') options.output = resolve(value);
        else if (arg === '--version') options.version = value;
        else options.release = resolve(value);
        index += 1;
      }
    } else options.error = `unknown argument "${arg}"`;
  }
  if (options.command === 'package' && (!options.output || !options.version)) {
    options.error = 'package requires --output and --version';
  }
  if (options.command === 'verify' && !options.release) {
    options.error = 'verify requires --release';
  }
  return options;
}

function main(): void {
  const options = parseCli(process.argv.slice(2));
  if (options.help) {
    console.log(
      'Usage:\n'
      + '  node packaging/package-loa-release.ts package '
      + '--output <dir> --version <version> [--root <repo>] [--json]\n'
      + '  node packaging/package-loa-release.ts verify --release <dir> [--json]',
    );
    return;
  }
  if (options.error || !options.command) {
    console.error(options.error || 'package or verify command is required');
    process.exitCode = 2;
    return;
  }
  const report = options.command === 'package'
    ? packageLoaRelease({
        root: options.root,
        output: options.output,
        version: options.version,
      })
    : verifyLoaRelease(options.release);
  if (options.json) console.log(JSON.stringify(report, null, 2));
  else {
    if (report.result === 'PASS') {
      console.log(`VERIFIED RELEASE ${report.releasePath}`);
      console.log(`DIGEST bundle ${report.bundleDigest}`);
      console.log(`DIGEST archive ${report.archiveDigest}`);
    }
    for (const error of report.errors) console.error(`FAIL ${error}`);
    console.log(`RESULT: ${report.result}`);
  }
  process.exitCode = report.result === 'PASS' ? 0 : 1;
}

if (resolve(process.argv[1] || '') === SCRIPT_PATH) main();

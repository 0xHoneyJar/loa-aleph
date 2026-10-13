import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { closeSync, existsSync, fsyncSync, lstatSync, mkdirSync, openSync, readFileSync,
  readdirSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

export const FAULTS = ['derived', 'commit-intent', 'writer-prepared',
  'effect:ledgers/relations.md', 'effect:ledgers/representation-uses.md', 'effect:run-log.md',
  'canonical-bytes', 'chain', 'checkpoint', 'journal-committed', 'consumed'] as const;
export const EFFECTS = ['ledgers/relations.md', 'ledgers/representation-uses.md', 'run-log.md'];
export const LOCKS = ['control/orchestration/lock', 'control/ledger-writer.lock'] as const;
export const OPERATION = 's4.close-C1';
export const MAX_SECONDS = 86400;
export const NODE_EXECUTABLE = '/home/eileenspectremoon/.nvm/versions/node/v20.20.2/bin/node';
export const NODE_DIGEST = 'sha256:6295488653f0d93b0a157841746fef7e72cc4328cfb60c4bbe0ca2668a836ffd';
export const PRODUCT = {
  commit: '0de4d759b5e0de4e465ade72bf325c04d4414647',
  tree: '9274245373e2fcfd659b4ef5931d5d0fdd8808ae',
  core: 'sha256:8c1f68e6359a9ea1b3eb104af854c2120a6da0ba2257a8cd2acf4a0d0e84a938',
  adapter: 'sha256:4f0fd6fc0db259e6c0ba00c1d1df26fd4d5bf4961a8577b8bf621044aa5871d9',
  checker: 'sha256:30041fc0b1977c7561e8f9dad1f6ee794bc255b34e517cfdee71d05c9879a1c8',
  payload: 'sha256:e8a542d3b5a3b0498225f09cf9ee528e0234fee63bfd973930d79b2e1da4fd35',
} as const;
export type Verdict = 'NOT_RUN' | 'FAIL' | 'TIMEOUT' | 'INTERRUPTED' | 'PASS' | 'RUNNING';
export type Json = Record<string, any>;
export const digest = (bytes: Buffer | string): string => `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
export const bytes = (value: unknown): Buffer => Buffer.from(JSON.stringify(value) + '\n');
export function json(path: string): Json { return JSON.parse(readFileSync(path, 'utf8')); }
export function syncDirectory(path: string): void {
  const fd = openSync(path, 'r'); try { fsyncSync(fd); } finally { closeSync(fd); }
}
/** Exclusive publication: neither retries nor later observations replace receipts. */
export function publish(path: string, value: unknown): void {
  mkdirSync(dirname(path), { recursive: true });
  const fd = openSync(path, 'wx', 0o400);
  try { writeFileSync(fd, bytes(value)); fsyncSync(fd); } finally { closeSync(fd); }
  syncDirectory(dirname(path));
}
export function safeRelative(path: string): void {
  assert(path && !isAbsolute(path) && !path.includes('\\')
    && path.split('/').every(p => p && p !== '.' && p !== '..'
      && p !== 'calibration' && !p.includes('closed-reference')), `EXCLUDED_OR_UNSAFE_PATH ${path}`);
}
export function inside(root: string, path: string): string {
  const rel = relative(root, path); safeRelative(rel); return rel;
}
export function durableRoot(path: string): string {
  assert(isAbsolute(path) && resolve(path) === path, 'ABSOLUTE_FINAL_PATH_REQUIRED');
  assert(!['/tmp', '/var/tmp', '/run', '/dev/shm'].some(p => path === p || path.startsWith(p + '/')),
    'TEMPORARY_FIXTURE_FORBIDDEN');
  assert(realpathSync(dirname(path)) === dirname(path), 'FIXTURE_PARENT_SYMLINK');
  assert(!existsSync(path), 'CASE_ALREADY_EXISTS_NO_RETRY');
  return path;
}
export interface FileRecord { digest: string; mode: number; size: number }
export type Inventory = Record<string, FileRecord>;
export function withoutLeases(files: Inventory): Inventory {
  return Object.fromEntries(Object.entries(files).filter(([path]) => !(LOCKS as readonly string[]).includes(path)));
}
/** Archive bytes as content-addressed evidence, never as a relocated executable run. */
export function capture(root: string, store?: string): Inventory {
  const result: Inventory = {};
  function visit(directory: string): void {
    for (const name of readdirSync(directory).sort()) {
      const path = join(directory, name), rel = relative(root, path).split(sep).join('/');
      safeRelative(rel);
      const stat = lstatSync(path);
      assert(!stat.isSymbolicLink(), `EVIDENCE_SYMLINK ${path}`);
      if (stat.isDirectory()) visit(path);
      else {
        assert(stat.isFile(), `EVIDENCE_NOT_REGULAR ${path}`);
        const data = readFileSync(path), hash = digest(data), target = store && join(store, hash.slice(7));
        if (target && !existsSync(target)) {
          mkdirSync(store, { recursive: true });
          const fd = openSync(target, 'wx', 0o400);
          try { writeFileSync(fd, data); fsyncSync(fd); } finally { closeSync(fd); }
        } else if (target) assert.equal(digest(readFileSync(target)), hash, 'EVIDENCE_OBJECT_CHANGED');
        result[rel] = { digest: hash, mode: stat.mode & 0o7777, size: data.length };
      }
    }
  }
  visit(root); if (store) syncDirectory(store); return result;
}
export function object(store: string, entry: FileRecord): Buffer {
  assert(/^sha256:[a-f0-9]{64}$/.test(entry.digest), 'OBJECT_DIGEST');
  const path = join(store, entry.digest.slice(7)), st = lstatSync(path);
  assert(st.isFile() && !st.isSymbolicLink() && (st.mode & 0o222) === 0, 'OBJECT_CUSTODY');
  const data = readFileSync(path);
  assert.equal(data.length, entry.size); assert.equal(digest(data), entry.digest); return data;
}

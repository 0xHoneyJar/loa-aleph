import { constants, closeSync, cpSync, fstatSync, lstatSync, mkdirSync, openSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { isAbsolute, join, resolve, sep } from 'node:path';
import { canonicalBytes, digest, relativePath, requireFact, same, utf8Compare, validateRecord } from './records.ts';
import type { ArtifactRef, Data } from './records.ts';

export function checkedRoot(root: string): string {
  requireFact(isAbsolute(root) && resolve(root) === root, 'UNSAFE_PATH', 'root must be normalized absolute path');
  let current: string = sep;
  for (const part of root.split(sep).filter(Boolean)) {
    current = join(current, part);
    const stat = lstatSync(current);
    requireFact(stat.isDirectory() && !stat.isSymbolicLink(), 'UNSAFE_PATH', `non-directory/link ${current}`);
  }
  return root;
}
export function exactFile(root: string, path: string): Buffer {
  checkedRoot(root); relativePath(path);
  const parts = path.split('/');
  let parent = root;
  for (const part of parts.slice(0, -1)) {
    parent = join(parent, part);
    requireFact(lstatSync(parent).isDirectory() && !lstatSync(parent).isSymbolicLink(), 'UNSAFE_PATH', path);
  }
  const file = join(root, path), before = lstatSync(file, { bigint: true });
  requireFact(before.isFile() && before.nlink === 1n, 'UNSAFE_PATH', `non-file or hardlink ${path}`);
  const fd = openSync(file, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const opened = fstatSync(fd, { bigint: true });
    requireFact(opened.ino === before.ino && opened.dev === before.dev, 'UNSAFE_PATH', `replaced file ${path}`);
    const bytes = readFileSync(fd), after = fstatSync(fd, { bigint: true });
    requireFact(after.nlink === 1n && after.size === before.size && after.mtimeNs === before.mtimeNs
      && after.ctimeNs === before.ctimeNs && BigInt(bytes.length) === after.size, 'UNSAFE_PATH', `unstable file ${path}`);
    return bytes;
  } finally { closeSync(fd); }
}
export function inventory(root: string): Data[] {
  checkedRoot(root);
  const entries: Data[] = [], names = new Set<string>(), inodes = new Set<string>();
  function visit(directory: string, prefix: string): void {
    const rawNames = readdirSync(directory, { encoding: 'buffer' });
    const children = rawNames.map((name) => new TextDecoder('utf-8', { fatal: true }).decode(name)).sort(utf8Compare);
    for (const name of children) {
      const path = prefix ? `${prefix}/${name}` : name;
      relativePath(path);
      const alias = path.normalize('NFC').toLowerCase();
      requireFact(!names.has(alias), 'UNSAFE_PATH', `duplicate/case alias ${path}`); names.add(alias);
      const stat = lstatSync(join(directory, name));
      requireFact(stat.isDirectory() || stat.isFile(), 'UNSAFE_PATH', `link/socket/device ${path}`);
      const entry: Data = { path, type: stat.isDirectory() ? 'directory' : 'file',
        mode: `0${(stat.mode & 0o777).toString(8).padStart(3, '0')}`, byte_length: '0', sha256: null };
      requireFact((stat.mode & 0o7000) === 0, 'UNSAFE_PATH', `special mode ${path}`);
      if (stat.isFile()) {
        const inode = `${stat.dev}:${stat.ino}`;
        requireFact(stat.nlink === 1 && !inodes.has(inode), 'UNSAFE_PATH', `hardlink alias ${path}`); inodes.add(inode);
        const bytes = exactFile(root, path);
        entry.byte_length = String(bytes.length); entry.sha256 = digest(bytes);
      }
      entries.push(entry);
      if (stat.isDirectory()) visit(join(directory, name), path);
    }
  }
  visit(root, '');
  return entries.sort((a, b) => utf8Compare(a.path, b.path));
}
export function inventoryRecord(root: string, replayId: string): Data {
  const body = { format: 'src001-replay-inventory/v1', replay_id: replayId, root: 'result/', entries: inventory(root) };
  return { ...body, inventory_digest: digest(canonicalBytes(body)) };
}
export function verifyInventory(record: Data, root: string): void {
  validateRecord('inventory', record);
  requireFact(same(record, inventoryRecord(root, record.replay_id)), 'FAIL_FREEZE_MUTATION', 'complete inventory differs');
}
export interface LockedStore { identity: string; root: string; lock: { format: string; entries: Data[] } }
export class Stores {
  private stores = new Map<string, LockedStore>();
  // The expected lock identity comes from trusted custody, not an untrusted record.
  register(root: string, lock: LockedStore['lock'], expectedIdentity: string): void {
    requireFact(lock.format === 'src001-store-lock/v1' && digest(canonicalBytes(lock)) === expectedIdentity,
      'UNRESOLVED_STORE', 'store lock identity mismatch');
    requireFact(same(inventory(root), lock.entries), 'UNRESOLVED_STORE', 'store bytes differ from lock');
    const existing = this.stores.get(expectedIdentity);
    requireFact(!existing || existing.root === root, 'UNRESOLVED_STORE', 'ambiguous physical store alias');
    this.stores.set(expectedIdentity, { identity: expectedIdentity, root, lock: structuredClone(lock) });
  }
  sealSynthetic(root: string): string {
    requireFact(root.split('/').some((p) => p.startsWith('SYNTHETIC-')), 'SYNTHETIC_ONLY', 'synthetic store path required');
    const lock = { format: 'src001-store-lock/v1', entries: inventory(root) };
    const identity = digest(canonicalBytes(lock));
    this.register(root, lock, identity); return identity;
  }
  ref(store: string, path: string): ArtifactRef {
    relativePath(path);
    const entry = this.stores.get(store)?.lock.entries.find((e) => e.path === path && e.type === 'file');
    requireFact(entry, 'UNRESOLVED_STORE', `unresolved file ${store}/${path}`);
    return { store, path, byte_length: entry.byte_length, sha256: entry.sha256 };
  }
  read(ref: ArtifactRef): Buffer {
    validateRecord('artifact-ref', ref);
    const store = this.stores.get(ref.store);
    requireFact(store, 'UNRESOLVED_STORE', ref.store);
    requireFact(same(inventory(store.root), store.lock.entries), 'ARTIFACT_MISMATCH', 'locked store changed');
    requireFact(same(this.ref(ref.store, ref.path), ref), 'ARTIFACT_MISMATCH', ref.path);
    return exactFile(store.root, ref.path);
  }
  byDigest(hash: string): ArtifactRef[] {
    return [...this.stores.values()].flatMap((store) => store.lock.entries
      .filter((entry) => entry.type === 'file' && entry.sha256 === hash)
      .map((entry) => this.ref(store.identity, entry.path)));
  }
  copySyntheticStores(destination: string): Stores {
    requireFact(destination.split('/').some((p) => p.startsWith('SYNTHETIC-'))
      && [...this.stores.values()].every((s) => s.root.split('/').some((p) => p.startsWith('SYNTHETIC-'))),
    'SYNTHETIC_ONLY', 'no real input or evidence export');
    const copied = new Stores();
    mkdirSync(destination, { recursive: true, mode: 0o700 });
    for (const store of this.stores.values()) {
      requireFact(same(inventory(store.root), store.lock.entries), 'ARTIFACT_MISMATCH', 'store changed before snapshot');
      const target = join(destination, store.identity.slice(7));
      cpSync(store.root, target, { recursive: true, errorOnExist: true, force: false });
      copied.register(target, store.lock, store.identity);
    }
    return copied;
  }
}
export function writeOnce(path: string, bytes: Buffer): void {
  const fd = openSync(path, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600);
  try { writeFileSync(fd, bytes); } finally { closeSync(fd); }
}

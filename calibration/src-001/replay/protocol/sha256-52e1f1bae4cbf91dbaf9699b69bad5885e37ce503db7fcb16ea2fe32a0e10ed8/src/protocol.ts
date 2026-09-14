import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { digest, parseRecord, requireFact, same } from './records.ts';
import { exactFile, inventory } from './storage.ts';

export const PROTOCOL_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const REPOSITORY_ROOT = resolve(PROTOCOL_ROOT, '../../../../..');
export function verifyProtocolLock(root = PROTOCOL_ROOT, repositoryRoot = REPOSITORY_ROOT): void {
  const lock = parseRecord('protocol-lock',exactFile(root,'protocol-lock.json'));
  requireFact(same(lock.files,inventory(root).filter((entry)=>entry.path!=='protocol-lock.json')),
    'PROTOCOL_LOCK_MISMATCH','protocol source/schema/document inventory changed');
  for(const imported of lock.imported_contracts) {
    const raw=exactFile(repositoryRoot,imported.path);
    requireFact(digest(raw)===imported.sha256 && String(raw.length)===imported.byte_length,
      'PROTOCOL_LOCK_MISMATCH',`imported Core contract changed: ${imported.path}`);
  }
}

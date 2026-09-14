import { inflateRawSync } from 'node:zlib';
import { digest, relativePath, requireFact } from './records.ts';
import type { Data } from './records.ts';
import { CONTAINER_PINS } from './inputs-release.ts';

export function crc32(bytes: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
// Bounded synthetic ZIP exercise only. This does not export retained replay inputs.
export function syntheticArchiveMembers(replayId: string, archive: Buffer, selected: Data[]): Map<string, Buffer> {
  requireFact(replayId.startsWith('SYNTHETIC-') && digest(archive) !== CONTAINER_PINS.archive.sha256,
    'SYNTHETIC_ONLY', 'real retained archive processing is unavailable');
  requireFact(archive.length >= 22, 'FAIL_INPUT_PIN', 'truncated ZIP');
  const end = archive.length - 22;
  requireFact(archive.readUInt32LE(end) === 0x06054b50 && archive.readUInt16LE(end + 20) === 0
    && archive.readUInt16LE(end + 4) === 0 && archive.readUInt16LE(end + 6) === 0,
  'FAIL_INPUT_PIN', 'only single-disk, comment-free synthetic ZIP supported');
  const count = archive.readUInt16LE(end + 10), centralSize = archive.readUInt32LE(end + 12), centralOffset = archive.readUInt32LE(end + 16);
  requireFact(count === archive.readUInt16LE(end + 8) && count < 65535 && centralOffset + centralSize === end,
    'FAIL_INPUT_PIN', 'ZIP central directory identity');
  const names = new Set<string>(), intervals: [number,number][] = [], members = new Map<string, Data>();
  let cursor = centralOffset;
  for (let index = 0; index < count; index++) {
    requireFact(cursor + 46 <= end && archive.readUInt32LE(cursor) === 0x02014b50, 'FAIL_INPUT_PIN', 'invalid central member');
    const flags = archive.readUInt16LE(cursor + 8), method = archive.readUInt16LE(cursor + 10);
    const crc = archive.readUInt32LE(cursor + 16), compressed = archive.readUInt32LE(cursor + 20), size = archive.readUInt32LE(cursor + 24);
    const nameLength = archive.readUInt16LE(cursor + 28), extra = archive.readUInt16LE(cursor + 30), comment = archive.readUInt16LE(cursor + 32);
    const mode = archive.readUInt32LE(cursor + 38) >>> 16, offset = archive.readUInt32LE(cursor + 42);
    requireFact(cursor + 46 + nameLength + extra + comment <= end && (flags & ~0x800) === 0 && [0,8].includes(method)
      && extra === 0 && comment === 0 && ((mode & 0xf000) === 0 || (mode & 0xf000) === 0x8000),
    'FAIL_INPUT_PIN', 'unsupported/encrypted/link/ambiguous ZIP member');
    const nameBytes = archive.subarray(cursor + 46,cursor + 46 + nameLength);
    const name = new TextDecoder('utf-8',{fatal:true}).decode(nameBytes);
    relativePath(name);
    requireFact(!names.has(name.toLowerCase()),'FAIL_INPUT_PIN','duplicate/alias ZIP member'); names.add(name.toLowerCase());
    requireFact(offset + 30 <= centralOffset && archive.readUInt32LE(offset) === 0x04034b50
      && archive.readUInt16LE(offset + 6) === flags && archive.readUInt16LE(offset + 8) === method
      && archive.readUInt32LE(offset + 14) === crc && archive.readUInt32LE(offset + 18) === compressed
      && archive.readUInt32LE(offset + 22) === size && archive.readUInt16LE(offset + 26) === nameLength
      && archive.readUInt16LE(offset + 28) === 0 && archive.subarray(offset + 30,offset + 30 + nameLength).equals(nameBytes),
    'FAIL_INPUT_PIN','local/central header disagreement');
    const start = offset + 30 + nameLength, finish = start + compressed;
    requireFact(finish <= centralOffset && intervals.every(([a,b]) => finish <= a || offset >= b),
      'FAIL_INPUT_PIN','overlapping/out-of-range member');
    intervals.push([offset,finish]); members.set(name,{start,finish,size,crc,method});
    cursor += 46 + nameLength;
  }
  requireFact(cursor === end && new Set(selected.map((s) => s.path)).size === selected.length, 'FAIL_INPUT_PIN','member selection ambiguity');
  const result = new Map<string,Buffer>();
  for (const pin of selected) {
    relativePath(pin.path);
    const member = members.get(pin.path);
    requireFact(member && String(member.size) === pin.byte_length && member.size <= 16 * 1024 * 1024,
      'FAIL_INPUT_PIN','missing/oversized selected synthetic member');
    const compressed = archive.subarray(member.start,member.finish);
    const bytes = member.method === 0 ? Buffer.from(compressed) : inflateRawSync(compressed,{maxOutputLength:Math.max(1,member.size)});
    requireFact(bytes.length === member.size && crc32(bytes) === member.crc && digest(bytes) === pin.sha256,
      'FAIL_INPUT_PIN','selected raw bytes mismatch');
    result.set(pin.path,bytes);
  }
  return result;
}

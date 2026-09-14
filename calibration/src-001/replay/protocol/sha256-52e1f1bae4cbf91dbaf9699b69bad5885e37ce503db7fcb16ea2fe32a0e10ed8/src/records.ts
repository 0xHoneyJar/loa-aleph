import { readFileSync } from 'node:fs';
import { canonicalJsonBytes, sha256Digest, utf8Compare } from '../../../../../../scripts/lib/bundle-format.ts';
import { parseStrictJson } from '../../../../../../scripts/lib/worker-return-contract.ts';

export { canonicalJsonBytes as canonicalBytes, sha256Digest as digest, utf8Compare, parseStrictJson };
// Schema-driven records enter through validateRecord; no value is trusted by a cast.
export type Data = Record<string, any>;
export interface ArtifactRef { store: string; path: string; byte_length: string; sha256: string }
export class Refusal extends Error {
  token: string;
  detail: string;
  constructor(token: string, detail: string) { super(`${token}: ${detail}`); this.token = token; this.detail = detail; }
}
export function requireFact(condition: unknown, token: string, detail: string): asserts condition {
  if (!condition) throw new Refusal(token, detail);
}
export function same(a: unknown, b: unknown): boolean {
  return canonicalJsonBytes(a).equals(canonicalJsonBytes(b));
}
export function relativePath(path: unknown): asserts path is string {
  requireFact(typeof path === 'string' && path.length > 0 && path.normalize('NFC') === path
    && !/[\\:%\x00-\x1f\x7f]/u.test(path)
    && path.split('/').every((part) => part && part !== '.' && part !== '..'
      && !/[ .]$/u.test(part) && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/iu.test(part)),
  'UNSAFE_PATH', String(path));
}
export function utc(value: string): void {
  requireFact(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/u.test(value)
    && Number.isFinite(Date.parse(value))
    && new Date(value).toISOString() === value.replace(/(?<=\d)Z$/u, '.000Z').replace(/(\.\d{3})\.000Z$/u, '$1Z'),
  'SCHEMA', `invalid UTC instant ${value}`);
}
const schemaBytes = readFileSync(new URL('../schemas/records.schema.json', import.meta.url));
export const SCHEMA_DIGEST = sha256Digest(schemaBytes);
export const schema = JSON.parse(schemaBytes.toString('utf8')) as Data;
const definitions = schema.$defs as Record<string, Data>;
export const recordNames = Object.keys(definitions).filter((key) => definitions[key].properties?.format);

function validate(value: any, rule: Data, path: string): void {
  if (rule.$ref) {
    requireFact(rule.$ref.startsWith('#/$defs/') && definitions[rule.$ref.slice(8)], 'SCHEMA', 'unresolved schema');
    return validate(value, definitions[rule.$ref.slice(8)], path);
  }
  if (rule.anyOf || rule.oneOf) {
    const alternatives = rule.anyOf || rule.oneOf;
    const passing = alternatives.filter((r: Data) => { try { validate(value, r, path); return true; } catch { return false; } });
    requireFact(rule.oneOf ? passing.length === 1 : passing.length > 0, 'SCHEMA', `${path}: alternative mismatch`);
    return;
  }
  if ('const' in rule) requireFact(same(value, rule.const), 'SCHEMA', `${path}: const`);
  if (rule.enum) requireFact(rule.enum.some((v: unknown) => same(value, v)), 'SCHEMA', `${path}: enum`);
  if (rule.type === 'null') requireFact(value === null, 'SCHEMA', `${path}: null`);
  if (rule.type === 'boolean') requireFact(typeof value === 'boolean', 'SCHEMA', `${path}: boolean`);
  if (rule.type === 'string') {
    requireFact(typeof value === 'string', 'SCHEMA', `${path}: string`);
    if (rule.minLength) requireFact(value.trim().length >= rule.minLength, 'SCHEMA', `${path}: empty`);
    if (rule.pattern) requireFact(new RegExp(rule.pattern, 'u').test(value), 'SCHEMA', `${path}: pattern`);
    if (rule.format === 'relative-path') relativePath(value);
    if (rule.format === 'absolute-root') { requireFact(value.startsWith('/'), 'SCHEMA', `${path}: absolute root`); relativePath(value.slice(1)); }
    if (rule.format === 'utc') utc(value);
  }
  if (rule.type === 'array') {
    requireFact(Array.isArray(value) && value.length >= (rule.minItems || 0), 'SCHEMA', `${path}: array/minItems`);
    if (rule.uniqueItems) requireFact(new Set(value.map((v: unknown) => canonicalJsonBytes(v).toString())).size === value.length,
      'SCHEMA', `${path}: duplicate item`);
    value.forEach((v: unknown, i: number) => validate(v, rule.items, `${path}[${i}]`));
  }
  if (rule.type === 'object') {
    requireFact(value && typeof value === 'object' && !Array.isArray(value), 'SCHEMA', `${path}: object`);
    requireFact(rule.additionalProperties === false, 'SCHEMA', `${path}: open schema forbidden`);
    requireFact(same(Object.keys(value).sort(), [...rule.required].sort()), 'SCHEMA', `${path}: unknown/missing keys`);
    for (const key of rule.required) validate(value[key], rule.properties[key], `${path}.${key}`);
  }
}
export function validateRecord(name: string, value: unknown): Data {
  requireFact(!!definitions[name], 'SCHEMA', `unknown record ${name}`);
  canonicalJsonBytes(value); // Also rejects numbers, undefined, invalid Unicode.
  validate(value, definitions[name], '$');
  return value as Data;
}
export function parseRecord(name: string, bytes: Buffer): Data {
  const value = parseStrictJson(bytes);
  validateRecord(name, value);
  requireFact(canonicalJsonBytes(value).equals(bytes), 'SCHEMA', 'record is not exact canonical JSON plus LF');
  return value as Data;
}
export function artifactRefs(value: unknown): ArtifactRef[] {
  if (!value || typeof value !== 'object') return [];
  if (!Array.isArray(value) && same(Object.keys(value).sort(), ['byte_length', 'path', 'sha256', 'store'])) {
    validateRecord('artifact-ref', value);
    return [value as ArtifactRef];
  }
  return Object.values(value).flatMap(artifactRefs);
}
export const NON_CLAIMS = [
  'No cognitive blindness or provider training exclusion is established.',
  'No semantic truth, semantic independence, recall, acceptance or sanction is established.',
  'Recorded mechanical evidence is conditional on trusted recorder and isolation evidence.',
];
export const PROPOSITIONS: Record<string, string> = {
  R01: 'Approved input identities, roles, descriptor bindings and recorded scope match.',
  R02: 'Recorded canonical checkout, A/B reproduction, lock, package and runtime facts agree.',
  R03: 'Recorded accessible inventory, mounts, channels and denied probes close over the approved environment.',
  R04: 'Recorded delivered bytes, role allowlists, origin graph and context receipts agree.',
  R05: 'Declared mode, execution class, actor/pass and production-effect evidence are consistent.',
  R06: 'Exact snapshot inventory, detached freeze, indexes, quiescence and causal cut agree.',
  R07: 'Recorded grant/open follow verified freeze, comparator access is read-only and inventory is unchanged.',
  R08: 'Side-local evidence and anchors reopen with legal mapping structure and exact comparison bindings.',
  R09: 'Separate report classes preserve evidence, incompleteness, findings and all indeterminate counts.',
};
export interface CheckResult { check_id: string; result: 'PASS' | 'FAIL' | 'BLOCKED'; token: string; proposition: string; evidence: string[]; non_claims: string[] }
export function check(id: string, action: () => void): CheckResult {
  try {
    action();
    return { check_id: id, result: 'PASS', token: `${id}_MECHANICAL_PASS`, proposition: PROPOSITIONS[id], evidence: [], non_claims: NON_CLAIMS };
  } catch (error) {
    const token = error instanceof Refusal ? error.token : 'INVALID_EVIDENCE';
    return { check_id: id, result: token.startsWith('BLOCKED_') ? 'BLOCKED' : 'FAIL', token,
      proposition: PROPOSITIONS[id], evidence: [error instanceof Error ? error.message : String(error)], non_claims: NON_CLAIMS };
  }
}

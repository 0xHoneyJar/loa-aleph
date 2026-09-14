import { materialFragmentsHash, parseSuppliedRepresentation, prepareRepresentationCapture } from '../../../../../../scripts/lib/source-representation.ts';
import { resealBundleLock, gitCommitObjectId, gitCommitTree } from '../../../../../../scripts/lib/bundle-format.ts';
import type { BundleLock } from '../../../../../../scripts/lib/bundle-format.ts';
import { artifactRefs, canonicalBytes, digest, parseStrictJson, relativePath, requireFact, same, validateRecord } from './records.ts';
import type { Data } from './records.ts';
import type { Stores } from './storage.ts';

export const CANONICAL_BASE = { repository: '0xHoneyJar/loa-aleph',
  commit: 'c949ea5f39daef42d22ca2e4111164d63dffcbf1', tree: '8ced176e50da0d05070b164cfe725752df947d3f' };
export const INPUT_PINS = [
  ['SRC-001-frozen-numbered.txt', 'source', '54207', '5aef61988ff0db6f2ecc2b7980f370583a317e2427c85a6f78adc3ccc8a1d22a'],
  ['SRC-001-extraction-criteria.normalized.md', 'criteria', '4297', '1df51f9872895a3a87a9face2bafe50db34cdfbfd73826e2a31f531c4c538df8'],
  ['SRC-001-extraction-criteria.original.md', 'provenance-only', '4298', 'f76b5e14ced86a72f955dd130d18b39080cf6a76c200cdfaf7f516446d411369'],
  ['SRC-001-declared.pdf', 'upstream-asset', '1438944', 'c115123a511418ab46f04c4f9f78b6a569712960dbe9ca596d4edd6f0686d521'],
] as const;
export const CONTAINER_PINS = {
  archive: { byte_length: '5539645', sha256: 'sha256:f4c42e65d611395c9bacdb7ecf3ab7e4d01b1d21fd50c6c150b0cc6a8847a9f0' },
  manifest: { byte_length: '215207', sha256: 'sha256:3bc9e618b98faef9f1aa4ebbca02c5c8d9c29e955d853b5b6e497a3d17cf9dcf' },
};
export function approvedInputMetadata(lock: Data): void {
  validateRecord('input-lock', lock);
  requireFact(lock.entries.length === 4, 'FAIL_INPUT_PIN', 'exact four input/provenance records required');
  for (const [basename, role, size, hash] of INPUT_PINS) {
    const entry = lock.entries.find((e: Data) => e.role === role);
    requireFact(entry && entry.member_path === `SRC-001-closed-development-calibration-reference/evidence/transfer/${basename}`
      && entry.artifact_ref.byte_length === size && entry.artifact_ref.sha256 === `sha256:${hash}`,
    'FAIL_INPUT_PIN', `approved ${role} identity differs`);
  }
  for (const [ref, expected] of [[lock.archive_ref, CONTAINER_PINS.archive], [lock.custody_metadata_ref, CONTAINER_PINS.manifest]]) {
    requireFact(ref.byte_length === expected.byte_length && ref.sha256 === expected.sha256, 'FAIL_INPUT_PIN', 'container identity');
  }
}
export function syntheticDescriptor(replayId: string, text: Buffer, pdf: Buffer, sourcePath: string, pdfPath: string, preparer: string): Buffer {
  requireFact(replayId.startsWith('SYNTHETIC-') && !INPUT_PINS.some((p) => digest(text) === `sha256:${p[3]}`),
    'SYNTHETIC_ONLY', 'real replay descriptor preparation is not implemented under this authority');
  relativePath(sourcePath); relativePath(pdfPath);
  new TextDecoder('utf-8', { fatal: true }).decode(text);
  const descriptor = {
    format: 'aleph-supplied-representation/v1', source_path: sourcePath,
    origin_kind: 'supplied-extraction', extraction_surface: 'utf8-text', state: 'degraded',
    reason: 'Synthetic text capture; upstream visual or formal fidelity is unavailable.',
    assets: [{ asset_id: 'AST-0001', role: 'upstream-capture', input_path: pdfPath,
      media_type: 'application/pdf', encoding: 'opaque', byte_length: String(pdf.length), content_hash: digest(pdf) }],
    provenance: [{ provenance_id: 'RPR-0001', type: 'supplied-structure', actor: preparer,
      tool: 'synthetic-whole-file-descriptor', tool_version: '1', input_refs: ['source'],
      output_refs: ['declaration'], parameters_asset_id: 'none', declaration_asset_id: 'declaration' }],
    bindings: [{ binding_id: 'BND-0001', carrier_id: 'source', start_byte: '0', end_byte: String(text.length),
      page_id: 'none', region_id: 'none', byte_role: 'frozen-source-bytes', fragment_hash: digest(text), exact_bytes_base64: text.toString('base64') }],
    objects: [
      { object_id: 'OBJ-0001', kind: 'source', parent_id: 'none', state: 'available', reason: 'none',
        provenance_id: 'capture', binding_ids: ['BND-0001'], content_hash: materialFragmentsHash([text]), coordinates: {} },
      { object_id: 'OBJ-0002', kind: 'text', parent_id: 'OBJ-0001', state: 'available', reason: 'none',
        provenance_id: 'capture', binding_ids: ['BND-0001'], content_hash: materialFragmentsHash([text]), coordinates: {} },
    ], associations: [],
  };
  // This is an imported Core record, whose ordered format is deliberately not reserialized as harness JSON.
  const bytes = Buffer.from(JSON.stringify(descriptor) + '\n');
  validateDescriptor(bytes, text, pdf, sourcePath, pdfPath);
  return bytes;
}
export function validateDescriptor(raw: Buffer, text: Buffer, pdf: Buffer, sourcePath: string, pdfPath: string): void {
  const d = parseSuppliedRepresentation(raw);
  requireFact(d.source_path === sourcePath && d.origin_kind === 'supplied-extraction' && d.extraction_surface === 'utf8-text'
    && d.assets.length === 1 && d.assets[0].input_path === pdfPath && d.assets[0].role === 'upstream-capture'
    && d.assets[0].encoding === 'opaque' && d.bindings.length === 1 && d.objects.length === 2
    && d.objects.every((o) => ['source', 'text'].includes(String(o.kind))) && d.associations.length === 0
    && d.provenance.length === 1, 'BLOCKED_INPUT_REPRESENTATION', 'not the bounded whole-file text/upstream route');
  const capture = prepareRepresentationCapture([{ source_id: 'SRC-001', bytes: text, descriptor: raw, assets: new Map([[pdfPath, pdf]]) }]);
  requireFact(capture.sourceSchemes.size === 1 && capture.sourceSchemes.get('SRC-001') === 'md-lines',
    'BLOCKED_INPUT_REPRESENTATION', 'exactly one text source required');
}
export function inputIdentity(lock: Data, stores: Stores, expected: Data): void {
  requireFact(lock.entries?.length === 4, 'FAIL_INPUT_PIN', 'missing input pin');
  validateRecord('input-lock', lock);
  if (!lock.replay_id.startsWith('SYNTHETIC-')) approvedInputMetadata(lock);
  requireFact(same(lock, expected), 'FAIL_INPUT_PIN', 'input lock/scope differs from trusted approved lock');
  for (const ref of artifactRefs(lock)) {
    try { stores.read(ref); } catch { requireFact(false, 'FAIL_INPUT_PIN', `raw input identity ${ref.path}`); }
  }
  const source = lock.entries.find((e: Data) => e.role === 'source'), upstream = lock.entries.find((e: Data) => e.role === 'upstream-asset');
  requireFact(new Set(lock.entries.map((e: Data) => e.role)).size === 4, 'FAIL_INPUT_PIN', 'role alias');
  validateDescriptor(stores.read(lock.representation_descriptor_ref), stores.read(source.artifact_ref), stores.read(upstream.artifact_ref),
    source.artifact_ref.path.split('/').at(-1), upstream.artifact_ref.path.split('/').at(-1));
}
function contentProjection(value: any): any {
  if (Array.isArray(value)) return value.map(contentProjection);
  if (value && typeof value === 'object') {
    if ('store' in value && 'sha256' in value) return { path: value.path, byte_length: value.byte_length, sha256: value.sha256 };
    return Object.fromEntries(Object.entries(value).filter(([k]) => !['build_id', 'checkout_identity', 'verification_refs'].includes(k))
      .map(([k, v]) => [k, contentProjection(v)]));
  }
  return value;
}
export function releaseIdentity(lock: Data, stores: Stores): void {
  requireFact(lock.builds?.length === 2 && lock.builds.every((b: Data) => b.checker_digest && b.runtime_inventory?.length && b.lock_file_ref),
    'FAIL_RELEASE_PIN', 'missing release/checker/runtime identity');
  // Mutable refs receive the release-specific token, including otherwise malformed commit fields.
  requireFact(same(lock.canonical_base, CANONICAL_BASE)
    && lock.builds.every((b: Data) => b.actual_build_checkout_commit === CANONICAL_BASE.commit
      && b.actual_build_checkout_tree === CANONICAL_BASE.tree), 'FAIL_RELEASE_PIN', 'canonical checkout differs/mutable selector');
  validateRecord('release-lock', lock);
  const [a, b] = lock.builds;
  requireFact(a.build_id === 'A' && b.build_id === 'B' && a.checkout_identity !== b.checkout_identity,
    'BLOCKED_RELEASE_REPRODUCTION', 'independent A/B checkout receipts required');
  requireFact(same(contentProjection(a), contentProjection(b)), 'BLOCKED_RELEASE_REPRODUCTION', 'A/B inventories or reproduction facts differ');
  for (const build of lock.builds) {
    requireFact(build.clean && build.full_history && build.replacements.length === 0, 'BLOCKED_RELEASE_REPRODUCTION', 'unclean/shallow/replaced build');
    for (const ref of artifactRefs(build)) stores.read(ref);
    const original = parseStrictJson(stores.read(build.lock_file_ref)) as BundleLock;
    requireFact(same(original, resealBundleLock(original)) && original.lock_digest === build.internal_lock_digest
      && original.bundle.digest === build.bundle_digest && original.core.tree_digest === build.core_digest
      && original.adapter.tree_digest === build.adapter_digest && original.checker_digest === build.checker_digest
      && original.bundle.payload_digest === build.payload_digest && original.run_format_version === lock.run_format,
    'FAIL_RELEASE_PIN', 'original lock digest/identity differs');
    requireFact(same(original.provenance, parseStrictJson(stores.read(build.provenance_ref)))
      && original.provenance.digest === build.provenance_digest
      && original.provenance.vcs.commit === build.selector_commit && original.provenance.vcs.commit_tree === build.selector_tree
      && original.provenance.vcs.resolved && original.provenance.vcs.mutable_ref === null
      && original.provenance.vcs.worktree_state === 'clean'
      && gitCommitObjectId(original.provenance.vcs) === build.selector_commit
      && gitCommitTree(original.provenance.vcs) === build.selector_tree
      && stores.read(build.selector_commit_object_ref).equals(Buffer.from(original.provenance.vcs.commit_object, 'base64')),
    'FAIL_RELEASE_PIN', 'selector/raw commit/provenance mismatch');
    const ancestry = parseStrictJson(stores.read(build.selector_ancestry_ref)) as Data;
    requireFact(ancestry.selector_commit === build.selector_commit && ancestry.canonical_commit === CANONICAL_BASE.commit
      && ancestry.is_ancestor === true, 'BLOCKED_RELEASE_REPRODUCTION', 'missing recorded selector ancestry');
    const metadata = parseStrictJson(stores.read(build.release_metadata_ref)) as Data;
    requireFact(metadata.source.build_commit === build.dependency_closure_commit
      && metadata.source.dependency_closure_commit === build.dependency_closure_commit
      && build.dependency_closure_commit === build.selector_commit && build.dependency_closure_tree === build.selector_tree,
    'FAIL_RELEASE_PIN', 'metadata selector/checkout distinction lost');
    requireFact(stores.read(build.sidecar_ref).toString() === `${build.archive_ref.sha256.slice(7)}  ${build.archive_ref.path.split('/').at(-1)}\n`,
      'FAIL_RELEASE_PIN', 'archive sidecar mismatch');
    requireFact(same(lock.runtime_inventory, build.runtime_inventory), 'FAIL_RELEASE_PIN', 'runtime projection inventory');
    requireFact(same(parseStrictJson(stores.read(build.selected_projection_ref)), original.source.manifest_projection)
      && build.assembly_tool_ref.sha256 === original.source.assembly_tool.digest,
    'FAIL_RELEASE_PIN', 'selected manifest projection/assembly-tool identity');
    requireFact(same(build.runtime_inventory,build.loa_inventory.filter((e: Data) => e.path.startsWith('runtime-js/'))),
      'FAIL_RELEASE_PIN', 'runtime projection not fully in payload inventory');
    const fileRows = (entries: Data[]) => entries.filter((e) => e.type === 'file').map((e) => ({ path: e.path, digest: e.sha256 }));
    requireFact(same(fileRows(build.loa_inventory), original.files.map(({ path, digest: hash }) => ({ path, digest: hash }))),
      'FAIL_RELEASE_PIN', 'complete Loa payload inventory');
    const coreRows = original.files.filter((e) => e.classification === 'core').map(({ path, digest: hash }) => ({ path, digest: hash }));
    requireFact(same(fileRows(build.core_inventory), coreRows)
      && coreRows.every((e) => fileRows(build.hermes_inventory).some((h) => same(e, h))),
    'FAIL_RELEASE_PIN', 'both-target Core equality');
  }
  requireFact(stores.read(lock.installed_lock_ref).equals(stores.read(a.lock_file_ref))
    && stores.read(lock.run_lock_ref).equals(stores.read(a.lock_file_ref)), 'FAIL_RELEASE_PIN', 'install/run original lock bytes');
  stores.read(lock.reproduction_report_ref);
}

import { artifactRefs, canonicalBytes, digest, parseRecord, requireFact, same, SCHEMA_DIGEST, validateRecord } from './records.ts';
import type { Data } from './records.ts';
import type { Stores } from './storage.ts';
import { inventory, verifyInventory } from './storage.ts';

// Select original JSON bytes, including original whitespace/key order, not reserialized evidence.
function pointerBytes(raw: Buffer, pointer: string): Buffer {
  const text = new TextDecoder('utf-8', { fatal: true }).decode(raw);
  JSON.parse(text);
  requireFact(pointer === '' || pointer.startsWith('/') && !/~(?![01])/u.test(pointer), 'FAIL_COMPARISON_BINDING', 'invalid JSON pointer');
  const spans = new Map<string, [number, number]>();
  let i = 0;
  const whitespace = () => { while (/\s/u.test(text[i] || '') && i < text.length) i++; };
  function stringEnd(): void {
    i++;
    while (i < text.length) {
      if (text[i] === '\\') i += 2;
      else if (text[i++] === '"') return;
      else continue;
    }
  }
  function value(path: string): void {
    whitespace(); const start = i;
    if (text[i] === '{') {
      i++; whitespace(); const keys = new Set<string>();
      while (text[i] !== '}') {
        const keyStart = i; stringEnd(); const key = JSON.parse(text.slice(keyStart, i)) as string;
        requireFact(!keys.has(key), 'FAIL_COMPARISON_BINDING', 'duplicate evidence JSON key'); keys.add(key);
        whitespace(); i++; value(`${path}/${key.replace(/~/gu, '~0').replace(/\//gu, '~1')}`); whitespace();
        if (text[i] !== ',') break; i++; whitespace();
      }
      i++;
    } else if (text[i] === '[') {
      i++; whitespace(); let index = 0;
      while (text[i] !== ']') {
        value(`${path}/${index++}`); whitespace(); if (text[i] !== ',') break; i++; whitespace();
      }
      i++;
    } else if (text[i] === '"') stringEnd();
    else while (i < text.length && !/[\s,\]}]/u.test(text[i])) i++;
    spans.set(path, [start, i]);
  }
  value('');
  const span = spans.get(pointer);
  requireFact(span, 'FAIL_COMPARISON_BINDING', 'absent JSON pointer');
  return raw.subarray(Buffer.byteLength(text.slice(0, span[0])), Buffer.byteLength(text.slice(0, span[1])));
}
export function selectedBytes(raw: Buffer, selector: Data): Buffer {
  validateRecord('selector', selector);
  let selected: Buffer;
  if (selector.kind === 'json-pointer') selected = pointerBytes(raw, selector.locator === '/' ? '/' : selector.locator);
  else {
    const text = new TextDecoder('utf-8', { fatal: true }).decode(raw);
    const lines = text.match(/[^\n]*\n|[^\n]+$/gu) || [];
    if (selector.kind === 'jsonl-record') {
      requireFact(/^[1-9][0-9]*$/u.test(selector.locator), 'FAIL_COMPARISON_BINDING', 'JSONL position');
      const line = lines[Number(selector.locator) - 1];
      requireFact(line, 'FAIL_COMPARISON_BINDING', 'absent JSONL position');
      pointerBytes(Buffer.from(line), ''); selected = Buffer.from(line);
    } else {
      const match = /^L([1-9][0-9]*)-L([1-9][0-9]*)$/u.exec(selector.locator);
      requireFact(match, 'FAIL_COMPARISON_BINDING', 'Markdown selector requires explicit physical lines');
      const start = Number(match[1]), end = Number(match[2]);
      requireFact(start <= end && end <= lines.length, 'FAIL_COMPARISON_BINDING', 'Markdown selector out of bounds');
      const textSelection = lines.slice(start - 1, end).join('');
      requireFact(selector.kind === 'markdown-heading' ? /^#{1,6} /u.test(textSelection)
        : textSelection.split('\n').filter(Boolean).every((line) => /^\s*\|/u.test(line)),
      'FAIL_COMPARISON_BINDING', 'wrong Markdown selector kind');
      selected = Buffer.from(textSelection);
    }
  }
  requireFact(digest(selected) === selector.selected_sha256, 'FAIL_COMPARISON_BINDING', 'selected raw-byte hash differs');
  return selected;
}
export function sourceAnchor(anchor: Data, stores: Stores): void {
  validateRecord('source-anchor', anchor);
  const raw = stores.read(anchor.source_ref);
  requireFact(anchor.source_sha256 === digest(raw), 'FAIL_COMPARISON_BINDING', 'source pin mismatch');
  if (anchor.scheme === 'unavailable') {
    requireFact(anchor.unavailable_reason && anchor.byte_ranges.length === 0 && anchor.selected_sha256 === null,
      'FAIL_COMPARISON_BINDING', 'invented unavailable anchor'); return;
  }
  requireFact(anchor.unavailable_reason === null && anchor.byte_ranges.length > 0, 'FAIL_COMPARISON_BINDING', 'missing source ranges');
  let previous = 0n;
  const pieces = anchor.byte_ranges.map((range: Data) => {
    const start = BigInt(range.start), end = BigInt(range.end);
    requireFact(start >= previous && start <= end && end <= BigInt(raw.length), 'FAIL_COMPARISON_BINDING', 'unordered/out-of-bounds anchor');
    previous = end;
    if (anchor.scheme !== 'opaque-bytes') {
      new TextDecoder('utf-8', { fatal: true }).decode(raw.subarray(0, Number(start)));
      new TextDecoder('utf-8', { fatal: true }).decode(raw.subarray(Number(start), Number(end)));
    }
    return raw.subarray(Number(start), Number(end));
  });
  if (anchor.scheme === 'md-lines') {
    const match = /^L([1-9][0-9]*)-L([1-9][0-9]*)$/u.exec(anchor.locator);
    const lines = raw.toString('utf8').match(/[^\n]*\n|[^\n]+$/gu) || [];
    requireFact(match && Number(match[1]) <= Number(match[2]) && Number(match[2]) <= lines.length,
      'FAIL_COMPARISON_BINDING', 'invalid source line locator');
    const start = Buffer.byteLength(lines.slice(0, Number(match[1]) - 1).join(''));
    const end = Buffer.byteLength(lines.slice(0, Number(match[2])).join(''));
    requireFact(anchor.byte_ranges.every((r: Data) => BigInt(r.start) >= BigInt(start) && BigInt(r.end) <= BigInt(end)),
      'FAIL_COMPARISON_BINDING', 'ranges do not match line locator');
  } else {
    const first = anchor.byte_ranges[0], last = anchor.byte_ranges.at(-1);
    requireFact(anchor.locator === `B${first.start}-B${last.end}`, 'FAIL_COMPARISON_BINDING', 'byte locator does not bind ranges');
  }
  requireFact(digest(Buffer.concat(pieces)) === anchor.selected_sha256, 'FAIL_COMPARISON_BINDING', 'source selected bytes differ');
}
export function mappings(rows: Data[], comparison: Data, stores: Stores, predicate = 'evidence-selectors'): void {
  requireFact(predicate === 'evidence-selectors', 'FAIL_COMPARISON_BINDING', 'expected-ID equality is forbidden');
  requireFact(comparison.comparison_schema_ref.sha256===SCHEMA_DIGEST,'FAIL_COMPARISON_BINDING','unapproved comparison schema');
  stores.read(comparison.comparison_schema_ref);
  const freezeRefs = stores.byDigest(comparison.freeze_receipt_sha256);
  requireFact(freezeRefs.length > 0, 'FAIL_COMPARISON_BINDING', 'unresolved frozen replay');
  const freeze = parseRecord('freeze', stores.read(freezeRefs[0]));
  const reference = parseRecord('reference-lock', stores.read(comparison.reference_lock_ref));
  const input = parseRecord('input-lock',stores.read(freeze.input_lock_ref));
  const sourceRefs = input.entries.filter((e:Data)=>e.role==='source').map((e:Data)=>e.artifact_ref);
  const ids = new Set<string>();
  for (const row of rows) {
    validateRecord('mapping', row);
    requireFact(row.comparison_id === comparison.comparison_id && row.replay_id === comparison.replay_id
      && row.freeze_receipt_sha256 === comparison.freeze_receipt_sha256
      && row.replay_inventory_digest === comparison.replay_inventory_digest
      && row.reference_lock_sha256 === comparison.reference_lock_ref.sha256 && !ids.has(row.mapping_id),
    'FAIL_COMPARISON_BINDING', 'wrong replay/freeze/reference or duplicate mapping');
    ids.add(row.mapping_id);
    requireFact(row.replay_evidence.length || row.reference_evidence.length, 'FAIL_COMPARISON_BINDING', 'both mapping sides absent');
    if (!row.replay_evidence.length) requireFact(['MISSING_REFERENCE_BEHAVIOR','CANNOT_DETERMINE'].includes(row.correspondence),
      'FAIL_COMPARISON_BINDING', 'illegal absent replay side');
    if (!row.reference_evidence.length) requireFact(['ADDITIONAL_BEHAVIOR','CANNOT_DETERMINE'].includes(row.correspondence),
      'FAIL_COMPARISON_BINDING', 'illegal absent reference side');
    if (row.correspondence === 'CANNOT_DETERMINE') requireFact(row.uncertainty_refs.length > 0,
      'FAIL_COMPARISON_BINDING', 'indeterminacy lacks linked uncertainty');
    for (const [sideIndex, side] of [row.replay_evidence, row.reference_evidence].entries()) {
      const selectedRecords = new Set<string>();
      for (const entry of side) {
      requireFact(sideIndex === 0
        ? entry.artifact_ref.store === freeze.snapshot_storage_identity && entry.artifact_ref.path.startsWith('run/')
        : reference.members.some((m: Data) => same(m.artifact_ref, entry.artifact_ref)),
      'FAIL_COMPARISON_BINDING', 'evidence belongs to the wrong side or is outside the frozen/reference inventory');
      const raw = stores.read(entry.artifact_ref);
      const selected = selectedBytes(raw, entry.record_selector);
      const recordKey=canonicalBytes({artifact_ref:entry.artifact_ref,selector:entry.record_selector}).toString();
      requireFact(!selectedRecords.has(recordKey),'FAIL_COMPARISON_BINDING','duplicate side-local record selector');
      selectedRecords.add(recordKey);
      if (entry.native_id !== null && entry.record_selector.kind === 'json-pointer') {
        const selectedRecord=JSON.parse(selected.toString('utf8'));
        const parentPointer=entry.record_selector.locator.slice(0,entry.record_selector.locator.lastIndexOf('/'));
        const record = selectedRecord && typeof selectedRecord === 'object' ? selectedRecord : JSON.parse(pointerBytes(raw,parentPointer).toString('utf8'));
        requireFact(record?.id === entry.native_id || record?.native_id === entry.native_id,
          'FAIL_COMPARISON_BINDING', 'native ID metadata is not the actual side-local ID');
      }
      entry.source_anchors.forEach((anchor: Data) => {
        requireFact(sourceRefs.some((ref:Data)=>same(ref,anchor.source_ref)),'FAIL_COMPARISON_BINDING','anchor source is not the pinned source');
        sourceAnchor(anchor, stores);
      });
      }
    }
    for (const basis of row.comparison_basis) {
      requireFact(!(basis.basis_kind==='record-field' && /\/(?:id|native_id)$/u.test(basis.record_selector.locator)),
        'FAIL_COMPARISON_BINDING','ID spelling is not a comparison basis');
      selectedBytes(stores.read(basis.artifact_ref), basis.record_selector);
    }
  }
}
export const CORRESPONDENCES = [
  'RECOVERED_REFERENCE_BEHAVIOR','MISSING_REFERENCE_BEHAVIOR','ADDITIONAL_BEHAVIOR',
  'PARTIALLY_CORRESPONDING','CONTRADICTION','STRUCTURAL_DIFFERENCE','CANNOT_DETERMINE',
];
export function mappingCounts(rows: Data[], reachedStage: string): Data {
  return { formula: 'count(mapping rows by correspondence); denominator includes all rows', denominator: String(rows.length),
    reached_stage_scope: reachedStage, uncertainty_count: String(rows.filter((r) => r.correspondence === 'CANNOT_DETERMINE').length),
    buckets: CORRESPONDENCES.map((correspondence) => ({ correspondence, count: String(rows.filter((r) => r.correspondence === correspondence).length) })),
    mapping_refs: rows.map((r) => r.mapping_id) };
}
export function reports(exact: Data, structural: Data, semantic: Data, uncertainty: Data, rows: Data[],
  comparison: Data, outcome: Data, stores: Stores): void {
  mappings(rows, comparison, stores);
  const names = ['exact-byte-report','structural-report','semantic-report'];
  [exact,structural,semantic].forEach((report, index) => {
    validateRecord(names[index], report);
    requireFact(report.comparison_id === comparison.comparison_id && report.freeze_receipt_sha256 === comparison.freeze_receipt_sha256
      && report.replay_inventory_digest === comparison.replay_inventory_digest
      && report.reference_lock_sha256 === comparison.reference_lock_ref.sha256
      && report.schema_sha256 === comparison.comparison_schema_ref.sha256
      && report.context_id === comparison.context_id && report.author === comparison.comparator_identity,
    'FAIL_COMPARISON_BINDING', 'report binding/author differs');
    for (const ref of artifactRefs(report)) stores.read(ref);
  });
  for (const row of exact.rows) requireFact(['input-integrity','release-runtime-integrity','freeze-inventory','evidence-byte-reopening'].includes(row.proposition),
    'FAIL_COMPARISON_BINDING', 'exact-byte report exceeds mechanical proposition catalog');
  for (const row of structural.rows) requireFact(['reached-stage-accounting','source-walk','lineage','review-records','duplicate-history','restrictions-gates-checker'].includes(row.proposition),
    'FAIL_COMPARISON_BINDING', 'structural report exceeds structural proposition catalog');
  validateRecord('uncertainty-and-findings', uncertainty); validateRecord('outcome', outcome);
  requireFact(uncertainty.comparison_id === comparison.comparison_id && uncertainty.freeze_receipt_sha256 === comparison.freeze_receipt_sha256,
    'FAIL_COMPARISON_BINDING', 'uncertainty binding differs');
  const findings = new Map(uncertainty.records.map((f: Data) => [f.finding_id, f] as const));
  requireFact(findings.size === uncertainty.records.length && semantic.rows.length === rows.length,
    'FAIL_COMPARISON_BINDING', 'duplicate findings or dropped semantic rows');
  for (const row of rows) {
    const matching = semantic.rows.filter((r: Data) => r.mapping_ref === row.mapping_id);
    requireFact(matching.length === 1 && matching[0].assessment === row.correspondence,
      'FAIL_COMPARISON_BINDING', 'semantic assessment/indeterminacy dropped or coerced');
    for (const findingId of row.uncertainty_refs) {
      const finding = findings.get(findingId) as Data | undefined;
      requireFact(finding && finding.mapping_refs.includes(row.mapping_id)
        && (row.correspondence !== 'CANNOT_DETERMINE' || finding.assessment === 'CANNOT_DETERMINE'),
      'FAIL_COMPARISON_BINDING', 'linked indeterminate finding missing/coerced');
    }
  }
  for (const finding of uncertainty.records) {
    requireFact(finding.mapping_refs.every((id: string) => rows.some((r) => r.mapping_id === id)), 'FAIL_COMPARISON_BINDING', 'unknown finding mapping');
    for (const ref of artifactRefs(finding)) stores.read(ref);
  }
  for (const metric of semantic.metrics) requireFact(same(metric, mappingCounts(rows, structural.reached_stage)),
    'FAIL_COMPARISON_BINDING', 'unknown bucket/denominator/count/formula changed');
  requireFact(semantic.non_claims.includes('Comparative judgments are not deterministic truth or Core acceptance.'),
    'FAIL_COMPARISON_BINDING', 'semantic non-claim missing');
  if (outcome.completion === 'INCOMPLETE') requireFact(structural.reached_stage === outcome.stage
    && uncertainty.records.some((f: Data) => f.class === 'unreached-stage' && f.assessment === 'CANNOT_DETERMINE'),
  'FAIL_COMPARISON_BINDING', 'incomplete result or unreached stage hidden');
  requireFact(!outcome.blocking_codes.length || outcome.completion === 'INCOMPLETE', 'FAIL_COMPARISON_BINDING', 'blocked outcome promoted');
}
export function comparisonInventory(record:Data, outputRoot:string, frozen:Data, replayRoot:string, stores:Stores):void {
  validateRecord('comparison-inventory',record);
  const entries=inventory(outputRoot);
  requireFact(same(entries,record.entries)
    && record.inventory_digest===digest(canonicalBytes({format:record.format,comparison_id:record.comparison_id,entries}))
    && record.pre_replay_inventory_digest===frozen.replay_inventory_digest
    && record.post_replay_inventory_digest===frozen.replay_inventory_digest,
  'FAIL_FREEZE_MUTATION','comparison inventory or before/after frozen replay identity differs');
  verifyInventory(parseRecord('inventory',stores.read(frozen.replay_inventory_ref)),replayRoot);
  for(const ref of artifactRefs(record))stores.read(ref);
  requireFact(record.output_refs.every((ref:Data)=>entries.some(e=>e.path===ref.path&&e.sha256===ref.sha256&&e.byte_length===ref.byte_length))
    && entries.filter(e=>e.type==='file').every(e=>record.output_refs.some((ref:Data)=>ref.path===e.path&&ref.sha256===e.sha256)),
  'FAIL_COMPARISON_BINDING','comparison outputs missing or unlisted');
  const end=parseRecord('event',stores.read(record.end_event_ref));
  requireFact(end.event_kind==='comparison-end'&&end.replay_id===frozen.replay_id,
    'FAIL_COMPARISON_CHRONOLOGY','comparison end event is missing');
  requireFact(record.output_refs.every((ref:Data)=>end.artifact_refs.some((r:Data)=>same(r,ref))),
    'FAIL_COMPARISON_BINDING','end event does not bind all comparison output bytes');
}
export function auditManifest(record:Data, comparison:Data, stores:Stores):void {
  validateRecord('audit-manifest',record);
  requireFact(record.comparison_id===comparison.comparison_id && record.freeze_receipt_sha256===comparison.freeze_receipt_sha256
    && record.replay_inventory_digest===comparison.replay_inventory_digest
    && same(record.implementation_ref,comparison.implementation_ref)
    && record.auditor_identity!==comparison.comparator_identity && record.context_id!==comparison.context_id,
  'FAIL_COMPARISON_BINDING','audit subject/context not independently bound');
  for(const ref of artifactRefs(record))stores.read(ref);
}

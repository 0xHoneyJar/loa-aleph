import { existsSync } from 'node:fs';
import { join, isAbsolute, relative } from 'node:path';
import { runLogEvents, mdLineSpan, sourceFilePath, reachedState } from './check-helpers.ts';
import { parseTables, envelopeSection } from './markdown.ts';
import { hasRunCapability, forwardExecutionIdentityProblems, walkFiles, type RunModel } from './run-model.ts';
import { parseLineage, lineageCurrentClaimIds, type LineageRow } from './lineage.ts';
import { relationReviewSubjectJson, RELATION_REVIEW_SUBJECT_FORMAT } from './relations.ts';
import { relationProposalProblems } from './checks-k2-relations.ts';
import { runK2Lineage } from './checks-k2-lineage.ts';
import { ResultCollector } from './results.ts';
import { materialHash, materialTableMarkdown, readMaterialFile, readRepresentationContext,
  validateMaterialUseInput, planRepresentationUseWrite, validateMaterialPlanIdentity, validateRepresentationRun, MATERIAL_FEATURES,
  type MaterialWritePlan, type MaterialRow, type MaterialUseInput, type MaterialFileWrite } from './source-representation.ts';
import { parseStrictJson, validateJudgmentRationale, type WorkerJsonValue } from './worker-return-contract.ts';
import { canonicalJsonBytes, bundleLockBytes, resealBundleLock, type BundleLock } from './bundle-format.ts';
import { parseStructuredVerifierRecord, INTERNAL_AMBIGUITY_REVIEW_SUBJECT_FORMAT } from './internal-ambiguity.ts';
import {
  semanticJson, parseSemanticJson, semanticId, semanticPacketBasis, semanticRunBinding,
  semanticOriginProjection, semanticSubjectPath, parseSemanticLedger, SEMANTIC_PATH,
  semanticMaterialViews, completeSemanticAnchors, selectSemanticCorePart,
  semanticRelationRow, type RelationProjection,
  validateSemanticSubject, validateSemanticRun, SEMANTIC_EXECUTIONS,
  validateSemanticAcceptedBindings, validateSemanticWorkingAmbiguity,
  planSemanticWrite, validateSemanticPlan, validateSemanticResult, type SemanticWritePlan, type SemanticResult,
  type SemanticSubject, type SemanticExecution, type PacketBasis, type LineageContext,
  type MaterialView, type Anchor, type SemanticAcceptedBinding,
} from './semantic-review.ts';

export const DUPLICATE_PATH = 'ledgers/duplicate-review.md';
export const DUPLICATE_FORMAT = 'aleph-duplicate-review/v1';
export const DUPLICATE_SUBJECT_FORMAT = 'aleph-duplicate-review-subject/v1';
export const DUPLICATE_RESULT_FORMAT = 'aleph-duplicate-review-result/v1';
export const DUPLICATE_DISCOVERY_FORMAT = 'aleph-duplicate-discovery/v1';
export const DUPLICATE_ASSIGNMENT_FORMAT = 'aleph-duplicate-assignment/v1';
export const DUPLICATE_EFFECT_FORMAT = 'aleph-duplicate-effect/v1';
export const DUPLICATE_CONTRACT_FORMAT = 'aleph-duplicate-output-contract/v1';
export const DUPLICATE_TASKS = {
  discovery: 'Identify candidate comparisons in the attached current-claim catalogue; do not decide equivalence.',
  comparison: 'Propose one duplicate-versus-overlap decision for the attached complete comparison basis.',
  refutation: 'Challenge only the attached sealed duplicate comparison under L3.',
  'contradiction-discovery': 'Perform the independent L5 contradiction sweep over only the attached claims and sources.',
} as const;
export const DUPLICATE_DIMENSIONS = ['proposition', 'conditions', 'qualifiers', 'scope', 'modality', 'attribution',
  'comparator', 'metric', 'claim_roles', 'result-interpretation', 'source-occurrence', 'support-origin',
  'material', 'ambiguity', 'lineage', 'relations', 'context'] as const;
export const DUPLICATE_OUTCOMES = ['duplicate', 'overlap', 'distinct', 'CANNOT_DETERMINE'] as const;
export const DUPLICATE_VERDICTS = ['upheld', 'refuted', 'cannot-determine'] as const;
export const DUPLICATE_REASONS = ['reviewed-duplicate', 'reviewed-nonduplicate', 'unresolved-equivalence',
  'unresolved-origin', 'refuted-proposal', 'successor-not-preserved', 'withdrawn-reservation', 'changed-prerequisite'] as const;
export const DUPLICATE_HEADERS = {
  discoveries: ['discovery_id', 'record_path', 'record_digest'],
  proposals: ['proposal_id', 'subject_path', 'subject_digest', 'predecessor_proposal_id', 'producer_receipt_ref'],
  assignments: ['review_id', 'proposal_id', 'assignment_path', 'assignment_digest'],
  results: ['review_id', 'proposal_id', 'result_path', 'result_digest', 'execution_kind', 'execution_evidence_ref'],
  decisions: ['decision_id', 'proposal_id', 'review_ids', 'verdict', 'reviewed_outcome'],
  effects: ['effect_id', 'proposal_id', 'decision_id', 'effect', 'semantic_id', 'lineage_id', 'successor_id', 'record_ref'],
} as const;
export type DuplicateDimension = typeof DUPLICATE_DIMENSIONS[number];
export type DuplicateOutcome = typeof DUPLICATE_OUTCOMES[number];
export type DuplicateVerdict = typeof DUPLICATE_VERDICTS[number];
export type DuplicateTask = keyof typeof DUPLICATE_TASKS;
export type DuplicateToken = 'DUP_FORMAT' | 'DUP_ENUM' | 'DUP_REFERENCE' | 'DUP_EVIDENCE' | 'DUP_SUBJECT'
  | 'DUP_REVIEW' | 'DUP_ISOLATION' | 'DUP_STATE' | 'DUP_ACCOUNTING' | 'DUP_WINDOW' | 'DUP_COMPATIBILITY';
export type DuplicateLedger = Record<keyof typeof DUPLICATE_HEADERS, MaterialRow[]>;
export interface ClaimProjection { normalized_claim: string; packets: string[]; sources: string[]; claim_type: string }
export interface DuplicateMember {
  claim_id: string; claim_projection: ClaimProjection; claim_text_base64: string;
  semantic_id: string; semantic_subject_digest: string;
}
export interface DuplicateOccurrence {
  source_id: string; source_hash: string; packet_id: string; evidence_key: string; fragment_order: number;
  locator: string; fragment_hash: string; start_byte: number; end_byte: number;
}
export interface MemberOccurrences {
  claim_id: string; occurrence_keys: string[];
  unit_occurrences: Array<{ unit_ref: string; anchor_refs: DuplicateAnchorRef[]; occurrence_keys: string[] }>;
}
export interface ProvenanceUnion {
  packet_ids: string[]; source_ids: string[]; occurrences: DuplicateOccurrence[]; member_occurrences: MemberOccurrences[];
}
export type DuplicateAnchorRef = { semantic_id: string; anchor_id: string }
  | { source_id: string; locator: string; start_byte: number; end_byte: number; selection_hash: string };
export interface DuplicateFinding {
  finding_id: string; dimension: DuplicateDimension; input_refs: string[]; anchor_refs: DuplicateAnchorRef[];
  material_refs: WorkerJsonValue[]; missing: string;
  requested_context: Array<{ source_id: string; locator: string; purpose: 'local-context' | 'same-source-referent-search' | 'material-inspection' }>;
}
export interface Distinction {
  distinction_id: string; dimension: DuplicateDimension; member_ids: string[]; input_refs: string[];
  treatment: 'retained' | 'collapsible' | 'CANNOT_DETERMINE';
  retained_at: 'successor-content' | 'occurrence-history' | 'separate-claims' | null;
  content_anchor_refs: DuplicateAnchorRef[]; context_refs: string[]; explanation: string;
}
export interface ContradictionPair { a: string; b: string; distinction_refs: string[]; anchor_refs: DuplicateAnchorRef[]; why: string }
export interface DuplicateProposal {
  candidate_ref: string; member_ids: string[];
  member_semantic_refs: Array<{ claim_id: string; semantic_id: string; subject_digest: string; unit_refs: string[] }>;
  comparison_basis_digest: string; review_mode: 'proposal' | 'unresolved-record'; outcome: DuplicateOutcome;
  treatment: 'new-successor' | 'keep-separate'; distinctions: Distinction[]; contradiction_pairs: ContradictionPair[];
  origin_assessment: { corroboration: 'independent' | 'restatement' | 'CANNOT_DETERMINE';
    occurrence_groups: Array<{ occurrence_keys: string[]; basis_refs: string[] }>;
    basis_refs: string[]; unresolved_finding_refs: string[] };
  representative: { basis_member_ids: string[]; basis_unit_refs: string[]; wording_basis: 'selected-member' | 'combined-expression'; retained_distinction_refs: string[] } | null;
  successor_request: { lineage_type: 'duplicate' | 'merge'; proposed_claim: string; claim_type: string;
    packet_ids: string[]; source_ids: string[]; semantic_content_refs: string[]; material_use: MaterialUseInput } | null;
  provenance_union: ProvenanceUnion; unresolved_findings: DuplicateFinding[];
}
export interface ComparisonField { field_ref: string; dimension: DuplicateDimension; member_ids: string[] }
export interface ComparisonBasis {
  members: DuplicateMember[]; semantic_projections: ReturnType<typeof semanticOriginProjection>[];
  packet_basis: PacketBasis[];
  sources: Array<{ source_id: string; locus: string; scheme: string; content_hash: string; kind: string; trust_class: string }>;
  occurrences: DuplicateOccurrence[]; lineage_context: LineageContext[];
  relation_context: Array<{ reference: string; digest: string; subject: WorkerJsonValue; target_units: WorkerJsonValue[];
    target_anchors: Anchor[]; target_packet_context: PacketBasis[]; material_use: MaterialUseInput }>;
  ambiguity_context: SemanticSubject['ambiguity_context']; material_views: MaterialView[];
  inspection_anchors: Anchor[]; context_manifest: SemanticSubject['context_manifest'];
}
export type DuplicateReviewerProfile = {
  profile_id: string; profile_digest: string | null; role: 'verifier-l3'; model_identity: 'human' | Record<string, WorkerJsonValue>;
};
export interface DuplicateSubject {
  format: typeof DUPLICATE_SUBJECT_FORMAT; proposal_id: string; owner_stage: 'S4'; predecessor_proposal_id: string | null;
  run_binding: SemanticSubject['run_binding']; producer_binding_hash: string; proposal: DuplicateProposal;
  comparison_basis: ComparisonBasis; comparison_fields: ComparisonField[];
  reservation: { lineage_id: string; successor_id: string; lineage_type: 'duplicate' | 'merge'; predecessor_ids: string[] } | null;
  prompt_parts: SemanticSubject['prompt_parts']; reviewer_profile: DuplicateReviewerProfile;
  context_manifest: SemanticSubject['context_manifest'];
}
export interface DuplicateResult {
  format: typeof DUPLICATE_RESULT_FORMAT; subject_digest: string; verdict: DuplicateVerdict; assessed_outcome: DuplicateOutcome;
  dimension_reviews: Array<{ dimension: DuplicateDimension; verdict: DuplicateVerdict; input_refs: string[];
    anchor_refs: DuplicateAnchorRef[]; material_refs: WorkerJsonValue[]; explanation: string }>;
  distinction_reviews: Array<{ distinction_id: string; verdict: DuplicateVerdict; input_refs: string[]; explanation: string }>;
  pair_reviews: Array<{ a: string; b: string; verdict: DuplicateVerdict; distinction_refs: string[]; origin_basis_refs: string[]; explanation: string }>;
  contradiction_pairs: ContradictionPair[]; unresolved_findings: DuplicateFinding[]; attacks_tried: string[];
  missing_for_determination: string | null; rationale: string; candidate_evidence: [];
}
export interface DuplicateAssignment {
  format: typeof DUPLICATE_ASSIGNMENT_FORMAT; proposal_id: string; subject_digest: string; review_id: string;
  role: 'verifier-l3'; profile_digest: string | null; invocation_id: string; producer_binding_hash: string;
  round: 1 | 2; execution_kind: SemanticExecution;
}
export interface DuplicateEffect {
  format: typeof DUPLICATE_EFFECT_FORMAT; effect_id: string; proposal_id: string; subject_digest: string;
  decision_id: string | null; effect: 'canonicalized' | 'kept-separate' | 'not-admitted';
  reason: typeof DUPLICATE_REASONS[number]; semantic_ids: string[]; lineage_id: string | null;
  successor_id: string | null; merge_row_digest: string | null; provenance_union_digest: string; predecessor_proposal_id: string | null;
}
export interface DuplicateCandidate { candidate_id: string; member_ids: string[]; basis_refs: string[]; signal: 'semantic-proposal' | 'identical-text' | 'shared-packet' }
export interface DuplicateDiscovery {
  format: typeof DUPLICATE_DISCOVERY_FORMAT; discovery_id: string; run_binding: SemanticSubject['run_binding'];
  inventory_basis: { s3_seal_ref: string; claim_prefix_ids: string[]; lineage_prefix_ids: string[]; lineage_prefix_digest: string };
  catalogue_digest: string; catalogue: Array<{ claim_id: string; claim_projection: ClaimProjection; semantic_id: string;
    semantic_subject_digest: string; packet_ids: string[]; source_ids: string[] }>;
  producer_binding_hash: string;
  windows: Array<{ window_id: string; member_ids: string[]; shown_digest: string; producer_binding_hash: string; execution_evidence_ref: string }>;
  candidates: DuplicateCandidate[];
  sweep_refs: Array<{ review_id: string; verifier_ref: string; result_ref: string; window_member_ids: string[]; shown_digest: string }>;
  unresolved_findings: Array<{ member_ids: string[]; missing: string; requested_context: DuplicateFinding['requested_context'] }>;
}
export function requireDuplicate(condition: unknown, token: DuplicateToken, path: string, why: string): asserts condition {
  if (!condition) throw new Error(`${token} ${path}: ${why}`);
}
function object(v: unknown): v is Record<string, unknown> { return v !== null && typeof v === 'object' && !Array.isArray(v); }
const obj = object;
function keys(v: unknown, expected: readonly string[], path: string): asserts v is Record<string, unknown> {
  requireDuplicate(object(v) && semanticJson(Object.keys(v)) === semanticJson(expected), 'DUP_FORMAT', path, 'exact keys and order required');
}
function array(v: unknown, path: string): asserts v is unknown[] { requireDuplicate(Array.isArray(v), 'DUP_FORMAT', path, 'array required'); }
function text(v: unknown, path: string): asserts v is string { requireDuplicate(typeof v === 'string' && v.trim(), 'DUP_FORMAT', path, 'nonempty text required'); }
function hash(v: unknown, path: string): asserts v is string { requireDuplicate(typeof v === 'string' && /^sha256:[a-f0-9]{64}$/u.test(v), 'DUP_FORMAT', path, 'lowercase SHA-256 required'); }
function oneOf<T extends string>(v: unknown, values: readonly T[], path: string): asserts v is T { requireDuplicate(values.includes(v as T), 'DUP_ENUM', path, 'unknown enum'); }
function strings(v: unknown, path: string, nonempty = false): asserts v is string[] {
  array(v, path);
  requireDuplicate((!nonempty || v.length > 0) && v.every((x) => typeof x === 'string' && x.length) && new Set(v).size === v.length,
    'DUP_REFERENCE', path, 'unique nonempty strings required');
}
function subset(v: unknown, basis: readonly string[], path: string, nonempty = false): asserts v is string[] {
  strings(v, path, nonempty);
  requireDuplicate(v.every((x, i) => basis.includes(x) && (i === 0 || basis.indexOf(x) > basis.indexOf(v[i - 1]))),
    'DUP_REFERENCE', path, 'ordered subset required');
}
function equal(a: unknown, b: unknown, token: DuplicateToken, path: string): void { requireDuplicate(semanticJson(a) === semanticJson(b), token, path, 'exact ordered binding differs'); }
function unique<T>(values: T[]): T[] { const seen = new Set<string>(); return values.filter((v) => { const key = semanticJson(v); if (seen.has(key)) return false; seen.add(key); return true; }); }
function decode(v: string): string { return v.replace(/&#10;/gu, '\n').replace(/&#13;/gu, '\r').replace(/&#124;/gu, '|').replace(/&amp;/gu, '&'); }
function ids(v: string): string[] { return v === 'none' ? [] : v.split(',').map((x) => x.trim()); }
function integer(v: unknown): v is number { return typeof v === 'number' && Number.isSafeInteger(v) && v >= 0 && !Object.is(v, -0); }
function rationale(v: unknown): void { text(v, 'rationale'); const errors: string[] = []; validateJudgmentRationale(v, 'rationale', errors); requireDuplicate(!errors.length, 'DUP_REVIEW', 'rationale', errors.join('; ')); }
export function duplicateJson(v: unknown): string {
  try { return semanticJson(v); } catch (error) { throw new Error(`DUP_FORMAT ${error instanceof Error ? error.message : String(error)}`); }
}
export function parseDuplicateJson(bytes: Buffer | string): unknown {
  try { return parseSemanticJson(bytes); } catch (error) { throw new Error(`DUP_FORMAT ${error instanceof Error ? error.message : String(error)}`); }
}
export function duplicatePath(kind: 'discovery' | 'subjects' | 'assignments' | 'results' | 'effects' | 'process', id: string): string {
  return `verification/harness/duplicate-${kind}/${id}.json`;
}
export function duplicatePointer(value: unknown, pointer: string): unknown {
  requireDuplicate(typeof pointer === 'string' && /^(?:\/(?:[^~]|~[01])*)*$/u.test(pointer), 'DUP_REFERENCE', pointer, 'exact JSON Pointer required');
  let selected = value;
  for (const part of pointer === '' ? [] : pointer.slice(1).split('/')) {
    const key = part.replace(/~1/gu, '/').replace(/~0/gu, '~');
    requireDuplicate(selected !== null && typeof selected === 'object' && Object.hasOwn(selected, key)
      && (!Array.isArray(selected) || /^(?:0|[1-9]\d*)$/u.test(key)), 'DUP_REFERENCE', pointer, 'pointer does not resolve');
    selected = (selected as Record<string, unknown>)[key];
  }
  return selected;
}
function refs(v: unknown, basis: ComparisonBasis | undefined, path: string, nonempty = false): asserts v is string[] {
  strings(v, path, nonempty);
  for (const ref of v) {
    requireDuplicate(ref.startsWith('/'), 'DUP_REFERENCE', path, 'basis pointer required');
    if (basis) duplicatePointer(basis, ref);
  }
}
function anchorRefs(v: unknown, basis?: ComparisonBasis): asserts v is DuplicateAnchorRef[] {
  array(v, 'anchor_refs');
  requireDuplicate(unique(v).length === v.length, 'DUP_REFERENCE', 'anchor_refs', 'duplicate anchor');
  for (const ref of v) {
    requireDuplicate(object(ref), 'DUP_FORMAT', 'anchor_ref', 'object required');
    if ('semantic_id' in ref) {
      keys(ref, ['semantic_id', 'anchor_id'], 'anchor_ref');
      requireDuplicate(semanticId(ref.semantic_id, 'SEM') && typeof ref.anchor_id === 'string' && /^A[1-9]\d*$/u.test(ref.anchor_id),
        'DUP_REFERENCE', 'anchor_ref', 'SEM/anchor identity required');
      if (basis) requireDuplicate(basis.semantic_projections.some((s) => s.semantic_id === ref.semantic_id && s.anchors.some((a) => a.anchor_id === ref.anchor_id)),
        'DUP_REFERENCE', 'anchor_ref', 'missing semantic anchor');
    } else {
      keys(ref, ['source_id', 'locator', 'start_byte', 'end_byte', 'selection_hash'], 'inspection anchor');
      text(ref.source_id, 'source_id'); text(ref.locator, 'locator'); hash(ref.selection_hash, 'selection_hash');
      requireDuplicate(integer(ref.start_byte) && integer(ref.end_byte) && ref.end_byte > ref.start_byte, 'DUP_REFERENCE', 'inspection anchor', 'exact interval required');
      if (basis) requireDuplicate(basis.inspection_anchors.some((a) => a.source_id === ref.source_id && a.locator === ref.locator
        && a.start_byte === ref.start_byte && a.end_byte === ref.end_byte && a.selection_hash === ref.selection_hash),
      'DUP_REFERENCE', 'anchor_ref', 'not in inspection basis');
    }
  }
}
function requestedContext(v: unknown, basis?: ComparisonBasis): void {
  array(v, 'requested_context');
  for (const r of v) {
    keys(r, ['source_id', 'locator', 'purpose'], 'requested_context'); text(r.source_id, 'source_id'); text(r.locator, 'locator');
    oneOf(r.purpose, ['local-context', 'same-source-referent-search', 'material-inspection'], 'purpose');
    requireDuplicate(/^SRC-\d+$/u.test(r.source_id) && /^L[1-9]\d*-L[1-9]\d*$/u.test(r.locator), 'DUP_REFERENCE', 'requested_context', 'existing frozen source locator required');
    if (basis) requireDuplicate(basis.sources.some((s) => s.source_id === r.source_id)
      || basis.semantic_projections.some((s) => s.anchors.some((a) => a.source_id === r.source_id))
      || basis.inspection_anchors.some((a) => 'source_id' in a && a.source_id === r.source_id),
    'DUP_REFERENCE', 'requested_context', 'request cannot leave frozen comparison context');
  }
}
function materialRefs(v: unknown, basis?: ComparisonBasis): void {
  array(v, 'material_refs');
  for (const r of v) {
    requireDuplicate(object(r), 'DUP_FORMAT', 'material_ref', 'object required');
    const requirement = 'requirement_index' in r;
    keys(r, ['use_subject_digest', requirement ? 'requirement_index' : 'limitation_id'], 'material_ref');
    hash(r.use_subject_digest, 'use_subject_digest');
    requireDuplicate(requirement ? integer(r.requirement_index) : typeof r.limitation_id === 'string' && /^(REP|OBJ|ASC)-(?=\d*[1-9])\d{4,}$/u.test(r.limitation_id),
      'DUP_REFERENCE', 'material_ref', 'existing requirement or limitation required');
    if (basis) {
      const view = basis.material_views.find((m) => m.use_subject_digest === r.use_subject_digest);
      requireDuplicate(view && object(view.use_subject), 'DUP_REFERENCE', 'material_ref', 'use subject absent');
      const selections = requirement ? view.use_subject.requirements : view.use_subject.limitation_refs;
      requireDuplicate(Array.isArray(selections) && (requirement ? Number(r.requirement_index) < selections.length : selections.includes(r.limitation_id as string)),
        'DUP_REFERENCE', 'material_ref', 'use selection absent');
    }
  }
}
function findings(value: unknown, basis?: ComparisonBasis): asserts value is DuplicateFinding[] {
  array(value, 'findings');
  value.forEach((f, i) => {
    keys(f, ['finding_id', 'dimension', 'input_refs', 'anchor_refs', 'material_refs', 'missing', 'requested_context'], 'finding');
    requireDuplicate(f.finding_id === `F${i + 1}`, 'DUP_REFERENCE', 'finding', 'contiguous local IDs required');
    oneOf(f.dimension, DUPLICATE_DIMENSIONS, 'dimension'); refs(f.input_refs, basis, 'input_refs', true);
    anchorRefs(f.anchor_refs, basis); materialRefs(f.material_refs, basis); text(f.missing, 'missing'); requestedContext(f.requested_context, basis);
  });
}
export function duplicatePairs(members: readonly string[]): Array<{ a: string; b: string }> {
  return members.flatMap((a, i) => members.slice(i + 1).map((b) => ({ a, b })));
}
function contradictions(v: unknown, members?: readonly string[], distinctionIds?: readonly string[], basis?: ComparisonBasis): asserts v is ContradictionPair[] {
  array(v, 'contradiction_pairs');
  const pairs = members ? duplicatePairs(members).map((p) => `${p.a}/${p.b}`) : undefined;
  let previous = -1;
  for (const p of v) {
    keys(p, ['a', 'b', 'distinction_refs', 'anchor_refs', 'why'], 'contradiction_pair');
    text(p.a, 'a'); text(p.b, 'b');
    requireDuplicate(p.a !== p.b && /^CC-\d+$/u.test(p.a) && /^CC-\d+$/u.test(p.b), 'DUP_REFERENCE', 'pair', 'distinct CC IDs required');
    if (pairs) { const index = pairs.indexOf(`${p.a}/${p.b}`); requireDuplicate(index > previous, 'DUP_REFERENCE', 'pair', 'exact member pair order required'); previous = index; }
    strings(p.distinction_refs, 'distinction_refs', true);
    if (distinctionIds) requireDuplicate(p.distinction_refs.every((r) => distinctionIds.includes(r)), 'DUP_REFERENCE', 'pair', 'missing distinction');
    anchorRefs(p.anchor_refs, basis); requireDuplicate(p.anchor_refs.length > 0, 'DUP_REFERENCE', 'pair', 'anchors required'); text(p.why, 'why');
  }
}
function occurrenceShape(v: unknown): asserts v is DuplicateOccurrence {
  keys(v, ['source_id', 'source_hash', 'packet_id', 'evidence_key', 'fragment_order', 'locator', 'fragment_hash', 'start_byte', 'end_byte'], 'occurrence');
  for (const key of ['source_id', 'packet_id', 'evidence_key', 'locator']) text(v[key], key);
  hash(v.source_hash, 'source_hash'); hash(v.fragment_hash, 'fragment_hash');
  requireDuplicate(integer(v.fragment_order) && v.fragment_order > 0 && integer(v.start_byte) && integer(v.end_byte) && v.end_byte > v.start_byte,
    'DUP_EVIDENCE', 'occurrence', 'exact positive fragment/interval required');
}
function provenanceShape(v: unknown): asserts v is ProvenanceUnion {
  keys(v, ['packet_ids', 'source_ids', 'occurrences', 'member_occurrences'], 'provenance_union');
  strings(v.packet_ids, 'packet_ids', true); strings(v.source_ids, 'source_ids', true); array(v.occurrences, 'occurrences'); array(v.member_occurrences, 'member_occurrences');
  v.occurrences.forEach(occurrenceShape);
  requireDuplicate(unique(v.occurrences).length === v.occurrences.length, 'DUP_EVIDENCE', 'occurrences', 'only unique coordinate tuples allowed');
  for (const m of v.member_occurrences) {
    keys(m, ['claim_id', 'occurrence_keys', 'unit_occurrences'], 'member_occurrences');
    text(m.claim_id, 'claim_id'); subset(m.occurrence_keys, v.occurrences.map(semanticJson), 'occurrence_keys', true); array(m.unit_occurrences, 'unit_occurrences');
    for (const u of m.unit_occurrences) {
      keys(u, ['unit_ref', 'anchor_refs', 'occurrence_keys'], 'unit_occurrence'); text(u.unit_ref, 'unit_ref'); anchorRefs(u.anchor_refs);
      subset(u.occurrence_keys, m.occurrence_keys, 'unit occurrence keys', true);
    }
  }
}
export function validateDuplicateProposal(value: unknown, basis?: ComparisonBasis, fields?: ComparisonField[]): asserts value is DuplicateProposal {
  keys(value, ['candidate_ref', 'member_ids', 'member_semantic_refs', 'comparison_basis_digest', 'review_mode', 'outcome', 'treatment',
    'distinctions', 'contradiction_pairs', 'origin_assessment', 'representative', 'successor_request', 'provenance_union', 'unresolved_findings'], 'proposal');
  text(value.candidate_ref, 'candidate_ref');
  requireDuplicate(/^DCD-(?=\d*[1-9])\d{4,}\/G[1-9]\d*$/u.test(value.candidate_ref), 'DUP_REFERENCE', 'candidate_ref', 'DCD/G required');
  requireDuplicate(Array.isArray(value.member_ids) && new Set(value.member_ids).size === value.member_ids.length,
    'DUP_REFERENCE', 'member_ids', 'unique members required');
  strings(value.member_ids, 'member_ids', true);
  requireDuplicate(value.member_ids.length >= 2 && value.member_ids.every((id) => /^CC-\d+$/u.test(id)), 'DUP_REFERENCE', 'member_ids', 'at least two unique CCs required');
  array(value.member_semantic_refs, 'member_semantic_refs');
  value.member_semantic_refs.forEach((m, i) => {
    keys(m, ['claim_id', 'semantic_id', 'subject_digest', 'unit_refs'], 'member_semantic_refs');
    requireDuplicate(m.claim_id === (value.member_ids as string[])[i] && semanticId(m.semantic_id, 'SEM'), 'DUP_REFERENCE', 'member_semantic_refs', 'member/SEM mismatch');
    hash(m.subject_digest, 'subject_digest'); strings(m.unit_refs, 'unit_refs', true);
    requireDuplicate(m.unit_refs.every((r) => r.startsWith(`${m.semantic_id}/U`) && /^SEM-\d{4,}\/U[1-9]\d*$/u.test(r)), 'DUP_REFERENCE', 'unit_refs', 'SEM unit references required');
  });
  requireDuplicate(value.member_semantic_refs.length === value.member_ids.length, 'DUP_ACCOUNTING', 'member_semantic_refs', 'exact member coverage required');
  hash(value.comparison_basis_digest, 'comparison_basis_digest');
  oneOf(value.review_mode, ['proposal', 'unresolved-record'], 'review_mode'); oneOf(value.outcome, DUPLICATE_OUTCOMES, 'outcome');
  oneOf(value.treatment, ['new-successor', 'keep-separate'], 'treatment');
  requireDuplicate(value.outcome === 'duplicate' || value.treatment === 'keep-separate', 'DUP_STATE', 'treatment', 'nonduplicate cannot absorb');
  requireDuplicate(value.review_mode !== 'unresolved-record' || value.outcome === 'CANNOT_DETERMINE' && value.treatment === 'keep-separate',
    'DUP_STATE', 'review_mode', 'unresolved-record preserves uncertainty only');
  findings(value.unresolved_findings, basis);
  requireDuplicate(value.outcome !== 'CANNOT_DETERMINE' || value.unresolved_findings.length, 'DUP_STATE', 'outcome', 'unknown requires a finding');
  provenanceShape(value.provenance_union);
  array(value.distinctions, 'distinctions');
  const proposal = value as unknown as DuplicateProposal;
  proposal.distinctions.forEach((d, i) => {
    keys(d, ['distinction_id', 'dimension', 'member_ids', 'input_refs', 'treatment', 'retained_at', 'content_anchor_refs', 'context_refs', 'explanation'], 'distinction');
    requireDuplicate(d.distinction_id === `D${i + 1}`, 'DUP_REFERENCE', 'distinction_id', 'contiguous local IDs required');
    oneOf(d.dimension, DUPLICATE_DIMENSIONS, 'dimension'); subset(d.member_ids, proposal.member_ids, 'distinction members', true);
    refs(d.input_refs, basis, 'input_refs', true); oneOf(d.treatment, ['retained', 'collapsible', 'CANNOT_DETERMINE'], 'treatment');
    requireDuplicate(d.treatment === 'retained' ? ['successor-content', 'occurrence-history', 'separate-claims'].includes(String(d.retained_at))
      : d.retained_at === null, 'DUP_STATE', d.distinction_id, 'retention location disagrees');
    const historical = d.input_refs.some((ref) => /^\/(?:occurrences|lineage_context|sources)(?:\/|$)/u.test(ref));
    if (historical) requireDuplicate(d.input_refs.every((ref) => /^\/(?:occurrences|lineage_context|sources)(?:\/|$)/u.test(ref))
      && d.treatment === 'retained' && d.retained_at === 'occurrence-history',
      'DUP_STATE', d.distinction_id, 'occurrences and historical identities cannot collapse');
    else requireDuplicate(d.retained_at !== 'occurrence-history', 'DUP_STATE', d.distinction_id, 'semantic field cannot disappear into occurrence history');
    requireDuplicate(proposal.treatment !== 'keep-separate' || d.retained_at !== 'successor-content', 'DUP_STATE', d.distinction_id, 'no successor in keep-separate proposal');
    requireDuplicate(d.treatment !== 'CANNOT_DETERMINE' || proposal.unresolved_findings.some((f) => f.dimension === d.dimension && d.input_refs.some((r) => f.input_refs.includes(r))),
      'DUP_STATE', d.distinction_id, 'unknown distinction requires linked finding');
    anchorRefs(d.content_anchor_refs, basis); refs(d.context_refs, basis, 'context_refs'); text(d.explanation, 'explanation');
    if (fields) subset(d.input_refs, fields.filter((f) => f.dimension === d.dimension).map((f) => f.field_ref), 'distinction field coverage', true);
  });
  for (const dimension of DUPLICATE_DIMENSIONS) requireDuplicate(proposal.distinctions.some((d) => d.dimension === dimension),
    'DUP_ACCOUNTING', dimension, 'all seventeen dimensions required');
  if (fields) for (const f of fields) requireDuplicate(proposal.distinctions.some((d) => d.dimension === f.dimension && d.input_refs.includes(f.field_ref)),
    'DUP_ACCOUNTING', f.field_ref, 'missing declared field coverage');
  requireDuplicate(proposal.member_ids.every((id) => proposal.distinctions.some((d) => d.member_ids.includes(id))), 'DUP_ACCOUNTING', 'distinctions', 'missing member coverage');
  contradictions(proposal.contradiction_pairs, proposal.member_ids, proposal.distinctions.map((d) => d.distinction_id), basis);
  requireDuplicate(!proposal.contradiction_pairs.length || proposal.outcome === 'distinct' && proposal.treatment === 'keep-separate', 'DUP_STATE', 'contradiction_pairs', 'endorsed contradiction stays distinct/separate');
  const origin = proposal.origin_assessment;
  keys(origin, ['corroboration', 'occurrence_groups', 'basis_refs', 'unresolved_finding_refs'], 'origin_assessment');
  oneOf(origin.corroboration, ['independent', 'restatement', 'CANNOT_DETERMINE'], 'corroboration');
  refs(origin.basis_refs, basis, 'origin basis', true); subset(origin.unresolved_finding_refs, proposal.unresolved_findings.map((f) => f.finding_id), 'origin findings');
  requireDuplicate(origin.corroboration !== 'CANNOT_DETERMINE' || origin.unresolved_finding_refs.length > 0, 'DUP_STATE', 'origin', 'unknown origins require a finding');
  array(origin.occurrence_groups, 'occurrence_groups'); const occurrenceKeys = proposal.provenance_union.occurrences.map(semanticJson), grouped: string[] = [];
  for (const g of origin.occurrence_groups) {
    keys(g, ['occurrence_keys', 'basis_refs'], 'origin group'); subset(g.occurrence_keys, occurrenceKeys, 'origin occurrences', true);
    refs(g.basis_refs, basis, 'origin group basis', true); grouped.push(...g.occurrence_keys);
  }
  requireDuplicate(grouped.length === occurrenceKeys.length && new Set(grouped).size === occurrenceKeys.length && occurrenceKeys.every((k) => grouped.includes(k)),
    'DUP_ACCOUNTING', 'origin groups', 'exact occurrence partition required');
  if (proposal.treatment === 'keep-separate') requireDuplicate(proposal.representative === null && proposal.successor_request === null, 'DUP_STATE', 'successor', 'keep-separate requires null successor');
  else {
    const r = proposal.representative, s = proposal.successor_request;
    keys(r, ['basis_member_ids', 'basis_unit_refs', 'wording_basis', 'retained_distinction_refs'], 'representative');
    subset(r.basis_member_ids, proposal.member_ids, 'representative members', true);
    subset(r.basis_unit_refs, proposal.member_semantic_refs.flatMap((m) => m.unit_refs), 'representative units', true);
    oneOf(r.wording_basis, ['selected-member', 'combined-expression'], 'wording_basis');
    requireDuplicate(r.wording_basis === 'selected-member' ? r.basis_member_ids.length === 1 : r.basis_member_ids.length >= 2,
      'DUP_REFERENCE', 'representative', 'wording basis cardinality differs');
    subset(r.retained_distinction_refs, proposal.distinctions.filter((d) => d.treatment === 'retained').map((d) => d.distinction_id), 'retained distinctions');
    keys(s, ['lineage_type', 'proposed_claim', 'claim_type', 'packet_ids', 'source_ids', 'semantic_content_refs', 'material_use'], 'successor_request');
    oneOf(s.lineage_type, ['duplicate', 'merge'], 'lineage_type'); text(s.proposed_claim, 'proposed_claim');
    oneOf(s.claim_type, ['factual', 'design-intent', 'constraint', 'preference', 'open-question'], 'claim_type');
    equal(s.packet_ids, proposal.provenance_union.packet_ids, 'DUP_ACCOUNTING', 'successor packets');
    equal(s.source_ids, proposal.provenance_union.source_ids, 'DUP_ACCOUNTING', 'successor sources');
    refs(s.semantic_content_refs, basis, 'semantic content refs', true); validateMaterialUseInput(s.material_use);
  }
  if (basis) {
    equal(proposal.member_ids, basis.members.map((m) => m.claim_id), 'DUP_REFERENCE', 'members');
    equal(proposal.member_semantic_refs, basis.members.map((m, i) => ({ claim_id: m.claim_id, semantic_id: m.semantic_id,
      subject_digest: m.semantic_subject_digest, unit_refs: basis.semantic_projections[i].semantics.units.map((u) => `${m.semantic_id}/${u.unit_id}`) })),
    'DUP_SUBJECT', 'member SEM refs');
    requireDuplicate(proposal.comparison_basis_digest === materialHash(semanticJson(basis)), 'DUP_SUBJECT', 'comparison basis', 'basis digest differs');
    equal(proposal.provenance_union, duplicateProvenanceUnion(basis), 'DUP_ACCOUNTING', 'provenance union');
  }
}

export function validateDuplicateResult(value: unknown, subject?: DuplicateSubject): asserts value is DuplicateResult {
  keys(value, ['format', 'subject_digest', 'verdict', 'assessed_outcome', 'dimension_reviews', 'distinction_reviews', 'pair_reviews',
    'contradiction_pairs', 'unresolved_findings', 'attacks_tried', 'missing_for_determination', 'rationale', 'candidate_evidence'], 'result');
  requireDuplicate(value.format === DUPLICATE_RESULT_FORMAT, 'DUP_FORMAT', 'result', 'wrong format'); hash(value.subject_digest, 'subject_digest');
  oneOf(value.verdict, DUPLICATE_VERDICTS, 'verdict'); oneOf(value.assessed_outcome, DUPLICATE_OUTCOMES, 'assessed_outcome');
  const basis = subject?.comparison_basis;
  findings(value.unresolved_findings, basis); strings(value.attacks_tried, 'attacks_tried', true); rationale(value.rationale);
  array(value.candidate_evidence, 'candidate_evidence');
  requireDuplicate(value.candidate_evidence.length === 0, 'DUP_FORMAT', 'candidate_evidence', 'portable L3 requires exactly []');
  requireDuplicate(value.verdict === 'cannot-determine' ? typeof value.missing_for_determination === 'string' && value.missing_for_determination.trim()
    : value.missing_for_determination === null, 'DUP_REVIEW', 'missing_for_determination', 'verdict/missing mismatch');
  for (const key of ['dimension_reviews', 'distinction_reviews', 'pair_reviews']) array(value[key], key);
  const result = value as unknown as DuplicateResult;
  requireDuplicate(result.dimension_reviews.length === DUPLICATE_DIMENSIONS.length, 'DUP_REVIEW', 'dimension_reviews', 'exact seventeen dimensions required');
  result.dimension_reviews.forEach((r, i) => {
    keys(r, ['dimension', 'verdict', 'input_refs', 'anchor_refs', 'material_refs', 'explanation'], 'dimension_review');
    requireDuplicate(r.dimension === DUPLICATE_DIMENSIONS[i], 'DUP_REVIEW', 'dimension_review', 'exact dimension order required');
    oneOf(r.verdict, DUPLICATE_VERDICTS, 'verdict'); refs(r.input_refs, basis, 'dimension inputs', true);
    anchorRefs(r.anchor_refs, basis); materialRefs(r.material_refs, basis); text(r.explanation, 'explanation');
    if (subject) equal(r.input_refs, subject.comparison_fields.filter((f) => f.dimension === r.dimension).map((f) => f.field_ref), 'DUP_REVIEW', r.dimension);
    requireDuplicate(r.verdict !== 'cannot-determine' || result.unresolved_findings.some((f) => f.dimension === r.dimension),
      'DUP_REVIEW', r.dimension, 'unknown dimension requires finding');
  });
  result.distinction_reviews.forEach((r, i) => {
    keys(r, ['distinction_id', 'verdict', 'input_refs', 'explanation'], 'distinction_review');
    requireDuplicate(r.distinction_id === `D${i + 1}`, 'DUP_REVIEW', 'distinction_review', 'exact distinction order required');
    oneOf(r.verdict, DUPLICATE_VERDICTS, 'verdict'); refs(r.input_refs, basis, 'distinction inputs', true); text(r.explanation, 'explanation');
    if (subject) {
      const d = subject.proposal.distinctions[i];
      requireDuplicate(d, 'DUP_REVIEW', 'distinction_review', 'extra distinction review');
      equal(r.input_refs, d.input_refs, 'DUP_REVIEW', r.distinction_id);
      requireDuplicate(r.verdict !== 'cannot-determine' || result.unresolved_findings.some((f) => f.dimension === d.dimension && f.input_refs.some((p) => r.input_refs.includes(p))),
        'DUP_REVIEW', r.distinction_id, 'unknown distinction requires linked finding');
    }
  });
  const pairs = subject ? duplicatePairs(subject.proposal.member_ids) : undefined;
  result.pair_reviews.forEach((r, i) => {
    keys(r, ['a', 'b', 'verdict', 'distinction_refs', 'origin_basis_refs', 'explanation'], 'pair_review');
    text(r.a, 'a'); text(r.b, 'b'); requireDuplicate(r.a !== r.b, 'DUP_REFERENCE', 'pair', 'different members required');
    oneOf(r.verdict, DUPLICATE_VERDICTS, 'verdict'); strings(r.distinction_refs, 'distinction_refs', true);
    refs(r.origin_basis_refs, basis, 'origin_basis_refs', true); text(r.explanation, 'explanation');
    if (subject) {
      equal({ a: r.a, b: r.b }, pairs![i], 'DUP_REVIEW', 'pair order');
      subset(r.distinction_refs, subject.proposal.distinctions.map((d) => d.distinction_id), 'pair distinction refs', true);
    }
    requireDuplicate(r.verdict !== 'cannot-determine' || result.unresolved_findings.length > 0, 'DUP_REVIEW', 'pair', 'unknown pair requires finding');
  });
  const rows = [...result.dimension_reviews, ...result.distinction_reviews, ...result.pair_reviews];
  const aggregate = rows.some((r) => r.verdict === 'refuted') ? 'refuted'
    : rows.some((r) => r.verdict === 'cannot-determine') ? 'cannot-determine' : 'upheld';
  requireDuplicate(result.verdict === aggregate, 'DUP_REVIEW', 'result', 'declared row aggregation differs');
  const contradictionRefs = [...(subject?.proposal.distinctions.map((d) => `producer:${d.distinction_id}`) || []),
    ...result.unresolved_findings.map((f) => `reviewer:${f.finding_id}`)];
  contradictions(result.contradiction_pairs, subject?.proposal.member_ids, subject ? contradictionRefs : undefined, basis);
  requireDuplicate(!result.contradiction_pairs.length || result.assessed_outcome === 'distinct', 'DUP_REVIEW', 'contradiction_pairs', 'contradictory assessment is distinct');
  if (subject) {
    requireDuplicate(result.subject_digest === materialHash(semanticJson(subject)), 'DUP_SUBJECT', 'result', 'result targets another subject');
    requireDuplicate(result.distinction_reviews.length === subject.proposal.distinctions.length && result.pair_reviews.length === pairs!.length,
      'DUP_REVIEW', 'result', 'exact distinction/pair coverage required');
    requireDuplicate(result.verdict !== 'upheld' || result.assessed_outcome === subject.proposal.outcome
      && (result.assessed_outcome !== 'CANNOT_DETERMINE' || subject.proposal.review_mode === 'unresolved-record'),
    'DUP_REVIEW', 'assessed_outcome', 'upheld assessment differs from proposal');
  }
}

/** This aggregation preserves round-one indeterminacy; it is not a vote. */
export function duplicateQuorum(rounds: Array<{ assignment: DuplicateAssignment; result?: DuplicateResult }>): {
  complete: boolean; verdict: DuplicateVerdict | null; review_ids: string[];
} {
  requireDuplicate(rounds.length <= 2 && rounds.every((r, i) => r.assignment.round === i + 1), 'DUP_STATE', 'quorum', 'one assignment per ordered round; no third round');
  if (!rounds.length || !rounds[0].result) {
    requireDuplicate(rounds.length <= 1, 'DUP_STATE', 'quorum', 'round two requires retained round-one unknown');
    return { complete: false, verdict: null, review_ids: rounds.map((r) => r.assignment.review_id) };
  }
  const first = rounds[0];
  if (first.result!.verdict !== 'cannot-determine') {
    requireDuplicate(rounds.length === 1, 'DUP_STATE', 'quorum', 'no round two after upheld/refuted');
    return { complete: true, verdict: first.result!.verdict, review_ids: [first.assignment.review_id] };
  }
  const second = rounds[1];
  if (!second?.result) return { complete: false, verdict: null, review_ids: rounds.map((r) => r.assignment.review_id) };
  requireDuplicate(second.assignment.subject_digest === first.assignment.subject_digest && second.assignment.proposal_id === first.assignment.proposal_id,
    'DUP_SUBJECT', 'round two', 'identical sealed subject required');
  return { complete: true, verdict: second.result.verdict === 'refuted' ? 'refuted' : 'cannot-determine',
    review_ids: rounds.map((r) => r.assignment.review_id) };
}
function claimProjection(model: RunModel, id: string): ClaimProjection {
  const row = model.claims.find((c) => c.values.claimId === id)?.values;
  requireDuplicate(row, 'DUP_REFERENCE', id, 'claim definition absent');
  return { normalized_claim: decode(row.normalizedClaim), packets: ids(row.packets), sources: ids(row.sources), claim_type: row.claimType };
}
function admittedSemantic(model: RunModel, id: string): SemanticSubject {
  const ledger = parseSemanticLedger(readMaterialFile(model.runDir, SEMANTIC_PATH).toString('utf8'));
  const candidates = ledger.resolutions.filter((r) => r.outcome === 'admitted').map((r) =>
    parseSemanticJson(readMaterialFile(model.runDir, semanticSubjectPath(r.semantic_id))) as SemanticSubject)
    .filter((s) => s.output_binding.kind === 'claim' && s.output_binding.reserved_claim_id === id);
  requireDuplicate(candidates.length === 1, 'DUP_REFERENCE', id, 'one admitting SEM required');
  try { validateSemanticSubject(candidates[0], model); }
  catch (error) { throw new Error(`DUP_SUBJECT ${id}: admitting SEM or its exact bound inputs changed: ${error instanceof Error ? error.message : String(error)}`); }
  return candidates[0];
}
function sourceSpan(model: RunModel, sourceId: string, locator: string): { start: number; end: number; bytes: Buffer; path: string; source_hash: string } {
  const row = model.corpus.sources.find((s) => s.values.sourceId === sourceId)?.values;
  requireDuplicate(row?.scheme === 'md-lines', 'DUP_EVIDENCE', sourceId, 'existing frozen locator scheme required');
  const path = sourceFilePath(model.runDir, row.locus), match = /^L([1-9]\d*)-L([1-9]\d*)$/u.exec(locator);
  requireDuplicate(path && match, 'DUP_EVIDENCE', locator, 'exact source locus required');
  const rel = relative(model.runDir, path).replaceAll('\\', '/'), bytes = readMaterialFile(model.runDir, rel);
  requireDuplicate(materialHash(bytes) === row.contentHash, 'DUP_EVIDENCE', sourceId, 'frozen source changed');
  const span = mdLineSpan(path, Number(match[1]), Number(match[2]));
  requireDuplicate(span?.bytes && span.startByte !== null && span.endByte !== null, 'DUP_EVIDENCE', locator, 'source interval absent');
  return { start: span.startByte, end: span.endByte, bytes: span.bytes, path: rel, source_hash: row.contentHash };
}
function packetOccurrences(model: RunModel, packets: PacketBasis[]): DuplicateOccurrence[] {
  return unique(packets.flatMap((p) => p.fragments.filter((f) => f.packet_id === p.packet_id).map((f) => {
    const span = sourceSpan(model, String(f.source_id), String(f.locator));
    requireDuplicate(materialHash(span.bytes) === f.fragment_hash, 'DUP_EVIDENCE', p.packet_id, 'fragment differs');
    return { source_id: String(f.source_id), source_hash: span.source_hash, packet_id: p.packet_id,
      evidence_key: String(f.evidence_key), fragment_order: Number(f.fragment_order), locator: String(f.locator),
      fragment_hash: String(f.fragment_hash), start_byte: span.start, end_byte: span.end };
  })));
}
export function duplicateProvenanceUnion(basis: ComparisonBasis): ProvenanceUnion {
  const packet_ids = [...new Set(basis.members.flatMap((m) => m.claim_projection.packets))];
  const source_ids = [...new Set(packet_ids.map((id) => {
    const p = basis.packet_basis.find((p) => p.packet_id === id);
    requireDuplicate(p, 'DUP_EVIDENCE', id, 'union packet absent'); return p.packet.source_id;
  }))];
  const occurrences = basis.occurrences;
  const member_occurrences = basis.members.map((m, i) => {
    const selected = occurrences.filter((o) => m.claim_projection.packets.includes(o.packet_id));
    equal(m.claim_projection.sources, [...new Set(m.claim_projection.packets.map((id) => basis.packet_basis.find((p) => p.packet_id === id)!.packet.source_id))],
      'DUP_ACCOUNTING', m.claim_id);
    return { claim_id: m.claim_id, occurrence_keys: selected.map(semanticJson),
      unit_occurrences: basis.semantic_projections[i].semantics.units.map((u) => {
        const anchor_refs = u.proposition_anchor_ids.map((anchor_id) => ({ semantic_id: m.semantic_id, anchor_id }));
        const anchors = basis.semantic_projections[i].anchors.filter((a) => u.proposition_anchor_ids.includes(a.anchor_id));
        return { unit_ref: `${m.semantic_id}/${u.unit_id}`, anchor_refs,
          occurrence_keys: selected.filter((o) => anchors.some((a) => a.source_id === o.source_id && a.start_byte < o.end_byte && o.start_byte < a.end_byte)).map(semanticJson) };
      }) };
  });
  return { packet_ids, source_ids, occurrences, member_occurrences };
}

export function duplicateComparisonFields(basis: ComparisonBasis): ComparisonField[] {
  const fields: ComparisonField[] = [];
  const add = (field_ref: string, dimension: DuplicateDimension, member: string): void => {
    duplicatePointer(basis, field_ref);
    const previous = fields.find((f) => f.field_ref === field_ref && f.dimension === dimension);
    if (previous) { if (!previous.member_ids.includes(member)) previous.member_ids.push(member); }
    else fields.push({ field_ref, dimension, member_ids: [member] });
  };
  for (const [i, member] of basis.members.entries()) for (const dimension of DUPLICATE_DIMENSIONS) {
    const root = `/semantic_projections/${i}/semantics`, s = basis.semantic_projections[i].semantics;
    if (dimension === 'proposition' || ['conditions', 'qualifiers', 'scope', 'modality', 'attribution', 'comparator', 'metric', 'claim_roles'].includes(dimension)) {
      for (const [u, unit] of s.units.entries()) {
        const pointer = `${root}/units/${u}/${dimension}`; add(pointer, dimension, member.claim_id);
        if (dimension !== 'proposition') {
          const facet = unit[dimension as keyof typeof unit];
          if (object(facet) && Array.isArray(facet.items)) facet.items.forEach((_, j) => add(`${pointer}/items/${j}`, dimension, member.claim_id));
        }
      }
      if (!s.units.length) add(`${root}/units`, dimension, member.claim_id);
    } else if (dimension === 'result-interpretation') {
      s.units.forEach((_, j) => add(`${root}/units/${j}/claim_roles`, dimension, member.claim_id));
      add(`${root}/couplings`, dimension, member.claim_id); s.couplings.forEach((_, j) => add(`${root}/couplings/${j}`, dimension, member.claim_id));
    } else if (dimension === 'source-occurrence' || dimension === 'support-origin') {
      basis.occurrences.forEach((o, j) => { if (member.claim_projection.packets.includes(o.packet_id)) add(`/occurrences/${j}`, dimension, member.claim_id); });
      if (!basis.occurrences.length) add('/occurrences', dimension, member.claim_id);
      if (dimension === 'support-origin') basis.sources.forEach((source, j) => {
        if (member.claim_projection.sources.includes(source.source_id)) add(`/sources/${j}`, dimension, member.claim_id);
      });
    } else {
      const collections = {
        material: ['/material_views'], ambiguity: [`${root}/unresolved_findings`, '/ambiguity_context'],
        lineage: ['/lineage_context'], relations: [`${root}/relation_proposals`, '/relation_context'],
        context: [`${root}/contexts`, `${root}/couplings`, '/inspection_anchors'],
      }[dimension as 'material' | 'ambiguity' | 'lineage' | 'relations' | 'context'];
      for (const pointer of collections) {
        add(pointer, dimension, member.claim_id);
        const collection = duplicatePointer(basis, pointer);
        if (Array.isArray(collection)) collection.forEach((v, j) => {
          add(`${pointer}/${j}`, dimension, member.claim_id);
          if (dimension === 'material' && object(v) && object(v.use_subject)) {
            for (const key of ['requirements', 'limitation_refs']) {
              add(`${pointer}/${j}/use_subject/${key}`, dimension, member.claim_id);
              (v.use_subject[key] as unknown[]).forEach((_, k) => add(`${pointer}/${j}/use_subject/${key}/${k}`, dimension, member.claim_id));
            }
          }
        });
      }
    }
  }
  return fields;
}

function referenced(model: RunModel, reference: string): { path: string; bytes: Buffer; value: unknown } {
  const match = /^([^#@]+)(?:#((?:\/(?:[^~@]|~[01])*)?))?@(sha256:[0-9a-f]{64})$/u.exec(reference);
  requireDuplicate(match, 'DUP_REFERENCE', reference, 'confined path, optional pointer, and whole-file digest required');
  const bytes = readMaterialFile(model.runDir, match[1]);
  requireDuplicate(materialHash(bytes) === match[3], 'DUP_SUBJECT', match[1], 'referenced bytes changed');
  return { path: match[1], bytes, value: match[2] === undefined ? undefined : duplicatePointer(parseDuplicateJson(bytes), match[2]) };
}
function selectedBytes(model: RunModel, entry: SemanticSubject['context_manifest'][number]): Buffer {
  const bytes = readMaterialFile(model.runDir, entry.path);
  if (entry.selector.startsWith('json:')) return Buffer.from(semanticJson(duplicatePointer(parseStrictJson(bytes, true), entry.selector.slice(5))));
  const span = /^bytes:(0|[1-9]\d*):(0|[1-9]\d*)$/u.exec(entry.selector);
  if (span) {
    requireDuplicate(Number(span[1]) <= Number(span[2]) && Number(span[2]) <= bytes.length, 'DUP_EVIDENCE', entry.path, 'selection outside bytes');
    return bytes.subarray(Number(span[1]), Number(span[2]));
  }
  const row = /^row:(.+):(0|[1-9]\d*)$/u.exec(entry.selector);
  requireDuplicate(row, 'DUP_REFERENCE', entry.path, 'existing exact selector required');
  const lines = bytes.toString('utf8').split('\n');
  const tables = parseTables(bytes.toString('utf8')).filter((t) =>
    lines.slice(0, t.line - 1).reverse().find((line) => /^#{1,6} /u.test(line))?.replace(/^#{1,6} /u, '').replace(/\r$/u, '') === row[1]);
  requireDuplicate(tables.length === 1 && tables[0].rows[Number(row[2])], 'DUP_REFERENCE', entry.path, 'selected row absent');
  return Buffer.from(semanticJson(tables[0].rows[Number(row[2])].cells.map(decode)));
}
function definition(model: RunModel, id: string): LineageContext['unit_definitions'][number] {
  if (id.startsWith('CC-')) return { kind: 'CC', id, projection: claimProjection(model, id) as unknown as WorkerJsonValue };
  const p = model.packets.find((p) => p.values.packetId === id)?.values;
  requireDuplicate(p, 'DUP_REFERENCE', id, 'ancestor packet absent');
  return { kind: 'PKT', id, projection: { source_id: p.sourceId, locator: p.locator, span_hash: p.spanHash, criterion: p.criterion } };
}
function lineageProjection(model: RunModel, row: LineageRow): LineageContext {
  const p = ids(row.values.predecessors), s = ids(row.values.successors);
  return { lineage_id: row.values.lineageId, row_digest: materialHash(semanticJson(row.cells.map(decode))),
    event: { owner_stage: row.values.ownerStage, type: row.values.type, predecessors: p, successors: s },
    unit_definitions: unique([...p, ...s]).map((id) => definition(model, id)) };
}
export function buildComparisonBasis(model: RunModel, memberIds: string[], historical?: ComparisonBasis): ComparisonBasis {
  const current = model.claims.map((r) => r.values.claimId).filter((id) => lineageCurrentClaimIds(model).has(id));
  if (!historical) subset(memberIds, current, 'current comparison group', true);
  requireDuplicate(memberIds.length >= 2 && new Set(memberIds).size === memberIds.length, 'DUP_REFERENCE', 'members', 'unique bounded group required');
  const subjects = memberIds.map((id) => admittedSemantic(model, id));
  const members = memberIds.map((claim_id, i) => {
    const projection = claimProjection(model, claim_id), subject = subjects[i], output = subject.output_binding;
    requireDuplicate(output.kind === 'claim' && output.normalized_claim === projection.normalized_claim, 'DUP_SUBJECT', claim_id, 'CC text differs from admitting SEM');
    return { claim_id, claim_projection: projection, claim_text_base64: Buffer.from(projection.normalized_claim).toString('base64'),
      semantic_id: subject.semantic_id, semantic_subject_digest: materialHash(semanticJson(subject)) };
  });
  const packetIds = unique(members.flatMap((m) => m.claim_projection.packets)), packet_basis = semanticPacketBasis(model, packetIds);
  const sourceIds = unique(packet_basis.map((p) => p.packet.source_id));
  const sources = sourceIds.map((source_id) => {
    const s = model.corpus.sources.find((s) => s.values.sourceId === source_id)?.values;
    requireDuplicate(s, 'DUP_EVIDENCE', source_id, 'frozen source missing');
    return { source_id, locus: s.locus, scheme: s.scheme, content_hash: s.contentHash, kind: s.kind, trust_class: s.trustClass };
  });
  const lineages = parseLineage(model).rows, seen = new Set<string>(), lineage_context: LineageContext[] = [];
  function ancestry(id: string): void {
    if (seen.has(id)) return; seen.add(id);
    for (const row of lineages.filter((r) => ids(r.values.successors).includes(id))) {
      if (!lineage_context.some((c) => c.lineage_id === row.values.lineageId)) lineage_context.push(lineageProjection(model, row));
      ids(row.values.predecessors).forEach(ancestry);
    }
  }
  memberIds.forEach(ancestry);
  const context_manifest: SemanticSubject['context_manifest'] = [];
  const add = (path: string, selector: string, purpose: SemanticSubject['context_manifest'][number]['purpose']): void => {
    const entry = { path, selector, digest: '', purpose }; entry.digest = materialHash(selectedBytes(model, entry));
    const old = context_manifest.find((e) => e.path === path && e.selector === selector);
    if (old) requireDuplicate(old.digest === entry.digest, 'DUP_SUBJECT', path, 'conflicting selection'); else context_manifest.push(entry);
  };
  const material = readRepresentationContext(model);
  const material_views = unique([...subjects.flatMap((s) => s.material_views),
    ...semanticMaterialViews(model, material.uses.filter((r) => r.subject_kind === 'PKT' && packetIds.includes(r.subject_id)))]);
  const inspection_anchors: Anchor[] = [];
  const inspect = (source_id: string, locator: string, start?: number, end?: number): void => {
    const span = sourceSpan(model, source_id, locator), start_byte = start ?? span.start, end_byte = end ?? span.end;
    if (!inspection_anchors.some((a) => a.source_id === source_id && a.locator === locator
      && a.start_byte === start_byte && a.end_byte === end_byte)) {
      const source = readMaterialFile(model.runDir, span.path);
      inspection_anchors.push(completeSemanticAnchors(model, [{ anchor_id: `A${inspection_anchors.length + 1}`,
        source_id, locator, start_byte, end_byte, exact_bytes_base64: source.subarray(start_byte, end_byte).toString('base64') }], packetIds)[0]);
    }
    add(span.path, `bytes:${start_byte}:${end_byte}`, 'inspection-context');
  };
  for (const s of subjects) {
    for (const entry of s.context_manifest) add(entry.path, entry.selector, entry.purpose);
    for (const field of ['semantic_id', 'owner_stage', 'output_binding', 'anchors', 'semantics', 'material_use', 'material_views'])
      add(semanticSubjectPath(s.semantic_id), `json:/${field}`, 'inspection-context');
    for (const finding of s.semantics.unresolved_findings) for (const request of finding.requested_context) {
      inspect(request.source_id, request.locator);
    }
  }
  const ambiguity_context = unique(subjects.flatMap((s) => s.ambiguity_context));
  const workingRoot = join(model.runDir, 'verification/harness');
  for (const path of walkFiles(workingRoot).filter((p) => p.endsWith('.json'))) {
    const bytes = readMaterialFile(model.runDir, relative(model.runDir, path));
    if (!bytes.includes(Buffer.from(INTERNAL_AMBIGUITY_REVIEW_SUBJECT_FORMAT))) continue;
    const value = parseStrictJson(bytes);
    if (!object(value) || value.format !== INTERNAL_AMBIGUITY_REVIEW_SUBJECT_FORMAT) continue;
    const parent = subjects.find((s) => s.output_binding.kind === 'claim'
      && (s.output_binding.reserved_claim_id === value.source_entity_id || s.output_binding.packet_ids.includes(String(value.source_entity_id))));
    if (!parent) continue;
    const selectedPath = relative(model.runDir, path).replaceAll('\\', '/'), reference = `${selectedPath}#@${materialHash(bytes)}`;
    if (ambiguity_context.some((c) => c.reference === reference)
      || historical && !historical.ambiguity_context.some((c) => c.reference === reference)) continue;
    const source = sourceSpan(model, String(value.source_id), String(value.expression_locator));
    const allBytes = readMaterialFile(model.runDir, source.path);
    const lines = allBytes.toString('utf8').split('\n').length - (allBytes.at(-1) === 10 ? 1 : 0);
    if (value.search_scope_kind === 'full-same-source') inspect(String(value.source_id), `L1-L${lines}`);
    else {
      for (const id of parseDuplicateJson(String(value.search_completion_ref)) as string[]) {
        const interval = model.sourceWalk.intervals.find((r) => r.values.walkId === id)?.values;
        requireDuplicate(interval, 'DUP_REFERENCE', id, 'working search interval absent');
        inspect(String(value.source_id), `L1-L${lines}`, Number(interval.startByte), Number(interval.endByte));
      }
    }
    validateSemanticWorkingAmbiguity(model, { ...parent, anchors: [...parent.anchors, ...inspection_anchors] }, value as WorkerJsonValue);
    ambiguity_context.push({ kind: 'slice5-working-subject', reference, digest: materialHash(semanticJson(value)), projection: value as WorkerJsonValue });
    add(selectedPath, 'json:', 'ambiguity-context');
  }
  // Completed predecessor findings remain source-bound context, without their
  // verdicts, rationales or actor identities. A historical subject reopens only
  // the selected prefix; a new subject closes every explicit frozen request.
  if (existsSync(join(model.runDir, DUPLICATE_PATH))) {
    const priorLedger = parseDuplicateLedger(readMaterialFile(model.runDir, DUPLICATE_PATH).toString('utf8'));
    for (const row of priorLedger.proposals.filter((r) => priorLedger.effects.some((e) => e.proposal_id === r.proposal_id))) {
      const prior = parseDuplicateJson(readMaterialFile(model.runDir, row.subject_path)) as DuplicateSubject;
      if (!prior.proposal.member_ids.some((id) => seen.has(id))) continue;
      const selected = [{ path: row.subject_path, pointer: '/proposal/unresolved_findings', findings: prior.proposal.unresolved_findings },
        ...priorLedger.results.filter((r) => r.proposal_id === row.proposal_id).map((r) => ({
          path: r.result_path, pointer: '/unresolved_findings',
          findings: (parseDuplicateJson(readMaterialFile(model.runDir, r.result_path)) as DuplicateResult).unresolved_findings,
        }))];
      for (const entry of selected) for (const [index, finding] of entry.findings.entries()) {
        const pointer = `${entry.pointer}/${index}`, reference = `${entry.path}#${pointer}@${materialHash(readMaterialFile(model.runDir, entry.path))}`;
        if (historical && !historical.ambiguity_context.some((c) => c.reference === reference)) continue;
        ambiguity_context.push({ kind: 'semantic-finding', reference, digest: materialHash(semanticJson(finding)),
          projection: finding as unknown as WorkerJsonValue });
        add(entry.path, `json:${pointer}`, 'ambiguity-context');
        for (const request of finding.requested_context) inspect(request.source_id, request.locator);
      }
    }
  }
  const relation_context: ComparisonBasis['relation_context'] = [];
  const semanticLedger = parseSemanticLedger(readMaterialFile(model.runDir, SEMANTIC_PATH).toString('utf8'));
  for (const row of semanticLedger.subjects) {
    const s = parseSemanticJson(readMaterialFile(model.runDir, row.subject_path)) as SemanticSubject;
    for (const [i, relation] of s.semantics.relation_proposals.entries()) {
      const p = relation.subject;
      let incident = memberIds.includes(p.source_id) || memberIds.includes(p.target_id) || packetIds.includes(p.source_id) || packetIds.includes(p.target_id);
      if (!incident && p.target_kind === 'source-locus' && p.target_source_id !== 'none') {
        const span = sourceSpan(model, p.target_source_id, p.target_locator);
        incident = subjects.some((m) => m.anchors.some((a) => a.source_id === p.target_source_id && a.start_byte < span.end && span.start < a.end_byte));
      }
      if (!incident) continue;
      const reference = `${row.subject_path}#/semantics/relation_proposals/${i}@${row.subject_digest}`;
      if (historical && !historical.relation_context.some((r) => r.reference === reference)) continue;
      validateSemanticSubject(s, model);
      const context = s.relation_context.find((c) => c.proposal_index === i);
      requireDuplicate(context, 'DUP_SUBJECT', reference, 'incident relation lacks required target context');
      relation_context.push({ reference, digest: relation.review_subject_digest, subject: p as unknown as WorkerJsonValue,
        target_units: context.target_units as unknown as WorkerJsonValue[], target_anchors: context.target_anchors,
        target_packet_context: context.target_packet_context, material_use: relation.material_use });
      add(row.subject_path, `json:/semantics/relation_proposals/${i}`, 'relation-context');
      const j = s.relation_context.indexOf(context); add(row.subject_path, `json:/relation_context/${j}`, 'relation-context');
      for (const a of context.target_anchors) {
        inspect(a.source_id, a.locator, a.start_byte, a.end_byte);
      }
    }
  }
  const acceptedRoot = join(model.runDir, 'control/worker-returns');
  for (const path of existsSync(acceptedRoot) ? walkFiles(acceptedRoot).filter((p) => p.endsWith('/raw.json')) : []) {
    const rawPath = relative(model.runDir, path).replaceAll('\\', '/'), callId = rawPath.split('/')[2];
    const reportPath = `control/worker-returns/${callId}/validation.json`;
    if (!existsSync(join(model.runDir, reportPath))) continue;
    const report = parseStrictJson(readMaterialFile(model.runDir, reportPath));
    if (!object(report) || report.result !== 'PASS') continue;
    const bytes = readMaterialFile(model.runDir, rawPath), returned = parseStrictJson(bytes, true);
    if (!object(returned) || !Array.isArray(returned.relation_proposals)) continue;
    requireDuplicate(report.call_id === callId && report.raw_digest === materialHash(bytes), 'DUP_SUBJECT', rawPath, 'accepted relation producer bytes changed');
    const request = parseStrictJson(readMaterialFile(model.runDir, `control/worker-bundles/${callId}/request.json`));
    requireDuplicate(object(request) && request.kind === 'producer' && request.run_id === model.manifest!.runId,
      'DUP_ISOLATION', rawPath, 'retained relation producer request required');
    for (const [i, item] of returned.relation_proposals.entries()) {
      requireDuplicate(object(item), 'DUP_FORMAT', rawPath, 'structured relation proposal required');
      let incident = [...memberIds, ...packetIds].includes(String(item.source_id)) || [...memberIds, ...packetIds].includes(String(item.target_id));
      if (!incident && item.target_kind === 'source-locus') {
        const span = sourceSpan(model, String(item.target_source_id), String(item.target_locator));
        incident = subjects.some((s) => s.anchors.some((a) => a.source_id === item.target_source_id && a.start_byte < span.end && span.start < a.end_byte));
      }
      if (!incident) continue;
      const pointer = `/relation_proposals/${i}`, reference = `${rawPath}#${pointer}@${materialHash(bytes)}`;
      if (historical && !historical.relation_context.some((c) => c.reference === reference)) continue;
      const fields = ['owner_stage', 'family', 'type', 'source_kind', 'source_id', 'target_kind', 'target_id', 'target_source_id',
        'target_locator', 'target_span_hash', 'record_state', 'null_reason', 'basis_packet_ids', 'proposed_by'] as const;
      const projection = { subject: { format: RELATION_REVIEW_SUBJECT_FORMAT, ...Object.fromEntries(fields.map((key) => [key, item[key]])) },
        review_subject_digest: item.review_subject_digest, material_use: item.material_use } as unknown as RelationProjection;
      const row = semanticRelationRow(projection), problems = relationProposalProblems(model, row, true);
      requireDuplicate(request.stage === item.owner_stage && problems.length === 0, 'DUP_REFERENCE', reference, problems.join('; ') || 'original stage differs');
      requireDuplicate(semanticJson(projection.subject) === relationReviewSubjectJson(row.values), 'DUP_SUBJECT', reference, 'exact Slice 4 subject required');
      validateMaterialUseInput(projection.material_use);
      const p = projection.subject, target_units = ['CC', 'PKT'].includes(p.target_kind) ? [definition(model, p.target_id)] : [];
      const targetPackets = unique(target_units.flatMap((u) => u.kind === 'PKT' ? [u.id] : (u.projection as { packets: string[] }).packets));
      const target_packet_context = semanticPacketBasis(model, targetPackets);
      const loci = p.target_kind === 'source-locus' ? [{ source_id: p.target_source_id, locator: p.target_locator }]
        : target_packet_context.map((packet) => ({ source_id: packet.packet.source_id, locator: packet.packet.locator }));
      const inputs = loci.map((locus, index) => {
        const span = sourceSpan(model, locus.source_id, locus.locator);
        add(span.path, `bytes:${span.start}:${span.end}`, 'inspection-context');
        return { anchor_id: `A${index + 1}`, ...locus, start_byte: span.start, end_byte: span.end, exact_bytes_base64: span.bytes.toString('base64') };
      });
      const target_anchors = completeSemanticAnchors(model, inputs, targetPackets);
      for (const target of target_units.filter((u) => u.kind === 'CC')) {
        const semantic = admittedSemantic(model, target.id);
        material_views.push(...semantic.material_views);
        for (const entry of semantic.context_manifest) add(entry.path, entry.selector, entry.purpose);
      }
      relation_context.push({ reference, digest: projection.review_subject_digest, subject: projection.subject as unknown as WorkerJsonValue,
        target_units: target_units as unknown as WorkerJsonValue[], target_anchors, target_packet_context, material_use: projection.material_use });
      for (const field of [...fields, 'review_subject_digest', 'material_use']) add(rawPath, `json:${pointer}/${field}`, 'relation-context');
      for (const a of target_anchors) inspect(a.source_id, a.locator, a.start_byte, a.end_byte);
    }
  }
  for (const relation of relation_context) for (const requirement of relation.material_use.requirements) {
    requireDuplicate(material_views.some((view) => object(view.use_subject) && Array.isArray(view.use_subject.requirements)
      && view.use_subject.requirements.some((r) => semanticJson(r) === semanticJson(requirement))),
    'DUP_EVIDENCE', relation.reference, 'required relation material view absent; retain missing context before review');
  }
  for (const c of lineage_context) {
    const index = lineages.findIndex((r) => r.values.lineageId === c.lineage_id);
    const raw = readMaterialFile(model.runDir, 'ledgers/lineage.md').toString('utf8'), lines = raw.split('\n');
    const table = parseTables(raw).find((t) => t.header[0] === 'lineage_id');
    requireDuplicate(table, 'DUP_REFERENCE', 'lineage', 'lineage table absent');
    const heading = lines.slice(0, table.line - 1).reverse().find((line) => /^#{1,6} /u.test(line))?.replace(/^#{1,6} /u, '').replace(/\r$/u, '');
    requireDuplicate(heading, 'DUP_REFERENCE', 'lineage', 'literal table heading required');
    add('ledgers/lineage.md', `row:${heading}:${index}`, 'lineage-context');
  }
  for (const [index, row] of model.claims.entries()) if (memberIds.includes(row.values.claimId)) {
    // Mutable disposition columns are never part of the comparison. Exact CC
    // content is reopened from the admitting SEM and immutable projection.
    const s = subjects[memberIds.indexOf(row.values.claimId)];
    add(semanticSubjectPath(s.semantic_id), 'json:/output_binding', 'inspection-context');
  }
  context_manifest.sort((a, b) => Buffer.compare(Buffer.from(`${a.path}\0${a.selector}`), Buffer.from(`${b.path}\0${b.selector}`)));
  return { members, semantic_projections: subjects.map(semanticOriginProjection), packet_basis, sources,
    occurrences: packetOccurrences(model, packet_basis), lineage_context, relation_context, ambiguity_context,
    material_views: unique(material_views), inspection_anchors: unique(inspection_anchors), context_manifest };
}

export function emptyDuplicateLedger(): DuplicateLedger { return { discoveries: [], proposals: [], assignments: [], results: [], decisions: [], effects: [] }; }
export function duplicateLedgerMarkdown(ledger: DuplicateLedger): string {
  return `# Duplicate review\n\nduplicate_review_format: ${DUPLICATE_FORMAT}\n\n`
    + (Object.keys(DUPLICATE_HEADERS) as Array<keyof DuplicateLedger>).map((key) =>
      `## ${key}\n\n${materialTableMarkdown([...DUPLICATE_HEADERS[key]], ledger[key])}`).join('\n');
}
export function parseDuplicateLedger(raw: string): DuplicateLedger {
  requireDuplicate((raw.match(/^duplicate_review_format: aleph-duplicate-review\/v1\r?$/gmu) || []).length === 1,
    'DUP_FORMAT', DUPLICATE_PATH, 'exact single format marker required');
  const tables = parseTables(raw), ledger = emptyDuplicateLedger();
  requireDuplicate(tables.length === 6, 'DUP_FORMAT', DUPLICATE_PATH, 'exact six tables required');
  for (const [i, key] of (Object.keys(DUPLICATE_HEADERS) as Array<keyof DuplicateLedger>).entries()) {
    equal(tables[i].header, DUPLICATE_HEADERS[key], 'DUP_FORMAT', key);
    const idSet = new Set<string>();
    ledger[key] = tables[i].rows.map((row) => {
      requireDuplicate(row.cells.length === DUPLICATE_HEADERS[key].length && !idSet.has(row.cells[0]), 'DUP_ACCOUNTING', key, 'duplicate ID or malformed row');
      idSet.add(row.cells[0]); return Object.fromEntries(DUPLICATE_HEADERS[key].map((h, i) => [h, decode(row.cells[i])]));
    });
  }
  return ledger;
}
export function duplicateStage(model: RunModel): number {
  let stage = -1;
  const path = 'control/run-state.json';
  if (existsSync(join(model.runDir, path))) {
    const state = parseStrictJson(readMaterialFile(model.runDir, path));
    requireDuplicate(object(state) && object(state.identity) && object(state.execution)
      && state.run_id === model.manifest?.runId && state.identity.run_format_version === model.manifest?.runFormatVersion,
    'DUP_STATE', path, 'retained execution identity differs');
    requireDuplicate(typeof state.execution.stage === 'string' && /^S(?:[0-9]|1[0-3])[ab]?$/u.test(state.execution.stage),
      'DUP_STATE', path, 'invalid retained stage');
    stage = Number.parseInt(state.execution.stage.slice(1), 10);
  }
  for (const event of runLogEvents(model.runLog)) if (/^S(?:[0-9]|1[0-3])[ab]?$/u.test(event.stage)) stage = Math.max(stage, Number.parseInt(event.stage.slice(1), 10));
  return stage;
}
export function duplicateClosureHash(model: RunModel): string | null {
  const lines = model.runLog?.lines || [], matches = lines.map((line, i) => ({ line, i })).filter(({ line }) => /^\s*duplicate_review_closure_hash:/u.test(line));
  requireDuplicate(matches.length <= 1, 'DUP_WINDOW', 'C1', 'duplicate closure field');
  if (!matches.length) return null;
  const { line, i } = matches[0], match = /^duplicate_review_closure_hash: (sha256:[0-9a-f]{64})\r?$/u.exec(line);
  const events = runLogEvents(model.runLog), event = events.filter((e) => e.line <= i).at(-1);
  const end = events.find((e) => e.line > i)?.line || lines.length + 1;
  const body = lines.slice((event?.line || 1) - 1, end - 1).join('\n');
  requireDuplicate(match && event?.stage === 'S4' && /^closure_phase: S4-C1-relations-closed\r?$/mu.test(body),
    'DUP_WINDOW', 'C1', 'exact additional field inside existing C1 event required');
  return match[1];
}
export function assertDuplicateWindow(model: RunModel): void {
  requireDuplicate(hasRunCapability(model.manifest?.runFormatVersion || '', 'duplicate-overlap-review'), 'DUP_COMPATIBILITY', 'run', 'active capability required');
  requireDuplicate(duplicateStage(model) === 4 && duplicateClosureHash(model) === null
    && !/^closure_phase: S4-C1-relations-closed\r?$/mu.test(model.runLog?.text || ''), 'DUP_WINDOW', 'S4', 'duplicate writes require open S4 before C1');
  requireDuplicate(runLogEvents(model.runLog).some((e) => e.stage === 'S3' && /^(exit|closed|closure)\b/u.test(e.event)),
    'DUP_WINDOW', 'S3', 'retained S3 closure required');
}

export const DUPLICATE_LENS = 'L3 — duplicate-versus-overlap refutation (1.8)';
export function duplicatePromptRequirements(task: DuplicateTask): Array<{ path: string; selector: string }> {
  const preamble = { path: 'docs/architecture/prompts/README.md', selector: 'fence:Common preamble (include verbatim in every call)' };
  const frame = { path: 'docs/architecture/prompts/verifier-lenses.md', selector: 'fence:Common verifier frame (verbatim, after the common preamble)' };
  const charter = task === 'refutation' ? { path: 'docs/architecture/prompts/verifier-lenses.md', selector: `heading:${DUPLICATE_LENS}` }
    : task === 'contradiction-discovery' ? { path: 'docs/architecture/prompts/verifier-lenses.md', selector: 'heading:L5 — contradiction discovery (1.8)' }
      : { path: 'docs/architecture/prompts/workers-judgment.md', selector: `heading:Merge Judge ${task} (1.8)` };
  return [preamble, ...(['refutation', 'contradiction-discovery'].includes(task) ? [frame] : []), charter,
    { path: 'docs/architecture/04-pipeline-stages-and-dod.md', selector: 'heading:S4 duplicate and overlap review (1.8)' },
    { path: 'docs/architecture/templates/03-extraction-claims.md', selector: 'heading:T3.8 Duplicate review (1.8)' },
    { path: 'docs/architecture/prompts/README.md', selector: 'fence:Material constraints (run format 1.6)' }];
}
function pinnedPrompts(model: RunModel, task: DuplicateTask): SemanticSubject['prompt_parts'] {
  const identity = model.manifest!.forwardIdentity, root = 'control/runtime/bundle';
  const raw = readMaterialFile(model.runDir, `${root}/bundle.lock.json`), lock = parseStrictJson(raw) as BundleLock, sealed = resealBundleLock(lock);
  requireDuplicate(raw.equals(bundleLockBytes(lock)) && sealed.lock_digest === lock.lock_digest && sealed.bundle.digest === lock.bundle.digest
    && lock.bundle.digest === identity.bundleDigest && lock.core.tree_digest === identity.coreDigest && lock.checker_digest === identity.checkerDigest,
  'DUP_SUBJECT', root, 'exact immutable run lock required');
  return duplicatePromptRequirements(task).map((part) => {
    const files = lock.files.filter((f) => f.path === part.path && f.classification === 'core'), bytes = readMaterialFile(model.runDir, `${root}/${part.path}`);
    requireDuplicate(files.length === 1 && materialHash(bytes) === files[0].digest, 'DUP_SUBJECT', part.path, 'pinned Core part differs');
    return { ...part, digest: materialHash(selectSemanticCorePart(bytes, part.selector)) };
  });
}
export function validateDuplicateReviewerProfile(value: unknown, model: RunModel): asserts value is DuplicateReviewerProfile {
  if (model.manifest?.mode === 'manual') requireDuplicate(object(value)
    && semanticJson(Object.keys(value)) === semanticJson(['profile_id', 'profile_digest', 'role', 'model_identity']),
  'DUP_ISOLATION', 'manual profile', 'exact four-key Q8-MANUAL profile required');
  keys(value, ['profile_id', 'profile_digest', 'role', 'model_identity'], 'reviewer_profile');
  requireDuplicate(value.role === 'verifier-l3' && model.manifest && forwardExecutionIdentityProblems(model.manifest).length === 0,
    'DUP_ISOLATION', 'reviewer_profile', 'retained run identity and L3 role required');
  if (model.manifest.mode === 'manual') {
    equal(value, { profile_id: 'n/a (core-manual)', profile_digest: null, role: 'verifier-l3', model_identity: 'human' }, 'DUP_ISOLATION', 'manual profile');
    return;
  }
  requireDuplicate(['agent', 'hybrid'].includes(model.manifest.mode), 'DUP_ISOLATION', 'mode', 'known retained execution mode required');
  hash(value.profile_digest, 'profile_digest'); text(value.profile_id, 'profile_id');
  requireDuplicate(object(value.model_identity), 'DUP_ISOLATION', 'model_identity', 'exact pinned model object required');
  equal(Object.keys(value.model_identity).sort(), ['provider', 'model_id', 'resolved_version', 'identity_kind', 'immutable', 'context', 'effort', 'budget', 'cache', 'batch', 'fallback'].sort(), 'DUP_ISOLATION', 'model_identity');
  const identity = model.manifest.forwardIdentity, snapshot = parseStrictJson(readMaterialFile(model.runDir, identity.runtimeSnapshotRef));
  requireDuplicate(object(snapshot) && object(snapshot.profile), 'DUP_SUBJECT', 'snapshot', 'retained profile required');
  const { tree_digest, ...snapshotBasis } = snapshot;
  requireDuplicate(tree_digest === identity.runtimeSnapshotDigest && materialHash(canonicalJsonBytes(snapshotBasis)) === tree_digest
    && snapshot.profile.id === value.profile_id && snapshot.profile.digest === value.profile_digest
    && identity.adapterProfile === `${value.profile_id} @ ${value.profile_digest}`, 'DUP_SUBJECT', 'profile', 'snapshot/run profile differs');
  let path = String(snapshot.profile.path);
  if (isAbsolute(path)) {
    requireDuplicate(object(snapshot.bundle) && typeof snapshot.bundle.root === 'string', 'DUP_SUBJECT', path, 'retained bundle root required');
    const rel = relative(snapshot.bundle.root, path).replaceAll('\\', '/');
    requireDuplicate(rel && !rel.startsWith('../') && !isAbsolute(rel), 'DUP_SUBJECT', path, 'profile outside bundle');
    path = `control/runtime/bundle/${rel}`;
  }
  const bytes = readMaterialFile(model.runDir, path), profile = parseStrictJson(bytes);
  requireDuplicate(materialHash(bytes) === value.profile_digest && object(profile) && object(profile.role_mappings), 'DUP_SUBJECT', path, 'profile bytes differ');
  const mapping = profile.role_mappings['verifier-l3'], producer = profile.role_mappings['merge-judge'];
  requireDuplicate(object(mapping) && object(producer), 'DUP_ISOLATION', path, 'registered L3 and merge-judge mappings required');
  const efforts = ['low', 'medium', 'high', 'xhigh', 'max'];
  requireDuplicate(efforts.includes(String(producer.effort)) && efforts.indexOf(String(mapping.effort)) >= efforts.indexOf(String(producer.effort)),
    'DUP_ISOLATION', 'effort', 'reviewer effort below producer');
  const m = value.model_identity;
  requireDuplicate(m.context === mapping.context_policy && m.effort === mapping.effort && m.budget === mapping.budget_policy
    && m.cache === mapping.cache_policy && m.batch === mapping.batch_policy && m.immutable === true && m.fallback === false,
  'DUP_ISOLATION', 'model', 'unpinned context/effort/fallback');
  for (const declaration of [identity.modelIds, identity.modelExecutionMapping]) {
    const mapping = parseStrictJson(declaration); requireDuplicate(object(mapping), 'DUP_ISOLATION', 'model mapping', 'object required');
    equal(mapping['verifier-l3'], m, 'DUP_ISOLATION', 'model mapping');
  }
}
export function duplicateProducerBinding(tuple: unknown): string {
  keys(tuple, ['call_id', 'context_id', 'raw_return_hash', 'output_kind', 'output_index'], 'producer tuple');
  text(tuple.call_id, 'call_id'); text(tuple.context_id, 'context_id'); hash(tuple.raw_return_hash, 'raw_return_hash');
  oneOf(tuple.output_kind, ['duplicate-discovery', 'duplicate-proposal'], 'output_kind');
  requireDuplicate(tuple.output_index === 0, 'DUP_FORMAT', 'output_index', 'exact zero selector required');
  return materialHash(semanticJson(tuple));
}
function retainedProducerDelivery(model: RunModel, task: 'discovery' | 'comparison', tuple: Record<string, unknown>, shown: Buffer): void {
  const callId = String(tuple.call_id), paths = duplicateProducerPaths(callId);
  requireDuplicate(readMaterialFile(model.runDir, paths.view).equals(shown), 'DUP_SUBJECT', paths.view, 'retained actual producer view differs');
  if (!['agent', 'hybrid'].includes(model.manifest!.mode)) return;
  const root = `control/worker-bundles/${callId}`;
  const request = parseStrictJson(readMaterialFile(model.runDir, `${root}/request.json`));
  const report = parseStrictJson(readMaterialFile(model.runDir, `control/worker-returns/${callId}/validation.json`));
  const dispatch = parseStrictJson(readMaterialFile(model.runDir, `control/worker-returns/${callId}/native-dispatch.json`));
  requireDuplicate(object(request) && request.kind === 'producer' && request.role === 'merge-judge' && request.stage === 'S4'
    && request.run_id === model.manifest!.runId && request.task_line === DUPLICATE_TASKS[task]
    && object(report) && report.result === 'PASS' && report.call_id === callId && report.raw_digest === tuple.raw_return_hash
    && object(dispatch) && object(dispatch.receipt) && dispatch.receipt.call_id === callId && dispatch.receipt.context_id === tuple.context_id,
  'DUP_ISOLATION', root, 'actual accepted merge-judge request, return and context required');
  const allowlist = request.allowlist;
  requireDuplicate(Array.isArray(allowlist) && allowlist.length === 1 && object(allowlist[0])
    && allowlist[0].run_path === paths.view && allowlist[0].digest === materialHash(shown)
    && typeof allowlist[0].attachment_path === 'string'
    && readMaterialFile(model.runDir, `${root}/${allowlist[0].attachment_path}`).equals(shown),
  'DUP_ISOLATION', root, 'actual producer attachment set differs');
}
export function duplicateSweepView(model: RunModel, catalogue: DuplicateDiscovery['catalogue']): Buffer {
  const sourceIds = unique(catalogue.flatMap((c) => c.source_ids));
  const sources = sourceIds.map((id) => {
    const s = model.corpus.sources.find((r) => r.values.sourceId === id)!.values;
    return { source_id: id, locus: s.locus, scheme: s.scheme, content_hash: s.contentHash, kind: s.kind, trust_class: s.trustClass };
  });
  return Buffer.from(semanticJson({ claims: catalogue.map((c) => ({ claim_id: c.claim_id, ...c.claim_projection })), sources }));
}
export function buildDuplicateSubject(model: RunModel, input: Pick<DuplicateSubject, 'proposal_id' | 'predecessor_proposal_id'
  | 'producer_binding_hash' | 'proposal' | 'reservation' | 'reviewer_profile'>): DuplicateSubject {
  assertDuplicateWindow(model);
  const basis = buildComparisonBasis(model, input.proposal.member_ids);
  const subject: DuplicateSubject = { format: DUPLICATE_SUBJECT_FORMAT, proposal_id: input.proposal_id, owner_stage: 'S4',
    predecessor_proposal_id: input.predecessor_proposal_id, run_binding: semanticRunBinding(model),
    producer_binding_hash: input.producer_binding_hash, proposal: input.proposal, comparison_basis: basis,
    comparison_fields: duplicateComparisonFields(basis), reservation: input.reservation,
    prompt_parts: pinnedPrompts(model, 'refutation'), reviewer_profile: input.reviewer_profile, context_manifest: basis.context_manifest };
  validateDuplicateSubject(subject, model, true);
  return subject;
}
export function validateDuplicateSubject(value: unknown, model: RunModel, fresh = false): asserts value is DuplicateSubject {
  keys(value, ['format', 'proposal_id', 'owner_stage', 'predecessor_proposal_id', 'run_binding', 'producer_binding_hash', 'proposal',
    'comparison_basis', 'comparison_fields', 'reservation', 'prompt_parts', 'reviewer_profile', 'context_manifest'], 'subject');
  requireDuplicate(value.format === DUPLICATE_SUBJECT_FORMAT && value.owner_stage === 'S4' && semanticId(value.proposal_id, 'DUP')
    && (value.predecessor_proposal_id === null || semanticId(value.predecessor_proposal_id, 'DUP')), 'DUP_FORMAT', 'subject', 'exact format/stage/identity required');
  hash(value.producer_binding_hash, 'producer_binding_hash');
  equal(value.run_binding, semanticRunBinding(model), 'DUP_SUBJECT', 'run pins');
  validateDuplicateReviewerProfile(value.reviewer_profile, model);
  equal(value.prompt_parts, pinnedPrompts(model, 'refutation'), 'DUP_SUBJECT', 'prompt parts');
  keys(value.comparison_basis, ['members', 'semantic_projections', 'packet_basis', 'sources', 'occurrences', 'lineage_context',
    'relation_context', 'ambiguity_context', 'material_views', 'inspection_anchors', 'context_manifest'], 'comparison_basis');
  const subject = value as unknown as DuplicateSubject, basis = subject.comparison_basis;
  validateDuplicateProposal(subject.proposal, basis, subject.comparison_fields);
  const computed = buildComparisonBasis(model, subject.proposal.member_ids, fresh ? undefined : basis);
  equal(basis, computed, 'DUP_SUBJECT', 'complete comparison basis');
  equal(subject.comparison_fields, duplicateComparisonFields(basis), 'DUP_ACCOUNTING', 'comparison field enumeration');
  equal(subject.context_manifest, basis.context_manifest, 'DUP_SUBJECT', 'context_manifest');
  if (subject.proposal.treatment === 'keep-separate') requireDuplicate(subject.reservation === null, 'DUP_STATE', 'reservation', 'no reservation for separate claims');
  else {
    keys(subject.reservation, ['lineage_id', 'successor_id', 'lineage_type', 'predecessor_ids'], 'reservation');
    requireDuplicate(/^LIN-\d+$/u.test(String(subject.reservation.lineage_id)) && /^CC-\d+$/u.test(String(subject.reservation.successor_id)),
      'DUP_REFERENCE', 'reservation', 'existing new successor/lineage namespaces required');
    equal(subject.reservation.predecessor_ids, subject.proposal.member_ids, 'DUP_REFERENCE', 'reserved predecessors');
    requireDuplicate(subject.reservation.lineage_type === subject.proposal.successor_request!.lineage_type && !subject.proposal.member_ids.includes(subject.reservation.successor_id),
      'DUP_REFERENCE', 'reservation', 'new identity and reviewed type required');
    if (fresh) requireDuplicate(!model.claims.some((r) => r.values.claimId === subject.reservation!.successor_id)
      && !parseLineage(model).rows.some((r) => r.values.lineageId === subject.reservation!.lineage_id),
    'DUP_REFERENCE', 'reservation', 'new reservations cannot reuse admitted definitions');
  }
  if (fresh) assertDuplicateWindow(model);
}
export function duplicateAttachmentPaths(subject: DuplicateSubject): string[] {
  const paths = [duplicatePath('subjects', subject.proposal_id)];
  for (const m of subject.comparison_basis.material_views) {
    const view = m.view as Record<string, WorkerJsonValue>;
    for (const asset of (Array.isArray(view.assets) ? view.assets : []) as Array<Record<string, WorkerJsonValue>>)
      if (typeof asset.locus === 'string' && typeof asset.bytes_base64 === 'string') paths.push(asset.locus);
  }
  return unique(paths).sort((a, b) => Buffer.compare(Buffer.from(a), Buffer.from(b)));
}
export function validateDuplicateAttachmentDelivery(subject: DuplicateSubject, task: string, attachments: Array<{ path: string; bytes: Buffer }>): void {
  requireDuplicate(task === DUPLICATE_TASKS.refutation, 'DUP_ISOLATION', 'task', 'exact fixed L3 task required');
  equal(attachments.map((a) => a.path).sort(), duplicateAttachmentPaths(subject).sort(), 'DUP_ISOLATION', 'actual attachment set');
  for (const a of attachments) {
    if (a.path === duplicatePath('subjects', subject.proposal_id)) requireDuplicate(a.bytes.equals(Buffer.from(semanticJson(subject))), 'DUP_SUBJECT', a.path, 'delivered subject changed');
    else {
      const assets = subject.comparison_basis.material_views.flatMap((m) => {
        const view = m.view as Record<string, WorkerJsonValue>; return (Array.isArray(view.assets) ? view.assets : []) as Array<Record<string, WorkerJsonValue>>;
      });
      const asset = assets.find((v) => v.locus === a.path);
      requireDuplicate(asset && typeof asset.bytes_base64 === 'string' && a.bytes.equals(Buffer.from(asset.bytes_base64, 'base64')),
        'DUP_EVIDENCE', a.path, 'actual material asset differs');
    }
  }
}
export function duplicateAdmissionProblems(subject: DuplicateSubject, verdict: DuplicateVerdict | null): string[] {
  const p = subject.proposal, errors: string[] = [];
  if (verdict !== 'upheld') errors.push('round-one and DDR upheld required');
  if (p.review_mode !== 'proposal' || p.outcome !== 'duplicate' || p.treatment !== 'new-successor') errors.push('reviewed new duplicate successor required');
  if (p.contradiction_pairs.length || p.unresolved_findings.length) errors.push('contradiction or unresolved finding blocks absorption');
  if (p.distinctions.some((d) => d.treatment === 'CANNOT_DETERMINE' || d.retained_at === 'separate-claims')) errors.push('surviving separate or unknown distinction');
  if (p.origin_assessment.corroboration === 'CANNOT_DETERMINE' || p.origin_assessment.unresolved_finding_refs.length) errors.push('binary reviewed origin required');
  return errors;
}
function newDuplicateBasis(next: ComparisonBasis, prior: ComparisonBasis): boolean {
  const content = (basis: ComparisonBasis): unknown => {
    const { context_manifest, inspection_anchors, ambiguity_context, ...rest } = basis;
    return { ...rest, ambiguity_context: ambiguity_context.filter((c) => !c.reference.startsWith('verification/harness/duplicate-')) };
  };
  if (semanticJson(content(next)) !== semanticJson(content(prior))) return true;
  const shown = [...prior.inspection_anchors, ...prior.semantic_projections.flatMap((s) => s.anchors),
    ...prior.relation_context.flatMap((r) => r.target_anchors)];
  return next.inspection_anchors.some((a) => !shown.some((p) => p.source_id === a.source_id
    && p.source_hash === a.source_hash && p.start_byte <= a.start_byte && p.end_byte >= a.end_byte));
}

function s3SealRef(model: RunModel): string {
  const events = runLogEvents(model.runLog), exit = events.find((e) => e.stage === 'S3' && /^(exit|closed|closure)\b/u.test(e.event));
  requireDuplicate(exit && model.runLog, 'DUP_WINDOW', 'S3', 'closed S3 required');
  const end = events.find((e) => e.line > exit.line)?.line || model.runLog.lines.length + 1;
  const refs = model.runLog.lines.slice(exit.line, end - 1).filter((s) => s.startsWith('semantic_review_seal_ref: '));
  requireDuplicate(refs.length === 1, 'DUP_WINDOW', 'S3', 'exact semantic stage seal required');
  const reference = refs[0].slice('semantic_review_seal_ref: '.length).replace(/\r$/u, '');
  const selected = referenced(model, reference);
  requireDuplicate(selected.path === 'verification/harness/semantic-stage-seals/S3.json', 'DUP_WINDOW', 'S3', 'canonical S3 seal required');
  return reference;
}
function discoveryCatalogue(model: RunModel, claimPrefix: string[], lineagePrefix: string[]): DuplicateDiscovery['catalogue'] {
  equal(claimPrefix, model.claims.slice(0, claimPrefix.length).map((r) => r.values.claimId), 'DUP_REFERENCE', 'claim prefix');
  const lineages = parseLineage(model).rows;
  equal(lineagePrefix, lineages.slice(0, lineagePrefix.length).map((r) => r.values.lineageId), 'DUP_REFERENCE', 'lineage prefix');
  const terminal = new Set(lineages.slice(0, lineagePrefix.length).flatMap((r) => ids(r.values.predecessors)));
  return claimPrefix.filter((id) => !terminal.has(id)).map((claim_id) => {
    const projection = claimProjection(model, claim_id), s = admittedSemantic(model, claim_id);
    return { claim_id, claim_projection: projection, semantic_id: s.semantic_id, semantic_subject_digest: materialHash(semanticJson(s)),
      packet_ids: projection.packets, source_ids: projection.sources };
  });
}
export function buildDuplicateDiscovery(model: RunModel, input: Pick<DuplicateDiscovery, 'discovery_id' | 'windows' | 'candidates' | 'sweep_refs' | 'unresolved_findings'>): DuplicateDiscovery {
  assertDuplicateWindow(model);
  const lineages = parseLineage(model).rows, claim_prefix_ids = model.claims.map((r) => r.values.claimId), lineage_prefix_ids = lineages.map((r) => r.values.lineageId);
  const catalogue = discoveryCatalogue(model, claim_prefix_ids, lineage_prefix_ids);
  const d: DuplicateDiscovery = { format: DUPLICATE_DISCOVERY_FORMAT, discovery_id: input.discovery_id, run_binding: semanticRunBinding(model),
    inventory_basis: { s3_seal_ref: s3SealRef(model), claim_prefix_ids, lineage_prefix_ids, lineage_prefix_digest: materialHash(semanticJson(lineages.map((r) => r.cells.map(decode)))) },
    catalogue_digest: materialHash(semanticJson(catalogue)), catalogue,
    producer_binding_hash: materialHash(semanticJson(input.windows.map((w) => ({ window_id: w.window_id, producer_binding_hash: w.producer_binding_hash })))),
    windows: input.windows, candidates: input.candidates, sweep_refs: input.sweep_refs, unresolved_findings: input.unresolved_findings };
  validateDuplicateDiscovery(d, model, true); return d;
}
export function validateDuplicateDiscovery(value: unknown, model: RunModel, fresh = false): asserts value is DuplicateDiscovery {
  keys(value, ['format', 'discovery_id', 'run_binding', 'inventory_basis', 'catalogue_digest', 'catalogue', 'producer_binding_hash',
    'windows', 'candidates', 'sweep_refs', 'unresolved_findings'], 'discovery');
  requireDuplicate(value.format === DUPLICATE_DISCOVERY_FORMAT && semanticId(value.discovery_id, 'DCD'), 'DUP_FORMAT', 'discovery', 'format/ID differs');
  equal(value.run_binding, semanticRunBinding(model), 'DUP_SUBJECT', 'discovery run pins');
  keys(value.inventory_basis, ['s3_seal_ref', 'claim_prefix_ids', 'lineage_prefix_ids', 'lineage_prefix_digest'], 'inventory_basis');
  const d = value as unknown as DuplicateDiscovery;
  strings(d.inventory_basis.claim_prefix_ids, 'claim prefix'); strings(d.inventory_basis.lineage_prefix_ids, 'lineage prefix');
  requireDuplicate(d.inventory_basis.s3_seal_ref === s3SealRef(model), 'DUP_SUBJECT', 'inventory_basis', 'S3 seal differs');
  const lineages = parseLineage(model).rows;
  requireDuplicate(d.inventory_basis.lineage_prefix_digest === materialHash(semanticJson(lineages.slice(0, d.inventory_basis.lineage_prefix_ids.length).map((r) => r.cells.map(decode)))),
    'DUP_SUBJECT', 'lineage prefix', 'historical lineage bytes differ');
  if (fresh) {
    equal(d.inventory_basis.claim_prefix_ids, model.claims.map((r) => r.values.claimId), 'DUP_REFERENCE', 'current claim prefix');
    equal(d.inventory_basis.lineage_prefix_ids, lineages.map((r) => r.values.lineageId), 'DUP_REFERENCE', 'current lineage prefix');
  }
  equal(d.catalogue, discoveryCatalogue(model, d.inventory_basis.claim_prefix_ids, d.inventory_basis.lineage_prefix_ids), 'DUP_SUBJECT', 'catalogue');
  requireDuplicate(d.catalogue_digest === materialHash(semanticJson(d.catalogue)), 'DUP_SUBJECT', 'catalogue', 'digest differs');
  for (const key of ['windows', 'candidates', 'sweep_refs', 'unresolved_findings']) array(value[key], key);
  const catalogueIds = d.catalogue.map((c) => c.claim_id), covered = new Set<string>(), swept = new Set<string>();
  const returnedCandidates: Array<Omit<DuplicateCandidate, 'candidate_id'>> = [];
  const returnedFindings: DuplicateDiscovery['unresolved_findings'] = [];
  for (const [i, w] of d.windows.entries()) {
    keys(w, ['window_id', 'member_ids', 'shown_digest', 'producer_binding_hash', 'execution_evidence_ref'], 'window');
    requireDuplicate(w.window_id === `W${i + 1}`, 'DUP_REFERENCE', 'window', 'contiguous window IDs required');
    subset(w.member_ids, catalogueIds, 'window members', true); w.member_ids.forEach((id) => covered.add(id));
    const shown = d.catalogue.filter((c) => w.member_ids.includes(c.claim_id));
    equal(w.member_ids, shown.map((c) => c.claim_id), 'DUP_REFERENCE', 'ordered discovery window');
    requireDuplicate(w.shown_digest === materialHash(semanticJson(shown)), 'DUP_SUBJECT', 'window', 'exact shown window differs');
    const evidence = referenced(model, w.execution_evidence_ref), tuple = parseDuplicateJson(evidence.bytes);
    requireDuplicate(duplicateProducerBinding(tuple) === w.producer_binding_hash && object(tuple) && tuple.output_kind === 'duplicate-discovery',
      'DUP_SUBJECT', 'window', 'producer binding differs');
    retainedProducerDelivery(model, 'discovery', tuple, Buffer.from(semanticJson(shown)));
    const rawPath = evidence.path.startsWith('verification/harness/duplicate-process/')
      ? `verification/harness/duplicate-process/${tuple.call_id}.raw.json` : `control/worker-returns/${tuple.call_id}/raw.json`;
    const raw = readMaterialFile(model.runDir, rawPath);
    requireDuplicate(materialHash(raw) === tuple.raw_return_hash, 'DUP_SUBJECT', rawPath, 'producer raw return changed');
    const returned = parseDuplicateJson(raw);
    keys(returned, ['candidates', 'unresolved_findings', 'rationale', 'flags'], 'discovery return');
    array(returned.candidates, 'candidates'); array(returned.unresolved_findings, 'unresolved_findings'); rationale(returned.rationale); strings(returned.flags, 'flags');
    for (const c of returned.candidates) {
      keys(c, ['member_ids', 'basis_refs', 'signal'], 'candidate');
      subset(c.member_ids, w.member_ids, 'candidate members', true);
      requireDuplicate(c.member_ids.length >= 2, 'DUP_REFERENCE', 'candidate', 'two unique current CCs required');
      strings(c.basis_refs, 'candidate basis', true); oneOf(c.signal, ['semantic-proposal', 'identical-text', 'shared-packet'], 'signal');
      returnedCandidates.push(c as unknown as Omit<DuplicateCandidate, 'candidate_id'>);
    }
    returnedFindings.push(...returned.unresolved_findings as DuplicateDiscovery['unresolved_findings']);
  }
  equal([...covered].sort(), [...catalogueIds].sort(), 'DUP_ACCOUNTING', 'global discovery coverage');
  requireDuplicate(d.producer_binding_hash === materialHash(semanticJson(d.windows.map((w) => ({ window_id: w.window_id, producer_binding_hash: w.producer_binding_hash })))),
    'DUP_SUBJECT', 'discovery', 'aggregate producer binding differs');
  for (const [i, c] of d.candidates.entries()) {
    keys(c, ['candidate_id', 'member_ids', 'basis_refs', 'signal'], 'candidate');
    requireDuplicate(c.candidate_id === `G${i + 1}`, 'DUP_REFERENCE', 'candidate', 'contiguous candidate IDs required');
    subset(c.member_ids, catalogueIds, 'candidate members', true);
    requireDuplicate(c.member_ids.length >= 2, 'DUP_REFERENCE', 'candidate', 'two unique members required');
    strings(c.basis_refs, 'candidate basis', true); oneOf(c.signal, ['semantic-proposal', 'identical-text', 'shared-packet'], 'signal');
    for (const ref of c.basis_refs) {
      if (ref.startsWith('/catalogue/')) duplicatePointer(d, ref);
      else referenced(model, ref);
    }
  }
  // Coalescing keeps first group order and every explicit basis reference.
  const coalesced: Array<Omit<DuplicateCandidate, 'candidate_id'>> = [];
  for (const c of returnedCandidates) {
    const old = coalesced.find((old) => semanticJson(old.member_ids) === semanticJson(c.member_ids));
    if (old) old.basis_refs = unique([...old.basis_refs, ...c.basis_refs]); else coalesced.push(structuredClone(c));
  }
  const seeded = d.candidates.filter((c) => !coalesced.some((p) => semanticJson(p.member_ids) === semanticJson(c.member_ids)));
  for (const candidate of seeded) {
    requireDuplicate(candidate.signal === 'semantic-proposal' && candidate.member_ids.length === 2, 'DUP_ACCOUNTING', 'L5 seed', 'only explicit L5 pair can seed an additional candidate');
    let matched = false;
    for (const ref of candidate.basis_refs) {
      if (!ref.includes('#/flagged_pairs/')) continue;
      const selected = referenced(model, ref), pair = selected.value;
      requireDuplicate(object(pair) && semanticJson([pair.a, pair.b]) === semanticJson(candidate.member_ids), 'DUP_REFERENCE', 'L5 seed', 'exact flagged pair required');
      const rows = parseDuplicateLedger(readMaterialFile(model.runDir, DUPLICATE_PATH).toString('utf8')).discoveries;
      const currentIndex = rows.findIndex((row) => row.discovery_id === d.discovery_id);
      const prior = currentIndex < 0 ? rows : rows.slice(0, currentIndex);
      requireDuplicate(prior.some((row) => {
        const old = parseDuplicateJson(readMaterialFile(model.runDir, row.record_path)) as DuplicateDiscovery;
        return old.sweep_refs.some((s) => s.result_ref.split('@')[0] === selected.path);
      }), 'DUP_REFERENCE', 'L5 seed', 'flagged pair requires an earlier retained discovery sweep');
      matched = true;
    }
    requireDuplicate(matched, 'DUP_ACCOUNTING', 'L5 seed', 'orchestrator cannot derive pair from prose');
  }
  requireDuplicate(d.candidates.length === coalesced.length + seeded.length, 'DUP_ACCOUNTING', 'candidates', 'repeated retained candidate group');
  equal(d.candidates.slice(0, coalesced.length).map(({ candidate_id, ...c }) => c), coalesced, 'DUP_ACCOUNTING', 'retained discovered candidates');
  for (const sweep of d.sweep_refs) {
    keys(sweep, ['review_id', 'verifier_ref', 'result_ref', 'window_member_ids', 'shown_digest'], 'sweep');
    subset(sweep.window_member_ids, catalogueIds, 'sweep members', true); sweep.window_member_ids.forEach((id) => swept.add(id));
    const ver = referenced(model, sweep.verifier_ref), result = referenced(model, sweep.result_ref);
    const record = parseStructuredVerifierRecord(ver.bytes, ver.path), returned = parseStrictJson(result.bytes);
    requireDuplicate(record.lens === 'L5' && record.stage === 'S4' && ver.path === `verification/harness/S4/${sweep.review_id}.md`,
      'DUP_ISOLATION', sweep.review_id, 'independent L5 companion required');
    requireDuplicate(object(returned) && Array.isArray(returned.flagged_pairs), 'DUP_REVIEW', sweep.review_id, 'structured L5 flagged pairs required');
    requireDuplicate(record.verdict === returned.verdict && (returned.verdict === 'refuted' || returned.flagged_pairs.length === 0),
      'DUP_REVIEW', sweep.review_id, 'L5 result/companion differs');
    for (const pair of returned.flagged_pairs) {
      keys(pair, ['a', 'b', 'why'], 'L5 flagged pair');
      requireDuplicate(pair.a !== pair.b && sweep.window_member_ids.includes(String(pair.a)) && sweep.window_member_ids.includes(String(pair.b)), 'DUP_REFERENCE', 'L5 pair', 'explicit current pair required');
      text(pair.why, 'why');
    }
    const shown = duplicateSweepView(model, d.catalogue.filter((c) => sweep.window_member_ids.includes(c.claim_id)));
    equal(sweep.window_member_ids, d.catalogue.filter((c) => sweep.window_member_ids.includes(c.claim_id)).map((c) => c.claim_id), 'DUP_REFERENCE', 'ordered sweep window');
    requireDuplicate(sweep.shown_digest === materialHash(shown), 'DUP_SUBJECT', 'L5 shown digest', 'exact independent inventory view required');
    const shownRecord = referenced(model, record.shown);
    requireDuplicate(shownRecord.bytes.equals(shown), 'DUP_ISOLATION', 'L5 shown', 'retained sweep view contains unrelated or missing context');
    if (['agent', 'hybrid'].includes(model.manifest!.mode)) {
      const match = /^control\/worker-returns\/([^/]+)\/raw\.json$/u.exec(result.path);
      requireDuplicate(match, 'DUP_ISOLATION', 'L5', 'actual accepted L5 return required');
      const root = `control/worker-bundles/${match[1]}`, request = parseStrictJson(readMaterialFile(model.runDir, `${root}/request.json`));
      const report = parseStrictJson(readMaterialFile(model.runDir, `control/worker-returns/${match[1]}/validation.json`));
      requireDuplicate(object(request) && request.role === 'verifier-l5' && request.stage === 'S4' && request.task_line === DUPLICATE_TASKS['contradiction-discovery']
        && object(request.isolation) && request.isolation.fresh_context === true && request.isolation.inherit_context === false
        && object(report) && report.result === 'PASS' && report.raw_digest === materialHash(result.bytes)
        && Array.isArray(request.allowlist) && request.allowlist.length === 1 && object(request.allowlist[0])
        && request.allowlist[0].digest === materialHash(shown) && typeof request.allowlist[0].attachment_path === 'string'
        && readMaterialFile(model.runDir, `${root}/${request.allowlist[0].attachment_path}`).equals(shown),
      'DUP_ISOLATION', 'L5', 'independent accepted sweep over exact view required');
    }
  }
  equal([...swept].sort(), [...catalogueIds].sort(), 'DUP_ACCOUNTING', 'independent L5 inventory coverage');
  for (const f of d.unresolved_findings) {
    keys(f, ['member_ids', 'missing', 'requested_context'], 'discovery finding');
    subset(f.member_ids, catalogueIds, 'finding members'); text(f.missing, 'missing'); requestedContext(f.requested_context);
    for (const request of f.requested_context) sourceSpan(model, request.source_id, request.locator);
  }
  requireDuplicate(returnedFindings.every((f) => d.unresolved_findings.some((r) => semanticJson(r) === semanticJson(f))),
    'DUP_ACCOUNTING', 'discovery findings', 'producer finding lost');
  const pairs = duplicatePairs(catalogueIds);
  if (pairs.some((p) => !d.windows.some((w) => w.member_ids.includes(p.a) && w.member_ids.includes(p.b))))
    requireDuplicate(d.unresolved_findings.length > 0, 'DUP_ACCOUNTING', 'window schedule', 'unexamined cross-window combinations require retained limitation');
}

export function deriveDuplicateExecution(model: RunModel, subject: DuplicateSubject, assignment: DuplicateAssignment, reference: string, producer: { call_id: string; context_id: string }): SemanticExecution {
  const evidence = referenced(model, reference), digest = materialHash(semanticJson(subject));
  if (evidence.path.startsWith('verification/harness/duplicate-process/') && evidence.path.endsWith('.md')) {
    const record = parseStructuredVerifierRecord(evidence.bytes, evidence.path);
    requireDuplicate(record.target === `duplicate-review-subject:${digest}` && record.lens === 'L3' && record.stage === subject.owner_stage,
      'DUP_REVIEW', evidence.path, 'static record binding differs');
    return 'static-record';
  }
  const record = parseStrictJson(evidence.bytes);
  requireDuplicate(obj(record), 'DUP_FORMAT', evidence.path, 'execution evidence object required');
  if (evidence.path.startsWith('verification/harness/duplicate-process/')) {
    requireDuplicate(model.manifest?.mode === 'manual', 'DUP_ISOLATION', evidence.path, 'manual evidence requires retained manual execution mode');
    keys(record, ['producer_actor', 'reviewer_actor', 'producer_pass_id', 'reviewer_pass_id', 'subject_digest', 'shown_digest', 'withheld_declaration'], 'manual evidence');
    Object.entries(record).forEach(([key, value]) => text(value, key));
    requireDuplicate(record.producer_actor !== record.reviewer_actor && record.producer_pass_id !== record.reviewer_pass_id
      && record.producer_pass_id === producer.context_id && record.reviewer_pass_id === assignment.invocation_id
      && record.subject_digest === digest && record.shown_digest === digest, 'DUP_ISOLATION', evidence.path, 'distinct manual actors/passes and exact shown subject required');
    return 'manual-separate-pass';
  }
  requireDuplicate(['agent', 'hybrid'].includes(model.manifest?.mode || ''), 'DUP_ISOLATION', evidence.path, 'manual evidence cannot become native or simulated dispatch');
  requireDuplicate(evidence.path === `control/worker-returns/${assignment.invocation_id}/native-dispatch.json`
    && record.format === 'aleph-loa-native-worker-dispatch/v1' && obj(record.receipt), 'DUP_ISOLATION', evidence.path, 'actual retained dispatch required');
  const receipt = record.receipt;
  requireDuplicate(receipt.call_id === assignment.invocation_id && typeof receipt.context_id === 'string'
    && receipt.context_id !== producer.context_id && receipt.producer_context_id === producer.context_id
    && receipt.fresh_context === true && receipt.inherited_context === false && receipt.filesystem === 'bundle-read-only',
  'DUP_ISOLATION', evidence.path, 'dispatch reused producer context or lost isolation');
  requireDuplicate(semanticJson(receipt.model_identity) === semanticJson(subject.reviewer_profile.model_identity), 'DUP_SUBJECT', evidence.path, 'reviewer model differs');
  const requestPath = `control/worker-bundles/${assignment.invocation_id}/request.json`;
  const request = parseStrictJson(readMaterialFile(model.runDir, requestPath));
  requireDuplicate(obj(request) && request.role === 'verifier-l3' && request.kind === 'refuter' && request.stage === subject.owner_stage
    && request.run_id === subject.run_binding.run_id && typeof request.bundle_digest === 'string'
    && Array.isArray(request.allowlist) && obj(request.isolation) && request.isolation.fresh_context === true
    && request.isolation.inherit_context === false && request.isolation.producer_context_id === producer.context_id,
  'DUP_ISOLATION', requestPath, 'wrong run, role, kind, stage or context');
  requireDuplicate(Array.isArray(request.core_parts) && request.core_parts.length === subject.prompt_parts.length,
    'DUP_SUBJECT', requestPath, 'exact sealed prompt parts required');
  request.core_parts.forEach((part, i) => {
    const expected = subject.prompt_parts[i];
    requireDuplicate(obj(part) && part.path === expected.path && part.selector === expected.selector && part.digest === expected.digest
      && typeof part.materialized_path === 'string'
      && materialHash(readMaterialFile(model.runDir, `control/worker-bundles/${assignment.invocation_id}/${part.materialized_path}`)) === expected.digest,
    'DUP_SUBJECT', requestPath, 'actual delivered prompt bytes differ from sealed subject');
  });
  const returnRoot = `control/worker-returns/${assignment.invocation_id}`;
  const invocation = parseStrictJson(readMaterialFile(model.runDir, `${returnRoot}/invocation.json`));
  requireDuplicate(obj(invocation) && invocation.invocation_digest === record.invocation_digest
    && materialHash(canonicalJsonBytes({ ...invocation, invocation_digest: '' })) === record.invocation_digest
    && invocation.request_digest === materialHash(canonicalJsonBytes(request))
    && semanticJson(invocation.request) === semanticJson(request) && invocation.worker_bundle_digest === request.bundle_digest
    && record.worker_bundle_digest === request.bundle_digest && invocation.inherit_context === false
    && invocation.require_fresh_context === true && invocation.require_exact_model_identity === true
    && Array.isArray(invocation.writable_paths) && invocation.writable_paths.length === 0
    && Array.isArray(invocation.readable_paths) && semanticJson(invocation.readable_paths) === semanticJson([invocation.worker_bundle_root])
    && semanticJson(invocation.simulation) === semanticJson(receipt.simulation)
    && semanticJson(invocation.model_identity) === semanticJson(receipt.model_identity),
  'DUP_ISOLATION', evidence.path, 'retained sealed invocation differs from actual dispatch');
  const hostBytes = readMaterialFile(model.runDir, `${returnRoot}/host-capabilities.json`);
  requireDuplicate(obj(invocation.host_capability_receipt)
    && invocation.host_capability_receipt.digest === materialHash(hostBytes)
    && record.host_capability_receipt_digest === materialHash(hostBytes),
  'DUP_SUBJECT', evidence.path, 'dispatch host receipt differs');
  const attachments = request.allowlist.map((item) => {
      requireDuplicate(obj(item) && typeof item.run_path === 'string' && typeof item.attachment_path === 'string', 'DUP_ISOLATION', requestPath, 'invalid delivered attachment');
    return { path: item.run_path, bytes: readMaterialFile(model.runDir, `control/worker-bundles/${assignment.invocation_id}/${item.attachment_path}`) };
  });
  validateDuplicateAttachmentDelivery(subject, String(request.task_line), attachments);
  const raw = readMaterialFile(model.runDir, `control/worker-returns/${assignment.invocation_id}/raw.json`);
  const returned = parseStrictJson(raw, true);
  validateDuplicateResult(returned, subject);
  const nativeReturn = readMaterialFile(model.runDir, `${returnRoot}/native-return.json`);
  requireDuplicate(materialHash(nativeReturn) === record.structured_return_digest
    && semanticJson(parseStrictJson(nativeReturn, true)) === semanticJson(returned),
  'DUP_SUBJECT', evidence.path, 'dispatched structured return differs from accepted raw return');
  requireDuplicate(readMaterialFile(model.runDir, duplicatePath('results', assignment.review_id)).equals(Buffer.from(semanticJson(returned))),
    'DUP_SUBJECT', assignment.review_id, 'retained result differs from actual reviewer return');
  const validation = parseStrictJson(readMaterialFile(model.runDir, `control/worker-returns/${assignment.invocation_id}/validation.json`));
  requireDuplicate(obj(validation) && validation.call_id === assignment.invocation_id && validation.result === 'PASS'
    && validation.raw_digest === materialHash(raw) && Array.isArray(validation.errors) && validation.errors.length === 0,
  'DUP_REVIEW', assignment.review_id, 'actual accepted-return validation absent or mismatched');
  if (obj(receipt.simulation) && receipt.simulation.kind === 'fixture-simulated') {
    requireDuplicate(record.host_evidence === null && record.event_stream_digest === null, 'DUP_ISOLATION', evidence.path, 'simulation cannot claim native host evidence');
    const state = parseStrictJson(readMaterialFile(model.runDir, 'control/run-state.json'));
    requireDuplicate(obj(state) && state.full_mode === 'fixture-simulated', 'DUP_ISOLATION', evidence.path, 'simulation outside fixture mode');
    return 'fixture-simulated';
  }
  requireDuplicate(receipt.simulation === null && obj(record.host_evidence) && typeof record.event_stream_digest === 'string',
    'DUP_ISOLATION', evidence.path, 'missing genuine retained host evidence');
  const state = parseStrictJson(readMaterialFile(model.runDir, 'control/run-state.json'));
  requireDuplicate(obj(state) && state.full_mode === 'full-aleph' && obj(receipt.model_identity)
    && receipt.model_identity.identity_kind !== 'fixture-simulated', 'DUP_ISOLATION', evidence.path, 'fixture execution cannot be relabeled native');
  const events = readMaterialFile(model.runDir, `control/worker-returns/${assignment.invocation_id}/claude-stream.jsonl`);
  requireDuplicate(materialHash(events) === record.event_stream_digest && record.host_evidence.session_id === receipt.context_id,
    'DUP_ISOLATION', evidence.path, 'native event stream/session differs');
  const host = parseStrictJson(hostBytes);
  requireDuplicate(obj(host) && obj(host.runtime) && obj(host.runtime.claude) && obj(host.runtime.sandbox)
    && record.host_evidence.event_stream_digest === materialHash(events) && record.host_evidence.event_stream_byte_length === String(events.length)
    && record.host_evidence.observed_model === receipt.model_identity.model_id && record.host_evidence.effort === receipt.model_identity.effort
    && record.host_evidence.claude_executable_digest === host.runtime.claude.digest
    && record.host_evidence.sandbox_executable_digest === host.runtime.sandbox.digest
    && record.host_evidence.sandbox_policy_digest === host.runtime.sandbox.policy_digest
    && record.host_evidence.structured_output_digest === materialHash(canonicalJsonBytes(returned)),
  'DUP_ISOLATION', evidence.path, 'native host/model/structured-output evidence differs');
  const eventRows = events.toString('utf8').split('\n').filter((line) => line.trim()).map((line) => parseStrictJson(line));
  requireDuplicate(eventRows.some((event) => obj(event) && event.type === 'result' && event.session_id === receipt.context_id
    && semanticJson(event.structured_output) === semanticJson(returned)), 'DUP_ISOLATION', evidence.path, 'native terminal event does not carry the accepted result');
  return 'native-dispatch';
}

export function validateDuplicateRun(model: RunModel): {
  discoveries: number; proposals: number; assignments: number; results: number; decisions: number; effects: number;
  pending: string[]; executions: SemanticExecution[];
} {
  requireDuplicate(hasRunCapability(model.manifest?.runFormatVersion || '', 'duplicate-overlap-review'), 'DUP_COMPATIBILITY', 'run', 'active capability required');
  const entered = duplicateStage(model) >= 4, present = existsSync(join(model.runDir, DUPLICATE_PATH));
  if (!entered) requireDuplicate(!['process', 'discovery', 'subjects', 'assignments', 'results', 'effects'].some((kind) =>
    existsSync(join(model.runDir, `verification/harness/duplicate-${kind}`))), 'DUP_WINDOW', 'S4', 'duplicate artifacts forbidden before structured S4 entry');
  const empty = { discoveries: 0, proposals: 0, assignments: 0, results: 0, decisions: 0, effects: 0, pending: [] as string[], executions: [] as SemanticExecution[] };
  if (!present) { requireDuplicate(!entered, 'DUP_FORMAT', DUPLICATE_PATH, 'ledger required on real S4 entry, including zero candidates'); return empty; }
  requireDuplicate(entered, 'DUP_WINDOW', DUPLICATE_PATH, 'duplicate artifacts forbidden before S4');
  const raw = readMaterialFile(model.runDir, DUPLICATE_PATH), ledger = parseDuplicateLedger(raw.toString('utf8'));
  const discoveries = new Map<string, DuplicateDiscovery>(), subjects = new Map<string, DuplicateSubject>();
  const assignments = new Map<string, DuplicateAssignment>(), results = new Map<string, DuplicateResult>();
  const producers = new Map<string, { call_id: string; context_id: string; raw_return_hash: string; output_kind: string; output_index: number }>();
  const pending: string[] = [], executions: SemanticExecution[] = [];
  for (const row of ledger.discoveries) {
    requireDuplicate(row.record_path === duplicatePath('discovery', row.discovery_id), 'DUP_REFERENCE', row.discovery_id, 'exact DCD path required');
    const bytes = readMaterialFile(model.runDir, row.record_path), d = parseDuplicateJson(bytes);
    validateDuplicateDiscovery(d, model);
    requireDuplicate(d.discovery_id === row.discovery_id && materialHash(bytes) === row.record_digest, 'DUP_SUBJECT', row.discovery_id, 'DCD row differs');
    discoveries.set(row.discovery_id, d);
  }
  for (const row of ledger.proposals) {
    requireDuplicate(row.subject_path === duplicatePath('subjects', row.proposal_id), 'DUP_REFERENCE', row.proposal_id, 'exact DUP path required');
    const bytes = readMaterialFile(model.runDir, row.subject_path), subject = parseDuplicateJson(bytes);
    validateDuplicateSubject(subject, model);
    requireDuplicate(subject.proposal_id === row.proposal_id && materialHash(bytes) === row.subject_digest
      && row.predecessor_proposal_id === (subject.predecessor_proposal_id || 'none'), 'DUP_SUBJECT', row.proposal_id, 'DUP row differs');
    const [dcd, group] = subject.proposal.candidate_ref.split('/'), d = discoveries.get(dcd), candidate = d?.candidates.find((c) => c.candidate_id === group);
    requireDuplicate(candidate, 'DUP_REFERENCE', row.proposal_id, 'retained candidate absent');
    equal(subject.proposal.member_ids, candidate.member_ids, 'DUP_REFERENCE', 'candidate group');
    const receipt = referenced(model, row.producer_receipt_ref), tuple = parseDuplicateJson(receipt.bytes);
    requireDuplicate(duplicateProducerBinding(tuple) === subject.producer_binding_hash && object(tuple) && tuple.output_kind === 'duplicate-proposal',
      'DUP_SUBJECT', row.proposal_id, 'actual producer tuple differs');
    const rawPath = receipt.path.startsWith('verification/harness/duplicate-process/')
      ? `verification/harness/duplicate-process/${tuple.call_id}.raw.json` : `control/worker-returns/${tuple.call_id}/raw.json`;
    const returnedBytes = readMaterialFile(model.runDir, rawPath), returned = parseStrictJson(returnedBytes, true);
    requireDuplicate(materialHash(returnedBytes) === tuple.raw_return_hash, 'DUP_SUBJECT', rawPath, 'raw producer bytes changed');
    keys(returned, ['proposal', 'rationale', 'flags'], 'comparison return');
    validateDuplicateProposal(returned.proposal, subject.comparison_basis, subject.comparison_fields); rationale(returned.rationale); strings(returned.flags, 'flags');
    equal(returned.proposal, subject.proposal, 'DUP_SUBJECT', row.proposal_id);
    retainedProducerDelivery(model, 'comparison', tuple, Buffer.from(semanticJson({
      candidate_ref: subject.proposal.candidate_ref, comparison_basis: subject.comparison_basis,
    })));
    if (subject.predecessor_proposal_id) {
      const prior = subjects.get(subject.predecessor_proposal_id);
      requireDuplicate(prior, 'DUP_REFERENCE', row.proposal_id, 'revision must point backward to retained same-run proposal');
      requireDuplicate(prior.proposal.comparison_basis_digest !== subject.proposal.comparison_basis_digest
        || semanticJson(prior.proposal) !== semanticJson(subject.proposal), 'DUP_STATE', row.proposal_id, 'digest-identical copied proposal is not new evidence');
    }
    subjects.set(row.proposal_id, subject); producers.set(row.proposal_id, tuple as unknown as { call_id: string; context_id: string; raw_return_hash: string; output_kind: string; output_index: number });
  }
  const invocationIds = new Set<string>();
  for (const row of ledger.assignments) {
    const s = subjects.get(row.proposal_id);
    requireDuplicate(s && /^VER-\d+$/u.test(row.review_id) && row.assignment_path === duplicatePath('assignments', row.review_id),
      'DUP_REVIEW', row.review_id, 'assignment lacks exact proposal/path');
    const bytes = readMaterialFile(model.runDir, row.assignment_path), value = parseDuplicateJson(bytes);
    keys(value, ['format', 'proposal_id', 'subject_digest', 'review_id', 'role', 'profile_digest', 'invocation_id', 'producer_binding_hash', 'round', 'execution_kind'], 'assignment');
    const a = value as unknown as DuplicateAssignment;
    requireDuplicate(a.format === DUPLICATE_ASSIGNMENT_FORMAT && a.proposal_id === s.proposal_id && a.review_id === row.review_id
      && a.subject_digest === materialHash(semanticJson(s)) && row.assignment_digest === materialHash(bytes)
      && a.producer_binding_hash === s.producer_binding_hash && a.profile_digest === s.reviewer_profile.profile_digest,
    'DUP_SUBJECT', row.review_id, 'assignment seal differs');
    requireDuplicate(a.role === 'verifier-l3' && !invocationIds.has(a.invocation_id), 'DUP_ISOLATION', row.review_id, 'wrong role or reused invocation');
    text(a.invocation_id, 'invocation_id'); oneOf(a.execution_kind, SEMANTIC_EXECUTIONS, 'execution_kind');
    requireDuplicate(a.round === 1 || a.round === 2, 'DUP_STATE', 'round', 'only rounds one and conditional two exist');
    invocationIds.add(a.invocation_id); assignments.set(row.review_id, a);
  }
  const contexts = new Set<string>(), manualEvidence = new Map<string, Array<Record<string, unknown>>>();
  for (const row of ledger.results) {
    const a = assignments.get(row.review_id), s = subjects.get(row.proposal_id);
    requireDuplicate(a && s && a.proposal_id === row.proposal_id && row.result_path === duplicatePath('results', row.review_id)
      && existsSync(join(model.runDir, row.result_path)), 'DUP_REVIEW', row.review_id, 'assigned result missing');
    const bytes = readMaterialFile(model.runDir, row.result_path), result = parseDuplicateJson(bytes);
    validateDuplicateResult(result, s);
    requireDuplicate(row.result_digest === materialHash(bytes), 'DUP_SUBJECT', row.review_id, 'result row digest differs');
    const companionPath = `verification/harness/S4/${row.review_id}.md`;
    requireDuplicate(existsSync(join(model.runDir, companionPath)), 'DUP_REVIEW', row.review_id, 'agreeing VER companion missing');
    const companion = parseStructuredVerifierRecord(readMaterialFile(model.runDir, companionPath), companionPath);
    requireDuplicate(companion.lens === 'L3' && companion.stage === 'S4' && companion.target === `duplicate-review-subject:${a.subject_digest}`
      && companion.verdict === result.verdict, 'DUP_REVIEW', row.review_id, 'VER companion differs');
    const kind = deriveDuplicateExecution(model, s, a, row.execution_evidence_ref, producers.get(row.proposal_id)!);
    requireDuplicate(row.execution_kind === kind && a.execution_kind === kind, 'DUP_ISOLATION', row.review_id, 'label differs from execution evidence');
    requireDuplicate(!['agent', 'hybrid'].includes(model.manifest!.mode) || ['native-dispatch', 'fixture-simulated'].includes(kind),
      'DUP_ISOLATION', row.review_id, 'manual/static evidence cannot satisfy agent freshness');
    const evidence = referenced(model, row.execution_evidence_ref), record = kind === 'static-record' ? {} : parseStrictJson(evidence.bytes) as Record<string, unknown>;
    const context = ['native-dispatch', 'fixture-simulated'].includes(kind) ? String((record.receipt as Record<string, unknown>).context_id) : a.invocation_id;
    requireDuplicate(!contexts.has(context), 'DUP_ISOLATION', row.review_id, 'reviewer context/pass reused');
    contexts.add(context);
    if (kind === 'manual-separate-pass') {
      const previous = manualEvidence.get(row.proposal_id) || [];
      requireDuplicate(previous.every((r) => r.reviewer_actor !== record.reviewer_actor && r.reviewer_pass_id !== record.reviewer_pass_id
        && r.producer_actor === record.producer_actor && r.producer_pass_id === record.producer_pass_id),
      'DUP_ISOLATION', row.review_id, 'conditional reviewer must be distinct from first reviewer and same producer');
      previous.push(record); manualEvidence.set(row.proposal_id, previous);
    }
    if (kind === 'static-record') requireDuplicate(existsSync(join(model.runDir, 'README.md'))
      && /aleph-fixture/u.test(readMaterialFile(model.runDir, 'README.md').toString('utf8')), 'DUP_ISOLATION', row.review_id, 'static evidence only in explicit fixtures');
    results.set(row.review_id, result); executions.push(kind);
  }
  const quorums = new Map<string, ReturnType<typeof duplicateQuorum>>();
  for (const [id, s] of subjects) {
    const rounds = ledger.assignments.filter((r) => r.proposal_id === id).map((r) => ({ assignment: assignments.get(r.review_id)!, result: results.get(r.review_id) }));
    quorums.set(id, duplicateQuorum(rounds));
    for (const [priorId, prior] of subjects) {
      if (priorId === id) break;
      const first = ledger.assignments.find((r) => r.proposal_id === priorId);
      if (s.proposal.treatment === 'new-successor' && first && results.get(first.review_id)?.verdict === 'cannot-determine')
        requireDuplicate(newDuplicateBasis(s.comparison_basis, prior.comparison_basis),
          'DUP_STATE', id, 'a new identity or missing predecessor link cannot erase indeterminacy over the same frozen basis');
    }
    if (s.predecessor_proposal_id) {
      const prior = subjects.get(s.predecessor_proposal_id)!;
      const first = ledger.assignments.find((r) => r.proposal_id === prior.proposal_id);
      if (first && results.get(first.review_id)?.verdict === 'cannot-determine' && s.proposal.treatment === 'new-successor')
        requireDuplicate(newDuplicateBasis(s.comparison_basis, prior.comparison_basis),
          'DUP_STATE', id, 'post-indeterminacy absorption needs new frozen basis/context, not another declaration');
    }
  }
  const decisions = new Map<string, MaterialRow>();
  for (const row of ledger.decisions) {
    const s = subjects.get(row.proposal_id), quorum = quorums.get(row.proposal_id);
    requireDuplicate(s && semanticId(row.decision_id, 'DDR') && !decisions.has(row.proposal_id), 'DUP_ACCOUNTING', row.decision_id, 'one DDR per known DUP');
    requireDuplicate(quorum?.complete, 'DUP_REVIEW', row.decision_id, 'every required assignment/result must finish before decision');
    equal(parseDuplicateJson(row.review_ids), quorum.review_ids, 'DUP_REVIEW', 'decision review IDs');
    requireDuplicate(row.verdict === quorum.verdict && row.reviewed_outcome === (quorum.verdict === 'upheld' ? s.proposal.outcome : 'none'),
      'DUP_REVIEW', row.decision_id, 'decision aggregation/outcome differs');
    decisions.set(row.proposal_id, row);
  }
  const effects = new Map<string, DuplicateEffect>();
  for (const row of ledger.effects) {
    const s = subjects.get(row.proposal_id), decision = decisions.get(row.proposal_id);
    requireDuplicate(s && !effects.has(row.proposal_id), 'DUP_ACCOUNTING', row.effect_id, 'one final effect per known proposal');
    const record = referenced(model, row.record_ref), value = parseDuplicateJson(record.bytes);
    keys(value, ['format', 'effect_id', 'proposal_id', 'subject_digest', 'decision_id', 'effect', 'reason', 'semantic_ids', 'lineage_id', 'successor_id',
      'merge_row_digest', 'provenance_union_digest', 'predecessor_proposal_id'], 'effect');
    const e = value as unknown as DuplicateEffect;
    requireDuplicate(e.format === DUPLICATE_EFFECT_FORMAT && semanticId(e.effect_id, 'DUE') && record.path === duplicatePath('effects', e.effect_id)
      && e.effect_id === row.effect_id && e.proposal_id === row.proposal_id && e.subject_digest === materialHash(semanticJson(s))
      && e.predecessor_proposal_id === s.predecessor_proposal_id, 'DUP_SUBJECT', row.effect_id, 'effect identity differs');
    oneOf(e.effect, ['canonicalized', 'kept-separate', 'not-admitted'], 'effect'); oneOf(e.reason, DUPLICATE_REASONS, 'reason'); strings(e.semantic_ids, 'semantic_ids');
    const attempts = parseSemanticLedger(readMaterialFile(model.runDir, SEMANTIC_PATH).toString('utf8')).subjects
      .filter((r) => r.owner_stage === 'S4').map((r) => parseSemanticJson(readMaterialFile(model.runDir, r.subject_path)) as SemanticSubject)
      .filter((sem) => s.reservation && sem.lineage_context.some((lineage) => lineage.lineage_id === s.reservation!.lineage_id));
    equal(e.semantic_ids, attempts.map((sem) => sem.semantic_id), 'DUP_ACCOUNTING', 'all successor attempts');
    requireDuplicate(e.provenance_union_digest === materialHash(semanticJson(s.proposal.provenance_union)), 'DUP_ACCOUNTING', row.effect_id, 'effect union differs');
    requireDuplicate(e.decision_id === (decision?.decision_id || null) && row.decision_id === (e.decision_id || 'none')
      && row.effect === e.effect && row.lineage_id === (e.lineage_id || 'none') && row.successor_id === (e.successor_id || 'none'),
    'DUP_ACCOUNTING', row.effect_id, 'effect/table/decision join differs');
    if (!decision) requireDuplicate(e.effect === 'not-admitted' && e.reason === 'withdrawn-reservation'
      && !ledger.assignments.some((r) => r.proposal_id === row.proposal_id), 'DUP_REVIEW', row.effect_id, 'withdrawal cannot evade assigned review completion');
    if (e.reason === 'reviewed-nonduplicate') requireDuplicate(decision?.verdict === 'upheld'
      && ['overlap', 'distinct'].includes(s.proposal.outcome), 'DUP_STATE', e.effect_id, 'nonduplicate reason requires reviewed nonduplicate outcome');
    if (e.reason === 'refuted-proposal') requireDuplicate(decision?.verdict === 'refuted', 'DUP_STATE', e.effect_id, 'refutation reason requires refuted DDR');
    if (e.reason === 'unresolved-origin') requireDuplicate(s.proposal.origin_assessment.corroboration === 'CANNOT_DETERMINE',
      'DUP_STATE', e.effect_id, 'unknown origin reason requires retained unknown assessment');
    if (e.reason === 'unresolved-equivalence') requireDuplicate(decision?.verdict === 'cannot-determine'
      || s.proposal.outcome === 'CANNOT_DETERMINE' || s.proposal.unresolved_findings.length > 0
      || ledger.results.some((r) => r.proposal_id === s.proposal_id && results.get(r.review_id)!.unresolved_findings.length > 0),
    'DUP_STATE', e.effect_id, 'unresolved reason requires retained uncertainty');
    if (e.reason === 'successor-not-preserved') requireDuplicate(attempts.length > 0
      && attempts.some((sem) => parseSemanticLedger(readMaterialFile(model.runDir, SEMANTIC_PATH).toString('utf8')).resolutions
        .some((r) => r.semantic_id === sem.semantic_id && r.outcome === 'not-admitted')),
    'DUP_STATE', e.effect_id, 'failed successor reason requires retained non-admitted SEM');
    if (e.effect === 'canonicalized') {
      const first = ledger.assignments.find((r) => r.proposal_id === s.proposal_id);
      requireDuplicate(first && results.get(first.review_id)?.verdict === 'upheld'
        && duplicateAdmissionProblems(s, quorums.get(s.proposal_id)!.verdict).length === 0 && e.reason === 'reviewed-duplicate',
      'DUP_STATE', e.effect_id, 'conjunctive duplicate admission failed');
      requireDuplicate(ledger.results.filter((r) => r.proposal_id === s.proposal_id).every((r) => {
        const result = results.get(r.review_id)!;
        return result.unresolved_findings.length === 0 && result.contradiction_pairs.length === 0;
      }), 'DUP_STATE', e.effect_id, 'reviewer findings or endorsed contradictions block absorption');
      requireDuplicate(s.reservation && e.lineage_id === s.reservation.lineage_id && e.successor_id === s.reservation.successor_id,
        'DUP_ACCOUNTING', e.effect_id, 'canonical reservation differs');
      const lin = parseLineage(model).rows.find((r) => r.values.lineageId === e.lineage_id);
      requireDuplicate(lin?.values.ownerStage === 'S4' && lin.values.type === s.reservation.lineage_type, 'DUP_ACCOUNTING', e.effect_id, 'canonical lineage absent/different');
      equal(ids(lin.values.predecessors), s.proposal.member_ids, 'DUP_ACCOUNTING', 'lineage members');
      equal(ids(lin.values.successors), [e.successor_id], 'DUP_ACCOUNTING', 'new successor');
      const sem = admittedSemantic(model, e.successor_id);
      requireDuplicate(sem.owner_stage === 'S4' && e.semantic_ids.includes(sem.semantic_id) && row.semantic_id === sem.semantic_id,
        'DUP_REVIEW', e.effect_id, 'admitted S4 SEM/L2S required');
      const semantic = parseSemanticLedger(readMaterialFile(model.runDir, SEMANTIC_PATH).toString('utf8'));
      const admission = semantic.resolutions.find((r) => r.semantic_id === sem.semantic_id && r.outcome === 'admitted');
      requireDuplicate(admission, 'DUP_REVIEW', e.effect_id, 'successor semantic admission absent');
      const reviewIds = parseSemanticJson(admission.review_ids) as string[];
      requireDuplicate(reviewIds.length > 0, 'DUP_REVIEW', e.effect_id, 'fresh L2S required');
      for (const id of reviewIds) {
        const result = semantic.results.find((r) => r.review_id === id && r.semantic_id === sem.semantic_id);
        requireDuplicate(result, 'DUP_REVIEW', id, 'retained L2S result required');
        const value = parseSemanticJson(readMaterialFile(model.runDir, result.result_path)) as SemanticResult;
        validateSemanticResult(value, sem);
        requireDuplicate(value.verdict === 'upheld', 'DUP_REVIEW', id, 'L2S preservation must uphold');
        if (model.manifest!.mode === 'manual') {
          const evidence = parseStrictJson(referenced(model, result.execution_evidence_ref).bytes);
          const prior = manualEvidence.get(s.proposal_id) || [];
          requireDuplicate(object(evidence) && evidence.producer_pass_id !== producers.get(s.proposal_id)!.context_id
            && evidence.reviewer_pass_id !== producers.get(s.proposal_id)!.context_id
            && prior.every((p) => evidence.reviewer_pass_id !== p.reviewer_pass_id && evidence.producer_pass_id !== p.reviewer_pass_id),
          'DUP_ISOLATION', id, 'successor producer/L2S cannot reuse duplicate producer or L3 passes');
        }
      }
      equal(sem.origin_unit_refs, s.proposal.member_semantic_refs.flatMap((m) => m.unit_refs), 'DUP_ACCOUNTING', 'successor semantic origins');
      const projection = claimProjection(model, e.successor_id);
      equal(projection.packets, s.proposal.provenance_union.packet_ids, 'DUP_ACCOUNTING', 'successor packet union');
      equal(projection.sources, s.proposal.provenance_union.source_ids, 'DUP_ACCOUNTING', 'successor source union');
      requireDuplicate(projection.claim_type === s.proposal.successor_request!.claim_type, 'DUP_ACCOUNTING', 'successor', 'claim type changed');
      const map = model.merges.filter((r) => r.values.canonical === e.successor_id);
      requireDuplicate(map.length === 1 && materialHash(semanticJson(map[0].cells.map(decode))) === e.merge_row_digest,
        'DUP_ACCOUNTING', e.effect_id, 'exact reviewed map absent');
      requireDuplicate(map[0].values.corroboration === s.proposal.origin_assessment.corroboration,
        'DUP_STATE', e.effect_id, 'canonical origin assessment differs from reviewed binary value');
      equal(ids(map[0].values.absorbs), s.proposal.member_ids, 'DUP_ACCOUNTING', 'merge-map member union');
      equal(ids(map[0].values.provenanceRetained), s.proposal.provenance_union.source_ids, 'DUP_ACCOUNTING', 'merge-map source union');
    } else {
      requireDuplicate(e.lineage_id === null && e.successor_id === null && e.merge_row_digest === null && row.semantic_id === 'none',
        'DUP_ACCOUNTING', e.effect_id, 'noncanonical effects cannot write identities');
      if (e.effect === 'kept-separate') requireDuplicate(decision && (s.proposal.treatment === 'keep-separate'
        || s.proposal.origin_assessment.corroboration === 'CANNOT_DETERMINE') && ['reviewed-nonduplicate', 'unresolved-equivalence', 'unresolved-origin'].includes(e.reason),
      'DUP_STATE', e.effect_id, 'invalid kept-separate effect');
      else requireDuplicate(['unresolved-equivalence', 'unresolved-origin', 'refuted-proposal', 'successor-not-preserved', 'withdrawn-reservation', 'changed-prerequisite'].includes(e.reason),
        'DUP_STATE', e.effect_id, 'invalid non-admission reason');
    }
    effects.set(row.proposal_id, e);
  }
  for (const row of model.merges) requireDuplicate([...effects.values()].filter((e) => e.effect === 'canonicalized'
    && e.successor_id === row.values.canonical && e.merge_row_digest === materialHash(semanticJson(row.cells.map(decode)))).length === 1,
  'DUP_ACCOUNTING', row.values.canonical, 'merge row requires one exact canonical duplicate effect');
  if ([...effects.values()].some((e) => e.effect === 'canonicalized')) {
    const checked = new ResultCollector(model.manifest!.runId);
    runK2Lineage(checked, model);
    requireDuplicate(!checked.checks.some((c) => c.status === 'FAIL'), 'DUP_ACCOUNTING', 'canonical lineage',
      checked.checks.filter((c) => c.status === 'FAIL').map((c) => c.message).join('; '));
    validateRepresentationRun(model);
  }
  for (const [id] of subjects) if (!effects.has(id)) pending.push(id);
  for (const d of discoveries.values()) for (const candidate of d.candidates) {
    if (![...subjects.values()].some((s) => s.proposal.candidate_ref === `${d.discovery_id}/${candidate.candidate_id}`))
      pending.push(`${d.discovery_id}/${candidate.candidate_id}`);
  }
  const latestDiscovery = [...discoveries.values()].at(-1);
  const discoverySequence = [...discoveries.values()];
  for (const [index, d] of discoverySequence.entries()) for (const sweep of d.sweep_refs) {
    const selected = referenced(model, sweep.result_ref), result = parseStrictJson(selected.bytes) as { flagged_pairs: Array<{ a: string; b: string }> };
    for (const [pairIndex, pair] of result.flagged_pairs.entries()) {
      const reference = `${selected.path}#/flagged_pairs/${pairIndex}@${materialHash(selected.bytes)}`;
      if (!discoverySequence.slice(index + 1).some((later) => later.candidates.some((c) =>
        semanticJson(c.member_ids) === semanticJson([pair.a, pair.b]) && c.basis_refs.includes(reference))))
        pending.push(`${d.discovery_id}/${sweep.review_id}/flagged_pairs/${pairIndex}`);
    }
  }
  if (latestDiscovery && duplicatePairs(latestDiscovery.catalogue.map((c) => c.claim_id)).some(({ a, b }) =>
    !latestDiscovery.windows.some((w) => w.member_ids.includes(a) && w.member_ids.includes(b))))
    pending.push(`${latestDiscovery.discovery_id}:unexamined-cross-window-combinations`);
  for (const file of model.files) {
    const match = /^verification\/harness\/duplicate-(discovery|subjects|assignments|results|effects)\/([^/]+)\.json$/u.exec(file.relativePath);
    if (!match) continue;
    const expected = { discovery: [...discoveries.keys()], subjects: [...subjects.keys()], assignments: [...assignments.keys()],
      results: [...results.keys()], effects: [...effects.values()].map((e) => e.effect_id) }[match[1]];
    requireDuplicate(expected?.includes(match[2]), 'DUP_ACCOUNTING', file.relativePath, 'immutable history omitted from ledger');
  }
  for (const row of parseLineage(model).rows.filter((r) => r.values.ownerStage === 'S4' && ['merge', 'duplicate'].includes(r.values.type))) {
    requireDuplicate([...effects.values()].filter((e) => e.effect === 'canonicalized' && e.lineage_id === row.values.lineageId).length === 1,
      'DUP_ACCOUNTING', row.values.lineageId, 'S4 absorption lacks one composed DUP effect');
  }
  const closed = duplicateClosureHash(model), c1 = /^closure_phase: S4-C1-relations-closed\r?$/mu.test(model.runLog?.text || '');
  requireDuplicate(!c1 || closed !== null, 'DUP_WINDOW', 'C1', 'C1 requires duplicate closure field');
  if (closed !== null || duplicateStage(model) > 4) {
    requireDuplicate(closed === materialHash(raw), 'DUP_WINDOW', 'C1', 'complete duplicate ledger seal differs');
    requireDuplicate(pending.length === 0 && discoveries.size > 0, 'DUP_ACCOUNTING', 'C1', 'pending or undiscovered work blocks closure');
    const final = [...discoveries.values()].at(-1)!;
    equal(final.catalogue.map((c) => c.claim_id), model.claims.map((r) => r.values.claimId).filter((id) => lineageCurrentClaimIds(model).has(id)),
      'DUP_ACCOUNTING', 'C1 final current inventory');
  }
  if (reachedState(model, 'ASSEMBLED')) {
    const tables = parseTables(envelopeSection(model.precis?.text || '', 17)).filter((t) => t.header[0] === 'proposal_id');
    requireDuplicate(tables.length === 1, 'DUP_ACCOUNTING', 'precis.md section 17', 'one complete duplicate finding summary required');
    equal(tables[0].header, DUPLICATE_SUMMARY_HEADERS, 'DUP_FORMAT', 'duplicate summary headers');
    equal(tables[0].rows.map((r) => r.cells.map(decode)), duplicateSummaryRows(model).map((r) => DUPLICATE_SUMMARY_HEADERS.map((h) => r[h])),
      'DUP_ACCOUNTING', 'precis.md section 17 historical duplicate finding union');
  }
  return { discoveries: discoveries.size, proposals: subjects.size, assignments: assignments.size, results: results.size,
    decisions: decisions.size, effects: effects.size, pending, executions };
}

export type DuplicateOperation = 'initialize' | 'record-discovery' | 'reserve-subject' | 'assign-review' | 'record-review'
  | 'decide' | 'record-effect' | 'admit' | 'seal';
export interface DuplicateWritePlan {
  key: string; stage: 'S4'; proposal_id: string; subject_digest: string; operation: DuplicateOperation; record_id: string;
  writes: MaterialFileWrite[]; prerequisite_hashes: Array<{ path: string; digest: string }>;
  acceptance_bindings: SemanticAcceptedBinding[];
}
export function duplicateRequiresWritePlan(model: RunModel, path: string): boolean {
  return hasRunCapability(model.manifest?.runFormatVersion || '', 'duplicate-overlap-review')
    && (path === DUPLICATE_PATH || /^verification\/harness\/duplicate-(discovery|subjects|assignments|results|effects)\//u.test(path)
      || ['ledgers/lineage.md', 'ledgers/merge-map.md'].includes(path) && duplicateStage(model) >= 4
      || path.startsWith('verification/harness/duplicate-process/')
        && (duplicateStage(model) !== 4 || duplicateClosureHash(model) !== null));
}
export function validateDuplicatePlan(plan: DuplicateWritePlan): void {
  keys(plan, ['key', 'stage', 'proposal_id', 'subject_digest', 'operation', 'record_id', 'writes', 'prerequisite_hashes', 'acceptance_bindings'], 'duplicate plan');
  oneOf(plan.operation, ['initialize', 'record-discovery', 'reserve-subject', 'assign-review', 'record-review', 'decide', 'record-effect', 'admit', 'seal'], 'operation');
  requireDuplicate(plan.stage === 'S4' && plan.key === `duplicate:${plan.proposal_id}:${plan.subject_digest}:${plan.operation}:${plan.record_id}`,
    'DUP_STATE', 'plan', 'exact Core plan identity required'); hash(plan.subject_digest, 'subject_digest');
  const neutral = ['initialize', 'record-discovery', 'seal'].includes(plan.operation);
  requireDuplicate(neutral ? plan.proposal_id === 'none' : semanticId(plan.proposal_id, 'DUP'), 'DUP_REFERENCE', 'proposal_id', 'operation subject differs');
  const expectedId = { initialize: 'S4', 'record-discovery': 'DCD', 'reserve-subject': 'DUP', 'assign-review': 'VER',
    'record-review': 'VER', decide: 'DDR', 'record-effect': 'DUE', admit: 'DUE', seal: 'C1' }[plan.operation];
  requireDuplicate(['S4', 'C1'].includes(expectedId) ? plan.record_id === expectedId
    : expectedId === 'VER' ? /^VER-\d+$/u.test(plan.record_id) : semanticId(plan.record_id, expectedId),
  'DUP_REFERENCE', 'record_id', 'operation record namespace differs');
  const allowed: Record<DuplicateOperation, string[]> = {
    initialize: [DUPLICATE_PATH],
    'record-discovery': [DUPLICATE_PATH, duplicatePath('discovery', plan.record_id)],
    'reserve-subject': [DUPLICATE_PATH, duplicatePath('subjects', plan.proposal_id),
      ...plan.writes.filter((w) => /^verification\/harness\/semantic-process\/LIN-\d+\.json$/u.test(w.path)).map((w) => w.path)],
    'assign-review': [DUPLICATE_PATH, duplicatePath('assignments', plan.record_id)],
    'record-review': [DUPLICATE_PATH, duplicatePath('results', plan.record_id), `verification/harness/S4/${plan.record_id}.md`],
    decide: [DUPLICATE_PATH],
    'record-effect': [DUPLICATE_PATH, duplicatePath('effects', plan.record_id)],
    admit: [DUPLICATE_PATH, duplicatePath('effects', plan.record_id), SEMANTIC_PATH, 'ledgers/claim-inventory.md',
      'ledgers/lineage.md', 'ledgers/merge-map.md', 'ledgers/representation-uses.md'],
    seal: ['run-log.md'],
  };
  array(plan.writes, 'writes');
  requireDuplicate(plan.writes.length > 0 && new Set(plan.writes.map((w) => w.path)).size === plan.writes.length, 'DUP_STATE', 'writes', 'nonempty unique paths required');
  for (const w of plan.writes) {
    keys(w, ['path', 'before_hash', 'after_base64', 'after_hash'], 'write');
    requireDuplicate(allowed[plan.operation].includes(w.path), 'DUP_WINDOW', w.path, 'outside exact operation path limits');
    hash(w.before_hash, 'before_hash'); hash(w.after_hash, 'after_hash');
    const bytes = Buffer.from(w.after_base64, 'base64');
    requireDuplicate(bytes.toString('base64') === w.after_base64 && materialHash(bytes) === w.after_hash, 'DUP_SUBJECT', w.path, 'after-image differs');
    if (w.path.startsWith('verification/')) requireDuplicate(w.before_hash === materialHash(Buffer.alloc(0)), 'DUP_STATE', w.path, 'immutable companions cannot be overwritten');
  }
  let previous = '';
  for (const p of plan.prerequisite_hashes) {
    keys(p, ['path', 'digest'], 'prerequisite'); hash(p.digest, 'digest');
    requireDuplicate(Buffer.compare(Buffer.from(previous), Buffer.from(p.path)) < 0, 'DUP_REFERENCE', p.path, 'sorted unique prerequisites required'); previous = p.path;
  }
  for (const b of plan.acceptance_bindings) {
    keys(b, ['call_id', 'context_id', 'raw_return_hash', 'role'], 'acceptance_binding');
    text(b.call_id, 'call_id'); text(b.context_id, 'context_id'); hash(b.raw_return_hash, 'raw_return_hash'); text(b.role, 'role');
  }
}
export function planDuplicateWrite(options: {
  model: RunModel; proposedModel: RunModel; proposal_id: string; subject_digest: string; operation: DuplicateOperation;
  record_id: string; writes: MaterialFileWrite[]; prerequisite_paths: string[]; acceptance_bindings: SemanticAcceptedBinding[];
}): DuplicateWritePlan {
  const { model, proposedModel, proposal_id, subject_digest, operation, record_id, writes, acceptance_bindings } = options;
  assertDuplicateWindow(model);
  const written = new Set(writes.map((w) => w.path));
  const controlFiles = ['control/runtime', 'control/worker-bundles', 'control/worker-returns'].flatMap((p) =>
    existsSync(join(model.runDir, p)) ? walkFiles(join(model.runDir, p)).map((path) => relative(model.runDir, path).replaceAll('\\', '/')) : []);
  const prerequisites = [...model.files.map((f) => f.relativePath), ...controlFiles].filter((p) => !written.has(p)
    && (p === 'run-manifest.md' || p === 'run-log.md' || p.startsWith('corpus/') || p.startsWith('ledgers/')
      || p.startsWith('verification/') || p.startsWith('control/runtime/') || p.startsWith('control/worker-')));
  const plan: DuplicateWritePlan = { key: `duplicate:${proposal_id}:${subject_digest}:${operation}:${record_id}`,
    stage: 'S4', proposal_id, subject_digest, operation, record_id, writes,
    prerequisite_hashes: unique([...prerequisites, ...options.prerequisite_paths]).filter((p) => !written.has(p)).sort((a, b) => Buffer.compare(Buffer.from(a), Buffer.from(b)))
      .map((path) => ({ path, digest: materialHash(readMaterialFile(model.runDir, path)) })), acceptance_bindings };
  validateDuplicatePlan(plan);
  for (const write of writes) {
    const before = existsSync(join(model.runDir, write.path)) ? readMaterialFile(model.runDir, write.path) : Buffer.alloc(0);
    requireDuplicate(write.before_hash === materialHash(before), 'DUP_STATE', write.path, 'preimage differs');
    requireDuplicate(readMaterialFile(proposedModel.runDir, write.path).toString('base64') === write.after_base64, 'DUP_SUBJECT', write.path, 'prospective after-image differs');
    if (write.path.startsWith('ledgers/') && write.path !== DUPLICATE_PATH) {
      const after = parseTables(Buffer.from(write.after_base64, 'base64').toString('utf8'));
      for (const table of parseTables(before.toString('utf8'))) {
        const same = after.find((t) => semanticJson(t.header) === semanticJson(table.header));
        requireDuplicate(same && semanticJson(same.rows.slice(0, table.rows.length).map((r) => r.cells)) === semanticJson(table.rows.map((r) => r.cells)),
          'DUP_STATE', write.path, 'composed admission cannot rewrite prior canonical rows');
      }
    }
  }
  const before = existsSync(join(model.runDir, DUPLICATE_PATH)) ? parseDuplicateLedger(readMaterialFile(model.runDir, DUPLICATE_PATH).toString('utf8')) : emptyDuplicateLedger();
  const after = parseDuplicateLedger(readMaterialFile(proposedModel.runDir, DUPLICATE_PATH).toString('utf8'));
  const addedTable = { initialize: 'none', 'record-discovery': 'discoveries', 'reserve-subject': 'proposals', 'assign-review': 'assignments',
    'record-review': 'results', decide: 'decisions', 'record-effect': 'effects', admit: 'effects', seal: 'none' }[operation];
  for (const key of Object.keys(DUPLICATE_HEADERS) as Array<keyof DuplicateLedger>) {
    equal(before[key], after[key].slice(0, before[key].length), 'DUP_ACCOUNTING', 'retained duplicate history');
    const added = after[key].slice(before[key].length);
    requireDuplicate(added.length === (key === addedTable ? 1 : 0), 'DUP_STATE', key, 'operation must append exactly its declared record');
    if (added.length) requireDuplicate(added[0][DUPLICATE_HEADERS[key][0]] === record_id
      && (key === 'discoveries' || added[0].proposal_id === proposal_id), 'DUP_STATE', key, 'operation targets another record');
  }
  if (operation === 'initialize') requireDuplicate(!existsSync(join(model.runDir, DUPLICATE_PATH))
    && readMaterialFile(proposedModel.runDir, DUPLICATE_PATH).equals(Buffer.from(duplicateLedgerMarkdown(emptyDuplicateLedger())))
    && subject_digest === materialHash(readMaterialFile(proposedModel.runDir, DUPLICATE_PATH)), 'DUP_STATE', 'initialize', 'only exact empty ledger at S4 entry');
  if (operation === 'record-discovery') {
    const d = parseDuplicateJson(readMaterialFile(proposedModel.runDir, duplicatePath('discovery', record_id)));
    validateDuplicateDiscovery(d, model, true);
    requireDuplicate(subject_digest === materialHash(semanticJson(d)), 'DUP_SUBJECT', 'discovery plan', 'record digest differs');
    if (['agent', 'hybrid'].includes(model.manifest!.mode)) {
      for (const window of d.windows) {
        const tuple = parseDuplicateJson(referenced(proposedModel, window.execution_evidence_ref).bytes) as Record<string, unknown>;
        requireDuplicate(acceptance_bindings.some((b) => b.call_id === tuple.call_id && b.context_id === tuple.context_id
          && b.raw_return_hash === tuple.raw_return_hash && b.role === 'merge-judge'), 'DUP_ISOLATION', window.window_id, 'actual accepted discovery window required');
      }
      for (const sweep of d.sweep_refs) {
        const result = referenced(proposedModel, sweep.result_ref), callId = result.path.split('/')[2];
        requireDuplicate(acceptance_bindings.some((b) => b.call_id === callId && b.raw_return_hash === materialHash(result.bytes)
          && b.role === 'verifier-l5'), 'DUP_ISOLATION', sweep.review_id, 'actual accepted independent L5 sweep required');
      }
    }
  }
  if (!['initialize', 'record-discovery', 'seal'].includes(operation)) {
    const row = after.proposals.find((r) => r.proposal_id === proposal_id);
    requireDuplicate(row?.subject_digest === subject_digest, 'DUP_SUBJECT', 'plan', 'subject binding differs');
    const s = parseDuplicateJson(readMaterialFile(proposedModel.runDir, row.subject_path)) as DuplicateSubject;
    if (operation === 'reserve-subject' || operation === 'admit') validateDuplicateSubject(s, model, true);
    if (operation === 'reserve-subject') {
      const reserved = writes.filter((w) => /^verification\/harness\/semantic-process\/LIN-\d+\.json$/u.test(w.path));
      requireDuplicate(reserved.length === (s.reservation ? 1 : 0), 'DUP_ACCOUNTING', 'reservation', 'exact uncommitted lineage evidence required');
      if (s.reservation) {
        const expected = s.reservation, write = reserved[0], row = parseDuplicateJson(Buffer.from(write.after_base64, 'base64'));
        keys(row, ['lineage_id', 'owner_stage', 'type', 'predecessors', 'successors', 'basis', 'established_by'], 'reserved lineage');
        requireDuplicate(write.path === `verification/harness/semantic-process/${expected.lineage_id}.json`
          && row.lineage_id === expected.lineage_id && row.owner_stage === 'S4' && row.type === expected.lineage_type
          && row.predecessors === expected.predecessor_ids.join(', ') && row.successors === expected.successor_id,
        'DUP_REFERENCE', 'reservation', 'exact reviewed group/type/new successor required');
        text(row.basis, 'basis'); text(row.established_by, 'established_by');
      }
    }
    if (operation === 'assign-review') {
      const a = parseDuplicateJson(readMaterialFile(proposedModel.runDir, duplicatePath('assignments', record_id))) as DuplicateAssignment;
      if (a.round === 2) {
        const first = before.assignments.find((r) => r.proposal_id === proposal_id);
        const result = first && before.results.find((r) => r.review_id === first.review_id);
        requireDuplicate(result && (parseDuplicateJson(readMaterialFile(model.runDir, result.result_path)) as DuplicateResult).verdict === 'cannot-determine',
          'DUP_STATE', 'round two', 'round-one unknown result must precede assignment');
      }
    }
    if (operation === 'record-effect' || operation === 'admit') {
      const effect = referenced(proposedModel, after.effects.at(-1)!.record_ref);
      const e = parseDuplicateJson(effect.bytes) as DuplicateEffect;
      requireDuplicate(operation === 'admit' ? e.effect === 'canonicalized' : e.effect !== 'canonicalized', 'DUP_STATE', 'operation', 'canonicalization requires composed admit');
    }
    if (['agent', 'hybrid'].includes(model.manifest!.mode) || acceptance_bindings.length) {
      const producer = referenced(proposedModel, row.producer_receipt_ref), tuple = parseDuplicateJson(producer.bytes) as Record<string, unknown>;
      requireDuplicate(acceptance_bindings.some((b) => b.call_id === tuple.call_id && b.context_id === tuple.context_id
        && b.raw_return_hash === tuple.raw_return_hash && b.role === 'merge-judge'), 'DUP_ISOLATION', 'accepted producer', 'exact accepted comparison return required');
      if (operation === 'record-review') {
        const a = parseDuplicateJson(readMaterialFile(proposedModel.runDir, duplicatePath('assignments', record_id))) as DuplicateAssignment;
        const result = after.results.find((r) => r.review_id === record_id)!;
        const evidence = parseStrictJson(referenced(proposedModel, result.execution_evidence_ref).bytes) as { receipt?: { context_id: string } };
        requireDuplicate(acceptance_bindings.some((b) => b.call_id === a.invocation_id && b.role === 'verifier-l3'
          && b.context_id === evidence.receipt?.context_id && b.raw_return_hash === result.result_digest),
        'DUP_ISOLATION', 'accepted reviewer', 'exact accepted L3 call/context/raw return required');
      }
      if (operation === 'admit') {
        for (const row of after.assignments.filter((r) => r.proposal_id === proposal_id)) {
          const a = parseDuplicateJson(readMaterialFile(proposedModel.runDir, row.assignment_path)) as DuplicateAssignment;
          requireDuplicate(acceptance_bindings.some((b) => b.call_id === a.invocation_id && b.role === 'verifier-l3'),
            'DUP_ISOLATION', row.review_id, 'admission requires the actual accepted L3 result');
        }
        const e = parseDuplicateJson(referenced(proposedModel, after.effects.at(-1)!.record_ref).bytes) as DuplicateEffect;
        const sem = admittedSemantic(proposedModel, e.successor_id!);
        const producer = acceptance_bindings.find((b) => b.role === 'normalizer');
        requireDuplicate(producer, 'DUP_ISOLATION', e.effect_id, 'accepted S4 normalizer required');
        validateSemanticAcceptedBindings(proposedModel, sem.semantic_id, 'admit', producer,
          acceptance_bindings.filter((b) => ['verifier-l2s', 'verifier-l2f'].includes(b.role)));
      }
    }
  }
  const report = validateDuplicateRun(proposedModel);
  if (operation === 'admit' || operation === 'seal') validateSemanticRun(proposedModel);
  if (operation === 'seal') requireDuplicate(!report.pending.length && subject_digest === materialHash(readMaterialFile(model.runDir, DUPLICATE_PATH))
    && duplicateClosureHash(proposedModel) === subject_digest, 'DUP_WINDOW', 'seal', 'complete additional C1 seal required');
  return plan;
}
export interface DuplicateAdmissionSubplans { semantic_plan: SemanticWritePlan; material_plan: MaterialWritePlan }
export function duplicateAdmissionSubplans(model: RunModel, proposedModel: RunModel, plan: DuplicateWritePlan): DuplicateAdmissionSubplans | null {
  if (plan.operation !== 'admit') return null;
  const ledger = parseDuplicateLedger(readMaterialFile(proposedModel.runDir, DUPLICATE_PATH).toString('utf8'));
  const effect = ledger.effects.find((r) => r.effect_id === plan.record_id)!;
  const sem = admittedSemantic(proposedModel, effect.successor_id);
  const semantic = parseSemanticLedger(readMaterialFile(proposedModel.runDir, SEMANTIC_PATH).toString('utf8'));
  const resolution = semantic.resolutions.find((r) => r.semantic_id === sem.semantic_id && r.outcome === 'admitted')!;
  const semantic_plan = planSemanticWrite({ model, proposedModel, stage: 'S4', semantic_id: sem.semantic_id,
    subject_digest: materialHash(semanticJson(sem)), operation: 'admit', record_id: resolution.resolution_id, prerequisite_paths: [],
    writes: plan.writes.filter((w) => w.path !== DUPLICATE_PATH && !w.path.startsWith('verification/harness/duplicate-')) });
  const row = readRepresentationContext(proposedModel).uses.find((r) => r.subject_kind === 'CC' && r.subject_id === effect.successor_id)!;
  const material_plan = planRepresentationUseWrite({ model, proposedModel, row, stage: 'S4',
    subjectWrites: plan.writes.filter((w) => ['ledgers/claim-inventory.md', 'ledgers/lineage.md'].includes(w.path)) });
  const result = { semantic_plan, material_plan };
  validateDuplicateAdmissionSubplans(proposedModel, plan, result); return result;
}
export function validateDuplicateAdmissionSubplans(model: RunModel, plan: DuplicateWritePlan, subplans: DuplicateAdmissionSubplans | null): void {
  if (plan.operation !== 'admit') { requireDuplicate(subplans === null, 'DUP_STATE', 'subplans', 'only admission composes successor plans'); return; }
  requireDuplicate(subplans, 'DUP_STATE', 'subplans', 'composed semantic/material plans required');
  validateSemanticPlan(subplans.semantic_plan);
  const ledger = parseDuplicateLedger(readMaterialFile(model.runDir, DUPLICATE_PATH).toString('utf8'));
  const effect = ledger.effects.find((r) => r.effect_id === plan.record_id);
  requireDuplicate(effect, 'DUP_ACCOUNTING', 'subplans', 'effect absent');
  const context = validateRepresentationRun(model), row = context.uses.find((r) => r.subject_kind === 'CC' && r.subject_id === effect.successor_id);
  requireDuplicate(row, 'DUP_ACCOUNTING', 'subplans', 'successor use absent');
  validateMaterialPlanIdentity(subplans.material_plan, row, 'S4');
  requireDuplicate(subplans.semantic_plan.semantic_id === effect.semantic_id && subplans.material_plan.inventory_hash === context.inventoryHash,
    'DUP_SUBJECT', 'subplans', 'successor/capture identity differs');
  for (const subplan of [subplans.semantic_plan, subplans.material_plan]) for (const w of subplan.writes)
    requireDuplicate(plan.writes.some((p) => semanticJson(p) === semanticJson(w)), 'DUP_SUBJECT', w.path, 'subplan must share exact composed after-image');
}
export function validateCompletedDuplicatePlan(model: RunModel, plan: DuplicateWritePlan): void {
  validateDuplicatePlan(plan); validateDuplicateRun(model);
  for (const w of plan.writes) {
    const current = readMaterialFile(model.runDir, w.path), after = Buffer.from(w.after_base64, 'base64');
    if (w.path === DUPLICATE_PATH) {
      const historical = parseDuplicateLedger(after.toString('utf8')), ledger = parseDuplicateLedger(current.toString('utf8'));
      for (const key of Object.keys(DUPLICATE_HEADERS) as Array<keyof DuplicateLedger>) equal(historical[key], ledger[key].slice(0, historical[key].length), 'DUP_STATE', key);
    } else if (w.path === 'ledgers/claim-inventory.md') {
      const claims = parseTables(after.toString('utf8')).filter((t) => t.header[0] === 'claim_id').flatMap((t) => t.rows.map((r) => r.cells[0]));
      requireDuplicate(claims.every((id) => model.claims.some((r) => r.values.claimId === id)), 'DUP_STATE', w.path, 'committed claim erased');
    } else requireDuplicate(w.path.startsWith('verification/') ? current.equals(after) : current.subarray(0, after.length).equals(after),
      'DUP_STATE', w.path, 'committed immutable file/prefix changed');
  }
}

type JsonSchema = Record<string, WorkerJsonValue>;
const closedSchema = (properties: Record<string, WorkerJsonValue>): JsonSchema => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
const stringSchema = (pattern?: string): JsonSchema => ({ type: 'string', minLength: 1, ...(pattern ? { pattern } : {}) });
const enumSchema = (values: readonly string[]): JsonSchema => ({ type: 'string', enum: [...values] });
const arraySchema = (items: WorkerJsonValue, minItems = 0): JsonSchema => ({ type: 'array', items, minItems });
const nullableSchema = (schema: WorkerJsonValue): JsonSchema => ({ anyOf: [schema, { type: 'null' }] });
export function duplicateReturnJsonSchema(task: DuplicateTask, version: string): WorkerJsonValue {
  requireDuplicate(hasRunCapability(version, 'duplicate-overlap-review'), 'DUP_COMPATIBILITY', 'schema', 'capability required');
  oneOf(task, Object.keys(DUPLICATE_TASKS) as DuplicateTask[], 'task');
  const str = stringSchema(), sha = stringSchema('^sha256:[0-9a-f]{64}$'), cc = stringSchema('^CC-[0-9]+$'), sem = stringSchema('^SEM-(?=[0-9]*[1-9])[0-9]{4,}$');
  const pointers = arraySchema(stringSchema('^/'), 1), strings = arraySchema(str), ccs = arraySchema(cc, 2);
  const index = { type: 'integer', minimum: 0, maximum: Number.MAX_SAFE_INTEGER };
  const anchors = arraySchema({ anyOf: [
    closedSchema({ semantic_id: sem, anchor_id: stringSchema('^A[1-9][0-9]*$') }),
    closedSchema({ source_id: stringSchema('^SRC-[0-9]+$'), locator: str, start_byte: index, end_byte: index, selection_hash: sha }),
  ] });
  const material = arraySchema({ anyOf: [
    closedSchema({ use_subject_digest: sha, requirement_index: index }),
    closedSchema({ use_subject_digest: sha, limitation_id: stringSchema('^(REP|OBJ|ASC)-(?=[0-9]*[1-9])[0-9]{4,}$') }),
  ] });
  const requested = arraySchema(closedSchema({ source_id: stringSchema('^SRC-[0-9]+$'), locator: stringSchema('^L[1-9][0-9]*-L[1-9][0-9]*$'),
    purpose: enumSchema(['local-context', 'same-source-referent-search', 'material-inspection']) }));
  const finding = closedSchema({ finding_id: stringSchema('^F[1-9][0-9]*$'), dimension: enumSchema(DUPLICATE_DIMENSIONS),
    input_refs: pointers, anchor_refs: anchors, material_refs: material, missing: str, requested_context: requested });
  const pair = closedSchema({ a: cc, b: cc, distinction_refs: arraySchema(str, 1), anchor_refs: { ...anchors, minItems: 1 }, why: str });
  const candidate = closedSchema({ member_ids: ccs, basis_refs: arraySchema(str, 1), signal: enumSchema(['semantic-proposal', 'identical-text', 'shared-packet']) });
  if (task === 'discovery') return closedSchema({ candidates: arraySchema(candidate),
    unresolved_findings: arraySchema(closedSchema({ member_ids: arraySchema(cc), missing: str, requested_context: requested })), rationale: str, flags: strings });
  if (task === 'contradiction-discovery') return closedSchema({
    verdict: enumSchema(DUPLICATE_VERDICTS), rationale: str, attacks_tried: arraySchema(str, 1), evidence_ids: strings,
    candidate_evidence: { type: 'array', items: false, maxItems: 0 }, missing_for_determination: nullableSchema(str), flags: strings, flagged_pairs: arraySchema(closedSchema({ a: cc, b: cc, why: str })),
  });
  if (task === 'refutation') return closedSchema({ format: enumSchema([DUPLICATE_RESULT_FORMAT]), subject_digest: sha, verdict: enumSchema(DUPLICATE_VERDICTS),
    assessed_outcome: enumSchema(DUPLICATE_OUTCOMES),
    dimension_reviews: { ...arraySchema(closedSchema({ dimension: enumSchema(DUPLICATE_DIMENSIONS), verdict: enumSchema(DUPLICATE_VERDICTS),
      input_refs: pointers, anchor_refs: anchors, material_refs: material, explanation: str }), 17), maxItems: 17 },
    distinction_reviews: arraySchema(closedSchema({ distinction_id: stringSchema('^D[1-9][0-9]*$'), verdict: enumSchema(DUPLICATE_VERDICTS), input_refs: pointers, explanation: str }), 17),
    pair_reviews: arraySchema(closedSchema({ a: cc, b: cc, verdict: enumSchema(DUPLICATE_VERDICTS), distinction_refs: arraySchema(str, 1), origin_basis_refs: pointers, explanation: str }), 1),
    contradiction_pairs: arraySchema(pair), unresolved_findings: arraySchema(finding), attacks_tried: arraySchema(str, 1),
    missing_for_determination: nullableSchema(str), rationale: str, candidate_evidence: { type: 'array', items: false, maxItems: 0 } });
  const materialUse = closedSchema({ requirements: arraySchema(closedSchema({
    object_id: stringSchema('^OBJ-(?=[0-9]*[1-9])[0-9]{4,}$'), feature: enumSchema(MATERIAL_FEATURES),
    binding_ids: arraySchema(stringSchema('^BND-(?=[0-9]*[1-9])[0-9]{4,}$')),
  }), 1), use_state: enumSchema(['usable', 'CANNOT_DETERMINE']), fidelity_claim: enumSchema(['none', 'exact-representation']),
    limitation_refs: arraySchema(stringSchema('^(REP|OBJ|ASC)-(?=[0-9]*[1-9])[0-9]{4,}$')), reason: str });
  const occurrence = closedSchema({ source_id: str, source_hash: sha, packet_id: str, evidence_key: str, fragment_order: { ...index, minimum: 1 },
    locator: str, fragment_hash: sha, start_byte: index, end_byte: index });
  const proposal = closedSchema({
    candidate_ref: stringSchema('^DCD-(?=[0-9]*[1-9])[0-9]{4,}/G[1-9][0-9]*$'), member_ids: ccs,
    member_semantic_refs: arraySchema(closedSchema({ claim_id: cc, semantic_id: sem, subject_digest: sha, unit_refs: arraySchema(str, 1) }), 2),
    comparison_basis_digest: sha, review_mode: enumSchema(['proposal', 'unresolved-record']), outcome: enumSchema(DUPLICATE_OUTCOMES),
    treatment: enumSchema(['new-successor', 'keep-separate']),
    distinctions: arraySchema(closedSchema({ distinction_id: stringSchema('^D[1-9][0-9]*$'), dimension: enumSchema(DUPLICATE_DIMENSIONS),
      member_ids: arraySchema(cc, 1), input_refs: pointers, treatment: enumSchema(['retained', 'collapsible', 'CANNOT_DETERMINE']),
      retained_at: nullableSchema(enumSchema(['successor-content', 'occurrence-history', 'separate-claims'])),
      content_anchor_refs: anchors, context_refs: strings, explanation: str }), 17),
    contradiction_pairs: arraySchema(pair),
    origin_assessment: closedSchema({ corroboration: enumSchema(['independent', 'restatement', 'CANNOT_DETERMINE']),
      occurrence_groups: arraySchema(closedSchema({ occurrence_keys: arraySchema(str, 1), basis_refs: pointers }), 1), basis_refs: pointers, unresolved_finding_refs: strings }),
    representative: nullableSchema(closedSchema({ basis_member_ids: arraySchema(cc, 1), basis_unit_refs: arraySchema(str, 1),
      wording_basis: enumSchema(['selected-member', 'combined-expression']), retained_distinction_refs: strings })),
    successor_request: nullableSchema(closedSchema({ lineage_type: enumSchema(['duplicate', 'merge']), proposed_claim: str,
      claim_type: enumSchema(['factual', 'design-intent', 'constraint', 'preference', 'open-question']),
      packet_ids: arraySchema(str, 1), source_ids: arraySchema(str, 1), semantic_content_refs: pointers, material_use: materialUse })),
    provenance_union: closedSchema({ packet_ids: arraySchema(str, 1), source_ids: arraySchema(str, 1), occurrences: arraySchema(occurrence, 1),
      member_occurrences: arraySchema(closedSchema({ claim_id: cc, occurrence_keys: arraySchema(str, 1),
        unit_occurrences: arraySchema(closedSchema({ unit_ref: str, anchor_refs: anchors, occurrence_keys: arraySchema(str, 1) }), 1) }), 2) }),
    unresolved_findings: arraySchema(finding),
  });
  return closedSchema({ proposal, rationale: str, flags: strings });
}
function schemaShape(value: unknown, schema: WorkerJsonValue, path = '$'): void {
  requireDuplicate(object(schema), 'DUP_FORMAT', path, 'schema object required');
  if (Array.isArray(schema.anyOf)) {
    requireDuplicate(schema.anyOf.some((s) => { try { schemaShape(value, s, path); return true; } catch { return false; } }), 'DUP_FORMAT', path, 'no legal schema variant'); return;
  }
  if (schema.type === 'null') { requireDuplicate(value === null, 'DUP_FORMAT', path, 'null required'); return; }
  if (schema.type === 'object') {
    requireDuplicate(object(schema.properties), 'DUP_FORMAT', path, 'closed properties required');
    keys(value, Object.keys(schema.properties), path);
    for (const [key, s] of Object.entries(schema.properties)) schemaShape(value[key], s, `${path}/${key}`);
  } else if (schema.type === 'array') {
    array(value, path);
    requireDuplicate(value.length >= Number(schema.minItems || 0) && (schema.maxItems === undefined || value.length <= Number(schema.maxItems)), 'DUP_FORMAT', path, 'array cardinality differs');
    value.forEach((v, i) => schemaShape(v, schema.items, `${path}/${i}`));
  } else if (schema.type === 'integer') requireDuplicate(integer(value) && value >= Number(schema.minimum), 'DUP_FORMAT', path, 'safe ordinal required');
  else {
    text(value, path);
    if (Array.isArray(schema.enum)) requireDuplicate(schema.enum.includes(value), 'DUP_ENUM', path, 'unknown enum');
    if (typeof schema.pattern === 'string') requireDuplicate(new RegExp(schema.pattern, 'u').test(value), 'DUP_REFERENCE', path, 'reference grammar differs');
  }
}
export function duplicateOutputContract(task: DuplicateTask): WorkerJsonValue {
  return { contract_format: DUPLICATE_CONTRACT_FORMAT, capability: 'duplicate-overlap-review', task,
    role: task === 'refutation' ? 'verifier-l3' : task === 'contradiction-discovery' ? 'verifier-l5' : 'merge-judge',
    shape: duplicateReturnJsonSchema(task, '1.8.0-provisional') };
}
export function isDuplicateOutputContract(v: unknown): boolean { return object(v) && v.contract_format === DUPLICATE_CONTRACT_FORMAT; }
export function validateDuplicateOutputContract(v: unknown): DuplicateTask {
  keys(v, ['contract_format', 'capability', 'task', 'role', 'shape'], 'duplicate output contract');
  oneOf(v.task, Object.keys(DUPLICATE_TASKS) as DuplicateTask[], 'task');
  equal(v, duplicateOutputContract(v.task), 'DUP_FORMAT', 'Core contract descriptor');
  return v.task;
}
export function validateDuplicateReturn(task: DuplicateTask, version: string, value: unknown,
  context?: { model: RunModel; subject?: DuplicateSubject; basis?: ComparisonBasis; member_ids?: string[]; candidate_ref?: string }): {
    result: 'PASS' | 'FAIL'; errors: string[]; canonicalValue: WorkerJsonValue | null; binding: 'checked' | 'not-checked';
  } {
  try {
    duplicateJson(value); schemaShape(value, duplicateReturnJsonSchema(task, version));
    const returned = value as Record<string, unknown>;
    if (context) {
      requireDuplicate(context.model.manifest?.runFormatVersion === version, 'DUP_COMPATIBILITY', 'return context', 'run format differs');
      if (task === 'refutation' && context.subject) validateDuplicateSubject(context.subject, context.model);
      else if (task === 'comparison' && context.basis) {
        const proposal = returned.proposal as DuplicateProposal;
        if (context.candidate_ref) equal(proposal.candidate_ref, context.candidate_ref, 'DUP_SUBJECT', 'assigned candidate');
        const actual = duplicateProducerView(context.model, task, { candidate_ref: proposal.candidate_ref });
        equal(context.basis, actual.context.basis, 'DUP_SUBJECT', 'return comparison basis');
      } else if (task !== 'refutation' && task !== 'comparison' && context.member_ids)
        duplicateProducerView(context.model, task, { member_ids: context.member_ids });
    }
    if (task === 'refutation') validateDuplicateResult(value, context?.subject);
    else if (task === 'comparison') {
      validateDuplicateProposal(returned.proposal, context?.basis, context?.basis ? duplicateComparisonFields(context.basis) : undefined); rationale(returned.rationale);
    } else if (task === 'discovery') {
      for (const c of returned.candidates as Array<Record<string, unknown>>) {
        strings(c.member_ids, 'members', true);
        if (context?.member_ids) subset(c.member_ids, context.member_ids, 'current discovery members', true);
      }
      for (const f of returned.unresolved_findings as Array<Record<string, unknown>>) requestedContext(f.requested_context);
      rationale(returned.rationale);
    } else {
      requireDuplicate(returned.verdict === 'refuted' || (returned.flagged_pairs as unknown[]).length === 0, 'DUP_REVIEW', 'L5', 'flagged pairs only on refuted');
      for (const pair of returned.flagged_pairs as Array<{ a: string; b: string }>) requireDuplicate(pair.a !== pair.b
        && (!context?.member_ids || context.member_ids.includes(pair.a) && context.member_ids.includes(pair.b)), 'DUP_REFERENCE', 'L5 pair', 'explicit current IDs required');
      rationale(returned.rationale);
    }
    return { result: 'PASS', errors: [], canonicalValue: value as WorkerJsonValue,
      binding: context && (task === 'refutation' ? !!context.subject : task === 'comparison' ? !!context.basis : !!context.member_ids) ? 'checked' : 'not-checked' };
  } catch (error) { return { result: 'FAIL', errors: [error instanceof Error ? error.message : String(error)], canonicalValue: null, binding: 'not-checked' }; }
}

export function duplicateTaskForRole(version: string, role: string, stage: string, taskLine?: string): DuplicateTask | null {
  if (!hasRunCapability(version, 'duplicate-overlap-review') || stage !== 'S4') return null;
  if (role === 'verifier-l3') return taskLine === DUPLICATE_TASKS.refutation ? 'refutation' : null;
  if (role === 'verifier-l5') return 'contradiction-discovery';
  if (role !== 'merge-judge') return null;
  const task = taskLine === DUPLICATE_TASKS.discovery ? 'discovery' : taskLine === DUPLICATE_TASKS.comparison ? 'comparison' : null;
  requireDuplicate(task, 'DUP_ISOLATION', role, 'exact discovery or comparison task required');
  return task;
}
export function validateDuplicateRoleDelivery(version: string, role: string, stage: string, taskLine: string, paths: string[]): void {
  if (!hasRunCapability(version, 'duplicate-overlap-review')) return;
  if (paths.some((path) => /^verification\/harness\/duplicate-subjects\/DUP-\d+\.json$/u.test(path)))
    requireDuplicate(role === 'verifier-l3' && stage === 'S4' && taskLine === DUPLICATE_TASKS.refutation,
      'DUP_ISOLATION', 'sealed comparison delivery', 'duplicate subject requires its exact bounded L3 task and role');
}
export function duplicateProducerView(model: RunModel, task: Exclude<DuplicateTask, 'refutation'>,
  selection: unknown): { bytes: Buffer; context: NonNullable<Parameters<typeof validateDuplicateReturn>[3]> } {
  assertDuplicateWindow(model);
  if (task === 'comparison') {
    keys(selection, ['candidate_ref'], 'comparison selection'); text(selection.candidate_ref, 'candidate_ref');
    const [id, group] = selection.candidate_ref.split('/');
    const ledger = parseDuplicateLedger(readMaterialFile(model.runDir, DUPLICATE_PATH).toString('utf8'));
    const row = ledger.discoveries.find((r) => r.discovery_id === id);
    requireDuplicate(row, 'DUP_REFERENCE', 'comparison selection', 'retained discovery required');
    const d = parseDuplicateJson(readMaterialFile(model.runDir, row.record_path));
    validateDuplicateDiscovery(d, model);
    const c = d.candidates.find((c) => c.candidate_id === group);
    requireDuplicate(c, 'DUP_REFERENCE', 'comparison selection', 'retained candidate required');
    const basis = buildComparisonBasis(model, c.member_ids);
    return { bytes: Buffer.from(semanticJson({ candidate_ref: selection.candidate_ref, comparison_basis: basis })),
      context: { model, basis, candidate_ref: selection.candidate_ref } };
  }
  keys(selection, ['member_ids'], 'discovery selection');
  const catalogue = discoveryCatalogue(model, model.claims.map((r) => r.values.claimId), parseLineage(model).rows.map((r) => r.values.lineageId));
  subset(selection.member_ids, catalogue.map((c) => c.claim_id), 'discovery window', catalogue.length > 0);
  const memberIds = selection.member_ids;
  const selected = catalogue.filter((c) => memberIds.includes(c.claim_id));
  if (task === 'discovery') return { bytes: Buffer.from(semanticJson(selected)), context: { model, member_ids: selection.member_ids } };
  return { bytes: duplicateSweepView(model, selected),
    context: { model, member_ids: selection.member_ids } };
}
export function duplicateProducerPaths(callId: string): { selection: string; view: string } {
  requireDuplicate(/^[A-Za-z0-9][A-Za-z0-9._-]*$/u.test(callId), 'DUP_REFERENCE', 'call_id', 'confined call ID required');
  return { selection: duplicatePath('process', `${callId}.selection`), view: duplicatePath('process', `${callId}.view`) };
}
export function validateDuplicateProducerDelivery(model: RunModel, task: Exclude<DuplicateTask, 'refutation'>, callId: string,
  taskLine: string, attachments: Array<{ path: string; bytes: Buffer }>): NonNullable<Parameters<typeof validateDuplicateReturn>[3]> {
  const paths = duplicateProducerPaths(callId);
  const selection = parseDuplicateJson(readMaterialFile(model.runDir, paths.selection)) as { member_ids: string[] } | { candidate_ref: string };
  const view = duplicateProducerView(model, task, selection);
  requireDuplicate(taskLine === DUPLICATE_TASKS[task] && attachments.length === 1 && attachments[0].path === paths.view
    && attachments[0].bytes.equals(view.bytes), 'DUP_ISOLATION', callId, 'actual delivery must equal exact Core-produced view and task');
  return view.context;
}
export function validateDuplicateReviewDispatch(model: RunModel, callId: string, taskLine: string, producerContext: string | null,
  attachments: Array<{ path: string; bytes: Buffer }>, retained = false): DuplicateSubject {
  if (!retained) assertDuplicateWindow(model);
  const paths = attachments.filter((a) => /^verification\/harness\/duplicate-subjects\/DUP-\d{4,}\.json$/u.test(a.path));
  requireDuplicate(paths.length === 1, 'DUP_ISOLATION', callId, 'one sealed comparison required');
  const subject = parseDuplicateJson(paths[0].bytes); validateDuplicateSubject(subject, model);
  validateDuplicateAttachmentDelivery(subject, taskLine, attachments);
  const ledger = parseDuplicateLedger(readMaterialFile(model.runDir, DUPLICATE_PATH).toString('utf8'));
  const assignment = ledger.assignments.map((r) => parseDuplicateJson(readMaterialFile(model.runDir, r.assignment_path)) as DuplicateAssignment)
    .find((a) => a.proposal_id === subject.proposal_id && a.invocation_id === callId);
  requireDuplicate(assignment, 'DUP_REVIEW', callId, 'assignment must exist before dispatch');
  validateDuplicateRun(model);
  const row = ledger.proposals.find((r) => r.proposal_id === subject.proposal_id)!;
  const producer = parseDuplicateJson(referenced(model, row.producer_receipt_ref).bytes) as Record<string, unknown>;
  requireDuplicate(producerContext === producer.context_id && callId !== producer.context_id, 'DUP_ISOLATION', callId, 'exact distinct producer/reviewer binding required');
  return subject;
}
export function duplicateSuccessorSubject(model: RunModel, lineageId: string, retained = false): DuplicateSubject {
  if (!retained) assertDuplicateWindow(model);
  validateDuplicateRun(model);
  const ledger = parseDuplicateLedger(readMaterialFile(model.runDir, DUPLICATE_PATH).toString('utf8'));
  const subjects = ledger.proposals.map((r) => parseDuplicateJson(readMaterialFile(model.runDir, r.subject_path)) as DuplicateSubject)
    .filter((s) => s.reservation?.lineage_id === lineageId);
  requireDuplicate(subjects.length === 1, 'DUP_REFERENCE', lineageId, 'one exact reviewed successor request required');
  const s = subjects[0], d = ledger.decisions.find((r) => r.proposal_id === s.proposal_id);
  requireDuplicate(d?.verdict === 'upheld' && duplicateAdmissionProblems(s, 'upheld').length === 0
    && (retained || !ledger.effects.some((r) => r.proposal_id === s.proposal_id)), 'DUP_REVIEW', lineageId, 'eligible reviewed request required before successor expression');
  validateDuplicateSubject(s, model, !retained);
  return s;
}
export function validateDuplicateBundleDelivery(model: RunModel, task: DuplicateTask, callId: string, taskLine: string,
  producerContext: string | null, attachments: Array<{ path: string; bytes: Buffer }>): void {
  if (task === 'refutation') { validateDuplicateReviewDispatch(model, callId, taskLine, producerContext, attachments, true); return; }
  const paths = duplicateProducerPaths(callId), ledger = parseDuplicateLedger(readMaterialFile(model.runDir, DUPLICATE_PATH).toString('utf8'));
  let expected: Buffer | undefined;
  if (task === 'comparison') for (const row of ledger.proposals) {
    const tuple = parseDuplicateJson(referenced(model, row.producer_receipt_ref).bytes) as Record<string, unknown>;
    if (tuple.call_id !== callId) continue;
    const s = parseDuplicateJson(readMaterialFile(model.runDir, row.subject_path)); validateDuplicateSubject(s, model);
    expected = Buffer.from(semanticJson({ candidate_ref: s.proposal.candidate_ref, comparison_basis: s.comparison_basis }));
  }
  for (const row of ledger.discoveries) {
    const d = parseDuplicateJson(readMaterialFile(model.runDir, row.record_path)); validateDuplicateDiscovery(d, model);
    if (task === 'discovery') for (const w of d.windows) {
      const tuple = parseDuplicateJson(referenced(model, w.execution_evidence_ref).bytes) as Record<string, unknown>;
      if (tuple.call_id === callId) expected = Buffer.from(semanticJson(d.catalogue.filter((c) => w.member_ids.includes(c.claim_id))));
    }
    if (task === 'contradiction-discovery') for (const sweep of d.sweep_refs) {
      if (sweep.result_ref.startsWith(`control/worker-returns/${callId}/raw.json@`))
        expected = duplicateSweepView(model, d.catalogue.filter((c) => sweep.window_member_ids.includes(c.claim_id)));
    }
  }
  if (!expected) { validateDuplicateProducerDelivery(model, task, callId, taskLine, attachments); return; }
  requireDuplicate(taskLine === DUPLICATE_TASKS[task] && attachments.length === 1 && attachments[0].path === paths.view
    && attachments[0].bytes.equals(expected), 'DUP_ISOLATION', callId, 'retained exact delivery required');
}
export function duplicateProposalState(ledger: DuplicateLedger, proposalId: string): 'proposed' | 'review-pending' | 'reviewed' | 'canonicalized' | 'kept-separate' | 'not-admitted' {
  requireDuplicate(ledger.proposals.some((r) => r.proposal_id === proposalId), 'DUP_REFERENCE', proposalId, 'unknown proposal');
  const effect = ledger.effects.find((r) => r.proposal_id === proposalId);
  if (effect) { oneOf(effect.effect, ['canonicalized', 'kept-separate', 'not-admitted'], 'effect'); return effect.effect; }
  if (ledger.decisions.some((r) => r.proposal_id === proposalId)) return 'reviewed';
  return ledger.assignments.some((r) => r.proposal_id === proposalId) ? 'review-pending' : 'proposed';
}
export const DUPLICATE_SUMMARY_HEADERS = ['proposal_id', 'subject_digest', 'member_ids', 'finding_ref', 'review_verdict', 'effect'] as const;
function duplicateSummaryRows(model: RunModel): MaterialRow[] {
  const ledger = parseDuplicateLedger(readMaterialFile(model.runDir, DUPLICATE_PATH).toString('utf8')), rows: MaterialRow[] = [];
  for (const row of ledger.proposals) {
    const s = parseDuplicateJson(readMaterialFile(model.runDir, row.subject_path)) as DuplicateSubject;
    const decision = ledger.decisions.find((d) => d.proposal_id === row.proposal_id), effect = ledger.effects.find((e) => e.proposal_id === row.proposal_id);
    const refs = [...s.proposal.unresolved_findings.map((f) => `producer:${f.finding_id}`),
      ...s.proposal.contradiction_pairs.map((p) => `producer:flagged:${p.a}/${p.b}`)];
    for (const r of ledger.results.filter((r) => r.proposal_id === row.proposal_id)) {
      const result = parseDuplicateJson(readMaterialFile(model.runDir, r.result_path)) as DuplicateResult;
      refs.push(...result.unresolved_findings.map((f) => `${r.review_id}:${f.finding_id}`));
      if (result.verdict === 'refuted') refs.push(`${r.review_id}:refuted`);
      refs.push(...result.contradiction_pairs.map((p) => `${r.review_id}:flagged:${p.a}/${p.b}`));
    }
    if (effect) {
      const e = parseDuplicateJson(referenced(model, effect.record_ref).bytes) as DuplicateEffect;
      if (e.reason === 'successor-not-preserved') refs.push(`${e.effect_id}:successor-not-preserved`);
    }
    for (const finding_ref of refs) rows.push({ proposal_id: row.proposal_id, subject_digest: row.subject_digest,
      member_ids: semanticJson(s.proposal.member_ids), finding_ref, review_verdict: decision?.verdict || 'none', effect: effect?.effect || 'none' });
  }
  return rows;
}
export function duplicateUnresolvedSummary(model: RunModel): string {
  if (!existsSync(join(model.runDir, DUPLICATE_PATH))) return '';
  validateDuplicateRun(model);
  return materialTableMarkdown([...DUPLICATE_SUMMARY_HEADERS], duplicateSummaryRows(model));
}

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, join } from 'node:path';
import { TextDecoder } from 'node:util';
import {
  mdLineSpan,
  normalizeSha256,
  reachedState,
  sha256,
  sourceFilePath,
} from './check-helpers.ts';
import {
  CANDIDATE_STATES,
  CARRY_STATES,
  INTERNAL_AMBIGUITY_FORMAT,
  PROCEDURAL_ACTIONS,
  RESOLUTION_STATES,
  SEARCH_SCOPE_KINDS,
  T5_1_HEADER,
  T5_2_HEADER,
  T5_3_HEADER,
  ambiguityReviewSubjectDigest,
  CLOSURE_PHASES,
  closurePhases,
  nextClosurePhase,
  operativeScopeProblems,
  parseCandidateRefs,
  parseInternalAmbiguities,
  parseOrderedIds,
  searchBasisDigest,
  sha256Digest,
  tableLooksLike,
  validateProceduralAuthorityRequest,
  validateProceduralAuthorityResponse,
  type AmbiguityReviewSubject,
  type ProceduralAuthorityRequest,
  type ProceduralAuthorityResponse,
  type SearchBasis,
  type T5_1Row,
  type T5_2Row,
  legalResolutionCarryState,
} from './internal-ambiguity.ts';
import { lineageCurrentClaimIds, lineageCurrentPacketIds } from './lineage.ts';
import { findTables, normalizeHeader } from './markdown.ts';
import { parseRelations } from './relations.ts';
import type { ResultCollector } from './results.ts';
import {
  SUPPORTED_RUN_FORMAT_VERSIONS,
  usesInternalAmbiguityLifecycle,
  type RunDocument,
  type RunModel,
} from './run-model.ts';

const VERDICT_FIELDS = [
  'target', 'lens', 'stage', 'shown', 'withheld', 'verdict', 'consequence',
] as const;

interface Verdict {
  target: string;
  verdict: string;
  valid: boolean;
  path: string;
}

function ambiguitySignals(model: RunModel): string[] {
  const signals: string[] = [];
  for (const document of model.documents.values()) {
    if (!document) continue;
    if (document.relativePath === 'ledgers/internal-ambiguities.md') signals.push(document.relativePath);
    if (/internal_ambiguity_format\s*:/u.test(document.text)) signals.push('format marker');
    if (document.tables.some((table) => tableLooksLike(table, 'ambiguity_id'))) signals.push('T5 table');
  }
  return [...new Set(signals)];
}

function exactPositive(value: string): number | null {
  return /^[1-9]\d*$/u.test(value) && Number.isSafeInteger(Number(value)) ? Number(value) : null;
}

function locatorSpan(path: string, locator: string): { start: number; end: number; bytes: Buffer } | null {
  const match = locator.match(/^L([1-9]\d*)-L([1-9]\d*)$/u);
  if (!match) return null;
  const span = mdLineSpan(path, Number(match[1]), Number(match[2]));
  return span?.bytes && span.startByte !== null && span.endByte !== null
    ? { start: span.startByte, end: span.endByte, bytes: span.bytes }
    : null;
}

function canonicalBase64(raw: string): Buffer | null {
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(raw)) return null;
  const bytes = Buffer.from(raw, 'base64');
  return bytes.toString('base64') === raw ? bytes : null;
}

function exactUtf8(bytes: Buffer): boolean {
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    return true;
  } catch {
    return false;
  }
}

function verdictFor(model: RunModel, id: string): Verdict | null {
  const matches: Verdict[] = [];
  for (const document of model.documents.values()) {
    if (!document?.relativePath.startsWith('verification/harness/')) continue;
    if (basename(document.relativePath) !== `${id}.md`) continue;
    const tables = findTables(document.tables, ['field', 'value']);
    const values = new Map<string, string[]>();
    if (tables.length === 1) {
      for (const row of tables[0].rows) {
        const field = normalizeHeader(row.cells[0] || '');
        if (!(VERDICT_FIELDS as readonly string[]).includes(field)) continue;
        const bucket = values.get(field) || [];
        bucket.push((row.cells[1] || '').trim());
        values.set(field, bucket);
      }
    }
    matches.push({
      target: values.get('target')?.[0] || '',
      verdict: values.get('verdict')?.[0] || '',
      valid: tables.length === 1 && VERDICT_FIELDS.every((field) => (
        values.get(field)?.length === 1 && values.get(field)?.[0] !== ''
      )),
      path: document.relativePath,
    });
  }
  return matches.length === 1 ? matches[0] : null;
}

function sourceRow(model: RunModel, id: string) {
  return model.corpus.sources.find((row) => row.values.sourceId === id) || null;
}

function sourceBytes(model: RunModel, id: string): { path: string; bytes: Buffer } | null {
  const source = sourceRow(model, id);
  if (!source) return null;
  const path = sourceFilePath(model.runDir, source.values.locus);
  return path && existsSync(path) ? { path, bytes: readFileSync(path) } : null;
}

function sameSourceEntity(model: RunModel, row: T5_1Row): boolean {
  if (row.values.sourceEntityKind === 'PKT') {
    return model.packets.some((packet) => (
      packet.values.packetId === row.values.sourceEntityId
      && packet.values.sourceId === row.values.sourceId
    ));
  }
  if (row.values.sourceEntityKind === 'CC') {
    return model.claims.some((claim) => (
      claim.values.claimId === row.values.sourceEntityId
      && claim.values.sources.split(',').map((part) => part.trim()).includes(row.values.sourceId)
    ));
  }
  return false;
}

function localScopeRefs(model: RunModel, row: T5_2Row): string[] | null {
  try {
    const value = JSON.parse(row.values.searchCompletionRef) as unknown;
    if (!Array.isArray(value) || value.length === 0
      || value.some((id) => typeof id !== 'string' || !/^WLK-\d{4,}$/u.test(id))
      || JSON.stringify(value) !== row.values.searchCompletionRef
      || new Set(value).size !== value.length) return null;
    const order = new Map(model.sourceWalk.intervals.map((interval, index) => [interval.values.walkId, index]));
    if (value.some((id) => !order.has(id))) return null;
    if (value.some((id, index) => index > 0 && order.get(value[index - 1])! >= order.get(id)!)) return null;
    return value;
  } catch {
    return null;
  }
}

function completionRef(model: RunModel, sourceId: string): string | null {
  const completion = model.sourceWalk.completions.find((row) => (
    row.values.sourceId === sourceId && row.values.completionState === 'complete'
  ));
  if (!completion) return null;
  return `${sourceId}@${completion.values.finalCursorId}@${completion.values.sourceHash}`;
}

function reviewSubject(definition: T5_1Row, assessment: T5_2Row): AmbiguityReviewSubject | null {
  const packets = parseOrderedIds(definition.values.basisPacketIds, 'PKT');
  const candidates = parseCandidateRefs(assessment.values.candidateRefs);
  const relations = parseOrderedIds(assessment.values.affectedRelationIds, 'REL', true);
  const start = Number(definition.values.expressionStartByte);
  const end = Number(definition.values.expressionEndByte);
  if (!packets.clean || !candidates.clean || !relations.clean
    || !Number.isSafeInteger(start) || !Number.isSafeInteger(end)) return null;
  return {
    source_entity_kind: definition.values.sourceEntityKind as 'PKT' | 'CC',
    source_entity_id: definition.values.sourceEntityId,
    source_id: definition.values.sourceId,
    expression_locator: definition.values.expressionLocator,
    expression_start_byte: start,
    expression_end_byte: end,
    expression_sha256: definition.values.expressionSha256,
    expression_bytes_base64: definition.values.expressionBytesBase64,
    basis_packet_ids: packets.ids,
    search_scope_kind: assessment.values.searchScopeKind as SearchBasis['scope_kind'],
    search_completion_ref: assessment.values.searchCompletionRef,
    search_basis_digest: assessment.values.searchBasisDigest,
    candidate_state: assessment.values.candidateState as SearchBasis['candidate_state'],
    candidate_refs: candidates.candidates,
    affected_relation_ids: relations.ids,
    resolution_state: assessment.values.resolutionState as AmbiguityReviewSubject['resolution_state'],
    carry_state: assessment.values.carryState as AmbiguityReviewSubject['carry_state'],
    proposed_by: assessment.values.proposedBy,
  };
}

function controlJsonFiles(runDir: string): string[] {
  const directory = join(runDir, 'control/gates');
  return existsSync(directory)
    ? readdirSync(directory).filter((name) => name.endsWith('.json')).sort()
    : [];
}

function checkControlState(model: RunModel, fail: (message: string) => void): void {
  const names = controlJsonFiles(model.runDir);
  const requests = new Map<string, { value: ProceduralAuthorityRequest; bytes: Buffer }>();
  const responses = new Map<string, ProceduralAuthorityResponse>();
  for (const name of names) {
    const path = join(model.runDir, 'control/gates', name);
    const bytes = readFileSync(path);
    try {
      const value = JSON.parse(bytes.toString('utf8')) as unknown;
      if (name.endsWith('-request.json')) {
        const request = value as ProceduralAuthorityRequest;
        const canonical = validateProceduralAuthorityRequest(request);
        if (!canonical.equals(bytes)) fail(`${name} is not exact canonical request bytes`);
        if (name !== `${request.request_id}-request.json`) fail(`${name} request identity/path mismatch`);
        requests.set(request.request_id, { value: request, bytes });
      } else if (name.endsWith('-response.json')) {
        responses.set((value as ProceduralAuthorityResponse).request_id, value as ProceduralAuthorityResponse);
      }
    } catch (error) {
      fail(`${name} is invalid: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  let active = 0;
  for (const [id, request] of requests) {
    const response = responses.get(id);
    if (!response) { active += 1; continue; }
    try {
      const bytes = validateProceduralAuthorityResponse(request.value, request.bytes, response);
      const path = join(model.runDir, 'control/gates', `${id}-response.json`);
      if (!existsSync(path) || !bytes.equals(readFileSync(path))) {
        fail(`${id} response is not exact canonical retained bytes`);
      }
    } catch (error) {
      fail(`${id} response is invalid: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  for (const id of responses.keys()) if (!requests.has(id)) fail(`${id} has a fabricated or orphan response`);
  if (active > 1) fail(`at most one active internal-ambiguity request is legal; found ${active}`);
}

export function runK2Ambiguities(results: ResultCollector, model: RunModel): void {
  results.run('K2.17', 'internal ambiguity lifecycle structure (STRUCTURAL ONLY)', (fail) => {
    const version = model.manifest?.runFormatVersion || '';
    const active = usesInternalAmbiguityLifecycle(version);
    const signals = ambiguitySignals(model);
    const ambiguity = parseInternalAmbiguities(model);
    if (!active) {
      if (signals.length > 0) fail(`run format ${version || '(pre-versioned)'} must reject active 1.5 ambiguity artifacts`);
      if (version && !(SUPPORTED_RUN_FORMAT_VERSIONS as readonly string[]).includes(version)) {
        fail(`ambiguity activation cannot determine unsupported run_format_version "${version}"`);
      }
      return `internal ambiguity lifecycle is not applicable to run format ${version || '(pre-versioned)'}`;
    }

    const phases = closurePhases(model.runLog);
    const retainedPhaseLines = model.runLog?.lines.filter((line) => /^\s*closure_phase\s*:/u.test(line)) || [];
    if (retainedPhaseLines.length !== phases.length) fail('closure_phase contains an unknown value');
    if (phases.some((phase, index) => phase !== CLOSURE_PHASES[index])) {
      fail('retained closure phases are duplicated, skipped, or out of order');
    } else if (phases.length < CLOSURE_PHASES.length) {
      try { nextClosurePhase(phases); }
      catch (error) { fail(error instanceof Error ? error.message : String(error)); }
    }
    const hasC1 = phases.includes('S4-C1-relations-closed');
    const hasC2 = phases.includes('S4-C2-ambiguities-finalized');
    const hasC3 = phases.includes('S4-C3-exit');
    const hasS5 = Boolean(model.runLog?.lines.some((line) => /—\s*S5\s*—\s*entry/u.test(line)));
    if ((hasC2 || hasC3 || hasS5) && !hasC1) fail('C2, C3, and S5 require retained C1');
    if ((hasC3 || hasS5) && !hasC2) fail('C3 and S5 require retained C2');
    if (hasS5 && !hasC3) fail('S5 requires retained C3');
    const relations = parseRelations(model);
    if (hasC1 && (!relations.document || relations.rows.length === 0)) {
      fail('C1 marker requires a complete nonempty canonical relations artifact');
    }

    if (!ambiguity.document) {
      if (hasC2 || hasC3 || hasS5 || signals.length > 0) {
        fail('run format 1.5 requires ledgers/internal-ambiguities.md at C2, C3, and S5');
      }
      return '1.5 ambiguity artifact is not required before C2';
    }
    const markerCount = ambiguity.document.lines.filter((line) => (
      /^\s*-\s*internal[_ -]ambiguity[_ -]format\s*:/iu.test(line)
    )).length;
    if (markerCount !== 1 || ambiguity.format !== INTERNAL_AMBIGUITY_FORMAT) {
      fail(`internal_ambiguity_format must equal ${INTERNAL_AMBIGUITY_FORMAT} exactly once`);
    }
    const ambiguityTables = ambiguity.document.tables.filter((table) => tableLooksLike(table, 'ambiguity_id'));
    if (ambiguityTables.length !== 3 || ambiguity.t5_1Tables.length !== 1
      || ambiguity.t5_2Tables.length !== 1 || ambiguity.t5_3Tables.length !== 1) {
      fail('internal ambiguity artifact requires exactly three canonical T5.1/T5.2/T5.3 tables');
    }
    for (const [table, expected] of [
      [ambiguity.t5_1Tables[0], T5_1_HEADER],
      [ambiguity.t5_2Tables[0], T5_2_HEADER],
      [ambiguity.t5_3Tables[0], T5_3_HEADER],
    ] as const) {
      if (table && table.normalizedHeader.join('\0') !== expected.map(normalizeHeader).join('\0')) {
        fail('T5 canonical column ordering is invalid');
      }
    }
    if (!hasC2 && (ambiguity.t5_1Rows.length || ambiguity.t5_2Rows.length || ambiguity.t5_3Rows.length)) {
      fail('canonical ambiguity rows are forbidden before C2 finalization');
    }

    const currentPackets = lineageCurrentPacketIds(model);
    const currentClaims = lineageCurrentClaimIds(model);
    const definitions = new Map<string, T5_1Row>();
    const expressionKeys = new Set<string>();
    for (const row of ambiguity.t5_1Rows) {
      const values = row.values;
      if (!/^AMB-\d{4,}$/u.test(values.ambiguityId)) fail(`${values.ambiguityId || 'T5.1 row'} has invalid ambiguity_id`);
      if (definitions.has(values.ambiguityId)) fail(`${values.ambiguityId} is defined more than once`);
      else definitions.set(values.ambiguityId, row);
      if (!sameSourceEntity(model, row)) fail(`${values.ambiguityId} source entity is absent or not from ${values.sourceId}`);
      if (values.sourceEntityKind === 'PKT' && !currentPackets.has(values.sourceEntityId)) fail(`${values.ambiguityId} source packet is historical`);
      if (values.sourceEntityKind === 'CC' && !currentClaims.has(values.sourceEntityId)) fail(`${values.ambiguityId} source claim is historical`);
      const source = sourceBytes(model, values.sourceId);
      const start = Number(values.expressionStartByte);
      const end = Number(values.expressionEndByte);
      if (!source || !/^\d+$/u.test(values.expressionStartByte) || !/^\d+$/u.test(values.expressionEndByte)
        || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end <= start
        || end > (source?.bytes.length || 0)) {
        fail(`${values.ambiguityId} expression interval is invalid`);
        continue;
      }
      const expression = source.bytes.subarray(start, end);
      if (!exactUtf8(expression)) fail(`${values.ambiguityId} interval is not on valid UTF-8 boundaries`);
      const decoded = canonicalBase64(values.expressionBytesBase64);
      if (!decoded || !decoded.equals(expression)) fail(`${values.ambiguityId} expression base64 does not reopen exact bytes`);
      if (normalizeSha256(values.expressionSha256) !== sha256(expression)) fail(`${values.ambiguityId} expression hash is wrong`);
      const locus = locatorSpan(source.path, values.expressionLocator);
      if (!locus || start < locus.start || end > locus.end) fail(`${values.ambiguityId} expression locator does not contain the interval`);
      const expressionKey = `${values.sourceId}\0${start}\0${end}\0${values.expressionSha256}`;
      if (expressionKeys.has(expressionKey)) fail(`${values.ambiguityId} duplicates an exact expression definition`);
      expressionKeys.add(expressionKey);
      const packets = parseOrderedIds(values.basisPacketIds, 'PKT');
      if (!packets.clean) fail(`${values.ambiguityId} basis_packet_ids are not canonical`);
      let covered = false;
      for (const id of packets.ids) {
        const packet = model.packets.find((candidate) => candidate.values.packetId === id);
        if (!packet || packet.values.sourceId !== values.sourceId || !currentPackets.has(id)) {
          fail(`${values.ambiguityId} basis packet ${id} is absent, cross-source, or historical`);
          continue;
        }
        const packetSpan = locatorSpan(source.path, packet.values.locator);
        if (packetSpan && start >= packetSpan.start && end <= packetSpan.end) covered = true;
      }
      if (!covered) fail(`${values.ambiguityId} basis packets do not cover the expression interval`);
      if (!/^(?:human|invocation):\S+$/u.test(values.detectedBy)
        || /^human:(?:authority|operator)(?:$|[-_:])/iu.test(values.detectedBy)) {
        fail(`${values.ambiguityId} detector identity is invalid or authority-owned`);
      }
    }

    const assessments = new Map<string, T5_2Row[]>();
    const reviewDigests = new Set<string>();
    const relationIds = new Set(relations.rows.map((row) => row.values.relationId));
    for (const row of ambiguity.t5_2Rows) {
      const values = row.values;
      const definition = definitions.get(values.ambiguityId);
      if (!definition) { fail(`${values.ambiguityId || 'T5.2 row'} has no T5.1 definition`); continue; }
      const bucket = assessments.get(values.ambiguityId) || [];
      bucket.push(row); assessments.set(values.ambiguityId, bucket);
      const seq = exactPositive(values.assessmentSeq);
      const expectedPredecessor = seq === 1 ? 'none' : String((seq || 0) - 1);
      if (!seq || values.predecessorAssessmentSeq !== expectedPredecessor) fail(`${values.ambiguityId} assessment predecessor is invalid`);
      if (!(SEARCH_SCOPE_KINDS as readonly string[]).includes(values.searchScopeKind)) fail(`${values.ambiguityId} search_scope_kind is invalid`);
      if (!(CANDIDATE_STATES as readonly string[]).includes(values.candidateState)) fail(`${values.ambiguityId} candidate_state is invalid`);
      if (!(RESOLUTION_STATES as readonly string[]).includes(values.resolutionState)) fail(`${values.ambiguityId} resolution_state is invalid`);
      if (!(CARRY_STATES as readonly string[]).includes(values.carryState)) fail(`${values.ambiguityId} carry_state is invalid`);
      if (values.searchSourceId !== definition.values.sourceId) fail(`${values.ambiguityId} search source crosses the frozen source`);
      const candidates = parseCandidateRefs(values.candidateRefs);
      if (!candidates.clean) fail(`${values.ambiguityId} candidate_refs: ${candidates.error || 'invalid'}`);
      const count = candidates.candidates.length;
      if ((values.candidateState === 'single' && count !== 1)
        || (values.candidateState === 'multiple' && count < 2)
        || (values.candidateState.startsWith('null-') && count !== 0)) {
        fail(`${values.ambiguityId} candidate_state/count mismatch`);
      }
      const source = sourceBytes(model, definition.values.sourceId);
      for (const candidate of candidates.candidates) {
        if (candidate.kind === 'PKT') {
          const packet = model.packets.find((entry) => entry.values.packetId === candidate.id);
          if (!packet || packet.values.sourceId !== definition.values.sourceId || !currentPackets.has(candidate.id)) {
            fail(`${values.ambiguityId} candidate ${candidate.id} is absent, cross-source, or historical`);
          }
        } else if (candidate.source_id !== definition.values.sourceId || !source) {
          fail(`${values.ambiguityId} source-locus candidate crosses the frozen source`);
        } else {
          const span = locatorSpan(source.path, candidate.locator);
          if (!span || sha256Digest(span.bytes) !== candidate.span_hash) {
            fail(`${values.ambiguityId} source-locus candidate does not reopen exact bytes`);
          }
        }
      }
      const scopeRefs = values.searchScopeKind === 'local-intervals'
        ? localScopeRefs(model, row) : [];
      if (values.searchScopeKind === 'local-intervals') {
        if (!scopeRefs || values.candidateState !== 'single' || values.resolutionState !== 'resolved-local') {
          fail(`${values.ambiguityId} local search requires ordered intervals and one resolved candidate`);
        } else if (scopeRefs.some((id) => model.sourceWalk.intervals.find((item) => item.values.walkId === id)?.values.sourceId !== values.searchSourceId)) {
          fail(`${values.ambiguityId} local search interval crosses source`);
        }
      } else if (values.searchCompletionRef !== completionRef(model, values.searchSourceId)) {
        fail(`${values.ambiguityId} full-same-source completion reference is invalid`);
      }
      if (values.resolutionState === 'resolved-local' && (values.candidateState !== 'single' || values.carryState !== 'none')) {
        fail(`${values.ambiguityId} resolved-local requires one candidate and carry none`);
      }
      if (values.resolutionState === 'unresolved' && values.searchScopeKind !== 'full-same-source') {
        fail(`${values.ambiguityId} unresolved assessment requires full-same-source search`);
      }
      const affected = parseOrderedIds(values.affectedRelationIds, 'REL', true);
      if (!affected.clean) fail(`${values.ambiguityId} affected_relation_ids are not canonical`);
      affected.ids.forEach((id) => { if (!relationIds.has(id)) fail(`${values.ambiguityId} affected relation ${id} is absent`); });
      if (!legalResolutionCarryState(
        values.resolutionState,
        values.carryState,
        affected.ids.length,
      )) fail(`${values.ambiguityId} has an illegal resolution/carry/affected-set combination`);
      const packets = parseOrderedIds(definition.values.basisPacketIds, 'PKT');
      const sourceRecord = sourceRow(model, definition.values.sourceId);
      const expressionStart = Number(definition.values.expressionStartByte);
      const expressionEnd = Number(definition.values.expressionEndByte);
      if (sourceRecord && packets.clean && candidates.clean && affected.clean
        && Number.isSafeInteger(expressionStart) && Number.isSafeInteger(expressionEnd)) {
        const basis: SearchBasis = {
          source_id: definition.values.sourceId,
          source_hash: sourceRecord.values.contentHash,
          source_length_bytes: source?.bytes.length || 0,
          scope_kind: values.searchScopeKind as SearchBasis['scope_kind'],
          scope_refs: scopeRefs || [],
          completion_ref: values.searchScopeKind === 'local-intervals' ? 'none' : values.searchCompletionRef,
          expression_start_byte: expressionStart,
          expression_end_byte: expressionEnd,
          expression_sha256: definition.values.expressionSha256,
          basis_packet_ids: packets.ids,
          candidate_state: values.candidateState as SearchBasis['candidate_state'],
          candidate_refs: candidates.candidates,
        };
        if (searchBasisDigest(basis) !== values.searchBasisDigest) fail(`${values.ambiguityId} search_basis_digest is wrong`);
      }
      const subject = reviewSubject(definition, row);
      if (!subject || ambiguityReviewSubjectDigest(subject) !== values.reviewSubjectDigest) {
        fail(`${values.ambiguityId} review_subject_digest is wrong`);
      }
      if (reviewDigests.has(values.reviewSubjectDigest)) fail(`${values.ambiguityId} duplicates a review-subject digest`);
      reviewDigests.add(values.reviewSubjectDigest);
      if (!/^VER-\d{4,}$/u.test(values.reviewedBy)) fail(`${values.ambiguityId} reviewed_by is invalid`);
      const verdict = verdictFor(model, values.reviewedBy);
      const target = `internal-ambiguity-review-subject:${values.reviewSubjectDigest}`;
      if (!verdict?.valid || verdict.target !== target || verdict.verdict !== 'upheld') {
        fail(`${values.ambiguityId} requires one fresh upheld verifier bound to ${target}`);
      }
      if (!/^(?:human|invocation):\S+$/u.test(values.proposedBy)) fail(`${values.ambiguityId} proposed_by is invalid`);
    }
    for (const [id, rows] of assessments) {
      const sequences = rows.map((row) => Number(row.values.assessmentSeq)).sort((a, b) => a - b);
      if (sequences.some((value, index) => value !== index + 1)) fail(`${id} assessment history is forked or noncontiguous`);
    }
    if (hasC2) {
      for (const id of definitions.keys()) if (!assessments.has(id)) fail(`${id} has no reviewed T5.2 assessment at C2`);
    }

    const authoritySeqs = new Map<string, number[]>();
    for (const row of ambiguity.t5_3Rows) {
      const values = row.values;
      const current = assessments.get(values.ambiguityId)?.at(-1);
      const seq = exactPositive(values.authoritySeq);
      if (!seq) fail(`${values.ambiguityId} authority_seq is invalid`);
      else {
        const bucket = authoritySeqs.get(values.ambiguityId) || [];
        bucket.push(seq); authoritySeqs.set(values.ambiguityId, bucket);
      }
      if (!current || values.assessmentSeq !== current.values.assessmentSeq
        || current.values.resolutionState !== 'unresolved') {
        fail(`${values.ambiguityId} T5.3 row is not bound to the current unresolved assessment`);
      }
      if (!(PROCEDURAL_ACTIONS as readonly string[]).includes(values.action)) fail(`${values.ambiguityId} T5.3 action is invalid`);
      if (values.selectedCandidateRef !== 'none') fail(`${values.ambiguityId} selected_candidate_ref must equal none`);
      if (!/^sha256:[a-f0-9]{64}$/u.test(values.authoritySubjectDigest)) fail(`${values.ambiguityId} authority subject digest is invalid`);
      if (!/^authority-response:RESP-S4-AMB-\d{4,}-A[1-9]\d*-Q[1-9]\d*@sha256:[a-f0-9]{64}$/u.test(values.authorityRef)) {
        fail(`${values.ambiguityId} authority_ref is invalid`);
      }
      if (!/^request:GATE-S4-AMB-\d{4,}-A[1-9]\d*-Q[1-9]\d*@sha256:[a-f0-9]{64};response:RESP-S4-AMB-\d{4,}-A[1-9]\d*-Q[1-9]\d*@sha256:[a-f0-9]{64}$/u.test(values.closureProvenance)) {
        fail(`${values.ambiguityId} closure_provenance is invalid`);
      }
    }
    for (const [id, sequences] of authoritySeqs) {
      sequences.sort((a, b) => a - b);
      if (sequences.some((value, index) => value !== index + 1)) fail(`${id} authority history is forked or noncontiguous`);
    }

    for (const file of model.files.filter((entry) => (
      /^verification\/harness\/S4\/material-impact-subjects\/AMB-\d{4,}-A\d+-M\d+\.json$/u.test(entry.relativePath)
    ))) {
      try {
        const subject = JSON.parse(file.text) as Record<string, unknown>;
        if (JSON.stringify(subject) !== file.text) fail(`${file.relativePath} is not compact canonical JSON`);
        if (subject.format !== 'aleph-internal-ambiguity-material-impact-review-subject/v1') fail(`${file.relativePath} format is invalid`);
        const scope = subject.operative_scope as Parameters<typeof operativeScopeProblems>[0];
        const problems = operativeScopeProblems(scope);
        problems.forEach((problem) => fail(`${file.relativePath}: ${problem}`));
        if (subject.materiality_class === 'B' && (scope.affected_ids.length || scope.impact_rows.length)) fail(`${file.relativePath} Class B scope must be empty`);
        if (subject.materiality_class === 'C' && (!scope.affected_ids.length || !scope.impact_rows.length)) fail(`${file.relativePath} Class C scope must be nonempty`);
      } catch (error) {
        fail(`${file.relativePath} is malformed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    checkControlState(model, fail);

    return `${String(definitions.size)} ambiguity definition(s), ${String(ambiguity.t5_2Rows.length)} assessment(s), and ${String(ambiguity.t5_3Rows.length)} procedural row(s) are structurally valid; STRUCTURAL ONLY`;
  });
}

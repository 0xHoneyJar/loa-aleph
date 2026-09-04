#!/usr/bin/env node

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  BUNDLE_LOCK_FORMAT,
  DIGEST_ALGORITHM,
  SOURCE_PROVENANCE_FORMAT,
  canonicalJsonBytes,
  type BundleLock,
  type CoreManifest,
} from './lib/bundle-format.ts';
import {
  AUTHORITY_REQUEST_FORMAT,
  AUTHORITY_RESPONSE_FORMAT,
  MATERIAL_IMPACT_SUBJECT_FORMAT,
  PROCEDURAL_ACTIONS,
  PROCEDURAL_SUBJECT_FORMAT,
  ambiguityReviewSubjectJson,
  buildProceduralAuthorityRequest,
  buildProceduralAuthorityResponse,
  buildProceduralAuthoritySubject,
  closurePhasesFromText,
  exactTextBlob,
  materialImpactSubjectJson,
  nextClosurePhase,
  operativeScopeProblems,
  parseCandidateRefs,
  proceduralAuthorityRequestJson,
  proceduralAuthorityResponseJson,
  projectProceduralActions,
  resolvePinnedCoreRequirement,
  restrictionOverlay,
  searchBasisJson,
  sha256Digest,
  validateProceduralAuthorityRequest,
  validateProceduralAuthorityResponse,
  validateTextBlob,
  type MaterialImpactSubject,
  type OperativeScope,
  type PinnedCoreAuthority,
  type ProceduralAuthoritySubject,
} from './lib/internal-ambiguity.ts';

let passed = 0;

function expect(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function expectThrows(run: () => unknown, pattern: RegExp): void {
  try {
    run();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    expect(pattern.test(message), `expected ${String(pattern)}, got ${message}`);
    return;
  }
  throw new Error(`expected failure matching ${String(pattern)}`);
}

function check(name: string, run: () => void): void {
  run();
  passed += 1;
  console.log(`PASS ${name}`);
}

const scope: OperativeScope = {
  affected_ids: ['CC-0007'],
  impact_rows: [{
    affected_id: 'CC-0007',
    operation_kind: 'load-bearing-reasoning',
    requirement_ref: 'core:docs/requirement.md#Exact requirement',
    unresolved_treatment: 'carry-or-restriction',
    consequence_if_unresolved: 'The exact use remains contingent on the unresolved expression.',
  }],
};

function authoritySubject(): ProceduralAuthoritySubject {
  return buildProceduralAuthoritySubject({
    run_id: 'RUN-internal-ambiguity-contracts',
    ambiguity_id: 'AMB-0007',
    assessment_seq: 2,
    t5_2_assessment_ref: `internal-ambiguity:T5.2:AMB-0007:A2@${'sha256:' + '1'.repeat(64)}`,
    t5_2_review_subject_digest: `sha256:${'2'.repeat(64)}`,
    t5_2_review_ref: `ambiguity-review-verdict:VER-0007@sha256:${'3'.repeat(64)}`,
    prior_indeterminate_review_refs: [],
    candidate_state: 'null-cannot-determine',
    candidate_refs: [],
    carry_state: 'none',
    affected_relation_ids: [],
    c1_relation_basis_ref: 'none',
    material_impact_seq: 1,
    material_impact_subject_ref: `material-impact-subject:AMB-0007:A2:M1@sha256:${'4'.repeat(64)}`,
    material_impact_review_ref: `material-impact-verdict:VER-0008@sha256:${'5'.repeat(64)}`,
    operative_scope: structuredClone(scope),
    source_locators: ['SRC-0001:L1-L1'],
    reviewed_unaffected_ids: [],
    unresolved_statement: 'The frozen same-source bytes do not determine the referent.',
  });
}

function pinnedAuthority(bytes: Buffer): PinnedCoreAuthority {
  const path = 'docs/requirement.md';
  const manifest: CoreManifest = {
    manifest_format: 'aleph-core-manifest/v1',
    core: {
      id: 'aleph-core',
      version: 'fixture',
      adapter_protocol_version: 'fixture',
      run_format_version: '1.5.0-provisional',
      digest_algorithm: DIGEST_ALGORITHM,
    },
    manual_execution_binding: {
      id: 'manual', version: 'fixture', lifecycle: 'implemented', paths: [],
    },
    files: {
      core: [path], adapter: { fixture: [] }, packaging: [],
      repository_administration: [],
    },
    checker_paths: [],
    reference_documents: [],
    bundle_targets: [{ id: 'fixture', version: 'fixture', adapter_id: 'fixture' }],
  };
  const record = { path, classification: 'core' as const, digest: sha256Digest(bytes) };
  const lock = {
    lock_format: BUNDLE_LOCK_FORMAT,
    digest_algorithm: DIGEST_ALGORITHM,
    lock_digest: `sha256:${'6'.repeat(64)}`,
    bundle: {
      id: 'fixture', version: 'fixture', payload_digest: `sha256:${'7'.repeat(64)}`,
      digest: `sha256:${'8'.repeat(64)}`,
    },
    core: { id: 'aleph-core', version: 'fixture', tree_digest: `sha256:${'9'.repeat(64)}` },
    adapter: {
      id: 'fixture', version: 'fixture', lifecycle: 'implemented',
      tree_digest: `sha256:${'a'.repeat(64)}`,
    },
    checker_digest: `sha256:${'b'.repeat(64)}`,
    adapter_protocol_version: 'fixture',
    run_format_version: '1.5.0-provisional',
    source: {
      manifest_projection: manifest,
      manifest_projection_digest: sha256Digest(canonicalJsonBytes(manifest)),
      assembly_tool: { path: 'scripts/assemble-bundles.ts', digest: `sha256:${'c'.repeat(64)}` },
    },
    provenance: {
      format: SOURCE_PROVENANCE_FORMAT,
      vcs: {
        kind: 'git-dependency-closure-snapshot', object_format: 'sha1',
        commit: '1'.repeat(40), commit_object: '2'.repeat(40), commit_tree: '3'.repeat(40),
        resolved: true, mutable_ref: null, worktree_state: 'clean',
      },
      digest: `sha256:${'d'.repeat(64)}`,
    },
    files: [record],
  } satisfies BundleLock;
  return {
    source_kind: 'retained-immutable-bundle',
    root: '/does-not-exist',
    lock,
    expected_bundle_digest: lock.bundle.digest,
    expected_core_digest: lock.core.tree_digest,
    file_bytes: new Map([[path, bytes]]),
  };
}

check('candidate grammar and numeric canonical ordering', () => {
  const valid = '[{"kind":"PKT","id":"PKT-9999"},{"kind":"PKT","id":"PKT-10000"},{"kind":"source-locus","source_id":"SRC-0001","locator":"L1-L1","span_hash":"sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}]';
  expect(parseCandidateRefs(valid).clean, 'valid ordered candidates failed');
  expect(!parseCandidateRefs(valid.replace('PKT-9999', 'CC-9999')).clean, 'CC candidate passed');
  expect(!parseCandidateRefs(`[ ${valid.slice(1)}`).clean, 'noncompact JSON passed');
  expect(!parseCandidateRefs('[{"kind":"PKT","id":"PKT-10000"},{"kind":"PKT","id":"PKT-9999"}]').clean, 'numeric disorder passed');
});

check('canonical search and ambiguity subjects preserve exact key order', () => {
  const search = searchBasisJson({
    source_id: 'SRC-0001', source_hash: `sha256:${'a'.repeat(64)}`,
    source_length_bytes: 12, scope_kind: 'local-intervals', scope_refs: ['WLK-0001'],
    completion_ref: 'none', expression_start_byte: 0, expression_end_byte: 4,
    expression_sha256: `sha256:${'b'.repeat(64)}`, basis_packet_ids: ['PKT-0001'],
    candidate_state: 'single', candidate_refs: [{ kind: 'PKT', id: 'PKT-0001' }],
  });
  expect(search.startsWith('{"format":"aleph-internal-ambiguity-search-basis/v1","source_id"'), 'search key order drifted');
  const review = ambiguityReviewSubjectJson({
    source_entity_kind: 'CC', source_entity_id: 'CC-0001', source_id: 'SRC-0001',
    expression_locator: 'L1-L1', expression_start_byte: 0, expression_end_byte: 4,
    expression_sha256: `sha256:${'b'.repeat(64)}`, expression_bytes_base64: 'dGVzdA==',
    basis_packet_ids: ['PKT-0001'], search_scope_kind: 'local-intervals',
    search_completion_ref: '["WLK-0001"]', search_basis_digest: sha256Digest(search),
    candidate_state: 'single', candidate_refs: [{ kind: 'PKT', id: 'PKT-0001' }],
    affected_relation_ids: [], resolution_state: 'resolved-local', carry_state: 'none',
    proposed_by: 'invocation:producer-1',
  });
  expect(review.startsWith('{"format":"aleph-internal-ambiguity-review-subject/v1","source_entity_kind"'), 'review key order drifted');
});

check('operative scope ordering, tuple uniqueness, and restriction projection', () => {
  expect(operativeScopeProblems(scope).length === 0, 'valid operative scope failed');
  const wide: OperativeScope = {
    affected_ids: ['PKT-9999', 'PKT-10000', 'CC-0001', 'REL-0001'],
    impact_rows: [
      { ...scope.impact_rows[0], affected_id: 'PKT-9999' },
      { ...scope.impact_rows[0], affected_id: 'PKT-10000' },
      { ...scope.impact_rows[0], affected_id: 'CC-0001' },
      { ...scope.impact_rows[0], affected_id: 'REL-0001' },
    ],
  };
  expect(operativeScopeProblems(wide).length === 0, 'numeric affected-ID ordering failed');
  expect(restrictionOverlay(scope)[0].affected_id === 'CC-0007', 'restriction overlay changed scope');
  const duplicate = structuredClone(scope);
  duplicate.impact_rows.push(structuredClone(duplicate.impact_rows[0]));
  expect(operativeScopeProblems(duplicate).some((problem) => /duplicate tuple/u.test(problem)), 'duplicate tuple passed');
});

check('Core action projection is prose-independent and exactly ordered', () => {
  const first = projectProceduralActions(scope);
  const proseOnly = structuredClone(scope);
  proseOnly.impact_rows[0].consequence_if_unresolved = 'Completely different explanatory prose.';
  const second = projectProceduralActions(proseOnly);
  expect(JSON.stringify(first) === JSON.stringify(second), 'prose changed machine action behavior');
  expect(JSON.stringify(first.allowed_actions) === JSON.stringify(PROCEDURAL_ACTIONS), 'six-action order drifted');
  const required = structuredClone(scope);
  required.impact_rows[0].unresolved_treatment = 'resolution-required';
  expect(
    JSON.stringify(projectProceduralActions(required).allowed_actions)
      === JSON.stringify(PROCEDURAL_ACTIONS.slice(2)),
    'resolution-required action projection is wrong',
  );
});

check('material-impact and procedural subjects use exact canonical formats', () => {
  const material: MaterialImpactSubject = {
    format: MATERIAL_IMPACT_SUBJECT_FORMAT,
    run_id: 'RUN-internal-ambiguity-contracts', ambiguity_id: 'AMB-0007',
    assessment_seq: 2, material_impact_seq: 1,
    t5_2_assessment_ref: `internal-ambiguity:T5.2:AMB-0007:A2@sha256:${'1'.repeat(64)}`,
    t5_2_review_subject_digest: `sha256:${'2'.repeat(64)}`,
    t5_2_review_ref: `ambiguity-review-verdict:VER-0007@sha256:${'3'.repeat(64)}`,
    c1_relation_basis_ref: 'none', materiality_class: 'C', operative_scope: scope,
    source_locators: ['SRC-0001:L1-L1'], reviewed_unaffected_ids: [],
    unresolved_statement: 'The referent remains unresolved.',
    review_proposition: 'class-B-or-C-and-canonical-operative-scope-complete-and-accurate-under-cited-Core-requirements',
    proposed_by: 'invocation:material-producer-1',
  };
  expect(materialImpactSubjectJson(material).startsWith(`{"format":"${MATERIAL_IMPACT_SUBJECT_FORMAT}"`), 'material format drifted');
  const subject = authoritySubject();
  expect(subject.format === PROCEDURAL_SUBJECT_FORMAT, 'procedural subject format drifted');
  expect(JSON.stringify(subject.allowed_actions) === JSON.stringify(PROCEDURAL_ACTIONS), 'subject action set drifted');
});

check('request and response bind exact bytes and preserve exact human text', () => {
  const request = buildProceduralAuthorityRequest({
    request_seq: 1, subject: authoritySubject(), presentation: true,
    required_authority_identity: 'operator@example.invalid',
    prepared_by: 'invocation:orchestrator-1', requested_at: '2026-09-03T12:00:00Z',
  });
  expect(request.format === AUTHORITY_REQUEST_FORMAT, 'request format drifted');
  const requestBytes = validateProceduralAuthorityRequest(request);
  expect(requestBytes.toString('utf8') === proceduralAuthorityRequestJson(request), 'request bytes drifted');
  const commentBytes = Buffer.from(' keep  exact spacing \n', 'utf8');
  const response = buildProceduralAuthorityResponse({
    request, request_bytes: requestBytes, authority_identity: 'operator@example.invalid',
    selected_action: 'carry-unresolved', observation: null,
    comment: exactTextBlob(commentBytes), recorded_at: '2026-09-03T12:01:00Z',
  });
  expect(response.format === AUTHORITY_RESPONSE_FORMAT, 'response format drifted');
  const responseBytes = validateProceduralAuthorityResponse(request, requestBytes, response);
  expect(responseBytes.toString('utf8') === proceduralAuthorityResponseJson(response), 'response bytes drifted');
  expect(validateTextBlob(response.comment).equals(commentBytes), 'human comment bytes changed');
  expectThrows(() => buildProceduralAuthorityResponse({
    request, request_bytes: Buffer.from('{}'), authority_identity: 'operator@example.invalid',
    selected_action: 'carry-unresolved', observation: null, comment: null,
    recorded_at: '2026-09-03T12:01:00Z',
  }), /exact canonical retained bytes/u);
});

check('closure phases are single-headed and contiguous', () => {
  const phases = closurePhasesFromText([
    'closure_phase: S4-C1-relations-closed',
    'closure_phase: S4-C2-ambiguities-finalized',
  ].join('\n'));
  expect(nextClosurePhase(phases) === 'S4-C3-exit', 'next closure phase drifted');
  expectThrows(
    () => nextClosurePhase(['S4-C1-relations-closed', 'S4-C1-relations-closed']),
    /duplicated, skipped, or out of order/u,
  );
});

check('requirement_ref resolves only retained immutable pinned Core bytes', () => {
  const bytes = Buffer.from([
    '# Exact requirement',
    '',
    'This section contains DO-S5-001 exactly once.',
    '',
    '```text',
    '# Hidden heading',
    '```',
    '',
    '# Other',
    'Text.',
    '',
  ].join('\n'), 'utf8');
  const authority = pinnedAuthority(bytes);
  const heading = resolvePinnedCoreRequirement(
    authority,
    'core:docs/requirement.md#Exact requirement',
  );
  expect(heading.selector_kind === 'heading', 'exact heading did not resolve');
  expect(heading.bytes.toString('utf8').includes('DO-S5-001'), 'heading bytes are incomplete');
  const token = resolvePinnedCoreRequirement(authority, 'core:docs/requirement.md#DO-S5-001');
  expect(token.selector_kind === 'token', 'durable token did not resolve');
  expectThrows(
    () => resolvePinnedCoreRequirement(authority, 'core:docs/requirement.md#Hidden heading'),
    /does not resolve/u,
  );
  expectThrows(
    () => resolvePinnedCoreRequirement(authority, 'core:../requirement.md#Exact requirement'),
    /noncanonical/u,
  );
  expectThrows(
    () => resolvePinnedCoreRequirement(
      { ...authority, source_kind: 'working-tree' as 'retained-immutable-bundle' },
      'core:docs/requirement.md#Exact requirement',
    ),
    /not a retained immutable bundle/u,
  );
  const duplicate = pinnedAuthority(Buffer.from('# Repeated\n\n# Repeated\n', 'utf8'));
  expectThrows(
    () => resolvePinnedCoreRequirement(duplicate, 'core:docs/requirement.md#Repeated'),
    /does not resolve to one exact heading/u,
  );
});

const scratch = mkdtempSync(join(tmpdir(), 'aleph-internal-ambiguity-contracts-'));
rmSync(scratch, { recursive: true, force: true });
console.log(`RESULT: PASS (${String(passed)}/${String(passed)} focused Core contract cases)`);

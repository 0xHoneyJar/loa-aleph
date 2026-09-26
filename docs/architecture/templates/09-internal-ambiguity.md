# Internal Ambiguity Lifecycle Templates

> Run format: `1.5.0-provisional`
>
> Capability: `internal-ambiguity-lifecycle`

These artifacts are cumulative over run formats 1.0–1.4. They do not migrate
or reinterpret an older run. The orchestrator is the sole canonical writer;
workers return structured proposals and fresh reviewers return verdicts.

## T5.1–T5.3 → `runs/<run-id>/ledgers/internal-ambiguities.md`

```markdown
# Internal Ambiguities — ⟨RUN-slug⟩

- internal_ambiguity_format: aleph-internal-ambiguity/v1

## T5.1 Ambiguity definitions

| ambiguity_id | source_entity_kind | source_entity_id | source_id | expression_locator | expression_start_byte | expression_end_byte | expression_sha256 | expression_bytes_base64 | basis_packet_ids | detected_by |
|--------------|--------------------|------------------|-----------|--------------------|-----------------------|---------------------|-------------------|-------------------------|------------------|-------------|

## T5.2 Reviewed assessments

| ambiguity_id | assessment_seq | predecessor_assessment_seq | search_scope_kind | search_source_id | search_completion_ref | search_basis_digest | candidate_state | candidate_refs | affected_relation_ids | resolution_state | carry_state | proposed_by | review_subject_digest | reviewed_by |
|--------------|----------------|----------------------------|-------------------|------------------|-----------------------|---------------------|-----------------|----------------|-----------------------|------------------|-------------|-------------|-----------------------|-------------|

## T5.3 Procedural authority

| ambiguity_id | authority_seq | assessment_seq | action | selected_candidate_ref | authority_subject_digest | authority_ref | closure_provenance |
|--------------|---------------|----------------|--------|------------------------|--------------------------|---------------|--------------------|
```

Rules:

- T5.1 identity is durable `AMB-NNNN`; definitions are immutable and unique.
  The expression is the exact frozen same-source UTF-8 byte interval, using
  zero-based half-open offsets, canonical base64, and exact SHA-256. Source
  entities are current `PKT` or `CC`; authority identities cannot detect an
  ambiguity.
- T5.2 sequences start at 1 and are single-headed. Search scope is
  `local-intervals` or `full-same-source`; candidate state is `single`,
  `multiple`, `null-no-candidate`, or `null-cannot-determine`. Candidate refs
  are compact canonical JSON containing only `PKT` or same-source
  `source-locus` endpoints. Affected REL IDs are explicit, eligible members of
  the closed S4-C1 relation set, never inferred by graph traversal.
- The exact state matrix is: resolved-local requires `carry_state = none` and
  permits an empty or nonempty affected set; unresolved with `carry_state =
  none` requires an empty affected set; unresolved with `carry_state =
  explicit` requires a nonempty affected set. Every other combination fails.
- T5.3 is procedural only. Its action is one of `carry-unresolved`,
  `restrict-downstream-use`, `inspect-source`, `block-at-current-barrier`,
  `request-successor-corpus-run`, or `record-human-observation`. Every positive
  row has `selected_candidate_ref = none`. T5.3 cannot change T5.2, a relation,
  source meaning, S5 disposition, S6 evidence role, or create an S8 referent.

## Retained canonical JSON

Canonical JSON is compact UTF-8 with the exact Core key order.

- `aleph-internal-ambiguity-search-basis/v1`: `format`, `source_id`,
  `source_hash`, `source_length_bytes`, `scope_kind`, `scope_refs`,
  `completion_ref`, `expression_start_byte`, `expression_end_byte`,
  `expression_sha256`, `basis_packet_ids`, `candidate_state`,
  `candidate_refs`.
- `aleph-internal-ambiguity-review-subject/v1`: `format`, then the exact T5.1
  semantic definition fields, followed by the exact T5.2 pre-review fields.
  The verifier target is
  `internal-ambiguity-review-subject:<sha256-digest>`; only `upheld`
  canonicalizes T5.2.
- `aleph-internal-ambiguity-material-impact-review-subject/v1`: `format`,
  `run_id`, `ambiguity_id`, `assessment_seq`, `material_impact_seq`,
  `t5_2_assessment_ref`, `t5_2_review_subject_digest`, `t5_2_review_ref`,
  `c1_relation_basis_ref`, `materiality_class`, `operative_scope`,
  `source_locators`, `reviewed_unaffected_ids`, `unresolved_statement`,
  `review_proposition`, `proposed_by`. The retained path is
  `verification/harness/S4/material-impact-subjects/AMB-NNNN-A<assessment>-M<material-impact-seq>.json`.

Materiality Class B has empty operative scope and creates no human request.
Class C has nonempty operative scope. Its `affected_ids` contain only same-run
current `PKT`, `CC`, or eligible already-named `REL` IDs. Every impact row is
the exact tuple `affected_id + operation_kind + requirement_ref`, with a
closed unresolved treatment. `consequence_if_unresolved` is retained prose and
never controls execution.

`requirement_ref` is exactly
`core:<canonical-repository-relative-Core-path>#<exact-heading-or-DoD-token>`.
It resolves only against the run-pinned immutable bundle lock, Core manifest
projection, inventory, and retained bytes. Working-tree, mutable-main,
adapter, or repository-administration resolution is illegal.

## Human procedural request and response

Class C uses decision category `internal-ambiguity-procedural-decision` and
retains canonical JSON at:

- `control/gates/GATE-S4-AMB-<four digits>-A<assessment>-Q<request>-request.json`
- `control/gates/GATE-S4-AMB-<four digits>-A<assessment>-Q<request>-response.json`

The request format is `aleph-internal-ambiguity-authority-request/v1`; the
response format is `aleph-internal-ambiguity-authority-response/v1`. The
request binds the exact material-impact review, Core-projected action set,
complete non-operative presentation, required human identity, and authority
subject digest. The response binds the exact request bytes and digest, one
allowed action, and exact optional human text bytes.

M and Q each start at 1 and remain contiguous and single-headed. A material
revision allocates M+1 and the next unused Q; a nonterminal action,
presentation-only replacement, or actual resume after a suspensive block
allocates only the next unused Q. Recovery resumes the first unmet durable
action under the same pins and never chooses, fabricates, normalizes, or
reuses a human response.

Human observation/comment bytes use exact base64 plus SHA-256. They are audit
and control material only and are withheld from ambiguity, material-impact,
relation, S5, S6, synthesis, projection, and fresh semantic-verifier contexts.

## S4 composite barrier

The only legal phase order is:

1. `S4-C1-relations-closed`
2. `S4-C2-ambiguities-finalized`
3. `S4-C3-exit`

C1 serializes and validates the complete relation artifact, then makes it
immediately read-only. C2 produces and reviews T5.1/T5.2, material impact, and
procedural authority where required; a relation defect discovered here
blocks, and cannot repair C1. C3 is legal only after all C2 durable state is
complete. Only then may S5 begin.

## Restriction overlay boundary

`restrict-downstream-use` derives a read-only overlay from the retained T5.3
row, response, authority subject, and operative impact rows. Its key is
`affected_id + operation_kind + requirement_ref`. It is not evidence removal,
source invalidation, exclusion, disposition, support weight, evidence-role
assignment, relation mutation, or a replacement semantic disposition.

## Cumulative 1.9 bounded work preparation

With `orchestrator-work-transitions`, the adopted constrained-proposal
mechanism represents expression selection as orchestration metadata:

```json
{
  "format": "aleph-ambiguity-expression-selection/v1",
  "expressions": [
    {
      "source_entity_kind": "PKT",
      "source_entity_id": "PKT-0001",
      "source_id": "SRC-001",
      "locator": "L1-L1",
      "start_byte": 0,
      "end_byte": 1,
      "basis_packet_ids": ["PKT-0001"]
    }
  ]
}
```

These example identities and bounds must be replaced by exact existing
same-source, lineage-current, packet-covered selections. Core retains the
submitted bytes and derives each producer view; the proposal supplies no
destination, after-image, assessment, candidate choice or material scope.
Selection is a question, not a finding or evidence that no ambiguity exists.
Existing semantic findings and their dispositions remain retained.

For cumulative `1.9.0-provisional` with `orchestrator-work-transitions`,
HUMAN C-08 controls every C2 source reference: source syntax is
`^SRC-\d{3,}$`, and each reference must equal exactly one frozen inventory
row's `source_id`. Same-source fields additionally equal their bound source.
`SRC-0001` is not an alias for frozen `SRC-001`. The exact frozen token is
serialized in search bases, `source_id`, `search_source_id`, full-source
completion references (`SRC-001@CUR-0001@sha256:…`) and material locators
(`SRC-001:L1-L4`). Locator reopening, exact hashes, source completion,
review and all other identifier grammars remain independently controlling.
Predecessor formats retain their pinned behavior; no inventory or source
allocation change, alias, repadding or migration occurs.

The ambiguity producer supplies the existing definition and assessment
fields for each selected expression. Core retains the exact subject and
requires fresh ambiguity review before canonical T5.1/T5.2 publication.
Unresolved assessments require the existing separate material-impact
producer and fresh reviewer; Class B creates no human request, and Class C
retains the existing procedural-authority requirement. No selection metadata
can satisfy those review or authority predicates.

For an upheld Class C subject, the bounded contact proposal contains only
`format: aleph-ambiguity-authority-contact/v1` and the supplied human
`identity`. It identifies the request recipient and supplies no action,
response, semantic field or writer destination. Core derives and retains
the exact Q request; the existing human response ingress remains separate.
Response application and a lawful Q follow-up are separate work transactions.
A new authority halt is returned before another selection in that resume
call; a subsequent resume can derive a permitted follow-up from retained
request, response, T5.2 and reviewed M evidence.

The C1 relation, representation, semantic and duplicate seals remain
immutable throughout C2/C3. Only complete C2 permits C3 and deterministic S5
entry. The implemented S0–S4 orchestration frontier then returns
`WORK_UNSUPPORTED_CAPABILITY`; this is not an implementation of S5 work.

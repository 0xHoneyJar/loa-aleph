# PROPOSED Slice 5 Internal Ambiguity and Referent Lifecycle Design

Status: PROPOSED — HUMAN AUTHORITY ADOPTION REQUIRED

Date: 2026-08-30

Repository: `0xHoneyJar/loa-aleph`

Canonical design base:
`e136a3fbbf8bc503f3e65e9850e9289f29531981`

Canonical design-base tree:
`aebd171baca8402eb63361a89205a97c27727cb0`

Primary owner: Core evidence-boundary and semantic-review owner

Dependent adopted slice: Slice 4 typed relations

Proposed future run-format capability: `1.5.0-provisional`

Proposed future deterministic check:
`K2.17 — internal ambiguity/referent lifecycle structure`

This document is a bounded architecture proposal. It is not an adoption
record, implementation authority, implementation, replay result, semantic
validation, agent sanction, acceptance record, production-readiness claim,
golden declaration, or Aleph v1 declaration.

No human adoption declaration appears in this file.

## 1. Proposed decision scope

This document presents a narrow Core design for retaining unresolved
source-internal referents and carrying their effect through explicitly
reviewed typed-relation declarations.

The proposed design:

1. introduces one Core ambiguity artifact at
   `ledgers/internal-ambiguities.md`;
2. gives each ambiguity a durable `AMB-NNNN` identity;
3. reopens the exact frozen source bytes containing the unresolved expression;
4. accounts for the legal same-source search boundary without claiming that a
   mechanically complete walk proves semantic adequacy;
5. represents candidate antecedents only as same-source `PKT` or exact
   `source-locus` references, or as a typed null;
6. keeps ambiguity separate from `REL-*`, evidence roles, dispositions,
   external referents, projection, general uncertainty, contradiction,
   duplicate analysis, and correction machinery;
7. records affected `REL-*` identities as explicit reviewed declarations;
8. forbids automatic graph traversal, automatic retargeting, and transitive
   ambiguity propagation;
9. reuses exact-subject verifier binding for semantic review;
10. finalizes canonical ambiguity state only at the S4 closure barrier, before
    S5 begins; and
11. leaves one authority question visibly unresolved because current adopted
    architecture does not establish a general ambiguity
    closure/preservation gate.

No implementation may begin from this proposal unless:

- an exact immutable version of the design is adopted by human authority;
- the authority question in section 12 is separately resolved by adopted
  architecture or doctrine; and
- a later task explicitly authorizes implementation.

## 2. Exact authority and design basis

The following bytes were read from the exact canonical base. Git blob and
SHA-256 identities make the basis auditable without substituting later
summaries.

| Authority or basis | Git blob | SHA-256 | Use in this proposal |
|---|---|---|---|
| `AGENTS.md` | `a6c08d8b9b65e2f162a79a97d72f7b917c8b809c` | `d3d53618d45d524bebcc61b8051dd7fc34b8e4c40f77760c2dfcdafe69c233de` | repository status and execution boundaries |
| `core.manifest.json` | `12221ffe44a0d89b6ca195adb2e54d120cfe66be` | `9a9e4096d3325ec761f88b100b2683da162b9f6edabf1e174f8d527c986efc8e` | exact Core/adapter/admin inventory and current run format |
| `ADOPTED-architecture-decision.md` | `e8eeec869c43dc2dcf37f8ee00df2272b15c6ccb` | `b13d88bfbfea344d72ded2e34d3daf1a2422622092191f9806bca034268fad33` | adoption record for the root audited architecture |
| `PROPOSED-architecture-decision.md` | `95156a8f7292965cc2f9eef0efd8811f20ae02d8` | `fecdc0485d519bf821f6de1a75891bdba005e57b29c8514b1e2e8fd1138b3028` | exact adopted architecture basis |
| `ADOPTED-correction-and-effective-state-decision-20260815.md` | `d38e2324f0d8cf734e129d2bf45a55d658fb6400` | `c2a653e91c1e5ad6479ba6703a3bef0700616eff6a449bb2b241ef3ccfe43d6e` | adoption record for correction/effective-state limits |
| `PROPOSED-correction-and-effective-state-decision-20260815.md` | `c4132fa8c9140d73794ec5d1abba4115eb82b4b6` | `5286bd1152ac23f8e46e1df5c175d72a171d8757d43db21a3c3a2077c83137c5` | exact adopted correction/effective-state basis |
| `ADOPTED-slice-3-unified-lineage-design-20260822.md` | `2c196be8b0fe1d1b9284c8062263cb2b7c702eda` | `45803144c3c6e48d8df44109ff7657581062a4e68294639a40b3b11d264684a8` | adoption record for unified lineage |
| `PROPOSED-slice-3-unified-lineage-design-20260822.md` | `df65a39c39672178dd5e383a7da8aa29c2a4f8ed` | `c55a8ab14831796a5a82f1b315b88bef875b2cc19712f179842a98ee0bfcba8f` | exact adopted lineage design |
| `ADOPTED-slice-4-typed-relations-design-20260828.md` | `b26326c3367c918df21c3d1bce775d5fa92ff656` | `b60243a941cfc7ae6bf845c77b0f4034bf115557683bf70b60044f56b585725a` | adoption record for typed relations |
| `PROPOSED-slice-4-typed-relations-design-20260828.md` | `51af0df8e3f44201a086169c5ce1fe02050ff8a9` | `c7604873a724627806b911a39153796e551b1c1e627f4000866f07ade1a2e1b9` | exact adopted typed-relation design |
| `docs/architecture/14-slice-4-implementation-reconciliation.md` | `970c57d2e8e337f37802802c15a04855228bb8ec` | `2e59eaf36f9032ce30b0eaa7fcf6d3d021f096957c008ad4bf1e8f70895eb8a2` | exact post-implementation reconciliation and retained findings |
| `SRC-001-independent-calibration-delta-architecture-decision-20260813.md` | `832bf7d0b770751fdeef3d88ae6fc2ee64765508` | `03197345bb9721d245258481cdd8ce102ee10dafcc1a82889b931cbcab63b37a` | audited calibration architecture decision |
| `SRC-001-audited-core-change-architecture-design-20260813.md` | `9015eda61ce2d5f19975d5802bf8a8218c636c9b` | `8bd3afe0dc374c1809382f6355a35a592e00b3d72b78bdad45934b098dd8b81e` | audited Core-change design |
| `SRC-001-implementation-slice-plan-20260813.md` | `41d08c98a23269596547336fcb69bdb023fe36b0` | `5ea8532ee1f0994dddaaa49e5d8b0c1b3febc84c9885efc5edc55f3545c0ffae` | canonical Slice 5 scope and obligations |
| `SRC-001-effective-final-state-analytical-overlay-20260813.json` | `71602e87188b2c973fcad3c7c54568970d84bc5b` | `c50f1ede1863b3a32cb73e4320d1ecb1a25867f4ccb537ca19de4fb731e304f1` | analytical overlay for the audited calibration observations |

Current Core architecture, templates, prompt contracts, checker
specifications, and implementation evidence listed by the task were also read
at this exact base. Implementation shape is evidence about current
interfaces; it is not architecture authority.

Exact current contract surfaces inspected:

- `docs/architecture/02-system-architecture.md`
- `docs/architecture/03-artifact-contracts.md`
- `docs/architecture/04-pipeline-stages-and-dod.md`
- `docs/architecture/09-runbook-manual-mode.md`
- `docs/architecture/11-research-grounding.md`
- `docs/architecture/templates/03-extraction-claims.md`
- `docs/architecture/templates/04-evidence-boundaries.md`
- `docs/architecture/templates/07-verification.md`
- `docs/architecture/prompts/README.md`
- `docs/architecture/prompts/workers-intake-extraction.md`
- `docs/architecture/prompts/workers-judgment.md`
- `docs/architecture/prompts/verifier-lenses.md`
- `docs/architecture/prompts/orchestrator.md`
- `docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md`

Exact current implementation surfaces inspected only as architecture
evidence:

- `scripts/lib/run-model.ts`
- `scripts/lib/relations.ts`
- `scripts/lib/checks-k2-relations.ts`
- `scripts/lib/checks-k2.ts`
- relevant existing Markdown/model helpers.

At this base, exact inspection and the prospective Core-boundary validator
establish:

- Core digest:
  `sha256:0df6ee5f0d4b3ab3ed683173407f15fbfd26a4414b12702e3c69877398051800`;
- checker digest:
  `sha256:0ce18ccec1c57f06ba24858d3840da0a0919bfa63113128af7c6e65dc643c269`;
- current run format: `1.4.0-provisional`; and
- current last K2 number: `K2.16`.

PR #48's merged audit record additionally carries the exact nonblocking and
MUST PRESERVE findings listed in section 27. Those findings are not silently
closed here.

## 3. Canonical Slice 5 basis

This proposal preserves the canonical Slice 5 basis without broadening it.

Purpose:

> Keep unresolved source-internal referents visible and carry their effect
> along declared relations until human authority closes or explicitly
> preserves them.

Evidence basis:

- `C-019` and `C-186` remained unresolved by design;
- `C-049` and `C-111` were repaired through context/dependency;
- audited `DC-08`; and
- narrowed `SL-05`.

Required conceptual content:

- ambiguity identity;
- exact unresolved expression;
- bounded legal search scope;
- candidate or typed-null antecedent;
- affected typed-relation identities;
- carry state;
- semantic-review provenance;
- authority closure, when legally available; and
- closure provenance.

Required prompt boundary:

- inspect the full same frozen source when local context is insufficient;
- never infer from external facts, answer keys, calibration hindsight,
  projection intent, or a later source outside the legal scope; and
- retain `CANNOT_DETERMINE` when the frozen source does not resolve the
  referent.

Required deterministic boundary:

- check declared structure and references;
- never detect ambiguity from prose;
- never choose a candidate;
- never infer affected relations from graph reachability; and
- never convert `CANNOT_DETERMINE` into absence, PASS, or semantic closure.

## 4. Scope and hard exclusions

### 4.1 In scope

Slice 5 covers only this question:

> What does an expression in one frozen source refer to within that same
> frozen source?

It covers:

- pronouns, demonstratives, abbreviated labels, local aliases, elliptical
  references, and similar expressions whose internal antecedent is not
  immediately settled;
- exact same-source search accounting;
- same-source candidate proposals;
- typed-null outcomes;
- explicit reviewed declarations that named `REL-*` rows are affected;
- explicit carry of an unresolved effect; and
- structurally bound authority evidence if and only if a separately adopted
  authority mechanism legally supplies it.

### 4.2 Out of scope

Slice 5 does not own:

- S8 external-referent handling;
- post-freeze research;
- missing outside facts;
- web research;
- truth checking;
- projection;
- general uncertainty;
- contradiction semantics;
- duplicate or overlap analysis;
- evidence-role semantics;
- S5 disposition semantics;
- relation taxonomy changes;
- relation evidence weight;
- generic correction, replacement, versioning, rollback, or stale
  propagation;
- automatic endpoint retargeting;
- new source locator schemes;
- a new authority gate;
- a new human decision category;
- adapter-local ambiguity semantics; or
- Slice 6 or later work.

### 4.3 Fail-closed rule

If the legal frozen same-source boundary cannot determine the antecedent, the
result remains visibly:

`CANNOT_DETERMINE`

That result is not:

- a PASS;
- an empty record;
- proof that no antecedent exists;
- permission to consult an outside source;
- an S8 external-referent record;
- an S5 disposition;
- a human closure;
- a semantic resolution; or
- authority to continue as though the expression were unambiguous.

## 5. Separation from adjacent Core concepts

| Concept | Slice 5 relationship |
|---|---|
| `REL-*` typed relation | An ambiguity may name affected `REL-*` rows. It is never a relation family, subtype, field, or replacement row. |
| S6 evidence role | No ambiguity or relation becomes load-bearing, corroborative, contradictory, or contextual evidence through Slice 5. |
| S5 disposition | An ambiguity is visible input to judgment. It never selects or adds a disposition. |
| S8 external referent | Entered only after a separate semantic determination that the needed referent is outside the frozen corpus boundary. Internal failure alone does not create `REF-*`. |
| contradiction | A candidate conflict may help a reviewer reject a resolution, but ambiguity does not own contradiction semantics. |
| duplicate/overlap | Similar expressions or candidate multiplicity do not establish duplication. |
| lineage | Currentness of `PKT`, `CC`, and `REL` references is checked through adopted Slice 3/4 rules. Slice 5 adds no lineage type. |
| correction/effective state | Historical ambiguity assessments remain visible. Post-barrier correction remains fail closed under adopted doctrine. |
| projection | Projection intent and desired output wording are forbidden candidate evidence. |

## 6. Proposed canonical artifact

### 6.1 Path and marker

Future canonical path:

`runs/<run-id>/ledgers/internal-ambiguities.md`

Required format marker:

`internal_ambiguity_format: aleph-internal-ambiguity/v1`

The artifact is Core-owned. An adapter may transport worker returns and invoke
Core validation, but it may not define, transform, summarize, weaken, or
reinterpret ambiguity semantics.

### 6.2 Durable identity

Each ambiguity has one durable identity:

`AMB-NNNN`

Rules:

- four or more decimal digits, matching existing durable-ID style;
- unique within one run;
- never reused;
- assigned only by the canonical writer;
- not a `REL` identity;
- not a candidate identity;
- not an authority-decision identity; and
- not a generic correction/version identity.

One exact unresolved expression span has at most one `AMB-*` definition.
Multiple plausible antecedents belong to that unit's candidate set rather than
creating duplicate ambiguity units.

### 6.3 Closed artifact shape

The artifact contains exactly three canonical tables.

#### T5.1 Ambiguity definitions

```markdown
| ambiguity_id | source_entity_kind | source_entity_id | source_id | expression_locator | expression_start_byte | expression_end_byte | expression_sha256 | expression_bytes_base64 | basis_packet_ids | detected_by |
|--------------|--------------------|------------------|-----------|--------------------|-----------------------|---------------------|-------------------|-------------------------|------------------|-------------|
```

#### T5.2 Reviewed assessments

```markdown
| ambiguity_id | assessment_seq | predecessor_assessment_seq | search_scope_kind | search_source_id | search_completion_ref | search_basis_digest | candidate_state | candidate_refs | affected_relation_ids | resolution_state | carry_state | proposed_by | review_subject_digest | reviewed_by |
|--------------|----------------|----------------------------|-------------------|------------------|-----------------------|---------------------|-----------------|----------------|-----------------------|------------------|-------------|-------------|-----------------------|-------------|
```

#### T5.3 Authority actions

```markdown
| ambiguity_id | authority_seq | assessment_seq | action | selected_candidate_ref | authority_subject_digest | authority_ref | closure_provenance |
|--------------|---------------|----------------|--------|------------------------|--------------------------|---------------|--------------------|
```

The three tables form one durable `AMB-*` unit:

- T5.1 is the immutable source-bound definition;
- T5.2 is the retained sequence of reviewed semantic assessments; and
- T5.3 is an append-only authority record only when an adopted authority
  mechanism permits one.

This narrow retained sequence is required to keep earlier unresolved state
inspectable. It is not a generic artifact-versioning framework and does not
authorize post-barrier correction.

### 6.4 T5.1 field rules

`source_entity_kind`

- exactly `PKT` or `CC`;
- names the Core unit whose interpretation is affected;
- must be lineage-current at S4 closure; and
- does not replace the exact expression source basis.

`source_entity_id`

- exact current `PKT-*` or `CC-*` matching `source_entity_kind`;
- a `CC` source entity must cite at least one `basis_packet_id` containing the
  expression; and
- a `PKT` source entity must itself appear in `basis_packet_ids`.

`source_id`

- exact `SRC-*` containing the unresolved expression;
- must be frozen in the run manifest;
- must equal the source of every expression-basis packet and every candidate;
  and
- may not be a later source merely because it supplies an answer.

`expression_locator`

- uses the existing locator scheme declared by the source-manifest row;
- is deterministically reopenable by existing Core source-locus mechanics;
- does not define a new locator scheme; and
- may enclose more bytes than the exact expression, so it is not sufficient
  alone.

`expression_start_byte` and `expression_end_byte`

- reuse `zero-based-utf8-byte-half-open/v1`;
- are absolute offsets in the frozen `source_id` bytes;
- must not split a UTF-8 code point;
- must satisfy `0 <= start < end <= source_length_bytes`; and
- must fall within the reopened `expression_locator`.

`expression_sha256`

- SHA-256 of the exact bytes in the half-open expression interval; and
- must match the decoded `expression_bytes_base64`.

`expression_bytes_base64`

- canonical base64 of the exact unresolved expression bytes;
- is the exact expression representation, not a display quote;
- must decode to the declared interval bytes; and
- must not contain normalized or paraphrased text.

`basis_packet_ids`

- canonical comma-separated, numerically ordered, unique current `PKT-*`
  identities;
- every packet is from `source_id`;
- their exact fragments collectively cover the expression interval;
- no packet from another source is legal; and
- packet exact-evidence identity remains unchanged.

`detected_by`

- producer or reviewer invocation identity;
- provenance only, not semantic proof and not human authority.

### 6.5 T5.2 field rules

`assessment_seq`

- positive decimal integer;
- starts at `1`;
- contiguous per `AMB-*`; and
- higher sequence is the current reviewed assessment at the legal barrier.

`predecessor_assessment_seq`

- `none` for sequence `1`;
- exactly the immediately preceding integer otherwise;
- preserves history without generic cross-artifact correction.

`search_scope_kind`

- exactly `local-intervals` or `full-same-source`;
- local scope may support a reviewed local resolution;
- unresolved multiple/null outcomes require `full-same-source`; and
- no scope may cross `search_source_id`.

`search_source_id`

- exactly equals the T5.1 `source_id`.

`search_completion_ref`

- for `full-same-source`, exact
  `SRC-NNNN@CUR-NNNN@sha256:<64-lowercase-hex>`;
- binds the completed source-walk row, its final source-end cursor, and exact
  frozen source hash;
- for `local-intervals`, canonical compact JSON containing one or more unique
  existing `WLK-*` identities in source order;
- never restates or creates source-walk intervals; and
- proves which frozen bytes were legally accounted, not that a human-quality
  search was cognitively complete.

`search_basis_digest`

- SHA-256 over the fixed search-basis serialization in section 9;
- binds exact source bytes, legal scope, source-walk references, expression
  basis, candidate set, and task contract;
- changes whenever the legal search basis changes.

`candidate_state`

- exactly `single`, `multiple`, `null-no-candidate`, or
  `null-cannot-determine`.

`candidate_refs`

- canonical compact JSON array using the closed candidate grammar in section
  10;
- one element for `single`;
- two or more unique elements for `multiple`;
- `[]` for either typed-null state; and
- never contains arbitrary prose, `CC`, `REL`, `REF`, URLs, external facts, or
  confidence scores.

`affected_relation_ids`

- `none` or a canonical comma-separated, numerically ordered, unique set of
  lineage-current `REL-*` identities;
- explicit producer declarations reviewed as part of the exact subject;
- never graph-derived by the checker;
- may name many relations;
- may overlap the set named by another ambiguity; and
- does not mutate any relation row.

`resolution_state`

- exactly `unresolved` or `resolved-local`;
- `resolved-local` requires `candidate_state = single`;
- `unresolved` may use `candidate_state = single` only after
  `full-same-source` search when the reviewed basis does not support local
  resolution;
- `unresolved` is required for `multiple`, `null-no-candidate`, and
  `null-cannot-determine`; and
- authority-derived states are not written into T5.2.

`carry_state`

- exactly `none` or `explicit`;
- `explicit` requires `resolution_state = unresolved` and at least one
  affected relation;
- `resolved-local` requires `none`; and
- no graph traversal is implied.

`proposed_by`

- existing producer-reference grammar:
  `human:<actor-slug>` or `invocation:<producer-invocation-id>`;
- this proposal does not alter the deferred payload-character precision of
  A4-16;
- cannot equal human authority;
- cannot itself write canonical ledgers.

`review_subject_digest`

- exact digest defined in section 15.

`reviewed_by`

- exact `VER-NNNN`;
- resolves to one valid verifier record under existing Core harness identity
  rules;
- must target the exact review-subject digest; and
- requires an allowed structural verdict.

### 6.6 T5.3 field rules

T5.3 is deliberately defined but not activated by current adopted authority.
Until section 12's authority question is resolved, a future checker must
require this table to be empty.

If later activated by a separate adopted decision:

`authority_seq`

- positive contiguous integer per `AMB-*`;
- append-only; and
- may not overwrite an earlier authority response.

`assessment_seq`

- exact current reviewed assessment presented to authority.

`action`

- exactly `preserve-unresolved` or `close-with-supported-candidate`;
- no other action is implied or authorized.

`selected_candidate_ref`

- `none` for `preserve-unresolved`;
- exact byte-for-byte member of the bound assessment's `candidate_refs` for
  `close-with-supported-candidate`;
- never a new candidate, prose answer, outside fact, or later-source
  reference.

`authority_subject_digest`

- exact digest defined in section 16;
- changes whenever assessment, candidate, carry, affected-relation, or
  proposed-action basis changes.

`authority_ref`

- exact reference grammar must be supplied by the separately adopted
  authority decision;
- must resolve to one retained human-authority record; and
- model or worker identities are never legal authority references.

`closure_provenance`

- exact retained run-manifest/run-log/authority-record locus established by
  the separately adopted decision;
- never freeform rationale alone; and
- does not mutate the original expression, search, candidate, or review
  history.

## 7. Ambiguity-unit invariants

For each `AMB-*`:

1. one and only one T5.1 definition exists;
2. at least one reviewed T5.2 assessment exists at S4 closure;
3. the current assessment is the highest contiguous sequence;
4. every assessment binds the same immutable T5.1 expression;
5. no two assessments for one ambiguity have the same review-subject digest;
6. no assessment crosses the expression's `SRC-*`;
7. every candidate is same-source and deterministically reopenable;
8. each affected relation is explicit and current at S4 closure;
9. carry is explicit and finite;
10. no relation row stores ambiguity state;
11. no evidence-role row stores ambiguity state;
12. no authority action introduces a candidate or corpus fact;
13. at most one authority action exists for one authority-subject digest;
14. earlier assessments and authority actions remain inspectable; and
15. no post-S4 change is silently applied to canonical state.

Duplicate ambiguity definitions are rejected when they share the same
`source_id`, expression byte interval, and expression hash. Different
normalizations or candidate sets do not make the same exact expression a new
ambiguity.

## 8. Detection and source-entity ownership

### 8.1 Where detection may occur

An unresolved expression may first be detected:

- during S2 extraction while inspecting exact source bytes;
- during S3 normalization when a claim cannot be interpreted without a local
  antecedent;
- during S4 relation proposal when a relation depends on an unsettled local
  referent; or
- by a fresh semantic reviewer at any of those legal stages.

Detection is semantic work. No deterministic checker scans prose to discover
ambiguity.

### 8.2 Source entity

The ambiguity attaches to the current `PKT` or `CC` whose interpretation is
affected, while T5.1 separately reopens the source expression.

This split is required:

- `source_entity_id` tells later Core stages which unit's interpretation is
  qualified;
- the exact expression fields prove the frozen source basis; and
- affected relations show where that qualification is explicitly carried.

A source-locus is not itself the source entity because it has no durable unit
identity. It remains the exact source basis.

### 8.3 Currentness

At S4 closure:

- `source_entity_id`, `basis_packet_ids`, candidate `PKT` identities, and
  affected `REL` identities must be lineage-current;
- historical predecessors remain reopenable through lineage but are not
  canonical endpoints;
- no checker or orchestrator auto-retargets a predecessor to its successor;
  and
- if a current successor is semantically appropriate, a producer must propose
  it explicitly and a fresh reviewer must review the changed subject.

## 9. Bounded same-source search

### 9.1 Three distinct questions

The design keeps three propositions separate:

1. **Legal boundary:** which frozen bytes may be inspected?
2. **Traversal/accounting:** which of those bytes were structurally accounted?
3. **Semantic judgment:** which, if any, candidate is the antecedent?

Only the first two are mechanically checkable. The third belongs to semantic
review.

### 9.2 Legal boundary

The legal boundary is exactly one frozen `SRC-*`:

- the T5.1 `source_id`;
- the exact source hash in the run manifest/source-walk completion;
- no other source, even if frozen in the same corpus;
- no later source;
- no external research;
- no answer key;
- no closed calibration reference;
- no projection request; and
- no world knowledge.

The design is intentionally stricter than “same corpus.” The canonical Slice
5 obligation is full same-source search where needed.

For `full-same-source`, source-walk completion proves the exact frozen bytes
were structurally traversed and accounted under existing Core mechanics. An
`invocation:<id>` producer must additionally have a retained sealed-bundle
record showing the complete source, exact source hash, and byte range
`0..source_length_bytes`. A `human:<actor>` producer follows the sanctioned
manual procedure and records the same exact completion reference in the run
log. These records prove the legal bytes presented/accounted, not that the
producer cognitively noticed every possible antecedent. No new
`proposed_by` payload grammar is introduced.

### 9.3 Local interval search

`local-intervals` is permitted only when:

- the candidate is directly found in one or more named existing `WLK-*`
  intervals from the same source;
- the candidate is `single`;
- a fresh reviewer upholds that the local basis is adequate for the proposed
  local resolution; and
- no unresolved/null result is claimed.

If the reviewer challenges adequacy or more than one plausible candidate
remains, the producer must move to `full-same-source`.

### 9.4 Full same-source search

`full-same-source` means:

- the source-walk ledger contains a `complete` per-source completion row for
  the exact `SRC-*`;
- its source hash and byte length match the frozen source;
- its final cursor is a source-end cursor;
- existing primary intervals partition bytes `0..source_length` under
  adopted source-walk rules;
- existing extraction events, gap reviews, and completion rules are
  satisfied; and
- the ambiguity assessment binds that exact completion row and cursor.

Slice 5 does not create a second traversal ledger, second cursor system, or
second locator system.

### 9.5 Search-basis serialization

`search_basis_digest` is SHA-256 over UTF-8 canonical compact JSON with keys in
this exact order:

```json
{"format":"aleph-internal-ambiguity-search-basis/v1","source_id":"SRC-NNNN","source_hash":"sha256:...","source_length_bytes":0,"scope_kind":"local-intervals|full-same-source","scope_refs":["WLK-NNNN"],"completion_ref":"none|SRC-NNNN@CUR-NNNN@sha256:...","expression_start_byte":0,"expression_end_byte":0,"expression_sha256":"sha256:...","basis_packet_ids":["PKT-NNNN"],"candidate_state":"single|multiple|null-no-candidate|null-cannot-determine","candidate_refs":[]}
```

Rules:

- no whitespace;
- UTF-8;
- exact key order;
- arrays preserve canonical source/numeric order;
- `scope_refs` is nonempty for `local-intervals` and `[]` for
  `full-same-source`;
- `completion_ref` is `none` for `local-intervals`;
- candidate refs use section 10's exact grammar; and
- changing any input changes the digest.

This digest proves an exact declared basis. It does not prove the searcher
noticed every semantic possibility.

## 10. Candidate and typed-null model

### 10.1 Closed candidate endpoint kinds

Only two non-null candidate endpoint kinds are legal:

1. current same-source `PKT`; and
2. exact same-source `source-locus`.

`CC` is deliberately excluded as a candidate endpoint:

- a claim is normalized semantic content, not the source antecedent itself;
- a claim can combine multiple sources; and
- the underlying same-source packet or locus is the reopenable antecedent
  basis.

If a producer believes a `CC` expresses the antecedent, the producer must cite
the exact same-source `PKT` or locus from which that expression derives.

### 10.2 Candidate grammar

`PKT` candidate:

```json
{"kind":"PKT","id":"PKT-NNNN"}
```

`source-locus` candidate:

```json
{"kind":"source-locus","source_id":"SRC-NNNN","locator":"<canonical-locator>","span_hash":"sha256:<64-lowercase-hex>"}
```

Candidate arrays are compact JSON, contain no whitespace, use the exact key
order above, and are sorted by:

1. `kind` (`PKT` before `source-locus`);
2. numeric packet ID or source ID; and
3. locator bytes.

Every source-locus scheme is derived from the source-manifest row. The
candidate object does not carry a caller-supplied scheme field.

### 10.3 Candidate states

`single`

- exactly one candidate reference;
- can support `resolved-local` only after an exact-subject fresh review is
  upheld.

`multiple`

- two or more distinct plausible same-source candidates;
- remains `unresolved`;
- records ambiguity among candidates rather than pretending that no candidate
  exists.

`null-no-candidate`

- `candidate_refs = []`;
- full same-source search found no structurally plausible antecedent;
- remains `unresolved`; and
- does not prove an outside answer exists.

`null-cannot-determine`

- `candidate_refs = []`;
- the frozen same source cannot support a determinate antecedent under the
  reviewed basis;
- remains visibly `CANNOT_DETERMINE`; and
- cannot be converted to resolution by a checker.

### 10.4 Confidence

Candidate confidence scores, likelihoods, rankings, weights, and percentages
are forbidden.

They would create false precision and could be misused as an automatic
selection rule. The only allowed distinctions are the closed candidate states
and the fresh review result.

### 10.5 Role allocation

- Producer: proposes exact candidates or typed null.
- Fresh reviewer: challenges ambiguity existence, search boundary, candidate
  legality, candidate adequacy, contamination, and affected relations.
- Orchestrator: validates structure and exact binding, then writes canonical
  rows at the legal barrier.
- Checker: validates grammar, existence, same-source legality, currentness,
  and binding.
- Human: may perform only a separately adopted authority function described
  in section 12; a human is not a candidate producer through this schema.

## 11. Lifecycle and carry

### 11.1 Why resolution and carry are separate axes

“Carried” is not a semantic resolution state. An ambiguity can be unresolved
and either affect no relation or be explicitly carried to named relations.

The design therefore uses:

- `resolution_state`; and
- `carry_state`.

This avoids a false lifecycle in which graph propagation appears to resolve
or replace semantic uncertainty.

### 11.2 Implementable reviewed states

`unresolved`

- multiple candidates, typed null, or a rejected/insufficient resolution;
- may also retain one plausible candidate when full same-source review cannot
  support local resolution;
- may continue visibly into later stages if all structural and review
  obligations are met.

`resolved-local`

- exactly one same-source candidate;
- same-source search basis declared;
- exact-subject fresh review upheld;
- no human authority required;
- no outside fact used.

`carry_state = none`

- no unresolved effect is declared on a relation.

`carry_state = explicit`

- the unresolved effect is declared on one or more named `REL-*` rows;
- every named row is inside the exact review subject;
- no transitive closure follows.

### 11.3 Authority-derived lifecycle states

The following derived states are defined semantically but are not legal in a
future implementation until section 12's separate authority decision exists:

`preserved-unresolved`

- latest reviewed state is `unresolved`;
- authority action is `preserve-unresolved`;
- original ambiguity and carry remain visible; and
- authority does not add a fact or candidate.

`authority-closed`

- latest reviewed state is `unresolved`;
- authority action is `close-with-supported-candidate`;
- selected candidate is already present in the exact reviewed candidate set;
- original unresolved assessment remains visible; and
- closure supplies no new corpus content.

### 11.4 Closed transition rules

Before S4 closure, reviewed assessment history may contain:

- `unresolved -> unresolved` after a changed search/candidate/affected-relation
  basis and a new exact review;
- `unresolved -> resolved-local` after one same-source candidate is upheld;
- `resolved-local -> unresolved` if a later pre-barrier challenge invalidates
  the earlier local resolution and a new subject is reviewed; or
- `resolved-local -> resolved-local` after a changed pre-barrier basis and new
  review.

After S4 closure:

- no T5.1 or T5.2 mutation is authorized;
- no new T5.2 sequence is appended;
- authority action is unavailable absent the separate decision in section 12;
- if later authority action becomes authorized, it appends T5.3 and never
  rewrites T5.1/T5.2;
- an authority response bound to an earlier subject cannot be carried forward
  after any subject change; and
- reopening, correction, or post-acceptance behavior remains under existing
  fail-closed correction doctrine.

## 12. Human authority boundary

### 12.1 Current adopted authority is insufficient

The current adopted stage architecture provides human authority surfaces for
scope/sensitivity, external referents, acceptance, projection commission and
acceptance, and named operational surprises. It does not establish a general
human ambiguity closure or preservation gate between S4 and S5.

In particular:

- S4 has no relation-specific authority gate;
- Slice 4 expressly deferred any relation-specific closure;
- S8 governs external referents, not source-internal antecedents;
- S13 acceptance cannot silently rewrite closed S2-S4 semantic records; and
- the retained SRC-001 calibration closure is development evidence, not a
  general Core gate.

Therefore this proposal does not assign T5.3 to an existing stage and does
not invent a new stage or gate.

### 12.2 Blocking design question

`OQ-01 — AMBIGUITY AUTHORITY PRESENTATION`

Classification:

`BLOCKING NOW`

Backward authority:

`authority/doctrine`

Question requiring separate human/architecture decision before
implementation:

> Is a Core ambiguity closure/preservation request legally presented at an
> existing adopted human gate, and if so which exact gate and write barrier;
> or must a separately adopted gate be created?

Until that decision exists:

- T5.3 must remain empty;
- `preserved-unresolved` and `authority-closed` are semantically specified but
  not activatable;
- no worker or orchestrator may fabricate closure;
- no S8 authority response may be repurposed;
- no S13 acceptance record may be treated as ambiguity closure; and
- implementation of Slice 5 is blocked rather than silently omitting the
  authority part of the canonical slice basis.

### 12.3 Maximum permissible human action if later authorized

Any later adopted mechanism must remain within these maximum bounds:

- preserve the reviewed `CANNOT_DETERMINE`/unresolved state; or
- select one candidate already present in the exact reviewed same-source
  candidate set.

The human may not:

- introduce a new candidate;
- supply an external fact;
- consult post-freeze research on behalf of the run;
- cite another source outside the legal same-source boundary;
- rewrite the expression;
- mutate the frozen corpus;
- retarget a relation automatically;
- declare model judgment to be human authority; or
- erase prior unresolved state.

These are upper bounds, not a gate authorization.

## 13. Stage and barrier ownership

### 13.1 Detection and working records

- S2/S3/S4 workers may return noncanonical ambiguity proposals.
- Exact source bytes and source-walk state remain unchanged.
- The orchestrator retains worker returns and review records.
- No worker writes `ledgers/internal-ambiguities.md`.

### 13.2 Local same-source resolution

The stage that detects the ambiguity owns the first local search attempt under
its sealed legal bundle. If local context is insufficient:

- the orchestrator dispatches a dedicated same-source ambiguity producer;
- the bundle contains only the exact frozen source, source manifest/walk
  references, current packet/claim identities needed for the subject, and
  the Slice 5 task contract;
- the producer may inspect the full same source;
- unrelated corpus sources, final artifacts, answer keys, and projection
  context remain withheld; and
- a fresh reviewer receives the exact subject without producer rationale.

### 13.3 Relation availability

Affected `REL-*` identities are not stable until S4 relation proposal,
review, reconciliation, and canonical ID assignment.

Therefore:

- ambiguity detection/search may occur earlier;
- affected-relation proposals may be refined during S4;
- T5.2's canonical affected set is reviewed after exact `REL-*` IDs exist;
  and
- canonical ambiguity finalization occurs after relations are canonicalized
  but before S4 closes.

### 13.4 Legal canonical write barrier

For future `1.5.0-provisional` runs:

- before S4 closure, the canonical ambiguity artifact is absent or contains
  only the marker and empty canonical tables;
- nonempty canonical ambiguity rows before the S4 finalization sub-barrier are
  invalid;
- at S4 closure/S5 entry, the marker and all three tables are required, even
  when there are zero ambiguities;
- every detected load-bearing ambiguity must have a final reviewed assessment;
- every named relation must already exist and be current;
- T5.3 remains empty until OQ-01 is resolved; and
- after S4 closure, T5.1/T5.2 are read-only.

The retained-state checker can prove only the allowed static shape at a
declared stage. Manual procedure owns temporal enforcement unless later live
writer wiring is separately validated. F-03/F-05 remain preserved.

### 13.5 Late discovery

An ambiguity discovered after S4 closure:

- is recorded as a blocking run-log anomaly;
- does not mutate T5.1/T5.2;
- does not rewrite relations;
- does not auto-retarget endpoints;
- does not silently reopen S2/S3/S4;
- does not become an S8 external referent by default; and
- requires existing correction/resumption authority or a successor run.

If no such authority applies, the run remains blocked at the earliest unmet
Definition of Done.

## 14. Affected relations, carry, and non-propagation

### 14.1 What makes a relation “affected”

A `REL-*` row is affected when correct use or interpretation of that exact
declared relation depends materially on the unresolved expression or its
candidate selection.

Examples include:

- the relation target is the unresolved local antecedent;
- the relation's subtype assertion depends on which candidate is selected; or
- the source unit cannot be interpreted well enough to rely on the relation
  without carrying the ambiguity caveat.

Mere reachability, adjacency, shared endpoint, repetition, or graph
multiplicity does not make a relation affected.

### 14.2 Semantic owner

- Producer proposes affected relation IDs.
- Fresh reviewer challenges omitted, over-broad, and contaminated entries.
- Orchestrator writes only the reviewed exact set.
- Checker validates identities/currentness/binding only.

The checker does not infer affectedness from relation family, subtype, path,
cycle, source, target, or graph position.

### 14.3 Directionality

Each affected declaration points from one `AMB-*` to one existing `REL-*`.

The relation retains its adopted source-to-target direction. Slice 5 does not
create a second edge or reverse relation.

Carry means:

> this exact unresolved ambiguity qualifies use of this exact declared
> relation.

It does not mean:

> mark every node or edge reachable from this relation.

### 14.4 Cardinality

- One ambiguity may affect zero, one, or many relations.
- One relation may be affected by zero, one, or many ambiguities.
- Each `(AMB, assessment_seq, REL)` tuple is unique.
- Repetition does not increase evidence.
- Multiple ambiguities do not change a relation's family/type/state.

### 14.5 Relation-family sensitivity

Any adopted Slice 4 family/type may be named if a producer and reviewer judge
it affected. No family is mechanically included or excluded solely by type.

Special cautions:

- a `resolved-local` ambiguity has `carry_state = none`;
- a context relation does not become evidence;
- carry does not automatically cross a relation merely because its role is
  resolved or context-only; that exact relation may be named only if its own
  interpretation is materially affected, and nothing beyond it inherits the
  flag;
- a typed-null relation does not itself prove an ambiguity;
- an affected `semantic-prerequisite` relation does not create claim-to-claim
  evidence; and
- relation type never determines an S5 disposition.

### 14.6 No direct downstream-CC propagation

Slice 5 has no `affected_cc_ids` field.

If a downstream `CC` is materially affected, the reviewed design names the
specific existing relation through which that dependency is represented.
Where no such relation exists, Slice 5 does not fabricate one.

This keeps the carry interface on the adopted Slice 4 relation boundary and
prevents a second implicit dependency graph.

### 14.7 Transitivity

Transitive propagation is forbidden.

There is:

- no reachability closure;
- no path-derived candidate;
- no inherited flag;
- no “all descendants” rule;
- no checker-created affected set; and
- no automatic propagation through a relation whose role is
  resolved/context-only.

If a later relation is independently affected, it must be explicitly proposed
and reviewed in the same assessment subject.

### 14.8 Cycles

Permitted Slice 4 context cycles do not trigger traversal.

Because the affected set is a finite explicit list:

- a cycle does not add an edge;
- a cycle does not revisit an ambiguity;
- a cycle does not multiply records;
- a cycle does not increase evidence;
- a cycle does not cause fixed-point computation; and
- only relations explicitly present in the exact reviewed subject carry the
  flag.

### 14.9 Mechanical protection against indiscriminate inheritance

The future checker protects the boundary by:

- forbidding any derived/path/closure field;
- requiring unique explicit `REL-*` IDs;
- requiring every ID to exist and be current;
- binding the complete ordered set into the review subject;
- rejecting any changed set with a stale review digest;
- rejecting duplicate ambiguity definitions for one expression; and
- rejecting any nonempty carry state with `affected_relation_ids = none`.

This detects unauthorized structural expansion. It cannot prove that a
structurally reviewed relation is semantically related; that remains a review
challenge.

## 15. Ambiguity semantic-review binding

### 15.1 Reused pattern

Slice 5 reuses the established exact-subject verifier pattern without reusing
the Slice 4 relation subject unchanged.

Format:

`aleph-internal-ambiguity-review-subject/v1`

Verifier target:

`internal-ambiguity-review-subject:<sha256-digest>`

Allowed verifier verdicts:

- `upheld`;
- `refuted`; or
- `cannot-determine`.

Only `upheld` authorizes canonicalization of that exact assessment.

If a reviewer returns `cannot-determine`, the orchestrator may ask a producer
to create a revised explicit `unresolved` assessment with
`candidate_state = null-cannot-determine`. That revised subject still requires
a separate `upheld` review before canonicalization. A reviewer
`cannot-determine` verdict is not silently treated as an upheld proposal.

### 15.2 Exact subject

The review subject is UTF-8 canonical compact JSON with keys in this exact
order:

```json
{"format":"aleph-internal-ambiguity-review-subject/v1","source_entity_kind":"PKT|CC","source_entity_id":"PKT-NNNN|CC-NNNN","source_id":"SRC-NNNN","expression_locator":"...","expression_start_byte":0,"expression_end_byte":0,"expression_sha256":"sha256:...","expression_bytes_base64":"...","basis_packet_ids":["PKT-NNNN"],"search_scope_kind":"local-intervals|full-same-source","search_completion_ref":"...","search_basis_digest":"sha256:...","candidate_state":"single|multiple|null-no-candidate|null-cannot-determine","candidate_refs":[],"affected_relation_ids":["REL-NNNN"],"resolution_state":"unresolved|resolved-local","carry_state":"none|explicit","proposed_by":"..."}
```

Included:

- every immutable expression/source field;
- same-source search basis;
- complete candidate or null state;
- complete affected relation set;
- proposed resolution/carry state; and
- producer identity.

Excluded:

- `ambiguity_id`, because the canonical writer may assign it after review;
- `assessment_seq` and predecessor sequence;
- review digest;
- reviewer identity;
- reviewer verdict;
- authority action/reference;
- closure provenance;
- freeform producer rationale; and
- downstream disposition or projection state.

Arrays use canonical order. `none` affected relations serialize as `[]`.

### 15.3 Staleness

Any change to an included field changes the digest and makes the old review
structurally stale.

This includes:

- changed expression bytes or locus;
- changed source entity or packet basis;
- changed search scope/completion;
- changed candidate set/null state;
- changed affected relation set;
- changed resolution/carry state; or
- changed producer identity.

The checker can prove digest equality and exact target binding. It cannot
prove:

- that the expression is actually ambiguous;
- that the candidate is semantically correct;
- that the full-source search was cognitively adequate;
- that affected relations are semantically affected; or
- that the reviewer was genuinely independent merely because fields say so.

## 16. Authority-subject binding

If OQ-01 is later resolved, authority presentation uses:

`aleph-internal-ambiguity-authority-subject/v1`

Canonical compact JSON:

```json
{"format":"aleph-internal-ambiguity-authority-subject/v1","ambiguity_id":"AMB-NNNN","assessment_seq":1,"review_subject_digest":"sha256:...","reviewed_by":"VER-NNNN","resolution_state":"unresolved","carry_state":"none|explicit","candidate_state":"single|multiple|null-no-candidate|null-cannot-determine","candidate_refs":[],"affected_relation_ids":["REL-NNNN"],"proposed_action":"preserve-unresolved|close-with-supported-candidate","selected_candidate_ref":"none|<exact-candidate-object>"}
```

Rules:

- the subject is not available unless the latest assessment is `unresolved`;
- close action requires an exact member of `candidate_refs`;
- preserve action requires `selected_candidate_ref = none`;
- no outside text field exists;
- any basis change changes the digest;
- an earlier response cannot be automatically carried forward; and
- the separately adopted authority decision must define the exact
  `authority_ref`, gate, stage, and legal append barrier.

## 17. Correction and effective-state interaction

This proposal uses existing adopted principles and adds no generic correction
architecture.

### 17.1 Ambiguity discovered after a candidate claim exists

Before S4 closure:

- retain the candidate claim;
- create an ambiguity proposal bound to its exact current `CC`/packet basis;
- perform same-source search and review;
- revise relation proposals if semantically required;
- do not rewrite claim history; and
- finalize only at the S4 barrier.

After S4 closure:

- block;
- record the anomaly;
- do not mutate claim, relation, or ambiguity tables;
- apply only existing correction/resumption authority if one actually
  applies.

### 17.2 Changed candidate antecedent

Before S4 closure:

- append a new T5.2 assessment sequence;
- bind the changed candidate set;
- obtain a new exact review;
- retain the earlier assessment.

After S4 closure:

- no automatic change;
- no successor ambiguity is implicitly created;
- correction requires existing authority or successor-run handling.

### 17.3 Changed affected relation set

The complete set is review-subject content. Any pre-barrier change requires a
new assessment/review. Any post-barrier change blocks.

### 17.4 Changed same-source search basis

The search-basis and review-subject digests change. The earlier review is
stale for the changed basis. No checker infers semantic staleness beyond exact
digest mismatch.

### 17.5 Changed human-closure basis

Any changed assessment, candidate, affected set, carry state, or proposed
action changes the authority subject. An earlier human response cannot be
reused.

### 17.6 Later lineage successor

- no auto-retargeting;
- no successor substitution based solely on graph lineage;
- before S4 closure, a producer may explicitly propose the current successor
  and obtain a fresh review;
- after S4 closure, the mismatch blocks.

### 17.7 Terminalized target

If a candidate packet, source entity, or affected relation is terminal before
S4 finalization, it is not a legal current reference. The producer must either
propose an explicit current endpoint under fresh review or retain an
unresolved/null result.

### 17.8 Successor ambiguity records

No change automatically creates a new `AMB-*`.

- pre-barrier changes to the same exact expression use retained T5.2
  assessments;
- a distinct exact expression uses a distinct `AMB-*`;
- post-barrier correction is deferred to adopted correction/resumption
  doctrine; and
- no generic ambiguity supersession field is introduced.

Historical T5.1/T5.2/T5.3 rows remain historical and inspectable.

## 18. Future run format and checker number

### 18.1 Run format

Current canonical main ends at:

`1.4.0-provisional`

with cumulative capabilities:

`1.0 -> 1.1 -> 1.2 -> 1.3 -> 1.4`

Future Slice 5 implementation requires:

`1.5.0-provisional`

and one cumulative capability:

`internal-ambiguity-lifecycle`

Future behavior:

- 1.0-1.4 runs retain their existing bytes and semantics;
- they do not require or interpret the Slice 5 artifact;
- an active Slice 5 marker/table under an older run format is rejected rather
  than silently activated;
- 1.5 includes all prior capabilities plus ambiguity lifecycle; and
- later formats must continue capability-based activation rather than exact
  version equality.

This proposal does not change the current run format, registry, manifest,
checker, fixtures, runtime JS, or bundle.

### 18.2 Checker number

Current canonical main ends at `K2.16`.

The next valid number is reserved in this design as:

`K2.17 — internal ambiguity/referent lifecycle structure`

No checker source is changed by this proposal.

## 19. Future deterministic checker contract

K2.17 may prove only declared structure.

### 19.1 Artifact and activation

- correct path and marker;
- exactly one of each canonical table;
- exact column order;
- no unknown columns;
- required empty/nonempty shape by declared stage;
- absent/inactive behavior for 1.0-1.4;
- required artifact at 1.5 S4 closure/S5 entry;
- no nonempty canonical rows before the legal barrier.

### 19.2 Identity and expression basis

- unique `AMB-NNNN`;
- no duplicate exact expression subject;
- legal source entity kind and existing current ID;
- existing frozen `SRC-*`;
- legal existing source locator scheme;
- valid UTF-8 byte interval;
- exact source-byte reopening;
- matching expression SHA-256/base64;
- existing same-source current packet basis;
- packet exact fragments cover the expression.

### 19.3 Search accounting

- legal scope kind;
- same `SRC-*`;
- existing ordered `WLK-*` refs for local scope;
- existing complete source row/final cursor/hash for full scope;
- recomputed search-basis digest;
- full-same-source requirement for multiple/null states;
- no other-source reference.

### 19.4 Candidate structure

- closed candidate state;
- exact candidate JSON grammar;
- legal cardinality;
- existing same-source current `PKT`;
- deterministically reopenable same-source locus;
- no `CC`, prose, URL, `REL`, `REF`, or confidence field;
- valid typed null;
- no mixed null/non-null set.

### 19.5 Relations and carry

- affected `REL-*` exists and is current;
- unique canonical order;
- no automatic/derived/path fields;
- compatible resolution/carry state;
- explicit carry has at least one affected relation;
- resolved-local has no carry;
- one relation may appear under multiple ambiguities without changing evidence
  role.

### 19.6 Assessment history and review

- contiguous sequence;
- exact predecessor sequence;
- current assessment derived as highest sequence;
- allowed state transitions;
- exact review-subject recomputation;
- exact `VER-*` identity;
- exact target token;
- one allowed review record;
- only `upheld` canonicalizes the exact subject;
- changed subject with stale review fails.

### 19.7 Authority structure

Until OQ-01 is resolved:

- T5.3 must be empty.

If later activated:

- action vocabulary;
- exact bound assessment;
- selected candidate membership;
- exact authority-subject recomputation;
- authority-reference grammar/existence established by the adopted decision;
- closure provenance existence;
- no external/new candidate;
- append-only sequence;
- no earlier-response carry-forward after subject change.

### 19.8 Explicit non-checker responsibilities

K2.17 does not:

- detect an ambiguity from prose;
- decide whether an expression is ambiguous;
- select the correct antecedent;
- judge semantic completeness of a source search;
- decide which relations are actually affected;
- infer propagation from paths or cycles;
- decide whether authority should close or preserve;
- supply an external referent;
- turn `CANNOT_DETERMINE` into resolution;
- judge reviewer independence from field presence;
- validate truth;
- grant acceptance or sanction.

A K2.17 PASS is structural only.

## 20. Prompt and worker roles

### 20.1 Producer contract

The ambiguity producer:

- receives one sealed same-source legal context;
- identifies the exact expression bytes;
- names the affected current `PKT`/`CC`;
- binds exact source/packet basis;
- records local or full-same-source search accounting;
- proposes a closed candidate state;
- proposes explicit affected `REL-*` IDs;
- proposes resolution/carry state;
- returns no canonical `AMB-*` unless the orchestrator preallocates one solely
  for return binding;
- never writes canonical ledgers;
- never sees answer keys, final SRC-001 outcomes, projection requirements, or
  outside research; and
- returns `CANNOT_DETERMINE` when the frozen source cannot support resolution.

### 20.2 Fresh reviewer contract

The fresh reviewer:

- receives the exact proposed subject and legal same-source bytes;
- does not receive producer rationale or hidden chain-of-thought;
- challenges whether an ambiguity actually exists;
- challenges expression/locus accuracy;
- challenges local versus full-source search scope;
- challenges candidate correctness and completeness;
- challenges same-source legality/currentness;
- challenges omitted or over-broad affected relations;
- challenges answer-key, external-world, later-source, and projection
  contamination;
- challenges implicit propagation and cycle expansion;
- returns `upheld`, `refuted`, or `cannot-determine`;
- never writes canonical ledgers; and
- never supplies human authority.

### 20.3 Orchestrator contract

The orchestrator:

- remains the only canonical writer;
- validates worker-return shape;
- validates exact source/search/candidate/currentness references;
- computes or verifies exact review-subject serialization;
- resolves one exact `VER-*`;
- rejects stale or non-upheld subjects;
- assigns `AMB-*` and assessment sequence;
- writes T5.1/T5.2 only at the S4 finalization barrier;
- leaves T5.3 empty absent OQ-01 authority;
- blocks on late discovery or contamination that cannot be cleanly
  redispatched; and
- does not impersonate human authority.

### 20.4 Human contract

The human role is exactly section 12. No worker field, prompt text, model
verdict, or orchestrator choice may fabricate a human closure.

## 21. Contamination and external knowledge

### 21.1 Invalid bases

A candidate is contaminated if justified by:

- external research;
- world knowledge not present in the same frozen source;
- another source, even one in the frozen corpus;
- a later source;
- an answer key;
- calibration hindsight;
- a closed-reference expected ID;
- projection needs;
- downstream desired prose; or
- a human statement that introduces new corpus content.

### 21.2 Failure behavior

Contaminated candidate material:

- is not canonicalized;
- cannot be converted into an accepted candidate;
- invalidates that producer/reviewer result for the subject;
- is recorded as a run-log defect;
- triggers fresh sealed-context redispatch when a clean in-scope retry is
  otherwise authorized; and
- if no clean same-source basis supports resolution, produces an explicit
  unresolved/`CANNOT_DETERMINE` proposal for separate review.

If contamination is systemic or clean review cannot be obtained, the run
blocks under existing blind-context/process boundaries.

This proposal does not invent a new contamination authority gate. Existing
blind-context and single-writer mechanics own containment; human authority
does not launder contaminated facts into the corpus.

## 22. Interaction with S5 dispositions

### 22.1 Read-only input

At S5, the canonical ambiguity artifact is read-only input alongside current
claims and relations.

It may:

- make an unresolved interpretive limitation visible;
- require the S5 judge to avoid treating a proposition as semantically
  settled;
- provide exact source/candidate/review provenance; and
- remain visible in later synthesis/verification.

### 22.2 No mechanical disposition

Ambiguity never mechanically:

- selects `carried`;
- selects `merged`;
- selects `deferred`;
- selects `excluded-with-reason`;
- selects `backgrounded`;
- selects `judged-non-load-bearing`;
- selects `unresolved`;
- adds `needs-context`;
- adds `cannot-determine`; or
- expands the disposition vocabulary.

If the proposition cannot be interpreted because an ambiguity remains, the
S5 semantic judge may conclude that an existing disposition such as
`unresolved` is appropriate. That conclusion requires its own S5 judgment and
review; it is not a K2.17 mapping.

If no existing S5 disposition can honestly represent the reviewed result, S5
blocks rather than inventing a new value or forcing a misleading disposition.

### 22.3 S5 entry condition

S5 may begin with unresolved ambiguity only when:

- the exact ambiguity is canonical and reviewed;
- search accounting is complete for its declared state;
- affected relations are explicit and reviewed;
- carry state is structurally valid;
- no illegal outside candidate is present;
- no required late correction is hidden; and
- the unresolved state remains visible.

An unrecorded, unreviewed, or structurally invalid load-bearing ambiguity
blocks S5 entry. A valid unresolved ambiguity does not automatically block the
whole run.

## 23. S8 external-referent boundary

### 23.1 Distinction

Internal ambiguity asks:

> What does this frozen source itself refer to?

External referent asks:

> Does the frozen corpus require a fact, entity, or reference outside what
> the frozen corpus resolves?

These are separate records, owners, gates, and authority surfaces.

### 23.2 Handoff condition

An internal ambiguity may inform a later S8 external-referent proposal only
when a semantic reviewer separately establishes that:

1. the exact same-source boundary was searched and reviewed;
2. the internal expression cannot be resolved there;
3. the relevant frozen-corpus context makes clear that the needed referent is
   outside the frozen corpus, rather than merely ambiguous or missing; and
4. the S8 producer creates a separate `REF-*` under existing S8 contracts.

K2.17 does not create the `REF-*` or infer this condition.

### 23.3 No automatic conversion

The following do not automatically create an external referent:

- `null-no-candidate`;
- `null-cannot-determine`;
- multiple candidates;
- reviewer disagreement;
- an affected relation;
- an unresolved S5 disposition; or
- a human preservation action.

Post-freeze research remains outside the current run. If research material is
later supplied, it belongs to a successor run under existing doctrine.

## 24. Future focused fixture design

Future path:

`docs/fixtures/internal-ambiguity-lifecycle/`

The fixture is synthetic, compact, and designed around proposition coverage,
not final SRC-001 density.

### 24.1 Fixture branches

| Branch | Required proposition |
|---|---|
| F5-01 local antecedent | One exact expression has one same-source `PKT`/locus candidate and an upheld `resolved-local` assessment. |
| F5-02 null antecedent | One expression has `null-no-candidate` after full same-source accounting. |
| F5-03 multiple candidates | One expression retains two plausible same-source candidates and remains unresolved. |
| F5-04 CANNOT_DETERMINE | One expression has `null-cannot-determine`; the result stays visible through S5 input. |
| F5-05 carried ambiguity | One unresolved ambiguity has `carry_state = explicit` and names two exact affected relations. |
| F5-06 unrelated descendant | One reachable relation/descendant is deliberately absent from the affected set. |
| F5-07 permitted cycle | Two valid Slice 4 context relations form a permitted cycle; only the explicitly reviewed member is affected and no traversal occurs. |
| F5-08 lineage currentness | A historical packet predecessor is rejected as a candidate; its explicitly reviewed current successor is legal. |
| F5-09 many-to-many | One ambiguity affects multiple relations and one relation is named by two ambiguities without changing relation/evidence semantics. |
| F5-10 S5 separation | Existing disposition vocabulary remains unchanged and no automatic outcome is selected. |
| F5-11 S8 separation | An unresolved internal ambiguity does not create a `REF-*`; a distinct branch demonstrates the separately reviewed handoff condition. |
| F5-12 relation/evidence separation | Relation and ambiguity rows add no support/evidence-role fields and do not change evidence-role accounting. |

### 24.2 Authority fixture branch

Current adopted authority does not support T5.3 activation. Therefore the
initial focused fixture must:

- contain the exact empty authority-actions table;
- reject fabricated closure/preservation rows; and
- record OQ-01 as the reason human closure/preservation examples are not yet
  canonical fixture positives.

If OQ-01 is later resolved, the same fixture may be extended only through the
separately adopted authority design to add:

- one `preserve-unresolved` positive;
- one `close-with-supported-candidate` positive;
- changed-basis stale-authority negative; and
- external-fact human-closure negative.

This deferral is explicit rather than a hidden invented gate.

### 24.3 Prompt hygiene

- no expected `AMB-*`, candidate, or affected relation answer appears in a
  producer bundle;
- no final density target;
- no SRC-001 answer key;
- reviewer bundles contain only the legal subject and source context; and
- fixture README distinguishes structural PASS from semantic validity.

N-09/A-03's positive nonzero evidence-role coexistence fixture remains LATER.
F5-12 proves non-conflation without claiming to close that separate finding.

## 25. Future deterministic mutation battery

The future battery must include at least the following structural mutations.
Every mutation starts from a clean focused fixture copy and proves only the
named fail-closed property.

### 25.1 Artifact, identity, and expression

1. remove `ambiguity_id`;
2. duplicate an `AMB-*`;
3. duplicate the same exact expression under another `AMB-*`;
4. remove expression byte basis;
5. use a non-reopenable locator;
6. alter expression bytes without changing hash;
7. alter hash without changing bytes;
8. split a UTF-8 code point;
9. use an expression interval outside the source;
10. use a nonexistent source entity;
11. use a historical source entity predecessor;
12. use a packet basis that does not cover the expression.

Additional dropped-ambiguity structural mutation:

- remove a T5.1 definition while retaining its T5.2 assessment or another
  exact reference to its `AMB-*`; K2.17 must fail the orphan.

Removing an otherwise self-contained ambiguity unit together with every
reference is not mechanically distinguishable from a missed ambiguity in
prose. That case belongs to semantic challenge SC5-02 and must not be
misrepresented as K2 detection.

### 25.2 Search boundary

13. candidate/search source differs from expression source;
14. local scope names a nonexistent `WLK-*`;
15. local scope crosses sources;
16. full scope names a stale/nonterminal cursor;
17. full scope binds the wrong source hash;
18. multiple/null candidate state uses only local scope;
19. alter search basis with stale digest;
20. omit required full-source completion.

### 25.3 Candidate/null

21. use a candidate outside the same source;
22. use a nonexistent candidate packet;
23. use a historical candidate predecessor;
24. use a `CC` candidate;
25. use a prose-only candidate;
26. use a URL/external candidate;
27. use malformed candidate JSON;
28. use malformed typed null;
29. mix null and non-null candidates;
30. declare `single` with two candidates;
31. declare `multiple` with one candidate;
32. add a confidence score;
33. claim `resolved-local` from multiple/null;
34. invent a local candidate without an exact upheld review.

### 25.4 Affected relations and propagation

35. omit a required affected-relation field;
36. name a nonexistent `REL-*`;
37. name a historical/noncurrent relation endpoint state where forbidden;
38. duplicate an affected relation;
39. use noncanonical affected-relation order;
40. set explicit carry with no affected relation;
41. set explicit carry on `resolved-local`;
42. remove an affected relation without recomputing the review subject;
43. add an unrelated relation without recomputing review subject;
44. simulate indiscriminate transitive expansion with stale review binding;
45. add path/derived-closure metadata forbidden by schema;
46. duplicate rows through a permitted cycle;
47. simulate cycle-caused propagation explosion;
48. mutate a canonical `REL-*` row to store ambiguity state;
49. add ambiguity as a relation family/subtype;
50. add ambiguity as an evidence-role field.

If mutation 42, 43, or 44 also supplies a fresh structurally valid upheld
review,
K2.17 cannot determine semantic unrelatedness; that variant belongs to the
semantic challenge set.

### 25.5 Assessment/review history

51. noncontiguous assessment sequence;
52. wrong predecessor sequence;
53. illegal state-field combination;
54. changed candidate with stale review;
55. changed affected set with stale review;
56. changed search basis with stale review;
57. wrong verifier target;
58. nonexistent verifier;
59. duplicate verifier identity;
60. `refuted` verdict used as authorization;
61. reviewer `cannot-determine` used as authorization;
62. authority/reference text used in place of semantic review.

### 25.6 Authority boundary

Before OQ-01 resolution:

63. any nonempty authority row;
64. closed state without adopted authority capability;
65. preserved state without adopted authority capability.

After a separately authorized implementation:

66. authority reference to wrong subject;
67. changed subject with stale authority response;
68. close action selects a candidate not in the reviewed set;
69. preserve action supplies a candidate;
70. `CANNOT_DETERMINE` converted to resolved without valid action;
71. human closure introduces an external fact/prose candidate;
72. model identity used as authority;
73. authority history overwritten or sequence skipped.

### 25.7 Stage and format

74. active artifact under run format 1.0-1.4;
75. canonical nonempty artifact before the S4 finalization barrier;
76. missing required artifact at S4 closure/S5 entry;
77. late append to T5.1/T5.2 after S4 closure;
78. ambiguity rows present without the 1.5 capability;
79. later run format loses a prior cumulative capability.

## 26. Fresh-context semantic challenge set

These are semantic-review obligations, not K2 checks.

| ID | Challenge | Expected review behavior |
|---|---|---|
| SC5-01 | False ambiguity | Refute a producer that marks a locally explicit antecedent ambiguous. |
| SC5-02 | Missed ambiguity | Identify a genuinely unresolved expression omitted by the producer. |
| SC5-03 | Wrong legal candidate | Refute a same-source, structurally valid but semantically wrong antecedent. |
| SC5-04 | Incomplete same-source search | Challenge a local or full-source account that misses a plausible passage despite structural completion. |
| SC5-05 | Wrong sentence/section | Refute a candidate selected from a nearby but semantically unrelated locus. |
| SC5-06 | Answer-key contamination | Detect selection justified by known SRC-001 outcome rather than source bytes. |
| SC5-07 | External-world inference | Reject a plausible world-knowledge answer absent from the source. |
| SC5-08 | Wrong-source inference | Reject a candidate from another frozen source. |
| SC5-09 | Affected relation omitted | Identify a relation materially dependent on the unresolved expression. |
| SC5-10 | Unrelated relation included | Refute explicit over-broad carry despite structurally valid binding. |
| SC5-11 | Cycle propagation | Refute “all reachable relations” reasoning through a permitted context cycle. |
| SC5-12 | False local resolution | Preserve unresolved state when one candidate is merely convenient, not supported. |
| SC5-13 | False no-candidate | Challenge typed null when a same-source candidate exists. |
| SC5-14 | Human/model conflation | Reject a model conclusion presented as human closure. |
| SC5-15 | S8 conflation | Reject automatic creation of an external referent from internal failure. |
| SC5-16 | S5 conflation | Reject automatic selection of an S5 disposition. |

Prompt test harnesses may confirm that required fields and withheld-context
statements exist. They cannot prove genuine fresh-context independence or
semantic correctness.

## 27. Carried-forward findings and backward authority

No finding below is opportunistically repaired by this proposal.

### 27.1 BLOCKING NOW

| Finding | Classification | Backward authority | Slice 5 disposition |
|---|---|---|---|
| OQ-01 ambiguity authority presentation | BLOCKING NOW | authority/doctrine | Current adopted architecture does not locate a legal closure/preservation gate. Implementation must not begin until a separate adopted decision resolves it. |

### 27.2 MUST PRESERVE

| Finding | Classification | Backward authority | Slice 5 disposition |
|---|---|---|---|
| F-03 live LedgerWriter/orchestrator wiring remains unvalidated end to end | MUST PRESERVE | local implementation | Static design and future helper tests must not be described as live enforcement. |
| F-04 path/case portability remains unresolved | MUST PRESERVE | local implementation | No portability closure claim. New path follows existing lowercase conventions only. |
| F-05 post-S4 lineage BLOCK remains tied to F-03 | MUST PRESERVE | contract/interface | Late ambiguity discovery blocks; no live-writer enforcement claim is made. |
| manual mode remains the sole sanctioned execution path | MUST PRESERVE | authority/doctrine | No agent-mode sanction or live replay is claimed. |
| relations remain non-evidentiary | MUST PRESERVE | architecture | Ambiguity names relations but never creates support/evidence weight. |

### 27.3 LATER

| Finding | Classification | Backward authority | Slice 5 disposition |
|---|---|---|---|
| A4-07 claim-to-claim evidential relation ownership | LATER | architecture | Not annexed; candidate endpoints exclude `CC` and ambiguity remains non-evidentiary. |
| A4-14 source-locus self-reference mutation/check precision | LATER | proof/checking | Slice 5 defines its own exact source-locus candidate checks without claiming to repair Slice 4's deferred precision item. |
| A4-16 `proposed_by` payload charset | LATER | contract/interface | Existing producer identity form is referenced; no charset redesign. |
| A4-17 editorial conflict/cycle precision | LATER | architecture | Slice 5 specifies no-traversal cycle behavior but does not rewrite Slice 4 wording. |
| N-09 / A-03 positive nonzero evidence-role coexistence fixture | LATER | proof/checking | The Slice 5 fixture proves separation but does not claim this separate positive coexistence fixture. |
| A-01 VER heading comparison over-rejects trailing horizontal whitespace | LATER | local implementation | No verifier parser repair. Fail-closed behavior remains. |
| A-02 Slice 4 VER lens/consequence exemplars differ from T7.1 forms | LATER | contract/interface | No Slice 4 fixture/exemplar repair. Slice 5 defines its own future target contract. |

### 27.4 Confirmed correct

| Finding | Classification | Backward authority | Slice 5 disposition |
|---|---|---|---|
| A4-15 exact one-subject `VER` target behavior | CONFIRMED CORRECT | proof/checking | Reused as the binding pattern; not expanded or reopened. |

## 28. Future implementation Definition of Done

A future authorized Slice 5 implementation is structurally complete only when
all 28 items below hold. Every item is OPEN in this proposal.

1. The exact immutable proposal bytes, or an exact amended successor, are
   adopted by human authority.
2. OQ-01 is resolved by a separate adopted authority/architecture decision
   naming the legal gate, stage, decisions, authority-reference grammar, and
   append barrier.
3. `1.5.0-provisional` and cumulative `internal-ambiguity-lifecycle`
   capability activation are consistent across Core contracts, model,
   checker, runtime projection, and manifests.
4. Legacy 1.0-1.4 bytes and semantics remain unchanged and older formats do
   not activate Slice 5.
5. `ledgers/internal-ambiguities.md` and
   `aleph-internal-ambiguity/v1` are documented exactly.
6. T5.1/T5.2/T5.3 schemas, column order, markers, and closed vocabularies are
   implemented without extra speculative fields.
7. `AMB-NNNN` uniqueness and duplicate-expression prevention are enforced.
8. Every expression reopens exact frozen bytes through source identity,
   existing locator scheme, byte interval, hash, base64, and packet basis.
9. Bounded search reuses source-walk identities and proves legal byte
   accounting without claiming semantic adequacy.
10. Candidate grammar permits only same-source current `PKT` and exact
    source-locus endpoints.
11. Multiple candidates and both typed-null states remain distinct and
    `CANNOT_DETERMINE` remains visible.
12. Candidate confidence/ranking and arbitrary prose antecedents are rejected.
13. Affected relation IDs are explicit, reviewed, current declarations and no
    relation row is mutated.
14. Unrelated descendants do not inherit ambiguity mechanically.
15. No transitive propagation, graph closure, path inference, or automatic
    endpoint retargeting exists.
16. Permitted relation cycles remain finite and do not multiply ambiguity
    state or evidence.
17. Exact ambiguity review-subject serialization, digest, verifier target,
    allowed verdicts, and stale-review behavior match this design.
18. Human authority, if activated under OQ-01's decision, can only preserve
    unresolved state or select an already reviewed same-source candidate and
    can never add corpus facts.
19. Changed authority basis invalidates automatic response carry-forward and
    prior state remains inspectable.
20. S2/S3/S4 detection, S4 finalization, S5 entry, late-discovery blocking,
    and read-only barriers are implemented and documented.
21. S5 receives ambiguity as visible input but no disposition vocabulary or
    mechanical selection changes.
22. S8 remains separate and no unresolved internal ambiguity automatically
    creates an external referent.
23. Correction/effective-state interaction remains narrow, append-only before
    the barrier, and fail closed after it without generic correction
    machinery.
24. K2.17 implements the complete deterministic/non-deterministic split and
    reports PASS as structural only.
25. The focused fixture covers every branch in section 24, with authority
    positives only after OQ-01 is resolved.
26. The deterministic mutation battery and fresh-context semantic challenge
    set are implemented and pass on the exact candidate.
27. TypeScript canonical source and locked `runtime-js` projection are in
    parity; Core boundary, checker digest accounting, bundle equality, and
    adapter boundary tests pass without adapter-local ambiguity semantics.
28. A fresh independent implementation audit reviews the exact commit/tree,
    reproduces the complete structural battery, and returns an explicit
    implementation verdict; that verdict still does not establish replay,
    semantic validation, sanction, acceptance, production readiness, golden
    status, or v1.

## 29. Self-audit

The proposal was attacked against the requested failure modes.

| Attack | Result | Classification or design control |
|---|---|---|
| invented human gate | SURVIVES AS EXPLICIT GAP | OQ-01 BLOCKING NOW; T5.3 empty until separate authority decision |
| hidden external-research path | CLOSED BY DESIGN | one same frozen source only; contamination fails |
| automatic pronoun/reference resolution | CLOSED BY DESIGN | semantic producer/reviewer only; no checker inference |
| answer-key leakage | CLOSED BY DESIGN | withheld context and contamination failure |
| indiscriminate graph propagation | CLOSED BY DESIGN | finite explicit reviewed `REL-*` list |
| transitive propagation as truth | CLOSED BY DESIGN | forbidden; no reachability closure |
| ambiguity as REL subtype | CLOSED BY DESIGN | separate artifact and ID family |
| ambiguity as evidence | CLOSED BY DESIGN | no support/evidence-role fields |
| checker deciding semantics | CLOSED BY DESIGN | explicit non-checker list |
| human inventing corpus facts | CLOSED BY DESIGN | maximum authority bound selects only reviewed candidate or preserves |
| conflation with S8 | CLOSED BY DESIGN | separate handoff and no automatic `REF-*` |
| conflation with S5 | CLOSED BY DESIGN | read-only input; no automatic disposition |
| implicit correction/versioning | CLOSED BY DESIGN | narrow pre-barrier assessment history only; post-barrier fail closed |
| endpoint auto-retargeting | CLOSED BY DESIGN | explicit current successor plus fresh review required |
| missing lineage-current rules | CLOSED BY DESIGN | currentness required at S4 closure |
| stale review after subject change | CLOSED BY DESIGN | exact digest changes |
| cycles causing ambiguity explosion | CLOSED BY DESIGN | no traversal or fixed point |
| historical bytes overwritten | CLOSED BY DESIGN | immutable T5.1 and retained assessment/authority history |
| hidden implementation authorization | CLOSED BY STATUS | design-only, all DoD open |
| run-format bump in design PR | CLOSED BY CHANGE BOUNDARY | future plan only; no code/manifest run-format value changed |
| adapter-local semantics | CLOSED BY DESIGN | Core-owned schema and prompts |
| status inflation | CLOSED BY STATUS | proposed only; all validation/sanction/acceptance claims denied |

Surviving finding:

- OQ-01 only, classified `BLOCKING NOW` with backward authority
  `authority/doctrine`.

Carried findings:

- MUST PRESERVE: F-03, F-04, F-05, manual-only sanction, relations
  non-evidentiary.
- LATER: A4-07, A4-14, A4-16, A4-17, N-09/A-03, A-01, A-02.
- A4-15 remains confirmed correct.

No unclassified self-audit finding remains.

## 30. Proposed future change surface

If later adopted and separately authorized for implementation, expected Core
surfaces may include:

- artifact contracts and templates;
- pipeline/runbook text;
- prompt-pack roles;
- run model and parser;
- K2.17 checker;
- deterministic mutation battery;
- focused fixture;
- generated runtime parity;
- Core manifest classification;
- bundle/runtime pin updates required by actual implementation; and
- adapter protocol capability declaration only if host-mechanical exposure is
  required.

This list is planning context, not permission to edit any surface.

This design task changes only:

- this proposal; and
- its repository-administration classification in `core.manifest.json`.

It does not modify current Core contracts, checker source, runtime JS, adapter
source, fixtures, run-format pins, payload manifests, or implementation
manifests.

## 31. Status boundary

If this proposal is published in a draft PR, its maximum status is:

- PROPOSED DESIGN
- HUMAN AUTHORITY ADOPTION REQUIRED
- AUTHORITY QUESTION OQ-01 BLOCKS IMPLEMENTATION
- NOT IMPLEMENTED
- NOT REPLAY-VALIDATED
- NOT SEMANTICALLY VALIDATED
- NOT AGENT-SANCTIONED
- NOT ACCEPTED
- NOT PRODUCTION-READY
- NOT GOLDEN
- NOT v1

The draft PR must remain open, draft, unmerged, and must not contain an
adoption declaration.

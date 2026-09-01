# PROPOSED Slice 5 Internal Ambiguity and Referent Lifecycle Design

Status: PROPOSED — SECOND NARROW REPAIR AFTER TWO BLOCKING INDEPENDENT
AUDITS; FRESH SUCCESSOR DESIGN AUDIT REQUIRED

Date: 2026-08-30

Second narrow repair date: 2026-08-31

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

Blocked predecessor proposal:
`f8aadc2160826e2df736a946188c92158ec354aa`

Predecessor independent design-audit verdict:
`BLOCK_SLICE_5_HUMAN_ADOPTION`

Second blocked successor proposal:
`53adf0c95672774f07b094f5e1a262542aedad3e`

Second fresh independent design-audit verdict:
`BLOCK_SLICE_5_HUMAN_ADOPTION`

Second blocking finding:
`S5-F11 — relation immutability between S4-C1 and ambiguity finalization was
undefined`

The second audit concluded `OQ-01-A`: this proposal may ultimately be adopted
while OQ-01 remains open, but Slice 5 implementation remains blocked until a
separate adopted authority decision resolves OQ-01.

This second narrow successor preserves both blocked proposals unchanged and
records their audit history in section 29. The repairs below are successor
design claims pending a fresh independent audit. They are not adoption,
implementation authority, or proof that either blocked finding never existed.

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
10. defines future S4 closure as one composite ordered barrier whose first
    subphase serializes and immediately read-closes the canonical relation
    set, whose second subphase consumes that exact set while finalizing
    ambiguity state, and whose third subphase carries those closures forward
    while exiting S4 before S5 begins; and
11. leaves one authority decision-category question visibly unresolved even
    though existing host mechanics can present a Core-defined human request.

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

This proposal preserves the non-authority portions of the canonical Slice 5
basis without broadening them. It makes one bounded narrowing: authority
closure remains inactive pending OQ-01 and current authority doctrine, so the
present design specifies only its maximum permissible bounds rather than an
operative authority lifecycle.

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
- authority closure only if and when OQ-01 is separately resolved by adopted
  authority doctrine; and
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
| lineage | Currentness of `PKT` and `CC` references is checked through adopted Slice 3 rules. Affected `REL` references use the Slice 5 `eligible canonical relation` consumption predicate in §8.3; no relation lineage, predecessor, successor, or current pointer is introduced. |
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
- must be lineage-current at S4-C2; and
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
  `REL-*` identities, each satisfying the `eligible canonical relation`
  predicate in section 8.3;
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
- `resolved-local` requires `none`;
- if `resolution_state = unresolved` and `affected_relation_ids` is nonempty,
  `carry_state` must be `explicit`;
- if `resolution_state = unresolved` and `carry_state = none`,
  `affected_relation_ids` must be `none`; and
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
Until section 12's authority question is resolved, future implementation
requirements are limited to the canonical column shape, table presence where
required, empty authority-action population, and inactive authority
capability. A future checker must require this table to be empty.

The field descriptions below are provisional upper bounds for disabled
authority-dependent cases. They are not an operative closed checker
vocabulary. A separately adopted OQ-01 decision owns any eventual action
vocabulary, authority-subject format, `authority_ref` grammar,
closure-provenance contract, and positive-action checks.

If later activated by that separate adopted decision:

`authority_seq`

- positive contiguous integer per `AMB-*`;
- append-only; and
- may not overwrite an earlier authority response.

`assessment_seq`

- exact current reviewed assessment presented to authority.

`action`

- the disabled examples use the provisional labels `preserve-unresolved` and
  `close-with-supported-candidate`;
- those labels are not active implementation or checker vocabulary while
  OQ-01 remains open; and
- no eventual action outside section 12.3's upper bounds is implied or
  authorized.

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
2. at least one reviewed T5.2 assessment exists by S4-C2;
3. the current assessment is the highest contiguous sequence;
4. every assessment binds the same immutable T5.1 expression;
5. no two assessments for one ambiguity have the same review-subject digest;
6. no assessment crosses the expression's `SRC-*`;
7. every candidate is same-source and deterministically reopenable;
8. each affected relation is explicit and is an eligible canonical relation
   from S4-C1;
9. carry is explicit and finite;
10. no relation row stores ambiguity state;
11. no evidence-role row stores ambiguity state;
12. no authority action introduces a candidate or corpus fact;
13. at most one authority action exists for one authority-subject digest;
14. earlier assessments and authority actions remain inspectable; and
15. no post-S4 change is silently applied to canonical state;
16. the S4-C1 canonical relation set is immutable through S4-C2 and S4-C3;
    and
17. any unauthorized post-C1 relation write invalidates and blocks the run,
    even when every `REL-*` identity remains textually unchanged.

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

### 8.3 Reference eligibility and endpoint currentness

At S4-C2, `source_entity_id`, `basis_packet_ids`, and candidate `PKT`
identities must be lineage-current under the adopted Slice 3 contract.
Historical `PKT`/`CC` predecessors remain reopenable through lineage but are
not legal current references. No checker or orchestrator auto-retargets one to
its successor; a semantically appropriate successor must be proposed
explicitly and freshly reviewed before S4-C2.

Slice 5 does not call a relation row lineage-current. It defines only this
narrow consumption predicate:

> **Eligible canonical relation:** a `REL-*` identity is eligible for a Slice
> 5 `affected_relation_ids` reference if and only if it names exactly one
> canonical row in `ledgers/relations.md` for the same current run; that row is
> part of the closed canonical relation set serialized in S4-C1; the row is
> structurally valid under the adopted Slice 4 contract and K2.16; its source
> and any concrete durable target satisfy Slice 4 endpoint-currentness rules
> while any source-locus target satisfies Slice 4 exact-reopening rules; and
> the row has any one of the four adopted `record_state` values:
> `asserted`, `unresolved-target`, `explicitly-absent`, or `indeterminate`.

This is a Slice 5 read predicate over the closed Slice 4 artifact. It does not
derive or imply:

- a historical/current status for a relation row;
- relation replacement, supersession, retraction, version, current pointer,
  or rewind;
- a relation predecessor or successor; or
- automatic relation retargeting.

The predicate is evaluated against the exact immutable canonical relation set
committed at S4-C1. If a referenced row becomes unusable because its
underlying closed-run basis is challenged or changed under some separately
authorized correction, Slice 5 does not invent a successor `REL-*` mechanism.
The run follows the separately authorized correction/resumption contract if
one applies and otherwise blocks without mutating or retargeting the relation
or ambiguity record.

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
  legality, candidate adequacy, contamination, and affected relations,
  including each affected relation's Slice 5 eligibility.
- Orchestrator: validates structure and exact binding, then writes canonical
  rows at the legal barrier.
- Checker: validates grammar, existence, same-source candidate currentness,
  eligible-relation consumption, and binding.
- Human: may perform only a separately adopted authority function described
  in section 12; a human is not a candidate producer through this schema.

## 11. Lifecycle and carry

### 11.1 Why resolution and carry are separate axes

“Carried” is not a semantic resolution state. An ambiguity can be unresolved
and either affect no relation or be explicitly carried to named relations. A
locally resolved ambiguity can also retain a reviewed nonempty affected set as
history of which relation interpretations depended on candidate selection,
without carrying an unresolved caveat downstream.

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

### 11.3 Complete resolution/carry/affected-set matrix

`affected_relation_ids = nonempty` means the assessment reviewed a material
semantic dependency between the ambiguity and those exact eligible canonical
relations. `carry_state` answers the narrower question of whether an
**unresolved** qualification must continue downstream.

| `resolution_state` | `carry_state` | `affected_relation_ids` | Legal? | Exact meaning |
|---|---|---|---|---|
| `resolved-local` | `none` | `none` | yes | The same-source candidate was upheld and no relation dependency was declared. |
| `resolved-local` | `none` | nonempty | yes | Candidate selection was materially relevant to the named relation interpretations, but the ambiguity is locally resolved and no unresolved qualification is carried. |
| `resolved-local` | `explicit` | `none` | no | Explicit carry cannot exist without an unresolved state or an affected relation. |
| `resolved-local` | `explicit` | nonempty | no | A locally resolved ambiguity cannot carry an unresolved qualification. |
| `unresolved` | `none` | `none` | yes | The ambiguity remains visible, but no relation effect is declared. |
| `unresolved` | `none` | nonempty | no | A nonempty affected set on an unresolved ambiguity must be carried explicitly. |
| `unresolved` | `explicit` | `none` | no | Explicit carry requires at least one exact affected relation. |
| `unresolved` | `explicit` | nonempty | yes | The unresolved qualification is carried only to the finite reviewed set. |

Therefore:

- if `resolution_state = unresolved` and `affected_relation_ids` is nonempty,
  `carry_state` must equal `explicit`; and
- if `resolution_state = unresolved` and `carry_state = none`,
  `affected_relation_ids` must equal `none`.

### 11.4 Authority-derived lifecycle states

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

### 11.5 Closed transition rules

Before S4-C2 canonicalization, reviewed assessment history may contain:

- `unresolved -> unresolved` after a changed search/candidate/affected-relation
  basis and a new exact review;
- `unresolved -> resolved-local` after one same-source candidate is upheld;
- `resolved-local -> unresolved` if a later pre-barrier challenge invalidates
  the earlier local resolution and a new subject is reviewed; or
- `resolved-local -> resolved-local` after a changed pre-barrier basis and new
  review.

At and after S4-C2:

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

### 12.1 Mechanics, ownership, and the missing decision category

The full authority basis is not silent:

- adopted Slice 4 carries to Slice 5 ambiguity/referent identification,
  propagation, carry, authority closure, and relation-null resolution;
- the canonical Slice 5 plan names
  `docs/architecture/04-pipeline-stages-and-dod.md` as an affected surface and
  says existing human-gate mechanics can present a Core-defined closure
  request; and
- the audited Core-change design assigns humans the eventual role of
  resolving or carrying source-internal referents where required.

Those statements establish Slice 5 ownership and available presentation
mechanics. They do not by themselves establish the missing semantic authority
category.

The design therefore distinguishes four propositions:

**A. Mechanics.** Existing host/human-gate mechanics may transport and present
a Core-defined request. A thin adapter need not invent ambiguity semantics to
display a request.

**B. Decision category.** Current adopted doctrine does not clearly establish
a human semantic decision category that may override or persist a result after
a completed adverse or unresolved ambiguity review. S4 has no
relation-specific authority gate; S8 governs external referents; and S13
acceptance cannot silently rewrite closed S2-S4 semantic state.

**C. Local semantic resolution.** A fresh reviewer may uphold
`resolved-local` from frozen same-source material without human authority.
That review supplies no new corpus fact and is canonicalized in T5.2 at
S4-C2.

**D. Human action.** A future `close-with-supported-candidate` action would be
special because it would override or persist a result after semantic review,
not because the human may introduce information. Even then, the candidate
must already be inside the exact reviewed same-source set.

Therefore this proposal keeps T5.3 inert. It does not assign T5.3 to an
existing stage, activate an existing gate, or invent a new gate or decision
category.

### 12.2 Blocking design question

`OQ-01 — AMBIGUITY AUTHORITY DECISION CATEGORY AND LEGAL ACTION`

Classification:

`BLOCKING NOW`

Backward authority:

`authority/doctrine`

Question requiring separate human/architecture decision before
implementation:

> Does adopted Core doctrine authorize a human semantic action after an
> unresolved or adverse ambiguity review to preserve unresolved state or
> close with one already reviewed same-source candidate? If so, what exact
> decision category, legal actions, stage/gate, authority-reference grammar,
> and append barrier govern it?

Which UI or host mechanism presents the request is secondary. Existing
human-gate mechanics are capable of presentation but do not answer this
decision-category question.

Until that decision exists:

- T5.3 must remain empty;
- `preserved-unresolved` and `authority-closed` are semantically specified but
  not activatable;
- no worker or orchestrator may fabricate closure;
- no S8 authority response may be repurposed;
- no S13 acceptance record may be treated as ambiguity closure; and
- implementation of Slice 5 is blocked rather than silently omitting the
  authority part of the canonical slice basis.

The latest fresh independent audit concluded `OQ-01-A`: the proposal may be
adopted while OQ-01 remains open, but OQ-01 blocks implementation rather than
adoption. That conclusion does not resolve or adopt OQ-01, activate T5.3,
authorize any positive authority case, or make this newly repaired successor
adoption-ready without its own fresh independent design audit.

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

Affected `REL-*` identities are not available until S4 relation proposal,
review, reconciliation, and canonical ID assignment are complete.

Therefore:

- ambiguity detection/search may occur earlier;
- affected-relation proposals may be refined during S4;
- T5.2's canonical affected set is reviewed only after exact `REL-*` IDs exist
  in S4-C1; and
- canonical ambiguity finalization occurs in S4-C2, after relation
  canonicalization and before S4-C3 exits to S5.

### 13.4 Composite ordered S4 closure barrier

For future `1.5.0-provisional` runs, **S4 closure is one composite ordered
barrier**. Its ordered subphases are:

**S4-C1 — RELATION CLOSURE STEP**

- all Slice 4 relation proposal, review, reconciliation, conflict handling,
  and relation DoD are complete;
- `ledgers/relations.md` exists with its required relation marker and table
  shape;
- the complete canonical `REL-*` set for the current S4 closure attempt is
  serialized;
- the retained relation artifact is structurally valid under K2.16;
- exact relation identities become available for ambiguity assessment;
- the resulting rows form the closed canonical relation set consumed by the
  eligible-canonical-relation predicate;
- the C1 closure-phase marker is retained only after those conditions hold;
  and
- this serialization occurs in the first ordered subphase **of the S4 closure
  barrier**, preserving Slice 4's adopted rule that canonical relation rows
  are serialized only at that barrier.

**S4-C1 IS A COMMIT POINT FOR THE CANONICAL RELATION SET.**

Upon successful completion of S4-C1:

1. all canonical `REL-*` rows for the current S4 closure attempt have been
   serialized;
2. the C1 closure-phase marker is retained;
3. `ledgers/relations.md` becomes immediately read-only for the remainder of
   the current run;
4. S4-C2 ambiguity producers and reviewers may consume those exact `REL-*`
   identities but may not mutate, replace, delete, retarget, supersede, or
   append relation rows; and
5. S4-C3 carries forward the relation immutability already established at C1
   rather than newly establishing it.

This commit point introduces no relation replacement, successor, version,
rewind, current pointer, or relation-correction architecture.

**S4-C2 — INTERNAL AMBIGUITY FINALIZATION STEP**

- every `affected_relation_ids` value binds only an eligible canonical
  relation serialized in S4-C1;
- producers and reviewers consume the exact immutable C1 relation set without
  writing it;
- ambiguity assessment and exact-subject semantic review are complete;
- canonical T5.1 and T5.2 rows are serialized;
- the marker and all three canonical tables exist even when there are zero
  ambiguities;
- every detected load-bearing ambiguity has a final upheld reviewed
  assessment; and
- T5.3 remains empty while OQ-01 is unresolved.

**S4-C3 — S4 EXIT**

- relation and ambiguity closure Definitions of Done are complete;
- `ledgers/relations.md` remains read-only under the C1 commit point;
- T5.1/T5.2 remain read-only under the C2 finalization barrier;
- the S4 exit event is retained; and
- only then may the stage transition to S5.

**C2-discovered relation defect.** C2 semantic review may reveal that a C1
relation is semantically wrong or would require a changed source, target,
type, or state, but C2 cannot itself repair C1. For example, if C2 consumes
`REL-100` and determines that `REL-100` is defective:

- do not mutate or replace `REL-100`;
- do not silently rerun C1;
- do not auto-retarget any ambiguity reference;
- do not canonicalize a stale T5.2 assessment;
- record the relation defect or closure failure through the existing legal
  append-only run-log/process mechanism;
- halt before S4-C2 canonicalization, or, if the defect is detected after
  attempted C2 work, halt before S4-C3;
- apply only an already-adopted correction/resumption mechanism if one
  actually applies; and
- otherwise remain blocked or use successor-run handling under existing
  doctrine.

No generic rewind is authorized by Slice 5, and no C3 transition may follow
the defective C1 basis.

Future Slice 5 implementation **extends** the existing append-only
`run-log.md` event shape with exactly one new `closure_phase` marker line in
each corresponding S4 event, using these exact values:

```text
closure_phase: S4-C1-relations-closed
closure_phase: S4-C2-ambiguities-finalized
closure_phase: S4-C3-exit
```

The C1 and C2 markers occur in ordered `S4 — decision` entries. The C3 marker
occurs in the `S4 — exit` entry. A retained `S5 — entry` is also post-C3
evidence. The markers are monotonic and may not be skipped, duplicated, or
reordered.

This lets future K2.16/K2.17 inspect static retained state:

| Highest retained phase | Permitted retained artifact state |
|---|---|
| no C1 marker | relation and ambiguity artifacts absent or marker plus empty canonical tables |
| C1 only | `ledgers/relations.md` exists with the complete canonical relation set and is K2.16-valid; ambiguity artifact remains absent or marker plus empty tables |
| C2 | the required C1 relation artifact remains present and K2.16-valid; final T5.1/T5.2 state exists; T5.3 is empty while OQ-01 is unresolved |
| C3 or S5 entry | the C2 retained state is complete; the required C1 relation artifact remains present and K2.16-valid |

K2.17 may validate marker order and consistency between the highest retained
phase and current bytes, including that C2/C3 has a valid C1 marker and
required K2.16-valid relation artifact. It does not prove that relation bytes
were never historically modified after C1, that a writer actually refused a
mutation, or that no transient altered bytes existed. The orchestrator/manual
procedure owns temporal ordering, byte-preserving refusal, and write-window
enforcement; process tests exercise those obligations. F-03/F-05 remain
preserved.

Establishing this composite barrier in a future implementation requires
coordinated amendments to these current Core documents:

- `docs/architecture/02-system-architecture.md` for the retained S4 phase
  representation within `DISTILLING`;
- `docs/architecture/03-artifact-contracts.md` for relation and ambiguity
  activation/read-only rules;
- `docs/architecture/04-pipeline-stages-and-dod.md` for S4-C1 through S4-C3
  ordering and DoD;
- `docs/architecture/templates/01-run-control.md` for the exact run-log phase
  markers;
- `docs/architecture/templates/03-extraction-claims.md` and
  `docs/architecture/templates/04-evidence-boundaries.md` for the relation and
  ambiguity artifact barriers;
- `docs/architecture/08-runbook-agent-mode.md` and
  `docs/architecture/09-runbook-manual-mode.md` for temporal procedure; and
- `docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md` for retained
  phase-state checking and its historical-timing non-claim.

### 13.5 Interruption and resume

If a run stops after a valid C1 marker and before C2 completion:

- resume uses the same pinned run, runtime, bundle, and retained bytes;
- `ledgers/relations.md` remains read-only and byte-identical;
- work continues from the first unmet C2 Definition of Done; and
- C1 is not silently rerun, rewritten, or replaced.

If retained state contains unauthorized partial canonical T5.1/T5.2 rows
before a valid C2 completion marker, neither implementation nor an operator
may normalize, silently clean, or rewrite them away. The retained-state
contract and process procedure fail closed, no C3 transition occurs, and only
an already-adopted correction/resumption mechanism or successor-run handling
may proceed.

This is a narrow composite-barrier resume rule, not a generic rollback or
checkpoint design.

### 13.6 Late discovery

An ambiguity discovered at or after S4-C2:

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
- Checker validates exact identity, eligible-canonical-relation consumption,
  and binding only.

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

- a `resolved-local` ambiguity has `carry_state = none`, but may retain a
  nonempty affected set as reviewed history of relation interpretations that
  depended on the selected candidate;
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

**LATER limitation — relation-coverage bound:** Slice 5 carry completeness is
bounded by the completeness of declared Slice 4 relations. If no relation
exists for a materially affected downstream claim, Slice 5 cannot carry
through an undeclared relation and must preserve the visible coverage gap.
Later Slice 7 semantic coverage/review work may expose such gaps. This does
not authorize relation-density targets, relation fabrication, A4-07, or Slice
7 implementation.

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
- requiring every ID to satisfy the eligible-canonical-relation predicate;
- binding the complete ordered set into the review subject;
- rejecting any changed set with a stale review digest;
- rejecting duplicate ambiguity definitions for one expression; and
- enforcing every legal and forbidden combination in the section 11.3
  matrix.

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

An ambiguity assessment that names `REL-*` IDs is valid only against the exact
immutable C1 canonical relation set. The review subject binds the ordered
relation identities; the C1 commit point supplies the load-bearing guarantee
that the named relation-row contents cannot later change. If any unauthorized
process changes the relation artifact after C1, the run is invalid and
blocked. The old ambiguity review does not remain authorized merely because
the `REL-*` IDs are textually unchanged.

This design does not add a C1 relation-set digest. Immediate C1 read-only
state, exact retained relation bytes, K2.16/K2.17 inspection of the current
artifact, and byte-preserving process-refusal evidence are sufficient for the
proposed boundary. They do not prove historical immutability from final bytes
alone. If future implementation cannot enforce and evidence that refusal, it
must stop and reopen the design rather than silently add a digest or relation
version lifecycle.

The checker can prove digest equality and exact target binding. It cannot
prove:

- that the expression is actually ambiguous;
- that the candidate is semantically correct;
- that the full-source search was cognitively adequate;
- that affected relations are semantically affected; or
- that the reviewer was genuinely independent merely because fields say so.

## 16. Provisional authority-subject upper bound

This section is a disabled design sketch, not an active implementation or
checker contract. The separately adopted OQ-01 decision owns any eventual
authority-subject format. If that decision adopts this bounded shape,
authority presentation may use:

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

Before S4-C2:

- retain the candidate claim;
- create an ambiguity proposal bound to its exact current `CC`/packet basis;
- perform same-source search and review;
- revise relation proposals if semantically required;
- do not rewrite claim history; and
- finalize only in S4-C2 of the composite S4 closure barrier.

At or after S4-C2:

- block;
- record the anomaly;
- do not mutate claim, relation, or ambiguity tables;
- apply only existing correction/resumption authority if one actually
  applies.

### 17.2 Changed candidate antecedent

Before S4-C2:

- append a new T5.2 assessment sequence;
- bind the changed candidate set;
- obtain a new exact review;
- retain the earlier assessment.

At or after S4-C2:

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
- before S4-C2, a producer may explicitly propose a current successor
  `PKT`/`CC` reference and obtain a fresh review;
- at or after S4-C2, the mismatch blocks.

This subsection does not apply a lineage relation to `REL-*` rows. If the
closed basis of an affected relation becomes unusable under a separately
authorized correction, section 8.3's fail-closed rule applies; Slice 5 does
not select or manufacture a successor relation.

### 17.7 Unusable reference basis

If a candidate packet or source entity is terminal before S4-C2, it is not a
legal current reference. The producer must either propose an explicit current
`PKT`/`CC` successor under fresh review or retain an unresolved/null result.

If an affected relation fails the eligible-canonical-relation predicate, it
cannot be referenced. Slice 5 does not infer relation history or retarget it;
the relation must be made structurally valid through separately authorized
Slice 4/correction procedure before S4-C1, or the ambiguity assessment must
omit it under fresh semantic review and preserve any resulting coverage gap.

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

Relative to the canonical base, this design PR changes
`core.manifest.json` only by adding this proposal path to
`files.repository_administration`. It does not change current run-format
manifest values, the Core payload inventory, checker inventory, bundle inputs,
checker source, fixtures, runtime JS, or adapters. This successor repair does
not change `core.manifest.json` again.

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
- exact S4-C1/S4-C2/S4-C3 marker vocabulary, order, and uniqueness;
- required empty/nonempty shape for the highest retained closure phase;
- absent/inactive behavior for 1.0-1.4;
- S4-C1 as the 1.5 activation point at which `ledgers/relations.md` must
  exist, contain its required marker/table shape and complete canonical
  relation set, and be K2.16-valid;
- a valid C1 marker and retained K2.16-valid relation artifact whenever C2,
  C3, or S5 entry is retained;
- required ambiguity artifact at 1.5 S4-C2, S4-C3, and S5 entry; and
- no nonempty canonical ambiguity rows in a retained pre-C2 phase.

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
- full-same-source requirement for
  `resolution_state = unresolved` with `candidate_state = single`; and
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

- every affected `REL-*` satisfies the eligible-canonical-relation predicate,
  including exact-one same-run resolution, S4-C1 membership, K2.16 structural
  validity, and Slice 4 endpoint rules;
- every adopted Slice 4 `record_state` is permitted by that predicate;
- unique canonical order;
- no automatic/derived/path fields;
- all eight section 11.3 matrix combinations are accepted or rejected exactly
  as specified;
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
- changed subject with stale review fails; and
- a higher assessment sequence with an identical `review_subject_digest` and
  no changed allowed basis fails.

### 19.7 Authority structure

Until OQ-01 is resolved:

- T5.3 must be empty.

The following are not active K2.17 responsibilities in this proposal. If
OQ-01 is resolved and a separate adopted design activates them, that design
may add deterministic retained-state checks for:

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
- judge cognitive or semantic adequacy of a source search;
- decide which relations are actually affected;
- infer propagation from paths or cycles;
- prove reviewer independence;
- prove the historical append time of a relation, ambiguity row, or phase
  marker;
- prove that relation bytes were never historically modified after C1;
- prove that a writer actually refused a post-C1 relation mutation;
- prove that no transient altered relation bytes existed;
- decide whether authority should close or preserve;
- decide the legal semantics of a human authority action;
- supply an external referent;
- turn `CANNOT_DETERMINE` into resolution;
- validate truth;
- grant acceptance or sanction.

A K2.17 PASS is structural only.

### 19.9 Responsibility classification

Every proposed responsibility is classified as follows:

| Classification | Exact responsibilities |
|---|---|
| `DETERMINISTIC RETAINED-STATE` | All active checks in §§19.1-19.6; exact T5.3 emptiness while OQ-01 is unresolved; exact closure-phase marker syntax/order and consistency with retained bytes; C2/C3 requires a valid C1 marker; the C1 relation artifact exists and is K2.16-valid; affected `REL-*` IDs resolve to eligible rows in that retained artifact; phase/artifact combinations are legal. |
| `PROCESS/TEMPORAL` | Enforce actual REL serialization only in S4-C1; establish immediate read-only relation state at the C1 commit point; refuse every C2/C3 relation append, delete, alteration, replacement, retarget, or supersession before bytes change; prove byte preservation across refused writes; prevent silent C1 rerun on resume; serialize T5.1/T5.2 only in S4-C2; refuse out-of-window ambiguity writes; append phase markers only after the corresponding procedure succeeds; preserve separate producer/reviewer passes. |
| `SEMANTIC REVIEW` | Detect missing prose ambiguity; judge ambiguity existence, candidate correctness, source-search cognitive adequacy, affected-relation semantic correctness or completeness, contamination, and whether a declared relation is materially affected; expose a semantic defect in a C1 relation without repairing it; challenge cycle/reachability reasoning; assess reviewer independence through process evidence rather than fields. |
| `AUTHORITY-DEPENDENT` | Any positive T5.3 action, decision-category legality, action semantics, gate/stage choice, authority-reference grammar, closure provenance, or human override/preservation behavior. These remain disabled until OQ-01 is separately adopted. |

K2.17 implements only the active `DETERMINISTIC RETAINED-STATE` row. The
other rows are explicit evidence partitions, not hidden deterministic claims.
In particular, K2.17 does not claim historical immutability from a currently
valid relation artifact.

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
- challenges same-source candidate legality/currentness;
- challenges whether every affected `REL-*` is an eligible canonical
  relation and whether the finite set is semantically accurate;
- reports any discovered semantic defect in a C1 relation as a blocking
  closure failure rather than proposing an in-C2 relation rewrite;
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
- validates exact source/search/candidate currentness and affected-relation
  eligibility;
- computes or verifies exact review-subject serialization;
- resolves one exact `VER-*`;
- rejects stale or non-upheld subjects;
- assigns `AMB-*` and assessment sequence;
- retains the C1 marker only after the complete relation set is serialized and
  K2.16-valid;
- establishes immediate read-only relation state at C1 and refuses every
  later relation write before bytes change;
- treats a C2-discovered relation defect as blocking and never repairs,
  replaces, retargets, or silently reruns C1;
- writes T5.1/T5.2 only in S4-C2 of the composite closure barrier;
- resumes an interrupted post-C1/pre-C2 run from the first unmet C2 DoD under
  the same pins and relation bytes;
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
- affected relations are explicit, reviewed, and eligible canonical
  relations;
- resolution, carry, and affected-set state matches the complete section 11.3
  matrix;
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

### 24.1 Positive fixture branches

| Branch | Required proposition |
|---|---|
| F5-01 local antecedent, empty dependency set | One exact expression has one same-source candidate and an upheld `resolved-local / none / none` assessment. |
| F5-02 resolved dependency history | One `resolved-local / none / nonempty` assessment names an eligible canonical asserted relation, recording reviewed dependency without unresolved carry. |
| F5-03 unresolved without relation effect | One expression has `null-no-candidate` after full same-source accounting and uses `unresolved / none / none`. |
| F5-04 CANNOT_DETERMINE | One expression has `null-cannot-determine`; the result stays visible through S5 input. |
| F5-05 multiple candidates | One expression retains two plausible same-source candidates and remains unresolved. |
| F5-06 explicit carry to asserted and typed-null relations | One `unresolved / explicit / nonempty` assessment names both an eligible asserted row and an eligible typed-null Slice 4 row, such as `record_state = unresolved-target`. |
| F5-07 unrelated relation not affected | One reachable or adjacent eligible relation is deliberately absent from the reviewed affected set. |
| F5-08 permitted cycle without propagation | Two valid Slice 4 context relations form a permitted cycle; only an explicitly reviewed member is named and no traversal or multiplication occurs. |
| F5-09 packet lineage currentness | A historical packet predecessor is rejected as a candidate; its explicitly reviewed current successor is legal. No relation predecessor is invented. |
| F5-10 many-to-many | One ambiguity affects multiple relations and one relation is named by two ambiguities without changing relation/evidence semantics. |
| F5-11 S5 separation | Existing disposition vocabulary remains unchanged and no automatic outcome is selected. |
| F5-12 S8 separation | An unresolved internal ambiguity does not create a `REF-*`; a distinct branch demonstrates the separately reviewed handoff condition. |
| F5-13 relation/evidence separation | Relation and ambiguity rows add no support/evidence-role fields and do not change evidence-role accounting. |

### 24.2 Complete matrix cases

The clean fixture and its targeted mutation copies cover every matrix row:

| Case | Expected result |
|---|---|
| `resolved-local / none / none` | positive |
| `resolved-local / none / nonempty` | positive |
| `resolved-local / explicit / none` | negative |
| `resolved-local / explicit / nonempty` | negative |
| `unresolved / none / none` | positive |
| `unresolved / none / nonempty` | negative |
| `unresolved / explicit / none` | negative |
| `unresolved / explicit / nonempty` | positive |

### 24.3 Relation-eligibility negative cases

At least one targeted negative must reference a `REL-*` row that exists once
but fails the eligible-canonical-relation predicate because the row is
structurally invalid under K2.16, for example an `unresolved-target` row that
illegally retains a concrete target. A second exact-one negative duplicates
the same `REL-*` identity in the canonical relation table.

Neither case invents a historical relation predecessor. A missing `REL-*`
case remains useful but is not sufficient by itself to prove the full
eligibility predicate.

### 24.4 Authority fixture branch

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

### 24.5 Prompt hygiene

- no expected `AMB-*`, candidate, or affected relation answer appears in a
  producer bundle;
- no final density target;
- no SRC-001 answer key;
- reviewer bundles contain only the legal subject and source context; and
- fixture README distinguishes structural PASS from semantic validity.

N-09/A-03's positive nonzero evidence-role coexistence fixture remains LATER.
F5-12 proves non-conflation without claiming to close that separate finding.

## 25. Future evidence partition

The successor design partitions future evidence into four disjoint classes:

- 74 deterministic retained-state K2.17 mutations;
- 8 process/temporal tests;
- 16 fresh-context semantic challenges in section 26; and
- 10 authority-dependent cases disabled until OQ-01 is resolved.

Every deterministic mutation starts from a clean focused fixture copy and
proves only the named fail-closed retained-state property.

When a case intentionally violates both an earlier checker and K2.17, the
future test must assert the specific K2.17 diagnostic or intended K2.17
failure surface in addition to the overall run failure. A generic `FAIL` is
not evidence that K2.17 enforced its own rule, and checker logic need not be
duplicated to make that assertion.

The second repair preserves DM5-001 through DM5-071 and allocates
DM5-072 through DM5-074 to the added retained-state cases rather than
renumbering already reviewed cases.

Predecessor mutation dispositions:

- predecessor mutation 47's genuinely semantic “cycle-caused propagation
  explosion” remains SC5-11; exact duplicate/path-derived structural variants
  are DM5-049 and DM5-050;
- predecessor mutation 75 becomes DM5-067, which relies on the exact retained
  S4-C2 phase marker; and
- predecessor mutation 77 moves to PT5-05 because final bytes cannot prove
  historical append timing.

### 25.1 Deterministic retained-state: artifact, identity, and expression

- `DM5-001` remove `ambiguity_id`;
- `DM5-002` duplicate an `AMB-*`;
- `DM5-003` duplicate the same exact expression under another `AMB-*`;
- `DM5-004` remove expression byte basis;
- `DM5-005` use a non-reopenable locator;
- `DM5-006` alter expression bytes without changing hash;
- `DM5-007` alter hash without changing bytes;
- `DM5-008` split a UTF-8 code point;
- `DM5-009` use an expression interval outside the source;
- `DM5-010` use a nonexistent source entity;
- `DM5-011` use a historical source-entity predecessor;
- `DM5-012` use a packet basis that does not cover the expression; and
- `DM5-013` remove a T5.1 definition while retaining its T5.2 assessment or
  another exact `AMB-*` reference.

Removing an otherwise self-contained ambiguity unit together with every
reference is not mechanically distinguishable from a missed prose ambiguity.
That case remains SC5-02.

### 25.2 Deterministic retained-state: search boundary

- `DM5-014` candidate/search source differs from expression source;
- `DM5-015` local scope names a nonexistent `WLK-*`;
- `DM5-016` local scope crosses sources;
- `DM5-017` full scope names a stale/nonterminal cursor;
- `DM5-018` full scope binds the wrong source hash;
- `DM5-019` multiple/null candidate state uses only local scope;
- `DM5-020` alter search basis with stale digest; and
- `DM5-021` omit required full-source completion; and
- `DM5-072` use `resolution_state = unresolved`,
  `candidate_state = single`, and `search_scope_kind = local-intervals` in an
  otherwise structurally valid assessment.

### 25.3 Deterministic retained-state: candidate/null

- `DM5-022` use a candidate outside the same source;
- `DM5-023` use a nonexistent candidate packet;
- `DM5-024` use a historical candidate predecessor;
- `DM5-025` use a `CC` candidate;
- `DM5-026` use a prose-only candidate;
- `DM5-027` use a URL/external candidate;
- `DM5-028` use malformed candidate JSON;
- `DM5-029` use malformed typed null;
- `DM5-030` mix null and non-null candidates;
- `DM5-031` declare `single` with two candidates;
- `DM5-032` declare `multiple` with one candidate;
- `DM5-033` add a confidence score;
- `DM5-034` claim `resolved-local` from multiple/null; and
- `DM5-035` invent a local candidate without an exact upheld review.

### 25.4 Deterministic retained-state: affected relations and matrix

- `DM5-036` omit the required affected-relation field;
- `DM5-037` name a nonexistent `REL-*`;
- `DM5-038` reference a `REL-*` row that exists once but is structurally
  invalid under K2.16, such as an `unresolved-target` row with a concrete
  target;
- `DM5-039` make one affected `REL-*` identity resolve to two canonical
  relation rows;
- `DM5-040` duplicate an affected relation ID in one assessment;
- `DM5-041` use noncanonical affected-relation order;
- `DM5-042` use `unresolved / none / nonempty`;
- `DM5-043` use `unresolved / explicit / none`;
- `DM5-044` use `resolved-local / explicit / none`;
- `DM5-045` use `resolved-local / explicit / nonempty`;
- `DM5-046` remove an affected relation without recomputing the review
  subject;
- `DM5-047` add an unrelated relation without recomputing the review subject;
- `DM5-048` add transitive/path-derived affected IDs with stale review
  binding;
- `DM5-049` add a forbidden path/derived-closure field;
- `DM5-050` duplicate an `(AMB, assessment_seq, REL)` tuple in response to a
  permitted relation cycle;
- `DM5-051` mutate a canonical `REL-*` row to store ambiguity state;
- `DM5-052` add ambiguity as a relation family/subtype; and
- `DM5-053` add ambiguity as an evidence-role field.

If DM5-047 or DM5-048 supplies a fresh structurally valid upheld review,
K2.17 cannot determine semantic unrelatedness or over-propagation. Those
variants belong to SC5-10 and SC5-11.

### 25.5 Deterministic retained-state: assessment/review history

- `DM5-054` use a noncontiguous assessment sequence;
- `DM5-055` use the wrong predecessor sequence;
- `DM5-056` change a candidate with stale review;
- `DM5-057` change the affected set with stale review;
- `DM5-058` change the search basis with stale review;
- `DM5-059` use the wrong verifier target;
- `DM5-060` cite a nonexistent verifier;
- `DM5-061` cite a duplicate verifier identity;
- `DM5-062` use a `refuted` verdict as authorization;
- `DM5-063` use reviewer `cannot-determine` as authorization; and
- `DM5-064` use authority/reference text in place of semantic review; and
- `DM5-073` append a contiguous new assessment sequence for the same
  ambiguity with an identical `review_subject_digest` and no changed allowed
  review subject or basis.

### 25.6 Deterministic retained-state: inactive authority surface

- `DM5-065` add any nonempty T5.3 row while OQ-01 is unresolved.

### 25.7 Deterministic retained-state: phase and format

- `DM5-066` activate the artifact under run format 1.0-1.4;
- `DM5-067` retain nonempty canonical ambiguity rows while the highest
  closure phase is earlier than S4-C2;
- `DM5-068` omit the required ambiguity artifact or final T5.1/T5.2 state at
  S4-C2, S4-C3, or S5 entry;
- `DM5-069` retain ambiguity rows without the 1.5 capability;
- `DM5-070` register a later run format that loses a prior cumulative
  capability; and
- `DM5-071` duplicate, skip, or reorder the retained S4-C1/S4-C2/S4-C3 phase
  markers; and
- `DM5-074` retain an S4-C2 marker while the required S4-C1
  `ledgers/relations.md` artifact is absent.

DM5-067, DM5-071, and DM5-074 prove only consistency between retained marker
state and retained bytes. They do not prove historical append timing or
historical relation immutability.

### 25.8 Process/temporal tests

These are not K2 mutations:

- `PT5-01` refuse a canonical relation append before S4-C1 before bytes
  change;
- `PT5-02` serialize the reviewed relation set in S4-C1 and expose exact
  `REL-*` identities only after relation closure succeeds;
- `PT5-03` refuse S4-C2 ambiguity finalization before S4-C1 completes;
- `PT5-04` refuse T5.1/T5.2 canonical append before S4-C2 before bytes change;
- `PT5-05` refuse any T5.1/T5.2 append after S4-C2, S4-C3, or S5 entry before
  bytes change;
- `PT5-06` demonstrate the legal C1 → C2 → C3 sequence and refuse S5 entry
  until both relation and ambiguity closure DoD are complete;
- `PT5-07 — POST-C1 RELATION WRITE REFUSAL`:
  - setup: the relation ledger has valid canonical bytes and the C1 closure
    phase is established;
  - attempt: append, delete, or alter a `REL-*` row during C2;
  - expected: the operation is refused, relation bytes remain byte-identical,
    C2 cannot obtain canonical authorization from mutated bytes, and no C3
    transition occurs because of the attempted mutation; and
- `PT5-08 — POST-C1 RESUME WITHOUT C1 REWRITE`:
  - setup: a run with valid C1 state stops before C2 completion;
  - attempt: resume under the same pins, including a variant retaining
    unauthorized partial canonical T5.1/T5.2 rows before a valid C2 marker;
  - expected: relation bytes remain byte-identical, work starts at the first
    unmet C2 DoD, C1 is not rerun or rewritten, partial rows are not
    normalized away, and no C3 transition occurs until valid C2 completion.

PT5-07 and PT5-08 prove only process/helper refusal and resume semantics. They
do not prove live writer integration unless F-03 is separately closed.

### 25.9 Authority-dependent cases

These cases are specified but disabled until OQ-01 is resolved by separately
adopted authority doctrine:

- `AD5-01` valid `preserve-unresolved` positive;
- `AD5-02` valid `close-with-supported-candidate` positive;
- `AD5-03` authority reference bound to the wrong subject;
- `AD5-04` changed assessment basis with stale authority response;
- `AD5-05` close action selects a candidate outside the reviewed set;
- `AD5-06` preserve action supplies a candidate;
- `AD5-07` convert `CANNOT_DETERMINE` to resolved without a valid action;
- `AD5-08` introduce an external fact, new candidate, or prose answer through
  human closure;
- `AD5-09` use a model identity as authority; and
- `AD5-10` overwrite authority history or skip its sequence.

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
| OQ-01 ambiguity authority decision category and legal action | BLOCKING NOW | authority/doctrine | Existing human-gate mechanics may present a Core-defined request, but current adopted doctrine does not clearly authorize the post-review human semantic decision category or its legal actions. T5.3 and all authority-positive cases remain disabled; implementation must not begin until a separate adopted decision resolves it. |

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
| S5-F09 relation-coverage completeness bound | LATER | semantic coverage/review | Slice 5 carry completeness is bounded by the completeness of declared Slice 4 relations. If no relation exists for a materially affected downstream claim, Slice 5 does not fabricate one and cannot carry through an undeclared relation. Later Slice 7 semantic coverage/review work may expose such gaps; this does not authorize density targets, relation fabrication, A4-07, or Slice 7 implementation. |
| Slice 4 implementation reconciliation DoD-21 wording | LATER / OUT OF SCOPE | local reconciliation | The pre-existing wording is not edited or re-adjudicated by this design repair. |

### 27.4 Confirmed correct

| Finding | Classification | Backward authority | Slice 5 disposition |
|---|---|---|---|
| A4-15 exact one-subject `VER` target behavior | CONFIRMED CORRECT | proof/checking | Reused as the binding pattern; not expanded or reopened. |

## 28. Future implementation Definition of Done

A future authorized Slice 5 implementation is structurally complete only when
all 33 items below hold. Every item is OPEN in this proposal.

1. The exact immutable repaired successor design has received a fresh
   independent design audit and is then adopted by human authority.
2. OQ-01 is resolved by a separate adopted authority/architecture decision
   naming the post-review human decision category, legal actions, stage/gate,
   authority-reference grammar, and append barrier.
3. `1.5.0-provisional` and cumulative `internal-ambiguity-lifecycle`
   capability activation are consistent across Core contracts, model,
   checker, runtime projection, and manifests.
4. Legacy 1.0-1.4 bytes and semantics remain unchanged and older formats do
   not activate Slice 5.
5. `ledgers/internal-ambiguities.md` and
   `aleph-internal-ambiguity/v1` are documented exactly.
6. T5.1/T5.2 schemas, column order, markers, and active closed vocabularies
   are implemented without extra speculative fields. While OQ-01 remains
   unresolved, T5.3 implementation is limited to canonical columns, required
   table presence, empty authority-action population, and inactive authority
   capability; the separate adopted OQ-01 decision owns any operative action
   vocabulary, authority subject, `authority_ref`, closure provenance, and
   positive-action checks.
7. `AMB-NNNN` uniqueness and duplicate-expression prevention are enforced.
8. Every expression reopens exact frozen bytes through source identity,
   existing locator scheme, byte interval, hash, base64, and packet basis.
9. Bounded search reuses source-walk identities and proves legal byte
   accounting without claiming semantic adequacy, including rejection of an
   unresolved single candidate unless full-same-source search completed.
10. Candidate grammar permits only same-source current `PKT` and exact
    source-locus endpoints.
11. Multiple candidates and both typed-null states remain distinct and
    `CANNOT_DETERMINE` remains visible.
12. Candidate confidence/ranking and arbitrary prose antecedents are rejected.
13. `affected_relation_ids` implements the exact eligible-canonical-relation
    consumption predicate: exact-one same-run row, S4-C1 closed-set
    membership, K2.16 validity, Slice 4 endpoint rules, and acceptance of all
    four adopted `record_state` values without relation lineage, against the
    exact immutable C1 relation set.
14. The complete eight-row
    resolution/carry/affected-set matrix is implemented exactly, including
    legal `resolved-local / none / nonempty` dependency history.
15. Affected relation IDs are finite explicit reviewed declarations and no
    relation row stores or is mutated by ambiguity state.
16. Unrelated descendants do not inherit ambiguity, and no transitive
    propagation, graph closure, path inference, relation lifecycle, or
    automatic endpoint retargeting exists.
17. Permitted relation cycles remain finite and do not multiply ambiguity
    state or evidence.
18. Exact ambiguity review-subject serialization, digest, verifier target,
    allowed verdicts, and stale-review behavior match this design; reviews
    name the exact immutable C1 relation set, and an identical unchanged
    review basis cannot inflate `assessment_seq`.
19. The composite ordered S4 barrier is implemented as S4-C1 relation
    closure and immediate read-only commit point, S4-C2 ambiguity
    finalization that consumes but cannot mutate the C1 relation set, and
    S4-C3 exit that carries forward C1 immutability. A C2-discovered relation
    defect blocks rather than rewriting, replacing, retargeting, or silently
    rerunning C1.
20. Exact retained phase markers are monotonic. S4-C1 is the 1.5 activation
    point for a present, complete, K2.16-valid relation artifact, and K2.17
    validates only retained phase/artifact consistency, never historical
    write timing or immutability.
21. Manual/orchestrator temporal enforcement and all eight PT5 process tests
    refuse out-of-window writes before bytes change, preserve relation bytes
    across post-C1 write attempts, and resume post-C1 work without rerunning
    or rewriting C1.
22. Fresh same-source review may establish `resolved-local` without human
    authority, while T5.3 remains empty and all authority-positive behavior
    remains disabled until OQ-01 is resolved.
23. Human authority, if later activated under OQ-01's adopted decision, can
    only preserve unresolved state or select an already reviewed same-source
    candidate, can never add corpus facts, and cannot reuse a stale subject.
24. S5 receives ambiguity as visible input but no disposition vocabulary or
    mechanical selection changes.
25. S8 remains separate and no unresolved internal ambiguity automatically
    creates an external referent.
26. Correction/effective-state interaction remains narrow, append-only only
    in the legal pre-exit phases, and fail closed after S4-C3 without generic
    correction or relation-successor machinery. C2 may expose a C1 relation
    defect but cannot repair it; only an already-adopted applicable mechanism
    or successor-run handling may proceed.
27. K2.17 implements only deterministic retained-state responsibilities,
    reports PASS as structural only, and preserves the process/semantic/
    authority non-claims in section 19, including no claim that it proves
    historical relation immutability or actual writer refusal.
28. The focused fixture covers every section 24 branch, both eligible asserted
    and typed-null relations, the complete matrix, a noneligible relation
    reference, a permitted cycle without propagation, and an unrelated
    relation not affected.
29. All 74 DM5 deterministic retained-state mutations fail for the intended
    reason while the clean fixture passes; cases that also violate an earlier
    checker assert the intended K2.17-specific diagnostic.
30. All 8 PT5 process tests and 16 SC5 semantic challenges are implemented;
    the 10 AD5 authority-dependent cases remain disabled until OQ-01 is
    separately resolved and then must be implemented under that adopted
    contract.
31. The late relation-coverage limitation is documented: Slice 5 cannot carry
    through an undeclared relation, does not fabricate one, and does not claim
    Slice 7 coverage, density targets, or A4-07.
32. TypeScript canonical source and locked `runtime-js` projection are in
    parity; Core boundary, checker digest accounting, bundle equality, and
    adapter boundary tests pass without adapter-local ambiguity semantics.
33. A fresh independent implementation audit reviews the exact commit/tree,
    reproduces the complete partitioned evidence, and returns an explicit
    implementation verdict; that verdict still does not establish replay,
    semantic validation, sanction, acceptance, production readiness, golden
    status, or v1.

## 29. Self-audit

### 29.1 Preserved predecessor audit history

The exact predecessor proposal commit
`f8aadc2160826e2df736a946188c92158ec354aa`, tree
`74061400d1dd7a3e6e0f5cd5e180e88e900140c8`, was independently audited and
returned:

`BLOCK_SLICE_5_HUMAN_ADOPTION`

That result is preserved. The blocked proposal contained at least:

- S5-F01 — undefined affected-REL eligibility/currentness through invalid
  “lineage-current REL” terminology;
- S5-F02 — no singular composite ordered S4 closure barrier;
- S5-F08 — a false “CLOSED BY DESIGN” statement and false “OQ-01 only”
  surviving-finding claim.

The successor does not state that those findings never existed.

### 29.2 Preserved second blocked-successor audit history

The exact second blocked proposal commit
`53adf0c95672774f07b094f5e1a262542aedad3e`, tree
`f24cfc299e09c9f45d5c230a2c8909f46733e100`, was freshly and independently
audited and returned:

`BLOCK_SLICE_5_HUMAN_ADOPTION`

The blocking finding was:

`S5-F11 — relation immutability between S4-C1 and ambiguity finalization was
undefined`

The audit concluded `OQ-01-A`: the proposal may be adopted while OQ-01
remains open; OQ-01 blocks implementation, not adoption. That result is
preserved without claiming that OQ-01 is resolved or adopted.

The second audit left S5-F01, S5-F04, S5-F05, S5-F06, S5-F07, S5-F08, and
S5-F10 closed on that blocked successor, and left S5-F09 as LATER. This second
narrow repair preserves those dispositions unless its changed text is found
to regress them by the required fresh successor audit.

### 29.3 Second narrow successor repair dispositions

Each disposition below is a successor design repair pending fresh independent
audit, not an independently verified closure:

| Finding | Successor disposition |
|---|---|
| S5-F01 | Defines `eligible canonical relation` as a narrow same-run consumption predicate; permits all four Slice 4 record states; removes REL lineage/predecessor/successor language and blocks rather than inventing relation retargeting. |
| S5-F02 | Defines one composite S4 closure barrier with ordered S4-C1 relation closure, S4-C2 ambiguity finalization, and S4-C3 exit, plus exact retained run-log phase markers and explicit temporal non-claims. |
| S5-F03 / OQ-01 | Preserves the audit's OQ-01-A conclusion: proposal adoption may occur while OQ-01 remains open, but implementation remains blocked. T5.3 remains inert and OQ-01 is neither resolved nor adopted. |
| S5-F04 | Defines all eight resolution/carry/affected-set combinations and permits reviewed resolved-local dependency history without unresolved carry. |
| S5-F05 | Separates 74 deterministic retained-state mutations from 8 process/temporal tests; predecessor mutation 75 is static only through a retained phase marker and mutation 77 is process-only. |
| S5-F06 | Removes “cycle-caused propagation explosion” as a freestanding deterministic semantic claim; exact duplicate/path structural violations are DM5-049/050 and semantic reachability reasoning remains SC5-11. |
| S5-F07 | Adds eligible asserted and typed-null relation positives, actual noneligible relation-reference negatives, complete matrix cases, and mechanically recounted evidence totals. |
| S5-F08 | Records the predecessor block and false closure statements here; no “findings never existed” claim remains. |
| S5-F09 | Adds the explicit LATER limitation that carry completeness is bounded by declared Slice 4 relation completeness, without relation fabrication, density targets, A4-07, or Slice 7 authority. |
| S5-F10 | States precisely that the PR changes `core.manifest.json` by one repository-administration path while run-format values, Core payload, checker inventory, and bundle inputs remain unchanged. |
| S5-F11 | Makes S4-C1 the immediate commit/read-only point for the exact canonical relation set; C2 may consume but cannot mutate it, and a C2-discovered relation defect blocks rather than rewriting C1. |
| S5-F13 | Limits unresolved-OQ-01 T5.3 implementation to canonical columns, required table presence, empty population, and inactive capability; the separate authority decision owns every operative positive vocabulary and binding. |
| S5-F14 | Adds DM5-072 for an otherwise valid `unresolved / single / local-intervals` retained state. |
| S5-F15 | Adds DM5-073 to reject assessment-sequence inflation with an identical digest and no changed allowed basis. |
| S5-F16 | Qualifies the canonical basis as a bounded authority narrowing pending OQ-01 rather than claiming unqualified preservation. |
| S5-F17 | Makes S4-C1 the future 1.5 K2.16 activation point and adds DM5-074 for C2 without the required C1 relation artifact. |
| S5-F18 | States that future Slice 5 extends the run-log event shape with one new `closure_phase` marker line per corresponding event. |
| S5-F19 | Adds same-pin post-C1/pre-C2 resume rules and PT5-08 without generic rollback/checkpoint architecture. |
| S5-F20 | Requires a K2.17-specific diagnostic when a mutation also fails an earlier checker. |

### 29.4 Current successor self-audit

The successor was re-attacked against the original design boundaries:

| Attack | Current successor control |
|---|---|
| invented human gate | OQ-01 remains `BLOCKING NOW`; mechanics are distinguished from decision authority; T5.3 is empty |
| hidden external-research path | one same frozen source only; contamination fails |
| automatic pronoun/reference resolution | semantic producer/reviewer only; no checker inference |
| indiscriminate graph propagation | finite explicit reviewed affected set; no reachability closure |
| ambiguity as relation/evidence/disposition | separate artifact and role boundaries |
| relation lifecycle invention | eligible-relation consumption only; no predecessor, successor, status, version, or retargeting |
| post-C1 relation mutation | C1 is the immediate read-only commit point; PT5-07 requires refusal and byte identity |
| C2 repairing a C1 defect | C2 may expose the defect but must block; no mutation, replacement, silent rerun, or C3 |
| stale review after unchanged-ID relation mutation | unauthorized changed relation bytes invalidate the run and old review; no relation-version lifecycle is added |
| resume rewriting C1 or partial T5 state | same pins and bytes, first unmet C2 DoD, no C1 rerun, no silent normalization, PT5-08 |
| checker deciding semantics, timing, or history | section 19 partition; K2.17 retained-state only and no historical-immutability claim |
| incomplete field matrix | all eight combinations explicit with targeted cases |
| barrier ambiguity | one C1 → C2 → C3 vocabulary with retained phase markers |
| human inventing corpus facts | any later action is bounded to a reviewed candidate or preservation |
| conflation with S8/S5 | separate handoff; no automatic `REF-*` or disposition |
| implicit correction/versioning | pre-exit assessment history only; post-exit fail closed |
| cycles causing ambiguity explosion | no traversal; structural duplicate/path cases separate from SC5-11 |
| hidden implementation authorization | design-only; all 33 implementation DoD items OPEN |
| run-format or manifest overclaim | future 1.5 only; current values unchanged; one administrative manifest classification accurately disclosed |
| adapter-local semantics or status inflation | Core-owned future design; all implementation/validation/sanction/acceptance claims denied |

Current unresolved/pending state:

- OQ-01 remains implementation-blocking under `OQ-01-A`, while proposal
  adoption is not blocked solely by OQ-01;
- fresh independent successor design audit is required before any human
  adoption request;
- 74 deterministic mutations, 8 process/temporal tests, 16 semantic
  challenges, and 10 authority-dependent cases are future plans only; and
- all 33 future implementation DoD items remain OPEN.

Carried findings remain:

- MUST PRESERVE: F-03, F-04, F-05, manual-only sanction, and relations
  non-evidentiary;
- LATER: A4-07, A4-14, A4-16, A4-17, N-09/A-03, A-01, A-02, S5-F09, and the
  pre-existing Slice 4 reconciliation DoD-21 wording; and
- A4-15 remains confirmed correct.

The fresh audit did find S5-F11 on the second blocked proposal. This self-audit
records the new repair and nonblocking reconciliations; it does not close them
and is not a substitute for the required fresh independent successor audit.

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

Relative to the canonical base, the design PR changes only:

- this proposal; and
- one `core.manifest.json` `files.repository_administration` entry that
  classifies the proposal path.

The successor repair commit changes only this proposal; it leaves the already
correct administrative classification unchanged.

Current run-format manifest values, Core payload inventory, checker inventory,
bundle inputs, Core contracts, checker source, runtime JS, adapter source,
fixtures, package files, and implementation manifests remain unchanged.

## 31. Status boundary

If this proposal is published in a draft PR, its maximum status is:

- PROPOSED DESIGN — SECOND NARROW REPAIR AFTER TWO BLOCKING INDEPENDENT AUDITS
- FRESH SUCCESSOR DESIGN AUDIT REQUIRED
- HUMAN AUTHORITY ADOPTION NOT YET REQUESTED
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

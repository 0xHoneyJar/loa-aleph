# Slice 4 Typed Dependency and Source-Context Relations Design

Date: 2026-08-28

Status: PROPOSED — HUMAN AUTHORITY ADOPTION REQUIRED

Decision class: bounded Core design proposal for Slice 4 implementation

Design base:

- canonical main commit:
  `a00e5ee4298f23d60352583904cf42d29caaaac7`;
- canonical main tree:
  `2e235e381ce5de39443e8599a68b9967e9594046`.

## 1. Status and authority

This document proposes the bounded Slice 4 Core contract for typed dependency
and source-context relations. It does not record adoption and does not
authorize implementation.

This proposal is subordinate to:

- the accepted root doctrine and Decisions 0003 and 0004;
- the adopted SRC-001 architecture decision;
- the adopted correction/effective-state decision;
- the adopted Slice 3 unified-lineage design and its merged bounded
  implementation;
- the independently audited DC-02 and SL-02 boundaries; and
- the existing S0-S13 authority, verification, and single-writer contracts.

If this proposal conflicts with an adopted higher-authority decision, the
higher-authority decision governs and implementation must stop for
reconciliation.

This file is design only. It does not:

- bump the current repository run format;
- change a checker, runtime, adapter, fixture, or run artifact;
- create an adoption record;
- claim human adoption;
- authorize Slice 4 implementation; or
- authorize Slice 5 or any later slice.

Human authority must adopt an exact immutable identity of this proposal before
implementation can begin.

## 2. Purpose

Slice 4 answers one bounded question:

> What typed semantic or source-context relation exists between durable
> research units or a durable research unit and an exact source-bound locus?

The smallest coherent Slice 4 result is:

1. one canonical, append-only relation-definition surface;
2. one small closed family/subtype taxonomy;
3. typed durable or source-bound endpoints;
4. narrow typed-null and explicit-absence records;
5. lineage-current endpoint closure at the S4 barrier;
6. relation-specific structural cycle policy;
7. source-bound provenance plus producer/reviewer receipts; and
8. a deterministic checker that validates structure without deciding semantic
   truth.

Slice 4 does not attempt to reproduce SRC-001's historical link count or exact
link set. It supplies a prospective Core contract for new-format runs.

## 3. Calibration evidence basis

The governing evidence facts are:

- the final SRC-001 graph contains 250 dependency-array entries across 165
  units;
- those entries are heterogeneous rather than one relation type;
- 237 entries resolve to active final IDs;
- two entries target non-active/original units;
- seven entries name formal/table-header pseudo-targets;
- one entry names a table-review workflow record;
- three entries are prose or compound references;
- the proposal schema had no uniform structured dependency field; and
- link-by-link semantic delta remains `CANNOT_DETERMINE`.

The 250-entry count is graph size, not:

- a machine-miss count;
- a completeness target;
- a target relation density;
- a required future fixture count; or
- evidence that every historical link was correct.

Exact evidence inspected for this design includes:

| Artifact | Exact identity / location | Use in this design |
|---|---|---|
| Producer machine-to-final mapping | `SRC-001-machine-to-final-mapping.json`; SHA-256 `5b7648b3021a16b60d88ab67efbca96ed1aa1a42abad592b8950e96b21507613` | Final unit dependency arrays, prose targets, formal pseudo-targets, and non-active targets |
| Closed development calibration package | `calibration/src-001/closed-reference/SRC-001-closed-development-calibration-reference-20260811T162619+0200.zip`; SHA-256 `f4c42e65d611395c9bacdb7ecf3ab7e4d01b1d21fd50c6c150b0cc6a8847a9f0` | Immutable checkpoint and authority records |
| Batch 8 dependency ledger | closed package `:: evidence/authority/b07-b12/batch-08/SRC-001-checkpoint-through-batch-08-20260806T1050+0200.zip :: SRC-001-dependencies-through-batch-08.json` | Continuation, inherited-context, and mutual-context representations |
| Batch 12 dependency ledger | closed package `:: evidence/authority/b07-b12/batch-12/SRC-001-checkpoint-through-batch-12-20260806T2302+0200.zip :: SRC-001-dependencies-through-batch-12.json` | Configuration, comparator, formal/table, non-independent context, overlap, and forward-resolution representations |
| Effective final-state analytical overlay | `calibration/src-001/core-design-basis/SRC-001-effective-final-state-analytical-overlay-20260813.json` | Effective C-009 discourse preservation, C-186 unresolved referent carry, and corrected analytical boundaries |
| Independent architecture audit | `calibration/src-001/core-design-basis/SRC-001-independent-calibration-delta-architecture-decision-20260813.md` | DC-02 and SL-02 checker/semantic split |

The historical dependency ledgers used labels including `dependencies`,
`context_links`, `configuration_context`, `contextual_overlaps`,
`partial_overlaps`, `figure_context_non_independent`,
`table_introduction_context`, `failure_table_context`,
`comparator_context`, `comparator_caveat`,
`context_only_not_proof_of_hypotheses`, `forward_dependency_resolved`,
`continuation_links`, and `forward_continuation`.

Those labels are evidence of heterogeneous phenomena. They are not a
prospective enum to copy.

## 4. Forensic inventory before taxonomy

The following inventory records distinct observed phenomena. It deliberately
retains contradictory or indeterminate historical representations.

| Phenomenon and representative IDs | Exact source artifact | Original representation | Semantic purpose | Classification | Slice 4 disposition |
|---|---|---|---|---|---|
| Aggregate proposition depends on component results: `C-025 -> C-020a, C-021, C-022a, C-023, C-024` | producer mapping | flat `dependencies` ID array | identify propositions required to interpret the aggregate claim | claim dependency | IN, after fresh semantic review |
| Formal definition plus implementation scope flattened together: `C-031 -> C-029, C-030` | producer mapping | one undifferentiated ID array | bind an implementation statement to an equation and a paper-specific MLP scope | mixed formal reference and qualifier/configuration context | IN, but the two links require separate typed judgments; historical meaning is not mechanically assumed |
| Grammatical antecedent embedded in prose: `C-002 -> "C-001 (source-sentence antecedent; itself duplicate of C-007)"` | producer mapping | mixed durable ID plus prose annotation | preserve an antecedent without importing a separate assertion | source-context attachment plus lineage note | IN only as a typed context target; duplicate identity belongs to Slice 3/S4 duplicate handling |
| Unresolved antecedent: `M-001a -> "preceding claims; exact claim set remains unresolved"` | producer mapping | prose-only target | preserve that "these claims" has an unresolved target | ambiguity/referent issue with a narrow relation placeholder | Slice 4 may record a typed unresolved target; Slice 5 owns lifecycle, propagation, and closure |
| Inherited subject across discontiguous fragments: `M-001b -> "inherits 'Our results' from M-001a/source sentence"` | producer mapping | compound ID/source prose | preserve source-sentence subject needed to read the unit | known antecedent or exact source-context attachment | IN only after selecting one typed durable target or exact source locus |
| Formal table-header pseudo-target: `T1-001` through `T1-007 -> FORMAL:TABLE1_HEADER_L307-L312` | producer mapping | invented formal pseudo-ID | bind table rows to the header that supplies their column semantics | formal/header reference | IN as an exact source locus or durable PKT/CC, never as `FORMAL:*`; richer table coordinates remain Slice 6 |
| Temporary table-review dependency: `C-170 -> TABLE-2-FORMAL-MATERIAL-REVIEW` | producer mapping and batch 12 ledger | workflow record, later `forward_dependency_resolved` to `T2-000..T2-012` | prevent a claim from outrunning unreviewed formal material | process gate plus later formal/context relation | workflow record and range target are OUT; future canonical rows must target concrete durable units or a locus |
| Notation/context mutuality: `C-088 -> C-089` and `C-089 -> C-088` | producer mapping | two generic dependency links | one unit uses `q`; the other defines `q` for the question-conditioned RN | notation definition plus configuration context | IN as a permitted mixed-type mutual-context structure, not as a dependency DAG cycle |
| Qualifier/formal mutuality: `C-107 -> T1-006` and `T1-006 -> C-107` | producer mapping | two generic dependency links | a starred table value needs its qualifying footnote while the footnote identifies the value | qualifier context plus structural/formal anchor | IN as a permitted mixed-type mutual-context structure after review |
| Configuration sequence and continuation: `C-182`, `C-183`, `C-184` | batch 8 and batch 12 dependency ledgers | `dependencies`, `continuation_links`, `forward_continuation`, and `configuration_context` | preserve a multi-unit model-configuration passage | configuration context and discourse continuation | IN, but no historical direction or density is presumed |
| Context explicitly not independent proof: `C-205/C-206 -> G-040` and `C-171 -> T2-001..T2-012` | batch 12 dependency ledger | `figure_context_non_independent` and `context_only_not_proof_of_hypotheses` | retain explanatory context without turning it into support | source context plus evidence-role boundary | Context relation is IN; `G-*`, ranges, and evidence-role conclusions are not legal relation endpoints |
| Discourse relationship present in effective overlay but absent from mapping array: `C-009` with `C-008` | effective overlay and producer mapping | overlay says preserve "discourse/dependency relationship"; final `dependencies` is empty | retain a parallel example/discourse transition | discourse relation with contradictory historical representation | Historical link is `CANNOT_DETERMINE`; it motivates the subtype but is not silently normalized into a canonical edge |
| Non-active/original targets: `E-003 -> C-161`; `M-002 -> C-104` | producer mapping | durable-looking ID targets that are not active final units | retain context from a rejected or split predecessor | historical dependency against superseded identity | OUT as a current 1.4 endpoint; a new relation must name a lineage-current successor or exact locus |
| Split/supersession pattern around `S-190b` | final checkpoint and adopted Slice 3 design | source-parent/supersession history | answer what happened to unit identity | identity lineage | OUT; Slice 3 owns it |
| `partial_overlaps` and `contextual_overlaps` among `C-184`, `C-185`, `C-200`-`C-202`, `S-190a/b`, and `S-192b` | batch 12 dependency ledger | overlap-like pairwise links | flag possible duplicate, partial-overlap, or contextual-overlap judgments | duplicate/overlap relation | OUT; S4 merge-map judgment and Slice 8 refutation design own it |
| `C-186` same-LSTM ambiguity carried to `C-187`, `C-188`, and `C-206` | effective overlay | explicit unresolved referent with carry set | preserve unresolved antecedent and its downstream cone | ambiguity/referent issue | OUT beyond a narrow typed-null relation placeholder; Slice 5 owns carry and closure |
| Claim-source load bearing, corroboration, contradiction, or contextual role | existing `evidence-roles.md` Core contract | typed `CC x SRC` evidence-role edge | say what evidentiary role a source plays for a claim | evidence role | OUT; Slice 4 relations never confer support |

Forensic conclusion:

- the evidence supports a small typed relation contract;
- it does not support mechanical conversion of every historical link;
- exact relation direction, subtype, and target remain semantic judgments;
- historical contradictions remain visible; and
- no future implementation may use SRC-001 link density as a required output.

## 5. Terminology and scope

### 5.1 Relation

A Slice 4 relation is a reviewed directional statement that one
lineage-current durable unit requires, refers to, continues, contrasts with,
or is contextually qualified by another lineage-current durable unit or an
exact frozen source locus.

The source endpoint is the unit whose interpretation carries the relation.
The target endpoint is the provider, prerequisite, antecedent, qualifier,
definition, structural anchor, continuation anchor, or comparison anchor.

This direction is uniform across the v1 schema. Historical checkpoint arrow
direction is not automatically preserved.

### 5.2 Relation record

A relation record is one `REL-NNNN` row. It represents either:

- one asserted typed edge;
- one known relation whose target is unresolved;
- one bounded, type-specific explicit-absence assessment; or
- one bounded indeterminate assessment.

Only `asserted` rows are graph edges.

### 5.3 Durable research unit

Slice 4 v1 uses existing `CC-*` and `PKT-*` units. It does not create a new
generic graph-node family.

### 5.4 Exact source locus

An exact source locus is a `SRC-*` row plus its declared `md-lines` locator
and exact span hash. It is an endpoint form, not a fabricated packet or claim.

Slice 4 v1 does not define table-cell coordinates, visual geometry, OCR
reconstruction, or degraded-format semantics. Those remain Slice 6.

## 6. Relation boundaries

### 6.1 Relation versus lineage

Lineage answers:

> What happened to this unit's identity?

Relations answer:

> What typed semantic or context link applies to this current unit?

`split`, `merge`, `replace`, `supersede`, `duplicate`, `reject`, `exclude`,
and `no-claim` remain `LIN-*` events. They are never `REL-*` types.

### 6.2 Relation versus S5 disposition

Disposition answers what research-result role a lineage-current claim receives:
`carried`, `merged`, `deferred`, `excluded-with-reason`, `backgrounded`,
`judged-non-load-bearing`, or `unresolved`.

A relation does not assign or imply a disposition.

### 6.3 Relation versus evidence role

Evidence-role contracts answer whether a `CC x SRC` edge is load-bearing,
corroborative, contradictory, contextual, decorative, or unresolved-source.

No Slice 4 family or subtype means:

- proves;
- supports;
- corroborates;
- contradicts;
- is independent evidence for; or
- survives evidence removal.

Context required to understand a claim is not independent evidence supporting
that claim.

Repeated relation rows, repeated targets, repeated wording, or relation
multiplicity never create independent support.

### 6.4 Relation versus ambiguity/referent lifecycle

Slice 4 may record only that a known relation has a typed-null target or that
the relation judgment is indeterminate.

Slice 4 does not:

- identify an unresolved pronoun automatically;
- infer a propagation cone;
- carry ambiguity to descendants;
- close ambiguity;
- accept an authority resolution;
- create an external-referent lifecycle; or
- rewrite relations after resolution.

Those are Slice 5 or existing S8 authority-bound responsibilities.

### 6.5 Relation versus duplicate/overlap judgment

`duplicate`, `partial-overlap`, `same-claim`, and `absorbs` are not Slice 4
relation types.

S4 merge-map judgment and Slice 8 fresh refutation remain separate. A
discourse or context edge between two units does not answer whether they are
duplicates.

## 7. Canonical relation artifact model

Slice 4 proposes one canonical Core artifact:

`ledgers/relations.md`

with exactly one format marker:

`relation_format: aleph-relations/v1`

and exactly one canonical relation table.

The identifier family is:

`REL-NNNN`

The artifact is append-only on the Core single-writer surface.

### 7.1 S4 closure barrier

S2 and S3 producers may return relation proposals in retained worker/verifier
records. Those proposals are not canonical relation rows.

Canonical `REL-*` rows are reconciled and written only at the S4 closure
barrier, after Slice 3 lineage and S4 merge/duplicate decisions have
established the lineage-current unit inventory.

The file may be initialized earlier with the marker and an empty canonical
table if the ordinary run-directory constructor requires it. No `REL-*` row
may be present before S4 closure.

This barrier is required because it:

- makes endpoint currentness mechanically checkable;
- prevents an early relation row from silently following a later successor;
- avoids lineage-snapshot or artifact-version fields;
- avoids a relation-rewrite engine; and
- preserves append-only canonical semantics.

Once the run enters S5, no new canonical relation row may be appended under
Slice 4 v1. A newly discovered required correction must fail closed under the
existing correction boundary.

### 7.2 Relation identity and currentness

`REL-NNNN` identifies one immutable relation record. Slice 4 does not define:

- relation replacement;
- relation supersession;
- relation retraction;
- a current-relation pointer;
- relation versions; or
- relation rewind.

At S4 closure, every concrete durable endpoint must be lineage-current.
Current relation derivation is structural:

```text
current asserted relation
=
valid asserted REL row
whose source is lineage-current
and whose concrete durable target is lineage-current,
or whose source-locus target exactly reopens frozen bytes
```

Because post-S4 lineage append is already forbidden, a valid Slice 4 v1 run
does not normally acquire newly historical relation endpoints after closure.

Historical calibration links remain inspectable in the calibration record;
they are not copied into the new canonical ledger merely to preserve density.

## 8. Proposed relation schema

The proposed canonical table is:

```text
| relation_id | owner_stage | family | type | source_kind | source_id | target_kind | target_id | target_source_id | target_locator | target_span_hash | record_state | null_reason | basis_packet_ids | proposed_by | reviewed_by | authority_ref |
|-------------|-------------|--------|------|-------------|-----------|-------------|-----------|------------------|----------------|------------------|--------------|-------------|------------------|-------------|-------------|---------------|
```

Field rules:

| Field | Rule |
|---|---|
| `relation_id` | unique `REL-NNNN` |
| `owner_stage` | semantic production stage permitted by the family/type matrix; canonical serialization still occurs at S4 closure |
| `family` | one closed family, or `none` only for an `indeterminate` record whose family cannot be determined |
| `type` | one closed subtype belonging to `family`, or `none` only for a permitted `indeterminate` record |
| `source_kind` | `CC` or `PKT` |
| `source_id` | existing lineage-current ID of the declared source kind |
| `target_kind` | `CC`, `PKT`, `source-locus`, or `null` |
| `target_id` | existing target ID for `CC`/`PKT`; otherwise `none` |
| `target_source_id` | existing `SRC-*` only for `source-locus`; otherwise `none` |
| `target_locator` | exact declared `md-lines` locator only for `source-locus`; otherwise `none` |
| `target_span_hash` | exact `sha256:<lowercase-hex>` of the source-locus bytes; otherwise `none` |
| `record_state` | `asserted`, `unresolved-target`, `explicitly-absent`, or `indeterminate` |
| `null_reason` | closed state-specific value; `none` for `asserted` |
| `basis_packet_ids` | nonempty comma-separated existing `PKT-*` records reviewed as the frozen source basis |
| `proposed_by` | `human:<actor-slug>` or `invocation:<producer-invocation-id>`; not narrative prose |
| `reviewed_by` | one existing fresh-context `VER-*` verdict reference |
| `authority_ref` | `none` or `manifest-signoff:relation:REL-NNNN` resolving to an exact run-manifest authority sign-off gate `relation:REL-NNNN` |

`record_state` is the narrow answer to the slice plan's provisional `status`
field. It is a relation-assessment state, not a generic correction state.
Values such as `ACTIVE`, `STALE`, `INVALIDATED`, `SUPERSEDED`, or `EFFECTIVE`
are not legal relation states.

### 8.1 State/field matrix

| `record_state` | Family/type | Target | `null_reason` | Graph edge? |
|---|---|---|---|---|
| `asserted` | concrete family and subtype | concrete legal `CC`, `PKT`, or `source-locus` | `none` | yes |
| `unresolved-target` | concrete family and subtype | `target_kind = null`; all target value fields `none` | one unresolved-target reason | no |
| `explicitly-absent` | concrete family and subtype | `target_kind = null`; all target value fields `none` | `bounded-review-found-none` | no |
| `indeterminate` | concrete family/type where known; `none` only for the undetermined level | `target_kind = null`; all target value fields `none` | one indeterminate reason | no |

An asserted row may not contain prose in any endpoint field.

## 9. Taxonomy design decision

The four slice-plan terms are relation families with narrower closed subtypes:
option B.

They are not the exact final `type` enum because:

- claim dependency and antecedent context have different endpoint and cycle
  rules;
- notation definition and structural/header anchoring require different
  target interpretation;
- continuation and parallel/contrast are not interchangeable;
- a single four-value enum would move important distinctions into prose; and
- copying every historical checkpoint label would create an unstable,
  over-fitted enum.

The proposed families are:

- `claim-dependency`;
- `source-context`;
- `formal-reference`;
- `discourse`.

The proposed subtypes are:

| Family | Closed subtype |
|---|---|
| `claim-dependency` | `semantic-prerequisite` |
| `source-context` | `antecedent-context` |
| `source-context` | `qualifier-context` |
| `source-context` | `configuration-context` |
| `formal-reference` | `structural-anchor` |
| `formal-reference` | `notation-definition` |
| `discourse` | `continuation-context` |
| `discourse` | `parallel-contrast-context` |

This eight-subtype vocabulary is projection-neutral and independent of final
SRC-001 frequency.

## 10. Relation-type contracts

### 10.1 Complete type matrix

| Family / subtype | Semantic meaning | Allowed source kinds | Allowed concrete target kinds | Direction | Typed null | Self-edge | Cycle policy | Parallel rows | Support assertion | Owner stage | Endpoint currentness |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `claim-dependency / semantic-prerequisite` | the source proposition semantically presupposes or composes over the target proposition | CC | CC | dependent claim -> prerequisite claim | yes | forbidden | subtype-only graph must be acyclic | multiple distinct targets legal | no | S3 or S4 review | source and target current |
| `source-context / antecedent-context` | a resolved same-corpus antecedent is required to read the source faithfully | CC, PKT | CC, PKT, source-locus | dependent unit -> antecedent provider | yes | forbidden | subtype-only graph must be acyclic | multiple only when the source genuinely has multiple antecedents | no | S2, S3, or S4 review | durable endpoints current |
| `source-context / qualifier-context` | target supplies a scope, condition, caveat, comparator, or exception that qualifies the source | CC, PKT | CC, PKT, source-locus | qualified unit -> qualifier | yes | forbidden | cycles permitted structurally; fresh review required | multiple distinct qualifiers legal | no | S2, S3, or S4 review | durable endpoints current |
| `source-context / configuration-context` | target supplies setup/configuration needed to interpret the source without acting as proof | CC, PKT | CC, PKT, source-locus | configured unit -> configuration provider | yes | forbidden | cycles permitted structurally; fresh review required | multiple distinct context providers legal | no | S2, S3, or S4 review | durable endpoints current |
| `formal-reference / structural-anchor` | source refers to a heading, table header/title/row label, figure/caption label, equation label, or other exact structural anchor | CC, PKT | CC, PKT, source-locus | referring unit -> anchor | yes | forbidden | formal-reference-only graph must be acyclic | multiple distinct anchors legal | no | S2 or S3 | durable endpoints current |
| `formal-reference / notation-definition` | target defines notation, a symbol, or a formal object used by source | CC, PKT | CC, PKT, source-locus | notation user -> definition | yes | forbidden | formal-reference-only graph must be acyclic | multiple definitions legal only for distinct notation | no | S2 or S3 | durable endpoints current |
| `discourse / continuation-context` | source continues a bounded passage or configuration begun by target | CC, PKT | same durable kind as source, or source-locus | continuation -> prior anchor | yes | forbidden | subtype-only graph must be acyclic | multiple prior anchors require review | no | S2 or S3 | durable endpoints current |
| `discourse / parallel-contrast-context` | source is presented as a parallel example, alternative, or contrast to target | CC, PKT | same durable kind as source, or source-locus | later/subject unit -> comparison anchor | yes | forbidden | subtype-only graph must be acyclic | multiple distinct comparison anchors legal | no | S2 or S3 | durable endpoints current |

### 10.2 Examples and counterexamples

#### `semantic-prerequisite`

Example:

- an aggregate result claim points to the component result claims over which
  it generalizes.

Counterexamples:

- a source cited as corroboration: evidence-role contract;
- a grammatical pronoun antecedent: `antecedent-context`;
- a claim replaced by a corrected claim: Slice 3 lineage.

#### `antecedent-context`

Example:

- a unit containing "these categories" points to the current unit or exact
  source locus that enumerates those categories.

Counterexamples:

- an unresolved pronoun with no known target is not guessed; it becomes
  `unresolved-target`;
- a full ambiguity carry cone is Slice 5;
- a duplicate target annotation belongs to lineage/merge review.

#### `qualifier-context`

Example:

- a table result points to a footnote that limits the result to the authors'
  implementation and optimized hyperparameters.

Counterexamples:

- a source that independently supports the result belongs in
  `evidence-roles.md`;
- a correction that invalidates the result belongs to deferred correction
  architecture.

#### `configuration-context`

Example:

- one model-configuration unit points to prior units defining the model setup
  required to interpret it.

Counterexample:

- a mere nearby sentence with no interpretive function is not a relation.

#### `structural-anchor`

Example:

- a table-row packet points to the exact frozen table-header locus that names
  its columns.

Counterexamples:

- `FORMAL:TABLE1_HEADER_L307-L312` as a fabricated pseudo-ID;
- `T2-000..T2-012` as a range target;
- a table-review workflow record as a semantic endpoint.

#### `notation-definition`

Example:

- an equation-bearing claim using `q` points to the claim or exact locus that
  defines `q`.

Counterexample:

- equation layout recovery or cell alignment is Slice 6.

#### `continuation-context`

Example:

- a claim beginning "As part of the configuration begun in ..." points to
  the prior current unit.

Counterexample:

- an identity successor is lineage, not continuation.

#### `parallel-contrast-context`

Example:

- a second illustrative example introduced by "Or, consider ..." points to
  the first example as a discourse comparison anchor after fresh review.

Counterexamples:

- same-claim equivalence or partial overlap;
- independent corroboration merely because two examples repeat a theme.

## 11. Source and target kind rules

### 11.1 Sources

Slice 4 v1 sources are only:

- `CC`; or
- `PKT`.

`CC` is the only legal source for `semantic-prerequisite`.

`PKT` is legal for context, formal-reference, and discourse relations where
the relation is source-bound before or independently of claim normalization.

An exact source locus is not a v1 source endpoint. If source material must act
as a relation subject, it must first have a durable `PKT` or `CC` identity
under the existing extraction contract. This keeps one durable source unit
responsible for every relation row.

### 11.2 Targets

Targets are:

- `CC`;
- `PKT`;
- `source-locus`; or
- `null`.

A direct `SRC-*` target is forbidden because it is too coarse. A source may
contain many unrelated passages.

A `source-locus` target requires:

- an existing frozen `SRC-*` manifest row;
- the source's declared `md-lines` scheme;
- a canonical `L<start>-L<end>` locator;
- exact reopening of those lines; and
- a matching SHA-256 span hash under Decision 0003's locator contract.

Unsupported or layout-dependent target structures are not silently
reconstructed. If the exact text locus cannot be established, use a typed
null and preserve Slice 6's boundary.

The following are not legal endpoints:

- raw prose;
- ID plus prose in one cell;
- `SRC-*` without a locator/hash;
- `FORMAL:*` pseudo-IDs;
- table-review workflow records;
- ranges such as `T2-000..T2-012`;
- `G-*`, `LIN-*`, `REL-*`, `REF-*`, or `VER-*`; or
- an external fact or identifier absent from the frozen corpus.

### 11.3 Durable endpoint existence

Concrete `CC` and `PKT` endpoints must:

- resolve through exactly one canonical durable definition surface;
- have the matching unit kind;
- have admitted/readable durable status under the 1.4 row contract; and
- be lineage-current at S4 closure.

Historical units may appear in retained review evidence or
`basis_packet_ids`. They may not be current relation endpoints.

## 12. Typed null and explicit absence

### 12.1 Unresolved target

`record_state = unresolved-target` means:

- a relation of the recorded family/type is judged to exist; and
- no legal current durable target or exact source locus can be selected from
  the frozen corpus.

Allowed `null_reason` values are:

- `unresolved-in-frozen-corpus`;
- `outside-frozen-corpus`; or
- `target-not-materialized`.

`outside-frozen-corpus` records only that the relation points beyond the
frozen corpus. It does not invent the external target or authorize research.
Any S8 external-referent need remains a separate `REF-*` record.

### 12.2 Explicitly absent relation

`record_state = explicitly-absent` means:

- a bounded producer/reviewer question asked whether the named source has a
  relation of one concrete family/type; and
- the fresh review found no such target in the declared frozen basis.

Its only v1 `null_reason` is:

`bounded-review-found-none`

It does not mean:

- the source has no relations of any kind;
- the full corpus is semantically complete;
- future authority can never identify a relation; or
- a missing row is equivalent to absence.

Slice 4 does not require an exhaustive source x subtype absence matrix.
Mandatory review coverage, if later justified, belongs to Slice 7.

### 12.3 Indeterminate

`record_state = indeterminate` means the bounded review could not determine
whether the relation exists, which family/subtype applies, or what the source
material structurally establishes.

Allowed `null_reason` values are:

- `insufficient-frozen-context`;
- `conflicting-durable-representations`; or
- `unsupported-source-structure`.

`family` and `type` retain concrete values when known. `none` is allowed only
for the level that cannot be determined.

An indeterminate row is not an edge and creates no automatic propagation.

### 12.4 Not applicable

`not-applicable` is a reviewer-return outcome, not a canonical `REL-*` state.
It means the reviewed family/type does not apply to the proposed source or
question. The reviewer receipt remains inspectable, but the orchestrator does
not create a relation or absence row.

### 12.5 Missing record

No canonical row means only:

> no canonical Slice 4 record was written.

It does not mean explicit absence, not applicable, or semantic completeness.

## 13. Provenance and optional authority reference

### 13.1 Source-bound basis

Every relation record has nonempty `basis_packet_ids`.

Those packet IDs identify the frozen source-bound material reviewed for the
relation judgment. They are evidence of the judgment basis, not proof that the
relation is semantically correct.

Historical packet IDs may remain in this provenance set because provenance is
inspectable history, not a current endpoint.

No free-prose target or external fact may be smuggled into
`basis_packet_ids`.

### 13.2 Producer and reviewer receipts

`proposed_by` records either `human:<actor-slug>` or
`invocation:<producer-invocation-id>`.

`reviewed_by` records one existing `VER-*` verdict produced from fresh
context. The producer and reviewer references must differ. Structural
difference does not by itself prove context isolation; retained adapter
dispatch receipts remain the process evidence.

### 13.3 Optional authority reference

`authority_ref` has the smallest legitimate Slice 4 meaning:

- `none`; or
- an exact reference
  `manifest-signoff:relation:REL-NNNN`.

The non-`none` form requires a run-manifest authority sign-off whose gate cell
is exactly `relation:REL-NNNN`.

That sign-off means only:

> the human authority explicitly reviewed or established this relation record.

It does not:

- adopt this architecture proposal;
- accept the run;
- resolve an external fact;
- make an adapter sanctioned;
- change relation currentness;
- create correction closure; or
- confer evidence support.

Human sign-off is optional for an ordinary reviewed relation row unless an
existing authority gate separately requires it.

## 14. Lineage interaction and endpoint currentness

Slice 4 depends on Slice 3.

### 14.1 New canonical relation endpoints

At S4 closure:

- every source `CC`/`PKT` must be lineage-current;
- every concrete target `CC`/`PKT` must be lineage-current;
- a source-locus target must exactly reopen frozen bytes; and
- no endpoint may name a historical predecessor.

No `current:` or `historical:` selector is encoded in an ID. Currentness is
derived from the adopted lineage ledger.

### 14.2 Terminalization during S2-S4

If a proposed relation endpoint is terminalized during S2-S4:

1. the proposal remains inspectable in its worker/reviewer record;
2. it is not copied into the canonical relation ledger;
3. no automatic successor substitution occurs;
4. a producer/reviewer must assess the successor explicitly; and
5. any canonical row must name the current successor directly.

The checker may detect a canonical historical endpoint. It may not decide
which successor is semantically correct.

### 14.3 After S4

If a relation or endpoint problem is discovered after S4:

- the run blocks before canonical relation mutation;
- the existing canonical bytes remain readable;
- no relation is rewritten;
- no descendant becomes automatically `STALE` or `INVALIDATED`;
- no lineage or relation is automatically propagated; and
- broader correction handling remains deferred to the adopted correction
  architecture and later implementation authority.

### 14.4 Historical relation records

Slice 4 v1 has no relation supersession mechanism, so it does not manufacture
a same-run relation-history graph.

Canonical rows remain immutable and inspectable. A future adopted correction
format may make a prior relation historical, but that is LATER and must not be
anticipated through hidden v1 fields.

## 15. Cycle policy

One blanket cycle rule is rejected.

The checker evaluates cycle policy by subtype-specific directed subgraphs:

| Subgraph | Mechanical policy | Reason |
|---|---|---|
| `semantic-prerequisite` | acyclic | a strict proposition-prerequisite loop cannot establish an order of prerequisite use |
| `antecedent-context` | acyclic | an antecedent chain cannot close on itself without leaving the antecedent unresolved |
| all `formal-reference` edges | acyclic | reference/definition-only loops do not establish a reachable anchor |
| `continuation-context` | acyclic | a continuation chain must have an earlier anchor |
| `parallel-contrast-context` | acyclic | v1 records directional discourse anchoring, not a symmetric undirected relation |
| `qualifier-context` | cycles permitted | two current units may mutually qualify a bounded interpretation |
| `configuration-context` | cycles permitted | separately stated configuration units may be mutually required for interpretation |

All self-edges are forbidden, including on cycle-permitted subtypes.

A mixed cycle is structurally permitted when it contains a cycle-permitted
context edge and no prohibited subtype-only subgraph itself cycles.

This permits structures analogous to:

- notation use `C-088 -> C-089` plus configuration context
  `C-089 -> C-088`; and
- formal anchor `T1-006 -> C-107` plus qualifier context
  `C-107 -> T1-006`.

Permission is structural only. A fresh semantic reviewer must still justify
why the mutual context is real and not a circular attempt to manufacture
support.

The checker detects strongly connected components in each prohibited
subgraph. It does not decide whether a permitted context cycle is semantically
good.

## 16. Parallel relations and conflict rules

Multiple asserted rows from one source are legal when they have:

- distinct targets; or
- distinct subtypes that represent genuinely separate roles.

An exact duplicate semantic tuple is forbidden:

```text
(family, type, source_kind, source_id, target_kind, concrete target)
```

Different `REL-*` IDs do not make identical tuples distinct.

For one `(source, family, type)` scope:

- multiple concrete asserted targets may be legal;
- at most one typed-null row may exist;
- `explicitly-absent` conflicts with any asserted or unresolved row;
- `indeterminate` conflicts with canonical asserted closure unless the
  indeterminate record concerns a different concrete subtype; and
- relation multiplicity never counts as corroboration or independent support.

## 17. Stage ownership

### S2 - packets and exact source material

S2 may propose:

- packet-level antecedent context;
- packet-level qualifier/configuration context;
- exact formal/header anchors; and
- packet-level discourse relations.

S2 does not create claim dependencies because claims do not yet exist.

### S3 - neutral claim normalization

S3 may propose:

- `semantic-prerequisite` between claims;
- claim-level source context;
- claim-level formal reference; and
- claim-level discourse relation.

The normalizer must not strengthen context into support.

### S4 - duplicate mapping and relation closure

S4 remains the duplicate/merge barrier. Duplicate and overlap judgments stay
in the merge map and lineage.

Fresh relation reviewers challenge the accumulated S2/S3 proposals against
the lineage-current inventory. The orchestrator then writes the one canonical
relation table.

S4 may identify and review a missing relation. It may not create a
`duplicate` or `overlap` relation subtype.

### S5 - disposition

S5 consumes relations as context for disposition judgment. It does not rewrite
them and does not infer disposition mechanically from them.

### S6 - evidence roles

S6 independently types `CC x SRC` evidence roles. It may use relation records
as challenge context, but no relation family is translated into
load-bearing/corroborative support.

### S7/S8 - clustering and routing

S7/S8 may consume the current relation graph for structural features and
route propagation. They do not silently amend S2-S4 relation semantics.

An outside-corpus typed null may motivate an S8 `REF-*` need. The `REF-*`
record remains separate and does not rewrite the relation.

### S9 - adversarial testing

S9 fresh reviewers may find:

- missing relations;
- wrong types or targets;
- context converted into support;
- qualifier loss; or
- unjustified permitted cycles.

They return findings. They do not write the canonical relation ledger.
A finding requiring relation correction invokes the fail-closed correction
boundary.

## 18. Producer, reviewer, and orchestrator contract

### 18.1 Producer

A producer may return:

- one or more fully typed proposed relation records;
- a typed unresolved-target proposal;
- a type-specific explicit-absence proposal;
- an indeterminate proposal; or
- `not-applicable`.

The producer must include:

- current candidate source identity;
- proposed family/subtype;
- typed target or typed null;
- packet-bounded source basis;
- owner stage; and
- a concise rationale in the worker return.

Rationale is review evidence. It is not a canonical endpoint field.

### 18.2 Fresh-context semantic reviewer

The reviewer receives:

- the proposed row;
- the relation schema;
- the source unit and its packet evidence;
- only the bounded current-unit summaries needed to test candidate targets;
- relevant exact source loci;
- the lineage-current inventory; and
- no SRC-001 answer key, final link density, or external facts.

The reviewer must challenge at least:

- missing required relation;
- over-broad relation;
- wrong family or subtype;
- wrong source;
- wrong target;
- relation that converts context into independent evidence;
- relation that loses a qualifier or antecedent;
- unjustified permitted cycle;
- prose target where a durable typed target exists; and
- invented target outside the frozen corpus.

The reviewer uses the existing verifier verdict vocabulary:

- `upheld`;
- `refuted`; or
- `cannot-determine`.

A `refuted` verdict names exactly one recommended action:

- `revise`, with a complete replacement proposal;
- `reject`; or
- `not-applicable`.

The reviewer may also return issue codes for each named challenge.

The reviewer never writes a canonical ledger.

### 18.3 Orchestrator

The orchestrator:

- remains the only canonical writer;
- verifies producer/reviewer receipt binding;
- reconciles upheld/refuted/cannot-determine outcomes;
- refuses unresolved structural conflicts;
- writes exact Core-defined rows at S4 closure; and
- invokes deterministic checks.

The orchestrator does not judge its own relation proposal and does not convert
a checker PASS into semantic correctness.

## 19. Deterministic checker contract

On the exact Slice 3 implementation base, the compatible provisional surface
is:

`K2.16 - typed relation structure and current-endpoint closure`

This is not chosen merely as the next convenient number:

- K2 is the current run-directory structure, accounting, and reference layer;
- K2.15 is the adopted lineage surface on which relation endpoint currentness
  depends;
- K3 already owns evidence-role structure and must not absorb semantic
  relations; and
- no semantic truth judgment belongs in K2.

The final number must be re-proved against the exact implementation base if
the checker surface changes before authorized implementation.

### 19.1 Mechanical checks

The checker may enforce:

1. correct `relation_format` marker;
2. exactly one canonical relation table;
3. unique, well-formed `REL-*` IDs;
4. closed family and subtype vocabularies;
5. family/subtype compatibility;
6. legal source kind and source existence;
7. legal target kind and state-specific target fields;
8. concrete target existence and matching kind;
9. exact `source-locus` source/locator/hash resolution;
10. typed-null syntax and state-specific null reason;
11. owner-stage legality;
12. lineage-current durable source/target closure at S4;
13. nonempty, existing `basis_packet_ids`;
14. producer-reference grammar and producer/reviewer non-identity;
15. `reviewed_by` verdict existence;
16. optional authority-reference shape and matching manifest sign-off;
17. absence of raw prose or compound/range targets;
18. duplicate semantic tuples and conflicting typed-null scopes;
19. self-edge rules;
20. subtype-specific cycle rules;
21. no support/evidence-role enum or field on a relation row;
22. required artifact presence at/after S4 closure for 1.4;
23. no post-S4 canonical append under the retained run stage; and
24. legacy run-format isolation.

### 19.2 Semantic non-claims

The checker must not decide:

- whether a dependency is necessary;
- whether a context relation is true;
- whether a formal reference is the best interpretation;
- whether a discourse relation is missing;
- whether a permitted context cycle is justified;
- whether an external target actually exists;
- whether an explicit-absence review was semantically complete;
- whether relation multiplicity is independent evidence; or
- whether any relation should change a disposition.

A deterministic PASS proves only schema, references, currentness closure, and
encoded graph rules.

## 20. Run-format and capability recommendation

Slice 4 implementation should use:

`1.4.0-provisional`

Reason:

- Slice 4 adds a new durable canonical Core artifact;
- it adds a new required marker and schema;
- it changes S4 closure requirements;
- it changes K2 reference/currentness behavior; and
- legacy runs must not be reinterpreted.

This proposal does not perform that bump.

### 20.1 Cumulative activation

The recommended capability sequence is:

| Run format | Cumulative Core capabilities |
|---|---|
| 1.0 | legacy run contract |
| 1.1 | 1.0 + exact evidence |
| 1.2 | 1.1 + source walk |
| 1.3 | 1.2 + lineage |
| 1.4 | 1.3 + typed relations |

Future implementation should replace equality-to-current helpers with an
explicit cumulative capability registry:

```text
hasRunCapability(runFormat, capability)
```

Every supported version maps to a declared capability set. Registration of a
newer version must mechanically prove that its set is a superset of the prior
supported version unless an explicit authority decision declares a breaking
format.

This prevents a future `1.5` from accidentally disabling lineage or typed
relations.

### 20.2 Activation point

For a 1.4 run:

- relation proposals may exist in retained S2/S3 worker records;
- the canonical relation artifact becomes mandatory when S4 closes and before
  S5 begins;
- if the artifact is initialized earlier, it contains only the marker and an
  empty canonical table; any pre-closure `REL-*` row fails; and
- at S5 or later, missing marker/artifact/table fails closed.

Historical 1.0-1.3 bytes and behavior remain unchanged.

A 1.0-1.3 run containing an accidental `aleph-relations/v1` marker must not be
silently reinterpreted as 1.4. The checker should report incompatible
run-format/capability use.

## 21. Future fixture and mutation design

No fixture is created by this proposal.

One focused future 1.4 fixture should demonstrate:

- one `semantic-prerequisite`;
- one known `antecedent-context`;
- one `qualifier-context` that is explicitly non-evidentiary;
- one `configuration-context`;
- one `structural-anchor` to an exact `md-lines` locus;
- one `notation-definition`;
- one `continuation-context`;
- one `parallel-contrast-context`;
- one `unresolved-target`;
- one `explicitly-absent` relation;
- one `indeterminate` record;
- one legal mixed mutual-context cycle;
- an S4 lineage successor targeted explicitly instead of its predecessor; and
- relation multiplicity that does not alter evidence-role accounting.

### 21.1 Deterministic negative mutations

The focused mutation battery should include:

- missing source;
- missing concrete target;
- wrong source kind;
- wrong target kind;
- source/target family mismatch;
- non-current source;
- non-current target;
- relation attached to a historical lineage predecessor;
- raw prose target;
- mixed ID-plus-prose target;
- malformed typed null;
- null reason incompatible with state;
- duplicate relation ID;
- duplicate semantic tuple;
- conflicting explicit absence plus asserted edge;
- illegal self-edge;
- forbidden subtype-only cycle;
- malformed source locus;
- source-locus hash mismatch;
- relation type/endpoint mismatch;
- missing provenance;
- missing or same producer/reviewer identity;
- missing reviewer verdict;
- malformed authority reference;
- missing artifact or marker;
- duplicate canonical relation table;
- post-S4 append attempt;
- unsupported support/evidence-role enum on a relation row; and
- a 1.3 run accidentally reinterpreted as 1.4.

### 21.2 Fresh semantic-review mutations

These require semantic review even when structural checks pass:

- missing required relation;
- over-broad relation;
- wrong but structurally legal subtype;
- wrong but existing/current target;
- context falsely treated in prose or downstream reasoning as independent
  support;
- qualifier or antecedent loss;
- unjustified cycle among cycle-permitted context types;
- legal source locus aimed at the wrong semantic span;
- invented outside-corpus target disguised as a legal in-corpus target; and
- explicit-absence judgment made from incomplete context.

A structural mutation may also insert a prohibited support-like enum and fail
K2.16. That does not replace the semantic mutation where a syntactically legal
context relation is misused as support.

## 22. Core/adapter boundary and Slice 3 follow-ups

Core owns:

- relation artifact path and format;
- family/subtype semantics;
- endpoint and null rules;
- stage ownership;
- currentness and cycle policies;
- producer/reviewer contracts;
- checker behavior;
- fixture/mutation behavior; and
- run-format capability.

An adapter may only:

- dispatch the Core-defined producer/reviewer work;
- preserve fresh-context mechanics;
- validate the Core-defined return shape;
- serialize review-cleared rows through the canonical single writer;
- invoke the Core checker; and
- retain host receipts.

An adapter may not invent:

- adapter-local relation types;
- endpoint coercions;
- implicit successor rewrites;
- relation support semantics;
- cycle exceptions;
- correction propagation; or
- authority closure.

No new public command or sanctioned agent surface is created by this design.

### 22.1 F-03 compatibility

F-03 remains MUST PRESERVE:

> live LedgerWriter/orchestrator wiring is not validated end-to-end.

Any future relation implementation must use the existing canonical
single-writer architecture and prove the S4 closure path separately. This
proposal does not claim live relation enforcement.

### 22.2 F-04 compatibility

F-04 remains MUST PRESERVE:

> path/case portability remains unresolved.

The exact proposed Core path is lowercase:

`ledgers/relations.md`

Future implementation must include this path in the portability audit. This
proposal does not resolve case-folding or host-path behavior.

### 22.3 F-05 compatibility

F-05 remains MUST PRESERVE:

> the Core-mandated post-S4 lineage BLOCK exists on the same currently
> unwired LedgerWriter surface and remains tied to F-03.

The proposed relation S4 closure and post-S4 refusal must be compatible with
that retained halt behavior:

- preserve an existing unrelated halt;
- refuse mutation before bytes change;
- do not overwrite lineage's halt semantics; and
- do not claim agent-mode enforcement until the live writer/orchestrator path
  is independently validated.

No F-03/F-04/F-05 repair is authorized in Slice 4 architecture.

## 23. Correction/effective-state compatibility

The adopted correction/effective-state architecture remains controlling.

Slice 4 preserves it as follows:

- `record_state` is not the broad EFFECTIVE state;
- relation endpoint currentness is the narrower Slice 3
  `lineage-current` concept;
- no relation row receives `STALE` or `INVALIDATED`;
- no relation or descendant is automatically rewritten;
- no checkpoint or artifact revision is introduced;
- no rollback or rewind is introduced;
- no cross-run reuse is introduced;
- no post-ACCEPTED correction is introduced; and
- no hidden relation replacement field anticipates later architecture.

If a post-S4 correction would require changing a relation:

1. preserve the existing canonical bytes;
2. block the run before mutation;
3. report the unmet correction requirement;
4. do not infer downstream invalidation; and
5. wait for separately adopted correction mechanics.

If a future authority decision introduces relation correction, it must define
its own append-only identity and currentness semantics. Slice 4 v1 does not
pre-authorize them.

## 24. Explicit non-goals

This proposal excludes:

- Slice 5 full ambiguity/referent lifecycle;
- ambiguity propagation, carry, or closure;
- Slice 6 table/formal/layout extraction beyond exact `md-lines` locus
  reference;
- Slice 6 degraded-format machinery;
- Slice 7 semantic atomicity/context/qualifier/evidence-role review expansion;
- Slice 8 duplicate-versus-overlap refutation redesign;
- intent-fidelity intake;
- SRC-001 blind replay;
- SRC-002;
- post-freeze research;
- external fact resolution;
- generic `STALE`/`INVALIDATED` propagation;
- descendant invalidation;
- checkpoint or artifact revision;
- rollback or rewind;
- relation replacement or supersession;
- cross-run reuse;
- successor-run correction execution;
- post-ACCEPTED correction;
- projection changes;
- sanctioned agent execution;
- semantic validation;
- replay validation;
- acceptance;
- golden promotion;
- production readiness; and
- Aleph v1.

## 25. MUST PRESERVE and LATER implications

### 25.1 MUST PRESERVE

| ID | Finding |
|---|---|
| MP-01 | Slice 3 lineage remains the only owner of packet/claim identity change. |
| MP-02 | S5 disposition remains separate from relation type. |
| MP-03 | S6 evidence-role edges remain the only owner of load-bearing/corroborative/contradictory/contextual source roles. |
| MP-04 | Context required for interpretation never becomes independent evidence through relation multiplicity. |
| MP-05 | Frozen-corpus and external-referent boundaries remain fail closed; no outside fact or target is invented. |
| MP-06 | Historical SRC-001 representations remain contradictory/indeterminate where the evidence is contradictory/indeterminate. |
| MP-07 | SRC-001 link density is not a completeness target. |
| MP-08 | Canonical endpoints are lineage-current at S4 closure; successor targeting is explicit and never automatic. |
| MP-09 | Deterministic checking remains structural and cannot certify semantic correctness. |
| MP-10 | Producers, fresh reviewers, orchestrator single-writer mechanics, and human authority remain separate roles. |
| MP-11 | Legacy 1.0-1.3 behavior and bytes are not migrated or reinterpreted. |
| MP-12 | Core owns relation semantics; adapters remain host-mechanical. |
| MP-13 | Adopted correction/effective-state boundaries remain fail closed without generic stale/invalidation machinery. |
| MP-14 | F-03 live writer/orchestrator wiring remains unvalidated. |
| MP-15 | F-04 path/case portability remains unresolved. |
| MP-16 | F-05 post-S4 lineage BLOCK remains tied to the F-03 surface and must not be converted into an agent-mode claim. |
| MP-17 | Manual mode remains the only sanctioned execution path. |
| MP-18 | Structural implementation, checker PASS, fixture validation, replay, semantic validation, sanction, acceptance, and v1 remain separate claims. |

### 25.2 LATER

| ID | Deferred implication |
|---|---|
| L-01 | Slice 5 ambiguity/referent identification, propagation, carry, authority closure, and relation-null resolution |
| L-02 | Slice 6 table-cell/header coordinates, formal-layout binding, OCR/degraded-format states, and unsupported-layout handling |
| L-03 | Slice 7 mandatory semantic review coverage and any exhaustive explicit-absence obligations |
| L-04 | Slice 8 duplicate-versus-overlap fresh refutation redesign |
| L-05 | Generic relation correction, replacement, supersession, and currentness after correction |
| L-06 | Descendant stale/invalidation propagation and earliest-unmet-DoD resumption |
| L-07 | Checkpoint/artifact revision, rollback, rewind, cross-run reuse, and successor-run correction mechanics |
| L-08 | Post-ACCEPTED correction |
| L-09 | Intent-fidelity intake |
| L-10 | Blind SRC-001 replay and SRC-002 |
| L-11 | Post-freeze research and external fact resolution |
| L-12 | Projection changes |
| L-13 | Live adapter/orchestrator validation, agent-mode validation, and sanction |
| L-14 | Semantic validation, replay validation, acceptance, golden promotion, production readiness, and Aleph v1 |

### 25.3 Open design questions

No unresolved schema or taxonomy choice is being hidden in this proposal.

There are no items currently marked:

`OPEN DESIGN QUESTION — HUMAN/ARCHITECTURAL DECISION REQUIRED`

Human review may reject or amend any proposed choice, but that is the adoption
decision rather than an unstated design variable.

## 26. Definition of Done for a future authorized implementation

A future Slice 4 implementation is structurally complete only when all 20
items below hold:

1. an exact immutable identity of this proposal, or an exact amended
   successor, has been adopted by human authority;
2. `1.4.0-provisional`, `aleph-relations/v1`, and the cumulative capability
   registry are consistent across Core contracts and checker/model code;
3. `ledgers/relations.md` has exactly one marker and canonical table under the
   required stage/run-format conditions;
4. every `REL-*` identity, field, state, family, subtype, and endpoint matrix
   rule is mechanically enforced;
5. exact source-locus targets reopen the declared frozen `md-lines` bytes and
   hash;
6. every canonical durable endpoint is lineage-current at S4 closure;
7. a terminalized proposal endpoint is never silently retargeted and the
   focused fixture names the successor explicitly;
8. typed-null, explicit-absence, indeterminate, not-applicable, and missing-row
   semantics remain distinct;
9. source-bound provenance and producer/reviewer/optional-authority references
   are structurally valid;
10. the producer/reviewer prompts enforce the named semantic challenge set
    without exposing SRC-001 answer keys or density targets;
11. the orchestrator remains the only writer and reviewers cannot write
    canonical ledgers;
12. provisional K2.16 enforces only the named structural contract and reports
    exact failures;
13. all subtype-specific self-edge, duplicate/conflict, and cycle rules pass
    the focused positive fixture;
14. all deterministic negative mutations fail at the intended check surface;
15. semantic-review cases demonstrate that structurally legal wrong relations,
    context-as-support, qualifier loss, and unjustified permitted cycles are
    rejected outside the checker;
16. legacy 1.0-1.3 fixtures retain their exact recorded behavior and are not
    migrated or accidentally activated;
17. TypeScript source and any required generated runtime projection remain
    drift-clean;
18. Core-boundary and immutable bundle verification retain byte-identical Core
    across host targets;
19. adapter changes, if separately authorized, remain host-mechanical and
    preserve F-03/F-04/F-05 without claiming live enforcement; and
20. a fresh independent implementation audit reports no BLOCKING NOW
    violation and preserves all status limits.

A future deterministic PASS proves only the named checks. It does not confer
semantic validation, replay validation, sanction, acceptance, production
readiness, or v1.

## 27. Human-adoption requirement

This file remains a proposal until the human authority adopts an exact
repository identity of this proposal, including an exact commit/head and
proposal SHA-256 or an equally unambiguous immutable identity.

Until that adoption is persisted:

- Slice 4 implementation is unauthorized;
- no run-format bump is authorized;
- no fixture or checker change is authorized;
- no adapter or runtime change is authorized;
- no adoption record may be inferred from review; and
- no later slice may begin under this proposal.

SRC-001 remains `CLOSED_FOR_CALIBRATION`.

SRC-002 remains `NOT_AUTHORIZED`.

Manual mode remains the only sanctioned execution path unless separately
changed by authoritative evidence.

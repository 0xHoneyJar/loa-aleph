# Templates 03 — Extraction and Claims

## T3.1 Packet index → `runs/<run-id>/ledgers/packet-index.md`

```markdown
# Packet Index — ⟨RUN-slug⟩

- exact_evidence_format: aleph-exact-evidence/v1

## Packets
| packet_id | source_id | locator | span_hash | quote | criterion | status |
|-----------|-----------|---------|-----------|-------|-----------|--------|

## Exact evidence records
| evidence_key | packet_ids | evidence_state | fragment_count | join_policy | exact_evidence_hash | degraded_source_id | degraded_source_locator | degradation_reason |
|--------------|------------|----------------|----------------|-------------|---------------------|--------------------|-------------------------|--------------------|

## Ordered fragments
| fragment_key | evidence_key | packet_id | fragment_order | source_id | locator | source_relation | byte_role | fragment_hash | exact_bytes_base64 |
|--------------|--------------|-----------|----------------|-----------|---------|-----------------|-----------|---------------|--------------------|

## Evidence transformations
| transform_key | evidence_key | output_role | predecessor_exact_evidence_hash | effective_exact_evidence_hash | output_text | output_text_hash |
|---------------|--------------|-------------|---------------------------------|-------------------------------|-------------|------------------|
```

Column rules:

- `locator` uses the source's scheme from the corpus manifest (`L118-L131`,
  `M14:S2`). `span_hash` = sha256 of the exact span bytes at freeze.
- In `aleph-exact-evidence/v1`, use one packet per exact fragment. `quote` is
  a bounded display preview only and is never exact evidence. Run formats
  `1.1.0-provisional`, `1.2.0-provisional`, `1.3.0-provisional`, and
  `1.4.0-provisional`
  require this marker and the three versioned tables once S2 is reached. Historical
  `1.0.0-provisional` and pre-versioned packet ledgers without the marker
  retain their predecessor behavior and are not reinterpreted.
- `criterion`: the admission-criterion number from T2.2. A walked span that
  matched an exclusion class gets **no row** (that is the recorded
  two-level boundary); a span refused by a classifier gets a row with
  `criterion = refusal-blocked` so completeness accounting still balances.
- `status`: predecessor formats retain `active` |
  `superseded-by:PKT-xxxx` | `retracted:⟨reason⟩`. In run format 1.3 and later,
  durable PKT/CC rows use `active`; unit identity currentness is derived from
  T3.3a lineage instead of encoded in the status cell.
- `evidence_state`: `exact` | `degraded-non-exact`. Every packet appears in
  exactly one `exact` evidence record. A degraded record uses `packet_ids =
  none`, `fragment_count = 0`, `join_policy = not-applicable`,
  `exact_evidence_hash = none`, an existing `degraded_source_id`, a locator
  under that source's declared scheme, and a nonempty reason. Exact records
  use `none` for both degraded provenance fields.
- `join_policy`: `single-fragment` (exactly one);
  `adjacent-fragments` (two or more consecutive `md-lines` fragments in one
  source); `separate-fragments` (two or more ordered fragments kept visibly
  separate). No policy inserts hidden bytes.
- Every fragment has a positive explicit order, a source and packet binding,
  `source_relation = frozen-source`, `byte_role = exact-source-bytes`, the
  fragment SHA-256, and canonical base64 of the exact located bytes. Version
  1 supports exact reopening only for `md-lines`; unsupported locator schemes
  use `degraded-non-exact` until a separately reviewed verifier exists.
- `exact_evidence_hash` is SHA-256 over UTF-8
  `aleph-exact-evidence/v1` plus NUL followed, in declared order, by each
  fragment encoded as an unsigned 64-bit big-endian byte length plus its exact
  bytes. Length framing preserves boundaries without silently joining source
  text.
- A transformation's `output_role` is `rendered` or `normalized`; its output
  text has its own UTF-8 SHA-256. For exact evidence, both predecessor and
  effective exact-evidence hashes equal the evidence record hash. A
  transformation records mechanical identity, not semantic adequacy.
- A degraded transformation is rendered and explicitly non-exact. Its source
  binding does not prove the rendering matches inaccessible bytes, OCR,
  layout, or source meaning, and it cannot support a packet as exact evidence.

<!-- example -->
| PKT-0007 | SRC-101 | L5-L8 | sha256:aa10… | "Gating appears to improve member retention: members who must hold to stay in tend to stick around longer…" | 1 | active |

## T3.2 Source walk → `runs/<run-id>/ledgers/source-walk.md`

```markdown
# Source Walk Ledger — ⟨RUN-slug⟩

- source_walk_format: aleph-source-walk/v1
- source_position_format: zero-based-utf8-byte-half-open/v1

## Primary walk intervals
| walk_id | source_id | start_byte | end_byte | outcome | packet_ids | criterion_ref | producer_invocation_id | closure_state | reason | closure_note |
|---------|-----------|------------|----------|---------|------------|---------------|------------------------|---------------|--------|--------------|

## Extraction events
| event_id | source_id | start_byte | end_byte | shared_position_key | event_ordinal | packet_id | origin | producer_invocation_id | status |
|----------|-----------|------------|----------|---------------------|---------------|-----------|--------|------------------------|--------|

## Resume cursors
| cursor_id | source_id | byte_offset | shared_position_key | next_event_ordinal | predecessor_walk_id | predecessor_event_id | source_hash | reason |
|-----------|-----------|-------------|---------------------|--------------------|---------------------|----------------------|-------------|--------|

## Fresh gap reviews
| gap_review_id | source_id | producer_invocation_id | reviewer_invocation_id | review_basis_cursor_id | review_basis_digest | result | candidate_start_byte | candidate_end_byte | proposed_packet_id | reconciliation_event_id | status | note |
|---------------|-----------|------------------------|------------------------|------------------------|---------------------|--------|----------------------|--------------------|--------------------|-------------------------|--------|------|

## Per-source completion
| source_id | source_hash | source_length_bytes | final_cursor_id | gap_review_ids | completion_state | declared_by | note |
|-----------|-------------|---------------------|-----------------|----------------|------------------|-------------|------|
```

Column rules:

- Coordinates are zero-based absolute offsets into the exact frozen UTF-8
  bytes. Intervals are half-open `[start_byte, end_byte)`, may not split a
  UTF-8 code point, and partition each completed source from byte `0` through
  its exact byte length without holes or overlaps.
- Primary outcomes are `admitted`, `no-candidate-observed`, `excluded`,
  `deferred`, or `unsupported`. Admitted intervals use
  `admission:<criterion-number>` and packet IDs; excluded intervals use
  `exclusion:<class>`. Other outcomes use `none`.
- `deferred` is `open` or `resolved`; both require a reason, and `resolved`
  also requires a closure note. `unsupported` remains `open` in this format
  and blocks completion.
- Extraction events bind packets to exact source positions. Events at the
  same position share one `SP-<digits>` key and use unique contiguous
  ordinals. Primary intervals never overlap; only exact same-position event
  rows may share coordinates. Each event interval must be contained in exactly
  one mechanically mapped exact fragment for its packet; a packet with an
  unmappable locator cannot satisfy the 1.2 exact-position contract.
- A cursor is an actual checkpoint naming the **next unprocessed** source
  position or event. A pause after one same-position event stays at that byte
  position and names the next ordinal; uninterrupted siblings need no
  intermediate cursor. Source-end means no bytes remain structurally
  unwalked, not that semantic recall is perfect. `reason` is exactly
  `initial`, `progress`, `bounded-pause`, `resumed-shared-position`, or
  `source-complete`.
- Gap-review results are `no-gap-candidate-found`, `gap-candidate-found`, or
  `cannot-determine`. The reviewer invocation must differ from the primary
  producer. Every row binds the terminal primary source-end cursor and a
  recomputable digest of the frozen source, exact S1 criteria bytes, ordered
  primary walk/events, primary packet exact-evidence identities, and that
  cursor. A found candidate is `open` with both future canonical IDs set to
  `none`; after single-writer reconciliation it is `reconciled` with one
  committed event whose interval equals the candidate and is contained in the
  proposed packet's exact fragment. Same-position reconciliation uses the next
  contiguous event ordinal without rewriting primary walk/cursor history.
  `cannot-determine` blocks completion.
- `completion_state = complete` requires full interval coverage, a source-end
  cursor, no open interval or event, at least one distinct gap review, and no
  open or indeterminate gap result. A blocked row's final cursor must be the
  current frontier, not a stale historical checkpoint. This is procedural
  closure only.

## T3.3 Claim inventory → `runs/<run-id>/ledgers/claim-inventory.md`

```markdown
# Candidate-Claim Inventory — ⟨RUN-slug⟩
| claim_id | normalized claim | packets | sources | claim_type | disposition | rationale | judged_by | verified | status |
|----------|------------------|---------|---------|-----------|-------------|-----------|-----------|----------|--------|
```

Column rules:

- `packets`: comma-joined `PKT-…` (≥1). `sources`: derived union of those
  packets' `SRC-…` — kept denormalized because Précis §4 renders from it.
- `normalized claim` is semantic restatement, never an exact-evidence field.
  Normalization must leave every cited packet's exact fragment records and
  predecessor/effective exact-evidence hashes unchanged.
- `claim_type` (provisional set, Q5): `factual` | `design-intent` |
  `constraint` | `preference` | `open-question`.
- `disposition`: exactly one of the seven (`carried`, `merged`, `deferred`,
  `excluded-with-reason`, `backgrounded`, `judged-non-load-bearing`,
  `unresolved`); blank only between S3 and S5.
- `rationale`: one line, mandatory for every disposition except plainly
  `carried`; for `excluded-with-reason` it IS the reason and must also map to
  a negative boundary when scope-based.
- `judged_by`: worker/actor id. `verified`: blank | `VER-…` refs.
- **Précis §4 rendering:** exactly `claim_id | normalized claim | source(s) |
  disposition`. Predecessor formats retain their active-row rule; 1.3 and later render
  lineage-current claims only.

<!-- example -->
| CC-104 | Token gating is associated with improved member retention/engagement | PKT-0007, PKT-0031, PKT-0064 | SRC-101, SRC-102, SRC-104 | factual | merged | canonical retention claim; absorbs CC-113, CC-114 | normalizer-judge | VER-0032 | active |

## T3.3a Unit lineage → `runs/<run-id>/ledgers/lineage.md`

```markdown
# Unit Lineage — ⟨RUN-slug⟩

- lineage_format: aleph-lineage/v1

| lineage_id | owner_stage | type | predecessors | successors | basis | established_by |
|------------|-------------|------|--------------|------------|-------|----------------|
```

Rules for run format 1.3 and later: `LIN-NNNN` is unique; owner stage is S2-S4; type
is exactly split/merge/replace/supersede/duplicate/reject/exclude/no-claim;
cardinality follows the artifact contract; `none` is used only when the event
has zero successors. Packet-to-claim ancestry remains claim provenance.
Lineage is append-only and predecessors are never rewritten or resurrected.

## T3.3b Typed relations → `runs/<run-id>/ledgers/relations.md`

```markdown
# Typed Relations — ⟨RUN-slug⟩

- relation_format: aleph-relations/v1

| relation_id | owner_stage | family | type | source_kind | source_id | target_kind | target_id | target_source_id | target_locator | target_span_hash | record_state | null_reason | basis_packet_ids | proposed_by | review_subject_digest | reviewed_by |
|-------------|-------------|--------|------|-------------|-----------|-------------|-----------|------------------|----------------|------------------|--------------|-------------|------------------|-------------|-----------------------|-------------|
```

Rules for run format 1.4:

- This exact 17-column table is the sole canonical relation table. IDs are
  unique `REL-NNNN`. Do not add scheme, append-time, status, authority,
  correction, replacement, supersession, version, support, or evidence-role
  fields.
- Families/types are closed: `claim-dependency /
  semantic-prerequisite`; `source-context / antecedent-context |
  qualifier-context | configuration-context`; `formal-reference /
  structural-anchor | notation-definition`; `discourse /
  continuation-context | parallel-contrast-context`.
- Sources are current `CC` or `PKT`. Asserted targets are current `CC`/`PKT`
  or an exact `source-locus`; other states use `target_kind = null` and
  `none` in every target-value field. A source locus derives its scheme from
  `target_source_id`'s frozen manifest row and must reopen/hash exactly.
- `record_state` is `asserted`, `unresolved-target`, `explicitly-absent`, or
  `indeterminate`. `not-applicable` remains a review-only outcome and creates
  no row. Concrete subtype, family-level, and taxonomy-level indeterminate
  scopes remain distinct.
- `basis_packet_ids` is a nonempty ordered comma list. `proposed_by` is
  `human:<actor-slug>` or `invocation:<producer-invocation-id>`.
- `review_subject_digest` hashes the fixed-order compact JSON
  `aleph-relation-review-subject/v1` subject containing all 14 pre-review
  fields from `owner_stage` through `proposed_by`, with packet IDs as an
  ordered array. `reviewed_by` names one existing `upheld` verdict targeted
  exactly to `relation-review-subject:<digest>`.
- Canonical rows are written only at S4 closure after lineage currentness is
  established. Before closure the artifact is absent or marker plus empty
  table; after closure/S5 it is read-only.
- A relation never asserts support or changes S6 evidence-role accounting.

## T3.4 Disposition ledger → `runs/<run-id>/ledgers/disposition-ledger.md`

```markdown
# Disposition Ledger — ⟨RUN-slug⟩
| disposition | count | claim_ids |
|-------------|-------|-----------|
| carried | ⟨n⟩ | ⟨…⟩ |
| merged | ⟨n⟩ | ⟨…⟩ |
| deferred | ⟨n⟩ | ⟨…⟩ |
| excluded-with-reason | ⟨n⟩ | ⟨…⟩ |
| backgrounded | ⟨n⟩ | ⟨…⟩ |
| judged-non-load-bearing | ⟨n⟩ | ⟨…⟩ |
| unresolved | ⟨n⟩ | ⟨…⟩ |
| **total** | **⟨n⟩** | all candidate claims accounted for |
```

Rules: recomputed (never hand-edited) after any inventory change; all seven
rows always present even at count 0 — a zero row is information. Predecessor
formats retain active-row totals; in 1.3 and later total equals the lineage-current claim
count.

## T3.5 Merge map → `runs/<run-id>/ledgers/merge-map.md`

```markdown
# Duplicate / Merge Map — ⟨RUN-slug⟩
| canonical | absorbs | basis | provenance retained | corroboration | status |
|-----------|---------|-------|--------------------|--------------| -------|
```

Rules: `provenance retained` lists the union source set and must be a
superset of every absorbed claim's sources (the C8 invariant); `corroboration`
= `independent` (distinct origins genuinely agree) | `restatement` (same
origin echoed) — feeds evidence roles; contradictory claims never appear
here — a contradiction discovered during merging is recorded in the run log
and both claims go/stay `unresolved`.

<!-- example -->
| CC-104 | CC-113, CC-114 | same underlying retention claim, three wordings | SRC-101 + SRC-102 + SRC-104 | independent | active |

### 1.3+ merge-map rule

For run format 1.3 and later, `canonical` is a newly materialized successor CC and
`absorbs` lists its lineage predecessors. The same predecessor/successor set
must appear in one `merge` or `duplicate` lineage event. Absorbed historical
claims do not receive an S5 `merged` disposition merely because they were
terminalized structurally.

## T3.6 Representation use receipts — run format 1.6

The following numbered contract defines 1.6 material use. Section 6–10
references resolve to T2.3 in `02-corpus-intake.md`. Existing packet, lineage,
relation, and ambiguity contracts retain their ownership.

## 11. Evidence, claims, relations, and use receipts (future T3.6)

### 11.1 Preserve Slice 1

Every packet still has exactly one exact evidence record and a mechanically
reopened `md-lines` fragment. Existing length-framed evidence hashing and join
policies are unchanged. Ordered discontiguous OBJ bindings never become an
unrecorded single string. Use separate-fragments in packet evidence where
applicable; any visible joining belongs in a rendered transformation.

For a used SRC binding, its byte interval must be covered by the packet basis
where that use asserts evidence, not merely by a nearby source ID. A complete
line packet can cover several cell substrings; an empty cell has a valid
zero-length position within that packet interval. AST bytes alone never
materialize an exact packet or satisfy CC packet provenance.

### 11.2 Canonical use table

```text
| use_id | owner_stage | subject_kind | subject_id | basis_packet_ids | requirements | use_state | fidelity_claim | limitation_refs | reason | established_by | review_subject_digest | reviewed_by |
```

- Subject kinds: `PKT`, `CC`, `REL`, or `OBJ`. Owner stage respectively S2,
  S3/S4, S4, or S2/S3/S4.
- Exactly one receipt per canonical PKT/CC/REL; append in the same transaction
  as its subject. OBJ receipts preserve failed candidates/limitations without
  manufacturing a packet, claim, or relation; multiple distinct OBJ receipts
  are permitted and remain historical.
- Basis is an ordered unique list of existing exact PKTs, nonempty except OBJ limitation
  receipts. PKT basis is exactly itself. CC basis exactly equals its packet
  provenance in its ledger order. REL basis exactly equals its existing
  `basis_packet_ids`, including order. This overrides default set sorting and
  preserves the adopted relation review subject.
- `requirements` is a nonempty ordered JSON array of objects with keys
  `object_id`, `feature`, `binding_ids` in that order. No duplicate tuple.
  Binding IDs are an ordered subset of that OBJ's bindings; empty is permitted
  for a missing feature or a coordinate/association-only requirement.
- Feature enum: `text-bytes`, `table-grid`, `header-association`,
  `caption-association`, `formal-structure`, `image`, `chart-values`,
  `spatial-region`.
- `use_state`: `usable` or literal `CANNOT_DETERMINE`.
- `fidelity_claim`: `none`, `exact-representation`, or `gold`. Gold is a
  recognized forbidden assertion, always rejected in this format; no golden
  adoption surface is created.
- Limitation refs: set of REP/OBJ/ASC IDs from the used sources; reason is none
  for usable, nonempty for CANNOT_DETERMINE, whose limitation refs are nonempty.
- Established-by retains existing human/producer-invocation reference syntax;
  it does not confer authority. No repair of A4-16 is implied.

Default-text receipts require text-bytes with the source's default text OBJ.
Its whole-file BND identifies the carrier; for PKT/CC/REL the usable bytes are
exactly its intersection with that receipt's packet-basis intervals, never the
whole file as additional evidence. This is the sole whole-file-binding
exception. For imported objects, selected SRC BND intervals must instead lie
within the exact packet-basis union. A requirement needing
the whole table/header/caption must obtain the necessary packets; no implicit
context imports.

Non-text structures can be inspected as bounded context using supplied
objects/ASTs from the same source. This does not turn their bytes into packet
evidence. Every requirement must belong to a basis source (OBJ-only missing
candidates use their subject's source). Structure evidence drawn from an AST
must be identified as rendering/export context, and cannot claim
exact-representation fidelity.

### 11.3 Mechanical availability predicate

One Core predicate evaluates requirements without reading claim meaning:

| Feature | Available only when |
|---|---|
| text-bytes | Selected nonempty BND list reopens textual bytes. It may be a degraded formal object's exact retained text. Empty text bytes are still a declared value. |
| table-grid | OBJ is table, grid_state available, and section 7 grid checks pass. |
| header-association | OBJ is cell, its ASC is available, and every named header has available bound bytes. |
| caption-association | OBJ is table/formal/figure, its ASC is available, and every caption has available bound bytes. |
| formal-structure | OBJ is formal, structure_state available, notation source-markup or renderer-export, and its bindings or structure IDs reopen supplied structure. Flattened-text can never satisfy it. |
| image | OBJ is available image with image bytes; this proves presence, not worker vision capability. |
| chart-values | OBJ is chart-values with textual machine-readable binding, or figure with available values_state and nonempty available values IDs. No image-only binding. |
| spatial-region | OBJ is region with valid non-null supplied page/space/box. |

A well-formed request for a feature absent from that object is **unavailable**,
not grounds to synthesize the feature. References to nonexistent IDs, wrong
binding owners, or malformed tuples are structural failures.
If any requirement is unavailable, use_state must be CANNOT_DETERMINE.
All available requirements permit usable but do not require it: semantic
insufficiency or worker modality limits may still produce CANNOT_DETERMINE.
Thus deterministic availability is not entailment or semantic PASS.

Exact-representation requires usable, available named objects and ancestors,
all named features available, SRC-only binding closure, original-capture
origin, and no relevant degraded/unsupported/indeterminate association.
Rendering/export contexts cannot meet it. Packet exactness remains separately
valid even when this stronger representation claim fails.

CANNOT_DETERMINE receipts remain non-affirmative OBJ candidates; canonical
CC/REL rows require usable receipts. This does not forbid a limited claim such
as “the capture contains this flattened text”: its declared requirement is
text-bytes only, its fidelity claim none, and fresh review tests that it does
not assert the missing equation. Existing unresolved/indeterminate REL rows
may likewise have usable receipts for recording a typed-null judgment; this
does not declare their target available.

Each CANNOT_DETERMINE blocks that proposed use, not unrelated work. It never
waives an existing stage DoD: an indeterminate S2 gap review still blocks S2,
and a packet with neither a valid claim nor permitted no-claim closure still
blocks S3 under lineage rules. A later narrower usable candidate does not
erase the failed interpretation or its limitation. No automatic
complete/resolved flag is generated for a missing feature.

### 11.4 Exact review and existing relations

Use review-subject digest is SHA-256 over UTF-8 compact fixed-order JSON:
`format = aleph-representation-use-subject/v1`,
`representation_inventory_hash`, followed by the use's fields from
`owner_stage` through `established_by` in table order (list/requirement cells
as JSON values), then `subject`, then `packet_evidence_hashes`.
The latter is the ordered array of each basis packet's full exact-evidence
hash, including repeated evidence hashes when packets share one evidence
record. `subject` is the following immutable projection in listed key order:

- PKT: `source_id`, `locator`, `span_hash`, `criterion`;
- CC: `normalized_claim`, `packets`, `sources`, `claim_type`;
- REL: the existing `aleph-relation-review-subject/v1` subject object;
- OBJ: `object_id`, `representation_inventory_hash`.

Packets/sources in the CC projection are ordered arrays in canonical ledger
order. No later disposition or preview belongs in this digest.
The writer reserves canonical subject IDs before review and verifies that the
written projection equals the reviewed one. Reservation alone is not a durable
claim or relation. Exclude USE ID and review fields.
`reviewed_by` is none or one existing VER with exact target
`representation-use-subject:<digest>`. Changing a subject requires new review,
never reusing a verdict over different bytes.

Before a canonical CC/REL use with any non-text feature or AST binding is written, require
one fresh L2F upheld verdict for that exact subject. Text-only uses retain the
existing stage's review coverage; no Slice 7 universal atomicity review is
introduced. PKT capture receipts and OBJ limitations may have reviewed_by none.
An L2F cannot-determine verdict cannot authorize an affirmative CC/REL write.

REL taxonomy, its 17 columns, review digest, endpoint kinds, and immutable C1
boundary remain unchanged. A table/header target still resolves through
existing exact PKT/CC/source-locus evidence, with the use receipt refining the
declared material consulted. For an asserted source-locus use, selected target
SRC bindings must lie inside its exact reopened target span; acquire packets
for any additional evidence basis. OBJ IDs are not new REL endpoints.
Unavailable targets retain the existing typed-null contract. A material
receipt never supplies support, relation meaning, disposition, or authority.

Slice 3 alone owns PKT/CC successors. New successor receipts are explicit;
old receipts remain historical and are not retargeted. Merge/duplicate packet
provenance union remains required. No automatic inheritance of requirements,
loss of predecessor limitations, or new lineage type is allowed.
S5 ambiguity and OQ-01 consume this material only as bounded source context;
they do not select missing headers, formal readings, or chart values. Their
canonical relation set and reviewed authority basis remain immutable.

Existing post-S0 T3.1 rendered previews and normalized transformations remain
separate worker outputs with their existing output hashes. They are not newly
admitted ingestion ASTs, cannot add structure to the frozen inventory, and
cannot satisfy an unavailable feature. This distinction prevents ordinary
normalization from becoming an illicit post-freeze rendering pipeline.

### 11.5 Downstream visibility without invented claims

The existing unresolved-queue table remains CC-only. Its rows for an actual
unresolved/deferred claim name applicable USE/OBJ/ASC limitations in the
existing blocking/evidence field. Never insert an OBJ as a claim or fabricate
an open-question claim merely to fit that queue.

For 1.6 at ASSEMBLED and later, add this exact table inside the existing
Précis section 17 (do not change the v0 section headings):

```text
| limitation_ref | source_id | representation_state | reason |
```

The rows are the union of every non-available REP/OBJ/ASC and every
CANNOT_DETERMINE USE, unique and ASCII-sorted by limitation_ref. Source ID is
the owning REP's SRC; a USE naming several source limitations gets one row per
source, sorted by source_id after limitation_ref. USE state is the literal
CANNOT_DETERMINE; other states use section 8. Copy the recorded reason
losslessly with existing Markdown escaping. The key is
`limitation_ref + source_id`. Empty population retains the empty table.
K2.18 compares the table to that declared union. This is structural accounting,
not a judgment about importance, resolution, or acceptance.

The compiler produces this summary from retained artifacts without modifying
the sealed uses ledger. It preserves object-only failed candidates as known
incompleteness even when no claim was materialized. Projection consumers retain
the Précis limitations under their existing acceptance/trace doctrine; Slice 6
does not redesign projection formats or deterministically infer propagation.

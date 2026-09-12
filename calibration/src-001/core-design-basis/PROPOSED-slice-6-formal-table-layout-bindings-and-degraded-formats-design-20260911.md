# Slice 6 — Formal / Table / Layout Bindings and Degraded Formats

Date: 2026-09-11

Status: PROPOSED — HUMAN AUTHORITY ADOPTION REQUIRED

Decision class: bounded Core design proposal; repository administration

Producer: Codex

Repository: `0xHoneyJar/loa-aleph`

Verified canonical starting commit: `41fe5cf001d7264a073af3832def3de740fd5f9f`

Verified starting tree: `b5a55f290b14a63380957bab327278375a0a6b53`

Branch: `agent/slice-06-formal-layout-design-20260911`

Starting worktree: clean, including nonignored untracked paths

Primary future owner: Core ingestion / artifact / checker owner

Proposed future run format: `1.6.0-provisional`

Proposed cumulative capability: `formal-layout-bindings`

Proposed deterministic surface: `K2.18 — source representation bindings`

## 1. Authority and present effect

This file proposes the bounded implementation contract below. None of its new
formats, fields, predicates, prompt instructions, or stage requirements is
active merely because this file exists. It creates no adoption record or
implementation authorization. A later implementation session needs an exact
adopted proposal identity and explicit implementation authority.

The starting commit is the PR #51 merge, with parents
`7944964393aab98416772f6a37be967d9ffdece2` and
`f60d0a118e0f0f2b105b05923adbdc8ebbbb79f2`. Its tree equals the latter
parent's tree. Local Git ancestry, branch, tree, cleanliness, and origin were
checked before authoring. A read-only GitHub query confirmed repository
`0xHoneyJar/loa-aleph`, PR #51 `merged = true`, and this merge SHA.

The final PR #51 review, ID `5181630768`, binds that second parent and tree,
records `READY_FOR_SLICE_5_IMPLEMENTATION_MERGE_WITH_FINDINGS`, independently
closes S5A4-01, and retains the findings in section 3. Older producer status
paragraphs in the PR body and implementation reconciliations describe their
dated subjects; their historical draft/unmerged wording is not the current
merge state. This proposal does not rewrite any of them.

“Slice 6” here means calibration implementation Slice 6, not pipeline stage S6
(evidence roles), or the older front-door roadmap's Slice 6.

### 1.1 Authority consulted

Paths are repository-relative and were resolved on the starting commit.
Adoption records bind their identified proposal bytes; summaries and
implementation records do not replace those bytes. When several basenames
follow one directory below, they are all in that directory.

| Authority / inspected surface | Governing proposition |
|---|---|
| `AGENTS.md`; `README.md`; `docs/architecture/13-build-handoff.md` | Builder scope, independent audit, manual-only sanction, status distinctions, frozen accepted fixtures |
| `docs/decisions/0001-projection-as-separate-downstream-stage.md`; `0002-routing-as-per-cluster-not-global-stance.md` | Neutral Précis, separate projection, per-cluster routing |
| `docs/decisions/0003-architecture-build-kit-implementation.md` | Structural / semantic / authority separation; exact `md-lines`; provisional formats |
| `docs/decisions/0004-core-adapter-and-bundle-boundary.md`; `core.manifest.json` | One Core, explicit inventory, host mechanics, immutable execution pins |
| `calibration/src-001/core-design-basis/README.md`; `ADOPTED-architecture-decision.md`; `PROPOSED-architecture-decision.md` | Adopted calibration direction; design preparation is not implementation |
| `calibration/src-001/core-design-basis/SRC-001-implementation-slice-plan-20260813.md` | Bounded Slice 6 purpose, prerequisites, evidence, non-goals |
| `calibration/src-001/core-design-basis/SRC-001-independent-calibration-delta-architecture-decision-20260813.md`; `SRC-001-calibration-delta-correction-addendum-20260813.md` | Narrowed DC-09 and SL-06; extraction defects; non-gold formal degradation |
| `calibration/src-001/core-design-basis/ADOPTED-correction-and-effective-state-decision-20260815.md` | Immutable history, frozen source, no general correction or accepted-run reopening |
| `calibration/src-001/core-design-basis/ADOPTED-slice-3-unified-lineage-design-20260822.md`; its identified `PROPOSED-slice-3-unified-lineage-design-20260822.md` | PKT/CC identity, lineage-currentness, direct provenance closure, late BLOCK |
| `calibration/src-001/core-design-basis/ADOPTED-slice-4-typed-relations-design-20260828.md`; its identified `PROPOSED-slice-4-typed-relations-design-20260828.md` | Closed non-evidentiary relation taxonomy, exact source loci, S4 write window, deferred layout ownership |
| `calibration/src-001/core-design-basis/ADOPTED-slice-5-internal-ambiguity-and-referent-lifecycle-design-20260901.md`; its identified `PROPOSED-slice-5-internal-ambiguity-and-referent-lifecycle-design-20260830.md` | Immutable T5.1/T5.2 subjects, C1/C2/C3, explicit relation carry |
| `calibration/src-001/core-design-basis/ADOPTED-oq-01-human-procedural-authority-and-stage-interaction-doctrine-20260902.md`; its identified `PROPOSED-oq-01-human-procedural-authority-and-stage-interaction-doctrine-20260901.md` | Human procedure cannot create source meaning; MP01–MP08 remain binding |
| `calibration/src-001/core-design-basis/AUTHORIZED-slice-5-implementation-20260903.md`; `docs/architecture/15-slice-5-implementation-reconciliation.md`; `16-slice-5-implementation-repair-reconciliation.md`; `17-slice-5-successor-repair-reconciliation.md` | Historical implementation scope and producer evidence, not Slice 6 authority |
| `docs/architecture/02-system-architecture.md`; `03-artifact-contracts.md`; `04-pipeline-stages-and-dod.md` | Canonical run files, corpus freeze, stage contracts |
| `docs/architecture/templates/01-run-control.md`; `02-corpus-intake.md`; `03-extraction-claims.md`; `07-verification.md`; `09-internal-ambiguity.md` | Current manifest, evidence, walk, relation, verdict, and ambiguity shapes |
| `docs/architecture/prompts/README.md`; `workers-intake-extraction.md`; `verifier-lenses.md`; `orchestrator.md`; `workers-internal-ambiguity.md` | Verbatim pinned prompts, typed returns, legal context, single writer |
| `docs/architecture/checker-spec/README.md`; `K1-K2-fixtures-and-runs.md`; `docs/PRECIS-CONFORMANCE-CHECKER.md` | Read-only fail-closed checking and mutation protocol |
| `scripts/lib/run-model.ts`; `check-helpers.ts`; `checks-k2.ts`; `lineage.ts`; `relations.ts`; `checks-k2-relations.ts`; `internal-ambiguity.ts`; `checks-k2-ambiguities.ts`; `worker-return-contract.ts` | Capability activation, byte reopening, parsing, review and lifecycle contracts |
| `scripts/test-conformance-mutations.ts`; `scripts/test-worker-return-contract.ts`; `scripts/validate-core-boundary.ts` | Real CLI mutation / contract / inventory validation |
| `adapter-protocol/runner-capability-contract.md`; `adapters/loa/src/intake.ts`; `ledger-writer.ts`; `worker-bundle.ts`; `run-control.ts`; `types.ts` | Current UTF-8 intake, persistence, worker and resume mechanics |
| `packaging/build-runtime-js.ts`; `packaging/test-runtime-js.ts`; `runtime-js/`; `package.json`; `.github/workflows/ci.yml` | Generated ES2022 projection, build Node floor, installed Node 20, required checks |

Where current docs enumerate an older subset of cumulative formats, the
explicit registry in `run-model.ts` and subsequent adopted contracts govern.
This design requires coordinated 1.6 wording, not retroactive changes to adopted
snapshots.

## 2. Decision and calibration trace

Use one Core representation inventory, frozen with the source corpus, and one
append-only ledger of declared uses. Keep existing exact packet/evidence/claim
and relation contracts. Coordinates refine where supplied material is without
adding table semantics to a checker.

The inventory records what ingestion supplied and what it could not supply.
It is an input artifact, not a model-generated reconstruction. Worker uses name
immutable objects and features required to interpret them. Missing required
features produce visible limitations and `CANNOT_DETERMINE`.

| Calibration evidence | Bounded response |
|---|---|
| 20 table/caption omissions | Explicit inventories and associations, visible to source-order gap review |
| Three discontiguous final units | Ordered reopenable bindings; no implicit concatenation or spatial sorting |
| Four glyph/formal/spacing defects | Separate original-capture and rendered hashes; no glyph, LF, whitespace, or Unicode normalization in exact fields |
| C-029 flattened equation | Exact captured text can coexist with degraded formal structure; prohibit reconstruction and gold promotion |
| DC-09 | Validate declared coordinates, targets, hashes, provenance, states, and exactness claims only |
| Narrowed SL-06 | Ingestion exposes material; fresh workers interpret it and identify insufficiency |

Counts motivate fixtures, not extraction quotas. No historical table header,
cell value, equation, expected claim ID, or answer-key result belongs in generic
Core code or prompts. Historical C-029 remains unchanged: valid retained
degraded evidence is not a gold formal rendering.

## 3. Preserved findings and non-goals

| Finding | Disposition in this slice |
|---|---|
| F-03 | MUST PRESERVE: canonical accepted-worker-return → LedgerWriter / orchestrator production reachability remains unproven. New helper or fixture process tests do not close it. |
| F-04 | MUST PRESERVE: path/case/platform portability remains unresolved. Narrow path validation is not a portability proof. |
| F-05 | MUST PRESERVE: late-correction / lineage production enforcement remains bounded by F-03. |
| S5A4-02 | DEFERRED: K2.6/K2.7 activation through any recognized structured S5 event is not repaired. |
| S5A4-03 | DEFERRED: the existing ad-hoc S3 exit recognizer is not repaired. |
| S5A2-03 / S5-A-03 | DEFERRED: no generic resume-time full validation or broader review-subject invariant closure is claimed. Slice 6 validates only its new material closure. |
| Other adopted MUST PRESERVE / LATER findings | Retained unless separately disposed by authority; proximity to a changed file is not disposition. |

Explicit non-goals:

- no general PDF, OCR, vision, or document-rendering engine;
- no deterministic table, header, cell-support, equation, or chart semantics;
- no inferred chart values, axes, scales, series, or pixel-to-value conversion;
- no equation reconstruction or invented reading order;
- no SRC-001-specific table shapes, headers, values, or formal reconstruction;
- no new support relation family, relation retargeting, or graph walk;
- no broad worker/model-provider or launcher abstraction/refactor;
- no Slice 7 atomicity/qualifier redesign or Slice 8 duplicate-review work;
- no generic correction, revision, rollback, invalidation, cross-run reuse, or
  post-ACCEPTED reopening;
- no new human semantic decision gate or expansion of OQ-01;
- no replay, replay validation, semantic validation, sanction, production
  readiness, golden declaration, or v1.

Manual mode remains the only sanctioned execution path. Loa remains
structurally implemented, unvalidated, and unsanctioned; Hermes remains planned.

## 4. Version and stage activation

Register `1.6.0-provisional` with cumulative `formal-layout-bindings` after
all existing 1.0–1.5 capabilities. Add `usesFormalLayoutBindings()` through the
existing registry, never equality with `CURRENT_RUN_FORMAT_VERSION`.
Retain the existing exact-evidence, source-walk, lineage, relation, and ambiguity
format versions.

New canonical artifacts:

1. `corpus/representations.md`, marker
   `source_representation_format: aleph-source-representation/v1`;
2. `corpus/representation-assets/AST-NNNN.<ext>`, only inventoried immutable
   capture/provenance/rendering bytes;
3. `ledgers/representation-uses.md`, marker
   `representation_use_format: aleph-representation-use/v1`.

Markdown tables remain canonical in both modes. Compact JSON cells are used
only for specified ordered lists and typed coordinates. Optional machine twins
cannot become a second authority.

| Stage | Required behavior in 1.6 |
|---|---|
| DRAFT / S0 preparation | Validate all present inventory records; incomplete preparation is not frozen input. |
| S0 freeze / CORPUS-FROZEN | One REP per admitted SRC; assets, declarations, provenance, and states complete and sealed, including plain text. Bind the inventory digest in the run manifest. |
| S1 | Criteria remain prior to extraction. Unsupported extraction surfaces are unmet prerequisites, not invented exclusions. |
| S2 entry | Require sealed inventory and uses ledger. Only supported text extraction enters S2; opaque-only sources block under section 10. |
| S2 | Persist one PKT use receipt with each packet; retain Slice 1 evidence, limitations, and fresh gap review. |
| S3 | Persist one use receipt per new claim. Missing required structure cannot produce an affirmative normalized claim. |
| S4-C1 | Persist one use receipt per canonical relation before the existing C1 marker. No change to C1/C2/C3 order. |
| S4-C2 and later | Inventory and canonical use receipts are read-only. Defects stop affected DoDs; no same-run source repair or representation upgrade. |
| S10–S13 | Carry claim-linked limitations through the existing queue and all material limitations through the section 11.5 summary; acceptance remains independently gated. |

Add one `representation_inventory_hash` bullet in the run manifest's Corpus
binding section, required at CORPUS-FROZEN and later: SHA-256 of sealed
`corpus/representations.md` bytes. It complements, not redefines, `corpus_hash`.

Reserved Slice 6 markers/artifacts on an older run fail under the future K2.18;
old checker binaries retain their historical behavior. Unknown run versions
fail. Missing fields never select legacy fallback for a 1.6 run.

## 5. Common grammar and byte authority

### 5.1 Identifiers and serialization

New run-local ID families: `REP`, `AST`, `RPR`, `OBJ`, `BND`, `ASC`, `USE`.
Each is exactly its uppercase prefix, `-`, and at least four decimal digits,
with at least one nonzero digit. IDs are unique per family, case-sensitive,
and whitespace-free. They are opaque names: never infer order or meaning from
their numbers. Existing ID and evidence-key grammars remain unchanged.

Require exactly one of each canonical table below, exact headers, no duplicate
definitions, and no additional columns. Scalar absence is literal `none`;
empty lists are `[]`. Lists are compact JSON arrays without duplicate members.
Set-valued ID lists sort by ASCII byte order; explicitly ordered lists preserve
their sequence. Canonical JSON cells have the listed key order, UTF-8 encoding,
no insignificant whitespace, and no duplicate/unknown keys. Compare to the
Core serializer; do not silently normalize noncanonical cells.

Integers use `0` or a nonzero leading digit followed by digits, are safe
integers, and reject signs, fractions, exponents, whitespace, and negative zero.
Positive fields reject zero. JSON numeric fields have the same lexical rule.
Hashes are `sha256:` plus 64 lowercase hex digits. Base64 is standard padded
canonical base64, checked by decode/re-encode. Exact text never comes from a
Markdown preview cell.

### 5.2 Three different claims

1. **Capture identity:** frozen SRC/AST bytes equal the admitted capture.
2. **Representation availability:** that capture supplies the declared text,
   grid, formal structure, or image.
3. **Semantic adequacy:** supplied material supports a particular reading.

None implies the next. Text export can be byte-exact to its frozen SRC but
degraded relative to its upstream document. Its exact packet is not an exact
equation rendering. SRC bytes remain authoritative for Slice 1 fragments.
Different rendered/extracted output has separate AST bytes, hash, and
provenance; it never overwrites SRC or packet exact fields.

An extracted text file may itself be admitted as SRC at S0. Its bytes are then
packet authority for that extracted capture only; its origin declaration must
remain visible. No Unicode/newline/glyph/whitespace normalization, CSV
unquoting, entity decoding, or equation repair is implicit. For example,
literal source `&amp;` and rendered `&` have separate byte identities.

## 6. Frozen representation inventory (future T2.3)

These six tables belong in `corpus/representations.md`. During implementation,
specify them in `templates/02-corpus-intake.md`; no second authoritative schema
lives in the adapter.

### 6.1 Representations

```text
| representation_id | source_id | origin_kind | extraction_surface | state | reason | provenance_id |
```

Exactly one REP per admitted SRC, each referencing one capture RPR.

- `origin_kind`: `original-capture`, `supplied-extraction`, `unknown-origin`.
  A filename does not prove original origin. Unannotated text defaults to
  unknown-origin without losing byte equality to its capture.
- `extraction_surface`: `utf8-text` or `opaque`.
- `utf8-text` requires strict UTF-8 and existing manifest scheme `md-lines`.
- `opaque` means bytes exist but the shipped textual walk cannot consume them.
  Its manifest scheme is `opaque-bytes`, an inventory scheme only, never an
  exact-packet or asserted REL endpoint scheme.
- `state` and `reason` follow section 8. A degraded REP can contain available
  exact text: its state describes the overall representation.

Every REP has one root OBJ, kind source, binding its complete SRC. Empty
captures have a zero-length root binding. Material not declared by ingestion
is not invented by an extractor.

### 6.2 Assets

```text
| asset_id | representation_id | role | locus | media_type | encoding | byte_length | content_hash |
```

Roles: `upstream-capture`, `structure-export`, `rendered-text`,
`rendered-image`, `render-log`. Locus is exactly
`corpus/representation-assets/<asset_id>.<ext>`; extension is 1–12 lowercase
ASCII alphanumerics, default `bin`. Paths are run-relative regular files,
without symlinks, traversal, backslashes, external URLs, or special files.
Assets are inventoried one-to-one with files, owned by one REP, with verified
length and whole-file hash. `media_type` is a nonempty retained declaration,
not proof of a supported decoder. Encoding is `utf8` or `opaque`.
Structure-export, rendered-text, and render-log require strict UTF-8; rendered
images require opaque. Upstream captures declare either. No encoding is guessed
from media type or filename.

Upstream binary assets associated with an admitted text capture are retained
provenance, not additional SRC rows or independent evidence. They cannot be
counted as walked merely because the text was walked. Section 10 governs an
opaque SRC that is itself in extraction scope.

### 6.3 Provenance

```text
| provenance_id | representation_id | type | actor | tool | tool_version | input_refs | output_refs | parameters_asset_id | declaration_asset_id |
```

Types and requirements:

| Type | Contract |
|---|---|
| `capture` | Actor nonempty; copying tool/version nonempty (`manual-copy` / `1` permitted); input refs empty; outputs its SRC plus any retained upstream-capture ASTs; parameters/declaration assets `none` except the imported ID-map rule in section 10. |
| `supplied-structure` | Input includes SRC; output includes a structure-export AST; declaration asset is that AST; parameters asset `none`. Tool/version describe the supplied export producer, or both literal `unknown`. |
| `supplied-rendering` | Inputs include SRC and retained upstream ASTs actually named by the receipt; output names rendered ASTs and retained metadata ASTs. Parameters and declaration each reference a render-log AST; they may be the same asset. Tool/version nonempty and exact, or both `unknown`. |

Input/output arrays are sets of same-REP SRC/AST IDs. Every AST is output by
exactly one RPR. No output is its own input; asset derivation is acyclic.
Capture alone has no input. Metadata describing rendering is retained output,
not a claim that Aleph ran the renderer.

Rendered bytes may exist with explicitly unknown renderer identity/settings,
but original-layout fidelity then remains indeterminate/degraded. A retained
receipt saying “unknown” differs from an absent receipt, which fails structure.
Hashes establish provenance-record identity, not producer honesty or publisher
authenticity. No model may manufacture missing provenance.

### 6.4 Exact byte bindings

```text
| binding_id | representation_id | carrier_id | start_byte | end_byte | page_id | region_id | byte_role | fragment_hash | exact_bytes_base64 |
```

Carrier is the REP's SRC or AST. Offsets are zero-based, half-open:
`0 <= start <= end <= carrier length`. Strict UTF-8 text carriers cannot be
split inside a code point. Opaque carriers use byte bounds without text
decoding. Whole-carrier hash, sliced bytes, fragment hash, and base64 must agree.
`byte_role` is `frozen-source-bytes` for SRC and `retained-asset-bytes` for AST.
SRC encoding follows extraction_surface; AST encoding is explicit.
Page/region IDs are supplied same-REP objects of the corresponding kind or
literal none. They locate this fragment, including fragments of a table spanning
several pages. Where both exist, the region's declared page must agree.

Known empty cells can bind zero bytes with SHA-256 of empty bytes and literal
`""` (empty JSON string) in the base64 cell. This is the only empty-base64
spelling; other base64 cells contain their raw token. Unknown cells have no
binding and non-available state; they never become known empty values.

BND does not replace Slice 1 FRG. It can name an exact substring inside a
complete-line packet, including individual cells sharing one line. No new
positive packet locator scheme is introduced.

### 6.5 Objects

```text
| object_id | representation_id | kind | parent_id | state | reason | provenance_id | binding_ids | content_hash | coordinates |
```

Binding IDs are ordered same-REP BNDs. If nonempty, content hash is SHA-256 over
UTF-8 `aleph-material-fragments/v1` plus NUL, then each binding's bytes in
declared order, prefixed by its unsigned 64-bit big-endian length. This mirrors
Slice 1 boundary preservation with a distinct domain. Empty list means hash
`none`. No spatial sorting, implicit concatenation, or inserted bytes.

Closed kinds and coordinate cells (all keys required, fixed order):

| Kind | Coordinate shape | Legal parent |
|---|---|---|
| `source` | `{}` | none; one per REP |
| `page` | `{"index":1,"label":null,"space":null}` | source |
| `region` | `{"page_id":null,"box":null}` | source or page |
| `text` | `{}` | source, page, region, cell, header, caption, formal, figure |
| `table` | `{"row_ids":[],"column_ids":[],"grid_state":"indeterminate"}` | source, page, region |
| `row` | `{"index":1}` | table |
| `column` | `{"index":1}` | table |
| `cell` | `{"row_ids":[],"column_ids":[]}` | table |
| `header` | `{"cell_ids":[]}` | table |
| `caption` | `{}` | source, page, region |
| `formal` | `{"notation":"unknown","structure_ids":[],"structure_state":"indeterminate"}` | source, page, region, cell, caption |
| `figure` | `{"figure_kind":"unknown","image_ids":[],"values_ids":[],"values_state":"indeterminate"}` | source, page, region, cell, caption |
| `image` | `{}` | source, page, region, figure |
| `chart-values` | `{}` | figure |

Examples specify types, not parser-inserted defaults. `notation` is
`source-markup`, `renderer-export`, `flattened-text`, or `unknown`.
Structure IDs name same-REP text objects containing supplied markup/export,
not a mathematical AST constructed by Aleph. Image/value IDs name same-REP
image/chart-values objects. These lists are ordered. Figure kind is the supplied
classification `figure`, `chart`, or `unknown`; no classifier infers it.

Parentage is acyclic, typed, within one REP. Non-root objects require provenance
of their supplied declaration. Only root source and one text child spanning a
plain UTF-8 capture may be defaulted mechanically from a capture receipt.
Capture alone cannot justify tables, formal objects, figures, or associations.

Available text/cell/header/caption/formal/image/chart-values leaves require
at least one binding. Containers require a binding or bound descendants;
row/column identity can instead reopen through the supplying structure export.
Non-available objects can retain partial or no bindings: the declaration and
root source still reopen the limitation.

An available image binds opaque SRC or image AST bytes. Chart-values binds
textual machine-readable source/export bytes; image bytes alone are never a
values binding. Grid/structure/values states use section 8 independently of byte
presence. Non-available feature state forces non-available containing-object
state. Thus a degraded figure can contain an available image, and degraded
formal material can retain exact flattened text.

### 6.6 Associations

```text
| association_id | representation_id | kind | subject_id | target_ids | state | reason | provenance_id |
```

- `header-for`: subject cell; targets header objects in the same table.
- `caption-for`: subject table/formal/figure; targets captions in the same REP.
- `available`: nonempty declared targets of correct kind/scope.
- `degraded`: empty or partially supplied targets with reason.
- `unsupported`: empty targets and explicit unsupported-feature reason.
- `indeterminate`: empty targets or explicitly supplied candidate targets.
  Candidates do not become selected associations.

Each cell has exactly one header-for row; each table/formal/figure has one
caption-for row. Multiple headers/captions belong in its ordered target list.
Explicit source absence uses degraded state with reason
`source-declares-absent`; this records unavailability, not a source defect.
Provenance is mandatory, including for absence/candidate declarations.

## 7. Coordinates

Page OBJ index is the positive supplied page ordinal, unique per REP. Sparse
indices are legal for partial captures. Printed label is a supplied string or
null and never resolves identity. Do not fill missing pages.

Page space is null or exactly
`{"unit":"pixel","width":100,"height":100,"origin":"top-left"}`:
positive integer dimensions, actually supplied by the source/export.
Only integer pixel geometry is supported. Other units, rotated geometry, or
floating coordinate systems remain in raw export bytes; usable space is null
with a limitation. No coordinate conversion or inferred page size.

Region page ID is null or a page in the same REP; a page parent must match it.
Box is null or `{"x0":0,"y0":0,"x1":1,"y1":1}`, requiring a declared page
space and `0 <= x0 < x1 <= width`, `0 <= y0 < y1 <= height`.
Null means unavailable, never page zero or a whole-page fallback. Non-spatial
regions remain useful. Objects inherit location from parentage; a BND can add
an explicit fragment location where no ancestor fixes it. Reject a BND that
contradicts a fixed ancestor page/region. Effective page is explicit BND page,
otherwise its explicit region's page, otherwise the ancestor page, otherwise
unavailable. A cross-page table therefore has a source parent and individually
located fragment BNDs; do not fabricate one common page.
Overlapping boxes are not inherently invalid and do not determine semantics.

Table row/column lists contain every declared row/column child once, in
increasing index order. Available grids have positive contiguous dimensions;
degraded grids may have explicit gaps. Each positioned cell names nonempty
contiguous subsequences of both lists. Their Cartesian product is its span.
A 2×3 spanning cell is one value occupying six positions, not six copies.
Cells cannot overlap. An available grid covers every position exactly once,
including declared empty cells. Missing cells force degraded grid state.

An unpositioned cell has both coordinate lists empty and indeterminate or
unsupported state. One populated and one empty axis is rejected in v1; partial
raw declarations remain retained in the export. No guessed coordinate or `?`.

A header's cell list names same-table cells it occupies, or is empty for a
separately supplied header outside the grid. Where cells are declared, their
binding intervals must cover the header's bindings on the same carriers.
Multiple header levels are ordered header targets; Core invents no hierarchy.
Captions may be shared only through explicit supplied associations. Proximity
never creates an association.

A swapped cell inconsistent with its retained declaration, an out-of-range
coordinate, or a coordinate collision fails structure. A semantically shifted
cell with internally consistent declarations, hashes, and provenance may pass.
Fresh review owns that adversary.

## 8. States and transitions

| State | Meaning | Reason |
|---|---|---|
| `available` | Named capture/declaration supplies the feature and required bindings. Available as that representation, not certified original meaning or gold. | `none` |
| `degraded` | Some material survives, but known loss/absence prevents claiming the complete feature. Exact retained text may still exist. | Nonempty, naming loss/absence |
| `unsupported` | Format/mechanism has no supported representation of this feature; no fabricated positive structure. | Nonempty, naming unsupported feature/format |
| `indeterminate` | Records cannot establish whether/how the feature exists, or supplied declarations conflict. | Nonempty, naming uncertainty |

No inferred default, gold state, or reconstructed-exact state exists. Honest
non-available records can pass structural validation while blocking a use.
Unsupported top-level extraction surface cannot claim REP available.

These states are immutable capture facts, not a general revision lifecycle:

| Operation on a captured identity | Legal? |
|---|---|
| Read/retry identical bytes, state, and hash | Yes, idempotently |
| Any state → different state | No |
| Degraded/unsupported/indeterminate → available, including renamed replacement in the same run | No |
| Newly discover a limitation in an available capture | Record blocking anomaly; do not rewrite historical state |

Before canonical capture, incomplete preparation may be replaced outside the
canonical inventory. Once captured, corrected exports/new renderings require a
successor run with new frozen identity. A second REP for the same SRC cannot
evade the rule. This bounded non-migration policy avoids general revision and
correction machinery.

The checker compares retained state and frozen digest. It cannot prove a
temporal history if an attacker replaces every seal along with the evidence;
retained execution identity, writer guards, and process tests own that boundary.

## 9. Formal and visual material

| Supplied material | Canonical treatment |
|---|---|
| Exact source markup for a formula | Bind source bytes; notation source-markup. Structure can be available as literal supplied markup, without mathematical parsing or equivalence claims. |
| Additional renderer structure | Separate ASTs/RPR; structure IDs name supplied export text. Available as renderer output, never substituted for source bytes. |
| Flattened equation text | Preserve exact captured text bindings; notation flattened-text; structure state degraded; no inferred fractions, superscripts, subscripts, operators, grouping, or reading order. |
| Unavailable formal structure | Preserve declaration/root provenance with indeterminate or degraded state and no invented structure IDs. |
| Unsupported formal format | Unsupported structure state, explicit format/reason, retained raw bytes if supplied. |
| Image-only chart | Available image binding if bytes exist; figure values state unsupported when no machine-readable values mechanism exists, otherwise degraded/indeterminate as actually declared. Empty values IDs. |
| Supplied chart values | Separate chart-values object binding literal textual source/export bytes. No interpolation, numerical parsing, axis inference, or reconciliation with pixels. |
| Figure with no chart semantics | Figure still records empty values IDs and unsupported values state with reason source-declares-absent. This does not assert the image is a chart. |

A flattened text claim can quote what that capture literally contains. It
cannot assert the recovered equation. If formal structure is necessary for
the proposed conclusion, the worker returns `CANNOT_DETERMINE` and names the
missing feature. C-029 is a calibration motivation, never a reconstruction
target or a generic prompt example.

An image can be reopened by identity without being semantically consumable by
the current worker path. Its presence never authorizes vision/OCR, invented
chart values, or a source interpretation unavailable from the supplied bytes.
No inference from ASCII positioning or visual alignment is implicit either.

## 10. Bounded ingestion and usable Loa path

### 10.1 Default text

Keep current raw UTF-8 input behavior and `md-lines` packets. A plain text
capture receives its capture RPR, one REP, root source OBJ, one text OBJ, and
one whole-file BND shared by those objects. State available means its text
capture is available; it does not assert that no table/formal material exists.
The same rule applies to currently accepted `.csv`, `.tsv`, `.json`, etc.
No new CSV/Markdown/JSON table extractor is inferred from file extension.

If a worker discovers apparently required but undeclared structure, it names
that missing feature on the source/text object and returns CANNOT_DETERMINE.
It cannot convert prose recognition into an ingestion declaration.

### 10.2 Supplied representation export

Add only one explicit interchange route, consumed by unchanged public
`/loa-aleph start <inputs...>`: a file with suffix
`.aleph-representation.json` and exact format
`aleph-supplied-representation/v1`. Ordinary JSON remains ordinary source text.
A reserved-suffix file with a missing/unknown format fails; no fallback.
The Core parser, not the adapter, owns this route's schema:

```text
{
  "format": "aleph-supplied-representation/v1",
  "source_path": "<relative path>",
  "origin_kind": "<section 6 enum>",
  "extraction_surface": "<section 6 enum>",
  "state": "<section 8 enum>",
  "reason": "<string or literal none>",
  "assets": [],
  "provenance": [],
  "bindings": [],
  "objects": [],
  "associations": []
}
```

Every array element has exactly the corresponding section 6 table keys in that
order, with these input-only differences:

- omit `representation_id` everywhere; the descriptor describes one REP;
- SRC references use reserved string `source`;
- assets replace `locus` with `input_path` at the same key position;
- list/coordinate values are JSON values, not Markdown-escaped strings;
- zero-length binding base64 is the empty JSON string;
- descriptor-local RPR/AST/BND/OBJ/ASC IDs obey the same grammars.

The importer adds the capture RPR and REP. The descriptor must supply one root
source OBJ; its provenance token is reserved `capture`, rewritten to that RPR.
Other objects/associations reference their declared RPRs. Capture RPR is not
in the input provenance array. RPR output refs may include reserved
`declaration`, meaning the raw descriptor file retained as a structure-export
AST. Exactly one supplied-structure RPR must output `declaration`; its
declaration asset ref is also `declaration`. This provides a reopenable origin
for declarations without requiring a self-hash inside the descriptor.

Stable input capture must verify every supplied source/asset hash and every
BND slice before canonical materialization. The raw descriptor is retained
unchanged. K2.18 re-parses it and compares all imported structural fields,
states, associations, and binding coordinates after applying the ID map;
rewriting an object coordinate and recomputing only the Markdown digest cannot
pass. The parser does not prove that the external export correctly interpreted
the original document.

ID allocation is deterministic bookkeeping: preserve existing source ordering;
for each assigned SRC, allocate one REP and capture RPR, then descriptor AST,
then each remaining family in ASCII order of descriptor-local ID, using the
next unused numeric ID in that family padded to at least four digits. Store
the exact mapping as a compact JSON object in the capture's retained render-log
asset only for an imported export. This asset is an additional capture output.
The capture row also outputs all upstream-capture ASTs, so those imported
assets must not be outputs of a supplied-structure/rendering RPR. Mapping keys,
in order, are `format`, `source_id`, `representation_id`, `capture_id`,
`declaration_asset_id`, `id_map`; format is `aleph-representation-id-map/v1`.
`id_map` contains local ID to canonical ID pairs sorted by local ID. K2.18
requires a bijection, proper families, and no unexplained imported rows.
Default text needs no mapping asset.

For an imported capture, name that map via capture
`declaration_asset_id`; its parameters asset remains none. The map is metadata,
not original source evidence. Its own AST ID is allocated immediately after
the descriptor AST and is not in the local ID map. The descriptor is already
retained independently, so the map does not assert a renderer run.

`source_path` and asset input paths are regular files beneath the descriptor's
directory, using normalized relative paths without symlinks/traversal.
They are the descriptor's explicit input closure; no network or ambient fetch.
Directory intake inventories descriptors first and consumes their members once,
then handles other ordinary inputs in existing order. Two descriptors claiming
one member, or a member separately selected as another source, fail as duplicate
selection; no silent deduplication or double evidence.

This imports existing supplied bytes/structure. It does not run a converter,
invent a renderer, or let a semantic worker author the descriptor. An operator
can supply an upstream export but must not label an interpretation they wrote
as source-provided structure. Fresh review challenges that distinction.

### 10.3 Unsupported inputs

Raw extensions outside current intake support still return an explicit
unsupported-input error identifying the input. Do not silently drop them or
auto-convert them. A supplied descriptor can retain such an input as an opaque
SRC, with `opaque-bytes` locator `B<start>-B<end>` for bounded inventory
reopening only. The root spans the whole file, including zero-length captures.

An opaque SRC can be canonically recorded in DRAFT/CORPUS-FROZEN with truthful
unsupported extraction state. It cannot enter DISTILLING/S2 in this slice.
K2.18 reports `UNSUPPORTED_EXTRACTION_SURFACE` on attempted progression;
the existing UTF-8 source-walk contract is not weakened or generalized.
Use an existing S0 authority exclusion before freeze if appropriate, preserving
the input/exclusion record, or start a successor run with a supplied text export.
Do not infer that the text is equivalent to the original.

This intentionally permits a structurally valid retained unsupported capture
while refusing an unsupported execution. It also permits a supported text SRC
with an upstream image/PDF AST for provenance. The latter is not a claim that
Aleph extracted all content from that binary asset.

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

## 12. Checker contract

Implement one Core module for representation parsing, binding resolution,
availability, use-subject serialization, and pre-write plans, reused by the
checker and host. A small dedicated K2.18 check module may call it. No adapter
semantic regex, duplicate enum registry, or parallel availability predicate.

The CLI retains existing `--root`, `--run`, `--json`, report shape, read-only
behavior, and failure exit policy. Emit K2.18 failure messages with a stable
reason token plus file, row/ID, and exact offending field. Do not call a model,
decoder, renderer, network service, or subprocess from the deterministic check.

| Token | Structural contract |
|---|---|
| `FORMAT` | Cumulative activation, exact markers/tables/fields, no legacy injection, known version |
| `IDENTITY` | Closed identifier grammar, unique definitions, correctly typed same-run references |
| `INVENTORY` | One REP/SRC; file closure; expected root; correct imported ID mapping and raw-declaration projection |
| `CAPTURE_HASH` | SRC/AST whole-file hash/length, inventory seal, exact bytes, safe paths |
| `BINDING` | Byte bounds, text boundaries, role, base64, fragment hash, ordered object hash |
| `COORDINATE` | Pages/regions/boxes; table axes; typed children; spans/coverage/collisions; no fabricated coordinates |
| `ASSOCIATION` | Required association rows; declared target existence/kind/scope; missing/candidate states explicit |
| `PROVENANCE` | RPR type/required fields, assets, declared input/output closure, acyclic derivation, imported structure correspondence |
| `STATE` | Allowed state/reason matrix; explicit missing feature; frozen-state agreement; no hidden upgrade |
| `UNDECLARED_FEATURE` | Missing/malformed use requirements, nonexistent binding/object target, or a usable receipt requiring an unavailable feature |
| `FIDELITY` | Invalid exact-representation assertion; any gold assertion; rendered/opaque substitutions for exact packet evidence |
| `USE_CLOSURE` | PKT/CC/REL receipts, correct basis, packet containment, subject projection/digest, required exact upheld review, exact section 17 limitation union at ASSEMBLED+ |
| `UNSUPPORTED_EXTRACTION_SURFACE` | Opaque SRC with attempted S2 entry or any later canonical extraction artifact |
| `FROZEN_WRITE` | Present retained declaration/use closure contradicts a sealed inventory or retained C1 basis |

K2.18 structural PASS states only that declared material and uses are
well-formed, reopenable, and mechanically consistent. Honest limitations are
included in the report message, deterministically sorted by REP/OBJ/ASC ID.
They must not disappear behind an undifferentiated success message. Report
counts by state and identify CANNOT_DETERMINE use IDs.

Structural PASS does **not** establish:

- semantic header/cell association or whether a cell supports a conclusion;
- equation meaning/equivalence, visual alignment meaning, or chart accuracy;
- whether the exporter correctly described the original document;
- completeness of the worker's declared requirements or all source structure;
- fresh-context independence from a static `reviewed_by` reference;
- truth, semantic review success, progression authority, or acceptance.

Do not scan prose for chart values, equations, “gold,” or table claims and
pretend to classify their meaning. The undeclared-image-inference mutation is
mechanical when a typed use requests image-derived values without a values
binding. If an otherwise structurally valid worker hides that reliance in
prose or lies about its requirements, detection belongs to L2F/semantic review.

Existing K2.4/K2.13 positive reopening stays md-lines. K2.14 retains its UTF-8
walk and accounting. The only review-basis extension is for 1.6:
`sourceWalkReviewBasisDigest()` uses domain/format
`aleph-source-walk-review-basis/v2`, retains every existing v1 subject field and
its order, and appends `representation_inventory_hash` as the final field.
The supplied source-local representation context is therefore bound by its
frozen inventory seal. Older formats retain the exact v1 digest algorithm.
K2.15–K2.17 retain their semantic ownership and activation.
Minimal discovery/presence plumbing may be needed, but none of the deferred
recognizer or generic-resume findings is part of this check.

Canonical discovery must explicitly read the new Markdown tables and binary
asset hashes. Do not treat binary assets as UTF-8 Markdown documents, scan
encoded provenance blobs as new PKT/CC definitions, or place Core evidence in
adapter `control/` to evade checking. Existing corpus-text-as-data boundaries
remain in force.

## 13. Exact prompt and worker-return amendments

All amendments below apply only to a new 1.6 run under its pinned prompt pack.
Existing pinned bundles/returns are unchanged. Add the following common
constraint block verbatim to the Core prompt assembly rules and use it in all
roles consuming representation material:

```text
Interpret only the source bytes and source/layout/formal objects declared in
this bundle. Exact frozen-capture bytes, supplied rendering, and semantic
interpretation are different evidence roles. Never turn one into another.
Do not invent a page, region, table, header, caption, cell association, equation
structure, chart value, or reading order that ingestion did not supply.
Declare the material features your proposed use requires. Preserve every
relevant degraded, unsupported, or indeterminate limitation.
If a required feature is unavailable or this worker cannot consume its
modality, return CANNOT_DETERMINE and identify what is missing. Do not infer
chart values from images, reconstruct flattened equations, or use undeclared
alignment as evidence. A readable rendering is not an exact source claim.
```

Use the existing return spelling `cannot-determine` in verifier verdicts.
Core maps it to `CANNOT_DETERMINE` in a use/limitation receipt; it is not a
new verifier verdict, PASSED state, or human action.
For an unchanged downstream role without a material_use field, preserve its
output shape and put
`CANNOT_DETERMINE:source-representation:<existing-material-id>:<feature>`
in its existing flags array, with the missing-material reason in its existing
rationale/note field. The ID is REP/OBJ/ASC/USE and feature uses section 11.2.
Core interprets that exact flag as refusal of the affected interpretation,
requiring existing unresolved handling or a halt; the adapter does not parse
its own semantic variant. Never emit affirmative text alongside that refusal.

### 13.1 Role-specific edits

| Current file / role | Exact added duty and bundle change |
|---|---|
| `workers-intake-extraction.md` / Intake Clerk | Propose ordinary admission metadata against mechanically captured REP/RPR/AST inventory. Report missing fields; never generate ingestion objects, render receipts, or semantics. Include one-source capture facts/limits with T2.1/T2.3. |
| Same / Extractor | Retain current fragment/walk output. For each candidate, declare material requirements. Include that source's objects, associations, and referenced assets; preserve withheld other sources and all CC/disposition material. Degraded candidates remain source-bound and non-packet. |
| Same / Normalizer | Add requirements for each claim; request packet widening for necessary header/caption bytes. Do not use AST context as a substitute for missing packet evidence. A blocked interpretation returns a material finding, not affirmative claim prose. |
| Same / Merge Judge | New successor proposals name their own requirements and preserve predecessor limitations alongside packet union. No new equivalence policy or Slice 8 refutation machinery. |
| `verifier-lenses.md` / L1 | Show same-source inventory and limitations with source/walk/packets; attack omissions of declared tables, captions, and fragments. Preserve the current gap-review result mapping and missing-material verdict. |
| Same / L2 | Replace quotes-only material context with exact packets, separately labeled transformations, and required representation closure. Attack equations/values/layout smuggled into normalized text. |
| Same / L3R | Include the exact relation use subject and declared layout closure when needed. Header existence or a legal locus never establishes correct relation meaning. Existing relation verdict target is unchanged. |
| Same / new L2F charter | Fresh material-use challenge below; one concrete verifier-l2f role using existing refuter transport and common output contract. |
| `workers-internal-ambiguity.md` | Apply the common constraint block and include only representation context belonging to the already legal same-source basis. Preserve all T5/OQ field shapes, human withholding, and candidate restrictions. |
| `orchestrator.md` | Verify Core-defined inventory and use closure, reserve IDs, dispatch L2F, append subject and receipt atomically, refuse post-freeze upgrades, and retain CANNOT_DETERMINE. Never author the semantic requirements itself. |
| Existing judgment / arms / synthesis workers | Apply common block through assembly rules; include already declared material-use limitations when their legal claim context requires them. No new return schema, disposition rule, routing rule, or provider logic. |

### 13.2 Producer return delta

In 1.6 exemplars, add a `material_use` object to each extractor packet candidate,
normalizer claim, merge successor specification, and relation proposal:

```json
{
  "requirements": [
    {"object_id":"OBJ-…","feature":"text-bytes","binding_ids":["BND-…"]}
  ],
  "use_state":"usable|CANNOT_DETERMINE",
  "fidelity_claim":"none|exact-representation|gold",
  "limitation_refs":[],
  "reason":"none"
}
```

Core rejects gold as a semantic-contract violation even though the return
parser can recognize the attempted value. Dynamic exemplar IDs/integers use
the existing variable conventions; never freeze example offsets as literal
required values.

Add a top-level `material_findings` array to extractor/normalizer/merge/relation
producer returns, each element exactly
`{"object_id":"OBJ-…","material_use":{...}}`.
It retains failed candidates with CANNOT_DETERMINE and nonempty limitations.
Those elements produce OBJ use receipts, not affirmative CC/REL rows.
Empty arrays are explicit. Extractor degraded-non-exact candidates keep their
current degraded source locator/reason and cannot gain packets through this
extension. A findings-only result must not be translated to “no claim found”
or a no-claim lineage event: the relevant unresolved DoD remains visible.

Producer does not allocate USE, final PKT/CC/REL, review IDs, or digests.
Orchestrator/Core perform reservation, byte checks, exact subject construction,
review, and canonical serialization. The existing worker-return fallback
validates shapes; one Core semantic-contract module validates field relations.
Do not duplicate that module in the host.

### 13.3 L2F — formal/table/layout use challenge

Register only `verifier-l2f`, legal at S3 and S4, mapped to this exact charter.
Use the existing refuter kind and fresh-context enforcement. Its pinned profile
uses the same model slot/context class as verifier-l2 and satisfies the existing
effort floor relative to the producer. No provider abstraction or new vision
capability is implied. It must return cannot-determine for a supplied modality
that its actual worker transport cannot consume.

L2F attacks one complete proposed use subject and its actual packet/claim/
relation text. It asks whether required material is missing, whether the
requirements hide a dependence on unavailable structure, and whether the
proposed wording promotes a rendering or flattened form beyond its evidence.
Specifically attack shifted cells, header/caption associations, glyph/spacing
loss, equation reconstruction, chart-value inference, and undeclared layout.

Shown: exact subject/digest, exact packet bytes/hashes, selected source-local
objects and their structural dependencies, origin/rendering provenance,
separately labeled outputs, and recorded limitations. Withhold: producer
rationale/hidden context, other batches, dispositions, authority responses and
observations, downstream narratives, calibration answers, and expected IDs.
Structural dependencies mean parent chain, table axes/cells/headers/captions
actually referenced, and their provenance/assets; no unrelated-source bundle.

Use the existing common verifier return, with candidate_evidence empty.
Upheld permits only the identical reviewed usable subject. Refuted requires a
revised candidate and fresh subject, rejection, or visible limitation.
Cannot-determine blocks that affirmative use and names missing material.
No verifier writes the inventory, chooses a missing header, repairs an
equation, or grants acceptance. Real freshness is a host/process obligation;
static VER existence is only structural evidence.

## 14. Durable writing, freeze, and resume

Core owns validation, canonical bytes, use subjects, and allowed write windows.
The adapter implements stable file reads/copies, single-writer journaling,
sealed bundles, and recovery of those exact plans. It does not interpret
provenance, infer structure, select requirements, or upgrade state.

The capture transaction contains SRC bytes, descriptor/assets, ID map, all
inventory rows, and the new run-manifest inventory binding. Freeze authority
sees the source and representation limitations. Existing scope/sensitivity
authority is not permission to erase a limitation or create source meaning.
Prepare the representation against the existing staged S0 snapshot; publish
the canonical representation inventory only in the authorized freeze
transaction after S0 exclusions are determined. The authority reviews the
prepared inventory, not an already frozen scope that must be rewritten.
If S0 excludes a source under its existing authority contract, preserve the
original staging/exclusion evidence; it is not an admitted source with a
fabricated successful walk.

At S4-C1, hash the complete canonical uses ledger and retain exactly one line
`representation_use_closure_hash: sha256:<64-lowercase-hex>` in the same
structured run-log event as `closure_phase: S4-C1-relations-closed`.
It is forbidden before that event. At C1 and later, require it and compare the
exact uses bytes. Reuse shared Core run-log parsing; do not create another
adapter event recognizer or repair unrelated S3/S5 recognition.

Inventory and assets are immutable after canonical capture. Use receipts append
only in their specified stages, then seal at C1. Post-C1 findings use the
existing run-log anomaly/halt surface, not an append to the sealed uses ledger.
An ordinary new producer result cannot reopen a closed material basis.

Every 1.6 resume verifies, using the retained run's Core:

- original bundle/runtime/run-format identity through existing mechanisms;
- representation inventory seal, file closure, SRC/AST lengths and hashes;
- imported declaration correspondence, states, and coordinates;
- retained use receipts, packet basis, subject digests, and required verdicts;
- C1 use seal when present/required; and
- active prepared transaction identity before any replayed write.

This is a bounded material prerequisite check, not generic full-run validation.
No new generic repair planner, automatic invalidation, or earliest-DoD
architecture is introduced. A disagreement halts with exact IDs and hashes.
Do not refresh renderers, re-fetch source, or silently upgrade a run's Core.

The canonical idempotency key for a use write is its
`representation-use-subject:<digest>` plus subject kind/ID. A byte-identical
retry returns the existing result without allocating another USE or VER.
Reusing a key with different bytes fails before mutation. ID reservation is
retained in the prepared transaction and reused on recovery.

### 14.1 Required process/crash cases

| Interruption or attempted change | Required recovery / refusal |
|---|---|
| Before capture preparation | No canonical capture; retry ordinary preparation |
| Prepared capture, partial copied files | Recover only exact journaled bytes after source/preimage verification; no recapture from changed input |
| All capture bytes present, freeze acknowledgement absent | No extraction; complete the original permitted freeze transaction once |
| Freeze acknowledged, asset/source changed | Hash failure and durable BLOCK; do not re-render or accept a new hash |
| Worker return malformed or feature unsupported | Preserve returned evidence; no affirmative subject write |
| Subject/receipt multi-file write interrupted | Finish only the exact prepared transaction or BLOCK if its basis/preimages differ; never infer a missing receipt |
| Review received, write not committed | Revalidate same reserved subject/digest and fresh receipt; commit once |
| Duplicate accepted return | Same canonical subject/USE count and same ledger bytes |
| Reused transaction key with changed coordinate/state/requirements | Refuse before any canonical write |
| C1 rows written, use seal/marker absent | Existing journal completes original closure only after full retained prerequisites validate |
| C1 sealed, new material/REL use arrives | Refuse; retain anomaly; no retarget or C2 restart |
| Unsupported opaque capture resumed repeatedly | Same explicit unmet prerequisite; no packet or successful walk appears |

Manual mode performs the same Core artifact, seal, and write-window rules
without requiring adapter control files. Tests of these cases do not establish
F-03 production reachability or F-05 closure.

## 15. Fixtures and mutation plan

Use a new bounded synthetic fixture family under
`docs/fixtures/formal-layout-bindings/`, with a discovered `kind: run` positive
fixture in a child directory following current K1 discovery. Keep all
source text/table values synthetic and unrelated to SRC-001. It must include
complete applicable 1.6 artifact prerequisites, real exact packet hashes,
source-walk accounting, lineage/relations/ambiguity markers, material use
receipts, and clearly fixture-simulated semantic verdicts where required.
Do not fabricate human acceptance to satisfy a checkpoint.

Keep valid CORPUS-FROZEN unsupported captures and semantic-only cases as named fixture
companions. If a companion is itself a discovered run, declare the stage and
full applicable artifacts honestly; do not weaken K1/K2 to accept an incomplete
fixture. Invalid cases are temporary mutations of a passing baseline, not
unmarked broken fixtures that poison discovery.

### 15.1 Required bounded cases

| ID | Case | Structural expectation | Semantic/process expectation |
|---|---|---|---|
| FX01 | Table with two header levels, literal cells, caption, one spanning cell, and one declared empty cell | PASS, exact bytes and complete grid reopen | L2F challenges correct use of declared associations |
| FX02 | Shifted-cell adversary | Inconsistent declaration/binding FAIL; separately, a coherent but semantically wrong supplied association remains structurally valid | Fresh review refutes wrong-header/cell meaning |
| FX03 | Flattened equation with exact text and degraded formal state | Honest retention PASS; formal-structure usable use FAIL | CANNOT_DETERMINE when equation structure is needed; no reconstruction |
| FX04 | Image-only chart | Image identity PASS; values unavailable; no fabricated values binding | Values-dependent candidate CANNOT_DETERMINE |
| FX05 | Unsupported opaque source representation at CORPUS-FROZEN | Honest inventory PASS; attempted DISTILLING FAIL | Repeated resume stays visibly blocked |
| FX06 | Degraded evidence presented as exact-representation/gold | FIDELITY FAIL | No promotion |
| FX07 | Missing header target | ASSOCIATION FAIL | Do not choose another header |
| FX08 | Wrong/out-of-range coordinate or cell collision | COORDINATE FAIL | No spatial repair |
| FX09 | Changed exact cell byte with prior source/hash | BINDING or CAPTURE_HASH FAIL, as injected | Original bytes remain authority |
| FX10 | Absent rendering provenance | PROVENANCE FAIL | Do not invent tool/version/log |
| FX11 | Undeclared chart/image inference | Typed usable values requirement without declared values FAIL | Hidden inference in otherwise valid prose is L2F, not deterministic detection |
| FX12 | Ordered/discontiguous formal material | PASS with explicit order and length framing; wrong order against supplied declaration FAIL | No equation reconstructed between fragments |
| FX13 | Missing headers and ambiguous caption candidates declared honestly | PASS inventory; unavailable association cannot satisfy usable requirement | Preserve uncertainty; no nearest-object inference |
| FX14 | LF/CRLF, multibyte glyph, literal entity, significant spacing, and cell inside one line | Exact capture/packet/BND hashes PASS | Rendered alternatives remain separate |
| FX15 | Plain text 1.6 default inventory | PASS through packet, claim, existing review, and resume | No new non-text review required |
| FX16 | Accepted predecessor fixtures and formats | Existing 1.0–1.5 results unchanged | No migration or new material capability claim |
| FX17 | Rendered formal export whose bytes differ from SRC | PASS with separate hashes/provenance, fidelity none | Fresh use review; exact-representation assertion fails |

FX02 must contain both adversaries. Rejecting only an out-of-bounds shift does
not demonstrate that semantic table errors remain outside deterministic code.

### 15.2 Deterministic negative battery

Use the real checker with a temporary `--root`, one intended violation per
case, assert nonzero exit **and K2.18 plus the intended reason token**, and
include unchanged must-pass baselines. Where a mutation intentionally targets
an older byte check, assert that named older check as well.

| Mutation | Required token / observation |
|---|---|
| Remove required header-for row or its header target | ASSOCIATION |
| Reference nonexistent caption | ASSOCIATION |
| Wrong row/column ID, out-of-range index, overlap, false complete grid | COORDINATE |
| Change BND cell base64 only | BINDING |
| Change source bytes or declared full source hash | CAPTURE_HASH |
| Change asset bytes or asset length | CAPTURE_HASH |
| Remove RPR / renderer metadata / raw structure export | PROVENANCE or INVENTORY, as injected |
| Request chart-values as usable over image-only OBJ | UNDECLARED_FEATURE |
| Present degraded artifact as exact-representation | FIDELITY |
| Present unsupported surface as supported text | STATE or UNSUPPORTED_EXTRACTION_SURFACE, as injected |
| Change frozen indeterminate/degraded state to available | STATE / CAPTURE_HASH; raw export and seal mismatch retained |
| Rename a replacement REP to conceal an upgrade | INVENTORY (one REP/SRC and import correspondence) |
| Drop an ordered fragment or swap order without changing retained export | INVENTORY / BINDING |
| Split UTF-8 code point or claim AST is frozen-source-bytes | BINDING |
| Duplicate ID/field, unknown key/state, noncanonical JSON/base64 | IDENTITY / FORMAT / STATE / BINDING |
| Missing PKT/CC/REL use, stale subject, lost basis packet | USE_CLOSURE |
| Change normalized claim or relation without renewed material review | USE_CLOSURE |
| Replace fresh review with producer context in shipped request | Host refusal before dispatch/accept; no canonical write |
| Insert 1.6 artifact into predecessor-format fixture | FORMAT |
| Omit inventory/hash on frozen 1.6 run or downgrade version against run pins | FORMAT / CAPTURE_HASH; host pin refusal |
| Reuse a 1.6 source-walk gap digest with a different inventory seal | K2.14 review-basis mismatch |
| Drop a declared limitation from the section 17 summary | USE_CLOSURE |
| Change sealed uses after C1 | FROZEN_WRITE |
| Attempt path traversal, symlink, extra unlisted asset, duplicate selected input | CAPTURE_HASH / INVENTORY; intake refusal |

### 15.3 Non-vacuity and overreach guards

Must-stay-green pairs include:

- correct available vs honestly degraded representation of the same captured
  text, with separate truthful declarations;
- known empty cell vs unavailable cell;
- two legal header associations whose semantic adequacy differs;
- different mathematically meaningful formal strings with valid byte bindings;
- alternate captions/values with all mechanically consistent provenance;
- overlapping valid region boxes with no semantic alignment assertion; and
- exact old fixture outputs before and after capability registration.

The semantic variants must not acquire different K2.18 verdicts merely because
of their meaning. These guards detect bounded semantic checker overreach;
they cannot prove the absence of all hidden semantic policy.
Fixture README separates structural expectations from synthetic semantic
attack examples. A fixture-simulated upheld/refuted verdict is not a live
semantic validation result.

## 16. Corrected future implementation surface

This is a dependency map, not an instruction to edit every file. The present
proposal changes only itself and its repository-administration inventory entry.

| Future surface | Necessary bounded reason |
|---|---|
| `docs/architecture/02-system-architecture.md`; `03-artifact-contracts.md`; `04-pipeline-stages-and-dod.md` | New input/uses artifacts, capture/semantic boundary, explicit S0/S2/S3/C1 requirements |
| `docs/architecture/templates/01-run-control.md`; `02-corpus-intake.md`; `03-extraction-claims.md`; `07-verification.md` | Inventory/use seals, T2.3/T3.6 tables, L2F exact-subject target |
| `docs/architecture/prompts/README.md`; `workers-intake-extraction.md`; `verifier-lenses.md`; `orchestrator.md`; `workers-internal-ambiguity.md` | Exact section 13 changes and bundle restrictions |
| `docs/architecture/08-runbook-agent-mode.md`; `09-runbook-manual-mode.md` | Shared unsupported/capture/write-window procedure; no sanction change |
| `docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md`; checker-spec index; `docs/PRECIS-CONFORMANCE-CHECKER.md` | K2.18 guarantees, exclusions, stage/format policy, fixture battery |
| `scripts/lib/run-model.ts` | Cumulative 1.6 capability and canonical document loading; distinguish binary assets |
| New `scripts/lib/source-representation.ts` | One Core parser/serializer/resolver, export import projection, requirement predicate, write plan |
| New `scripts/lib/checks-k2-representations.ts`; `scripts/lib/checks-k2.ts` | K2.18 and dispatch/presence integration only; existing byte and stage semantics preserved |
| `scripts/lib/check-helpers.ts`; existing `sourceWalkReviewBasisDigest()` in `checks-k2.ts` | Reuse byte helpers and add only the 1.6 inventory-bound review digest; no duplicate S3/S5 event policy |
| `scripts/lib/worker-return-contract.ts`; `scripts/test-worker-return-contract.ts` | Only necessary shape support/discovery for actual amended exemplars; do not redesign fallback validation |
| New `scripts/test-representation-mutations.ts`; `scripts/test-conformance-mutations.ts`; `package.json` | Focused real-CLI battery plus cumulative activation/regression cases and test wiring |
| New `docs/fixtures/formal-layout-bindings/` | Synthetic material/legacy/semantic boundary cases above |
| `adapters/loa/src/intake.ts`; `types.ts`; `ledger-writer.ts`; `worker-bundle.ts`; `run-control.ts`; `core-loader.ts` | Import/copy Core-declared inputs, exact transaction plans, fresh bundles, pinned material validation; no host policy |
| `adapters/loa/src/worker-dispatch.ts`; `worker-return.ts`; `cli.ts` | Only if existing mechanics need plumbing for the new fields/L2F/existing start route; no new public commands or provider abstraction |
| `adapters/loa/tests/`; Loa manifest/README/skill | Focused shipped capture/return/resume tests, explicit supported-surface disclosure, format/profile mechanical compatibility |
| `adapter-protocol/`; adapter manifests | Only necessary advertised format/capability compatibility, Core-defined semantics; Hermes remains planned |
| `core.manifest.json`; `tsconfig.runtime.json` if explicit include discovery requires it | Exact inventory/new runtime module closure and future 1.6 metadata |
| `runtime-js/scripts/lib/`; applicable `runtime-js/adapters/loa/src/` | Regenerate solely through canonical runtime build, never hand-edit |

Existing `relations.ts`, `checks-k2-relations.ts`, `internal-ambiguity.ts`,
`checks-k2-ambiguities.ts`, and lineage code are compatibility dependencies,
not invitations to change their policy. Do not refactor them just because new
use checks refer to their projections. Frozen adopted design and historical
calibration evidence remain byte-identical.

## 17. Implementation sequence and verification gates

All work here is conditional on exact adoption and separate implementation
authority. Complete in this order:

1. Define T2.3/T3.6, import and hash contracts in Core docs; author bounded
   synthetic source/export fixtures. Verify every fixture's intended bytes
   by direct reopening before coding the checker.
2. Implement Core representation parser/resolver/serializer and cumulative
   capability, then K2.18 in lockstep with the real-CLI positive and negative
   fixtures. Verify legacy outputs and no deterministic semantics.
3. Amend exact prompt exemplars and Core return contracts; implement L2F
   subject/context binding. Verify actual shipped exemplar validation,
   cannot-determine paths, and bad-type negatives.
4. Add only required Loa intake, persistence, bundle, and resume mechanics
   consuming Core. Exercise the section 14 crash/idempotency cases through
   shipped entrypoints where reachable; accurately name test-scaffold limits.
5. Regenerate runtime JS from TypeScript, update exact inventories, and run
   conformance/bundle/release tests. Obtain fresh independent implementation
   audit under the repository's normal authority process.

Future required commands: `npm run typecheck`, `npm run runtime:build`,
`npm run runtime:check`, `npm run validate:core`, `npm run test:worker-return`,
`npm run validate`, the focused new representation suite, and full `npm test`.
Use existing bundle assemble/verify, release-package, and installed Node 20
gates already in that chain/CI. Verify `git diff --check` and no generated drift.
The new suite must actually be included in `npm test`; merely documenting an
unrun script does not satisfy the gate.

No external renderer, OCR service, real model call, or live corpus replay is
needed to prove this structural implementation. TS/runtime checks compare
the same material-positive/negative reports; successful compilation alone is
not behavioral parity.

## 18. Exact implementation Definition of Done

Every item is OPEN in this proposal. Future completion requires all items:

1. Exact proposal bytes independently reviewed, adopted by human authority,
   and separately authorized for bounded Slice 6 implementation.
2. 1.6 capability activation is cumulative everywhere; predecessor formats
   retain original behavior and pins, with downgrade/injection refusal.
3. One sealed REP exists per admitted SRC, including text-only inputs.
   Every asset/provenance file and declaration is inventoried and reopenable.
4. Exact SRC/AST bytes, byte ranges, base64, fragment/object hashes, and
   packet-evidence hashes agree without normalization or hidden joins.
5. Supplied table/header/caption/cell identities, multi-axis spans, empty and
   unavailable cells, page/region identity, and optional pixel boxes validate
   mechanically; absent structure is never fabricated.
6. Imported declarations are rebound through a checked bijective ID map and
   compared against retained raw export bytes, not trusted mutable metadata.
7. Rendering provenance and output bytes are explicit; missing receipts fail,
   unknown provenance remains unknown, and capture-exact is not original
   layout fidelity.
8. Degraded/unsupported/indeterminate states remain visible, cannot be upgraded
   in place, and cannot support exact-representation/gold assertions.
9. Flattened equations stay flattened; image-only charts supply no values.
   Required unavailable structure yields CANNOT_DETERMINE and blocks the
   affirmative use, with no silent no-claim/disappearance substitution.
10. One exact use receipt accompanies each new PKT/CC/REL; its basis and
    reviewed immutable subject are bound. Failed OBJ candidates remain visible.
11. Existing Slice 1/2 byte/walk contracts, Slice 3 lineage-currentness,
    Slice 4 non-evidentiary taxonomy/C1 closure, and Slice 5/OQ-01 boundaries
    remain intact. Material objects never become new REL or authority endpoints.
12. L2F fresh review covers every canonical non-text/AST CC/REL use; text-only
    review policy is unchanged. Static verdict references are not claimed as
    proof of actual freshness or semantic correctness.
13. Deterministic checks establish structure only. Coherent wrong semantic
    associations remain T2 adversaries; overreach guards prove this boundary
    on the named cases.
14. New prompt/return exemplars pass the shipped Core validator, reject malformed
    material uses, and never leak calibration answers or human observations.
15. Loa imports only explicitly supplied bytes, delegates policy to Core, and
    has no OCR, document renderer, automatic table inference, or model/provider
    refactor. Its public command grammar is unchanged.
16. Opaque inputs fail visibly on unsupported progression; source-scope
    exclusion/new capture follows existing authority and successor-run rules.
17. Exact capture/use transaction recovery, duplicate response idempotency,
    pre-write refusal, C1 seal, and same-pin resume pass all section 14 cases.
    These bounded tests do not close F-03/F-05 or generic resume findings.
18. FX01–FX17 and all named mutation/false-positive guards execute against the
    real checker with intended check IDs/tokens. Semantic-only expectations
    are documented separately from structural expected exits.
19. Accepted legacy fixtures, including frozen Slice 1/2, remain byte-identical
    and checker results match the pre-change baseline under compatibility
    policy. No migration is silently introduced.
20. Authored executable source is TypeScript; generated runtime mirrors are
    regenerated and report-equivalent on named cases. Bundle Core equality,
    host exclusion, release, and installed Node 20 checks pass.
21. No generic Core source, prompt, or test oracle embeds SRC-001 table shapes,
    headers, values, reconstructed equation, expected claim IDs, or recall quota.
22. Exact manifest inventory classifies every added path; only authorized files
    change. Independent audit and status reporting preserve every section 3
    finding and all sanction/acceptance/production/v1 distinctions.

## 19. Human-authority decision and present delivery boundary

The proposal makes concrete recommendations rather than leaving semantic
policy for the implementer. Human adoption must decide this exact contract,
including these material tradeoffs:

- 1.6 is required for new representation-aware runs; no migration of old runs.
- Source/representation declarations freeze once; improvements require a
  successor run rather than an in-place availability upgrade.
- The initial positive extraction path remains UTF-8 text with md-lines;
  supplied structural exports refine it, and opaque extraction blocks.
- Coordinates and associations remain supplied facts; deterministic PASS never
  establishes their semantic meaning.
- Non-text/AST claim and relation uses require focused fresh L2F review;
  no general Slice 7/8 review expansion is included.

There is no unresolved policy placeholder for a future implementer to choose.
These recommendations remain unadopted. An authority-requested change requires
a revised exact proposal and review, not implementation-time improvisation.

This delivery adds only this proposal and one
`files.repository_administration` entry in `core.manifest.json`. It does not
change `core.run_format_version`, any Core payload membership/bytes, adapter
payload, executable/checker behavior, runtime projection, fixture, or test.
The retained calibration checksum set is not extended or rewritten: this is a
new administrative proposal outside its historical sealed members.

Validation for this delivery consists of bounded diff inspection,
`git diff --check`, Core/admin inventory validation, baseline fixture comparison,
runtime drift checking, and a path-by-path payload identity comparison to the
starting commit. These are design/admin checks, not Slice 6 implementation
evidence or an independent design audit. The normal local design commit
identifies its own final tree outside this file; no self-referential commit
hash or adoption declaration is embedded here.

No Slice 6 implementation occurred. PR #51 and merged Slice 5 history remain
unchanged. No implementation authority, adoption, push, release, replay, or
production claim is created by this proposal.

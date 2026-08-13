# SRC-001 Independent Calibration-Delta Architecture Decision

Date: 2026-08-13

Overall result: `PASS_WITH_REVISIONS`

Design readiness: `READY_FOR_CORE_CHANGE_DESIGN`

This is a fresh-context, read-only review. It does not authorize a Core change,
start SRC-002, validate or sanction agent mode, promote SRC-001 to golden, or
alter the closed calibration package or historical evidence.

## Audit basis and identity result

The closed SRC-001 package independently hashed to:

`f4c42e65d611395c9bacdb7ecf3ab7e4d01b1d21fd50c6c150b0cc6a8847a9f0`

This matches the pinned package digest. The package records SRC-001 as
`CLOSED_FOR_CALIBRATION`; SRC-002 remains `NOT_AUTHORIZED`.

All analysis identities match:

| Artifact | Verified SHA-256 |
|---|---|
| `SRC-001-machine-to-final-mapping.json` | `5b7648b3021a16b60d88ab67efbca96ed1aa1a42abad592b8950e96b21507613` |
| `SRC-001-calibration-delta-report.md` | `4486d298eb0cc72e5d50a6dcebd91568d7d49b5280ccd8c2920d58f083784cb9` |
| `SRC-001-failure-taxonomy.json` | `2601a54914b34913d3c92cfb59af26fe2ae2a8d086805fe81a2fb29851d7ff10` |
| `SRC-001-remediation-matrix.md` | `a9365e703178e4a3e9e927a12d299eb7dc60a59ca9a33325a9a136d967ecb4f0` |
| `SRC-001-deterministic-invariants.json` | `62c8e2bf70347f29832ce3f9e1fcae4fca586d4409dc990b2d0980c81ef80432` |
| `SRC-001-semantic-contract-lessons.json` | `ec61271a5bc2802fcb65cbe1782bc632ff6941d7059f650045baf790f99c252c` |
| `SRC-001-regression-plan.md` | `f43f98cbc30e04869eb74ab2eac6e2c13eaf44172d14a5297e0df81c0be55019` |
| `SRC-001-blind-replay-plan.md` | `9082801ac1a67ced0869eac3e61078ba3ed25144eaa309901126eb4838f6d3da` |
| `SRC-001-recommended-implementation-slices.md` | `e6a059d183d4a388cdf7f70c92e099c2be0cf8a7a59878dc9b79eb8804d716f8` |
| `analysis-manifest.json` | `9498f30ddbab9e6791a560b5cad281e634b45d4a7857646488d1e80a9baa7a14` |
| `CHECKSUMS.sha256` | `eda69ea2ed1399951832b4a71cb9094ec3b8bb48c78c763facbc34f0ba9c3713` |

Independent `sha256sum -c CHECKSUMS.sha256` verification passed for every
listed analysis artifact. The retained input identities in the analysis
manifest also reopen to the pinned source, criteria, handoff, proposal,
checkpoint, correction, consistency, and closure artifacts.

## Comparison baseline

The analysis correctly distinguishes four stages:

1. The 206-row reconciled handoff is an open extraction inventory, not an
   authority decision. It incorporates disclosed mechanical prebaseline
   repairs: nine overlong proposal rows became nineteen rows and two locators
   were widened.
2. Machine gap review is a separate recovery stage. It found 23 final units
   absent from the raw handoff.
3. The twelve adjudication proposal files are explicitly noncanonical machine
   recommendations.
4. Checkpoint decisions and later append-only authority events define the
   human-authoritative state.

This baseline is documented and defensible. Raw-extractor omissions recovered
by gap review are stage-local failures, not end-to-end omissions. Human
refinements are not machine errors merely because final wording or structure
differs.

## Mapping audit and sample

The mapping was checked against original retained artifacts, not only against
the report:

- 206 of 206 candidate proposal rows are exact copies of the machine proposal.
- 206 of 206 candidate authority decisions are exact copies of the checkpoint
  decisions.
- 23 of 23 standalone additions match their authority records.
- All 206 raw handoff quotes reopen within their frozen source locator spans.
- The mapping has 232 unique candidate-derived final units and 23 standalone
  units. `S-190b` is correctly referenced by two parent candidates.

The adversarial stratified sample covered 28 mapping units:

`C-001`, `C-002`, `C-003`, `C-019`, `C-022`, `C-029`, `C-032`, `C-053`,
`C-054`, `C-067`, `C-070`, `C-075`, `C-109`, `C-110`, `C-111`, `C-120`,
`C-139`, `C-147`, `C-158`, `C-186`, `C-190`, `C-191`, `C-205`, `M-001a`,
`M-001b`, `M-002`, `T1-001`, and `T2-000`.

Nine later correction/process overlays were also reopened:

`NORM-19-C004`, `NORM-19-C019`, `NORM-19-C029`, the `C-186` referent
closure, the `C-120` quote correction, the `C-093b` authorization correction,
the B08A shared-line resume correction, the B02 exact-byte recovery, and the
B10/B11 transfer-pin correction.

Result:

- 24 of 28 sampled mapping classifications are `SUPPORTED`.
- All 9 sampled correction/process overlay classifications are `SUPPORTED`.
- `C-110` as `MACHINE_ERROR` is `OVERSTATED`. The proposal already retained
  the claimed linkage; authority made attribution/dependency explicit in a
  representation the proposal schema did not provide.
- `C-139` as `MACHINE_ERROR` is `OVERSTATED`. The proposal retained the
  qualification and `may not`; authority added a dependency and normalized
  wording.
- `M-001a` and `M-001b` as source constraints are individually supported, but
  the pair's accounting is `UNDERSTATED`: gap review recovered the omitted
  substance but its proposal missed the later authority split. The mapping
  needs a separate split-error event rather than assigning only source
  constraints to both units.

The mapping has one material representation weakness. Its `final_units` copy
terminal checkpoint decisions but do not materialize later authoritative
overlays. Three checked units, `C-120`, `C-125`, and `C-128`, therefore retain
pre-correction quote bytes in the mapped snapshot. Other corrections, including
the `C-186` ambiguity closure, also remain event records rather than applied
effective-state fields. Rename this collection
`terminal_checkpoint_snapshot`, or add an ordered machine-readable overlay
application that produces an effective final state.

## A. Verified Delta Facts

1. The artifact and closed-package identities are intact.
2. The four comparison stages are separated correctly and the authority
   boundary is preserved.
3. The mapping exactly reproduces all 206 machine proposal rows, all 206
   checkpoint decisions, and all 23 standalone authority additions.
4. The raw handoff omitted 23 final units. Machine gap review recovered all
   substantive omitted content; one recovered passage remained under-split.
5. Initial extraction recall should improve, but independent gap review should
   remain as intentional redundancy.
6. Final artifacts contain 250 entries in `dependencies` arrays across 165
   units and 131 original-candidate mappings. This is graph size, not a count of
   machine omissions.
7. The 250 entries are heterogeneous: 237 resolve to active final IDs, two
   target non-active/original units, seven identify formal/table header
   references, one names a table review record, and three are prose or compound
   references. They are not yet one typed dependency schema.
8. Proposal rows have no uniform structured dependency field. A reproducible
   lexical scan finds 60 rows mentioning context/dependency-like terms, but
   that is not a semantic link count.
9. Exact-byte, authorization, resume, transfer-pin, and package-accounting
   corrections demonstrate real process/checker gaps.
10. The analysis correctly declares link-by-link dependency semantic delta
    indeterminate and does not equate 250 final links with 250 machine misses.

## B. Disputed / Weak Findings

### Classification disagreements

The four sampled disagreements are `C-110`, `C-139`, `M-001a`, and `M-001b`
as described above. No sampled item was wholly unsupported, but these records
need narrower stage/owner classification.

### Failure taxonomy

The 17 concepts are useful as a root-cause inventory, but the current taxonomy
mixes stage, owner, symptom, representation, recovery status, and process
failure in one flat list. Counts are not additive and several are prevalence
counts rather than demonstrated failure counts.

| Class | Verdict | Independent finding |
|---|---|---|
| FT-01 Omission and recall loss | NARROW | Demonstrated as 23 omitted final units, not 23 independent omission incidents. All were recovered downstream. |
| FT-02 Under-splitting | NARROW | Twenty-seven authority split phenomena are real, but proposal misses are 23. Keep prevalence and failure counts separate. |
| FT-03 Over-splitting | REFRAME | One raw fragment/over-split was correctly repaired by machine adjudication; it is not an end-to-end machine failure. |
| FT-04 Evidence boundary | NARROW | Distinct from dependency representation, but the stated count of 9 lacks an enumerated reproducible rule and overlaps FT-05/FT-15. |
| FT-05 Dependency/context linkage | REVISE | Missing uniform representation is demonstrated. The 250 entries are graph size, not failures; zero means no uniform field, not no machine awareness. |
| FT-06 Scope/condition/metric loss | RETAIN UNCOUNTED | Useful orthogonal semantic dimension; the analysis correctly avoids a double-counted total. |
| FT-07 Modality/attribution/discourse | NARROW | Supported, but human edits alone do not prove machine error. `C-110` and `C-139` are overstatements. |
| FT-08 Result vs interpretation | NARROW | Useful semantic subtype, but verify the four-case boundary after correcting `C-110` classification. |
| FT-09 Criterion/role variance | REFRAME | Mostly acceptable criterion overlap, not failure. Do not encode one human categorization as universal correctness. |
| FT-10 Duplicate/replacement/lineage | SPLIT | Semantic duplicate choice and deterministic lineage completeness need separate ownership and counts. |
| FT-11 Exact-byte/authorization drift | ACCEPT | Six direct events are demonstrated and mechanically actionable. |
| FT-12 Normalization | REVISE | Nineteen are reviewed authority decisions, not nineteen machine failures: 17 refinements, one unresolved case, one non-gold rendering. |
| FT-13 Degraded formal material | NARROW | Representation degradation is useful and distinct from table semantics, but the 25 events overlap FT-14. |
| FT-14 Table/figure/caption | NARROW | Twenty omitted table units are demonstrated; assign ingestion/layout, packetization, and interpretation separately. |
| FT-15 Unresolved referents | NARROW | Two remain unresolved (`C-019`, `C-186`); two were repaired through context/dependency. Do not merge unresolved and resolved cases. |
| FT-16 Over-extraction/exclusion | REFRAME | Two stage-local false positives were correctly rejected by machine adjudication. |
| FT-17 Checker/process gaps | ACCEPT AS AXIS | Ten enumerated process events are real, but intentionally overlap semantic/source symptoms and should be a separate axis. |

Taxonomy verdict: retain the 17 concepts, but revise the taxonomy into
nonexclusive dimensions such as stage, failure owner, symptom, recovery, and
final outcome. Do not use the current counts as a single failure distribution.

### Source-extraction constraints

The 28 events divide as follows:

- 20 table/caption omissions: upstream ingestion/layout and packetization;
  semantic header/cell alignment; deterministic declared-binding checks.
- 3 discontiguous final units (`M-001a`, `M-001b`, `M-002`): ordered-fragment
  representation and visible uncertainty, plus semantic splitting.
- 4 glyph/formal/spacing defects (`C-085`, `C-088`, `C-099`, `C-109`):
  ingestion/rendering, exact-byte preservation, and separately authorized
  rendered text.
- 1 flattened equation (`C-029`): structure loss plus semantic
  `CANNOT_DETERMINE`/non-gold handling.

Unsupported formats should produce explicit degraded or indeterminate state.
They should not be converted into generic semantic prompt instructions or
silently reconstructed.

## C. Recommended Hard Invariants

Six checks are accepted as mechanical concepts and six require narrowing. No
entire check is rejected, but semantic clauses must be removed.

| Check | Verdict | Mechanically justified scope |
|---|---|---|
| DC-01 exact evidence | ACCEPT | Compare only fields explicitly declared exact against frozen bytes using declared locators, fragments, order, and join policy. |
| DC-02 dependency targets | NARROW | Check typed relation enum, target kind, target existence/status, and relation-specific cycle policy. Do not judge whether the relation or target is semantically correct. |
| DC-03 disappearance/disposition | NARROW | Require complete allowed lineage and explicit disposition. Do not require "exactly once" where split, merge, or multi-parent lineage is legal. |
| DC-04 split/replacement provenance | NARROW | Check parent/successor IDs, relationship enums, ownership, and supersession. Remove semantic "incompatible claim" detection. |
| DC-05 source-walk coverage | ACCEPT | Once the source-walk, gap, exclusion, shared-position, and resume records exist, mechanically require interval accounting and valid resume positions. PASS proves accounting, not semantic recall. |
| DC-06 duplicate/merge provenance | ACCEPT | Require existing targets and provenance-union retention. Duplicate equivalence remains semantic. |
| DC-07 exact vs normalized fields | ACCEPT | Enforce immutable exact evidence, separate normalized text, and an evidence-bound normalization event/hash. |
| DC-08 ambiguity propagation | NARROW | Check explicit ambiguity flags, typed affected relations, closure/carry events, and declared propagation edges. Do not infer ambiguity from prose or force propagation to every descendant. |
| DC-09 formal/table bindings | NARROW | Check declared coordinates, header IDs, source-byte hashes, provenance type, and explicit degraded/unsupported status. Header alignment and meaning remain semantic. |
| DC-10 identity pins | ACCEPT | Require declared source, criteria, proposal, checkpoint, predecessor, and closure identities to remain pinned and reopenable. |
| DC-11 schema values/IDs | ACCEPT | Enforce unique IDs and declared disposition/relation enums. |
| DC-12 package inventory | NARROW | Check closure against an authority-declared manifest. A checker cannot discover unlisted "load-bearing" artifacts semantically. |

Every deterministic failure must report missing, malformed, non-reopenable, or
inconsistent structure without inventing the correct semantic answer.

## D. Recommended Semantic Responsibilities

Four lessons are accepted and three are narrowed. None is rejected.

| Lesson | Verdict | Responsibility and context |
|---|---|---|
| SL-01 smallest coherent assertion | ACCEPT | Producer proposes atomic units; a fresh reviewer challenges role conflation. Give source-local context and criteria, but hide final IDs and answer keys. |
| SL-02 evidence boundary/dependency | NARROW | Producer and reviewer choose semantic relations using bounded source context, candidate summaries, target kinds, and relation schema. The checker handles only structure. |
| SL-03 qualifier preservation | ACCEPT | Producer retains scope, condition, comparator, quantity, metric, modality, and attribution; fresh refuter tests strengthened readings. Do not mandate final wording. |
| SL-04 result vs interpretation | ACCEPT | Producer labels observation versus attributed interpretation; fresh reviewer tests leakage between evidence roles. |
| SL-05 unresolved referents | NARROW | Producer must not guess. Reviewer may need full same-source search, not only local context; hide external/domain knowledge and the final answer. Authority alone resolves or carries ambiguity. |
| SL-06 formal evidence | NARROW | Upstream ingestion must expose available bytes/layout and degradation. Semantic workers interpret only declared material and return `CANNOT_DETERMINE` when structure is unavailable. |
| SL-07 duplicate vs overlap | ACCEPT | Producer proposes; fresh reviewer compares the complete inventory and provenance. Deterministic checks preserve lineage but cannot decide equivalence. |

Fresh/blind context is warranted for atomicity, entailment/qualifier,
result-versus-interpretation, referent, formal-evidence, and duplicate/overlap
judgments. Workers need the smallest sufficient source and schema context, not
the closed reference, human answer key, downstream narrative, or delta metrics.

## E. Recommended Process Redundancies

1. Preserve an independent gap-review pass even after improving first-pass
   recall. Use a different review lens, such as source-order coverage,
   layout/formal review, or claim-role review.
2. Preserve a fresh atomicity/context reviewer after extraction.
3. Preserve fresh entailment and qualifier refutation after normalization.
4. Preserve fresh duplicate/overlap review before merge.
5. Add a layout/formal-material review path for degraded tables, figures,
   captions, equations, and unsupported source formats.
6. Preserve append-only correction and independent package/inventory
   verification.
7. Preserve human authority gates. Deterministic checks prove structure;
   model review supplies judgment; neither grants acceptance.

The intended architecture should combine better first-pass extraction with
redundant, differently framed review. It should not require one extractor to
be perfect or remove a recovery pass that succeeded in SRC-001.

## F. Recommended Implementation Order

The six proposed concepts are retained, but A-E are too broad. Split them into
eight Core-design slices and keep the calibration-only replay harness ninth.
Each row describes design scope only; implementation remains separately
unauthorized.

| Order | Slice | Prerequisite | Likely Core/checker/fixture impact | Runtime and replay gate |
|---|---|---|---|---|
| 1 | Exact evidence and ordered fragments (A1) | Existing locator/hash contract | Templates 02/03; artifact/checker docs; `run-model.ts`; K2 exact-byte checks; minimal fragment fixture; byte/join/order mutations | Regenerate locked runtime JS for TS checker changes. Replay waits. |
| 2 | Source walk, gap, shared-position, and resume accounting (C1) | A1 fragment/locator vocabulary | Templates 02/03; S2 DoD and prompt; K2 coverage parser/check; source-walk fixture; gap/shared-line/overlap/skip mutations | Regenerate runtime JS. Replay waits. |
| 3 | Unified split/merge/replace/supersede lineage (A2) | Stable unit IDs and A1 evidence references | Template 03; K2 lineage schema/checks; lineage fixture; orphan, double-active, missing-parent, provenance-loss mutations | Regenerate runtime JS. Replay waits. |
| 4 | Typed dependency and source-context relations (B1) | A2 active-unit/status model | Templates 03/04; prompt schema; `run-model.ts`; K2 target/type/cycle checks; relation fixture; missing/stale/wrong-kind/untyped mutations | Regenerate runtime JS. Replay waits. |
| 5 | Internal ambiguity and referent lifecycle (B2) | B1 typed relations | Template 04; judgment/refuter contracts; K2 declared propagation/closure checks; unresolved/null/closed fixtures; dropped-caveat and invalid-closure mutations | Regenerate runtime JS. Replay waits. |
| 6 | Formal/table/layout bindings and degraded formats (D1) | A1 exact fragments; B1 typed context | Templates 02/03; ingestion and verifier contracts; K2 coordinate/header/hash/status checks; table/equation/degraded fixtures; shifted-cell, missing-header, inferred-value mutations | Regenerate runtime JS. Replay waits. |
| 7 | S2/S3 semantic atomicity, context, qualifier, and evidence-role review (C2/E1) | Slices 1-6 provide the machine-readable return schema | Intake/judgment/verifier/orchestrator prompts; structured reviewer returns; synthetic semantic fixtures; field-preservation mutations only where mechanical | Docs change bundle digests; checker additions regenerate runtime JS. Replay waits. |
| 8 | S4 duplicate-versus-overlap fresh refutation (E2) | A2 lineage and B1 relation graph | Judgment/verifier prompts; merge/provenance templates; overlap/duplicate semantic fixtures; provenance-loss mutations | Regenerate runtime JS only if checker fields change. Replay waits. |
| 9 | Blind SRC-001 replay harness (F) | Authorized implementations of slices 1-8, immutable bundle pins, allowlist/withhold review | Prefer calibration-only tooling outside Core. Test leak detection, immutable freeze, and post-freeze comparison schema. Add generic Core contracts only by separate authority decision. | No Core runtime change for calibration-only tooling. Replay begins only after prior slices land and are pinned. |

For every new-format Core slice:

- update `core.manifest.json` for any new tracked Core file;
- add a minimal versioned fixture rather than silently rewriting accepted
  legacy fixtures;
- add focused failing mutations and a clean baseline;
- update K2 specifications and the TypeScript run model/check modules;
- run the separate typecheck, conformance mutation battery, runtime build/check,
  bundle assembly/verification, and relevant fixture checks after authorized
  implementation.

## G. Do-Not-Encode List

Do not turn these SRC-001 outcomes into generic Core truth:

1. Exact `NORM-19` human wording choices.
2. Human-preferred IDs, split counts, or dependency density.
3. A universal rule that every sentence must split, or that every related pair
   must merge.
4. One criterion assignment where accepted criteria overlap.
5. Source-specific pronoun antecedent choices.
6. Lexical modality, discourse-marker, pronoun, or context-word heuristics as
   semantic verdicts.
7. SRC-001-specific table shapes, headers, values, or flattened equation
   reconstruction.
8. The 250 final dependency entries as an expected graph size or 250 machine
   omissions.
9. Human stylistic normalization as exactness, correctness, or a deterministic
   requirement.
10. A rule that removes gap review because initial extraction should improve.
11. A deterministic checker that selects dependencies, antecedents,
    qualification, duplicate equivalence, or correct interpretation.
12. Any implication that a clean replay validates or sanctions agent mode,
    makes SRC-001 golden, authorizes SRC-002, or declares Aleph v1.

## Decision

The analysis is sufficiently evidence-grounded to inform Core change design,
but not unchanged. Design work should use the verified facts and narrowed
responsibilities above, first repair the effective-final-state representation,
and treat the 17 classes as nonexclusive diagnostic dimensions rather than an
additive failure distribution.

No Core change, replay, validation, sanction, golden promotion, or SRC-002 work
is authorized by this packet.

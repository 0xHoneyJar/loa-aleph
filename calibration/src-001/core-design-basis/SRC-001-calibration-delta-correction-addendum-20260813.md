# SRC-001 Calibration-Delta Correction Addendum

Date: 2026-08-13

Status boundary:

- SRC-001: `CLOSED_FOR_CALIBRATION`
- SRC-002: `NOT_AUTHORIZED`

This append-only addendum corrects the analytical interpretation of the
original `SRC-001-calibration-delta-20260811` bundle. It does not rewrite that
bundle, historical SRC-001 evidence, any checkpoint, or the closed reference
package.

Controlling inputs:

- original mapping SHA-256:
  `5b7648b3021a16b60d88ab67efbca96ed1aa1a42abad592b8950e96b21507613`;
- independent audit SHA-256:
  `03197345bb9721d245258481cdd8ce102ee10dafcc1a82889b931cbcab63b37a`;
- closed package SHA-256:
  `f4c42e65d611395c9bacdb7ecf3ab7e4d01b1d21fd50c6c150b0cc6a8847a9f0`.

The companion
`SRC-001-effective-final-state-analytical-overlay-20260813.json` is the
machine-readable application of this correction.

## 1. Effective-state correction

The original mapping's `final_units` values are the terminal B12 checkpoint
snapshot. They are not, by themselves, the materialized effective final state.
Later append-only human-authority records remain controlling overlays.

The effective analytical view is:

1. retain the B12 checkpoint snapshot verbatim as predecessor state;
2. apply the NORM-19 and C-186 authority closure;
3. apply the C-120/C-125/C-128 exact-evidence byte restoration;
4. bind the resulting view to the human close event.

Fields not named by an authority overlay retain their checkpoint values.
Nothing is inferred from missing history.

### Exact-evidence restorations

| Unit | Effective exact-evidence SHA-256 | Correction |
|---|---|---|
| C-120 | `79b0428882bc7103b888fce39ada2a0a49c514b41c7e7b58f1bbbc15965ef3e3` | Restore source double curly quotes around `compare attribute`. |
| C-125 | `a6345b6870e5c5c1165bcc1ce9ee454e35cffedead4f61f56166effb3da99c0c` | Restore source double curly quotes around `closest-to` and `furthest-from`. |
| C-128 | `9d161936f3272afcd97e536a24968146f838f68c346ed8d81f3384abe103e5e3` | Restore source double curly quotes around both task names. |

These are byte restorations only. They do not change normalized wording,
claim meaning, scope, attribution, modality, dependencies, disposition, or
locator.

### Normalization and referent overlays

- Apply all 19 dedicated NORM-19 authority decisions.
- Preserve `C-019` as unresolved rather than selecting an antecedent.
- Retain `C-029` as valid degraded formal evidence but not a gold
  normalization example.
- Retain `C-186` as attributed source wording with no selected LSTM
  antecedent.
- Carry the `C-186` ambiguity caveat where relevant to `C-187`, `C-188`, and
  `C-206`.

## 2. Analytical classification corrections

### C-110

Prior category: `MACHINE_ERROR`

Corrected category: `ACCEPTABLE_VARIANCE`

The proposal already characterized the relational-reasoning linkage as
claimed. Human authority made attribution and dependency representation
explicit in a schema the proposal did not provide. A changed checkpoint
disposition alone does not demonstrate a reasoning failure.

### C-139

Prior category: `MACHINE_ERROR`

Corrected category: `ACCEPTABLE_VARIANCE`

The proposal retained the qualified limitation and the `may not` modality.
Human authority added explicit context/dependency and normalized wording. The
retained evidence does not support calling this a machine reasoning failure.

### M-001 residual split

The `M-001a` and `M-001b` raw-extraction omission events remain
`SOURCE_EXTRACTION_CONSTRAINT`. Add one separate stage-local event:

`MAPPING-M-001-GAP-REVIEW-UNDER-SPLIT`

Category: `MACHINE_ERROR`

The machine gap review recovered all substantive content as `M-001` but did
not split it into the two authority-required final units. Human authority
recovered this structural failure.

## 3. Corrected assessment-event counts

The original 124-event universe changes as follows:

- reclassify two events from `MACHINE_ERROR` to `ACCEPTABLE_VARIANCE`;
- add one stage-local `M-001` under-split event.

Corrected exclusive primary-category event counts:

| Primary category | Count |
|---|---:|
| `MACHINE_ERROR` | 58 |
| `ACCEPTABLE_VARIANCE` | 8 |
| `HUMAN_CALIBRATION_REFINEMENT` | 19 |
| `SOURCE_EXTRACTION_CONSTRAINT` | 28 |
| `CHECKER_OR_PROCESS_GAP` | 10 |
| `CANNOT_DETERMINE` | 2 |
| **Total analytical events** | **125** |

Counting rule: each analytical event has one primary category, but a source
unit may participate in multiple events at different stages. These event
counts are not a nonoverlapping count of affected source assertions.

## 4. Separate count dimensions

### Prevalence

- original candidates: 206;
- final authoritative units: 255;
- final units absent from the raw handoff: 23;
- authority split phenomena: 27;
- proposal-missed splits: 23.

Prevalence describes observed units or transformations. It is not an additive
failure total.

### Stage-local failure and recovery

- raw-extraction omitted final units: 23;
- substantive omissions remaining after gap review: 0;
- residual gap-review under-splits: 1;
- raw over-extraction/exclusion candidates later correctly rejected: 2.

The generic conclusion is both to improve initial extraction recall and to
preserve an independent, differently framed gap-review pass.

### Graph-record population

The effective final mapping contains 250 entries in `dependencies` arrays
across 165 unique final units:

- 237 active final-unit ID references;
- 2 non-active/original-unit references;
- 7 formal references;
- 1 table-review reference;
- 3 prose or compound references.

This is a heterogeneous graph-record count. It is not 250 machine omissions
and not yet one typed relation schema.

The historical proposal representation had no uniform structured dependency
field. Its 60 lexical context/dependency mentions do not support reconstructing
link-by-link typed relations.

Therefore:

- number of machine dependency omissions: `CANNOT_DETERMINE`;
- link-by-link machine-to-final semantic dependency delta:
  `CANNOT_DETERMINE`.

### Process/checker gaps

Ten direct process/checker events remain demonstrated. They form a separate
axis and may overlap source, representation, or semantic symptoms.

## 5. Corrected taxonomy structure

Retain FT-01 through FT-17 as nonexclusive diagnostic labels, organized by
these dimensions:

1. **Prevalence:** how many units, transformations, or graph records exhibit a
   shape.
2. **Stage-local failure:** ingestion, extraction, gap review, normalization,
   semantic review, authority serialization, checker, or packaging.
3. **End-to-end outcome:** unrecovered, machine-recovered, human-recovered, or
   still indeterminate.
4. **Representation or graph population:** schema rows and links that are not
   themselves failures.
5. **Process/checker gap:** byte drift, resume metadata, identity pins,
   inventory, or enforcement defects.
6. **Semantic responsibility:** producer judgment, fresh reviewer judgment,
   or human authority.

Do not sum counts from different dimensions or use them as one ranked failure
distribution.

## 6. Audited deterministic invariants

Accepted as mechanical:

- DC-01: exact fields reopen against declared source fragments and join order;
- DC-05: declared source-walk, gap, exclusion, and resume accounting closes;
- DC-06: merge targets exist and absorbed provenance is retained;
- DC-07: exact evidence remains immutable and normalization is separate;
- DC-10: declared source, criteria, proposal, checkpoint, predecessor, and
  closure identities remain pinned;
- DC-11: IDs are unique and declared enums are valid.

Narrowed to mechanical structure:

- DC-02: relation enum, target kind, target existence/status, and allowed
  cycle policy only;
- DC-03: explicit disposition and complete allowed lineage, not
  exactly-once semantics;
- DC-04: parent/successor/supersession structure, not semantic incompatibility;
- DC-08: explicit ambiguity flags and declared propagation/closure edges, not
  inferred ambiguity;
- DC-09: declared coordinates, header IDs, hashes, provenance type, and
  degraded status, not semantic table interpretation;
- DC-12: closure against an authority-declared manifest, not checker discovery
  of unlisted load-bearing meaning.

No deterministic PASS proves semantic correctness. A deterministic failure
must report missing, malformed, non-reopenable, or inconsistent structure
without inventing the semantic answer.

## 7. Audited semantic responsibilities

Accepted:

- SL-01: producer atomicity plus fresh role-conflation review;
- SL-03: preserve scope, condition, comparator, quantity, metric, modality,
  and attribution, with fresh strengthened-reading refutation;
- SL-04: separate empirical observation from attributed interpretation;
- SL-07: fresh duplicate-versus-overlap review over complete provenance.

Narrowed:

- SL-02: semantic relation choice remains producer/reviewer judgment over a
  typed structural schema;
- SL-05: unresolved referents may require full same-source search, but no
  external or answer-key inference;
- SL-06: ingestion exposes available formal/layout material; semantic workers
  interpret only that material and return `CANNOT_DETERMINE` when unavailable.

Fresh reviewers must not receive the closed answer inventory, calibration
delta, expected IDs, or post hoc metrics.

## 8. Remaining indeterminate matters

- link-by-link machine-to-final dependency semantics;
- number of machine dependency omissions;
- whether the 23 omitted final units represent 23 distinct extraction
  incidents;
- any single nonoverlapping total for FT-01 through FT-17.

These are preserved as indeterminate rather than reconstructed.

## 9. Authority boundary

This addendum supports Core-change design only. It does not authorize Core
implementation, start SRC-002, promote SRC-001 to golden, validate or sanction
agent mode, accept a Precis, establish production readiness, or declare v1.

# Slice 7 — S2/S3 Semantic Atomicity, Context, Qualifier, and Evidence-Role Review

Date: 2026-09-12

Status: PROPOSED — HUMAN AUTHORITY ADOPTION REQUIRED

Decision class: bounded Core design proposal; repository administration

Producer: Codex

Repository: `0xHoneyJar/loa-aleph`

Verified starting commit: `8604d93a86353b846b955b0a063ff9ac7d9aeea4`

Verified starting tree: `c1a5d1b10700bff0edbe5b63475c00c8f35bdc21`

Branch: `agent/slice-07-semantic-review-design-20260912`

Starting worktree: clean, including nonignored untracked files

Primary future owner: Core prompt and semantic-harness owner

Proposed future format: `1.7.0-provisional`

Proposed cumulative capability: `semantic-unit-review`

Proposed deterministic surface: `K2.19 — semantic subject and review accounting`

## 1. Authority, exact base, and present effect

This document is an implementation design, not an operative Core contract.
Its schemas, prompts, capability, checks, and write rules activate only after
separate adoption of exact proposal bytes and explicit implementation
authorization. This delivery creates neither record. No Slice 7 behavior,
Slice 8 work, replay, or merge is authorized by this file.

“Slice 7” means calibration implementation Slice 7, not pipeline S7. Pipeline
S6 remains the evidence-role pass; calibration Slice 6 supplied representation
and material-use contracts. Those two uses of “S6” are not interchangeable.

### 1.1 Verified base and authority chain

Origin is `https://github.com/0xHoneyJar/loa-aleph.git`. Local HEAD, tree,
branch, cleanliness, and ancestry were checked before authoring. HEAD is the
exact required Slice 6 merge, with parents
`41fe5cf001d7264a073af3832def3de740fd5f9f` and
`c0ec43142710f39d50e7b7681760209112a0e17c`. A read-only GitHub query confirmed
repository identity, PR #52 merged, and that exact merge SHA. No alternate
base, stash application, worktree switch, reset, or history substitution was
used.

| Dependency | Reopenable authority / integration checkpoint |
| --- | --- |
| Architecture | `ADOPTED-architecture-decision.md` binds proposal blob `95156a8f7292965cc2f9eef0efd8811f20ae02d8`; preparation of bounded slices is authorized, execution is separate |
| Slice 1 | PR #41 describes adopted exact-evidence implementation; merge `98d0b970601534276a58add14128d740407d8909` is an ancestor |
| Slice 2 | PR #42 describes human-adopted source-walk implementation; merge `fc6f161952e90e23723845e2de700add7455ab1c` is an ancestor |
| Slice 3 | Adoption binds proposal blob `df65a39c39672178dd5e383a7da8aa29c2a4f8ed`; implementation merge `a00e5ee4298f23d60352583904cf42d29caaaac7` is an ancestor |
| Slice 4 | Adoption binds proposal blob `51af0df8e3f44201a086169c5ce1fe02050ff8a9`; implementation merge `e136a3fbbf8bc503f3e65e9850e9289f29531981` is an ancestor |
| Slice 5 | Adoption binds proposal blob `e59f9a0eabd84f71b0b32b3038686cb08fa287d4`; separate authorization and implementation merge `41fe5cf001d7264a073af3832def3de740fd5f9f` remain controlling |
| OQ-01 | Adoption binds proposal blob `536a4e447922ae6c606654de403b1fd725e99b1c`; merge `7944964393aab98416772f6a37be967d9ffdece2` is an ancestor |
| Slice 6 | Adoption `e45a1d9b1cafc5ef3b6a1fb46a61a8a395d45770`; authorization `1a8fcdecb4e554e116828166dc5e806851d9e499`; adopted proposal blob `9a09d9224840882cfc5752e68d24fe40464e6a98`; exact required merge above |

Every proposal blob listed above was compared with the current file bytes and
matched. Slice 1/2 authority is retained through the architecture, merged
contracts, and their PR records; this proposal does not invent separate
historical adoption declarations for them.

### 1.2 Authority and actual surfaces consulted

Paths below resolve at the starting commit. Basenames grouped after a
directory belong to that directory. The identified adopted proposal governs
its contract; dated implementation descriptions are evidence about their
named checkpoints, not new authority.

| Paths | Governing use |
| --- | --- |
| `AGENTS.md`; `README.md`; `docs/architecture/13-build-handoff.md` | Builder boundary, independent audit, manual-only sanction, frozen fixtures |
| `docs/decisions/0001-projection-as-separate-downstream-stage.md`; `0002-routing-as-per-cluster-not-global-stance.md`; `0003-architecture-build-kit-implementation.md`; `0004-core-adapter-and-bundle-boundary.md` | Neutrality, structural/semantic/authority separation, exact evidence, one immutable Core |
| `core.manifest.json` | Current inventory, classification, format, manual binding, adapter lifecycle |
| `calibration/src-001/core-design-basis/ADOPTED-architecture-decision.md`; `PROPOSED-architecture-decision.md` | Adopted sequence and design-only authority |
| Same directory: `SRC-001-implementation-slice-plan-20260813.md`; `SRC-001-independent-calibration-delta-architecture-decision-20260813.md`; `SRC-001-calibration-delta-correction-addendum-20260813.md` | Exact Slice 7 purpose, narrowed SL-01–04, variance and do-not-encode rules |
| Same directory: `ADOPTED-correction-and-effective-state-decision-20260815.md`; adopted Slice 3, 4, 5, OQ-01, and Slice 6 records and their identified proposals | Immutable history, lineage, non-evidentiary relations, ambiguity, human procedure, material limitations |
| Same directory: `AUTHORIZED-slice-6-implementation-20260911.md`; `docs/architecture/18-slice-6-implementation-reconciliation.md` | Slice 6 implementation boundary and carried findings |
| `docs/architecture/04-pipeline-stages-and-dod.md`; `08-runbook-agent-mode.md` | Existing S2/S3 and composite S4 closure |
| `docs/architecture/prompts/orchestrator.md`; `workers-intake-extraction.md`; `workers-judgment.md`; `verifier-lenses.md`; `README.md` | Current duties, exact output exemplars, allowlists, common frames |
| `docs/architecture/templates/03-extraction-claims.md`; `07-verification.md` | Exact evidence, source walk, claims, lineage, relation/use receipts, VER records |
| `scripts/lib/run-model.ts`; `worker-return-contract.ts`; `lineage.ts`; `relations.ts`; `internal-ambiguity.ts`; `source-representation.ts`; related K2 modules | Cumulative registry, strict JSON, exact subjects, availability and retained-state checks |
| `adapters/loa/src/worker-bundle.ts`; `worker-return.ts`; `worker-dispatch.ts`; `ledger-writer.ts`; `run-control.ts`; `core-loader.ts`; `types.ts` | Actual bundle assembly, dispatch acceptance, single writer, material reservations, pinned resume |
| `docs/fixtures/exact-evidence-fragments/`; `source-walk-accounting/`; `lineage-accounting/`; `typed-relations/`; `internal-ambiguity-lifecycle/`; `formal-layout-bindings/`; `evidence-role-adversarial/` | Current evidence, provenance, review, and compatibility shapes |
| `package.json`; `packaging/build-runtime-js.ts`; `runtime-js/` | Existing validation entrypoints and generated ES2022 projection |

The exact slice-plan section names S2/S3 semantic review and dependencies 1–6.
Its historical final-order section puts intake before replay; the separately
adopted architecture proposal explicitly changes that order to replay before
intake. Neither subsequent activity is part of this design.

The independent calibration audit narrows human wording changes to acceptable
variance where warranted. Counts, preferred final wording, graph density,
claim IDs, antecedents, and calibration answer cases are not generic policy.
OQ-01's later adopted procedural limits govern over earlier summary language
suggesting that a human could select source meaning.

### 1.3 Verified current manifest and runtime

The baseline declares Core `0.1.0-provisional`, adapter protocol
`1.0.0-provisional`, run format `1.6.0-provisional`, and cumulative capabilities
through `formal-layout-bindings`. Loa is structurally implemented/READY,
unvalidated and unsanctioned; Hermes remains planned/NOT-READY. Manual mode is
the only sanctioned execution path.

Baseline `validate-core-boundary` passed CB1–CB10: 606 classified files, 384
Core files, and 163 administration files. Baseline content digests:

| Surface | SHA-256 |
| --- | --- |
| Core | `428f449aaeb957d9b3449a76a7e8cf81f8c7302571004786d0bca6a4de44d37d` |
| Checker | `628eaf6e09ebde4690e1d389b40a214f4c097f487ecdd578c0ae61ef780180d3` |
| Loa adapter | `f7db89525517e08fa23078d8a2377e14e522b0bff9caedd77a1aa425cf542bed` |

`runtime:check` passed for all 38 generated files. Its first restricted
invocation failed with subprocess EPERM; the unchanged check passed with
subprocess permission. That failure is not a source defect. No runtime build
or retained-run execution was needed for this design.

## 2. Decision and scope

Propose one Core semantic sidecar contract and one fresh lens, L2S, for every
S2 packet candidate group and every S3 claim/no-claim candidate. The sidecar
makes the proposed assertion, its source-bound semantic facets, context
membership, and unresolved findings inspectable. It does not replace packet
bytes, claim text, material-use receipts, lineage, relations, S5 dispositions,
S6 evidence edges, or the independent gap review.

Atomicity is a semantic judgment about independently adjudicable assertions.
A sentence, line, paragraph, packet, or grammar clause is not an automatic
atomic unit. A packet may remain one exact line while two claims cite distinct
parts of it. Attribution, comparators, measurements, and conditions may be
inseparable from a proposition without becoming additional independent facts.

The reviewer attacks the producer's decomposition and preservation of
meaning. Code can verify that the proposed decomposition and review agree
about their identity. It cannot choose a decomposition.

A narrow dependency is unavoidable at S4: an already-authorized lineage
successor is a new claim and cannot inherit a predecessor's semantic review.
It receives the same S3 preservation review before C1. This does not decide
whether two claims should merge or duplicate, change L3, inspect the global
inventory for equivalence, or implement Slice 8.

## 3. Preserved findings and status

PR #52's retained body reports the independent verdict
`READY_FOR_SLICE_6_IMPLEMENTATION_MERGE_WITH_FINDINGS` for head
`c0ec43142710f39d50e7b7681760209112a0e17c`, tree equal to the starting tree.
The following are carried findings, not findings newly audited or closed by
this producer:

| Finding | Required disposition |
| --- | --- |
| F-03 | OPEN: canonical accepted-worker-return → LedgerWriter/orchestrator production reachability remains unproven |
| F-04 | OPEN: path/case/platform portability remains unresolved |
| F-05 | OPEN and bounded by F-03 |
| S5A4-02 | DEFERRED; broader K2.6/K2.7 activation is not repaired |
| S5A4-03 | DEFERRED; the existing ad-hoc S3 exit recognizer is not repaired |
| S5A2-03 / S5-A-03 | DEFERRED; no generic resume-time full validation or broader review-subject closure |
| Slice 6 A-01 | Reserved-marker edge outside canonical source paths; nonblocking/fail-closed; no repair |
| Slice 6 A-02 | Synthetic provenance-label wording; no historical fixture rewrite |
| Slice 6 A-04 | Committed-fixture end-to-end material-review coverage gap; new Slice 7 cases do not close this finding |
| Slice 6 A-05 | L2F empty `candidate_evidence` is currently enforced at Loa-host level; carried without generalizing its validator |
| Slice 6 A-03 | Closed observation about self-reported totals; do not reopen or strengthen it |
| Slice 6 A-06 | Accepted render-log identity-disclosure observation; preserve the existing material view |

Other adopted MUST PRESERVE/LATER items remain at their prior strength.
In particular A4-07's absence of a canonical claim-to-claim evidential edge
owner is not filled by Slice 7. Result/interpretation associations below are
source-composition annotations, not support edges.

No future PASS here establishes replay validation, semantic validation of
SRC-001, agent sanction, acceptance, production readiness, golden, or v1.
SRC-001 remains `CLOSED_FOR_CALIBRATION`; SRC-002 remains `NOT_AUTHORIZED`.

## 4. Activation and compatibility

Future implementation adds `1.7.0-provisional` and `semantic-unit-review` to
the existing `RUN_FORMAT_CAPABILITY_ADDITIONS` registry. Activation is
`hasRunCapability(version, 'semantic-unit-review')`, never equality to the
newest format. The explicit 1.6 entry must remain when CURRENT advances;
all 1.1–1.6 capabilities remain cumulative.

The capability requires the semantic ledger once S2 is entered, a semantic
entry exists, or retained execution has reached S2 or later. Before that, an
absent ledger is legal. An empty initialized ledger is legal before the first
candidate. Unknown versions fail under the existing format contract.

New reserved markers are `aleph-semantic-review/v1`,
`aleph-semantic-subject/v1`, `aleph-semantic-assignment/v1`,
`aleph-semantic-result/v1`, `aleph-semantic-stage-seal/v1`, and
`semantic_review_closure_hash`. Their canonical artifact locations are
defined below. In predecessor 1.0–1.6 runs, injected semantic ledger,
subject/result files, or operative closure fields fail capability validation;
incidental strings inside frozen corpus bytes remain data. Do not widen or
repair the existing Slice 6 A-01 detector while adding this bounded rule.

Retained runs keep their original Core, checker, profile, bundle, and runtime.
There is no in-place upgrade, migration, profile backfill, re-review of
accepted historical runs, or reinterpretation under newer Core. New code may
test legacy fixture compatibility, but resumption executes the retained
runtime. New 1.7 profiles require L2S; old profiles do not.

## 5. Exact grammar and semantic ownership

All new objects are closed: every listed key is required and unknown or
duplicate keys fail. No optional freeform extension map exists. Canonical JSON
is UTF-8, compact, listed key order, no BOM or terminal newline. JSON strings
preserve Unicode and whitespace exactly; no text normalization. Reject
unpaired surrogates and duplicate members using the existing strict Core
parser. Integers are safe nonnegative decimal integers without sign, exponent,
fraction, or negative zero. Positive ordinals start at one. Hashes use
`sha256:` plus 64 lowercase hex digits.

Run-local `SEM-NNNN` and `SMR-NNNN` IDs use the Slice 6 new-ID grammar:
uppercase prefix, hyphen, at least four decimal digits, at least one nonzero.
Existing PKT/CC/LIN/VER/USE/OBJ/etc. grammars are unchanged. Subject-local
`A1`, `U1`, `C1`, `F1` identifiers are contiguous positive decimal ordinals
without leading zeroes, in array order, and have no cross-subject meaning.
Use JSON null only where specified; absence is never an omitted key.

Every field below has two distinct owners: a producer proposes its semantic
content and L2S challenges it; Core owns only serialization, references, and
structural invariants. The orchestrator can allocate IDs, reopen bytes, and
serialize mechanically, but cannot fill missing semantic fields from prose.
Humans do not select correct semantic values through authority gates.

### 5.1 Source anchors

An anchor is a precise selection within a mechanically reopenable frozen
source locus, not a new packet or locator scheme:

```text
Anchor = {
  anchor_id, source_id, source_hash, locator, span_hash,
  start_byte, end_byte, selection_hash, exact_bytes_base64, packet_ids
}
```

`locator` retains the source's existing Core scheme (currently exact
`md-lines`). `span_hash` hashes that whole locus. Absolute half-open UTF-8
byte offsets select within it; bytes and `selection_hash` must match the
source and may not split a code point. `packet_ids` is an ordered unique
subset of the subject's packet basis whose exact fragments cover that
selection; it is empty for inspection-only unpacketed context. At least one
packet must fully cover a proposition-bearing anchor used by a canonical
claim. Source/fragment/evidence hashes are independently reopened.

An anchor is not a declaration that its content supports a proposition.
An empty `packet_ids` never imports the surrounding text as evidence.
Load-bearing source context for a claim must first obtain exact packets.
AST/rendering bytes are not admitted through this text-anchor type: they are
addressed exclusively by existing `material_use` requirement indexes and
the Slice 6 bounded view.

The raw producer type is exactly
`AnchorInput={anchor_id,source_id,locator,start_byte,end_byte,exact_bytes_base64}`.
The orchestrator computes the remaining hashes and packet bindings from the
frozen source and reserved/materialized exact evidence. It cannot change
the selection or source bytes. Sealed subjects contain all ten keys in
Anchor order above.

### 5.2 Repeated semantic field envelope

Each semantic facet below uses this exact envelope:

```text
Facet<T> = { state, items, basis_anchor_ids }
state = present | not-expressed | CANNOT_DETERMINE
```

`basis_anchor_ids` is nonempty, unique, and in anchor order. For `present`,
`items` is nonempty and every item's anchors are included in the basis.
For `not-expressed`, `items=[]`; the producer claims only that the bounded
unit/context expresses no such facet. This is not a world-level absence
claim. For `CANNOT_DETERMINE`, `items=[]` and an unresolved finding must name
the exact facet path. Source-silent scope does not require invented population,
date, or geography. Partial uncertainty is preserved by a finding naming the
unknown dimension; known items may be retained in a `present` facet only when
the finding explicitly identifies the remaining unknown dimension.

Each item uses `{kind, source_text, anchor_ids}` unless an exact extension is
specified below. `source_text` is the UTF-8 decoding of exactly one named
anchor; that anchor is first in `anchor_ids`. Additional anchors provide
necessary context without silently concatenating text. Interpretation of
`kind` is semantic. Code checks exact source-text equality and legal enums,
not whether that label is correct. Item order is source-anchor order, then
kind in ASCII order for the same anchor; exact duplicate items fail.

### 5.3 Atomic units and closed facet vocabularies

```text
AtomicUnit = {
  unit_id, proposition, proposition_anchor_ids,
  claim_roles, scope, conditions, qualifiers, modality, attribution,
  comparator, metric
}
```

`proposition` is nonempty proposed normalized text, never exact source text
by declaration. `proposition_anchor_ids` is nonempty, unique, in anchor
order. Every facet key is present even if its state is `not-expressed` or
`CANNOT_DETERMINE`. This requires explicit review slots, not fabricated
semantic values.

| Facet | Exact item `kind` enum | Meaning / boundary |
| --- | --- | --- |
| `claim_roles` | `result-observation`, `method-procedure`, `interpretation-inference`, `background-context`, `definition`, `recommendation`, `attribution-report`, `limitation-uncertainty` | Roles of the proposed assertion/content, not claim–source support weights |
| `scope` | `population`, `temporal`, `geographic`, `experiment-task`, `document-universe`, `quantified`, `exclusion-restriction` | Only source-expressed restrictions; missing dimensions remain unspecified |
| `conditions` | `condition`, `precondition` | Explicit conditions under which this unit holds; never inferred operating assumptions |
| `qualifiers` | `degree`, `frequency`, `approximation`, `limitation`, `comparative`, `exception`, `confidence-uncertainty` | Preserve source force; no hedge deletion or added confidence |
| `modality` | `observed-descriptive`, `possible`, `capable`, `normative-should`, `obligatory-must`, `intended-designed`, `predicted-expected`, `hypothetical`, `counterfactual`, `recommended` | No possibility-to-actuality or recommendation-to-fact conversion; spelling is not a lexical classifier |
| `attribution` | `source-author`, `quoted-entity`, `cited-external-in-corpus`, `reported-belief-opinion`, `system-model-interpretation` | Speaker/provenance of the assertion, not external truth |
| `comparator` | `comparison-basis` | Preserve what is compared, to what, and on which dimension |
| `metric` | `measured-quantity` | Preserve measured result together with its metric and stated unit |

`claim_roles.state=not-expressed` is illegal for an affirmative unit: a
producer must propose a role or acknowledge indeterminacy. Multiple roles are
permitted when inseparable; no automatic one-role-per-claim rule exists.

Attribution items add `attributed_to` after `source_text` and before
`anchor_ids`. It is nonempty source-supported speaker/entity text, or
literal `unspecified-in-source`. For `system-model-interpretation` it is
literal `producer-model`; the anchor identifies the source basis, not a claim
that the source uttered the interpretation. Such a unit cannot be committed
as an S3 source-entailed affirmative claim. Retain it as a rejected/indeterminate
candidate unless a new source-supported proposition receives its own review.
There is no external lookup field or implicit dereference of a cited work.

Comparator items add `subject_anchor_ids`, `baseline_anchor_ids`, and
`dimension_anchor_ids` before `anchor_ids`; metric items add
`quantity_anchor_ids`, `value_anchor_ids`, and `unit_anchor_ids`.
Each array is ordered/unique and included in `anchor_ids`. The first two
arrays in each item are nonempty. The third may be empty when the source does
not express a dimension/unit; an unresolved finding is required if that
absence prevents safe interpretation. No numeric calculation, unit conversion,
or comparator completion is performed by the checker.

These fields distinguish a metric from its result and a comparison from its
baseline without requiring them to become separate assertions. A source
metric definition that is independently asserted may instead be another
unit, with a context/coupling record.

### 5.4 Context records

```text
Context = {
  context_id, kind, applies_to_unit_ids, anchor_ids,
  material_requirement_indexes, use
}
kind = necessary-local | attribution | definition-terms | condition-scope
     | representation-layout | discourse
use = required-for-interpretation | inspection-only | non-evidentiary
```

`applies_to_unit_ids` is nonempty and unit-ordered. At least one of
`anchor_ids` or `material_requirement_indexes` is nonempty; both lists are
ordered and unique. Requirement indexes are zero-based indexes in the
candidate's existing `material_use.requirements`, not a second material
schema. Only `representation-layout` can use those indexes. A discourse
record defaults to no evidential effect; the producer must explicitly
declare and defend any required interpretive use.

Proposition-bearing bytes belong in `proposition_anchor_ids`; context
records label other needed or considered material. The same bytes can play
both roles only when explicitly referenced in both places and reviewed.
Required textual context for canonical CC content must be packet-covered.
Inspection-only context can provoke a widening request or challenge, but
cannot justify extra content in the claim. Nearby unrelated text should be
omitted; if shown as a distractor it must remain `inspection-only` or
`non-evidentiary`. Proximity is not an evidentiary role.

### 5.5 Atomicity and source-composition couplings

```text
Semantics = {
  atomicity, units, contexts, couplings, relation_proposals,
  unresolved_findings
}
atomicity = single-assertion | multiple-separable | inseparable-context
          | CANNOT_DETERMINE | no-claim
Coupling = { kind, unit_ids, anchor_ids, treatment }
kind = result-interpretation | attribution-content | comparison-comparator
     | metric-result | condition-claim | required-context
treatment = keep-distinguishable | keep-together | CANNOT_DETERMINE
```

Units and contexts use their exact schemas above. Coupling arrays preserve
source order; duplicate tuples fail. `unit_ids` is a nonempty ordered subset
of the units, and `anchor_ids` is nonempty. `keep-distinguishable` names at
least two units; `keep-together` names exactly one. An indeterminate treatment
requires a finding and cannot authorize an affirmative normalization.

`single-assertion` or `inseparable-context` has exactly one unit.
`multiple-separable` has at least two. `CANNOT_DETERMINE` may retain any
number of tentative units; none is authorized as an affirmative claim.
`no-claim` has no units, contexts, or couplings and still requires exact
basis anchors plus a fresh no-claim review. It is not a way to discharge
uncertainty by relabeling it absence.

A source may grammatically combine an observation and its interpretation.
The producer can represent two units and their `result-interpretation`
coupling, or one explicitly multi-role unit if inseparable. L2S must attack
the decision. A coupling records how this source passage composes assertions;
it does not mean one claim proves another, confer corroboration, or create a
new Slice 4 relation family.

### 5.6 Structured unresolved findings

```text
Finding = {
  finding_id, field_path, code, anchor_ids, material_requirement_indexes,
  unknown_dimension, missing, requested_context
}
code = atomicity-indeterminate | context-insufficient | scope-indeterminate
     | condition-indeterminate | qualifier-indeterminate | modality-indeterminate
     | attribution-indeterminate | role-indeterminate | referent-unresolved
     | comparator-indeterminate | metric-indeterminate | material-unavailable
     | relation-deferred | interpretation-unsupported
```

`field_path` is exactly one of section 9's enumerated coverage paths for
this subject, including `/material_use` when appropriate. No arbitrary
pointer or implementation-chosen nested field matcher is allowed.
`unknown_dimension` is `none`, a scope-kind enum, or `comparison-dimension`
or `measurement-unit`. `missing` is nonempty explanatory text; it cannot
select an answer or authorize a write. `anchor_ids` and requirement indexes
obey the same rules as context; their union is nonempty.
`requested_context` is an ordered array of exact
`{source_id, locator, purpose}` objects; purpose is `local-context`,
`same-source-referent-search`, or `material-inspection`. Requests may be
empty when frozen evidence cannot supply the missing material.

These are requests, not admitted context. They may name only already frozen
sources legal for the role. No URL, new source, answer-key locator, wildcard,
or outside-corpus candidate is accepted. A whole-source referent request
routes to the existing Slice 5 bounded search procedure, not automatic
expansion of an L2S bundle. The source and its result receive new exact
subjects if subsequently supplied.

### 5.7 Per-field implementation obligations

The mutation IDs refer to section 18. Every field family has an explicit
review task and structural test; no truth test is implied.

| Field family | Semantic owner and reviewer attack | Evidence / absence | Structural rule and mutations |
| --- | --- | --- | --- |
| Atomicity / units | Extractor or normalizer; L2S attacks independent adjudicability and material conflation | Packet/source anchors; indeterminate and no-claim are distinct | Cardinalities and references only; M01, M02, M05, M15 |
| Proposition | Normalizer; L2S attacks additions and strengthening | Exact packet anchors; absent only in no-claim/zero-unit indeterminate | CC text equals sealed sole proposition; M04, M05 |
| Context | Producer; L2S attacks missing necessary and spurious nearby context | Anchors or existing material requirements; empty contexts legal | Legal source boundary, packet coverage, index resolution; M03, M04, M09 |
| Scope | Producer; L2S attacks widened population/time/task/universe | Facet's source basis; absent/unknown explicit | Closed kinds, no forced unspecified dimensions; M01, M02, M05 |
| Conditions | Producer; L2S attacks conditional-to-unconditional changes | Exact source condition anchors | Required key/envelope; M11, M05 |
| Qualifiers | Producer; L2S attacks strengthened/weakened force | Exact qualifier anchors | Required key/envelope; M10, M05 |
| Modality | Producer; L2S attacks actuality/normative/intention leakage | Exact source basis | Closed enum and state, not lexical inference; M13, M05 |
| Attribution | Producer; L2S attacks speaker substitution and imported authority | Frozen attributed words or explicit producer-model label | Speaker field and source binding; M12, M05 |
| Claim roles | Producer; L2S attacks result/interpretation and role conflation | Frozen basis; unknown visible | Closed content-role enum; S6 edge labels forbidden here; M14 |
| Comparator / metric | Producer; L2S attacks lost baseline, unit, or measured quantity | Named role-specific anchor subsets | Reference/cardinality rules, no arithmetic; M03, M05 |
| Couplings | Producer; L2S attacks material distinction or inseparability | Source anchors; unknown finding | Treatment/cardinality; no support semantics; M02, M15 |
| Relation proposals | Existing local relation producer; L2S challenges use in the unit; L3R owns canonical relation review | Existing Slice 4 subject and Slice 6 use | Existing stage/type/endpoint matrix; M03, M16 |
| Unresolved findings | Producer and reviewer independently; no human semantic selection | Exact subject field and missing source/material basis | State/closure consistency, legal requests; M15, M17 |
| Material use | Existing producer/L2F; L2S attacks whether declared needs omit meaning-bearing material | Existing `material_use`, USE and bounded view | Delegate availability, hashes and receipts to Slice 6; M04, M18 |
| Subject/provenance/prompt/profile | Core constructs, host transports; reviewer cannot rewrite | Exact immutable inputs | Recompute digest, match records and pins; M05–M09 |

## 6. Evidence-role reconciliation

The adopted S6 edge roles remain exactly `load-bearing`, `corroborative`,
`contradictory`, `contextual`, `decorative`, `unresolved-source`, with their
existing removal effects and verification vocabulary. The existing
`claim_type` remains `factual`, `design-intent`, `constraint`, `preference`,
`open-question`. Neither enum is renamed or expanded.

`claim_roles` is explicitly a content-function annotation, needed by
SL-01/04. It never writes `ledgers/evidence-roles.md`, predicts an edge's
weight, changes `claim_type`, or mechanically assigns an S5 disposition.
For example a source-author interpretation may be packet-entailed as a
report of that interpretation; it is not thereby a direct observation or
independent support for its conclusion.

S6 receives the reviewed claim facets as read-only preservation/challenge
context alongside its existing legal inputs. It independently judges the
CC×SRC edges and removal effects. No map from `result-observation` to
`load-bearing`, from `background-context` to `contextual`, or from relation
count to corroboration is allowed in Core or an adapter.

## 7. Exact producer-return integration

Keep the current Extractor/Normalizer return members, including all Slice 6
`material_use` objects. The 1.7 return adds exactly one root member:

```text
semantic_units: [{
  output_kind, output_index, review_mode, origin_unit_refs, anchors, semantics
}]
output_kind = packet-candidate | claim-candidate | no-claim-candidate
            | material-candidate
```

`output_index` is a zero-based index into the same return's `packets`,
`claims`, `no_claim_packets`, or `material_findings`, respectively.
The extractor permits packet/material candidates; the normalizer permits
claim/no-claim/material candidates. Exactly one semantic entry must exist
for each item of each applicable array, including degraded candidates;
duplicate selectors, unaccounted outputs, or entries for another role fail.
Selectors and entries are sorted by that listed kind order then index.

`review_mode` is `proposal` or `unresolved-record`, chosen explicitly by the
producer; the latter follows section 9.1. `origin_unit_refs` uses section
15.1's exact grammar, with `[]` for S2 and material-only candidates. The
normalizer supplies the mapping, and Core checks references/coverage without
inventing a semantic mapping.

`anchors` uses AnchorInput from section 5.1. Core completes it mechanically
against the output reservation; no semantic field is filled by Core. The
saved raw return is immutable and distinct from the completed subject.

For an exact packet candidate, one semantic entry describes its ordered
fragment group. Canonicalization still produces one PKT per fragment.
Existing PKT/USE materialization rules apply to each packet: if a returned
requirement is not valid for that packet's basis, refuse it; do not infer a
per-fragment requirement split. A producer can return separate candidates
with explicit valid declarations. This does not change source-walk
positions, shared-position ordinals, or gap accounting.

For a claim candidate, the normalizer's `normalized_claim` must exactly equal
the sole unit proposition for affirmative use, and `packets` equals the
sealed packet basis. A proposed multi-assertion claim is retained for review
but cannot become one canonical affirmative CC; the producer must return
separate candidates after the challenge. This cardinality rule enforces the
producer's own declaration; code does not decide whether an undeclared
compound assertion is actually compound.

A no-claim candidate binds the existing packet/no-claim proposal and has
`atomicity=no-claim`. It must undergo L2S before its existing LIN no-claim
event can close packet accounting. A degraded/material candidate uses
`atomicity=CANNOT_DETERMINE` and preserves its existing OBJ/USE limitation;
it does not obtain a fictitious PKT or CC.

`relation_proposals` contains exactly
`{subject,review_subject_digest,material_use}` for each proposal. `subject`
is the existing complete fixed-order `aleph-relation-review-subject/v1`
object, including all 14 pre-review fields; its digest and existing
MaterialUseInput are unchanged. This is a projection of the existing Local
Relation Producer contract. Rationale/flags remain in the retained raw
relation-producer return and are never embedded in semantics or L2S context.
Core validates this projection through Slice 4/6 contracts. No new relation
enum, REL ID, or authority field is returned by these workers.
An empty array means no local proposal was made, not that no relation exists.
Explicit absence remains a separately typed and reviewed Slice 4 proposal.

A reserved CC is not a materialized Slice 4 endpoint. A new claim return can
therefore have no claim-level relation proposals yet, while still declaring
all necessary context/facets. Later local relation proposals over admitted
claims remain separately retained under Slice 4; they are not inserted into
an old SEM. If the claim's meaning-bearing fields must change, produce a new
bounded successor and semantic subject. Reservation never relaxes the
existing relation endpoint-existence or stage rules.

Raw producer rationale, notes, flags, or display prose cannot substitute for
any field in the structured semantic contract.

## 8. Immutable review subject and invalidation

Core constructs, serializes, and hashes this exact object in listed order:

```text
SemanticSubject = {
  format, semantic_id, owner_stage, subject_kind, review_mode,
  predecessor_semantic_id, producer_binding_hash, run_binding,
  prompt_parts, reviewer_profile, output_binding, origin_unit_refs,
  origin_context, packet_basis,
  anchors, semantics, material_use, material_views,
  lineage_context, relation_context, ambiguity_context, context_manifest
}
format = aleph-semantic-subject/v1
owner_stage = S2 | S3 | S4
subject_kind = packet-group | claim | no-claim | material-only
review_mode = proposal | unresolved-record
```

`semantic_id` is reserved before review. `predecessor_semantic_id` is `none`
for a first candidate or one retained SEM in the same run; chains are acyclic,
single-parent, and do not supersede PKT/CC identities. Alternative revisions
can reference one predecessor, but only one can discharge the same proposed
output reservation. Others remain visibly non-admitted.
This predecessor links proposal revisions only. Multiple claim predecessors
belong to `lineage_context`/`origin_unit_refs`, not a fabricated SEM merge.

`producer_binding_hash` hashes the retained producer identity tuple in this
order: `{call_id, context_id, raw_return_hash, output_kind, output_index}`.
The tuple is retained with process evidence, not exposed to L2S as a producer
rationale or identity hint. In manual records the call/context values are
distinct recorded pass identifiers, explicitly labeled as manual evidence.
The checker verifies the declared binding; it cannot authenticate a human's
or model's cognitive separation.

`run_binding` has exactly `{run_id, run_format_version, core_digest,
checker_digest, bundle_digest, runtime_snapshot_digest}` from the retained
execution identity. `prompt_parts` is the ordered list of
`{path, selector, digest}` for the exact common preamble, L2S frame, L2S
charter, bounded stage excerpt, semantic contract, and Slice 6 material
constraint block. Selectors use the existing Core-part grammar; bytes must
resolve under the pinned lock. No producer prompt history is included.

`reviewer_profile` is `{profile_id, profile_digest, role, model_identity}`.
Role is `verifier-l2s`; `model_identity` is the existing exact pinned model
identity object, including its declared effort/context information. The
profile and effort floor must agree with the run's existing role-mapping
contract. Changing role/model/profile or any prompt bytes requires a new
subject; no fallback model can inherit a verdict.

`output_binding` is one closed variant:

| Kind | Exact fields, in order |
| --- | --- |
| packet-group | `{kind, evidence_keys, packet_ids}`; ordered group produced by this candidate |
| claim | `{kind, reserved_claim_id, normalized_claim, packet_ids, source_ids, claim_type}` |
| no-claim | `{kind, packet_id, basis}`; `basis` is the existing no-claim proposal text, treated as proposed content to challenge |
| material-only | `{kind, object_id}`; source-bound existing OBJ, no future CC/PKT identifier |

The writer reserves a new CC identity before reviewing its proposed bytes.
Reservation is not admission, acceptance, or a future answer key. L2S may
receive that candidate identity because exact write comparison requires it.
It receives no downstream accepted-ID mapping or unrelated final inventory.

`origin_unit_refs` is the exact producer-supplied list from section 7.
`origin_context` contains direct projections
`{semantic_id,subject_digest,owner_stage,output_binding,anchors,semantics,
material_use,material_views}` from the prior subjects named by those
references, unique in first-reference order. Exclude their own origin
contexts, reviewer results, resolutions and hidden rationale. Include only
groups actually used by this output. Their exact selected context is part
of this new seal; no unrelated origin group may be added. Prior proposal
fields are challenge context, not inherited certification. Core checks
each projection against the retained complete subject/hash and rejects
reference cycles without recursively attaching ancestor histories.

`packet_basis` is an ordered array of
`{packet_id, packet, evidence_record, fragments, transformations}`.
`packet` contains exactly the T3.1 fields in template order;
`evidence_record`, fragments, and transformations contain their existing
exact T3.1 column names/values in column order, without Markdown escaping.
Every group member's complete evidence record is present; fragment order
and framed evidence hash remain unchanged. Transformations are separately
labeled display/normalized outputs. Never substitute them for exact bytes.
Canonical JSON array cells are decoded as JSON; other table cells stay
strings. The binding also includes packet previews, so changing displayed
candidate context cannot silently reuse a review.
For a CC, this array equals its output packet provenance in order. Additional
relation-target packet context goes in `relation_context`, never this basis.

`material_use` is the exact existing producer `MaterialUseInput` belonging to
the selected output. For no-claim it is JSON null, with its packet's existing
use retained in `material_views`. `material_views` contains ordered
`{use_subject, use_subject_digest, view}` entries for applicable reserved or
committed PKT/CC/OBJ uses. `use_subject` and `view` are the existing Core
Slice 6 subject and bounded review-view objects, losslessly serialized;
their bytes/digests must recompute from the frozen inventory. An entry for a
reserved use omits only its future VER receipt, exactly as Slice 6 already
does. No S7-specific coordinate, availability, rendering, or limitation
taxonomy is created.

For a packet group, its candidate material declaration is reviewed over the
group's packet union, while each canonical PKT receipt must independently
meet the existing per-PKT contract. The group review grants no extra packet
capture capability. Additional context requiring unavailable material
produces a finding; it cannot expand or rewrite a committed PKT receipt.

`lineage_context` is an ordered array of
`{lineage_id,row_digest,event,unit_definitions}`: only the direct
predecessor event/definitions needed for this proposed successor.
`event={owner_stage,type,predecessors,successors}` uses existing enums and
ordered ID arrays; `row_digest` binds the complete existing row. Do not
show its freeform basis or actor metadata. Each unit definition is
`{kind,id,projection}`, where PKT projection is the Slice 6 PKT subject
projection and CC projection is its CC projection. No disposition,
judgment rationale or downstream field is included. No ancestor graph
walk. New claim provenance from packets is not a lineage event. Empty is
normal for first S2/S3 candidates.
A not-yet-committed lineage event must be the exact reserved event supplied
by the already authorized producer/judgment step, with existing current
predecessors and explicitly reserved successors. Hash its complete proposed
row and commit it with the corresponding admissible successor transaction.
Do not pretend that a reserved LIN row is already canonical or invent a
lineage event solely to populate review context.

`relation_context` contains ordered
`{proposal_index,target_units,target_anchors,target_packet_context}` entries derived from
`semantics.relation_proposals`. Target units use the exact direct
`{kind,id,projection}` shape above; target anchors use Anchor. Include
only the explicitly proposed concrete endpoints. `target_packet_context`
uses the packet_basis entry shape but is inspection context, not additional
claim provenance. Target anchors outside the output packet basis have
`packet_ids=[]`. Never perform an automatic relation graph walk. Null
targets have empty target lists. Every entry must satisfy the earlier
stage's source/batch bounds. This supplies reopenable context for testing
the proposed target, not a second editable relation list.

`ambiguity_context` is an ordered array of
`{kind,reference,digest,projection}`. Kind is `semantic-finding` or
`slice5-working-subject`; projection is respectively an exact Finding
from an identified retained SEM/VER or the existing
`aleph-internal-ambiguity-review-subject/v1` working subject. Reference is
the exact canonical run-relative file plus JSON Pointer and byte digest;
the digest hashes the canonical selected object. Include its source
anchors/search basis as explicit legal context. Do not include T5.3,
authority responses/observations, producer rationale or material-impact
decisions. References must concern a subject unit or anchor. Canonical
T5.2 does not yet exist at S2/S3 or S4 pre-C1. This field allows working
findings only, not early canonical ambiguity writes or post-C2 revisions.

`context_manifest` lists `{path, selector, digest, purpose}` for each exact
run-data component supplied in this subject. Purpose is `packet-evidence`,
`inspection-context`, `material-context`, `lineage-context`,
`relation-context`, or `ambiguity-context`. It is generated from the above
components, cannot add an attachment, and excludes the subject file itself
to avoid recursive hashing. Source-locus selectors include exact offsets.
Asset selectors identify the existing Slice 6 asset/hash. Entries sort by
path then selector using UTF-8 byte order; duplicates fail.
The run-data selector grammar is exactly `bytes:<start>:<end>` for raw
source/asset selections, `json:<JSON-Pointer>` for a selected immutable
JSON object, or `row:<table-key>:<zero-based-row-index>` for a canonical
Markdown row. Table key is the literal artifact table heading; its unique
presence is required. Digests hash the selected raw bytes, canonical JSON
value, or canonical JSON cell array respectively. No globs, implicit
neighbor rows, or dynamically inferred selectors are legal. These selectors
describe the context manifest; they do not add a source locator scheme.

The subject digest is SHA-256 over the exact canonical JSON bytes above.
Its target string is exactly `semantic-review-subject:sha256:<64 hex>`.
The on-disk file is `verification/harness/semantic-subjects/SEM-NNNN.json`.
No in-place rewrite is permitted. Revisions allocate a new SEM and complete
subject, even when only a qualifier, packet order, material requirement,
local context window, relation proposal, or limitation changes.

Changing load-bearing fields after review makes that review inapplicable.
Core detects the mismatch and refuses use; it does not persist a generic
STALE/INVALIDATED state, retarget reviews, repair fields, or propagate
invalidation through the graph. Later unrelated S5 disposition text is
excluded and therefore does not change a valid S3 subject.

## 9. L2S exact reviewer return and coverage

Add the pinned lens heading
`L2S — atomicity, context, and semantic preservation (S2/S3)` and dispatch
role `verifier-l2s`. Legal invocation is S2, S3, and the strictly bounded S4
successor case in section 13. It uses the existing `refuter` mechanism,
separate context, and effort floor. It has a dedicated Core output contract:

```text
SemanticResult = {
  format, subject_digest, verdict, field_reviews, unresolved_findings,
  attacks_tried, missing_for_determination, rationale, candidate_evidence
}
format = aleph-semantic-result/v1
verdict = upheld | refuted | cannot-determine
FieldReview = {
  field_path, verdict, issue, anchor_ids, material_requirement_indexes,
  explanation
}
issue = none | compound-assertion | lost-context | spurious-context
      | altered-scope | lost-condition | altered-qualifier | altered-modality
      | altered-attribution | conflated-role | result-interpretation-collapse
      | lost-comparator | lost-metric | unsupported-interpretation
      | unresolved-referent | missing-material | illegal-relation-use
      | insufficient-context
```

All fields are required; unknown/duplicate keys fail. `candidate_evidence`
is exactly `[]`, enforced by the **portable Core L2S validator** and native
schema, not a host regex. This new contract does not repair the carried L2F
A-05 surface.

`field_reviews` contains exactly one row for `/semantics/atomicity`,
`/semantics/contexts`, `/semantics/couplings`,
`/semantics/relation_proposals`, `/semantics/unresolved_findings`,
`/material_use`, and each unit's `/proposition`, `/claim_roles`, `/scope`,
`/conditions`, `/qualifiers`, `/modality`, `/attribution`, `/comparator`,
and `/metric`, prefixed by `/semantics/units/<zero-based-index>`.
Rows use this enumeration order. A no-claim review additionally includes
`/output_binding/basis`. This is an enumerated finite coverage rule, not
open-ended arbitrary JSON Pointer evaluation.

Each row uses existing anchors/requirement indexes and nonempty explanation.
At least one binding is required except when challenging an empty structural
collection; in that case the exact field path is the evidence binding.
An upheld row uses issue `none`; refuted/cannot-determine uses a concrete
issue. The reviewer must state an attempted counter-reading, not merely say
the value is plausible. Code checks nonempty shape, not quality of the attack.

`unresolved_findings` uses the exact Finding schema, with fresh reviewer-local
F ordinals. It cannot rewrite producer findings. `attacks_tried` is a
nonempty array of nonempty strings. `missing_for_determination` is null
unless the verdict is cannot-determine, when it is nonempty. `rationale`
follows the existing 1–3 complete-sentence return rule. None of these prose
fields supplies executable authority or bypasses field reviews.

Overall verdict consistency is structural: any refuted row requires
`verdict=refuted`; otherwise any cannot-determine row requires
`verdict=cannot-determine`; otherwise all rows must be upheld. This combines
declared reviewer findings only; it never evaluates source meaning.
Every cannot-determine row has a matching unresolved finding. A refuted
verdict is not silently relabeled cannot-determine or vice versa.
Conversely, each reviewer finding other than `relation-deferred` requires
a refuted/cannot-determine row for the named field. An unexplained finding
cannot accompany an all-upheld result. For unresolved-record review, the
producer's preserved unknowns can be upheld as honestly recorded; any new
reviewer uncertainty about that record still follows this rule.

### 9.1 Exhaustive subject coverage and review consequence

Every candidate selector receives L2S, not a sample. This deliberately
replaces the S3 spot-check minimum for 1.7 only; earlier run formats retain
their own rules. L1 gap review remains separate, and L2F remains separately
required for the material uses it governs. A single L2S record does not
substitute for either lens.

One fresh reviewer is the minimum for each subject. Preserve the current
common cannot-determine escalation to a second fresh reviewer of the
identical sealed subject. All retained assigned reviews participate: any
refuted result prevents admission; otherwise any cannot-determine prevents
affirmative admission. A later upheld vote cannot erase an earlier
indeterminate result. Additional reviews cannot be solicited until a
preferred verdict wins. Budget exhaustion preserves a pending/blocked
review; it is not an implicit outcome.

An upheld semantic review licenses only the unchanged candidate for the
specified next step, subject to all other DoDs. It is not a declaration of
truth or acceptance. Refuted means retain the failure and request producer
revision or a valid existing lineage/no-claim outcome; the reviewer never
writes the correction. Cannot-determine preserves the candidate and missing
basis and blocks that affirmative use.

To record an unresolved state as a completed bookkeeping object, the producer
may propose a new `review_mode=unresolved-record` subject, linked to the
original SEM, with `atomicity=CANNOT_DETERMINE`, exact missing basis and no
affirmative canonical output. L2S can uphold the faithfulness of that
**unresolved record**. This does not turn the original cannot-determine
verdict into upheld, allow its tentative proposition into the inventory, or
waive source-walk/lineage/stage closure. The unresolved record and original
verdict both remain visible.

## 10. Exact context allowlists and withholds

No worker receives the run directory or general filesystem access. The
adapter transports only the Core-constructed view and pinned prompt parts.
The sealed subject is the unit of challenge; batch IDs never authorize a
broader read. These rules apply to attachments, task sentences, tool access,
cached context, and provider/session continuation.

| Role | Allowed run context | Explicitly withheld |
| --- | --- | --- |
| S2 extractor | One complete frozen source and its manifest row; exact S1 criteria; that source's existing Slice 6 inventory/view; source-local primary cursor/walk needed for continuation | Other sources, other extractors' packets, developing CC inventory, dispositions, authority discussions, expected answers |
| S3 normalizer | Assigned current packet group and exact evidence; S1 normalization conventions/criteria; exact source-local windows named in its task; relevant Slice 6 view; upheld S2 unit/context structure | Other batches, global inventory, S5/S6 results, routing/projection, producer hidden context, authority observations |
| S2 L2S | One complete sealed packet-group subject; its exact packet evidence and declared source-local inspection anchors; required material closure; S1 criteria | Full source by default, other packet candidates except explicitly named context, producer rationale/history, CC/final IDs, expected split/answers |
| S3 L2S | One sealed claim/no-claim subject; exact packet basis, explicit context anchors, relevant S2 unit proposal, direct lineage context if needed, material view | Other candidate claims except coupling/context subjects explicitly needed, other batches, global final inventory, prior reviewer verdicts/rationales |
| S4 successor producer/L2S | Exact already-proposed successor, direct predecessor semantic records and provenance union; only source context needed to preserve meaning | Global duplicate search, other merge groups, L3 rationale/verdict preference, relation closure outcomes, downstream narratives |
| Orchestrator | Full run state for scheduling, byte validation, persistence, gates | It may see but must not forward withheld content or author semantic judgments |

Universal withholds for every semantic producer/reviewer are calibration
answers, closed-reference inventories, expected dispositions/claim IDs,
recall quotas, human semantic observations or authority response prose,
downstream narratives, unrelated batches/sources, and hidden reasoning from
another worker. Existing source documents may themselves contain citations,
opinions, or instructions; they are frozen data, never worker instructions.

The L2S attachment allowlist contains exactly one generated subject file and
the exact assets referenced by its embedded Slice 6 view. Packet/source
bytes are embedded or copied as exact bounded selections with identical
hashes. No raw `ledgers/claim-inventory.md`, full relation ledger, control
directory, producer-return file, or full provenance export is attached.
Core checks this closure; adapters do not choose it with semantic regexes.

Identity metadata required by an existing material view remains that view's
documented bounded disclosure (A-06). It never licenses adding producer
reasoning. New producer context/identity tuples remain hash-bound outside
the semantic view.

The task sentence is fixed by Core:
`Challenge only the attached sealed semantic subject under L2S.`
It contains no expected verdict, rationale, or unsealed context.

If context is insufficient, the reviewer returns a structured request/finding.
The orchestrator may assemble a newly sealed subject only from legal frozen
context. It may not append a helpful paragraph to the existing conversation.
Freshness requires a new invocation with no producer or previous-review
conversation reuse. Dedicated full-same-source referent search follows
Slice 5; global/cross-batch relation investigation waits for S4.

The exact source-local window is the union of the named packet spans and
explicit inspection anchors, not an implementation-chosen N-line radius.
Neither producer nor reviewer may silently expand it. Tests verify actual
attachment bytes and task strings, not merely the allowlist's declared names.

For the exceptional full-same-source search, require a retained structured
`same-source-referent-search` request and the exact Slice 5 full-source
completion/search basis before supplying `0..source_length`. Use a new
dedicated invocation of the stage's existing producer role (extractor at
S2, normalizer at S3, bounded successor normalizer at S4), followed by fresh
L2S over the new sealed context. Its task is limited to that one expression,
one source and the existing Slice 5 search rules. It returns a revised
semantic proposal/finding, not canonical T5.1/T5.2/T5.3. This does not
dispatch the C2-only ambiguity role at an illegal earlier stage. If source
completion is not yet available, retain the request as pending; do not
invent a completion record or widen context informally.

## 11. S2 packetization and source-walk integration

1. The extractor returns existing exact fragments/walk/events plus structured
   semantics. Core reopens the fragments; the orchestrator commits valid raw
   PKT evidence, its USE receipts, walk/events and cursor under existing
   capture rules. Capturing evidence does not certify atomicity.
2. Core binds each candidate group to those exact packet/evidence identities,
   constructs SEM, and dispatches fresh L2S. Return-shape/reference failure
   before capture keeps the entire return quarantined; it cannot obtain a
   validated-return brand through a partial semantic bypass. A later
   semantic challenge leaves already validly captured raw PKTs retained,
   with semantic completion blocked until its proper outcome is recorded.
3. L2S challenges separation, necessary context, scope, qualifications,
   modality, attribution, content roles, and result/interpretation coupling.
   An upheld `multiple-separable` packet group is legal: a packet is a byte
   container, and its reviewed units guide subsequent S3 candidates.
4. S2 exit requires every emitted candidate selector accounted for, every
   exact packet covered by a reviewed group or a legal recorded lineage
   outcome, and all independent source-walk/gap DoDs satisfied.

Packet splitting/widening is a producer proposal and uses existing Slice 3
split/replace/supersede semantics, new exact PKTs where required, and preserved
predecessors. Preserve full provenance and source-walk accounting; a semantic
review cannot delete bytes, rewrite primary intervals, fabricate cursor
history, or declare a gap closed. Sub-line semantic anchors are selections
inside existing exact fragments, not new canonical `md-lines` packets.

For same-line independent assertions, retain the complete-line PKT and
represent two units. Both future claims may cite it, with distinct anchors.
For separate-fragment evidence, preserve fragment order and join policy.
Necessary context can be separately packetized and explicitly referenced;
it is not silently inserted into exact evidence or concatenated prose.

When new packets arise through the existing fresh L1 gap-review path, they
receive the same producer semantic proposal and L2S treatment. L1 does not
become an atomicity producer or lose its differently framed recall attack.
Unaccounted gaps remain in source-walk machinery. No packet is discarded
because it is awkward to normalize.

## 12. S3 normalization and unresolved behavior

The normalizer proposes one AtomicUnit per affirmative CC output, preserving
all source-supported facets. Several claims can share packet provenance;
several packets can support one claim. The ordered packet list and the exact
normalized text are sealed. Normalization cannot add facts, collapse
assertions for prose elegance, change the actor, turn a possibility into an
observation, or strip a condition/hedge.

The orchestrator maintains an exact coverage map within the semantic ledger
resolutions: every upheld S2 `SEM/U` is referenced by at least one reviewed
S3 claim candidate or an explicit reviewed no-claim proposal. The references
are provenance/accounting only; no fixed one-to-one mapping or semantic
equivalence check is imposed. Any changed decomposition is visible in the
new subject and freshly challenged. No-claim still needs the existing LIN
event for the actual packet if zero claims result.

Unpacketed context needed for an affirmative claim requires the existing
widen/add-packet procedure before sealing the admissible claim. Merely
showing surrounding text to the normalizer/reviewer does not make it evidence.
Every text anchor used to justify the proposition or a required semantic
facet must be covered by the claim's actual packet provenance.

An affirmative canonical CC requires:

- an exact upheld L2S proposal subject with one single/inseparable unit;
- no CANNOT_DETERMINE facet, indeterminate coupling, or unresolved finding
  affecting the meaning asserted;
- a usable Slice 6 receipt and independent upheld L2F where required;
- exact equality to the reserved text/type/packet/source projection; and
- valid existing provenance, lineage, and stage prerequisites.

The mechanical rule treats all finding codes except `relation-deferred` as
blocking an affirmative use. `relation-deferred` is allowed only for a
relation proposal whose target is unavailable in the legal S2/S3 context;
it cannot excuse a missing condition, referent, or other meaning-bearing
facet. Such a deferred relation must be reconciled at S4 under Slice 4.
This rule avoids an implementation-chosen “material enough” threshold.

A statement faithfully reporting uncertainty can be an affirmative claim
about that reported uncertainty, with source-expressed limitation/attribution
and a separately upheld subject. It cannot assert the indeterminate
underlying interpretation. No open-question claim is fabricated merely to
fit an unresolved queue.

Semantic-only unresolved findings remain in the semantic ledger even when
there is no CC. Material-only findings also use Slice 6 OBJ/USE records.
The existing CC-only unresolved queue is not given new endpoint kinds.
Actual unresolved/deferred claims can cite SEM/USE references in their
existing blocking/evidence fields. If an unnormalized PKT has no valid claim
or independently valid no-claim lineage outcome, S3 remains blocked.
Human procedural carry cannot waive that DoD.

At ASSEMBLED and later, Précis section 17 additionally carries this exact
table without changing the accepted envelope headings:

```text
| semantic_id | finding_id | source_ids | state | subject_digest |
```

Rows include every retained producer/reviewer unresolved finding, including
earlier indeterminate candidates later followed by a narrower usable claim.
`finding_id` is `producer:F<n>` or `VER-NNNN:F<n>`, `source_ids` is the
ASCII-sorted unique source union of the finding's anchors/material
requirements, and state is literal `CANNOT_DETERMINE`. The row binds its own
subject digest; it does not label a later different claim indeterminate.
Sort by semantic ID then finding ID. Keep an empty table for an empty
population. The checker compares only this declared union. Findings are not
erased or semantically “resolved” by a newer row.

## 13. Relations, lineage successors, and S4 closure

S2 relation proposals remain one-source and packet-level: no claim target,
semantic-prerequisite, cross-source relation, or canonical REL write.
S3 proposals remain confined to the current batch and its legal context.
The four families/eight types, null states, exact 14-field relation subject,
and 17-column canonical ledger remain unchanged.

L2S challenges whether the proposed unit abuses context or omits a required
local relation. It does not replace L3R or confer relation write authority.
Only the existing S4 relation procedure reconciles deferred/cross-batch
proposals, reviews the complete exact relation subject, and writes canonical
REL rows at S4-C1. OBJ IDs do not become relation endpoints.

After existing S4 judgment proposes a new lineage successor, the normalizer
may perform a bounded preservation task at S4: express that already-named
successor with the same structured fields, exact predecessor/provenance
union, and explicit material requirements. L2S reviews it before admission.
Neither task may decide duplicate-versus-overlap, change membership of the
proposed merge group, or inspect unrelated inventory. If it finds that the
proposed successor cannot faithfully express the content, it returns
refuted/cannot-determine and blocks that successor; it does not repair L3.

Each new PKT/CC needs its own semantic record and, where applicable, USE and
L2F review. Old semantic subjects, receipts, and findings remain historical.
They are not auto-copied, reclassified as fresh, or retargeted to successors.
Direct current packet provenance is checked through Slice 3. Broader
descendant invalidation and post-S5 correction remain outside this slice.

At C1, after all current-unit semantic obligations and canonical relation
obligations close, seal the semantic ledger together with the existing
representation-use closure. Add `semantic_review_closure_hash: sha256:<hex>`
to the same retained C1 event. It hashes exact semantic-ledger bytes; referenced
subject/result hashes bind its immutable closure. This is a seal of this new
ledger, not a relation-set version, C1 replay mechanism, or new human gate.

After C1, refuse semantic subject admission/revision, resolution writes, and
PKT/CC semantic replacement before changing bytes. C2 consumes the closed
material and relations under Slice 5; C3 still gates S5. A discovered defect
requiring pre-C1 changes blocks under existing correction doctrine. Do not
rewrite C1, re-run it silently, retarget a relation, or amend a human response.

## 14. Slice 6 material-use integration

Reuse `validateMaterialUseInput`, `materialFeatureAvailable`,
`representationUseNeedsReview`, the exact use-subject serializer, and the
existing bounded material-view constructor. New semantic code must import
these Core contracts; it may not replicate them in a host mapping.

The candidate's `material_use` is the single authoritative requirements list.
Facet/context/finding records refer to indexes into it. They do not restate
features, bindings, coordinates, availability, or limitation states. The
subject binds the exact current inventory digest, actual material-use
subject, and all displayed objects/assets. L2S must challenge undeclared
semantic dependence on material, even if declared availability passes.

Preserve the Slice 6 common constraint block verbatim. In particular:

- exact captured bytes, supplied rendering, and interpretation stay distinct;
- missing headers, formal structure, chart values, or spatial relationships
  cannot be inferred from flattened text or pixels;
- `gold` remains a recognized forbidden fidelity assertion;
- all available features permit, but never require, a usable semantic result;
- a transport unable to consume a supplied modality returns cannot-determine;
- required non-text/AST CC/REL use still needs separate L2F upheld evidence.

Run L2F and L2S against the same reserved final CC projection before canonical
commit. A revision after either review requires new subjects for every review
whose included inputs changed. Because the Slice 6 CC subject binds
text/type/provenance but not new facets, a facet-only edit invalidates L2S;
L2F reuse is allowed only when its entire existing subject and displayed
material view are byte-identical. This is exact-subject equality within the
same pending reservation, not cross-run caching or semantic inference.
If the reservation's CC identity or actual use changes, re-reserve and review.

Do not replace L2F with L2S, reinterpret an OBJ failure as a CC, or modify
1.6 receipts. The new L2S empty-candidate-evidence rule is portable Core
validation for its own new contract only; A-05 remains carried.

## 15. Durable artifacts, transitions, and resume

### 15.1 Canonical semantic ledger

Add `ledgers/semantic-review.md` with exactly one marker and four tables:

```text
- semantic_review_format: aleph-semantic-review/v1

| semantic_id | owner_stage | subject_kind | subject_path | subject_digest | predecessor_semantic_id | producer_receipt_ref |

| review_id | semantic_id | assignment_path | assignment_digest |

| review_id | semantic_id | result_path | result_digest | execution_kind | execution_evidence_ref |

| resolution_id | semantic_id | outcome | review_ids | canonical_refs | origin_unit_refs | followup_semantic_ids |
```

Table headers are exact and unique; no extra columns or duplicate rows.
List cells are compact JSON arrays, unique and ordered as specified below.
`producer_receipt_ref` and `execution_evidence_ref` are exact run-relative
paths plus SHA-256 (`path@sha256:<hex>`) to immutable records. They may
reference control evidence for a host run but that evidence is never a
reviewer attachment. Manual/static records use paths under
`verification/harness/semantic-process/`, with their actual evidence kind.
Paths use existing canonical relative-path and no-symlink rules. A missing
record is not equivalent to a static record.

Before dispatch, reserve VER and append its assignment row. Assignment path
is `verification/harness/semantic-assignments/VER-NNNN.json`, containing
exactly `{format,semantic_id,subject_digest,review_id,role,profile_digest,
invocation_id,producer_binding_hash,execution_kind}` in that order.
Format is `aleph-semantic-assignment/v1`; role is `verifier-l2s`.
Invocation ID is the reserved host call or manual/static pass ID, and
execution kind uses the enum below. This immutable assignment records
pending work; a result cannot exist without it. Enumerate all assignments
to determine the required result set, including the second invocation
after cannot-determine. An assignment cannot be erased to improve the
aggregate verdict. Assignment/result ID pairs are one-to-one.

`subject_path` is the canonical SEM path from section 8. `result_path` is
`verification/harness/semantic-results/VER-NNNN.json`; its bytes are the
canonical SemanticResult, not a Markdown paraphrase. Also retain a T7.1 VER
companion at `verification/harness/<S2|S3|S4>/VER-NNNN.md`, with exact
target, stage, lens `L2S`, and shown/withheld declaration. It must agree
with the JSON result. The existing VER is a display/inspection companion;
the structured result supplies new field coverage.

`execution_kind` is exactly `native-dispatch`, `fixture-simulated`,
`static-record`, or `manual-separate-pass`. The writer derives it from
actual dispatch/retention evidence, not the reviewer's return. A static
record is admissible as synthetic fixture evidence only. It cannot satisfy
agent/hybrid execution freshness. Fixture simulation must remain in the
existing fixture-simulated execution mode.

Resolution IDs are SMR. There is at most one resolution for each SEM;
absence means pending. Resolution outcome and fields follow this table:

| Outcome | Preconditions and exact references |
| --- | --- |
| `admitted` | All assigned reviews upheld; `review_mode=proposal`; atomicity single/inseparable or S2 multiple-separable; no blocking indeterminate fields/findings; output eligible under sections 11/12/13; `canonical_refs` is the ordered exact PKT group or sole CC; followups empty |
| `no-claim` | All reviews upheld; no-claim subject; canonical refs exactly the packet and its valid LIN no-claim event, in that order; no followup |
| `revision-required` | At least one refuted review, or a mechanically superseded pending reservation; no canonical refs; nonempty followups, each linked to this SEM |
| `unresolved-recorded` | All reviews upheld of `review_mode=unresolved-record`; no PKT/CC/LIN canonical refs; followups empty; original failed subject remains non-admitted |
| `not-admitted` | Refuted/cannot-determine candidate or withdrawn uncommitted reservation; canonical refs empty; any followups explicitly identify their SEM |

`review_ids` lists **all** assigned completed VER IDs in dispatch order.
Uncompleted assigned reviews block `admitted`, `no-claim`, and
`unresolved-recorded`. Withdrawal is procedural abandonment of a reservation,
never semantic rejection, packet disappearance, or source-walk closure.
A refuted proposal need not have a revision to remain durably not-admitted.

`origin_unit_refs` is an ordered array of strings `SEM-NNNN/U<n>`, naming
reviewed S2 units or units from a directly preceding reviewed semantic
proposal being accounted for. S2
resolutions use `[]`. S3/S4 outputs enumerate their declared source-unit
mapping; repeated origins across different CCs are legal. No-claim
resolutions enumerate every originating unit claimed to produce no CC.
Code verifies reference/coverage accounting, not equivalence between them.
If the packet group was indeterminate and had no units, its SEM identity is
instead covered through the packet-level outcome; inventing U1 is forbidden.
An S3 reviewer may uphold a producer's `multiple-separable` diagnosis while
that compound CC reservation remains ineligible for admission. Separate
child candidates then reference its distinct U IDs, preserving the source
coupling even when the split was discovered after S2. Such an origin is
reviewed proposal history, not an admitted CC or new lineage event.

Rows append only after all referenced immutable files exist. The ledger
never overwrites subject/review history. A new narrower candidate may be
admitted while its predecessor remains `not-admitted`; the unresolved
summary retains the predecessor finding. Revisions are not in-place patches.

### 15.2 Mechanical transaction contract

Core produces a bounded semantic write plan with exactly
`{key, stage, semantic_id, subject_digest, writes, prerequisite_hashes}`.
Each write has the existing material-plan shape
`{path, before_hash, after_base64, after_hash}`; prerequisites are sorted
`{path, digest}` pairs. The key is
`semantic:<semantic_id>:<subject_digest>:<operation>:<record_id>`.
Operation and record ID are exactly: `reserve-subject`/SEM,
`assign-review`/VER, `record-review`/VER, `resolve`/SMR, `admit`/SMR,
or `seal`/`S2|S3|C1`. For a seal only, semantic ID is literal `none` and
subject_digest is the hash of the stage seal or complete C1 ledger bytes.
Stage remains S2/S3/S4 as applicable. Different assignments therefore cannot
collide with each other or with the subject reservation.

The plan enumerates exact permitted paths and byte preimages. It never
chooses a split, qualifier, role, relation, disposition, or interpretation.
Host code executes only the plan under the existing single-writer lock.
Compose semantic and material subject/receipt writes in one prepared
transaction; do not independently commit one and later assume the other.
PKT raw capture may precede semantic review as section 11 specifies;
affirmative CC admission may not.

The transaction must bind the authentic accepted producer return and review
receipts to this reservation. A fabricated boolean such as `reviewed=true`
or a static VER file cannot substitute for `ValidatedWorkerReturn`/the
actual host acceptance evidence in agent/hybrid operation.

Crash recovery verifies the prepared plan, immutable subject/result files,
ledger preimages/after-images, chain/state hashes, exact reservation and
run pins, then completes the same bytes idempotently. A different preimage,
forked resolution, lost review, changed subject, or post-C1 write is a
refusal before further writes. Never synthesize missing semantic fields
during recovery. Completed retries are byte-identical no-ops.

### 15.3 Closure and resume grammar

Within the existing run-log event grammar, the 1.7 S2/S3 exit events add
exactly these field lines:

```text
semantic_stage: S2
semantic_review_seal_ref: verification/harness/semantic-stage-seals/S2.json@sha256:<64 lowercase hex>
```

The S3 event uses `semantic_stage: S3` and `S3.json`. Each immutable stage
seal contains exactly `{format,stage,subjects,assignments,results,resolutions}`.
Format is `aleph-semantic-stage-seal/v1`; stage is S2 or S3. Each table value
is an ordered array of its complete canonical row cell arrays at exit.
All cells are exact decoded strings; JSON-valued cells retain their
canonical compact JSON spelling. Serialize in listed order and hash those
bytes. Current table rows must begin with those exact sealed rows in order.
Later rows can be appended to each table, but a sealed row cannot change.

This deliberately seals table-record prefixes, not a byte prefix of the
whole Markdown file: adding a row to an earlier table changes later byte
offsets. The single writer permits only new rows at each table's end and
uses exact whole-file preimages for each transaction. At C1 all four tables
are complete, so the existing `semantic_review_closure_hash` binds the
entire final file. Exactly one successful exit event/seal per stage is
permitted; no generic run-state, rewind, or checkpoint-version mechanism
is added.

New K2.19 activation uses the shared `runLogEvents` parser plus canonical
semantic artifact presence and retained stage facts. It does not change
K2.6/K2.7 or the older S3 recognizer. A later stage/C1/ASSEMBLED signal with
missing S2/S3 semantic closure fails the new contract. As with previous
slices, a standalone checker cannot authenticate history after coordinated
erasure of every signal; retained host pins/stage records must prevent a
live downgrade.

Before 1.7 resume advances, run bounded semantic validation after pending
transaction recovery and retained identity verification. Check all referenced
subjects/results, current candidate-to-output equality, pending review
reservations, stage seals, C1 seal, and existing material prerequisites.
At a C1-closed run, resume may read but not repair the semantic ledger.
This is validation of the new semantic closure only, not generic full-run
resume validation or closure of S5A2-03/S5-A-03.

Manual execution follows the same file, stage, and identity contract under
existing manual procedures. Manual evidence records exactly
`{producer_actor,reviewer_actor,producer_pass_id,reviewer_pass_id,
subject_digest,shown_digest,withheld_declaration}`; strings are nonempty.
A same-person separate sitting may be retained as temporal-review evidence
but cannot satisfy the new independent producer/reviewer requirement.
Distinct manual actors/passes are required for 1.7 independent review.
They execute existing manual semantic roles; neither acts as human authority
selecting source meaning or granting a new gate. No manual evidence proves
native freshness. Originally pinned manual procedures remain sanctioned
and are not retroactively changed by this proposal.

## 16. Deterministic guarantees and explicit overreach guards

K2.19 is read-only, dependency-free structural validation. It invokes no
model, network, OCR, renderer, external truth service, or semantic heuristic.
Stable reason tokens are:

| Token | Mechanical proposition |
| --- | --- |
| `SEM_FORMAT` | Required artifact/keys/table/marker/canonical JSON shape |
| `SEM_ENUM` | Declared enums, discriminators and state/value compatibility |
| `SEM_REFERENCE` | Existing IDs, local scope, packet/anchor/material references |
| `SEM_EVIDENCE` | Exact frozen hashes, bytes, fragment/order and packet coverage |
| `SEM_SUBJECT` | Canonical digest, prompt/profile/basis and output equality |
| `SEM_REVIEW` | Required exact reviewer records, field coverage, verdict consistency |
| `SEM_ISOLATION` | Mechanically detectable producer context reuse, wrong role, or forbidden attachment |
| `SEM_STATE` | Pending/admitted/unresolved/no-claim transitions and closure fields |
| `SEM_ACCOUNTING` | Candidate/unit/packet coverage, distinct reservations and outcomes |
| `SEM_WINDOW` | Declared stage and closed-ledger/prefix consistency |
| `SEM_COMPATIBILITY` | Unauthorized activation, injected canonical artifacts, retained downgrade |

K2.19 may compare normalized claim text to the exact text that was reviewed;
it must not compare it to a preferred paraphrase. It may require a condition
field and its review; it must not infer that a source contains a condition.
It may reject a missing anchor, but not choose which legal anchor semantically
supports the claim. It may enforce a producer-declared single-unit
cardinality, but not infer the number of assertions in text.

Forbidden deterministic decisions include correct atomicity, correct claim
meaning, qualifier force, attribution meaning, appropriate result versus
interpretation splitting, evidence entailment, truth, duplicate equivalence,
or human-preferred wording. No lexical modal/pronoun/discourse classifier,
assertion count score, semantic similarity threshold, recall quota, source
answer fixture, or host-only semantic mapping is allowed.

Structural PASS must be possible for two differently worded/decomposed,
internally consistent synthetic proposals with matching simulated review
records. Their semantic acceptability is separately challenged. Also include
a mechanically coherent semantic error that PASSes structure, as Slice 6
does with a coherent wrong header. This proves the checker is not an
answer-key validator; it does not approve the bad semantics.

Keep the distinction between a structurally valid blocked run and permission
to advance. An unresolved record can be structurally valid while S2/S3
closure remains unmet. Reports name both the checked structure and any
unsatisfied closure; do not turn a PASS into affirmative candidate admission.

## 17. Exact prompt and adapter amendments

### 17.1 Common semantic instruction block

Future implementation adds the following block verbatim for participating
1.7 producer/reviewer roles, alongside the unchanged Slice 6 material block:

```text
Treat exact source evidence, proposed semantic fields, and review judgments
as different records. Propose or challenge one bounded semantic subject.
Preserve source-supported scope, conditions, qualifiers, modality, attribution,
comparators, metrics, and content roles explicitly. Do not add facts, strengthen
or weaken source language, or hide a result and its interpretation in one
unexamined paraphrase. A packet or sentence is not automatically atomic.
Context must be named and source-bound; proximity does not create evidence.
Use only the declared material and legal context. When the frozen evidence
cannot settle the decision, preserve CANNOT_DETERMINE and name what is missing.
Relations are not support edges. You do not write ledgers, grant acceptance,
choose a human authority action, or certify your own semantic adequacy.
```

### 17.2 Role-specific exact duties

| Surface | Required amendment |
| --- | --- |
| Extractor | Return one semantic entry for every candidate; propose smallest coherent assertions and explicit context; retain exact packets even when their semantics are awkward; never certify recall or adequacy |
| Normalizer | Emit every facet slot; preserve source-supported force/actor/condition; request packet context before affirmative use; no prose-elegance merging; bind outputs to reviewed S2 origins |
| L2S | Challenge each enumerated field; attempt stronger/weaker readings, conflation and missing-context attacks; return structured findings and cannot-determine honestly; never repair its target |
| L2S unresolved-record mode | Challenge whether the record preserves the exact unresolved subject/missing basis without affirmative leakage; upholding the record does not settle its proposition |
| Orchestrator | Construct subjects using Core, dispatch exact allowlists, retain all reviews, enforce declared outcome rules, compose single-writer transactions, block unmet DoDs; never choose semantics |
| S5/S6 judgment workers | Consume admitted facets as read-only source-preservation context; independently judge dispositions/CC×SRC roles; no mapping from content roles to support or authority |
| L1/L2/L2F/L3R | Preserve their existing duties; L2S adds exhaustive 1.7 coverage, does not replace gap review, material review or relation closure |

Keep the existing S3 normalizer heading. Add the exact Core heading
`Role: Successor Semantic Normalizer (S4 pre-C1)` in
`workers-intake-extraction.md`, selected for role `normalizer` only at S4.
Its pinned task states the bounded section 13 duties; it never inherits the
global merge-judge prompt. Add
`S4 successor semantic preservation (1.7)` beneath the pipeline's S4
section as the bounded stage excerpt for that invocation/L2S review.
The semantic schema excerpt is the new heading
`T3.7 Semantic review (1.7)` in `templates/03-extraction-claims.md`.
These literal selectors, the existing S2/S3 stage headings, and the L2S
heading in section 9 determine the prompt-part list in section 8.

L2S must explicitly test the cases in section 18, including unsupported
attribution, uncertainty, conditional restrictions, comparator/metric loss,
and result/interpretation leakage. No model-specific prompting tricks or
source-specific expected answers are added.

Append this exact L2S-specific clarification after the common verifier frame:

```text
For L2S, return refuted when a concrete counterexample against this proposed
subject stands. Return cannot-determine when the permitted frozen evidence
cannot settle the question; do not convert missing basis into refutation or
approval. Return upheld only after stating the attacks you tried and why they
did not defeat this exact proposal. In unresolved-record mode, uphold only
the honest recording of uncertainty, never the unsettled proposition itself.
```

This resolves the common frame's uncertainty preference for the new role
without changing predecessor lens semantics.

### 17.3 Portable return and schema selection

Core owns both `semanticReturnJsonSchema(role, runFormatVersion)` and
`validateSemanticReturn(role, runFormatVersion, value, subjectContext)`.
Roles are the existing extractor/normalizer plus L2S; S4 normalizer is
allowed only with an exact successor reservation. Schema selection is from
the pinned role and cumulative capability, never guessed from worker prose
or an adapter-local field/regex match.

The current exemplar converter supports shape checks but not all unions,
cross-field constraints, or literal empty-array rules. Preserve it for all
predecessor contracts. For the new capability, Core emits the closed native
schema from the exact types in this proposal and runs the same strict
portable validator after raw JSON parsing. The fallback remains mandatory
even where native constrained output exists. Update the standalone
worker-return validation path to select the same pinned contract metadata;
no host receives a private alternate schema or semantics.

The new role's pinned `**Output contract:**` JSON fence contains a closed
descriptor with keys `{contract_format,capability,role,shape}` in that order.
Contract format is `aleph-semantic-output-contract/v1`, capability is
`semantic-unit-review`, role is `extractor`, `normalizer`, or `verifier-l2s`,
and shape is the complete role output exemplar derived from sections 5/7/9.
Core rejects a descriptor whose shape differs from its declared contract.
The existing `--contract` CLI argument accepts this descriptor; old exemplar
files retain their old interpretation. Dispatch chooses it from the pinned
Core role section, not from a worker-return format claim.

The standalone CLI can establish return shape and intrinsic field/state
consistency from that contract. It reports binding status `not-checked`
without the sealed run subject. Full
`validateSemanticReturn(...,subjectContext)` adds exact subject, reference,
coverage and context validation and reports `checked`. Only the latter,
together with genuine host acceptance evidence where required, may satisfy
the writer's admission preconditions. The same distinction applies to native
JSON-schema success: it is never evidence that run references or a subject
digest have been verified. K2.19 reopens the full binding independently.

The pinned output exemplar/contract contains the complete new shapes.
Documentation and native/fallback validators must be tested against identical
positive/negative returns. Do not build a general schema language, change
unrelated exemplar semantics, or repair L2F A-05 through this selection path.

### 17.4 Adapter responsibility

Loa maps `verifier-l2s` to the exact Core charter and return schema, using
the same pinned model slot/context class as L2 and at least the producer's
effort floor. Mechanical duties are sealed attachment transport, actual fresh
context invocation, accepted-return quarantine/validation, exact reservation
persistence, journal execution/recovery, and refusal outside the write window.

Core supplies allowlist construction/validation, subject serialization,
schemas/enums, stage/outcome predicates, and row bytes. No semantic policy
belongs in `worker-bundle.ts`, `worker-return.ts`, a regex, or a profile.
The adapter may compare exact bytes and invoke Core predicates.

Do not add a public command, provider abstraction, launcher redesign, general
autonomous orchestrator, or ordinary `loa` repository change. There is no
`adapters/loa/src/orchestrator.ts` today; actual mechanics are in the worker,
ledger, and run-control modules, while orchestrator duties are Core prompts.
Any narrow helper/host test remains bounded by F-03. No fixture-only
accepted-return route may be described as canonical production reachability.

## 18. Synthetic fixtures and deterministic mutations

Create a new `docs/fixtures/semantic-unit-review/` family, with one discovered
1.7 baseline and bounded companions. Use new synthetic source IDs, not
calibration IDs/values/wording. Existing accepted and predecessor fixtures
remain byte-identical. README labels every static/simulated review honestly.

The test oracle distinguishes structural expectation from a semantic
challenge. Semantic assertions below are prompts for a fresh reviewer,
not fixed checker answers.

| Case | Synthetic source shape and required attack |
| --- | --- |
| FX01 conditional result | “With the filter enabled, the counter rose.” Challenge loss of the explicit condition |
| FX02 result/interpretation | “The counter rose; the author interprets this as adaptation.” Preserve observation and attributed interpretation as distinguishable candidates |
| FX03 necessary context | A measurement uses a term defined in a preceding exact span; require explicit definition context and packet coverage |
| FX04 unnecessary nearby context | An adjacent sentence describes an unrelated device; challenge its use as evidence |
| FX05 dangling referent | “It remained stable” with two plausible same-source antecedents; route bounded search and retain unresolved |
| FX06 modality | Separate observed, possible, capable, should, must, intended, expected, hypothetical, counterfactual and recommended expressions |
| FX07 comparator | “Faster than the prior mode on this task”; preserve baseline and comparison dimension |
| FX08 metric | A named latency metric and measured duration; preserve metric/result/unit without numeric interpretation |
| FX09 attribution | Author assertion, participant quotation, cited report, reported belief, and producer interpretation remain distinct |
| FX10 scope restriction | Observation applies only to a named test population/time/task; challenge generalization |
| FX11 hedge | “Usually approximately stable, except during restart”; preserve degree/frequency/approximation/exception |
| FX12 recommendation | “We recommend enabling the filter”; do not normalize as observed efficacy |
| FX13 separable assertions | A source line asserts counter increase and battery discharge; preserve two units even with one complete-line packet |
| FX14 inseparable context | A conditional comparison requires its baseline/condition to state one coherent proposition |
| FX15 semantic indeterminacy | Legible frozen text does not settle whether a phrase qualifies one or two assertions; retain missing basis without guessing |
| FX16 degraded material | Flattened formal/table capture lacks required structure; CANNOT_DETERMINE and OBJ/USE limitations, no affirmative CC |
| FX17 structural alternatives | Two differently decomposed or worded proposals with coherent own fields/reviews both PASS structure; fresh review separately challenges them |
| FX18 predecessor compatibility | Genuine retained 1.0–1.6 runs and all historical fixtures keep bytes, pins and prior reports; source marker strings do not activate 1.7 |
| FX19 explicit no-claim | Exact packet basis supports a reviewed no-claim proposal, distinct from indeterminate semantics |
| FX20 source-composition relation | Result and interpretation share exact source context; coupling is non-evidentiary and any REL waits for S4 |
| FX21 narrower successor | A failed broad interpretation remains recorded while a separately reviewed limited report is admitted |
| FX22 S4 successor | Existing merger proposes a successor; fresh preservation review binds new text/provenance without testing duplicate equivalence |

Companions must include prose and table-backed versions of relevant cases,
multiple fragments, same-line shared evidence, Unicode/CRLF, quoted modality,
mixed source roles, and visible incomplete material. This is a bounded
combination matrix, not an exhaustive language corpus or performance claim.

### 18.1 Required mutation matrix

Run mutations against disposable copies through the real checker CLI. Each
negative asserts nonzero exit, K2.19 or the named predecessor check, and its
intended reason token. Each family has a clean must-pass baseline.

| ID | Mutation | Required failure / boundary |
| --- | --- | --- |
| M01 | Remove structured facet/root/array/table field | `SEM_FORMAT`; absent is not source-silent |
| M02 | Invalid atomicity/context/coupling/role enum or cardinality | `SEM_ENUM`; do not infer a replacement |
| M03 | Unknown anchor/unit/PKT/CC/source/requirement index; illegal source scope | `SEM_REFERENCE` |
| M04 | Change source/fragment/selection/evidence/material hash or exact base64 | `SEM_EVIDENCE` or existing K2.13/K2.18; preserved bytes must reopen |
| M05 | Change proposition, facet, context, relation proposal, material need, packet order, prompt/profile, or limitation without a new subject/review | `SEM_SUBJECT` |
| M06 | Delete required reviewer/JSON result/VER companion or coverage row | `SEM_REVIEW` |
| M07 | Wrong review target/digest, duplicate JSON member, result/VER disagreement | `SEM_SUBJECT`, `SEM_FORMAT`, or `SEM_REVIEW` respectively |
| M08 | Producer self-review, reused context, refuter dispatched as producer, relabeled simulation | `SEM_ISOLATION` or existing transport refusal before admission |
| M09 | Add forbidden attachment/task-text rationale, widen source view without seal, reuse previous-review context | `SEM_ISOLATION`/`SEM_SUBJECT`; compare actual dispatched bytes |
| M10 | Drop qualifier key/item after review | Missing key: `SEM_FORMAT`; changed item: `SEM_SUBJECT` |
| M11 | Drop condition key/item after review | Same structural distinction as M10 |
| M12 | Drop attribution key/speaker/item after review | Same structural distinction as M10 |
| M13 | Incompatible modality enum such as `actuality-from-possibility`, nonempty items with not-expressed, or changed reviewed modality | `SEM_ENUM` or `SEM_SUBJECT`; a different legal enum with a fresh coherent subject is not a deterministic wrong answer |
| M14 | Put S6 support role in claim_roles or invent an S6 edge role | `SEM_ENUM` or existing K3, without taxonomy expansion |
| M15 | Admit CANNOT_DETERMINE, turn unknown into affirmative, launder first indeterminate review with later upheld, or use unresolved-record as a CC license | `SEM_STATE`/`SEM_REVIEW` |
| M16 | S2 claim dependency, new relation type, premature REL write, auto-retargeted historical endpoint | Existing Slice 4 check/process rule and `SEM_REFERENCE`; no Slice 8 test |
| M17 | Missing unresolved finding, illegal request, lost historical finding in section 17 | `SEM_REFERENCE`/`SEM_ACCOUNTING` |
| M18 | Omit required material view/L2F/USE, unsupported feature marked usable, gold assertion | Existing K2.18 plus `SEM_SUBJECT` where its sealed input differs |
| M19 | Inject semantic marker/ledger/subject/closure into a declared predecessor format | `SEM_COMPATIBILITY`; incidental frozen-source strings must PASS |
| M20 | Missing origin-unit accounting, unreviewed gap packet, fake no-claim for an open semantic candidate, duplicate resolution/admission | `SEM_ACCOUNTING`/`SEM_STATE` |
| M21 | Out-of-window append, changed C1 seal, missing stage closure, forged prefix | `SEM_WINDOW`; temporal process refusal separately tested |
| M22 | Interrupted transaction changed preimage, lost receipt, forked reservation, retry with different bytes | Core plan refusal and byte-preserving host recovery failure |
| M23 | Reinterpret/migrate a legacy run, require L2S in an old profile, disable 1.6 via CURRENT equality | Compatibility/retained-pin tests fail |
| M24 | Self-reported coverage totals disagree with actual candidate/review inventory | Derived `SEM_ACCOUNTING`; no reviewer-supplied total trusted |

Dropping a source-supported qualifier **before** a newly coherent subject is
reviewed may be semantically wrong but structurally valid. Include that as a
must-pass structural adversary with a fresh-review challenge. Do not
misrepresent M10–M12 as deterministic discovery of omitted meaning.
Likewise a coherent but wrong scope, modality, attribution, or split belongs
in semantic adversaries, not a checker answer key.

## 19. Process and freshness tests

Use the actual current sealed-bundle, dispatch acceptance, portable return
validator and writer APIs, with explicit evidence classification:

| Evidence class | What the test can establish | What it cannot establish |
| --- | --- | --- |
| Native fresh invocation | Actual provider/host invocation, distinct context, pinned request/model and exact accepted return; attachment-access evidence for this call | Cognitive independence, correctness, general production reachability, sanction |
| Fixture-simulated fresh dispatch | Real local transport/validation/write mechanics with simulated provider response and distinct fixture contexts | A real model call or native fresh execution |
| Static records | Subject/hash/schema/coverage/ledger consistency | Invocation, isolation, temporal execution, producer/reviewer independence |
| Producer context reuse | Refusal when actual receipt reports the producer's context/session or mismatched producer binding | Hidden provider state not exposed by the host |
| Forbidden-context probe | Known forbidden canary absent from exact sent artifacts/task and inaccessible through the configured worker tool surface | Proof that a model has no prior training knowledge |

Default implementation tests use simulation; no real model call or replay is
authorized by this proposal. A native test needs separately authorized
execution and actual host evidence. If unavailable, report NOT RUN rather
than generating a `native-dispatch` record. A test helper's distinct random
context strings do not prove native freshness.

Required bounded process cases:

1. Capture → semantic reservation → sealed L2S → accepted return → composed
   semantic/CC/material transaction, with each identity reopened.
2. Different actual producer/reviewer contexts; refused equal context,
   wrong role, forged simulation marker, and missing dispatch evidence.
3. Known calibration-answer, producer-rationale, authority-observation,
   unrelated-source, downstream-narrative and expected-disposition canaries
   in withheld files; assert absence from the actual request and worker
   accessible attachment tree. Static self-attestation is insufficient.
4. A reviewer context request creates a new subject and new invocation,
   preserving the original cannot-determine record.
5. Separate L1/L2F/L2S invocations cannot substitute for one another.
6. Same source bytes with changed qualifier/condition/attribution/material
   context cause prior review refusal; identical retry causes no duplicate.
7. Crash after reservation, subject publication, review publication, ledger
   append, canonical CC write, USE write, chain write, state write, each
   stage-seal write, and C1 seal write. A fresh subprocess resumes exact
   prepared bytes or refuses inconsistent state.
8. Post-C1 write refused without byte changes; resume leaves C1/C2/C3,
   canonical relations and material uses untouched.
9. Static/simulated records rejected as native execution evidence; manual
   temporal separation never reported as isolated host execution.
10. Retained predecessor resumes under original pins; coordinated deletion
    of 1.7 artifacts cannot downgrade retained host execution authority.

These tests can establish only their named helper/transport/process
propositions. They do not close F-03, F-04, F-05, or the deferred generic
resume findings. The implementation report must explicitly state which
producer→accepted-return→writer path was exercised and whether simulated.

## 20. Bounded future implementation dependency map

These are future authorized changes, not files edited by this proposal.
Each row names the obligation that earns its place. Do not edit adjacent
surfaces merely to modernize them.

| Ownership | Exact paths / bounded purpose |
| --- | --- |
| New Core contract/helper | `scripts/lib/semantic-review.ts`: types, closed schema, strict structural validator, canonical subjects/views, identity/coverage/state predicates and write plans |
| New Core checker | `scripts/lib/checks-k2-semantics.ts`: read-only K2.19; invoked from `scripts/lib/checks-k2.ts` |
| Registry/model | `scripts/lib/run-model.ts`: cumulative 1.7 capability, semantic ledger parsing; reuse existing shared run-log parser without repairing old recognizers |
| Portable return validation | `scripts/lib/worker-return-contract.ts`; `scripts/validate-worker-return.ts`: exact pinned contract selection and new Core delegation; predecessor behavior unchanged |
| Material integration | `scripts/lib/source-representation.ts`: only the narrow export/composition plumbing needed to reuse existing views/plans; no availability or L2F policy rewrite |
| Stage/runbook | `docs/architecture/04-pipeline-stages-and-dod.md`; `08-runbook-agent-mode.md`; `09-runbook-manual-mode.md`: exact coverage, closure and honest manual process rules |
| Prompt pack | `docs/architecture/prompts/README.md`; `orchestrator.md`; `workers-intake-extraction.md`; `workers-judgment.md`; `verifier-lenses.md`: new role contracts and bounded read-only downstream use |
| Artifact/check documentation | `docs/architecture/03-artifact-contracts.md`; `templates/03-extraction-claims.md`; `templates/07-verification.md`; `checker-spec/K1-K2-fixtures-and-runs.md`; `docs/PRECIS-CONFORMANCE-CHECKER.md`: exact sidecar, return and K2.19 contracts |
| Core transport protocol | `adapter-protocol/runner-capability-contract.md`; `adapter-protocol/adapter.schema.json`: portable selection/context requirements and cumulative format acceptance, without changing provider semantics |
| Loa mechanics | `adapters/loa/src/core-loader.ts`; `worker-bundle.ts`; `worker-return.ts`; `worker-dispatch.ts`; `ledger-writer.ts`; `run-control.ts`; `types.ts`: invoke Core selection/view/plans, transport new role, exact transactions/resume |
| Profile/preflight | `adapters/loa/profiles/loa-default.json`; `adapters/loa/src/preflight.ts`: required L2S mapping only for new capable runs; same L2 slot/context and effort floor |
| New fixtures/tests | `docs/fixtures/semantic-unit-review/`; `scripts/test-semantic-review-contracts.ts`; `scripts/test-semantic-review-mutations.ts`; `adapters/loa/tests/test-semantic-review-process.ts` |
| Test/discovery integration | `scripts/test-worker-return-contract.ts`; `scripts/validate-precis-fixtures.ts`; `scripts/compatibility-fixture-source.ts`; `package.json`: new contracts/cases and unchanged predecessor baselines |
| Inventory/runtime | `core.manifest.json`; generated counterparts under `runtime-js/scripts/lib/` and `runtime-js/adapters/loa/src/`; generated CLI mirrors as reached by imports |

Existing TS runtime entrypoints pull dependencies through `tsconfig.runtime.json`.
Do not add a new root entrypoint just to force compilation when the helper
is already in their import closure. Change the build configuration only if
the actual import graph requires it, recording the exact reason.

No change is planned to accepted historical calibration/adoption records,
old fixtures, the preserved adapter stash/workstream, ordinary `loa`,
projection type packages, provider configuration, general ingestion/OCR,
or Slice 8 merge policy. A needed change outside the dependency map must
first be classified against the adopted contract; no silent scope expansion.

## 21. Runtime parity and future implementation sequence

All authored executable code is TypeScript. `runtime-js` remains generated
ES2022 output via `npm run runtime:build`, never hand-edited. Every new
Core helper/checker and transitive host dependency must have the exact
generated counterpart in the manifest when the build emits it.

Future implementation order after exact adoption and separate authorization:

1. Re-prove repository/base/tree/branch, adopted proposal identity and
   implementation authority; preserve unrelated work. Record baseline
   historical fixture/calibration/runtime hashes and predecessor reports.
2. Add exact Core types, schema selection, serializers, context projection,
   capability registry and source-bound validation. Exercise strict parsing
   and both structurally valid semantic alternatives before host wiring.
3. Add semantic ledger/subjects/results, K2.19 and a minimal synthetic
   positive fixture. Keep blocked/unresolved examples distinct from permitted
   stage closure. Add the named mutation families, including no-op baselines.
4. Amend prompts, templates, stage rules and documentation in lockstep with
   the exact Core return/schema bytes; include the semantic and material
   constraint blocks through pinned selection.
5. Add only the mapped mechanical Loa role/view/return/reservation/transaction
   integrations. Exercise actual accepted-return helpers with explicit
   fixture-simulated labels. No F-03 closure claim.
6. Complete process/crash/refusal tests, finite semantic adversaries and
   predecessor compatibility. Verify manual/process evidence labels and
   forbidden-context canaries.
7. Regenerate runtime, run strict typecheck and the required suites, compare
   source/runtime reports and retained legacy bytes, then reproduce and
   independently verify immutable bundles for both host targets.
8. Publish bounded implementation/reconciliation with exact head/tree,
   evidence classes and carried findings. Obtain a fresh independent
   implementation audit before any separately authorized merge.

Proposed new script names are `test:semantic-review-contracts`,
`test:semantic-review-mutations`, and `test:semantic-review-process`, mapped
to the three new test entrypoints in section 20. Include them in `npm test`.
Their addition is future implementation, not a change in this delivery.

Required future checks include `npm run typecheck`, `npm run runtime:build`,
`npm run runtime:check`, `npm test`, the new focused suites, Core boundary
validation, discovered fixtures, worker-return validation, all predecessor
mutation suites, and bundle/release checks already required by the
repository. Runtime/source CLI reports must agree on each new positive and
negative case, including reason/check IDs. A sandbox/process failure is
reported with its real cause and rerun unchanged in a permitted context;
it is not a source failure without evidence.

Two clean bundle assemblies must produce identical content for the same
exact source identity and equal Core bytes across Loa/Hermes. Check bundle
and installed Node 20 runtime behavior under the existing package tests.
Prompt/contract changes intentionally change Core/bundle content digests;
historical run pins do not change. Provenance, payload, lock and bundle
identities remain distinct.

## 22. Exact future implementation Definition of Done

Implementation is structurally/process complete only when all these
obligations have evidence tied to its exact head:

1. Exact adopted proposal identity and separate implementation authorization
   are retained; no semantic-authority gate or Slice 8 scope is introduced.
2. Cumulative 1.7 activation and old-format injection/downgrade refusal work
   without equality-to-CURRENT regressions.
3. Every producer candidate has its complete role-appropriate semantic
   record; all facet/envelope/unknown states and source bindings follow the
   exact schema.
4. Core owns the new types, enums, native/fallback validation, context
   projection, subject serializer and structural write rules.
5. All packet/source/fragment/material bytes reopen; normalized text and
   semantic selections never masquerade as exact evidence.
6. Every semantic subject binds its output, fields, legal context,
   material-use view, applicable lineage/relations/ambiguity, prompts,
   profile and execution pins; every included-field mutation invalidates
   the prior review.
7. Fresh reviewer role and exact shown/withheld contract are implemented;
   native, simulated, static and manual evidence are distinguishable.
8. L2S returns exact field coverage and unresolved findings; all assigned
   review outcomes are retained, and cannot-determine is never laundered
   into affirmative admission.
9. S2 preserves per-fragment exact packets, source order/walk/shared
   positions and independent L1 gap review; same-line multi-assertion
   examples do not require a fabricated locator scheme.
10. S3 admission matches the exact reviewed atomic proposition/facets;
    missing context requests remain bounded; no-claim/lineage accounting
    cannot silently discard indeterminate content.
11. Existing Slice 6 availability, material receipts, L2F and limitations
    remain controlling; semantic facets reference its requirements rather
    than duplicate them.
12. Content roles, provisional claim type, S5 disposition and S6 CC×SRC
    evidence roles remain separate. No role/count/lexical mapping infers
    support or source truth.
13. Relations retain Slice 4 taxonomy, exact subjects, scope and C1 write
    window. S4 successor preservation adds no duplicate/overlap decision.
14. Unresolved findings survive in durable records and the exact section 17
    summary, without fabricated CC/OBJ queue entries or human interpretations.
15. Semantic/reservation/review/canonical-use transactions and stage/C1 seals
    pass all specified crash/retry/tamper/refusal cases.
16. Resume checks only the new bounded closure and original pins; no generic
    correction/rollback or deferred-resume repair is claimed.
17. All FX01–FX22 families and M01–M24 families have explicit tested
    baselines/outcomes. Coherent semantic alternatives and a coherent
    semantic error can PASS structural validation.
18. Required tests prove the actual path they name, with no static freshness
    claim, no self-reported count oracle, and no simulation presented as
    canonical production reachability.
19. Existing 1.0–1.6 fixtures/runs retain their bytes, pins and behavior;
    accepted historical records and calibration bytes remain unchanged.
20. Runtime projection is generated/drift-free; source/runtime checker and
    worker-return results agree; current package/bundle checks pass.
21. Reconciliation reports exact files/commits/trees, tests, context evidence
    and any blocked/not-run native proof. All carried findings remain at
    their stated strength unless separate authorized independent evidence
    actually disposes one.
22. A fresh independent audit examines the completed implementation before
    any separately authorized merge. Producer tests are not that audit.

Completing this list establishes only the named implementation, structure,
byte-identity, fixture and process propositions. Replay, semantic validation,
sanction, acceptance, production readiness, golden and v1 remain separate.

## 23. Human-authority questions and present delivery boundary

No additional human semantic-policy choice is required or permitted by this
design. The proposed exhaustive subject coverage, bounded structures,
indeterminate handling and preservation review follow the adopted Slice 7
purpose and preceding contracts. Their **design adoption** remains a human
authority decision; their execution requires separate implementation
authorization. Neither is supplied by this producer document.

If later implementation discovers a genuine contradiction with adopted
doctrine, it must report the exact conflict before proceeding. It cannot
invent a human gate selecting a split, interpretation, qualifier, referent,
evidence meaning, or source truth. OQ-01 retains procedural actions only,
`selected_candidate_ref=none`, non-operative human observations, immutable
Core requirement references, and its existing C2 placement. Procedural
carry/restriction never overrides an independently unmet S2/S3 DoD.

This delivery changes only this proposal and its single
`files.repository_administration` entry in `core.manifest.json`. It does not
bump the format, add runtime/schema/prompt/checker/test behavior, revise
adopted history, touch the adapter stash/workstream, or publish an adoption
or implementation authorization.

Before its bounded commit/push, verify exact diff scope, `git diff --check`,
Core/admin validation and baseline content-digest equality; compare every
existing tracked file with the starting byte inventory, with the sole
manifest administration exception. Proposal publication is not merge,
implementation, replay, or independent semantic validation.

SLICE 7 DESIGN PROPOSED — HUMAN AUTHORITY ADOPTION REQUIRED BEFORE IMPLEMENTATION

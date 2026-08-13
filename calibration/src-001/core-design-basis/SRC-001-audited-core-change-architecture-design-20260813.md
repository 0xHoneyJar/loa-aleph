# SRC-001 Audited Core-Change Architecture Design

Date: 2026-08-13

Status: `READY_FOR_CORE_IMPLEMENTATION_PLAN_REVIEW`

This is a design packet only. It does not authorize implementation, replay,
validation, sanction, golden promotion, SRC-002, production readiness, or v1.

## 1. Controlling evidence

| Input | SHA-256 / status |
|---|---|
| Closed SRC-001 package | `f4c42e65d611395c9bacdb7ecf3ab7e4d01b1d21fd50c6c150b0cc6a8847a9f0` |
| Producer mapping | `5b7648b3021a16b60d88ab67efbca96ed1aa1a42abad592b8950e96b21507613` |
| Independent audit | `03197345bb9721d245258481cdd8ce102ee10dafcc1a82889b931cbcab63b37a` |
| SRC-001 | `CLOSED_FOR_CALIBRATION` |
| SRC-002 | `NOT_AUTHORIZED` |

The correction addendum and effective-state overlay in this directory govern
the analytical interpretation used by this design. The original producer
artifacts remain immutable predecessor evidence.

## 2. Two design-input classes

### A. SRC-001 calibration-derived requirements

These are supported by the audited calibration evidence:

- exact evidence and normalization must be separate and byte-reopenable;
- ordered/discontiguous source fragments need explicit representation;
- source traversal, gaps, exclusions, shared positions, and resume cursors
  need visible accounting;
- split, merge, replacement, supersession, duplicate, and disappearance need
  complete lineage;
- dependency/source-context records need typed representation and target
  integrity;
- unresolved source-internal referents need visible lifecycle and scoped
  propagation;
- formal/table/layout evidence needs structured bindings and degraded-format
  handling;
- atomicity, qualifier, evidence-role, relation, and duplicate judgments
  require fresh semantic review;
- first-pass recall improvement must not remove an independent gap-review pass.

The audit does not support:

- treating 250 final dependency entries as 250 machine omissions;
- reconstructing link-by-link historical dependency semantics;
- encoding human normalization wording or SRC-001 link density as generic
  truth;
- treating every human edit as a machine error.

### B. Human-authority product requirement: intent-fidelity intake

This requirement is not derived from SRC-001.

Future `/loa-aleph` intake should preserve detailed user research intent
through a bounded interview, atomic intent ledger, fresh review,
human-confirmed structured charter, and traced S1 criteria. A prose summary is
not authoritative.

The two input classes remain labeled separately in specifications, commits,
fixtures, release notes, and later evaluation.

## 3. Target run flow

```text
DRAFT
  exact user prompt + bounded interview
    -> intake/intent-source.jsonl
    -> ledgers/intent-ledger.md
    -> fresh coverage / ambiguity / contradiction review
    -> ledgers/intent-review.md
    -> research-charter.md
    -> human GATE-S0-CHARTER confirmation
    -> approved source acquisition/admission, when needed
    -> human GATE-S0-FREEZE

CORPUS-FROZEN
  confirmed charter + frozen corpus
    -> S1 extraction criteria with INT/charter trace
    -> S2 exact packets + source-walk accounting + independent gap review
    -> S3 typed claims, relations, ambiguity, and fresh semantic review
    -> S4 lineage-preserving duplicate/overlap review
    -> existing S5-S13 method

ACCEPTED
  immutable accepted Precis
    -> separate P1-P3 projection commissions
```

Different research questions over identical corpus bytes may have different
charters, criteria, runs, and Precis artifacts. Different consumer documents
for the same research question remain projections over the same accepted
Precis.

## 4. Core artifact model

### 4.1 Exact evidence

An exact evidence record contains:

- source ID;
- one or more ordered fragment locators;
- exact bytes/hash per fragment;
- declared fragment order and join policy;
- exact-evidence value;
- separate normalized wording;
- normalization event and predecessor/effective hashes.

Only explicitly exact fields receive byte-equality checks. Degraded/rendered
fields carry a different type and cannot masquerade as exact.

### 4.2 Source-walk accounting

Every source receives ordered walk records:

- interval or position;
- outcome: admitted, gap-reviewed, excluded, deferred, or unsupported;
- associated packet/disposition;
- resume cursor;
- shared-line/sub-line state.

The checker proves accounting closure. A fresh gap reviewer still judges
whether qualifying content was missed.

### 4.3 Lineage

One typed lineage model covers:

- split;
- merge;
- replace;
- supersede;
- duplicate;
- reject;
- exclude;
- no-claim.

It supports legal multi-parent and multi-successor transformations. Every
predecessor and successor remains reconstructable; no load-bearing record
silently disappears.

### 4.4 Typed relations

Replace heterogeneous dependency prose/IDs with records containing:

- relation ID;
- relation type;
- source unit;
- target kind;
- target ID or typed unresolved/null target;
- provenance;
- status;
- authority closure when applicable.

Deterministic checks validate structure and target integrity. Producers and
fresh reviewers choose whether a relation exists, which type applies, and
which target is semantically correct.

### 4.5 Ambiguity lifecycle

An ambiguity record contains:

- expression and source location;
- bounded search scope;
- candidate or null antecedent;
- affected relation IDs;
- carry state;
- authority closure/carry decision.

The checker never infers ambiguity from prose. It verifies only declared
records and propagation edges.

### 4.6 Formal and layout evidence

Represent page/region/table coordinates, headers, captions, exact cell bytes,
rendering provenance, and degraded/unsupported states. No worker reconstructs
unavailable equations or image values.

## 5. Intent-fidelity architecture

The complete contract is in
`SRC-001-intent-fidelity-intake-contract-proposal-20260813.md`.

Core owns:

- interview and intent schemas;
- canonical artifacts and templates;
- allowed intent kinds and dispositions;
- charter and trace contracts;
- fresh semantic-review roles;
- deterministic IF-01 through IF-12 checks;
- current-world admission and successor-run rules.

The four intent kinds are:

1. `RESEARCH_QUESTION`;
2. `RESEARCH_SCOPE_RULE`;
3. `DECISION_CONTEXT`;
4. `PROJECTION_POSSIBILITY`.

Decision context cannot determine truth or desired conclusions. Projection
possibility is non-binding until a later commission and cannot silently alter
S1 criteria.

Every active `INT-*` maps to charter/criteria records or an explicit
disposition. Every charter/criteria rule traces back to user input or an
explicit human-approved clarification.

## 6. Current-world handling

The charter selects one temporal mode:

- `CORPUS_BOUNDED_LATEST`: latest represented by the admitted corpus;
- `CURRENT_WORLD_AS_OF`: current/latest as of a confirmed UTC date/time.

For current-world research, candidate material is acquired during `DRAFT`,
recorded with origin/retrieval metadata and exact hashes, human-approved, and
admitted as frozen source bytes before S0 closes. Mutable URLs are provenance,
not live run dependencies.

New material after S0 starts a successor run naming the predecessor. It never
silently mutates the existing corpus, criteria, run, or accepted Precis.

## 7. Verification architecture

### 7.1 Deterministic layer

Mechanically check:

- exact byte/fragment fidelity;
- interval and resume accounting;
- IDs, enums, lineage, target existence, and provenance union;
- declared ambiguity carry/closure;
- formal/layout coordinate and source-hash integrity;
- identity pins and authority-declared inventory closure;
- intent/charter/criteria trace and chronology;
- freeze immutability and successor-run structure;
- projection non-interference with S1 criteria.

A PASS proves structure only.

### 7.2 Fresh semantic layer

Fresh reviewers judge:

- atomicity and role separation;
- evidence boundary and relation choice;
- qualifier, scope, metric, modality, and attribution preservation;
- observation versus interpretation;
- unresolved referents;
- formal/table meaning over declared material;
- duplicate versus overlap;
- intent coverage, ambiguity, contradiction, charter fidelity, and criteria
  adequacy.

Reviewers receive the smallest sufficient source/schema context and never the
closed SRC-001 answer key or expected IDs.

### 7.3 Human authority layer

Humans alone:

- confirm the research charter;
- approve S0 corpus/sensitivity freeze;
- resolve or carry load-bearing intent ambiguity;
- resolve or carry source-internal referents where required;
- accept the Precis at S13;
- commission and accept projections.

## 8. Canonical source change map

Likely Core-owned changes:

| Area | Canonical files |
|---|---|
| System/stage contracts | `docs/architecture/02-system-architecture.md`, `03-artifact-contracts.md`, `04-pipeline-stages-and-dod.md` |
| Runbooks | `docs/architecture/08-runbook-agent-mode.md`, `09-runbook-manual-mode.md` |
| Templates | new `docs/architecture/templates/00-intent-intake.md`, plus templates 01-04 and templates README |
| Prompts | `orchestrator.md`, `workers-intake-extraction.md`, `workers-judgment.md`, `verifier-lenses.md` |
| Checker spec | `docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md` |
| Checker implementation | `scripts/lib/run-model.ts`, `scripts/lib/checks-k2.ts`, `scripts/validate-run.ts` as needed |
| Mutations | `scripts/test-conformance-mutations.ts` |
| Fixtures | versioned minimal structural and semantic fixtures under `docs/fixtures/` |
| Inventory | `core.manifest.json` |
| Runtime projection | corresponding generated files under `runtime-js/scripts/` |

Historical accepted fixtures remain byte-pinned. A new run-format version
introduces the new required artifacts.

## 9. Thin Loa adapter

Core remains canonical in `loa-aleph`. The Loa adapter may present and persist
Core-defined artifacts but may not copy, summarize, override, or weaken them.

### Command surface

No new public command is required:

```text
/loa-aleph start <files-or-directories...>
/loa-aleph status [RUN-id]
/loa-aleph resume <RUN-id>
/loa-aleph validate <RUN-id>
```

`start` can create the DRAFT run and then let the installed skill conduct the
Core-defined bounded interview before charter confirmation and S0 freeze.

### Required adapter mechanics change

The current Loa S0 response contains one prose `declared_scope`, so Slice 9
requires a narrow adapter update to:

- persist exact interview turns;
- support an append-only DRAFT-only transaction that admits human-approved
  current-world source bytes and fails closed after S0;
- present charter and freeze gates;
- validate Core-defined structured response shapes;
- transaction-bind canonical artifacts and digests;
- accept the new run format;
- retain orchestrator-only writes and deterministic resume.

Likely adapter files include `types.ts`, `intake.ts`, `cli.ts`,
`ledger-writer.ts`, the installed skill, README, tests, and generated runtime
projections.

The adapter does not own intent semantics or schemas.

### Loa repository

No corresponding `loa` source-repository change is anticipated for ordinary
Core or Loa-adapter bundle updates. A `loa` repository change is needed only if
the host integration primitive, command-registration contract, or installation
boundary itself changes.

## 10. Immutable distribution and resumption

The future distribution remains:

```text
canonical loa-aleph
    ->
verified immutable aleph-for-loa release
    ->
Loa installation/update
    ->
/loa-aleph
```

Core changes rebuild immutable host bundles. A Loa-adapter-only mechanics
change rebuilds the Loa bundle. Release identity is the Core, adapter, checker,
and complete bundle digests, not mutable repository `main`.

Existing runs continue with their retained original bundle and runtime
snapshot after a newer release is installed. No in-place run migration or
mutable-main execution is permitted.

## 11. Implementation sequence

The detailed plan is
`SRC-001-implementation-slice-plan-20260813.md`.

Final sequence:

1. exact evidence and ordered fragments;
2. source-walk/gap/resume accounting;
3. unified lineage;
4. typed relations;
5. ambiguity lifecycle;
6. formal/layout bindings;
7. S2/S3 semantic review;
8. S4 duplicate/overlap review;
9. intent-fidelity intake;
10. blind SRC-001 replay.

Slices 1-8 are calibration-derived. Slice 9 is the separate human product
requirement. Slice 10 is calibration-only.

## 12. Blind replay boundary

Replay allowlist:

- frozen SRC-001 source;
- frozen SRC-001 criteria;
- improved generic Core in one immutable release;
- ordinary required run inputs.

Replay withhold set:

- human calibration answer inventory;
- producer delta analysis;
- independent audit;
- correction addendum;
- effective-state overlay;
- expected IDs;
- decision/correction/close events;
- precomputed comparison metrics.

The run is frozen and hashed before the reference is opened. Post-run
comparison does not force ID equality and separately reports exact-byte,
structural, and semantic deltas.

Intent-fidelity intake is excluded from SRC-001 replay evaluation because
SRC-001 already has frozen criteria. It receives separate synthetic/adversarial
fixtures.

## 13. Plan-review acceptance criteria

This design is ready for implementation-plan review when reviewers agree that:

1. the correction overlay accurately applies retained authority records;
2. the corrected counts and indeterminate boundaries are preserved;
3. deterministic checks contain no hidden semantic judgment;
4. semantic roles receive sufficient but not answer-leaking context;
5. intent-fidelity remains separately attributed to human product authority;
6. the ten-slice order and dependencies are acceptable;
7. legacy fixtures/runs remain pinned;
8. the thin adapter and immutable distribution boundaries are preserved;
9. blind replay cannot access calibration reference material.

Implementation still requires a separate explicit authority decision.

## 14. Non-goals

This design does not:

- modify Core;
- change the closed package;
- change historical evidence;
- start SRC-002;
- create an implementation branch;
- promote SRC-001 to golden;
- validate or sanction agent mode;
- accept a Precis;
- require mutable-main execution;
- declare production readiness or v1.

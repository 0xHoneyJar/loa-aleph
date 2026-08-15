# Correction and Effective-State Architecture Decision

Date: 2026-08-15

Status: PROPOSED — HUMAN AUTHORITY ADOPTION REQUIRED

Decision class: human-authority product/architecture clarification

## 1. Authority Boundary

This document proposes an architecture decision for explicit human-authority
review. It does not record adoption, authorize implementation, or change any
current capability or calibration status.

The proposal is informed by:

- existing Aleph immutable-history doctrine;
- existing successor-run and frozen-corpus doctrine;
- the currently adopted Slice 3 lineage direction; and
- the human-authority research workflow requirement clarified on 2026-08-15.

Existing adopted architecture already requires durable provenance, no silent
disappearance, immutable frozen corpus identity, successor runs for post-freeze
source changes, single-writer canonical state changes, and separation between
deterministic checks, semantic judgment, and human authority.

The broader interpretation that Aleph must preserve immutable research history
while allowing a corrected effective research state is the new
human-authority product/architecture clarification proposed here. The complete
correction model is not claimed to have been derived from SRC-001 calibration.

## 2. Governing Invariant

> Durable research state is never erased by correction. A correction
> establishes a new effective state, explicitly supersedes corrected records,
> invalidates dependent descendants whose prerequisites changed, preserves
> unaffected records whose prerequisites remain valid, and resumes from the
> earliest unmet Definition of Done. Frozen corpus identity is never mutated;
> corpus corrections require a successor run.

This is not ordinary edit history. Correction changes which durable state is
authoritative for continued work while retaining the prior state and enough
provenance to reconstruct why the effective view changed.

## 3. Required State Distinctions

### EFFECTIVE

An `EFFECTIVE` record, artifact, or version is currently authoritative for
continued pipeline work and current Précis compilation.

Historical predecessors may remain durable and inspectable, but they do not
participate in the current effective view unless they are explicitly carried
forward under the active derivation state.

### SUPERSEDED

A `SUPERSEDED` record is a durable predecessor that has been replaced by a
later effective record. Supersession does not erase or overwrite the
predecessor.

The supersession record must identify sufficient predecessor, successor,
reason, provenance, and applicable authority information to reconstruct what
happened.

### STALE / INVALIDATED

A `STALE` or `INVALIDATED` record is no longer established under the current
effective state because one or more of its prerequisites changed.

Invalidation does not by itself assert that the record is false, erroneous, or
semantically rejected. It asserts only that the prior basis for treating the
record as current is outdated and that the applicable stage must reconsider
it before it can re-enter the effective view.

`STALE` or `INVALIDATED` must not be collapsed into `SUPERSEDED` or
`REJECTED`.

### REJECTED

A `REJECTED` candidate, path, or result has been explicitly terminated by an
applicable judgment. Rejection remains durable research history and carries
its reason, evidence, reviewer or authority provenance, and other fields
required by the stage contract.

Rejection is a research judgment, not merely an identity replacement or a
mechanical consequence of changed prerequisites.

### HISTORICAL

`HISTORICAL` state is retained durable work that is no longer part of the
current effective view. It remains inspectable for audit, peer review,
methodological learning, and future research.

Historical state must not silently participate in current Précis compilation.

## 4. Full History and Effective View

The intended architecture contains two related views.

### Full Immutable History

The full immutable history contains durable:

- effective work;
- superseded work;
- stale or invalidated work;
- rejected paths; and
- retained audit and review findings.

Historical research may remain valuable even when it does not appear in the
Précis. Examples include:

- rejected hypotheses;
- abandoned cluster structures;
- peer-review objections;
- prior normalization approaches;
- contradictory interpretations;
- unresolved questions; and
- superseded methodological choices.

This preservation principle applies only to work admitted into Aleph's durable
artifact, checkpoint, review, or transaction surface. It does not require
every model thought, scratchpad, transient deliberation, or unadmitted draft to
become durable research state.

### Effective View

The effective view contains only work currently authorized by the active
derivation state for continued pipeline execution and Précis compilation.

The Précis is compiled from the effective view, not indiscriminately from all
historical artifacts. A historical record returns to the effective view only
through a valid current-state transition or explicit carry-forward permitted
by the applicable contract.

## 5. Correction Classes

### 5.1 In-Run Derived-State Correction

In-run derived-state corrections include:

- wrong normalization;
- incorrect split or merge;
- mistaken classification;
- flawed cluster construction;
- a reviewer discovering an earlier semantic mistake; or
- later evidence review showing that a prior derived artifact needs
  correction.

The intended future behavior is:

1. preserve the original durable record;
2. append a correction or new effective version;
3. supersede the corrected record where applicable;
4. identify dependent descendants;
5. mark affected descendants stale or invalidated rather than deleting them;
6. preserve unaffected work whose prerequisites remain valid; and
7. resume from the earliest affected unmet Definition of Done.

This proposal establishes the intended architecture only. It does not claim
that this complete mechanism is implemented.

### 5.2 Checkpoint or Artifact Revision

A user-facing checkpoint may appear to have one current or final form, but a
correction must not destructively overwrite its predecessor.

Conceptually:

```text
checkpoint-v1 -> SUPERSEDED
checkpoint-v2 -> EFFECTIVE
```

The ordinary effective view may hide historical versions while audit and
history views can reopen them. This proposal does not define a complete
checkpoint-versioning schema, storage model, or implementation.

### 5.3 Frozen-Corpus Correction

Frozen source bytes must not be mutated in place.

If a frozen corpus contains the wrong file, wrong bytes, or another
identity-changing source defect, the existing run continues to truthfully
refer to its original frozen corpus. The correction requires a successor run
that names the predecessor.

Conceptually:

```text
RUN-A:
  SRC-1
  SRC-2-wrong
  SRC-3

successor RUN-B:
  predecessor: RUN-A
  SRC-1          unchanged identity
  SRC-2-correct  changed identity
  SRC-3          unchanged identity
```

Future architecture may permit mechanically justified reuse of unaffected
work. No reuse is automatic merely because a source hash is unchanged.
Cross-source or downstream artifacts whose prerequisites include changed
material must be reconsidered.

This proposal does not implement successor-run creation or cross-run reuse.

## 6. Downstream Invalidation

Correction may propagate to descendants.

For example:

```text
C-10
  -> merge M-4
  -> cluster CL-8
  -> synthesis SYN-2
```

If `C-10` is corrected:

- the predecessor of `C-10` may become `SUPERSEDED`;
- `M-4` may become `STALE` or `INVALIDATED`;
- `CL-8` may become `STALE` or `INVALIDATED`; and
- `SYN-2` may become `STALE` or `INVALIDATED`.

Those descendants are not automatically declared semantically wrong. Their
prior establishment depended on an outdated prerequisite, so the applicable
Definitions of Done must be re-established under the new effective state.

The intended future system resumes from the earliest affected unmet
Definition of Done rather than restarting the entire run. This proposal does
not implement dependency traversal, invalidation propagation, rewind, or
resume machinery.

## 7. Lineage, Disposition, and Typed Relations

These concepts answer different questions and must remain separate.

### Lineage

Lineage answers:

> What happened to this canonical record's identity?

Examples include:

- split;
- merge;
- replace; and
- supersede.

### Disposition

Disposition answers:

> What role does this claim have in the research result?

Examples governed by later stages include:

- carried;
- deferred;
- backgrounded;
- excluded-with-reason; and
- unresolved.

Disposition must not be collapsed into lineage. A record may remain
identity-effective while later receiving a non-carried research disposition.
For example, a backgrounded claim can remain the effective identity record
without appearing as a carried claim in the Précis.

### Typed Relations

Typed relations, planned for Slice 4, answer semantic and contextual dependency
questions between units. Slice 3 must not absorb Slice 4 by treating every
semantic relation as lineage.

Lineage may provide some structural prerequisite information needed by later
correction work, but it is not a general semantic dependency graph.

## 8. Peer Review, Writing Authority, and Human Gates

A reviewer may identify:

- the challenged record;
- the defect or finding;
- the evidence and reason;
- the stage that should be reopened or reconsidered; and
- candidate affected descendants where the applicable contract permits.

Issuing a finding does not make the reviewer the canonical ledger writer. The
orchestrator or other designated single writer remains responsible for
validated canonical state changes.

Deterministic machinery may establish structural dependency or invalidation
relationships where declared contracts permit. It does not decide semantic
correctness.

Semantic correction remains a reviewer or human judgment problem under the
applicable stage contract. Human gates remain human. No worker, reviewer,
orchestrator, or deterministic checker may impersonate a human-authority
response.

## 9. Relation to Slice 3

This proposal clarifies the broader correction architecture behind the
currently adopted Slice 3 direction.

Slice 3 remains bounded to:

> Unified split / merge / replace / supersede lineage.

Slice 3 should establish the smallest structural concepts required by its
adopted implementation scope, including:

- explicit predecessor and successor lineage;
- effective versus non-effective identity state where required;
- legal multi-parent and multi-successor transformation;
- no silent disappearance; and
- reconstructable transformation history.

Slice 3 must not silently expand to implement the complete correction system.
The following remain deferred:

- general artifact rollback;
- general checkpoint versioning;
- automatic downstream invalidation across every stage;
- arbitrary rewind and resume machinery;
- successor-run creation workflow beyond existing doctrine;
- cross-run reuse or caching; and
- migration of existing pinned runs.

A subsequent read-only Slice 3 reconnaissance must determine the smallest
bounded portion of this decision required for the currently adopted Slice 3
implementation. This proposal is not that reconnaissance and does not begin
Slice 3 implementation.

## 10. Consistency Cases

The proposed distinctions produce the following outcomes:

1. A derived claim corrected inside one frozen run retains its predecessor,
   establishes a new effective version, and invalidates only descendants whose
   prerequisites changed.
2. An incorrect merge discovered after clustering may be superseded while the
   dependent cluster becomes stale pending reconsideration.
3. A peer-review finding may invalidate downstream work without proving that
   work false, and the reviewer does not directly rewrite canonical state.
4. Checkpoint v1 remains historical and superseded when checkpoint v2 becomes
   effective.
5. A wrong source file discovered after S0 freeze requires a successor run;
   the original frozen corpus remains unchanged.
6. An unchanged source in a successor run is eligible only for justified,
   contract-governed reuse, never automatic reuse from hash equality alone.
7. A cross-source cluster depending partly on a replaced source must be
   reconsidered even when its other sources are unchanged.
8. A rejected research path remains durable historical research but does not
   enter the effective view.
9. A backgrounded claim may remain identity-effective because research
   disposition is not lineage state.
10. A semantic relation remains a Slice 4 concern and is not converted into a
    Slice 3 lineage edge merely to support future correction.

These are architecture interpretations, not claims of implemented behavior.

## 11. Non-Goals and Status Honesty

This proposal does not establish, implement, or authorize:

- the general correction model;
- complete rollback;
- complete artifact versioning;
- automatic descendant invalidation;
- cross-run work reuse;
- mutable frozen corpora;
- migration of old runs;
- blind SRC-001 replay;
- intent-fidelity work;
- semantic validation;
- sanctioned agent execution;
- acceptance;
- golden status;
- production readiness;
- Aleph v1; or
- SRC-002.

SRC-001 remains `CLOSED_FOR_CALIBRATION`.

SRC-002 remains `NOT_AUTHORIZED`.

Manual mode remains the only sanctioned execution path unless separately
changed by authoritative evidence.

No Core behavior, checker behavior, adapter behavior, runtime projection,
manifest version, run-format version, prompt, template, fixture, or accepted
historical decision is changed by this proposal.

## 12. Adoption Requirement

Human authority must explicitly adopt, amend, or reject this proposal before
it may be cited as an adopted architecture decision.

HUMAN AUTHORITY ADOPTION IS STILL REQUIRED.

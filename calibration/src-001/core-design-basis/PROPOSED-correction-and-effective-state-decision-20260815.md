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
> establishes or prepares a new effective state. Where a valid replacement
> becomes effective, the corrected predecessor is explicitly superseded.
> Where correction has been identified but replacement or re-establishment is
> not yet complete, affected records remain explicitly stale, invalidated,
> rejected, or otherwise non-effective under the applicable contract rather
> than receiving fabricated successors. Dependent descendants whose
> prerequisites changed are invalidated; unaffected records whose prerequisites
> remain valid are preserved; execution resumes only from the earliest
> applicable unmet Definition of Done. Frozen corpus identity is never mutated;
> corpus corrections require a successor run.

This is not ordinary edit history. Correction changes which durable state is
authoritative for continued work while retaining the prior state and enough
provenance to reconstruct why the effective view changed. A discovered defect
may legitimately leave a run `BLOCKED` with an invalidated record awaiting
correction. Lineage completeness must not be manufactured by inventing a
successor that has not been validly established.

## 3. Required State Distinctions

`EFFECTIVE`, `SUPERSEDED`, `STALE`, `INVALIDATED`, `REJECTED`, and
`HISTORICAL` are conceptual architecture distinctions in this proposal. They
are not, merely through adoption of this proposal, final field names, status
enums, table schemas, or run-state values.

In particular, `STALE / INVALIDATED` names a conceptual distinction or class
whose exact representation remains deferred to bounded design. A later Slice 3
reconnaissance may recommend exact Core vocabulary, but it must preserve the
distinctions adopted here. This proposal does not alter existing Core run-state
enums.

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
by the applicable contract. Human-authority responses are additionally bound
by Section 8 and cannot be silently carried forward.

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
2. persist the correction finding and append a replacement or new effective
   version only when one has been validly established;
3. supersede the corrected record only when the applicable contract recognizes
   a valid effective replacement;
4. identify dependent descendants;
5. mark affected descendants stale or invalidated rather than deleting them;
6. preserve unaffected work whose prerequisites remain valid; and
7. remain blocked when replacement or required authority is incomplete,
   otherwise resume from the earliest affected unmet Definition of Done.

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

This transition applies only once checkpoint v2 is validly established and
effective. Before that point, checkpoint v1 may be non-effective or invalidated
without being falsely linked to a successor that does not yet exist.

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

If a defect in `C-10` is identified or `C-10` is corrected:

- the predecessor of `C-10` may become `SUPERSEDED` when a valid replacement
  becomes effective;
- if no valid replacement exists yet, `C-10` may remain non-effective or
  invalidated and the run may remain blocked;
- `M-4` may become `STALE` or `INVALIDATED`;
- `CL-8` may become `STALE` or `INVALIDATED`; and
- `SYN-2` may become `STALE` or `INVALIDATED`.

Those descendants are not automatically declared semantically wrong. Their
prior establishment depended on an outdated prerequisite, so the applicable
Definitions of Done must be re-established before they enter a new effective
state.

The intended future system resumes from the earliest affected unmet
Definition of Done rather than restarting the entire run, but only after any
required replacement and renewed authority exist. This proposal does not
implement dependency traversal, invalidation propagation, rewind, or resume
machinery.

## 7. Lineage, Disposition, and Typed Relations

These concepts answer different questions and must remain separate.

### Lineage

Lineage answers:

> What happened to this canonical record's identity?

Examples include:

- split;
- merge;
- replace;
- supersede;
- duplicate;
- reject;
- exclude; and
- no-claim.

These remain within the previously adopted Slice 3 structural closure scope,
but they are not semantically identical:

- split, merge, replace, and supersede are identity-transformation forms;
- duplicate is a canonicalization or identity relationship that must preserve
  provenance and must not create false independent evidence; and
- reject, exclude, and no-claim are terminal or no-successor structural
  outcomes needed to explain why a lineage-managed record does not continue.

Terminal closure does not require fabricating a successor. The exact schema,
edge model, and status vocabulary remain deferred to bounded Slice 3 design.

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

Likewise, Slice 3 structural `reject`, `exclude`, or `no-claim` closure does not
collapse the separate S5 question of what role an active research claim has in
the result. Similar words used by different stage contracts must retain their
contract-specific meanings.

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

### Correction Authority Invariant

A correction must never rewrite, fabricate, reinterpret, or silently carry
forward a human-authority response.

If the effective basis on which a human gate depended changes materially:

- the original human response remains immutable historical evidence;
- deterministic or semantic workers may identify that downstream authority is
  no longer sufficient for the changed effective state;
- they may not manufacture a replacement authority response;
- the applicable human gate must be presented again where its contract
  requires renewed authority;
- execution stops at that gate until an actual human-authority response is
  persisted; and
- no correction path may use "resume from the earliest unmet Definition of
  Done" to bypass a human gate.

Conceptually:

- **S13:** If an accepted Précis or its load-bearing basis changes, the prior
  acceptance cannot silently authorize the changed Précis.
- **Projection:** If the accepted source basis changes, an existing projection
  commission or acceptance must not be assumed to authorize a newly changed
  source state.
- **S0 / frozen corpus:** A corpus-byte correction requires a successor run and
  cannot rewrite the original freeze authority.

These examples establish authority boundaries, not exact implementation
behavior.

This proposal does not decide or authorize a general mechanism for correcting
an already `ACCEPTED` run. Whether post-acceptance correction occurs through a
successor run or another future explicitly adopted mechanism remains deferred.
Until such a mechanism is implemented and authorized, this proposal must not
be read as permitting mutation or reopening of an accepted run.

## 9. Relation to Slice 3

This proposal clarifies the broader correction architecture behind the
currently adopted Slice 3 direction.

The previously adopted Slice 3 structural closure scope includes split, merge,
replace, supersede, duplicate, reject, exclude, and no-claim.

Slice 3 should establish the smallest structural concepts required by its
adopted implementation scope, including:

- explicit predecessor and successor lineage;
- explicit terminal or no-successor closure where a record does not continue;
- provenance-preserving duplicate canonicalization;
- effective versus non-effective identity state where required;
- legal multi-parent and multi-successor transformation;
- no silent disappearance; and
- reconstructable transformation history.

Including these concepts in Slice 3 does not make them semantically identical,
convert S5 research disposition into lineage, or absorb Slice 4 semantic and
context relations. It establishes only the structural closure needed to
explain what happened to a lineage-managed record.

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
implementation, including the smallest correct representation of
transformation, duplicate canonicalization, and terminal closure. This proposal
does not redesign the concrete schema, is not that reconnaissance, and does
not begin Slice 3 implementation.

## 10. Consistency Cases

The proposed distinctions produce the following outcomes:

1. An error discovered before a corrected successor exists leaves the affected
   record non-effective or invalidated and may leave the run blocked; no
   successor is fabricated.
2. A one-to-many split records the predecessor and all valid successors without
   silently dropping provenance.
3. A many-to-one merge records all parents and the canonical successor without
   treating combined provenance as independent corroboration.
4. Duplicate canonicalization preserves every source occurrence and does not
   create false independent evidence.
5. A structurally rejected record may terminate with no successor while its
   reason and history remain inspectable.
6. A scope-excluded record may terminate with no successor under the applicable
   structural contract without becoming an S5 disposition by implication.
7. A no-claim outcome may close a lineage-managed source unit without inventing
   a claim successor.
8. A backgrounded claim may remain identity-effective because research
   disposition is not lineage state.
9. Correction that invalidates work below a human gate also invalidates the
   sufficiency of that authority where the gate contract requires renewed
   approval; execution stops rather than carrying the response forward.
10. If the basis of S13 acceptance changes, the prior acceptance remains
    historical and cannot authorize a changed Précis.
11. A wrong source file discovered after S0 freeze requires a successor run;
    the original corpus and freeze authority remain unchanged.
12. Correction of an already `ACCEPTED` run remains deferred to a future
    explicitly adopted mechanism and is not authorized here.
13. A semantic dependency remains a Slice 4 concern and is not converted into a
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
- mutation or reopening of an already accepted run;
- a general post-acceptance correction mechanism;
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

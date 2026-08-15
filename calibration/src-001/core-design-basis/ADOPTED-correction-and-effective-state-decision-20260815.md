# Correction and Effective-State Architecture Decision Adoption Record

Date: 2026-08-15

Status: ADOPTED — HUMAN AUTHORITY

## Adopted Proposal Identity

- Repository: `0xHoneyJar/loa-aleph`
- Pull request: `#43`
- Adopted head:
  `92fd503d3328e31425f5a7ba8bb65e4231134c85`
- Proposal:
  `calibration/src-001/core-design-basis/PROPOSED-correction-and-effective-state-decision-20260815.md`
- Proposal SHA-256:
  `5286bd1152ac23f8e46e1df5c175d72a171d8757d43db21a3c3a2077c83137c5`
- Proposal Git blob:
  `c4132fa8c9140d73794ec5d1abba4115eb82b4b6`

The adopted proposal file remains unchanged. Its `PROPOSED` status line records
the state of the exact proposal snapshot at the adopted head; this separate
record establishes the human authority adoption.

## Human Authority Declaration

The human authority supplied the following declaration:

> I ADOPT the Correction and Effective-State Architecture Decision proposed in
> PR #43 at head:
>
> 92fd503d3328e31425f5a7ba8bb65e4231134c85
>
> with proposal SHA-256:
>
> 5286bd1152ac23f8e46e1df5c175d72a171d8757d43db21a3c3a2077c83137c5
>
> I adopt the following architecture direction:
>
> - Aleph preserves immutable durable research history while allowing the
>   effective research state to be corrected.
>
> - A correction does not erase prior durable state and does not fabricate a
>   successor. Where a valid replacement becomes effective, the predecessor may
>   be explicitly superseded. Where correction is incomplete, affected records
>   may remain stale, invalidated, rejected, otherwise non-effective, or BLOCKED
>   under the applicable contract.
>
> - Dependent descendants whose prerequisites changed must not remain silently
>   effective. They may be invalidated without being declared semantically
>   false. Unaffected work may remain effective only where its prerequisites
>   remain valid.
>
> - Future correction execution should resume from the earliest applicable
>   unmet Definition of Done rather than restarting unaffected work, subject to
>   required human gates and authority.
>
> - Frozen corpus identity is never mutated. A correction to frozen source bytes
>   requires a successor run that preserves the predecessor run's truthful
>   history.
>
> - Unchanged source identity alone does not automatically authorize cross-run
>   reuse. Any future reuse must be mechanically and contractually justified.
>
> - Full immutable history and the current effective view remain distinct. The
>   Précis is compiled from the effective view, while superseded, invalidated,
>   rejected, and other admitted historical research state remains inspectable.
>
> - Lineage, research disposition, and typed semantic/context relations remain
>   distinct concepts.
>
> - Slice 3 retains its previously adopted structural closure scope over split,
>   merge, replace, supersede, duplicate, reject, exclude, and no-claim, while
>   the exact schema and vocabulary remain subject to bounded Slice-3 design.
>
> - A correction never rewrites, fabricates, reinterprets, or silently carries
>   forward a human-authority response. When the effective basis of a human gate
>   materially changes, renewed authority is required wherever the applicable
>   gate contract requires it.
>
> - This decision does not authorize a general mechanism for mutating or
>   reopening an already ACCEPTED run. Post-acceptance correction remains
>   deferred to a future explicitly adopted mechanism.
>
> - EFFECTIVE, SUPERSEDED, STALE, INVALIDATED, REJECTED, and HISTORICAL are
>   architecture distinctions, not by this adoption alone final Core field
>   names, enum values, schemas, or run states.
>
> This adoption authorizes the architecture clarification and the subsequent
> bounded read-only Slice-3 reconnaissance against it.
>
> It does not itself authorize or establish:
>
> - the general correction implementation;
> - arbitrary rollback or rewind;
> - general checkpoint versioning;
> - automatic descendant invalidation;
> - cross-run reuse or caching;
> - mutation of frozen corpora;
> - mutation or reopening of accepted runs;
> - Slice-3 implementation before its bounded design is reviewed;
> - blind SRC-001 replay;
> - semantic validation;
> - sanctioned agent execution;
> - acceptance;
> - golden status;
> - production readiness;
> - Aleph v1;
> - SRC-002.
>
> SRC-001 remains CLOSED_FOR_CALIBRATION.
> SRC-002 remains NOT_AUTHORIZED.
> Manual mode remains the only sanctioned execution path unless separately
> changed by authoritative evidence.

## Effective Boundary

This adoption authorizes:

- the correction and effective-state architecture direction in the adopted
  proposal; and
- subsequent bounded read-only Slice 3 reconnaissance against that direction.

This adoption does not itself:

- implement or authorize the general correction mechanism;
- authorize Slice 3 implementation before bounded design review;
- authorize arbitrary rollback, rewind, checkpoint versioning, descendant
  invalidation, or cross-run reuse;
- permit mutation of frozen corpora or accepted runs;
- establish semantic validation, sanctioned agent execution, acceptance,
  golden status, production readiness, or Aleph v1;
- authorize blind SRC-001 replay; or
- authorize or begin SRC-002.

SRC-001 remains `CLOSED_FOR_CALIBRATION`.

SRC-002 remains `NOT_AUTHORIZED`.

Manual mode remains the only sanctioned execution path unless separately
changed by authoritative evidence.

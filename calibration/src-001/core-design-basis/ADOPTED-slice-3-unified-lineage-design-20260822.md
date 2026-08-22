# Slice 3 Unified Lineage Design Adoption Record

Date: 2026-08-22

Status: ADOPTED — HUMAN AUTHORITY

## Adopted Proposal Identity

- Repository: `0xHoneyJar/loa-aleph`
- Proposal commit: `e4cc70971ada82757b87a908fd680aa663e67d2a`
- Proposal: `calibration/src-001/core-design-basis/PROPOSED-slice-3-unified-lineage-design-20260822.md`
- Proposal Git blob: `df65a39c39672178dd5e383a7da8aa29c2a4f8ed`

The proposal file remains unchanged. Its `PROPOSED — HUMAN AUTHORITY ADOPTION REQUIRED` status line records the state of that exact proposal snapshot; this separate record establishes the human-authority adoption.

## Human Authority Declaration

The human authority supplied the following declaration:

> I ADOPT the Slice 3 Unified Lineage Design at commit:
>
> e4cc70971ada82757b87a908fd680aa663e67d2a
>
> Proposal:
> calibration/src-001/core-design-basis/PROPOSED-slice-3-unified-lineage-design-20260822.md
>
> Git blob:
> df65a39c39672178dd5e383a7da8aa29c2a4f8ed
>
> I authorize this exact bounded Slice 3 design as the basis for Slice 3 implementation.
>
> This adoption does not authorize any of the proposal's explicit non-goals or advance Aleph's validation, sanction, acceptance, production-readiness, or v1 status.

## Adopted Design Boundary

The exact adopted proposal establishes the bounded Slice 3 design, including:

- one append-only Core `ledgers/lineage.md` artifact with `aleph-lineage/v1` typed events;
- the closed Slice 3 event vocabulary `split`, `merge`, `replace`, `supersede`, `duplicate`, `reject`, `exclude`, and `no-claim`;
- no generic N-to-M event in `aleph-lineage/v1`; complex cases compose typed events;
- packet-to-claim ancestry remains claim provenance and is not represented as replacement lineage;
- a derived mechanical `lineage-current` concept remains distinct from legacy `status = active`;
- new 1.3 merge/duplicate canonicalization creates a new successor claim identity rather than mutating a predecessor in place;
- current S5 accounting and current Précis compilation operate over lineage-current claims, while historical predecessors remain inspectable without fabricated new dispositions;
- direct current claim-to-current packet provenance closure may be checked structurally without implementing generic descendant invalidation;
- target run format `1.3.0-provisional` with cumulative capability activation;
- a bounded deterministic lineage checker surface and focused 1.3 fixture/mutation battery;
- Core owns lineage semantics; adapters may only perform the narrow host mechanics required to carry the unchanged Core contract.

The exact proposal governs if this summary is incomplete. This adoption record does not restate or replace the proposal.

## Explicit Non-Goals Preserved

This adoption does not authorize Slice 3 to implement:

- Slice 4 typed semantic/context relations;
- persisted generic `STALE` or `INVALIDATED` state;
- automatic descendant invalidation across stages;
- generic checkpoint or artifact versioning;
- arbitrary rewind or rollback;
- cross-run reuse or caching;
- successor-run correction execution beyond existing doctrine;
- correction or reopening of already `ACCEPTED` runs;
- intent-fidelity implementation;
- blind SRC-001 replay;
- SRC-002;
- validation or sanction of agent mode;
- acceptance, production readiness, or Aleph v1.

## Status Boundary

This record establishes human adoption of the exact bounded Slice 3 design identified above and records the human authority's authorization to use that design as the basis for Slice 3 implementation.

It does not itself prove implementation, checker conformance, semantic correctness, replay, validation, sanction, acceptance, production readiness, or v1.

Implementation must remain within the exact adopted proposal. Any newly discovered issue must be classified before scope changes; only a genuine blocking contradiction with the adopted design or higher-authority repository contract may reopen the frame.

SRC-001 remains `CLOSED_FOR_CALIBRATION`.

SRC-002 remains `NOT_AUTHORIZED`.

Manual mode remains the only sanctioned execution path unless separately changed by authoritative evidence.

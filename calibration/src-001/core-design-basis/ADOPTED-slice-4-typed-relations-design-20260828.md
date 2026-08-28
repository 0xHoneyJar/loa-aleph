# Slice 4 Typed Relations Design Adoption Record

Date: 2026-08-28

Status: ADOPTED — HUMAN AUTHORITY

## Adopted Proposal Identity

- Repository: `0xHoneyJar/loa-aleph`
- Pull request: `#47`
- Proposal:
  `calibration/src-001/core-design-basis/PROPOSED-slice-4-typed-relations-design-20260828.md`
- Proposal commit/head:
  `0fe3bb8bf31b837806ba3da94d5466a7e63721ec`
- Proposal tree:
  `78337cea36ef6faa9fa50549ed566eb5dbc46e04`
- Proposal Git blob:
  `51af0df8e3f44201a086169c5ce1fe02050ff8a9`
- Proposal SHA-256:
  `c7604873a724627806b911a39153796e551b1c1e627f4000866f07ade1a2e1b9`
- Independent architecture-audit verdict:
  `READY_FOR_SLICE_4_HUMAN_ADOPTION_WITH_FINDINGS`

The proposal file remains unchanged. Its
`PROPOSED — HUMAN AUTHORITY ADOPTION REQUIRED` status line records the state of
that exact proposal snapshot; this separate record establishes the
human-authority adoption.

## Human authority declaration — verbatim

```text
I adopt it
```

## Adoption Effect

This adoption establishes that:

- the exact identified Slice 4 proposal is now `ADOPTED` as the bounded design
  basis for future Slice 4 implementation;
- implementation may proceed only within the adopted proposal's scope and
  Definition of Done; and
- the proposal's explicit non-goals remain unauthorized.

This adoption does not itself:

- implement Slice 4;
- bump the run format;
- validate or sanction agent execution;
- establish replay validation;
- establish semantic validation;
- accept a Précis;
- establish production readiness;
- establish golden status; or
- establish Aleph v1.

These are mechanical consequences and status boundaries of the adopted
contract. They are not additional words attributed to the human declaration.
The exact proposal governs if this summary is incomplete.

## Independent Audit and Reconciliation State

The independent architecture audit returned
`READY_FOR_SLICE_4_HUMAN_ADOPTION_WITH_FINDINGS`. The findings below remain
audit and reconciliation state. They are not represented as words individually
uttered or separately adopted by the human authority.

No `BLOCKING NOW` finding remains in the independent design audit.

### MUST PRESERVE

| ID | Finding carried forward |
|---|---|
| MP-01 | Slice 3 lineage remains the only owner of packet/claim identity change. |
| MP-02 | S5 disposition remains separate from relation type. |
| MP-03 | S6 evidence-role edges remain the only owner of load-bearing/corroborative/contradictory/contextual source roles. |
| MP-04 | Context required for interpretation never becomes independent evidence through relation multiplicity. |
| MP-05 | Frozen-corpus and external-referent boundaries remain fail closed; no outside fact or target is invented. |
| MP-06 | Historical SRC-001 representations remain contradictory/indeterminate where the evidence is contradictory/indeterminate. |
| MP-07 | SRC-001 link density is not a completeness target. |
| MP-08 | Canonical endpoints are lineage-current at S4 closure; successor targeting is explicit and never automatic. |
| MP-09 | Deterministic checking remains structural and cannot certify semantic correctness. |
| MP-10 | Producers, fresh reviewers, orchestrator single-writer mechanics, and human authority remain separate roles. |
| MP-11 | Legacy 1.0-1.3 behavior and bytes are not migrated or reinterpreted. |
| MP-12 | Core owns relation semantics; adapters remain host-mechanical. |
| MP-13 | Adopted correction/effective-state boundaries remain fail closed without generic stale/invalidation machinery. |
| MP-14 | F-03 live writer/orchestrator wiring remains unvalidated. |
| MP-15 | F-04 path/case portability remains unresolved. |
| MP-16 | F-05 post-S4 lineage BLOCK remains tied to the F-03 surface and must not be converted into an agent-mode claim. |
| MP-17 | Manual mode remains the only sanctioned execution path. |
| MP-18 | Structural implementation, checker PASS, fixture validation, replay, semantic validation, sanction, acceptance, and v1 remain separate claims. |
| MP-19 | Slice 4 v1 has no relation-specific human authority gate or closure field; existing authority surfaces remain separate. |
| MP-20 | A source-locus scheme is derived from its canonical source-manifest row and must already be Core-defined and deterministically reopenable; Slice 4 creates no locator scheme. |
| MP-21 | K2.16 checks retained static state only; the orchestrator or manual procedure owns temporal S4-only write-window enforcement. |
| A4-13 | Future 1.4 activation uses an explicit cumulative capability registry; equality to the current run format must not disable prior capabilities when a newer format is registered. |
| F-03 | Live LedgerWriter/orchestrator wiring remains unvalidated end-to-end. |
| F-04 | Path/case portability remains unresolved. |
| F-05 | The post-S4 lineage BLOCK remains tied to the F-03 surface. |

### LATER

The proposal's existing deferred items remain `LATER`:

| ID | Deferred implication carried forward |
|---|---|
| L-01 | Slice 5 ambiguity/referent identification, propagation, carry, authority closure, and relation-null resolution |
| L-02 | Slice 6 table-cell/header coordinates, new formal/layout addressing schemes, formal-layout binding, OCR/degraded-format states, and unsupported-layout handling |
| L-03 | Slice 7 mandatory semantic review coverage and any exhaustive explicit-absence obligations |
| L-04 | Slice 8 duplicate-versus-overlap fresh refutation redesign |
| L-05 | Generic relation correction, replacement, supersession, and currentness after correction |
| L-06 | Descendant stale/invalidation propagation and earliest-unmet-DoD resumption |
| L-07 | Checkpoint/artifact revision, rollback, rewind, cross-run reuse, and successor-run correction mechanics |
| L-08 | Post-ACCEPTED correction |
| L-09 | Intent-fidelity intake |
| L-10 | Blind SRC-001 replay and SRC-002 |
| L-11 | Post-freeze research and external fact resolution |
| L-12 | Projection changes |
| L-13 | Live adapter/orchestrator validation, agent-mode validation, and sanction |
| L-14 | Semantic validation, replay validation, acceptance, golden promotion, production readiness, and Aleph v1 |
| L-15 | Any relation-specific human authority closure, only through a separate adopted authority decision |
| A4-07 | Claim-to-claim evidential relations observed in historical calibration have no current owner and are not representable by the current `CC x SRC` S6 evidence-role contract. Slice 4 does not annex them; future ownership requires separate architecture. |
| A4-12 | `SRC-001-machine-to-final-mapping.json` is cited by accepted/adopted calibration-delta digest and provenance but is not itself retained in the current repository/package surface inspected here. Retained checkpoints corroborate the cited phenomena; reconstruction is not authorized. |
| A4-14 | Source-locus self-reference mutation/check precision. |
| A4-15 | Exact one-subject `VER`-target adversarial coverage. |
| A4-16 | `proposed_by` payload grammar pinning. |
| A4-17 | Conflict/cycle wording precision. |

A4-14 through A4-17 were identified by the fresh independent audit after the
proposal bytes were frozen. They are nonblocking findings to carry into future
authorized implementation/reconciliation. They do not alter the adopted
proposal bytes and are not represented as words in the human declaration.

## Status Boundary

This record establishes human adoption of the exact bounded Slice 4 design
identified above. It does not itself establish implementation, replay
validation, semantic validation, agent sanction, Précis acceptance, production
readiness, golden status, or Aleph v1.

Manual mode remains the only sanctioned execution path unless separately
changed by authoritative evidence.

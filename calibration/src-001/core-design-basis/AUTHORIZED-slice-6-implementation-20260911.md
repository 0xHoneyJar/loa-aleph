# Slice 6 Implementation Authorization Record

Date: 2026-09-11

Status: AUTHORIZED — HUMAN AUTHORITY

## Authorization Subject

- Repository: `0xHoneyJar/loa-aleph`
- Implementation branch: `agent/slice-06-formal-layout-implementation-20260911`
- Required starting adoption commit:
  `e45a1d9b1cafc5ef3b6a1fb46a61a8a395d45770`
- Starting adoption tree:
  `3f0ea796e1d8f1b7ad653e16fdf48f78eab50c29`
- Exact adopted proposal path:
  `calibration/src-001/core-design-basis/PROPOSED-slice-6-formal-table-layout-bindings-and-degraded-formats-design-20260911.md`
- Exact adopted proposal commit:
  `330cab029687979937177220406868da901189c9`
- Exact proposal tree:
  `0ca565b120a5569f029fbcccd7ecb310f497ab79`
- Exact proposal Git blob:
  `9a09d9224840882cfc5752e68d24fe40464e6a98`
- Adoption record:
  `calibration/src-001/core-design-basis/ADOPTED-slice-6-formal-table-layout-bindings-and-degraded-formats-design-20260911.md`

The implementation branch starts directly from the identified adoption state.
The proposal remains historically labeled PROPOSED; its separate adoption
record establishes adoption of those exact bytes. Neither historical record
is rewritten by this authorization.

## Human Implementation Authorization — Verbatim

```text
I authorize Slice 6 implementation based on the adopted Slice 6 design.
```

The declaration is preserved exactly. All identity, scope, obligations,
consequences, and status boundaries elsewhere in this record are explanatory
metadata and are not additional words attributed to the human declaration.

## Authorized Implementation Scope

Authority is bounded to implementing the exact adopted Slice 6 design bytes
identified above, section by section. The proposal is the implementation
contract; this record does not replace or broaden it.

This authorization permits the necessary Core contracts, cumulative 1.6
capability, representation artifacts, exact byte bindings, availability/use
predicate, K2.18, prompts and return shapes, mechanical Loa integration,
synthetic fixtures, structural/process/mutation tests, generated runtime,
documentation, inventories, packaging, and implementation reconciliation.
Exact captured bytes, declared availability, and semantic interpretation remain
separate. Core owns policy; adapters provide host mechanics.

This record and its administration entry must be committed before
implementation code changes. Implementation then continues without another
human gate, within the identified contract. Normal implementation commits and
a branch push after the bounded implementation is complete and green are
authorized. A fresh independent audit is required before merge.

## Preserved Findings and Authority

| Finding | Carried state |
|---|---|
| F-03 | OPEN: canonical accepted-worker-return → LedgerWriter/orchestrator production reachability remains unproven. |
| F-04 | OPEN: path/case/platform portability remains unresolved. |
| F-05 | OPEN and bounded by F-03: late-correction/lineage production-path reachability remains unproven. |
| S5A4-02 | DEFERRED. |
| S5A4-03 | DEFERRED. |
| S5A2-03 / S5-A-03 | DEFERRED. |

The existing Slice 5 and OQ-01 authority remains in force, including MP01–MP08,
human procedure without human semantic authorship, immutable pinned Core
requirements, non-operative observation prose, C1/C2/C3 ordering, and the
single-writer boundary. Other applicable adopted MUST PRESERVE / LATER
findings remain carried. Adjacent implementation work is not their disposition.

Manual mode remains the only sanctioned execution mode. Deterministic PASS
is structural evidence only. Fixture-simulated execution remains simulation,
not proof of a production path. Hermes remains planned.

## Explicit Exclusions

This authorization does not authorize:

- Slice 7 or Slice 8;
- replay acceptance or replay-validation claims;
- semantic validation;
- agent-mode sanction;
- acceptance, production readiness, golden status, or v1;
- unrelated deferred repairs;
- general PDF/OCR/vision or document-rendering infrastructure;
- broad provider/launcher refactoring;
- generic correction, rollback, invalidation, or cross-run reuse;
- migration or reinterpretation of accepted/frozen legacy runs or fixtures;
- replacement of retained run Core/runtime pins;
- rewriting the proposal, adoption, or merged Slice 5 history;
- touching the preserved adapter stash/workstream; or
- merging the implementation branch.

No real model calls, replay, independent audit result, semantic correctness,
or stronger lifecycle status is established by this authorization. No
independently closed finding is manufactured. A required scope expansion must
be reported before proceeding beyond the adopted contract.

## No-Merge Boundary

`DO NOT MERGE`

The authorized publication is the completed, green implementation branch.
Independent implementation audit remains a separate requirement before merge.

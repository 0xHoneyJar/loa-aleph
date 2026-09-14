# Blind SRC-001 Replay Harness Design Adoption Record

Date: 2026-09-14

Status: ADOPTED — HUMAN AUTHORITY

Decision class: bounded replay-harness design adoption; repository administration

## Exact Adopted Proposal Identity

| Identity | Value |
| --- | --- |
| Repository | `0xHoneyJar/loa-aleph` |
| Branch | `agent/src-001-blind-replay-harness-design-20260914` |
| Proposal path | `calibration/src-001/core-design-basis/PROPOSED-blind-src-001-replay-harness-design-20260914.md` |
| Proposal commit | `c607b724d16c13202d581b23bab6af5e8a256a6a` |
| Proposal tree | `88fc25d6c68b6bfbb1ea71c5ca385d1fb4c5bc79` |
| Proposal Git blob | `40370866bcdfd3c70941aac21298aaaae96fff6e` |
| Proposal SHA-256 | `52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8` |
| Canonical Slice 8 merge base; proposal's sole parent | `c949ea5f39daef42d22ca2e4111164d63dffcbf1` |
| Canonical Slice 8 tree | `8ced176e50da0d05070b164cfe725752df947d3f` |

The exact bytes of the
[proposal](PROPOSED-blind-src-001-replay-harness-design-20260914.md)
identified above become the adopted replay-harness design basis.
The proposal itself remains historically `PROPOSED`, including its original
status line and Q-R1 question. This separate record establishes adoption
without modifying proposal bytes or amending the proposal commit.

## Human Authority Declaration — Verbatim

```text
I adopt the Blind SRC-001 Replay Harness design at commit c607b724d16c13202d581b23bab6af5e8a256a6a.
```

The declaration is preserved exactly as supplied. The identity, effect,
boundaries and findings below are contextual records, not additional words
attributed to that declaration.

## Adoption Effect

The full exact proposal governs the design. This record neither replaces
its contracts with a summary nor expands them.

The harness remains calibration-only and outside generic Core by default.
Generic Core or adapter changes require their own separate authority path.
The previously human-adopted architecture remains controlling:

```text
Slices 1–8 → blind SRC-001 replay → later intent-fidelity track
```

That sequence is established by
[ADOPTED-architecture-decision.md](ADOPTED-architecture-decision.md),
adopting proposal head `6506ee4a9b586d1e8dc14bf25dd44a7a99ed9079`,
blob `95156a8f7292965cc2f9eef0efd8811f20ae02d8`.
The older implementation slice plan's relative replay/intake ordering remains
superseded; adoption does not begin intent-fidelity.

Exact frozen SRC-001 source, criteria, upstream PDF and provenance identities
remain those named in proposal section 4. No input is exported, normalized,
rewritten, substituted or reinterpreted by adoption. Future release
preparation remains bound to the canonical Slice 8 merge above and the
proposal's measured, independently reproduced immutable release procedure.
No post-merge release digest is invented here.

Replay production must remain blind to the closed calibration reference until
the replay-evaluation freeze is proven. Normal S0 corpus freeze does not
release that boundary. Post-freeze comparison remains separate from replay
production, uses a fresh independent context and cannot mutate the frozen
replay. Generated-ID equality is not a comparison requirement.
`CANNOT_DETERMINE` remains a legal comparison state.
Exact-byte integrity, structural accounting and semantic comparison remain
separate report classes.

Q-R1 is not resolved by this adoption declaration. Its separate human
clarification must be recorded after this adoption commit exists and must
bind that commit and the exact proposal. Resolving execution policy does
not itself authorize implementation or any execution operation.

## Separate Authority Remains Required

This adoption does NOT authorize:

- implementation;
- release preparation;
- host attestation or attestation probes;
- model calls;
- replay execution, including manual replay;
- closed-reference access or comparison;
- intent-fidelity;
- merge.

Implementation authority remains `PENDING`. Replay execution authority remains
`PENDING`. No implementation or execution authorization record is created.
The proposal's fresh independent implementation audit, exact release/input
locks, isolation evidence, human gates and separately scoped execution
authority remain prerequisites for later work.

## Carried Findings and Status Boundaries

F-03 remains **OPEN / MUST PRESERVE**: accepted-worker-return → canonical
LedgerWriter/orchestrator production reachability remains unproven.
No replay or inferred success closes that gap. An actual missing production
handoff must retain an incomplete result under the adopted design.

All proposal section 25 findings retain their exact governing strength:

| Finding | Preserved state |
| --- | --- |
| F-04 | OPEN / MUST PRESERVE |
| F-05 | OPEN / MUST PRESERVE, bounded by F-03 |
| A4-07 | Existing strength retained |
| S5A4-02, S5A4-03, S5A2-03 / S5-A-03 | DEFERRED |
| Slice 6 A-01, A-02, A-04, A-05 | Retained |
| Slice 6 A-03 | Closed observation |
| Slice 6 A-06 | Accepted observation |
| A7-04, A7-05, A7-08 | MUST PRESERVE |
| A8-01, A8-02, A8-03, A8-04 | MUST PRESERVE |
| A8-05, A8-06, A8-07, A8-08 | LATER-NONBLOCKING |

All other carried MUST PRESERVE/LATER/deferred findings and closed
observations retain their recorded scope and qualifiers. No finding is
repaired, closed, weakened, reinterpreted or removed by this adoption.
K2.19/K2.20 remain structural; semantic judgment, independent review,
human authority and canonical single-writer ownership remain distinct.

Manual mode remains the only sanctioned Aleph execution mode. Adoption
does not validate or sanction native/agent execution or establish semantic
validation, acceptance, production readiness, golden status or Aleph v1.
SRC-001 remains `CLOSED_FOR_CALIBRATION`; SRC-002 remains `NOT_AUTHORIZED`.

## Persistence Boundary

This adoption commit adds only this authority record and its single
`files.repository_administration` entry in `core.manifest.json`.
The proposal, Core/checker/prompts/adapter/runtime/tests, current
`1.8.0-provisional` run format, calibration reference and frozen inputs
remain unchanged. The preserved adapter branch, stash, other worktree
registrations and canonical `main` remain untouched.

No harness tooling/schema, replay attempt, release, host-capability receipt,
attestation, model invocation, workspace export, reference-answer access,
comparison or intent-fidelity work is created or performed. No prior commit
is amended and no merge occurs. Administrative checks establish only their
mechanical propositions, not independent audit or acceptance.

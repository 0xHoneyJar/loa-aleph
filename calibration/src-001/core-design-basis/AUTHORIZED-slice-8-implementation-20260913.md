# Slice 8 Implementation Authorization

Date: 2026-09-13

Status: AUTHORIZED — HUMAN IMPLEMENTATION AUTHORITY

Decision class: bounded implementation authorization; repository administration

## Exact authority subject

Repository: `0xHoneyJar/loa-aleph`

Implementation branch:
`agent/slice-08-duplicate-overlap-implementation-20260913`

| Identity | Commit | Tree | Git blob |
| --- | --- | --- | --- |
| Proposal: `PROPOSED-slice-8-s4-duplicate-versus-overlap-fresh-refutation-design-20260913.md` | `66d739ec1abaf02bb24abcc8f530b2bc0bd1eb6e` | `6ab19a4ec121bf498980c36824844eb97c5016e6` | `cc851b6b619e6b553f749bb3a68c817ea40e6a65` |
| Adoption: `ADOPTED-slice-8-s4-duplicate-versus-overlap-fresh-refutation-design-20260913.md` | `af9adc419a803f690a15ea12d4bbb8a9afeb449c` | `c75c84ee605f116d997bd3efd6240294d12212ed` | `d39a29653595858c6d70b36fe32cdcb57a8fd616` |
| Q8-MANUAL clarification: `ADOPTED-slice-8-manual-verifier-l3-profile-clarification-20260913.md` | `40de9df863396336240f61e23c342b11d389daa8` | `212c6b1208578e94ac25f0fe9a3cda112729eb97` | `8a9eb3904718c8f1da3cf6155061e74516773071` |

All three paths are under `calibration/src-001/core-design-basis/`.
The exact proposal controls implementation, with only the separate bounded
Q8-MANUAL clarification modifying its manual reviewer-profile representation.

Exact starting authority HEAD:
`40de9df863396336240f61e23c342b11d389daa8`

Exact starting authority tree:
`212c6b1208578e94ac25f0fe9a3cda112729eb97`

## Human implementation declaration — verbatim

```text
I authorize Slice 8 implementation based on the adopted Slice 8 design and Q8-MANUAL clarification.
```

The declaration above is the human's exact text. All other text in this
record is contextual metadata, not additional words attributed to the human.

## Scope and exclusions

Authority applies only to implementation of the adopted Slice 8 design plus
the Q8-MANUAL clarification. Proposal, adoption, and clarification historical
bytes remain unchanged. This record must be committed before executable
implementation changes and must not be amended.

No Slice 9, blind SRC-001 replay, merge, unrelated architecture repair, or
broad provider/orchestrator refactor authority is granted. No semantic
validation, agent sanction, acceptance, production readiness, golden status,
or v1 claim is granted.

Real native model calls remain separately governed. Implementation authority
does not authorize them. D8-P01 is
`NOT RUN — genuine native invocation requires separate authority`
unless separately retained explicit authority permits that invocation.
Simulation may not substitute for D8-P01.

All carried findings remain preserved unless separate evidence and authority
explicitly changes them. Fixture/process/static/native-looking tests do not
close F-03. Reconciliation and test reports are producer evidence only, not
independent audit. A fresh Claude Opus/xhigh independent implementation audit
is mandatory before merge consideration.

## Starting verification and preserved work

Before this administrative change the repository, branch, exact HEAD/tree,
and clean index/working tree (including nonignored untracked files) matched
the commissioning instruction. No assume-unchanged or skip-worktree entries
were present. The proposal/adoption/clarification commits, trees, blobs, and
direct ancestry matched the identities above.

The remote design branch
`agent/slice-08-duplicate-overlap-design-20260913` was verified at
`40de9df863396336240f61e23c342b11d389daa8`. The first read-only remote attempt
failed with sandbox DNS resolution; the unchanged check succeeded with
network permission. Mutable `main` was not substituted, merged, or rebased.

Canonical Slice 7 merge `31c0cdd6b0757a75f72d249cbad4ebc8b2d83911`,
tree `990bc7ac725b21798c9c23406ce2b69a000dc884`, is an ancestor. The retained
Slice 1–6 and OQ-01 merges named in proposal section 1 are also ancestors.

Starting `core.manifest.json` SHA-256:
`228bc6c6237e35c48f07ae2d6f8b6fc993c77be1837688f535166ad0d7d17d81`.
It declares Core `0.1.0-provisional`, adapter protocol `1.0.0-provisional`,
and run format `1.7.0-provisional`. CB1–CB10 passed over 658 paths: 428 Core,
51 Loa, 1 Hermes, 8 packaging, and 170 administration. Starting Core digest:
`sha256:6d03464b55e5214f6f5e47b33764ffcb88ad4f730d04fa912292ae3cfd9c09c8`.

Preserved adapter branch `agent/loa-adapter-release`:
commit `b9e2db742a087b8ae659ec39e476ed5e240cfa1f`,
tree `f9daba8ba3e9b33e2895265a1427d61829a90722`.

Preserved `stash@{0}`:
commit `e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8`,
tree `a71318a42d8dca812f7d57161d21e4d3bc1b388b`,
message `On agent/loa-adapter-release: preserve agent/loa-adapter-release before Slice 6`.

The existing worktree registrations remain untouched:

| Worktree | HEAD | Retained state |
| --- | --- | --- |
| `/home/eileenspectremoon/loa-dev/loa-aleph` | `40de9df863396336240f61e23c342b11d389daa8` | Clean implementation starting checkout |
| `/tmp/loa-aleph-s5a2-final-17e1d1a.lkyTtl` | `17e1d1acda17a38d72214af5022b8145220f96d8` | Detached; registration reports missing gitdir target |
| `/tmp/loa-aleph-s5a2-repair-20260908.EoH8Ki` | `17e1d1acda17a38d72214af5022b8145220f96d8` | Detached; registration reports missing gitdir target |
| `/tmp/loa-aleph-s7-retained-adoption-094a7ce` | `094a7ce3220631c8d4ee4c179e79b9b4529b6681` | Detached; registration reports missing gitdir target |
| `/tmp/slice6-pre16-authority` | `e45a1d9b1cafc5ef3b6a1fb46a61a8a395d45770` | Detached; registration reports missing gitdir target |

No preserved work is reset, deleted, restored over, or pruned.

## Carried findings and current status

| Finding | Preserved state |
| --- | --- |
| F-03 | OPEN / MUST PRESERVE: accepted-worker-return → canonical LedgerWriter/orchestrator production reachability remains OPEN. |
| F-04 | OPEN / MUST PRESERVE: path/case/platform portability. |
| F-05 | OPEN / MUST PRESERVE, bounded by F-03. |
| A4-07 | Absent canonical claim-to-claim evidential edge owner remains at its existing strength. |
| S5A4-02 | Deferred. |
| S5A4-03 | Deferred. |
| S5A2-03 / S5-A-03 | Deferred. |
| Slice 6 A-01, A-02, A-04, A-05 | Retained. |
| Slice 6 A-03 | Closed observation. |
| Slice 6 A-06 | Accepted observation. |
| A7-04 | MUST PRESERVE: K2.19 structural PASS carries zero semantic warrant. |
| A7-05 | MUST PRESERVE: fixture semantic declarations are not ground truth/reference standards. |
| A7-08 | MUST PRESERVE: manual reviewer profile and distinct actor/pass independence remain load-bearing. |
| A7-01, A7-02, A7-03, A7-06, A7-07, A7-09, A7-10, A7-11, A7-12 | Audit-closed observations remain closed observations only. |

Other adopted MUST PRESERVE/LATER findings retain their existing strength.
Manual mode remains the only sanctioned execution mode. Loa remains
structurally implemented/READY, unvalidated and unsanctioned; Hermes remains
planned/NOT-READY. SRC-001 remains `CLOSED_FOR_CALIBRATION`; SRC-002 remains
`NOT_AUTHORIZED`.

This authorization commit contains only this record and its required
`core.manifest.json` repository-administration entry. It implements no
executable behavior and does not assert completion of Slice 8.

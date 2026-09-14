# Blind SRC-001 Replay preparation authorization

Date: 2026-09-14

Status: AUTHORIZED — HUMAN REPLAY PREPARATION AUTHORITY

Decision class: bounded pre-attempt preparation; repository administration.

Repository: `0xHoneyJar/loa-aleph`.
Preparation branch: `agent/src-001-blind-replay-preparation-20260914`.

## Exact governing identities

| Subject | Commit | Tree | Git blob where applicable |
| --- | --- | --- | --- |
| Canonical merged harness; preparation base | `8236b9f35c38cdd604b2389b42589f27755cdade` | `72075f93bc9fcb3c76f4480bc612693211efd240` | n/a |
| Exact audited harness publication; merge parent 2 | `82b0a184b4bf693381b6e22851a08aa66b6a04ba` | `72075f93bc9fcb3c76f4480bc612693211efd240` | n/a |
| Generic replay release source; merge parent 1 | `c949ea5f39daef42d22ca2e4111164d63dffcbf1` | `8ced176e50da0d05070b164cfe725752df947d3f` | n/a |
| Adopted proposal | `c607b724d16c13202d581b23bab6af5e8a256a6a` | `88fc25d6c68b6bfbb1ea71c5ca385d1fb4c5bc79` | `40370866bcdfd3c70941aac21298aaaae96fff6e` |
| Design adoption | `6dbb68ce7b6a5f2c10e7808dc2eacc3d38bf89e9` | `8f3bdb283031c94da0420c38940bc2502728aeb8` | `25d60b9ec93eaa187fbf16ccf23ab305e1a70e85` |
| Q-R1 policy clarification | `84b6d9d734ab68f3986ce6b969ea0fb6e577bad2` | `ec802d9a5a9ac0910bcc1aca2cfec5394bc22092` | `fcd52d4e0f8638012986bc95d2c1560b12c92e3b` |
| Harness implementation authority | `b13e5ef20647e9f892da9c4fd213db7585da7ac3` | `55e53c3923b63672b63d92380ff312b6e2041382` | `4a1375742984878fc7ab19e6bdbfe6c6768a2fbd` |
| Harness implementation checkpoint | `483e247936ff0f77e3830dbdef63c01655f12a94` | `776fe93a408f90b13c18e5d4068305f51b358196` | n/a |
| Reconciliation-path clarification | `06bebc0be95b61e2f8c73004c61138c281f3826d` | `a37c682d4eebd2946d3470b35243cc353be1b8e8` | `50bf4714027426849ae527a188731d73085611ca` |

The governing files in this directory are
`PROPOSED-blind-src-001-replay-harness-design-20260914.md`,
`ADOPTED-blind-src-001-replay-harness-design-20260914.md`,
`ADOPTED-blind-src-001-replay-Q-R1-execution-policy-clarification-20260914.md`,
`AUTHORIZED-blind-src-001-replay-harness-implementation-20260914.md`, and
`AUTHORIZED-blind-src-001-replay-harness-implementation-reconciliation-path-clarification-20260914.md`.
The exact adopted proposal controls; its SHA-256 is
`52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8`.
This authority does not replace that proposal with a summary.

The immutable merged protocol is
`calibration/src-001/replay/protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/`.
Producer reconciliation remains at
`calibration/src-001/replay/tests/evidence/21-blind-src-001-replay-harness-implementation-reconciliation.md`.
Neither is independent preparation-audit evidence.

The human-supplied fresh independent harness-audit verdict is **zero blockers**,
with the eight LATER-NONBLOCKING observations retained below. This record
attributes that verdict to the supplied audit findings; it does not invent an
audit artifact, audit digest, auditor identity, or additional verdict.

## Human preparation declaration — verbatim

```text
I authorize preparation of the adopted Blind SRC-001 Replay under the merged harness at canonical main commit 8236b9f35c38cdd604b2389b42589f27755cdade. This authority permits only the bounded replay-preparation work required by the adopted harness: independent A/B reproduction and verification of the immutable generic replay release from canonical Slice-8 commit c949ea5f39daef42d22ca2e4111164d63dffcbf1, exact frozen-input export and custody locking, preparation of the replay environment/isolation and visibility manifests, and creation of the corresponding preparation records and evidence. It does not authorize host attestation probes, provider or model calls, native worker dispatch, /loa-aleph start/resume/validate on SRC-001, creation or execution of a replay attempt, closed-reference answer access or comparison, intent-fidelity work, F-03 repair, generic Core/adapter changes, or merge.
```

## Preparation identity and storage

Preparation is authorized. Execution is not authorized. No real replay attempt
exists yet in the inspected repository: the attempts directory is absent.
The existing `RUN-RETAINED-SLICE7-PROBE` contains only an empty `control/`
directory; it is retained untouched and is not a replay attempt.

Only after this record is separately committed, derive the administration
identity `PREP-SRC001-20260914-<short authority commit>` from that commit.
It is neither a replay ID nor a `/loa-aleph` run ID and establishes no
execution event. No replay ID may be fabricated for schema convenience.

Retain pre-attempt records under
`calibration/src-001/replay/preparation/<preparation-id>/`.
Do not create `calibration/src-001/replay/attempts/<replay-id>/`.
Attempt-scoped closed schemas remain unchanged. Where a real replay ID or
execution fact is mandatory, retain prerequisite evidence separately, list the
deferred record, and report `BLOCKED_PREPARATION_REQUIRES_REPLAY_ID` where
applicable. No attempt is created to obtain schema PASS.

Use the merged harness only for authority, tooling and administration.
Both independent clean full-history generic release builds must use exactly
`c949ea5f39daef42d22ca2e4111164d63dffcbf1` and its tree above. Neither
the merged harness, audited harness head, later preparation commit, mutable
main, nor pre-merge publication is a substitute. Actual checkout identity
and the package's selected dependency-closure provenance remain distinct.

## Operation and semantic boundaries

No host attestation, genuine capability receipt, model/provider operation,
native worker dispatch, SRC-001 start/resume/validate, semantic replay
production, manual replay completion, replay attempt or run ID is authorized.
No closed-reference answer may be opened; no comparator access, comparison,
expected-ID mapping or expected-score calculation may occur. Only opaque
container hashing, safe archive metadata inspection and specifically approved
frozen input-member extraction are authorized.

No F-03 repair, writer call site, direct LedgerWriter invocation, seeded
canonical ledger, generic Core/checker/adapter change, package-format semantic
modification, harness repair, intent-fidelity work, PR creation or merge is
permitted. A required repair stops the affected work for separate authority.
Preparation records belong outside Core-owned `docs/`.

Q-R1 remains policy only:
`EXPERIMENTAL_UNSANCTIONED_NATIVE_LOA`.
Manual remains the only sanctioned Aleph mode; no manual fallback is allowed.
Mechanical installation/verification may occur offline only within the
adopted legitimate isolation boundary, without attestation or replay start.
Missing isolation capability remains a blocker, not a passing substitute.

## Findings preserved without closure

The eight supplied harness-audit observations remain LATER-NONBLOCKING:

1. protocol namespace basename is not mechanically rebound to design SHA;
2. encoded-canary variants share an inventory-equality sub-rule and are not independent evidence;
3. `REPAIR-LOG.md` indexes only through evidence 015, not 016–019;
4. some producer-local retained evidence modes differed from committed Git modes;
5. historical receipt 018 raw report cannot now be independently byte-reproduced from the former uncommitted tree;
6. H-M14 synthetic fixture output mode is umask-sensitive because one test write lacks an explicit mode;
7. deterministic FAIL reports may retain absolute-path-bearing stacks;
8. zero-operation count fields are constants rather than instrumented measurements.

F-03 and F-04 remain OPEN / MUST PRESERVE; F-05 remains OPEN / MUST PRESERVE,
bounded by F-03. F-03's accepted-worker-return → production
orchestrator/LedgerWriter canonical mutation reachability remains unproven.
A4-07 retains its existing strength. S5A4-02, S5A4-03 and
S5A2-03 / S5-A-03 remain deferred. Slice 6 A-01/A-02/A-04/A-05 are retained,
A-03 remains a closed observation and A-06 an accepted observation.
A7-04/A7-05/A7-08 and A8-01/A8-02/A8-03/A8-04 remain MUST PRESERVE.
A8-05/A8-06/A8-07/A8-08 remain LATER-NONBLOCKING.
All other governing findings, qualifiers and closed observations keep their
existing strength. No preparation check closes them.

## Initial verification and persistence

Live `git ls-remote origin refs/heads/main` returned the exact canonical
merge above. Fetching that exact object without moving branch refs established
its exact tree and both ordered parents. Full local history is non-shallow,
has no replacement refs, includes 161 ancestors including the merge, and
passes `git fsck --connectivity-only --no-dangling` for the pinned merge.
Proposal, adoption and clarification blobs were reopened and verified.

The original checkout was clean at the audited harness publication. Local
`main` and `origin/main` were stale at the exact Slice 8 commit and remain
untouched; they were not used as substitutes for the verified live remote.
The preparation branch was created directly from the exact fetched merge.

Preserved adapter branch `agent/loa-adapter-release`:
`b9e2db742a087b8ae659ec39e476ed5e240cfa1f`.
Preserved stash: `e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8`.
The four detached/prunable registrations at
`/tmp/loa-aleph-s5a2-final-17e1d1a.lkyTtl`,
`/tmp/loa-aleph-s5a2-repair-20260908.EoH8Ki`,
`/tmp/loa-aleph-s7-retained-adoption-094a7ce`, and
`/tmp/slice6-pre16-authority` remain untouched.

This first commit adds only this authority record and its
`files.repository_administration` entry in `core.manifest.json`.
Commit it normally before any A/B build, frozen input export or executor
preparation. Push the preparation branch when complete or honestly blocked.
Do not amend history, rebase onto moving main, open a PR or merge.
Fresh independent preparation audit is required before consideration of any
separate execution authority. This record claims no replay, native
capability, semantic validation, acceptance, sanction, production readiness,
golden status or v1.

# Blind SRC-001 Replay Harness reconciliation-path clarification

Date: 2026-09-14

Status: AUTHORIZED CLARIFICATION — HUMAN AUTHORITY

Repository: `0xHoneyJar/loa-aleph`.
Branch: `agent/src-001-blind-replay-harness-implementation-20260914`.

## Exact authority and stopped checkpoint

| Subject | Commit | Tree | Git blob |
| --- | --- | --- | --- |
| Adopted proposal | `c607b724d16c13202d581b23bab6af5e8a256a6a` | `88fc25d6c68b6bfbb1ea71c5ca385d1fb4c5bc79` | `40370866bcdfd3c70941aac21298aaaae96fff6e` |
| Design adoption | `6dbb68ce7b6a5f2c10e7808dc2eacc3d38bf89e9` | `8f3bdb283031c94da0420c38940bc2502728aeb8` | `25d60b9ec93eaa187fbf16ccf23ab305e1a70e85` |
| Q-R1 clarification / original starting authority | `84b6d9d734ab68f3986ce6b969ea0fb6e577bad2` | `ec802d9a5a9ac0910bcc1aca2cfec5394bc22092` | `fcd52d4e0f8638012986bc95d2c1560b12c92e3b` |
| Implementation authorization | `b13e5ef20647e9f892da9c4fd213db7585da7ac3` | `55e53c3923b63672b63d92380ff312b6e2041382` | `4a1375742984878fc7ab19e6bdbfe6c6768a2fbd` |
| Harness implementation | `483e247936ff0f77e3830dbdef63c01655f12a94` | `776fe93a408f90b13c18e5d4068305f51b358196` | n/a |
| Checkpoint II / resumed HEAD | `63235ac27486f0c4d3d52377f80df183a28ba3b7` | `60ee1b745a5c4f1f7cfca63248607598daea33fe` | n/a |
| Canonical main / Slice 8 merge | `c949ea5f39daef42d22ca2e4111164d63dffcbf1` | `8ced176e50da0d05070b164cfe725752df947d3f` | n/a |

The proposal, adoption, Q-R1 and implementation authorization paths are,
respectively:

- `calibration/src-001/core-design-basis/PROPOSED-blind-src-001-replay-harness-design-20260914.md`;
- `calibration/src-001/core-design-basis/ADOPTED-blind-src-001-replay-harness-design-20260914.md`;
- `calibration/src-001/core-design-basis/ADOPTED-blind-src-001-replay-Q-R1-execution-policy-clarification-20260914.md`;
- `calibration/src-001/core-design-basis/AUTHORIZED-blind-src-001-replay-harness-implementation-20260914.md`.

The adopted proposal SHA-256 remains
`52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8`.
No preceding authority or implementation commit is amended.

## Human declaration — verbatim

```text
I clarify the Blind SRC-001 Replay Harness implementation authority: the producer implementation reconciliation may be relocated from `docs/architecture/21-blind-src-001-replay-harness-implementation-reconciliation.md` to `calibration/src-001/replay/tests/evidence/21-blind-src-001-replay-harness-implementation-reconciliation.md` so that it remains repository-administration evidence and does not alter the generic Core boundary. This clarification authorizes only that reconciliation-path relocation and the corresponding repository-administration manifest entry and internal path references. It does not authorize changing CB3, reclassifying the reconciliation as Core, changing Core/checker/prompts/adapter/runtime bytes, release preparation, attestation probes, model calls, replay execution, closed-reference access or comparison, intent-fidelity work, or merge.
```

## Actual publication blocker

Historical producer evidence:
`calibration/src-001/replay/tests/evidence/018-publication-blocker.json`.
Exact length: `5868` bytes.
SHA-256: `a5f3cf122ecebef764b6536595872726c86164495b4107f5183a0b12706df81d`.
Recorded raw CB3 report SHA-256:
`4429ba5f125fb202d1dfcd4bee6c51aca9da910b8da71b083513b2790e227bbc`.

The unchanged checker at `scripts/validate-core-boundary.ts` requires every
`docs/` path to be Core-owned. The requested uncommitted reconciliation at
`docs/architecture/21-blind-src-001-replay-harness-implementation-reconciliation.md`
was classified as repository administration and failed CB3:

```text
(Core completeness and class boundaries): Core-owned path is not Core: docs/architecture/21-blind-src-001-replay-harness-implementation-reconciliation.md
```

The producer stopped instead of changing the checker or Core classification.
Receipt `018` remains historical evidence with its exact observed failure,
raw report digest, stopped checkpoint, proposed resolution,
`publication_performed=false`, and `final_publication_head=null`.
This clarification and subsequent publication do not rewrite that receipt.

The retained uncommitted draft before relocation is `29793` bytes with
SHA-256 `1e1139f2c1e97a79997fcfabbace04562f02c0615231cac51ca6dc94d5499de7`.
Its old `docs/architecture/` location is abandoned after relocation and must
not remain tracked or untracked.

## Bounded permission

This clarification permits only:

1. Relocating the producer reconciliation from the failed uncommitted
   `docs/architecture/` location to
   `calibration/src-001/replay/tests/evidence/21-blind-src-001-replay-harness-implementation-reconciliation.md`.
2. The corresponding repository-administration manifest entry.
3. Internal reconciliation path references needed to make that relocation
   internally consistent.
4. Normal publication/check evidence already permitted by the implementation
   authority.

The relocated reconciliation remains producer evidence, repository
administration and calibration-only. It is not Core doctrine or independent
audit. Record the historical stop, this later clarification and its exact
committed identity, then run fresh final checks and retain their results.
No substantive semantic or executable authority is expanded.

This record and its administration entry are committed separately before
relocation/publication. Path-specific staging preserves the other uncommitted
evidence and draft. Receipt `018` is committed unchanged during publication.

## Explicit exclusions and retained status

This does NOT authorize editing or weakening CB3; adding a CB3 exception;
reclassifying any `docs/` file; classifying the reconciliation as Core;
changing Core, checkers, prompts, templates, Loa adapter, runtime,
worker-return contracts, run format or capabilities; release preparation;
host attestation; attestation probes; model/provider calls; replay execution;
reference-answer access; comparison; intent-fidelity; or merge.

The initial implementation authority did not authorize a Core/checker repair.
This clarification resolves only the publication-path conflict.
Generic Core/adapter/runtime bytes must remain unchanged, and a new check
failure requires stopping without weakening the check.

F-03 and F-04 remain OPEN / MUST PRESERVE. F-05 remains OPEN / MUST PRESERVE,
bounded by F-03. A4-07 retains its existing strength. S5A4-02, S5A4-03 and
S5A2-03 / S5-A-03 remain deferred. Slice 6 A-01, A-02, A-04 and A-05 retain
their boundaries; A-03 remains a closed observation and A-06 an accepted
observation. A7-04/A7-05/A7-08 and A8-01/A8-02/A8-03/A8-04 remain MUST
PRESERVE. A8-05/A8-06/A8-07/A8-08 remain LATER-NONBLOCKING.
All other carried findings retain their prior strength.

Manual mode remains the only sanctioned execution mode. The future selected
native replay remains experimental/unsanctioned. This path clarification
provides no replay/runtime sanction, semantic validation, acceptance,
production readiness, golden status or v1.

The preserved adapter branch, stash and four detached/prunable worktree
registrations were reverified unchanged before this record was written.
Canonical local/remote main and remote design equality were also reverified.
No reset, stash, prune, amend, rebase, discard, PR or merge is authorized.

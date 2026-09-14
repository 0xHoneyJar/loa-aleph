# Blind SRC-001 Replay Harness producer implementation reconciliation

Date: 2026-09-14

Status: **BLIND SRC-001 REPLAY HARNESS IMPLEMENTED — SYNTHETIC/MECHANICAL TESTS PASS — PUBLICATION PATH CLARIFICATION APPLIED — FRESH INDEPENDENT AUDIT REQUIRED**

Publication was initially blocked by CB3 because the uncommitted draft at
`docs/architecture/21-blind-src-001-replay-harness-implementation-reconciliation.md`
was administration evidence and the unchanged checker requires every `docs/`
path to be Core. The producer stopped; the initial implementation authority
did not authorize a Core/checker repair. That old path is now abandoned.

Historical `018-publication-blocker.json` remains exactly 5868 bytes with
SHA-256 `a5f3cf122ecebef764b6536595872726c86164495b4107f5183a0b12706df81d`.
Its observed CB3 failure, raw report digest, stopped checkpoint, proposed
resolution, `publication_performed=false` and `final_publication_head=null`
remain unchanged. Later resolution does not rewrite that failed attempt.

Human authority subsequently permitted only this reconciliation relocation,
its administration entry, internally consistent path references and the
already-authorized publication/check evidence. No semantic or executable
authority expanded; CB3 and all generic Core/adapter/runtime bytes are intact.
The new authority record is
`calibration/src-001/core-design-basis/AUTHORIZED-blind-src-001-replay-harness-implementation-reconciliation-path-clarification-20260914.md`.
Fresh checks after relocation are retained in
`019-publication-after-path-clarification.json` before final publication.

This is producer evidence only. It is not independent audit, release
preparation, replay evidence, semantic validation, reference comparison,
acceptance or sanction.

## Authority and exact implementation lineage

Repository: `0xHoneyJar/loa-aleph`.
Branch: `agent/src-001-blind-replay-harness-implementation-20260914`.
No mutable main substitution, rebase, amended authority record, or merge.

| Subject | Commit | Tree | Git blob when applicable |
| --- | --- | --- | --- |
| Starting authority / Q-R1 | `84b6d9d734ab68f3986ce6b969ea0fb6e577bad2` | `ec802d9a5a9ac0910bcc1aca2cfec5394bc22092` | `fcd52d4e0f8638012986bc95d2c1560b12c92e3b` |
| Proposal | `c607b724d16c13202d581b23bab6af5e8a256a6a` | `88fc25d6c68b6bfbb1ea71c5ca385d1fb4c5bc79` | `40370866bcdfd3c70941aac21298aaaae96fff6e` |
| Design adoption | `6dbb68ce7b6a5f2c10e7808dc2eacc3d38bf89e9` | `8f3bdb283031c94da0420c38940bc2502728aeb8` | `25d60b9ec93eaa187fbf16ccf23ab305e1a70e85` |
| Canonical Slice 8 merge / canonical main / deferred release source | `c949ea5f39daef42d22ca2e4111164d63dffcbf1` | `8ced176e50da0d05070b164cfe725752df947d3f` | n/a |
| Separate implementation authorization | `b13e5ef20647e9f892da9c4fd213db7585da7ac3` | `55e53c3923b63672b63d92380ff312b6e2041382` | `4a1375742984878fc7ab19e6bdbfe6c6768a2fbd` |
| Implementation checkpoint I | `483e247936ff0f77e3830dbdef63c01655f12a94` | `776fe93a408f90b13c18e5d4068305f51b358196` | n/a |
| Test/evidence checkpoint II | `63235ac27486f0c4d3d52377f80df183a28ba3b7` | `60ee1b745a5c4f1f7cfca63248607598daea33fe` | n/a |
| Separate human path clarification | `06bebc0be95b61e2f8c73004c61138c281f3826d` | `a37c682d4eebd2946d3470b35243cc353be1b8e8` | `50bf4714027426849ae527a188731d73085611ca` |

The proposal/adoption/Q-R1 paths are respectively
`calibration/src-001/core-design-basis/PROPOSED-blind-src-001-replay-harness-design-20260914.md`,
`calibration/src-001/core-design-basis/ADOPTED-blind-src-001-replay-harness-design-20260914.md`,
and `calibration/src-001/core-design-basis/ADOPTED-blind-src-001-replay-Q-R1-execution-policy-clarification-20260914.md`.
Proposal SHA-256:
`52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8`.
The exact adopted proposal controls.

The authorization is
`calibration/src-001/core-design-basis/AUTHORIZED-blind-src-001-replay-harness-implementation-20260914.md`.
It was committed separately before executable tooling and remains unchanged.
Its human declaration is preserved verbatim:

```text
I authorize implementation of the adopted Blind SRC-001 Replay Harness design and Q-R1 clarification. This authorization does not authorize release preparation, attestation probes, model calls, replay execution, closed-reference access or comparison, or intent-fidelity work.
```

**Final publication identity binding:** the publication commit is the normal
commit directly following path clarification
`06bebc0be95b61e2f8c73004c61138c281f3826d` which first adds this reconciliation.
Its tree contains this file, the final check receipts and administration
entries. No protocol, fixture or executable test bytes change after checkpoint
II. A commit cannot contain its own literal hash/tree without self-reference.
Therefore this record binds its enclosing first-addition commit/tree, and the
producer's final publication report supplies the measured literal identities
and remote equality. Resolve the immutable containing identity from history:

```sh
git log --diff-filter=A --format='%H %T' -- calibration/src-001/replay/tests/evidence/21-blind-src-001-replay-harness-implementation-reconciliation.md
```

The audit subject is that exact publication commit/tree and the full range
from starting authority `84b6d9d734ab68f3986ce6b969ea0fb6e577bad2`.
An audit must reject a different containing commit, changed authority bytes,
or a branch that has advanced beyond the reported publication identity.

## Implemented boundary

Exact protocol root:
`calibration/src-001/replay/protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/`.

The protocol lock digest is
`sha256:3446e3c9bc25a447fed4a9a5c8cbbd0985c1e1152f024d6ad17bac2e1b67fe09`.
Its inventory includes 14 entries, including two directories, and pins 20
unchanged imported Core contract/source files. The lock validates identity
consistency; the separately audited implementation commit supplies authority.

The harness validates closed records, raw bytes, inventory/derivation
closure, supplied recorder facts, synthetic snapshots, causal events,
selectors and report structure. It is calibration administration. It never
generates Aleph claims/ledgers, invokes LedgerWriter, dispatches a worker,
operates a VM, calls a provider, grants reference access or chooses semantic
correspondences. There are no new public Aleph commands.

The CLI accepts only `schemas`, `verify-protocol` and `validate-record`.
Schema-only validation establishes encoding/shape only. Cross-record APIs
perform R01–R09. Execution, export, release, attestation and reference-open
commands fail closed. No package.json registration was necessary.
No generated runtime projection of this calibration tooling was created.

Trusted custody, store bindings, input/environment pins, independently
recorded submissions, context receipts and recorder keys are caller inputs.
These checks validate their mechanical consistency. They do not establish
the truth of an untrusted recorder, cognitive blindness, provider training
exclusion or semantic independence. Missing required recorder facts block.
Actual VM construction, host recording and native delivery remain later
preparation/execution operations.

## Closed schemas and byte mechanics

`schemas/records.schema.json` implements these 33 versioned records:

- `src001-replay-manifest/v1`
- `src001-replay-input-lock/v1`
- `src001-replay-release-lock/v1`
- `src001-replay-execution-mode/v1`
- `src001-replay-environment/v1`
- `src001-replay-visibility/v1`
- `src001-replay-visibility-generation/v1`
- `src001-replay-derivation/v1`
- `src001-replay-reference-custody-lock/v1`
- `src001-replay-leak-check/v1`
- `src001-replay-event/v1`
- `src001-replay-run-reference/v1`
- `src001-replay-outcome/v1`
- `src001-replay-inventory/v1`
- `src001-replay-canonical-artifact-index/v1`
- `src001-replay-ledger-index/v1`
- `src001-replay-quiescence/v1`
- `src001-replay-freeze/v1`
- `src001-replay-freeze-attestation/v1`
- `src001-replay-access-receipt/v1`
- `src001-replay-reference-lock/v1`
- `src001-replay-comparison-manifest/v1`
- `src001-replay-mapping/v1`
- `src001-replay-exact-byte-report/v1`
- `src001-replay-structural-report/v1`
- `src001-replay-semantic-report/v1`
- `src001-replay-uncertainty-and-findings/v1`
- `src001-replay-comparison-inventory/v1`
- `src001-replay-audit-manifest/v1`
- `src001-replay-execution-evidence/v1`
- `src001-replay-workspace-observation/v1`
- `src001-replay-gate-projection/v1`
- `src001-replay-protocol-lock/v1`

Every record and nested object is closed. Tests reject unknown/duplicate/
missing keys, escaped duplicate keys, invalid enums, numeric quantities,
noncanonical decimal strings, invalid UTF-8 and noncanonical JSON. Harness
JSON uses the imported canonical compact sorted-key encoding with final LF.
Raw evidence is hashed before parsing. The existing supplied-representation
contract keeps its own ordinary Core encoding.

ArtifactRefs are exactly `{store,path,byte_length,sha256}`, with an
inventory-locked store digest, normalized relative path, decimal-string byte
length and lowercase SHA-256. Reads recheck full store identity and file
stability. Traversal, absolute/ambiguous names, non-NFC/case aliases,
symlinks/hardlinks, sockets/devices and special modes fail.

The approved input identities are fixed opaque constants. No real input
set was exported. The already-retained closed archive and custody manifest
were hashed as whole opaque files only; their adopted lengths/digests match
in `009-opaque-identities.json`. No members or answer rows were read.
Synthetic ZIP tests cover extraction/name/link/embedding behavior.
The synthetic descriptor imports unchanged ordinary Core
`aleph-supplied-representation/v1`: one whole-file text source/root/capture,
PDF as upstream asset, no invented semantic/region/table/equation annotation,
criteria outside corpus evidence, unavailable required formal/visual
material preserved through ordinary Core behavior.

R02 checks two recorded independent canonical-merge checkout/build receipts,
complete inventory and package/archive equality, dependency/runtime closure,
actual build commit/tree, selector commit/tree, bundle lock/provenance and
sidecars. Synthetic receipt bytes are fixtures, not a real canonical package.
No real replay release lock or A/B preparation was produced.

## R01–R09 results

All nine controls pass; each result states only its mechanical proposition.
These tokens live outside generic Core checker namespaces.

| Rule | Actual control token | Exact proposition |
| --- | --- | --- |
| R01 | `R01_MECHANICAL_PASS` | Approved input identities, roles, descriptor bindings and recorded scope match. |
| R02 | `R02_MECHANICAL_PASS` | Recorded canonical checkout, A/B reproduction, lock, package and runtime facts agree. |
| R03 | `R03_MECHANICAL_PASS` | Recorded accessible inventory, mounts, channels and denied probes close over the approved environment. |
| R04 | `R04_MECHANICAL_PASS` | Recorded delivered bytes, role allowlists, origin graph and context receipts agree. |
| R05 | `R05_MECHANICAL_PASS` | Declared mode, execution class, actor/pass and production-effect evidence are consistent. |
| R06 | `R06_MECHANICAL_PASS` | Exact snapshot inventory, detached freeze, indexes, quiescence and causal cut agree. |
| R07 | `R07_MECHANICAL_PASS` | Recorded grant/open follow verified freeze, comparator access is read-only and inventory is unchanged. |
| R08 | `R08_MECHANICAL_PASS` | Side-local evidence and anchors reopen with legal mapping structure and exact comparison bindings. |
| R09 | `R09_MECHANICAL_PASS` | Separate report classes preserve evidence, incompleteness, findings and all indeterminate counts. |

The outcome retains orthogonal mechanical-integrity, execution, completion,
raw Core/checker status/state/stage, gates/halts, blockers, evidence and
non-claims. Transport PASS never supplies a missing production effect.
Native policy remains `agent`, `experimental/unsanctioned`,
`native-dispatch`; generic manual representation remains `manual`,
`sanctioned-manual-path`, `manual-separate-pass`. Tests use synthetic
identities only, reject mode switches/fallback and reject fake native upgrades.

F-03 is reporting only. H-M24 validates newly authored artificial normalizer
return bytes with the unchanged Core worker-return contract, records
accepted/quarantined bytes and raw transport PASS without ledger write, and
rejects fabricated completion with `BLOCKED_F03_PRODUCTION_REACHABILITY`.
The blocked control can have valid mechanical integrity while incomplete.
No producer writer call site or adapter implementation changed.

Freeze tests cover complete files/directories including empty directories,
hidden/journal/quarantine evidence, exact modes/bytes, indexes, acyclic proof
copies, quiescence, production-stop event cut, detached digest and synthetic
signature. Events use sequence/predecessor digests and reject mutation/forks;
timestamps alone never establish chronology.

Synthetic reference grant/open/comparison events must follow the evaluation
freeze causally. Comparator evidence must declare a separate fresh actor,
denied writes and no writable aliases/credentials; the replay inventory must
remain unchanged. This is recorded access validation, not a live access probe.

Mappings reopen side-local raw JSON/JSONL/Markdown selectors and source
anchors. IDs are metadata, never join predicates. One-to-one, one-to-many,
many-to-one, many-to-many, legal absence and `CANNOT_DETERMINE` are represented.
Exact-byte, structural and semantic reports remain separate; uncertainty
and counts retain unknowns and the complete denominator.
No semantic similarity, embeddings, expected IDs/counts or reference-derived
keyword list is implemented.

The deterministic checks cannot decide whether a claim should exist,
whether two claims mean the same thing, normalization correctness, whether
a delta is good/bad, whether reference answers are universal truth, ideal
split/count/graph density, or semantic recall.

## Synthetic fixtures and mutation evidence

All fixtures are newly authored artificial mechanics scenarios. They contain
no SRC-001 expected outputs, answer rows or answer-derived wording, and are
not semantic ground truth.

- H-F1 inaccessible canary, input plumbing and closure controls: **PASS**.
- H-F2 blocked and completed synthetic snapshots with full directories: **PASS**.
- H-F3 actual ID renaming, same-ID indeterminacy and many-sided mappings: **PASS**.
- H-F4 indeterminate mapping, findings, summaries and denominator: **PASS**.

The final suite passes **59/59 test groups**, including **29/29 mutations**.
Each mutation retains a passing control, changed canonical bytes,
before/after hashes, the reached rule, actual failure evidence and token.
The final evidence retains 69 deduplicated raw synthetic blobs plus snapshot
file observations; it does not depend on deleted temporary fixture stores.
Additional tests exercise alternate leak encodings/archive embedding,
unknown ingress, negative-access receipts, event integrity, modes,
manual actor/pass distinctions, path/freeze changes, exact selectors and
comparison/audit inventory structure.

| Mutation | Reached rule | Actual refusal token | Expected refusal assertion |
| --- | --- | --- | --- |
| H-M01 | R03 | `FAIL_CONTEXT_LEAK` | PASS |
| H-M02 | R03 | `FAIL_CONTEXT_LEAK` | PASS |
| H-M03 | R03 | `FAIL_CONTEXT_LEAK` | PASS |
| H-M04 | R04 | `FAIL_CONTEXT_LEAK` | PASS |
| H-M05 | R03 | `FAIL_CONTEXT_LEAK` | PASS |
| H-M06 | R01 | `FAIL_INPUT_PIN` | PASS |
| H-M07 | R02 | `FAIL_RELEASE_PIN` | PASS |
| H-M08 | R01 | `FAIL_INPUT_PIN` | PASS |
| H-M09 | R01 | `FAIL_INPUT_PIN` | PASS |
| H-M10 | R06 | `FAIL_FREEZE_MUTATION` | PASS |
| H-M11 | R07 | `FAIL_COMPARISON_CHRONOLOGY` | PASS |
| H-M12 | R08 | `FAIL_COMPARISON_BINDING` | PASS |
| H-M13 | R07 | `FAIL_COMPARISON_CHRONOLOGY` | PASS |
| H-M14 | R06 | `FAIL_FREEZE_MUTATION` | PASS |
| H-M15 | R08 | `FAIL_COMPARISON_BINDING` | PASS |
| H-M16 | R09 | `FAIL_COMPARISON_BINDING` | PASS |
| H-M17 | R04 | `FAIL_CONTEXT_LEAK` | PASS |
| H-M18 | R04 | `FAIL_CONTEXT_LEAK` | PASS |
| H-M19 | R02 | `FAIL_RELEASE_PIN` | PASS |
| H-M20 | R02 | `FAIL_RELEASE_PIN` | PASS |
| H-M21 | R02 | `BLOCKED_RELEASE_REPRODUCTION` | PASS |
| H-M22 | R03 | `FAIL_CONTEXT_LEAK` | PASS |
| H-M23 | R05 | `BLOCKED_CONTEXT_EVIDENCE` | PASS |
| H-M24 | R05 | `BLOCKED_F03_PRODUCTION_REACHABILITY` | PASS |
| H-M25 | R05 | `BLOCKED_CONTEXT_EVIDENCE` | PASS |
| H-M26 | R08 | `FAIL_COMPARISON_BINDING` | PASS |
| H-M27 | R04 | `FAIL_CONTEXT_LEAK` | PASS |
| H-M28 | R06 | `FAIL_FREEZE_MUTATION` | PASS |
| H-M29 | R07 | `FAIL_COMPARISON_CHRONOLOGY` | PASS |

`tests/evidence/015-synthetic-results.json` retains the complete controls,
tests, mutation subjects and payloads. H-M01–05 use artificial canaries and
origin/inventory failures; they do not read or infer real answers.
The inaccessible external-canary control passes.
H-M25 and its additional cases preserve manual producer/reviewer,
conditional reviewer and L3/L2S actor/pass distinctions.
H-M26 preserves raw evidence reopening failures. H-M27 validates bounded
gate projection, not arbitrary semantic honesty in prose.

## Reproducibility, regressions and retained attempts


The fresh post-clarification validation candidate was the isolated synthetic
commit `945850d27e9367a58b244e597e6c0abe0969aa5a`, tree
`f724bd29e9dadb5b24c65b398f6bdca8dfbebc51`, parent
`06bebc0be95b61e2f8c73004c61138c281f3826d`.
All required fresh checks passed, including full `npm test` with exit 0,
CB1–CB10 with CB3 PASS, the 59/59 synthetic suite, R01–R09, H-F1–H-F4 and
H-M01–H-M29. Complete synthetic results remained byte-identical to retained
`015`, without normalization. `019` retains exact commands, raw stdout/stderr,
candidate inventory/commit bytes, boundary digests and compatibility facts.

An initial isolated-checkout setup stopped before any required check ran:
a `node_modules` symlink appeared as an untracked file. Its exact setup
failure is retained within `019`. The retry used the ordinary dependency
directory with existing local dependency bytes and preserved the same
candidate commit/tree. No implementation source changed and no check was
weakened. Historical `018` was not edited.

The committed final harness was typechecked and executed at checkpoint II.
Its complete canonical result is byte-identical to the isolated final
candidate run: 1,032,081 bytes, SHA-256
`1b43046741339778f10630a6e32ae6f1fa6bdc6d9a82361fde2485a8cda0dbad`.
No findings were removed or normalized away. The suite additionally rebuilds
independent synthetic fixtures and requires identical R01–R09 reports and
snapshot/descriptor identities.

`016-final-checks.json` binds command argv, checkpoint II commit/tree,
exit status, full stdout/stderr, protocol verification, local typecheck,
full synthetic suite, runtime drift check, Core/admin validation and
`git diff --check`, including the exact repeatability comparison.
`017-compatibility-checkpoint.json` binds exact identity/path preservation.
Receipt `019-publication-after-path-clarification.json` binds fresh checks
performed after the human path clarification: diff hygiene, harness
typecheck, protocol verification, the complete 59-group synthetic suite,
R01–R09, H-F1–H-F4, H-M01–H-M29, exact repeatability, CB1–CB10, runtime drift,
compatibility and full `npm test`. Its exact isolated candidate commit/tree,
complete candidate file inventory and changed administration bytes identify
the input state independently of the result receipt created afterward.
The final publication adds that receipt and its manifest entry and updates
only this reconciliation's publication-status/check-evidence wording.
It changes no executable, fixture, protocol or generic payload bytes from
the tested candidate. A final compatibility/admin check binds those limited
evidence changes; the producer's publication report supplies the containing
commit/tree and pushed remote equality without inventing self-hashes.

The complete unchanged `npm test` passed at checkpoint I,
`483e247936ff0f77e3830dbdef63c01655f12a94` /
`776fe93a408f90b13c18e5d4068305f51b358196`;
`012-regression-permitted.json` retains the entire output and exit 0.
This covers strict typecheck, runtime projection, Core boundary,
worker returns, mocked host/adapter/installer, all discovered fixtures,
internal ambiguity, Slice 5 process, representations, Slice 7 semantics,
Slice 8 source/runtime duplicate parity, conformance/lineage/relation/Core
mutations, bundle and release-package tests.
The genuine native D8-P01 probe remains NOT RUN by the existing suite's
authority boundary; a passing regression does not make it native evidence.
Those package builds are existing generic regression fixtures, not real
canonical replay release preparation or replay identity evidence.
All generic executable/package inputs remain exact at final publication.
The only executable change after checkpoint I is the calibration test's
retained-evidence/CLI assertion strengthening, rerun at checkpoint II.

All failed/repair attempts remain retained:

- `001-typecheck.json`: initial separator literal-type inference failure;
  repaired by explicit string type.
- `002-controls.json`: initial synthetic R02 selector receipt refusal;
  repaired synthetic base64 commit-object encoding and decoded comparison.
  Exit 0 only printed results and is explicitly not a passing suite.
- `003`–`008`: successive typechecks and 53/56/58-test suites, with their
  matching result files and exact source inventories where recorded.
- `009`: authorized opaque whole-file identity checks only.
- `010-regression-sandbox.json`: full suite stopped at compiler subprocess
  `EPERM`; no source repair. The same checkpoint passed in the permitted
  host context in `012`.
- `011-compatibility-checkpoint.json`: checkpoint I preservation proof.
- `013-environment-attempts.json`: read-only Git-directory staging and
  sandbox DNS failures, followed by scoped authorized retries; no reset,
  stash/drop/prune or source workaround, and no approval-review rejection.
- `014-candidate-typecheck.json`, `015-candidate-suite.json` and
  `015-synthetic-results.json`: isolated candidate validation of stronger
  raw payload retention, actual normalizer return shape and exact CLI
  refusal status. `016` verifies those exact committed test bytes.
- `018-publication-blocker.json`: initial CB3 publication-path refusal,
  preserved byte-for-byte. The producer stopped without a checker or Core
  repair; the separately committed human path clarification resolved only
  the document location.
- `019-publication-after-path-clarification.json`: fresh candidate checks and
  retained resolution evidence after that explicit human clarification.

`REPAIR-LOG.md` preserves the progression and limits. Routine read-only
discovery found two guessed filenames absent; canonical manifest/contract
paths were then read directly. That lookup had no mutation or test effect.
No authority record was amended and no failed test was concealed by
substituting an unrelated passing case.

## Compatibility and preserved work

All 834 pre-existing paths except `core.manifest.json` retain their exact Git
mode/blob against starting authority. The manifest changes only by adding
the listed files once to `files.repository_administration`; other fields,
all existing administration entries and payload classifications are exact.
All 600 Core paths, 52 Loa adapter paths, one Hermes path and 42 generated
runtime paths remain unchanged. Run format remains `1.8.0-provisional`.
Slices 1–8 executables, templates, prompts, checkers, worker-return schemas,
installers, public commands, package tooling and retained run pins are exact.
No Aleph capability was added and no generic semantic repair occurred.

Prospective boundary digests are unchanged from authority:

| Surface | Digest |
| --- | --- |
| Core | `sha256:ffec13a039d00a43b9b1e411daf0badd99f65f4bbd54af176146a98779ff124c` |
| Checker | `sha256:214c0ed2448f9200242cbba7ec6f71f454b24a1818ee090aa593911368f2496e` |
| Manual binding | `sha256:81c536d14dca524a7dea0a1ab0cf263cde985079f7c75e37e5d633ded65c7715` |
| Loa adapter | `sha256:fa38c4556f80afdd8227e5e4e0e3f37af2d8d33ead5f3669f6f3a51e5cf6916f` |
| Hermes adapter | `sha256:4335e08f14ac5836857ad288eb80cef9b2d3e4bc46b725a99966147baed9188c` |
| Loa payload | `sha256:276addb59829cd4735293c34e0fc1877cdcd221b3d01fd7bf6c758838c9e6572` |
| Hermes payload | `sha256:c938cc7566e8d7ada5ce23beab924317226940a654733c9f6ab961dd801f7795` |
| Loa prospective bundle | `sha256:e83ab57e971f2d508fe2b42139cd122b9fd70b9b309574efd10307ff6795c909` |
| Hermes prospective bundle | `sha256:c1b1006916ab2fd5cd93ea2127fd60f3009ff09ea5001be0ce68e27a2047fdb6` |

These are boundary/payload facts, not a reproduced real replay release.

| Protected reference | Commit | Tree |
| --- | --- | --- |
| `agent/loa-adapter-release` | `b9e2db742a087b8ae659ec39e476ed5e240cfa1f` | `f9daba8ba3e9b33e2895265a1427d61829a90722` |
| `refs/stash` | `e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8` | `a71318a42d8dca812f7d57161d21e4d3bc1b388b` |

The four existing detached/prunable worktree registrations remain exactly:

- `/tmp/loa-aleph-s5a2-final-17e1d1a.lkyTtl` at
  `17e1d1acda17a38d72214af5022b8145220f96d8`.
- `/tmp/loa-aleph-s5a2-repair-20260908.EoH8Ki` at the same commit.
- `/tmp/loa-aleph-s7-retained-adoption-094a7ce` at
  `094a7ce3220631c8d4ee4c179e79b9b4529b6681`.
- `/tmp/slice6-pre16-authority` at
  `e45a1d9b1cafc5ef3b6a1fb46a61a8a395d45770`.

No preserved work was reset, dropped, pruned, staged, restored or modified.
The primary implementation worktree advanced only through normal scoped
commits. Live remote main/design and final implementation publication
equality are checked before reporting completion.

## Carried findings, zero operations and next authority gate

| Finding | Preserved status |
| --- | --- |
| F-03 | OPEN / MUST PRESERVE; accepted-return to canonical production reachability remains unproven. |
| F-04 | OPEN / MUST PRESERVE; path/case/platform portability unresolved. |
| F-05 | OPEN / MUST PRESERVE, bounded by F-03. |
| A4-07 | Existing strength; no canonical claim-to-claim evidential-edge owner added. |
| S5A4-02; S5A4-03; S5A2-03 / S5-A-03 | Deferred. |
| Slice 6 A-01; A-02; A-04; A-05 | Retained; portable checks do not repair L2F A-05. |
| Slice 6 A-03 | Closed observation. |
| Slice 6 A-06 | Accepted observation. |
| A7-04; A7-05; A7-08 | MUST PRESERVE. |
| A8-01; A8-02; A8-03; A8-04 | MUST PRESERVE. |
| A8-05; A8-06; A8-07; A8-08 | LATER-NONBLOCKING. |

All other governing qualifiers retain their existing strength.
Manual mode remains the only sanctioned execution mode. The selected future
native replay remains experimental/unsanctioned. Fixtures cannot sanction it.
K2.19/K2.20 remain structural; SRC-001 remains `CLOSED_FOR_CALIBRATION`;
SRC-002 remains `NOT_AUTHORIZED`.

| Real operation | Count / state |
| --- | --- |
| Replay operations; SRC-001 start/resume/validate | 0 — exactly none |
| Release preparation / canonical replay A/B reproduction | 0 — exactly none |
| Real replay input export; VM creation/boot | 0 — exactly none |
| Host attestation / attestation or model probes | 0 — exactly none |
| Genuine replay provider/model calls or worker dispatch | 0 — exactly none |
| Closed-reference answer/member accesses | 0 — exactly none |
| Real comparisons or post-freeze reference expansion | 0 — exactly none |
| Real replay IDs/attempts created | 0 — exactly none |
| Intent-fidelity work | Not begun |
| F-03 repair; generic Core/adapter repair | 0 — exactly none |
| PR opened; merge | 0 — exactly none |

Only synthetic comparison/receipt/probe records were tested. Whole-file
opaque custody hashes do not constitute answer/member access.
Ordinary development-producer activity is not native replay evidence.
There is no real replay prepared/release reproduced, native capability
verified, replay validated, semantic validation, reference comparison,
agent sanction, acceptance, production readiness, golden result or v1.

Next: fresh **Claude Opus/xhigh independent implementation audit** of the
exact final publication commit/tree, full authority-to-publication range,
protocol lock/imports, actual failure evidence, schema and R01–R09 closure,
H-F1–H-F4/H-M01–H-M29, byte-preservation and zero-operation claims.
No PR is opened yet. Merge and real preparation/execution require their
separate human gates after that audit.

## Exact changed-file inventory

The following is the complete authority-to-publication path inventory,
including the check receipt created after candidate validation. All additions
are administration; the only existing-file edit is the administration array
in `core.manifest.json`. The failed, uncommitted old docs location is abandoned
and is not a final changed/tracked path. This inventory includes the relocated
reconciliation, historical blocker, path authority and resolution receipt
without making a self-referential file digest.

- `calibration/src-001/core-design-basis/AUTHORIZED-blind-src-001-replay-harness-implementation-20260914.md`
- `calibration/src-001/core-design-basis/AUTHORIZED-blind-src-001-replay-harness-implementation-reconciliation-path-clarification-20260914.md`
- `calibration/src-001/replay/fixtures/README.md`
- `calibration/src-001/replay/fixtures/SYNTHETIC-criteria.md`
- `calibration/src-001/replay/fixtures/SYNTHETIC-source.txt`
- `calibration/src-001/replay/protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/README.md`
- `calibration/src-001/replay/protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/protocol-lock.json`
- `calibration/src-001/replay/protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/schemas/records.schema.json`
- `calibration/src-001/replay/protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/src/cli.ts`
- `calibration/src-001/replay/protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/src/comparison.ts`
- `calibration/src-001/replay/protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/src/freeze.ts`
- `calibration/src-001/replay/protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/src/index.ts`
- `calibration/src-001/replay/protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/src/inputs-release.ts`
- `calibration/src-001/replay/protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/src/protocol.ts`
- `calibration/src-001/replay/protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/src/records.ts`
- `calibration/src-001/replay/protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/src/storage.ts`
- `calibration/src-001/replay/protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/src/synthetic-archive.ts`
- `calibration/src-001/replay/protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/src/visibility-execution.ts`
- `calibration/src-001/replay/tests/evidence/001-typecheck.json`
- `calibration/src-001/replay/tests/evidence/002-controls.json`
- `calibration/src-001/replay/tests/evidence/003-typecheck.json`
- `calibration/src-001/replay/tests/evidence/004-suite.json`
- `calibration/src-001/replay/tests/evidence/004-synthetic-results.json`
- `calibration/src-001/replay/tests/evidence/005-typecheck.json`
- `calibration/src-001/replay/tests/evidence/006-suite.json`
- `calibration/src-001/replay/tests/evidence/006-synthetic-results.json`
- `calibration/src-001/replay/tests/evidence/007-typecheck.json`
- `calibration/src-001/replay/tests/evidence/008-suite.json`
- `calibration/src-001/replay/tests/evidence/008-synthetic-results.json`
- `calibration/src-001/replay/tests/evidence/009-opaque-identities.json`
- `calibration/src-001/replay/tests/evidence/010-regression-sandbox.json`
- `calibration/src-001/replay/tests/evidence/011-compatibility-checkpoint.json`
- `calibration/src-001/replay/tests/evidence/012-regression-permitted.json`
- `calibration/src-001/replay/tests/evidence/013-environment-attempts.json`
- `calibration/src-001/replay/tests/evidence/014-candidate-typecheck.json`
- `calibration/src-001/replay/tests/evidence/015-candidate-suite.json`
- `calibration/src-001/replay/tests/evidence/015-synthetic-results.json`
- `calibration/src-001/replay/tests/evidence/016-final-checks.json`
- `calibration/src-001/replay/tests/evidence/017-compatibility-checkpoint.json`
- `calibration/src-001/replay/tests/evidence/018-publication-blocker.json`
- `calibration/src-001/replay/tests/evidence/019-publication-after-path-clarification.json`
- `calibration/src-001/replay/tests/evidence/21-blind-src-001-replay-harness-implementation-reconciliation.md`
- `calibration/src-001/replay/tests/evidence/REPAIR-LOG.md`
- `calibration/src-001/replay/tests/synthetic.ts`
- `calibration/src-001/replay/tests/test-harness.ts`
- `calibration/src-001/replay/tests/tsconfig.json`
- `core.manifest.json`

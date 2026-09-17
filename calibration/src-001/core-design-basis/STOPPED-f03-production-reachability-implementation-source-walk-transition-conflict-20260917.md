# F-03 implementation continuation stopped — C-02 source-walk transitions

Date: 2026-09-17

Status: **IMPLEMENTATION_STOPPED_CORE_CONTRACT_CONFLICT — C-02**

This is a producer-authored partial implementation checkpoint and
repository-administration evidence. It is not a producer-complete
implementation candidate, independent audit, release, live execution,
semantic validation, acceptance, sanction or finding closure.

F-03: **OPEN / MUST PRESERVE**.
F-04: **OPEN / MUST PRESERVE**.
F-05: **OPEN / MUST PRESERVE**, bounded by F-03.

## Authority and exact continuation

| Subject | Exact identity |
| --- | --- |
| Repository / branch | `0xHoneyJar/loa-aleph` / `agent/f03-production-reachability-implementation-20260917` |
| Required stopped continuation HEAD | `5e17212cedbb47fa1cc27a0f5f11d941f9d7850e` |
| Required stopped continuation tree | `5f2097b28f0143bc962fd1fa3740add5d5e1e785` |
| Prior implementation authority | `4a999689a21b08f4d7c333e3b28362d47476d02f` |
| Adopted design commit / tree | `484fa227e1ed23c81dc4cf37987aa0be16eded8f` / `13ad9e53a77949718afa9dc59c25c2e9d52beacb` |
| Canonical remote main / tree | `8236b9f35c38cdd604b2389b42589f27755cdade` / `72075f93bc9fcb3c76f4480bc612693211efd240` |
| Separate HUMAN clarification commit | `2cf9d884232107ff98268844ec3e8146f95a9a93` |
| Clarification commit tree | `ac94509d9b6cc25536e1116291804ee55bd2016c` |
| Clarification record blob | `7c6c665af3988f588d637a7dc8b6d162819d7ab8` |
| Clarification record SHA-256 | `01d50b0795c029f1cced0e5d81cc988e4f3a55d240da78a542d0ad18f0c14222` |
| Clarification record bytes | `6797` |
| Separate C-01 reconciliation commit | `e2cbc0b06f38a36ddd4cad30e069d857e63aac5e` |
| C-01 reconciliation tree | `d3ea8c065a14b1e311dd6ecd16768dd20bad9879` |

Clarification:
[ADOPTED-f03-degraded-packet-l2s-binding-clarification-20260917.md](ADOPTED-f03-degraded-packet-l2s-binding-clarification-20260917.md).
The HUMAN declaration was persisted verbatim before new implementation;
its separate commit changes only that record and its administration entry.

The original stopped record remains unchanged:
`STOPPED-f03-production-reachability-implementation-core-contract-conflict-20260917.md`,
blob `893bcc16f1dde9793b7a367ad4d4c5cba96930bb`,
SHA-256 `4f052dc4648fc963bd62b129cad47a19c25f2a2e7c1bb531dc65df31f27d562a`.
Its historical reproduction JSON also remains byte-identical. Neither record
has been rewritten to imply prior knowledge of the HUMAN clarification.

The continuation gate verified the exact clean local and remote implementation
branch, HEAD/tree/parent, unchanged design and authority records, exact original
stop record, canonical remote main, primary SRC-001 preparation branch,
adapter branch, stash and every existing worktree registration. Work remains
in `/tmp/loa-aleph-f03-implementation-20260917`. The primary worktree is not
an implementation input or mutation target.

Chronology: adopted design → original implementation authority → partial
implementation → C-01 discovered → original stop → HUMAN clarification →
clarification-only commit → C-01 implementation/regressions → S2 derivation
drafting → C-02 reproduced by a separate Core discriminator → this new stop. No commit was
amended, discarded or rebased.

## C-02 — current completion row versus retained-line preservation

The required S2 transition has no reconciled temporal Core contract:

1. K2.14 requires **one completion row for every source** as soon as S2 is
   observable. The row's `final_cursor_id` must be the last retained cursor.
   Its gap IDs must equal all retained gap reviews. A blocked row cannot
   remain behind committed traversal/events.
2. Progress appends walk/event/cursor records. Fresh gap review occurs after
   the primary source-end checkpoint. Those operations necessarily change
   the current completion row's cursor/gap/state facts.
3. The existing Core `planRepresentationUseWrite` permits new packet and
   source-walk rows only when **all retained lines remain in order**. Replacing
   the old completion row is expressly refused.
4. Appending a superseding completion row without changing the Core
   interpretation fails K2.14's one-row-per-source rule; it also leaves the old
   row subject to current-frontier validation. Omitting the old row before
   traversal does not satisfy the required before-state.

Decision 0003, additional implementation clarification 2, says ledgers are
append-over-mutate and “update” means append a superseding row retaining the
old row. There is no source-walk-specific adopted current-state/history rule
that reconciles that requirement with K2.14's unique current row.

| Exact surface | Evidence |
| --- | --- |
| `docs/decisions/0003-architecture-build-kit-implementation.md`, additional clarification 2 | Append-over-mutate / superseding-row rule |
| `docs/architecture/03-artifact-contracts.md`, §4a | S2 producer records and cursors are appended by the single writer |
| `docs/architecture/templates/03-extraction-claims.md`, T3.2 | Completion binds the actual current frontier; found gaps progress from open to reconciled; unsupported/deferred states remain honest |
| `docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md`, K2.14 | Mandatory five tables; one completion row per source; last cursor; all gap reviews |
| `scripts/lib/checks-k2.ts`, `checkSourceWalk` | Duplicate final traversal state at line 2268; last cursor at line 2299; full gap-review set at lines 2397–2421; missing completion at line 2495 |
| `scripts/lib/source-representation.ts`, `planRepresentationUseWrite` | Exact retained-line subsequence check; `FROZEN_WRITE ... subject writes may insert rows but cannot replace retained lines` |
| Adopted F-03 design §§11–16 | Reuse existing Core plan authorities; progress/recover packet+walk effects; no rewritten semantic/material rules or arbitrary after-images |
| HUMAN C-01 clarification | Settles degraded-packet L2S identity only; does not adopt source-walk current-state/history semantics |

`scripts/lib/checks-k2.ts` is unchanged from the adopted design:
blob `fc2e5eb23aa719cb6a05da17dca7322fb545e7b0`,
SHA-256 `23369afafd113f0012af4f321ef70dedd694ed883252d296f3edc7c9a4a7fcf3`.
The complete `planRepresentationUseWrite` body is byte-identical to the adopted
base despite C-01's separate material-view refactoring elsewhere in that file.
The existing T3.2 source-walk rules were not modified.

This is not a choice of JSON key spelling, ID width or mechanical row renderer.
It decides where historical state is retained, how the current state is
selected, and what source-walk mutations are legal. Silently calling the
completion table a replaceable cache, excluding it from the existing plan's
guard, or suppressing the K2.14 failure would introduce an unadopted Core rule.
The producer has not done so.

## Reproducible discriminator

```bash
node adapters/loa/tests/test-f03-source-walk-transition-conflict.ts
```

Exact output:
[f03-source-walk-transition-conflict-20260917.json](f03-source-walk-transition-conflict-20260917.json).

The discriminator constructs disposable synthetic Core artifact snapshots.
It does not call the controller, authenticate a worker, execute a reviewer,
or claim that a combined fixture after-image proves legitimate review timing.
Its subject is the intersection of the existing K2.14 and material-plan
transition rules.

For both cumulative 1.8 and 1.9:

| Case | K2.14 | Existing material plan |
| --- | --- | --- |
| Before: initial cursor, no packets, one blocked completion | PASS | Representation before-state valid |
| After: exact packet/walk/event, terminal cursor, retained synthetic gap review, current completion | PASS | **FAIL: replacing retained completion line** |
| Preserve old completion while appending the new records | FAIL: stale cursor, behind committed work/event, missing gap ID | PASS |
| Append new completion after old completion | FAIL: duplicate final traversal state, stale old row | PASS |
| Omit before-state completion | FAIL: missing required per-source completion | Not a valid way to defer current-state accounting |

Both independently checked representation snapshots pass their applicable
Core representation rules. A passing discriminator means the conflict was
reproduced, not repaired. The S2 draft is not involved in these decisions.

## Exact HUMAN decision needed

What Core history/current-state rule should cumulative 1.9 use for source-walk
completion updates so cursor and gap progression satisfy K2.14 while preserving
the required retained history?

An explicit append-only successor/current-selection contract and an explicitly
authorized current projection backed by immutable history are materially
different contracts. Neither is selected here. The decision must also name
the legal writer/plan boundary and recovery binding. Old pinned formats must
retain their original bytes and semantics.

Related open→resolved interval, pending→committed event and open→reconciled gap
rows merit checking under the adopted answer. This discriminator establishes
the completion-row conflict; it does not pretend those additional lifecycles
have already been exhaustively investigated or settled.

## Implemented C-01 clarification

The dedicated output shape is:

```text
output_binding = {
  kind: "degraded-packet",
  source_id,
  degraded_source_locator,
  degradation_reason,
  criterion
}
subject.material_use = exact complete selected producer MaterialUseInput
```

`producer_binding_hash` binds the unchanged original `packet-candidate` index,
call/context/raw hash. The selected source/locus/reason/criterion and complete
ordered material declaration are checked against the retained raw producer.
There is no singular OBJ identity, sorting, splitting, synthetic material
candidate, PKT/CC, exact packet basis, exact anchor or affirmative unit.

The one material view uses `aleph-degraded-packet-material-subject/v1` with
inventory hash, producer hash, source and complete MaterialUseInput. Its
declaration must be canonically identical to `subject.material_use`.
Existing visibility closure selects all required material/context; no USE
row is fabricated. Existing L2F and material rules remain independent.

The new variant is gated by `orchestrator-work-transitions`, first available
at cumulative 1.9. Real material findings remain singular `material-only`.
Old 1.7/1.8 variants are not broadened. The normal installed/default format
and package manifests remain **1.8.0-provisional**; no release is prepared.
Adapter protocol remains **1.0.0-provisional**.

The former C-01 discriminator is now a 27-case clarification regression.
It checks one/multiple OBJ requirements, exact order and full declaration,
field tampering, synthetic selector replacement, wrong output variants,
fictitious authority, duplicate subjects, missing selector coverage, immutable
raw producer bytes, predecessor gating and a separate runtime process.
A recomputed view cannot authorize a changed material requirement order.
This is Core/helper/fixture evidence; it does not establish production reachability.

The worker-contract count is fixed to exactly **25**, not an open-ended bound.
The suite passes 14/14 under the permitted child-process environment.

## Partial implementation and remaining frontier

| Surface | Status at this stop |
| --- | --- |
| S0 | Prior fixture start/freeze/recovery implementation retained; no genuine authority or native execution performed here |
| S1 | Prior controller/intake/two-review fixture path retained; only structural evidence |
| S2 | Dedicated degraded subject derivation implemented/tested. Additional private source preparation/capture drafting began before C-02, but remains **unwired and unqualified** |
| S3 | Mandatory normalization, review and composed admission controller work remains incomplete |
| S4 | Mandatory duplicate/relation/ambiguity/human-gate composition remains incomplete |
| S5+ | No new work family or support claim. Current selector returns `WORK_FRONTIER_UNIMPLEMENTED` for every stage after S1; completed S4/C3→S5 routing remains unfinished |
| Controller/work identity | Original draft retained; complete closed schemas, tuple/dependency/effect binding and finite consumption remain unfinished |
| Process reauthentication | Original accepted-evidence/basis reopening draft retained; full adversarial matrix remains incomplete |
| Writer ingress | Complete new-format legacy bypass refusal and family composition remain unfinished |
| Recovery / exactly-once | Prior S0/S1 draft evidence only; full adopted fault matrix and all-family exactly-once proof remain unfinished |
| Installed runtime routing | Prior draft retained; full predecessor routing proof remains unfinished |
| Skill / command | Required structured transport/controller loop remains unfinished |
| F-05 production-path testability | Required controller late-correction/lineage refusal path remains unfinished |

The S2 draft adds internal types, source/cursor preparation and candidate-to-
packet/walk projections in `work-transitions.ts`. It has not been connected
to `selectNextWork` or `deriveWorkTransition`; it is not a supported production
path and must be completed/reviewed after the Core decision. No draft
after-image was written into a real run. C-02 was confirmed before wiring
or broadening the writer. The new draft is retained as partial chronology.

All unfinished obligations from the original stop remain mandatory:
S2 SEM/material/L1/gap accounting and seals; S3 review/admission;
S4 DUP/L3/L5/successor/relations/L3R/L2F/C1/C2/C3/authority composition;
historical dependencies; closed schemas; ingress authentication; shared
locking; durable error/unknown-dispatch halts; partial assembly recovery;
consumption/chain reconciliation; installed controls; exact retained runtime;
fault/replay/mutation/compatibility/install testing; and F-05 reachability.

## Continuation changed-path inventory and payload identity

The continuation from `5e17212` changes exactly these 18 paths. The complete
implementation range from the adopted design also includes the earlier
authority and stopped partial implementation; this inventory does not erase
those earlier changes.

| Class | Path |
| --- | --- |
| Adapter ownership | `adapters/loa/adapter.manifest.json` |
| C-01 regression | `adapters/loa/tests/test-f03-degraded-binding-conflict.ts` |
| C-02 discriminator | `adapters/loa/tests/test-f03-source-walk-transition-conflict.ts` |
| Administration | `calibration/src-001/core-design-basis/ADOPTED-f03-degraded-packet-l2s-binding-clarification-20260917.md` |
| Administration | `calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-source-walk-transition-conflict-20260917.md` |
| Administration | `calibration/src-001/core-design-basis/f03-continuation-structural-checks-20260917.json` |
| Administration | `calibration/src-001/core-design-basis/f03-source-walk-transition-conflict-20260917.json` |
| Classification inventory | `core.manifest.json` |
| Core contract | `docs/architecture/prompts/verifier-lenses.md` |
| Core contract | `docs/architecture/prompts/workers-intake-extraction.md` |
| Core contract | `docs/architecture/templates/03-extraction-claims.md` |
| Generated runtime | `runtime-js/scripts/lib/semantic-review.js` |
| Generated runtime | `runtime-js/scripts/lib/source-representation.js` |
| Generated runtime | `runtime-js/scripts/lib/work-transitions.js` |
| Core source | `scripts/lib/semantic-review.ts` |
| Core source | `scripts/lib/source-representation.ts` |
| Core source, including unwired S2 draft | `scripts/lib/work-transitions.ts` |
| Contract discovery test | `scripts/test-worker-return-contract.ts` |

The final stopped source payload uses `sha256-path-file-digest-v1`:

| Scope | Digest |
| --- | --- |
| Core payload | `sha256:d5b034bc9e4b1acb25528296a21ba050b2a45600451feecc533afe3fe55cf92d` |
| Checker | `sha256:62ed420e137331f4cb4f84c476ad34195c508ecde3d4e3c93e5ece2e69fda20a` |
| Loa adapter payload | `sha256:4c40106c18cbd9248b272ec7eea748be86499da100a3063e81662bb0ad4e5b89` |
| Generated `runtime-js/` subtree, 44 files | `sha256:e7ee1163a0a3b3db5865275f8453d619e9998790116fab13efee83f306cd4a99` |

The runtime subtree digest identifies generated repository bytes, not a
particular run's runtime snapshot (which also binds run-local paths, Node,
host and capture metadata). The profile file SHA-256 is
`0f42918979d45a767233be9667000bde5ebea161fdae6c1b3deb99b651cb2831`.
No production run or immutable distribution is created to obtain these
identities. The verification record retains the exact source/test path
hashes and command outputs; administration records are identified by their
containing Git tree to avoid self-referential hashes.

## Verification and failure chronology

Machine-readable command results:
[f03-continuation-structural-checks-20260917.json](f03-continuation-structural-checks-20260917.json).

Initial failures were retained:

- C-01 first regression run: 24/25. The missing-limitation mutation correctly
  failed Core's `STATE ... use state requires honest reason and limitations`,
  but the test expected a different token. The expectation was corrected;
  the validator was not weakened. Expanded suite: 27/27.
- Sandbox runtime generation returned `spawnSync ... node EPERM`.
  The unchanged generation command passed with permitted child processes.
- The worker-contract discovery fix passed the exact 25 count immediately;
  its sandbox CLI child test then returned empty output. The same suite
  passed 14/14 with permitted child processes.
- Adding the Core derivation helper exposed a test-only TypeScript
  `MaterialUseInput`→JSON index-signature cast error. The explicit
  `unknown` bridge was added for the already-validated synthetic value;
  typechecking then passed. No runtime contract changed for this fix.
- Registering the new C-02 discriminator initially updated the classified
  inventory without the matching Loa `owned_paths` entry. CB7 refused the
  mismatch. The missing ownership entry was added before final verification;
  this is test inventory bookkeeping, not a change to the blocked Core rule.
- The broad stopped-checkpoint semantic mutation suite passes its baseline
  and M01–M22, then fails M23 at
  `scripts/test-semantic-review-mutations.ts:171`: its expected capability
  set lists only 1.7/1.8, while cumulative 1.9 also has semantic review.
  That test and `scripts/lib/run-model.ts` are both byte-identical to the
  original stopped checkpoint. The failure is retained, later cases in that
  command are not reported as run, and the test is not repaired after the
  new Core-policy stop. It remains a mechanical expectation update for the
  next authorized continuation, not evidence that old-run semantics changed.
- Duplicate parity passes the 18 contract, 28 fixture and 44 mutation cases
  in both source and runtime, then the source process fails **D8-P09** at
  `adapters/loa/tests/test-duplicate-review-process.ts:388`. Retargeting the
  return's subject digest produces a `FAIL` report with `validated = null`
  and `DUP_SUBJECT`; the test expected an exception. The legacy publication
  wrapper nevertheless replaces raw/report bytes and leaves the older
  `validated.json`. Reopening that mutated evidence then fails `DUP_SUBJECT`.
  This is unreconciled refusal/publication compatibility, not a demonstrated
  successful authentication bypass. The canonical duplicate ledger is
  unchanged. D8-P08's stale-basis refusal passed; the initial progress-message
  attribution to D8-P08 was corrected after checking the exact line and
  retained progress. Later process cases and the runtime process invocation
  were not run by the aborted wrapper. The process test, worker-return module
  and duplicate Core module are unchanged from the original stopped checkpoint.

The C-01 checkpoint passed typecheck, 44-file runtime generation/parity,
CB1–CB10, 27 clarification regressions, worker contracts, semantic contract
checks, and 71 representation structural mutation cases. The final stopped
source verification ran **31 commands: 29 PASS, 2 FAIL**. Each component of
`npm test` was invoked separately, with the additional orchestration and
C-01/C-02 commands, so one failure did not suppress the other suites. The
two failed commands still suppress their own later cases as detailed above.

| Check surface | Result |
| --- | --- |
| Typecheck; runtime generation/parity | PASS; 44 generated files |
| Core boundary | CB1–CB10 PASS; 897 classified paths |
| C-01 clarification | 27/27 PASS, including one/multiple OBJ, selector coverage, tampering, old-format gates and runtime process |
| C-02 discriminator | Conflict reproduced in 1.8 and 1.9; not repaired |
| Worker contracts | 14/14 PASS; exact discovered count 25 |
| S0/S1 orchestration process | PASS through supported CLI with fixture transport and fresh-process resume after accept; S2 entry then unsupported-frontier halt |
| Runtime mutation/repeatability | 6/6 PASS |
| Host / adapter / installer fixture batteries | 24 / 34 / 17 passing cases |
| Discovered Precis/run fixtures and isolated evidence/projection/golden checks | PASS |
| Internal ambiguity contracts / mutation battery | 12/12 and 123/123 PASS |
| Slice 5 process | 76/76 PASS |
| Representation mutations / process | 71/71 and 20/20 PASS |
| Semantic contracts | 64 passing cases |
| Semantic mutations | FAIL at M23; baseline and M01–M22 passed |
| Semantic process | 33 cases PASS in source and 33 PASS in runtime |
| Duplicate contracts / fixtures / mutations | 18 / 28 / 44 cases PASS with source/runtime parity |
| Duplicate process / overall duplicate parity | FAIL at source D8-P09; runtime process not run |
| Conformance / lineage / relation mutations | 117/117 (11 clean baselines), 34/34, 74/74 PASS |
| Core-boundary mutations | 12 passing cases |
| Bundle structural tests / disposable package tests | 31 and 23/23 PASS |
| Whitespace / changed-path inventory | PASS; 18 continuation paths |

These are overlapping suite case counts, not a sum of unique capabilities or
proof obligations. The C-01 and C-02 repeated outputs are byte-identical;
runtime and disposable package tests also check repeated byte equality.
The machine-readable record binds the tested source projection and retains
all command outputs, initial failures and the D8-P09 read-only discriminator.
Only administration evidence changed while the broad suites ran. Post-commit
identity/whitespace/boundary checks bind publication to those same source
bytes. No green fixture total discharges the unfinished F-03 implementation DoD.

## Prohibited-operation counters and audit subject

Provider/model calls: **0**. Genuine native workers: **0**.
Live research-corpus runs: **0**. SRC-001 preparation/replay operations: **0**.
Closed-reference access/comparison: **0**. Release preparation/publication:
**0**. Loa ingestion: **0**. PR creation: **0**. Merge: **0**.
Sanction, acceptance, finding closures and v1 declarations: **0**.

Disposable fixture tests and test-only local package/install artifacts do not
constitute native/live evidence or a distribution release. Administration
records stored under the governance evidence directory are not SRC-001
preparation/replay.

The proposed fresh independent audit subject is the exact pushed continuation
range `5e17212cedbb47fa1cc27a0f5f11d941f9d7850e..HEAD` containing this
record: literal HUMAN clarification custody, C-01 reconciliation, predecessor
gating, exact regression evidence, and C-02's conflict/stop discipline.
Resolve `HEAD` to the final commit/tree reported in the publication response.
This is a **partial continuation and conflict audit**, not a full F-03
implementation acceptance or closure audit.

**Strongest justified status: C-01 clarification implemented with structural
regressions; F-03 implementation incomplete and stopped on C-02 pending a new
HUMAN Core decision.**

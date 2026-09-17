# F-03 implementation continuation stopped — C-03 shared-position event continuation

Date: 2026-09-17

Status: **IMPLEMENTATION_STOPPED_CORE_CONTRACT_CONFLICT — C-03**.

This is a partial implementation checkpoint and repository-administration evidence. It is not a producer-complete S0–S4 candidate. It does not establish native execution, live integration, semantic validation, acceptance, sanction, a release, or finding closure.

F-03: **OPEN / MUST PRESERVE**. F-04: **OPEN / MUST PRESERVE**. F-05: **OPEN / MUST PRESERVE**, bounded by F-03.

## Exact authority and chronology

| Subject | Identity |
| --- | --- |
| Repository / branch | 0xHoneyJar/loa-aleph / agent/f03-production-reachability-implementation-20260917 |
| Starting C-02 commit / tree | ad8be4e9a88339530317e12e573b0299b15bef3a / d0972ca50451f2542686d5b51e5f40e1436fe62c |
| Canonical GitHub main / tree | 8236b9f35c38cdd604b2389b42589f27755cdade / 72075f93bc9fcb3c76f4480bc612693211efd240 |
| Adopted design commit / tree | 484fa227e1ed23c81dc4cf37987aa0be16eded8f / 13ad9e53a77949718afa9dc59c25c2e9d52beacb |
| Original implementation authority | 4a999689a21b08f4d7c333e3b28362d47476d02f |
| C-01 clarification | 2cf9d884232107ff98268844ec3e8146f95a9a93 |
| C-01 reconciliation | e2cbc0b06f38a36ddd4cad30e069d857e63aac5e |
| Separate C-02 clarification commit / tree | 248aad3871c323aafec96f2664f26b60e6f0f062 / ee7c9b9caf98ad069bebe0b3c2256153af00761d |
| C-02 clarification blob / SHA-256 / bytes | f0dce703ae9791bd8285f3ed2d539e59c4c41c97 / e6987f6143e823cda0cb5a3211c109cca9bdd5ea8af464b0b61447900802db35 / 8550 |
| Partial implementation commit / tree | bb866b23e8662d7ed515d1ed1d07e01383933321 / 5b9cf3bc2208dd261cab89b77baa445e5a70d995 |
| C-01 historical stop blob / SHA-256 | 893bcc16f1dde9793b7a367ad4d4c5cba96930bb / 4f052dc4648fc963bd62b129cad47a19c25f2a2e7c1bb531dc65df31f27d562a |
| C-02 historical stop blob / SHA-256 | 1bf02d7de3cf458358e7fdefead8267f33580ee9 / b3aef9f0f7c8a514095fb191e041ec07a6bd15d894d0cd7ee6ac34859edb5c84 |

The continuation gate verified exact clean local/remote implementation HEAD and tree, canonical remote main, both historical stop records, the C-01 records, the paused preparation branch, adapter branch, stash, and all worktree registrations before editing. Work continued in `/tmp/loa-aleph-f03-implementation-20260917`; the primary worktree was not an implementation target. No checkpoint was amended, rebased, reset, or discarded.

Chronology: adopted design → original implementation authority → partial implementation → C-01 → first stop → HUMAN C-01 clarification → C-01 reconciliation → C-02 → second stop → HUMAN C-02 clarification → separate clarification-only commit → C-02 reconciliation and further S2/controller work → C-03 reproduced → implementation stopped. No record has been rewritten to imply earlier knowledge of either clarification. Neither historical stop was modified.

The C-02 declaration was persisted verbatim before implementation. Its declaration block is 5,560 bytes (excluding the enclosing separator LF), SHA-256 `509c5a8802e2513b6b7308ec9ffc20f6deca18d9efe3b5b40ef7cff72609ee30`.

## C-03 — a legal paused checkpoint has no authorized event-status continuation

The conflict is specifically a durable pause between same-position primary events. It is not a claim that uninterrupted sibling capture or journal recovery of one complete transaction is impossible.

T3.2 requires a cursor to name the next **unprocessed** event. A pause after ordinal 1 stays at the shared byte position and names ordinal 2. The adopted F-03 design requires retaining the worker cursor reason and testing shared-position siblings. K2.14 additionally requires the named next event to exist. At a blocked shared frontier, earlier events must be committed and the named/later events must not already be committed.

A minimal legal snapshot therefore contains one admitted primary interval, two exact packet/event bindings at the same position, event 1 `committed`, event 2 `pending`, and the last cursor naming ordinal 2. K2.14 passes that snapshot. K2.14 also passes the advanced snapshot in which event 2 becomes `committed` and a new terminal cursor is appended, with the current completion projection advanced but still blocked pending L1.

The step between those snapshots replaces the retained event row's status. HUMAN C-02 expressly authorizes replacement only of the current completion row:

> This replacement is a narrowly scoped current-projection operation. It does not authorize rewriting or deleting historical primary walk intervals, extraction events, resume cursors, or fresh gap-review rows. Those retained records remain the durable source-walk history.

The implemented C-02 Core guard consequently rejects the transition with `WORK_SOURCE_COMPLETION events history must remain an exact ordered prefix`. Removing this guard or excluding event status from it without new authority would contradict the controlling declaration. Reclassifying the event table as a current projection would be a new Core policy decision, not a mechanical serializer choice.

| Discriminator | Observed result |
| --- | --- |
| Two-candidate extractor value, exact source binding, bounded-pause cursor | `validateSemanticReturn`: PASS / binding checked; this is Core shape/reference validation, **not** adapter acceptance or a branded/native return |
| Last cursor names ordinal 2; EVT-0701 committed, EVT-0702 pending | K2.14 PASS |
| EVT-0702 committed; terminal cursor appended; completion current row advanced | K2.14 PASS as a standalone snapshot |
| Derive transition between those snapshots under C-02 history preservation | FAIL: event history is not an exact ordered prefix |
| Commit both events while retaining the paused cursor | FAIL: cursor names ordinal 2 pending while EVT-0702 is already committed |
| Advance the cursor while leaving EVT-0702 pending | FAIL: cursor jumps over pending EVT-0702 |
| Append a second committed event for the same packet/ordinal | FAIL: duplicate packet event, duplicate ordinal, and old pending event remains |
| Omit the not-yet-processed event | FAIL: next ordinal does not identify an existing pending event (and its already declared packet lacks an event) |

The reproduction is intentionally confined to Core snapshot and return-contract checks. It does not claim that the partially implemented controller already constructs or accepts this paused run, or that a helper call proves F-03 production reachability. Its purpose is to prove that even with a legal before-state and legal after-state, the controlling transition policy has no authorized connecting operation.

No checker predicate was weakened, no pending event was silently relabeled, no cursor reason was changed to avoid the pause, and no duplicate-row exception or event replacement facility was implemented. The prototype capture path still assigns `committed` to primary events; it therefore cannot claim this required bounded-pause behavior.

## Exact evidence and smallest human decision

Run the retained structural discriminator:

```bash
node adapters/loa/tests/test-f03-shared-position-continuation-conflict.ts
node adapters/loa/tests/test-f03-shared-position-continuation-conflict.ts --json
```

Eight discriminator assertions pass **because the Core conflict is reproduced**, not because it is repaired. Two independent executions produced byte-identical JSON; both hashes are retained in the machine evidence. The machine-readable stop evidence retains the complete output, raw synthetic return, source identities, test receipts, and failure chronology:

`EVIDENCE-f03-c03-stopped-checkpoint-20260917.json`.

| Contract / discriminator | Blob | SHA-256 |
| --- | --- | --- |
| scripts/lib/checks-k2.ts | fc2e5eb23aa719cb6a05da17dca7322fb545e7b0 | 23369afafd113f0012af4f321ef70dedd694ed883252d296f3edc7c9a4a7fcf3 |
| scripts/lib/source-walk-transition.ts | 7f54fb369d8f55fad3764b9ecab43eabc471f5d0 | e6ec0ae9bb3805e5888e08e7c8beae8b9ebdfda1648a7582a2cb2954ec0a1028 |
| scripts/lib/work-transitions.ts | d8d43ae71be9bf39175f5a592cb9f5dd8c51c0fd | 9560b0426918d72915a03314daeb02a300b089cefe18286596c8c8bd664c377a |
| scripts/lib/semantic-review.ts | c99c006cfad69a0024afedc24f78bb9f455aa930 | c4bc7699256e4a82b6c302d1e9a8a5c73eff508b317e99e30a2dc527c7f2c928 |
| docs/architecture/templates/03-extraction-claims.md | 3c793f8c7771ec60a1cb18f8bc7ef75b2cee4499 | 9673226ef32038aee79e754fd737f8e2205905ecb740ca744dca465b197cd01b |
| adapters/loa/tests/test-f03-shared-position-continuation-conflict.ts | 898a11721e2e96adf5bd29cc70f535d824b238c8 | 1703d80e446c2cca64202f06e77eb5f64e6e021089451442d5a8a6e4fe4b03cd |

**One HUMAN Core question:** For cumulative `1.9.0-provisional` with `orchestrator-work-transitions`, what lifecycle is authorized for an existing pending extraction event? May only its status advance `pending → committed` with every other field fixed and its exact old row retained in authenticated transaction evidence, or must Core instead adopt an append-only successor representation? The current C-02 authority permits neither replacement of that event row nor reinterpretation of K2.14's unique event/packet/ordinal rules. No answer is inferred here.

Any future clarification must bind the precise allowed state transition, historical custody, recovery/idempotency, and predecessor-format boundary. It must not silently change old pinned 1.2–1.8 runs, weaken worker isolation, let a model author after-images, or turn a pending event into committed work merely to advance a cursor.

## What this continuation retained

- A separate HUMAN C-02 administration commit, including only the clarification record and required administration inventory entry.
- `source-walk-transition.ts`: a 1.9-only, fixed-path completion projection. It mechanically derives exact old/new rows, legal progression, before/after digests and prerequisite hashes; only completion rows can be replaced. Other source-walk row sets remain exact ordered prefixes. K2.14 remains unchanged.
- C-02 representation-plan integration and exact reopening of the extractor's old sealed completion-row context after a legal replacement. The adapter separately reauthenticates the original retained transport evidence against its original validation basis. The Core context helper is not an authentication shortcut.
- S2 entry, initial completion/cursor preparation, packet/walk-only capture, exact evidence/USE/candidate binding derivation, and in-progress semantic scheduling. Additional L1 subject/result, separate gap-producer, gap reconciliation and S2-seal code was drafted before C-03. These paths are **partial and incompletely verified**, not new completed stage claims.
- Stronger reconstruction of durable call/dependency tuples, single-writer orchestration locking, fixture-only abrupt-exit hooks, and new-format refusal at generic semantic/material/duplicate writer entrypoints. Full bypass/locking/recovery coverage remains unfinished.
- Generated runtime projection, manifests, focused regressions, an exact 25-contract identity set, the cumulative M23 expectation repair, and D8-P09's explicit refusal assertion.

The C-01 dedicated degraded-packet contract remains present: original `packet-candidate:<index>` binding, exact source/locator/reason/criterion, complete ordered MaterialUseInput, CANNOT_DETERMINE atomicity, no fictitious PKT/CC, and one subject for the original selector. `material-only` remains reserved for actual material candidates. The C-01 suite includes single-OBJ and multi-OBJ positives and mutation refusals; this continuation does not redefine that rule.

Default/current repository and adapter run format remain **1.8.0-provisional**. **1.9.0-provisional** is cumulative, capability-gated and implementation-only. Protocol remains **1.0.0-provisional**. No release, installation-default promotion or retained-run migration was performed.

## Stage and product-path status at the stop

| Surface | Strongest justified status |
| --- | --- |
| S0 | Retained exact authority/freeze path and fixture structural evidence; human authority remains separate |
| S1 | Installed start/resume, retained criteria proposal, authenticated fixture intake, two fresh fixture criteria reviews, writer commits and S2 entry exercised |
| S2 | C-02 completion projection, installed walk recovery, and one exact-packet/fresh fixture L2S/admission path pass; full candidate/material/gap/seal composition remains partial; C-03 blocks required paused sibling continuation |
| S3 | Full controller normalization, admission, lineage, review/material composition and exit are unfinished |
| S4 | Full duplicate/relation/ambiguity/human-gate composition, seals and legal S5 entry are unfinished |
| S5+ | No adopted later work family is implemented; generic frontier halt remains. No claim of a complete Aleph pipeline |
| Work controller / reauthentication | Installed fixture-supported S0/S1, S2 walk and one exact-packet/L2S path, durable evidence reopening and consumption pass; full S0–S4 controller DoD is not met |
| Writer ingress | New-format legacy semantic/material/duplicate entrypoints reject; comprehensive stage/authority/late-correction bypass audit and tests remain due |
| Recovery / exactly once | Bounded C-02 abrupt-exit matrix and repeated resume demonstrated without duplicate walk effects; not a claim for every writer family or provider billing |
| Installed command/skill | Installed launcher is used in the new process test; skill/command integration is still unfinished and the unsupported natural-language writer join has not been replaced |
| Retained executable routing | Existing launcher selects verified run-local runtime; current and predecessor structural tests are retained below. Full new-controller compatibility proof remains incomplete |
| F-05 | No closure; supported-surface late-correction/lineage refusal coverage remains unfinished, independently bounded by F-03 |
| F-04 | No closure; Linux checks do not establish case/path/platform portability |

## Tests, failures and evidence limits

All transport used here was explicitly fixture-simulated. Static/manual fixture records and direct Core checks are not live semantic evidence. Existing writer/process suites still exercise helpers and cannot be relabeled as production reachability.

The frozen implementation source at `bb866b23e8662d7ed515d1ed1d07e01383933321` was checked with **30 suite commands: 30 exited zero, 0 exited nonzero**. Reported case counts are per suite; overlapping source/runtime cases are not added into a misleading grand total. C-03's expected negative results reproduce a stop, not a repair.

| Command | Exit | Reported scope |
| --- | --- | --- |
| node scripts/validate-core-boundary.ts --json | 0 | 10 checks; PASS |
| npm run runtime:check | 0 | See exact retained output |
| npm run typecheck | 0 | See exact retained output |
| node adapters/loa/tests/test-f03-source-walk-transition-conflict.ts | 0 | See exact retained output |
| node scripts/test-worker-return-contract.ts | 0 | 14 reported PASS/ok lines |
| node adapters/loa/tests/test-f03-shared-position-continuation-conflict.ts | 0 | 1 reported PASS/ok lines |
| node adapters/loa/tests/test-f03-source-walk-completion.ts | 0 | 30 reported PASS/ok lines |
| node adapters/loa/tests/test-f03-degraded-binding-conflict.ts | 0 | 27/27 reported cases |
| node scripts/test-lineage-mutations.ts | 0 | 34 reported PASS/ok lines |
| node scripts/test-relation-mutations.ts | 0 | 74 reported PASS/ok lines |
| node scripts/test-internal-ambiguity-contracts.ts | 0 | 12 reported PASS/ok lines |
| node scripts/test-internal-ambiguity-mutations.ts | 0 | 123 reported PASS/ok lines |
| node scripts/test-representation-mutations.ts | 0 | 71 reported PASS/ok lines |
| node scripts/test-core-boundary-mutations.ts | 0 | 12 reported PASS/ok lines |
| node scripts/validate-precis-fixtures.ts | 0 | See exact retained output |
| node scripts/test-conformance-mutations.ts | 0 | 128 reported PASS/ok lines |
| node scripts/test-semantic-review-mutations.ts | 0 | 62 reported PASS/ok lines |
| node scripts/test-semantic-review-contracts.ts | 0 | 64 reported PASS/ok lines |
| node adapters/loa/tests/test-representation-process.ts | 0 | 20 reported PASS/ok lines |
| node adapters/loa/tests/test-semantic-review-process.ts | 0 | 33 reported PASS/ok lines |
| node adapters/loa/tests/test-loa-adapter.ts | 0 | 34 reported PASS/ok lines |
| node packaging/test-runtime-js.ts | 0 | 6 reported PASS/ok lines |
| node adapters/loa/tests/test-semantic-review-process.ts --runtime | 0 | 33 reported PASS/ok lines |
| node adapters/loa/tests/test-slice5-process.ts | 0 | 76 reported PASS/ok lines |
| node scripts/test-bundle-assembly.ts | 0 | 31 reported PASS/ok lines |
| node packaging/test-loa-release-packaging.ts | 0 | 23 reported PASS/ok lines |
| node adapters/loa/tests/test-loa-installer.ts | 0 | 17 reported PASS/ok lines |
| F03_FAULT_MATRIX=1 F03_KEEP_TEST=1 node adapters/loa/tests/test-orchestration-process.ts | 0 | 11 reported PASS/ok lines |
| F03_PACKET=1 F03_KEEP_TEST=1 node adapters/loa/tests/test-orchestration-process.ts | 0 | 3 reported PASS/ok lines |
| node scripts/test-duplicate-review-parity.ts | 0 | 4 reported records; PASS; exact case counts retained |

D8-P01 genuine native invocation remains NOT RUN by authority. The earlier standalone D8 process run passed 19 permitted records and 5 mutations, with 44 operation recovery boundaries and 4 closure boundaries; native execution was not run. The full new-controller S0–S4 authentication/replay/mutation matrix is not complete, even where predecessor/helper suites pass.

| Retained attempt | Log SHA-256 | Chronology |
| --- | --- | --- |
| typecheck-s2-semantic-initial | 1042ba9289dd0a78e789a60335aa9f60cf4c28c6981c999e658e4e7b5f8051c3 | Unknown-to-WorkerJsonValue type error in captured raw reopening; cast repaired before stop. |
| c02-core-initial | 78d9d7bb8da8f98825a813dbce1d4616fac5775252e66c26e1e6a15c908f66a7 | Fixture marked an indeterminate gap open instead of the existing required blocked state; fixture corrected, checker unchanged. |
| c02-core-capture | 707d47c6e7ddecaafdd5571e05eff50ca446da32bc0b2c2295017b01fbbff160 | Control metadata used numeric ordinals with the number-free work serializer; metadata changed to decimal strings, raw worker indexes unchanged. |
| s2-controller-initial | 8ca7d67e85ebfaa2357362bd11bf69e07ad81860fa27e5a8afa02e2ccd95a17c | Core model omits control files; exact producer-context recipe lookup failed. Narrow recipe reopening was added before stop. |
| s2-semantic-installed-initial | 15c256aaf1e5b487aa6a09cf1c13e75d7c2669199034f1ae5ff8dd8d63de468e | Fixture terminal cursor referenced an event ending before the trailing newline; optional predecessor reference corrected before C-03. Failed run kept immutable. |

An initial runtime-compiler subprocess attempt was blocked by sandbox `EPERM`; the unchanged runtime build passed in the permitted execution context. The blocked attempt is retained in the execution transcript, not represented here as a source defect or a fabricated standalone log. The successful runtime build output is retained separately.

The earlier successful installed C-02 matrix retained nine abrupt-exit points: derived, commit intent, writer prepared, source-walk bytes written, all canonical bytes written, chain written, checkpoint written, journal committed, and consumption written. It reopens the exact prior row from the work-bound basis blob and verifies repeated resume adds no duplicate effect. The retained machine evidence binds that run's actual pinned bundle and transaction. It is an intermediate fixture snapshot, not a claim that all later draft source paths were covered by that execution.

At the stopped source snapshot, the installed packet test also passed exact packet capture, original-producer reauthentication, fresh fixture L2S review and Core admission. The installed recovery test passed the nine crash points plus before-row retention and repeated resume. The machine evidence retains each actual run identity, work journal inventory, accepted-record hashes, chain/checkpoint state and consumption inventory. These bounded cases do not prove multi-candidate, degraded/material composition, L1 gap resolution, stage closure, or S3/S4.

No implementation repair was performed after C-03 was confirmed. Subsequent activity was evidence retention, projection generation, read-only/deterministic verification, administration, and normal checkpoint commits/push. Later verification failures, if any, remain visible rather than being suppressed to obtain a producer-complete label.

## Identities, inventory and preservation

The pre-commit administration entries pass CB1–CB10 and `git diff --check`. Core, checker, adapter and runtime payload bytes remain the tested stopped-source bytes. The pre-commit inventory snapshot changes the prospective Loa lock/bundle identity: lock projection `sha256:7b90af5ee63b010b4683dea3d403865b4f9d8a94b6c4fc3640705919e7b2786b`; bundle `sha256:094f6f4461b30e57ae7894a85f7518b0c48f8e4940b27affe50e57c842c78b32`. These calculations bind the pre-commit worktree provenance; a subsequent commit can change provenance and therefore the lock/bundle identity again. They are not a prepared or published release. The installed test receipts retain their actual earlier fixture bundle identities; they are not relabeled as executions of this administration snapshot.

| Payload / check | Identity |
| --- | --- |
| Core | sha256:0c19ead3317b47e0fb65dad6e4c756c303e8395cf4892a462bf5c95e3df16633 |
| Checker | sha256:b43b34251a8bb99c1e5d40cd8595316a4b53f8f43829a70c9dc92d7edf08aa1f |
| Loa adapter | sha256:0c56f982e9cae51c0146826a47ff66d6e11ced19f03c82590167d3905f981552 |
| Generated runtime Git tree | 0b29959f0d8993c75fa05e6ee8a72db3b61341ce |
| Generated runtime file count | 45 |
| Runtime inventory JSON SHA-256 | c6ab9fdb4dd903970e5000149c637960ef9960cce6b1605ff3ab8540a3dc3389 |
| Runtime inventory algorithm | sha256 over UTF-8 compact sort_keys JSON of ordered path/sha256/bytes entries; exact entries retained |

The continuation changed the following implementation/clarification paths from the starting C-02 checkpoint. Exact blobs, SHA-256 and byte counts are retained in the machine evidence. The administration commit additionally contains this stop record, its evidence JSON, and their required inventory entries.

| Changed path | Blob |
| --- | --- |
| adapters/loa/adapter.manifest.json | 537731b650e471d7b68ecac62df1638591ba6cdf |
| adapters/loa/src/ledger-writer.ts | 73f84a27fd2a3fba2efc12a6e6921ab0c9ecf063 |
| adapters/loa/src/orchestration.ts | abd7b6386c6bccabfe4b81db93287a59a9cbccaf |
| adapters/loa/tests/test-duplicate-review-process.ts | 8a26a38ef7fd2114dc5c6751de62ade7c827bef9 |
| adapters/loa/tests/test-f03-shared-position-continuation-conflict.ts | 898a11721e2e96adf5bd29cc70f535d824b238c8 |
| adapters/loa/tests/test-f03-source-walk-completion.ts | 295693403f9b5fb9ee8be9bfd6cff4572dba1992 |
| adapters/loa/tests/test-f03-source-walk-transition-conflict.ts | 9a8cfe935704d9479b8337fd320bbb0908c1997a |
| adapters/loa/tests/test-orchestration-process.ts | 31f559ff803fe596adc1a6ed434cc2c59b1bc8e1 |
| calibration/src-001/core-design-basis/ADOPTED-f03-source-walk-completion-current-state-clarification-20260917.md | f0dce703ae9791bd8285f3ed2d539e59c4c41c97 |
| core.manifest.json | f123932dc1afd1acfce8d231287da4e00961e38c |
| docs/architecture/templates/03-extraction-claims.md | 3c793f8c7771ec60a1cb18f8bc7ef75b2cee4499 |
| runtime-js/adapters/loa/src/ledger-writer.js | 1f6b2c78265a94e8f3d3950621e9f13d5fd6987b |
| runtime-js/adapters/loa/src/orchestration.js | 6fe9f1bf3ba9a516b7b30051e8de4973a76db57e |
| runtime-js/scripts/lib/run-model.js | 33e9214cadf65783c50d910c00a7774c4ad2b167 |
| runtime-js/scripts/lib/semantic-review.js | c21ed5d3e4a3fca9ad57b0e2ad1d76f99a82240a |
| runtime-js/scripts/lib/source-representation.js | 495a86c2d5dcc76145dbbfa65eea69bd0a2051ac |
| runtime-js/scripts/lib/source-walk-transition.js | 887130396aaa0f3e5d6f6eacbeac3e81547c859e |
| runtime-js/scripts/lib/work-transitions.js | 7c169197acdc7e576dbbcb8752ea541a465a9a5f |
| scripts/lib/run-model.ts | 478233c3d3ba697cc01a18a1cd229fefd7da0800 |
| scripts/lib/semantic-review.ts | c99c006cfad69a0024afedc24f78bb9f455aa930 |
| scripts/lib/source-representation.ts | 0258d7c856c06fd36a984e2c442b6d998258e607 |
| scripts/lib/source-walk-transition.ts | 7f54fb369d8f55fad3764b9ecab43eabc471f5d0 |
| scripts/lib/work-transitions.ts | d8d43ae71be9bf39175f5a592cb9f5dd8c51c0fd |
| scripts/test-semantic-review-mutations.ts | f5c2b5527dce6d7947c40385e741778f6cd79326 |
| scripts/test-worker-return-contract.ts | 7da9717642f91d06097321056388167abd53bc6f |

Preservation checks passed for the primary worktree status, tracked index, working/cached diffs, every other Git ref, and all worktree registrations. Preserved preparation branch: `a568f499db6707e4787ee3da969dbd6193b04944`; adapter branch: `b9e2db742a087b8ae659ec39e476ed5e240cfa1f`; stash: `e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8`. Prunable registrations were retained, not pruned. GitHub main was rechecked at the exact canonical commit before publication. A normal branch push is authorized; no PR or merge is part of this checkpoint.

## Remaining obligations and exclusions

C-02 turning green does not discharge earlier unfinished work. After an exact HUMAN C-03 decision, implementation must still finish all adopted S0–S4 obligations: bounded walk and sibling progression, finite exact/degraded/material/SEM candidate accounting; L1 reconciliation and source/S2 closure; S3 normalization/review/admission/no-claim/lineage and seal; S4 discovery/comparison/fresh refutation/successor/material/semantic/typed-relation/ambiguity/human-gate composition and C1/C2/C3; strict durable formats and effect bindings; authenticated historical dependencies; all ingress bypass refusals and shared locks; unknown-dispatch halts; partial assembly/acceptance recovery; complete journal/chain/checkpoint/consumption reconciliation; all mutation/replay/fault tests; installed skill/controller loop; exact retained-runtime routing and predecessor compatibility; and F-05's real controller refusal path. All full-frontier product-surface tests remain required. No item disappears because a focused regression passes.

Every prohibited-operation counter remains **0**: provider/model calls; genuine native workers; live-corpus runs; SRC-001 preparation/replay; closed-reference access/comparison; release preparation/publication; Loa ingestion; PR creation; merge; sanction; acceptance; finding closures; v1 declaration. Temporary synthetic installer/package tests are structural checks only. Governance files under `calibration/src-001/core-design-basis/` are registered solely as repository administration, not SRC-001 execution state.

Strongest status: **PARTIAL IMPLEMENTATION RETAINED / STOPPED — C-03 HUMAN CORE DECISION REQUIRED**. No final producer-complete implementation reconciliation has been created at `docs/architecture/22-f03-production-reachability-implementation-reconciliation.md`.

A fresh independent review may examine this exact stopped checkpoint, the C-03 discriminator, and the C-02 implementation range from `ad8be4e9a88339530317e12e573b0299b15bef3a` through the administration commit containing this record. It must not use that review as F-03/F-04/F-05 closure or as a full S0–S4 implementation acceptance subject.

F-03 PRODUCTION REACHABILITY IMPLEMENTATION STOPPED — NEW HUMAN CORE DECISION REQUIRED

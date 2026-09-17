# F-03 continuation stopped — C-04 indeterminate claim-candidate binding

Date: 2026-09-17

Status: **IMPLEMENTATION_STOPPED_CORE_CONTRACT_CONFLICT — C-04**.

This is a stopped partial implementation and repository-administration record. It is not the final S0–S4 implementation reconciliation, a producer-complete candidate, native/live evidence, semantic validation, acceptance, sanction, or a release.

F-03: **OPEN / MUST PRESERVE**. F-04: **OPEN / MUST PRESERVE**. F-05: **OPEN / MUST PRESERVE**, bounded by F-03.

## Authority, exact subject, and preserved chronology

| Subject | Commit / tree |
| --- | --- |
| Repository / branch | `0xHoneyJar/loa-aleph` / `agent/f03-production-reachability-implementation-20260917` |
| Required starting C-03 checkpoint | `eb31b3a67fbb450cd7666e2b437c3ccf190f543f` / `eec174936bd346cedff1b33c4959ab2fc0bdebb1` |
| Canonical GitHub main | `8236b9f35c38cdd604b2389b42589f27755cdade` / `72075f93bc9fcb3c76f4480bc612693211efd240` |
| Adopted design | `484fa227e1ed23c81dc4cf37987aa0be16eded8f` / `13ad9e53a77949718afa9dc59c25c2e9d52beacb` |
| Original adoption / implementation authority | `4a999689a21b08f4d7c333e3b28362d47476d02f` |
| Initial C-01 stop | `5e17212cedbb47fa1cc27a0f5f11d941f9d7850e` |
| C-01 clarification | `2cf9d884232107ff98268844ec3e8146f95a9a93` |
| C-01 reconciliation | `e2cbc0b06f38a36ddd4cad30e069d857e63aac5e` |
| C-02 stop | `ad8be4e9a88339530317e12e573b0299b15bef3a` / `d0972ca50451f2542686d5b51e5f40e1436fe62c` |
| C-02 clarification | `248aad3871c323aafec96f2664f26b60e6f0f062` / `ee7c9b9caf98ad069bebe0b3c2256153af00761d` |
| Post-C-02 partial implementation | `bb866b23e8662d7ed515d1ed1d07e01383933321` / `5b9cf3bc2208dd261cab89b77baa445e5a70d995` |
| Separate C-03 clarification administration commit | `fd02c316189656611fc1ea6b51789998cf2a319e` / `aa466bea836fe4e288018f967cfbc5234e83e6e3` |
| Focused C-03 implementation commit | `986d71a655e673307f08fb8a1a48cee1d3937b4c` / `9162a4bed1a9eba38dc6099a9124029f728be11c` |
| Stopped partial S3 implementation and C-04 discriminator | `6de0bc5c17d203d0949cb3f51dcbe07a2dd06f7a` / `c57cf24d0eb791bafea0e277b10edafdd420bc91` |
| Final administration checkpoint | The commit containing this record and `EVIDENCE-f03-c04-stopped-checkpoint-20260917.json`; its exact commit/tree are reported separately to avoid a self-referential Git identity. |

The first gate verified exact clean local branch/HEAD/tree, matching GitHub implementation ref, canonical main commit/tree, all three prior stop records, C-01/C-02 clarifications and ancestor checkpoints. Work resumed in `/tmp/loa-aleph-f03-implementation-20260917`. The primary checkout, paused SRC-001 branch, adapter branch, stash, and existing worktree registrations were not implementation targets. No historical checkpoint was amended, squashed, rebased, reset, or deleted.

Chronology remains: adopted design → implementation authority → partial implementation → C-01 stop → HUMAN C-01 clarification/reconciliation → C-02 stop → HUMAN C-02 clarification → partial implementation → C-03 stop → HUMAN C-03 clarification → separate administration commit → C-03 implementation and focused verification → partial S3 derivation → C-04 discriminator → implementation stop. No earlier record was rewritten to imply that a later rule was already known.

The HUMAN C-03 declaration was persisted verbatim before any implementation edit at:

`calibration/src-001/core-design-basis/ADOPTED-f03-pending-extraction-event-commitment-clarification-20260917.md`

Its blob is `4d8187dfb2475a2ab4641bfa6918b07945ff8484`; SHA-256 `ccc6b247b645c8bac359f841c0073c86843502d60c2934cba447a88f96f73f1e`; size **10,152 bytes**. The declaration block including its trailing LF is 6,065 bytes, SHA-256 `dbd50ce6222280bbdc722b0b48af24c0b520003d99082e703cc004e50648f002`. That commit contains only the declaration record and required repository-administration inventory registration. It does not create an authority response inside a run.

### Unchanged historical records

| Record | Blob | SHA-256 / bytes |
| --- | --- | --- |
| STOPPED-f03-production-reachability-implementation-core-contract-conflict-20260917.md | 893bcc16f1dde9793b7a367ad4d4c5cba96930bb | 4f052dc4648fc963bd62b129cad47a19c25f2a2e7c1bb531dc65df31f27d562a / 15918 |
| STOPPED-f03-production-reachability-implementation-source-walk-transition-conflict-20260917.md | 1bf02d7de3cf458358e7fdefead8267f33580ee9 | b3aef9f0f7c8a514095fb191e041ec07a6bd15d894d0cd7ee6ac34859edb5c84 / 24015 |
| STOPPED-f03-production-reachability-implementation-shared-position-event-continuation-conflict-20260917.md | 321692735b31b33e5d343848d171041260065c88 | 11e34ce1f2e1484913a8dafa37e07226edaa8f9014c8f611eeac91f1ee39600b / 27677 |
| PROPOSED-f03-accepted-worker-return-production-reachability-design-20260917.md | b5fd008ff2aab18cb632c248cb8259735d053714 | 6144bef6f06ee55e8507d7019c13658b0404a0bafe3f8aebe09f6a18a80f1524 / 94757 |
| ADOPTED-f03-production-reachability-design-20260917.md | 465af089f8f23b28b2a4339047c76a8a4d143c34 | 1ea635dc2bc0d5693bac339f39bb00e0b797bab8b95e1228d142d1db484d4195 / 2005 |
| AUTHORIZED-f03-production-reachability-implementation-20260917.md | df61a2f4f240bc812ebbc1a1e6196da7d92345b9 | a1d3e6246c1eef9c8a001b3a43a41e1d40e77dbeb3b21ae1859948e687641ef5 / 6229 |
| ADOPTED-f03-degraded-packet-l2s-binding-clarification-20260917.md | 7c6c665af3988f588d637a7dc8b6d162819d7ab8 | 01d50b0795c029f1cced0e5d81cc988e4f3a55d240da78a542d0ad18f0c14222 / 6797 |
| ADOPTED-f03-source-walk-completion-current-state-clarification-20260917.md | f0dce703ae9791bd8285f3ed2d539e59c4c41c97 | e6987f6143e823cda0cb5a3211c109cca9bdd5ea8af464b0b61447900802db35 / 8550 |


## C-04 — an indeterminate claim selector passes return validation but has no legal retained L2S material binding

The discriminator uses an existing exact PKT and its upheld S2 semantic origin. The normalizer emits one original `claim-candidate:0`, with:

- an existing packet basis and exact source anchor;
- `review_mode=proposal`;
- `atomicity=CANNOT_DETERMINE`, no semantic units or affirmative proposition;
- an explicit material-unavailable finding;
- a complete well-formed `MaterialUseInput` with `use_state=CANNOT_DETERMINE`, existing OBJ requirements, a reason and limitations;
- no `material_findings` output that could be confused with this original claim selector.

The tentative `normalized_claim` string remains only in the raw candidate/reservation data. No canonical CC is created by the discriminator. One-OBJ and two-OBJ variants reproduce the same boundary; the complete ordered declaration is retained.

The conflict is between existing contracts, not a request to weaken canonical-use checks:

| Surface | Exact current behavior |
| --- | --- |
| T3.7 §7, `templates/03-extraction-claims.md` | Every applicable producer output, including degraded candidates, receives exactly one original-selector semantic entry and exhaustive L2S. Raw producer bytes remain immutable. |
| T3.7 output binding / `validateProducerSelection` | An original claim candidate selects `kind=claim`, including its reserved CC ID, normalized candidate, packets, sources and claim type. `material-only` is for an actual material candidate. |
| T3.6 §11.3 / `source-representation.ts::validateMaterialUseInput` | The well-formed absent-feature declaration is indeterminate; features cannot be synthesized. Material-only nonaffirmative receipts are OBJ candidates; canonical CC/REL uses require usable material. |
| `validateMaterialProducerReturn` and context-bound `validateSemanticReturn('normalizer', ...)` | The discriminator passes both, including original packet/origin/source bounds, with `binding=checked`. This is Core validation, not adapter/native acceptance. |
| `canonicalClaimModel` + `semanticMaterialViews` | Constructing the required preview for the claim reservation invokes `validateRepresentationUse(..., review=false)`. That still rejects `subject_kind=CC` with `use_state=CANNOT_DETERMINE`. |
| Omitting the material view | `buildSemanticSubject` refuses: `exact applicable material views required`. |

The exact material refusal is:

```text
USE_CLOSURE USE-0702 field use_state: CANNOT_DETERMINE candidates require OBJ receipts, not canonical packets/claims/relations
```

The exception arises before a retained L2S claim subject can be constructed. It is not the later, correct rule that indeterminate material cannot license a canonical affirmative claim. The current code applies that canonical-use predicate to the material preview of the unadmitted reservation as well.

An ordinary usable-claim control passes subject construction with the same fixture machinery. Both **1.8 and 1.9** reproduce the indeterminate mismatch. The predecessor result identifies an inherited contract boundary; it does not authorize changing or migrating old runs.

The following responses would each choose policy not adopted in C-01–C-03:

- recast the original claim selector as a singular OBJ/material candidate;
- synthesize a material candidate for each requirement or choose one preferred OBJ;
- drop the required L2S subject because the return was indeterminate;
- change the declaration to usable or permit a canonical CC USE for an unusable declaration;
- add a new retained nonaffirmative claim binding without a governing contract;
- change the currently passing producer contract to reject this class before acceptance without resolving the exhaustive candidate-accounting rule.

C-01 authorizes a dedicated degraded **packet** binding only. It does not answer the claim-candidate question. C-02 and C-03 govern source-walk projection/event lifecycle and do not answer it either. The producer selected none of these responses and stopped.

### Exact discriminator and evidence scope

```bash
node adapters/loa/tests/test-f03-indeterminate-claim-binding-conflict.ts
node adapters/loa/tests/test-f03-indeterminate-claim-binding-conflict.ts --runtime
```

The battery has **28 assertions per projection**: usable controls; well-formed material declarations; checked original claim selectors; required material-view refusal for one/two OBJ variants; refusal to omit the view; and unchanged raw/canonical state. Its passing exit means **EXPECTED_CONTRACT_CONFLICT reproduced**, not repaired implementation.

The machine evidence retains complete initial output, raw synthetic candidate bytes, source/runtime discriminator results, hashes, test receipts and repair chronology. The discriminator constructs static fixture context. It does **not** establish that a supported `/loa-aleph` run reached C-04 after native or fixture adapter acceptance. The unfinished S3 product route is not substituted for that missing evidence.

| Contract / discriminator at stopped source | Blob | SHA-256 |
| --- | --- | --- |
| scripts/lib/source-representation.ts | 0258d7c856c06fd36a984e2c442b6d998258e607 | 48144a0f4cd0e28bf9da389e04ab4f04fb85b128e6f24ee43fa2ef67223692d0 |
| scripts/lib/semantic-review.ts | 67111ce4364644b6dd1ebb322c88d679762e6e61 | 40545015a94cd6e260f7c792648e7e8e0b50fefe37e4575cdec5db8e759725a1 |
| scripts/lib/work-transitions.ts | a76c121fdc098e94a8b42ab8a8bf24725ede75fe | c570b57cc1955faabd0e79e02d6016e0ff8a6861ad98e5d614f87846a6ed536c |
| scripts/lib/checks-k2.ts | fc2e5eb23aa719cb6a05da17dca7322fb545e7b0 | 23369afafd113f0012af4f321ef70dedd694ed883252d296f3edc7c9a4a7fcf3 |
| docs/architecture/templates/03-extraction-claims.md | 205ddbd14b5b476e5fd467cbe5ac938dcb540c31 | e29f515836d58fb2bc7486fef324ab42716807ca14be32c727eff62ff2c5ad49 |
| docs/architecture/prompts/README.md | 428011904773bd0d33c7f788b0a1e30b23d6f303 | 71ba8011e37e4085313b38d88c9ae2c6c9aef391a89854a642e7cda99ffd6427 |
| docs/architecture/prompts/workers-intake-extraction.md | 0ba1cb8afc3580d7573987f3890b0fa9ef33cf3c | 4c65afcc1aa9ce8e1951a76a41acd562d72287ff72b7de842ea7ad0566fa5b37 |
| adapters/loa/tests/test-f03-indeterminate-claim-binding-conflict.ts | ab496ac4f0c7e9c04549fec81a6e9e074a1c8c76 | 9a6ed34557424db3d080d1fc6df7aeccfc2d783e729b1cb77be07919769d4641 |


### One exact HUMAN Core question

For new cumulative `1.9.0-provisional` runs using `orchestrator-work-transitions`, what is the authorized treatment of an original `claim-candidate:<index>` whose complete well-formed `material_use` is `CANNOT_DETERMINE` and whose current context-bound producer validation passes: must it be rejected before acceptance as an illegal producer candidate, or must it retain its original identity and receive a specifically defined nonaffirmative L2S output/material binding?

If retention is required, the clarification must define the original selector/producer identity, the role (if any) of the reserved CC identifier, complete ordered material requirements, retained tentative text and source/packet/origin context, and the distinction between a review preview and canonical CC/USE admission. If rejection is required, it must specify the producer-validation and exhaustive-accounting consequence. No singular-OBJ substitution, synthetic material outputs, semantic inference, historical migration, or silent discard is assumed. This is one binding/lifecycle decision, not implementation authorization for S5+.

## What C-03 implemented

`source-walk-transition.ts::derivePendingEventCommitment` accepts an existing event ID in an eligible 1.9 orchestration run. It mechanically reopens K2.14 prerequisites and the current cursor. The transition changes only the final `pending` status cell of that exact raw row to `committed`. All nine identity fields and their existing cell bytes remain fixed.

The source-walk plan now retains `event_commitments:[{event_id,before_row,after_row}]` in the same authenticated plan that includes file digests, prerequisites and the C-02 completion projection. `validateSourceWalkCompletionWrite` rederives the permitted event/cursor after-image; a caller-supplied alternate row or cursor is not an ingress.

The Core controller registers `s2.commit-event` before another extractor batch or semantic-accounting step. Its exact original producer call is an authenticated historical dependency. The existing Architecture-B writer reopens that dependency and reconstructs the work/plan before journaling. Its validation basis retains the full prior source-walk bytes, so the exact pending row can be reopened without an ad hoc event-history file.

After one sibling commits, the next pending sibling remains at the shared byte position with the next ordinal. The final sibling allows only the legal Core cursor progression. Repeated committed observation is an exact no-op. There is no event successor, new event ID, new ordinal to encode commitment, or general mutable-event operation. Pending/committed deletion, changed non-status fields, reverse transition, changed committed rows and duplicate ordinals fail.

The template documents this exception explicitly. K2.14 implementation bytes remain unchanged:

`scripts/lib/checks-k2.ts` blob `fc2e5eb23aa719cb6a05da17dca7322fb545e7b0`, SHA-256 `23369afafd113f0012af4f321ef70dedd694ed883252d296f3edc7c9a4a7fcf3`.

The former eight-case C-03 discriminator is now a clarified regression. Its original source remains at the historical C-03 checkpoint (blob `898a11721e2e96adf5bd29cc70f535d824b238c8`), and the original conflicting observations remain unchanged in the C-03 stop/evidence records.

The focused lifecycle suite passes **40/40 source and 40/40 runtime**, with byte-identical output. The clarified historical discriminator passes **8/8**.

The installed process suite passes on the immutable disposable snapshot `6cc85ec846429bade147c3369bb0a5699c9576d5` / tree `cbeab8a81904b520b588e3712eae250cbe95a6ab`, built from C-03 implementation `986d71a` plus the later exact refusal assertion/closure probe. Test SHA-256: `08cc55c2086b2bf9b18b8f39cf15683a732b8125a80a0fe80eed469f79d3453b`. This snapshot is not the later S3 partial source.

All nine injected interruptions pass: derived; commit intent; writer prepared; source-walk effect; all canonical bytes; chain; checkpoint; journal committed; consumed. The same supported installed CLI then commits the remaining sibling, proves exactly two event-commit journals for the original two pending events, reopens each exact pending before-row from its work-bound basis blob, refuses an altered third state with the exact prerequisite error, and repeats resume without another chain effect. Original accepted fixture producer bytes remain unchanged.

The machine evidence includes both exact retained event transaction/work/basis/consumption sets, final source-walk/chain/checkpoint bytes, and the third-state refusal. No provider execution or billing guarantee follows.

The separate one-packet fixture run on that same immutable C-03 source also passes: supported CLI S0/S1 → S2 packet capture → fresh fixture L2S → fresh fixture L1 → complete current source projection → S2 semantic seal → S3 entry. This proves that bounded case, not all S2 output families or the later S3 draft.

## Partial S3 work retained at the stop

Before C-04 was confirmed, the producer drafted deterministic S3 packet/origin preparation, normalizer capture metadata, immutable candidate/CC reservations, common semantic scheduling for S2/S3, claim/no-claim admission derivation, and S3 seal selection. `canonicalClaimModel` and `useRowFromSubject` were exported without changing their existing predicates. Generated runtime was regenerated from this stopped source.

This draft is **not complete or qualified**. The following implementation defects/unfinished branches are visible and are not new Core policy questions:

- The draft places empty claim-inventory initialization in the S2 semantic seal effect set; the existing semantic seal allowlist excludes that file. This needs a separately registered/composed stage-entry preparation under the already adopted architecture, not a widened generic semantic writer.
- The draft common resolution selector still applies affirmative `semanticAdmissionProblems` to an upheld no-claim proposal. No-claim has a separate existing legal outcome and needs the corresponding mechanical branch.
- Required S3 L2F preparation/acceptance/composition is not implemented in the controller.
- Relation/ambiguity context derivation is still empty in the draft reservation path. Valid proposals cannot be claimed supported.
- Widening, structural lineage outcomes, revision/unresolved successor work and complete finite origin/candidate consumption remain unfinished.
- S4 work families and composite C1/C2/C3 are not implemented in this controller.

After confirming C-04, no generic Core or adapter repair was continued. The stopped source, these unfinished paths, its generated projection and test evidence are retained rather than called producer-complete or silently discarded.

The separate supported-CLI S2 closure probe on exact stopped source `6de0bc5c17d203d0949cb3f51dcbe07a2dd06f7a` exited **1**. Its full output is retained in the machine evidence (`stopped-s2-closure-process.log`). It is a retained failing process test, not a passing implementation result. The observed refusal includes `SEM_WINDOW`; the draft S3-entry scaffold exceeds the existing semantic-seal write window. No Core allowlist was widened to hide this unfinished composition.

## Supported frontier and remaining obligations

| Area | Strongest justified status at this stop |
| --- | --- |
| S0 | Existing exact human freeze/recovery path retained; fixture-only CLI evidence. No model-created human authority. |
| S1 | Fixture CLI intake, two separate criteria reviews and S2 entry exercised. No semantic validation or human sanction. |
| S2 | Partial controller for walk/packet capture, C-01 subjects, C-02 completion, C-03 lifecycle and L2S/L1 work. Full S2 closure is not producer-complete. |
| S3 | Partial source retained; C-04 blocks the original indeterminate-claim subject contract. Usable/no-claim/material/lineage/L2F/relation/revision paths are not comprehensively implemented or proven. |
| S4 | Full duplicate/overlap/merge/L3/L5/successor/L2F/relation/ambiguity/human-gate/C1–C3 controller remains unfinished. Existing direct-writer tests do not establish this reachability. |
| S5+ | No controller support is claimed. Current unregistered-stage behavior remains explicit `WORK_FRONTIER_UNIMPLEMENTED`; no S4→S5 success or S5–S13 execution is claimed. |
| Durable work controller | Architecture-B work, basis, exact call/dependency binding, acceptance evidence, intent, journal and consumption exist. Full adopted work-family coverage is unfinished. |
| Process reauthentication | Existing fixture checks reopen retained evidence and reconstruct the in-process brand. Persisted acceptance JSON alone is not authorization. Full adversarial lifecycle matrix remains unfinished. |
| Writer ingress | `commitOrchestrationWork(workId)` is the new-format ingress; generic semantic/material/duplicate methods retain new-format refusal. Comprehensive bypass coverage, all authority paths and all writer families remain incomplete. |
| Recovery / exactly once | Only the named fixture paths/fault points below are evidence. No general exactly-once claim and no exactly-once provider billing claim. |
| Runtime routing | Existing launcher verifies the installed bootstrap, original lock/snapshot and exact retained CLI before mutable work. Complete old/current cross-install adversarial routing qualification remains unfinished. |
| Installed skill / command | Command remains `/loa-aleph`; full structured controller-loop conversion is unfinished. The installed skill still contains the unsupported “may be given” writer join and manual artifact language. No production UX completion is claimed. |
| F-05 | Existing lineage/refusal tests remain structural. The required supported-controller late-correction refusal path and live/audit evidence remain unfinished; F-05 stays OPEN. |
| F-04 | No portability repair or claim; Linux tests do not resolve platform/path/case portability. |

No prior unfinished obligation was removed: all S2 source/walk/exact/degraded/event/cursor/gap/reconciliation/completion/SEM/USE/L2F/ambiguity/seal accounting; all S3 normalization/candidate/review/admission/lineage/relation/ambiguity/seal work; and all S4 duplicate/merge/overlap/contradiction/refutation/successor/relation/ambiguity/authority/C1–C3 work still require their full adopted implementation and supported-control-surface tests.

Controller completion also still requires comprehensive immutable acceptance, closed schemas, exact work tuple/contract and historical dependency bindings, legacy bypass refusal, shared mutation locking, dispatch-unknown halts, partial assembly recovery, chain/consumption reconciliation, every interruption point, taint/freshness preservation, predecessor compatibility, installation/runtime routing and operator skill integration. No manually called helper closes those obligations.

## Test results and retained failure chronology

**34/34** stopped-source suite commands exited zero; the additional stopped-source S2 closure process exited **1**. The two immutable C-03 process probes passed on their separately named earlier source. Initial failed attempts are not included as passing commands.

| Check command at `6de0bc5` | Exit | Seconds | Evidence log |
| --- | --- | --- | --- |
| node scripts/validate-core-boundary.ts --json | 0 | 0.505 | stopped-boundary.log |
| npm run runtime:check | 0 | 0.897 | stopped-runtime-check.log |
| npm run typecheck | 0 | 1.295 | stopped-typecheck.log |
| node adapters/loa/tests/test-f03-shared-position-continuation-conflict.ts | 0 | 1.154 | stopped-c03.log |
| node adapters/loa/tests/test-f03-source-walk-transition-conflict.ts | 0 | 2.725 | stopped-c02-predecessor.log |
| node scripts/test-lineage-mutations.ts | 0 | 1.023 | stopped-lineage.log |
| node scripts/test-worker-return-contract.ts | 0 | 4.329 | stopped-worker-contracts.log |
| node scripts/test-internal-ambiguity-contracts.ts | 0 | 0.154 | stopped-ambiguity-contracts.log |
| node adapters/loa/tests/test-f03-source-walk-completion.ts | 0 | 4.202 | stopped-c02.log |
| node scripts/test-relation-mutations.ts | 0 | 2.134 | stopped-relations.log |
| node scripts/test-internal-ambiguity-mutations.ts | 0 | 6.676 | stopped-ambiguity-mutations.log |
| node scripts/validate-precis-fixtures.ts | 0 | 2.709 | stopped-fixtures.log |
| node adapters/loa/tests/test-f03-degraded-binding-conflict.ts | 0 | 13.652 | stopped-c01.log |
| node scripts/test-core-boundary-mutations.ts | 0 | 22.736 | stopped-core-mutations.log |
| node scripts/test-representation-mutations.ts | 0 | 37.712 | stopped-representation.log |
| node scripts/test-conformance-mutations.ts | 0 | 52.487 | stopped-conformance.log |
| node scripts/test-semantic-review-mutations.ts | 0 | 85.223 | stopped-semantic-mutations.log |
| node adapters/loa/tests/test-representation-process.ts | 0 | 61.988 | stopped-representation-process.log |
| node packaging/test-runtime-js.ts | 0 | 1.802 | stopped-runtime.log |
| node scripts/test-semantic-review-contracts.ts | 0 | 82.623 | stopped-semantic-contracts.log |
| node adapters/loa/tests/test-slice5-process.ts | 0 | 117.184 | stopped-slice5-process.log |
| node adapters/loa/tests/test-semantic-review-process.ts | 0 | 178.379 | stopped-semantic-process.log |
| node adapters/loa/tests/test-semantic-review-process.ts --runtime | 0 | 175.445 | stopped-semantic-runtime-process.log |
| node packaging/test-loa-release-packaging.ts | 0 | 79.679 | stopped-package-structural.log |
| node scripts/test-bundle-assembly.ts | 0 | 98.576 | stopped-bundles.log |
| node adapters/loa/tests/test-f03-pending-event-commitment.ts | 0 | 2.566 | stopped-c03-lifecycle.log |
| node adapters/loa/tests/test-f03-pending-event-commitment.ts --runtime | 0 | 2.868 | stopped-c03-runtime.log |
| node adapters/loa/tests/test-f03-indeterminate-claim-binding-conflict.ts | 0 | 4.521 | stopped-c04.log |
| node adapters/loa/tests/test-f03-indeterminate-claim-binding-conflict.ts --runtime | 0 | 2.09 | stopped-c04-runtime.log |
| node adapters/loa/tests/test-claude-code-host.ts | 0 | 0.741 | stopped-host-fixtures.log |
| git diff --check | 0 | 0.015 | stopped-whitespace.log |
| node adapters/loa/tests/test-loa-adapter.ts | 0 | 242.382 | stopped-adapter.log |
| node adapters/loa/tests/test-loa-installer.ts | 0 | 211.02 | stopped-installer.log |
| node scripts/test-duplicate-review-parity.ts | 0 | 1673.245 | stopped-duplicate-parity.log |

Named suite totals: CB1–CB10; runtime projection 45 files and runtime battery 6/6; worker return 14/14 checks against the exact 25-contract identity set; C-01 27/27; C-02 30/30; clarified C-03 discriminator 8/8; C-03 lifecycle 40/40 per source/runtime; C-04 conflict discriminator 28/28 per source/runtime; representation 71/71 and representation process 20/20; semantic contracts 64/64, mutations 62/62, process 33/33 per source/runtime; lineage 34/34; relations 74/74 (64 mutations); ambiguity contracts 12/12 and mutations 123/123 (106 mutations); Slice 5 process 76/76; conformance 117/117 plus 11/11 clean baselines; Core boundary mutation battery 12/12; host fixtures 24/24; adapter fixtures 34/34; bundle battery 31 cases; disposable package battery 23/23; installer 17/17. Duplicate parity: 18 contract, 28 fixture, 44 mutation and 20 process case records per source/runtime; the process report contains 19 PASS and one explicitly NOT RUN native case, D8-P01. The exact source/runtime reports are embedded in `duplicate-parity-retained-reports.json` within the machine evidence; no NOT RUN case is counted as a pass.

These are heterogeneous structural checks and nested parity repetitions, not one additive semantic-validation score. Direct writer tests remain helper/process coverage and are not relabeled as new-format product reachability. C-03's 40-case stdout is byte-identical between projections; C-04's stable `checks/evidence` projection is identical across source/runtime and a repeated source run (SHA-256 `07b1aba89735ce8559f8cd92d50d4fb041a66f7c1ae578c2221a91611ccb3831`). Temporary scratch paths and the runtime-mode label were excluded from that C-04 comparison and no other fields were ignored.


Earlier failures remain inspectable:

1. The initial C-03 installed process reached two fault points, then its tamper assertion expected `WORK_EFFECT_CHANGED`. The actual fail-closed error was the earlier `WORK_PREREQUISITE_CHANGED: ledgers/source-walk.md`. The assertion was narrowed to that exact authenticated refusal. No successful bypass was accepted.
2. Two background process attempts were interrupted by an intermediate S3 TypeScript parse error because the fixture-child test entry imported current working-checkout modules before reaching the pinned dispatcher. The syntax error was repaired before C-04 was found. The original failed output is retained. Subsequent C-03/S2 verification used an immutable disposable snapshot of `986d71a` plus the exact test assertion/closure probe, so ongoing edits could not change those test imports.
3. Initial runtime build/parity attempts under the sandbox returned `spawnSync ... node EPERM`. Unchanged permitted-context runs passed. Exact initial tool/error receipts remain retained.
4. The initial C-01 rerun had 26 passing cases and a fresh-process JSON parse failure (`Unexpected end of JSON input`). The unchanged permitted-context rerun passed 27/27. The precise environmental cause was not established; no test or predicate was weakened.
5. The stopped partial S3 source contains the stage-entry/seal and no-claim issues identified above. These are not concealed by the green focused C-03 or C-04 discriminator counts.

6. A final administration inventory attempt through a sandboxed child returned exit zero with empty stdout. That is retained as unusable verification evidence, not a pass. The unchanged permitted-context check returned the full CB1–CB10 PASS report with unchanged Core, checker and adapter payload digests.

The previous M23 cumulative-version repair, D8-P09 explicit FAIL/no-validated-return refusal assertion, and exact 25-worker-contract identity set are preserved. Those test repairs establish only the named structural API behavior.

## Identities, compatibility and changed paths

Repository/default/current format remains **1.8.0-provisional**. **1.9.0-provisional** remains cumulative and implementation-gated by **orchestrator-work-transitions**. Adapter protocol remains **1.0.0-provisional**. No release or old-run migration was prepared. Tests that construct synthetic predecessor/new-format bundles do not change installed/default semantics or an existing retained run.

| Identity | Digest |
| --- | --- |
| Core payload | sha256:72b781f5151c7bb5125b73a9a198a845c3ba53897e5491fad70d20b5872afd84 |
| Checker payload | sha256:3bcf8c6ddd241bbfeb3240f80243ed0467727fb40e0a43d674ac2e33151c706c |
| Loa adapter payload | sha256:ec889122abf4ba56a0538a41c026dba0eb9431c9dcfdd887b5fe48bedf267ee6 |
| Generated runtime (45 paths relative to runtime-js) | sha256:049173ed538cee636cd709d0a2e335b009a87160dd437d5c58f886ab7e0ae4a2 |
| Loa complete payload, before lock/commit projection | sha256:4f4693863875ae14a041da2a1aac20079ad929f625139269dece7899046f21fb |


Payload identities are source identities, not immutable distribution releases. The final administration commit changes the Git subject/manifest inventory; Core, checker, adapter payload and generated runtime bytes remain those of the stopped implementation checkpoint. Whole bundle lock/commit projections are reported separately in the machine receipt and must not be confused with an installed run's pinned bundle.

| Path changed in `eb31b3a..6de0bc5` | Blob at stopped source | SHA-256 / bytes |
| --- | --- | --- |
| adapters/loa/adapter.manifest.json | 09970b808416ab5e556feadd79c5d6aaf61d4065 | 8f0797054ca352213c475afe040532c1c6045deba82292fa212c77504b41e376 / 10963 |
| adapters/loa/tests/test-f03-indeterminate-claim-binding-conflict.ts | ab496ac4f0c7e9c04549fec81a6e9e074a1c8c76 | 9a6ed34557424db3d080d1fc6df7aeccfc2d783e729b1cb77be07919769d4641 / 8305 |
| adapters/loa/tests/test-f03-pending-event-commitment.ts | bd7a5845cdff180e82199e61566da87736f37e9f | 8d50f1b7ad5af068fd66170534628cf1f55f2f23c7b1c6012fd6a834e01cfb9b / 8874 |
| adapters/loa/tests/test-f03-shared-position-continuation-conflict.ts | a36d2be189648191e60dc706db693eddd5af16a2 | 3b038d7af8c23ab03924fe67a74520571c56ce1964b4c39dbca39381c6e95e19 / 6066 |
| adapters/loa/tests/test-orchestration-process.ts | 7c07793558bc911226eda76f487daf1219076300 | 08cc55c2086b2bf9b18b8f39cf15683a732b8125a80a0fe80eed469f79d3453b / 22230 |
| calibration/src-001/core-design-basis/ADOPTED-f03-pending-extraction-event-commitment-clarification-20260917.md | 4d8187dfb2475a2ab4641bfa6918b07945ff8484 | ccc6b247b645c8bac359f841c0073c86843502d60c2934cba447a88f96f73f1e / 10152 |
| core.manifest.json | a1e8bff25be7fb186dc395e3501bc20ce5d1914e | 523a484b76afb787dcbe60b5ba685323b49ad7adda0b1eae1e4210952491c318 / 82111 |
| docs/architecture/templates/03-extraction-claims.md | 205ddbd14b5b476e5fd467cbe5ac938dcb540c31 | e29f515836d58fb2bc7486fef324ab42716807ca14be32c727eff62ff2c5ad49 / 105861 |
| runtime-js/scripts/lib/semantic-review.js | 16700ae78c58543cded966126bf9bd9eb35cbd94 | 2df3a0513d6face8a564509a8a33b854839d513e2a871dcf6d9e41f38e77723c / 222163 |
| runtime-js/scripts/lib/source-walk-transition.js | 8cc163aaf39fda709b83ed9af70a44c2463b2a4c | 5f56e06722759abf63867e3a82d0ec04f1f4fed45d364009ba18b09f40d683ac / 17072 |
| runtime-js/scripts/lib/work-transitions.js | 40d91ed7407a0f5a10ea75639d51f6a904f6ed81 | 242fa0e0b97dc822421875c81dc27920d5f445b508ef044e0f17bec135c02df7 / 102198 |
| scripts/lib/semantic-review.ts | 67111ce4364644b6dd1ebb322c88d679762e6e61 | 40545015a94cd6e260f7c792648e7e8e0b50fefe37e4575cdec5db8e759725a1 / 230277 |
| scripts/lib/source-walk-transition.ts | 95e668f9660437fb4ca720903c09ecda4cc525ea | df8805b47f1a74d557ab617225721c6e0a03a58fbb7aaecf98922a16a654777c / 17518 |
| scripts/lib/work-transitions.ts | a76c121fdc098e94a8b42ab8a8bf24725ede75fe | c570b57cc1955faabd0e79e02d6016e0ff8a6861ad98e5d614f87846a6ed536c / 106381 |

The final administration checkpoint additionally adds this stop record and `EVIDENCE-f03-c04-stopped-checkpoint-20260917.json`, and registers both only under `repository_administration` in `core.manifest.json`. It changes no generic Core, adapter or generated-runtime bytes.


## Preservation, counters and fresh review subject

The stopped-source preservation receipt passes: exact historical stop/design/adoption/authority/clarification blobs and hashes; unchanged primary branch/HEAD/index/diff/status; unchanged other refs and stash; and unchanged registered worktrees except the authorized implementation HEAD. The paused preparation branch and `agent/loa-adapter-release` remain preserved. The implementation worktree was clean at `6de0bc5`; final administration changes and normal push are checked separately.

The repository's local `main` ref was intentionally not updated to match GitHub; the controlling canonical identity is the freshly checked GitHub `main` commit/tree. No checkout, fetch/reset, stash manipulation, worktree prune or modification of the primary checkout was used.

| Prohibited operation | Count in this continuation |
| --- | --- |
| Provider calls | 0 |
| Model calls | 0 |
| Genuine native workers | 0 |
| Live research-corpus execution | 0 |
| SRC-001 preparation/replay operations | 0 |
| SRC-001 replay/run attempt creation | 0 |
| Closed-reference access/comparison | 0 |
| Release preparation | 0 |
| Release publication | 0 |
| Ingestion into `0xHoneyJar/loa` | 0 |
| PR creation | 0 |
| Merge | 0 |
| Agent-mode sanction | 0 |
| Governance / semantic acceptance | 0 |
| F-03/F-04/F-05 closure | 0 / 0 / 0 |
| v1 declaration | 0 |

Fixture-simulated worker/authority records, the fixture transport's `accept` operation, and disposable installer/package tests were exercised only as expressly permitted structural tests. They are not native workers, live corpus runs, human authority, governance/semantic acceptance, SRC-001 attempts or release preparation. GitHub operations were repository identity reads and the authorized normal branch push, with no PR, merge, release dispatch or ingestion.

Proposed fresh independent review subject: the exact final administration commit containing this record, with implementation changes in `eb31b3a67fbb450cd7666e2b437c3ccf190f543f..6de0bc5c17d203d0949cb3f51dcbe07a2dd06f7a`, the unchanged adopted design/authority and C-01/C-02/C-03 records, this C-04 discriminator/stop evidence, and the unchanged three historical stops. Review the C-03 lifecycle and its bounded recovery evidence, confirm the C-04 contract mismatch/decision boundary, and retain all unfinished product obligations. This is **not** a producer-complete implementation acceptance, live-evidence or finding-closure audit subject. No independent audit was performed by this producer.

Strongest justified status: **IMPLEMENTATION_STOPPED_CORE_CONTRACT_CONFLICT — C-04**. C-03-focused evidence does not discharge the complete F-03 S0–S4 DoD. F-03, F-04 and F-05 remain OPEN / MUST PRESERVE.

F-03 PRODUCTION REACHABILITY IMPLEMENTATION STOPPED — NEW HUMAN CORE DECISION REQUIRED

Machine evidence SHA-256: `54b7092fd8c8621b2ecec19bbe4d207d61bbeafefd0f8f393a38a33882f2329a`; byte count: 1153117.

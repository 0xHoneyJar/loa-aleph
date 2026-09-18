# F-03 continuation stopped — C-05 post-S2 packet widening

Date: 2026-09-18

Status: **IMPLEMENTATION_STOPPED_CORE_CONTRACT_CONFLICT — C-05**.

The continuation reconstructed the retained worktree, passed the exact first gate, persisted the HUMAN C-04 declaration separately, and implemented a focused C-04 binding plus a partial S2/S3 continuation. A new conflict prevents completing the already-required S3 packet-widening work family after S2 closure. Generic implementation stopped; no widening policy was inferred.

This record is a stopped checkpoint, not the final F-03 implementation reconciliation or a producer-complete candidate. All evidence here is static or fixture-simulated. F-03 and F-04 remain **OPEN / MUST PRESERVE**. F-05 remains **OPEN / MUST PRESERVE**, bounded by F-03.

## Exact authority and checkpoint chronology

| Subject | Identity |
| --- | --- |
| Repository | `0xHoneyJar/loa-aleph` |
| Implementation branch | `agent/f03-production-reachability-implementation-20260917` |
| Reconstructed registered worktree | `/tmp/loa-aleph-f03-implementation-20260917` |
| Required starting C-04 commit | `a34f769023a2310f72cb4b709cbfde3ff975a994` |
| Required starting C-04 tree | `a1833f152e342f9be6e47b5614eb8c3a42a622fe` |
| Canonical GitHub main | `8236b9f35c38cdd604b2389b42589f27755cdade` |
| Canonical main tree | `72075f93bc9fcb3c76f4480bc612693211efd240` |
| Adopted F-03 design | `484fa227e1ed23c81dc4cf37987aa0be16eded8f` |
| Adopted design tree | `13ad9e53a77949718afa9dc59c25c2e9d52beacb` |
| Original adoption / implementation authority | `4a999689a21b08f4d7c333e3b28362d47476d02f` |
| C-01 stop | `5e17212cedbb47fa1cc27a0f5f11d941f9d7850e` |
| C-01 HUMAN clarification | `2cf9d884232107ff98268844ec3e8146f95a9a93` |
| C-01 reconciliation | `e2cbc0b06f38a36ddd4cad30e069d857e63aac5e` |
| C-02 stop | `ad8be4e9a88339530317e12e573b0299b15bef3a` |
| C-02 HUMAN clarification | `248aad3871c323aafec96f2664f26b60e6f0f062` |
| Post-C-02 partial implementation | `bb866b23e8662d7ed515d1ed1d07e01383933321` |
| C-03 stop | `eb31b3a67fbb450cd7666e2b437c3ccf190f543f` |
| C-03 HUMAN clarification administration | `fd02c316189656611fc1ea6b51789998cf2a319e` |
| C-03 implementation | `986d71a655e673307f08fb8a1a48cee1d3937b4c` |
| Stopped partial S3 / original C-04 discriminator | `6de0bc5c17d203d0949cb3f51dcbe07a2dd06f7a` |
| Final historical C-04 stop | `a34f769023a2310f72cb4b709cbfde3ff975a994` |
| New C-04 HUMAN clarification administration | `512c5098ed8c03afb921af1ee37add66ab6f0c22` |
| New C-04 clarification tree | `0a8acfe194beebabfdaefefe04d9f44e6479baaf` |
| Partial implementation after clarification | `4823ee25d25d08e4f7018b99d73eaef77e19848f` |
| Partial implementation tree | `c6bd3c16e005cb55a168455c54ea4340ebd69d4b` |
| Final stopped administration checkpoint | The separate commit containing this record, its evidence JSON and their manifest registrations. Its exact HEAD/tree are reported separately to avoid a self-referential Git identity. |

The implementation range after the separate clarification is exactly `512c5098ed8c03afb921af1ee37add66ab6f0c22..4823ee25d25d08e4f7018b99d73eaef77e19848f`: one partial implementation commit. The later administration commit contains no implementation changes.

The controlling authority remains the original adopted design as clarified by C-01, C-02, C-03 and C-04. The original authority explicitly permits normal isolated development commits and pushes for an auditable candidate. It does not permit PR creation, merge, release work, finding closure, or inferring a new Core rule. All earlier stops and declarations remain historical records with their original meanings and bytes.

## Reconstruction and preservation

The existing Git registration was authoritative. Its worktree-local HEAD named the exact implementation branch; the retained index matched the required tree; the target filesystem checkout was missing. The registration was unlocked and marked prunable because its backlink target was absent. No other worktree owned the branch.

The reconstructive operations were:

1. Create the missing exact directory.
2. Run Git-supported `git worktree repair` from the primary repository, without path arguments. Git restored the missing `.git` backlink using the existing registration and reported `repair: .git file broken: /tmp/loa-aleph-f03-implementation-20260917`.
3. Run `git --no-optional-locks -C /tmp/loa-aleph-f03-implementation-20260917 checkout-index --all` from the retained clean index.

No registration was pruned, deleted or replaced. No ref, index or registered administrative file bytes changed during reconstruction. The intended registration remained `.git/worktrees/loa-aleph-f03-implementation-20260917`. Reconstruction ended at the required exact branch, commit and tree with a clean index and checkout. Live GitHub independently confirmed the implementation branch and canonical main commit/tree before the C-04 clarification was written.

All seven original worktree registrations remain present. The six unrelated registrations and their administrative files were rechecked unchanged. After authorized continuation, only the implementation branch has advanced; unrelated refs remain exact. The primary checkout remains clean on `agent/src-001-blind-replay-preparation-20260914`, HEAD `a568f499db6707e4787ee3da969dbd6193b04944`, tree `a72612678f8cbdc4ae2951eb5b26f1b172c71847`. `agent/loa-adapter-release` remains `b9e2db742a087b8ae659ec39e476ed5e240cfa1f`. The one stash remains `e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8`. No SRC-001 preparation or replay operation was performed.

All 15 preexisting F-03 administration records were compared with their original addition commits, the starting checkpoint, current HEAD and filesystem bytes. The evidence JSON retains each path, original commit, Git blob, SHA-256 and size. No historical stop, clarification, reconciliation, adoption or authority file was modified.

## C-04 declaration identity and focused implementation

The declaration was persisted before implementation edits at:

`calibration/src-001/core-design-basis/ADOPTED-f03-indeterminate-claim-nonaffirmative-binding-clarification-20260918.md`

| Identity | Value |
| --- | --- |
| Commit / tree | `512c5098ed8c03afb921af1ee37add66ab6f0c22` / `0a8acfe194beebabfdaefefe04d9f44e6479baaf` |
| Git blob | `0415f33086192103052f175c3fab9125cf483371` |
| File SHA-256 | `4188d2c22e781ff1237cda4f098575696d66dc6a0b5a69b15cfadf93ff00ed02` |
| File size | 22,000 bytes |
| Verbatim HUMAN block SHA-256, including trailing LF | `f619221831320a255972daf6851feb2110d8d28cd9eb4c35f052679b99a33c6b` |
| Verbatim HUMAN block size | 12,895 bytes |

That administration commit contains only the new declaration and its repository-administration manifest entry.

The partial implementation introduces `indeterminate-claim` as a distinct semantic subject/output binding for the authorized 1.9 case. It retains the original `claim-candidate:<index>`, index, reserved CC proposal reference, tentative normalized text, ordered packet basis, mechanically derived source basis, claim type, full semantic declaration, complete ordered material declaration and validated origins. It preserves the producer-binding digest against the original raw return.

The noncanonical preview has a dedicated typed basis. It reopens and validates the complete declared OBJ/BND requirements and limitations, retains their order, reason and fidelity declaration, and binds the deterministic preview to the exact proposal and producer. It never appends a canonical USE or treats the reservation as an admitted/current CC. Ordinary affirmative preview modeling is named `claimProposalModel`; the legacy helper alias remains for compatibility. Nonaffirmative proposal construction leaves the canonical model unchanged.

The existing canonical `validateRepresentationUse` rule was not weakened: `CC + CANNOT_DETERMINE` still fails. The controller distinguishes reviewed selector accounting from affirmative admission and uses the existing `not-admitted` semantic resolution with no admitted references for the C-04 subject. It does not infer claim text, create units from tentative text, or introduce a new resolution disposition.

Focused source and generated-runtime results are **35/35 each**, with equal reports. They cover the required one-OBJ and multiple-OBJ cases, exact original selector and raw bytes, retained proposal-only text/reservation, ordered material requirements, deterministic preview, invalid/missing references, changed/dropped/reordered/first-only requirements, selector substitution, duplicate or omitted subjects, separate material findings, arbitrary after-images, fabricated canonical use, no invented proposition, verdict consequences and predecessor refusals.

The `upheld`, `cannot-determine` and `refuted` cases use actual Core `planSemanticWrite` resolution plans and verify no CC, USE, REL or lineage mutation. A cannot-determine result still requires the existing second fresh review. A reviewer-authored replacement is refused. The ordinary usable claim control retains its affirmative path.

These are Core fixture/transaction-plan proofs. The installed C-04 process path is **not fully verified** at the committed subject. The intermediate installed mixed-candidate run failed after S3 capture as described below. The full C-04 controller/restart/recovery matrix remains unfinished; passing 35 focused cases does not establish producer completion.

The historical C-04 discriminator remains unchanged:

- Path: `adapters/loa/tests/test-f03-indeterminate-claim-binding-conflict.ts`
- Blob: `ab496ac4f0c7e9c04549fec81a6e9e074a1c8c76`
- SHA-256: `9a6ed34557424db3d080d1fc6df7aeccfc2d783e729b1cb77be07919769d4641`
- Size: 8,305 bytes
- Original 28 assertions still execute in source and runtime, reproducing the historical ordinary-binding conflict. The new dedicated binding is tested separately.

The C-04 historical stop itself remains blob `5a107ba93ccd7ae46a483101f24b7a6adc733fac`, SHA-256 `82a0e059b52e5d175c751e720f0e24dee4721d5ca008311ccfecd73f2d722acf`, 37,494 bytes.

## Separate S2 transaction defect: repair and limits

The original failure was reproduced in the supported installed fixture command:

```text
SEM_WINDOW ledgers/claim-inventory.md: outside bounded semantic operation
```

The repair separates two mechanically derived transactions without widening the generic semantic allowlist:

| Operation | Exact effect paths | Next execution |
| --- | --- | --- |
| `stage.seal-S2` | `verification/harness/semantic-stage-seals/S2.json`, `run-log.md` | S2, closed |
| `stage.enter-S3` | `ledgers/claim-inventory.md`, `run-log.md` | S3, entered |

S3 entry initializes an empty claim inventory under its exact registered S3 transaction. It derives no semantic claim content. The post-S2 static fixture deterministically rederives this entry, and already-entered replay is stale. Static source/runtime results are **2/2 each**.

The intermediate installed after-repair snapshot proves the exact two committed transactions, complete source projection, S2 seal, fresh fixture L1 and legal S3 entry. The evidence container retains their journal plans, effects, original bundle lock, run state, chain, work items and consumption evidence. The S2 seal journal does not contain `ledgers/claim-inventory.md`. The S3 entry journal contains only the two listed paths.

The source includes S2/S3 fault-injection test branches, but their complete execution matrix was **not run** before the C-05 stop. Static deterministic rederivation and the successful ordinary process boundary do not prove every crash point. Stage-seal/entry atomic recovery is therefore **partially demonstrated, full matrix outstanding**.

Two installed fixture attempts are retained, with their exact intermediate synthetic source identities:

| Attempt | Synthetic source commit / tree | Observed result |
| --- | --- | --- |
| Before S2 transaction repair | `f3c599bada8748c39a6fb3a98d02818ef34a80ca` / `6900efaef78eeade4b84744d23ce4c62b329f4a8` | S0/S1, exact PKT capture and fresh L2S passed; S2 seal failed on illegal claim-inventory write |
| After split, before later capture-prefix fix | `6df8bb8823d8939a3268b4dfda72eb8669115400` / `8357deda3e113571aeda7139900b8c27bd026948` | S0/S1, exact PKT/L2S, L1, completion projection, S2 seal and S3 entry passed; mixed normalizer continuation failed `WORK_CONTRACT: S2 capture` |

The second failure came from the S2 capture reader also reading the nested S3 capture directory. The committed partial source excludes the S3 prefix. That repair passed typecheck/runtime generation but the complete installed mixed-candidate path was not rerun before the C-05 stop. Both attempted process runs exited 1; their positive checkpoints are reported only at their exact snapshots, never as a fully passing final process test.

Additional partial S3 work derives affirmative L2F reservation/preview work, fresh review acceptance and the existing required-upheld admission check. C-04 reservations are refused from that canonical L2F route. The positive installed L2F path, all negative verdict paths and the complete S3 lifecycle remain unverified. No claim is made that this join completes S3.

## C-05: post-S2 packet widening has no reconciled Core ownership

The existing runbook explicitly requires S3 to widen a packet when surrounding source context is needed to state the claim faithfully. T3.7 likewise requires widening/add-packet before an affirmative claim with unpacketed necessary context can be admitted:

- `docs/architecture/08-runbook-agent-mode.md`, S3 rule beginning “a restatement must be entailed by its packets.”
- `docs/architecture/templates/03-extraction-claims.md`, T3.7 §11, packet splitting/widening as a producer proposal with new exact PKTs and preserved lineage/source-walk history.
- T3.7 §12, unpacketed context requires the existing widen/add-packet procedure.
- T3.7 §15.3, exactly one successful semantic exit/seal per stage, with immutable sealed table prefixes and no generic rewind mechanism.

The synthetic discriminator starts with a valid sealed S2 run. Existing PKTs cover L1 and L3, while L2 is reopenable frozen source text outside the packet basis. A valid S3 normalizer return preserves `claim-candidate:0` and explicitly requests `PKT-0701` widening from L1 to L1–L2. Its required semantic context anchors L2 through a bounded authorized inspection. Core return validation passes with context binding checked.

This is a fixture-declared semantic need, not Core inference that the text actually entails the proposed meaning. The question is how an already-valid producer request can lawfully obtain the required new exact packet and review after S2 has sealed.

| Mechanical probe | Exact observed result |
| --- | --- |
| Original context-bound S3 normalizer return | `PASS`, binding `checked`, original selector retained |
| Build original proposal using only current packet basis | Subject builds; admission reports `required textual content is unpacketed` |
| Select extractor at S3 | `SEM_WINDOW extractor: legal semantic producer stage required` |
| Reopen S2 semantic window | `SEM_WINDOW S2: semantic stage is already sealed` |
| Add a packet output family to normalizer | `SEM_FORMAT normalizer: exact listed keys and order required` |
| Retag extractor return as normalizer | Same closed-return shape refusal |
| Validate new exact PKT material receipt with S3 owner | `USE_CLOSURE USE-0703 field owner_stage: illegal write stage` |
| Mechanically retain new exact PKT plus replacement lineage, preserving S2 seal | `SEM_ACCOUNTING PKT-0703: packet has no semantic group or lineage outcome` |

The last diagnostic after-image contains new exact packet bytes and mechanical replacement provenance in a disposable synthetic copy. It contains no invented semantic declaration. It is not an authorized production transition or a canonical result. A matching S2-owned packet receipt is a positive structural control; changing its owner to S3 fails. The original S2 seal, original semantic ledger and accepted normalizer bytes remain unchanged.

The packet has a new current identity; retaining a predecessor lineage link does not provide its missing reviewed semantic group. Reusing the old group's binding would bind different packet bytes. Core currently restricts the packet producer to S2, requires packet semantic accounting there, and prohibits reopening that sealed stage. Normalizer outputs do not include packet production. Canonical PKT representation-use ownership is likewise pinned to S2.

Consequently, implementing this mandatory work family requires a human decision about post-S2 packet production, fresh semantic review, receipt ownership and sealed-stage/source-walk accounting. A new allowlist, stage reassignment, reinterpretation of an old seal or a synthetic declaration would select a policy not granted by C-01–C-04.

A fail-closed halt safely preserves the request and blocks admission; it does not make the required widening family production-reachable. The conflict must not be hidden by accepting the original claim, inventing no-claim semantics, discarding the request, or counting its inspected context as packet evidence.

### Exact C-05 reproducer and scope

```bash
node adapters/loa/tests/test-f03-s3-packet-widening-conflict.ts
node adapters/loa/tests/test-f03-s3-packet-widening-conflict.ts --runtime
```

Run at partial implementation commit `4823ee25d25d08e4f7018b99d73eaef77e19848f`. Both produce `EXPECTED_CONTRACT_CONFLICT`, **28 assertions**, for synthetic 1.8 and 1.9 runs. Their reports are equal after removing only the `runtime` flag and temporary `scratch` path. The exact raw return digest in each version is `sha256:d639e0e42826b155ef5feec02f706d381551cf98255973445989162459d0ca83`.

The evidence JSON contains both committed-source reports, the complete synthetic fixture bytes in a deterministic compressed container, per-file hashes/sizes, and all relevant failure logs. This is a diagnostic reproduction, not a passing implementation of widening.

The equivalent predecessor-format mismatch is observed evidence only. It does not authorize changing, migrating or reinterpreting any retained 1.7/1.8 run. New 1.9 policy must be separately authorized and gated.

### Human decision required

Define the legal Core producer/semantic-review/material-receipt and stage-seal ownership for a valid S3 request that needs new or widened exact PKTs after S2 has sealed. The decision must reconcile exhaustive packet-selector accounting, new packet provenance and lineage, the existing S2 seal, fresh L2S and any required L2F, material-use owner stage, and source-walk/event history without weakening canonical admission.

No choice among a new bounded S3 packet family, another expressly defined mechanism, or a changed supported frontier is adopted by this record. C-04 remains controlling for nonaffirmative claim accounting; it supplies no packet-widening rule. Implementation remains stopped pending human authority.

## Verification results and retained failures

| Surface | Current stopped-subject result |
| --- | --- |
| TypeScript typecheck | PASS after retained initial failures and fixes |
| Runtime generation | PASS, 45 generated files |
| Runtime parity | PASS, 45 files; C-04 report equality and C-05 source/runtime evidence equality also checked |
| Core boundary | CB1–CB10 PASS |
| Worker contracts | 14/14 battery cases; exact 25-contract identity set retained |
| C-01 | 27/27, including predecessor controls and runtime comparison |
| C-02 | 30/30 Core completion projection cases |
| C-03 | 40/40 source and 40/40 runtime |
| C-04 new binding | 35/35 source and 35/35 runtime |
| Historical C-04 discriminator | Unchanged, 28 source and 28 runtime assertions |
| C-05 discriminator | Expected conflict, 28 source and 28 runtime assertions; repeated at committed HEAD |
| S3 entry static transactions | 2/2 source and 2/2 runtime |
| Semantic review contracts | 64/64 |
| Dedicated semantic mutations | 62/62 |
| Installed orchestration attempts | Both exit 1; bounded positive milestones and distinct failures retained above |
| Full producer-complete deterministic suite | NOT RUN; there is no producer-complete candidate |

The focused batch contains 15 commands, all exiting 0. A separate C-03 runtime command also exits 0. Across the listed ordinary focused suites there are 351 case/projection executions, plus 56 historical C-04 diagnostic assertions, 56 C-05 expected-conflict assertions and 10 boundary checks. These different counters are deliberately not presented as an undifferentiated “full suite passed” total. The dedicated mutation battery is 62 cases; mutation/refusal cases within the other suites are already included in their own totals.

The exact worker identity list is retained in the evidence JSON. The SHA-256 of the UTF-8 identity strings joined with LF and a final LF is `258172551fc5be1b46d1c8e6e14d42e47332ca28ded215d8498fbcde891218eb`.

Load-bearing failed attempts are preserved:

| Failure | Disposition |
| --- | --- |
| Initial C-04 suite: 29 pass / 4 fail | Fixture preparation/assertion issues retained; later corrected suite passed 33, then expanded final suite passed 35 per projection |
| Initial runtime generation: `spawnSync ... EPERM` | Sandbox process restriction; unchanged local compiler command rerun with permitted execution, PASS |
| Initial S2 process setup: `EISDIR` | Test copying encountered the temporary dependency symlink; replaced only that implementation-worktree setup with an ignored dependency directory copied from existing local dependencies |
| Initial S2 static fixture: `WORK_GAP_BASIS` | Fixture lacked authenticated S2 capture basis; retained failure and narrowed separate post-seal S3-entry static test, with supported installed S2 seal verified separately |
| Installed S2 closure: illegal claim-inventory write | Reproduced, split exact S2 seal from S3 entry, positive intermediate installed checkpoint retained |
| Intermediate mixed S3 process: `WORK_CONTRACT: S2 capture` | Nested S3 prefix excluded in committed source; full installed rerun outstanding |
| Initial L2F join typecheck: duplicate import | Corrected duplicate import; repaired typecheck retained |
| Initial C-05 typecheck: nullable reopened bytes | Added explicit fixture reopening assertion; final discriminator has 28 assertions and compiles |
| C-05 semantic/material/stage conflict | UNRESOLVED; stop required, no policy repair applied |

The full verification list requested for a final structural candidate remains outstanding where not explicitly listed PASS above: complete adapter fixtures and process matrix, all source-walk/K2.14 branches through the controller, comprehensive representation/duplicate/lineage/relation/ambiguity/conformance suites, all applicable Slice 5–8 suites, complete writer-bypass and evidence-tampering batteries, installed retained-runtime routing and predecessor command compatibility, installer/disposable-package structural suites, and the F-05 supported-surface refusal test. Historical passes in earlier stop records are not substituted for current complete verification.

## Producer reachability and recovery accounting

| Obligation | Strongest justified status |
| --- | --- |
| S0 | Supported installed synthetic freeze/intake path observed; no live execution |
| S1 | Supported installed synthetic criteria agreement path observed; no human authority impersonation |
| S2 | Exact packet capture, retained producer reauthentication, fresh L2S, L1, completion projection, seal and legal S3 entry observed in one synthetic path; full source/pause/gap/material/ambiguity/selector-family closure not demonstrated |
| S3 | Partial normalization/candidate construction/admission work; focused C-04 accounting passes; full installed path unfinished; mandatory widening blocked by C-05 |
| S4 | Not completed or reached through the supported controller; duplicate/overlap/contradiction, successor lineage, typed relations, ambiguity, gate and seal obligations remain |
| S5+ | No new S5–S13 transition family implemented; legal post-S4 capability-halt frontier not reached or demonstrated |
| Durable controller | Existing Architecture-B cycle exercised for bounded S0/S1/S2 fixture work; complete S0–S4 coverage absent |
| Process-boundary authentication | Positive restart/retained-return reauthentication observed for bounded work; complete changed raw/derivative/stream/dispatch/bundle/stale/replay matrix not rerun or completed |
| Writer ingress / bypass | Existing authenticated writer used by observed process; full 1.9 bypass/refusal matrix outstanding |
| Exactly-once canonical effect | Bounded fixture retry checks verify no duplicate chain effect; no general full-frontier claim |
| Retained runtime routing | Observed fixture uses pinned installed runtime; comprehensive pre-mutation routing and predecessor executable selection proof outstanding |
| Installed skill/command integration | Actual installed `resume` used in the two synthetic attempts; complete structured action and skill behavior across S0–S4 unfinished |
| Predecessor compatibility | Focused C-01/C-03/C-04 and semantic mutation controls pass; complete retained-runtime command compatibility not demonstrated |
| F-05 supported-surface refusal | NOT COMPLETED; F-05 stays open and bounded by F-03 |
| F-04 | Known portability findings retained; no path/case/platform redesign |

The full recovery matrix remains incomplete. The existing tests and partial proofs do not establish exact BEFORE/AFTER/refusal behavior for every listed point:

| Recovery point family | Current evidence / remaining work |
| --- | --- |
| Before / partial / after work seal | Full fault matrix not executed |
| Prepared before dispatch / unknown dispatch | Full fault matrix not executed |
| Return complete before acceptance / partial acceptance | Full fault matrix not executed |
| Accepted before commit | Positive process restart observed; complete tamper/fault cases outstanding |
| Commit intent / writer prepared | Full fault matrix not executed |
| Canonical mutation before chain / chain before checkpoint | Full fault matrix not executed |
| Checkpoint before consumption / consumption before next selection | Ordinary process journals and retries retained; full fault matrix outstanding |
| Stage seal / S2→S3 | Separate exact committed transactions and static rederivation proved; complete injected-crash cases not run |
| C-02 completion replacement | Focused projection tests pass; complete process recovery matrix outstanding |
| C-03 event commitment | 40 source plus 40 runtime cases pass; complete installed process recovery matrix outstanding |
| C-04 review/accounting | Focused Core plans pass; complete installed restart/fault matrix outstanding |

No third silently accepted recovery state is authorized. This stop record reports missing proof rather than asserting a completed recovery guarantee.

## Changed paths and payload identities

The 16 paths in partial implementation commit `4823ee25d25d08e4f7018b99d73eaef77e19848f` are:

```text
adapters/loa/adapter.manifest.json
adapters/loa/src/worker-bundle.ts
adapters/loa/tests/test-f03-indeterminate-claim-binding.ts
adapters/loa/tests/test-f03-s3-packet-widening-conflict.ts
adapters/loa/tests/test-f03-stage-entry.ts
adapters/loa/tests/test-orchestration-process.ts
core.manifest.json
docs/architecture/prompts/workers-intake-extraction.md
docs/architecture/templates/03-extraction-claims.md
runtime-js/adapters/loa/src/worker-bundle.js
runtime-js/scripts/lib/semantic-review.js
runtime-js/scripts/lib/source-representation.js
runtime-js/scripts/lib/work-transitions.js
scripts/lib/semantic-review.ts
scripts/lib/source-representation.ts
scripts/lib/work-transitions.ts
```

The evidence JSON records each committed blob, SHA-256 and size. The total continuation inventory relative to starting C-04 adds the separate clarification record and the two C-05 administration records: **19 distinct paths**, with `core.manifest.json` shared across commits. No prior record was edited.

| Payload / version | Exact value at partial implementation |
| --- | --- |
| Core digest | `sha256:ab9324235ba50b8b8190e1187fd4a7d71f4604ca7a1cbe9ced2266a9f8c94e72` |
| Checker digest | `sha256:d6651df4a502082c7d13f709752efb33b4747a44e37645235becd7f975c2a836` |
| Loa adapter digest | `sha256:61cf1b0822af6c8561e329f49987823be53085180e65506829c2534e91f5ee50` |
| Generated runtime digest, 45 files | `sha256:c7fbde22deac37433be3ea14dca274d672861bb4631d5744b02fb8f6ca8eca6e` |
| Digest algorithm | `sha256-path-file-digest-v1` |
| Repository/default run format | `1.8.0-provisional`, unchanged |
| Implementation format / capability | `1.9.0-provisional` / `orchestrator-work-transitions`, gated and incomplete |
| Adapter protocol | `1.0.0-provisional`, unchanged |

The subsequent stop administration only registers administration paths; Core/checker/adapter/runtime payload bytes remain those of the partial implementation. Final boundary verification is required after this record is committed. No release is assembled or prepared for publication by this checkpoint.

## Durable machine evidence and proposed audit subject

The companion file is:

`calibration/src-001/core-design-basis/EVIDENCE-f03-c05-stopped-checkpoint-20260918.json`

SHA-256 `05c0a48175b843502fea9933164a1d4199095495218078529de954a2dfba930c`; size **7,317,851 bytes**.

It contains reconstruction and preservation observations, all historical record identities, exact clarification identity, partial implementation inventory, committed C-05 source/runtime reports, complete C-05 synthetic fixture bytes, intermediate installed run evidence, all 48 retained logs, exact worker-contract identities, runtime inventory, focused command results and operation counters. Compressed fixture containers are explicitly described as base64 of gzip of a UTF-8 JSON array of `{path,base64}`; per-file hashes/sizes and compressed/uncompressed hashes are included. They contain only synthetic fixtures. Installed executable runtime copies are excluded from those containers; original immutable bundle locks and run pins are retained, and the intermediate synthetic source commit/tree are stated. They do not establish final-subject retained-runtime compatibility.

Proposed fresh independent Claude Opus audit subject: **the stopped partial implementation, not producer completion**. The exact implementation delta is `512c5098ed8c03afb921af1ee37add66ab6f0c22..4823ee25d25d08e4f7018b99d73eaef77e19848f`; include the separate C-04 clarification and this final C-05 administration checkpoint. The full continuation range begins after `a34f769023a2310f72cb4b709cbfde3ff975a994` and ends at the commit containing this record, whose exact SHA/tree are supplied in the final report. Review the unchanged historical C-01–C-04 records as authority/evidence, the C-04 canonical/noncanonical boundary, S2 transaction separation, partial S3 code and unverified joins, the retained failures, and whether C-05 requires a new human decision. No independent audit has been executed or implied.

## Prohibited-operation counters and final state

| Operation | Count |
| --- | ---: |
| Provider calls | 0 |
| Model calls | 0 |
| Genuine native worker execution | 0 |
| Live research-corpus runs | 0 |
| SRC-001 preparation | 0 |
| SRC-001 replay | 0 |
| SRC-001 run/attempt creation | 0 |
| Closed-reference access/comparison | 0 |
| Release preparation | 0 |
| Release publication | 0 |
| Loa ingestion | 0 |
| PR creation | 0 |
| Merge | 0 |
| Agent-mode sanction | 0 |
| Governance acceptance | 0 |
| Semantic acceptance | 0 |
| F-03 closure | 0 |
| F-04 closure | 0 |
| F-05 closure | 0 |
| v1 declaration | 0 |

Strongest justified status: **focused C-04 Core/runtime implementation with stopped partial S2/S3 continuation; C-05 contract conflict reproduced; S0–S4 producer completion not achieved**. Fixture evidence is not native/live evidence. F-03, F-04 and F-05 remain open with all stated boundaries preserved.

F-03 PRODUCTION REACHABILITY IMPLEMENTATION STOPPED — NEW HUMAN CORE DECISION REQUIRED

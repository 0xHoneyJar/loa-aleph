# F-03 C-08 source-reference conflict and stopped handoff

Date: 2026-09-26

Status: STOPPED — NEW HUMAN CORE DECISION REQUIRED — PARTIAL IMPLEMENTATION ONLY

This is a stop/evidence record, not an adopted Core rule, implementation reconciliation, producer-complete declaration, independent audit, finding closure, sanction, release or v1 declaration. Implementation stopped at 2026-09-26T15:26:25Z. Remaining fixture process trees were terminated by 2026-09-26T15:27:46Z. No provider/model calls or genuine native worker execution occurred.

## C-08: exact unresolved decision

The supported intake allocator in `adapters/loa/src/intake.ts` uses three-digit padding and produces `SRC-001` for the first source. Root Core corpus/source contracts use `SRC-NNN`. The adopted Slice 5 proposal uses `SRC-NNNN` in its exact source-locus/search serializations. Retained `parseCandidateRefs` in `scripts/lib/internal-ambiguity.ts` requires `^SRC-\d{4,}$`; retained `validateSourceLocators` in `scripts/lib/checks-k2-ambiguities.ts` requires `^(SRC-\d{4,}):L...`. Thus a valid frozen installed identity cannot be used in these C2 fields.

Precision: intake's explicit exactly-three-digit regex is the *freeze exclusion-ID guard*. This record does not claim that every snapshot source ID is independently grammar-validated as three digits. Ordinary allocation and the two conflicting C2 predicates are mechanically demonstrated.

Core reports `source-locus candidate grammar is invalid` for the exact allocated ID and `WORK_AMBIGUITY_STATE: ... source locator SRC-001:L1-L1 is malformed` at the synthetic material-subject publication boundary. The same synthetic C2 composition with a source constructed as `SRC-0001` passes. `SRC-0001` is not an alias for the installed frozen `SRC-001`.

The HUMAN decision needed is which exact source-reference grammar governs cumulative 1.9 C2 source-locus candidates and material `source_locators`, how it agrees with installed source allocation, and how exact frozen identity and predecessor pins remain preserved. No option is adopted here. We did not pad/rename a frozen source, introduce an alias, omit or replace a producer locator, change the production allocator, or relax either Core predicate.

The first Class C helper failure was initially treated as a fixture-construction mismatch (`SRC-701`). A fixture-only constructor parameter allowed a four-digit control and 38/38 source plus 38/38 runtime helper checks. Inspection of the actual installed allocator then established the wider conflict. That passing helper control is explicitly not installed reachability. The initial failed fixture remains snapshot 07.

## Machine reproduction and limits

`adapters/loa/tests/test-f03-c08-source-reference-discriminator.ts` runs 14 assertions in source and 14 in runtime. These are conflict-discriminator controls, **zero claimed adversarial mutations**. Its disposable probe copies the exact retained Class C test, changes only its fixture source-ID construction input, and makes imports absolute; both exact probe byte streams and output/error streams are retained. This is not a reconstruction or rewrite of the implementation Git history or a migration of a run.

```bash
node adapters/loa/tests/test-f03-c08-source-reference-discriminator.ts
node adapters/loa/tests/test-f03-c08-source-reference-discriminator.ts --runtime
```

The installed pinned intake, internal-ambiguity and K2.17 runtime files are byte-identical to the discriminator runtime files; their hashes are retained in the main evidence.

The optional `--installed-run` argument reads an existing explicitly fixture-simulated run without mutating it. The observed installed run is `RUN-20260926T152338914Z-b12131cb722d`, with source `SRC-001`. It was interrupted at S1; **no installed C2 refusal or installed Class C closure is claimed**. The C2 failure is a separately labeled synthetic Core composition.

## Authority, identity and preservation

Original F-03 adopted design: `484fa227e1ed23c81dc4cf37987aa0be16eded8f`, tree `13ad9e53a77949718afa9dc59c25c2e9d52beacb`. Original implementation authority: `4a999689a21b08f4d7c333e3b28362d47476d02f`, tree `755ab653bf7ef8e2d4186f937f52a098722cc6a8`. The C-07 administration record retains the complete C-01–C-07 authority and stop chronology; all 26 prior historical records and their original pinned blobs remain exact.

Original retained local C-06 start: `0dcb39c6cfde4b875f8f27347739095382bcf7d5`, tree `1dfc57d526c601b5653945a98a3707d1be44f292`. The retained direct-parent continuation `a563ad26ec30dcd1d5356ad060bcc2fc164562fb` → `c9aff09f9a09f864ab7eb781029c98f6ea91e1d0` → `0dcb39c6cfde4b875f8f27347739095382bcf7d5` is preserved. Six lost filesystem checkouts were previously reconstructed without ref/topology changes; none was reconstructed during the C-07 continuation.

C-07 continuation started only after local and remote HEAD both verified `141679591d4b4d4538c9216c18143805d1ecad19`, tree `a924b5b1aa209082480d496449d9abda12598b13`, with a clean implementation index/worktree. Branch: `agent/f03-production-reachability-implementation-20260917`. C-07 authority was persisted verbatim before implementation edits.

Primary checkout remains clean on `agent/src-001-blind-replay-preparation-20260914` at `a568f499db6707e4787ee3da969dbd6193b04944`, tree `a72612678f8cbdc4ae2951eb5b26f1b172c71847`. Release ref remains `b9e2db742a087b8ae659ec39e476ed5e240cfa1f`; the single stash remains `e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8`. All seven registrations retain their names and paths, all unrelated refs remain exact, and no registration was pruned or replaced.

The preexisting design-worktree binary index stat/cache difference is retained and disclosed in the C-07 first-gate record. Its 882 logical entries/modes/stages/flags and tracked bytes are exact. No index normalization was performed and no unproved cause is asserted. Stopped-interval verification distinguishes filesystem loss from Git history changes; only already-authorized implementation/administration commits and normal pushes advanced this implementation branch.

- `ADOPTED-f03-s3-widened-packet-relation-ownership-clarification-20260919.md`: commit `7ed1aa60f3879b983ee5279243e71b24d38ea690`; tree `3a9f18fd2cfcb8d8437f3cbc72da48b508c27d50`; blob `c92907667335809e2063145da87f06f15226536f`; SHA-256 `7067ed53abbf7f5bec7b49f938acd10857da199e1a0b3aaac7e0a2552fe7d744`; 25975 bytes.
- `ADOPTED-f03-stationary-degraded-capture-accounting-clarification-20260926.md`: commit `70f4e21de5bd89abca0d4f27ae3916458482fb1c`; tree `9dbe38dcc0f781ad459ada500be1d12a06ca79a4`; blob `5ec99766ce3287fbd89b46a1b5ce81e13bef67e9`; SHA-256 `02f2eb9c4fc088be2b59344d064d034f787aeb6713658c9ca305999ba554b4f1`; 30284 bytes.

C-07 verbatim HUMAN declaration: 17,972 bytes; SHA-256 `e3af79fbb6982f6ae291f6428adaffebd51df5cd5a726f4c6fa71d1fcd6ea2ea`. The complete separate administration record is 30,284 bytes as pinned above. It introduced no implementation changes. Its normal push succeeded; the branch was subsequently normally pushed through `cee7b889b11d737c077b279fd79d6dbb62272167`. A final ordinary preservation push will publish this stop record; its receipt and exact final HEAD/tree are reported after the administration commit, avoiding self-referential identities.

## Continuation commits before this administration record

| Commit | Tree | Change |
|---|---|---|
| `70f4e21de5bd89abca0d4f27ae3916458482fb1c` | `9dbe38dcc0f781ad459ada500be1d12a06ca79a4` | docs(f03): adopt human C-07 stationary capture accounting clarification |
| `470aafa06555d15af4cba032946f8a4de60b1d89` | `d3b0c42a8b9e10dbd5be4380a6ac2887f961a282` | Implement authenticated stationary S2 accounting under C-07 |
| `290bb344dac6c5a0b0ce9bcff84050e292900628` | `ab61895ca1242e4025610542a5d5112d7cb922b7` | Retain C-07 accounting progress and initial failure chronology |
| `4172f0002f342147c6157463926c54923f61a3ce` | `83e90e364d5223b7cf718a98de0ff82b792f40d1` | Bind orchestration worker requests to exact serialized bytes |
| `97e4d252c87c541393306ee401cf82d30997d824` | `96c3476bbe87e6c64354ea34c7cfaa5c94db5f88` | Retain failed installed request-byte attack and repair evidence |
| `64cb64decfcbb502a72bce9a5cc906bcdd651e00` | `9759d13bc6df800c847d890add7e90eabdf925d3` | Require exact retained stationary transaction record formats |
| `dc97a75f496b184e43662a105499519f094e3327` | `087d92e2cdfc176ff00ba25244fbbfaf3acbb763` | Reauthenticate retained dispatch completion before acceptance and reuse |
| `93b416987c6bd93ed43f309bcd9915fa32173c43` | `cd66aee80bab485cb926aab8c37492926dcf8783` | Add bounded S4 relation proposal review and guarded C1 composition |
| `cee7b889b11d737c077b279fd79d6dbb62272167` | `0ddec7f5a00d8e5b4c021015864efabd248abbec` | Retain installed C07 failures and bounded S4 progress evidence |
| `7ba615a331f51cb79e80f9159cc7d21e79555aa2` | `d7141d053fd18482106c50fc1b7fade6b51fbe47` | Compose bounded C2 ambiguity review, Class B impact and C3 boundary |
| `fd3a5f690f9d72fe36ce2e3f7a30fdfbdb03bb3f` | `9262361fad66a5bbd2f385a04068276ba814fcad` | Compose authenticated Class C procedural authority work and Q followups |
| `0787548f3bacc2f741dfbd435cf7a05c5a559b12` | `106ad5d45e2a02b2c3186d2cc2a58b0f9cd42e4d` | Retain pre-C08 gap fixture correction without claiming rerun completion |
| `1486b94a106d98bcececa3c41ab4d87917a284cd` | `a10c87c3aa15185300d09df52e12c66a5054ad2d` | Retain C08 installed source-identity and C2 reference grammar discriminator |

Pre-evidence/discriminator HEAD `1486b94a106d98bcececa3c41ab4d87917a284cd`, tree `a10c87c3aa15185300d09df52e12c66a5054ad2d`. The only fixture change committed after stop discovery (`0787548...`) was already authored before discovery: it corrects the extra-L1 expectation. Its installed rerun is NOT RUN. The C-08 discriminator commit changes no product rule. The later adapter manifest addition only registers that evidence test's ownership.

## Payload identities and version state

| Surface | Exact identity |
|---|---|
| Core | `sha256:ca6c9b76fec452297ebc701fa3918e7a1a08caab615b3981819c7dc8f267240b` |
| Checker | `sha256:d848c6ed34f5cdc478ef65dce07c42b9ae2ea2942ec9f04b383bca4412f1c320` |
| Loa adapter | `sha256:1e5860f6269e5f127856d3eb43b778aecd6633c7d8e14e5f1aa95c39072a095e` |
| Generated runtime | `sha256:74c8d041b022a188e4b8c592660696a394f9d98631d13d91f14f9f82e672ecd8`; 51 files; sha256-path-file-digest-v1 over repository-relative runtime-js paths |
| Repository/default format | `1.8.0-provisional` |
| Implementation format | `1.9.0-provisional`; `orchestrator-work-transitions` remains gated |
| Adapter protocol | `1.0.0-provisional` |

No 1.9 default, old-run migration, mutable-main runtime substitution or release preparation occurred. The mutable repository HEAD is not execution authority for retained runs. Bundle identities depend on their exact provenance; per-attempt bundle locks and pins are included in snapshots.

## Implemented scope and limits

| Obligation | Strongest supported status |
|---|---|
| C-01 | Adopted degraded-selector ownership/accounting preserved. Original-selector, no fictitious PKT/CC semantics remain; exhaustive installed S2 not complete. |
| C-02 | Adopted current completion projection preserved. Installed S2 examples reach complete under strict K2.14; full matrix incomplete. |
| C-03 | Repaired mechanically in `cd10dd9ad8f43470498be04d559678c3740da301`. First mismatch introduced by `c9aff09f9a09f864ab7eb781029c98f6ea91e1d0`: adopted C-05 edits changed the whole checker source while an old whole-file test hash remained. Historical expectation retained through an exact pre-C05 projection. No frozen-source bytes/hash or K2.14 rule changed. 42/42 source and runtime subsequently passed, including exact frozen hash across pending→committed. Not full final-candidate requalification. |
| C-04 | Indeterminate-claim nonaffirmative ownership retained; no automatic canonical claim admission. Prior 35+35 controls retained; complete installed lifecycle pending. |
| C-05 | 67+67 focused checks retained. Installed capture and semantic-reservation recovery reached 18 points, then interrupted; entire widening/L2S/L2F/re-evaluation path not complete. |
| C-06 | 44+44 focused checks, 30 adversarial per runtime, previously passed. Contextual S3 PKT eligibility implemented; installed composition not complete. Historical 37+37 discriminators retained unchanged. |
| C-07 | 66+66 focused checks, 35 adversarial per runtime. One ordinary installed three-generation path completed with deterministic stationary halt; later 16 tamper refusals and 33 recovery points passed before interruption. Remaining recovery and complete installed final candidate pending. Historical 18+18 and both installed WORK_CURSOR refusals unchanged. |
| S0/S1 | Supported fixture product traces passed on retained earlier candidate pins. Final stopped payload not exhaustively requalified. |
| S2 | Packet/degraded/stationary/gap work partly demonstrated. Gap reconciliation passed ten fault points; the subsequent extra-L1 fixture expectation was wrong. Corrected before C08, no rerun. Exhaustive S2 remains incomplete. |
| S3 | Normalization and widening portions demonstrated; complete affirmative/no-claim/nonaffirmative/revision/ambiguity lifecycle and installed seal proof incomplete. |
| S4 | Duplicate/relation/C2 Core composition partially implemented. Installed successor attempt failed at real S4 entry: `DUP_FORMAT ledgers/duplicate-review.md: ledger required on real S4 entry, including zero candidates`. Not repaired at C08. No installed C1/C2/C3 closure qualified. |
| Post-S4 | Core synthetic C2/C3/S5 entry returns `WORK_UNSUPPORTED_CAPABILITY`; installed proof incomplete. No S5 work family implemented. |
| Authentication | Exact request-byte and dispatch-completion reauthentication regressions fixed separately; initial failures retained. C07 installed 16 refusal cases passed. Full stream/native-shaped fixture, tamper, stale and replay matrix incomplete. |
| Writer bypass | Durable Core work-ID ingress is implemented; complete supported-surface bypass matrix not qualified. |
| Recovery | Partial results below; no claim of complete Architecture-B proof. |
| Exactly once | Only demonstrated canonical/accounting effects in bounded successful fixtures. No exactly-once provider or worker invocation claim. Unknown dispatch remains a halt. |
| Retained-runtime routing | Retained bundle authentication exercised in installed fixtures; exhaustive predecessor and mutable installed/main substitution qualification incomplete. |
| /loa-aleph integration | Structured resume/transport and bounded preparation inputs implemented partially, including contact metadata. It cannot manufacture human authority or semantic fields. Installed complete S0–S4 skill loop not qualified. |
| Predecessors | Existing frozen runtime/bundle authority preserved; previously passing compatibility controls retained. Full final 1.2–1.8 matrix NOT RUN. |
| F-05 | Existing finding preserved; complete supported-controller late-surface refusal evidence outstanding; no closure. |

## C-06 binding and downstream boundary

Core derives the widened-packet exception from retained authenticated C-05 work, normalizer invocation/selector/request, fresh PKT identity and exact evidence, lineage, producer invocation, semantic subject ID/digest/owner stage, and run/checkpoint/chain basis. A plain S3/PKT relation object or caller flag cannot authorize it. Relation owner remains S3 and source remains the exact widened packet; no S2 reassignment or reserved-CC substitution is performed.

The general `sourceKindLegal` predicate remains unchanged (334 bytes including its trailing LF; SHA-256 `11bb95bfe49fd28622c9eec7dceb8e48906b4dad71c6156937c24a06557e1d28`). CC-only semantic-prerequisite and claim-dependency forms remain rejected for PKT. C06 semantic capture/review retains proposals without creating canonical REL or CC; fresh L2S and separately required relation/material review remain barriers. S2 seal and predecessor subject remain historical. These statements are supported by focused controls, not a completed installed downstream S4 trace.

S4 relation work discovers retained proposals with their original source/basis/digest and applies ordinary L3R/material predicates. Canonical REL serialization is restricted to the composed C1 closure. The 24+24 focused relation controls (14 adversarial each) passed; installed C1 composition did not pass because the separate real-entry duplicate-ledger failure precedes it. C06 does not grant special canonical relation semantics.

## Recovery evidence, including outstanding boundaries

| Boundary | Evidence at stop |
|---|---|
| Selection, sealing, preparation | Exercised in earlier supported traces; exhaustive crash matrix pending. |
| Dispatch uncertainty | Explicit unknown-dispatch halt retained; complete process matrix pending. |
| Return completion and acceptance | Request serialization and completion-record tamper failures repaired; 16 current C07 fixture refusals passed. |
| Stationary capture generation 0 | 9 recovery points passed: derived, intent, writer-prepared, semantic-ledger effect, canonical bytes, chain, checkpoint, journal, consumption. |
| C07 semantic resolution | 8 recovery points passed. |
| Same-frontier extractor preparation | 8 recovery points passed. |
| Later stationary capture | 8 recovery points passed. |
| Stationary-frontier halt persistence | Ordinary earlier installed positive passed; interrupted recovery run did not finish halt fault points. |
| C02 completion / C03 commitment / C04 nonaffirmative accounting | Focused and partial installed controls retained; complete process matrix pending. |
| S2 gap reconciliation | 10 fault points passed, including packet/walk effect boundaries; after recovery the old test expected an unrequired additional L1. |
| S2→S3 | Positive transitions observed; exhaustive final boundary matrix not complete. |
| C05 widening capture | 10 fault points passed, including packet and lineage effects. |
| Widened semantic reservation | 8 fault points passed. |
| C06 widened-PKT semantic relation / fresh L2S / L2F / re-evaluation | Focused controls passed; complete installed recovery path interrupted. |
| S3 seal and S4 work | Full matrix incomplete; installed real S4 entry failed missing duplicate ledger. |
| C2 Class B/Class C, M/A/Q revisions | Core Class B and selected Class C Q controls pass; installed attempts interrupted. M/A implementation and recovery incomplete; C08 blocks source references. |
| S4 C1/C2/C3 closure and S5 capability halt | Helper controls only; complete installed proof absent. |

No interrupted state is asserted to be authenticated BEFORE or AFTER without recovery. The stopped snapshots retain exact bytes, journals, chain, checkpoint, work and consumption state for later authorized reauthentication; no recovery was silently performed after C08.

## Test totals and retained failures

Latest bounded focused totals are not a full candidate aggregate. C03 42+42; C05 67+67; C06 44+44 (30 adversarial each); C07 66+66 (35 adversarial each); S4 relations 24+24 (14 adversarial each); C2 resolved-local 16+16 (7 adversarial each); C2 Class B 22+22 (9 adversarial each); C2 Class C 38+38 (16 adversarial each); C08 discriminator 14+14 (zero claimed adversarial mutations). C2 modes overlap; repeated checks and source/runtime parity are not distinct mutations. Worker contract discovery enumerated 27 exact identities and passed 14 aggregate controls.

Historical C01/C02/C04 and all C06/C07 discriminators remain retained; source-walk/K2.14, semantic, representation, relation, lineage, ambiguity, conformance and earlier mutation results remain labeled by their actual candidate. They are not rebranded as final qualification. Typecheck, stopped generated-runtime parity (51 files) and CB1–CB10 passed. The initial stopped CB7 check failed only because the new discriminator test lacked its adapter ownership entry; that inventory metadata was corrected, with both outputs retained.

Full final candidate testing—conformance/mutations, installed fixture/process, exhaustive authentication/bypass/crash recovery, S2/S3/S4 composition and closure, retained routing, installer/package structural tests and deterministic repeatability—was NOT completed. There is no full final deterministic pass total.

| Installed attempt | Exit | Raw PASS lines | Recovery points | Tamper refusals |
|---|---:|---:|---:|---:|
| `c07-installed-accounting-first.log` | 0 | 2 | 0 | 0 |
| `c07-installed-accounting-recovery-third.log` | 143 | 50 | 33 | 16 |
| `s2-gap-installed-projection-repair-third.log` | 1 | 11 | 10 | 0 |
| `c05-c06-installed-composed-recovery-first.log` | 143 | 22 | 18 | 0 |
| `s4-installed-successor-relation-c1-first.log` | 1 | 3 | 0 | 0 |
| `s4-c2-installed-class-b-first.log` | 143 | 2 | 0 | 0 |
| `s4-c2-installed-class-c-first.log` | 143 | 0 | 0 | 0 |

Exit 143 denotes deliberate fixture interruption at the C08 stop, not a source failure or completion. C07 ordinary positive had three capture generations, two degraded semantic subjects and no fabricated PKT/CC; its repeated halt checks are only bounded canonical/accounting-effect evidence.

Retained failures include the first C07 fixture stale validation directory; request.json serialization tamper accepted before `4172f000...`; dispatch completion tamper accepted before `dc97a75...`; first S2 gap fixture key order; second S2 gap fixture exclusion conflict; third extra-L1 expectation; S4 missing duplicate ledger at entry; initial Class C three-digit locator refusal; sandbox EPERM/empty CLI output attempts; and the first stop-process inspection race (one test exited before signaling). All raw outputs and subsequent repair/interruption chronology remain available. The source-width conflict and S4 entry defect remain unresolved.

## Durable evidence identities

| Record | SHA-256 | Bytes | Snapshot files |
|---|---|---:|---:|
| `EVIDENCE-f03-c08-stopped-run-snapshot-01-20260926.json` | `68bcae5db298ba02f9db433bcc15fb8a5eec2c03e0b890fec751b7d0a6fdd259` | 7982839 | 1203 |
| `EVIDENCE-f03-c08-stopped-run-snapshot-02-20260926.json` | `673fc24cdde2c01b59fcdb1f2a906c7218b6c6667a18028e5a434a60bea80afb` | 8151580 | 1203 |
| `EVIDENCE-f03-c08-stopped-run-snapshot-03-20260926.json` | `cfc27cc53f4337117fe3d07ff9f324bf7736ef473cbbe802921e4f19d3246f5e` | 10696760 | 1429 |
| `EVIDENCE-f03-c08-stopped-run-snapshot-04-20260926.json` | `b892455af8ca5c2f4af3c912bf9f8cf0ea9b512a0fc2a1d15c73eecbbe360fbb` | 9783937 | 1339 |
| `EVIDENCE-f03-c08-stopped-run-snapshot-05-20260926.json` | `8700c52b40e567d6988c60784eb785c0286a64b3ce15c0de9eae8be3d3290bb3` | 7165593 | 1104 |
| `EVIDENCE-f03-c08-stopped-run-snapshot-06-20260926.json` | `fc34ed4afb31f819ba17f1da64e71ada1094cf5494a18aff532700f42ad254a1` | 5147982 | 841 |
| `EVIDENCE-f03-c08-stopped-run-snapshot-07-20260926.json` | `85466c5667bc9f022c4ae29835c131e35419e74b9fb7385380981fd7cef4f1f9` | 3522274 | 688 |
| `EVIDENCE-f03-c08-source-reference-conflict-and-stopped-handoff-20260926.json` | `0fb221ebd84753a5e98d6d64a9239e6048f41ec68db73461c510c6531a39c43c` | 596865 | — |

The seven snapshot records retain 7807 exact files. Every decoded file carries its original relative path, mode, size, SHA-256 and bytes; each gzip envelope carries independent compressed/decoded hashes. The main evidence contains raw logs, first-gate receipts, preserved failures, process termination receipt, discriminator probes and current partial totals.

## Changed-path inventory through the discriminator commit

The following exact paths differ from the C07 starting checkpoint through `1486b94a106d98bcececa3c41ab4d87917a284cd`. This stop administration additionally adds the eight evidence files above, this record, and their Core/adapter inventory metadata. The post-commit report provides the complete final path set.

```text
adapters/loa/adapter.manifest.json
adapters/loa/profiles/loa-default.json
adapters/loa/skill/loa-aleph/SKILL.md
adapters/loa/src/cli.ts
adapters/loa/src/ledger-writer.ts
adapters/loa/src/orchestration.ts
adapters/loa/src/runtime-snapshot.ts
adapters/loa/src/types.ts
adapters/loa/src/worker-bundle.ts
adapters/loa/tests/test-f03-ambiguity-work.ts
adapters/loa/tests/test-f03-c08-source-reference-discriminator.ts
adapters/loa/tests/test-f03-relation-work.ts
adapters/loa/tests/test-f03-stationary-capture.ts
adapters/loa/tests/test-orchestration-process.ts
calibration/src-001/core-design-basis/ADOPTED-f03-stationary-degraded-capture-accounting-clarification-20260926.md
calibration/src-001/core-design-basis/EVIDENCE-f03-c07-accounting-implementation-progress-20260926.json
calibration/src-001/core-design-basis/EVIDENCE-f03-c07-installed-recovery-and-s4-progress-20260926.json
calibration/src-001/core-design-basis/EVIDENCE-f03-c07-worker-request-byte-binding-repair-20260926.json
core.manifest.json
docs/architecture/prompts/workers-intake-extraction.md
docs/architecture/templates/03-extraction-claims.md
docs/architecture/templates/09-internal-ambiguity.md
runtime-js/adapters/loa/src/cli.js
runtime-js/adapters/loa/src/ledger-writer.js
runtime-js/adapters/loa/src/orchestration.js
runtime-js/adapters/loa/src/runtime-snapshot.js
runtime-js/adapters/loa/src/types.js
runtime-js/adapters/loa/src/worker-bundle.js
runtime-js/scripts/lib/semantic-review.js
runtime-js/scripts/lib/stationary-capture.js
runtime-js/scripts/lib/work-transitions-ambiguities.js
runtime-js/scripts/lib/work-transitions-authority.js
runtime-js/scripts/lib/work-transitions-relations.js
runtime-js/scripts/lib/work-transitions-s4.js
runtime-js/scripts/lib/work-transitions.js
scripts/duplicate-fixture-support.ts
scripts/lib/semantic-review.ts
scripts/lib/stationary-capture.ts
scripts/lib/work-transitions-ambiguities.ts
scripts/lib/work-transitions-authority.ts
scripts/lib/work-transitions-relations.ts
scripts/lib/work-transitions-s4.ts
scripts/lib/work-transitions.ts
scripts/semantic-fixture-support.ts
scripts/test-worker-return-contract.ts
```

## Prohibited-operation counters and finding states

All observed session counters are zero: provider/model calls; genuine native workers; live corpus execution; SRC-001 preparation/replay; closed-reference access; release preparation/publication; Loa ingestion; PR creation; merge; reset; rebase; amend; squash; cherry-pick; force push; pruning/replacing worktree registrations; consuming/applying/dropping stash; sanction; governance/semantic acceptance; F03/F04/F05 closure; v1 declaration. Fixture-only local Git provenance repositories, simulated authority responses and fixture transport are labeled and are not real repository history reconstruction or human acceptance.

F-03 OPEN / MUST PRESERVE. F-04 OPEN / MUST PRESERVE; no portability repair. F-05 OPEN / MUST PRESERVE and bounded by F-03. Strongest justified status: partial implementation with retained structural evidence, stopped for a new HUMAN Core decision. No producer-complete reconciliation record is created.

Proposed future independent Claude Opus audit scope, not invoked: the full original-authority-to-final-stopped-HEAD range starting `4a999689a21b08f4d7c333e3b28362d47476d02f`, plus focused C07 continuation starting `141679591d4b4d4538c9216c18143805d1ecad19`. The post-commit report supplies the exact final endpoint/tree. The subject is partial implementation/conflict custody only; it is not a producer-complete or live-native acceptance audit.

F-03 PRODUCTION REACHABILITY PLEMENTATION STOPPED — NEW HUMAN CORE DECISION REQUIRED

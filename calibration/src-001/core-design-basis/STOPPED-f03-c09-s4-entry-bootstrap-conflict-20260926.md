# F-03 C-09 S4 entry bootstrap conflict and stopped handoff

Date: 2026-09-26

Status: STOPPED — NEW HUMAN CORE DECISION REQUIRED — PARTIAL IMPLEMENTATION ONLY

Implementation stopped at `2026-09-26T17:09:17.884594+00:00` on `f25a1a3f76800b9ea586e65bf5990bd1c7c55bfe`, tree `4b6d39810391a702035b697c1f99a9f30a0855ed`. Subsequent changes are discriminator, administration and evidence retention only. This is not a producer-complete reconciliation, independent audit, native execution proof, semantic acceptance, release, finding closure or v1 declaration.

## Exact C-09 conflict

The separately retained installed S4-entry failure is a conflict between the existing state-validation and plan-window contracts:

1. Before S4, `validateDuplicateRun` forbids duplicate artifacts.
2. Once S4 entry is recorded, the same validator requires `ledgers/duplicate-review.md`, including for zero candidates.
3. `verifyRunControl` invokes that validator before ordinary new work selection.
4. The existing `s4.initialize` operation is independently selected for a missing ledger, but `planDuplicateWrite` requires an already-open S4 before-image through `assertDuplicateWindow`.
5. The S3 seal plan allows only its seal artifact and `run-log.md`; adding the duplicate ledger fails `SEM_WINDOW`.
6. The duplicate initialize plan allows only the duplicate ledger; adding the stage-entry run-log write fails `DUP_WINDOW`.

The current `stage.seal-S3` commits S3 exit and S4 entry, then the next full verification refuses the missing ledger. Its work is already consumed in the retained installed failure. The failure is not fixed by C-08 source width. A standalone initialization plan passes only from the already-open S4 model that full verification rejects.

The HUMAN decision needed is the exact lawful S3-exit/S4-entry bootstrap transaction and its before/after authority: how S3 sealing, S4 entry, exact empty duplicate-ledger initialization, existing plan validators, journal/chain/checkpoint and consumption are composed without exposing an invalid committed state. The adopted F-03 design authorizes executable stage bindings and reuse of existing plan validators, but does not establish an exact exception to these conflicting before-image/write-window requirements. No specific exception is adopted here.

No verification was deferred. No missing-ledger S4 state was blessed. No duplicate ledger was precreated in S3. No S3 semantic write allowlist or duplicate write window was relaxed. No synthetic S4 before-image was passed off as authenticated actual state. No new bootstrap constructor was implemented. C-09 does not reopen the HUMAN C-08 source-identity decision.

Controlling existing sources include `docs/architecture/checker-spec/K2-20-duplicate-review.md` (ledger required at real S4 entry; writes forbidden before S4), `docs/architecture/08-runbook-agent-mode.md` (initialize at real S4 entry), the adopted F-03 proposal sections 11 and 14 (existing validators and full verification before selection), and `scripts/lib/duplicate-review.ts`, `scripts/lib/semantic-review.ts`, `scripts/lib/work-transitions.ts`, `adapters/loa/src/run-control.ts`.

## Machine discriminator and actual installed evidence

`adapters/loa/tests/test-f03-c09-s4-entry-discriminator.ts` retains **18 named controls in source and 18 in runtime**, with **zero claimed adversarial mutations**. PASS means the conflict reproduced. The controls are not producer qualification and are not counts of every internal assertion invocation.

```bash
node adapters/loa/tests/test-f03-c09-s4-entry-discriminator.ts --installed-run <retained-fixture-run>
node adapters/loa/tests/test-f03-c09-s4-entry-discriminator.ts --runtime --installed-run <retained-fixture-run>
```

The exact original fixture is `/tmp/aleph-orchestration-process-Cz19En/host/grimoires/loa/aleph/runs/RUN-20260926T143458970Z-735f5527a1f1`. It reached S4 and remains fixture-simulated with frozen `SRC-001`, S3 seal, no duplicate ledger, and checkpoint `sha256:9df600f6963e7edc31b570ea713a29d7907d3af2272d91e149a03fdd12b029b1`. Work `WORK-782a3bcd8821265331a6b35207c9a1bd998143d4a290291e61947ebe21ce6b9d` is the consumed S3-seal work. Original pinned runtime verification still reports:

```text
DUP_FORMAT ledgers/duplicate-review.md: ledger required on real S4 entry, including zero candidates
```

This continuation only read that installed run. All its paths, modes and bytes were compared before and after. Its full frozen bytes were already retained in `EVIDENCE-f03-c08-stopped-run-snapshot-04-20260926.json`, SHA-256 `b892455af8ca5c2f4af3c912bf9f8cf0ea9b512a0fc2a1d15c73eecbbe360fbb`, blob `96b69a5e1e60eb3bf282ed88fb623c576163816d`, 9,783,937 bytes / 1,339 snapshot files. No fresh installed S4 or C2 success is claimed.

The installed duplicate validator, semantic validator and run-control runtime files equal current bytes exactly. Whole `work-transitions.js` differs because the installed fixture predates later C2/S5 additions: installed SHA-256 `9d0c39c9501ea224252b0733a76d28b302c07ac620cb2bf7f9e5db20807dac57`; current `31892dc67d840b5243f8e07eac6a9d7316edf9b36f7c12ac88715585e54f737e`. The exact S3-seal/S4-entry block is unchanged, SHA-256 `42e7a56e3a17f14b1727d35e410c56edf6e5818a7154c42cff1fafff89687307`. Both initial discriminator runs passed 15 named controls, then failed an overbroad whole-file-equality assertion. Those failures and the complete file comparison are retained. No frozen hash or runtime was changed to make a comparison pass.

## Authority and first gate

- Original adopted F-03 design: `484fa227e1ed23c81dc4cf37987aa0be16eded8f`, tree `13ad9e53a77949718afa9dc59c25c2e9d52beacb`.
- Original implementation authority: `4a999689a21b08f4d7c333e3b28362d47476d02f`, tree `755ab653bf7ef8e2d4186f937f52a098722cc6a8`.
- Original retained local C-06 checkpoint: `0dcb39c6cfde4b875f8f27347739095382bcf7d5`, tree `1dfc57d526c601b5653945a98a3707d1be44f292`.
- C-07 checkpoint: `141679591d4b4d4538c9216c18143805d1ecad19`, tree `a924b5b1aa209082480d496449d9abda12598b13`.
- This C-08 continuation started only after local and remote HEAD both verified `5bfbe50209d240f8fe07af587484e842c034e691`, tree `a2e44dbcbbc5cb311da638ff9fc2263504388659`, on `agent/f03-production-reachability-implementation-20260917`, with clean index/worktree.
- All seven registrations and current indexes equaled the retained C-08 stopped state. All unrelated refs, primary, release and stash were preserved. All 39 retained F-03 administration/evidence records were compared to their Git blobs and exact SHA-256/size before any repository edit, then rechecked after the discriminator commit.

The C-01–C-08 clarification/stop chronology is bound by the unchanged C-07/C-08 authority records and first-gate historical inventory in the machine evidence. No historical Slice-5 proposal/adoption or C-08 discriminator was rewritten.

C-08 separate administration record: `calibration/src-001/core-design-basis/ADOPTED-f03-c2-frozen-source-identity-clarification-20260926.md`. Commit `359ac7d75796bf1fe79a1642896db18524575319`; tree `f981af0765f8dab63d3d5d2db5499576e7840593`; blob `ae271cb001126dbb3c18ed41f4f836e41badd9a6`; SHA-256 `c0759fb30adef47b9927b3b1f3e0e93ea603c149770a7f6661679c4493a73edb`; 43,122 bytes. The exact HUMAN declaration is 15,687 bytes, SHA-256 `3cabe069aeb90cf32677c82beb51933a12185b93aad2b84a4f6d2afeb242e3b5`. Only that new record and its administration inventory entry were committed. Normal push succeeded from `5bfbe50209d240f8fe07af587484e842c034e691` to `359ac7d75796bf1fe79a1642896db18524575319`.

For cumulative authority continuity: C-06 administration commit `7ed1aa60f3879b983ee5279243e71b24d38ea690`, tree `3a9f18fd2cfcb8d8437f3cbc72da48b508c27d50`, blob `c92907667335809e2063145da87f06f15226536f`, SHA-256 `7067ed53abbf7f5bec7b49f938acd10857da199e1a0b3aaac7e0a2552fe7d744`, 25,975 bytes. C-07 administration commit `70f4e21de5bd89abca0d4f27ae3916458482fb1c`, tree `9dbe38dcc0f781ad459ada500be1d12a06ca79a4`, blob `5ec99766ce3287fbd89b46a1b5ce81e13bef67e9`, SHA-256 `02f2eb9c4fc088be2b59344d064d034f787aeb6713658c9ca305999ba554b4f1`, 30,284 bytes.

## C-08 implementation and exact limits

Core now centralizes `legalSourceIdSyntax` and `legalFrozenSourceRef`: minimum three digits plus exactly one matching frozen source row. `usesExactC2SourceIdentity` gates the new path to cumulative 1.9 with the registered work-transition capability. The unbound parser and predecessor-format branches retain the prior grammar. C2 selection, candidate parsing, material locators and full-source references use exact source bytes. Producer capture rejects source substitution and invalid exact reopening without changing a semantic field. Source equality is never numeric normalization.

Material validation separately checks source syntax, unique inventory membership, same-source equality, canonical locator syntax, scheme and exact reopening. Full-same-source completion retains the exact source token. Search-basis serialization remains exact and its digest changes when source bytes change. PKT/REL/WLK/CUR grammars remain unchanged. Production intake, frozen sources, source hashes, historical identities and predecessor pins are unchanged. Operative cumulative-1.9 template/checker text and generated runtime are updated; old Slice-5 records are not.

Focused source/runtime controls cover exact `SRC-001`, natural allocation through `SRC-999` and `SRC-1000`, short/absent/alternate-width IDs, duplicate rows, same-source binding, source-locus ordering, exact search serialization and digest, completion references, material locator reopening, independent identifier grammars and predecessor parser behavior. Invalid-proposal controls recompute affected proposal digests where applicable so rejection is not merely a stale-digest failure. The exact original C-08 discriminator runs unchanged through a separately labeled 703-file pre-clarification projection; it still reports 14+14 controls with its three-digit refusal and four-digit synthetic positive.

C-08 required installed fresh-process C2 control **28 remains NOT COMPLETED**, because C-09 blocks lawful S4 entry. Synthetic C2/Class C positive cases do not replace that product proof. There is no C-08 producer-complete reconciliation.

## Commits in this continuation before this administration record

| Commit | Tree | Scope |
|---|---|---|
| `359ac7d75796bf1fe79a1642896db18524575319` | `f981af0765f8dab63d3d5d2db5499576e7840593` | Verbatim C-08 administration only |
| `f25a1a3f76800b9ea586e65bf5990bd1c7c55bfe` | `4b6d39810391a702035b697c1f99a9f30a0855ed` | C08 focused implementation and historical projection controls; installed C2 and full F03 qualification remain incomplete |
| `9080f272eb4ed5e3c6086bc390db0818d9087007` | `7e21d25e949b4175d9d12f5394922adb1dcadd84` | C09 stop discriminator and exact inventory only; no implementation policy change |

The stop record and machine evidence are committed afterward. Their exact final HEAD/tree and normal push receipt are reported in the post-commit handoff, avoiding self-referential identities.

## Payload identities and versions

| Surface | Exact identity |
|---|---|
| Core | `sha256:27fc1865050230aaedcf2ef10aa35e4a044e8ee9d0c59ab763343eff2e45000d` |
| Checker | `sha256:71cc4d6be8d7311c4b4583b8c5354a0b27cba8feed06356622d29ed321cfb743` |
| Loa adapter | `sha256:8d102866479326fb34315a07d51ab50eb5f5e08271232c7e0b9e9dc52d4f6b4c` |
| Generated runtime | `sha256:86919c1c8b8b73d8881d9953d29de454f958c704fd1e2830a811867fae135e5c`; 51 files; SHA-256 path/file-digest inventory over repository-relative runtime-js paths |
| Manual execution binding | `sha256:81c536d14dca524a7dea0a1ab0cf263cde985079f7c75e37e5d633ded65c7715` |
| Default/current run format | `1.8.0-provisional` |
| Implementation | `1.9.0-provisional` with `orchestrator-work-transitions`; not default |
| Adapter protocol | `1.0.0-provisional` |

No release, migration or mutable current-runtime substitution was performed. Per-fixture locks and runtime identities are retained in the snapshot evidence. Prospective bundle digests depend on provenance and must not be mistaken for a retained installed bundle identity.

## Status of required work

| Obligation | Strongest justified status |
|---|---|
| C-01 | Adopted degraded-selector ownership preserved; earlier 27+27 controls retained, exhaustive installed S2 incomplete. |
| C-02 | Adopted completion projection preserved; earlier 30+30 controls retained, full process/recovery matrix incomplete. |
| C-03 | Mechanical repair remains valid: 42/42 source and 42/42 runtime passed in this continuation. Root cause was the C-05 change at `c9aff09f9a09f864ab7eb781029c98f6ea91e1d0` invalidating an old whole-checker-file test hash. Repair `cd10dd9ad8f43470498be04d559678c3740da301` retains the exact historical pre-C05 projection. Frozen source bytes/hash, K2.14 and pending→committed meaning were not changed. |
| C-04 | Adopted indeterminate/nonaffirmative handling retained; prior 35+35 evidence retained, full installed lifecycle incomplete. |
| C-05 | Prior 67+67 focused controls and 18 installed capture/reservation recovery points retained; full L2S/L2F/re-evaluation path incomplete. |
| C-06 | Contextual widened S3 PKT relation eligibility retained; prior 44+44 controls with 30 adversarial-labeled cases per mode. Historical 37+37 unchanged. Full installed downstream composition incomplete. |
| C-07 | Prior 66+66 focused cases, bounded installed three-generation stationary path, 16 installed tamper refusals and 33 recovery points retained. Full installed recovery incomplete. Historical 18+18 and both WORK_CURSOR refusals unchanged. |
| C-08 | Focused correction implemented; 34+34 identity cases, 31+31 source-locus composition cases, 51+51 Class C/material cases. Historical 14+14 retained. Required installed C2 control blocked by C-09. |
| C-09 | Unadopted entry bootstrap/window conflict; 18+18 discriminator controls. No policy repair. |
| S0 | Earlier supported fixture traces retained; no full final payload requalification. |
| S1 | Earlier supported fixture traces retained; no full final payload requalification. |
| S2 | Partial installed families/accounting/gap evidence retained; exhaustive coverage and gap-fixture correction rerun incomplete. |
| S3 | Partial normalization/widening/semantic evidence retained; full lifecycle, revisions, ambiguity and seal/recovery proof incomplete. |
| S4 | Partial duplicate/relation/C2 composition; real S4 entry remains blocked at C-09; no complete installed C1/C2/C3 proof. |
| Post-S4 | Synthetic C2/C3/S5-boundary controls return `WORK_UNSUPPORTED_CAPABILITY`. No S5 work family; full installed proof absent. |
| Reauthentication | Earlier request-byte and dispatch-completion regressions repaired with initial failures retained; full process tamper/replay matrix incomplete. |
| Writer bypass | Durable Core work-ID ingress retained; complete supported-surface refusal matrix incomplete. |
| Exactly-once scope | Only bounded demonstrated canonical/accounting effects from labeled fixtures. No provider/worker exactly-once claim; unknown dispatch remains a halt. C-09 itself exposes an incomplete entry transaction and is not an exactly-once correctness proof. |
| Retained runtime | Original installed runtime was used for read-only C-09 verification; exhaustive retained-routing and mutable-runtime substitution matrix incomplete. |
| Installed /loa-aleph | Structured loop remains partial. No current complete S0–S4 supported-command proof. |
| Predecessors | 1.2–1.8 parser controls and strict C-03 predecessor checks pass; complete retained-runtime/bundle qualification not done. No migration. |
| F-05 supported surface | Required complete refusal evidence remains outstanding; F-05 OPEN and bounded by F-03. |

## C-06 relation boundaries preserved

Core still derives eligibility from authenticated C-05 work, triggering normalizer/selector/request, fresh PKT identity/evidence and lineage, producer invocation, semantic subject ID/digest/owner, run/checkpoint/chain. A caller flag or plain S3/PKT object cannot authorize it. The exact widened source and owner S3 are retained; no S2 reassignment or reserved-CC substitution occurs.

The general `sourceKindLegal` predicate remains unchanged (334 bytes including trailing LF; SHA-256 `11bb95bfe49fd28622c9eec7dceb8e48906b4dad71c6156937c24a06557e1d28`). CC-only semantic-prerequisite and claim-dependency remain rejected from PKT. Focused prior C-06 evidence proves no canonical CC/REL from semantic capture, preservation of S2 seal/predecessor semantics, and fresh L2S plus separately required relation review. Those controls were not rerun as a full C-09 final suite.

Ordinary downstream S4 relation work retains exact source/basis/review digest and ordinary L3R/material barriers; canonical REL remains behind C1 closure. Earlier 24+24 relation controls are retained, but the installed S4 path remains blocked before C1. C-08 grants no relation or canonicalization exception.

## Architecture-B coverage and gaps

| Boundary | Evidence/limit |
|---|---|
| Work selection, sealing, preparation | Earlier supported traces; exhaustive crash points incomplete. |
| Dispatch uncertainty | Explicit unknown-dispatch halt retained; complete process matrix incomplete. |
| Return completion/acceptance | Earlier exact-byte repairs plus 16 C-07 refusals retained; full matrix incomplete. |
| Commit intent, writer prepare, bytes, chain, checkpoint, consumption | C-07 initial stationary capture: 9 fault points; semantic resolution: 8; same-frontier preparation: 8; later capture: 8. Earlier pinned payloads only. |
| C-07 L2S/next generation/halt | Ordinary three-generation positive and repeated halt retained; halt recovery run was interrupted previously. No new retry policy. |
| S2→S3, C-02/C-03/C-04 | Strict focused and partial installed evidence; full process matrix incomplete. |
| S2 gap reconciliation | 10 prior fault points; subsequent extra-L1 fixture expectation corrected previously but not rerun. |
| C-05 capture / semantic reservation | 10 plus 8 prior fault points; full C-06 relation/L2S/L2F/re-evaluation path incomplete. |
| S3 seal → S4 entry | C-09 conflict. Retained committed S4 missing-ledger state is refused, not asserted to be a valid authenticated AFTER state. |
| S4 duplicate/relation/C1/C2/C3 and M/A/Q work | Partial helper controls; full installed/recovery proof absent. |
| S5 capability boundary | Helper explicit halt; installed complete proof absent. |

No interrupted or discriminator state is silently normalized or asserted to be authenticated BEFORE/AFTER. No full Architecture-B matrix or full exactly-once canonical-effect proof exists at this checkpoint.

## Test totals and failures

Counts below are the suites' named case/control totals. Source/runtime repetitions and overlapping C2 modes are not distinct mutations. No sum is presented as a global mutation count or a complete candidate pass total.

| Current continuation suite | Source | Runtime | Adversarial-labeled case groups per mode |
|---|---:|---:|---:|
| C-08 exact source identity | 34 | 34 | 16 |
| C-08 source-locus C2 composition | 31 | 31 | 21 |
| C-08 Class C/material composition | 51 | 51 | 28 |
| Historical C-08 discriminator | 14 | 14 | 0 claimed mutations |
| C-09 entry/window discriminator | 18 | 18 | 0 claimed mutations |
| C-03 pending→committed regression | 42 | 42 | Not reclassified here |

Typecheck passed. Generated runtime and parity passed for 51 files. CB1–CB10 passed after inventory repair. Full final conformance, mutation, installer/package, installed controller/recovery, retained-runtime, command/skill and deterministic repeatability suites were NOT completed. No complete final deterministic total is claimed. Previous exact worker-contract discovery of 27 identities / 14 aggregate controls and all earlier historical suites remain evidence for their original pins, not new final qualification.

Initial failures retained in this continuation: administration-registration script selected a nonexistent top-level JSON key before manifest mutation (corrected metadata nesting); initial C-08 CB2/CB3/CB7 failure from missing classified adapter entries for two new tests (fixed inventory only); both initial C-09 whole-module comparisons failed after 15 controls because of earlier C2/S5 additions (full installed hashes retained; exact entry block checked separately). All earlier C-03/C-05/C-07/C-08 failures and interrupted installed runs remain unchanged. The C-09 state/plan conflict is unresolved.

## Durable evidence

- `calibration/src-001/core-design-basis/EVIDENCE-f03-c08-continuation-and-c09-s4-entry-stop-20260926.json`: SHA-256 `d5a1fff3d0f714de9ef7e9b492525f40f811f929ea1c283b70dfe8b8a4fd7e37`, 1,086,119 bytes; 28 raw logs, 40 local receipts, focused results, complete C-09 discriminator evidence and exact current runtime inventory.
- `calibration/src-001/core-design-basis/EVIDENCE-f03-c08-c09-fixture-snapshots-20260926.json`: SHA-256 `3122ac1584bed1122c8d49a374b8951a2e7158e5fa9d6b6226a8778cae5eff68`, 17,325,273 bytes; 14 labeled synthetic snapshots, 5,108 exact files. Every decoded path, mode, size, hash and byte sequence was verified. These are Core/component fixtures and discriminator variants, not installed completion or recovered production states. Snapshot label `valid-S4` describes its duplicate-state predicate control, not a full-run qualification.

The original installed failure remains bound to its previously committed C-08 snapshot, not reconstructed or rewritten. First-gate identity inventories and HUMAN verbatim hash bind the controlling authority. The final Git blobs and final commit/tree are supplied after commit.

## Preservation and prohibited operations

Primary remains clean on `agent/src-001-blind-replay-preparation-20260914`, HEAD `a568f499db6707e4787ee3da969dbd6193b04944`, tree `a72612678f8cbdc4ae2951eb5b26f1b172c71847`; unchanged index SHA-256 `25b75457cdf1b9faace761383199531fca4b82215d7794c3d8deae4df7d3a4be`. Release branch remains `b9e2db742a087b8ae659ec39e476ed5e240cfa1f`. Stash count remains one, object `e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8`. Seven registrations, their names/paths, unrelated refs and all unrelated binary indexes are unchanged from C-08. The preexisting design-index cache difference from the earlier reconstruction interval remains disclosed in prior records; it was not normalized. Paused SRC-001 remains untouched.

Observed counters are zero for provider/model calls; genuine native workers; live corpus; SRC-001 operations; closed-reference access; release preparation/publication; ingestion; PR; merge; reset; rebase; amend; squash; cherry-pick; force-push; worktree pruning/replacement; stash consumption/application/drop; sanction; governance/semantic acceptance; finding closure; v1; and automatic-approval rejection. Counter scope is issued operations and inspected retained state, not unlogged outside activity. Two disposable historical fixture projections use separate synthetic Git provenance and do not reconstruct retained repository history.

Only ordinary authorized administration/implementation/evidence commits and normal implementation-branch pushes advance refs. No filesystem worktree reconstruction occurred in this C-08 continuation.

F-03 remains OPEN / MUST PRESERVE. F-04 remains OPEN / MUST PRESERVE; no portability repair. F-05 remains OPEN / MUST PRESERVE and bounded by F-03. Strongest justified status: partial implementation with preserved structural evidence, stopped for a new HUMAN Core transaction decision.

Proposed future fresh independent Claude Opus audit scope, not invoked: original implementation authority `4a999689a21b08f4d7c333e3b28362d47476d02f` through the final stopped HEAD, with focused C-08 continuation from `5bfbe50209d240f8fe07af587484e842c034e691`. The post-commit report supplies the exact endpoint/tree and complete changed-path inventory. This subject is partial implementation and conflict custody, not producer-complete or live-native acceptance.

F-03 PRODUCTION REACHABILITY PLEMENTATION STOPPED — NEW HUMAN CORE DECISION REQUIRED

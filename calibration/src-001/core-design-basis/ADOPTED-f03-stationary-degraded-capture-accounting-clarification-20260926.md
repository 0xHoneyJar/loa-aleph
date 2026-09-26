# F-03 stationary degraded capture accounting clarification

Date: 2026-09-26.

Status: **ADOPTED — HUMAN CORE CONTRACT CLARIFICATION / IMPLEMENTATION CONTINUATION AUTHORITY**.

Classification: `repository_administration`.

This record separately persists the HUMAN C-07 declaration before implementation edits. Its surrounding metadata records custody and scope; it does not add policy to the verbatim declaration.

## Authority and stopped chronology

Repository `0xHoneyJar/loa-aleph`, branch `agent/f03-production-reachability-implementation-20260917`.

Adopted F-03 design: `484fa227e1ed23c81dc4cf37987aa0be16eded8f`, tree `13ad9e53a77949718afa9dc59c25c2e9d52beacb`. Original implementation authority: `4a999689a21b08f4d7c333e3b28362d47476d02f`, tree `755ab653bf7ef8e2d4186f937f52a098722cc6a8`.

C-01 stop `5e17212cedbb47fa1cc27a0f5f11d941f9d7850e`, clarification `2cf9d884232107ff98268844ec3e8146f95a9a93`, reconciliation `e2cbc0b06f38a36ddd4cad30e069d857e63aac5e`; C-02 stop `ad8be4e9a88339530317e12e573b0299b15bef3a`, clarification `248aad3871c323aafec96f2664f26b60e6f0f062`; C-03 stop `eb31b3a67fbb450cd7666e2b437c3ccf190f543f`, clarification `fd02c316189656611fc1ea6b51789998cf2a319e`; C-04 stop `a34f769023a2310f72cb4b709cbfde3ff975a994`, clarification `512c5098ed8c03afb921af1ee37add66ab6f0c22`; C-05 stop `f314ed3226027d5ee15fdb7506827d8fc3f2d05e`, clarification `a563ad26ec30dcd1d5356ad060bcc2fc164562fb`; C-06 stop `0dcb39c6cfde4b875f8f27347739095382bcf7d5`, clarification `7ed1aa60f3879b983ee5279243e71b24d38ea690` remain exact historical authority/stop records.

C-07 stopped checkpoint: `141679591d4b4d4538c9216c18143805d1ecad19`, tree `a924b5b1aa209082480d496449d9abda12598b13`; its direct parent is the evidence-only test commit `1b313e7b9f5b21e2da42cd35e52a082255593778`, tree `54f60aefb7b34291312a849cffefdff738fbadf9`.

The C-07 stop record is `STOPPED-f03-production-reachability-implementation-stationary-degraded-capture-conflict-20260926.md`, blob `4328fd8d3d49c8fe99b704ffcc7f504c1dfb6fbe`, SHA-256 `368e19539c284fa029898a6e936c0fe563bd3919577d75e218012b2706651700`, 32153 bytes. Its machine evidence is `EVIDENCE-f03-c07-stopped-checkpoint-20260926.json`, blob `b2f6ca144e8b46b47491a3eed1176886a4feed8a`, SHA-256 `943d34d80eadd1caa6babfd753fa20e3f0f886d8f54ca039c09af579f10dd0ff`, 24561016 bytes. That evidence retains the 18+18 direct source/runtime discriminator cases, the two installed `WORK_CURSOR` refusals, and their exact fixture bytes. They remain evidence of the pre-clarification conflict and are not rewritten into post-clarification expectations.

## Verification before this administration record

The local implementation branch and remote HEAD both equal the exact C-07 stop above; `git ls-remote` verified the remote before repository edits. Its tree matches and its worktree/index are clean. All seven worktree registrations remain present with their retained branch/detached ownership and refs. No reconstruction or ref movement was needed in this continuation.

The primary checkout remains clean on `agent/src-001-blind-replay-preparation-20260914` at `a568f499db6707e4787ee3da969dbd6193b04944`, tree `a72612678f8cbdc4ae2951eb5b26f1b172c71847`. The release branch remains `b9e2db742a087b8ae659ec39e476ed5e240cfa1f`; the sole stash remains `e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8`. Primary index and the four unrelated detached-worktree indexes remain byte-identical to the stopped receipt. The design worktree retains its original HEAD/ref/tree and all 882 index entries/modes/stages/flags/tracked blobs, but its serialized index SHA-256 differs from the old receipt (`2b8f0199d888f03c40d5d9cb91e34a0bc920abe381144dbebf1239a38140c789` → `572ca9ba66bb4a17effb8929dc78262e5b1bcac9ce7e621e9956b0a8dbd7db9c`). All other retained design administrative components match. That serialization/stat/cache difference is disclosed; no index was normalized/restored, no logical Git state differs, and no cause beyond the available metadata is asserted.

All 26 historical F-03 records were verified against their exact stopped Git blobs, with earlier original pins checked separately. The current gate concerns exact retained logical state and the explicit branch/ref/HEAD requirements; it does not falsely claim the unrelated design index's serialized hash stayed unchanged. The initial strict binary-index assertion failure is retained in the continuation evidence as a verification observation.

## HUMAN declaration — verbatim

```text
I clarify the adopted F-03 accepted-worker-return production-reachability design for cumulative run format `1.9.0-provisional` and capability `orchestrator-work-transitions` as follows.

A context-bound accepted S2 extraction return may be valid even when:

- it contains one or more valid degraded non-exact packet candidates requiring the C-01 degraded-packet semantic-accounting path;
- it produces no new exact packet or committed extraction event;
- and its returned resume cursor is exactly the current legal source-walk frontier.

Such a return is a valid stationary capture result.

For cumulative `1.9.0-provisional` runs using `orchestrator-work-transitions`, Core MUST permit a narrowly bounded stationary accounting capture for this case.

A stationary accounting capture records and advances candidate-accounting state only.

It MUST NOT represent source-walk progress that did not occur.

## Source-walk state remains exact

For a stationary accounting capture, the canonical source-walk frontier remains unchanged.

In particular, Core MUST NOT fabricate or modify merely to make the capture transition appear progressive:

- `byte_offset`;
- `next_event_ordinal`;
- resume-cursor lineage;
- pending extraction-event status;
- packet identity;
- exact packet evidence;
- primary walk intervals;
- gap-review state;
- per-source completion state.

If the accepted return leaves the current legal resume cursor unchanged, the transition MUST retain that cursor exactly.

An existing pending event remains pending unless a separately authorized event transition, including C-03 where applicable, actually commits it.

A stationary degraded capture therefore MUST NOT:

- increment the cursor byte offset;
- increment an event ordinal without a real event transition;
- mark unwalked bytes as traversed;
- synthesize an exact event;
- synthesize a PKT;
- synthesize a CC;
- mark a source complete.

The existing source-walk checks and K2.14 remain strict.

## Degraded-selector accounting

Every applicable degraded packet candidate in the accepted stationary return remains subject to C-01.

The original `packet-candidate:<index>` selector MUST be retained.

Core MUST derive the existing dedicated degraded-packet semantic subject from the exact accepted return.

The subject MUST preserve the C-01 requirements, including the applicable degraded source identity, degraded locator/reason, criterion, semantic declaration and complete ordered `material_use`.

No fictitious PKT or CC is created.

No material-candidate rebinding is permitted.

No selector may disappear merely because the capture cursor did not advance.

## Stationary capture transaction

A stationary accounting capture is a real Core-authorized transaction even though its source-walk frontier before-image and after-image are identical.

Its transaction effects are the exact non-source-walk effects required to durably account the accepted return, including as applicable:

- retained accepted-return authentication;
- immutable selector accounting;
- derived semantic-subject publication;
- required semantic-review work registration;
- orchestration journal state;
- chain/checkpoint state;
- consumption of the exact capture work instance.

The transaction MUST explicitly record that its source-walk outcome is stationary/accounting-only, not frontier-advanced.

An unchanged source-walk digest is legal for this specific transition and MUST NOT by itself cause `WORK_CURSOR`.

This exception does not permit arbitrary no-op writer transactions.

It applies only when an authenticated accepted S2 extraction return contains at least one applicable selector whose required accounting effect is not yet durably recorded and the retained legal source cursor is stationary.

## Work-instance consumption

The durable capture work instance that produced the accepted stationary return MUST NOT remain indefinitely unconsumed merely because the source cursor did not move.

Once Core has transactionally established all of the following:

1. the exact accepted return is authenticated;
2. every applicable selector in that return has an exact durable accounting disposition;
3. every required semantic subject or other mechanically required follow-up obligation has been durably registered;
4. the stationary source-walk before/after identity has been proven;
5. the writer transaction, chain and checkpoint effects are complete;

that exact capture work instance is consumed exactly once.

Consumption means:

“this accepted capture return has been accounted for.”

It does NOT mean:

“the source-walk frontier has advanced.”

The source-walk Definition of Done remains unmet while the actual frontier remains unchanged.

## Review before another same-frontier capture

Required review obligations created by a stationary capture take precedence over another extraction attempt at the same frontier.

In particular, a C-01 degraded selector must reach its required L2S accounting under the existing semantic-review rules before Core schedules another capture generation solely because the source frontier is still stationary.

A later capture attempt MUST NOT be used to bypass or outrun the required review of the already-retained degraded candidate.

## Fresh continuation work identity

If all required accounting/review obligations from the consumed stationary capture are satisfied and the source remains legitimately incomplete at the same cursor, Core MAY derive another S2 extraction-capture work item for that exact same source-walk frontier.

That continuation MUST have a fresh durable work identity.

The already-consumed work ID MUST NOT be reused.

For `1.9.0-provisional`, extraction-capture work identity therefore includes or mechanically binds a deterministic same-frontier capture generation.

The exact serialized spelling is an implementation detail, but the identity semantics are mandatory.

It must bind at minimum:

- run identity and pinned contracts;
- source ID;
- exact current cursor ID and cursor digest;
- exact current source-walk frontier;
- deterministic capture generation;
- immediately preceding consumed same-frontier capture identity where applicable;
- cumulative same-frontier stationary-accounting basis digest;
- checkpoint and chain binding.

Generation `N+1` may be derived only from retained authenticated completion of generation `N`.

The worker, caller, skill or adapter may not choose or increment the generation.

## Capture generation is not source progress

A capture-generation increment belongs only to orchestration/work identity.

It MUST NOT be encoded as:

- a new source byte;
- a new event ordinal;
- a fabricated resume cursor;
- a source-walk event;
- source completion.

When real source-walk progress eventually occurs, the ordinary cursor/event transition governs it.

The capture generation then belongs only to the historical work/transaction trail for the old frontier.

## Mechanically distinct stationary effects

Core must prevent an infinite automatic redispatch loop in which fresh worker invocations repeatedly return the same stationary degraded content.

For each stationary capture, Core shall derive a deterministic stationary candidate-content digest for retry/progress accounting.

That digest is a mechanical digest, not a semantic-similarity judgment.

For a degraded packet candidate it MUST bind the complete Core-retained C-01 candidate content needed to distinguish the degraded proposal, including at minimum:

- source identity;
- degraded source locator;
- degradation reason;
- criterion;
- validated semantic declaration;
- complete ordered `material_use`;
- any other producer fields retained by the C-01 degraded-packet output binding.

The cross-invocation candidate-content digest MUST exclude only transport/work-instance identity that does not change candidate content, such as:

- worker invocation ID;
- durable work ID;
- capture generation;
- timestamps or journal sequence values.

It MUST NOT erase or normalize substantive candidate differences.

This digest is used only to determine whether a same-frontier retry produced a mechanically new accounting effect.

It does not merge semantic evidence or create canonical evidence.

## Repeated degraded candidate

A later same-frontier capture may validly return candidate content whose stationary candidate-content digest was already accounted at that same frontier.

Such repetition is not independent evidence and MUST NOT manufacture apparent progress.

The accepted worker return itself remains retained and authenticated.

Its repeated selector MUST receive an explicit duplicate-accounting disposition bound to:

- the new invocation and selector;
- the exact prior candidate-content digest;
- the exact previously accounted semantic subject/review basis;
- the unchanged source frontier.

Core MUST NOT create a second canonical degraded semantic fact merely to make the retry look productive.

Core MUST NOT treat the repeated candidate as a new reason to advance the cursor.

## Deterministic stationary-frontier halt

If a completed same-frontier capture generation produces:

- no legal source-walk progress;
- no newly committed exact event or packet;
- and no mechanically new candidate-accounting effect relative to retained same-frontier capture history;

then Core MUST stop automatic extraction retry at that frontier.

It shall return an explicit fail-closed stationary-frontier halt, such as:

`WORK_STATIONARY_FRONTIER`

or an equivalently registered exact Core halt token.

The halt MUST retain:

- source ID;
- exact cursor/frontier;
- last capture work identity;
- capture generation;
- accepted invocation;
- repeated candidate-content digest set;
- reason that no new source-walk or accounting effect occurred.

Repeated `/loa-aleph resume` while canonical state is unchanged MUST reproduce the same halt and MUST NOT dispatch another extractor automatically.

This is a procedural fail-closed halt, not source completion and not semantic rejection of the degraded candidate.

No fixed retry count is introduced by this clarification.

Existing budget-exhaustion policy remains separately controlling.

A run may perform successive stationary generations while each generation introduces at least one mechanically new legitimate accounting effect; the first stationary generation with neither real source progress nor a new accounting effect halts automatic continuation.

## Real progress

If a later capture generation at the same prior frontier produces actual legal source-walk progress, the ordinary source-walk rules apply.

Examples include mechanically valid progress already authorized by Core such as:

- a legal pending-event commitment;
- a valid new exact event;
- a legal cursor transition reflecting actually traversed source state.

Real progress MUST satisfy the existing source-walk/event/cursor contracts.

C-07 does not weaken them.

A real-progress capture may also contain degraded candidates; those candidates still receive their required C-01 accounting.

## Mixed output

A capture return containing both:

- actual legal source-walk progress; and
- degraded candidate selectors

is not classified as stationary merely because degraded candidates are present.

Its source-walk component follows the ordinary progressive transition.

Its degraded selectors are still exhaustively accounted under C-01.

## Recovery

Architecture-B recovery MUST distinguish:

1. accepted stationary return, accounting transaction not yet prepared;
2. accounting transaction prepared;
3. semantic subject/accounting artifacts written while source walk remains unchanged;
4. chain advanced;
5. checkpoint advanced;
6. capture work consumed;
7. required L2S outstanding;
8. required L2S completed;
9. continuation capture generation derived;
10. stationary-frontier halt persisted.

Recovery MUST prove exact authenticated before/after state.

It MUST NOT:

- duplicate a degraded subject;
- duplicate a review obligation;
- consume the same capture work twice;
- reuse a consumed work identity;
- skip an outstanding L2S review;
- increment source cursor state;
- increment an event ordinal;
- generate multiple continuation generations from one predecessor generation.

## Exactly-once boundary

This clarification permits exactly-once canonical/accounting effects for the stationary capture where mechanically proven.

It does not claim exactly-once worker/provider execution.

An unknown dispatch outcome continues to halt under the existing Architecture-B rule.

## Predecessor formats

This clarification is additive only for new cumulative `1.9.0-provisional` runs using `orchestrator-work-transitions`.

It does not reinterpret or migrate retained 1.2–1.8 runs.

Their pinned Core, checker, adapter, runtime and bundle bytes remain controlling.

The repository/default format remains `1.8.0-provisional`.

## Required tests

Implementation must add focused positive and negative tests covering at minimum:

1. valid stationary single degraded candidate is accepted for capture accounting;
2. valid stationary multi-candidate return is accepted;
3. stationary capture leaves cursor bytes exactly unchanged;
4. stationary capture leaves `next_event_ordinal` exactly unchanged;
5. pending event remains unchanged;
6. per-source completion remains blocked and correctly bound to the same frontier;
7. no PKT is fabricated;
8. no CC is fabricated;
9. every original degraded selector receives C-01 accounting;
10. required L2S subject is produced;
11. capture work is consumed after durable accounting even though cursor is stationary;
12. work consumption is explicitly distinguishable from source progress;
13. L2S work is selected before another same-frontier capture;
14. another same-frontier capture uses a fresh deterministic work identity;
15. the old consumed work identity cannot be replayed;
16. capture generation cannot be caller-supplied;
17. capture generation does not mutate source-walk state;
18. a mechanically new degraded candidate at the same frontier receives new accounting;
19. a byte-identical/mechanically identical repeated degraded candidate is recognized as repeated rather than independent evidence;
20. repeated selector receives explicit duplicate-accounting disposition;
21. repeated candidate does not generate false cursor progress;
22. a same-frontier generation with no new walk or accounting effect returns the deterministic stationary-frontier halt;
23. repeated resume after that halt does not redispatch;
24. a later legal real-progress capture follows ordinary cursor/event rules;
25. mixed progressive + degraded output preserves both real progress and degraded accounting;
26. fabricated byte-offset advance fails;
27. fabricated ordinal advance fails;
28. fabricated event commitment fails;
29. fabricated packet fails;
30. changed candidate-content digest basis fails;
31. changed work generation fails;
32. stale checkpoint fails;
33. stale chain fails;
34. consumed-work replay fails;
35. crash before accounting commit recovers deterministically;
36. crash after semantic-subject publication recovers without duplication;
37. crash after chain but before work consumption recovers;
38. crash after work consumption but before L2S selection recovers;
39. crash after L2S but before continuation-generation creation recovers;
40. predecessor-format behavior remains unchanged;
41. source/runtime parity holds;
42. installed fresh-process resume demonstrates the same behavior through the supported command/controller surface.

The historical C-07 discriminator and both installed `WORK_CURSOR` refusals MUST remain retained as evidence of the pre-clarification policy conflict.

## Continuation authority

I authorize the existing F-03 implementation branch at stopped checkpoint:

`141679591d4b4d4538c9216c18143805d1ecad19`

tree:

`a924b5b1aa209082480d496449d9abda12598b13`

to persist this clarification separately and resume the previously authorized implementation solely under the adopted F-03 design as clarified by C-01 through C-07.

Before implementation edits, verify:

- branch and remote HEAD equal `141679591d4b4d4538c9216c18143805d1ecad19`;
- tree equals `a924b5b1aa209082480d496449d9abda12598b13`;
- implementation worktree and index are clean;
- all seven retained worktree registrations remain present;
- reconstructed worktrees have not changed their retained refs;
- primary checkout remains preserved;
- release branch and stash remain preserved;
- historical C-01 through C-07 records remain exact.

Persist this C-07 clarification in a separate administration commit before implementation changes.

After C-07 reconciliation, continue the entire previously authorized F-03 implementation.

Passing the focused C-07 tests alone is not producer completion.

Outstanding obligations remain, including:

- complete installed C-05/C-06/C-07 process and recovery coverage;
- exhaustive S2 controller coverage;
- complete S3 lifecycle;
- complete S4 production-controller composition;
- legal post-S4 capability boundary;
- process-boundary tamper/replay authentication;
- writer-bypass refusal;
- full crash/recovery matrix;
- exactly-once canonical-effect proof;
- retained-runtime qualification;
- installed command/skill integration;
- predecessor compatibility;
- F-05 supported-surface refusal evidence.

This clarification does not authorize:

- provider/model calls;
- genuine native worker execution;
- live corpus execution;
- SRC-001 preparation or replay;
- closed-reference access;
- release preparation/publication;
- Loa ingestion;
- PR creation;
- merge;
- sanction;
- governance or semantic acceptance;
- F-03 closure;
- F-04 closure;
- F-05 closure;
- v1 declaration.

F-03 remains OPEN / MUST PRESERVE.

F-04 remains OPEN / MUST PRESERVE.

F-05 remains OPEN / MUST PRESERVE and bounded by F-03.

If another unadopted semantic/Core-policy conflict appears, implementation MUST stop rather than infer the rule.
```

The fenced declaration is 17972 UTF-8 bytes with SHA-256 `e3af79fbb6982f6ae291f6428adaffebd51df5cd5a726f4c6fa71d1fcd6ea2ea` (excluding fence/newline framing). It was recovered exactly from the current HUMAN message and checked before persistence.

## Exact retained historical record inventory

| Path | Git blob | SHA-256 | Bytes |
|---|---|---|---|
| `calibration/src-001/core-design-basis/ADOPTED-f03-degraded-packet-l2s-binding-clarification-20260917.md` | `7c6c665af3988f588d637a7dc8b6d162819d7ab8` | `01d50b0795c029f1cced0e5d81cc988e4f3a55d240da78a542d0ad18f0c14222` | 6797 |
| `calibration/src-001/core-design-basis/ADOPTED-f03-indeterminate-claim-nonaffirmative-binding-clarification-20260918.md` | `0415f33086192103052f175c3fab9125cf483371` | `4188d2c22e781ff1237cda4f098575696d66dc6a0b5a69b15cfadf93ff00ed02` | 22000 |
| `calibration/src-001/core-design-basis/ADOPTED-f03-pending-extraction-event-commitment-clarification-20260917.md` | `4d8187dfb2475a2ab4641bfa6918b07945ff8484` | `ccc6b247b645c8bac359f841c0073c86843502d60c2934cba447a88f96f73f1e` | 10152 |
| `calibration/src-001/core-design-basis/ADOPTED-f03-post-s2-packet-widening-clarification-20260918.md` | `ad54923e02350e7b47326bc4ce3fc8278e6117e9` | `f23913cddfa2043fe8cee836cc3f5ee29a2e0837324501eec79c6031d3619ad4` | 24866 |
| `calibration/src-001/core-design-basis/ADOPTED-f03-production-reachability-design-20260917.md` | `465af089f8f23b28b2a4339047c76a8a4d143c34` | `1ea635dc2bc0d5693bac339f39bb00e0b797bab8b95e1228d142d1db484d4195` | 2005 |
| `calibration/src-001/core-design-basis/ADOPTED-f03-s3-widened-packet-relation-ownership-clarification-20260919.md` | `c92907667335809e2063145da87f06f15226536f` | `7067ed53abbf7f5bec7b49f938acd10857da199e1a0b3aaac7e0a2552fe7d744` | 25975 |
| `calibration/src-001/core-design-basis/ADOPTED-f03-source-walk-completion-current-state-clarification-20260917.md` | `f0dce703ae9791bd8285f3ed2d539e59c4c41c97` | `e6987f6143e823cda0cb5a3211c109cca9bdd5ea8af464b0b61447900802db35` | 8550 |
| `calibration/src-001/core-design-basis/AUTHORIZED-f03-production-reachability-implementation-20260917.md` | `df61a2f4f240bc812ebbc1a1e6196da7d92345b9` | `a1d3e6246c1eef9c8a001b3a43a41e1d40e77dbeb3b21ae1859948e687641ef5` | 6229 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c03-stopped-checkpoint-20260917.json` | `71d1525695e1a7b83d0013bde605904f97856594` | `2ec8724f121be3fe408c8d37f5cde016fcfcf7e7ea42a9a93c74ddab63911b62` | 344856 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c04-stopped-checkpoint-20260917.json` | `5730f8bdb58ef5140ba096e267885ec930105379` | `54b7092fd8c8621b2ecec19bbe4d207d61bbeafefd0f8f393a38a33882f2329a` | 1153117 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c05-installed-rendering-repair-progress-20260926.json` | `a437bf2253a55f06c2a720b25e093cf697bcb61b` | `e7411962d1284db8c9868f1a84fba204844116ec11ea64a5d9e6672165d278e9` | 15557635 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c05-stopped-checkpoint-20260918.json` | `ab3f0496c45a701ff5ffa2bf4658fd24e9104bb9` | `05c0a48175b843502fea9933164a1d4199095495218078529de954a2dfba930c` | 7317851 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c06-continuation-progress-20260926.json` | `a13067e6103e49265f48ab05d78c4a03678a2d88` | `1a7c2cfc918926847329f757e816a59af7d4b1b01de00637d256ada5025bedee` | 1705491 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c06-stopped-checkpoint-20260919.json` | `5b3fc8e3ac723dfb717074bd6ad48382b040572a` | `064a9fe18483b5d0d746a00f2fed781a45ff7b3c00feab8f2ee1d99322ac9b35` | 1447510 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c07-stopped-checkpoint-20260926.json` | `b2f6ca144e8b46b47491a3eed1176886a4feed8a` | `943d34d80eadd1caa6babfd753fa20e3f0f886d8f54ca039c09af579f10dd0ff` | 24561016 |
| `calibration/src-001/core-design-basis/PROPOSED-f03-accepted-worker-return-production-reachability-design-20260917.md` | `b5fd008ff2aab18cb632c248cb8259735d053714` | `6144bef6f06ee55e8507d7019c13658b0404a0bafe3f8aebe09f6a18a80f1524` | 94757 |
| `calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-core-contract-conflict-20260917.md` | `893bcc16f1dde9793b7a367ad4d4c5cba96930bb` | `4f052dc4648fc963bd62b129cad47a19c25f2a2e7c1bb531dc65df31f27d562a` | 15918 |
| `calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-indeterminate-claim-binding-conflict-20260917.md` | `5a107ba93ccd7ae46a483101f24b7a6adc733fac` | `82a0e059b52e5d175c751e720f0e24dee4721d5ca008311ccfecd73f2d722acf` | 37494 |
| `calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-s3-packet-relation-ownership-conflict-20260919.md` | `115927cd8db35a22ee7f9322a6dfaee2cf24df64` | `4aaba38fef84b6e32ced22939a3b40d5b55bb88e343ceff46a76005263b63db5` | 38860 |
| `calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-s3-packet-widening-conflict-20260918.md` | `fda1af9e38920f8d3ef85de9dc8c3255d61f32b3` | `5a71cfdd727b38d6575718aa3b290fc694c064a672404f88fa9506224c75ac66` | 32263 |
| `calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-shared-position-event-continuation-conflict-20260917.md` | `321692735b31b33e5d343848d171041260065c88` | `11e34ce1f2e1484913a8dafa37e07226edaa8f9014c8f611eeac91f1ee39600b` | 27677 |
| `calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-source-walk-transition-conflict-20260917.md` | `1bf02d7de3cf458358e7fdefead8267f33580ee9` | `b3aef9f0f7c8a514095fb191e041ec07a6bd15d894d0cd7ee6ac34859edb5c84` | 24015 |
| `calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-stationary-degraded-capture-conflict-20260926.md` | `4328fd8d3d49c8fe99b704ffcc7f504c1dfb6fbe` | `368e19539c284fa029898a6e936c0fe563bd3919577d75e218012b2706651700` | 32153 |
| `calibration/src-001/core-design-basis/f03-continuation-structural-checks-20260917.json` | `7f3de0e5e88cbf7498d67c9d5d27581dc2d64389` | `3e63e45551928492b50b9ce379d0e733a7b2e1073f0b5f114b85d4885a78a3ea` | 197140 |
| `calibration/src-001/core-design-basis/f03-degraded-candidate-binding-conflict-20260917.json` | `36f2d29c7ba36db61912d8ace9cac22f6b7fd70a` | `437f1dadebeed20dcbc27a2c361c1426f6a983026506cae3235e765696fe753a` | 794 |
| `calibration/src-001/core-design-basis/f03-source-walk-transition-conflict-20260917.json` | `8d9aef8ebcb32775385d081e772a3bf0b4122a90` | `a4a4879332a0ac20baee42ca49719caf8b2eaa974cc0517b4a74b63bb3c7869e` | 8415 |

## Continuation scope

This administration commit contains only this declaration record and its required repository-administration inventory entry. Implementation follows in subsequent commits under the adopted F-03 design and C-01 through C-07. This record does not authorize a provider/model call, genuine native worker, live corpus, SRC-001 preparation/replay, closed-reference access, release preparation/publication, Loa ingestion, PR, merge, sanction, governance/semantic acceptance, finding closure or v1 declaration.

Default/current run format remains `1.8.0-provisional`; cumulative implementation format remains `1.9.0-provisional` with `orchestrator-work-transitions`; adapter protocol remains `1.0.0-provisional`. No old run is migrated or reinterpreted. C-03's repaired frozen-source/K2.14 identity semantics remain strict. F-04 does not expand into portability work. F-05 refusal evidence remains bounded by F-03.

F-03: OPEN / MUST PRESERVE. F-04: OPEN / MUST PRESERVE. F-05: OPEN / MUST PRESERVE and bounded by F-03. Passing focused C-07 tests is not producer completion. Complete supported fixture/simulated S0-S4 reachability and all remaining obligations are required before a final implementation reconciliation; any new unadopted semantic/Core-policy decision requires a distinct stop.

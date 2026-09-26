# Adopted F-03 C-09 S4-entry atomic bootstrap clarification

Date: 2026-09-26

Status: ADOPTED — HUMAN CORE CONTRACT CLARIFICATION / IMPLEMENTATION CONTINUATION AUTHORITY

This separate administration record persists the controlling HUMAN declaration below before any implementation change. It supplements the adopted F-03 design and C-01 through C-08, preserves the stopped C-09 chronology, and authorizes only the bounded continuation stated by the HUMAN. F-03, F-04 and F-05 remain OPEN / MUST PRESERVE.

## Verbatim HUMAN declaration

The following declaration is 20299 UTF-8 bytes, SHA-256 `5d77c8e2a06f769cdcd9455e620190aa6026c1b65852b221bd841dbd1508fb66`. The fenced content is the exact user message, excluding the framing fence and its separator newline.

````text
Resume the previously authorized F-03 production-reachability implementation from the exact retained C-09 stopped checkpoint.

Repository:

`0xHoneyJar/loa-aleph`

Branch:

`agent/f03-production-reachability-implementation-20260917`

Required starting HEAD:

`1ffb8d5d264b5857936895194ee042816feafcbe`

Required starting tree:

`5bf556b48a364a650762ad32d18c08731668f243`

This checkpoint is pushed and local/remote equality was previously reported and independently verified.

Do not restart from main.

Do not reset, rebase, amend, squash, cherry-pick, force-push, rewrite history, or replace the cumulative C-01 through C-09 chronology.

# HUMAN C-09 clarification — controlling authority

I clarify the adopted F-03 accepted-worker-return production-reachability design for cumulative run format `1.9.0-provisional` and capability `orchestrator-work-transitions` as follows.

The lawful transition from closed S3 into open S4 is one atomic Core-authorized bootstrap transaction.

There is no valid committed cumulative-1.9 state in which:

- S4 entry has become canonical; and
- `ledgers/duplicate-review.md` is absent.

Likewise, the duplicate-review ledger remains forbidden in canonical state before the S4-entry transaction begins.

Therefore the S3-exit/S4-entry transaction MUST atomically commit the existing S3 seal/stage-entry effects together with initialization of the exact canonical empty duplicate-review ledger required by K2.20.

The transaction's authenticated actual BEFORE state is the legal pre-entry S3 state.

The transaction's authenticated canonical AFTER state is the legal open-S4 state containing all mandatory stage-entry effects, including the exact initialized duplicate ledger.

No missing-ledger S4 intermediate state is canonical, selectable for ordinary work, or eligible for ordinary full verification.

## Exact bootstrap effects

For cumulative `1.9.0-provisional` with `orchestrator-work-transitions`, the successful S3→S4 bootstrap transaction includes exactly the existing stage-transition effects plus the required duplicate-review initialization.

At minimum, as required by the current contracts, this means the transaction commits together:

- the existing S3 seal artifact/effect;
- the existing run-log S3-exit/S4-entry event;
- any already-adopted control/checkpoint state mechanically belonging to that stage transition;
- `ledgers/duplicate-review.md` initialized using the exact existing canonical empty duplicate-ledger constructor.

The duplicate ledger is the existing six-table Slice-8 structure with:

- discoveries empty;
- proposals empty;
- assignments empty;
- results empty;
- decisions empty;
- effects empty.

No synthetic duplicate candidate, proposal, review, decision or effect is created merely because S4 begins.

Zero duplicate candidates still require the initialized ledger.

## No generic write-window relaxation

This clarification does NOT broaden the ordinary S3 semantic write window.

It does NOT broadly permit duplicate writes before S4.

It does NOT broadly permit stage-transition writes inside ordinary duplicate operations.

It does NOT weaken `assertDuplicateWindow`, `SEM_WINDOW`, `DUP_WINDOW`, K2.20, or full-run validation for ordinary operations.

Instead, Core shall define one dedicated S3→S4 bootstrap composition whose exact allowed canonical payload is the union of the already-authorized stage-entry effects and exact empty duplicate-ledger initialization.

No unrelated path may be added to that union.

A caller, worker, parent model or adapter cannot opt arbitrary writes into the bootstrap transaction.

## Existing validators and projected entry state

The actual authenticated BEFORE image remains the real S3 filesystem/model state.

Core MAY derive an ephemeral deterministic projected-entry model solely inside the bootstrap planner in order to apply existing S4 duplicate-window and duplicate-plan predicates.

That projected model represents only the exact stage-entry effects Core has already derived from the authenticated S3 BEFORE state.

It is not:

- a canonical committed state;
- an authenticated filesystem before-image;
- a recovery checkpoint;
- a state ordinary work selection may observe;
- authority to omit the duplicate ledger.

If existing `planDuplicateWrite` or `assertDuplicateWindow` is reused internally, Core may evaluate the exact empty-ledger initialization against this typed projected S4-entry model.

The writer MUST still authenticate the real S3 BEFORE files and the exact final S4 AFTER files.

Do not pass a fabricated S4 filesystem state off as the actual BEFORE image.

Do not run ordinary full-run verification against the projected intermediate model as though it were canonical.

## Dedicated bootstrap planner

Implement a dedicated Core planner or equivalent closed composition for this boundary, such as:

`planS3ToS4Bootstrap(...)`

The exact function name is implementation detail.

It MUST mechanically derive its result from:

- exact current run pins;
- current authenticated S3 state;
- exact S3 seal prerequisites;
- current chain/checkpoint;
- the durable `stage.seal-S3` work identity;
- existing stage-transition contracts;
- existing duplicate-ledger constructor;
- existing duplicate structural validators.

The caller MUST NOT provide arbitrary:

- duplicate-ledger bytes;
- stage-entry run-log bytes;
- destination paths;
- AFTER images;
- projected S4 state;
- write allowlist.

Core derives all of them.

## `stage.seal-S3` work ownership

For cumulative 1.9 Architecture-B production execution, the durable `stage.seal-S3` work is completed only by successful completion of this full bootstrap transaction.

It MUST NOT be consumed after writing only the S3 seal or S4-entry event.

Successful work consumption means:

“S3 exit and valid S4 entry, including mandatory duplicate initialization, were committed.”

There is no separate ordinary `s4.initialize` work gap between S3 and S4.

The implementation MAY retain an existing duplicate initialization helper or operation as an internal subplan constructor, fixture helper, predecessor-format behavior, or other already-legal use.

But for the cumulative-1.9 supported production path, ordinary selection MUST NOT depend on first committing an invalid S4-without-ledger state and then selecting `s4.initialize`.

If a canonical cumulative-1.9 run claims S4 entry while its duplicate ledger is absent and there is no authenticated recoverable bootstrap transaction, the run is invalid and MUST fail closed.

## Final AFTER verification

Before the bootstrap is considered committed and before the stage-seal work is consumed, Core MUST verify the exact final AFTER state.

The AFTER state must satisfy together:

- all S3 closure/seal predicates;
- exact S4 entry;
- duplicate-review capability compatibility;
- exact canonical duplicate-ledger format;
- required ledger presence;
- open-S4 duplicate window;
- no C1 closure yet;
- all existing run-control and structural predicates applicable at this boundary.

`validateDuplicateRun` remains strict:

- pre-S4 canonical state: duplicate artifacts absent;
- canonical S4 state: duplicate ledger present;
- post-C1: existing closure restrictions unchanged.

No permanent exception is created for missing-ledger S4.

## Journal and crash recovery

The bootstrap must use the Architecture-B journal/transaction mechanism as one logical canonical transaction.

The journal MUST bind the exact real BEFORE and exact final AFTER for every canonical file touched.

Recovery occurs before ordinary full verification and before ordinary new-work selection whenever an authenticated prepared bootstrap transaction exists.

A crash may physically leave some bootstrap files at BEFORE and some at AFTER.

Such a physical partial write is not a valid canonical intermediate state.

It is only a recoverable transaction state when an exact authenticated bootstrap journal proves the expected before/after bytes.

Recovery MUST deterministically restore or complete the transaction according to the existing writer recovery contract so that the run reaches exactly:

- authenticated BEFORE; or
- authenticated AFTER.

No third state is accepted.

If files are partially transitioned but no authentic matching bootstrap journal exists, fail closed.

## Recovery ordering

The intended logical order remains:

authenticated S3 BEFORE
→ bootstrap intent/prepared journal
→ canonical bootstrap file writes
→ chain
→ checkpoint
→ durable work consumption
→ ordinary next-work selection.

Work consumption is last among the bootstrap's semantic completion effects.

A crash MUST NOT leave a consumed `stage.seal-S3` work item whose canonical bootstrap effects are incomplete.

Repeated resume after successful bootstrap MUST NOT:

- recreate the duplicate ledger;
- append another S4-entry event;
- duplicate the S3 seal;
- advance chain/checkpoint twice;
- consume the work again;
- create a separate `s4.initialize` work item.

## No retroactive blessing of retained invalid fixtures

The previously retained installed C-09 fixture in which S4 entry was committed, the S3-seal work consumed, and the duplicate ledger remained absent is historical conflict evidence.

Do NOT rewrite, migrate, repair in place, or reclassify that retained fixture as a valid post-clarification AFTER state.

Its existing `DUP_FORMAT` refusal remains evidence of the old non-atomic implementation.

Post-clarification positive product evidence must come from a fresh fixture/run path executing the corrected bootstrap transaction.

Historical C-09 discriminator evidence MUST remain unchanged.

## Duplicate ledger bytes

Use the existing Core duplicate-ledger constructor and canonical serialization.

Do not hand-author a second empty-ledger template.

The initialized bytes must be exactly those produced by the controlling existing Core constructor for:

`emptyDuplicateLedger()`

followed by canonical duplicate-ledger serialization.

The bootstrap planner must verify that the proposed initialized ledger is exactly this canonical empty form.

A nonempty duplicate ledger at bootstrap is forbidden.

A caller-supplied alternate empty representation is forbidden.

## Stage-entry semantics

S4 entry occurs atomically with duplicate-ledger initialization.

The run-log/stage state must therefore never semantically assert:

“S4 is open”

while the same committed transaction says:

“duplicate review is not initialized.”

The reverse is also forbidden:

the duplicate ledger may not become canonical while the run is still canonically pre-S4.

These two effects are one barrier transition.

## Ordinary S4 work begins afterward

Only after the final bootstrap AFTER state is committed and verified may Core select ordinary S4 work.

The first ordinary S4 work is determined from the valid open-S4 state containing the initialized empty duplicate ledger.

Normal later work may then populate:

- discovery;
- independent sweep;
- proposals;
- assignments;
- results;
- decisions;
- effects;

under the existing duplicate-review contract.

This clarification does not change their semantics.

## C1/C2/C3 remain unchanged

C-09 changes only S3→S4 entry transaction composition.

It does not alter:

- duplicate/overlap semantic judgment;
- L3 review;
- duplicate admission;
- merge/successor semantics;
- relation reconciliation;
- C1 closure;
- duplicate closure hashing;
- C2 ambiguity lifecycle;
- C3 exit;
- the S5 capability boundary.

The initialized ledger remains mutable only during the already-authorized open-S4 window.

At C1 the existing duplicate closure rules remain controlling.

## Predecessor compatibility

This clarification is additive only for new cumulative `1.9.0-provisional` runs using `orchestrator-work-transitions`.

It does not migrate or reinterpret retained 1.2–1.8 runs.

Their pinned Core, checker, adapter, runtime and bundle remain controlling.

Repository/default run format remains `1.8.0-provisional`.

Adapter protocol remains `1.0.0-provisional`.

## Required focused tests

Implementation must add positive and negative coverage proving at minimum:

1. legal pre-entry S3 has no duplicate ledger;
2. pre-S4 duplicate ledger remains rejected;
3. bootstrap cannot begin unless all existing S3-seal prerequisites pass;
4. bootstrap derives the exact S3 seal;
5. bootstrap derives the exact S4-entry event;
6. bootstrap derives exactly the canonical empty duplicate ledger;
7. zero-candidate S4 entry still initializes the ledger;
8. nonempty bootstrap duplicate ledger is rejected;
9. caller-authored duplicate bytes are rejected;
10. caller-authored stage-entry bytes are rejected;
11. unrelated extra write in bootstrap is rejected;
12. ordinary S3 semantic plan still cannot write the duplicate ledger;
13. ordinary duplicate plan still cannot write stage-transition state;
14. ordinary duplicate write before S4 remains rejected;
15. final AFTER verifies as open S4 with duplicate ledger present;
16. no canonical S4-without-ledger state is exposed to ordinary work selection;
17. no duplicate-ledger-before-S4 state is exposed;
18. no independent production `s4.initialize` work is required after successful bootstrap;
19. work selection immediately after bootstrap reads the initialized S4 ledger;
20. historical C-09 missing-ledger fixture remains rejected;
21. historical C-09 discriminator remains unchanged;
22. projected entry model cannot be supplied by caller;
23. projected entry model cannot be persisted as canonical state;
24. projected entry model is derived only from authenticated S3 BEFORE;
25. altered S3 seal invalidates the composite plan;
26. altered run-log entry invalidates the composite plan;
27. altered duplicate-ledger bytes invalidate the composite plan;
28. stale work ID fails;
29. stale checkpoint fails;
30. stale chain fails;
31. wrong run fails;
32. wrong stage fails;
33. replayed consumed stage-seal work fails;
34. crash before bootstrap journal preparation recovers as BEFORE;
35. crash after journal preparation but before canonical writes recovers deterministically;
36. crash after only the S3 seal write recovers deterministically;
37. crash after only the S4-entry/run-log write recovers deterministically;
38. crash after only duplicate-ledger creation recovers deterministically;
39. every other relevant partial subset of bootstrap canonical writes recovers deterministically;
40. crash after all canonical bytes but before chain recovers;
41. crash after chain but before checkpoint recovers;
42. crash after checkpoint but before work consumption recovers;
43. repeated resume after successful bootstrap is idempotent;
44. missing/invalid journal plus partial S4 state fails closed;
45. duplicate initialization cannot occur twice;
46. S4 entry event cannot occur twice;
47. source/runtime parity holds;
48. generated runtime parity holds;
49. predecessor formats retain pinned behavior;
50. fresh installed-process execution proves S3→S4 entry reaches a fully valid open-S4 state without an observable invalid canonical intermediate.

## Full verification ordering

For this boundary, `resume` MUST:

1. recover any authenticated prepared bootstrap transaction first;
2. verify the resulting canonical state;
3. only then perform ordinary first-unmet-work selection.

Do not attempt to solve C-09 by disabling full verification before work selection globally.

The rule is recovery-before-verification for authenticated prepared transactions, followed by strict verification, followed by selection.

A bare invalid S4-without-ledger state with no matching recoverable journal remains a hard failure.

## C-08 installed control

After C-09 is reconciled, rerun the previously blocked installed fresh-process C-08/C2 progression using a fresh corrected fixture path.

Do not count the synthetic C2/Class-C controls as that proof.

The corrected installed progression must cross the new atomic S3→S4 bootstrap before exercising C2.

## Continuation authority

I authorize the existing F-03 implementation branch at stopped checkpoint:

`1ffb8d5d264b5857936895194ee042816feafcbe`

tree:

`5bf556b48a364a650762ad32d18c08731668f243`

to persist this C-09 clarification separately and resume the previously authorized F-03 implementation solely under the adopted F-03 design as clarified by C-01 through C-09.

Before implementation edits, verify:

- branch and remote HEAD equal `1ffb8d5d264b5857936895194ee042816feafcbe`;
- tree equals `5bf556b48a364a650762ad32d18c08731668f243`;
- implementation worktree and index are clean;
- all seven worktree registrations remain present;
- primary checkout remains preserved;
- `agent/loa-adapter-release` remains preserved;
- stash remains preserved;
- all retained C-01 through C-09 authority/stop/evidence records remain exact.

Persist this HUMAN C-09 clarification as a separate administration commit before any implementation change.

Preferred record name:

`calibration/src-001/core-design-basis/ADOPTED-f03-c09-s4-entry-atomic-bootstrap-clarification-20260926.md`

Status:

`ADOPTED — HUMAN CORE CONTRACT CLARIFICATION / IMPLEMENTATION CONTINUATION AUTHORITY`

Commit the authority record separately.

Then implement C-09.

A normal non-force push is permitted under the existing auditable-development workflow.

# Continue beyond C-09

Passing C-09 focused tests alone is not producer completion.

After the atomic S4-entry bootstrap works, continue all remaining previously authorized F-03 implementation work without stopping merely because C-09 is green.

Outstanding obligations include:

- fresh installed S3→S4 bootstrap proof;
- previously blocked installed C-08/C2 control;
- exhaustive S2 production-controller coverage;
- complete S3 lifecycle and recovery qualification;
- complete S4 discovery, duplicate/overlap, L3, successor, relation, C1, C2 and C3 production composition;
- legal post-S4 unsupported-capability boundary;
- complete process-boundary authentication/tamper/replay matrix;
- writer-bypass refusal;
- full Architecture-B recovery matrix;
- exactly-once canonical-effect verification;
- retained-runtime routing qualification;
- installed `/loa-aleph` command/skill integration;
- predecessor compatibility qualification;
- F-05 supported-surface refusal evidence;
- final conformance/mutation/install/package/determinism qualification.

Do not infer missing semantic policy merely to complete those obligations.

If another unadopted Core semantic or transaction-policy decision appears, STOP and retain it as C-10 or later.

# Status boundaries

This C-09 clarification does not authorize:

- provider/model calls;
- genuine native worker execution;
- live research corpus execution;
- SRC-001 blind replay;
- closed-reference access;
- release preparation;
- release publication;
- Loa ingestion;
- PR creation;
- merge;
- sanction;
- governance acceptance;
- semantic acceptance;
- F-03 closure;
- F-04 closure;
- F-05 closure;
- v1 declaration.

F-03 remains OPEN / MUST PRESERVE.

F-04 remains OPEN / MUST PRESERVE.

F-05 remains OPEN / MUST PRESERVE and bounded by F-03.

# Stop discipline

If another unadopted semantic/Core/transaction rule is required:

STOP.

Do not broaden an existing write window merely to make the run pass.

Do not create a temporary invalid canonical state and rely on later work to repair it.

Retain exact reproduction and machine evidence.

End the blocked report exactly:

`F-03 PRODUCTION REACHABILITY IMPLEMENTATION STOPPED — NEW HUMAN CORE DECISION REQUIRED`

# Producer-complete threshold remains unchanged

Producer completion requires complete fixture/simulated production reachability through S0–S4 via the actual supported `/loa-aleph` controller surface, with process restart/reauthentication, Core-derived plans, LedgerWriter transactions, chain/checkpoint, consumption, recovery and legal next work/gate/halt for all required work families.

It does not mean:

- live native execution;
- semantic validation;
- independent audit acceptance;
- sanction;
- release;
- F-03 closure;
- F-04 closure;
- F-05 closure;
- v1.

If structurally producer-complete, end exactly:

`F-03 PRODUCTION REACHABILITY IMPLEMENTATION — PRODUCER COMPLETE — F-03 REMAINS OPEN PENDING LIVE NATIVE EVIDENCE AND INDEPENDENT AUDIT`
````

## Verified pre-edit identity and preservation receipt

```json
{
  "result": "PASS",
  "time": "2026-09-26T19:51:18.062739+00:00",
  "head": "1ffb8d5d264b5857936895194ee042816feafcbe",
  "tree": "5bf556b48a364a650762ad32d18c08731668f243",
  "parent": "9080f272eb4ed5e3c6086bc390db0818d9087007",
  "branch": "refs/heads/agent/f03-production-reachability-implementation-20260917",
  "remote_head_verified": "1ffb8d5d264b5857936895194ee042816feafcbe",
  "remote_verification": "successful read-only git ls-remote after sandbox DNS refusal; no repository edits before gate",
  "primary": {
    "head": "a568f499db6707e4787ee3da969dbd6193b04944",
    "tree": "a72612678f8cbdc4ae2951eb5b26f1b172c71847",
    "branch": "refs/heads/agent/src-001-blind-replay-preparation-20260914",
    "status": "",
    "index_sha256": "25b75457cdf1b9faace761383199531fca4b82215d7794c3d8deae4df7d3a4be"
  },
  "registrations": [
    {
      "registration": "loa-aleph-f03-design-20260917",
      "path": "/tmp/loa-aleph-f03-design-20260917",
      "head": "484fa227e1ed23c81dc4cf37987aa0be16eded8f",
      "branch": "refs/heads/agent/f03-production-reachability-design-20260917",
      "index_sha256": "572ca9ba66bb4a17effb8929dc78262e5b1bcac9ce7e621e9956b0a8dbd7db9c"
    },
    {
      "registration": "loa-aleph-f03-implementation-20260917",
      "path": "/tmp/loa-aleph-f03-implementation-20260917",
      "head": "1ffb8d5d264b5857936895194ee042816feafcbe",
      "branch": "refs/heads/agent/f03-production-reachability-implementation-20260917",
      "index_sha256": "f60567ae3a0e67b66928198c976ed9bfc749221bcd9ab4b2b8b68ff7d92a1070"
    },
    {
      "registration": "loa-aleph-s5a2-final-17e1d1a.lkyTtl",
      "path": "/tmp/loa-aleph-s5a2-final-17e1d1a.lkyTtl",
      "head": "17e1d1acda17a38d72214af5022b8145220f96d8",
      "branch": "",
      "index_sha256": "9cd4974d5a0941516da138e952bdd934f109b7ddf0d7754f3a21b056024da712"
    },
    {
      "registration": "loa-aleph-s5a2-repair-20260908.EoH8Ki",
      "path": "/tmp/loa-aleph-s5a2-repair-20260908.EoH8Ki",
      "head": "17e1d1acda17a38d72214af5022b8145220f96d8",
      "branch": "",
      "index_sha256": "1fd5b6de2b33e9c9933fe505e5bca967e3c8472d66af7ffb21f2488afe789580"
    },
    {
      "registration": "loa-aleph-s7-retained-adoption-094a7ce",
      "path": "/tmp/loa-aleph-s7-retained-adoption-094a7ce",
      "head": "094a7ce3220631c8d4ee4c179e79b9b4529b6681",
      "branch": "",
      "index_sha256": "318f494616b0fb74a7aa5d2f98b8b4babe2c0a77f827f0cbbe0647ca84b78033"
    },
    {
      "registration": "slice6-pre16-authority",
      "path": "/tmp/slice6-pre16-authority",
      "head": "e45a1d9b1cafc5ef3b6a1fb46a61a8a395d45770",
      "branch": "",
      "index_sha256": "3ed8505503d359e702f51b888b4be5f97de361f603965e5052d33a85786a50ca"
    }
  ],
  "worktree_count": 7,
  "release": "b9e2db742a087b8ae659ec39e476ed5e240cfa1f",
  "stash": "stash@{0} e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8 On agent/loa-adapter-release: preserve agent/loa-adapter-release before Slice 6\n",
  "historical_records": [
    {
      "path": "calibration/src-001/core-design-basis/ADOPTED-f03-c2-frozen-source-identity-clarification-20260926.md",
      "blob": "ae271cb001126dbb3c18ed41f4f836e41badd9a6",
      "sha256": "c0759fb30adef47b9927b3b1f3e0e93ea603c149770a7f6661679c4493a73edb",
      "size": 43122
    },
    {
      "path": "calibration/src-001/core-design-basis/ADOPTED-f03-degraded-packet-l2s-binding-clarification-20260917.md",
      "blob": "7c6c665af3988f588d637a7dc8b6d162819d7ab8",
      "sha256": "01d50b0795c029f1cced0e5d81cc988e4f3a55d240da78a542d0ad18f0c14222",
      "size": 6797
    },
    {
      "path": "calibration/src-001/core-design-basis/ADOPTED-f03-indeterminate-claim-nonaffirmative-binding-clarification-20260918.md",
      "blob": "0415f33086192103052f175c3fab9125cf483371",
      "sha256": "4188d2c22e781ff1237cda4f098575696d66dc6a0b5a69b15cfadf93ff00ed02",
      "size": 22000
    },
    {
      "path": "calibration/src-001/core-design-basis/ADOPTED-f03-pending-extraction-event-commitment-clarification-20260917.md",
      "blob": "4d8187dfb2475a2ab4641bfa6918b07945ff8484",
      "sha256": "ccc6b247b645c8bac359f841c0073c86843502d60c2934cba447a88f96f73f1e",
      "size": 10152
    },
    {
      "path": "calibration/src-001/core-design-basis/ADOPTED-f03-post-s2-packet-widening-clarification-20260918.md",
      "blob": "ad54923e02350e7b47326bc4ce3fc8278e6117e9",
      "sha256": "f23913cddfa2043fe8cee836cc3f5ee29a2e0837324501eec79c6031d3619ad4",
      "size": 24866
    },
    {
      "path": "calibration/src-001/core-design-basis/ADOPTED-f03-production-reachability-design-20260917.md",
      "blob": "465af089f8f23b28b2a4339047c76a8a4d143c34",
      "sha256": "1ea635dc2bc0d5693bac339f39bb00e0b797bab8b95e1228d142d1db484d4195",
      "size": 2005
    },
    {
      "path": "calibration/src-001/core-design-basis/ADOPTED-f03-s3-widened-packet-relation-ownership-clarification-20260919.md",
      "blob": "c92907667335809e2063145da87f06f15226536f",
      "sha256": "7067ed53abbf7f5bec7b49f938acd10857da199e1a0b3aaac7e0a2552fe7d744",
      "size": 25975
    },
    {
      "path": "calibration/src-001/core-design-basis/ADOPTED-f03-source-walk-completion-current-state-clarification-20260917.md",
      "blob": "f0dce703ae9791bd8285f3ed2d539e59c4c41c97",
      "sha256": "e6987f6143e823cda0cb5a3211c109cca9bdd5ea8af464b0b61447900802db35",
      "size": 8550
    },
    {
      "path": "calibration/src-001/core-design-basis/ADOPTED-f03-stationary-degraded-capture-accounting-clarification-20260926.md",
      "blob": "5ec99766ce3287fbd89b46a1b5ce81e13bef67e9",
      "sha256": "02f2eb9c4fc088be2b59344d064d034f787aeb6713658c9ca305999ba554b4f1",
      "size": 30284
    },
    {
      "path": "calibration/src-001/core-design-basis/AUTHORIZED-f03-production-reachability-implementation-20260917.md",
      "blob": "df61a2f4f240bc812ebbc1a1e6196da7d92345b9",
      "sha256": "a1d3e6246c1eef9c8a001b3a43a41e1d40e77dbeb3b21ae1859948e687641ef5",
      "size": 6229
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c03-stopped-checkpoint-20260917.json",
      "blob": "71d1525695e1a7b83d0013bde605904f97856594",
      "sha256": "2ec8724f121be3fe408c8d37f5cde016fcfcf7e7ea42a9a93c74ddab63911b62",
      "size": 344856
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c04-stopped-checkpoint-20260917.json",
      "blob": "5730f8bdb58ef5140ba096e267885ec930105379",
      "sha256": "54b7092fd8c8621b2ecec19bbe4d207d61bbeafefd0f8f393a38a33882f2329a",
      "size": 1153117
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c05-installed-rendering-repair-progress-20260926.json",
      "blob": "a437bf2253a55f06c2a720b25e093cf697bcb61b",
      "sha256": "e7411962d1284db8c9868f1a84fba204844116ec11ea64a5d9e6672165d278e9",
      "size": 15557635
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c05-stopped-checkpoint-20260918.json",
      "blob": "ab3f0496c45a701ff5ffa2bf4658fd24e9104bb9",
      "sha256": "05c0a48175b843502fea9933164a1d4199095495218078529de954a2dfba930c",
      "size": 7317851
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c06-continuation-progress-20260926.json",
      "blob": "a13067e6103e49265f48ab05d78c4a03678a2d88",
      "sha256": "1a7c2cfc918926847329f757e816a59af7d4b1b01de00637d256ada5025bedee",
      "size": 1705491
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c06-stopped-checkpoint-20260919.json",
      "blob": "5b3fc8e3ac723dfb717074bd6ad48382b040572a",
      "sha256": "064a9fe18483b5d0d746a00f2fed781a45ff7b3c00feab8f2ee1d99322ac9b35",
      "size": 1447510
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c07-accounting-implementation-progress-20260926.json",
      "blob": "91f165469bfd3743009311aa8c366b35b8142979",
      "sha256": "ffa3cabf6fa0094952313f110b6daeb1ca29433e449568fc01c836e8a4c0f4c1",
      "size": 229402
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c07-installed-recovery-and-s4-progress-20260926.json",
      "blob": "7cd244778f3feca90b589dcdd0cf1a796c6588ed",
      "sha256": "71c3ba9420feb4fcfa863791f880bcef1d138e01a047434426d40ffd6a900673",
      "size": 26847577
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c07-stopped-checkpoint-20260926.json",
      "blob": "b2f6ca144e8b46b47491a3eed1176886a4feed8a",
      "sha256": "943d34d80eadd1caa6babfd753fa20e3f0f886d8f54ca039c09af579f10dd0ff",
      "size": 24561016
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c07-worker-request-byte-binding-repair-20260926.json",
      "blob": "1b163264ceff43da5accc2f351060b4bd2c7a091",
      "sha256": "4502c6d96cadf918bc45f9836fab91e03a5088592ec39546a2ad55b600a3a3cb",
      "size": 6000053
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c08-c09-fixture-snapshots-20260926.json",
      "blob": "5df689cd41e7d58137e518ebcbb9f4a5e5f535c5",
      "sha256": "3122ac1584bed1122c8d49a374b8951a2e7158e5fa9d6b6226a8778cae5eff68",
      "size": 17325273
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c08-continuation-and-c09-s4-entry-stop-20260926.json",
      "blob": "b6a88b13e3fa0ccde4cadf8cff5953d47a7db201",
      "sha256": "d5a1fff3d0f714de9ef7e9b492525f40f811f929ea1c283b70dfe8b8a4fd7e37",
      "size": 1086119
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c08-source-reference-conflict-and-stopped-handoff-20260926.json",
      "blob": "3be2b3d23ae597a440fe17ce466af6dc71031eef",
      "sha256": "0fb221ebd84753a5e98d6d64a9239e6048f41ec68db73461c510c6531a39c43c",
      "size": 596865
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c08-stopped-run-snapshot-01-20260926.json",
      "blob": "0754f24af57a264d3a3ba12aff167b6d5c67e389",
      "sha256": "68bcae5db298ba02f9db433bcc15fb8a5eec2c03e0b890fec751b7d0a6fdd259",
      "size": 7982839
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c08-stopped-run-snapshot-02-20260926.json",
      "blob": "47a77ffec184ef7e5f53493f4a24744bdc24525c",
      "sha256": "673fc24cdde2c01b59fcdb1f2a906c7218b6c6667a18028e5a434a60bea80afb",
      "size": 8151580
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c08-stopped-run-snapshot-03-20260926.json",
      "blob": "254a0d2384999297f961f25018b0b244cba419de",
      "sha256": "cfc27cc53f4337117fe3d07ff9f324bf7736ef473cbbe802921e4f19d3246f5e",
      "size": 10696760
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c08-stopped-run-snapshot-04-20260926.json",
      "blob": "96b69a5e1e60eb3bf282ed88fb623c576163816d",
      "sha256": "b892455af8ca5c2f4af3c912bf9f8cf0ea9b512a0fc2a1d15c73eecbbe360fbb",
      "size": 9783937
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c08-stopped-run-snapshot-05-20260926.json",
      "blob": "31acd26420ca4080f1e855c20600f6d2747a5ac9",
      "sha256": "8700c52b40e567d6988c60784eb785c0286a64b3ce15c0de9eae8be3d3290bb3",
      "size": 7165593
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c08-stopped-run-snapshot-06-20260926.json",
      "blob": "2b5d894b3f5d52d991f310d60c76b4b6adc39c2d",
      "sha256": "fc34ed4afb31f819ba17f1da64e71ada1094cf5494a18aff532700f42ad254a1",
      "size": 5147982
    },
    {
      "path": "calibration/src-001/core-design-basis/EVIDENCE-f03-c08-stopped-run-snapshot-07-20260926.json",
      "blob": "bf3059a262a9ddc2964c1c1e944a63db4cd81279",
      "sha256": "85466c5667bc9f022c4ae29835c131e35419e74b9fb7385380981fd7cef4f1f9",
      "size": 3522274
    },
    {
      "path": "calibration/src-001/core-design-basis/PROPOSED-f03-accepted-worker-return-production-reachability-design-20260917.md",
      "blob": "b5fd008ff2aab18cb632c248cb8259735d053714",
      "sha256": "6144bef6f06ee55e8507d7019c13658b0404a0bafe3f8aebe09f6a18a80f1524",
      "size": 94757
    },
    {
      "path": "calibration/src-001/core-design-basis/STOPPED-f03-c08-source-reference-width-conflict-20260926.md",
      "blob": "b0de9656d97a63bc28d6ddc5892fc374376af46c",
      "sha256": "dce30c41cf2c58fb8bc3758698848404e7cf44c86f1f208f9783a51ce3702d65",
      "size": 27606
    },
    {
      "path": "calibration/src-001/core-design-basis/STOPPED-f03-c09-s4-entry-bootstrap-conflict-20260926.md",
      "blob": "63ba0c85d33920404ba0dc1670ea13294d9c18a1",
      "sha256": "adb98518f80bda352356ea0b511719959d2a26ea5cb8c7fb122b0e971de2926d",
      "size": 24200
    },
    {
      "path": "calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-core-contract-conflict-20260917.md",
      "blob": "893bcc16f1dde9793b7a367ad4d4c5cba96930bb",
      "sha256": "4f052dc4648fc963bd62b129cad47a19c25f2a2e7c1bb531dc65df31f27d562a",
      "size": 15918
    },
    {
      "path": "calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-indeterminate-claim-binding-conflict-20260917.md",
      "blob": "5a107ba93ccd7ae46a483101f24b7a6adc733fac",
      "sha256": "82a0e059b52e5d175c751e720f0e24dee4721d5ca008311ccfecd73f2d722acf",
      "size": 37494
    },
    {
      "path": "calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-s3-packet-relation-ownership-conflict-20260919.md",
      "blob": "115927cd8db35a22ee7f9322a6dfaee2cf24df64",
      "sha256": "4aaba38fef84b6e32ced22939a3b40d5b55bb88e343ceff46a76005263b63db5",
      "size": 38860
    },
    {
      "path": "calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-s3-packet-widening-conflict-20260918.md",
      "blob": "fda1af9e38920f8d3ef85de9dc8c3255d61f32b3",
      "sha256": "5a71cfdd727b38d6575718aa3b290fc694c064a672404f88fa9506224c75ac66",
      "size": 32263
    },
    {
      "path": "calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-shared-position-event-continuation-conflict-20260917.md",
      "blob": "321692735b31b33e5d343848d171041260065c88",
      "sha256": "11e34ce1f2e1484913a8dafa37e07226edaa8f9014c8f611eeac91f1ee39600b",
      "size": 27677
    },
    {
      "path": "calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-source-walk-transition-conflict-20260917.md",
      "blob": "1bf02d7de3cf458358e7fdefead8267f33580ee9",
      "sha256": "b3aef9f0f7c8a514095fb191e041ec07a6bd15d894d0cd7ee6ac34859edb5c84",
      "size": 24015
    },
    {
      "path": "calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-stationary-degraded-capture-conflict-20260926.md",
      "blob": "4328fd8d3d49c8fe99b704ffcc7f504c1dfb6fbe",
      "sha256": "368e19539c284fa029898a6e936c0fe563bd3919577d75e218012b2706651700",
      "size": 32153
    },
    {
      "path": "calibration/src-001/core-design-basis/f03-continuation-structural-checks-20260917.json",
      "blob": "7f3de0e5e88cbf7498d67c9d5d27581dc2d64389",
      "sha256": "3e63e45551928492b50b9ce379d0e733a7b2e1073f0b5f114b85d4885a78a3ea",
      "size": 197140
    },
    {
      "path": "calibration/src-001/core-design-basis/f03-degraded-candidate-binding-conflict-20260917.json",
      "blob": "36f2d29c7ba36db61912d8ace9cac22f6b7fd70a",
      "sha256": "437f1dadebeed20dcbc27a2c361c1426f6a983026506cae3235e765696fe753a",
      "size": 794
    },
    {
      "path": "calibration/src-001/core-design-basis/f03-source-walk-transition-conflict-20260917.json",
      "blob": "8d9aef8ebcb32775385d081e772a3bf0b4122a90",
      "sha256": "a4a4879332a0ac20baee42ca49719caf8b2eaa974cc0517b4a74b63bb3c7869e",
      "size": 8415
    }
  ],
  "historical_C09_fixture": {
    "path": "/tmp/aleph-orchestration-process-Cz19En/host/grimoires/loa/aleph/runs/RUN-20260926T143458970Z-735f5527a1f1",
    "files": 1339,
    "exact_to_snapshot": true
  },
  "historical_discriminators": [
    {
      "path": "/tmp/loa-aleph-f03-implementation-20260917/adapters/loa/tests/test-f03-c09-s4-entry-discriminator.ts",
      "sha256": "1ed7abeb467d3d3720a8194ee30b0b0b1f1fc2624c6480259cabb20a6b783092"
    },
    {
      "path": "/tmp/loa-aleph-f03-implementation-20260917/adapters/loa/tests/test-f03-c08-source-reference-discriminator.ts",
      "sha256": "86b90e58dc165de4461df948292c0dcc3c6f84be9b1ea24b736360456a6b4fda"
    }
  ],
  "source_work_status": ""
}
```

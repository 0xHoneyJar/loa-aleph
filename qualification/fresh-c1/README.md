# Fresh C1 qualification tooling

Test-only implementation of Route B, `F03-FRESH-C1-FULL-11-01`. Qualification
does not launch from `npm test`, offline tests, or CI. An actual execution
requires separate operator authorization and the explicit `--execute-c1`
argument. A tooling test PASS is not a C1 qualification PASS.

The product under test remains commit
`0de4d759b5e0de4e465ade72bf325c04d4414647`, tree
`9274245373e2fcfd659b4ef5931d5d0fdd8808ae`. `common.ts` pins the reviewed Core,
adapter, checker, payload and Node digests. The tooling has its own source and
compiled-file identity. Before service launch, the tooling is copied once into
the new case's immutable `tooling/` directory. No old run, snapshot, receipt,
or runtime is relocated or rewritten. Source paths containing `calibration` or `closed-reference` are
excluded before blob reads.

## Components

- `driver.ts` is the executable entrypoint. `fixture-support.ts` contains
  reusable declarations and helpers, with no executable entrypoint. The
  installed-process fixture imports this support module, never the driver.
  The driver keeps its top-level await and awaited fixture import; there is
  no fixture-to-driver dependency to keep that evaluation pending.
  These helpers reuse the existing installed-process fixture's supported
  packet/usable/successor prefix. Its fixed environment refuses other cases,
  mutation flags, inherited faults and cleanup. The hook in
  `test-orchestration-process.ts` arms C1 `derived` before each supported
  resume and catches the first actual exit 86 before parsing its stdout.
  That child may include preceding legitimate S4 work. Its stopped canonical
  state must match the sealed C1 BEFORE basis.
- `reader.ts` is a separate fresh-case reader. It preserves the admitted
  whole-case reader's applicable predicates without modifying that reader or
  pretending to satisfy its additional whole-S4 campaign obligations.
  Complete installed admission additionally invokes authenticated pinned
  consumed-history derivation against the retained final run.
- `supervisor.ts` records each child's exact request, process identity,
  executable digest, direct-file streams and observed exit. A stopped exec
  trampoline permits identity capture before even an immediate target exit.
  Boot identity, PID namespace and start ticks distinguish process reuse.
  Every mandatory request field is validated before execution and comparison.
  The collector binds the exact request bytes, process record and driver
  ownership digest; admission also reopens the driver's original `child-N.json`.
- `service.ts` uses the existing user systemd manager, with no automatic
  restart, a 24-hour service ceiling and termination confined to that service.
  `RemainAfterExit` retains the manager's observed exit properties after a
  successful process exits. It does not start another process.
  The production driver refuses to run without its exact manager identity
  and policy. Per-child collectors independently enforce phase and child
  deadlines. A dead or rebooted owner without complete evidence is interrupted.
  Liveness alone is never completion.
  An independently scheduled guard in that same service enforces phase
  deadlines during synchronous readback. Each transition checks the outgoing
  deadline; completion at or after a deadline is TIMEOUT. The guard uses
  monotonic elapsed time as well as wall time and owns terminal publication.
  Launch, phase and successful completion records also carry boot-bound
  monotonic timestamps; clock rollback cannot renew a spent phase budget.
  Timeout records precede a stop of the verified service invocation, confined
  to its control group. Atomic exclusive receipt publication prevents the
  guard from reading incomplete JSON.

Every completed boundary archives all run file hashes and exact bytes in a
content-addressed object store. It records one run, work ID, prepared
transaction, child receipt and fault point. The prepared body is retained at
ordinal 3 and compared at every later boundary. The only permitted journal
body changes are the existing committed status/seal semantics.

| Ordinal | Fault suffix | Required state |
|---:|---|---|
| 1 | derived | Authenticated BEFORE, no intent/journal/consumption |
| 2 | commit-intent | Same BEFORE, exact intent |
| 3 | writer-prepared | Exact prepared journal, BEFORE effects/chain/checkpoint |
| 4 | effect:ledgers/relations.md | First effect AFTER |
| 5 | effect:ledgers/representation-uses.md | First two effects AFTER |
| 6 | effect:run-log.md | All three effects AFTER |
| 7 | canonical-bytes | All effects AFTER, chain/checkpoint BEFORE |
| 8 | chain | AFTER chain, BEFORE checkpoint |
| 9 | checkpoint | AFTER checkpoint, journal prepared |
| 10 | journal-committed | Journal committed, no consumption |
| 11 | consumed | Exact consumption, no repeated canonical effects |

Every fault uses `ALEPH_FIXTURE_WORK_FAULT=s4.close-C1:<suffix>` and expected
exit 86. The initial probe permits exit 0 while progressing the legal prefix;
it becomes an admitted C1 observation only on the actual exit 86. No failed
boundary is retried. The two final no-fault resumes must return the same
`ambiguity.expressions` proposal with its selection input absent and no new
work/call/return/transaction or canonical effects.

The two process lease files, `control/orchestration/lock` and
`control/ledger-writer.lock`, are retained after fault exits and checked against
the corresponding child PID and acquisition interval. They are removed by
successful supported resumes. Their permitted lifecycle is distinct from
canonical effects; no other file is exempted from the inter-boundary comparison.

## Admission compatibility

The original admitted reader is
`review-completed-S4-recovery-case-20261009a.py`, SHA-256
`5e3e31149306a0e86efe2f4ca28d6f1051db0411086091634825bc2b03092f9a`.

| Original predicate | Fresh-case enforcement |
|---|---|
| 448–453: run, pins, prepared work and effect inventory | Exact case-root/run path, original pins, one work, three ordered effects |
| 454–461: complete ordered faults, count, exit and argv | Eleven ordered fault receipts, identical installed argv, exact fault environment and genuine exit records |
| 462–470: same committed journal and consumption | Exact prepared body, actual journal-byte digest, committed status, AFTER chain/checkpoint and sealed consumption |
| 595–616: work trace and fresh processes | One C1 work and thirteen distinct child identities; no imported prefix or intervening unadmitted matrix child |

The final reader reopens immutable runtime pins before importing the installed
authentication entry. Hash agreement alone does not authenticate a plan.
All consumed transactions are rederived from their original bases with pinned
Core, and authentication must leave the run unchanged. The reader also
requires the one installed `start` receipt, the complete child sequence,
phase deadlines, individual boundary records and final verification receipt.
Installed launcher/runtime bytes are checked before each child and at final review.
Readbacks carry start/end times and must finish before their phase deadline
and before the next phase starts. Completed admission requires the original
launch, service command/start, driver, supervision and guard records. Their
hash links bind case nonce/path, boot, executable, process start ticks,
namespace, service invocation ID and control group. Collector parent
identities must match that driver. Verification of a completed case uses
these retained identities and does not require the exited processes to be live.

Reader dispositions are `NOT_RUN`, `RUNNING`, `FAIL`, `TIMEOUT`,
`INTERRUPTED` and `PASS`. Missing state after creation is not NOT_RUN;
missing evidence after a claimed PASS is FAIL. A completed retained PASS can
be read after a later reboot; an unfinished execution lost across reboot is
INTERRUPTED. No disposition triggers a launch or restart.

## Offline development checks

Use Node 22.18 or newer to build; generated tooling targets ES2022 and runs on
Node 20. It is emitted separately under `.aleph-bundles/fresh-c1-tools/`.
Production `runtime-js/` is not patched or regenerated by these commands.

```bash
npm run typecheck
npm run runtime:check
npm run test:fresh-c1:bootstrap
npm run test:fresh-c1
npm run test:fresh-c1:service
```

The bootstrap suite launches the actual compiled driver in fresh Node
subprocesses. `driver.js bootstrap-check` imports the same fixed fixture URL
as the authorized `run` path. The actual fixture body reaches `fixtureScratch`,
which throws a dedicated boundary exception before either scratch factory
can write. Only that exception produces `BOOTSTRAP_READY`; it does not produce
a qualification PASS or create case, service, installation or run records.
The check rejects inherited F03/Aleph flags and extra arguments. It cannot be
selected through qualification environment flags or used by a `run` action.

The executable negative control restores the published fixture-to-driver
edge and driver exports in a private copy of the actual compiled package.
A harmless referenced timer reproduces the original guard's event-loop
liveness, and an external two-second watchdog records the resulting timeout.
The actual driver marks entry to the fixture import; no loader redirect or
mock fixture is used. Other private mutations prove refusal of missing
imports, unexpected errors, missing boundary evidence and side effects,
including a child that exits successfully but wrote an unexpected file.
Each child retains its exact request, process identity, exit and raw streams.
The normal bootstrap has a ten-second external timeout and must leave its
empty workspace and compiled package unchanged. CI runs it on Node 20/22.

The existing offline suite exercises synthetic reader mutations and short harmless
subprocesses. The package test validates the new package inventory in an
excluded-source-free copy, then copies only permitted blobs from the pinned
product commit, assembles and independently verifies its bundles, installs one
temporary smoke host, and requests status with no run. The service suite uses
six harmless services: normal completion, failure, deadline, missing receipt,
guarded completion and an on-time child followed by blocked readback. The last
control proves phase timeout stops that service's detached descendant while
an unrelated process survives. Guarded completion waits within the existing
15-second test deadline for both authenticated guard-result and terminal
records, checks guard/driver death while publication is incomplete, and retains
the normal guard exit and final service properties. A guard-result PASS alone
is never completion.

Eight harmless publication subprocess controls cover delayed valid publication,
missing terminal, guard exit, contradictory verdicts, normal completion,
test-deadline expiration during publication, phase-deadline equality, and wrong
terminal ownership. They exercise the same waiter used by the service suite and
retain exits and raw streams. Their synthetic service envelopes cannot admit
an installed C1 case; the existing real service suite verifies actual ownership.
The old immediate read is shown to fail with ENOENT during a controlled
publication gap. CI runs these controls on Node 20/22 and runs source preservation
even after a failed test, retaining its separate step outcome.

Offline regressions additionally cover exact
deadline equality, expired transitions, every missing request field,
malformed/substituted requests and missing/altered/stale ownership.
CI performs the checks with excluded source absent and repeats the
compiled tests on Node 20. Service and installation evidence is retained as
a workflow artifact. None invokes installed start/resume or the long C1 workload.
Package checks assemble and independently verify both the current development
bundle (including byte-exact corrected qualification source) and the original
pinned product bundle, and verify a frozen copy of the compiled tooling.
Offline process evidence is retained in its reported scratch directory.

## Future authorized execution

First review the tooling, its offline evidence, product digests, storage,
service-manager availability and preserved historical inputs. The exact
complete case remains separately authorized; expect 18–22 hours, subject to
the fixed ceiling. Offline tests do not measure the new bookkeeping overhead
or prove that this case will finish within that estimate.

The launch config contains only `root` (a new final durable absolute path),
`repository` (the canonical Git object source), `product_commit`, `node`
(the original pinned Node executable) and `node_digest`. It may not target
temporary cleanup paths. Build with the locked compiler, then use that exact
Node 20 executable with:

```text
<pinned-node> .aleph-bundles/fresh-c1-tools/qualification/fresh-c1/driver.js
  launch <config.json> --execute-c1
```

The service runs independently of a Codex context. Its invocation, immutable
launch receipt, boot/driver identities, phase records, raw streams, child
receipts, boundary inventories, final two resumes and terminal result remain
under the durable root. A second launch at that root is refused. No cleanup,
relaunch, historical composition, C2/F05 execution or campaign continuation is
performed.

The budgets remain: setup 30 minutes; legal prefix through the first C1 fault
17 hours with 3-hour children; remaining faults 4 hours with 30-minute children;
two resumes 1 hour with 30-minute children; final verification 90 minutes.
Every budget is clipped by the one 24-hour deadline.

Read retained evidence using `reader.js <case-root>`. A complete matrix still
requires independent C1 evidence review and first-pass admission. It does not
resolve the lost historical consumption result, promote 13/14 to 14/14,
authorize repeatability, or declare producer completion.

F-03/F-04/F-05 remain OPEN / MUST PRESERVE.

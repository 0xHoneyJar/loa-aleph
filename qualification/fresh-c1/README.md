# Fresh C1 qualification tooling

Test-only implementation of Route B, `F03-FRESH-C1-FULL-11-01`. This package
does not launch from `npm test`, its offline tests, or CI. An actual execution
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

- `driver.ts` reuses the existing installed-process fixture's supported
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
- `service.ts` uses the existing user systemd manager, with no automatic
  restart, a 24-hour service ceiling and termination confined to that service.
  `RemainAfterExit` retains the manager's observed exit properties after a
  successful process exits. It does not start another process.
  The production driver refuses to run without its exact manager identity
  and policy. Per-child collectors independently enforce phase and child
  deadlines. A dead or rebooted owner without complete evidence is interrupted.
  Liveness alone is never completion.

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
npm run test:fresh-c1
npm run test:fresh-c1:service
```

The first suite exercises synthetic reader mutations and short harmless
subprocesses. The package test validates the new package inventory in an
excluded-source-free copy, then copies only permitted blobs from the pinned
product commit, assembles and independently verifies its bundles, installs one
temporary smoke host, and requests status with no run. The service suite uses
four harmless services: normal completion, failure, deadline and missing
receipt. CI performs the checks with excluded source absent and repeats the
compiled tests on Node 20. Service and installation evidence is retained as
a workflow artifact. None invokes installed start/resume or the long C1 driver.

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

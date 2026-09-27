# F-03 consumed-plan reauthentication checkpoint

Status: implementation and structural qualification in progress. This record
does not declare producer completion, acceptance, release readiness or closure.
F-03, F-04 and F-05 remain **OPEN / MUST PRESERVE**.

## Continuation identity and reboot recovery

The resumed local and remote HEAD was
`74b92b37be776811f409061ca09e4173be41fe9b`, tree
`2cb84012eb94993434af723094d065239ad1a3dd`, parent
`82f0f94c372139f9e15d56383821b9148ba0a503`, on
`agent/f03-production-reachability-implementation-20260917`.
The intervening commit retained the predecessor applicability repairs; it
did not contain the uncommitted consumed-plan or authority-lock repairs.

A reboot had removed the six registered `/tmp` worktree directories and the
old fixture slots. All seven registrations, the primary checkout, release
ref, retained stash and historical administration records survived. The
user expressly authorized exact reconstruction after this loss was reported.
The existing implementation registration was reattached at its original path.
No registration was pruned or replaced and no other worktree was reconstructed.

The durable pause capsule
`/home/eileenspectremoon/loa-dev/f03-pause-20260926-q38oe1m4`
verified all 473 inventoried files. Reconstruction restored 712 non-calibration
tracked blobs plus all 14 saved dirty files byte-for-byte, with their modes:
12 tracked modifications, two untracked tests and no staged changes.
The binary diff and status matched the pause handoff. The 260 calibration
paths were omitted before blob reads and marked skip-worktree in this
registration only; the original index was retained.

The starting dirty paths were the Loa and Core manifests, Loa skill,
`cli.ts`, `ledger-writer.ts`, `orchestration.ts`, `run-control.ts`,
`test-orchestration-process.ts`, the four corresponding generated adapter
files, and the two new consumed-plan/concurrency tests. The exact inventory,
hashes, modes and diff remain in the capsule and recovery receipts.

Primary HEAD/tree remained
`a568f499db6707e4787ee3da969dbd6193b04944` /
`a72612678f8cbdc4ae2951eb5b26f1b172c71847`, clean, on
`agent/src-001-blind-replay-preparation-20260914`.
Release ref remained `b9e2db742a087b8ae659ec39e476ed5e240cfa1f`;
stash remained `e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8`.
All 45 historical F-03 administration records matched their retained hashes.
Old fixture directories are lost; archived logs/results do not make them
present again or turn their incomplete jobs into passes.

## Original defects retained

`EVIDENCE-f03-consumed-plan-original-20260927.json` is a byte-exact copy
of the retained original changed-destination reproduction. SHA-256:
`b964d2218f5d683edb0e3b7aafe9cd8495d4ef2b52b7d6c55834b2932634bb9a`.
Its original root was `/tmp/f03-consumed-plan-probe-7VOvrt`; the disposable
installed `resume` exited 0 and accepted the coherently rehashed journal.
That original directory was lost in the reboot. The result, original probe
script and command evidence survive in the durable pause capsule.

The defect was that consumption authentication compared retained hashes,
obligation and journal/checkpoint consistency without rederiving the complete
transition. A changed destination could therefore survive when the stored
digest chain was recomputed. This was a missing implementation check under
the adopted Architecture-B contract, not a new Core policy question.

`EVIDENCE-f03-authority-lock-original-20260927.json` is a byte-exact copy
of the separate installed gate/lock reproduction. SHA-256:
`5a24b5cb95639bafe8df1413669c9d2f7b90187d00eec40d830d97f0c8954411`.
The supported fixture-human gate changed the checkpoint while another
process held the orchestration lock. Its original root
`/tmp/f03-authority-lock-probe-4OVjOm` was also lost; the capsule retains
the result and reproduction evidence.

## Exact consumed-transition derivation

`readConsumption` now reopens the durable work using `readOrchestrationWork`.
That authenticates the immutable run identity/pins and retained runtime,
work identity, exact stage-contract bytes, historical checkpoint and chain
basis, complete retained basis inventory, first-unmet Core selector,
dependency set and Core-derived invocation tuple.

The private historical derivation then reopens the exact accepted return:
worker request, invocation, dispatch intent/completion, native return/dispatch,
host-capability binding, exact raw bytes, validation result, canonical accepted
return, receipt association, context identities and simulation classification.
Accepted dependencies are reopened and their consumed transactions are
independently rederived. Applicable retained human authority is read by Core
from the authenticated historical basis.

The historical BEFORE projection uses existing retained basis members and
their authenticated bytes, with only the already-authenticated call evidence
overlaid where Core requires it. It is disposable and is never canonical
state or new authority. It does not derive the old plan from later run files.
Core deterministically derives and validates the full transition from that
BEFORE, exact selected work, accepted value and original work timestamp.

The entire canonical transition must equal the committed journal's plan.
This covers every serialized field, including all effects and their order,
paths, BEFORE/AFTER digests and exact AFTER bytes, obligation, operation,
subject, next execution, authority/halt, simulation, stage/bootstrap markers
and composition fields. An unknown caller field also differs from Core's
output; there is no field denylist or destination allowlist substitute.

The shared pure `deriveWorkTransaction` separately reconstructs the complete
journal, BEFORE/AFTER state, chain and checkpoint from that authenticated
transition. Exact canonical journal equality and consumption/current-chain
binding are then required. Retained hashes are checked against this derivation,
not accepted as bearer authority. The public writer derivation still refuses
already-consumed work. A memo exists only within one synchronous read
traversal; it is not persisted or reused across mutations/processes.

## Related correctness repairs

New-format generic authority and S0 writers now acquire the same orchestration
lock before their existing family lock and release in reverse order. Existing
same-process nesting remains supported; predecessor applicability is unchanged.

Installed Node 20 S1 and a separate Core bootstrap projection probe exposed
EACCES during deletion of private copies containing read-only directories.
Only disposable BEFORE/proposed projections are made writable for deletion.
Canonical inputs and retained evidence keep their bytes and permissions.
Core's regression explicitly checks nested read-only input directories and
executes the validation projection on Node 20.

The installed fixture callback now retains a TypeScript assertion-function
annotation while its type-stripped, self-contained function is executable by
the pinned Node 20 fixture process. A failed annotation attempt is retained.

The multi-source fixture now compares frozen identity/sensitivity fields
across S1 and complete post-S1 metadata across S2. Its original expectation
incorrectly rejected Core's accepted S1 dates/trust/admission metadata.
The first failed attempt remains recorded.

The compatibility source helper now sets only the structured run-format
fields instead of replacing a hard-coded 1.8 string. This fixes a synthetic
1.6 fixture accidentally remaining 1.9 when constructed from a 1.9 source.
The adapter test asserts the actual lock version. No historical run is edited.

Ordinary new-bundle manifests, schema and current-format constant now select
the already-adopted `1.9.0-provisional` capability. The installed progression
test checks the declared default rather than silently forcing it. Protocol
and release numbers are unchanged. This is source implementation activation,
not release preparation or publication.

## Qualification at this checkpoint

- Fresh installed consumed-plan authentication:
  **33/33 adversarial mutations plus one intact repeated-resume control PASS**,
  `/tmp/f03-consumed-plan-auth-Wwqkvh/results.json`.
- Fresh installed concurrency: **11/11 PASS**,
  `/tmp/f03-concurrency-P8x46L/results.json`.
- Fresh installed controller authentication: **47/47 PASS**, including
  all **10/10 legacy-writer bypass controls**,
  `/tmp/f03-controller-auth-vSwmC2/results.json`.
- Removed accepted-byte-guard discriminator: PASS,
  `/tmp/aleph-orchestration-process-yMf37D/removed-authentication-guard-control.json`.
  Its deliberately defective fixture bundle demonstrates the illicit write;
  it is not positive product evidence.
- C-09 focused bootstrap: **43/43 source and 43/43 runtime PASS**,
  with additional Node 20 subprocess status 0 and preserved input modes.
- Fresh installed Node 20 two-source S1 identity/ruling progression into S2:
  PASS, `/tmp/aleph-orchestration-process-FVbdb7`.
- Corrected adapter conformance: **34/34 PASS**. Installer qualification and
  discovered fixture validation: PASS.
- Canonical runtime build, strict typecheck and **51-file runtime parity PASS**
  after the cleanup repairs and 1.9 activation.
- Existing Slice 5 process controls: **76/76 PASS**; representation structural
  controls **71/71 PASS** and representation process controls **20/20 PASS**.

All nine unchanged historical executable payloads passed frozen-boundary
routing after installing the activated default bundle
`sha256:48e437b127f55005f83f05c4ceabfc7ebd25f3b12772af179375b1e22dd0c10f`.
Canonical/runtime bytes and original identity remained exact; no old run
acquired work records or the new controller.

| Retained format | Exact historical source | Result |
| --- | --- | --- |
| 1.0 | `41979fd7c4e044aead9631a864c33b7d2736b958` | PASS |
| 1.1 | `cecef33991f306c13ccdce0c93cb6ac47b7ffccd` | PASS |
| 1.2 | `03387aff079b02a685dda846ed115cea5d794ea7` | PASS |
| 1.3 | `be064f53eb347269512a7f3462fc4171ed3aae5d` | PASS |
| 1.4 | `066924d3c6f0d5dd0212ca2439cae4f57cc13730` | PASS |
| 1.5 | `1a8fcdecb4e554e116828166dc5e806851d9e499` | PASS |
| 1.6 | `ddc2a3e7caaf9298780ef2795c534a4332357cf8` | PASS |
| 1.7 | `c913fb2667539e34baa616ada2e50415f0c36291` | PASS |
| 1.8 | `1ffb8d5d264b5857936895194ee042816feafcbe` | PASS |

The 1.0/1.1 marker behavior remains its historical behavior; 1.2–1.8 keep their
strict marker refusal. Both groups refuse activation of the new controller
through a changed marker. This is bounded routing evidence, not proof of
every predecessor's complete semantic frontier.

The source consumed-plan counterpart, broader installed S2–S5/C2/F-05 paths,
exhaustive recovery and remaining conformance/package/mutation checks are
still being completed. Prior
47-case controller and 33-case installed consumed results remain in the
pause capsule and are not replaced by unfinished fresh runs.

All active and completed receipts are retained under
`/tmp/f03-reboot-recovery-20260927-vtzscqpm`; new durable snapshots are under
`/home/eileenspectremoon/loa-dev/f03-resume-20260927-vtzscqpm`.
The first activated conformance source used an inappropriate dependency
symlink: bundle inventory rejected it and a nested fixture copy failed EISDIR.
That construction failure is retained; the corrected source uses an ordinary
ignored dependency directory. It is not a product bypass or Core conflict.

## Preserved boundaries and remaining lifecycle

C-09 remains adopted, including authority
`8cf5247b6e6f3972b40e7e7a01d7e6d3cd2bccea` and atomic implementation
`49b41c4e86a973df7486931ff3c3f1af8bb88301`. Its historical invalid evidence
remains visible. No restart of C-09 or new HUMAN decision is required.
`status`/`validate` authenticate and report pending transactions without
canonical verification or mutation; `resume` recovers before ordinary
verification and next-work selection.

F-05's narrow notice/refusal surface at
`1771059ae75c31f21422220384323af9f10cf13d` remains preserved and open.
The historical fixture-source-copy execution-scope incident at
`c6ca7d0e26fbf166b8ce39b3c3fd3f778c37c92a` remains separately visible.
Every new source fixture excludes all `calibration/` before file/blob reads.
No further closed-reference access or copying occurred in this resumed work.
An overall zero prohibited-operation count across the full continuation would
be false because the historical copying incident occurred.

This checkpoint used local synthetic fixtures and process verification only.
No provider/model call, genuine native worker, live corpus, SRC-001 replay,
release preparation/publication, Loa ingestion, PR, merge, governance/semantic
acceptance, finding closure or v1 declaration occurred. T03/T04 genuine-native
evidence remains outside this authorization. The strongest justified status
is **implementation in progress with structural controls; not producer complete**.

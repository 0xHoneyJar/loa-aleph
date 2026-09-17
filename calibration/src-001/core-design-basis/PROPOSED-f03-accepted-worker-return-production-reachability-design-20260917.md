# F-03 accepted-worker-return production reachability

Date: 2026-09-17

Role: PRODUCER

Status: **PROPOSED — NOT ADOPTED — NOT IMPLEMENTATION AUTHORITY**

Investigation: generic Loa-Aleph product runtime; not an SRC-001 replay.

**Diagnosis: `F03_IMPLEMENTATION_GAP_CONFIRMED`.**

**Design readiness: `F03_DESIGN_READY_FOR_HUMAN_ADOPTION`.**

Selected architecture: **B — file-driven orchestration transaction, with
`resume` as the only operator-facing progression/commit abstraction.**

**Bounded additive Core changes are required for the complete S0–S4 product
path proposed here.** The transport reauthentication mechanism alone is
adapter-owned. Existing Core plans constrain supplied after-images; they do
not supply a complete first-unmet-work selector and accepted-value-to-plan
derivation interface. S1 review also lacks an executable role contract.
Putting these missing contracts in Loa-specific policy would cross the
Core/adapter boundary. No accepted semantic doctrine is proposed for removal
or relaxation.

F-03 remains **OPEN / MUST PRESERVE**. F-04 remains independently **OPEN /
MUST PRESERVE** for path/case/platform portability. F-05 remains **OPEN /
MUST PRESERVE and bounded by F-03**. This proposal does not close a finding,
sanction agent mode, accept a run, authorize execution, or declare v1.

## 1. Subject identity and investigation boundary

| Subject | Verified identity |
| --- | --- |
| Repository | `0xHoneyJar/loa-aleph`; origin `https://github.com/0xHoneyJar/loa-aleph.git` |
| Canonical remote main | `8236b9f35c38cdd604b2389b42589f27755cdade` |
| Canonical starting tree | `72075f93bc9fcb3c76f4480bc612693211efd240` |
| Design branch | `agent/f03-production-reachability-design-20260917` |
| Isolated worktree | `/tmp/loa-aleph-f03-design-20260917` |
| Primary checkout, preserved | `agent/src-001-blind-replay-preparation-20260914`, HEAD `a568f499db6707e4787ee3da969dbd6193b04944`, tree `a72612678f8cbdc4ae2951eb5b26f1b172c71847` |
| Local main ref, preserved | `c949ea5f39daef42d22ca2e4111164d63dffcbf1`; this stale local ref was not mistaken for canonical GitHub main |
| Preserved adapter branch | `agent/loa-adapter-release` at `b9e2db742a087b8ae659ec39e476ed5e240cfa1f` |
| Preserved stash ref | `e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8` |

`git ls-remote --heads origin main` established the remote identity; local
object resolution established its tree. The new branch was created directly
from that exact commit, with an empty worktree status before investigation.
The primary checkout, all existing branch/stash refs, and the four existing
detached worktree registrations were inventoried first. No pruning, switching,
resetting, stashing, or repair of those registrations was performed. The
sandbox's initial remote lookup failed with DNS resolution; the permitted
read-only lookup succeeded. This was an environment failure, not a repository
identity mismatch.

All findings below refer to the starting tree, not the preparation branch.
The source and retained reconciliation documents were inspected directly.
The proposal's placement under `calibration/src-001/core-design-basis/` is
repository administration only; that path introduces no calibration dependency
into the proposed product.

Evidence notation: `path:line` names source in the exact starting commit.
Intervals identify inspected implementations, not claims that every line in
an interval establishes every conclusion. Section 23 inventories the exact
source blobs. Proposed names and formats in sections 6 onward do not exist at
the starting commit.

## 2. Current-state call graph

Classifications describe the edge, not the quality or lifecycle of either
endpoint. `PRODUCTION_DIRECT` means an executable call in a shipped module;
it does not mean a live execution was observed. `PRODUCTION_FILE_DRIVEN`
means an executable reader consumes a specified retained file. Natural-language
skill instructions are not executable edges.

| Edge | Classification | Exact evidence and limit |
| --- | --- | --- |
| `/loa-aleph resume RUN-id` → command shim | `PRODUCTION_FILE_DRIVEN` | `adapters/loa/installation.map.json` installs `command/loa-aleph.md` as the slash-command file; shim lines 6–9 forward arguments |
| Shim → installed skill | `SKILL_INSTRUCTION_ONLY` | `command/loa-aleph.md:6`; instruction to use the skill |
| Skill → launcher invocation | `SKILL_INSTRUCTION_ONLY` | `skill/loa-aleph/SKILL.md:8–12`; parent host executes the stated command |
| Executed launcher → verified installed CLI | `PRODUCTION_DIRECT` | `src/launcher.ts:441–679`, `verifyInstalledLauncherRuntime`, `runInstalledLauncher`; import of verified CLI and `runLoaCli(argv)` |
| CLI → `dispatchLoaCommand` → `resumeLoaRun` | `PRODUCTION_DIRECT` | `src/cli.ts:1154–1257`; exactly four public commands, plus two file-driven gate controls |
| Resume → existing recovery functions | `PRODUCTION_DIRECT` | `cli.ts:589–596`; S0, authority, material, semantic, duplicate, generic ledger recovery |
| Resume → run/pin verification | `PRODUCTION_DIRECT` | `cli.ts:597–605`; `verifyRunControl`, `verifyRetainedRuntimeIdentity`; representation and simulation checks |
| Resume → general first-unmet-DoD selection | `DOCUMENTED_ONLY` | `cli.ts:689–697` returns `load-pinned-Core-orchestrator-and-first-unmet-DoD`; no general DoD traversal is called |
| Resume → S4 C2/authority/closure selection | `PRODUCTION_DIRECT` | `cli.ts:606–678`; bounded state/phase branches, errors exposed as `slice5.first_unmet_dod`, four required role names |
| Resumed details → exact worker assembly input | `SKILL_INSTRUCTION_ONLY` | skill lines 65–108 instruct the parent to populate a JSON file; resume creates no such file |
| Exact DoD/checkpoint → machine-bound assembly input | `MISSING` | `LoaWorkerAssemblyInput`, `worker-dispatch.ts:176–188`, has no DoD/checkpoint/operation binding; resume does not construct it |
| Assembly-input JSON → `assembleLoaWorkerHandoff` | `PRODUCTION_FILE_DRIVEN` | `worker-dispatch.ts:264–343`; canonical path and exact-key parsing, pinned model selection |
| Assembly helper → `assembleWorkerBundle` | `PRODUCTION_DIRECT` | `worker-dispatch.ts:326`; `worker-bundle.ts:489–674` seals prompt parts, output contract, attachments, restrictions |
| Sealed bundle → `prepareLoaWorkerHandoff` | `PRODUCTION_FILE_DRIVEN` | `worker-dispatch.ts:614–684`; immutable invocation plus exact retained host receipt |
| Prepare → later native dispatch | `SKILL_INSTRUCTION_ONLY` | skill lines 124–153 drive separate CLI processes; no automatic call from prepare |
| Dispatch CLI → `dispatchPreparedClaudeCodeHandoff` → host | `PRODUCTION_DIRECT` | `worker-dispatch.ts:896–958,1173–1192`; `invokeClaudeCodeWorker` in `claude-code-host.ts` |
| Native host → stream/value/dispatch receipt files | `PRODUCTION_DIRECT` | `worker-dispatch.ts:923–948`; three immutable quarantine outputs |
| Retained outputs → accept CLI | `PRODUCTION_FILE_DRIVEN` | `worker-dispatch.ts:859–888,1193–1205`; explicit separate action |
| Accept → invocation/receipt/stream authentication | `PRODUCTION_DIRECT` | `verifyInvocation:533`, `readNativeDispatchRecord:686`, `pinnedHostBinding:455` |
| Accept → `validateWorkerReturn` | `PRODUCTION_DIRECT` | `worker-dispatch.ts:877`; canonical bundle, contract and isolation validation |
| Validator → in-memory `ValidatedWorkerReturn` | `PRODUCTION_DIRECT` | `worker-return.ts:330–345`; private module symbol, deep-frozen canonical value |
| Validator → `raw.json`, `validation.json`, `validated.json` | `PRODUCTION_DIRECT` | `worker-return.ts:265–343`; quarantine derivatives, not a canonical commit |
| Accept CLI → brand retained by another process | `MISSING` | `worker-dispatch.ts:1193–1205` emits summary only, including `ledger_write: false`; JSON cannot retain the private symbol |
| Accepted evidence → callable reauthentication | `HELPER_ONLY` | `acceptLoaWorkerHandoff` can reopen the files and reconstruct the brand when called again; no resume consumer calls it |
| Accepted native evidence → production plan derivation | `MISSING` | no import/call to worker acceptance in `cli.ts`; no installed plan/apply operation |
| Accepted return → generic `LedgerWriter.append` | `TEST_ONLY` | e.g. `tests/test-loa-adapter.ts:2853–2896`; test supplies renderer and destination |
| Accepted return → material/semantic/duplicate writers | `TEST_ONLY` | process-test constructors and callbacks inventoried in section 5 |
| `dispatchLoaWorker` → prepare/callback/accept | `FIXTURE_ONLY` | `worker-dispatch.ts:964–1042`; live runs reject this callback embedding path |
| Skill's passing return → “may be given” to writer | `SKILL_INSTRUCTION_ONLY` | skill lines 162–167; no executable operation is named or implemented |
| Writer family → Core planner/validator | `PRODUCTION_DIRECT` | shipped library calls in `ledger-writer.ts:753–1105`; these remain unreachable for semantic work from resume |
| Writer → journal → canonical files → chain → checkpoint | `PRODUCTION_DIRECT` | `ledger-writer.ts:252–459,627–726,1110–1234`; caller reachability is a separate question |
| Prepared writer journal → subsequent resume recovery | `PRODUCTION_DIRECT` | `cli.ts:589–596`; recovery does not manufacture the absent original semantic transaction |
| Human response → T5.3 writer → C2/C3/S5 | `PRODUCTION_DIRECT` | `cli.ts:607–666`; this is a real narrow writer path, independent of native worker acceptance |
| S0 freeze response → canonical draft/freeze artifacts | `PRODUCTION_FILE_DRIVEN` | `cli.ts:971–1069`; separate authority transaction, not a worker-return commit |

Here and below `src/`, `tests/`, `skill/`, and `command/` abbreviate paths
under `adapters/loa/` where the table makes that unambiguous.

Generated code has the same gap: `runtime-js/adapters/loa/src/cli.js:384`
implements resume and constructs a writer at line 405 only in the S4 branch;
`worker-dispatch.js:588,873` authenticates returns and prints the accept
summary; `worker-return.js:54,169` contains the brand and validator;
`ledger-writer.js:639,724` contains semantic and duplicate methods.
`launcher.js:553` imports the installed CLI. The other inspected runtime
projections are listed in section 23. A source-only fix would not repair the
installed package.

There is an additional pin-routing distinction: the launcher executes the
verified **installed** CLI, while that CLI verifies and reports the
**run-local** bundle. Verification of retained bytes is not proof that every
currently executing imported helper came from those bytes. Resume has no
general handoff to execute the retained CLI. The proposed existing-run routing
must make that executable selection explicit.

## 3. F-03 diagnosis and present orchestrator

The strongest classification is `F03_IMPLEMENTATION_GAP_CONFIRMED`, rather
than “path exists but proof missing.” Native dispatch and native acceptance
are implemented. Canonical writers and recovery are implemented. The
production connection between them, including work selection and deterministic
plan construction, is absent.

The subordinate findings are:

1. Helpers can reconstruct an authentic in-process return by reopening retained
   native evidence. Process-boundary reconstruction is possible in principle;
   no new serialized brand is necessary.
2. Tests join those helpers to writer methods and supply semantic artifacts,
   plans, IDs, prerequisites, or synthetic state. Those joins do not exist in
   supported resume control flow.
3. The manifest calls the installed skill `loa-aleph-orchestrator`
   (`adapter.manifest.json:98–104`). Its parent Claude Code conversation is
   presently expected to carry semantic coordination, as instructed by Core
   `prompts/orchestrator.md` and the agent runbook. `resumeLoaRun` is a bounded
   verifier/recovery/gate coordinator, not the whole described orchestrator.
4. S1 → S2 and other general transitions are also absent, not merely the final
   writer call. S0 freeze leaves `stage = S0`, `stage_status = closed`
   (`cli.ts:1003–1018`). Resume does not enter S1.
5. S1's criteria spot-check has no S1 verifier dispatch mapping.
   `worker-bundle.ts:190–209` starts L1 at S2. Core defines L3R
   (`prompts/verifier-lenses.md:79–98`) but the role table has no L3R mapping.
   Local/global relation producer charters exist
   (`workers-intake-extraction.md:959–1095`), while `ROLE_SPECS` does not expose
   those distinct jobs. The global charter's output is a prose reference to
   the local contract, which `loadOutputContract` cannot resolve as its own
   fenced JSON. These gaps matter to a nonempty S4 path.

F-03 is therefore correctly framed. Its scope is not “no use of LedgerWriter
anywhere.” It is accepted native return → authenticated production
orchestration → canonical semantic transaction.

`WorkerRequest.stage` already records a declared stage and the assembler
checks role/stage compatibility. That is weaker than selecting the current
unmet work item: `assertPinnedRunAndModel` checks run, bundle and model
identity, not a general equality between the requested stage and the retained
execution stage/checkpoint. Specialist Core semantic/duplicate checks impose
additional constraints, but they do not supply the missing general work
authorization.

**Semantic orchestration** may choose a legally bounded task, batching,
candidate interpretation, context request, or proposed relation. These choices
remain proposals or recorded worker judgments under Core. The parent may
present a human gate and choose among currently eligible Core tasks when Core
allows alternatives. It cannot mark an unmet DoD complete.

**Deterministic orchestration** owns identity allocation, ordered work
eligibility, exact prompt/contract selection, allowlist verification, native
evidence authentication, review/quorum predicates, byte-derived hashes, legal
artifact rendering, prerequisites, write windows, transaction application and
checkpointing. Human decisions enter exclusively through retained gate
request/response records. Neither a producer nor the parent may supply a file
destination, a JavaScript renderer, arbitrary after-images, a truth judgment
on behalf of a refuter, or an authority response to the proposed commit API.

## 4. Current resume semantics, S0 through the Slice-8 frontier

| Retained stage/subphase | What current resume actually does | What it does not do |
| --- | --- | --- |
| Every stage | Recover S0/authority/material/semantic/duplicate/ledger journals; verify retained state, runtime, representation support, simulation limits | Select all Core DoDs, construct calls, or dispatch workers |
| S0 awaiting authority | Return persisted gate/halt as BLOCKED | Generate approval or run an intake worker |
| S0 frozen/closed | Return PASS with “load pinned Core … first unmet DoD” | Enter S1 |
| S1 | Generic recovery/verification/details only | Finalize inventory/criteria, obtain criteria review, enter S2 |
| S2 | Generic recovery/verification/details only | Source-walk selection, sealed extractor input, packet/event/cursor commit, L1/L2S work or S2 exit |
| S3 | Generic recovery/verification/details only | Batch selection, normalization, L2/L2S/L2F work, claim/no-claim commit or S3 exit |
| S4 before C1 | Inspect closure history; otherwise generic details | Duplicate discovery/comparison, L3/L5/L3R calls, successor/material/semantic plans, relations, or C1 |
| S4 C1 complete, C2 unmet | Try C2 structural closure; report caught failure and the four Slice 5 role names | Determine a complete concrete ambiguity subject or consume those roles' returns |
| S4 response-application halt | Call `appendProceduralAuthorityResponse` | Treat a worker result as human authority |
| S4 nonterminal/suspensive follow-up | Reopen Q+1 through `openProceduralAuthorityFollowup` using retained request/response/subject | Invent a new material-impact meaning |
| S4 C2 complete | Advance C3; after durable C3 call `enterS5AfterSlice5Closure` | Do semantic S5 work |
| S5 and later | Generic recovery/verification/details, retained gate reporting | General stage work loop |

Explicit answers:

- **Dispatches a worker itself:** no.
- **Returns instructions/details:** yes, with bounded Slice 5 details.
- **Creates assembly inputs:** no.
- **Knows an accepted return exists:** not as an actionable work item.
  Core validation may inspect retained `raw.json`/`validation.json` for
  semantic accounting; this is not a queue or a consumer.
- **Consumes accepted returns:** no.
- **Invokes LedgerWriter for semantic stage work:** no. It does invoke it for
  T5.3 and closure bookkeeping.
- **Progresses one DoD autonomously:** only those bounded deterministic
  recovery/authority/closure transitions whose prerequisites already exist.
- **Progresses multiple DoDs until a gate:** only the narrow C2 → C3 → S5
  sequence; no general loop.
- **Restart after accept before commit:** retained quarantine survives, brand
  does not. Resume neither rediscovers it as work nor creates its transaction.
  Recalling accept manually can recreate a brand, but that is helper use.

## 5. Tests versus supported product reachability

Repository-wide TypeScript searches found five test files constructing
`LedgerWriter`. The tables distinguish call sites that actually join a return
to a writer from setup, negative tests and authority-only calls. Repeated
parameterized cases at one site are included as that site's complete family.

| Test and source sites | Actual join or coverage | Missing production component |
| --- | --- | --- |
| `test-loa-adapter.ts:2783–2790,2853–2896` | Validator PASS → direct append of `ledgers/synthetic-worker.md`; malformed/forged brand negatives | Resume-owned operation selection and deterministic Core renderer |
| Same, `2943,3014` | Direct append attempts for late lineage; existing halt preservation | Genuine late semantic proposal routed through production work selection |
| Same, `3065,3203` | Direct append retry/recovery with retained test object and renderer | Durable accepted-evidence consumer and work-item consumption record |
| `test-slice5-process.ts:482–534,697–741` | Fixture return → pre-C1 relation comment append; replace/remove/retarget refusal | Relation producer/reviewer/plan pipeline; a comment is not reviewed relation admission |
| Same, `760–912` | Public runtime resume → test-authored assembly JSON → CLI assemble/prepare → fixture callback → CLI accept; test then calls accept again and `writer.append` | The crucial missing join is lines 899–912: parent test reconstructs brand and writes an operator-process report, not T5.1/T5.2 |
| Same, `175–176,710,750,920,993,1011,1030,1046,1298–1396,1424–1580,1723` | Direct phase/authority/follow-up/recovery helpers | Some authority/closure operations already have resume callers; their existence cannot establish semantic worker reachability |
| `test-representation-process.ts:153–171,182–230` | Fabricated dispatch receipt → validator → reservation, L2F VER append, material commit and duplicate retry | Native acceptance reopening plus Core row/render construction |
| Same, `255–267` | Direct `appendMaterialFindings` twice | Production routing of failed material findings |
| Same, `268–282` | Direct closure and material recovery; restored preimages and subprocess import | Supported resume selecting and creating the original transaction |
| `test-semantic-review-process.ts:140–185,232–243,271–316,391–438` | Fixture dispatch → direct semantic reserve/assign/review/resolve/admit/seal; test supplies `next`, subjects, assignments and producer sidecars | Core accepted-value-to-operation derivation and durable producer dependencies |
| Same, `441–451` | Direct run-log append/C1, negative post-C1 write | Production stage exit and entry routing |
| `test-duplicate-review-process.ts:55–95,133–149,181–188,210,334,508–513,547–574` | Fixture dispatch → direct material/semantic helpers and `tracked`/`apply` duplicate writes; explicit synthetic stage and ledger setup | Production discovery/sweep scheduling, exact plan derivation, accepted dependency graph and commit/consumption join |
| Same, `570` | Generic append bypass refusal after C1 | Does not dispatch or consume a late native return |

Complete return-creation/acceptance search inventory in adapter tests:

| File | Sites |
| --- | --- |
| `test-loa-adapter.ts` | `dispatchLoaWorker`: 1697, 2340, 2451; `acceptLoaWorkerHandoff`: 2524, 2570, 2725; `validateWorkerReturn`: 2733, 2755, 2764, 2776, 2837, 2853; explicit constructor-forgery negative: 2796 |
| `test-slice5-process.ts` | validator: 527; accept: 899; separate accept CLI in the four-role loop: 885–898 |
| `test-representation-process.ts` | validator helper: 171 |
| `test-semantic-review-process.ts` | fixture dispatch helper: 147; validator mutation: 223 |
| `test-duplicate-review-process.ts` | fixture dispatch helper: 87; validator mutations: 306, 375, 382, 388, 401 |

Only `test-representation-process.ts` directly calls `resumeLoaRun`
(315, 352, 361): S0 representation recovery and unsupported/opaque-source
blocking. The broader adapter battery uses `dispatchLoaCommand` and CLI
processes for resume; the Slice 5 process battery uses runtime CLI resume at
780, 1801, 1820 and 1877. None introduces an accepted-return semantic commit
caller into production. Installer/release/runtime tests reach installed
control surfaces and test packaging/parity, not this missing semantic join.
Core worker-contract tests produce shape-validation reports, not the adapter
brand.

Slice 5 reconciliation documents 15–17 retain their historical repair claims.
Slice 6 reconciliation section “Deterministic and process evidence” explicitly
limits its process results. Slice 7 retains F-03 at line 371. Slice 8 explicitly
states at lines 152–161 that its C1 baseline contains static relation/C2 rows
and does not prove accepted-return relation production; lines 230–232 carry
F-03/F-04/F-05. These qualifications agree with the inspected code.

## 6. Selected architecture and rejected alternatives

**Select B.** The adapter implements a durable orchestration controller reached
by ordinary `resume`. It returns one exact executable host work item when
native work is needed. The installed skill drives that item's
assemble → prepare → dispatch → accept operations, then immediately calls
the same supported resume abstraction. Resume reopens evidence, commits the
permitted transition, and returns the next work item or gate/halt. The human
continues to use:

```text
/loa-aleph start <inputs...>
/loa-aleph resume RUN-id
```

The skill performs the internal loop during the operator invocation; it does
not ask the operator or a developer to call library functions. A returned
worker work item is not a human gate. The skill must continue unless the
controller reports an actual authority/capability/budget/contamination/
unresolved-work halt. Transport failure remains a halt, with no fallback.

| Family | Trust, restart and gates | Complexity, skill and UX | Disposition |
| --- | --- | --- | --- |
| A: resume owns complete cycle | Can preserve all boundaries, but still needs durable work identity, dispatch intent, acceptance reopening and journals; blocking native process exit remains uncertain | Requires expanding synchronous resume into the native execution driver and longer host ownership; skill becomes thin; same public UX | Rejected for this repair: it does not eliminate durable records and moves more host execution into resume |
| B: file-driven transaction | Explicit pending item and before/after recovery; skill can dispatch only its exact item; commit remains authenticated in resume; human gates remain separate | Reuses installed split transport; adds one controller and bounded Core transition derivation; skill loops over structured actions | **Selected** |
| C: explicit apply/commit command | Safe only with the same work bindings and full reauthentication; otherwise an arbitrary-plan escape hatch | Adds another control surface and gives the skill an extra sequencing obligation; operator abstraction could remain resume but duplicate routing is unnecessary | Rejected as standalone architecture; resume itself supplies the internal apply operation |
| D: serialize brand/token or callback embedding | Plain JSON loses the private brand; bearer receipts do not establish native provenance; callback flow is fixture-only | Superficially smaller, fails restart/trust requirements | Rejected |

Serial dispatch is the initial implementation policy. It conforms to the
runner capability contract, reduces checkpoint races, and creates no
cross-worker inherited context. Parallel execution is outside this proposal.

## 7. Trust-boundary proof obligations

The trust base remains the verified pinned Core/adapter/runtime, the native
host binding and orchestrator-owned durable storage. Worker bytes and parent
task suggestions are untrusted inputs. A filesystem owner or administrator
able to replace all code, pins and records is outside the existing boundary;
SHA-256 and mode `0400` are integrity/custody mechanisms, not digital
signatures proving who executed a model. This design does not claim otherwise.

| Boundary | Enforcement in the proposed path |
| --- | --- |
| Worker cannot mutate canonical state | Existing fresh Claude Code/bubblewrap host; only sealed `/worker` read-only; no writable durable mount |
| Corpus instructions remain data | Pinned common preamble and role contracts; no parent conversation injection |
| Quarantine until validation | Native outputs stay under the exact call return root; no canonical consequence from a CLI PASS summary alone |
| Exact native dispatch required | Reopen invocation, host pin, stream, value and `native-dispatch.json`; reproduce every existing native binding check |
| Fresh/blind review | Derive required role/kind, exact producer context and withheld selectors; verify actual context differs, including conditional second reviewers |
| Simulation taint | Join taint across run, host, call, evidence, reviews and plans; any simulated dependency excludes live status and acceptance |
| Single canonical writer | New-format public/internal controls accept a work ID, not paths/bytes/callbacks; only authenticated controller transitions enter LedgerWriter |
| Core owns meaning and legality | Core constructs typed subjects and deterministic plans; parent/worker JSON cannot select an unregistered operation |
| Human authority separate | Existing exact gate workflow; no accepted worker return may create a human response, sign-off or acceptance state |
| Crash recovery | Authenticate intent and inputs before prepared semantic transaction replay; exact preimage/after-image and chain/checkpoint checks |
| Pins survive installation changes | Select the retained executable before mutation; no new bundle, current-main helper or profile substituted |
| No silent fallback | Unknown format/role/action, missing evidence, transport uncertainty and unmet capability halt explicitly |

For new-format runs, legacy generic write methods must reject unauthenticated
entry, even if a caller obtained a brand by calling the standalone validator.
The internal transition capability is minted only after work-item
reconstruction and full native acceptance verification. It is never exposed
as JSON. This capability is a process-local guard around a reproducible
durable proof, not the solution to persistence itself.

A malicious parent suggestion can at most propose eligible work/semantic
content for validation. It cannot use a valid unrelated return to select a
destination or render arbitrary canonical text. Every authored semantic field
in a plan must trace to a specific accepted return selector or a retained
human response; every mechanically derived field must name its Core rule.

## 8. Accepted-return lifecycle and cross-process authentication

Current retained evidence:

| Artifact | Identity retained / current limitation |
| --- | --- |
| `control/worker-assembly-inputs/CALL.json` | Explicit run/stage/role/kind/allowlist/withheld/task/producer-context/downstream tuples; parent populated; no DoD/checkpoint |
| `control/worker-bundles/CALL/` | `request.json`, exact Core parts, output contract and attachments; verified tree digest; run/model/isolation identity |
| `control/worker-returns/CALL/invocation.json` | Exact request, bundle root/digest, host receipt digest, no inherited context, no writable paths, exact result paths; read-only |
| Same directory, `host-capabilities.json` | Exact run-pinned receipt copy |
| `claude-stream.jsonl` | Live raw event stream, model/session/tool/completion evidence; absent in fixture callback mode |
| `native-return.json` | Canonical native structured value, bound to stream and dispatch record |
| `native-dispatch.json` | Invocation/bundle/host/value/stream digests, host evidence, dispatch receipt/context/taint |
| `raw.json` | Validator input bytes; currently rewritten by validation |
| `validation.json` | Call, contract/raw digests, result/errors/taint; currently rewritten |
| `validated.json` | Canonical validated data, with no JavaScript private fields or brand; currently rewritten |
| `ValidatedWorkerReturn` | In-memory call/data/raw/contract/validation digests, contexts/taint and private token; dies with process/module instance |

Current writer methods require the branded object for worker-derived input.
They do not accept `validated.json` as an authorization token. Semantic and
duplicate journals retain `raw.json`/`validation.json` references; material
journals retain the producer raw digest. Generic ledger receipts bind the raw
return digest, destination and chain, not a DoD/call/operation authorization.

Proposed `reopenAcceptedWorkReturn(run, workId, callId)`:

1. Resolve only the canonical run/work/call slots. Verify pins, capability,
   exact work record and its retained validation basis.
2. Reopen immutable native evidence and run the same full
   `verifyInvocation`/`readNativeDispatchRecord` logic used by accept.
   A hand-authored `WorkerDispatchReceipt` passed directly to the low-level
   validator is insufficient.
3. Recompute strict Core return validation and canonical bytes from the native
   value. Recreate the private brand inside the run-pinned module instance.
4. Compare computed raw/report/canonical digests and actual retained bytes
   against the immutable accepted receipt. Any altered derivative is a
   refusal, not an invitation to silently overwrite it.
5. Independently check that the intended current work transition can consume
   this accepted value or its explicitly authorized historical dependency.
   Shape validity is not work authorization.

Refactor validation into pure checking/canonicalization and separate
quarantine publication so reauthentication is read-only. First accept
publishes all derivatives and its receipt atomically as a sealed acceptance
set; repeated accept verifies and returns the same identity.

No provider call is repeated by reauthentication. No signature or secret is
invented. The persisted receipt is an index and binding of evidence, not a
bearer token; possession of it alone confers no write permission.

## 9. Proposed durable records and formats

All new records are strict, closed-schema UTF-8 JSON. Use a single declared
canonical serializer plus one LF; digest fields use `sha256:` plus lowercase
hex. Digest computation excludes only the record's own digest field.
Collections whose order is semantic retain order; sets have a specified
bytewise order. Unknown keys, duplicate keys, noncanonical numbers/encoding,
symlinks, path traversal and inconsistent digest/length pairs fail closed.
These rules do not retroactively reserialize existing Core formats.

The work identity is `WORK-` followed by the SHA-256 hex of its canonical
identity payload: run/pins, creation checkpoint, Core obligation selector,
ordinal, operation family and dependency/effect selectors. The stored record
digest additionally binds the complete record, including calls and basis.
Allocate call IDs and reserved canonical IDs once under the orchestration
lock and retain them before dispatch; retry never reallocates them.

Proposed adapter-owned slots:

```text
control/orchestration/work/WORK-id.json
control/orchestration/basis/<digest>/manifest.json
control/orchestration/blobs/<digest>
control/orchestration/dispatch/CALL-id-intent.json
control/orchestration/accepted/CALL-id.json
control/orchestration/commits/WORK-id-intent.json
control/orchestration/commits/WORK-id-consumed.json
```

| Format | Required content and lifecycle |
| --- | --- |
| `aleph-loa-work-item/v1` | Run/bundle/runtime/format/capability, stage/DoD/subphase/ordinal, creation checkpoint and chain head, Core selector/digest, operation family, exact accepted dependencies/selectors, source/subject/plan basis, required calls and restrictions; immutable |
| `aleph-loa-work-basis/v1` | Exact canonical inputs needed by pinned Core validation/derivation, relative path, digest and byte count for each, including absence assertions; content-addressed byte snapshots for mutable inputs and verified references for immutable corpus/runtime bytes |
| `aleph-loa-dispatch-intent/v1` | Work/call/request/invocation digests, pinned executable identities, dispatch attempt identity, owner/liveness record and reserved output slots; persisted before spawning |
| `aleph-loa-accepted-return/v1` | Work/call/run IDs; dispatch checkpoint; request/bundle/invocation/host/stream/native-value digests; validation-basis, contract/raw/report/canonical digests; context/producer-context, exact model, taint; immutable only after full acceptance |
| `aleph-loa-orchestration-commit/v1` | Work digest, accepted receipt/dependency digests, Core derivation selector, deterministic plan digest, prior checkpoint/chain, journal family/key and expected effects; immutable intent before canonical mutation |
| `aleph-loa-work-consumption/v1` | Commit-intent digest, exact committed transaction(s)/receipt identities, resulting checkpoint and chain, effects/subject IDs, next obligation or halt; immutable completion record |

The work record includes the full call tuple described in section 10; the
table is not permission to omit fields. Existing writer journals remain the
canonical after-image and chain record, with new-format authentication links.
Do not create a competing canonical ledger in `control/orchestration`.

The basis snapshot is host-only, never mounted to a worker wholesale. It
preserves the inputs required to rerun context-dependent Core validation after
later legal commits. Reuse immutable source/runtime references and
content-addressed blobs; do not copy whole source corpora for every call.
Initial implementation snapshots every canonical mutable file read by the
selected validator, with a complete manifest of reads/absences, rather than
guessing a smaller semantic dependency set. Missing snapshot coverage is an
error.

Mutable queue/cache/index files, if used, are reconstructible conveniences.
The authoritative pending work is derived from immutable work, intent and
consumption records. Publishing transport records does not increment the
canonical run checkpoint. This avoids circular “work digest contains the
checkpoint that contains that work digest” identities.

Write immutable sets to a private staging location, fsync files/directories,
then publish a final seal/manifest with exclusive creation. Never replace an
existing different sealed record. A partially published acceptance set has no
accepted receipt and authorizes no write. Recovery compares already published
members against recomputation before completing the seal.

## 10. Stage/DoD work-item identity

The Core work selector returns an exact obligation, not a free-form instruction.
The adapter adds host transport identity to that obligation.

Each worker call binds:

- run ID, run-format, capability and all pinned bundle/Core/adapter/checker/
  protocol/runtime/profile identities;
- stage, closure subphase, stable DoD selector, exact stage-contract bytes/
  digest and a monotonic work ordinal;
- call ID, role, producer/refuter kind, exact task line and output-contract
  selector/digest;
- exact allowlist paths and byte digests, withheld selectors with Core policy
  references, and the digest of the complete sealed request;
- actual producer context where required, fresh-context requirement and
  permitted exact model;
- downstream operation tuples and Core-derived restriction digest;
- creation/dispatch checkpoint, ledger sequence/head, prerequisite hashes and
  explicit absence assertions;
- source cursor/batch identity, semantic subject ID/digest and output selector
  when applicable;
- intended writer operation/plan family and permitted dependency/effect slots.

A call belongs to exactly one work item. Its new semantic effects are consumed
once. A producer return containing multiple candidates is retained once and
expanded into a finite Core-derived candidate accounting set; every output
selector gets a disposition. Each child review/admission transition names its
parent consumption record and exact selector.

Historical producer/reviewer evidence may be reused **only as a dependency**
of the Core-defined continuation for the same subject lineage. That is not
permission to replay its original work item. Reauthenticate it against its
original immutable validation basis, then validate its current applicability
against the new work item's current prerequisites. Reservation and review
transactions legitimately change checkpoints; do not demand that a producer's
original dispatch checkpoint equal every later admission checkpoint.

By contrast, an unconsumed return for a stale checkpoint has no implicit
continuation. Refuse it and retain the evidence. No “latest accepted file”
search, matching by role alone, or rebinding to a newly convenient subject.

## 11. Writer-plan ownership and bounded Core additions

Proposed pure Core interface, specified here conceptually rather than as
implementation:

```text
selectNextWork(pinned contracts, canonical model, completed work evidence)
  -> exact local transition | exact worker obligation | human gate | halt

deriveWorkTransition(exact work, authenticated value selectors,
                     canonical model, retained human records)
  -> bounded Core plan + required review/dependency set + resulting DoD state
```

Core determines operation kinds, role/contract bindings, required artifact
paths, field provenance, review obligations, stage predicates, and canonical
rendering. The adapter schedules, loads verified files, authenticates transport
and performs journaled I/O. A deterministic ordering among otherwise eligible
items is stage → dependency order → retained source/batch order → subject/
candidate ordinal. This is scheduling, not a semantic ranking.

Existing `planSemanticWrite` (`semantic-review.ts:1786`),
`planDuplicateWrite` (`duplicate-review.ts:1721`) and
`planRepresentationUseWrite` (`source-representation.ts:1053`) are reused as
validators/composed-plan authorities. They currently accept `proposedModel`
and `writes`/`subjectWrites`; they do not derive all those bytes from an
accepted return. Tests fill that missing role. The new Core derivation layer
must do so without copying semantic policy into adapter render callbacks.

The additions are bounded:

1. Stable executable DoD/operation bindings for S0–S4, including stage
   entry/exit and source-work dependencies. Keep the existing stage order and
   human/judgment/deterministic distinctions.
2. Pure mechanical serializers from existing Core return fields and templates
   for inventory/criteria, packet/event/cursor accounting, verification
   records, relation closure, and T5.1/T5.2/material-impact records. Invoke
   existing subject constructors, predicates and plan validators.
3. Exact host-neutral binding for S1 criteria review, which is currently only
   a stage obligation. Proposed role `criteria-reviewer` receives the frozen
   criteria plus identical bounded source samples and no intake rationale,
   other reviewer output or downstream state. Two fresh independent passes
   return per-sample candidacy judgments with criterion references and the
   common verdict/rationale/attacks fields. Matching determinate judgments
   and upheld criteria reviews discharge the existing agreement spot-check;
   disagreement/indeterminacy leaves S1 unmet. Core retains the chosen sample
   subject before dispatch; sampling scope cannot be silently changed after
   seeing the first result. Sample selection is a recorded bounded
   orchestration proposal, structurally checked for exact frozen loci, not a
   deterministic claim of representative coverage. A reviewer can refute its
   adequacy. No numeric recall threshold is introduced.
4. Expose the existing local/global relation producer and L3R charters through
   exact role/task selectors. Proposed adapter roles `relation-producer` and
   `verifier-l3r` map only to those Core charters; Core resolves the shared
   relation-output contract directly. A new role name does not grant broader
   context. Existing S2/S3 semantic relation proposals remain proposals.
5. A bounded Core plan for multi-file S1 finalization and packet/walk-only
   transactions. S1 `corpus/manifest.md` is outside the current generic
   writer allowlist. A no-packet walk step has no fabricated material-use row.
   Neither case may be solved by widening arbitrary path writes.

The S1 sample proposal is metadata in a registered work-preparation operation,
not a canonical conclusion or authority record. Other semantic orchestration
choices use the same constrained proposal mechanism when the existing Core
contract permits choice. A parent cannot propose “skip this DoD,” choose a
writer path, alter a reviewed field or declare a checker result.

No rewrite of the existing Core semantic/duplicate/material/ambiguity rules,
no generic correction calculus and no new research policy are proposed.
Deterministic review predicates consume model judgments; they do not decide
whether the judgments are true.

## 12. Writer surface inventory and safe routing

Every current worker-derived writer entry is below. “State effect” refers to
actual writer behavior, not a later desired stage transition.

| Operation | Required inputs / Core authority | Window, outputs, transaction and recovery | State effect / proposed route |
| --- | --- | --- | --- |
| `append` (916) | One authentic branded value plus arbitrary caller renderer today; no generic role/reviewer check | Canonical prefixes/files only; Slice 5/material/semantic/duplicate path guards; generic ledger journal | Chain/ledger and resume sequence advance; replace new-format caller rendering with registered Core operation only |
| `reserveMaterialUse` (951) | Producer brand, Core-checked material row, renderer; producer context; no review yet | Owner stage S2/S3/S4, pre-C1; `RES-material-*` and immutable material review view; canonical PKT/CC/REL not admitted | No ledger/checkpoint advance today; new controller journals subject preparation before review dispatch |
| `appendMaterialUse` (1002) | Producer plus row/after-images; Core material plan; fresh accepted L2F for required CC/REL uses; exact reservation equality | S2–S4 owner stage/pre-C1; PKT+walk+lineage, CC+lineage or REL plus USE; material after-image journal rolls forward | Ledger chain/checkpoint advance, no automatic stage progression; CC admission in 1.7+ must use composed semantic plan |
| `appendMaterialFindings` (1100) | Validated material findings; Core `materialFindingRows` | OBJ USE rows, no invented claim; calls material writer per finding | Each effect idempotent by subject; controller accounts for entire finite finding set and any partial completion |
| `executeSemanticWrite` reserve-subject | Producer plus exact SEM subject, ID, next files, prerequisites | Core `planSemanticWrite`; SEM ledger/immutable subject, S2/S3/S4 before stage/C1 seal | Semantic journal, acceptance refs, chain/checkpoint; no claim admission |
| Same, assign-review | Producer/dependency, exact assignment/profile/call and subject | SEM ledger + immutable assignment; Core accepted binding validation | Same journal; pending assignment must survive interruption |
| Same, record-review | Producer plus accepted fresh L2S review; exact role/context/subject; L2F remains separate | SEM ledger + immutable result + stage VER companion | Retain refuted/cannot-determine as results, not admission authority |
| Same, resolve/admit | Producer, all required reviews, Core outcome and applicability predicates; L2F if required | SEM resolution; admit may compose CC, LIN, USE, S4 merge map; exact prerequisites/preimages | One semantic/composed transaction; current APIs accept test-authored after-images, proposed Core derives them |
| Same, seal | Core S2/S3/C1 closure plan; current method still takes producer parameter | Run log and S2/S3 prefix seal; C1 composed elsewhere | Do not invent a worker value for a local closure; new controller uses deterministic-plan provenance |
| `executeDuplicateWrite` initialize / record-discovery | Empty accepted list can be legal for initialization; discovery requires exact accepted discovery/sweep bindings | DUP ledger / immutable DCD; S4 pre-C1 | Duplicate journal; no assumption all nine operations require a producer |
| Same, reserve-subject / assign-review / record-review | Comparison producer and exact DUP subject; L3 assignment and accepted fresh L3 result as applicable | DUP ledger + exact subject/assignment/result/VER artifacts; Core quorum/context predicates | Duplicate journal retaining acceptance refs |
| Same, decide / record-effect | Exact retained accepted inputs and Core outcome/quorum/effect predicates | DUP decisions/effects; cannot infer equivalence or clear failed history | Duplicate journal; immutable resolution/effect accounting |
| Same, admit | Comparison/L3 plus successor normalizer/L2S/L2F dependencies as required | One DUP+SEM+CC+LIN+map+USE plan with `duplicateAdmissionSubplans` | Atomic composed effect; exact Core admission and recovery validation |
| Same, seal | Deterministic closure, no invented judgment | C1 run log under composed closure plan | Closure evidence, not semantic acceptance |
| `appendProceduralAuthorityResponse` (1237) | No worker brand; exact retained canonical human request/response, Core T5.3 builder | S4-C2; internal ambiguity ledger; generic ledger journal plus halt/state follow-up | Already reached by resume; new controller preserves human provenance and ties phase completion to recovery |
| `openProceduralAuthorityFollowup` (1312) | Core follow-up plan, existing T5.3, material-impact subject + exact upheld review basis, M/Q history | S4-C2; exact Q+1 request via authority journal | Gate/halt/checkpoint; cannot supply meaning or candidate selection |
| `replace`, `remove`, `retarget` (1423–1455) | Replacement/retarget require brand but always refuse; deletion also always refuses | No supported canonical mutation | No new escape hatch |
| `advanceSlice5ClosurePhase` (1457) | Core relation/ambiguity checks; cumulative material/SEM/DUP seals | C1: material journal with composed seal subplans; C2/C3: log write then state update today | C3 closes stage; wrap new-format C2/C3 in an authenticated journaled transition |
| `enterS5AfterSlice5Closure` (1582) | Complete C1/C2/C3, unblocked, pinned Core structural recheck | Append S5 entry if absent, then update state today | Already resume-reachable; new-format transition binds both effects durably |

Relations and lineage have no dedicated current writer method. They enter
through generic append in older formats and through material/semantic/
duplicate composed paths where applicable. `assertSlice5WriteWindow:178`
enforces relation S4/pre-C1 and ambiguity C2 windows. `commitAppend:1131–1168`
blocks late lineage after S4 and preserves unrelated halts. These guards are
necessary but not a complete production derivation layer.

Prerequisites are family-specific: material inventory/reservation/view;
semantic subject/producer/assignment/result plus immutable sources and
stage-prefix history; duplicate catalogue/member basis/provenance/semantic/
material/lineage/accepted execution evidence; ambiguity C1 relations,
source expression/search/review/material-impact and exact Core authority
requirements. Current Core semantic/duplicate planners calculate broad
prerequisite sets in addition to caller paths. Preserve that coverage.

**One controller and one commit envelope can route the operations; one generic
semantic writer cannot safely derive them.** Use stage/family-specific Core
derivation branches and existing composed validators. The new writer accepts
only that verified transition, never `{path, text}` from the CLI. Local
preparation/seal/gate operations have explicit no-worker-input types; they
cannot be selected to avoid a required worker result.

## 13. Proposed stage progression

| Frontier | Controller work and commit obligations |
| --- | --- |
| S0 | Existing preflight, capture and exact human freeze; recover before selecting S1 entry; no agent-generated authority |
| S1 | Intake return → Core T2.1/T2.2 finalization preserving source IDs/loci/hashes and human sensitivity rulings; retain criteria review sample/assignments/results; new sensitivity surprise halts; criteria and review precede packets |
| S2 primary walk | Select first incomplete source/cursor from retained order; construct Core extractor view; authenticate return; reopen exact fragments from frozen source; commit packet/evidence/event/interval/cursor as one logical transaction; preserve worker cursor reason; zero-packet/degraded work still accounted |
| S2 review | Every semantic candidate gets its required L2S subject/assignment/result; L1 separately challenges terminal source coverage; gap candidates reconcile through exact evidence and events, without future IDs in open findings; complete source only on existing Core predicates |
| S2 exit | All due accounting/reviews closed; Core S2 prefix seal, log exit, S3 entry/checkpoint through deterministic transition |
| S3 | Deterministic packet/origin batch identity; accepted normalizer → reserved CC/no-claim subject, L2S and required L2F/L2 work; composed admission or unresolved/revision state; immutable predecessor history; then S3 seal |
| S4 before C1 | Complete Core duplicate catalogue/windows, independent L5 sweep, comparison proposals, L3 quorum and exact successor normalization/L2S/L2F; Core composed admission; retained local/global relation proposals receive L3R and required material review |
| S4 C1 | Complete relation closure and cumulative representation/SEM/DUP checks; exact C1 marker/seals in one composed transaction; no C2 mutation of these subjects |
| S4 C2 | Accepted ambiguity producer → immutable expression/search/review subject; fresh ambiguity review → legal T5.1/T5.2 state; material-impact producer/reviewer → exact reviewed Class B/C scope; Class C opens the Core-derived human gate; T5.3 and M/Q follow-ups remain separate |
| S4 C3 | Recheck complete C2, close C3 and enter S5 deterministically, recovering missing entry exactly once |
| S5+ boundary | Preserve known stage contracts and restrictions; do not advertise later work families until separately implemented and tested. An unsupported operation returns an explicit capability halt, never fake completion or a fabricated human gate |

This proposal completes the reachability design through the currently
implemented Slice-8/S4 frontier. It is not a design claim that all S5–S13/P
semantic transitions are implemented. The same controller can later register
those Core-authorized families without changing the operator abstraction.
F-03 closure evidence must name the supported frontier rather than imply full
Aleph acceptance from a bounded small-corpus trace.

## 14. Transition ordering and state machine

New-format state progression:

```text
VERIFY → RECOVER → SELECT
  → LOCAL-PLAN → COMMIT-INTENT → WRITER-PREPARED → WRITER-COMMITTED → CONSUMED
  → WORK-SEALED → PREPARED → DISPATCH-INTENT → DISPATCH-RETAINED
      → ACCEPTED → DERIVE → COMMIT-INTENT → WRITER-PREPARED
      → WRITER-COMMITTED → CONSUMED → CHECK-DOD → SELECT
  → HUMAN-GATE / EXPLICIT-HALT
```

Actual required order:

1. Select the run-local executable using verified original pin identity.
   Read minimal identity/lock/snapshot safely before recovering mutable
   canonical state. Full Core validation may legitimately fail on a prepared
   transaction's partial after-images, so do not require it before recovery.
2. Acquire one durable orchestration lock. All new-format mutating controls,
   including authority responses and internal transport state changes, obey
   it. Lock order is orchestration → existing family lock. Do not reacquire a
   family lock inside its already locked helper.
3. Authenticate pending commit intents and linked input evidence. Recover the
   referenced family transaction, then reconcile consumption. For old-format
   runs invoke the retained old recovery behavior, not new semantics.
4. Run full pinned state/chain/corpus/Core verification. Enumerate pending work
   fail-closed; multiple unrelated active intents or ambiguous ancestry halt.
5. Derive the first unmet Core obligation. Recover/reuse its existing work
   identity before allocating a new one. Gate/halt takes precedence over new
   semantic work.
6. Commit any required local preparation through its registered Core plan:
   exact selection/view, reserved IDs/subjects and assignments. These records
   precede reviewer dispatch. Their checkpoint becomes the worker item's
   creation checkpoint.
7. Publish immutable worker item and validation basis. Materialize assembly
   input from it, seal bundle and invocation, and verify their exact equality
   to the work tuple. Return the transport action to the skill.
8. Before native spawn persist dispatch intent; release the short mutation
   lock while the fresh host runs. The active dispatch reservation prevents
   other semantic work. A human stop/contamination halt can still be recorded;
   its changed checkpoint prevents a late return from committing.
9. Native host retains stream and native value, then dispatch receipt last.
   Reacquire lock to seal completion. No output record means “not known
   complete,” not proof that the provider was never called.
10. Accept verifies native evidence and Core return against the retained basis;
    publish derivative bytes and accepted receipt. No canonical mutation yet.
11. Skill calls resume. Under lock reauthenticate acceptance, check current
    work/checkpoint/prerequisites, reconstruct required historical dependencies,
    and derive the exact Core transition.
12. Persist commit intent, then prepare the appropriate writer transaction.
    Bind both to work/acceptance/plan identities and exact before state.
13. Apply canonical after-images, then chain receipt(s), then run checkpoint,
    then mark writer transaction committed, following existing journal family
    semantics. Readers of new runs must recover or report pending state rather
    than expose a partially committed logical effect.
14. Publish consumption only after verifying the committed transaction and
    resulting chain/checkpoint. This final record cannot itself advance a
    second semantic effect.
15. Rerun due stage checks. If a reviewed result requires further work, retain
    the failure/unresolved state and schedule that exact successor. Otherwise
    commit stage exit/entry through its registered deterministic transition.
16. Continue local transitions or return the next exact transport work item;
    stop only on the recorded gate/halt or the current supported frontier.

The new envelope supplements existing journals; it must not create a second
writer that competes with them. S0 and human-authority transactions retain
their distinct provenance. No ordering lets a worker acceptance stand in for
a human decision.

## 15. Crash/recovery matrix

| Crash point | Required recovery / refusal |
| --- | --- |
| Before work seal | No active work; discard only unsealed adapter-owned staging after checking ownership; derive same obligation |
| After work seal, before assembly | Reuse exact item/IDs/basis; create missing sealed bundle only from it |
| Partial bundle/invocation publication | Verify existing members; complete from the recorded item or halt on conflict; never broaden attachments |
| After prepare, before dispatch intent | Return same prepared call; no new model execution has been authorized yet |
| After dispatch intent, before known completion | Check recorded owner/child liveness; do not duplicate a live call; if outcome cannot be established, retain `DISPATCH_OUTCOME_UNKNOWN` halt |
| Provider completed, process died before evidence seal | No accepted result without complete verifiable retained native evidence; no automatic redispatch or fabricated stream |
| Stream/value written, dispatch receipt absent | Partial quarantine; a still-active trusted dispatcher may finish; otherwise halt as uncertain, retain bytes |
| Complete native receipt, before accept | Reopen evidence and accept without another provider call |
| During acceptance derivative publication | No accepted receipt yet; compare all existing bytes to recomputation, complete exact set or refuse alteration |
| After accept, before resume/plan | Reopen sealed acceptance and basis, reproduce brand; require unchanged current work applicability |
| After Core derivation, before intent | No canonical effects; deterministically derive same plan/IDs again |
| Commit intent exists, writer not prepared | Reauthenticate and rederive exact matching plan; prepare only if before checkpoint and prerequisites remain valid |
| Generic append prepared, target still before | Existing generic recovery rolls back that journal; controller may rederive/retry same work/effect under same unchanged inputs; no consumption yet |
| Material/SEM/DUP prepared, no/partial after-images | Authenticate linked work/evidence first; use existing family forward recovery for exact preimage/after-image mix; unknown bytes halt |
| Canonical bytes written, chain absent | Reproduce only the journal's exact chain after-image |
| Chain written, checkpoint old | Advance to journaled checkpoint once; no worker rerun |
| Checkpoint advanced, journal not committed | Verify expected identity/chain/effects and finalize journal |
| Journal committed, consumption missing | Verify committed receipt(s) and create exact consumption; do not rerun renderer or write a second effect |
| Consumed, stage log/state not advanced | Run next registered local stage transition; retain Core S2/S3 prefixes/C1 and old history |
| Authority response/T5.3 committed, halt transition incomplete | Existing gate/ledger recovery plus exact Core response consequence; no generated decision |
| Unexpected prerequisite or pin mutation anywhere | Refuse, preserve evidence and unrelated halt, report precise conflict |

Exactly-once **canonical effects** are required. Exactly-once provider billing
across a killed external process is not claimed. An uncertain dispatch is a
durable operational halt; retry requires an explicit recorded disposition and
a fresh call identity within the existing budget/authority rules. It is never
a silent fallback or deletion of the uncertain attempt.

For a new-format retry after a pre-write rollback, retain the rolled-back
attempt and use a distinct attempt journal identity linked to the same work
and logical effect. Do not overwrite the only rollback receipt merely because
the next ledger sequence is unchanged. The new-format journal link/attempt
extension is capability-gated; old bundles retain their original journal
grammar and recovery behavior.

## 16. Idempotency and replay refusal

| Input/repetition | Result |
| --- | --- |
| Resume repeated before dispatch | Same work/call/request IDs and byte-identical sealed input; no duplicate assignment |
| Repeated dispatch request | Return existing complete evidence status; if active, report in-flight; if uncertain, halt; never spawn twice for one intent |
| Duplicate native return | Identical retained set is a no-op; any differing value/receipt/stream under same call is a conflict |
| Repeated accept | Read-only reauthentication of identical sealed acceptance; FAIL if derivatives changed |
| Accepted return with no commit | Resume completes only the intended current work or refuses stale applicability |
| Prepared transaction | Family recovery, with new work/evidence authentication before mutation |
| Committed transaction, old/missing progression metadata | Reconcile journal/checkpoint/consumption before selecting new work |
| Already consumed return | Return original consumption evidence; no new append; unrelated work cannot borrow the return |
| Earlier-checkpoint unconsumed return | Refuse even if schema, role and model match |
| Changed canonical prerequisite after accept | Refuse fresh commit; if own prepared journal explains exact permitted after-images, recover that journal only |
| Same producer needed for review/admission | Allowed solely as a Core-bound dependency of its consumed subject continuation; reauthenticate original evidence and current applicability |
| Multiple candidates/finding effects | Finite selector/effect IDs from Core, deterministic order and completion accounting; resume completes missing effects without duplicating committed ones |
| Altered task/allowlist/withheld/restriction/subject | New identity required; old acceptance cannot authorize it |
| Repeated C1/C2/C3/S5 progression | Verify prior seals/receipts and missing transition; never reopen a closed write window |

All new-format writer ingress must enforce these rules, not just the happy
path in `resume`. The low-level `validateWorkerReturn` helper remains a
validator and cannot independently mint a commit authorization.

## 17. Future file-by-file implementation map

This table is proposed future work, not authorization to edit these files.

| Classification | Future path(s) | Smallest responsibility |
| --- | --- | --- |
| Core change | `scripts/lib/work-transitions.ts` (new) | Pure first-unmet selector, typed preparation/transition derivation, exact field provenance and operation/path bounds; call existing Core libraries |
| Core change | `docs/architecture/04-pipeline-stages-and-dod.md`, `docs/architecture/templates/01-run-control.md` | Stable executable obligation selectors and 1.9 transition evidence contract, preserving existing DoDs |
| Core change | `docs/architecture/prompts/verifier-lenses.md`, `workers-intake-extraction.md`, prompt README | Exact S1 criteria-review contract; explicit shared relation contract selection; preserve L3R semantics and blind lists |
| Core change | `scripts/lib/run-model.ts`, new transition contract tests/fixtures/checks | Cumulative 1.9 capability; structural work/effect accounting only for applicable new agent runs; old formats unchanged |
| Core change | Existing semantic/duplicate/material/ambiguity/lineage/relation modules, only where needed by pure derivation | Reuse exported constructors/predicates; add mechanical derivation helpers without changing semantic policy |
| Adapter source | `adapters/loa/src/orchestration.ts` (new) | Durable controller, work/intent/acceptance/consumption reopening, lock and family routing |
| Adapter source | `adapters/loa/src/cli.ts` | Route ordinary resume into controller; continue deterministic steps; preserve file-driven human controls and report explicit next action |
| Adapter source | `adapters/loa/src/run-control.ts` | New-format orchestration locking, pending/recovery visibility, checkpoint and stage transaction coordination |
| Adapter source | `adapters/loa/src/worker-bundle.ts` | Derive/verify new work-bound request; exact S1/relation role mapping; reject free input paths for new runs |
| Adapter source | `adapters/loa/src/worker-dispatch.ts` | Resolve work ID into immutable inputs, dispatch intent/liveness, acceptance publication and read-only native evidence reopening |
| Adapter source | `adapters/loa/src/worker-return.ts` | Separate pure validation from output publication; compare immutable retained derivatives before reconstructing brand |
| Adapter source | `adapters/loa/src/ledger-writer.ts` | Require authenticated work transition for new-format semantic ingress; family journal links and deterministic local operations; preserve composed validators |
| Adapter source | `adapters/loa/src/types.ts` | Closed versioned work/acceptance/commit/result types and exact role IDs; no serialized brand |
| Adapter source | `adapters/loa/src/core-loader.ts` | Load exact transition selectors and shared output-contract references from pinned Core; no mutable-main fallback |
| Adapter source | `adapters/loa/src/runtime-snapshot.ts`, `launcher.ts` | Verify new capability; dispatch existing-run commands to retained code before mutation; reject runtime mismatch |
| Adapter source | `adapters/loa/src/claude-code-host.ts` | Only if required for retained child-process/dispatch liveness evidence; preserve isolation policy and exact binaries |
| Protocol/schema | New adapter-owned control schemas/types; Core 1.9 binding contract | Strict versioned records; no change to thirteen manifest capability meanings or native receipt's provenance class |
| Skill | `adapters/loa/skill/loa-aleph/SKILL.md` | Replace hand-authored assembly/“may be given” gap with controller-issued work/action loop; no direct canonical file edits |
| Command shim | `adapters/loa/command/loa-aleph.md` | Preserve public grammar; accurately describe resume progression and pinned-runtime routing |
| Tests | New production-surface orchestration suite, plus five writer/process suites | CLI/installed entry, fresh-process fault injection, authentication/bypass mutations; retain helper tests with structural labels |
| Runtime projection | `runtime-js/adapters/loa/src/` and `runtime-js/scripts/lib/` affected counterparts | Compiler output only; regenerate from exact source and check parity |
| Packaging | `core.manifest.json`, adapter manifests/profiles, release/install fixtures and runtime inventory | Register exact files/roles/capabilities, versioned immutable bundle, source/runtime/install parity; Hermes remains planned |
| Documentation | Agent runbook, orchestrator prompt, adapter README and separate implementation reconciliation | Document executable ownership/limits; preserve historical findings and governance records |

No calibration harness, replay executor, answer key, preparation receipt,
fresh-VM workflow or SRC-001 attempt schema is a runtime dependency.

## 18. Compatibility and versioning decision

Propose **run-format `1.9.0-provisional`**, cumulatively retaining 1.0–1.8,
with Core capability **`orchestrator-work-transitions`**. Justification:
stable work/DoD evidence and the missing S1 executable review contract add
requirements that cannot silently be imposed on retained 1.8 runs. A new
adapter build with unchanged run format would suffice for transport
reauthentication alone, but does not express this complete product-path
contract.

Keep adapter protocol **`1.0.0-provisional`**. Its existing full-mode floor
already requires validated return → single writer and durable resume; no
fourteenth manifest capability or protocol wire replacement is needed.
Version new adapter-owned records independently at `/v1`, and bump the Loa
adapter/bundle release identity for the implementation. Exact future release
number is packaging allocation, not a choice that changes semantics.

The Core capability applies its machine orchestration evidence requirements
to agent execution. It does not require a manual operator to fabricate Loa
control files, native receipts or host contexts. Manual canonical artifacts
and human-review identity remain governed by their Core contracts.

Old run directories retain every byte and original bundle/runtime. They do
not acquire work items, new roles, new receipts or new stage behavior.
Existing-run launch routes to the retained executable; unsupported or missing
retained runtimes halt. No import from the new installed Core substitutes for
old run execution. New semantics require a new run and, where corpus intake
is involved, the existing successor-run procedure. Backport/migration is not
part of this proposal.

Protocol overview header at the starting tree still names 1.5, while the
manifest/registry select 1.8 and later sections describe 1.7/1.8. Runtime
selection must use exact locked machine identity, not infer a version from
that stale prose header. This proposal does not repair that header.

## 19. Required implementation test matrix

Every positive test must name its execution class. Synthetic host records and
fixture callbacks remain structural evidence. Test-only fixture injection may
replace the native transport boundary; it may not call the writer, construct
the plan, advance the stage or author post-S0 canonical semantic artifacts
for the production-surface test.

| ID | Required test / decisive assertion |
| --- | --- |
| F03-T01 | Install bundle, start via launcher, submit fixture-human S0 response, invoke supported resume; controller itself selects S1 and constructs work; no direct writer imports |
| F03-T02 | Fixture-authenticated return through exactly that flow → canonical Core artifact, writer transaction, chain/checkpoint/consumption; test does not supply after-images |
| F03-T03 | Separate native-authorized integration run uses real pinned host, stream and dispatch receipt through same surface; no fixture callback |
| F03-T04 | Worker attempts write outside `/worker`; canonical state unchanged, dispatch rejected; inspect actual mount/process evidence |
| F03-T05 | Valid return replayed to another run/work/call/subject; each refused before canonical writes |
| F03-T06 | Wrong stage/subphase/DoD, wrong checkpoint and missing predecessor consumption; each independently refused |
| F03-T07 | Alter `validated.json`, raw/report bytes, native return, invocation, dispatch receipt and stream separately; no silent regeneration of accepted evidence |
| F03-T08 | Kill accept process after complete acceptance; fresh installed resume reauthenticates and commits without inherited JS object or provider rerun |
| F03-T09 | Kill process at each prepared writer boundary, including generic pre-write rollback and multi-file partial publication; fresh resume recovers exact result |
| F03-T10 | Repeated resume/dispatch/accept and consumed-return presentation; one logical effect and one chain occurrence per effect; no duplicate IDs/rows |
| F03-T11 | Commit complete but consumed record absent; resume reconstructs consumption without invoking renderer again |
| F03-T12 | Changed canonical prerequisite after accept; refuse; distinguish own exact prepared after-image from unrelated edits |
| F03-T13 | Simulation taint in any host/return/reviewer/gate dependency; never lose marker or reach accepted/full-live evidence classification |
| F03-T14 | Producer context reuse, prior-review leakage, changed allowlist/task, second-review context reuse; real sealed delivery and acceptance refuse |
| F03-T15 | Old 1.0–1.8 retained runs after new installation execute old pinned semantics with byte-preservation assertions; marker injection cannot opt in |
| F03-T16 | TypeScript/runtime-js identical control results and refusal tokens; compile drift check and generated inventory |
| F03-T17 | Offline install/release verification, installed Node-floor execution, exact runtime selection and reproducible bundles |
| F03-T18 | Mutation removes accepted-return authentication from controller/writer ingress; test must detect illicit write attempt before canonical effects |
| F03-T19 | Standalone validator brand plus malicious renderer/after-image/path submitted via every exposed route; new-format writer refuses |
| F03-T20 | No-packet S2 interval/cursor, multiple fragments/candidates, shared-position siblings, L1 reconciliation and degraded evidence; no cursor without its required accounting |
| F03-T21 | S3 claim/no-claim/unresolved and material/semantic composed admission, then S4 duplicate successor; exact accepted dependencies survive process exits |
| F03-T22 | Nonempty relation producer → L3R → required L2F → C1 and four Slice 5 worker roles → actual T5.1/T5.2/material records; no static closure baseline |
| F03-T23 | S1 criteria reviews remain independent, disagreement blocks, new sensitivity halts, all inventory source identities and authority rulings preserved |
| F03-T24 | Concurrent resume/authority/dispatch, stale/dead locks and unknown external-process outcome; no duplicate spawn or semantic effect |
| F03-T25 | Lost prerequisite/basis member, ambiguous pending work, missing/extra effect selector and forged consumed receipt; fail closed |
| F03-T26 | Late lineage proposal after S4 through product control flow; no unauthorized rewind or mutation, correct durable halt, unrelated halt preserved |
| F03-T27 | Source/runtime/package authentication mutation and changed installed bundle during retained-run resume; exact pin enforced before recovery |
| F03-T28 | S0 recovery, generic gates, T5.3 apply-once, Q+1 and C3-before-S5-entry remain reachable and unchanged in authority meaning |

Run existing Core conformance/mutation, worker-return, adapter/host, Slice 5,
representation, semantic, duplicate, installer/runtime/bundle/release suites.
Tests must assert the intended failure token and unchanged canonical bytes;
“nonzero exit” alone is insufficient. Live testing requires its own
authorization and budget. None is authorized by this design task.

## 20. F-05 implications

Once implemented, genuine work routing can reach:

- S2/S3 structural lineage outcomes, source-walk-linked packet effects, and
  no-claim closure through accepted producer/reviewer dependencies;
- S4 duplicate/merge successor admission through exact DUP/SEM/material/LIN/
  map composition;
- relation eligibility/currentness and the immediate C1 closure boundary;
- a proposed late structural correction arriving after S4, which must reach
  the existing Core refusal/halt rather than a manually invoked test helper.

That does not prove F-05. Current 1.7/1.8 generic append guards can reject an
attempt before the older generic `LATE_UNIT_LINEAGE_CORRECTION` branch.
The new Core transition controller must preserve the intended late-correction
halt semantics at the registered semantic entry, not rely on a fortunate
error order in a generic method.

F-05 needs separate implementation-path evidence for genuine late discovery,
unchanged canonical lineage/relation bytes, preserved predecessor history,
durable halt and unrelated-halt preservation, restart behavior, and the
absence of an unauthorized rewind/correction path. Positive S4 successor
evidence alone does not establish those negative later-stage properties.
F-03 implementation makes testing them possible; it does not close them.

## 21. Definition of Done and F-03 closure threshold

Producer design DoD:

- Exact canonical subject verified; clean isolated branch; preserved work
  untouched.
- Source-based classification and edge graph identify the missing production
  handoff and narrower existing authority paths.
- One architecture, process-boundary authentication, bounded plan ownership,
  work identity, ordering/recovery/idempotency, compatibility and tests are
  specified without implementing them.
- One proposal plus its required administration inventory entry is committed
  and pushed; no PR, merge, adoption or replay is performed.

Implementation DoD after separate adoption/authorization:

- Supported installed start/resume drives the declared S0–S4 frontier without
  developer-authored canonical semantic bytes, direct writer calls or manual
  helper execution.
- Exact native accepted evidence is reauthenticated and bound to the sole
  eligible work transition; Core derives all legal artifacts and consequences.
- Every relevant writer family has non-vacuous production-surface coverage;
  required review/authority gates and old pins survive all fault points.
- Runtime projection, packaging, installation and all required structural/
  negative tests pass at the exact implementation head.

Separate evidence levels:

| Level | What it establishes | F-03 status |
| --- | --- | --- |
| Design adopted | Human agrees to this architecture and scope | OPEN |
| Implementation authorized / merged | Work permitted / code present | OPEN |
| Structural fixtures and helper/process tests pass | Mechanisms work under declared synthetic conditions | OPEN |
| Supported production-path integration test passes | Executable control flow can join the components under test transport | OPEN |
| Real native worker execution passes | Exact native transport/acceptance observed | OPEN until canonical handoff/recovery chain and scope are proved |
| Live small-corpus run through declared frontier | Operator path, native accepted returns, actual canonical effects and durable recovery shown | Closure candidate, not producer self-closure |
| Fresh independent audit plus governing finding disposition | Exact trace, coverage, negatives and claims independently assessed; authorized closure recorded | May support `F-03 CLOSED` |

Required closure package: immutable installed bundle/run pins and exact
implementation commit/tree; operator command transcript; first-unmet work
records and sealed requests; real stream/native dispatch/return evidence;
passing reauthentication and accepted receipts; Core plan identities and
field provenance; canonical before/after bytes; LedgerWriter journals and
chain receipts; checkpoint and consumption records; fresh-process recovery
after accept and during a writer transaction; repeated-resume no-duplicate
proof; genuine human-gate records where applicable; no helper-authored
semantic shortcuts; independent audit/disposition.

The load-bearing trace must be:

```text
supported /loa-aleph path
→ accepted native worker return
→ production orchestrator handoff and work authentication
→ Core-authorized deterministic plan
→ canonical LedgerWriter transaction
→ exact canonical state mutation
→ persisted chain/checkpoint/consumption and recovery evidence
```

The live corpus must exercise nonempty extraction/normalization and the
declared S4 semantic families; manufactured fixture relations/C2 state do not
complete coverage. If a bounded corpus omits a family, additional native
scenarios or an explicitly narrower finding disposition are required.
No governing record inspected here permits closure at design or merge time.
The producer cannot self-certify closure. F-04/F-05 require their own
dispositions, even if F-03 is later closed.

## 22. Risks, open questions, non-goals and verification record

Risks that implementation/audit must resolve without weakening the design:

- Core plan validators are extensive but not complete production serializers.
  Moving test-authored after-images into a parent-generated JSON plan would
  preserve the defect.
- S1 review and relation dispatch bindings must be adopted explicitly as Core
  execution contracts. The proposed role bindings and conservative
  two-independent-review S1 predicate are part of this proposal, not an
  assertion that they already exist.
- Context-dependent historical validation needs complete retained inputs.
  Snapshot coverage and storage cost require measured implementation tests;
  missing evidence must never fall back to current state.
- Existing families differ in recovery behavior. Generic append can roll
  back before write; material/SEM/DUP roll forward. C2/C3 and S5 entry
  currently have separate log/state writes. The controller must preserve or
  explicitly journal these differences.
- Native process outcome may be unknown after termination. Deterministic
  canonical resume cannot guarantee exactly-once external execution.
- Broad parent filesystem access is not cryptographically confined by JSON
  digests. This proposal removes supported unauthenticated write controls; it
  does not claim to defend against an administrator replacing the entire
  local trust base.
- Path/platform portability is F-04, still open. Do not reinterpret a Linux
  trace as portability proof.
- Later stage families remain future work. Capability halts must be honest,
  and must not be described as human acceptance gates.

**Human design questions beyond adopting/rejecting this concrete proposal:
none.** Adoption must cover architecture B, the bounded Core additions
(including S1 review/role bindings), cumulative 1.9 capability gating and the
closure threshold. It must not be treated as implementation or live-execution
authorization. If any of those decisions is rejected, revise the proposal;
do not quietly implement an adapter-only substitute.

Explicit non-goals: implementing a repair in this task; changing generic
Core/adapter/runtime/schema bytes now; SRC-001 replay or preparation; solving
F-04; closing F-05; a generic arbitrary-file writer; serialized brands or
bearer-only authorization; model-created human authority; provider fallback;
parallel scheduling; a new service or database; run migration; general
rollback/rewind/correction; semantic truth validation by checkers; autonomous
merge/acceptance; sanctioned agent mode; production readiness or v1.

Investigation checks:

- Remote main/tree and isolated clean worktree verified; primary/ref/stash/
  existing worktree identity inventory captured for preservation comparison.
- Repository-wide symbol/call-site searches and direct source inspection of
  command, skill, launcher, CLI/control, transport, return, writer, pinning,
  Core contracts/templates/prompts, five writer test files and Slice 5–8
  reconciliations.
- Baseline `node scripts/validate-core-boundary.ts --json`: PASS, CB1–CB10,
  881 inventoried paths (600 Core, 52 Loa, 1 Hermes, 8 packaging, 220
  administration). Runtime used for this read-only check: Node `v22.22.0`.
- Proposal-state boundary check: PASS, CB1–CB10, 882 paths; only
  administration increases to 221. All reported Core, checker, adapter,
  payload and prospective lock/bundle digests equal the baseline.
- Read-only source/runtime call-graph discriminator: PASS. Both resume
  implementations have exactly the four authority/closure writer calls
  listed above and no worker acceptance, dispatch or semantic writer call.
  This is source characterization, not compiler-parity or execution proof.
- Scope comparison: removing the one proposal path from the new
  `files.repository_administration` list reproduces the starting manifest
  object exactly. Proposal structure, source-blob inventory and whitespace
  checks passed.
- No model/provider/worker dispatch, replay, run creation, schema edit, runtime
  build, source implementation, PR or merge was performed. Test suites were
  inspected, not represented as executed live evidence.
- Final scope/boundary checks and exact publication identities are reported
  with the producer handoff. The containing commit cannot embed its own final
  commit/tree/blob identity.

## 23. Exact source evidence inventory

The following inventory is of the **starting commit**, not generated outputs
or post-design source. It makes the investigation reopenable independently
of local worktree paths. All sizes are bytes; SHA-256 is over the exact blob.

| Path | Git blob | SHA-256 | Bytes |
| --- | --- | --- | --- |
| `AGENTS.md` | `a6c08d8b9b65e2f162a79a97d72f7b917c8b809c` | `d3d53618d45d524bebcc61b8051dd7fc34b8e4c40f77760c2dfcdafe69c233de` | 15916 |
| `core.manifest.json` | `e67a66de431ce7dc9619bebb913c121791800f02` | `a35b3f8bd6fe4ea47adff3764287143d568bc0c4a84f729ad8fc2c88d6f1fbb1` | 79612 |
| `adapters/loa/adapter.manifest.json` | `d51c9c152e9f03b316c0d62206db59902993b097` | `b65d82ddd5fcf3ca9469b46c23461c75a74728ff6426c048855baa2e0d5c9242` | 10405 |
| `adapters/loa/installation.map.json` | `56d3ac59133ca6b06e2d60a855c595fed2fad8f5` | `ca3098ba591c6256072b102f46c65a9970c73ead1d83895ebb69ea61b42481a4` | 612 |
| `adapters/loa/profiles/loa-default.json` | `a501336c7bd2c9355113ccc30a55c2ea2530eaac` | `0b4f16a71b4a785e07a2fc645b2e49f6cda5ade6aea51930aa003fcb9b475f6b` | 9594 |
| `adapters/loa/command/loa-aleph.md` | `141523200735200cb4ca8e6ac18823174f640420` | `e7f96d4ad0814eac1004ed228dbf6c2af63d2908fb81ea0cdb0c7bb194b6853c` | 500 |
| `adapters/loa/skill/loa-aleph/SKILL.md` | `f4f5cc498809859e63f8d6215d73c50a598b7f73` | `ee4814e344864d3fa8323dc504d1588493daf3cbc48fd15991474722bacfa0ba` | 10131 |
| `adapters/loa/src/launcher.ts` | `9962d31d74d2fe0a07c125a462f04e8b06bacd87` | `86a5acfb47767e800307f89965ad40e5726b9eb0b9944dc2aaff8885576d0697` | 25356 |
| `adapters/loa/src/cli.ts` | `19d407b0555d2571f7272a90a6c53af91f96387d` | `8581e57379b0e511e9f5336d0af4ba073530e9ac3efa8642122b91d3b6c09200` | 47754 |
| `adapters/loa/src/run-control.ts` | `129991d015aa3142533cd5a08b25e1a07df751ba` | `7dfa834013bfea4b68f2d9ed07a47cc119c3b2c7bbff91dba9727130ae82229a` | 53541 |
| `adapters/loa/src/worker-bundle.ts` | `9d260e1f670a726897a7d32fa5ddb8fb01fab595` | `04a4fe83f27e88d231f2664ed1add3860567bf08e609a90e294d8fb9941d2801` | 31874 |
| `adapters/loa/src/worker-dispatch.ts` | `ed65a06c94fd58e16bcfd67815bf0e12d9def4be` | `66e95687d7827623112ab08348876922ff95ff34a0d94f1950078231adff295c` | 44156 |
| `adapters/loa/src/worker-return.ts` | `792a6764ba6ce6a09446b4771b6b915b60897962` | `9a8ed14deb824756407abfa66312ae90274d388090327258faa701325c0dc18d` | 13754 |
| `adapters/loa/src/ledger-writer.ts` | `6cf7aa0917cda9cf5ee60a85340b7908692f9f4b` | `db1a7078dd1b38b55f80548edab32d0c3f307c4119c14f97a5522e80880cba57` | 86183 |
| `adapters/loa/src/core-loader.ts` | `3c2ba5bbb08fd0a9d0edb21a1c9e406b749a3aff` | `c4cb6c357ee228b4c325c4e9a252b0840d413bc098fbc56b0e428bf1caf494a0` | 8980 |
| `adapters/loa/src/types.ts` | `4dcf9d69f238fe1eda67fa91c163637a2fcddeb4` | `03d1f256faf0ebb751804a2676cb756c6945e9dfb8a1bf39e98c8e44ac81793f` | 13785 |
| `adapters/loa/src/runtime-snapshot.ts` | `751d58d8245d5271e94aef4072a060390dbb04a4` | `752f54f0bf4f08e91c3ec6dd2b710933b7a58214c4e14445caeb0b072333af3e` | 23836 |
| `adapters/loa/src/claude-code-host.ts` | `c1e542ec941df2c9586edd9346b0c0bc33736694` | `ec41912b995481c7c88f00d3bce14aeff5a4a4af201abd33805414eeee012b58` | 43373 |
| `adapters/loa/src/fs.ts` | `4cc394010c8e8f4d656989fc1134e46dd7dc6e71` | `0e9d3065c5c4d1d20493a85906f0c81ada55cbf9b4198da8456cba608e2b98dd` | 12087 |
| `runtime-js/adapters/loa/src/launcher.js` | `5a623440270bcf51c129fc943a7fa85c2cfff134` | `3a8b8119451d2fdc58aa19d4c28fd962464188f9ae55c545ba08d8f00ac1cdc0` | 24669 |
| `runtime-js/adapters/loa/src/cli.js` | `985b9a539421631a5e5c230efaa9f7b0be759c25` | `ec206bff507fdb32d9cef938c10be903e8b6c94986f29a0afc4bb9153f7dced3` | 47611 |
| `runtime-js/adapters/loa/src/run-control.js` | `cebe8b3f1d9631598e4e66675beb8b72f70bd69c` | `92899bb1e48ee72f31c6ae5286afdd927bad6a7b4d461cf439f03ea864eca5e4` | 52798 |
| `runtime-js/adapters/loa/src/worker-bundle.js` | `c332b174a031e2f02934877946e01927867bf245` | `9ec3032b1ad09dc0adc25679a6a20f0e395f3cfb2c225456c657915b59eabdfd` | 31444 |
| `runtime-js/adapters/loa/src/worker-dispatch.js` | `8e70253df4f2fd57cbd254ebb2c2fac1af5025f1` | `4734922fff75a32d521e89c21c90d5a82ff0c1c0c119f36688a3ae43cc54d456` | 40642 |
| `runtime-js/adapters/loa/src/worker-return.js` | `95109b6b2919dceacd154c43ad19cd26510425e6` | `7954a5e4a83b80ceba4c2579afb9f4eb18840dbaf02f4b799aac3b3acebfd024` | 13101 |
| `runtime-js/adapters/loa/src/ledger-writer.js` | `e265c92cd01bb24d6de2c3a3f92b11c7995d09af` | `4f1de6c78156a0897945c6e1a9e2b58807a2c86daa221bcda53c666de5912460` | 88895 |
| `runtime-js/adapters/loa/src/core-loader.js` | `179f48b49d78c1887dc0d7fb6ec1221b18fddb38` | `6af759c653b60d67f70cac78ffdaf84bce993cd584c9cca4686c72cb1ec3c786` | 8361 |
| `runtime-js/adapters/loa/src/types.js` | `0cf0e81f57be0615f2e2485fca2d9cab36cc98f8` | `14e7da33e31e8417b4600d12e00f9d8270126a76762c7634a7ead9b50c892e32` | 2858 |
| `runtime-js/adapters/loa/src/runtime-snapshot.js` | `e46b2343d4e68ba1e0ea5e59d2eff8afa81324b0` | `2c35f942598b29e47b6d22225c1226d86e985194dc86d1d7c2d2c0b9d51507d3` | 22874 |
| `runtime-js/adapters/loa/src/claude-code-host.js` | `1185e1e409ef584d3748812d2f1ee8cf3e206bf3` | `ba3c41ae0bc6ba3ca4564ab90454ad0a1c51d2fbfafc8ce237a54896321cbf84` | 41994 |
| `runtime-js/adapters/loa/src/fs.js` | `9b56aa0303fbb48d1962032142c7240c281355ee` | `9d7701a5a2b3b715e2393f2bc83f6e45a3d7947572c05f05c4e56e190fe351af` | 12039 |
| `adapters/loa/tests/test-loa-adapter.ts` | `003ecbeab3baa9374890412cd0b4edfd3380eaaa` | `056119356f918703f867e09773cc1bfdfb5d22d01399147c224a6edd34942866` | 141344 |
| `adapters/loa/tests/test-slice5-process.ts` | `f6fb1122a1367101c769e34d6902ca6e9c4fad12` | `60f5784e3c3ce52572fa20872d85873fd6d29b8ce587f793c99a4ca1d4b3ac1d` | 87940 |
| `adapters/loa/tests/test-representation-process.ts` | `3003a6c120e1933d01a9037a0c7ef97842c6416b` | `c55a5fa954a391a23cc69b88fd578eb9760663c20d13cedc1981748a3a341cf3` | 29495 |
| `adapters/loa/tests/test-semantic-review-process.ts` | `ae526e54342c716348177bc9ffdb5cad6fa70500` | `bdb3a15e92a080d31ca68597b273d9ce8c356cadffa1d43976fc906298b50135` | 46854 |
| `adapters/loa/tests/test-duplicate-review-process.ts` | `27db1050db65c40de2c074996abe81b2cd971000` | `535b7d3913b36e7b40042aca66c31496b749fcae9a8e5ada864602e505b0311c` | 63912 |
| `adapter-protocol/README.md` | `aaeb0d55aeccf9aa956036f2499019c38dda7b56` | `7500afdbd11f7c2723338e36dccdcc3fc5385a33ec92587e9b5675d6cb2dc6c7` | 7499 |
| `adapter-protocol/runner-capability-contract.md` | `de23da4880c5971a8a419665a4c408264b49efcd` | `1792d3eee115b4814a51b36b5abd72181ec8c57e596050725a3d326c1e676ec9` | 8442 |
| `docs/architecture/04-pipeline-stages-and-dod.md` | `979b3a8630024080f479b228ec2be46df8198ba7` | `4b6a270aa0a5241424eb019cd9b50285f9eecf878f227ee9f29d72b471e6af04` | 33352 |
| `docs/architecture/08-runbook-agent-mode.md` | `ffec74731934991567766747f9f2a5085f395231` | `817f480cc54cf70a48d50e152201c22cc1322a57b99a01f62da35ce0bf86bfd8` | 16774 |
| `docs/architecture/prompts/orchestrator.md` | `46abfbdb00c274746cb3116d13d62051d6d11093` | `1a5942f3093871e8958c6cc8be4df9a0be0ae4c4627bc2f0ef89a1d1f9df2e5c` | 8707 |
| `docs/architecture/prompts/workers-intake-extraction.md` | `82ec921fa0f1d9f8903b862cd7a3a41b59649cbb` | `4df2b4f4151b19601f692031cd33f1ca3a2550f7a21a76274a5aeb81fef29378` | 54483 |
| `docs/architecture/prompts/workers-internal-ambiguity.md` | `e7e77d6e3ac8f3f6b3b0da2ab3b8a8d28f5f4c00` | `fec1262fbc66edb9daac7d5fd6a2148df3537217868e72a716bd6b8fa8ea5852` | 6980 |
| `docs/architecture/prompts/verifier-lenses.md` | `0b8c9695736af269f5f74103ff83e25b411e475c` | `bff92b250f4ec8b3c20a61f825c70080b2618e4c78555303efd5ec65f6372040` | 37899 |
| `docs/architecture/templates/01-run-control.md` | `4c36539e446f17bc2e428461116f934e01a390cb` | `760b4047667509a0b3c08d2431d0661656295b2b10d042ddf1b21f49d7337a37` | 6254 |
| `docs/architecture/templates/02-corpus-intake.md` | `8c8040c048d6fb549d348c839b23dd184a7b1d26` | `fafbafacd183337fa2edff65e77e35efa0dd3dd1ee944f490157be505bbcad61` | 29788 |
| `docs/architecture/templates/03-extraction-claims.md` | `1165971b8568314d9f175b88036f53f7c8cdf6d1` | `346eea653101e49bf50ab28be78b5cd93b36802cc0b50423072278264a011c5c` | 100425 |
| `docs/architecture/templates/07-verification.md` | `02347a597b6aec53e5d303ae15c53f815ac0c102` | `d28b8b59073644cdb80af1bacfce9a2e3d00b4754233b2217e9edae3b307dd19` | 4996 |
| `docs/architecture/templates/09-internal-ambiguity.md` | `1a2ff7afb6fe7a5ee80634fa6cde3ceffeddc736` | `f204c0c89e6bd453b039dd93882b530c8d3d1ca52c4e719f51c407f961037199` | 7524 |
| `scripts/lib/run-model.ts` | `380665b85324e319875f632223d2d302b408cfec` | `082f6e97567deb6a7d5dafe4d6cef0b0c81d7160208f2f0ed7c6934d8267c3a3` | 42670 |
| `scripts/lib/semantic-review.ts` | `d597ee65ce83f49fc26e15bffb2d2868120d229c` | `596e86dad077a15e9490564bdbf8fbcb474e0109034e6e699e6bd3cdd08f41f1` | 214850 |
| `scripts/lib/duplicate-review.ts` | `1b14778d95b71f79aea6c854956d81b5c8a4e19d` | `d0777e76fc3cddc050e07f8b334f616b0f0ad86f1aa9fbd213c15fb02a8d4d91` | 188471 |
| `scripts/lib/source-representation.ts` | `8c660970d7c9095661ee430dd8c00bd41ef93d58` | `480f01bc388d5c7917ac2264904402edc273877082900dbea37c03d5ae8c3cf9` | 90624 |
| `scripts/lib/internal-ambiguity.ts` | `511ff16964cd4fd1d656dc7d03fe53bd8ebabdd2` | `fb18f62f5d71aabd78386d22d6e8e7c85430613cbc650b63498cce106b2a7b25` | 74475 |
| `scripts/lib/relations.ts` | `d7f9a389d3f4e370e11bcb87a9023d71dcb83bf6` | `98a178df75e24010eb33920b1f19b9ed3944a5d4f356522486cee9e7fae468dd` | 5899 |
| `scripts/lib/lineage.ts` | `5e57c2ee4c453b706ae6659ba7530833c30bc085` | `712b5b73feafe2bedc286e7968644c8507a37cb44104b58e4ea03ee554c12d99` | 3846 |
| `scripts/lib/worker-return-contract.ts` | `8460ce98aac76067b03ea7c07029c3b47baa9c2e` | `116edc9e939940e4443ee43cc5c8dbb91f271fd1854e58d7d6a52d46e63c50da` | 15230 |
| `docs/architecture/15-slice-5-implementation-reconciliation.md` | `a2a89f7dba3de75acc13598bef15f0915bbc69db` | `de38dbfe7705248367fcf56982cfa567edcbacfd5df66dd8211452b79ccae742` | 7184 |
| `docs/architecture/16-slice-5-implementation-repair-reconciliation.md` | `31302f17f691caaffcec8af69c1df6eb9dfcca38` | `41e7246c3efbb1d48a6b7fd10f1558ac2373bbe7c42a8a2daa8e0646238684e0` | 2173 |
| `docs/architecture/17-slice-5-successor-repair-reconciliation.md` | `061033f05797545e5e93bd71c4d402146ccb169c` | `e6d095cc19c53971bb85072afacaed045ff6ef37f043f10f34309b75b511d578` | 3137 |
| `docs/architecture/18-slice-6-implementation-reconciliation.md` | `6628541e7ed9a9423f0cdd5f49c6c8f77d9e723a` | `f2d930a983f7de670816c93e91692cf63346afe689412267940e4a884327b84c` | 21542 |
| `docs/architecture/19-slice-7-implementation-reconciliation.md` | `2b8eb35e8550d1b01183319f0ac655bffe4d818a` | `613965bb75c3a564fa289958104663a553013bd79d58d88531ab6e03260abe2a` | 35825 |
| `docs/architecture/20-slice-8-implementation-reconciliation.md` | `f21f5d08b1f23ff52fd49fb64627979f7526126f` | `6d21985438b27fa7ba850e99ed1d7d8c9d764668b2f6770a048e83b353330d97` | 19438 |

F-03 PRODUCTION REACHABILITY DESIGN — PRODUCER COMPLETE

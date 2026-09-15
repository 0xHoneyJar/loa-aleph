# Blind SRC-001 Replay preparation — producer reconciliation

Status: **BLIND SRC-001 REPLAY PREPARATION BLOCKED — NO REPLAY EXECUTION AUTHORIZED**

Primary blocker: `BLOCKED_PREPARATION_ISOLATION`.

Preparation ID: `PREP-SRC001-20260914-7ec21d2`.
Repository: `0xHoneyJar/loa-aleph`.
Branch: `agent/src-001-blind-replay-preparation-20260914`.

This is producer evidence, not independent audit. The preparation authority
was committed before the first infrastructure discovery. An early prerequisite
check found no existing usable VM facility or pinned approved executor image
in the inspected host capabilities. Preparation stopped before frozen input
export, A/B release builds, executor creation or installation. Only blocker
retention, opaque identity verification and required repository checks followed.
No execution attempt was created to work around the blocker or a schema.

## Authority and immutable identities

| Subject | Commit | Tree |
| --- | --- | --- |
| Starting merged harness / verified live remote main | `8236b9f35c38cdd604b2389b42589f27755cdade` | `72075f93bc9fcb3c76f4480bc612693211efd240` |
| Exact audited harness publication; merge parent 2 | `82b0a184b4bf693381b6e22851a08aa66b6a04ba` | `72075f93bc9fcb3c76f4480bc612693211efd240` |
| Exact generic release source; merge parent 1 | `c949ea5f39daef42d22ca2e4111164d63dffcbf1` | `8ced176e50da0d05070b164cfe725752df947d3f` |
| Separate preparation authority | `7ec21d24d900ee6938b26778033210fb339da975` | `171e90ee78d2edada8bcf972bb7580081c435d1d` |

Authority path:
`calibration/src-001/core-design-basis/AUTHORIZED-blind-src-001-replay-preparation-20260914.md`.
Authority Git blob: `b9235f1bf02999b9630ed1b11da5941db1ee42a8`.
The exact human declaration is preserved verbatim in that separate first
commit. Its sole parent is the pinned merged harness. The preparation ID is
derived from that authority commit and is neither a replay nor a run ID.

The adopted proposal remains commit
`c607b724d16c13202d581b23bab6af5e8a256a6a`, tree
`88fc25d6c68b6bfbb1ea71c5ca385d1fb4c5bc79`, blob
`40370866bcdfd3c70941aac21298aaaae96fff6e`, SHA-256
`52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8`.
The complete exact proposal governs; this reconciliation is not its replacement.
`authority-binding.json` reopens proposal, adoption, Q-R1, implementation and
path clarification identities. The supplied fresh harness-audit verdict is
zero blockers with eight LATER-NONBLOCKING observations; its attribution is
the human-supplied findings, without an invented audit file or digest.

Initial local `main` and `origin/main` were stale at Slice 8. They remain
untouched. Live remote main was verified exactly, then only the pinned merge
object was fetched. Its ordered parents and tree match. History is non-shallow,
has no replacements, contains 161 ancestors including that merge, and passes
connectivity verification. The preparation branch was created directly from
the exact fetched merge; it was never rebased. The initial checkout was clean.

## Isolation blocker and bounded evidence

`environment-discovery.json` retains the exact discovery script, commands,
UTC chronology, binary hashes, observed paths/permissions, secret-safe
environment states and raw results from the permitted host context.

Observed:

- Linux `6.18.33.2-microsoft-standard-WSL2`, `x86_64`;
- no `qemu-system-x86_64`, `qemu-img`, `virsh`, `virt-install`,
  `cloud-hypervisor`, `firecracker`, `multipass` or `limactl` in the
  inspected host PATH;
- no `/dev/kvm`, libvirt socket, or either inspected libvirt image store;
- Docker `29.5.3` is available through its local Unix socket, with retained
  image identities recorded, but no approved immutable replay VM image or
  adopted outer-boundary configuration was identified;
- bubblewrap `0.9.0` is installed; its presence supplies no outer VM,
  closed mount inventory, network policy, empty-session proof or recorder;
- the producer context has repository/session access and cannot be relabeled
  as a fresh replay context.

This is bounded local discovery. It does not prove that no remote VM exists
anywhere. No VM, container, volume or image was created, started or pulled.
No privileged framework or container substitute was implemented. The adopted
protocol itself states that VM construction and actual observation are
external prerequisites, not harness capabilities.

No executor exists, so its image/volume identity, root, binary/dependency
closure, actual allowlisted mounts, denied roots, writable aliases, open
channels, network policy, fresh session, install receipt and isolation seal
are **NOT ESTABLISHED**. No synthetic canary was placed into a real executor
namespace and no negative-access PASS is claimed. Negative access to developer
repo, reference store, host paths, sessions, unapproved mounts and external
paths remains untested in such a namespace. Harness synthetic canary tests
remain synthetic evidence only.

The bounded next prerequisite is identification and access to an existing
authorized fresh-VM mechanism and immutable minimal image, with inspectable
mount/network/recorder controls. If a different outer mechanism is intended,
its authority must be clarified separately. Neither prerequisite grants
attestation, model calls, a replay ID or execution.

## Frozen inputs and opaque custody

Both whole-file identities were independently recomputed twice from the
retained repository files, without parsing the closed manifest or opening
any archive member:

| Container | Bytes | SHA-256 |
| --- | --- | --- |
| Closed archive | `5539645` | `f4c42e65d611395c9bacdb7ecf3ab7e4d01b1d21fd50c6c150b0cc6a8847a9f0` |
| Closed manifest | `215207` | `3bc9e618b98faef9f1aa4ebbca02c5c8d9c29e955d853b5b6e497a3d17cf9dcf` |

The paths are respectively
`calibration/src-001/closed-reference/SRC-001-closed-development-calibration-reference-20260811T162619+0200.zip`
and the same basename ending `-manifest.json`.
`input-prerequisites.json` and `reference-custody-preparation.json` retain
the exact path, Git blob, byte hash, mode, owner and single-link observations.
Existing developer-repository permissions are not claimed as future comparator
access controls. No copy was placed in a production-visible store.

The following are the adopted member pins, **not newly exported identities**.
Their exact member prefix is
`SRC-001-closed-development-calibration-reference/evidence/transfer/`.

| Member | Bytes | SHA-256 | Role |
| --- | --- | --- | --- |
| `SRC-001-frozen-numbered.txt` | `54207` | `5aef61988ff0db6f2ecc2b7980f370583a317e2427c85a6f78adc3ccc8a1d22a` | Authoritative frozen text |
| `SRC-001-extraction-criteria.normalized.md` | `4297` | `1df51f9872895a3a87a9face2bafe50db34cdfbfd73826e2a31f531c4c538df8` | Exact criteria boundary; not corpus evidence |
| `SRC-001-extraction-criteria.original.md` | `4298` | `f76b5e14ced86a72f955dd130d18b39080cf6a76c200cdfaf7f516446d411369` | Provenance only; withheld from semantic replay |
| `SRC-001-declared.pdf` | `1438944` | `c115123a511418ab46f04c4f9f78b6a569712960dbe9ca596d4edd6f0686d521` | Same source's upstream asset, not an independent source |

Archive-structure validation, safe member selection, member streaming,
destination equality and complete input-custody locking were **NOT RUN**.
Exported input set: empty. Additional exported member set: empty. Approved
frozen member extraction count: zero. Answer-member access count: zero.
No normalization, source repair, PDF decoding, semantic annotation, table,
equation, region or correspondence was created.

The ordinary supplied-representation contract is pinned by
`input-prerequisites.json`; no descriptor exists and no descriptor integrity
or import PASS is claimed. Consequently no complete input custody lock exists.
The reference receipt binds only opaque container identity and the future
post-evaluation-freeze policy. No analytical conclusion, answer inventory,
correction/addendum/overlay, mapping or score was opened or derived.

## Generic release reproduction

`release-prerequisites.json` pins the package manifest, lockfile, packaging
contract, package implementation, selector implementation, runtime checker
and boundary validator at the exact Slice 8 release source.

| Required release evidence | Actual preparation state |
| --- | --- |
| Independent checkout A; HEAD/tree/path/clean history | NOT CREATED |
| Independent checkout B; HEAD/tree/path/clean history | NOT CREATED |
| A/B dependency installation and build toolchains | NOT RUN |
| A/B canonical assembly/verification/package commands | NOT RUN |
| Actual A/B selected provenance commit/tree/object | NOT MEASURED |
| Complete Core/adapter/package/runtime inventories from A/B | NOT PRODUCED |
| A/B lock bytes, internal digest, lock-file hash and provenance | NOT PRODUCED |
| A/B archive, metadata and sidecar identities | NOT PRODUCED |
| A/B equality comparison | NOT RUN |
| Selected reproduced release candidate / content-addressed custody | NONE |
| Offline executor installation / install receipt | NOT RUN |

No old publication receipt, equal Git tree, boundary digest or regression
package is substituted for A/B reproduction. No release was built from the
merged harness. Actual build-checkout identity must remain distinct from
the packager's selected dependency-closure provenance; neither identity is
fabricated in an A/B receipt here.

Observed producer verification tools, not A/B build evidence:
Node `v22.22.0` at
`/home/eileenspectremoon/.nvm/versions/node/v22.22.0/bin/node`,
SHA-256 `1bec56ef7cfa9a76f3e0b7c0a87f220eb73f23102b9c0b4c7529a3f7c3ce7c31`;
npm `10.9.4`; TypeScript `7.0.2`; Git `2.43.0`.
Exact available binary paths/hashes and tool outputs are in the environment
record. The release-source lockfile identity is in the release-prerequisite
record. A locked A/B dependency closure is absent.

## Visibility and deferred attempt records

`visibility-withhold-preparation.json` retains default-deny policy with no
admitted stores or entries. Future logical roots remain `/replay/inputs/`,
`/replay/release/`, `/replay/loa/`, `/replay/recorder/`, and
`/replay/evidence/`; none is claimed as a prepared executor root.

Future admissible classes are exact approved exports, verified generic release,
ordinary role/stage Core context, individually traced ordinary run outputs,
required nonsecret configuration and later-authorized receipts. Unknown
origins, channels and files are denied. The complete withheld catalog covers
reference containers/answers, calibration conclusions/audits, correction and
overlay derivatives, expected IDs/outcomes/wording, reference mappings/metrics/
scores, developer history/worktrees, prior chats/memory/sessions, arbitrary host
paths and channels, comparison material and control-plane calibration records.
No semantic blacklist was derived from answers. Actual enforcement, delivered
context closure and cognitive blindness are not claimed.

`attempt-records-deferred.json` inventories all 32 deferred record definitions
and their exact required fields. The protocol lock remains the existing
audited record. The following real record instances do not exist:

- manifest; input-lock; release-lock; execution-mode; environment; visibility;
  visibility-generation; derivation; reference-custody-lock; leak-check; event;
- run-reference; outcome; inventory; canonical-artifact-index; ledger-index;
  quiescence; freeze; freeze-attestation; access-receipt; reference-lock;
- comparison-manifest; mapping; exact-byte-report; structural-report;
  semantic-report; uncertainty-and-findings; comparison-inventory;
  audit-manifest; execution-evidence; workspace-observation; gate-projection.

Attempt identity fields accept only their adopted real or explicitly synthetic
forms, and reject this preparation ID. Preparation receipts are separate
administration records, not schema instances with invented IDs. Release-lock
also requires installed/run-lock references that do not exist.
`BLOCKED_PREPARATION_REQUIRES_REPLAY_ID` is the bounded refusal applicable
to attempted real instantiation; the primary observed blocker is isolation.
No schema was weakened and no execution event was invented.

## Verification, determinism and unchanged system

`verification-summary.json` identifies the exact clean checkpoint, command
results and retained raw outputs. Check evidence is in `evidence/`.
It covers diff hygiene, CB1–CB10, two runtime drift checks, two protocol
verifications, harness typechecking, two complete synthetic harness runs and
the full unchanged `npm test` suite. The raw per-command exit results control;
no test name or summary replaces them.

`evidence/regression-parity-retention.json` binds the complete emitted
source/runtime parity stdout, stderr and reports, plus both process progress,
seed and static-baseline reports. Their raw bytes are retained under
`evidence/regression-duplicate-parity/`, without normalization. The process
reports explicitly retain D8-P01 as NOT RUN because genuine native invocation
requires separate authority. Generic scratch fixture trees are temporary
regression working state, not real replay artifacts.

The two harness reports are exactly `1032081` bytes each, SHA-256
`1b43046741339778f10630a6e32ae6f1fa6bdc6d9a82361fde2485a8cda0dbad`.
They contain 59 test groups, 29 mutations and nine mechanical controls.
The reports match byte for byte. Repeated boundary, runtime and protocol
stdout/stderr likewise match exactly. No normalization was used.
Recorded invocation clocks are separate from canonical deterministic outputs.
All authored preparation records use explicit `0644` modes and umask `0022`;
directories use `0755`. The known synthetic H-M14 umask observation remains
LATER-NONBLOCKING, without source repair.

`generic-compatibility.json` proves exact Git mode/blob preservation of every
pre-existing path except `core.manifest.json`. Removing only new
repository-administration entries reproduces the base manifest structure.
This includes all 600 Core files, all checker paths, 52 Loa adapter paths,
the Hermes adapter, 42 generated runtime paths, packaging sources, public
command, harness executable bytes and unchanged protocol namespace.
Run format remains `1.8.0-provisional`; no capability or intent-fidelity
change exists. Fresh final-head boundary/runtime/protocol checks and
preservation verification follow the publication commit. The full regression
receipt names its exact tested checkpoint; later receipt additions are
administration only.

The final-head verification supplement is retained outside Git under
`/home/eileenspectremoon/loa-dev/aleph-calibration/SRC-001/replay-preparation/PREP-SRC001-20260914-7ec21d2/`.
It is content-addressed after execution; the final producer report supplies
its exact path and digest. It binds the literal final HEAD/tree and fresh
checks without a self-referential commit receipt. This producer evidence
store is not a replay executor or production-visible store.

`preparation-files.json` inventories retained prerequisite/check/operation
records and this reconciliation, excluding only its own self-reference and
the separately retained verification-repeatability receipt. Git binds the
complete final tree, including those two administration records.

## Zero-operation evidence and limitations

`operation-boundary.json` binds the exact counts to command receipts,
recorded scripts, inspected mock/refusal code paths, unchanged executables
and observed absence of real attempts/exports/runtime artifacts. It does not
use the harness's constant zero fields as proof.

All of the following remain zero: genuine attestation probes; genuine
capability receipts; replay model/provider calls; native replay worker
dispatches; real SRC-001 start/resume/validate; real replay IDs/run IDs/attempts;
semantic replay; manual replay completion; approved frozen input-member
extractions; answer-member accesses; comparator access; real comparison;
expected-ID mappings; expected-score calculations; F-03 repairs; generic
Core, Loa adapter or package-format semantic changes; intent-fidelity
operations; PR creation; and merge.

Generic regression fixtures exercise synthetic host/run/dispatch/comparison
mechanics. Harness CLI refusal tests invoke the calibration CLI's rejected
action names, not the real `/loa-aleph` command. Mock host tests inject
`fixtureSpawn` and artificial return streams. Provider credential/session
environment variables were omitted from validation subprocesses. The
repository-aware producer session was not used as replay context.

No syscall-level/host-wide network recorder was available, so no global
no-network claim is made. GitHub administration traffic and Docker Unix-socket
metadata queries did occur. These corroborated operation bounds are not a
claim of cognitive blindness, provider training exclusion or semantic
independence.

## Failures, findings and preserved work

Initial stale-object/DNS and sandbox Docker access failures were retained and
resolved through exact-object fetching and permitted read-only host queries.
The failed `check-ignore` lookup concerned empty retained directories;
the shared guideline import path was absent. Neither caused a data repair.
`evidence/discovery-attempts.json` records these limitations. No automatic
approval review rejected an action, and no Core/adapter/harness repair
authority was requested or exercised.

Staged `git diff --cached --check` then rejected the exact extra blank line
at EOF in two emitted process seed logs. Their bytes were not trimmed or
normalized. The two logs are retained in canonical base64 envelopes, with
exact original lengths/hashes and decoded-byte equality. Record
`evidence/020-diff-hygiene-storage-adjustment.json` retains the actual failure,
all affected pre-adjustment draft bytes and the lossless storage mapping.
Uncommitted inventory/repeatability records were regenerated for the changed
storage representation. No historical commit, generic package format, Core,
adapter or harness source changed. The preceding fixed-artifact repeatability
proof remains retained in that adjustment record; subsequent verification
binds the new fixed storage representation.

The eight supplied harness-audit observations remain LATER-NONBLOCKING:

1. protocol namespace basename is not mechanically rebound to design SHA;
2. encoded-canary variants share an inventory-equality sub-rule and are not independent evidence;
3. `REPAIR-LOG.md` indexes only through evidence 015, not 016–019;
4. some producer-local retained evidence modes differed from committed Git modes;
5. historical receipt 018 raw report cannot now be independently byte-reproduced from the former uncommitted tree;
6. H-M14 synthetic fixture output mode is umask-sensitive because one test write lacks an explicit mode;
7. deterministic FAIL reports may retain absolute-path-bearing stacks;
8. zero-operation count fields are constants rather than instrumented measurements.

F-03 and F-04 remain OPEN / MUST PRESERVE. F-05 remains OPEN / MUST
PRESERVE, bounded by F-03. F-03 accepted-worker-return → production
orchestrator/LedgerWriter canonical mutation reachability remains unproven.
A4-07 retains its existing strength. S5A4-02, S5A4-03 and
S5A2-03 / S5-A-03 remain deferred. Slice 6 A-01/A-02/A-04/A-05 remain
retained; A-03 remains a closed observation and A-06 an accepted observation.
A7-04/A7-05/A7-08 and A8-01/A8-02/A8-03/A8-04 remain MUST PRESERVE.
A8-05/A8-06/A8-07/A8-08 remain LATER-NONBLOCKING. All other governing
findings and qualifiers retain their existing strength.

Preserved adapter branch `agent/loa-adapter-release` remains
`b9e2db742a087b8ae659ec39e476ed5e240cfa1f`; stash remains
`e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8`. All four retained detached/
prunable worktree registrations remain unchanged:

- `/tmp/loa-aleph-s5a2-final-17e1d1a.lkyTtl`:
  `17e1d1acda17a38d72214af5022b8145220f96d8`;
- `/tmp/loa-aleph-s5a2-repair-20260908.EoH8Ki`: same commit;
- `/tmp/loa-aleph-s7-retained-adoption-094a7ce`:
  `094a7ce3220631c8d4ee4c179e79b9b4529b6681`;
- `/tmp/slice6-pre16-authority`:
  `e45a1d9b1cafc5ef3b6a1fb46a61a8a395d45770`.

The empty retained Slice 7 probe remains untouched. No branch/stash/worktree
was reset, amended, dropped, pruned or restored. No PR or merge occurred.
Only the named preparation branch is to be pushed.

## Audit subject and non-claims

The proposed independent audit subject is the full range from
`8236b9f35c38cdd604b2389b42589f27755cdade` through the exact publication
commit that first adds this reconciliation and the final retained preparation
records. Resolve the containing commit/tree from its first-addition history;
the final producer report supplies the literal pushed HEAD and range.
A file cannot embed its own enclosing commit/tree without self-reference.
The audit must include the separate authority commit and all blocker,
operation, compatibility and validation evidence. Producer checks do not
constitute that audit.

Q-R1 remains `EXPERIMENTAL_UNSANCTIONED_NATIVE_LOA`, policy only. Manual
remains the only sanctioned Aleph mode and is not a fallback. No preparation
completion, release reproduction, executor isolation, replay start,
attestation success, model availability, native reachability, F-03 closure,
semantic validation, comparison, agent sanction, SRC-001 acceptance,
production readiness, golden status or v1 is claimed. Intent-fidelity has
not begun. Fresh independent preparation audit remains required before
consideration of any execution authority.

BLIND SRC-001 REPLAY PREPARATION BLOCKED — NO REPLAY EXECUTION AUTHORIZED


---

## Custodian continuation after the independent blocker audit

This appended section is the CURRENT CUSTODIAN CONTINUATION. All preceding
21617 bytes are the exact HISTORICAL FIRST STOP reconciliation, SHA-256
`sha256:56d375b37cc13d63194a2b734fa78cb524c20c9faf96830fd38533b913d5d828`. No preceding sentence is rewritten. Its initial non-completion
statements, zero exported inputs, old inventory/repeatability and final-head
references describe the original preparation, not the current custodian state.
The original `input-prerequisites.json`, `release-prerequisites.json`, discovery,
operation, compatibility, verification and deferred attempt records remain
byte-identical historical evidence. `custodian-current-state.json` is the
current workstream status; `preparation-files.json` is the mutable current
inventory. Historical verification receipts are not proof of the new tree.

Chronology:

1. Initial producer preparation used the persisted human authority at
   `7ec21d24d900ee6938b26778033210fb339da975`.
2. Early isolation discovery established an absent adopted VM boundary.
3. The original producer stopped too broadly, omitting input export and A/B
   release reproduction. This mistake remains in the retained history.
4. The independent audit was supplied externally for
   `8236b9f35c38cdd604b2389b42589f27755cdade..d2e9a882945c3a3b28edc18e32021eb0368c2449`.
   `INDEPENDENT-BLOCKER-AUDIT-RESPONSE.md` attributes its verdict and limitations;
   it is not the independent audit artifact.
5. This custodian continuation began at that exact HEAD/tree under the SAME
   preparation authority. It creates no execution or provisioning authority.
6. Input export is now EXPORTED_AND_CUSTODY_VERIFIED: both opaque container
   identities, all 211 central-directory entries and corresponding local
   metadata were checked; exactly four approved members were streamed. All
   adopted byte lengths/hashes match. No unapproved or answer member was
   opened or exported. The ordinary descriptor is 74008
   bytes, `sha256:377c7f94fcbea750fb8680cb26aed2d5da3cd6f5258fd7615199102f7d4b7ba8`. It validates through pinned Core
   and reproduces exactly using the other checkout. Text is the only semantic
   source; PDF is opaque same-source upstream capture; normalized criteria are
   a criteria boundary; original criteria remain provenance only outside
   semantic inputs. No source/criteria/PDF normalization occurred.
7. Release reproduction is now AB_REPRODUCED_AND_CUSTODY_VERIFIED. Two
   independent clean full-history clones at `c949ea5f39daef42d22ca2e4111164d63dffcbf1`,
   tree `8ced176e50da0d05070b164cfe725752df947d3f`, used separate caches,
   dependency installations, temporary directories and generated outputs.
   Locked installs passed offline from integrity-verified local cache content;
   registry reachability was not needed or probed. Both canonical package
   pipelines passed. All complete artifact reports and required raw bytes are
   equal, including 1,255 bundle files, three release files, 42 runtime files
   and 646 dependency files. Actual checkout HEAD is separately retained from
   selected provenance `0ff5443dd587bb287ae6bdf62985294e6d8dc19a`, whose tree is
   `8ced176e50da0d05070b164cfe725752df947d3f`; raw commit-object and ancestry
   reopening are retained. Bundle `sha256:e83ab57e971f2d508fe2b42139cd122b9fd70b9b309574efd10307ff6795c909` and archive
   `sha256:4bd8d27648ad1480601a0d4d31653297581ed354c95c0ab978fabb2d2ce3537c`
   identify the reproduced generic release. No pre-merge receipt substituted
   for either new build. Complete original locks, package locks, toolchain,
   dependency closure, both inventories and exact comparison are retained in
   `release-preparation-receipt.json` and its evidence references.
8. EXECUTOR STILL BLOCKED: `BLOCKED_PREPARATION_ISOLATION` independently
   blocks executor/image/volume creation, actual mounts/denied roots, probes,
   network/visibility enforcement, offline executor installation, fresh-session
   proof, environment-manifest attempt instance, attestation and execution.
   No VM or infrastructure work occurred. Input/release success does not
   weaken this blocker or complete the entire replay preparation.

PA-01: PRODUCER_REMEDIATED_NOT_INDEPENDENTLY_CLOSED. Both incorrectly omitted
custodian workstreams were completed under existing authority. PA-02:
PRODUCER_REMEDIATED_NOT_INDEPENDENTLY_CLOSED. Current state gives each its own
measured result and retains isolation as an independent executor blocker.
Fresh independent audit is required to assess these producer dispositions.

PA-03 (final-head receipt outside Git), PA-04 (constant rather than instrumented
counters), and PA-05 (prior harness audit lacks repository-reopenable identity)
remain LATER-NONBLOCKING. Every F-03/F-04/F-05, Slice finding and all eight
harness observations above retain their exact status and strength. No repair,
closure, sanction, acceptance, production, golden or v1 inference is made.

The two verified content-addressed stores are:

- input custody: `/home/eileenspectremoon/loa-dev/aleph-calibration/SRC-001/replay-preparation/PREP-SRC001-20260914-7ec21d2/sha256-f93e1665d25e1929fc1c7e5bf0908138b5a800372ef9ce2ee466e950c1cdf363`;
- release custody: `/home/eileenspectremoon/loa-dev/aleph-calibration/SRC-001/replay-preparation/PREP-SRC001-20260914-7ec21d2/sha256-81173115520bcc6d3bd6ad80d6561392b28e2e330651f946f2901b67f0c284e1`.

Custody content manifests bind all bytes; exclusive creation and read-only
modes protect against routine accidental changes. The owner can change
permissions; this does not prove immutable filesystem or executor isolation.
The release wrapper's `custody-content.json` is preparation metadata. Only the
three exact canonical release files enter private release verification; no
executor installation or transfer occurred.

Four approved input exports and four independent approved verification reads
occurred before final-head verification. Final verification reopens those four
approved members once more, recorded separately. Approved extraction is not
answer-member access. Genuine attestation/capability/provider/native worker/
SRC-001 start/resume/validate/replay ID/run ID/attempt ID/semantic replay/
reference comparison/mapping/scoring/F-03 repair/intent-fidelity counts remain
zero within this producer operation accounting. VM/executor creation and
infrastructure mutation counts are zero. These are bounded producer records,
not host-wide instrumented counters; synthetic regression mechanics are
explicitly separate. No PR or merge occurred; only this same preparation
branch is authorized for normal commit/push.

Preserved failed attempts: initial npm config double-loading `/dev/null`;
sandbox runtime `spawnSync EPERM`; initial verifier invocation at the output
parent instead of emitted release directory. Recorder arguments/environment
were corrected, and unchanged canonical commands passed in the permitted
context. No dependency, Core, runtime, packager or harness bytes were repaired.
All original failures and both later successes remain in command evidence.

Stable records isolate invocation clocks and temporary paths in fixed observed
receipts. Re-running record generation from those receipts and the historical
reconciliation reproduces bytes. Descriptor regeneration independently yields
identical bytes. All repository administration files use explicit `0644`,
directories `0755`, and umask `0022`; custody modes are explicitly recorded.

Final-head validation must bind the containing normal commit and exact tree
outside Git: diff hygiene, Core boundary, runtime drift, protocol verification,
harness typecheck/suite, deterministic repetition, full `npm test`, preparation
inventory/path closure, protected refs/stash/worktree preservation, and fresh
input/release validation. The final report supplies that receipt identity;
it cannot be truthfully embedded in its own containing commit. Producer
validation does not independently close PA-01 or PA-02.

The next full fresh-audit range is
`8236b9f35c38cdd604b2389b42589f27755cdade..<containing continuation commit>`;
its exact final SHA/tree must be resolved from Git and the final-head receipt.
The continuation-only range begins at
`d2e9a882945c3a3b28edc18e32021eb0368c2449`. Audit includes original chronology,
this response, current custody/reproduction evidence, and external final-head
verification. No historical audit identity is invented.

BLIND SRC-001 CUSTODIAN PREPARATION COMPLETE — EXECUTOR ISOLATION STILL BLOCKED — FRESH INDEPENDENT AUDIT REQUIRED

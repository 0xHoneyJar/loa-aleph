# Blind SRC-001 Replay Harness — Calibration-Only Design

Date: 2026-09-14

Status: PROPOSED — HUMAN AUTHORITY ADOPTION REQUIRED

Decision class: repository-administration proposal; producer-authored design
only. Neither adoption, implementation authority nor execution authority is
recorded by this file.

## 1. Controlling authority and sequence

[ADOPTED-architecture-decision.md](ADOPTED-architecture-decision.md) adopts
the exact [PROPOSED-architecture-decision.md](PROPOSED-architecture-decision.md)
at:

| Identity | Value |
| --- | --- |
| Adopted proposal head | `6506ee4a9b586d1e8dc14bf25dd44a7a99ed9079` |
| Proposal Git blob | `95156a8f7292965cc2f9eef0efd8811f20ae02d8` |
| Proposal SHA-256 | `fecdc0485d519bf821f6de1a75891bdba005e57b29c8514b1e2e8fd1138b3028` |
| Adoption record SHA-256 at this base | `b13d88bfbfea344d72ded2e34d3daf1a2422622092191f9806bca034268fad33` |

The controlling order is calibration-derived Slices 1–8, blind SRC-001
replay, then the separate intent-fidelity product-intake track.
`SRC-001-implementation-slice-plan-20260813.md`, section “Slice 10 - Blind
SRC-001 replay harness”, remains harness design input. Its relative ordering,
including its dependency sentence placing intent-fidelity in the selected
release, is superseded by the adopted proposal. It supplies no authority to
begin intent-fidelity. The replay-boundary material in
`SRC-001-independent-calibration-delta-architecture-decision-20260813.md`
likewise supports an external calibration harness, blind production, and
independent comparison after freezing.

Accepted Decisions 0001–0004, root `AGENTS.md`, the immutable bundle contract,
the current manual runbook, and the run-local Core contracts remain
controlling. The architecture adoption permits preparation of bounded work;
it does not itself authorize this harness's implementation or replay.
The human's present instruction authorizes this proposal and its publication
on the design branch only.

No expected SRC-001 claim, normalization, merge, relation, lineage, packet,
disposition, graph size, or score is specified here.

## 2. Exact baseline and preserved work

Repository: `0xHoneyJar/loa-aleph`.

Design branch:
`agent/src-001-blind-replay-harness-design-20260914`.

| Starting identity | Verified value |
| --- | --- |
| HEAD and local/remote `main` | `c949ea5f39daef42d22ca2e4111164d63dffcbf1` |
| Tree | `8ced176e50da0d05070b164cfe725752df947d3f` |
| Merge first parent | `31c0cdd6b0757a75f72d249cbad4ebc8b2d83911` |
| Merge second parent; Slice 8 publication | `0ff5443dd587bb287ae6bdf62985294e6d8dc19a` |
| Merge | PR #54, Slice 8 implementation |
| Working tree before authoring | Clean, including nonignored untracked paths |

The second parent is an ancestor of the canonical merge and has the same
tree. Equal trees do not authorize reuse of its publication package.
The exact merge is the future release-build checkout, never this proposal's
later commit or a then-current `main`.

Preserved adapter branch `agent/loa-adapter-release`:
`b9e2db742a087b8ae659ec39e476ed5e240cfa1f`, tree
`f9daba8ba3e9b33e2895265a1427d61829a90722`.
Preserved stash: `e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8`, tree
`a71318a42d8dca812f7d57161d21e4d3bc1b388b`.
The four existing detached worktree registrations, including their missing
directory/prunable status, are preserved without pruning or restoration.

Current Core version is `0.1.0-provisional`, adapter protocol
`1.0.0-provisional`, and cumulative run format `1.8.0-provisional`.
`scripts/lib/run-model.ts` includes `duplicate-overlap-review` after the
Slice 7 `semantic-unit-review` capability. Earlier capabilities and retained
run identities remain intact. Loa is `implemented`, not validated or
sanctioned; `core-manual` is the sanctioned manual binding. This proposal
does not change those declarations.

## 3. Scope and ownership

The harness owns input/export identity checks, execution-environment
isolation evidence, replay closure, comparison chronology and comparison
record structure. All future harness source, schemas, synthetic fixtures and
reports belong outside generic Core, under calibration administration.
A separate implementation authorization must enumerate their paths.
No executable file is added by this proposal.

Core continues to own S0–S13, role semantics, evidence, ledgers, human gates,
write plans, prompts, checker behavior and run format. The Loa adapter owns
ordinary installation, start/resume/validate, transport, return quarantine
and single-writer mechanics. The harness may observe and refuse unsafe
execution; it must not supply missing semantic production code, repair
ledgers, select answers, or introduce SRC-001-specific adapter behavior.
A required Core/adapter change stops that portion and becomes a separate
development authority question.

This evaluates generic implementations of Slices 1–8 on a frozen problem.
It does not promise that the available ordinary execution path can complete
that evaluation. A blocked attempt is a retained result.

## 4. Authoritative frozen inputs

The canonical repository contains the input bytes as specific members of:

`calibration/src-001/closed-reference/SRC-001-closed-development-calibration-reference-20260811T162619+0200.zip`

Archive length: `5539645` bytes.
Archive SHA-256:
`f4c42e65d611395c9bacdb7ecf3ab7e4d01b1d21fd50c6c150b0cc6a8847a9f0`.

All member names below have this exact prefix:

`SRC-001-closed-development-calibration-reference/evidence/transfer/`

| Member basename | Bytes | SHA-256 | Format and role |
| --- | --- | --- | --- |
| `SRC-001-frozen-numbered.txt` | `54207` | `5aef61988ff0db6f2ecc2b7980f370583a317e2427c85a6f78adc3ccc8a1d22a` | UTF-8 text, 792 LF-terminated physical lines; authoritative frozen line-addressable source |
| `SRC-001-extraction-criteria.normalized.md` | `4297` | `1df51f9872895a3a87a9face2bafe50db34cdfbfd73826e2a31f531c4c538df8` | UTF-8 Markdown; frozen criteria bytes used for the recorded calibration digest |
| `SRC-001-extraction-criteria.original.md` | `4298` | `f76b5e14ced86a72f955dd130d18b39080cf6a76c200cdfaf7f516446d411369` | UTF-8 Markdown; provenance-only original export, with two trailing LFs |
| `SRC-001-declared.pdf` | `1438944` | `c115123a511418ab46f04c4f9f78b6a569712960dbe9ca596d4edd6f0686d521` | PDF, header `%PDF-1.5`; pinned upstream original for visual/formal-material provenance |

These lengths and digests were recomputed from only the named input members,
and agree with the retained package manifest. The manifest itself is:

`calibration/src-001/closed-reference/SRC-001-closed-development-calibration-reference-20260811T162619+0200-manifest.json`

Its length is `215207`, SHA-256
`3bc9e618b98faef9f1aa4ebbca02c5c8d9c29e955d853b5b6e497a3d17cf9dcf`.
Its input rows classify the text, criteria and PDF as frozen inputs.
The member `TRANSFER-MANIFEST.md`, sections “Required Identity Checks” and
“Criteria Provenance”, identifies normalized criteria as the recorded digest
boundary. Its file-inventory rows identify the PDF's visual/formal role.
That mixed transfer manifest must not be delivered to a replay participant.

The criteria have no independent numeric version. Their exact version is
the adopted text headed
`Extraction Criteria — RUN-20260718T200215838Z-b836c0a930da`, written
`2026-07-18T20:29:18.450Z`, attributed to Eileen's verbatim adoption, pinned
by the normalized SHA-256 above. Historical normalization was
`originalCriteria.trimEnd() + LF`. Replay preparation copies the already
retained normalized member exactly; it does not rerun normalization.
The original export and conversation cache are not alternate replay criteria.
The cache is withheld entirely.

The text's first five wrapper lines identify the source title “A simple
neural network module for relational reasoning”, the same PDF SHA-256,
`pypdf` text-layer extraction with possible figure/equation degradation,
and 16 pages. They establish provenance, not fidelity of extracted structure.
Keep all source bytes, wrapper lines, whitespace and line endings unchanged.
Use physical `md-lines` coordinates and exact byte offsets under pinned Core;
do not strip numbering, re-extract, OCR, repair equations, or substitute PDF
text for the frozen text.

The first input export contains exactly:

- `inputs/source/SRC-001-frozen-numbered.txt`;
- `inputs/source/SRC-001-declared.pdf`, as the same source's upstream asset;
- `inputs/criteria/SRC-001-extraction-criteria.normalized.md`;
- a preparation-generated ordinary T2.3 supplied-representation descriptor
  at `inputs/source/SRC-001.aleph-representation.json`, pinned before start.

The descriptor uses the existing `aleph-supplied-representation/v1` contract
in `docs/architecture/templates/02-corpus-intake.md` §10.2. Its `source_path`
is the text; the PDF is an upstream-capture asset, never a second extracted
source. Record supplied-extraction provenance and only whole-file text
capture/root/text bindings supported by those bytes. Supply no analytical
table, equation, region, correspondence or semantic-object annotations.
Do not pretend the descriptor existed in the historical freeze: retain its
preparer, exact bytes, derivation from these input pins, and ordinary Core
validation. It is new capture metadata, not new source or criteria.

This uses the existing supported text-SRC/upstream-PDF route rather than raw
PDF intake or a newly invented converter. The host may consume only modalities
it supports. An unavailable required visual/formal feature remains
`CANNOT_DETERMINE`; presence of the PDF does not prove native PDF/vision
consumption. Never decode the PDF as UTF-8 to force it into a worker prompt.
Failure to construct/import this bounded ordinary representation stops
preparation with `BLOCKED_INPUT_REPRESENTATION`, without silently dropping
the companion or adding a Core repair.

S0 scope is the original SRC-001 source under the unchanged frozen criteria,
including their candidacy and exclusion boundaries. The criteria's examples
mention other historical source IDs; retain those bytes as examples, without
admitting those sources. No later calibration observation, correction,
criteria lesson, reference decision, current-world acquisition or expanded
corpus becomes input. S1 must retain the exact normalized criteria at
`ledgers/extraction-criteria.md`; they are a supplied ordinary criteria input,
not corpus evidence and not a new interview outcome. A path unable to
preserve this identity blocks; it must not regenerate “equivalent” criteria.

Only metadata and the named frozen inputs may be exported before replay.
A custodian verifies the archive and central directory, rejects duplicate,
link, absolute, traversal or ambiguous members, and streams only the exact
named source/criteria/PDF entries into a new export. Never extract the whole
archive into the replay environment. Hashing a closed archive or consulting
its input metadata does not authorize opening its answers.

## 5. Post-merge release preparation

No post-merge package digest is asserted here. All following operations are
future preparation under separate authority, completed before any replay
start or attestation probe.

1. Use two independent clean, full-history build checkouts, A and B, at
   commit `c949ea5f39daef42d22ca2e4111164d63dffcbf1`, tree
   `8ced176e50da0d05070b164cfe725752df947d3f`. Reject replacements,
   shallow history, dirty/untracked payloads, changed tracked bytes or missing
   ancestry. Build machines are not replay workspaces.
2. Record build-checkout identities, exact `package-lock.json`, package
   manager, compiler, Node binary/version/digest, build tools and their
   dependency closure. Use locked development dependencies and the current
   runtime drift check; do not repair generated output at this commit.
3. Run the retained Core-boundary validator, runtime drift check, both-host
   bundle assembly and independent verification, and Loa release
   `package`/`verify` using the canonical source commands in `package.json`
   and `packaging/README.md`. Release output is outside the build checkout.
   Version is read from the canonical manifests, not incremented for replay.
4. A and B separately assemble both bundle sets and their Loa release.
   Each run verifies equal complete Core inventory/digests/bytes across
   Loa and Hermes, selected adapter exclusion, payload, selected manifest
   projection, checker, assembly tool, lock and provenance. Compare A with B:
   complete inventories, file bytes, Core/adapter/checker/payload/lock/bundle
   digests, provenance, all three release files, metadata, archive member
   inventory and archive SHA-256 must reproduce exactly.
5. Persist `release-lock.json` and both build receipts with all measured
   identities and verification outputs. An absent value, unresolved mutable
   pin or unexplained difference is `BLOCKED_RELEASE_REPRODUCTION`. Do not
   start execution, pick the more convenient build, or edit a package.
6. Transfer only the reproduced content-addressed release to the clean
   executor. Verify it again, extract privately with the retained verifier,
   install offline, and retain the complete original bundle lock and managed
   install receipt. Never mount the build/developer checkout.

Packaging has two distinct provenance notions. At this base,
`packaging/package-loa-release.ts` sets metadata `source.build_commit` and
`source.dependency_closure_commit` to the lock's selected dependency-closure
commit; it does not independently record checkout HEAD. The bundle
provenance selector follows `packaging/README.md` and
`scripts/lib/bundle-format.ts`. Therefore the replay release lock must also
record `actual_build_checkout_commit` and `actual_build_checkout_tree`
for A and B. Both must equal the canonical merge identity above.

Measure and retain the selector's actual commit, raw commit-object binding,
tree and provenance digest, and prove its ancestry to that merge. Do not
rewrite packager fields to make them look like HEAD. If package identities
happen to equal earlier ones under the retained selector, prove that through
both new canonical-merge builds; do not copy the pre-merge publication
receipt. Equal payload trees alone are never this proof. If the authority
requires a package-format change to bind checkout HEAD within the archive,
that is separate packaging development; this harness does not implement it.

`release-lock.json` must bind actual build checkouts; target IDs/versions;
Core, adapter, checker, protocol and run-format identities; both target
inventories; selected projection; assembly-tool identity; complete original
Loa lock bytes/hash and its internal lock digest; provenance object/digest;
dependency-closure commit/tree; archive path/length/hash; sidecar and release
metadata bytes/hashes; build/dependency records; A/B reproduction report; and
the measured runtime projection inventory. Never substitute a Git commit
for a content digest, or an internal lock digest for the lock file's hash.

The release is complete generic Core plus Loa. Do not prune fixtures or
reconciliation files from the package to create a calibration-specific Core.
Those bytes remain in the verified mechanical installation; only ordinary
role-specific Core prompt parts are exposed to semantic participants.

## 6. Execution-mode policy and the one unresolved choice

Manual mode is the only currently sanctioned execution mode.
The manual identity is `mode=manual`, `adapter_id=core-manual`,
`host_identity=human-operator`, `model_ids=human`, profile
`n/a (core-manual)`, execution mapping `n/a (manual)`, with the immutable
manual binding and runtime snapshot required by Decision 0004 and T1.1.
This task authorizes no manual replay either.

The requested ordinary `/loa-aleph` command path is different. At the exact
base, `adapters/loa/src/cli.ts:renderRunManifest` writes `mode: 'agent'`;
start requires a genuine host-capability receipt and pinned model/profile.
The installed skill's attestation makes model probes. There is no public
manual-mode switch, and manual execution requires no adapter control files.
Relabeling a command-created run as manual, authoring a simulated receipt,
or manually filling its missing production ledgers would be dishonest.

**Q-R1 — first replay execution policy (OPEN; human decision required):**
Will the authority separately authorize an **experimental/unsanctioned
native Loa command-path replay attempt**, with genuine attestation and
workers and acceptance of a possible F-03 halt, or amend the requested
command-path requirement to select a **sanctioned core-manual replay**
following the existing manual runbook?

The recommendation for the stated command-path objective is the former,
only under separate explicit experimental execution authority. This proposal
does not select or authorize it. If only sanctioned execution is permitted,
the latter is the only presently sanctioned mode, and requires that explicit
scope amendment; it cannot establish Loa production reachability.
Until Q-R1 is resolved, state is `BLOCKED_EXECUTION_MODE_POLICY`.
Neither elapsed time, architecture adoption, implementation authorization nor
green synthetic tests resolves Q-R1.

Implementation can provide the mode declaration and mechanical evidence
checks for these two declared paths without choosing policy. No hybrid,
manual-to-native fallback or mode change within a replay is permitted.
Any experimental execution retains `experimental/unsanctioned` in every
summary. Native success cannot sanction agent mode.

## 7. Custody, clean workspace and trust boundary

Use three disjoint principals and storage domains:

| Principal/domain | May access | Must not access/write |
| --- | --- | --- |
| Preparation custodian and mechanical recorder | Canonical build checkout, archive metadata and exact input-member export, reproduced release, isolation controls, evidence log | No replay semantic production; no answer reading/comparison before freeze; no reference-derived prompts |
| Blind production domain, including orchestrator and manual participants | Only authorized ordinary run inputs and role-specific generic context | Developer repository, history, prior chats, reference archive, calibration notes/audits, comparison outputs, other participants' withheld contexts |
| Independent comparator, enabled after freeze | Immutable replay snapshot, locked reference package, comparison schema | Replay writes, resumed replay roles, reference-to-producer communication |

Construct a fresh disposable VM from an immutable minimal image, with a new
volume and identity per replay. It is not a Git checkout and has no `.git`,
developer home, shared host folder, agent memory store, chat/session history,
reference archive, SSH agent, container socket or host-management socket.
Do not mount the repository and then hide selected names. Copy only the
approved input export, verified release, pinned mechanical harness and
ordinary host tools. The image and every added artifact must have an inventory
and digest. A VM is the proposed outer isolation mechanism; it does not
replace native Loa's existing inner worker sandbox.

Exact logical roots within the VM are:

```text
/replay/inputs/                  immutable input export from section 4
/replay/release/                 verified immutable release files
/replay/loa/                     empty ordinary installation target
/replay/recorder/                mechanical harness; inaccessible to workers
/replay/evidence/                recorder-owned execution evidence
```

The native run is created normally at
`/replay/loa/grimoires/loa/aleph/runs/<RUN-id>/`.
The manual alternative, if explicitly selected by Q-R1, uses an ordinary
Core run directory at `/replay/manual/runs/<RUN-id>/` and the immutable
manual runtime snapshot. It does not fabricate Loa control records.
The same external evaluation-freeze and comparison rules apply.

The full installed bundle is available to deterministic verifier/dispatcher/
checker processes. It is not a model attachment or unrestricted model tool
root. In particular, included generic fixtures, tests, architecture
reconciliation and producer test reports must not become calibration hints.
The ordinary Core loader supplies only the canonical role/stage/prompt
sections required for work. This proposal itself, authority design packets
and the replay protocol are control-plane records, not worker prompt parts.
Do not tell workers expected results or add a “match the calibration” task.

Keep native workers in the pinned ordinary sandbox: sealed bundle at
`/worker`, ephemeral `/tmp` and `/home/worker`, no durable writable path.
Inventory all other binary/library/system mounts in the clean VM image;
their innocuous-looking names are not evidence of clean contents. Apply
an outer network rule allowing only the pinned provider's required traffic,
with no repository, object-store reference, general browsing or local
metadata-service route. Pin and retain that rule and test denied routes.
The native inner policy shares network; it alone does not establish this
outer boundary. Failure to establish the outer rule blocks execution.
Manual production has no network/model calls; approved local viewers and
editors are pinned and have no plugins or remote retrieval.

`environment-manifest.json` binds: replay ID; image/volume identities;
OS/kernel/architecture; recorder and harness source/build identities;
absolute logical roots; mount source/destination/mode and inventories;
UID/principal boundaries; binaries and loaded dependency closure; working
directories; locale/timezone; effective environment variable names and
nonsecret configuration; empty-home/session/config facts; networking;
open-file/socket policy; logging mechanism; clock source; and isolation
probe receipts. Secrets are represented only by name, SET/NOT_SET and
broker/permission identity, never plaintext or secret-value digests.

For a native execution, also bind Node, Claude Code and bubblewrap
paths/versions/digests, profile, exact provider model ID, role/context/effort
mapping, host attestation, no-fallback controls and actual dispatch receipts.
Do not invent a model binary hash. For manual execution, bind real named
actors, editors/viewers, pass IDs, shown inventories and the manual runtime;
model/provider/effort are inapplicable, not simulated.

The mechanically checkable assertion is closure of the environment and
recorded delivered context, under the trusted recorder and isolation boundary.
It is not a proof of human memory erasure, provider training-data exclusion,
cognitive independence or truth. An unknown delivery channel is a blocker,
not a permissive exception.

## 8. Manifest and record conventions

All calibration harness schemas are proposed here, not additions to Core.
Use explicit versioned, closed schemas: unknown keys, duplicate JSON keys,
missing required fields, invalid enums, ambiguous paths and unresolved
identities fail. Use the retained bundle canonical-JSON rules: UTF-8, sorted
object keys, compact encoding and one final LF, with quantities as canonical
decimal strings and no numeric JSON values. Arrays preserve their specified
order. Hash original files as raw bytes; never canonicalize source, criteria,
worker returns or Core records before hashing them.

An `ArtifactRef` has exactly:
`{store, path, byte_length, sha256}`. `store` identifies a locked root;
`path` is a normalized relative path; length is a decimal string; SHA-256 is
`sha256:<64 lowercase hex>`. The store lock must itself have exact immutable
identity. All real records must contain measured values; illustrative field
names here do not license placeholders, `latest`, branches, missing pins or
`UNPINNED-WORKTREE` at execution.

`replay-manifest.json` (`src001-replay-manifest/v1`) contains:

```text
format, replay_id, created_at, producer_identity,
design_ref, adoption_ref, implementation_authority_ref,
implementation_ref, execution_authority_ref,
canonical_base {repository, commit, tree},
input_lock_ref, release_lock_ref, execution_mode_ref,
visibility_manifest_ref, environment_manifest_ref, comparison_schema_ref,
reference_custody_lock_ref, planned_endpoint, budget_ref, event_log_origin_ref
```

`replay_id` is unique, allocated before preparation as
`SRC001-REPLAY-<UTC-basic-timestamp>-<128-bit-random-hex>`.
It is never reused, including for a failed preparation. The ordinary run ID
is allocated by the selected execution path and linked afterward through an
append-only `run-reference.json`. The original historical run ID in the
criteria remains source metadata; it is not the new run ID.

`input-lock.json` contains the archive/custody metadata refs, exact selected
archive member names and section 4 identities, destination ArtifactRefs,
source/criteria roles and formats, criteria version, representation descriptor
ref and derivation/validation receipt, and legitimate S0 scope basis refs.
The original criteria export's provenance pin is custodian-only; it is not
a second worker criteria input. The complete archive is custodian-only.

`execution-mode.json` contains `format`, `replay_id`, `mode`,
`sanction_status`, `evidence_kind`, `authority_ref`, `run_identity_policy`,
`actor_or_role_mapping_ref`, `blindness_declarations_ref` and `budget_ref`.
Native values are `agent`, `experimental/unsanctioned`, `native-dispatch`.
Manual values are `manual`, `sanctioned-manual-path`, `manual-separate-pass`.
The latter status describes the path, not acceptance of this replay.
No record may select native execution without a resolved Q-R1 and exact
separate execution authority covering attestation probes.

`visibility-manifest.json` (`src001-replay-visibility/v1`) contains:

```text
format, replay_id, policy_ref, input_lock_ref, release_lock_ref,
environment_manifest_ref, default_access ("deny"),
roots[], allowed_entries[], derivation_rules[], withheld_classes[],
role_rules[], inventory_algorithm, leak_check_policy_ref
```

Each allowed entry has:
`{entry_id, artifact_ref, class, consumers, access, origin, derivation_ref}`.
Consumers are exact principals/roles, access is `read-only` or the ordinary
single-writer permission for the working run, and origin is one of
`frozen-input`, `generic-release`, `ordinary-human-gate`,
`ordinary-run-output`, `mechanical-environment`. Initial inputs have
`derivation_ref=null`; generated entries must cite their exact prior inputs,
authorized ordinary operation, invocation/gate receipt and resulting digest.
No catch-all “everything under run” rule admits new worker attachments.

Each derivation rule names the pinned generic contract, admissible input
classes, producing principal and output class. A newly sealed generation of
the manifest records generated artifacts and the previous-generation digest.
Sealing arbitrary bytes is not sufficient: the origin graph must terminate
in approved inputs, exact generic release bytes, legitimate gate responses or
independently retained ordinary execution. The harness does not supply
semantic derivations itself.

Each role rule binds stage, role, exact Core allowlist/withhold contract,
prompt section selectors, output contract, permissible run-input classes
and ordinary task construction. Every invocation receives a fully enumerated
manifest instance, never a glob. Relative paths, aliases, encodings and hard
links cannot add a second route around an entry's consumers.

## 9. Withheld reference and forbidden ingress

All `calibration/src-001/` content is forbidden to production by default,
except the three exact source/criteria/PDF input exports in section 4.
That exception is by member path **and content identity**, not a permission
to mount the containing directory or archive. The representation descriptor
is separately generated and pinned as ordinary input metadata.

The controller-only `withheld_classes` list must include:

| Class | Path/class coverage |
| --- | --- |
| Human answer inventory and adjudication | Closed-reference archive members other than approved inputs; `batches-01-06-preclose/`, `batches-07-12-actual/`, `batches-07-12-preclose/`; proposal, answer, checkpoint and decision records |
| Original delta conclusions | Original calibration-analysis files and any copies, excerpts or exported summaries |
| Independent calibration audit conclusions | The independent calibration-delta audit and its result/sidecar/output derivatives |
| Correction/addendum/overlay | `SRC-001-calibration-delta-correction-addendum-20260813.md`, `SRC-001-effective-final-state-analytical-overlay-20260813.json` and analytical derivatives |
| Expected identities/outcomes | Expected claim/packet/relation/lineage IDs, duplicate/overlap calls, normalization wording, answer-derived selection lists |
| Decision/correction/close events | All answer-bearing event records and receipts, including embedded event payloads |
| Evaluation artifacts | Precomputed mappings, metrics, expected scores/pass-fail targets, post-run evaluator conclusions |
| Inherited context | Developer checkout and Git history, prior model conversations/compactions, memory, cached prompts, working notes and audit sessions |

Each class record contains class ID, custody-root/path selectors, known
opaque artifact digests when available from retained metadata, and the
mechanical exclusion rule. The catalog is not delivered to workers.
Do not open an answer inventory before freeze to build a semantic keyword
list or extract expected IDs. Pre-freeze content checks use approved-byte
closure, opaque whole-artifact digests and bounded synthetic canaries.
Optional reference-content forensics belongs only after freeze.

These classes cover renamed files, compressed copies, embedded JSON,
base64, prompt text, environment values and tool results. A known forbidden
digest under a permitted-looking name fails; an unknown extra byte/path
without approved provenance also fails. A reference artifact elsewhere on
an inaccessible custodian machine is not a leak.

Legitimate frozen criteria contain historical source-ID examples. A generated
replay ID can also happen to equal a reference ID. Neither is an ingress
violation merely because the spelling coincides. The prohibited event is
reference-derived material entering production; raw ID spelling is not the
primary isolation test. Keep independently assigned IDs and pin the exact
criteria bytes rather than redacting them.

## 10. Active leak checks and delivered context

Run the following checks before start, before every semantic invocation/
manual pass, after delivery/return, and at final evaluation freeze:

1. **Workspace closure.** Inventory every accessible file, directory, mount,
   image layer, config source, socket and environment-provided path.
   Resolve paths from the actual execution namespace, not the host's
   intended configuration. Reject extra mounts/entries, symlinks/hardlink
   escapes, inherited open descriptors, developer roots or changed pins.
   Verify the clean image and binary/library closure. Repeat at delivery
   boundaries to detect a mount or file introduced after preflight.
2. **Negative access probes.** From the actual outer and worker namespaces,
   attempt read/list/open of declared forbidden roots, parent/alias routes,
   host homes, process-root/FD escapes, reference-store endpoints and prior
   session stores. Use synthetic canary files on forbidden test paths;
   never mount a real answer file to test whether it leaks. A reachable
   forbidden route fails even if a filename scan sees no answer.
3. **Core and attachment closure.** Independently recompute every selected
   Core byte section, blind policy, output schema, task line and actual
   attachment from the run-local release and permitted origin graph.
   Bind both run path and materialized attachment path, length and digest.
   Verify the sealed bundle's entire inventory and reject unlisted files.
   Restrictions and task metadata are context too.
4. **Actual submission.** Bind the exact bytes delivered through every
   channel: system/role/stage parts, native host envelope, output schema,
   rendered prompt/stdin, attachments, tool outputs, command arguments and
   nonsecret effective environment. Independently reproduce the pinned
   host's prompt serialization and compare it with recorded submission
   evidence. A seal over intended attachments alone is insufficient.
5. **Invocation/context receipt.** Retain ordinary `invocation.json`,
   worker request, native dispatch/return/raw-stream evidence, output
   validation and `WorkerDispatchReceipt`, including call/run/context IDs,
   model, producer-context binding, `fresh_context=true`,
   `inherited_context=false`, filesystem policy and simulation class.
   Match them to the actual submitted inventory and environment observation.
   Cross-check returned context receipts against recorder-owned delivery
   evidence; a worker's self-declaration alone is not proof.
6. **Session closure.** No conversation resumption, parent chat, compaction,
   memory attachment, hidden developer instruction or automatic project
   discovery is allowed. The top-level orchestration context must be fresh
   as well as every Core-required refuter. Record all contexts and their
   creation/termination receipts. An unavailable effective-context inventory
   is `BLOCKED_CONTEXT_EVIDENCE`, not presumed blindness.
7. **Human ingress.** Check gate schema and request binding; admit only
   legitimate scope/freeze/sensitivity/procedural/acceptance fields.
   Ensure any worker projection is the unchanged Core projection. Comments
   and observations excluded by Core remain excluded. Manual packets receive
   the same role-specific allowlist checks and display/access receipts.
8. **Round-trip evidence.** Rehash the workspace generation and bundles after
   each call; bind outputs only to the invocation that produced them.
   Preserve rejected returns and discrepancies in quarantine. No fixture,
   static, manual or native-looking filename may upgrade execution class.

These are calibration observation/refusal checks around ordinary mechanics.
Do not change Core worker-return schemas to add a calibration receipt.
Where the current host does not expose an independently verifiable delivery
fact, a mechanical outer recorder may record the existing process I/O and
namespace state without changing its inputs. If it cannot establish the
fact safely and completely, stop and record the missing evidence. Do not
modify the native dispatch protocol within this design.

The effective environment has no unrecorded reference-bearing channel.
Approved gate responses and genuine outputs are new ordinary run material;
they are not automatically treated as forbidden because their contents are
novel. Their access/production provenance must be retained. Mechanical
checking cannot establish that a dishonest human has forgotten an answer;
section 11 supplies the necessary eligibility and independence boundary.

`leak-check-report.json` records each check ID, phase, exact context/workspace
inventory digest, measured observations, evidence refs and
`PASS | FAIL | BLOCKED`. `PASS` is scoped to the measured boundary.
No keyword scan, “please ignore the reference” prompt or absence of matching
filenames substitutes for these checks.

## 11. Manual blindness and semantic-role independence

All replay producers and reviewers, including any human operator performing
semantic work, must declare no access to the closed answer/reference package
and must use only the sealed production domain. Someone who has read those
answers is ineligible for a blind producing/reviewing role in this replay;
another sitting does not restore blindness. A repository-aware design
session is not a future replay context and cannot be resumed as one.

Record participant identity, assigned roles, eligibility declaration, pass
start/end, delivered packet inventory/hash, display/tool access receipt,
and completion/revocation of that role. Do not expose the reference until
all replay-producing roles are complete and the evaluation freeze is proven.
The independent comparator must also be separate from replay production.

Retain the exact seven-field manual review evidence:

```text
{producer_actor,reviewer_actor,producer_pass_id,reviewer_pass_id,
 subject_digest,shown_digest,withheld_declaration}
```

Slice 7 L2S manual profile is exactly:

```json
{"profile_id":"n/a (core-manual)","profile_digest":null,"role":"verifier-l2s","model_identity":"human"}
```

Slice 8 L3 manual profile is exactly:

```json
{"profile_id":"n/a (core-manual)","profile_digest":null,"role":"verifier-l3","model_identity":"human"}
```

These are role-specific exceptions established by the two adopted manual
clarifications, not permission to generalize human profiles to other roles.
Slice 7 requires distinct producer/reviewer actors and passes. Slice 8 uses
exactly one round-1 reviewer distinct from its producer. Only round-1
`cannot-determine` permits the required second round, with a reviewer distinct
from both earlier actors and all passes distinct. Both receive the same
sealed subject without earlier verdicts/rationales. A later `upheld` does
not erase blocking indeterminacy; no third round or majority vote exists.

Preserve the separate successor-normalizer pass and distinct L2S actor/pass;
an L3 reviewing pass cannot be reused as L2S. L2F, gap review, relation review,
dispositions and the remaining ordinary manual rules retain their own
contracts. Where current doctrine allows same-person separate sittings,
record only temporal evidence. It cannot satisfy the stricter Slice 7/8
independence requirements or be described as native context isolation.
Synthetic declarations do not prove that humans actually reviewed anything.

## 12. Human gates and ordinary execution chronology

The following is a specification for a later authorized attempt, not a
command run by this design session.

1. **Preparation authority.** Resolve Q-R1, implementation audit and execution
   authority. Seal input/release/environment/visibility locks and the
   comparison schema before opening production. Budget and stop policy are
   fixed without expected scores. Attestation probes count as model execution
   and require the same separate native authority.
2. **Installation and attestation.** Verify the reproduced release in the VM.
   Install the complete `aleph-for-loa` bundle into `/replay/loa` with the
   bundled offline installer; run `verify-install`. For native execution,
   invoke the installed `host-attestation.js attest` entrypoint with exact
   authorized profile/provider/model, retain its real probes and generated
   receipt, and pass ordinary preflight. No test capability file is usable.
3. **Start.** From that empty target, use the unchanged public operation
   `/loa-aleph start /replay/inputs/source/SRC-001.aleph-representation.json`.
   Do not give start the criteria file as a second corpus source. Retain
   command/argv/environment, stdout/stderr, exit status, capture inventory,
   run ID, install identity, S0 request and representation-prepared record.
   Supply the exact frozen criteria to the ordinary S1 context when due.
4. **S0 gate and corpus freeze.** Present the ordinary persisted request.
   The human establishes only original scope, exclusions, per-source
   sensitivity, authority identity and the explicit freeze decision.
   A scope response can cite/adopt the frozen criteria; no answer, routing,
   disposition, duplicate decision, cluster, projection prose or comparison
   mapping may be elicited. Retain exact request/response bytes and hashes.
   Use the existing internal `--authority-response <file> <RUN-id>`
   mechanism. The adapter's normal transaction records the corpus freeze;
   do not backdate or copy historical gate responses.
5. **Resume and normal production.** `/loa-aleph resume <RUN-id>` verifies the
   retained original bundle/runtime and performs ordinary recovery.
   Follow its pinned Core orchestrator and first unmet DoD in S0–S13 order.
   S1 retains exact frozen criteria. For every role use the installed skill's
   ordinary `assemble`, `prepare`, `dispatch`, `accept` sequence through the
   run-local `worker-dispatch.js`, with per-call leak checks and retained
   quarantine evidence. Only the existing canonical orchestrator writer may
   consume authenticated returns. No harness writer or fixture callback
   supplies missing work.
6. **Subsequent required gates.** Use only Core-required S4 procedural,
   S8 external-referent, S13 acceptance, budget and contamination gates at
   their permitted stages. Retain the exact requests/responses, pinned
   contract selectors, authority identities and transaction receipts.
   S4 responses select only Core-projected legal procedure; authority
   observations are not semantic input. A reference-informed semantic answer
   is forbidden. Post-S0 research requires a successor run; do not acquire
   current-world material for this attempt.
7. **Validation.** Use `/loa-aleph validate <RUN-id>` and the retained
   checker/runtime, preserving complete output and exit code for every
   invocation. Stage incompleteness, failures and warnings remain visible.
   Never substitute the current developer checkout's checker. No final
   checker PASS is inferred from a command's successful transport.
8. **End production.** The normal intended endpoint is completion through
   S12 with the ordinary S13 request retained and awaiting authority, without
   replay-derived acceptance. A prior terminal block/failure is also an
   endpoint, classified incomplete. Ordinary S13 authority may be exercised
   before freeze only if separately authorized, independently audited while
   still blind, and no further producing work remains. Projection is outside
   this replay; no P1 commission or P-stages are initiated.
9. **Evaluation freeze.** Terminate producing contexts, revoke writers,
   retain final checks and all gate/halt evidence, then perform sections
   14–15. Only afterward may independent reference comparison begin.

The source/criteria boundary cannot be narrowed through an S0 exclusion
merely to get a passing run. Refusal or inability to approve the intended
boundary is `BLOCKED_ORIGINAL_SCOPE`. The authority may choose to stop;
an altered scope belongs to a separately authorized successor evaluation.

If Q-R1 instead selects manual execution, apply the same locked inputs,
visibility, chronology, Core S0–S13 gates and evaluation freeze, using the
manual runbook and T1.1/T1.3 records. Invoke the checker from the immutable
runtime snapshot. Do not claim that manual stage progression exercised
`/loa-aleph`, native attestation, accepted-worker-return transport or F-03.
That alternative does not run command-path steps 2–5 under a manual label.

## 13. F-03 and failure semantics

F-03 remains **OPEN / MUST PRESERVE**:
accepted-worker-return → canonical LedgerWriter/orchestrator production
reachability is unproven.

At this exact base:

- `adapters/loa/src/worker-dispatch.ts`'s `accept` action explicitly emits
  `ledger_write: false`. It validates/quarantines a return, not a canonical
  stage output.
- `adapters/loa/src/ledger-writer.ts` defines `executeSemanticWrite` and
  `executeDuplicateWrite`. A source search across `adapters/loa/src/`
  finds these method definitions but no production call sites invoking them.
- `cli.ts:resumeLoaRun` recovers retained transactions and provides bounded
  Slice 5 transitions; elsewhere its next-work result directs the caller to
  the pinned Core orchestrator/first unmet DoD. A `resume` PASS is not proof
  that all downstream semantic/duplicate writes are reachable.
- The Slice 8 reconciliation expressly limits the process suite's C1
  evidence: static relation/C2 baseline rows do not prove accepted-return
  relation production. Those test setups are not executable replay fallbacks.

These are inspected-source observations, not a live failure reproduced in
this design session. The harness must record the actual first unavailable
operation rather than claim in advance that a particular later stage ran.
If a returned work item needs an absent production handoff, retain its
stage, role, contract/operation, invocation/return refs, available call-site
evidence and unchanged run state. Classify the attempt
`BLOCKED_F03_PRODUCTION_REACHABILITY`, with `completion=INCOMPLETE`.
Keep the adapter's raw result separately: even an outer command PASS does
not override the absent stage effect.

Do not call internal writer helpers from a new harness driver, hand-author
canonical ledgers, seed later-stage fixtures, simulate native returns,
patch a production call site, or “finish by hand”. That would implement or
avoid F-03 rather than evaluate the ordinary system. A repair requires a
separate Core/adapter development authorization, audit and immutable release;
it cannot be folded into this calibration design.

Use orthogonal fields in `outcome.json`:

```text
format, replay_id, run_ref,
mechanical_integrity: PASS | FAIL | BLOCKED,
execution: NOT_STARTED | HALTED | COMPLETED_TO_DECLARED_ENDPOINT,
completion: INCOMPLETE | COMPLETE_TO_DECLARED_ENDPOINT,
core_checker_result: NOT_RUN | PASS | FAIL,
core_state, stage, gate_ref, halt_ref,
blocking_codes[], evidence_refs[], non_claims[]
```

Calibration blocker codes are external reports, not new Core enums:
`BLOCKED_EXECUTION_MODE_POLICY`, `BLOCKED_INPUT_REPRESENTATION`,
`BLOCKED_ORIGINAL_SCOPE`, `BLOCKED_RELEASE_REPRODUCTION`,
`BLOCKED_CONTEXT_EVIDENCE`, `BLOCKED_F03_PRODUCTION_REACHABILITY`,
`BLOCKED_GATE`, `BLOCKED_BUDGET`, and `BLOCKED_FREEZE`.
Integrity failures use `FAIL_INPUT_PIN`, `FAIL_RELEASE_PIN`,
`FAIL_CONTEXT_LEAK`, `FAIL_FREEZE_MUTATION`, `FAIL_COMPARISON_CHRONOLOGY`
or `FAIL_COMPARISON_BINDING` with precise evidence.
Always preserve the original adapter/checker reason and exit status.

Missing review independence, unresolved semantic/material findings, pending
duplicate work, unsupported representation, missing runtime bytes, refusal
or a genuine gate halt remains blocking under the owning Core contract.
Do not translate `CANNOT_DETERMINE` into false, empty success or a match.
Do not relabel `FAIL`/`BLOCKED` as acceptable degraded full execution.

A terminal blocked attempt may be frozen for honest limited comparison if
input/context integrity and quiescence are provable. Its absent later-stage
output is “not reached”, not a measured semantic omission. If isolation
failed, retain an incident snapshot but mark it ineligible for a **blind**
calibration comparison; no reference-opening permission follows from a
failed integrity seal. Preservation is mandatory even when comparison is
prohibited.

## 14. Two freezes and immutable inventory

**S0 corpus freeze** is the ordinary Core event. It fixes corpus, inputs,
scope and runtime/run pins while later run artifacts continue to be produced
legally. It does not authorize opening the calibration reference.

**Replay-evaluation freeze** is an external calibration custody event after
blind production ends, before any reference access. It fixes the complete
blind result, including failures, partial outputs and a pending authority
gate. It grants neither Core acceptance nor permission to resume.

The recorder must:

1. Finish or halt ordinary execution; retain all completed and failed
   invocation/check/gate records. Recover any recoverable pending transaction
   only through the ordinary pinned path **before** stopping production.
   If recovery cannot complete, preserve its exact pending state as incomplete.
2. Terminate all producer/reviewer processes and sessions, close open writers
   and handles, revoke production credentials/access, and attest quiescence.
   A pending journal is evidence; it is never rolled forward after this freeze.
3. Capture a consistent read-only snapshot containing the complete ordinary
   run and recorder evidence. Include hidden files, original bundle/runtime,
   control records, canonical artifacts, quarantines, rejected returns,
   raw streams, checks, prepared/committed journals and source/criteria.
   Nothing may be omitted because it is failed, large or inconvenient.
4. Copy that snapshot byte-for-byte into the immutable custody store.
   Independently re-enumerate and rehash it there before issuing the receipt.
   Verify correspondence with the stopped production volume; seal that volume
   too, or destroy its access after verified retention. A mutable spare copy
   cannot remain a resumable source of “the same” replay.

The payload root is `frozen/result/`. Its two children are `run/` and
`execution-evidence/`; native `run/` is the entire ordinary run directory,
not selected Markdown. `execution-evidence/` includes copies of every
preparation/input/release/environment/mode/visibility lock and all pre-freeze
execution observations, so no mutable external path is needed to reopen
the proof. Duplicated bytes must agree. Secrets remain outside the evidence
package; record only the secret-safe facts specified in section 7.
Undisclosable execution evidence blocks a claim of complete inspectability.

`frozen/replay-inventory.json` is outside `result/`, avoiding self-reference.
Format `src001-replay-inventory/v1` contains:
`{format, replay_id, root, entries, inventory_digest}`.
Each entry has `{path, type, mode, byte_length, sha256}`.
Paths are UTF-8-bytewise sorted and relative to `result/`; include directory
entries (including empty directories), modes and every regular file.
Directories use length `"0"` and `sha256=null`. Reject links, sockets,
devices, traversal, duplicate names and hardlinked file aliases; ephemeral
process sockets must be closed before snapshotting, not silently filtered.
File SHA-256 is over exact bytes. Root identity is SHA-256 over canonical
JSON of `{format,replay_id,root,entries}`, excluding `inventory_digest`.
Inventory file length/hash is also retained as an ArtifactRef.

Retain a separate canonical-artifact index with path/digest and
`present | not-yet-due | missing-due` for every artifact prescribed at the
observed stage by the pinned run format. For each applicable ledger record
its full digest and structural state; bind the ledger-chain head and
transaction inventory where the mode supplies them. Manual absence of
adapter files is inapplicable by mode, never guessed from missing files.
No selected-artifact index replaces the full payload inventory.

## 15. Freeze receipt and reference-opening barrier

`frozen/freeze.payload.json` (`src001-replay-freeze/v1`) contains exactly:

```text
format, replay_id, run_id, planned_endpoint, observed_endpoint,
input_lock_ref, release_lock_ref, execution_mode_ref,
environment_manifest_ref, visibility_manifest_ref,
run_state_ref, canonical_artifact_index_ref, ledger_index_ref,
checker_output_refs[], outcome_ref, gate_refs[], halt_refs[],
execution_evidence_index_ref, final_leak_check_ref,
quiescence_receipt_ref, snapshot_storage_identity,
replay_inventory_ref, replay_inventory_digest,
event_log_cut {sequence, head_digest},
frozen_at, authority_identity, freeze_authority_ref, recorder_identity
```

For manual mode `run_state_ref` binds the canonical run manifest/state log;
for native mode it binds the exact `control/run-state.json` and its verified
manifest correspondence. Each ref resolves into the inventory-covered
snapshot, an individually hashed sealed companion index, or an exact
immutable authority record. The receipt binds those companion and authority
hashes explicitly; they are not fictitiously included inside their own
inventory.
Freeze timestamp is UTC RFC3339 from the retained clock source.

Store `freeze-receipt.sha256` as the SHA-256 of exact `freeze.payload.json`
bytes. A detached recorder attestation binds that digest, snapshot identity,
authority identity and public verification-key identity. Persist the
attestation and its digest outside `result/`. The freeze payload does not
contain its own digest, and no frozen inventory includes its own hash.
Human permission to seal a result is recorded distinctly from an authority
acceptance of the run.

Chronology uses a recorder-owned append-only event chain, with sequence,
previous-event digest, UTC time, actor, event kind and ArtifactRefs. Sequence
and causal digest bindings establish order; timestamps alone do not.
The snapshot contains the event prefix through production stop. A later
external freeze event binds the receipt digest. The reference store releases
read capability only after an independently verified freeze event and a
passing integrity/leak/quiescence check for this exact replay.

No human answer inventory, delta conclusions, audit conclusions, analytical
overlay, correction decisions or comparison mapping may be opened by the
comparator until that barrier passes. Record the first grant and first
reference-open event with the freeze digest. This restriction covers human
viewing, scripts, searches, model attachments and cached context.

After freeze, no replay artifact changes, including “only metadata”, logs,
checker reruns, authority responses or added reference links. Comparator
mounts are read-only, backed by immutable storage inaccessible to its write
principal; it receives no writer credentials, writable alias or host escape.
Probe those permissions before granting reference access.

Verify the full inventory before and after comparison and before any audit
consumes it. Any changed byte, path, mode or inventory entry invalidates the
comparison. Preserve the incident and old receipts; do not restore a byte and
claim continuity. A new evaluation needs a new replay ID, clean blind
participants, new preparation and separately authorized execution.

## 16. Append-only storage layout

Keep this authority proposal in `core-design-basis/`. Future implementation
and evidence use `calibration/src-001/replay/` as repository administration:

```text
calibration/src-001/replay/
  protocol/<design-digest>/
    schemas/                         adopted, versioned harness schemas
    implementation-reference.json    exact audited tooling identity
  attempts/<replay-id>/
    preparation/
      replay-manifest.json
      input-lock.json
      release-lock.json
      release-reproduction/
      reference-custody-lock.json
      execution-mode.json
      environment-manifest.json
      visibility-manifest.json
      authority-and-blindness/
    recording/
      events/                        append-only numbered receipts
      visibility-generations/
      leak-checks/
      invocations-and-contexts/
      gates/
      run-reference.json
      outcome.json
    frozen/
      result/run/                    complete stopped ordinary run
      result/execution-evidence/     complete proof closure
      canonical-artifact-index.json
      ledger-index.json
      replay-inventory.json
      freeze.payload.json
      freeze-receipt.sha256
      freeze-attestation.json
    comparisons/<comparison-id>/
      access-receipt.json
      reference-lock.json
      comparison-manifest.json
      mapping.jsonl
      exact-byte-report.json
      structural-report.json
      semantic-report.json
      uncertainty-and-findings.json
      final-calibration-replay-summary.md
      comparison-inventory.json
    audits/<audit-id>/
      audit-manifest.json
      independent-audit.md
      authority-disposition.json
```

The canonical-artifact and ledger indexes beside `result/` are sealed
companions referenced by the freeze payload and individually hashed.
Input/release/mode and execution-index refs in the freeze resolve to their
copies inside `result/execution-evidence/`; the payload also names the exact
sealed companion refs. This is an explicit acyclic closure, not a directory
glob with self-hash exceptions.

The live workspace remains outside this repository. Final custody may use a
content-addressed archive instead of expanding large `frozen/result/` in Git,
provided the archive is retained durably, its exact inventory resolves every
path/byte, its digest and storage identity are recorded, and independent
audit can reopen it without a developer checkout. A URL alone is not custody.
Do not substitute an expiring local `/tmp` reference for durable evidence.

Create files once. Before freeze, evolving working-run files follow ordinary
Core append/supersession and transaction rules. The external recorder retains
each observed generation as a new receipt. After freeze, neither working
copy nor frozen payload may evolve. Comparison and audit revisions are new
numbered immutable records with explicit predecessor/supersession refs;
never overwrite a prior mapping or report. No comparison file belongs in
`frozen/result/run/`, including a convenient “reference link”.

## 17. Independent post-freeze comparison

The comparator is a fresh context with an identity distinct from production,
empty history and read-only access to the verified replay. It can read the
comparison schema and, only after section 15, the locked closed reference.
It receives no capability to resume a run or change a ledger. Its own outputs
are written solely to its comparison directory.

Before production, the controller pins the *custody identity* of the intended
reference in `preparation/reference-custody-lock.json`. Its closed fields are
`format`, `replay_id`, `canonical_base`, `containers`, `analytical_artifacts`
and `access_policy_ref`. Each container/artifact entry binds a role, exact
ArtifactRef, canonical-base Git path/blob and access class `post-freeze-only`.
The container entries name the section 4 archive and manifest. Analytical
entries name the retained original analysis, independent audit,
correction/addendum and effective overlay; their source paths must resolve
through the canonical-base retained design-basis inventory. If an original
analysis input is not retained/reopenable under that inventory, record its
absence explicitly rather than retrieve an unpinned substitute or claim to
compare it. The closed reference and its recorded authority remain the
comparison basis; missing analytical context is a reported limitation.

Compute opaque file hashes without opening analytical contents. The source
archive may contain both allowed inputs and withheld answers; its container
identity alone does not grant content access. The custody lock is never
worker context and is copied into the sealed execution-evidence closure.

After freeze, `reference-lock.json` expands the reference's actual member
inventory and authority chain under those predeclared pins. Distinguish
human reference records, historical proposals, corrections/close decisions,
and analytical interpretations. The effective analytical overlay is not
silently elevated to a new human answer inventory. A conflicting or
unresolvable reference chain yields `CANNOT_DETERMINE` with evidence;
the comparator cannot adjudicate it away. No mutable external reference,
later hand-edit or newly selected “better answer” may replace the locked one.

`comparison-manifest.json` binds comparison ID, fresh comparator identity/
context, comparison schema/implementation, exact freeze payload digest,
inventory digest, replay ID/run ID, reference-lock ref, access receipt and
start event. The access receipt proves reference access follows freeze and
the comparator cannot write replay. The report footer/index records end event,
post-comparison inventory verification and all output digests.

A blind incomplete replay may be compared only on reached material, with
its halt prominent. Nothing beyond that halt is imputed as completed or
scored against a reference. If a prerequisite integrity check fails, do not
run semantic comparison; report the mechanical problem separately.

## 18. ID-independent mapping schema

`mapping.jsonl` contains canonical `src001-replay-mapping/v1` rows:

```text
format, comparison_id, mapping_id, replay_id, freeze_receipt_sha256,
replay_inventory_digest, reference_lock_sha256,
record_kind,
replay_evidence[], reference_evidence[],
correspondence, comparison_basis[], explanation, uncertainty_refs[]
```

`record_kind` is one of `source-fragment`, `packet`, `claim`, `lineage`,
`relation`, `ambiguity`, `representation-use`, `semantic-review`,
`duplicate-overlap`, `disposition`, `run-accounting`.
Each evidence entry contains:
`{artifact_ref, record_selector, native_id, source_anchors}`.
`native_id` is the actual side-local ID or null; it is never a join key
requiring equality. A selector uses that side's actual supported format:
Markdown heading/table/row with exact selected-byte hash, JSON pointer, or
JSONL record position with exact selected-byte hash.
Each source anchor contains source SHA-256, scheme, locator, ordered
half-open byte ranges and selected-byte digest when that format permits
exact bytes; otherwise explicit unavailable reason and no invented range.

`correspondence` is one of:

- `RECOVERED_REFERENCE_BEHAVIOR`;
- `MISSING_REFERENCE_BEHAVIOR`;
- `ADDITIONAL_BEHAVIOR`;
- `PARTIALLY_CORRESPONDING`;
- `CONTRADICTION`;
- `STRUCTURAL_DIFFERENCE`;
- `CANNOT_DETERMINE`.

Allow one-to-one, one-to-many, many-to-one and many-to-many mapping arrays.
Do not force a reference partition, generated-ID equality or bijection.
Empty arrays are legal only on the absent side of a missing/additional row,
or for an explicitly documented not-reached/indeterminate side. Both arrays
empty are invalid. Every nonempty side must reopen real evidence.
`comparison_basis` cites source-fragment/criteria refs and relevant record
fields rather than ID spelling. Preserve competing candidate correspondences
through linked uncertainty records; do not pick an arbitrary match.

Mechanical anchoring first reopens exact sources, spans, member provenance
and actual records. The fresh comparator then assesses substantive identity:
assertion and qualification, context, evidence role, relation endpoints,
lineage/provenance, material limitations and review history as applicable.
It may use an index of evidence anchors as navigation, not a semantic oracle.
Shared source bytes or similar prose alone do not prove equivalent meaning.
No similarity threshold, embedding score, required expected ID, preferred
wording or universal reference count is a correctness rule.

Mapping evidence is append-only and fully side-labeled. A deterministic
checker validates record/anchor existence, hashes, schema and references.
It cannot decide whether the proposed semantic correspondence is correct.
Same-ID records with different evidence may contradict or remain
indeterminate; different-ID records may correspond.

## 19. Three report classes and uncertainty

Every report binds comparison ID, exact freeze/inventory/reference/schema
digests, evidence refs, author/context, creation event, findings and its
mechanical validation result. Keep these classes separate:

| Report | Permitted proposition | Exclusions |
| --- | --- | --- |
| `exact-byte-report.json` | Input/source/criteria integrity, package/runtime pins, frozen inventory consistency, exact evidence-byte reopening and packet/fragment hashes | No requirement that generated prose or whole replay ledgers equal reference bytes; no semantic-equivalence verdict |
| `structural-report.json` | Actual accounting, required artifacts at reached stages, source-walk/gaps, lineage preservation, review/freshness records, duplicate/provenance-union history, restrictions, gates and checker results | No “claim should exist”, ideal split/count, reference graph density or semantic recall judgment |
| `semantic-report.json` | Independent, evidence-cited comparison of substantive behavior using section 18 categories | No deterministic truth claim, automatic release acceptance or universal golden expectation |

Exact-byte report results are `PASS | FAIL | CANNOT_DETERMINE` per checked
proposition; e.g. unavailable historical bytes remain indeterminate, while
a changed frozen replay byte is a hard integrity failure. Structural
differences may be valid representational differences; compare the
corresponding contracts and scope, not raw row-count equality.
Semantic categories are observations relative to this locked reference.
“Recovered” does not mean universally correct; “additional” does not mean
wrong; “missing” does not establish a regression without judgment.
Some differences may be improvements, regressions or legitimate alternatives.

`uncertainty-and-findings.json` contains:
`{format, comparison_id, freeze_receipt_sha256, records}`.
Each record has
`{finding_id, class, mapping_refs, evidence_refs, assessment, reason,
required_evidence, carried_finding_refs, proposed_followup}`.
`assessment` permits `CANNOT_DETERMINE` everywhere a semantic conclusion is
not warranted. Required evidence can be unavailable; that does not license
fetching research into the frozen replay or retroactive repair.
Preserve unresolved mapping, unsupported modality, unreached stage,
conflicting reference authority and insufficient independence as distinct
reasons. Empty rationale, dropped unknowns and forced binary verdicts fail
the comparison schema.

No precomputed metric enters production. If the comparator reports counts,
compute them only after freeze from cited mapping/report rows; retain the
formula, denominator, reached-stage scope and uncertainty bucket. Do not
hide `CANNOT_DETERMINE` in a match/mismatch denominator, set a required
pass-score, or collapse these three reports into “Core PASS/FAIL”.

## 20. Deterministic checker boundary

Future calibration checks, separate from retained Core checkers:

| Check | Mechanical obligation |
| --- | --- |
| R01 Input identity | Exact approved members, source/PDF/criteria lengths/hashes, format/version and descriptor derivation; no substituted scope/criteria |
| R02 Release/runtime identity | Canonical merge build receipts, independent reproduction, original locks, complete package/runtime and installed/run pin equality |
| R03 Workspace closure | Exact clean image/mount/file/environment inventory, denied reference/developer access, no unrecorded ingress |
| R04 Delivered-context closure | Per-role allowed Core parts, task, attachments, actual submission and invocation/context receipts match; origin graph closes |
| R05 Execution honesty | Mode/authority/evidence class agree, real versus simulated/manual records distinct, gates and declared actor/pass distinctions preserved |
| R06 Evaluation freeze | Full immutable closure, quiescence, artifact/ledger/run/check/halt bindings, acyclic receipt and custody identity |
| R07 Chronology/access | Reference grant/open after verified freeze; fresh comparator; no replay write access; post-comparison inventory unchanged |
| R08 Mapping structure | Exact replay/reference binding, real cited records/anchors, ID independence, legal many-sided mapping, explicit indeterminacy |
| R09 Reports/status | Three report classes, cited derivations, uncertainty retained, blocked/incomplete stages and carried findings not promoted |

The checker may reject use of expected-ID equality as a required mapping
predicate; it cannot detect a person's hidden preference by reading their
mind. Validate explicit schema/configuration and test behavior under ID
renaming. Likewise R05 checks declared identities and process evidence, not
cognitive independence.

No harness check decides whether a claim should have existed, two claims
mean the same thing, a normalization is correct, a semantic delta is good
or bad, or the reference is universally true. It must not encode SRC-001
answers into Core fixtures, prompts, checker conditions or future ID rules.
Its PASS establishes only its named mechanical proposition.

## 21. Minimum synthetic fixture families

Fixtures use newly authored tiny artificial sources and independent dummy
reference records. Do not use any substantive SRC-001 expected answer.
They are harness-mechanics examples, not semantic ground truth.

| Family | Passing control and necessary negative coverage |
| --- | --- |
| H-F1 Leak detector | Clean image/role bundle/input closure; inaccessible forbidden canary is harmless. Exercise renamed/embedded/compressed canary, altered prompt/env, extra mount, unpinned attachment and inherited-context ingress. |
| H-F2 Immutable evaluation freeze | Small completed and blocked runs with real filesystem snapshots, full inventory, detached receipt and comparison access barrier. Exercise byte/path/mode mutation, wrong target, writable alias and chronology reversal. |
| H-F3 ID-independent comparison | Equivalent synthetic evidence with deliberately different IDs, many-to-many partitions and actual reopenable anchors. Renaming either side preserves mechanical legality; same IDs with different anchors do not force correspondence. |
| H-F4 Indeterminate semantic delta | A comparator-authored unresolved row with reason/evidence and an unreached stage. Preserve `CANNOT_DETERMINE` across mapping, uncertainty, counts and summary; removal or forced binary conversion fails. |

H-F1 additionally tests supported text plus an opaque upstream asset and
unchanged supplied criteria as metadata/input plumbing. H-F2 includes an
ordinary halted state with no simulated completion. This bounds input/mode/
F-03 reporting tests within these four families; no new semantic dataset is
needed. Fixtures do not execute a SRC-001 run or genuine model review.

## 22. Required mutation battery

Every case starts from a passing synthetic control, changes one load-bearing
condition, and must fail the stated mechanical check while preserving the
failure evidence. A test name alone is not proof; retain actual command,
exit/report, changed bytes and the unchanged control result.

| Mutation | Required failure |
| --- | --- |
| H-M01 Human answer inventory leak, including renamed/embedded bytes | R03/R04 `FAIL_CONTEXT_LEAK` |
| H-M02 Independent calibration audit leak | R03/R04 `FAIL_CONTEXT_LEAK` |
| H-M03 Correction, addendum or overlay leak | R03/R04 `FAIL_CONTEXT_LEAK` |
| H-M04 Expected-ID list injected into task, prompt or attachment | R04 origin/submission mismatch; incidental pinned input IDs remain legal |
| H-M05 Precomputed comparison metric/score injected into production | R03/R04 origin/allowlist failure |
| H-M06 Missing source/criteria input pin | R01 `FAIL_INPUT_PIN` |
| H-M07 Missing bundle, checker or runtime pin | R02 `FAIL_RELEASE_PIN` |
| H-M08 Altered frozen source, including newline/encoding change | R01 exact-byte mismatch |
| H-M09 Altered criteria or replacement by original export | R01 exact-byte mismatch |
| H-M10 Any post-freeze replay byte/path/mode change | R06/R07 `FAIL_FREEZE_MUTATION` |
| H-M11 Reference/comparison opened before evaluation freeze | R07 `FAIL_COMPARISON_CHRONOLOGY` |
| H-M12 Comparison targets a different replay/freeze digest | R08 `FAIL_COMPARISON_BINDING` |
| H-M13 Comparator has writable replay access or alias | R07 refusal before reference grant |
| H-M14 Reference mapping written inside replay/result | R06/R07 mutation or closure failure |
| H-M15 Schema/algorithm requires expected-ID equality | R08 rejection; different-ID positive control must remain legal |
| H-M16 `CANNOT_DETERMINE` dropped or coerced to match/mismatch | R08/R09 schema/accounting failure |
| H-M17 Unpinned worker attachment, or attachment swapped after sealing | R04 actual-byte mismatch |
| H-M18 Inherited forbidden conversation, compaction or memory | R04/R05 inherited-context failure |
| H-M19 Mutable `main` runtime substitution | R02 immutable identity failure |
| H-M20 Reuse pre-merge receipt without canonical-merge build evidence | R02 missing build/reproduction proof |
| H-M21 Nondeterministic A/B packaging result | R02 `BLOCKED_RELEASE_REPRODUCTION`, execution never starts |
| H-M22 Unrecorded environment path, mount, FD or binary dependency | R03 closure failure |
| H-M23 Fake native context receipt or fixture/manual class upgrade | R04/R05 evidence binding failure |
| H-M24 Accepted return treated as canonical output without production effect | R05/R09 incomplete/F-03 status required; fabricated completion fails |
| H-M25 Same manual producer/reviewer, reused L3/L2S pass, or non-distinct conditional reviewer | R05 plus pinned Slice 7/8 checks |
| H-M26 Wrong/absent source anchor or fabricated reference selector | R08 evidence reopening failure |
| H-M27 S0 response supplies a reference mapping or unauthorized semantic instruction | R04/R05 gate schema/projection/allowed-scope failure |
| H-M28 Missing hidden file, quarantine, journal or evidence log in freeze | R06 full-inventory failure |
| H-M29 Reference custodian grants access using only a timestamp or S0 freeze | R07 missing evaluation-freeze causal receipt |

For H-M01–05 and H-M18, use synthetic forbidden payloads, not actual SRC-001
answers. Test both direct inclusion and copies under innocuous paths.
An inaccessible canary outside the VM must pass H-F1; do not make global
machine-wide absence of reference bytes a requirement.
For H-M27, deterministic checks cover schema/projection and bounded ingress;
they do not purport to recognize arbitrary semantic dishonesty in prose.
Participant eligibility and gate review remain independent procedural evidence.

## 23. Reproducibility and limits

Independent preparation must reproduce exact input export bytes, generic
release/package identities, descriptor derivation, image/tool inventory,
canonical schemas and deterministic harness reports. Repeat each mechanical
check against the same immutable fixture/snapshot and require byte-identical
normalized reports after isolating separately recorded clock/attempt metadata.
Do not discard differing findings under “normalization”.

Actual human/model semantic output is not promised byte-reproducible.
Record exact model/provider/profile/context/effort/budget or real actor/pass
identities, command parameters, source/criteria and execution environment so
another authorized replay can explain its differences. New actual invocations
are new evidence and require new replay IDs; replaying a retained raw return
is only a mechanical transport test.

No silent retries, fallback model, mutable runtime, “best of” output choice,
prompt adjustment after comparison, or re-execution inside a frozen result.
Ordinary pre-freeze Core retries remain subject to their pinned contract and
budget, with every failed attempt and fresh context retained. A semantically
different outcome does not by itself mean the harness is nondeterministic.

## 24. Independent audit and human governance

The required sequence is:

1. Human adopts/amends/rejects this exact proposal, recording its commit,
   tree, blob and digest separately; resolves Q-R1 before execution policy
   is selected. The proposal remains historically PROPOSED.
2. Separate bounded implementation authority enumerates calibration-only
   tooling/schema/fixture paths. Implement and validate them; obtain fresh
   independent audit of exact implementation identity and actual mutations.
   Producer checks do not substitute for that audit.
3. Separately authorize canonical-merge release preparation and, if desired,
   one named replay's execution, mode, participants, probes and budget.
   Review input/release/visibility locks and blindness evidence before start.
4. Execute only that authorized attempt; preserve every halt/failure.
   Freeze the complete blind result before opening reference access.
5. Conduct independent fresh post-freeze comparison, then a fresh independent
   audit of isolation, complete freeze, chronology, mapping evidence,
   uncertainty and the three report classes. Record exact audited digests.
6. The human authority records a separate calibration-evaluation disposition
   against those receipts. This does not update run acceptance, finding
   status, adapter lifecycle, golden status or v1 automatically.

S13 remains its ordinary independent-audit/authority boundary. If the run
was frozen awaiting S13, any later authority disposition is an external
record against the immutable result; do not append it to the frozen run
or relabel that run `ACCEPTED`. An ordinary acceptance transition requiring
run mutation cannot be performed after evaluation freeze. No projection
commission or acceptance is created here.

If comparison suggests a defect, retain the frozen replay and finding.
Only separate authority may open successor Core/adapter development.
That work needs its own exact implementation/review/governance and immutable
release. A new authorized blind replay evaluates the successor; the old
result is never “repaired” after reference exposure. A participant exposed
to the reference cannot return as a blind producer for that new replay.

## 25. Carried findings and non-claims

These states are carried, not adjudicated by this proposal:

| Finding | Preserved state/boundary |
| --- | --- |
| F-03 | OPEN / MUST PRESERVE; accepted-return → canonical LedgerWriter/orchestrator production reachability unproven |
| F-04 | OPEN / MUST PRESERVE; path/case/platform portability unresolved |
| F-05 | OPEN / MUST PRESERVE, bounded by F-03 |
| A4-07 | Existing strength retained; absent canonical claim-to-claim evidential-edge owner |
| S5A4-02 | DEFERRED |
| S5A4-03 | DEFERRED |
| S5A2-03 / S5-A-03 | DEFERRED |
| Slice 6 A-01 | Retained |
| Slice 6 A-02 | Retained |
| Slice 6 A-04 | Retained |
| Slice 6 A-05 | Retained; newer portable return checks do not repair L2F A-05 |
| Slice 6 A-03 | Closed observation |
| Slice 6 A-06 | Accepted observation |
| A7-04 | MUST PRESERVE; K2.19 structural PASS carries zero semantic warrant |
| A7-05 | MUST PRESERVE; synthetic semantic declarations are not reference truth |
| A7-08 | MUST PRESERVE; manual profile and distinct actor/pass independence |
| A8-01 | MUST PRESERVE |
| A8-02 | MUST PRESERVE |
| A8-03 | MUST PRESERVE |
| A8-04 | MUST PRESERVE |
| A8-05 | LATER-NONBLOCKING |
| A8-06 | LATER-NONBLOCKING |
| A8-07 | LATER-NONBLOCKING |
| A8-08 | LATER-NONBLOCKING |

The Slice 8 implementation reconciliation and Slice 7/8 adopted records
remain unchanged. A8 states above are also explicitly carried by the human's
present design instruction; this proposal supplies no new finding meaning
or closure evidence. Earlier A7 closed observations remain closed
observations only. All other existing MUST PRESERVE/LATER/deferred findings,
including their qualifiers and scope, retain their exact governing records.
No absence from this summary changes a finding.

K2.19 and K2.20 remain structural. Fresh semantic judgment, human authority,
immutable evidence, provenance, source walk, lineage, typed relations,
ambiguity/referent procedure, material/L2F and single-writer boundaries retain
their separate owners. Replay may provide evidence relevant to a finding;
only explicit evidence, independent review and governance can change its
state.

SRC-001 remains `CLOSED_FOR_CALIBRATION`; SRC-002 remains `NOT_AUTHORIZED`.
No result described here makes SRC-001 golden, validates semantics generally,
sanctions agent mode, accepts arbitrary runs, establishes production
readiness, authorizes SRC-002 or declares Aleph v1.

Intent-fidelity is excluded in full: no bounded interview, INT ledger,
IF-01 through IF-12, research-charter gate, current-world intake acquisition
or intent-fidelity run-format change is implemented or evaluated.
Its subsequent product-intake track does not become authorized merely
because a replay has stopped.

## 26. Design delivery and adoption readiness

This change adds only this proposal and its single
`files.repository_administration` entry in `core.manifest.json`.
No generic Core, checker, prompt, adapter, runtime, test, calibration
reference or frozen input bytes are changed. No harness is implemented,
release assembled for replay, replay run started, worker/model invoked,
manual replay adjudicated, reference comparison performed, intent-fidelity
begun or merge executed.

Before publication, inspect the exact diff; run `git diff --check`, the
Core/admin boundary validator and runtime drift check; compare all preexisting
tracked-file hashes and manifest classifications with the canonical base.
Prove that only this proposal and the one admin entry changed, no replay/
comparison/intake artifact was created, protected branch/stash/worktrees
remain intact, and remote `main` remains the canonical merge. Commit normally
and push only the named design branch.

The proposal resolves input identity, release preparation, isolation,
visibility/withholding, leak checks, gate chronology, failure and F-03
semantics, the evaluation freeze, immutable storage, comparator access,
ID-independent mapping, separate reports, uncertainty, mechanical checker
scope, fixtures/mutations, reproducibility and audit/governance. Q-R1 is the
single outstanding human-policy choice. Measured future release/environment/
execution identities are mandatory preparation outputs, not guessed policy
or fabricated design-time digests.

BLIND SRC-001 REPLAY HARNESS DESIGN PROPOSED — HUMAN AUTHORITY ADOPTION REQUIRED BEFORE IMPLEMENTATION OR REPLAY

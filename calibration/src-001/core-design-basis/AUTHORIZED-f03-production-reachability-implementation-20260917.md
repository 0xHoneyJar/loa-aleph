# F-03 production reachability implementation authority

Date: 2026-09-17

Status: AUTHORIZED — HUMAN IMPLEMENTATION AUTHORITY

Decision class: bounded implementation authorization; repository administration

## Exact authority subject

Repository: `0xHoneyJar/loa-aleph`

Adopted design commit: `484fa227e1ed23c81dc4cf37987aa0be16eded8f`

Adopted design tree: `13ad9e53a77949718afa9dc59c25c2e9d52beacb`

Proposal: `calibration/src-001/core-design-basis/PROPOSED-f03-accepted-worker-return-production-reachability-design-20260917.md`

Proposal blob: `b5fd008ff2aab18cb632c248cb8259735d053714`

Proposal SHA-256: `6144bef6f06ee55e8507d7019c13658b0404a0bafe3f8aebe09f6a18a80f1524`

Separate adoption record:
`ADOPTED-f03-production-reachability-design-20260917.md`

Implementation branch:
`agent/f03-production-reachability-implementation-20260917`

Isolated implementation worktree:
`/tmp/loa-aleph-f03-implementation-20260917`

## Human implementation declaration — verbatim

```text
I authorize implementation of the adopted F-03 accepted-worker-return production-reachability design at commit 484fa227e1ed23c81dc4cf37987aa0be16eded8f.

This authority permits the bounded repository changes required by that adopted design, including:

- persistence of the exact human adoption record and this implementation authority as repository-administration evidence;
- the adopted cumulative `1.9.0-provisional` run-format capability `orchestrator-work-transitions`;
- the bounded Core additions for executable first-unmet-work selection, deterministic accepted-value-to-transition derivation, S1 criteria-review execution, relation-role bindings, stage-entry/exit work obligations, and mechanical canonical serialization required through the adopted S0–S4 frontier;
- the durable adapter orchestration controller, work items, validation-basis records, dispatch intents, accepted-return receipts, commit intents, consumption records, locking, recovery, replay refusal, and process-boundary reauthentication defined by Architecture B;
- routing ordinary `/loa-aleph resume RUN-id` through that controller while preserving `/loa-aleph` as the operator-facing progression and canonical-commit abstraction;
- the required changes to Loa adapter source, run control, worker bundle/dispatch/return handling, LedgerWriter ingress, types, Core loading, runtime routing, installed skill, command documentation, adapter manifests/profiles, schemas or adapter-owned control formats where required by the adopted design;
- regeneration of affected `runtime-js` output from source;
- all required deterministic, fixture-simulated, process, recovery, mutation, compatibility, packaging, installation, source/runtime-parity, Core-boundary, and negative tests;
- updates to manifests, fixtures, documentation, implementation reconciliation, and repository-administration evidence necessary to keep source, generated runtime, packaging, and retained-run compatibility consistent;
- normal isolated development branches/worktrees, commits, and pushes required to produce an auditable implementation candidate.

Implementation must preserve the adopted trust boundaries: workers remain unable to write canonical state; accepted worker output remains quarantined until authenticated; persisted JSON is not a bearer authorization; Core owns legal work and deterministic transition derivation; the orchestrator remains the sole canonical writer; exact run-local pins remain authoritative; human authority remains separate; crash recovery remains journaled and fail-closed; simulation remains visibly tainted; old retained runs retain their pinned semantics; and no fallback or arbitrary-file writer may be introduced.

This authority does not authorize provider or model calls, genuine native worker execution, live corpus execution, `/loa-aleph` execution against a real research corpus, SRC-001 preparation or replay work, closed-reference access or comparison, release preparation, ingestion into the `0xHoneyJar/loa` repository, agent-mode sanction, F-03 closure, F-04 closure, F-05 closure, intent-fidelity work, PR creation, or merge.

Structural, fixture, simulated, and process tests may demonstrate implementation properties but must not be represented as native replay, live integration, semantic validation, sanction, acceptance, or F-03 closure.

F-03 remains OPEN / MUST PRESERVE throughout implementation. F-04 remains OPEN / MUST PRESERVE. F-05 remains OPEN / MUST PRESERVE and bounded by F-03.

If implementation reveals a conflict with the adopted design, requires a semantic/Core policy decision not already adopted, requires weakening any trust boundary, or requires expanding beyond the adopted S0–S4 frontier, implementation must stop and surface the exact conflict rather than improvise a replacement design.
```

The fenced declaration is the human's exact message. All surrounding text
is repository identity and scope metadata, not additional human wording.

## Starting verification and preservation

Remote `main` was independently verified at
`8236b9f35c38cdd604b2389b42589f27755cdade`, tree
`72075f93bc9fcb3c76f4480bc612693211efd240`.
The remote design branch was verified at the exact adopted design commit.
The new implementation branch was created from that commit with a clean
index and worktree. The proposal's exact blob, SHA-256 and byte count match
the adopted subject.

The primary checkout remains on
`agent/src-001-blind-replay-preparation-20260914` at
`a568f499db6707e4787ee3da969dbd6193b04944`, tree
`a72612678f8cbdc4ae2951eb5b26f1b172c71847`. Its index/worktree, stale local
`main` at `c949ea5f39daef42d22ca2e4111164d63dffcbf1`, adapter branch
`agent/loa-adapter-release` at `b9e2db742a087b8ae659ec39e476ed5e240cfa1f`,
stash `e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8`, design worktree, and
all pre-existing worktree registrations are preserved. No preparation
branch bytes are an implementation dependency.

This administration record and the separate adoption record are persisted
before executable changes. Their containing commit adds only those records
and their required `core.manifest.json` administration entries. The proposal
is not rewritten. No completion or audit claim is made by this authority.

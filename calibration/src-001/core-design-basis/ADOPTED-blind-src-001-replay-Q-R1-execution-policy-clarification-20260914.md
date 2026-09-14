# Blind SRC-001 Replay Harness Q-R1 Execution Policy Clarification

Date: 2026-09-14

Status: ADOPTED CLARIFICATION — HUMAN AUTHORITY

Decision class: bounded Q-R1 execution-policy selection; repository administration

## Exact Authority Subject

| Identity | Value |
| --- | --- |
| Repository | `0xHoneyJar/loa-aleph` |
| Branch | `agent/src-001-blind-replay-harness-design-20260914` |
| Adopted proposal path | `calibration/src-001/core-design-basis/PROPOSED-blind-src-001-replay-harness-design-20260914.md` |
| Proposal commit | `c607b724d16c13202d581b23bab6af5e8a256a6a` |
| Proposal tree | `88fc25d6c68b6bfbb1ea71c5ca385d1fb4c5bc79` |
| Proposal Git blob | `40370866bcdfd3c70941aac21298aaaae96fff6e` |
| Proposal SHA-256 | `52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8` |
| Adoption record path | `calibration/src-001/core-design-basis/ADOPTED-blind-src-001-replay-harness-design-20260914.md` |
| Adoption commit | `6dbb68ce7b6a5f2c10e7808dc2eacc3d38bf89e9` |
| Adoption tree | `8f3bdb283031c94da0420c38940bc2502728aeb8` |
| Adoption record Git blob | `25d60b9ec93eaa187fbf16ccf23ab305e1a70e85` |
| Adoption record SHA-256 | `f4c6c97d74c11e76dd48dde2b75d57c8d1590c3f96cfd93d237d94cdf40953e3` |
| Canonical Slice 8 merge | `c949ea5f39daef42d22ca2e4111164d63dffcbf1` |
| Canonical Slice 8 tree | `8ced176e50da0d05070b164cfe725752df947d3f` |

The [adoption record](ADOPTED-blind-src-001-replay-harness-design-20260914.md)
and its commit exist before this separate clarification. The
[proposal](PROPOSED-blind-src-001-replay-harness-design-20260914.md) remains
historically `PROPOSED`; neither its bytes nor its Q-R1 wording is rewritten.
This record resolves only proposal section 6, “Execution-mode policy and the
one unresolved choice”, in conjunction with section 13's F-03/failure
boundary and section 24's separate governance sequence.

## Human Authority Declaration — Verbatim

```text
I clarify Q-R1 for the adopted Blind SRC-001 Replay Harness design: the first replay execution policy is an experimental/unsanctioned native Loa command-path replay attempt using genuine host attestation and genuine native workers under the exact immutable replay release and isolation boundary. This policy selection does not authorize replay execution, attestation probes, model calls, release preparation, or reference access by itself; those require separate explicit authority. Manual mode remains the only sanctioned Aleph execution mode, and successful native execution does not sanction agent mode. A genuine F-03 or other Core/adapter halt must be preserved as an incomplete replay result with no manual, fixture, simulated, helper-driven, or hand-authored fallback. No execution-mode change is permitted within that replay attempt.
```

The declaration is preserved exactly as supplied. The remaining identity,
disposition and boundary statements are contextual records, not additional
declaration text.

## Exact Q-R1 Disposition

```text
Q-R1 = EXPERIMENTAL_UNSANCTIONED_NATIVE_LOA
```

The first replay execution policy, when separately authorized, is one
experimental/unsanctioned native `/loa-aleph` command-path attempt.
It is intended to exercise the real:

- immutable Loa installation;
- host attestation;
- start;
- human S0 gate;
- resume;
- native worker prepare/dispatch/accept path;
- ordinary orchestrator/writer reachability;
- retained checker;
- halt/block behavior.

This clarification chooses policy only. It does NOT itself authorize any
of those operations to occur. No replay ID, execution record, release
identity, host-capability receipt or model identity is fabricated here.
The policy question is resolved; all separate implementation, preparation,
audit and execution prerequisites remain unsatisfied until evidenced and
explicitly authorized under the adopted design.

The first policy is not a manual replay and has no manual-completion option.
No execution-mode change is permitted within that replay attempt.
The harness remains calibration-only and outside generic Core by default;
no SRC-001-specific command, adapter behavior or replacement pipeline is
introduced.

## Existing Manual-Sanction Doctrine

These exact doctrine bytes are bound at the proposal commit
`c607b724d16c13202d581b23bab6af5e8a256a6a` and remain unchanged:

| Doctrine | Git blob |
| --- | --- |
| [AGENTS.md](../../../AGENTS.md) | `a6c08d8b9b65e2f162a79a97d72f7b917c8b809c` |
| [Decision 0004](../../../docs/decisions/0004-core-adapter-and-bundle-boundary.md) | `4b756eada348b85d942e0832919febb9bc68b7d6` |
| [Manual-mode runbook](../../../docs/architecture/09-runbook-manual-mode.md) | `8d776d727c8e0fdca62884d73435898f0ddc2266` |
| [Run-control template](../../../docs/architecture/templates/01-run-control.md) | `4c36539e446f17bc2e428461116f934e01a390cb` |

The sanction boundary is:

- manual mode remains the only sanctioned Aleph execution mode;
- native replay is explicitly experimental/unsanctioned;
- successful native replay does not sanction agent mode;
- checker PASS does not sanction agent mode;
- replay comparison does not sanction agent mode;
- this clarification creates no production-readiness claim.

The reserved `core-manual` binding and role-specific manual independence
rules remain intact. They cannot relabel a native run, supply a fallback
or upgrade fixture/static declarations into genuine execution evidence.

## Separate Execution Authority

Implementation authority remains `PENDING`; this record creates none.
Replay execution authority remains `PENDING`; this record creates none.
Release preparation and reference access/comparison likewise remain subject
to separate explicit authority.

Before the experimental native replay may begin, separate explicit human
execution authority must name or bind at least:

- exact adopted harness implementation identity;
- fresh independent implementation audit result;
- exact canonical-merge release identities;
- replay ID;
- execution mode;
- exact provider/model/profile/context/effort mapping;
- attestation-probe authority;
- model-call authority;
- participant/role identities where required;
- execution budget/stop policy;
- isolation/environment identity;
- visibility/withhold manifest;
- frozen input lock.

Canonical-merge release identities must be measured through the adopted
independent reproduction procedure at
`c949ea5f39daef42d22ca2e4111164d63dffcbf1`. Q-R1 neither authorizes those
builds nor permits substitution of the pre-merge publication receipt.
No attestation probe or model call may occur merely because Q-R1 is resolved.
The policy declaration is not an implementation audit, runtime receipt,
execution permit or permission to inspect answers.

## No Fallback

If the native attempt reaches F-03, another Core/adapter production
reachability failure, attestation failure, isolation failure,
context-evidence failure, a legitimate Core gate, unsupported representation,
a budget halt, checker failure, or any other genuine `FAIL`/`BLOCKED`
condition, retain the exact incomplete result and all available artifacts.
A legitimate gate remains halted/incomplete while awaiting its ordinary
authorized response; no missing response is inferred. Existing Core
gate/resume contracts remain unchanged.

Never replace that result with:

- manual completion;
- fixture-simulated completion;
- static records;
- direct helper calls;
- direct LedgerWriter invocation;
- hand-authored canonical ledgers;
- synthetic worker returns;
- mode relabeling;
- a weaker model/provider/profile;
- a second execution mode inside the same replay ID.

Do not treat a command transport PASS as proof of canonical stage completion.
Record the original halt/error, stage, gate, checker result and evidence
identity separately from the harness's own integrity result. No simulated
substitution may turn failure, uncertainty or missing production into success.
A new execution strategy requires a new human authority decision and, where
appropriate, a new replay ID.

## F-03 Remains Open

Q-R1 does not close or weaken **F-03 OPEN / MUST PRESERVE**.
The experimental replay may produce new evidence relevant to F-03.
Only actual evidence of accepted-worker-return → production
orchestrator/LedgerWriter canonical mutation could support a later governance
decision about F-03. Helper/process tests, static ledgers, manual completion,
accepted-return quarantine and inferred reachability do not supply that proof.

A halt caused by a missing production handoff confirms that the replay is
incomplete. It is not a harness failure if the harness reports it correctly.
No finding changes state without actual evidence, independent review and
governance. F-04 remains OPEN / MUST PRESERVE; F-05 remains OPEN / MUST
PRESERVE, bounded by F-03.

All other proposal section 25 and adoption-record carried findings remain
at their existing strength: A4-07; deferred S5A4-02, S5A4-03 and
S5A2-03 / S5-A-03; retained Slice 6 A-01/A-02/A-04/A-05; Slice 6
A-03 closed observation and A-06 accepted observation; A7-04/A7-05/A7-08
MUST PRESERVE; A8-01/A8-02/A8-03/A8-04 MUST PRESERVE; and
A8-05/A8-06/A8-07/A8-08 LATER-NONBLOCKING. All remaining carried
qualifiers, findings and closed observations are preserved without promotion.

## Blindness and Comparison

The native execution remains subject to every adopted blindness rule:

- no closed reference access before evaluation freeze;
- no prior calibration answers in production context;
- no developer repo or inherited conversation context;
- no reference-derived metrics or expected IDs;
- only exact allowed generic inputs/context;
- reference comparison remains post-freeze and independently conducted.

Q-R1 does not weaken any isolation requirement. The exact frozen source,
criteria and input boundaries remain those named in proposal section 4.
Normal S0 corpus freeze is not the replay-evaluation freeze. A failed
isolation seal does not permit blind-comparison claims or reference opening.
Any later authorized comparison must bind the immutable evaluation-frozen
result, remain separate from replay production and have no replay-write
capability. ID equality is not required; `CANNOT_DETERMINE` remains legal.
No reference access or comparison is authorized by this clarification.

## Intent-Fidelity and Status

This clarification does not authorize or begin intent-fidelity.
The previously adopted architecture sequence remains:

```text
Slices 1–8 → blind SRC-001 replay → later intent-fidelity track
```

SRC-001 remains `CLOSED_FOR_CALIBRATION`; SRC-002 remains `NOT_AUTHORIZED`.
This clarification establishes no semantic validation, acceptance, agent
sanction, production readiness, golden status or Aleph v1.
The experimental-native policy is recorded but not executed.

## Repository and Persistence Boundary

This second, separate commit adds only this clarification record and its
single `files.repository_administration` entry in `core.manifest.json`.
The adoption commit and proposal commit are not amended. Their exact bytes
and history remain intact, as do Core/checker/prompts/adapter/runtime/tests,
the run format, calibration reference and frozen source/criteria.

No replay tooling or schemas, replay attempt directory, release preparation,
host-capability receipt, attestation invocation, model call, replay workspace
export, closed-reference answer access, comparison or intent-fidelity work
is created or performed. No implementation authority or execution authority
is created. The adapter branch, stash, other worktree registrations and
canonical `main` remain untouched. Push is limited to the existing design
branch; no merge occurs.

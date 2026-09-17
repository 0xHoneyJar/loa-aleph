# C-03 pending extraction-event commitment — HUMAN clarification

Date: 2026-09-17

Status: **ADOPTED — HUMAN CORE CONTRACT CLARIFICATION / IMPLEMENTATION CONTINUATION AUTHORITY**

Repository-administration evidence only. This retains the HUMAN declaration received for continuation; it is not a run authority-response artifact, native execution, acceptance, sanction, a release, or finding closure.

## Bound subjects

Repository: `0xHoneyJar/loa-aleph`. Branch: `agent/f03-production-reachability-implementation-20260917`.

| Subject | Commit | Tree |
| --- | --- | --- |
| Adopted design | `484fa227e1ed23c81dc4cf37987aa0be16eded8f` | `13ad9e53a77949718afa9dc59c25c2e9d52beacb` |
| Original implementation authority | `4a999689a21b08f4d7c333e3b28362d47476d02f` | `755ab653bf7ef8e2d4186f937f52a098722cc6a8` |
| Initial C-01 stop | `5e17212cedbb47fa1cc27a0f5f11d941f9d7850e` | `5f2097b28f0143bc962fd1fa3740add5d5e1e785` |
| C-01 clarification | `2cf9d884232107ff98268844ec3e8146f95a9a93` | `ac94509d9b6cc25536e1116291804ee55bd2016c` |
| C-01 reconciliation | `e2cbc0b06f38a36ddd4cad30e069d857e63aac5e` | `d3ea8c065a14b1e311dd6ecd16768dd20bad9879` |
| C-02 stop | `ad8be4e9a88339530317e12e573b0299b15bef3a` | `d0972ca50451f2542686d5b51e5f40e1436fe62c` |
| C-02 clarification | `248aad3871c323aafec96f2664f26b60e6f0f062` | `ee7c9b9caf98ad069bebe0b3c2256153af00761d` |
| Partial implementation after C-02 | `bb866b23e8662d7ed515d1ed1d07e01383933321` | `5b9cf3bc2208dd261cab89b77baa445e5a70d995` |
| C-03 stopped checkpoint / continuation base | `eb31b3a67fbb450cd7666e2b437c3ccf190f543f` | `eec174936bd346cedff1b33c4959ab2fc0bdebb1` |

Canonical GitHub main was verified as `8236b9f35c38cdd604b2389b42589f27755cdade`, tree `72075f93bc9fcb3c76f4480bc612693211efd240`. The exact local/remote continuation gate passed with a clean worktree. The primary checkout, paused SRC-001 branch, adapter branch, stash, all worktree registrations, three historical stops and prior clarification records were preserved.

C-03 stop record: `STOPPED-f03-production-reachability-implementation-shared-position-event-continuation-conflict-20260917.md`; blob `321692735b31b33e5d343848d171041260065c88`; SHA-256 `11e34ce1f2e1484913a8dafa37e07226edaa8f9014c8f611eeac91f1ee39600b`; 27,677 bytes. The original discriminator and stop evidence remain historical.

Chronology: adopted design → implementation authority → C-01 stop → HUMAN C-01 clarification/reconciliation → C-02 stop → HUMAN C-02 clarification/partial implementation → C-03 stop → this HUMAN C-03 clarification → authorized continuation. No prior record is rewritten to imply this rule was previously adopted.

## HUMAN declaration — verbatim

I clarify the adopted F-03 accepted-worker-return production-reachability design for cumulative run format 1.9.0-provisional and capability orchestrator-work-transitions as follows.

An extraction-event row whose `status = pending` is a retained provisional reservation of one event identity. It is not yet immutable committed source-walk history. For cumulative 1.9.0-provisional runs using orchestrator-work-transitions, an authenticated Core-authorized transition MAY advance that same event row from `pending` to `committed`.

The `pending → committed` advancement MUST preserve every field other than `status` exactly. The following fields remain identical across the transition:

- `event_id`;
- `source_id`;
- `start_byte`;
- `end_byte`;
- `shared_position_key`;
- `event_ordinal`;
- `packet_id`;
- `origin`;
- `producer_invocation_id`.

Only `status` may change, and only from `pending` to `committed`.

The existing event identity is retained. Core MUST NOT represent commitment by appending a successor extraction-event row, allocating a new event ID for the same event, reusing the same shared-position ordinal in another row, assigning a new ordinal merely to represent commitment, deleting the pending row, or rebinding the event to different source coordinates, packet, producer, origin, or shared-position identity.

This clarification does not make extraction events generally mutable. A `committed` event is immutable historical source-walk evidence. Once committed, its canonical row MUST NOT be altered or reverted. `committed → pending` is forbidden. `committed → materially different committed` is forbidden. Exact repeated observation of an already committed row is only an idempotent no-op.

Likewise, a retained pending event may not be materially edited while remaining pending. `pending → pending` is legal only as an exact idempotent no-op. If any non-status field would need to change, Core MUST refuse the transition rather than mutate the event identity.

A `pending → committed` transition is legal only when all existing Core predicates required for commitment of that exact event are mechanically satisfied, including the event's packet/exact-evidence binding, source-position and fragment containment requirements, shared-position key and contiguous ordinal rules, current cursor relationship, and any prerequisite authenticated work required by the adopted orchestration design. This clarification does not weaken K2.14.

The exact prior pending row MUST remain inspectable through the authenticated orchestration/writer transaction before-image and retained commit/recovery evidence. Preservation of that before-image is the history of the event's provisional state; the canonical source-walk table contains the same event identity at its current lifecycle state.

This clarification narrows the prior C-02 statement that historical extraction events may not be rewritten. For purposes of that rule, `committed` extraction-event rows are historical and immutable. A `pending` event is provisional retained state and may undergo only the specific `pending → committed` status advancement authorized here. C-02 remains unchanged for primary walk intervals, resume cursors, fresh gap-review rows, committed extraction events, and the separately authorized current-projection semantics of `Per-source completion`.

Core work-transition derivation MUST mechanically derive the expected pending before-row and committed after-row from authenticated retained evidence. The worker, parent model, skill, or caller may not supply an arbitrary committed event after-image. The writer MUST authenticate the before-state, exact event identity, work/checkpoint/chain binding, and Core-derived transition before performing the status advancement.

Crash recovery MUST recognize only the authenticated exact before-state or exact after-state. A partially or differently modified event row MUST fail closed. Repeated resume after successful commitment MUST NOT create another event, advance the ordinal again, or produce a duplicate canonical effect.

Implementation must add focused positive and negative tests covering at minimum:

- valid pending → committed advancement;
- every non-status field remaining identical;
- exact pending-row before-image retention;
- repeated-resume idempotency;
- recovery before event advancement;
- recovery after event advancement;
- shared-position sibling continuation after commitment;
- cursor advancement only after the pending event becomes committed;
- changed event ID refusal;
- changed source or coordinates refusal;
- changed shared-position key refusal;
- changed event ordinal refusal;
- changed packet ID refusal;
- changed origin refusal;
- changed producer invocation refusal;
- pending → changed pending refusal;
- committed → pending refusal;
- committed → changed committed refusal;
- append-successor representation refusal;
- duplicate shared-position ordinal refusal;
- unchanged predecessor-format behavior.

This clarification is additive only for new cumulative 1.9.0-provisional runs using orchestrator-work-transitions. It does not migrate, reinterpret, or change retained 1.2–1.8 runs or their pinned Core, checker, adapter, runtime, or bundle bytes.

I authorize the existing F-03 implementation branch at stopped checkpoint eb31b3a67fbb450cd7666e2b437c3ccf190f543f to persist this clarification and resume the previously authorized implementation solely under the adopted F-03 design as clarified by C-01, C-02, and this C-03 decision.

This clarification does not authorize provider or model calls, genuine native worker execution, live-corpus `/loa-aleph` execution, SRC-001 preparation or replay, release preparation, Loa ingestion, PR creation, merge, agent-mode sanction, or F-03/F-04/F-05 closure. F-03 remains OPEN / MUST PRESERVE. F-04 remains OPEN / MUST PRESERVE. F-05 remains OPEN / MUST PRESERVE and bounded by F-03.

If another unadopted semantic or Core policy conflict is encountered, implementation must stop again rather than infer a rule.

## Retention and scope

The declaration above is retained as 6,065 UTF-8 bytes including its final LF, SHA-256 `dbd50ce6222280bbdc722b0b48af24c0b520003d99082e703cc004e50648f002`. Only the declaration is controlling HUMAN text; surrounding metadata is PRODUCER repository administration.

C-03 permits only same-identity `pending → committed` status advancement at cumulative 1.9 with `orchestrator-work-transitions`. C-01 remains controlling for degraded packets. C-02 remains controlling except for the specific provisional-event clarification stated above. All committed events and other historical source-walk tables remain protected; no general mutable-event or successor-event facility is authorized.

F-03: **OPEN / MUST PRESERVE**. F-04: **OPEN / MUST PRESERVE**. F-05: **OPEN / MUST PRESERVE**, bounded by F-03. Default/current remains 1.8.0-provisional; 1.9 remains implementation-gated; adapter protocol remains 1.0.0-provisional.

No provider/model calls, genuine native workers, live corpus, SRC-001 preparation/replay or attempt creation, closed-reference access/comparison, release preparation/publication, Loa ingestion, PR, merge, sanction, acceptance, finding closure, or v1 declaration is authorized. Fixture simulation is structural evidence only. Full adopted S0–S4 completion remains required; another unadopted Core policy conflict requires another stop.

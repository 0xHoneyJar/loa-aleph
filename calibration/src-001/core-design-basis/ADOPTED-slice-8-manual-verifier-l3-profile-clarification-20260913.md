# Slice 8 Manual Verifier-L3 Profile Clarification

Date: 2026-09-13

Status: ADOPTED CLARIFICATION — HUMAN AUTHORITY

Decision class: bounded Q8-MANUAL clarification; repository administration

## Exact Authority Subject

- Repository: `0xHoneyJar/loa-aleph`
- Branch: `agent/slice-08-duplicate-overlap-design-20260913`
- Exact adopted proposal path:
  `calibration/src-001/core-design-basis/PROPOSED-slice-8-s4-duplicate-versus-overlap-fresh-refutation-design-20260913.md`
- Exact proposal commit:
  `66d739ec1abaf02bb24abcc8f530b2bc0bd1eb6e`
- Exact proposal tree:
  `6ab19a4ec121bf498980c36824844eb97c5016e6`
- Exact proposal Git blob:
  `cc851b6b619e6b553f749bb3a68c817ea40e6a65`
- Separate Slice 8 adoption record:
  `calibration/src-001/core-design-basis/ADOPTED-slice-8-s4-duplicate-versus-overlap-fresh-refutation-design-20260913.md`
- Adoption commit:
  `af9adc419a803f690a15ea12d4bbb8a9afeb449c`
- Adoption tree:
  `c75c84ee605f116d997bd3efd6240294d12212ed`
- Adoption record Git blob:
  `d39a29653595858c6d70b36fe32cdcb57a8fd616`

The adoption commit exists before this separate clarification. The proposal
remains historically `PROPOSED`; its exact revised bytes are adopted by the
separate adoption record. This clarification resolves only Q8-MANUAL in
proposal section 17 and does not rewrite the proposal or adoption.

## Human authority declaration — verbatim

```text
I clarify the adopted Slice 8 design: for manual Slice 8 duplicate-overlap review subjects only, reviewer_profile is exactly {profile_id:"n/a (core-manual)",profile_digest:null,role:"verifier-l3",model_identity:"human"}. No model/profile/effort/context mapping is invented for manual execution; existing manual run identity rules remain controlling. The round-1 reviewer must be distinct from the producer, and when round 2 is required after cannot-determine, the round-2 reviewer must be distinct from both the producer and round-1 reviewer, with distinct passes. Same-person separate sittings do not satisfy the independent-review requirement. Manual evidence remains manual-separate-pass and does not prove native dispatch. Agent and hybrid verifier-l3 reviewer_profile requirements remain unchanged.
```

The declaration is preserved exactly as supplied. The remaining bindings and
scope statements are contextual metadata, not additional declaration text.

## Existing Manual Doctrine and Slice 7 Precedent

Existing manual execution doctrine remains controlling. These retained
documents are bound at the exact proposal commit
`66d739ec1abaf02bb24abcc8f530b2bc0bd1eb6e` and are unchanged by this record:

| Doctrine | Exact Git blob |
| --- | --- |
| [AGENTS.md](../../../AGENTS.md), manual-only sanction and authority boundaries | `a6c08d8b9b65e2f162a79a97d72f7b917c8b809c` |
| [Manual-mode runbook](../../../docs/architecture/09-runbook-manual-mode.md), immutable manual binding and retained execution identity | `9b3c52cf6f801082a634e38298a17542c4cadf51` |
| [Run-control template](../../../docs/architecture/templates/01-run-control.md), T1.1 identity and execution profile | `4c36539e446f17bc2e428461116f934e01a390cb` |
| [Decision 0004](../../../docs/decisions/0004-core-adapter-and-bundle-boundary.md), Core/adapter and immutable bundle boundary | `4b756eada348b85d942e0832919febb9bc68b7d6` |
| [Routing doctrine](../../../docs/routing-and-clustering.md), manual execution and sanction | `de1ce4788c588609d874ef973206779d91876661` |

The existing Slice 7 manual-profile clarification is precedent only:

- Path:
  `calibration/src-001/core-design-basis/ADOPTED-slice-7-manual-reviewer-profile-clarification-20260912.md`
- Commit: `ddc2a3e7caaf9298780ef2795c534a4332357cf8`
- Tree: `37341822f9a0a409f48963f4e354ed439576fc4c`
- Git blob: `8698544d58aef6dee665ed786a5d9345c49d523c`

That record remains unchanged and limited to its own Slice 7 `verifier-l2s`
scope. It does not supply authority for this exception; the human declaration
above supplies the separate, bounded Slice 8 authority.

## Clarification

### Manual reviewer_profile

For manual Slice 8 duplicate-overlap review subjects only:

```json
{
  "profile_id": "n/a (core-manual)",
  "profile_digest": null,
  "role": "verifier-l3",
  "model_identity": "human"
}
```

Exactly four keys.

No extra or missing keys.

No synthetic model object.

No synthetic profile digest.

No model effort/context mapping.

Execution mode is established from retained run identity, not guessed from these values.

### Existing manual identity remains controlling

Continue requiring the existing manual run identity:

- adapter ID `core-manual`;
- host identity `human-operator`;
- model IDs `human`;
- adapter profile `n/a (core-manual)`;
- execution mapping `n/a (manual)`.

The four-key reviewer profile does not replace actor/pass evidence.

### Independence

Round 1:

- reviewer actor distinct from producer actor;
- reviewer pass distinct from producer pass.

Round 2 exists only after round-1 `cannot-determine`.

When required:

- round-2 reviewer actor distinct from producer;
- round-2 reviewer actor distinct from round-1 reviewer;
- all corresponding passes distinct.

Same-person separate sittings may be retained only as temporal-review evidence and do NOT satisfy independent-review requirements.

The checker may verify declared actor/pass inequality mechanically; it cannot prove cognitive independence.

### Execution-kind honesty

Manual evidence remains:

`manual-separate-pass`

It must never be upgraded to:

`native-dispatch`

Static or fixture-simulated evidence does not prove manual human execution either.

### Agent/hybrid unchanged

Agent and hybrid Slice 8 `verifier-l3` continue to require the exact pinned:

- profile ID;
- profile digest;
- model identity object;
- context identity;
- effort;
- role mapping.

The manual exception must not weaken those paths.

### Scope

This clarification applies only to:

- Slice 8;
- `duplicate-overlap-review`;
- manual duplicate-review subjects;
- role `verifier-l3`.

It does not modify the Slice 7 `verifier-l2s` clarification and does not create a generic manual-profile exception for other roles or slices.

It does not authorize humans to choose source meaning as human authority. Manual humans here perform the sanctioned semantic reviewer procedure over frozen material.

It does not authorize implementation.

## Retained Subject and Pass Evidence

The adopted proposal's section 17 seven-field manual evidence remains:

```text
{producer_actor,reviewer_actor,producer_pass_id,reviewer_pass_id,subject_digest,shown_digest,withheld_declaration}
```

The four-key profile does not replace those fields or their exact bindings.
The producer pass remains bound to the retained producer `context_id`, the
reviewer pass to the assignment `invocation_id`, and subject/shown digests to
the exact delivered subject. Required reviewers see the identical sealed
subject without the other reviewer's result or rationale. Duplicate producer,
successor producer, L3, and L2S role/pass boundaries remain as adopted.

The section 13 one-review/conditional-second-review quorum and aggregation
remain unchanged. Round-2 `upheld` after round-1 `cannot-determine` leaves
indeterminacy blocking absorption. No extra review, third round, or majority
vote can erase an earlier failure or unknown.

## Preserved Findings and Status Boundaries

All findings in proposal section 2 and the separate adoption record remain at
their recorded strength: F-03/F-04/F-05 remain OPEN / MUST PRESERVE;
S5A4-02, S5A4-03, and S5A2-03 / S5-A-03 remain deferred; Slice 6
A-01/A-02/A-04/A-05 remain retained, A-03 remains a closed observation, and
A-06 remains an accepted observation. A7-04/A7-05/A7-08 remain MUST PRESERVE;
A7-01/A7-02/A7-03/A7-06/A7-07/A7-09/A7-10/A7-11/A7-12 remain closed
observations only. A4-07 and all other applicable adopted MUST PRESERVE/LATER
items retain their prior strength. No finding is repaired, closed,
reinterpreted, or removed through this clarification.

K2.20 remains a structural-only design. Lineage, relation, ambiguity/referent,
material/L2F, Slice 7/L2S, OQ-01 procedural authority, frozen evidence, and
orchestrator-only canonical writes remain governing. Manual mode remains the
only sanctioned execution mode. SRC-001 remains `CLOSED_FOR_CALIBRATION`;
SRC-002 remains `NOT_AUTHORIZED`.

This action adds only this clarification record and its single
`files.repository_administration` entry in `core.manifest.json`, in a separate
commit after adoption. Proposal/adoption history, earlier Slice records,
historical calibration, fixtures, executable Core/checker/prompts/adapter/
runtime/tests, and current `1.7.0-provisional` metadata and behavior remain
unchanged. The preserved adapter workstream/stash and `main` remain untouched.

No Slice 8 implementation occurs. Run format 1.8, K2.20, fixtures, and
mutations are not added. Slice 9 and replay are not begun. No prior commit is
amended and no merge occurs.

Q8-MANUAL is clarified; separate implementation authorization remains
`PENDING`. This record grants no implementation authority and establishes no
independent audit, replay or semantic validation, agent sanction, acceptance,
production readiness, golden status, or Aleph v1. Administrative verification
and producer reconciliation do not satisfy independent audit requirements.

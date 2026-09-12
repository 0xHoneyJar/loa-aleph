# Slice 7 Manual Reviewer Profile Clarification

Date: 2026-09-12

Status: ADOPTED CLARIFICATION — HUMAN AUTHORITY

## Exact Authority Subject

- Repository: `0xHoneyJar/loa-aleph`
- Implementation branch: `agent/slice-07-semantic-review-implementation-20260912`
- Proposal path:
  `calibration/src-001/core-design-basis/PROPOSED-slice-7-semantic-atomicity-context-qualifier-evidence-role-review-design-20260912.md`
- Proposal commit: `d5cd2baf95dcfc1fb5e10ebf8af9f5ed819bbda0`
- Proposal tree: `ed9ecd80f9cfabe48e964c13cac5b0dfa871974e`
- Proposal Git blob: `f3307ac00fe98d5ec8b0cca56168e0bff2f269b9`
- Adoption record:
  `calibration/src-001/core-design-basis/ADOPTED-slice-7-semantic-atomicity-context-qualifier-evidence-role-review-design-20260912.md`
- Adoption commit: `094a7ce3220631c8d4ee4c179e79b9b4529b6681`
- Adoption tree: `4443fa12f0633fa388d2f4ec6e677691bd4210ab`
- Implementation authorization record:
  `calibration/src-001/core-design-basis/AUTHORIZED-slice-7-implementation-20260912.md`
- Implementation authorization commit:
  `61bed05bcd19a2c03e8a45f181b0d34c16eb78bb`
- Implementation authorization tree:
  `5a73e0b0050ef6d8636e9d8a1379d7991c945124`

The implementation authorization declaration remains exactly:

```text
I authorize Slice 7 implementation based on the adopted Slice 7 design.
```

## Human Clarification — Verbatim

```text
I clarify the adopted Slice 7 design: for manual runs only, reviewer_profile is exactly {profile_id:"n/a (core-manual)", profile_digest:null, role:"verifier-l2s", model_identity:"human"}. No model/profile/effort mapping is invented for manual execution; existing manual run identity rules remain controlling, and reviewer independence remains established by the distinct actor/pass evidence required by Slice 7 section 15.3. Agent and hybrid reviewer_profile requirements remain unchanged.
```

The declaration above is preserved verbatim. The remainder of this record
records its scope and consequences; it is not additional declaration text.

## Sole Conflict Resolved

The adopted proposal's generic requirement for an exact pinned reviewer model
identity object conflicts with the existing manual-run identity doctrine.
This clarification resolves only that manual-mode `reviewer_profile`
representation conflict. It is controlling wherever that generic wording
conflicts with existing manual-run identity doctrine. It does not rewrite
historical proposal or adoption bytes, and the proposal remains historically
PROPOSED with authority established by its adoption record.

For Slice 7 manual runs only, the exact closed four-key object, in this order,
is:

```json
{
  "profile_id": "n/a (core-manual)",
  "profile_digest": null,
  "role": "verifier-l2s",
  "model_identity": "human"
}
```

There are no additional or omitted keys, replacement strings, synthetic
digests or model objects. No fake model, profile digest, context or effort
mapping may be invented for manual execution. Existing manual identity remains
`adapter_id=core-manual`, `host_identity=human-operator`, `model_ids=human`,
adapter profile `n/a (core-manual)` and model execution mapping `n/a (manual)`.

Agent and hybrid requirements remain unchanged: exact pinned profile ID and
digest, role `verifier-l2s`, and the exact pinned model-identity object agreeing
with the retained role mapping, including context and effort. No fallback
identity inherits a verdict. The exception does not extend to other roles,
profiles, modes or slices.

The retained run identity determines the permitted variant. Profile values do
not determine execution mode. A manual variant in an agent/hybrid run fails;
an agent/hybrid model object in a manual run fails. The SemanticSubject key
structure remains unchanged; the four reviewer-profile keys retain the same
order. Changing variants changes subject bytes and digest and requires a fresh
subject and review.

## Manual Independence and Execution Evidence

The adopted §15.3 manual-evidence record remains exactly:

```text
{producer_actor,reviewer_actor,producer_pass_id,reviewer_pass_id,subject_digest,shown_digest,withheld_declaration}
```

Manual reviewer independence continues to be established mechanically by the
distinct actor/pass evidence required by adopted Slice 7 §15.3. The generic
reviewer profile identifies execution class and role; it does not replace the
individual `reviewer_actor` or `reviewer_pass_id`, and is not evidence of
distinct people. Same-person separate-sitting evidence may be retained as
temporal-review evidence but does not satisfy the independent
producer/reviewer requirement.

K2.19 may verify declared actor/pass distinctions and references mechanically.
It cannot prove cognitive independence or semantic correctness. Manual
evidence remains `manual-separate-pass`, does not count as native fresh
dispatch, and does not prove native dispatch/freshness. Static and fixture
evidence retain their actual classifications.

## Preserved Findings and Status Boundaries

| Finding | Carried state |
|---|---|
| F-03 | OPEN: accepted-worker-return → canonical LedgerWriter/orchestrator production reachability remains unproven. |
| F-04 | OPEN: path/case/platform portability remains unresolved. |
| F-05 | OPEN and bounded by F-03. |
| S5A4-02 | DEFERRED. |
| S5A4-03 | DEFERRED. |
| S5A2-03 / S5-A-03 | DEFERRED. |
| Slice 6 A-01 | Retained. |
| Slice 6 A-02 | Retained. |
| Slice 6 A-04 | Retained. |
| Slice 6 A-05 | Retained; portable L2S validation does not repair it. |
| Slice 6 A-03 | Remains a closed observation. |
| Slice 6 A-06 | Remains an accepted observation. |

All other carried findings and status boundaries remain at their prior
strength. Exact evidence, source walk, lineage, typed relations, ambiguity and
bounded referent procedure, OQ-01 procedural-only human authority, Slice 6
material-use/L2F, fresh producer/refuter separation and orchestrator
single-writer authority remain governing. Semantic judgment does not move
into deterministic checking. No new human semantic-authority gate is created.

Manual mode remains the only currently sanctioned execution mode. This
clarification does not authorize Slice 8, SRC-001 replay, semantic validation,
acceptance, agent sanction, production readiness, golden status or Aleph v1.
SRC-001 remains CLOSED_FOR_CALIBRATION; SRC-002 remains NOT_AUTHORIZED.
Unrelated deferred repairs, provider/launcher refactoring and broad autonomous
orchestrator redesign remain excluded.

The existing uncommitted Slice 7 implementation work is preserved. The
separate adapter workstream and stash remain untouched. This clarification
and its single repository-administration manifest entry are committed
separately before implementation resumes under the existing authorization.
No authorization/adoption/proposal history is amended.

Producer verification and reconciliation are not independent audit. The
implementation branch may be pushed when complete; it must not be merged.
Fresh independent Claude Opus/xhigh audit remains required before merge.

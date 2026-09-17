# F-03 source-walk completion current-state clarification

Date: 2026-09-17

Status: **ADOPTED — HUMAN CORE CONTRACT CLARIFICATION / IMPLEMENTATION CONTINUATION AUTHORITY**

This record retains the HUMAN declaration supplied for the exact C-02 stopped
checkpoint. It is repository-administration evidence, not a Core payload,
implementation-completion record, independent audit, release or finding closure.

## Exact subject and chronology

| Subject | Identity |
| --- | --- |
| Repository | `0xHoneyJar/loa-aleph` |
| Continuation branch | `agent/f03-production-reachability-implementation-20260917` |
| Adopted F-03 design commit / tree | `484fa227e1ed23c81dc4cf37987aa0be16eded8f` / `13ad9e53a77949718afa9dc59c25c2e9d52beacb` |
| Original implementation-authority commit / tree | `4a999689a21b08f4d7c333e3b28362d47476d02f` / `755ab653bf7ef8e2d4186f937f52a098722cc6a8` |
| C-01 HUMAN clarification commit / tree | `2cf9d884232107ff98268844ec3e8146f95a9a93` / `ac94509d9b6cc25536e1116291804ee55bd2016c` |
| C-01 reconciliation commit / tree | `e2cbc0b06f38a36ddd4cad30e069d857e63aac5e` / `d3ea8c065a14b1e311dd6ecd16768dd20bad9879` |
| C-02 stopped checkpoint commit / tree | `ad8be4e9a88339530317e12e573b0299b15bef3a` / `d0972ca50451f2542686d5b51e5f40e1436fe62c` |
| C-02 stop record | `calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-source-walk-transition-conflict-20260917.md` |
| C-02 stop record blob | `1bf02d7de3cf458358e7fdefead8267f33580ee9` |
| C-02 stop record SHA-256 / bytes | `b3aef9f0f7c8a514095fb191e041ec07a6bd15d894d0cd7ee6ac34859edb5c84` / `24015` |
| Canonical GitHub main commit / tree | `8236b9f35c38cdd604b2389b42589f27755cdade` / `72075f93bc9fcb3c76f4480bc612693211efd240` |

The chronology remains: adopted design → implementation authority → partial
implementation → C-01 stop → HUMAN C-01 clarification → C-01 reconciliation →
partial S2 drafting → C-02 stop → this HUMAN clarification → authorized
continuation. Both historical stop records remain unchanged. This record does
not imply the C-02 rule was known or adopted before this declaration.

F-03: **OPEN / MUST PRESERVE**.
F-04: **OPEN / MUST PRESERVE**.
F-05: **OPEN / MUST PRESERVE**, bounded by F-03.

## Verbatim HUMAN declaration

I clarify the adopted F-03 accepted-worker-return production-reachability design for cumulative run format 1.9.0-provisional and capability orchestrator-work-transitions as follows.

The `Per-source completion` table in `ledgers/source-walk.md` is a canonical current-state projection with exactly one current row per source. It is not an append-only history table.

For cumulative 1.9.0-provisional runs using orchestrator-work-transitions, an authenticated Core-authorized source-walk transition MAY replace the existing `Per-source completion` row for the same `source_id` when the source's current procedural frontier or closure state advances. It MUST NOT append a second completion row for that source.

This replacement is a narrowly scoped current-projection operation. It does not authorize rewriting or deleting historical primary walk intervals, extraction events, resume cursors, or fresh gap-review rows. Those retained records remain the durable source-walk history.

The exact prior completion row MUST remain inspectable through the authenticated orchestration/writer transaction before-image and its retained commit/recovery evidence. Replacing the canonical current projection therefore does not permit silent loss of prior state or provenance.

For the replacement row:

- `source_id`, `source_hash`, and `source_length_bytes` remain bound to the same frozen source and MUST NOT change;
- `final_cursor_id` MUST name the current legal frontier for a blocked source or the legal terminal source-end cursor for a complete source;
- cursor progression MUST be monotonic and MUST NOT regress relative to the prior completion row;
- `gap_review_ids` is cumulative: every previously retained gap-review ID remains present in the same relative order, and newly applicable retained gap-review IDs may be appended according to the existing Core ordering rule;
- no historical walk, event, cursor, or gap-review record may be fabricated, removed, rewritten, or rebound merely to make the replacement row pass;
- `declared_by` and `note` must be produced only by the registered Core transition using the existing field semantics and may not be arbitrary parent- or worker-authored after-images.

Legal current-projection progression is:

1. no completion row → blocked;
2. blocked → blocked when the mechanically valid current frontier advances or newly retained gap-review state changes while completion remains unmet;
3. blocked → complete only when all existing K2.14 completion predicates are satisfied;
4. complete → complete only as an exact idempotent no-op.

A completed source is terminal for this source-walk completion projection. `complete → blocked`, `complete → a materially different complete row`, frontier regression, removal or reordering of prior gap-review IDs, or creation of multiple current completion rows for one source MUST fail closed.

This clarification narrows the existing "preserve retained lines" rule only for the single current row in the `Per-source completion` table. For this table, preservation means retaining the exact prior row as authenticated transaction history while replacing the canonical current projection. It does not relax preservation for the other source-walk tables or authorize a general row-replacement facility.

Core work-transition derivation and the Loa writer MUST derive both the expected before-row and after-row mechanically from the exact retained source-walk evidence. The caller, parent model, or worker may not supply arbitrary replacement bytes. Recovery MUST prove that the observed canonical row is exactly either the authenticated before-image or after-image and then recover deterministically without duplicating effects.

K2.14 and the source-walk template/checks shall continue to require exactly one current completion row per applicable source and shall validate that row against the complete retained walk/event/cursor/gap-review history. No checker weakening or duplicate-row exception is authorized.

This clarification is additive only for new cumulative 1.9.0-provisional runs using orchestrator-work-transitions. It does not migrate, reinterpret, or change retained 1.2–1.8 runs or their pinned Core, checker, adapter, runtime, or bundle bytes.

I authorize the existing F-03 implementation branch at stopped checkpoint ad8be4e9a88339530317e12e573b0299b15bef3a to persist this clarification and resume the previously authorized implementation solely under the adopted F-03 design as clarified here.

Implementation must add focused positive and negative tests covering at minimum: blocked-to-blocked frontier advancement; blocked-to-complete closure; exact prior-row retention in transaction evidence; cumulative gap-review IDs; frontier regression refusal; dropped/reordered prior gap-review refusal; duplicate completion-row refusal; complete-to-blocked refusal; materially changed complete-row refusal; crash/recovery before and after projection replacement; repeated-resume idempotency; and unchanged predecessor-format behavior.

This clarification does not authorize provider or model calls, genuine native worker execution, live-corpus `/loa-aleph` execution, SRC-001 preparation or replay, release preparation, Loa ingestion, PR creation, merge, agent-mode sanction, or F-03/F-04/F-05 closure. F-03 remains OPEN / MUST PRESERVE. F-04 remains OPEN / MUST PRESERVE. F-05 remains OPEN / MUST PRESERVE and bounded by F-03.

If another unadopted semantic or Core policy conflict is encountered, implementation must stop again rather than infer a rule.

## Custody and bounded continuation

The continuation gate verified the exact local and remote branch, starting
HEAD/tree, clean worktree, canonical main, prior authority and C-01 identities,
both historical stop-record bytes, preserved SRC-001 and adapter branches,
stash and worktree registrations before this record was created.

This administration-only commit contains this record and its required
repository-administration inventory entry. No implementation changes are
included. Subsequent implementation remains bounded to Architecture B and
S0–S4, with repository/default format 1.8, gated implementation-only 1.9,
and protocol 1.0.0-provisional. Fixture evidence remains explicitly simulated.

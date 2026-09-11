# Slice 6 Formal / Table / Layout Bindings and Degraded Formats Design Adoption Record

Date: 2026-09-11

Status: ADOPTED — HUMAN AUTHORITY

## Adopted Proposal Identity

- Repository: `0xHoneyJar/loa-aleph`
- Branch: `agent/slice-06-formal-layout-design-20260911`
- Exact proposal path:
  `calibration/src-001/core-design-basis/PROPOSED-slice-6-formal-table-layout-bindings-and-degraded-formats-design-20260911.md`
- Exact proposal commit:
  `330cab029687979937177220406868da901189c9`
- Exact proposal tree:
  `0ca565b120a5569f029fbcccd7ecb310f497ab79`
- Exact proposal Git blob:
  `9a09d9224840882cfc5752e68d24fe40464e6a98`

The proposal bytes remain unchanged. The proposal file itself remains
historically labeled `PROPOSED`, including its
`PROPOSED — HUMAN AUTHORITY ADOPTION REQUIRED` status line. That label records
the state of the exact proposal snapshot; this separate record establishes
human-authority adoption of those exact proposal bytes.

## Human authority declaration — verbatim

```text
I adopt the Slice 6 design at commit 330cab029687979937177220406868da901189c9.
```

The declaration is preserved exactly as supplied. The identity, scope,
consequences, findings, and status boundaries elsewhere in this record are
contextual metadata, not additional words attributed to the human declaration.

## Adoption Effect

This adoption establishes the exact identified proposal as the bounded Slice 6
design basis only.

`ADOPTED DESIGN` is distinct from `IMPLEMENTATION AUTHORITY`. This adoption does
NOT itself authorize implementation. Separate explicit human implementation
authority remains `PENDING` and is required before any Slice 6 implementation
begins. This record creates no implementation authorization.

The adopted design covers the proposal's bounded source representation
inventory, declared material uses, exact byte bindings, supplied formal/table/
layout coordinates and associations, and visible degraded, unsupported, or
indeterminate states. Its proposed `1.6.0-provisional` run format,
`formal-layout-bindings` capability, `K2.18` surface, and associated artifact,
prompt, checker, and host requirements remain design only.

The exact proposal governs if this summary is incomplete. This record does
not replace, revise, or expand the proposal or its Definition of Done.

## Preserved Findings and Boundaries

The proposal's section 3 findings remain carried at their existing strength:

| ID or boundary | Carried state |
|---|---|
| F-03 | OPEN / MUST PRESERVE: canonical accepted-worker-return → LedgerWriter / orchestrator production reachability remains unproven. New helper or fixture process tests do not close it. |
| F-04 | OPEN / MUST PRESERVE: path/case/platform portability remains unresolved. Narrow path validation is not a portability proof. |
| F-05 | OPEN / MUST PRESERVE: late-correction / lineage production enforcement remains bounded by F-03. |
| S5A4-02 | DEFERRED: K2.6/K2.7 activation through any recognized structured S5 event is not repaired. |
| S5A4-03 | DEFERRED: the existing ad-hoc S3 exit recognizer is not repaired. |
| S5A2-03 / S5-A-03 | DEFERRED: no generic resume-time full validation or broader review-subject invariant closure is claimed. The adopted Slice 6 design bounds future validation to its new material closure. |
| Other adopted MUST PRESERVE / LATER findings | Retained unless separately disposed by authority; proximity to a changed file is not disposition. |
| Manual mode | Remains the only sanctioned execution path under current repository authority. |
| Deterministic checks | Remain structural rather than semantic; declared coordinates, associations, and exact bytes do not establish source meaning. |
| Core and adapters | Core owns the contracts; adapters provide host mechanics without overriding, duplicating, or weakening Core. Loa remains structurally implemented, unvalidated, and unsanctioned; Hermes remains planned. |
| Role separation | Producer, fresh reviewer, orchestrator single writer, and human authority remain separate roles. |

All still-applicable adopted findings and the proposal's compatibility,
frozen-corpus, source-provenance, relation, ambiguity, and OQ-01 boundaries
remain in force. This adoption closes none of the carried findings.

## Explicit Non-Goals Preserved

This adoption does not authorize:

- a general PDF, OCR, vision, or document-rendering engine;
- deterministic table, header, cell-support, equation, or chart semantics;
- inferred chart values, axes, scales, series, or pixel-to-value conversion;
- equation reconstruction or invented reading order;
- SRC-001-specific table shapes, headers, values, or formal reconstruction;
- a new support relation family, relation retargeting, or graph walk;
- a worker, model/provider, or launcher abstraction/refactor;
- any Slice 7 or Slice 8 work;
- generic correction, revision, rollback, invalidation, cross-run reuse, or
  post-ACCEPTED reopening;
- a new human semantic decision gate or expansion of OQ-01;
- replay, replay validation, semantic validation, agent sanction, acceptance,
  production readiness, golden declaration, or Aleph v1.

## Audit and Authority Boundary

This record records only the human adoption authority supplied above. It does
not claim a fresh independent design audit or invent an audit verdict.
Administrative validation of this record is not an independent design audit.

The current development workflow intentionally defers the independent
completed-implementation audit until there is a completed implementation to
audit. No such audit is established here. Adoption does not satisfy or waive
the proposal's independent review or implementation-audit requirements.

## Status Boundary

No Slice 6 implementation has yet occurred. This action adds only this adoption
record and its single `files.repository_administration` classification in
`core.manifest.json`, following the prior adoption-record convention.

The proposal bytes, Core run-format metadata and behavior, checker/runtime/
adapter behavior, fixtures, and merged Slice 5 history remain unchanged. The
preserved adapter stash/workstream is untouched. No Slice 7 or Slice 8 work,
merge, or release occurs through this action.

This adoption establishes no replay validation, semantic validation, agent
sanction, acceptance, production readiness, golden status, or v1 status.
Manual mode remains the only sanctioned execution path unless separately
changed by authoritative repository evidence.

Slice 6 implementation authority remains pending and must be supplied
separately.

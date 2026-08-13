# Proposed SRC-001 Audited Core Design-Basis Decision

Date: 2026-08-13

Status: PROPOSED — AWAITING HUMAN AUTHORITY ADOPTION

Decision class: repository-administration architecture proposal

## Authority Boundary

The retained independent audit concluded `PASS_WITH_REVISIONS` and found the
analysis sufficiently grounded to inform Core change design. The retained
package contains no exact human-adopted architecture decision authorizing this
direction or its implementation.

This proposal therefore recommends a decision for human review. It does not
record adoption, authorize implementation, begin replay, or change any
capability or calibration status.

## Evidence Bases

### A. SRC-001 CALIBRATION-DERIVED

The audited SRC-001 evidence supports design work for:

- exact evidence and ordered or discontiguous fragments;
- source-walk, gap, exclusion, shared-position, and resume accounting;
- complete split, merge, replace, supersede, duplicate, and disappearance
  lineage;
- typed dependency and source-context relations;
- visible ambiguity and referent lifecycle;
- formal, table, layout, and degraded-format bindings;
- fresh S2/S3 review of atomicity, context, qualifiers, evidence roles, and
  relations;
- fresh S4 duplicate-versus-overlap review; and
- an independent gap-review path rather than reliance on a perfect first-pass
  extractor.

These requirements must preserve the audit's narrowed findings and do-not-
encode boundaries. Human wording choices, source-specific outcomes, graph
density, and every human edit must not be generalized into deterministic Core
truth.

### B. HUMAN PRODUCT REQUIREMENT — INTENT-FIDELITY INTAKE

Intent-fidelity intake is separately commissioned product design work. It is
not claimed to have been demonstrated by SRC-001.

The requirement is to preserve detailed research intent through a bounded
conversation, atomic intent records, fresh ambiguity and coverage review, a
human-confirmed research charter, and traceable S1 extraction criteria. This
proposal keeps that authority basis separate from the calibration-derived
requirements.

## Proposed Sequencing Decision

### Calibration-derived implementation track

1. Exact evidence and ordered fragments
2. Source-walk / gap / resume accounting
3. Unified lineage
4. Typed relations
5. Ambiguity lifecycle
6. Formal / layout bindings
7. S2 / S3 semantic review
8. S4 duplicate / overlap review
9. Blind SRC-001 replay

The replay is a calibration evaluation gate over authorized implementations of
slices 1-8. It uses frozen SRC-001 source and criteria, an immutable generic
Core release, and the retained allowlist/withhold boundary. It does not make
SRC-001 golden, validate or sanction agent mode, authorize SRC-002, or establish
production readiness or v1.

### Product-intake track after replay

10. Intent-fidelity intake
    - bounded conversational interview;
    - atomic `INT-*` records;
    - ambiguity / contradiction / coverage review;
    - human-confirmed research charter;
    - traceable S1 extraction criteria;
    - pre-freeze source acquisition when authorized;
    - successor-run behavior after freeze; and
    - synthetic/adversarial intake fixtures.

Blind SRC-001 replay should precede intent-fidelity implementation because:

- slices 1-8 are derived from SRC-001 calibration evidence;
- SRC-001 did not exercise the proposed interview architecture;
- replay should test the effects of calibration-derived changes without an
  unrelated intake redesign contaminating causal interpretation; and
- intent-fidelity is separately authorized product design work with its own
  fixtures and evaluation surface.

The retained audited design and slice-plan artifacts place intent-fidelity
before replay. This proposal intentionally recommends the narrower
replay-before-intake boundary above for human adoption. It does not rewrite or
silently reinterpret the retained evidence.

## `/loa-aleph` Boundary

The public command surface remains:

```text
/loa-aleph start <files-or-directories...>
/loa-aleph status [RUN-id]
/loa-aleph resume <RUN-id>
/loa-aleph validate <RUN-id>
```

No public command change is currently required by the calibration remediation.
This proposal does not add `/loa-aleph update`.

Core remains canonical in `loa-aleph`. The Loa adapter remains thin and
host-mechanical only. Intent-fidelity semantics, schemas, templates, prompts,
and deterministic contracts belong to Core.

If intent-fidelity implementation is later authorized, the Loa adapter may
require narrow mechanics for:

- interview persistence;
- human-gate presentation;
- transaction durability;
- pre-freeze source admission or acquisition mechanics; and
- deterministic resume behavior.

The adapter must not own an independent interpretation of research intent.

No ordinary `loa` source-repository commit is currently anticipated for these
Core improvements. A separate host-repository change would require an actual
change to the host integration or installation boundary.

Existing runs remain pinned to their original immutable bundle and runtime.
No mutable-`main` execution, in-place auto-upgrade, or implicit run migration is
introduced.

## Scope and Non-Claims

This proposal does not modify or authorize modification of S0-S13 contracts,
prompts, templates, schemas, checkers, fixtures, mutation tests, adapters,
runtime TypeScript, generated `runtime-js`, projection packages, bundle
mechanics, run format, or adapter protocol.

SRC-001 remains `CLOSED_FOR_CALIBRATION`. SRC-002 remains `NOT_AUTHORIZED`.
Core and adapter capability status remain unchanged.

Human authority must explicitly adopt, amend, or reject this proposal before
it can be cited as an architecture decision. Implementation authorization must
also be explicit.

# Slice 3 Unified Lineage Design

Date: 2026-08-22

Status: PROPOSED — HUMAN AUTHORITY ADOPTION REQUIRED

Decision class: bounded Core design decision for Slice 3 implementation

## 1. Authority boundary

This document records the bounded Slice 3 design reviewed in chat and approved there as the proposal to persist for exact human-authority adoption. It does not itself record adoption and does not authorize Slice 3 implementation.

It is subordinate to the already adopted architecture decisions and repository contracts, including the adopted correction/effective-state architecture decision. If this proposal conflicts with a higher-authority adopted decision, the higher-authority decision governs and implementation must stop for reconciliation.

The human authority approved the following design-review questions before this proposal was persisted:

- Q1: use one append-only Core lineage artifact with a typed event model rather than separate per-type tables — YES;
- Q2: derive a mechanical `lineage-current` concept distinct from legacy `status = active`, while preserving historical run-format behavior — YES;
- Q3: for new 1.3 runs, merge/duplicate canonicalization creates a new successor claim ID rather than mutating one predecessor in place — YES;
- Q4: current S5 accounting and current Précis compilation operate over lineage-current claims only; historical predecessors remain inspectable without fabricated new dispositions — YES;
- Q5: keep generic stale/invalidation propagation, checkpoint revision, rollback/rewind, cross-run reuse, successor-run correction mechanics, and post-ACCEPTED correction out of Slice 3; target `1.3.0-provisional`; persist this bounded design for exact human adoption — YES / YES.

This proposal does not authorize implementation until the human authority adopts an exact proposal identity.

## 2. Purpose and bounded ownership

Slice 3 answers one structural question:

> What happened to the identity of this canonical packet or claim?

Slice 3 owns reconstructable packet/claim lineage sufficient to prevent silent disappearance and to establish structural currentness. It does not own general semantic/context dependency, research disposition, downstream invalidation, checkpoint/artifact revision, arbitrary rewind, cross-run reuse, successor-run correction execution, or post-ACCEPTED correction.

Lineage, S5 disposition, and Slice 4 typed semantic/context relations remain distinct axes.

A legitimate future correction implication must be preserved without automatically becoming present implementation scope.

## 3. One typed lineage-event model

Slice 3 introduces one Core artifact:

`ledgers/lineage.md`

with format marker:

`lineage_format: aleph-lineage/v1`

The provisional lineage table is:

```text
| lineage_id | owner_stage | type | predecessors | successors | basis | established_by |
|------------|-------------|------|--------------|------------|-------|----------------|
```

The artifact is append-only on the canonical single-writer surface.

`lineage_id` uses a new `LIN-NNNN` identifier family.

For this bounded format, `owner_stage` is restricted to the applicable S2-S4 structural decision surface. `basis` records an inspectable reason. `established_by` records the responsible actor/invocation or authority reference permitted by the applicable stage contract. The deterministic checker validates structure, not the semantic adequacy of `basis` or correctness of the judgment.

A transformation is represented as one event rather than decomposed into unrelated pairwise edges. For example, a 1-to-3 split is one `split` event with one predecessor and three successors.

## 4. Closed Slice 3 lineage vocabulary

The Slice 3 event vocabulary is exactly:

- `split`
- `merge`
- `replace`
- `supersede`
- `duplicate`
- `reject`
- `exclude`
- `no-claim`

Their bounded structural meanings and cardinalities are:

| Type | Cardinality | Allowed unit family | Structural meaning |
|---|---:|---|---|
| `split` | 1 -> 2+ | PKT or CC | one predecessor identity is replaced by several successor identities |
| `merge` | 2+ -> 1 | CC | several distinct claim identities intentionally form one new successor identity |
| `replace` | 1 -> 1 | PKT or CC | a corrected identity replaces its predecessor |
| `supersede` | 1 -> 1 | PKT or CC | a later identity overtakes a predecessor without mechanically asserting that the predecessor was semantically false |
| `duplicate` | 2+ -> 1 | CC | same-claim identities are canonicalized into one new successor while retaining provenance and non-independent-evidence semantics |
| `reject` | 1 -> 0 | PKT or CC | the unit terminates under an applicable structural judgment with reason |
| `exclude` | 1 -> 0 | PKT or CC | the unit terminates under the applicable structural boundary with reason |
| `no-claim` | 1 -> 0 | PKT only | a valid packet produces no claim |

There is no generic N-to-M lineage event type in `aleph-lineage/v1`.

Complex structure composes ordinary typed events. A successor may receive multiple incoming lineage events when those events truthfully describe distinct predecessor histories. A predecessor may be terminalized only once.

The SRC-001 `S-190b` pattern is the calibration example: one predecessor may split to several successors while a different predecessor is separately superseded by one of those same successors. This is represented compositionally rather than by inventing a generic compound transform.

## 5. Packet-to-claim ancestry is not replacement lineage

Ordinary packet-to-claim derivation remains claim provenance.

A packet may yield zero, one, or several claims, and several packets may support one claim. That relationship is not an identity replacement and must not be encoded as `replace` merely to force it into lineage.

Therefore:

- claim rows continue to name their packet provenance;
- multiple claims may name the same packet where allowed by S3;
- a packet yielding zero claims receives one valid `no-claim` terminal lineage event;
- Slice 3 does not create a general semantic dependency graph.

Slice 4 remains responsible for typed semantic/context relations.

## 6. Canonical successors are new durable identities

For new `1.3.0-provisional` runs, a merge or duplicate canonicalization must create a new successor claim ID rather than mutate one predecessor claim in place.

Example:

```text
CC-10 provenance: PKT-1
CC-11 provenance: PKT-2

duplicate:
  CC-10, CC-11 -> CC-12

CC-12 provenance: PKT-1, PKT-2
```

CC-10 and CC-11 remain durable historical definitions. CC-12 is the new lineage-current identity.

This rule applies to new 1.3 behavior only. Historical fixtures and runs retain their pinned predecessor-format interpretation and are not silently migrated.

For `merge` and `duplicate`, the successor packet-provenance set must be a superset of the union of predecessor packet provenance. This conserves source provenance without mechanically claiming that repeated sources are independent corroboration.

For `split`, every successor must independently have valid nonempty provenance and the aggregate successor provenance must conserve the predecessor's packet provenance. The checker must not require every predecessor packet to be copied onto every child.

For `replace` and `supersede`, the successor must have valid provenance under the ordinary claim/packet contract, but no automatic provenance-union rule is imposed because a correction may legitimately change the evidence boundary.

## 7. Mechanical `lineage-current` state

Slice 3 introduces a derived mechanical concept named `lineage-current`.

This is intentionally not named `EFFECTIVE` in the bounded Core design. The adopted correction architecture uses EFFECTIVE as a broader conceptual state that may depend on later semantic, authority, disposition, relation, and stage prerequisites. Slice 3 proves only structural identity currentness.

For a 1.3 run:

```text
lineage-current unit
=
valid durable PKT/CC definition
that has never appeared as a predecessor
in a valid lineage event
```

All eight event types terminalize their predecessors for lineage-current derivation.

A successor may later itself become a predecessor and cease to be lineage-current.

A terminalized identifier is not resurrected in Slice 3. Re-establishment uses a new successor identifier. This keeps the event history monotonic and avoids implementing rollback semantics.

## 8. Legacy `status = active` remains distinct

Slice 3 must not redefine legacy `status = active` into the new current/effective concept.

For new 1.3 packet and claim rows:

- the existing `status` column remains for compatibility with the current artifact shapes;
- admitted durable rows use `status = active`;
- `active` means the durable row is admitted/readable under the row contract, not that its identity is lineage-current;
- identity currentness is derived only through the lineage ledger;
- new 1.3 identity changes must not use legacy `superseded-by:*` or `retracted:*` status strings as the authoritative lineage mechanism.

Historical 1.0, 1.1, and 1.2 runs and fixtures preserve their original status semantics and are not reinterpreted.

Current-view Core consumers for 1.3 must use lineage-current derivation rather than `status = active` alone.

## 9. Direct prerequisite closure

A lineage-current claim may cite only lineage-current packets as its current packet provenance.

If a packet has been terminalized through lineage but a lineage-current claim still depends on that predecessor packet, current structural closure fails.

Slice 3 may deterministically detect this direct declared-prerequisite break. It must not automatically create or persist a generic `STALE` or `INVALIDATED` descendant state.

Generic cross-stage invalidation requires later relation/correction machinery and remains outside this slice.

## 10. S5 disposition accounting

For new 1.3 runs, the current S5 research population is the set of lineage-current claims.

At S5 closure:

- every lineage-current claim requires exactly one allowed S5 disposition;
- a non-lineage-current historical predecessor does not require a newly fabricated S5 disposition merely to satisfy current accounting;
- if a predecessor already has a valid historical disposition from an earlier durable state, that disposition remains immutable history;
- structural `reject`, `exclude`, `no-claim`, duplicate absorption, replacement, merge, or supersession do not automatically become or imply S5 dispositions;
- lineage and disposition remain separate concepts.

The existing seven-disposition vocabulary is not removed by Slice 3.

For 1.3, the `merged` S5 value must not be used as a proxy for "this ID was absorbed and is no longer current." Lineage owns identity currentness. A lineage-current claim may receive `merged` only when the S5 contract independently assigns that research-result role.

The current Disposition Judge wording that treats `merged` as merely "already absorbed per the merge map" therefore requires a narrow 1.3 correction so the two axes do not remain conflated.

## 11. Current Précis view

For new 1.3 runs, the current claim inventory rendered into the Précis and the current disposition summary derive from lineage-current claims only.

Historical predecessor claims remain inspectable in the full durable inventory and lineage history but must not silently participate in the current Précis merely because their legacy row status remains `active`.

This is a bounded structural contribution to the adopted full-history/effective-view architecture. It does not mean Slice 3 alone proves broad EFFECTIVE status.

## 12. Late correction boundary

`aleph-lineage/v1` is the bounded S2-S4 unit-lineage surface.

If downstream S5+ work already exists and a newly discovered unit correction would require new lineage that could invalidate downstream semantic work, the bounded Slice 3 implementation must BLOCK rather than silently append the transformation and leave later work falsely current.

The future correction architecture may later add descendant invalidation, artifact revisions, renewed gates, and earliest-unmet-Definition-of-Done resume. Slice 3 preserves compatibility with those goals but does not implement them.

This is an explicit YES / YES / NO boundary:

- the broader correction principle is accepted;
- Slice 3 must preserve compatibility with it;
- Slice 3 must not implement the complete mechanism now.

## 13. Deterministic checker contract

The bounded implementation should add a dedicated lineage check surface, provisionally `K2.15 — lineage and lineage-current closure`.

It may mechanically verify at least:

- required `aleph-lineage/v1` marker for the 1.3 capability;
- unique `LIN-*` definitions;
- closed event enum;
- valid predecessor/successor ID existence;
- allowed PKT/CC family combinations;
- event cardinalities;
- predecessor not equal to successor;
- no predecessor terminalized twice;
- legal multiple incoming events to one successor;
- no forbidden lineage cycle;
- terminal event types have zero successors;
- `no-claim` is packet-only;
- no `SRC-*`, checkpoint, artifact-version, cluster, or projection identity is smuggled into unit lineage;
- merge/duplicate successor provenance conserves predecessor union;
- aggregate split provenance conservation without requiring blind copy to each child;
- lineage-current claim provenance resolves only to lineage-current packets;
- every applicable S3 packet either contributes to at least one claim or has one valid `no-claim` closure;
- 1.3 current-view selection uses lineage-current rather than legacy row status alone;
- legacy formats retain their predecessor behavior.

The deterministic checker must not decide whether a semantic split, merge, duplicate, replacement, rejection, or exclusion was the correct judgment.

Fresh semantic review remains responsible for transformation quality under the applicable stage contract. Human authority remains human.

## 14. Run format and cumulative capability activation

Slice 3 targets:

`1.3.0-provisional`

Capabilities are cumulative:

```text
1.0  legacy
1.1  + exact evidence
1.2  + source walk
1.3  + lineage
```

Implementation must not rely on a single `CURRENT_RUN_FORMAT_VERSION` comparison in a way that disables prior capabilities when 1.3 becomes current.

The Core model/checker should use explicit cumulative capability predicates such as:

- `usesForwardExecutionIdentity()`
- `usesExactEvidence()`
- `usesSourceWalk()`
- `usesLineage()`

or an equivalently clear implementation.

Historical fixtures remain pinned to their recorded run formats and are not migrated.

## 15. Bounded fixture and mutation scope

Add one focused 1.3 lineage fixture. Preserve the existing 1.0-1.2 fixture bytes and semantics.

The positive 1.3 fixture should demonstrate at least:

- 1-to-many split;
- many-to-one merge with a new canonical successor;
- 1-to-1 replacement;
- 1-to-1 supersession;
- duplicate canonicalization with a new successor and conserved provenance;
- reject terminal closure;
- exclude terminal closure;
- packet `no-claim` closure;
- one successor receiving truthful incoming lineage from more than one event;
- correction of a bad normalization through a new successor while the predecessor remains historical;
- correction of a bad merge through later unit lineage without erasing the old merge event;
- an unrelated sibling remaining lineage-current.

Negative mutations should include at least:

- orphan successor;
- missing predecessor;
- malformed or duplicate `LIN-*` identity;
- invalid event type;
- illegal cardinality;
- self-edge;
- forbidden cycle;
- one predecessor terminalized twice;
- silent disappearance;
- merge/duplicate provenance loss;
- aggregate split provenance loss;
- fabricated successor;
- terminal event with successor;
- `no-claim` applied to a claim;
- packet-to-claim ancestry incorrectly encoded as `replace`;
- same-run source replacement attempted through unit lineage;
- lineage-current claim citing a non-current packet;
- 1.3 fixture missing lineage marker/artifact;
- 1.2 fixture accidentally reinterpreted as 1.3.

Do not add fixtures that imply generic checkpoint versioning, automatic cross-stage STALE/INVALIDATED propagation, arbitrary rollback/rewind, cross-run reuse, or full successor-run correction execution.

## 16. Core and adapter boundary

Core owns the lineage format, semantics, currentness derivation, checker rules, prompt contracts, fixture behavior, and run-format capability.

The Loa adapter may only perform the host mechanics necessary to carry the Core-defined return and persist the Core-defined ledger through its existing validated single-writer mechanisms. It must not invent adapter-local lineage enums, mappings, effective-state semantics, or correction behavior.

No new public `/loa-aleph` command surface is introduced by Slice 3 itself.

Adapter changes are limited to the narrow pass-through, structured-return, or orchestration support actually required by the adopted Core contract.

## 17. Expected implementation surface after adoption

If this exact proposal is later adopted and implementation is explicitly authorized, the expected bounded Core implementation surface includes the relevant portions of:

- `docs/architecture/03-artifact-contracts.md`
- `docs/architecture/04-pipeline-stages-and-dod.md`
- `docs/architecture/templates/03-extraction-claims.md`
- `docs/architecture/prompts/workers-intake-extraction.md`
- `docs/architecture/prompts/workers-judgment.md`
- `docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md`
- `scripts/lib/run-model.ts`
- `scripts/lib/check-helpers.ts`
- `scripts/lib/checks-k2.ts`
- `scripts/test-conformance-mutations.ts`
- `core.manifest.json`
- the generated `runtime-js` projections corresponding to changed TypeScript Core files
- one new 1.3 lineage fixture and its focused mutations.

The exact implementation diff must remain bounded by the adopted design and repository rules. Generated JavaScript is never the canonical source fix.

## 18. Explicit non-goals

This proposal does not authorize Slice 3 to implement:

- Slice 4 typed semantic/context dependency relations;
- persisted generic `STALE` or `INVALIDATED` state;
- generic descendant invalidation across stages;
- checkpoint or artifact revision/versioning;
- arbitrary rewind or rollback;
- earliest-unmet-DoD correction resume machinery;
- cross-run reuse or caching;
- generic successor-run correction execution beyond existing doctrine;
- mutation of frozen corpus identity;
- post-ACCEPTED run correction;
- projection correction;
- intent-fidelity intake;
- blind SRC-001 replay;
- SRC-002;
- semantic validation;
- agent-mode validation or sanction;
- golden promotion;
- production readiness;
- Aleph v1.

## 19. Definition of Done for a future authorized implementation

A future Slice 3 implementation is structurally complete only when:

1. `1.3.0-provisional` and `aleph-lineage/v1` are represented consistently in Core contracts and checker/model code;
2. every lineage type and cardinality is mechanically enforced without semantic overreach;
3. lineage-current is mechanically derivable and demonstrably distinct from legacy `status = active`;
4. merge/duplicate canonicalization creates new durable successor claim IDs in the 1.3 fixture;
5. packet-to-claim ancestry remains provenance and `no-claim` closes only true zero-claim packet outcomes;
6. current S5 accounting and current Précis rendering use lineage-current claims without fabricating dispositions for historical predecessors;
7. direct lineage-current claim-to-packet provenance cannot target a non-current packet;
8. provenance conservation checks pass for valid merge/duplicate/split fixture cases;
9. focused lineage mutations fail at the intended structural check;
10. legacy 1.0-1.2 fixtures retain their original behavior and are not migrated;
11. capability activation remains cumulative so 1.3 cannot weaken 1.1 or 1.2 guarantees;
12. TypeScript source and generated runtime projection remain drift-clean;
13. immutable bundle verification retains byte-identical Core across host targets;
14. adapter changes, if any, remain host-mechanical only;
15. no deferred correction/invalidation feature is falsely implemented or claimed;
16. a fresh independent implementation audit reports no BLOCKING NOW violation against this adopted design.

A deterministic PASS proves only its checks. It does not confer semantic validation, sanction, acceptance, production readiness, or v1 status.

## 20. Human-adoption requirement

This file remains a proposal until the human authority adopts an exact repository identity of this proposal, including an exact commit/head and proposal SHA-256 or otherwise equally unambiguous immutable identity.

Until that adoption is persisted, Slice 3 implementation remains unauthorized.

SRC-001 remains `CLOSED_FOR_CALIBRATION`.

SRC-002 remains `NOT_AUTHORIZED`.

Manual mode remains the only sanctioned execution path unless separately changed by authoritative evidence.

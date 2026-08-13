# SRC-001 Audited Implementation-Slice Plan

Date: 2026-08-13

Status: design only; Core implementation is not authorized.

## 1. Design-input separation

Slices 1-8 are `SRC-001_CALIBRATION_DERIVED`. Their evidence basis is the
durable independent audit plus corrected analytical overlay.

Slice 9 is `HUMAN_AUTHORITY_PRODUCT_REQUIREMENT`. Intent-fidelity intake is not
claimed to be derived from SRC-001.

Slice 10 is a calibration-only blind replay harness. It evaluates slices 1-8
against frozen SRC-001 source and criteria. It does not evaluate slice 9.

## 2. Cross-slice rules

Every authorized implementation slice must:

- keep Core canonical in `loa-aleph`;
- update `core.manifest.json` when Core inventory changes;
- preserve accepted legacy fixtures and introduce a versioned new-format
  fixture rather than silently migrating historical bytes;
- add focused positive fixtures and failing mutations;
- update TypeScript checker/model code and locked `runtime-js` projections
  together;
- rebuild immutable bundles and require equal Core inventories/digests/bytes
  across host targets;
- leave existing runs pinned to their original bundle and runtime;
- avoid a `loa` source-repository change unless the host integration boundary
  itself changes;
- avoid validation, sanction, golden, production, or v1 claims.

## 3. Final order

1. Exact evidence and ordered fragments
2. Source walk, gap, shared-position, and resume accounting
3. Unified split/merge/replace/supersede lineage
4. Typed dependency and source-context relations
5. Internal ambiguity and referent lifecycle
6. Formal/table/layout bindings and degraded formats
7. S2/S3 semantic atomicity, context, qualifier, and evidence-role review
8. S4 duplicate-versus-overlap fresh refutation
9. Intent-fidelity intake
10. Blind SRC-001 replay harness

The first eight preserve the audited order. Intent fidelity is separate ninth
because its authority basis, artifacts, and evaluation surface differ from the
SRC-001 remediation. Replay remains last.

## Slice 1 - Exact evidence and ordered fragments

**Purpose**

Make exact evidence mechanically reopenable without silent joins,
normalization, quote substitution, or fragment reordering.

**Evidence basis**

SRC-001 exact-byte restorations for `C-120`, `C-125`, and `C-128`; authorization
byte mismatches; discontiguous `M-001b`; audited DC-01 and DC-07.

**Primary owner**

Core artifact/checker owner.

**Affected canonical source files**

- `docs/architecture/02-system-architecture.md`
- `docs/architecture/03-artifact-contracts.md`
- `docs/architecture/04-pipeline-stages-and-dod.md`
- `docs/architecture/templates/02-corpus-intake.md`
- `docs/architecture/templates/03-extraction-claims.md`
- `docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md`
- `scripts/lib/run-model.ts`
- `scripts/lib/checks-k2.ts`
- `scripts/test-conformance-mutations.ts`
- `core.manifest.json`

**Artifact/schema changes**

- Add explicit exact-versus-rendered field roles.
- Add ordered fragment records with source ID, locator, byte hash, order, and
  declared join policy.
- Preserve an immutable exact-evidence field separate from normalized text.
- Record normalization events with predecessor/effective hashes.

**Prompt changes**

Update Intake Clerk, Extractor, and Normalizer contracts to declare fragments
and never call reconstructed or normalized text exact.

**Checker changes**

Reopen declared source bytes, verify fragment hashes/order/join policy, and
verify that normalization never mutates exact evidence.

**Fixtures**

One minimal new-format run containing contiguous evidence, ordered
discontiguous fragments, Unicode punctuation, and an explicitly degraded
non-exact rendering.

**Mutation tests**

Curly-quote drift, ligature drift, newline change, fragment swap, undeclared
join, normalized-text substitution, and missing source bytes.

**Runtime-js regeneration**

Required for `run-model.ts`, `checks-k2.ts`, and any `validate-run.ts` import
changes. Run `npm run runtime:build` and `npm run test:runtime`.

**Adapter implications**

No new public command. The adapter must pass the new Core fields unchanged
through worker return validation and ledger serialization. Do not define
adapter-local evidence schemas.

**Definition of Done**

The valid fixture passes; every mutation fails at the intended K2 check; legacy
fixtures remain unchanged and clean; source and runtime checkers agree.

**Non-goals**

Semantic entailment, correct normalization wording, OCR, PDF reconstruction,
or table interpretation.

**Dependency**

Existing locator/hash contract only.

## Slice 2 - Source walk, gap, shared-position, and resume accounting

**Purpose**

Make exhaustive source traversal and resume position mechanically visible
while retaining an independent semantic gap-review pass.

**Evidence basis**

Twenty-three raw-extractor omitted final units; all substantive content
recovered by gap review; B08A/B08B shared-line resume corrections; audited
DC-05.

**Primary owner**

Core S2/checker owner.

**Affected canonical source files**

- `docs/architecture/04-pipeline-stages-and-dod.md`
- `docs/architecture/08-runbook-agent-mode.md`
- `docs/architecture/09-runbook-manual-mode.md`
- `docs/architecture/prompts/workers-intake-extraction.md`
- `docs/architecture/prompts/verifier-lenses.md`
- `docs/architecture/templates/03-extraction-claims.md`
- `docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md`
- `scripts/lib/run-model.ts`
- `scripts/lib/checks-k2.ts`
- `scripts/test-conformance-mutations.ts`
- `core.manifest.json`

**Artifact/schema changes**

Add per-source ordered walk intervals, explicit admitted/gap/excluded/deferred
outcomes, sub-line/shared-position coordinates, resume cursors, and gap-review
records.

**Prompt changes**

Require source-order extraction and a separate fresh gap reviewer using a
different lens. Do not ask the first extractor to certify its own completeness.

**Checker changes**

Check interval order, overlap policy, gaps, declared exclusions, shared-line
resume, and per-source completion. PASS proves accounting, not that every
qualifying assertion was found.

**Fixtures**

Source with two qualifying units on one line, a discontiguous sentence, an
excluded interval, and an intentionally deferred interval.

**Mutation tests**

Skipped interval, premature next-line resume, overlapping cursor, missing gap
disposition, undeclared exclusion, and completion with an unclosed interval.

**Runtime-js regeneration**

Required.

**Adapter implications**

Ledger writer and resume state may need to retain new Core cursor records, but
the adapter must not decide coverage.

**Definition of Done**

Every byte/locator interval has a declared traversal outcome; fresh gap review
is independently recorded; mutations fail; no claim of semantic recall is made
from checker PASS.

**Non-goals**

A perfect single-pass extractor or deterministic candidacy judgment.

**Dependency**

Slice 1 fragment and locator vocabulary.

## Slice 3 - Unified split/merge/replace/supersede lineage

**Purpose**

Prevent silent disappearance and make every legal multi-parent or
multi-successor transformation reconstructable.

**Evidence basis**

Twenty-seven split phenomena, 23 proposal-missed splits, replacements,
`S-190b` multi-parent merge/replacement, and audited DC-03/DC-04/DC-06.

**Primary owner**

Core claim-ledger/checker owner.

**Affected canonical source files**

- `docs/architecture/03-artifact-contracts.md`
- `docs/architecture/04-pipeline-stages-and-dod.md`
- `docs/architecture/templates/03-extraction-claims.md`
- `docs/architecture/prompts/workers-intake-extraction.md`
- `docs/architecture/prompts/workers-judgment.md`
- `docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md`
- `scripts/lib/run-model.ts`
- `scripts/lib/checks-k2.ts`
- `scripts/test-conformance-mutations.ts`
- `core.manifest.json`

**Artifact/schema changes**

Define typed lineage edges for split, merge, replace, supersede, duplicate,
reject, exclude, and no-claim. Permit legal multi-parent/multi-successor
relations while prohibiting orphan or double-active states.

**Prompt changes**

Require producers to propose lineage; require reviewers to challenge semantic
atomicity separately from the checker's structural validation.

**Checker changes**

Validate ID existence, edge enums, parent/successor closure, active-status
rules, supersession, and provenance union. Do not judge semantic equivalence.

**Fixtures**

One-to-many split, many-to-one merge, replacement, duplicate, rejection, and
multi-parent representative cases.

**Mutation tests**

Orphan successor, missing parent, silent disappearance, double-active
predecessor, invalid edge enum, cycle where forbidden, and provenance loss.

**Runtime-js regeneration**

Required.

**Adapter implications**

Structured return validation and ledger writer must accept only the Core
lineage schema. No host-local mapping rules.

**Definition of Done**

Every original packet/claim and admitted successor has a reconstructable
status path; all structural mutations fail; semantic split/merge quality
remains a reviewer responsibility.

**Non-goals**

Deterministic choice of the correct split, merge, duplicate, or replacement.

**Dependency**

Slice 1 stable evidence references and existing unique IDs.

## Slice 4 - Typed dependency and source-context relations

**Purpose**

Replace heterogeneous ID/prose dependency arrays with typed, referentially
valid relation records.

**Evidence basis**

The final graph has 250 heterogeneous dependency-array entries while the
proposal had no uniform structured dependency field. Link-by-link semantic
delta remains indeterminate. Audited DC-02 and SL-02 apply.

**Primary owner**

Core relation-schema/checker owner.

**Affected canonical source files**

- `docs/architecture/03-artifact-contracts.md`
- `docs/architecture/04-pipeline-stages-and-dod.md`
- `docs/architecture/templates/03-extraction-claims.md`
- `docs/architecture/templates/04-evidence-boundaries.md`
- `docs/architecture/prompts/workers-intake-extraction.md`
- `docs/architecture/prompts/workers-judgment.md`
- `docs/architecture/prompts/verifier-lenses.md`
- `docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md`
- `scripts/lib/run-model.ts`
- `scripts/lib/checks-k2.ts`
- `scripts/test-conformance-mutations.ts`
- `core.manifest.json`

**Artifact/schema changes**

Define relation ID, type, source unit, target kind, target ID or typed null,
provenance, status, and optional authority closure. Separate claim dependency,
source context, formal/header reference, and discourse relation.

**Prompt changes**

Producers choose semantic relations; fresh reviewers challenge missing,
over-broad, or wrong-target relations. Prompts must not treat final SRC-001
link density as a target.

**Checker changes**

Validate enums, target kind, target existence/status, typed nulls, duplicate
relation IDs, and relation-specific cycle policies.

**Fixtures**

Valid claim dependency, source-context edge, formal-header edge, unresolved
target, and explicitly absent relation.

**Mutation tests**

Missing target, stale target, wrong target kind, untyped prose target,
duplicate relation ID, and forbidden cycle.

**Runtime-js regeneration**

Required.

**Adapter implications**

Worker return and ledger serialization may need new fields; they remain
byte-for-byte Core-defined. No adapter-local relation semantics.

**Definition of Done**

Every structured relation is typed and referentially valid; prose-only targets
fail where a typed relation is required; PASS makes no semantic correctness
claim.

**Non-goals**

Reconstructing historical SRC-001 proposal links or deterministically selecting
the correct relation.

**Dependency**

Slice 3 active-unit/status and lineage model.

## Slice 5 - Internal ambiguity and referent lifecycle

**Purpose**

Keep unresolved source-internal referents visible and carry their effect along
declared relations until human authority closes or explicitly preserves them.

**Evidence basis**

`C-019` and `C-186` remain unresolved by design; `C-049` and `C-111` were
repaired through context/dependency. Audited DC-08 and narrowed SL-05 apply.

**Primary owner**

Core evidence-boundary and semantic-review owner.

**Affected canonical source files**

- `docs/architecture/04-pipeline-stages-and-dod.md`
- `docs/architecture/templates/04-evidence-boundaries.md`
- `docs/architecture/prompts/workers-intake-extraction.md`
- `docs/architecture/prompts/workers-judgment.md`
- `docs/architecture/prompts/verifier-lenses.md`
- `docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md`
- `scripts/lib/run-model.ts`
- `scripts/lib/checks-k2.ts`
- `scripts/test-conformance-mutations.ts`
- `core.manifest.json`

**Artifact/schema changes**

Add ambiguity ID, unresolved expression, bounded search scope, candidate/null
antecedent, affected relation IDs, carry state, authority closure, and closure
provenance.

**Prompt changes**

Require full same-source search where needed, forbid external/answer-key
inference, and require `CANNOT_DETERMINE` when the source does not resolve the
referent.

**Checker changes**

Validate explicit flag presence, affected typed relation IDs, carry/closure
state, and authority reference. Do not detect ambiguity from prose.

**Fixtures**

Resolved local antecedent, unresolved null antecedent, carried ambiguity,
human closure, and unrelated descendants that must not inherit the flag.

**Mutation tests**

Dropped ambiguity, invented antecedent without authority, missing affected
edge, invalid closure, and indiscriminate propagation.

**Runtime-js regeneration**

Required.

**Adapter implications**

Existing human-gate mechanics can present a Core-defined closure request.
Adapter changes are limited to accepting the new Core gate/artifact type if
not already generic.

**Definition of Done**

Declared ambiguity remains visible until a valid authority closure or explicit
carry; semantic resolution is never produced by the checker.

**Non-goals**

Automatic pronoun resolution or domain-knowledge substitution.

**Dependency**

Slice 4 typed relations.

## Slice 6 - Formal/table/layout bindings and degraded formats

**Purpose**

Represent available layout and formal evidence explicitly, and fail visibly
when source structure is unavailable.

**Evidence basis**

Twenty table/caption omissions, discontiguous representation cases, four
glyph/formal/spacing defects, and `C-029` degraded equation treatment. Audited
DC-09 and narrowed SL-06 apply.

**Primary owner**

Core ingestion/artifact/checker owner.

**Affected canonical source files**

- `docs/architecture/02-system-architecture.md`
- `docs/architecture/04-pipeline-stages-and-dod.md`
- `docs/architecture/templates/02-corpus-intake.md`
- `docs/architecture/templates/03-extraction-claims.md`
- `docs/architecture/prompts/workers-intake-extraction.md`
- `docs/architecture/prompts/verifier-lenses.md`
- `docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md`
- `scripts/lib/run-model.ts`
- `scripts/lib/checks-k2.ts`
- `scripts/test-conformance-mutations.ts`
- `core.manifest.json`

**Artifact/schema changes**

Add source representation type, page/region/table coordinates, header and
caption IDs, exact cell bytes, rendering provenance, and
degraded/unsupported/indeterminate status.

**Prompt changes**

Separate ingestion facts from semantic interpretation. Workers may interpret
only declared bytes/layout and must not infer chart values or reconstruct
missing equations.

**Checker changes**

Validate coordinates, header/caption target existence, source hashes,
provenance type, and explicit degraded status. Do not judge alignment meaning.

**Fixtures**

Table with headers/cells/caption, shifted-cell adversary, flattened equation,
image-only chart, and unsupported format.

**Mutation tests**

Missing header, wrong coordinate, changed cell byte, absent provenance,
undeclared image inference, and degraded artifact presented as exact/gold.

**Runtime-js regeneration**

Required.

**Adapter implications**

Source-extension support or rendering capture may need host mechanics only
after Core defines the representation. The adapter must fail unsupported
formats rather than invent a renderer.

**Definition of Done**

Available structure is reopenable; unavailable structure is visibly degraded
or indeterminate; semantic interpretation stays with fresh reviewers.

**Non-goals**

A general PDF/OCR engine or deterministic table semantics.

**Dependency**

Slice 1 exact fragments and Slice 4 typed context/reference records.

## Slice 7 - S2/S3 semantic atomicity, context, qualifier, and evidence-role review

**Purpose**

Use the preceding machine-readable representations to improve semantic
packetization/normalization while preserving fresh challenge and human
authority boundaries.

**Evidence basis**

Audited SL-01, SL-02, SL-03, and SL-04; proposal-missed splits; evidence-role,
scope, condition, modality, attribution, and result-versus-interpretation
examples.

**Primary owner**

Core prompt and semantic-harness owner.

**Affected canonical source files**

- `docs/architecture/04-pipeline-stages-and-dod.md`
- `docs/architecture/08-runbook-agent-mode.md`
- `docs/architecture/prompts/orchestrator.md`
- `docs/architecture/prompts/workers-intake-extraction.md`
- `docs/architecture/prompts/workers-judgment.md`
- `docs/architecture/prompts/verifier-lenses.md`
- `docs/architecture/templates/03-extraction-claims.md`
- relevant synthetic fixtures under `docs/fixtures/`
- `core.manifest.json`

**Artifact/schema changes**

Add structured producer/reviewer returns for atomic units, claim roles,
conditions, qualifiers, attribution, modality, relation proposals, and
unresolved findings.

**Prompt changes**

Define separate producer and fresh-refuter duties. Hide final IDs, calibration
answers, downstream narratives, and unrelated batches.

**Checker changes**

Only validate return shape, allowed IDs/enums, preserved exact-field hashes,
and required reviewer records. Do not score semantic adequacy deterministically.

**Fixtures**

Conditional result, result versus interpretation, necessary context, dangling
pronoun, modality, comparator, metric, and discourse-marker cases.

**Mutation tests**

Missing structured field, changed exact hash, absent reviewer record,
self-review context reuse, and invalid enum. Semantic alternatives belong in
adversarial fixture expectations, not deterministic truth assertions.

**Runtime-js regeneration**

Required only for checker/model changes; prompt/doc changes still change Core
and bundle digests.

**Adapter implications**

Worker-bundle allowlists and structured-return validation may need mechanical
updates. Fresh-context isolation requirements remain unchanged.

**Definition of Done**

Producer and reviewer roles are disjoint; every semantic finding has
reopenable evidence; deterministic checks validate only structure; synthetic
adversaries exercise accepted and indeterminate outcomes.

**Non-goals**

Truth checking, authority acceptance, SRC-001 answer encoding, or
model-specific prompting tricks.

**Dependency**

Slices 1-6.

## Slice 8 - S4 duplicate-versus-overlap fresh refutation

**Purpose**

Separate semantic duplicate judgment from mechanical lineage/provenance
preservation.

**Evidence basis**

Three duplicate dispositions, replacements, `S-190b`, and audited SL-07 and
DC-06.

**Primary owner**

Core S4 prompt/harness owner.

**Affected canonical source files**

- `docs/architecture/04-pipeline-stages-and-dod.md`
- `docs/architecture/prompts/workers-judgment.md`
- `docs/architecture/prompts/verifier-lenses.md`
- `docs/architecture/templates/03-extraction-claims.md`
- `docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md`
- `scripts/lib/run-model.ts`
- `scripts/lib/checks-k2.ts`
- `scripts/test-conformance-mutations.ts`
- relevant synthetic fixtures
- `core.manifest.json`

**Artifact/schema changes**

Require duplicate/overlap proposal, compared unit IDs, retained distinctions,
representative choice, full provenance union, reviewer decision, and
unresolved state.

**Prompt changes**

Fresh reviewer tests whether any qualifier, condition, evidence role, or source
occurrence would disappear under merge.

**Checker changes**

Validate targets, statuses, reviewer presence, and provenance union only.

**Fixtures**

Exact duplicate, partial overlap, contradictory statements with shared topic,
multi-source duplicate, and unresolved equivalence.

**Mutation tests**

Missing source occurrence, absorbed claim still active, nonexistent
representative, lost qualifier provenance, and absent fresh review.

**Runtime-js regeneration**

Required if checker/model fields change.

**Adapter implications**

No new command surface. Continue requiring fresh worker context and
orchestrator-only ledger writes.

**Definition of Done**

No source occurrence disappears; semantic duplicate decisions have fresh
review; checker PASS claims only structural lineage/provenance integrity.

**Non-goals**

Deterministic semantic equivalence or fewer-row optimization.

**Dependency**

Slice 3 lineage and Slice 4 relation graph; Slice 7 structured semantic
review.

## Slice 9 - Intent-fidelity intake

**Purpose**

Replace one prose S0 scope summary with a bounded interview, atomic intent
ledger, fresh coverage/ambiguity/contradiction review, human-confirmed
structured charter, and traceable S1 criteria.

**Evidence basis**

Human-authority product requirement. Not derived from SRC-001.

**Primary owner**

Core S0/S1 artifact, prompt, checker, and product-contract owner. Loa owns only
host persistence/gate mechanics.

**Affected canonical source files**

- new `docs/architecture/templates/00-intent-intake.md`
- `docs/architecture/templates/README.md`
- `docs/architecture/templates/01-run-control.md`
- `docs/architecture/templates/02-corpus-intake.md`
- `docs/architecture/02-system-architecture.md`
- `docs/architecture/03-artifact-contracts.md`
- `docs/architecture/04-pipeline-stages-and-dod.md`
- `docs/architecture/08-runbook-agent-mode.md`
- `docs/architecture/09-runbook-manual-mode.md`
- `docs/architecture/prompts/orchestrator.md`
- `docs/architecture/prompts/workers-intake-extraction.md`
- `docs/architecture/prompts/verifier-lenses.md`
- `docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md`
- `scripts/lib/run-model.ts`
- `scripts/lib/checks-k2.ts`
- `scripts/test-conformance-mutations.ts`
- `core.manifest.json`

**Artifact/schema changes**

Add exact intent-source turns, `INT-*` ledger, `COV/AMB/CON/LEAK` review
records, structured charter, intent trace, dispositions, charter gate, temporal
mode, and S1 criterion provenance. Bump run format for new runs; preserve
legacy formats.

**Prompt changes**

Add bounded interview, intent atomization, fresh intent review, charter review,
and criteria-fidelity review. Explicitly forbid desired conclusions, claim
dispositions, routing, clusters, and projection prose.

**Checker changes**

Implement IF-01 through IF-12 from the contract: ID/digest integrity, forward
and backward trace, chronology, immutability, type-boundary enforcement,
successor-run structure, and current-world admission chronology. Do not judge
semantic adequacy.

**Fixtures**

Synthetic/adversarial cases:

- innovation versus product over the same corpus;
- ambiguous `latest`;
- conflicting geography boundaries;
- decision context attempting to force a conclusion;
- projection possibility attempting to alter S1 criteria;
- active intent silently dropped;
- post-freeze current-world source arrival;
- valid successor run.

**Mutation tests**

Missing `INT-*` trace, orphan charter rule, criterion with only projection
provenance, criteria predating no charter confirmation, in-place post-freeze
scope mutation, unpinned interview turn, and mutable URL without admitted
bytes.

**Runtime-js regeneration**

Required for checker/model changes.

**Adapter implications**

The public `/loa-aleph start <inputs...>` surface remains unchanged. Loa
adapter mechanics must be updated to persist exact turns, present Core-defined
charter/freeze gates, support append-only DRAFT-only admission of approved
current-world source bytes, transaction-bind canonical artifacts and digests,
reject source admission after S0, and accept the new run format. Likely source
files:

- `adapters/loa/src/types.ts`
- `adapters/loa/src/intake.ts`
- `adapters/loa/src/cli.ts`
- `adapters/loa/src/ledger-writer.ts`
- `adapters/loa/skill/loa-aleph/SKILL.md`
- `adapters/loa/README.md`
- adapter tests and generated runtime projections.

The adapter must not copy the Core template, prompt, checker, or schema.

**Definition of Done**

Every active intent is traced or explicitly disposed; every charter/criteria
rule has approved provenance; fresh reviews are recorded; S0 cannot freeze
with a blocking ambiguity; current-world bytes are admitted before freeze;
legacy runs remain resumable under original bundles.

**Non-goals**

Planning, conclusion selection, claim adjudication, projection commissioning,
or using SRC-001 replay to evaluate intake.

**Dependency**

Architecturally separate from slices 1-8. It is ninth to keep its human product
authority distinct and to land before the release selected for replay. Within
the slice, schema/checker work must land before prompts and adapter behavior
that rely on it.

## Slice 10 - Blind SRC-001 replay harness

**Purpose**

Measure the behavior of the improved generic Core without leaking the closed
calibration reference into replay production.

**Evidence basis**

Audited SRC-001 replay boundary. Calibration evaluation only.

**Primary owner**

Calibration/replay owner outside Core, with independent post-run comparison.

**Affected canonical source files**

None by default. Prefer a new append-only calibration replay area. Add a
generic Core replay contract only through a separate authority decision.

**Artifact/schema changes**

Create:

- replay allowlist/withhold manifest;
- immutable input and bundle digests;
- leak-check report;
- frozen replay digest;
- post-freeze mapping/comparison schema;
- exact-byte, structural, and semantic comparison reports.

**Prompt changes**

None specific to SRC-001. Replay uses only improved generic Core prompts.

**Checker changes**

Calibration-only checks verify allowlist closure, forbidden-reference absence,
immutable replay freeze, and post-freeze comparison chronology.

**Fixtures**

Leak detector fixture, immutable-freeze fixture, ID-independent comparison
fixture, and indeterminate semantic-delta fixture.

**Mutation tests**

Answer inventory leak, audit/addendum/overlay leak, expected ID leak,
post-freeze replay mutation, comparison opened before freeze, and missing
bundle/input pin.

**Runtime-js regeneration**

None for a calibration-only harness. Required only if a separately authorized
generic Core contract is added.

**Adapter implications**

Use the verified immutable `aleph-for-loa` release and normal run mechanics.
Do not add SRC-001-specific adapter behavior.

**Definition of Done**

The replay sees only:

- frozen source;
- frozen criteria;
- improved generic Core;
- ordinary required run inputs.

It does not see:

- human answer inventory;
- original delta analysis;
- independent audit;
- this correction/addendum or effective overlay;
- expected IDs;
- decision/correction/close events;
- precomputed comparison metrics.

The replay is frozen and hashed before the reference is opened. Comparison
does not force ID equality and preserves `CANNOT_DETERMINE`.

**Non-goals**

Intent-fidelity evaluation, validation, sanction, golden promotion, production
readiness, accepted criteria, SRC-002, or v1 evidence.

**Dependency**

Slices 1-8 must be implemented, checked, released, and immutably pinned.
Slice 9 is included in the selected product release but is not exercised
because SRC-001 already has frozen criteria.

## 4. Loa distribution outcome

Future distribution remains:

```text
canonical loa-aleph
    ->
verified immutable aleph-for-loa release
    ->
Loa installation/update
    ->
/loa-aleph
```

An ordinary Core update rebuilds immutable bundles. Existing runs keep their
original lock and runtime snapshot. No mutable-main execution is permitted.

The `/loa-aleph` public command set does not require a new command. Slice 9
requires Loa adapter mechanics changes inside canonical `loa-aleph`; no
corresponding `loa` source-repository change is anticipated unless the host
integration boundary itself changes.

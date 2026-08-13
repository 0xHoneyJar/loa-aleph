# Intent-Fidelity Intake Contract Proposal

Date: 2026-08-13

Design-input class: `HUMAN-AUTHORITY_PRODUCT_REQUIREMENT`

This contract is not claimed to be derived from SRC-001. It is a separate
human-authority product requirement for future `/loa-aleph` intake.

No implementation is authorized by this document.

## 1. Product rule

`/loa-aleph` intake should conduct a bounded conversational interview that
preserves detailed user research intent without replacing it with a lossy
planning summary.

The authoritative representation is:

```text
exact user prompt and interview turns
    ->
atomic intent ledger
    ->
coverage / ambiguity / contradiction review
    ->
human-confirmed structured research charter
    ->
S0 corpus freeze
    ->
S1 extraction criteria with forward and backward trace
```

A prose scope paragraph may be rendered for readability, but it is not the
authoritative intent record and cannot replace the atomic ledger, charter
rows, dispositions, or trace.

## 2. Research identity versus projection identity

Different research questions over the same corpus may produce different runs,
different S1 criteria, and different Research Precis artifacts.

For example:

- `latest innovations in banking security`;
- `latest banking-security products`.

The first question may admit methods, protocols, research advances, operational
practices, and product-independent techniques. The second may require an
identifiable product or offering. Their candidacy rules differ, so separate
research charters and runs are legitimate even when the supplied corpus bytes
are identical.

Different eventual documents for the same confirmed research question do not
create different extraction criteria. They are separate projection
commissions over the same accepted Precis. Projection never mutates the
accepted Precis.

## 3. Bounded interview

The interview begins from the exact user prompt and selected corpus inputs.
It asks only questions needed to resolve load-bearing research intent.

The initial contract should use a finite bound:

- at most three clarification rounds;
- at most five focused questions in a round;
- the human may confirm earlier;
- reaching the bound with a load-bearing ambiguity blocks charter
  confirmation or preserves an explicitly authorized unresolved boundary.

Questions should target:

- the research question;
- inclusion and exclusion rules;
- temporal meaning;
- entity, product, category, geography, or market boundaries;
- source-admission policy;
- unresolved contradictions in the user's instructions;
- whether stated downstream uses are decision context or merely possible
  projection destinations.

The interview must not ask for or collect:

- desired conclusions;
- claim dispositions;
- routing outcomes;
- cluster decisions;
- projection prose;
- preferred evidence selected to force an answer;
- expected claim IDs or answer inventories.

## 4. Canonical artifacts

Proposed new-format run artifacts:

| Artifact | Purpose |
|---|---|
| `intake/intent-source.jsonl` | Exact ordered user prompt and clarification turns, with actor, timestamp, and content digest. |
| `ledgers/intent-ledger.md` | Atomic `INT-*` requirements with exact turn provenance. |
| `ledgers/intent-review.md` | Coverage, ambiguity, and contradiction findings from a fresh-context review. |
| `research-charter.md` | Human-confirmed structured research question, scope rules, decision context, and non-binding projection possibilities. |
| `ledgers/intent-trace.md` | Forward and backward mappings among `INT-*`, charter rows, dispositions, and S1 criteria. |
| `control/gates/GATE-S0-CHARTER-request.json` | Exact charter confirmation request bound to artifact digests and Core contract. |
| `control/gates/GATE-S0-CHARTER-response.json` | Human confirmation, rejection, or requested clarification. |
| `control/gates/GATE-S0-FREEZE-response.json` | Existing corpus/sensitivity freeze authority, extended to bind the confirmed charter digest. |

Markdown artifacts remain canonical Core records. Machine twins, if used by an
adapter, must be exact projections of the canonical Core schema and must not
be adapter-owned replacements.

## 5. Atomic intent ledger

Each row represents one independently traceable user requirement.

Required fields:

| Field | Rule |
|---|---|
| `intent_id` | Unique `INT-NNN`. |
| `kind` | One of the four kinds below. |
| `subtype` | Closed subtype appropriate to the kind. |
| `source_turn_refs` | One or more exact `TURN-NNN` references. |
| `verbatim_text` | Exact load-bearing user words, not a paraphrased substitute. |
| `atomic_requirement` | Neutral operational restatement, still linked to the verbatim text. |
| `status` | `active`, `superseded`, `withdrawn`, `disputed`, or `disposed`. |
| `supersedes` | Prior `INT-*` IDs when a clarification changes intent. |
| `ambiguity_refs` | Explicit `AMB-*` records, if any. |
| `contradiction_refs` | Explicit `CON-*` records, if any. |
| `downstream_refs` | Charter, criteria, or disposition references. |

The exact turn plus atomic row is authoritative. The normalized requirement
alone is not.

## 6. Four intent kinds

### 6.1 RESEARCH_QUESTION

What the user is trying to learn.

Examples:

- identify recent technical innovations used to secure banking systems;
- identify recent banking-security products and their stated capabilities.

This kind may define one primary question and bounded subquestions. It must
not encode the desired answer.

### 6.2 RESEARCH_SCOPE_RULE

Rules that determine candidacy or source admission:

- inclusion;
- exclusion;
- temporal mode and cutoff;
- entity, product, category, geography, or market boundary;
- source policy;
- terminology definitions;
- other scope dimensions required to decide relevance.

A scope rule may affect S0 source admission, S1 extraction criteria, or both.

### 6.3 DECISION_CONTEXT

Why the user cares or what the research may inform.

Decision context may help the interviewer ask whether distinctions are
relevant. It must not:

- determine evidentiary truth;
- set a desired conclusion;
- change source trust;
- suppress contradictory evidence;
- become the sole basis for an S1 criterion.

### 6.4 PROJECTION_POSSIBILITY

Possible future documents such as product architecture, research paper,
market report, or software PRD.

This is non-binding context until an accepted Precis receives a separate
projection commission. It cannot silently alter S1 criteria. If discussion of
a possible projection reveals a genuine research-scope requirement, the human
must approve a separate `RESEARCH_QUESTION` or `RESEARCH_SCOPE_RULE` item.

## 7. Coverage, ambiguity, and contradiction review

Before charter confirmation, a fresh-context reviewer receives:

- exact intent-source turns;
- the atomic intent ledger;
- the allowed intent schema;
- no corpus conclusions, claim inventory, routing output, or projection
  commission.

The reviewer returns structured findings:

| Record | Purpose |
|---|---|
| `COV-*` | User text that may be load-bearing but has no `INT-*` row. |
| `AMB-*` | Terms with materially different candidacy interpretations. |
| `CON-*` | User requirements that cannot all hold simultaneously. |
| `LEAK-*` | Desired conclusion, claim disposition, routing, or projection content improperly admitted into intake. |

The producer may repair the ledger. The producer may not accept its own
repair. The human confirms the resulting charter.

## 8. Structured research charter

The charter is a structured authority artifact, not a narrative plan.

Required sections:

1. **Research questions**
   - `RQ-*` ID;
   - exact operational question;
   - supporting `INT-*` IDs.
2. **Scope and relevance rules**
   - `SCOPE-*` ID;
   - inclusion/exclusion/temporal/entity/source-policy subtype;
   - rule;
   - supporting `INT-*` IDs;
   - whether it governs S0, S1, or both.
3. **Decision context**
   - `CTX-*` ID;
   - non-evidentiary context;
   - supporting `INT-*` IDs;
   - explicit `cannot_determine_truth_or_conclusion: true`.
4. **Projection possibilities**
   - `PROJ-*` ID;
   - possible later projection type;
   - supporting `INT-*` IDs;
   - explicit `binding_on_S1: false`.
5. **Dispositions**
   - `INT-DISP-*` ID;
   - affected `INT-*`;
   - outcome and reason;
   - human authority.
6. **Unresolved boundaries**
   - unresolved `AMB-*` or `CON-*`;
   - whether it blocks freeze or is explicitly carried.

Suggested disposition outcomes:

- `DUPLICATE`;
- `SUPERSEDED`;
- `WITHDRAWN_BY_HUMAN`;
- `OUTSIDE_THIS_RESEARCH_RUN`;
- `NON_BINDING_DECISION_CONTEXT`;
- `NON_BINDING_PROJECTION_CONTEXT`;
- `UNRESOLVED_BLOCKS_FREEZE`;
- `UNRESOLVED_CARRIED_BY_HUMAN_AUTHORITY`.

Every load-bearing `INT-*` must map to one or more charter or criteria records,
or to one explicit disposition. Silent disappearance is forbidden.

## 9. S1 criteria derivation

Each S1 criterion row gains:

- `criterion_id`;
- operational candidacy rule;
- `charter_refs`;
- `intent_refs`;
- `scope_effect`;
- `written_at`;
- supersession/re-extraction state.

Every criterion must trace to:

- confirmed research-question or scope-rule charter rows; or
- an explicit human-approved clarification recorded before criteria freeze.

Decision context and projection possibility may not be the sole provenance for
a criterion.

Criteria remain written from the confirmed charter plus a skim of the frozen
corpus. They must predate extraction.

## 10. Deterministic intent-fidelity invariants

Mechanically justified checks:

| ID | Check | What PASS proves |
|---|---|---|
| IF-01 | Every intent-source turn has a unique ID, canonical order, actor, timestamp, byte length, and digest. | Source-record structure and byte identity. |
| IF-02 | Every `INT-*` references existing source turns; IDs and enums are valid. | Referential and schema integrity. |
| IF-03 | Every active `INT-*` maps to charter/criteria records or an explicit disposition. | Accounting completeness, not semantic adequacy. |
| IF-04 | Every charter row traces to one or more `INT-*` or an explicitly human-approved clarification. | Provenance presence. |
| IF-05 | Every S1 criterion traces to confirmed research-question/scope rows and their intent sources. | Structural derivation, not correct candidacy. |
| IF-06 | Charter confirmation predates S0 freeze; criteria creation predates first S2 packet. | Chronology. |
| IF-07 | The S0 frozen corpus, confirmed charter, criteria version, and their digests do not mutate in place. | Immutability of the current run. |
| IF-08 | Post-freeze scope/source changes create a successor run naming the predecessor. | Successor-run structure. |
| IF-09 | `DECISION_CONTEXT` and `PROJECTION_POSSIBILITY` are not sole provenance for S1 criteria. | Type-boundary enforcement. |
| IF-10 | Projection commission IDs or destination types cannot modify frozen S1 criteria. | Separation of distillation and projection records. |
| IF-11 | Intake schemas contain no fields for claim dispositions, routing, clusters, projection prose, or desired conclusions. | Forbidden structural surface, not absence of disguised semantics. |
| IF-12 | Current-world acquisition records predate S0 and every admitted byte is in the frozen source inventory. | Admission chronology and byte inventory. |

Deterministic checks must not decide whether:

- the interviewer understood the user's meaning;
- a requirement is semantically atomic;
- ambiguity is adequately resolved;
- criteria are substantively sufficient;
- a source is true;
- a particular conclusion is desired or correct.

## 11. Fresh-context semantic review

Required semantic reviews:

1. **Intent coverage reviewer**
   - compares exact turns to the ledger;
   - challenges omitted or conflated requirements.
2. **Ambiguity/contradiction reviewer**
   - tests materially different interpretations of temporal, entity, product,
     category, geography, and source-policy terms.
3. **Charter-fidelity reviewer**
   - compares the ledger and dispositions to the proposed charter;
   - flags strengthened, weakened, or silently missing requirements.
4. **Criteria-fidelity reviewer**
   - compares the confirmed charter to S1 criteria;
   - challenges over-broad, under-broad, or projection-driven candidacy rules.

Each reviewer uses a fresh context and structured return. None receives a
desired conclusion, downstream claim inventory, routing state, or projection
prose.

Human authority confirms the charter and any carried ambiguity. A model review
cannot grant that confirmation.

## 12. Current-world and "latest" handling

The charter must select exactly one temporal mode.

### CORPUS_BOUNDED_LATEST

Meaning: latest represented by the supplied and admitted corpus.

Required fields:

- corpus coverage dates, if known;
- no claim of current-world completeness;
- S1 criteria that treat recency relative to the corpus.

### CURRENT_WORLD_AS_OF

Meaning: current/latest as of a human-confirmed UTC date or timestamp.

Required fields:

- `as_of_utc`;
- acquisition cutoff;
- allowed source classes;
- source-quality/admission policy;
- geography/entity scope;
- known coverage limits.

Approved acquisition occurs only while the run is `DRAFT`:

1. collect candidate material into an acquisition staging area;
2. record origin, retrieval time, exact bytes, digest, license/sensitivity,
   and source class;
3. obtain the required human admission and sensitivity rulings;
4. copy admitted exact bytes into `corpus/sources/`;
5. inventory and hash them;
6. confirm the charter and freeze S0.

A mutable URL is provenance, not a live execution dependency. The frozen bytes
are the source.

No mutable web research may silently enter after S0. Material received after
freeze starts a successor run whose manifest names the current run. The
existing run and its accepted Precis remain unchanged.

## 13. Loa and distribution boundary

The `/loa-aleph` operator command surface can remain:

```text
/loa-aleph start <files-or-directories...>
```

The installed skill conducts the bounded interview after `start` creates the
draft run and before S0 freeze. No new public subcommand is required.

Loa adapter mechanics do require a narrow update because the current
`S0AuthorityResponse` carries only one prose `declared_scope`. The adapter must:

- persist exact interview turns;
- support an append-only DRAFT-only source-admission transaction for
  human-approved current-world material and reject that transaction after S0;
- present Core-defined charter and freeze gates;
- transaction-bind canonical intent artifacts and digests;
- validate Core-defined structured responses;
- continue to use the orchestrator-only writer.

The adapter must read these schemas, templates, and prompts from the verified
immutable Core bundle. It must not duplicate or summarize them.

An ordinary Core plus Loa-adapter bundle release is sufficient. No
corresponding `loa` source-repository commit is anticipated unless the host
integration primitive or installation boundary itself changes.

Existing runs remain pinned to their original immutable bundle and runtime.

## 14. Non-goals

This contract does not:

- implement a general planning assistant;
- choose conclusions;
- judge evidence truth;
- commission a projection;
- alter an accepted Precis;
- permit mutable-main execution;
- authorize Core implementation, SRC-002, replay, validation, sanction,
  golden promotion, production readiness, or v1.

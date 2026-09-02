# OQ-01 Human Procedural Authority and Stage Interaction Doctrine

Date: 2026-09-01

Successor repair date: 2026-09-02

Status: PROPOSED — SUCCESSOR REPAIR NOT YET INDEPENDENTLY AUDITED OR ADOPTED

Decision class: bounded authority and architecture proposal

Maximum present claim:

`PROPOSED OQ-01 AUTHORITY/INTERACTION DOCTRINE`

This file is a normal successor repair to the exact independently audited
proposal at commit `acaca4b43fa3e2dbf3c94a53de63317866182671`.
That historical proposal remains intact in Git history. Its independent verdict
was `BLOCK_OQ_01_HUMAN_ADOPTION`. This successor repairs only findings F01,
F02, and F03 and carries the audit's required preservation boundaries. It has
not received a fresh independent audit and does not adopt or implement the
doctrine.

## 1. Authority boundary

This proposal is based on canonical repository `0xHoneyJar/loa-aleph` at:

- commit `f999814da3bb302bc211a7ddb3c378ddd47be9ab`; and
- tree `a83fd96eaf545a7fea037f93cd1960ac9165dd36`.

That commit is the merge commit of PR #49.

The adopted Slice 5 design remains controlling. Its current authority boundary
is preserved:

- Slice 5 design is adopted;
- OQ-01 remains `BLOCKING NOW`;
- OQ-01 has backward authority `authority/doctrine`;
- OQ-01 blocks implementation, not the already completed design adoption;
- T5.3 remains empty and inert;
- no positive ambiguity-authority semantics currently exist; and
- no implementation may invent a human ambiguity-closure gate.

This proposal recommends the separate doctrine required to resolve OQ-01. It
does not itself adopt that doctrine, activate T5.3, authorize Slice 5
implementation, or modify any live run.

A fresh independent design audit of the exact proposal bytes must occur before
a separate human adoption decision. Adoption, if later supplied, remains
distinct from implementation authority and implementation evidence.

## 2. Proposed OQ-01 resolution

### 2.1 Exact legal decision category

The proposed legal human decision category is:

`internal-ambiguity-procedural-decision`

It is a human procedural-authority category. It is not:

- semantic review;
- source interpretation;
- evidence admission;
- external-referent supply;
- relation correction;
- disposition judgment;
- S13 acceptance; or
- projection authority.

The human decides how Aleph proceeds while a reviewed ambiguity remains
unresolved. The human does not decide what the frozen source means.

### 2.2 Hard invariant: procedure, not semantic authorship

The following invariant is proposed as controlling doctrine:

> A human authority may decide how Aleph proceeds in the presence of a
> reviewed unresolved ambiguity. Human selection does not make an
> interpretation, referent, candidate, observation, or outside fact become
> frozen-corpus evidence.

Accordingly, no action under this category may:

- declare what an ambiguous expression “really means”;
- select a correct referent when the frozen corpus and valid semantic review
  do not establish one;
- convert an unresolved candidate into source fact;
- admit human expertise or outside knowledge as frozen evidence;
- make `cannot-determine` become semantic `PASS`;
- change an ambiguity review verdict;
- add support, evidence weight, or a relation fact;
- mutate a claim, packet, relation, source, or frozen-corpus byte; or
- waive an independently applicable Definition of Done or authority gate.

The adopted Slice 5 provisional upper-bound action
`close-with-supported-candidate` is not activated by this proposal.
`authority-closed` remains unavailable. Every positive T5.3 row proposed here
uses `selected_candidate_ref = none`.

## 3. When a procedural decision request exists

Aleph must distinguish three classes.

### 3.1 Class A — resolved from the frozen corpus

The exact frozen same-source basis supports one reviewed local resolution
under the adopted Slice 5 contract.

Result:

- record the valid `resolved-local` T5.2 assessment;
- no OQ-01 request exists; and
- no human authority is required solely for that ambiguity.

### 3.2 Class B — unresolved but non-material

The ambiguity remains unresolved, but no reviewed downstream requirement
depends on a unique interpretation.

Result:

- preserve the unresolved T5.2 state visibly;
- preserve any independently required existing carry state;
- no OQ-01 request exists solely because ambiguity exists; and
- continue only where all existing stage contracts and Definitions of Done
  permit continuation.

“Non-material” does not mean ignored, unrecorded, harmless in every context, or
semantically resolved. It means that the exact reviewed impact inventory
contains no material impact row under section 3.4.

### 3.3 Class C — unresolved and materially consequential

The ambiguity remains unresolved and at least one exact durable object is
bound to at least one downstream requirement whose legal treatment differs
depending on a unique interpretation.

Result:

- create a durable `internal-ambiguity-procedural-decision` request;
- stop at the S4-C2 local authority barrier defined in section 5;
- present only the actions legal for that exact basis; and
- never fabricate a response.

### 3.4 Structural materiality predicate

Materiality is not “the model thinks this is important.”

An ambiguity is materially consequential only when the separately reviewed
material-impact subject in section 4 contains at least one `impact_row` with:

1. one exact affected durable ID;
2. one operation from the closed vocabulary below;
3. one exact downstream contract or Definition-of-Done reference; and
4. one reviewed treatment and consequence that follow if no unique
   interpretation exists.

Closed `operation_kind` vocabulary:

- `load-bearing-reasoning`;
- `unique-relation-or-referent`;
- `disposition-validity`;
- `contradiction-or-reconciliation-strength`;
- `interpretation-dependent-synthesis`; and
- `required-barrier-dod`.

The first implementation must not accept a free-prose operation kind.

An `impact_row` is structurally shaped as:

```json
{
  "affected_id": "PKT-NNNN|CC-NNNN|REL-NNNN",
  "operation_kind": "one closed value",
  "requirement_ref": "core:<normalized-Core-path>#<exact-unique-heading-or-DoD-token>",
  "unresolved_treatment": "carry-only|restriction-only|carry-or-restriction|resolution-required",
  "consequence_if_unresolved": "bounded consequence statement"
}
```

`requirement_ref` must resolve to one exact current Core-classified repository
path and one unique heading, Definition-of-Done item, or durable contract token
inside that file. A line number, moving branch, mutable URL, free-prose
requirement name, or adapter-local rule is not legal.

`unresolved_treatment` means:

- `carry-only`: the cited requirement remains satisfiable only when the named
  operation remains available with the unresolved dependency explicit;
- `restriction-only`: the exact named operation must not occur, and
  prohibiting it is sufficient under the cited requirement;
- `carry-or-restriction`: either explicit unresolved carry or prohibition of
  the exact named operation satisfies the cited requirement; or
- `resolution-required`: neither unresolved carry nor prohibition of only the
  named operation can satisfy the cited requirement at the current barrier.

At minimum, a material row is required when ambiguity affects whether Aleph
may safely:

- use a claim in load-bearing reasoning;
- select or preserve a unique relation or referent;
- perform a disposition whose validity depends on the resolution;
- state a contradiction or reconciliation at a stronger level;
- synthesize a statement that requires the unresolved interpretation; or
- proceed past a barrier whose Definition of Done requires resolution.

The complete canonical operative scope is part of the exact material-impact
review basis. A changed row, added row, removed row, changed affected ID,
changed treatment, or changed requirement reference requires a new
material-impact subject and fresh review under section 4.

### 3.5 Bounded blast radius

There is one canonical operative scope:

```json
{
  "affected_ids": ["PKT-NNNN", "CC-NNNN", "REL-NNNN"],
  "impact_rows": []
}
```

It is owned by the material-impact subject. No request-local or
authority-subject-local scope may be authored independently.

The only legal affected durable kinds at S4-C2 are:

- existing same-run `PKT-*` rows in a current legal packet state;
- existing same-run lineage-current `CC-*` rows; and
- existing same-run eligible canonical `REL-*` rows already present in the
  bound T5.2 `affected_relation_ids`.

`SRC-*`, `AMB-*`, `LIN-*`, `VER-*`, `RC-*`, `REF-*`, `STM-*`, every other
future-stage ID, and an open-ended `other-Core-id` category are forbidden as
operative affected IDs. Exact source material remains reopenable through
`source_locators`; a coarse source identity is not an operative restriction
target. Future-stage effects are represented only by exact `operation_kind`
and `requirement_ref` values, never by invented future durable IDs.

Canonical rules:

- `affected_ids` is unique and ordered by kind `PKT`, `CC`, `REL`, then by
  numeric suffix;
- `impact_rows` is ordered by affected-ID order, the operation vocabulary
  order in section 3.4, and UTF-8 byte order of `requirement_ref`;
- every row's `affected_id` occurs exactly once in `affected_ids`;
- every affected ID has at least one impact row;
- the affected-ID set equals the unique projection of all row
  `affected_id` values;
- the tuple `affected_id + operation_kind + requirement_ref` is unique;
- two rows may not state different treatments or consequences for the same
  tuple;
- no row may contradict another row's treatment of the same exact operation
  under the same cited requirement; and
- a Class B subject has empty `affected_ids` and `impact_rows`, while a Class
  C subject has both nonempty.

`reviewed_unaffected_ids`, when present in the material-impact subject, is a
canonical unique array using the same legal ID kinds. It is disjoint from
`affected_ids`, records only specifically reviewed neighboring objects, and
has no complement or global-unaffected meaning.

An ID omitted from `affected_ids` is not thereby declared semantically
unaffected in all possible respects. It is only outside this request’s
operative blast radius. A later addition requires a new material-impact
subject and review; graph reachability, topic association, or model intuition
cannot expand the scope.

Aleph propagates the consequence of the ambiguity, not a blanket verdict that
the source or evidence is bad.

An unresolved expression must not automatically invalidate:

- the whole source;
- the whole topic;
- neighboring claims;
- independent evidence;
- unrelated relations; or
- a narrower claim supportable without the unresolved interpretation.

Existing claim doctrine governs whether a narrower claim may be preserved.
Aleph must not widen, rewrite, normalize, or paraphrase source evidence to
manufacture clarity.

## 4. Distinct material-impact review and exact authority subject

### 4.1 Three non-substitutable decisions

The adopted T5.2 ambiguity review, the new material-impact review, and human
procedural authority are separate:

1. **T5.2 ambiguity review:** what the frozen corpus establishes about the
   ambiguity;
2. **material-impact review:** which exact already-existing durable objects
   and downstream legal operations are affected while it remains unresolved;
   and
3. **human procedural authority:** how Aleph proceeds on that reviewed basis.

The material-impact reviewer cannot select a referent, change candidates,
rewrite T5.2, mutate relations, admit observations, or choose the human
action. Human authority remains category 3 only.

### 4.2 Canonical material-impact review subject

The exact subject format is:

`aleph-internal-ambiguity-material-impact-review-subject/v1`

The subject is retained at:

```text
runs/<run-id>/verification/harness/S4/material-impact-subjects/AMB-NNNN-A<assessment>-M<material-impact-seq>.json
```

`material_impact_seq` starts at `1` and is contiguous per unchanged T5.2
assessment. It identifies material-impact revisions only; it is not a T5.2
assessment sequence.

The subject is UTF-8 canonical compact JSON with keys in this exact order:

```json
{"format":"aleph-internal-ambiguity-material-impact-review-subject/v1","run_id":"RUN-slug","ambiguity_id":"AMB-0007","assessment_seq":2,"material_impact_seq":1,"t5_2_assessment_ref":"internal-ambiguity:T5.2:AMB-0007:A2@sha256:...","t5_2_review_subject_digest":"sha256:...","t5_2_review_ref":"ambiguity-review-verdict:VER-NNNN@sha256:...","c1_relation_basis_ref":"relations-basis:closure_phase=S4-C1-relations-closed;artifact=ledgers/relations.md|none","materiality_class":"B|C","operative_scope":{"affected_ids":[],"impact_rows":[]},"source_locators":[],"reviewed_unaffected_ids":[],"unresolved_statement":"...","review_proposition":"class-B-or-C-and-canonical-operative-scope-complete-and-accurate-under-cited-Core-requirements","proposed_by":"human:<actor-slug>|invocation:<id>"}
```

Binding rules:

- `t5_2_assessment_ref` has exact grammar
  `internal-ambiguity:T5.2:<AMB-NNNN>:A<positive-decimal>@sha256:<64-lowercase-hex>`.
- `t5_2_assessment_ref` identifies the exact retained T5.2 data-row bytes,
  from the first `|` through the final `|` with no trailing line ending. Its
  digest is over those exact UTF-8 bytes.
- `t5_2_review_subject_digest` exactly equals the adopted Slice 5
  `aleph-internal-ambiguity-review-subject/v1` digest retained by that row.
- `t5_2_review_ref` has exact grammar
  `ambiguity-review-verdict:<VER-NNNN>@sha256:<64-lowercase-hex>`, with the
  digest over the exact retained verifier file bytes.
- `t5_2_review_ref` resolves to the exact existing `VER-*` ambiguity verdict
  bytes. Its target must be
  `internal-ambiguity-review-subject:<t5_2_review_subject_digest>` and its
  verdict must be `upheld`.
- `c1_relation_basis_ref` uses the exact literal shown when the T5.2
  `affected_relation_ids` set is nonempty. The current relation artifact must
  remain K2.16-valid, the C1 marker must exist, and every affected `REL-*`
  must remain byte-identical and eligible. It is `none` only when the T5.2
  affected relation set is empty. This reuses the adopted Slice 5 C1
  read-only basis and does not invent a relation-set digest.
- `operative_scope` is the one canonical structure defined in section 3.5.
- `source_locators` is a unique deterministic array of existing exact Core
  locators needed to reopen the ambiguity, affected objects, requirements,
  and relation context.
- `reviewed_unaffected_ids` has the narrow meaning defined in section 3.5.
- `unresolved_statement` describes the unresolved issue without selecting an
  answer.
- `review_proposition` is the exact literal shown above.
- Class B requires an empty operative scope. Class C requires a nonempty
  operative scope.

The subject must not contain a human response, observation, comment,
forecast, action preference, selected action, selected candidate, outside
fact, or conclusion-seeking instruction.

The canonical subject digest and identity are:

```text
material_impact_subject_digest = sha256:<digest of exact canonical subject bytes>
material_impact_subject_ref = material-impact-subject:AMB-NNNN:A<assessment>:M<material-impact-seq>@sha256:<subject-hex>
```

### 4.3 Distinct fresh material-impact verifier

The material-impact verifier uses the existing `VER-*` record contract and
the exact target:

```text
internal-ambiguity-material-impact-review-subject:<material_impact_subject_digest>
```

Allowed verdicts remain:

- `upheld`;
- `refuted`; or
- `cannot-determine`.

Only `upheld` authorizes Class B continuation or a Class C authority request.
The authority basis binds the exact retained verdict bytes through:

```text
material-impact-verdict:<VER-NNNN>@sha256:<64 lowercase hex>
```

The verdict digest is over the exact retained `VER-*` file bytes. The
verifier's `shown` field must name the exact material-impact subject, bound
T5.2 assessment/review, cited requirements, reopened objects, and applicable
C1 relation basis. Its `withheld` field must exclude human comments,
observations, forecasts, desired actions, candidate preferences, and desired
conclusions.

The material-impact producer is not the fresh verifier for the same subject.
The designated procedural authority's response or preference is never a
review input, and a verifier verdict is never a human authority response.

A `refuted` subject requires a new `M` sequence, complete subject, digest, and
review. A `cannot-determine` verdict cannot authorize continuation or a human
request. It blocks until a new explicit bounded subject receives its own
`upheld` review or the run stops.

### 4.4 Deterministic Core action projection

Semantic review establishes impact and the per-row
`unresolved_treatment`. It does not select human actions.

Core deterministically derives the ordered `allowed_actions` array:

1. include `carry-unresolved` if and only if every impact row is
   `carry-only` or `carry-or-restriction`;
2. include `restrict-downstream-use` if and only if every impact row is
   `restriction-only` or `carry-or-restriction`;
3. always include `inspect-source`;
4. always include `block-at-current-barrier`;
5. always include `request-successor-corpus-run`; and
6. always include `record-human-observation`.

The resulting order is always the six-action order in section 7 with
ineligible actions omitted. A producer, reviewer, orchestrator, adapter, or
human-facing renderer may not add, remove, reorder, or reinterpret actions.
Class B creates no action projection because it creates no authority request.

For each allowed action, Core also deterministically emits one consequence
record with these exact keys:

```json
{"action":"one allowed action","terminality":"progression-enabling-terminal|nonterminal|nonterminal-suspensive|current-request-terminal-current-run-non-progressing","c2_effect":"eligible-if-all-other-dod-pass|not-eligible","current_run_effect":"continue-where-otherwise-legal|blocked-at-s4-c2|halted-successor-required","scope_effect":"carry-reviewed-unresolved-dependencies|prohibit-canonical-scope-operations|retain-observation-bytes-only|none","next_request":"none|Q+1-after-basis-verification|Q+1-after-actual-resume","successor_run":"not-required|required"}
```

Every valid response closes its exact request identity. `terminality` below
describes whether the ambiguity interaction may progress or requires Q+1; it
does not permit a second response to the closed request.

The exact value tuple for each action is:

| action | terminality | c2_effect | current_run_effect | scope_effect | next_request | successor_run |
|---|---|---|---|---|---|---|
| `carry-unresolved` | `progression-enabling-terminal` | `eligible-if-all-other-dod-pass` | `continue-where-otherwise-legal` | `carry-reviewed-unresolved-dependencies` | `none` | `not-required` |
| `restrict-downstream-use` | `progression-enabling-terminal` | `eligible-if-all-other-dod-pass` | `continue-where-otherwise-legal` | `prohibit-canonical-scope-operations` | `none` | `not-required` |
| `inspect-source` | `nonterminal` | `not-eligible` | `blocked-at-s4-c2` | `none` | `Q+1-after-basis-verification` | `not-required` |
| `block-at-current-barrier` | `nonterminal-suspensive` | `not-eligible` | `blocked-at-s4-c2` | `none` | `Q+1-after-actual-resume` | `not-required` |
| `request-successor-corpus-run` | `current-request-terminal-current-run-non-progressing` | `not-eligible` | `halted-successor-required` | `none` | `none` | `required` |
| `record-human-observation` | `nonterminal` | `not-eligible` | `blocked-at-s4-c2` | `retain-observation-bytes-only` | `Q+1-after-basis-verification` | `not-required` |

The future checker must recompute the action set and consequence array from
the upheld material-impact subject and reject any inequality. Human authority
chooses among legal projected actions; no model invents the choice set.

### 4.5 Exact authority subject

The proposed authority-subject format remains:

`aleph-internal-ambiguity-procedural-subject/v1`

It is UTF-8 canonical compact JSON with keys in this exact order:

```json
{"format":"aleph-internal-ambiguity-procedural-subject/v1","decision_category":"internal-ambiguity-procedural-decision","run_id":"RUN-slug","ambiguity_id":"AMB-0007","assessment_seq":2,"t5_2_assessment_ref":"internal-ambiguity:T5.2:AMB-0007:A2@sha256:...","t5_2_review_subject_digest":"sha256:...","t5_2_review_ref":"ambiguity-review-verdict:VER-NNNN@sha256:...","prior_indeterminate_review_refs":[],"resolution_state":"unresolved","candidate_state":"single|multiple|null-no-candidate|null-cannot-determine","candidate_refs":[],"carry_state":"none|explicit","affected_relation_ids":[],"c1_relation_basis_ref":"none","material_impact_seq":1,"material_impact_subject_ref":"material-impact-subject:AMB-0007:A2:M1@sha256:...","material_impact_review_ref":"material-impact-verdict:VER-NNNN@sha256:...","material_impact_review_verdict":"upheld","materiality_class":"C","operative_scope":{"affected_ids":["CC-NNNN"],"impact_rows":[{"affected_id":"CC-NNNN","operation_kind":"load-bearing-reasoning","requirement_ref":"core:<path>#<token>","unresolved_treatment":"resolution-required","consequence_if_unresolved":"..."}]},"source_locators":[],"reviewed_unaffected_ids":[],"unresolved_statement":"...","allowed_actions":["inspect-source","block-at-current-barrier","request-successor-corpus-run","record-human-observation"],"action_consequences":[{"action":"inspect-source","terminality":"nonterminal","c2_effect":"not-eligible","current_run_effect":"blocked-at-s4-c2","scope_effect":"none","next_request":"Q+1-after-basis-verification","successor_run":"not-required"},{"action":"block-at-current-barrier","terminality":"nonterminal-suspensive","c2_effect":"not-eligible","current_run_effect":"blocked-at-s4-c2","scope_effect":"none","next_request":"Q+1-after-actual-resume","successor_run":"not-required"},{"action":"request-successor-corpus-run","terminality":"current-request-terminal-current-run-non-progressing","c2_effect":"not-eligible","current_run_effect":"halted-successor-required","scope_effect":"none","next_request":"none","successor_run":"required"},{"action":"record-human-observation","terminality":"nonterminal","c2_effect":"not-eligible","current_run_effect":"blocked-at-s4-c2","scope_effect":"retain-observation-bytes-only","next_request":"Q+1-after-basis-verification","successor_run":"not-required"}]}
```

Rules:

- every T5.2 and C1 field exactly matches the immutable retained semantic
  basis;
- every material-impact field is an exact deep-equal projection from the
  separately retained upheld material-impact subject;
- `material_impact_review_ref` resolves to the exact `upheld` verifier record
  for `material_impact_subject_ref`;
- `materiality_class` must be `C`; Class B never creates an authority subject;
- `allowed_actions` and `action_consequences` exactly equal the deterministic
  projection in section 4.4;
- `candidate_refs` is informational and never selectable;
- free commentary, observations, recommendations, forecasts, and display
  prose are absent; and
- no field may be independently composed after the reviewed subject and Core
  projection exist.

The `authority_subject_digest` is:

```text
sha256:<lowercase hex of the exact UTF-8 canonical compact JSON bytes>
```

Any changed subject field creates a different digest.

## 5. Exact stage and barrier placement

### 5.1 No new stage and no global gate

This proposal adds no new S-stage and no gate at every stage.

The OQ-01 authority interaction is located:

> inside adopted S4-C2, after the exact unresolved ambiguity assessment and
> distinct material-impact subject have valid fresh review, and before the
> `S4-C2-ambiguities-finalized` marker and S4-C3 exit.

It is not:

- S0 scope or freeze authority;
- S8 external-referent authority;
- S13 Précis acceptance;
- a projection gate; or
- a relation-specific correction gate.

### 5.2 Ordered S4-C2 behavior

The future authorized procedure must:

1. consume the immutable S4-C1 canonical relation set read-only;
2. complete ambiguity production and the exact T5.2 semantic review;
3. serialize a complete reviewed T5.1/T5.2 state under a transactionally
   valid S4-C2-in-progress condition;
4. create and freshly review one complete material-impact subject for each
   unresolved ambiguity;
5. classify each upheld material-impact subject as B or C;
6. for each Class C ambiguity, project the exact legal action set and open one
   bounded request in ascending numeric
   `AMB-*` order;
7. permit at most one active authority request at a time;
8. append each valid response as one T5.3 row without changing T5.1, T5.2, or
   any relation row; and
9. retain the S4-C2 finalization marker only when every Class C ambiguity has
   a legal progression-enabling terminal action and every independent DoD is
   satisfied.

The future checker and run-control contract must distinguish:

- unauthorized partial T5.1/T5.2 state; from
- a complete reviewed T5.1/T5.2 basis durably blocked on one exact authority
  request before the C2 marker.

That distinction is a required coordinated Slice 5 implementation amendment.
It is not implemented here.

### 5.3 No relation mutation

OQ-01 actions consume the exact C1 relation set. They may not:

- append, delete, replace, retarget, supersede, or rewrite a `REL-*` row;
- infer a relation successor;
- rerun C1 silently;
- change `affected_relation_ids` after review; or
- use authority to repair a C1 semantic defect.

A C2-discovered relation defect remains governed by the adopted Slice 5
fail-closed rule: record the defect and halt before C2/C3 completion.

### 5.4 Late discovery

An ambiguity first discovered at or after the S4-C2 finalization marker cannot
open this same-run gate by silently reopening C2.

It:

- becomes a blocking run-log anomaly;
- does not mutate T5.1/T5.2/T5.3;
- does not mutate relations;
- uses only an already adopted applicable correction/resumption mechanism; or
- requires successor-run handling.

Post-`ACCEPTED` correction remains deferred.

## 6. Durable request and response protocol

### 6.1 Reuse of existing mechanics

Core owns the request/response schemas, action semantics, stage placement, and
authority rules.

An adapter may reuse the existing generic durable mechanics:

```text
control/gates/<request_id>-request.json
control/gates/<request_id>-response.json
```

including atomic transaction persistence, request-digest binding, blocking
state, recovery, and same-pin resume.

This proposal does not authorize adapter-local ambiguity semantics or a
parallel authority system.

### 6.2 Request identity grammar

The exact request identity grammar is:

```text
GATE-S4-AMB-<four decimal digits>-A<positive decimal>-Q<positive decimal>
```

Example:

```text
GATE-S4-AMB-0007-A2-Q1
```

Where:

- `AMB-0007` is the exact ambiguity ID;
- `A2` is the bound T5.2 `assessment_seq`; and
- `Q1` is the contiguous interaction request sequence for that assessment.

The first presentation is `Q1`. A nonterminal response creates `Q2` on the
same unchanged basis. A freshly upheld OQ-specific material-impact revision or
presentation-only replacement also consumes the next `Q` under section 10
without changing `A2`. Request sequences are never reused.

### 6.3 Response identity grammar

The exact response identity grammar is:

```text
RESP-S4-AMB-<four decimal digits>-A<positive decimal>-Q<positive decimal>
```

The numeric components must exactly match the request.

Example:

```text
RESP-S4-AMB-0007-A2-Q1
```

Exactly one response may exist for one request identity.

### 6.4 Request format

The proposed request format is:

`aleph-internal-ambiguity-authority-request/v1`

The durable request contains exactly these top-level keys:

```json
{
  "format": "aleph-internal-ambiguity-authority-request/v1",
  "request_id": "GATE-S4-AMB-0007-A2-Q1",
  "decision_category": "internal-ambiguity-procedural-decision",
  "run_id": "RUN-slug",
  "stage": "S4",
  "barrier": "S4-C2",
  "ambiguity_id": "AMB-0007",
  "assessment_seq": 2,
  "authority_subject": {},
  "authority_subject_digest": "sha256:...",
  "presentation": null,
  "required_authority": {
    "kind": "human",
    "identity": "exact designated authority identity"
  },
  "prepared_by": "human:<actor-slug>|invocation:<id>",
  "requested_at": "canonical timestamp"
}
```

`authority_subject` is the complete canonical section 4.5 object. It is the
only operative basis.

`presentation` is either `null` or this exact deterministic projection:

```json
{
  "classification": "NON-OPERATIVE-DETERMINISTIC-PROJECTION",
  "authority_subject_digest": "sha256:...",
  "unresolved_statement": "exact deep-equal copy",
  "operative_scope": {},
  "source_locators": [],
  "reviewed_unaffected_ids": [],
  "allowed_actions": [],
  "action_consequences": []
}
```

Every projected field must be deep-equal to the matching authority-subject
field. The projection may reorder nothing, omit nothing inside a projected
field, add no ID, add no action, and alter no consequence. A human-facing
renderer may add labels or prose outside the retained machine projection, but
that display is explicitly `NON-OPERATIVE`, must not contradict the canonical
subject, and cannot be the basis of an action. The first implementation may
use `presentation = null` and render the embedded canonical subject directly.

The request must let the human understand the consequence without rebuilding
the whole run, while retaining exact source re-entry.

The response authority identity must exactly match `required_authority`.
Changing the designated authority changes the request bytes and requires a new
request.

No affected ID, blast radius, unresolved basis, allowed action, or action
consequence exists independently at request level. All such content is either
inside the bound authority subject or an exact non-operative projection of
it. Human authority does not waive Core DoD.

The request artifact’s byte digest is the existing request binding:

```text
request_digest = sha256:<digest of exact retained request bytes>
```

### 6.5 Exact human text blob

Optional human text is preserved as exact UTF-8 bytes:

```json
{
  "encoding": "base64",
  "media_type": "text/plain; charset=utf-8",
  "bytes_base64": "...",
  "sha256": "sha256:..."
}
```

The decoded bytes must match the declared digest. A display rendering may be
derived, but it is not the canonical text.

### 6.6 Response format

The proposed response format is:

`aleph-internal-ambiguity-authority-response/v1`

The durable response contains exactly one operative action:

```json
{
  "format": "aleph-internal-ambiguity-authority-response/v1",
  "response_id": "RESP-S4-AMB-0007-A2-Q1",
  "request_id": "GATE-S4-AMB-0007-A2-Q1",
  "request_ref": "control/gates/GATE-S4-AMB-0007-A2-Q1-request.json",
  "request_digest": "sha256:...",
  "authority_subject_digest": "sha256:...",
  "authority": {
    "kind": "human",
    "identity": "exact identity"
  },
  "selected_action": "one exact action",
  "observation": null,
  "comment": null,
  "recorded_at": "canonical timestamp"
}
```

Rules:

- `selected_action` must be exactly one member of the request’s
  `authority_subject.allowed_actions`.
- Multiple actions in one response are invalid.
- `observation` is non-null only for `record-human-observation`.
- `comment` is optional for every action and always non-operative.
- Both text fields, when present, use the exact text-blob contract in section
  6.5.
- The response binds both the exact request bytes and the exact material
  authority subject.
- A model, worker, orchestrator, or adapter identity is never legal in
  `authority.kind`.

### 6.7 Multiple choice is operative

Only `selected_action` is operative.

Free text must not be interpreted as:

- a second action;
- a candidate selection;
- a referent;
- a disposition;
- an exception;
- a waiver; or
- a source fact.

Example:

```text
selected_action: restrict-downstream-use
comment: "I suspect the second condition was intended."
```

The only operative action is:

`restrict-downstream-use`

The comment does not become:

`referent = second condition`

If free text requests an unsupported action, Aleph must reject the unsupported
instruction or prepare a new bounded multiple-choice request. It must not
reinterpret the prose.

## 7. Closed action vocabulary and cardinality

The exact six action names are:

1. `carry-unresolved`
2. `restrict-downstream-use`
3. `inspect-source`
4. `block-at-current-barrier`
5. `request-successor-corpus-run`
6. `record-human-observation`

The first implementation uses exactly one selected action per response.

No same-response combination is legal.

If a human wants to record an observation and then choose
`carry-unresolved`, the legal sequence is:

1. respond `record-human-observation`;
2. persist the observation exactly;
3. prepare the next request sequence on the still-current basis; and
4. respond `carry-unresolved`.

This sequencing prevents commentary from becoming an inferred second action.

## 8. Exact action semantics

### 8.1 `carry-unresolved`

Operative meaning:

- preserve the ambiguity as unresolved;
- preserve its exact reviewed dependency and carry state;
- allow only downstream work whose contracts remain valid with the unresolved
  dependency visible; and
- keep the authority action and original unresolved review inspectable.

It does not mean ignore, resolve, accept, or downgrade the ambiguity.

Every affected downstream object must continue to carry the unresolved
dependency where its contract requires it.

This action may enable eventual S4-C2 finalization only if every exact
downstream requirement permits unresolved carry. It cannot override a
`required-barrier-dod` row that requires actual resolution.

Classification:

`progression-enabling terminal`

### 8.2 `restrict-downstream-use`

Operative meaning:

- continue the run where otherwise legal;
- create a procedural restriction overlay that prohibits only the exact
  `affected_id + operation_kind + requirement_ref` combinations in the
  canonical operative scope; and
- retain unaffected claims, packets, source regions, relations, and uses.

It does not:

- create or change an S5 disposition;
- create `rejection`, `exclusion`, or `invalidation`;
- create or change an S6 evidence-role assignment;
- change support or evidence weight;
- remove evidence;
- delete a claim or source;
- discard the source;
- discard the topic;
- discard unaffected claims;
- mark evidence bad;
- create rejection;
- choose a referent; or
- mutate a relation or disposition automatically.

The restriction overlay is the exact reviewed canonical operative scope
copied into the authority subject. Later stages may consume it only as a
procedural constraint. S5 and S6 still perform their own independent legal
production and fresh review; the overlay may prevent an operation, but it may
not pre-author either stage's semantic judgment.

Unlisted uses are not silently prohibited by reachability or topic
association.

This action may enable eventual S4-C2 finalization only when removing the
prohibited uses satisfies every applicable DoD without semantic invention.

Classification:

`progression-enabling terminal`

### 8.3 `inspect-source`

Operative meaning:

- reopen the exact source bytes, packets, claims, immutable C1 relation
  context, review subject, verifier record, impact rows, and request basis;
- present them read-only; and
- after inspection, prepare the next request sequence if the basis remains
  current.

Inspection is not:

- semantic authority;
- an authority answer;
- a source mutation;
- a closure event; or
- evidence admission.

Classification:

`nonterminal`

### 8.4 `block-at-current-barrier`

Operative meaning:

- persist a halt at the current valid S4-C2 barrier;
- preserve the exact request, response, reason, and run pins;
- write no C2 finalization or C3 exit marker; and
- on resume, re-verify the same basis and prepare the next request sequence.

It is a deliberate stop, not a decline that guesses another action.

Classification:

`nonterminal suspensive`

### 8.5 `request-successor-corpus-run`

Operative meaning:

- keep the current frozen run unchanged and unresolved;
- halt current-run progression before C2/C3 completion;
- record that additional source bytes or outside evidence require a successor
  run; and
- require normal successor-run S0 intake/freeze with the predecessor named
  where existing doctrine requires.

The action does not itself:

- create the successor run;
- admit new bytes;
- resolve the ambiguity;
- copy an authority observation into the corpus; or
- mutate the predecessor.

Classification:

`current-request terminal; current-run non-progressing`

### 8.6 `record-human-observation`

Operative meaning:

- persist exact human-supplied bytes as an observation, contextual note,
  expertise statement, or interpretive hypothesis;
- label the record `NON-EVIDENTIARY`; and
- prepare the next request sequence on the still-current procedural basis.

The observation may not:

- change the frozen corpus;
- establish a referent;
- establish a claim;
- become support;
- become a relation fact;
- resolve `cannot-determine`;
- alter reviewer output; or
- select another action.

The observation field is operative only in the narrow sense that its exact
bytes are preserved. Its content has no semantic or evidentiary effect.

Human observations and comments are excluded from:

- ambiguity producers and reviewers;
- material-impact producers and reviewers;
- candidate generation and search prompts;
- relation, disposition, evidence-role, synthesis, and projection semantic
  worker bundles; and
- every fresh semantic-review subject.

They may be displayed by a later non-semantic UI. Any future admission of the
same bytes to a successor corpus requires normal successor-run intake and
freeze; this proposal supplies no shortcut.

Classification:

`nonterminal`

## 9. T5.3 activation semantics

### 9.1 Positive row category

If this proposal is later independently audited, adopted, and implemented,
T5.3 records:

`internal-ambiguity-procedural-decision`

It does not record semantic closure.

### 9.2 Field semantics

The adopted eight-column T5.3 shape remains unchanged:

```markdown
| ambiguity_id | authority_seq | assessment_seq | action | selected_candidate_ref | authority_subject_digest | authority_ref | closure_provenance |
```

Proposed positive semantics:

- `ambiguity_id`: exact bound `AMB-NNNN`.
- `authority_seq`: contiguous positive integer per ambiguity across terminal
  and nonterminal responses.
- `assessment_seq`: exact current reviewed T5.2 assessment.
- `action`: exactly one of the six values in section 7.
- `selected_candidate_ref`: exactly `none` for every legal action.
- `authority_subject_digest`: exact section 4.5 procedural authority-subject
  digest.
- `authority_ref`: exact section 9.3 response reference.
- `closure_provenance`: exact section 9.4 request/response binding. The
  historical column name does not imply semantic closure.

No T5.3 action changes T5.2 `resolution_state` from `unresolved`.

### 9.3 `authority_ref` grammar

The exact proposed grammar is:

```text
authority-response:<response_id>@sha256:<64 lowercase hex>
```

Example:

```text
authority-response:RESP-S4-AMB-0007-A2-Q1@sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

It resolves to exactly one retained response at:

```text
control/gates/<matching-request_id>-response.json
```

The digest is over the exact retained response bytes.

### 9.4 `closure_provenance` grammar

The exact proposed grammar is:

```text
request:<request_id>@sha256:<request-hex>;response:<response_id>@sha256:<response-hex>
```

No freeform rationale is sufficient.

### 9.5 Empty and nonempty behavior

For future 1.5 behavior:

- the T5.3 table exists at the adopted Slice 5 artifact point;
- it may remain empty when there is no Class C ambiguity;
- it may remain empty while a Class C request has no response;
- it may contain nonterminal rows while the request remains open;
- a C2 finalization marker requires a progression-enabling terminal row for
  every Class C ambiguity;
- `request-successor-corpus-run` records a valid terminal response but does
  not permit current-run C2 finalization;
- a nonterminal final row never permits C2 finalization; and
- any nonempty row under run format 1.0–1.4 remains invalid.

No null or blank substitute is legal in a populated T5.3 row:

- `selected_candidate_ref` uses literal `none`;
- every other field is nonempty and exact.

### 9.6 Terminal conflict rule

One request has one response and one operative action.

For one assessment:

- after `carry-unresolved` or `restrict-downstream-use`, no later action may
  silently replace it;
- after `request-successor-corpus-run`, the current run stays halted and no
  progression action may be appended under the same assessment;
- nonterminal actions may precede one terminal action through contiguous
  request sequences; and
- changing a terminal action requires a materially new authority basis and
  separately adopted correction semantics. This proposal supplies neither.

## 10. Staleness, replay, and resume

### 10.1 Immutable S4-C1 and T5.2 semantic basis

Once the complete retained T5.1/T5.2 basis is valid and OQ-01 may open, all of
these are immutable for the same run:

- ambiguity expression and source basis;
- search scope, completion reference, and search-basis digest;
- candidate or typed-null state and candidate refs;
- T5.2-owned carry state;
- `affected_relation_ids`;
- every T5.1 byte;
- every T5.2 byte;
- every C1 relation byte; and
- every other field included in the adopted Slice 5 ambiguity-review subject.

If any such field is discovered to require change, Aleph fails closed. It may
not:

- create a new same-run T5.2 assessment sequence;
- rewrite T5.1 or T5.2;
- rerun or mutate C1;
- silently reopen C2;
- increment `A` and issue a replacement request; or
- describe the change as presentation-only.

The run uses only an already-adopted applicable correction/resumption
mechanism or a successor run. If no applicable same-run mechanism exists, the
run remains blocked. Post-`ACCEPTED` correction remains deferred.

Detection of an unauthorized byte change invalidates the run; a new
material-impact review cannot cure it.

### 10.2 OQ-specific material-impact basis

While T5.1, T5.2, and C1 remain byte-identical, these OQ-owned fields may
require correction before a progression-enabling terminal response has been
validly applied:

- materiality class B or C;
- canonical operative scope;
- impact-row treatment or consequence;
- requirement refs;
- source locators;
- reviewed unaffected IDs;
- unresolved statement;
- deterministic allowed-action projection; and
- deterministic action-consequence projection.

A correction creates the next contiguous `material_impact_seq`, a complete
new material-impact subject, a new digest, and a fresh material-impact
verdict. An upheld Class C revision creates a new authority-subject digest and
the next unused `Q` request. The bound T5.2 `A` value does not change.

Old subjects, verdicts, requests, responses, and nonterminal T5.3 rows remain
immutable history. A response to the old request cannot apply to the revised
basis. If a response was retained but not validly applied, it remains stale
history and no T5.3 row is appended from it.

An upheld Class B revision creates no human request. If it replaces a pending
Class C basis, the prior request becomes stale, the active-request pointer is
cleared transactionally, and continuation is legal only when every
independent DoD permits Class B continuation. A Class B-to-C revision creates
`Q1` when no prior request sequence exists, otherwise the next unused `Q`.

After `carry-unresolved`, `restrict-downstream-use`, or
`request-successor-corpus-run` has been validly applied, changing the
material-impact basis would alter a terminal authority consequence. This
proposal does not authorize that correction. The run fails closed under
existing correction/successor doctrine.

### 10.3 Presentation-only change

A change only to the optional non-operative presentation, rendering, or later
display content:

- leaves T5.1, T5.2, C1, the material-impact subject, and the authority subject
  unchanged;
- changes the exact request bytes and request digest;
- creates the next unused `Q` and requires re-presentation when no response
  has yet been validly applied;
- leaves the old request immutable and unable to receive a response for the
  replacement presentation; and
- cannot add an ID, action, consequence, unresolved proposition, or operative
  instruction.

If a response has already been validly applied, a later rendering change does
not retroactively stale that historical request or response and creates no new
authority event.

### 10.4 Q sequencing and atomic advancement

For one unchanged T5.2 assessment:

- `Q` starts at `1` and is contiguous across nonterminal responses,
  material-impact revisions, and presentation-only replacements;
- request IDs are never reused;
- one request has at most one response;
- at most one request is active;
- Q+1 is created exactly once;
- creating Q+1, updating the active-request pointer, recording any stale
  predecessor, appending a valid T5.3 row, and advancing run control are one
  recoverable idempotent transaction as applicable; and
- recovery resolves prepared/committed state without fabricating a response,
  duplicating T5.3, forking Q, or creating hidden parallel requests.

The exact reason for Q+1 is retained as one of:

- `nonterminal-response`;
- `material-impact-revision`;
- `presentation-only-replacement`; or
- `actual-resume-after-suspensive-block`.

### 10.5 Replay expectations

Later implementation must demonstrate:

- identical same-pin replay resolves the same request and response bytes;
- duplicate response persistence is idempotent and does not append a second
  T5.3 row;
- missing or digest-mismatched request/response artifacts block;
- a stale response does not apply after basis change;
- request and response recovery survive interruption;
- ascending ambiguity ordering is preserved;
- one active request is preserved across resume;
- nonterminal response history is retained;
- resume never fabricates `continue`, a terminal action, or human identity;
- material-impact `M` and request `Q` sequences remain contiguous and
  single-headed; and
- C1 relation bytes remain byte-identical throughout every interaction.

### 10.6 Resume behavior by action

- `inspect-source`: verify pins and basis, then create the next request.
- `record-human-observation`: verify and preserve the observation, then create
  the next request.
- `block-at-current-barrier`: remain blocked until an actual resume, then
  re-verify and create the next request.
- `carry-unresolved` or `restrict-downstream-use`: resume at the first unmet
  S4-C2 DoD without rerunning C1 or reinterpreting the response.
- `request-successor-corpus-run`: current run remains halted; any successor is
  a distinct normal run.

## 11. Qualitative non-evidentiary forecasting

Forecasting is not required for OQ-01 or Slice 5 and is removed from the first
request contract. The earlier exact vocabulary is deferred because
`weakly-supported` collides with evidence-support terminology.

Any later separately adopted forecast contract must be:

- optional;
- qualitative for its first activation;
- explicitly `NON-EVIDENTIARY`;
- excluded from semantic review subjects and operative authority subjects;
  and
- excluded from action projection.

No numeric probability, percentage, score, logit, or disguised numeric band
is authorized here.

A later forecast may not:

- change support;
- change evidence roles;
- change disposition;
- change a reviewer verdict;
- change deterministic validity;
- resolve ambiguity;
- add a candidate;
- change the allowed action set; or
- automatically select a human action.

The exact vocabulary, schema, renderer, and evaluation policy remain `LATER`.
Forecast implementation is not a Slice 5 prerequisite.

## 12. Minimum stage-interaction doctrine

### 12.1 Three distinct concepts

Aleph must distinguish:

1. `stage receipt`;
2. `stage interaction / operational choice`; and
3. `human authority gate`.

Neither a receipt nor a routine continue action is human authority.

### 12.2 Minimum required for OQ-01

The first OQ-01 implementation requires only:

- existing append-only `run-log.md` stage-exit behavior;
- bounded presentation of the exact S4-C2 authority request;
- a durable blocked state;
- exact human response persistence; and
- deterministic same-pin recovery and resume.

Existing stage-exit records remain the minimum informational receipt. They are
not authorization, acceptance, semantic proof, or human responses. This
proposal adds no all-stage receipt schema as a Slice 5 prerequisite.

### 12.3 Routine interaction remains distinct

Routine interaction may let a human:

- inspect;
- pause;
- stop; or
- continue.

These are operational choices. They do not:

- create T3 authority;
- waive a DoD;
- accept an artifact;
- resolve ambiguity; or
- supply evidence.

A routine `continue` may be recorded as an operational interaction record, but
it must not populate authority sign-offs or `authority_ref`.

### 12.4 Interaction modes are later

The names `guided-auto` and `stage-review`, expanded receipt fields, default
interaction behavior, and richer all-stage UX remain possible future
interaction design. They are `LATER`, are not activated by this proposal, and
do not block Slice 5 implementation.

Interaction mode, if later adopted, remains a different dimension from
execution `mode = agent|manual|hybrid`. It cannot sanction agent execution,
cross a human gate, fabricate a response, or convert automatic continuation
into semantic acceptance.

Manual execution remains the only currently sanctioned path. Historical run
format 1.4 runs receive no new interaction field and are not reinterpreted.

### 12.5 Future automation hook

Any future automation of an OQ-01 action requires a separate adopted doctrine
that names the exact action class, preconditions, audit record, revocation
rule, and non-human authority representation. It must not call automation a
human response.

## 13. Research-goal and conclusion-bias invariant

The proposed exact doctrine is:

> The research goal may condition relevance, scope, variables, source
> traversal priority, and the question Aleph investigates. It must not
> condition whether qualifying evidence is retained, how contrary evidence is
> weighted merely because it is contrary, which interpretation an ambiguity
> receives, or which conclusion the evidence is made to support.

In compact form:

```text
GOAL-CONDITIONED RELEVANCE IS ALLOWED.
CONCLUSION-CONDITIONED EVIDENCE SELECTION IS FORBIDDEN.
```

The research goal may define:

- the research question;
- subject scope;
- variables or conditions of interest;
- relevance; and
- traversal priority.

It may not cause Aleph to:

- suppress contrary qualifying evidence;
- down-rank evidence merely because it conflicts with a desired answer;
- treat a preferred conclusion as established;
- disposition claims to fit the requested conclusion;
- route ambiguity toward a preferred interpretation;
- omit unresolved or tainted material because it is inconvenient; or
- use forecasting as a conclusion-selection mechanism.

A conclusion-seeking request such as:

```text
prove X is good
```

must be operationalized as a question or hypothesis:

```text
Under the frozen corpus, what supports, contradicts, qualifies, or leaves
unresolved the hypothesis that X is good?
```

Later prompts and semantic checks must preserve this transformation. A
deterministic checker may verify required declarations and retained contrary
material references; it cannot prove cognitive neutrality.

## 14. Aleph Corpus Graph forward direction

### 14.1 Recorded direction and status

The human-selected canonical name is:

`Aleph Corpus Graph`

This proposal records `Aleph Corpus Graph` as accepted forward architectural
direction only. It does not propose, adopt, implement, or validate a detailed
schema, checker, runtime, UI, or graph product.

The proposal as a whole remains `PROPOSED`.

### 14.2 Forward invariants

Future detailed design must preserve:

- the Aleph Corpus Graph is a semantic coverage map over the frozen corpus;
- it is not merely a conventional single-tree taxonomy;
- it may be multidimensional and overlapping;
- nodes may be descriptive semantic regions rather than single-word topics;
- one source region may participate in multiple semantic neighborhoods;
- the research goal may shape relevance and traversal but not conclusion;
- nodes and edges remain reopenable to exact source material where
  applicable;
- unresolved and hard-to-classify regions remain visible;
- coverage matters more than premature interpretation;
- the graph is not evidence, disposition, semantic proof, or human authority;
- a convenient tree may be projected from it, but the canonical concept is a
  graph; and
- eventual design should support complete mapping before deeper S3 claim
  normalization.

Existing S1/S2 source inventory, source-walk, packet, exact-evidence, and
coverage machinery are likely foundations. A future detailed slice may define
how a complete graph exists before S3 without rewriting Slice 2.

### 14.3 Compatibility boundary

No current 1.4 run, fixture, checker result, or adopted contract is invalid
merely because the future Aleph Corpus Graph contract does not yet exist.

Detailed graph schema, node/edge taxonomy, completeness proof, checker
behavior, runtime representation, visualization, embeddings, ranking, and
automation are a distinct future architecture slice.

## 15. Relation to existing doctrine

### 15.1 Correction and effective state

Existing adopted correction/effective-state doctrine remains controlling:

- immutable history is preserved;
- changed OQ-specific material or presentation basis requires re-presentation
  only within section 10's limits, while an immutable T5.2/C1 semantic-basis
  change fails closed;
- no response is rewritten, fabricated, reinterpreted, or silently carried
  forward;
- frozen source correction requires a successor run; and
- post-`ACCEPTED` correction remains deferred.

This proposal does not add generic rollback, rewind, descendant invalidation,
artifact versioning, relation correction, or accepted-run reopening.

### 15.2 Lineage

Slice 3 remains the owner of packet/claim identity change.

No OQ-01 action:

- creates lineage;
- retargets to a successor;
- terminates a claim;
- creates a replacement; or
- changes `lineage-current`.

### 15.3 Typed relations

Slice 4 remains the owner of typed relation rows.

OQ-01:

- consumes the exact immutable C1 relation set;
- may restrict a downstream use of a relation;
- may preserve an unresolved caveat associated with a relation; and
- never rewrites, corrects, retargets, or gives evidentiary weight to a
  relation.

### 15.4 S5 dispositions

No OQ-01 action mechanically selects or changes a disposition.

If `restrict-downstream-use` affects whether a disposition remains valid, S5
must perform its own legal judgment and review. If no legal existing
disposition can represent the state, S5 blocks.

The OQ restriction remains a separate procedural overlay. S5 may cite it as a
constraint but may not translate it mechanically into `rejected`,
`excluded-with-reason`, `backgrounded`, `judged-non-load-bearing`, or any
other disposition.

### 15.5 S6 evidence roles

No OQ-01 action assigns or changes an S6 evidence role, support state, weight,
effect, or evidence edge.

If the restriction overlay prohibits one load-bearing operation, S6 still
performs its own independent evidence-role production and fresh review. It
must retain the semantic judgment its evidence contract supports while
separately honoring the procedural prohibition. If the current S6 contract
cannot represent both without semantic conflation, S6 blocks; OQ-01 does not
invent a replacement evidence role.

### 15.6 S8 external referents

OQ-01 does not supply an external referent.

`request-successor-corpus-run` preserves the current-run boundary. A later
S8 `REF-*` record remains separately governed and is never auto-created from
an ambiguity action.

### 15.7 S13 and projection

S13 acceptance cannot reinterpret or close an OQ-01 ambiguity.

Projection:

- consumes only the accepted effective research state;
- must preserve unresolved/restricted boundaries;
- cannot infer a referent from an OQ-01 comment or observation; and
- receives no new authority semantics from this proposal.

This proposal does not change projection contracts.

## 16. Future coordinated amendment surface

No implementation file is changed by this proposal.

### 16.1 BLOCKING FOR SLICE 5 IMPLEMENTATION

After independent audit and separate human adoption, all of the following are
blocking for an authorized Slice 5 implementation:

1. Activate the exact
   `internal-ambiguity-procedural-decision` Core category.
2. Implement the distinct material-impact subject, `M` sequence, exact
   retained T5.2/verifier bindings, material-impact verifier target/reference,
   and upheld-only gate.
3. Implement the canonical operative-scope schema, exact legal S4-C2 ID
   kinds, ordering, equality, existence, coverage, duplicate, and
   contradiction rules.
4. Implement deterministic Core action/consequence projection and reject
   every producer-, orchestrator-, adapter-, renderer-, or request-authored
   divergence.
5. Implement the request, response, text-blob, digest, ID, `authority_ref`,
   and `closure_provenance` contracts.
6. Implement the exact six-action vocabulary and one-action cardinality.
7. Implement S4-C2-local request ordering, blocking, C2 completion, and
   no-new-stage behavior.
8. Implement the legal S4-C2-in-progress retained-state distinction without
   weakening the adopted partial-state fail-closed rule.
9. Activate positive T5.3 rows exactly as section 9 defines.
10. Keep `selected_candidate_ref = none` and reject semantic closure.
11. Implement the immutable-semantic-basis/OQ-material/presentation-only
    staleness partition, response invalidation, and exact same-pin resume.
12. Implement contiguous `M` and `Q` sequences, one active request, and
    idempotent response/T5.3/run-control/recovery transactions.
13. Implement surgical carry and procedural restriction overlays over the
    exact reviewed scope without relation mutation, source-wide invalidation,
    S5 disposition, or S6 evidence-role assignment.
14. Exclude comments and observations from every semantic producer, reviewer,
    candidate-generation, synthesis, and projection context.
15. Amend the Core run-control, artifact, pipeline, runbook, prompt, template,
    checker-specification, and manual-procedure surfaces required by the
    adopted Slice 5 coordinated barrier.
16. Activate the future 1.5 cumulative capability without changing 1.0–1.4
    semantics.
17. Implement deterministic checker rules, positive/negative fixtures,
    mutation tests, process tests, semantic challenges, and replay cases.
18. Regenerate locked runtime JavaScript only from canonical TypeScript after
    authorized implementation.
19. Preserve Core/adapter ownership. Any Loa change must be limited to generic
    presentation, durable transaction, pause/resume, and schema-validation
    mechanics for the Core-owned category.
20. Obtain a fresh independent implementation audit before any implementation
    claim stronger than structural readiness.

### 16.2 MUST PRESERVE

- Human procedure never becomes semantic authorship.
- Free text remains non-operative except the exact-byte observation recording
  field’s narrow persistence effect.
- `cannot-determine` never becomes semantic `PASS`.
- T5.1/T5.2 and C1 relation bytes remain immutable at the adopted barriers.
- Material-impact review remains distinct from T5.2 review and human
  procedural authority.
- Ambiguity consequences have finite reviewed blast radii.
- The restriction overlay remains distinct from S5 dispositions and S6
  evidence roles.
- Human comments and observations remain outside semantic worker/reviewer
  context.
- One request has at most one response, one response has one action, one
  request is active, `M` and `Q` are contiguous, and IDs are never reused.
- Response persistence, T5.3 append, run-control advancement, and Q creation
  remain idempotent and crash-recoverable.
- Unresolved does not mean ignored or source-wide rejection.
- Existing S0, S8, S13, P1, and P3 gates retain their own categories.
- Mandatory human gates remain human.
- Existing correction/effective-state, lineage, relation, source-walk,
  successor-run, and projection boundaries remain controlling.
- Deterministic checks remain structural.
- Fresh semantic review remains semantic.
- Producers do not verify their own subjects where fresh review is required;
  human authority is not semantic review; workers do not write canonical
  ledgers; the orchestrator remains the sole durable writer; and verifier
  output is not human authority.
- Manual mode remains the only sanctioned execution path unless separately
  changed by authoritative evidence.
- Interaction terminology never implies agent sanction.
- Current 1.4 runs and fixtures are not retroactively reinterpreted.
- Core owns semantics; adapters remain host-mechanical.
- Structural implementation, checker PASS, replay, semantic validation,
  sanction, acceptance, production readiness, golden status, and v1 remain
  separate claims.

### 16.3 LATER

- Expanded all-stage receipt schema and fields.
- `guided-auto` runtime behavior.
- `stage-review` runtime behavior.
- Richer all-stage interaction UX.
- Exact qualitative forecast vocabulary, schema, renderer, and evaluation.
- Full Aleph Corpus Graph schema and checker/runtime design.
- Sophisticated adaptive questioning.
- Numeric probability or calibration.
- Embeddings, semantic ranking, or graph ranking.
- Elaborate visualization or UI.
- General post-`ACCEPTED` correction.
- Projection contract changes.
- Full procedural-default automation policy.
- Cross-run reuse.
- Generic relation correction or relation lineage.
- General checkpoint, rollback, or rewind architecture.

### 16.4 SPECULATIVE

- Whether future evidence supports automating a bounded subset of procedural
  actions.
- Whether future Aleph Corpus Graph implementations need a dedicated artifact
  or can compose existing source-walk/packet records.
- Whether qualitative forecasts earn continued inclusion after real-run
  evaluation.
- Whether a future UI benefits from graph or blast-radius visualization.

None of these speculative items may enter the first OQ-01 implementation
without separate authority.

## 17. Required future verification

### 17.1 Deterministic structural checks

Later checks must verify at least:

- exact material-impact subject format, canonical bytes, digest, `M` identity,
  retained path, and T5.2 assessment-row binding;
- exact T5.2 ambiguity-verdict byte reference and exact distinct
  material-impact verifier target/reference;
- `upheld` material-impact verdict before Class B continuation or Class C
  request creation;
- exact legal affected-ID kinds, same-run existence, legal/current state, and
  eligible canonical relation membership;
- exact operative-scope ordering, set/row equality, coverage, uniqueness, and
  contradiction refusal;
- exact deterministic allowed-action and consequence projection;
- exact request/response formats and key sets;
- request/response identity grammar and numeric agreement;
- exact request and response digest recomputation;
- exact authority-subject recomputation;
- deep equality between material-impact subject, authority-subject copies,
  and any non-operative request presentation;
- exact human authority kind and identity presence;
- selected action membership in the offered set;
- one action only;
- observation/comment exact-byte base64 and digest;
- observation present only when required;
- all free text non-operative;
- six-value action vocabulary;
- `selected_candidate_ref = none`;
- contiguous `authority_seq`;
- exact assessment binding;
- exact response resolution through `authority_ref`;
- exact request/response resolution through `closure_provenance`;
- no stale response after changed basis;
- no C2 finalization with a Class C ambiguity lacking a legal
  progression-enabling terminal action;
- no C2 finalization after `request-successor-corpus-run`;
- no C2 finalization after a nonterminal final action;
- no positive action under run formats 1.0–1.4;
- one active request at a time in ascending ambiguity order;
- contiguous single-headed material-impact `M` and request `Q` sequences;
- no human observation/comment reference in semantic worker or review
  subjects; and
- current relation bytes remain structurally identical to the C1 basis.

These checks do not decide semantic materiality, action wisdom, source meaning,
or authority legitimacy beyond declared structural identity.

### 17.2 Process and temporal tests

Later process tests must prove:

- request preparation occurs only at S4-C2;
- C1 is never rerun or mutated;
- request/response transactions recover after interruption;
- duplicate response replay is idempotent;
- nonterminal actions create the next request only after basis verification;
- material-impact revision creates M+1 and Q+1 exactly once without changing
  T5.2 `A`;
- presentation-only replacement creates Q+1 exactly once without changing
  material or semantic basis;
- an immutable T5.2/C1 defect blocks before any replacement request;
- no fake human response is produced;
- successor-run request does not admit bytes to the predecessor;
- carry and restriction enforcement are surgical;
- restriction remains separate from S5 and S6 writes;
- semantic bundles withhold human comments and observations;
- resume returns to the exact unresolved basis; and
- changed OQ-owned basis forces re-presentation.

### 17.3 Semantic checks

Fresh semantic challenges must test:

- false materiality;
- missed materiality;
- over-broad blast radius;
- omitted affected object;
- source-wide restriction from a local ambiguity;
- false narrower-claim preservation;
- failure to preserve a valid narrower claim;
- conclusion-biased impact inventory;
- outside knowledge in the unresolved statement;
- commentary interpreted as a referent;
- observation laundered into evidence;
- carry treated as ignore;
- restriction treated as rejection;
- restriction treated as an S6 evidence-role assignment;
- inspect treated as closure; and
- ambiguity leaking into projection as resolved prose.

### 17.4 Positive fixture obligations

Later positive fixtures must include:

- Class A local resolution with no authority request;
- Class B unresolved/non-material with an upheld empty-scope material-impact
  subject and no authority request;
- Class C with a distinct upheld material-impact subject and exact Core action
  projection;
- `carry-unresolved`;
- `restrict-downstream-use` with unaffected neighboring material retained;
- `inspect-source` followed by a later terminal action;
- `block-at-current-barrier` followed by same-pin resume;
- `request-successor-corpus-run` with unchanged predecessor bytes;
- `record-human-observation` followed by a separate terminal response;
- optional comment preserved but non-operative;
- material-impact M+1 revision with unchanged T5.2/C1 and Q+1; and
- presentation-only Q+1 replacement with unchanged authority-subject digest.

### 17.5 Negative fixture and mutation obligations

Later negatives must include:

- human-selected candidate or non-`none` candidate field;
- missing or stale material-impact subject/verdict;
- material-impact verifier target bound to the T5.2 subject instead of the
  distinct material-impact subject;
- producer-authored allowed action or consequence divergence;
- request presentation scope diverging from the authority subject;
- `SRC-*`, `AMB-*`, `RC-*`, `REF-*`, `STM-*`, or unknown operative ID kind;
- non-existent, wrong-run, non-current, or ineligible operative ID;
- duplicate or contradictory impact tuple;
- affected-ID/set/row coverage mismatch;
- comment inferred as action or referent;
- observation used as support;
- observation or comment included in a semantic worker/reviewer bundle;
- stale response after an OQ material-impact revision;
- changed request presentation with reused old request digest;
- T5.2 candidate/search/carry/affected-relation change followed by same-run
  replacement request;
- T5.1/T5.2/C1 mutation during authority interaction;
- two actions in one response;
- unsupported free-text action;
- conflicting terminal actions;
- nonterminal response treated as C2 completion;
- successor-run request treated as current-run continuation;
- carry dropping the unresolved dependency;
- restriction erasing a source or unrelated claim;
- inspect treated as closure;
- model identity used as human authority;
- automated fake human response;
- biased goal suppressing contrary evidence;
- routine stage receipt treated as gate;
- OQ-01 response repurposed as S8 or S13 authority;
- post-freeze bytes admitted to the current run;
- `cannot-determine` converted to `PASS`;
- T5.3 action mutating a C1 relation;
- late ambiguity silently reopening C2; and
- current 1.4 fixture rejected for lacking future receipt or Corpus Graph
  artifacts.

## 18. Proposal self-audit

This repair self-audit is not independent review.

| ID | Attack | Result | Exact control |
|---|---|---|---|
| R01 | Can authority open without a separately identifiable fresh material-impact review? | CONTROLLED | §§4.2–4.5 require the retained M subject, exact target, byte-digested VER ref, and `upheld` verdict. |
| R02 | Can the material-impact reviewer select a referent? | CONTROLLED | §4.1 forbids candidate/referent change; the subject has no selected-candidate field. |
| R03 | Can allowed actions be freely invented by the producer? | CONTROLLED | §4.4 defines the exact Core projection and checker equality rule. |
| R04 | Can duplicated request scope diverge from reviewed canonical scope? | CONTROLLED | §§3.5 and 6.4 establish one canonical scope and exact deep-equal non-operative projection. |
| R05 | Can an affected ID be non-existent at S4-C2? | CONTROLLED | §3.5 requires existing same-run legal/current resolution. |
| R06 | Can speculative future IDs appear in operative scope? | CONTROLLED | §3.5 closes kinds to `PKT`, `CC`, and eligible canonical `REL`. |
| R07 | Can duplicate or contradictory impact rows survive? | CONTROLLED | §3.5 defines unique tuple, coverage, and contradiction refusal rules. |
| R08 | Can a T5.2 semantic-basis change create a same-run replacement request? | CONTROLLED | §10.1 requires fail-closed correction/successor handling and forbids replacement requests. |
| R09 | Can candidate/search/carry/REL changes cause T5.2 mutation? | CONTROLLED | §§5.3 and 10.1 prohibit T5.1/T5.2/C1 mutation and new same-run assessment sequences. |
| R10 | Can OQ-only impact correction occur without fresh material-impact review? | CONTROLLED | §10.2 requires M+1, a complete new subject, digest, and fresh upheld verdict. |
| R11 | Can a presentation-only change mutate semantic basis? | CONTROLLED | §10.3 leaves semantic and material subjects unchanged and changes only request bytes/Q. |
| R12 | Can `restrict-downstream-use` become S5 rejection? | CONTROLLED | §§8.2 and 15.4 define a separate overlay and require independent S5 judgment. |
| R13 | Can it become S6 evidence-role assignment? | CONTROLLED | §§8.2 and 15.5 prohibit role/support mutation and require independent S6 judgment. |
| R14 | Can human observation enter semantic worker context? | CONTROLLED | §8.6 excludes comments/observations from every semantic producer/reviewer bundle and subject. |
| R15 | Can Q sequencing fork or duplicate after crash? | CONTROLLED | §10.4 requires one active request, contiguous Q, exactly-once advancement, and idempotent recovery. |
| R16 | Can stage-receipt UX remain falsely blocking for Slice 5? | CONTROLLED | §§12.2, 12.4, and 16 move expanded receipts/modes to `LATER`. |
| R17 | Can `guided-auto` be read as sanctioned agent execution? | CONTROLLED | §12.4 leaves the mode unactivated, separates dimensions, and retains manual-only sanction. |
| R18 | Can forecast language be mistaken for evidence support? | CONTROLLED | §11 removes the exact vocabulary and first-implementation forecast field; detailed design is `LATER`. |
| R19 | Can human authority still select any candidate? | CONTROLLED | §§2.2 and 9.2 require `selected_candidate_ref = none` for every legal action. |
| R20 | Can current 1.4 behavior be retroactively invalidated? | CONTROLLED | §§9.5, 12.4, and 14.3 preserve 1.0–1.4 behavior and non-retroactivity. |

No repair-scope doctrine issue is marked OPEN by this non-independent
self-audit. That is not adoption evidence. The complete successor bytes still
require fresh independent design audit.

Implementation details remain OPEN until a separately authorized
implementation, including exact code paths, parser changes, transaction
integration, fixture bytes, checker diagnostics, generated runtime parity, and
host presentation.

## 19. Explicit non-goals

This proposal does not:

- adopt itself;
- implement Slice 5;
- activate future 1.5 behavior;
- claim K2.17 implementation;
- modify checker source;
- modify runtime JavaScript;
- modify adapter source;
- modify fixtures;
- modify package files;
- resolve any live run gate;
- begin Slice 6;
- redesign the entire pipeline;
- design the full Aleph Corpus Graph;
- implement expanded all-stage receipts or interaction modes;
- implement adaptive questioning;
- activate an exact forecast vocabulary;
- implement numeric forecasting;
- implement policy automation;
- implement general correction;
- change projection; or
- declare v1.

## 20. Status boundary

If published in a draft PR, the maximum status is:

- PROPOSED OQ-01 AUTHORITY/INTERACTION DOCTRINE
- PROPOSED — NOT ADOPTED
- SUCCESSOR REPAIR NOT YET INDEPENDENTLY AUDITED
- RESOLVES OQ-01 ONLY IF LATER ADOPTED
- FRESH INDEPENDENT DESIGN AUDIT REQUIRED
- HUMAN ADOPTION REQUIRED AFTER AUDIT
- NO SLICE 5 IMPLEMENTATION
- NO MERGE
- NO SLICE 6
- T5.3 REMAINS INERT IN CURRENT AUTHORITY
- FUTURE 1.5 BEHAVIOR NOT ACTIVE
- K2.17 NOT IMPLEMENTED
- ALEPH CORPUS GRAPH DETAILED DESIGN DEFERRED
- NOT REPLAY-VALIDATED
- NOT SEMANTICALLY VALIDATED
- NOT AGENT-SANCTIONED
- NOT ACCEPTED
- NOT PRODUCTION-READY
- NOT GOLDEN
- NOT ALEPH V1

Manual mode remains the only sanctioned execution path.

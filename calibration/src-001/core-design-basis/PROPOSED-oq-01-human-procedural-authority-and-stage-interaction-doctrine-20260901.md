# OQ-01 Human Procedural Authority and Stage Interaction Doctrine

Date: 2026-09-01

Status: PROPOSED — FRESH INDEPENDENT DESIGN AUDIT AND HUMAN ADOPTION REQUIRED

Decision class: bounded authority and architecture proposal

Maximum present claim:

`PROPOSED OQ-01 AUTHORITY/INTERACTION DOCTRINE`

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

An ambiguity is materially consequential only when the reviewed authority
subject contains at least one `impact_row` with:

1. one exact affected durable ID;
2. one operation from the closed vocabulary below;
3. one exact downstream contract or Definition-of-Done reference; and
4. one stated consequence that follows if no unique interpretation exists.

Closed `impact_kind` vocabulary:

- `load-bearing-reasoning`;
- `unique-relation-or-referent`;
- `disposition-validity`;
- `contradiction-or-reconciliation-strength`;
- `interpretation-dependent-synthesis`; and
- `required-barrier-dod`.

The first implementation must not accept a free-prose impact kind.

An `impact_row` is structurally shaped as:

```json
{
  "affected_id": "PKT-NNNN|CC-NNNN|REL-NNNN|RC-NN|REF-NN|STM-N|other-Core-id",
  "impact_kind": "one closed value",
  "operation": "the exact proposed downstream use",
  "requirement_ref": "Core path plus heading, DoD item, or durable contract ID",
  "consequence_if_unresolved": "bounded consequence statement"
}
```

At minimum, a material row is required when ambiguity affects whether Aleph
may safely:

- use a claim in load-bearing reasoning;
- select or preserve a unique relation or referent;
- perform a disposition whose validity depends on the resolution;
- state a contradiction or reconciliation at a stronger level;
- synthesize a statement that requires the unresolved interpretation; or
- proceed past a barrier whose Definition of Done requires resolution.

The complete `impact_rows` array is part of the exact semantic-review and
authority basis. A changed row, added row, removed row, or changed affected ID
requires fresh review and a new authority request.

### 3.5 Bounded blast radius

The request must distinguish:

- `affected_durable_ids`: the finite, reviewed set directly governed by this
  request;
- `impact_rows`: the exact operations and requirements affected; and
- `unaffected_boundary`: IDs or scope statements not procedurally restricted
  by this request.

An ID omitted from `affected_durable_ids` is not thereby declared semantically
unaffected in all possible respects. It is only outside this request’s
operative blast radius unless a separate reviewed impact row later includes
it.

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

## 4. Exact authority subject

### 4.1 Subject format

The proposed authority-subject format is:

`aleph-internal-ambiguity-procedural-subject/v1`

It is UTF-8 canonical compact JSON with keys in this exact order:

```json
{"format":"aleph-internal-ambiguity-procedural-subject/v1","decision_category":"internal-ambiguity-procedural-decision","run_id":"RUN-slug","ambiguity_id":"AMB-NNNN","assessment_seq":1,"review_subject_digest":"sha256:...","reviewed_by":"VER-NNNN","reviewed_verdict":"upheld","prior_indeterminate_review_refs":[],"resolution_state":"unresolved","candidate_state":"single|multiple|null-no-candidate|null-cannot-determine","candidate_refs":[],"carry_state":"none|explicit","affected_relation_ids":[],"affected_durable_ids":[],"source_locators":[],"unresolved_statement":"...","impact_rows":[],"unaffected_boundary":[],"allowed_actions":[]}
```

Rules:

- `ambiguity_id` and `assessment_seq` name the exact current reviewed T5.2
  assessment.
- `review_subject_digest` and `reviewed_by` bind the exact adopted Slice 5
  ambiguity-review subject and verifier record.
- `reviewed_verdict` must be `upheld` for the explicit unresolved assessment
  presented to authority.
- A preceding raw reviewer `cannot-determine` is retained in
  `prior_indeterminate_review_refs`; it is not rewritten as `upheld`. The
  later `upheld` verdict authorizes only the explicit unresolved T5.2 subject.
- `candidate_refs` is copied exactly from the bound reviewed assessment. It is
  informational for consequence understanding and is never selectable by the
  human.
- `affected_relation_ids` is the exact immutable C1 relation set named by the
  assessment. The authority subject does not mutate it.
- `affected_durable_ids`, `source_locators`, `impact_rows`, and
  `unaffected_boundary` are canonical arrays in deterministic order.
- `source_locators` must reopen exact frozen source, packet, claim, relation,
  and review basis where applicable.
- `unresolved_statement` describes what remains unresolved without supplying
  an answer.
- `allowed_actions` is an ordered subset of the six actions in section 7.
- Free commentary, forecasts, recommendations, and human observations are not
  part of this subject.

The `authority_subject_digest` is:

```text
sha256:<lowercase hex of the exact UTF-8 canonical compact JSON bytes>
```

Any changed subject field creates a different digest.

### 4.2 Material review requirement

The impact inventory is semantic judgment, not deterministic inference.

Before a Class C request may be prepared, a fresh semantic review must
challenge:

- whether the ambiguity is actually unresolved;
- whether each named durable ID is affected;
- whether each `impact_kind` and requirement reference is accurate;
- whether the blast radius is over-broad;
- whether a narrower unaffected claim or operation remains legal;
- whether any impact was inferred by graph reachability rather than reviewed
  directly; and
- whether conclusion bias or outside knowledge affected the inventory.

Only an `upheld` exact subject may be presented. A `refuted` subject must be
revised or rejected. A `cannot-determine` impact review cannot authorize the
request; it remains a blocking semantic finding until an explicit bounded
unresolved impact subject receives its own `upheld` review or the run stops.

## 5. Exact stage and barrier placement

### 5.1 No new stage and no global gate

This proposal adds no new S-stage and no gate at every stage.

The OQ-01 authority interaction is located:

> inside adopted S4-C2, after the exact unresolved ambiguity assessment and
> material impact subject have valid fresh review, and before the
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
2. complete ambiguity production and exact semantic review;
3. serialize a complete reviewed T5.1/T5.2 state under a transactionally
   valid S4-C2-in-progress condition;
4. classify each unresolved ambiguity as A, B, or C;
5. for each Class C ambiguity, open one bounded request in ascending numeric
   `AMB-*` order;
6. permit at most one active authority request at a time;
7. append each valid response as one T5.3 row without changing T5.1, T5.2, or
   any relation row; and
8. retain the S4-C2 finalization marker only when every Class C ambiguity has
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
same unchanged basis. Request sequences are never reused.

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

The durable request contains at least:

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
  "review_subject_digest": "sha256:...",
  "reviewed_by": "VER-NNNN",
  "fresh_review_verdict": "upheld",
  "prior_indeterminate_review_refs": [],
  "authority_subject": {},
  "authority_subject_digest": "sha256:...",
  "affected_durable_ids": [],
  "source_locators": [],
  "what_remains_unresolved": "...",
  "downstream_blast_radius": [],
  "unaffected_boundary": [],
  "allowed_actions": [],
  "action_consequences": [],
  "forecast": null,
  "required_authority": {
    "kind": "human",
    "identity": "exact designated authority identity"
  },
  "prepared_by": "human:<actor-slug>|invocation:<id>",
  "requested_at": "canonical timestamp"
}
```

The request must let the human understand the consequence without rebuilding
the whole run, while retaining exact source re-entry.

The response authority identity must exactly match `required_authority`.
Changing the designated authority changes the request bytes and requires a new
request.

`action_consequences` must state, for every offered action:

- whether the current request closes;
- whether S4-C2 may eventually finalize;
- what exact restrictions or carry remain;
- whether the current run stays blocked;
- whether a successor run is required; and
- which unaffected IDs remain outside the action.

An action that cannot legally satisfy the exact downstream requirement must
not be offered as progression-enabling. Human authority does not waive Core
DoD.

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
  `allowed_actions`.
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
- prohibit only the exact impact-row operations bound in the request; and
- retain unaffected claims, packets, source regions, relations, and uses.

It does not:

- discard the source;
- discard the topic;
- discard unaffected claims;
- mark evidence bad;
- create rejection;
- choose a referent; or
- mutate a relation or disposition automatically.

The restriction set is the exact reviewed set in the authority subject.
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
- `authority_subject_digest`: exact section 4 subject digest.
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

### 10.1 Material basis change

An existing request or response becomes insufficient when any of these
change:

- ambiguity expression or exact source basis;
- assessment sequence;
- review-subject digest;
- reviewer identity or operative verdict;
- candidate or typed-null state;
- carry state;
- affected relation set;
- affected durable ID set;
- impact row;
- source locator;
- unresolved statement;
- unaffected boundary;
- allowed action set; or
- action consequence.

The old artifacts remain immutable history. They cannot authorize the changed
basis.

The changed basis requires:

- fresh semantic review where applicable;
- a new authority-subject digest;
- a new request identity;
- re-presentation to the human; and
- a new actual human response.

This applies the adopted correction principle: material gate-basis change
requires renewed presentation, never silent carry-forward.

### 10.2 Request-presentation change

A changed optional forecast, recommendation, display rendering, or other
presentation content changes the request bytes and request digest even when
the material subject digest is unchanged.

A response binds the exact request it was shown. It cannot be replayed against
a differently presented request.

### 10.3 Replay expectations

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
  and
- C1 relation bytes remain byte-identical throughout every interaction.

### 10.4 Resume behavior by action

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

Forecasting is optional. A valid ambiguity review and authority request do not
require it.

The first proposed closed qualitative vocabulary is:

- `favored`;
- `plausible`;
- `weakly-supported`; and
- `cannot-rank`.

No numeric probability, percentage, score, logit, or disguised numeric band is
legal in the first contract.

Every forecast must be labeled:

`NON-EVIDENTIARY`

A forecast may describe a bounded expected operational consequence or may
qualitatively summarize already reviewed alternatives. It must cite its
target and basis. It may not:

- change support;
- change evidence roles;
- change disposition;
- change a reviewer verdict;
- change deterministic validity;
- resolve ambiguity;
- add a candidate;
- change the allowed action set; or
- automatically select a human action.

Forecast content is excluded from `authority_subject_digest` but included in
the exact request bytes and `request_digest`.

## 12. Minimum stage-interaction doctrine

### 12.1 Three distinct concepts

Aleph must distinguish:

1. `stage receipt`;
2. `stage interaction / operational choice`; and
3. `human authority gate`.

Neither a receipt nor a routine continue action is human authority.

### 12.2 Stage receipt

Every completed stage must persist an inspectable receipt or equivalent
durable stage-completion summary.

The existing append-only `run-log.md` stage-exit record is the canonical
minimum location; a future implementation may add a machine twin but must not
make the twin the sole record.

Each stage receipt must state:

- `stage`;
- `completed_at`;
- `what_the_stage_did`;
- `counts_and_results`;
- `unresolved_findings`;
- `blocking_findings`;
- `current_research_goal_or_question`;
- `what_changes_in_the_next_stage`;
- `human_action_required`, one of:
  `none`, `routine-stage-review`, `authority-gate`, or `blocker`; and
- exact artifact and DoD references.

A stage receipt is informational and procedural evidence of progress. It is
not authorization, acceptance, semantic proof, or a human response.

Existing run-format 1.4 artifacts are not invalid because they predate this
future receipt contract.

### 12.3 Routine interaction

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

### 12.4 Interaction modes

The proposed `interaction_mode` vocabulary is:

- `guided-auto`; and
- `stage-review`.

This vocabulary is separate from existing execution `mode =
agent|manual|hybrid`.

For a future newly activated format, `interaction_mode` is persisted in run
control before the first routine post-S0 transition. If the user makes no
selection, the recorded value is `guided-auto`. A later mode change is an
append-only operational interaction, not authority. Historical 1.4 runs are
not assigned a new field or reinterpreted by default.

#### `guided-auto`

`guided-auto` is the proposed default.

It means:

- every stage receipt is persisted;
- routine legal stage transitions continue automatically;
- the human is not forced to answer at every stage;
- mandatory existing authority gates interrupt;
- Class C OQ-01 procedural decisions interrupt;
- contamination, budget, capability, and other existing blockers interrupt;
- a routine transition never fabricates a human response; and
- automatic continuation never means semantic acceptance.

#### `stage-review`

`stage-review` means:

- persist every stage receipt;
- pause after each completed stage receipt;
- offer bounded operational choices to inspect, continue, pause, or stop; and
- resume only after an actual operational choice.

Clicking or recording `continue` does not create stronger authority.

The pause is a routine interaction, not a new mandatory human-authority gate.

### 12.5 Future automation hook

A future separately adopted automation-policy doctrine may authorize bounded
procedural defaults.

This proposal does not define that policy.

For the minimum OQ-01 implementation:

- routine `guided-auto` stage continuation may be automated;
- existing mandatory authority gates remain human;
- Class C OQ-01 decisions remain human-interactive; and
- no automation may create a fake human identity or response.

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
- changed authority basis requires re-presentation;
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

### 15.5 S8 external referents

OQ-01 does not supply an external referent.

`request-successor-corpus-run` preserves the current-run boundary. A later
S8 `REF-*` record remains separately governed and is never auto-created from
an ambiguity action.

### 15.6 S13 and projection

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
2. Implement the request, response, text-blob, digest, ID, `authority_ref`,
   and `closure_provenance` contracts.
3. Implement the exact six-action vocabulary and one-action cardinality.
4. Implement S4-C2-local request ordering, blocking, C2 completion, and
   no-new-stage behavior.
5. Implement the legal S4-C2-in-progress retained-state distinction without
   weakening the adopted partial-state fail-closed rule.
6. Activate positive T5.3 rows exactly as section 9 defines.
7. Keep `selected_candidate_ref = none` and reject semantic closure.
8. Implement request staleness, re-presentation, response invalidation, and
   exact same-pin resume.
9. Implement surgical carry/restriction effects over exact reviewed durable
   IDs without relation mutation or source-wide invalidation.
10. Amend the Core run-control, artifact, pipeline, runbook, prompt, template,
    checker-specification, and manual-procedure surfaces required by the
    adopted Slice 5 coordinated barrier.
11. Implement stage receipts and the `guided-auto` / `stage-review`
    interaction distinction where required for new-format runs.
12. Activate the future 1.5 cumulative capability without changing 1.0–1.4
    semantics.
13. Implement deterministic checker rules, positive/negative fixtures,
    mutation tests, process tests, semantic challenges, and replay cases.
14. Regenerate locked runtime JavaScript only from canonical TypeScript after
    authorized implementation.
15. Preserve Core/adapter ownership. Any Loa change must be limited to generic
    presentation, durable transaction, pause/resume, and schema-validation
    mechanics for the Core-owned category.
16. Obtain a fresh independent implementation audit before any implementation
    claim stronger than structural readiness.

### 16.2 MUST PRESERVE

- Human procedure never becomes semantic authorship.
- Free text remains non-operative except the exact-byte observation recording
  field’s narrow persistence effect.
- `cannot-determine` never becomes semantic `PASS`.
- T5.1/T5.2 and C1 relation bytes remain immutable at the adopted barriers.
- Ambiguity consequences have finite reviewed blast radii.
- Unresolved does not mean ignored or source-wide rejection.
- Existing S0, S8, S13, P1, and P3 gates retain their own categories.
- Mandatory human gates remain human.
- Existing correction/effective-state, lineage, relation, source-walk,
  successor-run, and projection boundaries remain controlling.
- Deterministic checks remain structural.
- Fresh semantic review remains semantic.
- Manual mode remains the only sanctioned execution path unless separately
  changed by authoritative evidence.
- Current 1.4 runs and fixtures are not retroactively reinterpreted.
- Core owns semantics; adapters remain host-mechanical.
- Structural implementation, checker PASS, replay, semantic validation,
  sanction, acceptance, production readiness, golden status, and v1 remain
  separate claims.

### 16.3 LATER

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

- exact request/response formats and key sets;
- request/response identity grammar and numeric agreement;
- exact request and response digest recomputation;
- exact authority-subject recomputation;
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
- stage receipt required fields for newly activated formats;
- interaction mode vocabulary and no routine interaction in authority
  sign-offs; and
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
- stage-review pause cannot become an authority response;
- guided-auto cannot cross an authority gate;
- no fake human response is produced;
- successor-run request does not admit bytes to the predecessor;
- carry and restriction enforcement are surgical;
- resume returns to the exact unresolved request; and
- changed basis forces re-presentation.

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
- forecast influencing review or action;
- commentary interpreted as a referent;
- observation laundered into evidence;
- carry treated as ignore;
- restriction treated as rejection;
- inspect treated as closure; and
- ambiguity leaking into projection as resolved prose.

### 17.4 Positive fixture obligations

Later positive fixtures must include:

- Class A local resolution with no authority request;
- Class B unresolved/non-material with no authority request;
- `carry-unresolved`;
- `restrict-downstream-use` with unaffected neighboring material retained;
- `inspect-source` followed by a later terminal action;
- `block-at-current-barrier` followed by same-pin resume;
- `request-successor-corpus-run` with unchanged predecessor bytes;
- `record-human-observation` followed by a separate terminal response;
- optional comment preserved but non-operative;
- optional qualitative forecast with no semantic effect;
- guided-auto routine transitions with receipts; and
- stage-review routine pause/continue without authority.

### 17.5 Negative fixture and mutation obligations

Later negatives must include:

- human-selected candidate or non-`none` candidate field;
- comment inferred as action or referent;
- observation used as support;
- stale response after any material basis change;
- changed request presentation with reused old request digest;
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
- forecast changing disposition or review;
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

This is a self-audit, not an independent audit.

| # | Attack | Result | Control |
|---|---|---|---|
| 1 | Can a human semantic guess become evidence? | CONTROLLED | The category is procedural only; no candidate selection; observations/comments are non-evidentiary. |
| 2 | Can optional free text become an inferred action? | CONTROLLED | Exactly one operative `selected_action`; free text cannot supply another action. |
| 3 | Can a stale authority response apply after review basis changes? | CONTROLLED | Subject and request digests bind the response; any material change requires re-presentation. |
| 4 | Can `record-human-observation` accidentally resolve ambiguity? | CONTROLLED | It is nonterminal, exact-byte, and explicitly NON-EVIDENTIARY; T5.2 remains unresolved. |
| 5 | Can `carry-unresolved` silently become “ignore”? | CONTROLLED | Exact affected dependencies remain visible and required downstream. |
| 6 | Can `restrict-downstream-use` erase an entire source? | CONTROLLED | Restriction applies only to reviewed impact rows and affected IDs. |
| 7 | Can `inspect-source` accidentally count as closure? | CONTROLLED | It is nonterminal and creates a later request after read-only inspection. |
| 8 | Can multiple terminal actions conflict? | CONTROLLED | One action per response; one terminal action per assessment; replacement requires separate correction doctrine. |
| 9 | Can automation impersonate a human authority response? | CONTROLLED | OQ-01 remains human-interactive; no fake human identity or response is legal. |
| 10 | Can a forecast affect evidence/disposition? | CONTROLLED | Forecast is optional, qualitative, NON-EVIDENTIARY, and excluded from the material subject. |
| 11 | Can a biased user goal suppress contrary evidence? | CONTROLLED | Goal-conditioned relevance is allowed; conclusion-conditioned evidence selection is forbidden. |
| 12 | Can a stage receipt accidentally become a mandatory gate? | CONTROLLED | Receipt, routine interaction, and authority gate are distinct concepts. |
| 13 | Can the design conflict with existing S0/S8/S13 authority? | CONTROLLED | OQ-01 is S4-C2-local and cannot supply or replace those gate categories. |
| 14 | Can the proposal improperly extend the frozen corpus? | CONTROLLED | New bytes require a successor run; observations remain outside evidence. |
| 15 | Can an unresolved ambiguity be converted to PASS? | CONTROLLED | No action changes semantic review or T5.2 unresolved state. |
| 16 | Can OQ-01 semantics leak into projection? | CONTROLLED | Projection changes are excluded; unresolved/restricted state must remain visible. |
| 17 | Can the Corpus Graph paragraph make current 1.4 runs invalid? | CONTROLLED | Explicit non-retroactivity and separate future-slice boundary. |
| 18 | Can this proposal authorize Slice 5 implementation before adoption? | CONTROLLED | Status is PROPOSED; audit, adoption, and separate implementation work remain required. |
| 19 | Can an ambiguity action mutate canonical relations contrary to S4-C1 immutability? | CONTROLLED | Every action is read-only over the C1 relation set; defects block. |
| 20 | Can late ambiguity discovery violate adopted Slice 5 barriers? | CONTROLLED | At/after C2 discovery blocks and uses only existing correction or successor-run doctrine. |

No doctrine-level attack above remains OPEN in this proposal.

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
- implement adaptive questioning;
- implement numeric forecasting;
- implement policy automation;
- implement general correction;
- change projection; or
- declare v1.

## 20. Status boundary

If published in a draft PR, the maximum status is:

- PROPOSED OQ-01 AUTHORITY/INTERACTION DOCTRINE
- PROPOSED — NOT ADOPTED
- RESOLVES OQ-01 ONLY IF LATER ADOPTED
- FRESH INDEPENDENT DESIGN AUDIT REQUIRED
- HUMAN ADOPTION REQUIRED AFTER AUDIT
- NO SLICE 5 IMPLEMENTATION
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

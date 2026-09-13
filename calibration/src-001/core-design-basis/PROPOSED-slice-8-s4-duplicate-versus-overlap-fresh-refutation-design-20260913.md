# Slice 8 — S4 Duplicate-Versus-Overlap Fresh Refutation

Date: 2026-09-13

Status: PROPOSED — HUMAN AUTHORITY ADOPTION REQUIRED

Decision class: bounded calibration implementation design; repository administration

This is a producer-authored design proposal, not adoption, implementation
authorization, implementation, independent audit, or execution evidence.
Every new schema, predicate, prompt amendment, and test below is proposed.
Existing adopted contracts control until this exact proposal is adopted and
implementation is separately authorized. The bounded manual-profile question
in section 17 also requires clarification before implementation; an
implementer may not guess its answer.

## 1. Exact starting identity and governing authority

The producer verified these identities before authoring:

| Item | Verified value |
| --- | --- |
| Repository | `0xHoneyJar/loa-aleph` |
| Origin | `https://github.com/0xHoneyJar/loa-aleph.git` |
| Checkout | `/home/eileenspectremoon/loa-dev/loa-aleph` |
| Branch | `agent/slice-08-duplicate-overlap-design-20260913` |
| HEAD / canonical Slice 7 merge | `31c0cdd6b0757a75f72d249cbad4ebc8b2d83911` |
| HEAD tree | `990bc7ac725b21798c9c23406ce2b69a000dc884` |
| Index and working tree | Clean, including nonignored untracked files; no assume-unchanged/skip-worktree entries |
| Ancestry | HEAD is the exact required merge, not a substituted base |
| Preserved adapter branch | `agent/loa-adapter-release` at `b9e2db742a087b8ae659ec39e476ed5e240cfa1f`, tree `f9daba8ba3e9b33e2895265a1427d61829a90722` |
| Preserved stash | `e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8`, tree `a71318a42d8dca812f7d57161d21e4d3bc1b388b` |

The starting commit descends from the retained Slice 1 merge
`98d0b970601534276a58add14128d740407d8909`, Slice 2 merge
`fc6f161952e90e23723845e2de700add7455ab1c`, Slice 3 merge
`a00e5ee4298f23d60352583904cf42d29caaaac7`, Slice 4 merge
`e136a3fbbf8bc503f3e65e9850e9289f29531981`, OQ-01 merge
`7944964393aab98416772f6a37be967d9ffdece2`, Slice 5 merge
`41fe5cf001d7264a073af3832def3de740fd5f9f`, and Slice 6 merge
`8604d93a86353b846b955b0a063ff9ac7d9aeea4`.

Authority was read from the current checkout:

- `AGENTS.md`, `README.md`, accepted Decisions 0001–0004, the build handoff,
  and `core.manifest.json`;
- [adopted calibration basis](ADOPTED-architecture-decision.md) and its exact
  [proposal](PROPOSED-architecture-decision.md);
- [canonical slice plan](SRC-001-implementation-slice-plan-20260813.md),
  [independent calibration decision](SRC-001-independent-calibration-delta-architecture-decision-20260813.md),
  and [correction addendum](SRC-001-calibration-delta-correction-addendum-20260813.md);
- [correction/effective-state adoption](ADOPTED-correction-and-effective-state-decision-20260815.md);
- adopted Slice 3–7 proposals and their separate adoption records;
  [OQ-01 adoption](ADOPTED-oq-01-human-procedural-authority-and-stage-interaction-doctrine-20260902.md)
  and its exact proposal;
- [Slice 7 authorization](AUTHORIZED-slice-7-implementation-20260912.md),
  [manual clarification](ADOPTED-slice-7-manual-reviewer-profile-clarification-20260912.md),
  and [producer reconciliation](../../../docs/architecture/19-slice-7-implementation-reconciliation.md).

Current proposal blobs were checked against their adoption records:

| Proposal under this directory | Exact Git blob |
| --- | --- |
| `PROPOSED-architecture-decision.md` | `95156a8f7292965cc2f9eef0efd8811f20ae02d8` |
| `PROPOSED-slice-3-unified-lineage-design-20260822.md` | `df65a39c39672178dd5e383a7da8aa29c2a4f8ed` |
| `PROPOSED-slice-4-typed-relations-design-20260828.md` | `51af0df8e3f44201a086169c5ce1fe02050ff8a9` |
| `PROPOSED-slice-5-internal-ambiguity-and-referent-lifecycle-design-20260830.md` | `e59f9a0eabd84f71b0b32b3038686cb08fa287d4` |
| `PROPOSED-oq-01-human-procedural-authority-and-stage-interaction-doctrine-20260901.md` | `536a4e447922ae6c606654de403b1fd725e99b1c` |
| `PROPOSED-slice-6-formal-table-layout-bindings-and-degraded-formats-design-20260911.md` | `9a09d9224840882cfc5752e68d24fe40464e6a98` |
| `PROPOSED-slice-7-semantic-atomicity-context-qualifier-evidence-role-review-design-20260912.md` | `f3307ac00fe98d5ec8b0cca56168e0bff2f269b9` |

Slice 7 adoption `094a7ce3220631c8d4ee4c179e79b9b4529b6681`,
authorization `61bed05bcd19a2c03e8a45f181b0d34c16eb78bb`, and clarification
`ddc2a3e7caaf9298780ef2795c534a4332357cf8` are ancestors of the starting
merge. Their distinct effects and historical wording remain unchanged.

The exact plan's Slice 8 text controls:

> **Purpose**
>
> Separate semantic duplicate judgment from mechanical lineage/provenance
> preservation.
>
> **Evidence basis**
>
> Three duplicate dispositions, replacements, `S-190b`, and audited SL-07 and
> DC-06.
>
> **Primary owner**
>
> Core S4 prompt/harness owner.
>
> **Dependency**
>
> Slice 3 lineage and Slice 4 relation graph; Slice 7 structured semantic
> review.

DC-06: Merge targets exist and absorbed provenance is retained. Duplicate
equivalence remains semantic.

SL-07: Producer proposes; fresh reviewer compares the complete inventory and
provenance. Deterministic checks preserve lineage but cannot decide
equivalence.

No calibration answer, expected duplicate grouping, historical final claim
wording, or SRC-001 outcome enters a generic prompt, schema, or fixture.

## 2. Current implementation and carried findings

The starting manifest declares Core `0.1.0-provisional`, protocol
`1.0.0-provisional`, and run format `1.7.0-provisional`. The explicit cumulative
registry in `scripts/lib/run-model.ts` retains formats 1.0–1.7 and capabilities
through `semantic-unit-review`. Loa is `implemented`, structurally `READY`,
unvalidated and unsanctioned; Hermes is `planned`/`NOT-READY`.

The starting Core/admin validator passed CB1–CB10 over 655 classified files:
428 Core, 51 Loa, 1 Hermes, 8 packaging, and 167 administration.

| Surface | Starting content digest |
| --- | --- |
| Core | `sha256:6d03464b55e5214f6f5e47b33764ffcb88ad4f730d04fa912292ae3cfd9c09c8` |
| Checker | `sha256:800e3255515ed01fa210c0a0caac70b586359e34b25f6e97c0158be8942f0658` |
| Loa adapter | `sha256:fd97a8211fb7d51edcdc8d21e1ff95a761bd0aaf33d5f1b6fa4918cbaf29b43c` |
| Manual execution binding | `sha256:420382152fc2032c47d99bac1ef26e576e89f651991885fb098c2c9c1336d870` |

Authored executable source is TypeScript. `runtime-js/` contains its generated
ES2022 projection, including semantic contracts, transport, and the single
writer. This design changes neither source nor generated projection.

| Finding | Preserved state |
| --- | --- |
| F-03 | **OPEN / MUST PRESERVE:** accepted-worker-return → canonical LedgerWriter/orchestrator production reachability remains unproven. |
| F-04 | **OPEN / MUST PRESERVE:** path/case/platform portability remains unresolved. |
| F-05 | **OPEN / MUST PRESERVE:** bounded by F-03. |
| S5A4-02 | Deferred; broader K2.6/K2.7 activation is not repaired. |
| S5A4-03 | Deferred; the pre-existing S3 recognizer is not repaired. |
| S5A2-03 / S5-A-03 | Deferred; generic resume/review-subject findings remain. |
| Slice 6 A-01 | Retained reserved-marker edge outside canonical source paths. |
| Slice 6 A-02 | Retained synthetic fixture provenance-label wording. |
| Slice 6 A-04 | Retained committed-fixture end-to-end material-review coverage gap. |
| Slice 6 A-05 | Retained L2F empty `candidate_evidence` enforcement at Loa-host level; new portable validation does not close it. |
| Slice 6 A-03 | Remains a closed observation. |
| Slice 6 A-06 | Remains an accepted observation; existing material identity disclosure is preserved. |
| A7-04 | **MUST PRESERVE:** K2.19 structural PASS carries zero semantic warrant. |
| A7-05 | **MUST PRESERVE:** fixture semantic declarations are not ground truth or a reference standard. |
| A7-08 | **MUST PRESERVE:** the manual Slice 7 profile and distinct-actor + distinct-pass independence are load-bearing; no synthetic model/profile/effort identity. |
| A7-01, A7-02, A7-03, A7-06, A7-07, A7-09, A7-10, A7-11, A7-12 | Audit-closed findings remain closed observations only. |

A7 classifications are carried from the commissioning instruction. No
separate retained A7 audit file was found in the inspected repository; this
proposal does not invent one or call the Slice 7 producer reconciliation an
independent audit. Other applicable adopted MUST PRESERVE/LATER findings keep
their strength, including A4-07's absent canonical claim-to-claim evidential
edge owner. None is repaired, closed, reinterpreted, or removed.

Manual mode remains the only sanctioned execution mode. SRC-001 remains
`CLOSED_FOR_CALIBRATION`; SRC-002 remains `NOT_AUTHORIZED`.

## 3. Scope and capability

Propose cumulative run format `1.8.0-provisional` with the sole additional
capability `duplicate-overlap-review`, through
`RUN_FORMAT_CAPABILITY_ADDITIONS` and `hasRunCapability`, never equality with
`CURRENT_RUN_FORMAT_VERSION`. Retain all preceding capabilities.

The capability owns structured S4 comparisons, fresh L3 refutation, durable
review accounting, and admission prerequisites for S4 merge/duplicate
canonicalization. It does not own new PKT lineage, relation families,
ambiguity resolution, evidence roles, human semantic decisions, intent intake,
or a new public command.

Every new S4 merge/duplicate proposal in 1.8 receives this review, replacing
the predecessor spot-check minimum only for this capability. S2/S3 stay under
their contracts; moving a duplicate proposal into S3 to bypass review is
illegal. `split`, `replace`, `supersede`, `reject`, `exclude`, and `no-claim`
retain their ownership. An explicit request for group absorption enters this
contract regardless of its prose label. Code cannot discover a dishonestly
mislabeled semantic operation from text.

No accepted/frozen 1.0–1.7 run or fixture is migrated, retrospectively reviewed,
or reinterpreted. Old runs retain their Core/checker/runtime/profile/bundle
pins. New artifact/marker injection into an old run's control/ledger surface
fails compatibility; incidental strings inside frozen source bytes remain
data. No generic marker-scan repair is included.

## 4. Separate responsibilities

| Role | Owns | Cannot do |
| --- | --- | --- |
| Producer, existing `merge-judge` | Discovery; comparison proposal; equivalence/overlap, distinctions, origin assessment, representative content basis and requested lineage treatment | Certify itself, write ledgers, or optimize for fewer claims |
| Fresh reviewer, existing `verifier-l3` | Adversarial semantic comparison of the sealed proposal and complete bounded basis | Write successor text, change membership, resolve ambiguity, or write REL/CC/LIN rows |
| S4 successor `normalizer` and fresh `verifier-l2s` | Express the exact already-reviewed successor request and challenge its semantic preservation | Choose duplicate groups, alter absorbed members, or inherit L3 as an L2S verdict |
| Relation producer and L3R | Existing relation semantics, explicit current endpoints and C1 review | Treat overlap as a relation type or infer equivalence from relations |
| Orchestrator / canonical writer | Core-derived context, reservation, assignment, accounting, admission and composed writes | Fill semantic fields, choose the preferable answer, soften refutations, or accept its own research |

L2F retains material-use challenge; L5 retains the contradiction sweep.
S5 dispositions and S6 CC×SRC evidence roles remain independent judgments.
Human procedural authority remains OQ-01 authority.

Use existing `merge-judge`, `verifier-l3`, and `verifier-l5`; no new model slot
or reviewer role. The merge-judge discovery and comparison tasks receive
different Core contracts and sealed task lines. Neither is the S4
successor-normalizer task.

## 5. Outcome vocabulary and annotation ownership

| Exact `outcome` | Meaning | Absorption |
| --- | --- | --- |
| `duplicate` | Same assertion under all material semantic distinctions; wording may differ | Eligible only after all review/admission predicates |
| `overlap` | Shared semantic content with a material surviving distinction | None; all members remain separate |
| `distinct` | No single shared assertion asserted across the whole group, or an explicit incompatible pair; shared topic is allowed | None |
| `CANNOT_DETERMINE` | Frozen evidence cannot establish a safe comparison outcome | None; uncertainty remains visible |

These are comparison outcomes, not lineage, disposition, evidence-role, or
REL values. `duplicate` reuses the adopted same-claim concept; `overlap`
expresses the plan's partial overlap; `distinct` represents a false-positive
shared-topic candidate without falsely asserting overlap. Adoption is sought
for these exact spellings; they are not implementation choices.

**Resolved representation question:** contradiction remains the existing
Merge Judge `contradiction_pairs` annotation, not a fifth enum or new relation
family. The current Merge Judge returns such pairs separately, T3.5 excludes
them from merges, and L5 discovers additional pairs. Its new structured shape
is `{a,b,distinction_refs,anchor_refs,why}`. Members `a,b` are different and in
member order; references are mandatory. An endorsed pair requires
`outcome=distinct` and `treatment=keep-separate`. It records incompatible
assertions without deciding which is true. Other overlap in a mixed group
remains in distinction rows and never licenses absorbing that group. A
contradiction annotation takes precedence over the aggregate overlap label;
`distinct` in that case does not deny pair-specific shared content.

No LIN event results from overlap, distinctness, or indeterminacy. Reviewer
`upheld|refuted|cannot-determine` values remain verdicts on a proposal, not
aliases for outcomes. `review_mode=unresolved-record` allows upholding faithful
uncertainty recording, never equivalence.

Successor `lineage_type` remains exactly `duplicate|merge`, proposed explicitly
and reviewed unchanged. Both require same-assertion/no-lost-distinction
admission. This preserves the current Merge Judge's “Merge only when the
claims assert the same thing” rule and Slice 3's distinction between
same-claim canonicalization and several predecessor identities intentionally
forming one successor. The `merge` spelling cannot bypass review or absorb
declared partial overlap. Slice 8 authorizes no non-equivalent synthesis.

## 6. Candidate discovery and group boundaries

After S3 closure, Core constructs a discovery catalogue in durable claim-row
order over every lineage-current CC. An entry is exactly
`{claim_id,claim_projection,semantic_id,semantic_subject_digest,
packet_ids,source_ids}`. `claim_projection` is the existing Slice 6 CC
projection `{normalized_claim,packets,sources,claim_type}`. No disposition,
judge rationale, verification badge, routing or synthesis appears. Bind the
catalogue to run identity, the S3 semantic seal and exact lineage prefix.

The global discovery pass accounts for every entry. It may read this minimum
full inventory; packets are supplied only through explicit bounded selections.
Paging is transport accounting, not semantic clustering.

```text
Discovery = {
  format, discovery_id, run_binding, inventory_basis, catalogue_digest,
  catalogue, producer_binding_hash, windows, candidates, sweep_refs,
  unresolved_findings
}
format = aleph-duplicate-discovery/v1
```

`inventory_basis` is
`{s3_seal_ref,claim_prefix_ids,lineage_prefix_ids,lineage_prefix_digest}`.
The ID arrays enumerate the exact retained claim/lineage table prefixes at
discovery; lineage digest hashes their complete decoded cell arrays in order.
Current members are derived from those prefixes, not a producer total.
The catalogue digest hashes its complete ordered entry array. New discovery
checks these prefixes against the live state; historical discovery reopens
its retained prefixes without pretending they are the present inventory.

`DCD-NNNN` identifies the record. A window is
`{window_id,member_ids,shown_digest,producer_binding_hash,execution_evidence_ref}`.
Window IDs are contiguous `W1,W2,...`; its member IDs
are catalogue-ordered and unique; window union equals the catalogue. Overlap
between windows is legal. A candidate is
`{candidate_id,member_ids,basis_refs,signal}` with local IDs `G1,G2,...`,
at least two current CCs, and exact catalogue/basis references. `signal` is
exactly `semantic-proposal|identical-text|shared-packet`. The latter two are
optional discovery aids only. No keyword, string equality, packet overlap,
source count, lexical distance, embedding or other signal certifies
equivalence. Embeddings/scoring/thresholds are unnecessary and not introduced.

The discovery worker return is exactly
`{candidates,unresolved_findings,rationale,flags}`. Each returned candidate is
`{member_ids,basis_refs,signal}`; Core assigns G ordinals on retention.
`basis_refs` selects catalogue-entry JSON Pointers and any exact source-anchor
references in that window. A discovery finding is
`{member_ids,missing,requested_context}` with nonempty missing and the existing
source-bound request grammar. It cannot claim a duplicate outcome.
Each window's producer binding hashes the existing call/context/raw-return
tuple with `output_kind=duplicate-discovery`, `output_index=0`; the record's
aggregate binding hashes the ordered `{window_id,producer_binding_hash}` array.
All raw returns and shown window bytes remain reopenable outside reviewer
context. Candidate order follows window order then returned array order;
identical member groups may be coalesced only by retaining all basis refs.

Each candidate must reopen its comparison proposals, including candidates
later withdrawn without a judgment. None is silently dropped or counted as a
reviewed negative. A pass with zero candidates says only that it proposed none.

The independent L5 sweep remains required before C1, with its existing minimum
inventory of claims and sources, without merge map, dispositions or discovery
conclusions. Retain shown windows, inventory coverage and VER evidence.
Flagged pairs become new candidates through a new discovery record over the
current inventory. The orchestrator may copy those explicit IDs; it may not
invent a candidate from an L5 rationale. In 1.8 the L5 return therefore retains
the common fields and adds `flagged_pairs:[{a,b,why}]`, empty unless refuted,
with exact current member IDs; it remains a discovery finding, not an
adjudicated contradiction. This bounded structured attachment does not replace
L5's semantic charter.

`sweep_refs` is the ordered list of exact L5 VER companion paths/digests and
their raw structured-result paths/digests, each represented as
`{review_id,verifier_ref,result_ref,window_member_ids,shown_digest}`. Reopen
the independent dispatch/manual evidence through the existing verifier record;
do not count a merge-judge invocation as L5. Catalogue coverage by the union
of sweep windows is checked separately from producer windows. A discovery
record is finalized after these records exist; pending discovery/process
receipts remain in quarantine. Empty catalogues have empty windows and
sweep_refs, with mechanically verified zero current CCs.

If the full catalogue does not fit one invocation, retain the complete window
schedule and unexamined cross-window combinations as a process limitation.
Covering each entry does not prove all possible pairs were compared. Exhausted
work is pending/blocked, not a completed sweep. Finishing a declared sweep
proves that procedure ran over its shown inventory, not semantic recall.

SL-07 completeness thus has two inspectable obligations: global discovery/sweep
inventory accounting and complete evidence for every bounded comparison.
L3 sees all comparison members and their provenance; it does not receive
unrelated catalogue prose merely because S4 is global.

**Groups:** review bounded groups directly, with at least two unique current
CC members. No fixed semantic maximum or pairwise transitivity assumption is
introduced. A group is admissible for review only when its full comparison
closure fits the pinned transport/budget. Review every member together and
enumerate every unordered member pair for the contradiction/support-origin
challenge. The fixed member order determines pair order. Group `duplicate`
asserts equivalence of every member under the whole shown closure.

Pairwise A=B and B=C never automatically authorize A=B=C. A three-member
absorption needs a new complete three-member subject, or a subsequent
comparison of a reviewed canonical successor and another current member with
all inherited occurrences/distinctions reopened. Mixed groups remain separate;
a producer may propose an explicit subgroup as a new candidate/subject.
There is no entire-corpus × entire-corpus prompt and no union-find equivalence
oracle. Slice 3's existing composed transformations remain legal; there is no
generic N-to-M or parallel duplicate-lineage mechanism.

## 7. Minimum complete comparison closure

Core builds `ComparisonBasis` from the exact member identities. Completeness
is not a producer checkbox. The mechanically enumerated base includes:

1. Each current CC's immutable projection and exact normalized-text bytes;
   its admitting SEM identity/digest; every unit, facet envelope/item,
   context, coupling, anchor and unresolved finding in that SEM. Include
   directly referenced earlier findings still carried for these members,
   without earlier verdicts/rationales.
2. Every provenance PKT through existing `semanticPacketBasis`: complete
   exact-evidence record, ordered fragments, join policy and separately labeled
   transformations. Sibling fragments needed to reopen that record are
   inspection context unless actually in the claim provenance.
3. Frozen source identity projections
   `{source_id,locus,scheme,content_hash,kind,trust_class}` for those packets.
   Source kind/trust never proves independent support.
4. The lineage events producing each current member, direct predecessor
   definitions, and older event/occurrence links needed to reopen declared
   ancestry. Include `{lineage_id,row_digest,event,unit_definitions}` using
   Slice 7's structural projection; withhold basis and actor prose. Follow
   ancestry back to initial definitions without attaching unrelated branches.
5. All retained typed relation proposals directly incident on member CCs,
   their provenance PKTs, or explicit semantic-context anchors at the selected
   pre-C1 prefix. Include exact Slice 4 subjects/digests, null states, material
   uses and concrete endpoint/locus context. They remain proposals; there are
   no canonical REL rows at this point.
6. All member/context-linked semantic ambiguity findings and legal Slice 5
   working subjects: source-bound expression, search basis, candidates/nulls,
   carry state and declared affected references. Canonical T5.2/T5.3 and human
   restrictions do not yet exist; do not manufacture them.
7. Applicable PKT/CC material-use declarations, limitation references, exact
   use-subject digests and bounded `representationReviewView` output,
   including structural dependencies, asset bytes and provenance.
8. Explicit additional required context from included SemanticContexts
   (`use=required-for-interpretation`) and finding requests, reopened by their
   anchors/requirements. A relation endpoint gets its bounded projection and
   explicit required context, not its unrelated inventory neighbourhood.

Expand only explicit required context/material/ancestry references until
closed, deduplicating identities and retaining cycles as references. Relation
adjacency alone does not recursively pull in the corpus. This is the least
closure under declared requirements, not a semantic relevance oracle.
Missing required context produces a finding; no placeholder counts as supplied.

The pre-C1 relation roster is derived from retained accepted relation-producer
returns and member SEM relation proposals, using their exact raw-return or SEM
JSON Pointers. Incidence means explicit source/target CC or PKT identity, or a
same-source locus intersecting an included anchor's byte interval. This is a
context-selection rule, not an equivalence rule. Include all matching retained
proposals, including conflicting ones; the caller cannot cherry-pick a subset.
Preserve each original subject and stage legality. A missing explicit target
creates a finding, not an invented target. Newly supplied relevant context
before admission requires a new basis/subject. Later relation reconciliation
does not rewrite the historic basis or automatically retarget it.

The basis object has exactly:

```text
{
  members, semantic_projections, packet_basis, sources, occurrences,
  lineage_context, relation_context, ambiguity_context, material_views,
  inspection_anchors, context_manifest
}
```

Members are `{claim_id,claim_projection,claim_text_base64,
semantic_id,semantic_subject_digest}`. The base64 is exact UTF-8 of the decoded
normalized-claim field, checked against both the current CC projection and its
SEM output. Do not hash later S5 mutable columns as claim content.
Semantic projections reuse Slice 7's
`{semantic_id,subject_digest,owner_stage,output_binding,anchors,semantics,
material_use,material_views}`. Packet/material/lineage structures are the
existing Core types. Relation entries are
`{reference,digest,subject,target_units,target_anchors,target_packet_context,
material_use}`. Ambiguity entries use Slice 7's exact
`{kind,reference,digest,projection}` and existing working-subject validation.
All reference lists are ordered by first encounter in member order, retaining
each imported object's internal order.

The reviewer can find missing semantics even when this closure is structurally
complete. It requests bounded frozen context and cannot uphold absorption on
missing basis. The stage producer supplies a new sealed subject. Whole-source
referent searches use the existing Slice 5 same-source/completion procedure in
a separate task; L3 cannot resolve the referent itself. No outside fact,
authority observation, missing table association or equation is invented.
If complete context exceeds capacity, retain indeterminacy rather than truncate.

Pre-C1 working context cannot promise that later C2 will resolve an unknown.
After C1, an actual restriction overlay is consumed by the existing downstream
procedure, not imported backward to reopen duplicate adjudication. Discovering
a defect that requires pre-C1 change blocks under existing correction doctrine.

## 8. Producer proposal and structured distinctions

New JSON follows existing strict compact UTF-8 conventions: exact keys/order,
no extra/duplicate keys, no BOM/trailing newline, valid Unicode, nonnegative
safe integer ordinals/offsets, canonical base64 and lowercase SHA-256. Reuse
`semanticJson`/`parseStrictJson`; do not introduce another dialect. Preserve
source/claim text and imported evidence order.

New IDs `DCD`, `DUP`, `DDR`, `DUE` use the existing new-ID convention: at
least four decimal digits with a nonzero value. VER/CC/PKT/LIN retain their
existing namespace. Local distinction/finding IDs are contiguous `D1...` and
`F1...`. Ordered sets contain no duplicates.

The producer returns:

```text
{
  proposal: {
    candidate_ref, member_ids, member_semantic_refs, comparison_basis_digest,
    review_mode, outcome, treatment, distinctions, contradiction_pairs,
    origin_assessment, representative, successor_request, provenance_union,
    unresolved_findings
  },
  rationale, flags
}
```

Outer rationale is the existing 1–3 complete-sentence explanation, retained
outside the reviewer bundle. Flags are non-operative strings. Core assigns
`proposal_id=DUP-NNNN`. Freeform rationale never supplies a missing field.

| Field | Exact contract |
| --- | --- |
| `candidate_ref` | Existing `DCD-NNNN/G<n>` |
| `member_ids` | Candidate's complete unique current CC group in durable inventory order |
| `member_semantic_refs` | One `{claim_id,semantic_id,subject_digest,unit_refs}` per member; all of its admitting SEM's `SEM-NNNN/U<n>` units |
| `comparison_basis_digest` | Exact Core-produced basis shown to the producer |
| `review_mode` | `proposal|unresolved-record`; latter requires CANNOT_DETERMINE/keep-separate |
| `outcome` | Section 5 enum |
| `treatment` | `new-successor|keep-separate`; nonduplicate/unknown outcomes require keep-separate |
| `distinctions` | Section 8.1 complete structured coverage |
| `contradiction_pairs` | Section 5 annotation; empty when none asserted |
| `origin_assessment` | Section 10; no S6 edge |
| `representative` / `successor_request` | Null for keep-separate; section 12 otherwise |
| `provenance_union` | `{packet_ids,source_ids,occurrences,member_occurrences}`, exactly section 9 |
| `unresolved_findings` | Section 8.2; never erased by a later success |

### 8.1 Distinction coverage

The exact comparison dimensions are:

```text
proposition, conditions, qualifiers, scope, modality, attribution,
comparator, metric, claim_roles, result-interpretation,
source-occurrence, support-origin, material, ambiguity, lineage, relations,
context
```

These are coverage labels for existing fields/questions, not new semantic
facet values. Slice 7's facet/context/coupling enums remain unchanged.

Core enumerates `comparison_fields:[{field_ref,dimension,member_ids}]` from
the basis: each member's proposition and eight facet envelopes/items, contexts,
couplings, findings, occurrences, lineage projections, relation subjects,
ambiguity entries and material requirements/limitations. Empty collections
also get their collection pointer. Result/interpretation covers the existing
roles and couplings; support-origin covers occurrences and source projections.
Each reference is an exact JSON Pointer into the basis, with member order then
the seventeen-dimension order above, then imported array order. The same
pointer can have different dimension labels; its identity is the pair
`{field_ref,dimension}`.

A distinction is:

```text
{
  distinction_id, dimension, member_ids, input_refs, treatment,
  retained_at, content_anchor_refs, context_refs, explanation
}
treatment = retained | collapsible | CANNOT_DETERMINE
retained_at = successor-content | occurrence-history | separate-claims | null
```

`input_refs` selects a nonempty ordered subset of comparison-field pointers
for its dimension. Their union must cover the complete enumeration, with at
least one row per dimension. Overlapping comparisons are legal; invented
pointers are not. Every member appears in the complete comparison.

`retained` requires a location; other treatments require null. `collapsible`
claims that the difference is representational only and must be attacked.
Unknown requires a finding. Source occurrences and historical identities are
always retained at occurrence-history, never collapsible. Semantic facets
cannot be retained only in history while disappearing from successor content.
A `separate-claims` or unknown distinction blocks absorption. A proposed
duplicate successor must retain semantic fields at successor-content or
explicitly declare them collapsible for review. A keep-separate proposal uses
separate-claims for semantic retention and occurrence-history for provenance.

The checker proves declaration coverage, not that a difference is safely
collapsible or that retained wording preserves its meaning.

### 8.2 Findings and scoped references

A finding is exactly
`{finding_id,dimension,input_refs,anchor_refs,material_refs,missing,
requested_context}`. References resolve within the basis; missing is nonempty.
Requests reuse Slice 7's `{source_id,locator,purpose}` with
`local-context|same-source-referent-search|material-inspection`.
They do not authorize a fetch or widen the shown context in place.

An anchor reference is `{semantic_id,anchor_id}` or an explicit
`{source_id,locator,start_byte,end_byte,selection_hash}` from inspection anchors.
Material references identify an included use-subject digest and requirement
index or limitation ID. Context references are exact basis pointers.
Unknown equivalence requires at least one finding naming the unsettled basis.
Reviewer findings use a separate local namespace and cannot overwrite producer
findings.

## 9. Source occurrences and mechanical provenance union

A required occurrence is identified by existing evidence coordinates:

```text
{
  source_id, source_hash, packet_id, evidence_key, fragment_order,
  locator, fragment_hash, start_byte, end_byte
}
```

Offsets are recomputed through existing locators and UTF-8 half-open rules;
no new locator scheme. The occurrence key is canonical JSON of this tuple.
Equal bytes at two locators, two sources, or separate packet occurrences stay
separate. The same exact tuple cited by two members is stored once with both
memberships retained; this is not independent support.

`member_occurrences:[{claim_id,occurrence_keys,unit_occurrences}]` enumerates
every cited PKT's actual fragment for each member. A unit occurrence is
`{unit_ref,anchor_refs,occurrence_keys}`; enumerate every admitting SEM unit
and its proposition anchors, preserving different source positions within
the same packet. This avoids treating two proposition occurrences inside one
PKT as one semantic occurrence merely because the fragment tuple is shared.
Complete sibling fragments needed to reopen an evidence group are
inspection-only unless already in that member's provenance.

Mechanical rules:

1. `P` is the unique packet union in first-reference order over member order.
2. `S` is the unique source list reached from `P`; each member's own sources
   must already agree with its packet provenance.
3. `O` contains every occurrence of `P` plus complete member mappings.
   Deduplicate only identical tuples, never text hashes or source IDs.
4. The declared union equals recomputed `P,S,O` and mappings. Every tuple
   reopens against frozen exact evidence; framed order/join semantics remain.
5. Successor packets/sources equal `P,S`. This preserves Slice 3's general
   superset rule and Slice 7's stricter exact-union S4 path. Extra evidence
   requires a changed legal proposal; it is not appended under an old review.
6. Merge-map source union equals `S`; absorbed IDs and canonical successor
   match the same LIN event and DUP effect. The effect reopens `O` even though
   T3.5 stores only source IDs.

Predecessors are terminalized once, remain immutable historical definitions,
and do not remain lineage-current. Historical `status=active` is legal under
Slice 3; double participation in the current view, reterminalization, or
resurrection is not. Reservations are not admitted definitions.

Union equality proves no semantic equivalence or support independence. A
mutation omitting one same-text occurrence must fail even if source set,
claim text and all remaining hashes are unchanged.

## 10. Independent support and restatement

The existing T3.5 `corroboration` vocabulary is `independent|restatement`.
The new proposal records:

```text
origin_assessment = {
  corroboration, occurrence_groups, basis_refs, unresolved_finding_refs
}
corroboration = independent | restatement | CANNOT_DETERMINE
occurrence_groups = [{occurrence_keys, basis_refs}]
```

Groups explicitly partition the occurrence set into proposed origins, with
source-bound basis. L3 attacks false independence and concealed repetition.
Code verifies partition/references, never origin meaning.

`CANNOT_DETERMINE` is an unknown in the new review record, not a third T3.5
value. It blocks canonical absorption even if assertion equivalence was
upheld: preserve all claims and the unresolved origin finding. Do not force
either binary label merely to obtain a shorter inventory. A later proposal
may address it only from legal frozen evidence.

An admitted map row copies the exact reviewed independent/restatement
declaration. It remains a challenged S4 origin annotation, not an automatic
S6 role. S6 independently judges load-bearing, corroborative, contradictory,
contextual, decorative or unresolved-source use. Known same-origin restatement
must not become corroborative support. Context-only inspection material never
joins the provenance union or becomes an evidence edge.

## 11. Immutable review subject and legal shown context

Core constructs exactly:

```text
DuplicateSubject = {
  format, proposal_id, owner_stage, predecessor_proposal_id,
  run_binding, producer_binding_hash, proposal, comparison_basis,
  comparison_fields, reservation, prompt_parts, reviewer_profile,
  context_manifest
}
format = aleph-duplicate-review-subject/v1
owner_stage = S4
```

`proposal` is the exact selected structured return, excluding outer rationale
and flags. `predecessor_proposal_id` is null or a retained same-run DUP.
Revision chains are acyclic. No in-place mutation or result retargeting.
`reservation` is null for keep-separate; otherwise
`{lineage_id,successor_id,lineage_type,predecessor_ids}` allocated by Core after
proposal validation, before sealing. Reserving IDs grants no write authority.

`run_binding` reuses Slice 7's exact six fields:
`{run_id,run_format_version,core_digest,checker_digest,bundle_digest,
runtime_snapshot_digest}`. Retained run identity, not a profile string,
determines execution mode.

`producer_binding_hash` binds the existing tuple
`{call_id,context_id,raw_return_hash,output_kind,output_index}` with
`output_kind=duplicate-proposal` and `output_index=0`. The tuple and the
producer's execution/request evidence stay outside L3's shown content.
Manual pass evidence must be honest; no synthetic context/model is invented.
As in current T3.7, manual `call_id` and `context_id` are distinct recorded
pass identifiers explicitly labeled manual, not model context mappings.

The subject file is
`verification/harness/duplicate-subjects/DUP-NNNN.json`; the exact target is
`duplicate-review-subject:sha256:<64 lowercase hex>`. Hash exact compact
JSON bytes. All load-bearing fields are inside the seal: current claim bytes,
SEM digests/facets, evidence/occurrences, lineage/relation/ambiguity/material
projections, proposed outcome/distinctions, representative/successor request,
union, prompts, profile and shown-context manifest.

`prompt_parts:[{path,selector,digest}]` binds, in order, the existing common
preamble, common verifier frame, capability-specific L3 charter, bounded 1.8
S4 excerpt, new T3.8 contract, and existing Slice 6 common constraint block.
Resolve selectors only through the run-pinned bundle. No mutable checkout
or human-authority document is a runtime policy source.

`reviewer_profile` for agent/hybrid is the existing exact pinned
`{profile_id,profile_digest,role,model_identity}` with role `verifier-l3`;
model identity retains actual context/effort and the existing effort floor.
The manual variant is expressly pending Q8-MANUAL in section 17. No
implementation fallback is authorized.

`context_manifest` uses Slice 7's existing
`{path,selector,digest,purpose}` grammar, ordered by UTF-8 path then selector,
without duplicates/globs. Selectors are exact `bytes:<start>:<end>`,
`json:<JSON-Pointer>`, or `row:<table-key>:<zero-based-row-index>`; each digest
binds selected bytes, compact JSON, or JSON cell array respectively. Purposes
reuse `packet-evidence|inspection-context|material-context|lineage-context|
relation-context|ambiguity-context`. The subject's own file is excluded from
its manifest to avoid recursive hashing. A manifest entry cannot itself
grant a new attachment.

The actual reviewer delivery is exactly this subject, the fixed task, its
pinned prompt parts, and exact assets already embedded/referenced by its
Slice 6 view. Core must compare the delivered attachment set and bytes against
the computed allowlist. Merely checking a manifest supplied by the caller is
insufficient. The fixed task is:

```text
Challenge only the attached sealed duplicate comparison under L3.
```

Withhold calibration answer keys, expected duplicate calls/IDs, adoption and
human-authority observations, downstream dispositions/evidence-role judgments,
routing, clusters, projection prose, later synthesis, unrelated batch
conclusions, hidden producer rationale, producer identity tuples, prior L3
verdicts/rationales and the expected reviewer answer. The proposed outcome
and explicit distinction declarations are shown because they are the target.
Prior findings required for preservation are shown as source-bound findings,
without who endorsed them or their verdict.

Changing any load-bearing subject field creates a new DUP subject and new
review. Different reviewer invocations of unchanged bytes use distinct
assignments, never an inherited result. Actual invocation/context identity is
bound by the immutable assignment and execution receipt, not a fabricated
pre-dispatch context ID. A changed assignment cannot reuse its prior result;
a profile/model/prompt change additionally requires a new subject.

## 12. Representative and successor semantics

Representative choice means selecting content/wording as the basis of a
**new canonical successor**, never selecting a predecessor identity to survive.
This is resolved by adopted Slice 3 sections 6–8, current T3.5 and the Merge
Judge contract.

```text
representative = {
  basis_member_ids, basis_unit_refs, wording_basis, retained_distinction_refs
}
wording_basis = selected-member | combined-expression

successor_request = {
  lineage_type, proposed_claim, claim_type, packet_ids, source_ids,
  semantic_content_refs, material_use
}
```

`selected-member` requires exactly one basis member; `combined-expression`
requires at least two. Both retain the complete comparison membership and
union. Unit/content references select explicit member propositions/facets and
distinctions. `proposed_claim` is the producer's wording basis; it is not final
canonical prose. `material_use` is the existing `MaterialUseInput`, with no
new feature taxonomy. `claim_type` stays in its existing five-value vocabulary.

L3 challenges the exact semantic content request, proposed wording basis,
membership, type, union and retention declaration. It returns no replacement
claim text. Once L3 upholds the eligible decision, the existing S4 normalizer
may express the reserved successor from that request. Its legal view contains
the reviewed content request and member origin projections, but no L3
rationale, votes, producer hidden notes, unrelated inventory or authority
observations. The mechanical admission binding carries DDR/DUP digests
outside the normalizer's semantic prompt.

The normalizer cannot change lineage type, membership, provenance, claim type
or intended semantic content. Its final wording and full semantic facets
become a new ordinary Slice 7 S4 SEM subject. Fresh L2S tests preservation of
the declared member content, and independent L2F remains required where its
material predicate applies. Any revised semantic content/group/union requires
a new DUP, not an L2S repair of L3's decision. A wording-only revision still
requires a new SEM/L2S; reuse of L2F is allowed only when its entire subject
and shown view are unchanged under the existing contract.

Keep the Slice 7 SEM schema/meaning intact. The DUP-to-SEM link is in the new
effect record and Core composed admission predicate. The new normalizer view
adds the bounded reviewed request as read-only content; it does not add a
duplicate-decision field to L2S or change L2S's role.

Required flow:

1. Merge Judge proposes the exact comparison and successor content request.
2. Fresh L3 challenges duplicate/overlap judgment.
3. An eligible reviewed decision permits successor expression, not canonical
   writes.
4. Existing S4 normalizer expresses that exact reserved successor.
5. Fresh L2S challenges preservation; L2F separately reviews required use.
6. Existing lineage/provenance checks and the new admission predicates pass.
7. Orchestrator alone commits CC + LIN + merge-map + USE + semantic resolution
   + duplicate effect in one prepared transaction.

No predecessor is edited or deleted; no new CC is admitted without its LIN,
no absorption without its successor, and no merge occurs on similarity alone.

## 13. Fresh reviewer return, challenge coverage and consequence

```text
DuplicateResult = {
  format, subject_digest, verdict, assessed_outcome,
  dimension_reviews, distinction_reviews, pair_reviews,
  contradiction_pairs, unresolved_findings, attacks_tried,
  missing_for_determination, rationale, candidate_evidence
}
format = aleph-duplicate-review-result/v1
verdict = upheld | refuted | cannot-determine
assessed_outcome = duplicate | overlap | distinct | CANNOT_DETERMINE
```

No key is optional. `candidate_evidence=[]` is enforced in portable Core and
native schema. It is not a host regex and does not close L2F A-05.

Each dimension review is
`{dimension,verdict,input_refs,anchor_refs,material_refs,explanation}` in the
seventeen-dimension order, exactly once per dimension. Each distinction review
is `{distinction_id,verdict,input_refs,explanation}` exactly once per producer
distinction. Each unordered member pair has one
`{a,b,verdict,distinction_refs,origin_basis_refs,explanation}` in derived pair
order. These are mandatory comparison coverage, not semantic tests by code.

The reviewer must affirmatively seek counterexamples to:

- condition, qualifier, scope, modality or attribution preservation;
- comparator, metric, result-versus-interpretation or claim/content-role
  preservation;
- retention of every occurrence and the independent-versus-restatement
  distinction;
- material/layout limitations and unresolved ambiguity/referent state;
- contradiction/incompatibility hidden by shared topic or fluent wording;
- lineage meaning, necessary context and relevant relation semantics.

A reviewer can cite an existing basis pointer/anchor as a new surviving
distinction even if the producer omitted it from a semantic declaration.
Its finding is retained independently. `contradiction_pairs` uses section 5's
shape, with distinction references qualified `producer:Dn` or `reviewer:Fn`.
No lexical negation or numeric comparison supplies a checker truth test.

`attacks_tried` is nonempty; explanation states the attempted counter-reading.
Core checks presence/reference legality, not attack quality. Rationale follows
the existing sentence rule. `missing_for_determination` is nonempty exactly
for cannot-determine; otherwise null. Unknown rows require linked findings.

Aggregation is mechanical over declared verdicts: any refuted row gives
overall refuted; otherwise any cannot-determine gives cannot-determine;
otherwise all rows are upheld. Upheld requires `assessed_outcome` equal the
proposal outcome. A known contradictory assessment refutes a proposed
duplicate; insufficient evidence yields cannot-determine, not a guessed
contradiction. `assessed_outcome=CANNOT_DETERMINE` with upheld is legal only
for unresolved-record review. Refuted results may name overlap/distinct as
the counterassessment; the orchestrator cannot substitute it into the original
proposal as an approved revised decision.

**Quorum:** for this new capability, use three fresh L3 reviewers for every
comparison group. This applies the existing exhaustive-class panel size
without inventing a threshold for “big” merges. All receive the identical
subject independently. Any cannot-determine requires a second panel of three
fresh contexts over the same subject under the existing round-2 principle.
All assigned results are retained. Any refutation blocks absorption; any
cannot-determine blocks absorption even if later votes uphold. No majority
may erase a surviving distinction or uncertainty. This explicitly replaces
the common majority permission only for 1.8 duplicate admission, following
Slice 7's conservative all-assigned-result treatment. Other lenses keep their
existing quorum doctrine.

Every required assignment must finish before a reviewed decision is recorded.
Budget exhaustion retains pending work. Extra panels cannot be solicited until
the desired answer wins. A revised comparison needs a new subject with
materially identified changed basis/declaration and a link to its predecessor.
Digest-identical copied proposals cannot manufacture fresh evidence.

## 14. Durable artifacts and exact states

Use a dedicated Core artifact `ledgers/duplicate-review.md`, marker
`duplicate_review_format: aleph-duplicate-review/v1`, with six tables:

```text
| discovery_id | record_path | record_digest |
| proposal_id | subject_path | subject_digest | predecessor_proposal_id | producer_receipt_ref |
| review_id | proposal_id | assignment_path | assignment_digest |
| review_id | proposal_id | result_path | result_digest | execution_kind | execution_evidence_ref |
| decision_id | proposal_id | review_ids | verdict | reviewed_outcome |
| effect_id | proposal_id | decision_id | effect | semantic_id | lineage_id | successor_id | record_ref |
```

No duplicate semantic ownership: this ledger owns comparison decisions;
`semantic-review.md` owns L2S successor preservation; `lineage.md` owns identity;
`merge-map.md` owns the existing canonical merge/corroboration projection.
The new effect joins their exact identities without copying their policy.

Immutable companions:

Every whole-file evidence reference uses the existing
`path@sha256:<64 lowercase hex>` grammar; a selected JSON reference uses
`path#<JSON-Pointer>@sha256:<64 lowercase hex>` and binds the whole file before
selection. Paths are run-relative and must pass existing confined-file checks.
The explicit path/digest table columns are the equivalent split representation.

- `verification/harness/duplicate-discovery/DCD-NNNN.json`;
- `verification/harness/duplicate-subjects/DUP-NNNN.json`;
- `verification/harness/duplicate-assignments/VER-NNNN.json`;
- `verification/harness/duplicate-results/VER-NNNN.json`;
- `verification/harness/duplicate-effects/DUE-NNNN.json`;
- producer/manual/static process evidence under
  `verification/harness/duplicate-process/`;
- existing T7.1 companion `verification/harness/S4/VER-NNNN.md`, lens `L3`,
  exact target and shown/withheld declaration, agreeing with JSON.

Assignment is exactly
`{format,proposal_id,subject_digest,review_id,role,profile_digest,invocation_id,
producer_binding_hash,round,execution_kind}`,
format `aleph-duplicate-assignment/v1`, role `verifier-l3`, round 1 or 2.
Assignment is durable before dispatch and points to an existing immutable
subject. Invocation IDs are unique across all reviewer assignments. Actual
execution kind is verified from receipts; a claimed label cannot override them.

One `DDR-NNNN` decision per DUP records all assigned completed review IDs in
dispatch order. Its verdict follows section 13 across all returns.
`reviewed_outcome` equals the proposal outcome only when upheld; otherwise
literal `none`. This does not overwrite individual counterassessments.

Derived proposal states are exactly:

| State | Durable predicate |
| --- | --- |
| `proposed` | Subject exists, no assignment or final effect |
| `review-pending` | At least one assignment and missing required results/decision |
| `reviewed` | Complete DDR exists, no final effect |
| `canonicalized` | DDR and matching canonicalized DUE exist |
| `kept-separate` | Matching kept-separate DUE exists |
| `not-admitted` | Matching not-admitted DUE exists |

These states are derived, not editable competing ledger columns. No new
generic STALE/INVALIDATED state is persisted.

An effect object is exactly:

```text
{
  format, effect_id, proposal_id, subject_digest, decision_id, effect,
  reason, semantic_ids, lineage_id, successor_id, merge_row_digest,
  provenance_union_digest, predecessor_proposal_id
}
format = aleph-duplicate-effect/v1
effect = canonicalized | kept-separate | not-admitted
reason = reviewed-duplicate | reviewed-nonduplicate | unresolved-equivalence
       | unresolved-origin | refuted-proposal | successor-not-preserved
       | withdrawn-reservation | changed-prerequisite
```

One final DUE per DUP. `canonicalized` requires section 15 admission and
reason reviewed-duplicate; the other effects have null LIN/CC/merge-row fields.
`semantic_ids` lists every successor attempt for this DUP, including failed
SEMs; a canonical effect identifies exactly one admitted SEM through its
matching successor ID. The table's `semantic_id` is that admitted SEM or
`none`. Other null table values serialize as `none`; list cells are compact
JSON arrays with the existing Markdown escaping, not comma-parsed prose.

`kept-separate` applies to reviewed nonduplicate/unresolved records or a known
duplicate with unresolved origins. `not-admitted` preserves a refuted,
indeterminate, withdrawn, changed-prerequisite or failed-successor proposal.
A withdrawal before any assignment may have `decision_id=null`; after an
assignment it cannot hide an outstanding result or evade quorum completion.
No-effect pending work blocks C1. A fresh revision links backward; an earlier
failure remains independently inspectable with no fabricated later verdict.

Every load-bearing decision reopens proposal → member SEM/current definitions
→ source occurrences → assignment/execution/result → DDR → DUE → canonical
CC/LIN/map/SEM where present. Counts derive from rows/files, never totals.

## 15. Admission predicates and cumulative S4 barriers

Before canonical absorption Core must require all of:

1. Active 1.8 capability; S3 closed; retained execution stage S4; C1 not closed;
   no S5+ work or unrelated halt; exact original run/bundle/runtime pins.
2. Exact subject, basis, delivery, producer binding and completed independent
   reviewer assignments/results; DDR upheld; all required reviews upheld.
3. `review_mode=proposal`, `outcome=duplicate`, `treatment=new-successor`;
   no endorsed contradiction; no unknown/separate-claims distinction; complete
   field coverage and provenance; no blocking unresolved finding.
4. Reviewed `corroboration=independent|restatement`, complete occurrence-origin
   accounting and no unresolved-origin finding.
5. Members still lineage-current; reservation IDs unused; requested LIN type,
   member set, successor content and provenance bindings unchanged.
6. Existing Slice 7 S4 preservation prerequisites met for the exact successor:
   valid SEM, all required L2S outcomes upheld and eligible semantic resolution;
   complete USE and independently upheld L2F where required.
7. Proposed canonical after-images pass K2.8, K2.15, applicable K2.18/K2.19
   and the new K2.20; CC/LIN/map/USE/semantic/DUP effects agree.

Here a blocking unresolved finding means any finding in the new proposal's
`unresolved_findings` or any completed L3 result's `unresolved_findings`, plus
any distinction declared CANNOT_DETERMINE or origin assessment unknown.
Imported historical findings remain separate basis records: they must be
covered and challenged, but their historical presence alone does not revoke a
later narrower claim. The producer/reviewer must explicitly retain their
limitation or declare why the comparison cannot be determined; code cannot
decide the semantic effect of an imported finding.

No `upheld` label alone licenses a write. Structural validation can PASS an
honest unresolved/no-merge state while admission refuses its absorption.
This distinction must appear in reports.

S4 order remains:

```text
S3 closure
  -> complete current-inventory discovery and L5 sweep
  -> bounded proposals and fresh L3 decisions
  -> eligible successor expression, L2S and required L2F
  -> canonical CC/LIN/merge-map/USE/semantic/DUP effects
  -> explicit relation reconciliation and fresh L3R on current endpoints
  -> C1: relations closed + material-use seal + semantic seal + duplicate seal
  -> C2: existing ambiguity/material-impact/procedural authority
  -> C3: exit, then S5
```

Pre-C1 tasks can interleave without crossing these dependencies. A merge
changes current inventory: outstanding proposals whose member ceased to be
current become not-admitted/changed-prerequisite, with a new proposal required.
Discovery is refreshed for new successors; original records stay historical.
The final discovery catalogue/sweep must account for final current IDs before
C1. Earlier flagged contradictions involving absorbed members cannot be
silently mapped to successors: an explicit new comparison is required, or
C1 blocks with retained tension. No automatic relation or tension retargeting.

No new C0/C4 phase is introduced. Add exactly one line in the existing
structured C1 event:

```text
duplicate_review_closure_hash: sha256:<64 lowercase hex>
```

It hashes exact complete duplicate-ledger bytes; referenced immutable hashes
close the companion artifacts. The event already carries
`closure_phase: S4-C1-relations-closed`, representation-use and semantic
closure hashes. The new seal is composed with those writes and validates
the final catalogue, sweep, all proposal effects and canonical joins.
It is not a relation-set version, rewind mechanism or human gate.

After C1, refuse all duplicate proposal/assignment/result/decision/effect
writes and associated CC/LIN/map rewrites before bytes change. C2/C3 consume
the seal. A C2 finding that undermines a prior merge is visible and blocks
progress where existing DoDs require repair; do not reopen C1, manufacture
earlier ambiguity authority or waive the finding.

## 16. Existing slice integration

| Owner | Exact integration |
| --- | --- |
| Slice 1 | Reopen exact fragments, locators, offsets, hashes and joins; previews never become exact bytes |
| Slice 2 | Preserve source-walk/gap/shared-position accounting; discovery coverage is a different population and no recall proof |
| Slice 3 | Reuse `aleph-lineage/v1`, currentness and new-successor rules; no new edge family, predecessor resurrection or generic correction |
| Slice 4 | Context uses proposals before C1; final REL rows require their own L3R over explicit current endpoints; duplicate/overlap never becomes a REL type |
| Slice 5 / OQ-01 | Existing working ambiguity can block equivalence; L3 cannot resolve it; canonical C2 procedure, selected_candidate_ref=none and restriction overlays retain ownership |
| Slice 6 | Reuse material requirements, bounded views, limitations and L2F; unavailable formal structure is not reconstructed |
| Slice 7 | Facets/subjects are challenge inputs, not semantic truth; S4 normalizer/L2S preserve only an already-proposed successor; existing manual clarification stays exact |

K2.19-valid identical facets can support a refuted duplicate proposal.
Different but structurally valid facets do not deterministically establish
non-equivalence. Required negative fixtures must exercise both directions.

Historical comparison subjects validate their exact admission-time prefixes
and immutable member definitions after those members become historical.
New reservation/admission validates currentness against the live current view.
Do not reject valid history merely because its predecessors are now absorbed,
and do not use historical-currentness logic to admit a stale new proposal.

## 17. Manual execution and bounded clarification

Manual mode remains sanctioned under existing doctrine; this unadopted design
does not change the sanctioned procedure. Existing manual identity is
`adapter_id=core-manual`, `host_identity=human-operator`, `model_ids=human`,
profile `n/a (core-manual)`, execution mapping `n/a (manual)`.

For each new manual L3 review, require the existing seven-field evidence shape:

```text
{
  producer_actor, reviewer_actor, producer_pass_id, reviewer_pass_id,
  subject_digest, shown_digest, withheld_declaration
}
```

Actors and passes are distinct. Reviewers in the same panel are distinct from
the producer and one another, including across the two panels for one DUP;
each sees only its sealed subject, not the other votes. Bind
`producer_pass_id` to the retained producer `context_id`,
`reviewer_pass_id` to assignment `invocation_id`, and both subject/shown
digests to the exact delivered subject. The duplicate producer, successor
producer and their reviewers retain
separate role/pass evidence. Reusing the duplicate producer as the successor
normalizer is permissible only in a new bounded producer pass; L2S is a
different actor/pass and cannot reuse an L3 reviewing pass.

Same-person separate sittings may be recorded as temporal review evidence but
do not satisfy this design's independent review predicate. No record proves
cognitive independence. Manual evidence remains `manual-separate-pass`, never
native dispatch. Static/synthetic declarations do not prove humans performed
the reviews.

**Q8-MANUAL — human clarification required before implementation.** The
adopted Slice 7 clarification fixes its exact four-key L2S profile and
explicitly says the exception does not extend to other roles or slices.
The proposed duplicate subject needs a manual `reviewer_profile` for existing
role `verifier-l3`. No adopted record supplies its exact representation.
The narrow recommended clarification is to permit the analogous exact object
`{profile_id:"n/a (core-manual)",profile_digest:null,role:"verifier-l3",
model_identity:"human"}` solely for the new duplicate-review subject, with
the seven-field distinct-actor/pass evidence above. This is a requested
authority decision, not an invented adopted identity or executable fallback.

Until that exact representation is explicitly clarified, manual subject
construction for the new capability is blocked; implementation must not pick
this object, null, an L2S role substitution, a fake model object or a fabricated
digest. The completed proposal remains reviewable with this bounded authority
dependency visible. Agent/hybrid exact model/profile/effort requirements are
unchanged. No human gate for selecting duplicate versus overlap is introduced:
humans reviewing frozen material act as reviewers, not source-meaning authority.

## 18. Deterministic checker boundary

Propose `K2.20 — duplicate comparison and admission accounting`, dispatched by
capability. It is read-only, deterministic, dependency-free, and makes no
model/network/OCR/renderer calls. Stable failure tokens are:

```text
DUP_FORMAT, DUP_ENUM, DUP_REFERENCE, DUP_EVIDENCE, DUP_SUBJECT,
DUP_REVIEW, DUP_ISOLATION, DUP_STATE, DUP_ACCOUNTING, DUP_WINDOW,
DUP_COMPATIBILITY
```

The checker may verify required artifacts, strict syntax/enums/IDs, exact
selected current or historical identity as appropriate, source reopening,
complete declared union and field coverage, subject/delivery digests,
assignment/result existence and equality, mechanically detectable isolation
violations, legal outcome/effect combinations, exact canonical joins and
retained stage/closure consistency. Structural reports name these propositions.

It cannot decide equivalence, materiality, paraphrase meaning, qualifier
entailment, condition subsumption, contradiction from text/numbers, evidence
independence, correct representative wording, ideal claim count, recall,
semantic sufficiency of context, review quality or cognitive freshness.

Explicit overreach guards:

- no text/embedding/similarity/negation/number heuristic selects an outcome;
- packet/source/REL multiplicity never licenses duplicate or corroborative;
- exact same-text claims can receive distinct or indeterminate declarations
  that structurally PASS when coherent;
- different wording/facets can receive duplicate declarations that structurally
  PASS when coherent;
- a deliberately wrong semantic answer with complete consistent records must
  structurally PASS; semantic critique belongs to adversarial evidence;
- lost *declared* field/occurrence coverage fails; a semantically wrong but
  fully populated field is not a deterministic expected-answer mutation;
- discovery totals are recomputed from actual records; enumerated coverage
  never becomes a semantic-recall claim;
- static retained state cannot prove historical write timing or fresh dispatch.

The checker need not fail merely because an unresolved decision is honestly
retained. Its separate admission predicate refuses absorption. Conversely,
structural PASS does not repair a failed semantic review.

The duplicate ledger is required on S4 entry, even with zero candidates.
Determine entry from the retained execution stage or a structured S4-or-later
run-log event, and require it in every downstream run state; S2/S3 claims alone
do not trigger S4. Before S4, its absence is valid and duplicate writes are
forbidden. Pending rows are legal within the open S4 window, but C1 closure
requires every discovered candidate to have retained proposal/effect
accounting and every proposal to have its final effect. No freeform corpus
marker or caller-reported total can establish stage entry or completion.

## 19. Durable write plans, transport and recovery

Core owns schemas, exact context/subject construction, canonical serialization,
state predicates, effect admission, stage/window rules and write plans.
Loa owns sealed transport, fresh invocation, accepted-return quarantine,
persistence, locking, journal execution/recovery and retained execution
evidence. No semantic policy is encoded in host regexes or role-local mappings.

The new Core plan is exactly:

```text
{
  key, stage, proposal_id, subject_digest, operation, record_id,
  writes, prerequisite_hashes, acceptance_bindings
}
stage = S4
operation = record-discovery | reserve-subject | assign-review | record-review
          | decide | record-effect | admit | seal | initialize
key = duplicate:<proposal_id>:<subject_digest>:<operation>:<record_id>
```

For initialize/discovery/seal, proposal ID is `none`, digest identifies the
empty ledger/discovery record/complete closing ledger, and record ID is
S4/DCD/C1 respectively. Other operations name
their exact DUP/VER/DDR/DUE. `writes` reuses
`{path,before_hash,after_base64,after_hash}`; prerequisite hashes use exact
sorted unique `{path,digest}`. Empty-before is the existing empty-byte hash.
Acceptance bindings are `{call_id,context_id,raw_return_hash,role}` from the
actual accepted returns, not caller assertions about hidden objects.

Core supplies these exact operation path limits:

| Operation | Canonical writes |
| --- | --- |
| initialize | Exact marker and six empty duplicate-ledger tables at S4 entry; no semantic declaration |
| record-discovery | Duplicate ledger and its immutable DCD record only |
| reserve-subject | Duplicate ledger, immutable DUP and uncommitted CC/LIN reservation evidence |
| assign-review | Duplicate ledger and immutable assignment |
| record-review | Duplicate ledger, immutable result, agreeing S4 VER companion |
| decide | One DDR row in duplicate ledger |
| record-effect | Duplicate ledger and immutable noncanonical DUE |
| admit | One composed duplicate/semantic/material transaction, bounded to duplicate ledger/DUE, semantic ledger, claim inventory, lineage, merge map and representation uses |
| seal | The existing C1 run-log append with all three closure hashes |

All operations preserve old table rows and immutable file bytes. Core checks
the complete prospective model before mutation, the precise new row count per
operation and all listed prerequisite bytes. `admit` must compose existing
semantic/material plans with the DUP decision; it may not call two independent
writes with a crash window between identity effects. No separate command or
generic workflow framework is needed.

Retain producer raw return, sealed producer request/view, accepted validation
report, reviewer requests/assignments, raw/validated returns, delivery hashes,
dispatch receipts, actual invocation/model identity and event-stream evidence.
Resolve every result to the exact accepted return before writing its row.
Worker output alone cannot write canonical files.

Reuse `LedgerWriter` locking, prepared/committed journals, preimage/after-image
checks, state/checkpoint and ledger-chain mechanics. The one composed journal
contains the Core duplicate plan plus existing semantic/material subplans,
accepted-return references, old/new checkpoint and chain hashes. A pending
journal must recover before another dependent operation starts. Recovery:

1. verifies run/runtime identity, journal identity, all immutable prerequisites
   and accepted-return bindings;
2. permits only each exact before or prepared-after image;
3. validates the reconstructed complete prospective state and remaining window;
4. completes the same transaction once, without allocating replacement IDs;
5. treats an identical retry as a no-op and refuses changed bytes under its key,
   missing prerequisites, forked prepared transactions or altered chain.

A completed older retry may validate its historical prefix after later legal
appends; it must not replay or rewrite those appends. At C1-closed resume,
validate the new seal and its referenced history but never repair it.
Cross-process crash tests must exercise real public/internal transport and
writer integration, not just direct helper calls. No helper, simulation,
static record or this design closes F-03. Broader resume/portability defects
remain explicitly carried.

## 20. Bounded prompt amendments

All amendments apply only through the new capability and pinned exact parts.
Keep the common preamble and Slice 6 constraint block verbatim.

**Merge Judge discovery task:** enumerate candidates from the shown current
catalogue, retain uncertain candidates, account for all shown windows, and
report missing comparison coverage honestly. No outcome, merge, fewer-rows
target, preferred grouping, calibration key or downstream information is an
input. Its fixed task is `Identify candidate comparisons in the attached
current-claim catalogue; do not decide equivalence.`

**Merge Judge comparison task:** compare the complete supplied group, enumerate
conditions/qualifiers/roles and all other distinctions, retain every occurrence,
propose only the closed outcome and legal treatment, and give a content basis
for a new successor only where appropriate. Its fixed task is `Propose one
duplicate-versus-overlap decision for the attached complete comparison basis.`
Replace the existing capability-specific “one claim, one row” pressure.
Do not change the retained predecessor-format prompt interpretation.

**L3 charter:** apply the exact return in section 13 and the fixed task in
section 11. Explicitly reward discovering a material surviving distinction,
not confirming compression. Return refuted for a concrete counterexample,
cannot-determine for insufficient frozen evidence, and upheld only after
unsuccessful affirmative attacks. In unresolved-record mode uphold only
faithful uncertainty recording. Never produce final successor prose or source
truth. This precise rule controls over the generic “prefer refuted” wording
when missing evidence is the issue.

**Successor-normalizer integration:** read only the reviewed content request,
member origin context and reserved existing lineage event. Express that
successor through the existing semantic return; neither group selection nor
L3 judgment is in scope. L2S retains its current charter and explicit ban on
duplicate decision-making.

**Orchestrator:** use Core constructors and plans; preserve assignments and
failures; refuse pre-review, post-refutation, indeterminate or post-C1
canonicalization; finish explicit relation review and all cumulative seals.
Never soften a reviewer result or parse policy from prose.

Amend `workers-judgment.md` with the new S4 comparison contract, and the
existing Merge Judge heading in `workers-intake-extraction.md` with its
capability-qualified selection rule. Do not leave two competing operative
Merge Judge contracts: the Core selector chooses the new exact task contract
for 1.8; pinned predecessors retain their old bytes. L5 gets only the bounded
structured flagged-pair return described in section 6.

## 21. Synthetic fixture families

Create a new `docs/fixtures/duplicate-overlap-review/` family, with synthetic
sources and immutable positive, blocked-admission and adversarial cases.
Do not rewrite retained fixtures or encode SRC-001 outcomes. Semantic
declarations below are challenge scenarios, not ground truth or an answer-key
oracle. Expected deterministic results concern internal structure only.

| ID | Synthetic case | Required evidence |
| --- | --- | --- |
| D8-F01 | Two occurrences both say “The indicator lit during trial A.” | Exact wording does not collapse the two occurrence identities |
| D8-F02 | “The indicator lit during trial A” / “During trial A the indicator was illuminated” | A declared paraphrase duplicate can undergo fresh L3 and separate L2S |
| D8-F03 | Indicator lit with switch enabled versus disabled | Condition distinction can refute duplicate |
| D8-F04 | Usually lit versus always lit | Named qualifier survives |
| D8-F05 | Lit in trial A versus every trial | Scope remains visible |
| D8-F06 | Can light versus must light | Modality challenge |
| D8-F07 | Observation versus author-attributed interpretation of it | Result/interpretation, attribution and content roles stay distinct |
| D8-F08 | Shared result with a separate retained condition in one claim | Overlap; both remain current, no LIN/map |
| D8-F09 | Lit versus did not light in the same declared trial | Shared-topic contradiction pair stays separate/tension-bearing; no truth winner |
| D8-F10 | Three source occurrences reporting the same bounded observation | Complete packet/source/occurrence union, including equal hashes |
| D8-F11 | Flattened chart description versus available table structure | Different material limitations can block comparison; no inferred values |
| D8-F12 | Similar sentences whose “it” has an unresolved antecedent | Ambiguity carried, not resolved by L3 |
| D8-F13 | Frozen context cannot determine equivalence | First-class unknown, visible finding, no absorption |
| D8-F14 | Three-member duplicate group | Direct group review; no pairwise-transitivity shortcut |
| D8-F15 | Eligible duplicate followed by faithful successor | Distinct L3, normalizer, L2S, required L2F and composed canonical records |
| D8-F16 | Same reviewed duplicate but successor drops “during trial A” | L2S refutes; DUP decision retained, no successor admission |
| D8-F17 | Two different internally coherent semantic outcomes | Both structurally PASS; no expected semantic answer in K2 |
| D8-F18 | Mechanically coherent semantic error, e.g. declared collapsibility of a real condition | Structural PASS retained beside an adversarial counterexample |
| D8-F19 | Retained 1.0–1.7 runs and explicit old format copies | Original behavior/pins; no retroactive review or migration |
| D8-F20 | Same-origin repeated report in two sources | Every occurrence retained; no automatic independent corroboration |
| D8-F21 | Same topic, different assertion with no claimed overlap | `distinct`, no extra relation taxonomy |
| D8-F22 | Exact assertion equivalence but origin independence unknown | Duplicate judgment can be retained; absorption blocked by binary-map origin requirement |
| D8-F23 | Identical K2.19 facet shapes but different source meanings | Fresh L3 may refute despite structural identity |
| D8-F24 | Different K2.19 facets with a declared coherent duplicate | Structural difference is not an equivalence oracle |
| D8-F25 | Metric/comparator differ or one baseline is absent | Metric and comparator attacks with exact anchors |
| D8-F26 | Incident relation proposal or carried restriction-relevant finding differs | Context kept visible; L3 cannot amend relations or import later authority |
| D8-F27 | Empty final candidate inventory after complete discovery/sweep | Accounting PASS only, no exhaustive semantic-recall claim |
| D8-F28 | Mixed group, revised subgroup, historical rejected group | All members/history retained; new exact subject and no double absorption |

Use at least one complete discovered 1.8 run through C1/C2/C3 and one
non-admitted unresolved history, not only detached schema objects. Include
composed multi-parent lineage history without inventing N-to-M types.
Native invocation is not simulated by naming fixture actors after models.

## 22. Deterministic mutation plan

Each mutation starts from a coherent synthetic record and changes a named
structural proposition. Reseal unrelated enclosing records where needed to
reach the intended check; report the actual failing token, not merely exit 1.

| ID | Mutation | Required refusal |
| --- | --- | --- |
| D8-M01 | Remove a compared CC | DUP_REFERENCE |
| D8-M02 | Use a historical target for a new current comparison | DUP_REFERENCE |
| D8-M03 | Repeat a member ID | DUP_REFERENCE |
| D8-M04 | Drop one same-text occurrence while preserving source set | DUP_EVIDENCE / DUP_ACCOUNTING |
| D8-M05 | Incomplete packet/source/provenance union or member mapping | DUP_ACCOUNTING |
| D8-M06 | Nonexistent representative member or claimed canonical successor | DUP_REFERENCE |
| D8-M07 | Absorbed predecessor remains in current output or is terminalized twice | DUP_ACCOUNTING / K2.15 |
| D8-M08 | LIN group/type/successor disagrees with map or effect | DUP_ACCOUNTING |
| D8-M09 | Change a SEM subject without a new DUP subject | DUP_SUBJECT |
| D8-M10 | Remove required reviewer assignment | DUP_REVIEW |
| D8-M11 | Remove required result/round-2 result | DUP_REVIEW |
| D8-M12 | Retarget result to another subject | DUP_SUBJECT |
| D8-M13 | Producer/reviewer or reviewer/reviewer context reuse | DUP_ISOLATION |
| D8-M14 | Extra attachment or withheld-context leak in delivered bundle | DUP_ISOLATION |
| D8-M15 | Invalid outcome/treatment enum | DUP_ENUM |
| D8-M16 | Admit unknown equivalence as duplicate | DUP_STATE |
| D8-M17 | Delete qualifier coverage/declaration, not semantically mislabel it | DUP_ACCOUNTING |
| D8-M18 | Delete condition coverage/declaration | DUP_ACCOUNTING |
| D8-M19 | Omit required ambiguity/material context or asset | DUP_SUBJECT / DUP_EVIDENCE |
| D8-M20 | Write `duplicate` or `overlap` as a REL family/type | Existing K2.16 and bounded-plan path refusal |
| D8-M21 | Admit S4 successor without required L2S/SEM preservation | DUP_REVIEW / K2.19 |
| D8-M22 | Post-C1 canonical rewrite or new comparison | DUP_WINDOW |
| D8-M23 | Inject new-format marker/artifact into predecessor control state | DUP_COMPATIBILITY |
| D8-M24 | Supply matching self-reported totals while omitting actual rows | DUP_ACCOUNTING |
| D8-M25 | Relabel fixture/static evidence native | DUP_ISOLATION |
| D8-M26 | Change current claim bytes, selected context or reviewer profile after assignment | DUP_SUBJECT |
| D8-M27 | Erase historical refuted/unknown proposal behind a later success | DUP_ACCOUNTING |
| D8-M28 | Collapsible source occurrence or semantic field retained only as history | DUP_STATE |
| D8-M29 | Map unknown origins to independent/restatement without reviewed new basis | DUP_STATE |
| D8-M30 | Orphan admitted CC, absent DUE or unmatched merge row | DUP_ACCOUNTING |
| D8-M31 | Wrong/duplicate C1 seal or seal outside exact C1 event | DUP_WINDOW |
| D8-M32 | Fake manual model/profile/effort or same actor in different passes | DUP_ISOLATION, after adopted manual clarification |
| D8-M33 | Duplicate JSON key, noncanonical bytes, malformed pointer/order | DUP_FORMAT / DUP_REFERENCE |
| D8-M34 | Extra review panel used to erase earlier failure | DUP_STATE |
| D8-M35 | Changed bytes under an existing transaction key or forked journal | DUP_STATE |

Each counterpart also includes the relevant lawful case: historical
`status=active`, unchanged predecessor source marker text, a coherent unknown
with no absorption, and a complete same-text multi-occurrence union must not
be mistaken for mutations. Semantic wrong answers belong to D8-F17/F18 and
adversarial review, not expected-answer mutation tests.

## 23. Process and freshness tests

Derive `native-dispatch|fixture-simulated|static-record|manual-separate-pass`
from actual retained evidence using existing execution honesty.

| ID | Process proposition |
| --- | --- |
| D8-P01 | Genuine fresh invocation, if separately authorized and actually run: request, assignment, terminal event stream, actual session/model and accepted return all match |
| D8-P02 | Fixture callback follows real sealed assemble/prepare/dispatch/accept path and stays fixture-simulated |
| D8-P03 | Static record validates only its retained structure and cannot satisfy native/agent freshness |
| D8-P04 | Actual manual distinct actors/passes versus synthetic declarations are reported separately; no fake profile |
| D8-P05 | Producer context reused by L3 is refused before canonical write |
| D8-P06 | Reviewer context reused by another reviewer/round is refused |
| D8-P07 | Forbidden attachment or extra task text is refused at assembly, verification and acceptance |
| D8-P08 | Proposal or basis changes after assignment: old result cannot bind revised bytes |
| D8-P09 | Accepted result retargeted to another DUP/VER fails |
| D8-P10 | Cannot-determine → required fresh second panel → revised new subject; old unknown remains |
| D8-P11 | Refuted/withdrawn/failed successor histories survive later valid success |
| D8-P12 | Canonical write before L3 completion, after refutation, or before L2S is refused without partial effects |
| D8-P13 | Crash/restart at reservation, assignment, result, DDR, effect and each composed admission write recovers once |
| D8-P14 | Crash at C1 preparation/each seal/checkpoint write recovers one matching composite closure |
| D8-P15 | Retry after later valid writes is a no-op; changed prerequisites or fork refuse |
| D8-P16 | Two overlapping candidate groups cannot consume the same current predecessor twice |
| D8-P17 | C1-only resume permits existing C2 work and refuses all duplicate/semantic/REL rewriting |
| D8-P18 | Producer global discovery and bounded L3 views differ exactly; unrelated catalogue prose never leaks to L3 |
| D8-P19 | L2S catches preservation failure without changing an upheld L3 decision or writing a successor |
| D8-P20 | Subject closure too large or transport unable to read supplied material yields honest pending/unknown, never truncated PASS |

D8-P01 is an evidence class, not authority to make a provider call. If no
genuine invocation is run, report `NOT RUN`; a simulated analogue cannot
satisfy it. Static or manual fixture evidence cannot be relabeled human
execution. Even successful native freshness evidence proves that invocation,
not universal semantic correctness or F-03 production reachability.

Process tests must invoke the installed/internal handoff and accepted-return
path, then the existing writer entrypoint with Core plans and actual quarantine
artifacts. Direct helper tests are useful structural tests but cannot stand in
for these process claims. Retain failed attempts and exact execution labels.

## 24. Actual dependency map and runtime parity

The producer inspected current implementations, not only the historical plan's
path list. This is a future change map, not authority to edit all neighbours.

| Surface | Required bounded future work |
| --- | --- |
| `scripts/lib/run-model.ts` | Add cumulative 1.8 capability and duplicate-artifact model/discovery without reinterpreting older formats |
| Proposed `scripts/lib/duplicate-review.ts` | Core schemas, serialization, basis/field enumeration, subjects, outcomes, assignments, closures, admission and write plans |
| Proposed `scripts/lib/checks-k2-duplicates.ts`; `scripts/lib/checks-k2.ts` | K2.20 and capability dispatch; no semantic oracle |
| `scripts/lib/lineage.ts`, `checks-k2-lineage.ts` | Reuse existing currentness/cardinality/provenance; bounded joins only if not wholly expressed by the new helper |
| `scripts/lib/relations.ts`, `checks-k2-relations.ts` | Reuse exact subject/taxonomy and proposal validation; no new relation type or authority |
| `scripts/lib/internal-ambiguity.ts` | Reuse working-subject/search/reference validation; no C2 lifecycle repair |
| `scripts/lib/source-representation.ts` | Reuse material subjects/views/availability/L2F; no new material taxonomy |
| `scripts/lib/semantic-review.ts` | Exact reviewed-request producer view, DUP-to-SEM admission prerequisite, composed plan integration; retain SEM schema and L2S policy |
| `scripts/lib/worker-return-contract.ts`, `scripts/validate-worker-return.ts` | New strict Core contract discriminators, portable validation and native JSON schemas; full-context binding versus standalone shape-only honesty |
| `docs/architecture/03-artifact-contracts.md`, `04-pipeline-stages-and-dod.md` | New artifact/outcome ownership and precisely cumulative S4 sequence/seal |
| `docs/architecture/templates/03-extraction-claims.md` | New T3.8 schema/accounting contract and bounded T3.5 cross-reference; retained historical rows stay unchanged |
| `docs/architecture/templates/07-verification.md` | Exact L3 target/assignment/result companion and execution classification |
| `docs/architecture/prompts/README.md`, `workers-intake-extraction.md`, `workers-judgment.md`, `verifier-lenses.md`, `orchestrator.md` | Capability-selected discovery/comparison/L3/L5 returns and reviewed successor integration |
| `docs/architecture/08-runbook-agent-mode.md`, `09-runbook-manual-mode.md` | Producer/reviewer sequence, actual process claims, unchanged OQ-01/manual doctrine, exact clarified manual representation |
| `docs/architecture/checker-spec/K1-K2-fixtures-and-runs.md`, `docs/PRECIS-CONFORMANCE-CHECKER.md` | K2.20 named structural guarantees/exclusions, discovery compatibility, unresolved-summary accounting |
| `adapters/loa/src/worker-bundle.ts` | Use Core part/context selection for existing roles and exact attachment closure |
| `adapters/loa/src/worker-dispatch.ts`, `worker-return.ts` | Preserve strict raw/canonical return bytes, native/fallback contracts, actual profile and fresh contexts; no provider refactor |
| `adapters/loa/src/ledger-writer.ts` | Execute Core duplicate/composed semantic/material plans under existing lock, chain and recovery |
| `adapters/loa/src/run-control.ts`, `runtime-snapshot.ts`, `cli.ts` | Bounded 1.8 stage/resume validation after recovery and before progress; unchanged public command grammar |
| `adapters/loa/src/types.ts`, profiles | Existing role IDs suffice; adjust only task/contract transport types required by exact Core schema, not semantic mappings or model slots |
| `adapter-protocol/runner-capability-contract.md`, `adapter.schema.json` | Register new return contract/format only where existing registry requires; no new host capability or exception |
| Adapter manifests, `core.manifest.json` | New format and exact owned/Core/checker inventories only; Hermes remains planned |
| New focused contract/mutation tests and `adapters/loa/tests/test-duplicate-review-process.ts` | Actual integration, semantic overreach guards and journal crash cases |
| `scripts/test-worker-return-contract.ts`, `scripts/test-conformance-mutations.ts` | Capability/native/fallback and complete discovered-run regression coverage |
| `scripts/compatibility-fixture-source.ts`, relevant existing test setup | Explicit predecessor pins where a test intentionally exercises an old contract; no rewriting retained fixture bytes |
| `docs/fixtures/duplicate-overlap-review/` | New synthetic complete runs and named adversarial cases only |
| `package.json`, runtime inventory/build metadata | Wire focused gates into full conformance and generated closure |

The inspected current `semantic-review.ts` already provides
`semanticPacketBasis`, `semanticOriginProjection`, `semanticMaterialViews`,
`validateSemanticSubject`, `semanticProducerView`, `validateSemanticRun`,
`planSemanticWrite`, `validateCompletedSemanticPlan` and accepted-binding
checks. Current `LedgerWriter.executeSemanticWrite` and
`advanceSlice5ClosurePhase` compose semantic/material state with C1.
Those are integration points, not proof that a production duplicate path
already exists. Helpers remain Core-owned.

The new worker contracts use
`contract_format=aleph-duplicate-output-contract/v1`,
`capability=duplicate-overlap-review`,
`task=discovery|comparison|refutation|contradiction-discovery`,
and the exact registered existing role. Both native schema and portable
fallback derive from Core; all variants reject unknown keys. Standalone
validation reports reference binding as `not-checked`; only the full sealed
run/request context can report `checked`.

Future runtime work must run canonical `npm run runtime:build` and
`npm run runtime:check`, never hand-edit `.js`. Extend the existing build
closure for any new imported Core modules and include generated checker paths.
Run the same positive, negative, coherent-semantic-error, return-contract,
capability and process cases against TypeScript and generated runtime.
Compare full reports, not just exit codes.

Repository tooling retains its Node floor; installed generated-runtime tests
use the actual supported Node 20 execution path and exact bundle identity.
Keep genuine retained 1.0–1.7 runs under original runtime/model pins, including
the current 1.7 manual L2S variant. Test literal new markers inside their frozen
sources as data. Do not make retained runs adopt new profile/role requirements.

Assemble/verify two clean immutable bundle sets and release packages from the
exact future implementation head. Require equal Core inventories/digests/bytes
across Loa and Hermes; distinguish content, provenance, lock, bundle and archive
identities. Loa structural READY does not mean sanctioned; no Hermes runner,
ordinary `loa` repository edit or mutable-main execution is introduced.

## 25. Implementation sequence and exact future DoD

Implementation may begin only after exact human adoption, Q8-MANUAL
clarification, and separate explicit implementation authorization.

1. Re-prove authority/base/branch/tree and preserved workstream identity.
   Freeze pre-change content, fixtures, profiles and full check outputs.
2. Implement Core capability, exact schemas, basis/field/occurrence
   enumeration, outcomes and strict return contracts. Verify native/fallback
   agreement and structural alternatives before host work.
3. Implement K2.20, durable ledger/subjects/results/effects, current versus
   historical prefix validation, unresolved summaries and overreach guards.
4. Integrate the existing S4 normalizer/L2S/L2F route and single composed
   admission. Keep existing lineage and relation ownership unchanged.
5. Add capability-selected prompts/views, existing-role transport, accepted
   return bindings, Core write-plan execution, recovery and C1 sealing.
6. Add complete synthetic runs, focused fixtures/mutations/process cases;
   regenerate runtime, test compatibility and installed parity.
7. Run full conformance, reproduce exact-head bundles/packages, inspect complete
   diff and publish producer reconciliation with carried findings.
8. Obtain a fresh independent completed-implementation audit before any merge
   consideration. Producer checks are not that audit and confer no merge
   permission.

The future implementation DoD is conjunctive:

- every applicable candidate/proposal is retained and accounted for; every
  attempted absorption has exact member/SEM/occurrence identity, complete
  declared context and fresh L3 evidence;
- the closed vocabulary, strict schema/native/fallback agreement, currentness,
  occurrence union, retained distinctions, exact profile/prompt/context binding,
  quorum, unknown behavior and role separation are implemented as specified;
- no canonical absorption before eligible L3 + separate successor L2S/L2F;
  no partial CC/LIN/map/USE/semantic/DUP transaction or post-C1 rewrite;
- historical failures, refusals, unknowns and later revisions remain
  reopenable; Précis section 17 includes the mechanically derived duplicate
  findings without promoting an unknown or refutation into source truth;
- comparison summaries derive from the final DUP ledger and immutable
  subject/result findings, with rows
  `{proposal_id,subject_digest,member_ids,finding_ref,review_verdict,effect}`.
  Include every producer/reviewer unknown, every refutation and every
  failed-successor effect, even behind later success. Display contradiction
  pairs as flagged assertions; never assign an S5 disposition by code;
- all D8-F families, D8-M mutations and non-native D8-P cases run over their
  named actual integration surfaces with counted case records;
  D8-P01 is either actual separately authorized evidence or explicitly NOT RUN;
- full repository typecheck, runtime drift, Core/admin, worker-return,
  discovered fixtures, conformance, lineage, relation, ambiguity, material,
  semantic, new duplicate, adapter, installer, bundle and release gates pass
  at the exact implementation head;
- TypeScript/generated/installed reports agree and retained 1.0–1.7 bytes,
  semantics and pins are unchanged; marker injection tests distinguish
  canonical control markers from frozen-source data;
- exact clean assemblies/releases reproduce, source/runtime inventories close,
  and the preserved adapter workstream/stash is unchanged;
- every carried finding remains at its recorded strength; no fixture/process
  result closes F-03 or inflates A7-04/A7-05/A7-08.

PASS may establish only named structural/process/runtime/compatibility
propositions. It establishes neither general equivalence correctness nor
exhaustive duplicate recall, SRC-001 replay or semantic validation, agent
sanction, acceptance, production readiness, golden status, or Aleph v1.
Manual mode remains the only sanctioned execution mode unless separately
changed by later authority.

## 26. Design delivery boundary and unresolved policy

This delivery changes only this proposal and one
`files.repository_administration` entry in `core.manifest.json`.
No adopted record, authorization, historical calibration file, Slice 7 history,
Core/checker/prompt/adapter/runtime/test behavior, current run format, retained
run, or fixture is changed. The manifest addition classifies this document; it
does not add it to a Core/runtime payload.

Producer validation for this delivery must inspect the exact two-file diff,
run `git diff --check` and applicable Core/admin validation, compare every
pre-existing tracked file against the starting byte inventory except the
single manifest administration insertion, and compare Core/checker/adapter
content digests. Run the existing generated-runtime drift check without
regenerating source. Recheck adopted proposal blobs and stash/workstream
identities. Report exact commit/tree/proposal blob after committing.

The genuine open human-policy question is Q8-MANUAL: exact manual L3
`reviewer_profile` representation under the explicitly limited L2S
clarification. The recommendation is concrete, but not adopted by this
producer. The outcome spellings, contradiction annotation placement,
all-comparison panel rule, conservative origin-unknown admission and new seal
are explicit proposed policies for adoption, not unspecified implementation
choices. No other load-bearing decision is delegated to implementation.

This proposal is to be committed and pushed on the named design branch.
No Slice 8 implementation, Slice 9 intent-fidelity work, blind SRC-001 replay,
adoption, implementation authorization, acceptance, release, or merge occurs
through this action.

SLICE 8 DESIGN PROPOSED — HUMAN AUTHORITY ADOPTION REQUIRED BEFORE IMPLEMENTATION

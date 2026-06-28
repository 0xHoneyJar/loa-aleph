# Aleph Routing & Clustering Doctrine

> **Status:** Accepted — provisional / known-limits recorded (see
> `docs/decisions/0002-routing-as-per-cluster-not-global-stance.md`).
>
> This document defines how Aleph forms clusters and routes them between its two processing
> arms, and how that work is carried in manual mode versus tool mode. It **refines** the
> single `cluster synthesis` step named in the Précis wedge completeness trail
> (`docs/precis-wedge.md`); it does not alter the wedge, the disposition ledger, the
> projection-stage separation (ADR 0001), or the conformance checker.
>
> **Nothing here is checker-enforced. Nothing here authorizes tooling.** It is doctrine that
> later slices may depend on, not schema that any code enforces today.

---

## 1. Aleph rejects a single global stance

Aleph does **not** model a corpus as globally *novel*, *known-domain*, or *hybrid*. That
framing is too coarse and fails twice:

- It asks the user to declare, up front, something Aleph is supposed to help surface.
- It hides the fact that **different regions of one corpus sit at different points** — a
  corpus is almost always part-novel, part-reconcilable-against-prior-art, in the same body.

Stance is therefore not a project label. It is resolved **per cluster**, after a
stance-neutral first pass, and it is split into two parts that must not be conflated:

- **Internal shape** — revealable from the corpus itself (how contradictory, how
  reference-dense, whether a doctrine-like spine exists). Aleph *may* surface this.
- **External existence** — whether prior art / competitors / reference architectures exist.
  This is **not in the corpus** and Aleph may **not** invent it. It comes from the user or
  from an explicit external-research intake (which is just more source dropped in).

## 2. Per-cluster routing posture

Each route cluster (defined in §3) carries a **provisional** routing posture:

- **adversarial / stress-test weighted** — pressure-test invariants, expose contradictions
- **convergent / referent-reconciliation weighted** — reconcile against competitors, repos,
  known systems, prior art, implementation constraints
- **hybrid / both arms required**
- **unrouted — pending external referent**

Posture is provisional because routing propagates (§7) and because an externally-dependent
posture cannot be finalized until its external fact is supplied (§8).

## 3. The four-layer cluster model

"Cluster" is not one object. It is four distinct objects with a traceable evolution between
them. Do not use bare "cluster" to mean a single stable thing from first pass to final
output.

1. **Packet index** — stance-neutral inventory of candidate-claim packets drawn from raw
   source. Each packet carries a stable ID that is a *re-entry coordinate* back to its source
   span. No grouping commitment yet. (This is the wedge's existing packet index.)
2. **Structural pre-cluster** — early grouping on **stance-free structural features only**
   (contradiction density, reference density, claim-type distribution). Provisional; makes no
   doctrine claim. **A pre-cluster is a tag, not a document — see §4.**
3. **Route cluster** — a doctrine-relative grouping formed once a doctrine-like spine
   emerges. These *are* doctrine-relative, and that is correct. The error would be pretending
   they came from the stance-neutral first pass. Route clusters carry routing posture (§2)
   and a derivation card (§11).
4. **Output cluster** — the clusters as they appear in final matrices, handoff packets, and
   the inputs to the separate projection stage (ADR 0001).

The chain `packet index → structural pre-cluster → route cluster → output cluster` is the
refinement of the wedge's `cluster synthesis` step.

## 4. Pre-clusters are tags, not documents

A structural pre-cluster has **no dedicated artifact**. It is a tag written next to the
packet IDs that belong to it (e.g. `PC-3`). Its existence and membership are reconstructable
by grouping packets on the tag. A pre-cluster that is never promoted to a route cluster
leaves only tags behind — zero card overhead.

This is the single rule that keeps the four-layer model carriable by hand (§10): the
expensive bookkeeping attaches only at the **route-cluster** layer, never at the pre-cluster
layer.

## 5. The two-arm model

Aleph **always preserves both arms as available machinery**:

- **adversarial arm** — stress-test invariants, pressure-test doctrine, expose contradictions
- **convergent arm** — reconcile against competitors, repos, known systems, prior art,
  implementation constraints

The difference between a Straylight-like novel build, a known-domain distillation, and a
hybrid product creation is **not separate runbooks**. It is the **weighting** of these two
arms across clusters. The pipeline does not fork; the dial does. Both arms exist for every
run; their relative weight is set per cluster.

## 6. Internal shape is a vector, not a single tag

A cluster is not assigned one shape category. Its internal shape is a **vector** of signals,
because a cluster can be several things at once (e.g. contradiction-bearing *and*
invariant-bearing — the contradiction is *what* stress-tests the invariant). Signals:

- contradiction density
- reference density
- invariant-bearing strength
- implementation-constraint density
- open-question density
- external-referent need
- doctrine-spine strength

**Routing reads the vector.** Forcing one tag per cluster repeats the mistake of collapsing
epistemic-type and disposition into one axis.

## 7. Routing is a dependency graph (propagation)

Routing postures are not independent labels assigned once per cluster. They form a
**dependency graph** and **propagate**:

- Resolving one cluster can change others. (If an invariant-bearing cluster is routed
  adversarial and *survives* the stress-test, an implementation-constraint cluster that was
  only load-bearing *if the invariant fell* can be demoted to background.)
- Routing is therefore **iterative**: assign provisional postures → process the
  highest-leverage cluster → re-route dependents on the result.
- A cluster's posture may change when a cluster it depends on is accepted, rejected, demoted,
  or elevated.

## 8. The compositional finalization gate

Aleph proceeds freely with indexing, packetization, candidate-claim inventory, structural
pre-clustering, open-question surfacing, and provisional route hypotheses. It is **not** a
total gate on progress.

The gate is on **finalizing externally-dependent claims**. These outputs may not be
finalized without user-supplied referents or explicit external-research intake:

- "this is novel"
- "this beats competitors"
- "this product spec is externally complete"
- "this architecture has no prior art"
- "this should be built this way rather than reconciled against X"

When the external referent is unknown, the output stays marked:

```
external-referent unresolved
routing provisional
requires user / research-supplied referent
```

The gate is **compositional**: an output is "externally complete" only if **every
load-bearing cluster in its provenance cone is externally-resolved.** One unrouted
load-bearing cluster taints the whole output, and the `external-referent unresolved` marker
propagates **upward** to any artifact built on that cluster. This is why the derivation trail
(§9) is not optional — it is what makes the compositional gate *computable*: you must be able
to walk the provenance cone and confirm no node is unrouted.

## 9. The derivation-trail invariant (hard)

Every route cluster must carry a derivation trail back to source:

```
route cluster
  → structural pre-cluster tags it drew from
  → packet / source IDs
  → candidate claim IDs
  → key dispositions
  → unresolved external referents (if any)
```

This invariant is **hard** and does not weaken in manual mode. What changes between modes is
*fidelity of representation* (§10), never the requirement that the trail exists and resolves
to source.

The purpose: a user can ask **"why this cluster?"** and Aleph reopens the **exact source
packets** rather than relying on a summary of summaries. The packet ID is a re-entry
coordinate, not a citation.

## 10. Manual mode vs tool mode

```
Manual mode  preserves RECONSTRUCTABILITY  — sparse cards; a tool/agent can rebuild the path
Tool mode    preserves the FULL DERIVATION GRAPH — every edge materialized
```

- **Manual mode** does not require a human to maintain every edge like a graph database. A
  human keeps a **sparse, legible derivation card per route cluster** (§11) — enough that an
  agent or later tool can reconstruct the full graph from raw source + cards.
- **Tool mode** maintains the full cluster-evolution and derivation graph, every edge
  materialized, with reverse indexes.

The shared invariant is **traceable reconstructability, not exhaustive hand-maintained graph
completeness.** This is what makes the four-layer model feasible by hand without forcing
tooling earlier than Aleph's manual-mode promise allows.

What is explicitly **too much** for manual mode (tool-mode only): a materialized per-edge
graph; a per-pre-cluster document; recording a disposition on every packet at index time;
maintaining bidirectional links by hand; rewriting cards on every propagation step; a
separate materialized cluster-evolution ledger document.

## 11. The sparse manual route-cluster card

The whole manual derivation trail for a route cluster is one card:

```
Route cluster ID:
Working name:
Routing posture:
Structural pre-cluster tags used:
Packet/source IDs:
Candidate claim IDs:
Key dispositions:
Unresolved external referents:
Depends on:
Blocks/finalization impact:
```

The card captures three directions of the graph as lists of IDs, not as a drawn graph:
`Packet/source IDs` + `Structural pre-cluster tags used` = downward provenance (→ source);
`Depends on` = lateral routing-dependency edges (§7); `Blocks/finalization impact` = the
upward gate-propagation anchor (§8). An agent reading the cards can rebuild the full graph; a
human never has to draw it.

### Smallest manual-mode invariant (explicit)

> - Every route-cluster card lists **exact packet IDs**.
> - Every packet ID **resolves to a reopenable source span**.
> - Therefore a user can ask **"why this cluster?"** and Aleph can **reopen source**, not
>   rely on a summary of summaries.

Stated as a hand-checkable (and later tool-checkable) rule: *no route-cluster card may exist
without ≥1 packet ID, and no cited packet ID may be absent from the packet index.* This is
the manual analogue of the checker's existing corpus-boundary rule — but it is **not**
implemented or enforced today (§13).

## 12. Known limits / validation ledger (hard)

```
validated:
  - heavy adversarial arm
  - light convergent constraint / stack-compatibility arm

not yet validated:
  - heavy convergent competitor/category reconciliation
  - known-category plus novel-delta hybrid
```

The only golden precedent (Loa-Straylight, built by hand) exercised a **heavy adversarial
arm** and only a **light convergent constraint** ("build on the existing stack, don't break
it"). It never ran a heavy convergent reconciliation against a known category, and it never
innovated on a known base. So:

- The entire **convergent-heavy half** of the two-arm model has **no replay case**.
- The **known-category-plus-novel-delta hybrid** — the mode a real distillation user most
  often needs — is the one mode the golden corpus **cannot teach**.

By Aleph's Popperian discipline, those arms have **not earned validation** and must not be
treated as proven. Closing this gap will eventually require a **second golden replay corpus**
for a known-domain / hybrid product distillation — not started, not authorized here.

## 13. What is explicitly NOT implemented or enforced yet

- **No conformance check** enforces routing, clustering, pre-cluster tagging, derivation
  cards, the finalization gate, or the smallest manual-mode invariant. The checker
  (`scripts/validate-precis-fixtures.mjs`) is unchanged and has no cluster/routing concept.
- **No fixture** demonstrates a route-cluster card or a routed corpus.
- **No extractor / generator / tooling** is authorized to produce packets, pre-clusters,
  route clusters, or cards. Manual mode is the only sanctioned path today.
- **No schema freeze.** The route-cluster card fields are doctrine, not a validated schema.
- **The convergent arm and hybrid seam are unvalidated** (§12) and may not be presented as
  proven.

A future slice may add a fixture and a conformance check for the route-cluster card, in
lockstep, once a replay case exists — deliberately, never inferred from this doc.

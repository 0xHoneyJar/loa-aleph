# Loa Aleph

> Loa Aleph is a research handoff substrate for agent systems: it compresses
> fragmented research, conversation history, citations, design notes, and
> unresolved claims / questions into portable context packets — Research Précis for repos
> to ingest.

## What Aleph is

Aleph is a **process substrate**. It turns a messy, bounded body of research —
raw conversations, deep-research output, citations, design notes, and unresolved
claims / questions — into a single **portable Research Précis file** that any downstream
repo or substrate can ingest.

The Research Précis is the artifact at the hinge of the process: it sits at the
**end of distillation** and at the **start of every downstream build**.

## What a Research Précis is

A Research Précis is a **complete-but-compact, projection-neutral** intermediate
representation. Its final form is deliberately deferred — it is a placeholder
that the consumer projects into whatever it needs.

The same Précis can become a PRD, a substrate, a control plane, a business
process, an experience, a landscape, or a product spec. Those are **consumer
projections**, not different Précis. There is one canonical Précis; the
renderings are many.

A Précis is characterized by three properties:

- **Complete by disposition coverage** — every candidate claim extracted from the
  declared corpus scope has a recorded disposition. Nothing load-bearing that
  entered the extraction pass silently vanishes.
- **Compact by normalization** — every claim appears once, carrying its
  provenance and status. Redundancy is stripped. Duplicate conviction is not
  allowed to masquerade as new evidence.
- **Neutral because final-form projection is deferred** — the Précis does not
  decide what it will become. The consuming repo or substrate does.

A Précis is therefore **not a loose summary** and **not a transcript**. It is
compact by normalization and complete only across the declared candidate-claim
disposition inventory: every candidate claim admitted into the extraction pass
must be carried, merged, deferred, excluded-with-reason, backgrounded,
judged-non-load-bearing, or unresolved.

## File-first, not endpoint

The Research Précis is a **portable file artifact** — something that can be
checked in, handed off, diffed, versioned, audited, and consumed by a repo.

Endpoint or integration surfaces may come later, but they **project from** the
artifact; they are not the artifact.

```
Précis  = canonical portable artifact
endpoint = optional later projection / delivery surface
```

## Where Aleph sits in the stack

Aleph is upstream of the products that consume its output. It is a separate
concern from the business-intelligence layer and from any product surface.

```
raw / fragmented research corpus
  ↓
Aleph
  ↓
projection-neutral Research Précis file
  ↓
┌───────────────┬───────────────┬────────────────┐
↓               ↓               ↓
Sensenet        Freeside        other Loa repos
business/       product/        future consumers
market intel    platform use
projection      projection
```

Sensenet is an adjacent optional consumer / projection layer, not a mandatory
intermediary between Aleph and Freeside. The Précis fans out to whichever
consumers need it; no single downstream sits on the path of any other.

- **Aleph** — research handoff / distillation substrate. Produces portable
  Research Précis files for repos to ingest.
- **Sensenet** — stack-wide business / market-intelligence substrate. Not
  Aleph; not Freeside-specific. (See its own repo.)
- **Freeside** — product / platform surface (token gating, teams, growth loops).
  The first concrete consumer context for current research, not the boundary of
  anything upstream.

## Status

Pre-implementation. The current scope is **Phase 0/1**: prove that a bounded
corpus can become one projection-neutral Précis file with a complete
candidate-claim disposition trail. See `docs/precis-wedge.md` for the wedge
definition and acceptance criteria, and `docs/responsibility-map.md` for what
Aleph owns and does not own.

No endpoint yet. No final schema freeze beyond the v0 acceptance envelope.

**Projection is a separate downstream stage.** The Précis itself stays strictly
projection-neutral and never generates a finished document. Aleph additionally
owns a distinct **projection stage** that *consumes* a finished Précis and
*renders* it into consumer documents (product-doctrine, architecture/primitive
map, responsibility/environment-verification map, mvp-wedge; and domain-specific
terminal renderings such as a PRD or SSD). Neutrality is a property of the
Précis, not of the repo. See `docs/decisions/0001-projection-as-separate-downstream-stage.md`.

# Aleph Responsibility Map

This document fixes what Aleph owns, what it does not own, and where its
boundary sits relative to the rest of the Loa stack. It is a boundary contract,
not an implementation plan.

## Ownership statement

> Aleph owns the process substrate and the portable Research Précis artifact. It
> does not own downstream projections such as PRDs, control planes, business
> processes, landscapes, product specs, or repo-specific implementation plans.
> Those are consumer projections. Aleph's first wedge proves only that a bounded
> corpus can become one projection-neutral Précis file with a complete
> candidate-claim disposition trail.

## Aleph owns

- The **distillation process**: source inventory → extraction → packet index →
  classification / disposition → duplicate/merge map → do-not-use boundaries →
  stress-test → cluster synthesis → unresolved/deferred queue → Précis.
- The **Research Précis artifact**: its acceptance envelope, its completeness
  contract, its normalization rules, its provenance and disposition ledger.
- The **completeness guarantee** — that every candidate claim within the declared
  corpus scope has a recorded disposition, and that the extraction criteria
  separating raw noise from candidate claims are themselves recorded.
- The **portability contract**: the Précis is a file that can be checked in,
  handed off, diffed, versioned, audited, and ingested.

## Aleph does not own

- **Downstream projections.** PRDs, control planes, business processes,
  landscapes, experiences, product specs, repo-specific implementation plans —
  these are produced by the consuming repo or substrate, by projecting from a
  Précis. Aleph stops at the projection-neutral artifact.
- **Business / market intelligence.** Competitor analysis, market landscape,
  protocol/product viability, GTM, positioning, revenue path — these do not
  belong to Aleph. Sensenet is a future adjacent stack-wide business/market-intelligence
  consumer of Aleph Précis artifacts. It is expected to project Précis material
  into business, market, competitor, GTM, protocol/product-viability, and
  commercial-intelligence artifacts for Loa repos, but Sensenet's own
  responsibility map, artifact contract, and wedge remain deferred until Aleph's
  Précis contract is stable.
- **Product / platform surfaces.** Token gating, teams, growth loops,
  community/commercial utility — these belong to **Freeside** and peer product
  repos.
- **Served endpoints.** The Précis is file-first. Endpoint or integration
  surfaces, if they ever exist, project from the artifact and are out of scope
  for the current phase.

## Boundary with the rest of the stack

```
raw / fragmented research corpus
  ↓
Aleph                                       (this repo)
  ↓
projection-neutral Research Précis file     (this repo's artifact)
  ↓
┌───────────────┬───────────────┬────────────────┐
↓               ↓               ↓
Sensenet        Freeside        other Loa repos
business/       product/        future consumers
market intel    platform use
projection      projection
```

- **Aleph fans out, it does not serialize.** The Précis is an adjacent input to
  whichever consumers need it. Sensenet is an optional consumer / projection
  layer, not a mandatory intermediary between Aleph and Freeside.
- **Aleph → any repo:** the same contract holds for any consumer. Aleph does not
  privilege a particular downstream. Freeside is the first corpus context only
  because the current research happens to be Freeside/token-gating related.

## Workflow roles (carried from the Loa-Straylight precedent)

```
User (Eileen) = product / architecture authority; approves and runs commits/PRs
Coordinator   = interprets, sequences, writes prompts and docs
Claude in repo = repo-local implementation worker
Codex in ~/loa-dev = independent repo auditor
GitHub PRs    = source-of-truth checkpoints
```

Repo work proceeds in phases. Implementation drafts and patches happen locally;
independent audit precedes PR; PRs are the source-of-truth checkpoints. The
architecture authority makes final architectural decisions and performs or
approves commits and pushes.

## What is explicitly out of scope right now

- No endpoint.
- No implementation / code.
- No downstream projection generation.
- No final schema freeze beyond the v0 acceptance envelope.
- No Sensenet formalization until the Aleph Précis contract is stable.

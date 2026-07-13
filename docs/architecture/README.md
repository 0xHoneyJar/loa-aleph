# Aleph Architecture Plan — The Agentic Research Method

> **Status: PROPOSED.** This tree is an architecture plan, not accepted doctrine.
> It authorizes no tooling, amends no accepted document, freezes no schema, and
> changes no checker behavior. Per Aleph discipline, each element here becomes
> real only through its own audited slice, approved by the product/architecture
> authority. Until then, treat everything under `docs/architecture/` as a
> detailed proposal handed to whoever builds next — agent or human.

## What this is

Aleph's accepted doctrine defines *what* must be true of a Research Précis
(completeness by disposition, compactness by normalization, projection
neutrality, per-cluster routing, derivation-trail reconstructability) and *what*
the repo owns (distillation, the Précis artifact, a separate projection stage).
What it does not yet define is the **full system that executes the method at
scale** — the agentic research method: how a Fable 5–class agent (or a human,
by hand) takes a messy corpus and drives it through distillation, verification,
and projection with every invariant held, every step checkpointed, and every
claim of capability backed by replay evidence.

This plan defines that system end to end: the architecture, the artifact
contracts, the pipeline with per-stage definitions of done, the agent
orchestration design grounded in Fable 5's actual capabilities, the
verification stack, the projection stage, operating manuals for agent mode and
manual mode, and a slice-by-slice build roadmap.

## Reading order

| # | Document | What it gives you |
|---|----------|-------------------|
| 1 | [`01-vision-and-tenets.md`](01-vision-and-tenets.md) | The product goal and the twelve design tenets everything else obeys |
| 2 | [`02-system-architecture.md`](02-system-architecture.md) | The layered system: doctrine plane, artifact substrate, engines, verification stack, runners, governance; run directory; ID scheme; run state machine |
| 3 | [`03-artifact-contracts.md`](03-artifact-contracts.md) | Every artifact in the system: purpose, producer/consumer, provisional fields, invariants |
| 4 | [`04-pipeline-stages-and-dod.md`](04-pipeline-stages-and-dod.md) | The stage graph S0–S13 and P1–P3, with inputs, outputs, blind-context rules, and a Definition of Done per stage |
| 5 | [`05-orchestration-on-fable-5.md`](05-orchestration-on-fable-5.md) | The agent-mode execution design: roles, context strategy, effort/model tiering, structured outputs, budgets, failure handling |
| 6 | [`06-verification-and-conformance.md`](06-verification-and-conformance.md) | The three verification tiers; conformance-kernel roadmap; verification-harness spec; golden replay protocol |
| 7 | [`07-projection-stage.md`](07-projection-stage.md) | Tier-1/Tier-2 projection architecture, the projection-trace contract, per-projection DoD |
| 8 | [`08-runbook-agent-mode.md`](08-runbook-agent-mode.md) | The operating manual an agent follows to execute a run |
| 9 | [`09-runbook-manual-mode.md`](09-runbook-manual-mode.md) | The operating manual a human follows, with sparse-bookkeeping worksheets |
| 10 | [`10-build-roadmap-slices.md`](10-build-roadmap-slices.md) | The phased build plan: slices, dependencies, per-slice Definition of Done, validation gates |
| 11 | [`11-research-grounding.md`](11-research-grounding.md) | The research behind the design: Fable 5 capabilities, agentic-research literature, and the mapping from findings to decisions |
| 12 | [`12-risks-open-questions-do-not-build.md`](12-risks-open-questions-do-not-build.md) | Risk register, open decisions, and the consolidated do-not-build list |
| 13 | [`13-build-handoff-codex.md`](13-build-handoff-codex.md) | **The builder's entry point**: mission, read order, work packages WP1–WP8 with per-package Definitions of Done |

## Build kits (the with-what)

Three subdirectories turn the plan into hand-off material a builder can
execute without design decisions left open:

| Kit | Contents |
|-----|----------|
| [`templates/`](templates/README.md) | Copy-into-a-run templates for every artifact: exact table shapes, filling rules, micro-examples, Précis rendering rules |
| [`prompts/`](prompts/README.md) | The prompt-pack drafts: assembly rules, common preamble, orchestrator prompt, all worker roles with bundles/withholds and output contracts, all verifier lens charters with quorum defaults |
| [`checker-spec/`](checker-spec/README.md) | Implementation specs for kernel increments K1–K6: per-check rules, exact FAIL formats, false-positive guards, negative-battery case lists |

**If you are the builder (Codex or otherwise): start at
[`13-build-handoff-codex.md`](13-build-handoff-codex.md).**

A reader who wants the shortest path to understanding: read 1, 2, 4, then the
runbook for your mode (8 or 9), then the slice you are building in 10,
consulting 3, 5, 6, 7 as the slice demands.

## One-page summary

```
                     ┌────────────────────────────────────────────────┐
                     │        DOCTRINE PLANE (accepted docs, ADRs)    │
                     │  wedge · responsibility map · routing doctrine │
                     └───────────────┬────────────────────────────────┘
                                     │ constrains everything below
 messy bounded corpus                ▼
 ──────────────►  S0–S13  DISTILLATION ENGINE  ──────────►  Research Précis
                  (intake → packets → claims →              (projection-neutral,
                   dispositions → evidence roles →           17-field envelope,
                   clusters → routing → arms →               conformance-checked)
                   synthesis → assembly → gate)                     │
                        │ every stage emits a                       ▼
                        │ ledger artifact into          P1–P3  PROJECTION ENGINE
                        ▼ the run directory             Tier 1: doctrine / primitive
                  VERIFICATION STACK                     map / responsibility / wedge
                  T1 conformance kernel (deterministic) Tier 2: PRD / SSD / …
                  T2 verification harness (adversarial   each with a projection trace
                     model judges, fresh context)        back to claim IDs
                  T3 human authority gates
                        │
                        ▼
                  GOLDEN REPLAY (fixtures + real corpora) keeps the
                  validation ledger honest: unvalidated arms stay marked
```

Two runners execute the same procedure against the same contracts: **agent
mode** (a Fable 5 orchestrator with worker and verifier subagents, file-first,
checkpointed by PRs) and **manual mode** (a human with worksheets and sparse
derivation cards). Repo-consumption mode ingests the artifacts. The difference
between modes is who runs the steps and how densely the bookkeeping is
materialized — never what the steps are or what must be true at the end.

## What this plan deliberately is not

- Not a doctrine amendment. The wedge, the disposition contract, ADR 0001, ADR
  0002, and the checker are untouched and load-bearing.
- Not implementation. No code, no schema freeze, no CI, no endpoint. Where the
  plan sketches field lists it sketches **provisional** shapes, in the same
  spirit as the v0 acceptance envelope: packets run first, matrices name the
  structure second.
- Not permission. The roadmap in `10-build-roadmap-slices.md` names the slices
  that would make each part real; each slice needs its own approval and audit.

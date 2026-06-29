# Eileen Daily Implementation Agent Mode Agent

This repo-local runbook must be read by the daily GPT-5.5 Thinking implementation agent before editing `0xHoneyJar/loa-aleph`. The agent must decide what should be implemented and why before coding, then write a PR report that traces every commit/file change back to repo value, scaling, security, and simplicity.

## Repository responsibility

`loa-aleph` owns research distillation: Research Précis files, claim disposition, projection-neutral handoffs, completeness-by-disposition coverage, and portable research artifacts.

Aleph must not become the product/runtime implementation repo for Freeside, Dixie, Hounfour, Finn, Straylight, or Arcturus work.

## Eligible input

Implement only from a Daily Deep Research Report or plan-audit item with `PROPOSED_NEXT_LANE_SEED`, candidate ID, repo-fit reasoning, acceptance criteria, rollback path, and `VERDICT: ACCEPT_PLAN`.

Without `VERDICT: ACCEPT_PLAN`, the agent may self-audit only docs, fixtures, tests, or checkers. Product/runtime work is out of scope.

## Required pre-implementation thesis

Before editing, write and preserve this analysis:

1. candidate issue, candidate ID, and verdict
2. what should be implemented
3. why it should be implemented now
4. why it belongs in Aleph and not a sibling repo
5. what this is good for
6. why the implementation path should work
7. how it advances Aleph's endgame as a research-to-implementation distillation substrate
8. creative future paths not implemented now
9. mass-user scaling impact for research volume, claim ledgers, issue projection load, artifact reuse, and reviewer load
10. security scope for source provenance, false claim propagation, instruction contamination, and repo-boundary drift
11. simplicity argument: how the design keeps research disposition explicit and avoids hidden implementation authority
12. non-goals, forbidden surfaces, checks, and rollback

If this thesis is weak, do not implement.

## Additive-only policy

Allowed by default: new docs, précis examples, fixtures, tests, validators/checkers, projection contract additions, and non-canonical candidate dispositions marked experimental.

Forbidden without explicit Eileen approval: deleting files, changing canonical précis semantics by default, changing completeness/disposition rules without accepted plan, product/runtime implementation, production migrations, broad refactors, unrelated dependency upgrades, sibling repo mutation, auto-merge, or closing source issues.

## Aleph-specific stop conditions

Stop with `VERDICT: NEEDS_HUMAN` if the candidate implements product behavior instead of research handoff logic, collapses projection-neutral artifacts into repo-specific conclusions, removes claim-disposition requirements, weakens completeness-by-coverage constraints, or mutates sibling repos from Aleph.

## Implementation steps

1. Read this file, README/package scripts, and nearby docs.
2. Confirm `VERDICT: ACCEPT_PLAN`.
3. Check for duplicate open issues/PRs.
4. Write the required pre-implementation thesis.
5. Create branch `daily-impl/YYYY-MM-DD-loa-aleph-<candidate>`.
6. Implement exactly one candidate with minimal diff.
7. Prefer explicit claim disposition and projection contracts over clever abstractions.
8. Run relevant checks.
9. Open a draft PR.
10. Add `CODEX AUDIT REQUEST` and the traceability report.
11. Comment: `@codex review for additive-only scope violations, précis/disposition semantic regressions, accidental product-runtime drift, scaling risks, security regressions, unnecessary complexity, failing or missing tests, rollback clarity, and repo-boundary violations`.
12. Do not merge or close the source issue.

## Required PR traceability report

Every implementation PR must include source issue and candidate ID, pre-implementation thesis summary, file-by-file change rationale, why each changed file is good for Aleph, why it advances the repo endgame, why it should work, mass-user scaling analysis, security scope, simplicity analysis, tests/checks, skipped checks, rollback path, future creative paths not implemented, and `CODEX AUDIT REQUEST`.

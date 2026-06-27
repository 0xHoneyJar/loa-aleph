# Eileen Daily Implementation Agent Mode Agent

This file is the repo-local runbook for the daily GPT-5.5 Thinking implementation agent. The daily prompt must explicitly read this file before editing this repo. It converts Daily Deep Research Report issues into one bounded additive PR.

## Repository responsibility

`0xHoneyJar/loa-aleph` owns research distillation: Research Précis files, claim disposition, projection-neutral handoffs, completeness-by-disposition coverage, and portable research artifacts.

Aleph must not become the product/runtime implementation repo for Freeside, Dixie, Hounfour, Finn, Straylight, or Arcturus work.

## Eligible input

Implement only from a Daily Deep Research Report or follow-up plan-audit item with:

- `PROPOSED_NEXT_LANE_SEED`
- candidate ID
- repo-fit reasoning
- acceptance criteria
- rollback path
- `VERDICT: ACCEPT_PLAN`

Without `VERDICT: ACCEPT_PLAN`, only docs, fixtures, tests, or checkers may be self-audited in-run. Runtime/product work is out of scope.

## Selection rule

Pick at most one candidate per run. Prefer:

1. docs-only précis/projection contracts
2. fixture-only research packet examples
3. test-only checker coverage
4. checker/validator-only additions
5. default-off précis validation tooling

## Additive-only policy

Allowed by default:

- new docs
- new précis examples
- new fixtures
- new tests
- new validators/checkers
- projection contract additions

Forbidden without explicit Eileen approval:

- deleting files
- changing canonical précis semantics by default
- weakening completeness/disposition rules
- broad refactors
- unrelated dependency upgrades
- sibling repo mutation
- auto-merge
- closing source issues

## Aleph-specific stop conditions

Stop and return `VERDICT: NEEDS_HUMAN` if the candidate would implement product/runtime behavior, collapse projection-neutral artifacts into repo-specific conclusions, remove claim-disposition requirements, or weaken completeness-by-coverage constraints.

## Implementation steps

1. Read this file, README/package scripts, and nearby docs.
2. Confirm the source item has `VERDICT: ACCEPT_PLAN`.
3. Check for obvious duplicate open issues/PRs.
4. Write a short plan: candidate, implementation class, allowed files, checks, rollback.
5. Create a branch named `daily-impl/YYYY-MM-DD-loa-aleph-<candidate>`.
6. Implement exactly one candidate with a minimal diff.
7. Run relevant checks.
8. Open a draft PR.
9. Add `CODEX AUDIT REQUEST` to the PR body.
10. Comment: `@codex review for additive-only scope violations, précis/disposition semantic regressions, accidental product-runtime drift, failing or missing tests, rollback clarity, repo-boundary violations, and security regressions`.
11. Do not merge and do not close the source issue.

## PR body requirements

Include source issue, candidate ID, implementation class, what changed, what did not change, checks run, skipped or failing checks, rollback path, and Codex audit request.

## Final run report

Report selected repo, source issue, branch, PR URL, files changed, checks run, Codex review status, blockers, and boundaries approached.

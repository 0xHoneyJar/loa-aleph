# CLAUDE CONTINUATION PACKET — EILEEN’S CHROMATOGRAPHY SYSTEM

Date: 2026‑06‑30
Run ID: 2026‑06‑30‑aleph-report-fixture

## Objective

The goal of this continuation is to operationalize the selected action from the Daily Agent Decision packet: **create a projection‑neutral daily research report fixture in the `loa‑aleph` repository**.  The fixture should standardize how daily research is documented so that future runs produce consistent, transparent inputs for the chromatography separation process.  Claude should implement or refine the fixture documentation without making any new strategic decisions.

## Target repository and source PR

* **Repository:** `0xHoneyJar/loa-aleph`
* **Branch:** `agent/chromatography-2026-06-30-aleph-report-fixture`
* **Source PR:** The Daily Decision PR created from this run (see PR link in summary).  Claude should work on that branch and prepare changes as additional commits or comments on the same PR; do not open a new PR.

## Source daily research issues

Claude does **not** need to reread or reinterpret the daily research issues.  The Agent Decision Packet already distilled them.  For context, the relevant issues came from:

- `0xHoneyJar/loa` — issue #1165 (updated 29 Jun 2026)
- `0xHoneyJar/loa` — issue #1159 (updated 28 Jun 2026)
- `0xHoneyJar/loa-hounfour` — issue #167
- `0xHoneyJar/loa-freeside` — issue #393
- `0xHoneyJar/loa-freeside` — issue #385
- `0xHoneyJar/loa-finn` — issue #245
- `0xHoneyJar/freeside-characters` — issue #185
- `0xHoneyJar/loa-straylight` — issue #106
- `0xHoneyJar/loa-aleph` — issue #12
- `0xHoneyJar/loa-arcturus` — issue #5

These issues informed the selected action but should **not** be revisited or altered.

## Upstream lineage

This continuation derives from the Daily Agent Decision packet and associated PR.  Claude must preserve the provenance established by the Agent Decision stage and ensure all changes remain traceable to this run’s branch and PR.  Do not delete or overwrite existing files created by the agent; instead, append or update as instructed.

## Allowed files and repositories

Claude may read and modify **only** the following:

- `docs/fixtures/daily-research-report-fixture.md` in the `loa-aleph` repository.  This file contains the projection‑neutral fixture for daily research reports.
- The PR description and review comments in the source PR.  Comments should clarify implementation details or raise questions; they should not re-decide the global verdict.

No other repositories or files may be changed.

## Forbidden actions

- Do **not** alter the decision packet or change its conclusions.
- Do **not** modify runtime code, schemas, or build scripts.
- Do **not** create new branches or new PRs.
- Do **not** reassign repository ownership or restructure the project.
- Do **not** re-open or reinterpret the daily research issues; treat them as closed inputs.

## Expected artifact

Claude should ensure that `docs/fixtures/daily-research-report-fixture.md`:

1. Exists in the `loa-aleph` repository on the target branch.
2. Defines a clear, projection‑neutral template for daily research reports, including fields for date, run ID, issue index, fraction classification, source novelty, AI relevance, ownership vectors, candidate comparison, selected action, and handoff recommendations.
3. Uses concise headings and lists so that future agents or researchers can fill it out quickly without embedding long prose.

The fixture need not be perfect on the first try but should capture the key sections required by the chromatography process.

## Acceptance criteria

- The file `docs/fixtures/daily-research-report-fixture.md` is present and contains the requested structure.
- The template uses markdown headings (##, ###) and bullet points for clarity.
- The template avoids referencing specific dates or issues; it should be generic.
- The PR shows the file addition or update and passes any repository linting or CI checks if they exist.
- Claude does **not** change any other files or repository settings.

## Validation steps

1. Open the PR in GitHub and confirm that the file `docs/fixtures/daily-research-report-fixture.md` appears in the diff.
2. Review the template and ensure all required sections are present and generic.
3. Run any repository markdown linter or CI checks to verify formatting, if applicable.
4. Post a brief comment in the PR summarizing completion and link to the updated file.

## Kill criteria

If Claude encounters any of the following, it should stop and report back instead of proceeding:

- Missing write permissions to the branch or repository.
- A conflict preventing the file from being created or updated.
- Any evidence that another concurrent PR or commit has superseded this work.
- Instructions from Eileen or a human reviewer to halt or change direction.

## What Claude must not re-decide

- The global verdict (`PLAN_ONLY`) and selected action (creating the daily research report fixture) have already been decided.
- Claude must not reinterpret the daily research signals or change the chromatography fractions.
- Claude must not propose alternative actions, verdicts, or workflow mutations.

## What Claude should report back

When the task is complete or blocked, Claude should report:

- The PR link and commit hash where the fixture was added or updated.
- Whether the acceptance criteria were met.
- Any questions or uncertainties encountered.

## Exact next command for Eileen

After reading this packet, Eileen can instruct Claude with the following command:

```
@claude run-task
```

Claude will then perform the implementation steps described above and update the PR accordingly.

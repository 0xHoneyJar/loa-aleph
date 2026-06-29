# DAILY RESEARCH REPORT FIXTURE

> **Purpose:** This template provides a projection‑neutral structure for Daily Research reports in the Loa system.  Each Daily Research run should produce a report following this template.  Keep entries concise—use bullet points and short phrases rather than long prose.  Do not copy prior research verbatim; instead, classify and distill signals and decisions.

## Date and Run Information

- **Date:**
- **Run ID:**

## Source Issues Summary

List the daily research issues inspected in this run.  For each issue, include:

- **Repo:**
- **Issue number:**
- **Title:**
- **Created/updated:**
- **Verdict from issue:**
- **Candidate actions, if any:**
- **Freshness:** fresh / stale / repeated / blocked

## Chromatography Separation

Separate signals from the research into fractions.  For each fraction:

- **Fraction name:** (e.g., BUSINESS_OPPORTUNITY, SAFETY_OR_PROOF, WORKFLOW_IMPROVEMENT, etc.)
- **Signals captured:** brief bullet points summarizing the relevant signals or claims.
- **Reason:** why these signals belong in this fraction.
- **Movement:** DIVERGE / CONVERGE / CLOSE / WATCH / REJECT / MUTATE_WORKFLOW / NEEDS_HUMAN.
- **Business or workflow implication:** optional short note.
- **Ownership implication:** which Loa organ or repo likely owns this fraction.

## Source Novelty Assessment

For recurring themes or sources, classify novelty:

- **Signal:**
- **Status:** NEW / REACTIVATED / TREND_CONFIRMED / CARRIED_CONTEXT / SATURATED / SUPERSEDED / REJECTED.
- **Why:** rationale for the status.

## AI Development Relevance

For each notable AI‑world development encountered:

- **Signal:**
- **Novelty status:** as above.
- **Impact on Loa stack or business:** if any.
- **Workflow impact:** if any.
- **Decision:** USE / WATCH / SATURATE / REJECT / ROUTE_TO_HUMAN.

## Candidate Comparison

Summarize competing actions identified in the research.  For each candidate:

- **Candidate ID or name:**
- **Repo or area:**
- **Summary:** what the candidate proposes.
- **Ownership vector:** key owners (semantic, schema, runtime, route/API, evidence, product surface, business, consumers).
- **Movement:** DIVERGE / CONVERGE / CLOSE / WATCH / REJECT / MUTATE_WORKFLOW / NEEDS_HUMAN.
- **Value score:** high/medium/low with supporting notes.
- **Cost/risk score:** high/medium/low with supporting notes.
- **Status:** open / blocked / saturated / watch / rejected.
- **Reason:** succinct explanation.

## Selected Action and Verdict

After comparing candidates, record the chosen global verdict and selected action.

- **Global verdict:** BUILD / NO_BUILD / WATCH / NEEDS_HUMAN / PLAN_ONLY / MUTATE_WORKFLOW.
- **Selected action:** brief description or `N/A` if no build.
- **Rationale:** why this action wins today, referencing value vs. cost/risk and ownership clarity.

## Handoff / Execution Recommendations

- **Execution route:** CHATGPT_CAN_CONTINUE / CLAUDE_CONTINUATION_READY / CODEX_AUDIT_READY / HUMAN_DECISION_REQUIRED / DO_NOT_EXECUTE.
- **Key notes for the next agent or model:** summary of what should be done next and what must not be reconsidered.

## Workflow Learning Notes

Capture observations about the research and decision process itself.  What improved?  What failed?  What should be adjusted in future runs?

- **Daily research quality:**
- **Repeated sources management:**
- **Chromatography separation quality:**
- **Ownership routing:**
- **Convergence/divergence decisions:**
- **Agent capability lessons:**
- **PR/handoff quality:**
- **Business or safety signals:**
- **Open questions for next run:**

## Capability Trace Checklist

Tick off actions performed during this run.  Answer yes/no for each, with a short note if yes.

- Read GitHub issues:
- Read PRs:
- Wrote GitHub comments:
- Created or updated issues:
- Created or updated PRs:
- Created a branch:
- Modified files:
- Merged code:
- Observed GitHub actor(s):
- Boundary hit:
- Uncertainties:

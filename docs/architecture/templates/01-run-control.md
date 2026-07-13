# Templates 01 — Run Control

## T1.1 Run manifest → `runs/<run-id>/run-manifest.md`

```markdown
# Run Manifest — ⟨RUN-slug⟩

## Identity
- run_id: ⟨RUN-slug⟩
- mode: ⟨agent | manual | hybrid⟩
- created: ⟨YYYY-MM-DD⟩
- doctrine_sha: ⟨git SHA of loa-aleph main this run obeys⟩
- runbook: ⟨path + version of the runbook followed⟩

## Corpus binding
- corpus_ref: corpus/manifest.md
- corpus_hash: ⟨sha256 over the sorted per-source hashes⟩
- declared_scope: >
    ⟨2–6 sentences: what claims are in scope; what is explicitly out.⟩

## Execution profile
| field | value |
|-------|-------|
| model_ids (per role, exact strings; or "human") | ⟨…⟩ |
| effort policy deviations from doc 05 §5 | ⟨none | list⟩ |
| fan-out limits | ⟨…⟩ |
| budgets granted (per stage, tokens) | ⟨table or "n/a (manual)"⟩ |

## State log  <!-- append one row per transition; order must match doc 02 §3 -->
| # | state | entered | actor | note |
|---|-------|---------|-------|------|
| 1 | DRAFT | ⟨date⟩ | ⟨who⟩ | run created |

## Authority sign-offs  <!-- append-only -->
| gate | decision | by | date | reference |
|------|----------|----|------|-----------|
| S0 corpus scope + sensitivity | ⟨approved/…⟩ | ⟨authority⟩ | ⟨date⟩ | ⟨run-log anchor⟩ |

## Unvalidated-machinery notices  <!-- mandatory rows when triggered -->
| what ran | why noted | date |
|----------|-----------|------|

## Deviations from runbook
| # | what | why | approved-by |
|---|------|-----|-------------|
```

Rules: `model_ids` are exact (`claude-fable-5`), never aliases like "latest";
a mid-run model change is itself a deviation row plus an authority sign-off;
hybrid mode lists per-stage actors in the execution profile.

## T1.2 Run log → `runs/<run-id>/run-log.md`

```markdown
# Run Log — ⟨RUN-slug⟩
<!-- Append-only. One entry per event. Write for a reader who was not
     watching: complete sentences, spell out terms, no arrow-chains. -->

## ⟨YYYY-MM-DD HH:MM⟩ — ⟨STAGE⟩ — ⟨entry|exit|decision|anomaly|gate|spend⟩
⟨2–6 sentences. For exits: counts produced, DoD items closed, spend.
For decisions: what was decided, the one-line why, which ledger row records
it. For gates: the question, options, recommendation. For anomalies: what
was observed, what was done, where it is recorded.⟩
```

<!-- example -->
Example entry:

```markdown
## 2026-07-15 14:10 — S2 — exit
Extraction finished for all four sources. 87 packets written to
ledgers/packet-index.md (SRC-101: 21, SRC-102: 24, SRC-103: 19, SRC-104: 23).
Per-source completion declared for each. Coverage spot-check dispatched to
the harness (verification/harness/S2-coverage/). Spend this stage: 412k
tokens of the 600k budget.
```

## T1.3 Kernel report → `runs/<run-id>/verification/kernel-report.md`

```markdown
# Kernel Report — ⟨RUN-slug⟩
- checker_version: ⟨git SHA of scripts/ at run time⟩
- command: `⟨exact command line⟩`
- date: ⟨YYYY-MM-DD HH:MM⟩
- result: ⟨PASS | FAIL⟩

## Output (verbatim, complete)
```text
⟨paste the checker's full stdout/stderr⟩
```
```

Rules: the pasted output is never edited or truncated; a FAIL report is
committed too (it is evidence of the loop, not shame); one report file per
invocation, numbered `kernel-report.md`, `kernel-report-2.md`, … with the
latest linked from the run log.

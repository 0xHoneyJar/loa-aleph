# 12 — Risks, Open Questions, Do-Not-Build

> Status: PROPOSED (see [`README.md`](README.md)). Re-walk this document at
> every phase boundary of [`10-build-roadmap-slices.md`](10-build-roadmap-slices.md).

## 1. Risk register

| # | Risk | Likely? | Hurts? | Mitigation (where) | Residual truth |
|---|------|---------|--------|--------------------|----------------|
| R1 | **Schema ossification** — provisional shapes harden by habit before evidence names them | high | med | every contract marked provisional; envelope review is its own slice (10 §20); checker follows doctrine, never leads | some de-facto freezing is inevitable; make it deliberate at slice 20 |
| R2 | **Bureaucratic overgrowth / false precision** — ledgers metastasize; the method becomes forms about forms | med | high | sparse manual-mode rules (doc 09); bounded vocabularies; one-adversarial-layer ceiling; "tags not documents"; slice audits ask "what did this field earn?" | vigilance is the only real control; prune fields that never changed a decision |
| R3 | **Silent completeness loss at extraction** — spans never packetized are invisible to every later guarantee | med | **highest** | over-extraction bias; per-source completion declarations; blind coverage spot-checks; extraction recall as the headline replay metric (docs 04 S2, 06 §5) | sampling can miss; recall numbers come with confidence, not certainty |
| R4 | **Fabrication at normalization/synthesis** — restatements smuggle outside knowledge; synthesis asserts beyond dispositions | med | high | entailment spot-checks; refute-first synthesis review; phantom-rate metric; no-external-facts rule in every judgment prompt | LLM-judged entailment is itself fallible; audit keeps humans in the loop |
| R5 | **Verifier gaming / theater** — producers learn what refuters check; declared removal effects gamed; upheld-everything panels | med | high | lens diversity; blind bundles; adversarial fixtures seeded with traps; "panel upholds everything ⇒ suspect leakage" (doc 08 S9a); independent audit stays mandatory | acknowledged unsolved in general; the audit layer is the backstop |
| R6 | **Orchestrator failure modes** — state drift, skipped DoD boxes, silent loops (the literature says failures concentrate here) | med | high | single-writer ledgers; DoD-as-barrier; resumption-from-files; 3-strikes escalation; run-log discipline (docs 05 §9–10, 08) | a sufficiently wrong orchestrator can still narrate compliance; replay + audit catch it after the fact |
| R7 | **Cost blowup** — verification multiplies tokens; 1M-context stages are expensive | high | med | budgets per stage with BLOCKED-not-truncate; batch lane; cache discipline; cost as a reported replay metric before scale-up (doc 05 §7) | first real-corpus run (slice 14) is the honest price tag |
| R8 | **Prompt/answer-key leakage between stages** — the runtime version of the corpus-blindness problem | med | high | bundles-not-requests; X3 generalized (later-stage vocabulary must not appear in earlier-stage artifacts); leakage as a named defect class | subtle leakage (phrasing echoes) is hard to detect mechanically |
| R9 | **PII / confidentiality in real corpora** — instance #1 is real conversations | high | high | S0 sensitivity flags + authority rulings before extraction; sensitivity handling rules travel with sources; projections inherit flags | policy for redaction-vs-exclusion is an open question (Q8) |
| R10 | **Checker brittleness / prose-policing creep** — T1 grows regexes that false-positive on legitimate prose | med | med | hard/soft split (T1 structural only); deferred-as-brittle list honored; negative batteries include false-positive guards | the checker doc's discipline has held for five slices; keep it |
| R11 | **Convergent arm stays unvalidated but gets used anyway** — schedule pressure normalizes S9b output | med | high | unvalidated-arm notice is mandatory in manifest + Précis known-limits; validation ledger is checked by audit | culture risk more than mechanism risk |
| R12 | **Model drift / non-reproducibility** — same run, different month, different behavior | high | med | pin model IDs + doctrine SHA per run; goldens are permanent; re-run replays when models change (doc 06 §5) | bitwise reproducibility is not on offer; contract-level equivalence is the standard |
| R13 | **Refusal-blocked content skews completeness** — safety classifiers refuse spans of a legitimate corpus | low | med | `refusal-blocked` as a recorded extraction class; manual-mode fallback for those sources; accounting still balances (doc 05 §9) | a heavily-affected corpus may need a different model or manual run (authority call at S0) |
| R14 | **Scope creep into Sensenet/Freeside territory** — projections quietly become market intel or product surfaces | med | med | responsibility map; projection plugin registry reviewed at acceptance; do-not-build list below | fan-out pressure is permanent; the boundary is doctrinal |
| R15 | **The plan itself over-specifies** — this tree becomes step-scripts that degrade execution (the de-prescription finding, applied to us) | med | med | contracts state *what must be true*, runbooks state judgment calls; slice 7 review explicitly prunes; prompt-pack audit checks for step-scripts | the tension is real; err toward invariants over instructions |

## 2. Open questions (each needs an owner and a decide-by slice)

| # | Question | Context | Decide by |
|---|----------|---------|-----------|
| Q1 | **Recipe vs invariants** — how prescriptive may instructions be before they fight the doctrine's method-neutrality (the fork PR #16 stayed independent of)? | tenets T1/T10 vs R15 | slice 7 |
| Q2 | **Hard vs soft conformance** — ratify the proposed split (T1 few/hard/fail-closed; T2 evidence-not-exit-codes)? | doc 06 §1 | slice 7, confirmed in practice at slice 9 |
| Q3 | **Envelope amendments** — do evidence-role summary and routing/card summary join the 17 fields, and when? | artifact 17; R1 | slice 20 (informed by 10, 11, 14) |
| Q4 | **Span-locator scheme per source format** — line ranges? message indices? content-anchored quotes? (chat exports re-serialize badly) | artifact 4; ID rules | slice 9 |
| Q5 | **Claim-type field** — does it earn its place in the inventory, or is it prose-policing bait? | artifact 5 | slice 9/10 fixtures |
| Q6 | **ID stability mechanics** — hash-matched reuse across re-runs: exact matching rules, collision policy | doc 02 §2 | slice 9 (paper), slice 13 (practice) |
| Q7 | **Incremental corpora** — new material after a run: always a new run? corpus extensions with Précis versioning? diff-Précis? | corpus-freeze rule | after slice 14 (real need will teach) |
| Q8 | **Redaction vs exclusion for sensitive spans** — how does a redacted span keep a working locator and honest accounting? | R9 | before slice 14's S0 |
| Q9 | **Verifier quorum/sampling defaults** — the doc 06 §3 numbers are placeholders | doc 06 | slice 13 sets, slice 14 confirms |
| Q10 | **Hybrid-mode manifest conventions** — per-stage actor recording when humans and agents split a run | doc 09 §5 | slice 15 |
| Q11 | **Where verifier detail lives relative to the Précis** — verification *summary* is envelope §16; are verdict files portable companions or run-internal? | artifacts 15/17; portability contract | slice 9 |
| Q12 | **Runner packaging** — when agent mode is sanctioned, do prompt-packs ship as plain docs, or as harness-native skills/commands? (must not fork manual mode) | doc 02 §4 | after slice 13 |

## 3. Do-not-build (consolidated, standing)

Carried from doctrine, issue #18's anti-collapse notes, and this plan's own
boundaries. Building any of these requires a doctrine change first, not a
slice:

- **No served endpoint / API / live service.** File-first stands. Integration
  surfaces, if ever, project from artifacts.
- **No web crawler / live citation resolver / general search engine.**
  External material enters as scoped intake through S0/REF, or not at all.
- **No truth engine.** The method verifies *support within a declared
  corpus*, never facthood at large. The checker never judges semantics; the
  harness never claims more than "survived attack".
- **No AI-content detector.** Source trust classes record provenance; nothing
  guesses authorship.
- **No causal model-internals attribution.** Evidence roles are declared,
  attackable honesty — not attention forensics.
- **No graph database / knowledge-graph product.** Typed tables in Markdown;
  the graph is reconstructable, not enshrined.
- **No ranking/recommendation product; no citation-count scoring.** Volume is
  never quality (T12).
- **No business/market-intelligence projections inside Aleph** (Sensenet's
  future lane) and **no product/platform surfaces** (Freeside's lane).
- **No blanket bans on AI-generated sources.** Classify and bound them
  (trust class, evidence roles); don't censor the corpus.
- **No invisible pre-extraction discard path** under any label ("low
  quality", "obviously irrelevant") — the criteria + dispositions are the
  only gate.
- **No schema freeze by accident** — only by slice-20-style decision.
- **No autonomous authority** — the agent never accepts its own work, merges
  to `main`, supplies external facts, or overrides a gate. Ever.

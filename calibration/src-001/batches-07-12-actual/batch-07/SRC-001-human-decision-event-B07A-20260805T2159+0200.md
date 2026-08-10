# SRC-001 Human Decision Event — Batch 07A

> NONCANONICAL HUMAN-SUPERVISED EXTRACTION-CALIBRATION RECORD

- recorded at: `2026-08-05T21:59:00+02:00`
- source: `SRC-001`
- authority: human
- adopted gap: `G-027`
- adopted original candidate: `C-146`
- last fully accounted source line: `L478`
- next source line: `L479`
- next gap: `G-028`
- next candidate: `C-147`
- next candidate locator: `L480-L481`
- SRC-001 closed: `false`
- SRC-002 started: `false`
- earlier artifacts mutated: `false`

## Exact Human Decision Block

Adopt every decision in this block exactly as written

G-027 — L469-L475

Decision: no packet appropriate.

Exact frozen evidence:
L469: empty LF line
L470: Supplementary Material
L471: Here we provide additional details on (A) related work, (B) CLEVR from pixels, (C) CLEVR from
L472: state descriptions, (D) Sort-of-CLEVR, (E) bAbI, and (F) Dynamic physical system reasoning. For
L473: each task, we provide additional information on the dataset, model architecture, training and results
L474: where necessary.
L475: A Related Work

Exclusion reason: L469 is blank administration; L470 and L475 are headings; and L471-L474 are a contents and navigation description. The passage does not state a substantive architecture, training method, empirical result, constraint, or design proposal. Mentioning the categories “dataset, model architecture, training and results” does not itself satisfy an admission criterion.

Exclusion class: document-administration.

Missing-packet decision: none.

Dependencies: none.

Citation treatment: none.

Duplicate or overlap treatment: none.

Degradation flags: none.

Restriction: Do not convert the supplementary-contents description into a substantive claim that the supplement establishes any particular architecture, training procedure, or result.

C-146 — L476-L478

Disposition: edit.

Criterion: 2.

Authorized retained exact evidence:
Since the RN is highly versatile, it can be used for visual, text-based, and state-based tasks. As such,
it touches upon a broad range of areas in machine learning, computer vision, and natural language
understanding.

Excluded exact evidence:
Here, we provide a brief overview of some of the most relevant related work.

Reason: The first two sentences assert RN versatility, identify visual, text-based, and state-based application scopes, and state the associated disciplinary breadth. The final sentence only announces the related-work overview and is document navigation.

Normalized wording: The source describes the RN as highly versatile and usable for visual, text-based, and state-based tasks, spanning areas in machine learning, computer vision, and natural language understanding.

Dependencies: none. “As such” resolves to the preceding retained sentence inside the same evidence span.

Citation treatment: none.

Duplicate treatment: no duplicate representative.

Overlap treatment: preserve this occurrence and its provenance. Its specific task modalities and disciplinary scope are not silently merged into broader RN-versatility statements.

Evidence role: architectural and application-scope assertion, not an empirical performance result.

Degradation flags: none.

Repair treatment: narrow C-146 in place. Do not create a new split unit or missing packet.

Restrictions:
Do not change “can be used” into demonstrated success across every listed task or field.
Do not infer comparative superiority, generalization performance, or measured versatility.
Do not count this prose as independent empirical evidence for results reported elsewhere.
Do not retain the related-work announcement as substantive evidence.

No earlier event, checkpoint, proposal, receipt, correction record, or immutable input is modified by these decisions.

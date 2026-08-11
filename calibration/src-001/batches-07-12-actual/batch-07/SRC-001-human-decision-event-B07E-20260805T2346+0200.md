# SRC-001 Human Decision Event — Batch 07E

> NONCANONICAL HUMAN-SUPERVISED EXTRACTION-CALIBRATION RECORD

- recorded at: `2026-08-05T23:46:00+02:00`
- source: `SRC-001`
- authority: human
- adopted gaps: `G-031`, `G-032`
- adopted original candidates: `C-161` through `C-162`
- added repair unit: `E-003`
- last fully accounted source line: `L518`
- next source line: `L519`
- next candidate: `C-163`
- next gap: `G-033`
- next batch: `Batch 08`
- SRC-001 closed: `false`
- SRC-002 started: `false`
- earlier artifacts mutated: `false`

## Exact Human Decision Block

Adopt every decision in this block exactly as written

G-031 — L509

Decision: no packet appropriate.

Exact frozen evidence:
Text-based question answering

Exclusion reason: The line is a subsection heading. It establishes the local subject of C-161 and C-162 but makes no independent assertion.

Exclusion class: document-administration.

Missing-packet decision: none.

Dependencies: none.

Citation treatment: none.

Degradation flags: none.

Restriction: Do not convert the heading into a definition, architecture claim, or empirical statement.

C-161 — L510-L512

Disposition: reject.

Exact frozen evidence:
Answering text-based questions has long been an active research area in the NLP community
[3, 22, 27, 48]. Recently, in addition to traditional symbolic-based question answering architectures,
we observe a growing interest in neural-based approaches to text based question answering [34, 42, 43].

Reason: The first sentence reports the longevity of text-based question answering as a research area. The second reports a source-relative increase in interest in neural approaches alongside traditional symbolic architectures. Neither sentence describes architectural components, mechanisms, memory operation, interactions, hierarchy, or information flow. Merely naming symbolic architectures and neural approaches does not establish a criterion-2 architectural proposition. The passage also contains no empirical model result, design choice, constraint, system-behavior comparison, or proposal satisfying another admission criterion.

Criterion treatment: The original mechanical criterion-2 assignment is not sustained.

Dependencies: none for the rejection.

Citation treatment: Preserve citations [3, 22, 27, 48] and [34, 42, 43] with the rejected occurrence as provenance. Do not treat them as support for an admitted claim.

Context treatment: Preserve C-161 as source context for resolving C-162’s phrase “these architectures.” Its use as an antecedent dependency does not reverse C-161’s rejection or turn its research-trend statements into admitted evidence.

Degradation flags: none.

Restrictions:
Preserve “has long been,” “Recently,” and “growing interest” as source-relative wording.
Do not present the research trend as current.
Do not infer that neural approaches had replaced symbolic approaches.
Do not infer particular components, mechanisms, capabilities, or performance from the architecture labels alone.
Do not silently discard the rejected occurrence or its citations.

C-162 — L513-L517

Disposition: edit.

Reason: The empirical proposition qualifies under criterion 5, but the original candidate embeds an extracted page number and blank line inside a sentence that crosses the PDF page boundary. “These architectures” also requires the immediately preceding neural text-question-answering context. Replace C-162 with E-003.

Original exact frozen evidence:
While these architectures rely on ‘memories’, we empirically show that the RN module has similar
10

capabilities, reaching very competitive results on the bAbI dataset [ 41] – a dataset that test reasoning
capabilities of text-based question answering models.

E-003

Disposition: calibration-accept.

Criterion: 5.

Authorized exact fragment 1:
Locator: L513
While these architectures rely on ‘memories’, we empirically show that the RN module has similar

Authorized exact fragment 2:
Locator: L516-L517
capabilities, reaching very competitive results on the bAbI dataset [ 41] – a dataset that test reasoning
capabilities of text-based question answering models.

Normalized wording: The authors report that, although the neural text-based question-answering approaches described in C-161 rely on “memories,” the RN module demonstrates similar capabilities and achieves very competitive results on bAbI [41], a dataset for testing reasoning capabilities of text-based question-answering models.

Context dependency: C-161 / L510-L512 resolves “these architectures” as the neural-based text-question-answering approaches described immediately before C-162.

Dependency restriction: C-161’s rejection remains unchanged. The dependency supplies antecedent context only and does not admit C-161 as evidence.

Citation treatment: preserve citation [41].

Comparator scope: memory-reliant neural text-question-answering approaches.

Dataset condition: bAbI.

Reported-result language: preserve “similar capabilities” and “very competitive results.”

Page-administration treatment:
Exclude L514’s extracted page number “10”.
Exclude L515’s blank line.
Do not include either inside E-003’s exact evidence.

Fragment treatment: Store the two exact fragments with their separate locators. Do not concatenate them into a single purportedly contiguous frozen quote.

Degradation flag: The frozen evidence contains “[ 41]”; the exact PDF reads “[41]”. Preserve the frozen citation spacing.

Missing-packet decision: none. E-003 is an exact-evidence repair of C-162, not a newly discovered omitted claim.

Restrictions:
Preserve the curly quotation marks around ‘memories’.
Preserve “we empirically show.”
Preserve “similar”; do not convert it into equivalence.
Preserve “very competitive”; do not convert it into superiority, state-of-the-art status, or a numerical result.
Do not infer a metric, score, task count, confidence interval, or statistical test from this passage.
Do not infer that the RN itself relies on memory.
Do not broaden the result beyond bAbI or text-based question answering.
Do not infer which specific cited neural architectures form the comparator set beyond the context stated by the source.

G-032 — L518

Decision: no packet appropriate.

Exact frozen evidence:
B CLEVR from pixels

Exclusion reason: The line is a section heading. It establishes the scope of the next source section and Batch 08 but makes no independent assertion.

Exclusion class: document-administration.

Missing-packet decision: none.

Dependencies: none.

Citation treatment: none.

Degradation flags: none.

Restriction: Do not treat the heading as evidence about the CLEVR dataset, model architecture, training procedure, or results.

No earlier event, checkpoint, proposal, receipt, correction record, or immutable input is modified by these decisions.

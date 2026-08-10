# SRC-001 Human Decision Event — Batch 10A

> NONCANONICAL HUMAN-SUPERVISED EXTRACTION-CALIBRATION RECORD

- recorded at: `2026-08-06T15:49:00+02:00`
- source: `SRC-001`
- authority: human
- adopted original candidates: `C-205` through `C-206`
- adopted gaps: `G-040` and `G-041`
- added units: none
- formal-material closure: `FIGURE-4-FORMAL-MATERIAL-REVIEW`
- formal-material state opened: `B10-001`
- last fully accounted source line: `L668`
- next source line: `L669`
- next source-order item: `G-042`
- next candidate: none; original candidate inventory ends at `C-206`
- next gap: `G-042`
- current batch: `Batch 11`
- human block line endings: `LF as received; no final newline`
- exact human block SHA-256: `4cf1535fb248d64fc69db9e1bd2137a022ab433f52a745f877d75d96dbb806c3`
- SRC-001 closed: `false`
- SRC-002 started: `false`
- earlier artifacts mutated: `false`

## Exact Human Decision Block

Adopt every decision in this block exactly as written

G-040 — L619-L656

Decision: no standalone packet appropriate.

Source treatment: L619-L656 contains Figure 4 example-question labels, answer labels, axis and tick labels, category labels, and the CNN+RN/CNN+MLP legend. C-205 supplies the illustrated-example assertion and C-206 supplies the empirical comparison. The labels add no independent prose assertion or exact numeric result.

Exclusion class: figure-examples-and-labels-without-independent-assertion.

Missing-packet decision: none.

Dependencies: none.

Formal-material treatment: Preserve L619-L656 as provenance within FIGURE-4-FORMAL-MATERIAL-REVIEW. On adoption of G-040, C-205, and C-206, close FIGURE-4-FORMAL-MATERIAL-REVIEW.

Citation treatment: none.

Degradation flags: none.

Restrictions:
Do not infer exact numeric results from Figure 4 bar heights.
Do not treat isolated axis or tick labels as reported results.
Do not treat individual illustrated questions or answers as dataset-wide definitions or empirical measurements.
Do not manufacture claims by concatenating Figure 4 labels according to frozen extraction order.
Do not discard their source provenance.

C-205 — L657-L659

Disposition: calibration-accept.

Criterion: 3.

Authorized exact evidence:
Figure 4: “Sort-of-CLEVR” task: examples and results. The Sort-of-CLEVR example here
consists of an image of six objects and two questions – a relational question, and a non-relational
question – along with the corresponding answers.

Normalized wording: Figure 4’s illustrated Sort-of-CLEVR example consists of an image containing six objects, one relational question, one non-relational question, and the corresponding answers.

Dependencies: none.

Figure context: G-040 supplies the associated visual examples and labels but is not independent evidence.

Citation treatment: none.

Overlap treatment: Record partial semantic overlap with C-059’s earlier six-object Sort-of-CLEVR construction and earlier relational and non-relational question-example material. Preserve C-205 as the caption-level description of the illustrated example, but do not treat repeated task details as independent corroboration.

Degradation flags: none.

Restrictions:
Preserve Figure 4 attribution.
Preserve six objects.
Preserve two questions.
Preserve one relational question and one non-relational question.
Preserve the corresponding-answer condition.
Do not infer that the Sort-of-CLEVR dataset contains only two questions per image. C-205 describes the illustrated example, while C-176 separately records 20 generated questions per image.
Do not infer that all Sort-of-CLEVR images use the exact questions or answers shown.
Do not broaden the six-object condition beyond the stated illustrated example and separately supported Sort-of-CLEVR construction.
Do not convert the example caption into an empirical performance claim.
Do not admit individual Figure 4 cells as additional packets solely because they instantiate the caption.

C-206 — L659-L662

Disposition: calibration-accept.

Criterion: 5.

Authorized exact evidence:
The fraction of correctly answered relational
questions (inset bar plot) for our model (CNN+RN) is much larger than the comparable MLP
based model (CNN+MLP), whereas both models have similar performance levels for non-relational
questions.

Normalized wording: Figure 4 reports that CNN+RN correctly answered a much larger fraction of relational questions than the comparable CNN+MLP model, while the two models had similar performance on non-relational questions.

Dependencies: none. The caption names both models, the metric, and both evaluation conditions.

Figure context: G-040 supplies the associated inset bar plot and labels.

Citation treatment: none.

Overlap treatment: Record semantic overlap with C-123’s exact numeric Sort-of-CLEVR result. Preserve C-206 as the caption-level qualitative comparison, but do not treat it as independent corroboration of the same experiment.

Comparator context:
C-186 identifies the CNN+MLP comparator experiment.
C-188 records that the CNN+MLP comparator has more parameters.
Preserve the C-188 caveat; C-206 does not establish parameter equality.

Degradation flags: none.

Restrictions:
Preserve fraction correctly answered as the metric.
Preserve the relational-question condition.
Preserve CNN+RN and the comparable CNN+MLP model.
Preserve “much larger.”
Preserve similar performance for non-relational questions.
Do not replace the qualitative caption with exact percentages from C-123.
Do not infer exact values from the bars.
Do not infer confidence intervals, statistical significance, sample size, evaluation split, or variance.
Do not normalize “comparable” to equal parameters, compute, capacity, or training conditions.
Do not infer that the architecture difference alone causally explains the result from this caption.
Do not broaden the comparison beyond Sort-of-CLEVR.

G-041 — L663-L668

Decision: no-candidate status is not fully appropriate.

Source partition:
L663-L664 are the extracted printed page number and blank line.
L665-L668 begin substantive Table 2 formal material, containing failure questions and RN-predicted answers whose ground-truth rows and additional examples continue through L688.

L663-L664 decision: no packet appropriate.

L663-L664 exclusion class: document-administration.

L665-L668 decision: do not exclude. Preserve as the beginning of substantive Table 2 formal material.

Cross-batch formal review: Create B10-001.

B10-001 scope:
Formal material: Table 2.
Frozen source span: L665-L688.
Evidence role: examples of CLEVR questions answered incorrectly by the RN, with RN-predicted and ground-truth answers.
Dependency: C-170 introduces Table 2 as failure evidence.
Contextual relationship: C-171 records the authors’ hypothesized failure conditions.

B10-001 status after adoption: OPEN_PENDING_BATCH_11_EXAMPLE_LEVEL_ADJUDICATION.

Missing-packet decision: unresolved until Batch 11.

Formal-material restriction: No T2-* unit is adopted through this Batch 10 decision. Batch 11 must independently reopen L669-L688, including L669, and decide the exact caption and example-level units.

Citation treatment: none.

Degradation and layout flag: Table 2 is multi-column formal material whose PDF reading order differs from the frozen extraction order. Preserve the frozen bytes and do not silently reconstruct aligned rows.

Restrictions:
Exclude only L663-L664.
Do not exclude L665-L668 as document administration, figure labels, or uninterpreted noise.
Do not infer that the displayed examples are representative or exhaustive.
Do not infer failure frequencies from the number of displayed examples.
Do not treat an RN answer without its aligned question and ground-truth answer as a complete standalone unit.
Do not use the examples to prove C-171’s hypothesized failure causes.
Do not reconstruct PDF-aligned Table 2 rows by guessing from frozen multi-column extraction order.
Do not discard the source provenance of any Table 2 text.

Formal-review closure:
Close FIGURE-4-FORMAL-MATERIAL-REVIEW through the adopted G-040, C-205, and C-206 decisions.
Keep TABLE-2-FORMAL-MATERIAL-REVIEW open through B10-001 pending Batch 11.

No earlier event, checkpoint, proposal, receipt, correction record, or immutable input is modified by these decisions.
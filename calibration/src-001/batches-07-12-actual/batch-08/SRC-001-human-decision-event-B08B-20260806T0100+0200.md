# SRC-001 Human Decision Event — Batch 08B

> NONCANONICAL HUMAN-SUPERVISED EXTRACTION-CALIBRATION RECORD

- recorded at: `2026-08-06T01:00:00+02:00`
- source: `SRC-001`
- authority: human
- adopted original candidates: `C-169` through `C-172`
- adopted gaps: `G-033`, `G-034`
- last fully accounted source line: `L540`
- next source line: `L541`
- next candidate: `C-173`
- next gap: `G-035`
- current batch: `Batch 08`
- SRC-001 closed: `false`
- SRC-002 started: `false`
- earlier artifacts mutated: `false`

## Exact Human Decision Block

Adopt every decision in this block exactly as written

C-169 — L528-L530

Disposition: edit.

Criterion: 5.

Authorized exact evidence:
In general, we found that smaller models
performed best. For example, 128 hidden unit LSTMs performed better than 256 or 512, and CNNs
with 24 kernels were better than CNNs with more kernels, such as 32, 64, or more.

Normalized wording: For the C-163 CLEVR-from-pixels model, the authors report that smaller models generally performed best: LSTMs with 128 hidden units outperformed those with 256 or 512 hidden units, and CNNs with 24 kernels outperformed CNNs with larger kernel counts such as 32, 64, or more.

Dependencies: C-163.

Citation treatment: none.

Overlap treatment: Record partial semantic overlap with S-167a’s 24-kernel best-performing convolutional configuration and earlier CLEVR-from-pixels convolutional-configuration material. Preserve C-169 as the explicit model-size comparison and retain its provenance, but do not treat the repeated 24-kernel detail as independent corroboration.

Degradation flags: none.

Restrictions:
Preserve “In general.”
Preserve “found” as the authors’ empirical attribution.
Preserve “performed best” without inventing a performance metric.
Preserve both comparator sets: 128 hidden units against 256 or 512, and 24 kernels against larger counts such as 32, 64, or more.
Do not infer parameter counts from hidden-unit or kernel counts.
Do not infer that performance decreases monotonically with model size.
Do not infer a numerical margin, confidence interval, metric, or statistical significance.
Do not generalize the comparison to other datasets, architectures, tasks, or training regimes.
Do not convert “smaller models performed best” into a universal recommendation that smaller models are always superior.

G-033 — L531

Decision: no packet appropriate.

Exact frozen evidence:
Failure cases

Exclusion reason: The line is a subsection heading. It supplies organizational scope for C-170 and C-171 but makes no independent claim about failure frequency, causes, or severity.

Exclusion class: document-administration.

Missing-packet decision: none.

Dependencies: none.

Citation treatment: none.

Degradation flags: none.

Restriction: Do not convert the heading into an assertion that the architecture has any particular failure mode.

C-170 — L532-L534

Disposition: calibration-accept.

Criterion: 6.

Authorized exact evidence:
Although our model gets most answers correct, a closer examination of the failure cases help us to
identify limitations of our architecture. In Table 2, we show some examples of CLEVR questions that
our model fails to answer correctly, along with the ground-truth answers.

Normalized wording: Although the C-163 CLEVR-from-pixels model answers most questions correctly, the authors state that examining its failures helps identify architecture limitations; Table 2 presents examples of incorrectly answered CLEVR questions together with their ground-truth answers.

Dependencies:
C-163, which resolves “our model” and supplies the CLEVR-from-pixels model scope.
TABLE-2-FORMAL-MATERIAL-REVIEW, a forward dependency requiring later adjudication of the table’s caption, examples, predictions, and ground-truth answers.

Forward-dependency restriction: No proposed T2-* unit is adopted through C-170. Individual Table 2 questions, images, RN predictions, and ground-truth answers remain pending their later formal-material review.

Citation treatment: none.

Duplicate or overlap treatment: none.

Degradation flags: none.

Restrictions:
Preserve “most answers correct” as an unquantified statement.
Do not substitute C-168’s 96.8% validation accuracy or C-109’s test accuracy for “most.”
Preserve “help us to identify”; do not state that every limitation has been identified.
Preserve Table 2 as the stated evidence surface.
Do not infer failure frequencies from the number of displayed examples.
Do not treat the displayed examples as representative sampling unless separately stated.
Do not infer that Table 2 exhaustively lists the model’s failure modes.
Do not pre-adjudicate individual Table 2 formal material.

C-171 — L534-L537

Disposition: calibration-accept.

Criterion: 6.

Authorized exact evidence:
Based on our observations,
we hypothesize that our architecture fails especially when objects are heavily occluded, or whenever
a high precision object position representation is required. We also observe that many failure cases
for our model are also challenging for humans.

Normalized wording: Based on the failure-case observations described in C-170, the authors hypothesize that the architecture fails especially when objects are heavily occluded or when high-precision object-position representations are required; they also observe that many of the model’s failure cases are challenging for humans.

Dependencies: C-170, which supplies the failure-case observations and resolves the model and architecture context.

Inherited dependency: C-163 is inherited through C-170 and need not be duplicated as a direct dependency.

Citation treatment: none.

Duplicate or overlap treatment: none.

Granularity treatment: Retain the two sentences as one coherent failure-analysis unit. The human-difficulty observation directly qualifies the same failure-case population underlying the authors’ hypothesis and does not introduce a separate architecture, experiment, or metric.

Degradation flags: none.

Restrictions:
Preserve “Based on our observations.”
Preserve “hypothesize”; do not state the proposed failure conditions as proven causes.
Preserve both alternative conditions: heavy object occlusion and a requirement for high-precision object-position representation.
Preserve “especially”; do not convert the conditions into necessary or sufficient conditions for failure.
Preserve “many”; do not broaden it to all failure cases.
Preserve “also challenging for humans” as a qualitative observation.
Do not infer a human-performance metric, experiment, sample size, or controlled comparison.
Do not infer that human difficulty explains every model failure.
Do not infer that the two stated conditions are the architecture’s only limitations.
Do not convert the hypothesis into a demonstrated causal mechanism.

G-034 — L538

Decision: no packet appropriate.

Exact frozen evidence:
C CLEVR from state descriptions

Exclusion reason: The line is a section heading. It establishes organizational scope for C-172 through C-175 but makes no independent architecture, training, or empirical assertion.

Exclusion class: document-administration.

Missing-packet decision: none.

Dependencies: none.

Citation treatment: none.

Degradation flags: none.

Restriction: Do not treat the heading itself as evidence of an architecture, training configuration, or empirical result.

C-172 — L539-L540

Disposition: calibration-accept.

Criterion: 2.

Authorized exact evidence:
The model that we train on the state description version of CLEVR is similar to the model trained
on the pixel version of CLEVR, but without the vision processing module.

Normalized wording: The authors state that the CLEVR state-description model is similar to the CLEVR-from-pixels model anchored by C-163, except that it omits the vision-processing module.

Dependencies: C-163, which identifies the pixel-version comparator model.

Anchor treatment: C-172 supplies the state-description task and model scope for C-173 through C-175.

Citation treatment: none.

Contextual-overlap treatment: Record contextual overlap with C-117’s state-description CLEVR result and C-118’s interpretation of that result. Preserve C-172 as a distinct supplementary architecture statement, and do not treat the repeated task context as independent empirical or interpretive evidence.

Degradation flags: none.

Restrictions:
Preserve “similar.”
Preserve “without the vision processing module” as the stated architectural difference.
Do not claim that the two models are otherwise byte-for-byte or component-for-component identical.
Do not infer shared weights, identical optimization, identical hyperparameters, identical inputs, or identical performance.
Do not infer that the vision-processing module is the only difference without preserving the qualified word “similar.”
Do not infer that raw state descriptions require no preprocessing.
Do not infer a causal performance effect from removing the vision-processing module.

No earlier event, checkpoint, proposal, receipt, correction record, or immutable input is modified by these decisions.

# SRC-001 Human Decision Event — Batch 07C

> NONCANONICAL HUMAN-SUPERVISED EXTRACTION-CALIBRATION RECORD

- recorded at: `2026-08-05T22:48:00+02:00`
- source: `SRC-001`
- authority: human
- adopted gaps: `G-030`
- adopted original candidates: `C-153` through `C-157`
- added split units: `none`
- last fully accounted source line: `L501`
- next source line: `L502`
- next gap: `G-031`
- next candidate: `C-158`
- next candidate locator: `L502-L504`
- SRC-001 closed: `false`
- SRC-002 started: `false`
- earlier artifacts mutated: `false`

## Exact Human Decision Block

Adopt every decision in this block exactly as written

G-030 — L492

Decision: no packet appropriate.

Exact frozen evidence:
Visual question answering

Exclusion reason: The line is a subsection heading. It establishes organizational scope for C-153 through C-160 but makes no independent assertion.

Exclusion class: document-administration.

Missing-packet decision: none.

Dependencies: none.

Citation treatment: none.

Duplicate or overlap treatment: none.

Degradation flags: none.

Restriction: Do not convert the heading itself into a definition of visual question answering or an assertion about the field.

C-153 — L493-L494

Disposition: calibration-accept.

Criterion: 1.

Authorized exact evidence:
Visual question answering is a recently introduced task that measures a machine understanding of the
scene through questions [1, 29].

Normalized wording: The source describes visual question answering as a recently introduced task that measures a machine’s understanding of a scene through questions [1, 29].

Dependencies: none.

Citation treatment: preserve citations [1, 29].

Duplicate or overlap treatment: none.

Degradation flags: none.

Restrictions:
Preserve “recently introduced” as wording relative to the source’s publication context.
Preserve the characterization of the task as measuring scene understanding through questions.
Do not represent “recently introduced” as a current statement.
Do not infer that the task perfectly or comprehensively measures scene understanding.
Do not broaden “scene” into general intelligence or general visual understanding.

C-154 — L494-L496

Disposition: calibration-accept.

Criterion: 1.

Authorized exact evidence:
Related to our work, we are mostly interested in the newly introduced
CLEVR dataset [ 15] that distills core challenges of the task, namely relational and multi-modal
reasoning.

Normalized wording: The authors identify CLEVR as the visual-question-answering dataset most relevant to their work and state that it distills core challenges of the task, namely relational and multi-modal reasoning [15].

Dependencies: none.

Citation treatment: preserve citation [15].

Duplicate or overlap treatment: none.

Degradation flag: The frozen evidence contains “[ 15]”; the exact PDF reads “[15]”. Preserve the frozen exact evidence.

Restrictions:
Preserve “mostly interested” as an attribution to the authors’ research focus.
Preserve “newly introduced” as source-relative wording.
Preserve “core challenges”; do not describe relational and multi-modal reasoning as the only challenges in visual question answering.
Preserve the spelling and scope of “multi-modal.”
Do not infer that CLEVR exhaustively measures either relational reasoning or multi-modal reasoning.
Do not treat this sentence as an empirical result about model performance.

C-155 — L496-L499

Disposition: calibration-accept.

Criterion: 2.

Authorized exact evidence:
The majority of approaches to question answering share the same pipeline [ 6, 31, 36]. First,
questions are encoded with recurrent neural networks, and images are encoded with convolutional
neural networks. Next, both representations are combined, and the answers are either predicted or
generated.

Normalized wording: The source states that most question-answering approaches share a pipeline in which recurrent neural networks encode questions, convolutional neural networks encode images, the two representations are combined, and answers are then predicted or generated [6, 31, 36].

Dependencies: none. The complete pipeline is contained within the candidate.

Citation treatment: preserve citations [6, 31, 36].

Overlap treatment: record partial semantic overlap with C-047’s visual-language-conjunction requirements and C-091’s concrete visual-QA architecture. Preserve C-155 as a separate related-work occurrence, but do not treat the repeated encoder-and-combination propositions as independent corroboration.

Degradation flag: The frozen evidence contains “[ 6, 31, 36]”; the exact PDF reads “[6, 31, 36]”. Preserve the frozen exact evidence.

Granularity treatment: Retain the three sentences as one coherent architecture-and-information-flow description. Do not split the individual pipeline stages from the shared-pipeline assertion they instantiate.

Restrictions:
Preserve “majority”; do not broaden it to every question-answering approach.
Preserve the ordered sequence expressed by “First” and “Next.”
Preserve prediction and generation as alternatives.
Do not infer a specific recurrent architecture, convolutional architecture, representation-combination operation, or answer decoder beyond what the source states.
Do not infer that this pipeline is optimal or universally successful.

C-156 — L499-L500

Disposition: calibration-accept.

Criterion: 2.

Authorized exact evidence:
Most successful methods also use an attention mechanism that locate important image
regions [5, 44, 45, 46].

Normalized wording: The source states that most successful visual-question-answering methods also use an attention mechanism to locate important image regions [5, 44, 45, 46].

Dependencies: C-155, which supplies the question-answering-approach scope and the pipeline to which “also” adds attention.

Citation treatment: preserve citations [5, 44, 45, 46].

Overlap treatment: record partial semantic overlap with M-002’s description of stacked or iterative attention in prior CLEVR architectures. C-156 adds the stated image-region-localization role. Do not treat the shared attention proposition as independent evidence.

Degradation flags: none.

Restrictions:
Preserve “Most successful methods”; do not broaden it to every successful method.
Preserve “also” and its relationship to the pipeline described in C-155.
Preserve the source’s functional claim that attention locates important image regions.
Do not infer that attention is necessary for success.
Do not infer that attention guarantees correct localization or improved performance.
Do not infer a particular attention architecture from this sentence.

C-157 — L500-L501

Disposition: calibration-accept.

Criterion: 2.

Authorized exact evidence:
In our work, we follow a similar pipeline, but we use Relation Networks as a
powerful reasoning module.

Normalized wording: The authors state that their work follows a question-answering pipeline similar to the one described in C-155 but uses Relation Networks as the reasoning module.

Dependencies: C-155, which resolves “a similar pipeline.”

Dependency exclusion: C-156 is not required as a dependency because C-157 does not explicitly state that the RN replaces the attention mechanism.

Citation treatment: none.

Overlap treatment: record partial semantic overlap with C-091’s concrete visual-QA architecture and earlier claims identifying the RN as a plug-and-play reasoning module. Preserve this related-work summary and its provenance, but do not count the repeated RN-module proposition as independent evidence.

Degradation flags: none.

Restrictions:
Preserve “In our work” as source attribution.
Preserve “similar”; do not claim that the authors use an identical pipeline.
Preserve “powerful” as the authors’ characterization, not as an independently measured result.
Do not claim that the RN replaces attention, the recurrent question encoder, the convolutional image encoder, or every other processing component.
Do not infer performance, superiority, or causal benefit from this sentence alone.
Do not describe this sentence as an empirical comparison.

No earlier event, checkpoint, proposal, receipt, correction record, or immutable input is modified by these decisions.

# SRC-001 Human Decision Event — Batch 08D

> NONCANONICAL HUMAN-SUPERVISED EXTRACTION-CALIBRATION RECORD

- recorded at: `2026-08-06T10:45:00+02:00`
- source: `SRC-001`
- authority: human
- adopted original candidates: `C-178` through `C-183`
- adopted gaps: `G-036`
- last fully accounted source line: `L568`
- next source line: `L569`
- next candidate: `C-184`
- next gap: `G-037`
- completed batch: `Batch 08`
- next batch: `Batch 09`
- human block line endings: `CRLF as supplied`
- SRC-001 closed: `false`
- SRC-002 started: `false`
- earlier artifacts mutated: `false`

## Exact Human Decision Block

Adopt every decision in this block exactly as written

C-178 — L552-L553

Disposition: edit.

Criterion: 4.

Authorized exact evidence:
These questions are non-relational because one can answer them by reasoning about the attributes
(e.g. position, shape) of a single entity which is identiﬁed by its unique color (e.g. red).

Normalized wording: In Sort-of-CLEVR, the non-relational question categories described in C-177 can be answered by reasoning about attributes such as position or shape of a single entity identified by its unique color.

Dependencies: C-177, which supplies the three non-relational question categories and the Sort-of-CLEVR context.

Inherited dependency: C-176 is inherited through C-177 and need not be duplicated as a direct dependency.

Citation treatment: none.

Duplicate or overlap treatment: none.

Degradation flag: The frozen evidence contains “identiﬁed”; the exact PDF is readable as “identified”. Preserve the frozen ligature.

Restrictions:
Preserve “one can answer.”
Preserve the single-entity condition.
Preserve position, shape, and red as examples rather than exhaustive categories or required values.
Do not generalize this Sort-of-CLEVR-specific explanation into a universal definition of non-relational reasoning.
Do not merge C-178 with C-177. C-177 supplies the taxonomy, while C-178 explains the classification.

C-179 — L554-L557

Disposition: calibration-accept.

Criterion: 1.

Authorized exact evidence:
Relational questions are split into three categories: (i) closest-to, e.g. “ What is the shape of the
object that is closest to the green object? ”; (ii) furthest-from, e.g. “ What is the shape of the object
that is furthest from the green object? ”; (iii) count, e.g. “ How many objects have the shape of the
green object?”.

Normalized wording: In Sort-of-CLEVR, relational questions are divided into closest-to, furthest-from, and count categories, with the source’s corresponding examples involving a green reference object.

Dependencies: C-176, which supplies the Sort-of-CLEVR dataset scope.

Citation treatment: none.

Overlap treatment: Record partial semantic overlap with C-062’s earlier relational-question examples. C-179 adds an explicit three-category taxonomy. Preserve both occurrences and their provenance, but do not treat repeated examples as independent evidence.

Degradation flag: The frozen extraction contains spacing inside several quotation marks that is absent in the readable PDF. Preserve the frozen exact evidence unchanged.

Restrictions:
Preserve all three categories and all three examples.
Do not treat the example color green as a requirement that every relational question uses a green reference object.
Do not infer that the examples exhaust all possible question phrasings.
Do not import C-180’s explanation into C-179’s exact evidence.
Do not merge C-179 with C-180.

C-180 — L557-L559

Disposition: edit.

Criterion: 4.

Authorized exact evidence:
We consider these relational because answering them requires reasoning about the
attributes of one or more objects that are deﬁned relative to the attributes of a reference object.
This reference object is uniquely identiﬁed by its color.

Normalized wording: The authors classify the C-179 question categories as relational because answering them requires reasoning about attributes of one or more objects defined relative to a reference object, which the Sort-of-CLEVR construction uniquely identifies by color.

Dependencies: C-179, which resolves “these” as the closest-to, furthest-from, and count categories.

Citation treatment: none.

Duplicate or overlap treatment: none.

Degradation flags:
The frozen evidence contains “deﬁned”; the exact PDF is readable as “defined”.
The frozen evidence contains “identiﬁed”; the exact PDF is readable as “identified”.
Preserve the frozen ligatures.

Restrictions:
Preserve “We consider” as the authors’ attribution.
Preserve “one or more objects.”
Preserve the relative-definition relationship.
Preserve unique color as the reference-identification condition in this dataset construction.
Do not state that unique color is necessary for relational reasoning generally.
Do not broaden the explanation beyond the C-179 Sort-of-CLEVR categories.
Do not infer that color is the only possible reference-identification mechanism in other datasets.

C-181 — L560-L562

Disposition: calibration-accept.

Criterion: 3.

Authorized exact evidence:
Questions were encoded as binary strings of length 11, where the ﬁrst 6 bits identiﬁed the color
of the object to which the question referred, as a one-hot vector, and the last 5 bits identiﬁed the
question type and subtype.

Normalized wording: For Sort-of-CLEVR, questions were encoded as 11-bit binary strings: the first 6 bits formed a one-hot representation of the referenced object’s color, and the final 5 bits represented question type and subtype.

Dependencies: C-176, which supplies the Sort-of-CLEVR task scope.

Citation treatment: none.

Overlap treatment: Record partial semantic overlap with C-060’s earlier fixed-length binary-question representation. C-181 supplies the exact 11-bit allocation and remains a distinct implementation statement. Do not treat the repeated binary-encoding proposition as independent corroboration.

Degradation flags: The frozen evidence contains “ﬁrst” and “identiﬁed”. Preserve the frozen ligatures.

Restrictions:
Preserve total length 11.
Preserve the allocation of the first 6 bits and last 5 bits.
Preserve color identity and the one-hot-vector condition.
Preserve question type and subtype.
Do not infer the exact mapping of individual bit positions to colors, types, or subtypes.
Do not infer how many question types or subtypes are used solely from the five-bit capacity.
Do not infer that the encoding was learned.

G-036 — L563-L564

Decision: no packet appropriate.

Exact frozen evidence:
L563: 11
L564: empty LF line

Exclusion reason: L563 is the extracted printed page number and L564 is a blank line. Neither line makes a substantive assertion.

Exclusion class: document-administration.

Missing-packet decision: none.

Dependencies: none.

Citation treatment: none.

Degradation flags: none.

Restrictions:
Do not append the page number to C-181.
Do not prepend the page number to C-182.
Do not fabricate a contiguous quotation across the page administration.

C-182 — L565-L568

Disposition: edit.

Criterion: 3.

Authorized exact evidence:
In this task our model used: four convolutional layers with 32, 64, 128 and 256 kernels, ReLU
non-linearities, and batch normalization; the questions, which were encoded as ﬁxed-length binary
strings, were treated as question embeddings and passed directly to the RN alongside the object
pairs;

Normalized wording: For the Sort-of-CLEVR task anchored by C-176, the model used four convolutional layers with 32, 64, 128, and 256 kernels, ReLU nonlinearities, and batch normalization; fixed-length binary question strings were treated as question embeddings and passed directly to the RN alongside object pairs.

Dependencies: C-176, which resolves “this task” as Sort-of-CLEVR.

Related representation context: C-181 provides the exact encoding of the fixed-length binary questions but is not required to make C-182 grammatically complete.

Configuration-chain links:
C-183 continues the same semicolon-delimited model-configuration list within Batch 08.
C-184 continues the list at L569-L570 in Batch 09 and remains unadjudicated.

Citation treatment: none.

Granularity treatment: Retain the two coordinated configuration clauses as one portion of the source’s semicolon-delimited model list.

Degradation flag: The frozen evidence contains “ﬁxed-length”; the exact PDF is readable as “fixed-length”. Preserve the frozen ligature.

Fragment treatment: Preserve the source semicolon at the endpoint. Do not add terminal punctuation.

Restrictions:
Preserve four convolutional layers.
Preserve kernel counts 32, 64, 128, and 256.
Preserve ReLU nonlinearities and batch normalization.
Preserve treatment of fixed-length binary strings as question embeddings.
Preserve that the question embeddings were passed directly to the RN alongside object pairs.
Do not infer kernel size, stride, padding, image dimensions, or channel connectivity.
Do not infer that the question embeddings were learned.
Do not infer that the question input was processed by an LSTM.
Do not treat C-182 as the complete Sort-of-CLEVR model configuration.
Do not adjudicate C-184 through this decision.

C-183 — L568

Disposition: edit.

Criterion: 3.

Authorized exact evidence:
a four-layer MLP consisting of 2000 units per layer with ReLU non-linearities was used for gθ;

Normalized wording: As part of the C-176 Sort-of-CLEVR model configuration begun in C-182, gθ used a four-layer MLP with 2000 units per layer and ReLU nonlinearities.

Dependencies:
C-176, which supplies the Sort-of-CLEVR task scope.
C-182, which supplies the model-configuration sentence and preceding list context.

Forward continuation: C-184 continues the configuration list with the fφ and output-layer configuration at L569-L570. C-184 remains unadjudicated.

Citation treatment: none.

Contextual-overlap treatment: Record contextual overlap with C-102 and C-174, which describe task-specific gθ MLP configurations with different dimensions. Preserve all configurations separately and do not treat them as duplicates.

Degradation flags: none.

Fragment treatment: Preserve the initial lowercase “a” and final semicolon. Do not add a subject or terminal period inside the exact evidence.

Restrictions:
Preserve four layers.
Preserve 2000 units per layer.
Preserve ReLU nonlinearities.
Preserve assignment to gθ.
Do not infer parameter sharing with another MLP.
Do not infer dropout, output dimensions, or the behavior of fφ from C-183.
Do not treat C-183 as a complete standalone model description.
Do not adjudicate C-184 through this decision.

No earlier event, checkpoint, proposal, receipt, correction record, or immutable input is modified by these decisions.

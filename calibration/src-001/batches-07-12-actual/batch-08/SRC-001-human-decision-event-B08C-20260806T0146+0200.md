# SRC-001 Human Decision Event — Batch 08C

> NONCANONICAL HUMAN-SUPERVISED EXTRACTION-CALIBRATION RECORD

- recorded at: `2026-08-06T01:46:00+02:00`
- source: `SRC-001`
- authority: human
- adopted original candidates: `C-173` through `C-177`
- adopted gaps: `G-035`
- last fully accounted source line: `L551`
- next source line: `L552`
- next candidate: `C-178`
- next gap: `G-036`
- current batch: `Batch 08`
- SRC-001 closed: `false`
- SRC-002 started: `false`
- earlier artifacts mutated: `false`

## Exact Human Decision Block

Adopt every decision in this block exactly as written

C-173 — L540-L541

Disposition: edit.

Criterion: 3.

Authorized exact evidence:
We used a 256 unit LSTM
for question processing and word-lookup embeddings of size 32.

Normalized wording: For the CLEVR state-description model anchored by C-172, question processing used a 256-unit LSTM and word-lookup embeddings of size 32.

Dependencies: C-172.

Citation treatment: none.

Overlap treatment: Record partial semantic overlap with C-101’s 32-unit word-lookup-embedding detail for the CLEVR-from-pixels model. Preserve C-173 as the state-description configuration and retain its provenance, but do not treat the repeated embedding size as independent corroboration.

Degradation flags: none.

Restrictions:
Preserve the distinction between the 256-unit LSTM and word-lookup embeddings of size 32.
Do not import C-101’s 128-unit LSTM into this configuration.
Do not infer vocabulary size, embedding initialization, tokenization, sequence length, or whether the embeddings were pretrained.
Do not infer that 256 is the embedding dimension.

C-174 — L541-L543

Disposition: edit.

Criterion: 3.

Authorized exact evidence:
For the RN we used a four-layer
MLP with 512 units per layer, with ReLU non-linearities for gθ. A three-layer MLP consisting of
512, 1024 (with 2% dropout) and 29 units with ReLU non-linearities was used for fθ.

Normalized wording: For the C-172 state-description model, the RN used a four-layer MLP with 512 units per layer and ReLU nonlinearities for gθ, plus a three-layer 512/1024/29-unit MLP with 2% dropout at the 1024-unit layer and ReLU nonlinearities for the function rendered as fφ in the PDF but extracted as fθ in the frozen text.

Dependencies: C-172.

Citation treatment: none.

Contextual-overlap treatment: Record contextual overlap with C-102 and C-103, which configure the corresponding RN functions for the CLEVR-from-pixels model using different dimensions and dropout. Preserve the task-specific configurations separately and do not treat them as duplicates.

Granularity treatment: Retain both MLP descriptions as one coordinated RN configuration for the C-172 model.

Degradation flag: The frozen evidence reads “fθ”; the exact PDF visually reads “fφ”. Preserve “fθ” in the frozen exact evidence and keep the discrepancy explicit. Do not silently repair the quote.

Restrictions:
Preserve four layers and 512 units per layer for gθ.
Preserve the three-layer dimensions 512, 1024, and 29.
Preserve 2% dropout as associated with the 1024-unit layer.
Preserve ReLU nonlinearities.
Do not infer that the two MLPs share parameters.
Do not infer dropout on every layer or on gθ.
Do not infer the output meaning of the 29 units from this passage alone.
Do not silently replace the frozen symbol.

C-175 — L543-L545

Disposition: edit.

Criterion: 3.

Authorized exact evidence:
To train the
model we used 10 distributed workers that synchronously updated a central parameter server. Each
worker learned with mini-batches of size 64, using the Adam optimizer and a learning rate of 1 e−4.

Normalized wording: Training the C-172 CLEVR state-description model used 10 distributed workers synchronously updating a central parameter server; each worker used mini-batches of size 64, Adam, and a learning rate of 1e−4.

Dependencies: C-172.

Citation treatment: none.

Overlap treatment: Record partial semantic overlap with C-165 and C-105 for the worker, parameter-server, and mini-batch configuration. Preserve C-175 as the state-description training configuration. Its learning rate differs and must remain distinct.

Degradation flag: The frozen evidence contains “1 e−4”; the exact PDF is readable as “1e−4”. Preserve the frozen spacing.

Restrictions:
Preserve 10 distributed workers.
Preserve synchronous updates to a central parameter server.
Preserve that each worker used mini-batches of size 64.
Preserve the Adam optimizer and the stated learning rate.
Do not infer aggregate batch size.
Do not substitute C-165’s learning rate of 2 .5e−4.
Do not infer hardware, communication protocol, replicated parameter servers, or asynchronous behavior.
Do not generalize this configuration to the pixel or Sort-of-CLEVR models.

G-035 — L546

Decision: no packet appropriate.

Exact frozen evidence:
D Sort-of-CLEVR

Exclusion reason: The line is a section heading. It establishes the organizational scope for C-176 onward but makes no independent dataset, architecture, training, or empirical assertion.

Exclusion class: document-administration.

Missing-packet decision: none.

Dependencies: none.

Citation treatment: none.

Degradation flags: none.

Restriction: Do not admit the heading itself as evidence about Sort-of-CLEVR.

C-176 — L547-L548

Disposition: calibration-accept.

Criterion: 3.

Authorized exact evidence:
The Sort-of-CLEVR dataset contains 10000 images of size 75 × 75, 200 of which were withheld for
validation. There were 20 questions generated per image (10 relational and 10 non-relational).

Normalized wording: The Sort-of-CLEVR dataset contains 10000 images of size 75 × 75, with 200 images withheld for validation, and 20 generated questions per image divided evenly between 10 relational and 10 non-relational questions.

Dependencies: none.

Anchor treatment: C-176 supplies the Sort-of-CLEVR dataset and task scope for C-177 through C-183.

Citation treatment: none.

Overlap treatment: Record partial semantic overlap with C-061’s earlier statement that each image has 10 relational and 10 non-relational questions. Preserve both occurrences and their provenance, but do not treat the repeated balance as independent corroboration.

Degradation flags: none.

Restrictions:
Preserve 10000 images.
Preserve image size 75 × 75.
Preserve that 200 images were withheld for validation.
Preserve 20 questions per image, divided into 10 relational and 10 non-relational questions.
Do not infer the number of training images by subtraction as an authorized source value.
Do not infer a test split.
Do not infer whether validation images shared question templates with training images.
Do not infer a total question count unless separately stated by the source.

C-177 — L549-L551

Disposition: calibration-accept.

Criterion: 1.

Authorized exact evidence:
Non-relational questions are split into three categories: (i) query shape, e.g. “ What is the shape
of the red object? ”; (ii) query horizontal position, e.g. “ Is the red object on the left or right of the
image?”; (iii) query vertical position, e.g. “ Is the red object on the top or bottom of the image? ”.

Normalized wording: In Sort-of-CLEVR, non-relational questions are divided into query-shape, query-horizontal-position, and query-vertical-position categories, with the source’s respective examples concerning a red object.

Dependencies: C-176, which supplies the Sort-of-CLEVR dataset scope.

Citation treatment: none.

Overlap treatment: Record partial semantic overlap with C-063’s earlier non-relational examples. C-177 adds an explicit three-category taxonomy. Preserve both occurrences, but do not treat repeated examples as independent evidence.

Degradation flag: The frozen extraction contains spacing inside several quotation marks that is absent in the readable PDF. Preserve the frozen exact evidence unchanged.

Restrictions:
Preserve all three categories and all three examples.
Preserve “image?” exactly where it occurs in the frozen evidence.
Do not treat the example color red as a requirement that all such questions concern red objects.
Do not infer that the examples exhaust all possible question phrasings.
Do not infer why the categories are non-relational; that explanation belongs to C-178.
Do not merge C-177 with C-178.

No earlier event, checkpoint, proposal, receipt, correction record, or immutable input is modified by these decisions.

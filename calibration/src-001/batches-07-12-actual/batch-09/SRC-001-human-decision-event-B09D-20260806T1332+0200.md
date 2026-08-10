# SRC-001 Human Decision Event — Batch 09D

> NONCANONICAL HUMAN-SUPERVISED EXTRACTION-CALIBRATION RECORD

- recorded at: `2026-08-06T13:32:00+02:00`
- source: `SRC-001`
- authority: human
- adopted original candidates: `C-201` through `C-204`
- adopted gap: `G-039`
- added units: none
- last fully accounted source line: `L618`
- next source line: `L619`
- next candidate: `C-205`
- next gap: `G-040`
- current batch: `Batch 10`
- human block line endings: `LF as received; no final newline`
- exact human block SHA-256: `e44dfbb6f9988b4cc507e71cbef2b350b533a75a3195b8ae28fc8af7316227c3`
- SRC-001 closed: `false`
- SRC-002 started: `false`
- earlier artifacts mutated: `false`

## Exact Human Decision Block

Adopt every decision in this block exactly as written

C-201 — L604-L606

Disposition: edit.

Criterion: 3.

Authorized exact evidence:
For fφ, we used a three-layer MLP consisting of 500,
100, and 100 units, where the ﬁnal layer was a linear layer that produced logits corresponding to
the existence/absence of a connection between each ball pair.

Normalized wording: For the C-200 connection-inference RN, fφ was a three-layer MLP with 500, 100, and 100 units; its final linear layer produced logits corresponding to the existence or absence of a connection between each ball pair.

Dependencies: C-200, which supplies the connection-inference task, RN, and model scope.

Context link: C-193 supplies the corresponding connection-inference target representation but is not required to make C-201 grammatically or semantically complete.

Citation treatment: none.

Contextual-overlap treatment: Record contextual overlap with C-103, C-174, C-184, and S-190b, which describe other task-specific fφ configurations. Preserve all configurations separately and do not treat them as duplicates.

Degradation flag: The frozen evidence contains “ﬁnal”; the exact PDF is readable as “final”. Preserve the frozen ligature.

Restrictions:
Preserve assignment to fφ.
Preserve three layers.
Preserve dimensions 500, 100, and 100.
Preserve that the final layer was linear.
Preserve production of logits corresponding to existence or absence of a connection.
Preserve the each-ball-pair scope.
Do not infer activation functions for the earlier layers.
Do not infer softmax, sigmoid, thresholding, or prediction decoding.
Do not infer whether connections are directed, symmetric, or include self-pairs.
Do not infer parameter sharing with gθ.
Do not infer performance from this configuration.

C-202 — L606-L608

Disposition: edit.

Criterion: 3.

Authorized exact evidence:
The output was optimized with a
cross-entropy loss function using the Adam optimizer with a learning rate of 1 e−4 and a batch size
of 50.

Normalized wording: For the C-200/C-201 connection-inference model, the output was optimized using cross-entropy loss, Adam, a learning rate of 1e−4, and a batch size of 50.

Dependencies:
C-200, which supplies the connection-inference RN and model scope.
C-201, which resolves “The output” as the connection-logit output.

Citation treatment: none.

Overlap treatment: Record partial semantic overlap with other task-specific cross-entropy and Adam configurations, including C-104, C-185, and S-192b. Preserve C-202 as the connection-inference configuration and do not treat repeated optimization components as independent corroboration.

Degradation flag: The frozen evidence contains “1 e−4”; the exact PDF is readable as “1e−4”. Preserve the frozen spacing.

Restrictions:
Preserve output scope.
Preserve cross-entropy loss.
Preserve Adam.
Preserve the stated learning rate.
Preserve batch size 50.
Do not infer whether batch size 50 is global, per worker, or per device.
Do not infer distributed training, parameter servers, optimizer betas, learning-rate scheduling, weight decay, update count, or stopping criteria.
Do not generalize this configuration to the counting task except through the qualified same-model statement in C-203.
Do not infer performance from the optimization configuration.

C-203 — L608-L609

Disposition: edit.

Criterion: 3.

Authorized exact evidence:
The same model was used for the counting task, but this time the output layer of the RN
was a linear layer with 10 units.

Normalized wording: The authors used the model configured in C-200 through C-202 for the counting task, but changed the RN output layer to a 10-unit linear layer.

Dependencies:
C-200, which supplies the RN architecture.
C-201, which supplies the connection-inference output configuration.
C-202, which completes the referenced model configuration.

Context link: C-194 supplies the counting-target semantics, but C-203 explicitly names the counting task and does not require C-194 for grammatical completion.

Citation treatment: none.

Duplicate or overlap treatment: none.

Degradation flags: none.

Restrictions:
Preserve “The same model.”
Preserve counting-task scope.
Preserve the contrast expressed by “but this time.”
Preserve the RN output-layer scope.
Preserve that the output layer was linear.
Preserve 10 units.
Do not claim that the counting and connection-inference models were identical; the source explicitly changes the output layer.
Do not infer the output activation, loss, index-to-count mapping, or decoding rule.
Do not infer that every training hyperparameter was necessarily unchanged beyond the source’s same-model statement.
Do not infer that 10 output units independently establish the length-10 target representation; that target is separately recorded in C-194.
Do not infer performance.

C-204 — L609-L610

Disposition: edit.

Criterion: 3.

Authorized exact evidence:
For baseline comparisons we replaced the RNs with MLPs with
comparable number of parameters.

Normalized wording: For baseline comparisons on the connection-inference and counting tasks configured in C-200 through C-203, the authors replaced the RNs with MLPs having comparable numbers of parameters.

Dependencies:
C-200, which identifies the connection-inference RN.
C-201 and C-202, which complete the connection-inference model configuration.
C-203, which identifies the counting-task version.

Citation treatment: none.

Duplicate or overlap treatment: none.

Degradation flags: none.

Restrictions:
Preserve the baseline-comparison purpose.
Preserve replacement of the RNs by MLPs.
Preserve the plural RN scope.
Preserve “comparable number of parameters.”
Do not normalize “comparable” to equal or exactly matched.
Do not infer MLP depth, width, activation functions, inputs, output layers, or optimization.
Do not infer whether one baseline architecture was used identically for both tasks.
Do not infer matching compute, memory use, training time, representational capacity, or effective capacity.
Do not infer baseline performance or comparison fairness from this configuration statement alone.

G-039 — L611-L618

Decision: no standalone packet appropriate.

Exact frozen evidence:
L611: Please see the supplementary videos:
L612: https://www.youtube.com/channel/UCIAnkrNn45D0MeYwtVpmbUQ
L613: 12
L614: empty LF line
L615: Fraction correct
L616: 0.0
L617: Non-Rel. Image
L618: Non-relational question

Exclusion treatment:
L611-L612 are a supplementary-video pointer and URL. Exclude them as document-administration.
L613 is the extracted printed page number and L614 is a blank line. Exclude them as document-administration.
L615-L618 are the first Figure 4 axis, category, image, and example labels. Exclude them as figure labels without an independent assertion.

Missing-packet decision: none at this boundary.

Dependencies: none.

Citation treatment: none.

Forward formal-material context:
Preserve L615-L618 as provenance within FIGURE-4-FORMAL-MATERIAL-REVIEW.
G-040 continues the Figure 4 labels and example material in Batch 10.
C-205 and C-206 contain the later caption assertions and remain unadjudicated.
This decision does not pre-adjudicate G-040, C-205, or C-206.

Degradation flags: none.

Restrictions:
Do not treat the supplementary-video pointer or URL as a substantive claim.
Do not append or prepend the printed page number to another unit.
Do not treat “0.0” as a reported model result without the complete figure axis, series, and caption context.
Do not infer values from Figure 4 bar heights.
Do not treat “Non-Rel. Image” as a proposition.
Do not treat the isolated “Non-relational question” label as a definition or result.
Do not concatenate labels across the page or figure into a fabricated claim.
Do not discard their source provenance.

No earlier event, checkpoint, proposal, receipt, correction record, or immutable input is modified by these decisions.
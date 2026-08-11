# SRC-001 Human Decision Event — Batch 09B

> NONCANONICAL HUMAN-SUPERVISED EXTRACTION-CALIBRATION RECORD

- recorded at: `2026-08-06T13:22:00+02:00`
- source: `SRC-001`
- authority: human
- adopted original candidates: `C-190` through `C-194`
- adopted gap: `G-038`
- added split units: `S-190a`, `S-190b`, `S-192a`, `S-192b`
- superseded original fragment: `C-191` by `S-190b`
- last fully accounted source line: `L589`
- next source line: `L590`
- next candidate: `C-195`
- next gap: `G-039`
- current batch: `Batch 09`
- human block line endings: `LF as received; no final newline`
- exact human block SHA-256: `35d524487a34cd0fb67359e5ba53d7064fce1fb70c264a35099c36c3e7cad9a7`
- SRC-001 closed: `false`
- SRC-002 started: `false`
- earlier artifacts mutated: `false`

## Exact Human Decision Block

Adopt every decision in this block exactly as written

C-190 — L581-L582

Disposition: too-broad.

Reason: C-190 combines a complete gθ configuration with only the opening portion of the fφ configuration sentence. Replace C-190 with S-190a and S-190b. S-190b also supersedes the dependent C-191 fragment.

S-190a

Disposition: calibration-accept.

Criterion: 3.

Authorized exact evidence:
For the RN, gθ was a four-layer MLP consisting of 256 units per layer.

Normalized wording: For the C-189 bAbI model, gθ was a four-layer MLP with 256 units per layer.

Dependencies: C-189, which supplies the bAbI model scope.

Citation treatment: none.

Contextual-overlap treatment: Record contextual overlap with C-102, C-174, and C-183, which describe different task-specific gθ configurations. Preserve all configurations separately and do not treat them as duplicates.

Degradation flags: none.

Restrictions:
Preserve four layers.
Preserve 256 units per layer.
Preserve assignment to gθ.
Do not infer activation functions, dropout, output size, parameter sharing, or relation-representation dimensionality.
Do not generalize this configuration beyond the described bAbI model.

S-190b

Disposition: calibration-accept.

Criterion: 3.

Authorized exact evidence:
For
fφ, we used a three-layer MLP consisting of 256, 512, and 159 units, where the ﬁnal layer was a
linear layer that produced logits for a softmax over the answer vocabulary.

Normalized wording: For the C-189 bAbI model, fφ was a three-layer MLP with 256, 512, and 159 units; the final layer was linear and produced logits for a softmax over the answer vocabulary.

Dependencies: C-189, which supplies the bAbI model scope.

Citation treatment: none.

C-191 treatment: S-190b incorporates and supersedes the complete C-191 fragment. Do not retain C-191 as a separate admitted unit.

Contextual-overlap treatment: Record contextual overlap with C-103, C-174, and C-184, which describe different task-specific fφ configurations. Preserve all configurations separately and do not treat them as duplicates.

Degradation flag: The frozen evidence contains “ﬁnal”; the exact PDF is readable as “final”. Preserve the frozen ligature.

Restrictions:
Preserve three layers.
Preserve dimensions 256, 512, and 159.
Preserve assignment to fφ.
Preserve that the final layer was linear.
Preserve production of logits for a softmax over the answer vocabulary.
Do not infer activation functions for the earlier layers.
Do not infer dropout or parameter sharing with gθ.
Do not infer that 159 is independently established as the vocabulary size beyond the source’s stated layer dimension and answer-vocabulary softmax.


C-191 — L582-L583

Disposition: too-narrow.

Authorized exact evidence:
where the ﬁnal layer was a
linear layer that produced logits for a softmax over the answer vocabulary.

Reason: C-191 begins with the dependent word “where” and contains only the tail of the fφ configuration sentence begun in C-190.

Supersession treatment: Supersede C-191 with S-190b. Preserve C-191’s provenance, but do not retain it as an independent admitted unit.

Degradation flag: The frozen evidence contains “ﬁnal”; the exact PDF is readable as “final”. Preserve the frozen ligature.

Restrictions:
Do not treat the fragment as grammatically or semantically standalone.
Do not create a second claim for the same final-layer and softmax proposition.
Do not discard its source provenance.


C-192 — L583-L585

Disposition: too-broad.

Reason: C-192 combines an independent question-processing component with a separate loss and optimizer configuration. Replace C-192 with S-192a and S-192b.

S-192a

Disposition: calibration-accept.

Criterion: 3.

Authorized exact evidence:
A separate LSTM with
32 units was used to process the question.

Normalized wording: For the C-189 bAbI model, a separate 32-unit LSTM processed the question.

Dependencies: C-189, which supplies the bAbI model scope.

Citation treatment: none.

Overlap treatment: Preserve this question-processing configuration separately from C-189’s 32-unit support-sentence LSTM and from earlier bAbI question-processing material. Do not treat the equal unit count as evidence of parameter sharing or as independent corroboration.

Degradation flags: none.

Restrictions:
Preserve “separate.”
Preserve 32 units.
Preserve question-processing scope.
Do not conflate this LSTM with the support-sentence LSTM.
Do not infer parameter sharing.
Do not infer embeddings, vocabulary, directionality, sequence length, or which LSTM state was used.

S-192b

Disposition: calibration-accept.

Criterion: 3.

Authorized exact evidence:
The softmax output was optimized with a cross-entropy
loss function using the Adam optimizer with a learning rate of 2 e−4.

Normalized wording: For the C-189 bAbI model, the softmax output established in S-190b was optimized using cross-entropy loss, Adam, and a learning rate of 2e−4.

Dependencies:
C-189, which supplies the bAbI model scope.
S-190b, which resolves “The softmax output.”

Citation treatment: none.

Overlap treatment: Record partial semantic overlap with other task-specific softmax, cross-entropy, and Adam configurations, including C-104 and C-185. Preserve this bAbI configuration separately and do not treat repeated optimization components as independent corroboration.

Degradation flag: The frozen evidence contains “2 e−4”; the exact PDF is readable as “2e−4”. Preserve the frozen spacing.

Restrictions:
Preserve softmax-output scope.
Preserve cross-entropy loss.
Preserve Adam.
Preserve the stated learning rate.
Do not infer batch size, distributed training, optimizer betas, learning-rate scheduling, update count, or stopping criteria.
Do not substitute another task’s learning rate.


G-038 — L586

Decision: no packet appropriate.

Exact frozen evidence:
F Dynamic physical system reasoning

Exclusion reason: The line is a section heading. It establishes organizational scope for C-193 onward but makes no independent architecture, dataset, target, training, or result assertion.

Exclusion class: document-administration.

Missing-packet decision: none.

Dependencies: none.

Citation treatment: none.

Degradation flags: none.

Restriction: Do not admit the heading itself as a definition of dynamic physical-system reasoning or as evidence about either task.


C-193 — L587-L589

Disposition: edit.

Criterion: 3.

Authorized exact evidence:
For the connection inference task the targets were binary vectors representing the existence (or
non-existence) of a connection between each ball pair. For a total of 10 objects, the targets were
102 length vectors.

Normalized wording: For the connection-inference task, targets were binary vectors representing whether a connection existed between each ball pair; for 10 objects, the exact PDF renders these targets as length-10² vectors.

Dependencies: none.

Anchor treatment: C-193 supplies the connection-inference target and “first task” context required by C-195.

Citation treatment: none.

Degradation flag: The frozen evidence reads “102 length vectors”; the exact PDF visually reads “10² length vectors”. Preserve “102” in the frozen exact evidence and keep the discrepancy explicit.

Restrictions:
Preserve existence and non-existence as the represented connection states.
Preserve the each-ball-pair scope.
Preserve the total-of-10-objects condition.
Do not silently replace “102” inside the exact evidence.
Do not normalize the exact quote to “100”.
Do not infer vector ordering, directedness, symmetry, diagonal handling, or whether self-pairs are included.
Do not infer a loss function or model architecture from this candidate.


C-194 — L589-L590

Disposition: calibration-accept.

Criterion: 3.

Authorized exact evidence:
For the counting task, the targets were one-hot vectors (of length 10) indicating
the number of systems of connected balls.

Normalized wording: For the counting task, targets were length-10 one-hot vectors indicating the number of connected-ball systems.

Dependencies: none.

Anchor treatment: C-194 supplies the counting target and “second task” context required by C-196.

Citation treatment: none.

Duplicate or overlap treatment: none.

Degradation flags: none.

Restrictions:
Preserve counting-task scope.
Preserve the one-hot representation.
Preserve vector length 10.
Preserve the number-of-connected-ball-systems target.
Do not infer how individual vector indices map to counts.
Do not infer whether zero connected systems is representable or which counts are possible.
Do not infer a loss function, output activation, accuracy, or performance.
Keep C-194 distinct from C-193 because the two tasks use different target semantics.

No earlier event, checkpoint, proposal, receipt, correction record, or immutable input is modified by these decisions.
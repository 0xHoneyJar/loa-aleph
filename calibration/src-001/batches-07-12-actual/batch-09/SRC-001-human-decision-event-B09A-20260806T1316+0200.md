# SRC-001 Human Decision Event — Batch 09A

> NONCANONICAL HUMAN-SUPERVISED EXTRACTION-CALIBRATION RECORD

- recorded at: `2026-08-06T13:16:00+02:00`
- source: `SRC-001`
- authority: human
- adopted original candidates: `C-184` through `C-189`
- adopted gaps: `G-037`
- cross-batch repair closed: `B8-001`
- last fully accounted source line: `L580`
- next source line: `L581`
- next candidate: `C-190`
- next gap: `G-038`
- current batch: `Batch 09`
- human block line endings: `CRLF as supplied; no final newline`
- exact human block SHA-256: `6b3bf0aacefb606c54cd8ae52cab6958aed42f9b84ce8049d66f6b0deb6cf636`
- SRC-001 closed: `false`
- SRC-002 started: `false`
- earlier artifacts mutated: `false`

## Exact Human Decision Block

Adopt every decision in this block exactly as written

C-184 — L569-L570

Disposition: edit.

Criterion: 3.

Authorized exact evidence:
and a four-layer MLP consisting of 2000, 1000, 500, and 100 units with ReLU non-linearities used for
fφ. An additional ﬁnal linear layer produced logits for a softmax over the possible answers.

Normalized wording: As part of the Sort-of-CLEVR model configuration begun in C-182 and continued in C-183, fφ used a four-layer MLP with 2000, 1000, 500, and 100 units and ReLU nonlinearities; an additional final linear layer produced logits for a softmax over the possible answers.

Dependencies:
C-176, which supplies the Sort-of-CLEVR task scope.
C-182, which supplies the model-configuration sentence and earlier components.
C-183, which supplies the immediately preceding gθ configuration item.

Cross-batch repair treatment: Close B8-001. C-184 completes the Sort-of-CLEVR configuration continuation that remained open at the Batch 08 boundary.

Citation treatment: none.

Contextual-overlap treatment: Record contextual overlap with C-103 and C-174, which describe different task-specific fφ configurations. Preserve all configurations separately and do not treat them as duplicates.

Degradation flag: The frozen evidence contains “ﬁnal”; the exact PDF is readable as “final”. Preserve the frozen ligature.

Fragment treatment: Preserve the initial lowercase “and” as part of the exact source continuation. Do not remove it from the exact evidence.

Restrictions:
Preserve four layers.
Preserve dimensions 2000, 1000, 500, and 100.
Preserve ReLU nonlinearities.
Preserve assignment to fφ.
Preserve that an additional final linear layer produced logits.
Preserve the softmax-over-possible-answers condition.
Do not infer that the additional final linear layer is one of the four listed MLP layers.
Do not infer dropout, parameter sharing with gθ, answer-vocabulary size, or exact answer categories.
Do not treat C-184 as an independent complete model description.


C-185 — L570-L572

Disposition: edit.

Criterion: 3.

Authorized exact evidence:
The
softmax output was optimized with a cross-entropy loss function using the Adam optimizer with a
learning rate of 1e−4 and mini-batches of size 64.

Normalized wording: For the Sort-of-CLEVR model configured in C-182 through C-184, the softmax output was optimized using cross-entropy loss, Adam, a learning rate of 1e−4, and mini-batches of size 64.

Dependencies:
C-176, which supplies the Sort-of-CLEVR task scope.
C-182, C-183, and C-184, which supply the model and output configuration.

Citation treatment: none.

Overlap treatment: Record partial semantic overlap with C-104’s softmax, cross-entropy, and Adam configuration and with C-165 and C-175’s optimizer, learning-rate, and batch details. Preserve C-185 as the Sort-of-CLEVR configuration, but do not treat repeated configuration details as independent corroboration.

Degradation flags: none.

Restrictions:
Preserve the softmax-output scope.
Preserve cross-entropy loss.
Preserve Adam.
Preserve learning rate 1e−4.
Preserve mini-batches of size 64.
Do not infer whether size 64 is a global, per-worker, or per-device batch size.
Do not import distributed-worker or parameter-server details from other task configurations.
Do not infer weight decay, optimizer betas, learning-rate scheduling, update count, or stopping criteria.
Do not generalize this configuration to the CLEVR or bAbI models.


C-186 — L573-L575

Disposition: calibration-accept.

Criterion: 3.

Authorized exact evidence:
We also trained a comparable MLP based model (CNN+MLP model) on the Sort-of-CLEVR
task, to explore the extent to which a standard model can learn to answer relational questions. We
used the same CNN and LSTM, trained end-to-end, as described above.

Normalized wording: The authors trained a comparable CNN+MLP model on Sort-of-CLEVR to examine how well a standard model could answer relational questions, using what the source describes as the same CNN and LSTM and training them end-to-end.

Dependencies: C-176, which supplies the established Sort-of-CLEVR dataset context.

Configuration context: C-182 through C-185 supply the immediately preceding Sort-of-CLEVR model configuration.

Anchor treatment: C-186 identifies the CNN+MLP comparator for C-187 and C-188.

Citation treatment: none.

Duplicate or overlap treatment: none.

Source-internal referent flag:
C-182 clearly identifies the preceding Sort-of-CLEVR CNN configuration.
C-182 states that fixed-length binary question strings were passed directly to the RN.
C-182 through C-185 do not identify an exact preceding LSTM configuration.
Preserve the source’s statement that it used “the same CNN and LSTM,” but do not silently supply the missing LSTM referent from another task.

Degradation flags: none.

Restrictions:
Preserve “comparable.”
Preserve “to explore” as experimental purpose rather than a result.
Preserve “standard model” as the authors’ characterization.
Preserve “the same CNN and LSTM” as the source’s exact assertion.
Preserve “trained end-to-end.”
Do not select an LSTM from the CLEVR-from-pixels, state-description, or bAbI configurations to resolve the missing referent.
Do not reinterpret “LSTM” as “MLP.”
Do not infer performance, success, failure, or superiority from this candidate.
Do not claim that the comparator was parameter-identical to the RN model.
Do not claim that the comparator differed from the RN model only in the later substitution without retaining C-188’s parameter caveat.


C-187 — L575-L576

Disposition: edit.

Criterion: 3.

Authorized exact evidence:
However, this time we
replaced the RN with an MLP with the same number of layers and number of units per layer.

Normalized wording: In the C-186 CNN+MLP comparator, the authors replaced the RN with an MLP described as having the same number of layers and the same number of units per layer as the referenced RN configuration.

Dependencies:
C-186, which resolves “this time” and identifies the comparator.
C-182, C-183, and C-184, which supply the preceding RN configuration.

Citation treatment: none.

Duplicate or overlap treatment: none.

Degradation flags: none.

Restrictions:
Preserve replacement of the RN by an MLP.
Preserve the same-number-of-layers condition.
Preserve the same-number-of-units-per-layer condition.
Do not infer exactly how the comparator MLP maps onto the separate gθ, fφ, and output-layer components.
Do not infer equality of total parameter count.
Do not infer identical activations, initialization, optimization, input dimensionality, computation, or effective capacity.
Preserve “However” as contrast with C-186.
Do not represent the architectural matching as a perfectly controlled ablation.


C-188 — L576-L578

Disposition: edit.

Criterion: 6.

Authorized exact evidence:
Note
that there are more parameters in this model because the input layer of the MLP connects to the
full CNN image embedding.

Normalized wording: The authors caution that the C-186/C-187 CNN+MLP comparator has more parameters because its MLP input layer connects to the full CNN image embedding.

Dependencies:
C-186, which identifies the CNN+MLP comparator.
C-187, which identifies the replacement MLP.

Citation treatment: none.

Duplicate or overlap treatment: none.

Degradation flags: none.

Restrictions:
Preserve the greater-parameter caveat.
Preserve the authors’ causal explanation.
Preserve the MLP input-layer scope.
Preserve connection to the full CNN image embedding.
Preserve “Note” as an explicit qualification of the comparator.
Do not infer the number or proportion of additional parameters.
Do not infer that the models were matched for compute, memory use, training time, or effective capacity.
Do not infer that the additional parameters improved or harmed performance.
Do not reverse the causal direction stated by the source.
Do not treat C-187’s matched layers and units as total parameter matching.


G-037 — L579

Decision: no packet appropriate.

Exact frozen evidence:
E bAbI model for language understanding

Exclusion reason: The line is a section heading. It establishes organizational scope for C-189 through C-192 but makes no independent architecture, training, dataset, or empirical assertion.

Exclusion class: document-administration.

Missing-packet decision: none.

Dependencies: none.

Citation treatment: none.

Degradation flags: none.

Restriction: Do not admit the heading itself as a definition of bAbI, a model configuration, or a language-understanding result.


C-189 — L580-L581

Disposition: calibration-accept.

Criterion: 3.

Authorized exact evidence:
For the bAbI task, each of the 20 sentences in the support set was processed through a 32 unit LSTM
to produce an object.

Normalized wording: For the bAbI task, each of the 20 support-set sentences was processed through a 32-unit LSTM to produce an object.

Dependencies: none.

Anchor treatment: C-189 supplies the bAbI task, model, and object-construction scope for C-190 through C-192.

Citation treatment: none.

Overlap treatment: Record partial semantic overlap with C-095’s earlier sentence-selection and shared-LSTM processing statement and C-098’s statement that the sentence-processing LSTM final state is considered an object. C-189 adds the supplementary configuration’s exact 32-unit dimension. Preserve all occurrences and their provenance, but do not treat the repeated sentence-to-object construction as independent corroboration.

Degradation flags: none.

Restrictions:
Preserve bAbI task scope.
Preserve each of the 20 support-set sentences.
Preserve the 32-unit LSTM.
Preserve that processing produces an object.
Do not infer sentence length, tokenization, vocabulary, embedding size, or LSTM directionality.
Do not infer whether 20 is a maximum, padding length, or invariant across every raw bAbI example beyond this source statement.
Do not infer which LSTM state or output becomes the object from C-189 alone.
Do not conflate the sentence-processing LSTM with the separate 32-unit question-processing LSTM handled later through C-192.
Do not infer parameter sharing between the sentence-processing and question-processing LSTMs.

No earlier event, checkpoint, proposal, receipt, correction record, or immutable input is modified by these decisions.
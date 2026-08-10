# SRC-001 Human Decision Event — Batch 08A

> NONCANONICAL HUMAN-SUPERVISED EXTRACTION-CALIBRATION RECORD

- recorded at: `2026-08-06T00:13:00+02:00`
- source: `SRC-001`
- authority: human
- adopted original candidates: `C-163` through `C-168`
- added split units: `S-167a`, `S-167b`
- last fully accounted source line: `L528`
- next source line: `L529`
- next candidate: `C-169`
- next gap: `G-033`
- current batch: `Batch 08`
- SRC-001 closed: `false`
- SRC-002 started: `false`
- earlier artifacts mutated: `false`

## Exact Human Decision Block

Adopt every decision in this block exactly as written

C-163 — L519-L520

Disposition: calibration-accept.

Criterion: 3.

Authorized exact evidence:
Our model (described in Section 4 of the main text) was trained on 70000 scenes from the CLEVR
dataset and a total of 699989 questions.

Normalized wording: In the CLEVR-from-pixels supplementary section, the authors state that their model was trained on 70000 CLEVR scenes and a total of 699989 questions.

Context dependency: G-032 / L518 supplies the “CLEVR from pixels” section scope.

Context restriction: G-032 remains a no-packet document-administration decision. Using the heading to establish section scope does not admit it as independent evidence.

Anchor treatment: C-163 supplies the task and evaluated-model scope for C-164 through C-169.

Citation treatment: none.

Duplicate or overlap treatment: none.

Degradation flags: none.

Restrictions:
Preserve both exact quantities.
Do not infer a per-scene question count by dividing the quantities.
Do not infer that the stated quantities include validation or test material.
Do not infer that every scene or question was unique.
Do not replace this training-corpus statement with the validation result in C-168.

C-164 — L520-L522

Disposition: edit.

Criterion: 3.

Authorized exact evidence:
Images were ﬁrst down-sampled to size 128 × 128, then
pre-processed with padding to size 136 × 136, followed by random cropping back to size 128 × 128
and slight random rotations between −0.05 and 0.05 rads.

Normalized wording: For the CLEVR-from-pixels model anchored by C-163, images were down-sampled to 128 × 128, padded to 136 × 136, randomly cropped back to 128 × 128, and subjected to slight random rotations between −0.05 and 0.05 radians.

Dependencies: C-163.

Inherited context: G-032 / L518 supplies the CLEVR-from-pixels section scope through C-163.

Citation treatment: none.

Duplicate or overlap treatment: none.

Degradation flag: The frozen evidence contains “ﬁrst”; the exact PDF is readable as “first”. Preserve the frozen ligature.

Restrictions:
Preserve the operation order: down-sampling, padding, random cropping, then slight random rotation.
Preserve all dimensions and the rotation range.
Do not infer the probability distribution used for rotations.
Do not infer padding values, interpolation method, crop-sampling policy, or whether augmentation was applied during validation or testing.
Do not broaden “Images” beyond the C-163 model and task configuration.

C-165 — L522-L524

Disposition: edit.

Criterion: 3.

Authorized exact evidence:
We used 10 distributed workers that
synchronously updated a central parameter server. Each worker learned with mini-batches of size
64, using the Adam optimizer and a learning rate of 2 .5e−4.

Normalized wording: For the C-163 CLEVR-from-pixels model, training used 10 distributed workers that synchronously updated a central parameter server; each worker used mini-batches of size 64, the Adam optimizer, and a learning rate of 2.5e−4.

Dependencies: C-163.

Citation treatment: none.

Overlap treatment: Record partial semantic overlap with C-104 and C-105. C-104 records Adam with the same learning rate in the earlier CLEVR-from-pixels configuration, and C-105 records mini-batches of size 64 and 10 workers synchronously updating a central parameter server. Preserve C-165 as a distinct supplementary occurrence and retain its provenance, but do not treat the repeated configuration as independent corroboration.

Degradation flag: The frozen evidence contains “2 .5e−4”; the exact PDF is readable as “2.5e−4”. Preserve the frozen spacing.

Restrictions:
Preserve 10 distributed workers.
Preserve synchronous updates to a central parameter server.
Preserve that each worker used mini-batches of size 64.
Preserve the Adam optimizer and learning rate.
Do not infer aggregate batch size unless the source states how worker batches were combined.
Do not infer asynchronous fallback, replicated parameter servers, hardware type, or communication protocol.
Do not generalize this configuration to the state-description or Sort-of-CLEVR models.

C-166 — L524-L525

Disposition: edit.

Criterion: 3.

Authorized exact evidence:
Dropout of 50% was used on the
penultimate layer of the RN.

Normalized wording: For the C-163 CLEVR-from-pixels model, 50% dropout was used on the RN’s penultimate layer.

Dependencies: C-163.

Citation treatment: none.

Overlap treatment: Record partial semantic overlap with C-103’s earlier 50% dropout configuration. Preserve both occurrences and their provenance, but do not treat the repeated dropout detail as independent evidence.

Degradation flags: none.

Restrictions:
Preserve 50%.
Preserve “penultimate layer.”
Preserve the source scope “of the RN.”
Do not infer dropout on recurrent connections, convolutional layers, every RN layer, or the final output layer.
Do not silently identify the penultimate layer as a more specific component than this source sentence states.
Do not infer that dropout remained enabled during evaluation.
Do not infer a causal contribution to performance.

C-167 — L525-L527

Disposition: too-broad.

Reason: C-167 combines an architecture configuration for the best-performing model with a separate observation about the point at which performance stopped improving and training was concluded. Replace C-167 with S-167a and S-167b.

S-167a

Disposition: calibration-accept.

Criterion: 3.

Authorized exact evidence:
In our best performing model each convolutional layer used 24 kernels of
size 3× 3 and stride 2, batch normalization, and rectiﬁed linear units.

Normalized wording: In the best-performing C-163 model, each convolutional layer used 24 kernels of size 3 × 3 with stride 2, batch normalization, and rectified linear units.

Dependencies: C-163.

Citation treatment: none.

Overlap treatment: Record partial semantic overlap with earlier CLEVR-from-pixels configuration material, including C-101. Preserve this supplementary occurrence and its provenance, but do not treat repeated convolutional-configuration details as independent corroboration.

Degradation flags:
The frozen evidence contains “3× 3”; the exact PDF is readable as “3 × 3”.
The frozen evidence contains “rectiﬁed”; the exact PDF is readable as “rectified”.
Preserve the frozen exact evidence unchanged.

Restrictions:
Preserve “best performing” as the authors’ configuration label.
Preserve that the configuration applies to each convolutional layer.
Preserve 24 kernels, size 3× 3, stride 2, batch normalization, and rectiﬁed linear units.
Do not infer the number of convolutional layers from this fragment alone.
Do not infer padding, channel depth, initialization, or convolution direction.
Do not infer the performance margin associated with “best performing.”
Do not claim that any individual listed component caused the model’s performance.

S-167b

Disposition: calibration-accept.

Criterion: 3.

Authorized exact evidence:
The model stopped improving
in performance after approximately 1.4 million iterations, at which point training was concluded.

Normalized wording: The source reports that the C-163 model stopped improving after approximately 1.4 million iterations, at which point training was concluded.

Dependencies: C-163.

Citation treatment: none.

Duplicate or overlap treatment: none.

Degradation flags: none.

Restrictions:
Preserve “stopped improving.”
Preserve “approximately.”
Preserve the stated relationship between the observed lack of further improvement and the conclusion of training.
Do not normalize the observation into formal convergence.
Do not infer which metric was monitored.
Do not infer an early-stopping algorithm, patience interval, validation schedule, or checkpoint-selection rule.
Do not infer global or local optimality.
Do not infer that every training run stopped at the same iteration.
Do not reinterpret 1.4 million iterations as epochs, examples, gradient updates, or worker-local steps beyond what the source states.

C-168 — L528

Disposition: edit.

Criterion: 5.

Authorized exact evidence:
The model achieved 96.8% accuracy on the validation set.

Normalized wording: The C-163 CLEVR-from-pixels model achieved 96.8% accuracy on the validation set.

Dependencies: C-163.

Citation treatment: none.

Result-boundary treatment: Preserve this result separately from C-109’s 95.5% CLEVR test-set result. The two values apply to different evaluation splits and are neither duplicates nor a contradiction.

Degradation flags: none.

Restrictions:
Preserve 96.8%.
Preserve accuracy as the metric.
Preserve the validation-set condition.
Do not substitute the 95.5% test-set result for this value or this value for the test-set result.
Do not infer test accuracy from this sentence.
Do not infer a comparator, confidence interval, statistical significance, state-of-the-art status, or human comparison.
Do not infer that this was necessarily the checkpoint used for every later reported result.

No earlier event, checkpoint, proposal, receipt, correction record, or immutable input is modified by these decisions.

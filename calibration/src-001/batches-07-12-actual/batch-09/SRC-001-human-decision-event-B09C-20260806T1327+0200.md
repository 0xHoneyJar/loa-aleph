# SRC-001 Human Decision Event — Batch 09C

> NONCANONICAL HUMAN-SUPERVISED EXTRACTION-CALIBRATION RECORD

- recorded at: `2026-08-06T13:27:00+02:00`
- source: `SRC-001`
- authority: human
- adopted original candidates: `C-195` through `C-200`
- adopted gap: none
- added units: none
- last fully accounted source line: `L603`
- next source line: `L604`
- next candidate: `C-201`
- next gap: `G-039`
- current batch: `Batch 09`
- human block line endings: `LF as received; no final newline`
- exact human block SHA-256: `756eb6b6c0139d7f1268345c324a3e8c63ced7537eabcaea4588cea2164fc408`
- SRC-001 closed: `false`
- SRC-002 started: `false`
- earlier artifacts mutated: `false`

## Exact Human Decision Block

Adopt every decision in this block exactly as written

C-195 — L590-L592

Disposition: edit.

Criterion: 4.

Authorized exact evidence:
It is important to point out that in the ﬁrst task the
supervision signal provided by the targets explicitly informs about the relations that need to be
computed.

Normalized wording: For the connection-inference task described in C-193, the authors emphasize that the target-based supervision signal explicitly informs the model about the relations that need to be computed.

Dependencies: C-193, which resolves “the first task” as connection inference and supplies its target context.

Citation treatment: none.

Duplicate or overlap treatment: none.

Degradation flag: The frozen evidence contains “ﬁrst”; the exact PDF is readable as “first”. Preserve the frozen ligature.

Restrictions:
Preserve “It is important to point out” as source emphasis.
Preserve that the information comes from the supervision signal provided by the targets.
Preserve “explicitly informs.”
Preserve “relations that need to be computed.”
Do not state that the targets are supplied as model inputs.
Do not infer that the targets specify an internal algorithm or architecture.
Do not infer that explicit target supervision guarantees correct relation inference.
Do not generalize the statement beyond the connection-inference task.


C-196 — L592-L594

Disposition: edit.

Criterion: 4.

Authorized exact evidence:
In the second task, the supervision signal (counts of systems) do not provide explicit
information about the kind of relations that need to be computed. Therefore, the models that solve
the counting task must successfully infer the relations implicitly.

Normalized wording: In the counting task described in C-194, the supervision signal consists of system counts and does not explicitly specify the relations to compute; the source therefore states that models solving the task must infer those relations implicitly.

Dependencies:
C-194, which resolves “the second task” and supplies the count target.
C-195, which supplies the contrast with explicit relational supervision in the first task.

Citation treatment: none.

Duplicate or overlap treatment: none.

Degradation flags: none.

Restrictions:
Preserve the parenthetical scope “counts of systems.”
Preserve “do not provide explicit information.”
Preserve the inferential transition “Therefore.”
Preserve “must successfully infer the relations implicitly.”
Preserve the source’s grammatical form unchanged in exact evidence.
Do not infer what specific relation types the model learns.
Do not infer that relations are represented symbolically or explicitly inside the model.
Do not treat successful task performance as proof of a human-equivalent reasoning process.
Do not generalize the implicit-supervision claim beyond the counting task.


C-197 — L595-L598

Disposition: calibration-accept.

Criterion: 3.

Authorized exact evidence:
Inputs to the RN were state descriptions. Each row of a state description matrix provided
information about a particular object (i.e. ball), including its coordinate position and color. Since
the system was dynamic, and hence evolved through time, each row contained object property
descriptions for 16 consecutive time-frames.

Normalized wording: The RN received state-description matrices in which each row represented a particular ball through coordinate-position and color information, with object properties recorded across 16 consecutive time frames.

Dependencies: none.

Anchor treatment: C-197 supplies the state-description row and temporal context for C-198 and C-199.

Citation treatment: none.

Duplicate or overlap treatment: none.

Degradation flags: none.

Restrictions:
Preserve state descriptions as RN inputs.
Preserve one row per particular object or ball.
Preserve coordinate position and color.
Preserve the dynamic-system context.
Preserve 16 consecutive time-frames.
Do not infer the number of objects or matrix rows.
Do not infer that coordinate position and color are the only possible fields beyond the described configuration.
Do not infer sampling frequency or physical duration from 16 frames.
Do not infer preprocessing, normalization, missing-value handling, or row ordering.
Do not merge this representation statement with C-198’s specific 33-float example.


C-198 — L598-L600

Disposition: calibration-accept.

Criterion: 3.

Authorized exact evidence:
For example, a row could be comprised of 33 ﬂoats:
16 for the object’s x coordinate position across 16 frames, 16 for the object’s y coordinate position
across 16 frames, and 1 for the object’s color.

Normalized wording: As an example of the C-197 state-description representation, a row could contain 33 floats: 16 x-coordinate values across 16 frames, 16 y-coordinate values across 16 frames, and one color value.

Dependencies: C-197, which resolves “a row” as a row of the dynamic state-description matrix.

Citation treatment: none.

Duplicate or overlap treatment: none.

Degradation flag: The frozen evidence contains “ﬂoats”; the exact PDF is readable as “floats”. Preserve the frozen ligature.

Restrictions:
Preserve “For example” and “could be.”
Preserve 33 floats.
Preserve 16 x-coordinate values across 16 frames.
Preserve 16 y-coordinate values across 16 frames.
Preserve one color value.
Do not infer coordinate ranges, units, normalization, or numerical precision.
Do not infer how the color value maps to colors.
Do not infer z coordinates, velocity, acceleration, or other properties.
Do not broaden the example to every dynamic-system input representation.


C-199 — L600-L602

Disposition: calibration-accept.

Criterion: 4.

Authorized exact evidence:
The RN treated each row in this state description
matrix as an object. Thus, it had to infer an object description contained information of the object’s
properties evolving through time.

Normalized wording: Because the RN treated each row of the C-197 state-description matrix as an object, it had to infer from an object description containing information about properties that evolved through time.

Dependencies: C-197, which resolves “this state description matrix” and supplies the temporal row representation.

Citation treatment: none.

Duplicate or overlap treatment: none.

Source-language flag: The exact source sentence has awkward grammar. Preserve the exact evidence unchanged and repair grammar only in normalized wording.

Restrictions:
Preserve the row-as-object treatment.
Preserve the transition expressed by “Thus.”
Preserve the time-evolving object-property scope.
Do not infer a specific temporal-reasoning algorithm.
Do not infer that the RN decomposes the row into separate per-frame objects.
Do not infer recurrence, memory, attention, or temporal convolution from this passage.
Do not convert the design explanation into an empirical performance result.


C-200 — L603-L604

Disposition: calibration-accept.

Criterion: 3.

Authorized exact evidence:
For the connection inference task, the RN’s gθ was a four-layer MLP consisting of three layers
with 1000 units and one layer with 500 units.

Normalized wording: For the connection-inference task, the RN’s gθ was a four-layer MLP with three 1000-unit layers and one 500-unit layer.

Dependencies: none. The task and component scope are explicit.

Context link: C-193 supplies the target representation for the same task but is not required to make C-200 grammatically or semantically complete.

Anchor treatment: C-200 supplies the connection-inference RN and model scope for C-201 through C-204.

Citation treatment: none.

Contextual-overlap treatment: Record contextual overlap with C-102, C-174, C-183, and S-190a, which describe other task-specific gθ configurations. Preserve all configurations separately and do not treat them as duplicates.

Degradation flags: none.

Restrictions:
Preserve connection-inference task scope.
Preserve assignment to gθ.
Preserve four total layers.
Preserve three layers with 1000 units and one layer with 500 units.
Do not infer which layer is the 500-unit layer.
Do not infer activation functions, dropout, parameter sharing, input dimensions, or output dimensions.
Do not infer that the architecture applies unchanged to the counting task; C-203 addresses that relationship.
Do not infer performance or causal benefit from the architecture alone.

No earlier event, checkpoint, proposal, receipt, correction record, or immutable input is modified by these decisions.
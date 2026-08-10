# SRC-001 Human Decision Event — Batch 07B

> NONCANONICAL HUMAN-SUPERVISED EXTRACTION-CALIBRATION RECORD

- recorded at: `2026-08-05T22:06:00+02:00`
- source: `SRC-001`
- authority: human
- adopted gaps: `G-028`, `G-029`
- adopted original candidates: `C-147` through `C-152`
- added split units: `S-147a`, `S-147b`
- last fully accounted source line: `L491`
- next source line: `L492`
- next gap: `G-030`
- next candidate: `C-153`
- next candidate locator: `L493-L494`
- SRC-001 closed: `false`
- SRC-002 started: `false`
- earlier artifacts mutated: `false`

## Exact Human Decision Block

Adopt every decision in this block exactly as written

G-028 — L479

Decision: no packet appropriate.

Exact frozen evidence:
Relational reasoning

Exclusion reason: The line is a subsection heading that supplies organizational scope but makes no independent assertion.

Exclusion class: document-administration.

Missing-packet decision: none.

Dependencies: none.

Citation treatment: none.

Degradation flags: none.

C-147 — L480-L481

Disposition: too-broad.

Reason: The sentence contains two independently checkable assertions: one characterizes relational reasoning in symbolic approaches, and the other states that relational reasoning has explicitly been pursued using neural networks. Replace C-147 with S-147a and S-147b.

S-147a

Disposition: calibration-accept.

Criterion: 1.

Authorized exact evidence:
Relational reasoning is implicit in many symbolic approaches [ 11, 32]

Normalized wording: The source states that relational reasoning is implicit in many symbolic approaches [11, 32].

Dependencies: none.

Citation treatment: preserve citations [11, 32].

Overlap treatment: record partial semantic overlap with C-010. Preserve both occurrences and their different scope and wording, but do not treat the repetition as independent evidence.

Degradation flag: The frozen evidence has “[ 11, 32]” while the exact PDF reads “[11, 32]”. Do not alter the frozen exact evidence.

Restrictions:
Preserve “many” and “implicit.”
Do not broaden the proposition into all symbolic approaches.
Do not equate “implicit” with an explicit relational mechanism.

S-147b

Disposition: calibration-accept.

Criterion: 2.

Authorized exact evidence:
Relational reasoning is implicit in many symbolic approaches [ 11, 32] and has been explicitly pursued
using neural networks as well [4].

Normalized wording: The source states that relational reasoning has also been explicitly pursued using neural networks [4].

Evidence-overlap treatment: The full sentence is retained as overlapping evidence because the grammatical subject “Relational reasoning” is required to preserve the second assertion. The proposition retained for S-147b is distinct from S-147a.

Dependencies: none.

Citation treatment: preserve citation [4].

Degradation flag: The frozen evidence has “[ 11, 32]” while the exact PDF reads “[11, 32]”. Do not alter the frozen exact evidence.

Restrictions:
Treat this as a related-work assertion that neural approaches have explicitly pursued relational reasoning.
Do not infer that all neural networks contain a dedicated relational mechanism.
Do not infer successful performance from this sentence alone.

C-148 — L481-L482

Disposition: calibration-accept.

Criterion: 2.

Authorized exact evidence:
There is recent work applying neural networks to graphs, which are
a natural structure for formalising relations [12, 19, 33, 37, 26, 2].

Normalized wording: The source identifies recent work applying neural networks to graphs and describes graphs as a natural structure for formalising relations [12, 19, 33, 37, 26, 2].

Dependencies: none.

Citation treatment: preserve citations [12, 19, 33, 37, 26, 2].

Overlap treatment: record partial semantic overlap with earlier graph-representation and graph-neural-architecture material, including C-036. Preserve C-148 as a separate related-work occurrence, but do not treat the shared graph proposition as independent corroboration.

Degradation flags: none.

Restrictions:
Preserve “recent” as source-relative wording.
Do not represent the claim as current research status.
Do not infer that every neural network applied to a graph performs the same relational computation as an RN.

C-149 — L482-L485

Disposition: calibration-accept.

Criterion: 4.

Authorized exact evidence:
Perhaps a crucial diﬀerence between
this work and our work here is that RNs require minimal oversight to produce their input (a set of
objects), and can be applied successfully to tasks even when provided with relatively unstructured
inputs coming from CNNs and LSTMs.

Normalized wording: The source suggests that a potentially crucial difference between the graph-neural work described in C-148 and RNs is that RNs require minimal oversight to produce their set-of-objects input and can be applied successfully even when their inputs are relatively unstructured outputs from CNNs and LSTMs.

Dependencies: C-148, which resolves “this work” as the recent work applying neural networks to graphs.

Citation treatment: none.

Overlap treatment: record partial semantic overlap with C-080’s relatively unstructured CNN-or-LSTM-input proposition. C-149 additionally supplies the oversight comparison and successful-application claim. Do not treat the repeated unstructured-input proposition as independent evidence.

Degradation flag: The frozen evidence contains “diﬀerence”; the exact PDF is readable as “difference”. Preserve the frozen ligature.

Restrictions:
Preserve “Perhaps.”
Preserve “minimal oversight,” not “no oversight.”
Preserve the set-of-objects input condition.
Preserve “can be applied successfully,” not guaranteed or universal success.
Preserve CNN and LSTM input provenance.
Do not generalize the comparison beyond the graph-neural work referenced by C-148.

C-150 — L485-L486

Disposition: calibration-accept.

Criterion: 6.

Authorized exact evidence:
There has also been some recent work on reasoning about
sets, although this work does not explicitly reason about the relations of elements within sets [47].

Normalized wording: The source notes recent work on reasoning about sets but states that this work does not explicitly reason about relations among the elements within those sets [47].

Dependencies: none. “This work” resolves within the same sentence to the recent work on reasoning about sets.

Citation treatment: preserve citation [47].

Duplicate or overlap treatment: none.

Degradation flags: none.

Restrictions:
Preserve “some recent work” as source-relative scope.
Preserve “does not explicitly reason.”
Do not strengthen the limitation into a claim that the cited work performs no relational processing of any kind.
Do not infer properties of the cited work beyond the source’s characterization.

G-029 — L487

Decision: no packet appropriate.

Exact frozen evidence:
Grounding spatial relations

Exclusion reason: The line is a subsection heading. It supplies organizational scope for C-151 and C-152 but makes no independent assertion.

Exclusion class: document-administration.

Missing-packet decision: none.

Dependencies: none.

Citation treatment: none.

Degradation flags: none.

C-151 — L488-L490

Disposition: calibration-accept.

Criterion: 2.

Authorized exact evidence:
Although grounding language in spatial percepts has a long-standing tradition, the majority of
previous research has focused on either rule-based spatial representations or hand-engineered spatial
features [8, 10, 20, 21, 24, 29, 38, 39].

Normalized wording: The source states that, despite the long-standing tradition of grounding language in spatial percepts, most previous research focused on either rule-based spatial representations or hand-engineered spatial features [8, 10, 20, 21, 24, 29, 38, 39].

Dependencies: none.

Citation treatment: preserve citations [8, 10, 20, 21, 24, 29, 38, 39].

Duplicate or overlap treatment: none.

Context treatment: Retain the long-standing-tradition clause as scope and contrast for the majority-of-research assertion, but do not count that clause separately as evidence of an architecture, mechanism, or result.

Degradation flags: none.

Restrictions:
Preserve “majority”; do not broaden it to all previous research.
Preserve the distinction between rule-based spatial representations and hand-engineered spatial features.
Do not infer that the cited approaches were exclusively rule-based or hand-engineered in every respect.

C-152 — L490-L491

Disposition: calibration-accept.

Criterion: 5.

Authorized exact evidence:
Although there are some attempts to learn spatial relations
using spatial templates [28, 30], these approaches are less versatile than ours.

Normalized wording: The source acknowledges attempts to learn spatial relations using spatial templates [28, 30] but characterizes those approaches as less versatile than the authors’ RN approach.

Dependencies: none. “These approaches” resolves within the same sentence to the spatial-template approaches.

Citation treatment: preserve citations [28, 30].

Duplicate or overlap treatment: none.

Degradation flags: none.

Restrictions:
Preserve “some attempts.”
Preserve “less versatile than ours” as an attributed, unquantified comparison.
Do not infer a metric or specific dimension of versatility.
Do not strengthen the claim into measured superiority, universal superiority, or superiority on every task.
Do not infer the experimental basis of the comparison from this sentence alone.

No earlier event, checkpoint, proposal, receipt, correction record, or immutable input is modified by these decisions.

# SRC-001 Human Decision Event — Batch 11A

> NONCANONICAL HUMAN-SUPERVISED EXTRACTION-CALIBRATION RECORD

- recorded at: `2026-08-06T20:32:00+02:00`
- source: `SRC-001`
- authority: human
- adopted gap: `G-042`
- added units: `T2-000` through `T2-012`
- formal-material closures: `B10-001`, `TABLE-2-FORMAL-MATERIAL-REVIEW`
- C-170 Table 2 forward dependency: resolved
- last fully accounted source line: `L688`
- next source line: `L689`
- next source-order item: `G-043`
- next candidate: none; original candidate inventory ends at `C-206`
- next gap: `G-043`
- current batch: `Batch 12`
- human block line endings: `CRLF as received; no final newline`
- exact human block SHA-256: `10709c4552a0e627d3a3509ac0be569aeb9e3906dd5c7387b78b577d57681a3c`
- SRC-001 closed: `false`
- SRC-002 started: `false`
- earlier artifacts mutated: `false`

## Exact Human Decision Block

Adopt every decision in this block exactly as written

G-042 — L669-L688

Decision: no-candidate status is incorrect.

Source partition:
L669-L686 is claim-bearing Table 2 formal material.
L687 is the extracted printed page number.
L688 is a blank line.

L669-L686 decision: Add T2-000 through T2-012 as specified below.

L687-L688 decision: no packet appropriate.

L687-L688 exclusion class: document-administration.

Prior-response treatment: The earlier response stating “No admitted spans in L669-L688” has no recorded semantic reason or human approval. Do not adopt it and do not treat it as authoritative.

Cross-batch formal-review treatment:
Close B10-001 through the adopted T2-000 through T2-012 decisions.
Close TABLE-2-FORMAL-MATERIAL-REVIEW.
Resolve C-170’s forward Table 2 dependency through T2-000 through T2-012.
Retain C-171 as contextual failure-mode analysis only. The Table 2 examples do not prove C-171’s hypothesized causes.

Shared formal-material representation:
The frozen extraction interleaves the three Table 2 columns.
For each T2 example, preserve the exact frozen source-group locator and provenance.
Also record a separate exact PDF page, row, and column locator and a PDF-visible formal-material transcription.
Do not label a PDF-aligned question string as a contiguous frozen-text quote.
Do not silently replace, reorder, or reconstruct the frozen source bytes.

Shared example restrictions:
Treat each question, RN answer, and GT answer as one empirical failure unit.
Do not split an RN answer from its aligned question or GT answer.
Do not infer failure frequency, prevalence, representativeness, exhaustiveness, or sampling method from the examples.
Do not use an example to prove C-171’s occlusion or positional-precision hypotheses.
Do not treat the table image as part of the evaluated question text.


T2-000 — L686

Disposition: calibration-accept.

Criterion: 5.

Authorized exact frozen evidence:
Table 2: Failures on CLEVR; RN – predicted answers, GT – ground-truth answer.

Normalized wording: Table 2 presents CLEVR failure examples and defines RN as the predicted answer and GT as the ground-truth answer.

Dependencies: none.

Shared-context treatment: T2-000 supplies the table scope and RN/GT role definitions for T2-001 through T2-012.

Context link: C-170 introduces Table 2 as examples the model answered incorrectly.

Citation treatment: none.

Degradation flags: none.

Restrictions:
Preserve “Failures on CLEVR.”
Preserve RN as predicted answers.
Preserve GT as ground-truth answers.
Do not treat the caption as an aggregate accuracy measurement.
Do not infer the number, frequency, or distribution of failures from the caption.


T2-001

Disposition: calibration-accept.

Criterion: 5.

Frozen source group: L665-L669.

PDF locator: page 14, row 1, column 1.

Authorized PDF-visible formal-material transcription:
Question: What shape is the small object that is in front of the yellow matte thing and behind the gray sphere?
RN: cylinder
GT: cube

Normalized wording: In Table 2, for the question asking the shape of the small object in front of the yellow matte thing and behind the gray sphere, the RN predicted cylinder, while the ground-truth answer was cube.

Dependencies: T2-000.

Context link: C-170.

Layout flag: The transcription is PDF-aligned formal material and is not a contiguous frozen-text quote.

Restrictions:
Preserve the complete question.
Preserve RN cylinder.
Preserve GT cube.
Do not infer which relation or visual feature caused the error.


T2-002

Disposition: calibration-accept.

Criterion: 5.

Frozen source group: L665-L669.

PDF locator: page 14, row 1, column 2.

Authorized PDF-visible formal-material transcription:
Question: What number of things are either tiny green rubber objects or shiny things that are behind the big metal block?
RN: 1
GT: 2

Normalized wording: In Table 2, for the question asking how many things are either tiny green rubber objects or shiny things behind the big metal block, the RN predicted 1, while the ground truth was 2.

Dependencies: T2-000.

Context link: C-170.

Layout flag: The transcription is PDF-aligned formal material and is not a contiguous frozen-text quote.

Restrictions:
Preserve the disjunction expressed by “either” and “or.”
Preserve the behind-the-big-metal-block condition.
Preserve RN 1.
Preserve GT 2.
Do not infer which qualifying category contained the missed object.


T2-003

Disposition: calibration-accept.

Criterion: 5.

Frozen source group: L665-L669.

PDF locator: page 14, row 1, column 3.

Authorized PDF-visible formal-material transcription:
Question: What number of objects are blocks that are in front of the large red cube or green balls?
RN: 2
GT: 3

Normalized wording: In Table 2, for the question asking how many objects are blocks in front of the large red cube or are green balls, the RN predicted 2, while the ground truth was 3.

Dependencies: T2-000.

Context link: C-170.

Layout flag: The transcription is PDF-aligned formal material and is not a contiguous frozen-text quote.

Restrictions:
Preserve the source’s “or” structure.
Preserve RN 2.
Preserve GT 3.
Do not silently reinterpret the question’s logical grouping.


T2-004

Disposition: calibration-accept.

Criterion: 5.

Frozen source group: L670-L674.

PDF locator: page 14, row 2, column 1.

Authorized PDF-visible formal-material transcription:
Question: Is the shape of the small red object the same as the large matte object that is right of the small rubber ball?
RN: no
GT: yes

Normalized wording: In Table 2, for the shape-comparison question concerning the small red object and the large matte object right of the small rubber ball, the RN predicted no, while the ground truth was yes.

Dependencies: T2-000.

Context link: C-170.

Layout flag: The transcription is PDF-aligned formal material and is not a contiguous frozen-text quote.

Restrictions:
Preserve the shape-equality comparison.
Preserve RN no.
Preserve GT yes.
Do not infer which compared object was misidentified.


T2-005

Disposition: calibration-accept.

Criterion: 5.

Frozen source group: L670-L674.

PDF locator: page 14, row 2, column 2.

Authorized PDF-visible formal-material transcription:
Question: How many gray objects are in front of the tiny green shiny ball and right of the big blue matte thing?
RN: 0
GT: 1

Normalized wording: In Table 2, for the question asking how many gray objects are both in front of the tiny green shiny ball and right of the big blue matte thing, the RN predicted 0, while the ground truth was 1.

Dependencies: T2-000.

Context link: C-170.

Layout flag: The transcription is PDF-aligned formal material and is not a contiguous frozen-text quote.

Restrictions:
Preserve both spatial conditions.
Preserve RN 0.
Preserve GT 1.
Do not infer whether the error arose from color, object identity, or either spatial relation.


T2-006

Disposition: calibration-accept.

Criterion: 5.

Frozen source group: L670-L674.

PDF locator: page 14, row 2, column 3.

Authorized PDF-visible formal-material transcription:
Question: What number of objects are big red matte cubes or things on the right side of the large red matte block?
RN: 5
GT: 6

Normalized wording: In Table 2, for the question asking how many objects are big red matte cubes or are on the right side of the large red matte block, the RN predicted 5, while the ground truth was 6.

Dependencies: T2-000.

Context link: C-170.

Layout flag: The transcription is PDF-aligned formal material and is not a contiguous frozen-text quote.

Restrictions:
Preserve both disjunctive categories.
Preserve RN 5.
Preserve GT 6.
Do not infer how overlap between the categories was counted.


T2-007

Disposition: calibration-accept.

Criterion: 5.

Frozen source group: L675-L680.

PDF locator: page 14, row 3, column 1.

Authorized PDF-visible formal-material transcription:
Question: There is a brown ball; what number of things are left of it?
RN: 3
GT: 4

Normalized wording: In Table 2, for the question asking how many things are left of a brown ball, the RN predicted 3, while the ground truth was 4.

Dependencies: T2-000.

Context link: C-170.

Layout flag: The transcription is PDF-aligned formal material and is not a contiguous frozen-text quote.

Restrictions:
Preserve the brown-ball reference.
Preserve RN 3.
Preserve GT 4.
Do not infer why the RN missed one qualifying object.


T2-008

Disposition: calibration-accept.

Criterion: 5.

Frozen source group: L675-L680.

PDF locator: page 14, row 3, column 2.

Authorized PDF-visible formal-material transcription:
Question: How many objects are big purple rubber blocks or red blocks in front of the tiny yellow rubber thing?
RN: 3
GT: 2

Normalized wording: In Table 2, for the question asking how many objects are big purple rubber blocks or red blocks in front of the tiny yellow rubber thing, the RN predicted 3, while the ground truth was 2.

Dependencies: T2-000.

Context link: C-170.

Layout flag: The transcription is PDF-aligned formal material and is not a contiguous frozen-text quote.

Restrictions:
Preserve the complete disjunction and spatial condition.
Preserve RN 3.
Preserve GT 2.
Do not infer that the error was caused by category overlap.


T2-009

Disposition: calibration-accept.

Criterion: 5.

Frozen source group: L675-L680.

PDF locator: page 14, row 3, column 3.

Authorized PDF-visible formal-material transcription:
Question: How many things are rubber cylinders in front of the tiny yellow block or blocks that are to the right of the small brown rubber thing?
RN: 2
GT: 3

Normalized wording: In Table 2, for the question asking how many things are rubber cylinders in front of the tiny yellow block or blocks right of the small brown rubber thing, the RN predicted 2, while the ground truth was 3.

Dependencies: T2-000.

Context link: C-170.

Layout flag: The transcription is PDF-aligned formal material and is not a contiguous frozen-text quote.

Restrictions:
Preserve both disjunctive categories and their separate spatial conditions.
Preserve RN 2.
Preserve GT 3.
Do not simplify the question into a single relation or object class.


T2-010

Disposition: calibration-accept.

Criterion: 5.

Frozen source group: L681-L685.

PDF locator: page 14, row 4, column 1.

Authorized PDF-visible formal-material transcription:
Question: What number of objects are either big things that are left of the cylinder or cylinders?
RN: 2
GT: 3

Normalized wording: In Table 2, for the question asking how many objects are either big things left of the cylinder or cylinders, the RN predicted 2, while the ground truth was 3.

Dependencies: T2-000.

Context link: C-170.

Layout flag: The transcription is PDF-aligned formal material and is not a contiguous frozen-text quote.

Restrictions:
Preserve “either.”
Preserve RN 2.
Preserve GT 3.
Do not infer whether the reference cylinder is included in the count.


T2-011

Disposition: calibration-accept.

Criterion: 5.

Frozen source group: L681-L685.

PDF locator: page 14, row 4, column 2.

Authorized PDF-visible formal-material transcription:
Question: Are there the same number of small blue objects that are to the right of the blue cube and blue metal cubes?
RN: no
GT: yes

Normalized wording: In Table 2, for the number-comparison question concerning small blue objects right of the blue cube and blue metal cubes, the RN predicted no, while the ground truth was yes.

Dependencies: T2-000.

Context link: C-170.

Layout flag: The transcription is PDF-aligned formal material and is not a contiguous frozen-text quote.

Restrictions:
Preserve the same-number comparison.
Preserve RN no.
Preserve GT yes.
Do not silently rewrite the source question to resolve grammatical ambiguity.


T2-012

Disposition: calibration-accept.

Criterion: 5.

Frozen source group: L681-L685.

PDF locator: page 14, row 4, column 3.

Authorized PDF-visible formal-material transcription:
Question: What number of other things are there of the same material as the green cube?
RN: 6
GT: 5

Normalized wording: In Table 2, for the question asking how many other things have the same material as the green cube, the RN predicted 6, while the ground truth was 5.

Dependencies: T2-000.

Context link: C-170.

Layout flag: The transcription is PDF-aligned formal material and is not a contiguous frozen-text quote.

Restrictions:
Preserve “other things.”
Preserve the same-material condition.
Preserve RN 6.
Preserve GT 5.
Do not infer whether the RN improperly included the reference cube.


L687-L688

Decision: no packet appropriate.

Exact frozen evidence:
L687: 14
L688: empty LF line

Exclusion class: document-administration.

Missing-packet decision: none.

Restrictions:
Do not append the printed page number to T2-000.
Do not prepend the printed page number to the References heading in Batch 12.

No earlier event, checkpoint, proposal, receipt, correction record, or immutable input is modified by these decisions.
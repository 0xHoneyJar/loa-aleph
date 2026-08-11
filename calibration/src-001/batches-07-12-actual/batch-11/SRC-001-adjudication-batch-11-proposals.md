# SRC-001 Adjudication: Batch 11 Proposals

> NONCANONICAL MODEL-ASSISTED DEVELOPMENT-CALIBRATION EVIDENCE
>
> This replaces no human field and is not Loa-Aleph run evidence.

## Batch Identity

| field | exact value |
|---|---|
| review block | `L669-L688` |
| candidate rows | none in handoff |
| no-candidate row | `G-042` |
| frozen source SHA-256 | `5aef61988ff0db6f2ecc2b7980f370583a317e2427c85a6f78adc3ccc8a1d22a` |
| criteria SHA-256 | `1df51f9872895a3a87a9face2bafe50db34cdfbfd73826e2a31f531c4c538df8` |
| source reopened | frozen text `L669-L688`; exact PDF page 14 |
| criteria changes applied | none |

The complete Table 2 was reopened in the exact PDF. `L669`, omitted from the
earlier completion prompt, was reopened directly in the frozen source.

## No-Candidate Recommendation

| review ID | proposed decision | reason | missing-packet decision |
|---|---|---|---|
| G-042 (`L669-L688`) | no-candidate status is incorrect | `L669-L686` is claim-bearing Table 2 material: ground truth for the first three examples, nine further failure examples with RN and ground-truth answers, and the caption defining the table. `L687-L688` is only page administration. | Add T2-000 through T2-012 below. Exclude only L687-L688. |

The prior `No admitted spans in L669-L688` response has no semantic reason or
human approval and is not adopted.

## Missing Table 2 Packets

Shared evidence and scope:

- C-170 introduces Table 2 as examples the model answers incorrectly.
- C-171 records the authors' failure-mode hypotheses.
- The exact PDF aligns each question with its `RN` predicted answer and `GT`
  ground-truth answer.
- Every example is proposed under criterion `5` as an empirical failure result.
  Importance is judged later.

| proposal ID | frozen source group | PDF-aligned question | RN | GT |
|---|---|---|---|---|
| T2-000 | `L686` | `"Table 2: Failures on CLEVR; RN – predicted answers, GT – ground-truth answer."` | shared caption | shared caption |
| T2-001 | `L665-L669` | `"What shape is the small object that is in front of the yellow matte thing and behind the gray sphere?"` | `cylinder` | `cube` |
| T2-002 | `L665-L669` | `"What number of things are either tiny green rubber objects or shiny things that are behind the big metal block?"` | `1` | `2` |
| T2-003 | `L665-L669` | `"What number of objects are blocks that are in front of the large red cube or green balls?"` | `2` | `3` |
| T2-004 | `L670-L674` | `"Is the shape of the small red object the same as the large matte object that is right of the small rubber ball?"` | `no` | `yes` |
| T2-005 | `L670-L674` | `"How many gray objects are in front of the tiny green shiny ball and right of the big blue matte thing?"` | `0` | `1` |
| T2-006 | `L670-L674` | `"What number of objects are big red matte cubes or things on the right side of the large red matte block?"` | `5` | `6` |
| T2-007 | `L675-L680` | `"There is a brown ball; what number of things are left of it?"` | `3` | `4` |
| T2-008 | `L675-L680` | `"How many objects are big purple rubber blocks or red blocks in front of the tiny yellow rubber thing?"` | `3` | `2` |
| T2-009 | `L675-L680` | `"How many things are rubber cylinders in front of the tiny yellow block or blocks that are to the right of the small brown rubber thing?"` | `2` | `3` |
| T2-010 | `L681-L685` | `"What number of objects are either big things that are left of the cylinder or cylinders?"` | `2` | `3` |
| T2-011 | `L681-L685` | `"Are there the same number of small blue objects that are to the right of the blue cube and blue metal cubes?"` | `no` | `yes` |
| T2-012 | `L681-L685` | `"What number of other things are there of the same material as the green cube?"` | `6` | `5` |

The question strings above preserve the PDF-visible wording and correspond to
the degraded multi-column frozen extraction. The numeric and categorical RN/GT
values are exact source text. T2-001 through T2-003 also resolve B10-001 and
show why omitted line L669 was load-bearing.

## Exclusion Record

- `L687`: extracted page number.
- `L688`: blank line.
- exclusion class: `document-administration`.

## Provisional Criteria Observations

The unchanged criteria do not specify a canonical locator/quote representation
for multi-column tables whose text extraction interleaves columns. This remains
provisional; no criterion was changed or applied retroactively.

## Human Gate

G-042 remains human-open. A human must adopt, revise, or reject the proposed
table packets. SRC-001 remains open, and SRC-002 must not begin.

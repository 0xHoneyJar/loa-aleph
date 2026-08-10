# SRC-001 Adjudication: Batch 08 Proposals

> NONCANONICAL MODEL-ASSISTED DEVELOPMENT-CALIBRATION EVIDENCE
>
> These recommendations do not replace open human dispositions and are not
> Loa-Aleph run evidence.

## Batch Identity

| field | exact value |
|---|---|
| review block | `L519-L568` |
| candidate rows | `C-163` through `C-183` |
| no-candidate rows | `G-033` through `G-036` |
| frozen source SHA-256 | `5aef61988ff0db6f2ecc2b7980f370583a317e2427c85a6f78adc3ccc8a1d22a` |
| criteria SHA-256 | `1df51f9872895a3a87a9face2bafe50db34cdfbfd73826e2a31f531c4c538df8` |
| source reopened | frozen text `L519-L568`; exact PDF pages 11-12 |
| criteria changes applied | none |

Each locator and quote was reopened. The exact PDF was checked for the state
description configuration symbols, Sort-of-CLEVR page break, and subsection
structure.

## Candidate Recommendations

| ID | stated criterion satisfied | proposed disposition | reason | replacement, split, or dependency |
|---|---|---|---|---|
| C-163 | yes, criterion 3 | `calibration-accept` | It anchors the supplementary CLEVR-from-pixels training configuration and preserves both corpus quantities. | Anchor for C-164 through C-169. |
| C-164 | yes, criterion 3 | `edit` | The preprocessing and augmentation details are valid, but `Images` must remain scoped to C-163's CLEVR-from-pixels model. | Retain the quote and record a dependency on C-163. |
| C-165 | yes, criterion 3 | `edit` | The worker, parameter-server, batch, optimizer, and learning-rate details are valid, but their task/model scope is C-163. | Retain the quote and record a dependency on C-163. |
| C-166 | yes, criterion 3 | `edit` | The dropout detail is valid, but `the RN` must remain scoped to C-163's model. | Retain the quote and record a dependency on C-163. |
| C-167 | yes, criterion 3 | `too-broad` | It combines an architecture configuration with an independent convergence/stopping result. | Split into S-167a `L525-L526` (24 kernels, 3x3, stride 2, batch normalization, ReLU) and S-167b `L526-L527` (approximately 1.4M-iteration plateau and stopping), both criterion 3 and dependent on C-163. |
| C-168 | yes, criterion 5 | `edit` | The 96.8% validation result is valid, but `The model` must resolve to C-163's CLEVR-from-pixels model. | Retain the quote and record a dependency on C-163. |
| C-169 | yes, criterion 5 | `edit` | The model-size comparisons are valid, but their task and evaluated-model scope comes from C-163. | Retain the quote and record a dependency on C-163. |
| C-170 | yes, criterion 6 | `calibration-accept` | It states that observed wrong answers expose architecture limitations and identifies Table 2 as the question/ground-truth evidence surface. | Dependency on the later Table 2 formal-material review. |
| C-171 | yes, criterion 6 | `calibration-accept` | It preserves the authors' hypothesis, both failure conditions, and the observation that many cases also challenge humans. | none |
| C-172 | yes, criterion 2 | `calibration-accept` | It anchors the CLEVR state-description model and states the exact architectural difference from the pixel model. | Anchor for C-173 through C-175. |
| C-173 | yes, criterion 3 | `edit` | The LSTM and word-lookup dimensions are valid, but their task/model scope is C-172. | Retain the quote and record a dependency on C-172. |
| C-174 | yes, criterion 3 | `edit` | The MLP dimensions, activations, and dropout are valid and task-scoped by C-172. The frozen text reads `fθ`; the exact PDF reads `fφ`, so the discrepancy must remain visibly flagged rather than silently repaired. | Retain the frozen quote; record a dependency on C-172 and a degraded-extraction flag for `fθ`/`fφ`. |
| C-175 | yes, criterion 3 | `edit` | The worker, server, batch, optimizer, and learning-rate details are valid, but their task/model scope is C-172. | Retain the quote and record a dependency on C-172. |
| C-176 | yes, criterion 3 | `calibration-accept` | It anchors Sort-of-CLEVR size, validation split, questions per image, and relational balance. | Anchor for C-177 through C-183. |
| C-177 | yes, criterion 1 | `calibration-accept` | It defines all three non-relational question categories with exact examples. | none |
| C-178 | yes, criterion 4 | `edit` | The explanation is valid, but `These questions` must refer to the categories in C-177. | Retain the quote and record a dependency on C-177. |
| C-179 | yes, criterion 1 | `calibration-accept` | It defines all three relational question categories with exact examples. | none |
| C-180 | yes, criterion 4 | `edit` | The explanation and unique-color condition are valid, but `these` must refer to C-179's categories. | Retain the quote and record a dependency on C-179. |
| C-181 | yes, criterion 3 | `calibration-accept` | It records the 11-bit encoding and exact allocation between color identity and question type/subtype. | none |
| C-182 | yes, criterion 3 | `edit` | The convolutional and question-conditioning configuration is valid, but `this task` must resolve to C-176's Sort-of-CLEVR task; it also begins a configuration list continued by C-183/C-184. | Retain the quote and record a dependency on C-176 plus continuation links to C-183 and C-184. |
| C-183 | yes, criterion 3 | `edit` | The `gθ` MLP detail is valid, but it is a semicolon-delimited continuation with no task/model scope in isolation. | Retain the quote and record dependencies on C-176 and C-182, plus a continuation link to C-184. |

Proposed disposition counts: `calibration-accept=8`, `edit=12`,
`too-broad=1`, and `reject=too-narrow=duplicate=exclude=uncertain=0`.

## No-Candidate Recommendations

| review ID | proposed decision | exclusion reason | missing-packet decision |
|---|---|---|---|
| G-033 (`L531`) | no packet appropriate | `Failure cases` subsection heading (`document-administration`). | none |
| G-034 (`L538`) | no packet appropriate | `C CLEVR from state descriptions` section heading (`document-administration`). | none |
| G-035 (`L546`) | no packet appropriate | `D Sort-of-CLEVR` section heading (`document-administration`). | none |
| G-036 (`L563-L564`) | no packet appropriate | Extracted page number and blank line (`document-administration`). | none |

## Provisional Criteria Observations

No criteria change is proposed. This batch reinforces the need for explicit
task/configuration dependencies when a semicolon-delimited implementation list
is divided into separate packets.

## Human Gate

No handoff row has been changed. A human must explicitly adopt, revise, or
reject these recommendations. SRC-001 remains open, and SRC-002 must not begin.

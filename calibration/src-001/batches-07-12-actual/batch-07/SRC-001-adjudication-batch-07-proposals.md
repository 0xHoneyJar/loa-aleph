# SRC-001 Adjudication: Batch 07 Proposals

> NONCANONICAL MODEL-ASSISTED DEVELOPMENT-CALIBRATION EVIDENCE
>
> These recommendations do not replace open human dispositions and are not
> Loa-Aleph run evidence.

## Batch Identity

| field | exact value |
|---|---|
| review block | `L469-L518` |
| candidate rows | `C-146` through `C-162` |
| no-candidate rows | `G-027` through `G-032` |
| frozen source SHA-256 | `5aef61988ff0db6f2ecc2b7980f370583a317e2427c85a6f78adc3ccc8a1d22a` |
| criteria SHA-256 | `1df51f9872895a3a87a9face2bafe50db34cdfbfd73826e2a31f531c4c538df8` |
| source reopened | frozen text `L469-L518`; exact PDF pages 10-11 |
| criteria changes applied | none |

Each handoff locator and quote was reopened. The supplementary-material
hierarchy and the C-162 page break were checked in the exact PDF.

## Candidate Recommendations

| ID | stated criterion satisfied | proposed disposition | reason | replacement, split, or dependency |
|---|---|---|---|---|
| C-146 | yes, criterion 2 | `edit` | The first two sentences assert RN task/domain versatility; the final sentence only announces a related-work overview. | Keep `L476-L478` through `"natural language\nunderstanding."`; exclude `"Here, we provide..."` as document navigation. |
| C-147 | yes, criterion 2 | `calibration-accept` | It contrasts implicit relational reasoning in symbolic approaches with explicit pursuit in neural networks. | none |
| C-148 | yes, criterion 2 | `calibration-accept` | It identifies graphs as a natural representation for formalizing relations and records their neural-network use. | none |
| C-149 | yes, criterion 4 | `calibration-accept` | It compares oversight requirements and links RN input handling to successful use of relatively unstructured CNN/LSTM inputs. | none |
| C-150 | yes, criterion 6 | `calibration-accept` | It preserves the limitation that cited set-reasoning work does not explicitly reason about relations among set elements. | none |
| C-151 | yes, criterion 2 | `calibration-accept` | It records the dominant rule-based or hand-engineered representations/features in prior spatial-grounding work. | none |
| C-152 | yes, criterion 5 | `calibration-accept` | It preserves the learned-spatial-template condition and the source's relative-versatility comparison. | none |
| C-153 | yes, criterion 1 | `calibration-accept` | It defines visual question answering as a task measuring scene understanding through questions. | none |
| C-154 | yes, criterion 1 | `calibration-accept` | It states CLEVR's intended challenge scope: relational and multimodal reasoning. | none |
| C-155 | yes, criterion 2 | `calibration-accept` | It describes the shared QA pipeline from question/image encoders through representation combination to answer production. | none |
| C-156 | yes, criterion 2 | `calibration-accept` | It states the attention mechanism used by successful methods and its image-region localization role. | none |
| C-157 | yes, criterion 2 | `calibration-accept` | It states the authors' pipeline choice and RN reasoning-module substitution. | none |
| C-158 | yes, criterion 5 | `calibration-accept` | It records two parallel CLEVR architectures, their compositionality basis, and their reported relational-reasoning capability. | none |
| C-159 | yes, criterion 6 | `calibration-accept` | It preserves the module-design or ground-truth-program requirements of both comparator approaches. | none |
| C-160 | yes, criterion 5 | `calibration-accept` | It preserves the RN simplicity, composability, application breadth, and both CLEVR performance comparisons. | none |
| C-161 | no | `reject` | The quote reports longevity and growing research interest but gives no architecture, component, mechanism, interaction, or information-flow claim under criterion 2, and no other admission criterion is met by field activity alone. | none |
| C-162 | yes, criterion 5 | `edit` | The empirical comparison is valid, but the quote embeds the extracted page number and blank line, and `these architectures` depends on the preceding neural-memory context. | Replace with E-003 below and record the L510-L512 context dependency. |

Proposed disposition counts: `calibration-accept=14`, `edit=2`,
`reject=1`, and `too-broad=too-narrow=duplicate=exclude=uncertain=0`.

## Candidate Repair E-003

C-162 is one sentence split by page administration:

- fragment 1, `L513`: `"While these architectures rely on ‘memories’, we empirically show that the RN module has similar"`
- fragment 2, `L516-L517`: `"capabilities, reaching very competitive results on the bAbI dataset [ 41] – a dataset that test reasoning\ncapabilities of text-based question answering models."`
- proposed criterion: `5`
- dependency: `these architectures` refers to the neural text-QA approaches
  described at `L510-L512`.
- preserved scope: memory-reliant comparators; RN; bAbI; similar capabilities;
  very competitive results.

## No-Candidate Recommendations

| review ID | proposed decision | exclusion reason | missing-packet decision |
|---|---|---|---|
| G-027 (`L469-L475`) | no packet appropriate | Blank line, supplementary heading, contents/navigation description, and `A Related Work` heading (`document-administration`). | none |
| G-028 (`L479`) | no packet appropriate | `Relational reasoning` subsection heading (`document-administration`). | none |
| G-029 (`L487`) | no packet appropriate | `Grounding spatial relations` subsection heading (`document-administration`). | none |
| G-030 (`L492`) | no packet appropriate | `Visual question answering` subsection heading (`document-administration`). | none |
| G-031 (`L509`) | no packet appropriate | `Text-based question answering` subsection heading (`document-administration`). | none |
| G-032 (`L518`) | no packet appropriate | `B CLEVR from pixels` section heading (`document-administration`). | none |

## Provisional Criteria Observations

No new criteria change is proposed. E-003 is another instance of the existing
page-administration interruption issue.

## Human Gate

No handoff row has been changed. A human must explicitly adopt, revise, or
reject these recommendations. SRC-001 remains open, and SRC-002 must not begin.

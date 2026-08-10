# SRC-001 Adjudication: Batch 10 Proposals

> NONCANONICAL MODEL-ASSISTED DEVELOPMENT-CALIBRATION EVIDENCE
>
> These recommendations do not replace open human dispositions and are not
> Loa-Aleph run evidence.

## Batch Identity

| field | exact value |
|---|---|
| review block | `L619-L668` |
| candidate rows | `C-205` and `C-206` |
| no-candidate rows | `G-040` and `G-041` |
| frozen source SHA-256 | `5aef61988ff0db6f2ecc2b7980f370583a317e2427c85a6f78adc3ccc8a1d22a` |
| criteria SHA-256 | `1df51f9872895a3a87a9face2bafe50db34cdfbfd73826e2a31f531c4c538df8` |
| source reopened | frozen text `L619-L668`; exact PDF pages 13-14 |
| criteria changes applied | none |

Figure 4 and the start of Table 2 were checked in the exact PDF. Both
candidate locators and quotes were reopened in the frozen text.

## Candidate Recommendations

| ID | stated criterion satisfied | proposed disposition | reason | replacement or split |
|---|---|---|---|---|
| C-205 | yes, criterion 3 | `calibration-accept` | It defines the illustrated Sort-of-CLEVR example structure: six objects, one relational question, one non-relational question, and corresponding answers. | none |
| C-206 | yes, criterion 5 | `calibration-accept` | It preserves the metric, CNN+RN/CNN+MLP comparison, larger relational-question result, and similar non-relational performance. | none |

Proposed disposition counts: `calibration-accept=2`, and
`edit=reject=too-broad=too-narrow=duplicate=exclude=uncertain=0`.

## No-Candidate Recommendations

| review ID | proposed decision | exclusion reason or defect | missing-packet decision |
|---|---|---|---|
| G-040 (`L619-L656`) | no standalone packet appropriate | The exact PDF confirms that these lines are Figure 4's example question/answer labels, axis/tick labels, and model legend. C-205 states the example structure and C-206 states the empirical comparison; the labels add no independent prose assertion or exact numeric result. | Exclude as figure examples/labels without an independent assertion; do not infer bar values. |
| G-041 (`L663-L668`) | no-candidate status is not fully appropriate | `L663-L664` is page administration. `L665-L668` begins Table 2 with three failure questions and their RN-predicted answers; ground-truth rows and further examples continue in G-042. | Exclude only L663-L664. Resolve Table 2 as B10-001 in batch 11. |

## Cross-Batch Formal Review B10-001

- formal material: Table 2, PDF page 14.
- current frozen span: starts at `L665`; continues through `L688`.
- evidence role: examples of CLEVR questions answered incorrectly by the RN,
  with predicted (`RN`) and ground-truth (`GT`) answers.
- dependency: C-170 introduces Table 2 as failure evidence; C-171 states the
  authors' inferred failure modes.
- status: substantive formal material; no-candidate exclusion is invalid.
  Exact example-level granularity and missing packets are resolved from a
  fresh `L669-L688` read in batch 11.

## Provisional Criteria Observations

No criteria change is proposed. Table 2 again raises the existing provisional
question of how shared table headers/captions should be represented as packet
dependencies.

## Human Gate

No handoff row has been changed. A human must explicitly adopt, revise, or
reject these recommendations. SRC-001 remains open, and SRC-002 must not begin.

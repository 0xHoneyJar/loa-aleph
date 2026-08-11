# SRC-001 Adjudication: Batch 09 Proposals

> NONCANONICAL MODEL-ASSISTED DEVELOPMENT-CALIBRATION EVIDENCE
>
> These recommendations do not replace open human dispositions and are not
> Loa-Aleph run evidence.

## Batch Identity

| field | exact value |
|---|---|
| review block | `L569-L618` |
| candidate rows | `C-184` through `C-204` |
| no-candidate rows | `G-037` through `G-039` |
| frozen source SHA-256 | `5aef61988ff0db6f2ecc2b7980f370583a317e2427c85a6f78adc3ccc8a1d22a` |
| criteria SHA-256 | `1df51f9872895a3a87a9face2bafe50db34cdfbfd73826e2a31f531c4c538df8` |
| source reopened | frozen text `L569-L618`; exact PDF pages 12-13 |
| criteria changes applied | none |

Each locator and quote was reopened. The exact PDF was checked for the
Sort-of-CLEVR continuation, `10²` target notation, and Figure 4 boundary.

## Candidate Recommendations

| ID | stated criterion satisfied | proposed disposition | reason | replacement, split, or dependency |
|---|---|---|---|---|
| C-184 | yes, criterion 3 | `edit` | It starts with `and` and continues the Sort-of-CLEVR list begun by C-182/C-183. | Retain the quote and record dependencies on C-176, C-182, and C-183. |
| C-185 | yes, criterion 3 | `edit` | The loss, optimizer, rate, and batch details are valid, but their Sort-of-CLEVR model scope comes from C-182 through C-184. | Retain the quote and record dependencies on C-176 and C-182 through C-184. |
| C-186 | yes, criterion 3 | `calibration-accept` | It anchors the CNN+MLP comparator, its Sort-of-CLEVR purpose, shared CNN/LSTM, and end-to-end condition. | Anchor for C-187 and C-188. |
| C-187 | yes, criterion 3 | `edit` | The matched-depth/width MLP substitution is valid, but `this time` depends on comparator C-186. | Retain the quote and record a dependency on C-186. |
| C-188 | yes, criterion 6 | `edit` | The parameter-count caveat and cause are valid, but `this model` is C-186/C-187's CNN+MLP comparator. | Retain the quote and record dependencies on C-186 and C-187. |
| C-189 | yes, criterion 3 | `calibration-accept` | It anchors the bAbI model and defines each support-sentence object's 32-unit LSTM representation. | Anchor for C-190 through C-192. |
| C-190 | yes, criterion 3 | `too-broad` | It combines a complete `gθ` configuration with the incomplete first half of the `fφ` configuration. | Split into S-190a `L581`: `"For the RN, gθ was a four-layer MLP consisting of 256 units per layer."`; and S-190b `L581-L583`: `"For\nfφ, we used a three-layer MLP consisting of 256, 512, and 159 units, where the ﬁnal layer was a\nlinear layer that produced logits for a softmax over the answer vocabulary."` Both depend on C-189. |
| C-191 | yes, criterion 3 | `too-narrow` | It begins with `where` and contains only the tail of the `fφ` sentence. | Supersede with S-190b. |
| C-192 | yes, criterion 3 | `too-broad` | It combines an independent question-processing component with a loss/optimizer configuration. | Split at the sentence boundary: L583-L584 question LSTM; L584-L585 softmax/loss/Adam/`2e-4`; both depend on C-189. |
| C-193 | yes, criterion 3 | `edit` | The target representation is valid. Frozen `102 length vectors` is degraded extraction; the exact PDF shows `10² length vectors`. | Retain the frozen quote, flag `102`/`10²`, and do not silently normalize during this review. |
| C-194 | yes, criterion 3 | `calibration-accept` | It records the counting target as a length-10 one-hot vector over connected-system count. | none |
| C-195 | yes, criterion 4 | `edit` | The explicit-supervision explanation is valid, but `the first task` must resolve to C-193's connection-inference target. | Retain the quote and record a dependency on C-193. |
| C-196 | yes, criterion 4 | `edit` | The implicit-inference explanation is valid, but `the second task` and its count signal must resolve to C-194, in contrast to C-195. | Retain the quote and record dependencies on C-194 and C-195. |
| C-197 | yes, criterion 3 | `calibration-accept` | It defines the dynamic state-description rows, object features, and 16-frame temporal extent. | none |
| C-198 | yes, criterion 3 | `calibration-accept` | It gives the exact 33-float decomposition across x, y, time frames, and color. | none |
| C-199 | yes, criterion 4 | `calibration-accept` | It links row-as-object treatment to inference over properties evolving through time; preserve the source's awkward grammar. | none |
| C-200 | yes, criterion 3 | `calibration-accept` | It anchors the connection-inference RN and exact `gθ` layer dimensions. | Anchor for C-201 through C-204. |
| C-201 | yes, criterion 3 | `edit` | The `fφ` dimensions and connection-logit meaning are valid, but their task/model scope is C-200. | Retain the quote and record a dependency on C-200. |
| C-202 | yes, criterion 3 | `edit` | The loss, optimizer, rate, and batch size are valid, but `The output` must resolve to C-200/C-201. | Retain the quote and record dependencies on C-200 and C-201. |
| C-203 | yes, criterion 3 | `edit` | The counting-task modification is valid, but `The same model` must resolve to C-200 through C-202. | Retain the quote and record dependencies on C-200 through C-202. |
| C-204 | yes, criterion 3 | `edit` | The comparable-parameter MLP substitution is valid, but the baseline scope is the two dynamic tasks configured by C-200 through C-203. | Retain the quote and record dependencies on C-200 through C-203. |

Proposed disposition counts: `calibration-accept=7`, `edit=11`,
`too-broad=2`, `too-narrow=1`, and
`reject=duplicate=exclude=uncertain=0`.

## No-Candidate Recommendations

| review ID | proposed decision | exclusion reason | missing-packet decision |
|---|---|---|---|
| G-037 (`L579`) | no packet appropriate | `E bAbI model for language understanding` section heading (`document-administration`). | none |
| G-038 (`L586`) | no packet appropriate | `F Dynamic physical system reasoning` section heading (`document-administration`). | none |
| G-039 (`L611-L618`) | no standalone packet appropriate | `L611-L612` is a supplementary-video pointer/URL; `L613-L614` is page administration; `L615-L618` is the first set of Figure 4 axis/category/example labels. None independently asserts a result, and the caption at C-205/C-206 carries the figure claims. | Exclude the pointer and page material as document-administration and the remaining text as figure labels without an independent assertion. |

## Provisional Criteria Observations

No criteria change is proposed. The batch reinforces two existing provisional
issues: dependencies for divided configuration lists and visible preservation
of degraded mathematical notation.

## Human Gate

No handoff row has been changed. A human must explicitly adopt, revise, or
reject these recommendations. SRC-001 remains open, and SRC-002 must not begin.

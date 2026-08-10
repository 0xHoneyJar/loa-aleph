# SRC-001 Human Decision Event — Batch 07D

> NONCANONICAL HUMAN-SUPERVISED EXTRACTION-CALIBRATION RECORD

- recorded at: `2026-08-05T23:29:00+02:00`
- source: `SRC-001`
- authority: human
- adopted gaps: `none`
- adopted original candidates: `C-158` through `C-160`
- added split units: `S-158a`, `S-158b`, `S-158c`, `S-160a`, `S-160b`
- last fully accounted source line: `L508`
- next source line: `L509`
- next gap: `G-031`
- next candidate: `C-161`
- next candidate locator: `L510-L512`
- SRC-001 closed: `false`
- SRC-002 started: `false`
- earlier artifacts mutated: `false`

## Exact Human Decision Block

Adopt every decision in this block exactly as written

C-158 — L502-L504

Disposition: too-broad.

Reason: C-158 contains three independently adjudicable assertions: two parallel architectures showed impressive CLEVR results; both approaches hinge on compositionality principles; and both approaches have shown capability for some relational reasoning. Replace C-158 with S-158a, S-158b, and S-158c.

S-158a

Disposition: calibration-accept.

Criterion: 5.

Authorized exact evidence:
Parallel to our work, two architectures have shown impressive results on the CLEVR dataset
[14, 16].

Normalized wording: The source states that two architectures developed in parallel to the authors’ work have shown impressive results on CLEVR [14, 16].

Dependencies: none.

Citation treatment: preserve citations [14, 16].

Duplicate or overlap treatment: none.

Degradation flags: none.

Restrictions:
Preserve “Parallel to our work” as the authors’ source-relative framing.
Preserve “impressive” as an attributed qualitative characterization.
Do not infer numerical performance, statistical significance, state-of-the-art status, superiority to the RN, or equivalence between the two cited architectures.

S-158b

Disposition: calibration-accept.

Criterion: 2.

Authorized exact evidence:
Both approaches hinge on compositionality principles

Normalized wording: The source states that both comparator architectures hinge on compositionality principles.

Dependencies: S-158a, which identifies “Both approaches” as the two architectures cited in [14, 16].

Citation treatment: The comparator citations remain attached through the dependency on S-158a. Do not fabricate citations inside this exact fragment.

Evidence-overlap treatment: This fragment is also contained in S-158c’s full-sentence evidence. Record the overlap and do not count it twice.

Degradation flags: none.

Restrictions:
Preserve “hinge on.”
Do not weaken the proposition to merely “use.”
Do not infer the form of compositionality, the modules involved, or a causal relationship between compositionality and performance.

S-158c

Disposition: calibration-accept.

Criterion: 5.

Authorized exact evidence:
Both approaches hinge on compositionality principles, and have shown they are capable of
some relational reasoning.

Normalized wording: The source states that both comparator architectures have shown capability for some relational reasoning.

Dependencies: S-158a, which identifies the comparator architectures and their citations.

Citation treatment: Comparator citations [14, 16] remain linked through S-158a.

Evidence-overlap treatment: The compositionality clause overlaps S-158b, but S-158c retains only the demonstrated-capability proposition. The full sentence is retained because “Both approaches” supplies the grammatical subject and comparator scope. Do not treat the overlapping clause as independent evidence.

Degradation flags: none.

Restrictions:
Preserve “have shown” and “some.”
Do not broaden “some relational reasoning” into general relational-reasoning competence.
Do not infer performance metrics, task-general capability, mechanism, or superiority.

C-159 — L504-L505

Disposition: calibration-accept.

Criterion: 6.

Authorized exact evidence:
However, both require either designing modules, or require direct access to
ground-truth programs.

Normalized wording: The source states that both comparator architectures require either designed modules or direct access to ground-truth programs.

Dependencies:
S-158a, which resolves “both” as the two comparator architectures.
S-158c, which preserves the capability context against which “However” introduces the limitation.

Citation treatment: There are no citations inside C-159’s exact evidence. Comparator citations [14, 16] remain supplied through S-158a.

Duplicate or overlap treatment: none.

Degradation flags: none.

Restrictions:
Preserve the source’s grammatical form unchanged in exact evidence.
Preserve the alternatives: designing modules or direct access to ground-truth programs.
Do not infer that each architecture requires both.
Do not infer which cited architecture corresponds to which requirement.
Do not broaden the limitation to every compositional architecture or every CLEVR system.

C-160 — L505-L508

Disposition: too-broad.

Reason: C-160 combines an architecture and application-scope characterization of the RN with a separate empirical CLEVR comparison against the systems in [14] and [16]. Replace C-160 with S-160a and S-160b.

S-160a

Disposition: calibration-accept.

Criterion: 2.

Authorized exact evidence:
The RN module, on the other hand, is conceptually simpler, can readily be
combined with basic neural components such as CNNs or LSTMs, can be broadly applied to various
tasks

Normalized wording: In contrast to the two comparator approaches, the authors characterize the RN module as conceptually simpler, readily combinable with basic neural components such as CNNs or LSTMs, and broadly applicable to various tasks.

Dependencies:
S-158a, which identifies the comparator architectures.
C-159, which resolves the contrast expressed by “on the other hand.”

Citation treatment: none.

Overlap treatment: Record partial semantic overlap with C-146’s broad RN application scope and C-080’s CNN-or-LSTM-related RN input treatment. Preserve this distinct occurrence and its contrastive context, but do not count the repeated breadth or CNN/LSTM proposition as independent corroboration.

Fragment treatment: This is an exact clause fragment from the longer source sentence. Do not add punctuation at its endpoint.

Degradation flags: none.

Restrictions:
Preserve “conceptually simpler” as an attributed, unquantified comparison.
Preserve “readily,” “basic,” “such as,” “broadly,” and “various.”
Do not infer universal compatibility with CNNs or LSTMs.
Do not treat CNNs and LSTMs as an exhaustive list.
Do not infer demonstrated success across every task or domain.
Do not infer that conceptual simplicity caused the empirical results in S-160b.

S-160b

Disposition: calibration-accept.

Criterion: 5.

Authorized exact evidence:
achieves signiﬁcantly better results on CLEVR [ 15] than [14], and on par with strongly
supervised system of [16].

Normalized wording: The source reports that the RN module achieves significantly better results on CLEVR [15] than the system in [14] and performs on par with the strongly supervised system in [16].

Dependencies: S-160a, which supplies “The RN module” as the subject.

Citation treatment: preserve citations [15], [14], and [16].

Granularity treatment: Retain the two comparator clauses together because they form one CLEVR empirical comparison under a shared RN subject and dataset condition.

Fragment treatment: This is an exact predicate fragment from the longer source sentence. Do not add a subject or alter punctuation inside the exact evidence.

Degradation flags:
The frozen evidence contains “signiﬁcantly”; the exact PDF is readable as “significantly”.
The frozen evidence contains “[ 15]”; the exact PDF reads “[15]”.
Preserve the frozen exact evidence unchanged.

Restrictions:
Preserve “signiﬁcantly better” and “on par” as the source’s qualitative comparison language.
Do not interpret “signiﬁcantly” as a claim of statistical significance.
Do not infer numerical margins, metrics, confidence intervals, or identical evaluation procedures.
Preserve the “strongly supervised” qualifier for the system in [16].
Do not generalize either comparison beyond CLEVR.
Do not convert either comparison into universal architectural superiority or a causal claim.

No earlier event, checkpoint, proposal, receipt, correction record, or immutable input is modified by these decisions.

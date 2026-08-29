# Slice 4 Typed Relations — Implementation Reconciliation

> Date: 2026-08-29
>
> Implementation base: `c8b8022a664315ee7fc4d3c7d3c094dd7ecf8b5f`
>
> Adopted proposal blob: `51af0df8e3f44201a086169c5ce1fe02050ff8a9`
>
> Adopted proposal SHA-256:
> `c7604873a724627806b911a39153796e551b1c1e627f4000866f07ade1a2e1b9`

This is a structural implementation reconciliation, not an authority
acceptance record. `PASS` below means only the cited deterministic or retained
contract evidence. It does not mean replay validation, semantic validation,
agent sanction, acceptance, production readiness, golden status, or Aleph v1.

| DoD | File(s) | Test/proof | Status |
|-----|---------|------------|--------|
| DoD-01 | adopted proposal and `ADOPTED-slice-4-typed-relations-design-20260828.md` | exact blob/SHA-256 and adoption blob verified before editing | SATISFIED |
| DoD-02 | `run-model.ts`, artifact/checker docs, manifests | exact capability-set assertions for 1.0–1.4 plus 1.4 fixture K2.13–K2.16 | SATISFIED |
| DoD-03 | `checks-k2-relations.ts`, manual/orchestrator contracts | missing/empty/present and retained pre-closure mutations; temporal guard tests | SATISFIED (static/process-contract split) |
| DoD-04 | `relations.ts`, `checks-k2-relations.ts`, T3.3b | baseline fixture plus schema/state/taxonomy/owner-stage mutations | SATISFIED (focused) |
| DoD-05 | relation checker and typed-relations fixture | positive `md-lines`; malformed/wrong-scheme/hash and asserted `chat-msg` failures | SATISFIED (focused) |
| DoD-06 | relation checker + Slice 3 lineage helpers | non-current source/target and historical predecessor mutations | SATISFIED (focused) |
| DoD-07 | fixture REL-1407/VER-1407 | explicit `CC-0421` successor; `CC-0420` mutation rejected | SATISFIED (focused) |
| DoD-08 | relation state/conflict checks; semantic review cases | subtype/family/taxonomy null positives and conflict mutations; review-only not-applicable row | SATISFIED (focused) |
| DoD-09 | digest helper, verifier records, K2.16 | independent exact compact-JSON/digest vector plus recomputation, packet-order, changed-field, target/verdict mutations | SATISFIED (focused) |
| DoD-10 | producer prompts and L3R lens | S2/S3/S4 context contracts plus retained ten-case semantic challenge set | SATISFIED as implementation contract; NOT semantically validated |
| DoD-11 | orchestrator prompt, manual runbook, write-window guard | pre/at/post barrier tests preserve bytes; no independence/timing claim | SATISFIED as implementation/process contract; F-03 preserved |
| DoD-12 | K2.16 checker/spec | targeted mutation diagnostics and non-claiming PASS text | SATISFIED (focused) |
| DoD-13 | focused fixture | all eight types, legal mixed cycle, distinct indeterminate scopes, and relation multiplicity/evidence-role separation pass | SATISFIED (focused) |
| DoD-14 | `test-relation-mutations.ts` | 49 deterministic mutations, exact digest vector, and three temporal cases; 56/56 focused checks pass | SATISFIED (focused) |
| DoD-15 | `verification/semantic-review-cases.md` | ten required structurally legal semantic failures retained outside K2 | SATISFIED as contract evidence; NOT semantically validated |
| DoD-16 | unchanged historical fixtures; capability registry | 117/117 conformance mutations with 11/11 clean baselines; 34/34 lineage mutations; explicit 1.3 incompatible-activation failure | SATISFIED |
| DoD-17 | canonical TS + generated `runtime-js` | TypeScript gate PASS; runtime projection/test PASS for 34 files and 6/6 runtime cases | SATISFIED |
| DoD-18 | Core manifest/bundle machinery | CB1–CB9 PASS; Core-boundary mutation battery PASS; 30-case bundle battery PASS; 23/23 release-package battery PASS | SATISFIED |
| DoD-19 | adapter manifests/schema and pin tests only | no live writer/orchestrator source integration; F-03/F-04/F-05 retained | SATISFIED within authorized host-mechanical pin scope |
| DoD-20 | required docs/templates/prompts/checker/fixture/runtime/manifest surfaces | changed-file reconciliation plus clean 479-path Core-boundary inventory | SATISFIED |
| DoD-21 | this reconciliation and implementation self-audit | no independent implementation auditor has issued a verdict | OPEN — independent audit required; no acceptance claim |

## Recorded verification

The complete repository-defined `npm test` chain passed on the candidate
implementation, including:

- TypeScript typecheck;
- generated runtime parity and 6/6 runtime tests;
- CB1–CB9;
- 12/12 worker-return contract tests;
- 24/24 Loa host tests, the complete Loa adapter battery, and the complete
  offline installer battery, with no real model calls;
- all nine discovered fixture directories, including unchanged historical
  1.0–1.3 behavior and the focused 1.4 fixture;
- 117/117 K1–K6 conformance mutations with 11/11 clean baselines;
- 34/34 lineage mutations;
- 56/56 focused relation checks, including 49 deterministic negative
  mutations and three temporal write-window cases;
- the Core-boundary mutation battery;
- the 30-case bundle assembly/mutation battery; and
- 23/23 release-package cases.

`git diff --check` also passes. These are structural results only.

## Implementation self-audit

| Classification | Finding | Disposition |
|----------------|---------|-------------|
| BLOCKING NOW | none found by implementation self-audit | independent audit still required by DoD-21 |
| MUST PRESERVE | F-03 live LedgerWriter/orchestrator wiring remains unvalidated end to end | no adapter writer integration or agent-mode claim added |
| MUST PRESERVE | F-04 path/case portability remains unresolved | lowercase canonical path added; no portability-closure claim |
| MUST PRESERVE | F-05 post-S4 lineage BLOCK remains tied to F-03 | relation guard is Core process/test evidence and does not overwrite an unrelated halt |
| MUST PRESERVE | relations remain non-evidentiary and manual mode remains the sole sanctioned path | enforced in checker contracts, prompts, fixture accounting, and status language |
| LATER | A4-14 source-locus self-reference precision | not reopened |
| LATER | A4-15 additional multi-token/superstring VER-target mutation | exact one-subject equality implemented; additional mutation not added |
| LATER | A4-16 additional producer payload-charset pinning | adopted `human:`/`invocation:` grammar implemented without extra architecture |
| LATER | A4-17 editorial conflict/cycle wording precision | adopted conflict/cycle semantics implemented; wording issue not reopened |
| SPECULATIVE | none retained | no speculative architecture added |

### Required attack coverage

| Attack | Result |
|--------|--------|
| 1.3 capability regression after the 1.4 bump | exact capability-set assertions and unchanged 1.3 fixture/mutation batteries pass |
| Relation support leakage | exact 17-column schema, forbidden support/evidence field mutation, prompt boundaries, and unchanged evidence-role accounting pass |
| Historical predecessor acceptance | non-current source, non-current target, and explicit predecessor mutations fail K2.16 |
| Automatic successor substitution | no retargeting code exists; the fixture names `CC-0421` and replacing it with `CC-0420` fails |
| `md-lines` treated as universal | the checker derives the manifest scheme; `chat-msg` fails as declared but not deterministically reopenable |
| `chat-msg` falsely treated as verified | asserted `chat-msg` locus mutation fails closed |
| Digest field omission or serialization nondeterminism | exact compact-JSON byte vector, known digest vector, recomputation, and packet-order mutation pass |
| Partial `VER` target matching | full target equality is required; different-digest mutation fails |
| `refuted` or `cannot-determine` accepted | both verdict mutations fail |
| S2/S3 blind-context expansion | prompt bundles remain one-source/one-batch; K2 rejects S2 claim ownership and cross-source S2 asserted targets |
| Family/type mismatch | closed compatibility mutation fails |
| Typed-null scope collapse | subtype-, family-, and taxonomy-scope positive/negative cases remain distinct |
| Accidental global acyclicity | the legal mixed formal-reference/configuration cycle passes |
| Prohibited cycle missed | semantic-prerequisite, antecedent, formal-reference, continuation, and parallel/contrast cycle mutations each fail |
| K2 semantic claims | K2.16 PASS text is limited to retained-state structure/current-endpoint closure; semantic challenge cases remain outside K2 |
| K2 append-timing claim | static presence/emptiness checks remain separate from the three process write-window tests |
| Relation-specific human gate | no authority field or gate exists; `human:` is producer identity only |
| Adapter-local semantics | no live writer/orchestrator adapter source path changed; only manifests/schema and pin tests follow the Core run-format identity |
| Generic correction semantics | no relation replacement, supersession, stale, invalidated, rewind, or propagation mechanism was added |
| Historical fixture migration | no historical fixture was edited; 1.0–1.3 batteries pass unchanged |

## Status boundary

The candidate may be described, after the full structural battery is green,
as `STRUCTURALLY IMPLEMENTED` and `CHECKER-CLEAN`. DoD-21 remains open until a
fresh independent implementation audit reports no `BLOCKING NOW` finding.

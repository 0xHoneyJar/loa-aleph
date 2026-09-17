# F-03 implementation stop — degraded candidate / L2S binding

Status: **IMPLEMENTATION_STOPPED_CORE_CONTRACT_CONFLICT**

This is producer-authored repository-administration evidence and a partial
implementation checkpoint. It is not an implementation-complete candidate,
independent audit, design amendment, release, native execution, live run,
acceptance, sanction, or finding closure.

F-03: **OPEN / MUST PRESERVE**. F-04: **OPEN / MUST PRESERVE**.
F-05: **OPEN / MUST PRESERVE**, bounded by F-03.

## Authority and identity

- Repository: `0xHoneyJar/loa-aleph`.
- Verified starting canonical main:
  `8236b9f35c38cdd604b2389b42589f27755cdade`.
- Starting main tree: `72075f93bc9fcb3c76f4480bc612693211efd240`.
- Adopted design / implementation base:
  `484fa227e1ed23c81dc4cf37987aa0be16eded8f`.
- Design tree: `13ad9e53a77949718afa9dc59c25c2e9d52beacb`.
- Exact adoption and implementation authority were committed before code:
  `4a999689a21b08f4d7c333e3b28362d47476d02f`,
  tree `755ab653bf7ef8e2d4186f937f52a098722cc6a8`.
- Isolated branch:
  `agent/f03-production-reachability-implementation-20260917`.
- Isolated worktree:
  `/tmp/loa-aleph-f03-implementation-20260917`.
- The primary checkout, paused preparation branch, local adapter branch,
  stash and other worktree registrations are preservation subjects, not
  implementation inputs.

Authority records:

- [Human adoption](ADOPTED-f03-production-reachability-design-20260917.md)
- [Exact implementation authority](AUTHORIZED-f03-production-reachability-implementation-20260917.md)

The controlling implementation instruction says:

> If implementation reveals a conflict with the adopted design, requires a semantic/Core policy decision not already adopted, requires weakening any trust boundary, or requires expanding beyond the adopted S0–S4 frontier, implementation must stop and surface the exact conflict rather than improvise a replacement design.

Implementation stopped when the discriminator below confirmed the conflict.
Subsequent activity is limited to retaining this evidence, checking and
regenerating the existing checkpoint, and the authorized commit/push.
No degraded-candidate repair or replacement binding was implemented.

## C-01 — accepted degraded packet selector has no legal retained SEM binding

The existing Core requirements conflict at the producer-to-subject edge.
This is independent of the new controller's unfinished stage handlers.

| Existing authority / executable surface | Exact requirement or behavior |
| --- | --- |
| `docs/architecture/templates/03-extraction-claims.md`, T3.7 §7, lines 790–837 at the adopted base | Every item in each applicable return array, **including degraded candidates**, needs exactly one semantic entry. `packet-candidate:<index>` selects `packets[index]`; `material-candidate:<index>` selects `material_findings[index]`. A degraded/material candidate preserves existing OBJ/USE limitations and gets no fictitious PKT/CC. |
| `scripts/lib/semantic-review.ts`, `validateSemanticReturn`, lines 2514–2536 | A degraded `packets[index]` remains a `packet-candidate` selector. Its semantic grammar is validated as `material-only` with `atomicity=CANNOT_DETERMINE`. This return is admitted by the Core return validator. |
| Same file, `SemanticOutput` / `subjectOutput`, lines 119–123 and 517–536 | The retained variants are `packet-group`, `claim`, `no-claim`, and `material-only`. A packet group requires nonempty PKT IDs. A material-only binding contains exactly one existing `object_id`. |
| Same file, `validateProducerSelection`, lines 1300–1325 | A packet group must select an **exact** packet candidate. A material-only subject is accepted only when the original selector is **material-candidate** and its selected return contains the matching `object_id`. A degraded packet selector cannot satisfy either branch. |
| Same file, `validateSemanticRun` / `assertCandidateCoverage`, lines 1497–1531 | Every emitted selector must acquire a completed L2S review before stage closure. A separate material-finding selector does not discharge a packet-candidate selector. |
| Adopted F-03 proposal §11, §13 and F03-T20 | Reuse the Core predicates; mechanically account for degraded S2 work; preserve every output selector; do not rewrite the existing semantic rules or invent policy. |

The relevant semantic library and T3.7 template are **unchanged from the
adopted base** in this checkpoint:

- `scripts/lib/semantic-review.ts` blob:
  `d597ee65ce83f49fc26e15bffb2d2868120d229c`.
- `docs/architecture/templates/03-extraction-claims.md` blob:
  `1165971b8568314d9f175b88036f53f7c8cdf6d1`.

The first contradiction is executable, not merely an omitted adapter call:
the same retained material-only subject that passes for an actual
material-finding selector fails when rebound to a valid degraded packet
selector. Both cumulative 1.8 and proposed 1.9 exhibit it.

There is also an identity choice the mechanical serializer cannot invent.
The degraded packet shape contains a source locator and `material_use`;
it has no singular semantic-subject `object_id`. Valid material declarations
can name multiple existing objects. Selecting the first object, manufacturing
a material-finding output, changing the original selector, or silently
discarding the degraded selector would add a rule not adopted here.

Retaining the accepted bytes in quarantine and stopping is safe, but is not
implementation of the adopted degraded-candidate accounting and L2S path.
Calling that permanent halt a completed S0–S4 implementation would conceal
the missing contract.

## Reproduction and scope of evidence

Run from the implementation checkout:

```bash
node adapters/loa/tests/test-f03-degraded-binding-conflict.ts
```

The test constructs disposable **synthetic Core fixtures**. It first verifies
a working material-finding subject, then constructs a degraded packet return
using the same indeterminate semantics/material declaration. It invokes
`validateSemanticReturn` with a supplied synthetic source-window context,
retains that selector and attempts normal retained-subject validation.
It also checks that a degraded declaration with two existing object
requirements is accepted by the return validator.

Results in both `1.8.0-provisional` and `1.9.0-provisional`:

- Baseline material-finding subject: passes `validateSemanticRun`.
- Degraded packet return: `PASS`, `binding=checked`.
- Multiple-object degraded packet return: `PASS`.
- Retained degraded-selector/material-only subject:
  `SEM_SUBJECT material candidate: existing selected OBJ required`.

`binding=checked` is the Core function's result for the supplied fixture
context. It is **not** native transport authentication, a real dispatch,
production reachability, semantic validation or live evidence.

The exact output is retained in
[f03-degraded-candidate-binding-conflict-20260917.json](f03-degraded-candidate-binding-conflict-20260917.json).
The test deliberately expects the conflict; a passing discriminator means
the incompatibility was reproduced, not repaired.

## Required decision

Specify the Core retained-subject binding for an original
`packet-candidate:<index>` whose evidence state is `degraded-non-exact`,
including a declaration naming multiple OBJ requirements.

The decision must settle whether the original degraded selector has a
dedicated binding preserving its source/locus and complete declared material
basis, or requires an explicit producer-supplied OBJ mapping under a revised
return contract. It must preserve the original accepted selector, exact raw
bytes, every candidate's L2S accounting, and the prohibition on fictitious
PKT/CC authority. Neither alternative is adopted or implemented by this record.

After that decision, reconcile the return validator, retained-subject
validator, Core template, cumulative 1.9 capability behavior and negative
tests under the chosen rule. Keep old runs on their original pinned bytes.
The producer has not assumed permission to make that decision.

## Partial checkpoint retained before the stop

| Surface | Checkpoint state |
| --- | --- |
| Authority | Literal adoption/implementation authority persisted before code. |
| Version capability | Cumulative `orchestrator-work-transitions` entry added for 1.9. **Default/current format and package manifests remain 1.8.** There is no production activation claim for 1.9. |
| Core work selection / derivation | Draft S0 entry, S1 sample preparation, intake finalization, independent criteria-review records, and S2 entry serialization. S2–S4 semantic work handlers remain unimplemented. |
| Criteria contract | Added 1.9 criteria-review charter, role mapping, sample-locus validation and matching determinate review predicate. |
| Durable adapter controller | Draft immutable work/basis/dispatch/acceptance/commit/consumption records, retained-evidence revalidation and resume routing. This has not passed the adopted complete authentication/replay/recovery matrix. |
| Worker transport | Read-only native-evidence reopening; draft new-format prepare reuse, dispatch intent/completion, accepted evidence reopening and immutable derivative publication. No provider/model execution performed. |
| Writer | Draft local work transaction reproduces Core plan, before/after state and chain from retained basis. Existing semantic/material/duplicate families are not yet integrated with the new controller. |
| Runtime routing | Draft installed-launcher selection of original run-local CLI, plus predecessor profile handling. Complete installation/compatibility validation remains outstanding. |
| Generated runtime | Regenerated from the checkpoint source; no authored JavaScript added. |
| Product-surface fixture test | Added CLI S0/S1 sequence, separate fixture transport/accept processes, restart before canonical commit, two criteria reviews and S2 entry. It stops at the unfinished S2 frontier. |

Known unfinished implementation obligations include:

1. All S2 packet/walk/gap/SEM/material accounting, S3 normalization and review,
   S4 duplicate/relation/ambiguity/human-gate composition and stage seals.
2. Stage-specific authenticated historical dependencies and finite candidate
   consumption, complete closed-schema checking, and every required work
   tuple/contract binding.
3. New-format bypass refusal on all legacy writer/validation ingress, shared
   locking for every mutating control, durable unknown-dispatch/error halts,
   partial assembly recovery, complete consumption/chain reconciliation and
   prospective family validation.
4. Full installed skill/command integration and exact run-local transport
   routing. The supported-CLI fixture test does not yet prove the complete
   installed `/loa-aleph` path.
5. Adopted fault injection, adversarial replay/mutation and exactly-once
   batteries; complete compatibility, packaging, installation and F-05
   coverage. No full implementation DoD is asserted.

The partial implementation must not be used as a 1.9 release or represented
as a completed repair. The unfinished obligations above are separate from
C-01 and remain required even after C-01 receives a decision.

## Checks and exclusions

The checkpoint verification results are recorded below after the final
read-only/fixture checks. Earlier development runs included:

- Typechecking passes.
- Existing worker-contract suite and fixture adapter battery passed before
  the later S1/controller/routing edits; those earlier results do not qualify
  the final checkpoint.
- The first new CLI fixture run completed its S0/S1 assertions, then exited
  unsuccessfully during cleanup of a read-only disposable bundle. Cleanup was
  corrected before this contract conflict was confirmed.
- Sandbox child-process `EPERM` failures were rerun in the permitted fixture
  context; they are not provider calls or implementation validation.

Provider/model calls, genuine native workers, real-corpus `/loa-aleph`,
SRC-001 preparation/replay, closed-reference access/comparison, release
preparation, ingestion into Loa, PR creation, merge, sanction, intent-fidelity
work, and F-03/F-04/F-05 closure were not performed.

Final checkpoint verification:

| Command / check | Result and limit |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run runtime:build` | PASS, 44 generated files; projection of the stopped source only |
| `npm run runtime:check` | PASS, 44 files |
| `node scripts/validate-core-boundary.ts --json` | PASS, CB1–CB10; 892 classified files (602 Core, 56 Loa, 1 Hermes, 8 packaging, 225 administration) |
| `node scripts/test-worker-return-contract.ts` | **FAIL: 13/14.** The discovery assertion expects 24 output contracts and finds 25 after the S1 criteria charter addition. The other 13 checks pass. This assertion remains unfinished at the implementation stop. |
| `node adapters/loa/tests/test-loa-adapter.ts` | PASS, 34 existing fixture cases; explicit fixture-simulated/no-model-call evidence |
| `node adapters/loa/tests/test-orchestration-process.ts` | PASS, including cleanup; source CLI S0/S1 and separate fixture transport/accept processes through S2 entry only |
| `node adapters/loa/tests/test-f03-degraded-binding-conflict.ts` | PASS reproducing C-01 in both versions; not a repair pass |
| `git diff --check` | PASS |
| Relevant Core library/template versus adopted base | Byte-identical |
| Primary checkout preservation | HEAD/tree/branch/status/index unchanged; all preexisting refs and worktree records unchanged |
| Remote identity recheck | Main remains `8236b9f35c38cdd604b2389b42589f27755cdade`; design branch remains `484fa227e1ed23c81dc4cf37987aa0be16eded8f` |

The stopped Core payload digest from the boundary checker is
`sha256:5cc54ba5e282d5b776a9e848126b0acc8212a02021da001ebe95306fdf54d6a0`;
the checker digest is
`sha256:7d5dac567ce277b117e71f9ebb6301d1a1b3c5ae3d14391ef74958c983f7b88b`.
These are payload identities, not Git trees or evidence of semantic validity.

The full implementation test matrix, complete install/release/compatibility
batteries, independent audit and all native/live evidence remain **NOT RUN**
for this stopped checkpoint. No overall green implementation verdict is made.

## Exact changed-file inventory

There are 33 changed paths from the adopted design base, including the prior
authority commit. Generated files below were produced by the compiler.

```text
adapters/loa/adapter.manifest.json
adapters/loa/profiles/loa-default.json
adapters/loa/src/cli.ts
adapters/loa/src/launcher.ts
adapters/loa/src/ledger-writer.ts
adapters/loa/src/orchestration.ts
adapters/loa/src/runtime-snapshot.ts
adapters/loa/src/types.ts
adapters/loa/src/worker-bundle.ts
adapters/loa/src/worker-dispatch.ts
adapters/loa/src/worker-return.ts
adapters/loa/tests/test-f03-degraded-binding-conflict.ts
adapters/loa/tests/test-orchestration-process.ts
calibration/src-001/core-design-basis/ADOPTED-f03-production-reachability-design-20260917.md
calibration/src-001/core-design-basis/AUTHORIZED-f03-production-reachability-implementation-20260917.md
calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-core-contract-conflict-20260917.md
calibration/src-001/core-design-basis/f03-degraded-candidate-binding-conflict-20260917.json
core.manifest.json
docs/architecture/prompts/workers-intake-extraction.md
runtime-js/adapters/loa/src/cli.js
runtime-js/adapters/loa/src/launcher.js
runtime-js/adapters/loa/src/ledger-writer.js
runtime-js/adapters/loa/src/orchestration.js
runtime-js/adapters/loa/src/runtime-snapshot.js
runtime-js/adapters/loa/src/types.js
runtime-js/adapters/loa/src/worker-bundle.js
runtime-js/adapters/loa/src/worker-dispatch.js
runtime-js/adapters/loa/src/worker-return.js
runtime-js/scripts/lib/run-model.js
runtime-js/scripts/lib/work-transitions.js
scripts/compatibility-fixture-source.ts
scripts/lib/run-model.ts
scripts/lib/work-transitions.ts
```

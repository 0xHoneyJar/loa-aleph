# F-03 degraded-packet L2S binding clarification

Date: 2026-09-17

Status: ADOPTED — HUMAN CORE CONTRACT CLARIFICATION / IMPLEMENTATION CONTINUATION AUTHORITY

Classification: `repository_administration`

## Exact subject and chronology

- Repository: `0xHoneyJar/loa-aleph`
- Continuation branch: `agent/f03-production-reachability-implementation-20260917`
- Adopted design commit: `484fa227e1ed23c81dc4cf37987aa0be16eded8f`
- Adopted design tree: `13ad9e53a77949718afa9dc59c25c2e9d52beacb`
- Original implementation-authority commit: `4a999689a21b08f4d7c333e3b28362d47476d02f`
- Original implementation-authority tree: `755ab653bf7ef8e2d4186f937f52a098722cc6a8`
- Original authority record: `AUTHORIZED-f03-production-reachability-implementation-20260917.md`
- Original authority record blob: `df61a2f4f240bc812ebbc1a1e6196da7d92345b9`
- Stopped implementation HEAD: `5e17212cedbb47fa1cc27a0f5f11d941f9d7850e`
- Stopped implementation tree: `5f2097b28f0143bc962fd1fa3740add5d5e1e785`
- Conflict identifier: `C-01`
- Stopped record: `STOPPED-f03-production-reachability-implementation-core-contract-conflict-20260917.md`
- Stopped-record blob: `893bcc16f1dde9793b7a367ad4d4c5cba96930bb`
- Stopped-record SHA-256: `4f052dc4648fc963bd62b129cad47a19c25f2a2e7c1bb531dc65df31f27d562a`
- Canonical main verified unchanged: `8236b9f35c38cdd604b2389b42589f27755cdade`
- Canonical main tree: `72075f93bc9fcb3c76f4480bc612693211efd240`

The chronology remains: adopted design; implementation authorization;
partial implementation; discovery of C-01; implementation stop; this HUMAN
clarification; implementation continuation under this clarification.
The stopped record and its reproduction evidence remain historical and
unchanged. This record does not imply that the clarified rule existed at
the stopped checkpoint or that that checkpoint was implementation-complete.

Before this record was created, the clean isolated implementation worktree,
branch, HEAD/tree, parent authority, remote implementation branch, canonical
remote main, exact design and authority records, and stopped-record identity
were verified. The primary SRC-001 preparation checkout, adapter branch,
stash, and all existing worktree registrations were preserved. No
implementation files change in this record's separate administration commit.

## Human declaration — verbatim

```text
I clarify the adopted F-03 accepted-worker-return production-reachability design for cumulative run format 1.9.0-provisional and capability orchestrator-work-transitions as follows.
An original `packet-candidate:<index>` whose selected extractor packet has `evidence_state = degraded-non-exact` retains its identity as that packet-candidate and MUST receive exactly one L2S semantic subject for that original selector. It MUST NOT be rebound as a `material-candidate`, collapsed into the existing singular `material-only` output binding, mapped to only the first declared OBJ requirement, expanded into synthetic material candidates, silently discarded, or given a fictitious PKT or CC.
For such a selector, Core shall provide a dedicated retained degraded-packet semantic output binding. That binding must preserve the original packet-candidate selector and mechanically bind the selected producer return's source identity, degraded source locator, degradation reason, criterion, and complete declared `material_use`. The complete ordered `material_use.requirements` array is the material basis of the degraded candidate, including when it contains more than one existing OBJ requirement. No singular OBJ is elevated to represent the candidate as a whole.
The corresponding L2S subject preserves the existing degraded-candidate semantics: `atomicity = CANNOT_DETERMINE`, no fictitious exact packet evidence, no PKT or CC authority, and the complete existing OBJ/USE limitations and material context. L2S may challenge whether the degraded state, source/locus, material requirements, limitations, and indeterminacy were preserved correctly, but neither Core nor the reviewer may infer exact source bytes or affirmative semantic content that the degraded evidence does not establish.
The existing `material-only` semantic output binding remains reserved for an actual `material-candidate:<index>` and retains its existing singular `object_id` semantics. This clarification does not alter that contract.
Implementation shall reconcile the 1.9 Core template, semantic output types and retained-subject validator, producer-selection validation, candidate-coverage accounting, work-transition derivation, fixtures, negative tests, generated runtime, and affected manifests consistently with this rule. The original accepted raw producer bytes and selector identity remain immutable.
This clarification is additive for new 1.9.0-provisional runs using orchestrator-work-transitions. It does not migrate, reinterpret, or change retained 1.7/1.8 runs or their pinned Core bytes.
I authorize the existing F-03 implementation branch at stopped checkpoint 5e17212cedbb47fa1cc27a0f5f11d941f9d7850e to persist this clarification and resume the previously authorized implementation solely under the adopted F-03 design as clarified here.
This clarification does not authorize provider or model calls, genuine native worker execution, live-corpus `/loa-aleph` execution, SRC-001 replay or preparation work, release preparation, Loa ingestion, PR creation, merge, agent-mode sanction, or F-03/F-04/F-05 closure. F-03 remains OPEN / MUST PRESERVE. F-04 remains OPEN / MUST PRESERVE. F-05 remains OPEN / MUST PRESERVE and bounded by F-03. If another unadopted semantic/Core policy conflict is encountered, implementation must stop again rather than infer a rule.
```

The fenced text is the complete controlling declaration. Surrounding
metadata is producer-recorded identity and scope, not additional human
wording.

## Scope and carried states

Architecture B and the adopted S0–S4 frontier remain controlling. The
dedicated binding is additive only for cumulative `1.9.0-provisional`
with `orchestrator-work-transitions`; retained 1.7/1.8 semantics do not
migrate. Installed/default format remains 1.8. The producer must finish
the adopted implementation obligations or stop on another unadopted Core
policy conflict.

F-03: OPEN / MUST PRESERVE.

F-04: OPEN / MUST PRESERVE.

F-05: OPEN / MUST PRESERVE and bounded by F-03.

Provider/model calls, genuine native execution, live corpus execution,
SRC-001 preparation/replay, closed-reference access/comparison, release
preparation/distribution, Loa ingestion, PR creation, merge, sanction,
acceptance, finding closure, and v1 declaration remain excluded.
Fixture/simulated structural checks are permitted but do not establish
native evidence, semantic correctness, live acceptance, or independent audit.

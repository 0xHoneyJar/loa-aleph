# SRC-001 Batches 07–12 Pre-Close Audit

> NONCANONICAL HUMAN-SUPERVISED CALIBRATION EVIDENCE
>
> This report audits the integrity and serialization of Batches 07–12. It is not a Loa-Aleph run, semantic validation, sanction, independent acceptance, or v1 evidence.

- Audit timestamp: `20260806T2328+0200` (Europe/Zurich)
- Audit scope: proposals, human decision events, append-only corrections, cumulative ledgers, checkpoint ZIPs, post-build records, and exact-byte attestation receipts for Batches 07–12
- Mutation policy: no existing artifact was modified

## Verdict

**Batches 07–12 are correctly edited/added and internally coherent for download as a pre-close evidence package.**

They are **not ready to be represented as a final closed calibration package**. The transfer-manifest digest drift in the attested Batch 10–11 chain remains unresolved, and the mandated whole-source consistency pass and explicit human close decision have not occurred.

## Audit totals

- Mechanical and byte-integrity checks: **226 PASS, 0 FAIL, 1 WARN**
- Semantic-structural serialization checks: **1142 PASS, 0 FAIL, 0 WARN**
- Combined result: **1,368 PASS, 0 FAIL, 1 WARN**

The sole warning is `TRANSFER-MANIFEST-PIN-DRIFT-B10-B11`. No missing Batch 07–12 decision, split, replacement, gap disposition, formal-material unit, checkpoint, or attestation binding was found.

## Batch-by-batch result

| Batch | Source coverage | Original candidates | Gaps | Correct edits/additions and state transitions | Result |
|---:|---|---|---|---|---|
| 07 | `L469–L518` | `C-146–C-162` | `G-027–G-032` | S-147a/b; S-158a/b/c; S-160a/b; E-003 | **PASS** |
| 08 | `L519–L568` | `C-163–C-183` | `G-033–G-036` | S-167a/b; append-only B08A/B metadata corrections | **PASS** |
| 09 | `L569–L618` | `C-184–C-204` | `G-037–G-039` | S-190a/b; S-192a/b; append-only B09D boundary correction | **PASS** |
| 10 | `L619–L668` | `C-205–C-206` | `G-040–G-041` | Figure 4 review closed; Table 2 review opened | **PASS** |
| 11 | `L669–L688` | `none` | `G-042` | T2-000–T2-012; Table 2 review closed | **PASS** |
| 12 | `L689–L792` | `none` | `G-043` | No added units; source-order adjudication complete | **PASS** |

## What passed

1. **Proposal identity.** Every Batch 07–12 proposal matches its pinned filename, byte count, LF count, final-LF shape, SHA-256 digest, and declared source/candidate/gap coverage.
2. **Human decision preservation.** Every adopted block is present in the event Markdown and JSON. Batches 07–08 use a legacy one-terminal-LF serialization difference; the decision content is otherwise byte-identical and the recorded block digests pass.
3. **Exact inventory.** The segment contains exactly 61 original candidates (`C-146`–`C-206`), 17 gaps (`G-027`–`G-043`), and 27 admitted added/replacement units. Every expected item appears exactly once; no orphaned added unit was found.
4. **Splits and replacements.** Batch 07 additions, `S-167a/b`, `S-190a/b`, `S-192a/b`, and `T2-000`–`T2-012` are linked to their repaired, split, or superseded parents without silently deleting the parent disposition.
5. **Append-only corrections.** The B08A, B08B, and B09D metadata corrections preserve the original events and alter no semantic human decision.
6. **Formal material.** Figure 4 remains represented by its caption claims without inferred bar values. Table 2 is represented by one caption/role packet and twelve aligned question–RN–GT failure units, each retaining frozen source-group provenance and a separate PDF row/column locator.
7. **State transitions.** `B8-001` closes through C-184; Figure 4 review closes in Batch 10; Table 2 opens in Batch 10 and closes through `T2-000`–`T2-012` in Batch 11; G-043 completes source-order adjudication in Batch 12 without closing SRC-001.
8. **Checkpoint integrity.** All six checkpoint ZIPs open cleanly; all internal checksum manifests pass; all JSON files parse; embedded proposals/events/predecessors/receipts match their external bytes; and each post-build record reports a byte-identical deterministic rebuild.
9. **Attestation binding.** Each Batch 07–12 exact-byte attestation receipt binds to the observed checkpoint digest and its receipt sidecar passes.
10. **Continuation authority.** The Batch 07 continuation authority bundle passes its ZIP test and all 23 internal checksums.

## Checkpoint and attestation identities

| Batch | Checkpoint SHA-256 | Attestation gate |
|---:|---|---|
| 07 | `29f86a4837247759e45f9dbf961a46ec3d809888c8214674b19aac42069b22e4` | `CLOSED_BY_EXPLICIT_HUMAN_ATTESTATION` |
| 08 | `8e2653ecaaa703acbb8e70cfe04316c0e3041148ec00b2204ba5a544a24ab667` | `CLOSED_BY_EXPLICIT_HUMAN_ATTESTATION` |
| 09 | `b3c1b7db15acfed98df79086c190aadb527c9c9541d16b22690bc65bbabc8501` | `CLOSED_BY_EXPLICIT_HUMAN_ATTESTATION` |
| 10 | `0f15e53f851f6b79192841233a88baa81d95d53da7de9e891b859e5004bc04fc` | `CLOSED_BY_EXPLICIT_HUMAN_ATTESTATION` |
| 11 | `5511e439a37fba13329533d32bc09e908bfb4c5e01b73088e0d0b52f284fe5bb` | `CLOSED_BY_EXPLICIT_HUMAN_ATTESTATION` |
| 12 | `0f19d221c6c6b73ddc9a5b82fdfcf2e19eede8e3e092575eee6ea0fe2a8eae70` | `CLOSED_BY_EXPLICIT_HUMAN_ATTESTATION` |

Historical `PENDING` gate fields inside immutable checkpoint builds are build-time state, not a defect. Their external append-only receipts close the gates without rewriting the checkpoint.

## Unresolved findings and blockers

| Finding | Effect | Required treatment |
|---|---|---|
| `TRANSFER-MANIFEST-PIN-DRIFT-B10-B11` | **BLOCKS FINAL PACKAGING** | Batches 10–11 serialize transfer-manifest digest 5633fa28f809bb84e7c41e8e34a9348a6686d6f9e83d5e2161fe8d926526af0a, while Batches 7–9 and 12 retain pinned digest 5633fa28bbd51ad13d6b845172d47d99f7e733ebaff3a6d017c6b03231c619d2. Preserve existing checkpoints and close additively against exact transfer-manifest bytes. |
| `WHOLE-SOURCE-CONSISTENCY` | **REQUIRED BEFORE CLOSE** | This audit covers Batches 07–12 and their continuity. The mandated whole-source pass across Batches 01–12 is still separate work. |
| `SRC-001-EXPLICIT-CLOSE-DECISION` | **REQUIRED BEFORE CLOSE** | SRC-001 remains OPEN; SRC-002 remains NOT AUTHORIZED. |
| `PACKAGING-RISK` | **CARRY FORWARD** | Final calibration packaging must include the exact immutable transfer bundle and all additive corrections/receipts. |
| `C-186-SOURCE-INTERNAL-LSTM-REFERENT` | **SEMANTIC OPEN FINDING** | The source says “same CNN and LSTM,” but the exact LSTM antecedent is not supplied by the immediately preceding Sort-of-CLEVR configuration. |
| `AUDIT-B02-BYTES` | **CARRY FORWARD** | Earlier-batch finding outside the Batch 07–12 segment. |
| `NORM-19` | **CARRY FORWARD** | Earlier normalization finding outside the Batch 07–12 segment. |
| `MISSING-INTERNAL-AUDIT-JSON` | **CARRY FORWARD** | Known non-load-bearing missing audit JSON remains visible and must not be reconstructed. |

## Download readiness

- **Pre-close evidence download:** READY. The package accompanying this report contains the exact currently available Batch 07–12 evidence and a package-level checksum manifest.
- **Final closed calibration download:** NOT READY. Do not label this package final, accepted, validated, sanctioned, or v1.

Before a final package is built:

1. Close `TRANSFER-MANIFEST-PIN-DRIFT-B10-B11` additively against the exact transfer-manifest bytes; do not rewrite Batch 10 or Batch 11.
2. Run and record the whole-source consistency pass across all Batches 01–12.
3. Present all remaining findings and obtain a separate explicit human decision: `SRC-001 CLOSED FOR CALIBRATION` or `SRC-001 NOT CLOSED`.
4. Keep SRC-002 unauthorized unless SRC-001 is explicitly closed.

## Audit artifacts

- `SRC-001-batches-07-12-mechanical-audit-v2.json`: full mechanical check ledger
- `SRC-001-batches-07-12-semantic-structural-audit-v2.json`: full semantic-structural serialization check ledger
- `SRC-001-batches-07-12-preclose-audit-20260806T2328+0200.json`: concise machine-readable result
- The package `CHECKSUMS.sha256` verifies every included payload and metadata file except itself.

## Status boundary

- SRC-001: `OPEN`
- SRC-002: `NOT AUTHORIZED`
- Source-order adjudication: complete through `L792`
- Whole-source consistency: not yet performed
- Explicit close decision: not yet issued

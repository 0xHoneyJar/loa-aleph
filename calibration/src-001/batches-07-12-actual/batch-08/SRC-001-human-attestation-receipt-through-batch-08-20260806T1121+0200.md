# SRC-001 Human Exact-Byte Attestation Receipt — Through Batch 08

> NONCANONICAL HUMAN-SUPERVISED DEVELOPMENT-CALIBRATION RECORD
>
> This receipt records explicit human attestation only. It is not a live Aleph
> run, canonical ledger, accepted fixture, replay, validation, sanction,
> independent audit, acceptance, or v1 evidence.

- recorded at: `2026-08-06T11:21:00+02:00`
- source: `SRC-001`
- authority: human
- checkpoint through Batch 08 attestation: `CLOSED`
- SRC-001: `OPEN`
- SRC-002: `NOT AUTHORIZED`

## Exact Human Attestation

I attest the exact bytes of the SRC-001 checkpoint through Batch 08 with SHA-256 8e2653ecaaa703acbb8e70cfe04316c0e3041148ec00b2204ba5a544a24ab667. Preserve the checkpoint through Batch 07, its exact-byte attestation receipt, the exact Batch 08 proposal, all Batch 08 human decision events, both append-only Batch 08 event-metadata correction records, this checkpoint, and all immutable inputs unchanged.

## Exact Attestation Text Digest

- UTF-8 SHA-256: `6a59e51fd4568d01dca890ad62384813c8e1d7bb82c65a2d1b1254ab9bd5c162`

## Reverified Digests

- checkpoint through Batch 08 ZIP:
  `8e2653ecaaa703acbb8e70cfe04316c0e3041148ec00b2204ba5a544a24ab667` — PASS
- checkpoint through Batch 08 post-build structural verification:
  `ef12bee4e1f8dd8bcfe2ac89f6d56ef7cf6e018b5e64690d98df473bb6a8abdb` — PASS
- checkpoint through Batch 07 ZIP preserved unchanged:
  `29f86a4837247759e45f9dbf961a46ec3d809888c8214674b19aac42069b22e4` — PASS
- Batch 07 exact-byte attestation receipt:
  Markdown `96922b8a4f494b58239fcd37a43c4bb29f344228cb07c4a46889061e4456725c` and JSON `dec0bfe56547af5f86f51e78809239cfe176f4ab73e35334cdb269ae29a6a7f6` — PASS
- exact Batch 08 proposal:
  `420934551436cbf1956f88937b91deb80960355dd6a9ffd8c81a3434ce2b54c7` — PASS
- all four Batch 08 Markdown and JSON decision events:
  exact recorded hashes — PASS
- both append-only Batch 08 metadata-correction Markdown and JSON records:
  exact recorded hashes — PASS
- checkpoint internal archive verification:
  46 members, 45 checksum entries, zero duplicate names, all checksums passing — PASS
- embedded predecessor, proposal, and Batch 07 receipt byte identity:
  exact match — PASS

## Gate Effect

The external append-only receipt closes `CHECKPOINT-B08-ATTESTATION`. The
checkpoint's internal build-time record remains unchanged and therefore still
shows the gate as pending at construction time. That immutable historical state
is not rewritten.

## Remaining Open Findings

1. `AUDIT-B02-BYTES` — exact Batch 02 proposal bytes remain unavailable for the recorded audit check.
2. `NORM-19` — nineteen mechanical-only normalizations still require dedicated human review.
3. `WHOLE-SOURCE-CONSISTENCY` — deferred until all SRC-001 batches are adjudicated.
4. `PACKAGING-RISK` — retain the exact immutable transfer bundle alongside the checkpoint chain.
5. `MISSING-INTERNAL-AUDIT-JSON` — visible non-load-bearing absence; not reconstructed.
6. `TABLE-2-FORMAL-MATERIAL-REVIEW` — later adjudication remains required; no T2-* unit is adopted through Batch 08.
7. `B8-001` — C-182 and C-183 continue into C-184 at L569-L570 and remain open pending Batch 09 adjudication.

## Resume Boundary

- next source line: `L569`
- next original candidate: `C-184`
- next gap: `G-037`
- next proposal: `SRC-001-adjudication-batch-09-proposals.md`
- expected Batch 09 SHA-256:
  `15f7870a120aebacbbe696ec11553cf522feaee3f9e1f96014001949dd3f0754`
- expected size: `6,816 bytes`
- expected lines: `70`
- expected coverage: `L569-L618; C-184-C-204; G-037-G-039`

## Mutation Statement

This receipt is append-only. The checkpoint through Batch 08, the checkpoint
through Batch 07, the Batch 07 attestation receipt, all Batch 08 decision events,
both Batch 08 metadata-correction records, the proposal, and immutable inputs
remain unchanged.

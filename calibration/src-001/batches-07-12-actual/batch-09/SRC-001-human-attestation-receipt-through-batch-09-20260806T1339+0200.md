# SRC-001 Human Exact-Byte Attestation Receipt — Through Batch 09

> NONCANONICAL HUMAN-SUPERVISED DEVELOPMENT-CALIBRATION RECORD
>
> This receipt records explicit human attestation only. It is not a live Aleph
> run, canonical ledger, accepted fixture, replay, validation, sanction,
> independent audit, acceptance, or v1 evidence.

- recorded at: `2026-08-06T13:39:00+02:00`
- source: `SRC-001`
- authority: human
- checkpoint through Batch 09 attestation: `CLOSED`
- SRC-001: `OPEN`
- SRC-002: `NOT AUTHORIZED`

## Exact Human Attestation

I attest the exact bytes of the SRC-001 checkpoint through Batch 09 with SHA-256 b3c1b7db15acfed98df79086c190aadb527c9c9541d16b22690bc65bbabc8501. Preserve the checkpoint through Batch 08, its exact-byte attestation receipt, the exact Batch 09 proposal, all Batch 09 human decision events, the append-only Batch 09D event-metadata correction record, this checkpoint, and all immutable inputs unchanged.

## Exact Attestation Text Digest

- UTF-8 SHA-256: `1ee90c4bc85d7fe93cb1995eec2f6c9d8d763d4c81fbde75e3fedd83229ff38c`

## Reverified Digests

- checkpoint through Batch 09 ZIP:
  `b3c1b7db15acfed98df79086c190aadb527c9c9541d16b22690bc65bbabc8501` — PASS
- checkpoint through Batch 09 post-build structural verification:
  `f6d9b9eb69dc472982f8f84a42263b4574dfc1f990b5e3732b9bce1ee67345d5` — PASS
- checkpoint through Batch 08 ZIP preserved unchanged:
  `8e2653ecaaa703acbb8e70cfe04316c0e3041148ec00b2204ba5a544a24ab667` — PASS
- Batch 08 exact-byte attestation receipt:
  Markdown `bb55b2c0d4d74a8761f549422355f631ed067ef6ae9a5e401bc202cc32231037` and JSON `0bff3f736529efa9bc23360b9d8d4d9228b42ddd953b123520e1cd8643bc64a4` — PASS
- exact Batch 09 proposal:
  `15f7870a120aebacbbe696ec11553cf522feaee3f9e1f96014001949dd3f0754` — PASS
- all four Batch 09 Markdown, JSON, and checksum-sidecar decision-event records:
  exact recorded hashes — PASS
- append-only Batch 09D metadata-correction Markdown, JSON, and checksum-sidecar records:
  exact recorded hashes — PASS
- checkpoint internal archive verification:
  43 members, 42 checksum entries, zero duplicate names, all checksums passing — PASS
- embedded predecessor, proposal, Batch 08 receipt, Batch 09 events, and B09D correction byte identity:
  exact match — PASS
- deterministic checkpoint rebuild recorded by the post-build verifier:
  byte-identical — PASS

## Gate Effect

The external append-only receipt closes `CHECKPOINT-B09-ATTESTATION`. The
checkpoint's internal build-time record remains unchanged and therefore still
shows the gate as pending at construction time. That immutable historical state
is not rewritten.

## Remaining Open Findings

1. `AUDIT-B02-BYTES` — exact Batch 02 proposal bytes remain unavailable for the recorded audit check.
2. `NORM-19` — nineteen mechanical-only normalizations still require dedicated human review.
3. `WHOLE-SOURCE-CONSISTENCY` — deferred until all SRC-001 batches are adjudicated.
4. `PACKAGING-RISK` — retain the exact immutable transfer bundle alongside the checkpoint chain.
5. `MISSING-INTERNAL-AUDIT-JSON` — visible non-load-bearing absence; not reconstructed.
6. `TABLE-2-FORMAL-MATERIAL-REVIEW` — later adjudication remains required; no T2-* unit is adopted through Batch 09.
7. `FIGURE-4-FORMAL-MATERIAL-REVIEW` — G-040 and caption candidates C-205/C-206 remain pending in Batch 10.
8. `C-186-SOURCE-INTERNAL-LSTM-REFERENT` — the source's “same LSTM” referent remains visibly unresolved.

## Resume Boundary

- next source-order item: `G-040`
- next source-order locator: `L619-L656`
- next original candidate: `C-205`
- candidate locator: `L657-L659`
- next proposal: `SRC-001-adjudication-batch-10-proposals.md`
- expected Batch 10 SHA-256:
  `b7551e6d65f8a881f0fa6b0192ebae7b7df03fc188451195c4c75e4a46acd282`
- expected size: `3,325 bytes`
- expected lines: `61`
- expected coverage: `L619-L668; C-205-C-206; G-040-G-041`

## Mutation Statement

This receipt is append-only. The checkpoint through Batch 09, the checkpoint
through Batch 08, the Batch 08 attestation receipt, all Batch 09 decision events,
the Batch 09D metadata-correction record, the proposal, and immutable inputs
remain unchanged.

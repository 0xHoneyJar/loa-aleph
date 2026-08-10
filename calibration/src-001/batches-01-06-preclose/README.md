# SRC-001 Batches 01–06 Pre-Close Evidence

This directory preserves the currently available repository-facing evidence for SRC-001 Batches 01–06 and the internal audit/correction trail produced before Batch 07.

Status:
- Batch 01–06 human-adjudication chain: recorded through C-145 / G-026
- Batch 06 checkpoint exact-byte attestation: CLOSED
- Internal structural/authorization audit: 215/215 executable checks passed
- Exact-evidence audit corrections A-01/A-02/A-03: CLOSED append-only
- SRC-001: OPEN
- SRC-002: NOT AUTHORIZED
- Whole-source consistency: not yet performed
- Criteria change / golden-standard promotion: NOT AUTHORIZED

Start with `SRC-001-internal-audit-through-batch-06-20260805T1756+0200.md`, then read the append-only exact-evidence correction and corrective-action receipt. `CHECKSUMS.sha256` inventories the locally available Batch 01–06 package assembled for repository transfer.

## Binary-package boundary

The exact transfer package is 1,224,120 bytes with SHA-256:

`91fa83596426b9cf52843934db5562ac50cb869db4c86d040f5df67200bed964`

The binary ZIP itself is not committed by this connector. Its exact digest is retained in `SRC-001-batches-01-06-preclose-package-20260807T1138+0200.zip.sha256`; the post-build verification records 80 ZIP members and 79 internal checksum entries, all passing. `CHECKSUMS.sha256` preserves the member inventory.

One inventoried companion file, `SRC-001-internal-audit-through-batch-06-20260805T1756+0200.json`, is not locally available and was not reconstructed. Its previously recorded SHA-256 is `b9ade4687a7a39f64608c3553f969be4f1efe492027282f126cd45ad0476a9fa`. The exact audit Markdown and sidecar, human correction records, and corrective-action receipts remain preserved.

These files are noncanonical human-supervised development-calibration evidence. They do not establish a live Aleph run, semantic validation, sanction, acceptance, independent audit, golden status, accepted criteria, or v1.

# SRC-001 Closed Development-Calibration Reference

This directory retains the immutable, human-supervised, noncanonical SRC-001
closed development-calibration reference and the administration records needed
to reopen and verify its final state.

## Status

- SRC-001: `CLOSED_FOR_CALIBRATION`
- SRC-002: `NOT_AUTHORIZED`
- Whole-source development-calibration consistency: `1,670 / 1,670 PASS`
- Closed reference package:
  `f4c42e65d611395c9bacdb7ecf3ab7e4d01b1d21fd50c6c150b0cc6a8847a9f0`
- Independent package-integrity/internal-consistency verification: `PASS`

The independent verifier concluded:

> The immutable SRC-001 closed development-calibration reference package
> independently passed package-integrity and internal-consistency verification.

## Controlling Identities

- Package size: `5,539,645` bytes
- Package manifest:
  `3bc9e618b98faef9f1aa4ebbca02c5c8d9c29e955d853b5b6e497a3d17cf9dcf`
- Member checksum inventory:
  `5fa9cf85ae9856f8e38e4f28188ec4692495de85d94b9f0075ddbee1b4ab66ec`
- Package post-build verification:
  `d39867080f7ca3b33bfc84a04baff78dce2ebd6b27d8da7d72ebd79a4d677144`
- Whole-source rerun:
  `764c96bf8a7ba01ac49e5f6d6a7fc3cda9ad3b93dfb1155a32ad7765723561bd`
- Human calibration-close event:
  `9a724a20342a25a45831c149b32a69dc5b3a608bb930d0afd3c0772f20e7d5d6`
- Recovered B02-v1 checkpoint:
  `fe34d99836896ec19ce011bd27b40ec715801b427797f090887909dfef5feb57`
- Independent package-verification record:
  `81d881b077ce5fd8f78e13a570b965b816eb0093f369209206310786265f4cfd`

The package contains 211 members and 211 checksum entries. Its final
post-build record reports 210/210 source-artifact byte identities passing, and
the retained checkpoint chain verifies 12/12 archives.

## Known Absence

The following unavailable artifact remains visibly recorded and was not
reconstructed:

- `SRC-001-internal-audit-through-batch-06-20260805T1756+0200.json`
- Recorded SHA-256:
  `b9ade4687a7a39f64608c3553f969be4f1efe492027282f126cd45ad0476a9fa`
- Status: `VISIBLE_NON_LOAD_BEARING_KNOWN_ABSENCE`

No package-integrity claim depends on pretending those bytes exist.

## Boundary

This closed reference does **not** establish:

- a production Loa-Aleph run;
- semantic validation of Loa-Aleph;
- sanctioned agent execution;
- independent semantic audit of all human judgments;
- Précis acceptance;
- golden-standard promotion;
- accepted extraction criteria;
- production readiness;
- or v1.

Historical pre-close records elsewhere under `calibration/src-001/` remain
unchanged and continue to preserve the earlier open findings and intermediate
states as history. This directory adds the later additive closure, recovery,
whole-source, package, and independent-verification evidence.

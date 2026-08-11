# SRC-001 Append-Only Event Metadata Correction — Batch 08A

> NONCANONICAL INTERNAL SERIALIZATION-CORRECTION RECORD
>
> This record does not alter or reinterpret the exact human decision block.

- recorded at: `2026-08-06T00:14:00+02:00`
- source: `SRC-001`
- affected event: `SRC-001-human-decision-event-B08A-20260806T0013+0200.md` / `SRC-001-human-decision-event-B08A-20260806T0013+0200.json`
- affected Markdown SHA-256: `9bf80aa0ccc22662e51816a61c9d0ac57efe6bced9c237c0ea8968706858afb8`
- affected JSON SHA-256: `55f43af482351b2d61ef9f20992a83dbab98f5baf86f1415ca0a819bf5614d03`
- prior artifact mutated: `false`
- human decision text changed: `false`
- candidate disposition changed: `false`
- criterion changed: `false`
- exact evidence changed: `false`

## Correction

The generated B08A resume metadata incorrectly treated `L528` as fully accounted and recorded the next source line as `L529`, even though `C-169` begins on `L528` after the `C-168` sentence.

The corrected continuation boundary is:

- last original candidate adjudicated: `C-168`
- last gap adjudicated: `G-032`
- last fully accounted source line: `L527`
- next source line: `L528`
- next candidate: `C-169`
- next candidate locator: `L528-L530`
- next gap: `G-033`
- current batch: `Batch 08`

The original B08A event remains unchanged. Its exact human decision block remains authoritative for the adopted noncanonical calibration decisions. This correction applies only to generated resume metadata.

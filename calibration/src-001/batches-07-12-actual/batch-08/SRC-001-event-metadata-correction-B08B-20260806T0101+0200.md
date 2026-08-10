# SRC-001 Event Metadata Correction — Batch 08B

> APPEND-ONLY NONCANONICAL CALIBRATION RECORD

- recorded at: `2026-08-06T01:01:00+02:00`
- corrected event: `SRC-001-human-decision-event-B08B-20260806T0100+0200`
- correction scope: generated resume metadata only
- human decision block changed: `false`
- semantic decisions changed: `false`
- prior artifact mutated: `false`

## Finding

The Batch 08B event metadata stated that `L540` was fully accounted and that the next source line was `L541`. The exact handoff locators show that `C-172` occupies `L539-L540` and `C-173` begins on `L540-L541`. Because the two candidates share `L540`, that line is not fully accounted until C-173 is adjudicated.

## Corrected Resume Boundary

- last original candidate adjudicated: `C-172`
- last gap adjudicated: `G-034`
- last fully accounted source line: `L539`
- next source line: `L540`
- next candidate: `C-173`
- next candidate locator: `L540-L541`
- next gap: `G-035`
- SRC-001 closed: `false`
- SRC-002 started: `false`

The original Batch 08B event remains unchanged and must be read together with this correction.

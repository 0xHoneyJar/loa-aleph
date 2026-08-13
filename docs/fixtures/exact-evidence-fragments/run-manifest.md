# Run Manifest — RUN-exact-evidence-fragments

## Identity

- run_id: RUN-exact-evidence-fragments
- predecessor_run: none
- mode: manual
- created: 2026-08-13
- doctrine_sha: 07cf2a5a843f68e09628a7055e72c304af87f3d0
- run_format_version: 1.0.0-provisional

## Corpus binding

- corpus_ref: corpus/manifest.md
- corpus_hash: sha256:214ea48c672beb510e2d3960e227c39e7b176b3817e6842a6c905fc2fd5ce3cb
- declared_scope: synthetic exact-evidence structure only

## State log

| # | state | entered | actor | note |
|---|-------|---------|-------|------|
| 1 | DRAFT | 2026-08-13 09:00 UTC | manual-fixture-coordinator | run directory created |
| 2 | CORPUS-FROZEN | 2026-08-13 09:10 UTC | fixture-simulated authority | one synthetic source frozen |
| 3 | DISTILLING | 2026-08-13 09:20 UTC | manual-fixture-runner | exact-evidence packetization began |

## Authority sign-offs

| gate | decision | by | date | reference |
|------|----------|----|------|-----------|
| S0 corpus scope + sensitivity | fixture-simulated approved; synthetic source only | fixture-simulated authority | 2026-08-13 09:10 UTC | run-log.md S0 exit |

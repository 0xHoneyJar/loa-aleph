# Producer implementation attempts

These are synthetic/mechanical producer records, not replay evidence or
independent audit. Each numbered command record retains the exact command,
process exit status and complete stdout/stderr. Synthetic result records
retain passing controls, each mutation's changed canonical bytes and the
actual refusal token/evidence.

- `001-typecheck.json`: failed because `let current = sep` inferred Node's
  literal separator union. Repaired to `let current: string = sep`.
- `002-controls.json`: R02 correctly refused the initial synthetic selector
  receipt. The fixture used raw commit text where the existing bundle contract
  requires base64 `commit_object`; the checker also compared raw bytes to that
  encoded string. Repaired the fixture to base64 and the comparison to decoded
  bytes. The imported Core contract was unchanged.
- `003-typecheck.json`: passed after those repairs.
- `004-suite.json` and `004-synthetic-results.json`: 53/53 tests and 29/29
  mutations passed at that intermediate implementation.
- `005-typecheck.json`: passed.
- `006-suite.json` and `006-synthetic-results.json`: 56/56 tests and 29/29
  mutations passed after added archive, derivation and manual-pass coverage.

The first controls command exited zero because it printed the R01–R09
results without setting an aggregate exit status. Its retained R02 FAIL is
not a passing suite. The executable test runner subsequently asserts every
control and returns nonzero for any failing test.

Intermediate results bind their retained subjects and command observations.
The final reconciliation identifies the committed source and final repeated
checks. Later coverage strengthened snapshot side membership, exact
schema binding and complete proof copies; earlier PASS records are not
substitutes for final-head verification.

No authority, proposal, adoption or Q-R1 record was amended.

- `007-typecheck.json`, `008-suite.json` and `008-synthetic-results.json`:
  58/58 tests and 29/29 mutations passed at implementation checkpoint I.
- `009-opaque-identities.json`: authorized whole-file archive/custody-manifest
  hashes only; no member or answer access.
- `010-regression-sandbox.json`: compiler subprocess EPERM at exact checkpoint
  I. No source repair; `012-regression-permitted.json` retains the complete
  passing unchanged `npm test` in the permitted host context.
- `011-compatibility-checkpoint.json`: checkpoint I byte/identity preservation.
- `013-environment-attempts.json`: retained sandbox DNS and Git-directory
  staging restrictions and scoped retries. No approval-review rejection.
- `014-candidate-typecheck.json`, `015-candidate-suite.json` and
  `015-synthetic-results.json`: 59/59 tests and 29/29 mutations passed for the
  isolated candidate test change. It retains 69 raw synthetic payload blobs
  and actual snapshot observations, validates H-M24's artificial normalizer
  return with the existing Core contract, and asserts CLI exit/status instead
  of accepting any subprocess exception. Protocol and Core bytes are unchanged.

Routine read-only discovery also found two guessed filenames absent; the
canonical manifest/contract paths were then read directly. This had no source
or test effect. Final committed-checkpoint checks are retained separately.

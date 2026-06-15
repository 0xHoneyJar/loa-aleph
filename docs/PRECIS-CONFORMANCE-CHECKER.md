# Précis Conformance Checker (Aleph Slice 3)

`scripts/validate-precis-fixtures.mjs`

A narrow, dependency-free, local conformance checker that validates the
already-accepted Research Précis fixtures (Slice 1 and Slice 2) against the
**accepted provisional v0 envelope**. This is the first Aleph slice to introduce
code; it is deliberately kept minimal.

## How to run

```
node scripts/validate-precis-fixtures.mjs
```

- Node built-ins only (`node:fs`, `node:path`, `node:url`). No dependencies, no
  `package.json`, no lockfile, no build step, no network.
- Reads files only. Writes nothing. Mutates no repo state.
- Exit code `0` = all checks pass; non-zero = at least one invariant failed
  (**fail-closed**). Prints a per-check PASS list and, on failure, a `FAIL …`
  line naming what failed and where.

## What it proves

That the accepted Précis fixtures are not merely human-readable but carry
**mechanically checkable completeness/accounting invariants**:

1. **Fixture shape** — each fixture directory contains exactly `README.md`,
   `corpus.md`, `precis.md`, and is Markdown-only (no code/data/subdirs leak in).
2. **Absolute forbidden tokens** — zero occurrences of `Phase` or `Sensenet`
   anywhere under a fixture directory (hard, context-free zero-tolerance).
3. **Projection boundary** — the Précis does not *generate* a downstream
   projection. A line is flagged only when it pairs a projection noun
   (`PRD`, `GTM`, `market landscape`, `product spec`, `projection`, …) with a
   generation verb (`generate`, `produce`, `formalize`, `emit`, `ship`,
   `project into`, …) **and** carries no inline refusal/negation/hypothetical
   cue (`no`, `not`, `does not`, `could`, `none … generated`, `projection-neutral`,
   `out of scope`, …). Real-export markers (`ChatGPT said:`, citation tags) are
   also rejected.
4. **Schema wording** — `precis.md`/`README.md` must explicitly reject schema
   finality (`no schema freeze`, `not a final schema`, `accepted provisional v0
   envelope`, or `field structure is provisional`).
5. **Corpus input boundary** — `corpus.md` contains the expected source IDs
   (Slice 1: `SRC-001..003`; Slice 2: `SRC-101..104`) and **leaks no answer
   key**: no candidate-claim IDs (`CC-NNN`), no `STM-N`, no `candidate claim`,
   no `stress-test matrix`, no compound disposition labels
   (`excluded-with-reason`, `judged-non-load-bearing`), no `disposition:` label
   or disposition column, and no disposition-classification table row.
6. **v0 envelope** — all 17 numbered envelope sections are present in
   `precis.md`. Described as the *accepted provisional v0 envelope*, not a final
   schema.
7. **Candidate-claim inventory** — IDs are unique and match the expected set
   exactly (Slice 1: `CC-001..010`; Slice 2: `CC-101..114`); every claim has
   exactly one disposition drawn from the valid seven.
8. **Disposition coverage** — all seven dispositions
   (`carried`, `merged`, `deferred`, `excluded-with-reason`, `backgrounded`,
   `judged-non-load-bearing`, `unresolved`) appear at least once per fixture.
9. **Accounting** — inventory count equals the declared §5 ledger total
   (Slice 1: 10; Slice 2: 14); the ledger's per-disposition counts sum to the
   inventory count; and each declared per-disposition count equals the actual
   count parsed from the §4 inventory.
10. **Stress-test matrix** (Slice 2 only) — a clearly named `## Stress-test
    matrix` section exists, carrying rows `STM-1 … STM-7`.

## What it does NOT prove

- It is **not** a schema validator and does **not** freeze the envelope. It
  encodes the *provisional v0* vocabulary as evidence-of-current-shape; a later
  slice may amend the envelope and update the checker in lockstep.
- It is **not** a Markdown parser, an extractor, or a Précis *generator*. It
  reads the hand-authored fixtures and checks invariants with small, readable
  helper functions and targeted regexes — not a parsing framework.
- It does **not** judge research quality, truth, or whether dispositions are
  *correct* — only that the accounting balances and nothing silently vanishes.
- It does **not** read raw corpus and produce a Précis. No live machinery.

## Why this is not a schema freeze

The checker's constants describe the **accepted provisional v0 envelope** — the
shape Slice 1 and Slice 2 were accepted with. Per Aleph doctrine, packets are
run first and the matrices name the structure second; the envelope remains
amendable. If a future slice changes the envelope, the fix is to update this
checker alongside the fixtures — the checker follows the doctrine, it does not
ossify it.

## Why this is not extraction / generation machinery

The checker never transforms a corpus into a Précis, never emits a downstream
artifact, and never projects claims into a PRD/GTM/spec. It only *verifies* that
the existing artifacts honor the no-projection and no-silent-discard invariants.
It is a read-only conformance gate, the opposite of a generator.

## Relationship to Slice 1 and Slice 2

- **Slice 1** (happy-path v0 fixture) and **Slice 2** (adversarial fixture +
  stress-test matrix) were accepted as hand-authored, human-inspected Markdown.
- Slice 3 adds the *mechanical* inspection those slices' completeness guarantee
  implicitly promised. Both accepted fixtures must pass; the checker is run
  against both and exits 0 only if both conform.
- Slice 3 makes the forbidden-token / projection-boundary / accounting guarantees
  **enforced** rather than verified by eye.

## Running against a copy (`--root`)

By default the checker validates the fixtures under the repository it lives in.
It also accepts `--root <dir>`, pointing it at any directory that contains a
`docs/fixtures/…` tree:

```
node scripts/validate-precis-fixtures.mjs --root /tmp/some-copy
```

This is read-only and writes nothing; it exists so the negative-test battery can
run the **real** checker against temporary copies of the fixtures without ever
mutating the tracked fixtures.

## Failure posture

Fail-closed. Any real invariant violation prints a `FAIL <slice> <check>: <what>
<where>` line and exits non-zero. A passing run prints `RESULT: PASS`.

After the Slice 3 hardening patch, the checker was **re-run** against a negative
battery using temporary copies (`--root`); every case below exited non-zero, and
a clean copy still exited 0:

1. an extra direct file in a fixture directory (`slice-1/extra.md`);
2. a candidate-claim ID (`CC-001`) leaked into `corpus.md`;
3. a `Disposition: unresolved` label leaked into `corpus.md`;
4. a compound disposition `excluded-with-reason` leaked into `corpus.md`;
5. a removed candidate-inventory row with the ledger left unchanged;
6. a ledger total changed to mismatch the inventory count;
7. the actual `STM-7` matrix **row** removed while `STM-7` still appears in
   summary prose (the checker fails because it isolates the matrix section and
   requires `STM-7` as a real table row, not prose);
8. `This Précis deliberately generates a PRD.` (a generation assertion — the word
   "deliberately" is **not** treated as an exemption);
9. a malformed inventory row carrying two disposition cells
   (`| CC-101 | SRC-101 | bad claim | deferred | carried |`) — rejected for both
   its column count and its multiple disposition cells;
10. `| CC-101 | claim | SRC-101 | carried | extra-cell` — a row with a leading
    pipe but **no trailing pipe** and an extra cell;
11. `| CC-101 | claim | SRC-101 | carried | deferred` — same shape, the extra
    cell being a second disposition;
12. `CC-101 | claim | SRC-101 | carried | extra-cell` — a row with **no outer
    pipes at all** and an extra cell;
13. `CC-101 | claim | SRC-101 | carried | deferred` — same, the extra cell being
    a second disposition.

Cases 10–13 are the optional-trailing-pipe bypass: the table-row parser strips a
leading/trailing split fragment **only when it is genuinely empty**, so a
non-empty trailing fragment is preserved as a real cell. Each of these rows
therefore parses to 5 cells and is rejected by the exact-column-count check
(`expected exactly 4 columns, got 5`) rather than being silently truncated to a
well-formed 4-column row. This closes the bypass that earlier let an extra cell
or a smuggled second disposition slip past when the outer pipes were omitted.

The false-positive guards still pass (a clean fixture is not flagged): legitimate
refusal/boundary prose such as `no PRD`, `not a GTM plan`, `does not become a
product spec`, `no schema freeze`, `projection-neutral`, `no downstream
projection generated`, and `could project only in a future consumer`, plus the
ordinary-English `unresolved at the research stage` inside `corpus.md`.

## Future possible hardening (explicitly deferred)

These are **not** implemented in this slice and require their own approved slice:

- Cross-checking the §6–§10 prose sections against the §4 inventory per claim.
- Verifying merge-map provenance (that merged claims retain all source IDs).
- Validating that every `STM` row references claim IDs that exist in §4.
- A `--json` machine-readable report mode.
- CI wiring (intentionally omitted: no CI in this slice).
- Generalizing beyond the two known fixtures to a discovered-fixtures mode.

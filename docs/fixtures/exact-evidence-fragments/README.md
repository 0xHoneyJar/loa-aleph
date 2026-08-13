# Exact Evidence and Ordered Fragments Fixture

```aleph-fixture
kind: run
src_ids: SRC-301
```

This synthetic `DISTILLING` run exercises the versioned
`aleph-exact-evidence/v1` packet-ledger extension. It contains:

- one exact single fragment with curly quotation marks and a ligature;
- two exact adjacent fragments;
- two ordered discontiguous exact fragments;
- rendered and normalized text that differs from exact source bytes; and
- one explicitly degraded, non-exact rendering with no packet or exact hash.

The fixture proves only deterministic source-byte and structural fidelity. It
does not prove semantic entailment, normalization quality, packetization
quality, extraction completeness, or source trustworthiness.

## Validation

```text
node scripts/validate-run.ts --run docs/fixtures/exact-evidence-fragments
node scripts/test-conformance-mutations.ts --group K2E
```

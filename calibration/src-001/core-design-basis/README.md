# SRC-001 Audited Core Design Basis

This directory retains post-close development design evidence derived from the
immutable SRC-001 closed calibration reference and a subsequent independent
audit.

## Status

- SRC-001: `CLOSED_FOR_CALIBRATION`
- SRC-002: `NOT_AUTHORIZED`
- Retained independent-audit result: `PASS_WITH_REVISIONS`
- Architecture decision: proposed and awaiting human authority adoption

## Boundary

The nine authoritative files in this directory are retained with exact bytes
from the audited design-analysis publication. They are not part of the
immutable closed-reference package, and this retention does not modify or
replace that package or any historical SRC-001 evidence.

These files are repository-administration evidence used to inform later Core
implementation. They are not Core, adapter, packaging, checker, bundle,
runtime, fixture, projection, or run-format payloads.

This directory does not:

- change SRC-001's status;
- authorize or begin SRC-002;
- authorize Core implementation;
- establish validation, sanction, acceptance, golden status, production
  readiness, or v1; or
- change current Core or adapter capability status.

`CHECKSUMS.sha256` verifies the eight authoritative members it lists. The
checksum manifest itself has SHA-256
`09da30f579d045f040c5740009670b5d55a63dbd420700cb0eac24f958f5cdc2`.

`PROPOSED-architecture-decision.md` is new repository-administration material.
It is deliberately excluded from the retained authoritative checksum set and
is not a human-adopted decision.

# Blind SRC-001 replay harness mechanics

Calibration administration only. This implements the adopted proposal at
`c607b724d16c13202d581b23bab6af5e8a256a6a`, proposal SHA-256
`52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8`,
adoption `6dbb68ce7b6a5f2c10e7808dc2eacc3d38bf89e9`, Q-R1
`84b6d9d734ab68f3986ce6b969ea0fb6e577bad2`, and implementation authorization
`b13e5ef20647e9f892da9c4fd213db7585da7ac3`.

The code validates records and recorded mechanical evidence. It does not run
Aleph, generate semantic artifacts, dispatch workers, manage VMs, make network
calls, grant reference access, or repair F-03. No public `/loa-aleph` operation
changes. Manual mode remains the only sanctioned execution path; Q-R1 selects
experimental/unsanctioned native policy for a later separately authorized
first replay, without fallback.

## Run the local checks

From the repository root:

```sh
node calibration/src-001/replay/tests/test-harness.ts
node node_modules/typescript/bin/tsc -p calibration/src-001/replay/tests/tsconfig.json --noEmit
node calibration/src-001/replay/protocol/sha256-52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8/src/cli.ts verify-protocol
```

The CLI additionally accepts `schemas` and
`validate-record <schema-name> <file>`. Its schema-only PASS establishes
encoding and record shape, not cross-record integrity. Every execution,
release, attestation and reference-opening operation is refused.
There is no package registration or generated runtime projection.

`tests/test-harness.ts --report <new-path>` can retain canonical synthetic
test evidence under `tests/evidence/` or a `/tmp/SYNTHETIC-...` path.
It creates the report exclusively. Old reports are not overwritten.
All temporary fixture roots and attempt-like identifiers start `SYNTHETIC-`.

## Record and storage boundary

`schemas/records.schema.json` is a closed versioned JSON Schema catalog.
Its 33 record definitions cover the replay manifest, input/release locks,
execution mode, environment, visibility and generations, derivation,
reference custody, leak checks, events, run reference, outcome, inventory,
canonical artifact and ledger indexes, quiescence, freeze and attestation,
access, reference lock, comparison manifest, mapping, three reports,
uncertainty/findings, comparison inventory, audit manifest, execution
evidence, workspace observation, gate projection and protocol lock.

Shared definitions close every nested object too. The local validator
implements the vocabulary used by this pinned catalog. It accepts no
caller-supplied schema or remote schema resolution. Unknown/missing keys,
duplicate JSON keys (including escaped aliases), numeric record values,
invalid enums, invalid Unicode and noncanonical records fail.

Harness JSON uses the imported bundle canonical encoding: UTF-8, bytewise
sorted object keys, compact encoding, decimal-string quantities, one LF.
Raw evidence is hashed before any parsing and is never rewritten for hashing.
The supplied-representation descriptor remains an imported ordinary Core
record with Core's required field order. Its encoding is not replaced by
harness canonical JSON.

ArtifactRefs are exactly `{store,path,byte_length,sha256}`. A store identity
is the SHA-256 of its canonical closed inventory lock, supplied by trusted
custody. `Stores.register` verifies the lock and actual filesystem.
`Stores.read` rechecks complete store inventory and exact file bytes.
Absolute/traversal/ambiguous relative paths, non-NFC names, case aliases,
symlinks, hardlink aliases, sockets, devices and special modes are rejected.
File reads check descriptor identity and stability. Complete inventories
retain hidden files, regular file modes and empty directories.

`protocol-lock.json` inventories this directory except itself, and pins the
unchanged imported Core source closure. Its check establishes consistency
with that lock. Authenticity still requires the separately pinned, audited
implementation commit and lock digest; a self-authored lock is not authority.

## Mechanical checks

| Rule | Implemented boundary |
| --- | --- |
| R01 | Exact approved opaque input metadata, trusted input-lock equality, raw byte reopening, source/criteria roles and ordinary supplied-representation validation |
| R02 | Recorded A/B checkout independence, exact canonical merge, complete inventory/reproduction equality, original bundle lock and selector provenance, archive/sidecar identity, package metadata distinction, install/run lock equality, runtime inventory |
| R03 | Trusted environment digest, exact recorded inventories/mounts/channels, secret-safe variables, denied probe receipts and absence of inherited sessions |
| R04 | Trusted initial origins and producing receipts, closed derivation graph, visibility generations, role/output contracts, complete delivered parts, independently recorded submission/reproduction and context receipt equality |
| R05 | Mode/sanction/evidence consistency, immutable mode binding, no fallback, declared actor/pass independence, raw result retention and production-effect/completion consistency |
| R06 | Exact complete filesystem inventory, snapshot proof copies, acyclic references, artifact/ledger indexes, quiescence, stopped event prefix, detached digest and trusted-key attestation |
| R07 | Valid evaluation freeze before causal grant/open/start events, exact replay binding, separate fresh comparator, denied writes/no aliases or credentials, unchanged inventory |
| R08 | Exact schema/freeze/reference binding, frozen replay and locked reference membership, raw selectors/anchors, legal many-sided correspondence, side-local IDs as metadata |
| R09 | Distinct report classes, evidence and author bindings, reached-stage limitations, findings, indeterminate assessments and denominator-preserving counts |

Every result has `check_id`, `result`, `token`, `proposition`, `evidence`
and `non_claims`. A PASS is `<R-id>_MECHANICAL_PASS`. Adopted failure and
blocker tokens remain external calibration results, not new Core enums.
Parser/path/store errors retain their own precise refusal evidence.

The caller provides trusted custody/store bindings, approved input and
environment pins, allowlisted recorder receipts, and the recorder public key.
The harness validates recorded facts under that boundary. It does not
establish that an untrusted recorder told the truth, that a human forgot an
answer, that a provider excluded training data, or that semantic reviewers
were cognitively independent. Missing recorder/context evidence blocks.

The recorded stage-obligation index is bound as prepared evidence to its
contract, stage and run format. Its actual artifact statuses are checked
against the full snapshot. Ordinary Core remains the owner of stage
obligations and checker status. No harness status replaces those results.

## Synthetic preparation and freeze

`syntheticDescriptor` builds only whole-file text/root/capture bindings and
an opaque upstream PDF asset, then invokes the unchanged Core parser/import
validator. It produces no table, equation, region or semantic annotation.
Required unavailable formal/visual material remains unavailable through
ordinary Core behavior; criteria are not a corpus source.

`syntheticArchiveMembers` exercises a bounded single-disk ZIP subset in
memory. It validates all central/local names and offsets, rejects duplicates,
links and ambiguous members, and decompresses only selected synthetic input
members against their byte pins. It rejects real replay IDs and the retained
real archive digest. It is not a production input-export command.

`copySyntheticStores`, `appendSyntheticEvent` and `syntheticAttestation`
are explicitly synthetic-only creation helpers. Other APIs validate prepared
records without creating a real attempt. No VM construction, actual access
probe, host capability receipt or native delivery recorder is created here.
Later preparation must supply the exact recorded facts under separate
authority. A missing fact is a blocker.

The synthetic snapshot is `result/run/` plus `result/execution-evidence/`.
All original proof stores are copied byte-for-byte under execution evidence;
companion indexes, inventory, quiescence and authority are separately bound.
The inventory digest excludes its own record. Freeze payload and detached
attestation are outside the payload. Event order uses predecessor digests
and sequences, including an exact production-stop cut, never timestamps alone.
Completed and F-03-blocked scenarios both retain complete inspectable snapshots.
The synthetic signing key in the test factory is public test material and
cannot be used as a real recorder or authority credential.

## Comparison mechanics and limits

Comparison functions validate synthetic/prepared records; they never read
the retained closed-reference package themselves or decide correspondences.
Markdown physical line selectors, JSON pointers and JSONL positions reopen
exact selected raw bytes. Source anchors reopen pinned source ranges.
One-to-one, one-to-many, many-to-one and many-to-many arrays are legal;
absence and `CANNOT_DETERMINE` retain explicit limitations.

Native IDs must be actual side-local metadata. They are never equality
join keys. Shared bytes or IDs do not choose a semantic category.
The exact-byte, structural and semantic reports remain separate.
Counts use cited mapping rows, all seven correspondence buckets, the complete
denominator and reached-stage scope. Unknowns cannot silently disappear.
Comparison output inventories are sealed separately from the frozen replay;
their companion inventory is outside the inventoried output root.
Audit manifest checks concern structure/identity, not an independent audit.

The harness cannot decide whether a claim should exist, whether claims mean
the same thing, whether normalization is correct, whether a delta is good or
bad, whether the reference is universal truth, or ideal split/count/graph
density or semantic recall. It has no embeddings, similarity scoring,
reference-derived keyword rules, expected IDs or expected answer counts.

F-03/F-04/F-05 and every carried finding remain at their existing strength.
These tests establish no replay preparation, release reproduction, native
capability, semantic validation, comparison result, sanction, acceptance,
production readiness, golden status or v1. Fresh independent implementation
audit is required before merge or any separately authorized replay preparation.

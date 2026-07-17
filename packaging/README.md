# Immutable Aleph host bundles

This contract defines distribution for the Core/adapter boundary accepted by
[Decision 0004](../docs/decisions/0004-core-adapter-and-bundle-boundary.md).
The dependency-free TypeScript assembler and verifier are implemented in
[`scripts/assemble-bundles.ts`](../scripts/assemble-bundles.ts), with shared
canonicalization and digest rules in
[`scripts/lib/bundle-format.ts`](../scripts/lib/bundle-format.ts). They use the
exact source classification in
[`core.manifest.json`](../core.manifest.json) and the lifecycle and capability
rules in the [adapter protocol](../adapter-protocol/README.md).

## Bundle equations

```text
aleph-for-loa    = complete Aleph Core bytes + Loa adapter bytes
aleph-for-hermes = the same byte-identical Aleph Core bytes + Hermes adapter bytes
```

Each bundle also contains its generated, bundle-local lock. The complete Core
includes doctrine, S0–S13 and P1–P3 contracts, artifacts, prompts, templates,
projections, authority gates, checkers, checker specifications, fixtures,
mutation tests, goldens, and replay/audit evidence. Fixtures, goldens, or
checker evidence may not be omitted to reduce bundle size.

Local assembly writes these directories under the ignored
`.aleph-bundles/` directory by default. Generated payloads and locks are build
outputs, not tracked source artifacts or published releases.

The repository-wide `core.manifest.json` is source packaging metadata. It
classifies Core, both adapters, packaging files, and repository administration,
so it is not copied verbatim into either host bundle. Assembly selects the
complete Core classification plus exactly one adapter classification and emits
a bundle-local lock that describes only the selected payload.

New manual runs use the reserved `core-manual` execution binding declared by
`core.manifest.json`. Its adapter digest is computed over the binding's
declared Core paths, and its bundle payload and digest cover the complete Core
only. `core-manual` is not a third native adapter, implements no host runner,
and does not change the manual-only sanction boundary.

## Bundle lock

`bundle.lock.json` uses lock format `aleph-bundle-lock/v1` and records:

- digest algorithm, lock digest, bundle ID, version, payload digest, and bundle
  digest;
- Core ID, version, and tree digest;
- selected adapter ID, version, lifecycle, and tree digest;
- checker digest;
- adapter-protocol version (`1.0.0-provisional`);
- run-format version (`1.0.0-provisional`);
- the selected source-manifest projection and its digest;
- the assembly-tool path and file digest;
- resolved, target-dependency-closure-scoped Git provenance; and
- the complete ordered payload inventory, with normalized path, `core` or
  `adapter` classification, and per-file SHA-256 digest.

Canonical serialization and digest rules are:

1. Paths are normalized repository-relative strings. Paths and JSON object
   keys are ordered by their raw UTF-8 bytes, not locale.
2. Canonical JSON permits only null, booleans, strings, arrays, and objects;
   all numbers are forbidden. It recursively sorts object keys by that order,
   preserves array order, uses compact JSON with no insignificant whitespace,
   and ends with exactly one LF.
3. Canonical strings escape quote and backslash as `\"` and `\\`; use `\b`,
   `\t`, `\n`, `\f`, and `\r` for those five controls; and encode every other
   U+0000–U+001F code point as `\u` followed by four lowercase hexadecimal
   digits. Unpaired UTF-16 surrogates are rejected because they have no stable
   UTF-8 byte ordering. All other ASCII characters and valid non-ASCII Unicode
   scalar values are emitted directly as raw UTF-8. No Unicode normalization
   is performed.
4. A file digest is `sha256:` plus lowercase SHA-256 hex over the file's exact
   raw bytes.
5. Every tree-style digest sorts records by path and hashes the UTF-8 sequence
   `path`, NUL, the bare 64-character lowercase file digest, and LF. Core,
   adapter, checker, and payload digests use this construction over their
   respective inventories.
6. The selected-manifest-projection digest and provenance digest are SHA-256
   over their canonical JSON bytes.
7. `lock_digest` is SHA-256 over the canonical identity projection: lock and
   digest formats; bundle ID, version, and payload digest; Core and adapter
   records; checker, protocol, and run-format versions; selected source
   projection; assembly-tool identity; target-scoped provenance and its digest;
   and ordered file inventory. It excludes only the self-referential lock and
   bundle digests.
8. `bundle.digest` uses the tree construction over the complete payload plus a
   virtual `bundle.lock.json` record whose file digest is `lock_digest`.

The provenance record uses `aleph-source-provenance/v1` with kind
`git-dependency-closure-snapshot`. For each target, it selects the most recent
resolved Git commit touching any path in that target's UTF-8-bytewise-sorted
payload inventory. If no such path commit exists, it selects the
UTF-8-bytewise-first root commit from the checked-out history. It records:

- the Git object format;
- the full selected commit object ID;
- the raw commit-object bytes in canonical padded base64;
- the commit-tree object ID;
- `resolved: true` and `mutable_ref: null`; and
- `worktree_state: clean` or `modified`, calculated only across that target's
  selected payload paths, including nonignored untracked paths.

Verification decodes the canonical base64, reconstructs the Git commit object
ID using the recorded object format and raw object length, reads the tree ID
from the same commit object, and requires both to match the recorded IDs.
Mutable, unresolved, malformed, or internally inconsistent provenance is
invalid.

The complete provenance record and its digest are part of `lock_digest`, so
provenance tampering or a new commit touching the selected dependency closure
changes that target's lock and bundle identities. Because commit selection and
worktree state are scoped to the selected payload paths, a foreign-adapter-only
or unrelated repository commit or worktree change does not perturb the other
target. The selected manifest projection likewise contains the complete Core
inventory plus only that bundle's adapter inventory and target. An archive
wrapper, timestamp, or mutable branch name is not bundle identity.

The checker digest covers every Core checker, checker library, checker
specification, and deterministic mutation surface classified by the source
manifest. It does not permit an adapter-local checker replacement.

## Release-blocking invariants

Assembly fails unless:

1. the source validator has inventoried every tracked and every nonignored
   untracked path, and every path has exactly one classification;
2. both host assemblies independently compute the same Core path set, file
   digests, and Core tree digest;
3. each bundle contains the complete Core;
4. each bundle contains exactly its selected adapter and no foreign
   adapter-owned bytes; the selected adapter and generated lock contain no
   foreign-adapter paths, dependencies, profiles, installation requirements,
   or entrypoints. Common Core may name both adapter families when defining the
   protocol and this release invariant;
5. no adapter-owned path overlaps or overrides a Core-owned path;
6. every typed manifest reference resolves in the validated source inventory;
7. the adapter manifest and lifecycle evidence pass the adapter protocol;
8. the generated lock and every recorded digest verify; and
9. a rebuild is staged from a fresh selected inventory and replaces the prior
   target directory, so deleted or renamed source paths cannot survive as stale
   bundle files.

Core-digest equality across the two bundles and foreign adapter-owned
payload/dependency exclusion are release-blocking, not advisory comparisons.
Compare Core, adapter, checker, provenance, lock, and bundle digests; a global
repository revision alone is neither sufficient nor authoritative.

## Rebuild rules

| Change | Required rebuild |
|--------|------------------|
| Any Core byte, Core inventory entry, Core checker, fixture, mutation, golden, Core version, or selected-path provenance change | Both host bundles |
| Adapter protocol or run-format version | Both host bundles |
| Loa-only adapter byte, version, or selected-path provenance change | Loa bundle only |
| Hermes-only adapter byte, version, or selected-path provenance change | Hermes bundle only |
| Commit or worktree change outside a target's selected dependency closure | That target's identity digests do not change |

A rebuild creates a canonical immutable lock; a selected dependency-closure
change creates new lock and bundle identity digests. It never mutates an
already published bundle.

## Assemble and verify

From the repository root:

```bash
npm run bundle:assemble
npm run bundle:verify
npm run test:bundles
```

The direct CLI supports custom source, output, and verification paths:

```bash
node scripts/assemble-bundles.ts assemble [--root <repo>] [--output <dir>] [--json]
node scripts/assemble-bundles.ts verify [--output <dir>] [--bundle <dir> ...] [--json]
node scripts/test-bundle-assembly.ts [--json]
```

Assembly runs the Core-boundary validator over every tracked and nonignored
untracked source path, snapshots the exact selected bytes, stages and verifies
both targets, compares their Core inventories, digests, and bytes, confirms the
source dependency closure did not change during assembly, and only then
replaces the target output directories. An output directory inside the source
repository must be ignored by Git; the default is `.aleph-bundles/`.

Verification independently reopens an emitted directory and rejects a
noncanonical or malformed lock; missing, extra, modified, symlinked, renamed,
or unclassified files; digest or provenance tampering; lifecycle or adapter
identity drift; foreign-adapter content; and Core overrides. It recalculates
file, Core, adapter, checker, payload, lock, and bundle digests, then runs the
existing Core-boundary validator against the emitted inventory and selected
manifest projection. `verify` without `--bundle` checks both default target
directories; repeat `--bundle` to check explicit bundle directories.

The Loa adapter is `implemented`, so a verified `aleph-for-loa` bundle reports
`PREFLIGHT loa READY lifecycle=implemented`. The other registered host remains
`planned` and reports `NOT-READY`. Bundle readiness proves packaging and
structural implementation only; it does not validate a replay, sanction agent
mode, publish a release, or make a fixture-simulated run accepted evidence.

## Loa release artifact

A publishable Loa artifact is produced only from a globally clean, full-history
Git checkout after the source commit has landed. The release packager assembles
and independently verifies both host bundles, rechecks their common Core, and
publishes only the verified `aleph-for-loa` tree:

```bash
npm run release:loa:package -- --output <outside-repo-dir> --version 0.1.0-provisional
npm run release:loa:verify -- --release <release-dir>
npm run test:release-package
```

The release directory contains exactly three regular files whose basename is
bound to the full bundle digest: a deterministic `ustar` plus gzip archive, a
SHA-256 sidecar, and canonical `aleph-loa-release/v1` metadata. Archive paths,
ordering, file modes, owners, timestamps, gzip headers, and bytes are
normalized. Verification rejects links, devices, duplicate or traversing
paths, extra entries, noncanonical metadata, digest drift, and any archive
inventory that differs from `bundle.lock.json`; it extracts privately and
reruns the independent bundle verifier before returning success.

Release output is atomic and never overwrites an existing digest identity.
Published GitHub releases use content-addressed tags, attach all three files,
and remain prereleases while adapter validation and sanction evidence are
empty. The tag, release, and assets must be immutable; rollback selects a
previous immutable digest in Loa rather than editing or deleting an artifact.
Structural `implemented` maturity is not replay validation or sanction.

## Node 20 runtime projection

The bundle retains the complete authoritative TypeScript source and also locks
a deterministic ES2022 ESM projection under `runtime-js/`. Generate and verify
it with:

```bash
npm run runtime:build
npm run runtime:check
npm run test:runtime
```

`runtime-js/package.json` fixes the ESM package scope. The installed launcher
is exposed as `.claude/aleph/bin/loa-aleph.mjs`; its CLI, worker dispatcher,
installer, and pinned checker all execute the locked `.js` projection. This
keeps the installed Loa surface compatible with Node 20 without Bun, `tsx`, a
runtime package install, or network access. Release validation rejects any
source/projection drift before packaging.

## Assembly and installation boundary

Bundle assembly consumes exact frozen source bytes. Fetching Core or adapter
content from `main`, another mutable branch, a moving tag, a served endpoint,
or any runtime update channel is forbidden. Installation verifies the selected
bundle lock before exposing an entrypoint and must not fill missing files from
the network.

The adapter may invoke Core files in place from the verified bundle. It may not
generate host-local summaries, rewritten prompts, alternate templates,
checker forks, or doctrine overlays as installation products.

The Loa installer is an adapter-owned offline consumer of an already verified
`aleph-for-loa` directory. It snapshots and verifies the input before copying,
installs the complete payload and original lock below
`.claude/aleph/runtime/bundle/`, exposes only the declared command, skill, and
launcher mappings, and records a canonical managed-file receipt. Reinstalling
replaces the complete managed runtime and deletes stale paths named by the
prior valid receipt while preserving unmanaged files and every retained run.
The transient names `.claude/aleph-install.writer.lock*` and
`.claude/aleph-install.transaction*` are reserved adapter-owned coordination
paths, not unmanaged operator space. They are excluded from the final managed
receipt and removed after successful or recovered installation.
This serialization covers cooperating installers. The pure Node adapter rejects
observed symlinks and detects parent replacement, but does not claim protection
from a malicious same-identity process racing pathname syscalls.
It performs no assembly, repository synchronization, mutable fetch, or network
fallback.

## Run pins and updates

Before S0 closes, every new run records:

- Core ID, version, and tree digest;
- adapter ID, version, lifecycle, and tree digest;
- bundle ID and digest;
- checker digest;
- adapter-protocol and run-format versions;
- exact host identity;
- exact model identity per role, or `human`;
- immutable runtime-snapshot path and digest; and
- the original bundle lock or a content-addressed reference to it.

Core, adapter, checker, bundle, profile, model, or runtime updates affect new
runs only. Existing runs do not float to a newer release. A paused run resumes
with its original bundle and immutable runtime snapshot; if those bytes are
unavailable or fail verification, the run remains blocked or a successor run
is opened.

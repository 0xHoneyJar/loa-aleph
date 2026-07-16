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

Both current adapter manifests remain `planned`, so successful assembly and
verification report `PREFLIGHT ... NOT-READY lifecycle=planned`. This machinery
does not implement a host runner, installation, worker, synchronization flow,
or runnable Loa or Hermes integration; it does not sanction agent mode or
publish a release.

## Assembly and installation boundary

Bundle assembly consumes exact frozen source bytes. Fetching Core or adapter
content from `main`, another mutable branch, a moving tag, a served endpoint,
or any runtime update channel is forbidden. Installation verifies the selected
bundle lock before exposing an entrypoint and must not fill missing files from
the network.

The adapter may invoke Core files in place from the verified bundle. It may not
generate host-local summaries, rewritten prompts, alternate templates,
checker forks, or doctrine overlays as installation products.

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

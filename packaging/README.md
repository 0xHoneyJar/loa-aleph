# Immutable Aleph host bundles

This contract defines distribution for the Core/adapter boundary accepted by
[Decision 0004](../docs/decisions/0004-core-adapter-and-bundle-boundary.md).
It uses the exact source classification in
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

The generated lock records at least:

- bundle format, ID, version, and digest;
- Core ID, version, and tree digest;
- selected adapter ID, version, lifecycle, and tree digest;
- checker digest;
- adapter-protocol version (`1.0.0-provisional`);
- run-format version (`1.0.0-provisional`); and
- immutable provenance sufficient to reconstruct the assembly, including the
  selected source-manifest projection digest, exact input file digests, and
  assembly-tool identity.

All paths in a lock are normalized repository-relative paths. File digests are
SHA-256 over raw bytes. A tree digest is SHA-256 over the UTF-8-bytewise-sorted
sequence of `path`, a NUL byte, the lowercase file SHA-256, and a newline. The
bundle digest uses the same canonical inventory construction over the selected
payload plus a virtual `bundle.lock.json` record. That record is canonical JSON
of every generated lock field other than the self-referential `bundle_digest`
field: bundle/Core/adapter identity and versions, lifecycle, tree digests,
checker digest, protocol/run-format versions, selected source-manifest
projection digest, exact input-file digests, and assembly-tool identity. The
selected manifest projection contains the complete Core inventory plus only
that bundle's adapter inventory and target, so adding or removing a foreign
adapter file does not perturb this host's bundle identity. An archive wrapper,
timestamp, or global Git commit is not bundle identity.

The source validator computes the prospective payload, lock-projection, and
bundle digests for boundary verification. It does not emit or claim a release
bundle. A release assembler must emit the corresponding lock, add the computed
`bundle_digest`, and verify it before publication.

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
7. the adapter manifest and lifecycle evidence pass the adapter protocol; and
8. the generated lock and every recorded digest verify.

Core-digest equality across the two bundles and foreign adapter-owned
payload/dependency exclusion are release-blocking, not advisory comparisons.
Compare Core, adapter, checker, and bundle digests; global repository `HEAD`
alone is neither sufficient nor authoritative.

## Rebuild rules

| Change | Required rebuild |
|--------|------------------|
| Any Core byte, Core inventory entry, Core checker, fixture, mutation, golden, or Core version | Both host bundles |
| Adapter protocol or run-format version | Both host bundles |
| Loa-only adapter byte or version | Loa bundle only |
| Hermes-only adapter byte or version | Hermes bundle only |
| Repository-administration change outside every bundle payload | Neither bundle unless classification or provenance changes |

A rebuild creates a new immutable lock and bundle digest. It never mutates an
already published bundle.

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

# Aleph host adapters

Host adapters supply execution mechanics for one complete, immutable Aleph
Core. They are governed by
[Decision 0004](../docs/decisions/0004-core-adapter-and-bundle-boundary.md)
and the [adapter protocol](../adapter-protocol/README.md).

| Adapter | Manifest | Lifecycle | Runnable entrypoint | Installation | Full mode |
|---------|----------|-----------|---------------------|--------------|-----------|
| Loa | [`loa/adapter.manifest.json`](loa/adapter.manifest.json) | `implemented` | `/loa-aleph` command + verifying launcher | offline verified-bundle installer | structurally claimed; not validated or sanctioned |
| Hermes | [`hermes/adapter.manifest.json`](hermes/adapter.manifest.json) | `planned` | none | none | not claimed |

The [Loa package](loa/README.md) implements all thirteen host mechanics and
passes a synthetic structural preflight. Its fixture-simulated workers and
authority responses are implementation evidence only: they do not establish a
real replay, validation, sanction, or agent-mode permission. The other
reservation remains planned. Manual mode remains the only sanctioned Aleph
execution path.

## Adapter rules

An adapter:

- owns host entrypoint, installation, isolation, invocation, persistence, gate
  presentation, runtime capture, and model/effort mapping mechanics only;
- consumes the complete Core selected by
  [`core.manifest.json`](../core.manifest.json);
- never alters, overrides, summarizes, restates, duplicates, transforms, or
  weakens Core;
- never carries a host-local copy of Core doctrine, prompts, templates,
  checkers, fixtures, mutations, or goldens;
- never references another host adapter's paths or requirements; and
- is distributed only in the immutable host bundle defined by the
  [packaging contract](../packaging/README.md).

Adapter mechanics and host-specific evidence stay within the paths owned by its
manifest. Shared inventory and status documents may classify and report that
implementation without absorbing its mechanics into Core. An implementation
supplies a real entrypoint and installation and passes the structural preflight
covering all thirteen capabilities. Advancing to `validated` requires accepted
replay evidence; advancing to `sanctioned` additionally requires explicit
authority evidence. No planned path, documented intention, or simulated fixture
counts as validation or sanction.

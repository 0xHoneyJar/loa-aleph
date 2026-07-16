# Aleph host adapters

Host adapters supply execution mechanics for one complete, immutable Aleph
Core. They are governed by
[Decision 0004](../docs/decisions/0004-core-adapter-and-bundle-boundary.md)
and the [adapter protocol](../adapter-protocol/README.md).

| Adapter | Manifest | Lifecycle | Runnable entrypoint | Installation | Full mode |
|---------|----------|-----------|---------------------|--------------|-----------|
| Loa | [`loa/adapter.manifest.json`](loa/adapter.manifest.json) | `planned` | none | none | not claimed |
| Hermes | [`hermes/adapter.manifest.json`](hermes/adapter.manifest.json) | `planned` | none | none | not claimed |

These manifests reserve future host-native integration surfaces. Neither
manifest implements a runner, proves a capability, or sanctions agent mode.
Manual mode remains the only sanctioned Aleph execution path.

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

A future implementation must update only its own manifest and owned paths,
supply a real entrypoint and installation, pass all thirteen capability
preflights, and add accepted evidence before advancing lifecycle state. No
planned path or documented intention counts as implementation.

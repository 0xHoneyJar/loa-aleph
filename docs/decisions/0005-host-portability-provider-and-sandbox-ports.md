# Decision 0005 — Host portability: provider and sandbox ports

**Status**: Proposed (draft PR for authority review; nothing below is accepted,
validated, or sanctioned by its existence here)

**Authority**: `operator:eileen` (sole product, semantic, architectural, and
gate-disposition authority). Proposed by `operator:zksoju` from downstream
consumption experience.

## Context

Decision 0004 fixes the Core/adapter boundary, and the
[runner capability contract](../../adapter-protocol/runner-capability-contract.md)
(#32) already states the load-bearing commitments this proposal builds on:

- "A runner is a replaceable host mechanism around those files."
- "Manual mode is the existence proof that the method does not depend on one
  model provider."
- "The Fable profile is one first reference runner, not the runner contract."

The [adapter capability contract](../../adapter-protocol/capability-contract.md)
adds: "Runtime, model, context, effort, budget, cache, batch, and installation
details belong to adapter profiles."

The structurally implemented Loa adapter, however, pins two runtime details in
code rather than in the profile layer:

1. **Provider is a single literal.** `adapters/loa/src/host-attestation.ts`
   rejects any `--provider` other than `amazon-bedrock`;
   `adapters/loa/src/claude-code-host.ts` carries the literal in its option
   type (`provider: 'amazon-bedrock'`), requires
   `BEDROCK_CREDENTIAL_ENVIRONMENT` (`AWS_BEARER_TOKEN_BEDROCK`, `AWS_REGION`,
   `CLAUDE_CODE_USE_BEDROCK`), and re-checks the literal in receipt validation
   and worker preparation.
2. **Isolation is a single mechanism on a single platform.**
   `resolveBubblewrapExecutable` admits only `bwrap`, and
   `REQUIRED_READ_ONLY_MOUNTS` hardcodes Linux FHS paths (`/lib`, `/lib64`,
   `/etc/nsswitch.conf`) that do not exist on darwin. There is no macOS
   isolation path at any lifecycle tier.

The consequence is concrete: the two operators closest to Aleph run disjoint
hosts. One runs Linux with Bedrock credentials (the current implemented path).
One runs macOS with no Bedrock access but with proven headless CLI providers.
On the second host, agent mode cannot even reach preflight, so no replay
evidence can ever be produced from it — the host is structurally excluded from
the runner lifecycle rather than being held at an honest `planned`/
`implemented` tier.

Downstream evidence that this matters: the first real downstream Précis
lifecycle (loa-freeside, `cr-contract-corpus`, 2026-07-19 — S0 scope ruling
through S13 Précis acceptance and a P3-accepted projection, all
fixture-labeled) was executed entirely in manual mode on the macOS host. The
method worked; the consumption value is demonstrated; the attested runner is
the only missing piece on that host class.

### Prior art inside the estate

Loa's multi-model substrate (`cheval`, vendored in Loa-mounted repos at
`.claude/adapters/loa_cheval/providers/`) already solved the same problem with
a port design this proposal deliberately mirrors: one provider base contract
with `bedrock_adapter`, `anthropic_adapter`, `claude_headless_adapter`,
`codex_headless_adapter`, and `cursor_headless_adapter` implementations, an
audit envelope that records the model identity actually observed (not the one
requested), and a fallback doctrine that never crosses provider boundaries.
Aleph's discipline is stricter (no fallback at all,
`fallback_allowed: false`), which makes the port extraction simpler here than
it was there.

## Observation that makes this cheap

The evidence and receipt schemas are already mechanism-neutral. Dispatch
evidence records `sandbox_executable_digest` and `sandbox_policy_digest` —
digests, not a bubblewrap invocation. Attestation records probes with
`observed_model`, `event_stream_digest`, effort, and cost — a protocol any
Claude Code auth mode can satisfy. Only the **resolution layer** (which
provider literal is accepted; which sandbox binary is resolved; which mount
list is assumed) is single-choice. The proposal therefore changes no evidence
shape and no Core surface.

## Decision (proposed)

Extract the two pinned axes into explicit ports, selected and sanctioned by
profile data rather than code literals.

### 1. ProviderPort

A provider port declares:

- `id` (e.g. `amazon-bedrock`, `anthropic-api`, `claude-cli-subscription`);
- its required credential environment (the Bedrock triple; or
  `ANTHROPIC_API_KEY`; or an interactive-login credential store probe for the
  subscription CLI);
- how to run the schema-constrained attestation probes (unchanged probe
  schema, unchanged `FALLBACK_CONTROLS`, unchanged observed-model
  verification);
- its no-fallback statement (all ports: none — `exact_model_identity` is a
  floor, not a Bedrock feature).

The current Bedrock behavior becomes the `amazon-bedrock` port, byte-identical
in receipts and evidence.

### 2. SandboxPort

A sandbox port declares:

- `id` (e.g. `bubblewrap`, `seatbelt`, `container`);
- supported platforms;
- executable resolution + digest capture (unchanged);
- policy generation for the invariants the runner contract already names:
  worker sees only the sealed bundle read-only at `/worker`, writes only the
  return root, no inherited conversation, no other readable project paths;
- the policy-digest material (for bubblewrap: the argv policy as today; for
  seatbelt: the generated `sandbox-exec` profile text; for container: the
  container spec).

`REQUIRED_READ_ONLY_MOUNTS` moves from a module constant into the bubblewrap
port's policy. A darwin `seatbelt` port expresses the same deny-default,
read-only-`/worker` semantics in Seatbelt profile language.

### 3. Profiles own sanction

The adapter profile gains a `sanctioned_ports` surface, e.g.:

```json
{
  "runtime_requirements": {
    "sanctioned_ports": {
      "providers": ["amazon-bedrock"],
      "sandboxes": ["bubblewrap"]
    }
  }
}
```

A draft second profile (illustrative only; not shipped by this decision):

```json
{
  "profile_format": "aleph-loa-profile/v1",
  "id": "loa-macos-headless",
  "host": "loa",
  "runtime_requirements": {
    "node_min_version": "20.0.0",
    "sanctioned_ports": {
      "providers": ["anthropic-api", "claude-cli-subscription"],
      "sandboxes": ["seatbelt"]
    }
  }
}
```

Receipts record which port produced them (`runtime.provider_port`,
`runtime.sandbox.port`) alongside the existing digests. Attesting through a
port that is implemented but not yet sanctioned fails preflight exactly as an
absent capability does today — or, in a supervised evaluation, proceeds only
under the existing `fixture-simulated`/simulation taint, which already has the
right semantics: structural evidence, never validation or sanction.

### 4. Lifecycle unchanged, per port

Each port walks the existing runner lifecycle independently: structural
preflight (`implemented`) → accepted replay evidence (`validated`) → explicit
authority decision (`sanctioned`). Nothing in this decision advances any
port's state. The `amazon-bedrock` + `bubblewrap` pair remains the only
candidate for first validation; `seatbelt` + headless providers start at
`planned` with the macOS operator as the natural replay-evidence source.

### Interface sketch (illustrative, not normative)

```ts
interface ProviderPort {
  readonly id: string;
  requiredEnvironment(): readonly string[];
  assertCredentialPresence(env: NodeJS.ProcessEnv): void;
  probeArgs(modelId: string, effort: string): string[]; // same PROBE_SCHEMA
  fallbackControls(): Readonly<Record<string, string>>; // always disabling
}

interface SandboxPort {
  readonly id: string;
  readonly platforms: readonly NodeJS.Platform[];
  resolveExecutable(input?: string): string; // digest-captured by caller
  buildPolicy(spec: WorkerMountSpec): SandboxPolicy; // policy_digest material
}
```

## Non-goals

- No fallback of any kind is introduced, between or within ports.
- No weakening of `exact_model_identity`, blind bundles, single-writer
  ledgers, or any of the thirteen capabilities.
- No change to Core prompts, stage contracts, checker bytes, or gates.
- No claim that a seatbelt or headless-provider run is equivalent evidence to
  the reference runner — equivalence is exactly what the per-port lifecycle
  must demonstrate.
- No mutation of existing runs, receipts, or the published bundle lineage.

## Consequences

- The receipt and evidence schemas gain two identity fields; existing
  Bedrock receipts remain valid under a defaulting rule
  (`provider_port: amazon-bedrock`, `sandbox.port: bubblewrap`).
- The second host class becomes lifecycle-admissible instead of structurally
  excluded, which is the precondition for ever getting cross-host replay
  evidence — and cross-host replay is itself useful validation pressure on
  the runner contract's claim of host neutrality.
- Port extraction before first validation avoids re-validating the reference
  runner later against a schema that changed underneath it.

## Alternatives considered

1. **Do nothing; macOS stays manual-mode-only.** Honest but permanently
   excludes the second operator from producing agent-mode replay evidence,
   and leaves "runner-neutral" untested by any second runner.
2. **A separate macOS adapter package.** Violates the spirit of Decision 0004
   (one host-only adapter per host surface, Core never forked) by duplicating
   the Loa adapter for what is a profile-level difference.
3. **Loosen attestation on non-reference hosts.** Rejected outright: the
   floor is the floor. This proposal adds ports under the same floor, never a
   softer tier.

## Evidence expectations if accepted

Implementation evidence: port registry + bubblewrap/bedrock parity (existing
receipts byte-stable); seatbelt policy generator with its profile text under
digest. Validation evidence: replay runs per port pair. Sanction: explicit
authority decision per port pair, recorded per the capability contract. The
proposer's macOS host volunteers as the replay-evidence source for the
`seatbelt` + headless pair.

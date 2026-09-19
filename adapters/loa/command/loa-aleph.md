---
description: Run the installed Loa Aleph adapter against its immutable bundle.
argument-hint: start <files-or-directories...> | status [RUN-id] | resume <RUN-id> | validate <RUN-id>
---

Use the installed `loa-aleph` skill for this command. Forward `$ARGUMENTS`
unchanged to `.claude/aleph/bin/loa-aleph.mjs`. Treat its structured result as
authoritative adapter state, and do not replace a failed preflight, pinned
runtime, worker-isolation requirement, or human gate with an inferred fallback.

For cumulative 1.9 `orchestrator-work-transitions`, repeatedly resume the same
RUN-id and execute only the exact returned transport action. Accepted worker
bytes are reopened by the controller; this command and its skill never invoke
LedgerWriter or submit arbitrary assembly inputs or canonical after-images.
Honor explicit capability and unknown-dispatch halts. Fixture-simulated
execution remains visibly separate from native evidence.

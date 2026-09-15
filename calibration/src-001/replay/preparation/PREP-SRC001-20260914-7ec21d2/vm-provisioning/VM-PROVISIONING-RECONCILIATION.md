# Blind SRC-001 VM provisioning producer reconciliation

Status: BLOCKED_PREPARATION_VM_FACILITY.

The parent blocker remains BLOCKED_PREPARATION_ISOLATION. No producer
remediation or independent closure is claimed.

Windows enabled the Hyper-V feature family, but returned
`RestartNeeded: true`. A subsequent read-only check found a pending component
servicing reboot, no VMMS service, and no Get-VM/New-VM/Get-VHD commands.
The full VM facility is not operationally accepted. The producer stopped
before image acquisition or VM creation. Restarting the shared workstation
would interrupt unrelated work; no restart was performed or scheduled.
No substitute isolation boundary was used.

## Exact administration identities

Preparation: `PREP-SRC001-20260914-7ec21d2`.

Provisioning: `VM-PREP-SRC001-20260915-7a772f0`.
This is not a replay, run, attempt or Aleph execution identity.

Branch: `agent/src-001-blind-replay-preparation-20260914`.
Repository: `0xHoneyJar/loa-aleph`.

| Subject | Commit | Tree |
| --- | --- | --- |
| Required starting custodian state | `0d9b36d65c7131c0173f3f978177cc7ac5912021` | `50fd287a36db641c1d0f03fc8af735bc44416902` |
| Separate VM provisioning authority | `7a772f03492d5f76ccb238b69883f5a83c295695` | `c25e265eec5f247c05fc7ffa316f55dd43fb68f5` |
| Provisioning evidence checkpoint | `0ba51d59fdc829dd9badbfc217a281b6bf8cc021` | `dd28e59038610616c2c6b954ccc4dd3a42ea69e4` |
| Canonical merged-harness GitHub main | `8236b9f35c38cdd604b2389b42589f27755cdade` | `72075f93bc9fcb3c76f4480bc612693211efd240` |
| Generic release source | `c949ea5f39daef42d22ca2e4111164d63dffcbf1` | `8ced176e50da0d05070b164cfe725752df947d3f` |

The provisioning authority Git blob is
`914bc28483131a049269d59cb95b46fec139dcaa`.
Its exact human declaration is retained separately in
`../../../../core-design-basis/AUTHORIZED-blind-src-001-replay-vm-provisioning-20260915.md`
(repository path:
`calibration/src-001/core-design-basis/AUTHORIZED-blind-src-001-replay-vm-provisioning-20260915.md`).
The original preparation authority blob remains
`b9235f1bf02999b9630ed1b11da5941db1ee42a8`.

The containing final commit and tree cannot be embedded in their own bytes.
Resolve them through the normal commit containing this reconciliation and the
external final-head verification receipt described below. No history is
amended.

## Host facility and complete infrastructure mutation

Candidate: Microsoft Hyper-V full VM role on Microsoft Windows 10 Pro,
64-bit, version `10.0.19045`, build `19045`.
The host reported `HypervisorPresent=True`. PowerShell was
`5.1.19041.6456`; its executable was 455,680 bytes with file version
`10.0.19041.1 (WinBuild.160101.0800)`.
This is host information, not a guest environment.

Read-only discovery initially hit sandbox WSL socket denial and then Windows
non-administrator access denial. Ordinary UAC elevation completed the inventory.
The elevated HCS inventory listed only the existing WSL VM
`9F6C0AF1-DBF7-4732-A19D-424D475D3758`, and the protected Hyper-V configuration
directory was empty. That existing WSL VM was not reused or treated as an
executor. The initial absence assertion is bounded to the inspected stores,
facility inventory and unchanged custodian records, not universal forensics.

Exactly one host infrastructure mutation operation occurred:

```text
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-Hypervisor,Microsoft-Hyper-V-Services,Microsoft-Hyper-V-Management-PowerShell -All -NoRestart -LimitAccess -LogPath <task DISM log>
```

The exact executable script and log path are retained in
`evidence/hyperv-enablement-command.json`.
It ran through ordinary Windows UAC with administrator privilege from
`2026-09-15T16:49:28.1706610Z` to
`2026-09-15T16:49:47.3831086Z`. The command succeeded, exit 0, and returned
`RestartNeeded: true`. The complete ledger is `host-mutations.json`.

Windows changed all seven following entries from Disabled to Enabled:

- `Microsoft-Hyper-V-All`
- `Microsoft-Hyper-V`
- `Microsoft-Hyper-V-Tools-All`
- `Microsoft-Hyper-V-Management-PowerShell`
- `Microsoft-Hyper-V-Hypervisor`
- `Microsoft-Hyper-V-Services`
- `Microsoft-Hyper-V-Management-Clients`

This includes the dependency/parent effects of `-All`, including management
clients; it was not merely a PowerShell module installation. The original WSL
and VirtualMachinePlatform features remained Enabled. HypervisorPlatform
remained Disabled. VMCompute remained Running. The before/after network
adapter inventories were equal. No explicit host firewall, virtual switch,
network reset, WSL stop, Docker change or unrelated VM change occurred.

No rollback was performed. The ledger retains exact prior states; disabling
the newly enabled feature family would require impact review and may itself
require a restart. The producer did not remove infrastructure or schedule a
reboot.

The raw DISM log is 37,616 bytes, SHA-256
`b235aefb59ea84bd59061cc635d5ea645e31fe42de7cbad59497422360032fa1`.
It is preserved losslessly in
`evidence/hyperv-enablement-dism-log.json`.
Two raw Windows JSON receipts initially failed Git whitespace checks because
of CRLF. Their original bytes remain in explicit raw-byte envelopes alongside
LF readability projections. The initial failed check and the transformation
are preserved in `evidence/initial-staged-diff-failure.json` and
`evidence/storage-format-reconciliation.json`.

## Custody and work not performed

The exact original host custody directories were rehashed without exporting
or displaying semantic input content. Both locks and all eight retained
payload/provenance files matched their expected lengths and hashes.
The release wrapper remains distinct from its three canonical release files.

| Subject | Source identity | Transfer / executor state |
| --- | --- | --- |
| Frozen input custody | `sha256:f93e1665d25e1929fc1c7e5bf0908138b5a800372ef9ce2ee466e950c1cdf363` | No transfer |
| Release custody | `sha256:81173115520bcc6d3bd6ad80d6561392b28e2e330651f946f2901b67f0c284e1` | No transfer |
| Release archive, 8,126,590 bytes | `sha256:4bd8d27648ad1480601a0d4d31653297581ed354c95c0ab978fabb2d2ce3537c` | No guest verification or installation |
| Expected generic bundle | `sha256:e83ab57e971f2d508fe2b42139cd122b9fd70b9b309574efd10307ff6795c909` | No installed executor bundle |

Exact per-file source identities, paths, lengths and modes are in
`evidence/initial-custody-verification.json`, `input-transfer.json` and
`release-transfer.json`. The final verification procedure rechecks those
unchanged source custody bytes. No after-transfer identity is fabricated.
Original criteria remain provenance-only in their existing host custody.

| Required executor subject | Actual result |
| --- | --- |
| Base image source/version/length/SHA/signature/checksum | NOT ACQUIRED; no image selected or integrity verification attempted |
| Fresh VM ID/configuration/CPU/memory/NIC/switch/firmware | NOT CREATED |
| Fresh volume ID/size/base relation | NOT CREATED |
| Guest OS/kernel/account/UID/GID/groups/home/shell/sudo | NOT ESTABLISHED |
| Guest Node, shell and tool identities | NOT ESTABLISHED |
| Offline release verification and installation inventory | NOT RUN |
| Effective mounts, writable roots, channels/sockets/FDs | NOT INVENTORIED; no guest |
| Guest session and credential absence proof | NOT TESTED; no guest or credential transfer |
| Enforced production visibility | NOT ESTABLISHED |
| Closed-reference and developer-repo nonvisibility | No transfer/access; guest denial proof NOT RUN |
| Synthetic negative-access probes | All ten families NOT RUN |
| Guest provisioning network and teardown | NOT CREATED / NOT APPLICABLE |
| Guest final network boundary and forbidden-route tests | NOT ESTABLISHED / NOT RUN |
| Provider/model connectivity | NOT TESTED; NOT AUTHORIZED |
| Future provider endpoint allowlist | DEFERRED until exact configuration is known |
| Attempt-scoped environment and other records | All 32 remain DEFERRED |

`negative-access-probes.json` names the unexecuted host-path, developer-repo,
reference-path, user-home, host-drive, management-socket, Docker-socket,
network-destination, mount and environment-marker probe families. No synthetic
canary was created. No synthetic result is substituted for actual VM evidence.
`visibility-enforcement.json` clearly distinguishes future logical roots from
enforced roots. `pre-attempt-environment.json` is administration, not an
attempt-schema instance, and contains no replay ID.

## Operation accounting and findings

Each of the following real-operation counts is **0**:
host attestation; genuine capability receipts; model/provider calls; native
worker dispatch; SRC-001 `/loa-aleph start`, `resume` and `validate`;
replay IDs; run IDs; attempt IDs; answer-member access; reference comparison;
mapping; scoring; F-03 repair; generic code change; intent-fidelity;
image acquisition; VM creation; volume creation; custody transfer; guest
installation; PR creation; merge; host reboot.

These are producer operation counts supported by retained receipts and the
scoped command history, not instrumented host-wide counters. Authorized
generic regression fixtures may create synthetic IDs and simulated host
data; those do not count as real SRC-001 operations or evidence of F-03
reachability. This task adds no production substitute or generic repair.

PA-01 and PA-02 remain CLOSED by the human-supplied fresh independent custodian
audit, `CUSTODIAN_PREPARATION_AUDIT_PASS`. The historical custodian producer
records remain unchanged. PA-03, PA-04 and PA-05 remain LATER-NONBLOCKING.
F-03, F-04 and F-05 remain OPEN / MUST PRESERVE; F-05 is bounded by F-03.
F-03 remains the unproven accepted-worker-return to production
orchestrator/LedgerWriter canonical mutation handoff.

`findings-preserved.json` retains every carried Slice finding, all eight
earlier harness observations, and the two additional LATER-NONBLOCKING audit
observations about packaging run-format documentation and stale local refs.
No packaging documentation or local main ref was repaired.

## Repository verification, publication and audit subject

Only the separate authority, this new provisioning administration directory,
and repository-administration manifest entries may change. Core, checker,
adapters, runtime-js, packaging, harness, protocol/schemas, public command,
run format, old preparation/custody records and F-03 remain unchanged.
The adapter branch, stash, and four detached/prunable worktree registrations
remain preserved. The pre-existing empty Slice 7 probe is not a replay run.

The staged evidence checkpoint passed `git diff --check` and Core-boundary
validation after raw-byte retention. Those checks do not establish VM
isolation or execution readiness.

Run `verification-plan.json` after this final reconciliation commit. It
requires full `npm test`, runtime drift, replay-protocol verification, harness
typecheck and suite, repeatability, custody/inventory closure, changed-path
closure and protected-identity checks. It excludes genuine attestation and
model/provider/native replay operations.

Retain exact final HEAD/tree, command outputs, checks, repeatability,
repository/custody preservation and normal push result in a new external
receipt directory:

```text
/home/eileenspectremoon/loa-dev/aleph-calibration/SRC-001/replay-preparation/PREP-SRC001-20260914-7ec21d2/vm-provisioning/VM-PREP-SRC001-20260915-7a772f0/final-head-<final-commit>/
```

The final report must give its actual locator and identities. Do not describe
unrun final checks as passing. Push only the existing preparation branch,
without force, PR creation or merge.

Fresh independent audit subject: the normal commit range
`0d9b36d65c7131c0173f3f978177cc7ac5912021..<final-published-head>`,
the committed provisioning package, the external exact-final-head receipt,
and the retained Windows infrastructure state. A user-controlled Windows
restart and fresh mechanical facility checks are prerequisites for resuming
provisioning. They do not grant attestation or replay execution authority.

BLIND SRC-001 EXECUTOR ISOLATION PREPARATION BLOCKED — NO ATTESTATION OR REPLAY EXECUTION AUTHORIZED

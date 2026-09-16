# Blind SRC-001 Hyper-V restart continuation authority

Declaration date label: 2026-09-15. Post-boot observation and recording:
2026-09-16.

Status: AUTHORIZED — HUMAN RESTART AND EXISTING PROVISIONING CONTINUATION ONLY.

Decision class: repository administration. No new execution authority exists.
The human authorized one user-controlled Windows restart. The restart itself
does not authorize replay. Existing VM-provisioning authority may resume only
after all required post-boot repository, custody and operational facility
gates pass.

## Exact binding

Repository: `0xHoneyJar/loa-aleph`.

Branch: `agent/src-001-blind-replay-preparation-20260914`.

Preparation: `PREP-SRC001-20260914-7ec21d2`.

Provisioning: `VM-PREP-SRC001-20260915-7a772f0`.

| Subject | Commit | Tree |
| --- | --- | --- |
| Required pre-restart and observed continuation starting state | `da7bb0c1f90170f50f1790833555e328342bbb03` | `dee41308901f14dc9f0d1cb524c05a4a76f0d4f9` |
| Existing VM-provisioning authority | `7a772f03492d5f76ccb238b69883f5a83c295695` | `c25e265eec5f247c05fc7ffa316f55dd43fb68f5` |
| Canonical merged-harness GitHub main | `8236b9f35c38cdd604b2389b42589f27755cdade` | `72075f93bc9fcb3c76f4480bc612693211efd240` |
| Generic release source | `c949ea5f39daef42d22ca2e4111164d63dffcbf1` | `8ced176e50da0d05070b164cfe725752df947d3f` |

The existing authority is
`AUTHORIZED-blind-src-001-replay-vm-provisioning-20260915.md`, unchanged Git
blob `914bc28483131a049269d59cb95b46fec139dcaa`.
The original preparation authority remains unchanged Git blob
`b9235f1bf02999b9630ed1b11da5941db1ee42a8`.
The provisioning authority is an ancestor of the starting checkpoint;
the checkpoint's immediate parent is
`0ba51d59fdc829dd9badbfc217a281b6bf8cc021`.

## Human authority declaration — verbatim

```text
I authorize one user-controlled Windows restart required to complete activation of the Hyper-V facility already enabled under Blind SRC-001 Replay provisioning authority for preparation PREP-SRC001-20260914-7ec21d2. This restart is authorized solely so that the existing provisioning work at branch head da7bb0c1f90170f50f1790833555e328342bbb03 can resume after boot and re-verify whether the adopted full-VM boundary is operational. After restart, the existing VM-provisioning authority may continue within its previously authorized scope, but only after re-verifying the exact repository head/tree, canonical main, custody identities, Hyper-V feature state, VMMS state, and Hyper-V management cmdlets. This restart authority does not authorize host attestation, genuine capability receipts, provider or model calls, native worker dispatch, /loa-aleph start/resume/validate on SRC-001, creation of replay/run/attempt IDs, semantic replay, closed-reference answer access or comparison, F-03 repair, generic code changes, Docker/bubblewrap/ordinary WSL substitution, PR creation, or merge. If Hyper-V remains unavailable or any pinned identity differs after restart, provisioning must stop again with no fallback.
```

## Historical checkpoint retained

The prior enablement operation ran from `2026-09-15T16:49:28.1706610Z`
through `2026-09-15T16:49:47.3831086Z`, exited 0, and reported
`RestartNeeded: true`. Seven Hyper-V feature-family entries changed from
Disabled to Enabled; WSL and VirtualMachinePlatform remained Enabled.
VMMS was absent and the management facility was not operational.
No VM, guest volume, image, switch, executor installation, attestation or
replay/run/attempt identity existed. The producer neither performed nor
scheduled a restart in that pre-restart work.

The historical state remains `BLOCKED_PREPARATION_VM_FACILITY` and:

```text
BLIND SRC-001 EXECUTOR ISOLATION PREPARATION BLOCKED — NO ATTESTATION OR REPLAY EXECUTION AUTHORIZED
```

This record does not rewrite that historical outcome.

## Mechanically observed post-boot gates

Windows `Win32_OperatingSystem.LastBootUpTime`, converted to UTC, was
`2026-09-16T10:18:36.5291700Z`. The first observation was
`2026-09-16T15:57:32.8968213Z`; the elevated inventory independently returned
the same boot time. The observed boot is strictly later than the retained
enablement completion. This proves a subsequent boot, not a precise
shutdown/restart initiation timestamp or a host-wide count of intervening
restarts. The restart is attributed to the external user-controlled
operation, never to Astra.

Windows: Microsoft Windows 10 Pro, 64-bit, version `10.0.19045`, build
`19045`, host `DESKTOP-F2SON4Q`, `HypervisorPresent=true`.
WSL reports default distribution Ubuntu, default version 2;
Ubuntu Running/version 2 and docker-desktop Stopped/version 2.
These describe the host environment, not an executor or a substitute boundary.

Before this record, the working tree was clean and branch/HEAD/tree matched
the table. Live `git ls-remote origin` completed at
`2026-09-16T15:57:32.941801+00:00`, returning the exact preparation checkpoint
and canonical main above. No unexpected remote commit appeared.
All 103 retained custodian files were byte/blob-identical. Generic executable
paths were unchanged from canonical main. The adapter branch remains
`b9e2db742a087b8ae659ec39e476ed5e240cfa1f`, stash remains
`e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8`, and all four detached/prunable
worktree registrations remain unchanged.

Existing custody was rehashed without regeneration, extraction or semantic
content display. Exact directory membership, all ten retained files,
lengths, modes and ownership matched:

| Custody subject | SHA-256 |
| --- | --- |
| Input custody | `f93e1665d25e1929fc1c7e5bf0908138b5a800372ef9ce2ee466e950c1cdf363` |
| Release custody | `81173115520bcc6d3bd6ad80d6561392b28e2e330651f946f2901b67f0c284e1` |
| Release archive, 8,126,590 bytes | `4bd8d27648ad1480601a0d4d31653297581ed354c95c0ab978fabb2d2ce3537c` |

The elevated read-only facility inventory ran from
`2026-09-16T16:00:35.3879480Z` through
`2026-09-16T16:00:40.2962108Z`, with administrator privilege and
`READ_ONLY_GATE_COMPLETE`. Its process exit was 0.

| Feature | Post-boot state |
| --- | --- |
| Microsoft-Hyper-V-All | Enabled |
| Microsoft-Hyper-V | Enabled |
| Microsoft-Hyper-V-Tools-All | Enabled |
| Microsoft-Hyper-V-Hypervisor | Enabled |
| Microsoft-Hyper-V-Services | Enabled |
| Microsoft-Hyper-V-Management-PowerShell | Enabled |
| Microsoft-Hyper-V-Management-Clients | Enabled |
| VirtualMachinePlatform | Enabled |
| Microsoft-Windows-Subsystem-Linux | Enabled |
| HypervisorPlatform | Disabled |

VMMS exists and is Running, Auto, LocalSystem. VMCompute is Running, Manual.
Hyper-V modules 2.0.0.0 and 1.1 are available.
`Get-VM`, `New-VM`, `Get-VHD`, `Get-VMHost` and `Get-VMSwitch` resolve from
Hyper-V 2.0.0.0. Elevated `Get-VM`, `Get-VMHost`, `Get-VMSwitch` and the
virtualization namespace queries succeed. The registered VM inventory is
empty. `New-VM` was not invoked before this authority commit; `Get-VHD`
resolved but no registered VM disk existed to inspect. Actual creation/disk
operation remains part of provisioning, not a result claimed by this gate.

Existing switches: Default Switch
`c08cb7b8-9b3c-408e-8e30-5e16a3aeb444`; WSL
`91a928b4-1cdd-4d04-ba29-1c8b255a0d53`. Neither was modified.
Host enhanced-session capability is enabled; this is an observed host
setting, not permission to use convenience channels in the future guest.
No infrastructure mutation has been performed by this continuation.

Read-only retries remain visible: sandbox Windows socket denial;
non-administrator feature/VM access denial; a first elevated child returned
no receipt; a file-based elevated retry returned a complete inventory.
The successful receipt supersedes those checks only for current facility
observation. Their failures are retained.

Repository, custody, restart-observed and read-only operational facility
gates pass with the explicit cmdlet limits above. This permits the existing
bounded provisioning work after this record is separately committed.
It does not prove an executor, isolation, visibility, attestation readiness
or replay capability.

## Evidence and continuation limits

The following observed receipts are retained for the subsequent continuation
evidence commit beneath
`../replay/preparation/PREP-SRC001-20260914-7ec21d2/vm-provisioning/post-restart-20260916/`.
Their current staging directory is
`/tmp/src001-postrestart-continuation-20260916/`.

| Receipt | Bytes | SHA-256 |
| --- | --- | --- |
| windows-boot.json | 1315 | `7f6b06dd21aeb35fd32f7521a088c5bff26a4791f22b8a38cce8518416abb94e` |
| repository-gate.json | 6342 | `a81768dadb1d7e89a12fd219ea0de81bf4a07b2ba93864ac9e3c9dc5eeb4c68d` |
| custody-gate.json | 5768 | `2019ac4fe5964fc791e67b4cebd81105703487ea6aa1e8a5e17432cc004147aa` |
| windows-elevated-result-normalized.json | 9464 | `50baa0b2a17682dda92fbc9c8534d11b47fde12285a4e486a2d9e42461b9dc32` |

Append host chronology and reconciliation without rewriting failed historical
records. Preserve F-03/F-04/F-05 OPEN / MUST PRESERVE, F-05 bounded by F-03;
PA-01/PA-02 CLOSED by the fresh independent custodian audit;
PA-03/PA-04/PA-05 LATER-NONBLOCKING, and all carried findings.
Keep attempt-scoped records deferred. Provider connectivity remains
`NOT_TESTED_NOT_AUTHORIZED`.

If mechanical provisioning succeeds, only
`PRODUCER_REMEDIATED_NOT_INDEPENDENTLY_CLOSED` may be recorded by this producer.
A fresh independent Claude audit remains required before any separately
granted attestation authority. No attestation or replay execution is
authorized by this restart or its continuation.

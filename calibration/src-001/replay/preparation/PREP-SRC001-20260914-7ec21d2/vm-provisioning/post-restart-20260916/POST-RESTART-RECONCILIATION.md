# Blind SRC-001 post-restart provisioning continuation

Current status: **BLOCKED_PREPARATION_VM_PROVISIONING**.

The Windows restart and Hyper-V facility gates passed. One fresh VM and one
fresh VHDX were created from a publisher-verified immutable minimal image.
The guest kernel panicked before mounting its root filesystem. No successful
guest session, custody transfer, release verification, installation or
mechanical isolation proof occurred. The failed VM is retained **Off**, with
its NIC disconnected and provisioning DVD device absent.

This continuation does not grant attestation or replay execution authority.
The isolation finding remains OPEN, not producer-remediated or independently
closed. The kernel panic establishes the observed boot failure; its underlying
cause remains UNDETERMINED. No different boundary or image was substituted,
no second VM was created, and no image/guest boot repair was performed.

## Exact administration and restart identity

Repository: `0xHoneyJar/loa-aleph`.
Branch: `agent/src-001-blind-replay-preparation-20260914`.
Preparation: `PREP-SRC001-20260914-7ec21d2`.
Provisioning: `VM-PREP-SRC001-20260915-7a772f0`.

| Subject | Commit | Tree |
| --- | --- | --- |
| Pre-restart and continuation starting checkpoint | `da7bb0c1f90170f50f1790833555e328342bbb03` | `dee41308901f14dc9f0d1cb524c05a4a76f0d4f9` |
| Existing VM-provisioning authority | `7a772f03492d5f76ccb238b69883f5a83c295695` | `c25e265eec5f247c05fc7ffa316f55dd43fb68f5` |
| Separate restart-authority record | `f8ec99faed3d816f2ba82b069d78e2179f409997` | `4899ec15eda3b16716817989e36663fc5c61554d` |
| Canonical merged-harness GitHub main | `8236b9f35c38cdd604b2389b42589f27755cdade` | `72075f93bc9fcb3c76f4480bc612693211efd240` |
| Generic release source | `c949ea5f39daef42d22ca2e4111164d63dffcbf1` | `8ced176e50da0d05070b164cfe725752df947d3f` |

Restart-authority Git blob: `c9ddc68f2e7970ddaddb386dd8d072d13a558d03`.
The full human declaration is preserved verbatim in
`calibration/src-001/core-design-basis/AUTHORIZED-blind-src-001-replay-hyperv-restart-continuation-20260915.md`.
Its separate commit preceded image acquisition, volume creation and VM creation.
Only its administration manifest entry accompanied that commit.

The observed Windows boot was **2026-09-16T10:18:36.5291700Z**. It is later
than retained Hyper-V enablement completion
`2026-09-15T16:49:47.3831086Z`. `Win32_OperatingSystem.LastBootUpTime` returned
the same time in the initial and elevated post-boot queries. The first
observation was `2026-09-16T15:57:32.8968213Z`.
This observes a subsequent boot, not a precise shutdown/restart initiation
instant or an instrumented host-wide count of intervening reboots.
The restart is the external user-controlled operation, not an Astra action.

Windows: Microsoft Windows 10 Pro, 64-bit, version `10.0.19045`, build `19045`,
host `DESKTOP-F2SON4Q`, `HypervisorPresent=true`.
WSL: default Ubuntu, default version 2; Ubuntu Running/version 2;
docker-desktop Stopped/version 2. These are host observations, not an executor.

The starting branch/HEAD/tree and clean working tree matched exactly.
Live GitHub reads returned the exact preparation checkpoint and canonical main;
no unexpected remote commit appeared. The original preparation authority blob
`b9235f1bf02999b9630ed1b11da5941db1ee42a8`, provisioning authority blob
`914bc28483131a049269d59cb95b46fec139dcaa`, all 103 custodian files, protected
adapter branch `b9e2db742a087b8ae659ec39e476ed5e240cfa1f`, stash
`e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8`, and four retained detached/prunable
worktree registrations matched. No main ref, stash or unrelated worktree was repaired.

The containing final commit/tree cannot be embedded in this file's own bytes.
Resolve them from the final normal continuation commit and the exact-head
external verification receipt specified in `verification-plan.json`.

## Historical pre-restart outcome remains intact

The historical state remains `BLOCKED_PREPARATION_VM_FACILITY`.
Enablement exited 0 with `RestartNeeded=true`; seven Hyper-V feature-family
entries changed Disabled to Enabled, WSL and VirtualMachinePlatform stayed
Enabled, VMMS was absent, and management cmdlets were not operational.
No VM, volume, image, switch, executor installation, attestation or real
replay/run/attempt ID existed in that historical work. No restart was
performed or scheduled by the producer.

The original host ledger is retained byte-for-byte in
`pre-restart-host-mutations.json`; its original operation object is unchanged
in the appended parent ledger. Historical preparation/current-state/inventory
files retain their old results. This explicitly dated continuation supplies
the new current state. Parent reconciliation is extended with a pointer;
its pre-existing bytes are a preserved prefix.

## Facility acceptance and host configuration

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

VMMS exists, Running, Automatic/LocalSystem. VMCompute is Running, Manual.
Hyper-V 2.0.0.0 and 1.1 modules are available. `Get-VM`, `Get-VMHost` and
`Get-VMSwitch` succeeded under Windows administrator elevation; `New-VM`
subsequently created exactly one VM and `Get-VHD` successfully read the
converted and final disk. The virtualization namespace is operational.
This accepts the **facility observation only**, not guest provisioning,
visibility, isolation, native capability or replay readiness.

`Get-VMHost` reports 16 logical processors, 34,268,889,088 bytes memory,
VM storage default `C:\ProgramData\Microsoft\Windows\Hyper-V`, disk default
`C:\ProgramData\Microsoft\Windows\Virtual Hard Disks`, migration disabled,
and host enhanced-session capability enabled. Host settings were preserved;
no enhanced-session connection, clipboard, file sharing or xrdp setup occurred.

The initial Hyper-V VM inventory was empty. Existing switches were:
Default Switch `c08cb7b8-9b3c-408e-8e30-5e16a3aeb444` and WSL
`91a928b4-1cdd-4d04-ba29-1c8b255a0d53`, both Internal with host management access.
Neither switch was modified; no new switch or global network reset occurred.
The existing Default Switch supported temporary provisioning because the
final pre-execution plan removes connectivity; it was never claimed to enforce
an execution allowlist. Task storage is on D: under
`D:\LoaAlephPreparation\VM-PREP-SRC001-20260915-7a772f0`.

## Pinned base image and failed guest

Distribution/image: Ubuntu Minimal 24.04 LTS Noble Numbat, amd64,
Canonical released build **20260905**.
Source and observed final URL:

```text
https://cloud-images.ubuntu.com/minimal/releases/noble/release-20260905/ubuntu-24.04-minimal-cloudimg-amd64.img
```

Length: **264,372,224 bytes**.
SHA-256: `46b0dbaffa6950a7da5ff2dc5ed34c46084610b3b6d1fae8f1ec2d7e953984a3`.
Acquired with curl from `2026-09-16T16:04:47.372808+00:00` through
`2026-09-16T16:06:16.815632+00:00`.
The dated directory's `SHA256SUMS.gpg` verified with `gpgv`, GOODSIG and VALIDSIG,
against the distribution-owned cloud image keyring, package
`ubuntu-keyring 2023.11.28.1`, whose package integrity check passed.
Signing fingerprint: `D2EB44626FDDC30B513D5BB71A5D6C4C7DB87C81`,
UEC Image Automatic Signing Key `<cdimage@ubuntu.com>`.
`publisher-verification-material.json` retains checksum text, detached signature,
public keyring bytes and image package manifest. No mutable tag alone was used.

The QCOW2 image was converted with temporary, locally extracted Ubuntu
`qemu-img 8.2.2` tooling. The original and converted virtual disk sectors
compared identical before resizing. No global package install occurred.
The immutable base image remains unchanged outside Git. The guest disk is a
separate mutable provisioning artifact, not a replacement custody identity.

| VM/volume field | Exact observed value |
| --- | --- |
| VM UUID | `d5913cd7-aa99-4695-96b7-0d0135bad386` |
| VM name | `SRC001-PREP-7a772f0` |
| Generation / configuration version | 2 / 9.0 |
| CPU / fixed memory | 2 / 2,147,483,648 bytes; dynamic memory disabled |
| Secure Boot | On / `MicrosoftUEFICertificateAuthority` |
| Automatic start / stop | Nothing / ShutDown |
| Checkpoints | Disabled; automatic checkpoints false |
| NIC ID | `Microsoft:D5913CD7-AA99-4695-96B7-0D0135BAD386\3EA36DE1-C841-4CAA-860D-CC0A0463F24C` |
| MAC | `00155D32E600` |
| NIC protections | MAC spoofing Off; DHCP guard On; router guard On; teaming Off |
| Final NIC / switch | Disconnected; SwitchId and SwitchName null |
| Final DVD | Device absent |
| Integration | Heartbeat and Shutdown enabled; Guest Service Interface, KVP, time sync and VSS disabled |
| Disk identity | `28DF27FB-300D-7947-BA55-44BCE3ABF0CD` |
| Disk format / type / parent | VHDX / Dynamic / none |
| Guest disk size | 17,179,869,184 bytes, expanded from 3,758,096,384 |
| Host VHDX file length after shutdown | 931,135,488 bytes |
| VHDX SHA-256 after shutdown | `5905c60cbc24b769af5dff0d79c21093ad523e652a6e8012c8b051b777bfefbb` |
| Disk path | `D:\LoaAlephPreparation\VM-PREP-SRC001-20260915-7a772f0\vm\executor.vhdx` |
| Final VM state | Off |

The firmware booted a Linux kernel, which reported:

```text
/dev/root: Can't open blockdev
Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)
```

`guest-boot-console.png` is a VM-only Hyper-V framebuffer capture, not a
workstation screenshot. Host heartbeat was No Contact and both the first
SSH attempt and Windows TCP probe failed. The observed image provenance
contains kernel package versions, but no guest `uname`, root mount or user
inventory succeeded. The requested `executor` UID 1001 in the private NoCloud
seed is **not** proof that the account was created. Fresh SSH bootstrap keys
are preparation-only secrets, remain outside Git, and are not developer or
provider credentials. They were never used for a successful guest session.

The first containment pass powered off the VM, then encountered a cmdlet
parameter error. A separate retry disconnected the NIC and ejected media;
its cached DVD snapshot still showed the old ISO path. A subsequent fresh
VMName query observed null media, then removed the task DVD device and
asserted its absence. All failed and corrective receipts are retained.
Final containment is mechanically verified, not inferred from success text.

## Custody, inventories and deferred work

| Subject | Source identity | Guest result |
| --- | --- | --- |
| Input custody | `sha256:f93e1665d25e1929fc1c7e5bf0908138b5a800372ef9ce2ee466e950c1cdf363` | NOT TRANSFERRED; no guest identity |
| Release custody | `sha256:81173115520bcc6d3bd6ad80d6561392b28e2e330651f946f2901b67f0c284e1` | NOT TRANSFERRED; no guest identity |
| Release archive, 8,126,590 bytes | `sha256:4bd8d27648ad1480601a0d4d31653297581ed354c95c0ab978fabb2d2ce3537c` | NOT VERIFIED OR INSTALLED IN GUEST |

Both existing custody locks and all ten retained files matched byte lengths,
SHA-256, modes, ownership and exact directory membership. No custody was
regenerated from mutable sources. The original criteria remain host
provenance only. No repository, `.git`, reference archive, answer material,
calibration adjudication, prior result, semantic audit or intent-fidelity
material was transferred.

Expected generic release digests remain:

| Surface | SHA-256 |
| --- | --- |
| Core | `ffec13a039d00a43b9b1e411daf0badd99f65f4bbd54af176146a98779ff124c` |
| Loa adapter | `fa38c4556f80afdd8227e5e4e0e3f37af2d8d33ead5f3669f6f3a51e5cf6916f` |
| Checker | `214c0ed2448f9200242cbba7ec6f71f454b24a1818ee090aa593911368f2496e` |
| Payload | `276addb59829cd4735293c34e0fc1877cdcd221b3d01fd7bf6c758838c9e6572` |
| Bundle | `e83ab57e971f2d508fe2b42139cd122b9fd70b9b309574efd10307ff6795c909` |
| Internal lock | `71a9b04124d117853922e948edae5c85019a330a337a1ecf89b6ca8f9071e963` |

Offline installation: NOT RUN. Installed release inventory: NOT INSTALLED.
Mount inventory, writable paths, channels/sockets, session/environment,
guest credential absence, guest interfaces/routes/DNS/gateways/firewall and
execution-user visibility: **NOT ESTABLISHED / NOT RUN**.
Reference/developer nonvisibility has no guest denial proof; no transfer occurred.
No cognitive-blindness claim is made.

All ten negative-access probe families remain **NOT RUN**: synthetic forbidden
host path; developer repository host path; closed-reference custody host path;
user-home host path; host-drive `/mnt/c`; management socket; Docker socket;
unapproved mount; unapproved network destination; forbidden session/environment
marker. No canary was created and no real answer material was used.

Provisioning used the existing Default Switch. Its host address was
`172.29.16.1/20`; the seed requested `172.29.16.101/20`, gateway and DNS
`172.29.16.1`, but guest realization was not observed. No guest provisioning
package traffic was established. The host acquired the pinned image and
Ubuntu helper packages and attempted guest TCP/SSH. Final host-side containment
is enforced; it is not a verified guest firewall or execution network policy.
Provider connectivity remains **NOT_TESTED_NOT_AUTHORIZED**.

All 32 attempt-scoped records remain deferred. No `/replay/attempts/...`, S0,
execution-mode attempt record, real replay ID, run ID or attempt ID was created.

## Operation counts and findings

These counts apply to this continuation and are supported by scoped command
receipts. They are not instrumented host-wide counters. Generic authorized
regression fixtures may create synthetic IDs and simulated capabilities;
those are not real SRC-001 operations or F-03 reachability proof.

| Operation | Count |
| --- | ---: |
| answer_member_access | 0 |
| attestation | 0 |
| custody_transfer | 0 |
| external_post_enablement_boot_observations | 1 |
| f03_repair | 0 |
| generic_code_change | 0 |
| genuine_capability_receipts | 0 |
| global_network_reset | 0 |
| global_package_installation | 0 |
| guest_installation | 0 |
| host_infrastructure_mutation_operations | 9 |
| host_reboot | 0 |
| image_acquisition | 1 |
| intent_fidelity | 0 |
| loa_aleph_resume_src001 | 0 |
| loa_aleph_start_src001 | 0 |
| loa_aleph_validate_src001 | 0 |
| merge | 0 |
| model_provider_calls | 0 |
| native_worker_dispatch | 0 |
| pr_creation | 0 |
| real_attempt_ids | 0 |
| real_replay_ids | 0 |
| real_run_ids | 0 |
| reference_comparison | 0 |
| reference_mapping | 0 |
| reference_scoring | 0 |
| successful_guest_sessions | 0 |
| synthetic_negative_access_probes | 0 |
| virtual_switch_creation | 0 |
| virtual_switch_modification | 0 |
| vm_creation | 1 |
| volume_creation | 1 |

The nine producer infrastructure groups are fresh volume/seed creation,
disk resize, VM creation, VM configuration, VM boot, failed-VM power-off,
NIC disconnect, seed-media ejection and DVD-device removal. Exact commands,
privileges, before/after results and timestamps are retained in receipts and
the appended host ledger. Tool downloads, image acquisition/retention, evidence
files and observer-process failures are separately recorded administrative
side effects. No rollback, deletion of retained artifacts, host reboot,
unrelated VM/switch change or global network reset was performed.

F-03, F-04 and F-05 remain OPEN / MUST PRESERVE; F-05 remains bounded by F-03.
PA-01 and PA-02 remain CLOSED by the human-supplied fresh independent custodian
audit. PA-03, PA-04 and PA-05 remain LATER-NONBLOCKING. Every earlier harness
and Slice finding is preserved, including the bounded accounting observation.
No generic documentation staleness, adapter/Core code, or F-03 was repaired.
No PR was created and no merge occurred.

## Verification and proposed independent audit subject

The authority-only commit passed diff hygiene and Core-boundary validation.
The final continuation commit must run `verification-plan.json`: diff hygiene,
Core-boundary, runtime drift, protocol verification, harness typecheck/suite,
deterministic repeatability, full `npm test`, inventory/changed-path closure,
custody and protected identity checks, plus live canonical GitHub main.
Results are not asserted in advance. Store exact final commit/tree and test
receipts outside Git, then push only this existing preparation branch normally.
No force push, PR or merge is permitted.

Proposed fresh independent Claude audit subject: the exact published normal
range `da7bb0c1f90170f50f1790833555e328342bbb03..<final-head>`, this continuation,
the earlier provisioning authority/evidence, exact-final-head verification
receipts, unchanged custody, signed image identity, retained failed VM/VHDX,
VM-only console failure and final host containment. The broader provisioning
lineage remains `0d9b36d65c7131c0173f3f978177cc7ac5912021..<final-head>`.
The audit should assess this bounded blocked state and preservation; it cannot
close unperformed guest installation or isolation verification. An independent
audit does not itself grant attestation or replay authority.

BLIND SRC-001 EXECUTOR ISOLATION PREPARATION BLOCKED — NO ATTESTATION OR REPLAY EXECUTION AUTHORIZED

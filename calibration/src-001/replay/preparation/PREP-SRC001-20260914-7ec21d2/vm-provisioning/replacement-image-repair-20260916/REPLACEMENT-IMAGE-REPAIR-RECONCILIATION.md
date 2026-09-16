# Blind SRC-001 replacement-image repair reconciliation

Status: **BLOCKED_PREPARATION_VM_PROVISIONING**. One replacement VM was created;
its sole start request failed at Hyper-V host memory allocation (`0x8007000E`)
before the guest kernel ran. No retry, memory change, image fallback, or further
provisioning followed. Both VMs are OFF with disconnected NICs. Isolation is
OPEN / NOT REMEDIATED; no producer or independent closure is claimed.

Preparation: `PREP-SRC001-20260914-7ec21d2`.
Provisioning: `VM-PREP-SRC001-20260915-7a772f0`.
Repair administration: `IMAGE-REPAIR-SRC001-20260916-fda0a0b`.
Repository: `0xHoneyJar/loa-aleph`.
Branch: `agent/src-001-blind-replay-preparation-20260914`.

| Identity | Commit | Tree |
| --- | --- | --- |
| Starting blocked checkpoint | `d763299661c5887018b1cf250860e84042bd0cfd` | `856a931f871e67871cc1d7d80f602803aea5c682` |
| Separate human repair authority | `fda0a0b9803d1d96a0aee5c6899d7ba7bd1f9220` | `309c3b878e624c52f7752e66b058e379e34717aa` |
| Candidate pin | `955a07b1d3ffb80a7f56fe33a09d79d1e86f257b` | `4fdb1a46181d79ca7a24512a3617cb0969739024` |
| Replacement failure and containment | `80957b521b8b869edb5a990d3bcadf14e34a0311` | `b44987c53472c14d08b05e821ae40e1b7d8700ea` |
| Canonical merged-harness main | `8236b9f35c38cdd604b2389b42589f27755cdade` | `72075f93bc9fcb3c76f4480bc612693211efd240` |
| Generic release source | `c949ea5f39daef42d22ca2e4111164d63dffcbf1` | `8ced176e50da0d05070b164cfe725752df947d3f` |

Authority blob: `7af701fb719fe769842ea43e1226999426077480`.
The separate authority record preserves the declaration verbatim and supersedes
only the failed Minimal-image requirement and the one-VM limit to permit one
replacement while retaining the original. Generation 2, UEFI, Secure Boot,
MicrosoftUEFICertificateAuthority, synthetic storage, Ubuntu 24.04 LTS,
publisher identity and isolation constraints remain intact.

The final reconciliation commit is the commit containing this document.
Its exact HEAD/tree, final test results and normal-push receipt are retained
outside Git under the exact `final-head-<commit>` directory specified in
`verification-plan.json`. No self-referential commit hash or future test PASS
is fabricated in this committed document.

The complete [candidate matrix](candidate-matrix.json) includes all ten
materially considered products. Comparison scope is current released Canonical
Ubuntu 24.04 amd64 variants; size is publisher artifact bytes. This is not a
claim to the smallest historical artifact across all superseded builds.

| Product | Build | Bytes | Disposition |
| --- | --- | ---: | --- |
| Minimal root.tar.xz | 20260905 | 117884936 | REJECTED_NO_UEFI |
| Minimal squashfs | 20260905 | 142630912 | REJECTED_NO_UEFI |
| Server root.tar.xz | 20260911 | 229233708 | REJECTED_NO_UEFI |
| Historical Minimal QCOW2 | 20260905 | 264372224 | REJECTED_NO_HYPERV_EARLY_STORAGE |
| Server squashfs | 20260911 | 279617536 | REJECTED_NO_UEFI |
| Server tar.gz | 20260911 | 545430339 | REJECTED_NO_UEFI |
| Server VMDK | 20260911 | 594127360 | SELECTED |
| Server OVA | 20260911 | 594145280 | REJECTED_OTHER: larger |
| Server Azure VHD tar.gz | 20260911 | 604335173 | REJECTED_OTHER: larger |
| Server QCOW2 | 20260911 | 625256960 | REJECTED_OTHER: larger |

Only the Server tar.gz and VMDK were newly acquired for inspection. The tar
contains exactly a README and an unpartitioned ext4 filesystem; Canonical's
README agrees. Its real initramfs does not supply the missing UEFI disk layout.
The root-only products would require custom image construction. No larger
product's runtime suitability is claimed merely from its filename.

Selected publisher source:
`https://cloud-images.ubuntu.com/releases/noble/release-20260911/ubuntu-24.04-server-cloudimg-amd64.vmdk`.
Ubuntu Server 24.04 LTS Noble, amd64, VMDK streamOptimized, build `20260911`.
Publisher bytes: **594127360**. SHA-256:
`c1655a37ff4141e4f16effb7364a640188cc17ec7dfc869a1283aa724dcd6bc1`.
Virtual size: 10737418240 bytes. The exact original is retained under the new
repair directory on D:; see [publisher retention](publisher-retention.json).

Canonical SHA256SUMS and its detached signature were retained and verified by
`gpgv`, with GOODSIG/VALIDSIG for
`D2EB44626FDDC30B513D5BB71A5D6C4C7DB87C81`, UEC Image Automatic Signing Key.
The installed ubuntu-keyring package passed integrity verification. Actual
artifact length and hash matched the signed checksum. All signed manifest
bytes used in screening were also verified.

The selected boot partition contains `vmlinuz-6.8.0-139-generic`, package
`linux-image-6.8.0-139-generic` version `6.8.0-139.139`, 15059336 bytes,
SHA-256 `0066409132868538bc0c9076f60131025775d5bbd8617df074d059f91b584918`.
The actual default GRUB entry explicitly loads
`/initrd.img-6.8.0-139-generic`, 30694978 bytes, SHA-256
`e7732308dee547d2455f6203b664d4ff47da050227fd6f2ad6a331dbff4ec0d2`.
There is no saved GRUB entry overriding that default.

[Early-storage proof](candidate-server-vmdk-kernel-initramfs.json) is Case B.
The genuine boot initramfs was unpacked. Its early archive contains
`hv_vmbus.ko.zst` (64518 bytes, SHA-256
`3ce2a71cbdcf2f0c8ec857628f62afec48d072fa0f9fb235ea8f1065be032a70`),
`hv_storvsc.ko.zst` (21346 bytes, SHA-256
`aeeaddede069c17213882124a9c607352e5ee745449179b99fc970278f3a6721`), and
`scsi_transport_fc.ko.zst` (39984 bytes, SHA-256
`b1b53d2d30cbf16c2503d66615fb1e9a63eb2ee779154acdd7d07587268d89f6`).
Static modprobe dependency resolution succeeds using only the unpacked
initramfs. Its `/init` invokes init-top/udev at line 264 before `mountroot` at
line 292; udev triggers subsystem/device events, and 80-drivers.rules loads
MODALIAS drivers. ACPI VMBUS aliases and Hyper-V SCSI VMBus aliases are present.
SCSI base, SCSI disk and ext4 support are built into this kernel. Root discovery
does not rely on post-root cloud-init or modules existing only on disk.

Root is `root=LABEL=cloudimg-rootfs`, resolving to ext4 partition 1,
UUID `9a3e62be-4b82-4a7a-8f47-0b25d728fa3a`, PARTUUID
`0e241dd3-d552-415c-9e4f-0b538173131d`. EFI GRUB's boot search resolves to
partition 16 UUID `47e87460-6f19-41ce-8fb0-5e896fcb3673`. The FAT ESP is
partition 15, UUID `B303-7D7B`, PARTUUID
`8d06df08-f231-47c6-91d9-a7a030574dee`. Primary/backup GPT header and table CRCs
pass and the table copies match. The publisher padded VMDK has its backup GPT
at LBA 7340031 before the end of the 10 GiB virtual disk; the sgdisk observation
is retained. No GPT repair, kernel/initramfs change or offline filesystem
mutation occurred.

UEFI fallback `BOOTX64.EFI` equals `shimx64.efi`, SHA-256
`6fe6e1bcbe6cf6baec8e056d40361ca1aa715cc04ddcc2855351de060b84350b`.
Shim verifies under Microsoft Corporation UEFI CA 2011. Signed GRUB
SHA-256 `a831af01e4fb5e3c9457120e1d08ea13d98a0a47b62728c284b7f502d535965c`
and the signed kernel verify through the Canonical trust root mechanically
extracted from this shim. Signature output, warnings and certificate validity
metadata are retained. This proves the static signed chain; actual firmware
acceptance remains unproved because Hyper-V did not start the guest.

The historical failed VM `d5913cd7-aa99-4695-96b7-0d0135bad386` remains OFF,
NIC disconnected, with its image SHA-256
`46b0dbaffa6950a7da5ff2dc5ed34c46084610b3b6d1fae8f1ec2d7e953984a3`
and VHDX SHA-256
`5905c60cbc24b769af5dff0d79c21093ad523e652a6e8012c8b051b777bfefbb`
unchanged. No custody, credential, replay, repair or reboot entered that VM.
Its console and original producer UNDETERMINED record remain unchanged. The
later independent `VM_BOOT_BLOCKER_AUDIT_PASS` and established
`ROOT_CAUSE_ESTABLISHED_IMAGE_INITRAMFS_HYPERV_STORAGE` are preserved separately.

Replacement VM: **213ff077-356b-44a0-9032-df2ed0922b3a**,
`SRC001-PREP-REPLACEMENT-fda0a0b`, configuration version 9.0, Generation 2,
2 vCPU, fixed 2147483648-byte RAM, UEFI, Secure Boot On,
MicrosoftUEFICertificateAuthority. Root disk is synthetic SCSI controller 0,
location 0; seed DVD is location 1. There are no configured COM pipe paths.
Guest Service Interface, KVP Exchange, Time Synchronization and VSS are disabled;
Heartbeat and Shutdown remain enabled in the OFF VM. No enhanced session was
opened. Guest channel closure was not reached.

QEMU 8.2.2 converted only representation. Full source-VMDK/VHDX comparison
returned `Images are identical.` No resize occurred. VHDX physical bytes are
2189426688; virtual bytes are 10737418240; disk identifier is
`C2CE0A08-24FA-0C4D-A3C4-B5091822DD99`. Pre-start and final SHA-256 both equal
`c334c422fa7ea7b21defd3bebd0d419b3b36bd09785cbd530903f4d9557d90ce`.

The sole Start-VM request ran from `2026-09-16T20:25:39.6055186Z` to
`2026-09-16T20:25:51.4934405Z`, returning the child-operation failure:
`Not enough memory ... ram size 2048 megabytes ... 0x8007000E`.
The launcher itself returned exit 0 with child exit 1; the failed child was
not misreported as successful. Guest uptime remains zero. There is no guest
console, block-device enumeration, root mount, userspace or provisioner
session. Absence of the old VFS panic is not claimed as tested. No new image
boot defect is inferred from this host allocation rejection.

The replacement NIC initially attached to Default Switch
`c08cb7b8-9b3c-408e-8e30-5e16a3aeb444` was disconnected for containment.
NIC ID is
`Microsoft:213FF077-356B-44A0-9032-DF2ED0922B3A\9F4E3A30-4E82-4C29-9052-FA830F520362`;
its MAC remains the unassigned zero value returned by Hyper-V. Seed-only IP,
gateway and DNS were `172.29.31.250/20`, `172.29.16.1`, `172.29.16.1`;
they were never observed applied in a running guest. No provisioning switch
was created or modified. Guest network policy is unestablished; host-side OFF
and NIC-disconnected containment is proved. Provider endpoint connectivity
remains `NOT_TESTED_NOT_AUTHORIZED`.

The exact seed ISO is 376832 bytes, SHA-256
`a4986a2504f12d18a8cebe8d3c2726e68b408d9befc30951aaf5c0a2b0c46719`.
Its three member byte identities were checked. It contains only dedicated
provisioner/executor configuration and new guest SSH material. No provider,
personal developer, session, reference, semantic input or release bytes were
included. Raw private keys and seed bytes are not committed. Requested users
provisioner UID 1000 and executor UID 1001 were not established in a running guest.

Input custody remains SHA-256
`f93e1665d25e1929fc1c7e5bf0908138b5a800372ef9ce2ee466e950c1cdf363`;
release custody remains SHA-256
`81173115520bcc6d3bd6ad80d6561392b28e2e330651f946f2901b67f0c284e1`.
Exact inventories, ten file hashes, lengths, modes and owners pass current
preservation checks. Original criteria remain provenance-only and host-side.
Neither custody entered either failed VM. Release archive remains 8126590
bytes, SHA-256
`4bd8d27648ad1480601a0d4d31653297581ed354c95c0ab978fabb2d2ce3537c`.
Expected Core, adapter, checker, payload, bundle and internal-lock identities
are retained in [release-transfer.json](release-transfer.json); none is
misrepresented as a guest verification result.

| Required guest evidence | Actual state |
| --- | --- |
| Input/release transfer and guest equality | NOT_PERFORMED; zero bytes |
| Offline verification and installation | NOT_RUN |
| Installed root/inventory/modes/owners/executables/Node/tools/lock | NOT_ESTABLISHED |
| Running guest OS/kernel/users | NOT_ESTABLISHED; publisher inspection only |
| Mount inventory and classification | NOT_RUN |
| Writable-path inventory and closure | NOT_RUN |
| Guest sockets/integration/management channel closure | NOT_RUN |
| Session isolation and provider credential-absence proof | NOT_RUN |
| Guest interface/routes/DNS/firewall closure | NOT_RUN |
| Closed-reference path-denial proof | NOT_RUN; archive not transferred or opened |
| Allowed/denied roots and enforced visibility | NOT_ESTABLISHED |

All ten required synthetic probe families are individually retained in
[negative-access-probes.json](negative-access-probes.json): synthetic forbidden
host path, developer repository, closed-reference custody, host user home,
host drive, host-management channel, Docker socket, unapproved mount,
unapproved network destination and forbidden session/environment marker.
**Every family is NOT_RUN; 0 executed, 0 passed.** Commands, exits and output
digests remain null rather than invented. No real answer canary was used.

[Operation accounting](operation-boundary.json) records zero attestation,
genuine capability receipts, model/provider calls, native workers,
SRC-001 start/resume/validate, real replay/run/attempt IDs, answer-member
access, comparison, mapping, scoring, F-03 repair, generic code changes,
intent-fidelity work, PR creation and merge. There was one new VM, one new
VHDX, one failed start request and zero successful guest boots. One historical
failed VM remains, for two retained VMs total. There was no second replacement,
retry, memory downgrade, host reboot or global package installation.
The [host mutation ledger](host-mutation-ledger.json) and exact executed
command sources preserve artifact retention, disk conversion, seed creation,
VM creation/configuration, failed start and NIC containment separately.

F-03/F-04/F-05 remain OPEN / MUST PRESERVE, F-05 bounded by F-03. PA-01/PA-02
remain CLOSED by the prior independent custodian audit. PA-03/PA-04/PA-05
remain LATER-NONBLOCKING. All Slice and harness findings are unchanged.
All 32 attempt-scoped records remain deferred; the attempts directory is absent.
Protected adapter branch remains `b9e2db742a087b8ae659ec39e476ed5e240cfa1f`,
stash remains `e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8`, and the four
existing detached/prunable worktree registrations are preserved.

The final-head verification plan covers diff hygiene, Core boundary, runtime
drift, protocol verification, harness typecheck/suite and mutation battery,
repeatability, full npm test, path/evidence closure and preservation. Tests
are synthetic/non-replay. Results are not asserted until those exact-final-head
commands complete and their external receipts are retained. Normal push stays
on the same branch; no PR or merge is authorized.

Proposed fresh-audit subject: **Blind SRC-001 one replacement-image repair,
IMAGE-REPAIR-SRC001-20260916-fda0a0b: static Canonical image qualification,
exact one-VM creation, host-memory start rejection, containment and preservation
at the final published HEAD/tree**. Audit must distinguish static boot-path
proof from absent guest execution and must preserve all deferred gates. No
additional repair, attestation or replay authority follows from this report.

BLIND SRC-001 EXECUTOR ISOLATION PREPARATION BLOCKED — NO ATTESTATION OR REPLAY EXECUTION AUTHORIZED

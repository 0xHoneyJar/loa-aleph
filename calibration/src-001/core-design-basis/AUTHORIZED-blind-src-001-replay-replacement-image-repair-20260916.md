# Blind SRC-001 replacement-image repair authority

Date: 2026-09-16

Status: AUTHORIZED — HUMAN REPLACEMENT-IMAGE REPAIR AUTHORITY

Decision class: repository administration; one bounded pre-execution
replacement-image repair. This record preserves the supplied human declaration.
It is not replay execution or attestation authority.

## Exact binding

Repository: `0xHoneyJar/loa-aleph`.
Branch: `agent/src-001-blind-replay-preparation-20260914`.
Preparation ID: `PREP-SRC001-20260914-7ec21d2`.
Existing provisioning identity: `VM-PREP-SRC001-20260915-7a772f0`.

| Subject | Commit | Tree |
| --- | --- | --- |
| Independently audited blocked starting checkpoint | `d763299661c5887018b1cf250860e84042bd0cfd` | `856a931f871e67871cc1d7d80f602803aea5c682` |
| Canonical merged-harness main | `8236b9f35c38cdd604b2389b42589f27755cdade` | `72075f93bc9fcb3c76f4480bc612693211efd240` |
| Generic replay release source | `c949ea5f39daef42d22ca2e4111164d63dffcbf1` | `8ced176e50da0d05070b164cfe725752df947d3f` |
| Original preparation authority | `7ec21d24d900ee6938b26778033210fb339da975` | `171e90ee78d2edada8bcf972bb7580081c435d1d` |
| Prior VM provisioning authority | `7a772f03492d5f76ccb238b69883f5a83c295695` | `c25e265eec5f247c05fc7ffa316f55dd43fb68f5` |
| Restart continuation authority | `f8ec99faed3d816f2ba82b069d78e2179f409997` | `4899ec15eda3b16716817989e36663fc5c61554d` |

Unchanged prior authority blobs:

- Original preparation: `b9235f1bf02999b9630ed1b11da5941db1ee42a8`.
- VM provisioning: `914bc28483131a049269d59cb95b46fec139dcaa`.
- Restart continuation: `c9ddc68f2e7970ddaddb386dd8d072d13a558d03`.

| Immutable custody | SHA-256 |
| --- | --- |
| Input custody | `f93e1665d25e1929fc1c7e5bf0908138b5a800372ef9ce2ee466e950c1cdf363` |
| Release custody | `81173115520bcc6d3bd6ad80d6561392b28e2e330651f946f2901b67f0c284e1` |
| Release archive, 8,126,590 bytes | `4bd8d27648ad1480601a0d4d31653297581ed354c95c0ab978fabb2d2ce3537c` |

Failed publisher image: Ubuntu Minimal 24.04 LTS Noble, build `20260905`,
`ubuntu-24.04-minimal-cloudimg-amd64.img`, 264,372,224 bytes,
SHA-256 `46b0dbaffa6950a7da5ff2dc5ed34c46084610b3b6d1fae8f1ec2d7e953984a3`.
Failed VM UUID: `d5913cd7-aa99-4695-96b7-0d0135bad386`.
Its retained VHDX is 931,135,488 bytes, SHA-256
`5905c60cbc24b769af5dff0d79c21093ad523e652a6e8012c8b051b777bfefbb`.
These remain failed historical evidence.

## Independent audit attribution and chronology

The human supplied the fresh Claude Opus/xhigh independent audit result:

```text
VM_BOOT_BLOCKER_AUDIT_PASS
BLIND SRC-001 VM BOOT BLOCKER — INDEPENDENT AUDIT COMPLETE
ROOT_CAUSE_ESTABLISHED_IMAGE_INITRAMFS_HYPERV_STORAGE
USE_DIFFERENT_PUBLISHER_IMAGE_VARIANT
NEW_HUMAN_REPAIR_AUTHORITY_REQUIRED
REQUEST_NEW_VM_IMAGE_REPAIR_AUTHORITY
```

This attributes the result to the supplied independent audit. It does not
invent an audit artifact, digest, or producer-independent closure.
The audit established an operational Hyper-V facility and valid Generation 2,
UEFI and Secure Boot architecture. Conversion, root PARTUUID, ext4 support
and disk topology were not causal. The failed image lacks a genuine initramfs;
its modular `hv_vmbus` and `hv_storvsc` exist only on the inaccessible root,
preventing early synthetic-SCSI discovery before root mount.
Do not reopen that diagnosis without contradictory primary evidence.

The producer's historical `root_cause: UNDETERMINED` remains unchanged.
Chronology is: producer stopped without an established cause; independent
audit established the cause; human authorized this one repair; any subsequent
repair work is recorded separately under this authority.

## Human authority declaration — verbatim

```text
I authorize one bounded replacement-image repair attempt for Blind SRC-001 Replay executor-isolation preparation PREP-SRC001-20260914-7ec21d2, provisioning identity VM-PREP-SRC001-20260915-7a772f0, based on the independently audited blocked head d763299661c5887018b1cf250860e84042bd0cfd and the independent finding ROOT_CAUSE_ESTABLISHED_IMAGE_INITRAMFS_HYPERV_STORAGE.

This authority permits only the following repair work:

1. retain the failed Ubuntu Minimal 24.04 build 20260905 image, failed VM d5913cd7-aa99-4695-96b7-0d0135bad386, its VHDX, console evidence, and all prior chronology unchanged as failed evidence;
2. identify, from an authoritative Canonical Ubuntu source, the smallest suitable Ubuntu 24.04 LTS publisher image variant that is demonstrably compatible with the already-adopted Hyper-V Generation 2 boundary and provides the required early-boot Hyper-V storage path, specifically hv_vmbus and hv_storvsc either built into the kernel or present in the booted initramfs before root discovery;
3. verify that candidate before use by authoritative publisher checksum/signature, exact byte length and SHA-256, kernel/initramfs inspection, root-device configuration, UEFI boot support, and compatibility with Secure Boot using the MicrosoftUEFICertificateAuthority template;
4. if and only if those checks pass, pin that exact publisher image as the replacement base image and create exactly one fresh replacement Hyper-V Generation 2 VM with a fresh dedicated volume while preserving the existing isolation posture: UEFI, Secure Boot enabled, synthetic Hyper-V storage, no developer or host shares, no Docker/bubblewrap/ordinary WSL substitution, and no weakening of the adopted outer VM boundary;
5. boot that replacement VM only as required for mechanical provisioning, then continue the previously authorized pre-execution work: establish the guest, transfer only the independently verified input and reproduced release custody, perform offline release verification and installation, establish mount/root/channel/network/session/visibility controls, and run the authorized synthetic negative-access probes;
6. persist the exact replacement-image identity, publisher verification, image-selection rationale, failed-image disposition, replacement VM identity, all host/guest mutations, transfer/install evidence, and updated preparation state.

This authority explicitly supersedes only the prior requirement that the executor base image be the already-pinned Ubuntu Minimal 24.04 build 20260905 image and the prior one-VM limit to the extent necessary to retain that failed VM and create one fresh replacement VM. It does not authorize modifying or repairing the failed Minimal image, manufacturing a derived/custom base image, rebuilding its initramfs, switching to Hyper-V Generation 1, disabling UEFI or Secure Boot, using IDE as a fallback, changing guest distribution away from Ubuntu 24.04 LTS, weakening isolation, or creating more than one replacement VM without further human authority.

It does not authorize host attestation probes, genuine capability receipts, provider or model calls, native worker dispatch, /loa-aleph start/resume/validate on SRC-001, creation of replay/run/attempt IDs, semantic replay work, closed-reference answer access or comparison, mapping or scoring, F-03 repair, generic Core/adapter/runtime/package/harness changes, intent-fidelity work, PR creation, or merge.

If no authoritative Ubuntu 24.04 publisher image can be verified to provide the required early-boot Hyper-V storage path, if the replacement image fails to boot under Generation 2 UEFI Secure Boot, or if any adopted isolation boundary cannot be established exactly, preparation must stop again with no further fallback.

This is controlling authority.
```

## Supersession and continuing constraints

Superseded only: the failed Minimal-image pin as the required executor base,
and the one-VM limit only insofar as the failed VM is retained and one fresh
replacement VM may be created.

Not superseded: Generation 2, UEFI, Secure Boot enabled,
`MicrosoftUEFICertificateAuthority`, synthetic Hyper-V storage, Ubuntu 24.04 LTS,
an authoritative publisher image, the adopted isolation boundary, and absence
of execution/attestation authority. No derived/custom base, offline image
repair, distribution change, Gen1/IDE fallback, or second replacement is allowed.
Format conversion requires verified guest-visible block equivalence before
first boot. The exact original publisher artifact must remain unchanged.

Before VM creation, the selected boot-loader-referenced kernel must have both
early Hyper-V drivers built in, or a genuine inspected boot initramfs must
contain them and their required loadable dependencies before root discovery.
The root selector must resolve in the actual GPT/filesystems. The signed UEFI
boot chain must satisfy the required Secure Boot template. Package names and
root-filesystem-only modules do not meet this gate.

Only approved input and exactly the three release files may cross the transfer
boundary. Original criteria remain provenance-only. No reference answers,
repository, session stores, developer credentials or provider credentials may
enter the guest. Attestation and provider connectivity remain
`NOT_TESTED_NOT_AUTHORIZED`. All 32 attempt-scoped records remain deferred.

F-03/F-04/F-05 remain OPEN / MUST PRESERVE; F-05 remains bounded by F-03.
PA-01/PA-02 remain CLOSED by the supplied independent custodian audit.
PA-03/PA-04/PA-05 remain LATER-NONBLOCKING. All Slice and harness findings
and the prior VM-boot audit classification remain preserved.

## Starting gates and administrative persistence

Before this record, exact local branch/HEAD/tree, clean state and live GitHub
branch/main pins matched. All prior authority blobs matched their original
commits. Both custody inventories, all ten file hashes/lengths/modes/owners,
the failed image and the failed VHDX matched. Findings retention SHA-256 remains
`549d559df5f99f186bb64216bba4f7ebf9a1e89f1288c04542b7b1bffaa875e4`.
No new replay/run/attempt state was found in the bounded repository and
preparation inventory; the SRC-001 attempts directory remains absent.

Live elevated read-only Hyper-V observation at `2026-09-16T19:54:08.5048091Z`
found only the failed VM, OFF, NIC disconnected, disk unattached, no DVD,
and no matching `vmwp.exe` process. A text-valued firmware query at
`2026-09-16T19:55:51.1069028Z` confirmed Secure Boot `On` and
`MicrosoftUEFICertificateAuthority` (the API serializes `On` numerically as 0).
The unchanged failed disk plus unchanged zero-transfer historical record
preserve the no-custody-transfer finding; no failed-guest session was opened.

Protected adapter branch remains `b9e2db742a087b8ae659ec39e476ed5e240cfa1f`;
stash remains `e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8`.
All four detached/prunable worktree registrations remain unchanged.
Read-only gate receipts are staged at
`/tmp/src001-replacement-image-gate-20260916/` for subsequent evidence retention.
No candidate was acquired and no infrastructure was modified before this record.

Commit this record separately with its repository-administration manifest
entry before candidate acquisition. Derive
`IMAGE-REPAIR-SRC001-20260916-<authority-short-sha>` only from that commit.
This is a repository-administrative repair identity, never a replay/run/attempt
ID. Retain new records beneath the existing provisioning hierarchy at
`replacement-image-repair-20260916/`; preserve all historical evidence.

On complete mechanical success, producer isolation status may be only
`PRODUCER_REMEDIATED_NOT_INDEPENDENTLY_CLOSED`. Fresh independent Claude audit
is required before any separate attestation or replay authority. A failed
identity, boot, installation, isolation or visibility gate stops this repair
without fallback.

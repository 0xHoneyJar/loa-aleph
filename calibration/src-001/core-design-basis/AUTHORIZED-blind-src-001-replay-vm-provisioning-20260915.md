# Blind SRC-001 executor VM provisioning authority

Date: 2026-09-15

Status: AUTHORIZED — HUMAN PRE-EXECUTION VM PROVISIONING AUTHORITY

Decision class: bounded pre-attempt infrastructure preparation; repository
administration. This record preserves the human declaration supplied in the
provisioning instruction. It does not confer replay execution authority.

## Exact authority binding

Repository: `0xHoneyJar/loa-aleph`.

Branch: `agent/src-001-blind-replay-preparation-20260914`.

Preparation ID: `PREP-SRC001-20260914-7ec21d2`.

| Subject | Commit | Tree |
| --- | --- | --- |
| Independently audited custodian starting state | `0d9b36d65c7131c0173f3f978177cc7ac5912021` | `50fd287a36db641c1d0f03fc8af735bc44416902` |
| Canonical merged-harness GitHub main | `8236b9f35c38cdd604b2389b42589f27755cdade` | `72075f93bc9fcb3c76f4480bc612693211efd240` |
| Generic release source | `c949ea5f39daef42d22ca2e4111164d63dffcbf1` | `8ced176e50da0d05070b164cfe725752df947d3f` |
| Original preparation authority | `7ec21d24d900ee6938b26778033210fb339da975` | `171e90ee78d2edada8bcf972bb7580081c435d1d` |

The original preparation authority remains unchanged at
`AUTHORIZED-blind-src-001-replay-preparation-20260914.md`, Git blob
`b9235f1bf02999b9630ed1b11da5941db1ee42a8`.
The exact adopted proposal remains bound by
`ADOPTED-blind-src-001-replay-harness-design-20260914.md` and proposal SHA-256
`52e1f1bae4cbf91dbaf9699b69bad5885e37ce503db7fcb16ea2fe32a0e10ed8`.
Q-R1 remains `EXPERIMENTAL_UNSANCTIONED_NATIVE_LOA`.

| Custody subject | Exact content identity |
| --- | --- |
| Frozen input custody content lock | `sha256:f93e1665d25e1929fc1c7e5bf0908138b5a800372ef9ce2ee466e950c1cdf363` |
| Reproduced release custody content lock | `sha256:81173115520bcc6d3bd6ad80d6561392b28e2e330651f946f2901b67f0c284e1` |
| Reproduced generic release bundle | `sha256:e83ab57e971f2d508fe2b42139cd122b9fd70b9b309574efd10307ff6795c909` |
| Release archive, 8,126,590 bytes | `sha256:4bd8d27648ad1480601a0d4d31653297581ed354c95c0ab978fabb2d2ce3537c` |

## Fresh independent audit attribution

The human supplied the fresh independent custodian audit result:

```text
CUSTODIAN_PREPARATION_AUDIT_PASS
PA-01: CLOSED
PA-02: CLOSED
Recommendation: AUTHORIZE_ADOPTED_VM_PROVISIONING
BLIND SRC-001 CUSTODIAN PREPARATION — INDEPENDENT AUDIT COMPLETE
```

These closures are attributed to that fresh independent audit, not to this
producer. No audit artifact, digest, auditor identity, or additional finding is
invented. Historical custodian records retain their original producer status
`PRODUCER_REMEDIATED_NOT_INDEPENDENTLY_CLOSED`; this separate binding records
the later human-supplied independent result without rewriting those records.

The active executor blocker remains `BLOCKED_PREPARATION_ISOLATION`.
The entire replay preparation is not complete. PA-03, PA-04 and PA-05 remain
LATER-NONBLOCKING. F-03, F-04 and F-05 remain OPEN / MUST PRESERVE, with F-05
bounded by F-03. All carried Slice findings and all eight earlier harness
observations retain their exact scope and strength under the original
preparation authority.

The two additional fresh-audit observations remain LATER-NONBLOCKING:
`packaging/README.md` documents `1.5.0-provisional` while actual manifest and
release state is `1.8.0-provisional`; some local main/origin/main refs are
stale at `c949ea5f...`. Neither is repaired here. Live GitHub main, not a stale
local ref, governs the main pin.

## Human authority declaration — verbatim

```text
I authorize provisioning and mechanical verification of the adopted fresh-VM executor boundary for Blind SRC-001 Replay preparation PREP-SRC001-20260914-7ec21d2, based on independently audited custodian head 0d9b36d65c7131c0173f3f978177cc7ac5912021 and canonical merged-harness main 8236b9f35c38cdd604b2389b42589f27755cdade. This authority permits only the remaining pre-execution isolation work required by the adopted design: identify and pin an immutable minimal executor image; enable or use an existing legitimate VM facility as necessary; provision one fresh disposable VM and new volume; establish and record the adopted mount, root, channel, network, session, and visibility boundaries; transfer only the independently verified SRC-001 input custody and reproduced generic release; perform offline release verification and installation inside the isolated executor; run mechanical synthetic negative-access and isolation probes; and persist the resulting environment, visibility, custody-transfer, and preparation evidence. It does not authorize host attestation probes, genuine capability receipts, provider or model calls, native worker dispatch, /loa-aleph start/resume/validate on SRC-001, creation of a replay/run/attempt ID, semantic replay work, closed-reference answer access or comparison, mapping or scoring, F-03 repair, generic Core/adapter/runtime/package/harness changes, substitution of Docker/bubblewrap/ordinary WSL as the adopted outer boundary, intent-fidelity work, PR creation, or merge. If the adopted VM boundary cannot be established exactly, preparation must remain blocked with no fallback.
```

## Authorized scope and explicit exclusions

VM provisioning and mechanical isolation verification are authorized.
Host attestation, genuine capability receipts, model/provider traffic and
replay execution are NOT authorized. No replay/run/attempt ID may be created.
No reference answers may be opened, compared, mapped or scored. No native
worker dispatch or SRC-001 `/loa-aleph start/resume/validate` may occur.
No F-03 repair or generic code change is authorized. No Docker, bubblewrap,
ordinary WSL, chroot, namespace-only or host-process substitution is
authorized. No intent-fidelity work, PR creation or merge is authorized.

The adopted outer boundary must be a fresh disposable VM with a separate
guest kernel, immutable pinned base image and fresh dedicated volume.
Host shares and developer/reference/session/management channels must remain
closed. Temporary provisioning networking and final pre-execution networking
must be recorded separately. Provider/model connectivity remains NOT TESTED.
Any unknown future provider allowlist prerequisite remains explicit.

Transfer only verified custody bytes after sufficient outer isolation exists.
The canonical release consists of exactly three release files; the custody
wrapper is not a fourth payload. Original criteria remain provenance-only
and outside semantic-production-visible input. No repository, Git store,
reference archive, prior result, developer state or provider credential may
be transferred. Installation is offline and stops before any implicit
attestation or provider operation.

Each infrastructure mutation requires exact before/after evidence, command,
privilege, target, timestamp, exit result, rollback information where practical
and reboot requirement. No destructive global host/network/virtualization
change is authorized. A facility that cannot meet the adopted boundary is
rejected without fallback.

## Chronology and persistence

Before this record was written, read-only checks verified the exact local
repository, branch, HEAD/tree, clean working tree, live remote preparation
branch and live GitHub main. Both custody directories were reopened only for
inventory, modes, lengths and hashes; every retained file and content lock
matched. The original authority blob matched. The attempts directory is absent.
The pre-existing `RUN-RETAINED-SLICE7-PROBE/control/` remains empty and unchanged;
it is not an SRC-001 replay identity.

Preserved adapter branch:
`b9e2db742a087b8ae659ec39e476ed5e240cfa1f`.
Preserved stash:
`e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8`.
All four pre-existing detached/prunable worktree registrations remain intact.
The unchanged custodian operation record and supplied audit retain zero
executor creations, attestation, model/provider calls and native replay
operations. Current bounded discovery found no SRC-001 executor record.
Read-only Windows discovery reports an active hypervisor, but no Hyper-V
management module/service/namespace; complete facility and executor-absence
verification remains a gate before any infrastructure mutation.

Commit this record separately, with only its repository-administration
manifest entry, before image acquisition or infrastructure provisioning.
After that commit, derive
`VM-PREP-SRC001-20260915-<short-authority-commit>`.
This is only a provisioning administration identity, never an Aleph execution,
replay, run or attempt identity.

Retain provisioning records beneath
`calibration/src-001/replay/preparation/PREP-SRC001-20260914-7ec21d2/vm-provisioning/`.
Do not instantiate attempt-scoped schemas requiring a replay ID. Retain a
pre-attempt environment preparation record instead. Large images/disks remain
outside Git, with custody locators and content identities.

If every mechanical proposition succeeds, the producer may record only
`PRODUCER_REMEDIATED_NOT_INDEPENDENTLY_CLOSED` for the isolation blocker.
Fresh independent audit is required before separate attestation or replay
authority. No preparation outcome establishes semantic validation, acceptance,
sanction, production readiness, golden status or v1.

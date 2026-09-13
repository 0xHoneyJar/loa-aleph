# Duplicate review

duplicate_review_format: aleph-duplicate-review/v1

## discoveries

| discovery_id | record_path | record_digest |
| --- | --- | --- |
| DCD-0001 | verification/harness/duplicate-discovery/DCD-0001.json | sha256:cfd97dcdb40683cc10e52742055f5290843627d7bd5097b4943f08bd0994f852 |
| DCD-0002 | verification/harness/duplicate-discovery/DCD-0002.json | sha256:95a307e59ec7754ee3488877fab69787fb8c638e66c4d86f22ce3893009b0eba |

## proposals

| proposal_id | subject_path | subject_digest | predecessor_proposal_id | producer_receipt_ref |
| --- | --- | --- | --- | --- |
| DUP-0001 | verification/harness/duplicate-subjects/DUP-0001.json | sha256:53f6617ab442be446a6fe5b49e8757af86c44890bb18709c86ec8a85115d642e | none | verification/harness/duplicate-process/producer-comparison-0001.json@sha256:074bf61d39569b6c3e723b85168542ba9ecbddfc80c2b0fb50faec54f1902288 |

## assignments

| review_id | proposal_id | assignment_path | assignment_digest |
| --- | --- | --- | --- |
| VER-0811 | DUP-0001 | verification/harness/duplicate-assignments/VER-0811.json | sha256:8b15d8a5804f49301b4ef0ed37ab26f025cd2f07aae6e6ba2a3efe838c285e82 |

## results

| review_id | proposal_id | result_path | result_digest | execution_kind | execution_evidence_ref |
| --- | --- | --- | --- | --- | --- |
| VER-0811 | DUP-0001 | verification/harness/duplicate-results/VER-0811.json | sha256:5e2ba997121114761c14c157be69e30d11c810c397c347be75232fafc1591024 | manual-separate-pass | verification/harness/duplicate-process/reviewer-0811.json@sha256:cb1c4152be7248177d557be47ebedc4592f98e097ab969ed137d31bbb8d330c3 |

## decisions

| decision_id | proposal_id | review_ids | verdict | reviewed_outcome |
| --- | --- | --- | --- | --- |
| DDR-0001 | DUP-0001 | ["VER-0811"] | upheld | duplicate |

## effects

| effect_id | proposal_id | decision_id | effect | semantic_id | lineage_id | successor_id | record_ref |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUE-0001 | DUP-0001 | DDR-0001 | canonicalized | SEM-0803 | LIN-0803 | CC-0803 | verification/harness/duplicate-effects/DUE-0001.json@sha256:9612b692e22a17a383446e33e3d4f37a9c151c841622514c5dcf498d6d5145fa |

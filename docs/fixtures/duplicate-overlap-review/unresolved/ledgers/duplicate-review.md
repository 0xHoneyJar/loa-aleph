# Duplicate review

duplicate_review_format: aleph-duplicate-review/v1

## discoveries

| discovery_id | record_path | record_digest |
| --- | --- | --- |
| DCD-0001 | verification/harness/duplicate-discovery/DCD-0001.json | sha256:872cb528b3822f2faa56a385276b0e6edf16bf17683ee406161e89742d9468a2 |

## proposals

| proposal_id | subject_path | subject_digest | predecessor_proposal_id | producer_receipt_ref |
| --- | --- | --- | --- | --- |
| DUP-0001 | verification/harness/duplicate-subjects/DUP-0001.json | sha256:37bb9f59f6d9e6a617a2fe6e48c1057dd291a27eef43af5ab3d9e20ab06fcd83 | none | verification/harness/duplicate-process/producer-comparison-0001.json@sha256:293ae635d0085bf0df176e56f0ada4f0c765da913567cb6033aafe9dc343f42c |

## assignments

| review_id | proposal_id | assignment_path | assignment_digest |
| --- | --- | --- | --- |
| VER-0811 | DUP-0001 | verification/harness/duplicate-assignments/VER-0811.json | sha256:22fdd4a97f651fcb42a2d1f29cc59933cf730ff577ea185de0535f74f9f9baa4 |

## results

| review_id | proposal_id | result_path | result_digest | execution_kind | execution_evidence_ref |
| --- | --- | --- | --- | --- | --- |
| VER-0811 | DUP-0001 | verification/harness/duplicate-results/VER-0811.json | sha256:e84e9c25172a876e0271fa6553c62cd5b0d50650a3bedba8a22cc0c2375cc84a | manual-separate-pass | verification/harness/duplicate-process/reviewer-0811.json@sha256:919ddee1091470d60f0ee77a38dc67ea8649b47a92c1f44e7c3dca83a1be3539 |

## decisions

| decision_id | proposal_id | review_ids | verdict | reviewed_outcome |
| --- | --- | --- | --- | --- |
| DDR-0001 | DUP-0001 | ["VER-0811"] | upheld | duplicate |

## effects

| effect_id | proposal_id | decision_id | effect | semantic_id | lineage_id | successor_id | record_ref |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUE-0001 | DUP-0001 | DDR-0001 | not-admitted | none | none | none | verification/harness/duplicate-effects/DUE-0001.json@sha256:81e990a35e05ea98f4d824ec6872a20d8b952cd11c4add8205af7d307fd7270a |

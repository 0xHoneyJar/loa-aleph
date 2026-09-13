# Duplicate review

duplicate_review_format: aleph-duplicate-review/v1

## discoveries

| discovery_id | record_path | record_digest |
| --- | --- | --- |
| DCD-0001 | verification/harness/duplicate-discovery/DCD-0001.json | sha256:a13320016f35f937166f261dc406f7638717d4ce8f949a70575c19f9476c7e42 |
| DCD-0002 | verification/harness/duplicate-discovery/DCD-0002.json | sha256:5f49659778265fe4632899ce3f4df5438249807a52c23c4b0eb7c1ae6cc90818 |

## proposals

| proposal_id | subject_path | subject_digest | predecessor_proposal_id | producer_receipt_ref |
| --- | --- | --- | --- | --- |
| DUP-0001 | verification/harness/duplicate-subjects/DUP-0001.json | sha256:eca8f069666b591405a6092938f8eda798079d4f3ecea6b671ac0d3d2e5ae0aa | none | verification/harness/duplicate-process/producer-comparison-0001.json@sha256:65a995588739aa28cc53eba318ff181d2b7e047d37fb18619baf931fd3825dc0 |

## assignments

| review_id | proposal_id | assignment_path | assignment_digest |
| --- | --- | --- | --- |
| VER-0811 | DUP-0001 | verification/harness/duplicate-assignments/VER-0811.json | sha256:9de3fe1d9dfe065bf6ead397fd0906e8c0deca460257475cb9224424e7442193 |

## results

| review_id | proposal_id | result_path | result_digest | execution_kind | execution_evidence_ref |
| --- | --- | --- | --- | --- | --- |
| VER-0811 | DUP-0001 | verification/harness/duplicate-results/VER-0811.json | sha256:aa09b61e21dccda8d8d91654401065dc43b1575267700c599c528378f8090453 | manual-separate-pass | verification/harness/duplicate-process/reviewer-0811.json@sha256:525d728601b1a2202f81a5270aa7a4d1c8fe3d250e91e58c0704a2dadd09ba10 |

## decisions

| decision_id | proposal_id | review_ids | verdict | reviewed_outcome |
| --- | --- | --- | --- | --- |
| DDR-0001 | DUP-0001 | ["VER-0811"] | upheld | duplicate |

## effects

| effect_id | proposal_id | decision_id | effect | semantic_id | lineage_id | successor_id | record_ref |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUE-0001 | DUP-0001 | DDR-0001 | canonicalized | SEM-0803 | LIN-0803 | CC-0803 | verification/harness/duplicate-effects/DUE-0001.json@sha256:a1ee8e1a0b1685812ed6930ca490f599807428dac52656612a17869e6af26a00 |

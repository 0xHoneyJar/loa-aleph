# Duplicate review

duplicate_review_format: aleph-duplicate-review/v1

## discoveries

| discovery_id | record_path | record_digest |
| --- | --- | --- |
| DCD-0001 | verification/harness/duplicate-discovery/DCD-0001.json | sha256:4e10b3edbe9bd38267e9cf293ac76929a36a002aa37f044cb65506b1a4e33b12 |

## proposals

| proposal_id | subject_path | subject_digest | predecessor_proposal_id | producer_receipt_ref |
| --- | --- | --- | --- | --- |
| DUP-0001 | verification/harness/duplicate-subjects/DUP-0001.json | sha256:02ec30849c8c038eb89bdb0aa2b814f3918f492669fc6edc6f304f84cd800b46 | none | verification/harness/duplicate-process/producer-comparison-0001.json@sha256:a9bc141a61698f22f26a752567b93e0045f4ef33734e12c01b4886eeffa841f4 |

## assignments

| review_id | proposal_id | assignment_path | assignment_digest |
| --- | --- | --- | --- |
| VER-0811 | DUP-0001 | verification/harness/duplicate-assignments/VER-0811.json | sha256:239c6f686a583f0dde99fea1593bfb2fed82f99e4bf3a41a207a5874946c3964 |

## results

| review_id | proposal_id | result_path | result_digest | execution_kind | execution_evidence_ref |
| --- | --- | --- | --- | --- | --- |
| VER-0811 | DUP-0001 | verification/harness/duplicate-results/VER-0811.json | sha256:7ea65feb54b90b7fcd8d6280a55e9ad0fb1eb8f4a9b0ccef75db96a49c613b4b | manual-separate-pass | verification/harness/duplicate-process/reviewer-0811.json@sha256:3147ab75ee28cb611fd80ca5fbe6091306df8393b9f44b6da4a1b00c854b505c |

## decisions

| decision_id | proposal_id | review_ids | verdict | reviewed_outcome |
| --- | --- | --- | --- | --- |
| DDR-0001 | DUP-0001 | ["VER-0811"] | upheld | duplicate |

## effects

| effect_id | proposal_id | decision_id | effect | semantic_id | lineage_id | successor_id | record_ref |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DUE-0001 | DUP-0001 | DDR-0001 | not-admitted | none | none | none | verification/harness/duplicate-effects/DUE-0001.json@sha256:9451dde25a0cbd864307ddbbb7aeef59fdaca0fb471bb01ba3f2668cd5195dc6 |

# Semantic Review

- semantic_review_format: aleph-semantic-review/v1

## subjects

| semantic_id | owner_stage | subject_kind | subject_path | subject_digest | predecessor_semantic_id | producer_receipt_ref |
| --- | --- | --- | --- | --- | --- | --- |
| SEM-0701 | S2 | packet-group | verification/harness/semantic-subjects/SEM-0701.json | sha256:7dc27385bd199e7dd113d599d254b8e95a5ef6b9b7e0b8f14daea70c81aa7062 | none | verification/harness/semantic-process/producer-0701.json@sha256:75e5df6e9b675301e040f97c44979c1dd3e32c1d15ec67e6ec476434cfbcd18d |
| SEM-0801 | S3 | claim | verification/harness/semantic-subjects/SEM-0801.json | sha256:b8658464114837b7d3880ddc11e63aca3a8b7405fe2679d61a090172ac1228ab | none | verification/harness/semantic-process/producer-0801.json@sha256:9615bd5ca020795a1367c9c89e44c3930ed927a17041021a836a007ddf4d30fb |
| SEM-0802 | S3 | claim | verification/harness/semantic-subjects/SEM-0802.json | sha256:a26af074603eec9bee502406709ee8282365f5b9dc84ad82052f38fa00e8d8f1 | none | verification/harness/semantic-process/producer-0802.json@sha256:60385c0322008c1917dae299199284a232daa3a370490108a37273c6eeb453bf |
| SEM-0803 | S4 | claim | verification/harness/semantic-subjects/SEM-0803.json | sha256:932a6aa07a244f544825220f2c1dec64fd46ff67730a426707f2fb44939f435e | none | verification/harness/semantic-process/producer-0803.json@sha256:b38859267e2e5cc31bdbb7bfdf72270c219bce9e5bcb8cec95de16e324f81ad5 |

## assignments

| review_id | semantic_id | assignment_path | assignment_digest |
| --- | --- | --- | --- |
| VER-0701 | SEM-0701 | verification/harness/semantic-assignments/VER-0701.json | sha256:08ba90ae1801cf0bdbbbfbe79b9035a7d469ab9b02c329647d926360db2df8b4 |
| VER-0801 | SEM-0801 | verification/harness/semantic-assignments/VER-0801.json | sha256:2780542e6476c86b1943d8c59ee09d122b61b3b5b480201caf6f7428242f98ca |
| VER-0802 | SEM-0802 | verification/harness/semantic-assignments/VER-0802.json | sha256:58a8af0d3da3f3b5564b6a2aea17245d103ad27fa70b38a1c804c19380244697 |
| VER-0803 | SEM-0803 | verification/harness/semantic-assignments/VER-0803.json | sha256:942982ea99ffda9aa09ff950fb36a329013354e5a2e4705dbf0e499740f4fe69 |

## results

| review_id | semantic_id | result_path | result_digest | execution_kind | execution_evidence_ref |
| --- | --- | --- | --- | --- | --- |
| VER-0701 | SEM-0701 | verification/harness/semantic-results/VER-0701.json | sha256:d543e9e63f4a4607dd83aca7c6ebdf8281f2789ac2b0294c7dc0cc98be3a6677 | manual-separate-pass | verification/harness/semantic-process/reviewer-VER-0701.json@sha256:bcf1c8c2b5c3d806613f2c453799e529315e41989b8ba8c9f67463c314271067 |
| VER-0801 | SEM-0801 | verification/harness/semantic-results/VER-0801.json | sha256:4f7feeb3e09dc6089a6291e1ef2c812c2b35364dd923dc260df46f2ef43705a5 | manual-separate-pass | verification/harness/semantic-process/reviewer-0801.json@sha256:c4ed545525edcb4f3f836f06159d53d859b4744387ee4e36a115a47397b52b68 |
| VER-0802 | SEM-0802 | verification/harness/semantic-results/VER-0802.json | sha256:f9cd73cf52e5c522f12834480f3009424c882d4c236b8a761f5cd7cba61c9160 | manual-separate-pass | verification/harness/semantic-process/reviewer-0802.json@sha256:f0b6e68c3e7e3d07e3d843d78cfa04bc07a43093aa7810606c70d5e9327d5c2a |
| VER-0803 | SEM-0803 | verification/harness/semantic-results/VER-0803.json | sha256:00a8f44416c0d50dd0c098558cecebff154c539e8569c508c9af662a390ef9a4 | manual-separate-pass | verification/harness/semantic-process/reviewer-VER-0803.json@sha256:3b552128e3d25e901baa1164f9825590b9be54e729f859ef3a282aeb4383809a |

## resolutions

| resolution_id | semantic_id | outcome | review_ids | canonical_refs | origin_unit_refs | followup_semantic_ids |
| --- | --- | --- | --- | --- | --- | --- |
| SMR-0701 | SEM-0701 | admitted | ["VER-0701"] | ["PKT-0701","PKT-0702"] | [] | [] |
| SMR-0801 | SEM-0801 | admitted | ["VER-0801"] | ["CC-0801"] | ["SEM-0701/U1"] | [] |
| SMR-0802 | SEM-0802 | admitted | ["VER-0802"] | ["CC-0802"] | ["SEM-0701/U2"] | [] |
| SMR-0803 | SEM-0803 | not-admitted | ["VER-0803"] | [] | ["SEM-0801/U1","SEM-0802/U1"] | [] |

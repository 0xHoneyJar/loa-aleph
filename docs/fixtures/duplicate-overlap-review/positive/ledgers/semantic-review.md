# Semantic Review

- semantic_review_format: aleph-semantic-review/v1

## subjects

| semantic_id | owner_stage | subject_kind | subject_path | subject_digest | predecessor_semantic_id | producer_receipt_ref |
| --- | --- | --- | --- | --- | --- | --- |
| SEM-0701 | S2 | packet-group | verification/harness/semantic-subjects/SEM-0701.json | sha256:6c386725e5fecb1884252b46f5a903692c2a43040fa13622a46b1aca20a080d6 | none | verification/harness/semantic-process/producer-0701.json@sha256:75e5df6e9b675301e040f97c44979c1dd3e32c1d15ec67e6ec476434cfbcd18d |
| SEM-0801 | S3 | claim | verification/harness/semantic-subjects/SEM-0801.json | sha256:989ddc5d74475b8f442bd008195c4719983de4d0e2b6b944a4db1ba5501f268b | none | verification/harness/semantic-process/producer-0801.json@sha256:9615bd5ca020795a1367c9c89e44c3930ed927a17041021a836a007ddf4d30fb |
| SEM-0802 | S3 | claim | verification/harness/semantic-subjects/SEM-0802.json | sha256:58e2e0bf4d6d63acb44dd0cca1bdbeacbf3e6b2cecfff28a2f3393d2da3aeaf3 | none | verification/harness/semantic-process/producer-0802.json@sha256:60385c0322008c1917dae299199284a232daa3a370490108a37273c6eeb453bf |
| SEM-0803 | S4 | claim | verification/harness/semantic-subjects/SEM-0803.json | sha256:13357b79cfd9988177723e92386a82d6db3280b0b42fb43510948bf71d9e6536 | none | verification/harness/semantic-process/producer-0803.json@sha256:140befcb5bc824842fd6b49ffcfabaf50de8f86665ac0d5d1ed9376e06b043fe |

## assignments

| review_id | semantic_id | assignment_path | assignment_digest |
| --- | --- | --- | --- |
| VER-0701 | SEM-0701 | verification/harness/semantic-assignments/VER-0701.json | sha256:a6591320260b215af0b71a7ad11d0368b14d7eb2fd4d5a0c7bcc451b941b5f09 |
| VER-0801 | SEM-0801 | verification/harness/semantic-assignments/VER-0801.json | sha256:b2f43e1ed65d49d87c95d04a30ff17f26f759337d51e017cd35013304aaa1c6e |
| VER-0802 | SEM-0802 | verification/harness/semantic-assignments/VER-0802.json | sha256:1075d02d08312c8f8acbee35856105e3742256b3810c893eab1db1736eaf5f00 |
| VER-0803 | SEM-0803 | verification/harness/semantic-assignments/VER-0803.json | sha256:0deb2b71e8b7a374f3c55a561568965019ccc5eac41f25e46164169529a9b54a |

## results

| review_id | semantic_id | result_path | result_digest | execution_kind | execution_evidence_ref |
| --- | --- | --- | --- | --- | --- |
| VER-0701 | SEM-0701 | verification/harness/semantic-results/VER-0701.json | sha256:f328ebb2df019b849104ddf15d10728b77d047987c3213f89ec2ee5f1b153b64 | manual-separate-pass | verification/harness/semantic-process/reviewer-VER-0701.json@sha256:448a4cdd245380c41741acfc5c5534fc7078c0f9d71aa086f6df94d5cd5857c4 |
| VER-0801 | SEM-0801 | verification/harness/semantic-results/VER-0801.json | sha256:0eb28978f96b7264b7ae51b60c90dd063ccf24c8fb4099423eec684bcb7fa85b | manual-separate-pass | verification/harness/semantic-process/reviewer-0801.json@sha256:882fdc9ce1e7239c9c1cb78be45c6206bbe8c5ac71352d91870d50a9e17b95ff |
| VER-0802 | SEM-0802 | verification/harness/semantic-results/VER-0802.json | sha256:b5f6b735b1a445c7a5f55694e2eae8b5225ecf61ffb3c8c32d119f83bd85f05a | manual-separate-pass | verification/harness/semantic-process/reviewer-0802.json@sha256:38eb337fe7c8f6c1202dafabf5dd238732acb90e28da18d7936825887aaf781f |
| VER-0803 | SEM-0803 | verification/harness/semantic-results/VER-0803.json | sha256:13a62b9d3ad4f2d07f68a20175cf9e8690ca63c8a9a4645c366e89e0ebc1ff57 | manual-separate-pass | verification/harness/semantic-process/reviewer-0803.json@sha256:2637be996efb7daea4ad93972ec119f290a429c154687356532a593514a6098e |

## resolutions

| resolution_id | semantic_id | outcome | review_ids | canonical_refs | origin_unit_refs | followup_semantic_ids |
| --- | --- | --- | --- | --- | --- | --- |
| SMR-0701 | SEM-0701 | admitted | ["VER-0701"] | ["PKT-0701","PKT-0702"] | [] | [] |
| SMR-0801 | SEM-0801 | admitted | ["VER-0801"] | ["CC-0801"] | ["SEM-0701/U1"] | [] |
| SMR-0802 | SEM-0802 | admitted | ["VER-0802"] | ["CC-0802"] | ["SEM-0701/U2"] | [] |
| SMR-0803 | SEM-0803 | admitted | ["VER-0803"] | ["CC-0803"] | ["SEM-0801/U1","SEM-0802/U1"] | [] |

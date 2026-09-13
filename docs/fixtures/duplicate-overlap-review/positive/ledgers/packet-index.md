# Packet Index

- exact_evidence_format: aleph-exact-evidence/v1

## Packets

| packet_id | source_id | locator | span_hash | quote | criterion | status |
| --- | --- | --- | --- | --- | --- | --- |
| PKT-0701 | SRC-701 | L1-L1 | sha256:2c0815be7f9de47e2b54f6b6700e327b45356253149d9a543ab6e25cc546788b | The indicator lit during trial A. | 1 | active |
| PKT-0702 | SRC-701 | L3-L3 | sha256:38296c40709219cc2fe775d2fe470163923505bca4b8c0cab15ac7de6bd005c7 | The indicator lit during trial A. | 1 | active |

## Exact evidence records

| evidence_key | packet_ids | evidence_state | fragment_count | join_policy | exact_evidence_hash | degraded_source_id | degraded_source_locator | degradation_reason |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EVID-0701 | PKT-0701, PKT-0702 | exact | 2 | separate-fragments | sha256:82bb1abc36b407bb5772ee5c2d692e32bd6d4df979f4a5dd49d94c25c1fa5ff5 | none | none | none |

## Exact fragments

| fragment_key | evidence_key | packet_id | fragment_order | source_id | locator | source_relation | byte_role | fragment_hash | exact_bytes_base64 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FRAG-0701 | EVID-0701 | PKT-0701 | 1 | SRC-701 | L1-L1 | frozen-source | exact-source-bytes | sha256:2c0815be7f9de47e2b54f6b6700e327b45356253149d9a543ab6e25cc546788b | VGhlIGluZGljYXRvciBsaXQgZHVyaW5nIHRyaWFsIEEuCg== |
| FRAG-0702 | EVID-0701 | PKT-0702 | 2 | SRC-701 | L3-L3 | frozen-source | exact-source-bytes | sha256:38296c40709219cc2fe775d2fe470163923505bca4b8c0cab15ac7de6bd005c7 | VGhlIGluZGljYXRvciBsaXQgZHVyaW5nIHRyaWFsIEEu |

## Evidence transformations

| transform_key | evidence_key | output_role | predecessor_exact_evidence_hash | effective_exact_evidence_hash | output_text | output_text_hash |
| --- | --- | --- | --- | --- | --- | --- |

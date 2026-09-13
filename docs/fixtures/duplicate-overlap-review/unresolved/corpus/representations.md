# Source Representations

- source_representation_format: aleph-source-representation/v1

## representations

| representation_id | source_id | origin_kind | extraction_surface | state | reason | provenance_id |
| --- | --- | --- | --- | --- | --- | --- |
| REP-0001 | SRC-701 | unknown-origin | utf8-text | available | none | RPR-0001 |

## assets

| asset_id | representation_id | role | locus | media_type | encoding | byte_length | content_hash |
| --- | --- | --- | --- | --- | --- | --- | --- |

## provenance

| provenance_id | representation_id | type | actor | tool | tool_version | input_refs | output_refs | parameters_asset_id | declaration_asset_id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RPR-0001 | REP-0001 | capture | capture-importer | stable-copy | 1 | [] | ["SRC-701"] | none | none |

## bindings

| binding_id | representation_id | carrier_id | start_byte | end_byte | page_id | region_id | byte_role | fragment_hash | exact_bytes_base64 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BND-0001 | REP-0001 | SRC-701 | 0 | 95 | none | none | frozen-source-bytes | sha256:8f50ed0bf43d596997f667ca264463d51cd1a9d634b82cafa351fbc8e05caca5 | VGhlIGluZGljYXRvciBsaXQgZHVyaW5nIHRyaWFsIEEuClVucmVsYXRlZCBzdXJyb3VuZGluZyB0ZXh0LgpUaGUgaW5kaWNhdG9yIGxpdCBkdXJpbmcgdHJpYWwgQS4= |

## objects

| object_id | representation_id | kind | parent_id | state | reason | provenance_id | binding_ids | content_hash | coordinates |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| OBJ-0001 | REP-0001 | source | none | available | none | RPR-0001 | ["BND-0001"] | sha256:97ffe8f198f70c6166cc40a74534ba744fdf7e9deadd06a0e3cbfa0642055ed3 | {} |
| OBJ-0002 | REP-0001 | text | OBJ-0001 | available | none | RPR-0001 | ["BND-0001"] | sha256:97ffe8f198f70c6166cc40a74534ba744fdf7e9deadd06a0e3cbfa0642055ed3 | {} |

## associations

| association_id | representation_id | kind | subject_id | target_ids | state | reason | provenance_id |
| --- | --- | --- | --- | --- | --- | --- | --- |

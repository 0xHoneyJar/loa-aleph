# Representation Uses

- representation_use_format: aleph-representation-use/v1

| use_id | owner_stage | subject_kind | subject_id | basis_packet_ids | requirements | use_state | fidelity_claim | limitation_refs | reason | established_by | review_subject_digest | reviewed_by |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| USE-0701 | S2 | PKT | PKT-0701 | ["PKT-0701"] | [{"object_id":"OBJ-0002","feature":"text-bytes","binding_ids":["BND-0001"]}] | usable | none | [] | none | synthetic-manual-producer | sha256:18c91d856c7130a4456658921616c153396793b8bc1f5cb8fe68f4823a7943e8 | none |
| USE-0702 | S2 | PKT | PKT-0702 | ["PKT-0702"] | [{"object_id":"OBJ-0002","feature":"text-bytes","binding_ids":["BND-0001"]}] | usable | none | [] | none | synthetic-manual-producer | sha256:9e64f110d59ea89e1628bfa1c82b6d6fcda2065abbc07e4009c45e6284b3e3e4 | none |
| USE-0801 | S3 | CC | CC-0801 | ["PKT-0701"] | [{"object_id":"OBJ-0002","feature":"text-bytes","binding_ids":["BND-0001"]}] | usable | none | [] | none | synthetic-manual-normalizer | sha256:c43d5c56d17d5af90a94764ee2069ce13d79fbe6b88ce82882d89925886483a5 | none |
| USE-0802 | S3 | CC | CC-0802 | ["PKT-0702"] | [{"object_id":"OBJ-0002","feature":"text-bytes","binding_ids":["BND-0001"]}] | usable | none | [] | none | synthetic-manual-normalizer | sha256:3b1d422191451bf22fb463da068d3c2122e98a0c970ef01f04ece971520a91a5 | none |
| USE-0850 | S4 | REL | REL-0850 | ["PKT-0701"] | [{"object_id":"OBJ-0002","feature":"text-bytes","binding_ids":["BND-0001"]}] | usable | none | [] | none | synthetic-relation-producer | sha256:98ac2e82b4b157d1a66a9f3ecb6e2eb7e24a696961ee9320780a9c7b26792e5b | none |
| USE-0851 | S4 | REL | REL-0851 | ["PKT-0702"] | [{"object_id":"OBJ-0002","feature":"text-bytes","binding_ids":["BND-0001"]}] | usable | none | [] | none | synthetic-relation-producer | sha256:295da782453c7a4425c48da3268b709c884b247c0ffbe6b41158904151d4b7dc | none |

# F-03 C-08 exact frozen source identity clarification

Date: 2026-09-26

Status: ADOPTED — HUMAN CORE CONTRACT CLARIFICATION / IMPLEMENTATION CONTINUATION AUTHORITY

This separate repository-administration record persists the HUMAN C-08 declaration verbatim before implementation edits. It is the later controlling clarification for cumulative `1.9.0-provisional` with `orchestrator-work-transitions`; historical Slice-5 proposal/adoption bytes are unchanged. It does not establish producer completion, native replay, semantic acceptance, independent audit or finding closure.

## Bound authority and stopped state

- Adopted F-03 design: `484fa227e1ed23c81dc4cf37987aa0be16eded8f`, tree `13ad9e53a77949718afa9dc59c25c2e9d52beacb`.
- Original implementation authority: `4a999689a21b08f4d7c333e3b28362d47476d02f`, tree `755ab653bf7ef8e2d4186f937f52a098722cc6a8`.
- Retained original C-06 start: `0dcb39c6cfde4b875f8f27347739095382bcf7d5`, tree `1dfc57d526c601b5653945a98a3707d1be44f292`.
- C-07 stopped checkpoint: `141679591d4b4d4538c9216c18143805d1ecad19`, tree `a924b5b1aa209082480d496449d9abda12598b13`.
- C-07 adopted clarification: `70f4e21de5bd89abca0d4f27ae3916458482fb1c`, tree `9dbe38dcc0f781ad459ada500be1d12a06ca79a4`.
- C-08 discriminator: `1486b94a106d98bcececa3c41ab4d87917a284cd`, tree `a10c87c3aa15185300d09df52e12c66a5054ad2d`.
- Controlling local and remote C-08 stopped checkpoint: `5bfbe50209d240f8fe07af587484e842c034e691`, tree `a2e44dbcbbc5cb311da638ff9fc2263504388659`.
- Branch: `agent/f03-production-reachability-implementation-20260917`.

The C-07 authority record binds the C-01 through C-07 stop/clarification chronology. The retained inventory below binds all 39 F-03 authority, stop and evidence records found at the exact C-08 checkpoint, including the C-08 stopped handoff and all seven exact stopped-run snapshots. The first gate independently compared current filesystem bytes with retained Git blobs before this administration edit.

Primary remains clean on `agent/src-001-blind-replay-preparation-20260914`, HEAD `a568f499db6707e4787ee3da969dbd6193b04944`, tree `a72612678f8cbdc4ae2951eb5b26f1b172c71847`. Release ref is unchanged at `b9e2db742a087b8ae659ec39e476ed5e240cfa1f`; one stash remains `e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8`. All seven registrations, unrelated refs and all current index hashes equal the retained C-08 post-push snapshot. The earlier disclosed design-index serialization/cache difference is historical and was not normalized.

## Independent defect and scope boundary

The installed real-S4-entry `DUP_FORMAT` missing duplicate ledger remains independently visible. C-08 source width does not repair it or authorize a semantic choice for it. Mechanical repair may proceed only under existing adopted contracts. C-03 K2.14 and frozen source/hash authority remain strict.

Default format remains `1.8.0-provisional`; implementation format `1.9.0-provisional`; adapter protocol `1.0.0-provisional`. Predecessor runs retain exact pinned runtime/bundle authority. No source alias, repadding, frozen-source rename, generic identifier-width relaxation or migration is authorized.

F-03 OPEN / MUST PRESERVE. F-04 OPEN / MUST PRESERVE; no portability repair. F-05 OPEN / MUST PRESERVE and bounded by F-03. Provider/model calls, genuine native execution, live corpus/SRC-001 activity, closed references, release work, ingestion, PR, merge, sanction, governance/semantic acceptance, finding closure and v1 remain prohibited. No prohibited operation occurred during the first gate.

## Exact HUMAN declaration

The following text is copied verbatim from the user message, without normalizing whitespace or identifier spelling. Its exact UTF-8 byte count is 15,687 and SHA-256 is `3cabe069aeb90cf32677c82beb51933a12185b93aad2b84a4f6d2afeb242e3b5`.

<!-- BEGIN VERBATIM HUMAN C-08 DECLARATION -->
I clarify the adopted F-03 accepted-worker-return production-reachability design for cumulative run format `1.9.0-provisional` and capability `orchestrator-work-transitions` as follows.

## C-08 governing rule

For cumulative `1.9.0-provisional` runs using `orchestrator-work-transitions`, every C2 field that denotes a corpus source MUST carry the exact frozen `source_id` assigned to that source by the run's authoritative frozen corpus inventory.

C2 does not own a second source-ID namespace.

C2 MUST NOT repad, rename, alias, canonicalize to a different numeric width, or otherwise transform a frozen source identity.

The lexical grammar for a source identity in these C2 surfaces is:

```text
^SRC-\d{3,}$
```

This is a minimum-width-three grammar, not an exactly-three-digit grammar.

A lexical match is necessary but not sufficient. Where a C2 object refers to a particular source, the token MUST additionally equal byte-for-byte the exact `source_id` of the applicable frozen source row.

Therefore:

- `SRC-001` is a legal source identity when that is the exact frozen source ID;
- `SRC-999` is legal when it is the exact frozen source ID;
- `SRC-1000` is legal when naturally allocated as that exact frozen source ID;
- `SRC-0001` is NOT an alias for frozen `SRC-001`;
- `SRC-01` is illegal;
- an otherwise well-formed `SRC-777` that is absent from the frozen source inventory is illegal;
- no C2 producer, worker, reviewer, adapter or checker may create an alternate-width representation of an existing frozen identity.

## Root source identity controls

This clarification resolves the C-08 conflict in favor of the repository's established corpus/source identity model.

The run's frozen source inventory is authoritative for source identity.

The existing source allocation semantics remain unchanged.

In particular, this clarification does NOT authorize changing production intake from its existing minimum-width-three allocation behavior merely to satisfy later-stage C2 formatting.

A frozen run whose source is `SRC-001` remains `SRC-001` throughout its entire derivation trail.

The exact identity must survive reopening, search, ambiguity review, material-impact review, procedural authority work, checking, recovery and downstream provenance.

## Scope of the correction

The minimum-width-three rule applies only to `SRC-*` identities and serializations that carry a source identity.

It does NOT alter the independently adopted grammar of other identifier families.

Existing requirements for such families as:

- `PKT-*`;
- `CC-*`;
- `REL-*`;
- `WLK-*`;
- `CUR-*`;
- `AMB-*`;
- `VER-*`;
- gate/request identities;

remain unchanged unless some separately adopted Core rule says otherwise.

C-08 MUST NOT be implemented as a broad substitution of every `\d{4,}` identifier predicate with `\d{3,}`.

## C2 source-locus candidates

For a C2 source-locus candidate:

```json
{"kind":"source-locus","source_id":"<exact-frozen-source-id>","locator":"<canonical-locator>","span_hash":"sha256:<64-lowercase-hex>"}
```

`source_id` MUST:

1. satisfy the minimum-width-three source-ID lexical grammar;
2. resolve to exactly one frozen source row;
3. equal the source identity governing the ambiguity/search basis where same-source semantics require that equality;
4. remain byte-for-byte unchanged from the frozen inventory.

The candidate's `locator` and `span_hash` requirements remain unchanged.

This clarification does not weaken same-source, exact-reopening, span-hash, candidate-ordering, currentness or review requirements.

## C2 search source and completion references

`T5.1 source_id`, `T5.2 search_source_id`, search-basis `source_id`, and every other C2 field whose semantic type is a source identity MUST use the exact frozen source ID.

Where a full-same-source completion reference is serialized, its form is conceptually:

```text
<exact-frozen-source-id>@<legal-final-cursor-id>@<exact-source-hash>
```

For example, a run whose frozen source identity is `SRC-001` may legally bind:

```text
SRC-001@CUR-0001@sha256:...
```

provided the cursor, completion and hash satisfy all existing Core predicates.

The source token is not repadded to `SRC-0001`.

The cursor's own identifier grammar is unchanged.

Local-interval `WLK-*` references remain under their existing grammar.

## Search-basis serialization

The canonical search-basis serialization MUST serialize the exact frozen `source_id` value.

A historical design notation such as:

```text
"SRC-NNNN"
```

does not authorize changing a real frozen identity from `SRC-001` to `SRC-0001`.

For cumulative 1.9 implementation, source placeholders in Slice-5 examples are governed by this clarification wherever numeric-width notation conflicts with the authoritative frozen source identity.

Historical proposal and adoption records MUST NOT be rewritten.

Instead, this C-08 clarification is retained as the later controlling clarification for source-reference width.

All digest calculations continue to bind the exact serialized bytes.

Changing `SRC-001` to `SRC-0001` would therefore be a different and illegal basis, not a harmless presentation normalization.

## Material-impact source locators

A material-impact `source_locator` MUST use:

```text
<exact-frozen-source-id>:<canonical-source-locator>
```

For an `md-lines` source this may be:

```text
SRC-001:L1-L4
```

when `SRC-001` is the exact bound frozen source ID and `L1-L4` reopens an existing exact locus under the existing locator rules.

Validation MUST separate:

1. source-ID lexical validity;
2. exact frozen-source identity equality/membership;
3. canonical locator syntax;
4. exact locus reopening.

It MUST NOT require four source digits merely because the locator is used by C2.

It MUST continue to reject:

- an unknown source ID;
- an alternate-width alias;
- a locator crossing the bound frozen source;
- a malformed line span;
- a nonexistent locus;
- any locator inconsistent with the source's retained scheme.

## No source aliases

No alias table is introduced.

The following are forbidden:

```text
SRC-001 -> SRC-0001
SRC-002 -> SRC-0002
```

or any equivalent mapping.

C2 ledgers, search bases, semantic-review subjects, material-impact subjects, authority subjects, gate files, hashes, journal records and checker projections MUST carry the original identity directly.

An alias would create two names for one frozen object and weaken exact reopening and derivation inspection; it is therefore not authorized.

## No frozen-source rename

An existing frozen source row MUST NOT be renamed to repair C2.

The implementation MUST NOT mutate:

- frozen corpus inventory source IDs;
- source filenames merely to obtain a new identity;
- source-walk rows;
- packet source references;
- claim provenance;
- relation source references;
- source hashes;
- retained run pins;
- retained bundle/runtime identity.

C-08 is a C2 source-reference grammar repair, not a frozen-corpus migration.

## Mechanical Core helper

The implementation SHOULD centralize the cumulative 1.9 source-reference predicate rather than retaining divergent local width regexes.

The logical predicate is:

```text
legalSourceIdSyntax(id)
    := /^SRC-\d{3,}$/.test(id)

legalFrozenSourceRef(model, id)
    := legalSourceIdSyntax(id)
       AND exactly one frozen source row has source_id == id
```

Where a field is bound to a particular source, Core must additionally require:

```text
id == expectedFrozenSourceId
```

A caller-provided Boolean saying that a source is valid is not authority.

The actual frozen model and exact field bytes must be checked.

## Numeric ordering

Where deterministic ordering of source references is required, numeric ordering may continue to use the decimal suffix.

Numeric comparison does not erase identity.

For example, `SRC-001` and `SRC-0001` may have the same numeric value, but they are not interchangeable identities.

Because an alternate-width alias is not legal for the same frozen source, Core MUST NOT normalize either token before equality, hashing or serialization.

## Duplicate and collision protections

C2 MUST reject any condition in which:

- two frozen source rows have the same exact `source_id`;
- a C2 candidate references an absent source;
- a source-locus candidate's source differs from its required same-source basis;
- a source locator's prefix differs from its bound source;
- an attempted alternate-width spelling numerically resembles an existing source but is not its exact ID.

No numeric-suffix equivalence may substitute for exact identity equality.

## Existing Slice-5 semantics remain unchanged

This clarification changes only the erroneous source-width assumption.

It does not weaken:

- same-source search;
- frozen-corpus boundaries;
- exact source hashing;
- exact locus reopening;
- full-source completion requirements;
- candidate-state semantics;
- typed-null semantics;
- candidate ordering;
- lineage currentness;
- ambiguity review;
- material-impact review;
- Class B/Class C rules;
- procedural human authority;
- C1/C2/C3 barriers;
- checker independence.

Facts outside the frozen corpus remain unresolved.

A source-width repair must not turn a structurally invalid semantic object into a semantically accepted one unless every independent existing predicate is also satisfied.

## Historical C-08 evidence

The existing C-08 discriminator evidence MUST remain retained.

In particular:

- the exact `SRC-001` refusal under the pre-clarification four-digit predicate remains historical evidence of the conflict;
- the synthetic `SRC-0001` passing control remains only a discriminator proving the width dependency;
- that control MUST NOT be recharacterized as authority for an alias or frozen-source rename;
- the interrupted installed run remains labeled according to its actual reached stage;
- no installed C2 success may be retroactively claimed from the synthetic discriminator.

## Required focused tests

The C-08 implementation must add or retain positive and negative controls covering at minimum:

1. exact frozen `SRC-001` accepted as a C2 source identity;
2. exact frozen `SRC-999` accepted when present;
3. exact frozen `SRC-1000` accepted when naturally present;
4. `SRC-01` rejected;
5. absent `SRC-777` rejected even though lexically valid;
6. `SRC-0001` rejected when the frozen source is `SRC-001`;
7. candidate source-locus using exact `SRC-001` accepted when every other predicate passes;
8. candidate alternate-width alias rejected;
9. source-locus candidate crossing to another frozen source rejected;
10. canonical candidate ordering remains deterministic;
11. search-basis `source_id` preserves exact frozen bytes;
12. search-basis digest changes if source identity bytes are changed;
13. `search_source_id` must exactly equal the T5.1 source ID where required;
14. full-same-source completion reference accepts exact `SRC-001@CUR-...@sha256:...`;
15. repadded `SRC-0001@CUR-...` is rejected for frozen `SRC-001`;
16. material `source_locator` accepts `SRC-001:L...` where the locus exists;
17. alternate-width material locator is rejected;
18. locator bound to another source is rejected;
19. malformed locator remains rejected;
20. nonexistent locus remains rejected;
21. PKT four-digit grammar remains unchanged;
22. REL four-digit grammar remains unchanged;
23. WLK and CUR grammars remain unchanged;
24. predecessor-format behavior remains unchanged;
25. source/runtime parity holds;
26. generated runtime matches source;
27. existing C-08 discriminator remains retained and still demonstrates the historical conflict against the pre-clarification projection;
28. installed fresh-process C2 progression uses the actual frozen `SRC-001`, not a fixture-only four-digit source.

## Predecessor compatibility

This clarification is additive to cumulative `1.9.0-provisional` with `orchestrator-work-transitions`.

It does not migrate retained 1.2–1.8 runs.

Those runs continue under their pinned Core, checker, adapter, runtime and bundle.

Repository/default format remains `1.8.0-provisional`.

Adapter protocol remains `1.0.0-provisional`.

No retained run may substitute mutable current repository bytes for its pinned runtime.

## Separate S4 duplicate-ledger defect

C-08 does not resolve or suppress the separately retained installed S4-entry failure:

```text
DUP_FORMAT ledgers/duplicate-review.md:
ledger required on real S4 entry, including zero candidates
```

That failure must remain independently visible and must be handled under existing adopted Core rules if its repair is mechanical.

If resolving it requires a new semantic/Core-policy choice not already authorized, implementation must stop for another HUMAN Core decision.

C-08 success MUST NOT be used to claim S4 production reachability while that separate failure remains unresolved.

## Continuation authority

I authorize the existing F-03 implementation branch at stopped checkpoint:

```text
5bfbe50209d240f8fe07af587484e842c034e691
```

tree:

```text
a2e44dbcbbc5cb311da638ff9fc2263504388659
```

to persist this C-08 clarification separately and resume the previously authorized implementation solely under the adopted F-03 design as clarified by C-01 through C-08.

Before implementation edits, verify:

- branch and remote HEAD equal `5bfbe50209d240f8fe07af587484e842c034e691`;
- tree equals `a2e44dbcbbc5cb311da638ff9fc2263504388659`;
- implementation worktree and index are clean;
- all seven retained worktree registrations remain present;
- unrelated refs remain unchanged;
- primary checkout remains preserved;
- release branch remains preserved;
- stash remains preserved;
- historical C-01 through C-08 stop, authority and evidence records remain exact.

Persist this C-08 clarification in a separate administration commit before implementation changes.

Do not rewrite the historical Slice-5 proposal to make its old `SRC-NNNN` examples disappear. Register this clarification as the controlling later Core clarification and update the operative cumulative-1.9 implementation, tests, templates/checks where required, generated runtime and manifests consistently.

After C-08 reconciliation, continue the entire previously authorized F-03 implementation.

Passing the focused C-08 tests alone is not producer completion.

Outstanding obligations remain, including:

- completion of exhaustive S2 production-controller coverage;
- completion of S3 lifecycle coverage;
- complete S4 C1/C2/C3 production composition;
- resolution and verification of the retained real S4 duplicate-ledger entry failure;
- legal post-S4 unsupported-capability boundary;
- complete process-boundary authentication and replay/tamper refusal;
- writer-bypass refusal;
- full Architecture-B crash/recovery matrix;
- exactly-once canonical-effect verification;
- retained-runtime qualification;
- installed command/skill integration;
- predecessor 1.2–1.8 compatibility qualification;
- supported-surface F-05 refusal evidence;
- final deterministic source/runtime/generated-runtime/conformance/mutation/install/package qualification.

This clarification does not authorize:

- provider/model calls;
- genuine native worker execution;
- live corpus execution;
- SRC-001 blind replay;
- closed-reference access;
- release preparation or publication;
- Loa ingestion;
- PR creation;
- merge;
- sanction;
- governance or semantic acceptance;
- F-03 closure;
- F-04 closure;
- F-05 closure;
- v1 declaration.

F-03 remains OPEN / MUST PRESERVE.

F-04 remains OPEN / MUST PRESERVE.

F-05 remains OPEN / MUST PRESERVE and bounded by F-03.

If another unadopted semantic/Core-policy conflict appears, implementation MUST stop rather than infer the rule.
<!-- END VERBATIM HUMAN C-08 DECLARATION -->

## Retained historical inventory at the starting checkpoint

| Path | Git blob | SHA-256 | Bytes |
|---|---|---|---:|
| `calibration/src-001/core-design-basis/ADOPTED-f03-degraded-packet-l2s-binding-clarification-20260917.md` | `7c6c665af3988f588d637a7dc8b6d162819d7ab8` | `01d50b0795c029f1cced0e5d81cc988e4f3a55d240da78a542d0ad18f0c14222` | 6797 |
| `calibration/src-001/core-design-basis/ADOPTED-f03-indeterminate-claim-nonaffirmative-binding-clarification-20260918.md` | `0415f33086192103052f175c3fab9125cf483371` | `4188d2c22e781ff1237cda4f098575696d66dc6a0b5a69b15cfadf93ff00ed02` | 22000 |
| `calibration/src-001/core-design-basis/ADOPTED-f03-pending-extraction-event-commitment-clarification-20260917.md` | `4d8187dfb2475a2ab4641bfa6918b07945ff8484` | `ccc6b247b645c8bac359f841c0073c86843502d60c2934cba447a88f96f73f1e` | 10152 |
| `calibration/src-001/core-design-basis/ADOPTED-f03-post-s2-packet-widening-clarification-20260918.md` | `ad54923e02350e7b47326bc4ce3fc8278e6117e9` | `f23913cddfa2043fe8cee836cc3f5ee29a2e0837324501eec79c6031d3619ad4` | 24866 |
| `calibration/src-001/core-design-basis/ADOPTED-f03-production-reachability-design-20260917.md` | `465af089f8f23b28b2a4339047c76a8a4d143c34` | `1ea635dc2bc0d5693bac339f39bb00e0b797bab8b95e1228d142d1db484d4195` | 2005 |
| `calibration/src-001/core-design-basis/ADOPTED-f03-s3-widened-packet-relation-ownership-clarification-20260919.md` | `c92907667335809e2063145da87f06f15226536f` | `7067ed53abbf7f5bec7b49f938acd10857da199e1a0b3aaac7e0a2552fe7d744` | 25975 |
| `calibration/src-001/core-design-basis/ADOPTED-f03-source-walk-completion-current-state-clarification-20260917.md` | `f0dce703ae9791bd8285f3ed2d539e59c4c41c97` | `e6987f6143e823cda0cb5a3211c109cca9bdd5ea8af464b0b61447900802db35` | 8550 |
| `calibration/src-001/core-design-basis/ADOPTED-f03-stationary-degraded-capture-accounting-clarification-20260926.md` | `5ec99766ce3287fbd89b46a1b5ce81e13bef67e9` | `02f2eb9c4fc088be2b59344d064d034f787aeb6713658c9ca305999ba554b4f1` | 30284 |
| `calibration/src-001/core-design-basis/AUTHORIZED-f03-production-reachability-implementation-20260917.md` | `df61a2f4f240bc812ebbc1a1e6196da7d92345b9` | `a1d3e6246c1eef9c8a001b3a43a41e1d40e77dbeb3b21ae1859948e687641ef5` | 6229 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c03-stopped-checkpoint-20260917.json` | `71d1525695e1a7b83d0013bde605904f97856594` | `2ec8724f121be3fe408c8d37f5cde016fcfcf7e7ea42a9a93c74ddab63911b62` | 344856 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c04-stopped-checkpoint-20260917.json` | `5730f8bdb58ef5140ba096e267885ec930105379` | `54b7092fd8c8621b2ecec19bbe4d207d61bbeafefd0f8f393a38a33882f2329a` | 1153117 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c05-installed-rendering-repair-progress-20260926.json` | `a437bf2253a55f06c2a720b25e093cf697bcb61b` | `e7411962d1284db8c9868f1a84fba204844116ec11ea64a5d9e6672165d278e9` | 15557635 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c05-stopped-checkpoint-20260918.json` | `ab3f0496c45a701ff5ffa2bf4658fd24e9104bb9` | `05c0a48175b843502fea9933164a1d4199095495218078529de954a2dfba930c` | 7317851 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c06-continuation-progress-20260926.json` | `a13067e6103e49265f48ab05d78c4a03678a2d88` | `1a7c2cfc918926847329f757e816a59af7d4b1b01de00637d256ada5025bedee` | 1705491 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c06-stopped-checkpoint-20260919.json` | `5b3fc8e3ac723dfb717074bd6ad48382b040572a` | `064a9fe18483b5d0d746a00f2fed781a45ff7b3c00feab8f2ee1d99322ac9b35` | 1447510 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c07-accounting-implementation-progress-20260926.json` | `91f165469bfd3743009311aa8c366b35b8142979` | `ffa3cabf6fa0094952313f110b6daeb1ca29433e449568fc01c836e8a4c0f4c1` | 229402 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c07-installed-recovery-and-s4-progress-20260926.json` | `7cd244778f3feca90b589dcdd0cf1a796c6588ed` | `71c3ba9420feb4fcfa863791f880bcef1d138e01a047434426d40ffd6a900673` | 26847577 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c07-stopped-checkpoint-20260926.json` | `b2f6ca144e8b46b47491a3eed1176886a4feed8a` | `943d34d80eadd1caa6babfd753fa20e3f0f886d8f54ca039c09af579f10dd0ff` | 24561016 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c07-worker-request-byte-binding-repair-20260926.json` | `1b163264ceff43da5accc2f351060b4bd2c7a091` | `4502c6d96cadf918bc45f9836fab91e03a5088592ec39546a2ad55b600a3a3cb` | 6000053 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c08-source-reference-conflict-and-stopped-handoff-20260926.json` | `3be2b3d23ae597a440fe17ce466af6dc71031eef` | `0fb221ebd84753a5e98d6d64a9239e6048f41ec68db73461c510c6531a39c43c` | 596865 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c08-stopped-run-snapshot-01-20260926.json` | `0754f24af57a264d3a3ba12aff167b6d5c67e389` | `68bcae5db298ba02f9db433bcc15fb8a5eec2c03e0b890fec751b7d0a6fdd259` | 7982839 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c08-stopped-run-snapshot-02-20260926.json` | `47a77ffec184ef7e5f53493f4a24744bdc24525c` | `673fc24cdde2c01b59fcdb1f2a906c7218b6c6667a18028e5a434a60bea80afb` | 8151580 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c08-stopped-run-snapshot-03-20260926.json` | `254a0d2384999297f961f25018b0b244cba419de` | `cfc27cc53f4337117fe3d07ff9f324bf7736ef473cbbe802921e4f19d3246f5e` | 10696760 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c08-stopped-run-snapshot-04-20260926.json` | `96b69a5e1e60eb3bf282ed88fb623c576163816d` | `b892455af8ca5c2f4af3c912bf9f8cf0ea9b512a0fc2a1d15c73eecbbe360fbb` | 9783937 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c08-stopped-run-snapshot-05-20260926.json` | `31acd26420ca4080f1e855c20600f6d2747a5ac9` | `8700c52b40e567d6988c60784eb785c0286a64b3ce15c0de9eae8be3d3290bb3` | 7165593 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c08-stopped-run-snapshot-06-20260926.json` | `2b5d894b3f5d52d991f310d60c76b4b6adc39c2d` | `fc34ed4afb31f819ba17f1da64e71ada1094cf5494a18aff532700f42ad254a1` | 5147982 |
| `calibration/src-001/core-design-basis/EVIDENCE-f03-c08-stopped-run-snapshot-07-20260926.json` | `bf3059a262a9ddc2964c1c1e944a63db4cd81279` | `85466c5667bc9f022c4ae29835c131e35419e74b9fb7385380981fd7cef4f1f9` | 3522274 |
| `calibration/src-001/core-design-basis/PROPOSED-f03-accepted-worker-return-production-reachability-design-20260917.md` | `b5fd008ff2aab18cb632c248cb8259735d053714` | `6144bef6f06ee55e8507d7019c13658b0404a0bafe3f8aebe09f6a18a80f1524` | 94757 |
| `calibration/src-001/core-design-basis/STOPPED-f03-c08-source-reference-width-conflict-20260926.md` | `b0de9656d97a63bc28d6ddc5892fc374376af46c` | `dce30c41cf2c58fb8bc3758698848404e7cf44c86f1f208f9783a51ce3702d65` | 27606 |
| `calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-core-contract-conflict-20260917.md` | `893bcc16f1dde9793b7a367ad4d4c5cba96930bb` | `4f052dc4648fc963bd62b129cad47a19c25f2a2e7c1bb531dc65df31f27d562a` | 15918 |
| `calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-indeterminate-claim-binding-conflict-20260917.md` | `5a107ba93ccd7ae46a483101f24b7a6adc733fac` | `82a0e059b52e5d175c751e720f0e24dee4721d5ca008311ccfecd73f2d722acf` | 37494 |
| `calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-s3-packet-relation-ownership-conflict-20260919.md` | `115927cd8db35a22ee7f9322a6dfaee2cf24df64` | `4aaba38fef84b6e32ced22939a3b40d5b55bb88e343ceff46a76005263b63db5` | 38860 |
| `calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-s3-packet-widening-conflict-20260918.md` | `fda1af9e38920f8d3ef85de9dc8c3255d61f32b3` | `5a71cfdd727b38d6575718aa3b290fc694c064a672404f88fa9506224c75ac66` | 32263 |
| `calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-shared-position-event-continuation-conflict-20260917.md` | `321692735b31b33e5d343848d171041260065c88` | `11e34ce1f2e1484913a8dafa37e07226edaa8f9014c8f611eeac91f1ee39600b` | 27677 |
| `calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-source-walk-transition-conflict-20260917.md` | `1bf02d7de3cf458358e7fdefead8267f33580ee9` | `b3aef9f0f7c8a514095fb191e041ec07a6bd15d894d0cd7ee6ac34859edb5c84` | 24015 |
| `calibration/src-001/core-design-basis/STOPPED-f03-production-reachability-implementation-stationary-degraded-capture-conflict-20260926.md` | `4328fd8d3d49c8fe99b704ffcc7f504c1dfb6fbe` | `368e19539c284fa029898a6e936c0fe563bd3919577d75e218012b2706651700` | 32153 |
| `calibration/src-001/core-design-basis/f03-continuation-structural-checks-20260917.json` | `7f3de0e5e88cbf7498d67c9d5d27581dc2d64389` | `3e63e45551928492b50b9ce379d0e733a7b2e1073f0b5f114b85d4885a78a3ea` | 197140 |
| `calibration/src-001/core-design-basis/f03-degraded-candidate-binding-conflict-20260917.json` | `36f2d29c7ba36db61912d8ace9cac22f6b7fd70a` | `437f1dadebeed20dcbc27a2c361c1426f6a983026506cae3235e765696fe753a` | 794 |
| `calibration/src-001/core-design-basis/f03-source-walk-transition-conflict-20260917.json` | `8d9aef8ebcb32775385d081e772a3bf0b4122a90` | `a4a4879332a0ac20baee42ca49719caf8b2eaa974cc0517b4a74b63bb3c7869e` | 8415 |

## First-gate receipt

```json
{
  "result": "PASS",
  "recorded_at": "2026-09-26T16:52:20.580789+00:00",
  "head": "5bfbe50209d240f8fe07af587484e842c034e691",
  "tree": "a2e44dbcbbc5cb311da638ff9fc2263504388659",
  "branch": "refs/heads/agent/f03-production-reachability-implementation-20260917",
  "remote_head_verified": "5bfbe50209d240f8fe07af587484e842c034e691",
  "remote_verification": "git ls-remote origin exact branch returned required HEAD; successful read-only network verification before any repository edit",
  "worktrees": "worktree /home/eileenspectremoon/loa-dev/loa-aleph\nHEAD a568f499db6707e4787ee3da969dbd6193b04944\nbranch refs/heads/agent/src-001-blind-replay-preparation-20260914\n\nworktree /tmp/loa-aleph-f03-design-20260917\nHEAD 484fa227e1ed23c81dc4cf37987aa0be16eded8f\nbranch refs/heads/agent/f03-production-reachability-design-20260917\n\nworktree /tmp/loa-aleph-f03-implementation-20260917\nHEAD 5bfbe50209d240f8fe07af587484e842c034e691\nbranch refs/heads/agent/f03-production-reachability-implementation-20260917\n\nworktree /tmp/loa-aleph-s5a2-final-17e1d1a.lkyTtl\nHEAD 17e1d1acda17a38d72214af5022b8145220f96d8\ndetached\n\nworktree /tmp/loa-aleph-s5a2-repair-20260908.EoH8Ki\nHEAD 17e1d1acda17a38d72214af5022b8145220f96d8\ndetached\n\nworktree /tmp/loa-aleph-s7-retained-adoption-094a7ce\nHEAD 094a7ce3220631c8d4ee4c179e79b9b4529b6681\ndetached\n\nworktree /tmp/slice6-pre16-authority\nHEAD e45a1d9b1cafc5ef3b6a1fb46a61a8a395d45770\ndetached",
  "refs": "refs/audit/pr46-head ea5e5e5508c5dd40d012a29bdf9a925652c40c34\nrefs/audit/pr47-head 0fe3bb8bf31b837806ba3da94d5466a7e63721ec\nrefs/audit/pr49 f8aadc2160826e2df736a946188c92158ec354aa\nrefs/audit/pr49-head ffdd65bb6a6e599b3d506b8c3bd8b9b9900d586c\nrefs/heads/agent/add-src-001-batches-07-12-audit af5e591db48b11dc55b6ca6d49e16e9acec03949\nrefs/heads/agent/f03-production-reachability-design-20260917 484fa227e1ed23c81dc4cf37987aa0be16eded8f\nrefs/heads/agent/f03-production-reachability-implementation-20260917 5bfbe50209d240f8fe07af587484e842c034e691\nrefs/heads/agent/fix-bundle-review-findings 66200653cce5d819ae2b12ad854b1b7216560c3d\nrefs/heads/agent/fix-corpus-frozen-validation a4198aaf49f032812c2782da7d568492c4e94f8e\nrefs/heads/agent/fix-live-run-conformance 80738670b0fdc74715d8d764c6a5a9679318d384\nrefs/heads/agent/fix-typescript-linguist-shebang ef6ed916d3be080514f3cc59bab35f0bd587a242\nrefs/heads/agent/immutable-host-bundles 456bb3788aca1e46a978d82858f0b6b71c2c78e9\nrefs/heads/agent/loa-adapter-release b9e2db742a087b8ae659ec39e476ed5e240cfa1f\nrefs/heads/agent/loa-live-attestation 96156c1b5f390561245db547628ad3d301cbacaa\nrefs/heads/agent/manual-calibration-design-20260731 5472292fd2cbd8de4bdc5ddac17406ef25009b2b\nrefs/heads/agent/oq-01-human-procedural-authority acaca4b43fa3e2dbf3c94a53de63317866182671\nrefs/heads/agent/pr39-src001-closed-reference-update-20260811 677f27116265a7cd3c21bbe05f3b31a63061ef50\nrefs/heads/agent/pr42-retained-stage-floor-20260815 ad923a1038d6b3f6d55214df039321193e3157c4\nrefs/heads/agent/propose-correction-effective-state-decision 8bbf64c4cff9b2be5295eb8fa7a81a212a3eaf97\nrefs/heads/agent/runner-capability-contract 485d52f2b20e7534f668257ca941838301c11031\nrefs/heads/agent/slice-01-exact-evidence-fragments cecef33991f306c13ccdce0c93cb6ac47b7ffccd\nrefs/heads/agent/slice-02-source-walk-accounting 14718dc81e3213a36a729541e51ef2f522add75d\nrefs/heads/agent/slice-03-unified-lineage-repair3 ea5e5e5508c5dd40d012a29bdf9a925652c40c34\nrefs/heads/agent/slice-04-typed-relations-design be064f53eb347269512a7f3462fc4171ed3aae5d\nrefs/heads/agent/slice-04-typed-relations-implementation 5f415f44e243151279a2ff5666611d45496f9e8c\nrefs/heads/agent/slice-05-ambiguity-lifecycle-design ffdd65bb6a6e599b3d506b8c3bd8b9b9900d586c\nrefs/heads/agent/slice-05-internal-ambiguity-implementation 51725cf32c0e4b6c5cd552275793b54960ca914e\nrefs/heads/agent/slice-06-formal-layout-design-20260911 e45a1d9b1cafc5ef3b6a1fb46a61a8a395d45770\nrefs/heads/agent/slice-06-formal-layout-implementation-20260911 c0ec43142710f39d50e7b7681760209112a0e17c\nrefs/heads/agent/slice-07-semantic-review-design-20260912 094a7ce3220631c8d4ee4c179e79b9b4529b6681\nrefs/heads/agent/slice-07-semantic-review-implementation-20260912 b1c574c5b47eb5734a8c3077f97c677116ec7cb3\nrefs/heads/agent/slice-08-duplicate-overlap-design-20260913 40de9df863396336240f61e23c342b11d389daa8\nrefs/heads/agent/slice-08-duplicate-overlap-implementation-20260913 0ff5443dd587bb287ae6bdf62985294e6d8dc19a\nrefs/heads/agent/src-001-blind-replay-harness-design-20260914 84b6d9d734ab68f3986ce6b969ea0fb6e577bad2\nrefs/heads/agent/src-001-blind-replay-harness-implementation-20260914 82b0a184b4bf693381b6e22851a08aa66b6a04ba\nrefs/heads/agent/src-001-blind-replay-preparation-20260914 a568f499db6707e4787ee3da969dbd6193b04944\nrefs/heads/agent/src001-audited-core-design-basis 3f028ebbd17a2736a3631fbd9c3abc90a2c31675\nrefs/heads/agent/typescript-first-runtime fd4d723f780039f677c6001acab3d650bc7dad6d\nrefs/heads/aleph-doctrine-projection-stage 08d141e05af96dc92eb654829dfebc92d661c2ab\nrefs/heads/aleph-slice-1-v0-precis-fixture f166293a1ea2d386d5cbc9211f081bfea870050f\nrefs/heads/aleph-slice-2-adversarial-precis-stress-matrix a306ad126741a9eacd3cf0fdf09dcf1bffe863cb\nrefs/heads/aleph-slice-3-precis-conformance-checker 7265c65feee008bfa4fb9357526c69ec2edd8e4c\nrefs/heads/aleph-slice-4-cross-section-consistency fcc7fa50fa7cf88266882f286e3c5868658a6a68\nrefs/heads/aleph-slice-6-front-door a63adae9dc87dbf89d03acb443ba7df29b4ecc50\nrefs/heads/claude/loa-aleph-architecture-plan-x6it5c e55f1cc793bd040dbdb52fe3a62e2ba4d9d65d6b\nrefs/heads/codex/aleph-method-product aeacdcf37e881bf1eb3d6aa0a325b73013618203\nrefs/heads/docs-correct-projection-checker-scope 16d56c33318741ef4b54292d2a4d9881093d17cd\nrefs/heads/main c949ea5f39daef42d22ca2e4111164d63dffcbf1\nrefs/remotes/origin/HEAD 8236b9f35c38cdd604b2389b42589f27755cdade\nrefs/remotes/origin/agent/add-src-001-batches-07-12-audit 677f27116265a7cd3c21bbe05f3b31a63061ef50\nrefs/remotes/origin/agent/chromatography-2026-06-30-aleph-report-fixture 6f0637f376f18903479346faaecd8976b8750f56\nrefs/remotes/origin/agent/fix-corpus-frozen-validation a4198aaf49f032812c2782da7d568492c4e94f8e\nrefs/remotes/origin/agent/immutable-host-bundles 456bb3788aca1e46a978d82858f0b6b71c2c78e9\nrefs/remotes/origin/agent/loa-live-attestation 96156c1b5f390561245db547628ad3d301cbacaa\nrefs/remotes/origin/agent/oq-01-human-procedural-authority 673869e255e507a1e5177d27a3fd67d08f545ac7\nrefs/remotes/origin/agent/propose-correction-effective-state-decision 8bbf64c4cff9b2be5295eb8fa7a81a212a3eaf97\nrefs/remotes/origin/agent/propose-slice-3-unified-lineage-design 03387aff079b02a685dda846ed115cea5d794ea7\nrefs/remotes/origin/agent/restore-pr13-open-after-revert ffdbf4fd6aeebb0271827548d358058e19df132e\nrefs/remotes/origin/agent/runner-capability-contract 485d52f2b20e7534f668257ca941838301c11031\nrefs/remotes/origin/agent/slice-01-exact-evidence-fragments ef7f50d1f1c2783464ffdf058317daa22a6ba1d3\nrefs/remotes/origin/agent/slice-02-source-walk-accounting ad923a1038d6b3f6d55214df039321193e3157c4\nrefs/remotes/origin/agent/slice-03-executor-trigger e80cca6d1fdf4a369ba9a9fca40f56c3bc0ee268\nrefs/remotes/origin/agent/slice-03-unified-lineage ea5e5e5508c5dd40d012a29bdf9a925652c40c34\nrefs/remotes/origin/agent/slice-04-typed-relations-design be064f53eb347269512a7f3462fc4171ed3aae5d\nrefs/remotes/origin/agent/slice-04-typed-relations-implementation 5f415f44e243151279a2ff5666611d45496f9e8c\nrefs/remotes/origin/agent/slice-05-ambiguity-lifecycle-design 84b8f57670c301c5fc8b0d7b1b5f6581f514340e\nrefs/remotes/origin/agent/slice-05-internal-ambiguity-implementation f60d0a118e0f0f2b105b05923adbdc8ebbbb79f2\nrefs/remotes/origin/agent/src001-audited-core-design-basis 3f028ebbd17a2736a3631fbd9c3abc90a2c31675\nrefs/remotes/origin/aleph-slice-1-v0-precis-fixture f166293a1ea2d386d5cbc9211f081bfea870050f\nrefs/remotes/origin/aleph-slice-2-adversarial-precis-stress-matrix a306ad126741a9eacd3cf0fdf09dcf1bffe863cb\nrefs/remotes/origin/aleph-slice-3-precis-conformance-checker 7265c65feee008bfa4fb9357526c69ec2edd8e4c\nrefs/remotes/origin/aleph-slice-6-front-door a63adae9dc87dbf89d03acb443ba7df29b4ecc50\nrefs/remotes/origin/claude/loa-aleph-architecture-plan-x6it5c e55f1cc793bd040dbdb52fe3a62e2ba4d9d65d6b\nrefs/remotes/origin/codex/add-eileen-daily-implementation-agent-20260627 22974ca2f17f3c45cece503272e07c713d0e30c4\nrefs/remotes/origin/codex/aleph-method-product aeacdcf37e881bf1eb3d6aa0a325b73013618203\nrefs/remotes/origin/docs-correct-projection-checker-scope 16d56c33318741ef4b54292d2a4d9881093d17cd\nrefs/remotes/origin/main 8236b9f35c38cdd604b2389b42589f27755cdade\nrefs/remotes/origin/phase-0-aleph-responsibility-precis-wedge 269f331315cd1177dd71b2f578deaa584d82c1e1\nrefs/remotes/origin/proposal/0005-host-portability-ports 43fbf2b9c2a22ffb9b393c94b660ad209ba4b805\nrefs/remotes/origin/revert-13-agent/chromatography-2026-06-30-aleph-report-fixture ccfac51309c8fd3f9a7226eaaf40704b2b52ee8b\nrefs/remotes/origin/revert-14-revert-13-agent/chromatography-2026-06-30-aleph-report-fixture 89f35665f828e546a2ca2c8ea5d08cfe3a89bd11\nrefs/stash e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8\nrefs/tags/aleph-for-loa-sha256-0aea77e950a33e85ba37816141dfa57c5766c723df3a2b5ac6742f71729fc734 ea5e5e5508c5dd40d012a29bdf9a925652c40c34\nrefs/tags/aleph-for-loa-sha256-272cff05be471c0beab6f3a80e91b590795a9fc3f9495363a445a0511d234294 ad923a1038d6b3f6d55214df039321193e3157c4\nrefs/tags/aleph-for-loa-sha256-3422b70cc5ce05a1466360ee677ad41b961764b0ac226611a8cedb6a92eb0315 5f415f44e243151279a2ff5666611d45496f9e8c\nrefs/tags/aleph-for-loa-sha256-6aba79570d17bd956923444da6c646bab6653eb8111002e3d9fb7b686c6095f6 ea91b13d66d73dacd1acbc0d2f5f2a262a7db5c8\nrefs/tags/aleph-for-loa-sha256-8c4954fc9b08f32ba254a56e014609d219255bb82d6b0f402ff053e377cb9ca8 7a25c7d4c56f45f4309d1e606f42537bf82725fa\nrefs/tags/aleph-for-loa-sha256-a7266e1c43cb8ce5e0a81ef24e8984a2fed62909ac2c6c4002295847329c6d13 ef7f50d1f1c2783464ffdf058317daa22a6ba1d3\nrefs/tags/aleph-for-loa-sha256-b17a68e8bfc09d70ea2ea078cf9b84e176c57e9e4aa7d6a6bce8e05cdd24455e f60d0a118e0f0f2b105b05923adbdc8ebbbb79f2\nrefs/tags/aleph-for-loa-sha256-b91804a60be616b0b222ba4c74e420965754ecb58404779fe8a4e4f5baf9fa55 b1c574c5b47eb5734a8c3077f97c677116ec7cb3\nrefs/tags/aleph-for-loa-sha256-bbdc0d5901c2ef30ee15994a98d123136eed0105780946f302fcb92bd28d9754 5472292fd2cbd8de4bdc5ddac17406ef25009b2b\nrefs/tags/aleph-for-loa-sha256-bd05d190f1776ddb3a136c8e9b6dd95cf26ecd03dd249ff00e99630f4017cac3 188152be9b6278a95dd7609c970a04769dead977\nrefs/tags/aleph-for-loa-sha256-d1e2969b2a12ffdf76f397b320a875a924b487ebad4444b7e5f162cdf51bc213 dd3b6ce9ada397b8126c2283d23bd1073b1ff322\nrefs/tags/aleph-for-loa-sha256-dbd613c9564a5a96540a1bf5811cf1b3105a279ae27d4eaea481159a76727c29 c86f0a02aa01d2b8304b62ff8406dcc31ad0af83\nrefs/tags/aleph-for-loa-sha256-ea090c41fd015f4b5e149617c9dfaba672c336e2481aad30d79e760c2b4e7665 c0ec43142710f39d50e7b7681760209112a0e17c",
  "preservation": {
    "result": "PASS",
    "time": "2026-09-26T16:51:51.283121+00:00",
    "head": "5bfbe50209d240f8fe07af587484e842c034e691",
    "tree": "a2e44dbcbbc5cb311da638ff9fc2263504388659",
    "primary": {
      "head": "a568f499db6707e4787ee3da969dbd6193b04944",
      "tree": "a72612678f8cbdc4ae2951eb5b26f1b172c71847",
      "branch": "refs/heads/agent/src-001-blind-replay-preparation-20260914",
      "status": "",
      "index_sha256": "25b75457cdf1b9faace761383199531fca4b82215d7794c3d8deae4df7d3a4be"
    },
    "registrations": [
      {
        "registration": "loa-aleph-f03-design-20260917",
        "path": "/tmp/loa-aleph-f03-design-20260917",
        "head": "484fa227e1ed23c81dc4cf37987aa0be16eded8f",
        "branch": "refs/heads/agent/f03-production-reachability-design-20260917",
        "index_sha256": "572ca9ba66bb4a17effb8929dc78262e5b1bcac9ce7e621e9956b0a8dbd7db9c"
      },
      {
        "registration": "loa-aleph-f03-implementation-20260917",
        "path": "/tmp/loa-aleph-f03-implementation-20260917",
        "head": "5bfbe50209d240f8fe07af587484e842c034e691",
        "branch": "refs/heads/agent/f03-production-reachability-implementation-20260917",
        "index_sha256": "4ca2e67c63b395de9f61a02e5072c22ab5aac2e93320e3f2208081c9a71c1d84"
      },
      {
        "registration": "loa-aleph-s5a2-final-17e1d1a.lkyTtl",
        "path": "/tmp/loa-aleph-s5a2-final-17e1d1a.lkyTtl",
        "head": "17e1d1acda17a38d72214af5022b8145220f96d8",
        "branch": "",
        "index_sha256": "9cd4974d5a0941516da138e952bdd934f109b7ddf0d7754f3a21b056024da712"
      },
      {
        "registration": "loa-aleph-s5a2-repair-20260908.EoH8Ki",
        "path": "/tmp/loa-aleph-s5a2-repair-20260908.EoH8Ki",
        "head": "17e1d1acda17a38d72214af5022b8145220f96d8",
        "branch": "",
        "index_sha256": "1fd5b6de2b33e9c9933fe505e5bca967e3c8472d66af7ffb21f2488afe789580"
      },
      {
        "registration": "loa-aleph-s7-retained-adoption-094a7ce",
        "path": "/tmp/loa-aleph-s7-retained-adoption-094a7ce",
        "head": "094a7ce3220631c8d4ee4c179e79b9b4529b6681",
        "branch": "",
        "index_sha256": "318f494616b0fb74a7aa5d2f98b8b4babe2c0a77f827f0cbbe0647ca84b78033"
      },
      {
        "registration": "slice6-pre16-authority",
        "path": "/tmp/slice6-pre16-authority",
        "head": "e45a1d9b1cafc5ef3b6a1fb46a61a8a395d45770",
        "branch": "",
        "index_sha256": "3ed8505503d359e702f51b888b4be5f97de361f603965e5052d33a85786a50ca"
      }
    ],
    "worktree_count": 7,
    "historical_records_exact": 26,
    "unrelated_refs_exact": true,
    "release": "b9e2db742a087b8ae659ec39e476ed5e240cfa1f",
    "stash": "stash@{0} e5b49e873d8a03fcd0d1b3bc65fc7c80cb8b6ce8 On agent/loa-adapter-release: preserve agent/loa-adapter-release before Slice 6\n",
    "prohibited_operations_observed": 0,
    "counter_scope": "This authorized session; retained Git evidence and operations issued. All unrelated refs, registrations, stashes and tracked historical records exact. Earlier design index stat-cache difference remains disclosed in first-gate evidence.",
    "source_work_status": ""
  },
  "no_repository_edits_before_gate": true,
  "prohibited_operations_observed": 0
}
```

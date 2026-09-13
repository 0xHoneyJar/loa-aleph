# Prompts — Judgment Workers

## Role: Disposition Judge (S5)

```text
ROLE: Disposition Judge for one claim batch.
GOAL: resolve each claim into exactly one of the seven dispositions —
carried, merged, deferred, excluded-with-reason, backgrounded,
judged-non-load-bearing, unresolved — with a one-line rationale.

DECISION GUIDE (not a script; the definitions in the wedge govern)
- carried: load-bearing for the declared scope, supported by its packets,
  uncontradicted.
- merged: a research-result role for a lineage-current claim when the S5
  contract independently judges that role. It is NOT a marker that an identity
  was absorbed; structural absorption belongs to the lineage ledger.
- deferred: real, but resolution depends on a decision/architecture outside
  this corpus's reach; name the dependency.
- excluded-with-reason: out of declared scope, or unsupported, or
  harm-bearing (do-not-use); the reason is mandatory and will be published
  verbatim.
- backgrounded: context that informs but must not drive; may not later be
  cited as evidence.
- judged-non-load-bearing: a real candidate claim that bears on nothing
  downstream (cosmetics); recording it here is the anti-silent-discard
  mechanism working.
- unresolved: contested, contradiction-bearing, or genuinely undecidable
  from the corpus. "Sort of carried" is unresolved.

CONSTRAINTS
- Judge only the current claim population supplied by the orchestrator. In
  run format 1.3 that means lineage-current claims; never fabricate a new
  disposition for a historical predecessor simply to balance current counts.
- Judge from the claim + its packets + the scope + the criteria. Nothing
  else exists for you.
- Typed relations may be supplied only as read-only challenge context. Never
  infer a disposition mechanically from a relation and never amend a REL row.
- Contradiction pairs from the merge stage: both sides stay unresolved
  unless one is out-of-scope on its face (then exclude that one, with the
  reason, and keep the tension noted on the survivor).
- The seven words are the whole vocabulary. No qualifiers, no eighth state.
```

**Bundle:** claim rows (id, claim, packets+quotes, claim_type, merge/
contradiction annotations); scope statement; extraction criteria; negative-
boundary drafts.
**Withhold:** other judges' batches; evidence roles; clusters; any verifier
traffic.
**Output contract:**
```json
{ "dispositions": [{ "claim_id": "CC-…", "disposition": "",
  "rationale": "", "negative_boundary_suggestion": null, "flags": [] }] }
```

---

## Role: Evidence-Role Judge (S6)

```text
ROLE: Evidence-Role Judge for one claim batch.
GOAL: type every claim–source edge and declare removal effects for
load-bearing support. This ledger is what keeps "has provenance" honest:
present, cited, and load-bearing are different things.

CONSTRAINTS
- Roles: load-bearing (removing this source materially weakens or changes
  the claim) | corroborative (independent support for a claim grounded
  elsewhere) | contradictory (challenges/bounds it — never dropped) |
  contextual (frames without supporting) | decorative (cited/nearby without
  contributing — a real and common role; assigning it is honesty, not
  insult) | unresolved-source (the source itself cannot be verified for
  this use; check trust_class).
- For every load-bearing edge, declare the removal effect: downgrades-to-
  unresolved | confidence-decreases | survives-independent-support |
  must-be-excluded. You are declaring the claim's honest dependency
  structure — a later adversarial stage will attack these declarations.
- Restatement-corroboration (per the merge map) is NOT independent support;
  role it contextual or decorative, not corroborative.
- A typed relation is not an evidence edge. Relation family, multiplicity,
  mutuality, or target count never creates load-bearing/corroborative support
  or satisfies removal-effect accounting.
- A carried claim with no load-bearing/corroborative edge must be returned
  as synthesis/inference with an uncertainty note — or flagged if that
  seems wrong.
```

**Bundle:** claim rows with dispositions + packets + quotes; merge map rows
(for corroboration status); source inventory (trust classes).
**Withhold:** clusters, routing, arms.
**Output contract:**
```json
{ "edges": [{ "claim_id": "", "source_id": "", "role": "",
  "verification": "verified-primary|verified-secondary|unverifiable",
  "removal_effect": null, "note": "", "flags": [] }],
  "inference_markers": [{ "claim_id": "", "basis_ids": [],
  "uncertainty": "" }] }
```

---

## Role: Cluster Cartographer (S7)

```text
ROLE: Cluster Cartographer.
GOAL: propose structural pre-cluster tags over packets/claims using
stance-free features ONLY: contradiction density, reference density,
claim-type distribution, shared-source concentration.

CONSTRAINTS
- A tag is a label plus member ids plus a one-phrase structural basis.
  No prose analysis, no doctrine language ("core thesis", "the real
  point"), no posture speculation.
- Overlap is allowed (an id may carry two tags); orphans are allowed (an
  untagged packet is fine).
- If you catch your basis phrase explaining what the corpus MEANS rather
  than how it is SHAPED, discard that tag.
```

**Bundle:** claim inventory (with dispositions), packet index (ids +
criteria + source ids only — no quotes needed), merge map.
**Withhold:** evidence-role rationales; anything routing.
**Output contract:**
```json
{ "tags": [{ "tag": "PC-…", "members": [], "basis": "" }] }
```

---

## Role: Router (S8)

```text
ROLE: Router.
GOAL: form route clusters where a doctrine-like spine emerges; fill each
card (shape vector, posture, dependencies, finalization impact); record
external-referent NEEDS; iterate as dependencies resolve.

CONSTRAINTS
- This is the first stance-bearing stage — being doctrine-relative here is
  correct; pretending your clusters fell out of the structural tags would
  be the error. Cite which tags you drew from anyway.
- The shape vector is seven signals, coarse (low/med/high). Routing reads
  the vector; one-word cluster labels are the collapse mistake — don't.
- Posture: adversarial-weighted | convergent-weighted | hybrid | unrouted-
  pending-external-referent. Both arms always exist; you are setting the
  dial per cluster.
- external-referent need is readable from the corpus (does this cluster
  gesture at competitors/prior art/known categories?). Whether the referent
  EXISTS is not yours to say — emit a REF need with the dependent ids and
  the taint it implies. Never resolve one, never assume one, never let your
  training knowledge of the outside world leak into a card.
- Dependencies: name which clusters' outcomes could re-route this one, and
  what this cluster blocks. Expect to be re-invoked after arms run;
  posture changes append to history with their trigger.
```

**Bundle:** everything S1–S7 produced (inventory, ledgers, tags), the
routing doctrine (`docs/routing-and-clustering.md`).
**Withhold:** nothing upstream; but no web, no training-knowledge referents,
no arm outputs that don't exist yet.
**Output contract:**
```json
{ "cards": [{ "rc_id": "RC-…", "working_name": "", "posture": "",
  "shape_vector": { "contradiction_density": "", "reference_density": "",
  "invariant_bearing": "", "implementation_constraint": "",
  "open_question": "", "external_referent_need": "", "doctrine_spine": "" },
  "tags_used": [], "packet_ids": [], "claim_ids": [],
  "key_dispositions": "", "depends_on": [], "blocks": "",
  "rationale": "", "flags": [] }],
  "referent_needs": [{ "need_question": "", "depends": [],
  "taint_note": "" }],
  "posture_changes": [{ "rc_id": "", "from": "", "to": "",
  "trigger": "" }] }
```

## Slice 7 semantic review (1.7)

For 1.7, admitted semantic facets are read-only source-preservation/challenge context for S5 and S6. Judge dispositions and CC×SRC evidence roles independently. Content-role annotations never map to claim_type, support roles, S5 dispositions, relation types or human authority.

## Merge Judge discovery (1.8)

```text
ROLE: Merge Judge.
TASK: Identify candidate comparisons in the attached current-claim catalogue; do not decide equivalence.
Propose candidate groups and missing comparison coverage. Signals never certify equivalence. Zero candidates means only none were proposed. Do not optimize claim count.
```

**Shown:** only the Core-produced bounded current-claim catalogue window.
**Withheld:** calibration answers, expected groups, downstream dispositions, routing, synthesis, human-authority observations, prior reviewer verdicts and hidden rationale.

**Output contract:**
```json
{
  "contract_format": "aleph-duplicate-output-contract/v1",
  "capability": "duplicate-overlap-review",
  "task": "discovery",
  "role": "merge-judge",
  "shape": {
    "type": "object",
    "properties": {
      "candidates": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "member_ids": {
              "type": "array",
              "items": {
                "type": "string",
                "minLength": 1,
                "pattern": "^CC-[0-9]+$"
              },
              "minItems": 2
            },
            "basis_refs": {
              "type": "array",
              "items": {
                "type": "string",
                "minLength": 1
              },
              "minItems": 1
            },
            "signal": {
              "type": "string",
              "enum": [
                "semantic-proposal",
                "identical-text",
                "shared-packet"
              ]
            }
          },
          "required": [
            "member_ids",
            "basis_refs",
            "signal"
          ],
          "additionalProperties": false
        },
        "minItems": 0
      },
      "unresolved_findings": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "member_ids": {
              "type": "array",
              "items": {
                "type": "string",
                "minLength": 1,
                "pattern": "^CC-[0-9]+$"
              },
              "minItems": 0
            },
            "missing": {
              "type": "string",
              "minLength": 1
            },
            "requested_context": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "source_id": {
                    "type": "string",
                    "minLength": 1,
                    "pattern": "^SRC-[0-9]+$"
                  },
                  "locator": {
                    "type": "string",
                    "minLength": 1,
                    "pattern": "^L[1-9][0-9]*-L[1-9][0-9]*$"
                  },
                  "purpose": {
                    "type": "string",
                    "enum": [
                      "local-context",
                      "same-source-referent-search",
                      "material-inspection"
                    ]
                  }
                },
                "required": [
                  "source_id",
                  "locator",
                  "purpose"
                ],
                "additionalProperties": false
              },
              "minItems": 0
            }
          },
          "required": [
            "member_ids",
            "missing",
            "requested_context"
          ],
          "additionalProperties": false
        },
        "minItems": 0
      },
      "rationale": {
        "type": "string",
        "minLength": 1
      },
      "flags": {
        "type": "array",
        "items": {
          "type": "string",
          "minLength": 1
        },
        "minItems": 0
      }
    },
    "required": [
      "candidates",
      "unresolved_findings",
      "rationale",
      "flags"
    ],
    "additionalProperties": false
  }
}
```


## Merge Judge comparison (1.8)

```text
ROLE: Merge Judge.
TASK: Propose one duplicate-versus-overlap decision for the attached complete comparison basis.
Compare every member of the attached complete basis. Search for surviving distinctions across all seventeen dimensions. Record exact occurrences, origin uncertainty, and every limitation. A representative is a basis for a new successor, never a surviving predecessor. Propose no final canonical write.
```

**Shown:** only the Core-produced bounded comparison basis and exact candidate reference.
**Withheld:** calibration answers, expected groups, downstream dispositions, routing, synthesis, human-authority observations, prior reviewer verdicts and hidden rationale.

**Output contract:**
```json
{
  "contract_format": "aleph-duplicate-output-contract/v1",
  "capability": "duplicate-overlap-review",
  "task": "comparison",
  "role": "merge-judge",
  "shape": {
    "type": "object",
    "properties": {
      "proposal": {
        "type": "object",
        "properties": {
          "candidate_ref": {
            "type": "string",
            "minLength": 1,
            "pattern": "^DCD-(?=[0-9]*[1-9])[0-9]{4,}/G[1-9][0-9]*$"
          },
          "member_ids": {
            "type": "array",
            "items": {
              "type": "string",
              "minLength": 1,
              "pattern": "^CC-[0-9]+$"
            },
            "minItems": 2
          },
          "member_semantic_refs": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "claim_id": {
                  "type": "string",
                  "minLength": 1,
                  "pattern": "^CC-[0-9]+$"
                },
                "semantic_id": {
                  "type": "string",
                  "minLength": 1,
                  "pattern": "^SEM-(?=[0-9]*[1-9])[0-9]{4,}$"
                },
                "subject_digest": {
                  "type": "string",
                  "minLength": 1,
                  "pattern": "^sha256:[0-9a-f]{64}$"
                },
                "unit_refs": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "minLength": 1
                  },
                  "minItems": 1
                }
              },
              "required": [
                "claim_id",
                "semantic_id",
                "subject_digest",
                "unit_refs"
              ],
              "additionalProperties": false
            },
            "minItems": 2
          },
          "comparison_basis_digest": {
            "type": "string",
            "minLength": 1,
            "pattern": "^sha256:[0-9a-f]{64}$"
          },
          "review_mode": {
            "type": "string",
            "enum": [
              "proposal",
              "unresolved-record"
            ]
          },
          "outcome": {
            "type": "string",
            "enum": [
              "duplicate",
              "overlap",
              "distinct",
              "CANNOT_DETERMINE"
            ]
          },
          "treatment": {
            "type": "string",
            "enum": [
              "new-successor",
              "keep-separate"
            ]
          },
          "distinctions": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "distinction_id": {
                  "type": "string",
                  "minLength": 1,
                  "pattern": "^D[1-9][0-9]*$"
                },
                "dimension": {
                  "type": "string",
                  "enum": [
                    "proposition",
                    "conditions",
                    "qualifiers",
                    "scope",
                    "modality",
                    "attribution",
                    "comparator",
                    "metric",
                    "claim_roles",
                    "result-interpretation",
                    "source-occurrence",
                    "support-origin",
                    "material",
                    "ambiguity",
                    "lineage",
                    "relations",
                    "context"
                  ]
                },
                "member_ids": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "minLength": 1,
                    "pattern": "^CC-[0-9]+$"
                  },
                  "minItems": 1
                },
                "input_refs": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "minLength": 1,
                    "pattern": "^/"
                  },
                  "minItems": 1
                },
                "treatment": {
                  "type": "string",
                  "enum": [
                    "retained",
                    "collapsible",
                    "CANNOT_DETERMINE"
                  ]
                },
                "retained_at": {
                  "anyOf": [
                    {
                      "type": "string",
                      "enum": [
                        "successor-content",
                        "occurrence-history",
                        "separate-claims"
                      ]
                    },
                    {
                      "type": "null"
                    }
                  ]
                },
                "content_anchor_refs": {
                  "type": "array",
                  "items": {
                    "anyOf": [
                      {
                        "type": "object",
                        "properties": {
                          "semantic_id": {
                            "type": "string",
                            "minLength": 1,
                            "pattern": "^SEM-(?=[0-9]*[1-9])[0-9]{4,}$"
                          },
                          "anchor_id": {
                            "type": "string",
                            "minLength": 1,
                            "pattern": "^A[1-9][0-9]*$"
                          }
                        },
                        "required": [
                          "semantic_id",
                          "anchor_id"
                        ],
                        "additionalProperties": false
                      },
                      {
                        "type": "object",
                        "properties": {
                          "source_id": {
                            "type": "string",
                            "minLength": 1,
                            "pattern": "^SRC-[0-9]+$"
                          },
                          "locator": {
                            "type": "string",
                            "minLength": 1
                          },
                          "start_byte": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 9007199254740991
                          },
                          "end_byte": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 9007199254740991
                          },
                          "selection_hash": {
                            "type": "string",
                            "minLength": 1,
                            "pattern": "^sha256:[0-9a-f]{64}$"
                          }
                        },
                        "required": [
                          "source_id",
                          "locator",
                          "start_byte",
                          "end_byte",
                          "selection_hash"
                        ],
                        "additionalProperties": false
                      }
                    ]
                  },
                  "minItems": 0
                },
                "context_refs": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "minLength": 1
                  },
                  "minItems": 0
                },
                "explanation": {
                  "type": "string",
                  "minLength": 1
                }
              },
              "required": [
                "distinction_id",
                "dimension",
                "member_ids",
                "input_refs",
                "treatment",
                "retained_at",
                "content_anchor_refs",
                "context_refs",
                "explanation"
              ],
              "additionalProperties": false
            },
            "minItems": 17
          },
          "contradiction_pairs": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "a": {
                  "type": "string",
                  "minLength": 1,
                  "pattern": "^CC-[0-9]+$"
                },
                "b": {
                  "type": "string",
                  "minLength": 1,
                  "pattern": "^CC-[0-9]+$"
                },
                "distinction_refs": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "minLength": 1
                  },
                  "minItems": 1
                },
                "anchor_refs": {
                  "type": "array",
                  "items": {
                    "anyOf": [
                      {
                        "type": "object",
                        "properties": {
                          "semantic_id": {
                            "type": "string",
                            "minLength": 1,
                            "pattern": "^SEM-(?=[0-9]*[1-9])[0-9]{4,}$"
                          },
                          "anchor_id": {
                            "type": "string",
                            "minLength": 1,
                            "pattern": "^A[1-9][0-9]*$"
                          }
                        },
                        "required": [
                          "semantic_id",
                          "anchor_id"
                        ],
                        "additionalProperties": false
                      },
                      {
                        "type": "object",
                        "properties": {
                          "source_id": {
                            "type": "string",
                            "minLength": 1,
                            "pattern": "^SRC-[0-9]+$"
                          },
                          "locator": {
                            "type": "string",
                            "minLength": 1
                          },
                          "start_byte": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 9007199254740991
                          },
                          "end_byte": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 9007199254740991
                          },
                          "selection_hash": {
                            "type": "string",
                            "minLength": 1,
                            "pattern": "^sha256:[0-9a-f]{64}$"
                          }
                        },
                        "required": [
                          "source_id",
                          "locator",
                          "start_byte",
                          "end_byte",
                          "selection_hash"
                        ],
                        "additionalProperties": false
                      }
                    ]
                  },
                  "minItems": 1
                },
                "why": {
                  "type": "string",
                  "minLength": 1
                }
              },
              "required": [
                "a",
                "b",
                "distinction_refs",
                "anchor_refs",
                "why"
              ],
              "additionalProperties": false
            },
            "minItems": 0
          },
          "origin_assessment": {
            "type": "object",
            "properties": {
              "corroboration": {
                "type": "string",
                "enum": [
                  "independent",
                  "restatement",
                  "CANNOT_DETERMINE"
                ]
              },
              "occurrence_groups": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "occurrence_keys": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "minLength": 1
                      },
                      "minItems": 1
                    },
                    "basis_refs": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "minLength": 1,
                        "pattern": "^/"
                      },
                      "minItems": 1
                    }
                  },
                  "required": [
                    "occurrence_keys",
                    "basis_refs"
                  ],
                  "additionalProperties": false
                },
                "minItems": 1
              },
              "basis_refs": {
                "type": "array",
                "items": {
                  "type": "string",
                  "minLength": 1,
                  "pattern": "^/"
                },
                "minItems": 1
              },
              "unresolved_finding_refs": {
                "type": "array",
                "items": {
                  "type": "string",
                  "minLength": 1
                },
                "minItems": 0
              }
            },
            "required": [
              "corroboration",
              "occurrence_groups",
              "basis_refs",
              "unresolved_finding_refs"
            ],
            "additionalProperties": false
          },
          "representative": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "basis_member_ids": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "minLength": 1,
                      "pattern": "^CC-[0-9]+$"
                    },
                    "minItems": 1
                  },
                  "basis_unit_refs": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "minLength": 1
                    },
                    "minItems": 1
                  },
                  "wording_basis": {
                    "type": "string",
                    "enum": [
                      "selected-member",
                      "combined-expression"
                    ]
                  },
                  "retained_distinction_refs": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "minLength": 1
                    },
                    "minItems": 0
                  }
                },
                "required": [
                  "basis_member_ids",
                  "basis_unit_refs",
                  "wording_basis",
                  "retained_distinction_refs"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "successor_request": {
            "anyOf": [
              {
                "type": "object",
                "properties": {
                  "lineage_type": {
                    "type": "string",
                    "enum": [
                      "duplicate",
                      "merge"
                    ]
                  },
                  "proposed_claim": {
                    "type": "string",
                    "minLength": 1
                  },
                  "claim_type": {
                    "type": "string",
                    "enum": [
                      "factual",
                      "design-intent",
                      "constraint",
                      "preference",
                      "open-question"
                    ]
                  },
                  "packet_ids": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "minLength": 1
                    },
                    "minItems": 1
                  },
                  "source_ids": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "minLength": 1
                    },
                    "minItems": 1
                  },
                  "semantic_content_refs": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "minLength": 1,
                      "pattern": "^/"
                    },
                    "minItems": 1
                  },
                  "material_use": {
                    "type": "object",
                    "properties": {
                      "requirements": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "object_id": {
                              "type": "string",
                              "minLength": 1,
                              "pattern": "^OBJ-(?=[0-9]*[1-9])[0-9]{4,}$"
                            },
                            "feature": {
                              "type": "string",
                              "enum": [
                                "text-bytes",
                                "table-grid",
                                "header-association",
                                "caption-association",
                                "formal-structure",
                                "image",
                                "chart-values",
                                "spatial-region"
                              ]
                            },
                            "binding_ids": {
                              "type": "array",
                              "items": {
                                "type": "string",
                                "minLength": 1,
                                "pattern": "^BND-(?=[0-9]*[1-9])[0-9]{4,}$"
                              },
                              "minItems": 0
                            }
                          },
                          "required": [
                            "object_id",
                            "feature",
                            "binding_ids"
                          ],
                          "additionalProperties": false
                        },
                        "minItems": 1
                      },
                      "use_state": {
                        "type": "string",
                        "enum": [
                          "usable",
                          "CANNOT_DETERMINE"
                        ]
                      },
                      "fidelity_claim": {
                        "type": "string",
                        "enum": [
                          "none",
                          "exact-representation"
                        ]
                      },
                      "limitation_refs": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "minLength": 1,
                          "pattern": "^(REP|OBJ|ASC)-(?=[0-9]*[1-9])[0-9]{4,}$"
                        },
                        "minItems": 0
                      },
                      "reason": {
                        "type": "string",
                        "minLength": 1
                      }
                    },
                    "required": [
                      "requirements",
                      "use_state",
                      "fidelity_claim",
                      "limitation_refs",
                      "reason"
                    ],
                    "additionalProperties": false
                  }
                },
                "required": [
                  "lineage_type",
                  "proposed_claim",
                  "claim_type",
                  "packet_ids",
                  "source_ids",
                  "semantic_content_refs",
                  "material_use"
                ],
                "additionalProperties": false
              },
              {
                "type": "null"
              }
            ]
          },
          "provenance_union": {
            "type": "object",
            "properties": {
              "packet_ids": {
                "type": "array",
                "items": {
                  "type": "string",
                  "minLength": 1
                },
                "minItems": 1
              },
              "source_ids": {
                "type": "array",
                "items": {
                  "type": "string",
                  "minLength": 1
                },
                "minItems": 1
              },
              "occurrences": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "source_id": {
                      "type": "string",
                      "minLength": 1
                    },
                    "source_hash": {
                      "type": "string",
                      "minLength": 1,
                      "pattern": "^sha256:[0-9a-f]{64}$"
                    },
                    "packet_id": {
                      "type": "string",
                      "minLength": 1
                    },
                    "evidence_key": {
                      "type": "string",
                      "minLength": 1
                    },
                    "fragment_order": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 9007199254740991
                    },
                    "locator": {
                      "type": "string",
                      "minLength": 1
                    },
                    "fragment_hash": {
                      "type": "string",
                      "minLength": 1,
                      "pattern": "^sha256:[0-9a-f]{64}$"
                    },
                    "start_byte": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 9007199254740991
                    },
                    "end_byte": {
                      "type": "integer",
                      "minimum": 0,
                      "maximum": 9007199254740991
                    }
                  },
                  "required": [
                    "source_id",
                    "source_hash",
                    "packet_id",
                    "evidence_key",
                    "fragment_order",
                    "locator",
                    "fragment_hash",
                    "start_byte",
                    "end_byte"
                  ],
                  "additionalProperties": false
                },
                "minItems": 1
              },
              "member_occurrences": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "claim_id": {
                      "type": "string",
                      "minLength": 1,
                      "pattern": "^CC-[0-9]+$"
                    },
                    "occurrence_keys": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "minLength": 1
                      },
                      "minItems": 1
                    },
                    "unit_occurrences": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "unit_ref": {
                            "type": "string",
                            "minLength": 1
                          },
                          "anchor_refs": {
                            "type": "array",
                            "items": {
                              "anyOf": [
                                {
                                  "type": "object",
                                  "properties": {
                                    "semantic_id": {
                                      "type": "string",
                                      "minLength": 1,
                                      "pattern": "^SEM-(?=[0-9]*[1-9])[0-9]{4,}$"
                                    },
                                    "anchor_id": {
                                      "type": "string",
                                      "minLength": 1,
                                      "pattern": "^A[1-9][0-9]*$"
                                    }
                                  },
                                  "required": [
                                    "semantic_id",
                                    "anchor_id"
                                  ],
                                  "additionalProperties": false
                                },
                                {
                                  "type": "object",
                                  "properties": {
                                    "source_id": {
                                      "type": "string",
                                      "minLength": 1,
                                      "pattern": "^SRC-[0-9]+$"
                                    },
                                    "locator": {
                                      "type": "string",
                                      "minLength": 1
                                    },
                                    "start_byte": {
                                      "type": "integer",
                                      "minimum": 0,
                                      "maximum": 9007199254740991
                                    },
                                    "end_byte": {
                                      "type": "integer",
                                      "minimum": 0,
                                      "maximum": 9007199254740991
                                    },
                                    "selection_hash": {
                                      "type": "string",
                                      "minLength": 1,
                                      "pattern": "^sha256:[0-9a-f]{64}$"
                                    }
                                  },
                                  "required": [
                                    "source_id",
                                    "locator",
                                    "start_byte",
                                    "end_byte",
                                    "selection_hash"
                                  ],
                                  "additionalProperties": false
                                }
                              ]
                            },
                            "minItems": 0
                          },
                          "occurrence_keys": {
                            "type": "array",
                            "items": {
                              "type": "string",
                              "minLength": 1
                            },
                            "minItems": 1
                          }
                        },
                        "required": [
                          "unit_ref",
                          "anchor_refs",
                          "occurrence_keys"
                        ],
                        "additionalProperties": false
                      },
                      "minItems": 1
                    }
                  },
                  "required": [
                    "claim_id",
                    "occurrence_keys",
                    "unit_occurrences"
                  ],
                  "additionalProperties": false
                },
                "minItems": 2
              }
            },
            "required": [
              "packet_ids",
              "source_ids",
              "occurrences",
              "member_occurrences"
            ],
            "additionalProperties": false
          },
          "unresolved_findings": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "finding_id": {
                  "type": "string",
                  "minLength": 1,
                  "pattern": "^F[1-9][0-9]*$"
                },
                "dimension": {
                  "type": "string",
                  "enum": [
                    "proposition",
                    "conditions",
                    "qualifiers",
                    "scope",
                    "modality",
                    "attribution",
                    "comparator",
                    "metric",
                    "claim_roles",
                    "result-interpretation",
                    "source-occurrence",
                    "support-origin",
                    "material",
                    "ambiguity",
                    "lineage",
                    "relations",
                    "context"
                  ]
                },
                "input_refs": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "minLength": 1,
                    "pattern": "^/"
                  },
                  "minItems": 1
                },
                "anchor_refs": {
                  "type": "array",
                  "items": {
                    "anyOf": [
                      {
                        "type": "object",
                        "properties": {
                          "semantic_id": {
                            "type": "string",
                            "minLength": 1,
                            "pattern": "^SEM-(?=[0-9]*[1-9])[0-9]{4,}$"
                          },
                          "anchor_id": {
                            "type": "string",
                            "minLength": 1,
                            "pattern": "^A[1-9][0-9]*$"
                          }
                        },
                        "required": [
                          "semantic_id",
                          "anchor_id"
                        ],
                        "additionalProperties": false
                      },
                      {
                        "type": "object",
                        "properties": {
                          "source_id": {
                            "type": "string",
                            "minLength": 1,
                            "pattern": "^SRC-[0-9]+$"
                          },
                          "locator": {
                            "type": "string",
                            "minLength": 1
                          },
                          "start_byte": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 9007199254740991
                          },
                          "end_byte": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 9007199254740991
                          },
                          "selection_hash": {
                            "type": "string",
                            "minLength": 1,
                            "pattern": "^sha256:[0-9a-f]{64}$"
                          }
                        },
                        "required": [
                          "source_id",
                          "locator",
                          "start_byte",
                          "end_byte",
                          "selection_hash"
                        ],
                        "additionalProperties": false
                      }
                    ]
                  },
                  "minItems": 0
                },
                "material_refs": {
                  "type": "array",
                  "items": {
                    "anyOf": [
                      {
                        "type": "object",
                        "properties": {
                          "use_subject_digest": {
                            "type": "string",
                            "minLength": 1,
                            "pattern": "^sha256:[0-9a-f]{64}$"
                          },
                          "requirement_index": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 9007199254740991
                          }
                        },
                        "required": [
                          "use_subject_digest",
                          "requirement_index"
                        ],
                        "additionalProperties": false
                      },
                      {
                        "type": "object",
                        "properties": {
                          "use_subject_digest": {
                            "type": "string",
                            "minLength": 1,
                            "pattern": "^sha256:[0-9a-f]{64}$"
                          },
                          "limitation_id": {
                            "type": "string",
                            "minLength": 1,
                            "pattern": "^(REP|OBJ|ASC)-(?=[0-9]*[1-9])[0-9]{4,}$"
                          }
                        },
                        "required": [
                          "use_subject_digest",
                          "limitation_id"
                        ],
                        "additionalProperties": false
                      }
                    ]
                  },
                  "minItems": 0
                },
                "missing": {
                  "type": "string",
                  "minLength": 1
                },
                "requested_context": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "source_id": {
                        "type": "string",
                        "minLength": 1,
                        "pattern": "^SRC-[0-9]+$"
                      },
                      "locator": {
                        "type": "string",
                        "minLength": 1,
                        "pattern": "^L[1-9][0-9]*-L[1-9][0-9]*$"
                      },
                      "purpose": {
                        "type": "string",
                        "enum": [
                          "local-context",
                          "same-source-referent-search",
                          "material-inspection"
                        ]
                      }
                    },
                    "required": [
                      "source_id",
                      "locator",
                      "purpose"
                    ],
                    "additionalProperties": false
                  },
                  "minItems": 0
                }
              },
              "required": [
                "finding_id",
                "dimension",
                "input_refs",
                "anchor_refs",
                "material_refs",
                "missing",
                "requested_context"
              ],
              "additionalProperties": false
            },
            "minItems": 0
          }
        },
        "required": [
          "candidate_ref",
          "member_ids",
          "member_semantic_refs",
          "comparison_basis_digest",
          "review_mode",
          "outcome",
          "treatment",
          "distinctions",
          "contradiction_pairs",
          "origin_assessment",
          "representative",
          "successor_request",
          "provenance_union",
          "unresolved_findings"
        ],
        "additionalProperties": false
      },
      "rationale": {
        "type": "string",
        "minLength": 1
      },
      "flags": {
        "type": "array",
        "items": {
          "type": "string",
          "minLength": 1
        },
        "minItems": 0
      }
    },
    "required": [
      "proposal",
      "rationale",
      "flags"
    ],
    "additionalProperties": false
  }
}
```

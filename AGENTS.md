# AGENTS.md — Using Loa-Aleph

> **What this file is.** The front door. If you are an agent, a human, or a repo
> deciding what to do with loa-aleph, start here. This file routes you to the
> right path for your use, and tells you honestly what is built versus what is
> currently doctrine-only.
>
> **One-line orientation.** Aleph turns a messy, bounded body of research into one
> **projection-neutral Research Précis** — a portable file whose every claim
> traces back to its source — and then (in a separate stage) renders that Précis
> into finished documents. The procedure *is* the product: every step is meant to
> be executable by an agent **or** by a human, by hand.

---

## 1. Which path are you on?

Aleph supports three consumption modes. Pick the row that matches you.

| You are… | You want to… | Go to |
|----------|--------------|-------|
| **An agent given a corpus** | Run the distillation procedure on dropped-in source material and produce a Précis | §2 *Agent mode* |
| **A human with no agent** | Follow the same steps by hand to the same result | §3 *Manual mode* |
| **A repo / product** | Embed Aleph's procedure as part of your own system, or consume its Précis output | §4 *Repo-consumption mode* |

All three execute the **same procedure** and are bound by the **same doctrine**.
The difference is who runs it and how the bookkeeping is carried — not what the
steps are.

---

## 2. Agent mode

You have been pointed at this repo and given a body of research ("here is
everything I have on this topic"). Your job is to distill it without producing a
"summary of summaries" — every claim you carry must trace back to a source span.

**Read, in order:**

1. `README.md` — what Aleph is and where it sits.
2. `docs/precis-wedge.md` — the Précis contract: complete-by-disposition-coverage,
   the seven-disposition ledger, the v0 acceptance envelope. **This is the
   contract your output must satisfy.**
3. `docs/responsibility-map.md` — what Aleph owns and does not own (so you do not
   wander into business-intelligence or product-surface work).
4. `docs/routing-and-clustering.md` — how to form clusters and route them across
   the two arms (adversarial / convergent), and the hard derivation-trail
   invariant.
5. `docs/decisions/` — the accepted decisions (ADRs) that constrain everything
   above. Read these before contradicting any of it.

**Then verify your output** with the conformance checker — see §5.

> **Status honesty:** the **Précis layer** (steps that produce the neutral Précis)
> is specified and conformance-checked today. The **routing/clustering** layer is
> *accepted doctrine* (`docs/decisions/0002-…`) but is **not yet checker-enforced**
> and has **no worked fixture** — you follow it as doctrine, not as a verified
> recipe. The **projection stage** (turning a Précis into a PRD/spec/etc.) is
> *declared* (`docs/decisions/0001-…`) but **not yet built**. Do not claim Aleph
> produced a finished projection document until that stage exists.

---

## 3. Manual mode

You are a human doing this by hand, no agent. The promise: you can reach the same
result, because the procedure is explicit and the bookkeeping is deliberately
sparse.

- Follow the **same reading order as §2.**
- The Précis contract (`docs/precis-wedge.md`) is what your hand-built artifact
  must satisfy — same as an agent's.
- For routing/clustering, the manual-mode rule is **reconstructability, not
  exhaustive graph-keeping**: you keep a **sparse derivation card per route
  cluster** (the card schema is in `docs/routing-and-clustering.md` §11), not a
  full edge graph. The smallest invariant you must hold:
  > every route-cluster card lists exact packet IDs; every packet ID resolves to a
  > reopenable source span — so "why this cluster?" is always answerable by
  > reopening source, never by trusting a summary.
- Tooling becomes *desirable* at scale (hundreds of packets) but is **not required
  for correctness**. The manual-mode promise holds.

---

## 4. Repo-consumption mode

You are a repo or product that wants to use Aleph. Two sub-cases:

- **Consume the output.** Take a finished, projection-neutral Précis (a portable
  file) and project it yourself into whatever your product needs. You are not
  required to run Aleph's own projection stage. The Précis is the hand-off
  contract; see `docs/responsibility-map.md` ("Aleph fans out, it does not
  serialize").
- **Embed the procedure.** Adopt Aleph's distillation procedure as a stage inside
  your own system. Aleph is **not a live service** — it is an instruction
  substrate. It only goes "live" when you embed it in your product. Sync the repo,
  follow the same docs in §2, and run the conformance checker (§5) as your gate.

> **Stability note:** the internal Précis schema is **not frozen** yet (it is a
> provisional v0 acceptance envelope — see `docs/precis-wedge.md`). If you build a
> hard dependency on the exact field layout, expect churn until a schema-freeze
> slice lands.

---

## 5. Conformance — how you check the work

The procedure-is-the-product principle means steps are backed by checks, not vibes.

- The checker is a single Node script: `scripts/validate-precis-fixtures.mjs`.
- Run it: `node scripts/validate-precis-fixtures.mjs` (exit 0 = pass).
- What it enforces today: file presence, projection-neutrality of the Précis,
  corpus-boundary / answer-key leakage, the v0 acceptance envelope, the
  disposition inventory and ledger balance, the stress-test matrix, and
  cross-section consistency — all over the fixtures in `docs/fixtures/*/`.
- See `docs/PRECIS-CONFORMANCE-CHECKER.md` for what each check means.
- **Not yet checked:** routing/clustering, derivation cards, the finalization
  gate, and any projection output. These are doctrine today; a future slice adds
  fixtures and checks for them in lockstep. Do not assume an unchecked step is
  verified just because you followed it.

---

## 6. The non-negotiable invariants

Whatever mode you are in, these hold:

1. **Traceability over summary.** Nothing load-bearing may exist in the output
   without a recorded disposition and a path back to its source. No summary of
   summaries.
2. **Do not invent external facts.** The corpus alone cannot prove that
   competitors / prior art / reference architectures do or do not exist. Claims
   that depend on external existence ("this is novel", "this beats X") stay marked
   `external-referent unresolved` until a referent is supplied. See
   `docs/routing-and-clustering.md` §8.
3. **Neutrality is a property of the Précis, not the repo.** The Précis never
   decides what it becomes; a separate projection stage does. See
   `docs/decisions/0001-…`.
4. **Per-cluster routing, never a global stance.** Do not label a whole corpus
   "novel" or "known-domain". Route each cluster. See `docs/decisions/0002-…`.

---

## 7. Map of the repo

```
README.md                                  what Aleph is, where it sits
AGENTS.md                                  this file — the front door
docs/
  precis-wedge.md                          the Précis contract (Phase 0/1 wedge)
  responsibility-map.md                    what Aleph owns / does not own
  routing-and-clustering.md                routing doctrine + manual-mode cards
  PRECIS-CONFORMANCE-CHECKER.md            what the checker enforces
  decisions/
    0001-projection-as-separate-downstream-stage.md
    0002-routing-as-per-cluster-not-global-stance.md
  fixtures/
    slice-1/  slice-2/                     worked Précis fixtures (corpus + precis + README)
scripts/
  validate-precis-fixtures.mjs             the conformance checker
```

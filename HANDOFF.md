---
title: Handoff Note — Trading Product Design
type: handoff
date: 2026-07-12
branch: docs/initial-design
---

# Handoff Note

## What exists after this session

- A **docs-first** repository at `C:\Users\TempUser\Projects\Trading_Project` on branch
  **`docs/initial-design`**.
- A complete set of design documents under `docs/` covering: extraction from TaskFlow,
  product vision, app flow, the six feature pillars, the news/signals ladder, the
  six-bundle MAS engine with aggregation math, the legal/disclaimer framework, the layered
  architecture with Canonical Trade Schema, Iran-specific constraints, a phased roadmap,
  and the knowledge-graph schema.
- A `docs/README.md` index linking every document.

## What is intentionally left as design-only (important)

- **Pillar F — live-signal + auto-execution add-on.** Automated order routing based on
  news is a regulated activity. It is documented (`docs/03-features/news-and-signals.md`,
  `docs/05-legal/disclaimer-framework.md`) but **must remain design-only until a licensing
  determination is made**. Even when built, the default is **confirm-before-execute**;
  fully automatic execution is a separately-enabled, licensing-dependent step.
- **No feature code was written.** This session produced documentation and repo
  scaffolding only, per the prompt's hard constraints.

## Extraction status (TaskFlow side)

- The trading footprint in TaskFlow is a single **placeholder tile** ("Trader / بازار گاوی")
  in `src/components/PremiumHub.vue` that only shows a "بزودی" toast — no real trading
  journal code exists. See `docs/00-extraction/inventory.md`.
- **Removal step (planned, run after this design commit):** delete the `'trader'` section
  entry, the `'trader'` type literal, and the `.tile-trader` CSS rule, then build-verify
  TaskFlow. This is a 4-line change with a `git revert` rollback. Details in
  `docs/00-extraction/migration-plan.md`.

## Secrets flagging

- **No credentials were committed.** The design docs reference *names* of services and
  infrastructure (Zarinpal, SMS.ir, daahian PostgreSQL, GapGPT, Arvan S3, Infisical) but
  contain **no keys, passwords, or tokens**. Any future code must keep secrets in Infisical
  and `.gitignore` `.env*` files (the repo already has a `.gitignore`).
- Before staging any new file, confirm it contains no secrets.

## Knowledge-graph mirror status

- The graph **schema** is documented in `docs/09-knowledge-graph.md`.
- Mirroring the design as Neo4j nodes/edges via the IWE MCP is the next step after this
  commit (node labels: Product, Pillar, Feature, Agent, Bundle, Layer, Connector, Metric,
  Constraint, Phase, Disclaimer; edges: BELONGS_TO, DEPENDS_ON, DEBATES_WITH,
  AGGREGATED_BY, GATED_BY, SHIPS_IN, SHARED_WITH).

## Branch / git notes

- Branch `docs/initial-design` was created off `main`; nothing was force-pushed, reset, or
  destructively changed. `main` is untouched.
- Existing repo contents (the Next.js scaffold from an earlier "premium market intelligence"
  effort) were left in place — nothing was deleted.

## Next session

1. Commit the docs (done in this session).
2. Mirror the design into the IWE knowledge graph.
3. Remove the trading placeholder tile from TaskFlow and build-verify.
4. Return to the primary task: completing TaskFlow.

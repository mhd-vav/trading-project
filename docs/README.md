# Trading Project — Design Documentation

> Canonical source of truth for the **Trader Cockpit** product. Documentation-only repo;
> no feature code is written here. The repo Markdown is canonical; the IWE knowledge graph
> (Neo4j) and the Wiki are curated views of it.

This is a **docs-first** repository. The product is a trader cockpit for Forex and Crypto,
localized for Iran — educational and record-keeping only, never a signal service. It is
being cleanly separated out of the TaskFlow app (see `00-extraction/`).

## Document index

### 00 — Extraction (separating trading out of TaskFlow)
- [00-extraction/inventory.md](00-extraction/inventory.md) — every trading-related item in
  TaskFlow, classified move / shared / stays.
- [00-extraction/shared-platform.md](00-extraction/shared-platform.md) — the shared
  platform layer (auth, billing, news, notifications, design system) + monorepo
  recommendation.
- [00-extraction/migration-plan.md](00-extraction/migration-plan.md) — how trading leaves
  TaskFlow safely, with rollback.

### 01 — Vision
- [01-vision.md](01-vision.md) — what the product is, what it is NOT, who it's for.

### 02 — App Flow
- [02-app-flow.md](02-app-flow.md) — screen-by-screen experience from open onward.

### 03 — Features
- [03-features/pillars.md](03-features/pillars.md) — the six feature pillars (A–F).
- [03-features/news-and-signals.md](03-features/news-and-signals.md) — the three-level news
  ladder + the Premium+ live-signal and auto-execution add-ons (Pillar F, design-only).

### 04 — MAS Analysis Engine
- [04-mas/overview.md](04-mas/overview.md) — bundles, two-tier deliberation, risk governor.
- [04-mas/aggregation.md](04-mas/aggregation.md) — the math (stance, dispersion,
  conviction).
- [04-mas/bundle-technical.md](04-mas/bundle-technical.md) — Bundle 1: Technical / Price-Action.
- [04-mas/bundle-orderflow.md](04-mas/bundle-orderflow.md) — Bundle 2: Order-Flow / Microstructure.
- [04-mas/bundle-macro.md](04-mas/bundle-macro.md) — Bundle 3: Macro / Fundamental.
- [04-mas/bundle-sentiment.md](04-mas/bundle-sentiment.md) — Bundle 4: Sentiment / Positioning.
- [04-mas/bundle-onchain.md](04-mas/bundle-onchain.md) — Bundle 5: On-Chain (crypto-only).
- [04-mas/bundle-quant.md](04-mas/bundle-quant.md) — Bundle 6: Quantitative / Statistical.

### 05 — Legal
- [05-legal/disclaimer-framework.md](05-legal/disclaimer-framework.md) — persistent
  disclaimer bar, acknowledgment flow, audit log, Pillar F licensing gate.

### 06 — Architecture
- [06-architecture/overview.md](06-architecture/overview.md) — four layers + shared
  platform, with Mermaid diagrams.
- [06-architecture/trade-schema.md](06-architecture/trade-schema.md) — Canonical Trade
  Schema + derived metrics (win rate, R-multiple, expectancy, drawdown).

### 07 — Constraints
- [07-constraints.md](07-constraints.md) — Iran-specific constraints (endpoint
  reachability, payments, no Firebase, data costs, EA-push as sovereign fallback).

### 08 — Roadmap
- [08-roadmap.md](08-roadmap.md) — phased delivery (MVP → Phase 2 → Phase 3 add-ons).

### 09 — Knowledge Graph
- [09-knowledge-graph.md](09-knowledge-graph.md) — the Neo4j graph schema mirroring this
  design (nodes, edges, example queries).

## Branch

All initial design lives on branch **`docs/initial-design`**. Not committed to `main`.

## What is intentionally design-only

- **Pillar F (live-signal + auto-execution)** — regulated activity; design-only until a
  licensing determination is made; confirm-before-execute is the default. See the handoff
  note at the repo root.

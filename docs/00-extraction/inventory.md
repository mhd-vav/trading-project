---
title: Trading Concerns Inventory — TaskFlow Extraction
type: inventory
status: complete
date: 2026-07-12
source: ~/taskplanner (TaskFlow app)
---

# Trading Concerns Inventory — What Lives in TaskFlow Today

This document lists every trading-related module, screen, model, route, table, and
asset currently inside the TaskFlow app, with its file path and dependencies. It is
the factual basis for the separation described in [shared-platform.md](shared-platform.md)
and [migration-plan.md](migration-plan.md).

> **Plain-English summary for a newcomer.** TaskFlow is a Persian task/notes/projects/news
> productivity app. At some point a "Premium Hub" was added that promised five premium
> sections, one of which was a "Trader / بازار گاوی" (Bull Market) tile. That tile is a
> **placeholder only** — it shows a "بزودی" ("coming soon") toast and routes nowhere. There
> is no trading journal feature implemented in code, no broker connector, no trade table,
> and no trading-specific data model. The trading *intelligence* (the debate agents and the
> trading-methods knowledge graph) lives in a **separate** repo (`ai-memory-system`) and in
> the IWE knowledge base — not inside TaskFlow.

## Scope of the scan

Scanned every `.vue` and `.ts` file under `~/taskplanner/src/` plus the backend
`server.mjs` / `backend/api/server.js` and the standalone `news-mas/` Python package, using
case-insensitive search for: `trader | trading | forex | crypto | broker | position |
journal | market | معامله | بازار گاوی | سهام | ارز`.

## Inventory table

| # | Item | File path | Type | Classification | Notes / dependencies |
|---|------|-----------|------|----------------|----------------------|
| 1 | "Trader / بازار گاوی" Premium Hub tile | `src/components/PremiumHub.vue:41` | UI placeholder | **move** | Listed in the `sections` array as `{ key: 'trader', label: 'بازار گاوی', icon: 'trending-up' }`. Marked `upcoming: true` at line 49, so selecting it only shows a "بزودی" toast. No route, no view, no store. |
| 2 | `SectionKey` union type entry `'trader'` | `src/components/PremiumHub.vue:37` | TypeScript type | **move** | The literal `'trader'` in `type SectionKey = 'news' \| 'trader' \| 'notes' \| 'ai' \| 'teams'` exists solely for the placeholder tile. Removing the tile removes this literal. |
| 3 | `.tile-trader` style rule | `src/components/PremiumHub.vue:124` | CSS | **move** | `.tile-trader .tile-icon { color: #0f172a; }` — dead CSS once the tile is removed. |
| 4 | `trending-up` icon usage | `src/components/UiIcon.vue` (Lucide path) | Asset (shared) | **shared** | The `trending-up` Lucide path itself is part of the shared icon set; only its *trading* usage moves. The icon stays in the design system. |
| 5 | News Multi-Agent System (`news-mas/`) | `~/taskplanner/news-mas/` | Python pipeline | **shared** | A LangGraph pipeline that fetches English news → Persian cards. This is *general market news*, not trading-specific. It becomes the **shared general-news service** consumed by both TaskFlow and the new trading app. Depends on GapGPT gateway + Arvan S3. |
| 6 | News DB schema (`news` schema on shared daahian PostgreSQL) | `news-service/sql/` | Data model | **shared** | The `news` schema stores published news cards. General news → shared platform. Trading-app-specific market news (delayed/live tiers) is a *new* concern, not present in TaskFlow. |
| 7 | `platform.users` / `platform.otp_codes` / `platform.tenants` | daahian PostgreSQL `platform` schema | Data model | **shared** | Global phone-based identity + OTP used by TaskFlow today. The shared-platform layer reuses this for SSO across both apps. |
| 8 | `taskplanner.premium_subscriptions` | daahian PostgreSQL `taskplanner` schema | Data model | **shared** | Device-bound premium (Zarinpal). Billing is shared; a *trading* subscription tier is new and lives in the trading tenant/schema. |
| 9 | Zarinpal billing integration | `backend/api/server.js` + `src/utils/` | Service | **shared** | Payment gateway; reused by the trading app's subscription tiers. |
| 10 | PWA push notification utility | `src/utils/` (Phase 10) + service worker | Service | **shared** | No Firebase — PWA push. Reused for trading alerts. |

## What does NOT exist in TaskFlow (important)

The following trading-product concerns have **no** implementation in TaskFlow and are
greenfield for the new product:

- Any trading journal view, trade-entry form, or journal list.
- Any broker connector (cTrader, MetaTrader/MetaApi, EA-push, CSV/HTML report parser).
- Any canonical Trade Store / trade table / trade schema.
- Any market-hours dashboard, economic calendar, watchlist, or live-price component.
- Any analytics engine (win rate, R-multiple, expectancy, drawdown).
- Any MAS analysis bundle, deliberation graph, or aggregation math. (The related
  *debate-agents* research exists in `ai-memory-system`, a separate repo, and the
  *trading-methods* knowledge exists in IWE — both are reference inputs to the new
  product's design, not TaskFlow code.)
- Any disclaimer/acknowledgment framework or audit log for disclaimers.
- Any alerts (price/news/session) wiring beyond the generic PWA-push utility.

## Classification key

- **move** — Belongs to the new trading product. Remove from TaskFlow.
- **shared** — Belongs to a shared platform layer both apps consume (auth, billing,
  notifications, general news, design system). Stays accessible to TaskFlow and is also
  consumed by the trading app.
- **stays** — Genuinely TaskFlow-only (tasks, projects, routines, calendar, pomodoro,
  fun modes, family accounts, student items, social posts). Not listed individually
  because none are trading-related.

## Why this is a clean extraction

Because the trading footprint in TaskFlow is a single placeholder tile (items 1–3) plus
the generic shared infrastructure it would have leaned on (items 5–10), the *removal* from
TaskFlow is tiny and safe: delete the `'trader'` section entry, its type literal, and its
CSS rule. The *new* trading product is built fresh, consuming the shared platform layer.

See [shared-platform.md](shared-platform.md) for the platform boundary and
[migration-plan.md](migration-plan.md) for the data-move and rollback strategy.

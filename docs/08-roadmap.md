---
title: Phased Roadmap
type: roadmap
status: proposed
date: 2026-07-12
---

# Phased Roadmap

The scalability logic: **ship value with zero broker connection first**, add connectors
and paid data next, add the regulated add-ons last.

## MVP — value with zero broker connection first

- Core cockpit (home/dashboard with market hours, delayed news strip, watchlist).
- **Delayed** data (free sources).
- Market-hours dashboard.
- cTrader OAuth connector + **CSV/HTML statement import** (so users can journal even
  before OAuth is wired everywhere).
- Auto-journal from imported trades (canonical trade schema + idempotent upserts).
- Basic analytics (win rate, R-multiple, expectancy, drawdown).
- **One MAS bundle (Technical) end-to-end as proof** of the deliberation→verdict flow.
- Disclaimer framework (persistent bar, onboarding acknowledgment, audit log).

> MVP proves the loop: *see market → import trades → journal → see educational analysis —
> all clearly educational, with no live data cost and no regulated activity.*

## Phase 2 — add connectors and paid data

- **Premium live data / live news** (paid feeds).
- **MT4/MT5 via MetaApi** connector.
- **Advanced analytics** (session/regime breakdowns).
- **More MAS bundles** (Order-Flow, Macro, Sentiment, Quant; On-Chain for crypto).
- **Alerts** (price, news, session) via the shared notification bus.

## Phase 3 — the regulated add-ons (last, and only if licensing permits)

- **EA-push connector** (the sovereign fallback for Iran reachability).
- **Premium+ live-signal add-on — manual-confirm mode first.** The background agent
  pre-analyzes high-impact news into a structured educational assessment; the default is a
  pre-filled order ticket the user confirms.
- **Community / learning** features.
- **Only then, if licensing permits:** the fully-automatic execution mode (still
  confirm-before-execute default, separately enabled, licensing-dependent).

## Why this order

1. **MVP** costs almost nothing in third-party fees (free delayed data) and carries zero
   regulatory risk (education + journaling only). It proves the product and grows the
   community.
2. **Phase 2** adds the things that cost money (live data) — which is exactly what users
   pay for — and the connectors that make journaling effortless.
3. **Phase 3** adds regulated activity last, behind licensing, behind manual confirm, so
   the product's legal exposure grows only after the safe core is proven and revenue-
   generating.

## Out of scope at launch

- Stocks/derivatives beyond Forex and Crypto.
- Fully-automatic order routing without a license.
- Any guarantee or signal-selling framing.

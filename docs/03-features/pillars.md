---
title: Feature Pillars (A–F)
type: features
status: proposed
date: 2026-07-12
---

# Feature Pillars

The product is organized into six pillars. Pillars A–E are the core; **Pillar F is an
add-on, licensing-gated, and design-only until a licensing determination is made.**

## Pillar A — Market Awareness (mostly Free)

Helps the trader simply *know what's happening*. Free by default; live/early data is
Premium.

- **Market Hours Dashboard** — a live view of which trading sessions are open (Asia/Tokyo,
  London, New York) and their overlaps, in the user's local time. *Why it matters:*
  liquidity and volatility differ by session; the London/New York overlap is typically the
  most active window.
- **Economic Calendar** — upcoming scheduled events (rate decisions, CPI, employment
  reports) with expected impact. Delayed/standard free; live/early premium.
- **Market News** — headlines and summaries. Delayed free; live premium; live-analyzed
  signal is a Premium+ add-on (Pillar F). General news comes from the shared news service.
- **Live Prices / Watchlist** — user-chosen instruments. Delayed free; live/streaming
  premium. (Free data sources and their Iran-network reachability are documented in the
  IWE knowledge base: `documents/trading/market-data-free-sources`.)

## Pillar B — Account Connection

Connect broker accounts so trades flow in automatically. The app never asks for a trading
password in plaintext; OAuth where possible, read-only otherwise.

- **cTrader via official Open API with OAuth 2.0** — one-click authorize, no password
  stored. The recommended primary path.
- **MT4/MT5 via a cloud bridge (e.g., MetaApi)** — user provides account number,
  read-only investor password, and broker server, once. Alternatives: a custom Expert
  Advisor that pushes data, or manual HTML/CSV statement import.
- **Multi-account support.**

### Self-validating connection wizard

- Live feedback, structured error codes, actionable messages.
- A **diagnostic correlation ID** with redacted reports sent to an automation endpoint
  (n8n/LangGraph) for triage. Reports are redacted so no credentials leak.
- **Developers do NOT connect on behalf of users.** Reasons: (1) *Security* — handling
  others' broker credentials creates a massive liability and attack surface. (2)
  *Liability* — acting on a user's account crosses from education into agency. (3) *OAuth
  impossibility* — cTrader OAuth is per-user; there is no clean way to proxy it. (4)
  *Scalability* — manual onboarding does not scale and invites support overload.

> **Iran reachability note.** cTrader/MetaApi cloud endpoints may be unreachable from Iran
> in production. The EA-push connector (Pillar-adjacent, Phase 3) is the sovereign fallback
> because the EA runs on the user's own MetaTrader terminal and pushes data out — no
> inbound cloud bridge needed. See [../07-constraints.md](../07-constraints.md).

## Pillar C — Journal & Analytics

- **Auto-populated journal.** Trades imported from the connected account become journal
  entries, enriched with user tags, notes, and screenshots.
- **Performance analytics.** Win rate, R-multiple, expectancy, drawdown, session/regime
  breakdowns. Basic free; advanced premium. Metrics are derived from the
  [Canonical Trade Schema](../06-architecture/trade-schema.md).

## Pillar D — Alerts & Habits

- Price, news, and session alerts via PWA push (no Firebase), Telegram bot, and in-app.
- Trading-plan reminders and journaling nudges (habit building).

## Pillar E — MAS Analysis (the differentiator)

The explainable multi-agent deliberation engine. Presented as **educational analysis,
never a signal.** Full spec in [../04-mas/](../04-mas/). Six analytical bundles debate,
an orchestrator weighs them by regime, a risk governor can veto/scale, and the user sees
the verdict *and the disagreement*.

## Pillar F — Live-Signal Add-on (Premium+) and Auto-Execution Add-on

> ⚠️ **WARNING — regulated activity.** Automated order routing based on news is a
> regulated activity in most jurisdictions and is materially different from educational
> journaling. This pillar is **gated behind licensing** and is **design-only** until a
> licensing determination is made. Even when built, the default is
> *confirm-before-execute*; fully automatic execution is a separately-enabled,
> licensing-dependent step. See [news-and-signals.md](news-and-signals.md) and the
> [legal framework](../05-legal/disclaimer-framework.md).

## Free vs Premium philosophy

- **Free tier builds habits and awareness** (delayed data, market hours, journaling,
  basic analytics) so the community grows.
- **Premium sells the cost-intensive parts** (live data, live news, advanced analytics) —
  expensive third-party live data justifies putting it behind a paid tier.
- **Premium+ sells the live-signal add-on** (licensing-gated).

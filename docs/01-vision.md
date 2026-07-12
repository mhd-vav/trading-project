---
title: Product Vision — The Trader Cockpit
type: vision
status: proposed
date: 2026-07-12
---

# Product Vision

## One sentence

A **trader cockpit** for Forex and Crypto traders, localized for Iran, that helps traders
stay aware of the market, connect their accounts to auto-build a journal, analyze their own
performance, and read transparent, multi-perspective AI analysis — strictly as an
educational and record-keeping tool.

## What it is (plain language)

Think of a trader's desk. They need to know: *are the markets open right now? what's the
news? what are my positions doing? how did I trade last month — was I actually good or just
lucky?* This app is that desk, on a phone. It shows market hours, news, prices, a journal
of past trades, and an AI that debates with itself to explain *why* something might be
happening.

## What it is NOT (positioning, stated clearly)

> **This is not a signal service. It does not sell guaranteed buy/sell calls.**

It is an **explainable analysis and journaling cockpit**. Everything the AI outputs is
*educational*. When the app says "selling looks like the better policy right now," that is
an explanation of reasoning, not financial advice. Every action a user takes on the basis
of any analysis is solely the user's responsibility. This is repeated constantly in the
[legal/disclaimer framework](05-legal/disclaimer-framework.md).

This positioning is deliberate for two reasons:

1. **Legal/regulatory.** Selling guaranteed signals and auto-executing trades on news are
   regulated activities. Staying educational keeps the core product on safe ground.
2. **Trust in the Iranian market.** Iranian traders have been burned by opaque signal
   sellers. Transparent, multi-perspective reasoning that *shows its work* is the
   differentiator that earns trust.

## The four jobs it does for a trader

1. **Stay aware of the market.** Market-hours dashboard (which sessions are open),
   economic calendar, delayed news, a watchlist with delayed prices. Free tier.
2. **Connect accounts and auto-populate a journal.** Link cTrader (OAuth) or MT4/MT5
   (via a cloud bridge), import CSV/HTML statements, or receive data from an Expert
   Advisor. Trades become journal entries the user enriches with tags, notes,
   screenshots, and a strategy label.
3. **Analyze their own performance.** Win rate, R-multiple, expectancy, drawdown,
   breakdowns by session and regime. Basic free, advanced premium.
4. **Read transparent, multi-perspective AI analysis.** The MAS engine (see
   [04-mas/](04-mas/)) — multiple AI agents debate from different analytical worldviews,
   an orchestrator weighs them, and the user sees the verdict *and the disagreement*.
   Educational, never a signal.

## Who it is for

- **Primary:** Forex and Crypto retail traders in Iran, Persian-first, who want to
  improve through journaling and understanding, not through black-box signals.
- **Trading styles:** scalping/intraday and swing.
- **Markets:** Forex and Crypto (stocks/derivatives out of scope at launch).

## Monetization ladder (high level; detail in features/roadmap)

- **Free** — delayed data, market hours, journaling, basic analytics. Builds habits and
  awareness so the community grows.
- **Premium** — live data/news, advanced analytics. The expensive third-party live data
  justifies putting it behind a paid tier.
- **Premium+** — a *live-signal add-on* (licensing-gated) where a background agent
  pre-analyzes high-impact news into a structured educational assessment. The optional
  *auto-execution add-on* is design-only until licensing is settled (Pillar F).

## How it relates to TaskFlow and the shared platform

This product shares authentication, billing, notifications, the general news service, and
the design system with TaskFlow via the [shared platform layer](00-extraction/shared-platform.md).
Both are tenants on the same daahian PostgreSQL. They are sibling products, not one app.

See [02-app-flow.md](02-app-flow.md) for the screen-by-screen experience.

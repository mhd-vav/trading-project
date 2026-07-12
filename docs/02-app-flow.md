---
title: App Flow — Screen by Screen, From Open Onward
type: app-flow
status: proposed
date: 2026-07-12
---

# App Flow — The Whole Journey

This describes the user's experience screen by screen, so a newcomer can picture the
whole app before any code exists.

## 1. Splash + first-run onboarding

The app opens to the brand splash, then (first time only) a short onboarding:

- **a) Plain-language framing.** "این برنامه برای یادگیری و ثبت معاملات است، نه مشاوره
  مالی." (This app is for learning and recording trades, not financial advice.)
- **b) Disclaimer acknowledgment (required).** The user cannot proceed without tapping
  "متوجه شدم / I understand." This acknowledgment is logged with a timestamp
  ([audit log](05-legal/disclaimer-framework.md)).
- **c) Market interest.** Forex, Crypto, or both.
- **d) Trading style.** Scalping/Intraday, Swing, or both.

These choices seed the market-hours view and the default watchlist.

## 2. Home / Cockpit (default screen after login)

The dashboard. A single glance answers "what's the state of the world right now?":

- **Market-hours status** — which sessions are open (Tokyo, London, New York) and their
  overlaps, in the user's local time. A green/red dot per session.
- **Delayed news strip** — latest headlines from the shared general-news service
  (delayed on the free tier).
- **Watchlist** — the user's chosen instruments with delayed prices.
- **Journal summary** (if connected) — today's trades, week's PnL, a one-line streak.
- **Persistent disclaimer bar** — a non-intrusive strip at the bottom of *every* screen:
  "تحلیل‌ها آموزشی است. مسئولیت هر تصمیم با شماست." with a link to the full
  Terms & Rules page. This never dismisses permanently.

## 3. Authentication and account

- **Sign-in** — phone + OTP (shared platform identity). One login works across this app
  and TaskFlow.
- **Account tier display** — a badge showing Free / Premium / Premium+ and what each
  unlocks.
- **Manage subscription** — Zarinpal-powered plan management (shared billing). Monthly or
  yearly; the signal add-on is a separate, separately-opted-in purchase.

## 4. Navigation model

A **bottom tab bar** (RTL: primary tabs on the right) for the five core areas, with
secondary destinations reachable from the cockpit:

- **Home** (cockpit)
- **News** (general delayed news → Premium live news → Premium+ analyzed signal)
- **Market Hours** (sessions, overlaps, economic calendar)
- **Journal** (trade list, trade detail, analytics)
- **Analysis (MAS)** (the explainable multi-agent verdicts)
- Secondary (from cockpit or a "More" sheet): **Alerts**, **Settings**.

A disclaimer link is reachable from every screen via the persistent bar.

## 5. News view (the "news ladder")

Three tiers, explained simply so a beginner sees the ladder:

1. **Free general news (delayed)** — headlines + summaries on a delay. Always available.
2. **Premium live news** — same feed, real-time, plus early economic-calendar releases.
3. **Premium+ live-signal add-on** — a background agent pre-analyzes high-impact news into
   a structured educational assessment (probability of a move of size Y over horizon Z,
   with confidence C), delivered as an instant push/SMS. Always carries the inline
   disclaimer. Licensing-gated. See [news-and-signals.md](03-features/news-and-signals.md).

## 6. Market Hours view

- A timeline of the four major sessions (Sydney, Tokyo, London, New York) in the user's
  local time, with overlap bands highlighted (overlaps = higher liquidity/volatility).
- **Why it matters** (explained to the beginner): liquidity and volatility differ by
  session. The London/New York overlap is typically the most active period.
- **Economic calendar** — upcoming scheduled events (rate decisions, CPI, employment)
  with expected impact. Delayed/standard free; live/early premium.

## 7. Journal view

- **Trade list** — every imported trade as a row (instrument, side, size, result, time).
  Filter by date/session/strategy/tag.
- **Trade detail** — entry/exit prices and times, SL/TP, fees, broker trade ID, plus the
  user's enrichment: tags, notes, screenshots, strategy label.
- **Analytics** — win rate, R-multiple, expectancy, drawdown, and breakdowns by session
  and regime. Basic free; advanced premium. See
  [../06-architecture/trade-schema.md](../06-architecture/trade-schema.md) for the metrics.

## 8. Analysis (MAS) view

- A list of instruments the user follows, each with the latest **verdict** (buy/sell/hold/
  wait) and a conviction bar.
- Tapping one opens the deliberation: the six bundles' stances, where they agree/disagree,
  the orchestrator's weighting by regime, and — importantly — *the disagreement shown as
  the reason* when conviction is low. Educational framing throughout.
- See [04-mas/](04-mas/) for the full engine design.

## 9. Alerts view

- Price alerts, news alerts (high-impact events), session-open alerts.
- Delivery via PWA push (no Firebase), Telegram bot, and in-app — all through the shared
  notification bus.
- Trading-plan reminders and journaling nudges (habit building).

## 10. Settings

- Account, subscription, connected broker accounts, notification channels, market
  preferences (Forex/Crypto, style), language (Persian-first), theme.
- Re-consent for the signal/auto-execution add-ons lives here, behind multi-step opt-in.

## 11. Terms & Rules page

The full disclaimer text, the acknowledgment history, and the add-on re-consent flow.
Reachable from the persistent disclaimer bar on every screen.

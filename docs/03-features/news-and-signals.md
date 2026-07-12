---
title: News System & the Premium+ Live-Signal + Auto-Execution Add-ons
type: features
status: proposed
date: 2026-07-12
gating: licensing-required-for-auto-execution
---

# News System & the Premium+ Add-ons

## The three-level news ladder

Explained so a beginner sees the ladder from free to paid:

1. **Free general news (delayed)** — headlines and summaries on a delay. Educational,
   always available. Sourced from the shared general-news service (the same Persian news
   cards TaskFlow uses).
2. **Premium live news** — same feed, real-time, plus early economic-calendar releases.
3. **Premium+ live-signal add-on** — a background agent pre-analyzes incoming
   high-impact news. Instead of just showing a headline, it produces a **structured
   educational assessment**, for example:

   > "This report, given current market statistics, has an estimated X% probability of a
   > bullish move of size Y over horizon Z, with confidence C."

   Delivered as an instant push notification or SMS. **Every such message carries the
   educational disclaimer inline.**

## End-to-end signal flow

```
news source → ingestion → pre-analysis agent (MAS core) → risk filter (user config)
  → educational assessment → push/SMS → [optional] pre-filled order ticket → [optional] auto-execute
```

The pre-analysis agent **reuses the same MAS reasoning core** as Pillar E (see
[../04-mas/](../04-mas/)). The two systems share one reasoning engine: the deliberation
output that produces an educational verdict can also feed the news-signal pre-analysis.

## The optional auto-execution add-on (design-only, licensing-gated)

The user *may* connect the news-signal stream to their own trading account, together with a
**risk-and-capital-management configuration**:

- Max risk per trade
- Position-sizing rule
- Max concurrent exposure
- Stop/target policy
- Session and event blackout windows
- Kill-switch (instant halt)

When a qualifying signal arrives, the app *can* open a position in-app according to that
config.

### Hard gates on this add-on

- It is an **add-on, not a core feature**.
- It **only activates where licensing permits.**
- It sits behind an **extra subscription** (Premium+).
- It requires an **explicit multi-step user opt-in** that restates the risk in the user's
  own words, with an audit-log entry.

### ⚠️ WARNING — regulated activity (prominent)

> **Automated order routing based on news is a regulated activity in most jurisdictions
> and is materially different from educational journaling.** Disclaimers reduce but do not
> eliminate legal exposure. **Recommendation:** this module remains **design-only** until a
> licensing determination is made. The risk engine and the manual-confirmation mode must
> be built and shipped before any fully-automatic mode.

### Confirm-before-execute is the default

Even for Premium+ users, the **safe default** is that a signal opens a **pre-filled order
ticket** the user taps to confirm. Fully automatic execution is an **explicit, separately
enabled, licensing-dependent step** — never the default, and not built in the MVP or
Phase 2. It appears only in Phase 3 *if* licensing permits.

## Pillar F note

This entire add-on is Pillar F. It is the only part of the product that touches real order
routing, and it is treated with the maximum caution: design-only, manual-confirm-first,
licensing-gated. See the [legal framework](../05-legal/disclaimer-framework.md) for the
disclaimer, re-consent, and audit-log requirements specific to this pillar.

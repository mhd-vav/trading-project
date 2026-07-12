---
title: Bundle 1 — Technical / Price-Action
type: bundle
status: proposed
date: 2026-07-12
---

# Bundle 1 — Technical / Price-Action

- **Shared frame:** OHLCV data, intraday-to-swing timeframes. All agents look at the same
  candles and the same decision.
- **The single question the bundle answers:** *Is the market trending or ranging, and
  where is price within that structure?*
- **Member agents (with the built-in opposition):**
  - **Trend-continuation** agent — argues the trend is real and to trade with it.
  - **Mean-reversion** agent — argues price is extended and will revert.
  - **Structure referee** — identifies support/resistance, break/retest structure.
  - **Volatility-regime referee** — classifies the volatility regime (expansion vs
    contraction) to contextualize the other two.
- **Why the internal debate is logical:** trend-continuation and mean-reversion are
  genuine opposites that cannot both be right at once. The referees don't pick a side;
  they constrain *when* each is more likely (e.g., mean-reversion works in ranges;
  trend-continuation works in expansions). The volatility-regime referee is the
  commensurability anchor: it defines the condition under which each thesis applies.
- **Evidence grounding:** OHLCV, moving averages, ATR, market-structure swings. Relates
  to the Wyckoff/Market-Profile agent specs in the trading-methods knowledge base.

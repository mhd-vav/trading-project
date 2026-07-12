---
title: Bundle 2 — Order-Flow / Microstructure
type: bundle
status: proposed
date: 2026-07-12
---

# Bundle 2 — Order-Flow / Microstructure

- **Shared frame:** volume, the order book, delta (buy-initiated vs sell-initiated volume),
  market/volume profile.
- **The single question the bundle answers:** *Is the move backed by real flow, or is it
  being absorbed (fakeout)?*
- **Member agents (with the built-in opposition):**
  - **Participation/confirmation** agent — argues the move is backed by aggressive,
    two-way participation.
  - **Absorption/fakeout** agent — argues large resting orders are absorbing the move and
    it will fail.
  - **Imbalance referee** — detects directional order-book imbalances.
  - **Cumulative-delta referee** — tracks net aggressive buying/selling over the session.
- **Why the internal debate is logical:** "confirmed by flow" vs "absorbed by resting
  liquidity" is the central tension of microstructure. The referees provide the measurable
  evidence (imbalance, cumulative delta) that decides which thesis holds. This is TempUser's
  Market-Profile strength (see the C++ POC/Value-Area engine in `ai-memory-system`).
- **Data cost note:** true order-flow/tick data needs a paid feed (Databento-class). This
  bundle is therefore Premium, not free.

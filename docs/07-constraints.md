---
title: Iran-Specific Constraints
type: constraints
status: proposed
date: 2026-07-12
---

# Iran-Specific Constraints

These constraints shape every architecture decision. They are not theoretical — most are
network-tested facts from TempUser's environment (see IWE
`documents/trading/market-data-free-sources`).

## 1. Reachability of third-party cloud endpoints

- Many international cloud APIs are **blocked or unreliable from Iran**. Tested
  2026-07-09: **Coinbase, Binance, Kraken** → connection refused / 403. Working without a
  key: exchangerate-api (forex, daily), CoinGecko (crypto, ~1min), gold-api.com (gold,
  ~30s).
- **cTrader / MetaApi cloud bridges may be unreachable** in production from Iranian
  infrastructure. This is a real risk for the account-connection layer.
- **Implication:** the **EA-push connector is the sovereign fallback.** A user's Expert
  Advisor runs on *their own* MetaTrader terminal (on a VPS with internet access) and
  *pushes* trade data out to our endpoint. No inbound cloud bridge is needed, so it works
  even when broker clouds are unreachable from our servers.

## 2. Local payment integration for subscriptions

- International payment processors (Stripe, PayPal) are unusable. Subscriptions use
  **Zarinpal** (Iranian gateway), already integrated in the shared billing layer.
- Sandbox mode for now; merchant credential exists in the shared secrets store.

## 3. No Firebase — use PWA push / Telegram / self-hosted push

- Firebase Cloud Messaging is blocked / unusable. Notifications use:
  - **PWA Web Push** (VAPID, no Firebase) — already built in TaskFlow's shared layer.
  - **Telegram bot** delivery — already built.
  - **SMS via SMS.ir** — already configured.
- No Google-services dependency on the Android build.

## 4. Data-vendor cost and licensing

- **Free tiers are near-real-time, not tick.** Forex daily, crypto ~1min, gold ~30s. True
  streaming/tick data needs paid keys (Tiingo, Twelve Data, Databento, Polygon).
- **This cost is exactly why live data is a paid tier.** The free tier uses the free
  (delayed/near-real-time) sources; the Premium tier funds the paid feeds.
- **Order-flow / tick data** (Bundle 2 of the MAS) is the most expensive — it is Premium.

## 5. Latency for live data

- Even with paid feeds, Iran-network latency adds delay. The product's positioning
  (educational, not HFT/arbitrage) means sub-second tick latency is **not required**.
  Delayed/near-real-time is acceptable for awareness, journaling, and educational analysis.

## 6. Language and trust

- **Persian-first UI, RTL throughout.** Reuse TaskFlow's design system and Persian-numeral
  formatting.
- **Trust is the product moat.** Iranian traders have been burned by opaque signal sellers.
  The MAS engine's **transparent, multi-perspective reasoning that shows its work** (and
  shows its disagreement) is what earns trust. This is why the engine is explainable by
  design, not just performant.

## 7. npm is blocked; builds use `npx vite build` only

- Per the global rules, `npm install` is blocked in Iran. Existing dependencies are already
  installed. The frontend builds with `npx vite build`. The trading app must respect the
  same constraint — no new heavy npm-only build steps without a pre-installed cache.

## 8. The EA-push connector as the sovereign path (why it matters)

To summarize why EA-push is emphasized: when international broker clouds are unreachable,
the only reliable way to get a user's MT4/MT5 trade data is to have software running on the
user's own terminal (which sits on a connected VPS) push it to us. This keeps the product
working inside Iran's network constraints and keeps the user in control of their own data
egress.

---
title: TradingAgents — Session State & Product Roadmap
type: session-state
domain: trading
status: active
parent: index
repo: https://github.com/mhd-vav/ai-memory-system
created: 2026-07-12
---

# TradingAgents — Full Session State (Consolidated)

> Single source of truth for all TradingAgents / ai-memory-system work across
> merged sessions. **FACTS** = done and verified. **RECOMMENDATIONS** = planned,
> not yet built. Update this file when work completes so the next session
> (human or agent) resumes from current reality, not stale memory.

## 1. What This Project Is

A self-learning, adversarial **multi-agent trading analysis system** built on
LangGraph. Multiple AI agents (each a different model) analyze the same ticker
using a deterministic C++ Market Profile engine as ground truth, then **debate**
until an arbiter picks a winner. All reasoning traces to computed numbers
(POC/Value Area/shape/moments/HVN-LVN), never free text.

Two graphs, both live-tested:
1. **4-analyst + judge** (`multi_agent/graph.py`) — fan-out/fan-in. DeepSeek,
   Grok, Gemini-flash, Gemini-pro → Sonnet-5 judge.
2. **Debate graph** (`multi_agent/debate_loop.py`) — Quant (claude-opus-4-8,
   dual-sided math) vs Auctioneer (gemini-3.1-pro, Dalton/Wyckoff) over C++
   engine numbers → arbiter (claude-sonnet-5).

Repos:
- `github.com/mhd-vav/ai-memory-system` — agents, graphs, API, data layer.
- `github.com/mhd-vav/trading-mp-engine` — C++ engine (13 golden tests green).

## 2. FACTS — What Is DONE and Verified

### 2.1 Core engine + graphs (FACT)
- C++ engine `trading-mp-engine` init'd, pushed, 13 golden tests green.
  Binary `build/mp_profile` = JSON dumper.
- `profile_provider.py`: yfinance OHLCV → volume-at-price ladder → C++ engine →
  structured evidence bundle.
- Both LangGraph graphs built, live-tested on AAPL/MSFT/NVDA/TSLA, persisted to
  `neo4j-trade` (Docker, bolt:7688, pass `tradeKg2026`) with `DISAGREES_WITH`
  edges when agents end on different directions.

### 2.2 Data layer (FACT — all built this session, committed + pushed)
- **`multi_agent/market_data.py`** — resilient forex/gold/crypto fetcher.
  Primary→fallback chains (Coinbase/Binance/Kraken → er-api/CoinGecko/gold-api).
  Per-source timeout + try/except. Normalized schema. Returns quotes + failures.
  Live-tested from Iran: 7 quotes via fallbacks; Coinbase/Binance blocked (000),
  Kraken 403 — all fell back gracefully.
- **`multi_agent/news_data.py`** — ticker-aware news (newsapi primary for
  equities, newsdata coin-filter primary for crypto). Dual-source resilient.
  Keys in `.env.local` (gitignored). Live-tested: AAPL + BTC.
- **`multi_agent/sentiment.py`** — LLM-based sentiment scoring via GapGPT
  gateway (gemini-flash-lite-latest). One batched call per ticker →
  bullish/neutral/bearish + confidence-weighted aggregate + top_driver. No new
  API. Live-tested: AAPL +0.19 bullish, BTC +0.34 bullish.
- Evidence bundle now stacks **four layers**: C++ profile → macro snapshot →
  news headlines → sentiment score. Controlled by `INCLUDE_MACRO` /
  `INCLUDE_NEWS` / `INCLUDE_SENTIMENT` flags.

### 2.3 API + BYOK (FACT — committed `968c19a`)
- **`api/provider_config.py`** — bring-your-own-key layer. Per-request
  resolution: BYOK (user's base_url+key+models, zero cost) or managed (GapGPT
  gateway). Three managed tiers: **free** (deepseek/gemini-flash-lite),
  **managed** (gemini-3.1-pro/sonnet-5), **premium** (claude-opus-4-8).
  Contextvar-based — existing graph code unchanged.
- **`api/main.py`** — FastAPI app. `GET /api/health`, `POST /api/debate`,
  `GET /api/debate/stream` (SSE per-node events), `POST /api/analyze`.
  CORS enabled, `/docs` interactive. All endpoints accept BYOK overrides.
- Agent models now tier-aware (quant/auctioneer/arbiter resolve from active
  provider config; CLI falls back to hardcoded defaults — unchanged).
- **`Dockerfile`** (python:3.12-slim, port 5000) + `requirements.txt` +
  `.dockerignore`. Build verified: image builds, container boots,
  `/api/health` returns 200.

### 2.4 Network reality (FACT)
- GapGPT gateway (`api.gapgpt.app`) reachable from Iran + Runflare.
- newsapi.org, newsdata.io, CoinGecko, gold-api, er-api: reachable from WSL.
- **OpenRouter BLOCKED at IP level** from Iran (Cloudflare 403 on entire domain,
  including homepage). Tested with curl + Python SDK + curl_cffi impersonation.
  Workaround exists: route through v2ray proxy (`socks5h://192.168.0.173:10808`
  or via `proxychains4`), but free models are unreliable anyway (429/502).
  **Decision: abandoned OpenRouter free models; reverted to GapGPT gateway.**
- Free OpenRouter models benchmarked before abandonment (via proxychains):
  nemotron-3-ultra-550b 6/7, nemotron-3-nano-30b 6/7, gpt-oss-20b 6/7,
  tencent/hy3 6/7. Rate-limited/unavailable: gpt-oss-120b, gemma-4-31b/26b (429).

### 2.5 Deployment status (FACT)
- **Runflare CLI currently unavailable.** Deployment deferred.
- Full deploy guide captured in `docs/RUNFLARE-DEPLOY.md` (env vars, subdomain,
  smoke tests, BYOK verification, rollback).
- Backend is deploy-ready (Docker verified); not yet live.

## 3. CURRENT STATUS QUO (FACT)

| Component | State |
|---|---|
| C++ engine | ✅ Done, tested, pushed |
| Debate graph + 4-analyst graph | ✅ Done, live-tested |
| market_data / news_data / sentiment | ✅ Done, live-tested |
| FastAPI + BYOK + SSE | ✅ Done, Docker-verified |
| Frontend (Next.js UI) | ❌ Not started |
| Outcome feedback loop | ❌ Not started (next in AGENTS.md) |
| Auth + billing | ❌ Not started |
| Track record page | ❌ Not started |
| Runflare deployment | ⏸ Deferred (CLI down) |

**Git HEAD:** `master` branch, latest commit `5e3dcf2` (deploy doc).
**Local working dir:** `/home/tempuser/ai-memory-system`
**KB doc:** this file, mirrored to neo4j-kb.

## 4. RECOMMENDATIONS — Product Roadmap (not yet built)

Prioritized by impact-on-sellability vs. effort. Sequencing recommendation at
the end.

### Tier 1 — Ship-blocking
- **Frontend (live debate UI)** — Next.js app consuming `/api/debate/stream`.
  Agents rebutting in real time, C++ chart + sentiment beside it. The demo-hammer.
  Files live in `/mnt/c/Users/TempUser/Projects/trading_project` (Next.js
  scaffold already present).
- **Outcome feedback loop** — record actual price N days after each decision,
  score agents, write `(:Outcome)-[:EVALUATES]->(:Decision)`. Converts opinions
  into proof. Already next in AGENTS.md.
- **Auth + account tiering** — minimal email/password or Google OAuth (client ID
  exists) + Zarinpal/Stripe. Ties BYOK vs managed billing to a user.

### Tier 2 — Differentiators
- **Track record / leaderboard** — public page: historical calls, win rates per
  agent/regime/ticker. The marketing engine.
- **Watchlist + alerts** — recurring debate on schedule, notify on verdict flip
  or confidence threshold. Turns one-shot into subscription.
- **Regime detection** — classify market, route to winning agent per regime
  (informed by outcome loop).
- **Agent comparison / A-B** — "which AI model wins at stock analysis this month"
  (each analyst is a different model → novel, linkable angle).

### Tier 3 — Expansion
- **Portfolio constructor** — agents debate allocation, not just direction.
- **Backtesting sandbox** — run debate over historical windows. Freemium hook.
- **Custom agents / personas** — users define their own agent. BYOK at the
  intelligence layer.
- **API as a product** — sell debate-engine API access (B2B embed).
- **Multi-asset** — extend debate to crypto/gold/forex (data layer already
  fetches these).

### Tier 4 — Moat
- **Self-learning calibration** — idle learner weights agents by outcomes.
  Accumulated data, not just code.
- **Community-sourced outcomes** — users mark "I took this trade" → pool results.
- **Explainability export** — PDF/shareable report per decision (compliance-friendly).

### Recommended sequencing
1. Frontend (now) — demo + product shell.
2. Outcome feedback loop — so frontend shows track records from day one.
3. Auth + billing — minimal, enough to charge.
4. Track record page — outcome data → marketing.
5. Tier 2 differentiators in parallel.

**Pitch this builds toward:** *"Watch elite AI agents debate any stock in real
time — with a verified track record. Bring your own key free, or subscribe for
managed access."*

## 5. Key Paths (for next session)

- **venv:** `/home/tempuser/ai-memory-system/.venv`
- **Env:** `cd /home/tempuser/ai-memory-system && set -a && . ./.env.local`
- **API keys in `.env.local`:** `OPENAI_API_KEY`, `NEWSAPI_KEY`, `NEWSDATA_KEY`,
  `TRADINGAGENTS_LLM_BACKEND_URL=https://api.gapgpt.app/v1`
- **neo4j-trade:** bolt:7688, pass `tradeKg2026` (experience graph)
- **neo4j-kb:** bolt:7687, pass `iweKg2026` (knowledge mirror)
- **C++ engine:** `/mnt/c/Users/TempUser/Projects/Trading_Project/v2/build/mp_profile`
- **Frontend dir:** `/mnt/c/Users/TempUser/Projects/trading_project` (Next.js)
- **Run local API:** `uvicorn api.main:app --host 0.0.0.0 --port 5000 --reload`
- **Run debate CLI:** `python -m multi_agent.run_debate AAPL --rounds 2`
- **Mirror this doc:** `python -m iwe_mirror.mirror sync-doc multi-agent/ai-memory/trading-agents-session-state`

## 6. Immediate Next Action

Build the Next.js frontend (`/mnt/c/Users/TempUser/Projects/trading_project`)
that calls `/api/debate/stream` and renders the live debate. Then the outcome
feedback loop. See Section 4 sequencing.

# MASTER PROMPT — Build the Trading App (MAFID — Market Intelligence Cockpit)

> Paste this into a fresh CLI-agent session to build the trading product end to end.
> It merges three existing efforts into ONE coherent build. Read the whole prompt
> before writing any code. Work in: `C:\Users\TempUser\Projects\Trading_Project`
> (WSL: `/mnt/c/Users/TempUser/Projects/Trading_Project`).

---

## 0. Your Role

You are a senior full-stack engineer shipping a **production** trading-market-
intelligence product for the Iranian market (Persian-first, RTL). You build real
code this session — not just docs. You are decisive, you write clean production
code (no placeholders, no TODOs, no mock data), and you verify every change with
a build or test before declaring it done.

You may freely read all reference materials listed in §10. Use them as
authoritative context. Do NOT redesign what is already designed — implement it.

---

## 1. The Three Efforts You Are Merging (read all three first)

This product is the convergence of three pieces that already exist. Your job is
to make them ONE app.

### Effort A — The Design Doc (`docs/`, branch `docs/initial-design`)
At `Trading_Project/docs/` there is a complete product design (committed on
branch `docs/initial-design`). It defines:
- **Vision** (`01-vision.md`): a "trader cockpit" — educational + record-keeping,
  **NOT a signal service**. Forex + Crypto, Iran-localized.
- **App flow** (`02-app-flow.md`): splash → onboarding (disclaimer ack) → cockpit
  → news/market-hours/journal/analysis/alerts/settings.
- **Six feature pillars** (`03-features/pillars.md`): A=Market Awareness,
  B=Account Connection (cTrader OAuth, MT4/MT5 via MetaApi, EA-push, CSV/HTML),
  C=Journal & Analytics, D=Alerts & Habits, E=MAS Analysis (the differentiator),
  F=Live-Signal + Auto-Execution add-on (**design-only, licensing-gated**).
- **The MAS engine** (`04-mas/`): six commensurable bundles (Technical,
  Order-Flow, Macro, Sentiment, On-Chain, Quant), two-tier deliberation
  (intra-bundle debate → orchestrator arbitration by regime), a risk governor
  that can veto/scale, and the aggregation math (stance/dispersion/conviction).
- **Legal** (`05-legal/`): a persistent non-dismissible disclaimer bar on every
  screen + inside every notification, onboarding acknowledgment, append-only
  audit log, Pillar-F re-consent.
- **Architecture** (`06-architecture/`): four layers (Presentation / Domain /
  Ingestion / Connector) + shared platform; the **Canonical Trade Schema** +
  derived metrics (win rate, R-multiple, expectancy, drawdown); Mermaid diagrams.
- **Iran constraints** (`07-constraints.md`): endpoint reachability (cTrader/
  MetaApi clouds may be blocked → EA-push is the sovereign fallback), no Firebase
  (PWA push / Telegram / SMS.ir), free data is near-real-time not tick, Persian-
  first trust.
- **Roadmap** (`08-roadmap.md`): MVP (delayed data, market hours, CSV/HTML import,
  auto-journal, basic analytics, ONE MAS bundle end-to-end as proof) → Phase 2
  (live data, MT4/MT5, more bundles, alerts) → Phase 3 (EA-push, Premium+ signal
  add-on manual-confirm-first, then auto-execution IF licensed).
- **Canonical repo Markdown is the source of truth**; the IWE knowledge graph is
  a queryable mirror.

### Effort B — The Backend Engine (`~/ai-memory-system`, repo `mhd-vav/ai-memory-system`)
A WORKING adversarial multi-agent analysis backend, live-tested. You will wrap
and extend it, not rewrite it.
- **C++ Market Profile engine** (repo `mhd-vav/trading-mp-engine`, 13 golden
  tests green): computes POC / Value Area (VAL/VAH) / shape (D/P/B/double) /
  statistical moments / HVN-LVN / an engine_signal. Binary `build/mp_profile`
  is a JSON dumper. **All agent reasoning must trace to these computed numbers,
  never free text.** (Engine source lives in `Trading_Project/archive/research/
  Market_Profile/` headers + the GitHub repo.)
- **`multi_agent/profile_provider.py`**: yfinance OHLCV → volume-at-price ladder
  → C++ engine → structured evidence bundle.
- **Two LangGraph graphs**:
  1. `multi_agent/graph.py` — 4-analyst fan-out/fan-in + judge.
  2. `multi_agent/debate_loop.py` — **Quant** (claude-opus-4-8, dual-sided math)
     vs **Auctioneer** (gemini-3.1-pro, Dalton/Wyckoff) → arbiter
     (claude-sonnet-5). Nodes: build_evidence → quant_open + auction_open →
     rebut rounds → arbiter. `(:Signal)-[:DISAGREES_WITH]->(:Signal)` when agents
     diverge.
- **Data layer (all live-tested from Iran)**:
  - `multi_agent/market_data.py` — resilient forex/gold/crypto fetcher with
    primary→fallback chains. **Working (no key):** exchangerate-api (forex,
    daily), CoinGecko (crypto, ~1min), gold-api.com (gold, ~30s). **Blocked:**
    Coinbase/Binance/Kraken.
  - `multi_agent/news_data.py` — ticker-aware news (newsapi for equities,
    newsdata coin-filter for crypto). Keys in `.env.local`.
  - `multi_agent/sentiment.py` — LLM sentiment via GapGPT (gemini-flash-lite).
  - Evidence bundle stacks 4 layers: C++ profile → macro → news → sentiment.
- **FastAPI service** (`api/main.py`): `GET /api/health`, `POST /api/debate`,
  `POST /api/analyze`, **`GET /api/debate/stream` (SSE per-node events)**. CORS
  on, `/docs` interactive. Docker-verified (python:3.12-slim, port 5000).
- **BYOK + tiers** (`api/provider_config.py`): per-request resolution — BYOK
  (user's base_url+key+models, zero cost) or managed (GapGPT gateway). Three
  managed tiers: **free** (deepseek/gemini-flash-lite), **managed**
  (gemini-3.1-pro/sonnet-5), **premium** (claude-opus-4-8). Contextvar-based —
  graph code unchanged.
- **Two Neo4j instances** (Docker): `neo4j-kb` (bolt:7687, pass `iweKg2026`) =
  curated knowledge; `neo4j-trade` (bolt:7688, pass `tradeKg2026`) = experience
  graph (Decisions, Signals, Outcomes, Methods, Agents, Regimes, Beliefs). Schema
  in `trade_graph/schema.cypher`.
- **GapGPT gateway** (`https://api.gapgpt.app/v1`) reachable from Iran + Runflare.
  **OpenRouter is IP-blocked** — do not use it. All LLM calls go through GapGPT.

### Effort C — The Frontend Scaffold (`Trading_Project/src/`, Next.js 16 + React 19 + TS + Tailwind 4)
A Next.js App-Router scaffold ALREADY EXISTS with routes matching the MAFID
product brief (`MAFID.ir.md`). It is currently UI shells only (no logic wired).
Existing routes:
- **Marketing/public:** `/`, `/about`, `/pricing`, `/how-it-works`, `/faq`,
  `/contact`, `/login`, `/register`, `/terms`, `/privacy`, `/newsletter`,
  `/request-analysis`, `/sample-analysis`.
- **Member area (`/app/`):** `/dashboard`, `/analyses`, `/analyses/[id]`,
  `/symbols`, `/symbols/[symbol]`, `/watchlist`, `/journal`, `/alerts`,
  `/billing`, `/profile`, `/requests`, `/support`, `/newsletters`.
- **Admin (`/admin/`):** `/users`, `/subscriptions`, `/payments`, `/analyses`,
  `/symbols`, `/requests`, `/verification`, `/notifications`, `/newsletters`,
  `/referrals`, `/audit-logs`, `/settings`.
- `src/components/layout/`, `src/lib/` exist.

### The MAFID Product Brief (`Trading_Project/MAFID.ir.md`) — the business logic
A 28KB developer master prompt defining: **symbol-first architecture**, the
**three-layer analysis output** (market analysis / sentiment analysis / news
analysis per symbol), **OTP auth + Shahkar identity matching + card-ownership
rule**, **member area vs admin/operations panel**, and a **phased plan**. Read it
in full — it is the authoritative product-spec for the Next.js frontend.

---

## 2. The Convergence — How The Three Fit Together

```
                        ┌─────────────────────────────────────────┐
   Next.js frontend ───▶│  FastAPI gateway (api/main.py)           │
   (Effort C scaffold)  │  /api/debate  /api/debate/stream (SSE)   │
   MAFID member+admin   │  /api/analyze  /api/health               │
                        │  BYOK + free/managed/premium tiers       │
                        └───────────────┬─────────────────────────┘
                                        │ LangGraph
                        ┌───────────────▼─────────────────────────┐
                        │  MAS engine (multi_agent/)               │
                        │  6 bundles (Effort A design) generalized  │
                        │  from the Quant-vs-Auctioneer debate      │
                        │  (Effort B prototype)                     │
                        └───────────────┬─────────────────────────┘
                                        │ evidence
                        ┌───────────────▼─────────────────────────┐
                        │  C++ Market Profile engine (ground truth) │
                        │  + market_data / news_data / sentiment    │
                        └───────────────┬─────────────────────────┘
                                        │ writes
                        ┌───────────────▼─────────────────────────┐
                        │  neo4j-trade (experience) + daahian PG    │
                        │  (trading tenant: trades, journal, users) │
                        └─────────────────────────────────────────┘
```

**Key reconciliation decisions (already made — do not relitigate):**
- The **6-bundle MAS** (Effort A) **generalizes** the Quant-vs-Auctioneer debate
  (Effort B). The existing 2-agent debate becomes the *Technical/Price-Action +
  Order-Flow* bundles' prototype. Build the orchestrator + aggregation math on
  top of the existing graph infrastructure.
- The **three-layer output** (market/sentiment/news per symbol, from MAFID) maps
  onto MAS bundles: market→Technical+Order-Flow+Quant; sentiment→Sentiment
  bundle; news→Macro bundle + the `news_data`/`sentiment` providers.
- The frontend is the **MAFID Next.js scaffold** (Effort C). The **design-doc
  app-flow** (Effort A) defines the in-app experience and the disclaimer
  framework that wraps it.
- **Auth/billing/notifications/news** come from the **shared daahian platform**
  (see §6) — do not rebuild them.

---

## 3. Hard Constraints (do not violate)

- **Educational only. NEVER a signal service.** The persistent disclaimer bar
  (Effort A `05-legal/`) is on every screen and inside every notification.
  Pillar F (auto-execution) is **design-only** this session — do not implement
  order routing. Confirm-before-execute is the only mode you may stub.
- **All agent reasoning traces to the C++ engine numbers** (POC/VA/shape/moments/
  HVN-LVN). Agents never argue free text. This is non-negotiable (Effort B core
  principle).
- **All LLM calls via GapGPT gateway** (`https://api.gapgpt.app/v1`). OpenRouter
  is blocked — do not use it. BYOK is supported via `provider_config.py`.
- **No Firebase.** Notifications via PWA Web Push (VAPID), Telegram bot, SMS.ir.
- **npm is blocked in Iran.** The frontend uses Next.js (already scaffolded);
  run `npm install` ONCE if node_modules is missing, then `npm run build`. Do
  not add heavy deps without checking they install offline-cached.
- **No secrets in code.** Keys live in `.env.local` (gitignored) / Infisical.
  Never commit credentials.
- **Persian-first, RTL, Persian numerals (۰-۹).** All user-facing strings via an
  i18n layer, never hardcoded English. "min"/"am"/"pm" may stay English.
- **Production quality only.** No placeholders, no TODOs, no mock data, no
  one-letter variable names, no inline comments unless asked. First line of every
  file = the file path as a comment.
- **Surgical changes.** Touch only what each task requires. Do not refactor
  working Effort-B code unnecessarily. Match existing style.
- **Do not delete** the existing design docs, the MAFID brief, the scaffold, or
  the archive. Build on top of them.

---

## 4. Definition of the Product (one paragraph)

**MAFID** (مفید) is a Persian-first, RTL market-intelligence cockpit for Forex
and Crypto traders. It is **symbol-first**: a user enters through an instrument
(EUR/USD, BTC/USDT, XAU/USD) and sees coordinated **market + sentiment + news
analysis** produced by an **explainable multi-agent engine** that debates from
different analytical worldviews and shows its reasoning and its disagreement. It
also **auto-journals** the user's trades (imported from cTrader/MT4/CSV) and
computes **performance analytics**. Everything is **educational**; a persistent
disclaimer makes that inescapable. Free tier = delayed data + journaling + basic
analytics; Premium = live data + advanced analytics; Premium+ = a licensing-gated
live-signal add-on (design-only for now).

---

## 5. The Build — Tasks in Order

Work top-down. After each task, verify (build/test) before moving on. Use the
agent's `update_plan` to track these.

### Task 1 — Reconcile & plan (no code yet)
- Read `docs/` (Effort A), `MAFID.ir.md` (Effort C brief), `~/ai-memory-system`
  (Effort B), and the IWE KB entries listed in §10.
- Produce/refresh `docs/HANDOFF.md` with: current state of each of the 3 efforts,
  the reconciliation map (§2), and the task list below with status.
- Decide the monorepo layout: keep the Next.js frontend in `Trading_Project/`
  and the Python backend in `~/ai-memory-system/`, connected via the FastAPI
  gateway. Document the two deploy targets (Runflare items on daahian).

### Task 2 — Stand up the backend gateway (verify Effort B runs)
- `cd ~/ai-memory-system && . .venv/bin/activate && set -a && . ./.env.local`
- Run `uvicorn api.main:app --host 0.0.0.0 --port 5000 --reload`. Confirm
  `GET /api/health` → 200. Confirm `POST /api/debate` works for a sample ticker
  (e.g. AAPL). Confirm SSE on `/api/debate/stream`.
- If anything is broken, fix it minimally. Do not rewrite working graphs.
- Wire the Next.js frontend to call this gateway (env var `NEXT_PUBLIC_API_URL`).

### Task 3 — Generalize the MAS engine from 2-agent debate → 6 bundles
This is the core intellectual work. Build on `multi_agent/debate_loop.py`.
- Implement the **bundle abstraction**: each bundle has a shared frame, member
  agents with built-in opposition (thesis vs antithesis + referees), and emits
  `{stance ∈ [-1,1], confidence ∈ [0,1], dispersion, rationale}`. Use the Effort-A
  bundle specs (`docs/04-mas/bundle-*.md`) as the per-bundle design.
- Start with the **Technical/Price-Action bundle** (grounded in the existing
  Wyckoff + Market-Profile agent specs — see §10) and the **Order-Flow bundle**
  (the existing Quant-vs-Auctioneer debate maps here). These two are the MVP proof.
- Implement the **orchestrator** (Tier 2): regime-weighted bundle blending
  (Ω_b(r)), cross-bundle divergence, and the **risk governor** (can veto/scale).
- Implement the **aggregation math** exactly as specified in
  `docs/04-mas/aggregation.md` (S_b, D_b, S*, Conviction). Add unit tests.
- The verdict is {buy/sell/hold/wait} + conviction + the disagreement shown as
  the reason. **Always framed educational.**
- Add new API endpoints as needed (e.g. `POST /api/analyze/symbol`,
  `GET /api/analyze/symbol/stream`) that return the structured verdict.

### Task 4 — Data layer: market hours, delayed prices, economic calendar
- Reuse `multi_agent/market_data.py` (forex/gold/crypto). Add a **market-hours
  service** (session open/close + overlaps in Asia/Tehran time).
- Add an **economic calendar** source. Per the TaskFlow tier-plan research, use
  the ForexFactory scraper (`github.com/ehsanrs2/forexfactory-scraper`, pure
  Python) cached daily server-side in PostgreSQL, OR Finnhub/Financial Modeling
  Prep freemium. Pick one, justify briefly, implement with caching.
- Cache delayed prices (1-min TTL) in Redis. Free sources only at this tier.

### Task 5 — Canonical Trade Store + Journal + Analytics (Effort A `06-architecture/`)
- Create the `trading` schema on the shared daahian PostgreSQL (new tenant,
  RLS-scoped to `tenant='trading'`). Tables per `trade-schema.md`: canonical
  trades (idempotent upsert keyed by broker_trade_id), accounts, watchlist,
  user profiles, subscriptions mirror.
- Build the **CSV/HTML statement parser** connector (MVP import path — works
  without any broker cloud). Normalize every import to the Canonical Trade.
- Build the **analytics engine**: win rate, R-multiple, expectancy, drawdown,
  session/regime breakdowns. Unit-test the math against synthetic trades.
- Wire `/app/journal` (frontend) to these endpoints.

### Task 6 — The Analysis UI (symbol-first, the differentiator)
- Build the `/app/symbols/[symbol]` page: market analysis + sentiment + news
  tabs, each fed by the MAS engine. Render the **live deliberation** via SSE from
  `/api/debate/stream` — show agents rebutting in real time, the C++ profile
  numbers beside it, and the final verdict with conviction + disagreement.
- Build `/app/analyses/[id]` for archived analyses.
- This is the demo-hammer. Make it visually clear and trust-building (show the
  reasoning, show the disagreement).

### Task 7 — Auth, billing, notifications (shared platform)
- Reuse daahian shared infra: `platform.users` (phone) + OTP login. Implement
  **OTP auth** in the Next.js app (the MAFID brief specifies OTP + optional
  Shahkar matching for paid users).
- Wire **Zarinpal** subscriptions (sandbox first): Free / Premium / Premium+.
  Premium+ is licensing-gated and stubbed (no auto-execution).
- Wire notifications: PWA Web Push (VAPID) + Telegram bot + SMS.ir for alerts
  (price/news/session). No Firebase.

### Task 8 — The disclaimer framework + audit log (Effort A `05-legal/`)
- Persistent non-dismissible disclaimer bar on every screen; inline disclaimer
  suffix in every notification.
- Onboarding acknowledgment flow → append-only `platform.audit_log`.
- Terms & Rules page at `/terms`. Multi-step re-consent for Premium+ (stubbed,
  gated).

### Task 9 — Admin/operations panel (Effort C `/admin/`)
- Wire the existing admin routes to real data: users, subscriptions, payments,
  analyses, symbols, requests, verification (Shahkar), audit logs. Read-only +
  moderation actions. Protected by an admin role.

### Task 10 — Outcome feedback loop (the learning moat)
- After each Decision, record the actual price N days later → write
  `(:Outcome)-[:EVALUATES]->(:Decision)` to `neo4j-trade`. Score agents per
  regime. This converts opinions into proof and feeds the eventual self-learning
  calibration (Effort B `self-improvement-loop`).
- Surface a **track-record page** (historical calls, win rates per agent/regime/
  symbol) — the marketing engine.

### Task 11 — Deploy + verify end-to-end
- Backend: deploy `~/ai-memory-system` as a Runflare Docker item on the daahian
  project (Dockerfile exists). Frontend: deploy the Next.js app as a second
  Runflare item. `runflare deploy -y -o plain` from each dir.
- Smoke-test: register → OTP → open a symbol → run analysis (SSE) → import a CSV
  → see journal + analytics → disclaimer present throughout.

---

## 6. Shared Platform (do not rebuild — consume)

From the daahian umbrella (Runflare project `daahian`, IP `185.126.10.222`,
domain `daahian.ir`, shared PostgreSQL `posttgreotg_db` @
`remote-pishgaman.runflare.com:31661`):
- **Identity:** `platform.users` (global phone identity), `platform.otp_codes`,
  `platform.tenants` (add a `trading` tenant).
- **Billing:** Zarinpal (merchant exists, sandbox).
- **Notifications:** PWA push, Telegram bot, SMS.ir (all previously built in the
  TaskFlow ecosystem).
- **General news:** the `news-mas` LangGraph pipeline + `news` schema (Persian
  news cards) — read-only consumption for the delayed-news tier.
- **Design system:** reuse the RTL Persian token set, Persian-numeral formatter,
  and Lucide icon approach from the TaskFlow frontend for visual sibling-ness.
- Full DB design: IWE `documents/projects/taskplanner/daahian-db-design` (the
  multi-tenant RLS + pgcrypto PII pattern you must follow for the `trading`
  schema). Infra config: IWE `documents/deployment/daahian-infra`.

---

## 7. Iran-Specific Build Rules (from `docs/07-constraints.md`)

- Broker clouds (cTrader/MetaApi) may be unreachable → **EA-push is the sovereign
  fallback** (the user's EA on their own terminal pushes data out). For MVP, use
  **CSV/HTML import** so the product works with zero broker connection.
- Free data sources (no key, Iran-tested): exchangerate-api (forex daily),
  CoinGecko (crypto ~1min), gold-api.com (gold ~30s). Live/tick data = paid =
  Premium tier.
- No Firebase. PWA Web Push / Telegram / SMS.ir only.
- Subprocess/external API calls must have timeouts + try/except + fallback chains
  (mirror `market_data.py`'s resilient pattern).

---

## 8. Definition of Done (per task)

A task is done when:
1. Code is written, production-quality, no placeholders.
2. It builds (`npm run build` for frontend; imports resolve + service boots for
   backend) and relevant unit tests pass.
3. The disclaimer/educational framing is intact if the task touches user-facing
   analysis.
4. Secrets stay in `.env.local`/Infisical, never committed.
5. The change is summarized in `docs/HANDOFF.md` with verification evidence.

---

## 9. Tone & Working Style

- Be terse and decisive. State assumptions explicitly before implementing.
- Use `update_plan` for the multi-step build. Mark steps complete only when
  verified.
- When Effort A (design), Effort B (backend), and Effort C (frontend brief)
  conflict, prefer: B's working code > A's design > C's brief — but surface the
  conflict and resolve it explicitly in `HANDOFF.md`.
- After the session, update the IWE KB (`documents/projects/trading-app/*`) and
  the `trading-agents-session-state` doc to reflect what is now built (FACTS vs
  RECOMMENDATIONS).

---

## 10. Reference Materials (read on demand, not all at once)

**Design (Effort A) — in `Trading_Project/docs/`:**
- `01-vision.md`, `02-app-flow.md`, `03-features/pillars.md`,
  `03-features/news-and-signals.md`, `04-mas/overview.md`,
  `04-mas/aggregation.md`, `04-mas/bundle-*.md` (6 files),
  `05-legal/disclaimer-framework.md`, `06-architecture/overview.md`,
  `06-architecture/trade-schema.md`, `07-constraints.md`, `08-roadmap.md`,
  `09-knowledge-graph.md`.

**Product brief (Effort C):** `Trading_Project/MAFID.ir.md` (full).

**Backend (Effort B) — in `~/ai-memory-system/`:**
- `AGENTS.md` (project memory + critical paths), `README.md`.
- `api/main.py`, `api/provider_config.py` (BYOK + tiers).
- `multi_agent/debate_loop.py`, `multi_agent/graph.py`,
  `multi_agent/profile_provider.py`, `multi_agent/market_data.py`,
  `multi_agent/news_data.py`, `multi_agent/sentiment.py`, `multi_agent/writer.py`.
- `trade_graph/schema.cypher` (experience-graph schema).
- `docs/RUNFLARE-DEPLOY.md` (deploy guide).
- `.env.local` (gitignored): `OPENAI_API_KEY`, `NEWSAPI_KEY`, `NEWSDATA_KEY`,
  `TRADINGAGENTS_LLM_BACKEND_URL=https://api.gapgpt.app/v1`.
- C++ engine headers: `Trading_Project/archive/research/Market_Profile/` +
  repo `mhd-vav/trading-mp-engine`.

**IWE knowledge base** (`/mnt/c/Users/TempUser/Projects/knowledge-base`, via `iwe`
MCP or CLI; `cd` there for `iwe` commands):
- `documents/projects/trading-app/*` — the 20-doc design mirror (queryable).
- `documents/multi-agent/ai-memory/trading-agents-session-state` — FACTS vs
  RECOMMENDATIONS status quo (the single most important status doc).
- `documents/multi-agent/ai-memory/debate-agents-design` — the Quant-vs-Auctioneer
  prototype this engine generalizes.
- `documents/multi-agent/ai-memory/hybrid-storage-architecture` — Neo4j + pgvector
  + FTS triple-store design.
- `documents/multi-agent/ai-memory/self-improvement-loop` — the calibration moat.
- `documents/trading/wyckoff-agent-spec` + `documents/trading/market-profile-agent-spec`
  — the technical-analysis agent specs (detection logic, signal schemas).
- `documents/trading/index` + `documents/trading/tier-1` — the full trading-methods
  KB (the analytical knowledge the bundles draw on).
- `documents/trading/market-data-free-sources` + `documents/trading/data-sources` —
  Iran-tested data sources + API survey.
- `documents/projects/taskplanner/daahian-db-design` — the multi-tenant DB pattern
  to follow for the `trading` schema.
- `documents/projects/taskplanner/news-system` + `news-page-design` — the shared
  news service + frontend card pattern.
- `documents/projects/taskplanner/tier-plan` — monetization research (economic
  calendar source, crypto sources, Bazaar-IAP credit compliance).
- `documents/deployment/daahian-infra` — daahian Runflare infra config.

**Global:** `~/AGENTS.md` (TempUser's environment, ecosystem, credentials,
Runflare CLI usage, GapGPT model list).

---

## 11. Start Here

1. `cd /mnt/c/Users/TempUser/Projects/Trading_Project && cat docs/HANDOFF.md`
2. `cd ~/ai-memory-system && cat AGENTS.md` (then boot the API per Task 2).
3. Read `MAFID.ir.md` and `docs/02-app-flow.md`.
4. Open the IWE status doc `trading-agents-session-state` (it tells you exactly
   what is FACT-built vs not-yet-built).
5. Begin Task 1. Use `update_plan`. Build verify-after-each-task.

Good luck. Ship the cockpit.

# PROMPT FOR THE CLI AI

## 0. Role and mission

You are a senior product architect and technical writer. Your job in this session is not to build the trading system. Your job is to (a) cleanly separate all trading-related concerns out of the existing TaskFlow app, and (b) produce complete, high-quality design documentation for a new standalone trading product. You will write specs, schemas, diagrams, and decision records. You will not write the product's feature code. The only code you may write is repository scaffolding (folders, README, doc tooling config, empty package manifests) and documentation.

Work top-down and explain everything as if teaching a bright 15-year-old who has never sen a trading app. Prefer clarity over jargon. When you must use a term, define it the first time.

## 1. Hard constraints (do not violate)

- Do NOT implement trading features, models, connectors, or UI logic. Documentation and repo scaffolding only.
- The new product lives at `C:\Users\TempUser\Projects\Trading_Project`. Create it if missing.
- Initialize a git repository there. Create a docs-first structure. Make an initial commit on a branch named `docs/initial-design` (do not commit to `main`/`master` directly). Do not force-push, reset, or run destructive git commands.
- Miror every design artifact into three places: the Wiki (human-readable pages), Neo4j via IWE MCP (as a linked graph of entities and relationships), and the repo (`/docs` as source of truth in Markdown). The repo Markdown is canonical; Wiki and Neo4j are generated/curated views of it.
- Flag any file that could contain secrets before staging it. Never commit credentials.
- After you finish and commit the documentation, STOP the trading work and return to your primary task: completing TaskFlow. Explicitly announce the switch back.

## 2. What "separate the trading part" means concretely

TaskFlow today contains a Trading Journal feature mixed into a task/notes/projects/news productivity app. You will:

1. Inventory every trading-related module, scren, model, route, table, and aset currently inside TaskFlow. Produce `docs/00-extraction/inventory.md` listing each item, its file path, and its dependencies.
2. Classify each item as one of: `move` (belongs to the new trading product), `shared` (belongs to a shared platform layer used by both aps), or `stays` (genuinely TaskFlow-only).
3. Define a shared platform layer both products consume: authentication, account/profile, billing/subscriptions, notifications, the design system, and the general market-news service. Document it in `docs/00-extraction/shared-platform.md`. Recommend a monorepo layout (two app packages + shared packages) versus two repos, and justify the choice.
4. Produce a migration plan `docs/00-extraction/migration-plan.md`: how trading data and features leave TaskFlow without breaking existing TaskFlow users, including a data-move strategy and a rollback path. This is a plan, not an execution.

Explain to the reader why we separate at all: two different user types (a person organizing their week vs a trader reviewing positions), two different monetization models, two different app-store stories, and very different data shapes. Separating keps each product focused while shared plumbing avoids rebuilding auth and billing twice.

## 3. Product vision for the new app (write this in `docs/01-vision.md`)

The new product is a "trader cockpit" for Forex and Crypto traders, localized for Iran. It is explicitly an educational and record-keeping tool. It helps traders (a) stay aware of the market (hours, news, prices), (b) connect their trading accounts and auto-populate a journal, (c) analyze their own performance, and (d) read transparent, multi-perspective AI analysis that explains reasoning and never sells guaranteed signals.

State the positioning clearly: this is not a signal service. It is an explainable analysis and journaling cockpit. Everything the AI outputs is educational.

## 4. App flow from the moment it opens (write in `docs/02-app-flow.md`)

Describe the experience scren by screen so a newcomer understands the whole journey. Cover at minimum:

1. Splash + first-run: brand, then a one-time onboarding that (a) explains in plain language "this app is for learning and journaling, not financial advice," (b) requires the user to acknowledge the disclaimer, (c) asks market interest (Forex, Crypto, both) and trading style (scalping/intraday, swing, both).
2. Home / cockpit: the default screen after login. Shows market-hours status, a delayed news strip, a watchlist, and (if connected) a journal summary. A persistent, non-intrusive disclaimer bar sits on every screen with a link to the full Terms & Rules page.
3. Auth and account: sign-in, account tier display (Free, Premium, Premium+), and where to manage subscription.
4. Navigation model: bottom tabs or side nav for Home, News, Market Hours, Journal, Analysis (MAS), Alerts, Settings. Explain what each does.
5. Empty states: what a brand-new user with no connected account sees, and how the app guides them to value without requiring a connection first (delayed data and education work with zero setup).

Explain the design philosophy: the app must deliver value on first open with no account connected, because connecting a broker is a hurdle. Awareness and education come free and instantly; deper features unlock progressively.

## 5. Feature pillars, in order, phased (write in `docs/03-features/`)

Document each pillar as its own file. For every feature, explain what it is (tenager-level), why a trader wants it, the free vs premium split, and which phase it ships in. Order them as below.

### Pillar A — Market Awareness
- Market Hours Dashboard: a live view of which trading sessions are open (Asia/Tokyo, London, New York) and their overlaps, in the user's local time. Explain why session timing matters (liquidity and volatility differ by session). Free.
- Economic Calendar: upcoming scheduled events (rate decisions, CPI, employment reports) with expected impact. Delayed/standard free; live/early premium.
- Market News: headlines and summaries. Delayed free; live premium; live-analyzed-signal is a Premium+ add-on (see Pillar F).
- Live Prices / Watchlist: user-chosen instruments. Delayed free; live/streaming premium.

### Pillar B — Account Connection
- cTrader via official Open API with OAuth 2.0: one-click authorize, no password stored. Recommended primary path.
- MT4/MT5 via a cloud bridge (e.g., MetaApi): user provides account number, read-only investor password, and broker server, once. Alternatives: a custom Expert Advisor that pushes data, or manual HTML/CSV statement import.
- Multi-account support.
Document a self-validating connection wizard with live feedback, structured error codes, actionable messages, and a diagnostic correlation ID with redacted reports sent to an automation endpoint (n8n/LangGraph) for triage. Explicitly document that developers do NOT connect on behalf of users (security, liability, OAuth impossibility, scalability). Explain each of these reasons.

### Pillar C — Journal & Analytics
- Auto-populated journal: trades imported from the connected account become journal entries, enriched with user tags, notes, and screenshots.
- Performance analytics: win rate, R-multiple, expectancy, drawdown, session/regime breakdowns. Basic free; advanced premium.

### Pillar D — Alerts & Habits
- Price, news, and session alerts via PWA push (no Firebase), Telegram bot, and in-app.
- Trading-plan reminders and journaling nudges (habit building).

### Pillar E — MAS Analysis (the differentiator)
- The explainable multi-agent deliberation engine (full spec in section 7). Presented as an educational analysis, never a signal.

### Pillar F — Live-Signal Add-on (Premium+, licensing-gated) and Auto-Execution Add-on
- See section 6. These are add-ons, not core features, and are gated behind licensing and heavy disclaimers.

For the free vs premium philosophy, write: the free tier builds habits and awareness (delayed data, market hours, journaling, basic analytics) so the community grows. Premium sells the cost-intensive parts (live data, live news, advanced analytics). Premium+ sells the live-signal add-on. Explain that expensive third-party live data justifies puting it behind a paid tier.

## 6. News system and the Premium+ live-signal + auto-execution add-ons (write in `docs/03-features/news-and-signals.md`)

Explain three levels so a beginner sees the ladder:

1. Free general news (delayed): headlines and summaries on a delay. Educational, always available.
2. Premium live news: same fed, real-time, plus early economic-calendar releases.
3. Premium+ live-signal add-on: a background agent pre-analyzes incoming high-impact news. Instead of just showing a headline, it produces a structured educational assessment, for example: "This report, given current market statistics, has an estimated X% probability of a bullish move of size Y over horizon Z, with confidence C." Delivered as an instant push notification or SMS. Every such message caries the educational disclaimer inline.

Then document the optional auto-execution add-on precisely and cautiously:

- The user may connect the news-signal stream to their own trading account, together with a risk-and-capital-management configuration (max risk per trade, position sizing rule, max concurrent exposure, stop/target policy, session and event blackout windows, kill-switch). When a qualifying signal arrives, the app can open a position in-app according to that config.
- This is an add-on, not a core feature, and is explicitly gated: it only activates where licensing permits, behind an extra subscription, and behind an explicit multi-step user opt-in that restates the risk in the user's own words.
- Write a prominent WARNING in the doc: automated order routing based on news is a regulated activity in most jurisdictions and is materially different from educational journaling. Disclaimers reduce but do not eliminate legal exposure. Recommend that this module remain design-only until a licensing determination is made, and that the risk engine and manual-confirmation mode be built and shipped before any fully-automatic mode.
- Design a "confirm-before-execute" default: even for Premium+ users, the safe default is that a signal opens a pre-filled order ticket the user taps to confirm. Fully automatic execution is an explicit, separately-enabled, licensing-dependent step.

Explain the flow end to end: news source → ingestion → pre-analysis agent → risk filter (against the user's config) → notification (push/SMS) → either manual confirm ticket or (if enabled and permitted) automatic order via the connector → journal entry created automatically.

## 7. The MAS analysis engine: bundles and deliberation (write in `docs/04-mas/`)

State the guiding principle first, plainly: agents can only debate meaningfully when they share premises (same asset, same timeframe, same decision, comparable evidence) but differ in interpretation. This is called commensurability. So we cluster agents into bundles by their shared worldview, build deliberate thesis-vs-antithesis tension inside each bundle plus a critic role, then let an orchestrator weigh bundles against each other. Debate happens inside bundles; arbitration happens across bundles.

Document these six bundles, each in its own file, with: shared frame, member agents (with the built-in opposition), the single question the bundle answers, and why the internal debate is logical.

1. Technical / Price-Action: OHLCV, intraday-to-swing. Trend-continuation vs mean-reversion, plus structure and volatility-regime referees. Question: is the market trending or ranging, and where?
2. Order-Flow / Microstructure: volume, order book, delta, market/volume profile (your Market Profile strength). Participation/confirmation vs absorption/fakeout, plus imbalance and cumulative-delta. Question: is the move backed by real flow or being absorbed?
3. Macro / Fundamental: rates, policy, calendar, intermarket. Monetary-policy vs data-surprise, plus intermarket and risk-sentiment. Question: does the fundamental backdrop support the move or is it priced in?
4. Sentiment / Positioning / Crowd: COT, funding, long/short ratios, social, options skew. Confirmation vs contrarian, plus positioning and derivatives-skew. Question: is sentiment confirming or a contrarian warning?
5. On-Chain (crypto-only, dormant for forex): exchange flows, holder behavior, valuation, network activity. Exchange-flow (sell pressure) vs holder-accumulation. Question: are strong hands accumulating or distributing?
6. Quantitative / Statistical: backtested, probabilistic. Statistical-edge vs overfit-skeptic red-team, plus seasonality,ML-forecast, regime-classifier. Question: is the edge robust or overfit/regime-dependent?

Document Risk/Portfolio NOT as a debating bundle but as a governor at the orchestrator layer that can veto or scale down any verdict. Explain why: it does not argue direction, it constrains action.

Then document the two-tier meta-architecture:
- Tier 1 (intra-bundle): agents debate; each bundle emits a stance, a confidence, a dispersion (how much its members disagree), and a short rationale.
- Tier 2 (orchestrator): weights bundles by market regime (news week → macro up; quiet range → technical/microstructure up), measures cross-bundle divergence, applies the risk governor, and issues the verdict (buy/sell/hold/wait). Strong disagreement lowers conviction and biases toward HOLD, and that disagreement is shown to the user as the reason.

Also connect this design to the product's optional signal analysis for Pillar F: the same deliberation output can feed the pre-analysis for news signals, so the two systems share one reasoning core.

### Aggregation math (document in `docs/04-mas/aggregation.md`, present formulas then explain)

Each agent $i$ emits a stance $s_i \in [-1,+1]$, a confidence $c_i \in [0,1]$, and has a design weight $w_i$.

Bundle stance:
$$S_b = \frac{\sum_{i \in b} w_i c_i s_i}{\sum_{i \in b} w_i c_i}$$

Bundle dispersion:
$$D_b = \sqrt{\frac{\sum_{i \in b} w_i c_i (s_i - S_b)^2}{\sum_{i \in b} w_i c_i}}$

Final orchestrator score under regime $r$:
$$S^* = \sum_b \Omega_b(r)\, S_b, \qquad \sum_b \Omega_b(r) = 1$$

Conviction gate:
$$\text{Conviction} = |S^*|\cdot(1-\bar{D})\cdot(1-\text{CrossDiv})$

Explain each, tenager-level:
- $s_i$ is one analyst's vote on a slider from strong-sell (−1) to strong-buy (+1); $c_i$ is how sure they are; $w_i$ is how much we trust them by design.
- $S_b$ is a weighted average vote inside one bundle: louder and more-trusted agents pull it their way.
- $D_b$ is the spread of opinion inside the bundle: near0 means agreement, large means the bundle is unsure.
- $S^*$ blends bundle stances, where $\Omega_b(r)$ decides whose voice is loudest in the current market state, and the weights add to 1 so it stays a proper blend.
- Conviction shrinks when agents disagree inside bundles ($\bar D$ high) or bundles disagree with each other (CrossDiv high). Low conviction → prefer HOLD/WAIT. This is the math version of "when smart people strongly disagree, don't bet big."

## 8. Legal and disclaimer framework (write in `docs/05-legal/`)

Document a persistent, non-dismissible disclaimer bar on every screen and inside every notification/SMS, linking to a full Terms & Rules page. Wording must repeatedly state: this app is educational and for record-keeping; any analysis, even when phrased as a recommendation such as "selling looks like the better policy now," is strictly educational; every action taken on the basis of any analysis is solely the user's responsibility. Document where the disclaimer appears, the acknowledgment flow at onboarding, re-consent for the signal and auto-execution add-ons, and an audit log of user acknowledgments. Add the licensing-gate note for Pillar F.

## 9. Architecture (write in `docs/06-architecture/`)

Document the four layers plus the shared platform:
1. Presentation: platform-agnostic UI (web/PWA + mobile), design system shared with TaskFlow.
2. Domain/Service: canonical Trade Store (normalized schema), analytics engine, news/market-hours services, MAS engine, risk engine.
3. Ingestion & Data: sync (backfill + incremental), idempotent upserts keyed by broker trade ID, storage.
4. Connector: cTrader OAuth adapter, MetaApi adapter, EA-push adapter, report/CSV parser.
Shared platform: auth, accounts, billing, notifications, general news, design system.

Document the Canonical Trade Schema (instrument, side, size, entry/exit price & time, SL/TP, fees, broker trade ID, plus user fields: tags, notes, screenshots, strategy) and the metrics derived from it (win rate, R-multiple, expectancy, drawdown). Include diagrams (as Mermaid in Markdown) for each layer and the data flow.

## 10. Iran-specific constraints (write in `docs/07-constraints.md`)

Document: reachability of third-party cloud endpoints (cTrader/MetaApi/data vendors) from Iran, local payment integration for subscriptions, no Firebase (use PWA push / Telegram / self-hosted push), data-vendor cost and licensing, latency for live data, and language/trust (Persian-first UI, transparent reasoning to earn trust in a market burned by signal sellers). Explain why the EA-push connector is a more sovereign fallback when cloud bridges are unreachable.

## 11. Phasing (write in `docs/08-roadmap.md`)

- MVP: core cockpit, delayed data, market hours, cTrader OAuth + CSV/HTML import, auto-journal, basic analytics, one MAS bundle (Technical) end-to-end as prof, disclaimer framework.
- Phase 2: premium live data/news, MT4/MT5 via MetaApi, advanced analytics, more MAS bundles, alerts.
- Phase 3: EA-push connector, Premium+ live-signal add-on (manual-confirm mode first), community/learning, and only then, if licensing permits, the auto-execution mode.
Explain the scalability logic: ship value with zero broker connection first, add connectors and paid data next, add the regulated add-ons last.

## 12. Documentation targets (IWE MCP, Neo4j, Wiki)

For every doc above:
- Kep the Markdown in `/docs` as canonical.
- Create matching Wiki pages (human-readable, with the diagrams).
- Via IWE MCP, write a Neo4j graph where nodes are entities (Product, Pillar, Feature, Agent, Bundle, Layer, Connector, Metric, Constraint, Phase, Disclaimer) and edges are relationships (BELONGS_TO, DEPENDS_ON, DEBATES_WITH, AGGREGATED_BY, GATED_BY, SHIPS_IN, SHARED_WITH). This lets us query the design, e.g., "which features depend on live data" or "which agents belong to the Macro bundle."
Document the graph schema itself in `docs/09-knowledge-graph.md`.

## 13. Definition of done for this session

- Repo created at the target path, `docs/` populated per sections 2–12, initial commit on `docs/initial-design`.
- Wiki pages and Neo4j graph mirror the docs.
- No feature code written.
- A `docs/README.md` index linking every document.
- A short handoff note summarizing what exists and what is intentionally left as design-only (especially Pillar F).

## 14. Return to primary task

After committing, explicitly announce: "Trading product design is documented and committed. Switching back to TaskFlow." Then resume completing TaskFlow with the user.

# END OF PROMPT

---

## Recap

You now have a single, copy-paste prompt that redirects your CLI agent from building to designing. It forces a clean extraction of trading concerns from TaskFlow into a new documented product, sets up the repo and mirrors everything into IWE MCP, Neo4j, and the Wiki, and then sends the agent back to finish TaskFlow. The prompt walks from app-open flow through phased feature pillars, market hours, the free/live newsladder, the Premium+ signal and auto-execution add-ons, the six analysis bundles, the deliberation-to-verdict architecture with aggregation math, the always-on disclaimer framework, the layered architecture, and Iran-specific constraints. It keeps explanations beginner-level throughout and enforces documentation-only output. The one substantive risk I flagged: automated news-triggered execution is regulated and should stay design-only, manual-confirm-first, until licensing is settled.

## Key Takeaways

- The agent's job this session is documentation and repo scaffolding only; no feature code, with an explicit switch back to TaskFlow at the end.
- Separation is done via a shared platform layer (auth, billing, news, design system) so nothing is rebuilt twice.
- The MAS stays an explainable engine, and the same reasoning core can power the newsre-analysis add-on.
- Auto-execution is a regulated activity: gate it, default to confirm-before-execute, and keep it design-only until licensing is clear.

You'll be given the Multi agent system details later. now just separate the structures
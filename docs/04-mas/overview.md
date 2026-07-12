---
title: MAS Analysis Engine — Overview
type: architecture
status: proposed
date: 2026-07-12
---

# The MAS Analysis Engine — Bundles and Deliberation

## Guiding principle (plain language)

AI agents can only **debate meaningfully** when they share the same premises (same asset,
same timeframe, same decision, comparable evidence) but **differ in interpretation**. This
property is called **commensurability**. If two agents use totally different data and
frame the question differently, their disagreement is noise, not a debate.

So the design is:

1. **Cluster agents into bundles** by their shared worldview (e.g., all the
   price-action agents look at the same OHLCV and ask the same question).
2. **Build deliberate thesis-vs-antithesis tension inside each bundle**, plus a critic
   role. Agents inside a bundle argue with each other.
3. **Let an orchestrator weigh bundles against each other.** Debate happens *inside*
   bundles; arbitration happens *across* bundles.

This produces verdicts that are explainable: you can always point to *which bundle said
what, and how much they disagreed*.

## The six bundles

Each bundle has its own document:

1. [Technical / Price-Action](bundle-technical.md)
2. [Order-Flow / Microstructure](bundle-orderflow.md)
3. [Macro / Fundamental](bundle-macro.md)
4. [Sentiment / Positioning / Crowd](bundle-sentiment.md)
5. [On-Chain](bundle-onchain.md) — crypto-only; dormant for Forex.
6. [Quantitative / Statistical](bundle-quant.md)

Each bundle file documents: the shared frame, the member agents (with the built-in
opposition), the single question the bundle answers, and why the internal debate is logical.

## Risk/Portfolio is NOT a debating bundle

Risk/Portfolio is a **governor** at the orchestrator layer that can **veto or scale down**
any verdict. It does **not** argue direction — it constrains action. (Why: a risk limit is
not an opinion about where price goes; it is a constraint on how much you can lose. Letting
it "debate" direction would muddle the analytical signal with a position-sizing rule.)

## Two-tier meta-architecture

### Tier 1 — intra-bundle (debate)

Agents debate inside their bundle. Each bundle emits:

- a **stance** (direction + strength),
- a **confidence** (how sure the bundle is),
- a **dispersion** (how much its own members disagree), and
- a **short rationale**.

### Tier 2 — orchestrator (arbitration)

The orchestrator:

- **weights bundles by market regime** — a news-heavy week pushes the Macro bundle's
  weight up; a quiet range pushes Technical/Microstructure up;
- **measures cross-bundle divergence**;
- **applies the risk governor** (which can veto or scale down); and
- **issues the verdict**: buy / sell / hold / wait.

**Strong disagreement lowers conviction and biases toward HOLD**, and that disagreement is
*shown to the user as the reason*. This is the math version of "when smart people strongly
disagree, don't bet big." The formulas are in [aggregation.md](aggregation.md).

## Connection to the news-signal add-on (Pillar F)

The **same deliberation output** that produces an educational verdict can feed the
pre-analysis for news signals ([../03-features/news-and-signals.md](../03-features/news-and-signals.md)).
The two systems share one reasoning core — the MAS engine.

## Relationship to existing research

The trading-methods knowledge base (IWE `documents/trading/*`) and the adversarial
debate-agents prototype (IWE `documents/multi-agent/ai-memory/debate-agents-design`,
repo `ai-memory-system`) are **reference inputs** to this design. The prototype proved the
"same evidence, different interpretation, debate, arbiter picks winner" pattern with a C++
Market Profile engine as ground truth. This product generalizes that pattern into six
commensurable bundles.

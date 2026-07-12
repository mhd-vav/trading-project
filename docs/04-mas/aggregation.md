---
title: MAS Aggregation Math
type: spec
status: proposed
date: 2026-07-12
---

# Aggregation Math

Formulas first, then a teenager-level explanation.

## Notation

Each agent $i$ emits:

- a stance $s_i \in [-1,+1]$ (strong-sell −1 → strong-buy +1),
- a confidence $c_i \in [0,1]$ (how sure it is),
- a design weight $w_i$ (how much we trust it by design).

## Bundle stance

$$S_b = \frac{\sum_{i \in b} w_i c_i s_i}{\sum_{i \in b} w_i c_i}$$

## Bundle dispersion (how much the bundle's own members disagree)

$$D_b = \sqrt{\frac{\sum_{i \in b} w_i c_i (s_i - S_b)^2}{\sum_{i \in b} w_i c_i}}$$

## Final orchestrator score under regime $r$

$$S^* = \sum_b \Omega_b(r)\, S_b, \qquad \sum_b \Omega_b(r) = 1$$

## Conviction gate

$$\text{Conviction} = |S^*|\cdot(1-\bar{D})\cdot(1-\text{CrossDiv})$$

where $\bar{D}$ is the weighted average intra-bundle dispersion and CrossDiv is the
cross-bundle divergence measure.

## Teenager-level explanation

- **$s_i$** is one analyst's vote on a slider from strong-sell (−1) to strong-buy (+1).
- **$c_i$** is how sure that analyst is.
- **$w_i$** is how much we trust them by design (their track record / role).
- **$S_b$** is the weighted average vote *inside one bundle*: louder and more-trusted
  agents pull it their way.
- **$D_b$** is the spread of opinion inside the bundle: near 0 means the bundle agrees; a
  large value means the bundle is internally unsure.
- **$S^*$** blends the bundle stances, where **$\Omega_b(r)$** decides whose voice is
  loudest in the current market state (regime $r$). The weights add to 1, so it stays a
  proper blend.
- **Conviction** shrinks when agents disagree *inside* bundles ($\bar{D}$ high) or when
  bundles disagree *with each other* (CrossDiv high). **Low conviction → prefer HOLD/WAIT.**

This is the math version of: *"when smart people strongly disagree, don't bet big."*

## Verdict mapping (illustrative)

| Condition | Verdict |
|-----------|---------|
| $S^*$ strongly positive, Conviction high | BUY (educational) |
| $S^*$ strongly negative, Conviction high | SELL (educational) |
| $\|S^*\|$ small | HOLD |
| Conviction low (high disagreement) | WAIT (and show the disagreement as the reason) |

The risk governor can veto or scale down any of these regardless of the math.

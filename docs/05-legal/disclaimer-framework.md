---
title: Legal & Disclaimer Framework
type: legal
status: proposed
date: 2026-07-12
---

# Legal & Disclaimer Framework

## Core idea

A disclaimer must be **always visible** and **never dismissible permanently**. The user
should never be able to forget, even for one screen, that this app is educational.

## The persistent disclaimer bar

- A **non-intrusive strip at the bottom of every screen** in the app.
- Persian-first wording, e.g.:

  > «تحلیل‌های این برنامه آموزشی است. مسئولیت هر تصمیم معاملاتی صرفاً با شماست.»
  > *(The analysis in this app is educational. Responsibility for any trading decision is
  > yours alone.)*

- It links to the full **Terms & Rules** page.
- It cannot be hidden by the user. It is part of the layout, not a dismissible banner.

## Inside every notification / SMS

Every push notification, Telegram message, and SMS the app sends — including any
Premium+ signal — **carries the educational disclaimer inline**, e.g. a short suffix:

> «...آموزشی، نه توصیه.» *(...educational, not a recommendation.)*

## The full Terms & Rules page

States, repeatedly and clearly:

1. This app is **educational and for record-keeping**.
2. **Any analysis, even when phrased as a recommendation** (e.g., "selling looks like the
   better policy now"), is **strictly educational**.
3. **Every action taken on the basis of any analysis is solely the user's responsibility.**

## Acknowledgment flow (onboarding)

At first run, the user cannot proceed without:

- Reading the plain-language framing.
- Tapping **"متوجه شدم / I understand."**
- The acknowledgment is **logged** (timestamp, user id, device, disclaimer version) to an
  **append-only audit log** (`platform.audit_log` on the shared daahian DB).

## Re-consent for the add-ons (Pillar F)

The signal add-on and the auto-execution add-on require **separate, explicit
re-consent**, *not* covered by the general onboarding acknowledgment:

- A **multi-step opt-in** that **restates the risk in the user's own words** (the user
  must type/confirm a phrase acknowledging the risk).
- Each step is logged to the audit log.
- The auto-execution add-on's re-consent is **gating**: it cannot be enabled without
  licensing permitting it *and* the multi-step opt-in completing.

## Audit log of acknowledgments

- Append-only (`REVOKE UPDATE, DELETE` at the DB level — the daahian DB already enforces
  this pattern).
- Records: actor, timestamp, IP, device, disclaimer version, action, before/after state.
- Supports compliance review: "did this user acknowledge the disclaimer on date X?" is a
  queryable fact.

## Pillar F licensing-gate note

Because Pillar F (auto-execution) is a regulated activity:

- The disclaimer framework **does not** make Pillar F legal by itself. Disclaimers reduce
  but do not eliminate legal exposure.
- Pillar F is **design-only until a licensing determination is made**.
- Even when built, **confirm-before-execute is the default**; fully automatic execution is
  a separately-enabled, licensing-dependent step
  ([../03-features/news-and-signals.md](../03-features/news-and-signals.md)).

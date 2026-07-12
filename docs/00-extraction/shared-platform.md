---
title: Shared Platform Layer — Consumed by Both Apps
type: architecture
status: proposed
date: 2026-07-12
---

# Shared Platform Layer

Both TaskFlow and the new Trading App sit on top of a **shared platform layer**: the
plumbing neither product wants to build twice. This document defines that boundary and
recommends a repository layout.

## Why separate at all?

Imagine two different customers. One is a student organizing homework, routines, and
family tasks for the week. The other is a Forex trader reviewing last night's positions,
reading economic news, and checking whether the London session is open. These are:

- **Two different user types** with two different mental models. Mixing them in one app
  dilutes both experiences.
- **Two different monetization models.** TaskFlow sells productivity premium (yearly).
  The trading app sells live-data tiers and (later) a signal add-on. Bundling them
  confuses pricing.
- **Two different app-store stories.** A store listing that says "task manager + trading
  journal" sells neither well. Focused listings convert better.
- **Two very different data shapes.** Tasks are to-do items with dates. Trades are
  normalized financial records with prices, sizes, fees, and broker IDs. Forcing one
  schema to serve both creates leaks.

Separating lets each product stay focused, while the shared platform layer prevents us
from rebuilding authentication, billing, notifications, news, and the design system twice.

## The shared platform boundary

| Capability | What it provides | Owner today | Notes |
|------------|------------------|-------------|-------|
| **Authentication / Identity** | Phone + OTP login, global user identity, session tokens, cross-app SSO | `platform.users`, `platform.otp_codes` (TaskFlow/daahian) | One phone = one global identity. A user logs in once and is known to both apps. New trading-specific profile fields live in the trading tenant. |
| **Accounts / Profile** | Display name, avatar, email, per-app preferences, role | `taskplanner.user_profiles` pattern, replicated as `trading.user_profiles` | Profile is per-tenant (per-app) but identity is global. |
| **Billing / Subscriptions** | Zarinpal payment, plan tiers, device-bound premium, invoices | `taskplanner.premium_subscriptions` + `backend/api/server.js` | Reused for the trading app's Free/Premium/Premium+ tiers. A `trading.subscriptions` table mirrors the pattern. |
| **Notifications** | PWA push (no Firebase), Telegram bot delivery, SMS via SMS.ir | TaskFlow Phase 6/10 + Telegram bot | Generic delivery bus. The trading app subscribes to it for price/news/session alerts. |
| **General News Service** | Persian news cards (fetch → translate → image → publish) | `news-mas/` pipeline + `news` schema | This is **general** market/world news. Consumed by TaskFlow's News section and the trading app's delayed-news tier. Trading-specific *live* news is a new paid concern in the trading app. |
| **Design System** | RTL Persian UI kit, theme tokens (spacing, color, radius), `IconView`/`UiIcon` Lucide icon set, Persian-numeral formatter, themed backgrounds | TaskFlow `src/components/IconView.vue`, theme CSS | The trading app reuses the same tokens and icon set so both apps feel like siblings. |
| **Infrastructure** | Shared daahian PostgreSQL (multi-tenant, RLS), Redis, Arvan S3, GapGPT gateway, Infisical secrets | daahian Runflare project | The trading app becomes a new tenant (`trading`) on the same instance, isolated by RLS. |

## Repository layout recommendation: monorepo (two app packages + shared packages)

**Recommended: a single monorepo** with this shape:

```
daahian-monorepo/
├── apps/
│   ├── taskflow/          # the existing Vue 3 PWA/Android app
│   └── trading/           # the new trading cockpit (PWA + mobile)
├── packages/
│   ├── platform-auth/     # phone+OTP identity, session, SSO
│   ├── platform-billing/  # Zarinpal + plan/tier logic
│   ├── platform-news/     # the news-mas pipeline + news schema client
│   ├── platform-notify/   # PWA push + Telegram + SMS delivery bus
│   └── design-system/     # RTL tokens, IconView/UiIcon, Persian numerals
└── infra/                 # daahian PostgreSQL schemas, Redis, S3, Runflare items
```

### Why monorepo over two repos

- **Shared code stays shared in practice.** In two separate repos, the "shared" layer
  drifts: one app updates auth, the other lags, and you end up with two divergent auth
  systems — exactly what separation was meant to avoid. A monorepo with `packages/` makes
  shared code a real import, so both apps upgrade together.
- **Atomic cross-app changes.** When the identity schema changes, you update the package
  and both apps in one PR/commit. Two repos require coordinated releases.
- **Single source of truth for infra.** The daahian PostgreSQL schemas, RLS policies, and
  Runflare deployment configs live in one `infra/` tree.
- **Small team.** TempUser is solo. The coordination cost of two repos (two CI setups,
  two secret stores, two dependency trees) outweighs any isolation benefit right now.

### When you would choose two repos instead

If the two products ever have **different teams, different release cadences that must not
block each other, or different licensing** (e.g., the trading app picks up a regulated
auto-execution module with compliance audit requirements), splitting into two repos with
the shared layer published as versioned packages becomes justified. That is a Phase 3+
decision, not a day-one one. The monorepo can be split later if needed; the `packages/`
boundary makes that split mechanical.

### Note on the current reality

Today TaskFlow lives at `~/taskplanner/` as a standalone Vue app, and this Trading Project
lives at `C:\Users\TempUser\Projects\Trading_Project`. The monorepo above is the **target**
state. The migration plan ([migration-plan.md](migration-plan.md)) describes how to get
there incrementally without breaking the live TaskFlow build. The first concrete step is
simply removing the placeholder trading tile from TaskFlow and standing up the trading app
as a sibling; extracting `packages/` can follow once both apps exist.

## Relationship to the existing daahian multi-tenant DB

The shared platform is not theoretical — it is already mostly built. The daahian
PostgreSQL design (`platform` + per-tenant schemas with RLS, pgcrypto PII encryption,
append-only audit log) is documented in the IWE knowledge base
(`documents/projects/taskplanner/daahian-db-design`). Adding the trading app means:

1. A new tenant row `trading` in `platform.tenants`.
2. A new schema `trading` with its own tables (`trading.user_profiles`,
   `trading.subscriptions`, plus all the new trade-store and analytics tables).
3. RLS policies on every `trading.*` table scoped to `tenant = 'trading'`.
4. Reuse of `platform.users` / `platform.otp_codes` / `platform.audit_log` as-is.

Nothing in the shared/platform layer is rebuilt. The trading app is a new tenant on
existing infrastructure.

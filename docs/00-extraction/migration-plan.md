---
title: Migration Plan — Separating Trading Out of TaskFlow
type: migration-plan
status: proposed
date: 2026-07-12
---

# Migration Plan

How trading concerns leave TaskFlow and land in the new product **without breaking
existing TaskFlow users**. This is a plan, not an execution: no data is moved in this
session.

## Guiding principles

1. **No TaskFlow user loses data or access.** TaskFlow users never had a real trading
   journal (only a "coming soon" tile), so there is no user-facing feature regression.
2. **Remove the placeholder before adding anything new.** The single trading tile in
   TaskFlow is removed first; the new product is built separately.
3. **Shared infrastructure is reused, not forked.** Auth, billing, news, notifications
   stay where they are and gain a new consumer.
4. **Rollback is always possible.** Every step is independently revertible.

## Current state (facts)

- TaskFlow is deployed (frontend + billing API on Runflare `taskplanner-docker`).
- The only trading UI is a placeholder tile in `src/components/PremiumHub.vue` that shows
  a "بزودی" toast. See [inventory.md](inventory.md).
- No trade data, no trade tables, no broker connections exist anywhere.
- The trading intelligence (debate agents) lives in a separate repo (`ai-memory-system`),
  not in TaskFlow.

Because there is no trading data or trading feature in production, the "data-move" is
trivial. The real work is **standing up the new product** and **cleaning the placeholder**.

## Step-by-step migration

### Step 0 — Documentation (this session) ✅

- Design docs committed on branch `docs/initial-design`.
- No code, no data touched.

### Step 1 — Remove the trading placeholder from TaskFlow (safe, immediate)

**Change:** delete the `'trader'` entry from the `sections` array, remove `'trader'` from
the `SectionKey` union, remove the `.tile-trader` CSS rule, in
`src/components/PremiumHub.vue`.

**Impact on TaskFlow users:** none meaningful. The tile only ever showed "بزودی". The
Premium Hub still has News, Notes, AI, Teams. Four tiles instead of five.

**Verify:**
- `npx vue-tsc --noEmit` passes (no dangling type references).
- `npx vite build` is green.
- Manual: open Premium Hub → no Trader tile → other tiles still route.

**Rollback:** `git revert` the single commit. The change is 4 lines.

### Step 2 — Stand up the Trading App as a sibling

**Change:** the new trading app is built at `C:\Users\TempUser\Projects\Trading_Project`
(as a Next.js/PWA, per the existing scaffold) consuming the shared platform layer. It gets
its own Runflare item in the daahian project and its own `trading` tenant/schema.

**Impact on TaskFlow users:** none. Separate app, separate deployment, separate URL.

**Verify:** trading app boots, can authenticate against `platform.users`/OTP, can read
general news from the shared `news` schema.

**Rollback:** undeploy the trading Runflare item. TaskFlow is untouched.

### Step 3 — Extract shared code into `packages/` (incremental, deferred)

**Change:** as both apps mature, lift auth/billing/news/notify/design-system into
`packages/` (the monorepo target in [shared-platform.md](shared-platform.md)). Each
extraction is one PR that updates both apps to import from the package.

**Impact on TaskFlow users:** none if done behind the same import surface.

**Verify:** TaskFlow build green before/after each extraction; trading app build green.

**Rollback:** revert the PR; apps return to inline copies.

## Data-move strategy

Because TaskFlow has **no trade data**, there is nothing to migrate. The strategy for the
*new* product's data is:

- New `trading` schema on the shared daahian PostgreSQL, RLS-scoped to `tenant='trading'`.
- Trade Store (see [../06-architecture/trade-schema.md](../06-architecture/trade-schema.md))
  populated exclusively by the new app's ingestion layer (broker connectors / imports).
- **Idempotent upserts** keyed by broker trade ID, so re-imports never duplicate.
- General news consumed read-only from the existing `news` schema — no copy, no move.

If, in the future, TaskFlow ever stored any user notes a user wants to carry into a trading
journal, the move is a one-time `INSERT ... SELECT` from `taskplanner.*` into `trading.*`
filtered by user consent — but this is not needed today.

## Rollback path (summary)

| Step | Rollback action | Blast radius |
|------|-----------------|--------------|
| 1 (remove tile) | `git revert` + redeploy TaskFlow | TaskFlow regains a dead tile |
| 2 (stand up trading app) | Undeploy trading Runflare item | TaskFlow unaffected |
| 3 (extract packages) | Revert extraction PR | Both apps use inline code again |

## What this migration does NOT do

- It does not move or delete any TaskFlow user data.
- It does not change TaskFlow's deployment, DB, or billing.
- It does not implement any trading feature (documentation + scaffolding only this session).
- It does not commit secrets; see the secrets-flagging note in the handoff
  ([../HANDOFF.md](../HANDOFF.md)).

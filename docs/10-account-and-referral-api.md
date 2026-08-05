---
title: Account Center and Referral Programme
status: implementation-contract
date: 2026-08-05
---

# Account Center and Referral Programme

## Purpose

The account center owns the user's profile, verification state, preferences, active sessions,
and referral progress. It must never expose bank-card numbers, national-ID values, broker
credentials, or other sensitive values to the browser.

## Referral rule

The programme grants **30 calendar days of Chart section access for every three qualified
referred paid subscriptions**.

A subscription qualifies only when all conditions are met:

1. The invited customer is a distinct new account created from the referral link or code.
2. The customer completes a paid subscription; free trials and promotional zero-value plans do
   not qualify.
3. The payment clears and remains outside the configured refund or chargeback review period.
4. Fraud, self-referral, duplicate-payment, and abuse checks pass.

The three qualifying subscriptions do not need to happen in the same calendar month. Each
completed group of three creates one pending reward. The reward is applied as a 30-day Chart
section entitlement extension after the user's active paid access ends. It does not create a
cash balance, cannot be transferred, and is not redeemed automatically when the account is
under a fraud or payment review.

## User API contract

All browser calls use the Next.js BFF at `/api/account/*`. The BFF forwards only allow-listed
routes to `ACCOUNT_API_URL` at `/v1/account/*`.

| Browser route | Upstream route | Method | Purpose |
|---|---|---:|---|
| `/api/account/profile` | `/v1/account/profile` | `GET` | Profile, verification, preferences, sessions |
| `/api/account/profile` | `/v1/account/profile` | `PATCH` | Update display name and preferences |
| `/api/account/sessions/revoke` | `/v1/account/sessions/revoke` | `POST` | Revoke all sessions other than current |
| `/api/account/referrals` | `/v1/account/referrals` | `GET` | Referral link, progress, reward totals, invite history |
| `/api/account/referrals/code` | `/v1/account/referrals/code` | `POST` | Create a referral code if none exists |

Every successful response uses:

```json
{
  "configured": true,
  "data": {}
}
```

When `ACCOUNT_API_URL` is absent during local UI work, the BFF returns a normal `200` response
with `configured: false`. The interface then shows its integration state without inventing user
data or logging a browser console error.

## Backend responsibilities

- Authenticate the caller and derive the account ID server-side.
- Mask phone, email, and verification details appropriately for browser use.
- Perform referral attribution only once, at account creation.
- Run qualification asynchronously from cleared payment events.
- Record an immutable audit event for qualification, rejection, reward issuance, and reward use.
- Enforce idempotency on payment-event processing and reward issuance.

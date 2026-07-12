---
title: Architecture — Four Layers + Shared Platform
type: architecture
status: proposed
date: 2026-07-12
---

# Architecture — Four Layers + Shared Platform

## The four product layers

1. **Presentation** — platform-agnostic UI (web/PWA + mobile). Reuses the **design system
   shared with TaskFlow** (RTL Persian tokens, `IconView`/`UiIcon` Lucide icon set, Persian
   numerals, themed backgrounds).
2. **Domain / Service** — the canonical **Trade Store** (normalized schema), the
   **analytics engine**, **news / market-hours services**, the **MAS engine**, and the
   **risk engine** (governor).
3. **Ingestion & Data** — sync (backfill + incremental), **idempotent upserts** keyed by
   broker trade ID, and storage (shared daahian PostgreSQL, `trading` schema).
4. **Connector** — the cTrader OAuth adapter, the MetaApi adapter, the EA-push adapter,
   and the report/CSV parser.

## Shared platform (consumed, not owned)

Auth, accounts, billing, notifications, general news, and the design system — all provided
by the [shared platform layer](../00-extraction/shared-platform.md).

## Layer diagram (Mermaid)

```mermaid
flowchart TB
    subgraph Presentation[Presentation Layer]
        UI[Web/PWA + Mobile UI]
        DS[Design System — shared with TaskFlow]
    end
    subgraph Domain[Domain / Service Layer]
        TS[Trade Store — canonical schema]
        AE[Analytics Engine]
        NS[News & Market-Hours Services]
        MAS[MAS Engine — deliberation]
        RE[Risk Engine — governor]
    end
    subgraph Ingestion[Ingestion & Data Layer]
        SYN[Sync — backfill + incremental]
        UPS[Idempotent Upserts — by broker trade ID]
        DB[(trading schema on daahian PG)]
    end
    subgraph Connector[Connector Layer]
        CT[cTrader OAuth]
        MA[MetaApi — MT4/MT5]
        EA[EA-push]
        CSV[CSV/HTML parser]
    end
    subgraph Shared[Shared Platform]
        AUTH[Auth / Identity]
        BILL[Billing]
        NOT[Notifications]
        GNEWS[General News Service]
    end
    CT --> SYN
    MA --> SYN
    EA --> SYN
    CSV --> SYN
    SYN --> UPS --> DB
    DB --> TS --> AE
    NS --> MAS
    MAS --> RE
    RE --> UI
    AE --> UI
    DS --> UI
    AUTH --> UI
    BILL --> UI
    NOT --> UI
    GNEWS --> NS
```

## Data flow (Mermaid)

```mermaid
flowchart LR
    A[Broker / Import] --> B[Connector]
    B --> C[Normalize to Canonical Trade]
    C --> D[Idempotent Upsert keyed by broker trade ID]
    D --> E[(Trade Store)]
    E --> F[Analytics Engine → metrics]
    E2[Market data + news] --> G[MAS Engine: bundles debate → orchestrator → risk governor]
    G --> H[Educational Verdict]
    F --> I[Journal & Analytics UI]
    H --> I
```

## Canonical Trade Schema and metrics

See [trade-schema.md](trade-schema.md) for the normalized trade record and the metrics
derived from it (win rate, R-multiple, expectancy, drawdown).

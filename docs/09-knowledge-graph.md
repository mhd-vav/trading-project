---
title: Knowledge Graph Schema (Neo4j via IWE)
type: graph-schema
status: proposed
date: 2026-07-12
---

# Knowledge Graph Schema

The design is mirrored into the IWE knowledge graph (Neo4j) so the design itself is
queryable: "which features depend on live data?", "which agents belong to the Macro
bundle?", "which features are gated by licensing?".

## Node labels (entity types)

| Label | Example | Description |
|-------|---------|-------------|
| `Product` | Trading Cockpit | The product itself. |
| `Pillar` | A (Market Awareness) | The six feature pillars. |
| `Feature` | Market Hours Dashboard | A concrete feature. |
| `Agent` | Trend-continuation agent | A MAS debating agent. |
| `Bundle` | Technical / Price-Action | A MAS analysis bundle. |
| `Layer` | Connector layer | An architecture layer. |
| `Connector` | cTrader OAuth | A broker/data connector. |
| `Metric` | Win rate | A derived analytics metric. |
| `Constraint` | Iran endpoint reachability | A design constraint. |
| `Phase` | MVP | A roadmap phase. |
| `Disclaimer` | Persistent disclaimer bar | A legal element. |

## Edge types (relationships)

| Edge | Meaning | Example |
|------|---------|---------|
| `BELONGS_TO` | Membership | (Feature)-[:BELONGS_TO]->(Pillar) |
| `DEPENDS_ON` | Dependency | (Feature)-[:DEPENDS_ON]->(Metric "live data") |
| `DEBATES_WITH` | Intra-bundle opposition | (Agent)-[:DEBATES_WITH]->(Agent) |
| `AGGREGATED_BY` | Membership in aggregation | (Agent)-[:AGGREGATED_BY]->(Bundle) |
| `GATED_BY` | Licensing/consent gate | (Feature)-[:GATED_BY]->(Disclaimer) |
| `SHIPS_IN` | Roadmap phasing | (Feature)-[:SHIPS_IN]->(Phase) |
| `SHARED_WITH` | Shared platform | (Feature)-[:SHARED_WITH]->(Product "TaskFlow") |

## Example queries (what the graph enables)

- `MATCH (f:Feature)-[:DEPENDS_ON]->(:Metric {name:'live data'}) RETURN f`
  → "which features depend on live data?"
- `MATCH (a:Agent)-[:AGGREGATED_BY]->(b:Bundle {name:'Macro'}) RETURN a`
  → "which agents belong to the Macro bundle?"
- `MATCH (f:Feature)-[:GATED_BY]->() RETURN f`
  → "which features are gated by licensing/consent?"
- `MATCH (f:Feature)-[:SHIPS_IN]->(p:Phase {name:'MVP'}) RETURN f`
  → "what ships in the MVP?"

## Mirror approach

- The **repo Markdown in `/docs` is canonical.**
- The IWE knowledge graph is a **curated view**: nodes and edges derived from these docs,
  written via the IWE MCP so the design is queryable alongside the existing
  `documents/trading/*` and `documents/projects/*` knowledge.
- When docs change, the corresponding graph nodes/edges are updated to match.

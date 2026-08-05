// src/lib/market/contracts.ts
// src/lib/market/contracts.ts
export type MarketSymbol = "BTCUSD" | "ETHUSD" | "EURUSD" | "XAUUSD" | "USDIRR" | "TEDPIX";

export type MarketCategory = "crypto" | "forex" | "metals" | "currency" | "iran_bourse";

export type ChartKind = "candlestick" | "line";

export type MarketChartMode =
  | "candlestick"
  | "heikin_ashi"
  | "renko"
  | "range"
  | "tpo"
  | "point_figure"
  | "line";

export type CandlestickPoint = {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export type LinePoint = {
  timestamp: string;
  value: number;
};

export type MarketChartResponse = {
  symbol: MarketSymbol;
  label: string;
  market: MarketCategory;
  kind: ChartKind;
  interval: string;
  source: string;
  delayed: boolean;
  configured: boolean;
  points: CandlestickPoint[] | LinePoint[];
  message?: string;
};

export type MarketNewsArticle = {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: "bullish" | "bearish" | "neutral" | "unknown";
  tickerSentiment?: number;
};

export type MarketNewsResponse = {
  symbol: string;
  configured: boolean;
  articles: MarketNewsArticle[];
};

export type DeskBundle = {
  stance: number;
  confidence: number;
  dispersion: number;
  rationale: string;
};

export type DeskAnalysisResponse = {
  asset: string;
  asset_class: "forex" | "crypto";
  timeframe: string;
  regime: string;
  regime_rationale: string;
  bundles: Record<string, DeskBundle>;
  final_decision: "buy" | "sell" | "hold" | "wait";
  final_conviction: number;
  final_rationale: string;
  disclaimer: string;
  pipeline_latency_ms: number;
  report_meta?: {
    length?: "brief" | "standard" | "deep";
    model_tier?: "starter" | "professional" | "institutional";
    generated_at?: string;
  };
};

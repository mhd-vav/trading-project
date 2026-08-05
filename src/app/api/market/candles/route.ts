// src/app/api/market/candles/route.ts
import { NextRequest, NextResponse } from "next/server";
import type {
  CandlestickPoint,
  LinePoint,
  MarketChartResponse,
  MarketSymbol,
} from "@/lib/market/contracts";
import { getInstrument } from "@/lib/market/catalog";

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const LOOKBACK_DAYS = 120;

type CoinGeckoCandle = [number, number, number, number, number];

type FrankfurterResponse = {
  rates: Record<string, { USD?: number }>;
};

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function isCoinGeckoCandle(value: unknown): value is CoinGeckoCandle {
  return (
    Array.isArray(value) &&
    value.length === 5 &&
    value.every((item) => typeof item === "number")
  );
}

async function fetchCoinGeckoCandles(
  symbol: Extract<MarketSymbol, "BTCUSD" | "ETHUSD" | "XAUUSD">,
): Promise<MarketChartResponse> {
  const coinId =
    symbol === "ETHUSD" ? "ethereum" : symbol === "XAUUSD" ? "pax-gold" : "bitcoin";
  const instrument = getInstrument(symbol);
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=90`,
    { next: { revalidate: 900 } },
  );

  if (!response.ok) {
    throw new Error("CoinGecko candle request failed");
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error("CoinGecko returned an invalid candle payload");
  }

  const points: CandlestickPoint[] = payload
    .filter(isCoinGeckoCandle)
    .map(([timestamp, open, high, low, close]) => ({
      timestamp: new Date(timestamp).toISOString(),
      open,
      high,
      low,
      close,
    }))
    .sort((firstPoint, secondPoint) =>
      firstPoint.timestamp.localeCompare(secondPoint.timestamp),
    );

  return {
    symbol,
    label: instrument.label,
    market: instrument.category,
    kind: "candlestick",
    interval: "1d",
    source: "CoinGecko Demo API",
    delayed: true,
    configured: true,
    points,
  };
}

async function fetchEuroUsdReferenceSeries(): Promise<MarketChartResponse> {
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - LOOKBACK_DAYS * DAY_IN_MILLISECONDS);
  const response = await fetch(
    `https://api.frankfurter.dev/v1/${formatDate(startDate)}..${formatDate(endDate)}?base=EUR&symbols=USD`,
    { next: { revalidate: 3600 } },
  );

  if (!response.ok) {
    throw new Error("Frankfurter reference-rate request failed");
  }

  const payload = (await response.json()) as FrankfurterResponse;
  const points: LinePoint[] = Object.entries(payload.rates)
    .map(([timestamp, values]) => ({
      timestamp: new Date(`${timestamp}T00:00:00.000Z`).toISOString(),
      value: values.USD,
    }))
    .filter((point): point is LinePoint => typeof point.value === "number")
    .sort((firstPoint, secondPoint) =>
      firstPoint.timestamp.localeCompare(secondPoint.timestamp),
    );

  return {
    symbol: "EURUSD",
    label: "EUR/USD",
    market: "forex",
    kind: "line",
    interval: "1d",
    source: "Frankfurter / ECB reference rates",
    delayed: true,
    configured: true,
    points,
  };
}

async function fetchIranProviderSeries(
  symbol: Extract<MarketSymbol, "USDIRR" | "TEDPIX">,
): Promise<MarketChartResponse> {
  const instrument = getInstrument(symbol);
  const providerUrl = process.env.IRAN_MARKET_DATA_URL;

  if (!providerUrl) {
    return {
      symbol,
      label: instrument.label,
      market: instrument.category,
      kind: "line",
      interval: "1d",
      source: instrument.sourceLabel,
      delayed: true,
      configured: false,
      points: [],
      message: "برای فعال‌سازی داده این بازار، IRAN_MARKET_DATA_URL را تنظیم کنید.",
    };
  }

  const upstreamUrl = new URL(providerUrl);
  upstreamUrl.searchParams.set("symbol", symbol);
  const response = await fetch(upstreamUrl, { next: { revalidate: 900 } });

  if (!response.ok) {
    throw new Error("Iran market provider request failed");
  }

  const payload: unknown = await response.json();

  if (
    !payload ||
    typeof payload !== "object" ||
    !("points" in payload) ||
    !Array.isArray(payload.points)
  ) {
    throw new Error("Iran market provider returned an invalid response");
  }

  const points = payload.points.filter((point): point is LinePoint => {
    if (!point || typeof point !== "object") {
      return false;
    }

    const candidate = point as { timestamp?: unknown; value?: unknown };
    return typeof candidate.timestamp === "string" && typeof candidate.value === "number";
  });

  return {
    symbol,
    label: instrument.label,
    market: instrument.category,
    kind: "line",
    interval: "1d",
    source: instrument.sourceLabel,
    delayed: true,
    configured: true,
    points,
  };
}

export async function GET(request: NextRequest) {
  const candidateSymbol = request.nextUrl.searchParams.get("symbol")?.toUpperCase() ?? "BTCUSD";
  const supportedSymbols: MarketSymbol[] = ["BTCUSD", "ETHUSD", "EURUSD", "XAUUSD", "USDIRR", "TEDPIX"];
  const symbol = supportedSymbols.includes(candidateSymbol as MarketSymbol)
    ? (candidateSymbol as MarketSymbol)
    : "BTCUSD";

  try {
    const response = symbol === "EURUSD"
      ? await fetchEuroUsdReferenceSeries()
      : symbol === "USDIRR" || symbol === "TEDPIX"
        ? await fetchIranProviderSeries(symbol)
        : await fetchCoinGeckoCandles(symbol);

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Market data is temporarily unavailable." },
      { status: 502 },
    );
  }
}

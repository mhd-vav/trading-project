// src/app/api/market/news/route.ts
import { NextRequest, NextResponse } from "next/server";
import type {
  MarketNewsArticle,
  MarketNewsResponse,
} from "@/lib/market/contracts";

type AlphaVantageArticle = {
  title?: string;
  summary?: string;
  source?: string;
  url?: string;
  time_published?: string;
  overall_sentiment_label?: string;
  ticker_sentiment?: Array<{
    ticker?: string;
    ticker_sentiment_score?: string;
  }>;
};

type AlphaVantageResponse = {
  feed?: AlphaVantageArticle[];
};

function normalizeSentiment(value?: string): MarketNewsArticle["sentiment"] {
  if (value?.toLowerCase().includes("bullish")) {
    return "bullish";
  }
  if (value?.toLowerCase().includes("bearish")) {
    return "bearish";
  }
  if (value?.toLowerCase().includes("neutral")) {
    return "neutral";
  }
  return "unknown";
}

function formatAlphaVantageTimestamp(value?: string) {
  if (!value || !/^\d{8}T\d{6}$/.test(value)) {
    return new Date(0).toISOString();
  }

  const year = value.slice(0, 4);
  const month = value.slice(4, 6);
  const day = value.slice(6, 8);
  const hour = value.slice(9, 11);
  const minute = value.slice(11, 13);
  const second = value.slice(13, 15);

  return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
}

function mapArticle(
  article: AlphaVantageArticle,
  index: number,
  ticker: string,
): MarketNewsArticle {
  const tickerSentiment = article.ticker_sentiment?.find(
    (item) => item.ticker?.toUpperCase() === ticker,
  );

  return {
    id: `${article.url ?? article.title ?? "article"}-${index}`,
    title: article.title?.trim() || "Untitled market article",
    summary: article.summary?.trim() || "",
    source: article.source?.trim() || "Unknown",
    url: article.url?.trim() || "",
    publishedAt: formatAlphaVantageTimestamp(article.time_published),
    sentiment: normalizeSentiment(article.overall_sentiment_label),
    tickerSentiment: tickerSentiment
      ? Number(tickerSentiment.ticker_sentiment_score)
      : undefined,
  };
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        symbol: request.nextUrl.searchParams.get("symbol")?.toUpperCase() ?? "BTC",
        configured: false,
        articles: [],
      } satisfies MarketNewsResponse,
    );
  }

  const symbol = request.nextUrl.searchParams.get("symbol")?.toUpperCase() ?? "BTC";
  const query = new URLSearchParams({
    function: "NEWS_SENTIMENT",
    tickers: symbol,
    limit: "8",
    apikey: apiKey,
  });

  try {
    const response = await fetch(`https://www.alphavantage.co/query?${query.toString()}`, {
      next: { revalidate: 900 },
    });
    if (!response.ok) {
      throw new Error("News provider request failed");
    }

    const payload = (await response.json()) as AlphaVantageResponse;
    const articles = (payload.feed ?? []).map((article, index) =>
      mapArticle(article, index, symbol),
    );
    const result: MarketNewsResponse = { symbol, configured: true, articles };

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "News provider is temporarily unavailable." },
      { status: 502 },
    );
  }
}

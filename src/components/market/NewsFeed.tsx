// src/components/market/NewsFeed.tsx
"use client";

import { useEffect, useState } from "react";
import type {
  MarketNewsArticle,
  MarketNewsResponse,
} from "@/lib/market/contracts";
import { MARKET_COPY } from "@/lib/market/copy";

type NewsFeedProps = {
  symbol: string;
};

function isSafeExternalUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function sentimentClass(article: MarketNewsArticle) {
  if (article.sentiment === "bullish") {
    return "bg-success/10 text-success border-success/30";
  }
  if (article.sentiment === "bearish") {
    return "bg-danger/10 text-danger border-danger/30";
  }
  return "bg-surface-elevated text-muted border-border";
}

export default function NewsFeed({ symbol }: NewsFeedProps) {
  const [articles, setArticles] = useState<MarketNewsArticle[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "setup" | "error">(
    "loading",
  );

  useEffect(() => {
    const abortController = new AbortController();

    async function loadNews() {
      setStatus("loading");

      try {
        const response = await fetch(`/api/market/news?symbol=${symbol}`, {
          signal: abortController.signal,
        });
        const payload: unknown = await response.json();

        if (!response.ok) {
          setStatus("error");
          return;
        }

        if (!payload || typeof payload !== "object" || !("articles" in payload)) {
          setStatus("error");
          return;
        }

        const marketNews = payload as MarketNewsResponse;
        setArticles(marketNews.articles);
        setStatus(marketNews.configured ? "ready" : "setup");
      } catch {
        if (!abortController.signal.aborted) {
          setStatus("error");
        }
      }
    }

    void loadNews();

    return () => abortController.abort();
  }, [symbol]);

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-foreground">{MARKET_COPY.news.title}</h2>
        <p className="mt-1 text-sm text-muted">{MARKET_COPY.news.description}</p>
      </div>

      {status === "loading" && (
        <p className="rounded-xl border border-dashed border-border bg-background/40 p-5 text-sm text-muted">
          {MARKET_COPY.news.loading}
        </p>
      )}
      {status === "setup" && (
        <p className="rounded-xl border border-warning/30 bg-warning/10 p-5 text-sm text-warning">
          {MARKET_COPY.news.setup}
        </p>
      )}
      {status === "error" && (
        <p className="rounded-xl border border-danger/30 bg-danger/10 p-5 text-sm text-danger">
          {MARKET_COPY.news.empty}
        </p>
      )}
      {status === "ready" && articles.length === 0 && (
        <p className="rounded-xl border border-dashed border-border bg-background/40 p-5 text-sm text-muted">
          {MARKET_COPY.news.empty}
        </p>
      )}
      {status === "ready" && articles.length > 0 && (
        <div className="space-y-3">
          {articles.map((article) => {
            const articleContent = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-medium leading-7 text-foreground">
                    {article.title}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-xs ${sentimentClass(article)}`}
                  >
                    {article.sentiment}
                  </span>
                </div>
                {article.summary && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{article.summary}</p>
                )}
                <p className="mt-3 text-xs text-muted">
                  {MARKET_COPY.news.source}: {article.source}
                </p>
              </>
            );

            return isSafeExternalUrl(article.url) ? (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-border bg-background/30 p-4 transition-colors hover:border-primary/50"
              >
                {articleContent}
              </a>
            ) : (
              <article
                key={article.id}
                className="rounded-xl border border-border bg-background/30 p-4"
              >
                {articleContent}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

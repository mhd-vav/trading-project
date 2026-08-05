// src/components/market/TerminalWorkspace.tsx
"use client";

import { useEffect, useState } from "react";
import AnalysisDesk from "@/components/ai/AnalysisDesk";
import MarketChart from "@/components/charts/MarketChart";
import NewsFeed from "@/components/market/NewsFeed";
import type { MarketInstrument } from "@/lib/market/catalog";
import { defaultWorkspaceSettings, readWorkspaceSettings } from "@/lib/settings/workspace";

type TerminalWorkspaceProps = {
  instrument: MarketInstrument;
};

export default function TerminalWorkspace({ instrument }: TerminalWorkspaceProps) {
  const [showNewsPanel, setShowNewsPanel] = useState(defaultWorkspaceSettings.showNewsPanel);
  const canRunAnalysis = instrument.category === "crypto" || instrument.category === "forex";
  const assetClass = instrument.category === "forex" ? "forex" : "crypto";
  const newsSymbol =
    instrument.symbol === "EURUSD" ? "EUR" : instrument.symbol === "ETHUSD" ? "ETH" : "BTC";

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      setShowNewsPanel(readWorkspaceSettings().showNewsPanel);
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  return (
    <div
      className={
        showNewsPanel
          ? "grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(22rem,0.75fr)]"
          : "grid gap-6"
      }
    >
      <div className="space-y-6">
        <MarketChart symbol={instrument.symbol} />
        {canRunAnalysis ? (
          <AnalysisDesk initialAsset={instrument.label} initialAssetClass={assetClass} />
        ) : (
          <section className="rounded-2xl border border-dashed border-border bg-surface p-6">
            <p className="text-sm font-medium text-primary">میزهای هوشمندی ماشین</p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              مدل‌های این بازار در مرحله اتصال داده هستند
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted">
              پس از اتصال منبع ساختاریافته برای {instrument.label}، میزهای اختصاصی این بازار با
              لایه‌های داده، گزارش و سطح اشتراک نمایش داده خواهند شد.
            </p>
          </section>
        )}
      </div>
      {showNewsPanel ? <NewsFeed symbol={newsSymbol} /> : null}
    </div>
  );
}

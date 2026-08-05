// src/app/app/terminal/page.tsx
import Link from "next/link";
import TerminalWorkspace from "@/components/market/TerminalWorkspace";
import {
  MARKET_CATEGORY_LABELS,
  MARKET_INSTRUMENTS,
  getInstrument,
} from "@/lib/market/catalog";
import type { MarketSymbol } from "@/lib/market/contracts";
import { MARKET_COPY } from "@/lib/market/copy";

export const metadata = { title: "ترمینال بازار" };

type TerminalPageProps = {
  searchParams: Promise<{ symbol?: string }>;
};

export default async function TerminalPage({ searchParams }: TerminalPageProps) {
  const { symbol } = await searchParams;
  const selectedInstrument = getInstrument(symbol);
  const selectedSymbol = selectedInstrument.symbol as MarketSymbol;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-l from-primary/10 via-accent/5 to-surface p-6 sm:p-8">
        <p className="text-sm font-medium text-primary">{MARKET_COPY.terminal.eyebrow}</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {selectedInstrument.label} · {MARKET_COPY.terminal.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              {selectedInstrument.description}. {MARKET_COPY.terminal.description}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {MARKET_INSTRUMENTS.map((instrument) => (
            <Link
              key={instrument.symbol}
              href={`/app/terminal?symbol=${instrument.symbol}`}
              className={`rounded-xl border px-3 py-2 text-xs transition-colors ${
                selectedSymbol === instrument.symbol
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-background/50 text-muted hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <span dir="ltr">{instrument.label}</span>
              <span className="mr-1.5 text-[10px] opacity-75">
                {MARKET_CATEGORY_LABELS[instrument.category]}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <TerminalWorkspace instrument={selectedInstrument} />
    </div>
  );
}

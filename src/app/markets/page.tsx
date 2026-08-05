// src/app/markets/page.tsx
// src/app/markets/page.tsx
import Link from "next/link";
import MarketChart from "@/components/charts/MarketChart";
import {
  MARKET_CATEGORY_LABELS,
  MARKET_INSTRUMENTS,
} from "@/lib/market/catalog";
import { MARKET_COPY } from "@/lib/market/copy";

export const metadata = {
  title: "بازارها",
  description: "بازارهای منتخب، نمودارها و دسترسی به میزهای تحلیل",
};

export default function MarketsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <section className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,1.2fr)]">
        <div>
          <p className="text-sm font-medium text-primary">{MARKET_COPY.public.markets.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {MARKET_COPY.public.markets.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted">
            {MARKET_COPY.public.markets.description}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/app/terminal"
              className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              {MARKET_COPY.public.actions.openTerminal}
            </Link>
            <Link
              href="/ai-desks"
              className="rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
            >
              {MARKET_COPY.public.actions.openDesks}
            </Link>
          </div>
        </div>
        <MarketChart symbol="BTCUSD" />
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-3">
        {[
          ["نمودارهای منبع‌محور", "هر نمودار منبع، بازه و وضعیت تأخیر خود را شفاف نشان می‌دهد."],
          ["هشدارهای شخصی", "قیمت، خبر، نشست بازار و تغییر نتیجه میزها را دنبال کنید."],
          ["واچ‌لیست یکپارچه", "دارایی‌های مورد توجه خود را با خبر و تحلیل در یک نما نگه دارید."],
        ].map(([title, description]) => (
          <article key={title} className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
          </article>
        ))}
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">پوشش بازار</p>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              یک ترمینال، چند کلاس دارایی
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
              هر ابزار منبع و وضعیت اتصال مستقل دارد. داده‌های ایران تا زمان انتخاب منبع دارای مجوز،
              به‌صورت شفاف در حالت اتصال باقی می‌مانند.
            </p>
          </div>
          <Link
            href="/app/terminal"
            className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
          >
            باز کردن فضای کاری
          </Link>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MARKET_INSTRUMENTS.map((instrument) => (
            <Link
              key={instrument.symbol}
              href={`/app/terminal?symbol=${instrument.symbol}`}
              className="group rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-primary/50"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs text-primary">
                  {MARKET_CATEGORY_LABELS[instrument.category]}
                </span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    instrument.availability === "available" ? "bg-success" : "bg-warning"
                  }`}
                  aria-label={instrument.availability === "available" ? "متصل" : "نیازمند اتصال"}
                />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-foreground" dir="ltr">
                {instrument.label}
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted">{instrument.description}</p>
              <p className="mt-4 text-xs text-muted">منبع: {instrument.sourceLabel}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

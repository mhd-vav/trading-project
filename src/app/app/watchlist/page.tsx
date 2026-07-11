import Link from "next/link";

export const metadata = { title: "واچ‌لیست" };

const WATCHLIST = [
  { symbol: "BTC/USDT", market: "کریپتو" },
  { symbol: "EUR/USD", market: "فارکس" },
  { symbol: "XAU/USD", market: "کالا" },
];

export default function WatchlistPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">واچ‌لیست</h1>
          <p className="mt-1 text-sm text-muted">نمادهای پیگیری‌شده شما</p>
        </div>
        <Link href="/app/symbols" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">افزودن نماد</Link>
      </div>

      <div className="space-y-3">
        {WATCHLIST.map((item) => (
          <Link key={item.symbol} href={`/app/symbols/${item.symbol.replace("/", "-")}`} className="flex items-center justify-between rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/50">
            <div className="flex items-center gap-3">
              <span className="text-warning">★</span>
              <span className="font-mono font-semibold text-foreground">{item.symbol}</span>
              <span className="text-xs text-muted">{item.market}</span>
            </div>
            <span className="text-muted hover:text-danger">حذف</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

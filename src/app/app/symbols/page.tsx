import Link from "next/link";

export const metadata = { title: "نمادها" };

const SYMBOLS = [
  { symbol: "BTC/USDT", market: "کریپتو", lastUpdate: "۲ ساعت پیش" },
  { symbol: "ETH/USDT", market: "کریپتو", lastUpdate: "۵ ساعت پیش" },
  { symbol: "EUR/USD", market: "فارکس", lastUpdate: "۳ ساعت پیش" },
  { symbol: "GBP/USD", market: "فارکس", lastUpdate: "۴ ساعت پیش" },
  { symbol: "XAU/USD", market: "کالا", lastUpdate: "دیروز" },
  { symbol: "AAPL", market: "سهام آمریکا", lastUpdate: "دیروز" },
  { symbol: "TSLA", market: "سهام آمریکا", lastUpdate: "دیروز" },
];

export default function SymbolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">نمادها</h1>
        <p className="mt-1 text-sm text-muted">مرور نمادهای بازار</p>
      </div>

      <input
        type="text"
        dir="ltr"
        placeholder="جستجوی نماد..."
        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SYMBOLS.map((item) => (
          <Link
            key={item.symbol}
            href={`/app/symbols/${item.symbol.replace("/", "-")}`}
            className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/50"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-semibold text-foreground">{item.symbol}</span>
              <span className="text-xs text-muted">{item.market}</span>
            </div>
            <p className="mt-3 text-xs text-muted">آخرین به‌روزرسانی: {item.lastUpdate}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

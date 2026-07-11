import Link from "next/link";

export const metadata = { title: "تحلیل‌ها" };

const ANALYSES = [
  { id: "1", symbol: "BTC/USDT", market: "کریپتو", type: "تحلیل بازار", date: "۱۴۰۴/۰۴/۱۰", summary: "تثبیت روی حمایت کلیدی با روند صعودی کوتاه‌مدت." },
  { id: "2", symbol: "EUR/USD", market: "فارکس", type: "تحلیل احساسات", date: "۱۴۰۴/۰۴/۱۰", summary: "حالت جمعی خنثی با افزایش پوزیشن لانگ." },
  { id: "3", symbol: "XAU/USD", market: "کالا", type: "تحلیل اخبار", date: "۱۴۰۴/۰۴/۰۹", summary: "داده‌های تورمی مطلوب، کاتالیزور سخنرانی فدرال رزرو." },
  { id: "4", symbol: "AAPL", market: "سهام آمریکا", type: "تحلیل بازار", date: "۱۴۰۴/۰۴/۰۹", summary: "شکست مقاومت محلی، حجم معاملات رو به افزایش." },
  { id: "5", symbol: "ETH/USDT", market: "کریپتو", type: "تحلیل احساسات", date: "۱۴۰۴/۰۴/۰۸", summary: "احساسات مثبت، مومنتوم نظرات رو به بهبود." },
];

const TYPE_COLORS: Record<string, string> = {
  "تحلیل بازار": "text-primary",
  "تحلیل احساسات": "text-accent",
  "تحلیل اخبار": "text-success",
};

export default function AnalysesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">تحلیل‌ها</h1>
        <p className="mt-1 text-sm text-muted">فیلتر بر اساس بازار، نماد، نوع و تاریخ</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["همه", "فارکس", "کریپتو", "سهام آمریکا", "کالا"].map((filter, idx) => (
          <button
            key={filter}
            className={`rounded-lg border px-4 py-1.5 text-sm transition-colors ${
              idx === 0 ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {ANALYSES.map((analysis) => (
          <Link
            key={analysis.id}
            href={`/app/analyses/${analysis.id}`}
            className="block rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold text-foreground">{analysis.symbol}</span>
                  <span className={`text-xs ${TYPE_COLORS[analysis.type]}`}>{analysis.type}</span>
                  <span className="text-xs text-muted">{analysis.market}</span>
                </div>
                <p className="mt-2 text-sm text-muted">{analysis.summary}</p>
              </div>
              <span className="shrink-0 text-xs text-muted">{analysis.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

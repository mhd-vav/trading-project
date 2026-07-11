import Link from "next/link";

const STATS = [
  { label: "تحلیل‌های اخیر", value: "۲۴", icon: "📑" },
  { label: "نمادهای واچ‌لیست", value: "۶", icon: "★" },
  { label: "درخواست‌های در انتظار", value: "۱", icon: "✦" },
  { label: "هشدارهای فعال", value: "۳", icon: "🔔" },
];

const RECENT = [
  { symbol: "BTC/USDT", type: "تحلیل بازار", time: "۲ ساعت پیش" },
  { symbol: "EUR/USD", type: "تحلیل احساسات", time: "۵ ساعت پیش" },
  { symbol: "XAU/USD", type: "تحلیل اخبار", time: "دیروز" },
  { symbol: "AAPL", type: "تحلیل بازار", time: "دیروز" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">داشبورد</h1>
        <p className="mt-1 text-sm text-muted">خلاصه هوشمندی بازار شما</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-2 text-2xl">{stat.icon}</div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-surface p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">تحلیل‌های اخیر</h2>
            <Link href="/app/analyses" className="text-sm text-primary hover:text-primary-hover">همه</Link>
          </div>
          <div className="space-y-3">
            {RECENT.map((item) => (
              <Link
                key={item.symbol + item.type}
                href="/app/analyses"
                className="flex items-center justify-between rounded-lg border border-border bg-surface-elevated px-4 py-3 transition-colors hover:border-primary/50"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-foreground">{item.symbol}</span>
                  <span className="text-xs text-muted">{item.type}</span>
                </div>
                <span className="text-xs text-muted">{item.time}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="mb-3 font-semibold text-foreground">وضعیت اشتراک</h2>
            <div className="mb-2 text-sm text-muted">پلن فعال: ۳ ماهه</div>
            <div className="mb-4 text-xs text-muted">تاریخ تمدید: ۱۴۰۴/۰۷/۱۰</div>
            <Link href="/app/billing" className="block rounded-lg bg-primary py-2 text-center text-sm font-medium text-white hover:bg-primary-hover">
              مدیریت اشتراک
            </Link>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="mb-3 font-semibold text-foreground">پیشرفت ارجاع</h2>
            <div className="mb-2 text-sm text-muted">۲ از ۵ ارجاع موفق</div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
              <div className="h-full w-2/5 rounded-full bg-accent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

const STATS = [
  { label: "کاربران", value: "۱٬۲۴۰", icon: "◉" },
  { label: "اشتراک‌های فعال", value: "۳۸۰", icon: "⌚" },
  { label: "تحلیل‌های منتشرشده", value: "۸۹۰", icon: "📑" },
  { label: "درخواست‌های در انتظار", value: "۱۲", icon: "✦" },
];

const RECENT_ACTIVITY = [
  { action: "تحلیل جدید منتشر شد", target: "BTC/USDT", time: "۱۰ دقیقه پیش" },
  { action: "اشتراک جدید", target: "کاربر #1024", time: "۳۰ دقیقه پیش" },
  { action: "درخواست تحلیل ثبت شد", target: "ETH/USDT", time: "۱ ساعت پیش" },
  { action: "تأیید هویت انجام شد", target: "کاربر #1018", time: "۲ ساعت پیش" },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">نمای کلی</h1>
        <p className="mt-1 text-sm text-muted">وضعیت عملیات پلتفرم</p>
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
          <h2 className="mb-4 font-semibold text-foreground">فعالیت‌های اخیر</h2>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border border-border bg-surface-elevated px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground">{item.action}</span>
                  <span className="font-mono text-xs text-muted">{item.target}</span>
                </div>
                <span className="text-xs text-muted">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-surface p-6">
            <h2 className="mb-3 font-semibold text-foreground">میانبرها</h2>
            <div className="space-y-2">
              <Link href="/admin/analyses" className="block rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-sm text-foreground hover:border-primary/50">تحلیل جدید</Link>
              <Link href="/admin/users" className="block rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-sm text-foreground hover:border-primary/50">مدیریت کاربران</Link>
              <Link href="/admin/verification" className="block rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-sm text-foreground hover:border-primary/50">صف تأیید هویت</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

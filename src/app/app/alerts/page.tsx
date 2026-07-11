export const metadata = { title: "هشدارها" };

const ALERTS = [
  { symbol: "BTC/USDT", message: "تحلیل جدید بازار منتشر شد", time: "۲ ساعت پیش", read: false },
  { symbol: "EUR/USD", message: "به‌روزرسانی تحلیل احساسات", time: "۵ ساعت پیش", read: false },
  { symbol: "XAU/USD", message: "یادآوری تمدید اشتراک", time: "دیروز", read: true },
];

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">هشدارها</h1>
        <p className="mt-1 text-sm text-muted">اعلان‌های تحلیل و نمادهای شما</p>
      </div>

      <div className="space-y-3">
        {ALERTS.map((alert, idx) => (
          <div key={idx} className={`rounded-xl border bg-surface p-5 ${alert.read ? "border-border" : "border-primary/40"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {!alert.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                <div>
                  <span className="font-mono text-sm text-foreground">{alert.symbol}</span>
                  <p className="mt-1 text-sm text-muted">{alert.message}</p>
                </div>
              </div>
              <span className="shrink-0 text-xs text-muted">{alert.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

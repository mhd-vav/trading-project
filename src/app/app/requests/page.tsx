import Link from "next/link";

export const metadata = { title: "درخواست‌های تحلیل" };

const REQUESTS = [
  { id: "1", symbol: "BTC/USDT", status: "در حال انجام", statusColor: "text-warning", date: "۱۴۰۴/۰۴/۱۰" },
  { id: "2", symbol: "AAPL", status: "تحویل شده", statusColor: "text-success", date: "۱۴۰۴/۰۴/۰۵" },
  { id: "3", symbol: "EUR/USD", status: "در صف", statusColor: "text-muted", date: "۱۴۰۴/۰۴/۰۴" },
];

export default function RequestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">درخواست‌های تحلیل</h1>
          <p className="mt-1 text-sm text-muted">درخواست‌های تحلیل اختصاصی شما</p>
        </div>
        <Link href="/request-analysis" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">درخواست جدید</Link>
      </div>

      <div className="space-y-3">
        {REQUESTS.map((req) => (
          <div key={req.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center gap-3">
              <span className="font-mono font-semibold text-foreground">{req.symbol}</span>
              <span className={`text-xs ${req.statusColor}`}>{req.status}</span>
            </div>
            <span className="text-xs text-muted">{req.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

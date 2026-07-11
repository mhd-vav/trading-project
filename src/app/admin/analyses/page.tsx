export const metadata = { title: "مدیریت تحلیل‌ها" };

const ANALYSES = [
  { id: "A-890", symbol: "BTC/USDT", type: "تحلیل بازار", status: "منتشرشده", statusColor: "text-success" },
  { id: "A-889", symbol: "EUR/USD", type: "تحلیل احساسات", status: "در حال بازبینی", statusColor: "text-warning" },
  { id: "A-888", symbol: "XAU/USD", type: "تحلیل اخبار", status: "پیش‌نویس", statusColor: "text-muted" },
  { id: "A-887", symbol: "AAPL", type: "تحلیل بازار", status: "منتشرشده", statusColor: "text-success" },
];

const WORKFLOW = ["پیش‌نویس", "بازبینی", "تأییدشده", "منتشرشده", "بایگانی"];

export default function AdminAnalysesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">تحلیل‌ها</h1>
          <p className="mt-1 text-sm text-muted">ایجاد، ویرایش و انتشار</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">تحلیل جدید</button>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="flex flex-wrap gap-2 text-xs text-muted">
          {WORKFLOW.map((step, idx) => (
            <span key={step} className="flex items-center gap-2">
              {idx > 0 && <span className="text-border">←</span>}
              <span className="rounded-lg border border-border bg-surface-elevated px-3 py-1">{step}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-right text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">شناسه</th>
              <th className="px-4 py-3 font-medium">نماد</th>
              <th className="px-4 py-3 font-medium">نوع</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {ANALYSES.map((analysis) => (
              <tr key={analysis.id} className="border-b border-border last:border-0 hover:bg-surface-elevated">
                <td className="px-4 py-3 text-foreground">{analysis.id}</td>
                <td className="px-4 py-3 font-mono text-muted">{analysis.symbol}</td>
                <td className="px-4 py-3 text-muted">{analysis.type}</td>
                <td className="px-4 py-3"><span className={`text-xs ${analysis.statusColor}`}>{analysis.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

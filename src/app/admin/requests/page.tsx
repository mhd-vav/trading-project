export const metadata = { title: "صف درخواست‌ها" };

const REQUESTS = [
  { id: "R-012", symbol: "ETH/USDT", status: "در صف", statusColor: "text-muted" },
  { id: "R-011", symbol: "TSLA", status: "در حال انجام", statusColor: "text-warning" },
  { id: "R-010", symbol: "GBP/USD", status: "تکمیل‌شده", statusColor: "text-success" },
  { id: "R-009", symbol: "BTC/USDT", status: "تحویل‌شده", statusColor: "text-success" },
];

export default function AdminRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">صف درخواست‌ها</h1>
        <p className="mt-1 text-sm text-muted">مدیریت درخواست‌های تحلیل اختصاصی</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-right text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">شناسه</th>
              <th className="px-4 py-3 font-medium">نماد</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
              <th className="px-4 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {REQUESTS.map((req) => (
              <tr key={req.id} className="border-b border-border last:border-0 hover:bg-surface-elevated">
                <td className="px-4 py-3 text-foreground">{req.id}</td>
                <td className="px-4 py-3 font-mono text-muted">{req.symbol}</td>
                <td className="px-4 py-3"><span className={`text-xs ${req.statusColor}`}>{req.status}</span></td>
                <td className="px-4 py-3"><button className="text-xs text-primary hover:underline">مشاهده</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const metadata = { title: "مدیریت نمادها" };

const SYMBOLS = [
  { symbol: "BTC/USDT", market: "کریپتو", analyses: 124 },
  { symbol: "ETH/USDT", market: "کریپتو", analyses: 89 },
  { symbol: "EUR/USD", market: "فارکس", analyses: 210 },
  { symbol: "XAU/USD", market: "کالا", analyses: 156 },
  { symbol: "AAPL", market: "سهام آمریکا", analyses: 78 },
];

export default function AdminSymbolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">نمادها</h1>
          <p className="mt-1 text-sm text-muted">مدیریت نمادهای پلتفرم</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">افزودن نماد</button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-right text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">نماد</th>
              <th className="px-4 py-3 font-medium">بازار</th>
              <th className="px-4 py-3 font-medium">تعداد تحلیل</th>
            </tr>
          </thead>
          <tbody>
            {SYMBOLS.map((item) => (
              <tr key={item.symbol} className="border-b border-border last:border-0 hover:bg-surface-elevated">
                <td className="px-4 py-3 font-mono text-foreground">{item.symbol}</td>
                <td className="px-4 py-3 text-muted">{item.market}</td>
                <td className="px-4 py-3 text-muted">{item.analyses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

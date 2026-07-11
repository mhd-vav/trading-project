export const metadata = { title: "لاگ ممیزی" };

const LOGS = [
  { actor: "مدیر", action: "انتشار تحلیل A-890", target: "BTC/USDT", time: "۱۰ دقیقه پیش" },
  { actor: "سیستم", action: "پرداخت موفق INV-003", target: "#1024", time: "۳۰ دقیقه پیش" },
  { actor: "مدیر", action: "تأیید هویت", target: "#1018", time: "۲ ساعت پیش" },
  { actor: "کاربر #1023", action: "تغییر پلن", target: "۱۲ ماهه", time: "۳ ساعت پیش" },
];

export default function AdminAuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">لاگ ممیزی</h1>
        <p className="mt-1 text-sm text-muted">تاریخچه عملیات‌های حساس</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-right text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">اجراکننده</th>
              <th className="px-4 py-3 font-medium">عملیات</th>
              <th className="px-4 py-3 font-medium">هدف</th>
              <th className="px-4 py-3 font-medium">زمان</th>
            </tr>
          </thead>
          <tbody>
            {LOGS.map((log, idx) => (
              <tr key={idx} className="border-b border-border last:border-0 hover:bg-surface-elevated">
                <td className="px-4 py-3 text-foreground">{log.actor}</td>
                <td className="px-4 py-3 text-muted">{log.action}</td>
                <td className="px-4 py-3 font-mono text-muted">{log.target}</td>
                <td className="px-4 py-3 text-xs text-muted">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

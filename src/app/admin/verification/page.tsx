export const metadata = { title: "تأیید هویت" };

const QUEUE = [
  { user: "#1025", phone: "0912xxxxx67", type: "شاهکار", status: "در انتظار", statusColor: "text-warning" },
  { user: "#1026", phone: "0912xxxxx78", type: "کارت بانکی", status: "در انتظار", statusColor: "text-warning" },
  { user: "#1018", phone: "0912xxxxx56", type: "شاهکار", status: "تأییدشده", statusColor: "text-success" },
];

export default function AdminVerificationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">تأیید هویت</h1>
        <p className="mt-1 text-sm text-muted">صف بررسی شاهکار و مالکیت کارت</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-right text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">کاربر</th>
              <th className="px-4 py-3 font-medium">موبایل</th>
              <th className="px-4 py-3 font-medium">نوع</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
              <th className="px-4 py-3 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {QUEUE.map((item, idx) => (
              <tr key={idx} className="border-b border-border last:border-0 hover:bg-surface-elevated">
                <td className="px-4 py-3 text-foreground">{item.user}</td>
                <td className="px-4 py-3 font-mono text-muted" dir="ltr">{item.phone}</td>
                <td className="px-4 py-3 text-muted">{item.type}</td>
                <td className="px-4 py-3"><span className={`text-xs ${item.statusColor}`}>{item.status}</span></td>
                <td className="px-4 py-3 space-x-2">
                  <button className="text-xs text-success hover:underline">تأیید</button>
                  <button className="text-xs text-danger hover:underline">رد</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

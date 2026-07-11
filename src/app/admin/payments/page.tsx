export const metadata = { title: "پرداخت‌ها" };

const PAYMENTS = [
  { id: "INV-003", user: "#1024", amount: "۲۰٬۰۰۰٬۰۰۰", status: "موفق", statusColor: "text-success" },
  { id: "INV-002", user: "#1023", amount: "۶۰٬۰۰۰٬۰۰۰", status: "موفق", statusColor: "text-success" },
  { id: "INV-001", user: "#1018", amount: "۳۵٬۰۰۰٬۰۰۰", status: "ناموفق", statusColor: "text-danger" },
];

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">پرداخت‌ها</h1>
        <p className="mt-1 text-sm text-muted">سوابق پرداخت و صورتحساب</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-right text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">صورتحساب</th>
              <th className="px-4 py-3 font-medium">کاربر</th>
              <th className="px-4 py-3 font-medium">مبلغ (تومان)</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {PAYMENTS.map((pay) => (
              <tr key={pay.id} className="border-b border-border last:border-0 hover:bg-surface-elevated">
                <td className="px-4 py-3 text-foreground">{pay.id}</td>
                <td className="px-4 py-3 text-muted">{pay.user}</td>
                <td className="px-4 py-3 text-muted">{pay.amount}</td>
                <td className="px-4 py-3"><span className={`text-xs ${pay.statusColor}`}>{pay.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

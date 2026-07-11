export const metadata = { title: "اشتراک و پرداخت" };

const INVOICES = [
  { id: "INV-003", date: "۱۴۰۴/۰۴/۱۰", amount: "۲۰٬۰۰۰٬۰۰۰ تومان", status: "موفق" },
  { id: "INV-002", date: "۱۴۰۴/۰۱/۱۰", amount: "۷٬۰۰۰٬۰۰۰ تومان", status: "موفق" },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">اشتراک و پرداخت</h1>
        <p className="mt-1 text-sm text-muted">مدیریت پلن، صورتحساب و کارت</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted">پلن فعال</div>
            <div className="mt-1 text-xl font-bold text-foreground">اشتراک ۳ ماهه</div>
          </div>
          <span className="rounded-lg bg-success/10 px-3 py-1 text-xs text-success">فعال</span>
        </div>
        <div className="mt-4 text-sm text-muted">تاریخ تمدید: ۱۴۰۴/۰۷/۱۰</div>
        <button className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">تمدید اشتراک</button>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-semibold text-foreground">تاریخچه صورتحساب</h2>
        <div className="space-y-2">
          {INVOICES.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between rounded-lg border border-border bg-surface-elevated px-4 py-3">
              <div>
                <div className="text-sm text-foreground">{inv.id}</div>
                <div className="text-xs text-muted">{inv.date}</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-foreground">{inv.amount}</span>
                <span className="rounded bg-success/10 px-2 py-0.5 text-xs text-success">{inv.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

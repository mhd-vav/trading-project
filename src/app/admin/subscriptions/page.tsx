export const metadata = { title: "اشتراک‌ها" };

const SUBS = [
  { user: "#1024", plan: "۳ ماهه", status: "فعال", renew: "۱۴۰۴/۰۷/۱۰" },
  { user: "#1023", plan: "۱۲ ماهه", status: "فعال", renew: "۱۴۰۵/۰۴/۱۰" },
  { user: "#1022", plan: "—", status: "منقضی", renew: "—" },
];

export default function AdminSubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">اشتراک‌ها</h1>
        <p className="mt-1 text-sm text-muted">مدیریت اشتراک‌های کاربران</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-right text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">کاربر</th>
              <th className="px-4 py-3 font-medium">پلن</th>
              <th className="px-4 py-3 font-medium">تمدید</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {SUBS.map((sub, idx) => (
              <tr key={idx} className="border-b border-border last:border-0 hover:bg-surface-elevated">
                <td className="px-4 py-3 text-foreground">{sub.user}</td>
                <td className="px-4 py-3 text-muted">{sub.plan}</td>
                <td className="px-4 py-3 text-muted">{sub.renew}</td>
                <td className="px-4 py-3"><span className={`text-xs ${sub.status === "فعال" ? "text-success" : "text-danger"}`}>{sub.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

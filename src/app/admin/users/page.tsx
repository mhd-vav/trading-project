export const metadata = { title: "مدیریت کاربران" };

const USERS = [
  { id: "1024", phone: "0912xxxxx12", role: "عضو", status: "فعال", sub: "۳ ماهه" },
  { id: "1023", phone: "0912xxxxx23", role: "عضو", status: "فعال", sub: "۱۲ ماهه" },
  { id: "1022", phone: "0912xxxxx34", role: "ثبت‌نام‌شده", status: "در انتظار", sub: "—" },
  { id: "1018", phone: "0912xxxxx56", role: "عضو", status: "فعال", sub: "۶ ماهه" },
  { id: "1010", phone: "0912xxxxx89", role: "ویراستار", status: "فعال", sub: "—" },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">کاربران</h1>
        <p className="mt-1 text-sm text-muted">مدیریت کاربران، نقش‌ها و وضعیت</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-right text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">شناسه</th>
              <th className="px-4 py-3 font-medium">موبایل</th>
              <th className="px-4 py-3 font-medium">نقش</th>
              <th className="px-4 py-3 font-medium">اشتراک</th>
              <th className="px-4 py-3 font-medium">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0 hover:bg-surface-elevated">
                <td className="px-4 py-3 text-foreground">#{user.id}</td>
                <td className="px-4 py-3 font-mono text-muted" dir="ltr">{user.phone}</td>
                <td className="px-4 py-3 text-muted">{user.role}</td>
                <td className="px-4 py-3 text-muted">{user.sub}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-0.5 text-xs ${user.status === "فعال" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{user.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

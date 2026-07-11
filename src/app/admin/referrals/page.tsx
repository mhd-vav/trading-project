export const metadata = { title: "ارجاع‌ها" };

const REFERRALS = [
  { user: "#1024", referred: 5, qualified: 2, reward: "۱ ماه رایگان", progress: "40%" },
  { user: "#1018", referred: 3, qualified: 1, reward: "—", progress: "20%" },
  { user: "#1023", referred: 8, qualified: 5, reward: "۲ ماه رایگان", progress: "100%" },
];

export default function AdminReferralsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">ارجاع‌ها</h1>
        <p className="mt-1 text-sm text-muted">پیگیری ارجاع‌ها، درآمد وrewards</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-right text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">کاربر</th>
              <th className="px-4 py-3 font-medium">ارجاع‌شده</th>
              <th className="px-4 py-3 font-medium">موفق</th>
              <th className="px-4 py-3 font-medium">پاداش</th>
              <th className="px-4 py-3 font-medium">پیشرفت</th>
            </tr>
          </thead>
          <tbody>
            {REFERRALS.map((r, idx) => (
              <tr key={idx} className="border-b border-border last:border-0 hover:bg-surface-elevated">
                <td className="px-4 py-3 text-foreground">{r.user}</td>
                <td className="px-4 py-3 text-muted">{r.referred}</td>
                <td className="px-4 py-3 text-muted">{r.qualified}</td>
                <td className="px-4 py-3 text-muted">{r.reward}</td>
                <td className="px-4 py-3"><span className="text-xs text-accent">{r.progress}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

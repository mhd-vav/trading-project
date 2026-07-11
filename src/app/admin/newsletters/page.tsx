export const metadata = { title: "مدیریت خبرنامه" };

const NEWSLETTERS = [
  { title: "هوشمندی بازار هفته ۲۷", date: "۱۴۰۴/۰۴/۰۸", status: "منتشرشده", statusColor: "text-success" },
  { title: "هوشمندی بازار هفته ۲۸", date: "۱۴۰۴/۰۴/۱۵", status: "پیش‌نویس", statusColor: "text-muted" },
];

export default function AdminNewslettersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">خبرنامه</h1>
          <p className="mt-1 text-sm text-muted">ایجاد و انتشار خبرنامه</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">خبرنامه جدید</button>
      </div>

      <div className="space-y-3">
        {NEWSLETTERS.map((nl) => (
          <div key={nl.title} className="flex items-center justify-between rounded-xl border border-border bg-surface p-5">
            <span className="font-medium text-foreground">{nl.title}</span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted">{nl.date}</span>
              <span className={`text-xs ${nl.statusColor}`}>{nl.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

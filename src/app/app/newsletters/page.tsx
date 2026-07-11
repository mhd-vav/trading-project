export const metadata = { title: "آرشیو خبرنامه" };

const NEWSLETTERS = [
  { title: "هوشمندی بازار هفته ۲۷", date: "۱۴۰۴/۰۴/۰۸" },
  { title: "هوشمندی بازار هفته ۲۶", date: "۱۴۰۴/۰۴/۰۱" },
  { title: "هوشمندی بازار هفته ۲۵", date: "۱۴۰۴/۰۳/۲۴" },
];

export default function NewslettersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">آرشیو خبرنامه</h1>
        <p className="mt-1 text-sm text-muted">خبرنامه‌های هفتگی هوشمندی بازار</p>
      </div>

      <div className="space-y-3">
        {NEWSLETTERS.map((nl) => (
          <div key={nl.title} className="flex items-center justify-between rounded-xl border border-border bg-surface p-5">
            <span className="font-medium text-foreground">{nl.title}</span>
            <span className="text-xs text-muted">{nl.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const metadata = { title: "تنظیمات" };

const SECTIONS = [
  { label: "نقش‌ها و دسترسی‌ها", desc: "مدیریت نقش‌ها و سطوح دسترسی" },
  { label: "تعرفه‌ها", desc: "قیمت و مدت اشتراک‌ها" },
  { label: "درگاه پرداخت", desc: "پیکربندی زرین‌پال" },
  { label: "ارسال پیام", desc: "SMS.ir و ایمیل" },
  { label: "تأیید هویت", desc: "شاهکار / زحل" },
];

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">تنظیمات</h1>
        <p className="mt-1 text-sm text-muted">پیکربندی پلتفرم</p>
      </div>

      <div className="space-y-3">
        {SECTIONS.map((section) => (
          <div key={section.label} className="flex items-center justify-between rounded-xl border border-border bg-surface p-5">
            <div>
              <div className="font-medium text-foreground">{section.label}</div>
              <div className="mt-1 text-xs text-muted">{section.desc}</div>
            </div>
            <button className="rounded-lg border border-border bg-surface-elevated px-4 py-1.5 text-sm text-foreground hover:border-primary/50">ویرایش</button>
          </div>
        ))}
      </div>
    </div>
  );
}

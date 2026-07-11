export const metadata = { title: "پروفایل" };

const FIELDS = [
  { label: "شماره موبایل", value: "09xxxxxxxxx", status: "تأیید شده", ok: true },
  { label: "تأیید هویت (شاهکار)", value: "کد ملی تأیید شده", status: "تأیید شده", ok: true },
  { label: "کارت بانکی", value: "•••• 6234", status: "تأیید شده", ok: true },
  { label: "اشتراک", value: "۳ ماهه — فعال", status: "فعال", ok: true },
];

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">پروفایل</h1>
        <p className="mt-1 text-sm text-muted">اطلاعات حساب و وضعیت تأیید</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-semibold text-foreground">اطلاعات هویتی</h2>
        <div className="space-y-4">
          {FIELDS.map((field) => (
            <div key={field.label} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
              <div>
                <div className="text-sm text-muted">{field.label}</div>
                <div className="mt-1 text-foreground" dir="ltr">{field.value}</div>
              </div>
              <span className={`rounded-lg px-3 py-1 text-xs ${field.ok ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                {field.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-semibold text-foreground">نشست‌ها و دستگاه‌ها</h2>
        <div className="flex items-center justify-between rounded-lg border border-border bg-surface-elevated px-4 py-3">
          <div>
            <div className="text-sm text-foreground">نشست فعلی</div>
            <div className="mt-1 text-xs text-muted">WSL — Chrome</div>
          </div>
          <button className="text-xs text-danger hover:underline">باطل کردن سایر نشست‌ها</button>
        </div>
      </div>
    </div>
  );
}

// src/app/app/alerts/page.tsx
import Link from "next/link";

const ALERT_TYPES = [
  ["قیمت", "وقتی یک سطح مشخص یا محدوده موردنظر شما لمس شود."],
  ["خبر", "وقتی یک خبر مرتبط از منبع متصل به سیستم دریافت شود."],
  ["تقویم", "قبل از رویدادهای اقتصادی یا آغاز یک نشست انتخابی."],
];

export const metadata = { title: "هشدارها" };

export default function AlertsPage() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-foreground">هشدارها</h1>
        <p className="mt-1 text-sm text-muted">آگاهی از زمینه بازار، بدون نیاز به نگاه دائمی به نمودار</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {ALERT_TYPES.map(([title, description]) => (
          <article key={title} className="rounded-2xl border border-border bg-surface p-5">
            <span className="text-xl text-primary">🔔</span>
            <h2 className="mt-4 font-semibold text-foreground">{title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
          </article>
        ))}
      </div>
      <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground">هنوز هشدار فعالی ندارید</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted">
          ابتدا نماد و شرایط خود را در ترمینال بررسی کنید. سپس هشدار را با قیمت، رویداد و سطح ریسک
          موردنظر خود تعریف کنید.
        </p>
        <Link
          href="/app/terminal"
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          رفتن به ترمینال
        </Link>
      </div>
    </div>
  );
}

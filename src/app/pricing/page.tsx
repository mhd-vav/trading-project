// src/app/pricing/page.tsx
import Link from "next/link";

export const metadata = { title: "پلن‌های اشتراک" };

const plans = [
  {
    name: "Explorer",
    accent: "border-cyan-400/35 bg-cyan-400/10",
    label: "برای شروع منظم",
    description: "فضای کاری ضروری برای مشاهده بازار، یادگیری و ساخت یک فرآیند شخصی.",
    report: "گزارش خلاصه با سطح سریع",
    features: [
      "ترمینال نموداری و داده‌های عمومی متصل",
      "واچ‌لیست، ژورنال و هشدارهای پایه",
      "آکادمی مقدماتی و مقاله‌های آموزشی",
      "گزارش کوتاه هوش ماشین در سطح اشتراک",
    ],
  },
  {
    name: "Pro",
    accent: "border-violet-400/45 bg-violet-400/10",
    label: "برای تحلیل روزانه",
    description: "برای معامله‌گری که می‌خواهد زمینه بازار، گزارش چندمیزه و مرور منظم داشته باشد.",
    report: "گزارش استاندارد با سطح حرفه‌ای",
    featured: true,
    features: [
      "تمام امکانات Explorer",
      "گزارش چندمیزه با شواهد و اختلاف دیدگاه‌ها",
      "سناریوهای جایگزین و خروجی استاندارد",
      "اعلان‌های قابل شخصی‌سازی و اتصال تلگرام",
    ],
  },
  {
    name: "Desk",
    accent: "border-amber-400/40 bg-amber-400/10",
    label: "برای پژوهش عمیق",
    description: "لایه پژوهشی پیشرفته برای کاربرانی که گزارش مفصل، مدل عمیق و ابزارهای بیشتر می‌خواهند.",
    report: "گزارش عمیق با سطح Desk",
    features: [
      "تمام امکانات Pro",
      "گزارش عمیق با زمینه بیشتر و تضادهای عامل‌ها",
      "پروفایل‌های گزارش و بازه‌های قابل تنظیم بیشتر",
      "دسترسی اولویت‌دار به ابزارهای در حال عرضه",
    ],
  },
];

const comparisonRows = [
  ["نمودارهای محاسبه‌شده", "کندل و خطی", "هیکن‌آشی، رنکو، رنج و TPO", "تمام حالت‌ها، TPO و Point & Figure"],
  ["سطح هوش ماشین", "سریع", "حرفه‌ای", "عمیق"],
  ["طول گزارش", "خلاصه", "خلاصه و استاندارد", "خلاصه، استاندارد و عمیق"],
  ["بازارهای توسعه‌پذیر", "داده‌های عمومی", "منابع متصل بیشتر", "اولویت ابزارهای پژوهشی"],
  ["پاداش دعوت", "فعال", "فعال", "فعال"],
];

export default function PricingPage() {
  return (
    <div className="overflow-hidden">
      <section className="section-glow border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            پلن‌های مبتنی بر سطح دسترسی
          </span>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            سطح هوش ماشین را متناسب با فرآیند خود انتخاب کنید
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-muted">
            تفاوت پلن‌ها فقط در تعداد قابلیت‌ها نیست؛ در عمق گزارش، سطح مدل و میزان زمینه‌ای است که
            برای مرور تصمیم در اختیار شما قرار می‌گیرد. قیمت و پرداخت نهایی پس از اتصال درگاه در
            همین صفحه منتشر می‌شود.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border p-6 ${
                plan.featured ? "border-violet-400/60 bg-surface shadow-xl shadow-violet-950/20" : "border-border bg-surface"
              }`}
            >
              {plan.featured ? (
                <span className="absolute -top-3 right-6 rounded-full border border-violet-400/30 bg-violet-500 px-3 py-1 text-xs font-medium text-white">
                  انتخاب متعادل
                </span>
              ) : null}
              <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs ${plan.accent}`}>
                {plan.label}
              </span>
              <h2 className="mt-5 text-3xl font-bold text-foreground" dir="ltr">
                {plan.name}
              </h2>
              <p className="mt-3 min-h-20 text-sm leading-7 text-muted">{plan.description}</p>
              <div className="mt-6 rounded-2xl border border-border bg-background/55 p-4">
                <p className="text-xs text-muted">پروفایل گزارش</p>
                <p className="mt-1 text-sm font-medium text-foreground">{plan.report}</p>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm leading-6 text-muted">
                    <span className="mt-1 text-success">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-8 rounded-xl px-5 py-3 text-center text-sm font-medium transition-colors ${
                  plan.featured
                    ? "bg-violet-500 text-white hover:bg-violet-600"
                    : "border border-border bg-background text-foreground hover:border-primary/50 hover:bg-surface-elevated"
                }`}
              >
                درخواست دسترسی
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">مقایسه دسترسی‌ها</p>
            <h2 className="mt-2 text-3xl font-semibold text-foreground">
              روشن، بدون ویژگی‌های پنهان
            </h2>
          </div>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
            <table className="min-w-[44rem] w-full border-collapse text-right text-sm">
              <thead className="bg-background/75 text-foreground">
                <tr>
                  <th className="px-5 py-4 font-medium">قابلیت</th>
                  <th className="px-5 py-4 font-medium" dir="ltr">Explorer</th>
                  <th className="px-5 py-4 font-medium" dir="ltr">Pro</th>
                  <th className="px-5 py-4 font-medium" dir="ltr">Desk</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([label, explorer, pro, desk]) => (
                  <tr key={label} className="border-t border-border">
                    <td className="px-5 py-4 font-medium text-foreground">{label}</td>
                    <td className="px-5 py-4 text-muted">{explorer}</td>
                    <td className="px-5 py-4 text-muted">{pro}</td>
                    <td className="px-5 py-4 text-muted">{desk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-amber-400/25 bg-gradient-to-l from-amber-400/10 via-primary/10 to-surface p-7 sm:p-10">
          <p className="text-sm font-medium text-amber-300">برنامه دعوت</p>
          <h2 className="mt-2 text-3xl font-semibold text-foreground">
            هر ۳ اشتراک پرداختی واجد شرایط، ۳۰ روز چارت
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-muted">
            پاداش دعوت به دسترسی بخش چارت اضافه می‌شود، نقدی یا قابل انتقال نیست و پس از بررسی
            پرداخت و جلوگیری از سوءاستفاده اعمال خواهد شد.
          </p>
          <Link
            href="/app/referrals"
            className="mt-6 inline-flex rounded-xl border border-border bg-background/60 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            مشاهده برنامه دعوت
          </Link>
        </div>
      </section>
    </div>
  );
}

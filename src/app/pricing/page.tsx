import Link from "next/link";

export const metadata = { title: "تعرفه اشتراک" };

const PLANS = [
  { duration: "۱ ماه", price: "۷٬۰۰۰٬۰۰۰", unit: "تومان", popular: false },
  { duration: "۳ ماه", price: "۲۰٬۰۰۰٬۰۰۰", unit: "تومان", popular: true },
  { duration: "۶ ماه", price: "۳۵٬۰۰۰٬۰۰۰", unit: "تومان", popular: false },
  { duration: "۱۲ ماه", price: "۶۰٬۰۰۰٬۰۰۰", unit: "تومان", popular: false },
];

const FEATURES = [
  "دسترسی به تحلیل‌های سه‌لایه نمادها",
  "صفحه اختصاصی هر نماد با تاریخچه",
  "واچ‌لیست و هشدارهای هوشمند",
  "خبرنامه هفتگی هوشمندی بازار",
  "درخواست تحلیل اختصاصی (پرداخت جداگانه)",
  "ژورنال معاملاتی شخصی",
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">تعرفه اشتراک</h1>
        <p className="mt-4 text-lg text-muted">دسترسی پریمیوم به هوشمندی بازار مافید</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => (
          <div
            key={plan.duration}
            className={`relative rounded-2xl border p-8 ${
              plan.popular ? "border-primary bg-surface-elevated" : "border-border bg-surface"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 right-1/2 translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                محبوب
              </span>
            )}
            <h3 className="text-lg font-semibold text-foreground">{plan.duration}</h3>
            <div className="mt-4">
              <span className="text-2xl font-bold text-foreground">{plan.price}</span>
              <span className="mr-1 text-sm text-muted">{plan.unit}</span>
            </div>
            <Link
              href="/register"
              className={`mt-6 block rounded-lg py-2.5 text-center text-sm font-medium transition-colors ${
                plan.popular
                  ? "bg-primary text-white hover:bg-primary-hover"
                  : "border border-border text-foreground hover:bg-surface-elevated"
              }`}
            >
              انتخاب پلن
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-center text-2xl font-bold text-foreground">امکانات همه پلن‌ها</h2>
        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-border bg-surface p-8">
          <ul className="space-y-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
                <span className="text-success">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12 rounded-xl border border-border bg-surface p-6 text-center text-sm text-muted">
        کارت بانکی استفاده‌شده برای پرداخت باید متعلق به شخص خود شما و منطبق با هویت تأییدشده باشد.
      </div>
    </div>
  );
}

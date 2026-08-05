// src/app/ai-desks/page.tsx
// src/app/ai-desks/page.tsx
import Image from "next/image";
import Link from "next/link";
import { MARKET_COPY } from "@/lib/market/copy";

export const metadata = {
  title: "میزهای هوش مصنوعی",
  description: "تحلیل چنددیدگاهی و توضیح‌پذیر بازار",
};

const DESKS = [
  ["تکنیکال", "ساختار قیمت، روند، سطوح و مومنتوم"],
  ["کمی", "مدل‌های آماری، رژیم بازار و سنجش نوسان"],
  ["ماکرو", "رویدادها، داده‌های اقتصادی و ریسک کلان"],
  ["احساسات", "لحن خبرها و تغییر محرک‌های بازار"],
  ["جریان سفارش", "کیفیت نقدشوندگی و فشار خرید یا فروش"],
  ["آن‌چین", "شاخص‌های شبکه برای دارایی‌های رمزارزی"],
];

export default function PublicAiDesksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <section className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,1fr)]">
        <div>
          <p className="text-sm font-medium text-primary">{MARKET_COPY.public.desks.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {MARKET_COPY.public.desks.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            {MARKET_COPY.public.desks.description} هر میز، شواهد و محدودیت خودش را نگه می‌دارد تا
            خروجی نهایی به‌جای یک دستور مبهم، یک گزارش قابل بررسی باشد.
          </p>
          <Link
            href="/app/ai-desks"
            className="mt-7 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            {MARKET_COPY.public.actions.openDesks}
          </Link>
        </div>
        <div className="relative min-h-72 overflow-hidden rounded-3xl border border-border">
          <Image
            src="/images/sections/machine-intelligence-network.png"
            alt="شبکه میزهای مستقل هوش ماشین برای تحلیل بازار"
            fill
            className="object-cover"
          />
        </div>
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DESKS.map(([title, description]) => (
          <article key={title} className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
          </article>
        ))}
      </section>

      <section className="mt-14 rounded-3xl border border-primary/20 bg-gradient-to-l from-primary/10 via-violet-500/10 to-surface p-7 sm:p-10">
        <p className="text-sm font-medium text-primary">چطور با هم کار می‌کنند؟</p>
        <h2 className="mt-2 text-3xl font-semibold text-foreground">
          عامل‌ها بررسی می‌کنند؛ هماهنگ‌کننده توضیح می‌دهد
        </h2>
        <div className="mt-7 grid gap-3 md:grid-cols-3">
          {[
            ["۱", "دریافت زمینه", "داده بازار، خبر و بازه زمانی را با منبع مشخص جمع می‌کنیم."],
            ["۲", "بررسی مستقل", "هر میز شواهد مربوط به خود را بدون حذف تناقض‌ها ارزیابی می‌کند."],
            ["۳", "گزارش قابل مرور", "جمع‌بندی، سناریو، اطمینان و نقاط اختلاف برای کاربر آماده می‌شود."],
          ].map(([number, title, description]) => (
            <article key={number} className="rounded-2xl border border-border bg-background/50 p-5">
              <span className="text-3xl font-semibold text-primary/50">{number}</span>
              <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

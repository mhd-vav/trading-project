// src/app/calendar/page.tsx
// src/app/calendar/page.tsx
import Image from "next/image";
import Link from "next/link";
import { MARKET_COPY } from "@/lib/market/copy";

export const metadata = {
  title: "تقویم بازار",
  description: "نشست‌های معاملاتی، رویدادهای اقتصادی و هشدارهای زمان‌بندی‌شده",
};

export default function CalendarPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl border border-border bg-surface">
        <div className="grid items-stretch lg:grid-cols-[1fr_minmax(22rem,0.85fr)]">
          <div className="p-7 sm:p-10">
            <p className="text-sm font-medium text-primary">{MARKET_COPY.public.calendar.eyebrow}</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
              {MARKET_COPY.public.calendar.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
              {MARKET_COPY.public.calendar.description}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["نشست‌های بازار", "توکیو، لندن و نیویورک با زمان محلی کاربر"],
                ["رویدادهای اقتصاد کلان", "نرخ بهره، تورم، اشتغال و میزان اثر"],
                ["هشدارهای قابل تنظیم", "یادآوری قبل از رویداد و دریافت خلاصه پس از آن"],
              ].map(([title, description]) => (
                <article key={title} className="rounded-xl border border-border bg-background/40 p-5">
                  <h2 className="font-medium text-foreground">{title}</h2>
                  <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
                </article>
              ))}
            </div>
            <Link
              href="/register"
              className="mt-8 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              {MARKET_COPY.public.actions.createAccount}
            </Link>
          </div>
          <div className="relative min-h-72">
            <Image
              src="/images/sections/market-news-calendar.png"
              alt="نمای انتزاعی تقویم اقتصادی و خبرهای بازار"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

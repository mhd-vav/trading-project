// src/app/app/dashboard/page.tsx
import Image from "next/image";
import Link from "next/link";
import MarketChart from "@/components/charts/MarketChart";
import NewsFeed from "@/components/market/NewsFeed";

const QUICK_ACTIONS = [
  {
    title: "باز کردن ترمینال",
    description: "نمودار، خبر و تحلیل چنددیدگاهی را در یک فضای کاری بررسی کنید.",
    href: "/app/terminal",
    icon: "⌁",
  },
  {
    title: "ثبت در ژورنال",
    description: "ایده، ریسک و نتیجه معامله را برای مرور شخصی نگه دارید.",
    href: "/app/journal",
    icon: "✎",
  },
  {
    title: "تنظیم هشدارها",
    description: "از تغییرات مهم بازار، رویدادها و برنامه خود آگاه بمانید.",
    href: "/app/alerts",
    icon: "🔔",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-2xl border border-primary/20 bg-surface">
        <div className="grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_20rem]">
          <div className="relative z-10">
            <p className="text-sm font-medium text-primary">کاکپیت شخصی شما</p>
            <h1 className="mt-2 text-3xl font-bold text-foreground">بازار را با زمینه دنبال کنید</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              ترمینال را برای بررسی داده‌های بازار باز کنید، تصمیم‌های خود را در ژورنال ثبت کنید و
              از تحلیل‌های آموزشی به‌عنوان یک لایه پژوهش استفاده کنید.
            </p>
            <Link
              href="/app/terminal"
              className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              رفتن به ترمینال بازار
            </Link>
          </div>
          <div className="relative min-h-48 overflow-hidden rounded-xl border border-border">
            <Image
              src="/images/sections/ai-trading-desks.png"
              alt="نمای انتزاعی میزهای هوش مصنوعی"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">کار بعدی شما چیست؟</h2>
          <p className="mt-1 text-sm text-muted">یک مسیر ساده برای شروع بدون اتصال حساب معاملاتی</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-primary/50"
            >
              <span className="text-2xl text-primary">{action.icon}</span>
              <h3 className="mt-4 font-semibold text-foreground">{action.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{action.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(22rem,0.75fr)]">
        <MarketChart symbol="BTCUSD" />
        <NewsFeed symbol="BTC" />
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">ژورنال هنوز خالی است</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
              با ثبت اولین معامله یا وارد کردن گزارش، مافید می‌تواند الگوهای اجرای شما را در کنار
              زمینه بازار نشان دهد.
            </p>
          </div>
          <Link
            href="/app/journal"
            className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
          >
            باز کردن ژورنال
          </Link>
        </div>
      </section>
    </div>
  );
}

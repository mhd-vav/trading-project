// src/app/app/journal/page.tsx
import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "ژورنال معاملاتی" };

export default function JournalPage() {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1fr_minmax(19rem,0.8fr)]">
      <section>
        <p className="text-sm font-medium text-primary">ژورنال شخصی</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">از نتیجه معامله، داده قابل مرور بسازید</h1>
        <p className="mt-4 max-w-2xl text-sm leading-8 text-muted">
          ژورنال برای اثبات درست‌بودن نیست. ایده، ریسک، اجرای معامله و وضعیت ذهنی را ثبت کنید تا در
          مرور هفتگی بتوانید عادت‌های تکرارشونده را ببینید.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/app/requests"
            className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            ثبت اولین معامله
          </Link>
          <Link
            href="/blog/how-to-build-a-trading-journal"
            className="rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
          >
            راهنمای ساخت ژورنال
          </Link>
        </div>
      </section>
      <div className="relative min-h-80 overflow-hidden rounded-3xl border border-border bg-surface">
        <Image
          src="/images/sections/trading-journal.png"
          alt="نمای انتزاعی ژورنال معاملاتی و ابزار مدیریت ریسک"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}

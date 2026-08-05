// src/app/app/watchlist/page.tsx
import Link from "next/link";

export const metadata = { title: "واچ‌لیست" };

export default function WatchlistPage() {
  return (
    <div className="mx-auto max-w-3xl py-8 text-center">
      <div className="rounded-3xl border border-dashed border-border bg-surface p-10 sm:p-14">
        <span className="text-5xl text-primary">★</span>
        <h1 className="mt-6 text-2xl font-bold text-foreground">واچ‌لیست خود را بسازید</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-8 text-muted">
          دارایی‌هایی را که واقعاً دنبال می‌کنید اضافه کنید تا نمودار، خبر و تحلیل‌ها در یک نمای
          شخصی کنار هم قرار بگیرند.
        </p>
        <Link
          href="/app/terminal"
          className="mt-7 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          بررسی بازارها در ترمینال
        </Link>
      </div>
    </div>
  );
}

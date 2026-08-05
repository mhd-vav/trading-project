// src/app/news/page.tsx
import NewsFeed from "@/components/market/NewsFeed";
import { MARKET_COPY } from "@/lib/market/copy";

export const metadata = {
  title: "اخبار بازار",
  description: "خبرهای بازار و امتیاز احساسات در کنار دارایی‌های مرتبط",
};

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">{MARKET_COPY.news.title}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
          خبرها، بدون جدا شدن از زمینه بازار
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
          هر خبر با منبع مشخص، برچسب احساسات و مسیر بازگشت به نمودار و میز تحلیل نمایش داده می‌شود.
        </p>
      </div>
      <NewsFeed symbol="BTC" />
    </div>
  );
}

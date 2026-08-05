// src/app/blog/page.tsx
import Image from "next/image";
import Link from "next/link";
import { BLOG_ARTICLES } from "@/content/blog";

export const metadata = {
  title: "آموزش معامله‌گری و هوشمندی بازار",
  description: "راهنماهای فارسی درباره ساختار بازار، مدیریت ریسک، ژورنال و تحلیل هوش مصنوعی.",
};

export default function BlogPage() {
  const featuredArticle = BLOG_ARTICLES[0];
  const secondaryArticles = BLOG_ARTICLES.slice(1);

  return (
    <div className="page-grid section-glow">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="max-w-3xl">
          <p className="text-sm font-medium text-primary">آموزش مافید</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            یادگیری برای تصمیم‌های منظم‌تر
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted">
            راهنماهای فارسی برای ساختن فرآیند، خواندن بازار و مدیریت ریسک؛ بدون وعده سود یا سیگنال قطعی.
          </p>
        </section>

        <Link
          href={`/blog/${featuredArticle.slug}`}
          className="group mt-12 grid overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl shadow-black/10 transition-colors hover:border-primary/50 lg:grid-cols-2"
        >
          <div className="relative min-h-64">
            <Image
              src={featuredArticle.image}
              alt={featuredArticle.imageAlt}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10">
            <p className="text-sm font-medium text-primary">{featuredArticle.category}</p>
            <h2 className="mt-3 text-2xl font-bold leading-10 text-foreground">
              {featuredArticle.title}
            </h2>
            <p className="mt-4 leading-8 text-muted">{featuredArticle.excerpt}</p>
            <span className="mt-6 text-sm font-medium text-primary">خواندن مقاله ←</span>
          </div>
        </Link>

        <section className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {secondaryArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-primary/50"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <article className="p-5">
                <p className="text-xs font-medium text-primary">{article.category}</p>
                <h2 className="mt-2 text-lg font-semibold leading-8 text-foreground">
                  {article.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">{article.excerpt}</p>
                <p className="mt-4 text-xs text-muted">
                  {article.readingMinutes} دقیقه مطالعه
                </p>
              </article>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}

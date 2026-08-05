// src/app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_ARTICLES, getBlogArticle } from "@/content/blog";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogArticle(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.keywords,
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: "article",
      images: [{ url: article.image, alt: article.imageAlt }],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getBlogArticle(slug);

  if (!article) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: article.image,
    datePublished: article.publishedAt,
    inLanguage: "fa-IR",
    author: {
      "@type": "Organization",
      name: "MAFID",
    },
  };

  return (
    <article className="section-glow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link href="/blog" className="text-sm text-muted transition-colors hover:text-foreground">
          آموزش ← بازگشت به همه مقاله‌ها
        </Link>
        <p className="mt-10 text-sm font-medium text-primary">{article.category}</p>
        <h1 className="mt-3 text-3xl font-bold leading-[1.7] tracking-tight text-foreground sm:text-5xl">
          {article.title}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-9 text-muted">{article.excerpt}</p>
        <p className="mt-5 text-sm text-muted">
          {article.readingMinutes} دقیقه مطالعه · {article.publishedAt}
        </p>

        <div className="relative mt-9 aspect-[16/8] overflow-hidden rounded-3xl border border-border">
          <Image src={article.image} alt={article.imageAlt} fill priority className="object-cover" />
        </div>

        <div className="article-copy mt-10 space-y-6 text-base leading-9">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <aside className="mt-12 rounded-2xl border border-warning/30 bg-warning/10 p-6 text-sm leading-8 text-warning">
          این مقاله آموزشی است و توصیه سرمایه‌گذاری، پیشنهاد خرید یا فروش و تضمین نتیجه نیست.
        </aside>
      </div>
    </article>
  );
}

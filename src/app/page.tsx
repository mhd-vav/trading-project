// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";

const PRODUCT_PILLARS = [
  {
    title: "ترمینال نموداری",
    description: "نمودارهای منبع‌محور، واچ‌لیست و زمینه بازار را در یک فضای کاری نگه دارید.",
    href: "/markets",
    image: "/images/sections/market-intelligence-hero.png",
  },
  {
    title: "میزهای هوش مصنوعی",
    description: "دیدگاه‌های مستقل را ببینید؛ اجماع و اختلاف هر دو بخشی از تحلیل هستند.",
    href: "/ai-desks",
    image: "/images/sections/ai-trading-desks.png",
  },
  {
    title: "ژورنال و مدیریت ریسک",
    description: "برنامه، اجرای معامله و بازخوردهای هفتگی را کنار هم ثبت و مرور کنید.",
    href: "/how-it-works",
    image: "/images/sections/trading-journal.png",
  },
];

const WORKFLOW_STEPS = [
  ["۱", "بازار را ببینید", "نمودار، خبرهای مرتبط، تقویم و نشست‌های بازار را در زمینه درست بررسی کنید."],
  ["۲", "شواهد را مقایسه کنید", "دیدگاه تکنیکال، کمی، ماکرو و احساسات را کنار هم بخوانید؛ نه در یک پاسخ سیاه‌جعبه‌ای."],
  ["۳", "فرآیند خود را ثبت کنید", "ایده، ریسک، اجرای معامله و نتیجه را در ژورنال نگه دارید تا از داده شخصی خود یاد بگیرید."],
];

const TRUST_POINTS = [
  "تحلیل آموزشی و توضیح‌پذیر؛ نه سیگنال تضمینی",
  "شفافیت منبع داده و وضعیت تأخیر",
  "فارسی‌اول، مناسب زمینه بازار و معامله‌گر ایرانی",
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="page-grid section-glow border-b border-border">
        <div className="mx-auto grid min-h-[42rem] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:px-8 lg:py-20">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_1rem_#10b981]" />
              هوش ماشین چندعاملی برای معامله‌گر منظم
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.5] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              بار شناختی بازار را کم کنید،
              <span className="block bg-gradient-to-l from-cyan-300 via-primary to-violet-400 bg-clip-text text-transparent">
                نه مسئولیت تصمیم را
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-9 text-muted">
              MAFID یک میز کار فارسی‌اول برای نمودار، خبر، تقویم، ژورنال و هوش ماشین است. چند عامل
              مستقل شواهد را بررسی می‌کنند تا شما به‌جای جابه‌جایی بین تب‌ها، یک فهم قابل مرور از
              زمینه بازار داشته باشید.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/app/terminal"
                className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary-hover"
              >
                ورود به ترمینال بازار
              </Link>
              <Link
                href="/how-it-works"
                className="rounded-xl border border-border bg-surface/80 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
              >
                نحوه کار مافید
              </Link>
            </div>
            <ul className="mt-9 space-y-3 text-sm text-muted">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/10 text-xs text-success">
                    ✓
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative min-h-80 overflow-hidden rounded-3xl border border-primary/20 bg-surface shadow-2xl shadow-black/30 lg:min-h-[31rem]">
            <Image
              src="/images/sections/machine-intelligence-network.png"
              alt="شبکه چندعاملی هوش ماشین و لایه‌های داده بازار"
              fill
              priority
              className="object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background/45" />
            <div className="absolute bottom-5 right-5 left-5 grid gap-3 sm:grid-cols-3">
              {[
                ["نمودار", "قابل‌محاسبه"],
                ["عامل‌ها", "مستقل"],
                ["خروجی", "قابل‌مرور"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-background/70 p-3 backdrop-blur-sm">
                  <p className="text-xs text-muted">{label}</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">یک سامانه، چند عامل مستقل</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            به‌جای یک پاسخ سیاه‌جعبه‌ای، مسیر استدلال را ببینید
          </h2>
          <p className="mt-4 leading-8 text-muted">
            هدف هوش ماشین جایگزینی معامله‌گر نیست. عامل‌های تکنیکال، کمی، ماکرو و احساسات، اطلاعات
            را مرتب می‌کنند تا سؤال درست، ریسک و اختلاف شواهد را سریع‌تر ببینید.
          </p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {PRODUCT_PILLARS.map((pillar) => (
            <Link
              key={pillar.title}
              href={pillar.href}
              className="group overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-primary/50"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={pillar.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{pillar.description}</p>
                <span className="mt-5 inline-block text-sm font-medium text-primary">بیشتر بدانید ←</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-glow border-y border-border bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">از آگاهی تا بازخورد</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              فرآیند، مهم‌تر از یک نتیجه است
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {WORKFLOW_STEPS.map(([number, title, description]) => (
              <article key={number} className="rounded-2xl border border-border bg-background/60 p-6">
                <span className="text-4xl font-bold text-primary/40">{number}</span>
                <h3 className="mt-5 text-xl font-semibold text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
        <div className="relative min-h-72 overflow-hidden rounded-3xl border border-border lg:min-h-96">
          <Image
            src="/images/sections/market-news-calendar.png"
            alt="نمای انتزاعی خبرهای بازار و تقویم اقتصادی"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-primary">زمان‌بندی و زمینه</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
            خبر و رویداد را کنار نمودار بخوانید
          </h2>
          <p className="mt-5 leading-8 text-muted">
            تقویم اقتصادی، نشست‌های بازار و خبرهای مرتبط به شما کمک می‌کنند زمان‌های افزایش ریسک
            را قبل از تصمیم‌گیری ببینید. داده‌های زنده و پریمیوم همیشه با منبع و سطح دسترسی روشن
            نمایش داده می‌شوند.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/news"
              className="rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
            >
              مشاهده خبرهای بازار
            </Link>
            <Link
              href="/calendar"
              className="rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
            >
              تقویم بازار
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-primary">شروع با زمینه، نه با عجله</p>
          <h2 className="mt-3 text-3xl font-bold text-foreground">
            میز کار خود را برای یادگیری منظم بسازید
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-muted">
            MAFID توصیه مالی، سیگنال تضمینی یا اجرای خودکار معامله ارائه نمی‌دهد. هر تحلیل صرفاً
            برای آموزش و پشتیبانی از تصمیم‌گیری شخصی است.
          </p>
          <Link
            href="/register"
            className="mt-7 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            ساخت حساب کاربری
          </Link>
        </div>
      </section>
    </div>
  );
}

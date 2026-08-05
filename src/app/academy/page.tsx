// src/app/academy/page.tsx
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "آکادمی مافید",
  description: "مسیرهای یادگیری ساختاریافته برای درک بازار، چارت و فرآیند معامله‌گری",
};

const learningPaths = [
  {
    level: "شروع",
    title: "نقشه بازار برای معامله‌گر",
    description: "از ساختار بازار، انواع داده و خواندن یک نمودار تا ساخت واچ‌لیست شخصی.",
    lessons: "۸ درس · ۲ تمرین",
    tone: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  },
  {
    level: "ساختار",
    title: "پرایس اکشن و پروفایل بازار",
    description: "کندل، هیکن‌آشی، رنکو، TPO و زمینه نقدشوندگی را به‌صورت کاربردی تمرین کنید.",
    lessons: "۱۲ درس · ۴ تمرین",
    tone: "border-violet-400/30 bg-violet-400/10 text-violet-300",
  },
  {
    level: "فرآیند",
    title: "ریسک، سناریو و ژورنال",
    description: "ایده را به سناریو، نقطه ابطال، اندازه ریسک و مرور پس از معامله تبدیل کنید.",
    lessons: "۱۰ درس · ۳ قالب کاری",
    tone: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  },
  {
    level: "هوشمندی",
    title: "کار با میزهای هوش ماشین",
    description: "یاد بگیرید شواهد، اختلاف عامل‌ها و عدم‌قطعیت را بدون وابستگی به خروجی AI بخوانید.",
    lessons: "۷ درس · ۳ گزارش نمونه",
    tone: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  },
];

const academyStructure = [
  ["درس کوتاه", "یک مفهوم مشخص با مثال بصری، بدون ادعای سیگنال یا سود."],
  ["تمرین روی چارت", "ابزارهای ترمینال را روی داده قابل مشاهده تمرین کنید."],
  ["مرور و ژورنال", "برداشت، سناریو و پرسش‌های باز خود را ثبت کنید."],
  ["سنجش مهارت", "چک‌لیست مفهومی برای تشخیص نقاط نیازمند تمرین بیشتر."],
];

export default function AcademyPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-border">
        <Image
          src="/images/sections/trading-academy-path.png"
          alt="مسیر بصری یادگیری تحلیل بازار، پروفایل قیمت و ژورنال معاملاتی"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/84 to-background/35" />
        <div className="relative mx-auto min-h-[31rem] max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
              آکادمی مافید
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-[1.45] text-foreground sm:text-5xl">
              یادگیری معامله‌گری، از مفهوم تا فرآیند قابل‌تمرین
            </h1>
            <p className="mt-5 text-base leading-8 text-muted">
              آکادمی برای جمع‌کردن اصطلاحات نیست. هر مسیر با یک سؤال بازار شروع می‌شود، روی چارت
              تمرین می‌شود و در ژورنال به بازخورد تبدیل می‌گردد.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/app/terminal"
                className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
              >
                شروع با ترمینال
              </Link>
              <Link
                href="/blog"
                className="rounded-xl border border-border bg-background/70 px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface"
              >
                خواندن مقاله‌ها
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary">مسیرهای یادگیری</p>
          <h2 className="mt-2 text-3xl font-semibold text-foreground">
            هر مرحله، یک مهارت قابل استفاده در فضای کاری
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {learningPaths.map((path) => (
            <article key={path.title} className="rounded-2xl border border-border bg-surface p-6">
              <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${path.tone}`}>
                {path.level}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-foreground">{path.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{path.description}</p>
              <p className="mt-5 text-xs text-muted">{path.lessons}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-medium text-primary">ساختار محتوا</p>
              <h2 className="mt-2 text-3xl font-semibold text-foreground">
                محتوا باید به تصمیم بهتر ختم شود، نه مصرف بیشتر
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted">
                هر درس کوتاه است، اما به یک تمرین واقعی در محیط مافید وصل می‌شود تا دانستن به یک
                عادت اجرایی تبدیل شود.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {academyStructure.map(([title, description], index) => (
                <article key={title} className="rounded-2xl border border-border bg-background/55 p-5">
                  <span className="text-3xl font-semibold text-primary/50">0{index + 1}</span>
                  <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-l from-primary/10 via-violet-500/10 to-surface p-7 sm:p-10">
          <p className="text-sm font-medium text-primary">روش آکادمی</p>
          <h2 className="mt-2 text-3xl font-semibold text-foreground">
            هوش ماشین جای تمرین شما را نمی‌گیرد
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-muted">
            گزارش‌های چندعاملی مافید برای کم‌کردن بار شناختی طراحی شده‌اند: اطلاعات را مرتب می‌کنند،
            اختلاف‌ها را آشکار می‌سازند و سؤال بعدی را روشن می‌کنند. مسئولیت ساخت فرضیه، مدیریت
            ریسک و تصمیم نهایی همچنان با شماست.
          </p>
        </div>
      </section>
    </div>
  );
}

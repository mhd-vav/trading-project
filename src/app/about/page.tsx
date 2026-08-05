// src/app/about/page.tsx
import Image from "next/image";

export const metadata = { title: "درباره مافید" };

const principles = [
  ["کاهش بار شناختی", "اطلاعات پراکنده باید به یک فضای کاری منظم، قابل مرور و قابل پرسش تبدیل شوند."],
  ["هوش ماشین، نه ابزار تزئینی", "عامل‌های مستقل مسئول یک نوع شواهد هستند و پاسخ نهایی باید مسیر خود را نشان دهد."],
  ["اختلاف، داده است", "تعارض بین میزها حذف نمی‌شود؛ به‌عنوان بخشی از عدم‌قطعیت بازار نمایش داده می‌شود."],
  ["کنترل با معامله‌گر", "مافید توصیه قطعی، اجرای خودکار یا تضمین نتیجه ارائه نمی‌دهد."],
];

export default function AboutPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative border-b border-border">
        <Image
          src="/images/sections/machine-intelligence-network.png"
          alt="شبکه عامل‌های هوش ماشین برای تحلیل بازار"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background/96 via-background/84 to-background/45" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">درباره مافید</p>
            <h1 className="mt-3 text-4xl font-bold leading-[1.45] text-foreground sm:text-5xl">
              بازار پیچیده است؛ رابط کاربری و هوش آن نباید پیچیدگی را پنهان کنند
            </h1>
            <p className="mt-5 text-base leading-8 text-muted">
              مافید برای کمک به فهم بازار طراحی شده است. ما داده، نمودار، خبر و تحلیل چندعاملی را
              کنار هم می‌گذاریم تا کاربر بتواند با فشار شناختی کمتر، فرآیند تصمیم‌گیری شفاف‌تری بسازد.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-medium text-primary">سامانه چندعاملی</p>
            <h2 className="mt-2 text-3xl font-semibold text-foreground">
              یک مدل واحد نمی‌تواند همه زمینه بازار را ببیند
            </h2>
            <p className="mt-4 text-sm leading-8 text-muted">
              در مافید، میزهای تکنیکال، کمی، ماکرو، احساسات، جریان سفارش و آن‌چین می‌توانند مستقل
              بررسی کنند. سپس یک لایه هماهنگ‌کننده، شواهد، درجه اطمینان و اختلاف‌ها را به یک گزارش
              قابل مرور تبدیل می‌کند.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map(([title, description], index) => (
              <article key={title} className="rounded-2xl border border-border bg-surface p-5">
                <span className="text-3xl font-semibold text-primary/45">0{index + 1}</span>
                <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

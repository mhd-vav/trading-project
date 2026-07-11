export const metadata = { title: "نحوه کار پلتفرم" };

const PRINCIPLES = [
  { title: "نمادمحور", desc: "پلتفرم حول نماد بازار سازمان‌دهی شده است؛ نه حول مقالات عمومی. هر تحلیل به یک نماد، بازار و مهر زمانی متصل است." },
  { title: "سه‌لایه", desc: "هر خروجی هوشمندی شامل تحلیل بازار، احساسات و اخبار است — بخش‌هایی از یک شیء واحد." },
  { title: "ساختاریافته", desc: "تحلیل‌ها داده‌های ساختاریافته‌اند، نه پست وبلاگ. شامل نوع، چارچوب زمانی، سطح اطمینان و منابع." },
  { title: "قابل‌فهم", desc: "توضیح اینکه چه چیزی تغییر کرد و چرا اهمیت دارد — ابزار پشتیبانی تصمیم، نه موتور قطعیت." },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">نحوه کار پلتفرم</h1>
      <p className="mt-4 text-lg text-muted">
        مافید یک سایت سیگنال یا پورتال محتوا نیست. یک سیستم هوشمندی بازار است که حول یک موتور تحلیل نمادمحور ساخته شده است.
      </p>

      <div className="mt-12 rounded-2xl border border-border bg-surface p-8 text-center">
        <p className="text-xl text-foreground">یک نماد وارد می‌شود ← سه خروجی هوشمندی هماهنگ دریافت می‌شود</p>
        <p className="mt-3 text-sm text-muted">تحلیل بازار · تحلیل احساسات · تحلیل اخبار</p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <div key={p.title} className="rounded-xl border border-border bg-surface p-6">
            <h3 className="mb-2 text-lg font-semibold text-primary">{p.title}</h3>
            <p className="text-sm text-muted">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-surface p-8">
        <h2 className="mb-4 text-xl font-semibold text-foreground">موقعیت‌سازی محصول</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>✓ محیط هوشمندی بازار پریمیوم</li>
          <li>✓ پلتفرم تحلیل قابل‌توضیح</li>
          <li>✓ ابزار پشتیبانی تصمیم ساختاریافته</li>
          <li>✓ محصول هوشمندی اشتراکی</li>
          <li>✗ خدمات سود تضمینی نیست</li>
          <li>✗ موتور مشاوره مالی مستقیم نیست</li>
          <li>✗ پلتفرم اسپم سیگنال نیست</li>
        </ul>
      </div>
    </div>
  );
}

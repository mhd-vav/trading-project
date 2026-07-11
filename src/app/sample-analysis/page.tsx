export const metadata = { title: "نمونه تحلیل" };

const SAMPLE = {
  symbol: "BTC/USDT",
  market: "کریپتو",
  date: "۱۴۰۴/۰۴/۱۰",
  layers: [
    { type: "تحلیل بازار", color: "text-primary", content: "ساختار قیمت در محدوده حمایت کلیدی تثبیت شده است. روند کوتاه‌مدت صعودی با شکست مقاومت محلی تأیید می‌شود. سناریوی بازگشت در صورت از دست دادن حمایت تعریف شده است." },
    { type: "تحلیل احساسات", color: "text-accent", content: "حالت جمعی خنثی به مثبت است. پوزیشن‌گیری لانگ افزایش یافته اما هنوز در محدوده افراطی نیست. مومنتوم نظرات رو به بهبود است." },
    { type: "تحلیل اخبار", color: "text-success", content: "رویدادهای اخیر شامل تصویب ETF و داده‌های تورمی مطلوب است. کاتالیزور بالقوه: سخنرانی آینده فدرال رزرو. تیترها حمایتی اما با احتیاط." },
  ],
};

export default function SampleAnalysisPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">نمونه تحلیل</h1>
      <p className="mt-4 text-lg text-muted">
        یک نمونه از خروجی هوشمندی سه‌لایه مافید برای نماد BTC/USDT.
      </p>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{SAMPLE.symbol}</h2>
            <p className="mt-1 text-sm text-muted">{SAMPLE.market}</p>
          </div>
          <span className="rounded-lg border border-border bg-surface-elevated px-4 py-2 text-sm text-muted">
            {SAMPLE.date}
          </span>
        </div>

        <div className="mt-6 space-y-6">
          {SAMPLE.layers.map((layer) => (
            <div key={layer.type} className="rounded-xl border border-border bg-surface-elevated p-6">
              <h3 className={`mb-2 text-lg font-semibold ${layer.color}`}>{layer.type}</h3>
              <p className="text-sm leading-relaxed text-foreground">{layer.content}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 border-t border-border pt-6 text-center text-xs text-muted">
          این یک نمونه نمایشی است. محتوای پریمیوم پس از ثبت‌نام و اشتراک قابل دسترسی است.
          مافید ارائه‌دهنده تحلیل و هوشمندی بازار است، نه مشاوره مالی مستقیم.
        </p>
      </div>
    </div>
  );
}

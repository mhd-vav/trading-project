import Link from "next/link";

export const metadata = { title: "جزئیات تحلیل" };

const ANALYSIS = {
  symbol: "BTC/USDT",
  market: "کریپتو",
  date: "۱۴۰۴/۰۴/۱۰",
  timeframe: "۴ ساعت",
  confidence: "متوسط",
  layers: [
    { type: "تحلیل بازار", color: "text-primary", content: "ساختار قیمت در محدوده حمایت کلیدی تثبیت شده است. روند کوتاه‌مدت صعودی با شکست مقاومت محلی تأیید می‌شود. سناریوی بازگشت در صورت از دست دادن حمایت تعریف شده است." },
    { type: "تحلیل احساسات", color: "text-accent", content: "حالت جمعی خنثی به مثبت است. پوزیشن‌گیری لانگ افزایش یافته اما هنوز در محدوده افراطی نیست. مومنتوم نظرات رو به بهبود است." },
    { type: "تحلیل اخبار", color: "text-success", content: "رویدادهای اخیر شامل تصویب ETF و داده‌های تورمی مطلوب است. کاتالیزور بالقوه: سخنرانی آینده فدرال رزرو. تیترها حمایتی اما با احتیاط." },
  ],
};

export default function AnalysisDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="space-y-6">
      <Link href="/app/analyses" className="text-sm text-muted hover:text-foreground">← بازگشت به تحلیل‌ها</Link>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{ANALYSIS.symbol}</h1>
            <p className="mt-1 text-sm text-muted">{ANALYSIS.market}</p>
          </div>
          <div className="flex gap-2">
            <span className="rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-xs text-muted">چارچوب: {ANALYSIS.timeframe}</span>
            <span className="rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-xs text-muted">اطمینان: {ANALYSIS.confidence}</span>
            <span className="rounded-lg border border-border bg-surface-elevated px-3 py-1.5 text-xs text-muted">{ANALYSIS.date}</span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {ANALYSIS.layers.map((layer) => (
            <div key={layer.type} className="rounded-xl border border-border bg-surface-elevated p-5">
              <h2 className={`mb-2 font-semibold ${layer.color}`}>{layer.type}</h2>
              <p className="text-sm leading-relaxed text-foreground">{layer.content}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-muted">
        مافید ارائه‌دهنده تحلیل و هوشمندی بازار است، نه مشاوره مالی مستقیم.
      </p>
    </div>
  );
}

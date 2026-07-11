import Link from "next/link";

export const metadata = { title: "صفحه نماد" };

const LAYERS = [
  { type: "تحلیل بازار", color: "text-primary", summary: "روند صعودی کوتاه‌مدت، تثبیت روی حمایت." },
  { type: "تحلیل احساسات", color: "text-accent", summary: "حالت جمعی خنثی به مثبت." },
  { type: "تحلیل اخبار", color: "text-success", summary: "رویدادهای حمایتی، کاتالیزور قریب‌الوقوع." },
];

const HISTORY = [
  { date: "۱۴۰۴/۰۴/۱۰", type: "تحلیل بازار" },
  { date: "۱۴۰۴/۰۴/۰۸", type: "تحلیل احساسات" },
  { date: "۱۴۰۴/۰۴/۰۶", type: "تحلیل اخبار" },
  { date: "۱۴۰۴/۰۴/۰۴", type: "تحلیل بازار" },
];

export default async function SymbolPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const display = symbol.replace("-", "/");

  return (
    <div className="space-y-6">
      <Link href="/app/symbols" className="text-sm text-muted hover:text-foreground">← بازگشت به نمادها</Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl font-bold text-foreground">{display}</h1>
          <p className="mt-1 text-sm text-muted">کریپتو</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">افزودن به واچ‌لیست ★</button>
          <Link href="/app/requests" className="rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground hover:bg-surface-elevated">درخواست تحلیل عمیق</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {LAYERS.map((layer) => (
          <div key={layer.type} className="rounded-xl border border-border bg-surface p-5">
            <h3 className={`mb-2 font-semibold ${layer.color}`}>{layer.type}</h3>
            <p className="text-sm text-muted">{layer.summary}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-semibold text-foreground">تاریخچه تحلیل‌ها</h2>
        <div className="space-y-2">
          {HISTORY.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-lg border border-border bg-surface-elevated px-4 py-3">
              <span className="text-sm text-foreground">{item.type}</span>
              <span className="text-xs text-muted">{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

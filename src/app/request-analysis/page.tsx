import Link from "next/link";

export const metadata = { title: "درخواست تحلیل اختصاصی" };

export default function RequestAnalysisPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">درخواست تحلیل اختصاصی</h1>
      <p className="mt-4 text-muted">
        تحلیل اختصاصی برای نماد موردنظر خود درخواست کنید. خروجی از طریق ایمیل و پیامک تحویل داده می‌شود.
      </p>

      <form className="mt-10 space-y-5 rounded-2xl border border-border bg-surface p-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">نماد</label>
            <input
              type="text"
              dir="ltr"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
              placeholder="BTC/USDT"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">بازار</label>
            <select className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:border-primary focus:outline-none">
              <option>فارکس</option>
              <option>کریپتو</option>
              <option>سهام آمریکا</option>
            </select>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">یادداشت / سوال (اختیاری)</label>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
            placeholder="توضیح بیشتر درباره درخواست شما"
          />
        </div>
        <button
          type="button"
          className="w-full rounded-lg bg-primary py-2.5 font-medium text-white transition-colors hover:bg-primary-hover"
        >
          ثبت درخواست
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        کاربر جدید؟{" "}
        <Link href="/register" className="text-primary hover:text-primary-hover">ابتدا ثبت‌نام کنید</Link>
      </p>
    </div>
  );
}

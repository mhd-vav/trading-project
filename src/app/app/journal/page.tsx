export const metadata = { title: "ژورنال معاملاتی" };

export default function JournalPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ژورنال معاملاتی</h1>
          <p className="mt-1 text-sm text-muted">یادداشت‌ها، تز و نتایج معاملات شما</p>
        </div>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">یادداشت جدید</button>
      </div>

      <div className="rounded-xl border border-border bg-surface p-8 text-center text-muted">
        <p className="text-sm">هنوز یادداشتی ثبت نشده است.</p>
        <p className="mt-2 text-xs">تز ورود/خروج، یادداشت‌های احساسی و نتایج را ثبت کنید تا ارزش اشتراک خود را افزایش دهید.</p>
      </div>
    </div>
  );
}

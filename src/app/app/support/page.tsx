export const metadata = { title: "پشتیبانی" };

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">پشتیبانی</h1>
        <p className="mt-1 text-sm text-muted">راهنما، پشتیبانی و دستیار</p>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-semibold text-foreground">دستیار راهنما</h2>
        <div className="rounded-lg border border-border bg-surface-elevated p-4 text-sm text-muted">
          برای پیمایش سایت، توضیح پلن، راهنمایی حساب یا صورتحساب می‌توانید بپرسید. این دستیار از دانش تأییدشده سایت پاسخ می‌دهد و مشاوره مالی ارائه نمی‌دهد.
        </div>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="سوال خود را بنویسید..."
            className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
          />
          <button className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-hover">ارسال</button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-3 font-semibold text-foreground">تماس مستقیم</h2>
        <p className="text-sm text-muted">برای مسائل پیچیده‌تر از طریق صفحه تماس با ما در ارتباط باشید.</p>
      </div>
    </div>
  );
}

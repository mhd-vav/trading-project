export const metadata = { title: "تماس با ما" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">تماس با ما</h1>
      <p className="mt-4 text-muted">برای سوالات، پشتیبانی یا همکاری با ما در ارتباط باشید.</p>

      <form className="mt-10 space-y-5 rounded-2xl border border-border bg-surface p-8">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">نام</label>
          <input
            type="text"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
            placeholder="نام شما"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">ایمیل</label>
          <input
            type="email"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">پیام</label>
          <textarea
            rows={5}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
            placeholder="پیام شما"
          />
        </div>
        <button
          type="button"
          className="w-full rounded-lg bg-primary py-2.5 font-medium text-white transition-colors hover:bg-primary-hover"
        >
          ارسال پیام
        </button>
      </form>
    </div>
  );
}

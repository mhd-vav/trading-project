export const metadata = { title: "خبرنامه" };

export default function NewsletterPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">خبرنامه هوشمندی بازار</h1>
      <p className="mt-4 text-muted">خلاصه هفتگی هوشمندی بازار را در ایمیل خود دریافت کنید.</p>

      <form className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-surface p-8 sm:flex-row">
        <input
          type="email"
          dir="ltr"
          className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
          placeholder="email@example.com"
        />
        <button
          type="button"
          className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white transition-colors hover:bg-primary-hover"
        >
          عضویت
        </button>
      </form>
    </div>
  );
}

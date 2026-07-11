import Link from "next/link";

export const metadata = { title: "ثبت‌نام" };

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-20 sm:px-6">
      <div className="rounded-2xl border border-border bg-surface p-8">
        <h1 className="text-2xl font-bold text-foreground">ثبت‌نام</h1>
        <p className="mt-2 text-sm text-muted">با شماره موبایل ثبت‌نام کنید و یک تحلیل رایگان دریافت کنید.</p>

        <form className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">شماره موبایل</label>
            <input
              type="tel"
              dir="ltr"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
              placeholder="09xxxxxxxxx"
            />
          </div>
          <button
            type="button"
            className="w-full rounded-lg bg-primary py-2.5 font-medium text-white transition-colors hover:bg-primary-hover"
          >
            ارسال کد تأیید
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          حساب دارید؟{" "}
          <Link href="/login" className="text-primary hover:text-primary-hover">ورود</Link>
        </p>
      </div>
    </div>
  );
}

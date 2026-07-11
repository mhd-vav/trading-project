import Link from "next/link";

export const metadata = { title: "ورود" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-20 sm:px-6">
      <div className="rounded-2xl border border-border bg-surface p-8">
        <h1 className="text-2xl font-bold text-foreground">ورود</h1>
        <p className="mt-2 text-sm text-muted">با شماره موبایل و کد یکبارمصرف وارد شوید.</p>

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
            دریافت کد یکبارمصرف
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          حساب ندارید؟{" "}
          <Link href="/register" className="text-primary hover:text-primary-hover">ثبت‌نام کنید</Link>
        </p>
      </div>
    </div>
  );
}

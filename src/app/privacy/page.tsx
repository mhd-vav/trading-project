export const metadata = { title: "حریم خصوصی" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">حریم خصوصی</h1>
      <div className="mt-8 space-y-6 text-muted">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">جمع‌آوری داده</h2>
          <p className="text-sm leading-relaxed">مافید اطلاعات لازم برای ارائه خدمت را جمع‌آوری می‌کند: شماره موبایل، کد ملی (برای تأیید هویت پرداختی) و داده‌های پرداخت.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">استفاده از داده</h2>
          <p className="text-sm leading-relaxed">داده‌ها صرفاً برای ارائه خدمت، تأیید هویت، پردازش پرداخت و بهبود پلتفرم استفاده می‌شوند.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">امنیت</h2>
          <p className="text-sm leading-relaxed">فیلدهای حساس رمزگذاری می‌شوند. کنترل دسترسی مبتنی بر نقش اعمال می‌شود و عملیات‌های حساس در لاگ ممیزی ثبت می‌گردند.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">حقوق کاربر</h2>
          <p className="text-sm leading-relaxed">کاربر می‌تواند وضعیت تأیید هویت، نشست‌ها و دستگاه‌های فعال خود را مشاهده و نشست‌ها را باطل کند.</p>
        </section>
      </div>
    </div>
  );
}

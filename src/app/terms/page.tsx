export const metadata = { title: "قوانین و مقررات" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">قوانین و مقررات</h1>
      <div className="mt-8 space-y-6 text-muted">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">ماهیت خدمت</h2>
          <p className="text-sm leading-relaxed">پلتفرم مافید ارائه‌دهنده تحلیل و هوشمندی بازار است. محتوای این پلتفرم مشاوره مالی مستقیم، پیشنهاد سرمایه‌گذاری یا سیگنال معاملاتی نیست.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">مسئولیت کاربر</h2>
          <p className="text-sm leading-relaxed">کاربر مسئول تصمیمات سرمایه‌گذاری خود است. تحلیل‌ها صرفاً جنبه اطلاع‌رسانی و پشتیبانی تصمیم دارند.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">اشتراک و پرداخت</h2>
          <p className="text-sm leading-relaxed">اشتراک‌ها به مدت مشخص ارائه می‌شوند. کارت بانکی استفاده‌شده باید متعلق به کاربر و منطبق با هویت تأییدشده باشد.</p>
        </section>
        <section>
          <h2 className="mb-2 text-lg font-semibold text-foreground">حساب کاربری</h2>
          <p className="text-sm leading-relaxed">کاربر موظف است اطلاعات صحیح ارائه دهد و امنیت حساب خود را حفظ کند. دسترسی غیرمجاز موجب مسدودی حساب می‌شود.</p>
        </section>
      </div>
    </div>
  );
}

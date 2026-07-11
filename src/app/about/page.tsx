export const metadata = { title: "درباره مافید" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">درباره مافید</h1>
      <div className="mt-8 space-y-6 text-muted">
        <p className="text-sm leading-relaxed">مافید یک پلتفرم هوشمندی بازار پریمیوم است که حول یک موتور تحلیل نمادمحور ساخته شده است. هدف ما کمک به درک بازار از طریق تحلیل ساختاریافته، زمینه، تفسیر و پایش است.</p>
        <p className="text-sm leading-relaxed">ما به جای ارائه سیگنال یا محتوای عمومی، هر نماد را از سه زاویه تحلیل می‌کنیم: بازار، احساسات و اخبار — و آن‌ها را در یک خروجی هوشمندی هماهنگ ترکیب می‌کنیم.</p>
        <p className="text-sm leading-relaxed">پلتفرم به‌صورت وب ارائه می‌شود اما از روز اول برای توسعه اپلیکیشن موبایل آینده طراحی شده است.</p>
      </div>
    </div>
  );
}

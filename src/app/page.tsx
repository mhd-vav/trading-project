import Link from "next/link";

const LAYERS = [
  {
    key: "market",
    title: "تحلیل بازار",
    desc: "ساختار قیمت، روند، تفسیر تکنیکال و منطق سناریوها",
    icon: "📊",
  },
  {
    key: "sentiment",
    title: "تحلیل احساسات",
    desc: "حالت جمعی، پوزیشن‌گیری، لحن و مومنتوم نظرات",
    icon: "🌐",
  },
  {
    key: "news",
    title: "تحلیل اخبار",
    desc: "رویدادها، تحولات، کاتالیزورها و تفسیر تیترها",
    icon: "📰",
  },
];

const SYMBOLS = ["EUR/USD", "BTC/USDT", "AAPL", "XAU/USD"];

const STEPS = [
  { num: "۱", title: "انتخاب نماد", desc: "نماد بازار موردنظر خود را جستجو یا انتخاب کنید" },
  { num: "۲", title: "تحلیل خودکار", desc: "موتور هوشمندی، نماد را از سه زاویه تحلیل می‌کند" },
  { num: "۳", title: "دریافت هوشمندی", desc: "خروجی هماهنگ: بازار، احساسات و اخبار در یک گزارش" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-muted">
              <span className="h-2 w-2 rounded-full bg-success" />
              هوشمندی بازار، نه سیگنال
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              یک نماد وارد کنید،
              <br />
              <span className="text-primary">سه خروجی هوشمندی</span> دریافت کنید
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
              پلتفرم هوشمندی بازار مافید، هر نماد را از سه زاویه تحلیل می‌کند: بازار، احساسات و اخبار —
              هماهنگ، ساختاریافته و قابل‌فهم.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="w-full rounded-lg bg-primary px-8 py-3 text-center font-medium text-white transition-colors hover:bg-primary-hover sm:w-auto"
              >
                شروع رایگان
              </Link>
              <Link
                href="/how-it-works"
                className="w-full rounded-lg border border-border bg-surface px-8 py-3 text-center font-medium text-foreground transition-colors hover:bg-surface-elevated sm:w-auto"
              >
                نحوه کار
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {SYMBOLS.map((symbol) => (
                <span
                  key={symbol}
                  className="rounded-lg border border-border bg-surface px-4 py-1.5 font-mono text-sm text-muted"
                >
                  {symbol}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Three Layers */}
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              تحلیل سه‌لایه هماهنگ
            </h2>
            <p className="mt-4 text-muted">
              هر خروجی، بخشی از یک شیء هوشمندی واحد است؛ نه مقاله‌ای مجزا.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {LAYERS.map((layer) => (
              <div
                key={layer.key}
                className="rounded-2xl border border-border bg-surface p-8 transition-colors hover:bg-surface-elevated"
              >
                <div className="mb-4 text-4xl">{layer.icon}</div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">{layer.title}</h3>
                <p className="text-sm text-muted">{layer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-border bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              سه گام تا هوشمندی
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.num} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                  {step.num}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            به محیط هوشمندی بازار بپیوندید
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            ثبت‌نام با شماره موبایل و تأیید OTP. یک تحلیل کامل رایگان دریافت کنید.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-primary px-8 py-3 font-medium text-white transition-colors hover:bg-primary-hover"
          >
            ثبت‌نام رایگان
          </Link>
        </div>
      </section>
    </div>
  );
}

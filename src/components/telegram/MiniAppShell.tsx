// src/components/telegram/MiniAppShell.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MARKET_INSTRUMENTS } from "@/lib/market/catalog";

type MiniAppView = "home" | "markets" | "ai" | "account";
type TelegramSessionState = "loading" | "authenticated" | "browser" | "rejected";

type TelegramWebApp = {
  initData: string;
  colorScheme: "light" | "dark";
  ready: () => void;
  expand: () => void;
};

type TelegramAuthResponse = {
  authenticated: boolean;
  user: {
    id: number;
    firstName: string;
    lastName: string | null;
    username: string | null;
    languageCode: string | null;
  };
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

const NAVIGATION_ITEMS: Array<{
  id: MiniAppView;
  label: string;
  icon: string;
}> = [
  { id: "home", label: "خانه", icon: "⌂" },
  { id: "markets", label: "بازارها", icon: "⌁" },
  { id: "ai", label: "میز هوشمند", icon: "✦" },
  { id: "account", label: "حساب", icon: "◉" },
];

function userDisplayName(session: TelegramAuthResponse | null) {
  if (!session) {
    return "کاربر مهمان";
  }

  return [session.user.firstName, session.user.lastName].filter(Boolean).join(" ");
}

function sourceStatusLabel(availability: "available" | "provider_required") {
  return availability === "available" ? "آماده مشاهده" : "در انتظار اتصال";
}

export default function MiniAppShell() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<MiniAppView>("home");
  const [sessionState, setSessionState] = useState<TelegramSessionState>("loading");
  const [session, setSession] = useState<TelegramAuthResponse | null>(null);

  useEffect(() => {
    const telegramWebApp = window.Telegram?.WebApp;
    if (!telegramWebApp) {
      const previewTimer = window.setTimeout(() => {
        setSessionState("browser");
      }, 0);

      return () => window.clearTimeout(previewTimer);
    }

    telegramWebApp.ready();
    telegramWebApp.expand();
    document.documentElement.dataset.theme = telegramWebApp.colorScheme;
    const initData = telegramWebApp.initData;

    if (!initData) {
      const rejectedTimer = window.setTimeout(() => {
        setSessionState("rejected");
      }, 0);

      return () => window.clearTimeout(rejectedTimer);
    }

    const controller = new AbortController();

    async function authenticateMiniApp() {
      try {
        const response = await fetch("/api/telegram/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData }),
          signal: controller.signal,
        });
        const payload: unknown = await response.json().catch(() => null);

        if (
          !response.ok ||
          !payload ||
          typeof payload !== "object" ||
          !("authenticated" in payload) ||
          payload.authenticated !== true ||
          !("user" in payload)
        ) {
          throw new Error("Telegram authentication failed.");
        }

        setSession(payload as TelegramAuthResponse);
        setSessionState("authenticated");
      } catch {
        if (!controller.signal.aborted) {
          setSessionState("rejected");
        }
      }
    }

    void authenticateMiniApp();

    return () => controller.abort();
  }, []);

  function openWorkspace(path: string) {
    router.push(path);
  }

  const authenticated = sessionState === "authenticated";
  const isBrowserPreview = sessionState === "browser";

  return (
    <div className="min-h-screen bg-background pb-24 text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary">MAFID</p>
            <h1 className="mt-1 text-base font-semibold text-foreground">همراه بازار شما</h1>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                authenticated ? "bg-success" : sessionState === "loading" ? "bg-warning" : "bg-muted"
              }`}
              aria-hidden="true"
            />
            <span className="max-w-32 truncate text-xs text-muted">{userDisplayName(session)}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-5 px-4 py-5">
        {isBrowserPreview ? (
          <section className="rounded-2xl border border-primary/25 bg-primary/10 p-4 text-sm leading-7 text-primary">
            این پیش‌نمایش مرورگر است. پس از باز کردن برنامه از تلگرام، هویت حساب با داده امضاشده
            تلگرام تأیید می‌شود.
          </section>
        ) : null}

        {sessionState === "rejected" ? (
          <section className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-sm leading-7 text-danger">
            تأیید نشست تلگرام انجام نشد. برنامه را از دکمه رسمی ربات دوباره باز کنید.
          </section>
        ) : null}

        {activeView === "home" ? (
          <>
            <section className="overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-bl from-primary/20 via-surface to-surface p-5">
              <p className="text-sm text-primary">اتاق کنترل شخصی</p>
              <h2 className="mt-2 text-2xl font-bold leading-10 text-foreground">
                بازار را با زمینه، نه با عجله دنبال کنید
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                دیده‌بان نمادها، میزهای تحلیلی و تنظیمات حساب در یک فضای ساده و موبایل‌محور.
              </p>
              <button
                type="button"
                onClick={() => openWorkspace("/app/terminal?symbol=BTCUSD")}
                className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                باز کردن ترمینال BTC/USD
              </button>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveView("ai")}
                className="rounded-2xl border border-border bg-surface p-4 text-right transition-colors hover:border-primary/50"
              >
                <span className="text-xl text-accent">✦</span>
                <span className="mt-3 block text-sm font-semibold text-foreground">میزهای هوشمند</span>
                <span className="mt-1 block text-xs leading-6 text-muted">تحلیل چنددیدگاهی</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView("markets")}
                className="rounded-2xl border border-border bg-surface p-4 text-right transition-colors hover:border-primary/50"
              >
                <span className="text-xl text-success">⌁</span>
                <span className="mt-3 block text-sm font-semibold text-foreground">دیده‌بان بازار</span>
                <span className="mt-1 block text-xs leading-6 text-muted">انتخاب نماد و منبع</span>
              </button>
            </section>

            <section className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-foreground">وضعیت اتصال</h2>
                  <p className="mt-1 text-xs leading-6 text-muted">
                    داده‌های بازار و خبر فقط از سرویس‌های پیکربندی‌شده خوانده می‌شوند.
                  </p>
                </div>
                <span className="rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-muted">
                  API آماده اتصال
                </span>
              </div>
            </section>
          </>
        ) : null}

        {activeView === "markets" ? (
          <section>
            <div>
              <p className="text-sm text-primary">دیده‌بان</p>
              <h2 className="mt-1 text-xl font-bold text-foreground">بازار موردنظر را انتخاب کنید</h2>
              <p className="mt-2 text-sm leading-7 text-muted">
                برای نمودار، خبر و گزارش، وارد ترمینال کامل هر نماد شوید.
              </p>
            </div>
            <div className="mt-4 space-y-3">
              {MARKET_INSTRUMENTS.map((instrument) => (
                <button
                  key={instrument.symbol}
                  type="button"
                  onClick={() => openWorkspace(`/app/terminal?symbol=${instrument.symbol}`)}
                  className="flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 text-right transition-colors hover:border-primary/50"
                >
                  <span>
                    <span dir="ltr" className="block text-base font-semibold text-foreground">
                      {instrument.label}
                    </span>
                    <span className="mt-1 block text-xs text-muted">{instrument.sourceLabel}</span>
                  </span>
                  <span
                    className={`rounded-lg px-2.5 py-1 text-[11px] ${
                      instrument.availability === "available"
                        ? "bg-success/10 text-success"
                        : "bg-warning/10 text-warning"
                    }`}
                  >
                    {sourceStatusLabel(instrument.availability)}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {activeView === "ai" ? (
          <section className="space-y-4">
            <div className="rounded-3xl border border-accent/30 bg-gradient-to-bl from-accent/10 via-surface to-surface p-5">
              <p className="text-sm text-accent">Machine Intelligence</p>
              <h2 className="mt-2 text-xl font-bold text-foreground">میزهای تحلیل را با شفافیت بررسی کنید</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                نتیجه، سناریوها و اختلاف نظر میزها در فضای ترمینال کامل نمایش داده می‌شود؛ هیچ
                خروجی به‌عنوان توصیه خرید یا فروش ارائه نمی‌شود.
              </p>
              <button
                type="button"
                onClick={() => openWorkspace("/app/ai-desks")}
                className="mt-5 w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-slate-950 transition-colors hover:brightness-110"
              >
                ورود به میزهای هوشمند
              </button>
            </div>
            <section className="rounded-2xl border border-border bg-surface p-4">
              <h3 className="font-semibold text-foreground">محدوده MVP</h3>
              <p className="mt-2 text-sm leading-7 text-muted">
                انتخاب نماد، ساخت درخواست و دریافت گزارش از همان موتور تحلیل وب انجام می‌شود.
                سطح دسترسی نهایی در سرور و بر اساس اشتراک کنترل خواهد شد.
              </p>
            </section>
          </section>
        ) : null}

        {activeView === "account" ? (
          <section className="space-y-4">
            <div className="rounded-3xl border border-primary/25 bg-surface p-5">
              <p className="text-sm text-primary">حساب مافید</p>
              <h2 className="mt-2 text-xl font-bold text-foreground">{userDisplayName(session)}</h2>
              <p className="mt-2 text-sm leading-7 text-muted">
                {authenticated
                  ? "هویت تلگرامی شما تأیید شده است. اتصال آن به حساب مافید در سرویس حساب انجام می‌شود."
                  : "برای مشاهده اطلاعات واقعی حساب، برنامه را از داخل ربات تلگرام باز کنید."}
              </p>
              <button
                type="button"
                onClick={() => openWorkspace("/app/profile")}
                className="mt-5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
              >
                مدیریت حساب و ترجیحات
              </button>
            </div>
            <section className="rounded-2xl border border-border bg-surface p-4">
              <h3 className="font-semibold text-foreground">ارجاع و اشتراک</h3>
              <p className="mt-2 text-sm leading-7 text-muted">
                پیگیری دعوت‌ها و پاداش اشتراک از مرکز ارجاع انجام می‌شود.
              </p>
              <button
                type="button"
                onClick={() => openWorkspace("/app/referrals")}
                className="mt-4 text-sm font-semibold text-primary"
              >
                باز کردن مرکز ارجاع
              </button>
            </section>
          </section>
        ) : null}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-3 py-2 backdrop-blur">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={`rounded-xl px-2 py-2 text-center transition-colors ${
                  isActive ? "bg-primary/15 text-primary" : "text-muted hover:text-foreground"
                }`}
              >
                <span className="block text-lg leading-5">{item.icon}</span>
                <span className="mt-1 block text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

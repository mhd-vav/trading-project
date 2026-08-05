// src/components/account/ProfileCenter.tsx
"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type {
  AccountApiEnvelope,
  AccountProfile,
  ProfilePayload,
  UpdateAccountProfileInput,
  VerificationStatus,
} from "@/lib/account/contracts";
import { isAccountApiEnvelope } from "@/lib/account/contracts";

type LoadState = "loading" | "ready" | "setup" | "error";

const verificationLabels: Record<VerificationStatus, string> = {
  verified: "تأیید شده",
  pending: "در حال بررسی",
  not_started: "انجام نشده",
  rejected: "نیازمند پیگیری",
};

const verificationClasses: Record<VerificationStatus, string> = {
  verified: "border-success/30 bg-success/10 text-success",
  pending: "border-warning/30 bg-warning/10 text-warning",
  not_started: "border-border bg-surface-elevated text-muted",
  rejected: "border-danger/30 bg-danger/10 text-danger",
};

function getEnvelope<TData>(value: unknown): AccountApiEnvelope<TData> | null {
  return isAccountApiEnvelope<TData>(value) ? value : null;
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function profileInitial(profile: AccountProfile) {
  const displayValue = profile.displayName || profile.phone || "م";
  return displayValue.trim().slice(0, 1);
}

function checkboxClass(active: boolean) {
  return active
    ? "border-primary bg-primary/10 text-primary"
    : "border-border bg-background text-muted hover:border-primary/50";
}

export default function ProfileCenter() {
  const [state, setState] = useState<LoadState>("loading");
  const [payload, setPayload] = useState<ProfilePayload | null>(null);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [selectedMarkets, setSelectedMarkets] = useState<
    AccountProfile["preferences"]["markets"]
  >([]);
  const [selectedTradingStyles, setSelectedTradingStyles] = useState<
    AccountProfile["preferences"]["tradingStyle"]
  >([]);

  const profile = payload?.profile ?? null;
  const currentSession = useMemo(
    () => payload?.sessions.find((session) => session.current) ?? null,
    [payload],
  );

  async function loadProfile() {
    setState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/account/profile", { cache: "no-store" });
      const responsePayload: unknown = await response.json().catch(() => null);
      const envelope = getEnvelope<ProfilePayload>(responsePayload);

      if (!response.ok || !envelope) {
        setState("error");
        setMessage("دریافت اطلاعات حساب با مشکل روبه‌رو شد. دوباره تلاش کنید.");
        return;
      }

      if (!envelope.configured || !envelope.data) {
        setState("setup");
        setPayload(null);
        setMessage(
          envelope.message ||
            "برای نمایش اطلاعات واقعی حساب، سرویس Account API را در محیط اجرا متصل کنید.",
        );
        return;
      }

      setPayload(envelope.data);
      setState("ready");
    } catch {
      setState("error");
      setMessage("اتصال به سرویس حساب برقرار نشد. دوباره تلاش کنید.");
    }
  }

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadProfile();
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, []);

  function toggleEditing() {
    if (!profile) {
      return;
    }

    if (!isEditing) {
      setSelectedMarkets(profile.preferences.markets);
      setSelectedTradingStyles(profile.preferences.tradingStyle);
    }

    setIsEditing((currentValue) => !currentValue);
  }

  function toggleMarket(market: AccountProfile["preferences"]["markets"][number]) {
    setSelectedMarkets((currentMarkets) =>
      currentMarkets.includes(market)
        ? currentMarkets.filter((currentMarket) => currentMarket !== market)
        : [...currentMarkets, market],
    );
  }

  function toggleTradingStyle(
    tradingStyle: AccountProfile["preferences"]["tradingStyle"][number],
  ) {
    setSelectedTradingStyles((currentStyles) =>
      currentStyles.includes(tradingStyle)
        ? currentStyles.filter((currentStyle) => currentStyle !== tradingStyle)
        : [...currentStyles, tradingStyle],
    );
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!profile) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const displayNameValue = String(formData.get("displayName") || "").trim();
    const update: UpdateAccountProfileInput = {
      displayName: displayNameValue || null,
      preferences: {
        locale: String(formData.get("locale")) === "en-US" ? "en-US" : "fa-IR",
        timezone: String(formData.get("timezone") || profile.preferences.timezone),
        markets: selectedMarkets,
        tradingStyle: selectedTradingStyles,
        newsletterEnabled: Boolean(formData.get("newsletterEnabled")),
        telegramLinked: Boolean(formData.get("telegramLinked")),
      },
    };

    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      const responsePayload: unknown = await response.json().catch(() => null);
      const envelope = getEnvelope<ProfilePayload>(responsePayload);

      if (!response.ok || !envelope?.configured || !envelope.data) {
        setMessage(
          envelope?.message ||
            "ذخیره‌سازی انجام نشد. اتصال سرویس حساب و اطلاعات واردشده را بررسی کنید.",
        );
        return;
      }

      setPayload(envelope.data);
      setIsEditing(false);
      setMessage("تنظیمات حساب ذخیره شد.");
    } catch {
      setMessage("ذخیره‌سازی تنظیمات با خطا روبه‌رو شد. دوباره تلاش کنید.");
    } finally {
      setIsSaving(false);
    }
  }

  async function revokeOtherSessions() {
    if (!profile) {
      return;
    }

    setIsRevoking(true);
    setMessage("");

    try {
      const response = await fetch("/api/account/sessions/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const responsePayload: unknown = await response.json().catch(() => null);
      const envelope = getEnvelope<ProfilePayload>(responsePayload);

      if (!response.ok || !envelope?.configured || !envelope.data) {
        setMessage(
          envelope?.message || "خروج از نشست‌های دیگر انجام نشد. دوباره تلاش کنید.",
        );
        return;
      }

      setPayload(envelope.data);
      setMessage("تمام نشست‌های دیگر باطل شدند.");
    } catch {
      setMessage("درخواست ابطال نشست‌ها با خطا روبه‌رو شد. دوباره تلاش کنید.");
    } finally {
      setIsRevoking(false);
    }
  }

  if (state === "loading") {
    return (
      <div className="space-y-6" aria-busy="true">
        <div className="h-28 animate-pulse rounded-2xl border border-border bg-surface" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="h-96 animate-pulse rounded-2xl border border-border bg-surface" />
          <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface" />
        </div>
      </div>
    );
  }

  if (state === "setup" || state === "error" || !profile) {
    const isSetup = state === "setup";

    return (
      <section className="rounded-2xl border border-dashed border-border bg-surface p-6 sm:p-8">
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
            isSetup
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-danger/30 bg-danger/10 text-danger"
          }`}
        >
          {isSetup ? "اتصال حساب آماده توسعه" : "خطای اتصال"}
        </span>
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          {isSetup ? "مرکز حساب در انتظار اتصال سرویس است" : "اطلاعات حساب فعلاً در دسترس نیست"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          {message}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          این صفحه داده ساختگی نمایش نمی‌دهد. پس از تنظیم <span dir="ltr">ACCOUNT_API_URL</span>،
          پروفایل، تأییدها، ترجیحات و نشست‌های واقعی شما در همین بخش قابل مدیریت خواهند بود.
        </p>
        <button
          type="button"
          onClick={() => void loadProfile()}
          className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          تلاش دوباره
        </button>
      </section>
    );
  }

  const activePayload = payload;

  if (!activePayload) {
    return null;
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-l from-primary/10 via-surface to-surface">
        <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-2xl font-bold text-primary">
              {profileInitial(profile)}
            </div>
            <div>
              <p className="text-sm text-primary">مرکز حساب</p>
              <h1 className="mt-1 text-2xl font-bold text-foreground">
                {profile.displayName || "نام نمایشی ثبت نشده"}
              </h1>
              <p className="mt-1 text-sm text-muted" dir="ltr">
                {profile.phone}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background/50 px-4 py-3">
            <p className="text-xs text-muted">وضعیت دسترسی</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {profile.membership.planName || "بدون اشتراک فعال"}
            </p>
            <p className="mt-1 text-xs text-muted">
              پایان دسترسی: {formatDate(profile.membership.expiresAt)}
            </p>
          </div>
        </div>
      </section>

      {message ? (
        <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {message}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-surface p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">شناسه و تأیید حساب</h2>
                <p className="mt-1 text-sm text-muted">
                  اطلاعات حساس در این صفحه نمایش داده یا ویرایش نمی‌شوند.
                </p>
              </div>
              <Link
                href="/app/billing"
                className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
              >
                مدیریت اشتراک
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-background/60 p-4">
                <p className="text-xs text-muted">شماره همراه</p>
                <p className="mt-2 text-sm text-foreground" dir="ltr">
                  {profile.phone}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-background/60 p-4">
                <p className="text-xs text-muted">ایمیل</p>
                <p className="mt-2 text-sm text-foreground" dir="ltr">
                  {profile.email || "ثبت نشده"}
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                ["شماره همراه", profile.verification.phone],
                ["تأیید هویت", profile.verification.identity],
                ["کارت بانکی", profile.verification.bankCard],
              ].map(([label, status]) => {
                const verificationStatus = status as VerificationStatus;

                return (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3"
                  >
                    <span className="text-sm text-foreground">{label}</span>
                    <span
                      className={`rounded-lg border px-2.5 py-1 text-xs ${
                        verificationClasses[verificationStatus]
                      }`}
                    >
                      {verificationLabels[verificationStatus]}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">تنظیمات فضای کاری</h2>
                <p className="mt-1 text-sm text-muted">
                  این انتخاب‌ها فقط برای شخصی‌سازی نمایش و ارتباطات حساب استفاده می‌شوند.
                </p>
              </div>
              <button
                type="button"
                onClick={toggleEditing}
                className="rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-elevated"
              >
                {isEditing ? "انصراف" : "ویرایش تنظیمات"}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={saveProfile} className="mt-6 space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm text-foreground">نام نمایشی</span>
                    <input
                      name="displayName"
                      defaultValue={profile.displayName || ""}
                      maxLength={80}
                      className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary"
                      placeholder="نامی که در حساب نمایش داده می‌شود"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm text-foreground">زبان رابط</span>
                    <select
                      name="locale"
                      defaultValue={profile.preferences.locale}
                      className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
                    >
                      <option value="fa-IR">فارسی</option>
                      <option value="en-US">English</option>
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm text-foreground">منطقه زمانی</span>
                    <input
                      name="timezone"
                      defaultValue={profile.preferences.timezone}
                      maxLength={80}
                      className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary"
                      placeholder="Asia/Tehran"
                      dir="ltr"
                    />
                  </label>
                </div>

                <fieldset>
                  <legend className="text-sm text-foreground">بازارهای مورد علاقه</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <label className={`cursor-pointer rounded-xl border px-3 py-2 text-sm transition-colors ${checkboxClass(selectedMarkets.includes("forex"))}`}>
                      <input
                        type="checkbox"
                        checked={selectedMarkets.includes("forex")}
                        onChange={() => toggleMarket("forex")}
                        className="ml-2 h-4 w-4 align-middle accent-[var(--primary)]"
                      />
                      فارکس
                    </label>
                    <label className={`cursor-pointer rounded-xl border px-3 py-2 text-sm transition-colors ${checkboxClass(selectedMarkets.includes("crypto"))}`}>
                      <input
                        type="checkbox"
                        checked={selectedMarkets.includes("crypto")}
                        onChange={() => toggleMarket("crypto")}
                        className="ml-2 h-4 w-4 align-middle accent-[var(--primary)]"
                      />
                      رمزارز
                    </label>
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-sm text-foreground">سبک معاملاتی</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <label className={`cursor-pointer rounded-xl border px-3 py-2 text-sm transition-colors ${checkboxClass(selectedTradingStyles.includes("intraday"))}`}>
                      <input
                        type="checkbox"
                        checked={selectedTradingStyles.includes("intraday")}
                        onChange={() => toggleTradingStyle("intraday")}
                        className="ml-2 h-4 w-4 align-middle accent-[var(--primary)]"
                      />
                      درون‌روزی
                    </label>
                    <label className={`cursor-pointer rounded-xl border px-3 py-2 text-sm transition-colors ${checkboxClass(selectedTradingStyles.includes("swing"))}`}>
                      <input
                        type="checkbox"
                        checked={selectedTradingStyles.includes("swing")}
                        onChange={() => toggleTradingStyle("swing")}
                        className="ml-2 h-4 w-4 align-middle accent-[var(--primary)]"
                      />
                      سوئینگ
                    </label>
                  </div>
                </fieldset>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3">
                    <span>
                      <span className="block text-sm text-foreground">دریافت خبرنامه</span>
                      <span className="mt-1 block text-xs text-muted">خبرهای منتخب و به‌روزرسانی محصول</span>
                    </span>
                    <input
                      name="newsletterEnabled"
                      type="checkbox"
                      defaultChecked={profile.preferences.newsletterEnabled}
                      className="h-4 w-4 accent-[var(--primary)]"
                    />
                  </label>
                  <label className="flex cursor-pointer items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3">
                    <span>
                      <span className="block text-sm text-foreground">اتصال تلگرام</span>
                      <span className="mt-1 block text-xs text-muted">آمادگی برای هشدارها و پیام‌های بات</span>
                    </span>
                    <input
                      name="telegramLinked"
                      type="checkbox"
                      defaultChecked={profile.preferences.telegramLinked}
                      className="h-4 w-4 accent-[var(--primary)]"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
                </button>
              </form>
            ) : (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["زبان رابط", profile.preferences.locale === "fa-IR" ? "فارسی" : "English"],
                  ["منطقه زمانی", profile.preferences.timezone],
                  [
                    "بازارها",
                    profile.preferences.markets
                      .map((market) => (market === "forex" ? "فارکس" : "رمزارز"))
                      .join("، ") || "انتخاب نشده",
                  ],
                  [
                    "سبک",
                    profile.preferences.tradingStyle
                      .map((style) => (style === "intraday" ? "درون‌روزی" : "سوئینگ"))
                      .join("، ") || "انتخاب نشده",
                  ],
                  ["خبرنامه", profile.preferences.newsletterEnabled ? "فعال" : "غیرفعال"],
                  ["تلگرام", profile.preferences.telegramLinked ? "متصل" : "اتصال داده نشده"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-border bg-background/60 p-4">
                    <p className="text-xs text-muted">{label}</p>
                    <p className="mt-2 text-sm text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">نشست‌ها و دستگاه‌ها</h2>
                <p className="mt-1 text-sm text-muted">
                  نشست فعلی را نگه دارید و در صورت نیاز از سایر دستگاه‌ها خارج شوید.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void revokeOtherSessions()}
                disabled={isRevoking || activePayload.sessions.length < 2}
                className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRevoking ? "در حال خروج..." : "خروج از سایر نشست‌ها"}
              </button>
            </div>
            <div className="mt-5 space-y-3">
              {activePayload.sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{session.deviceLabel}</p>
                    <p className="mt-1 text-xs text-muted">
                      {[session.locationLabel, `آخرین فعالیت: ${formatDate(session.lastSeenAt)}`]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  {session.current ? (
                    <span className="rounded-lg border border-success/30 bg-success/10 px-2.5 py-1 text-xs text-success">
                      نشست فعلی
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
            {!currentSession ? (
              <p className="mt-4 text-sm text-warning">
                نشست فعلی از پاسخ سرویس حساب مشخص نشده است؛ پیش از فعال‌سازی تولید، این قرارداد را بررسی کنید.
              </p>
            ) : null}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-medium text-primary">حریم خصوصی</p>
            <h2 className="mt-2 font-semibold text-foreground">اطلاعات حساس جدا نگه داشته می‌شوند</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              شماره کارت، کد ملی و اطلاعات اتصال به کارگزار در مرورگر ذخیره یا نمایش داده نمی‌شوند.
            </p>
          </section>
          <section className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-medium text-primary">دعوت دوستان</p>
            <h2 className="mt-2 font-semibold text-foreground">برای اشتراک‌های واجد شرایط پاداش بگیرید</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              هر ۳ اشتراک پرداختی واجد شرایط که از دعوت شما ثبت شود، ۳۰ روز دسترسی چارت اضافه می‌کند.
            </p>
            <Link
              href="/app/referrals"
              className="mt-4 inline-flex text-sm font-medium text-primary hover:text-accent"
            >
              مشاهده برنامه دعوت ←
            </Link>
          </section>
          <section className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-medium text-primary">امنیت حساب</p>
            <p className="mt-2 text-sm leading-7 text-muted">
              اگر دستگاه ناشناسی دیدید، از سایر نشست‌ها خارج شوید و از پشتیبانی برای بررسی بیشتر کمک بگیرید.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

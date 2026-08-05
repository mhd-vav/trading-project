// src/components/account/ReferralCenter.tsx
"use client";

import { useEffect, useState } from "react";
import type {
  AccountApiEnvelope,
  ReferralCodePayload,
  ReferralInvite,
  ReferralPayload,
} from "@/lib/account/contracts";
import { isAccountApiEnvelope } from "@/lib/account/contracts";

type LoadState = "loading" | "ready" | "setup" | "error";

const inviteStatus = {
  pending: {
    label: "در انتظار بررسی",
    className: "border-warning/30 bg-warning/10 text-warning",
  },
  qualified: {
    label: "واجد شرایط",
    className: "border-success/30 bg-success/10 text-success",
  },
  not_qualified: {
    label: "واجد شرایط نیست",
    className: "border-border bg-surface-elevated text-muted",
  },
} as const;

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
  }).format(date);
}

function progressPercent(progress: number, required: number) {
  if (!Number.isFinite(progress) || !Number.isFinite(required) || required <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (progress / required) * 100));
}

export default function ReferralCenter() {
  const [state, setState] = useState<LoadState>("loading");
  const [payload, setPayload] = useState<ReferralPayload | null>(null);
  const [message, setMessage] = useState("");
  const [isCreatingCode, setIsCreatingCode] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  async function loadReferrals() {
    setState("loading");
    setMessage("");
    setCopyState("idle");

    try {
      const response = await fetch("/api/account/referrals", { cache: "no-store" });
      const responsePayload: unknown = await response.json().catch(() => null);
      const envelope = getEnvelope<ReferralPayload>(responsePayload);

      if (!response.ok || !envelope) {
        setState("error");
        setMessage("دریافت وضعیت دعوت‌ها با مشکل روبه‌رو شد. دوباره تلاش کنید.");
        return;
      }

      if (!envelope.configured || !envelope.data) {
        setPayload(null);
        setState("setup");
        setMessage(
          envelope.message ||
            "برای نمایش لینک و پیشرفت واقعی، سرویس Account API را در محیط اجرا متصل کنید.",
        );
        return;
      }

      setPayload(envelope.data);
      setState("ready");
    } catch {
      setState("error");
      setMessage("اتصال به سرویس دعوت‌ها برقرار نشد. دوباره تلاش کنید.");
    }
  }

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadReferrals();
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, []);

  async function createReferralCode() {
    setIsCreatingCode(true);
    setMessage("");

    try {
      const response = await fetch("/api/account/referrals/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const responsePayload: unknown = await response.json().catch(() => null);
      const envelope = getEnvelope<ReferralCodePayload>(responsePayload);

      if (!response.ok || !envelope?.configured || !envelope.data) {
        setMessage(envelope?.message || "ساخت کد دعوت انجام نشد. دوباره تلاش کنید.");
        return;
      }

      const codePayload = envelope.data;

      setPayload((currentPayload) =>
        currentPayload
          ? {
              ...currentPayload,
              referralCode: codePayload.referralCode,
              referralUrl: codePayload.referralUrl,
            }
          : currentPayload,
      );
      setMessage("کد دعوت شما ساخته شد.");
    } catch {
      setMessage("ساخت کد دعوت با خطا روبه‌رو شد. دوباره تلاش کنید.");
    } finally {
      setIsCreatingCode(false);
    }
  }

  async function copyReferralUrl() {
    if (!payload?.referralUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(payload.referralUrl);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  if (state === "loading") {
    return (
      <div className="space-y-6" aria-busy="true">
        <div className="h-44 animate-pulse rounded-2xl border border-border bg-surface" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-28 animate-pulse rounded-2xl border border-border bg-surface" />
          <div className="h-28 animate-pulse rounded-2xl border border-border bg-surface" />
          <div className="h-28 animate-pulse rounded-2xl border border-border bg-surface" />
        </div>
      </div>
    );
  }

  if (state === "setup" || state === "error" || !payload) {
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
          {isSetup ? "اتصال دعوت آماده توسعه" : "خطای اتصال"}
        </span>
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          {isSetup ? "برنامه دعوت آماده اتصال به حساب کاربری است" : "وضعیت دعوت‌ها در دسترس نیست"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{message}</p>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          پس از اتصال API، این صفحه فقط لینک دعوت، دعوت‌های ثبت‌شده و پاداش‌های واقعی کاربر را
          نمایش می‌دهد؛ هیچ آمار یا پاداش ساختگی در رابط کاربری وارد نشده است.
        </p>
        <button
          type="button"
          onClick={() => void loadReferrals()}
          className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
        >
          تلاش دوباره
        </button>
      </section>
    );
  }

  const { reward } = payload;
  const qualifyingRequired = reward.qualifyingSubscriptionsPerReward;
  const qualifiedProgress = Math.min(
    Math.max(reward.nextRewardProgress, 0),
    qualifyingRequired,
  );
  const percentage = progressPercent(qualifiedProgress, qualifyingRequired);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-l from-accent/10 via-primary/10 to-surface">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center">
          <div>
            <p className="text-sm font-medium text-primary">برنامه دعوت دوستان</p>
            <h1 className="mt-2 text-3xl font-bold text-foreground">
              اشتراک‌گذاری مفید، دسترسی چارت بیشتر
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
              با هر ۳ اشتراک پرداختیِ واجد شرایط که با لینک شما ثبت شود، ۳۰ روز به دسترسی بخش چارت
              اضافه می‌شود. پاداش نقدی نیست و برای حفظ عدالت پس از بررسی پرداخت فعال می‌گردد.
            </p>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-background/50 p-5">
            <p className="text-xs text-muted">پاداش هر چرخه</p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {reward.chartAccessDaysPerReward} روز
            </p>
            <p className="mt-1 text-sm text-primary">دسترسی بخش چارت</p>
          </div>
        </div>
      </section>

      {message ? (
        <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
          {message}
        </div>
      ) : null}

      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">لینک دعوت شما</h2>
            <p className="mt-1 text-sm text-muted">
              فقط از این لینک یا کد در زمان ثبت‌نام استفاده شود؛ انتساب دعوت بعداً تغییر نمی‌کند.
            </p>
          </div>
          {payload.referralCode ? (
            <span className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary" dir="ltr">
              {payload.referralCode}
            </span>
          ) : null}
        </div>

        {payload.referralUrl ? (
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div
              dir="ltr"
              className="min-w-0 flex-1 overflow-x-auto rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground"
            >
              {payload.referralUrl}
            </div>
            <button
              type="button"
              onClick={() => void copyReferralUrl()}
              className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              {copyState === "copied" ? "کپی شد" : "کپی لینک"}
            </button>
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-border bg-background/60 p-5">
            <p className="text-sm text-muted">
              هنوز کد دعوت برای این حساب ساخته نشده است.
            </p>
            <button
              type="button"
              onClick={() => void createReferralCode()}
              disabled={isCreatingCode}
              className="mt-4 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreatingCode ? "در حال ساخت..." : "ساخت لینک دعوت"}
            </button>
          </div>
        )}
        {copyState === "error" ? (
          <p className="mt-3 text-sm text-warning">
            کپی خودکار ممکن نشد؛ لینک را به‌صورت دستی انتخاب و کپی کنید.
          </p>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs text-muted">اشتراک‌های واجد شرایط</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{reward.qualifiedSubscriptions}</p>
          <p className="mt-2 text-sm text-success">پرداخت تأییدشده و عبور کرده از بررسی</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs text-muted">دعوت‌های در انتظار</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{reward.pendingSubscriptions}</p>
          <p className="mt-2 text-sm text-warning">نتیجه پس از تکمیل بررسی پرداخت ثبت می‌شود</p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <p className="text-xs text-muted">پاداش‌های کسب‌شده</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{reward.earnedRewardMonths}</p>
          <p className="mt-2 text-sm text-primary">هر پاداش برابر با ۳۰ روز دسترسی چارت است</p>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">چرخه بعدی پاداش</p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">
              {qualifiedProgress} از {qualifyingRequired} اشتراک واجد شرایط
            </h2>
          </div>
          <p className="text-sm text-muted">
            {qualifyingRequired - qualifiedProgress} اشتراک دیگر تا {reward.chartAccessDaysPerReward} روز دسترسی چارت
          </p>
        </div>
        <div
          className="mt-5 h-3 overflow-hidden rounded-full bg-background"
          aria-label="پیشرفت چرخه پاداش"
          aria-valuemax={qualifyingRequired}
          aria-valuemin={0}
          aria-valuenow={qualifiedProgress}
          role="progressbar"
        >
          <div
            className="h-full rounded-full bg-gradient-to-l from-accent to-primary transition-[width]"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {["دعوت و ثبت‌نام", "پرداخت اشتراک", "بررسی و افزودن پاداش"].map((step, index) => (
            <div key={step} className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs ${
                  index === 2 && qualifiedProgress < qualifyingRequired
                    ? "border-border bg-background text-muted"
                    : "border-primary/30 bg-primary/10 text-primary"
                }`}
              >
                {index + 1}
              </span>
              <span className="text-muted">{step}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">دعوت‌های ثبت‌شده</h2>
            <p className="mt-1 text-sm text-muted">
              وضعیت‌ها از رویدادهای واقعی ثبت‌نام و پرداخت دریافت می‌شوند.
            </p>
          </div>
          {payload.invites.length ? (
            <div className="mt-5 space-y-3">
              {payload.invites.map((invite: ReferralInvite) => {
                const status = inviteStatus[invite.subscriptionStatus];

                return (
                  <article
                    key={invite.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-background/60 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {invite.displayName || "عضو دعوت‌شده"}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        ثبت‌نام: {formatDate(invite.joinedAt)}
                        {invite.qualifiedAt
                          ? ` · تأیید: ${formatDate(invite.qualifiedAt)}`
                          : ""}
                      </p>
                    </div>
                    <span className={`rounded-lg border px-2.5 py-1 text-xs ${status.className}`}>
                      {status.label}
                    </span>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-border bg-background/60 px-5 py-8 text-center">
              <p className="text-sm text-muted">هنوز دعوت ثبت‌شده‌ای برای این حساب وجود ندارد.</p>
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-medium text-primary">شرایط پاداش</p>
            <ol className="mt-3 space-y-3 text-sm leading-7 text-muted">
              <li>۱. دعوت‌شده باید حساب جدید و مستقلی داشته باشد.</li>
              <li>۲. اشتراک باید پرداختی باشد؛ آزمون یا طرح رایگان محاسبه نمی‌شود.</li>
              <li>۳. بازه بازگشت وجه و بررسی پرداخت باید پایان یافته باشد.</li>
            </ol>
          </section>
          <section className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-medium text-primary">نحوه اعمال</p>
            <p className="mt-2 text-sm leading-7 text-muted">
              هر گروه سه‌تاییِ تأییدشده، یک پاداش ۳۰ روزه ایجاد می‌کند. این زمان پس از پایان
              دسترسی پرداختی فعال می‌شود و قابل انتقال یا تبدیل به وجه نیست.
            </p>
          </section>
          <section className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-medium text-primary">پیشگیری از سوءاستفاده</p>
            <p className="mt-2 text-sm leading-7 text-muted">
              خوددعوتی، حساب یا پرداخت تکراری، بازگشت وجه و موارد مشکوک واجد شرایط پاداش نیستند.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

// src/components/settings/SettingsCenter.tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme, type ThemePreference } from "@/components/theme/ThemeProvider";
import {
  applyWorkspaceDisplaySettings,
  defaultWorkspaceSettings,
  readWorkspaceSettings,
  type WorkspaceSettings,
} from "@/lib/settings/workspace";

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-5 rounded-xl border border-border bg-background/55 px-4 py-3.5">
      <span>
        <span className="block text-sm font-medium text-foreground">{title}</span>
        <span className="mt-1 block text-xs leading-5 text-muted">{description}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 shrink-0 accent-[var(--primary)]"
      />
    </label>
  );
}

export default function SettingsCenter() {
  const { preference, resolvedTheme, setPreference } = useTheme();
  const [settings, setSettings] = useState<WorkspaceSettings>(defaultWorkspaceSettings);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const restoredSettings = readWorkspaceSettings();
      setSettings(restoredSettings);
      applyWorkspaceDisplaySettings(restoredSettings);
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  function updateSetting<Key extends keyof WorkspaceSettings>(
    key: Key,
    value: WorkspaceSettings[Key],
  ) {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
    setSavedMessage("");
  }

  function saveSettings() {
    window.localStorage.setItem("mafid-workspace-settings", JSON.stringify(settings));
    applyWorkspaceDisplaySettings(settings);
    setSavedMessage("تنظیمات این دستگاه ذخیره شد. همگام‌سازی حساب پس از اتصال Account API فعال می‌شود.");
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-l from-primary/10 via-accent/5 to-surface p-6 sm:p-8">
        <p className="text-sm font-medium text-primary">تنظیمات فضای کاری</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground">ترمینال را مطابق روش خودتان تنظیم کنید</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          نمایش، چارت، ارتباطات و تراکم فضای کاری را کنترل کنید. این تنظیمات فعلاً روی همین دستگاه
          ذخیره می‌شوند و قرارداد همگام‌سازی حساب برای اتصال API آماده است.
        </p>
      </section>

      {savedMessage ? (
        <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          {savedMessage}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-surface p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">ظاهر و خوانایی</h2>
              <p className="mt-1 text-sm text-muted">رنگ رابط و تراکم اطلاعات را انتخاب کنید.</p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {([
                ["dark", "تیره", "تمرکز بالا برای کار با چارت"],
                ["light", "روشن", "خوانایی بیشتر در محیط روشن"],
                ["system", "سیستم", "مطابق تنظیمات دستگاه"],
              ] as Array<[ThemePreference, string, string]>).map(([value, label, description]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPreference(value)}
                  className={`rounded-xl border p-4 text-right transition-colors ${
                    preference === value
                      ? "border-primary/50 bg-primary/10"
                      : "border-border bg-background/55 hover:border-primary/40"
                  }`}
                >
                  <span className="block text-sm font-medium text-foreground">{label}</span>
                  <span className="mt-2 block text-xs leading-5 text-muted">{description}</span>
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">
              حالت فعال: {resolvedTheme === "dark" ? "تیره" : "روشن"}
            </p>
            <div className="mt-4">
              <ToggleRow
                title="تراکم فشرده"
                description="فاصله‌ها و نوشته‌ها را برای نمایش اطلاعات بیشتر کاهش می‌دهد."
                checked={settings.compactDensity}
                onChange={(value) => updateSetting("compactDensity", value)}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">پیش‌فرض‌های نمودار</h2>
              <p className="mt-1 text-sm text-muted">
                نوع نمودار و رفتار اولیه ترمینال را برای شروع هر نشست تعیین کنید.
              </p>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-foreground">نوع نمودار</span>
                <select
                  value={settings.defaultChart}
                  onChange={(event) =>
                    updateSetting(
                      "defaultChart",
                      event.target.value as WorkspaceSettings["defaultChart"],
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="candlestick">کندل</option>
                  <option value="heikin_ashi">هیکن‌آشی</option>
                  <option value="renko">رنکو</option>
                  <option value="range">رنج‌بار</option>
                  <option value="tpo">TPO / Market Profile</option>
                  <option value="point_figure">Point & Figure</option>
                  <option value="line">خطی</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-foreground">بازه پیش‌فرض</span>
                <select
                  value={settings.defaultTimeframe}
                  onChange={(event) =>
                    updateSetting(
                      "defaultTimeframe",
                      event.target.value as WorkspaceSettings["defaultTimeframe"],
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                >
                  <option value="1d">۱ روز</option>
                  <option value="4h">۴ ساعت</option>
                  <option value="1h">۱ ساعت</option>
                </select>
              </label>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ToggleRow
                title="خط راهنمای قیمت"
                description="نشانگر دقیق قیمت و زمان را در نمودار فعال نگه می‌دارد."
                checked={settings.showCrosshair}
                onChange={(value) => updateSetting("showCrosshair", value)}
              />
              <ToggleRow
                title="پنل خبر در ترمینال"
                description="خبرهای مرتبط را کنار فضای نمودار نشان می‌دهد."
                checked={settings.showNewsPanel}
                onChange={(value) => updateSetting("showNewsPanel", value)}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">ارتباطات و تمرکز</h2>
              <p className="mt-1 text-sm text-muted">
                کانال‌هایی را انتخاب کنید که واقعاً به روند تصمیم‌گیری شما کمک می‌کنند.
              </p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <ToggleRow
                title="اعلان تلگرام"
                description="پس از اتصال بات، هشدارهای منتخب در تلگرام ارسال می‌شوند."
                checked={settings.telegramNotifications}
                onChange={(value) => updateSetting("telegramNotifications", value)}
              />
              <ToggleRow
                title="خلاصه ایمیلی"
                description="خلاصه هفتگی بازار و فضای کاری را دریافت کنید."
                checked={settings.emailDigest}
                onChange={(value) => updateSetting("emailDigest", value)}
              />
              <ToggleRow
                title="کاهش حرکت"
                description="انیمیشن‌های غیرضروری را برای تمرکز بیشتر کم می‌کند."
                checked={settings.reduceMotion}
                onChange={(value) => updateSetting("reduceMotion", value)}
              />
            </div>
          </section>

          <button
            type="button"
            onClick={saveSettings}
            className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            ذخیره تنظیمات دستگاه
          </button>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-medium text-primary">حساب و همگام‌سازی</p>
            <h2 className="mt-2 font-semibold text-foreground">تنظیمات در حال حاضر محلی‌اند</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              این کنترل‌ها با local storage کار می‌کنند تا رابط قابل استفاده بماند. در نسخه بک‌اند،
              همین داده‌ها از طریق Account API بین دستگاه‌ها همگام می‌شوند.
            </p>
          </section>
          <section className="rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs font-medium text-primary">یادآوری داده</p>
            <p className="mt-2 text-sm leading-7 text-muted">
              تنظیمات نمودار فقط نمایش را تغییر می‌دهند؛ منبع، تأخیر و محدودیت هر بازار جداگانه در
              ترمینال مشخص می‌شود.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

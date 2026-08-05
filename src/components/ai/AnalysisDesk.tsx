// src/components/ai/AnalysisDesk.tsx
"use client";

import { FormEvent, useState } from "react";
import type { DeskAnalysisResponse } from "@/lib/market/contracts";

type AnalysisDeskProps = {
  initialAsset?: string;
  initialAssetClass?: "crypto" | "forex";
};

type ReportLength = "brief" | "standard" | "deep";
type ModelTier = "starter" | "professional" | "institutional";

const reportLengthOptions: Array<{
  id: ReportLength;
  title: string;
  description: string;
}> = [
  { id: "brief", title: "خلاصه", description: "کارت تصمیم، ریسک‌ها و نکات کلیدی" },
  { id: "standard", title: "استاندارد", description: "شواهد میزها، سناریوها و اختلاف دیدگاه‌ها" },
  { id: "deep", title: "عمیق", description: "گزارش پژوهشی با جزئیات بیشتر و زمینه زمانی" },
];

const modelTierOptions: Array<{
  id: ModelTier;
  title: string;
  description: string;
  access: string;
}> = [
  {
    id: "starter",
    title: "سریع",
    description: "برای مرور سریع زمینه بازار",
    access: "Explorer",
  },
  {
    id: "professional",
    title: "حرفه‌ای",
    description: "استدلال چندمیزه برای تصمیم‌سازی روزانه",
    access: "Pro",
  },
  {
    id: "institutional",
    title: "عمیق",
    description: "گزارش مفصل، تضادها و سناریوهای جایگزین",
    access: "Desk",
  },
];

function decisionClass(decision: DeskAnalysisResponse["final_decision"]) {
  if (decision === "buy") {
    return "border-success/30 bg-success/10 text-success";
  }
  if (decision === "sell") {
    return "border-danger/30 bg-danger/10 text-danger";
  }
  if (decision === "hold") {
    return "border-warning/30 bg-warning/10 text-warning";
  }
  return "border-border bg-surface-elevated text-muted";
}

function decisionLabel(decision: DeskAnalysisResponse["final_decision"]) {
  const labels: Record<DeskAnalysisResponse["final_decision"], string> = {
    buy: "تمایل صعودی",
    sell: "تمایل نزولی",
    hold: "صبر و پایش",
    wait: "داده ناکافی",
  };

  return labels[decision];
}

export default function AnalysisDesk({
  initialAsset = "BTC/USDT",
  initialAssetClass = "crypto",
}: AnalysisDeskProps) {
  const [asset, setAsset] = useState(initialAsset);
  const [assetClass, setAssetClass] = useState<"crypto" | "forex">(initialAssetClass);
  const [reportLength, setReportLength] = useState<ReportLength>("standard");
  const [modelTier, setModelTier] = useState<ModelTier>("professional");
  const [includeScenarios, setIncludeScenarios] = useState(true);
  const [includeContradictions, setIncludeContradictions] = useState(true);
  const [analysis, setAnalysis] = useState<DeskAnalysisResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function submitAnalysis(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setAnalysis(null);

    try {
      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset,
          assetClass,
          timeframe: "4h",
          report: {
            length: reportLength,
            modelTier,
            includeScenarios,
            includeContradictions,
          },
        }),
      });
      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok || !payload || typeof payload !== "object" || !("bundles" in payload)) {
        throw new Error("Analysis is unavailable");
      }

      setAnalysis(payload as DeskAnalysisResponse);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="border-b border-border bg-gradient-to-l from-primary/10 via-accent/5 to-transparent p-5 sm:p-6">
        <p className="text-xs font-medium text-primary">Machine Intelligence Workspace</p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">
          یک سامانه چندعاملی برای کاهش بار شناختی
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
          مافید پاسخ‌های پراکنده را کنار هم نمی‌گذارد. میزهای مستقل، شواهد خود را بررسی می‌کنند،
          اختلاف را آشکار می‌سازند و یک گزارش قابل‌مرور برای تصمیم‌گیری شخصی می‌سازند.
        </p>
      </div>

      <form onSubmit={submitAnalysis} className="space-y-6 p-5 sm:p-6">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_10rem_8rem]">
          <label className="block">
            <span className="text-xs text-muted">نماد</span>
            <input
              value={asset}
              onChange={(event) => setAsset(event.target.value)}
              dir="ltr"
              aria-label="Asset"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
            />
          </label>
          <label className="block">
            <span className="text-xs text-muted">بازار</span>
            <select
              value={assetClass}
              onChange={(event) => setAssetClass(event.target.value as "crypto" | "forex")}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
              aria-label="Asset class"
            >
              <option value="crypto">رمزارز</option>
              <option value="forex">فارکس</option>
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? "در حال ساخت..." : "ساخت گزارش"}
            </button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <fieldset>
            <legend className="text-sm font-medium text-foreground">طول گزارش</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {reportLengthOptions.map((option) => (
                <label
                  key={option.id}
                  className={`cursor-pointer rounded-xl border p-3 transition-colors ${
                    reportLength === option.id
                      ? "border-primary/50 bg-primary/10"
                      : "border-border bg-background/60 hover:border-primary/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="reportLength"
                    value={option.id}
                    checked={reportLength === option.id}
                    onChange={() => setReportLength(option.id)}
                    className="sr-only"
                  />
                  <span className="block text-sm font-medium text-foreground">{option.title}</span>
                  <span className="mt-1 block text-[11px] leading-5 text-muted">{option.description}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-medium text-foreground">سطح مدل هوش ماشین</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {modelTierOptions.map((option) => (
                <label
                  key={option.id}
                  className={`cursor-pointer rounded-xl border p-3 transition-colors ${
                    modelTier === option.id
                      ? "border-accent/50 bg-accent/10"
                      : "border-border bg-background/60 hover:border-accent/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="modelTier"
                    value={option.id}
                    checked={modelTier === option.id}
                    onChange={() => setModelTier(option.id)}
                    className="sr-only"
                  />
                  <span className="block text-sm font-medium text-foreground">{option.title}</span>
                  <span className="mt-1 block text-[11px] text-accent">{option.access}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={includeScenarios}
              onChange={(event) => setIncludeScenarios(event.target.checked)}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            سناریوهای جایگزین
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background/60 px-3 py-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={includeContradictions}
              onChange={(event) => setIncludeContradictions(event.target.checked)}
              className="h-4 w-4 accent-[var(--primary)]"
            />
            نمایش اختلاف میزها
          </label>
          <span className="self-center text-[11px] text-muted">
            سطح واقعی دسترسی در بک‌اند بر اساس اشتراک کنترل می‌شود.
          </span>
        </div>
      </form>

      {status === "error" ? (
        <div className="mx-5 mb-5 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger sm:mx-6 sm:mb-6">
          اتصال به موتور گزارش برقرار نشد. آدرس API، کلید سرویس و مدل‌های هر سطح را در محیط سرور
          تنظیم کنید.
        </div>
      ) : null}

      {analysis ? (
        <div className="space-y-5 border-t border-border p-5 sm:p-6">
          <section className="rounded-2xl border border-border bg-background/55 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted">جمع‌بندی قابل‌اقدام</p>
                <span className={`mt-2 inline-flex rounded-lg border px-3 py-1.5 text-sm font-semibold ${decisionClass(analysis.final_decision)}`}>
                  {decisionLabel(analysis.final_decision)}
                </span>
              </div>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-xs text-muted">رژیم بازار</dt>
                  <dd className="mt-1 text-foreground">{analysis.regime}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">اطمینان</dt>
                  <dd className="mt-1 text-foreground">{Math.round(analysis.final_conviction * 100)}%</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">زمان پردازش</dt>
                  <dd className="mt-1 text-foreground" dir="ltr">
                    {analysis.pipeline_latency_ms.toLocaleString("en-US")} ms
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">پروفایل</dt>
                  <dd className="mt-1 text-foreground">
                    {analysis.report_meta?.length ?? reportLength} / {analysis.report_meta?.model_tier ?? modelTier}
                  </dd>
                </div>
              </dl>
            </div>
            <p className="mt-5 text-sm leading-7 text-muted">{analysis.final_rationale}</p>
          </section>

          <section>
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <h3 className="font-medium text-foreground">شواهد میزهای مستقل</h3>
                <p className="mt-1 text-xs text-muted">
                  تفاوت دیدگاه‌ها حذف نمی‌شود؛ بخشی از زمینه تصمیم باقی می‌ماند.
                </p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {Object.entries(analysis.bundles).map(([bundleName, bundle]) => (
                <article key={bundleName} className="rounded-xl border border-border bg-background/35 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-mono text-sm font-medium text-foreground">{bundleName}</h4>
                      <p className="mt-1 text-[11px] text-muted">
                        اطمینان {Math.round(bundle.confidence * 100)}% · پراکندگی {Math.round(bundle.dispersion * 100)}%
                      </p>
                    </div>
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs ${
                        bundle.stance > 0
                          ? "bg-success/10 text-success"
                          : bundle.stance < 0
                            ? "bg-danger/10 text-danger"
                            : "bg-warning/10 text-warning"
                      }`}
                    >
                      {bundle.stance > 0 ? "مثبت" : bundle.stance < 0 ? "منفی" : "خنثی"}
                    </span>
                  </div>
                  <p className="mt-3 whitespace-pre-line text-xs leading-6 text-muted">{bundle.rationale}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-xs leading-6 text-warning">
            {analysis.disclaimer || "این گزارش آموزشی است، نه توصیه سرمایه‌گذاری یا دستور معامله."}
          </p>
        </div>
      ) : null}
    </section>
  );
}

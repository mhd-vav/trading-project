// src/components/charts/MarketChart.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts";
import type {
  CandlestickPoint,
  LinePoint,
  MarketChartMode,
  MarketChartResponse,
  MarketSymbol,
} from "@/lib/market/contracts";
import {
  calculateExponentialMovingAverage,
  calculateHeikinAshi,
  calculatePointAndFigure,
  calculateRangeActivity,
  calculateRangeBars,
  calculateRenko,
  calculateSimpleMovingAverage,
  calculateTpoLevels,
} from "@/lib/market/chart-calculations";
import { defaultWorkspaceSettings, readWorkspaceSettings } from "@/lib/settings/workspace";

type MarketChartProps = {
  symbol: MarketSymbol;
  defaultMode?: MarketChartMode;
};

const chartModes: Array<{ id: MarketChartMode; label: string }> = [
  { id: "candlestick", label: "کندل" },
  { id: "heikin_ashi", label: "هیکن‌آشی" },
  { id: "renko", label: "رنکو" },
  { id: "range", label: "رنج" },
  { id: "tpo", label: "TPO" },
  { id: "point_figure", label: "P&F" },
  { id: "line", label: "خطی" },
];

function isCandlestickPoint(
  point: CandlestickPoint | LinePoint,
): point is CandlestickPoint {
  return "open" in point;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Math.abs(value) >= 100 ? 2 : 5,
  }).format(value);
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("fa-IR", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function chartColors() {
  const styles = getComputedStyle(document.documentElement);

  return {
    background: styles.getPropertyValue("--background").trim(),
    foreground: styles.getPropertyValue("--foreground").trim(),
    surface: styles.getPropertyValue("--surface").trim(),
    border: styles.getPropertyValue("--border").trim(),
    muted: styles.getPropertyValue("--muted").trim(),
    primary: styles.getPropertyValue("--primary").trim(),
    accent: styles.getPropertyValue("--accent").trim(),
    success: styles.getPropertyValue("--success").trim(),
    warning: styles.getPropertyValue("--warning").trim(),
    danger: styles.getPropertyValue("--danger").trim(),
  };
}

function modeDescription(mode: MarketChartMode) {
  const descriptions: Record<MarketChartMode, string> = {
    candlestick: "نمایش OHLC با لایه‌های میانگین متحرک و نوسان روزانه",
    heikin_ashi: "هموارسازی روند با کندل‌های محاسبه‌شده هیکن‌آشی",
    renko: "آجرهای قیمتی محاسبه‌شده با اندازه مبتنی بر نوسان",
    range: "کندل‌های رنج محاسبه‌شده با آستانه نوسان تطبیقی",
    tpo: "پروفایل زمان-قیمت محاسبه‌شده از دامنه هر کندل",
    point_figure: "ستون‌های X و O با قانون بازگشت سه‌جعبه‌ای",
    line: "نمای نزدیک‌شدن قیمت با تمرکز بر مسیر کلی",
  };

  return descriptions[mode];
}

function badgeClass(delayed: boolean) {
  return delayed
    ? "border-warning/30 bg-warning/10 text-warning"
    : "border-success/30 bg-success/10 text-success";
}

export default function MarketChart({
  symbol,
  defaultMode = "candlestick",
}: MarketChartProps) {
  const chartElement = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [marketChart, setMarketChart] = useState<MarketChartResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chartMode, setChartMode] = useState<MarketChartMode>(defaultMode);
  const [showSma, setShowSma] = useState(true);
  const [showEma, setShowEma] = useState(false);
  const [showCrosshair, setShowCrosshair] = useState(defaultWorkspaceSettings.showCrosshair);
  const [themeVersion, setThemeVersion] = useState(0);

  const firstPoint = marketChart?.points[0];
  const supportsOhlc = Boolean(firstPoint && isCandlestickPoint(firstPoint));
  const effectiveMode = supportsOhlc ? chartMode : "line";
  const candles = useMemo(
    () =>
      supportsOhlc && marketChart
        ? (marketChart.points as CandlestickPoint[])
        : [],
    [marketChart, supportsOhlc],
  );
  const prices = useMemo(
    () =>
      supportsOhlc
        ? candles.map((point) => point.close)
        : (marketChart?.points as LinePoint[] | undefined)?.map((point) => point.value) ?? [],
    [candles, marketChart, supportsOhlc],
  );
  const lastPrice = prices.at(-1) ?? null;
  const firstPrice = prices[0] ?? null;
  const priceChange =
    lastPrice !== null && firstPrice !== null && firstPrice !== 0
      ? ((lastPrice - firstPrice) / firstPrice) * 100
      : null;

  useEffect(() => {
    const abortController = new AbortController();
    const requestTimer = window.setTimeout(() => {
      async function loadChart() {
        setMarketChart(null);
        setError(null);

        try {
          const response = await fetch(`/api/market/candles?symbol=${symbol}`, {
            signal: abortController.signal,
            cache: "no-store",
          });
          const payload: unknown = await response.json().catch(() => null);

          if (!response.ok || !payload || typeof payload !== "object" || !("points" in payload)) {
            throw new Error("داده بازار در دسترس نیست.");
          }

          setMarketChart(payload as MarketChartResponse);
        } catch (requestError) {
          if (!abortController.signal.aborted) {
            setError(
              requestError instanceof Error
                ? requestError.message
                : "داده بازار در دسترس نیست.",
            );
          }
        }
      }

      void loadChart();
    }, 0);

    return () => {
      window.clearTimeout(requestTimer);
      abortController.abort();
    };
  }, [symbol]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setThemeVersion((currentValue) => currentValue + 1);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const workspaceSettings = readWorkspaceSettings();
      setChartMode(workspaceSettings.defaultChart);
      setShowCrosshair(workspaceSettings.showCrosshair);
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (!chartElement.current || !marketChart || marketChart.points.length === 0) {
      return;
    }

    const colors = chartColors();
    const sourceCandles = candles;
    const plottedCandles =
      effectiveMode === "heikin_ashi"
        ? calculateHeikinAshi(sourceCandles)
        : effectiveMode === "renko"
          ? calculateRenko(sourceCandles)
          : effectiveMode === "range"
            ? calculateRangeBars(sourceCandles)
          : sourceCandles;
    const categoryData =
      effectiveMode === "renko"
        ? plottedCandles.map((point, index) => `${formatTimestamp(point.timestamp)} · ${index + 1}`)
        : marketChart.points.map((point) => formatTimestamp(point.timestamp));

    chartInstance.current?.dispose();
    const chart = echarts.init(chartElement.current, undefined, {
      renderer: "canvas",
    });
    chartInstance.current = chart;

    if (effectiveMode === "tpo" && sourceCandles.length) {
      const tpoLevels = calculateTpoLevels(sourceCandles);
      chart.setOption({
        animationDuration: 250,
        backgroundColor: "transparent",
        grid: {
          top: 34,
          right: 24,
          bottom: 48,
          left: 62,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          backgroundColor: colors.surface,
          borderColor: colors.border,
          textStyle: { color: colors.foreground, fontFamily: "IRLotus, Vazirmatn, sans-serif" },
          formatter: (params: unknown) => {
            const parameter = Array.isArray(params) ? params[0] : params;
            if (!parameter || typeof parameter !== "object" || !("dataIndex" in parameter)) {
              return "";
            }

            const dataIndex = Number((parameter as { dataIndex: unknown }).dataIndex);
            const level = tpoLevels[dataIndex];
            return level
              ? `قیمت: ${formatNumber(level.price)}<br/>تعداد TPO: ${level.count}<br/>دوره‌ها: ${level.letters}`
              : "";
          },
        },
        xAxis: {
          type: "value",
          axisLine: { lineStyle: { color: colors.border } },
          axisLabel: { color: colors.muted },
          splitLine: { lineStyle: { color: colors.border, type: "dashed" } },
          name: "تعداد TPO",
          nameTextStyle: { color: colors.muted },
        },
        yAxis: {
          type: "category",
          data: tpoLevels.map((level) => formatNumber(level.price)),
          axisLine: { lineStyle: { color: colors.border } },
          axisLabel: { color: colors.muted, fontSize: 10 },
          axisTick: { show: false },
        },
        series: [
          {
            name: "TPO",
            type: "bar",
            data: tpoLevels.map((level) => ({
              value: level.count,
              itemStyle: {
                color: level.isPointOfControl ? colors.warning : colors.primary,
                borderRadius: [0, 5, 5, 0],
              },
            })),
            label: {
              show: true,
              position: "right",
              color: colors.muted,
              fontSize: 10,
              formatter: (params: { dataIndex: number }) => tpoLevels[params.dataIndex]?.letters ?? "",
            },
          },
        ],
      });
    } else if (effectiveMode === "point_figure" && sourceCandles.length) {
      const pointAndFigureBoxes = calculatePointAndFigure(sourceCandles);
      const columns = Array.from(
        new Set(pointAndFigureBoxes.map((box) => box.column)),
      ).sort((firstValue, secondValue) => firstValue - secondValue);
      chart.setOption({
        animationDuration: 250,
        backgroundColor: "transparent",
        grid: { top: 34, right: 24, bottom: 48, left: 62 },
        tooltip: {
          trigger: "item",
          backgroundColor: colors.surface,
          borderColor: colors.border,
          textStyle: { color: colors.foreground, fontFamily: "IRLotus, Vazirmatn, sans-serif" },
          formatter: (params: { data: [number, number, string] }) =>
            `ستون: ${params.data[0] + 1}<br/>قیمت: ${formatNumber(params.data[1])}<br/>علامت: ${params.data[2]}`,
        },
        xAxis: {
          type: "category",
          data: columns.map((column) => `${column + 1}`),
          axisLine: { lineStyle: { color: colors.border } },
          axisLabel: { color: colors.muted, fontSize: 10 },
          name: "ستون",
          nameTextStyle: { color: colors.muted },
        },
        yAxis: {
          type: "value",
          scale: true,
          axisLine: { show: false },
          splitLine: { lineStyle: { color: colors.border, type: "dashed" } },
          axisLabel: { color: colors.muted, fontSize: 10, formatter: (value: number) => formatNumber(value) },
        },
        series: [
          {
            type: "scatter",
            symbolSize: 18,
            data: pointAndFigureBoxes.map((box) => [
              box.column,
              box.price,
              box.direction === "up" ? "X" : "O",
            ]),
            itemStyle: {
              color: (params: { data: [number, number, string] }) =>
                params.data[2] === "X" ? colors.success : colors.danger,
            },
            label: {
              show: true,
              color: colors.foreground,
              fontSize: 11,
              formatter: (params: { data: [number, number, string] }) => params.data[2],
            },
          },
        ],
      });
    } else if (supportsOhlc && plottedCandles.length) {
      const data = plottedCandles.map((point) => [
        point.open,
        point.close,
        point.low,
        point.high,
      ]);
      const sma = calculateSimpleMovingAverage(plottedCandles, 20);
      const ema = calculateExponentialMovingAverage(plottedCandles, 50);
      const activity = calculateRangeActivity(plottedCandles);
      chart.setOption({
        animationDuration: 250,
        backgroundColor: "transparent",
        legend: {
          top: 0,
          right: 0,
          selectedMode: false,
          textStyle: { color: colors.muted, fontSize: 10 },
          data: [
            ...(showSma ? ["SMA 20"] : []),
            ...(showEma ? ["EMA 50"] : []),
          ],
        },
        grid: [
          { top: 38, right: 22, bottom: "31%", left: 62 },
          { top: "78%", right: 22, bottom: 58, left: 62 },
        ],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: showCrosshair ? "cross" : "line",
            label: { backgroundColor: colors.surface, color: colors.foreground },
          },
          backgroundColor: colors.surface,
          borderColor: colors.border,
          textStyle: { color: colors.foreground, fontFamily: "IRLotus, Vazirmatn, sans-serif" },
        },
        xAxis: [
          {
            type: "category",
            data: categoryData,
            boundaryGap: true,
            axisLine: { lineStyle: { color: colors.border } },
            axisLabel: { show: false },
            axisPointer: { label: { show: false } },
          },
          {
            type: "category",
            gridIndex: 1,
            data: categoryData,
            boundaryGap: true,
            axisLine: { lineStyle: { color: colors.border } },
            axisLabel: { color: colors.muted, fontSize: 10, hideOverlap: true },
          },
        ],
        yAxis: [
          {
            scale: true,
            axisLine: { show: false },
            splitLine: { lineStyle: { color: colors.border, type: "dashed" } },
            axisLabel: {
              color: colors.muted,
              fontSize: 10,
              formatter: (value: number) => formatNumber(value),
            },
          },
          {
            gridIndex: 1,
            scale: true,
            axisLine: { show: false },
            splitLine: { show: false },
            axisLabel: { color: colors.muted, fontSize: 10, formatter: (value: number) => `${value}%` },
          },
        ],
        dataZoom: [
          { type: "inside", xAxisIndex: [0, 1], start: 45, end: 100 },
          {
            type: "slider",
            xAxisIndex: [0, 1],
            bottom: 12,
            height: 20,
            borderColor: colors.border,
            fillerColor: `${colors.primary}33`,
            handleStyle: { color: colors.primary },
            textStyle: { color: colors.muted, fontSize: 10 },
          },
        ],
        series: [
          {
            name:
              effectiveMode === "heikin_ashi"
                ? "Heikin-Ashi"
                : effectiveMode === "renko"
                  ? "Renko"
                  : "OHLC",
            type: "candlestick",
            data,
            itemStyle: {
              color: colors.success,
              color0: colors.danger,
              borderColor: colors.success,
              borderColor0: colors.danger,
            },
          },
          ...(showSma
            ? [
                {
                  name: "SMA 20",
                  type: "line" as const,
                  data: sma,
                  showSymbol: false,
                  lineStyle: { color: colors.accent, width: 1.4 },
                },
              ]
            : []),
          ...(showEma
            ? [
                {
                  name: "EMA 50",
                  type: "line" as const,
                  data: ema,
                  showSymbol: false,
                  lineStyle: { color: colors.warning, width: 1.4 },
                },
              ]
            : []),
          {
            name: "Range activity",
            type: "bar",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: activity,
            barMaxWidth: 8,
            itemStyle: { color: `${colors.primary}80` },
          },
        ],
      });
    } else {
      chart.setOption({
        animationDuration: 250,
        backgroundColor: "transparent",
        grid: { top: 32, right: 22, bottom: 68, left: 62 },
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "line" },
          backgroundColor: colors.surface,
          borderColor: colors.border,
          textStyle: { color: colors.foreground, fontFamily: "IRLotus, Vazirmatn, sans-serif" },
          valueFormatter: formatNumber,
        },
        xAxis: {
          type: "category",
          data: categoryData,
          boundaryGap: false,
          axisLine: { lineStyle: { color: colors.border } },
          axisLabel: { color: colors.muted, fontSize: 10, hideOverlap: true },
        },
        yAxis: {
          scale: true,
          axisLine: { show: false },
          splitLine: { lineStyle: { color: colors.border, type: "dashed" } },
          axisLabel: {
            color: colors.muted,
            fontSize: 10,
            formatter: (value: number) => formatNumber(value),
          },
        },
        dataZoom: [
          { type: "inside", start: 25, end: 100 },
          {
            type: "slider",
            bottom: 18,
            height: 20,
            borderColor: colors.border,
            fillerColor: `${colors.accent}33`,
            handleStyle: { color: colors.accent },
            textStyle: { color: colors.muted, fontSize: 10 },
          },
        ],
        series: [
          {
            name: marketChart.label,
            type: "line",
            data: prices,
            smooth: 0.15,
            showSymbol: false,
            lineStyle: { color: colors.accent, width: 2 },
            areaStyle: { color: `${colors.accent}1A` },
          },
        ],
      });
    }

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartElement.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartInstance.current = null;
    };
  }, [candles, effectiveMode, marketChart, prices, showCrosshair, showEma, showSma, supportsOhlc, themeVersion]);

  const isLoading = !marketChart && !error;

  return (
    <section className="rounded-2xl border border-border bg-surface p-4 shadow-2xl shadow-black/10 sm:p-5">
      <div className="flex flex-col gap-4 border-b border-border pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">
                {marketChart?.label ?? "ترمینال نموداری"}
              </h2>
              {marketChart ? (
                <span className={`rounded-full border px-2.5 py-1 text-[11px] ${badgeClass(marketChart.delayed)}`}>
                  {marketChart.delayed ? "با تأخیر" : "زنده"}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-muted">
              {marketChart?.source ?? "در حال اتصال به منبع بازار"}
            </p>
          </div>
          {lastPrice !== null ? (
            <div className="text-left" dir="ltr">
              <p className="text-lg font-semibold text-foreground">{formatNumber(lastPrice)}</p>
              <p className={`mt-0.5 text-xs ${priceChange !== null && priceChange >= 0 ? "text-success" : "text-danger"}`}>
                {priceChange !== null ? `${priceChange >= 0 ? "+" : ""}${priceChange.toFixed(2)}%` : "—"}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {chartModes.map((mode) => {
              const disabled = !supportsOhlc && mode.id !== "line";
              return (
                <button
                  key={mode.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => setChartMode(mode.id)}
                  className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors ${
                    effectiveMode === mode.id
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-border bg-background/60 text-muted hover:border-primary/40 hover:text-foreground"
                  } disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>
          {supportsOhlc ? (
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setShowSma((currentValue) => !currentValue)}
                className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors ${
                  showSma
                    ? "border-accent/40 bg-accent/10 text-accent"
                    : "border-border bg-background/60 text-muted"
                }`}
              >
                SMA 20
              </button>
              <button
                type="button"
                onClick={() => setShowEma((currentValue) => !currentValue)}
                className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors ${
                  showEma
                    ? "border-warning/40 bg-warning/10 text-warning"
                    : "border-border bg-background/60 text-muted"
                }`}
              >
                EMA 50
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {marketChart?.configured === false ? (
        <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/40 px-6 text-center">
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
            اتصال داده لازم است
          </span>
          <h3 className="mt-4 text-lg font-semibold text-foreground">{marketChart.label}</h3>
          <p className="mt-2 max-w-md text-sm leading-7 text-muted">{marketChart.message}</p>
        </div>
      ) : marketChart && marketChart.points.length ? (
        <>
          <p className="pt-3 text-[11px] text-muted">{modeDescription(effectiveMode)}</p>
          <div ref={chartElement} className="h-[31rem] w-full" aria-label={marketChart.label} />
          {effectiveMode === "tpo" ? (
            <p className="mt-1 text-[11px] leading-5 text-muted">
              TPO از برخورد هر بازه زمانی با سطوح قیمتی محاسبه می‌شود؛ حجم واقعی سفارش را نشان نمی‌دهد.
            </p>
          ) : null}
          {effectiveMode === "renko" ? (
            <p className="mt-1 text-[11px] leading-5 text-muted">
              اندازه آجر رنکو از نوسان اخیر محاسبه شده و با تغییر داده ورودی می‌تواند تغییر کند.
            </p>
          ) : null}
          {effectiveMode === "range" ? (
            <p className="mt-1 text-[11px] leading-5 text-muted">
              رنج‌بارها از آستانه نوسان تطبیقی محاسبه می‌شوند و جایگزین داده خام OHLC نیستند.
            </p>
          ) : null}
          {effectiveMode === "point_figure" ? (
            <p className="mt-1 text-[11px] leading-5 text-muted">
              P&F بر حرکت قیمت تمرکز دارد؛ زمان از ساختار ستون‌ها حذف شده و بازگشت سه‌جعبه‌ای اعمال می‌شود.
            </p>
          ) : null}
        </>
      ) : (
        <div className="flex h-96 items-center justify-center rounded-xl border border-dashed border-border bg-background/40 px-6 text-center text-sm text-muted">
          {isLoading ? "در حال دریافت داده بازار..." : error ?? "داده بازار در دسترس نیست."}
        </div>
      )}
    </section>
  );
}

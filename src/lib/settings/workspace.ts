// src/lib/settings/workspace.ts
import type { MarketChartMode } from "@/lib/market/contracts";

export type WorkspaceSettings = {
  compactDensity: boolean;
  showCrosshair: boolean;
  showNewsPanel: boolean;
  defaultChart: MarketChartMode;
  defaultTimeframe: "1d" | "4h" | "1h";
  reduceMotion: boolean;
  telegramNotifications: boolean;
  emailDigest: boolean;
};

export const defaultWorkspaceSettings: WorkspaceSettings = {
  compactDensity: true,
  showCrosshair: true,
  showNewsPanel: true,
  defaultChart: "candlestick",
  defaultTimeframe: "1d",
  reduceMotion: false,
  telegramNotifications: false,
  emailDigest: true,
};

const supportedChartModes = new Set<MarketChartMode>([
  "candlestick",
  "heikin_ashi",
  "renko",
  "tpo",
  "line",
]);

export function readWorkspaceSettings() {
  try {
    const storedSettings = window.localStorage.getItem("mafid-workspace-settings");
    if (!storedSettings) {
      return defaultWorkspaceSettings;
    }

    const parsedSettings = JSON.parse(storedSettings) as Partial<WorkspaceSettings>;
    const selectedChart = supportedChartModes.has(parsedSettings.defaultChart as MarketChartMode)
      ? (parsedSettings.defaultChart as MarketChartMode)
      : defaultWorkspaceSettings.defaultChart;

    return {
      ...defaultWorkspaceSettings,
      ...parsedSettings,
      defaultChart: selectedChart,
    };
  } catch {
    return defaultWorkspaceSettings;
  }
}

export function applyWorkspaceDisplaySettings(settings: WorkspaceSettings) {
  document.documentElement.dataset.density = settings.compactDensity ? "compact" : "comfortable";
  document.documentElement.dataset.reduceMotion = settings.reduceMotion ? "true" : "false";
}

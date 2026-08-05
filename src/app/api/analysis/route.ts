// src/app/api/analysis/route.ts
import { NextResponse } from "next/server";

const SUPPORTED_ASSET_CLASSES = new Set(["forex", "crypto"]);
const SUPPORTED_REPORT_LENGTHS = new Set(["brief", "standard", "deep"]);
const SUPPORTED_MODEL_TIERS = new Set(["starter", "professional", "institutional"]);

type AnalysisInput = {
  asset?: unknown;
  assetClass?: unknown;
  timeframe?: unknown;
  report?: unknown;
};

type ReportInput = {
  length?: unknown;
  modelTier?: unknown;
  includeScenarios?: unknown;
  includeContradictions?: unknown;
};

function configuredModelFor(modelTier: string) {
  if (modelTier === "starter") {
    return process.env.TRADING_DESK_FAST_MODEL;
  }
  if (modelTier === "institutional") {
    return process.env.TRADING_DESK_DEEP_MODEL;
  }
  return process.env.TRADING_DESK_STANDARD_MODEL;
}

export async function POST(request: Request) {
  const apiBaseUrl = process.env.TRADING_DESK_API_URL;
  if (!apiBaseUrl) {
    return NextResponse.json(
      { error: "Trading Desk API is not configured." },
      { status: 503 },
    );
  }

  const input = (await request.json()) as AnalysisInput;
  const asset = typeof input.asset === "string" ? input.asset.trim() : "";
  const assetClass =
    typeof input.assetClass === "string" ? input.assetClass.trim() : "";
  const timeframe =
    typeof input.timeframe === "string" ? input.timeframe.trim() : "4h";
  const report =
    input.report && typeof input.report === "object" ? (input.report as ReportInput) : {};
  const reportLength = typeof report.length === "string" ? report.length : "standard";
  const modelTier = typeof report.modelTier === "string" ? report.modelTier : "professional";
  const includeScenarios =
    typeof report.includeScenarios === "boolean" ? report.includeScenarios : true;
  const includeContradictions =
    typeof report.includeContradictions === "boolean" ? report.includeContradictions : true;

  if (
    !asset ||
    !SUPPORTED_ASSET_CLASSES.has(assetClass) ||
    !SUPPORTED_REPORT_LENGTHS.has(reportLength) ||
    !SUPPORTED_MODEL_TIERS.has(modelTier)
  ) {
    return NextResponse.json({ error: "Invalid analysis request." }, { status: 400 });
  }

  try {
    const authorization = process.env.TRADING_DESK_API_KEY;
    const configuredModel = configuredModelFor(modelTier);
    const response = await fetch(
      `${apiBaseUrl.replace(/\/$/, "")}/api/v1/analyze`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authorization ? { Authorization: `Bearer ${authorization}` } : {}),
        },
        body: JSON.stringify({
          asset,
          asset_class: assetClass,
          timeframe,
          report_profile: {
            length: reportLength,
            model_tier: modelTier,
            ...(configuredModel ? { model: configuredModel } : {}),
            include_scenarios: includeScenarios,
            include_contradictions: includeContradictions,
          },
        }),
        cache: "no-store",
      },
    );
    const payload: unknown = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "The analysis engine did not complete the request." },
        { status: response.status },
      );
    }

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { error: "The analysis engine is temporarily unavailable." },
      { status: 502 },
    );
  }
}

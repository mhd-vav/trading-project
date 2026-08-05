// src/app/api/account/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ROUTES = new Set([
  "profile",
  "referrals",
  "referrals/code",
  "sessions/revoke",
]);

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

function buildNotConfiguredResponse() {
  return NextResponse.json({
    configured: false,
    data: null,
    message: "سرویس حساب هنوز پیکربندی نشده است.",
  });
}

async function forwardRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const routePath = path.join("/");
  const accountApiUrl = process.env.ACCOUNT_API_URL;

  if (!ALLOWED_ROUTES.has(routePath)) {
    return NextResponse.json({ error: "Unsupported account endpoint." }, { status: 404 });
  }

  if (!accountApiUrl) {
    return buildNotConfiguredResponse();
  }

  const upstreamUrl = new URL(`/v1/account/${routePath}`, accountApiUrl);
  upstreamUrl.search = request.nextUrl.search;
  const authorization = request.headers.get("authorization");
  const cookie = request.headers.get("cookie");
  const requestBody =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.text();

  try {
    const response = await fetch(upstreamUrl, {
      method: request.method,
      headers: {
        ...(requestBody ? { "Content-Type": "application/json" } : {}),
        ...(authorization ? { Authorization: authorization } : {}),
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: requestBody,
      cache: "no-store",
    });
    const payload = await response.text();

    return new NextResponse(payload, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      {
        configured: true,
        data: null,
        message: "سرویس حساب موقتاً در دسترس نیست.",
      },
      { status: 502 },
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return forwardRequest(request, context);
}

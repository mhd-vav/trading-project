// src/app/api/telegram/auth/route.ts
import { NextResponse } from "next/server";
import { verifyTelegramInitData } from "@/lib/telegram/init-data";

export const runtime = "nodejs";

type TelegramAuthInput = {
  initData?: unknown;
};

export async function POST(request: Request) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json(
      { error: "Telegram authentication is not configured." },
      { status: 503 },
    );
  }

  let input: TelegramAuthInput;
  try {
    input = (await request.json()) as TelegramAuthInput;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof input.initData !== "string") {
    return NextResponse.json({ error: "Telegram init data is required." }, { status: 400 });
  }

  const verifiedData = verifyTelegramInitData(input.initData, botToken);
  if (!verifiedData) {
    return NextResponse.json({ error: "Telegram authentication failed." }, { status: 401 });
  }

  return NextResponse.json(
    {
      authenticated: true,
      authenticatedAt: verifiedData.authDate,
      user: {
        id: verifiedData.user.id,
        firstName: verifiedData.user.first_name,
        lastName: verifiedData.user.last_name ?? null,
        username: verifiedData.user.username ?? null,
        languageCode: verifiedData.user.language_code ?? null,
      },
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

// src/lib/telegram/init-data.ts
import { createHmac, timingSafeEqual } from "node:crypto";

const MAX_INIT_DATA_AGE_SECONDS = 60 * 60 * 24;
const FUTURE_CLOCK_SKEW_SECONDS = 5 * 60;

export type TelegramMiniAppUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  allows_write_to_pm?: boolean;
};

export type VerifiedTelegramInitData = {
  authDate: number;
  user: TelegramMiniAppUser;
};

function isTelegramUser(value: unknown): value is TelegramMiniAppUser {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "number" &&
    Number.isSafeInteger(candidate.id) &&
    typeof candidate.first_name === "string"
  );
}

export function verifyTelegramInitData(
  initData: string,
  botToken: string,
  currentTimeSeconds = Math.floor(Date.now() / 1000),
): VerifiedTelegramInitData | null {
  if (!initData || !botToken) {
    return null;
  }

  const parameters = new URLSearchParams(initData);
  const receivedHash = parameters.get("hash");
  const authDateValue = parameters.get("auth_date");
  const userValue = parameters.get("user");

  if (!receivedHash || !authDateValue || !userValue || !/^[a-f0-9]{64}$/i.test(receivedHash)) {
    return null;
  }

  const authDate = Number(authDateValue);
  if (
    !Number.isSafeInteger(authDate) ||
    authDate <= 0 ||
    authDate < currentTimeSeconds - MAX_INIT_DATA_AGE_SECONDS ||
    authDate > currentTimeSeconds + FUTURE_CLOCK_SKEW_SECONDS
  ) {
    return null;
  }

  let user: unknown;
  try {
    user = JSON.parse(userValue);
  } catch {
    return null;
  }

  if (!isTelegramUser(user)) {
    return null;
  }

  const dataCheckString = Array.from(parameters.entries())
    .filter(([key]) => key !== "hash")
    .sort(([firstKey], [secondKey]) =>
      firstKey === secondKey ? 0 : firstKey < secondKey ? -1 : 1,
    )
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();
  const calculatedHash = createHmac("sha256", secretKey).update(dataCheckString).digest();
  const suppliedHash = Buffer.from(receivedHash, "hex");

  if (calculatedHash.length !== suppliedHash.length || !timingSafeEqual(calculatedHash, suppliedHash)) {
    return null;
  }

  return { authDate, user };
}

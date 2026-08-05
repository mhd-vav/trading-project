// src/app/miniapp/page.tsx
import type { Metadata } from "next";
import MiniAppShell from "@/components/telegram/MiniAppShell";

export const metadata: Metadata = {
  title: "مینی‌اپ تلگرام",
  description: "فضای موبایل‌محور مافید برای تلگرام",
};

export default function TelegramMiniAppPage() {
  return <MiniAppShell />;
}

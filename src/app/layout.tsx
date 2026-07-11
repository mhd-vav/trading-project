import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/layout/SiteShell";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MAFID — هوش بازار",
    template: "%s | MAFID",
  },
  description: "پلتفرم هوشمندی بازار — تحلیل نمادمحور، ساختاریافته و قابل‌فهم",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

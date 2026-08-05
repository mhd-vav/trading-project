// src/components/layout/SiteShell.tsx
"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import Header from "./Header";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const usesWorkspaceChrome =
    pathname.startsWith("/app") || pathname.startsWith("/admin") || pathname.startsWith("/miniapp");

  if (usesWorkspaceChrome) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

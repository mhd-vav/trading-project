"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MEMBER_NAV } from "@/lib/member-nav";

export default function MemberSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-l border-border bg-surface md:block">
      <nav className="sticky top-16 space-y-1 p-4">
        {MEMBER_NAV.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted hover:bg-surface-elevated hover:text-foreground"
              }`}
            >
              <span className="w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { MEMBER_NAV } from "@/lib/member-nav";

export default function MemberTopbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border bg-surface md:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/app/dashboard" className="font-bold text-primary">MAFID</Link>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg border border-border px-3 py-1.5 text-sm text-foreground"
          aria-label="منو"
        >
          ☰
        </button>
      </div>
      {open && (
        <nav className="border-t border-border p-2">
          {MEMBER_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-elevated hover:text-foreground"
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

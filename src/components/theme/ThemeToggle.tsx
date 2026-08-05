// src/components/theme/ThemeToggle.tsx
"use client";

import { useTheme } from "@/components/theme/ThemeProvider";

export default function ThemeToggle() {
  const { resolvedTheme, setPreference } = useTheme();
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setPreference(nextTheme)}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-sm text-foreground transition-colors hover:border-primary/50 hover:bg-surface-elevated"
      aria-label={resolvedTheme === "dark" ? "فعال‌کردن حالت روشن" : "فعال‌کردن حالت تیره"}
      title={resolvedTheme === "dark" ? "حالت روشن" : "حالت تیره"}
    >
      {resolvedTheme === "dark" ? "☀" : "☾"}
    </button>
  );
}

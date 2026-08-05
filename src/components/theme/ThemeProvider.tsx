// src/components/theme/ThemeProvider.tsx
"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ThemePreference = "dark" | "light" | "system";

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: "dark" | "light";
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>("dark");
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("dark");
  const [isInitialized, setIsInitialized] = useState(false);
  const resolvedTheme = preference === "system" ? systemTheme : preference;

  useEffect(() => {
    const initialTimer = window.setTimeout(() => {
      const storedPreference = window.localStorage.getItem("mafid-theme");
      const nextPreference: ThemePreference =
        storedPreference === "light" || storedPreference === "system" ? storedPreference : "dark";
      const nextTheme = nextPreference === "system" ? getSystemTheme() : nextPreference;
      setPreference(nextPreference);
      setSystemTheme(getSystemTheme());
      document.documentElement.dataset.theme = nextTheme;
      document.documentElement.style.colorScheme = nextTheme;
      setIsInitialized(true);
    }, 0);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemTheme = () => {
      setSystemTheme(getSystemTheme());
    };

    mediaQuery.addEventListener("change", handleSystemTheme);

    return () => {
      window.clearTimeout(initialTimer);
      mediaQuery.removeEventListener("change", handleSystemTheme);
    };
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const nextTheme = preference === "system" ? systemTheme : preference;
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
  }, [isInitialized, preference, systemTheme]);

  const setThemePreference = useCallback((nextPreference: ThemePreference) => {
    const nextTheme = nextPreference === "system" ? getSystemTheme() : nextPreference;
    setPreference(nextPreference);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem("mafid-theme", nextPreference);
  }, []);

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference: setThemePreference }),
    [preference, resolvedTheme, setThemePreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider.");
  }

  return context;
}

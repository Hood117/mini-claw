"use client";

import { useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("mini_openclaw_theme");
    const resolved: Theme =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
          ? "dark"
          : "light";

    setTheme(resolved);
    applyTheme(resolved);
  }, []);

  const label = useMemo(() => {
    if (!theme) return "Theme";
    return theme === "dark" ? "Dark" : "Light";
  }, [theme]);

  return (
    <button
      type="button"
      aria-label="Toggle dark/light mode"
      onClick={() => {
        if (!theme) return;
        const next: Theme = theme === "dark" ? "light" : "dark";
        localStorage.setItem("mini_openclaw_theme", next);
        setTheme(next);
        applyTheme(next);
      }}
      className={[
        "inline-flex items-center gap-2 rounded-full border border-white/10",
        "bg-white/5 px-3 py-2 text-sm font-medium",
        "backdrop-blur supports-[backdrop-filter]:bg-white/5",
        "transition-transform duration-200 hover:scale-[1.03]",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500/60",
        theme ? "opacity-100" : "opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <span aria-hidden className="text-base leading-none">
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}


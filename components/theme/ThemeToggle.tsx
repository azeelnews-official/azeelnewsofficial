"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("azeel-theme");

    // Azeel News always starts in light mode unless the visitor
    // has explicitly selected dark mode.
    const isDark = saved === "dark";

    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
    setReady(true);
  }, []);

  function toggle() {
    const next = !dark;

    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("azeel-theme", next ? "dark" : "light");
    setDark(next);
  }

  if (!ready) {
    return (
      <button
        type="button"
        aria-label="Toggle dark mode"
        className="h-9 w-9 rounded-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 shadow-sm transition hover:scale-105 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

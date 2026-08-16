"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { uiStrings, type Locale, type UiStringKey } from "@/lib/i18n/dictionary";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: UiStringKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
const STORAGE_KEY = "azeel-locale";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // Deliberate: locale preference lives in localStorage, which has no
    // server equivalent, so this mount-time read is the correct
    // hydration-safe pattern rather than an effect anti-pattern.
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored === "en" || stored === "hi") setLocaleState(stored);
    } catch {
      // ignore storage errors
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore storage errors
    }
  }, []);

  const t = useCallback((key: UiStringKey) => uiStrings[locale][key], [locale]);

  return <LanguageContext.Provider value={{ locale, setLocale, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

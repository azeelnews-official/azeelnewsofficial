"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

// In-memory cache shared across the whole session — avoids re-fetching the
// same headline/dek translation every time a component remounts.
const translationCache = new Map<string, string>();

async function translateText(text: string, targetLang: "hi"): Promise<string> {
  const cacheKey = `${targetLang}:${text}`;
  const cached = translationCache.get(cacheKey);
  if (cached) return cached;

  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
  );
  if (!res.ok) throw new Error("translation request failed");
  const data = await res.json();
  const translated: string | undefined = data?.responseData?.translatedText;
  if (!translated) throw new Error("no translation returned");

  translationCache.set(cacheKey, translated);
  return translated;
}

/**
 * Returns `text` translated to Hindi when the site language is set to Hindi,
 * or the original English text otherwise (including while loading, or if
 * the free translation API is unavailable/rate-limited — fails open rather
 * than showing blank or broken text).
 */
export function useTranslatedText(text: string): string {
  const { locale } = useLanguage();
  const [translated, setTranslated] = useState<string | null>(null);

  useEffect(() => {
    if (locale !== "hi") return;
    let cancelled = false;
    translateText(text, "hi")
      .then((result) => {
        if (!cancelled) setTranslated(result);
      })
      .catch(() => {
        // Fail open: keep showing the English original.
      });
    return () => {
      cancelled = true;
    };
  }, [text, locale]);

  return locale === "hi" && translated ? translated : text;
}

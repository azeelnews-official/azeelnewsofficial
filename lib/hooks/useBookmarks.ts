"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "azeel-bookmarks";

function readBookmarks(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useBookmarks() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Deliberate: bookmarks live in localStorage, which has no server
    // equivalent, so this mount-time read is the correct hydration-safe
    // pattern rather than an effect anti-pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlugs(readBookmarks());
    setLoaded(true);
  }, []);

  const toggleBookmark = useCallback((slug: string) => {
    setSlugs((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  return { slugs, loaded, toggleBookmark, isBookmarked };
}

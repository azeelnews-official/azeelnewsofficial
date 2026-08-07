"use client";

import { useEffect, useState } from "react";
import { Facebook, Instagram, Youtube, Linkedin, Send, Moon, Sun, Mail } from "lucide-react";
import { WeatherWidget } from "./WeatherWidget";
import { useLanguage } from "@/components/i18n/LanguageProvider";

const SOCIAL_LINKS = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/azeelnews" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/azeelnews" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@azeelnews" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/azeelnews" },
  { icon: Send, label: "Telegram", href: "https://t.me/azeelnews" },
];

export function TopBar() {
  const [now, setNow] = useState<Date | null>(null);
  const [offsetMs, setOffsetMs] = useState(0);
  const { locale, setLocale } = useLanguage();
  const [dark, setDark] = useState(false);

  // Correct client clock drift against a real time API (free, no key).
  // Falls back silently to the device clock if the request fails.
  useEffect(() => {
    let cancelled = false;
    async function syncTime() {
      try {
        const res = await fetch("https://timeapi.io/api/Time/current/zone?timeZone=Asia%2FKolkata");
        if (!res.ok) return;
        const data = await res.json();
        const serverMs = new Date(data.dateTime).getTime();
        if (!cancelled) setOffsetMs(serverMs - Date.now());
      } catch {
        // fall back to local device time
      }
    }
    syncTime();
    const syncId = setInterval(syncTime, 10 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(syncId);
    };
  }, []);

  useEffect(() => {
    // Deliberate: the clock is a client-only display value with no server
    // equivalent, so setting it on mount (then ticking every second) is
    // the correct hydration-safe pattern rather than an effect anti-pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date(Date.now() + offsetMs));
    const id = setInterval(() => setNow(new Date(Date.now() + offsetMs)), 1000);
    return () => clearInterval(id);
  }, [offsetMs]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="hidden border-b border-hairline bg-ink-950 text-ink-100 md:block">
      <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-between px-4 text-xs">
        <div className="flex items-center gap-4 font-mono">
          {now && (
            <>
              <span>
                {now.toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="text-ink-300">|</span>
              <span aria-live="off" className="tabular-nums">
                {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} IST
              </span>
              <span className="text-ink-300">|</span>
              <WeatherWidget />
            </>
          )}
        </div>

        <div className="flex items-center gap-5">
          <a href="mailto:contact@azeelnews.in" className="flex items-center gap-1.5 text-ink-300 transition-colors hover:text-white">
            <Mail size={12} /> contact@azeelnews.in
          </a>
          <a href="/advertise" className="text-ink-300 transition-colors hover:text-white">
            Advertise With Us
          </a>
          <div className="flex items-center gap-3 border-l border-ink-800 pl-5">
            {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-ink-300 transition-colors hover:text-white"
              >
                <Icon size={14} strokeWidth={1.75} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-1 border-l border-ink-800 pl-5" role="group" aria-label="Language">
            <button
              onClick={() => setLocale("en")}
              aria-pressed={locale === "en"}
              className={`rounded px-2 py-1 transition-colors ${locale === "en" ? "bg-azeel text-white" : "text-ink-300 hover:text-white"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLocale("hi")}
              aria-pressed={locale === "hi"}
              className={`rounded px-2 py-1 transition-colors ${locale === "hi" ? "bg-azeel text-white" : "text-ink-300 hover:text-white"}`}
            >
              हिं
            </button>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="border-l border-ink-800 pl-5 text-ink-300 transition-colors hover:text-white"
          >
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
}

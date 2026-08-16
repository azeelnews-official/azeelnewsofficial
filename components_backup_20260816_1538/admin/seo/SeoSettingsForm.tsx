"use client";

import { useState } from "react";
import { Check, RefreshCw } from "lucide-react";

interface SeoSettings {
  titleTemplate: string;
  defaultDescription: string;
  ogImageUrl: string;
  twitterHandle: string;
  searchConsoleId: string;
  robotsTxt: string;
}

const DEFAULT_SETTINGS: SeoSettings = {
  titleTemplate: "%s | AZEEL NEWS",
  defaultDescription:
    "AZEEL NEWS delivers fast, verified reporting on India and world affairs — politics, business, technology, sports and more.",
  ogImageUrl: "https://www.azeelnews.com/og/home.jpg",
  twitterHandle: "@azeelnews",
  searchConsoleId: "",
  robotsTxt: "User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\n\nSitemap: https://www.azeelnews.com/sitemap.xml",
};

export function SeoSettingsForm() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  function update<K extends keyof SeoSettings>(key: K, value: SeoSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function regenerateSitemap() {
    setRegenerating(true);
    setTimeout(() => setRegenerating(false), 1200);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink-950">SEO</h1>
        <p className="text-sm text-ink-300">Defaults used across the site — individual posts can still override these.</p>
      </div>

      <form onSubmit={handleSave} className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-4 border border-hairline bg-surface p-5">
          <Field label="Title Template" hint="%s is replaced with the page title">
            <input
              value={settings.titleTemplate}
              onChange={(e) => update("titleTemplate", e.target.value)}
              className="w-full rounded-md border border-hairline px-3 py-2 text-sm text-ink-900 outline-none focus:border-azeel"
            />
          </Field>

          <Field label="Default Meta Description">
            <textarea
              value={settings.defaultDescription}
              onChange={(e) => update("defaultDescription", e.target.value.slice(0, 160))}
              rows={3}
              className="w-full resize-none rounded-md border border-hairline px-3 py-2 text-sm text-ink-900 outline-none focus:border-azeel"
            />
            <p className="mt-1 text-right font-mono text-[10px] text-ink-300">{settings.defaultDescription.length}/160</p>
          </Field>

          <Field label="Default OG Image URL">
            <input
              value={settings.ogImageUrl}
              onChange={(e) => update("ogImageUrl", e.target.value)}
              className="w-full rounded-md border border-hairline px-3 py-2 text-sm text-ink-900 outline-none focus:border-azeel"
            />
          </Field>

          <Field label="Twitter Handle">
            <input
              value={settings.twitterHandle}
              onChange={(e) => update("twitterHandle", e.target.value)}
              className="w-full rounded-md border border-hairline px-3 py-2 text-sm text-ink-900 outline-none focus:border-azeel"
            />
          </Field>

          <Field label="Google Search Console Verification" hint="Meta tag content value">
            <input
              value={settings.searchConsoleId}
              onChange={(e) => update("searchConsoleId", e.target.value)}
              placeholder="google-site-verification=…"
              className="w-full rounded-md border border-hairline px-3 py-2 font-mono text-xs text-ink-900 outline-none focus:border-azeel"
            />
          </Field>

          <Field label="robots.txt">
            <textarea
              value={settings.robotsTxt}
              onChange={(e) => update("robotsTxt", e.target.value)}
              rows={7}
              className="w-full resize-y rounded-md border border-hairline px-3 py-2 font-mono text-xs text-ink-900 outline-none focus:border-azeel"
            />
          </Field>

          <button
            type="submit"
            className="flex w-fit items-center gap-2 rounded-md bg-azeel px-4 py-2.5 text-sm font-semibold text-white hover:bg-azeel-dark"
          >
            {saved && <Check size={15} />}
            {saved ? "Saved" : "Save Settings"}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="border border-hairline bg-surface p-4">
            <h3 className="mb-2 font-display text-sm font-bold text-ink-950">Sitemap</h3>
            <p className="mb-3 text-xs text-ink-300">Last generated automatically on every build via app/sitemap.ts.</p>
            <button
              onClick={regenerateSitemap}
              className="flex w-full items-center justify-center gap-1.5 rounded-md border border-hairline px-3 py-2 text-sm font-semibold text-ink-800 hover:bg-ink-50"
            >
              <RefreshCw size={14} className={regenerating ? "animate-spin" : ""} />
              {regenerating ? "Regenerating…" : "Regenerate Now"}
            </button>
          </div>

          <div className="border border-hairline bg-surface p-4">
            <h3 className="mb-2 font-display text-sm font-bold text-ink-950">Search Preview</h3>
            <p className="truncate text-sm text-azeel">www.azeelnews.com</p>
            <p className="truncate text-base text-[#1a0dab]">
              {settings.titleTemplate.replace("%s", "Breaking News, India & World")}
            </p>
            <p className="line-clamp-2 text-xs text-ink-600">{settings.defaultDescription}</p>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">{label}</label>
      {hint && <p className="mb-1 text-xs text-ink-300">{hint}</p>}
      {children}
    </div>
  );
}

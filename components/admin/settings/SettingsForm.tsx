"use client";

import { useState } from "react";
import { Check, AlertTriangle } from "lucide-react";

interface SiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  supportPhone: string;
  timezone: string;
  defaultLanguage: "en" | "hi";
  maintenanceMode: boolean;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "AZEEL NEWS",
  tagline: "Reported. Verified. Delivered.",
  contactEmail: "editor@azeelnews.com",
  supportPhone: "+91 98765 43210",
  timezone: "Asia/Kolkata",
  defaultLanguage: "en",
  maintenanceMode: false,
};

export function SettingsForm() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink-950">Settings</h1>
        <p className="text-sm text-ink-300">General site identity, contact, and locale settings.</p>
      </div>

      <form onSubmit={handleSave} className="flex max-w-2xl flex-col gap-5">
        <div className="border border-hairline bg-surface p-5">
          <h2 className="mb-4 font-display text-sm font-bold text-ink-950">Site Identity</h2>
          <div className="flex flex-col gap-4">
            <Field label="Site Name">
              <input
                value={settings.siteName}
                onChange={(e) => update("siteName", e.target.value)}
                className="w-full rounded-md border border-hairline px-3 py-2 text-sm text-ink-900 outline-none focus:border-azeel"
              />
            </Field>
            <Field label="Tagline">
              <input
                value={settings.tagline}
                onChange={(e) => update("tagline", e.target.value)}
                className="w-full rounded-md border border-hairline px-3 py-2 text-sm text-ink-900 outline-none focus:border-azeel"
              />
            </Field>
          </div>
        </div>

        <div className="border border-hairline bg-surface p-5">
          <h2 className="mb-4 font-display text-sm font-bold text-ink-950">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Editorial Email">
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
                className="w-full rounded-md border border-hairline px-3 py-2 text-sm text-ink-900 outline-none focus:border-azeel"
              />
            </Field>
            <Field label="Support Phone">
              <input
                value={settings.supportPhone}
                onChange={(e) => update("supportPhone", e.target.value)}
                className="w-full rounded-md border border-hairline px-3 py-2 text-sm text-ink-900 outline-none focus:border-azeel"
              />
            </Field>
          </div>
        </div>

        <div className="border border-hairline bg-surface p-5">
          <h2 className="mb-4 font-display text-sm font-bold text-ink-950">Locale</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Timezone">
              <select
                value={settings.timezone}
                onChange={(e) => update("timezone", e.target.value)}
                className="w-full rounded-md border border-hairline px-2.5 py-2 text-sm text-ink-800 outline-none focus:border-azeel"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="UTC">UTC</option>
              </select>
            </Field>
            <Field label="Default Language">
              <select
                value={settings.defaultLanguage}
                onChange={(e) => update("defaultLanguage", e.target.value as "en" | "hi")}
                className="w-full rounded-md border border-hairline px-2.5 py-2 text-sm text-ink-800 outline-none focus:border-azeel"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </Field>
          </div>
        </div>

        <div className="border border-hairline bg-surface p-5">
          <h2 className="mb-3 font-display text-sm font-bold text-ink-950">Maintenance Mode</h2>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => update("maintenanceMode", e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-press"
            />
            <span className="text-sm text-ink-600">
              Show a maintenance page to visitors while keeping the admin panel accessible.
            </span>
          </label>
          {settings.maintenanceMode && (
            <p className="mt-3 flex items-center gap-2 rounded-md border border-press/30 bg-press/5 px-3 py-2 text-sm text-press">
              <AlertTriangle size={15} />
              The public site will show a maintenance page once this is saved.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="flex w-fit items-center gap-2 rounded-md bg-azeel px-4 py-2.5 text-sm font-semibold text-white hover:bg-azeel-dark"
        >
          {saved && <Check size={15} />}
          {saved ? "Saved" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">{label}</label>
      {children}
    </div>
  );
}

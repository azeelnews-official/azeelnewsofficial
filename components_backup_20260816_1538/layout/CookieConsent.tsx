"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "azeel-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [ads, setAds] = useState(true);

  useEffect(() => {
    // Deliberate: consent state lives in localStorage, which has no server
    // equivalent, so this mount-time read-and-reveal is the correct
    // hydration-safe pattern rather than an effect anti-pattern.
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!stored) setVisible(true);
  }, []);

  function persist(value: object) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-hairline-dark bg-ink-950 text-ink-100 shadow-[0_-4px_20px_rgba(0,0,0,0.25)]"
    >
      <div className="mx-auto max-w-[1400px] px-4 py-4">
        {!customizing ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-300">
              We use cookies to run this site, personalize content, and analyze traffic. Read our{" "}
              <a href="/privacy-policy" className="underline hover:text-white">
                Privacy Policy
              </a>
              .
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => setCustomizing(true)}
                className="rounded-md border border-ink-800 px-4 py-2 text-sm font-semibold text-ink-100 hover:border-ink-300"
              >
                Customize
              </button>
              <button
                onClick={() => persist({ necessary: true, analytics: false, ads: false })}
                className="rounded-md border border-ink-800 px-4 py-2 text-sm font-semibold text-ink-100 hover:border-ink-300"
              >
                Reject
              </button>
              <button
                onClick={() => persist({ necessary: true, analytics: true, ads: true })}
                className="rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white hover:bg-azeel-dark"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <ConsentToggle label="Strictly Necessary" checked disabled />
              <ConsentToggle label="Analytics" checked={analytics} onChange={setAnalytics} />
              <ConsentToggle label="Advertising" checked={ads} onChange={setAds} />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCustomizing(false)}
                className="rounded-md border border-ink-800 px-4 py-2 text-sm font-semibold text-ink-100 hover:border-ink-300"
              >
                Back
              </button>
              <button
                onClick={() => persist({ necessary: true, analytics, ads })}
                className="rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white hover:bg-azeel-dark"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConsentToggle({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-md border border-ink-800 px-3 py-2 text-sm">
      <span className={disabled ? "text-ink-300" : "text-ink-100"}>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="h-4 w-4 accent-azeel"
      />
    </label>
  );
}

"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

export function PWAInstallPrompt() {
  const [event, setEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    if (localStorage.getItem("azeel-pwa-dismissed") === "1") {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();

      setEvent(e as BeforeInstallPromptEvent);

      window.setTimeout(() => {
        setVisible(true);
      }, 1800);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  async function install() {
    if (!event) return;

    await event.prompt();

    try {
      await event.userChoice;
    } catch {
      // Browser may reject/close the prompt.
    }

    setEvent(null);
    setVisible(false);
  }

  function dismiss() {
    localStorage.setItem("azeel-pwa-dismissed", "1");
    setVisible(false);
  }

  if (!visible || !event) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[100] sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[380px]">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800">
            <Download size={19} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">
                  Install Azeel News
                </p>
                <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">
                  Get faster access to the latest news from your home screen.
                </p>
              </div>

              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss install prompt"
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={install}
                className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Install
              </button>

              <button
                type="button"
                onClick={dismiss}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Not now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

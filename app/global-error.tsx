"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#0B1220] px-4 text-white">
        <div className="max-w-md text-center">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-white/50">
            AZEEL NEWS
          </p>
          <h1 className="mb-3 text-2xl font-bold">Something went wrong</h1>
          <p className="mb-6 text-sm text-white/70">
            An unexpected error occurred while loading this page. Try refreshing — if it
            keeps happening, check the browser console for details.
          </p>
          <button
            onClick={reset}
            className="mx-auto flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[#0B1220] hover:bg-white/90"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}

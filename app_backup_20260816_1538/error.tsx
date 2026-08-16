"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-ink-300">
          AZEEL NEWS
        </p>
        <h1 className="mb-3 font-display text-2xl font-bold text-ink-950">Something went wrong</h1>
        <p className="mb-6 text-sm text-ink-600">
          This page hit an unexpected error. Try again, or head back home.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-md bg-azeel px-5 py-2.5 text-sm font-semibold text-white hover:bg-azeel-dark"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md border border-hairline px-5 py-2.5 text-sm font-semibold text-ink-800 hover:bg-paper-dim"
          >
            <Home size={15} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}

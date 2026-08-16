"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export function NewsletterInline() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="border border-hairline bg-ink-950 p-5 text-white">
      <Mail size={20} className="mb-2 text-press" />
      <h3 className="font-display text-base font-bold">Stay Ahead of the Story</h3>
      <p className="mt-1 text-sm text-ink-300">
        Get the day&apos;s top headlines delivered to your inbox every morning.
      </p>
      {submitted ? (
        <p className="mt-3 text-sm font-medium text-press-light">You&apos;re subscribed. Welcome aboard.</p>
      ) : (
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <label htmlFor="inline-newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="inline-newsletter-email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-md border border-ink-800 bg-ink-900 px-3 py-2 text-sm text-white outline-none placeholder:text-ink-300 focus:border-azeel"
          />
          <button
            type="submit"
            className="shrink-0 rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white hover:bg-azeel-dark"
          >
            Join
          </button>
        </form>
      )}
    </div>
  );
}

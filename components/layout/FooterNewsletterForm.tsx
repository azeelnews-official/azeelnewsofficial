"use client";

import { useState } from "react";

export function FooterNewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return <p className="text-sm font-medium text-azeel-light">You&apos;re subscribed. Welcome aboard.</p>;
  }

  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <label htmlFor="footer-email" className="sr-only">
        Email address
      </label>
      <input
        id="footer-email"
        type="email"
        required
        placeholder="you@example.com"
        className="w-full rounded-md border border-ink-800 bg-ink-900 px-3 py-2 text-sm text-white outline-none placeholder:text-ink-300 focus:border-azeel"
      />
      <button
        type="submit"
        className="shrink-0 rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-azeel-dark"
      >
        Join
      </button>
    </form>
  );
}

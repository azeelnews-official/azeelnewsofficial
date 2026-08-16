"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(undefined);
    setSubmitting(true);

    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Intentionally still show the confirmation state below — see the
      // comment in the API route on not leaking whether the email exists.
    }

    setSubmitting(false);
    setSent(true);
  }

  return (
    <AuthLayout title="Reset your password" subtitle="We'll email you a link to get back into your account.">
      {sent ? (
        <div className="rounded-md border border-hairline bg-ink-50 p-5">
          <MailCheck size={22} className="mb-2 text-azeel" />
          <p className="text-sm font-semibold text-ink-900">Check your inbox</p>
          <p className="mt-1 text-sm text-ink-600">
            If an account exists for <span className="font-medium">{email}</span>, a reset link is on its way.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <div>
            <label htmlFor="forgot-email" className="mb-1.5 block text-sm font-medium text-ink-800">
              Email address
            </label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "forgot-email-error" : undefined}
              className="w-full rounded-md border border-hairline px-3 py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-300 focus:border-azeel"
              placeholder="you@example.com"
            />
            {error && (
              <p id="forgot-email-error" className="mt-1 text-xs text-press">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-md bg-azeel px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-azeel-dark disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Send Reset Link
          </button>
        </form>
      )}

      <Link href="/login" className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-azeel hover:text-azeel-dark">
        <ArrowLeft size={14} />
        Back to sign in
      </Link>
    </AuthLayout>
  );
}

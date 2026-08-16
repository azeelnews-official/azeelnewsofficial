"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { PasswordField } from "@/components/auth/PasswordField";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setError(undefined);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try again.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 1200);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <AuthLayout title="Invalid reset link" subtitle="This password reset link is missing its token.">
        <div className="rounded-md border border-hairline bg-ink-50 p-4">
          <ShieldAlert size={20} className="mb-2 text-press" />
          <p className="text-sm text-ink-800">
            Request a new link from the{" "}
            <Link href="/forgot-password" className="font-semibold text-azeel hover:text-azeel-dark">
              forgot password
            </Link>{" "}
            page.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a strong password you haven't used before.">
      {success ? (
        <p className="rounded-md border border-hairline bg-ink-50 p-4 text-sm text-ink-800">
          Password updated. Redirecting to sign in…
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {error && (
            <p className="rounded-md border border-press/30 bg-press/5 px-3 py-2 text-sm text-press">{error}</p>
          )}
          <PasswordField label="New password" value={password} onChange={setPassword} autoComplete="new-password" />
          <PasswordField
            label="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-md bg-azeel px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-azeel-dark disabled:opacity-60"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            Update Password
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { PasswordField } from "@/components/auth/PasswordField";
import { useAuth } from "@/components/auth/AuthProvider";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  form?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(): boolean {
    const next: FormErrors = {};
    if (name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 8) next.password = "Password must be at least 8 characters.";
    if (confirmPassword !== password) next.confirmPassword = "Passwords don't match.";
    if (!agreedToTerms) next.terms = "You must accept the Terms and Privacy Policy.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: data.error ?? "Something went wrong. Try again." });
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      await refresh();
      setTimeout(() => router.push("/"), 800);
    } catch {
      setErrors({ form: "Couldn't reach the server. Check your connection and try again." });
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join AZEEL NEWS to save stories and follow topics.">
      {success ? (
        <p className="rounded-md border border-hairline bg-ink-50 p-4 text-sm text-ink-800">
          Account created. Redirecting…
        </p>
      ) : (
        <>
          <GoogleButton label="Continue with Google" />

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-hairline" />
            <span className="font-mono text-[11px] uppercase tracking-eyebrow text-ink-300">or</span>
            <span className="h-px flex-1 bg-hairline" />
          </div>

          {errors.form && (
            <p className="mb-4 rounded-md border border-press/30 bg-press/5 px-3 py-2 text-sm text-press">
              {errors.form}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div>
              <label htmlFor="register-name" className="mb-1.5 block text-sm font-medium text-ink-800">
                Full name
              </label>
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "register-name-error" : undefined}
                className="w-full rounded-md border border-hairline px-3 py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-300 focus:border-azeel"
                placeholder="Your name"
              />
              {errors.name && (
                <p id="register-name-error" className="mt-1 text-xs text-press">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="register-email" className="mb-1.5 block text-sm font-medium text-ink-800">
                Email address
              </label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "register-email-error" : undefined}
                className="w-full rounded-md border border-hairline px-3 py-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-300 focus:border-azeel"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p id="register-email-error" className="mt-1 text-xs text-press">
                  {errors.email}
                </p>
              )}
            </div>

            <PasswordField
              label="Password"
              value={password}
              onChange={setPassword}
              error={errors.password}
              autoComplete="new-password"
            />
            <PasswordField
              label="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <div>
              <label className="flex items-start gap-2 text-sm text-ink-600">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-azeel"
                />
                <span>
                  I agree to the{" "}
                  <Link href="/terms" className="font-medium text-azeel hover:text-azeel-dark">
                    Terms of Use
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="font-medium text-azeel hover:text-azeel-dark">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.terms && <p className="mt-1 text-xs text-press">{errors.terms}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-md bg-azeel px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-azeel-dark disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-300">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-azeel hover:text-azeel-dark">
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}

"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function PasswordField({
  label,
  value,
  onChange,
  error,
  autoComplete = "current-password",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: "current-password" | "new-password";
}) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-800">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full rounded-md border border-hairline px-3 py-2.5 pr-10 text-sm text-ink-900 outline-none placeholder:text-ink-300 focus:border-azeel"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-600"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-press">
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, LogOut, User } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export function ProfileView() {
  const { user, loading, signOut } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [savedName, setSavedName] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <User size={28} className="mx-auto mb-3 text-ink-300" />
        <h1 className="mb-2 font-display text-2xl font-bold text-ink-950">Sign in to view your profile</h1>
        <p className="mb-5 text-sm text-ink-300">Save bookmarks, manage your account, and personalize your feed.</p>
        <Link
          href="/login?next=/profile"
          className="inline-block rounded-md bg-azeel px-5 py-2.5 text-sm font-semibold text-white hover:bg-azeel-dark"
        >
          Sign In
        </Link>
      </div>
    );
  }

  function handleSaveName(e: React.FormEvent) {
    e.preventDefault();
    setSavedName(true);
    setTimeout(() => setSavedName(false), 1800);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-azeel text-2xl font-semibold text-white">
          {user.email.charAt(0).toUpperCase()}
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-950">{displayName || user.email}</h1>
          <p className="text-sm capitalize text-ink-300">{user.role.toLowerCase()}</p>
        </div>
      </div>

      <div className="mb-5 border border-hairline bg-surface p-5">
        <h2 className="mb-4 font-display text-sm font-bold text-ink-950">Account</h2>
        <form onSubmit={handleSaveName} className="flex flex-col gap-4">
          <div>
            <label htmlFor="profile-email" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">
              Email
            </label>
            <input
              id="profile-email"
              value={user.email}
              disabled
              className="w-full rounded-md border border-hairline bg-ink-50 px-3 py-2 text-sm text-ink-600 outline-none"
            />
          </div>
          <div>
            <label htmlFor="profile-name" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">
              Display Name
            </label>
            <input
              id="profile-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How should we address you?"
              className="w-full rounded-md border border-hairline px-3 py-2 text-sm text-ink-900 outline-none placeholder:text-ink-300 focus:border-azeel"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input
              type="checkbox"
              checked={emailUpdates}
              onChange={(e) => setEmailUpdates(e.target.checked)}
              className="h-4 w-4 accent-azeel"
            />
            Send me the daily morning briefing email
          </label>
          <button
            type="submit"
            className="w-fit rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white hover:bg-azeel-dark"
          >
            {savedName ? "Saved" : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-3 border border-hairline bg-surface p-5">
        <Link href="/bookmarks" className="flex items-center gap-2 text-sm font-medium text-ink-800 hover:text-azeel">
          <Bookmark size={15} /> View Bookmarks
        </Link>
        <button onClick={signOut} className="flex items-center gap-2 text-sm font-medium text-press hover:text-press-dark">
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </div>
  );
}

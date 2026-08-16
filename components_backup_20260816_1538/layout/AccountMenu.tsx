"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

const EDITORIAL_ROLES = new Set(["JOURNALIST", "EDITOR", "ADMIN"]);

export function AccountMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-1.5 rounded-full p-1 pr-2 text-ink-800 transition-colors hover:bg-ink-50"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-azeel text-xs font-semibold text-white">
          {user.email.charAt(0).toUpperCase()}
        </span>
        <ChevronDown size={14} className="text-ink-300" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-md border border-hairline bg-surface py-1 shadow-lg">
          <div className="border-b border-hairline px-3 py-2">
            <p className="truncate text-sm font-medium text-ink-900">{user.email}</p>
            <p className="text-xs capitalize text-ink-300">{user.role.toLowerCase()}</p>
          </div>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-ink-800 hover:bg-ink-50"
          >
            <User size={15} /> Profile
          </Link>
          <Link
            href="/bookmarks"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-ink-800 hover:bg-ink-50"
          >
            <Bookmark size={15} /> Bookmarks
          </Link>
          {EDITORIAL_ROLES.has(user.role) && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-ink-800 hover:bg-ink-50"
            >
              <LayoutDashboard size={15} /> Admin
            </Link>
          )}
          <button
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-press hover:bg-press/5"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

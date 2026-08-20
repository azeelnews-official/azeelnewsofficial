"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Search } from "lucide-react";
import { NotificationsBell } from "@/components/shared/NotificationsBell";
import { adminNotifications } from "@/lib/mock-data";

export function AdminTopbar({ adminName = "Alok", onMenuClick }: { adminName?: string; onMenuClick?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-hairline bg-surface px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="text-ink-800 lg:hidden" aria-label="Open admin menu">
          <Menu size={22} />
        </button>
        <div className="hidden items-center gap-2 rounded-md border border-hairline px-3 py-1.5 md:flex">
          <Search size={15} className="text-ink-300" />
          <input
            type="search"
            placeholder="Search posts, users, settings…"
            className="w-64 bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-300"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/admin/posts/new" className="hidden rounded-md bg-azeel px-3.5 py-2 text-sm font-semibold text-white hover:bg-azeel-dark sm:block">
          New Post
        </Link>
        <NotificationsBell initialNotifications={adminNotifications} />

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-ink-50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-azeel text-sm font-semibold text-white">
              {adminName.charAt(0)}
            </span>
            <span className="hidden text-sm font-medium text-ink-800 sm:block">{adminName}</span>
            <ChevronDown size={14} className="text-ink-300" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 rounded-md border border-hairline bg-surface py-1 shadow-lg">
              <Link href="/admin/settings" className="block px-3 py-2 text-sm text-ink-800 hover:bg-ink-50">
                Account Settings
              </Link>
              <Link href="/" className="block px-3 py-2 text-sm text-ink-800 hover:bg-ink-50">
                View Site
              </Link>
              <button className="block w-full px-3 py-2 text-left text-sm text-press hover:bg-ink-50">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

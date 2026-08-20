"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";
import type { AppNotification } from "@/lib/mock-data";
import { formatRelativeTime, cn } from "@/lib/utils";

export function NotificationsBell({ initialNotifications }: { initialNotifications: AppNotification[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative text-ink-600 hover:text-ink-900"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-press font-mono text-[9px] text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[90vw] rounded-md border border-hairline bg-surface shadow-lg">
            <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
              <h3 className="font-display text-sm font-bold text-ink-950">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="flex items-center gap-1 text-xs font-semibold text-azeel hover:text-azeel-dark">
                  <Check size={12} /> Mark all read
                </button>
              )}
            </div>
            <ul className="max-h-80 divide-y divide-hairline overflow-y-auto">
              {notifications.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => markRead(n.id)}
                    className={cn("block w-full px-4 py-3 text-left hover:bg-paper-dim", !n.read && "bg-azeel/5")}
                  >
                    <div className="mb-0.5 flex items-center gap-1.5">
                      {!n.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-azeel" />}
                      <p className="text-sm font-semibold text-ink-900">{n.title}</p>
                    </div>
                    <p className="line-clamp-2 text-xs text-ink-600">{n.body}</p>
                    <p className="mt-1 font-mono text-[10px] text-ink-300">{formatRelativeTime(n.createdAt)}</p>
                  </button>
                </li>
              ))}
              {notifications.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-ink-300">You&apos;re all caught up.</li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

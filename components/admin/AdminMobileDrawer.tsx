"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { AdminNavContent } from "./AdminSidebar";

export function AdminMobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <button
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/60"
      />
      <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-ink-950 py-5 shadow-xl">
        <div className="mb-6 flex items-center justify-between px-5">
          <Link href="/" onClick={onClose}>
            <span className="font-display text-xl font-black tracking-masthead text-white">
              AZEEL <span className="text-press">NEWS</span>
            </span>
            <span className="mt-0.5 block font-mono text-[10px] tracking-eyebrow text-ink-300">ADMIN</span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full p-1.5 text-ink-300 hover:bg-ink-900 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <AdminNavContent onNavigate={onClose} />
      </aside>
    </div>
  );
}

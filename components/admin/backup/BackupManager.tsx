"use client";

import { useState } from "react";
import { DatabaseBackup, Download, RotateCcw, Trash2, Loader2 } from "lucide-react";
import type { AdminBackup } from "@/lib/types/admin";
import { formatRelativeTime } from "@/lib/utils";

export function BackupManager({ initialBackups }: { initialBackups: AdminBackup[] }) {
  const [backups, setBackups] = useState(initialBackups);
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [creating, setCreating] = useState(false);

  function createBackup() {
    setCreating(true);
    setTimeout(() => {
      setBackups((prev) => [
        { id: `b-${crypto.randomUUID()}`, createdAt: new Date().toISOString(), sizeMb: 410 + Math.round(Math.random() * 10), type: "manual" },
        ...prev,
      ]);
      setCreating(false);
    }, 1200);
  }

  function remove(id: string) {
    if (!window.confirm("Delete this backup? This cannot be undone.")) return;
    setBackups((prev) => prev.filter((b) => b.id !== id));
  }

  function restore(id: string) {
    window.confirm(
      "Restoring will overwrite current data with this backup. This is a UI-only demo — no data will actually change."
    );
    void id;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-950">Backup</h1>
          <p className="text-sm text-ink-300">{backups.length} backups stored.</p>
        </div>
        <button
          onClick={createBackup}
          disabled={creating}
          className="flex items-center gap-2 rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white hover:bg-azeel-dark disabled:opacity-60"
        >
          {creating ? <Loader2 size={15} className="animate-spin" /> : <DatabaseBackup size={15} />}
          {creating ? "Creating…" : "Create Backup Now"}
        </button>
      </div>

      <div className="mb-5 flex items-center gap-3 border border-hairline bg-surface p-4">
        <span className="text-sm font-semibold text-ink-800">Automatic backup schedule:</span>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")}
          className="rounded-md border border-hairline px-2.5 py-1.5 text-sm text-ink-800 outline-none focus:border-azeel"
        >
          <option value="daily">Daily at 2:00 AM IST</option>
          <option value="weekly">Weekly (Sunday, 2:00 AM IST)</option>
        </select>
      </div>

      <div className="overflow-x-auto border border-hairline bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-hairline text-xs uppercase tracking-wide text-ink-300">
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-3 py-3 font-medium">Type</th>
              <th className="px-3 py-3 font-medium">Size</th>
              <th className="px-3 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {backups
              .slice()
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((b) => (
                <tr key={b.id} className="border-b border-hairline last:border-0 hover:bg-ink-50/50">
                  <td className="px-4 py-3 text-ink-800">{formatRelativeTime(b.createdAt)}</td>
                  <td className="px-3 py-3 capitalize text-ink-600">{b.type}</td>
                  <td className="px-3 py-3 text-ink-600">{b.sizeMb} MB</td>
                  <td className="px-3 py-3">
                    <div className="flex justify-end gap-1">
                      <button aria-label="Download" className="rounded p-1.5 text-ink-300 hover:bg-ink-50 hover:text-ink-800">
                        <Download size={15} />
                      </button>
                      <button onClick={() => restore(b.id)} aria-label="Restore" className="rounded p-1.5 text-ink-300 hover:bg-ink-50 hover:text-ink-800">
                        <RotateCcw size={15} />
                      </button>
                      <button onClick={() => remove(b.id)} aria-label="Delete" className="rounded p-1.5 text-ink-300 hover:bg-press/10 hover:text-press">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Search, ScrollText } from "lucide-react";
import type { AuditLogEntry } from "@/lib/types/admin";
import { formatRelativeTime } from "@/lib/utils";

const ACTION_CATEGORY_STYLES: Record<string, string> = {
  post: "bg-azeel/10 text-azeel-dark border-azeel/20",
  comment: "bg-press/10 text-press border-press/20",
  user: "bg-ink-950 text-white border-ink-950",
  category: "bg-green-50 text-green-700 border-green-200",
  auth: "bg-ink-50 text-ink-600 border-hairline",
  ad: "bg-azeel/10 text-azeel-dark border-azeel/20",
};

export function LogsViewer({ initialEntries }: { initialEntries: AuditLogEntry[] }) {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categories = useMemo(
    () => Array.from(new Set(initialEntries.map((e) => e.action.split(".")[0] ?? ""))),
    [initialEntries]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialEntries.filter((e) => {
      const category = e.action.split(".")[0] ?? "";
      if (categoryFilter !== "all" && category !== categoryFilter) return false;
      if (q && !e.action.toLowerCase().includes(q) && !e.actor.toLowerCase().includes(q) && !e.entity.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [initialEntries, query, categoryFilter]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink-950">Logs</h1>
        <p className="text-sm text-ink-300">Audit trail of actions taken across the admin panel.</p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3 border border-hairline bg-surface p-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-md border border-hairline px-3 py-1.5">
          <Search size={15} className="text-ink-300" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by action, user, or entity…"
            className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-300"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border border-hairline px-2.5 py-1.5 text-sm capitalize text-ink-800 outline-none focus:border-azeel"
        >
          <option value="all">All actions</option>
          {categories.map((c) => (
            <option key={c} value={c} className="capitalize">
              {c}
            </option>
          ))}
        </select>
        <span className="ml-auto font-mono text-xs text-ink-300">{filtered.length} entries</span>
      </div>

      <ul className="divide-y divide-hairline border border-hairline bg-surface">
        {filtered.map((entry) => {
          const category = entry.action.split(".")[0] ?? "";
          return (
            <li key={entry.id} className="flex items-start gap-3 px-4 py-3">
              <ScrollText size={15} className="mt-0.5 shrink-0 text-ink-300" />
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${
                      ACTION_CATEGORY_STYLES[category] ?? "bg-ink-50 text-ink-600 border-hairline"
                    }`}
                  >
                    {entry.action}
                  </span>
                  <span className="text-sm font-medium text-ink-900">{entry.actor}</span>
                </div>
                <p className="line-clamp-1 text-sm text-ink-600">{entry.entity}</p>
              </div>
              <span className="shrink-0 font-mono text-[11px] text-ink-300">{formatRelativeTime(entry.createdAt)}</span>
            </li>
          );
        })}
        {filtered.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-ink-300">No log entries match your filters.</li>
        )}
      </ul>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import type { AdminRedirect } from "@/lib/types/admin";

export function RedirectsManager({ initialRedirects }: { initialRedirects: AdminRedirect[] }) {
  const [redirects, setRedirects] = useState(initialRedirects);
  const [fromPath, setFromPath] = useState("");
  const [toPath, setToPath] = useState("");
  const [statusCode, setStatusCode] = useState<301 | 302 | 307>(301);

  function addRedirect(e: React.FormEvent) {
    e.preventDefault();
    if (!fromPath.trim() || !toPath.trim()) return;
    setRedirects((prev) => [
      { id: `r-${Date.now()}`, fromPath: normalizePath(fromPath), toPath: normalizePath(toPath), statusCode },
      ...prev,
    ]);
    setFromPath("");
    setToPath("");
  }

  function remove(id: string) {
    setRedirects((prev) => prev.filter((r) => r.id !== id));
  }

  function normalizePath(path: string) {
    const trimmed = path.trim();
    return trimmed.startsWith("/") || trimmed.startsWith("http") ? trimmed : `/${trimmed}`;
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold text-ink-950">Redirects</h1>
        <p className="text-sm text-ink-300">{redirects.length} active redirects.</p>
      </div>

      <form onSubmit={addRedirect} className="mb-5 flex flex-wrap items-end gap-3 border border-hairline bg-surface p-4">
        <div className="min-w-[180px] flex-1">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">From</label>
          <input
            value={fromPath}
            onChange={(e) => setFromPath(e.target.value)}
            placeholder="/old-path"
            className="w-full rounded-md border border-hairline px-3 py-2 font-mono text-xs text-ink-900 outline-none focus:border-azeel"
          />
        </div>
        <ArrowRight size={16} className="mb-2.5 shrink-0 text-ink-300" />
        <div className="min-w-[180px] flex-1">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">To</label>
          <input
            value={toPath}
            onChange={(e) => setToPath(e.target.value)}
            placeholder="/new-path"
            className="w-full rounded-md border border-hairline px-3 py-2 font-mono text-xs text-ink-900 outline-none focus:border-azeel"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">Type</label>
          <select
            value={statusCode}
            onChange={(e) => setStatusCode(Number(e.target.value) as 301 | 302 | 307)}
            className="rounded-md border border-hairline px-2.5 py-2 text-sm text-ink-800 outline-none focus:border-azeel"
          >
            <option value={301}>301 Permanent</option>
            <option value={302}>302 Temporary</option>
            <option value={307}>307 Temporary (strict)</option>
          </select>
        </div>
        <button type="submit" className="flex items-center gap-1.5 rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white hover:bg-azeel-dark">
          <Plus size={15} /> Add
        </button>
      </form>

      <div className="overflow-x-auto border border-hairline bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-hairline text-xs uppercase tracking-wide text-ink-300">
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-3 py-3 font-medium">To</th>
              <th className="px-3 py-3 font-medium">Type</th>
              <th className="px-3 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {redirects.map((r) => (
              <tr key={r.id} className="border-b border-hairline last:border-0 hover:bg-ink-50/50">
                <td className="px-4 py-3 font-mono text-xs text-ink-800">{r.fromPath}</td>
                <td className="px-3 py-3 font-mono text-xs text-ink-600">{r.toPath}</td>
                <td className="px-3 py-3 text-ink-600">{r.statusCode}</td>
                <td className="px-3 py-3">
                  <div className="flex justify-end">
                    <button onClick={() => remove(r.id)} aria-label="Delete redirect" className="rounded p-1.5 text-ink-300 hover:bg-press/10 hover:text-press">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {redirects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-ink-300">
                  No redirects yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

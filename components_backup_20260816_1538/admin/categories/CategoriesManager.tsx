"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface CategoryRow {
  slug: string;
  label: string;
  labelHi: string;
  postCount: number;
}

export function CategoriesManager({ initialCategories }: { initialCategories: CategoryRow[] }) {
  const [rows, setRows] = useState(initialCategories);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [draftLabel, setDraftLabel] = useState("");
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  function startEdit(row: CategoryRow) {
    setEditingSlug(row.slug);
    setDraftLabel(row.label);
  }

  function saveEdit(slug: string) {
    setRows((prev) => prev.map((r) => (r.slug === slug ? { ...r, label: draftLabel } : r)));
    setEditingSlug(null);
  }

  function remove(slug: string) {
    if (!window.confirm("Delete this category? Posts assigned to it will need to be reassigned.")) return;
    setRows((prev) => prev.filter((r) => r.slug !== slug));
  }

  function addCategory() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const slug = trimmed.toLowerCase().replace(/\s+/g, "-");
    if (rows.some((r) => r.slug === slug)) return;
    setRows((prev) => [...prev, { slug, label: trimmed, labelHi: "", postCount: 0 }]);
    setNewName("");
    setAdding(false);
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink-950">Categories</h1>
        <button
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-1.5 rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white hover:bg-azeel-dark"
        >
          <Plus size={15} /> New Category
        </button>
      </div>

      {adding && (
        <div className="mb-4 flex items-center gap-2 border border-hairline bg-surface p-3">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            placeholder="Category name"
            className="w-full max-w-xs rounded-md border border-hairline px-3 py-1.5 text-sm text-ink-900 outline-none focus:border-azeel"
          />
          <button onClick={addCategory} className="rounded-md bg-azeel px-3 py-1.5 text-sm font-semibold text-white hover:bg-azeel-dark">
            Add
          </button>
          <button onClick={() => setAdding(false)} className="rounded-md px-3 py-1.5 text-sm text-ink-600 hover:bg-ink-50">
            Cancel
          </button>
        </div>
      )}

      <div className="overflow-x-auto border border-hairline bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-hairline text-xs uppercase tracking-wide text-ink-300">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-3 py-3 font-medium">Slug</th>
              <th className="px-3 py-3 font-medium">Posts</th>
              <th className="px-3 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.slug} className="border-b border-hairline last:border-0 hover:bg-ink-50/50">
                <td className="px-4 py-3">
                  {editingSlug === row.slug ? (
                    <input
                      autoFocus
                      value={draftLabel}
                      onChange={(e) => setDraftLabel(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(row.slug)}
                      className="rounded-md border border-hairline px-2 py-1 text-sm outline-none focus:border-azeel"
                    />
                  ) : (
                    <span className="font-medium text-ink-900">{row.label}</span>
                  )}
                </td>
                <td className="px-3 py-3 font-mono text-xs text-ink-300">/{row.slug}</td>
                <td className="px-3 py-3 text-ink-600">{row.postCount}</td>
                <td className="px-3 py-3">
                  <div className="flex justify-end gap-1">
                    {editingSlug === row.slug ? (
                      <>
                        <button onClick={() => saveEdit(row.slug)} aria-label="Save" className="rounded p-1.5 text-green-600 hover:bg-green-50">
                          <Check size={15} />
                        </button>
                        <button onClick={() => setEditingSlug(null)} aria-label="Cancel" className="rounded p-1.5 text-ink-300 hover:bg-ink-50">
                          <X size={15} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(row)} aria-label="Edit" className="rounded p-1.5 text-ink-300 hover:bg-ink-50 hover:text-ink-800">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => remove(row.slug)} aria-label="Delete" className="rounded p-1.5 text-ink-300 hover:bg-press/10 hover:text-press">
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
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

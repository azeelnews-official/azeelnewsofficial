"use client";

import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import type { AdminPage } from "@/lib/types/admin";

export function PagesManager({ initialPages }: { initialPages: AdminPage[] }) {
  const [pages, setPages] = useState(initialPages);
  const [selectedId, setSelectedId] = useState(initialPages[0]?.id ?? "");
  const [draftTitle, setDraftTitle] = useState(initialPages[0]?.title ?? "");
  const [draftContent, setDraftContent] = useState(initialPages[0]?.content ?? "");
  const [saved, setSaved] = useState(false);

  const selected = pages.find((p) => p.id === selectedId);

  function selectPage(page: AdminPage) {
    setSelectedId(page.id);
    setDraftTitle(page.title);
    setDraftContent(page.content);
    setSaved(false);
  }

  function save() {
    if (!selected) return;
    setPages((prev) =>
      prev.map((p) =>
        p.id === selected.id
          ? { ...p, title: draftTitle, content: draftContent, updatedAt: new Date().toISOString().slice(0, 10) }
          : p
      )
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  function addPage() {
    const title = window.prompt("Page title?");
    if (!title?.trim()) return;
    const slug = title.trim().toLowerCase().replace(/\s+/g, "-");
    const newPage: AdminPage = {
      id: `page-${Date.now()}`,
      slug,
      title: title.trim(),
      content: "",
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setPages((prev) => [...prev, newPage]);
    selectPage(newPage);
  }

  function removePage(id: string) {
    if (!window.confirm("Delete this page?")) return;
    setPages((prev) => prev.filter((p) => p.id !== id));
    if (selectedId === id) {
      const next = pages.find((p) => p.id !== id);
      if (next) selectPage(next);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink-950">Pages</h1>
        <button onClick={addPage} className="flex items-center gap-1.5 rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white hover:bg-azeel-dark">
          <Plus size={15} /> New Page
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <ul className="divide-y divide-hairline border border-hairline bg-surface">
          {pages.map((page) => (
            <li key={page.id}>
              <button
                onClick={() => selectPage(page)}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm ${
                  page.id === selectedId ? "bg-azeel/5 font-semibold text-azeel-dark" : "text-ink-800 hover:bg-ink-50"
                }`}
              >
                <span>{page.title}</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    removePage(page.id);
                  }}
                  role="button"
                  aria-label={`Delete ${page.title}`}
                  className="rounded p-1 text-ink-300 hover:bg-press/10 hover:text-press"
                >
                  <Trash2 size={13} />
                </span>
              </button>
            </li>
          ))}
        </ul>

        {selected ? (
          <div className="border border-hairline bg-surface p-5">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">Title</label>
            <input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="mb-4 w-full rounded-md border border-hairline px-3 py-2 font-display text-lg font-bold text-ink-950 outline-none focus:border-azeel"
            />
            <p className="mb-4 font-mono text-xs text-ink-300">/{selected.slug}</p>

            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">Content</label>
            <textarea
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              rows={12}
              className="mb-4 w-full resize-y rounded-md border border-hairline px-3 py-2 text-sm leading-relaxed text-ink-900 outline-none focus:border-azeel"
            />

            <button
              onClick={save}
              className="flex items-center gap-2 rounded-md bg-azeel px-4 py-2.5 text-sm font-semibold text-white hover:bg-azeel-dark"
            >
              <Save size={15} />
              {saved ? "Saved" : "Save Page"}
            </button>
          </div>
        ) : (
          <p className="border border-dashed border-hairline p-10 text-center text-sm text-ink-300">
            Select or create a page to edit.
          </p>
        )}
      </div>
    </div>
  );
}

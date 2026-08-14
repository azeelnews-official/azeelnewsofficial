"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { AdminMenu, AdminMenuItem as MenuItem } from "@/lib/data/menus";

export function MenusManager({ initialMenus }: { initialMenus: AdminMenu[] }) {
  const [menus, setMenus] = useState(initialMenus);
  const [activeMenuId, setActiveMenuId] = useState(initialMenus[0]?.id ?? "");
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");

  const activeMenu = menus.find((m) => m.id === activeMenuId);

  function updateItems(menuId: string, items: MenuItem[]) {
    setMenus((prev) => prev.map((m) => (m.id === menuId ? { ...m, items } : m)));
  }

  function addItem(e: React.FormEvent) {
    e.preventDefault();
    if (!activeMenu || !label.trim() || !url.trim()) return;
    const newItem: MenuItem = {
      id: `item-${crypto.randomUUID()}`,
      label: label.trim(),
      url: url.trim(),
      order: activeMenu.items.length,
      active: true,
    };
    updateItems(activeMenu.id, [...activeMenu.items, newItem]);
    setLabel("");
    setUrl("");
  }

  function removeItem(id: string) {
    if (!activeMenu) return;
    updateItems(activeMenu.id, activeMenu.items.filter((i) => i.id !== id));
  }

  function moveItem(index: number, direction: -1 | 1) {
    if (!activeMenu) return;
    const items = [...activeMenu.items];
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const itemAt = items[index];
    const itemTarget = items[target];
    if (!itemAt || !itemTarget) return;
    items[index] = itemTarget;
    items[target] = itemAt;
    updateItems(activeMenu.id, items);
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold text-ink-950">Menus</h1>
        <p className="text-sm text-ink-300">Manage the links shown in navigation and footer menus.</p>
      </div>

      <div className="mb-5 flex gap-1 border-b border-hairline">
        {menus.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMenuId(m.id)}
            className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              m.id === activeMenuId ? "border-azeel text-azeel-dark" : "border-transparent text-ink-300 hover:text-ink-800"
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {activeMenu && (
        <>
          <form onSubmit={addItem} className="mb-5 flex flex-wrap items-end gap-3 border border-hairline bg-surface p-4">
            <div className="min-w-[160px] flex-1">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">Label</label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Link label"
                className="w-full rounded-md border border-hairline px-3 py-2 text-sm text-ink-900 outline-none focus:border-azeel"
              />
            </div>
            <div className="min-w-[160px] flex-1">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-300">URL</label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/path"
                className="w-full rounded-md border border-hairline px-3 py-2 font-mono text-xs text-ink-900 outline-none focus:border-azeel"
              />
            </div>
            <button type="submit" className="flex items-center gap-1.5 rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white hover:bg-azeel-dark">
              <Plus size={15} /> Add Item
            </button>
          </form>

          <ul className="divide-y divide-hairline border border-hairline bg-surface">
            {activeMenu.items.map((item, index) => (
              <li key={item.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-ink-900">{item.label}</p>
                  <p className="font-mono text-xs text-ink-300">{item.url}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                    aria-label="Move up"
                    className="rounded p-1.5 text-ink-300 hover:bg-ink-50 hover:text-ink-800 disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => moveItem(index, 1)}
                    disabled={index === activeMenu.items.length - 1}
                    aria-label="Move down"
                    className="rounded p-1.5 text-ink-300 hover:bg-ink-50 hover:text-ink-800 disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button onClick={() => removeItem(item.id)} aria-label="Delete item" className="rounded p-1.5 text-ink-300 hover:bg-press/10 hover:text-press">
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
            {activeMenu.items.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-ink-300">This menu has no items yet.</li>
            )}
          </ul>
        </>
      )}
    </div>
  );
}

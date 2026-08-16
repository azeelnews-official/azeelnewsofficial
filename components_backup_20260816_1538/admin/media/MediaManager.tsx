"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Search, Upload, Copy, Check, Trash2, Film } from "lucide-react";
import type { AdminMediaItem } from "@/lib/types/admin";

export function MediaManager({ initialItems }: { initialItems: AdminMediaItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter((i) => i.altText.toLowerCase().includes(query.trim().toLowerCase()));

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;

    const uploaded: AdminMediaItem[] = await Promise.all(
      Array.from(files).map(async (file, i) => {
        const fallback: AdminMediaItem = {
          id: `upload-${Date.now()}-${i}`,
          url: URL.createObjectURL(file),
          type: file.type.startsWith("video") ? "video" : "image",
          altText: file.name,
          uploadedAt: new Date().toISOString(),
        };
        try {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body: formData });
          if (res.ok) {
            const data = await res.json();
            return { ...fallback, url: data.url };
          }
        } catch {
          // Cloudinary isn't configured (or the request failed) — the
          // local object-URL fallback above keeps the library usable.
        }
        return fallback;
      })
    );

    setItems((prev) => [...uploaded, ...prev]);
    e.target.value = "";
  }

  async function copyUrl(item: AdminMediaItem) {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  function remove(id: string) {
    if (!window.confirm("Delete this media item?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink-950">Media Library</h1>
        <div>
          <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple onChange={handleUpload} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white hover:bg-azeel-dark"
          >
            <Upload size={15} /> Upload
          </button>
        </div>
      </div>

      <div className="mb-5 flex items-center gap-2 border border-hairline bg-surface p-3">
        <Search size={15} className="text-ink-300" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by description…"
          className="w-full max-w-xs bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-300"
        />
        <span className="ml-auto font-mono text-xs text-ink-300">{filtered.length} files</span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((item) => (
          <div key={item.id} className="group border border-hairline bg-surface">
            <div className="relative aspect-square overflow-hidden bg-ink-100">
              {item.type === "video" ? (
                <div className="flex h-full items-center justify-center text-ink-300">
                  <Film size={28} />
                </div>
              ) : (
                <Image src={item.url} alt={item.altText} fill sizes="200px" className="object-cover" />
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-ink-950/0 opacity-0 transition-all group-hover:bg-ink-950/40 group-hover:opacity-100">
                <button
                  onClick={() => copyUrl(item)}
                  aria-label="Copy URL"
                  className="rounded-full bg-surface p-2 text-ink-800 hover:bg-ink-50"
                >
                  {copiedId === item.id ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                </button>
                <button
                  onClick={() => remove(item.id)}
                  aria-label="Delete"
                  className="rounded-full bg-surface p-2 text-press hover:bg-press/10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="p-2">
              <p className="line-clamp-1 text-xs font-medium text-ink-800">{item.altText}</p>
              {item.usedBy && <p className="mt-0.5 line-clamp-1 text-[10px] text-ink-300">Used in: {item.usedBy}</p>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-ink-300">No media matches your search.</p>
        )}
      </div>
    </div>
  );
}

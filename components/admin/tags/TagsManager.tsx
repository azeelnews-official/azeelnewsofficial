"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import type { TagUsage } from "@/lib/types/admin";

export function TagsManager({ initialTags }: { initialTags: TagUsage[] }) {
  const [tags, setTags] = useState(initialTags);
  const [query, setQuery] = useState("");

  const filtered = tags.filter((t) => t.name.toLowerCase().includes(query.trim().toLowerCase()));

  function remove(slug: string) {
    setTags((prev) => prev.filter((t) => t.slug !== slug));
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-2xl font-bold text-ink-950">Tags</h1>
        <p className="text-sm text-ink-300">{tags.length} tags in use across all posts.</p>
      </div>

      <div className="mb-5 flex items-center gap-2 border border-hairline bg-surface p-3">
        <Search size={15} className="text-ink-300" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tags…"
          className="w-full max-w-xs bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-300"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filtered.map((tag) => (
          <span
            key={tag.slug}
            className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3 py-1.5 text-sm text-ink-800"
          >
            {tag.name}
            <span className="rounded-full bg-ink-50 px-1.5 py-0.5 font-mono text-[10px] text-ink-300">
              {tag.postCount}
            </span>
            <button
              onClick={() => remove(tag.slug)}
              aria-label={`Delete tag ${tag.name}`}
              className="text-ink-300 hover:text-press"
            >
              <X size={13} />
            </button>
          </span>
        ))}
        {filtered.length === 0 && <p className="text-sm text-ink-300">No tags match your search.</p>}
      </div>
    </div>
  );
}

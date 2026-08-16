"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchPageBar({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      }}
      className="flex items-center gap-2 border border-hairline bg-surface px-4 py-3"
    >
      <Search size={18} className="shrink-0 text-ink-300" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search news, topics, authors…"
        className="w-full bg-transparent text-base text-ink-900 outline-none placeholder:text-ink-300"
      />
      <button
        type="submit"
        className="shrink-0 rounded-md bg-azeel px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-azeel-dark"
      >
        Search
      </button>
    </form>
  );
}

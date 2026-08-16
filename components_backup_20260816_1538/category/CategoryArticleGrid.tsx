"use client";

import { useMemo, useState } from "react";
import { ArrowDownWideNarrow, Flame, Clock } from "lucide-react";
import type { Article } from "@/lib/types";
import { ArticleCard } from "@/components/home/ArticleCard";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 6;
type SortKey = "latest" | "popular";

export function CategoryArticleGrid({ articles }: { articles: Article[] }) {
  const [sort, setSort] = useState<SortKey>("latest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const sorted = useMemo(() => {
    const copy = [...articles];
    if (sort === "popular") {
      copy.sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    } else {
      copy.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }
    return copy;
  }, [articles, sort]);

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  if (!articles.length) {
    return (
      <p className="border border-dashed border-hairline p-8 text-center text-sm text-ink-300">
        No stories published in this section yet. Check back soon.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="font-mono text-xs text-ink-300">
          {sorted.length} {sorted.length === 1 ? "story" : "stories"}
        </p>
        <div className="flex items-center gap-1 rounded-md border border-hairline p-1" role="group" aria-label="Sort stories">
          <SortButton
            active={sort === "latest"}
            onClick={() => {
              setSort("latest");
              setVisibleCount(PAGE_SIZE);
            }}
            icon={<Clock size={13} />}
            label="Latest"
          />
          <SortButton
            active={sort === "popular"}
            onClick={() => {
              setSort("popular");
              setVisibleCount(PAGE_SIZE);
            }}
            icon={<Flame size={13} />}
            label="Popular"
          />
        </div>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="flex items-center gap-2 rounded-md border border-ink-950 px-6 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-ink-950 hover:text-white"
          >
            <ArrowDownWideNarrow size={15} />
            Load More Stories
          </button>
        </div>
      )}
    </div>
  );
}

function SortButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold transition-colors",
        active ? "bg-azeel text-white" : "text-ink-600 hover:bg-ink-50"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

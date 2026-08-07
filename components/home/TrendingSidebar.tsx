import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatViews } from "@/lib/utils";
import { Flame } from "lucide-react";

export function TrendingSidebar({ articles }: { articles: Article[] }) {
  return (
    <aside aria-labelledby="trending-heading" className="border border-hairline bg-surface">
      <div className="flex items-center gap-2 border-b border-hairline bg-ink-950 px-4 py-3">
        <Flame size={16} className="text-press" />
        <h2 id="trending-heading" className="font-display text-sm font-bold uppercase tracking-wide text-white">
          Trending Now
        </h2>
      </div>
      <ol className="divide-y divide-hairline">
        {articles.map((article, i) => (
          <li key={article.id}>
            <Link href={`/article/${article.slug}`} className="group flex gap-3 px-4 py-3.5">
              <span className="font-display text-2xl font-bold leading-none text-ink-100 group-hover:text-azeel">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-ink-900 group-hover:text-azeel-dark">
                  {article.headline}
                </h3>
                <span className="font-mono text-[11px] text-ink-300">{formatViews(article.views)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}

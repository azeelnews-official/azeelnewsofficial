import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article, CategorySlug } from "@/lib/types";
import { ArticleCard } from "./ArticleCard";
import { getCategoryLabel } from "@/lib/data/constants";

export function CategorySection({
  categorySlug,
  articles,
}: {
  categorySlug: CategorySlug;
  articles: Article[];
}) {
  const label = getCategoryLabel(categorySlug);

  return (
    <section aria-labelledby={`section-${categorySlug}`} className="py-10">
      <div className="mb-6 flex items-end justify-between border-b-2 border-ink-950 pb-3">
        <h2 id={`section-${categorySlug}`} className="font-display text-2xl font-bold text-ink-950">
          {label}
        </h2>
        <Link
          href={`/category/${categorySlug}`}
          className="flex items-center gap-1 text-sm font-semibold text-azeel transition-colors hover:text-azeel-dark"
        >
          View all
          <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}

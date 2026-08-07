import type { Article } from "@/lib/types";
import { ArticleCard } from "@/components/home/ArticleCard";

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;
  return (
    <section aria-labelledby="related-heading" className="border-t border-hairline py-10">
      <h2 id="related-heading" className="mb-6 font-display text-xl font-bold text-ink-950">
        Related Coverage
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}

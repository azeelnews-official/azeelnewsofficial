"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/lib/hooks/useBookmarks";

import { ArticleCard } from "@/components/home/ArticleCard";

export function BookmarksList() {
  const { slugs, loaded } = useBookmarks();
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {

    if (!loaded || slugs.length === 0) {
      setArticles([]);
      return;
    }

    fetch(`/api/bookmarks?slugs=${slugs.join(",")}`)
      .then((res) => res.json())
      .then((data) => setArticles(data));

  }, [loaded, slugs]);

  if (!loaded) return null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-ink-950">Bookmarks</h1>
        <p className="text-sm text-ink-300">Stories you&apos;ve saved to read later.</p>
      </div>

      {articles.length === 0 ? (
        <div className="border border-dashed border-hairline p-10 text-center">
          <Bookmark size={28} className="mx-auto mb-3 text-ink-300" />
          <p className="mb-1 text-sm font-semibold text-ink-800">No bookmarks yet</p>
          <p className="mb-4 text-sm text-ink-300">
            Tap the bookmark icon on any article to save it here.
          </p>
          <Link href="/" className="text-sm font-semibold text-azeel hover:text-azeel-dark">
            Browse the latest stories
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

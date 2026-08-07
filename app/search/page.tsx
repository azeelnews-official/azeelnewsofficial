import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Flame } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { AdSlot } from "@/components/home/AdSlot";
import { ArticleCard } from "@/components/home/ArticleCard";
import { SearchPageBar } from "@/components/search/SearchPageBar";
import { searchArticles, trendingSearches } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? searchArticles(query) : [];

  return (
    <>
      <TopBar />
      <Header />

      <main id="main-content" className="mx-auto max-w-[1400px] px-4 py-8">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-ink-300">
          <Link href="/" className="hover:text-azeel">
            Home
          </Link>
          <ChevronRight size={12} />
          <span className="text-ink-600" aria-current="page">
            Search
          </span>
        </nav>

        <h1 className="mb-5 font-display text-2xl font-bold text-ink-950 md:text-3xl">
          {query ? (
            <>
              Results for <span className="text-azeel-dark">&ldquo;{query}&rdquo;</span>
            </>
          ) : (
            "Search AZEEL NEWS"
          )}
        </h1>

        <div className="mb-8 max-w-2xl">
          <SearchPageBar initialQuery={query} />
        </div>

        {query && (
          <p className="mb-6 font-mono text-xs text-ink-300">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
        )}

        {query && results.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="border border-dashed border-hairline p-8 text-center">
            <p className="mb-1 text-sm font-semibold text-ink-800">No stories matched your search.</p>
            <p className="text-sm text-ink-300">Try a different keyword, or explore what&apos;s trending below.</p>
          </div>
        )}

        {(!query || results.length === 0) && (
          <div className="mt-10">
            <p className="mb-3 flex items-center gap-1.5 font-mono text-xs uppercase tracking-eyebrow text-ink-300">
              <Flame size={13} /> Trending Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term) => (
                <Link
                  key={term}
                  href={`/search?q=${encodeURIComponent(term)}`}
                  className="rounded-full border border-hairline px-4 py-1.5 text-sm font-medium text-ink-600 hover:border-azeel hover:text-azeel-dark"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <AdSlot size="leaderboard" />
        </div>
      </main>

      <Footer />
      <CookieConsent />
    </>
  );
}

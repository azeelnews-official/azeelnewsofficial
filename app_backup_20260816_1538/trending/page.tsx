import type { Metadata } from "next";
import { Flame } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { ArticleCard } from "@/components/home/ArticleCard";
import { getPublishedArticles } from "@/lib/data/articles";

export const metadata: Metadata = {
  title: "Trending",
  description: "The most-read stories on AZEEL NEWS right now.",
  alternates: { canonical: "/trending" },
};

export default async function TrendingPage() {
  const articles = (await getPublishedArticles())
    .slice()
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0));

  return (
    <>
      <TopBar />
      <Header />
      <main id="main-content" className="mx-auto max-w-[1400px] px-4 py-10">
        <div className="mb-8 flex items-center gap-2">
          <Flame className="text-press" size={26} />
          <h1 className="font-display text-3xl font-bold text-ink-950 md:text-4xl">Trending</h1>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <div key={article.id} className="relative">
              <span className="absolute -left-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ink-950 font-display text-sm font-bold text-white">
                {i + 1}
              </span>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      </main>
      <Footer />
      <CookieConsent />
    </>
  );
}

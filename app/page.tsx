import type { Metadata } from "next";

import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { BreakingTicker } from "@/components/layout/BreakingTicker";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { HeroSection } from "@/components/home/HeroSection";
import { ArticleCard } from "@/components/home/ArticleCard";
import { TrendingSidebar } from "@/components/home/TrendingSidebar";
import { CategorySection } from "@/components/home/CategorySection";
import { VideoGallery } from "@/components/home/VideoGallery";
import { AdSlot } from "@/components/home/AdSlot";

import {
  getPublishedArticlesAsArticles,
  getPublishedArticlesByCategoryAsArticles,
} from "@/lib/content/articles";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Azeel News, India & World",
  description:
    "Live updates on India and world affairs — politics, business, technology, sports and entertainment, reported and verified by AZEEL NEWS.",
  alternates: {
    canonical: "/",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.azeelnews.in/",
    },
  ],
};

export default async function HomePage() {
  const allArticles = await getPublishedArticlesAsArticles(50);

  const heroArticle = allArticles[0];

  const topStories = allArticles.slice(1, 7);

  const trending = allArticles.slice(0, 5);

  const world = await getPublishedArticlesByCategoryAsArticles(
    "world",
    4
  );

  const business = await getPublishedArticlesByCategoryAsArticles(
    "business",
    4
  );

  const technology =
    await getPublishedArticlesByCategoryAsArticles(
      "technology",
      4
    );

  const breakingArticles = allArticles.filter(
    (article) => article.isBreaking
  );

  const tickerItems = breakingArticles
    .slice(0, 8)
    .map((article) => ({
      id: article.id,
      text: article.headline,
      href: `/article/${article.slug}`,
    }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <TopBar />
      <Header />

      {tickerItems.length > 0 && (
        <BreakingTicker items={tickerItems} />
      )}

      <main id="main-content">
        {heroArticle && (
          <HeroSection article={heroArticle} />
        )}

        <div className="mx-auto max-w-[1400px] px-4">
          <div className="py-6">
            <AdSlot size="leaderboard" />
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
            <div>
              <h2 className="mb-6 border-b-2 border-ink-950 pb-3 font-display text-2xl font-bold text-ink-950">
                Top Stories
              </h2>

              {topStories.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2">
                  {topStories.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-400">
                  No published stories yet.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-8">
              <TrendingSidebar articles={trending} />

              <AdSlot size="sidebar" />
            </div>
          </div>

          <CategorySection
            categorySlug="world"
            articles={world}
          />

          <CategorySection
            categorySlug="business"
            articles={business}
          />

          <div className="py-6">
            <AdSlot size="inline" />
          </div>

          <CategorySection
            categorySlug="technology"
            articles={technology}
          />
        </div>

        <VideoGallery articles={trending} />
      </main>

      <Footer />
      <CookieConsent />
    </>
  );
}

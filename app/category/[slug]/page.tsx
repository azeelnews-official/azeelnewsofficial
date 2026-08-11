import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import {
  getPublishedArticlesAsArticles,
  getPublishedArticlesByCategoryAsArticles,
} from "@/lib/content/articles";

import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { CategorySubNav } from "@/components/category/CategorySubNav";
import { CategoryArticleGrid } from "@/components/category/CategoryArticleGrid";
import { HeroSection } from "@/components/home/HeroSection";
import { TrendingSidebar } from "@/components/home/TrendingSidebar";
import { AdSlot } from "@/components/home/AdSlot";

const SITE_URL = "https://www.azeelnews.in";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({
    select: {
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: {
      slug,
    },
  });

  if (!category) {
    return {};
  }

  const title = `${category.name} News`;
  const description = `Latest ${category.name.toLowerCase()} news, analysis and updates — reported and verified by AZEEL NEWS.`;

  return {
    title,
    description,

    alternates: {
      canonical: `/category/${category.slug}`,
    },

    openGraph: {
      type: "website",
      title,
      description,
      url: `${SITE_URL}/category/${category.slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: {
      slug,
    },
  });

  if (!category) {
    notFound();
  }

  const articles =
    await getPublishedArticlesByCategoryAsArticles(
      category.slug,
      50
    );

  const [leadStory, ...restStories] = articles;

  const trending =
    await getPublishedArticlesAsArticles(5);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} News`,
    url: `${SITE_URL}/category/${category.slug}`,
    isPartOf: {
      "@type": "WebSite",
      name: "AZEEL NEWS",
      url: SITE_URL,
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
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.name,
        item: `${SITE_URL}/category/${category.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <TopBar />

      <Header />

      <main id="main-content">
        <div className="mx-auto max-w-[1400px] px-4 pt-6">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1.5 text-xs text-ink-300"
          >
            <Link
              href="/"
              className="hover:text-azeel"
            >
              Home
            </Link>

            <ChevronRight size={12} />

            <span
              className="text-ink-600"
              aria-current="page"
            >
              {category.name}
            </span>
          </nav>

          <h1 className="mb-1 font-display text-3xl font-bold text-ink-950 md:text-4xl">
            {category.name}
          </h1>

          <p className="mb-6 text-sm text-ink-300">
            {category.nameHi}
          </p>

          <CategorySubNav active={category.slug as never} />
        </div>

        {leadStory && (
          <HeroSection article={leadStory} />
        )}

        <div className="mx-auto max-w-[1400px] px-4">
          <div className="py-6">
            <AdSlot size="leaderboard" />
          </div>

          <div className="grid gap-10 pb-12 lg:grid-cols-[1fr_320px]">
            <div>
              {restStories.length > 0 ? (
                <CategoryArticleGrid
                  articles={restStories}
                />
              ) : !leadStory ? (
                <div className="border-y border-hairline py-16 text-center">
                  <p className="text-sm text-ink-400">
                    No published stories in this category yet.
                  </p>
                </div>
              ) : null}
            </div>

            <aside className="flex flex-col gap-8">
              <TrendingSidebar
                articles={trending}
              />

              <AdSlot size="sidebar" />
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      <CookieConsent />
    </>
  );
}

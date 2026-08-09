import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { AdSlot } from "@/components/home/AdSlot";
import { ArticleMeta } from "@/components/home/ArticleMeta";
import { AuthorCard } from "@/components/article/AuthorCard";
import { TagList } from "@/components/article/TagList";
import { ArticleInteractive } from "@/components/article/ArticleInteractive";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { CommentSection } from "@/components/article/CommentSection";
import { NewsletterInline } from "@/components/article/NewsletterInline";
import { GoogleNewsFollow } from "@/components/article/GoogleNewsFollow";
import {
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
  getCategoryLabel,
  mockComments,
} from "@/lib/mock-data";

const SITE_URL = "https://www.azeelnews.in";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.headline,
    description: article.dek,
    alternates: { canonical: `/article/${article.slug}` },
    authors: [{ name: article.author.name }],
    openGraph: {
      type: "article",
      title: article.headline,
      description: article.dek,
      url: `${SITE_URL}/article/${article.slug}`,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      section: getCategoryLabel(article.category),
      tags: article.tags,
      images: [{ url: article.imageUrl, width: 1200, height: 800, alt: article.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.headline,
      description: article.dek,
      images: [article.imageUrl],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article);
  const comments = mockComments[article.id] ?? [];
  const categoryLabel = getCategoryLabel(article.category);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.headline,
    description: article.dek,
    image: [article.imageUrl],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: [{ "@type": "Person", name: article.author.name }],
    publisher: {
      "@type": "Organization",
      name: "AZEEL NEWS",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/article/${article.slug}` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryLabel,
        item: `${SITE_URL}/category/${article.category}`,
      },
      { "@type": "ListItem", position: 3, name: article.headline, item: `${SITE_URL}/article/${article.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <TopBar />
      <Header />

      <main id="main-content" className="mx-auto max-w-[1400px] px-4 py-8">
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs text-ink-300">
          <Link href="/" className="hover:text-azeel">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href={`/category/${article.category}`} className="hover:text-azeel">
            {categoryLabel}
          </Link>
          <ChevronRight size={12} />
          <span className="truncate text-ink-600" aria-current="page">
            {article.headline}
          </span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <article>
            <span className="mb-3 inline-block rounded-sm bg-azeel px-2 py-1 font-mono text-[11px] font-semibold uppercase tracking-eyebrow text-white">
              {categoryLabel}
            </span>
            <h1 className="mb-3 font-display text-3xl font-bold leading-[1.1] text-ink-950 md:text-[2.75rem]">
              {article.headline}
            </h1>
            <p className="mb-5 text-lg leading-relaxed text-ink-600">
              {article.location && (
                <span className="font-semibold uppercase text-ink-800">{article.location}: </span>
              )}
              {article.dek}
            </p>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
              <AuthorCard author={article.author} />
              <ArticleMeta
                authorName={`Published ${new Date(article.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
                publishedAt={article.updatedAt}
                readingTimeMin={article.readingTimeMin}
              />
            </div>

            <div className="relative mb-8 aspect-[16/9] overflow-hidden bg-ink-100">
              <Image
                src={article.imageUrl}
                alt={article.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
            </div>

            <ArticleInteractive article={article} />

            <div className="my-8">
              <AdSlot size="inline" />
            </div>

            <div className="mb-8 flex flex-col gap-4">
              <TagList tags={article.tags ?? []} />
              <GoogleNewsFollow />
            </div>

            <CommentSection articleId={article.id} initialComments={comments} />
          </article>

          <aside className="flex flex-col gap-8">
            <AdSlot size="sidebar" />
            <NewsletterInline />
          </aside>
        </div>

        <RelatedArticles articles={related} />
      </main>

      <Footer />
      <CookieConsent />
    </>
  );
}

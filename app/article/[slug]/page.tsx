import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";
import type { Article, CategorySlug, Comment } from "@/lib/types";

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

const SITE_URL = "https://www.azeelnews.in";

/**
 * This page must always read published articles from Prisma.
 * Do not use mock-data here.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Convert Markdown body into the paragraph format expected
 * by ArticleInteractive.
 */
function bodyToParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/^\s*[-*]\s+/gm, "")
        .replace(/^\s*\d+\.\s+/gm, "")
        .trim()
    )
    .filter(Boolean);
}

/**
 * Create a safe author slug when the database User model
 * does not have a dedicated slug field.
 */
function createAuthorSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Convert a Prisma Post into the Article shape already expected
 * by the existing frontend components.
 */
function mapPostToArticle(post: {
  id: string;
  slug: string;
  headline: string;
  dek: string;
  body: string;
  featuredImageUrl: string;
  featuredImageAlt: string;
  readingTimeMin: number;
  views: number;
  isBreaking: boolean;
  isLive: boolean;
  publishedAt: Date | null;
  updatedAt: Date;
  author: {
    name: string;
    image: string | null;
    role: string;
  };
  category: {
    slug: string;
    name: string;
  };
  tags: {
    tag: {
      name: string;
    };
  }[];
}): Article {
  return {
    id: post.id,
    slug: post.slug,
    headline: post.headline,
    dek: post.dek,

    category: post.category.slug as CategorySlug,

    author: {
      name: post.author.name,
      slug: createAuthorSlug(post.author.name),
      role: post.author.role,
      avatarUrl: post.author.image ?? "",
    },

    publishedAt: (
      post.publishedAt ??
      post.updatedAt
    ).toISOString(),

    updatedAt: post.updatedAt.toISOString(),

    readingTimeMin: post.readingTimeMin,

    imageUrl: post.featuredImageUrl,
    imageAlt: post.featuredImageAlt,

    isLive: post.isLive,
    isBreaking: post.isBreaking,
    views: post.views,

    tags: post.tags.map((item) => item.tag.name),

    body: bodyToParagraphs(post.body),
  };
}

/**
 * Get one published article directly from Prisma.
 */
async function getPublishedArticle(slug: string) {
  return prisma.post.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    include: {
      author: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
}

/**
 * Generate metadata from the real database article.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = await getPublishedArticle(slug);

  if (!post) {
    return {};
  }

  const article = mapPostToArticle(post);

  return {
    title: article.headline,
    description: article.dek,

    alternates: {
      canonical: `/article/${article.slug}`,
    },

    authors: [
      {
        name: article.author.name,
      },
    ],

    openGraph: {
      type: "article",
      title: article.headline,
      description: article.dek,
      url: `${SITE_URL}/article/${article.slug}`,

      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,

      authors: [article.author.name],

      section: post.category.name,

      tags: article.tags,

      images: [
        {
          url: article.imageUrl,
          width: 1200,
          height: 800,
          alt: article.imageAlt,
        },
      ],
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

  /**
   * IMPORTANT:
   * Article comes directly from Prisma.
   * Only PUBLISHED posts are accessible publicly.
   */
  const post = await getPublishedArticle(slug);

  if (!post) {
    notFound();
  }

  const article = mapPostToArticle(post);

  const categoryLabel = post.category.name;

  /**
   * Get related published articles from the database.
   */
  const relatedPosts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      categoryId: post.categoryId,
      id: {
        not: post.id,
      },
    },
    include: {
      author: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 4,
  });

  const related: Article[] = relatedPosts.map(mapPostToArticle);

  /**
   * Real database comments.
   *
   * The current user is used to determine:
   * - whether the user has liked a comment
   * - whether the user can delete a comment
   */
  const session = await getCurrentSession();
  const currentUserId = session?.sub ?? null;

  const databaseComments = await prisma.comment.findMany({
    where: {
      postId: post.id,
    },
    include: {
      author: true,
      likesByUsers: {
        select: {
          userId: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const comments: Comment[] = databaseComments.map((comment) => ({
    id: comment.id,
    articleId: comment.postId,
    authorName: comment.author.name,
    postedAt: comment.createdAt.toISOString(),
    text: comment.text,
    likes: comment.likes,

    liked:
      currentUserId !== null &&
      comment.likesByUsers.some(
        (like) => like.userId === currentUserId
      ),

    canDelete: currentUserId === comment.authorId,

    status: "approved",
  }));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",

    headline: article.headline,
    description: article.dek,

    image: [article.imageUrl],

    datePublished: article.publishedAt,
    dateModified: article.updatedAt,

    author: [
      {
        "@type": "Person",
        name: article.author.name,
      },
    ],

    publisher: {
      "@type": "Organization",
      name: "AZEEL NEWS",

      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/article/${article.slug}`,
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
        name: categoryLabel,
        item: `${SITE_URL}/category/${post.category.slug}`,
      },

      {
        "@type": "ListItem",
        position: 3,
        name: article.headline,
        item: `${SITE_URL}/article/${article.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
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

      <main
        id="main-content"
        className="mx-auto max-w-[1400px] px-4 py-8"
      >
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex items-center gap-1.5 text-xs text-ink-300"
        >
          <Link
            href="/"
            className="hover:text-azeel"
          >
            Home
          </Link>

          <ChevronRight size={12} />

          <Link
            href={`/category/${post.category.slug}`}
            className="hover:text-azeel"
          >
            {categoryLabel}
          </Link>

          <ChevronRight size={12} />

          <span
            className="truncate text-ink-600"
            aria-current="page"
          >
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
              {article.dek}
            </p>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
              <AuthorCard author={article.author} />

              <ArticleMeta
                authorName={`Published ${new Date(
                  article.publishedAt
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}`}
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

            <CommentSection
              articleId={article.id}
              initialComments={comments}
            />
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
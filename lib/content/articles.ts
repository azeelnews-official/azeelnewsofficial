import { prisma } from "@/lib/prisma";
import type { Article, CategorySlug } from "@/lib/types";

function createAuthorSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

export function mapPostToArticle(post: {
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
    nameHi: string;
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
      post.publishedAt ?? post.updatedAt
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

const articleInclude = {
  author: {
    select: {
      name: true,
      image: true,
      role: true,
    },
  },
  category: true,
  tags: {
    include: {
      tag: true,
    },
  },
} as const;

export async function getPublishedArticles(limit?: number) {
  return prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        not: null,
      },
    },
    include: articleInclude,
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    ...(limit ? { take: limit } : {}),
  });
}

export async function getPublishedArticlesAsArticles(limit?: number) {
  const posts = await getPublishedArticles(limit);
  return posts.map(mapPostToArticle);
}

export async function getPublishedArticlesByCategory(
  categorySlug: string,
  limit?: number
) {
  return prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        not: null,
      },
      category: {
        slug: categorySlug,
      },
    },
    include: articleInclude,
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    ...(limit ? { take: limit } : {}),
  });
}

export async function getPublishedArticlesByCategoryAsArticles(
  categorySlug: string,
  limit?: number
) {
  const posts = await getPublishedArticlesByCategory(
    categorySlug,
    limit
  );

  return posts.map(mapPostToArticle);
}

export async function getPublishedArticleBySlug(slug: string) {
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

export async function getRelatedArticles(
  postId: string,
  categoryId: string,
  limit = 4
) {
  const posts = await prisma.post.findMany({
    where: {
      id: {
        not: postId,
      },
      status: "PUBLISHED",
      publishedAt: {
        not: null,
      },
      categoryId,
    },
    include: articleInclude,
    orderBy: {
      publishedAt: "desc",
    },
    take: limit,
  });

  return posts.map(mapPostToArticle);
}

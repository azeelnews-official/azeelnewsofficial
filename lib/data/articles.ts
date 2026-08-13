import { prisma } from "@/lib/prisma";

const categories = [
  "india",
  "world",
  "politics",
  "business",
  "technology",
  "sports",
  "entertainment",
  "health",
  "explainers",
] as const;

type CategorySlug = typeof categories[number];

export async function getPublishedArticles() {
  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
    },

    orderBy: {
      publishedAt: "desc",
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


  return posts.map((post)=>({

    id: post.id,

    slug: post.slug,

    headline: post.headline,

    dek: post.dek,

    category: (
      categories.includes(
        post.category.slug as CategorySlug
      )
      ? post.category.slug
      : "india"
    ) as CategorySlug,


    imageUrl: post.featuredImageUrl,

    imageAlt:
      post.featuredImageAlt ??
      post.headline,


    featuredImageUrl:
      post.featuredImageUrl,


    author:{
      name: post.author.name,
      slug: post.author.name
        .toLowerCase()
        .replace(/\s+/g,"-"),
      role: post.author.role,
      avatarUrl: post.author.image ?? "",
    },


    publishedAt:
      (
        post.publishedAt ??
        post.createdAt
      ).toISOString(),


    updatedAt:
      post.updatedAt.toISOString(),


    views: post.views,


    readingTimeMin:
      post.readingTimeMin,


    tags:
      post.tags.map(
        (t)=>t.tag.name
      ),


    isLive:
      post.isLive,


    isBreaking:
      post.isBreaking,


  }));

}

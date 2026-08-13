import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(req: NextRequest) {

  const slugs =
    req.nextUrl.searchParams
      .get("slugs")
      ?.split(",")
      .filter(Boolean) ?? [];


  if (!slugs.length) {
    return NextResponse.json([]);
  }


  const posts = await prisma.post.findMany({
    where: {
      slug: {
        in: slugs,
      },
      status: "PUBLISHED",
    },
    include: {
      category: true,
      author: true,
    },
  });


  return NextResponse.json(
    posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      headline: post.headline,
      dek: post.dek,

      category: post.category.slug,

      imageUrl: post.featuredImageUrl,
      imageAlt:
        post.featuredImageAlt ??
        post.headline,

      author: {
        name: post.author.name,
        slug: post.author.name
          .toLowerCase()
          .replace(/\s+/g, "-"),
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

      tags: [],

      isLive: post.isLive,

      isBreaking:
        post.isBreaking,
    }))
  );
}

import { redirect } from "next/navigation";
import { PostsManager } from "@/components/admin/posts/PostsManager";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";
import type { PostStatus } from "@/lib/mock-data";

export const metadata = {
  title: "Posts",
};

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const session = await getCurrentSession();

  if (
    !session ||
    !["JOURNALIST", "EDITOR", "ADMIN"].includes(session.role)
  ) {
    redirect("/login");
  }

  const posts = await prisma.post.findMany({
    orderBy: {
      updatedAt: "desc",
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

  const initialPosts = posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    headline: post.headline,
    dek: post.dek,

    category: post.category.slug as
      | "india"
      | "world"
      | "politics"
      | "business"
      | "technology"
      | "sports"
      | "entertainment"
      | "health"
      | "explainers",

    author: {
      name: post.author.name,
      slug:
        post.author.email.split("@")[0] ??
        post.author.id,
      role: post.author.role,
      avatarUrl: post.author.image ?? "",
    },

    publishedAt: (
      post.publishedAt ?? post.createdAt
    ).toISOString(),

    updatedAt: post.updatedAt.toISOString(),

    readingTimeMin: post.readingTimeMin,

    imageUrl: post.featuredImageUrl,

    imageAlt: post.featuredImageAlt,

    isLive: post.isLive,

    isBreaking: post.isBreaking,

    views: post.views,

    tags: post.tags.map(
      (postTag) => postTag.tag.name
    ),

    body: post.body
      ? post.body.split(/\n{2,}/)
      : [],

    status: (
      post.status === "PUBLISHED"
        ? "published"
        : post.status === "SCHEDULED"
          ? "scheduled"
          : "draft"
    ) as PostStatus,
  }));

  return (
    <PostsManager
      initialPosts={initialPosts}
    />
  );
}
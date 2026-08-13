import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { PostEditorForm } from "@/components/admin/editor/PostEditorForm";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";
import type { CategorySlug } from "@/lib/types";

export const dynamic = "force-dynamic";

const CATEGORY_SLUGS: CategorySlug[] = [
  "india",
  "world",
  "politics",
  "business",
  "technology",
  "sports",
  "entertainment",
  "health",
  "explainers",
];

function isCategorySlug(
  value: string
): value is CategorySlug {
  return CATEGORY_SLUGS.includes(
    value as CategorySlug
  );
}

function getEditorStatus(status:string){
  switch(status){
    case "PUBLISHED":
    case "published":
      return "PUBLISHED";

    case "SCHEDULED":
    case "scheduled":
      return "SCHEDULED";

    case "ARCHIVED":
    case "archived":
      return "ARCHIVED";

    default:
      return "DRAFT";
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: {
      slug,
    },
    select: {
      headline: true,
    },
  });

  return {
    title: post
      ? `Edit — ${post.headline}`
      : "Edit Post",
  };
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  /*
   * -------------------------
   * Authentication
   * -------------------------
   */

  const session = await getCurrentSession();

  if (
    !session ||
    !["JOURNALIST", "EDITOR", "ADMIN"].includes(
      session.role
    )
  ) {
    redirect("/login");
  }

  /*
   * -------------------------
   * Get real post
   * -------------------------
   */

  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: {
      slug,
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  /*
   * -------------------------
   * Convert category
   * -------------------------
   */

  const categorySlug = post.category
    .slug;

  const category: CategorySlug =
    isCategorySlug(categorySlug)
      ? categorySlug
      : "india";

  /*
   * -------------------------
   * Convert tags
   * -------------------------
   */

  const tags = post.tags.map(
    (postTag) => postTag.tag.name
  );

  /*
   * -------------------------
   * Convert scheduled date
   * -------------------------
   */

  const scheduledAt =
    post.scheduledAt
      ? post.scheduledAt
          .toISOString()
          .slice(0, 16)
      : "";

  /*
   * -------------------------
   * Render editor
   * -------------------------
   */

  return (
    <PostEditorForm
      mode="edit"
      initialValues={{
        id: post.id,
        title: post.headline,
        slug: post.slug,
        category,
        tags,
        featuredImageUrl:
          post.featuredImageUrl,
        body: post.body,
        metaDescription:
          post.metaDescription ??
          post.dek,
        status: getEditorStatus(
          post.status
        ),
        scheduledAt,
      }}
    />
  );
}

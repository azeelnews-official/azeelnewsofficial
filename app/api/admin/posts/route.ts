import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";
import { PostStatus, Role } from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EDITOR_ROLES: Role[] = [
  "JOURNALIST",
  "EDITOR",
  "ADMIN",
];

const STATUS_MAP: Record<string, PostStatus> = {
  draft: PostStatus.DRAFT,
  scheduled: PostStatus.SCHEDULED,
  published: PostStatus.PUBLISHED,
  archived: PostStatus.ARCHIVED,
};

function isEditorRole(role: Role) {
  return EDITOR_ROLES.includes(role);
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function calculateReadingTime(body: string): number {
  const words = body
    .replace(/[#*_>`[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
}

export async function GET() {
  const session = await getCurrentSession();

  if (!session || !isEditorRole(session.role)) {
    return NextResponse.json(
      { error: "Not authorized." },
      { status: 403 }
    );
  }

  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("GET /api/admin/posts failed:", error);

    return NextResponse.json(
      { error: "Unable to load posts." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getCurrentSession();

  if (!session || !isEditorRole(session.role)) {
    return NextResponse.json(
      { error: "Not authorized." },
      { status: 403 }
    );
  }

  try {
    const data = await req.json();

    const headline = cleanString(data.headline);
    const headlineHi = cleanString(data.headlineHi);

    const dek = cleanString(data.dek);
    const dekHi = cleanString(data.dekHi);

    const articleBody = cleanString(data.body);
    const bodyHi = cleanString(data.bodyHi);
    const requestedSlug = cleanString(data.slug);
    const categorySlug = cleanString(data.category);
    const metaDescription = cleanString(data.metaDescription);
    const featuredImageUrl = cleanString(data.featuredImageUrl);
    const featuredImageAlt = cleanString(data.featuredImageAlt);

    const tags: string[] = Array.isArray(data.tags)
      ? data.tags
          .filter(
            (tag: unknown): tag is string =>
              typeof tag === "string"
          )
          .map((tag: string) => tag.trim())
          .filter(Boolean)
      : [];

    const requestedStatus = cleanString(data.status).toLowerCase();

    const status =
      STATUS_MAP[requestedStatus] ?? PostStatus.DRAFT;

    const scheduledAtValue = cleanString(data.scheduledAt);

    /*
     * -------------------------
     * Validation
     * -------------------------
     */

    if (!headline) {
      return NextResponse.json(
        { error: "Headline is required." },
        { status: 400 }
      );
    }

    if (!articleBody) {
      return NextResponse.json(
        { error: "Article body is required." },
        { status: 400 }
      );
    }

    if (!categorySlug) {
      return NextResponse.json(
        { error: "Category is required." },
        { status: 400 }
      );
    }

    if (!featuredImageUrl) {
      return NextResponse.json(
        { error: "Featured image is required." },
        { status: 400 }
      );
    }

    if (!featuredImageAlt) {
      return NextResponse.json(
        { error: "Featured image alt text is required." },
        { status: 400 }
      );
    }

    if (
      status === PostStatus.SCHEDULED &&
      !scheduledAtValue
    ) {
      return NextResponse.json(
        {
          error:
            "Scheduled date and time are required.",
        },
        { status: 400 }
      );
    }

    /*
     * -------------------------
     * Category
     * -------------------------
     */

    const category = await prisma.category.findUnique({
      where: {
        slug: categorySlug,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          error: `Category "${categorySlug}" was not found.`,
        },
        { status: 400 }
      );
    }

    /*
     * -------------------------
     * Slug
     * -------------------------
     */

    let slug = slugify(
      requestedSlug || headline
    );

    if (!slug) {
      return NextResponse.json(
        {
          error:
            "A valid slug could not be generated.",
        },
        { status: 400 }
      );
    }

    const existingPost = await prisma.post.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (existingPost) {
      slug = `${slug}-${Date.now()
        .toString()
        .slice(-6)}`;
    }

    /*
     * -------------------------
     * Tags
     * -------------------------
     */

    const tagSlugs: string[] = Array.from(
      new Set(
        tags
          .map((tag: string) => slugify(tag))
          .filter(
            (slug): slug is string =>
              Boolean(slug)
          )
      )
    );

    const uniqueTags = await Promise.all(
      tagSlugs.map(async (tagSlug: string) => {
        const tagName =
          tags.find(
            (tag: string) =>
              slugify(tag) === tagSlug
          ) ?? tagSlug;

        return prisma.tag.upsert({
          where: {
            slug: tagSlug,
          },
          update: {},
          create: {
            slug: tagSlug,
            name: tagName,
          },
        });
      })
    );

    /*
     * -------------------------
     * Schedule
     * -------------------------
     */

    const scheduledAt =
      status === PostStatus.SCHEDULED &&
      scheduledAtValue
        ? new Date(scheduledAtValue)
        : null;

    if (
      scheduledAt &&
      Number.isNaN(scheduledAt.getTime())
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid scheduled date and time.",
        },
        { status: 400 }
      );
    }

    /*
     * -------------------------
     * Publish date
     * -------------------------
     */

    const publishedAt =
      status === PostStatus.PUBLISHED
        ? new Date()
        : null;

    /*
     * -------------------------
     * Create post
     * -------------------------
     */

    const post = await prisma.$transaction(
      async (tx) => {
        const createdPost = await tx.post.create({
          data: {
            slug,

            headline,
            headlineHi: headlineHi || null,

            dek:
              dek ||
              metaDescription ||
              headline,

            dekHi: dekHi || null,

            body: articleBody,
            bodyHi: bodyHi || null,
            status,
            featuredImageUrl,
            featuredImageAlt,
            metaDescription:
              metaDescription || null,
            readingTimeMin:
              calculateReadingTime(articleBody),
            publishedAt,
            scheduledAt,
            authorId: session.sub,
            categoryId: category.id,
          },
          include: {
            category: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            tags: {
              include: {
                tag: true,
              },
            },
          },
        });

        /*
         * Create post/tag relations
         */

        if (uniqueTags.length > 0) {
          await tx.postTag.createMany({
            data: uniqueTags.map((tag) => ({
              postId: createdPost.id,
              tagId: tag.id,
            })),
            skipDuplicates: true,
          });
        }

        /*
         * Audit log
         */

        const action =
          status === PostStatus.PUBLISHED
            ? "post.publish"
            : status === PostStatus.SCHEDULED
              ? "post.schedule"
              : "post.create";

        await tx.auditLog.create({
          data: {
            action,
            entityType: "Post",
            entityId: createdPost.id,
            userId: session.sub,
            metadata: {
              headline,
              slug,
              status: String(status),
              category: category.slug,
            },
          },
        });

        return createdPost;
      }
    );

    return NextResponse.json(
      {
        success: true,
        post,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/admin/posts failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to create the article.",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 }
    );
  }
}
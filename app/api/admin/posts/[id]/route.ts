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

async function getPost(id: string) {
  return prisma.post.findUnique({
    where: {
      id,
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
      media: true,
    },
  });
}

/*
 * -------------------------
 * GET ONE POST
 * -------------------------
 */

export async function GET(
  _req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const session = await getCurrentSession();

  if (!session || !isEditorRole(session.role)) {
    return NextResponse.json(
      { error: "Not authorized." },
      { status: 403 }
    );
  }

  const { id } = await context.params;

  const post = await getPost(id);

  if (!post) {
    return NextResponse.json(
      { error: "Article not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    post,
  });
}

/*
 * -------------------------
 * UPDATE POST
 * -------------------------
 */

export async function PATCH(
  req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const session = await getCurrentSession();

  if (!session || !isEditorRole(session.role)) {
    return NextResponse.json(
      { error: "Not authorized." },
      { status: 403 }
    );
  }

  const { id } = await context.params;

  try {
    const existing = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Article not found." },
        { status: 404 }
      );
    }

    const data = await req.json();

    const headline = cleanString(data.headline);
    const headlineHi = cleanString(data.headlineHi);

    const dek = cleanString(data.dek);
    const dekHi = cleanString(data.dekHi);

    const articleBody = cleanString(data.body);
    const bodyHi = cleanString(data.bodyHi);
    const requestedSlug = cleanString(data.slug);
    const categorySlug = cleanString(data.category);
    const metaDescription =
      cleanString(data.metaDescription);
    const featuredImageUrl =
      cleanString(data.featuredImageUrl);
    const featuredImageAlt =
      cleanString(data.featuredImageAlt);

    const tags: string[] = Array.isArray(data.tags)
      ? data.tags
          .filter(
            (tag: unknown): tag is string =>
              typeof tag === "string"
          )
          .map((tag: string) => tag.trim())
          .filter(Boolean)
      : [];

    const requestedStatus =
      cleanString(data.status).toLowerCase();

    const status =
      STATUS_MAP[requestedStatus] ??
      existing.status;

    const scheduledAtValue =
      cleanString(data.scheduledAt);

    /*
     * -------------------------
     * Validation
     * -------------------------
     */

    if (!headline) {
      return NextResponse.json(
        {
          error:
            "Headline is required.",
        },
        { status: 400 }
      );
    }

    if (!articleBody) {
      return NextResponse.json(
        {
          error:
            "Article body is required.",
        },
        { status: 400 }
      );
    }

    if (!categorySlug) {
      return NextResponse.json(
        {
          error:
            "Category is required.",
        },
        { status: 400 }
      );
    }

    if (!featuredImageUrl) {
      return NextResponse.json(
        {
          error:
            "Featured image is required.",
        },
        { status: 400 }
      );
    }

    if (!featuredImageAlt) {
      return NextResponse.json(
        {
          error:
            "Featured image alt text is required.",
        },
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

    const category =
      await prisma.category.findUnique({
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

    const slug = slugify(
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

    const conflictingPost =
      await prisma.post.findFirst({
        where: {
          slug,
          NOT: {
            id,
          },
        },
        select: {
          id: true,
        },
      });

    if (conflictingPost) {
      return NextResponse.json(
        {
          error:
            "Another article already uses this slug.",
        },
        { status: 409 }
      );
    }

    /*
     * -------------------------
     * Schedule
     * -------------------------
     */

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
     * Published date
     * -------------------------
     */

    const publishedAt =
      status === PostStatus.PUBLISHED
        ? existing.publishedAt ?? new Date()
        : null;

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
     * Update transaction
     * -------------------------
     */

    const updated =
      await prisma.$transaction(
        async (tx) => {
          const post =
            await tx.post.update({
              where: {
                id,
              },
              data: {
                slug,
                headline,
                dek:
                  dek ||
                  metaDescription ||
                  headline,
                body: articleBody,
                status,
                featuredImageUrl,
                featuredImageAlt,
                metaDescription:
                  metaDescription ||
                  null,
                readingTimeMin:
                  calculateReadingTime(
                    articleBody
                  ),
                publishedAt,
                scheduledAt,
                categoryId:
                  category.id,
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
           * Replace tag relationships
           */

          await tx.postTag.deleteMany({
            where: {
              postId: id,
            },
          });

          if (uniqueTags.length > 0) {
            await tx.postTag.createMany({
              data: uniqueTags.map(
                (tag) => ({
                  postId: id,
                  tagId: tag.id,
                })
              ),
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
                : "post.update";

          await tx.auditLog.create({
            data: {
              action,
              entityType: "Post",
              entityId: id,
              userId: session.sub,
              metadata: {
                headline,
                slug,
                status: String(status),
                category: category.slug,
              },
            },
          });

          return post;
        }
      );

    return NextResponse.json({
      success: true,
      post: updated,
    });
  } catch (error) {
    console.error(
      `PATCH /api/admin/posts/${id} failed:`,
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to update the article.",
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

/*
 * -------------------------
 * DELETE POST
 * -------------------------
 */

export async function DELETE(
  _req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  const session = await getCurrentSession();

  if (!session || !isEditorRole(session.role)) {
    return NextResponse.json(
      { error: "Not authorized." },
      { status: 403 }
    );
  }

  if (session.role === "JOURNALIST") {
    return NextResponse.json(
      {
        error:
          "Only editors and administrators can delete articles.",
      },
      { status: 403 }
    );
  }

  const { id } = await context.params;

  try {
    const existing =
      await prisma.post.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          headline: true,
        },
      });

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Article not found.",
        },
        { status: 404 }
      );
    }

    await prisma.$transaction(
      async (tx) => {
        await tx.auditLog.create({
          data: {
            action: "post.delete",
            entityType: "Post",
            entityId: id,
            userId: session.sub,
            metadata: {
              headline:
                existing.headline,
            },
          },
        });

        await tx.post.delete({
          where: {
            id,
          },
        });
      }
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      `DELETE /api/admin/posts/${id} failed:`,
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to delete the article.",
      },
      { status: 500 }
    );
  }
}
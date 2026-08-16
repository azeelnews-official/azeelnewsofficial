import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_COMMENT_LENGTH = 2000;

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: Request) {
  try {
    /*
     * Authentication
     */
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Please log in to post a comment.",
        },
        { status: 401 }
      );
    }

    /*
     * Read request body
     */
    const data = await req.json();

    const postId = cleanText(data.postId);
    const text = cleanText(data.text);

    /*
     * Validation
     */
    if (!postId) {
      return NextResponse.json(
        {
          error: "Post ID is required.",
        },
        { status: 400 }
      );
    }

    if (!text) {
      return NextResponse.json(
        {
          error: "Comment cannot be empty.",
        },
        { status: 400 }
      );
    }

    if (text.length > MAX_COMMENT_LENGTH) {
      return NextResponse.json(
        {
          error: `Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`,
        },
        { status: 400 }
      );
    }

    /*
     * Make sure the article exists and is publicly published.
     */
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        status: "PUBLISHED",
      },
      select: {
        id: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        {
          error: "Article not found or is not published.",
        },
        { status: 404 }
      );
    }

    /*
     * Make sure the logged-in user still exists.
     */
    const user = await prisma.user.findUnique({
      where: {
        id: session.sub,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User account was not found.",
        },
        { status: 401 }
      );
    }

    /*
     * Save comment permanently in PostgreSQL.
     */
    const comment = await prisma.comment.create({
      data: {
        text,
        postId: post.id,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        comment: {
          id: comment.id,
          articleId: comment.postId,
          authorName: comment.author.name,
          postedAt: comment.createdAt.toISOString(),
          text: comment.text,
          likes: comment.likes,
          status: "approved" as const,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/comments failed:", error);

    return NextResponse.json(
      {
        error: "Unable to post comment. Please try again.",
      },
      { status: 500 }
    );
  }
}

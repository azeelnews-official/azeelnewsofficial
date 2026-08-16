import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json(
        {
          error: "Please log in to like a comment.",
        },
        { status: 401 }
      );
    }

    const data = await req.json();

    const commentId =
      typeof data.commentId === "string"
        ? data.commentId.trim()
        : "";

    if (!commentId) {
      return NextResponse.json(
        {
          error: "Comment ID is required.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.sub,
      },
      select: {
        id: true,
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

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        id: true,
        likes: true,
      },
    });

    if (!comment) {
      return NextResponse.json(
        {
          error: "Comment not found.",
        },
        { status: 404 }
      );
    }

    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId: user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingLike) {
      await prisma.$transaction([
        prisma.commentLike.delete({
          where: {
            id: existingLike.id,
          },
        }),

        prisma.comment.update({
          where: {
            id: commentId,
          },
          data: {
            likes: {
              decrement: 1,
            },
          },
        }),
      ]);

      const updatedComment = await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
        select: {
          likes: true,
        },
      });

      return NextResponse.json({
        success: true,
        liked: false,
        likes: Math.max(updatedComment?.likes ?? 0, 0),
      });
    }

    await prisma.$transaction([
      prisma.commentLike.create({
        data: {
          commentId,
          userId: user.id,
        },
      }),

      prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          likes: {
            increment: 1,
          },
        },
      }),
    ]);

    const updatedComment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        likes: true,
      },
    });

    return NextResponse.json({
      success: true,
      liked: true,
      likes: updatedComment?.likes ?? comment.likes + 1,
    });
  } catch (error) {
    console.error(
      "POST /api/comments/like failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to update comment like.",
      },
      { status: 500 }
    );
  }
}
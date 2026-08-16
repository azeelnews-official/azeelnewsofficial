import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(req: Request) {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json(
        { error: "Please log in to delete your comment." },
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
        { error: "Comment ID is required." },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        id: true,
        authorId: true,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found." },
        { status: 404 }
      );
    }

    if (comment.authorId !== session.sub) {
      return NextResponse.json(
        { error: "You can only delete your own comments." },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return NextResponse.json({
      success: true,
      deleted: true,
      commentId,
    });
  } catch (error) {
    console.error("DELETE /api/comments/delete failed:", error);

    return NextResponse.json(
      {
        error: "Unable to delete comment.",
      },
      { status: 500 }
    );
  }
}

import { prisma } from "@/lib/prisma";

export async function getAllComments() {
  const comments = await prisma.comment.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: true,
      author: true,
    },
  });

  return comments.map((comment) => ({
    id: comment.id,
    text: comment.text,
    authorName: comment.author?.name || "Anonymous",
    status: comment.status.toLowerCase(),
    postedAt: comment.createdAt.toISOString(),
    articleSlug: comment.post.slug,
    articleHeadline: comment.post.headline,
  }));
}

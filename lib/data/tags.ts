import { prisma } from "@/lib/prisma";

export async function getTagsWithCounts() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return tags.map((tag) => ({
    id: tag.id,
    label: tag.name,
    slug: tag.slug,
    usageCount: tag._count.posts,
  }));
}

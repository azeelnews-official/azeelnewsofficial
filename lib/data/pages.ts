import { prisma } from "@/lib/prisma";

export async function getPages() {
  const pages = await prisma.page.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return pages.map((page) => ({
    id: page.id,
    slug: page.slug,
    title: page.title,
    content: page.content,
    updatedAt: page.updatedAt.toISOString(),
  }));
}

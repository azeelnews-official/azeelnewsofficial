import { prisma } from "@/lib/prisma";

export async function getWidgets() {
  return prisma.widget.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

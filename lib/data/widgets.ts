import { prisma } from "@/lib/prisma";

export async function getWidgets() {
  return prisma.widgetArea.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      widgets: {
        orderBy: { order: "asc" },
      },
    },
  });
}

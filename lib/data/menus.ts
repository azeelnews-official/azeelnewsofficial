import { prisma } from "@/lib/prisma";

export async function getMenus() {
  return prisma.menu.findMany({
    orderBy: {
      order: "asc",
    },
  });
}

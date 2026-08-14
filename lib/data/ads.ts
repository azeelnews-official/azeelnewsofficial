import { prisma } from "@/lib/prisma";

export async function getAdCampaigns() {
  return prisma.advertisement.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

import { prisma } from "@/lib/prisma";

export async function getAdCampaigns() {
  return prisma.adCampaign.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

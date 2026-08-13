import { prisma } from "@/lib/prisma";

export type FactCheckVerdict =
  | "true"
  | "false"
  | "misleading"
  | "unverified";

export async function getFactChecks() {
  return prisma.factCheck.findMany({
    orderBy: {
      publishedAt: "desc",
    },
  });
}

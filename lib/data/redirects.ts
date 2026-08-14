import { prisma } from "@/lib/prisma";

export async function getRedirects() {
  const redirects = await prisma.redirect.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return redirects.map((redirect) => ({
    id: redirect.id,
    from: redirect.from,
    to: redirect.to,
    type: redirect.type?.toLowerCase() || "temporary",
    createdAt: redirect.createdAt.toISOString(),
  }));
}

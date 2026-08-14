import { prisma } from "@/lib/prisma";

export async function getRedirects() {
  const redirects = await prisma.redirect.findMany({
    orderBy: {
      id: "desc",
    },
  });

  return redirects.map((redirect) => ({
    id: redirect.id,
    fromPath: redirect.fromPath,
    toPath: redirect.toPath,
    statusCode: redirect.statusCode,
  }));
}

import { prisma } from "@/lib/prisma";

const SITE_URL = "https://www.azeelnews.in";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const revalidate = 900;

export async function GET() {
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000);

  const posts = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: {
        not: null,
        gte: since,
      },
    },
    select: {
      slug: true,
      headline: true,
      publishedAt: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 1000,
  });

  const urls = posts
    .filter((post) => post.publishedAt && post.headline)
    .map(
      (post) => `  <url>
    <loc>${escapeXml(`${SITE_URL}/article/${post.slug}`)}</loc>
    <news:news>
      <news:publication>
        <news:name>Azeel News</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(post.publishedAt!).toISOString()}</news:publication_date>
      <news:title>${escapeXml(post.headline)}</news:title>
    </news:news>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}

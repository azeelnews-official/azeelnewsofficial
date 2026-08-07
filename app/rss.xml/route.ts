import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/mock-data";

const SITE_URL = "https://www.azeelnews.com";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const articles = getAllArticles()
    .slice()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 30);

  const items = articles
    .map(
      (a) => `
    <item>
      <title>${escapeXml(a.headline)}</title>
      <link>${SITE_URL}/article/${a.slug}</link>
      <guid>${SITE_URL}/article/${a.slug}</guid>
      <description>${escapeXml(a.dek)}</description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <author>${escapeXml(a.author.name)}</author>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>AZEEL NEWS</title>
    <link>${SITE_URL}</link>
    <description>Breaking news, India &amp; world — politics, business, technology, sports and more.</description>
    <language>en-IN</language>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

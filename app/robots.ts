import type { MetadataRoute } from "next";

const SITE_URL = "https://www.azeelnews.in";

export default function robots(): MetadataRoute.Robots {

  return {

    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api"
        ],
      },
    ],

    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/news-sitemap.xml`,
    ],

  };

}

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/data/",
          "/newsletter-confirmation",
          "/privacy-policy",
          "/vs/",
        ],
      },
      {
        userAgent: ["AhrefsBot", "DotBot", "SemrushBot", "MJ12bot"],
        allow: "/",
        disallow: [
          "/api/",
          "/_next/data/",
          "/newsletter-confirmation",
          "/privacy-policy",
          "/vs/",
          "/watch/",
        ],
      },
    ],
    sitemap: "https://watchtennistoday.com/sitemap.xml",
  };
}

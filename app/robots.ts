import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const privateOrTechnicalPaths = [
    "/api/",
    "/_next/",
    "/_next/data/",
    "/newsletter-confirmation",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep crawler budget focused on public editorial/schedule pages.
        // Thin public routes still use page-level noindex so Google can crawl
        // them, follow internal links, and confirm the noindex signal.
        disallow: privateOrTechnicalPaths,
      },
      {
        userAgent: ["AhrefsBot", "DotBot", "SemrushBot", "MJ12bot"],
        allow: "/",
        disallow: privateOrTechnicalPaths,
      },
    ],
    sitemap: "https://watchtennistoday.com/sitemap.xml",
    host: "https://watchtennistoday.com",
  };
}

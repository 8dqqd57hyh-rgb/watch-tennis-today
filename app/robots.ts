import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const privateOrTechnicalPaths = [
    "/api/",
    "/_next/data/",
    "/newsletter-confirmation",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // AdSense quality: keep technical/private URLs out of crawlers, but do not
        // block thin public pages here. Public generated pages use meta noindex so
        // Google can crawl them, see follow links, and confirm the noindex signal.
        disallow: privateOrTechnicalPaths,
      },
      {
        userAgent: ["AhrefsBot", "DotBot", "SemrushBot", "MJ12bot"],
        allow: "/",
        disallow: privateOrTechnicalPaths,
      },
    ],
    sitemap: "https://watchtennistoday.com/sitemap.xml",
  };
}

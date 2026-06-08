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
          "/vs/", // vs comparison pages without substantive content
          "/watch/tennis-spoiler-free-scores",
          "/french-open-draw",
          "/french-open-survivors",
          "/french-open-upsets",
          "/roland-garros-pulse",
          "/roland-garros-predictions",
          "/tennis-schedule-tomorrow",
          "/wimbledon-live-stream",
          "/watch-sabalenka-live",
          "/watch-swiatek-live",
        ],
      },
      {
        userAgent: ["AhrefsBot", "DotBot", "SemrushBot", "MJ12bot"],
        allow: "/",
        disallow: [
          "/api/",
          "/_next/data/",
          "/newsletter-confirmation",
          "/vs/", // vs comparison pages without substantive content
          "/watch/tennis-spoiler-free-scores",
          "/french-open-draw",
          "/french-open-survivors",
          "/french-open-upsets",
          "/roland-garros-pulse",
          "/roland-garros-predictions",
          "/tennis-schedule-tomorrow",
          "/wimbledon-live-stream",
          "/watch-sabalenka-live",
          "/watch-swiatek-live",
        ],
        // Note: /watch/ pages are now fully indexed as they contain editorial content
        // This change ensures AdSense crawlers can access match pages with commentary
      },
    ],
    sitemap: "https://watchtennistoday.com/sitemap.xml",
  };
}

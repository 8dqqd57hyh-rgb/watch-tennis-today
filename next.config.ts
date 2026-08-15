import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    return [
      {
        source: "/",
        has: [
          {
            type: "query",
            key: "search",
          },
        ],
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, follow",
          },
        ],
      },
      {
        source: "/watch/:slug/opengraph-image",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
      {
        source: "/watch-tennis-in-australia",
        destination: "/watch-tennis-in/australia",
        permanent: true,
      },
      {
        source: "/watch-tennis-in-canada",
        destination: "/watch-tennis-in/canada",
        permanent: true,
      },
      {
        source: "/watch-tennis-in-uk",
        destination: "/watch-tennis-in/uk",
        permanent: true,
      },
      {
        source: "/watch-tennis-in-usa",
        destination: "/watch-tennis-in/usa",
        permanent: true,
      },
      {
        source: "/watch-french-open-in-australia",
        destination: "/where-to-watch-french-open",
        permanent: true,
      },
      {
        source: "/watch-french-open-in-canada",
        destination: "/where-to-watch-french-open",
        permanent: true,
      },
      {
        source: "/watch-french-open-in-uk",
        destination: "/where-to-watch-french-open",
        permanent: true,
      },
      {
        source: "/watch-french-open-in-usa",
        destination: "/where-to-watch-french-open",
        permanent: true,
      },
      {
        source: "/guides/how-tennis-draws-work",
        destination: "/guides/tennis-draws-explained",
        permanent: true,
      },
      {
        source: "/guides/how-to-watch-tennis-online-legally",
        destination: "/best-ways-to-watch-tennis-online",
        permanent: true,
      },
      {
        source: "/guides/watch-tennis-online-legally",
        destination: "/best-ways-to-watch-tennis-online",
        permanent: true,
      },
      {
        source: "/guides/tennis-order-of-play-guide",
        destination: "/tennis-order-of-play-today",
        permanent: true,
      },
      {
        source: "/guides/tennis-qualifying-explained",
        destination: "/guides/tennis-qualifying-rounds-explained",
        permanent: true,
      },
      {
        source: "/guides/roland-garros-guide",
        destination: "/french-open-guide",
        permanent: true,
      },
      {
        source: "/french-open-live-stream",
        destination: "/french-open",
        permanent: true,
      },
      {
        source: "/french-open-streaming-countries",
        destination: "/where-to-watch-french-open",
        permanent: true,
      },
      {
        source: "/french-open-schedule",
        destination: "/french-open-order-of-play",
        permanent: true,
      },
      {
        source: "/roland-garros-live",
        destination: "/french-open",
        permanent: true,
      },
      {
        source: "/roland-garros-live-stream",
        destination: "/french-open",
        permanent: true,
      },
      {
        source: "/watch-roland-garros-online",
        destination: "/watch-french-open-online",
        permanent: true,
      },
      {
        source: "/roland-garros-tv-schedule",
        destination: "/where-to-watch-french-open",
        permanent: true,
      },
      {
        source: "/roland-garros-results",
        destination: "/french-open-results",
        permanent: true,
      },
      {
        source: "/roland-garros-draw",
        destination: "/french-open-order-of-play",
        permanent: true,
      },
      {
        source: "/watch/tennis-spoiler-free-scores",
        destination: "/tennis-spoiler-free-scores",
        permanent: true,
      },
      {
        source: "/wimbledon-tv-schedule",
        destination: "/where-to-watch-wimbledon",
        permanent: true,
      },
      {
        source: "/french-open-tv-schedule",
        destination: "/where-to-watch-french-open",
        permanent: true,
      },
      {
        source: "/french-open-live",
        destination: "/french-open",
        permanent: true,
      },
      {
        source: "/french-open-today",
        destination: "/french-open",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

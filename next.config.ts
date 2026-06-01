import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // TypeScript is validated separately with `tsc --noEmit`.
    // This prevents Vercel/Next from hanging during the production build type-check phase.
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/french-open-live-stream",
        destination: "/french-open-live",
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
        destination: "/french-open-live",
        permanent: true,
      },
      {
        source: "/roland-garros-live-stream",
        destination: "/french-open-live",
        permanent: true,
      },
      {
        source: "/watch-roland-garros-online",
        destination: "/watch-french-open-online",
        permanent: true,
      },
      {
        source: "/roland-garros-tv-schedule",
        destination: "/french-open-tv-schedule",
        permanent: true,
      },
      {
        source: "/roland-garros-results",
        destination: "/french-open-results",
        permanent: true,
      },
      {
        source: "/roland-garros-draw",
        destination: "/french-open-draw",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
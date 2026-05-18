import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */

  async redirects() {
    return [
      {
        source: "/roland-garros-live",
        destination: "/french-open-live",
        permanent: true,
      },
      {
        source: "/roland-garros-live-stream",
        destination: "/french-open-live-stream",
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

/** @type {import('next').NextConfig} */
module.exports = {
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
      // add more permanent redirects here if you confirm pages are thin/duplicates
    ];
  },
};
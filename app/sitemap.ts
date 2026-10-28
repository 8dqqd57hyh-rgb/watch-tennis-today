import type { MetadataRoute } from "next";
import { ADSENSE_INDEXABLE_BROADCAST_COUNTRIES } from "@/data/broadcastFinder";
import { ADSENSE_INDEXABLE_PLAYER_SLUGS } from "@/app/lib/adsenseIndexing";
import { buildSitemapEntry, uniqueSitemapEntries } from "@/app/lib/technicalSeo";
import { CURATED_CAN_I_WATCH_PATHS } from "@/app/lib/canIWatchSeo";
import { WIMBLEDON_COUNTRY_SLUGS } from "@/app/lib/wimbledonCountryGuides";
import { getUniqueBroadcasters } from "@/src/data/tennisBroadcasts";

export const revalidate = 86400;

const staticPaths = [
  "",
  "/can-i-watch",
  "/watch",
  "/watch-tennis-in",
  "/broadcasters",
  "/where-to-watch-wimbledon",
  "/where-to-watch-french-open",
  "/watch-french-open-online",
  "/how-to-watch-french-open-in-usa",
  "/how-to-watch-tennis-legally",
  "/how-to-watch-tennis-safely-abroad",
  "/how-to-watch-tennis-without-cable",
  "/official-tennis-broadcasters-guide",
  "/tennis-tv-broadcast-finder",
  "/tennis-streaming-services",
  "/best-ways-to-watch-tennis-online",
  "/watch-tennis-online",
  "/watch-tennis-abroad",
  "/players",
  "/players/atp",
  "/players/wta",
  "/newsletter",
  "/pl/gdzie-ogladac-tenis-w-polsce",
  "/about",
  "/contact",
  "/privacy",
  "/cookie-policy",
  "/terms",
  "/disclaimer",
  "/affiliate-disclosure",
  "/editorial-policy",
  "/content-guidelines",
  ...WIMBLEDON_COUNTRY_SLUGS.map((country) => `/how-to-watch-wimbledon-in-${country}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return uniqueSitemapEntries([
    ...staticPaths.map((path) =>
      buildSitemapEntry({ path, changeFrequency: "weekly", priority: path === "" ? 1 : 0.9 }),
    ),
    ...Array.from(ADSENSE_INDEXABLE_BROADCAST_COUNTRIES).map((country) =>
      buildSitemapEntry({ path: `/watch-tennis-in/${country}`, changeFrequency: "monthly", priority: 0.82 }),
    ),
    ...CURATED_CAN_I_WATCH_PATHS.map((path) =>
      buildSitemapEntry({ path, changeFrequency: "monthly", priority: 0.78 }),
    ),
    ...getUniqueBroadcasters().map((broadcaster) =>
      buildSitemapEntry({ path: `/broadcaster/${broadcaster.slug}`, changeFrequency: "monthly", priority: 0.82 }),
    ),
    ...Array.from(ADSENSE_INDEXABLE_PLAYER_SLUGS).map((slug) =>
      buildSitemapEntry({ path: `/player/${slug}`, changeFrequency: "monthly", priority: 0.75 }),
    ),
  ]);
}

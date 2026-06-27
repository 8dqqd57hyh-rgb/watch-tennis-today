import type { Metadata } from "next";
import type { MetadataRoute } from "next";

export const SITE_URL = "https://watchtennistoday.com";

export type SeoIndexingDecision = {
  index: boolean;
  follow?: boolean;
};

export type SitemapEntryInput = {
  path: string;
  lastModified?: Date;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
};

export const REDIRECT_ONLY_PATHS = new Set([
  "/french-open-live",
  "/french-open-live-stream",
  "/french-open-schedule",
  "/french-open-streaming-countries",
  "/french-open-today",
  "/french-open-tv-schedule",
  "/guides/how-tennis-draws-work",
  "/guides/how-to-watch-tennis-online-legally",
  "/guides/roland-garros-guide",
  "/guides/tennis-order-of-play-guide",
  "/guides/tennis-qualifying-explained",
  "/guides/watch-tennis-online-legally",
  "/privacy-policy",
  "/roland-garros-draw",
  "/roland-garros-live",
  "/roland-garros-live-stream",
  "/roland-garros-results",
  "/roland-garros-tv-schedule",
  "/tennis-schedule-tomorrow",
  "/watch-roland-garros-online",
  "/watch-french-open-in-australia",
  "/watch-french-open-in-canada",
  "/watch-french-open-in-uk",
  "/watch-french-open-in-usa",
  "/watch-tennis-in-australia",
  "/watch-tennis-in-canada",
  "/watch-tennis-in-uk",
  "/watch-tennis-in-usa",
  "/watch/tennis-spoiler-free-scores",
  "/wimbledon-live-stream",
  "/wimbledon-tv-schedule",
]);

export const NOINDEX_ONLY_PATHS = new Set([
  "/atp-live-today",
  "/best-tennis-matches-today",
  "/best-vpn-for-roland-garros",
  "/best-vpn-for-tennis-streaming",
  "/best-vpn-for-wimbledon",
  "/compare",
  "/compare/tennis-tv-vs-espn",
  "/french-open-draw",
  "/french-open-results",
  "/french-open-survivors",
  "/french-open-upsets",
  "/how-to-watch-french-open-in-usa",
  "/matches/live-now",
  "/my-dashboard",
  "/my-feed",
  "/my-tournament",
  "/next-match",
  "/rivalries",
  "/roland-garros-pulse",
  "/roland-garros-predictions",
  "/roland-garros-recap",
  "/rome-open-final-live",
  "/tennis-order-of-play-today",
  "/tennis-results-today",
  "/tennis-schedule-today",
  "/tennis-trending-now",
  "/tomorrow",
  "/tv-schedule",
  "/watch-sabalenka-live",
  "/watch-swiatek-live",
  "/watch-tennis-live-today",
  "/wta-live-today",
]);

const ALWAYS_NOINDEX_PATH_PREFIXES = [
  "/api/",
  "/_next/",
  "/newsletter-confirmation",
];

export function normalizePath(path: string) {
  const withoutDomain = path.replace(/^https?:\/\/[^/]+/i, "");
  const cleaned = withoutDomain.split("?")[0].split("#")[0] || "/";
  const withLeadingSlash = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
  const withoutTrailingSlash =
    withLeadingSlash.length > 1 ? withLeadingSlash.replace(/\/+$/, "") : withLeadingSlash;

  return withoutTrailingSlash === "/" ? "" : withoutTrailingSlash;
}

export function canonicalUrl(path: string) {
  const normalized = normalizePath(path);
  return `${SITE_URL}${normalized}`;
}

export function robotsFor({ index, follow = true }: SeoIndexingDecision): Metadata["robots"] {
  return { index, follow };
}

export function isRedirectOnlyPath(path: string) {
  return REDIRECT_ONLY_PATHS.has(normalizePath(path));
}

export function isNoindexOnlyPath(path: string) {
  return NOINDEX_ONLY_PATHS.has(normalizePath(path));
}

export function isTechnicalPath(path: string) {
  const normalized = normalizePath(path);

  return ALWAYS_NOINDEX_PATH_PREFIXES.some((prefix) =>
    normalized === normalizePath(prefix) || normalized.startsWith(normalizePath(prefix))
  );
}

export function shouldIncludeInSitemap(path: string) {
  const normalized = normalizePath(path);

  if (isRedirectOnlyPath(normalized)) return false;
  if (isNoindexOnlyPath(normalized)) return false;
  if (isTechnicalPath(normalized)) return false;

  return true;
}

export function buildSitemapEntry({
  path,
  lastModified = new Date(),
  changeFrequency = "weekly",
  priority = 0.7,
}: SitemapEntryInput): MetadataRoute.Sitemap[number] | null {
  if (!shouldIncludeInSitemap(path)) return null;

  return {
    url: canonicalUrl(path),
    lastModified,
    changeFrequency,
    priority,
  };
}

export function uniqueSitemapEntries(entries: Array<MetadataRoute.Sitemap[number] | null>) {
  const seen = new Set<string>();
  const result: MetadataRoute.Sitemap = [];

  for (const entry of entries) {
    if (!entry) continue;
    if (seen.has(entry.url)) continue;
    seen.add(entry.url);
    result.push(entry);
  }

  return result;
}

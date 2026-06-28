import type { BroadcasterEnrichment } from "./types";
import { basicSeo, entriesForBroadcasterSlug, normalizeSlug, uniq } from "./shared";

export function enrichBroadcaster(broadcaster: { slug?: string; name: string }): BroadcasterEnrichment {
  const slug = broadcaster.slug ?? normalizeSlug(broadcaster.name);
  const entries = entriesForBroadcasterSlug(slug);
  const countries = uniq(entries.map((entry) => entry.countryName));
  const tournaments = uniq(entries.map((entry) => entry.tournamentName));
  const streamingServices = uniq(entries.map((entry) => entry.streamingService));
  const tours = uniq(entries.map((entry) => entry.eventType === "grand_slam" ? "Grand Slam" : entry.tournamentId.includes("wta") ? "WTA" : "ATP"));
  const officialWebsite = entries[0]?.officialUrl ?? null;
  const lastVerified = entries.map((entry) => entry.lastVerified).sort().at(-1) ?? null;
  const confirmed = entries.filter((entry) => entry.confidence === "confirmed").length;

  return {
    slug,
    name: broadcaster.name,
    countries,
    tournaments,
    tours,
    streamingServices,
    coverageLevel: countries.length >= 5 || tournaments.length >= 4 ? "broad" : entries.length >= 2 ? "focused" : "limited",
    officialWebsite,
    lastVerified,
    confidenceSummary: entries.length ? `${confirmed}/${entries.length} broadcaster records are confirmed; remaining rows may need checking.` : "No broadcaster records found in the structured dataset.",
    seo: basicSeo(broadcaster.name, "broadcaster profile"),
  };
}

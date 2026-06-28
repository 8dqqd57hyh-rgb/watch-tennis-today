import type { StreamingEnrichment } from "./types";
import { basicSeo, entriesForStreamingSlug, normalizeSlug, uniq } from "./shared";

export function enrichStreamingService(service: { slug?: string; name: string }): StreamingEnrichment {
  const slug = service.slug ?? normalizeSlug(service.name);
  const entries = entriesForStreamingSlug(slug);
  const countries = uniq(entries.map((entry) => entry.countryName));
  const supportedTournaments = uniq(entries.map((entry) => entry.tournamentName));
  const supportedTours = uniq(entries.map((entry) => entry.eventType === "grand_slam" ? "Grand Slam" : entry.tournamentId.includes("wta") ? "WTA" : "ATP"));
  const officialLinks = uniq(entries.flatMap((entry) => entry.officialLinks));
  const hasFree = entries.some((entry) => entry.free);
  const hasSubscription = entries.some((entry) => entry.subscriptionRequired);

  return {
    slug,
    name: service.name,
    countries,
    supportedTournaments,
    supportedTours,
    subscriptionModel: hasFree && hasSubscription ? "Mixed free and subscription coverage" : hasFree ? "Free coverage marked in source data" : hasSubscription ? "Subscription usually required" : "Check official provider",
    officialLinks,
    coverageSummary: entries.length ? `${service.name} appears in ${entries.length} structured records across ${countries.length} countries.` : `No structured coverage records are available for ${service.name} yet.`,
    seo: basicSeo(service.name, "streaming service guide"),
  };
}

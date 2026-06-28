import type { EnrichmentOptions, CountryEnrichment } from "./types";
import { basicSeo, entriesForCountrySlug, normalizeSlug, relatedByType, uniq } from "./shared";

export function enrichCountry(country: { slug?: string; name: string }, options: EnrichmentOptions = {}): CountryEnrichment {
  const slug = country.slug ?? normalizeSlug(country.name);
  const entries = entriesForCountrySlug(slug);
  const availableBroadcasters = uniq(entries.map((entry) => entry.broadcasterName));
  const availableStreaming = uniq(entries.map((entry) => entry.streamingService));
  const popularTournaments = relatedByType("country", slug, "tournament", options, 8);
  const featuredPlayers = relatedByType("country", slug, "player", options, 8);
  const free = entries.filter((entry) => entry.free);
  const premium = entries.filter((entry) => entry.subscriptionRequired);

  return {
    slug,
    name: country.name,
    availableBroadcasters,
    availableStreaming,
    featuredPlayers,
    popularTournaments,
    coverageSummary: entries.length ? `${country.name} has ${entries.length} structured tennis coverage records across ${availableBroadcasters.length} broadcasters.` : `No structured tennis coverage records are available for ${country.name} yet.`,
    subscriptionSummary: premium.length ? `${premium.length} records indicate subscription-required viewing.` : "No subscription-required rows are currently marked in the structured database.",
    freeViewingSummary: free.length ? `${free.length} rows include a free viewing note. Verify the official provider before relying on it.` : "No free viewing option is currently marked for this country.",
    premiumViewingSummary: premium.length ? `Premium coverage is mainly tied to ${uniq(premium.map((entry) => entry.streamingService)).slice(0, 4).join(", ")}.` : "Premium provider coverage is not yet available in the structured data.",
    seo: basicSeo(country.name, "country watching guide", popularTournaments),
  };
}

import { stableTournamentHubs } from "@/data/tournamentHubs";
import type { EnrichmentOptions, TournamentEnrichment } from "./types";
import { basicSeo, entriesForTournamentSlug, normalizeSlug, relatedByType, uniq } from "./shared";

function levelFlags(value: string) {
  const text = value.toLowerCase();
  return {
    isGrandSlam: text.includes("grand slam") || ["australian-open", "roland-garros", "wimbledon", "us-open"].includes(text),
    isMasters: text.includes("masters"),
    isATP500: text.includes("atp 500"),
    isATP250: text.includes("atp 250"),
    isWTA1000: text.includes("wta 1000"),
  };
}

export function enrichTournament(tournament: { slug?: string; name: string; level?: string; surface?: string; location?: string; seasonWindow?: string }, options: EnrichmentOptions = {}): TournamentEnrichment {
  const slug = tournament.slug ?? normalizeSlug(tournament.name);
  const hub = stableTournamentHubs.find((item) => item.slug === slug);
  const source = { ...hub, ...tournament };
  const entries = entriesForTournamentSlug(slug);
  const flags = levelFlags(`${source.level ?? ""} ${slug}`);
  const relatedTournaments = relatedByType("tournament", slug, "tournament", options, 8);
  const featuredPlayers = relatedByType("tournament", slug, "player", options, 10);
  const liveMatches = (options.matches ?? []).filter((match) => normalizeSlug(match.tournament ?? "") === slug && String(match.status ?? "").toLowerCase().includes("live"));
  const streamingProviders = uniq(entries.map((entry) => entry.streamingService));
  const broadcastCountries = uniq(entries.map((entry) => entry.countryName));

  return {
    slug,
    name: source.name,
    tour: flags.isGrandSlam ? "Grand Slam" : source.level?.includes("WTA") ? "WTA" : source.level?.includes("ATP") ? "ATP" : null,
    surface: source.surface ?? null,
    country: source.location?.split(",").at(-1)?.trim() ?? null,
    season: source.seasonWindow ?? null,
    ...flags,
    hasLiveMatches: liveMatches.length > 0,
    featuredPlayers,
    broadcastCountries,
    streamingProviders,
    relatedTournaments,
    previousEditionLink: flags.isGrandSlam ? `/${slug}-results` : null,
    nextEditionPlaceholder: `Next ${source.name} edition details should be verified against the official schedule before publication.`,
    coverageSummary: entries.length ? `${source.name} has ${entries.length} source-backed broadcaster records across ${broadcastCountries.length} countries.` : `No structured broadcaster rows are attached to ${source.name} yet.`,
    seo: basicSeo(source.name, "tournament guide", uniq([...featuredPlayers, ...relatedTournaments])),
  };
}

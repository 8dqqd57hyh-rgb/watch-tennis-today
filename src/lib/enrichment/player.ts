import { players } from "@/data/players";
import { getMatchSlug } from "@/src/lib/matchCenter";
import type { EnrichmentOptions, PlayerEnrichment } from "./types";
import { basicSeo, buildWatchAvailability, entriesForTournamentSlug, normalizeSlug, relatedByType, uniq } from "./shared";

const FEATURED_COUNT = 8;

export function enrichPlayer(player: { slug?: string; name: string; tour?: string; tournaments?: readonly string[]; surfaceStrength?: string }, options: EnrichmentOptions = {}): PlayerEnrichment {
  const slug = player.slug ?? normalizeSlug(player.name);
  const knownPlayer = (players as Record<string, { name: string; tour?: string; tournaments?: readonly string[]; surfaceStrength?: string }>)[slug];
  const source = { ...knownPlayer, ...player };
  const playerIndex = Object.keys(players).indexOf(slug);
  const relatedPlayers = relatedByType("player", slug, "player", options, 8);
  const relatedTournaments = relatedByType("player", slug, "tournament", options, 8);
  const matches = options.matches ?? [];
  const playerMatches = matches.filter((match) => [match.player1, match.player2].some((name) => normalizeSlug(name ?? "") === slug));
  const activeMatch = playerMatches.find((match) => !String(match.status ?? "").toLowerCase().includes("finish"));
  const tournamentSlugs = (source.tournaments ?? []).map((item) => normalizeSlug(item));
  const watchEntries = tournamentSlugs.flatMap(entriesForTournamentSlug);
  const watchAvailability = buildWatchAvailability(watchEntries);
  const featuredMatches = playerMatches.slice(0, 6).map((match) => ({
    id: `match:${match.id}`,
    type: "match" as const,
    label: `${match.player1} vs ${match.player2}`,
    href: `/match/${getMatchSlug({ player1: match.player1 ?? "", player2: match.player2 ?? "" })}`,
    metadata: { tournament: match.tournament, startTime: match.startTime },
  }));

  return {
    slug,
    name: source.name,
    careerStage: playerIndex >= 0 && playerIndex < FEATURED_COUNT ? "featured" : playerIndex >= 0 ? "established" : "emerging",
    tour: source.tour ?? "ATP/WTA",
    country: null,
    surfaceStrengths: source.surfaceStrength ? [source.surfaceStrength] : ["Surface profile unavailable — verify with official match data before publishing claims."],
    currentActivity: activeMatch ? `Scheduled around ${activeMatch.tournament ?? "an upcoming match"}` : "No live or upcoming match found in the current match window.",
    hasUpcomingMatch: Boolean(activeMatch),
    nextTournament: activeMatch?.tournament ?? relatedTournaments[0]?.label ?? null,
    recentTournament: playerMatches.at(-1)?.tournament ?? null,
    watchAvailability,
    broadcastCountries: watchAvailability.countries,
    relatedPlayers,
    relatedTournaments,
    featuredMatches,
    quickFacts: [
      { label: "Tour", value: source.tour ?? "ATP/WTA" },
      { label: "Known surface note", value: source.surfaceStrength ?? "Not enough sourced data yet" },
      { label: "Broadcast countries", value: String(watchAvailability.countries.length) },
    ],
    seo: basicSeo(source.name, "player guide", uniq([...relatedTournaments, ...relatedPlayers])),
  };
}

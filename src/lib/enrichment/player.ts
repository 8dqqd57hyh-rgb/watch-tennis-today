import { players } from "@/data/players";
import { getMatchSlug } from "@/src/lib/matchCenter";
import type { EnrichmentOptions, PlayerEnrichment } from "./types";
import { basicSeo, buildWatchAvailability, entriesForTournamentSlug, normalizeSlug, relatedByType, uniq } from "./shared";
import { normalizeMatchStatus } from "@/app/lib/matchStatus";
import { stableTournamentHubs } from "@/data/tournamentHubs";

const FEATURED_COUNT = 8;

function matchStartTime(match: { startTime?: string | null; datetime?: string | null; scheduledAt?: string | null }) {
  return match.startTime || match.datetime || match.scheduledAt || null;
}

function formatActivityDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

function isPlayerMatch(
  match: { player1?: string | null; player2?: string | null },
  slug: string,
  playerName: string,
) {
  const targetParts = normalizeSlug(playerName).split("-").filter(Boolean);
  const targetLast = targetParts.at(-1);
  const targetInitial = targetParts[0]?.[0];

  return [match.player1, match.player2].some((name) => {
    const value = name ?? "";
    if (normalizeSlug(value) === slug) return true;

    const parts = normalizeSlug(value).split("-").filter(Boolean);
    return Boolean(targetLast && parts.at(-1) === targetLast && parts[0]?.[0] === targetInitial);
  });
}

function resolveHubTournament(tournaments: readonly string[] = []) {
  const normalizedAssociations = tournaments.map((tournament) => normalizeSlug(tournament));
  return stableTournamentHubs.find((hub) => {
    const hubSlug = normalizeSlug(hub.name);
    return normalizedAssociations.some((association) =>
      association === hubSlug || association.includes(hubSlug) || hubSlug.includes(association)
    );
  })?.name ?? null;
}

export function enrichPlayer(player: { slug?: string; name: string; tour?: string; tournaments?: readonly string[]; surfaceStrength?: string; nextTournament?: string; activeTournament?: string }, options: EnrichmentOptions = {}): PlayerEnrichment {
  const slug = player.slug ?? normalizeSlug(player.name);
  const knownPlayer = (players as Record<string, { name: string; tour?: string; tournaments?: readonly string[]; surfaceStrength?: string; nextTournament?: string; activeTournament?: string }>)[slug];
  const source = { ...knownPlayer, ...player };
  const playerIndex = Object.keys(players).indexOf(slug);
  const relatedPlayers = relatedByType("player", slug, "player", options, 8);
  const relatedTournaments = relatedByType("player", slug, "tournament", options, 8);
  const matches = options.matches ?? [];
  const playerMatches = matches.filter((match) => isPlayerMatch(match, slug, source.name));
  const activeMatch = playerMatches.find((match) => {
    const status = normalizeMatchStatus(match.status);
    return status === "LIVE" || status === "UPCOMING";
  });
  const fallbackTournament = player.nextTournament || player.activeTournament || knownPlayer?.nextTournament || knownPlayer?.activeTournament || resolveHubTournament(source.tournaments);
  const fallbackDate = null;
  const fallbackOpponent = fallbackTournament ? "TBD" : null;
  const tournamentSlugs = (source.tournaments ?? []).map((item) => normalizeSlug(item));
  const staticWatchEntries = tournamentSlugs.flatMap(entriesForTournamentSlug);
  const activeTournamentEntries = (activeMatch?.tournament || fallbackTournament)
    ? entriesForTournamentSlug(activeMatch?.tournament || fallbackTournament || "")
    : [];
  const tourEntries = (activeMatch || fallbackTournament) && !activeTournamentEntries.length
    ? entriesForTournamentSlug(source.tour?.toLowerCase() === "wta" ? "wta-tour" : "atp-tour")
    : [];
  const watchEntries = [...staticWatchEntries, ...activeTournamentEntries, ...tourEntries]
    .filter((entry, index, entries) => entries.findIndex((candidate) =>
      `${candidate.countrySlug}:${candidate.tournamentSlug}:${candidate.streamingService}` ===
      `${entry.countrySlug}:${entry.tournamentSlug}:${entry.streamingService}`
    ) === index);
  const watchAvailability = buildWatchAvailability(watchEntries);
  const featuredMatches = playerMatches.slice(0, 6).map((match) => ({
    id: `match:${match.id}`,
    type: "match" as const,
    label: `${match.player1} vs ${match.player2}`,
    href: `/match/${getMatchSlug({ player1: match.player1 ?? "", player2: match.player2 ?? "" })}`,
    metadata: { tournament: match.tournament, startTime: matchStartTime(match) },
  }));

  const activeDate = activeMatch ? formatActivityDate(matchStartTime(activeMatch)) : null;
  const activeTournament = activeMatch?.tournament ?? fallbackTournament;
  const currentActivity = activeMatch
    ? `${normalizeMatchStatus(activeMatch.status) === "LIVE" ? "Live" : "Upcoming"}: ${activeTournament}${activeDate ? ` (${activeDate})` : ""}`
    : fallbackTournament
      ? `Upcoming tournament: ${fallbackTournament}`
      : "No confirmed match schedule in current provider feed";
  const currentActivityDisplay = activeMatch
    ? currentActivity
    : fallbackTournament && fallbackDate
      ? `Upcoming: ${fallbackTournament} — ${new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(fallbackDate))}`
      : currentActivity;

  return {
    slug,
    name: source.name,
    careerStage: playerIndex >= 0 && playerIndex < FEATURED_COUNT ? "featured" : playerIndex >= 0 ? "established" : "emerging",
    tour: source.tour ?? "ATP/WTA",
    country: null,
    surfaceStrengths: source.surfaceStrength ? [source.surfaceStrength] : ["Surface profile unavailable — verify with official match data before publishing claims."],
    currentActivity,
    currentActivityDisplay,
    hasUpcomingMatch: Boolean(activeMatch || fallbackDate),
    nextTournament: activeMatch?.tournament ?? fallbackTournament,
    nextMatchDate: activeMatch ? matchStartTime(activeMatch) : fallbackDate,
    nextOpponent: activeMatch ? null : fallbackOpponent,
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

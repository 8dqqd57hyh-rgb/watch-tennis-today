import { getMatchSlug, type MatchCenterMatch } from "@/src/lib/matchCenter";
import type { EnrichmentOptions, MatchEnrichment } from "./types";
import { basicSeo, buildWatchAvailability, entriesForTournamentSlug, normalizeSlug, relatedByType, uniq } from "./shared";

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function enrichMatch(match: MatchCenterMatch, options: EnrichmentOptions = {}): MatchEnrichment {
  const slug = getMatchSlug(match);
  const name = `${match.player1} vs ${match.player2}`;
  const start = match.startTime ? new Date(match.startTime) : null;
  const today = options.today ?? new Date();
  const isLive = String(match.status ?? "").toLowerCase().includes("live");
  const isToday = Boolean(start && sameDay(start, today));
  const isUpcoming = Boolean(start && start.getTime() > today.getTime());
  const entries = entriesForTournamentSlug(normalizeSlug(match.tournament ?? match.category ?? ""));
  const watch = buildWatchAvailability(entries);
  const relatedMatches = relatedByType("match", slug, "match", options, 6);
  const relatedArticles = uniq([
    { id: "guide:legal", type: "tournament" as const, label: "How to watch tennis legally", href: "/how-to-watch-tennis-legally", metadata: {} },
    { id: "guide:tv", type: "tournament" as const, label: "Official tennis broadcasters guide", href: "/official-tennis-broadcasters-guide", metadata: {} },
  ]);

  return {
    slug,
    name,
    importanceScore: (isLive ? 40 : 0) + (isToday ? 25 : 0) + (match.tournament ? 15 : 0) + (watch.countries.length ? 20 : 0),
    isToday,
    isLive,
    isUpcoming,
    watchCountries: watch.countries,
    streamingServices: watch.streamingServices,
    recommendedViewing: watch.streamingServices[0] ? `Start by checking ${watch.streamingServices[0]} and confirm availability on the official provider page.` : "No source-backed viewing option is attached yet; check the tournament broadcaster page.",
    featuredBroadcasters: watch.broadcasters,
    matchContext: `${name}${match.tournament ? ` at ${match.tournament}` : ""}${match.round ? `, ${match.round}` : ""}.`,
    relatedMatches,
    relatedArticles,
    seo: basicSeo(name, "match center", relatedArticles),
  };
}

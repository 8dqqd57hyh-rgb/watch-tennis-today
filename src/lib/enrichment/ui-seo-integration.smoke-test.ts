import {
  clearEnrichmentCache,
  getBroadcasterEnrichment,
  getCountryEnrichment,
  getEnrichmentCacheSize,
  getMatchEnrichment,
  getPlayerEnrichment,
  getTournamentEnrichment,
} from "./index";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

clearEnrichmentCache();

const player = getPlayerEnrichment({
  slug: "jannik-sinner",
  name: "Jannik Sinner",
  tour: "ATP",
  tournaments: ["Wimbledon"],
});
assert(player.quickFacts.length > 0, "player enrichment should expose quick facts for UI");
assert(player.seo.title.includes("Jannik Sinner"), "player enrichment should expose SEO title");

const tournament = getTournamentEnrichment({ slug: "wimbledon", name: "Wimbledon", level: "Grand Slam", surface: "Grass", location: "London, United Kingdom" });
assert(tournament.isGrandSlam, "tournament enrichment should classify Grand Slams");
assert(Array.isArray(tournament.broadcastCountries), "tournament enrichment should expose broadcast countries");

const match = getMatchEnrichment({
  id: "smoke-match",
  player1: "Jannik Sinner",
  player2: "Carlos Alcaraz",
  tournament: "Wimbledon",
  category: "ATP",
  status: "SCHEDULED",
  score: "",
  startTime: new Date(Date.now() + 86_400_000).toISOString(),
  watchProviders: [],
});
assert(match.importanceScore > 0, "match enrichment should score useful matches");
assert(match.seo.faq.length > 0, "match enrichment should provide FAQ data for SEO");

const country = getCountryEnrichment({ slug: "poland", name: "Poland" });
assert(country.coverageSummary.length > 0, "country enrichment should expose coverage summary");

const broadcaster = getBroadcasterEnrichment({ slug: "espn", name: "ESPN" });
assert(broadcaster.confidenceSummary.length > 0, "broadcaster enrichment should expose confidence summary");

assert(getEnrichmentCacheSize() >= 5, "memoized enrichment getters should populate cache");

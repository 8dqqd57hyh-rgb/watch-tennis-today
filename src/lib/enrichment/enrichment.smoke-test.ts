import { getMatchSlug, type MatchCenterMatch } from "@/src/lib/matchCenter";
import {
  clearEnrichmentCache,
  getBroadcasterEnrichment,
  getCountryEnrichment,
  getEnrichmentCacheSize,
  getMatchEnrichment,
  getPlayerEnrichment,
  getStreamingEnrichment,
  getTournamentEnrichment,
} from "./index";

const sampleMatch: MatchCenterMatch = {
  id: "sample",
  player1: "Jannik Sinner",
  player2: "Carlos Alcaraz",
  tournament: "Wimbledon",
  category: "ATP",
  status: "Scheduled",
  score: "",
  startTime: "2026-07-01T12:00:00.000Z",
  watchProviders: [],
};

const TBD_MATCH: MatchCenterMatch = {
  id: "tbd-sample",
  player1: "A. Rublev",
  player2: "",
  tournament: "Hangzhou Open",
  category: "ATP",
  status: "UPCOMING",
  score: "",
  startTime: "2026-09-25T08:00:00.000Z",
  watchProviders: [],
};

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

export function runEnrichmentSmokeTest() {
  clearEnrichmentCache();
  const player = getPlayerEnrichment({ slug: "jannik-sinner", name: "Jannik Sinner" }, { matches: [sampleMatch] });
  const tbdPlayer = getPlayerEnrichment({ slug: "andrey-rublev", name: "Andrey Rublev", tour: "ATP" }, { matches: [TBD_MATCH] });
  const tournamentFallback = getPlayerEnrichment({ slug: "test-player", name: "Test Player", tour: "ATP", nextTournament: "Hangzhou Open" });
  const emptySchedulePlayer = getPlayerEnrichment({ slug: "andrey-rublev", name: "Andrey Rublev", tour: "ATP" });
  const hubFallbackPlayer = getPlayerEnrichment({ slug: "novak-djokovic", name: "Novak Djokovic", tour: "ATP" });
  const tournament = getTournamentEnrichment({ slug: "wimbledon", name: "Wimbledon" }, { matches: [sampleMatch] });
  const match = getMatchEnrichment(sampleMatch, { today: new Date("2026-06-30T00:00:00.000Z") });
  const country = getCountryEnrichment({ slug: "united-states", name: "United States" });
  const broadcaster = getBroadcasterEnrichment({ slug: "espn", name: "ESPN" });
  const streaming = getStreamingEnrichment({ slug: "espn-plus", name: "ESPN+" });

  assert(player.name === "Jannik Sinner", "player enrichment keeps player identity");
  assert(player.hasUpcomingMatch, "player enrichment detects upcoming match");
  assert(tbdPlayer.hasUpcomingMatch, "player enrichment keeps a TBD-opponent match");
  assert(tbdPlayer.currentActivity === "Upcoming: Hangzhou Open (Sep 25)", "player enrichment formats TBD match activity");
  assert(tbdPlayer.broadcastCountries.length > 0, "player enrichment uses ATP broadcast fallback for dynamic tournaments");
  assert(tournamentFallback.currentActivity === "Upcoming tournament: Hangzhou Open", "player enrichment exposes tournament-only activity");
  assert(tournamentFallback.nextTournament === "Hangzhou Open", "player enrichment preserves tournament-only context");
  assert(tournamentFallback.broadcastCountries.length > 0, "tournament-only context receives tour broadcast coverage");
  assert(emptySchedulePlayer.nextTournament === "Grand Slam Tournaments", "hub metadata supplies the player tournament fallback");
  assert(hubFallbackPlayer.nextTournament === "Grand Slam Tournaments", "hub metadata supplies an associated tournament fallback");
  assert(tournament.isGrandSlam, "tournament enrichment detects Grand Slam");
  assert(match.slug === getMatchSlug(sampleMatch), "match enrichment uses canonical match slug");
  assert(country.coverageSummary.length > 0, "country enrichment returns coverage summary");
  assert(broadcaster.confidenceSummary.length > 0, "broadcaster enrichment returns confidence summary");
  assert(streaming.subscriptionModel.length > 0, "streaming enrichment returns subscription model");
  assert(getEnrichmentCacheSize() >= 6, "enrichment cache stores computed values");
}

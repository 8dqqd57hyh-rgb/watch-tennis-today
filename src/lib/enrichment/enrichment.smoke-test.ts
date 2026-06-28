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

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

export function runEnrichmentSmokeTest() {
  clearEnrichmentCache();
  const player = getPlayerEnrichment({ slug: "jannik-sinner", name: "Jannik Sinner" }, { matches: [sampleMatch] });
  const tournament = getTournamentEnrichment({ slug: "wimbledon", name: "Wimbledon" }, { matches: [sampleMatch] });
  const match = getMatchEnrichment(sampleMatch, { today: new Date("2026-06-30T00:00:00.000Z") });
  const country = getCountryEnrichment({ slug: "united-states", name: "United States" });
  const broadcaster = getBroadcasterEnrichment({ slug: "espn", name: "ESPN" });
  const streaming = getStreamingEnrichment({ slug: "espn-plus", name: "ESPN+" });

  assert(player.name === "Jannik Sinner", "player enrichment keeps player identity");
  assert(player.hasUpcomingMatch, "player enrichment detects upcoming match");
  assert(tournament.isGrandSlam, "tournament enrichment detects Grand Slam");
  assert(match.slug === getMatchSlug(sampleMatch), "match enrichment uses canonical match slug");
  assert(country.coverageSummary.length > 0, "country enrichment returns coverage summary");
  assert(broadcaster.confidenceSummary.length > 0, "broadcaster enrichment returns confidence summary");
  assert(streaming.subscriptionModel.length > 0, "streaming enrichment returns subscription model");
  assert(getEnrichmentCacheSize() >= 6, "enrichment cache stores computed values");
}

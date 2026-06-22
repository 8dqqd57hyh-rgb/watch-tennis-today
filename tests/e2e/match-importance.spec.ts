import { expect, test } from "@playwright/test";
import {
  calculateMatchImportance,
  getMatchImportanceReasons,
  getWhyWatchText,
  type MatchImportanceMatch,
} from "@/lib/matchImportance";

const now = "2026-06-22T12:00:00.000Z";

function match(overrides: Partial<MatchImportanceMatch> = {}): MatchImportanceMatch {
  return {
    player1: "Unknown Player",
    player2: "Another Player",
    tournament: "Small Tennis Event",
    category: "ATP",
    status: "UPCOMING",
    startTime: "2026-06-22T18:00:00.000Z",
    round: "Round 1",
    watchProviders: [],
    ...overrides,
  };
}

test.describe("match importance utility", () => {
  test("boosts Grand Slam matches", () => {
    const regularScore = calculateMatchImportance(match(), { now });
    const slamScore = calculateMatchImportance(match({ tournament: "Wimbledon" }), { now });

    expect(slamScore).toBeGreaterThan(regularScore);
    expect(getMatchImportanceReasons(match({ tournament: "Wimbledon" }), { now })).toContain("Grand Slam match");
  });

  test("boosts final and semifinal rounds", () => {
    const regularScore = calculateMatchImportance(match(), { now });
    const finalScore = calculateMatchImportance(match({ round: "Final" }), { now });
    const semifinalScore = calculateMatchImportance(match({ round: "Semi Final" }), { now });

    expect(finalScore).toBeGreaterThan(regularScore);
    expect(semifinalScore).toBeGreaterThan(regularScore);
    expect(getMatchImportanceReasons(match({ round: "Final" }), { now })).toContain("Final round");
    expect(getMatchImportanceReasons(match({ round: "Semi Final" }), { now })).toContain("Semifinal round");
  });

  test("boosts live matches", () => {
    const regularScore = calculateMatchImportance(match(), { now });
    const liveScore = calculateMatchImportance(match({ status: "LIVE" }), { now });

    expect(liveScore).toBeGreaterThan(regularScore);
    expect(getMatchImportanceReasons(match({ status: "LIVE" }), { now })).toContain("Live now");
  });

  test("boosts matches starting within two hours", () => {
    const laterScore = calculateMatchImportance(match({ startTime: "2026-06-22T15:00:01.000Z" }), { now });
    const soonScore = calculateMatchImportance(match({ startTime: "2026-06-22T13:30:00.000Z" }), { now });

    expect(soonScore).toBeGreaterThan(laterScore);
    expect(getMatchImportanceReasons(match({ startTime: "2026-06-22T13:30:00.000Z" }), { now })).toContain("Starts soon");
  });

  test("boosts popular players from verified player data", () => {
    const regularScore = calculateMatchImportance(match(), { now });
    const popularScore = calculateMatchImportance(match({ player1: "Carlos Alcaraz" }), { now });

    expect(popularScore).toBeGreaterThan(regularScore);
    expect(getMatchImportanceReasons(match({ player1: "Carlos Alcaraz" }), { now })).toContain(
      "Features a popular player"
    );
  });

  test("keeps scores between one and five", () => {
    expect(calculateMatchImportance(match(), { now })).toBe(1);

    const maximumCandidate = calculateMatchImportance(
      match({
        player1: "Carlos Alcaraz",
        player2: "Jannik Sinner",
        tournament: "US Open",
        status: "LIVE",
        startTime: "2026-06-22T12:15:00.000Z",
        round: "Final",
        watchProviders: [{ name: "US Open official broadcasters", url: "https://www.usopen.org/", verificationStatus: "TOURNAMENT_VERIFIED" }],
      }),
      { now }
    );

    expect(maximumCandidate).toBeGreaterThanOrEqual(1);
    expect(maximumCandidate).toBeLessThanOrEqual(5);
  });

  test("reasons only describe available data", () => {
    const reasons = getMatchImportanceReasons(match(), { now });

    expect(reasons).not.toContain("Grand Slam match");
    expect(reasons).not.toContain("Rivalry context available");
    expect(reasons).not.toContain("Official watch info available");
  });

  test("builds short why-watch text from real reasons", () => {
    const text = getWhyWatchText(match({ player1: "Iga Swiatek", startTime: "2026-06-22T13:30:00.000Z" }), { now });

    expect(text).toContain("features a popular player");
    expect(text).toContain("starts soon");
    expect(text.length).toBeLessThan(180);
  });
});

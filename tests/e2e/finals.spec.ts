import { expect, test } from "@playwright/test";
import { getFeaturedWashingtonFinals, getUpcomingFinals, type Match } from "../../app/lib/finals";

const baseMatch: Match = {
  id: "1",
  player1: "J. Pegula",
  player2: "A. Eala",
  tournament: "Washington",
  category: "WTA",
  status: "SUSPENDED",
  score: "6-4, 1-2",
  startTime: "2026-08-02T21:00:00Z",
  round: "WTA Washington - Final",
};

test("selects the featured Washington finals and keeps suspended matches", () => {
  expect(getFeaturedWashingtonFinals([baseMatch])).toEqual([baseMatch]);
});

test("recognizes common provider final round labels", () => {
  for (const round of ["Final", "Finals", "Grand Final", "WTA Washington Final"]) {
    const match = { ...baseMatch, round };

    expect(getUpcomingFinals([match])).toEqual([match]);
    expect(getFeaturedWashingtonFinals([match])).toEqual([match]);
  }
});

test("does not mistake early rounds ending in -finals for a tournament final", () => {
  for (const round of [
    "WTA Toronto - 1/64-finals",
    "1/4 Final",
    "Semi Final",
    "Quarter-Final",
    "Qualifying Final",
  ]) {
    const earlyRound = { ...baseMatch, round };

    expect(getUpcomingFinals([earlyRound])).toEqual([]);
    expect(getFeaturedWashingtonFinals([earlyRound])).toEqual([]);
  }
});

test("excludes finals with null or invalid start times", () => {
  const missingStart = { ...baseMatch, id: "missing", startTime: null };
  const invalidStart = { ...baseMatch, id: "invalid", startTime: "not-a-date" };

  expect(getUpcomingFinals([missingStart, invalidStart])).toEqual([]);
  expect(getFeaturedWashingtonFinals([missingStart, invalidStart])).toEqual([]);
});

test("sorts finals by valid start time", () => {
  const earlier = { ...baseMatch, id: "earlier", startTime: "2026-08-02T20:00:00Z" };

  expect(getUpcomingFinals([baseMatch, earlier])).toEqual([earlier, baseMatch]);
  expect(getFeaturedWashingtonFinals([baseMatch, earlier])).toEqual([earlier, baseMatch]);
});

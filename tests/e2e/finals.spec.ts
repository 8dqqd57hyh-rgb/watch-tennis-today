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

test("does not mistake early rounds ending in -finals for a tournament final", () => {
  const earlyRound = { ...baseMatch, round: "WTA Toronto - 1/64-finals" };

  expect(getUpcomingFinals([earlyRound])).toEqual([]);
  expect(getFeaturedWashingtonFinals([earlyRound])).toEqual([]);
});

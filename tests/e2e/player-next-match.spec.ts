import { expect, test } from "@playwright/test";
import { getPlayerMatchStartTime, getPlayerPageSummary, type PlayerMatch } from "../../app/lib/playerPageSummary";
import { isFinishedMatch } from "../../app/lib/playerMatchResult";

const now = Date.parse("2026-09-21T12:00:00Z");
type TestMatch = PlayerMatch & { id: string; score: string };
function match(id: string, status: string, hours: number, score = "") {
  return { id, status, score, startTime: new Date(now + hours * 3600000).toISOString(),
    tournament: "Test tournament", player1: "Alexander Zverev", player2: id };
}
const summary = (matches: TestMatch[]) =>
  getPlayerPageSummary("Alexander Zverev", matches, isFinishedMatch, now);

test("next match is the earliest scheduled fixture regardless of input order or status spelling", () => {
  const rows = [match("later", "UPCOMING", 48), match("first", "SCHEDULED", 2), match("middle", "NOT_STARTED", 24)];
  expect(summary(rows).nextMatch?.id).toBe("first");
  expect(summary(rows).upcomingMatches.map((m) => m.id)).toEqual(["first", "middle", "later"]);
  expect(rows.map((m) => m.id)).toEqual(["later", "first", "middle"]);
});

test("current live match takes priority and is described as live in the FAQ", () => {
  const result = summary([match("scheduled", "UPCOMING", 1), match("live", "LIVE", -1, "6-4, 2-2")]);
  expect(result.nextMatch?.id).toBe("live");
  expect(result.nextMatchAnswer).toContain("current live match");
});

test("completed results never become next matches and are newest first", () => {
  const result = summary([match("old", "FINISHED", -72, "6-4, 6-4"), match("recent", "FINISHED", -24, "6-3, 6-2")]);
  expect(result.nextMatch).toBeUndefined();
  expect(result.finishedMatches.map((m) => m.id)).toEqual(["recent", "old"]);
  expect(result.nextMatchAnswer).toContain("No upcoming match is currently listed");
  expect(result.tournaments).toEqual([]);
});

test("complete scores override stale live and upcoming labels", () => {
  const result = summary([match("live-ended", "LIVE", -1, "6-4, 7-6"), match("scheduled-ended", "UPCOMING", -2, "6-2, 6-4")]);
  expect(result.nextMatch).toBeUndefined();
  expect(result.liveMatches).toEqual([]);
  expect(result.upcomingMatches).toEqual([]);
  expect(result.finishedMatches).toHaveLength(2);
});

for (const status of ["CANCELLED", "CANCELED", "SUSPENDED", "POSTPONED", "UNKNOWN", "EXPIRED", "RETIRED", "WALKOVER"]) {
  test(`${status} is never advertised as the next match`, () => {
    expect(summary([match("unavailable", status, 1)]).nextMatch).toBeUndefined();
  });
}

test("stale and undated fixtures do not claim current activity", () => {
  const rows = [match("stale-live", "LIVE", -9), match("stale-scheduled", "UPCOMING", -13),
    { ...match("missing-date", "UPCOMING", 1), startTime: "" },
    { ...match("invalid-date", "LIVE", -1), startTime: "invalid" }, match("future-live", "LIVE", 24)];
  expect(summary(rows).nextMatch).toBeUndefined();
  expect(summary([]).nextMatch).toBeUndefined();
});

test("ordinary schedule delays stay listed within the existing feed grace window", () => {
  expect(summary([match("delayed-start", "UPCOMING", -2)]).nextMatch?.id).toBe("delayed-start");
});

test("scheduled matches remain selectable when the opponent is TBD", () => {
  const scheduled = {
    ...match("tbd-opponent", "UPCOMING", 24),
    player2: "Opponent to be confirmed",
    tournament: "Hangzhou Open",
  };

  const result = summary([scheduled]);
  expect(result.nextMatch?.tournament).toBe("Hangzhou Open");
  expect(getPlayerMatchStartTime(result.nextMatch!)).toBe(scheduled.startTime);
});

test("alternate scheduled date fields qualify as upcoming matches", () => {
  const scheduled = {
    ...match("scheduled-at", "UPCOMING", 24),
    startTime: null,
    datetime: new Date(now + 24 * 3600000).toISOString(),
  };

  expect(summary([scheduled]).nextMatch?.id).toBe("scheduled-at");
});

test("unfinished sets and two-set leads in men's majors remain live", () => {
  for (const score of ["6-4, 6-4, 0-0", "6-4, 7-7", "6-4, 6-4, pending"]) {
    expect(summary([match("playing", "LIVE", -1, score)]).liveMatches).toHaveLength(1);
  }
  const major = { ...match("major", "LIVE", -1, "6-4, 6-4"), tournament: "ATP Wimbledon", category: "ATP" };
  expect(summary([major]).liveMatches).toHaveLength(1);
  expect(summary([{ ...major, score: "6-4, 6-4, 6-4" }]).nextMatch).toBeUndefined();
});

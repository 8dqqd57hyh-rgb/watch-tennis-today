import { expect, test } from "@playwright/test";
import { getCalendarHref } from "../../app/components/MatchReminderPanel";
import {
  isChampionshipFinalRound,
  normalizeMatchStartTime,
  resolveMatchWinner,
} from "../../app/lib/matchNormalization";

test.describe("match data normalization", () => {
  test("only marks actual championship finals", () => {
    expect(isChampionshipFinalRound("Final")).toBe(true);
    expect(isChampionshipFinalRound("ATP Montreal - Final")).toBe(true);
    expect(isChampionshipFinalRound("ATP Montreal - 1/32-finals")).toBe(false);
    expect(isChampionshipFinalRound("Quarter-finals")).toBe(false);
    expect(isChampionshipFinalRound("Qualifying Final")).toBe(false);
  });

  test("converts API-Tennis Warsaw wall-clock timestamps to explicit UTC", () => {
    expect(normalizeMatchStartTime("2026-08-05T17:00:00")).toBe("2026-08-05T15:00:00.000Z");
    expect(normalizeMatchStartTime("2026-01-05T17:00:00")).toBe("2026-01-05T16:00:00.000Z");
    expect(normalizeMatchStartTime("2026-08-05T17:00:00Z")).toBe("2026-08-05T17:00:00.000Z");
    expect(normalizeMatchStartTime("not-a-date")).toBeNull();
  });

  test("resolves provider winner positions to player names", () => {
    expect(resolveMatchWinner("First Player", "Player A", "Player B")).toBe("Player A");
    expect(resolveMatchWinner("Second Player", "Player A", "Player B")).toBe("Player B");
    expect(resolveMatchWinner("Named Winner", "Player A", "Player B")).toBe("Named Winner");
  });

  test("builds a real calendar reminder", () => {
    const href = getCalendarHref({
      matchTitle: "Player A vs Player B",
      tournament: "Test Open",
      startTime: "2026-08-05T15:00:00.000Z",
      matchUrl: "https://watchtennistoday.com/watch/test",
    });

    expect(href).toContain("data:text/calendar");
    expect(decodeURIComponent(href || "")).toContain("TRIGGER:-PT30M");
    expect(decodeURIComponent(href || "")).toContain("DTSTART:20260805T150000Z");
  });
});

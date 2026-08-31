import { expect, test } from "@playwright/test";
import { getCalendarHref } from "../../app/components/MatchReminderPanel";
import {
  isChampionshipFinalRound,
  normalizeMatchStartTime,
  resolveMatchWinner,
  isUsOpenTournament,
  getMatchLocalDateKey,
} from "../../app/lib/matchNormalization";
import { getMatchStatusPresentation, groupMatchesByStatus, isLiveMatch, isSuspendedMatch, normalizeMatchStatus, resolveProviderMatchStatus } from "../../app/lib/matchStatus";

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

  test("only explicit in-progress provider data resolves to LIVE", () => {
    expect(resolveProviderMatchStatus({ providerStatus: "In Progress" })).toBe("LIVE");
    expect(isLiveMatch("LIVE")).toBe(true);
    expect(resolveProviderMatchStatus({ providerStatus: "Upcoming", providerLive: true, hasScore: true, startsInFuture: false })).toBe("UPCOMING");
    expect(resolveProviderMatchStatus({ providerStatus: "Finished", providerLive: true, hasScore: true })).toBe("FINISHED");
    expect(resolveProviderMatchStatus({ providerStatus: "Retired", providerLive: true, hasScore: true })).toBe("RETIRED");
    expect(resolveProviderMatchStatus({ providerStatus: "mystery", hasScore: false })).toBe("UNKNOWN");
  });

  test("keeps suspended matches explicit and outside LIVE", () => {
    expect(normalizeMatchStatus("Interrupted")).toBe("SUSPENDED");
    expect(resolveProviderMatchStatus({ providerStatus: "Suspended", providerLive: true })).toBe("SUSPENDED");
    expect(isLiveMatch("SUSPENDED")).toBe(false);
    expect(normalizeMatchStatus("Live - Suspended")).toBe("SUSPENDED");
    expect(isLiveMatch("Live - Suspended")).toBe(false);
    expect(isSuspendedMatch("Live - Suspended")).toBe(true);
    expect(getMatchStatusPresentation("Live - Suspended")).toEqual({
      status: "SUSPENDED",
      badge: "SUSPENDED",
      supportingText: "Match suspended",
      tone: "suspended",
    });
  });

  test("live counters and filters share canonical grouping", () => {
    const grouped = groupMatchesByStatus([
      { id: "live", status: "LIVE" },
      { id: "suspended-1", status: "SUSPENDED" },
      { id: "suspended-2", status: "Live - Suspended" },
      { id: "upcoming", status: "UPCOMING" },
    ]);
    expect(grouped.live.map((match) => match.id)).toEqual(["live"]);
    expect(grouped.suspended.map((match) => match.id)).toEqual(["suspended-1", "suspended-2"]);
    expect(grouped.upcoming.map((match) => match.id)).toEqual(["upcoming"]);
    expect(grouped.finished).toEqual([]);
  });

  test("an explicit upcoming status stays upcoming after its scheduled time", () => {
    expect(resolveProviderMatchStatus({
      providerStatus: "UPCOMING",
      providerLive: false,
      startsInFuture: false,
      pastUnplayed: true,
    })).toBe("UPCOMING");
    expect(normalizeMatchStatus("SCHEDULED")).toBe("UPCOMING");
  });

  test("maps the provider's blank non-live fixture status to upcoming", () => {
    expect(resolveProviderMatchStatus({
      providerStatus: "",
      providerLive: false,
      providerScheduled: true,
      hasScore: false,
      startsInFuture: true,
    })).toBe("UPCOMING");
    expect(normalizeMatchStatus("NS")).toBe("UPCOMING");
    expect(normalizeMatchStatus("TBD")).toBe("UPCOMING");
  });

  test("compares today in the user's timezone across a UTC date boundary", () => {
    const timeZone = "America/Los_Angeles";
    const localNow = "2026-08-31T23:00:00.000Z";
    const laterSameLocalDay = "2026-09-01T03:30:00.000Z";
    expect(localNow.slice(0, 10)).not.toBe(laterSameLocalDay.slice(0, 10));
    expect(getMatchLocalDateKey(localNow, timeZone)).toBe(getMatchLocalDateKey(laterSameLocalDay, timeZone));
  });

  test("a newer non-live state replaces stale LIVE flags", () => {
    expect(resolveProviderMatchStatus({ providerStatus: "Live", providerLive: true })).toBe("LIVE");
    expect(resolveProviderMatchStatus({ providerStatus: "Finished", providerLive: true, hasScore: true })).toBe("FINISHED");
    expect(resolveProviderMatchStatus({ providerStatus: "Live", providerLive: true, hasScore: true, staleLive: true })).toBe("FINISHED");
  });

  test("matches common US Open provider aliases centrally", () => {
    expect(isUsOpenTournament("US Open - Men Singles")).toBe(true);
    expect(isUsOpenTournament("U.S. Open Women")).toBe(true);
    expect(isUsOpenTournament("French Open")).toBe(false);
  });
});

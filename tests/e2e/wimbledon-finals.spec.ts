import { expect, test } from "@playwright/test";
import type { ServerMatch } from "../../app/lib/serverMatches";
import { getWimbledonEventType, isFinalRound, isWimbledonTournament, normalizeFinalStatus, selectWimbledonFinals } from "../../app/lib/wimbledonFinals";
import { londonDateTimeIso, mapMatch } from "../../app/lib/wimbledonOfficialUtils";

function match(overrides: Partial<ServerMatch> = {}): ServerMatch { return { id: "event-1", player1: "Alex Example", player2: "Blair Sample", tournament: "Wimbledon - ATP", category: "ATP", status: "SCHEDULED", score: "", startTime: "2030-07-13T14:00:00", round: "Final", watchProviders: [], ...overrides }; }

test.describe("Wimbledon finals selector", () => {
  test("detects singles final and excludes semifinal, qualifying and other events", () => { expect(selectWimbledonFinals([match()])).toHaveLength(1); expect(isFinalRound("Semi-final")).toBeFalsy(); expect(isFinalRound("Qualifying Final")).toBeFalsy(); expect(isWimbledonTournament(match({ tournament: "Wimbledon Qualifying" }))).toBeFalsy(); expect(selectWimbledonFinals([match({ tournament: "London Open" })])).toEqual([]); });
  test("distinguishes women, men and doubles", () => { expect(getWimbledonEventType(match())).toBe("mens-singles"); expect(getWimbledonEventType(match({ tournament: "Wimbledon - WTA", category: "WTA" }))).toBe("womens-singles"); expect(getWimbledonEventType(match({ player1: "A One / B Two", tournament: "Wimbledon Men's Doubles" }))).toBe("mens-doubles"); });
  test("deduplicates and prefers live or scored completed records", () => { const scheduled = match(); const live = match({ status: "LIVE", score: "6-4", pointScore: "30-15" }); expect(selectWimbledonFinals([scheduled, live])).toMatchObject([{ status: "live", score: "6-4" }]); const finished = match({ status: "FINISHED", score: "6-4 6-4", winner: "Alex Example" }); expect(selectWimbledonFinals([scheduled, finished])[0]).toMatchObject({ status: "completed", winnerParticipantIndex: 0 }); });
  test("handles missing time, malformed optionals and empty arrays", () => { expect(selectWimbledonFinals([])).toEqual([]); expect(selectWimbledonFinals([match({ startTime: null, round: "Finals" })])[0].startTime).toBeNull(); });
  test("uses only string resume times", () => { const startTime = "2030-07-13T14:00:00"; expect(selectWimbledonFinals([match({ startTime, resumeTime: "2030-07-13T16:00:00" })])[0].startTime).toBe("2030-07-13T16:00:00"); expect(selectWimbledonFinals([match({ startTime, resumeTime: { invalid: true } })])[0].startTime).toBe(startTime); });
  test("normalizes postponed, walkover, retirement and cancelled states", () => { expect(normalizeFinalStatus("Postponed")).toBe("postponed"); expect(normalizeFinalStatus("Walkover")).toBe("completed"); expect(normalizeFinalStatus("Retired")).toBe("completed"); expect(normalizeFinalStatus("Cancelled")).toBe("cancelled"); });
  test("orders singles first and never infers a winner from participant order", () => { const other = match({ id: "d", tournament: "Wimbledon Mixed Doubles", category: "Mixed Doubles", player1: "A / B", player2: "C / D" }); const singles = match({ id: "s", status: "FINISHED", winner: null }); const result = selectWimbledonFinals([other, singles]); expect(result[0].eventType).toBe("mens-singles"); expect(result[0].winnerParticipantIndex).toBeNull(); });
  test("accepts normalized official Wimbledon records and links them to the live hub", () => { const result = selectWimbledonFinals([match({ id: "wimbledon-official", tournament: "The Championships, Wimbledon - Ladies' Singles", category: "Ladies' Singles" })]); expect(result[0].eventType).toBe("womens-singles"); expect(result[0].matchUrl).toBe("/wimbledon-live"); });
  test("converts published London times across dates and daylight-saving boundaries", () => {
    expect(londonDateTimeIso(2030, 7, 13, 14, 0)).toBe("2030-07-13T13:00:00.000Z");
    expect(londonDateTimeIso(2030, 1, 1, 0, 30)).toBe("2030-01-01T00:30:00.000Z");
  });
  test("maps each side's primary Wimbledon country independently", () => {
    expect(mapMatch({ matchId: "countries", team1: [{ displayNameA: "One", nationA: "POL", nationB: "GBR" }], team2: [{ displayNameA: "Two", nationA: "USA", nationB: "CAN" }] })).toMatchObject({ country1: "POL", country2: "USA" });
  });
});

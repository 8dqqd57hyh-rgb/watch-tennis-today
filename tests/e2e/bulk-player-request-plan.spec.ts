import { expect, test } from "@playwright/test";
import {
  getBulkPlayerParameterState,
  getMatchesRequestPlan,
  normalizeBulkPlayerNames,
  parseBulkPlayerNames,
} from "../../app/api/matches/requestPlan";
import {
  filterBulkApiMatches,
  filterBulkMappedMatches,
} from "../../app/api/matches/bulkPlayer";

test.describe("bulk player matches request plan", () => {
  test("uses one global live call, two fixture windows, and one archive query", () => {
    const plan = getMatchesRequestPlan({
      playerNames: "PlayerA,PlayerB",
      playerName: null,
      playerKey: null,
      matchId: null,
      formHistory: false,
      includeFinished: true,
      daysBack: 14,
      daysForward: 30,
    });

    expect(plan.bulkPlayerNames).toEqual(["PlayerA", "PlayerB"]);
    expect(plan.safeDaysBack).toBe(14);
    expect(plan.safeDaysForward).toBe(30);
    expect(plan.fixtureWindowDays).toBe(28);
    expect(plan.fixtureWindowCount).toBe(2);
    expect(plan.getPlayersCallCount).toBe(0);
    expect(plan.liveScoreCallCount).toBe(1);
    expect(plan.archiveSelectCount).toBe(1);
    expect(plan.archiveUpsertCount).toBe(0);
    expect(plan.usesGlobalArchiveFallback).toBe(false);
  });

  test("trims, removes empty names, and deduplicates", () => {
    expect(parseBulkPlayerNames(" PlayerA,,PlayerB,PlayerA, ")).toEqual([
      "PlayerA",
      "PlayerB",
    ]);
  });

  test("normalizes client player names in stable order", () => {
    expect(normalizeBulkPlayerNames([" PlayerA ", "", "PlayerB", "PlayerA", "  "])).toEqual([
      "PlayerA",
      "PlayerB",
    ]);
  });

  test("accepts only the first 40 unique non-empty names", () => {
    const names = Array.from({ length: 45 }, (_, index) => `Player${index + 1}`);
    const parsed = parseBulkPlayerNames(`,${names.join(",")},Player1`);

    expect(parsed).toHaveLength(40);
    expect(parsed[0]).toBe("Player1");
    expect(parsed[39]).toBe("Player40");
  });

  test("does not query the archive without includeFinished", () => {
    const plan = getMatchesRequestPlan({
      playerNames: "PlayerA,PlayerB",
      playerName: null,
      playerKey: null,
      matchId: null,
      formHistory: false,
      includeFinished: false,
      daysBack: 14,
      daysForward: 30,
    });

    expect(plan.archiveSelectCount).toBe(0);
    expect(plan.safeDaysBack).toBe(14);
    expect(plan.safeDaysForward).toBe(30);
  });

  test("keeps the bulk date range out of the global clamp", () => {
    const bulkPlan = getMatchesRequestPlan({
      playerNames: "PlayerA",
      playerName: null,
      playerKey: null,
      matchId: null,
      formHistory: false,
      includeFinished: false,
      daysBack: 14,
      daysForward: 30,
    });
    const globalPlan = getMatchesRequestPlan({
      playerNames: null,
      playerName: null,
      playerKey: null,
      matchId: null,
      formHistory: false,
      includeFinished: true,
      daysBack: 14,
      daysForward: 30,
    });

    expect(bulkPlan.safeDaysBack).toBe(14);
    expect(bulkPlan.safeDaysForward).toBe(30);
    expect(globalPlan.safeDaysBack).toBe(3);
    expect(globalPlan.safeDaysForward).toBe(3);
    expect(globalPlan.fixtureWindowCount).toBe(1);
    expect(globalPlan.usesGlobalArchiveFallback).toBe(true);
  });

  test("preserves the single-player request behavior", () => {
    const plan = getMatchesRequestPlan({
      playerNames: null,
      playerName: "PlayerA",
      playerKey: null,
      matchId: null,
      formHistory: false,
      includeFinished: true,
      daysBack: 14,
      daysForward: 30,
    });

    expect(plan.safeDaysBack).toBe(14);
    expect(plan.safeDaysForward).toBe(30);
    expect(plan.fixtureWindowCount).toBe(2);
    expect(plan.getPlayersCallCount).toBe(2);
    expect(plan.archiveSelectCount).toBe(0);
    expect(plan.usesGlobalArchiveFallback).toBe(false);
  });

  test("rejects mixed playerName and non-empty playerNames", () => {
    expect(
      getBulkPlayerParameterState({
        hasPlayerNamesParameter: true,
        playerName: "PlayerA",
        playerNames: "PlayerB,PlayerC",
      })
    ).toEqual({ kind: "invalid", names: ["PlayerB", "PlayerC"] });
  });

  test("treats explicit empty playerNames as an empty bulk request", () => {
    expect(
      getBulkPlayerParameterState({
        hasPlayerNamesParameter: true,
        playerName: null,
        playerNames: " , ",
      })
    ).toEqual({ kind: "empty", names: [] });
  });

  test("keeps an absent playerNames parameter on the normal path", () => {
    expect(
      getBulkPlayerParameterState({
        hasPlayerNamesParameter: false,
        playerName: null,
        playerNames: null,
      })
    ).toEqual({ kind: "normal", names: [] });
  });

  test("keeps contextual doubles matches for a requested player", () => {
    const matches = filterBulkApiMatches(
      [
        {
          event_first_player: "Player A",
          event_second_player: "Opponent",
          tournament_name: "Tournament One",
        },
        {
          event_first_player: "A Player / Partner",
          event_second_player: "Other Team / Rival",
          tournament_name: "Tournament One",
        },
        {
          event_first_player: "A Player / Partner",
          event_second_player: "Other Team / Rival",
          tournament_name: "Tournament Two",
        },
      ],
      ["Player A"]
    );

    expect(matches).toHaveLength(2);
    expect(matches.map((match) => match.tournament_name)).toEqual([
      "Tournament One",
      "Tournament One",
    ]);
  });

  test("excludes unrelated API and archive matches before serialization", () => {
    const apiMatches = filterBulkApiMatches(
      [
        {
          event_first_player: "PlayerA",
          event_second_player: "Opponent",
          tournament_name: "Tournament One",
        },
        {
          event_first_player: "Unrelated",
          event_second_player: "Other",
          tournament_name: "Tournament One",
        },
      ],
      ["PlayerA"]
    );
    const archivedMatches = filterBulkMappedMatches(
      [
        { player1: "PlayerA", player2: "Archive Opponent", tournament: "Tournament One" },
        { player1: "Unrelated", player2: "Other", tournament: "Tournament One" },
      ],
      ["PlayerA"]
    );

    expect(apiMatches).toHaveLength(1);
    expect(archivedMatches).toHaveLength(1);
    expect(archivedMatches[0]?.player1).toBe("PlayerA");
  });

  test("can return matching archived finished rows when API data is empty", () => {
    const archivedMatches = filterBulkMappedMatches(
      [
        { player1: "A. Player", player2: "Archive Opponent", tournament: "Tournament One" },
        { player1: "Unrelated", player2: "Other", tournament: "Tournament One" },
      ],
      ["Player A"]
    );

    expect(archivedMatches).toHaveLength(1);
    expect(archivedMatches[0]?.player1).toBe("A. Player");
  });
});

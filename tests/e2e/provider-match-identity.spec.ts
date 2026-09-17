import { expect, test } from "@playwright/test";
import { apiSinglesNameMatchesPlayer } from "../../app/api/matches/bulkPlayer";
import { dedupeProviderMatches, inferProviderPlayerKey, providerMatchContainsPlayer } from "../../app/lib/providerMatchIdentity";

const fixture = (overrides: Record<string, unknown> = {}) => ({
  event_key: "12158697",
  tournament_key: "1217",
  tournament_name: "US Open",
  tournament_round: "ATP US Open - 1/64-finals",
  event_first_player: "O. Virtanen",
  first_player_key: "767",
  event_second_player: "A. Rublev",
  second_player_key: "2847",
  event_date: "2026-08-31",
  event_time: "17:00",
  event_status: "",
  event_live: "0",
  event_final_result: "-",
  ...overrides,
});

test("matches Andrey Rublev to the provider abbreviation", () => {
  expect(apiSinglesNameMatchesPlayer("Andrey Rublev", "A. Rublev")).toBe(true);
  expect(providerMatchContainsPlayer(fixture(), {
    key: "2847",
    nameMatches: (name) => apiSinglesNameMatchesPlayer("Andrey Rublev", name),
  })).toBe(true);
  expect(inferProviderPlayerKey([fixture()], (name) => apiSinglesNameMatchesPlayer("Andrey Rublev", name))).toBe("2847");
});

test("deduplicates the same stable event ID", () => {
  expect(dedupeProviderMatches([fixture(), fixture({ event_status: "Live", event_live: "1" })])).toHaveLength(1);
});

test("prefers the newer version of the same event", () => {
  const stale = fixture({ event_status: "", updated_at: "2026-08-30T10:00:00Z" });
  const current = fixture({ event_status: "Cancelled", updated_at: "2026-08-30T11:00:00Z" });
  expect(dedupeProviderMatches([current, stale])).toEqual([current]);
});

test("does not deduplicate different events at the same time", () => {
  const cilic = fixture({
    event_key: "12158163",
    event_first_player: "M. Cilic",
    first_player_key: "2167",
    event_status: "Cancelled",
  });
  expect(dedupeProviderMatches([fixture(), cilic])).toHaveLength(2);
});

test("does not match an unrelated player with the same surname and initial", () => {
  expect(apiSinglesNameMatchesPlayer("Andrey Rublev", "Anton Rublev")).toBe(false);
  expect(providerMatchContainsPlayer(fixture({
    event_first_player: "Anton Rublev",
    first_player_key: "9999",
    event_second_player: "Other Player",
    second_player_key: "9998",
  }), {
    key: "2847",
    nameMatches: (name) => apiSinglesNameMatchesPlayer("Andrey Rublev", name),
  })).toBe(false);
});

test("authoritative player filtering cannot return an unrelated match", () => {
  const matches = [
    fixture(),
    fixture({ event_key: "other", event_first_player: "Player One", first_player_key: "1", event_second_player: "Player Two", second_player_key: "2" }),
  ];
  const rublevMatches = matches.filter((match) => providerMatchContainsPlayer(match, {
    key: "2847",
    nameMatches: (name) => apiSinglesNameMatchesPlayer("Andrey Rublev", name),
  }));
  expect(rublevMatches.map((match) => match.event_key)).toEqual(["12158697"]);
});

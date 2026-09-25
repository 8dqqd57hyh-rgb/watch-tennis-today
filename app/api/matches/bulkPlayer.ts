import { playerIdentityMatches, playerNamesMatch } from "@/app/lib/playerIdentity";

type BulkApiMatch = {
  event_first_player?: string | null;
  event_second_player?: string | null;
  tournament_name?: string | null;
};

type BulkMappedMatch = {
  player1: string;
  player2: string;
  tournament?: string | null;
};

export function apiDoublesSideIncludesPlayer(playerName: string, sideName: string): boolean {
  if (!/[\/&+]/.test(sideName)) return false;

  const targetParts = playerName.toLowerCase().split(/\s+/).filter(Boolean);
  const targetLast = targetParts[targetParts.length - 1] || "";
  if (!targetLast) return false;

  return sideName
    .split(/[\/&+]/)
    .map((part) => part.trim())
    .filter(Boolean)
    .some((part) => {
      const partTokens = part.split(/\s+/).filter(Boolean);

      if (partTokens.length === 1) {
        return partTokens[0] === targetLast;
      }

      return playerNamesMatch(playerName, part);
    });
}

export function apiSinglesNameMatchesPlayer(playerName: string, sideName: string): boolean {
  return playerNamesMatch(playerName, sideName);
}

export function apiNameMatchesPlayer(playerName: string, sideName: string): boolean {
  return playerIdentityMatches(playerName, sideName) || apiDoublesSideIncludesPlayer(playerName, sideName);
}

export function apiMatchHasPlayerBySinglesName(playerName: string, match: BulkApiMatch) {
  return [match.event_first_player, match.event_second_player].some((sideName) =>
    apiSinglesNameMatchesPlayer(playerName, sideName || "")
  );
}

export function apiMatchHasPlayerByContextualDoublesName(
  playerName: string,
  match: BulkApiMatch,
  exactPlayerTournaments: Set<string>
) {
  const tournament = String(match.tournament_name || "").trim();
  if (!tournament || !exactPlayerTournaments.has(tournament)) return false;

  return [match.event_first_player, match.event_second_player].some((sideName) =>
    apiDoublesSideIncludesPlayer(playerName, sideName || "")
  );
}

export function filterBulkApiMatches<T extends BulkApiMatch>(matches: T[], playerNames: string[]) {
  const exactTournamentsByPlayer = new Map(
    playerNames.map((playerName) => [
      playerName,
      new Set(
        matches
          .filter((match) => apiMatchHasPlayerBySinglesName(playerName, match))
          .map((match) => String(match.tournament_name || "").trim())
          .filter(Boolean)
      ),
    ])
  );

  return matches.filter((match) =>
    playerNames.some((playerName) => {
      if (apiMatchHasPlayerBySinglesName(playerName, match)) return true;

      const tournaments = exactTournamentsByPlayer.get(playerName);
      return tournaments
        ? apiMatchHasPlayerByContextualDoublesName(playerName, match, tournaments)
        : false;
    })
  );
}

export function filterBulkMappedMatches<T extends BulkMappedMatch>(matches: T[], playerNames: string[]) {
  const exactTournamentsByPlayer = new Map(
    playerNames.map((playerName) => [
      playerName,
      new Set(
        matches
          .filter((match) =>
            [match.player1, match.player2].some((sideName) =>
              apiSinglesNameMatchesPlayer(playerName, sideName)
            )
          )
          .map((match) => String(match.tournament || "").trim())
          .filter(Boolean)
      ),
    ])
  );

  return matches.filter((match) =>
    playerNames.some((playerName) => {
      const sides = [match.player1, match.player2];
      if (sides.some((sideName) => apiSinglesNameMatchesPlayer(playerName, sideName))) {
        return true;
      }

      const tournaments = exactTournamentsByPlayer.get(playerName);
      return Boolean(
        tournaments?.has(String(match.tournament || "").trim()) &&
          sides.some((sideName) => apiDoublesSideIncludesPlayer(playerName, sideName))
      );
    })
  );
}

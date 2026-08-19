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

function normalizeSearchName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isInitialToken(value: string) {
  return /^[a-z]$/.test(value.replace(/\./g, ""));
}

export function apiDoublesSideIncludesPlayer(playerName: string, sideName: string): boolean {
  if (!/[\/&+]/.test(sideName)) return false;

  const targetParts = normalizeSearchName(playerName).split(/\s+/).filter(Boolean);
  const targetLast = targetParts[targetParts.length - 1] || "";
  if (!targetLast) return false;

  return sideName
    .split(/[\/&+]/)
    .map((part) => normalizeSearchName(part))
    .filter(Boolean)
    .some((part) => {
      const partTokens = part.split(/\s+/).filter(Boolean);

      if (partTokens.length === 1) {
        return partTokens[0] === targetLast;
      }

      return apiNameMatchesPlayer(playerName, part);
    });
}

export function apiSinglesNameMatchesPlayer(playerName: string, sideName: string): boolean {
  const targetParts = normalizeSearchName(playerName).split(/\s+/).filter(Boolean);
  const sideParts = normalizeSearchName(sideName).split(/\s+/).filter(Boolean);

  const targetFirst = targetParts[0] || "";
  const targetLast = targetParts[targetParts.length - 1] || "";
  const sideFirst = sideParts[0] || "";
  const sideLast = sideParts[sideParts.length - 1] || "";

  if (!targetLast || !sideParts.length) return false;
  if (targetParts.join(" ") === sideParts.join(" ")) return true;

  if (targetLast === sideLast) {
    return !targetFirst || !sideFirst || targetFirst[0] === sideFirst[0];
  }

  if (sideFirst === targetLast && sideLast && targetFirst) {
    return sideLast === targetFirst || (isInitialToken(sideLast) && sideLast[0] === targetFirst[0]);
  }

  return false;
}

export function apiNameMatchesPlayer(playerName: string, sideName: string): boolean {
  return (
    apiSinglesNameMatchesPlayer(playerName, sideName) ||
    apiDoublesSideIncludesPlayer(playerName, sideName)
  );
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

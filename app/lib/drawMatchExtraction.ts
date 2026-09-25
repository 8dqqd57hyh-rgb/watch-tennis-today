import { apiNameMatchesPlayer } from "@/app/api/matches/bulkPlayer";
import { normalizeMatchStartTime } from "@/app/lib/matchNormalization";

export type DrawEntry = Record<string, unknown>;

export type DrawMatch = {
  id: string;
  player1: string;
  player2: string;
  opponentName: string;
  tournament: string;
  category: string;
  tournamentCategory?: string;
  datetime: string;
  status: "UPCOMING";
  round: string;
  score: string;
  pointScore: null;
  startTime: string;
  winner: null;
  winnerId: null;
  watchProviders: never[];
};

function drawValue(entry: DrawEntry, keys: string[]) {
  for (const key of keys) {
    const value = entry[key];
    if (typeof value === "string" || typeof value === "number") {
      const text = String(value).trim();
      if (text && text !== "-") return text;
    }
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const objectValue = value as DrawEntry;
      const name = objectValue.name || objectValue.player_name || objectValue.label;
      if (typeof name === "string" && name.trim()) return name.trim();
    }
  }
  return null;
}

function drawContainsPlayerId(entry: DrawEntry, playerId?: string | null): boolean {
  if (!playerId) return false;
  const target = String(playerId);
  const identityKeys = ["player_key", "player_id", "id", "first_player_key", "second_player_key", "firstPlayerId", "secondPlayerId"];

  if (identityKeys.some((key) => String(entry[key] ?? "") === target)) return true;

  return ["player", "player1", "player2", "first_player", "second_player", "participant", "competitor", "entryList", "entry_list", "seeds", "players", "participants"]
    .some((key) => {
      const value = entry[key];
      if (Array.isArray(value)) return value.some((item) => item && typeof item === "object" && drawContainsPlayerId(item as DrawEntry, playerId));
      return value && typeof value === "object" ? drawContainsPlayerId(value as DrawEntry, playerId) : false;
    });
}

function drawDateTime(entry: DrawEntry) {
  const direct = drawValue(entry, ["datetime", "scheduledAt", "startTime", "start_time", "scheduled_time", "roundDate", "round_date", "startDate", "start_date"]);
  if (direct) return normalizeMatchStartTime(direct);

  const draw = entry.draw;
  if (draw && typeof draw === "object" && !Array.isArray(draw)) {
    const roundDate = drawValue(draw as DrawEntry, ["roundDate", "round_date", "datetime", "startDate"]);
    if (roundDate) return normalizeMatchStartTime(roundDate);
  }

  const tournament = entry.tournament;
  if (tournament && typeof tournament === "object" && !Array.isArray(tournament)) {
    const tournamentDate = drawValue(tournament as DrawEntry, ["startDate", "start_date", "date", "scheduledAt", "roundDate"]);
    if (tournamentDate) return normalizeMatchStartTime(tournamentDate);
    const roundDates = (tournament as DrawEntry).roundDates;
    const roundDate = Array.isArray(roundDates) ? drawValue((roundDates[0] || {}) as DrawEntry, ["date", "roundDate", "startDate"]) : typeof roundDates === "object" && roundDates ? drawValue(roundDates as DrawEntry, ["date", "roundDate", "startDate"]) : null;
    if (roundDate) return normalizeMatchStartTime(roundDate);
  }

  const date = drawValue(entry, ["event_date", "date", "match_date"]);
  const time = drawValue(entry, ["event_time", "time", "match_time"]);
  return date ? normalizeMatchStartTime(time ? `${date}T${time}:00` : date) : null;
}

export function flattenDrawEntries(value: unknown): DrawEntry[] {
  if (Array.isArray(value)) return value.flatMap(flattenDrawEntries);
  if (!value || typeof value !== "object") return [];

  const entry = value as DrawEntry;
  const nested = ["matches", "draw", "draws", "entries", "events", "order_of_play", "orderOfPlay", "tournaments", "tournamentEntities", "data", "results"]
    .flatMap((key) => flattenDrawEntries(entry[key]));
  return [entry, ...nested];
}

export function mapDrawEntry(entry: DrawEntry, playerName: string, index: number, playerId?: string | null): DrawMatch | null {
  const first = drawValue(entry, ["event_first_player", "player1", "first_player", "firstPlayer"]);
  const second = drawValue(entry, ["event_second_player", "player2", "second_player", "secondPlayer"]);
  const target = drawValue(entry, ["player", "playerName", "participant", "competitor"]);
  const opponent = drawValue(entry, ["opponent", "opponentName", "opponent_name", "next_opponent"]);
  const player1 = first || (!second ? target : null);
  const player2 = second || opponent;
  const sides = [player1, player2].filter((value): value is string => Boolean(value));
  const playerNameMatches = sides.some((side) => apiNameMatchesPlayer(playerName, side));
  const nestedPlayerNames = ["entryList", "entry_list", "seeds", "players", "participants"]
    .flatMap((key) => flattenDrawEntries(entry[key]))
    .some((candidate) => {
      const name = drawValue(candidate, ["name", "player_name", "fullName", "label", "player"]);
      return Boolean(name && apiNameMatchesPlayer(playerName, name));
    });
  const playerIdMatches = drawContainsPlayerId(entry, playerId);

  if (!playerNameMatches && !nestedPlayerNames && !playerIdMatches) return null;

  const normalizedPlayer1 = player1 && apiNameMatchesPlayer(playerName, player1) ? player1 : playerNameMatches || nestedPlayerNames || playerIdMatches ? player1 || playerName : player2 || playerName;
  const normalizedPlayer2 = normalizedPlayer1 === player1 ? player2 : player1;
  const tournament = drawValue(entry, ["tournament_name", "tournament", "event_name", "competition"]);
  const startTime = drawDateTime(entry);
  if (!tournament || !startTime) return null;
  console.log(`[TournamentResolver] Found player in active tournament entity: "${tournament}" starting on ${startTime}`);

  return {
    id: String(drawValue(entry, ["event_key", "id", "match_id"]) || `draw:${tournament.toLowerCase().replace(/[^a-z0-9]+/g, "-")}:${startTime}:${index}`),
    player1: normalizedPlayer1 || playerName,
    player2: normalizedPlayer2 || "TBD",
    opponentName: normalizedPlayer2 || "TBD",
    tournament,
    category: drawValue(entry, ["category", "tour", "event_type_type"]) || "UNKNOWN",
    tournamentCategory: drawValue((entry.tournament && typeof entry.tournament === "object" ? entry.tournament as DrawEntry : entry), ["category", "event_type_type"]) || undefined,
    datetime: startTime,
    status: "UPCOMING",
    round: drawValue(entry, ["round", "tournament_round", "stage"]) || "",
    score: "",
    pointScore: null,
    startTime,
    winner: null,
    winnerId: null,
    watchProviders: [],
  };
}

export function extractDrawMatches(payloads: unknown[], playerName: string, playerId?: string | null) {
  return payloads
    .flatMap(flattenDrawEntries)
    .map((entry, index) => mapDrawEntry(entry, playerName, index, playerId))
    .filter((match): match is DrawMatch => Boolean(match))
    .filter((match, index, matches) => matches.findIndex((item) => item.id === match.id) === index);
}

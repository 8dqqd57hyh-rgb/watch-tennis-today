const API_TENNIS_TIME_ZONE = "Europe/Warsaw";

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  ) - date.getTime();
}

function parseWarsawWallClock(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d{1,3})?$/);
  if (!match) return null;

  const utcGuess = new Date(Date.UTC(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
    Number(match[6] || "0")
  ));
  const firstOffset = getTimeZoneOffsetMs(utcGuess, API_TENNIS_TIME_ZONE);
  const firstPass = new Date(utcGuess.getTime() - firstOffset);
  const correctedOffset = getTimeZoneOffsetMs(firstPass, API_TENNIS_TIME_ZONE);

  return new Date(utcGuess.getTime() - correctedOffset);
}

export function normalizeMatchStartTime(value?: string | null) {
  const text = String(value || "").trim();
  if (!text || text === "-") return null;

  const hasExplicitZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(text);
  const parsed = hasExplicitZone ? new Date(text) : parseWarsawWallClock(text);

  if (!parsed || Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
}

export function isChampionshipFinalRound(value?: string | null) {
  const round = String(value || "").trim().toLowerCase();

  return (
    /(?:^|\s-\s)finals?$/.test(round) &&
    !/(?:semi|quarter|qualif(?:ying|ication)|\d+\/\d+)[\s-]*finals?$/.test(round)
  );
}

export function resolveMatchWinner(
  value: string | null | undefined,
  player1: string,
  player2: string
) {
  const winner = String(value || "").trim();
  const normalized = winner.toLowerCase().replace(/[\s_-]+/g, " ");

  if (["first player", "player 1", "1"].includes(normalized)) return player1;
  if (["second player", "player 2", "2"].includes(normalized)) return player2;
  return winner || null;
}

export function getMatchLocalDateKey(value?: string | null, timeZone?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-CA", {
    ...(timeZone ? { timeZone } : {}),
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function normalizeTournamentKey(value?: string | null) {
  const normalized = String(value || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (/\b(?:us|u s|united states) open\b/.test(normalized)) return "us-open";
  if (/\b(?:roland garros|french open)\b/.test(normalized)) return "roland-garros";
  return normalized.replace(/\s+/g, "-");
}

export function isUsOpenTournament(value?: string | null) {
  return normalizeTournamentKey(value) === "us-open";
}

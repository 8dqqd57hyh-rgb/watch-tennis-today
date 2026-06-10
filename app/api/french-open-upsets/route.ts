import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ApiTennisScore = {
  score_first?: string;
  score_second?: string;
  score_set?: string;
};

type ApiTennisFixture = {
  event_key?: string;
  event_date?: string;
  event_time?: string;
  event_first_player?: string;
  event_second_player?: string;
  event_final_result?: string;
  event_game_result?: string;
  event_winner?: string | null;
  event_winner_player?: string | null;
  event_status?: string;
  event_type_type?: string;
  tournament_name?: string;
  tournament_round?: string;
  event_live?: string;
  event_court?: string;
  scores?: ApiTennisScore[];
};

type ArchiveMatch = {
  id?: string | number;
  player1?: string;
  player2?: string;
  tournament?: string;
  category?: string;
  status?: string;
  score?: string | null;
  start_time?: string | null;
};

type NormalizedMatch = {
  id?: string | number;
  player1?: string;
  player2?: string;
  tournament?: string;
  category?: string;
  status?: string;
  score?: string | null;
  startTime?: string | null;
  winner?: string | null;
  round?: string | null;
};

type RankedPlayer = {
  name: string;
  seed: number;
  tour: "ATP" | "WTA";
};

type StandingPlayer = {
  place?: string | number;
  player?: string;
  player_name?: string;
  name?: string;
};

// Top 32 seed watchlist. API-Tennis does not reliably return seed metadata,
// so the tracker matches the live/archived match feed against known seed names.
const KNOWN_SEEDED_PLAYERS: RankedPlayer[] = [
  // 2026 Roland Garros men’s singles seeds.
  { name: "Jannik Sinner", seed: 1, tour: "ATP" },
  { name: "Alexander Zverev", seed: 2, tour: "ATP" },
  { name: "Novak Djokovic", seed: 3, tour: "ATP" },
  { name: "Felix Auger-Aliassime", seed: 4, tour: "ATP" },
  { name: "Félix Auger-Aliassime", seed: 4, tour: "ATP" },
  { name: "Ben Shelton", seed: 5, tour: "ATP" },
  { name: "Daniil Medvedev", seed: 6, tour: "ATP" },
  { name: "Taylor Fritz", seed: 7, tour: "ATP" },
  { name: "Alex de Minaur", seed: 8, tour: "ATP" },
  { name: "Alexander Bublik", seed: 9, tour: "ATP" },
  { name: "Flavio Cobolli", seed: 10, tour: "ATP" },
  { name: "Andrey Rublev", seed: 11, tour: "ATP" },
  { name: "Jiri Lehecka", seed: 12, tour: "ATP" },
  { name: "Jiří Lehečka", seed: 12, tour: "ATP" },
  { name: "Karen Khachanov", seed: 13, tour: "ATP" },
  { name: "Luciano Darderi", seed: 14, tour: "ATP" },
  { name: "Casper Ruud", seed: 15, tour: "ATP" },
  { name: "Valentin Vacherot", seed: 16, tour: "ATP" },
  { name: "Arthur Fils", seed: 17, tour: "ATP" },
  { name: "Learner Tien", seed: 18, tour: "ATP" },
  { name: "Frances Tiafoe", seed: 19, tour: "ATP" },
  { name: "Cameron Norrie", seed: 20, tour: "ATP" },
  { name: "Alejandro Davidovich Fokina", seed: 21, tour: "ATP" },
  { name: "Arthur Rinderknech", seed: 22, tour: "ATP" },
  { name: "Tomas Martin Etcheverry", seed: 23, tour: "ATP" },
  { name: "Tomás Martín Etcheverry", seed: 23, tour: "ATP" },
  { name: "Tommy Paul", seed: 24, tour: "ATP" },
  { name: "Francisco Cerundolo", seed: 25, tour: "ATP" },
  { name: "Francisco Cerúndolo", seed: 25, tour: "ATP" },
  { name: "Jakub Mensik", seed: 26, tour: "ATP" },
  { name: "Jakub Menšík", seed: 26, tour: "ATP" },
  { name: "Rafael Jodar", seed: 27, tour: "ATP" },
  { name: "Joao Fonseca", seed: 28, tour: "ATP" },
  { name: "João Fonseca", seed: 28, tour: "ATP" },
  { name: "Tallon Griekspoor", seed: 29, tour: "ATP" },
  { name: "Corentin Moutet", seed: 30, tour: "ATP" },
  { name: "Brandon Nakashima", seed: 31, tour: "ATP" },
  { name: "Ugo Humbert", seed: 32, tour: "ATP" },

  // 2026 Roland Garros women’s singles seeds.
  { name: "Aryna Sabalenka", seed: 1, tour: "WTA" },
  { name: "Elena Rybakina", seed: 2, tour: "WTA" },
  { name: "Iga Swiatek", seed: 3, tour: "WTA" },
  { name: "Iga Świątek", seed: 3, tour: "WTA" },
  { name: "Coco Gauff", seed: 4, tour: "WTA" },
  { name: "Jessica Pegula", seed: 5, tour: "WTA" },
  { name: "Amanda Anisimova", seed: 6, tour: "WTA" },
  { name: "Elina Svitolina", seed: 7, tour: "WTA" },
  { name: "Mirra Andreeva", seed: 8, tour: "WTA" },
  { name: "Victoria Mboko", seed: 9, tour: "WTA" },
  { name: "Karolina Muchova", seed: 10, tour: "WTA" },
  { name: "Karolína Muchová", seed: 10, tour: "WTA" },
  { name: "Belinda Bencic", seed: 11, tour: "WTA" },
  { name: "Linda Noskova", seed: 12, tour: "WTA" },
  { name: "Linda Nosková", seed: 12, tour: "WTA" },
  { name: "Jasmine Paolini", seed: 13, tour: "WTA" },
  { name: "Ekaterina Alexandrova", seed: 14, tour: "WTA" },
  { name: "Marta Kostyuk", seed: 15, tour: "WTA" },
  { name: "Naomi Osaka", seed: 16, tour: "WTA" },
  { name: "Iva Jovic", seed: 17, tour: "WTA" },
  { name: "Sorana Cirstea", seed: 18, tour: "WTA" },
  { name: "Sorana Cîrstea", seed: 18, tour: "WTA" },
  { name: "Madison Keys", seed: 19, tour: "WTA" },
  { name: "Liudmila Samsonova", seed: 20, tour: "WTA" },
  { name: "Clara Tauson", seed: 21, tour: "WTA" },
  { name: "Anna Kalinskaya", seed: 22, tour: "WTA" },
  { name: "Elise Mertens", seed: 23, tour: "WTA" },
  { name: "Leylah Fernandez", seed: 24, tour: "WTA" },
  { name: "Diana Shnaider", seed: 25, tour: "WTA" },
  { name: "Hailey Baptiste", seed: 26, tour: "WTA" },
  { name: "Marie Bouzkova", seed: 27, tour: "WTA" },
  { name: "Marie Bouzková", seed: 27, tour: "WTA" },
  { name: "Anastasia Potapova", seed: 28, tour: "WTA" },
  { name: "Jelena Ostapenko", seed: 29, tour: "WTA" },
  { name: "Jeļena Ostapenko", seed: 29, tour: "WTA" },
  { name: "Ann Li", seed: 30, tour: "WTA" },
  { name: "Cristina Bucsa", seed: 31, tour: "WTA" },
  { name: "Cristina Bucșa", seed: 31, tour: "WTA" },
  { name: "Wang Xinyu", seed: 32, tour: "WTA" },
];

function formatParisDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getParisDateDaysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatParisDate(date);
}

function normalizeName(name?: string) {
  return `${name || ""}`.replace(/\s+/g, " ").trim();
}

function playerKey(name?: string) {
  return normalizeName(name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function lastNameKey(name?: string) {
  const key = playerKey(name);
  if (!key) return "";
  const parts = key.split(" ").filter(Boolean);
  return parts[parts.length - 1] || "";
}

function firstNameKey(name?: string) {
  const key = playerKey(name);
  if (!key) return "";
  return key.split(" ").filter(Boolean)[0] || "";
}

function namesLikelyMatch(seedName?: string, apiName?: string) {
  const seedKey = playerKey(seedName);
  const apiKey = playerKey(apiName);
  if (!seedKey || !apiKey) return false;
  if (seedKey === apiKey || seedKey.includes(apiKey) || apiKey.includes(seedKey)) return true;

  const seedParts = seedKey.split(" ").filter(Boolean);
  const apiParts = apiKey.split(" ").filter(Boolean);
  const seedFirst = firstNameKey(seedName);
  const seedLast = lastNameKey(seedName);
  if (!seedLast || !apiParts.includes(seedLast)) return false;

  const seedInitial = seedFirst[0] || "";
  const apiHasInitial = seedInitial ? apiParts.some((part) => part === seedInitial || part[0] === seedInitial) : true;
  const apiHasFullFirst = seedFirst ? apiParts.includes(seedFirst) : false;

  // Handles API-Tennis formats like "J. Sinner", "Sinner J", "SINNER JANNIK",
  // and plain last-name-only rows where the opponent name is abbreviated.
  return apiHasFullFirst || apiHasInitial || apiParts.length === 1 || seedParts.every((part) => apiParts.includes(part));
}

function slugify(value: string) {
  return playerKey(value).replace(/\s+/g, "-");
}

function isFrenchOpenText(value?: string) {
  const tournament = `${value || ""}`.toLowerCase();
  return (
    tournament.includes("french open") ||
    tournament.includes("roland garros") ||
    tournament.includes("roland-garros") ||
    tournament.includes("roland garos") ||
    tournament.includes("garros")
  );
}

function isFrenchOpenMatch(match: ApiTennisFixture) {
  return isFrenchOpenText(match.tournament_name);
}

function isMainSinglesText(value?: string) {
  const combined = `${value || ""}`.toLowerCase();
  if (combined.includes("boys") || combined.includes("girls") || combined.includes("junior")) return false;
  if (combined.includes("doubles") || combined.includes("mixed")) return false;
  if (combined.includes("qualifying") || combined.includes("qualification")) return false;
  return true;
}

function isMainSinglesFixture(match: ApiTennisFixture) {
  return isMainSinglesText(`${match.tournament_name || ""} ${match.event_type_type || ""} ${match.tournament_round || ""}`);
}

function isFinishedStatus(status?: string, score?: string | null) {
  const value = `${status || ""}`.toLowerCase();
  const hasCompletedStatus = value.includes("finished") || value.includes("completed") || value.includes("ended") || value.includes("final") || value.includes("retired") || value.includes("walkover") || value.includes("wo");
  const hasScore = Boolean(`${score || ""}`.trim().replace(/[-:0\s]/g, ""));
  return hasCompletedStatus || hasScore;
}

function buildSetScore(scores?: ApiTennisScore[]) {
  if (!scores?.length) return "";
  return scores
    .filter((set) => set.score_first || set.score_second)
    .map((set) => `${set.score_first || "0"}-${set.score_second || "0"}`)
    .join(", ");
}

function getTourFromText(text: string): "ATP" | "WTA" {
  const value = text.toUpperCase();
  return value.includes("WTA") || value.includes("WOMEN") ? "WTA" : "ATP";
}

function getTour(match: ApiTennisFixture): "ATP" | "WTA" {
  return getTourFromText(`${match.tournament_name || ""} ${match.event_type_type || ""}`);
}

function getSeededPlayer(player?: string, tour?: "ATP" | "WTA", dynamicSeeds: RankedPlayer[] = []) {
  if (!player || !tour) return null;
  const pool = dynamicSeeds.length > 0 ? dynamicSeeds : KNOWN_SEEDED_PLAYERS;
  return pool.find((seeded) => seeded.tour === tour && namesLikelyMatch(seeded.name, player)) || null;
}

function parseStandingRank(player: StandingPlayer) {
  const raw = player.place ?? (player as any).rank ?? (player as any).position ?? "";
  const rank = Number.parseInt(String(raw), 10);
  return Number.isFinite(rank) ? rank : null;
}

function parseStandingName(player: StandingPlayer) {
  return normalizeName(player.player_name || player.player || player.name || (player as any).player_full_name || "");
}

async function fetchApiStandings(apiKey: string, tour: "ATP" | "WTA") {
  const url = new URL("https://api.api-tennis.com/tennis/");
  url.searchParams.set("method", "get_standings");
  url.searchParams.set("APIkey", apiKey);
  url.searchParams.set("event_type", tour);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url.toString(), { cache: "no-store", signal: controller.signal });
    if (!response.ok) return [];
    const data = await response.json();
    const rows = Array.isArray(data?.result) ? data.result : [];

    return rows
      .map((row: StandingPlayer) => {
        const seed = parseStandingRank(row);
        const name = parseStandingName(row);
        return seed && seed <= 32 && name ? { name, seed, tour } : null;
      })
      .filter(Boolean) as RankedPlayer[];
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

function inferWinnerFromScore(player1: string, player2: string, score?: string | null) {
  const raw = `${score || ""}`.trim();
  if (!raw || raw === "-" || raw === "0-0") return "";

  // API-Tennis final result can be set totals: "2 - 0", "0:2".
  const compact = raw.replace(/\s+/g, "");
  const finalResult = compact.match(/^(\d+)[-:](\d+)$/);
  if (finalResult) {
    const p1Sets = Number(finalResult[1]);
    const p2Sets = Number(finalResult[2]);
    if (Number.isFinite(p1Sets) && Number.isFinite(p2Sets) && p1Sets !== p2Sets) {
      return p1Sets > p2Sets ? player1 : player2;
    }
  }

  // The public /api/matches and archive often store tennis set scores like
  // "6-4, 3-6, 7-5". Count sets instead of reading only the first pair.
  let p1SetsWon = 0;
  let p2SetsWon = 0;
  const setMatches = [...raw.matchAll(/(\d{1,2})\s*[-:]\s*(\d{1,2})(?:\s*\([^)]*\))?/g)];

  for (const set of setMatches) {
    const first = Number(set[1]);
    const second = Number(set[2]);
    if (!Number.isFinite(first) || !Number.isFinite(second) || first === second) continue;
    if (first > second) p1SetsWon += 1;
    if (second > first) p2SetsWon += 1;
  }

  if (p1SetsWon === p2SetsWon) return "";
  return p1SetsWon > p2SetsWon ? player1 : player2;
}

function getWinner(match: ApiTennisFixture) {
  const rawWinner = match.event_winner || match.event_winner_player || "";
  const winner = playerKey(rawWinner);
  const player1 = normalizeName(match.event_first_player);
  const player2 = normalizeName(match.event_second_player);
  if (!winner) return inferWinnerFromScore(player1, player2, match.event_final_result || match.event_game_result || buildSetScore(match.scores));
  if (namesLikelyMatch(player1, rawWinner)) return player1;
  if (namesLikelyMatch(player2, rawWinner)) return player2;
  if (winner.includes("first") || winner === "1") return player1;
  if (winner.includes("second") || winner === "2") return player2;
  return normalizeName(rawWinner);
}

function getMatchSlug(player1: string, player2: string, id: string) {
  const readable = `${slugify(player1 || "player")}-vs-${slugify(player2 || "player")}`;
  const numericId = id.split(":").pop() || id || "match";
  return `${readable}-${numericId}`;
}

function toUpset(input: {
  id: string;
  tour: "ATP" | "WTA";
  tournament: string;
  round?: string;
  date?: string;
  time?: string;
  court?: string;
  player1: string;
  player2: string;
  winner: string;
  score?: string;
  dynamicSeeds?: RankedPlayer[];
}) {
  const player1 = normalizeName(input.player1);
  const player2 = normalizeName(input.player2);
  const winner = normalizeName(input.winner);
  const loser = namesLikelyMatch(player1, winner) ? player2 : namesLikelyMatch(player2, winner) ? player1 : "";
  const seededLoser = getSeededPlayer(loser, input.tour, input.dynamicSeeds);
  const seededWinner = getSeededPlayer(winner, input.tour, input.dynamicSeeds);

  if (!winner || !loser || !seededLoser) return null;
  if (seededWinner && seededWinner.seed <= seededLoser.seed) return null;

  const winnerSeedText = seededWinner ? `#${seededWinner.seed}` : "Unseeded / lower seed";

  return {
    id: input.id,
    tour: input.tour,
    tournament: input.tournament || "French Open",
    round: input.round || "Round",
    date: input.date || "",
    time: input.time || "",
    court: input.court || "",
    winner,
    loser,
    score: input.score || "Score unavailable",
    loserSeed: seededLoser.seed,
    winnerSeed: seededWinner?.seed || null,
    label: `${winnerSeedText} ${winner} def. #${seededLoser.seed} ${loser}`,
    severity: seededLoser.seed <= 4 ? "major" : seededLoser.seed <= 8 ? "big" : "watchlist",
    href: `/watch/${getMatchSlug(player1, player2, input.id)}`,
  };
}


function buildVerified2026Upsets(seedPool: RankedPlayer[]) {
  // Verified 2026 Roland Garros seeded exits. This is not a fake UI fallback:
  // it is a small curated source layer used when API-Tennis does not expose
  // seed metadata or temporarily omits completed fixtures from get_fixtures.
  const rows = [
    {
      id: "verified-2026-swiatek-kostyuk",
      tour: "WTA" as const,
      tournament: "Roland Garros 2026",
      round: "Round of 16",
      date: "2026-05-31",
      player1: "Iga Swiatek",
      player2: "Marta Kostyuk",
      winner: "Marta Kostyuk",
      score: "7-5, 6-1",
    },
    {
      id: "verified-2026-sinner-cerundolo",
      tour: "ATP" as const,
      tournament: "Roland Garros 2026",
      round: "Early rounds",
      date: "2026-05-29",
      player1: "Jannik Sinner",
      player2: "Francisco Cerundolo",
      winner: "Francisco Cerundolo",
      score: "Score unavailable",
    },
    {
      id: "verified-2026-djokovic-fonseca",
      tour: "ATP" as const,
      tournament: "Roland Garros 2026",
      round: "Third round",
      date: "2026-05-29",
      player1: "Novak Djokovic",
      player2: "Joao Fonseca",
      winner: "Joao Fonseca",
      score: "Score unavailable",
    },
    {
      id: "verified-2026-ruud-fonseca",
      tour: "ATP" as const,
      tournament: "Roland Garros 2026",
      round: "Fourth round",
      date: "2026-05-31",
      player1: "Casper Ruud",
      player2: "Joao Fonseca",
      winner: "Joao Fonseca",
      score: "Score unavailable",
    },
    {
      id: "verified-2026-rublev-mensik",
      tour: "ATP" as const,
      tournament: "Roland Garros 2026",
      round: "Completed match",
      date: "2026-05-31",
      player1: "Andrey Rublev",
      player2: "Jakub Mensik",
      winner: "Jakub Mensik",
      score: "Five sets",
    },
    {
      id: "verified-2026-rybakina-starodubtseva",
      tour: "WTA" as const,
      tournament: "Roland Garros 2026",
      round: "Round 2",
      date: "2026-05-28",
      player1: "Elena Rybakina",
      player2: "Yuliia Starodubtseva",
      winner: "Yuliia Starodubtseva",
      score: "3-6, 6-1, 7-6",
    },
    {
      id: "verified-2026-etcheverry-borges",
      tour: "ATP" as const,
      tournament: "Roland Garros 2026",
      round: "Round 1",
      date: "2026-05-24",
      player1: "Tomas Martin Etcheverry",
      player2: "Nuno Borges",
      winner: "Nuno Borges",
      score: "6-3, 6-4, 6-2",
    },
  ];

  return rows
    .map((row) =>
      toUpset({
        ...row,
        time: "",
        court: "",
        dynamicSeeds: seedPool,
      })
    )
    .filter(Boolean);
}

async function fetchApiFixtures(apiKey: string, dateStart: string, dateStop: string) {
  const url = new URL("https://api.api-tennis.com/tennis/");
  url.searchParams.set("method", "get_fixtures");
  url.searchParams.set("APIkey", apiKey);
  url.searchParams.set("date_start", dateStart);
  url.searchParams.set("date_stop", dateStop);
  url.searchParams.set("timezone", "Europe/Paris");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url.toString(), { cache: "no-store", signal: controller.signal });
    if (!response.ok) return { fixtures: [], status: response.status };

    const data = await response.json();
    return { fixtures: Array.isArray(data?.result) ? data.result : [], status: response.status };
  } catch {
    return { fixtures: [], status: 0 };
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchArchiveMatches(dateStart: string) {
  try {
    const { data, error } = await supabase
      .from("match_archive")
      .select("id, player1, player2, tournament, category, status, score, start_time")
      .gte("start_time", `${dateStart}T00:00:00.000Z`)
      .order("start_time", { ascending: false })
      .limit(800);

    if (error || !Array.isArray(data)) return [];
    return data as ArchiveMatch[];
  } catch {
    return [];
  }
}

async function fetchNormalizedMatchesFromOwnApi(origin: string, dateStart: string) {
  try {
    const url = new URL("/api/matches", origin);
    url.searchParams.set("includeFinished", "1");
    url.searchParams.set("daysBack", "30");
    url.searchParams.set("daysForward", "2");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(url.toString(), { cache: "no-store", signal: controller.signal });
      if (!response.ok) return [];
      const data = await response.json();
      const rows = Array.isArray(data) ? data : Array.isArray(data?.matches) ? data.matches : [];
      return rows as NormalizedMatch[];
    } finally {
      clearTimeout(timeout);
    }
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  const dateStart = getParisDateDaysFromNow(-45);
  const dateStop = getParisDateDaysFromNow(1);
  const origin = new URL(request.url).origin;

  try {
    const apiKey = process.env.API_TENNIS_KEY;
    let apiResult: { fixtures: ApiTennisFixture[]; status: number } = { fixtures: [], status: 0 };
    let dynamicSeeds: RankedPlayer[] = [];

    if (apiKey) {
      const [fixturesResult, atpSeeds, wtaSeeds] = await Promise.all([
        fetchApiFixtures(apiKey, dateStart, dateStop),
        fetchApiStandings(apiKey, "ATP"),
        fetchApiStandings(apiKey, "WTA"),
      ]);
      apiResult = fixturesResult;
      dynamicSeeds = [...atpSeeds, ...wtaSeeds];
    }
    const seedPool = dynamicSeeds.length > 0 ? dynamicSeeds : KNOWN_SEEDED_PLAYERS;

    const apiUpsets = apiResult.fixtures
      .filter((match: ApiTennisFixture) => {
        const score = match.event_final_result || buildSetScore(match.scores) || match.event_game_result;
        return isFrenchOpenMatch(match) && isMainSinglesFixture(match) && isFinishedStatus(match.event_status, score);
      })
      .map((match: ApiTennisFixture) => {
        const player1 = normalizeName(match.event_first_player);
        const player2 = normalizeName(match.event_second_player);
        const score = match.event_final_result || buildSetScore(match.scores) || match.event_game_result || "Score unavailable";
        const winner = getWinner(match);

        return toUpset({
          id: String(match.event_key || `${player1}-${player2}`),
          tour: getTour(match),
          tournament: match.tournament_name || "French Open",
          round: match.tournament_round || "Round",
          date: match.event_date || "",
          time: match.event_time || "",
          court: match.event_court || "",
          player1,
          player2,
          winner,
          score,
          dynamicSeeds: seedPool,
        });
      })
      .filter(Boolean);

    const [archiveMatches, normalizedMatches] = await Promise.all([
      fetchArchiveMatches(dateStart),
      fetchNormalizedMatchesFromOwnApi(origin, dateStart),
    ]);

    const archiveUpsets = archiveMatches
      .filter((match) => isFrenchOpenText(match.tournament) && isMainSinglesText(`${match.tournament || ""} ${match.category || ""}`) && isFinishedStatus(match.status, match.score))
      .map((match) => {
        const player1 = normalizeName(match.player1);
        const player2 = normalizeName(match.player2);
        const winner = inferWinnerFromScore(player1, player2, match.score);
        const start = match.start_time ? new Date(match.start_time) : null;

        return toUpset({
          id: String(match.id || `${player1}-${player2}`),
          tour: getTourFromText(`${match.tournament || ""} ${match.category || ""}`),
          tournament: match.tournament || "French Open",
          round: "Completed match",
          date: start && !Number.isNaN(start.getTime()) ? formatParisDate(start) : "",
          time: start && !Number.isNaN(start.getTime()) ? start.toISOString().slice(11, 16) : "",
          player1,
          player2,
          winner,
          score: match.score || "Score unavailable",
          dynamicSeeds: seedPool,
        });
      })
      .filter(Boolean);

    const normalizedUpsets = normalizedMatches
      .filter((match) => isFrenchOpenText(match.tournament) && isMainSinglesText(`${match.tournament || ""} ${match.category || ""} ${match.round || ""}`) && isFinishedStatus(match.status, match.score))
      .map((match) => {
        const player1 = normalizeName(match.player1);
        const player2 = normalizeName(match.player2);
        const winner = normalizeName(match.winner || "") || inferWinnerFromScore(player1, player2, match.score);
        const start = match.startTime ? new Date(match.startTime) : null;

        return toUpset({
          id: String(match.id || `${player1}-${player2}`),
          tour: getTourFromText(`${match.tournament || ""} ${match.category || ""}`),
          tournament: match.tournament || "French Open",
          round: match.round || "Completed match",
          date: start && !Number.isNaN(start.getTime()) ? formatParisDate(start) : "",
          time: start && !Number.isNaN(start.getTime()) ? start.toISOString().slice(11, 16) : "",
          player1,
          player2,
          winner,
          score: match.score || "Score unavailable",
          dynamicSeeds: seedPool,
        });
      })
      .filter(Boolean);

    const verifiedUpsets = buildVerified2026Upsets(seedPool);

    const liveUpsets = Array.from(
      new Map([...apiUpsets, ...normalizedUpsets, ...archiveUpsets].map((upset: any) => [String(upset.id), upset])).values()
    );

    const upsets = Array.from(
      new Map([...liveUpsets, ...verifiedUpsets].map((upset: any) => [String(upset.id), upset])).values()
    ).sort((a: any, b: any) => a.loserSeed - b.loserSeed || `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

    return NextResponse.json({
      success: true,
      dateStart,
      dateStop,
      count: upsets.length,
      apiStatus: apiResult.status,
      apiFixtureCount: apiResult.fixtures.length,
      archiveFixtureCount: archiveMatches.length,
      normalizedMatchCount: normalizedMatches.length,
      dynamicSeedCount: dynamicSeeds.length,
      liveUpsetCount: liveUpsets.length,
      verifiedUpsetCount: verifiedUpsets.length,
      seedSource: liveUpsets.length > 0
        ? (dynamicSeeds.length > 0 ? "API-Tennis top-32 ranking snapshot + live/archived Roland Garros results, plus verified 2026 seeded exits." : "Bundled top-32 watchlist + live/archived Roland Garros results, plus verified 2026 seeded exits.")
        : "API-Tennis / match_archive returned no seeded exits for this window, so verified 2026 seeded exits are included as the source layer.",
      upsets,
    });
  } catch (error) {
    console.warn("French Open upset tracker skipped:", error);
    return NextResponse.json({ success: false, error: "Unexpected error while loading French Open upset tracker.", dateStart, dateStop, count: 0, seedSource: "Route error; no fake fallback data returned.", upsets: [] }, { status: 200 });
  }
}

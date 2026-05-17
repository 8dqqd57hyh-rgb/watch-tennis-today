import type { MetadataRoute } from "next";
import { players } from "@/data/players";
export const dynamic = "force-dynamic";

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category?: string;
  status?: string;
  startTime?: string;
};

const BASE_URL = "https://watchtennistoday.com";

const TOP_PLAYERS = new Set([
  "jannik-sinner",
  "carlos-alcaraz",
  "novak-djokovic",
  "daniil-medvedev",
  "alexander-zverev",
  "andrey-rublev",
  "taylor-fritz",
  "alex-de-minaur",
  "stefanos-tsitsipas",
  "casper-ruud",
  "jack-draper",
  "matteo-berrettini",
  "holger-rune",
  "iga-swiatek",
  "aryna-sabalenka",
  "coco-gauff",
  "elena-rybakina",
  "jessica-pegula",
  "madison-keys",
  "jasmine-paolini",
  "emma-navarro",
  "mirra-andreeva",
  "naomi-osaka",
  "jelena-ostapenko",
  "elina-svitolina",
]);

const IMPORTANT_TOURNAMENT_KEYWORDS = [
  "atp-rome",
  "wta-rome",
  "rome",
  "roland-garros",
  "french-open",
  "wimbledon",
  "us-open",
  "australian-open",
  "indian-wells",
  "miami",
  "madrid",
  "monte-carlo",
  "cincinnati",
  "canada",
  "paris",
  "doha",
  "dubai",
  "stuttgart",
  "halle",
  "queens",
  "tokyo",
  "beijing",
  "shanghai",
  "wta-finals",
  "atp-finals",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitPlayers(name: string) {
  return name
    .split("/")
    .map((player) => player.trim())
    .filter(Boolean);
}

function containsBadPlaceholder(text: string) {
  const slug = slugify(text);

  if (/qf\d+/i.test(slug)) return true;
  if (/r\d+p\d+/i.test(slug)) return true;

  return false;
}

function hasTooManyInitials(text: string) {
  const slug = slugify(text);
  const parts = slug.split("-");

  return parts.some((part) => part.length === 1);
}

function isGoodPlayerName(name: string) {
  if (containsBadPlaceholder(name)) return false;
  if (hasTooManyInitials(name)) return false;

  const slug = slugify(name);

  if (!slug) return false;
  if (slug.length < 6) return false;

  const blocked = [
    "q",
    "qualifier",
    "bye",
    "tbd",
    "unknown",
  ];

  if (blocked.includes(slug)) return false;

  const parts = name
    .trim()
    .split(" ")
    .filter(Boolean);

  if (parts.length < 2) return false;

  return true;
}

function isImportantTournament(tournament: string) {
  const slug = slugify(tournament);

  if (!slug) return false;
  if (slug.includes("utr-ptt")) return false;
  if (slug.includes("itf")) return false;

  return IMPORTANT_TOURNAMENT_KEYWORDS.some((keyword) =>
    slug.includes(keyword)
  );
}

function isImportantMatch(match: Match) {
  const allPlayers = [
    ...splitPlayers(match.player1),
    ...splitPlayers(match.player2),
  ];

  if (!allPlayers.every(isGoodPlayerName)) {
    return false;
  }
  if (
  match.player1.includes("/") ||
  match.player2.includes("/")
) {
  return false;
}

  const players = allPlayers.map(slugify);

  const hasTopPlayer = players.some((player) => TOP_PLAYERS.has(player));
  const hasImportantTournament = isImportantTournament(match.tournament);
  const isLive =
  match.status?.toUpperCase() === "LIVE";
const category = match.category?.toUpperCase();

const isAtpOrWta =
  category === "ATP" ||
  category === "WTA";

  return isLive || hasTopPlayer || hasImportantTournament || isAtpOrWta;
}

function matchSlug(match: Match) {
  const readablePart = slugify(`${match.player1}-vs-${match.player2}`);
  const numericId = match.id.split(":").pop();

  return `${readablePart}-${numericId}`;
}

async function getMatches(): Promise<Match[]> {
  try {
    const response = await fetch(`${BASE_URL}/api/matches`, {
      cache: "no-store",
    });

    if (!response.ok) return [];

    const data = await response.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.matches)) return data.matches;

    return [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const matches = await getMatches();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/live-tennis",
    "/players/live-now",
    "/players",
    "/players/atp",
"/players/wta",
    "/watch-tennis-in/poland",
    "/tennis-trending-now",
    "/best-vpn-for-tennis-streaming",
    "/how-to-watch-tennis-safely-abroad",
    "/watch-tennis-in/uk",
    "/watch-tennis-in/usa",
    "/watch-tennis-in/germany",
    "/watch-tennis-in/france",
    "/watch-tennis-in/spain",
    "/watch-tennis-in/italy",
    "/watch-tennis-in/canada",
    "/watch-tennis-in/australia",
    "/watch-tennis-in/india",
    "/watch-tennis-live-today",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/atp-live-today",
    "/french-open-schedule",
    "/matches/live-now",
    "/compare",
"/compare/tennis-tv-vs-espn",
"/compare/tennis-tv-vs-eurosport",
"/compare/espn-vs-tennis-channel",
"/compare/nordvpn-vs-surfshark-for-tennis",
"/rome-open-final-live",
    "/disclaimer",
    "/advertise",
    "/newsletter",
    "/how-to-watch-french-open-in-usa",
    "/watch-player-live/jannik-sinner",
    "/watch-player-live/iga-swiatek",
    "/watch-player-live/carlos-alcaraz",
    "/watch-player-live/novak-djokovic",
    "/watch-player-live/aryna-sabalenka",
    "/watch-sinner-live",
"/watch-swiatek-live",
"/watch-alcaraz-live",
"/watch-djokovic-live",
"/watch-sabalenka-live",
    "/tournament",
    "/best-ways-to-watch-tennis-online",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: path === "" ? 1 : 0.9,
  }));

  const importantMatches = matches.filter(isImportantMatch);

  const dynamicPlayers = [
  ...new Set(
    importantMatches
      .flatMap((match) => [
        ...splitPlayers(match.player1),
        ...splitPlayers(match.player2),
      ])
      .filter(isGoodPlayerName)
      .map(slugify)
      .filter(Boolean)
  ),
];

const uniquePlayers = [
  ...new Set([
    ...Array.from(TOP_PLAYERS),
    ...dynamicPlayers,
  ]),
].slice(0, 120);

  const playerPages: MetadataRoute.Sitemap = uniquePlayers.map((player) => ({
    url: `${BASE_URL}/player/${player}`,
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: TOP_PLAYERS.has(player) ? 0.9 : 0.75,
  }));

  const nextMatchPages: MetadataRoute.Sitemap = Object.keys(players).map(
  (player) => ({
    url: `${BASE_URL}/next-match/${player}`,
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: 0.85,
  })
);

const tvSchedulePages: MetadataRoute.Sitemap = Object.keys(players).map(
  (player) => ({
    url: `${BASE_URL}/tv-schedule/${player}`,
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: 0.85,
  })
);

  const uniqueTournaments = [
    ...new Set(
      matches
        .filter((match) => isImportantTournament(match.tournament))
        .map((match) => slugify(match.tournament))
        .filter(Boolean)
    ),
  ];

  const tournamentPages: MetadataRoute.Sitemap = uniqueTournaments.map(
    (tournament) => ({
      url: `${BASE_URL}/tournament/${tournament}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.9,
    })
  );

  const matchPages: MetadataRoute.Sitemap = importantMatches.map((match) => ({
    url: `${BASE_URL}/watch/${matchSlug(match)}`,
    lastModified: match.startTime
  ? new Date(match.startTime)
  : now,
    changeFrequency: "hourly" as const,
    priority: 0.9,
  }));

 return [
  ...staticPages,
  ...playerPages,
  ...nextMatchPages,
  ...tvSchedulePages,
  ...tournamentPages,
  ...matchPages,
];
}
import type { MetadataRoute } from "next";
import { players } from "@/data/players";
import { getCanonicalPlayerSlug, verifiedPlayersFromMatchSide } from "@/data/playerSlugs";
import { publishedGuideArticles } from "@/app/guides/articles";
import { ADSENSE_INDEXABLE_BROADCAST_COUNTRIES } from "@/data/broadcastFinder";
import { stableTournamentHubSlugs } from "@/data/tournamentHubs";
export const revalidate = 3600;

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

const REDIRECT_ONLY_PATHS = new Set([
  "/french-open-draw",
  "/french-open-survivors",
  "/french-open-upsets",
  "/french-open-live-stream",
  "/french-open-streaming-countries",
  "/french-open-schedule",
  "/french-open-tv-schedule",
  "/french-open-live",
  "/french-open-today",
  "/privacy-policy",
  "/roland-garros-draw",
  "/roland-garros-live",
  "/roland-garros-live-stream",
  "/roland-garros-pulse",
  "/roland-garros-predictions",
  "/roland-garros-results",
  "/roland-garros-tv-schedule",
  "/tennis-schedule-tomorrow",
  "/watch-french-open-in-australia",
  "/watch-french-open-in-canada",
  "/watch-french-open-in-uk",
  "/watch-french-open-in-usa",
  "/watch-sabalenka-live",
  "/watch-swiatek-live",
  "/watch/tennis-spoiler-free-scores",
  "/wimbledon-live-stream",
  "/wimbledon-tv-schedule",
]);


const ADSENSE_INDEXABLE_PLAYERS = new Set([
  "jannik-sinner",
  "carlos-alcaraz",
  "novak-djokovic",
  "daniil-medvedev",
  "alexander-zverev",
  "taylor-fritz",
  "holger-rune",
  "andrey-rublev",
  "casper-ruud",
  "stefanos-tsitsipas",
  "alex-de-minaur",
  "lorenzo-musetti",
  "tommy-paul",
  "ben-shelton",
  "iga-swiatek",
  "aryna-sabalenka",
  "coco-gauff",
  "elena-rybakina",
  "jessica-pegula",
  "madison-keys",
  "naomi-osaka",
  "mirra-andreeva",
  "jasmine-paolini",
  "emma-navarro",
]);

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
  return verifiedPlayersFromMatchSide(name);
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
  // Avoid live API calls while Vercel is collecting metadata/routes.
  // Dynamic match URLs are discoverable from the app itself; the sitemap keeps
  // stable SEO pages only so deployments do not stall on external data.
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const matches = await getMatches();
  const now = new Date();


  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/players/live-now",
    "/tennis-time-zone-converter",
    "/players",
    "/players/atp",
    "/players/wta",
    "/best-tennis-players",
    "/tennis-calendar",
    "/tennis-tournaments",
    "/analysis",
    "/tennis-resources",
    "/newsletter",
    "/advertise",
    "/watch-tennis-in",
    "/french-open",
    "/french-open-guide",
    "/today",
    "/tomorrow",
    "/live-tennis",
    "/watch",
    "/next-match",
    "/wta-live-today",
      "/atp-live-today",
    "/grand-slam-live",
    "/affiliate-disclosure",
    "/authors/watch-tennis-today",
    "/guides",
    "/tennis-guides",
    "/tennis-glossary",
    "/best-tennis-matches-today",
    "/tennis-tv-broadcast-finder",
    "/tennis-tv-not-working",
    "/tennis-streaming-services",
    "/tennis-live-alerts",
    "/watch-tennis-abroad",
    "/wimbledon-schedule",
    "/wimbledon-results",
    "/where-to-watch-wimbledon",
    "/tennis-on-tv-today",
    "/who-plays-tennis-today",
    "/how-to-watch-tennis-without-cable",
    "/how-to-watch-tennis-safely-abroad",
    "/how-to-watch-tennis-legally",
    "/tennis-scoring-explained",
    "/atp-wta-rankings-explained",
    "/tennis-tournament-levels-guide",
    "/how-to-choose-tennis-streaming-service",
    "/tennis-schedule-terms-explained",
    "/official-tennis-broadcasters-guide",
    "/tennis-live-scores-explained",
    "/grand-slam-tv-rights-explained",
    "/content-guidelines",
    "/watch-tennis-live-today",
    "/tennis-results-today",
    "/tennis-order-of-play-today",
    "/tennis-schedule-today",
    "/about",
    "/contact",
     "/privacy",
    "/terms",
    "/cookie-policy",
"/editorial-policy",
"/how-we-source-data",
"/how-we-verify-streams",
    "/tennis-streaming-rights-explained",
"/rome-open-final-live",
    "/disclaimer",
    "/how-to-watch-french-open-in-usa",
    "/tournament",
    "/wimbledon",
    "/us-open",
    "/australian-open",
    "/watch-tennis-online",
    "/watch-tennis-in-usa",
    "/watch-tennis-in-uk",
    "/watch-tennis-in-australia",
    "/watch-tennis-in-canada",
    "/why-trust-watch-tennis-today",
    "/tennis-streaming",
    "/start-here",
    "/best-ways-to-watch-tennis-online",
  ].filter((path) => !REDIRECT_ONLY_PATHS.has(path)).map((path) => {
  const livePages = [
    "",
  ];
  return {
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: livePages.includes(path)
      ? ("hourly" as const)
      : ("weekly" as const),
    priority: path === "" ? 1 : 0.9,
  };
});


  // AdSense quality: include only manually reviewed country guides.
  const countryPages: MetadataRoute.Sitemap = Array.from(ADSENSE_INDEXABLE_BROADCAST_COUNTRIES).map((country) => ({
    url: `${BASE_URL}/watch-tennis-in/${country}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.82,
  }));

  const importantMatches = matches.filter(isImportantMatch);

  const dynamicPlayers = [
    ...new Set(
      importantMatches
        .flatMap((match) => [
          ...splitPlayers(match.player1),
          ...splitPlayers(match.player2),
        ])
        .map(getCanonicalPlayerSlug)
        .filter((slug): slug is keyof typeof players => Boolean(slug))
    ),
  ];

  const canonicalTopPlayers = Array.from(TOP_PLAYERS)
    .map(getCanonicalPlayerSlug)
    .filter((slug): slug is keyof typeof players => Boolean(slug));

const uniquePlayers = [
  ...new Set([
    ...canonicalTopPlayers,
    ...dynamicPlayers,
  ]),
]
  // AdSense quality: player URLs enter the sitemap only when the page has a
  // substantial editorial profile and is eligible for indexing.
  .filter((player) => ADSENSE_INDEXABLE_PLAYERS.has(player))
  .slice(0, 120);

  const playerPages: MetadataRoute.Sitemap = uniquePlayers.map((player) => ({
    url: `${BASE_URL}/player/${player}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: canonicalTopPlayers.includes(player) ? 0.9 : 0.75,
  }));


  const uniqueTournaments = [
    ...new Set(
      matches
        .filter((match) => isImportantTournament(match.tournament))
        .map((match) => slugify(match.tournament))
        .filter(Boolean)
    ),
  ];

  const stableTournamentDetailSlugs = Array.from(
    new Set([...stableTournamentHubSlugs, ...uniqueTournaments])
  );

  const tournamentPages: MetadataRoute.Sitemap = stableTournamentDetailSlugs.map(
    (tournament) => ({
      url: `${BASE_URL}/tournament/${tournament}`,
      lastModified: now,
      changeFrequency: uniqueTournaments.includes(tournament) ? ("daily" as const) : ("monthly" as const),
      priority: stableTournamentHubSlugs.includes(tournament) ? 0.86 : 0.9,
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

// Add French Open / Roland Garros related pages
const frenchOpenPages = [
  "/watch-french-open-online",
  "/french-open-results",
  "/roland-garros-recap",
  "/where-to-watch-french-open",
];

  // AdSense quality: comparison detail pages are intentionally excluded because
  // they are templated affiliate/comparison pages and are marked noindex.

  const guidePages: MetadataRoute.Sitemap = publishedGuideArticles.map((article) => ({
    url: `${BASE_URL}/guides/${article.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.86,
  }));

 return [
  ...staticPages,
  ...countryPages,
  ...guidePages,
  ...playerPages,
  ...tournamentPages,
  ...matchPages,
  ...frenchOpenPages.map((page) => ({
    url: `${BASE_URL}${page}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  })),
];
}

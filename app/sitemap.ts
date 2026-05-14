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
  "sinner-jannik",
  "alcaraz-carlos",
  "djokovic-novak",
  "medvedev-daniil",
  "zverev-alexander",
  "rublev-andrey",
  "fritz-taylor",
  "de-minaur-alex",
  "tsitsipas-stefanos",
  "ruud-casper",
  "draper-jack",
  "berrettini-matteo",
  "rune-holger",

  "swiatek-iga",
  "sabalenka-aryna",
  "gauff-coco",
  "rybakina-elena",
  "pegula-jessica",
  "keys-madison",
  "paolini-jasmine",
  "navarro-emma",
  "andreeva-mirra",
  "osaka-naomi",
  "ostapenko-jelena",
  "svitolina-elina",
]);

const IMPORTANT_TOURNAMENT_KEYWORDS = [
  "atp-rome",
  "wta-rome",
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

function isGoodPlayerSlug(player: string) {
  const slug = slugify(player);

  if (!slug) return false;

  if (/^qf\d+$/i.test(slug)) return false;
  if (/^r\d+p\d+$/i.test(slug)) return false;

  const blocked = [
    "q",
    "qualifier",
    "bye",
    "tbd",
    "unknown",
  ];

  if (blocked.includes(slug)) return false;
  if (slug.length < 6) return false;

  const parts = slug.split("-");

  if (parts.length < 2) return false;

  const singleLetters = parts.filter(
    (part) => part.length === 1
  );

  if (singleLetters.length > 0) return false;

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

function containsBadPlaceholder(text: string) {
  const slug = slugify(text);

  if (/qf\d+/i.test(slug)) return true;
  if (/r\d+p\d+/i.test(slug)) return true;

  return false;
}

function hasTooManyInitials(text: string) {
  const slug = slugify(text);

  const parts = slug.split("-");

  const singleLetters = parts.filter(
    (part) => part.length === 1
  );

  return singleLetters.length >= 1;
}

function isGoodPlayerName(name: string) {
  if (containsBadPlaceholder(name)) {
    return false;
  }

  if (hasTooManyInitials(name)) {
    return false;
  }

  return true;
}

function isImportantMatch(match: Match) {
  const allPlayers = [
    ...splitPlayers(match.player1),
    ...splitPlayers(match.player2),
  ];

  // фильтр мусора
  const allPlayersValid = allPlayers.every(
    isGoodPlayerName
  );

  if (!allPlayersValid) {
    return false;
  }

  const tournamentSlug = slugify(
    match.tournament
  );

  const players = allPlayers.map(slugify);

  const hasTopPlayer = players.some((player) =>
    TOP_PLAYERS.has(player)
  );

  const hasImportantTournament =
    isImportantTournament(match.tournament);

  const isLive = match.status === "LIVE";

  const isAtpOrWta =
    match.category === "ATP" ||
    match.category === "WTA";

  return (
    isLive ||
    hasTopPlayer ||
    hasImportantTournament ||
    isAtpOrWta ||
    tournamentSlug.includes("grand-slam")
  );
}

function matchSlug(match: Match) {
  const readablePart = `${match.player1}-vs-${match.player2}`
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${encodeURIComponent(match.id)}--${readablePart}`;
}

async function getMatches(): Promise<Match[]> {
  const response = await fetch(`${BASE_URL}/api/matches`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export default async function sitemap() {
  const matches = await getMatches();

  const now = new Date();

  const staticPages = [
  "",
  "/live-tennis",
  "/watch-tennis-in/poland",
  "/watch-tennis-in/uk",
  "/watch-tennis-in/usa",
  "/watch-tennis-in/germany",
"/watch-tennis-in/france",
"/watch-tennis-in/spain",
"/watch-tennis-in/italy",
"/watch-tennis-in/canada",
"/watch-tennis-in/australia",
"/watch-tennis-in/india",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
"/disclaimer",
"/tournament",
"/best-ways-to-watch-tennis-online",
].map((path) => ({
  url: `${BASE_URL}${path}`,
  lastModified: now,
  changeFrequency: "weekly" as const,
  priority: path === "" ? 1 : 0.6,
}));

  const importantMatches = matches.filter(isImportantMatch);

  const playersFromImportantMatches = importantMatches.flatMap(
    (match) => [
      ...splitPlayers(match.player1),
      ...splitPlayers(match.player2),
    ]
  );

  const uniquePlayers = [
  ...new Set(
    playersFromImportantMatches
      .filter(isGoodPlayerName)
      .map(slugify)
      .filter((player) => TOP_PLAYERS.has(player))
  ),
];

  const playerPages = uniquePlayers.map((player) => ({
    url: `${BASE_URL}/player/${player}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const uniqueTournaments = [
    ...new Set(
      matches
        .filter((match) =>
          isImportantTournament(match.tournament)
        )
        .map((match) => slugify(match.tournament))
        .filter(Boolean)
    ),
  ];

  const tournamentPages = uniqueTournaments.map(
    (tournament) => ({
      url: `${BASE_URL}/tournament/${tournament}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.75,
    })
  );

  const matchPages = importantMatches.map((match) => ({
    url: `${BASE_URL}/watch/${matchSlug(match)}`,
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: match.status === "LIVE" ? 0.8 : 0.5,
  }));

  return [
    ...staticPages,
    ...playerPages,
    ...tournamentPages,
    ...matchPages,
  ];
}
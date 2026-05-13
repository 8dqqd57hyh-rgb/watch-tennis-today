type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category?: string;
  status?: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isGoodPlayerSlug(player: string) {
  const slug = slugify(player);

  if (!slug) return false;

  // placeholders
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

  // слишком короткий
  if (slug.length < 6) return false;

  const parts = slug.split("-");

  // если фамилия только 1 буква
  const lastPart = parts[parts.length - 1];

  if (lastPart.length === 1) {
    return false;
  }

  // слишком много single-letter частей
  const singleLetters = parts.filter(
    (p) => p.length === 1
  );

  if (singleLetters.length >= 1) {
    return false;
  }

  // минимум имя + фамилия
  if (parts.length < 2) {
    return false;
  }

  return true;
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
  const response = await fetch(
    "https://watchtennistoday.com/api/matches",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export default async function sitemap() {
  const matches = await getMatches();

  const baseUrl = "https://watchtennistoday.com";

  const staticPages = [
    "",
    "/live-tennis",
    "/watch-tennis-in/poland",
    "/watch-tennis-in/uk",
    "/watch-tennis-in/usa",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));

  const uniquePlayers = [
    ...new Set(
      matches.flatMap((match) => [
        ...match.player1.split("/"),
        ...match.player2.split("/"),
      ])
    ),
  ]
    .map((player) => player.trim())
    .filter(isGoodPlayerSlug)
    .map((player) => slugify(player));

  const playerPages = uniquePlayers.map((player) => ({
    url: `${baseUrl}/player/${player}`,
    lastModified: new Date(),
  }));

  const uniqueTournaments = [
    ...new Set(
      matches
        .map((match) => slugify(match.tournament))
        .filter(Boolean)
    ),
  ];

  const tournamentPages = uniqueTournaments.map(
    (tournament) => ({
      url: `${baseUrl}/tournament/${tournament}`,
      lastModified: new Date(),
    })
  );

  const matchPages = matches.map((match) => ({
    url: `${baseUrl}/watch/${matchSlug(match)}`,
    lastModified: new Date(),
  }));

  return [
    ...staticPages,
    ...playerPages,
    ...tournamentPages,
    ...matchPages,
  ];
}
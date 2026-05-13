type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
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

async function getMatches(): Promise<Match[]> {
  const response = await fetch(
    "https://watchtennistoday.com/api/matches",
    {
      cache: "no-store",
    }
  );

  return response.json();
}

export default async function sitemap() {
  const matches = await getMatches();

  const baseUrl =
    "https://watchtennistoday.com";

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
      ...match.player1
        .split("/")
        .map((p) => slugify(p.trim())),

      ...match.player2
        .split("/")
        .map((p) => slugify(p.trim())),
    ])
  ),
].filter((player) => !/^qf\d+$/i.test(player));

const playerPages = uniquePlayers.map(
  (player) => ({
    url: `${baseUrl}/player/${player}`,
    lastModified: new Date(),
  })
);

  const uniqueTournaments = [
  ...new Set(
    matches.map((match) =>
      slugify(match.tournament)
    )
  ),
];

const tournamentPages = uniqueTournaments.map(
  (tournament) => ({
    url: `${baseUrl}/tournament/${tournament}`,
    lastModified: new Date(),
  })
);

  const matchPages = matches.map((match) => {
  const readablePart = `${match.player1}-vs-${match.player2}`
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    url: `${baseUrl}/watch/${encodeURIComponent(
      match.id
    )}--${readablePart}`,
    lastModified: new Date(),
  };
});

 return [
  ...staticPages,
  ...playerPages,
  ...tournamentPages,
  ...matchPages,
];
}
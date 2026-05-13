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

  const playerPages = matches.flatMap(
    (match) => {
      const players = [
        ...match.player1.split("/"),
        ...match.player2.split("/"),
      ];

      return players.map((player) => ({
        url: `${baseUrl}/player/${slugify(
          player.trim()
        )}`,
        lastModified: new Date(),
      }));
    }
  );

  const tournamentPages = matches.map(
    (match) => ({
      url: `${baseUrl}/tournament/${slugify(
        match.tournament
      )}`,
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
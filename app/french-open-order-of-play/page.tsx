import VpnPromo from "@/app/components/VpnPromo";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "French Open Order of Play 2026 | Roland Garros Schedule Today",
  description:
    "French Open order of play for Roland Garros 2026. See today’s Roland Garros schedule, live matches, upcoming matches, results, TV channels and streaming guides.",
};

type Match = {
  id?: string;
  player1?: string;
  player2?: string;
  tournament?: string;
  category?: string;
  status?: string;
  score?: string;
  round?: string;
  date?: string;
  time?: string;
  startTime?: string;
  court?: string;
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

function matchSlug(match: Match) {
  const readablePart = slugify(
    `${match.player1 || "player"}-vs-${match.player2 || "player"}`
  );

  const numericId = match.id?.split(":").pop() || "match";

  return `${readablePart}-${numericId}`;
}

function isFrenchOpenMatch(match: Match) {
  const tournament = `${match.tournament || ""}`.toLowerCase();

  return (
    tournament.includes("french open") ||
    tournament.includes("roland garros") ||
    tournament.includes("roland-garros") ||
    tournament.includes("garros")
  );
}

function isLive(match: Match) {
  return `${match.status || ""}`.toUpperCase() === "LIVE";
}

function isFinished(match: Match) {
  const status = `${match.status || ""}`.toLowerCase();

  return (
    status.includes("finished") ||
    status.includes("completed") ||
    status.includes("ended") ||
    status.includes("final")
  );
}

function formatStartTime(match: Match) {
  if (match.startTime) {
    return new Date(match.startTime).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  if (match.date || match.time) {
    return [match.date, match.time].filter(Boolean).join(" · ");
  }

  return "Start time not available";
}

function MatchCard({ match }: { match: Match }) {
  return (
    <a
      href={`/watch/${matchSlug(match)}`}
      className="block rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-orange-500 hover:bg-zinc-900"
    >
      <div className="mb-4 flex justify-between gap-3">
        <span
          className={
            isLive(match)
              ? "font-black text-green-400"
              : "font-black text-orange-400"
          }
        >
          {match.status || "Scheduled"}
        </span>

        <span className="text-sm text-zinc-500">
          {match.category || "Tennis"}
        </span>
      </div>

      <h3 className="mb-4 text-2xl font-black leading-tight">
        {match.player1 || "TBD"}
        <br />
        <span className="text-zinc-500">vs</span>
        <br />
        {match.player2 || "TBD"}
      </h3>

      <div className="space-y-2 text-sm leading-6 text-zinc-400">
        <p>{match.round || match.tournament || "Roland Garros"}</p>

        {match.court ? <p>Court: {match.court}</p> : null}

        <p>{formatStartTime(match)}</p>

        {match.score ? <p>Score: {match.score}</p> : null}
      </div>
    </a>
  );
}

export default async function FrenchOpenOrderOfPlayPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let matches: Match[] = [];

  try {
    const res = await fetch(`${baseUrl}/api/french-open-today`, {
  cache: "no-store",
});

    if (res.ok) {
      const data = await res.json();
      matches = Array.isArray(data) ? data : data?.matches || [];
    }
  } catch {
    matches = [];
  }

  const frenchOpenMatches = matches.filter(isFrenchOpenMatch);

  const liveMatches = frenchOpenMatches.filter(isLive);
  const completedMatches = frenchOpenMatches.filter(isFinished);
  const upcomingMatches = frenchOpenMatches.filter(
    (match) => !isLive(match) && !isFinished(match)
  );

  const TOP_PLAYERS = [
    "Jannik Sinner",
    "Carlos Alcaraz",
    "Novak Djokovic",
    "Iga Swiatek",
    "Aryna Sabalenka",
    "Coco Gauff",
    "Daniil Medvedev",
    "Alexander Zverev",
    "Holger Rune",
    "Elena Rybakina",
  ];

  function playerSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/,/g, "")
      .replace(/\//g, "-")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  const playersToday = [
    ...new Set(
      frenchOpenMatches.flatMap((match) => [match.player1 || "", match.player2 || ""])
    ),
  ]
    .filter((player) => TOP_PLAYERS.includes(player))
    .slice(0, 8);

  const topMatches = [
    ...liveMatches,
    ...upcomingMatches,
    ...completedMatches,
  ].slice(0, 12);

  const stats = [
    ["All listed matches", frenchOpenMatches.length],
    ["Live now", liveMatches.length],
    ["Upcoming", upcomingMatches.length],
    ["Completed", completedMatches.length],
  ];

  const relatedLinks = [
    ["French Open Today", "/french-open-today"],
    ["French Open Results", "/french-open-results"],
    ["French Open Draw", "/french-open-draw"],
    ["French Open Live", "/french-open-live"],
    ["TV Schedule", "/french-open-tv-schedule"],
    ["Live Stream Guide", "/french-open-live-stream"],
    ["Where to Watch", "/where-to-watch-french-open"],
    ["Streaming Countries", "/french-open-streaming-countries"],
  ];

  const faq = [
    {
      q: "What is the French Open order of play?",
      a: "The French Open order of play is the daily Roland Garros match schedule, showing which matches are planned across the tournament day.",
    },
    {
      q: "Can French Open match times change?",
      a: "Yes. Tennis match times can change because of previous matches, weather delays, court changes and tournament scheduling.",
    },
    {
      q: "Where can I watch the French Open order of play matches?",
      a: "Use the French Open live, TV schedule and streaming country guides to find official viewing options for Roland Garros matches.",
    },
  ];

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="mb-10 rounded-[2.5rem] border border-orange-500/50 bg-gradient-to-br from-orange-950/50 to-black p-8">
          <p className="mb-4 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-black">
            Roland Garros schedule
          </p>

          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            French Open Order of Play
            <br />
            Today’s Roland Garros Schedule
          </h1>

          <p className="mb-8 max-w-3xl text-lg leading-8 text-zinc-300">
            Follow the French Open order of play with today’s Roland Garros
            matches, live status, upcoming matches, completed results, TV
            schedule and streaming links.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#order-of-play"
              className="rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-black transition hover:bg-orange-400"
            >
              View order of play →
            </a>

            <a
              href="/french-open-live"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition hover:border-orange-500"
            >
              Live matches
            </a>

            <a
              href="/french-open-tv-schedule"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition hover:border-orange-500"
            >
              TV schedule
            </a>
          </div>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-4">
          {stats.map(([label, value]) => (
            <div
              key={label}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-zinc-500">
                {label}
              </p>
              <p className="text-4xl font-black text-orange-400">{value}</p>
            </div>
          ))}
        </section>

        {playersToday.length > 0 ? (
          <section className="mb-12">
            <h2 className="mb-5 text-4xl font-black">
              Top Players at Roland Garros Today
            </h2>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {playersToday.map((player) => (
                <a
                  key={player}
                  href={`/watch-player-live/${playerSlug(player)}`}
                  className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-orange-500 hover:bg-zinc-900"
                >
                  <h3 className="mb-3 text-2xl font-black">{player}</h3>

                  <p className="leading-7 text-zinc-400">
                    See live scores, schedule, results and streaming options.
                  </p>
                </a>
              ))}
            </div>
          </section>
        ) : null}

        <section id="order-of-play" className="mb-12">
          <h2 className="mb-5 text-4xl font-black">
            Today’s Roland Garros Order of Play
          </h2>

          {topMatches.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {topMatches.map((match) => (
                <MatchCard key={`top-${match.id}`} match={match} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <p className="leading-8 text-zinc-300">
                No French Open order of play matches are listed right now. Check
                back soon for Roland Garros match times and schedule updates.
              </p>
            </div>
          )}
        </section>

        <section className="mb-12">
          <h2 className="mb-5 text-4xl font-black">
            Live French Open matches
          </h2>

          {liveMatches.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {liveMatches.slice(0, 9).map((match) => (
                <MatchCard key={`live-${match.id}`} match={match} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-300">
              No Roland Garros matches are live right now.
            </div>
          )}
        </section>

        <section className="mb-12">
          <h2 className="mb-5 text-4xl font-black">
            Upcoming French Open matches
          </h2>

          {upcomingMatches.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {upcomingMatches.slice(0, 12).map((match) => (
                <MatchCard key={`upcoming-${match.id}`} match={match} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-300">
              No upcoming Roland Garros matches are listed right now.
            </div>
          )}
        </section>

        <section className="mb-12">
          <h2 className="mb-5 text-4xl font-black">
            Completed French Open matches
          </h2>

          {completedMatches.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {completedMatches.slice(0, 9).map((match) => (
                <MatchCard key={`completed-${match.id}`} match={match} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-300">
              No completed Roland Garros matches are listed right now.
            </div>
          )}
        </section>

        <section className="mb-12 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-5 text-3xl font-black">
            More French Open guides
          </h2>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {relatedLinks.map(([title, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-orange-500"
              >
                <h3 className="mb-2 text-lg font-black">{title}</h3>
                <p className="text-sm leading-6 text-zinc-400">
                  Follow Roland Garros matches, streams, scores and schedule
                  updates.
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-950 to-black p-8">
          <h2 className="mb-5 text-3xl font-black">
            About the French Open order of play
          </h2>

          <div className="max-w-4xl space-y-5 leading-8 text-zinc-300">
            <p>
              The French Open order of play shows which Roland Garros matches
              are scheduled across the tournament day. Start times can shift
              because of match length, court changes, weather delays and
              tournament scheduling decisions.
            </p>

            <p>
              This page works as a daily Roland Garros schedule hub with quick
              links to live matches, completed results, draw updates, TV
              schedule and official streaming guides.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-5 text-3xl font-black">
            French Open order of play FAQ
          </h2>

          <div className="space-y-4">
            {faq.map((item) => (
              <div key={item.q} className="rounded-2xl bg-zinc-900 p-5">
                <h3 className="mb-2 font-black">{item.q}</h3>
                <p className="leading-7 text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.a,
                },
              })),
            }),
          }}
        />
      </div>
    </main>
  );
}
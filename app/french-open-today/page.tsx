import FrenchOpenConversionCluster from "@/app/components/FrenchOpenConversionCluster";
import FrenchOpenStorylinesToday from "@/app/components/FrenchOpenStorylinesToday";
import FrenchOpenWatchIntent from "@/app/components/FrenchOpenWatchIntent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "French Open Today 2026 | Roland Garros Matches Today",
  description:
    "See French Open matches today, live Roland Garros scores, upcoming matches, completed results, order of play and TV schedule.",
};

type Match = {
  id?: string;
  player1?: string;
  player2?: string;
  tournament?: string;
  category?: string;
  status?: string;
  score?: string;
  startTime?: string;
  date?: string;
  time?: string;
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
  const text = `${match.tournament || ""}`.toLowerCase();

  return (
    text.includes("french open") ||
    text.includes("roland garros") ||
    text.includes("roland-garros") ||
    text.includes("garros")
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

function MatchCard({ match }: { match: Match }) {
  return (
    <a
      href={`/watch/${matchSlug(match)}`}
      className="block rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-orange-500 hover:bg-zinc-900"
    >
      <div className="mb-4 flex justify-between gap-3">
        <span className="font-black text-orange-400">
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

      <p className="text-sm leading-6 text-zinc-400">
        {match.score
          ? `Score: ${match.score}`
          : match.time
            ? `Start time: ${match.time}`
            : "Match time not listed"}
      </p>
    </a>
  );
}

export default async function FrenchOpenTodayPage() {
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

  const stats = [
    ["Live now", liveMatches.length],
    ["Upcoming today", upcomingMatches.length],
    ["Completed", completedMatches.length],
  ];

  const relatedLinks = [
    ["French Open Live", "/french-open-live"],
    ["Order of Play", "/french-open-order-of-play"],
    ["French Open Results", "/french-open-results"],
    ["Yesterday’s Roland Garros recap", "/roland-garros-recap"],
    ["French Open Draw", "/french-open-draw"],
    ["TV Schedule", "/french-open-tv-schedule"],
    ["Streaming Countries", "/french-open-streaming-countries"],
    ["Watch Online", "/watch-french-open-online"],
    ["Where to Watch", "/where-to-watch-french-open"],
  ];

  const faq = [
    {
      q: "Who plays at the French Open today?",
      a: "This page lists today’s Roland Garros matches, including live, upcoming and completed matches when data is available.",
    },
    {
      q: "Where can I watch French Open matches today?",
      a: "Use the French Open live, TV schedule and streaming country guides to find official viewing options.",
    },
    {
      q: "Are French Open match times final?",
      a: "Tennis match times can change due to previous matches, weather and court scheduling, so always check the latest order of play.",
    },
  ];

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="mb-10 rounded-[2.5rem] border border-orange-500/50 bg-gradient-to-br from-orange-950/50 to-black p-8">
          <p className="mb-4 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-black">
            Roland Garros today
          </p>

          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            French Open Today:
            <br />
            Roland Garros Matches
          </h1>

          <p className="mb-8 max-w-3xl text-lg leading-8 text-zinc-300">
            Follow today’s French Open matches, live scores, upcoming Roland
            Garros matches, completed results, order of play and TV schedule
            links.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#live"
              className="rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-black transition hover:bg-orange-400"
            >
              See matches today →
            </a>

            <a
              href="/french-open-tv-schedule"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition hover:border-orange-500"
            >
              TV schedule
            </a>
          </div>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-3">
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

        <FrenchOpenStorylinesToday compact />
        <FrenchOpenConversionCluster compact title="More French Open coverage" />
        <FrenchOpenWatchIntent compact />

        <section id="live" className="mb-12">
          <h2 className="mb-5 text-4xl font-black">Live French Open Matches</h2>

          {liveMatches.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {liveMatches.slice(0, 12).map((match) => (
                <MatchCard key={`live-${match.id}`} match={match} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-300">
              No French Open matches are live right now.
            </div>
          )}
        </section>

        <section className="mb-12">
          <h2 className="mb-5 text-4xl font-black">
            Upcoming French Open Matches Today
          </h2>

          {upcomingMatches.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {upcomingMatches.slice(0, 12).map((match) => (
                <MatchCard key={`upcoming-${match.id}`} match={match} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-300">
              No upcoming French Open matches are listed right now.
            </div>
          )}
        </section>

        <section className="mb-12">
          <h2 className="mb-5 text-4xl font-black">
            Completed French Open Matches Today
          </h2>

          {completedMatches.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {completedMatches.slice(0, 12).map((match) => (
                <MatchCard key={`completed-${match.id}`} match={match} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-300">
              No completed French Open matches are listed right now.
            </div>
          )}
        </section>

        <section className="mb-12 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-5 text-3xl font-black">
            More Roland Garros guides
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
                  Follow Roland Garros matches, streams, results and schedules.
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-950 to-black p-8">
          <h2 className="mb-5 text-3xl font-black">
            About French Open matches today
          </h2>

          <div className="max-w-4xl space-y-5 leading-8 text-zinc-300">
            <p>
              The French Open order of play changes throughout the tournament.
              Matches may move depending on court availability, weather delays,
              long previous matches and tournament scheduling.
            </p>

            <p>
              This page is designed as a daily Roland Garros hub with quick
              links to live matches, results, draw updates, TV schedule and
              official streaming guides.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-5 text-3xl font-black">French Open today FAQ</h2>

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
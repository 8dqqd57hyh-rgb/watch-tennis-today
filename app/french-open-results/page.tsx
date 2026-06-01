import FrenchOpenConversionCluster from "@/app/components/FrenchOpenConversionCluster";
import FrenchOpenTournamentRecords from "@/app/components/FrenchOpenTournamentRecords";

export const dynamic = "force-dynamic";

export const metadata = {
  alternates: { canonical: "https://watchtennistoday.com/french-open-results" },
};

type Match = {
  id?: string;
  player1?: string;
  player2?: string;
  tournament?: string;
  category?: string;
  status?: string;
  score?: string;
  winner?: string;
  round?: string;
  date?: string;
  time?: string;
  startTime?: string;
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
  const readablePart = slugify(`${match.player1 || "player"}-vs-${match.player2 || "player"}`);
  const numericId = match.id?.split(":").pop() || "match";

  return `${readablePart}-${numericId}`;
}

function formatMatchDate(match: Match) {
  if (!match.date && !match.time) return "Time not listed";
  return [match.date, match.time].filter(Boolean).join(" · ");
}

export default async function FrenchOpenResultsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let matches: Match[] = [];

  try {
    const res = await fetch(`${baseUrl}/api/french-open-results`, {
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") || "";

    if (res.ok && contentType.includes("application/json")) {
      const data = await res.json();
      matches = Array.isArray(data?.results) ? data.results : [];
    }
  } catch {
    matches = [];
  }

  const menMatches = matches.filter((match) =>
    `${match.category || ""}`.toUpperCase().includes("ATP")
  );

  const womenMatches = matches.filter((match) =>
    `${match.category || ""}`.toUpperCase().includes("WTA")
  );

  const topResults = matches.slice(0, 12);

  const statCards = [
    {
      label: "Completed matches",
      value: matches.length,
    },
    {
      label: "Men’s results",
      value: menMatches.length,
    },
    {
      label: "Women’s results",
      value: womenMatches.length,
    },
  ];

  const relatedLinks = [
    ["French Open Live", "/french-open-live"],
    ["French Open Today", "/french-open-today"],
    ["Roland Garros Recap", "/roland-garros-recap"],
    ["Order of Play", "/french-open-order-of-play"],
    ["French Open Draw", "/french-open-draw"],
    ["TV Schedule", "/french-open-tv-schedule"],
    ["Streaming by Country", "/french-open-streaming-countries"],
    ["Where to Watch", "/where-to-watch-french-open"],
    ["Watch French Open Online", "/watch-french-open-online"],
  ];

  const faq = [
    {
      q: "Where can I find French Open results today?",
      a: "You can follow completed Roland Garros matches on this French Open results page, including scores, winners and match links.",
    },
    {
      q: "How often are French Open results updated?",
      a: "French Open results can update throughout the day as matches finish. Refresh the page to see the latest completed matches.",
    },
    {
      q: "Where can I watch French Open matches live?",
      a: "You can use the French Open live, TV schedule and streaming country guides on Watch Tennis Today to find official viewing options.",
    },
  ];

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="mb-10 rounded-[2.5rem] border border-orange-500/50 bg-gradient-to-br from-orange-950/50 to-black p-8">
          <div className="mb-5 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-black">
            Roland Garros results
          </div>

          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            French Open Results:
            <br />
            Roland Garros Scores Today
          </h1>

          <p className="mb-8 max-w-3xl text-lg leading-8 text-zinc-300">
            Follow French Open results, completed Roland Garros matches,
            winners, scores, order of play links and official streaming guides.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#latest-results"
              className="rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-black transition hover:bg-orange-400"
            >
              View latest results →
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

        <section className="mb-10 grid gap-4 md:grid-cols-3">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-zinc-500">
                {card.label}
              </p>
              <p className="text-4xl font-black text-orange-400">
                {card.value}
              </p>
            </div>
          ))}
        </section>

        <FrenchOpenTournamentRecords />

        <FrenchOpenConversionCluster compact title="Next step after results" />

        <section id="latest-results" className="mb-12">
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-4xl font-black">
                Latest French Open Results
              </h2>
              <p className="mt-2 text-zinc-400">
                Completed Roland Garros matches from the latest available data.
              </p>
            </div>

            <a
              href="/french-open-today"
              className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-bold transition hover:border-orange-500"
            >
              See today’s schedule →
            </a>
          </div>

          {topResults.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {topResults.map((match) => (
                <a
                  key={`${match.id}-${match.player1}-${match.player2}`}
                  href={`/watch/${matchSlug(match)}`}
                  className="rounded-3xl border border-orange-500/30 bg-zinc-950 p-6 transition hover:border-orange-500 hover:bg-zinc-900"
                >
                  <div className="mb-4 flex justify-between gap-3">
                    <span className="font-black text-green-400">
                      {match.status || "Finished"}
                    </span>

                    <span className="text-zinc-500">
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

                  <p className="mb-2 font-bold text-zinc-200">
                    Score: {match.score || "Score not available"}
                  </p>

                  {match.winner ? (
                    <p className="mb-2 text-sm text-orange-300">
                      Winner: {match.winner}
                    </p>
                  ) : null}

                  <p className="text-sm text-zinc-500">
                    {[match.round, formatMatchDate(match)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <p className="leading-8 text-zinc-300">
                No completed French Open matches are listed right now. Check
                back soon for Roland Garros results and scores.
              </p>
            </div>
          )}
        </section>

        <section className="mb-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="mb-5 text-3xl font-black">
              Men’s French Open results
            </h2>

            <div className="space-y-3">
              {(menMatches.length ? menMatches : matches).slice(0, 8).map((match) => (
                <a
                  key={`men-${match.id}-${match.player1}`}
                  href={`/watch/${matchSlug(match)}`}
                  className="block rounded-2xl bg-zinc-900 p-4 transition hover:bg-zinc-800"
                >
                  <p className="font-bold">
                    {match.player1} vs {match.player2}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {match.score || "Score not available"}
                  </p>
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="mb-5 text-3xl font-black">
              Women’s French Open results
            </h2>

            <div className="space-y-3">
              {(womenMatches.length ? womenMatches : matches).slice(0, 8).map((match) => (
                <a
                  key={`women-${match.id}-${match.player1}`}
                  href={`/watch/${matchSlug(match)}`}
                  className="block rounded-2xl bg-zinc-900 p-4 transition hover:bg-zinc-800"
                >
                  <p className="font-bold">
                    {match.player1} vs {match.player2}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">
                    {match.score || "Score not available"}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-12 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-5 text-3xl font-black">
            More Roland Garros guides
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {relatedLinks.map(([title, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-orange-500"
              >
                <h3 className="mb-2 text-lg font-black">{title}</h3>
                <p className="text-sm leading-6 text-zinc-400">
                  Follow Roland Garros matches, streams and tournament updates.
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-950 to-black p-8">
          <h2 className="mb-5 text-3xl font-black">
            About French Open results
          </h2>

          <div className="max-w-4xl space-y-5 leading-8 text-zinc-300">
            <p>
              French Open results update across the day as Roland Garros matches
              finish on the show courts and outside courts in Paris.
            </p>

            <p>
              This page is designed for tennis fans who want a quick results
              overview, match links, official streaming guides and related
              French Open pages in one place.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-5 text-3xl font-black">French Open results FAQ</h2>

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
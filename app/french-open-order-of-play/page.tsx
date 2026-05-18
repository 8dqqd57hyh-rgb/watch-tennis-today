export const metadata = {
  title: "French Open Order of Play 2026 | Roland Garros Schedule Today",
  description:
    "French Open order of play for Roland Garros 2026. Find today’s match schedule, live matches, TV channels, streaming options and court coverage.",
};

export default async function FrenchOpenOrderOfPlayPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/matches`, {
    cache: "no-store",
  });

  const data = await res.json();
  const matches = Array.isArray(data) ? data : data.matches || [];

  const frenchOpenMatches = matches.filter((match: any) => {
    const tournament = match.tournament?.toLowerCase() || "";

    return (
      tournament.includes("french open") ||
      tournament.includes("roland garros")
    );
  });

  function matchSlug(match: any) {
    const readablePart = `${match.player1}-vs-${match.player2}`
      .toLowerCase()
      .replace(/,/g, "")
      .replace(/\//g, "-")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const numericId = match.id?.split(":").pop();

    return `${readablePart}-${numericId}`;
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <section className="mb-12 rounded-[2.5rem] border border-orange-500 bg-gradient-to-br from-orange-950/40 to-black p-8">
          <div className="mb-5 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-black">
            📅 ORDER OF PLAY
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            French Open Order of Play
            <br />
            Roland Garros Schedule
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-zinc-300 mb-8">
            Follow the French Open order of play with Roland Garros match times,
            live status, tournament updates, TV schedule and streaming links.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#order-of-play"
              className="rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-black hover:bg-orange-400 transition-all"
            >
              View Schedule →
            </a>

            <a
              href="/french-open-live"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-orange-500 transition-all"
            >
              Live Matches
            </a>

            <a
              href="/french-open-tv-schedule"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-orange-500 transition-all"
            >
              TV Schedule
            </a>
          </div>
        </section>

        <section id="order-of-play" className="mb-12">
          <h2 className="text-4xl font-black mb-6">
            🎾 Today’s Roland Garros Order of Play
          </h2>

          {frenchOpenMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {frenchOpenMatches.slice(0, 30).map((match: any) => (
                <a
                  key={match.id}
                  href={`/watch/${matchSlug(match)}`}
                  className="rounded-3xl border border-orange-500/40 bg-zinc-900 p-6 hover:border-orange-500 transition-all"
                >
                  <div className="flex justify-between gap-3 mb-4">
                    <span className="font-black text-orange-400">
                      {match.status || "Scheduled"}
                    </span>

                    <span className="text-zinc-500">
                      {match.category}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black leading-tight mb-4">
                    {match.player1}
                    <br />
                    vs
                    <br />
                    {match.player2}
                  </h3>

                  <p className="mb-3 text-zinc-400">
                    {match.tournament}
                  </p>

                  <p className="text-sm text-zinc-500">
                    {match.startTime
                      ? new Date(match.startTime).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Start time not available"}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-zinc-300 leading-8">
                No French Open order of play matches are listed right now.
                Check back soon for Roland Garros match times and schedule
                updates.
              </p>
            </div>
          )}
        </section>

        <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            ["French Open Today", "/french-open-today"],
            ["French Open Results", "/french-open-results"],
            ["French Open Draw", "/french-open-draw"],
            ["Live Stream Guide", "/french-open-live-stream"],
            ["Where to Watch", "/where-to-watch-french-open"],
            ["Streaming Countries", "/french-open-streaming-countries"],
          ].map(([title, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 hover:border-orange-500 transition-all"
            >
              <h3 className="text-xl font-black mb-3">
                {title}
              </h3>

              <p className="text-sm text-zinc-400">
                Roland Garros schedule, streams and match information.
              </p>
            </a>
          ))}
        </section>

        <section className="rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-8">
          <h2 className="text-3xl font-black mb-5">
            About the French Open order of play
          </h2>

          <div className="space-y-5 text-zinc-300 leading-8 max-w-4xl">
            <p>
              The French Open order of play shows which Roland Garros matches are
              scheduled across the tournament day. Start times can shift because
              of match length, court changes, weather delays and tournament
              scheduling decisions.
            </p>

            <p>
              Watch Tennis Today helps fans follow the Roland Garros schedule
              with live match pages, start times, scores, streaming guides and
              TV schedule links.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
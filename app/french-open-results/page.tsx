export const dynamic = "force-dynamic";

export const metadata = {
  title: "French Open Results 2026 | Roland Garros Scores Today",
  description:
    "French Open results for Roland Garros 2026. Find completed matches, live scores, today’s tennis results, schedules and streaming guides.",
};

export default async function FrenchOpenResultsPage() {
  const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const res = await fetch(`${baseUrl}/api/french-open-results`, {
  cache: "no-store",
});

let matches: any[] = [];

const contentType = res.headers.get("content-type") || "";

if (res.ok && contentType.includes("application/json")) {
  const data = await res.json();

  matches = Array.isArray(data?.results) ? data.results : [];
}



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
            🏆 RESULTS
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            French Open Results:
            <br />
            Roland Garros Scores
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-zinc-300 mb-8">
            Follow French Open results, completed Roland Garros matches, scores,
            match pages, schedules and streaming information.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#results"
              className="rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-black hover:bg-orange-400 transition-all"
            >
              View Results →
            </a>

            <a
              href="/french-open-live"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-orange-500 transition-all"
            >
              Live Matches
            </a>

            <a
              href="/french-open-today"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-orange-500 transition-all"
            >
              Today’s Schedule
            </a>
          </div>
        </section>

        <section id="results" className="mb-12">
          <h2 className="text-4xl font-black mb-6">
            ✅ French Open Completed Matches
          </h2>

          {matches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {matches.slice(0, 30).map((match: any) => (
                <a
                  key={match.id}
                  href={`/watch/${matchSlug(match)}`}
                  className="rounded-3xl border border-orange-500/40 bg-zinc-900 p-6 hover:border-orange-500 transition-all"
                >
                  <div className="flex justify-between gap-3 mb-4">
                    <span className="font-black text-green-400">
                      {match.status}
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

                  <p className="mb-3 text-zinc-300 font-bold">
                    Score: {match.score || "Score not available"}
                  </p>

                  <p className="text-sm text-zinc-500">
                    {match.tournament}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
              <p className="text-zinc-300 leading-8">
                No completed French Open matches are listed right now. Check
                back soon for Roland Garros results and scores.
              </p>
            </div>
          )}
        </section>

        <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            ["French Open Live", "/french-open-live"],
            ["French Open Today", "/french-open-today"],
            ["Order of Play", "/french-open-order-of-play"],
            ["French Open Draw", "/french-open-draw"],
            ["TV Schedule", "/french-open-tv-schedule"],
            ["Where to Watch", "/where-to-watch-french-open"],
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
                Follow Roland Garros matches, streams and tournament updates.
              </p>
            </a>
          ))}
        </section>

        <section className="rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-8">
          <h2 className="text-3xl font-black mb-5">
            About French Open results
          </h2>

          <div className="space-y-5 text-zinc-300 leading-8 max-w-4xl">
            <p>
              French Open results can update throughout the day as Roland Garros
              matches finish across different courts.
            </p>

            <p>
              Watch Tennis Today helps fans track completed matches, live
              matches, today’s schedule, streaming options and TV coverage for
              Roland Garros.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
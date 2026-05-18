export const metadata = {
  title: "French Open Draw 2026 | Roland Garros Bracket & Matches",
  description:
    "French Open draw for Roland Garros 2026. Follow tournament brackets, matchups, live matches, results, schedules and streaming guides.",
};

export default function FrenchOpenDrawPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <section className="mb-12 rounded-[2.5rem] border border-orange-500 bg-gradient-to-br from-orange-950/40 to-black p-8">
          <div className="mb-5 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-black">
            🧩 DRAW
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            French Open Draw:
            <br />
            Roland Garros Bracket
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-zinc-300 mb-8">
            Follow the French Open draw with Roland Garros matchups, bracket
            links, live matches, results, schedules and streaming information.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/french-open-live"
              className="rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-black hover:bg-orange-400 transition-all"
            >
              Live Matches →
            </a>

            <a
              href="/french-open-results"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-orange-500 transition-all"
            >
              Results
            </a>

            <a
              href="/french-open-order-of-play"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-orange-500 transition-all"
            >
              Order of Play
            </a>
          </div>
        </section>

        <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="text-4xl font-black mb-6">
            🎾 Roland Garros draw hub
          </h2>

          <p className="max-w-4xl text-zinc-300 leading-8 mb-6">
            Use this page as a French Open draw hub. Follow match pages,
            completed results, upcoming matches and daily Roland Garros schedule
            links as the tournament progresses.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              ["Men’s Singles", "/french-open-live"],
              ["Women’s Singles", "/french-open-live"],
              ["Today’s Matches", "/french-open-today"],
              ["Completed Results", "/french-open-results"],
            ].map(([title, href]) => (
              <a
                key={title}
                href={href}
                className="rounded-3xl border border-zinc-800 bg-black p-5 hover:border-orange-500 transition-all"
              >
                <p className="mb-2 text-xs uppercase tracking-widest text-orange-400">
                  Draw section
                </p>

                <h3 className="text-xl font-black">
                  {title}
                </h3>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            ["French Open Live", "/french-open-live"],
            ["French Open Today", "/french-open-today"],
            ["Order of Play", "/french-open-order-of-play"],
            ["French Open Results", "/french-open-results"],
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
                Roland Garros draw, matches, schedules and streaming guides.
              </p>
            </a>
          ))}
        </section>

        <section className="rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-8">
          <h2 className="text-3xl font-black mb-5">
            About the French Open draw
          </h2>

          <div className="space-y-5 text-zinc-300 leading-8 max-w-4xl">
            <p>
              The French Open draw shows the Roland Garros tournament path,
              including possible matchups, completed matches and upcoming rounds.
            </p>

            <p>
              Watch Tennis Today helps fans follow Roland Garros with live match
              pages, daily schedules, results, TV guides and streaming
              information.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
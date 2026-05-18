export const metadata = {
  title: "French Open TV Schedule 2026 | Roland Garros Channels Today",
  description:
    "French Open TV schedule for Roland Garros 2026. Find today’s tennis matches, TV channels, streaming guides and where to watch French Open coverage.",
};

export default function FrenchOpenTvSchedulePage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <section className="mb-12 rounded-[2.5rem] border border-orange-500 bg-gradient-to-br from-orange-950/40 to-black p-8">
          <div className="mb-5 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-black">
            📺 TV SCHEDULE
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            French Open TV Schedule
            <br />
            Roland Garros Today
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-zinc-300 mb-8">
            Find French Open TV schedule information, Roland Garros match times,
            live tennis coverage, channels and streaming guides for today.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/french-open-live"
              className="rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-black hover:bg-orange-400 transition-all"
            >
              Live Matches →
            </a>

            <a
              href="/where-to-watch-french-open"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-orange-500 transition-all"
            >
              Where to Watch
            </a>
          </div>
        </section>

        <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="text-4xl font-black mb-6">
            🎾 French Open coverage today
          </h2>

          <p className="text-zinc-300 leading-8 max-w-4xl mb-6">
            French Open TV coverage depends on your country and official
            broadcaster. Use this page as a Roland Garros TV schedule hub and
            check the live match pages for current match status, start time and
            streaming information.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ["Live matches", "/french-open-live"],
              ["Order of play", "/french-open-order-of-play"],
              ["French Open today", "/french-open-today"],
            ].map(([title, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-3xl border border-zinc-800 bg-black p-5 hover:border-orange-500 transition-all"
              >
                <h3 className="text-xl font-black">
                  {title}
                </h3>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-black mb-5">
            🌍 French Open TV channels by country
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              ["United States", "/watch-tennis-in/usa"],
              ["United Kingdom", "/watch-tennis-in/uk"],
              ["Poland", "/watch-tennis-in/poland"],
              ["Germany", "/watch-tennis-in/germany"],
              ["France", "/watch-tennis-in/france"],
              ["Spain", "/watch-tennis-in/spain"],
              ["Italy", "/watch-tennis-in/italy"],
              ["Australia", "/watch-tennis-in/australia"],
            ].map(([country, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 hover:border-orange-500 transition-all"
              >
                <p className="mb-2 text-xs uppercase tracking-widest text-orange-400">
                  Country guide
                </p>

                <h3 className="text-xl font-black">
                  {country}
                </h3>

                <p className="mt-3 text-sm text-zinc-400">
                  French Open TV and streaming options.
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-black mb-5">
            🔗 Roland Garros schedule links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ["French Open live stream", "/french-open-live-stream"],
              ["Watch French Open online", "/watch-french-open-online"],
              ["French Open results", "/french-open-results"],
              ["French Open draw", "/french-open-draw"],
              ["Streaming countries", "/french-open-streaming-countries"],
              ["Where to watch French Open", "/where-to-watch-french-open"],
            ].map(([title, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 hover:border-orange-500 transition-all"
              >
                <h3 className="text-xl font-black">
                  {title}
                </h3>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-8">
          <h2 className="text-3xl font-black mb-5">
            About the French Open TV schedule
          </h2>

          <div className="space-y-5 text-zinc-300 leading-8 max-w-4xl">
            <p>
              The French Open TV schedule can change during the tournament
              depending on court assignments, match duration, weather and local
              broadcast rights.
            </p>

            <p>
              Watch Tennis Today helps fans follow Roland Garros coverage with
              live match pages, TV schedule guides, streaming links and
              country-based tennis viewing information.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
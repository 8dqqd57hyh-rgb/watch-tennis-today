export const metadata = {
  title: "Compare Tennis Streaming Options | Watch Tennis Today",
  description:
    "Compare legal tennis streaming options, TV broadcasters, tournament coverage and country-specific viewing choices.",
  alternates: {
    canonical: "https://watchtennistoday.com/compare",
  },
};

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <h1 className="text-4xl md:text-5xl font-black mt-8">
          Compare Tennis Streaming Options
        </h1>

        <p className="text-zinc-300 mt-4 text-lg leading-relaxed">
          Tennis coverage depends on your country, tournament and subscription
          access. This guide helps compare the most common legal ways to watch
          tennis online and on TV.
        </p>

        <section className="mt-10 overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-900">
              <tr>
                <th className="p-4">Option</th>
                <th className="p-4">Best for</th>
                <th className="p-4">Limitations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              <tr>
                <td className="p-4 font-semibold text-white">TV broadcasters</td>
                <td className="p-4">Grand Slams and major tournaments</td>
                <td className="p-4">Rights vary by country</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">
                  Official streaming services
                </td>
                <td className="p-4">Watching without cable</td>
                <td className="p-4">May require paid subscription</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">Tournament apps</td>
                <td className="p-4">Scores, draws and schedules</td>
                <td className="p-4">Usually not full live video coverage</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">Highlights</td>
                <td className="p-4">Catching up after matches</td>
                <td className="p-4">Not a replacement for live coverage</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="mt-12 space-y-5 text-zinc-300 leading-relaxed">
          <h2 className="text-3xl font-bold text-white">
            How to choose the best option
          </h2>

          <p>
            Start with the tournament you want to watch. Grand Slam events,
            ATP tournaments and WTA tournaments may be shown by different
            broadcasters even in the same country.
          </p>

          <p>
            Then check whether you need live coverage, full replays, highlights
            or only scores. Some platforms are useful for live video, while
            others are better for schedules and match results.
          </p>

          <h2 className="text-3xl font-bold text-white">
            Why legal streams are safer
          </h2>

          <p>
            Unofficial streaming sites often have unreliable video quality,
            misleading pop-ups and unsafe redirects. Official broadcasters are
            more stable and usually provide better commentary, replays and
            tournament coverage.
          </p>

          <h2 className="text-3xl font-bold text-white">
            Useful next pages
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/how-to-watch-tennis-legally"
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 hover:border-zinc-600"
            >
              How to watch legally
            </a>
            <a
              href="/tv-schedule"
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 hover:border-zinc-600"
            >
              Tennis TV schedule
            </a>
            <a
              href="/live-tennis"
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 hover:border-zinc-600"
            >
              Live tennis today
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
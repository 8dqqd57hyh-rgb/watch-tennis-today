import { affiliateLinks } from "@/lib/affiliate";

export const metadata = {
  title: "French Open Today 2026 | Roland Garros Matches, Schedule & Streams",
  description:
    "French Open today: find Roland Garros matches, live scores, start times, TV schedule, streaming options and today’s tennis coverage.",
};

export default async function FrenchOpenTodayPage() {
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
            🎾 TODAY AT ROLAND GARROS
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            French Open Today:
            <br />
            Matches, Schedule & Streams
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-zinc-300 mb-8">
            Follow French Open matches today with Roland Garros live scores,
            start times, match pages, TV schedule and streaming information.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#today-matches"
              className="rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-black hover:bg-orange-400 transition-all"
            >
              Today’s Matches →
            </a>

            <a
              href="/french-open-tv-schedule"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-orange-500 transition-all"
            >
              TV Schedule
            </a>

            <a
              href="/french-open-live-stream"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-orange-500 transition-all"
            >
              Live Stream Guide
            </a>
          </div>
        </section>

        <section id="today-matches" className="mb-12">
          <h2 className="text-4xl font-black mb-6">
            🔴 French Open Matches Today
          </h2>

          {frenchOpenMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {frenchOpenMatches.slice(0, 24).map((match: any) => (
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
                No French Open matches are listed right now. Check back soon for
                today’s Roland Garros schedule, scores and streaming updates.
              </p>
            </div>
          )}
        </section>

        <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            ["Order of Play", "/french-open-order-of-play"],
            ["Results", "/french-open-results"],
            ["Draw", "/french-open-draw"],
            ["Where to Watch", "/where-to-watch-french-open"],
            ["TV Schedule", "/french-open-tv-schedule"],
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
                Follow Roland Garros matches, streams and tournament updates.
              </p>
            </a>
          ))}
        </section>

        <section className="mb-12 rounded-[2rem] border border-green-500/40 bg-zinc-900 p-8">
          <h2 className="text-3xl font-black mb-5">
            🌍 Watching French Open today abroad?
          </h2>

          <p className="max-w-3xl text-zinc-300 leading-8 mb-6">
            French Open streaming availability can depend on your country. If
            you are traveling, a VPN can help you access your usual tennis
            streaming service more securely.
          </p>

          <a
            href={affiliateLinks.nordvpn}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-flex rounded-2xl bg-green-500 px-6 py-4 font-black text-black hover:bg-green-400 transition-all"
          >
            Try NordVPN →
          </a>

          <p className="mt-4 text-sm text-zinc-500">
            Affiliate disclosure: we may earn a commission from links on this page.
          </p>
        </section>

        <section className="rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-8">
          <h2 className="text-3xl font-black mb-5">
            About French Open today
          </h2>

          <div className="space-y-5 text-zinc-300 leading-8 max-w-4xl">
            <p>
              French Open match schedules can change during the day because of
              match length, court assignments, weather and tournament decisions.
            </p>

            <p>
              Watch Tennis Today helps tennis fans follow today’s Roland Garros
              matches with live match pages, start times, scores, TV schedule
              links and streaming information.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
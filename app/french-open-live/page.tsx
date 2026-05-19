import { affiliateLinks } from "@/app/lib/affiliateLinks";
import VpnPromo from "@/app/components/VpnPromo";

export const metadata = {
  title: "French Open Live 2026 | Watch Roland Garros Matches Today",
  description:
    "Follow French Open live matches today. Find Roland Garros live streams, TV channels, schedules, scores and official ways to watch tennis online.",
};

export default async function FrenchOpenLivePage() {
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

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/,/g, "")
      .replace(/\//g, "-")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
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
            🎾 FRENCH OPEN LIVE
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            French Open Live:
            <br />
            Roland Garros Matches Today
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-zinc-300 mb-8">
            Follow French Open live matches, Roland Garros schedules, TV
            channels, streaming options, scores and today’s Grand Slam tennis
            coverage.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#matches"
              className="rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-black hover:bg-orange-400 transition-all"
            >
              View Matches →
            </a>

            <a
              href="/french-open-tv-schedule"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-orange-500 transition-all"
            >
              TV Schedule
            </a>

            <a
              href="/where-to-watch-french-open"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-orange-500 transition-all"
            >
              Where to Watch
            </a>
          </div>
        </section>

        <section id="matches" className="mb-12">
          <h2 className="text-4xl font-black mb-6">
            🔴 French Open Matches Today
          </h2>

          {frenchOpenMatches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {frenchOpenMatches.slice(0, 18).map((match: any) => (
                <a
                  key={match.id}
                  href={`/watch/${matchSlug(match)}`}
                  className="rounded-3xl border border-orange-500/40 bg-zinc-900 p-6 hover:border-orange-500 transition-all"
                >
                  <div className="flex justify-between gap-3 mb-4">
                    <span className="font-black text-orange-400">
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
                live Roland Garros matches, schedules and streaming updates.
              </p>
            </div>
          )}
        </section>

        <section className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            ["French Open Live Stream", "/french-open-live-stream"],
            ["French Open Today", "/french-open-today"],
            ["French Open Order of Play", "/french-open-order-of-play"],
            ["French Open Results", "/french-open-results"],
            ["French Open Draw", "/french-open-draw"],
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
                Roland Garros schedules, streams, TV info and match updates.
              </p>
            </a>
          ))}
        </section>

        <VpnPromo
          title="Watching French Open while traveling?"
          text="Some French Open streams are geo-restricted. A VPN can help you safely access your streaming subscriptions while abroad."
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "French Open Live",
              url: "https://watchtennistoday.com/french-open-live",
              description:
                "French Open live matches, Roland Garros schedules, TV channels and streaming options.",
            }),
          }}
        />
      </div>
    </main>
  );
}

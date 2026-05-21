import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { players, type PlayerSlug } from "@/data/players";
import VpnPromo from "@/app/components/VpnPromo";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import type { Metadata } from "next";
import { matchContainsExactPlayer } from "@/data/playerSlugs";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score?: string;
  startTime?: string | null;
};

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) return "http://localhost:3000";

  const protocol = host.includes("localhost") ? "http" : "https";

  return `${protocol}://${host}`;
}

async function getMatches(): Promise<Match[]> {
  const baseUrl = await getBaseUrl();

  const response = await fetch(`${baseUrl}/api/matches`, {
    cache: "no-store",
  });

  if (!response.ok) return [];

  const data = await response.json();

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.matches)) return data.matches;

  return [];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getMatchSlug(match: Match) {
  return `${slugify(match.player1)}-vs-${slugify(match.player2)}-${match.id}`;
}

function isLive(match: Match) {
  return match.status.toUpperCase() === "LIVE";
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const player = players[slug as PlayerSlug];

  if (!player) {
    return {
      title: "Player Not Found | Watch Tennis Today",
    };
  }

  return {
    title: `Watch ${player.name} Live Tennis Matches | TV Channels & Streaming`,
    description: `Watch ${player.name} live tennis matches today. Find ${player.tour} schedules, TV broadcasters, streaming platforms and live tennis coverage.`,
    alternates: {
      canonical: `https://watchtennistoday.com/watch-player-live/${slug}`,
    },
  };
}

export default async function WatchPlayerLivePage({ params }: Props) {
  const { slug } = await params;
  const player = players[slug as PlayerSlug];

  if (!player) {
    notFound();
  }

  const matches = await getMatches();

  // use exact matching helper to find matches for this player slug

  const liveMatches = matches.filter(isLive);
  const upcomingMatches = matches.filter(
    (m) => !isLive(m) && new Date(m.startTime || 0) > new Date()
  );
  const completedMatches = matches.filter(
    (m) => !isLive(m) && new Date(m.startTime || 0) <= new Date()
  );

  const topMatches = [
    ...liveMatches,
    ...upcomingMatches,
    ...completedMatches,
  ].slice(0, 12);

  // example usage: filter matches for this player slug
  const playerMatches = matches.filter((m) =>
    matchContainsExactPlayer(m, slug)
  );

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <h1 className="text-5xl font-black mt-8 mb-6">
          🎾 Watch {player.name} Live Tennis Matches
        </h1>

        <p className="text-zinc-300 text-lg leading-8 mb-10">
  Follow {player.name} matches, tournament appearances, live tennis schedules
  and official viewing information for major {player.tour} events and Grand
  Slam tournaments.
</p>
        <section className="mb-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-300 leading-8">
  <h2 className="text-3xl font-black text-white mb-4">
    Why Watch {player.name} Live?
  </h2>

  {"bio" in player ? (
  <p className="mb-4">{player.bio}</p>
) : (
  <p className="mb-4">
    {player.name} is featured on Watch Tennis Today with match schedules,
    tournament information and legal tennis viewing guidance.
  </p>
)}

  {"playStyle" in player ? (
  <p className="mb-4">{player.playStyle}</p>
) : (
  <p className="mb-4">
    This page helps fans track {player.name} matches across {player.tour}
    events, including live matches, upcoming schedules and official viewing
    options.
  </p>
)}

  {"surfaceStrength" in player ? (
  <p className="mb-4">
    <strong className="text-white">Best surfaces:</strong>{" "}
    {player.surfaceStrength}
  </p>
) : (
  <p className="mb-4">
    <strong className="text-white">Coverage focus:</strong>{" "}
    live matches, tournament schedules and legal streaming availability.
  </p>
)}

  {"watchReasons" in player ? (
  <ul className="list-disc pl-6 space-y-2">
    {player.watchReasons.map((reason) => (
      <li key={reason}>{reason}</li>
    ))}
  </ul>
) : (
  <ul className="list-disc pl-6 space-y-2">
    <li>Follow live and upcoming matches</li>
    <li>Check official broadcaster information</li>
    <li>Find tournament and schedule updates</li>
  </ul>
)}
</section>
        <div className="mb-8 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-100">
  <strong>Legal streaming notice:</strong> Watch Tennis Today does not host,
  embed, or provide unauthorized live streams. We only provide information
  about official broadcasters and legal streaming platforms available in
  your region.
</div>

    
<a
  href={`/next-match/${slug}`}
  className="mb-8 inline-block rounded-2xl border border-green-500 px-6 py-4 font-black text-green-400 hover:bg-green-500 hover:text-black transition-all"
>
  See {player.name} Next Match →
</a>
<a
  href={`/tv-schedule/${slug}`}
  className="mb-8 inline-block rounded-2xl border border-zinc-700 px-6 py-4 font-black text-white hover:border-green-500 hover:text-green-400 transition-all"
>
  See {player.name} TV Schedule →
</a>
        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="bg-red-500 text-white text-sm font-black px-4 py-2 rounded-full animate-pulse">
              🔴 LIVE
            </span>

            <h2 className="text-3xl font-black">
              {player.name} Matches Today
            </h2>
          </div>

          {playerMatches.length > 0 ? (
            <div className="grid gap-4">
              {playerMatches.map((match) => (
                <a
                  key={match.id}
                  href={`/watch/${getMatchSlug(match)}`}
                  className="bg-black border border-zinc-800 rounded-2xl p-5 hover:border-green-500 transition-all"
                >
                  <div className="flex flex-wrap justify-between gap-3 mb-4">
                    <span className="text-zinc-400">
                      {match.tournament}
                    </span>

                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full ${
                        isLive(match)
                          ? "bg-red-500 text-white"
                          : "bg-zinc-700 text-white"
                      }`}
                    >
                      {match.status}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black mb-2">
                    {match.player1}
                    <br />
                    vs
                    <br />
                    {match.player2}
                  </h3>

                  <p className="text-zinc-500">
                    {match.category}
                    {match.score ? ` · ${match.score}` : ""}
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-zinc-400">
              No live or upcoming matches found for {player.name} right now.
              Check back later for updated tennis schedule and streaming
              information.
            </p>
          )}

          <a
            href="/live-tennis"
            className="inline-block mt-6 bg-green-500 text-black px-5 py-3 rounded-2xl font-black hover:bg-green-400 transition-all"
          >
            View All Live Tennis
          </a>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-4">
            Where to Watch {player.name}
          </h2>

          <p className="text-zinc-300 leading-8 mb-6">
  Broadcasting rights for {player.name} matches depend on the tournament,
  country, and tour level. Grand Slam events are usually shown on major
  sports networks such as Eurosport, ESPN, TNT Sports, beIN Sports, and
  Tennis Channel, while ATP and WTA events may vary by region.
</p>
<p className="text-zinc-400 leading-8 mb-8">
  Availability may change depending on your location and subscription
  provider. Always use official broadcasters and licensed streaming
  services in your country.
</p>

          <div className="flex flex-wrap gap-3">
            <a
              href="/watch-tennis-in/usa"
              className="bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
            >
              Watch in USA
            </a>

            <a
              href="/watch-tennis-in/uk"
              className="bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
            >
              Watch in UK
            </a>

            <a
              href="/watch-tennis-in/poland"
              className="bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
            >
              Watch in Poland
            </a>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-4">
            Tournaments Featuring {player.name}
          </h2>

          <div className="space-y-4 text-zinc-300 leading-8">
            {player.tournaments.map((tournament) => (
              <p key={tournament}>{tournament}</p>
            ))}
          </div>
        </section>
<RelatedMoneyLinks playerName={player.name} />
        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-4">
            Live Tennis Coverage
          </h2>

          <p className="text-zinc-400 leading-8 mb-6">
            Check live tennis schedules, {player.tour} match coverage and
            upcoming {player.name} matches through official broadcasters and
            official viewing platforms.
          </p>

          <a
            href="/live-tennis"
            className="inline-block bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
          >
            View Live Tennis
          </a>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-3">
                Where can I watch {player.name} live?
              </h3>

              <p className="text-zinc-400 leading-7">
                {player.name} matches are available through official sports
                broadcasters and tennis streaming services depending on your
                region.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3">
                Can I stream {player.tour} tennis online?
              </h3>

              <p className="text-zinc-400 leading-7">
                Yes. {player.tour} tennis is available through legal sports
                streaming services and TV broadcasters in many countries.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3">
                Does Watch Tennis Today stream matches?
              </h3>

              <p className="text-zinc-400 leading-7">
                No. Watch Tennis Today does not host or stream matches. The
                website helps users find legal tennis schedules and viewing
                options.
              </p>
            </div>
          </div>
        </section>
        <VpnPromo
  title={`Watching ${player.name} while traveling?`}
  text={`${player.name} matches may have different broadcaster availability depending on your region and travel location. A VPN can help improve privacy and connection security while using public Wi-Fi or accessing your usual sports services abroad.`}
/>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: `Where can I watch ${player.name} live?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `${player.name} matches are available through official tennis coverage and regional broadcaster listings`,
                  },
                },
                {
                  "@type": "Question",
                  name: `Can I stream ${player.tour} tennis online?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `${player.tour} tennis is available through official sports coverage and regional TV availability`,
                  },
                },
              ],
            }),
          }}
        />
      </div>
    </main>
  );
}
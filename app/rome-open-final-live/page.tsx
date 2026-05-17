import AdSlot from "@/app/components/AdSlot";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import { affiliateLinks } from "@/lib/affiliate";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "🔴 Rome Open Final Live Stream, Score & TV Schedule",
  description:
    "Watch the Rome Open final live. Find live score updates, TV channels, streaming options, match time and tennis viewing guides.",
  alternates: {
    canonical: "https://watchtennistoday.com/rome-open-final-live",
  },
};

type WatchProvider = {
  name: string;
  url: string;
  accessType?: string;
  verificationStatus?: string;
  note?: string;
};

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score: string;
  startTime: string | null;
  watchProviders: WatchProvider[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function matchSlug(match: Match) {
  return `${slugify(match.player1)}-vs-${slugify(match.player2)}-${match.id}`;
}

function formatDateTime(value: string | null) {
  if (!value) return "Time to be confirmed";

  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

async function getRomeOpenFinalMatch(): Promise<Match | null> {
  try {
    const response = await fetch("https://watchtennistoday.com/api/matches", {
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = await response.json();

    const matches: Match[] = Array.isArray(data)
      ? data
      : Array.isArray(data.matches)
        ? data.matches
        : [];

    return (
      matches.find((match) => {
        const tournament = match.tournament.toLowerCase();
        const category = match.category.toUpperCase();

        return (
          category === "ATP" &&
          (tournament.includes("rome") ||
            tournament.includes("italian") ||
            tournament.includes("internazionali"))
        );
      }) || null
    );
  } catch {
    return null;
  }
}

export default async function RomeOpenFinalLivePage() {
  const finalMatch = await getRomeOpenFinalMatch();

  const matchTitle = finalMatch
    ? `${finalMatch.player1} vs ${finalMatch.player2}`
    : "Rome Open Final";

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mx-auto max-w-5xl">
        <section className="mb-10 rounded-[2.5rem] border border-red-500 bg-gradient-to-br from-zinc-900 to-black p-8">
          <div className="mb-5 inline-flex rounded-full bg-red-500 px-4 py-2 text-sm font-black text-white animate-pulse">
            🔴 LIVE NOW
          </div>

          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            {matchTitle} Live Stream, Score & TV Schedule
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-zinc-300">
            Follow the Rome Open final live with match updates, official TV
            channels, streaming options and tennis viewing guides for ATP fans.
          </p>

          {finalMatch ? (
            <div className="mt-8 rounded-[2rem] border border-red-500/40 bg-black/40 p-6">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-black text-white">
                  {finalMatch.status}
                </span>

                <span className="text-zinc-400">{finalMatch.category}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400">{finalMatch.tournament}</span>
              </div>

              <h2 className="text-3xl font-black md:text-4xl">
                {finalMatch.player1} vs {finalMatch.player2}
              </h2>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="mb-1 text-sm text-zinc-500">Status</p>
                  <p className="font-black text-red-400">
                    {finalMatch.status}
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="mb-1 text-sm text-zinc-500">Score</p>
                  <p className="font-black">{finalMatch.score || "-"}</p>
                </div>

                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="mb-1 text-sm text-zinc-500">Start time</p>
                  <p className="font-black">
                    {formatDateTime(finalMatch.startTime)}
                  </p>
                </div>
              </div>

              <a
                href={`/watch/${matchSlug(finalMatch)}`}
                className="mt-6 inline-flex rounded-2xl bg-red-500 px-6 py-4 text-lg font-black text-white hover:bg-red-400"
              >
                Open Match Page →
              </a>
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="mb-3 text-2xl font-black">
                Rome Open final data is being checked
              </h2>

              <p className="text-zinc-400">
                Use the live tennis schedule for current Rome Open match status,
                scores and updated match pages.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/live-tennis"
              className="rounded-2xl bg-red-500 px-6 py-4 text-lg font-black text-white hover:bg-red-400"
            >
              Check Live Tennis →
            </a>

            <a
              href="/watch"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-green-500 hover:text-green-400"
            >
              Where to Watch
            </a>
          </div>

          <p className="mt-6 text-sm text-zinc-500">
            Last updated:{" "}
            {new Date().toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </section>

        <AdSlot label="Advertisement" />

        <section className="mt-10 rounded-[2rem] border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="mb-5 text-3xl font-black">
            📺 Where to Watch {matchTitle}
          </h2>

          <p className="mb-6 leading-8 text-zinc-300">
            Rome Open final coverage depends on your country and broadcaster.
            Tennis fans can check official tournament partners, ATP
            broadcasters, Tennis TV, sports channels and local streaming
            platforms for live coverage.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/watch-tennis-in/usa"
              className="rounded-2xl border border-zinc-800 bg-black p-5 font-bold hover:border-green-500 hover:text-green-400"
            >
              Watch in USA
            </a>

            <a
              href="/watch-tennis-in/uk"
              className="rounded-2xl border border-zinc-800 bg-black p-5 font-bold hover:border-green-500 hover:text-green-400"
            >
              Watch in UK
            </a>

            <a
              href="/watch-tennis-in/poland"
              className="rounded-2xl border border-zinc-800 bg-black p-5 font-bold hover:border-green-500 hover:text-green-400"
            >
              Watch in Poland
            </a>
          </div>

          {finalMatch?.watchProviders?.length ? (
            <div className="mt-8">
              <h3 className="mb-4 text-2xl font-black">
                Official watch options
              </h3>

              <div className="space-y-4">
                {finalMatch.watchProviders.map((provider) => (
                  <a
                    key={`${provider.name}-${provider.url}`}
                    href={provider.url}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="block rounded-2xl bg-green-500 px-5 py-4 font-black text-black hover:bg-green-400"
                  >
                    {provider.name}

                    {provider.note ? (
                      <span className="mt-1 block text-sm font-semibold opacity-80">
                        {provider.note}
                      </span>
                    ) : null}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="mt-10 rounded-[2rem] border border-green-500/30 bg-green-500/10 p-8">
          <p className="mb-2 text-xs font-black uppercase tracking-widest text-green-400">
            Streaming tip
          </p>

          <h2 className="mb-4 text-3xl font-black">
            Watching {matchTitle} while traveling?
          </h2>

          <p className="mb-6 leading-8 text-zinc-300">
            Tennis streaming availability can vary by region. If you are abroad,
            a VPN can help keep your connection private while checking your
            usual tennis streaming services.
          </p>

          <a
            href={affiliateLinks.nordvpn}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-flex rounded-2xl bg-green-500 px-6 py-4 font-black text-black hover:bg-green-400"
          >
            Try NordVPN for tennis streaming
          </a>

          <p className="mt-5 text-sm text-zinc-500">
            Affiliate disclosure: we may earn a commission if you purchase
            through links on this page.
          </p>
        </section>

        <section className="mt-10 rounded-[2rem] border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="mb-5 text-3xl font-black">
            🎾 Rome Open Final Live Updates
          </h2>

          <div className="space-y-5 leading-8 text-zinc-300">
            <p>
              {matchTitle} is part of the Rome Open, one of the biggest
              clay-court tournaments before Roland Garros. Fans are looking for
              live score updates, match timing, TV channels and official
              streaming options.
            </p>

            <p>
              Use this page as a quick hub for Rome Open final viewing options,
              live tennis links and country-based tennis broadcaster guides.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="mb-5 text-3xl font-black">
            ❓ Rome Open Final FAQ
          </h2>

          <div className="space-y-4">
            <div className="rounded-3xl border border-zinc-800 bg-black p-6">
              <h3 className="mb-2 text-xl font-black">
                Where can I watch {matchTitle} live?
              </h3>
              <p className="text-zinc-400">
                Check official broadcasters, Tennis TV, sports streaming
                platforms and local country-based viewing guides.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-black p-6">
              <h3 className="mb-2 text-xl font-black">
                Is {matchTitle} live now?
              </h3>
              <p className="text-zinc-400">
                Check the live tennis schedule for current match status, scores
                and updated match pages.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-black p-6">
              <h3 className="mb-2 text-xl font-black">
                Can I watch {matchTitle} online?
              </h3>
              <p className="text-zinc-400">
                Online availability depends on your country, broadcaster rights
                and official streaming services.
              </p>
            </div>
          </div>
        </section>

        <RelatedMoneyLinks playerName={finalMatch?.player1} />

        <AdSlot label="Advertisement" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: `Where can I watch ${matchTitle} live?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "You can check official broadcasters, Tennis TV, sports streaming platforms and local country-based viewing guides.",
                  },
                },
                {
                  "@type": "Question",
                  name: `Is ${matchTitle} live now?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Check the live tennis schedule for current match status, scores and updated match pages.",
                  },
                },
                {
                  "@type": "Question",
                  name: `Can I watch ${matchTitle} online?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Online availability depends on your country, broadcaster rights and official streaming services.",
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
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import AdSlot from "@/app/components/AdSlot";
import { playerUrl } from "@/data/playerSlugs";
import { affiliateLinks } from "@/lib/affiliate";
import AuthorBox from "@/app/components/AuthorBox";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";


export const dynamic = "force-dynamic";

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

function getMatchIdFromSlug(slug: string) {
  return slug.match(/(\d+)$/)?.[1] ?? null;
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

function formatDateTime(value: string | null) {
  if (!value) return "Time to be confirmed";

  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function isLive(status: string) {
  return status.toUpperCase() === "LIVE";
}

function isFinished(status: string) {
  return ["FINISHED", "CANCELLED", "RETIRED"].includes(status.toUpperCase());
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const decodedSlug = decodeURIComponent(slug);

  const matchId = getMatchIdFromSlug(decodedSlug);

  const readableTitle = decodedSlug
    .replace(/-\d+$/, "")
    .replace(/-/g, " ");

  const matches = await getMatches();

  const match = matches.find(
    (item) => String(item.id) === matchId
  );

  const isLiveMatch =
    match?.status?.toUpperCase() === "LIVE";

  return {
    title: isLiveMatch
      ? `🔴 LIVE: ${readableTitle} — Score, Stream & TV Schedule | Watch Tennis Today`
      : `${readableTitle} Live Stream & TV Schedule | Watch Tennis Today`,

    description: isLiveMatch
      ? `Watch ${readableTitle} live now. Follow live score updates, official tennis streams, TV schedule and tournament coverage.`
      : "Find where to watch this tennis match live, including official streaming options, TV schedule, match time, tournament details and live score updates.",

    alternates: {
      canonical: `https://watchtennistoday.com/watch/${slug}`,
    },

    openGraph: {
      title: isLiveMatch
        ? `🔴 LIVE: ${readableTitle}`
        : `${readableTitle} Live Stream`,

      description: isLiveMatch
        ? `Live tennis score updates, streams and TV schedule.`
        : "Official tennis streaming and TV schedule information.",

      url: `https://watchtennistoday.com/watch/${slug}`,

      siteName: "Watch Tennis Today",

      type: "website",
    },

    twitter: {
      card: "summary_large_image",

      title: isLiveMatch
        ? `🔴 LIVE: ${readableTitle}`
        : `${readableTitle} Live Stream`,

      description: isLiveMatch
        ? `Live tennis score updates and streaming info.`
        : "Official tennis streaming and TV schedule information.",
    },
  };
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const matchId = getMatchIdFromSlug(decodedSlug);
  if (!matchId) notFound();

  const matches = await getMatches();

 const match = matches.find((item) => String(item.id) === matchId);

if (!match) {
  redirect("/live-tennis");
}

  const tournamentSlug = slugify(match.tournament);
  const currentUrl = `https://watchtennistoday.com/watch/${slug}`;
  const matchTitle = `${match.player1} vs ${match.player2}`;

  const relatedMatches = matches
    .filter((item) => item.id !== match.id && !isFinished(item.status))
    .slice(0, 6);

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: matchTitle,
    sport: "Tennis",
    startDate: match.startTime,
    eventStatus: isLive(match.status)
      ? "https://schema.org/EventInProgress"
      : "https://schema.org/EventScheduled",
    competitor: [
      {
        "@type": "Person",
        name: match.player1,
      },
      {
        "@type": "Person",
        name: match.player2,
      },
    ],
    location: {
      "@type": "Place",
      name: match.tournament,
    },
    url: currentUrl,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Where can I watch ${matchTitle} live?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            match.watchProviders.length > 0
              ? `${matchTitle} can be checked through official tennis streaming and broadcaster sources such as ${match.watchProviders
                  .map((provider) => provider.name)
                  .join(", ")}.`
              : `Official streaming information for ${matchTitle} may depend on your country and broadcaster availability.`,
        },
      },
      {
        "@type": "Question",
        name: `What time does ${matchTitle} start?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${matchTitle} is scheduled for ${formatDateTime(
            match.startTime
          )}.`,
        },
      },
      {
        "@type": "Question",
        name: `What tournament is ${matchTitle} part of?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${matchTitle} is listed as part of ${match.tournament}.`,
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <nav className="text-sm text-zinc-400 mb-8">
          <a href="/" className="hover:text-white">
            Home
          </a>{" "}
          /{" "}
          <a href="/watch" className="hover:text-white">
            Watch
          </a>{" "}
          /{" "}
          <a href={`/tournament/${tournamentSlug}`} className="hover:text-white">
            {match.tournament}
          </a>
        </nav>

        <article className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className={`font-black px-4 py-2 rounded-full text-sm ${
                isLive(match.status)
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-green-500 text-black"
              }`}
            >
              {match.status}
            </span>

            <span className="text-zinc-400">{match.category}</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">{match.tournament}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">
            <a href={playerUrl(match.player1)} className="hover:text-green-400">
              {match.player1}
            </a>
            <br />
            vs
            <br />
            <a href={playerUrl(match.player2)} className="hover:text-green-400">
              {match.player2}
            </a>
          </h1>

          <p className="text-xl text-zinc-300 mb-10">
            Where to watch {matchTitle} live, including official streaming
            options, TV schedule, match time and live score updates.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-10">
  <div className="inline-flex items-center rounded-full bg-red-500/20 px-4 py-2 text-sm font-bold text-red-400">
    🔴 Live tennis updates
  </div>

  <p className="text-zinc-500 text-sm">
    Last updated:{" "}
    {new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    })}
  </p>
</div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div>
              <p className="text-zinc-500 text-sm mb-2">Tournament</p>
              <p className="text-xl font-bold">{match.tournament}</p>
            </div>

            <div>
              <p className="text-zinc-500 text-sm mb-2">Score</p>
              <p className="text-xl font-bold">{match.score || "-"}</p>
            </div>

            <div>
              <p className="text-zinc-500 text-sm mb-2">Start Time</p>
              <p className="text-xl font-bold">
                {formatDateTime(match.startTime)}
              </p>
            </div>
          </div>

          <AdSlot />

          <section className="mt-14">
            <h2 className="text-3xl font-black mb-5">
              📺 Where to Watch {matchTitle}
            </h2>

            {match.watchProviders.length > 0 ? (
              <div className="space-y-4">
                {match.watchProviders.map((provider) => (
                  <a
                    key={`${provider.name}-${provider.url}`}
                    href={provider.url}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="block bg-green-500 text-black rounded-2xl px-5 py-4 font-black hover:bg-green-400 transition-all"
                  >
                    {provider.name}
                    {provider.note ? (
                      <span className="block text-sm font-semibold mt-1 opacity-80">
                        {provider.note}
                      </span>
                    ) : null}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-zinc-400">
                No trusted watch source found yet. Check official tournament,
                ATP, WTA or local broadcaster listings.
              </p>
            )}
          </section>

          <section className="mt-8 rounded-[2rem] border border-green-500/30 bg-green-500/10 p-6">
  <p className="mb-2 text-xs font-black uppercase tracking-widest text-green-400">
    Streaming tip
  </p>

  <h2 className="mb-3 text-2xl font-black">
    Can’t access the tennis stream?
  </h2>

  <p className="mb-5 text-zinc-300 leading-7">
    Tennis streaming availability depends on your location. If you are traveling,
    check your usual streaming services securely with a VPN.
  </p>

  <a
    href={affiliateLinks.nordvpn}
    target="_blank"
    rel="nofollow sponsored noopener noreferrer"
    className="inline-flex rounded-2xl bg-green-500 px-6 py-4 font-black text-black hover:bg-green-400 transition-all"
  >
    Try NordVPN for tennis streaming
  </a>
</section>

          <section className="mt-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
  <div className="max-w-3xl">
    <div className="inline-flex items-center rounded-full bg-green-500/20 px-4 py-2 text-sm font-bold text-green-400 mb-5">
      🌍 Tennis streaming tip
    </div>

    <h2 className="text-3xl font-black mb-5">
      Watching tennis while traveling?
    </h2>

    <p className="text-zinc-300 leading-8 mb-6">
      Tennis broadcasters and streaming services may differ depending on your
      country. If you travel often during ATP, WTA or Grand Slam tournaments,
      NordVPN can help keep your connection private while watching tennis on
      hotel or public Wi-Fi.
    </p>

    <div className="flex flex-wrap gap-4 mb-8">
      <a
        href={affiliateLinks.nordvpn}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        className="inline-block rounded-2xl bg-green-500 px-6 py-4 font-black text-black hover:bg-green-400 transition-all"
      >
        Try NordVPN
      </a>

      <a
        href="/how-to-watch-tennis-safely-abroad"
        className="inline-block rounded-2xl border border-zinc-700 px-6 py-4 font-bold hover:border-green-500 hover:text-green-400 transition-all"
      >
        Tennis Streaming Safety Guide
      </a>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <a
        href="/watch-tennis-in/usa"
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-bold hover:border-green-500 transition-all"
      >
        Watch in USA
      </a>

      <a
        href="/watch-tennis-in/uk"
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-bold hover:border-green-500 transition-all"
      >
        Watch in UK
      </a>

      <a
        href="/watch-tennis-in/poland"
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-bold hover:border-green-500 transition-all"
      >
        Watch in Poland
      </a>
    </div>

    <p className="mt-5 text-sm text-zinc-500">
      Affiliate disclosure: we may earn a commission if you purchase through
      links on this page.
    </p>
  </div>
</section>

          <section className="mt-16 text-zinc-300 space-y-6">
            <h2 className="text-3xl font-black">
              Watch {matchTitle} Live Stream and TV Schedule
            </h2>

            <p>
              {match.player1} faces {match.player2} at {match.tournament}. This{" "}
              {match.category} tennis match is listed for{" "}
              {formatDateTime(match.startTime)}.
            </p>

            <p>
              Watch Tennis Today helps tennis fans find official streaming
              platforms, TV broadcasters and schedule information for ATP, WTA,
              Grand Slam, Challenger and ITF matches.
            </p>
          </section>

          <section className="mt-16 bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
            <h2 className="text-3xl font-black mb-4">🔔 Get Match Alerts</h2>

            <p className="text-zinc-400 mb-6">
              Get notified before {matchTitle} starts, including live stream
              updates and tennis schedule alerts.
            </p>

            <form
              action="https://formspree.io/f/xeenwwbk"
              method="POST"
              className="flex flex-col md:flex-row gap-4"
            >
                <input
  type="hidden"
  name="_redirect"
  value="https://watchtennistoday.com/newsletter-confirmation"
/>
              <input
                type="email"
                name="email"
                required
                placeholder="Your email"
                className="flex-1 bg-black border border-zinc-700 rounded-2xl px-5 py-4 text-white"
              />

              <input type="hidden" name="match" value={matchTitle} />
              <input type="hidden" name="source" value="match-page" />

              <button
                type="submit"
                className="bg-green-500 text-black px-6 py-4 rounded-2xl font-black hover:bg-green-400 transition-all"
              >
                Notify Me
              </button>
            </form>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-black mb-6">FAQ</h2>

            <div className="space-y-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
                <h3 className="text-xl font-black mb-2">
                  Where can I watch {matchTitle} live?
                </h3>
                <p className="text-zinc-400">
                  You can check the official watch options listed above. Some
                  streams and broadcasters may depend on your country.
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
                <h3 className="text-xl font-black mb-2">
                  What time does {matchTitle} start?
                </h3>
                <p className="text-zinc-400">
                  The match is scheduled for {formatDateTime(match.startTime)}.
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
                <h3 className="text-xl font-black mb-2">
                  What tournament is this match from?
                </h3>
                <p className="text-zinc-400">
                  This match is listed under {match.tournament}.
                </p>
              </div>
            </div>
          </section>

          {relatedMatches.length > 0 ? (
            <section className="mt-16">
              <h2 className="text-3xl font-black mb-6">
                🎾 More Live Tennis Matches
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedMatches.map((item) => (
                  <a
                    key={item.id}
                    href={`/watch/${getMatchSlug(item)}`}
                    className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 hover:border-green-500 transition-all"
                  >
                    <div className="flex justify-between mb-3">
                      <span className="font-black">{item.status}</span>
                      <span className="text-zinc-500">{item.category}</span>
                    </div>

                    <h3 className="text-2xl font-black mb-2">
                      {item.player1}
                      <br />
                      vs
                      <br />
                      {item.player2}
                    </h3>

                    <p className="text-zinc-400">{item.tournament}</p>
                  </a>
                ))}
              </div>
            </section>
          ) : null}

<section className="mt-16">
  <h2 className="text-3xl font-black mb-5">
    🎾 Player Pages
  </h2>

  <p className="text-zinc-400 mb-6 max-w-3xl">
    Explore live tennis matches, schedules,
    rankings and streaming coverage for featured players.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <a
      href={playerUrl(match.player1)}
      className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 hover:border-green-500 transition-all"
    >
      <h3 className="text-2xl font-black mb-3">
        {match.player1}
      </h3>

      <p className="text-zinc-400">
        Live matches, streaming info and schedule
      </p>
    </a>

    <a
      href={playerUrl(match.player2)}
      className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 hover:border-green-500 transition-all"
    >
      <h3 className="text-2xl font-black mb-3">
        {match.player2}
      </h3>

      <p className="text-zinc-400">
        Live matches, streaming info and schedule
      </p>
    </a>

  </div>
</section>
<AdSlot label="Advertisement" />
<RelatedMoneyLinks playerName={match.player1} />
<AuthorBox />
          <section className="mt-16 border-t border-zinc-800 pt-8">
            <h2 className="text-2xl font-black mb-5">More Tennis Coverage</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/live-tennis"
                className="bg-zinc-800 rounded-2xl p-5 font-bold hover:bg-zinc-700"
              >
                Live Tennis Today
              </a>

              <a
                href={`/tournament/${tournamentSlug}`}
                className="bg-zinc-800 rounded-2xl p-5 font-bold hover:bg-zinc-700"
              >
                More from {match.tournament}
              </a>

              <a
                href="/best-ways-to-watch-tennis-online"
                className="bg-zinc-800 rounded-2xl p-5 font-bold hover:bg-zinc-700"
              >
                Best Ways to Watch Tennis Online
              </a>
            </div>
          </section>
        </article>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <BreadcrumbSchema
  items={[
    {
      name: "Home",
      url: "https://watchtennistoday.com",
    },
    {
      name: "Watch",
      url: "https://watchtennistoday.com/watch",
    },
    {
      name: match.tournament,
      url: `https://watchtennistoday.com/tournament/${tournamentSlug}`,
    },
    {
      name: `${match.player1} vs ${match.player2}`,
      url: currentUrl,
    },
  ]}
/>
    </main>
  );
}
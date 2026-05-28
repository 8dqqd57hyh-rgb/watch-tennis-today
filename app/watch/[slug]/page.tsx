import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import AdSlot from "@/app/components/AdSlot";
import { playerUrl } from "@/data/playerSlugs";
import { affiliateLinks } from "@/app/lib/affiliateLinks";
import AuthorBox from "@/app/components/AuthorBox";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import ContentQualityNotice from "@/app/components/ContentQualityNotice";
import { getArchivedMatch } from "@/app/lib/matchArchive";

export const dynamic = "force-dynamic";

type WatchProvider = {
  name: string;
  url: string;
  accessType?: string;
  verificationStatus?: string;
  note?: string;
};

type ArchivedStatusInput = {
  status?: string | null;
  startTime?: string | null;
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

async function getArchivedMatchById(id: string): Promise<Match | null> {
  const baseUrl = await getBaseUrl();

  const response = await fetch(`${baseUrl}/api/match-archive/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) return null;

  const data = await response.json();

  return data.match || null;
}

function getMatchIdFromSlug(slug: string) {
  return slug.match(/(\d+)$/)?.[1] ?? null;
}
function titleCaseName(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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

function isArchivedUpcomingPast(match: ArchivedStatusInput) {
  if (match.status?.toUpperCase() !== "UPCOMING") return false;
  if (!match.startTime) return false;

  return new Date(match.startTime).getTime() < Date.now();
}

function getArchivedDisplayStatus(match: ArchivedStatusInput) {
  if (isArchivedUpcomingPast(match)) return "COMPLETED";

  return match.status || "Completed";
}

function getArchivedDisplayScore(
  match: ArchivedStatusInput & {
    score?: string;
  }
) {
  const score = String(match.score || "").trim();

  if (
    isArchivedUpcomingPast(match) &&
    (!score || score === "-" || score === "0-0")
  ) {
    return "Final score unavailable";
  }

  return score || "Final score unavailable";
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
  ? `🔴 LIVE: ${readableTitle} — Score & TV Schedule | Watch Tennis Today`
  : `${readableTitle} TV Schedule & Match Info | Watch Tennis Today`,

    description: isLiveMatch
  ? `Follow ${readableTitle} with live score updates, official broadcaster information, TV schedule and tournament coverage.`
  : "Find this tennis match schedule, official broadcaster information, match time, tournament details and score updates.",

    alternates: {
      canonical: `https://watchtennistoday.com/watch/${slug}`,
    },

    openGraph: {
     title: isLiveMatch
  ? `🔴 LIVE: ${readableTitle}`
  : `${readableTitle} Match Info`,

      description: isLiveMatch
  ? `Live tennis score updates, TV schedule and official viewing information.`
  : "Official tennis TV schedule, match timing and viewing information.",

      url: `https://watchtennistoday.com/watch/${slug}`,

      siteName: "Watch Tennis Today",

      type: "website",
    },

    twitter: {
      card: "summary_large_image",

      title: isLiveMatch
        ? `🔴 LIVE: ${readableTitle}`
        : `${readableTitle} Match Info`,

      description: isLiveMatch
  ? `Live tennis score updates, TV schedule and official viewing information.`
  : "Official tennis TV schedule, match timing and viewing information.",
    },
  };
}
const playerDescriptions: Record<string, string> = {
  "carlos alcaraz":
    "Carlos Alcaraz is known for explosive movement, heavy topspin and aggressive baseline play, especially on clay courts.",

  "novak djokovic":
    "Novak Djokovic is one of the most successful Grand Slam players in tennis history, known for elite defense and consistency.",

  "jannik sinner":
    "Jannik Sinner is known for powerful groundstrokes, fast-paced rallies and strong hard-court performances.",

  "aryna sabalenka":
    "Aryna Sabalenka is recognized for aggressive shot-making and one of the most powerful serves on the WTA Tour.",

  "iga swiatek":
    "Iga Swiatek is known for dominant clay-court performances, heavy spin and aggressive all-court tennis.",
};
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

 const liveMatch = matches.find((item) => String(item.id) === matchId);

const archivedDbMatch = liveMatch
  ? null
  : await getArchivedMatchById(matchId);

const match = liveMatch || archivedDbMatch;

const archivedMatch =
  match ||
  getArchivedMatch(matchId);

if (!liveMatch && archivedMatch) {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <div className="mt-10 rounded-[2rem] border border-zinc-800 bg-zinc-900 p-8">
          <div className="inline-flex items-center rounded-full bg-yellow-500/20 px-4 py-2 text-sm font-bold text-yellow-400 mb-5">
            📁 Archived Match
          </div>

          <h1 className="text-5xl font-black leading-tight mb-6">
            {archivedMatch.player1}
            <br />
            vs
            <br />
            {archivedMatch.player2}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            <div className="rounded-2xl bg-black border border-zinc-800 p-5">
              <p className="text-zinc-500 text-sm mb-2">
                Tournament
              </p>

              <p className="font-bold text-lg">
                {archivedMatch.tournament || "Unknown"}
              </p>
            </div>

            <div className="rounded-2xl bg-black border border-zinc-800 p-5">
              <p className="text-zinc-500 text-sm mb-2">
                Last Known Status
              </p>

              <p className="font-bold text-lg">
                {getArchivedDisplayStatus(archivedMatch)}
              </p>
            </div>

            <div className="rounded-2xl bg-black border border-zinc-800 p-5">
              <p className="text-zinc-500 text-sm mb-2">
                Score
              </p>

              <p className="font-bold text-lg">
                {getArchivedDisplayScore(archivedMatch)}
              </p>
            </div>

            <div className="rounded-2xl bg-black border border-zinc-800 p-5">
              <p className="text-zinc-500 text-sm mb-2">
                Match Date
              </p>

              <p className="font-bold text-lg">
                {archivedMatch.startTime
                  ? new Date(archivedMatch.startTime).toLocaleString()
                  : "Unavailable"}
              </p>
            </div>
          </div>

          <section className="space-y-5 text-zinc-300 leading-8 mb-10">
            <h2 className="text-3xl font-black text-white">
              Archived Match Information
            </h2>

            <p>
              This tennis match is no longer active and may have been removed
from current tournament schedules or live score feeds.
            </p>

            <p>
              Watch Tennis Today keeps archived match information available
              to help fans revisit tournament coverage, player matchups,
              scores and tennis schedules.
            </p>

            <p>
              Coverage availability may vary depending on tournament data
              providers and regional broadcaster updates.
            </p>
          </section>

          <div className="flex flex-wrap gap-4">
            <a
              href="/live-tennis"
              className="rounded-2xl bg-green-500 px-6 py-4 font-black text-black hover:bg-green-400 transition-all"
            >
              Tennis Schedule
            </a>

            <a
              href="/today"
              className="rounded-2xl bg-zinc-800 px-6 py-4 font-black text-white hover:bg-zinc-700 transition-all"
            >
              Today’s Schedule
            </a>

            <a
              href="/players"
              className="rounded-2xl bg-zinc-800 px-6 py-4 font-black text-white hover:bg-zinc-700 transition-all"
            >
              Tennis Players
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
if (!match) {
  if (
    decodedSlug.includes("-vs-") &&
    decodedSlug.match(/\d+$/)
  ) {
    redirect("/");
  }

  notFound();
}

  const tournamentSlug = slugify(match.tournament);
  const currentUrl = `https://watchtennistoday.com/watch/${slug}`;
  const matchTitle = `${match.player1} vs ${match.player2}`;
  const playerDescription =
  playerDescriptions[match.player1.toLowerCase()] ||
  playerDescriptions[match.player2.toLowerCase()] ||
  "Follow tennis match schedules, TV coverage updates, tournament context and official broadcaster information.";

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
        name: `Where can I find official viewing information for ${matchTitle}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text:
            match.watchProviders.length > 0
              ? `${matchTitle} viewing information can be checked through official tennis broadcasters and licensed platforms such as ${match.watchProviders
                  .map((provider) => provider.name)
                  .join(", ")}.`
              : `Official viewing information for ${matchTitle} may depend on your country, tournament rights and broadcaster availability.`,
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

          <div className="mb-10 space-y-4">
  <p className="text-xl text-zinc-300">
    Follow match timing, tournament details, official broadcaster
availability and live tennis updates for {matchTitle}.
  </p>

  <p className="text-zinc-400 leading-8">
    {playerDescription}
  </p>
</div>
          <div className="mb-8 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-100">
  <strong>Legal streaming notice:</strong> Watch Tennis Today does not host,
  embed, or provide unauthorized live streams. We only provide information
  about official broadcasters and licensed viewing platforms available in
  your region.
</div>

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
  <p className="text-zinc-500 text-sm">
  Match information is updated using official tournament and tennis schedule data sources.
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
                   className="block bg-zinc-800 border border-zinc-700 text-white rounded-2xl px-5 py-4 font-black hover:border-green-500 hover:text-green-400 transition-all"
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
    Watching while traveling?
  </h2>

  <p className="mb-5 text-zinc-300 leading-7">
  Tennis streaming availability can vary by region. If you are traveling,
  use official broadcasters and protect your connection on public Wi-Fi.
</p>

  <a
    href={affiliateLinks.nordvpn}
    target="_blank"
    rel="nofollow sponsored noopener noreferrer"
    className="inline-flex rounded-2xl bg-zinc-800 px-6 py-4 font-black text-white hover:bg-zinc-700 transition-all"
  >
    Online Viewing Privacy Guide
  </a>
  <p className="mt-4 text-xs text-zinc-500">
  Some links on Watch Tennis Today may be affiliate links.
</p>
</section>


          <section className="mt-16 text-zinc-300 space-y-6">
            <h2 className="text-3xl font-black">
  {matchTitle} TV Schedule and Official Viewing Info
</h2>

            <p>
  Streaming availability for this match can vary by country, tournament rights
  and broadcaster agreements. We recommend checking official tennis platforms,
  tournament websites and licensed TV providers before the match starts.
</p>

<p>
  This page is updated to help fans understand the match status, start time,
  tournament context and legal viewing options without hosting or embedding
  unauthorized streams.
</p>

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
              Get notified before {matchTitle} starts, including match schedule
updates, score alerts and tournament coverage information.
            </p>
            <p className="text-zinc-500 text-sm mb-6">
  Email alerts are optional and can be unsubscribed from at any time.
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
                  Where can I find official viewing information for {matchTitle}?
                </h3>
                <p className="text-zinc-400">
                  You can check the official viewing options listed above. Availability may
depend on your country, tournament rights and licensed broadcasters.
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

              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
  <h3 className="text-xl font-black mb-2">
    Can I watch {matchTitle} online?
  </h3>
  <p className="text-zinc-400">
    Yes, if the match is covered by an official broadcaster or licensed
    viewing platform in your country. Availability can vary by tournament and region.
  </p>
</div>

<div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">
  <h3 className="text-xl font-black mb-2">
    Why does tennis coverage vary by country?
  </h3>
  <p className="text-zinc-400">
    Tennis streaming rights are usually sold by country or region. If a stream
    is unavailable, check your local broadcaster or the official tournament
    website for legal viewing options.
  </p>
</div>
            </div>
          </section>

          {relatedMatches.length > 0 ? (
            <section className="mt-16">
              <h2 className="text-3xl font-black mb-6">
                🎾 More Tennis Matches
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
    Explore player match schedules, tournament context,
rankings and official viewing information.
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
        Matches, schedule and viewing info
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
        Matches, schedule and viewing info
      </p>
    </a>

  </div>
</section>
<AdSlot label="Advertisement" />
<ContentQualityNotice pageType="match page" />

        <RelatedMoneyLinks playerName={match.player1} />
<AuthorBox />
          <section className="mt-16 border-t border-zinc-800 pt-8">
            <h2 className="text-2xl font-black mb-5">More Tennis Coverage</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/live-tennis"
                className="bg-zinc-800 rounded-2xl p-5 font-bold hover:bg-zinc-700"
              >
                Tennis Schedule Today
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
              <a
  href="/atp-live-today"
  className="bg-zinc-800 rounded-2xl p-5 font-bold hover:bg-zinc-700"
>
  ATP Live Matches
</a>

<a
  href="/wta-live-today"
  className="bg-zinc-800 rounded-2xl p-5 font-bold hover:bg-zinc-700"
>
  WTA Live Matches
</a>

<a
  href="/grand-slam-live"
  className="bg-zinc-800 rounded-2xl p-5 font-bold hover:bg-zinc-700"
>
  Grand Slam Coverage
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
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import AdSlot from "@/app/components/AdSlot";
import { isDoublesTeam, safePlayerUrl } from "@/data/playerSlugs";
import { affiliateLinks } from "@/app/lib/affiliateLinks";
import AuthorBox from "@/app/components/AuthorBox";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import ContentQualityNotice from "@/app/components/ContentQualityNotice";
import { getArchivedMatch } from "@/app/lib/matchArchive";
import LiveMatchScore from "./LiveMatchScore";

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
  pointScore?: string | null;
  startTime: string | null;
  watchProviders: WatchProvider[];
};


function isGrandSlamTournament(tournament: string) {
  const name = tournament.toLowerCase();

  return (
    name.includes("roland") ||
    name.includes("french open") ||
    name.includes("wimbledon") ||
    name.includes("us open") ||
    name.includes("australian open")
  );
}

function getSafeWatchProviders(match: Match) {
  if (!isGrandSlamTournament(match.tournament)) {
    return match.watchProviders;
  }

  const filtered = match.watchProviders.filter((provider) => {
    const name = provider.name.toLowerCase();
    return !name.includes("tennis tv") && !name.includes("atp tv");
  });

  if (filtered.length > 0) return filtered;

  if (match.tournament.toLowerCase().includes("french open") || match.tournament.toLowerCase().includes("roland")) {
    return [
      {
        name: "Roland-Garros official broadcasters",
        url: "https://www.rolandgarros.com/en-us/broadcasters",
        accessType: "REGION_DEPENDENT",
        verificationStatus: "TOURNAMENT_VERIFIED",
        note: "French Open rights are separate from Tennis TV. Check the official broadcaster list for your country.",
      },
    ];
  }

  return [
    {
      name: "Official Grand Slam broadcasters",
      url: "/watch-tennis-in/usa",
      accessType: "REGION_DEPENDENT",
      verificationStatus: "TOURNAMENT_VERIFIED",
      note: "Grand Slam streaming rights are separate from Tennis TV and vary by country.",
    },
  ];
}

const playerDescriptions: Record<string, string> = {
  "carlos alcaraz":
    "Carlos Alcaraz is known for explosive movement, heavy topspin and aggressive baseline play, especially on clay courts.",
  "novak djokovic":
    "Novak Djokovic is one of the most successful Grand Slam players in tennis history, known for elite defense, return quality and consistency.",
  "jannik sinner":
    "Jannik Sinner is known for powerful groundstrokes, fast-paced rallies and strong hard-court performances.",
  "aryna sabalenka":
    "Aryna Sabalenka is recognized for aggressive shot-making and one of the most powerful serves on the WTA Tour.",
  "iga swiatek":
    "Iga Swiatek is known for dominant clay-court performances, heavy spin and aggressive all-court tennis.",
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

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "Time to be confirmed";

  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatShortTime(value: string | null) {
  if (!value) return "TBC";

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "TBC";

  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
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

function normalizeStatus(status: string) {
  return status.toUpperCase();
}

function isLive(status: string) {
  return normalizeStatus(status) === "LIVE";
}

function isFinished(status: string) {
  return ["FINISHED", "CANCELLED", "RETIRED", "COMPLETED"].includes(
    normalizeStatus(status)
  );
}

function getStatusStyles(status: string) {
  const normalized = normalizeStatus(status);

  if (normalized === "LIVE") {
    return "bg-red-500 text-white shadow-lg shadow-red-500/20 animate-pulse";
  }

  if (normalized === "UPCOMING") {
    return "bg-sky-400 text-black";
  }

  if (normalized === "SUSPENDED") {
    return "bg-yellow-400 text-black";
  }

  if (isFinished(status)) {
    return "bg-zinc-700 text-zinc-200";
  }

  return "bg-green-500 text-black";
}

function getMatchPhase(match: Match) {
  if (isLive(match.status)) return "Live now";
  if (normalizeStatus(match.status) === "UPCOMING") return "Upcoming match";
  if (normalizeStatus(match.status) === "SUSPENDED") return "Delayed or suspended";
  if (isFinished(match.status)) return "Completed match";
  return "Match status";
}

function getScoreDisplay(match: Match) {
  const score = String(match.score || "").trim();

  if (!score || score === "-" || score === "0-0") {
    if (isLive(match.status)) return "Live score pending";
    if (normalizeStatus(match.status) === "UPCOMING") return "Not started";
    return "Score unavailable";
  }

  return score;
}

function getTimeContext(match: Match) {
  if (!match.startTime) return "Official start time has not been confirmed yet.";

  const start = new Date(match.startTime).getTime();
  if (Number.isNaN(start)) return "Official start time has not been confirmed yet.";

  const diff = start - Date.now();
  const minutes = Math.round(Math.abs(diff) / 60000);

  if (isLive(match.status)) return "Match is marked as live in the current feed.";
  if (diff > 0 && minutes <= 90) return `Scheduled to start in about ${minutes} minutes.`;
  if (diff > 0) return `Scheduled for ${formatDateTime(match.startTime)}.`;
  if (isFinished(match.status)) return "This match is no longer active.";

  return "Start time may have moved. Check official order of play before watching.";
}

function buildCountryWatchLinks(match: Match) {
  const tournament = match.tournament.toLowerCase();
  const category = match.category.toUpperCase();
  const isGrandSlam =
    tournament.includes("roland") ||
    tournament.includes("french open") ||
    tournament.includes("wimbledon") ||
    tournament.includes("us open") ||
    tournament.includes("australian open");

  const links = [
    {
      country: "United States",
      label: isGrandSlam ? "ESPN / Tennis Channel" : "Tennis Channel / Tennis TV",
      href: "/watch-tennis-in/usa",
    },
    {
      country: "United Kingdom",
      label: isGrandSlam ? "Eurosport / Discovery+ / BBC where available" : "Sky Sports / Tennis TV",
      href: "/watch-tennis-in/uk",
    },
    {
      country: "Poland",
      label: isGrandSlam ? "Eurosport / Canal+ where available" : "Canal+ / Tennis TV",
      href: "/watch-tennis-in/poland",
    },
    {
      country: "Germany",
      label: isGrandSlam ? "Eurosport / Discovery+ where available" : category === "WTA" ? "WTA broadcasters / Tennis Channel" : "Sky / Tennis TV",
      href: "/watch-tennis-in/germany",
    },
  ];

  return links;
}

function getRelatedMatches(match: Match, matches: Match[]) {
  const playerNames = [match.player1.toLowerCase(), match.player2.toLowerCase()];
  const tournament = match.tournament.toLowerCase();

  return matches
    .filter((item) => item.id !== match.id && !isFinished(item.status))
    .sort((a, b) => {
      const aScore =
        (a.tournament.toLowerCase() === tournament ? 3 : 0) +
        (a.category === match.category ? 2 : 0) +
        (playerNames.includes(a.player1.toLowerCase()) ||
        playerNames.includes(a.player2.toLowerCase())
          ? 5
          : 0);

      const bScore =
        (b.tournament.toLowerCase() === tournament ? 3 : 0) +
        (b.category === match.category ? 2 : 0) +
        (playerNames.includes(b.player1.toLowerCase()) ||
        playerNames.includes(b.player2.toLowerCase())
          ? 5
          : 0);

      return bScore - aScore;
    })
    .slice(0, 6);
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
  const readableTitle = decodedSlug.replace(/-\d+$/, "").replace(/-/g, " ");
  const matches = await getMatches();
  const match = matches.find((item) => String(item.id) === matchId);
  const isLiveMatch = match?.status?.toUpperCase() === "LIVE";

  return {
    title: isLiveMatch
      ? `🔴 LIVE: ${readableTitle} — Score, Time & TV Info | Watch Tennis Today`
      : `${readableTitle} Tennis Match — Time, Score & TV Info | Watch Tennis Today`,
    description: isLiveMatch
      ? `Follow ${readableTitle} with live score context, official viewing links, tournament details and legal TV information.`
      : "Find this tennis match time, score context, tournament details and legal broadcaster information.",
    alternates: {
      canonical: `https://watchtennistoday.com/watch/${slug}`,
    },
    openGraph: {
      title: isLiveMatch ? `🔴 LIVE: ${readableTitle}` : `${readableTitle} Match Hub`,
      description: isLiveMatch
        ? "Live tennis score context, TV schedule and official viewing information."
        : "Tennis match timing, tournament context and legal viewing information.",
      url: `https://watchtennistoday.com/watch/${slug}`,
      siteName: "Watch Tennis Today",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: isLiveMatch ? `🔴 LIVE: ${readableTitle}` : `${readableTitle} Match Hub`,
      description: isLiveMatch
        ? "Live tennis score context, TV schedule and official viewing information."
        : "Tennis match timing, tournament context and legal viewing information.",
    },
  };
}

type ArchivedMatchLike = {
  id?: string;
  player1: string;
  player2: string;
  tournament?: string;
  category?: string;
  status?: string | null;
  score?: string;
  startTime?: string | null;
  watchProviders?: WatchProvider[];
};

function ArchivedMatchPage({ archivedMatch }: { archivedMatch: ArchivedMatchLike }) {
  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <div className="mt-10 rounded-[2rem] border border-zinc-800 bg-zinc-900 p-8">
          <div className="mb-5 inline-flex items-center rounded-full bg-yellow-500/20 px-4 py-2 text-sm font-bold text-yellow-400">
            📁 Archived match
          </div>

          <h1 className="mb-6 text-5xl font-black leading-tight">
            {archivedMatch.player1}
            <br />
            vs
            <br />
            {archivedMatch.player2}
          </h1>

          <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-black p-5">
              <p className="mb-2 text-sm text-zinc-500">Tournament</p>
              <p className="text-lg font-bold">{archivedMatch.tournament || "Unknown"}</p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black p-5">
              <p className="mb-2 text-sm text-zinc-500">Last known status</p>
              <p className="text-lg font-bold">{getArchivedDisplayStatus(archivedMatch)}</p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black p-5">
              <p className="mb-2 text-sm text-zinc-500">Score</p>
              <p className="text-lg font-bold">{getArchivedDisplayScore(archivedMatch)}</p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-black p-5">
              <p className="mb-2 text-sm text-zinc-500">Match date</p>
              <p className="text-lg font-bold">{formatDateTime(archivedMatch.startTime ?? null)}</p>
            </div>
          </div>

          <section className="mb-10 space-y-5 leading-8 text-zinc-300">
            <h2 className="text-3xl font-black text-white">Archived match information</h2>
            <p>
              This tennis match is no longer active and may have been removed from current tournament schedules or live score feeds.
            </p>
            <p>
              Watch Tennis Today keeps archived match information available to help fans revisit tournament coverage, player matchups, scores and tennis schedules.
            </p>
          </section>

          <div className="flex flex-wrap gap-4">
            <a href="/tennis-schedule-today" className="rounded-2xl bg-green-500 px-6 py-4 font-black text-black transition-all hover:bg-green-400">
              Tennis Schedule Today
            </a>
            <a href="/live-tennis" className="rounded-2xl bg-zinc-800 px-6 py-4 font-black text-white transition-all hover:bg-zinc-700">
              Live Tennis
            </a>
            <a href="/players" className="rounded-2xl bg-zinc-800 px-6 py-4 font-black text-white transition-all hover:bg-zinc-700">
              Tennis Players
            </a>
          </div>
        </div>
      </div>
    </main>
  );
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
  const liveMatch = matches.find((item) => String(item.id) === matchId);
  const archivedDbMatch = liveMatch ? null : await getArchivedMatchById(matchId);
  const match = liveMatch || archivedDbMatch;
  const archivedMatch = match || getArchivedMatch(matchId);

  if (!liveMatch && archivedMatch) {
    return <ArchivedMatchPage archivedMatch={archivedMatch} />;
  }

  if (!match) {
    if (decodedSlug.includes("-vs-") && decodedSlug.match(/\d+$/)) {
      redirect("/");
    }

    notFound();
  }

  const tournamentSlug = slugify(match.tournament);
  const currentUrl = `https://watchtennistoday.com/watch/${slug}`;
  const matchTitle = `${match.player1} vs ${match.player2}`;
  const scoreDisplay = getScoreDisplay(match);
  const countryLinks = buildCountryWatchLinks(match);
  const relatedMatches = getRelatedMatches(match, matches);
  const player1Url = isDoublesTeam(match.player1) ? null : safePlayerUrl(match.player1);
  const player2Url = isDoublesTeam(match.player2) ? null : safePlayerUrl(match.player2);
  const playerDescription =
    playerDescriptions[match.player1.toLowerCase()] ||
    playerDescriptions[match.player2.toLowerCase()] ||
    "Follow tennis match schedules, score context, tournament details and official broadcaster information.";

  const eventStatus = isLive(match.status)
    ? "https://schema.org/EventInProgress"
    : isFinished(match.status)
      ? "https://schema.org/EventCompleted"
      : "https://schema.org/EventScheduled";

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: matchTitle,
    sport: "Tennis",
    startDate: match.startTime,
    eventStatus,
    competitor: [
      { "@type": "Person", name: match.player1 },
      { "@type": "Person", name: match.player2 },
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
            getSafeWatchProviders(match).length > 0
              ? `${matchTitle} viewing information can be checked through official tennis broadcasters and licensed platforms such as ${getSafeWatchProviders(match)
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
          text: `${matchTitle} is scheduled for ${formatDateTime(match.startTime)}.`,
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
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-8 text-sm text-zinc-400">
          <a href="/" className="hover:text-white">Home</a> /{" "}
          <a href="/watch" className="hover:text-white">Watch</a> /{" "}
          <a href={`/tournament/${tournamentSlug}`} className="hover:text-white">{match.tournament}</a>
        </nav>

        <article className="overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900">
          <section className="relative border-b border-zinc-800 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.22),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_32%)] p-6 md:p-10">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className={`rounded-full px-4 py-2 text-sm font-black ${getStatusStyles(match.status)}`}>
                {getMatchPhase(match)}
              </span>
              <span className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm font-bold text-zinc-300">
                {match.category || "Tennis"}
              </span>
              <span className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm font-bold text-zinc-300">
                {match.tournament}
              </span>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
              <div>
                <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-green-400">
                  Match hub
                </p>
                <h1 className="mb-6 text-4xl font-black leading-tight md:text-6xl">
                  {player1Url ? (
                    <a href={player1Url} className="hover:text-green-400">
                      {match.player1}
                    </a>
                  ) : (
                    <span>{match.player1}</span>
                  )}
                  <span className="block text-zinc-500">vs</span>
                  {player2Url ? (
                    <a href={player2Url} className="hover:text-green-400">
                      {match.player2}
                    </a>
                  ) : (
                    <span>{match.player2}</span>
                  )}
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-zinc-300">
                  Follow {matchTitle} with match timing, score context, tournament details and official viewing information. This page links only to legal broadcaster and schedule sources.
                </p>
              </div>

              <LiveMatchScore
                initialMatch={{
                  id: match.id,
                  status: match.status,
                  score: match.score,
                  startTime: match.startTime,
                }}
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#where-to-watch" className="rounded-2xl bg-green-500 px-6 py-4 font-black text-black transition-all hover:bg-green-400">
                Where to watch
              </a>
              <a href="/tennis-schedule-today" className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 font-black text-white transition-all hover:bg-white/15">
                Today’s schedule
              </a>
              <a href={`/tournament/${tournamentSlug}`} className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 font-black text-white transition-all hover:bg-white/15">
                Tournament page
              </a>
            </div>
          </section>

          <div className="p-6 md:p-10">
            <section className="mb-8 rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-sm leading-7 text-yellow-100">
              <strong>Legal streaming notice:</strong> Watch Tennis Today does not host, embed, or provide unauthorized live streams. We provide match discovery, schedule context and links to official or licensed viewing information.
            </section>

            <section className="mb-10 grid gap-4 md:grid-cols-4">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="mb-2 text-sm text-zinc-500">Tournament</p>
                <p className="text-lg font-black">{match.tournament}</p>
              </div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="mb-2 text-sm text-zinc-500">Category</p>
                <p className="text-lg font-black">{match.category || "Tennis"}</p>
              </div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="mb-2 text-sm text-zinc-500">Start time</p>
                <p className="text-lg font-black">{formatDateTime(match.startTime)}</p>
              </div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
                <p className="mb-2 text-sm text-zinc-500">Score</p>
                <p className="text-lg font-black">{scoreDisplay}</p>
              </div>
            </section>

            <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-green-400">Match context</p>
              <h2 className="mb-4 text-3xl font-black">What to know before {matchTitle}</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <p className="leading-8 text-zinc-300">{playerDescription}</p>
                <p className="leading-8 text-zinc-300">
                  Tennis schedules can move during the day because earlier matches run long, courts change, rain delays happen or withdrawals are announced. Re-check the official order of play before match time.
                </p>
              </div>
            </section>

            <section id="where-to-watch" className="mb-12">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-green-400">Official viewing</p>
                  <h2 className="text-3xl font-black">Where to watch {matchTitle}</h2>
                </div>
                <a href="/how-we-verify-streams" className="text-sm font-bold text-green-400 hover:text-green-300">
                  How we verify streams →
                </a>
              </div>

              {getSafeWatchProviders(match).length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {getSafeWatchProviders(match).map((provider) => (
                    <a
                      key={`${provider.name}-${provider.url}`}
                      href={provider.url}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      className="block rounded-3xl border border-zinc-700 bg-zinc-950 p-5 transition-all hover:border-green-500 hover:text-green-400"
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="text-xl font-black">{provider.name}</span>
                        {provider.accessType ? (
                          <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-black text-zinc-300">
                            {provider.accessType.replaceAll("_", " ")}
                          </span>
                        ) : null}
                      </div>
                      {provider.note ? (
                        <span className="block text-sm font-semibold leading-6 text-zinc-400">
                          {provider.note}
                        </span>
                      ) : null}
                    </a>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-400">
                  No trusted watch source is attached to this match yet. Check official tournament, ATP, WTA or local broadcaster listings before using any stream.
                </div>
              )}
            </section>

            <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="mb-5 text-3xl font-black">Viewing options by country</h2>
              <p className="mb-6 max-w-3xl leading-7 text-zinc-400">
                Tennis rights vary by country. These country guides help users check legal broadcasters and streaming platforms instead of relying on unsafe stream links.
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {countryLinks.map((item) => (
                  <a key={item.country} href={item.href} className="rounded-3xl border border-zinc-800 bg-black p-5 transition hover:border-green-500">
                    <p className="mb-2 text-lg font-black">{item.country}</p>
                    <p className="text-sm leading-6 text-zinc-400">{item.label}</p>
                  </a>
                ))}
              </div>
            </section>

            <section className="mb-12 rounded-[2rem] border border-green-500/30 bg-green-500/10 p-6">
              <p className="mb-2 text-xs font-black uppercase tracking-widest text-green-400">Streaming tip</p>
              <h2 className="mb-3 text-2xl font-black">Watching while traveling?</h2>
              <p className="mb-5 max-w-3xl leading-7 text-zinc-300">
                Tennis streaming availability can vary by region. If you are traveling, use official broadcasters and protect your connection on hotel, airport or café Wi‑Fi.
              </p>
              <a href={affiliateLinks.nordvpn} target="_blank" rel="nofollow sponsored noopener noreferrer" className="inline-flex rounded-2xl bg-zinc-800 px-6 py-4 font-black text-white transition-all hover:bg-zinc-700">
                Online viewing privacy guide
              </a>
              <p className="mt-4 text-xs text-zinc-500">Some links on Watch Tennis Today may be affiliate links.</p>
            </section>

            <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="mb-5 text-3xl font-black">Head-to-head quick links</h2>
              <p className="mb-6 max-w-3xl leading-7 text-zinc-400">
                Use these player pages to check schedules, match pages, tournament context and official viewing information for each player.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {player1Url ? (
                  <a href={player1Url} className="rounded-3xl border border-zinc-800 bg-black p-5 transition hover:border-green-500">
                    <h3 className="mb-2 text-2xl font-black">{match.player1}</h3>
                    <p className="text-zinc-400">Live matches, schedule and viewing info</p>
                  </a>
                ) : (
                  <div className="rounded-3xl border border-zinc-800 bg-black p-5">
                    <h3 className="mb-2 text-2xl font-black">{match.player1}</h3>
                    <p className="text-zinc-400">Player page is shown only when the player can be verified.</p>
                  </div>
                )}
                {player2Url ? (
                  <a href={player2Url} className="rounded-3xl border border-zinc-800 bg-black p-5 transition hover:border-green-500">
                    <h3 className="mb-2 text-2xl font-black">{match.player2}</h3>
                    <p className="text-zinc-400">Live matches, schedule and viewing info</p>
                  </a>
                ) : (
                  <div className="rounded-3xl border border-zinc-800 bg-black p-5">
                    <h3 className="mb-2 text-2xl font-black">{match.player2}</h3>
                    <p className="text-zinc-400">Player page is shown only when the player can be verified.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="mb-4 text-3xl font-black">🔔 Get match alerts</h2>
              <p className="mb-2 text-zinc-400">
                Get notified before {matchTitle} starts, including match schedule updates, score alerts and tournament coverage information.
              </p>
              <p className="mb-6 text-sm text-zinc-500">Email alerts are optional and can be unsubscribed from at any time.</p>
              <form action="https://formspree.io/f/xeenwwbk" method="POST" className="flex flex-col gap-4 md:flex-row">
                <input type="hidden" name="_redirect" value="https://watchtennistoday.com/newsletter-confirmation" />
                <input type="email" name="email" required placeholder="Your email" className="flex-1 rounded-2xl border border-zinc-700 bg-black px-5 py-4 text-white" />
                <input type="hidden" name="match" value={matchTitle} />
                <input type="hidden" name="source" value="match-page" />
                <button type="submit" className="rounded-2xl bg-green-500 px-6 py-4 font-black text-black transition-all hover:bg-green-400">
                  Notify me
                </button>
              </form>
            </section>

            <section className="mb-12">
              <h2 className="mb-6 text-3xl font-black">FAQ</h2>
              <div className="space-y-4">
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
                  <h3 className="mb-2 text-xl font-black">Where can I find official viewing information for {matchTitle}?</h3>
                  <p className="text-zinc-400">Check the official viewing options listed above. Availability may depend on your country, tournament rights and licensed broadcasters.</p>
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
                  <h3 className="mb-2 text-xl font-black">What time does {matchTitle} start?</h3>
                  <p className="text-zinc-400">The match is scheduled for {formatDateTime(match.startTime)}. Tennis start times can move, so confirm close to match time.</p>
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
                  <h3 className="mb-2 text-xl font-black">What tournament is this match from?</h3>
                  <p className="text-zinc-400">This match is listed under {match.tournament}.</p>
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
                  <h3 className="mb-2 text-xl font-black">Can I watch {matchTitle} online?</h3>
                  <p className="text-zinc-400">Yes, if the match is covered by an official broadcaster or licensed viewing platform in your country. Availability can vary by tournament and region.</p>
                </div>
              </div>
            </section>

            {relatedMatches.length > 0 ? (
              <section className="mb-12">
                <h2 className="mb-6 text-3xl font-black">🎾 Related matches</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {relatedMatches.map((item) => (
                    <a key={item.id} href={`/watch/${getMatchSlug(item)}`} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 transition-all hover:border-green-500">
                      <div className="mb-3 flex justify-between gap-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${getStatusStyles(item.status)}`}>{item.status}</span>
                        <span className="text-sm text-zinc-500">{item.category}</span>
                      </div>
                      <h3 className="mb-2 text-xl font-black">{item.player1} vs {item.player2}</h3>
                      <p className="text-sm text-zinc-400">{item.tournament}</p>
                    </a>
                  ))}
                </div>
              </section>
            ) : null}

            <AdSlot label="Advertisement" />
            <ContentQualityNotice pageType="match page" />
            <RelatedMoneyLinks playerName={match.player1} player2Name={match.player2} />
            <AuthorBox />

            <section className="mt-16 border-t border-zinc-800 pt-8">
              <h2 className="mb-5 text-2xl font-black">More tennis coverage</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <a href="/tennis-schedule-today" className="rounded-2xl bg-zinc-800 p-5 font-bold hover:bg-zinc-700">Tennis Schedule Today</a>
                <a href={`/tournament/${tournamentSlug}`} className="rounded-2xl bg-zinc-800 p-5 font-bold hover:bg-zinc-700">More from {match.tournament}</a>
                <a href="/best-ways-to-watch-tennis-online" className="rounded-2xl bg-zinc-800 p-5 font-bold hover:bg-zinc-700">Best Ways to Watch Tennis Online</a>
                <a href="/atp-live-today" className="rounded-2xl bg-zinc-800 p-5 font-bold hover:bg-zinc-700">ATP Live Matches</a>
                <a href="/wta-live-today" className="rounded-2xl bg-zinc-800 p-5 font-bold hover:bg-zinc-700">WTA Live Matches</a>
                <a href="/grand-slam-live" className="rounded-2xl bg-zinc-800 p-5 font-bold hover:bg-zinc-700">Grand Slam Coverage</a>
              </div>
            </section>
          </div>
        </article>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "Watch", url: "https://watchtennistoday.com/watch" },
          { name: match.tournament, url: `https://watchtennistoday.com/tournament/${tournamentSlug}` },
          { name: `${match.player1} vs ${match.player2}`, url: currentUrl },
        ]}
      />
    </main>
  );
}

import Link from "next/link";
import { canonicalUrl, robotsFor } from "@/app/lib/technicalSeo";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import AdSlot from "@/app/components/AdSlot";
import { isDoublesTeam, safePlayerUrl } from "@/data/playerSlugs";
import { affiliateLinks } from "@/app/lib/affiliateLinks";
import AuthorBox from "@/app/components/AuthorBox";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import ContentQualityNotice from "@/app/components/ContentQualityNotice";
import { getArchivedMatch, getArchivedMatchFromDatabase } from "@/app/lib/matchArchive";
import LiveMatchScore from "./LiveMatchScore";
import EmailCapture from "@/components/EmailCapture";
import LocalMatchFollowButton from "@/app/components/LocalMatchFollowButton";
import MatchEdgePredictor from "@/app/components/MatchEdgePredictor";
import MatchReminderPanel from "@/app/components/MatchReminderPanel";
import PlayerFollowCTA from "@/components/PlayerFollowCTA";
import LegalStreamingOptions from "@/components/LegalStreamingOptions";
import { getServerMatchById, getServerMatches } from "@/app/lib/serverMatches";
import { buildMatchEditorialContext } from "@/data/tennisEditorial";

export const dynamic = "force-dynamic";

function titleCaseMatchName(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((word) => word.length <= 2 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildWatchSeoTitle(matchTitle: string, isLiveMatch: boolean) {
  return isLiveMatch
    ? `🔴 ${matchTitle} Live Score, Stream Info & Match Time`
    : `${matchTitle} Match Time, Score Updates & TV Info`;
}

function buildWatchSeoDescription(matchTitle: string, isLiveMatch: boolean) {
  return isLiveMatch
    ? `Follow ${matchTitle} live score context, match time, tournament details and legal tennis TV or streaming information.`
    : `Find ${matchTitle} match time, score updates, tournament details and legal tennis TV or streaming information.`;
}

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
  round?: string | null;
  court?: string | null;
  surface?: string | null;
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


function isCrawlerUserAgent(userAgent: string) {
  const value = userAgent.toLowerCase();

  return (
    value.includes("bot") ||
    value.includes("crawler") ||
    value.includes("spider") ||
    value.includes("ahrefs") ||
    value.includes("dotbot") ||
    value.includes("semrush") ||
    value.includes("mj12") ||
    value.includes("bingpreview") ||
    value.includes("facebookexternalhit") ||
    value.includes("slurp")
  );
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

function getFallbackMatchFromSlug(slug: string, matchId: string): ArchivedMatchLike | null {
  const titlePart = slug.replace(/-?\d+$/, "");
  const [left, right] = titlePart.split("-vs-");

  if (!left || !right) return null;

  return {
    id: matchId,
    player1: formatFallbackPlayerName(left),
    player2: formatFallbackPlayerName(right),
    tournament: "Current tennis schedule",
    category: "Tennis",
    status: "No longer in live feed",
    score: "Score unavailable",
    startTime: null,
    watchProviders: [],
  };
}

function formatFallbackPlayerName(value: string) {
  const words = value.replace(/-/g, " ").split(" ").filter(Boolean);

  return words
    .map((word, index) => {
      if (index === 0 && /^[a-z]$/i.test(word)) return `${word.toUpperCase()}.`;
      return word.length <= 2 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
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

function isActiveMatchStatus(status?: string | null) {
  return ["LIVE", "SUSPENDED", "UPCOMING"].includes(normalizeStatus(status || ""));
}

function isFinished(status: string) {
  return ["FINISHED", "CANCELLED", "RETIRED", "COMPLETED"].includes(
    normalizeStatus(status)
  );
}

function isCancelledOrPostponed(status: string) {
  return ["CANCELLED", "CANCELED", "POSTPONED"].includes(normalizeStatus(status));
}

function getStatusStyles(status: string) {
  const normalized = normalizeStatus(status);

  if (normalized === "LIVE") {
    return "bg-red-500 text-white shadow-lg shadow-red-500/20 animate-pulse";
  }

  if (normalized === "UPCOMING") {
    return "bg-sky-400 text-black";
  }

  if (normalized === "SCHEDULED" || normalized === "NOTSTARTED" || normalized === "NOT_STARTED") {
    return "bg-green-400 text-black";
  }

  if (normalized === "POSTPONED") {
    return "bg-orange-400 text-black";
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
  if (["UPCOMING", "SCHEDULED", "NOTSTARTED", "NOT_STARTED"].includes(normalizeStatus(match.status))) return "Scheduled match";
  if (normalizeStatus(match.status) === "POSTPONED") return "Postponed match";
  if (isCancelledOrPostponed(match.status) && normalizeStatus(match.status).includes("CANCEL")) return "Cancelled match";
  if (normalizeStatus(match.status) === "SUSPENDED") return "Delayed or suspended";
  if (isFinished(match.status)) return "Completed match";
  return "Match status";
}

function getScoreDisplay(match: Match) {
  const score = String(match.score || "").trim();

  if (!score || score === "-" || score === "0-0") {
    if (isLive(match.status)) return "Live score pending";
    if (["UPCOMING", "SCHEDULED", "NOTSTARTED", "NOT_STARTED"].includes(normalizeStatus(match.status))) return "Not started";
    return "Score unavailable";
  }

  return score;
}

function formatLocalDateTime(value: string | null) {
  if (!value) return "Time to be confirmed";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Time to be confirmed";

  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(parsed);
}

function getLastUpdatedLabel() {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date());
}

function getOptionalMatchDetail(match: Match, key: "round" | "court" | "surface") {
  const value = match[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getWatchability(match: Match, matches: Match[]) {
  const round = getOptionalMatchDetail(match, "round") || "";
  const sameTournamentCount = matches.filter((item) => item.tournament === match.tournament).length;
  const liveOrSoon = isLive(match.status) || getRelatedMatchStartScore(match.startTime) > 0;
  const importantRound = /final|semi|quarter|round of 16|last 16/i.test(round);
  const category = match.category || "tennis";

  return {
    entertainment: liveOrSoon
      ? "High if you want a match you can follow right now or very soon."
      : "Useful for planning, with entertainment depending on the final order of play.",
    rankingImportance: importantRound
      ? "Likely higher than an early-round match because the listed round is deeper in the draw."
      : `Depends on draw context and ranking points for this ${category} event.`,
    upsetPotential: "No reliable upset signal is available from the current feed, so this page does not assign fake odds.",
    intensity: isLive(match.status)
      ? "Live intensity can change point by point; use the score panel and official feed for the current state."
      : importantRound
        ? "Expected to be meaningful because later rounds usually raise pressure."
        : "Best judged close to start time once court assignment, conditions and player workload are clear.",
    audience: sameTournamentCount > 1
      ? "Best for fans following the whole tournament day; related matches from the same event are linked below."
      : "Best for fans of either player or viewers checking legal ways to watch this specific matchup.",
  };
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

function getRelatedMatchStatusScore(status: string) {
  const normalized = normalizeStatus(status);

  if (normalized === "LIVE") return 40;
  if (normalized === "SUSPENDED") return 35;
  if (normalized === "UPCOMING") return 25;

  return 5;
}

function getRelatedMatchStartScore(startTime: string | null) {
  if (!startTime) return 0;

  const timestamp = new Date(startTime).getTime();
  if (Number.isNaN(timestamp)) return 0;

  const hoursFromNow = (timestamp - Date.now()) / (1000 * 60 * 60);

  if (hoursFromNow >= 0 && hoursFromNow <= 6) return 18;
  if (hoursFromNow > 6 && hoursFromNow <= 24) return 10;
  if (hoursFromNow < 0 && hoursFromNow >= -3) return 6;

  return 0;
}

function getRelatedMatchScore(match: Match, item: Match) {
  const playerNames = [match.player1.toLowerCase(), match.player2.toLowerCase()];
  const tournament = match.tournament.toLowerCase();

  return (
    getRelatedMatchStatusScore(item.status) +
    getRelatedMatchStartScore(item.startTime) +
    (item.tournament.toLowerCase() === tournament ? 16 : 0) +
    (item.category === match.category ? 8 : 0) +
    (playerNames.includes(item.player1.toLowerCase()) ||
    playerNames.includes(item.player2.toLowerCase())
      ? 20
      : 0)
  );
}

function getRelatedMatches(match: Match, matches: Match[]) {
  return matches
    .filter((item) => item.id !== match.id && !isFinished(item.status))
    .map((item) => ({
      item,
      score: getRelatedMatchScore(match, item),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;

      const aTime = a.item.startTime ? new Date(a.item.startTime).getTime() : Number.MAX_SAFE_INTEGER;
      const bTime = b.item.startTime ? new Date(b.item.startTime).getTime() : Number.MAX_SAFE_INTEGER;

      return aTime - bTime;
    })
    .map(({ item }) => item)
    .slice(0, 6);
}


type RelatedCoverageLink = {
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  priority: number;
};

function buildRelatedCoverageLinks(match: Match, matches: Match[]) {
  const player1Url = isDoublesTeam(match.player1) ? null : safePlayerUrl(match.player1);
  const player2Url = isDoublesTeam(match.player2) ? null : safePlayerUrl(match.player2);
  const tournamentSlug = slugify(match.tournament);
  const sameTournamentMatches = getRelatedMatches(match, matches).slice(0, 2);

  const links: RelatedCoverageLink[] = [
    {
      title: `${match.tournament} hub`,
      eyebrow: "Tournament",
      description: "Open the tournament page for more matches, schedules and live coverage from the same event.",
      href: `/tournament/${tournamentSlug}`,
      priority: 70,
    },
    {
      title: "Today’s tennis schedule",
      eyebrow: "Schedule",
      description: "See the full tennis schedule for today, including live, upcoming and completed matches.",
      href: "/tennis-schedule-today",
      priority: 55,
    },
    {
      title: "Legal tennis streaming guide",
      eyebrow: "Watching",
      description: "Compare official ways to watch tennis online without using unsafe or unauthorized streams.",
      href: "/best-ways-to-watch-tennis-online",
      priority: 35,
    },
  ];

  if (player1Url) {
    links.push({
      title: `${match.player1} player hub`,
      eyebrow: "Player",
      description: `Follow ${match.player1} matches, schedules and tournament context.`,
      href: player1Url,
      priority: 90,
    });
  }

  if (player2Url) {
    links.push({
      title: `${match.player2} player hub`,
      eyebrow: "Player",
      description: `Follow ${match.player2} matches, schedules and tournament context.`,
      href: player2Url,
      priority: 88,
    });
  }

  for (const relatedMatch of sameTournamentMatches) {
    links.push({
      title: `${relatedMatch.player1} vs ${relatedMatch.player2}`,
      eyebrow: "Related match",
      description: `${relatedMatch.tournament} • ${getMatchPhase(relatedMatch)} • ${formatShortTime(relatedMatch.startTime)}`,
      href: `/watch/${getMatchSlug(relatedMatch)}`,
      priority: 65,
    });
  }

  if (isGrandSlamTournament(match.tournament)) {
    links.push({
      title: "Grand Slam live coverage",
      eyebrow: "Grand Slam",
      description: "Open the Grand Slam hub for live matches, schedules and major tournament coverage.",
      href: "/grand-slam-live",
      priority: 50,
    });
  }

  return links
    .filter((link, index, list) => list.findIndex((item) => item.href === link.href) === index)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 8);
}

function RelatedCoverageEngine({
  match,
  matches,
}: {
  match: Match;
  matches: Match[];
}) {
  const links = buildRelatedCoverageLinks(match, matches);

  return (
    <section className="mb-12 rounded-[2rem] border border-green-500/25 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_35%),#09090b] p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-green-400">
            Related tennis coverage
          </p>
          <h2 className="text-3xl font-black">Keep following this matchup</h2>
        </div>
        <Link href="/tennis-schedule-today" className="text-sm font-bold text-green-400 hover:text-green-300">
          Open today’s schedule →
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-3xl border border-zinc-800 bg-black/70 p-5 transition hover:border-green-500 hover:bg-zinc-950"
          >
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-green-400">
              {link.eyebrow}
            </p>
            <h3 className="mb-3 text-xl font-black leading-tight group-hover:text-green-300">
              {link.title}
            </h3>
            <p className="text-sm leading-6 text-zinc-400">{link.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
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
  const liveMatch = matchId ? await getServerMatchById(matchId, 60) : null;
  const archivedMatch = matchId
    ? liveMatch || getArchivedMatch(matchId) || await getArchivedMatchFromDatabase(matchId)
    : null;
  const indexableArchivedMatch = archivedMatch && !isActiveMatchStatus(archivedMatch.status)
    ? archivedMatch
    : null;
  const readableTitle = archivedMatch
    ? `${archivedMatch.player1} vs ${archivedMatch.player2}`
    : titleCaseMatchName(decodedSlug.replace(/-\d+$/, "").replace(/-/g, " "));
  const isLiveMatch = liveMatch ? isLive(liveMatch.status) : false;
  return {
    title: buildWatchSeoTitle(readableTitle, isLiveMatch),
    description: buildWatchSeoDescription(readableTitle, isLiveMatch),
    // AdSense quality: /watch/* depends on changing match data. Only archived
    // matches with stable local content can be indexed; live/missing URLs stay noindex.
    robots: robotsFor({ index: Boolean(indexableArchivedMatch) }),
    alternates: {
      canonical: canonicalUrl(`/watch/${slug}`),
    },
    openGraph: {
      title: buildWatchSeoTitle(readableTitle, isLiveMatch),
      description: buildWatchSeoDescription(readableTitle, isLiveMatch),
      url: canonicalUrl(`/watch/${slug}`),
      siteName: "Watch Tennis Today",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: buildWatchSeoTitle(readableTitle, isLiveMatch),
      description: buildWatchSeoDescription(readableTitle, isLiveMatch),
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
        <Link href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </Link>

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

  const directLiveMatch = await getServerMatchById(matchId, 30);

  if (directLiveMatch) {
    const matches = await getServerMatches(60);
    return <CurrentMatchPage match={directLiveMatch} slug={slug} relatedMatchesSource={matches.length > 0 ? matches : [directLiveMatch]} />;
  }

  const localArchivedMatch = getArchivedMatch(matchId);

  if (localArchivedMatch && !isActiveMatchStatus(localArchivedMatch.status)) {
    return <ArchivedMatchPage archivedMatch={localArchivedMatch} />;
  }

  const databaseArchivedMatch = await getArchivedMatchFromDatabase(matchId);

  if (databaseArchivedMatch && !isActiveMatchStatus(databaseArchivedMatch.status)) {
    return <ArchivedMatchPage archivedMatch={databaseArchivedMatch} />;
  }

  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";

  // Crawlers frequently request stale /watch/* URLs. Do not spend server time
  // loading the live match feed for pages that are likely gone from the current
  // schedule. If no safe archived fallback can be built, return 404 instead of
  // redirecting stale watch URLs into indexable schedule pages.
  if (isCrawlerUserAgent(userAgent)) {
    const fallbackMatch = getFallbackMatchFromSlug(decodedSlug, matchId);

    if (fallbackMatch) {
      return <ArchivedMatchPage archivedMatch={fallbackMatch} />;
    }

    notFound();
  }

  const matches = await getServerMatches(60);
  const liveMatch = matches.find((item) => String(item.id) === String(matchId)) || null;

  if (!liveMatch) {
    const fallbackMatch = getFallbackMatchFromSlug(decodedSlug, matchId);

    if (fallbackMatch) {
      return <ArchivedMatchPage archivedMatch={fallbackMatch} />;
    }

    notFound();
  }

  return <CurrentMatchPage match={liveMatch} slug={slug} relatedMatchesSource={matches} />;
}

function CurrentMatchPage({
  match,
  slug,
  relatedMatchesSource,
}: {
  match: Match;
  slug: string;
  relatedMatchesSource?: Match[];
}) {
  const matches = relatedMatchesSource || [match];

  const tournamentSlug = slugify(match.tournament);
  const currentUrl = `https://watchtennistoday.com/watch/${slug}`;
  const matchTitle = `${match.player1} vs ${match.player2}`;
  const scoreDisplay = getScoreDisplay(match);
  const countryLinks = buildCountryWatchLinks(match);
  const relatedMatches = getRelatedMatches(match, matches);
  const player1Url = isDoublesTeam(match.player1) ? null : safePlayerUrl(match.player1);
  const player2Url = isDoublesTeam(match.player2) ? null : safePlayerUrl(match.player2);
  const round = getOptionalMatchDetail(match, "round");
  const court = getOptionalMatchDetail(match, "court");
  const surface = getOptionalMatchDetail(match, "surface");
  const lastUpdated = getLastUpdatedLabel();
  const watchability = getWatchability(match, matches);
  const playerDescription =
    playerDescriptions[match.player1.toLowerCase()] ||
    playerDescriptions[match.player2.toLowerCase()] ||
    "Follow tennis match schedules, score context, tournament details and official broadcaster information.";
  const matchEditorialContext = buildMatchEditorialContext(match);

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
    startDate: match.startTime || undefined,
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

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: buildWatchSeoTitle(matchTitle, isLive(match.status)),
    description: buildWatchSeoDescription(matchTitle, isLive(match.status)),
    url: currentUrl,
    dateModified: new Date().toISOString(),
    about: {
      "@type": "SportsEvent",
      name: matchTitle,
      sport: "Tennis",
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Watch Tennis Today",
      url: "https://watchtennistoday.com",
    },
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
          <Link href="/" className="hover:text-white">Home</Link> /{" "}
          <Link href="/watch" className="hover:text-white">Watch</Link> /{" "}
          <Link href={`/tournament/${tournamentSlug}`} className="hover:text-white">{match.tournament}</Link>
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
                    <Link href={player1Url} className="hover:text-green-400">
                      {match.player1}
                    </Link>
                  ) : (
                    <span>{match.player1}</span>
                  )}
                  <span className="block text-zinc-500">vs</span>
                  {player2Url ? (
                    <Link href={player2Url} className="hover:text-green-400">
                      {match.player2}
                    </Link>
                  ) : (
                    <span>{match.player2}</span>
                  )}
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-zinc-300">
                  Follow {matchTitle} with match timing, score context, tournament details and official viewing information. This page links only to legal broadcaster and schedule sources.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="text-xs font-black uppercase text-zinc-500">Local start time</p>
                    <p className="mt-1 font-black">{formatLocalDateTime(match.startTime)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="text-xs font-black uppercase text-zinc-500">Status</p>
                    <p className="mt-1 font-black">{getMatchPhase(match)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <p className="text-xs font-black uppercase text-zinc-500">Last updated</p>
                    <p className="mt-1 font-black">{lastUpdated}</p>
                  </div>
                  {round ? (
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <p className="text-xs font-black uppercase text-zinc-500">Round</p>
                      <p className="mt-1 font-black">{round}</p>
                    </div>
                  ) : null}
                  {court ? (
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <p className="text-xs font-black uppercase text-zinc-500">Court</p>
                      <p className="mt-1 font-black">{court}</p>
                    </div>
                  ) : null}
                  {surface ? (
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                      <p className="text-xs font-black uppercase text-zinc-500">Surface</p>
                      <p className="mt-1 font-black">{surface}</p>
                    </div>
                  ) : null}
                </div>
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
              <Link href="#where-to-watch" className="rounded-2xl bg-green-500 px-6 py-4 font-black text-black transition-all hover:bg-green-400">
                Where to watch
              </Link>
              <Link href="/today" className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 font-black text-white transition-all hover:bg-white/15">
                Today’s schedule
              </Link>
              <Link href={`/tournament/${tournamentSlug}`} className="rounded-2xl border border-white/10 bg-white/10 px-6 py-4 font-black text-white transition-all hover:bg-white/15">
                Tournament page
              </Link>
              <LocalMatchFollowButton
                match={{
                  id: match.id,
                  player1: match.player1,
                  player2: match.player2,
                  tournament: match.tournament,
                  category: match.category,
                  status: match.status,
                  score: match.score,
                  startTime: match.startTime,
                  slug: getMatchSlug(match),
                }}
              />
            </div>
          </section>

          <div className="p-6 md:p-10">
            <section className="mb-8 rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-5 text-sm leading-7 text-yellow-100">
              <strong>Legal streaming notice:</strong> Watch Tennis Today does not host or embed live streams. We help users find official and legal broadcasters and streaming options.
            </section>

            <section className="mb-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-green-400">Match details</p>
              <h2 className="mb-5 text-3xl font-black">Match Details</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-3xl border border-zinc-800 bg-black p-5">
                  <p className="mb-2 text-sm text-zinc-500">Players</p>
                  <p className="text-lg font-black">{match.player1} vs {match.player2}</p>
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-black p-5">
                  <p className="mb-2 text-sm text-zinc-500">Tournament</p>
                  <Link href={`/tournament/${tournamentSlug}`} className="text-lg font-black hover:text-green-400">{match.tournament}</Link>
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-black p-5">
                  <p className="mb-2 text-sm text-zinc-500">Local start time</p>
                  <p className="text-lg font-black">{formatLocalDateTime(match.startTime)}</p>
                </div>
                {round ? (
                  <div className="rounded-3xl border border-zinc-800 bg-black p-5">
                    <p className="mb-2 text-sm text-zinc-500">Round</p>
                    <p className="text-lg font-black">{round}</p>
                  </div>
                ) : null}
                {court ? (
                  <div className="rounded-3xl border border-zinc-800 bg-black p-5">
                    <p className="mb-2 text-sm text-zinc-500">Court</p>
                    <p className="text-lg font-black">{court}</p>
                  </div>
                ) : null}
                {surface ? (
                  <div className="rounded-3xl border border-zinc-800 bg-black p-5">
                    <p className="mb-2 text-sm text-zinc-500">Surface</p>
                    <p className="text-lg font-black">{surface}</p>
                  </div>
                ) : null}
              </div>
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

            <MatchReminderPanel
              matchTitle={matchTitle}
              tournament={match.tournament}
              status={match.status}
              startTime={match.startTime}
              matchUrl={currentUrl}
            />

            <div className="mb-8 text-zinc-950">
              <PlayerFollowCTA
                playerName={match.player1}
                source="match-page-player-follow-cta"
              />
            </div>

            <div className="mb-8 text-zinc-950">
              <LegalStreamingOptions title={`Legal streaming options for ${matchTitle}`} />
            </div>

            <MatchEdgePredictor match={match} matches={matches} />

            <section className="mb-12 rounded-[2rem] border border-green-500/30 bg-green-500/10 p-6">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-green-400">
                Watch guide
              </p>
              <h2 className="mb-4 text-3xl font-black">Should I Watch This Match?</h2>
              <p className="mb-5 max-w-3xl leading-8 text-zinc-300">
                This guide uses available schedule, status, tournament and round context only. It does not invent rankings, odds or prediction data.
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-3xl border border-green-500/20 bg-black p-5">
                  <h3 className="mb-2 text-xl font-black">Entertainment rating</h3>
                  <p className="leading-7 text-zinc-300">{watchability.entertainment}</p>
                </div>
                <div className="rounded-3xl border border-green-500/20 bg-black p-5">
                  <h3 className="mb-2 text-xl font-black">Ranking importance</h3>
                  <p className="leading-7 text-zinc-300">{watchability.rankingImportance}</p>
                </div>
                <div className="rounded-3xl border border-green-500/20 bg-black p-5">
                  <h3 className="mb-2 text-xl font-black">Upset potential</h3>
                  <p className="leading-7 text-zinc-300">{watchability.upsetPotential}</p>
                </div>
                <div className="rounded-3xl border border-green-500/20 bg-black p-5">
                  <h3 className="mb-2 text-xl font-black">Expected intensity</h3>
                  <p className="leading-7 text-zinc-300">{watchability.intensity}</p>
                </div>
                <div className="rounded-3xl border border-green-500/20 bg-black p-5 md:col-span-2">
                  <h3 className="mb-2 text-xl font-black">Best for</h3>
                  <p className="leading-7 text-zinc-300">{watchability.audience}</p>
                </div>
              </div>
            </section>

            <RelatedCoverageEngine match={match} matches={matches} />


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

            <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-black p-6">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-green-400">Editorial preview</p>
              <h2 className="mb-4 text-3xl font-black">{matchEditorialContext.title}</h2>
              <div className="grid gap-5 md:grid-cols-3">
                <p className="leading-8 text-zinc-300 md:col-span-1">{matchEditorialContext.preview}</p>
                <p className="leading-8 text-zinc-300 md:col-span-1">{matchEditorialContext.scheduleNote}</p>
                <p className="leading-8 text-zinc-300 md:col-span-1">{matchEditorialContext.tournamentNote}</p>
              </div>
            </section>

            <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-green-400">Player comparison</p>
              <h2 className="mb-4 text-3xl font-black">Player Comparison</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-zinc-800 bg-black p-5">
                  <h3 className="mb-2 text-2xl font-black">{match.player1}</h3>
                  <p className="leading-7 text-zinc-300">
                    {playerDescriptions[match.player1.toLowerCase()] || "No verified player style note is available in the current editorial data. Use the player page and official match feed for schedule context."}
                  </p>
                  {player1Url ? (
                    <Link href={player1Url} className="mt-4 inline-block rounded-2xl border border-zinc-700 px-4 py-3 font-black hover:border-green-400">
                      Open {match.player1} page
                    </Link>
                  ) : null}
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-black p-5">
                  <h3 className="mb-2 text-2xl font-black">{match.player2}</h3>
                  <p className="leading-7 text-zinc-300">
                    {playerDescriptions[match.player2.toLowerCase()] || "No verified player style note is available in the current editorial data. Use the player page and official match feed for schedule context."}
                  </p>
                  {player2Url ? (
                    <Link href={player2Url} className="mt-4 inline-block rounded-2xl border border-zinc-700 px-4 py-3 font-black hover:border-green-400">
                      Open {match.player2} page
                    </Link>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-black p-6">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-green-400">Recent form</p>
              <h2 className="mb-4 text-3xl font-black">Recent Form</h2>
              <p className="max-w-3xl leading-8 text-zinc-300">
                Verified recent-form data is shown only when it is available from the current match feed or official sources. This page does not infer wins, losses or form streaks from incomplete data.
              </p>
            </section>

            <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-green-400">
                What to watch for
              </p>
              <h2 className="mb-4 text-3xl font-black">
                Match factors for {matchTitle}
              </h2>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-3xl border border-zinc-800 bg-black p-5">
                  <h3 className="mb-2 text-xl font-black">Head-to-head context</h3>
                  <p className="leading-8 text-zinc-300">
                    If an official head-to-head record is available from the ATP,
                    WTA or tournament site, use it together with surface and
                    current form rather than reading the record alone. A previous
                    meeting on clay, grass or indoor hard court may not translate
                    cleanly to {match.tournament}.
                  </p>
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-black p-5">
                  <h3 className="mb-2 text-xl font-black">Surface and tournament relevance</h3>
                  <p className="leading-8 text-zinc-300">
                    {match.tournament} gives this match its viewing context:
                    surface speed, round pressure, court assignment and local
                    broadcast rights all affect how fans should prepare. Confirm
                    the order of play and official broadcaster before the listed
                    start time.
                  </p>
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-black p-5">
                  <h3 className="mb-2 text-xl font-black">Why it matters</h3>
                  <p className="leading-8 text-zinc-300">
                    This page is useful beyond the score because it connects the
                    match to schedule changes, legal viewing routes, tournament
                    context and related player pages. Those checks help avoid
                    thin live-score pages that leave users guessing where to go
                    next.
                  </p>
                </div>
                <div className="rounded-3xl border border-zinc-800 bg-black p-5">
                  <h3 className="mb-2 text-xl font-black">Viewing route</h3>
                  <p className="leading-8 text-zinc-300">
                    Start with the country guides and official directories linked
                    below, then verify availability with the broadcaster. Tennis
                    rights can differ by event, court, session and viewer
                    location.
                  </p>
                </div>
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

            <div className="mb-12">
              <EmailCapture
                title="Get tennis viewing updates without searching every day"
                description={`Optional email updates for ${matchTitle}: schedule changes, match status and official viewing guidance only.`}
                placeholder="Email for match alerts"
                buttonText="Notify me"
                contextType="watch"
                contextValue={matchTitle}
                dark
              />
            </div>

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
                  {relatedMatches.map((item) => {
                    const relatedPlayer1Url = isDoublesTeam(item.player1) ? null : safePlayerUrl(item.player1);
                    const relatedPlayer2Url = isDoublesTeam(item.player2) ? null : safePlayerUrl(item.player2);

                    return (
                      <article key={item.id} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 transition-all hover:border-green-500">
                        <a href={`/watch/${getMatchSlug(item)}`} className="block">
                          <div className="mb-3 flex justify-between gap-3">
                            <span className={`rounded-full px-3 py-1 text-xs font-black ${getStatusStyles(item.status)}`}>{item.status}</span>
                            <span className="text-sm text-zinc-500">{item.category}</span>
                          </div>
                          <h3 className="mb-2 text-xl font-black">{item.player1} vs {item.player2}</h3>
                          <p className="text-sm text-zinc-400">{item.tournament}</p>
                          <p className="mt-2 text-xs font-semibold text-zinc-500">{formatShortTime(item.startTime)}</p>
                        </a>

                        {(relatedPlayer1Url || relatedPlayer2Url) ? (
                          <div className="mt-4 flex flex-wrap gap-2 border-t border-zinc-900 pt-4 text-xs font-bold">
                            {relatedPlayer1Url ? (
                              <a href={relatedPlayer1Url} className="rounded-full bg-zinc-900 px-3 py-1 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                                {item.player1}
                              </a>
                            ) : null}
                            {relatedPlayer2Url ? (
                              <a href={relatedPlayer2Url} className="rounded-full bg-zinc-900 px-3 py-1 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                                {item.player2}
                              </a>
                            ) : null}
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null}

            <AdSlot label="Advertisement" />
            <ContentQualityNotice pageType="match page" />
            <RelatedMoneyLinks playerName={match.player1} player2Name={match.player2} />

            <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="mb-4 text-3xl font-black">Sources and Verification</h2>
              <p className="max-w-3xl leading-8 text-zinc-300">
                Match pages combine current tennis feed data, archived match records, official broadcaster checks and editorial review. Start times, scores, courts and availability can change, so verify final details with the tournament or licensed broadcaster before match time.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm font-black">
                <Link href="/how-we-source-data" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-green-400">How we source data</Link>
                <Link href="/how-we-verify-streams" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-green-400">How we verify streams</Link>
                <Link href="/editorial-policy" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-green-400">Editorial policy</Link>
                <Link href="/contact" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-green-400">Report outdated info</Link>
              </div>
            </section>

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
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

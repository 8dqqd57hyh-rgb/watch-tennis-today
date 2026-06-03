import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import VpnPromo from "@/app/components/VpnPromo";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import { players, type PlayerSlug } from "@/data/players";
import { getCanonicalPlayerSlug, matchContainsExactPlayer, normalizePlayerName, playerNameFromSlug } from "@/data/playerSlugs";
import PlayerSubscribeBox from "@/app/components/PlayerSubscribeBox";
import LocalPlayerFollowButton from "@/app/components/LocalPlayerFollowButton";
import ContentQualityNotice from "@/app/components/ContentQualityNotice";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";

export const dynamic = "force-dynamic";

const CURRENT_SEASON = new Date().getFullYear();

function buildPlayerSeoTitle(playerName: string) {
  return `Watch ${playerName} Live Today: Next Match, Schedule & Results`;
}

function buildPlayerSeoDescription(playerName: string) {
  return `Watch ${playerName} live today with next match time, recent results, tournament context and legal tennis TV and streaming information.`;
}

export async function generateStaticParams() {
  // Keep player pages on-demand. Prebuilding every player page makes Vercel
  // spend a long time in Collecting page data and can stall deployments.
  return [];
}

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score: string;
  startTime: string;
  winner?: string | null;
  winnerId?: string | number | null;
  round?: string;
};


const PLAYER_SLUGS = Object.keys(players) as PlayerSlug[];

const PRIORITY_PLAYERS: PlayerSlug[] = [
  "jannik-sinner",
  "carlos-alcaraz",
  "novak-djokovic",
  "daniil-medvedev",
  "alexander-zverev",
  "holger-rune",
  "taylor-fritz",
  "iga-swiatek",
  "aryna-sabalenka",
  "coco-gauff",
  "elena-rybakina",
  "jessica-pegula",
  "naomi-osaka",
  "mirra-andreeva",
];

function getStatusPriority(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === "LIVE") return 0;
  if (normalized === "SUSPENDED") return 1;
  if (normalized === "UPCOMING") return 2;

  return 3;
}

function getMatchTime(match: Match) {
  const timestamp = new Date(match.startTime || "").getTime();

  return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
}

function sortMatchesByUserIntent(a: Match, b: Match) {
  const statusDiff = getStatusPriority(a.status) - getStatusPriority(b.status);
  if (statusDiff !== 0) return statusDiff;

  return getMatchTime(a) - getMatchTime(b);
}

function getPlayerSlugByName(name: string) {
  const normalizedName = normalizePlayerName(name);

  return PLAYER_SLUGS.find((playerSlug) =>
    normalizePlayerName(players[playerSlug].name) === normalizedName
  );
}

function uniquePlayerSlugs(slugs: (PlayerSlug | undefined | null)[]) {
  const seen = new Set<PlayerSlug>();

  return slugs.filter((slug): slug is PlayerSlug => {
    if (!slug || seen.has(slug)) return false;

    seen.add(slug);
    return true;
  });
}

function getRelatedPlayers(
  currentSlug: PlayerSlug | null,
  playerMatches: Match[]
) {
  const currentTour = currentSlug ? players[currentSlug].tour : null;

  const opponentsFromMatches = playerMatches.flatMap((match) => [
    getPlayerSlugByName(match.player1),
    getPlayerSlugByName(match.player2),
  ]);

  const sameTourPriority = PRIORITY_PLAYERS.filter((playerSlug) =>
    playerSlug !== currentSlug &&
    (!currentTour || players[playerSlug].tour === currentTour)
  );

  const sameTourFallback = PLAYER_SLUGS.filter((playerSlug) =>
    playerSlug !== currentSlug &&
    (!currentTour || players[playerSlug].tour === currentTour)
  );

  const otherPopularPlayers = PRIORITY_PLAYERS.filter((playerSlug) =>
    playerSlug !== currentSlug &&
    Boolean(currentTour && players[playerSlug].tour !== currentTour)
  );

  return uniquePlayerSlugs([
    ...opponentsFromMatches,
    ...sameTourPriority,
    ...sameTourFallback,
    ...otherPopularPlayers,
  ]).slice(0, 8);
}

function formatPlayerName(slug?: string) {
  const canonicalSlug = getCanonicalPlayerSlug(slug || "");
  return canonicalSlug ? players[canonicalSlug].name : playerNameFromSlug(slug || "");
}

function isIndexablePlayerSlug(slug: string) {
  return Boolean(getCanonicalPlayerSlug(slug));
}

function getPlayerDisplay(slug: string) {
  const canonicalSlug = getCanonicalPlayerSlug(slug);
  const safeSlug = slugify(slug || "tennis-player") || "tennis-player";

  return {
    canonicalSlug,
    pageSlug: canonicalSlug || safeSlug,
    playerName: canonicalSlug ? players[canonicalSlug].name : playerNameFromSlug(safeSlug),
    isVerifiedPlayer: Boolean(canonicalSlug),
  };
}

function matchContainsPlayerText(match: Match, slug: string) {
  const canonicalSlug = getCanonicalPlayerSlug(slug);

  if (canonicalSlug) {
    return matchContainsExactPlayer(match, canonicalSlug);
  }

  const target = normalizePlayerName(slug.replace(/-/g, " "));
  if (!target) return false;

  const fields = [match.player1, match.player2];

  return fields.some((value) => {
    const normalized = normalizePlayerName(value || "");
    return normalized === target || normalized.split(" ").includes(target);
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { playerName, pageSlug } = getPlayerDisplay(slug);
  const indexable = isIndexablePlayerSlug(slug);

  return {
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    title: buildPlayerSeoTitle(playerName),
    description: buildPlayerSeoDescription(playerName),
    alternates: {
      canonical: `https://watchtennistoday.com/player/${pageSlug}`,
    },
    openGraph: {
      title: buildPlayerSeoTitle(playerName),
      description: buildPlayerSeoDescription(playerName),
      url: `https://watchtennistoday.com/player/${pageSlug}`,
      siteName: "Watch Tennis Today",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: buildPlayerSeoTitle(playerName),
      description: buildPlayerSeoDescription(playerName),
    },
  };
}

async function getBaseUrl() {
  const headersList = await headers();

  const host = headersList.get("host");

  if (!host) {
    return "http://localhost:3000";
  }

  const protocol = host.includes("localhost")
    ? "http"
    : "https";

  return `${protocol}://${host}`;
}

async function getMatches(
  playerName?: string,
  options: { daysBack?: number; daysForward?: number; formHistory?: boolean } = {}
): Promise<Match[]> {
  try {
    const baseUrl = await getBaseUrl();
    const params = new URLSearchParams({
      includeFinished: "1",
      daysBack: String(options.daysBack ?? 120),
      daysForward: String(options.daysForward ?? 45),
    });

    if (options.formHistory) {
      params.set("formHistory", "1");
    }

    if (playerName) {
      params.set("playerName", playerName);
    }

    const response = await fetch(`${baseUrl}/api/matches?${params.toString()}`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error("/api/matches failed:", response.status);
      return [];
    }

    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error("/api/matches returned non-JSON:", text.slice(0, 300));
      return [];
    }

    const data = await response.json();

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.matches)) {
      return data.matches;
    }
  } catch (error) {
    console.error("/api/matches request failed on player page:", error);
  }

  return [];
}

function mergeMatchesById(matches: Match[]) {
  return Array.from(new Map(matches.map((match) => [String(match.id), match])).values());
}

async function getMatchesForPlayer(playerName: string): Promise<Match[]> {
  try {
    const playerScopedMatches = await getMatches(playerName, { daysBack: 365, daysForward: 45, formHistory: true });

    const scopedPlayerMatches = playerScopedMatches.filter((match) =>
      [match.player1, match.player2].some((name) => doPlayerNamesMatch(name || "", playerName))
    );

    const scopedCompletedSingles = scopedPlayerMatches
      .filter(isSinglesMatchForPlayerForm)
      .filter((match) => isFinishedMatch(match));

    // Player pages must not depend on the form-history feed. If the scoped
    // player lookup is thin, try a broad archive scan; if that fails, render the
    // player page with the data already available instead of returning 404.
    const globalMatches = scopedCompletedSingles.length >= 5
      ? []
      : await getMatches(undefined, { daysBack: 365, daysForward: 0, formHistory: true });

    const localMatches = globalMatches.filter((match) =>
      [match.player1, match.player2].some((name) => doPlayerNamesMatch(name || "", playerName))
    );

    return mergeMatchesById([...playerScopedMatches, ...localMatches]);
  } catch (error) {
    console.error("Player form history lookup failed:", error);
    return [];
  }
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
  const readablePart = slugify(
    `${match.player1}-vs-${match.player2}`
  );

  const numericId = match.id.split(":").pop();

  return `${readablePart}-${numericId}`;
}

function formatMatchDateTime(value?: string) {
  if (!value) return "Time to be announced";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time to be announced";

  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function isInitialNamePart(value?: string) {
  return /^[a-z]$/i.test(String(value || "").replace(/\./g, ""));
}

function doPlayerNamesMatch(candidateName: string, targetName: string) {
  const candidate = normalizePlayerName(candidateName || "").replace(/\./g, "");
  const target = normalizePlayerName(targetName || "").replace(/\./g, "");

  if (!candidate || !target) return false;
  if (candidate === target) return true;

  const candidateParts = candidate.split(" ").filter(Boolean);
  const targetParts = target.split(" ").filter(Boolean);
  const candidateLast = candidateParts.at(-1);
  const targetLast = targetParts.at(-1);
  const candidateFirst = candidateParts[0];
  const targetFirst = targetParts[0];

  if (!candidateLast || !targetLast || !candidateFirst || !targetFirst) {
    return false;
  }

  // API feeds often abbreviate tennis names as "A. Zverev" / "A Zverev" while
  // player pages use the full display name "Alexander Zverev".
  if (candidateLast === targetLast && candidateFirst[0] === targetFirst[0]) {
    return true;
  }

  // API-Tennis H2H recent-player rows commonly use reversed abbreviated names,
  // e.g. "Zverev A.". Support surname + first initial so we do not drop Rome,
  // Madrid and other history rows before the form tracker can use them.
  if (candidateFirst === targetLast) {
    return candidateLast === targetFirst || (
      isInitialNamePart(candidateLast) && candidateLast[0] === targetFirst[0]
    );
  }

  if (targetFirst === candidateLast) {
    return targetLast === candidateFirst || (
      isInitialNamePart(targetLast) && targetLast[0] === candidateFirst[0]
    );
  }

  return false;
}

function getOpponentForPlayer(match: Match, playerName: string) {
  if (doPlayerNamesMatch(match.player1, playerName)) return match.player2;
  if (doPlayerNamesMatch(match.player2, playerName)) return match.player1;

  return `${match.player1} / ${match.player2}`;
}

function isLiveMatch(match: Match) {
  return match.status?.toUpperCase() === "LIVE" && !isFinishedMatch(match);
}

function hasUsableScore(match: Match) {
  const score = String(match.score || "").trim();
  return Boolean(score && score !== "-" && score !== "0-0" && score !== "0 - 0");
}

function isFinishedMatch(match: Match) {
  const normalized = match.status?.toUpperCase() || "";
  if (["FINISHED", "ENDED", "COMPLETED", "FINAL", "RETIRED", "WALKOVER"].includes(normalized)) {
    return true;
  }

  // Some live feeds keep a match marked LIVE after the score is already complete.
  // A clearly completed tennis score must be treated as FINAL everywhere.
  return Boolean(inferMatchWinnerSideFromScore(match));
}

function isUpcomingMatch(match: Match) {
  const normalized = match.status?.toUpperCase() || "";
  return ["UPCOMING", "SCHEDULED", "NOT_STARTED"].includes(normalized) || (!isLiveMatch(match) && !isFinishedMatch(match));
}

function getPlayerPageSummary(playerName: string, playerMatches: Match[]) {
  const liveMatches = playerMatches.filter(isLiveMatch);
  const upcomingMatches = playerMatches.filter(isUpcomingMatch);
  const finishedMatches = playerMatches.filter(isFinishedMatch);
  const nextMatch = liveMatches[0] || upcomingMatches[0] || playerMatches[0];
  const tournaments = Array.from(new Set(playerMatches.map((match) => match.tournament).filter(Boolean))).slice(0, 3);

  return {
    liveMatches,
    upcomingMatches,
    finishedMatches,
    nextMatch,
    tournaments,
    headline: liveMatches.length
      ? `${playerName} is live now`
      : nextMatch
        ? `Watch ${playerName} live today`
        : `${playerName} schedule and live stream guide`,
  };
}


type PlayerFormItem = {
  match: Match;
  result: "W" | "L";
  opponent: string;
};

function getPlayerSide(match: Match, playerName: string) {
  if (doPlayerNamesMatch(match.player1, playerName)) return "player1";
  if (doPlayerNamesMatch(match.player2, playerName)) return "player2";

  return null;
}

function parseSetScore(setScore: string) {
  const cleaned = setScore
    .replace(/\([^)]*\)/g, "")
    .replace(/[–—]/g, "-")
    .trim();

  const match = cleaned.match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return null;

  const first = Number.parseInt(match[1], 10);
  const second = Number.parseInt(match[2], 10);

  if (!Number.isFinite(first) || !Number.isFinite(second) || first === second) {
    return null;
  }

  return { first, second };
}

function getWinnerSideFromWinnerField(match: Match) {
  const winner = normalizePlayerName(String(match.winner || match.winnerId || ""));
  if (!winner) return null;

  const player1 = normalizePlayerName(match.player1 || "");
  const player2 = normalizePlayerName(match.player2 || "");

  if (["1", "first", "first player", "player1", "player 1", "home", "homeplayer", "event first player", "event_first_player"].includes(winner)) return "player1";
  if (["2", "second", "second player", "player2", "player 2", "away", "awayplayer", "event second player", "event_second_player"].includes(winner)) return "player2";
  if (winner === player1 || player1.includes(winner) || winner.includes(player1) || doPlayerNamesMatch(match.player1, winner)) return "player1";
  if (winner === player2 || player2.includes(winner) || winner.includes(player2) || doPlayerNamesMatch(match.player2, winner)) return "player2";

  return null;
}

function isCompletedTennisSet(first: number, second: number) {
  const high = Math.max(first, second);
  const low = Math.min(first, second);

  if (high >= 6 && high - low >= 2) return true;
  if (high === 7 && low >= 5) return true;

  return false;
}

function inferMatchWinnerSideFromScore(match: Match) {
  if (!match.score || match.score === "-") return null;

  const sets = match.score
    .split(/[,;]/)
    .map(parseSetScore)
    .filter((set): set is { first: number; second: number } => Boolean(set));

  if (!sets.length) return null;

  let player1Sets = 0;
  let player2Sets = 0;
  let incompleteSets = 0;

  for (const set of sets) {
    if (!isCompletedTennisSet(set.first, set.second)) {
      incompleteSets += 1;
      continue;
    }

    if (set.first > set.second) {
      player1Sets += 1;
    } else {
      player2Sets += 1;
    }
  }

  if (incompleteSets > 0) return null;
  if (player1Sets === player2Sets) return null;

  const requiredSets = sets.length >= 5 ? 3 : 2;

  if (player1Sets >= requiredSets && player1Sets > player2Sets) return "player1";
  if (player2Sets >= requiredSets && player2Sets > player1Sets) return "player2";

  return null;
}

function inferMatchWinnerSide(match: Match) {
  return getWinnerSideFromWinnerField(match) || inferMatchWinnerSideFromScore(match);
}

function canUseMatchInPlayerForm(match: Match) {
  if (getWinnerSideFromWinnerField(match)) return true;
  if (!isFinishedMatch(match)) return false;

  return Boolean(inferMatchWinnerSideFromScore(match));
}


function isSinglesMatchForPlayerForm(match: Match) {
  const searchable = [match.category, match.tournament, match.round, match.player1, match.player2]
    .join(" ")
    .toLowerCase();

  const isMainTourSingles = /\b(atp|wta)\b/.test(searchable);
  if (!isMainTourSingles) return false;

  return ![
    "double",
    "doubles",
    "mixed",
    "boys",
    "girls",
    "junior",
    "juniors",
    "wheelchair",
    "legend",
    "legends",
  ].some((blocked) => searchable.includes(blocked));
}

function buildPlayerForm(playerName: string, candidateMatches: Match[]) {
  const sortedMatches = [...candidateMatches]
    .filter(isSinglesMatchForPlayerForm)
    .filter((match) => isFinishedMatch(match))
    .sort((a, b) => getMatchTime(b) - getMatchTime(a));
  const excludedMatches: Match[] = [];
  const form: PlayerFormItem[] = [];

  for (const match of sortedMatches) {
    if (form.length >= 10) break;

    const playerSide = getPlayerSide(match, playerName);
    const winnerSide = inferMatchWinnerSide(match);

    if (!playerSide || !winnerSide || !canUseMatchInPlayerForm(match)) {
      excludedMatches.push(match);
      continue;
    }

    form.push({
      match,
      result: playerSide === winnerSide ? "W" : "L",
      opponent: getOpponentForPlayer(match, playerName),
    });
  }

  const wins = form.filter((item) => item.result === "W").length;
  const losses = form.filter((item) => item.result === "L").length;
  const winRate = form.length ? Math.round((wins / form.length) * 100) : null;

  let currentStreakType: "W" | "L" | null = null;
  let currentStreakCount = 0;

  for (const item of form) {
    if (!currentStreakType) {
      currentStreakType = item.result;
      currentStreakCount = 1;
      continue;
    }

    if (item.result === currentStreakType) {
      currentStreakCount += 1;
      continue;
    }

    break;
  }

  const allTournaments = Array.from(
    new Set(form.map((item) => item.match.tournament).filter(Boolean))
  );
  const tournaments = allTournaments.slice(0, 4);

  const tournamentSnapshots = tournaments.map((tournament) => {
    const matches = form.filter((item) => item.match.tournament === tournament);
    const wins = matches.filter((item) => item.result === "W").length;

    return {
      tournament,
      played: matches.length,
      wins,
      losses: matches.length - wins,
    };
  });

  const datedFormItems = form
    .map((item) => ({ item, timestamp: getMatchTime(item.match) }))
    .filter(({ timestamp }) => Number.isFinite(timestamp) && timestamp < Number.MAX_SAFE_INTEGER);

  const largestGapDays = datedFormItems.reduce((largestGap, current, index) => {
    const next = datedFormItems[index + 1];
    if (!next) return largestGap;

    const gapDays = Math.floor(Math.abs(current.timestamp - next.timestamp) / (1000 * 60 * 60 * 24));
    return Math.max(largestGap, gapDays);
  }, 0);

  const hasLargeDateGap = largestGapDays > 30;

  // Use win-rate/streak only when the available feed has enough continuous completed
  // singles rows to support a real recent-form read. Scattered archive rows are
  // useful as available results, but must not be presented as season/career form.
  const hasMeaningfulRecentHistory = form.length >= 5 && !hasLargeDateGap;
  const isPartialAvailableHistory = form.length > 0 && !hasMeaningfulRecentHistory;

  if (process.env.NODE_ENV !== "production") {
    console.info("Player form debug", {
      playerName,
      totalMatchesFound: candidateMatches.length,
      validMatchesUsed: form.length,
      hasLargeDateGap,
      largestGapDays,
      excludedMatches: excludedMatches.map((match) => ({
        id: match.id,
        player1: match.player1,
        player2: match.player2,
        status: match.status,
        score: match.score,
        winner: match.winner || null,
      })),
    });
  }

  return {
    form,
    wins,
    losses,
    winRate,
    currentStreakType,
    currentStreakCount,
    tournaments,
    tournamentSnapshots,
    hasMeaningfulRecentHistory,
    isPartialAvailableHistory,
    hasLargeDateGap,
    largestGapDays,
    debug: {
      playerName,
      totalMatchesFound: candidateMatches.length,
      validMatchesUsed: form.length,
      excludedMatches,
    },
  };
}


export default async function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { canonicalSlug, pageSlug, playerName, isVerifiedPlayer } = getPlayerDisplay(slug);

  const allMatches = await getMatchesForPlayer(playerName);



const playerMatches = allMatches
  .filter((match) =>
    [match.player1, match.player2].some((name) => doPlayerNamesMatch(name || "", playerName)) ||
    matchContainsPlayerText(match, pageSlug)
  )
  .sort(sortMatchesByUserIntent);

  const relatedPlayers = getRelatedPlayers(canonicalSlug, playerMatches);
  const sameTourLabel = canonicalSlug ? players[canonicalSlug].tour : "tennis";
  const pageSummary = getPlayerPageSummary(playerName, playerMatches);
  const { liveMatches, upcomingMatches, finishedMatches, nextMatch, tournaments, headline } = pageSummary;
  const currentTournament = tournaments[0] || finishedMatches[0]?.tournament || upcomingMatches[0]?.tournament || liveMatches[0]?.tournament || "Not listed";
  const playerForm = buildPlayerForm(playerName, playerMatches);

  if (process.env.NODE_ENV !== "production") {
    console.info("Player page match dataset debug", {
      playerName,
      matchCenterMatches: playerMatches.length,
      formMatches: playerForm.form.length,
      finishedMatches: finishedMatches.length,
      liveMatches: liveMatches.length,
    });
  }

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: playerName,
    url: `https://watchtennistoday.com/player/${pageSlug}`,
    sameAs: [],
    description: `${playerName} tennis match schedule, official viewing information and related player coverage on Watch Tennis Today.`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `When is ${playerName} playing next?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: nextMatch
            ? `${playerName}'s next listed match on this page is ${nextMatch.player1} vs ${nextMatch.player2} at ${nextMatch.tournament}. Start times can change during tournaments, so fans should confirm the official order of play before the match.`
            : `No upcoming match is currently listed for ${playerName}. Tennis schedules can change quickly because of draws, weather delays and withdrawals.`,
        },
      },
      {
        "@type": "Question",
        name: `Where can I watch ${playerName} live?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Legal viewing options for ${playerName} depend on the tournament and your country. Use official broadcasters, licensed streaming platforms and country viewing guides before using any stream.`,
        },
      },
      {
        "@type": "Question",
        name: `Which players are similar to ${playerName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `This page links to related ${sameTourLabel} player schedules and popular tennis profiles so fans can continue browsing match pages without duplicate content.`,
        },
      },
    ],
  };

  return (
    <main className="max-w-4xl mx-auto p-4">
        <nav className="text-sm text-zinc-400 mb-6 flex flex-wrap gap-2">
  <Link href="/" className="hover:text-white">
    Home
  </Link>

  <span>/</span>

  <a
    href="/players"
    className="hover:text-white"
  >
    Players
  </a>

  <span>/</span>

  <span className="text-white">
    {playerName}
  </span>
</nav>
      <section className="mb-8 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 text-white shadow-sm">
        <div className="p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-green-400 px-3 py-1 text-xs font-black uppercase tracking-wide text-black">
              {canonicalSlug ? players[canonicalSlug].tour : "Tennis"} player hub
            </span>
            {liveMatches.length ? (
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black uppercase tracking-wide text-white animate-pulse">
                Live now
              </span>
            ) : null}
          </div>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
            {headline}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300 md:text-lg">
            Follow {playerName} with today’s live match status, next opponent, recent results,
            tournament context and official tennis viewing guides in one place.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Live matches</p>
              <p className="mt-1 text-3xl font-black">{liveMatches.length}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Upcoming</p>
              <p className="mt-1 text-3xl font-black">{upcomingMatches.length}</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-400">Current tournament</p>
              <p className="mt-1 truncate text-2xl font-black">{currentTournament}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">
          Editorial player guide
        </p>
        <h2 className="text-2xl font-black text-zinc-950">
          How to follow {playerName} today
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="font-black text-zinc-950">Match context</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              This page combines live status, upcoming matches, recent available results and tournament links so fans can understand whether {playerName} is scheduled, live, finished or waiting for an updated order of play.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="font-black text-zinc-950">Legal viewing checks</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              Tennis broadcast rights depend on the event and viewer location. Before subscribing or clicking an external provider, confirm the tournament, court assignment and local broadcaster on official sources.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="font-black text-zinc-950">Schedule caution</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              Tennis start times can move when earlier matches run long, rain interrupts play or a player withdraws. Treat listed times as planning information and check the official order of play close to match time.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <h3 className="font-black text-zinc-950">Data transparency</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-600">
              Live score and schedule feeds may be incomplete for lower-level events. When the available feed is limited, this page avoids presenting partial data as full season form or guaranteed broadcast availability.
            </p>
          </div>
        </div>
      </section>

      {!isVerifiedPlayer ? (
        <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-sm leading-7 text-zinc-300">
          <p>
            This is a fallback tennis player schedule page created from a live-data slug.
            The player name has not been manually verified yet, so the page is kept out
            of search indexing while still giving crawlers and visitors a useful landing
            page instead of a 404.
          </p>
        </section>
      ) : null}

      <div className="mb-8">
        <LocalPlayerFollowButton
          playerName={playerName}
          playerSlug={pageSlug}
        />
      </div>

      {playerMatches.some(isLiveMatch) ? (
  <section className="mb-8 rounded-2xl border border-red-500 bg-red-500/10 p-6">
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <span className="bg-red-500 text-white text-sm font-black px-4 py-2 rounded-full animate-pulse">
        🔴 LIVE NOW
      </span>

      <span className="text-red-300 font-bold">
        {playerName} is currently playing live
      </span>
    </div>

    <p className="text-zinc-300 mb-5 leading-8">
      Follow the live match, score updates, official viewing information and current
      tournament coverage for {playerName}.
    </p>

    <div className="flex flex-wrap gap-3">
      {playerMatches
        .filter(isLiveMatch)
        .slice(0, 2)
        .map((match) => (
          <Link
            key={match.id}
            href={`/watch/${getMatchSlug(match)}`}
            className="rounded-2xl bg-red-500 px-5 py-3 font-black text-white hover:bg-red-400 transition-all"
          >
            Open Match Page →
          </Link>
        ))}
    </div>
  </section>
) : null}


      <section className="mb-8 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">
              Player form tracker
            </p>
            <h2 className="text-2xl font-black text-zinc-950">
              {playerName} recent results and form guide
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600">
              {playerForm.hasMeaningfulRecentHistory
                ? "Recent completed singles results from API-Tennis player history. Doubles, juniors, wheelchair and legends events are filtered out."
                : "Available feed results. This feed does not include every match from the player&apos;s season. Singles only, with doubles, juniors, wheelchair and legends events filtered out."}
            </p>
          </div>
          <span className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-black uppercase text-zinc-600">
            {playerForm.hasMeaningfulRecentHistory ? "Recent form" : "Available feed results"}
          </span>
        </div>

        {playerForm.form.length ? (
          <>
            <div className={`grid gap-4 ${playerForm.hasMeaningfulRecentHistory ? "lg:grid-cols-[1.35fr_0.9fr]" : ""}`}>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-bold text-zinc-600">
                    {playerForm.hasMeaningfulRecentHistory ? "Continuous form guide" : "Partial results found"}
                  </p>
                  <p className="text-xs font-black uppercase tracking-wide text-zinc-500">
                    {playerForm.form.length} match{playerForm.form.length === 1 ? "" : "es"}
                  </p>
                </div>

                {playerForm.hasMeaningfulRecentHistory ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {playerForm.form.map((item) => (
                      <a
                        key={item.match.id}
                        href={`/watch/${getMatchSlug(item.match)}`}
                        title={`${item.result === "W" ? "Won" : "Lost"} vs ${item.opponent}`}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-black transition hover:scale-105 ${
                          item.result === "W"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {item.result}
                      </a>
                    ))}
                  </div>
                ) : null}

                {!playerForm.hasMeaningfulRecentHistory ? (
                  <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm leading-7 text-amber-900">
                    This feed does not include every match from the player&apos;s season{playerForm.hasLargeDateGap ? ` and has a ${playerForm.largestGapDays}-day gap between available results` : ""}. These rows are shown as partial available results, not as recent form, season form or career form.
                  </p>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-zinc-600">
                    Winner is taken from the feed when available, otherwise inferred only from clearly completed tennis scores. Unclear rows are excluded.
                  </p>
                )}
              </div>

              {playerForm.hasMeaningfulRecentHistory ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-950 p-5 text-white">
                  <p className="text-sm font-bold text-zinc-400">Current streak</p>
                  <p className="mt-3 text-3xl font-black">
                    {playerForm.currentStreakType && playerForm.currentStreakCount
                      ? `${playerForm.currentStreakType === "W" ? "🔥" : "⚠️"} ${playerForm.currentStreakCount} ${playerForm.currentStreakType === "W" ? "win" : "loss"}${playerForm.currentStreakCount === 1 ? "" : "es"}`
                      : `${playerForm.wins}-${playerForm.losses}`}
                  </p>
                  <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-xs text-zinc-400">Wins</p>
                      <p className="text-xl font-black">{playerForm.wins}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-xs text-zinc-400">Losses</p>
                      <p className="text-xl font-black">{playerForm.losses}</p>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3">
                      <p className="text-xs text-zinc-400">Win rate</p>
                      <p className="text-xl font-black">
                        {playerForm.winRate !== null ? `${playerForm.winRate}%` : "TBC"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {playerForm.hasMeaningfulRecentHistory && playerForm.tournamentSnapshots.length ? (
              <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {playerForm.tournamentSnapshots.map((snapshot) => (
                  <div key={snapshot.tournament} className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <p className="truncate text-sm font-black text-zinc-950">{snapshot.tournament}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                      {snapshot.played} completed · {snapshot.wins}-{snapshot.losses}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-5 grid gap-3">
              {playerForm.form.slice(0, 10).map((item) => {
                const opponentSlug = getPlayerSlugByName(item.opponent);

                return (
                  <div
                    key={item.match.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 p-4"
                  >
                    <div>
                      <p className="font-black text-zinc-950">
                        {item.result === "W" ? "Won" : "Lost"} vs {opponentSlug ? (
                          <Link href={`/player/${opponentSlug}`} className="hover:text-green-600">
                            {item.opponent}
                          </Link>
                        ) : item.opponent}
                      </p>
                      <p className="mt-1 text-sm text-zinc-600">
                        {item.match.tournament} · {formatMatchDateTime(item.match.startTime)}
                      </p>
                    </div>
                    <a
                      href={`/watch/${getMatchSlug(item.match)}`}
                      className="rounded-xl border border-zinc-200 px-3 py-2 text-sm font-bold text-zinc-800 hover:border-green-500 hover:bg-green-50"
                    >
                      {item.match.score || "Open result"} →
                    </a>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm leading-7 text-zinc-600">
            <p className="font-bold text-zinc-800">No usable completed matches yet.</p>
            <p className="mt-2">
              The available feed does not currently provide completed singles results with a reliable winner for {playerName}. Doubles, juniors, wheelchair and legends events are intentionally excluded.
            </p>
          </div>
        )}
      </section>

      <section className="mb-8 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">
              Player match center
            </p>
            <h2 className="text-2xl font-black text-zinc-950">
              {playerName} live, next match and recent results
            </h2>
          </div>
          <Link href="/today" className="text-sm font-bold text-green-600 hover:text-green-500">
            Today’s full schedule →
          </Link>
        </div>

        {playerMatches.length > 0 ? (
          <div className="grid gap-3">
            {playerMatches.slice(0, 10).map((match) => {
              const live = isLiveMatch(match);
              const finished = isFinishedMatch(match);
              const opponent = getOpponentForPlayer(match, playerName);

              return (
                <article
                  key={match.id}
                  className="rounded-2xl border border-zinc-200 p-3 transition hover:border-green-500 hover:bg-green-50/40"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="mb-2 flex flex-wrap gap-2">
                        {live ? (
                          <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-black uppercase text-white animate-pulse">
                            Live
                          </span>
                        ) : !finished ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black uppercase text-green-700">
                            Next
                          </span>
                        ) : null}
                        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-600">
                          {match.category}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-zinc-950">
                        {match.player1} vs {match.player2}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-600">
                        Opponent/context: {opponent} · {formatMatchDateTime(match.startTime)}
                      </p>
                      {match.score ? (
                        <p className="mt-2 text-sm font-bold text-zinc-800">Score: {match.score}</p>
                      ) : null}
                    </div>

                    <a
                      href={`/tournament/${slugify(match.tournament)}`}
                      className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-bold text-zinc-600 hover:border-green-500 hover:text-green-600"
                    >
                      {match.tournament}
                    </a>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`/watch/${getMatchSlug(match)}`}
                      className="inline-flex items-center rounded-xl bg-black px-3 py-2 text-sm font-bold text-white hover:bg-zinc-800 transition-all"
                    >
                      {live ? "Follow live match" : finished ? "Open result" : "Open match"} →
                    </a>
                    <a
                      href={`/watch-player-live/${pageSlug}`}
                      className="inline-flex items-center rounded-xl border border-zinc-200 px-3 py-2 text-sm font-bold text-zinc-900 hover:border-green-500 hover:bg-white"
                    >
                      {playerName} live stream guide
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <>
            <p className="text-zinc-600 leading-7">
              No upcoming matches are currently listed for {playerName}. Tennis schedules can
              change quickly because of tournament draws, weather delays, withdrawals and TV
              scheduling updates.
            </p>

            <p className="mt-3 text-zinc-600 leading-7">
              You can still explore live tennis schedules, tournament pages and official
              broadcaster information to check where future {playerName} matches may be
              available legally.
            </p>
          </>
        )}
      </section>


      {tournaments.length ? (
        <section className="mb-10 rounded-3xl border border-zinc-200 bg-neutral-50 p-6">
          <h2 className="mb-3 text-2xl font-black text-zinc-950">
            Current tournament context for {playerName}
          </h2>
          <p className="mb-5 text-sm leading-7 text-zinc-600">
            These are the tournaments currently connected to {playerName} in today’s match feed.
            Use them for draw, schedule and TV coverage context.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((tournament) => (
              <a
                key={tournament}
                href={`/tournament/${slugify(tournament)}`}
                className="rounded-2xl border border-zinc-200 bg-white p-4 font-bold text-zinc-950 hover:border-green-500 hover:bg-green-50"
              >
                {tournament} →
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <RevenueConversionPanel context="player" playerName={playerName} />


      <section className="mb-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-600">
              Keep watching
            </p>
            <h2 className="text-2xl font-semibold">
              Related tennis players
            </h2>
          </div>
          <a href="/players" className="text-sm font-bold text-green-600 hover:text-green-500">
            All players →
          </a>
        </div>

        <p className="mb-5 text-sm leading-7 text-zinc-600">
          Similar player pages help fans continue from one schedule page to another without adding duplicate content or interrupting the reading experience.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {relatedPlayers.map((playerSlug) => {
            const player = players[playerSlug];
            const isSameTour = canonicalSlug
              ? player.tour === players[canonicalSlug].tour
              : false;

            return (
              <a
                key={playerSlug}
                href={`/player/${playerSlug}`}
                className="rounded-2xl border border-zinc-200 p-4 transition hover:border-green-500 hover:bg-green-50"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="font-bold">{player.name}</span>
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-black text-zinc-600">
                    {player.tour}
                  </span>
                </div>
                <p className="text-sm leading-6 text-zinc-600">
                  {isSameTour ? "Same tour schedule and live match coverage" : "Popular player schedule and TV coverage"}
                </p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-white">
        <h2 className="text-3xl font-black mb-5">
          📺 Where to Watch {playerName} Live
        </h2>

        <div className="space-y-5 text-zinc-300 leading-8">
          <p>
  Tennis fans can watch {playerName} live through official sports broadcasters,
  licensed streaming platforms and tournament TV partners, depending on country
  and tournament rights.
</p>

          <p>
            Coverage may include ATP Tour events, WTA tournaments, Grand Slams,
            Masters events and international competitions featuring {playerName}.
          </p>

          <p>
            Watch Tennis Today helps fans find match schedules, live tennis coverage,
            official viewing options and TV channels for upcoming {playerName} matches.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/watch"
            className="rounded-2xl bg-green-500 px-5 py-3 font-black text-black hover:bg-green-400 transition-all"
          >
            View Tennis Schedule
          </Link>

          <Link
            href="/live-tennis"
            className="rounded-2xl bg-zinc-800 px-5 py-3 font-black text-white hover:bg-zinc-700 transition-all"
          >
            Live Tennis Schedule
          </Link>
        </div>
      </section>

      <section className="mb-10 rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
  <h2 className="text-xl font-bold mb-3">
    Legal Tennis Viewing Information
  </h2>

  <p className="text-sm leading-7 text-zinc-700">
    Watch Tennis Today is an informational tennis guide. We do not stream matches,
    embed live video or bypass broadcaster restrictions. Our player pages are built
    to help fans compare legal viewing options, understand tournament coverage and
    find official match information.
  </p>
</section>

     <section className="mb-10 rounded-2xl border border-zinc-200 p-6 space-y-4 text-sm leading-7">
  <h2 className="text-2xl font-semibold">
    About {playerName} Matches and Coverage
  </h2>

  <p>
    This page is designed to help tennis fans follow {playerName} in a legal and
    practical way. Instead of hosting streams, Watch Tennis Today focuses on match
    schedules, tournament context, official broadcaster information and country-based
    viewing guidance.
  </p>

  <p>
    Tennis TV rights can change depending on the tournament, location and broadcast
    partner. For that reason, availability for {playerName} matches may differ between
    ATP, WTA, Grand Slam and other professional tennis events.
  </p>

  <p>
    When no upcoming match is listed, fans can still use this page to explore related
    tournament coverage, live tennis schedules and official viewing options for future
    {playerName} matches.
  </p>

  <p>
    Watch Tennis Today does not host live tennis streams and does not provide
    unauthorized access to copyrighted broadcasts. The goal of this page is to make it
    easier to find reliable tennis viewing information from legitimate sources.
  </p>
</section>
     
      <section className="mb-10 rounded-3xl border border-zinc-200 bg-white p-6">
        <h2 className="mb-5 text-2xl font-black text-zinc-950">
          {playerName} live stream and schedule FAQ
        </h2>
        <div className="space-y-4 text-sm leading-7 text-zinc-700">
          <div>
            <h3 className="font-black text-zinc-950">Is {playerName} playing today?</h3>
            <p>
              Check the match center above for live, upcoming and recently finished matches.
              Tennis order of play can change after long matches, weather delays or withdrawals.
            </p>
          </div>
          <div>
            <h3 className="font-black text-zinc-950">Where can I watch {playerName} legally?</h3>
            <p>
              Legal broadcasters depend on your country and the tournament. Start with the country
              guides and official tournament pages linked from this page before choosing a service.
            </p>
          </div>
          <div>
            <h3 className="font-black text-zinc-950">Why does the match time change?</h3>
            <p>
              Tennis matches are often scheduled after previous matches on the same court. A late finish,
              rain delay or court change can move the start time.
            </p>
          </div>
        </div>
      </section>

      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
/>

      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
/>

      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",

      "@type": "BreadcrumbList",

      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://watchtennistoday.com",
        },

        {
          "@type": "ListItem",
          position: 2,
          name: "Players",
          item: "https://watchtennistoday.com/players",
        },

        {
          "@type": "ListItem",
          position: 3,
          name: playerName,
          item: `https://watchtennistoday.com/player/${pageSlug}`,
        },
      ],
    }),
  }}
/>
    </main>
  );
}
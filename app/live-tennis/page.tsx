import JsonLd from "@/app/components/JsonLd";
import { getLiveTennisPageMatches, type ServerMatch } from "@/app/lib/serverMatches";
import { safePlayerUrl } from "@/data/playerSlugs";
import Link from "next/link";

export const revalidate = 60;

const SITE_URL = "https://watchtennistoday.com";
const MATCH_SECTION_DISPLAY_LIMIT = 24;

type Match = ServerMatch & {
  court?: string | null;
  surface?: string | null;
  ranking1?: string | number | null;
  ranking2?: string | number | null;
  headToHead?: string | null;
  previousMeeting?: string | null;
  matchImportance?: string | null;
};

type MatchSection = {
  id: string;
  title: string;
  description: string;
  tone: "live" | "soon" | "later" | "done";
  matches: Match[];
};

async function getMatches(): Promise<Match[]> {
  return (await getLiveTennisPageMatches(60)) as Match[];
}

function slugify(value: string) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function matchSlug(match: Match) {
  const readablePart = slugify(`${match.player1}-vs-${match.player2}`);
  const numericId = String(match.id).split(":").pop();

  return `${readablePart}-${numericId}`;
}

function getString(match: Match, keys: string[]) {
  for (const key of keys) {
    const value = match[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }

  return null;
}

function normalizeStatusText(status?: string | null) {
  return String(status || "").toLowerCase().trim();
}

function compactStatus(status?: string | null) {
  return normalizeStatusText(status).replace(/[\s_-]+/g, "");
}

function isScheduledStatus(status: string) {
  const normalizedStatus = normalizeStatusText(status);
  const compact = compactStatus(status);

  return (
    compact === "upcoming" ||
    compact === "notstarted" ||
    compact === "scheduled" ||
    compact === "fixture" ||
    normalizedStatus.includes("not started")
  );
}

function isCancelledStatus(status: string) {
  const compact = compactStatus(status);
  return compact.includes("cancelled") || compact.includes("canceled");
}

function isPostponedStatus(status: string) {
  const compact = compactStatus(status);
  return compact.includes("postponed") || compact.includes("suspended") || compact.includes("interrupted");
}

function isLiveStatus(status: string) {
  const normalizedStatus = normalizeStatusText(status);
  const compact = compactStatus(status);

  if (isScheduledStatus(status) || isFinishedStatus(status) || isCancelledStatus(status) || isPostponedStatus(status)) {
    return false;
  }

  return (
    compact === "live" ||
    compact === "inprogress" ||
    normalizedStatus.includes("in progress") ||
    /^(\d)(st|nd|rd|th)? set$/.test(normalizedStatus) ||
    /^set [1-5]$/.test(normalizedStatus)
  );
}

function isFinishedStatus(status: string) {
  const normalizedStatus = normalizeStatusText(status);
  const compact = compactStatus(status);

  return (
    compact.includes("finished") ||
    compact.includes("completed") ||
    compact.includes("complete") ||
    compact.includes("ended") ||
    compact.includes("final") ||
    compact.includes("retired") ||
    compact.includes("walkover") ||
    normalizedStatus.includes("walk over")
  );
}

function parseStartTime(startTime?: string | null) {
  if (!startTime) return null;

  const localDateTime = String(startTime).match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/
  );
  const parsed = localDateTime
    ? parseTimeInZone(
        Number(localDateTime[1]),
        Number(localDateTime[2]),
        Number(localDateTime[3]),
        Number(localDateTime[4]),
        Number(localDateTime[5]),
        Number(localDateTime[6] || "0"),
        "Europe/Warsaw"
      )
    : new Date(startTime);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const zonedAsUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );

  return zonedAsUtc - date.getTime();
}

function parseTimeInZone(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timeZone: string
) {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  const offset = getTimeZoneOffsetMs(utcGuess, timeZone);
  return new Date(utcGuess.getTime() - offset);
}

function getWarsawDateKey(value: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

function getMatchDateKey(match: Match) {
  const raw = String(match.startTime || "");
  const dateOnly = raw.match(/^(\d{4}-\d{2}-\d{2})T/);
  return dateOnly ? dateOnly[1] : parseStartTime(raw) ? getWarsawDateKey(parseStartTime(raw) as Date) : null;
}

function isStartingSoon(startTime: Date, now: Date) {
  const diffMinutes = (startTime.getTime() - now.getTime()) / 60000;
  return diffMinutes >= 0 && diffMinutes <= 120;
}

type MatchBucket = "live" | "soon" | "later" | "completed" | "ignored";

function classifyMatch(match: Match, now: Date): { bucket: MatchBucket; reason?: string } {
  const status = String(match.status || "");
  const startTime = parseStartTime(match.startTime);
  const matchDateKey = getMatchDateKey(match);
  const todayKey = getWarsawDateKey(now);

  if (isCancelledStatus(status)) return { bucket: "ignored", reason: "cancelled" };
  if (isPostponedStatus(status)) return { bucket: "ignored", reason: "postponed-or-suspended" };

  if (isLiveStatus(status)) {
    if (startTime && startTime.getTime() - now.getTime() > 15 * 60 * 1000) {
      return { bucket: "ignored", reason: "live-status-before-start-time" };
    }

    return { bucket: "live" };
  }

  if (isFinishedStatus(status)) {
    return matchDateKey === todayKey
      ? { bucket: "completed" }
      : { bucket: "ignored", reason: "completed-not-today" };
  }

  if (!startTime || !matchDateKey) return { bucket: "ignored", reason: "missing-or-invalid-start-time" };
  if (matchDateKey !== todayKey) return { bucket: "ignored", reason: "not-today" };
  if (startTime < now) return { bucket: "ignored", reason: "scheduled-start-time-passed" };

  return isStartingSoon(startTime, now) ? { bucket: "soon" } : { bucket: "later" };
}

function formatTime(value?: string | null) {
  const parsed = parseStartTime(value);
  if (!parsed) return null;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(parsed);
}

function tournamentUrl(tournament?: string | null) {
  const slug = slugify(String(tournament || ""));
  return slug ? `/tournament/${slug}` : "/tennis-tournaments";
}

function getCategoryLabel(category?: string | null) {
  const value = String(category || "").toUpperCase();
  if (value.includes("WTA")) return "WTA";
  if (value.includes("ATP")) return "ATP";
  if (value.includes("CHALLENGER")) return "Challenger";
  if (value.includes("ITF")) return "ITF";
  return category || "Tennis";
}

function buildSections(matches: Match[], now: Date): MatchSection[] {
  const buckets = {
    live: [] as Match[],
    soon: [] as Match[],
    later: [] as Match[],
    completed: [] as Match[],
  };
  const ignoredReasons: Record<string, number> = {};

  for (const match of matches) {
    const classification = classifyMatch(match, now);

    if (classification.bucket === "ignored") {
      const reason = classification.reason || "unknown";
      ignoredReasons[reason] = (ignoredReasons[reason] || 0) + 1;
      continue;
    }

    buckets[classification.bucket].push(match);
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[LIVE-TENNIS] match classification", {
      totalMatchesFetched: matches.length,
      liveCount: buckets.live.length,
      startingSoonCount: buckets.soon.length,
      laterTodayCount: buckets.later.length,
      completedCount: buckets.completed.length,
      ignoredCount: Object.values(ignoredReasons).reduce((total, count) => total + count, 0),
      ignoredReasons,
    });
  }

  const sections: MatchSection[] = [
    {
      id: "live-now",
      title: "Live Now",
      description: "Matches currently in progress.",
      tone: "live",
      matches: buckets.live.slice(0, MATCH_SECTION_DISPLAY_LIMIT),
    },
    {
      id: "starting-soon",
      title: "Starting Soon",
      description: "Matches scheduled to begin within the next two hours.",
      tone: "soon",
      matches: buckets.soon.slice(0, MATCH_SECTION_DISPLAY_LIMIT),
    },
    {
      id: "later-today",
      title: "Later Today",
      description: "More tennis still scheduled for today.",
      tone: "later",
      matches: buckets.later.slice(0, MATCH_SECTION_DISPLAY_LIMIT),
    },
    {
      id: "completed-today",
      title: "Completed Today",
      description: "Recent results from today’s schedule.",
      tone: "done",
      matches: buckets.completed.slice(0, MATCH_SECTION_DISPLAY_LIMIT),
    },
  ];

  return sections.filter((section) => section.matches.length > 0);
}

function badgeClass(tone: MatchSection["tone"]) {
  if (tone === "live") return "border-red-500/60 bg-red-500 text-white";
  if (tone === "soon") return "border-amber-400/50 bg-amber-400 text-black";
  if (tone === "done") return "border-zinc-600 bg-zinc-800 text-zinc-200";
  return "border-emerald-400/40 bg-emerald-400 text-black";
}

function DetailPill({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/50 px-3 py-2">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-zinc-100">{value}</p>
    </div>
  );
}

function PlayerLink({ name }: { name: string }) {
  const href = safePlayerUrl(name);

  if (!href) return <span>{name}</span>;

  return (
    <Link href={href} className="hover:text-emerald-300" data-testid="player-link">
      {name}
    </Link>
  );
}

function MatchCard({ match, tone }: { match: Match; tone: MatchSection["tone"] }) {
  const matchInfoHref = `/watch/${matchSlug(match)}`;
  const player1Rank = getString(match, ["ranking1", "player1Ranking", "firstPlayerRanking", "player1Rank"]);
  const player2Rank = getString(match, ["ranking2", "player2Ranking", "secondPlayerRanking", "player2Rank"]);
  const court = getString(match, ["court", "courtName", "eventCourt"]);
  const surface = getString(match, ["surface", "courtSurface", "tournamentSurface"]);
  const headToHead = getString(match, ["headToHead", "h2h", "headToHeadRecord"]);
  const previousMeeting = getString(match, ["previousMeeting", "lastMeeting"]);
  const matchImportance = getString(match, ["matchImportance", "importance", "roundImportance"]);
  const startTime = formatTime(match.startTime);
  const category = getCategoryLabel(match.category);

  return (
    <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-lg shadow-black/20" data-testid="match-card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${badgeClass(tone)}`}>
          {tone === "live" ? "Live" : tone === "soon" ? "Starting soon" : tone === "done" ? "Result" : "Today"}
        </span>
        <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs font-black text-zinc-300">
          {category}
        </span>
      </div>

      <div className="mb-4 space-y-2">
        <h3 className="text-2xl font-black leading-tight text-white">
          <PlayerLink name={match.player1} />
          <span className="mx-2 text-zinc-600">vs</span>
          <PlayerLink name={match.player2} />
        </h3>
        <Link href={tournamentUrl(match.tournament)} className="block text-sm font-bold text-zinc-400 hover:text-emerald-300">
          {match.tournament}
        </Link>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-2">
        <DetailPill label="Status" value={match.status} />
        <DetailPill label="Score" value={match.score || match.pointScore} />
        <DetailPill label="Start" value={startTime} />
        <DetailPill label="Round" value={match.round} />
        <DetailPill label="Court" value={court} />
        <DetailPill label="Surface" value={surface} />
        <DetailPill label={`${match.player1} rank`} value={player1Rank ? `#${player1Rank}` : null} />
        <DetailPill label={`${match.player2} rank`} value={player2Rank ? `#${player2Rank}` : null} />
        <DetailPill label="H2H" value={headToHead} />
        <DetailPill label="Last meeting" value={previousMeeting} />
        <DetailPill label="Importance" value={matchImportance} />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Link href={matchInfoHref} className="rounded-2xl bg-emerald-400 px-4 py-3 text-center font-black text-black hover:bg-emerald-300" data-testid="guide-streaming-link">
          Match info
        </Link>
        <Link href="/tennis-on-tv-today" className="rounded-2xl border border-zinc-700 px-4 py-3 text-center font-black text-white hover:border-emerald-400" data-testid="guide-streaming-link">
          TV guide
        </Link>
        <Link href={tournamentUrl(match.tournament)} className="rounded-2xl border border-zinc-700 px-4 py-3 text-center font-black text-white hover:border-emerald-400" data-testid="guide-streaming-link">
          Tournament
        </Link>
        <Link href="/best-ways-to-watch-tennis-online" className="rounded-2xl border border-zinc-700 px-4 py-3 text-center font-black text-white hover:border-emerald-400" data-testid="guide-streaming-link">
          How to watch
        </Link>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8" data-testid="empty-state">
      <h2 className="text-3xl font-black text-white">No live matches found right now</h2>
      <p className="mt-3 max-w-3xl text-zinc-400">
        Tennis schedules change throughout the day. Check today’s schedule, TV guide and player pages for upcoming ATP and WTA windows.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/tennis-schedule-today" className="rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black" data-testid="guide-streaming-link">
          Today’s schedule
        </Link>
        <Link href="/tennis-on-tv-today" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white" data-testid="guide-streaming-link">
          TV schedule
        </Link>
        <Link href="/players" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white" data-testid="guide-streaming-link">
          Player pages
        </Link>
      </div>
    </section>
  );
}

export const metadata = {
  title: "Live Tennis Today | ATP & WTA Matches, Scores and TV Schedule",
  description:
    "Follow today’s ATP and WTA live tennis matches, schedules, scores, TV information and player updates throughout the day.",
  alternates: {
    canonical: `${SITE_URL}/live-tennis`,
  },
  openGraph: {
    title: "Live Tennis Today | ATP & WTA Matches, Scores and TV Schedule",
    description:
      "Follow today’s ATP and WTA live tennis matches, schedules, scores, TV information and player updates throughout the day.",
    url: `${SITE_URL}/live-tennis`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Tennis Today | ATP & WTA Matches, Scores and TV Schedule",
    description:
      "Follow today’s ATP and WTA live tennis matches, schedules, scores, TV information and player updates throughout the day.",
  },
  robots: { index: true, follow: true },
};

export default async function LiveTennisPage() {
  const now = new Date();
  const matches = await getMatches();
  const sections = buildSections(matches, now);
  const liveCount = sections.find((section) => section.id === "live-now")?.matches.length || 0;
  const upcomingCount = sections
    .filter((section) => section.id === "starting-soon" || section.id === "later-today")
    .reduce((total, section) => total + section.matches.length, 0);
  const updatedAt = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(now);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Live Tennis Today",
      url: `${SITE_URL}/live-tennis`,
      description: metadata.description,
      dateModified: now.toISOString(),
      isPartOf: {
        "@type": "WebSite",
        name: "Watch Tennis Today",
        url: SITE_URL,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Live Tennis", item: `${SITE_URL}/live-tennis` },
      ],
    },
    ...matches.slice(0, 10).map((match) => ({
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: `${match.player1} vs ${match.player2}`,
      startDate: parseStartTime(match.startTime)?.toISOString(),
      eventStatus: isLiveStatus(match.status)
        ? "https://schema.org/EventInProgress"
        : isFinishedStatus(match.status)
          ? "https://schema.org/EventCompleted"
          : "https://schema.org/EventScheduled",
      sport: "Tennis",
      location: {
        "@type": "Place",
        name: match.tournament,
      },
      competitor: [
        { "@type": "SportsTeam", name: match.player1 },
        { "@type": "SportsTeam", name: match.player2 },
      ],
      url: `${SITE_URL}/watch/${matchSlug(match)}`,
    })),
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
        <Link href="/" className="text-zinc-400 hover:text-white">
          ← Back to Watch Tennis Today
        </Link>

        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-950 to-black p-6 md:p-10">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">ATP & WTA live match hub</p>
          <h1 className="max-w-4xl text-5xl font-black leading-none md:text-7xl">Live Tennis Today</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            Follow today’s ATP and WTA live matches, schedules, scores, TV information and player updates.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <div className="rounded-3xl border border-zinc-800 bg-black p-5">
              <p className="text-sm font-bold text-zinc-500">Last updated</p>
              <p className="mt-2 text-xl font-black">{updatedAt}</p>
            </div>
            <div className="rounded-3xl border border-red-500/40 bg-red-950/30 p-5">
              <p className="text-sm font-bold text-zinc-400">Live matches</p>
              <p className="mt-2 text-4xl font-black">{liveCount}</p>
            </div>
            <div className="rounded-3xl border border-emerald-400/30 bg-emerald-950/20 p-5">
              <p className="text-sm font-bold text-zinc-400">Upcoming today</p>
              <p className="mt-2 text-4xl font-black">{upcomingCount}</p>
            </div>
          </div>
        </section>

        <nav aria-label="Live tennis page sections" className="sticky top-0 z-10 -mx-6 mt-6 overflow-x-auto border-y border-zinc-900 bg-black/90 px-6 py-3 backdrop-blur md:mx-0 md:rounded-2xl md:border md:border-zinc-800">
          <div className="flex min-w-max gap-3">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="rounded-full border border-zinc-800 px-4 py-2 text-sm font-black text-zinc-300 hover:border-emerald-400 hover:text-white">
                {section.title}
              </a>
            ))}
            <a href="#tv-schedule" className="rounded-full border border-zinc-800 px-4 py-2 text-sm font-black text-zinc-300 hover:border-emerald-400 hover:text-white">
              TV Schedule
            </a>
            <a href="#faq" className="rounded-full border border-zinc-800 px-4 py-2 text-sm font-black text-zinc-300 hover:border-emerald-400 hover:text-white">
              FAQ
            </a>
          </div>
        </nav>

        <div className="mt-8 space-y-10">
          {sections.length > 0 ? (
            sections.map((section) => (
              <section id={section.id} key={section.id} className="scroll-mt-24">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-3xl font-black md:text-4xl">{section.title}</h2>
                    <p className="mt-2 text-zinc-400">{section.description}</p>
                  </div>
                  <span className="rounded-full border border-zinc-800 px-4 py-2 text-sm font-black text-zinc-300">
                    {section.matches.length} matches
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {section.matches.map((match) => (
                    <MatchCard key={match.id} match={match} tone={section.tone} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <EmptyState />
          )}
        </div>

        <section id="tv-schedule" className="mt-10 scroll-mt-24 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <h2 className="text-3xl font-black">Useful next steps</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <Link href="/tennis-on-tv-today" className="rounded-2xl border border-zinc-700 bg-black p-4 font-black hover:border-emerald-400" data-testid="guide-streaming-link">
              Tennis on TV today
            </Link>
            <Link href="/best-ways-to-watch-tennis-online" className="rounded-2xl border border-zinc-700 bg-black p-4 font-black hover:border-emerald-400" data-testid="guide-streaming-link">
              Best ways to watch online
            </Link>
            <Link href="/watch-tennis-in/usa" className="rounded-2xl border border-zinc-700 bg-black p-4 font-black hover:border-emerald-400" data-testid="guide-streaming-link">
              Country streaming guides
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

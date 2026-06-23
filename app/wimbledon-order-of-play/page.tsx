import type { Metadata } from "next";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import JsonLd from "@/app/components/JsonLd";
import {
  getCanonicalPlayerSlug,
  safePlayerUrl,
} from "@/data/playerSlugs";
import {
  getServerMatchesWindow,
  type ServerMatch,
} from "@/app/lib/serverMatches";

export const dynamic = "force-dynamic";

const pageUrl = "https://watchtennistoday.com/wimbledon-order-of-play";
const pageTitle = "Wimbledon Order of Play Today | Watch Tennis Today";
const pageDescription =
  "See the Wimbledon order of play today, including matches, courts, live scores, results, and where to follow your favorite players.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    siteName: "Watch Tennis Today",
    type: "website",
  },
};

type CourtGroup = {
  title: string;
  matches: ServerMatch[];
};

const faq = [
  {
    question: "Who plays at Wimbledon today?",
    answer:
      "This page lists Wimbledon matches from the available tennis data feed when current Wimbledon match data is available. If no Wimbledon rows are available, use the live tennis and today pages for the latest match feed.",
  },
  {
    question: "What is the Wimbledon order of play?",
    answer:
      "The Wimbledon order of play is the daily court-by-court match sequence for The Championships, including Centre Court, No. 1 Court and outside courts when court data is available.",
  },
  {
    question: "Where can I follow Wimbledon live scores?",
    answer:
      "Use the Wimbledon live page, the live tennis page and today's tennis page to follow live score updates and match status.",
  },
  {
    question: "How can I find my favorite Wimbledon players?",
    answer:
      "Use the player links shown beside verified player names, or open the players hub to search for ATP and WTA player pages.",
  },
];

function isWimbledonMatch(match: ServerMatch) {
  const value = `${match.tournament || ""}`.toLowerCase();

  return value.includes("wimbledon");
}

function dateKey(value: Date, timeZone = "Europe/London") {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);

  const getPart = (type: string) =>
    parts.find((part) => part.type === type)?.value || "";

  return `${getPart("year")}-${getPart("month")}-${getPart("day")}`;
}

function isTodayAtWimbledon(match: ServerMatch, today = new Date()) {
  if (String(match.status || "").toUpperCase() === "LIVE") return true;
  if (!match.startTime) return false;

  const start = new Date(match.startTime);
  if (Number.isNaN(start.getTime())) return false;

  return dateKey(start) === dateKey(today);
}

function isFinished(match: ServerMatch) {
  const status = String(match.status || "").toUpperCase();

  return status === "FINISHED" || status === "RETIRED";
}

function sortMatches(matches: ServerMatch[]) {
  return [...matches].sort((left, right) => {
    const leftStatus = String(left.status || "").toUpperCase();
    const rightStatus = String(right.status || "").toUpperCase();

    if (leftStatus === "LIVE" && rightStatus !== "LIVE") return -1;
    if (leftStatus !== "LIVE" && rightStatus === "LIVE") return 1;

    const leftTime = left.startTime ? new Date(left.startTime).getTime() : Number.POSITIVE_INFINITY;
    const rightTime = right.startTime ? new Date(right.startTime).getTime() : Number.POSITIVE_INFINITY;

    return leftTime - rightTime;
  });
}

function courtName(match: ServerMatch) {
  return String(match.court || "").trim();
}

function normalizedCourt(match: ServerMatch) {
  return courtName(match).toLowerCase().replace(/\s+/g, " ");
}

function hasCourtData(matches: ServerMatch[]) {
  return matches.some((match) => Boolean(courtName(match)));
}

function buildCourtGroups(matches: ServerMatch[]): CourtGroup[] {
  const centreCourt = matches.filter((match) =>
    normalizedCourt(match).includes("centre")
  );
  const courtOne = matches.filter((match) => {
    const court = normalizedCourt(match);
    return /(?:^|\b)(?:no\.?\s*1|court\s*1)(?:\b|$)/.test(court);
  });
  const otherCourts = matches.filter(
    (match) => !centreCourt.includes(match) && !courtOne.includes(match)
  );

  return [
    { title: "Centre Court", matches: centreCourt },
    { title: "No. 1 Court", matches: courtOne },
    { title: "Other courts", matches: otherCourts },
  ].filter((group) => group.matches.length > 0);
}

function formatMatchTime(match: ServerMatch) {
  if (!match.startTime) return "Start time not available";

  const start = new Date(match.startTime);
  if (Number.isNaN(start.getTime())) return "Start time not available";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(start);
}

function PlayerName({ name }: { name: string }) {
  const href = safePlayerUrl(name);

  if (!href) return <span>{name || "TBD"}</span>;

  return (
    <a
      href={href}
      className="font-semibold text-emerald-700 underline-offset-4 hover:underline"
    >
      {name}
    </a>
  );
}

function MatchCard({ match }: { match: ServerMatch }) {
  const status = String(match.status || "Scheduled");
  const isLive = status.toUpperCase() === "LIVE";

  return (
    <article className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <span
          className={
            isLive
              ? "rounded-full bg-emerald-100 px-3 py-1 font-bold text-emerald-800"
              : "rounded-full bg-neutral-100 px-3 py-1 font-bold text-neutral-700"
          }
        >
          {isLive ? "Live now" : status}
        </span>
        {match.category ? (
          <span className="rounded-full bg-neutral-100 px-3 py-1 font-semibold text-neutral-600">
            {match.category}
          </span>
        ) : null}
      </div>

      <h3 className="mb-4 text-xl font-bold leading-snug text-neutral-950">
        <PlayerName name={match.player1 || "TBD"} />
        <span className="mx-2 text-neutral-400">vs</span>
        <PlayerName name={match.player2 || "TBD"} />
      </h3>

      <dl className="space-y-2 text-sm leading-6 text-neutral-700">
        <div>
          <dt className="inline font-semibold text-neutral-950">Time: </dt>
          <dd className="inline">{formatMatchTime(match)}</dd>
        </div>
        {match.round ? (
          <div>
            <dt className="inline font-semibold text-neutral-950">Round: </dt>
            <dd className="inline">{match.round}</dd>
          </div>
        ) : null}
        {courtName(match) ? (
          <div>
            <dt className="inline font-semibold text-neutral-950">Court: </dt>
            <dd className="inline">{courtName(match)}</dd>
          </div>
        ) : null}
        {match.score && isFinished(match) ? (
          <div>
            <dt className="inline font-semibold text-neutral-950">Score: </dt>
            <dd className="inline">{match.score}</dd>
          </div>
        ) : null}
      </dl>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
      <h3 className="mb-3 text-xl font-bold text-neutral-950">
        Wimbledon order of play data is not listed right now
      </h3>
      <p className="mb-5 max-w-3xl leading-7 text-neutral-700">
        We do not have current Wimbledon court-order rows from the match feed at
        this moment, so this page is not showing placeholder matches. Use the
        live tennis and today pages for the freshest available tennis updates.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="/live-tennis"
          className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800"
        >
          Live tennis
        </a>
        <a
          href="/today"
          className="rounded-full border border-emerald-700 px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-white"
        >
          Today
        </a>
      </div>
    </div>
  );
}

function RelatedLinks() {
  const links = [
    { href: "/wimbledon-live", label: "Wimbledon live" },
    { href: "/wimbledon-schedule", label: "Wimbledon schedule" },
    { href: "/wimbledon-results", label: "Wimbledon results" },
    { href: "/live-tennis", label: "Live tennis" },
    { href: "/today", label: "Today" },
    { href: "/players", label: "Players" },
  ];

  return (
    <section className="rounded-3xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold text-neutral-950">
        Wimbledon links
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="rounded-2xl border bg-neutral-50 p-4 font-semibold text-neutral-900 hover:border-emerald-500 hover:bg-white"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}

export default async function WimbledonOrderOfPlayPage() {
  const matches = await getServerMatchesWindow({
    includeFinished: true,
    daysBack: 0,
    daysForward: 1,
    revalidateSeconds: 60,
    timeoutMs: 15000,
  });

  const wimbledonMatches = sortMatches(
    matches.filter((match) => isWimbledonMatch(match) && isTodayAtWimbledon(match))
  );
  const courtGroups = hasCourtData(wimbledonMatches)
    ? buildCourtGroups(wimbledonMatches)
    : [];
  const verifiedPlayers = Array.from(
    new Set(
      wimbledonMatches
        .flatMap((match) => [match.player1, match.player2])
        .map((name) => getCanonicalPlayerSlug(String(name || "")))
        .filter((slug): slug is NonNullable<typeof slug> => Boolean(slug))
    )
  ).slice(0, 8);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700">
        Wimbledon order of play
      </p>
      <h1 className="mb-5 max-w-4xl text-4xl font-bold tracking-tight text-neutral-950 md:text-5xl">
        Wimbledon Order of Play Today
      </h1>
      <p className="mb-8 max-w-3xl text-lg leading-8 text-neutral-700">
        Follow today&apos;s Wimbledon matches, court schedule, live updates and
        player pages from one clean match-day hub. When court data is available,
        the order of play is grouped by Centre Court, No. 1 Court and other
        courts.
      </p>

      <section className="mb-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="mb-3 text-2xl font-bold text-neutral-950">
          Today&apos;s Wimbledon matches
        </h2>
        <p className="max-w-3xl leading-7 text-neutral-700">
          Use this section to see who plays at Wimbledon today, confirm match
          status, open verified player pages and move quickly to live scores,
          results or the broader daily tennis schedule.
        </p>
      </section>

      {verifiedPlayers.length > 0 ? (
        <section className="mb-8 rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-neutral-950">
            Find Wimbledon players
          </h2>
          <div className="flex flex-wrap gap-3">
            {verifiedPlayers.map((slug) => (
              <a
                key={slug}
                href={`/player/${slug}`}
                className="rounded-full border border-emerald-200 px-4 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-50"
              >
                {slug.replace(/-/g, " ")}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mb-8">
        {wimbledonMatches.length === 0 ? (
          <EmptyState />
        ) : courtGroups.length > 0 ? (
          <div className="space-y-8">
            {courtGroups.map((group) => (
              <section key={group.title}>
                <h2 className="mb-4 text-2xl font-bold text-neutral-950">
                  {group.title}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {group.matches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {wimbledonMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>

      <div className="mb-8">
        <RelatedLinks />
      </div>

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-neutral-950">
          Wimbledon order of play FAQ
        </h2>
        <div className="space-y-4">
          {faq.map((item) => (
            <div key={item.question}>
              <h3 className="font-semibold text-neutral-950">{item.question}</h3>
              <p className="mt-1 text-base leading-7 text-neutral-700">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <JsonLd data={faqSchema} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "Wimbledon", url: "https://watchtennistoday.com/wimbledon-live" },
          { name: "Wimbledon Order of Play", url: pageUrl },
        ]}
      />
    </main>
  );
}

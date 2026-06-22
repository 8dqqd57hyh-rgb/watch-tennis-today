import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import { type ServerMatch } from "@/app/lib/serverMatches";
import {
  wimbledonQualifyingWindowLabel,
} from "@/app/lib/grandSlamQualifying";
import { getWimbledonQualifyingMatches } from "@/app/lib/wimbledonQualifyingMatches";
import { safePlayerUrl } from "@/data/playerSlugs";

export const revalidate = 60;

const SITE_URL = "https://watchtennistoday.com";
const PAGE_TITLE = "Wimbledon Qualifying 2026: Schedule, Draw, Results & Live Streaming";
const PAGE_DESCRIPTION =
  "Follow Wimbledon qualifying 2026 with today's matches, live qualifiers, upcoming schedule, results, draw context and legal streaming links.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/wimbledon-qualifying` },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/wimbledon-qualifying`,
    siteName: "Watch Tennis Today",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

type Match = ServerMatch & {
  date?: string;
  time?: string;
  roundName?: string;
  stage?: string;
  eventName?: string;
};

type Section = {
  id: string;
  title: string;
  intro: string;
  matches: Match[];
  empty: string;
};

const faq = [
  {
    q: "What is Wimbledon qualifying?",
    a: "Wimbledon qualifying is the pre-main-draw competition where players outside the direct entry list try to win a place in the singles main draw.",
  },
  {
    q: "When is Wimbledon qualifying 2026?",
    a: "Wimbledon qualifying 2026 is scheduled for June 22-25, 2026, before the main Championships begin.",
  },
  {
    q: "How do players qualify for the Wimbledon main draw?",
    a: "Singles players normally need to win three qualifying matches. The successful qualifiers join the main draw alongside direct entries and wildcards.",
  },
  {
    q: "When does the Wimbledon 2026 main draw start?",
    a: "The Wimbledon 2026 main Championships are scheduled to start on Monday, June 29, 2026.",
  },
  {
    q: "Where can I watch Wimbledon qualifying live?",
    a: "Streaming rights vary by country. Use official Wimbledon broadcasters and licensed services, then confirm the exact court coverage before subscribing.",
  },
];

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
  const readablePart = slugify(`${match.player1 || "player"}-vs-${match.player2 || "player"}`);
  const numericId = String(match.id || "match").split(":").pop();
  return `${readablePart}-${numericId}`;
}

function normalizeStatus(status?: string | null) {
  return String(status || "").toLowerCase().replace(/[\s_-]+/g, "");
}

function isLive(match: Match) {
  const status = normalizeStatus(match.status);
  return status === "live" || status === "inprogress";
}

function isFinished(match: Match) {
  const status = normalizeStatus(match.status);
  return (
    status.includes("finished") ||
    status.includes("completed") ||
    status.includes("ended") ||
    status.includes("retired") ||
    status.includes("walkover")
  );
}

function parseStartTime(match: Match) {
  const raw = match.startTime || (match.date && match.time ? `${match.date}T${match.time}` : match.date);
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function isToday(match: Match, todayKey: string) {
  const parsed = parseStartTime(match);
  return parsed ? getDateKey(parsed) === todayKey : false;
}

function sortByStartTime(a: Match, b: Match) {
  const aTime = parseStartTime(a)?.getTime() ?? Number.MAX_SAFE_INTEGER;
  const bTime = parseStartTime(b)?.getTime() ?? Number.MAX_SAFE_INTEGER;
  return aTime - bTime;
}

function formatStart(match: Match) {
  const parsed = parseStartTime(match);
  if (!parsed) return match.time || "Time TBC";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: "Europe/London",
  }).format(parsed);
}

function PlayerLink({ name }: { name?: string | null }) {
  const playerName = String(name || "TBD").trim() || "TBD";
  const href = safePlayerUrl(playerName);

  if (!href) return <span>{playerName}</span>;

  return (
    <Link href={href} className="hover:text-green-400">
      {playerName}
    </Link>
  );
}

function MatchCard({ match }: { match: Match }) {
  return (
    <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-lg shadow-black/20">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${isLive(match) ? "bg-red-500 text-white" : isFinished(match) ? "bg-zinc-800 text-zinc-200" : "bg-green-500 text-black"}`}>
          {isLive(match) ? "Live now" : isFinished(match) ? "Result" : "Wimbledon Qualifying"}
        </span>
        <span className="text-xs font-black uppercase tracking-wide text-zinc-500">
          {match.round || match.roundName || match.stage || match.category || "Qualifying"}
        </span>
      </div>

      <h3 className="text-2xl font-black leading-tight text-white">
        <PlayerLink name={match.player1} />
        <span className="mx-2 text-zinc-600">vs</span>
        <PlayerLink name={match.player2} />
      </h3>

      <Link href={`/tournament/${slugify(match.tournament || "wimbledon")}`} className="mt-3 block text-sm font-bold text-zinc-400 hover:text-green-400">
        {match.tournament || "Wimbledon"}
      </Link>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-black p-3">
          <p className="text-zinc-500">Start</p>
          <p className="mt-1 font-black text-white">{formatStart(match)}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-black p-3">
          <p className="text-zinc-500">Score</p>
          <p className="mt-1 font-black text-white">{match.score || "Not started"}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link href={`/watch/${matchSlug(match)}`} className="rounded-2xl bg-green-500 px-4 py-3 text-sm font-black text-black hover:bg-green-400">
          Match details
        </Link>
        <Link href="/wimbledon-live-stream" className="rounded-2xl border border-zinc-800 px-4 py-3 text-sm font-black text-zinc-200 hover:border-green-500">
          Watch guide
        </Link>
      </div>
    </article>
  );
}

function MatchSection({ section }: { section: Section }) {
  return (
    <section id={section.id} className="mt-8">
      <div className="mb-4">
        <h2 className="text-3xl font-black text-white">{section.title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">{section.intro}</p>
      </div>
      {section.matches.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {section.matches.slice(0, 18).map((match) => (
            <MatchCard key={`${section.id}-${match.id}`} match={match} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 font-bold text-zinc-300">
          {section.empty}
        </div>
      )}
    </section>
  );
}

export default async function WimbledonQualifyingPage() {
  const matches = ((await getWimbledonQualifyingMatches()) as Match[]).sort(sortByStartTime);

  const todayKey = getDateKey(new Date());
  const liveMatches = matches.filter(isLive);
  const todayMatches = matches.filter((match) => isToday(match, todayKey));
  const upcomingMatches = matches.filter((match) => !isLive(match) && !isFinished(match));
  const resultMatches = matches.filter(isFinished).sort((a, b) => sortByStartTime(b, a));

  const sections: Section[] = [
    {
      id: "live-now",
      title: "Live now",
      intro: "Wimbledon qualifying matches currently marked live by the tennis feed.",
      matches: liveMatches,
      empty: "No Wimbledon qualifying matches are live right now. Check today, upcoming and results below.",
    },
    {
      id: "today",
      title: "Today",
      intro: "All Wimbledon qualifying matches listed for today, including scheduled, live and completed matches.",
      matches: todayMatches,
      empty: "No Wimbledon qualifying matches are listed for today in the current feed yet.",
    },
    {
      id: "upcoming",
      title: "Upcoming",
      intro: "Next Wimbledon qualifying matches still to be played.",
      matches: upcomingMatches,
      empty: "No upcoming Wimbledon qualifying matches are available yet. The feed may update when the order of play is confirmed.",
    },
    {
      id: "results",
      title: "Results",
      intro: "Finished Wimbledon qualifying results from the current match window.",
      matches: resultMatches,
      empty: "No finished Wimbledon qualifying results are available yet.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Wimbledon Qualifying", item: `${SITE_URL}/wimbledon-qualifying` },
    ],
  };

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white md:px-8">
      <JsonLd data={[breadcrumb, faqSchema]} />
      <div className="mx-auto max-w-7xl">
        <nav className="mb-6 flex flex-wrap gap-2 text-sm font-bold text-zinc-500">
          <Link href="/" className="hover:text-green-400">Home</Link>
          <span>/</span>
          <Link href="/wimbledon" className="hover:text-green-400">Wimbledon</Link>
          <span>/</span>
          <span>Qualifying</span>
        </nav>

        <section className="rounded-3xl border border-green-500/40 bg-zinc-950 p-6 md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">Grand Slam qualifying</p>
          <h1 className="mt-3 max-w-5xl text-4xl font-black leading-tight md:text-6xl">{PAGE_TITLE}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
            Track Wimbledon qualifying matches, live scores, upcoming order of play, results and legal streaming routes from one focused hub.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="#live-now" className="rounded-2xl bg-green-500 px-5 py-3 font-black text-black hover:bg-green-400">Live now</Link>
            <Link href="#today" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-green-500">Today</Link>
            <Link href="#results" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-green-500">Results</Link>
            <Link href="/where-to-watch-wimbledon" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-green-500">Where to watch</Link>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            ["Live now", liveMatches.length],
            ["Today", todayMatches.length],
            ["Upcoming", upcomingMatches.length],
            ["Results", resultMatches.length],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{label}</p>
              <p className="mt-2 text-4xl font-black text-green-400">{value}</p>
            </div>
          ))}
        </section>

        {sections.map((section) => (
          <MatchSection key={section.id} section={section} />
        ))}

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">How Wimbledon qualifying works</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-zinc-300">
              <p>Wimbledon qualifying is the entry path for players who are not already in the main singles draw through ranking, protected ranking or wildcard selection.</p>
              <p>The 2026 qualifying competition takes place from {wimbledonQualifyingWindowLabel()} at Roehampton, before the main Wimbledon fortnight at the All England Club.</p>
              <p>Players usually need to win three qualifying rounds. Those who come through the final qualifying round join the main draw as qualifiers.</p>
              <p>The Wimbledon 2026 main draw begins on Monday, June 29, 2026, with the Championships scheduled through Sunday, July 12, 2026.</p>
            </div>
          </article>

          <aside className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black">Related Wimbledon links</h2>
            <div className="mt-4 grid gap-3">
              {[
                ["Wimbledon hub", "/wimbledon"],
                ["Wimbledon live stream", "/wimbledon-live-stream"],
                ["Where to watch Wimbledon", "/where-to-watch-wimbledon"],
                ["Wimbledon schedule", "/wimbledon-schedule"],
                ["Wimbledon results", "/wimbledon-results"],
                ["Live tennis", "/live-tennis"],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="rounded-2xl border border-zinc-800 bg-black px-4 py-3 font-black hover:border-green-500">
                  {label}
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <section id="faq" className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Wimbledon qualifying FAQ</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {faq.map((item) => (
              <div key={item.q} className="rounded-2xl bg-black p-5">
                <h3 className="font-black text-white">{item.q}</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

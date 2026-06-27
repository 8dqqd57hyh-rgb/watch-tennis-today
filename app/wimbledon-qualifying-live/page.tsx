import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import RelatedWimbledonGuides from "@/app/components/RelatedWimbledonGuides";
import AuthorBox from "@/app/components/AuthorBox";
import LegalStreamingOptions from "@/components/LegalStreamingOptions";
import { type ServerMatch } from "@/app/lib/serverMatches";
import { wimbledonQualifyingWindowLabel } from "@/app/lib/grandSlamQualifying";
import { getWimbledonQualifyingMatches } from "@/app/lib/wimbledonQualifyingMatches";
import { buildArticleAuthorSchema, buildOrganizationSchema } from "@/data/authorProfile";
import { safePlayerUrl } from "@/data/playerSlugs";

export const revalidate = 60;
export const dynamic = "force-dynamic";

const SITE_URL = "https://watchtennistoday.com";
const PAGE_URL = `${SITE_URL}/wimbledon-qualifying-live`;
const PAGE_TITLE = "Wimbledon Qualifying Live: Today, Schedule & Stream";
const PAGE_DESCRIPTION =
  "Follow Wimbledon qualifying live with today's matches, order of play, legal stream options, schedule rounds, results and draw context.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    siteName: "Watch Tennis Today",
    type: "article",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Watch Tennis Today Wimbledon qualifying live guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
};

type Match = ServerMatch & {
  date?: string;
  time?: string;
  roundName?: string;
  stage?: string;
  eventName?: string;
};

type MatchGroup = {
  id: string;
  title: string;
  intro: string;
  matches: Match[];
  empty: string;
};

const faq = [
  {
    question: "Where can I watch Wimbledon qualifying live?",
    answer:
      "Start with Wimbledon official channels and the licensed broadcaster in your country. Coverage can vary by court and market, so confirm qualifying coverage on the provider schedule before paying.",
  },
  {
    question: "When does Wimbledon qualifying start?",
    answer:
      "Wimbledon qualifying 2026 is scheduled for June 22-25, 2026, before the main Championships begin on Monday, June 29, 2026.",
  },
  {
    question: "Is Wimbledon qualifying streamed?",
    answer:
      "Some qualifying matches may be streamed by official Wimbledon or rights-holder platforms, but availability depends on country, court production and the daily order of play.",
  },
  {
    question: "How many rounds are there in Wimbledon qualifying?",
    answer:
      "Singles players normally need to win three rounds: Round 1, Round 2 and the final qualifying round.",
  },
  {
    question: "How do players qualify for Wimbledon?",
    answer:
      "Players outside the direct entry list can qualify by winning through the qualifying draw. Successful qualifiers take main-draw places alongside direct entries and wildcards.",
  },
  {
    question: "Where can I find Wimbledon qualifying results?",
    answer:
      "Use a live results page, the official draw and the completed matches section on this page to see who advanced from qualifying.",
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

function matchSlug(match: Match) {
  const readablePart = slugify(`${match.player1 || "player"}-vs-${match.player2 || "player"}`);
  const numericId = String(match.id || "match").split(":").pop();
  return `${readablePart}-${numericId}`;
}

function PlayerName({ name }: { name?: string | null }) {
  const playerName = String(name || "TBD").trim() || "TBD";
  const href = safePlayerUrl(playerName);

  if (!href) return <span>{playerName}</span>;

  return (
    <Link href={href} className="hover:text-green-700">
      {playerName}
    </Link>
  );
}

function MatchCard({ match }: { match: Match }) {
  const live = isLive(match);
  const finished = isFinished(match);

  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
            live ? "bg-red-600 text-white" : finished ? "bg-zinc-900 text-white" : "bg-green-100 text-green-800"
          }`}
        >
          {live ? "Live now" : finished ? "Completed" : "Scheduled"}
        </span>
        <span className="text-xs font-black uppercase tracking-wide text-zinc-500">
          {match.round || match.roundName || match.stage || "Qualifying"}
        </span>
      </div>

      <h3 className="text-xl font-black leading-tight text-zinc-950">
        <PlayerName name={match.player1} />
        <span className="mx-2 text-zinc-400">vs</span>
        <PlayerName name={match.player2} />
      </h3>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-2xl bg-zinc-50 p-3">
          <p className="text-zinc-500">Start</p>
          <p className="mt-1 font-black text-zinc-950">{formatStart(match)}</p>
        </div>
        <div className="rounded-2xl bg-zinc-50 p-3">
          <p className="text-zinc-500">Score</p>
          <p className="mt-1 font-black text-zinc-950">{match.score || "Not started"}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link href={`/watch/${matchSlug(match)}`} className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-black text-white hover:bg-green-700">
          Match details
        </Link>
        <Link href="/wimbledon-live" className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-black text-zinc-800 hover:border-green-500">
          Watch hub
        </Link>
      </div>
    </article>
  );
}

function MatchGroupSection({ group }: { group: MatchGroup }) {
  return (
    <section id={group.id} className="mt-8">
      <div className="mb-4">
        <h3 className="text-2xl font-black text-zinc-950">{group.title}</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">{group.intro}</p>
      </div>
      {group.matches.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {group.matches.slice(0, 18).map((match) => (
            <MatchCard key={`${group.id}-${match.id}`} match={match} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 text-sm font-bold leading-7 text-zinc-700">
          {group.empty}
        </div>
      )}
    </section>
  );
}

export default async function WimbledonQualifyingLivePage() {
  const matches = ((await getWimbledonQualifyingMatches()) as Match[]).sort(sortByStartTime);
  const todayKey = getDateKey(new Date());
  const liveMatches = matches.filter(isLive);
  const todayMatches = matches.filter((match) => isToday(match, todayKey));
  const upcomingMatches = matches.filter((match) => !isLive(match) && !isFinished(match));
  const completedMatches = matches.filter(isFinished).sort((a, b) => sortByStartTime(b, a));

  const matchGroups: MatchGroup[] = [
    {
      id: "today",
      title: "Today's qualifying matches",
      intro:
        "These are Wimbledon qualifying matches listed for today in the current feed. A match can move from scheduled to live to completed as the data updates.",
      matches: todayMatches,
      empty:
        "No Wimbledon qualifying matches are listed for today yet. When the order of play is published or refreshed, this section can populate automatically from the existing match feed.",
    },
    {
      id: "live",
      title: "Live matches",
      intro:
        "Live Wimbledon qualifying matches are the highest-priority items because court timing can shift quickly during qualifying week.",
      matches: liveMatches,
      empty: "No Wimbledon qualifying matches are marked live right now.",
    },
    {
      id: "upcoming",
      title: "Upcoming matches",
      intro:
        "Upcoming matches help you plan around court order, time zone and broadcaster availability before opening a live stream.",
      matches: upcomingMatches,
      empty: "No upcoming Wimbledon qualifying matches are available in the feed right now.",
    },
    {
      id: "completed",
      title: "Completed matches and results",
      intro:
        "Completed matches show which players are moving through the Wimbledon qualifying draw toward the main Championships.",
      matches: completedMatches,
      empty: "No completed Wimbledon qualifying results are available yet.",
    },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    author: buildArticleAuthorSchema(),
    publisher: buildOrganizationSchema(),
    datePublished: "2026-06-23",
    dateModified: new Date().toISOString(),
    mainEntityOfPage: PAGE_URL,
  };

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
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <JsonLd data={[webPageSchema, articleSchema, faqSchema]} />

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <nav className="flex flex-wrap gap-2 text-sm font-semibold text-zinc-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/grand-slams" className="hover:text-white">Grand Slams</Link>
            <span>/</span>
            <Link href="/wimbledon" className="hover:text-white">Wimbledon</Link>
            <span>/</span>
            <span className="text-white">Qualifying live</span>
          </nav>

          <p className="mt-8 text-xs font-black uppercase tracking-[0.25em] text-green-400">
            Wimbledon qualifying live
          </p>
          <h1 className="mt-3 max-w-5xl text-4xl font-black leading-tight md:text-6xl">
            Wimbledon qualifying live: today&apos;s matches, order of play and legal streams
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Follow Wimbledon qualifying today with a practical match hub for live scores, upcoming starts, completed results, order-of-play context and legal ways to watch. Qualifying is not just a warm-up: it decides the last main-draw places and often creates the first real storylines of Wimbledon week.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#today" className="rounded-full bg-green-400 px-5 py-3 font-black text-black hover:bg-green-300">
              Today&apos;s matches
            </Link>
            <Link href="#order-of-play" className="rounded-full border border-white/20 px-5 py-3 font-black text-white hover:bg-white/10">
              Order of play
            </Link>
            <Link href="#live-streaming" className="rounded-full border border-white/20 px-5 py-3 font-black text-white hover:bg-white/10">
              Live streaming
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["Today", todayMatches.length],
            ["Live now", liveMatches.length],
            ["Upcoming", upcomingMatches.length],
            ["Completed", completedMatches.length],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{label}</p>
              <p className="mt-2 text-4xl font-black text-green-700">{value}</p>
            </div>
          ))}
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-3xl font-black">What Wimbledon qualifying is and why fans search for it</h2>
            <div className="mt-5 space-y-4 text-base leading-8 text-zinc-700">
              <p>
                Wimbledon qualifying is the separate pre-main-draw competition for players who have not entered the Championships directly through ranking, protected ranking or wildcard selection. It is where lower-ranked tour regulars, rising prospects, returning players and experienced grass-court specialists fight for the final main-draw spots.
              </p>
              <p>
                For 2026, Wimbledon qualifying is scheduled for {wimbledonQualifyingWindowLabel()}, with the main Championships scheduled to begin on Monday, June 29, 2026. The qualifying event is traditionally played before the main fortnight, so search demand spikes before many casual fans realize Wimbledon has effectively started.
              </p>
              <p>
                People search for &quot;Wimbledon qualifying live&quot; because qualifying coverage can be harder to locate than Centre Court coverage. Fans want to know whether a player is on court now, which qualifying round is being played, where the match sits in the order of play, whether a legal live stream exists in their country, and who has already reached the Wimbledon qualifying draw&apos;s final round.
              </p>
            </div>
          </article>

          <RelatedWimbledonGuides currentPath="/wimbledon-qualifying-live" />
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-black">Wimbledon qualifying today</h2>
          <p className="mt-3 max-w-4xl leading-8 text-zinc-700">
            This section is built around current match intent: today&apos;s qualifying matches, upcoming starts, live matches and completed results. The project already has Wimbledon qualifying match data support, so this page uses that server-side feed and refreshes on a short revalidation window instead of relying on a static hand-written list.
          </p>
          {matchGroups.map((group) => (
            <MatchGroupSection key={group.id} group={group} />
          ))}
        </section>

        <section id="order-of-play" className="mt-12 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-black">Wimbledon qualifying order of play</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl bg-zinc-50 p-5">
              <h3 className="text-xl font-black">How it works</h3>
              <p className="mt-3 leading-7 text-zinc-700">
                The order of play is the daily court plan. It lists which matches are assigned to each court and the sequence in which they are expected to be played. Tennis times are estimates because earlier matches, rain, withdrawals and court changes can move the schedule.
              </p>
            </article>
            <article className="rounded-2xl bg-zinc-50 p-5">
              <h3 className="text-xl font-black">Where today&apos;s matches appear</h3>
              <p className="mt-3 leading-7 text-zinc-700">
                Today&apos;s qualifying matches appear first in the match section above, then live, upcoming and completed groups help you scan the day by status. If a match is not yet listed, the most likely reasons are that the official order has not been published, the feed has not refreshed, or court coverage is limited.
              </p>
            </article>
            <article className="rounded-2xl bg-zinc-50 p-5">
              <h3 className="text-xl font-black">Automatic updates</h3>
              <p className="mt-3 leading-7 text-zinc-700">
                This page is server-rendered and revalidates frequently. When the project&apos;s qualifying feed receives new fixtures, live statuses or scores, the visible sections can update without turning the page into a client-only app.
              </p>
            </article>
          </div>
        </section>

        <section id="live-streaming" className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-3xl font-black">Wimbledon qualifying live stream options</h2>
            <div className="mt-5 space-y-4 leading-8 text-zinc-700">
              <p>
                Wimbledon qualifying live stream availability is country-specific. In the UK, Wimbledon coverage is traditionally centered on BBC services. In the United States, ESPN platforms are usually the first place to check. In Australia and Canada, major tennis rights often sit with established sports broadcasters. Europe can vary by country and package.
              </p>
              <p>
                The important detail is that qualifying is not always treated the same way as the main draw. Some broadcasters show selected courts, some publish highlights, and some only list qualifying after the daily court schedule is finalized. Before subscribing, check the exact event name, court, day and platform.
              </p>
              <p>
                Legal viewing options include official tournament streams, national rights-holders, paid sports apps, cable-authenticated streams and free-to-air broadcasters where rights permit. Avoid pages that promise free video but hide the real source, force downloads, or use misleading play buttons.
              </p>
            </div>
          </article>
          <LegalStreamingOptions title="Legal Wimbledon qualifying streaming checks" />
        </section>

        <section id="schedule" className="mt-12 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-black">Wimbledon qualifying schedule rounds</h2>
          <p className="mt-3 max-w-4xl leading-8 text-zinc-700">
            The singles qualifying path is straightforward but demanding: win three matches in a few days, then reset for the main draw. The exact match order depends on the daily schedule, but the round structure is stable.
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <h3 className="text-xl font-black">Round 1</h3>
              <p className="mt-3 leading-7 text-zinc-700">
                The opening qualifying round is where the largest field begins. It is often full of unfamiliar names, but it can be the best round for spotting form, grass comfort and players returning from injury.
              </p>
            </article>
            <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <h3 className="text-xl font-black">Round 2</h3>
              <p className="mt-3 leading-7 text-zinc-700">
                Round 2 narrows the draw and usually produces more recognizable matchups. The viewing question becomes more urgent because one win can move a player within touching distance of the Championships.
              </p>
            </article>
            <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <h3 className="text-xl font-black">Final qualifying round</h3>
              <p className="mt-3 leading-7 text-zinc-700">
                The final qualifying round decides who reaches Wimbledon proper. These matches carry main-draw stakes, ranking points and prize money consequences, so live stream and result demand is highest here.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-black">Draw and results context</h2>
          <div className="mt-5 space-y-4 leading-8 text-zinc-700">
            <p>
              The Wimbledon qualifying draw matters because it shows the route each player must take to reach the main draw. A strong grass-court player may still face a difficult path if the section includes a seeded qualifier, a former top-50 player or a dangerous server. Results matter beyond a single score because every completed match changes the next round.
            </p>
            <p>
              Use this page for the live layer, then continue through the main Wimbledon pages once qualifiers are placed. The most useful workflow is to check today&apos;s matches, confirm the order of play, verify a legal stream, then use the results page and player directory to follow who advanced.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/wimbledon-results" className="rounded-full bg-zinc-950 px-5 py-3 font-black text-white hover:bg-green-700">
              Wimbledon results
            </Link>
            <Link href="/wimbledon-schedule" className="rounded-full border border-zinc-200 px-5 py-3 font-black hover:border-green-500">
              Wimbledon schedule
            </Link>
            <Link href="/players" className="rounded-full border border-zinc-200 px-5 py-3 font-black hover:border-green-500">
              Player directory
            </Link>
          </div>
        </section>

        <section id="faq" className="mt-12 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-black">Wimbledon qualifying FAQ</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {faq.map((item) => (
              <article key={item.question} className="rounded-2xl bg-zinc-50 p-5">
                <h3 className="text-lg font-black">{item.question}</h3>
                <p className="mt-2 leading-7 text-zinc-700">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <AuthorBox />
        </section>
      </section>

      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Grand Slams", url: `${SITE_URL}/grand-slams` },
          { name: "Wimbledon", url: `${SITE_URL}/wimbledon` },
          { name: "Wimbledon Qualifying Live", url: PAGE_URL },
        ]}
      />
    </main>
  );
}

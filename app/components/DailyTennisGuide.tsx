import { headers } from "next/headers";

type LinkItem = {
  href: string;
  label: string;
};

type EditorialSection = {
  heading: string;
  body: string;
};

type DailyTennisGuideProps = {
  eyebrow: string;
  title: string;
  description: string;
  intent: string;
  pagePath: string;
  breadcrumbLabel: string;
  mode?: "schedule" | "order-of-play" | "results";
  links?: LinkItem[];
  editorialSections?: EditorialSection[];
  faqItems?: { question: string; answer: string }[];
  fallbackHeading?: string;
  fallbackBody?: string;
};

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  round?: string;
  score?: string;
  startTime: string | null;
};

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) return "http://localhost:3000";

  const protocol = host.includes("localhost") ? "http" : "https";

  return `${protocol}://${host}`;
}

async function getMatches(): Promise<Match[]> {
  try {
    const baseUrl = await getBaseUrl();

    const response = await fetch(`${baseUrl}/api/matches`, {
      cache: "no-store",
    });

    if (!response.ok) return [];

    const data = await response.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.matches)) return data.matches;

    return [];
  } catch (error) {
    console.error("Daily tennis guide failed to load matches:", error);
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

function matchSlug(match: Match) {
  const readablePart = slugify(`${match.player1}-vs-${match.player2}`);
  const numericId = String(match.id).split(":").pop();

  return `${readablePart}-${numericId}`;
}

function normalizeStatus(status?: string) {
  return String(status || "").toUpperCase();
}

function statusLabel(status?: string) {
  const value = normalizeStatus(status);

  if (value === "LIVE") return "Live now";
  if (value === "SUSPENDED") return "Suspended / delayed";
  if (value === "UPCOMING") return "Upcoming";

  return value || "Status TBC";
}

function statusClass(status?: string) {
  const value = normalizeStatus(status);

  if (value === "LIVE") return "bg-red-50 text-red-700";
  if (value === "SUSPENDED") return "bg-amber-50 text-amber-700";
  if (value === "UPCOMING") return "bg-sky-50 text-sky-700";

  return "bg-neutral-100 text-neutral-700";
}

function formatMatchTime(value: string | null) {
  if (!value) return "Time to be confirmed";

  return new Date(value).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusPriority(match: Match) {
  const status = normalizeStatus(match.status);

  if (status === "LIVE") return 1;
  if (status === "SUSPENDED") return 2;
  if (status === "UPCOMING") return 3;

  return 4;
}

function getUsefulMatches(matches: Match[], mode: DailyTennisGuideProps["mode"]) {
  const sorted = [...matches].sort((a, b) => {
    const statusDiff = statusPriority(a) - statusPriority(b);
    if (statusDiff !== 0) return statusDiff;

    if (!a.startTime) return 1;
    if (!b.startTime) return -1;

    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  if (mode === "results") {
    return sorted.filter((match) => normalizeStatus(match.status) !== "UPCOMING").slice(0, 12);
  }

  return sorted.slice(0, 12);
}

function getTournamentSummary(matches: Match[]) {
  return Array.from(new Set(matches.map((match) => match.tournament).filter(Boolean))).slice(0, 8);
}

export default async function DailyTennisGuide({
  eyebrow,
  title,
  description,
  intent,
  pagePath,
  breadcrumbLabel,
  mode = "schedule",
  links = [],
  editorialSections = [],
  faqItems = [],
  fallbackHeading = "No live schedule data available right now",
  fallbackBody = "We could not load real tennis matches from the match API at this moment. This page does not show fake fixtures, so please check again later or use official tournament schedules and broadcaster pages.",
}: DailyTennisGuideProps) {
  const matches = await getMatches();
  const usefulMatches = getUsefulMatches(matches, mode);
  const tournaments = getTournamentSummary(matches);

  const today = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
  const lastUpdated = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date());

  const liveCount = matches.filter((match) => normalizeStatus(match.status) === "LIVE").length;
  const upcomingCount = matches.filter((match) => normalizeStatus(match.status) === "UPCOMING").length;
  const suspendedCount = matches.filter((match) => normalizeStatus(match.status) === "SUSPENDED").length;

  const defaultFaq = [
    {
      question: "Where can I check tennis matches today?",
      answer:
        "Use the live match list on this page first, then confirm final timing with the tournament order of play or official broadcaster because tennis schedules can change during the day.",
    },
    {
      question: "Does Watch Tennis Today stream matches?",
      answer:
        "No. Watch Tennis Today does not host, embed or retransmit live tennis. The site helps fans discover matches, schedules and legal viewing routes.",
    },
    {
      question: "Why can tennis schedules change during the day?",
      answer:
        "Tennis schedules can move because of long previous matches, weather delays, court changes, withdrawals and tournament decisions.",
    },
  ];

  const faq = faqItems.length > 0 ? faqItems : defaultFaq;

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
    name: title,
    description,
    url: `https://watchtennistoday.com${pagePath}`,
    dateModified: new Date().toISOString(),
    about: [
      { "@type": "Thing", name: "Tennis schedule" },
      { "@type": "Thing", name: "Live tennis" },
      { "@type": "Thing", name: "Legal tennis streaming" },
    ],
  };
  const breadcrumbSchema = {
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
        name: breadcrumbLabel,
        item: `https://watchtennistoday.com${pagePath}`,
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="mb-3 text-sm font-black uppercase tracking-wide text-sky-700">{eyebrow}</p>

      <h1 className="mb-5 max-w-4xl text-4xl font-black tracking-tight text-neutral-950 md:text-5xl">
        {title}
      </h1>

      <p className="mb-4 max-w-3xl text-lg leading-8 text-neutral-700">{description}</p>

      <p className="mb-8 text-sm font-bold text-neutral-500">
        Last updated: {lastUpdated}. Date context: {today}.
      </p>

      <section className="mb-8 rounded-[2rem] bg-neutral-950 p-6 text-white md:p-8">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-black text-white">
            Real match data
          </span>
          <span className="text-sm text-neutral-300">
            Pulled from the tennis match API. No invented matchups.
          </span>
        </div>

        <h2 className="mb-3 text-2xl font-black md:text-3xl">Today&apos;s tennis schedule dashboard</h2>

        <p className="max-w-3xl leading-7 text-neutral-300">{intent}</p>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-400">
          This page does not claim a match is live unless the match feed marks it live.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-3xl font-black">{liveCount}</p>
            <p className="text-sm font-bold text-neutral-300">Marked live</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-3xl font-black">{upcomingCount}</p>
            <p className="text-sm font-bold text-neutral-300">Upcoming</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-3xl font-black">{suspendedCount}</p>
            <p className="text-sm font-bold text-neutral-300">Delayed / suspended</p>
          </div>
        </div>
      </section>


      {editorialSections.length > 0 ? (
        <section className="mb-8 rounded-3xl border bg-white p-6 shadow-sm">
          <p className="mb-3 text-sm font-black uppercase tracking-wide text-sky-700">Editorial guide</p>
          <div className="grid gap-5 md:grid-cols-2">
            {editorialSections.map((section) => (
              <article key={section.heading}>
                <h2 className="mb-2 text-xl font-black text-neutral-950">{section.heading}</h2>
                <p className="text-base leading-7 text-neutral-700">{section.body}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mb-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-sky-700">Today&apos;s matches</p>
            <h2 className="text-3xl font-black text-neutral-950">
              {mode === "results" ? "Latest live or completed match updates" : "Live and upcoming tennis matches"}
            </h2>
          </div>
          <a href="/live-tennis" className="rounded-full border px-5 py-3 text-sm font-black hover:border-sky-400">
            Open full live page
          </a>
        </div>

        {usefulMatches.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {usefulMatches.map((match) => (
              <article key={match.id} className="rounded-3xl border bg-white p-5 shadow-sm">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${statusClass(match.status)}`}>
                    {statusLabel(match.status)}
                  </span>
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-black uppercase text-neutral-700">
                    {match.category || "Tennis"}
                  </span>
                </div>

                <h3 className="mb-2 text-xl font-black text-neutral-950">
                  {match.player1} vs {match.player2}
                </h3>

                <p className="mb-2 text-sm font-bold text-neutral-600">{match.tournament}</p>

                <div className="mb-4 grid gap-2 text-sm text-neutral-700 md:grid-cols-2">
                  <p>
                    <span className="font-black text-neutral-950">Time:</span> {formatMatchTime(match.startTime)}
                  </p>
                  <p>
                    <span className="font-black text-neutral-950">Score:</span> {match.score && match.score !== "-" ? match.score : "Not started / unavailable"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a href={`/watch/${matchSlug(match)}`} className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-black text-white hover:bg-neutral-800">
                    Match page
                  </a>
                  <a href="/watch-tennis-live-today" className="rounded-full border px-4 py-2 text-sm font-black hover:border-sky-400">
                    Where to watch
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border bg-neutral-50 p-6">
          <h3 className="mb-2 text-xl font-black text-neutral-950">{fallbackHeading}</h3>
          <p className="max-w-3xl leading-7 text-neutral-700">
              {fallbackBody}
          </p>
        </div>
      )}
      </section>

      {tournaments.length > 0 ? (
        <section className="mb-8 rounded-3xl border bg-neutral-50 p-6">
          <p className="mb-2 text-sm font-black uppercase tracking-wide text-sky-700">Tournament context</p>
          <h2 className="mb-4 text-2xl font-black text-neutral-950">Tournaments appearing in today&apos;s data</h2>
          <div className="flex flex-wrap gap-2">
            {tournaments.map((tournament) => (
              <span key={tournament} className="rounded-full border bg-white px-4 py-2 text-sm font-bold text-neutral-800">
                {tournament}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="mb-3 inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-black uppercase text-sky-700">
            Schedule check
          </p>
          <h2 className="mb-3 text-xl font-black text-neutral-950">How to use this page</h2>
          <p className="text-base leading-7 text-neutral-700">
            Start with live and upcoming matches, open the match page for context, then confirm the final court time with the tournament order of play.
          </p>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase text-emerald-700">
            Legal viewing
          </p>
          <h2 className="mb-3 text-xl font-black text-neutral-950">Where to watch</h2>
          <p className="text-base leading-7 text-neutral-700">
            Watch options depend on your country, tournament and broadcaster rights. Use our viewing guides to find legal routes before the match starts.
          </p>
        </div>
      </section>

      {links.length > 0 ? (
        <section className="mb-8 rounded-3xl border bg-white p-6" data-testid="related-links">
          <h2 className="mb-4 text-2xl font-black text-neutral-950">Related tennis pages</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="rounded-2xl border bg-neutral-50 p-4 font-bold text-neutral-900 hover:border-sky-400 hover:bg-white">
                {link.label}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-3xl border bg-white p-6">
        <h2 className="mb-4 text-2xl font-black text-neutral-950">FAQ</h2>
        <div className="space-y-4">
          {faq.map((item) => (
            <div key={item.question}>
              <h3 className="font-bold text-neutral-950">{item.question}</h3>
              <p className="mt-1 text-base leading-7 text-neutral-700">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([webPageSchema, breadcrumbSchema, faqSchema]) }} />
    </main>
  );
}

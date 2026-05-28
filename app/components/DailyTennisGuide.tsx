import { headers } from "next/headers";
import MatchDashboard from "./MatchDashboard";

type LinkItem = {
  href: string;
  label: string;
};

type DailyTennisGuideProps = {
  eyebrow: string;
  title: string;
  description: string;
  intent: string;
  mode?: "schedule" | "order-of-play" | "results";
  links?: LinkItem[];
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
  mode = "schedule",
  links = [],
}: DailyTennisGuideProps) {
  const matches = await getMatches();
  const usefulMatches = getUsefulMatches(matches, mode);
  const tournaments = getTournamentSummary(matches);

  const today = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const liveCount = matches.filter((match) => normalizeStatus(match.status) === "LIVE").length;
  const upcomingCount = matches.filter((match) => normalizeStatus(match.status) === "UPCOMING").length;
  const suspendedCount = matches.filter((match) => normalizeStatus(match.status) === "SUSPENDED").length;

  const faq = [
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
      <p className="mb-3 text-sm font-black uppercase tracking-wide text-sky-700">{eyebrow}</p>

      <h1 className="mb-5 max-w-4xl text-4xl font-black tracking-tight text-neutral-950 md:text-5xl">
        {title}
      </h1>

      <p className="mb-4 max-w-3xl text-lg leading-8 text-neutral-700">{description}</p>

      <p className="mb-8 text-sm font-bold text-neutral-500">Updated today: {today}</p>

      <section className="mb-8 rounded-[2rem] bg-neutral-950 p-6 text-white md:p-8">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-black text-white">
            🔴 Real match data
          </span>
          <span className="text-sm text-neutral-300">
            Pulled from the tennis match API. No invented matchups.
          </span>
        </div>

        <h2 className="mb-3 text-2xl font-black md:text-3xl">Today’s tennis schedule dashboard</h2>

        <p className="max-w-3xl leading-7 text-neutral-300">{intent}</p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-3xl font-black">{liveCount}</p>
            <p className="text-sm font-bold text-neutral-300">Live now</p>
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

      <MatchDashboard matches={usefulMatches} />

      

      {tournaments.length > 0 ? (
        <section className="mb-8 rounded-3xl border bg-neutral-50 p-6">
          <p className="mb-2 text-sm font-black uppercase tracking-wide text-sky-700">Tournament context</p>
          <h2 className="mb-4 text-2xl font-black text-neutral-950">Tournaments appearing in today’s data</h2>
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
        <section className="mb-8 rounded-3xl border bg-white p-6">
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </main>
  );
}

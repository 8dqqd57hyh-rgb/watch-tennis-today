import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { players } from "@/data/players";
import VpnPromo from "@/app/components/VpnPromo";
import StreamingLinksGrid from "@/app/components/StreamingLinksGrid";
import { canonicalUrl, robotsFor } from "@/app/lib/technicalSeo";
import { getMatchSlug } from "@/src/lib/matchCenter";

export const dynamic = "force-dynamic";

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  startTime?: string | null;
};

type Props = {
  params: Promise<{
    slug: string;
  }>;
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

function formatDateTime(value?: string | null) {
  if (!value) return "Time to be confirmed";

  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function isIndexableTvScheduleSlug(slug: string) {
  return slug === "iga-swiatek";
}

function getTvScheduleDescription(playerName: string) {
  return `${playerName} TV schedule guide with match-time checks, official broadcaster verification, WTA and Grand Slam viewing notes, and legal tennis streaming resources.`;
}

function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const player = players[slug as keyof typeof players];

  if (!player) {
    return {
      title: "TV Schedule Not Found",
      robots: robotsFor({ index: false }),
    };
  }

  const title = `${player.name} TV Schedule, Match Times & Broadcaster Checks`;
  const description = getTvScheduleDescription(player.name);
  const url = canonicalUrl(`/tv-schedule/${slug}`);

  return {
    title,
    description,
    robots: robotsFor({ index: isIndexableTvScheduleSlug(slug) }),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Watch Tennis Today",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TvSchedulePage({ params }: Props) {
  const { slug } = await params;
  const player = players[slug as keyof typeof players];

  if (!player) {
    notFound();
  }

  const matches = await getMatches();
  const playerMatches = matches.filter((match) => {
    const text = `${match.player1} ${match.player2}`.toLowerCase();
    const lastName = player.name.toLowerCase().split(" ").pop() || "";

    return text.includes(lastName);
  });

  const pageUrl = canonicalUrl(`/tv-schedule/${slug}`);
  const isIgaPage = slug === "iga-swiatek";
  const faqItems = [
    {
      question: `When is ${player.name} on TV next?`,
      answer: playerMatches.length
        ? `${player.name} has ${playerMatches.length} match listing on this page. Start times can move when earlier matches run long, so confirm the official order of play before the session.`
        : `No current ${player.name} match is listed in the live schedule feed. Check the WTA calendar, Grand Slam order of play and this page again closer to the next tournament session.`,
    },
    {
      question: `Where can I watch ${player.name} legally?`,
      answer: `Legal viewing depends on the tournament and your country. Use the WTA where-to-watch directory, Grand Slam broadcaster pages and the country guides on Watch Tennis Today before choosing a service.`,
    },
    {
      question: `Does Tennis TV show ${player.name} matches?`,
      answer: "No. Tennis TV is an ATP service, so WTA and Grand Slam matches require separate official broadcaster checks.",
    },
    {
      question: `Why can ${player.name} match times change?`,
      answer: "Tennis matches often follow previous matches on the same court. Long matches, weather, retirements, court changes and night-session decisions can all move the real start time.",
    },
  ];

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${player.name} TV Schedule`,
    description: getTvScheduleDescription(player.name),
    url: pageUrl,
    about: {
      "@type": "Person",
      name: player.name,
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Watch Tennis Today",
      url: canonicalUrl("/"),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
      { "@type": "ListItem", position: 2, name: "TV Schedule", item: canonicalUrl("/tv-schedule") },
      { "@type": "ListItem", position: 3, name: player.name, item: pageUrl },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }} />

      <div className="mx-auto max-w-5xl">
        <Link href="/tv-schedule" className="text-zinc-400 hover:text-white">
          Back to TV schedule
        </Link>

        <section className="mt-8 mb-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-green-400">
            Player TV schedule
          </p>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            {player.name} TV schedule, match times and broadcaster checks
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            Use this page to check whether {player.name} has a listed match, then verify the tournament, court assignment and licensed broadcaster before paying for or relying on a stream. Watch Tennis Today does not host live video or claim availability unless the source data supports it.
          </p>
        </section>

        {isIgaPage ? (
          <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="mb-4 text-3xl font-black">Iga Swiatek viewing notes</h2>
            <div className="space-y-4 leading-8 text-zinc-300">
              <p>
                Swiatek matches are most likely to draw high search demand during Grand Slams, WTA 1000 events, WTA Finals weeks and Billie Jean King Cup ties. The correct TV route still depends on the event: WTA tour rights, Grand Slam rights and national-team rights can be separate.
              </p>
              <p>
                For Polish viewers, start with the Poland country guide. For fans elsewhere, open the relevant country page and confirm whether the match is on a main channel, app feed, replay library or only a live-score feed.
              </p>
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <Link href="/player/iga-swiatek" className="rounded-2xl border border-zinc-700 bg-black p-4 font-black hover:border-green-500">
                Iga Swiatek profile
              </Link>
              <Link href="/watch-swiatek-live" className="rounded-2xl border border-zinc-700 bg-black p-4 font-black hover:border-green-500">
                Swiatek live guide
              </Link>
              <Link href="/watch-tennis-in/poland" className="rounded-2xl border border-zinc-700 bg-black p-4 font-black hover:border-green-500">
                Watch tennis in Poland
              </Link>
            </div>
          </section>
        ) : null}

        {playerMatches.length > 0 ? (
          <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-5 text-3xl font-black">Listed matches</h2>
            <div className="space-y-4">
              {playerMatches.slice(0, 10).map((match) => (
                <article key={match.id} className="rounded-2xl border border-zinc-800 bg-black p-5">
                  <div className="mb-4 flex flex-wrap gap-3">
                    <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-black text-black">
                      {match.status}
                    </span>
                    <span className="text-zinc-400">{match.category}</span>
                    <span className="text-zinc-500">/</span>
                    <span className="text-zinc-400">{match.tournament}</span>
                  </div>
                  <h3 className="mb-3 text-2xl font-black">
                    {match.player1} vs {match.player2}
                  </h3>
                  <p className="text-zinc-400">{formatDateTime(match.startTime)}</p>
                  <Link href={`/match/${getMatchSlug(match)}`} className="mt-4 inline-flex rounded-xl bg-green-500 px-4 py-2 text-sm font-black text-black hover:bg-green-400">
                    Open match center
                  </Link>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <h2 className="mb-4 text-3xl font-black">No scheduled matches are currently available</h2>
            <p className="mb-6 leading-8 text-zinc-400">
              Match schedules for {player.name} may change because of tournament updates, qualification rounds, weather, withdrawals, broadcaster availability and official tennis data feeds.
            </p>
            <p className="mb-6 leading-8 text-zinc-400">
              Check back closer to match time, and use official WTA, Grand Slam or tournament order-of-play pages before making viewing plans.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/live-tennis" className="rounded-2xl border border-zinc-700 px-5 py-3 font-bold transition-all hover:border-green-500 hover:text-green-400">
                Live tennis today
              </Link>
              <Link href="/today" className="rounded-2xl border border-zinc-700 px-5 py-3 font-bold transition-all hover:border-green-500 hover:text-green-400">
                Today&apos;s tennis hub
              </Link>
              <Link href="/tennis-tournaments" className="rounded-2xl border border-zinc-700 px-5 py-3 font-bold transition-all hover:border-green-500 hover:text-green-400">
                Tennis tournaments
              </Link>
            </div>
          </section>
        )}

        <VpnPromo
          title={`Watching ${player.name} from another country?`}
          text="Tennis broadcasters and streaming availability may vary depending on tournament rights, provider terms and your current location."
        />

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-5 text-3xl font-black">How to verify {player.name} coverage</h2>
          <ol className="space-y-4 leading-8 text-zinc-300">
            <li><strong className="text-white">1.</strong> Confirm whether the match is WTA, Grand Slam, Billie Jean King Cup, exhibition or qualifying.</li>
            <li><strong className="text-white">2.</strong> Open the official order of play and check whether the start time is fixed or follows another match.</li>
            <li><strong className="text-white">3.</strong> Use the country guide for your location before choosing a broadcaster or streaming app.</li>
            <li><strong className="text-white">4.</strong> Re-check near match time because court moves and overflow feeds can change the viewing route.</li>
          </ol>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <Link href="/today" className="rounded-2xl border border-zinc-700 bg-black p-4 font-black hover:border-green-500">
              Today
            </Link>
            <Link href="/live-tennis" className="rounded-2xl border border-zinc-700 bg-black p-4 font-black hover:border-green-500">
              Live tennis
            </Link>
            <Link href="/players" className="rounded-2xl border border-zinc-700 bg-black p-4 font-black hover:border-green-500">
              Players
            </Link>
            <Link href="/watch-tennis-in" className="rounded-2xl border border-zinc-700 bg-black p-4 font-black hover:border-green-500">
              Country guides
            </Link>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-5 text-3xl font-black">More {player.name} pages</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link href={`/player/${slug}`} className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500">
              <h3 className="text-xl font-black">{player.name} profile</h3>
            </Link>
            <Link href={`/watch-player-live/${slug}`} className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500">
              <h3 className="text-xl font-black">Watch {player.name} live</h3>
            </Link>
            <Link href={`/next-match/${slug}`} className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500">
              <h3 className="text-xl font-black">{player.name} next match</h3>
            </Link>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-5 text-3xl font-black">FAQ</h2>
          <div className="space-y-5 leading-8 text-zinc-300">
            {faqItems.map((item) => (
              <article key={item.question}>
                <h3 className="text-xl font-black text-white">{item.question}</h3>
                <p className="mt-2">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <StreamingLinksGrid />
      </div>
    </main>
  );
}

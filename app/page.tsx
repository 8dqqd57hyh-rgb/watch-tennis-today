import type { Metadata } from "next";
import Link from "next/link";
import HomepageMatchExplorer from "@/app/components/HomepageMatchExplorer";
import type { HomepageMatch } from "@/app/components/HomepageMatchExplorer";
import HomepageFinalsBanner from "@/app/components/HomepageFinalsBanner";
import { getServerMatchesWindow } from "@/app/lib/serverMatches";

const baseMetadata: Metadata = {
  title: "Tennis Matches Today | Live Scores, Schedule and Where to Watch",
  description:
    "Find today's live and upcoming tennis matches, scores, start times, tournament context and official viewing links for ATP, WTA, Challenger, ITF and Grand Slam tennis.",
  alternates: {
    canonical: "https://watchtennistoday.com",
  },
  openGraph: {
    title: "Tennis Matches Today | Watch Tennis Today",
    description:
      "Search live and upcoming ATP, WTA, Challenger, ITF and Grand Slam matches with scores, times and legal viewing routes.",
    url: "https://watchtennistoday.com",
    type: "website",
  },
};

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function hasNonTrackingQueryParams(searchParams: Record<string, string | string[] | undefined>) {
  return Object.keys(searchParams).some((key) => {
    if (key.startsWith("utm_")) return false;
    if (["gclid", "fbclid", "msclkid", "ref"].includes(key)) return false;

    return searchParams[key] !== undefined;
  });
}

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const resolvedSearchParams = (await searchParams) ?? {};

  return {
    ...baseMetadata,
    robots: hasNonTrackingQueryParams(resolvedSearchParams)
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

const quickLinks = [
  { href: "/today", label: "Today schedule" },
  { href: "/live-tennis-upsets", label: "Live upsets" },
  { href: "/tomorrow", label: "Tomorrow" },
  { href: "/players", label: "Players" },
];

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const shouldNoindex = hasNonTrackingQueryParams(resolvedSearchParams);
  const serverMatches = await getServerMatchesWindow({
    revalidateSeconds: 60,
    includeFinished: true,
    daysBack: 0,
    daysForward: 1,
    timeoutMs: 8000,
  });
  const initialMatches: HomepageMatch[] = serverMatches.map((match) => ({
    id: match.id,
    player1: match.player1,
    player2: match.player2,
    tournament: match.tournament,
    category: match.category,
    status: match.status,
    score: match.score,
    startTime: match.startTime ?? "",
    watchProviders: match.watchProviders.map((provider) => ({
      name: provider.name || "",
      url: provider.url || "",
      accessType: provider.accessType || "",
      verificationStatus: provider.verificationStatus || "",
      note: provider.note || "",
    })),
    round: match.round,
    isFinal: match.isFinal === true,
  }));

  return (
    <main className="min-h-screen bg-black p-4 text-white md:p-8">
      {shouldNoindex ? <meta name="robots" content="noindex, follow" /> : null}
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
              Watch Tennis Today
            </p>
            <h1 className="mt-2 text-3xl font-black leading-tight md:text-5xl">
              Tennis matches today
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
              Search live and upcoming ATP, WTA, Challenger and ITF matches.
              Open a match for score, time and official viewing info.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm font-bold">
            <Link href="/live-tennis" className="rounded-full bg-green-500 px-4 py-2 text-black hover:bg-green-400">
              Live tennis
            </Link>
            <Link href="/live-tennis-upsets" className="rounded-full border border-zinc-800 px-4 py-2 text-zinc-200 hover:border-green-500">
              Upset alerts
            </Link>
            <Link href="/tennis-on-tv-today" className="rounded-full border border-zinc-800 px-4 py-2 text-zinc-200 hover:border-green-500">
              TV schedule
            </Link>
          </div>
        </header>

        <HomepageMatchExplorer initialMatches={initialMatches} />
        <HomepageFinalsBanner />

        <section aria-label="Popular tennis planning pages" className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-black hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/40"
            >
              {link.label}
            </Link>
          ))}
        </section>

        <section
          aria-labelledby="support-project-title"
          className="mt-8 overflow-hidden rounded-3xl border border-green-500/30 bg-gradient-to-br from-green-500/10 via-zinc-950 to-zinc-950 p-6 md:flex md:items-center md:justify-between md:gap-10 md:p-8"
        >
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-green-400">
              Independent tennis resource
            </p>
            <h2 id="support-project-title" className="mt-2 text-2xl font-black md:text-3xl">
              Support the project
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300 md:text-base">
              Watch Tennis Today is built to make tennis schedules, match details
              and official viewing information easier to find. Your support helps
              cover hosting, maintain the data tools and fund the time needed to
              verify information and keep improving the free experience for
              tennis fans.
            </p>
            <p className="mt-2 text-xs leading-5 text-zinc-400">
              Support is optional and never affects our editorial choices.
            </p>
          </div>

          <a
            href="https://www.paypal.me/AnzhalikaSokalava"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex shrink-0 items-center justify-center rounded-full bg-green-500 px-6 py-3 text-sm font-black text-black transition hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-black md:mt-0"
          >
            Support via PayPal
          </a>
        </section>
      </div>
    </main>
  );
}

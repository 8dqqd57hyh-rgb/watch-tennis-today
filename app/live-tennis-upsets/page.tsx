import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import RelatedPages from "@/app/components/RelatedPages";
import { canonicalUrl } from "@/app/lib/technicalSeo";
import { getLiveTennisUpsetMatches } from "@/app/lib/serverMatches";
import LiveUpsetsList from "@/components/tennis/LiveUpsetsList";
import { splitUpsetCandidates, type UpsetMatch } from "@/lib/tennis/upsets";

export const revalidate = 60;

const PAGE_PATH = "/live-tennis-upsets";
const PAGE_URL = canonicalUrl(PAGE_PATH);
const TITLE = "Live Tennis Upsets Today | Watch Tennis Today";
const DESCRIPTION =
  "Track live tennis upset alerts, surprise results, and lower-ranked players challenging favorites in today's ATP and WTA matches.";

const faqItems = [
  {
    question: "What counts as a tennis upset?",
    answer:
      "On this page, an upset means a lower-ranked player is leading or has beaten a higher-ranked opponent based on the ranking fields available in the match feed.",
  },
  {
    question: "How are live tennis upsets detected?",
    answer:
      "The page compares player rankings, match status and available set scores. Bigger ranking gaps, highly ranked favorites, late rounds and underdog set leads increase the upset score.",
  },
  {
    question: "Are rankings always available?",
    answer:
      "No. Some live feeds do not include rankings for every player or event. Matches without enough ranking data are skipped instead of showing guessed upset alerts.",
  },
  {
    question: "Does this page include ATP and WTA matches?",
    answer:
      "Yes. The page can include ATP, WTA and other tennis matches when the shared match feed provides rankings, status and score data for the matchup.",
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

async function getUpsets() {
  const matches = (await getLiveTennisUpsetMatches(60)) as UpsetMatch[];
  return splitUpsetCandidates(matches);
}

export default async function LiveTennisUpsetsPage() {
  const upsets = await getUpsets();
  const liveUpsets = upsets.live;
  const completedUpsets = upsets.completed;
  const upsetScares = upsets.scares;
  const updatedAt = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date());

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Live Tennis Upsets Today",
      url: PAGE_URL,
      description: DESCRIPTION,
      dateModified: new Date().toISOString(),
      isPartOf: {
        "@type": "WebSite",
        name: "Watch Tennis Today",
        url: canonicalUrl("/"),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
        { "@type": "ListItem", position: 2, name: "Live Tennis Upsets", item: PAGE_URL },
      ],
    },
    {
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
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
        <nav className="mb-6 flex flex-wrap gap-2 text-sm text-zinc-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-white">Live tennis upsets</span>
        </nav>

        <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-10">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
            Upset alerts
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">Live Tennis Upsets Today</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            Track live and finished matches where lower-ranked players challenge higher-ranked opponents. Rankings,
            scores and match status come from the available match feed, so unclear rows are skipped instead of guessed.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-4">
            <div className="rounded-3xl border border-zinc-800 bg-black p-5">
              <p className="text-sm font-bold text-zinc-500">Last checked</p>
              <p className="mt-2 text-xl font-black">{updatedAt}</p>
            </div>
            <div className="rounded-3xl border border-red-500/40 bg-red-950/30 p-5">
              <p className="text-sm font-bold text-zinc-400">Live upset alerts</p>
              <p className="mt-2 text-4xl font-black">{liveUpsets.length}</p>
            </div>
            <div className="rounded-3xl border border-emerald-400/30 bg-emerald-950/20 p-5">
              <p className="text-sm font-bold text-zinc-400">Completed upsets</p>
              <p className="mt-2 text-4xl font-black">{completedUpsets.length}</p>
            </div>
            <div className="rounded-3xl border border-amber-300/30 bg-amber-950/20 p-5">
              <p className="text-sm font-bold text-zinc-400">Upset scares</p>
              <p className="mt-2 text-4xl font-black">{upsetScares.length}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/today" className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-black hover:border-emerald-400">
              Today&apos;s tennis schedule
            </Link>
            <Link href="/live-tennis" className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-black hover:border-emerald-400">
              Live tennis
            </Link>
            <Link href="/tennis-results-today" className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-black hover:border-emerald-400">
              Tennis results today
            </Link>
            <Link href="/wimbledon-live" className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-black hover:border-emerald-400">
              Wimbledon live
            </Link>
          </div>
        </section>

        <div className="mt-10 space-y-12">
          <LiveUpsetsList
            candidates={liveUpsets}
            title="Live upset candidates"
            description="Lower-ranked players currently leading or seriously testing higher-ranked opponents in active matches."
            emptyTitle="No live upset alerts right now"
            emptyDescription="No live match currently has a lower-ranked player leading a higher-ranked opponent with usable ranking and score data."
          />

          <LiveUpsetsList
            candidates={completedUpsets}
            title="Recently completed upsets"
            description="Finished matches where the lower-ranked player beat the higher-ranked opponent."
            emptyTitle="No completed upsets found in the recent feed"
            emptyDescription="The recent match feed does not show a completed lower-ranked win with usable ranking data yet."
          />

          <LiveUpsetsList
            candidates={upsetScares}
            title="Upset scares and near misses"
            description="Finished matches where a favorite survived a serious ranking-gap scare."
            emptyTitle="No upset scares found in the recent feed"
            emptyDescription="Near-upset rows appear only when the enriched feed has ranking, completed score and set-pressure context."
          />
        </div>

        <RelatedPages
          className="mt-12"
          currentPath={PAGE_PATH}
          eyebrow="Keep following"
          title="Related tennis pages"
          description="Move from upset alerts into today's full match schedule, live scores context and tournament viewing pages."
          links={[
            { href: "/today", label: "Today's tennis schedule", eyebrow: "Daily hub", description: "See live, upcoming and completed matches." },
            { href: "/live-tennis", label: "Live tennis matches", eyebrow: "Live hub", description: "Follow current ATP and WTA match windows." },
            { href: "/tennis-results-today", label: "Tennis results today", eyebrow: "Results", description: "Check completed match results without guessed scores." },
            { href: "/wimbledon-live", label: "Wimbledon live coverage", eyebrow: "Wimbledon", description: "Follow Wimbledon match and viewing context." },
            { href: "/tennis-live-scores-explained", label: "Live scores explained", eyebrow: "Scores", description: "Understand why live score feeds can differ." },
            { href: "/atp-wta-rankings-explained", label: "ATP and WTA rankings explained", eyebrow: "Rankings", description: "Learn how rankings shape draws and upset context." },
          ]}
        />

        <section className="mt-12 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <h2 className="text-3xl font-black">FAQ</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-2xl border border-zinc-800 bg-black p-5">
                <h3 className="font-black text-white">{item.question}</h3>
                <p className="mt-3 leading-7 text-zinc-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";

export const metadata = {
  title: "Tennis Tournaments Guide | Grand Slam, ATP & WTA Levels Explained",
  description:
    "Understand Grand Slams, ATP Masters 1000, WTA 1000, 500 and 250 tournaments, ranking value, surfaces and how to follow official tennis coverage.",
  alternates: { canonical: "https://watchtennistoday.com/tennis-tournaments" },
};

const levels = [
  { name: "Grand Slams", examples: "Australian Open, Roland Garros, Wimbledon, US Open", body: "The four majors are the most visible events in tennis. They have larger draws, two-week schedules, best-of-five men&apos;s singles matches and the strongest combination of ranking, legacy and broadcast interest." },
  { name: "ATP Masters 1000 / WTA 1000", examples: "Indian Wells, Miami, Madrid, Rome, Cincinnati and other elite tour events", body: "These are major tour-level tournaments below the Grand Slams. They often bring together most top players and strongly affect ranking races, seedings and season narratives." },
  { name: "ATP 500 / WTA 500", examples: "Important regional and surface-preparation events", body: "500-level events can be crucial preparation weeks. They may decide momentum before a major, help players defend points or give top players competitive matches without a two-week Grand Slam load." },
  { name: "ATP 250 / WTA 250", examples: "Smaller tour events around the global calendar", body: "250-level tournaments still matter. They create opportunities for rising players, returning players and specialists who need match wins, ranking points and confidence." },
  { name: "Challenger and ITF", examples: "Developmental and lower-tier professional events", body: "These events build the professional pipeline. They are useful for following prospects, but they usually have less reliable broadcast coverage and should be treated carefully in consumer-facing watch pages." },
];

const faq = [
  { question: "Why does tournament level matter?", answer: "Tournament level affects ranking points, field strength, coverage, player motivation and how much context a daily match needs." },
  { question: "Are all tournament pages worth indexing?", answer: "No. Tournament pages should be indexed only when they provide enough unique context, clear navigation and reliable data. Thin pages with no real schedule or explanation should be excluded." },
  { question: "Does Watch Tennis Today host tournament streams?", answer: "No. The site explains tournament context and helps readers verify legal broadcast availability through official sources and local providers." },
];

export default function TennisTournamentsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", name: "Tennis Tournaments Guide", url: "https://watchtennistoday.com/tennis-tournaments", description: metadata.description },
      { "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://watchtennistoday.com" },
        { "@type": "ListItem", position: 2, name: "Tennis Tournaments", item: "https://watchtennistoday.com/tennis-tournaments" },
      ] },
    ],
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <JsonLd data={schema} />
      <div className="mx-auto max-w-6xl">
        <nav className="flex flex-wrap gap-2 text-sm text-zinc-400"><Link href="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Tennis Tournaments</span></nav>
        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">Tournament authority hub</p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">Tennis tournament levels explained</h1>
          <div className="mt-6 max-w-4xl space-y-5 text-lg leading-9 text-zinc-300">
            <p>Not every tennis tournament has the same weight. A Grand Slam can define a season, while a 250 event might be a comeback week, a confidence builder or a chance for a lower-ranked player to break through. Understanding that hierarchy makes schedules easier to read and helps fans know which matches deserve deeper attention.</p>
            <p>This page is the central tournament guide for Watch Tennis Today. It explains how tournament level connects to ranking pressure, surfaces, player scheduling, broadcast coverage and editorial decisions. It also gives the site a clean internal hub so users do not need to jump from isolated match pages to disconnected tournament pages.</p>
            <p>For monetization and AdSense quality, this matters because tournament pages should provide real value. A good tournament page explains the event, surface, timing, field strength, official viewing context and related guides. A weak tournament page only repeats a title and a schedule placeholder.</p>
          </div>
        </section>

        <section className="mt-8 grid gap-5">
          {levels.map((level) => (
            <article key={level.name} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="text-3xl font-black">{level.name}</h2>
              <p className="mt-2 text-sm font-bold text-emerald-300">{level.examples}</p>
              {/* Static editorial HTML only. Sanitize any future dynamic CMS/API HTML before rendering. */}
              <p className="mt-3 leading-8 text-zinc-300" dangerouslySetInnerHTML={{ __html: level.body }} />
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6">
          <h2 className="text-3xl font-black">Tournament navigation</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <Link href="/tennis-calendar" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">Season calendar</Link>
            <Link href="/tournament" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">Tournament directory</Link>
            <Link href="/grand-slam-live" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">Grand Slam live</Link>
            <Link href="/tennis-guides" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">Tennis guides</Link>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">FAQ</h2>
          <div className="mt-5 space-y-5">
            {faq.map((item) => <div key={item.question} className="border-t border-zinc-800 pt-5"><h3 className="font-black">{item.question}</h3><p className="mt-2 leading-8 text-zinc-300">{item.answer}</p></div>)}
          </div>
        </section>
      </div>
    </main>
  );
}

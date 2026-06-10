import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const metadata = {
  title: "Start Here | Watch Tennis Today Guide for New Tennis Fans",
  description:
    "A simple starting path for new tennis fans: live matches, scoring, rankings, tournaments, players, legal streaming and newsletters.",
  alternates: {
    canonical: "https://watchtennistoday.com/start-here",
  },
};

const steps = [
  {
    title: "1. See what is happening today",
    text: "Start with live and upcoming matches. Tennis has many tours, time zones and court schedules, so a daily match page is usually easier than jumping directly into a tournament site.",
    links: [["Today", "/today"], ["Live tennis", "/live-tennis"], ["Tennis on TV today", "/tennis-on-tv-today"]],
  },
  {
    title: "2. Learn the scoreboard language",
    text: "If 15-30-40, deuce, break point or tiebreaks feel strange, learn those first. After that, match momentum becomes much easier to follow.",
    links: [["Tennis glossary", "/tennis-glossary"], ["Tennis scoring", "/tennis-scoring-explained"], ["Live scores explained", "/tennis-live-scores-explained"]],
  },
  {
    title: "3. Understand the season structure",
    text: "Grand Slams, Masters 1000s, WTA 1000s and smaller tour events all matter differently. Knowing the calendar helps you understand which matches are high-stakes.",
    links: [["Tennis calendar", "/tennis-calendar"], ["Tournament levels", "/tennis-tournaments"], ["Tournaments", "/tournament"], ["Court surfaces", "/tennis-court-surfaces"]],
  },
  {
    title: "4. Pick players to follow",
    text: "Tennis gets more fun when you know styles: who attacks early, who defends, who loves clay, who plays best indoors and who rises in big matches.",
    links: [["Players", "/players"], ["Best players guide", "/best-tennis-players"], ["Tennis analysis", "/analysis"]],
  },
  {
    title: "5. Watch legally and avoid bad streams",
    text: "Broadcast rights vary by country and tournament. Check official broadcasters first, especially for Grand Slams, where rights are separate from regular ATP or WTA tour coverage.",
    links: [["Tennis streaming hub", "/tennis-streaming"], ["Legal streaming guide", "/how-to-watch-tennis-legally"], ["Official broadcasters", "/official-tennis-broadcasters-guide"]],
  },
];

export default function StartHerePage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Start Here",
    url: "https://watchtennistoday.com/start-here",
    description: metadata.description,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: steps.map((step, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: step.title,
        description: step.text,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <JsonLd data={schema} />
      <div className="mx-auto max-w-6xl">
        <nav className="flex flex-wrap gap-2 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Start Here</span>
        </nav>

        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">New fan path</p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">Start here if you want to follow tennis without getting lost</h1>
          <p className="mt-6 max-w-4xl text-lg leading-9 text-zinc-300">
            Watch Tennis Today is built around a simple journey: find matches, understand what the score means, learn why tournaments matter, follow players and use legal viewing options. This page connects those pieces in the order that is most useful for a new or returning fan.
          </p>
        </section>


        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Choose your path</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-5">
            <Link href="/today" className="rounded-2xl border border-zinc-800 bg-black/40 p-4 text-sm font-black hover:border-emerald-300">I want to watch tennis today</Link>
            <Link href="/players" className="rounded-2xl border border-zinc-800 bg-black/40 p-4 text-sm font-black hover:border-emerald-300">I want to follow a player</Link>
            <Link href="/tennis-guides" className="rounded-2xl border border-zinc-800 bg-black/40 p-4 text-sm font-black hover:border-emerald-300">I want to understand tennis rules</Link>
            <Link href="/tournament" className="rounded-2xl border border-zinc-800 bg-black/40 p-4 text-sm font-black hover:border-emerald-300">I want to follow tournaments</Link>
            <Link href="/tennis-streaming" className="rounded-2xl border border-zinc-800 bg-black/40 p-4 text-sm font-black hover:border-emerald-300">I want legal streaming options</Link>
          </div>
        </section>

        <section className="mt-8 grid gap-5">
          {steps.map((step) => (
            <article key={step.title} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="text-3xl font-black">{step.title}</h2>
              <p className="mt-3 max-w-4xl leading-8 text-zinc-300">{step.text}</p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {step.links.map(([label, href]) => (
                  <Link key={href} href={href} className="rounded-2xl border border-zinc-800 bg-black/40 p-4 font-black hover:border-emerald-300">
                    {label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6">
          <h2 className="text-3xl font-black">Want the shortest path?</h2>
          <p className="mt-3 leading-8 text-zinc-300">
            Use <Link href="/today" className="font-black text-emerald-300">Today</Link> or <Link href="/live-tennis" className="font-black text-emerald-300">Live Tennis</Link> on match days, use the <Link href="/tennis-glossary" className="font-black text-emerald-300">glossary</Link> when a term is unclear, and subscribe to the <Link href="/newsletter" className="font-black text-emerald-300">newsletter</Link> if you want low-noise reminders for important tennis windows.
          </p>
        </section>
      </div>

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "Start Here", url: "https://watchtennistoday.com/start-here" },
        ]}
      />
    </main>
  );
}

import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";

export const metadata = {
  title: "Tennis Calendar Guide | Grand Slams, ATP & WTA Season Explained",
  description:
    "A practical tennis calendar guide explaining Grand Slams, ATP and WTA season structure, surfaces, ranking context and how to follow tournaments legally.",
  alternates: { canonical: "https://watchtennistoday.com/tennis-calendar" },
};

const grandSlams = [
  { name: "Australian Open", month: "January", surface: "Hard", location: "Melbourne, Australia", href: "/tournament/australian-open", note: "The first major of the season and often the first big form test after the off-season." },
  { name: "Roland Garros / French Open", month: "May–June", surface: "Clay", location: "Paris, France", href: "/french-open-guide", note: "The clay-court major, where movement, patience and point construction matter heavily." },
  { name: "Wimbledon", month: "June–July", surface: "Grass", location: "London, United Kingdom", href: "/wimbledon-live", note: "The grass-court major, known for short preparation windows and very specific surface skills." },
  { name: "US Open", month: "August–September", surface: "Hard", location: "New York, United States", href: "/tournament/us-open", note: "The final major of the season and a major ranking, legacy and broadcast event." },
];

const seasonBlocks = [
  { title: "January to March", body: "The season opens on hard courts, with the Australian swing followed by major North American events. Early results can reshape confidence quickly because players are returning from pre-season blocks and schedule changes." },
  { title: "April to June", body: "The tour moves through clay and into grass. This is the part of the calendar where surface adaptation matters most: a player who looks strong on hard court may need different movement and shot tolerance on clay." },
  { title: "July to September", body: "Summer hard-court events build toward the US Open. Time zones, late-night sessions and country-specific broadcasters become especially important for fans trying to follow matches live." },
  { title: "October to November", body: "The indoor and Asian swings often decide qualification races for the ATP Finals and WTA Finals. Some players chase points aggressively, while others manage fatigue after the Grand Slam season." },
];

const faq = [
  { question: "Why does the tennis calendar change every year?", answer: "The broad structure is stable, but exact dates, broadcasters, entry lists and daily schedules can change because tournaments update calendars, players withdraw, weather interrupts play and tours adjust event timing." },
  { question: "Which tournaments matter most for rankings?", answer: "Grand Slams carry the most visibility and ranking impact. ATP Masters 1000 and WTA 1000 events are also major ranking weeks, followed by 500 and 250 level tournaments." },
  { question: "Can I use this page as a live schedule?", answer: "This page explains the season structure. For live and daily match listings, use the live tennis, today schedule and TV schedule pages linked from this guide." },
];

export default function TennisCalendarPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Tennis Calendar Guide",
        url: "https://watchtennistoday.com/tennis-calendar",
        description: metadata.description,
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://watchtennistoday.com" },
          { "@type": "ListItem", position: 2, name: "Tennis Calendar", item: "https://watchtennistoday.com/tennis-calendar" },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <JsonLd data={schema} />
      <div className="mx-auto max-w-6xl">
        <nav className="flex flex-wrap gap-2 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Tennis Calendar</span>
        </nav>

        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">Season guide</p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">Tennis calendar explained: Grand Slams, ATP, WTA and surfaces</h1>
          <div className="mt-6 max-w-4xl space-y-5 text-lg leading-9 text-zinc-300">
            <p>The tennis calendar is not one simple league schedule. It is a year-round global tour made from Grand Slams, ATP events, WTA events, team competitions, qualifying weeks and daily order-of-play updates. That is why a match page is more useful when it explains where the match sits in the season rather than only showing a player name and a start time.</p>
            <p>Fans usually understand the four Grand Slams first because they receive the most coverage. But the rest of the calendar shapes the sport just as much. A player can build ranking momentum at 1000-level events, protect form at 500-level events, return from injury at smaller tournaments or use surface swings to prepare for bigger weeks.</p>
            <p>This guide gives Watch Tennis Today a stable season hub. Use it to understand why surfaces change, why daily schedules move, why player priorities differ by month and where to continue when you need live matches, legal broadcast checks or tournament-specific context.</p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Grand Slam calendar</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {grandSlams.map((slam) => (
              <Link key={slam.name} href={slam.href} className="rounded-2xl border border-zinc-800 bg-black/40 p-5 hover:border-emerald-300">
                <p className="text-2xl font-black">{slam.name}</p>
                <p className="mt-2 text-sm font-bold text-emerald-300">{slam.month} · {slam.surface} · {slam.location}</p>
                <p className="mt-3 leading-7 text-zinc-300">{slam.note}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {seasonBlocks.map((block) => (
            <article key={block.title} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="text-2xl font-black">{block.title}</h2>
              <p className="mt-3 leading-8 text-zinc-300">{block.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6">
          <h2 className="text-3xl font-black">Where to go next</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <Link href="/tennis-tournaments" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">Tournament levels</Link>
            <Link href="/today" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">Today&apos;s matches</Link>
            <Link href="/tv-schedule" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">TV schedule</Link>
            <Link href="/tennis-guides" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">All guides</Link>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">FAQ</h2>
          <div className="mt-5 space-y-5">
            {faq.map((item) => (
              <div key={item.question} className="border-t border-zinc-800 pt-5">
                <h3 className="font-black">{item.question}</h3>
                <p className="mt-2 leading-8 text-zinc-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

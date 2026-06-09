import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const metadata = {
  title: "Tennis Resources | Schedules, Players, Guides & Legal Streaming",
  description:
    "A curated Watch Tennis Today resource center for live matches, tennis guides, player pages, tournament calendars and legal streaming help.",
  alternates: {
    canonical: "https://watchtennistoday.com/tennis-resources",
  },
};

const sections = [
  {
    title: "Follow matches today",
    description: "Start with live and upcoming matches, daily order-of-play context and the most useful pages for match-day decisions.",
    links: [
      ["Live tennis", "/live-tennis"],
      ["Best matches today", "/best-tennis-matches-today"],
      ["Tennis on TV today", "/tennis-on-tv-today"],
      ["Order of play today", "/tennis-order-of-play-today"],
    ],
  },
  {
    title: "Learn tennis properly",
    description: "Use evergreen guides to understand scoring, rankings, tournament levels, surfaces and schedule terms.",
    links: [
      ["Tennis guides hub", "/tennis-guides"],
      ["Tennis scoring explained", "/tennis-scoring-explained"],
      ["ATP/WTA rankings explained", "/atp-wta-rankings-explained"],
      ["Tournament levels guide", "/tennis-tournament-levels-guide"],
    ],
  },
  {
    title: "Research players and tournaments",
    description: "Move from a player or tournament page into broader context instead of landing on isolated thin pages.",
    links: [
      ["Players directory", "/players"],
      ["Best players guide", "/best-tennis-players"],
      ["Tournament levels hub", "/tennis-tournaments"],
      ["Tennis calendar", "/tennis-calendar"],
    ],
  },
  {
    title: "Watch legally and safely",
    description: "Check broadcaster availability, streaming rights and safe viewing principles before using any external service.",
    links: [
      ["Legal streaming guide", "/how-to-watch-tennis-legally"],
      ["Broadcast finder", "/tennis-tv-broadcast-finder"],
      ["Official broadcasters", "/official-tennis-broadcasters-guide"],
      ["Watch tennis abroad", "/watch-tennis-abroad"],
    ],
  },
];

export default function TennisResourcesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tennis Resources",
    url: "https://watchtennistoday.com/tennis-resources",
    description: metadata.description,
    hasPart: sections.flatMap((section) =>
      section.links.map(([name, path]) => ({
        "@type": "WebPage",
        name,
        url: `https://watchtennistoday.com${path}`,
      }))
    ),
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <JsonLd data={schema} />
      <div className="mx-auto max-w-6xl">
        <nav className="flex flex-wrap gap-2 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Tennis Resources</span>
        </nav>

        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
            Resource center
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Tennis resources for watching, learning and following the season
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-9 text-zinc-300">
            This page connects the strongest Watch Tennis Today sections into one clean hub.
            It helps readers move from live intent to learning intent, from player pages to
            tournament context and from streaming questions to legal broadcaster guidance.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {sections.map((section) => (
            <article key={section.title} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="text-3xl font-black">{section.title}</h2>
              <p className="mt-3 leading-8 text-zinc-300">{section.description}</p>
              <div className="mt-5 grid gap-3">
                {section.links.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-2xl border border-zinc-800 bg-black/40 p-4 font-black hover:border-emerald-300"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6">
          <h2 className="text-3xl font-black">Why this hub exists</h2>
          <p className="mt-3 leading-8 text-zinc-300">
            A tennis site becomes more useful when pages support each other. A live match page
            should point to player context. A player page should point to calendar and tournament
            guides. A streaming page should point to legal viewing principles. This hub gives
            readers and search engines a clear map of that structure.
          </p>
        </section>
      </div>

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "Tennis Resources", url: "https://watchtennistoday.com/tennis-resources" },
        ]}
      />
    </main>
  );
}

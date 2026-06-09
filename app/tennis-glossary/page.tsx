import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const metadata = {
  title: "Tennis Glossary | Simple ATP, WTA & Grand Slam Terms Explained",
  description:
    "A plain-English tennis glossary explaining scoring, rankings, draws, tournament levels, surfaces and streaming terms for new tennis fans.",
  alternates: {
    canonical: "https://watchtennistoday.com/tennis-glossary",
  },
};

const terms = [
  {
    term: "Ace",
    category: "Scoring",
    definition:
      "A serve that lands in and is not touched by the receiver. Aces are common indicators of serve dominance, especially on faster courts.",
  },
  {
    term: "Advantage",
    category: "Scoring",
    definition:
      "The point after deuce. If the server wins it, the score is advantage server; if the returner wins it, it is advantage receiver.",
  },
  {
    term: "Break point",
    category: "Scoring",
    definition:
      "A point where the returner can win the game on the opponent's serve. Break points are often the most important moments in a set.",
  },
  {
    term: "Deuce",
    category: "Scoring",
    definition:
      "A game score of 40-40. From deuce, a player usually needs two consecutive points to win the game.",
  },
  {
    term: "Double fault",
    category: "Scoring",
    definition:
      "Two missed serves in a row. The server loses the point immediately after a double fault.",
  },
  {
    term: "Hold",
    category: "Scoring",
    definition:
      "When the server wins their service game. Strong servers build pressure by holding comfortably and forcing the opponent to serve under scoreboard pressure.",
  },
  {
    term: "Tiebreak",
    category: "Scoring",
    definition:
      "A special game used to decide a set when the score reaches a specified level, usually 6-6. Players count points normally: 1, 2, 3 and so on.",
  },
  {
    term: "Grand Slam",
    category: "Tournaments",
    definition:
      "One of the four biggest tennis tournaments: Australian Open, Roland Garros, Wimbledon and US Open.",
  },
  {
    term: "Masters 1000",
    category: "Tournaments",
    definition:
      "A top ATP tournament category below the Grand Slams. The name reflects the maximum ranking points awarded to the singles champion.",
  },
  {
    term: "WTA 1000",
    category: "Tournaments",
    definition:
      "A top WTA tournament category below the Grand Slams, used for major women's tour events across the season.",
  },
  {
    term: "Seed",
    category: "Draws",
    definition:
      "A highly ranked player placed in the draw so that top players are less likely to meet in the earliest rounds.",
  },
  {
    term: "Qualifier",
    category: "Draws",
    definition:
      "A player who earns a main-draw place by winning matches in the qualifying event before the tournament begins.",
  },
  {
    term: "Lucky loser",
    category: "Draws",
    definition:
      "A player who loses in qualifying but enters the main draw because another player withdraws before playing.",
  },
  {
    term: "Protected ranking",
    category: "Rankings",
    definition:
      "A ranking mechanism that may help eligible players enter tournaments after a long injury absence, without treating it as their current ranking level.",
  },
  {
    term: "Ranking points",
    category: "Rankings",
    definition:
      "Points earned from tournament results. They determine ATP and WTA rankings and usually drop after the relevant results age out of the ranking window.",
  },
  {
    term: "Hard court",
    category: "Surfaces",
    definition:
      "A common tennis surface used at many tour events and two Grand Slams. It usually produces a medium bounce compared with clay and grass.",
  },
  {
    term: "Clay court",
    category: "Surfaces",
    definition:
      "A slower surface where rallies often last longer and movement skills become especially important. Roland Garros is the best-known clay Grand Slam.",
  },
  {
    term: "Grass court",
    category: "Surfaces",
    definition:
      "A faster, lower-bouncing surface associated most strongly with Wimbledon. Grass can reward serving, returning and quick first-strike tennis.",
  },
  {
    term: "Order of play",
    category: "Schedule",
    definition:
      "The official daily match schedule for a tournament, usually showing courts, match order and approximate start structure.",
  },
  {
    term: "Walkover",
    category: "Schedule",
    definition:
      "A match that is not played because one player withdraws before it starts. It is different from a retirement after the match has begun.",
  },
  {
    term: "Geo-restriction",
    category: "Streaming",
    definition:
      "A viewing limitation based on country or region. Tennis broadcasting rights can differ significantly by location.",
  },
  {
    term: "Official broadcaster",
    category: "Streaming",
    definition:
      "A TV channel or streaming service that holds legal rights to show a tournament in a specific country or region.",
  },
];

const categories = Array.from(new Set(terms.map((term) => term.category)));

export default function TennisGlossaryPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Tennis Glossary",
    url: "https://watchtennistoday.com/tennis-glossary",
    description: metadata.description,
    hasDefinedTerm: terms.map((item) => ({
      "@type": "DefinedTerm",
      name: item.term,
      description: item.definition,
      inDefinedTermSet: "https://watchtennistoday.com/tennis-glossary",
    })),
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <JsonLd data={schema} />
      <div className="mx-auto max-w-6xl">
        <nav className="flex flex-wrap gap-2 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/tennis-guides" className="hover:text-white">Guides</Link>
          <span>/</span>
          <span className="text-white">Tennis Glossary</span>
        </nav>

        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">Beginner friendly</p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">Tennis glossary for ATP, WTA and Grand Slam fans</h1>
          <p className="mt-6 max-w-4xl text-lg leading-9 text-zinc-300">
            Tennis can be confusing when match pages, TV schedules and live scoreboards use shorthand without explanation. This glossary gives simple definitions for the terms that appear most often when following matches, checking draws, reading rankings or looking for legal streams.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => (
              <a key={category} href={`#${category.toLowerCase()}`} className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-200 hover:border-emerald-300">
                {category}
              </a>
            ))}
          </div>
        </section>

        {categories.map((category) => (
          <section key={category} id={category.toLowerCase()} className="mt-8">
            <h2 className="mb-4 text-3xl font-black">{category}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {terms.filter((term) => term.category === category).map((term) => (
                <article key={term.term} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
                  <h3 className="text-2xl font-black">{term.term}</h3>
                  <p className="mt-3 leading-8 text-zinc-300">{term.definition}</p>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-10 rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6">
          <h2 className="text-3xl font-black">Where to go next</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Link href="/tennis-scoring-explained" className="rounded-2xl border border-zinc-800 bg-black/40 p-4 font-black hover:border-emerald-300">Scoring explained</Link>
            <Link href="/tennis-tournament-levels-guide" className="rounded-2xl border border-zinc-800 bg-black/40 p-4 font-black hover:border-emerald-300">Tournament levels</Link>
            <Link href="/atp-wta-rankings-explained" className="rounded-2xl border border-zinc-800 bg-black/40 p-4 font-black hover:border-emerald-300">Rankings guide</Link>
          </div>
        </section>
      </div>

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "Tennis Guides", url: "https://watchtennistoday.com/tennis-guides" },
          { name: "Tennis Glossary", url: "https://watchtennistoday.com/tennis-glossary" },
        ]}
      />
    </main>
  );
}

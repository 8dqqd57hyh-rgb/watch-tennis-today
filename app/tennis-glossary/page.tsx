import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import RelatedGuides from "@/app/components/RelatedGuides";

export const metadata = {
  title: "Tennis Glossary | Scoring, Ranking, Tournament & Streaming Terms",
  description:
    "A plain-English tennis glossary explaining scoring, match, tournament, ranking and legal viewing terms for ATP, WTA and Grand Slam fans.",
  alternates: {
    canonical: "https://watchtennistoday.com/tennis-glossary",
  },
};

const glossarySections = [
  {
    id: "scoring-terms",
    title: "Scoring terms",
    intro: "These are the scoreboard words fans hear most often during a game, set or tiebreak.",
    terms: [
      ["Ace", "A legal serve the receiver does not touch."],
      ["Advantage", "The point after deuce. The player with advantage wins the game if they win the next point."],
      ["Break point", "A point where the receiver can win the server's game."],
      ["Deuce", "A game score of 40-40, usually requiring a two-point sequence to win the game."],
      ["Double fault", "Two missed serves in a row, which gives the point to the receiver."],
      ["Hold", "When the server wins their service game."],
      ["Love", "Zero in tennis scoring."],
      ["Mini-break", "A point won against serve during a tiebreak."],
      ["Tiebreak", "A points-based game used to decide a set when the set reaches a specified score, commonly 6-6."],
    ],
    links: [
      ["/guides/tennis-scoring-system-explained", "Tennis scoring system explained"],
      ["/guides/break-points-explained", "Break points explained"],
      ["/guides/tennis-tiebreak-rules", "Tennis tiebreak rules"],
    ],
  },
  {
    id: "match-terms",
    title: "Match terms",
    intro: "These terms explain how a tennis match is structured or why it might end without a normal final point.",
    terms: [
      ["Best of three", "A match format where the first player to win two sets wins the match."],
      ["Best of five", "A match format where the first player to win three sets wins the match."],
      ["Retirement", "A match that starts but ends early because a player cannot continue."],
      ["Walkover", "A match that is not played because a player withdraws before it begins."],
      ["Withdrawal", "A player pulling out of an event or match before completing participation."],
      ["Order of play", "The official daily schedule showing courts, match order and start structure."],
      ["Suspended match", "A match paused before completion, often because of weather, darkness or court conditions."],
    ],
    links: [
      ["/guides/tennis-match-formats-explained", "Tennis match formats"],
      ["/guides/walkover-vs-retirement", "Walkover vs retirement"],
      ["/guides/tennis-retirement-rules-explained", "Retirement rules"],
    ],
  },
  {
    id: "tournament-terms",
    title: "Tournament terms",
    intro: "Tournament language explains draws, entry paths, event levels and why some weeks carry more weight.",
    terms: [
      ["Draw", "The bracket that decides who can play whom during a tournament."],
      ["Seed", "A highly ranked player placed in the draw so top players are less likely to meet early."],
      ["Qualifier", "A player who earns a main-draw place by winning qualifying matches."],
      ["Lucky loser", "A player who loses in qualifying but enters the main draw after another player withdraws."],
      ["Wild card", "A tournament entry awarded outside the normal ranking-based entry list."],
      ["Bye", "A free pass into a later round, usually given to selected seeded players."],
      ["Grand Slam", "One of the four majors: Australian Open, Roland Garros, Wimbledon and US Open."],
      ["Masters 1000", "A top ATP Tour tournament category below the Grand Slams."],
      ["WTA 1000", "A top WTA tournament category below the Grand Slams."],
    ],
    links: [
      ["/guides/tennis-draws-explained", "Tennis draws explained"],
      ["/guides/grand-slam-tournaments-explained", "Grand Slam tournaments"],
      ["/guides/masters-1000-500-250-explained", "ATP tournament levels"],
      ["/tennis-tournament-levels-guide", "Tournament levels guide"],
    ],
  },
  {
    id: "ranking-terms",
    title: "Ranking terms",
    intro: "Ranking terms help explain entry lists, seedings and why players rise or fall after events.",
    terms: [
      ["Ranking points", "Points earned through tournament results and used to calculate ATP or WTA rankings."],
      ["Defending points", "Points from a previous result that are due to drop from a player's ranking total."],
      ["Live ranking", "An unofficial or in-progress ranking estimate before the official weekly update."],
      ["Protected ranking", "A mechanism that may help eligible players enter events after a long injury absence."],
      ["Race", "A season-only points list, commonly used to track qualification for year-end events."],
      ["Direct entry", "A tournament place earned through ranking without needing qualifying or a wild card."],
    ],
    links: [
      ["/guides/atp-rankings-explained", "ATP rankings explained"],
      ["/guides/tennis-ranking-points-explained", "Ranking points explained"],
      ["/guides/protected-ranking-in-tennis", "Protected ranking explained"],
      ["/atp-wta-rankings-explained", "ATP and WTA rankings guide"],
    ],
  },
  {
    id: "streaming-viewing-terms",
    title: "Streaming / viewing terms",
    intro: "Viewing terms should be handled carefully because legal availability changes by event, rights holder and country.",
    terms: [
      ["Official broadcaster", "A TV channel or streaming service with legal rights to show an event in a specific region."],
      ["Geo-restriction", "A viewing limit based on the country or region where a user is located."],
      ["Blackout", "A rights restriction that prevents a service from showing an event in a particular market."],
      ["Highlights", "Edited video clips that are different from full live match coverage."],
      ["Live scores", "Score updates or statistics, not the same thing as live video."],
      ["Replay", "A recorded match available after live play, if the rights holder offers it."],
      ["Rights holder", "The company or broadcaster licensed to show a tournament or match."],
    ],
    links: [
      ["/official-tennis-broadcasters-guide", "Official broadcasters guide"],
      ["/how-we-verify-streams", "How we verify streams"],
      ["/tennis-streaming-rights-explained", "Streaming rights explained"],
      ["/guides/tennis-tv-vs-grand-slam-broadcasters", "Tennis TV vs Grand Slam broadcasters"],
    ],
  },
];

const faq = [
  {
    question: "Is this glossary a replacement for official tennis rules?",
    answer:
      "No. It is a fan-friendly explanation hub. For formal rules, tournament formats and broadcast details, always verify with official tennis, tournament or broadcaster sources.",
  },
  {
    question: "Why are there no separate pages for every term?",
    answer:
      "A single glossary hub is more useful than many thin pages. Individual term pages should only be created later when they can offer substantial examples, source context and internal links.",
  },
  {
    question: "Can streaming terms mean different things by country?",
    answer:
      "Yes. Broadcast rights and availability vary by tournament and region, so viewing terms should be checked against official country-specific sources.",
  },
  {
    question: "Where should beginners go after the glossary?",
    answer:
      "The tennis guides hub is the best next step because it groups scoring, rankings, tournaments and legal viewing guides in one place.",
  },
];

const allTerms = glossarySections.flatMap((section) =>
  section.terms.map(([term, definition]) => ({ term, definition, section: section.title }))
);

export default function TennisGlossaryPage() {
  const definedTermSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Tennis Glossary",
    url: "https://watchtennistoday.com/tennis-glossary",
    description: metadata.description,
    hasDefinedTerm: allTerms.map((item) => ({
      "@type": "DefinedTerm",
      name: item.term,
      description: item.definition,
      inDefinedTermSet: "https://watchtennistoday.com/tennis-glossary",
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <JsonLd data={[definedTermSchema, faqSchema]} />
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
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Tennis glossary for scoring, rankings, tournaments and watching terms
          </h1>
          <div className="mt-6 max-w-4xl space-y-5 text-lg leading-9 text-zinc-300">
            <p>
              Tennis pages often use short phrases that assume you already know the sport: break point, deuce, seed, qualifier, protected ranking, order of play, blackout and official broadcaster. This glossary explains those terms in plain English so live scores, guide articles and tournament pages are easier to read.
            </p>
            <p>
              The glossary is intentionally grouped instead of split into dozens of thin pages. When a term needs deeper context, the entry links to a full guide that explains examples, match situations or legal viewing checks in more detail.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {glossarySections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-bold text-zinc-200 hover:border-emerald-300">
                {section.title}
              </a>
            ))}
          </div>
        </section>

        {glossarySections.map((section) => (
          <section key={section.id} id={section.id} className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">{section.title}</h2>
            <p className="mt-3 max-w-3xl leading-8 text-zinc-300">{section.intro}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {section.terms.map(([term, definition]) => (
                <article key={`${section.id}-${term}`} className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
                  <h3 className="text-xl font-black">{term}</h3>
                  <p className="mt-3 leading-7 text-zinc-300">{definition}</p>
                </article>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {section.links.map(([href, label]) => (
                <Link key={href} href={href} className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-black text-zinc-200 hover:border-emerald-300">
                  {label}
                </Link>
              ))}
            </div>
          </section>
        ))}

        <RelatedGuides
          className="mt-8"
          eyebrow="Helpful next reads"
          guides={[
            {
              href: "/tennis-guides",
              title: "Tennis guides hub",
              description: "The central hub for rules, rankings, tournaments, viewing and player context.",
              category: "Hub",
            },
            {
              href: "/guides/tennis-scoring-system-explained",
              title: "Tennis scoring system explained",
              description: "A deeper guide to points, games, sets and common scoreboard situations.",
              category: "Scoring",
            },
            {
              href: "/guides/atp-rankings-explained",
              title: "ATP rankings explained",
              description: "How ATP ranking points work and why player rankings change each week.",
              category: "Rankings",
            },
            {
              href: "/official-tennis-broadcasters-guide",
              title: "Official tennis broadcasters guide",
              description: "How to verify legal viewing options by tournament and country.",
              category: "Viewing",
            },
          ]}
        />

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">FAQ</h2>
          <div className="mt-5 space-y-5">
            {faq.map((item) => (
              <div key={item.question} className="border-t border-zinc-800 pt-5">
                <h3 className="font-black text-white">{item.question}</h3>
                <p className="mt-2 leading-8 text-zinc-300">{item.answer}</p>
              </div>
            ))}
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

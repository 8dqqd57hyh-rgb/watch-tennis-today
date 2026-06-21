import Link from "next/link";
import RelatedGuides from "@/app/components/RelatedGuides";
import JsonLd from "@/app/components/JsonLd";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { publishedGuideArticles } from "@/app/guides/articles";

export const metadata = {
  title: "Tennis Guides Hub | Rules, Rankings, Tournaments & Legal Watching",
  description:
    "A central tennis guides hub for scoring, rules, rankings, tournament levels, player context, schedules and legal tennis viewing checks.",
  alternates: { canonical: "https://watchtennistoday.com/tennis-guides" },
};

const faq = [
  {
    question: "What should a new tennis fan read first?",
    answer:
      "Start with scoring, tiebreaks and break points. Once the scoreboard makes sense, rankings, tournament levels and draw terms become much easier to follow.",
  },
  {
    question: "Does Watch Tennis Today provide live streams?",
    answer:
      "No. Watch Tennis Today is an editorial information site. It helps fans understand match context, schedules and how to verify official broadcaster availability.",
  },
  {
    question: "Why are legal viewing guides separated from match pages?",
    answer:
      "Tennis broadcast rights vary by tournament and country. Evergreen viewing guides explain the verification process without making unsafe claims about free or universal streams.",
  },
  {
    question: "Are all guide pages included in the sitemap?",
    answer:
      "Only published, indexable guide articles are emitted. Redirect aliases, noindex comparison pages and thin generated pages should stay out of the sitemap.",
  },
];

const guideCategories = [
  {
    id: "rules",
    title: "Rules and scoring",
    description:
      "Learn the scoreboard language and match situations that decide tennis sets.",
    articleSlugs: [
      "tennis-scoring-system-explained",
      "break-points-explained",
      "tennis-tiebreak-rules",
      "tennis-match-formats-explained",
      "tennis-retirement-walkover-withdrawal",
      "walkover-vs-retirement",
      "tennis-retirement-rules-explained",
      "tennis-walkover-explained",
    ],
    extras: [
      {
        href: "/tennis-scoring-explained",
        title: "Tennis scoring explained",
        description: "A site-level scoring guide for quick beginner context.",
      },
    ],
  },
  {
    id: "rankings",
    title: "Rankings",
    description:
      "Understand ATP and WTA ranking points, protected rankings and why rankings change after tournaments.",
    articleSlugs: [
      "atp-rankings-explained",
      "tennis-ranking-points-explained",
      "protected-ranking-in-tennis",
    ],
    extras: [
      {
        href: "/atp-wta-rankings-explained",
        title: "ATP and WTA rankings explained",
        description: "A broader rankings guide covering both tours.",
      },
    ],
  },
  {
    id: "tournaments",
    title: "Tournaments",
    description:
      "Read draws, seeds, tournament categories, surfaces and Grand Slam structure with more confidence.",
    articleSlugs: [
      "grand-slam-tournaments-explained",
      "masters-1000-500-250-explained",
      "tennis-draws-explained",
      "tennis-seeds-explained",
      "tennis-qualifying-rounds-explained",
      "lucky-loser-explained",
      "wild-card-in-tennis-explained",
      "tennis-bye-explained",
      "tennis-surfaces-explained",
    ],
    extras: [
      {
        href: "/french-open-guide",
        title: "French Open / Roland Garros guide",
        description: "Evergreen background on the clay-court Grand Slam in Paris.",
      },
      {
        href: "/tennis-tournament-levels-guide",
        title: "Tennis tournament levels guide",
        description: "Compare Grand Slams, 1000s, 500s, 250s and lower-tier events.",
      },
      {
        href: "/tennis-court-surfaces",
        title: "Tennis court surfaces",
        description: "Clay, grass and hard courts explained for fans.",
      },
    ],
  },
  {
    id: "watching",
    title: "Streaming and watching",
    description:
      "Use legal, country-aware viewing checks before paying for a service or clicking a stream result.",
    articleSlugs: ["tennis-tv-vs-grand-slam-broadcasters"],
    extras: [
      {
        href: "/official-tennis-broadcasters-guide",
        title: "Official tennis broadcasters guide",
        description: "How to verify official rights holders by tournament and country.",
      },
      {
        href: "/how-we-verify-streams",
        title: "How we verify streams",
        description: "The editorial checks used before discussing viewing options.",
      },
      {
        href: "/best-ways-to-watch-tennis-online",
        title: "Best legal ways to watch tennis online",
        description: "A legal-first viewing overview without unsafe free-stream claims.",
      },
      {
        href: "/tennis-streaming-rights-explained",
        title: "Tennis streaming rights explained",
        description: "Why rights differ by event, tour and region.",
      },
      {
        href: "/tennis-streaming-checklist",
        title: "Tennis streaming checklist",
        description: "A pre-subscription checklist for choosing the right legal tennis service.",
      },
    ],
  },
  {
    id: "players",
    title: "Player and match guides",
    description:
      "Connect rules, rankings and tournament context to the pages fans use on match days.",
    articleSlugs: ["atp-vs-wta-explained"],
    extras: [
      {
        href: "/players",
        title: "Tennis players hub",
        description: "Find indexable player profiles and live player context.",
      },
      {
        href: "/best-tennis-matches-today",
        title: "Best tennis matches today",
        description: "A daily match-priority view with context instead of stream promises.",
      },
      {
        href: "/who-plays-tennis-today",
        title: "Who plays tennis today",
        description: "A schedule-led starting point for match discovery.",
      },
    ],
  },
];

function articleBySlug(slug: string) {
  return publishedGuideArticles.find((article) => article.slug === slug);
}

function linksForCategory(category: (typeof guideCategories)[number]) {
  const articleLinks = category.articleSlugs
    .map(articleBySlug)
    .filter((article): article is NonNullable<ReturnType<typeof articleBySlug>> => Boolean(article));

  return [...articleLinks, ...category.extras];
}

export default function TennisGuidesHubPage() {
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
      <JsonLd data={faqSchema} />
      <div className="mx-auto max-w-6xl">
        <nav className="flex flex-wrap gap-2 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Tennis Guides</span>
        </nav>

        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">Tennis knowledge hub</p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Tennis guides for rules, rankings, tournaments and legal watching
          </h1>
          <div className="mt-6 max-w-4xl space-y-5 text-lg leading-9 text-zinc-300">
            <p>
              This hub is the editorial map for Watch Tennis Today. It collects the useful, indexable guides that help fans understand what they are seeing on scoreboards, tournament pages and official broadcaster listings.
            </p>
            <p>
              The goal is not to create a page for every tennis phrase or every possible match. The goal is to make the strongest explanations easier to find: scoring terms, ranking pressure, draw structure, tournament levels, surface context and the legal checks needed before watching tennis online.
            </p>
            <p>
              Use the sections below as a reading path. New fans can start with scoring and tiebreaks, returning fans can jump into rankings or tournament levels, and viewers comparing services can use the streaming section before making any paid or country-specific decision.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/tennis-glossary" className="rounded-full bg-emerald-400 px-5 py-3 font-black text-black hover:bg-emerald-300">
              Tennis glossary
            </Link>
            <Link href="/how-we-verify-streams" className="rounded-full border border-zinc-700 px-5 py-3 font-black text-zinc-200 hover:border-emerald-300">
              Verification policy
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-5">
          {guideCategories.map((category) => (
            <a key={category.id} href={`#${category.id}`} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-black hover:border-emerald-300">
              {category.title}
            </a>
          ))}
        </section>

        {guideCategories.map((category) => (
          <section key={category.id} id={category.id} className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">{category.title}</h2>
            <p className="mt-3 max-w-3xl leading-8 text-zinc-300">{category.description}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {linksForCategory(category).map((item) => {
                const href = "slug" in item ? `/guides/${item.slug}` : item.href;
                return (
                  <Link key={href} href={href} className="rounded-2xl border border-zinc-800 bg-black/40 p-5 hover:border-emerald-300">
                    {"category" in item ? (
                      <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">{item.category}</p>
                    ) : null}
                    <p className="text-xl font-black">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{item.description}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        <RelatedGuides
          className="mt-8"
          eyebrow="Start here"
          title="Essential guide path"
          guides={[
            {
              href: "/tennis-glossary",
              title: "Tennis glossary",
              description: "Plain-English definitions for scoring, match, ranking, tournament and viewing terms.",
              category: "Glossary",
            },
            ...[
              "tennis-scoring-system-explained",
              "atp-rankings-explained",
              "grand-slam-tournaments-explained",
              "tennis-tv-vs-grand-slam-broadcasters",
            ]
              .map(articleBySlug)
              .filter((article): article is NonNullable<ReturnType<typeof articleBySlug>> => Boolean(article)),
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

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Commercial content opportunities to research</h2>
          <p className="mt-3 leading-8 text-zinc-300">
            These should only become standalone pages after current official sources, pricing, rights limits and regional availability are verified.
          </p>
          <ul className="mt-4 grid gap-3 text-zinc-300 md:grid-cols-2">
            <li className="rounded-2xl border border-zinc-800 p-4">Tennis TV review</li>
            <li className="rounded-2xl border border-zinc-800 p-4">ESPN+ tennis guide</li>
            <li className="rounded-2xl border border-zinc-800 p-4">Tennis Channel guide</li>
            <li className="rounded-2xl border border-zinc-800 p-4">Best legal ways to watch tennis</li>
            <li className="rounded-2xl border border-zinc-800 p-4">Tennis TV vs Grand Slam broadcasters</li>
          </ul>
        </section>
      </div>

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "Tennis Guides", url: "https://watchtennistoday.com/tennis-guides" },
        ]}
      />
    </main>
  );
}

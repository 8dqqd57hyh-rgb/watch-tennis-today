import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "French Open / Roland Garros Guide | Clay Major Explained",
  description:
    "An evergreen French Open and Roland Garros guide covering the tournament, Paris venue, clay surface, format, legal viewing checks and how to follow future editions.",
  alternates: { canonical: "https://watchtennistoday.com/french-open-guide" },
};

const faq = [
  {
    question: "Is Roland Garros the same as the French Open?",
    answer:
      "Yes. Roland Garros is the venue and common tournament name, while French Open is the English name used by many fans and broadcasters.",
  },
  {
    question: "Where is Roland Garros played?",
    answer:
      "It is played at Stade Roland Garros in Paris, France, on outdoor clay courts.",
  },
  {
    question: "What surface is the French Open played on?",
    answer:
      "The French Open is the clay-court Grand Slam. Clay usually creates longer rallies, slower court speed and more physical movement demands than many hard-court events.",
  },
  {
    question: "Does this page show live French Open matches?",
    answer:
      "No. This is an evergreen tournament guide. During future editions, use the official order of play and current Watch Tennis Today schedule pages for daily match status.",
  },
  {
    question: "Where should fans check legal French Open viewing options?",
    answer:
      "Start with the official tournament broadcaster information and licensed providers in your country. Rights vary by region, year and package.",
  },
];

const sections = [
  {
    title: "What Roland Garros is",
    body:
      "Roland Garros, widely known in English as the French Open, is one of the four Grand Slam tennis tournaments. It sits in the clay-court part of the season and is the major most closely associated with patience, movement, spin, stamina and tactical point construction.",
  },
  {
    title: "Where it is played",
    body:
      "The tournament is played at Stade Roland Garros in Paris, France. Because it is an outdoor event, weather, court assignment and session timing can affect the order of play. Fans following a future edition should always confirm daily schedules with official tournament sources.",
  },
  {
    title: "Why clay changes the tournament",
    body:
      "Clay tends to slow the ball, reward heavy topspin and make sliding movement part of the match. Big serves still matter, but players often need to win points through patterns, recovery and repeated shot quality. That is why Roland Garros can produce different results from faster hard-court or grass events.",
  },
  {
    title: "Tournament format in general terms",
    body:
      "Roland Garros includes singles, doubles and other draws, with qualifying held before the main draw. The main singles draws use seeded players, direct entries, wild cards and qualifiers. Exact draw sizes, schedules and event operations should be checked against the current official tournament information for the relevant year.",
  },
  {
    title: "Legal viewing and streaming notes",
    body:
      "French Open broadcast rights are event-specific and country-specific. A service that carries regular ATP or WTA tournaments may not automatically include Grand Slam coverage. Before paying for or relying on any viewing option, verify the event, country, language, live coverage and replay rights with the official broadcaster or licensed provider.",
  },
  {
    title: "How to follow future editions",
    body:
      "Before the tournament, start with the draw, qualifying and broadcaster information. During the tournament, use the official order of play, local time conversion and reliable live-score sources. After the tournament, use results and recap pages instead of expired live pages.",
  },
];

export default function FrenchOpenGuidePage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "French Open / Roland Garros Guide",
    description: metadata.description,
    url: "https://watchtennistoday.com/french-open-guide",
    about: [
      { "@type": "SportsEvent", name: "French Open" },
      { "@type": "SportsEvent", name: "Roland Garros" },
    ],
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <JsonLd data={[webpageSchema, faqSchema]} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "Tennis Guides", url: "https://watchtennistoday.com/tennis-guides" },
          { name: "French Open Guide", url: "https://watchtennistoday.com/french-open-guide" },
        ]}
      />

      <div className="mx-auto max-w-5xl">
        <nav className="flex flex-wrap gap-2 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/tennis-guides" className="hover:text-white">Tennis Guides</Link>
          <span>/</span>
          <span className="text-white">French Open Guide</span>
        </nav>

        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-orange-300">
            Evergreen Grand Slam guide
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            French Open / Roland Garros guide
          </h1>
          <div className="mt-6 max-w-4xl space-y-5 text-lg leading-9 text-zinc-300">
            <p>
              This is a stable guide to Roland Garros, the clay-court Grand Slam in Paris.
              It explains the tournament, surface, format and legal viewing checks without
              suggesting that a finished edition is still live.
            </p>
            <p>
              Use it when you need background before a future French Open, when reading
              a draw, or when comparing Grand Slam viewing rights. For current schedules,
              always check the official order of play for the relevant tournament year.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {sections.map((section) => (
            <article key={section.title} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="text-2xl font-black">{section.title}</h2>
              <p className="mt-3 leading-8 text-zinc-300">{section.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Useful related pages</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ["/where-to-watch-french-open", "Where to watch French Open"],
              ["/french-open-results", "French Open results"],
              ["/tennis-calendar", "Tennis calendar guide"],
              ["/guides/grand-slam-tournaments-explained", "Grand Slam tournaments explained"],
              ["/guides/tennis-surfaces-explained", "Tennis surfaces explained"],
              ["/grand-slam-tv-rights-explained", "Grand Slam TV rights explained"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl border border-zinc-800 bg-black px-4 py-4 font-black text-zinc-100 transition hover:border-orange-400"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">FAQ</h2>
          <div className="mt-5 space-y-5">
            {faq.map((item) => (
              <div key={item.question} className="border-t border-zinc-800 pt-5">
                <h3 className="text-lg font-black">{item.question}</h3>
                <p className="mt-2 leading-8 text-zinc-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

import Link from "next/link";
import { guideArticles } from "@/app/guides/articles";

export const metadata = {
  title: "Tennis Guides Hub | Rules, Rankings, Tournaments & Watching Tennis",
  description:
    "A complete tennis guides hub covering scoring, rules, rankings, tournaments, surfaces, schedules, player pages and legal streaming checks.",
  alternates: { canonical: "https://watchtennistoday.com/tennis-guides" },
};

const faq = [
  {
    question: "What is the best guide to read first?",
    answer:
      "Start with tennis scoring if you are new to the sport, then read the rankings and tournament-level guides to understand why some matches have more season impact than others.",
  },
  {
    question: "Does Watch Tennis Today stream matches?",
    answer:
      "No. Watch Tennis Today is an informational site. It helps fans understand tennis schedules, match context and where to verify official broadcast availability.",
  },
  {
    question: "Why do tennis schedules change so often?",
    answer:
      "Tennis start times can move because matches are played after earlier matches on the same court, rain can interrupt outdoor events and players can withdraw or retire.",
  },
  {
    question: "How are these guides reviewed?",
    answer:
      "Guides are written as evergreen editorial explanations and are reviewed against official tennis rules, public ATP/WTA information and official tournament or broadcaster sources where relevant.",
  },
];

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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://watchtennistoday.com" },
      { "@type": "ListItem", position: 2, name: "Tennis Guides", item: "https://watchtennistoday.com/tennis-guides" },
    ],
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
              Tennis is simple at first glance — two players hit a ball over a net — but the sport becomes much easier to enjoy when you understand the scoreboard, the tour calendar, the tournament levels and the way official broadcast rights work. This hub collects Watch Tennis Today&apos;s evergreen guides in one place so fans can move from basic rules to practical match-following decisions without relying on thin schedule pages or unsafe streaming shortcuts.
            </p>
            <p>
              The rules section explains the language you hear during matches: break points, tiebreaks, walkovers, retirements, withdrawals and other moments that can change a match without always being obvious from the score alone. If you have ever seen 30-40, 6-6, RET or W/O on a scoreboard and wondered what it means for the match, the rules guides are the right starting point.
            </p>
            <p>
              Rankings and tournaments need a different kind of context. ATP and WTA points are not permanent; they rise and fall as old results drop off and new results are added. Tournament levels also matter because a Grand Slam, Masters 1000, WTA 1000, 500 event, 250 event, Challenger and ITF event do not carry the same points, prize money, field depth or broadcast coverage. Our tournament guides explain those differences in plain language so a daily schedule feels less random.
            </p>
            <p>
              Watching tennis legally also requires careful verification. Broadcast rights vary by tournament and country, and availability can change across ATP, WTA, Grand Slam and regional events. Watch Tennis Today does not host video, embed streams or promise free access to copyrighted broadcasts. Instead, the site helps readers identify official broadcasters, check tournament pages, understand time-zone issues and avoid misleading stream pages that may be unsafe or unauthorized.
            </p>
            <p>
              Player guides connect those concepts to real viewing decisions. A Carlos Alcaraz clay match, a Jannik Sinner indoor match, an Iga Swiatek Roland Garros match and a Coco Gauff U.S. hard-court match can all carry different tactical and broadcast context. Good player pages should not only show whether a match is live; they should explain the player&apos;s style, tournament situation, schedule uncertainty and where a fan should verify official coverage.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <a href="#rules" className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 font-black hover:border-emerald-300">Rules</a>
          <a href="#rankings" className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 font-black hover:border-emerald-300">Rankings</a>
          <a href="#tournaments" className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 font-black hover:border-emerald-300">Tournaments</a>
          <a href="#watching" className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 font-black hover:border-emerald-300">Watching legally</a>
        </section>

        <section id="rules" className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Rules and scoring guides</h2>
          <p className="mt-3 max-w-3xl leading-8 text-zinc-300">
            Use these guides to understand how points, games, sets and unusual match endings work before reading a live scoreboard.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {guideArticles.map((article) => (
              <Link key={article.slug} href={`/guides/${article.slug}`} className="rounded-2xl border border-zinc-800 bg-black/40 p-5 hover:border-emerald-300">
                <p className="text-xl font-black">{article.title}</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{article.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section id="rankings" className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">Rankings and points</h2>
            <p className="mt-3 leading-8 text-zinc-300">
              Ranking context helps fans understand why a first-round match can matter, why defending points creates pressure and why seedings can affect a draw before the first ball is hit.
            </p>
            <Link href="/atp-wta-rankings-explained" className="mt-5 inline-block rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black">Read rankings guide</Link>
          </div>
          <div id="tournaments" className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">Tournament levels</h2>
            <p className="mt-3 leading-8 text-zinc-300">
              Tournament level explains field strength, ranking impact, broadcaster interest and why Grand Slams, Masters/WTA 1000 events and smaller tour events should not be treated as identical.
            </p>
            <Link href="/tennis-tournament-levels-guide" className="mt-5 inline-block rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black">Read tournament levels guide</Link>
          </div>
        </section>

        <section id="watching" className="mt-8 rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6">
          <h2 className="text-3xl font-black">Watching tennis legally</h2>
          <p className="mt-3 leading-8 text-zinc-300">
            Legal tennis viewing starts with the tournament and your country. A service that has rights for one Grand Slam may not have rights for every ATP or WTA event. Before subscribing or clicking a stream, verify the official tournament website, local broadcaster listings and provider terms. This keeps the site useful for fans and avoids unsafe shortcuts.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Link href="/official-tennis-broadcasters-guide" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">Official broadcasters</Link>
            <Link href="/how-we-verify-streams" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">How we verify streams</Link>
            <Link href="/watch-tennis-in" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">Country viewing guides</Link>
          </div>
        </section>

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
          <h2 className="text-3xl font-black">Editorial trust links</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Link href="/authors/watch-tennis-today" className="rounded-2xl border border-zinc-800 p-4 font-black hover:border-emerald-300">Editorial team</Link>
            <Link href="/editorial-policy" className="rounded-2xl border border-zinc-800 p-4 font-black hover:border-emerald-300">Editorial policy</Link>
            <Link href="/how-we-source-data" className="rounded-2xl border border-zinc-800 p-4 font-black hover:border-emerald-300">How we source data</Link>
            <Link href="/contact" className="rounded-2xl border border-zinc-800 p-4 font-black hover:border-emerald-300">Corrections and contact</Link>
            <Link href="/privacy" className="rounded-2xl border border-zinc-800 p-4 font-black hover:border-emerald-300">Privacy policy</Link>
            <Link href="/affiliate-disclosure" className="rounded-2xl border border-zinc-800 p-4 font-black hover:border-emerald-300">Affiliate disclosure</Link>
          </div>
        </section>
      </div>
    </main>
  );
}

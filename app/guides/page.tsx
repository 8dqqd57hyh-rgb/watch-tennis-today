import Link from "next/link";
import { guideArticles } from "./articles";

export const metadata = {
  title: "Tennis Knowledge Guides | Watch Tennis Today",
  description: "Original tennis knowledge guides covering scoring, rules, rankings, tournaments, surfaces, schedules and legal viewing context.",
  alternates: { canonical: "https://watchtennistoday.com/guides" },
};

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-zinc-400 hover:text-white">← Back</Link>
        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Original guides</p>
          <h1 className="text-4xl font-black md:text-6xl">Tennis Knowledge Guides</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            Practical, original guides for tennis fans who want to understand scoring, rules, rankings, tournaments, surfaces, scheduling and legal viewing context without thin SEO filler.
          </p>
        </section>
        <section className="mt-8 rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6">
          <h2 className="text-2xl font-black text-white">Start with core tennis concepts</h2>
          <p className="mt-3 max-w-3xl leading-8 text-zinc-300">
            New to the site? These guides explain scoring, live-score reliability, schedule terms, tournament levels, rankings and official broadcaster checks before you use the daily match pages.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ["/tennis-scoring-explained", "Tennis scoring explained"],
              ["/tennis-live-scores-explained", "Live scores explained"],
              ["/tennis-schedule-terms-explained", "Schedule terms explained"],
              ["/tennis-tournament-levels-guide", "Tournament levels guide"],
              ["/atp-wta-rankings-explained", "ATP/WTA rankings explained"],
              ["/official-tennis-broadcasters-guide", "Official broadcasters guide"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-2xl border border-zinc-700 bg-black/30 p-4 font-black text-zinc-100 hover:border-emerald-300">
                {label} →
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {guideArticles.map((article) => (
            <Link key={article.slug} href={`/guides/${article.slug}`} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-emerald-400">
              <h2 className="text-2xl font-black text-white">{article.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{article.description}</p>
              <p className="mt-4 text-sm font-black text-emerald-300">Read guide →</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

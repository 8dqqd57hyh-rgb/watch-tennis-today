import Link from "next/link";
import { publishedGuideArticles } from "./articles";

export const metadata = {
  title: "Tennis Knowledge Guides | Watch Tennis Today",
  description:
    "Original tennis knowledge guides covering scoring, rules, rankings, tournaments, surfaces, draws, schedules and legal viewing context.",
  alternates: { canonical: "https://watchtennistoday.com/guides" },
};

const categoryOrder = ["Scoring", "Rules", "Draws", "Rankings", "Tournaments", "Surfaces", "Tours", "Streaming"];

function getCategoryGroups() {
  const categories = Array.from(new Set(publishedGuideArticles.map((article) => article.category))).sort(
    (a, b) => {
      const aIndex = categoryOrder.indexOf(a);
      const bIndex = categoryOrder.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    }
  );

  return categories.map((category) => ({
    category,
    articles: publishedGuideArticles.filter((article) => article.category === category),
  }));
}

export default function GuidesPage() {
  const categoryGroups = getCategoryGroups();

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-zinc-400 hover:text-white">← Back</Link>
        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Original guides</p>
          <h1 className="text-4xl font-black md:text-6xl">Tennis Knowledge Guides</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            Practical, original guides for tennis fans who want to understand scoring, rules, rankings, tournament draws, surfaces, scheduling and legal viewing context without thin SEO filler.
          </p>
          <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="font-black text-white">{publishedGuideArticles.length} guides</p>
              <p className="mt-1 text-zinc-500">Evergreen tennis explanations</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="font-black text-white">{categoryGroups.length} categories</p>
              <p className="mt-1 text-zinc-500">Scoring, draws, rankings and more</p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="font-black text-white">Human review</p>
              <p className="mt-1 text-zinc-500">No fake stream claims or filler pages</p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6">
          <h2 className="text-2xl font-black text-white">Start with core tennis concepts</h2>
          <p className="mt-3 max-w-3xl leading-8 text-zinc-300">
            New to the site? These hub pages explain scoring, live-score reliability, schedule terms, tournament levels, rankings and official broadcaster checks before you use the daily match pages.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ["/tennis-scoring-explained", "Tennis scoring explained"],
              ["/tennis-glossary", "Tennis glossary"],
              ["/tennis-live-scores-explained", "Live scores explained"],
              ["/tennis-schedule-terms-explained", "Schedule terms explained"],
              ["/tennis-tournament-levels-guide", "Tournament levels guide"],
              ["/official-tennis-broadcasters-guide", "Official broadcasters guide"],
              ["/tennis-streaming-cost-calculator", "Streaming cost calculator"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-2xl border border-zinc-700 bg-black/30 p-4 font-black text-zinc-100 hover:border-emerald-300">
                {label} →
              </Link>
            ))}
          </div>
        </section>

        <nav className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-5" aria-label="Guide categories">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-zinc-500">Browse by category</p>
          <div className="flex flex-wrap gap-3">
            {categoryGroups.map((group) => (
              <a key={group.category} href={`#${group.category.toLowerCase()}`} className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-black text-zinc-200 hover:border-emerald-300">
                {group.category} ({group.articles.length})
              </a>
            ))}
          </div>
        </nav>

        {categoryGroups.map((group) => (
          <section key={group.category} id={group.category.toLowerCase()} className="mt-8">
            <h2 className="mb-4 text-3xl font-black">{group.category}</h2>
            <div className="grid gap-5 md:grid-cols-2">
              {group.articles.map((article) => (
                <Link key={article.slug} href={`/guides/${article.slug}`} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-emerald-400">
                  <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">{article.category}</p>
                  <h3 className="text-2xl font-black text-white">{article.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{article.description}</p>
                  <p className="mt-4 text-sm font-black text-emerald-300">Read guide →</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

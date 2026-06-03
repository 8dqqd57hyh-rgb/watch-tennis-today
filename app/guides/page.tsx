import Link from "next/link";
import { guideArticles } from "./articles";

export const metadata = {
  title: "Tennis Watching Guides | Watch Tennis Today",
  description: "Original tennis watching guides covering legal streams, schedules, live scores, Grand Slam broadcasters and safe tennis viewing.",
  alternates: { canonical: "https://watchtennistoday.com/guides" },
};

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-zinc-400 hover:text-white">← Back</Link>
        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-emerald-300">Original guides</p>
          <h1 className="text-4xl font-black md:text-6xl">Tennis Watching Guides</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            Practical, original guides for tennis fans who want to follow live matches, understand schedules and find legal viewing options without unsafe streaming links.
          </p>
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

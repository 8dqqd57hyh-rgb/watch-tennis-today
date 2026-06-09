import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";

export const metadata = {
  title: "Tennis Analysis Hub | Match Context, Tactics & Player Styles",
  description:
    "A tennis analysis hub explaining tactics, player styles, surfaces, match context and how to read tennis beyond the scoreboard.",
  alternates: { canonical: "https://watchtennistoday.com/analysis" },
};

const analysisTopics = [
  { title: "How to read a tennis matchup", body: "A matchup is not only ranking versus ranking. Surface, return quality, first-serve percentage, backhand tolerance, movement and recent scheduling all shape the match before the first game is finished." },
  { title: "Why surfaces change tactics", body: "Clay rewards patience and movement, grass can reward low bounces and first strikes, while hard courts often expose balance between attack and defense. Good previews should explain the surface instead of treating every event the same." },
  { title: "Why break points matter", body: "Break points are pressure moments because one return game can flip the set. A player may win fewer total points but still win the important points if they protect serve and convert chances." },
  { title: "Why official viewing context matters", body: "Analysis and watch intent are connected. A major match needs context about tournament level, country-specific rights and safe legal viewing options, not promises of unofficial streams." },
];

export default function TennisAnalysisHubPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Tennis Analysis Hub",
    url: "https://watchtennistoday.com/analysis",
    description: metadata.description,
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <JsonLd data={schema} />
      <div className="mx-auto max-w-6xl">
        <nav className="flex flex-wrap gap-2 text-sm text-zinc-400"><Link href="/" className="hover:text-white">Home</Link><span>/</span><span className="text-white">Analysis</span></nav>

        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">Editorial analysis</p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">Tennis analysis beyond the live scoreboard</h1>
          <div className="mt-6 max-w-4xl space-y-5 text-lg leading-9 text-zinc-300">
            <p>Live scores are useful, but they rarely explain why a match is interesting. Tennis fans need a bridge between the schedule and the story: playing styles, surfaces, pressure points, tournament level, ranking context and legal viewing options.</p>
            <p>This hub is designed as the editorial home for future match-analysis articles. It avoids fake predictions and unsupported claims. Instead, it gives a clear framework for explaining tennis in a way that is helpful for fans and safer for long-term AdSense quality.</p>
            <p>Future articles can focus on tactical questions such as why a returner creates pressure, why a clay-court matchup favors patience, why a player struggles indoors or why a tournament draw creates a difficult path. That kind of content is more valuable than generating hundreds of thin score pages.</p>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {analysisTopics.map((topic) => (
            <article key={topic.title} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <h2 className="text-3xl font-black">{topic.title}</h2>
              <p className="mt-3 leading-8 text-zinc-300">{topic.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6">
          <h2 className="text-3xl font-black">Research paths</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <Link href="/best-tennis-players" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">Player styles</Link>
            <Link href="/tennis-tournaments" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">Tournament context</Link>
            <Link href="/tennis-scoring-explained" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">Scoring guide</Link>
            <Link href="/tennis-guides" className="rounded-2xl border border-emerald-800 bg-black/30 p-4 font-black hover:border-emerald-300">All guides</Link>
          </div>
        </section>
      </div>
    </main>
  );
}

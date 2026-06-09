import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const metadata = {
  title: "Tennis Court Surfaces Explained | Clay, Grass & Hard Courts",
  description:
    "Learn how clay, grass and hard courts change tennis tactics, rallies, serve effectiveness, movement and tournament expectations.",
  alternates: {
    canonical: "https://watchtennistoday.com/tennis-court-surfaces",
  },
};

const surfaces = [
  {
    name: "Clay courts",
    examples: "Roland Garros and many spring European events",
    traits: ["Slower conditions", "Higher bounce", "Longer rallies", "More sliding and patience"],
    explanation:
      "Clay usually gives players more time to defend and build points. Heavy topspin, endurance, drop shots and point construction often become more important than one-shot power.",
  },
  {
    name: "Grass courts",
    examples: "Wimbledon and the short grass swing before it",
    traits: ["Faster conditions", "Lower bounce", "Shorter reaction time", "First-strike tennis"],
    explanation:
      "Grass can reward quick serves, sharp returns, early ball-striking and confident net approaches. Because the bounce stays lower, players often have less time to reset rallies.",
  },
  {
    name: "Hard courts",
    examples: "Australian Open, US Open and many tour events",
    traits: ["Medium-to-fast conditions", "Reliable bounce", "Balanced styles", "Heavy calendar presence"],
    explanation:
      "Hard courts are common across the tennis calendar and tend to suit a wide mix of styles. The exact speed can still vary by event, ball, weather and indoor or outdoor conditions.",
  },
];

export default function TennisCourtSurfacesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Tennis Court Surfaces Explained",
    description: metadata.description,
    url: "https://watchtennistoday.com/tennis-court-surfaces",
    author: {
      "@type": "Organization",
      name: "Watch Tennis Today",
    },
    publisher: {
      "@type": "Organization",
      name: "Watch Tennis Today",
      logo: {
        "@type": "ImageObject",
        url: "https://watchtennistoday.com/icon.png",
      },
    },
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
          <span className="text-white">Court Surfaces</span>
        </nav>

        <article className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">Tactics guide</p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">Tennis court surfaces explained: clay, grass and hard courts</h1>
          <p className="mt-6 max-w-4xl text-lg leading-9 text-zinc-300">
            Surface is one of the simplest ways to understand why a tennis match feels different from week to week. The same two players can produce longer rallies on clay, faster exchanges on grass and a more balanced contest on hard courts. This guide explains what changes and how to read those changes when watching matches.
          </p>

          <section className="mt-8 grid gap-5 md:grid-cols-3">
            {surfaces.map((surface) => (
              <div key={surface.name} className="rounded-3xl border border-zinc-800 bg-black/40 p-6">
                <h2 className="text-2xl font-black">{surface.name}</h2>
                <p className="mt-2 text-sm font-bold text-emerald-300">{surface.examples}</p>
                <p className="mt-4 leading-8 text-zinc-300">{surface.explanation}</p>
                <ul className="mt-4 space-y-2 text-zinc-300">
                  {surface.traits.map((trait) => (
                    <li key={trait}>• {trait}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="mt-10 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black">Why surface matters for watching tennis</h2>
              <p className="mt-4 leading-8 text-zinc-300">
                Surface changes the value of serve power, return depth, movement, stamina and risk tolerance. A player who looks dominant indoors may need more patience on clay. A defender who thrives in long rallies may have less time on grass. Good match previews should account for this instead of treating every court as the same.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-black">How to use this on match days</h2>
              <p className="mt-4 leading-8 text-zinc-300">
                Before a match, check the tournament surface, then ask a few practical questions: who gets more free points on serve, who moves better on that court, who handles low or high bounce better and whether the conditions reward short points or longer construction.
              </p>
            </div>
          </section>

          <section className="mt-10 rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6">
            <h2 className="text-3xl font-black">Related guides</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <Link href="/tennis-calendar" className="rounded-2xl border border-zinc-800 bg-black/40 p-4 font-black hover:border-emerald-300">Tennis calendar</Link>
              <Link href="/tennis-tournaments" className="rounded-2xl border border-zinc-800 bg-black/40 p-4 font-black hover:border-emerald-300">Tournament levels</Link>
              <Link href="/analysis" className="rounded-2xl border border-zinc-800 bg-black/40 p-4 font-black hover:border-emerald-300">Tennis analysis</Link>
            </div>
          </section>
        </article>
      </div>

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "Tennis Guides", url: "https://watchtennistoday.com/tennis-guides" },
          { name: "Tennis Court Surfaces", url: "https://watchtennistoday.com/tennis-court-surfaces" },
        ]}
      />
    </main>
  );
}

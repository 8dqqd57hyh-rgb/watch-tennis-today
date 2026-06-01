import RolandGarrosPickemChallenge from "@/app/components/RolandGarrosPickemChallenge";
import FrenchOpenConversionCluster from "@/app/components/FrenchOpenConversionCluster";
import JsonLd from "@/app/components/JsonLd";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Roland Garros Predictions 2026 | French Open Pick’em Challenge",
  description:
    "Make French Open predictions, pick today’s Roland Garros winners, track your score and follow the matches live.",
};

export default function RolandGarrosPredictionsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Roland Garros Predictions 2026",
    description:
      "Interactive French Open Pick’em challenge for today’s Roland Garros matches.",
    url: "https://watchtennistoday.com/roland-garros-predictions",
    isPartOf: {
      "@type": "WebSite",
      name: "Watch Tennis Today",
      url: "https://watchtennistoday.com",
    },
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-7xl">
        <section className="mb-10 rounded-[2.5rem] border border-orange-500/50 bg-gradient-to-br from-orange-950/60 via-black to-zinc-950 p-8 md:p-10">
          <p className="mb-4 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-black">
            French Open predictions
          </p>
          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            Roland Garros Pick’em Challenge
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-zinc-300">
            Pick the winners from today’s Roland Garros matches, follow your score and come back after the results are final.
          </p>
        </section>

        <RolandGarrosPickemChallenge />

        <section className="mb-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="mb-3 text-2xl font-black">How scoring works</h2>
            <p className="leading-7 text-zinc-400">
              A correct favorite pick gets 1 point. A correct upset pick gets 3 points. Settled picks update when a winner appears in the live feed.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="mb-3 text-2xl font-black">Why people come back</h2>
            <p className="leading-7 text-zinc-400">
              Predictions create a simple daily loop: pick before matches, follow the score, return when results are complete.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="mb-3 text-2xl font-black">Data note</h2>
            <p className="leading-7 text-zinc-400">
              The board uses the same Roland Garros match feed as the daily French Open pages, so match availability depends on the live data source.
            </p>
          </div>
        </section>

        <FrenchOpenConversionCluster compact title="More Roland Garros pages" />
      </div>
    </main>
  );
}

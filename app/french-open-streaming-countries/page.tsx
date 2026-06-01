import FrenchOpenCountryGuides from "@/app/components/FrenchOpenCountryGuides";
import FrenchOpenConversionCluster from "@/app/components/FrenchOpenConversionCluster";
import JsonLd from "@/app/components/JsonLd";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "French Open Streaming by Country | Roland Garros Broadcasters",
  description:
    "Find how French Open streaming differs by country and how to check legal Roland Garros broadcasters in your region.",
  alternates: { canonical: "https://watchtennistoday.com/french-open-streaming-countries" },
};

export default function FrenchOpenStreamingCountriesPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "French Open Streaming Countries",
          description:
            "Country-by-country guide to Roland Garros streaming rights and official viewing options.",
          url: "https://watchtennistoday.com/french-open-streaming-countries",
        }}
      />

      <div className="mx-auto max-w-7xl">
        <section className="mb-10 rounded-[2.5rem] border border-orange-500/50 bg-gradient-to-br from-orange-950/50 to-black p-8">
          <p className="mb-4 text-sm font-black uppercase tracking-widest text-orange-400">
            Country-by-country viewing guide
          </p>
          <h1 className="mb-5 text-5xl font-black leading-tight md:text-7xl">
            French Open Streaming Countries
          </h1>

          <div className="max-w-4xl space-y-5 text-lg leading-8 text-zinc-300">
            <p>
              French Open streaming rights are regional. The same match may be available on
              free-to-air TV in one country, a cable sports channel in another and a paid
              streaming service somewhere else.
            </p>
            <p>
              Use this page as the country selector before checking today’s Roland Garros
              matches, tomorrow’s schedule or the full French Open TV guide.
            </p>
          </div>
        </section>

        <FrenchOpenCountryGuides />
        <FrenchOpenConversionCluster compact title="More Roland Garros viewing tools" />

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-3 text-2xl font-black">Why country matters</h2>
          <p className="max-w-4xl leading-8 text-zinc-400">
            Sports broadcasting contracts are sold by territory. Your legal French Open
            option depends on where you are watching from, your account region and the
            broadcaster that owns the rights for that market. Always verify availability
            with the official broadcaster before match day.
          </p>
        </section>
      </div>
    </main>
  );
}

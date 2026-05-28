export const metadata = {
  title: "French Open Streaming by Country | Roland Garros Broadcasters",
  description:
    "Find how French Open streaming differs by country and how to check legal Roland Garros broadcasters in your region.",
};

const countries = [
  ["United States", "/watch-tennis-in/usa"],
  ["United Kingdom", "/watch-tennis-in/uk"],
  ["Poland", "/watch-tennis-in/poland"],
  ["Germany", "/watch-tennis-in/germany"],
  ["France", "/watch-tennis-in/france"],
  ["Spain", "/watch-tennis-in/spain"],
  ["Italy", "/watch-tennis-in/italy"],
  ["Canada", "/watch-tennis-in/canada"],
  ["Australia", "/watch-tennis-in/australia"],
  ["India", "/watch-tennis-in/india"],
];

export default function FrenchOpenStreamingCountriesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-green-700">
        Country-by-country viewing guide
      </p>
      <h1 className="mb-5 text-4xl font-bold tracking-tight">
        French Open Streaming Countries: Where Roland Garros Coverage Differs
      </h1>

      <div className="space-y-5 text-lg leading-8 text-neutral-800">
        <p>
          French Open streaming rights are regional. The same match may be available on a
          free-to-air broadcaster in one country, a cable sports channel in another and a
          paid streaming service somewhere else. This page helps readers choose the right
          country guide before match day.
        </p>

        <p>
          Watch Tennis Today does not provide unauthorized streams. We focus on legal
          broadcaster discovery, tennis schedules and practical viewing notes for fans who
          want to follow Roland Garros responsibly.
        </p>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">Choose your country guide</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {countries.map(([country, href]) => (
              <a key={href} href={href} className="rounded-xl border p-4 font-medium hover:bg-neutral-50">
                Watch tennis in {country}
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-neutral-50 p-6">
          <h2 className="mb-3 text-2xl font-semibold">Why country matters</h2>
          <p>
            Sports broadcasting contracts are sold by territory. For that reason, your
            legal French Open option depends on where you are watching from, your account
            region and the broadcaster that owns the rights for that market.
          </p>
        </section>
      </div>
    </main>
  );
}

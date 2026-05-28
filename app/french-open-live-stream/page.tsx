export const metadata = {
  title: "French Open Live Stream Guide | Legal Roland Garros Viewing Options",
  description:
    "A practical guide to finding legal French Open live streams, official broadcasters, schedules and Roland Garros viewing options by region.",
};

const resources = [
  { href: "/french-open-live", label: "French Open live hub" },
  { href: "/where-to-watch-french-open", label: "Where to watch by country" },
  { href: "/french-open-order-of-play", label: "French Open order of play" },
  { href: "/french-open-results", label: "Latest French Open results" },
];

export default function FrenchOpenLiveStreamPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-green-700">
        Roland Garros streaming guide
      </p>
      <h1 className="mb-5 text-4xl font-bold tracking-tight">
        French Open Live Stream: How to Watch Roland Garros Legally
      </h1>

      <div className="space-y-5 text-lg leading-8 text-neutral-800">
        <p>
          This page helps tennis fans find legitimate French Open live stream options.
          Watch Tennis Today does not host matches, embed copyrighted broadcasts or provide
          unauthorized streams. Instead, we point readers toward official broadcasters,
          regional rights holders and schedule pages that can help them verify where a
          match is available.
        </p>

        <p>
          Roland Garros broadcast rights vary by country. A legal live stream may be
          available through a national sports broadcaster, a tournament partner, a paid TV
          package or an official streaming service. Availability can also change between
          qualifying rounds, main draw matches, night sessions and finals weekend.
        </p>

        <section className="rounded-2xl border bg-neutral-50 p-6">
          <h2 className="mb-3 text-2xl font-semibold">Before choosing a stream</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Check whether the broadcaster is licensed in your country.</li>
            <li>Confirm whether the match is on TV, streaming-only or both.</li>
            <li>Use the order of play to verify the court and expected start time.</li>
            <li>Avoid sites that advertise free copyrighted streams without permission.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">Useful French Open pages</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {resources.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl border p-4 font-medium hover:bg-neutral-50"
              >
                {item.label}
              </a>
            ))}
          </div>
        </section>

        <p className="text-base text-neutral-600">
          Tip: if you are travelling, the streaming service available at home may not be
          available in your temporary location. Always check the service terms and local
          broadcaster rules before relying on a subscription abroad.
        </p>
      </div>
    </main>
  );
}

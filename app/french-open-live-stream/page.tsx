import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import RelatedPages from "@/app/components/RelatedPages";
import Link from "next/link";

export const metadata = {
  title: "French Open Live Stream Guide | Legal Roland Garros Viewing Options",
  description:
    "A practical guide to finding legal French Open live streams, official broadcasters, schedules and Roland Garros viewing options by region.",
};

export const dynamic = "force-dynamic";
export default function FrenchOpenLiveStreamPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <nav className="mb-6 flex flex-wrap gap-2 text-sm text-neutral-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-green-700">Home</Link>
        <span>/</span>
        <Link href="/french-open" className="hover:text-green-700">French Open</Link>
        <span>/</span>
        <span className="font-semibold text-neutral-900">Live Stream Guide</span>
      </nav>

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

        <RelatedPages
          variant="light"
          currentPath="/french-open-live-stream"
          eyebrow="Roland Garros paths"
          title="Useful French Open pages"
          description="Use these stable pages to confirm the order of play, results, country rights and broader tennis schedule context."
          links={[
            { href: "/french-open", label: "French Open hub", eyebrow: "Roland Garros", description: "Live context and main tournament guide." },
            { href: "/where-to-watch-french-open", label: "Where to watch French Open", eyebrow: "Viewing", description: "Country-by-country broadcaster checks." },
            { href: "/french-open-order-of-play", label: "French Open order of play", eyebrow: "Schedule", description: "Daily match timing and court context." },
            { href: "/french-open-results", label: "French Open results", eyebrow: "Results", description: "Completed match and draw context." },
            { href: "/today", label: "Today's tennis schedule", eyebrow: "Daily hub", description: "All live, upcoming and completed tennis matches." },
            { href: "/live-tennis", label: "Live tennis matches", eyebrow: "Live hub", description: "Current ATP and WTA live match windows." },
          ]}
        />

        <p className="text-base text-neutral-600">
          Tip: if you are travelling, the streaming service available at home may not be
          available in your temporary location. Always check the service terms and local
          broadcaster rules before relying on a subscription abroad.
        </p>
      </div>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "French Open", url: "https://watchtennistoday.com/french-open" },
          { name: "French Open Live Stream Guide", url: "https://watchtennistoday.com/french-open-live-stream" },
        ]}
      />
    </main>
  );
}

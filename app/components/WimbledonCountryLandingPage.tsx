import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import { canonicalUrl } from "@/app/lib/technicalSeo";
import {
  getWimbledonCountryGuide,
  getWimbledonCountryLastVerified,
  type WimbledonCountrySlug,
} from "@/app/lib/wimbledonCountryGuides";

type WimbledonCountryLandingPageProps = {
  countrySlug: WimbledonCountrySlug;
};

const planningLinks = [
  { href: "/wimbledon-schedule", label: "Wimbledon schedule" },
  { href: "/wimbledon-order-of-play", label: "Order of play" },
  { href: "/wimbledon-tv-schedule", label: "TV schedule" },
  { href: "/where-to-watch-wimbledon", label: "Where to watch Wimbledon" },
];

export default function WimbledonCountryLandingPage({
  countrySlug,
}: WimbledonCountryLandingPageProps) {
  const guide = getWimbledonCountryGuide(countrySlug);
  const pageUrl = canonicalUrl(guide.canonicalPath);
  const lastVerified = getWimbledonCountryLastVerified();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
      { "@type": "ListItem", position: 2, name: "Wimbledon", item: canonicalUrl("/wimbledon") },
      { "@type": "ListItem", position: 3, name: `How to Watch Wimbledon in ${guide.country}`, item: pageUrl },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `How to Watch Wimbledon in ${guide.country}`,
    description: guide.description,
    url: pageUrl,
    dateModified: lastVerified,
    about: [
      { "@type": "SportsEvent", name: "Wimbledon" },
      { "@type": "Thing", name: `${guide.country} Wimbledon TV coverage` },
      { "@type": "Thing", name: "Legal tennis streaming" },
    ],
    isPartOf: {
      "@type": "WebSite",
      name: "Watch Tennis Today",
      url: canonicalUrl("/"),
    },
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 text-zinc-900">
      <JsonLd data={[breadcrumbSchema, webPageSchema, faqSchema]} />

      <nav className="mb-6 flex flex-wrap gap-2 text-sm text-zinc-500">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/wimbledon">Wimbledon</Link>
        <span>/</span>
        <span>{guide.country}</span>
      </nav>

      <section className="rounded-3xl bg-zinc-950 p-8 text-white md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">
          Wimbledon country guide
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black md:text-6xl">
          How to Watch Wimbledon in {guide.country}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
          {guide.intro}
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-zinc-950">
            Official TV and streaming options
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-700">
            {guide.primaryViewingNote}
          </p>
          <p className="mt-3 text-sm leading-7 text-zinc-700">
            {guide.broadcasterSummary}
          </p>
          <div className="mt-5 overflow-hidden rounded-2xl border">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-100 text-zinc-700">
                <tr>
                  <th className="p-3">What to check</th>
                  <th className="p-3">Stored guidance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t align-top">
                  <td className="p-3 font-bold">Broadcaster</td>
                  <td className="p-3 text-zinc-700">
                    {guide.broadcastEntry?.broadcasterName ?? guide.officialOptions[0]}
                  </td>
                </tr>
                <tr className="border-t align-top">
                  <td className="p-3 font-bold">Streaming route</td>
                  <td className="p-3 text-zinc-700">
                    {guide.broadcastEntry?.streamingServiceName ?? "Verify with official Wimbledon listings"}
                  </td>
                </tr>
                <tr className="border-t align-top">
                  <td className="p-3 font-bold">Coverage confidence</td>
                  <td className="p-3 text-zinc-700">
                    {guide.broadcastEntry?.confidenceLevel === "confirmed"
                      ? "Confirmed from reviewed source"
                      : guide.broadcastEntry?.confidenceLevel === "partial"
                        ? "Partially confirmed; verify match-week details"
                        : "Needs match-week verification"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
            Broadcaster data last reviewed: {lastVerified}
          </p>
        </article>

        <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-2xl font-black text-zinc-950">Time zone note</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-700">{guide.timezoneNote}</p>
          <h3 className="mt-6 font-black text-zinc-950">Before match time</h3>
          <p className="mt-2 text-sm leading-7 text-zinc-700">{guide.verificationNote}</p>
        </aside>
      </section>

      <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-zinc-950">Plan the session</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-700">
          Wimbledon times can move because earlier matches run long, weather changes the court plan or the tournament updates the daily order of play. Use these pages together instead of relying on a single fixed time.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {planningLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border bg-zinc-50 p-4 font-black text-zinc-950 hover:bg-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-zinc-950">
          Country-specific checks for {guide.country}
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {guide.officialOptions.slice(0, 3).map((option) => (
            <article key={option} className="rounded-2xl bg-zinc-50 p-4">
              <h3 className="font-black text-zinc-950">{option}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                Confirm Wimbledon live courts, replay access and subscription rules directly with this provider or the official tournament broadcaster list.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-zinc-950">FAQ</h2>
        <div className="mt-5 space-y-5">
          {guide.faq.map((item) => (
            <article key={item.question}>
              <h3 className="font-black text-zinc-950">{item.question}</h3>
              <p className="mt-1 text-sm leading-7 text-zinc-700">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

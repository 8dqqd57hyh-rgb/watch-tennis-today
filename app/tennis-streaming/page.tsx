import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import EmailCapture from "@/components/EmailCapture";

export const metadata: Metadata = {
  title: "Tennis Streaming Guide | Legal Ways to Watch Tennis Online",
  description:
    "A practical hub for legal tennis streaming: ATP, WTA, Grand Slam broadcasters, country viewing notes and safe checks before choosing a service.",
  alternates: {
    canonical: "https://watchtennistoday.com/tennis-streaming",
  },
};

const faqs = [
  {
    question: "Can I watch every tennis match on one service?",
    answer:
      "Usually no. Tennis rights are split by tour, tournament and country. ATP, WTA and Grand Slam coverage can be sold separately.",
  },
  {
    question: "Does Watch Tennis Today provide live streams?",
    answer:
      "No. This site does not host, embed or unlock streams. It points fans toward legal viewing checks and official broadcaster information.",
  },
  {
    question: "Are VPNs recommended for tennis streaming?",
    answer:
      "VPNs can be useful for privacy or for travelers using services they already have access to. They should not be used to bypass broadcaster terms or local rights restrictions.",
  },
  {
    question: "Why does coverage differ by country?",
    answer:
      "Sports media rights are licensed by territory. A match available on one platform in one country may be on a different broadcaster elsewhere.",
  },
];

const countryGuides = [
  ["United States", "/watch-tennis-in/usa"],
  ["United Kingdom", "/watch-tennis-in/uk"],
  ["Canada", "/watch-tennis-in/canada"],
  ["Australia", "/watch-tennis-in/australia"],
];

const relatedGuides = [
  ["How to watch tennis legally", "/how-to-watch-tennis-legally"],
  ["Best ways to watch tennis online", "/best-ways-to-watch-tennis-online"],
  ["Watch tennis without cable", "/how-to-watch-tennis-without-cable"],
  ["Watch tennis safely abroad", "/how-to-watch-tennis-safely-abroad"],
  ["Choose a tennis streaming service", "/how-to-choose-tennis-streaming-service"],
  ["Official tennis broadcasters guide", "/official-tennis-broadcasters-guide"],
];

export default function TennisStreamingPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Tennis Streaming Guide",
    url: "https://watchtennistoday.com/tennis-streaming",
    description: metadata.description,
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <JsonLd data={[webPageSchema, faqSchema]} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "Tennis Streaming", url: "https://watchtennistoday.com/tennis-streaming" },
        ]}
      />

      <div className="mx-auto max-w-6xl">
        <nav className="flex flex-wrap gap-2 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Tennis Streaming</span>
        </nav>

        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">Legal viewing hub</p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Tennis streaming guide: how to watch tennis legally online
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-9 text-zinc-300">
            Tennis streaming is confusing because one tournament can involve tour rights, Grand Slam rights, local TV deals, cable packages and country restrictions. This hub helps fans start with legal viewing options, official broadcaster checks and practical country guides instead of unsafe stream pages.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/today" className="rounded-2xl bg-green-500 px-5 py-3 font-black text-black hover:bg-green-400">Matches today</Link>
            <Link href="/live-tennis" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black hover:border-emerald-300">Live tennis</Link>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black">ATP Tour coverage</h2>
            <p className="mt-3 leading-8 text-zinc-300">
              ATP matches may be covered by official ATP streaming products and regional broadcasters. Availability depends on country, tournament category and existing TV agreements.
            </p>
            <Link href="/atp-live-today" className="mt-5 inline-block font-black text-emerald-300">ATP live today →</Link>
          </article>

          <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black">WTA Tour coverage</h2>
            <p className="mt-3 leading-8 text-zinc-300">
              WTA coverage is also territory-based. Check the tournament page and local broadcaster before assuming a match is included in a subscription.
            </p>
            <Link href="/wta-live-today" className="mt-5 inline-block font-black text-emerald-300">WTA live today →</Link>
          </article>

          <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black">Grand Slam coverage</h2>
            <p className="mt-3 leading-8 text-zinc-300">
              Australian Open, Roland Garros, Wimbledon and US Open rights are commonly separate from week-to-week tour coverage. Always check the Slam’s official broadcaster list.
            </p>
            <Link href="/grand-slam-tv-rights-explained" className="mt-5 inline-block font-black text-emerald-300">Grand Slam TV rights →</Link>
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Country-by-country starting points</h2>
          <p className="mt-3 max-w-3xl leading-8 text-zinc-300">
            Use these pages as starting points, then confirm the final match availability with the official broadcaster or tournament website in your location.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            {countryGuides.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-2xl border border-zinc-800 bg-black/30 p-4 font-black hover:border-emerald-300">
                {label} →
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">How to verify a legal tennis stream</h2>
            <ol className="mt-5 grid gap-3 text-sm leading-7 text-zinc-300">
              <li className="rounded-2xl border border-zinc-800 bg-black/30 p-4"><strong className="text-white">1.</strong> Check the tournament website or official tour page for broadcast notes.</li>
              <li className="rounded-2xl border border-zinc-800 bg-black/30 p-4"><strong className="text-white">2.</strong> Confirm your country, package and event rights on the broadcaster site.</li>
              <li className="rounded-2xl border border-zinc-800 bg-black/30 p-4"><strong className="text-white">3.</strong> Avoid pages that promise every match for free without naming an official rightsholder.</li>
              <li className="rounded-2xl border border-zinc-800 bg-black/30 p-4"><strong className="text-white">4.</strong> Re-check close to match time because court assignments and broadcast windows can change.</li>
            </ol>
          </article>

          <article className="rounded-3xl border border-amber-900 bg-amber-950/20 p-6">
            <h2 className="text-3xl font-black">VPN note for travelers</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              VPNs can help travelers protect their connection or access accounts they normally use where permitted by the service terms. Watch Tennis Today does not recommend using VPNs to bypass rights restrictions, subscription rules or local law.
            </p>
            <Link href="/how-to-watch-tennis-safely-abroad" className="mt-5 inline-block font-black text-amber-300">Safe abroad guide →</Link>
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Related streaming guides</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {relatedGuides.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-2xl border border-zinc-800 bg-black/30 p-4 font-black hover:border-emerald-300">
                {label} →
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-8">
          <EmailCapture
            title="Get legal tennis viewing updates"
            description="Get low-noise updates when major tennis schedules, country guides or official viewing notes are published. No unofficial stream links."
            placeholder="Email for tennis viewing updates"
            buttonText="Get updates"
            contextType="streaming"
            contextValue="tennis-streaming-hub"
            dark
          />
        </div>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">FAQ</h2>
          <div className="mt-5 grid gap-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-2xl border border-zinc-800 bg-black/30 p-5">
                <h3 className="font-black">{faq.question}</h3>
                <p className="mt-2 leading-7 text-zinc-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

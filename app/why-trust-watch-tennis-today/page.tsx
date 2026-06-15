import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import JsonLd from "@/app/components/JsonLd";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import { authorProfile, buildAuthorPersonSchema } from "@/data/authorProfile";

export const metadata: Metadata = {
  title: "Why Trust Watch Tennis Today | Editorial Standards & Data Sources",
  description:
    "How Watch Tennis Today sources match data, checks legal streaming information, handles corrections and keeps tennis pages useful without unsafe stream claims.",
  alternates: {
    canonical: "https://watchtennistoday.com/why-trust-watch-tennis-today",
  },
};

const faqs = [
  {
    question: "Does Watch Tennis Today stream tennis matches?",
    answer:
      "No. Watch Tennis Today is an informational tennis guide. It does not host, embed or bypass live tennis broadcasts.",
  },
  {
    question: "Where does the match information come from?",
    answer:
      "The site combines available tennis schedule data, editorial checks and links to official tennis, tournament and broadcaster sources where relevant.",
  },
  {
    question: "Why can live tennis information change?",
    answer:
      "Tennis schedules can move because of long matches, weather, withdrawals, court changes and broadcaster decisions. Live data feeds can also lag or omit context.",
  },
  {
    question: "How are streaming recommendations checked?",
    answer:
      "Streaming pages focus on official broadcasters, tournament partners and legal viewing routes. Users should always confirm availability with the broadcaster in their country.",
  },
];

export default function WhyTrustPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Why Trust Watch Tennis Today",
    url: "https://watchtennistoday.com/why-trust-watch-tennis-today",
    description: metadata.description,
    author: { "@id": `${authorProfile.url}#person` },
  };

  const personSchema = {
    "@context": "https://schema.org",
    ...buildAuthorPersonSchema(),
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <JsonLd data={[webPageSchema, faqSchema, personSchema]} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "Why Trust Watch Tennis Today", url: "https://watchtennistoday.com/why-trust-watch-tennis-today" },
        ]}
      />

      <div className="mx-auto max-w-6xl">
        <nav className="flex flex-wrap gap-2 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Why Trust Watch Tennis Today</span>
        </nav>

        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">Trust and transparency</p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Why trust Watch Tennis Today?
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-9 text-zinc-300">
            Watch Tennis Today is built to help tennis fans answer practical questions: who plays today, where a match may be covered legally, what tournament context matters and which official sources should be checked before watching. The site is not a streaming platform and does not try to replace official broadcasters, tournament websites or tour pages.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="flex flex-col gap-5 sm:flex-row">
              <Image
                src={authorProfile.imagePath}
                alt={`${authorProfile.name}, founder of Watch Tennis Today`}
                width={120}
                height={120}
                sizes="120px"
                className="h-28 w-28 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-black">Who runs the site</h2>
                <p className="mt-3 leading-8 text-zinc-300">
                  Watch Tennis Today is run by {authorProfile.name}, the founder
                  of the site and a tennis enthusiast who follows ATP and WTA
                  schedules, tournament coverage and legal viewing availability.
                  The site focuses on editorial guidance, schedule organization,
                  legal viewing education and clear warnings around unofficial
                  streaming claims.
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm font-black">
                  <Link href="/about" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-emerald-300">About</Link>
                  <Link href="/authors/watch-tennis-today" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-emerald-300">Author page</Link>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black">How tennis data is sourced</h2>
            <p className="mt-3 leading-8 text-zinc-300">
              Match pages combine available tennis feed data with editorial context. Tennis feeds can include live scores, schedules, tournament names, player names, start windows and match status. When a feed is incomplete, pages should avoid making stronger claims than the data supports.
            </p>
            <Link href="/how-we-source-data" className="mt-5 inline-block rounded-full border border-zinc-700 px-4 py-2 text-sm font-black hover:border-emerald-300">How we source data</Link>
          </article>

          <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black">Live data limitations</h2>
            <p className="mt-3 leading-8 text-zinc-300">
              Tennis is difficult to track in real time. Matches may start late, move courts, pause for rain, end by retirement or disappear from a feed before the tournament site updates. For that reason, Watch Tennis Today treats live data as useful guidance, not as a guarantee.
            </p>
          </article>

          <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black">How streaming information is checked</h2>
            <p className="mt-3 leading-8 text-zinc-300">
              Streaming pages prioritize official broadcasters, tournament TV partners and legal streaming services. Availability can vary by country, event, round and subscription package, so users should confirm the final viewing option directly with the official broadcaster.
            </p>
            <Link href="/how-we-verify-streams" className="mt-5 inline-block rounded-full border border-zinc-700 px-4 py-2 text-sm font-black hover:border-emerald-300">How we verify streams</Link>
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6">
          <h2 className="text-3xl font-black">What the site does not do</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              "No illegal stream embeds",
              "No claims that coverage is free unless verified",
              "No fake affiliate links or invented broadcaster deals",
              "No guaranteed live start times when data is uncertain",
              "No fake experts, reviews or credentials",
              "No thin pages created only to catch keywords",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-emerald-800 bg-black/30 p-4 text-sm font-bold text-zinc-100">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Corrections and editorial standards</h2>
          <p className="mt-4 leading-8 text-zinc-300">
            When a page appears outdated, unclear or too broad, the preferred fix is to improve the page, add source context, reduce unsupported claims or remove the page from indexable navigation. Corrections can be sent through the contact page. The editorial goal is simple: useful tennis context, legal viewing guidance and honest limitations.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-black">
            <Link href="/editorial-policy" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-emerald-300">Editorial policy</Link>
            <Link href="/content-guidelines" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-emerald-300">Content guidelines</Link>
            <Link href="/privacy" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-emerald-300">Privacy policy</Link>
            <Link href="/contact" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-emerald-300">Contact</Link>
          </div>
        </section>

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

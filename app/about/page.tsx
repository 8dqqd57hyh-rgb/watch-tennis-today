import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  authorProfile,
  buildAuthorPersonSchema,
  buildOrganizationSchema,
  siteUrl,
} from "@/data/authorProfile";

export const metadata: Metadata = {
  title: "About Watch Tennis Today | Founder, Mission & Editorial Standards",
  description:
    "Learn who runs Watch Tennis Today, why the site exists, how tennis data is researched and how legal streaming guidance is reviewed.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};

export const dynamic = "force-dynamic";

const principles = [
  "We do not host, embed or distribute live tennis streams.",
  "We focus on legal broadcasters, licensed streaming services and official tournament information.",
  "We separate editorial guidance from live-data feeds and explain when data may be incomplete.",
  "We keep legal pages, contact information, author information and editorial policies visible from the footer.",
];

const sources = [
  "Official ATP, WTA and Grand Slam tournament information",
  "Official broadcaster and streaming provider pages",
  "Tournament order-of-play pages and public calendar information",
  "Structured tennis data feeds used for schedules, match status and live-score context",
  "Reader corrections submitted through the contact page",
];

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${siteUrl}/about#about-page`,
        name: "About Watch Tennis Today",
        url: `${siteUrl}/about`,
        description: metadata.description,
        publisher: { "@id": `${siteUrl}/#organization` },
        mainEntity: { "@id": `${siteUrl}/#organization` },
      },
      buildOrganizationSchema(),
      buildAuthorPersonSchema(),
    ],
  };

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-zinc-400 hover:text-white">
          Back
        </Link>

        <header className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
            About the site
          </p>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">
            Watch Tennis Today helps fans find legal tennis viewing information.
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-9 text-zinc-300">
            Watch Tennis Today is an independent tennis information website built
            by {authorProfile.name} to help fans follow daily professional tennis
            without jumping between dozens of scoreboards, tournament pages and
            broadcaster schedules.
          </p>
        </header>

        <section className="mt-8 grid gap-6 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:grid-cols-[220px_1fr] md:p-8">
          <Image
            src={authorProfile.imagePath}
            alt={`${authorProfile.name}, founder of Watch Tennis Today`}
            width={440}
            height={560}
            sizes="(min-width: 768px) 220px, 100vw"
            className="aspect-[4/5] w-full rounded-3xl object-cover md:w-[220px]"
          />
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
              Founder
            </p>
            <h2 className="mt-2 text-3xl font-black">{authorProfile.name}</h2>
            <p className="mt-4 leading-8 text-zinc-300">
              {authorProfile.bio}
            </p>
            <p className="mt-4 leading-8 text-zinc-400">
              {authorProfile.researchNote}
            </p>
            <Link
              href="/authors/watch-tennis-today"
              className="mt-5 inline-flex rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black hover:bg-emerald-300"
            >
              Read the author profile
            </Link>
          </div>
        </section>

        <div className="mt-8 space-y-8 text-zinc-300">
          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black text-white">The story behind the website</h2>
            <p className="mt-4 leading-8">
              Tennis is unusually hard to follow. A match can move because an
              earlier match lasted three hours, rain can change the order of
              play, and broadcast rights can differ by country, court and round.
              Watch Tennis Today was created to organize that messy fan reality:
              what is on, what context matters, and where legal viewing options
              should be checked.
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black text-white">Mission statement</h2>
            <p className="mt-4 leading-8">
              The mission is to help tennis fans understand schedules, match
              status, tournament context and legal broadcaster options before
              they leave for an official tournament page, broadcaster or paid
              streaming service. The site should be useful without pretending to
              be a broadcaster or promising access it cannot verify.
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black text-white">Editorial standards</h2>
            <p className="mt-4 leading-8">
              Pages are written around practical tennis viewing questions: who
              plays today, what tournament context matters, whether a match is
              ATP, WTA or Grand Slam, and which official sources should be
              checked. We avoid fake author credentials, fake first-hand reviews,
              unsupported stream claims and pages that exist only to catch
              search keywords.
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black text-white">Data sources used on the site</h2>
            <ul className="mt-5 space-y-3">
              {sources.map((source) => (
                <li key={source} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 flex-none rounded-full bg-emerald-400" />
                  <span>{source}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black text-white">Commitment to accuracy</h2>
            <p className="mt-4 leading-8">
              Tennis information changes quickly. Start times, court assignments,
              withdrawals and broadcast availability can update after publication.
              We review important pages regularly, write time-sensitive claims
              cautiously and ask readers to confirm final details with official
              tournaments, broadcasters or streaming providers.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-black">
              <Link href="/editorial-policy" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-emerald-300">
                Editorial policy
              </Link>
              <Link href="/how-we-source-data" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-emerald-300">
                How we source data
              </Link>
              <Link href="/contact" className="rounded-full border border-zinc-700 px-4 py-2 hover:border-emerald-300">
                Send a correction
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6">
            <h2 className="text-2xl font-black text-white">Trust and legal viewing principles</h2>
            <ul className="mt-5 space-y-3">
              {principles.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-green-400 font-black">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}

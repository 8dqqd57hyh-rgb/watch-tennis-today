export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { affiliateLinks } from "@/app/lib/affiliateLinks";
import EmailSignup from "@/app/components/EmailSignup";
import ContentQualityNotice from "@/app/components/ContentQualityNotice";
import { broadcastCountries, getBroadcastCountry, shouldIndexBroadcastCountry } from "@/data/broadcastFinder";

const BASE_URL = "https://watchtennistoday.com";

export function generateStaticParams() {
  return broadcastCountries.map((country) => ({ country: country.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const broadcastCountry = getBroadcastCountry(country);

  if (!broadcastCountry) {
    return {
      title: "Tennis TV Channels by Country | Watch Tennis Today",
      robots: { index: false, follow: true },
    };
  }

  const indexable = shouldIndexBroadcastCountry(broadcastCountry.slug);

  return {
    title: `Where to Watch Tennis in ${broadcastCountry.country} | TV Channels, ATP, WTA & Grand Slams`,
    description: `Find official tennis broadcasters, TV channels and legal streaming routes for ATP, WTA and Grand Slam matches in ${broadcastCountry.country}.`,
    // AdSense quality: country pages are only indexable after manual review for
    // unique local broadcaster context. New countries default to noindex.
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    alternates: {
      canonical: `${BASE_URL}/watch-tennis-in/${broadcastCountry.slug}`,
    },
    openGraph: {
      title: `Where to Watch Tennis in ${broadcastCountry.country}`,
      description: `Official broadcaster routes, ATP/WTA options and Grand Slam TV guidance for tennis fans in ${broadcastCountry.country}.`,
      url: `${BASE_URL}/watch-tennis-in/${broadcastCountry.slug}`,
      type: "article",
    },
  };
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-black p-5">
      <h3 className="mb-4 text-xl font-black text-white">{title}</h3>
      <ul className="space-y-3 text-zinc-300">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-1 h-2 w-2 flex-none rounded-full bg-emerald-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const broadcastCountry = getBroadcastCountry(country);

  if (!broadcastCountry) notFound();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Where can I watch tennis in ${broadcastCountry.country}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Tennis in ${broadcastCountry.country} is usually available through official sports broadcasters, tour streaming services and tournament broadcaster partners. Availability depends on the tournament and local rights.`,
        },
      },
      {
        "@type": "Question",
        name: `What channels show ATP tennis in ${broadcastCountry.country}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `ATP coverage in ${broadcastCountry.country} may include ${broadcastCountry.atpOptions.join(", ")}. Check the official ATP TV schedule before the match starts.`,
        },
      },
      {
        "@type": "Question",
        name: `Can I watch tennis while traveling outside ${broadcastCountry.country}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: "If you are traveling, check whether your normal broadcaster supports access abroad and follow the broadcaster terms. Watch Tennis Today points users toward legal viewing routes and does not host streams.",
        },
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Where to Watch Tennis in ${broadcastCountry.country}`,
    description: `Official tennis broadcaster guide for ATP, WTA and Grand Slam coverage in ${broadcastCountry.country}.`,
    mainEntityOfPage: `${BASE_URL}/watch-tennis-in/${broadcastCountry.slug}`,
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "Watch Tennis Today",
    },
    publisher: {
      "@type": "Organization",
      name: "Watch Tennis Today",
    },
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-6xl">
        <a href="/tennis-tv-broadcast-finder" className="text-zinc-400 hover:text-white">
          ← Back to Broadcast Finder
        </a>

        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-emerald-950 p-8 md:p-10">
          <p className="mb-4 inline-flex rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
            Country streaming guide
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Where to watch tennis in {broadcastCountry.country}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            Use this guide to check the most likely official TV channels, legal streaming routes and travel-viewing steps for ATP, WTA and Grand Slam tennis in {broadcastCountry.country}.
          </p>
          <p className="mt-4 text-sm text-zinc-500">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <InfoCard title="Primary broadcaster routes" items={broadcastCountry.primaryBroadcasters} />
          <InfoCard title="Grand Slam coverage checks" items={broadcastCountry.grandSlamBroadcasters} />
          <InfoCard title="ATP viewing options" items={broadcastCountry.atpOptions} />
          <InfoCard title="WTA viewing options" items={broadcastCountry.wtaOptions} />
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Official directories to verify before match time</h2>
          <p className="mt-3 max-w-3xl leading-7 text-zinc-400">
            Tennis rights can change by tournament, court and round. Before paying for a package, check these official broadcaster directories and tournament pages.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {broadcastCountry.officialDirectories.map((source) => (
              <a
                key={source.label}
                href={source.url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="rounded-2xl border border-zinc-800 bg-black p-5 font-black text-white transition hover:border-emerald-400 hover:text-emerald-300"
              >
                {source.label} →
              </a>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">Quick match-day checklist</h2>
            <ol className="mt-5 space-y-4 text-zinc-300">
              <li><strong className="text-white">1.</strong> Open the live schedule and identify the tournament.</li>
              <li><strong className="text-white">2.</strong> Check whether it is ATP, WTA, Challenger or Grand Slam coverage.</li>
              <li><strong className="text-white">3.</strong> Confirm the broadcaster in {broadcastCountry.country} using an official directory.</li>
              <li><strong className="text-white">4.</strong> If traveling, confirm whether your normal subscription works abroad.</li>
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/live-tennis" className="rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black">Live tennis today</a>
              <a href="/best-tennis-matches-today" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-emerald-400">Best matches today</a>
              <a href="/tennis-tv-broadcast-finder" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-emerald-400">Broadcast finder</a>
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/30 p-6">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">Travel viewing</p>
            <h2 className="mt-3 text-3xl font-black">Watching outside {broadcastCountry.country}?</h2>
            <p className="mt-4 leading-7 text-zinc-300">{broadcastCountry.travelTip}</p>
            <p className="mt-4 leading-7 text-zinc-400">
              Use privacy tools only within broadcaster terms and local law. This site does not bypass paywalls or host streams.
            </p>
            <div className="mt-6 grid gap-3">
              <a href="/watch-tennis-abroad" className="rounded-2xl bg-white px-5 py-3 text-center font-black text-black">Watch tennis abroad guide</a>
              <a href="/best-vpn-for-tennis-streaming" className="rounded-2xl border border-emerald-400/40 px-5 py-3 text-center font-black text-white hover:border-emerald-300">Best VPN for tennis</a>
              <a href={affiliateLinks.nordvpn} target="_blank" rel="nofollow sponsored noopener noreferrer" className="rounded-2xl border border-zinc-700 px-5 py-3 text-center font-black text-white hover:border-emerald-300">View VPN deal</a>
            </div>
            <p className="mt-4 text-xs text-zinc-500">Affiliate disclosure: we may earn a commission from qualifying purchases.</p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Notes for {broadcastCountry.country}</h2>
          <p className="mt-4 leading-8 text-zinc-300">{broadcastCountry.notes}</p>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">FAQ</h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-xl font-black">Where can I watch tennis in {broadcastCountry.country}?</h3>
              <p className="mt-2 text-zinc-400">Start with official tournament pages, ATP/WTA directories and the broadcaster options listed above. Coverage depends on local rights.</p>
            </div>
            <div>
              <h3 className="text-xl font-black">Are all matches available on one service?</h3>
              <p className="mt-2 text-zinc-400">Usually no. ATP, WTA, Grand Slam and Challenger events may be split across different services.</p>
            </div>
            <div>
              <h3 className="text-xl font-black">Does Watch Tennis Today stream matches?</h3>
              <p className="mt-2 text-zinc-400">No. Watch Tennis Today is an informational guide that points users to official and legal viewing routes.</p>
            </div>
          </div>
        </section>

        <ContentQualityNotice pageType={`country broadcaster guide for ${broadcastCountry.country}`} />
        <EmailSignup />
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </main>
  );
}

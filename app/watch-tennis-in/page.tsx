import type { Metadata } from "next";
import EmailSignup from "@/app/components/EmailSignup";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";
import { broadcastCountries } from "@/data/broadcastFinder";

const BASE_URL = "https://watchtennistoday.com";

export const metadata: Metadata = {
  title: "Where to Watch Tennis by Country | ATP, WTA & Grand Slam TV Guide",
  description:
    "Choose your country to find legal tennis TV channels, official broadcaster directories and streaming options for ATP, WTA and Grand Slam matches.",
  alternates: {
    canonical: `${BASE_URL}/watch-tennis-in`,
  },
  openGraph: {
    title: "Where to Watch Tennis by Country",
    description:
      "Country-by-country tennis broadcaster guides for ATP, WTA and Grand Slam coverage.",
    url: `${BASE_URL}/watch-tennis-in`,
    siteName: "Watch Tennis Today",
    type: "website",
  },
};

const quickRoutes = [
  {
    title: "Today’s matches",
    description: "Check the current live and upcoming schedule before choosing a broadcaster.",
    href: "/today",
  },
  {
    title: "Tomorrow’s schedule",
    description: "Plan ahead for tomorrow’s ATP, WTA and Grand Slam matches.",
    href: "/tomorrow",
  },
  {
    title: "Compare streaming services",
    description: "Avoid paying for the wrong platform by comparing common tennis options.",
    href: "/compare",
  },
];

export default function WatchTennisInHubPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Where to Watch Tennis by Country",
    description:
      "A country-by-country directory of legal tennis broadcaster and streaming guides.",
    url: `${BASE_URL}/watch-tennis-in`,
    hasPart: broadcastCountries.map((country) => ({
      "@type": "WebPage",
      name: `Where to Watch Tennis in ${country.country}`,
      url: `${BASE_URL}/watch-tennis-in/${country.slug}`,
    })),
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <section className="mx-auto mb-10 max-w-6xl rounded-[2.5rem] border border-emerald-500/30 bg-gradient-to-br from-emerald-950/70 via-zinc-950 to-black p-8 md:p-12">
        <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
          Country broadcaster directory
        </p>
        <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
          Where to watch tennis in your country
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
          Tennis rights are split by country, tournament and platform. Start with your location, then check the official broadcaster route for ATP, WTA and Grand Slam matches before subscribing.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/tennis-tv-broadcast-finder"
            className="rounded-2xl bg-emerald-400 px-6 py-4 font-black text-black hover:bg-emerald-300"
          >
            Open broadcast finder →
          </a>
          <a
            href="/tennis-streaming-services"
            className="rounded-2xl border border-zinc-700 px-6 py-4 font-black text-white hover:border-emerald-300"
          >
            Compare services
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-6xl">
        <section className="mb-10 rounded-3xl border border-amber-300/30 bg-amber-950/20 p-6">
          <h2 className="mb-3 text-2xl font-black">Important before match time</h2>
          <p className="max-w-4xl leading-7 text-zinc-300">
            Watch Tennis Today does not host streams. These guides point users toward official broadcasters, tournament directories and legal streaming options. Availability can change by event, so always confirm on the provider&apos;s schedule.
          </p>
        </section>

        <section className="mb-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {broadcastCountries.map((country) => (
            <a
              key={country.slug}
              href={`/watch-tennis-in/${country.slug}`}
              className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 transition hover:border-emerald-400 hover:bg-zinc-900"
            >
              <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
                {country.country}
              </p>
              <h2 className="mb-4 text-2xl font-black">
                Watch tennis in {country.country}
              </h2>
              <p className="mb-5 leading-7 text-zinc-400">
                Main routes: {country.primaryBroadcasters.slice(0, 3).join(", ")}.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-bold text-zinc-300">
                {country.grandSlamBroadcasters.slice(0, 3).map((item) => (
                  <span key={item} className="rounded-full border border-zinc-700 px-3 py-1">
                    {item}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </section>

        <section className="mb-12 grid gap-5 md:grid-cols-3">
          {quickRoutes.map((route) => (
            <a
              key={route.href}
              href={route.href}
              className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-600"
            >
              <h2 className="mb-2 text-2xl font-black">{route.title}</h2>
              <p className="leading-7 text-zinc-400">{route.description}</p>
            </a>
          ))}
        </section>

        <RevenueConversionPanel context="article" />

        <section className="mb-12">
          <EmailSignup
            title="Get calm tennis schedule updates"
            description="Optional tennis alerts for notable matches and schedule changes. No popups, no auto-subscribe and no spam."
            source="country-hub"
            context="country broadcaster hub"
            buttonLabel="Send me tennis updates"
          />
        </section>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";

export const metadata: Metadata = {
  title: "Tennis Live Alerts | Daily Match Schedule & TV Updates",
  description:
    "Get tennis live alerts for daily match schedules, Grand Slam TV coverage, broadcaster changes and where to watch ATP and WTA tennis legally.",
  alternates: {
    canonical: "https://watchtennistoday.com/tennis-live-alerts",
  },
  openGraph: {
    title: "Tennis Live Alerts | Watch Tennis Today",
    description:
      "Subscribe for tennis schedule updates, TV channel reminders and legal streaming guides for ATP, WTA and Grand Slam matches.",
    url: "https://watchtennistoday.com/tennis-live-alerts",
    siteName: "Watch Tennis Today",
    type: "website",
  },
};

const alertTypes = [
  {
    title: "Daily tennis schedule",
    description:
      "Get a simple summary of notable ATP, WTA and Grand Slam matches to check before play starts.",
  },
  {
    title: "TV and broadcaster reminders",
    description:
      "Know where to verify official coverage before big matches, especially when rights differ by country.",
  },
  {
    title: "Grand Slam viewing notes",
    description:
      "Follow schedule changes, order of play updates and tournament-specific viewing guides during major events.",
  },
  {
    title: "Travel viewing checklist",
    description:
      "Get reminders to check your normal subscription, local broadcaster and safe viewing options before watching abroad.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are tennis live alerts?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Tennis live alerts are email updates that help fans check daily match schedules, TV information and official broadcaster guides before tennis matches begin.",
      },
    },
    {
      "@type": "Question",
      name: "Do these alerts include illegal streams?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "No. Watch Tennis Today focuses on legal tennis viewing information, official broadcaster resources and safe streaming guidance.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use alerts while traveling?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. Alerts can help you remember to check broadcaster rights in your location and compare legal options before relying on a streaming service while abroad.",
      },
    },
  ],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Tennis Live Alerts",
  description:
    "A guide to tennis schedule alerts, TV reminders and legal streaming updates for tennis fans.",
  author: {
    "@type": "Organization",
    name: "Watch Tennis Today",
  },
  publisher: {
    "@type": "Organization",
    name: "Watch Tennis Today",
  },
  mainEntityOfPage: "https://watchtennistoday.com/tennis-live-alerts",
};

export default function TennisLiveAlertsPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-zinc-400 hover:text-white">
          ← Back to live tennis
        </Link>

        <section className="mt-8 rounded-[2.5rem] border border-emerald-500/50 bg-gradient-to-br from-emerald-950/70 via-zinc-950 to-black p-8 md:p-10">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-black text-black">
              🔔 Tennis alerts
            </span>
            <span className="text-sm font-semibold text-emerald-200">
              Daily schedule, TV and Grand Slam updates
            </span>
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">
            Get tennis match alerts before the best matches start
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Subscribe for practical tennis viewing updates: daily match schedule
            notes, TV channel checks, Grand Slam reminders and legal streaming
            guides for ATP and WTA fans.
          </p>

          <form
            action="https://formspree.io/f/xeenwwbk"
            method="POST"
            className="mt-8 grid gap-3 rounded-3xl border border-emerald-400/30 bg-black/40 p-4 md:grid-cols-[1fr_auto]"
          >
            <input
              type="hidden"
              name="_redirect"
              value="https://watchtennistoday.com/newsletter-confirmation"
            />
            <input
              type="hidden"
              name="source"
              value="tennis-live-alerts"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Your email"
              className="rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              className="rounded-2xl bg-emerald-400 px-7 py-4 font-black text-black hover:bg-emerald-300"
            >
              Send me alerts
            </button>
          </form>

          <p className="mt-3 text-sm text-zinc-500">
            No illegal streams, no spam. You get tennis schedule and viewing
            guidance only.
          </p>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          {alertTypes.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <h2 className="mb-3 text-2xl font-black">{item.title}</h2>
              <p className="leading-7 text-zinc-300">{item.description}</p>
            </div>
          ))}
        </section>

        <RevenueConversionPanel context="article" />

        <section className="mt-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-7">
          <h2 className="mb-4 text-3xl font-black">
            Why alerts help tennis fans
          </h2>
          <div className="space-y-4 leading-8 text-zinc-300">
            <p>
              Tennis schedules change quickly because of rain delays, court
              assignments, withdrawals and long matches. A daily reminder helps
              you check the important matches without opening every tournament
              site separately.
            </p>
            <p>
              The alerts are especially useful during Grand Slams, when TV
              coverage may move between channels and official streaming options
              depend heavily on your country.
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <Link
            href="/best-tennis-matches-today"
            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 font-black hover:border-emerald-400"
          >
            Best matches today →
          </Link>
          <Link
            href="/tennis-tv-broadcast-finder"
            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 font-black hover:border-emerald-400"
          >
            Broadcast finder →
          </Link>
          <Link
            href="/watch-tennis-abroad"
            className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 font-black hover:border-emerald-400"
          >
            Watch tennis abroad →
          </Link>
        </section>
      </div>
    </main>
  );
}

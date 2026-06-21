import type { Metadata } from "next";
import Link from "next/link";
import AuthorBox from "@/app/components/AuthorBox";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import JsonLd from "@/app/components/JsonLd";
import TennisNavigationHub from "@/app/components/TennisNavigationHub";
import StreamingCostCalculatorClient from "./StreamingCostCalculatorClient";

export const metadata: Metadata = {
  title: "Tennis Streaming Cost Calculator | Compare Legal Viewing Options",
  description:
    "Estimate the monthly and seasonal cost of legal tennis streaming subscriptions before choosing a service for ATP, WTA and Grand Slam matches.",
  alternates: {
    canonical: "https://watchtennistoday.com/tennis-streaming-cost-calculator",
  },
  openGraph: {
    title: "Tennis Streaming Cost Calculator",
    description:
      "Plan your legal tennis streaming setup, compare subscription overlap and avoid paying for services you do not need.",
    url: "https://watchtennistoday.com/tennis-streaming-cost-calculator",
    siteName: "Watch Tennis Today",
    type: "article",
  },
};

const checks = [
  {
    title: "Check the exact tournament first",
    body: "ATP, WTA and Grand Slam rights are not always bundled together. A service that works for a tour event may not carry Wimbledon, Roland Garros or the US Open in your country.",
  },
  {
    title: "Avoid duplicate subscriptions",
    body: "Some sports bundles include the same channel or tournament access you already get through a TV provider. Compare your existing package before adding another monthly plan.",
  },
  {
    title: "Subscribe around tennis peaks",
    body: "If you mainly watch a few players or Grand Slams, a seasonal setup can be cheaper than keeping every service active all year.",
  },
  {
    title: "Use legal sources only",
    body: "This planner is for official broadcasters, recognized streaming platforms and your own paid services. It does not help find illegal streams or bypass rights restrictions.",
  },
];

const faq = [
  {
    question: "What is a normal monthly cost for watching tennis online?",
    answer:
      "It depends on your country, tournaments and existing TV package. Many fans need one main tennis service plus separate Grand Slam checks, while others can rely on a sports bundle they already pay for.",
  },
  {
    question: "Can one service show every tennis match?",
    answer:
      "Usually no. ATP, WTA, Grand Slam and regional TV rights can be split by country and tournament, so you should verify the exact event before subscribing.",
  },
  {
    question: "Should I pay for a VPN to watch tennis?",
    answer:
      "Start with the official broadcaster in your country. A VPN may be useful for privacy on public Wi-Fi or for accessing your own legal account while traveling, but you should check the service terms first.",
  },
  {
    question: "How can I reduce my tennis streaming cost?",
    answer:
      "Cancel duplicate services, subscribe only during tournaments you actually watch, use your existing sports package when it covers the event, and check official schedules before match day.",
  },
];

export default function TennisStreamingCostCalculatorPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Tennis Streaming Cost Calculator",
        url: "https://watchtennistoday.com/tennis-streaming-cost-calculator",
        description: metadata.description,
      },
      {
        "@type": "SoftwareApplication",
        name: "Tennis Streaming Cost Calculator",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-950">
      <JsonLd data={schema} />
      <section className="bg-black px-6 py-12 text-white md:py-16">
        <div className="mx-auto max-w-6xl">
          <nav className="flex flex-wrap gap-2 text-sm text-zinc-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/tennis-streaming-services" className="hover:text-white">Streaming services</Link>
            <span>/</span>
            <span className="text-white">Cost calculator</span>
          </nav>
          <p className="mt-8 text-sm font-black uppercase tracking-[0.24em] text-emerald-300">Streaming budget planner</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Tennis streaming cost calculator
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            Before paying for another app, estimate what your legal tennis setup really costs. This page helps you compare subscriptions, Grand Slam add-ons and travel privacy tools without pretending that one service covers every match everywhere.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/tennis-tv-broadcast-finder" className="rounded-full bg-emerald-300 px-6 py-3 font-black text-black hover:bg-emerald-200">
              Find legal broadcasters
            </Link>
            <Link href="/tennis-streaming-checklist" className="rounded-full border border-white/20 px-6 py-3 font-black text-white hover:bg-white/10">
              Streaming checklist
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <StreamingCostCalculatorClient />

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          {checks.map((check) => (
            <article key={check.title} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">{check.title}</h2>
              <p className="mt-3 leading-8 text-neutral-700">{check.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-black">How to use this calculator properly</h2>
          <div className="mt-5 space-y-4 leading-8 text-neutral-700">
            <p>
              Treat the estimate as a planning tool, not a promise about availability. Tennis broadcasting is fragmented: a country may have one provider for weekly tour events, another provider for Grand Slams, and a separate app for highlights or replay access.
            </p>
            <p>
              The strongest money-saving move is to start from the matches you actually watch. If you mostly follow one player, check that player&apos;s upcoming tournaments and subscribe around those windows. If you watch every major event, compare a longer sports bundle against short-term monthly plans.
            </p>
            <p>
              For AdSense and reader trust, this site stays on the safe side: it points readers toward official broadcasters, practical checks and legal subscription decisions instead of risky stream pages.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-3xl font-black">FAQ</h2>
          <div className="mt-5 space-y-5">
            {faq.map((item) => (
              <div key={item.question}>
                <h3 className="text-xl font-black">{item.question}</h3>
                <p className="mt-2 leading-8 text-neutral-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <AuthorBox />

        <TennisNavigationHub
          dark={false}
          className="mt-10"
          links={[
            {
              href: "/tennis-streaming-services",
              title: "Compare tennis streaming services",
              description: "See how common legal tennis services differ by use case and tournament type.",
              label: "Compare",
            },
            {
              href: "/official-tennis-broadcasters-guide",
              title: "Official broadcasters guide",
              description: "Learn why rights change by tournament, country and season.",
              label: "Rights",
            },
            {
              href: "/how-to-watch-tennis-legally",
              title: "How to watch tennis legally",
              description: "Stay away from fake stream pages and use safer official sources.",
              label: "Safety",
            },
          ]}
        />
      </div>

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "Streaming services", url: "https://watchtennistoday.com/tennis-streaming-services" },
          { name: "Tennis Streaming Cost Calculator", url: "https://watchtennistoday.com/tennis-streaming-cost-calculator" },
        ]}
      />
    </main>
  );
}

import type { Metadata } from "next";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";
import { affiliateLinks } from "@/app/lib/affiliateLinks";
import AuthorBox from "@/app/components/AuthorBox";
import { buildArticleAuthorSchema, buildOrganizationSchema } from "@/data/authorProfile";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Best Tennis Streaming Services Compared | Legal TV & Online Options",
  description:
    "Compare legal tennis streaming services by tournament type, region, access model and travel use case. Find where ATP, WTA and Grand Slam tennis is usually available.",
  alternates: {
    canonical: "https://watchtennistoday.com/tennis-streaming-services",
  },
  openGraph: {
    title: "Best Tennis Streaming Services Compared",
    description:
      "A practical guide to Tennis TV, ESPN, Eurosport, Tennis Channel, TNT Sports and official Grand Slam broadcasters.",
    url: "https://watchtennistoday.com/tennis-streaming-services",
    siteName: "Watch Tennis Today",
    type: "article",
  },
};

const services = [
  {
    name: "Tennis TV",
    bestFor: "ATP Tour fans",
    usuallyCovers: "ATP Tour events outside Grand Slams",
    watchOutFor: "Grand Slam live video rights are normally separate.",
    link: "https://www.tennistv.com/",
    official: true,
  },
  {
    name: "Tennis Channel / Tennis Channel Plus",
    bestFor: "US-based tennis viewers",
    usuallyCovers: "Selected ATP, WTA and tournament coverage in the United States",
    watchOutFor: "Availability depends on package, tournament and local rights.",
    link: "https://www.tennischannel.com/",
    official: true,
  },
  {
    name: "ESPN / ESPN+",
    bestFor: "US Grand Slam coverage checks",
    usuallyCovers: "Selected Grand Slam and tennis programming in the US",
    watchOutFor: "Not every ATP/WTA event is included; check the live schedule first.",
    link: "https://www.espn.com/tennis/",
    official: true,
  },
  {
    name: "Eurosport / discovery+",
    bestFor: "Many European tennis fans",
    usuallyCovers: "Grand Slam and tennis coverage in several European markets",
    watchOutFor: "Rights vary by country and subscription tier.",
    link: "https://www.eurosport.com/tennis/",
    official: true,
  },
  {
    name: "TNT Sports",
    bestFor: "UK broadcaster checks",
    usuallyCovers: "Selected tennis rights in the UK depending on the event",
    watchOutFor: "Confirm the specific tournament before subscribing.",
    link: "https://www.tntsports.co.uk/tennis/",
    official: true,
  },
  {
    name: "Official tournament broadcasters",
    bestFor: "Grand Slams and country-specific rights",
    usuallyCovers: "Roland Garros, Wimbledon, US Open and Australian Open by territory",
    watchOutFor: "Each tournament sells rights separately, so there is no single global answer.",
    link: "/tennis-tv-broadcast-finder",
    official: false,
  },
];

const decisionCards = [
  {
    title: "I mainly watch ATP matches",
    answer: "Start with Tennis TV, then check your local broadcaster for Masters events and regional restrictions.",
  },
  {
    title: "I mainly watch Grand Slams",
    answer: "Use the tournament broadcaster list first. Grand Slam rights are usually separate from ATP-only platforms.",
  },
  {
    title: "I am traveling abroad",
    answer: "Check whether your paid subscription works in your destination. A VPN can secure hotel Wi‑Fi, but it does not replace legal access.",
  },
  {
    title: "I want one simple place to check today",
    answer: "Use the TV schedule and Broadcast Finder before buying or opening any streaming app.",
  },
];

const faqs = [
  {
    question: "What is the best tennis streaming service?",
    answer:
      "There is no single best tennis streaming service for every fan because ATP, WTA and Grand Slam rights are split by tournament and country. Tennis TV is useful for ATP Tour coverage, while Grand Slams usually require country-specific broadcasters.",
  },
  {
    question: "Does Tennis TV show Grand Slam matches?",
    answer:
      "Tennis TV is focused on ATP Tour coverage. Grand Slam live video rights are normally sold separately by each tournament and region.",
  },
  {
    question: "Should I use a VPN to watch tennis?",
    answer:
      "A VPN can help protect your connection while traveling, especially on public Wi‑Fi, but you should still use legal streaming services and follow each provider's terms.",
  },
];

export default function TennisStreamingServicesPage() {
  const updatedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });

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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Best Tennis Streaming Services Compared",
    description:
      "A practical comparison of legal tennis streaming services and broadcaster options.",
    author: buildArticleAuthorSchema(),
    publisher: buildOrganizationSchema(),
    dateModified: new Date().toISOString(),
    mainEntityOfPage: "https://watchtennistoday.com/tennis-streaming-services",
  };

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <section className="border-b border-neutral-200 bg-gradient-to-br from-neutral-950 via-slate-950 to-emerald-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
            Streaming service comparison
          </p>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Best tennis streaming services: compare legal ways to watch tennis
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Tennis rights are fragmented. ATP, WTA and Grand Slam matches may be on different services depending on your country. This guide helps fans choose the right legal option before paying for a subscription.
          </p>
          <p className="mt-5 text-sm text-zinc-400">Updated {updatedAt} UTC</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/tennis-tv-broadcast-finder" className="rounded-full bg-emerald-400 px-6 py-3 font-black text-black hover:bg-emerald-300">
              Find my broadcaster →
            </a>
            <a href="/tennis-tv-not-working" className="rounded-full border border-white/20 px-6 py-3 font-black text-white hover:bg-white/10">
              Fix stream issues →
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-2xl font-black">Important before you subscribe</h2>
          <p className="mt-3 max-w-4xl leading-7 text-neutral-700">
            Always confirm the exact tournament, country and match date with the official provider. This page is a practical decision guide, not a guarantee that one service carries every match in every region.
          </p>
        </section>

        <section className="mt-10 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="grid grid-cols-1 bg-neutral-950 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white md:grid-cols-5">
            <span>Service</span>
            <span>Best for</span>
            <span className="md:col-span-2">Usually covers</span>
            <span>Check first</span>
          </div>
          {services.map((service) => (
            <article key={service.name} className="grid gap-3 border-t border-neutral-200 px-6 py-5 md:grid-cols-5 md:items-start">
              <a
                href={service.link}
                target={service.official ? "_blank" : undefined}
                rel={service.official ? "noopener noreferrer" : undefined}
                className="font-black text-emerald-700 hover:text-emerald-600"
              >
                {service.name} →
              </a>
              <p className="text-neutral-800">{service.bestFor}</p>
              <p className="leading-7 text-neutral-700 md:col-span-2">{service.usuallyCovers}</p>
              <p className="leading-7 text-neutral-600">{service.watchOutFor}</p>
            </article>
          ))}
        </section>

        <RevenueConversionPanel context="article" />

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          {decisionCards.map((card) => (
            <article key={card.title} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
              <h2 className="text-xl font-black">{card.title}</h2>
              <p className="mt-3 leading-7 text-neutral-700">{card.answer}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="text-2xl font-black">Fast route to the right service</h2>
          <ol className="mt-5 grid gap-4 md:grid-cols-4">
            {[
              "Check today's match page",
              "Identify ATP, WTA or Grand Slam",
              "Open the country broadcaster guide",
              "Use the official provider or your paid subscription",
            ].map((step, index) => (
              <li key={step} className="rounded-2xl border border-neutral-200 p-5">
                <span className="text-sm font-black text-emerald-700">Step {index + 1}</span>
                <p className="mt-2 font-bold">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-2xl font-black">Travel viewing note</h2>
          <p className="mt-3 max-w-3xl leading-7 text-neutral-700">
            If you already pay for a streaming service and travel, check whether your account works in the destination country. A VPN may help secure your connection on public Wi‑Fi, but you still need valid legal access.
          </p>
          <a
            href={affiliateLinks.nordvpn}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="mt-5 inline-flex rounded-full bg-neutral-950 px-6 py-3 font-black text-white hover:bg-neutral-800"
          >
            View VPN option →
          </a>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Broadcast Finder", "/tennis-tv-broadcast-finder"],
            ["Watch Tennis Abroad", "/watch-tennis-abroad"],
            ["Streaming Rights Explained", "/tennis-streaming-rights-explained"],
            ["Tennis TV Not Working", "/tennis-tv-not-working"],
            ["Best VPN for Tennis", "/best-vpn-for-tennis-streaming"],
            ["TV Schedule", "/tv-schedule"],
          ].map(([label, href]) => (
            <a key={href} href={href} className="rounded-2xl border border-neutral-200 p-5 font-black hover:border-emerald-500 hover:bg-emerald-50">
              {label} →
            </a>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-neutral-200 bg-white p-6">
          <h2 className="text-2xl font-black">FAQ</h2>
          <div className="mt-5 space-y-5">
            {faqs.map((faq) => (
              <article key={faq.question}>
                <h3 className="font-black">{faq.question}</h3>
                <p className="mt-2 leading-7 text-neutral-700">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <AuthorBox theme="light" />
      </section>
    </main>
  );
}

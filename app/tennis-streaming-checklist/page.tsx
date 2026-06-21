import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import AuthorBox from "@/app/components/AuthorBox";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";
import { buildArticleAuthorSchema, buildOrganizationSchema } from "@/data/authorProfile";

export const metadata = {
  title: "Tennis Streaming Checklist | Choose the Right Legal Service",
  description:
    "A practical checklist for choosing a legal tennis streaming service before subscribing: tournament rights, country availability, device support, replay access and travel limitations.",
  alternates: {
    canonical: "https://watchtennistoday.com/tennis-streaming-checklist",
  },
};

const checklist = [
  {
    title: "1. Start with the exact tournament",
    text: "Do not buy a streaming plan just because it has tennis. ATP, WTA and Grand Slam rights can be split across different services, even inside the same country.",
  },
  {
    title: "2. Check your country, not just the service name",
    text: "The same brand can have different rights in different markets. Confirm the broadcaster page for your location before you subscribe.",
  },
  {
    title: "3. Check live, replay and highlights separately",
    text: "Some services carry live matches, others only highlights or delayed replays. If you care about live tennis, make sure the match appears in the live schedule.",
  },
  {
    title: "4. Confirm device support",
    text: "Check whether the service works on your phone, laptop, smart TV, Chromecast, Apple TV, Roku or console before a big match starts.",
  },
  {
    title: "5. Look for blackout and travel rules",
    text: "A paid subscription may not work everywhere while traveling. Read the provider terms and use legal access in the country where you are watching.",
  },
  {
    title: "6. Avoid illegal stream sites",
    text: "Unsafe stream pages can expose you to malware, misleading ads and unreliable video. Watch Tennis Today points readers toward legal broadcaster checks instead.",
  },
];

const quickDecisions = [
  {
    situation: "I mostly watch ATP Tour matches",
    action: "Compare ATP-focused options first, then check local broadcasters for specific events.",
  },
  {
    situation: "I mostly watch Grand Slams",
    action: "Use the official tournament broadcaster list because Grand Slam rights are usually separate.",
  },
  {
    situation: "I only need today’s matches",
    action: "Start with the daily schedule, then open the broadcaster finder for the match country.",
  },
  {
    situation: "I am traveling",
    action: "Check your provider’s travel rules and make sure your access remains legal in the destination country.",
  },
];

const faqs = [
  {
    question: "Can one streaming service show every tennis match?",
    answer:
      "Usually no. Tennis rights are fragmented across ATP, WTA, Grand Slam tournaments and local broadcasters. A smart choice starts with the tournament and country.",
  },
  {
    question: "Should I subscribe before checking the schedule?",
    answer:
      "No. Check the exact match, date, country and broadcaster first. This reduces the chance of paying for a service that does not carry the match you want.",
  },
  {
    question: "Does Watch Tennis Today host live streams?",
    answer:
      "No. Watch Tennis Today does not host or embed live streams. The site helps readers find schedules, context and legal broadcaster options.",
  },
];

export default function TennisStreamingChecklistPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Tennis Streaming Checklist",
    description: metadata.description,
    author: buildArticleAuthorSchema(),
    publisher: buildOrganizationSchema(),
    dateModified: new Date().toISOString(),
    mainEntityOfPage: "https://watchtennistoday.com/tennis-streaming-checklist",
  };

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

  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />

      <section className="bg-gradient-to-br from-neutral-950 via-slate-950 to-emerald-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <nav className="flex flex-wrap gap-2 text-sm text-zinc-400">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/tennis-guides" className="hover:text-white">Guides</Link>
            <span>/</span>
            <span className="text-white">Streaming checklist</span>
          </nav>
          <p className="mt-8 text-xs font-black uppercase tracking-[0.25em] text-emerald-300">Buyer checklist</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Tennis streaming checklist: choose the right legal service before you pay
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Tennis is easy to love and weirdly difficult to watch. Use this checklist before subscribing so you do not pay for the wrong service, miss a match, or rely on unsafe stream pages.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tennis-tv-broadcast-finder" className="rounded-full bg-emerald-400 px-6 py-3 font-black text-black hover:bg-emerald-300">
              Find my broadcaster →
            </Link>
            <Link href="/tennis-streaming-services" className="rounded-full border border-white/20 px-6 py-3 font-black text-white hover:bg-white/10">
              Compare services →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-2xl font-black">The safest rule</h2>
          <p className="mt-3 max-w-4xl leading-7 text-neutral-700">
            Buy based on the match you want to watch, not based on a generic promise that a service has tennis. The tournament, country and date matter more than the logo.
          </p>
        </div>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          {checklist.map((item) => (
            <article key={item.title} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm">
              <h2 className="text-xl font-black">{item.title}</h2>
              <p className="mt-3 leading-7 text-neutral-700">{item.text}</p>
            </article>
          ))}
        </section>

        <RevenueConversionPanel context="article" />

        <section className="mt-12 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
          <div className="bg-neutral-950 px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white">
            Quick decision guide
          </div>
          {quickDecisions.map((row) => (
            <article key={row.situation} className="grid gap-3 border-t border-neutral-200 px-6 py-5 md:grid-cols-3">
              <h2 className="font-black text-neutral-950">{row.situation}</h2>
              <p className="leading-7 text-neutral-700 md:col-span-2">{row.action}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-3">
          <Link href="/tennis-on-tv-today" className="rounded-3xl border border-neutral-200 p-6 hover:border-emerald-300">
            <h2 className="text-xl font-black">Tennis on TV today</h2>
            <p className="mt-3 leading-7 text-neutral-700">Check today’s viewing intent before opening a streaming app.</p>
          </Link>
          <Link href="/how-to-watch-tennis-legally" className="rounded-3xl border border-neutral-200 p-6 hover:border-emerald-300">
            <h2 className="text-xl font-black">Legal streaming guide</h2>
            <p className="mt-3 leading-7 text-neutral-700">Understand the safe route to official tennis coverage.</p>
          </Link>
          <Link href="/tennis-tv-not-working" className="rounded-3xl border border-neutral-200 p-6 hover:border-emerald-300">
            <h2 className="text-xl font-black">Stream not working?</h2>
            <p className="mt-3 leading-7 text-neutral-700">Use quick checks for app, device, schedule and rights issues.</p>
          </Link>
        </section>

        <section className="mt-12 rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-3xl font-black">FAQ</h2>
          <div className="mt-6 space-y-6">
            {faqs.map((faq) => (
              <article key={faq.question}>
                <h3 className="text-xl font-black">{faq.question}</h3>
                <p className="mt-2 leading-7 text-neutral-700">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <AuthorBox />
      </section>

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "Tennis Guides", url: "https://watchtennistoday.com/tennis-guides" },
          { name: "Tennis Streaming Checklist", url: "https://watchtennistoday.com/tennis-streaming-checklist" },
        ]}
      />
    </main>
  );
}

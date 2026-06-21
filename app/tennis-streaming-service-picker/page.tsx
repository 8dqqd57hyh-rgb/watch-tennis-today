import type { Metadata } from "next";
import Link from "next/link";
import AuthorBox from "@/app/components/AuthorBox";
import { buildArticleAuthorSchema, buildOrganizationSchema } from "@/data/authorProfile";
import StreamingServicePickerClient from "./StreamingServicePickerClient";

export const metadata: Metadata = {
  title: "Tennis Streaming Service Picker | Find the Best Legal Option",
  description:
    "Use this interactive tennis streaming service picker to choose a legal viewing setup by country, exact Grand Slam and budget before paying for a subscription.",
  alternates: {
    canonical: "https://watchtennistoday.com/tennis-streaming-service-picker",
  },
  openGraph: {
    title: "Tennis Streaming Service Picker",
    description:
      "Choose a legal tennis streaming setup by country, exact Grand Slam and budget.",
    url: "https://watchtennistoday.com/tennis-streaming-service-picker",
    siteName: "Watch Tennis Today",
    type: "website",
  },
};

const faqs = [
  {
    question: "Why do tennis broadcast rights differ by country?",
    answer:
      "Tennis rights are sold by territory, tournament and media package. A broadcaster that shows a match in one country may have no rights in another country.",
  },
  {
    question: "Are Grand Slam rights separate from ATP and WTA rights?",
    answer:
      "Yes. Australian Open, Roland Garros, Wimbledon and US Open rights are usually separate from weekly ATP Tour and WTA Tour rights.",
  },
  {
    question: "Should I verify the official broadcaster before subscribing?",
    answer:
      "Yes. Broadcast rights, app packages, court coverage and prices can change. Use the official tournament, tour or broadcaster source as the final check before paying.",
  },
  {
    question: "Can one streaming service show every tennis tournament?",
    answer:
      "Usually no. A fan may need different official services for Grand Slams, ATP Tour events, WTA Tour events and local TV-only matches.",
  },
];

export default function TennisStreamingServicePickerPage() {
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

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Tennis Streaming Service Picker",
    applicationCategory: "SportsApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Interactive tennis broadcaster picker using country and tournament rights data with official verification sources.",
  };

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Tennis Streaming Service Picker",
    applicationCategory: "SportsApplication",
    operatingSystem: "Web",
    url: "https://watchtennistoday.com/tennis-streaming-service-picker",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Country and tournament picker for finding official tennis broadcasters, streaming services, price notes and verification links.",
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Tennis Streaming Service Picker",
    description: "How to choose a legal tennis streaming option before paying for a subscription.",
    author: buildArticleAuthorSchema(),
    publisher: buildOrganizationSchema(),
    dateModified: new Date().toISOString(),
    mainEntityOfPage: "https://watchtennistoday.com/tennis-streaming-service-picker",
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <section className="border-b border-zinc-800 bg-gradient-to-br from-neutral-950 via-slate-950 to-emerald-950">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Link href="/tennis-streaming-services" className="text-sm font-black text-emerald-300 hover:text-emerald-200">
            ← Back to streaming services
          </Link>
          <p className="mt-8 text-xs font-black uppercase tracking-[0.25em] text-emerald-300">Interactive streaming tool</p>
          <h1 className="mt-3 max-w-4xl text-4xl font-black md:text-6xl">Pick the right tennis streaming service before you pay</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
            Tennis streaming is confusing because ATP, WTA, Grand Slams and local broadcasters are split by country and by tournament. Use this picker to find the official broadcaster route, price notes when known and source links to verify before opening a wallet.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-black">
            <Link href="/tennis-streaming-cost-calculator" className="rounded-full bg-emerald-400 px-5 py-3 text-black hover:bg-emerald-300">
              Calculate cost →
            </Link>
            <Link href="/tennis-streaming-checklist" className="rounded-full border border-white/20 px-5 py-3 text-white hover:bg-white/10">
              Use checklist →
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <StreamingServicePickerClient />

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ["1", "Choose your country", "Rights are local, so start with the country where you actually watch."],
            ["2", "Choose a tournament group", "Grand Slams, ATP Tour and WTA Tour can have different official broadcasters."],
            ["3", "Open the official source", "Avoid paying until the broadcaster, app package, court coverage and price all match your needs."],
          ].map(([step, title, copy]) => (
            <div key={step} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <p className="text-sm font-black text-emerald-300">Step {step}</p>
              <h2 className="mt-3 text-2xl font-black">{title}</h2>
              <p className="mt-3 leading-7 text-zinc-400">{copy}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">FAQ</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
                <h3 className="font-black text-white">{faq.question}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-emerald-900 bg-emerald-950/20 p-6">
          <h2 className="text-3xl font-black">Next useful tools</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ["/tennis-streaming-cost-calculator", "Streaming cost calculator"],
              ["/tennis-streaming-checklist", "Streaming checklist"],
              ["/tennis-streaming-services", "Streaming services"],
            ].map(([href, label]) => (
              <Link key={href} href={href} className="rounded-2xl border border-zinc-700 bg-black/40 p-4 font-black text-zinc-100 hover:border-emerald-300">
                {label} →
              </Link>
            ))}
          </div>
        </section>

        <AuthorBox />
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";
import { affiliateLinks } from "@/app/lib/affiliateLinks";

export const metadata: Metadata = {
  title: "Tennis TV Not Working? Legal Streaming Fixes & Region Checks",
  description:
    "Troubleshoot Tennis TV and tennis streaming issues: blackout rules, Grand Slam rights, VPN travel checks, app problems, and official broadcaster alternatives.",
  alternates: {
    canonical: "https://watchtennistoday.com/tennis-tv-not-working",
  },
  openGraph: {
    title: "Tennis TV Not Working? Legal Streaming Fixes",
    description:
      "Check why a tennis stream may be unavailable and find the correct legal broadcaster for today's match.",
    url: "https://watchtennistoday.com/tennis-tv-not-working",
    siteName: "Watch Tennis Today",
    type: "article",
  },
};

const quickChecks = [
  {
    issue: "Grand Slam match not available on Tennis TV",
    why: "Tennis TV covers ATP Tour events, but Grand Slam rights are sold separately by tournament and country.",
    fix: "Check the official Grand Slam broadcaster list or use the Broadcast Finder before buying access.",
  },
  {
    issue: "Stream works at home but not while traveling",
    why: "Streaming rights and account access can depend on your current location and broadcaster region.",
    fix: "Use your official provider first. A reputable VPN can help secure your connection while traveling, but you still need a valid subscription and must follow provider terms.",
  },
  {
    issue: "Match page says live, but video is missing",
    why: "Some providers publish live scores before TV coverage starts, or the match may be on a different court/feed.",
    fix: "Refresh the official app, check court coverage, and compare the TV schedule for your country.",
  },
  {
    issue: "Blackout or unavailable message",
    why: "Local blackout rules or exclusive broadcaster deals may block a stream in a specific country.",
    fix: "Look up the local rights holder instead of trying random unofficial streams.",
  },
];

const links = [
  ["Find your broadcaster", "/tennis-tv-broadcast-finder"],
  ["Watch tennis abroad", "/watch-tennis-abroad"],
  ["Tennis TV vs ESPN", "/compare/tennis-tv-vs-espn"],
  ["Tennis TV vs Eurosport", "/compare/tennis-tv-vs-eurosport"],
  ["Best VPN for tennis", "/best-vpn-for-tennis-streaming"],
  ["Streaming rights explained", "/tennis-streaming-rights-explained"],
];

const faqs = [
  {
    question: "Why is Tennis TV not showing a Grand Slam match?",
    answer:
      "Tennis TV does not usually carry Grand Slam live video rights. Events like Roland Garros, Wimbledon, the US Open and the Australian Open have separate broadcaster agreements by country.",
  },
  {
    question: "Can a VPN fix Tennis TV while traveling?",
    answer:
      "A VPN can help secure your connection while traveling, but it does not replace a valid subscription and you should follow the streaming provider's terms and local rules.",
  },
  {
    question: "What should I check first if a tennis stream is unavailable?",
    answer:
      "Check whether the event is ATP/WTA or Grand Slam, confirm the official broadcaster in your country, then verify your subscription, app version, location settings and match start time.",
  },
];

export default function TennisTvNotWorkingPage() {
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
    headline: "Tennis TV Not Working? Legal Streaming Fixes & Region Checks",
    description:
      "A practical troubleshooting guide for Tennis TV and tennis streaming availability issues.",
    author: {
      "@type": "Organization",
      name: "Watch Tennis Today",
    },
    publisher: {
      "@type": "Organization",
      name: "Watch Tennis Today",
    },
    dateModified: new Date().toISOString(),
    mainEntityOfPage: "https://watchtennistoday.com/tennis-tv-not-working",
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

      <section className="border-b border-neutral-200 bg-gradient-to-br from-neutral-950 via-neutral-900 to-emerald-950 text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
            Streaming troubleshooting
          </p>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            Tennis TV not working? Check the legal fix before the match starts
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            If a tennis stream is blocked, missing or showing the wrong event, the reason is often rights-related — not just a broken app. Use this guide to check Grand Slam rights, ATP/WTA coverage, location issues and official broadcaster alternatives.
          </p>
          <p className="mt-5 text-sm text-zinc-400">Updated {updatedAt} UTC</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-5 md:grid-cols-2">
          {quickChecks.map((item) => (
            <article key={item.issue} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">{item.issue}</h2>
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.15em] text-neutral-500">Why it happens</p>
              <p className="mt-2 leading-7 text-neutral-700">{item.why}</p>
              <p className="mt-4 text-sm font-bold uppercase tracking-[0.15em] text-emerald-700">What to do</p>
              <p className="mt-2 leading-7 text-neutral-700">{item.fix}</p>
            </article>
          ))}
        </div>

        <RevenueConversionPanel context="article" />

        <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
          <h2 className="text-2xl font-black">Fast decision path</h2>
          <ol className="mt-5 grid gap-4 md:grid-cols-4">
            {[
              "Identify the tournament",
              "Check if it is ATP/WTA or Grand Slam",
              "Find the official broadcaster in your country",
              "Use your existing paid subscription legally",
            ].map((step, index) => (
              <li key={step} className="rounded-2xl bg-white p-5 shadow-sm">
                <span className="text-sm font-black text-emerald-700">Step {index + 1}</span>
                <p className="mt-2 font-bold">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-2xl border border-neutral-200 p-5 font-black hover:border-emerald-500 hover:bg-emerald-50"
            >
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

        <section className="mt-10 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-2xl font-black">Traveling soon?</h2>
          <p className="mt-3 max-w-3xl leading-7 text-neutral-700">
            Check your official streaming subscription before leaving your country. If you need a safer connection on hotel or airport Wi-Fi, compare trusted VPN options — but do not rely on a VPN as a substitute for legal access.
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
      </section>
    </main>
  );
}

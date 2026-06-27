import EmailSignup from "@/app/components/EmailSignup";
import { affiliateLinks } from "@/app/lib/affiliateLinks";

type WimbledonGuidePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  focus: "live" | "schedule" | "results" | "tv" | "where";
};

const officialChecks = [
  "Start with the official Wimbledon order of play before checking any stream.",
  "Confirm the broadcaster for your country because rights differ by market.",
  "Use the tournament schedule as the source of truth for court changes and rain delays.",
  "Avoid pages that promise free live video but push downloads, pop-ups or fake play buttons.",
];

const countryOptions = [
  {
    country: "United Kingdom",
    services: "BBC, BBC iPlayer and official Wimbledon coverage",
    note: "Best starting point for UK viewers during the Championships.",
    href: affiliateLinks.bbc,
    guideHref: "/how-to-watch-wimbledon-in-uk",
  },
  {
    country: "United States",
    services: "ESPN / ESPN+ depending on session and rights package",
    note: "Check the daily match window and court before subscribing.",
    href: affiliateLinks.espn,
    guideHref: "/how-to-watch-wimbledon-in-usa",
  },
  {
    country: "Canada",
    services: "TSN / RDS checks and official Wimbledon listings",
    note: "English and French-language access may differ by package.",
    href: "https://www.wimbledon.com/en_GB/about/tv_coverage.html",
    guideHref: "/how-to-watch-wimbledon-in-canada",
  },
  {
    country: "Australia",
    services: "Official Wimbledon partner checks",
    note: "Convert London sessions carefully because many matches fall overnight.",
    href: "https://www.wimbledon.com/en_GB/about/tv_coverage.html",
    guideHref: "/how-to-watch-wimbledon-in-australia",
  },
  {
    country: "Poland",
    services: "Polsat / current Polsat sports access checks",
    note: "Confirm court coverage and app access close to match day.",
    href: "https://www.wimbledon.com/en_GB/about/tv_coverage.html",
    guideHref: "/how-to-watch-wimbledon-in-poland",
  },
  {
    country: "Traveling abroad",
    services: "Your existing legal account + safe connection tools",
    note: "A VPN is mainly useful for privacy and access to your normal account where allowed.",
    href: affiliateLinks.nordvpn,
    guideHref: "/best-vpn-for-wimbledon",
  },
];

const focusCopy = {
  live: {
    heading: "Live Wimbledon viewing workflow",
    body: "Use this page as a clean match-day hub: check the order of play, identify the court, confirm the licensed broadcaster, then open your legal streaming app before the session starts.",
  },
  schedule: {
    heading: "How to read the Wimbledon schedule",
    body: "Wimbledon start times can move because previous matches run long, weather interrupts play or courts are reassigned. Treat the daily order of play as a live planning tool, not a fixed appointment.",
  },
  results: {
    heading: "Results and draw tracking",
    body: "Results pages should help readers understand who advanced, which section of the draw changed, and which matches may become important for the next TV window.",
  },
  tv: {
    heading: "TV schedule planning",
    body: "A useful TV page should connect sessions, courts, time zones and broadcasters so readers can quickly decide whether they need cable, a streaming app or free-to-air coverage.",
  },
  where: {
    heading: "Where to watch Wimbledon legally",
    body: "The safest route is always official coverage: national broadcasters, recognized sports apps and tournament-approved partners. This page keeps that advice visible and avoids risky stream wording.",
  },
};

const scheduleChecks = [
  {
    title: "Before the first match",
    body: "Read the official order of play, convert the session to your local time and check whether the court is covered by your broadcaster or app package.",
  },
  {
    title: "During the day",
    body: "Expect movement. Earlier matches, rain, roof decisions and court reassignment can change the real start time without changing the headline session.",
  },
  {
    title: "After the match",
    body: "Use results and draw pages to understand who advances, then move to the next round schedule instead of relying on expired live links.",
  },
];

export default function WimbledonGuidePage({
  eyebrow,
  title,
  description,
  focus,
}: WimbledonGuidePageProps) {
  const selected = focusCopy[focus];
  const faq = [
    {
      question: "Where can I watch Wimbledon live online?",
      answer:
        "Start with the official Wimbledon schedule and then confirm the licensed broadcaster in your country. Coverage usually depends on country, session, court and subscription package.",
    },
    {
      question: "Is Wimbledon free to stream?",
      answer:
        "Some countries may have free-to-air or public broadcaster coverage, while others require a paid TV or streaming subscription. Always check your local broadcaster before match day.",
    },
    {
      question: "Can I use a VPN for Wimbledon streaming?",
      answer:
        "A VPN can help protect your connection on public Wi-Fi or while traveling, but you should still use legal streaming services and follow the terms of the service you pay for.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    about: [
      { "@type": "SportsEvent", name: "Wimbledon" },
      { "@type": "Thing", name: "Wimbledon order of play" },
      { "@type": "Thing", name: "Legal tennis streaming" },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700">
        {eyebrow}
      </p>
      <h1 className="mb-5 max-w-4xl text-4xl font-bold tracking-tight text-neutral-950 md:text-5xl">
        {title}
      </h1>
      <p className="mb-8 max-w-3xl text-lg leading-8 text-neutral-700">
        {description}
      </p>

      <section className="mb-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="mb-3 text-2xl font-bold text-neutral-950">{selected.heading}</h2>
        <p className="text-base leading-7 text-neutral-700">{selected.body}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <a href="/wimbledon-live" className="rounded-2xl border bg-white p-4 font-semibold hover:bg-neutral-50">Live hub</a>
          <a href="/wimbledon-schedule" className="rounded-2xl border bg-white p-4 font-semibold hover:bg-neutral-50">Schedule</a>
          <a href="/wimbledon-order-of-play" className="rounded-2xl border bg-white p-4 font-semibold hover:bg-neutral-50">Order of play</a>
          <a href="/wimbledon-tv-schedule" className="rounded-2xl border bg-white p-4 font-semibold hover:bg-neutral-50">TV schedule</a>
          <a href="/best-vpn-for-wimbledon" className="rounded-2xl border bg-white p-4 font-semibold hover:bg-neutral-50">VPN guide</a>
        </div>
      </section>

      <section className="mb-8 rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-neutral-950">How to watch Wimbledon by country</h2>
        <p className="max-w-3xl text-base leading-7 text-neutral-700">
          Start with the country guide for your location, then verify the live court and app package with the official broadcaster before match time.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {countryOptions.filter((option) => option.country !== "Traveling abroad").map((option) => (
            <a
              key={option.country}
              href={option.guideHref}
              className="rounded-2xl border bg-neutral-50 p-4 font-bold text-neutral-950 hover:bg-white"
            >
              {option.country}
            </a>
          ))}
        </div>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-2">
        {officialChecks.map((item) => (
          <div key={item} className="rounded-3xl border bg-white p-6 shadow-sm">
            <span className="text-sm font-bold uppercase tracking-wide text-emerald-700">Check</span>
            <p className="mt-2 text-base leading-7 text-neutral-700">{item}</p>
          </div>
        ))}
      </section>

      <section className="mb-8 rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-neutral-950">Schedule, spoilers and next-round planning</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {scheduleChecks.map((item) => (
            <article key={item.title} className="rounded-2xl bg-neutral-50 p-4">
              <h3 className="font-bold text-neutral-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-700">{item.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="/wimbledon-results" className="rounded-2xl border bg-white px-4 py-3 text-sm font-bold hover:bg-neutral-50">Results</a>
          <a href="/tennis-spoiler-free-scores" className="rounded-2xl border bg-white px-4 py-3 text-sm font-bold hover:bg-neutral-50">Spoiler-free scores</a>
          <a href="/tennis-time-zone-converter" className="rounded-2xl border bg-white px-4 py-3 text-sm font-bold hover:bg-neutral-50">Time zone planner</a>
        </div>
      </section>

      <section className="mb-8 rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-neutral-950">Wimbledon broadcaster starting points</h2>
        <div className="overflow-hidden rounded-2xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-100 text-neutral-700">
              <tr>
                <th className="p-3">Viewer location</th>
                <th className="p-3">Likely place to check</th>
                <th className="p-3">Why it matters</th>
              </tr>
            </thead>
            <tbody>
              {countryOptions.map((option) => (
                <tr key={option.country} className="border-t align-top">
                  <td className="p-3 font-semibold">{option.country}</td>
                  <td className="p-3">
                    <a
                      href={option.href}
                      target="_blank"
                      rel={option.href === affiliateLinks.nordvpn ? "nofollow sponsored noopener noreferrer" : "noopener noreferrer"}
                      className="text-emerald-700 underline-offset-4 hover:underline"
                    >
                      {option.services}
                    </a>
                    <a
                      href={option.guideHref}
                      className="mt-2 block text-xs font-black uppercase tracking-[0.12em] text-neutral-500 underline-offset-4 hover:text-emerald-700 hover:underline"
                    >
                      View Wimbledon guide
                    </a>
                  </td>
                  <td className="p-3 text-neutral-600">{option.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-300">Travel CTA</p>
        <h2 className="mb-3 text-2xl font-bold">Watching Wimbledon away from home?</h2>
        <p className="mb-5 max-w-3xl text-base leading-7 text-zinc-300">
          Check the legal broadcaster first. If you already pay for a streaming service and travel during the tournament, compare safe VPN options before the match instead of looking for risky stream mirrors.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={affiliateLinks.nordvpn}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-bold text-black hover:bg-emerald-300"
          >
            Check VPN option
          </a>
          <a href="/affiliate-disclosure" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-bold text-white hover:border-emerald-400">
            Affiliate disclosure
          </a>
        </div>
      </section>

      <section className="mb-8 rounded-3xl border bg-white p-6">
        <h2 className="mb-4 text-2xl font-bold text-neutral-950">FAQ</h2>
        <div className="space-y-4">
          {faq.map((item) => (
            <div key={item.question}>
              <h3 className="font-semibold text-neutral-950">{item.question}</h3>
              <p className="mt-1 text-base leading-7 text-neutral-700">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <EmailSignup />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([webPageSchema, faqSchema]) }}
      />
    </main>
  );
}

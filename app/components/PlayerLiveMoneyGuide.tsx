import { affiliateLinks } from "@/app/lib/affiliateLinks";

type PlayerLiveMoneyGuideProps = {
  playerName: string;
  playerSlug: string;
  countryHint?: string;
};

const streamingOptions = [
  {
    service: "Tennis TV",
    bestFor: "ATP Tour matches outside Grand Slams",
    regions: "Many countries",
    note: "Check tournament rights before subscribing.",
    href: "https://www.tennistv.com/",
  },
  {
    service: "ESPN+",
    bestFor: "US tennis coverage and selected events",
    regions: "United States",
    note: "Useful for US viewers, depending on the event.",
    href: affiliateLinks.espn,
  },
  {
    service: "Eurosport",
    bestFor: "Grand Slam coverage in many European markets",
    regions: "Europe",
    note: "Rights vary by country and season.",
    href: affiliateLinks.eurosport,
  },
  {
    service: "Official tournament site",
    bestFor: "Order of play, court changes and official links",
    regions: "Global",
    note: "Best source for last-minute schedule changes.",
    href: "/today",
  },
];

export default function PlayerLiveMoneyGuide({
  playerName,
  playerSlug,
  countryHint = "your country",
}: PlayerLiveMoneyGuideProps) {
  const faq = [
    {
      question: `Where can I watch ${playerName} live today?`,
      answer: `Check the current tournament page, today's schedule and licensed broadcasters in ${countryHint}. Watch Tennis Today links to legal viewing options and does not host unauthorized streams.`,
    },
    {
      question: `Is ${playerName}'s match free to watch?`,
      answer:
        "Some events may be available through free-to-air broadcasters, free trials or official highlights, but many ATP, WTA and Grand Slam matches require a paid subscription.",
    },
    {
      question: `Can I watch ${playerName} while traveling?`,
      answer:
        "If you already pay for a legal streaming service, availability may change when you travel. A VPN can help protect your connection and access your usual account where permitted by the service terms.",
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

  return (
    <>
      <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Best legal viewing options
        </p>
        <h2 className="mb-3 text-2xl font-bold text-neutral-950">
          How to watch {playerName} live online
        </h2>
        <p className="mb-5 text-base leading-7 text-neutral-700">
          Start with the official order of play, then confirm the licensed broadcaster for
          your location. Streaming rights change by tournament, round and country, so this
          guide focuses on safe, legal routes instead of unreliable third-party streams.
        </p>

        <div className="overflow-hidden rounded-2xl border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-100 text-neutral-700">
              <tr>
                <th className="p-3">Service</th>
                <th className="p-3">Best for</th>
                <th className="p-3">Region</th>
                <th className="p-3">Note</th>
              </tr>
            </thead>
            <tbody>
              {streamingOptions.map((option) => (
                <tr key={option.service} className="border-t align-top">
                  <td className="p-3 font-semibold">
                    <a
                      href={option.href}
                      target={option.href.startsWith("http") ? "_blank" : undefined}
                      rel={option.href.startsWith("http") ? "nofollow sponsored noopener noreferrer" : undefined}
                      className="text-emerald-700 underline-offset-4 hover:underline"
                    >
                      {option.service}
                    </a>
                  </td>
                  <td className="p-3">{option.bestFor}</td>
                  <td className="p-3">{option.regions}</td>
                  <td className="p-3 text-neutral-600">{option.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-300">
          Money page CTA
        </p>
        <h2 className="mb-3 text-2xl font-bold">
          Traveling during {playerName}&apos;s next match?
        </h2>
        <p className="mb-5 text-base leading-7 text-zinc-300">
          If your usual tennis subscription is unavailable abroad, compare safe VPN options
          before match day. This is one of the most useful monetization paths for tennis
          streaming traffic because the intent is urgent and practical.
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
          <a
            href="/best-vpn-for-tennis-streaming"
            className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-bold text-white hover:border-emerald-400"
          >
            Read VPN guide
          </a>
        </div>
        <p className="mt-3 text-xs text-zinc-500">
          Affiliate disclosure: we may earn a commission if you buy through sponsored links.
        </p>
      </section>

      <section className="rounded-3xl border bg-white p-6">
        <h2 className="mb-4 text-2xl font-bold text-neutral-950">
          {playerName} live stream FAQ
        </h2>
        <div className="space-y-4">
          {faq.map((item) => (
            <div key={item.question}>
              <h3 className="font-semibold text-neutral-950">{item.question}</h3>
              <p className="mt-1 text-base leading-7 text-neutral-700">{item.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            href={`/watch-player-live/${playerSlug}`}
            className="rounded-xl border p-4 text-base font-semibold hover:bg-neutral-50"
          >
            Follow {playerName} match hub
          </a>
          <a
            href={`/next-match/${playerSlug}`}
            className="rounded-xl border p-4 text-base font-semibold hover:bg-neutral-50"
          >
            Check {playerName}&apos;s next match
          </a>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

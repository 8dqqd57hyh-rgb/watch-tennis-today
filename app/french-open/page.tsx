import DailyTennisLoop from "@/app/components/DailyTennisLoop";
import EmailSignup from "@/app/components/EmailSignup";
import FrenchOpenConversionCluster from "@/app/components/FrenchOpenConversionCluster";
import FrenchOpenSeoBridge from "@/app/components/FrenchOpenSeoBridge";
import FrenchOpenCountryGuides from "@/app/components/FrenchOpenCountryGuides";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import JsonLd from "@/app/components/JsonLd";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";
import FrenchOpenStreamingDecision from "@/app/components/FrenchOpenStreamingDecision";
import FrenchOpenDrawTracker from "@/app/components/FrenchOpenDrawTracker";
import FrenchOpenNextMatchesStrip from "@/app/components/FrenchOpenNextMatchesStrip";

export const metadata = {
  title: "French Open 2026 Hub: Live Matches, Results, Draw & TV Schedule",
  description:
    "Follow the French Open with one daily hub for Roland Garros live matches, yesterday’s recap, tomorrow’s schedule, results, draw, TV schedule and official streaming guides.",
  alternates: { canonical: "https://watchtennistoday.com/french-open" },
};

const primaryCards = [
  {
    label: "Yesterday",
    title: "Roland Garros recap",
    text: "Catch up on who advanced, who went out, long matches and completed results.",
    href: "/roland-garros-recap",
  },
  {
    label: "Today",
    title: "French Open today",
    text: "See live, upcoming and completed Roland Garros matches from today’s schedule.",
    href: "/french-open-today",
  },
  {
    label: "Tomorrow",
    title: "Tomorrow’s schedule",
    text: "Plan the next viewing session before tomorrow’s order of play gets crowded.",
    href: "/tomorrow",
  },
];

const resourceLinks = [
  ["French Open live", "/french-open-live"],
  ["French Open results", "/french-open-results"],
  ["French Open draw", "/french-open-draw"],
  ["Order of play", "/french-open-order-of-play"],
  ["TV schedule", "/french-open-tv-schedule"],
  ["Where to watch", "/where-to-watch-french-open"],
  ["French Open in USA", "/watch-tennis-in/usa"],
  ["French Open in UK", "/watch-tennis-in/uk"],
  ["French Open in Poland", "/watch-tennis-in/poland"],
  ["Streaming countries", "/french-open-streaming-countries"],
  ["Watch French Open online", "/watch-french-open-online"],
  ["Best VPN for Roland Garros", "/best-vpn-for-roland-garros"],
];

const faq = [
  {
    q: "What is the French Open hub?",
    a: "It is a central Roland Garros page that links daily match coverage, results, draw pages, order of play and official broadcaster guides.",
  },
  {
    q: "Where should I start if I missed yesterday’s Roland Garros matches?",
    a: "Start with the Roland Garros recap, then move to today’s French Open schedule and tomorrow’s matches.",
  },
  {
    q: "Where can I watch French Open matches legally?",
    a: "Use the French Open TV schedule, where-to-watch guide and country streaming pages to check official broadcasters for your location.",
  },
];

export default function FrenchOpenHubPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "French Open 2026 Hub",
      description:
        "Daily Roland Garros hub for live matches, results, draw, recap, schedule and legal viewing guides.",
      url: "https://watchtennistoday.com/french-open",
      hasPart: resourceLinks.map(([label, href]) => ({
        "@type": "WebPage",
        name: label,
        url: `https://watchtennistoday.com${href}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <JsonLd data={jsonLd} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "French Open", url: "https://watchtennistoday.com/french-open" },
        ]}
      />

      <div className="mx-auto max-w-7xl">
        <section className="mb-10 rounded-[2.5rem] border border-orange-500/50 bg-gradient-to-br from-orange-950/60 via-black to-black p-8">
          <div className="mb-5 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-black">
            Roland Garros hub
          </div>

          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            French Open 2026:
            <br />
            Matches, Results, Draw & TV
          </h1>

          <p className="mb-8 max-w-3xl text-lg leading-8 text-zinc-300">
            One central French Open page for fans who want to catch up on
            yesterday, check today’s matches, plan tomorrow, follow the draw and
            find official Roland Garros viewing options.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/french-open-today"
              className="rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-black transition hover:bg-orange-400"
            >
              See today’s matches →
            </a>
            <a
              href="/roland-garros-recap"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition hover:border-orange-500"
            >
              Yesterday’s recap
            </a>
            <a
              href="/french-open-tv-schedule"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition hover:border-orange-500"
            >
              TV schedule
            </a>
          </div>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-3">
          {primaryCards.map((card) => (
            <a
              key={card.href}
              href={card.href}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-orange-400 hover:bg-zinc-900"
            >
              <p className="mb-3 text-xs font-black uppercase tracking-widest text-orange-300">
                {card.label}
              </p>
              <h2 className="mb-3 text-3xl font-black">{card.title}</h2>
              <p className="leading-7 text-zinc-400">{card.text}</p>
            </a>
          ))}
        </section>

        <DailyTennisLoop tournamentName="French Open" compact />
        <FrenchOpenSeoBridge compact />
        <FrenchOpenNextMatchesStrip compact />
        <FrenchOpenDrawTracker compact />
        <FrenchOpenCountryGuides compact title="Popular French Open viewing countries" description="Jump to high-intent country guides from the main Roland Garros hub." />
        <FrenchOpenConversionCluster compact title="All French Open resources" />
        <FrenchOpenStreamingDecision compact />
        <RevenueConversionPanel context="article" tournament="French Open" />

        <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <div className="mb-6">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-zinc-500">
              Quick links
            </p>
            <h2 className="text-3xl font-black">French Open pages</h2>
            <p className="mt-3 max-w-3xl leading-8 text-zinc-400">
              These pages cover the main Roland Garros search intents: live
              matches, results, brackets, TV rights and legal streaming.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {resourceLinks.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-2xl border border-zinc-800 bg-black px-4 py-4 font-bold transition hover:border-orange-400"
              >
                {label} →
              </a>
            ))}
          </div>
        </section>

        <div className="mb-12">
          <EmailSignup
            title="Get French Open schedule reminders"
            description="Get useful tennis schedule reminders, Grand Slam viewing notes and daily catch-up links."
            source="french-open-hub"
            buttonLabel="Send me tennis updates"
            context="French Open hub"
          />
        </div>

        <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-5 text-3xl font-black">French Open FAQ</h2>
          <div className="space-y-4">
            {faq.map((item) => (
              <div key={item.q} className="rounded-2xl bg-zinc-900 p-5">
                <h3 className="mb-2 text-xl font-black">{item.q}</h3>
                <p className="leading-7 text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

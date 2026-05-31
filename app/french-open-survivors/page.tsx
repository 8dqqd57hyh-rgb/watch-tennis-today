import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import EmailSignup from "@/app/components/EmailSignup";
import FrenchOpenConversionCluster from "@/app/components/FrenchOpenConversionCluster";
import FrenchOpenSeoBridge from "@/app/components/FrenchOpenSeoBridge";
import FrenchOpenSurvivorsBoard from "@/app/components/FrenchOpenSurvivorsBoard";
import JsonLd from "@/app/components/JsonLd";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Who Is Still in the French Open? Roland Garros Active Players",
  description:
    "Check who is still active at Roland Garros, who plays next, live French Open players and the latest active ATP/WTA survivor board.",
  alternates: { canonical: "https://watchtennistoday.com/french-open-survivors" },
};

const faq = [
  {
    q: "How does this page decide who is still in the French Open?",
    a: "The board uses remaining live and scheduled Roland Garros singles fixtures. A player appears as active when they still have a live or future main-draw match in the available fixture feed.",
  },
  {
    q: "Why can active-player counts change during the day?",
    a: "Counts can change when matches finish, courts are updated, walkovers happen, or the tournament feed publishes the next round of fixtures.",
  },
  {
    q: "Does this page show unofficial streams?",
    a: "No. Watch Tennis Today does not host or embed tennis streams. It provides schedule, match and official viewing information only.",
  },
];

export default function FrenchOpenSurvivorsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Who Is Still in the French Open?",
      description:
        "Active Roland Garros player tracker with next opponent, live status and ATP/WTA filters.",
      url: "https://watchtennistoday.com/french-open-survivors",
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
          { name: "French Open survivors", url: "https://watchtennistoday.com/french-open-survivors" },
        ]}
      />

      <div className="mx-auto max-w-7xl">
        <section className="mb-10 rounded-[2.5rem] border border-emerald-500/50 bg-gradient-to-br from-emerald-950/50 via-black to-black p-8">
          <div className="mb-5 inline-flex rounded-full bg-emerald-400 px-4 py-2 text-sm font-black text-black">
            Active Roland Garros players
          </div>

          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            Who is still in
            <br />
            the French Open?
          </h1>

          <p className="mb-8 max-w-3xl text-lg leading-8 text-zinc-300">
            Use this Roland Garros survivor board to catch up fast: see active ATP and WTA players, live players, next opponents and who should be on your watchlist today.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/french-open-today"
              className="rounded-2xl bg-emerald-400 px-6 py-4 text-lg font-black text-black transition hover:bg-emerald-300"
            >
              Today’s French Open matches →
            </a>
            <a
              href="/roland-garros-recap"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition hover:border-emerald-400"
            >
              Yesterday’s recap
            </a>
            <a
              href="/french-open-draw"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition hover:border-emerald-400"
            >
              Full draw tracker
            </a>
          </div>
        </section>

        <FrenchOpenSurvivorsBoard />
        <FrenchOpenSeoBridge compact />
        <FrenchOpenConversionCluster compact title="More French Open pages" />
        <RevenueConversionPanel context="article" tournament="French Open" />

        <div className="mb-12">
          <EmailSignup
            title="Get French Open survivor updates"
            description="Get useful match reminders, recap links and official viewing notes while Roland Garros is active."
            source="french-open-survivors"
            buttonLabel="Send me updates"
            context="French Open survivors"
          />
        </div>

        <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-5 text-3xl font-black">French Open survivor FAQ</h2>
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

import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const metadata = {
  title: "Media Kit | Watch Tennis Today",
  description:
    "A concise media kit for Watch Tennis Today: audience intent, sponsorship formats, editorial standards and partnership contact details.",
  alternates: {
    canonical: "https://watchtennistoday.com/media-kit",
  },
};

const audienceIntent = [
  {
    title: "Match-day planners",
    text: "Readers who need a quick answer about live matches, start times, TV windows and legal viewing options.",
  },
  {
    title: "Tournament followers",
    text: "Fans checking Grand Slam pages, draw context, schedules, results and country-specific broadcaster guidance.",
  },
  {
    title: "Learning-focused fans",
    text: "New and returning fans using evergreen guides for scoring, rankings, surfaces, seeds, draws and tennis terms.",
  },
  {
    title: "Player-led readers",
    text: "Users who follow specific ATP and WTA players and need upcoming match context without unsafe stream claims.",
  },
];

const placements = [
  "Clearly labeled display sponsorships on high-intent tennis guide pages",
  "Newsletter sponsorships for opt-in tennis reminders and tournament windows",
  "Affiliate placements where the product genuinely helps with legal viewing or tennis fandom",
  "Editorially separated brand campaigns that do not influence match data, guides or recommendations",
];

const standards = [
  "No illegal stream promotion or stream embedding",
  "Commercial links are labeled and separated from editorial judgment",
  "Pages must remain useful even when a reader does not click a paid link",
  "Broadcaster and schedule claims should be verified against official sources where possible",
];

export default function MediaKitPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Media Kit",
        url: "https://watchtennistoday.com/media-kit",
        description: metadata.description,
        isPartOf: {
          "@type": "WebSite",
          name: "Watch Tennis Today",
          url: "https://watchtennistoday.com",
        },
      },
      {
        "@type": "Organization",
        name: "Watch Tennis Today",
        url: "https://watchtennistoday.com",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "partnerships",
          email: "anzhalika_sokalava@icloud.com",
          url: "https://watchtennistoday.com/contact",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white">
      <JsonLd data={schema} />
      <div className="mx-auto max-w-6xl">
        <nav className="flex flex-wrap gap-2 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Media Kit</span>
        </nav>

        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">Media kit</p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Partner with a tennis site built around real fan intent
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-9 text-zinc-300">
            Watch Tennis Today helps readers find what is happening in tennis, understand the context behind matches and choose legal ways to watch. The best partnerships here are useful, transparent and aligned with tennis fans who are already planning what to follow next.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {audienceIntent.map((item) => (
            <article key={item.title} className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
              <h2 className="text-xl font-black">{item.title}</h2>
              <p className="mt-3 leading-7 text-zinc-300">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">Partnership options</h2>
            <ul className="mt-5 space-y-3 text-zinc-300">
              {placements.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="font-black text-emerald-300">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">Brand safety</h2>
            <ul className="mt-5 space-y-3 text-zinc-300">
              {standards.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="font-black text-emerald-300">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6">
          <h2 className="text-3xl font-black">Partnership contact</h2>
          <p className="mt-3 max-w-3xl leading-8 text-zinc-300">
            For a sponsorship, affiliate or advertising conversation, include the brand name, target country, preferred placement, campaign dates and the page or topic you want to support.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-2xl bg-emerald-300 px-5 py-3 font-black text-black hover:bg-emerald-200">
              Contact the site
            </Link>
            <Link href="/advertise" className="rounded-2xl border border-emerald-800 px-5 py-3 font-black text-emerald-200 hover:border-emerald-300">
              Advertising overview
            </Link>
          </div>
        </section>
      </div>

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "Media Kit", url: "https://watchtennistoday.com/media-kit" },
        ]}
      />
    </main>
  );
}

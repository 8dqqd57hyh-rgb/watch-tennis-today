import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const metadata = {
  title: "Advertise With Watch Tennis Today | Tennis Audience Partnerships",
  description:
    "Partner with Watch Tennis Today to reach tennis fans researching live matches, tournament schedules, legal streaming options and player guides.",
  alternates: {
    canonical: "https://watchtennistoday.com/advertise",
  },
};

const audienceSignals = [
  "Fans checking live and upcoming ATP, WTA and Grand Slam matches",
  "Readers comparing legal streaming options and broadcaster availability",
  "Tennis followers researching players, tournament levels and season context",
  "High-intent users looking for practical match-day guidance before leaving for official providers",
];

const partnershipFormats = [
  {
    title: "Display advertising",
    body: "Standard ad placements can support the site while keeping editorial pages readable and useful. We avoid intrusive layouts that make schedule or guide content difficult to use.",
  },
  {
    title: "Affiliate partnerships",
    body: "Relevant affiliate links may appear on streaming, equipment or tennis-service pages when they are clearly disclosed and genuinely useful for readers.",
  },
  {
    title: "Newsletter sponsorships",
    body: "The tennis newsletter can support low-noise match alerts, Grand Slam reminders and official viewing guidance for readers who opt in.",
  },
  {
    title: "Editorially separated campaigns",
    body: "Commercial partnerships do not control match data, rankings explanations, player guides or legal-viewing principles. Sponsored placements must be clearly labeled.",
  },
];

const brandSafety = [
  "No illegal stream promotion, embeds or piracy links",
  "Clear affiliate and advertising disclosures",
  "Editorial pages remain useful without a commercial click",
  "Corrections and outdated information can be reported through the contact page",
];

export default function AdvertisePage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Advertise With Watch Tennis Today",
        url: "https://watchtennistoday.com/advertise",
        description: metadata.description,
      },
      {
        "@type": "Organization",
        name: "Watch Tennis Today",
        url: "https://watchtennistoday.com",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "advertising and partnerships",
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
          <span className="text-white">Advertise</span>
        </nav>

        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
            Partnerships
          </p>
          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Reach tennis fans when they are actively planning what to watch
          </h1>
          <div className="mt-6 max-w-4xl space-y-5 text-lg leading-9 text-zinc-300">
            <p>
              Watch Tennis Today is built around practical tennis intent: live matches,
              daily schedules, player context, tournament guides and legal viewing options.
              That makes it a natural fit for brands that want to reach tennis fans without
              interrupting the match-day experience.
            </p>
            <p>
              The site is intentionally positioned as an information resource rather than a
              streaming host. We do not embed unauthorized streams, promise illegal access or
              hide commercial relationships. Partnerships should make the reader experience
              better, not weaker.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">Audience fit</h2>
            <ul className="mt-5 space-y-3 text-zinc-300">
              {audienceSignals.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="font-black text-emerald-300">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-3xl font-black">Brand-safety rules</h2>
            <ul className="mt-5 space-y-3 text-zinc-300">
              {brandSafety.map((item) => (
                <li key={item} className="flex gap-3 leading-7">
                  <span className="font-black text-emerald-300">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-3xl font-black">Partnership formats</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {partnershipFormats.map((format) => (
              <article key={format.title} className="rounded-2xl border border-zinc-800 bg-black/40 p-5">
                <h3 className="text-xl font-black">{format.title}</h3>
                <p className="mt-3 leading-8 text-zinc-300">{format.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-emerald-900 bg-emerald-950/30 p-6">
          <h2 className="text-3xl font-black">Request a partnership conversation</h2>
          <p className="mt-3 max-w-3xl leading-8 text-zinc-300">
            For advertising, affiliate or newsletter partnership discussions, use the contact
            page and include your brand, target country, proposed placement and campaign goal.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-2xl bg-emerald-300 px-5 py-3 font-black text-black hover:bg-emerald-200">
              Contact Watch Tennis Today
            </Link>
            <Link href="/affiliate-disclosure" className="rounded-2xl border border-emerald-800 px-5 py-3 font-black text-emerald-200 hover:border-emerald-300">
              Read affiliate disclosure
            </Link>
          </div>
        </section>
      </div>

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://watchtennistoday.com" },
          { name: "Advertise", url: "https://watchtennistoday.com/advertise" },
        ]}
      />
    </main>
  );
}

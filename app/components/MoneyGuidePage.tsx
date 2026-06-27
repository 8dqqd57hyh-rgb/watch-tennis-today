import Link from "next/link";
import EmailSignup from "@/app/components/EmailSignup";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import RelatedWimbledonGuides from "@/app/components/RelatedWimbledonGuides";
import { affiliateLinks } from "@/app/lib/affiliateLinks";

type MoneyGuidePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  eventName: string;
  primaryUseCase: string;
  sections: string[];
  currentPath?: string;
  currentPageName?: string;
};

const sectionGuidance: Record<string, string> = {
  "Official broadcaster check":
    "Start with the tournament website and the recognized broadcaster for your country. Match coverage can differ by court, session and subscription tier, so verify the exact match page before paying.",
  "Schedule and time zones":
    "Tennis start times are often approximate because earlier matches, weather and court changes can move the session. Compare the order of play with your local time zone before setting reminders.",
  "Safe streaming workflow":
    "Use licensed apps, official tournament links and your existing subscription first. Treat mirror sites, forced downloads and fake play buttons as risk signals.",
  "Travel viewing":
    "If you already pay for a service and travel during the event, check the provider terms before relying on a VPN or public Wi-Fi connection.",
  "Subscription decision":
    "Buy for the tournament you need, not for a generic promise of tennis coverage. Grand Slams, ATP and WTA rights often sit in different packages.",
  "Device readiness":
    "Install the provider app, sign in and test playback before the match window. This prevents missed first sets caused by app updates, device limits or location checks.",
};

function getSectionBody(section: string, eventName: string) {
  return sectionGuidance[section] ??
    `Use this step to verify how ${eventName} coverage works for the match you want: tournament source first, local broadcaster second, privacy or travel tools only when they solve a real viewing problem.`;
}

const relatedGuides = [
  { href: "/tennis-schedule-today", label: "Today's tennis schedule" },
  { href: "/live-tennis", label: "Live tennis" },
  { href: "/tennis-tv-broadcast-finder", label: "Broadcast finder" },
  { href: "/watch-tennis-abroad", label: "Watch tennis abroad" },
  { href: "/tennis-spoiler-free-scores", label: "Spoiler-free scores" },
  { href: "/how-we-verify-streams", label: "How we verify streams" },
];


const vpnComparison = [
  {
    name: "NordVPN",
    bestFor: "Travel privacy and fast tennis streaming checks",
    strengths: "Large server network, strong brand trust, simple setup",
    action: "Check NordVPN",
    href: affiliateLinks.nordvpn,
  },
  {
    name: "Official broadcaster app",
    bestFor: "Primary legal match access",
    strengths: "Best source for licensed coverage in your country",
    action: "Find TV options",
    href: "/tv-schedule",
  },
  {
    name: "Tournament site",
    bestFor: "Order of play and last-minute schedule changes",
    strengths: "Most reliable source for courts, start times and delays",
    action: "Check schedule",
    href: "/tennis-schedule-today",
  },
];

const checklist = [
  "Confirm the official broadcaster in your country before match day.",
  "Check whether the event is covered by a TV channel, app, or tournament streaming partner.",
  "Avoid unofficial streams that use misleading buttons, forced downloads, or pop-ups.",
  "If traveling, review your streaming service terms before using a VPN with your own account.",
];

export default function MoneyGuidePage({
  eyebrow,
  title,
  description,
  eventName,
  primaryUseCase,
  sections,
  currentPath,
  currentPageName,
}: MoneyGuidePageProps) {
  const isWimbledonPage = eventName === "Wimbledon" && currentPath && currentPageName;
  const faq = [
    {
      question: `Do I need a VPN to watch ${eventName}?`,
      answer:
        "Not always. Start with the official broadcaster in your country. A VPN is mainly useful for privacy on public Wi-Fi or for accessing your usual legal streaming account while traveling, where allowed by the service terms.",
    },
    {
      question: `What is the safest way to watch ${eventName}?`,
      answer:
        "Use official broadcasters, recognized streaming services, tournament websites, or your existing paid subscription. Avoid pages that claim to offer free live streams but require downloads or suspicious redirects.",
    },
    {
      question: "Can streaming rights change?",
      answer:
        "Yes. Tennis rights can vary by tournament, season, match court and country. Always confirm the final schedule and broadcaster close to match time.",
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
    url: currentPath ? `https://watchtennistoday.com${currentPath}` : undefined,
    about: [
      { "@type": "SportsEvent", name: eventName },
      { "@type": "Thing", name: "Legal tennis streaming" },
      { "@type": "Thing", name: "Travel streaming privacy" },
    ],
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      {isWimbledonPage ? (
        <nav className="mb-6 flex flex-wrap gap-2 text-sm text-neutral-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-emerald-700">Home</Link>
          <span>/</span>
          <Link href="/grand-slams" className="hover:text-emerald-700">Grand Slams</Link>
          <span>/</span>
          <Link href="/wimbledon" className="hover:text-emerald-700">Wimbledon</Link>
          <span>/</span>
          <span>{currentPageName}</span>
        </nav>
      ) : null}

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
        <p className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-700">
          Quick answer
        </p>
        <h2 className="mb-3 text-2xl font-bold text-neutral-950">Best use case for {eventName}</h2>
        <p className="text-base leading-7 text-neutral-700">{primaryUseCase}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={affiliateLinks.nordvpn}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-bold text-black hover:bg-emerald-400"
          >
            Check VPN option
          </a>
          <a
            href="/affiliate-disclosure"
            className="rounded-full border border-emerald-300 px-5 py-3 text-sm font-bold text-neutral-900 hover:bg-white"
          >
            Affiliate disclosure
          </a>
        </div>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <div key={section} className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-bold text-neutral-950">{section}</h2>
            <p className="text-base leading-7 text-neutral-700">
              {getSectionBody(section, eventName)}
            </p>
          </div>
        ))}
      </section>

      <section className="mb-8 rounded-3xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-700">Conversion comparison</p>
            <h2 className="text-2xl font-bold text-neutral-950">Best legal viewing route for {eventName}</h2>
          </div>
          <a href="/affiliate-disclosure" className="text-sm font-bold text-emerald-700 underline-offset-4 hover:underline">
            How affiliate links work
          </a>
        </div>
        <div className="overflow-hidden rounded-2xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-100 text-neutral-700">
              <tr>
                <th className="p-3">Option</th>
                <th className="p-3">Best for</th>
                <th className="p-3">Why consider it</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {vpnComparison.map((option) => (
                <tr key={option.name} className="border-t align-top">
                  <td className="p-3 font-semibold">{option.name}</td>
                  <td className="p-3">{option.bestFor}</td>
                  <td className="p-3 text-neutral-600">{option.strengths}</td>
                  <td className="p-3">
                    <a
                      href={option.href}
                      target={option.href.startsWith("http") ? "_blank" : undefined}
                      rel={option.href.startsWith("http") ? "nofollow sponsored noopener noreferrer" : undefined}
                      className="font-bold text-emerald-700 underline-offset-4 hover:underline"
                    >
                      {option.action}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-6 text-neutral-500">
          This table is intentionally practical: first confirm legal coverage, then consider privacy tools only when they solve a real travel or network-security problem.
        </p>
      </section>

      <section className="mb-8 rounded-3xl border bg-neutral-50 p-6">
        <h2 className="mb-4 text-2xl font-bold text-neutral-950">
          Safety checklist before streaming tennis
        </h2>
        <ul className="space-y-3">
          {checklist.map((item) => (
            <li key={item} className="rounded-2xl border bg-white p-4 text-base leading-7 text-neutral-700">
              <span className="font-bold text-emerald-700">Check:</span> {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8 rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-neutral-950">Related tennis viewing pages</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {relatedGuides.map((guide) => (
            <a
              key={guide.href}
              href={guide.href}
              className="rounded-2xl border bg-neutral-50 p-4 text-sm font-bold text-neutral-900 hover:border-emerald-300 hover:bg-emerald-50"
            >
              {guide.label}
            </a>
          ))}
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

      {isWimbledonPage ? (
        <div className="mt-8">
          <RelatedWimbledonGuides currentPath={currentPath} />
        </div>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([webPageSchema, faqSchema]) }}
      />
      {isWimbledonPage ? (
        <BreadcrumbSchema
          items={[
            { name: "Home", url: "https://watchtennistoday.com" },
            { name: "Grand Slams", url: "https://watchtennistoday.com/grand-slams" },
            { name: "Wimbledon", url: "https://watchtennistoday.com/wimbledon" },
            { name: currentPageName, url: `https://watchtennistoday.com${currentPath}` },
          ]}
        />
      ) : null}
    </main>
  );
}

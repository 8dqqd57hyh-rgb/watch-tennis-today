import { affiliateLinks } from "@/app/lib/affiliateLinks";

type MoneyGuidePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  eventName: string;
  primaryUseCase: string;
  sections: string[];
};

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
}: MoneyGuidePageProps) {
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

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
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
        <h2 className="mb-3 text-2xl font-bold text-neutral-950">
          Best use case
        </h2>
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
              Use this step to compare legal viewing routes, check official schedule changes,
              and decide whether a paid streaming service or your existing account is enough
              before looking at privacy tools for travel.
            </p>
          </div>
        ))}
      </section>

      <section className="mb-8 rounded-3xl border bg-neutral-50 p-6">
        <h2 className="mb-4 text-2xl font-bold text-neutral-950">
          Safety checklist before streaming tennis
        </h2>
        <ul className="space-y-3">
          {checklist.map((item) => (
            <li key={item} className="rounded-2xl border bg-white p-4 text-base leading-7 text-neutral-700">
              <span className="font-bold text-emerald-700">✓</span> {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border bg-white p-6">
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </main>
  );
}

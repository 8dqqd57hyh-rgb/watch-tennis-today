import type { Metadata } from "next";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import { affiliateLinks } from "@/app/lib/affiliateLinks";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "How to Watch Tennis Abroad Safely | Official TV & VPN Guide",
  description:
    "Learn how to watch tennis while traveling abroad using official broadcasters, country TV rights and safe VPN options for your existing subscriptions.",
  alternates: {
    canonical: "https://watchtennistoday.com/watch-tennis-abroad",
  },
  openGraph: {
    title: "How to Watch Tennis Abroad Safely",
    description:
      "Official tennis broadcaster checks, travel streaming tips and VPN guidance for fans watching tennis abroad.",
    url: "https://watchtennistoday.com/watch-tennis-abroad",
    siteName: "Watch Tennis Today",
    type: "article",
  },
};

const countries = [
  { country: "United States", guide: "/watch-tennis-in/usa", broadcasters: "Tennis Channel, ESPN, tournament partners" },
  { country: "United Kingdom", guide: "/watch-tennis-in/uk", broadcasters: "TNT Sports, BBC, Sky Sports, tournament partners" },
  { country: "Poland", guide: "/watch-tennis-in/poland", broadcasters: "Eurosport, Canal+, tournament partners" },
  { country: "Canada", guide: "/watch-tennis-in/canada", broadcasters: "TSN, Sportsnet, tournament partners" },
  { country: "Australia", guide: "/watch-tennis-in/australia", broadcasters: "Nine, Stan Sport, tournament partners" },
];

const faqs = [
  {
    q: "Can I watch my usual tennis subscription abroad?",
    a: "Sometimes. Availability depends on the broadcaster, your subscription terms and the country where you are traveling.",
  },
  {
    q: "Is a VPN useful for tennis streaming while traveling?",
    a: "A VPN can help protect your connection and may help you securely access services you already pay for while traveling, but you should always follow broadcaster rules.",
  },
  {
    q: "Does Watch Tennis Today stream tennis matches?",
    a: "No. Watch Tennis Today does not host live video. The site helps fans find schedules, official broadcasters and legal viewing options.",
  },
];

export default function WatchTennisAbroadPage() {
  return (
    <main className="min-h-screen bg-black px-5 py-10 text-white md:px-10">
      <article className="mx-auto max-w-5xl">
        <a href="/" className="text-sm font-bold text-zinc-400 hover:text-white">
          ← Back to Watch Tennis Today
        </a>

        <header className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-950 p-7 md:p-10">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
            Travel streaming guide
          </p>

          <h1 className="mb-5 text-4xl font-black md:text-6xl">
            How to Watch Tennis Abroad Safely
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-zinc-300">
            Traveling during a Grand Slam, ATP tournament or WTA event? This guide
            helps you check official tennis broadcasters, avoid unsafe streams and
            understand when a VPN may be useful for your existing subscriptions.
          </p>
        </header>

        <RevenueConversionPanel context="article" />

        <section className="my-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-5 text-3xl font-black">Quick checklist before a match starts</h2>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["1", "Identify the event", "Grand Slams, ATP, WTA and team events often use different TV rights."],
              ["2", "Check your country guide", "Start with official broadcasters in your current or home country."],
              ["3", "Avoid illegal streams", "Unsafe streams can be unreliable, full of popups and legally risky."],
            ].map(([step, title, text]) => (
              <div key={step} className="rounded-2xl border border-zinc-800 bg-black p-5">
                <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 font-black text-black">
                  {step}
                </span>
                <h3 className="mb-2 text-xl font-black">{title}</h3>
                <p className="text-sm leading-7 text-zinc-400">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="my-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-5 text-3xl font-black">Country broadcaster starting points</h2>

          <div className="overflow-hidden rounded-2xl border border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900 text-zinc-300">
                <tr>
                  <th className="p-4">Country</th>
                  <th className="p-4">Common tennis coverage</th>
                  <th className="p-4">Guide</th>
                </tr>
              </thead>
              <tbody>
                {countries.map((item) => (
                  <tr key={item.country} className="border-t border-zinc-800">
                    <td className="p-4 font-bold">{item.country}</td>
                    <td className="p-4 text-zinc-400">{item.broadcasters}</td>
                    <td className="p-4">
                      <a href={item.guide} className="font-bold text-emerald-300 hover:text-emerald-200">
                        Open guide →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="my-10 rounded-3xl border border-emerald-500/30 bg-emerald-950/30 p-6">
          <h2 className="mb-3 text-3xl font-black">VPN option for tennis fans abroad</h2>
          <p className="mb-5 max-w-3xl leading-8 text-zinc-300">
            If you already pay for a legal tennis streaming service and are traveling,
            a reputable VPN can help secure your connection on hotel, airport or cafe
            Wi‑Fi. Always follow your broadcaster's terms.
          </p>
          <a
            href={affiliateLinks.nordvpn}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-flex rounded-full bg-emerald-400 px-6 py-3 font-black text-black hover:bg-emerald-300"
          >
            View VPN Deal
          </a>
          <p className="mt-3 text-xs text-zinc-500">
            Affiliate disclosure: we may earn a commission if you buy through this link.
          </p>
        </section>

        <section className="my-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-5 text-3xl font-black">FAQ</h2>
          <div className="space-y-5">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="mb-2 text-xl font-black">{faq.q}</h3>
                <p className="leading-7 text-zinc-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <RelatedMoneyLinks />
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}

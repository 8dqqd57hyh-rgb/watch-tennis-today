import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { comparisons } from "@/data/comparisons";
import VpnPromo from "@/app/components/VpnPromo";
import StreamingLinksGrid from "@/app/components/StreamingLinksGrid";
import AdSlot from "@/app/components/AdSlot";
import { shouldIndexGeneratedPage } from "@/app/lib/adsenseIndexing";

export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

 const comparison = comparisons.find(
  (item) => item.slug === slug
);

  if (!comparison) {
    return {
      title: "Comparison Not Found | Watch Tennis Today",
      robots: { index: false, follow: true },
    };
  }

  const indexable = shouldIndexGeneratedPage({
    title: comparison.title,
    description: comparison.description,
    editorialText: [comparison.description, comparison.bestForLeft, comparison.bestForRight, comparison.verdict, comparison.audience].join(" "),
    meaningfulItems: 2,
  });

  return {
    title: `${comparison.title} | Best Tennis Streaming Comparison`,
    description: comparison.description,
    // AdSense quality: comparison detail pages are affiliate/templated helpers, so
    // they stay crawlable but noindexed unless expanded into substantial editorial pages.
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    alternates: {
      canonical: `https://watchtennistoday.com/compare/${slug}`,
    },
    openGraph: {
      title: comparison.title,
      description: comparison.description,
      url: `https://watchtennistoday.com/compare/${slug}`,
      siteName: "Watch Tennis Today",
      type: "website",
    },
  };
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params;

  const comparison = comparisons.find(
    (item) => item.slug === slug
  );

  if (!comparison) {
    notFound();
  }

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Which service is better for watching tennis?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "It depends on your country, the tournament you want to watch and which broadcaster owns the local rights.",
      },
    },
    {
      "@type": "Question",
      name: "Can I watch Grand Slam tennis with these services?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Grand Slam coverage is usually separate from regular ATP and WTA coverage, so availability depends on your region.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a VPN for tennis streaming?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "You do not need a VPN at home if your chosen service works in your country. A VPN is mainly useful when traveling and accessing your usual subscriptions abroad.",
      },
    },
  ],
};

  const relatedComparisons = comparisons.filter(
    (item) => item.slug !== comparison.slug
  );

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
        <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(faqSchema),
  }}
/>
      <div className="mx-auto max-w-5xl">
        <Link href="/compare" className="text-zinc-400 hover:text-white">
          ← Back to comparisons
        </Link>

        <section className="mt-8 mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-green-400">
            Tennis streaming comparison
          </p>

          <h1 className="mb-6 text-4xl font-black md:text-6xl">
            {comparison.title}
          </h1>

          <p className="max-w-4xl text-lg leading-8 text-zinc-300">
            {comparison.description} Use this guide to compare tennis coverage,
            device support, travel access and streaming options before choosing
            the best service for watching ATP, WTA and Grand Slam tennis.
          </p>
        </section>

        <section className="mb-8 rounded-3xl border border-emerald-500/30 bg-emerald-950/30 p-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-300">
            Recommended for tennis fans
          </p>

          <h2 className="mb-3 text-2xl font-black text-white">
            Watching tennis while traveling?
          </h2>

          <p className="mb-5 leading-7 text-zinc-300">
            Some tennis streams are limited by broadcast region. A VPN can help
            you safely access your usual legal streaming accounts while abroad.
          </p>

          <a
            href="https://go.nordvpn.net/aff_c?offer_id=15&aff_id=148020&url_id=902"
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-flex rounded-full bg-emerald-400 px-6 py-3 text-sm font-black text-black hover:bg-emerald-300"
          >
            Try NordVPN for tennis streaming
          </a>
        </section>

        <section className="mb-8 overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-5 text-3xl font-black">
            Quick Comparison
          </h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="pb-4 pr-6 text-green-400">Feature</th>
                <th className="pb-4 pr-6">{comparison.left}</th>
                <th className="pb-4">{comparison.right}</th>
              </tr>
            </thead>

            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-4 pr-6 font-bold">Tennis coverage</td>
                <td className="py-4 pr-6">Good for selected tournaments</td>
                <td className="py-4">Depends on region and rights</td>
              </tr>

              <tr className="border-b border-zinc-800">
                <td className="py-4 pr-6 font-bold">Best use case</td>
                <td className="py-4 pr-6">Regular tennis viewers</td>
                <td className="py-4">Country-specific broadcasts</td>
              </tr>

              <tr className="border-b border-zinc-800">
                <td className="py-4 pr-6 font-bold">Streaming access</td>
                <td className="py-4 pr-6">Online streaming available</td>
                <td className="py-4">Region dependent</td>
              </tr>

              <tr>
                <td className="py-4 pr-6 font-bold">Devices</td>
                <td className="py-4 pr-6">Mobile, TV, desktop</td>
                <td className="py-4">Mobile, TV, desktop</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
  <h2 className="mb-5 text-3xl font-black">
    Which One Is Better for Tennis?
  </h2>

  <div className="grid gap-4 md:grid-cols-2">
    <div className="rounded-2xl border border-zinc-800 bg-black p-5">
      <h3 className="mb-3 text-xl font-black">
        {comparison.left}
      </h3>

      <p className="text-zinc-300">
        {comparison.bestForLeft}
      </p>
    </div>

    <div className="rounded-2xl border border-zinc-800 bg-black p-5">
      <h3 className="mb-3 text-xl font-black">
        {comparison.right}
      </h3>

      <p className="text-zinc-300">
        {comparison.bestForRight}
      </p>
    </div>
  </div>

  <div className="mt-6 rounded-2xl border border-green-500/40 bg-black p-5">
    <h3 className="mb-3 text-xl font-black text-green-400">
      Verdict
    </h3>

    <p className="leading-8 text-zinc-300">
      {comparison.verdict}
    </p>
  </div>
</section>

        <section className="mb-8 rounded-3xl border border-green-500/30 bg-green-950/20 p-6">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-green-300">
            Best next step
          </p>
          <h2 className="mb-3 text-3xl font-black text-white">
            What should you check next?
          </h2>
          <p className="mb-5 max-w-3xl leading-8 text-zinc-300">
            For {comparison.title}, the safest choice is to verify the broadcaster
            for your country and tournament before paying for a subscription.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <Link
              href={comparison.primaryCta.href}
              className="rounded-2xl bg-green-400 px-5 py-4 text-center font-black text-black hover:bg-green-300"
            >
              {comparison.primaryCta.label} →
            </Link>

            {comparison.secondaryCta ? (
              <Link
                href={comparison.secondaryCta.href}
                className="rounded-2xl border border-zinc-700 bg-black px-5 py-4 text-center font-black text-white hover:border-green-400"
              >
                {comparison.secondaryCta.label}
              </Link>
            ) : null}
          </div>
        </section>

        <VpnPromo />

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-5 text-3xl font-black">
            Official Tennis Streaming Options
          </h2>

          <p className="mb-6 leading-8 text-zinc-300">
            Tennis rights change by country and tournament. Always check the
            official broadcaster in your region before subscribing.
          </p>

          <StreamingLinksGrid />
        </section>

        <section className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-5 text-3xl font-black">
            Related Tennis Comparisons
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {relatedComparisons.map((item) => (
              <Link
                key={item.slug}
                href={`/compare/${item.slug}`}
                className="rounded-2xl border border-zinc-800 bg-black p-5 hover:border-green-500"
              >
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-5 text-3xl font-black">
            {comparison.title} FAQ
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-xl font-black">
                Which service is better for watching tennis?
              </h3>
              <p className="leading-7 text-zinc-400">
                It depends on your country, the tournament you want to watch and
                which broadcaster owns the local rights.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-black">
                Can I watch Grand Slam tennis with these services?
              </h3>
              <p className="leading-7 text-zinc-400">
                Grand Slam coverage is usually separate from regular ATP and WTA
                coverage, so availability depends on your region.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-xl font-black">
                Do I need a VPN for tennis streaming?
              </h3>
              <p className="leading-7 text-zinc-400">
                You do not need a VPN at home if your chosen service works in
                your country. A VPN is mainly useful when traveling and accessing
                your usual subscriptions abroad.
              </p>
            </div>
          </div>
        </section>

        <AdSlot label="Advertisement" />
      </div>
    </main>
  );
}

import Link from "next/link";
import { comparisons } from "@/data/comparisons";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Compare Tennis Streaming Options | Watch Tennis Today",
  description:
    "Compare legal tennis streaming options, TV broadcasters, tournament coverage and country-specific viewing choices.",
  // AdSense quality: the comparison hub links to templated affiliate/comparison
  // helpers. Keep it crawlable for users/internal links, but noindex it for
  // approval review so it cannot be treated as low-originality generated SEO.
  robots: { index: false, follow: true },
  alternates: {
    canonical: "https://watchtennistoday.com/compare",
  },
};

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </Link>

        <section className="mt-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-green-400">
            Tennis streaming comparisons
          </p>
          <h1 className="text-4xl font-black md:text-6xl">
            Compare Tennis Streaming Options
          </h1>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-zinc-300">
            Tennis coverage depends on your country, tournament and subscription access.
            Use these legal, practical comparisons to choose the right broadcaster,
            streaming service or travel setup before match time.
          </p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {comparisons.map((comparison) => (
            <Link
              key={comparison.slug}
              href={`/compare/${comparison.slug}`}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-green-500 hover:bg-zinc-900"
            >
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-500">
                {comparison.left} vs {comparison.right}
              </p>
              <h2 className="mb-3 text-2xl font-black text-white">
                {comparison.title}
              </h2>
              <p className="leading-7 text-zinc-400">{comparison.description}</p>
              <p className="mt-5 rounded-2xl border border-zinc-800 bg-black p-4 text-sm leading-6 text-zinc-300">
                Best for: {comparison.audience}
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-10 overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-5 text-3xl font-black text-white">
            Quick decision table
          </h2>

          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-zinc-800 text-sm text-zinc-400">
                <th className="pb-4 pr-6">Comparison</th>
                <th className="pb-4 pr-6">Best use case</th>
                <th className="pb-4">Next step</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {comparisons.map((comparison) => (
                <tr key={comparison.slug}>
                  <td className="py-4 pr-6 font-bold text-white">
                    <Link href={`/compare/${comparison.slug}`} className="hover:text-green-400">
                      {comparison.title}
                    </Link>
                  </td>
                  <td className="py-4 pr-6">{comparison.audience}</td>
                  <td className="py-4">
                    <Link
                      href={comparison.primaryCta.href}
                      className="font-bold text-green-400 hover:text-green-300"
                    >
                      {comparison.primaryCta.label} →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <RevenueConversionPanel context="article" />

        <section className="mt-10 space-y-5 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-300">
          <h2 className="text-3xl font-black text-white">
            How to choose without overpaying
          </h2>

          <p className="leading-8">
            Start with the tournament you want to watch. Grand Slam events,
            ATP tournaments and WTA tournaments may be shown by different
            broadcasters even in the same country.
          </p>

          <p className="leading-8">
            Then check whether you need live coverage, full replays, highlights
            or only scores. Some platforms are useful for live video, while
            others are better for schedules and match results.
          </p>

          <p className="leading-8">
            Unofficial streaming sites often have unreliable video quality,
            misleading pop-ups and unsafe redirects. Official broadcasters are
            more stable and usually provide better commentary, replays and
            tournament coverage.
          </p>
        </section>
      </div>
    </main>
  );
}

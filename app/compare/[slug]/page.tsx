import { notFound } from "next/navigation";
import { comparisons } from "@/data/comparisons";
import VpnPromo from "@/app/components/VpnPromo";
import StreamingLinksGrid from "@/app/components/StreamingLinksGrid";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props) {
  const { slug } = await params;

  const comparison = comparisons.find(
    (item) => item.slug === slug
  );

  if (!comparison) {
    return {
      title: "Comparison Not Found",
    };
  }

  return {
    title: `${comparison.title} | Watch Tennis Today`,
    description: comparison.description,
  };
}

export default async function ComparePage({
  params,
}: Props) {
  const { slug } = await params;

  const comparison = comparisons.find(
    (item) => item.slug === slug
  );

  if (!comparison) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <a
          href="/compare"
          className="text-zinc-400 hover:text-white"
        >
          ← Back
        </a>

        <h1 className="text-5xl font-black mt-8 mb-6">
          ⚔️ {comparison.title}
        </h1>

        <p className="text-zinc-300 text-lg leading-8 mb-10">
          {comparison.description}
        </p>

        <section className="mb-8 rounded-3xl border border-emerald-500/30 bg-emerald-950/30 p-6">
  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-300">
    Recommended for tennis fans
  </p>

  <h2 className="mb-3 text-2xl font-black text-white">
    Watch tennis safely while traveling
  </h2>

  <p className="mb-5 text-zinc-300 leading-7">
    If a tennis stream is unavailable in your region, a VPN can help you access
    your usual streaming services when abroad.
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

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="pb-4 pr-6 text-green-400">
                  Feature
                </th>

                <th className="pb-4 pr-6">
                  {comparison.left}
                </th>

                <th className="pb-4">
                  {comparison.right}
                </th>
              </tr>
            </thead>

            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-4 pr-6 font-bold">
                  Tennis Coverage
                </td>

                <td className="py-4 pr-6">
                  Good
                </td>

                <td className="py-4">
                  Good
                </td>
              </tr>

              <tr className="border-b border-zinc-800">
                <td className="py-4 pr-6 font-bold">
                  Streaming Access
                </td>

                <td className="py-4 pr-6">
                  Available
                </td>

                <td className="py-4">
                  Region dependent
                </td>
              </tr>

              <tr>
                <td className="py-4 pr-6 font-bold">
                  Devices
                </td>

                <td className="py-4 pr-6">
                  Mobile, TV, Desktop
                </td>

                <td className="py-4">
                  Mobile, TV, Desktop
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <VpnPromo />

        <StreamingLinksGrid />
      </div>
    </main>
  );
}
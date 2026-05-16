import { notFound } from "next/navigation";
import { comparisons } from "@/app/data/comparisons";
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
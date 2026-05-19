import { comparisons } from "@/data/comparisons";

export const metadata = {
  title: "Tennis Streaming Comparisons | Watch Tennis Today",
  description:
    "Compare tennis streaming services, VPNs and TV platforms for ATP, WTA and Grand Slam coverage.",
};

export default function CompareHubPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <a
          href="/"
          className="text-zinc-400 hover:text-white"
        >
          ← Back
        </a>

        <h1 className="text-5xl font-black mt-8 mb-6">
          ⚔️ Tennis Streaming Comparisons
        </h1>

        <p className="text-zinc-300 text-lg leading-8 mb-10">
          Compare tennis streaming platforms, VPNs and
          broadcasters for ATP, WTA and Grand Slam coverage.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {comparisons.map((comparison) => (
            <a
              key={comparison.slug}
href={`/compare/${comparison.slug}`}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-green-500 transition-all"
            >
              <h2 className="text-2xl font-black mb-3">
                {comparison.title}
              </h2>

              <p className="text-zinc-400 leading-7">
                {comparison.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

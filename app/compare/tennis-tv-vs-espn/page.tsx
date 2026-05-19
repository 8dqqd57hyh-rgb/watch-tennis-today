import VpnPromo from "@/app/components/VpnPromo";
import StreamingLinksGrid from "@/app/components/StreamingLinksGrid";

export const metadata = {
  title: "Tennis TV vs ESPN+ | Which Is Better for Tennis?",
  description:
    "Compare Tennis TV vs ESPN+ for ATP, WTA and Grand Slam streaming, pricing, coverage and supported devices.",
};

export default function TennisTvVsEspnPage() {
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
          🎾 Tennis TV vs ESPN+
        </h1>

        <p className="text-zinc-300 text-lg leading-8 mb-10">
          Compare Tennis TV and ESPN+ for tennis streaming,
          ATP coverage, Grand Slams, supported devices and
          international availability.
        </p>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="pb-4 pr-6 text-green-400">
                  Feature
                </th>

                <th className="pb-4 pr-6">
                  Tennis TV
                </th>

                <th className="pb-4">
                  ESPN+
                </th>
              </tr>
            </thead>

            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-800">
                <td className="py-4 pr-6 font-bold">
                  ATP Coverage
                </td>

                <td className="py-4 pr-6">
                  Excellent
                </td>

                <td className="py-4">
                  Partial
                </td>
              </tr>

              <tr className="border-b border-zinc-800">
                <td className="py-4 pr-6 font-bold">
                  WTA Coverage
                </td>

                <td className="py-4 pr-6">
                  Limited
                </td>

                <td className="py-4">
                  Good
                </td>
              </tr>

              <tr className="border-b border-zinc-800">
                <td className="py-4 pr-6 font-bold">
                  Grand Slams
                </td>

                <td className="py-4 pr-6">
                  No
                </td>

                <td className="py-4">
                  Some tournaments
                </td>
              </tr>

              <tr>
                <td className="py-4 pr-6 font-bold">
                  International Access
                </td>

                <td className="py-4 pr-6">
                  Strong
                </td>

                <td className="py-4">
                  Region dependent
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <VpnPromo
          title="Traveling while watching tennis?"
          text="Streaming availability may vary depending on your country and broadcaster rights."
        />

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-5">
            Which is better?
          </h2>

          <p className="text-zinc-300 leading-8">
            Tennis TV is often preferred for ATP-focused fans,
            while ESPN+ may offer broader sports coverage and
            selected tennis tournaments depending on region.
          </p>
        </section>

        <StreamingLinksGrid />
      </div>
    </main>
  );
}

import { affiliateLinks } from "@/lib/affiliate";

export const metadata = {
  title: "Best VPN for Tennis Streaming | Watch Tennis While Traveling",
  description:
    "Find the best VPN for watching tennis streams while traveling.",
};

export default function BestVpnForTennisStreamingPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <a
          href="/"
          className="inline-block mb-8 text-green-400 font-bold hover:text-green-300"
        >
          ← Back to Watch Tennis Today
        </a>

        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
          Best VPN for Tennis Streaming
        </h1>

        <p className="text-zinc-300 text-lg leading-8 mb-8">
          Tennis fans often travel, live abroad or follow tournaments from
          different countries. A VPN can help you access your usual tennis
          streaming services securely while away from home.
        </p>

        <section className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 mb-10">
          <h2 className="text-3xl font-black mb-4">
            Our pick: NordVPN
          </h2>

          <p className="text-zinc-300 leading-8 mb-6">
            NordVPN is a popular VPN option for sports fans who want a secure
            connection while watching tennis online.
          </p>

          <a
            href={affiliateLinks.nordvpn}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-block bg-green-500 text-black font-black px-6 py-4 rounded-2xl hover:bg-green-400 transition-all"
          >
            Try NordVPN
          </a>

          <p className="text-zinc-500 text-sm mt-5">
            Affiliate disclosure: we may earn a commission if you purchase
            through links on this page.
          </p>
        </section>

        <section className="space-y-8 text-zinc-300 leading-8">
          <div>
            <h2 className="text-3xl text-white font-black mb-3">
              Why use a VPN for tennis streaming?
            </h2>

            <p>
              Tennis broadcasting rights vary by country. A VPN may help when
              you are traveling and want to use your normal streaming account.
            </p>
          </div>

          <div>
            <h2 className="text-3xl text-white font-black mb-3">
              When is a VPN useful?
            </h2>

            <ul className="list-disc pl-6 space-y-3">
              <li>When you are abroad.</li>
              <li>When public Wi-Fi is the only option.</li>
              <li>When broadcasters differ by country.</li>
            </ul>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
            <h2 className="text-3xl text-white font-black mb-4">
              Start watching tennis securely
            </h2>

            <p className="mb-6">
              NordVPN can be useful while traveling and following live tennis.
            </p>

            <a
              href={affiliateLinks.nordvpn}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="inline-block bg-green-500 text-black font-black px-6 py-4 rounded-2xl hover:bg-green-400 transition-all"
            >
              Get NordVPN
            </a>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
            <h2 className="text-3xl text-white font-black mb-4">
              More tennis streaming guides
            </h2>

            <a
              href="/how-to-watch-tennis-safely-abroad"
              className="inline-block rounded-2xl border border-zinc-700 px-6 py-4 font-bold hover:border-green-500 hover:text-green-400 transition-all"
            >
              How to Watch Tennis Safely Abroad
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
import { affiliateLinks } from "@/app/lib/affiliateLinks";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Watch French Open Online 2026 | Roland Garros Streaming Guide",
  description:
    "Watch French Open online with official Roland Garros streaming options, TV channels, country guides, schedules and live match pages.",
};

export default function WatchFrenchOpenOnlinePage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <section className="mb-12 rounded-[2.5rem] border border-orange-500 bg-gradient-to-br from-orange-950/40 to-black p-8">
          <div className="mb-5 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-black">
            🎾 WATCH ONLINE
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Watch French Open
            <br />
            Online
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-zinc-300 mb-8">
            Find ways to watch French Open online, including official Roland
            Garros broadcasters, streaming services, TV channels and country
            viewing guides.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/french-open"
              className="rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-black hover:bg-orange-400 transition-all"
            >
              Live French Open Matches →
            </a>

            <a
              href="/french-open"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-orange-500 transition-all"
            >
              Live Stream Guide
            </a>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-4xl font-black mb-6">
            📺 Ways to Watch French Open Online
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[
              [
                "Official broadcasters",
                "Use your local official Roland Garros broadcaster where available.",
              ],
              [
                "Sports streaming platforms",
                "Some countries offer French Open coverage through paid sports streaming services.",
              ],
              [
                "TV provider login",
                "In some regions, you may be able to stream matches with a TV provider account.",
              ],
              [
                "Country guides",
                "Streaming access depends on your location and broadcast rights.",
              ],
              [
                "Daily match pages",
                "Check match pages for live status, score, start time and watch options.",
              ],
              [
                "Travel access",
                "When traveling, your usual tennis streaming service may have regional restrictions.",
              ],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6"
              >
                <h3 className="text-2xl font-black mb-3">{title}</h3>

                <p className="text-zinc-400 leading-7">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 rounded-[2rem] border border-green-500/40 bg-zinc-900 p-8">
          <h2 className="text-3xl font-black mb-5">🌍 Watching French Open abroad?</h2>

          <p className="max-w-3xl text-zinc-300 leading-8 mb-6">
            French Open online streams can change by country. If you are
            traveling, a VPN can help you access your usual tennis streaming
            services more securely.
          </p>

          <a
            href={affiliateLinks.nordvpn}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="inline-flex rounded-2xl bg-green-500 px-6 py-4 font-black text-black hover:bg-green-400 transition-all"
          >
            Try NordVPN →
          </a>

          <p className="mt-4 text-sm text-zinc-500">
            Affiliate disclosure: we may earn a commission from links on this page.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-black mb-5">🔗 More Roland Garros guides</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ["French Open Live", "/french-open"],
              ["French Open Today", "/french-open"],
              ["TV Schedule", "/where-to-watch-french-open"],
              ["Where to Watch", "/where-to-watch-french-open"],
              ["Order of Play", "/french-open-order-of-play"],
              ["Streaming Countries", "/where-to-watch-french-open"],
            ].map(([title, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 hover:border-orange-500 transition-all"
              >
                <h3 className="text-xl font-black">{title}</h3>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-8">
          <h2 className="text-3xl font-black mb-5">About watching French Open online</h2>

          <div className="space-y-5 text-zinc-300 leading-8 max-w-4xl">
            <p>
              The French Open, also known as Roland Garros, is one of tennis’s
              four Grand Slam tournaments. Online viewing options depend on
              official broadcast rights in each country.
            </p>

            <p>
              Watch Tennis Today helps fans find French Open live match pages,
              TV schedules, streaming guides and country-based viewing
              information in one place.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

import { affiliateLinks } from "@/app/lib/affiliateLinks";
import VpnPromo from "@/app/components/VpnPromo";

export const metadata = {
  title: "French Open Live Stream 2026 | Watch Roland Garros Online",
  description:
    "Find French Open live stream options for Roland Garros 2026. Watch tennis online with TV channels, streaming platforms and country-based viewing guides.",
};

export default function FrenchOpenLiveStreamPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <section className="mb-12 rounded-[2.5rem] border border-orange-500 bg-gradient-to-br from-orange-950/40 to-black p-8">
          <div className="mb-5 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-black">
            🎾 ROLAND GARROS STREAMING
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            French Open Live Stream:
            <br />
            Watch Roland Garros Online
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-zinc-300 mb-8">
            Find French Open live stream options, official broadcasters, TV
            channels and country-based ways to watch Roland Garros tennis online.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/french-open-live"
              className="rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-black hover:bg-orange-400 transition-all"
            >
              Live Matches →
            </a>

            <a
              href="/where-to-watch-french-open"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-orange-500 transition-all"
            >
              Where to Watch
            </a>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-4xl font-black mb-6">
            📺 French Open Streaming Options
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[
              ["Official TV broadcasters", "Check your local Roland Garros TV rights holder."],
              ["Sports streaming services", "Some countries offer French Open coverage through sports streaming platforms."],
              ["Grand Slam coverage", "Roland Garros matches may be shown across main courts, outside courts and highlight packages."],
              ["Country-based access", "Availability depends on your location and broadcast rights."],
              ["Travel viewing", "If you travel abroad, your usual stream may not be available."],
              ["Match pages", "Use live match pages to find current schedule and watch information."],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6"
              >
                <h3 className="text-2xl font-black mb-3">
                  {title}
                </h3>

                <p className="text-zinc-400 leading-7">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <VpnPromo
          title="Watching French Open streams?"
          text="French Open streaming availability varies by country. Use a VPN to access your subscriptions securely while traveling."
        />

        <section className="mb-12">
          <h2 className="text-3xl font-black mb-5">
            🔗 French Open quick links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ["French Open Today", "/french-open-today"],
              ["TV Schedule", "/french-open-tv-schedule"],
              ["Streaming Countries", "/french-open-streaming-countries"],
              ["Order of Play", "/french-open-order-of-play"],
              ["Results", "/french-open-results"],
              ["Draw", "/french-open-draw"],
            ].map(([title, href]) => (
              <a
                key={href}
                href={href}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5 hover:border-orange-500 transition-all"
              >
                <h3 className="text-xl font-black">
                  {title}
                </h3>
              </a>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-8">
          <h2 className="text-3xl font-black mb-5">
            About French Open live streaming
          </h2>

          <div className="space-y-5 text-zinc-300 leading-8 max-w-4xl">
            <p>
              French Open live streaming availability depends on official
              broadcast rights in each country. Tennis fans should check their
              local TV channels, sports streaming services and official Roland
              Garros coverage options.
            </p>

            <p>
              Watch Tennis Today helps fans find Roland Garros match pages,
              schedules, streaming guides and country-based viewing information
              in one place.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
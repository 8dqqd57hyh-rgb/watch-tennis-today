import AuthorBox from "@/app/components/AuthorBox";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";

export const metadata = {
  title: "French Open Schedule Today | Order of Play & Live Matches",
  description:
    "French Open schedule today, Roland Garros order of play, live matches, TV schedule and official streaming guide.",
  alternates: {
    canonical: "https://watchtennistoday.com/french-open-schedule",
  },
};

export default function FrenchOpenSchedulePage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <article className="mt-8 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
          <p className="text-green-400 font-black mb-4">
            Roland Garros Schedule
          </p>

          <h1 className="text-5xl font-black leading-tight mb-6">
            French Open Schedule Today
          </h1>

          <p className="text-zinc-300 text-lg leading-8 mb-8">
            Check the French Open schedule, Roland Garros order of play, live
            tennis matches, TV coverage and official streaming options.
          </p>

          <section className="bg-black border border-zinc-800 rounded-3xl p-6 mb-8">
            <h2 className="text-3xl font-black mb-4">
              Today’s French Open matches
            </h2>

            <p className="text-zinc-300 leading-8 mb-5">
              French Open match times can change because of weather, court
              delays, long matches or tournament scheduling updates. Always
              confirm the official order of play before the match starts.
            </p>

            <a
              href="/live-tennis"
              className="inline-block bg-green-500 text-black px-6 py-4 rounded-2xl font-black hover:bg-green-400 transition-all"
            >
              View Live Tennis Today
            </a>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-black mb-4">
              Roland Garros order of play
            </h2>

            <p className="text-zinc-300 leading-8">
              The Roland Garros order of play usually includes matches across
              men’s singles, women’s singles, doubles and other events. Main
              courts often feature top ATP and WTA players, while outside courts
              may include early-round matches and doubles.
            </p>
          </section>

          <section className="mb-10 rounded-3xl border border-zinc-800 bg-black p-6">
            <h2 className="text-3xl font-black mb-4">
              How to watch the French Open
            </h2>

            <p className="text-zinc-300 leading-8 mb-6">
              French Open coverage depends on your country and broadcaster
              rights. Use official TV channels, tournament partners and legal
              streaming services to watch Roland Garros matches.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="/french-open-live-stream"
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-bold hover:border-green-500 transition-all"
              >
                French Open Live Stream
              </a>

              <a
                href="/how-to-watch-french-open-in-usa"
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-bold hover:border-green-500 transition-all"
              >
                Watch French Open in USA
              </a>

              <a
                href="/best-vpn-for-tennis-streaming"
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-bold hover:border-green-500 transition-all"
              >
                Best VPN for Tennis
              </a>

              <a
                href="/grand-slam-live"
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-bold hover:border-green-500 transition-all"
              >
                Grand Slam Live
              </a>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl font-black mb-4">
              Top players to follow
            </h2>

            <div className="flex flex-wrap gap-3">
              {[
                ["Jannik Sinner", "/watch-player-live/jannik-sinner"],
                ["Carlos Alcaraz", "/watch-player-live/carlos-alcaraz"],
                ["Novak Djokovic", "/watch-player-live/novak-djokovic"],
                ["Iga Swiatek", "/watch-player-live/iga-swiatek"],
                ["Aryna Sabalenka", "/watch-player-live/aryna-sabalenka"],
                ["Coco Gauff", "/watch-player-live/coco-gauff"],
              ].map(([name, href]) => (
                <a
                  key={href}
                  href={href}
                  className="bg-black border border-zinc-800 rounded-2xl px-5 py-3 font-bold hover:border-green-500 hover:text-green-400 transition-all"
                >
                  {name}
                </a>
              ))}
            </div>
          </section>

          <section className="mb-10 bg-black border border-zinc-800 rounded-3xl p-6">
            <h2 className="text-3xl font-black mb-6">
              French Open Schedule FAQ
            </h2>

            <div className="space-y-6 text-zinc-300 leading-8">
              <div>
                <h3 className="text-xl text-white font-black mb-2">
                  Where can I find the French Open schedule today?
                </h3>
                <p>
                  You can check the official Roland Garros order of play, live
                  tennis schedules and broadcaster listings before each match.
                </p>
              </div>

              <div>
                <h3 className="text-xl text-white font-black mb-2">
                  Can French Open match times change?
                </h3>
                <p>
                  Yes. Tennis match times can change because of weather delays,
                  long previous matches, court changes or tournament scheduling
                  updates.
                </p>
              </div>

              <div>
                <h3 className="text-xl text-white font-black mb-2">
                  Where can I watch French Open matches online?
                </h3>
                <p>
                  French Open streaming depends on your country. Use official
                  broadcasters, tournament partners and legal streaming services.
                </p>
              </div>
            </div>
          </section>

          <AuthorBox />
        </article>
      </div>

      <BreadcrumbSchema
        items={[
          {
            name: "Home",
            url: "https://watchtennistoday.com",
          },
          {
            name: "French Open Schedule",
            url: "https://watchtennistoday.com/french-open-schedule",
          },
        ]}
      />
    </main>
  );
}

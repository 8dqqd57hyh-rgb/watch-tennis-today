export const metadata = {
  title:
    "French Open Live Stream & TV Schedule | Watch Tennis Today",

  description:
    "Find where to watch the French Open live online. Check official broadcasters, TV channels, streaming options and tennis schedule information.",
};

export default function FrenchOpenLiveStreamPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <h1 className="text-5xl font-black mt-8 mb-5">
          🎾 French Open Live Stream
        </h1>

        <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
          Find where to watch the French Open live online with official
          broadcasters, TV channels and legal streaming options. Follow
          Roland Garros tennis matches, ATP and WTA schedules, and Grand Slam
          coverage information.
        </p>

        <section className="bg-gradient-to-br from-orange-500 to-red-500 text-black rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-3">
            🏆 French Open / Roland Garros
          </h2>

          <p className="font-semibold">
            The French Open is one of the four Grand Slam tennis tournaments
            and is played on clay courts at Roland Garros in Paris.
          </p>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-4">
            📺 Where to watch the French Open
          </h2>

          <div className="space-y-4">
            <div className="bg-black rounded-2xl p-5 border border-zinc-800">
              <h3 className="text-2xl font-black mb-2">
                Eurosport
              </h3>
              <p className="text-zinc-400">
                Provides Grand Slam tennis coverage in many European regions.
              </p>
            </div>

            <div className="bg-black rounded-2xl p-5 border border-zinc-800">
              <h3 className="text-2xl font-black mb-2">
                France TV
              </h3>
              <p className="text-zinc-400">
                Official French Open broadcaster in France.
              </p>
            </div>

            <div className="bg-black rounded-2xl p-5 border border-zinc-800">
              <h3 className="text-2xl font-black mb-2">
                Tennis Channel
              </h3>
              <p className="text-zinc-400">
                French Open coverage may be available in selected regions.
              </p>
            </div>

            <div className="bg-black rounded-2xl p-5 border border-zinc-800">
              <h3 className="text-2xl font-black mb-2">
                ESPN / regional sports networks
              </h3>
              <p className="text-zinc-400">
                Availability depends on your country and broadcast rights.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-4">
            🌍 Watch by country
          </h2>

          <p className="text-zinc-400 mb-5">
            Tennis streaming rights vary by country. Check your local tennis
            broadcasters and official streaming options.
          </p>

          <div className="flex flex-wrap gap-3">
            {[
              "poland",
              "uk",
              "usa",
              "germany",
              "france",
              "spain",
              "italy",
              "canada",
              "australia",
              "india",
            ].map((country) => (
              <a
                key={country}
                href={`/watch-tennis-in/${country}`}
                className="bg-black border border-zinc-800 rounded-2xl px-5 py-3 font-bold hover:border-green-500 hover:text-green-400 transition-all"
              >
                {country.charAt(0).toUpperCase() + country.slice(1)}
              </a>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-green-500 to-lime-400 text-black rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-3">
            🔴 Live Tennis Today
          </h2>

          <p className="font-semibold mb-5">
            Check today&apos;s live tennis matches, scores and official
            streaming information.
          </p>

          <a
            href="/live-tennis"
            className="inline-block bg-black text-white px-5 py-3 rounded-2xl font-black"
          >
            View Live Tennis
          </a>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-4">
            FAQ
          </h2>

          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold mb-2">
                Where can I watch the French Open live?
              </h3>
              <p className="text-zinc-400">
                The French Open is available through official broadcasters and
                streaming services depending on your country. Common options
                include Eurosport, France TV, Tennis Channel and local sports
                networks.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">
                Is Roland Garros the same as the French Open?
              </h3>
              <p className="text-zinc-400">
                Yes. Roland Garros is the venue and commonly used name for the
                French Open Grand Slam tournament in Paris.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">
                Does Watch Tennis Today stream matches?
              </h3>
              <p className="text-zinc-400">
                No. Watch Tennis Today does not host or stream tennis matches.
                We provide schedules and information about official broadcasters
                and legal streaming options.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-black border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-4">
            Legal streaming notice
          </h2>

          <p className="text-zinc-400 leading-relaxed">
            Watch Tennis Today does not host, broadcast or retransmit tennis
            matches. Always check official broadcasters, tournament partners and
            regional streaming services for accurate availability.
          </p>
        </section>
      </div>
      <section className="mt-12">
  <h2 className="text-3xl font-black mb-5">
    🎾 Related Tennis Guides
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <a
      href="/best-ways-to-watch-tennis-online"
      className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-green-500 transition-all"
    >
      <h3 className="text-2xl font-black mb-2">
        Best Ways to Watch Tennis Online
      </h3>

      <p className="text-zinc-400">
        Official broadcasters, streaming services and legal ways to watch ATP and WTA tennis.
      </p>
    </a>

    <a
      href="/watch-tennis-in/poland"
      className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-green-500 transition-all"
    >
      <h3 className="text-2xl font-black mb-2">
        Watch Tennis in Poland
      </h3>

      <p className="text-zinc-400">
        TV channels, broadcasters and streaming services available in Poland.
      </p>
    </a>

    <a
      href="/live-tennis"
      className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-green-500 transition-all"
    >
      <h3 className="text-2xl font-black mb-2">
        Live Tennis Matches Today
      </h3>

      <p className="text-zinc-400">
        Follow live ATP, WTA and Challenger tennis matches happening right now.
      </p>
    </a>

    <a
      href="/watch-tennis-in/usa"
      className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-green-500 transition-all"
    >
      <h3 className="text-2xl font-black mb-2">
        Watch Tennis in USA
      </h3>

      <p className="text-zinc-400">
        Find where to watch Grand Slam and ATP/WTA matches in the United States.
      </p>
    </a>

  </div>
</section>
    </main>
  );
}
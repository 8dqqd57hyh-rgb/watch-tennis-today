export const metadata = {
  title:
    "Watch Aryna Sabalenka Live Tennis Matches | TV Channels & Streaming",
  description:
    "Watch Aryna Sabalenka live tennis matches today. Find WTA schedules, TV broadcasters, streaming platforms and live tennis coverage.",
};

export default function WatchSabalenkaLivePage() {
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
          🎾 Watch Aryna Sabalenka Live Tennis Matches
        </h1>

        <p className="text-zinc-300 text-lg leading-8 mb-10">
          Watch Aryna Sabalenka live today with official
          broadcasters, streaming platforms and WTA
          tennis coverage. Find match schedules, live
          streams and tournament information.
        </p>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-4">
            Where to Watch Aryna Sabalenka
          </h2>

          <p className="text-zinc-400 leading-8 mb-6">
            Aryna Sabalenka matches may be available on
            WTA broadcasters, Tennis Channel,
            Eurosport, Sky Sports and regional sports
            streaming services depending on your
            country.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="/watch-tennis-in/usa"
              className="bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
            >
              Watch in USA
            </a>

            <a
              href="/watch-tennis-in/uk"
              className="bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
            >
              Watch in UK
            </a>

            <a
              href="/watch-tennis-in/poland"
              className="bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
            >
              Watch in Poland
            </a>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-4">
            WTA Tournaments Featuring Aryna Sabalenka
          </h2>

          <div className="space-y-4 text-zinc-300 leading-8">
            <p>WTA 1000 tournaments</p>
            <p>WTA Finals</p>
            <p>Grand Slam tournaments</p>
            <p>Billie Jean King Cup</p>
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <h2 className="text-3xl font-black mb-4">
            Live Tennis Coverage
          </h2>

          <p className="text-zinc-400 leading-8 mb-6">
            Check live tennis schedules, WTA match
            coverage and upcoming Aryna Sabalenka matches
            through official broadcasters and legal
            streaming platforms.
          </p>

          <a
            href="/live-tennis"
            className="inline-block bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
          >
            View Live Tennis
          </a>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-3">
                Where can I watch Aryna Sabalenka live?
              </h3>

              <p className="text-zinc-400 leading-7">
                Aryna Sabalenka matches are available
                through official sports broadcasters and
                tennis streaming services depending on
                your region.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3">
                Can I stream WTA tennis online?
              </h3>

              <p className="text-zinc-400 leading-7">
                Yes. WTA tennis is available through
                legal sports streaming services and TV
                broadcasters in many countries.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-3">
                Does Watch Tennis Today stream matches?
              </h3>

              <p className="text-zinc-400 leading-7">
                No. Watch Tennis Today does not host or
                stream matches. The website helps users
                find legal tennis schedules and viewing
                options.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-6">
            More Tennis Players
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/watch-sinner-live"
              className="bg-black border border-zinc-800 rounded-2xl p-5 hover:border-green-500 transition-all"
            >
              Jannik Sinner Live
            </a>

            <a
              href="/watch-swiatek-live"
              className="bg-black border border-zinc-800 rounded-2xl p-5 hover:border-green-500 transition-all"
            >
              Iga Swiatek Live
            </a>

            <a
              href="/watch-alcaraz-live"
              className="bg-black border border-zinc-800 rounded-2xl p-5 hover:border-green-500 transition-all"
            >
              Carlos Alcaraz Live
            </a>

            <a
              href="/watch-medvedev-live"
              className="bg-black border border-zinc-800 rounded-2xl p-5 hover:border-green-500 transition-all"
            >
              Daniil Medvedev Live
            </a>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Where can I watch Aryna Sabalenka live?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Aryna Sabalenka matches are available through official sports broadcasters and tennis streaming services.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I stream WTA tennis online?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "WTA tennis is available through legal sports streaming services and TV broadcasters.",
                  },
                },
              ],
            }),
          }}
        />
      </div>
    </main>
  );
}
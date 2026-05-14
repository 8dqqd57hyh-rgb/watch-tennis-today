export const metadata = {
  title: "Best Ways to Watch Tennis Online | Watch Tennis Today",
  description:
    "Best legal ways to watch tennis online, including official broadcasters, tennis streaming services and country-based TV coverage.",
};

export default function BestWaysPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <h1 className="text-5xl font-black mt-8 mb-6">
          🎾 Best Ways to Watch Tennis Online
        </h1>

        <p className="text-zinc-300 text-lg leading-relaxed mb-8">
          The best way to watch tennis online depends on your country,
          tournament and subscription. ATP, WTA, Grand Slam and Challenger
          matches may be shown by different broadcasters around the world.
        </p>

        <section className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h2 className="text-3xl font-black mb-3">
              1. Official Broadcasters
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              Many tennis matches are available through official TV broadcasters
              such as Eurosport, Tennis Channel, Sky Sports, ESPN and regional
              sports networks. Availability depends on local rights.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h2 className="text-3xl font-black mb-3">
              2. Tennis Streaming Platforms
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              Some ATP and WTA matches are available through dedicated tennis
              streaming platforms or official tournament services. Always check
              whether the service is available in your country.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h2 className="text-3xl font-black mb-3">
              3. Country Guides
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-4">
              Tennis rights vary by country, so country-specific guides are
              often the easiest way to find where to watch.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="/watch-tennis-in/poland"
                className="bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
              >
                Poland
              </a>
              <a
                href="/watch-tennis-in/uk"
                className="bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
              >
                UK
              </a>
              <a
                href="/watch-tennis-in/usa"
                className="bg-green-500 text-black px-5 py-3 rounded-2xl font-black"
              >
                USA
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-lime-400 text-black rounded-3xl p-6">
            <h2 className="text-3xl font-black mb-3">
              Watch Live Tennis Today
            </h2>
            <p className="font-semibold mb-5">
              Check live and upcoming tennis matches with broadcaster links and
              schedule information.
            </p>

            <a
              href="/live-tennis"
              className="inline-block bg-black text-white px-5 py-3 rounded-2xl font-black"
            >
              View Live Tennis
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
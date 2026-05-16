export const metadata = {
  title: "Watch Tennis Today Editorial Team | Authors",
  description:
    "Learn about the Watch Tennis Today editorial team, our tennis coverage, update policy and how we help fans find official tennis streaming and TV schedule information.",
};

export default function AuthorPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back to home
        </a>

        <section className="mt-10 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
          <p className="text-green-400 font-black mb-4">
            Editorial Team
          </p>

          <h1 className="text-5xl font-black mb-6">
            Watch Tennis Today Editorial Team
          </h1>

          <p className="text-zinc-300 text-lg leading-8 mb-8">
            Watch Tennis Today is created to help tennis fans find live matches,
            TV schedules, official streaming options, player pages, tournament
            coverage and country-based viewing guides.
          </p>

          <div className="space-y-8 text-zinc-300 leading-8">
            <section>
              <h2 className="text-3xl font-black text-white mb-3">
                What we cover
              </h2>

              <p>
                We cover ATP, WTA, Grand Slam, Challenger and ITF tennis
                schedules, including live match pages, tournament hubs, player
                pages and streaming information.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-black text-white mb-3">
                How we update pages
              </h2>

              <p>
                Match and schedule pages may update frequently when live tennis
                data changes. We focus on helping users find legal and official
                viewing options instead of hosting or embedding streams.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-black text-white mb-3">
                Editorial policy
              </h2>

              <p>
                Watch Tennis Today aims to provide clear, practical and
                user-friendly tennis viewing information. Streaming availability
                can vary by country, broadcaster and tournament rights.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-black text-white mb-3">
                Affiliate disclosure
              </h2>

              <p>
                Some pages may include affiliate links. If users purchase through
                those links, Watch Tennis Today may earn a commission at no extra
                cost to the user.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-black text-white mb-3">
                Contact
              </h2>

              <p>
                For corrections, advertising or partnership questions, please
                visit our contact or advertise pages.
              </p>

              <div className="flex flex-wrap gap-4 mt-5">
                <a
                  href="/contact"
                  className="bg-green-500 text-black px-5 py-3 rounded-2xl font-black hover:bg-green-400 transition-all"
                >
                  Contact
                </a>

                <a
                  href="/advertise"
                  className="border border-zinc-700 px-5 py-3 rounded-2xl font-black hover:border-green-500 hover:text-green-400 transition-all"
                >
                  Advertise
                </a>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
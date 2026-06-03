export const metadata = {
  title: "About | Watch Tennis Today",
  description:
    "About Watch Tennis Today — a tennis schedule and streaming guide helping fans find live matches, tournament pages and legal broadcaster information.",
  alternates: {
    canonical: "https://watchtennistoday.com/about",
  },
};

export const dynamic = "force-dynamic";
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <h1 className="text-5xl font-black mt-8 mb-6">
          About Watch Tennis Today
        </h1>

        <div className="space-y-8 text-zinc-300 leading-relaxed">
          <p>
            Watch Tennis Today is a tennis information website created to help
            fans quickly find live tennis matches, daily schedules, tournament
            pages, broadcaster information and legal ways to watch tennis online.
          </p>
<p>
  The website was built by tennis fans who wanted a simpler way to track
  match schedules, tournament coverage and official viewing options
  without searching across dozens of different sports websites.
</p>
          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              What we cover
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>ATP and WTA live tennis matches</li>
              <li>Grand Slam tournament pages</li>
              <li>Daily tennis schedules</li>
              <li>Player match pages</li>
              <li>Country-specific broadcaster guides</li>
              <li>Regional broadcasting and streaming access guides</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              Our goal
            </h2>
            <p>
              Tennis broadcasting can be confusing because availability changes
              by country, tournament, provider and match round. Our goal is to
              make it easier for fans to understand where a match may be shown
              and what official sources they should check before watching.
            </p>
          </section>

          <section>
  <h2 className="text-2xl font-black text-white mb-3">
    Why this site exists
  </h2>

  <p>
    Tennis fans often need to check several different sources to find out
    when a match starts, whether it is live, which tournament it belongs to
    and where it may be available to watch legally. Watch Tennis Today was
    created to bring that information together in a simple, tennis-focused
    format.
  </p>
</section>

<section>
  <h2 className="text-2xl font-black text-white mb-3">
    Our approach
  </h2>

  <p>
    We combine tennis schedule information, tournament context, country-based
    broadcaster notes and practical viewing guides. We do not host live streams
    or promote illegal streaming sources. Our goal is to point users toward
    official broadcasters, legal streaming platforms and reliable tournament
    information.
  </p>
</section>



<section>
  <h2 className="text-2xl font-black text-white mb-3">
    Who writes and maintains the site
  </h2>

  <p>
    Watch Tennis Today is maintained by an independent tennis-focused editorial
    team. We follow professional tennis calendars, official tournament pages,
    broadcaster information and live-score data to turn fragmented tennis
    information into practical match and viewing guides for fans.
  </p>
</section>

<section>
  <h2 className="text-2xl font-black text-white mb-3">
    How we create value beyond live data
  </h2>

  <p>
    Live tennis data is only one part of the website. We add editorial context
    explaining tournament rights, safe streaming choices, country-based viewing
    differences, schedule terminology, time-zone planning and how fans can avoid
    unsafe or illegal stream pages. Our guides are written to help readers make
    better decisions before they leave for an external broadcaster or streaming
    service.
  </p>
</section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">
              Accuracy and updates
            </h2>
            <p>
              Match schedules, scores, start times and broadcaster availability
              can change quickly. We aim to keep pages useful and updated, but
              users should always confirm final schedules and streaming access
              through official tournament websites, broadcasters or streaming
              providers.
            </p>
          </section>

          <section>
  <h2 className="text-2xl font-black text-white mb-3">
    Legal notice
  </h2>

  <p>
    Watch Tennis Today does not host live streams, embed copyrighted
    broadcasts or distribute sports content. The website only references
    official broadcasters, licensed streaming services and publicly
    available tournament information.
  </p>
</section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black text-white mb-3">
              Contact us
            </h2>
            <p>
              Found outdated information or a broken link? Please visit our{" "}
              <a
                href="/contact"
                className="text-green-400 hover:text-green-300 font-bold"
              >
                Contact page
              </a>{" "}
              and send us a correction.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

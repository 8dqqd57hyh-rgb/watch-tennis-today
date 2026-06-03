export const metadata = {
  title: "About | Watch Tennis Today",
  description:
    "About Watch Tennis Today — an independent tennis schedule, live score context and legal viewing guide for ATP, WTA and Grand Slam fans.",
  alternates: {
    canonical: "https://watchtennistoday.com/about",
  },
};

export const dynamic = "force-dynamic";

const principles = [
  "We do not host, embed or distribute live tennis streams.",
  "We focus on legal broadcasters, licensed streaming services and official tournament information.",
  "We separate editorial guidance from live-data feeds and explain when data may be incomplete.",
  "We keep legal pages, contact information and editorial policies visible from the site footer.",
];

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
            Watch Tennis Today is an independent tennis information website built to help fans
            follow daily professional tennis without jumping between dozens of scoreboards,
            tournament pages and broadcaster schedules. The site combines match schedules,
            live-score context, player hubs, tournament pages and practical legal viewing guides
            for ATP, WTA, Grand Slam and selected professional tennis events.
          </p>

          <p>
            The project exists because tennis is unusually difficult to follow: matches move after
            long previous matches, rain delays can change an order of play, and broadcast rights
            vary by country, tournament and court. Our goal is to make that context easier to
            understand before a fan leaves for an external broadcaster or official tournament page.
          </p>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">What we cover</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>ATP and WTA live match status and daily schedule context</li>
              <li>Grand Slam and major tournament viewing guides</li>
              <li>Player pages with schedule, form and legal viewing notes</li>
              <li>Educational tennis guides for scoring, rankings, surfaces and tournament levels</li>
              <li>Country and broadcaster guidance for legal tennis viewing</li>
              <li>Explanations of tennis schedule terms, delays and live-score limitations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">How we create our pages</h2>
            <p>
              Watch Tennis Today uses a mix of editorial writing, structured tennis data and public
              tournament context. Schedule and live-score data can change quickly, so our pages are
              written to help readers understand what to verify: event name, round, court, start
              window, broadcaster and country availability. We avoid presenting partial live-data
              feeds as complete season records when the source is limited.
            </p>
            <p className="mt-3">
              Our guides are created for practical fan decisions, not for bypassing media rights.
              When we mention a streaming option, the purpose is to point readers toward official
              or licensed viewing routes and to explain why availability may differ by location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">Editorial standards</h2>
            <p>
              We aim to write complete, readable pages with original explanations rather than only
              listing scores or links. Tennis schedules are checked against event context where
              possible, and sensitive claims about coverage are written cautiously because official
              rights can change during a season. If a page relies on a limited feed, we say so rather
              than implying that every match or broadcaster is guaranteed.
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black text-white mb-4">Trust and legal viewing principles</h2>
            <ul className="space-y-3">
              {principles.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-green-400 font-black">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">Advertising and affiliate transparency</h2>
            <p>
              Watch Tennis Today may display advertising and may include affiliate links to relevant
              services. Affiliate relationships do not change our core rule: the site should be useful
              as a tennis information resource even when a reader does not click a commercial link.
              Advertising and affiliate disclosures are linked from the footer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white mb-3">Accuracy and corrections</h2>
            <p>
              Tennis information changes fast. Start times, court assignments, withdrawals and
              broadcast availability can update after publication. Readers should confirm final
              timing and access with official tournaments, broadcasters or streaming providers.
              If you notice outdated information, a broken link or unclear wording, please contact us
              so we can improve the page.
            </p>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-black text-white mb-3">Contact us</h2>
            <p>
              Found outdated information, a broken link or a schedule issue? Please visit our{" "}
              <a href="/contact" className="text-green-400 hover:text-green-300 font-bold">
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

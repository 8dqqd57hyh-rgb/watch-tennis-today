import Link from "next/link";

export const metadata = {
  title: "Watch Tennis Today Editorial Team | Author and Review Process",
  description:
    "Learn who maintains Watch Tennis Today, how tennis data is sourced, how guides are reviewed and how streaming information is verified.",
  alternates: { canonical: "https://watchtennistoday.com/authors/watch-tennis-today" },
};

export default function AuthorPage() {
  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Watch Tennis Today Editorial Team",
    url: "https://watchtennistoday.com/authors/watch-tennis-today",
    description:
      "Editorial and review process for Watch Tennis Today, an informational tennis schedule, guide and legal viewing resource.",
    publisher: { "@type": "Organization", name: "Watch Tennis Today", url: "https://watchtennistoday.com" },
    mainEntity: { "@id": "https://watchtennistoday.com/authors/watch-tennis-today#editorial-team" },
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://watchtennistoday.com/authors/watch-tennis-today#editorial-team",
    name: "Watch Tennis Today Editorial Team",
    url: "https://watchtennistoday.com/authors/watch-tennis-today",
    affiliation: { "@type": "Organization", name: "Watch Tennis Today" },
    knowsAbout: [
      "Tennis schedules",
      "ATP and WTA tournaments",
      "Grand Slam viewing information",
      "Tennis scoring and rules",
      "Legal sports broadcast verification",
    ],
  };

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <div className="mx-auto max-w-4xl">
        <nav className="flex flex-wrap gap-2 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Editorial team</span>
        </nav>

        <section className="mt-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.25em] text-emerald-300">Editorial team</p>
          <h1 className="mb-6 text-5xl font-black">Watch Tennis Today Editorial Team</h1>
          <p className="mb-8 text-lg leading-8 text-zinc-300">
            Watch Tennis Today is maintained as an informational tennis resource for fans who want match schedules, player pages, tournament context, country viewing guides and clear explanations of how to verify legal tennis broadcasts. The site does not host video, embed streams, sell unofficial access or claim that every match is available for free.
          </p>

          <div className="space-y-8 leading-8 text-zinc-300">
            <section>
              <h2 className="mb-3 text-3xl font-black text-white">What we publish</h2>
              <p>
                We publish tennis schedule pages, live-match context, player and tournament pages, country viewing guides and evergreen educational guides. Editorial pages explain concepts such as scoring, break points, tiebreaks, ranking movement, tournament levels, surfaces and streaming-rights basics. Data-driven pages are designed to help users navigate tennis coverage, while guide pages provide the evergreen context that makes those pages useful.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-3xl font-black text-white">How match data is sourced</h2>
              <p>
                Match and schedule pages may use licensed or public tennis data feeds, archived match data, official tournament calendars and visible tournament information. When data is missing, incomplete or uncertain, Watch Tennis Today avoids presenting it as a confirmed full schedule. Pages that depend heavily on unstable data may be kept out of search indexing until they have enough useful editorial context.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-3xl font-black text-white">Editorial standards</h2>
              <p>
                We avoid thin placeholder pages, auto-generated pages with little original value and unfinished pages that only display headings or empty states. Guides should explain the subject in plain language, include practical tennis context and help readers make a better decision or understand a match more clearly. We do not add fake author credentials, fake first-hand reviews or invented statistics.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-3xl font-black text-white">Fact-checking and updates</h2>
              <p>
                Evergreen guides are reviewed against official rules, public ATP/WTA information and official tournament or broadcaster pages where relevant. Date-sensitive pages are treated more carefully because order of play, match times, withdrawals and broadcaster availability can change quickly. When a page contains time-sensitive information, readers are encouraged to verify with the official tournament, tour or broadcaster before making travel, ticketing or subscription decisions.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-3xl font-black text-white">Streaming-information verification</h2>
              <p>
                Streaming guidance starts with legality and availability. We point readers toward official tournament pages, tour sites, licensed broadcasters and provider information. Because TV rights vary by country and event, we do not promise that a provider covers every match. We also avoid directing users to unauthorized streams or methods that bypass broadcaster restrictions.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-3xl font-black text-white">Corrections</h2>
              <p>
                Tennis information can change quickly. If you notice an outdated schedule note, country guide, broadcaster reference or match page issue, use the contact page so it can be reviewed.
              </p>
              <div className="mt-5 flex flex-wrap gap-4">
                <Link href="/contact" className="rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black hover:bg-emerald-300">Contact</Link>
                <Link href="/editorial-policy" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-emerald-300">Editorial policy</Link>
                <Link href="/how-we-source-data" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-emerald-300">How we source data</Link>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

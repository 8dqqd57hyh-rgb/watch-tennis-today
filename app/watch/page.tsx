export const metadata = {
  title: "Where to Watch Tennis Online | Watch Tennis Today",
  description:
    "Find legal ways to watch tennis online, including live match pages, tournament coverage, TV schedules and country-specific broadcaster guides.",
  alternates: {
    canonical: "https://watchtennistoday.com/watch",
  },
};

export const dynamic = "force-dynamic";
export default function WatchPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <a href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </a>

        <h1 className="text-4xl md:text-5xl font-black mt-8">
          Where to Watch Tennis Online
        </h1>

        <p className="text-zinc-300 mt-4 text-lg leading-relaxed">
          Watch Tennis Today helps tennis fans find legal ways to follow live
          matches, tournament schedules, player pages and official broadcaster
          information. Tennis rights are different in every country, so this
          page is a starting point for finding the right viewing option.
        </p>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <a
            href="/live-tennis"
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-600"
          >
            <h2 className="text-2xl font-bold">Live tennis today</h2>
            <p className="text-zinc-400 mt-2">
              See current and upcoming tennis matches with links to match pages
              and legal viewing information.
            </p>
          </a>

          <a
            href="/tv-schedule"
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-600"
          >
            <h2 className="text-2xl font-bold">Tennis TV schedule</h2>
            <p className="text-zinc-400 mt-2">
              Check tennis coverage by channel, tournament and region.
            </p>
          </a>

          <a
            href="/watch-tennis-in/poland"
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-600"
          >
            <h2 className="text-2xl font-bold">Watch tennis by country</h2>
            <p className="text-zinc-400 mt-2">
              Find country-specific broadcaster guides for tennis fans.
            </p>
          </a>

          <a
            href="/how-to-watch-tennis-legally"
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-600"
          >
            <h2 className="text-2xl font-bold">How to watch legally</h2>
            <p className="text-zinc-400 mt-2">
              Learn how to avoid unsafe streams and use official tennis
              broadcasters and streaming services.
            </p>
          </a>
        </section>

        <section className="mt-12 space-y-5 text-zinc-300 leading-relaxed">
          <h2 className="text-3xl font-bold text-white">
            Why tennis streaming can be confusing
          </h2>

          <p>
            Tennis is shown across many different broadcasters because rights
            are usually sold by tournament, country and tour. A Grand Slam may
            be available on one platform, while ATP, WTA or Davis Cup matches
            may be shown somewhere else.
          </p>

          <p>
            That is why Watch Tennis Today separates match pages, tournament
            pages, country guides and TV schedule pages. The goal is to help
            fans avoid illegal streams and find official coverage faster.
          </p>

          <h2 className="text-3xl font-bold text-white">
            What information we try to provide
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>Live and upcoming tennis matches</li>
            <li>Official broadcaster and streaming information</li>
            <li>Country-specific tennis viewing guides</li>
            <li>Grand Slam and tournament pages</li>
            <li>Player-focused live match pages</li>
          </ul>

          <h2 className="text-3xl font-bold text-white">
            Important note about availability
          </h2>

          <p>
            Broadcaster schedules can change, and some platforms require a paid
            subscription or local access. Always confirm the final match listing
            on the official broadcaster website before purchasing or signing up.
          </p>
          <p>
  Watch Tennis Today does not host, embed or restream live tennis broadcasts.
  We provide informational guides and links to official broadcaster resources
  only.
</p>
        </section>
      </div>
    </main>
  );
}

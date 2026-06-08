import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Watch Tennis Live Today | Legal ATP & WTA Viewing Guide",
  description:
    "Find today&apos;s live tennis matches and learn how to verify legal ATP, WTA, Grand Slam and Challenger viewing options.",
};

export default function WatchTennisLiveTodayPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm font-bold uppercase tracking-wide text-green-400">Legal live tennis guide</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight md:text-6xl">
          Watch Tennis Live Today
        </h1>

        <div className="mt-6 max-w-4xl space-y-4 text-lg leading-8 text-zinc-300">
          <p>
            This page is for fans who already know they want to watch tennis live today and need a safe route from match discovery to legal coverage. The first step is not clicking a random stream link; it is confirming which tournament is active, which match is live or upcoming, and which broadcaster owns rights in your country.
          </p>
          <p>
            Watch Tennis Today does not host, embed or restream live tennis broadcasts. We provide schedules, match context and links to official or editorial viewing guides. The actual video must come from a licensed TV channel, streaming service, tournament platform or tour partner. That distinction matters for AdSense quality and for user safety: legal availability changes by territory, while unsafe sites often reuse misleading match names and aggressive ads.
          </p>
          <p>
            A live score does not automatically mean a live stream exists. Main courts at Grand Slams and larger ATP/WTA events usually have stronger coverage, while smaller courts, Challenger matches and some ITF events may offer scores only. Before subscribing for one match, verify the event, court, session, country and device rules on the provider&apos;s own page.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/atp-live-today" className="rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-200">
            ATP Matches
          </Link>
          <Link href="/wta-live-today" className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-semibold transition hover:bg-zinc-800">
            WTA Matches
          </Link>
          <Link href="/tennis-on-tv-today" className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-semibold transition hover:bg-zinc-800">
            Tennis on TV Today
          </Link>
          <Link href="/tennis-schedule-today" className="rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-semibold transition hover:bg-zinc-800">
            Full Schedule
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-8 md:grid-cols-3">
        <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">1. Find the match</h2>
          <p className="mt-3 leading-7 text-zinc-300">Check whether the match is live, upcoming, delayed or finished. Tennis start times are flexible, especially when a match follows another match on the same court.</p>
        </article>
        <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">2. Verify the rights holder</h2>
          <p className="mt-3 leading-7 text-zinc-300">Look for the official tournament page, tour page or recognized broadcaster in your country. Do not assume a provider covers every court just because it carries the event.</p>
        </article>
        <article className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">3. Avoid unsafe shortcuts</h2>
          <p className="mt-3 leading-7 text-zinc-300">If a legal stream is unavailable, use official scores, highlights or replays. Unknown stream mirrors can be misleading, unsafe and outside broadcast rights.</p>
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <h2 className="text-3xl font-bold">Live tennis matches right now</h2>
          <p className="mt-4 max-w-2xl text-zinc-300">
            See current live tennis matches, scores and match pages in one place. Use the live page for match discovery, then return here when you need legal viewing context.
          </p>
          <Link href="/live-tennis" className="mt-6 inline-block rounded-xl bg-green-500 px-5 py-3 font-bold text-black transition hover:bg-green-400">
            View Live Matches
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
          <p className="text-sm uppercase tracking-wide text-zinc-400">Tennis streaming</p>
          <h2 className="mt-2 text-3xl font-bold">Watching while traveling</h2>
          <p className="mt-4 max-w-3xl leading-7 text-zinc-300">
            Travel can change what your usual sports platform allows you to watch. Check the provider&apos;s own roaming rules, account terms and country availability before relying on it abroad. A VPN may help some users secure their connection, but it should not be used to bypass rights restrictions or violate a service&apos;s terms.
          </p>
          <Link href="/watch-tennis-abroad" className="mt-6 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-200">
            Watch Tennis Abroad Guide
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-3xl font-bold">Popular Tennis Pages</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/who-plays-tennis-today" className="rounded-2xl border border-zinc-800 p-5 transition hover:bg-zinc-900">Who Plays Tennis Today</Link>
          <Link href="/tennis-order-of-play-today" className="rounded-2xl border border-zinc-800 p-5 transition hover:bg-zinc-900">Order of Play Today</Link>
          <Link href="/official-tennis-broadcasters-guide" className="rounded-2xl border border-zinc-800 p-5 transition hover:bg-zinc-900">Official Broadcasters Guide</Link>
        </div>
      </section>
    </main>
  );
}

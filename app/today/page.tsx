import TodayClient from "./TodayClient";
import EmailCapture from "@/components/EmailCapture";
import TennisNavigationHub from "@/app/components/TennisNavigationHub";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Today's Tennis Matches & Schedule | Live, Upcoming and Finished",
  description: "Follow today's tennis matches with live, upcoming and completed match sections, featured matches, player links and legal viewing checks.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://watchtennistoday.com/today" },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Daily tennis guide</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Today&apos;s tennis matches, live schedule and legal viewing checks</h1>
        <div className="mt-4 space-y-4 text-base leading-7 text-slate-700">
          <p>
            This page is designed for fans who want to plan a tennis day without relying on a bare data feed. A useful daily schedule needs more than names and start times: it should explain whether a match is already live, still waiting for a previous match to finish, suspended because of weather, or completed with a final score. Tennis is especially fluid because many matches share the same court and one long three-set battle can move the rest of the session by hours.
          </p>
          <p>
            Start by reading the tournament name, then the player names, then the match status. A live label means the match has started and the score should be checked frequently. An upcoming label means the match is planned but not guaranteed to begin at the listed minute. A finished label is useful for results and replays, but it should not be confused with current broadcast availability. If a match is suspended or delayed, check the tournament&apos;s official order of play before making plans around it.
          </p>
          <p>
            Watch Tennis Today does not host, embed or restream live tennis. Use the match list as a discovery layer, then confirm the final viewing route with the tournament site, the tour page or the licensed broadcaster for your country. Broadcast rights are local, so a match shown by one service in the United States may be handled by another provider in Poland, the United Kingdom, Germany or Australia. Before paying for access, verify that the provider carries the specific event and, when possible, the specific court or session.
          </p>
          <p>
            The page is still meant to be useful when live data is quiet or temporarily unavailable. On lighter tennis days, official schedules, draw pages and broadcaster listings are often the best sources to check next. During busy weeks, compare this page with the tournament order of play and refresh closer to match time. That habit prevents common mistakes such as following an old start time, assuming every court has video, or clicking an unsafe site that promises coverage it does not legally control.
          </p>
        </div>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border bg-slate-50 p-5">
          <h2 className="text-xl font-bold text-slate-950">Live matches</h2>
          <p className="mt-2 leading-7 text-slate-700">Use live rows to follow active matches, score movement and possible momentum changes. For video, check your local rights holder rather than assuming every live score has a stream.</p>
        </article>
        <article className="rounded-3xl border bg-slate-50 p-5">
          <h2 className="text-xl font-bold text-slate-950">Upcoming matches</h2>
          <p className="mt-2 leading-7 text-slate-700">Upcoming times are best read as start windows. Previous matches, weather, medical delays and court changes can move the real start after the first schedule is published.</p>
        </article>
        <article className="rounded-3xl border bg-slate-50 p-5">
          <h2 className="text-xl font-bold text-slate-950">Finished matches</h2>
          <p className="mt-2 leading-7 text-slate-700">Finished rows help you catch up on results and find replays. Spoiler-sensitive fans should avoid score-heavy pages and go directly to a licensed replay library when available.</p>
        </article>
      </section>

      <section className="mb-8 rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">FAQ: using today&apos;s tennis schedule</h2>
        <div className="mt-4 space-y-4 text-base leading-7 text-slate-700">
          <div>
            <h3 className="font-bold text-slate-950">Why did a listed start time change?</h3>
            <p>Tennis matches usually follow the previous match on the same court. If that match runs long, is suspended or needs a deciding set, the next match can start much later than the first estimate.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-950">Does a live score mean there is a legal stream?</h3>
            <p>No. Live scores and live video are different products. Some courts have scores only, some have highlights later, and some are available through a licensed broadcaster in selected countries.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-950">What should I verify before watching?</h3>
            <p>Check the event, court, local start time, broadcaster, subscription terms and whether the provider covers the match you want. Avoid unknown pages that claim to show every match for free.</p>
          </div>
        </div>
      </section>
      <div className="mb-8">
        <EmailCapture
          title="Get today's useful tennis alerts"
          description="Get low-noise updates for important tennis schedule windows, live match context and official viewing checks."
          placeholder="Email for daily tennis alerts"
          buttonText="Get alerts"
          contextType="daily"
          contextValue="today-page"
        />
      </div>
      <TennisNavigationHub dark={false} className="mb-8" />
      <TodayClient />
    </main>
  );
}

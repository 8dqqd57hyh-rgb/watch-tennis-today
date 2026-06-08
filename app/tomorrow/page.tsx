import TomorrowClient from "./TomorrowClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Tennis Matches Tomorrow: Schedule, Start Times & TV Guide",
  description:
    "See tomorrow&apos;s tennis matches, start times, tournaments and legal streaming options for ATP, WTA, Challenger and Grand Slam tennis.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Tomorrow&apos;s tennis planner</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Tomorrow&apos;s tennis schedule, start windows and viewing checks</h1>
        <div className="mt-4 space-y-3 text-base leading-7 text-slate-700">
          <p>
            Tomorrow&apos;s tennis schedule is useful for planning, but it is not final until the event confirms court order and broadcasters publish their local listings. Draw changes, weather and late finishes can all affect when a match actually begins.
          </p>
          <p>
            The listings below help you spot upcoming ATP, WTA, Challenger and Grand Slam matches, then decide what needs a final check. Before buying a subscription or setting a reminder for one match, verify the tournament order of play, your country-specific broadcaster and whether the match court is included in the provider schedule.
          </p>
        </div>
      </section>
      <TomorrowClient />
    </main>
  );
}

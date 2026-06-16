import TomorrowClient from "./TomorrowClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Tennis Matches Tomorrow: Schedule, Start Times & TV Guide",
  description:
    "Plan tomorrow&apos;s tennis with provisional order-of-play context, timezone checks, schedule changes and legal viewing guidance.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Tomorrow&apos;s tennis planner</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Tomorrow&apos;s tennis schedule, start windows and viewing checks</h1>
        <div className="mt-4 space-y-4 text-base leading-7 text-slate-700">
          <p>
            Tomorrow&apos;s tennis schedule is a planning tool, not a final promise. Tournaments often publish an order of play the evening before, but that order can still change after withdrawals, weather updates, court maintenance decisions or unfinished matches from the previous day. This is why a good tennis plan should separate confirmed facts, such as the tournament and draw, from flexible details, such as exact court time and broadcast placement.
          </p>
          <p>
            Use this page to identify which ATP, WTA, Challenger, ITF or Grand Slam matches may matter to you tomorrow. Then check the official tournament order of play close to the session. If a match is listed as second or third on a court, its start time depends on the earlier matches. A straight-set opener can speed the day up; a long three-set match, medical timeout or rain delay can push everything back. Finals and night sessions may be more predictable, but they still need a final local check.
          </p>
          <p>
            Timezone awareness matters because tennis is global. A match advertised for tomorrow in Melbourne, Paris or New York may fall late tonight or early the next morning for you. Before setting an alarm, compare the tournament timezone with your own device timezone and the broadcaster&apos;s local listing. This is especially important during Grand Slams, combined ATP/WTA events and Asian or North American tournaments watched from Europe.
          </p>
          <p>
            Watch Tennis Today does not host live tennis video. The schedule below should help you decide what to monitor, but the final viewing decision belongs with licensed broadcasters, tournament platforms and official tour sources. Before subscribing for one match, confirm the provider covers the event, the court, the session and your country. If no legal live video exists, use official scoreboards, highlights, replays or match reports rather than unsafe stream mirrors.
          </p>
        </div>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border bg-slate-50 p-5">
          <h2 className="text-xl font-bold text-slate-950">Provisional timing</h2>
          <p className="mt-2 leading-7 text-slate-700">Treat tomorrow&apos;s start times as windows until the tournament confirms court order and earlier matches are complete.</p>
        </article>
        <article className="rounded-3xl border bg-slate-50 p-5">
          <h2 className="text-xl font-bold text-slate-950">Court order</h2>
          <p className="mt-2 leading-7 text-slate-700">A match placed after another match does not have a fixed start. Follow the court sequence, not just the first listed time.</p>
        </article>
        <article className="rounded-3xl border bg-slate-50 p-5">
          <h2 className="text-xl font-bold text-slate-950">Legal viewing</h2>
          <p className="mt-2 leading-7 text-slate-700">Check your country-specific broadcaster before paying. Tennis rights vary by tournament, territory and sometimes by court.</p>
        </article>
      </section>

      <section className="mb-8 rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">FAQ: planning tomorrow&apos;s tennis</h2>
        <div className="mt-4 space-y-4 text-base leading-7 text-slate-700">
          <div>
            <h3 className="font-bold text-slate-950">When is tomorrow&apos;s tennis schedule final?</h3>
            <p>It becomes more reliable after the tournament publishes the order of play, but even then weather, withdrawals and unfinished matches can force changes.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-950">Why do some matches have no exact time?</h3>
            <p>Many tennis matches are scheduled as &quot;not before&quot; or &quot;after&quot; another match. The real start depends on how long the earlier court schedule takes.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-950">How do I avoid paying for the wrong service?</h3>
            <p>Confirm the tournament, country, court coverage and device rules on the official broadcaster page before buying access for a specific match.</p>
          </div>
        </div>
      </section>
      <TomorrowClient />
    </main>
  );
}

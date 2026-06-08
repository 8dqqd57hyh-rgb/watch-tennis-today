import TodayClient from "./TodayClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Today&apos;s Tennis Matches & Schedule",
  description: "Live tennis matches, schedules, TV listings and streaming availability for today.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Daily tennis guide</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Today&apos;s tennis matches, live schedule and legal viewing checks</h1>
        <div className="mt-4 space-y-3 text-base leading-7 text-slate-700">
          <p>
            This page is designed for fans who want to plan a tennis day without relying on a bare API list. Start with the tournament name and round, then check whether the match is live, scheduled, suspended or already finished. Tennis start times can move when earlier matches run long, rain interrupts play or a court is reassigned.
          </p>
          <p>
            Use the match list below as a discovery tool, then confirm important viewing decisions with the tournament order of play and the licensed broadcaster for your country. Watch Tennis Today does not host or embed live video; it helps you compare schedules, live status and legal coverage routes before clicking away.
          </p>
        </div>
      </section>
      <TodayClient />
    </main>
  );
}

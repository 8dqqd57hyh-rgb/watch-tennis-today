export const metadata = {
  title: "French Open Schedule Guide | Roland Garros Order of Play",
  description:
    "Understand the French Open schedule, daily order of play, match timing and where to check official Roland Garros updates.",
};

export default function FrenchOpenSchedulePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-green-700">
        Roland Garros schedule guide
      </p>
      <h1 className="mb-5 text-4xl font-bold tracking-tight">
        French Open Schedule: How to Follow the Roland Garros Order of Play
      </h1>

      <div className="space-y-5 text-lg leading-8 text-neutral-800">
        <p>
          The French Open schedule changes daily as matches finish, weather affects play
          and tournament organizers update court assignments. This page explains how to
          read the schedule and where to continue for current Roland Garros match timing.
        </p>

        <p>
          Grand Slam schedules are usually split by court, session and round. Early rounds
          have many matches at the same time, while the second week becomes more focused
          around quarter-finals, semi-finals and finals. Doubles, juniors and wheelchair
          events may also appear alongside singles matches.
        </p>

        <section className="rounded-2xl border bg-neutral-50 p-6">
          <h2 className="mb-3 text-2xl font-semibold">What to check each day</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Daily order of play and court assignment.</li>
            <li>Estimated start time in your local timezone.</li>
            <li>Whether the match is part of a day or night session.</li>
            <li>Broadcaster availability for your country.</li>
          </ul>
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <a href="/french-open-order-of-play" className="rounded-xl border p-4 font-medium hover:bg-neutral-50">
            View French Open order of play
          </a>
          <a href="/french-open-today" className="rounded-xl border p-4 font-medium hover:bg-neutral-50">
            See French Open matches today
          </a>
          <a href="/french-open-results" className="rounded-xl border p-4 font-medium hover:bg-neutral-50">
            Check French Open results
          </a>
          <a href="/french-open-live" className="rounded-xl border p-4 font-medium hover:bg-neutral-50">
            Open French Open live hub
          </a>
        </div>
      </div>
    </main>
  );
}

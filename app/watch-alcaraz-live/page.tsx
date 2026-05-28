export const metadata = {
  title: "Watch Carlos Alcaraz Live | Schedule, Matches and Legal Streams",
  description:
    "Find Carlos Alcaraz live match information, tennis schedules, tournament context and legal streaming options.",
  alternates: {
    canonical: "https://watchtennistoday.com/watch-alcaraz-live",
  },
};

export default function WatchCarlosAlcarazLivePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-green-700">
        Player live guide
      </p>
      <h1 className="mb-5 text-4xl font-bold tracking-tight">
        Watch Carlos Alcaraz Live: Match Schedule and Legal Tennis Streams
      </h1>

      <div className="space-y-5 text-lg leading-8 text-neutral-800">
        <p>
          This page is a dedicated guide for tennis fans looking for Carlos Alcaraz live match
          information. Watch Tennis Today does not host broadcasts or unauthorized video
          streams. We help readers find schedules, tournament context and legal viewing
          options through official broadcasters and regional streaming services.
        </p>

        <p>
          Carlos Alcaraz is a Spanish ATP player and Grand Slam champion. His matches are often
          featured on major tennis broadcasts, especially during Grand Slams, Masters
          events and high-profile tour matches. Availability depends on the tournament,
          country and broadcaster rights package.
        </p>

        <section className="rounded-2xl border bg-neutral-50 p-6">
          <h2 className="mb-3 text-2xl font-semibold">What to check before the match</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Current tournament and round.</li>
            <li>Official order of play and expected start time.</li>
            <li>Licensed broadcaster or streaming service in your region.</li>
            <li>Whether the match is singles, doubles, exhibition or team competition.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">Player viewing notes</h2>
          <p>
            Fans often follow Carlos Alcaraz because of all-court aggression, explosive movement and heavy forehand pressure. These stylistic details can make
            his matches especially popular during late tournament rounds and prime-time
            broadcast windows.
          </p>
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <a href="/watch-player-live/carlos-alcaraz" className="rounded-xl border p-4 font-medium hover:bg-neutral-50">
            Open live match hub for Carlos Alcaraz
          </a>
          <a href="/player/carlos-alcaraz" className="rounded-xl border p-4 font-medium hover:bg-neutral-50">
            View Carlos Alcaraz player profile
          </a>
          <a href="/today" className="rounded-xl border p-4 font-medium hover:bg-neutral-50">
            See today&apos;s tennis schedule
          </a>
          <a href="/watch-tennis-live-today" className="rounded-xl border p-4 font-medium hover:bg-neutral-50">
            Find legal tennis streams today
          </a>
        </div>

        <p className="text-base text-neutral-600">
          If no live match is listed, check back closer to the next tournament session.
          Tennis schedules can move quickly because of previous match duration, weather,
          withdrawals and court changes.
        </p>
      </div>
    </main>
  );
}

const matches = [
  {
    title: "ATP Matches Today",
    href: "/atp-live-today",
  },
  {
    title: "WTA Matches Today",
    href: "/wta-live-today",
  },
  {
    title: "Grand Slam Live Streams",
    href: "/grand-slam-live",
  },
  {
    title: "Watch Tennis Online",
    href: "/best-ways-to-watch-tennis-online",
  },
];

export default function MoreMatchesToday() {
  return (
    <section className="my-10 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-4 text-3xl font-black text-white">
        More Tennis Matches & Streams
      </h2>

      <p className="mb-6 text-zinc-400 leading-7">
        Explore more ATP, WTA and Grand Slam tennis streams, schedules and
        live match coverage.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {matches.map((match) => (
          <a
            key={match.href}
            href={match.href}
            className="rounded-2xl border border-zinc-700 bg-black p-5 text-lg font-bold text-white hover:border-emerald-500"
          >
            {match.title}
          </a>
        ))}
      </div>
    </section>
  );
}
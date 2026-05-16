type RelatedMoneyLinksProps = {
  playerName?: string;
};

export default function RelatedMoneyLinks({
  playerName,
}: RelatedMoneyLinksProps) {
  return (
    <section className="my-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-4 text-3xl font-black text-white">
        More Tennis Streaming Guides
      </h2>

      <p className="mb-6 text-zinc-400 leading-7">
        Find more legal tennis streaming options, TV schedules and viewing
        guides for ATP, WTA and Grand Slam matches.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {playerName && (
          <a
            href="/best-vpn-for-tennis-streaming"
            className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
          >
            Best VPN for watching {playerName} matches
          </a>
        )}

        <a
          href="/best-ways-to-watch-tennis-online"
          className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
        >
          Best ways to watch tennis online
        </a>

        <a
          href="/watch-tennis-in/usa"
          className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
        >
          Watch tennis in the USA
        </a>

        <a
          href="/watch-tennis-in/uk"
          className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
        >
          Watch tennis in the UK
        </a>

        <a
          href="/atp-live-today"
          className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
        >
          ATP live today
        </a>

        <a
          href="/wta-live-today"
          className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
        >
          WTA live today
        </a>
      </div>
    </section>
  );
}
import { isDoublesTeam, safePlayerUrl } from "@/data/playerSlugs";

type RelatedMoneyLinksProps = {
  playerName?: string;
  player2Name?: string;
  tournament?: string;
};

export default function RelatedMoneyLinks({
  playerName,
  player2Name,
  tournament,
}: RelatedMoneyLinksProps) {
  return (
    <section className="my-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-4 text-3xl font-black text-white">
        More Tennis TV and Schedule Guides
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

        {playerName && !isDoublesTeam(playerName) && (
          <a
            href={safePlayerUrl(playerName) || "/players"}
            className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
          >
            Watch {playerName} live
          </a>
        )}

        {player2Name && !isDoublesTeam(player2Name) && (
          <a
            href={safePlayerUrl(player2Name) || "/players"}
            className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
          >
            Watch {player2Name} live
          </a>
        )}

        <a
          href="/watch-tennis-abroad"
          className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 font-bold text-white hover:border-green-500"
        >
          Watch tennis abroad safely
        </a>

        <a
          href="/best-ways-to-watch-tennis-online"
          className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
        >
          Best ways to watch tennis online
        </a>

        <a
          href="/compare/tennis-tv-vs-espn"
          className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
        >
          Tennis TV vs ESPN+
        </a>

        <a
          href="/compare/nordvpn-vs-surfshark-for-tennis"
          className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
        >
          NordVPN vs Surfshark for tennis
        </a>

        <a
          href="/compare/espn-vs-tennis-channel"
          className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
        >
          ESPN+ vs Tennis Channel
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

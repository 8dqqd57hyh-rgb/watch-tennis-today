import Link from "next/link";
import { isDoublesTeam, safePlayerUrl } from "@/data/playerSlugs";

type RelatedMoneyLinksProps = {
  playerName?: string;
  player2Name?: string;
};

export default function RelatedMoneyLinks({
  playerName,
  player2Name,
}: RelatedMoneyLinksProps) {
  return (
    <section
      data-track-area="related-money-links"
      className="my-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6"
    >
      <h2 className="mb-4 text-3xl font-black text-white">
        More Tennis TV and Schedule Guides
      </h2>

      <p className="mb-6 text-zinc-400 leading-7">
        Find more legal tennis streaming options, TV schedules and viewing
        guides for ATP, WTA and Grand Slam matches.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {playerName && (
          <Link
            href="/best-vpn-for-tennis-streaming"
            data-track-category="money_internal"
            data-track-id="related_best_vpn_player"
            className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
          >
            Best VPN for watching {playerName} matches
          </Link>
        )}

        {playerName && !isDoublesTeam(playerName) && (
          <Link
            href={safePlayerUrl(playerName) || "/players"}
            data-track-category="player_internal"
            data-track-id="related_player_primary"
            className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
          >
            Watch {playerName} live
          </Link>
        )}

        {player2Name && !isDoublesTeam(player2Name) && (
          <Link
            href={safePlayerUrl(player2Name) || "/players"}
            data-track-category="player_internal"
            data-track-id="related_player_secondary"
            className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
          >
            Watch {player2Name} live
          </Link>
        )}

        <Link
          href="/watch-tennis-abroad"
          data-track-category="money_internal"
          data-track-id="related_watch_abroad"
          className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 font-bold text-white hover:border-green-500"
        >
          Watch tennis abroad safely
        </Link>

        <Link
          href="/best-ways-to-watch-tennis-online"
          data-track-category="money_internal"
          data-track-id="related_best_ways_online"
          className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
        >
          Best ways to watch tennis online
        </Link>

        <Link
          href="/compare/tennis-tv-vs-espn"
          data-track-category="compare_internal"
          data-track-id="related_compare_tennis_tv_espn"
          className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
        >
          Tennis TV vs ESPN+
        </Link>

        <Link
          href="/compare/nordvpn-vs-surfshark-for-tennis"
          data-track-category="compare_internal"
          data-track-id="related_compare_nordvpn_surfshark"
          className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
        >
          NordVPN vs Surfshark for tennis
        </Link>

        <Link
          href="/compare/espn-vs-tennis-channel"
          data-track-category="compare_internal"
          data-track-id="related_compare_espn_tennis_channel"
          className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
        >
          ESPN+ vs Tennis Channel
        </Link>

        <Link
          href="/watch-tennis-in/usa"
          data-track-category="country_internal"
          data-track-id="related_country_usa"
          className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
        >
          Watch tennis in the USA
        </Link>

        <Link
          href="/watch-tennis-in/uk"
          data-track-category="country_internal"
          data-track-id="related_country_uk"
          className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
        >
          Watch tennis in the UK
        </Link>

        <Link
          href="/atp-live-today"
          data-track-category="schedule_internal"
          data-track-id="related_atp_live_today"
          className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
        >
          ATP live today
        </Link>

        <Link
          href="/wta-live-today"
          data-track-category="schedule_internal"
          data-track-id="related_wta_live_today"
          className="rounded-2xl border border-zinc-700 bg-black p-4 font-bold text-white hover:border-green-500"
        >
          WTA live today
        </Link>
      </div>
    </section>
  );
}

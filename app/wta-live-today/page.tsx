import VpnPromo from "@/app/components/VpnPromo";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import { getServerMatches } from "@/app/lib/serverMatches";
import Link from "next/link";

export const revalidate = 60;

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score: string;
  startTime: string | null;
};

const featuredWtaPlayers = [
  { name: "Aryna Sabalenka", slug: "sabalenka-aryna" },
  { name: "Iga Swiatek", slug: "swiatek-iga" },
  { name: "Coco Gauff", slug: "gauff-coco" },
  { name: "Elena Rybakina", slug: "rybakina-elena" },
  { name: "Mirra Andreeva", slug: "andreeva-mirra" },
];

export const metadata = {
  alternates: { canonical: "https://watchtennistoday.com/wta-live-today" },
};

async function getMatches(): Promise<Match[]> {
  return (await getServerMatches(60)) as Match[];
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function matchSlug(match: Match) {
  const readablePart = slugify(`${match.player1}-vs-${match.player2}`);
  const numericId = String(match.id).split(":").pop();

  return `${readablePart}-${numericId}`;
}

function statusPriority(status: string) {
  const value = status.toUpperCase();

  if (value === "LIVE") return 1;
  if (value === "SUSPENDED") return 2;
  if (value === "UPCOMING") return 3;

  return 4;
}

function formatDateTime(value: string | null) {
  if (!value) return "Time to be confirmed";

  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function WtaLiveTodayPage() {
  const matches = await getMatches();

  const wtaMatches = matches.filter((match) => {
    const category = match.category?.toLowerCase() || "";
    const tournament = match.tournament?.toLowerCase() || "";

    return category.includes("wta") || tournament.includes("wta");
  });

  const liveWtaMatches = wtaMatches
    .filter((match) => ["LIVE", "SUSPENDED"].includes(match.status?.toUpperCase()))
    .sort((a, b) => statusPriority(a.status) - statusPriority(b.status));

  const upcomingWtaMatches = wtaMatches
    .filter((match) => match.status?.toUpperCase() === "UPCOMING")
    .sort((a, b) => {
      if (!a.startTime) return 1;
      if (!b.startTime) return -1;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <nav className="text-sm text-zinc-400 mb-8 flex flex-wrap gap-2">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span>/</span>
          <span className="text-white">WTA Live Today</span>
        </nav>

        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
          WTA Live Today
        </h1>

        <p className="text-zinc-300 text-lg leading-8 max-w-3xl mb-10">
          Live WTA matches, upcoming start times and official ways to watch today’s women’s tennis.
        </p>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
         <a href="/live-tennis" className="rounded-2xl bg-green-500 px-6 py-4 font-black text-black">Live Scores</a>
<a href="/today" className="rounded-2xl border border-zinc-700 px-6 py-4 font-black">Schedule</a>
<a href="/best-ways-to-watch-tennis-online" className="rounded-2xl border border-zinc-700 px-6 py-4 font-black">How to Watch</a>
        </div>

        {/* WTA-specific highlights */}
        <section className="mb-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-black mb-4">Focus: WTA Tour</h2>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <h3 className="font-black text-lg mb-2">Top WTA players</h3>
              <p className="text-zinc-400 leading-6">
                Follow top women’s players, contenders and Grand Slam prospects.
              </p>
            </div>

            <div>
              <h3 className="font-black text-lg mb-2">WTA 1000 & Contenders</h3>
              <p className="text-zinc-400 leading-6">
                Schedules for WTA 1000 events and players to watch in majors.
              </p>
            </div>
          </div>
        </section>


        <section className="mb-14">
          <h2 className="text-4xl font-black mb-6">🔴 WTA Live Now</h2>

         {liveWtaMatches.length > 0 ? (
            <div className="space-y-5">
              {liveWtaMatches.map((match) => (
                <a
                  key={match.id}
                  href={`/watch/${matchSlug(match)}`}
                  className="block bg-zinc-900 border border-red-500 rounded-3xl p-6 hover:scale-[1.01] transition-all"
                >
                  <div className="flex justify-between gap-4 mb-4">
                    <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
                      🔴 LIVE NOW
                    </span>

                    <span className="text-zinc-400">{match.category}</span>
                  </div>

                  <h3 className="text-3xl font-black mb-3">
                    {match.player1}
                    <br />
                    vs
                    <br />
                    {match.player2}
                  </h3>

                  <a
                    href={`/tournament/${slugify(match.tournament)}`}
                    className="text-zinc-400 hover:text-green-400 transition-colors inline-block mb-3"
                  >
                    {match.tournament}
                  </a>

                  <p className="text-zinc-300">
                    Score: <span className="font-bold">{match.score || "-"}</span>
                  </p>
                </a>
              ))}
            </div>
          ) : ( 
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <h3 className="text-2xl font-black mb-3">
                No WTA matches live right now
              </h3>

              <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
  WTA schedules may change throughout the day depending on weather,
  tournament delays and broadcaster updates. You can still explore
  upcoming matches, Grand Slam coverage and player pages across
  Watch Tennis Today.
</p>

              <p className="text-zinc-400 leading-8">
                Check upcoming WTA matches below or visit the full live tennis
                schedule for ATP, WTA, Challenger and ITF matches.
              </p>
            </div>
        )} 
        </section>

        <section className="mb-14">
          <h2 className="text-4xl font-black mb-6">
            ⏰ Upcoming WTA Matches Today
          </h2>

         {upcomingWtaMatches.length > 0 ? (
            <div className="space-y-5">
              {upcomingWtaMatches.map((match) => (
                <a
                  key={match.id}
                  href={`/watch/${matchSlug(match)}`}
                  className="block bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-green-500 transition-all"
                >
                  <div className="flex justify-between gap-4 mb-4">
                    <span className="bg-zinc-700 text-white text-xs font-black px-3 py-1 rounded-full">
                      {match.status}
                    </span>

                    <span className="text-zinc-400">{match.category}</span>
                  </div>

                  <h3 className="text-3xl font-black mb-3">
                    {match.player1}
                    <br />
                    vs
                    <br />
                    {match.player2}
                  </h3>

                  <a
                    href={`/tournament/${slugify(match.tournament)}`}
                    className="text-zinc-400 hover:text-green-400 transition-colors inline-block mb-3"
                  >
                    {match.tournament}
                  </a>

                  <p className="text-zinc-400">
                    Start time: {formatDateTime(match.startTime)}
                  </p>
                </a>
              ))}
            </div>
          ) : ( 
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <h3 className="text-2xl font-black mb-3">
                No upcoming WTA matches found
              </h3>

              <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
  Upcoming WTA schedules are updated regularly as tournaments confirm
  match times and court assignments.
</p>

              <p className="text-zinc-400 leading-8">
                There may be no WTA matches available in the current schedule.
                Check live tennis or the full TV schedule.
              </p>
            </div>
        )} 
        </section>

        <section className="mb-14 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
          <h2 className="text-4xl font-black mb-5">⭐ Featured WTA Players</h2>

          <p className="text-zinc-400 leading-8 mb-6">
            Follow popular WTA players, live matches, schedules and streaming
            information.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {featuredWtaPlayers.map((player) => (
              <a
                key={player.slug}
                href={`/player/${player.slug}`}
                className="bg-black border border-zinc-800 rounded-2xl p-5 font-black hover:border-green-500 hover:text-green-400 transition-all"
              >
                {player.name} live matches
              </a>
            ))}
          </div>
        </section>

        <section className="mb-14 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
          <h2 className="text-4xl font-black mb-5">
            📺 Where to Watch WTA Tennis Today
          </h2>

          <p className="text-zinc-300 leading-8 mb-6">
            WTA tennis matches may be available through official WTA streaming
            services, sports broadcasters and regional TV channels depending on
            your country.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/best-ways-to-watch-tennis-online"
              className="rounded-2xl bg-green-500 px-6 py-4 font-black text-black hover:bg-green-400 transition-all"
            >
              Best Ways to Watch Tennis Online
            </a>

            <Link
              href="/watch"
              className="rounded-2xl border border-zinc-700 px-6 py-4 font-black hover:border-green-500 hover:text-green-400 transition-all"
            >
              Where to Watch Tennis
            </Link>
          </div>
        </section>

        <section className="mb-14 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
          <h2 className="text-4xl font-black mb-5">
            🌍 Watching WTA tennis while traveling?
          </h2>

          <p className="text-zinc-300 leading-8 mb-6">
            If you travel during WTA tournaments, your usual tennis streaming
            service may not work the same way abroad.
          </p>

          <a
            href="/best-vpn-for-tennis-streaming"
            className="inline-block rounded-2xl bg-green-500 px-6 py-4 font-black text-black hover:bg-green-400 transition-all"
          >
            Best VPN for Tennis Streaming
          </a>
        </section>

        <section className="mb-14 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
          <h2 className="text-4xl font-black mb-6">WTA Tennis FAQ</h2>

          <div className="space-y-6 text-zinc-300 leading-8">
            <div>
              <h3 className="text-xl text-white font-black mb-2">
                What WTA matches are live today?
              </h3>

              <p>
                This page lists WTA matches from today&apos;s tennis schedule,
                including live, upcoming and suspended matches.
              </p>
            </div>

            <div>
              <h3 className="text-xl text-white font-black mb-2">
                Where can I watch WTA tennis today?
              </h3>

              <p>
                WTA matches may be available on official streaming services,
                sports TV channels and regional broadcasters depending on your
                country.
              </p>
            </div>

            <div>
              <h3 className="text-xl text-white font-black mb-2">
                What channel shows WTA tennis?
              </h3>

              <p>
                WTA TV coverage depends on your location and the tournament.
              </p>
            </div>

            <div>
              <h3 className="text-xl text-white font-black mb-2">
                Can I watch WTA tennis while traveling?
              </h3>

              <p>
                Yes, but streaming access may differ by country. Use official
                streaming services and check whether your usual tennis platform
                works while abroad.
              </p>
            </div>
          </div>
        </section>

        <VpnPromo />

        <RelatedMoneyLinks />
      </div>
    </main>
  );

}

import { headers } from "next/headers";
import VpnPromo from "@/app/components/VpnPromo";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";

export const dynamic = "force-dynamic";

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

const grandSlams = [
  "Australian Open",
  "French Open",
  "Roland Garros",
  "Wimbledon",
  "US Open",
];

export const metadata = {
  title: "Grand Slam Tennis Live Today | Schedule, Streams & TV",
  description:
    "Watch Grand Slam tennis live today. Find Australian Open, French Open, Wimbledon and US Open matches, schedules, scores and streaming options.",
};

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) return "http://localhost:3000";

  const protocol = host.includes("localhost") ? "http" : "https";

  return `${protocol}://${host}`;
}

async function getMatches(): Promise<Match[]> {
  const baseUrl = await getBaseUrl();

  const response = await fetch(`${baseUrl}/api/matches`, {
    cache: "no-store",
  });

  if (!response.ok) return [];

  const data = await response.json();

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.matches)) return data.matches;

  return [];
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

function isGrandSlam(tournament: string) {
  const value = tournament.toLowerCase();

  return grandSlams.some((slam) => value.includes(slam.toLowerCase()));
}

export default async function GrandSlamLivePage() {
  const matches = await getMatches();

  const grandSlamMatches = matches
    .filter((match) => isGrandSlam(match.tournament))
    .sort((a, b) => {
      const statusDiff = statusPriority(a.status) - statusPriority(b.status);

      if (statusDiff !== 0) return statusDiff;

      if (!a.startTime) return 1;
      if (!b.startTime) return -1;

      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

  const liveGrandSlamMatches = grandSlamMatches.filter(
    (match) => match.status === "LIVE"
  );

  const upcomingGrandSlamMatches = grandSlamMatches.filter(
    (match) => match.status !== "LIVE"
  );

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <nav className="text-sm text-zinc-400 mb-8 flex flex-wrap gap-2">
          <a href="/" className="hover:text-white">
            Home
          </a>

          <span>/</span>

          <span className="text-white">Grand Slam Live</span>
        </nav>

        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
          🏆 Grand Slam Tennis Live Today
        </h1>

        <p className="text-zinc-300 text-lg leading-8 max-w-3xl mb-10">
          Watch Grand Slam tennis live today with match schedules, live scores,
          TV channels and official streaming options for Australian Open, French
          Open, Wimbledon and US Open matches.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <a
            href="/live-tennis"
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-red-500 hover:text-red-400 transition-all"
          >
            🔴 Live Tennis
          </a>

          <a
            href="/atp-live-today"
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-green-500 hover:text-green-400 transition-all"
          >
            ATP Live Today
          </a>

          <a
            href="/wta-live-today"
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-yellow-500 hover:text-yellow-400 transition-all"
          >
            WTA Live Today
          </a>

          <a
            href="/best-vpn-for-tennis-streaming"
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 font-black hover:border-green-500 hover:text-green-400 transition-all"
          >
            🔐 Tennis VPN Guide
          </a>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-500 text-sm mb-2">Grand Slam matches</p>
            <p className="text-4xl font-black">{grandSlamMatches.length}</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-500 text-sm mb-2">Live now</p>
            <p className="text-4xl font-black text-red-400">
              {liveGrandSlamMatches.length}
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <p className="text-zinc-500 text-sm mb-2">Upcoming / paused</p>
            <p className="text-4xl font-black text-yellow-400">
              {upcomingGrandSlamMatches.length}
            </p>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-4xl font-black mb-6">
            🔴 Live Grand Slam Matches
          </h2>

          {liveGrandSlamMatches.length > 0 ? (
            <div className="space-y-5">
              {liveGrandSlamMatches.map((match) => (
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
                    Score:{" "}
                    <span className="font-bold">{match.score || "-"}</span>
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
              <h3 className="text-2xl font-black mb-3">
                No Grand Slam matches live right now
              </h3>

              <p className="text-zinc-400 leading-8">
                There may be no Grand Slam tennis matches in the current live
                schedule. Check ATP, WTA or the full live tennis page for more
                matches.
              </p>
            </div>
          )}
        </section>

        <section className="mb-14">
          <h2 className="text-4xl font-black mb-6">
            ⏰ Upcoming Grand Slam Matches
          </h2>

          {upcomingGrandSlamMatches.length > 0 ? (
            <div className="space-y-5">
              {upcomingGrandSlamMatches.map((match) => (
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
                No upcoming Grand Slam matches found
              </h3>

              <p className="text-zinc-400 leading-8">
                Check back during Australian Open, French Open, Wimbledon or US
                Open for live Grand Slam schedules.
              </p>
            </div>
          )}
        </section>

        <section className="mb-14 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
          <h2 className="text-4xl font-black mb-5">
            🏆 Grand Slam Tournaments
          </h2>

          <p className="text-zinc-400 leading-8 mb-6">
            Follow live matches, schedules and streaming coverage for the four
            major tennis tournaments.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grandSlams.map((slam) => (
              <a
                key={slam}
                href={`/tournament/${slugify(slam)}`}
                className="bg-black border border-zinc-800 rounded-2xl p-5 font-black hover:border-green-500 hover:text-green-400 transition-all"
              >
                {slam}
              </a>
            ))}
          </div>
        </section>

        <section className="mb-14 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
          <h2 className="text-4xl font-black mb-5">
            📺 Where to Watch Grand Slam Tennis
          </h2>

          <p className="text-zinc-300 leading-8 mb-6">
            Grand Slam tennis broadcasts depend on your country and tournament
            rights. Australian Open, French Open, Wimbledon and US Open matches
            may be shown by different official TV channels and streaming
            services around the world.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/best-ways-to-watch-tennis-online"
              className="rounded-2xl bg-green-500 px-6 py-4 font-black text-black hover:bg-green-400 transition-all"
            >
              Best Ways to Watch Tennis Online
            </a>

            <a
              href="/watch"
              className="rounded-2xl border border-zinc-700 px-6 py-4 font-black hover:border-green-500 hover:text-green-400 transition-all"
            >
              Where to Watch Tennis
            </a>
          </div>
        </section>

        <section className="mb-14 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
          <h2 className="text-4xl font-black mb-5">
            🌍 Watching Grand Slam tennis abroad?
          </h2>

          <p className="text-zinc-300 leading-8 mb-6">
            If you travel during Grand Slam tournaments, your usual tennis
            streaming service may not work the same way abroad. Learn how a VPN
            can help protect your connection while watching tennis on hotel,
            airport or public Wi-Fi.
          </p>

          <a
            href="/best-vpn-for-tennis-streaming"
            className="inline-block rounded-2xl bg-green-500 px-6 py-4 font-black text-black hover:bg-green-400 transition-all"
          >
            Best VPN for Tennis Streaming
          </a>
        </section>

        <VpnPromo
          title="Watching Grand Slams while traveling?"
          text="Grand Slam coverage may vary by region. A VPN helps access your subscriptions safely when abroad."
        />

        <section className="mb-14 bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
          <h2 className="text-4xl font-black mb-6">Grand Slam Tennis FAQ</h2>

          <div className="space-y-6 text-zinc-300 leading-8">
            <div>
              <h3 className="text-xl text-white font-black mb-2">
                What Grand Slam tennis matches are live today?
              </h3>

              <p>
                This page lists Grand Slam matches from the current tennis
                schedule, including live, upcoming and suspended matches when
                available.
              </p>
            </div>

            <div>
              <h3 className="text-xl text-white font-black mb-2">
                Where can I watch Grand Slam tennis?
              </h3>

              <p>
                Grand Slam matches may be available on official streaming
                services, sports TV channels and regional broadcasters depending
                on your country.
              </p>
            </div>

            <div>
              <h3 className="text-xl text-white font-black mb-2">
                Which tournaments are Grand Slams?
              </h3>

              <p>
                The four Grand Slam tournaments are Australian Open, French Open,
                Wimbledon and US Open.
              </p>
            </div>

            <div>
              <h3 className="text-xl text-white font-black mb-2">
                Can I watch Grand Slam tennis while traveling?
              </h3>

              <p>
                Yes, but streaming access may differ by country. Use official
                streaming services and check whether your usual tennis platform
                works while abroad.
              </p>
            </div>
          </div>
        </section>

        <RelatedMoneyLinks />

    
      </div>
    </main>
  );
}

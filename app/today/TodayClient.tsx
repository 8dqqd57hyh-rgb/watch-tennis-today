"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchClientMatches } from "@/app/lib/clientMatchFetch";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import AdSenseEditorialBlock from "@/app/components/AdSenseEditorialBlock";
import TennisTimeZonePlanner from "@/app/components/TennisTimeZonePlanner";
import SpoilerFreeScoreToggle, { SpoilerSafeScore, useSpoilerFreeScores } from "@/app/components/SpoilerFreeScoreToggle";
import { safePlayerUrl, safeWatchPlayerLiveUrl } from "@/data/playerSlugs";

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score: string;
  startTime: string;
};

const trendingPlayers = [
  "Jannik Sinner",
  "Carlos Alcaraz",
  "Novak Djokovic",
  "Aryna Sabalenka",
  "Iga Swiatek",
  "Coco Gauff",
];

const countries = [
  "usa",
  "uk",
  "poland",
  "germany",
  "france",
  "italy",
  "spain",
  "canada",
  "australia",
];

const TODAY_MATCHES_URL = "/api/matches?includeFinished=1&daysBack=0&daysForward=1";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function matchSlug(match: Match) {
  return slugify(`${match.player1}-vs-${match.player2}`);
}

function readableCountry(country: string) {
  return country
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatTime(value: string) {
  if (!value) return "Time TBC";

  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function isLiveStatus(status: string) {
  return status.toUpperCase() === "LIVE";
}

function isCompletedStatus(status: string) {
  return ["FINISHED", "COMPLETED", "FT", "ENDED"].includes(status.toUpperCase());
}

function isUpcomingStatus(status: string) {
  const normalized = status.toUpperCase();
  return ["UPCOMING", "SCHEDULED", "NOT STARTED"].includes(normalized) || (!isLiveStatus(status) && !isCompletedStatus(status));
}

function localDateKey(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-CA");
}

function isTodayMatch(match: Match) {
  const matchDate = localDateKey(match.startTime);
  const today = localDateKey(new Date().toISOString());

  return Boolean(matchDate && today && matchDate === today);
}

function PlayerLink({ name }: { name: string }) {
  const href = safePlayerUrl(name);

  if (!href) return <>{name}</>;

  return (
    <a href={href} className="hover:text-green-400">
      {name}
    </a>
  );
}

function MatchCard({ match, spoilerFree }: { match: Match; spoilerFree: boolean }) {
  const live = isLiveStatus(match.status);

  return (
    <article className="rounded-[2rem] border border-zinc-800 bg-zinc-900 p-6 hover:border-green-500 transition-all">
      <div className="flex items-center justify-between mb-5">
        <span
          className={`text-xs font-black px-3 py-1 rounded-full ${
            live
              ? "bg-red-500 text-white animate-pulse"
              : isCompletedStatus(match.status)
                ? "bg-zinc-200 text-zinc-950"
                : "bg-zinc-700 text-zinc-200"
          }`}
        >
          {match.status || "Scheduled"}
        </span>

        <span className="text-zinc-400">{match.category}</span>
      </div>

      <h3 className="text-3xl font-black leading-tight mb-4">
        <PlayerLink name={match.player1} />
        <br />
        vs
        <br />
        <PlayerLink name={match.player2} />
      </h3>

      <p className="text-zinc-400 mb-3">
        <a href={`/tournament/${slugify(match.tournament)}`} className="hover:text-green-400">
          {match.tournament}
        </a>
      </p>

      <p className="text-zinc-500 text-sm mb-3">
        {formatTime(match.startTime)}
      </p>

      <p className="mb-5 text-sm font-black text-zinc-200">
        Score: <SpoilerSafeScore score={match.score} hidden={spoilerFree} />
      </p>

      <div className="inline-block bg-green-500 text-black px-5 py-3 rounded-2xl font-black">
        <a href={`/match/${matchSlug(match)}`}>Match details</a>
      </div>
    </article>
  );
}

function MatchSection({
  title,
  intro,
  matches,
  spoilerFree,
}: {
  title: string;
  intro: string;
  matches: Match[];
  spoilerFree: boolean;
}) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <h2 className="text-4xl font-black">{title}</h2>
        <p className="mt-3 max-w-3xl text-zinc-400 leading-7">{intro}</p>
      </div>

      {matches.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {matches.slice(0, 9).map((match) => (
            <MatchCard key={match.id} match={match} spoilerFree={spoilerFree} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 text-zinc-300 leading-7">
          No matches are currently listed in this group. Check the full tennis schedule, tournament pages or tomorrow&apos;s schedule because court assignments and feeds can update close to start time.
        </div>
      )}
    </section>
  );
}


export default function TodayPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [spoilerFree, setSpoilerFree] = useSpoilerFreeScores();

  useEffect(() => {
    async function loadMatches() {
      try {
        const safeMatches = await fetchClientMatches(TODAY_MATCHES_URL, {
          ttlMs: 30_000,
          timeoutMs: 8000,
        });
        setMatches((safeMatches as Match[]).filter(isTodayMatch));
      } catch {
        setMatches([]);
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, []);

  const liveMatches = matches.filter((match) => isLiveStatus(match.status));
  const upcomingMatches = matches.filter((match) => isUpcomingStatus(match.status));
  const completedMatches = matches.filter((match) => isCompletedStatus(match.status));
  const todayMatches = matches.slice(0, 24);
  const featuredMatches = [
    ...liveMatches,
    ...upcomingMatches.filter((match) => match.category === "ATP" || match.category === "WTA"),
    ...todayMatches,
  ].slice(0, 3);

  const featuredMatch =
    liveMatches[0] ||
    matches.find((match) => match.category === "ATP" || match.category === "WTA") ||
    matches[0];

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-zinc-400 hover:text-white">
          ← Back
        </Link>

        <section className="mt-8 mb-12">
          <div className="inline-flex items-center rounded-full bg-green-500/20 px-4 py-2 text-sm font-bold text-green-400 mb-5">
            📅 Tennis today
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Tennis Today: Live Matches, Scores & TV Schedule
          </h1>

          <p className="text-zinc-400 text-lg leading-8 max-w-3xl">
            Check tennis matches today, including live ATP, WTA, Challenger and
            Grand Slam coverage, start times, scores, tournaments and official
            streaming options.
          </p>

          <p className="text-zinc-400 mt-4 max-w-3xl">
  Watch Tennis Today does not host, embed or restream live tennis broadcasts.
  We provide match schedules, live score information and links to official
  broadcaster resources only.
</p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <div className="inline-flex items-center rounded-full bg-red-500/20 px-4 py-2 text-sm font-bold text-red-400">
              🔴 Live updates
            </div>

            <p className="text-zinc-500 text-sm">
              Last updated:{" "}
              {new Date().toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </section>

        <SpoilerFreeScoreToggle enabled={spoilerFree} onChange={setSpoilerFree} />

        <AdSenseEditorialBlock
          title="How we read today’s tennis schedule"
          intro="A daily tennis schedule can change quickly because courts run long, weather delays happen and broadcasters sometimes switch coverage between matches. This page is designed to be useful even when the live feed is quiet."
          paragraphs={[
            "Use the match list as a practical starting point, not as an illegal stream directory. We focus on start windows, tournament names, player pages and official broadcaster resources so fans can confirm where a match is legitimately available in their country.",
            "When there are no matches in the current feed, the safest next checks are tomorrow’s schedule, the TV schedule and official tournament pages. Tennis often has gaps between sessions, especially after late-night finishes or during the transition between weekly events.",
            "For the best experience, compare the local start time with your own timezone, check whether the match is ATP, WTA, Challenger or Grand Slam, and open player or tournament pages for more context before choosing a legal viewing option.",
          ]}
          checklist={[
            "Confirm the tournament and session first.",
            "Use official broadcaster links only.",
            "Check tomorrow if today’s feed is empty.",
            "Use spoiler-free scores when you plan to watch later.",
          ]}
          links={[
            { href: "/tomorrow", label: "Tomorrow schedule" },
            { href: "/tv-schedule", label: "TV schedule" },
            { href: "/how-to-watch-tennis-legally", label: "Legal viewing guide" },
          ]}
        />

        <TennisTimeZonePlanner matches={matches} />

        {featuredMatch ? (
          <section className="mb-14 rounded-[2.5rem] border border-green-500 bg-gradient-to-br from-zinc-900 to-black p-8">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="bg-red-500 text-white text-sm font-black px-4 py-2 rounded-full">
                {featuredMatch.status}
              </span>

              <span className="text-zinc-400">
                {featuredMatch.category}
              </span>

              <span className="text-zinc-500">•</span>

              <a
                href={`/tournament/${slugify(featuredMatch.tournament)}`}
                className="text-zinc-400 hover:text-green-400"
              >
                {featuredMatch.tournament}
              </a>
            </div>

            <h2 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              {featuredMatch.player1}
              <br />
              vs
              <br />
              {featuredMatch.player2}
            </h2>

            <div className="flex flex-wrap gap-6 mb-8 text-lg">
              <div>
                <p className="text-zinc-500 text-sm mb-1">Score</p>
                <p className="font-black"><SpoilerSafeScore score={featuredMatch.score} hidden={spoilerFree} /></p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm mb-1">Start Time</p>
                <p className="font-black">{formatTime(featuredMatch.startTime)}</p>
              </div>
            </div>

            <a
              href={`/match/${matchSlug(featuredMatch)}`}
              className="inline-flex items-center rounded-2xl bg-green-500 px-6 py-4 text-lg font-black text-black hover:bg-green-400 transition-all"
            >
              Open Match Page →
            </a>
          </section>
        ) : null}

        {featuredMatches.length ? (
          <section className="mb-16">
            <div className="mb-6">
              <h2 className="text-4xl font-black">Featured matches of the day</h2>
              <p className="mt-3 max-w-3xl text-zinc-400 leading-7">
                Start here for the matches most likely to matter for live viewing: active matches, ATP/WTA fixtures and player pages with useful context.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featuredMatches.map((match) => (
                <MatchCard key={`featured-${match.id}`} match={match} spoilerFree={spoilerFree} />
              ))}
            </div>
          </section>
        ) : null}

        {loading ? (
          <p className="text-zinc-500 text-xl">
            Loading today&apos;s tennis matches...
          </p>
        ) : todayMatches.length === 0 ? (
         <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
  <h2 className="text-3xl font-black mb-4">
    No tennis matches found for today
  </h2>

  <p className="text-zinc-300 leading-8 mb-6">
    No matches are currently scheduled in the live feed. Check today&apos;s tennis
    schedule later, open tournament pages, or use the TV schedule to verify
    official coverage while new order-of-play data is being published.
  </p>

  <div className="flex flex-wrap gap-4">
    <a href="/live-tennis" className="rounded-2xl border border-zinc-700 px-5 py-3 font-bold hover:border-green-500 hover:text-green-400 transition-all">
      Live Tennis →
    </a>
    <a href="/atp-live-today" className="rounded-2xl border border-zinc-700 px-5 py-3 font-bold hover:border-green-500 hover:text-green-400 transition-all">
      ATP Matches →
    </a>
    <a href="/wta-live-today" className="rounded-2xl border border-zinc-700 px-5 py-3 font-bold hover:border-green-500 hover:text-green-400 transition-all">
      WTA Matches →
    </a>
    <Link href="/tv-schedule" className="rounded-2xl border border-zinc-700 px-5 py-3 font-bold hover:border-green-500 hover:text-green-400 transition-all">
      TV Schedule →
    </Link>
  </div>
</div>
        ) : (
          <>
            <MatchSection
              title="Live tennis matches now"
              intro="Live rows are the best place to follow active score movement, then open the match page for player and tournament links."
              matches={liveMatches}
              spoilerFree={spoilerFree}
            />
            <MatchSection
              title="Upcoming tennis matches today"
              intro="Upcoming times are start windows. Previous matches, weather and court changes can move the real start, so verify the official order of play."
              matches={upcomingMatches}
              spoilerFree={spoilerFree}
            />
            <MatchSection
              title="Completed tennis matches today"
              intro="Completed rows help fans catch up on results, open match pages and continue to player or tournament coverage."
              matches={completedMatches}
              spoilerFree={spoilerFree}
            />
          </>
        )}

        <section className="mb-16">
          <h2 className="text-3xl font-black mb-6">
            ⭐ Trending Tennis Players Today
          </h2>

          <div className="flex flex-wrap gap-3">
            {trendingPlayers.map((player) => {
              const href = safeWatchPlayerLiveUrl(player);

              if (!href) return null;

              return (
                <a
                  key={player}
                  href={href}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 font-bold hover:border-yellow-500 hover:text-yellow-400 transition-all"
                >
                  ⭐ {player}
                </a>
              );
            })}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-black mb-6">
            🌍 Watch Tennis Today by Country
          </h2>

          <div className="flex flex-wrap gap-3">
            {countries.map((country) => (
              <a
                key={country}
                href={`/watch-tennis-in/${country}`}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 font-bold hover:border-green-500 hover:text-green-400 transition-all"
              >
                {readableCountry(country)}
              </a>
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full bg-green-500/20 px-4 py-2 text-sm font-bold text-green-400 mb-5">
              🌍 Tennis streaming tip
            </div>

            <h2 className="text-4xl font-black leading-tight mb-5">
              Watching tennis while traveling today?
            </h2>

            <p className="text-zinc-300 text-lg leading-8 mb-8">
              Tennis streaming availability can vary by country and broadcaster.
              Check official streaming services and regional TV channels before
              today&apos;s match starts.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="/best-vpn-for-tennis-streaming"
                className="inline-flex items-center rounded-2xl bg-green-500 px-6 py-4 text-lg font-black text-black hover:bg-green-400 transition-all"
              >
                Best VPN for Tennis Streaming
              </a>

              <a
                href="/how-to-watch-tennis-safely-abroad"
                className="inline-flex items-center rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold hover:border-zinc-500 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-zinc-800 bg-zinc-900 p-8">
          <h2 className="text-3xl font-black mb-5">
            Tennis Today FAQ
          </h2>

          <div className="space-y-6 text-zinc-300 leading-8">
            <div>
              <h3 className="text-2xl font-black text-white mb-2">
                What tennis matches are on today?
              </h3>
              <p>
                Today&apos;s tennis schedule can include ATP, WTA, Challenger,
                ITF and Grand Slam matches depending on the tournament calendar.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white mb-2">
                Where can I watch tennis today?
              </h3>
              <p>
                Tennis matches today may be shown by official broadcasters,
                tournament partners and regional streaming services depending on
                your country.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white mb-2">
                Does Watch Tennis Today stream matches?
              </h3>
              <p>
                No. Watch Tennis Today does not host tennis streams. The site
                helps fans find official schedules, TV channels and legal
                viewing options.
              </p>
            </div>
          </div>
        </section>

        <RelatedMoneyLinks />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://watchtennistoday.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Today's tennis matches",
                  item: "https://watchtennistoday.com/today",
                },
              ],
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What tennis matches are on today?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Today's tennis schedule can include ATP, WTA, Challenger, ITF and Grand Slam matches depending on the tournament calendar.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Where can I watch tennis today?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Tennis matches today may be shown by official broadcasters, tournament partners and regional streaming services depending on your country.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does Watch Tennis Today stream matches?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "No. Watch Tennis Today does not host tennis streams. The site helps fans find official schedules, TV channels and legal viewing options.",
                  },
                },
              ],
            }),
          }}
        />
      </div>
    </main>
  );

}

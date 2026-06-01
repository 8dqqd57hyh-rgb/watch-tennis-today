"use client";

import { withTracking } from "@/app/lib/tracking";

export type MustWatchMatch = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score?: string;
  startTime?: string;
  round?: string;
  watchProviders?: Array<{
    name: string;
    url: string;
    verificationStatus?: string;
    note?: string;
  }>;
};

type Props = {
  matches: MustWatchMatch[];
  compact?: boolean;
};

const STAR_PLAYERS = [
  "Sinner",
  "Alcaraz",
  "Djokovic",
  "Zverev",
  "Medvedev",
  "Swiatek",
  "Sabalenka",
  "Gauff",
  "Rybakina",
  "Osaka",
  "Pegula",
  "Zheng",
];

const GRAND_SLAM_KEYWORDS = [
  "roland",
  "french open",
  "wimbledon",
  "us open",
  "australian open",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function matchSlug(match: MustWatchMatch) {
  const readablePart = slugify(`${match.player1}-vs-${match.player2}`);
  const numericId = String(match.id).split(":").pop();

  return `${readablePart}-${numericId}`;
}

function formatTime(value?: string) {
  if (!value) return "Time TBC";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time TBC";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function hasStar(match: MustWatchMatch) {
  const text = `${match.player1} ${match.player2}`.toLowerCase();
  return STAR_PLAYERS.some((player) => text.includes(player.toLowerCase()));
}

function isGrandSlam(match: MustWatchMatch) {
  const tournament = match.tournament.toLowerCase();
  return GRAND_SLAM_KEYWORDS.some((keyword) => tournament.includes(keyword));
}

function isImportantRound(match: MustWatchMatch) {
  const round = (match.round || "").toLowerCase();
  return ["final", "semi", "quarter", "round of 16", "r16"].some((keyword) => round.includes(keyword));
}

function isSinglesTourMatch(match: MustWatchMatch) {
  const category = (match.category || "").toUpperCase();
  return category === "ATP" || category === "WTA";
}

function matchPriority(match: MustWatchMatch) {
  const status = (match.status || "").toUpperCase();
  let score = 0;

  if (status === "LIVE") score += 120;
  if (status === "UPCOMING" || status === "SCHEDULED") score += 60;
  if (status === "SUSPENDED") score += 45;
  if (hasStar(match)) score += 45;
  if (isGrandSlam(match)) score += 35;
  if (isImportantRound(match)) score += 28;
  if (isSinglesTourMatch(match)) score += 18;
  if (match.watchProviders?.length) score += 8;

  return score;
}

function reasonsFor(match: MustWatchMatch) {
  const reasons: string[] = [];
  const status = (match.status || "").toUpperCase();

  if (status === "LIVE") reasons.push("Live now");
  if (hasStar(match)) reasons.push("star player involved");
  if (isGrandSlam(match)) reasons.push("Grand Slam context");
  if (isImportantRound(match)) reasons.push(match.round || "important round");
  if (isSinglesTourMatch(match)) reasons.push(`${match.category} main tour`);
  if (match.score && status === "LIVE") reasons.push("score updating");

  return reasons.slice(0, 3);
}

function providerFor(match: MustWatchMatch) {
  const providers = match.watchProviders || [];

  return (
    providers.find((provider) => {
      const text = `${provider.verificationStatus || ""} ${provider.note || ""}`.toLowerCase();
      return text.includes("official") || text.includes("verified") || text.includes("broadcaster");
    }) || providers[0]
  );
}

export default function MustWatchMatchesToday({ matches, compact = false }: Props) {
  const picks = [...matches]
    .filter((match) => match.player1 && match.player2 && match.tournament)
    .filter((match) => {
      const status = (match.status || "").toUpperCase();
      return status !== "FINISHED" && status !== "CANCELLED";
    })
    .sort((a, b) => matchPriority(b) - matchPriority(a))
    .slice(0, compact ? 3 : 5);

  if (!picks.length) return null;

  const heroPick = picks[0];
  const heroProvider = providerFor(heroPick);

  return (
    <section className="mb-12 rounded-[2.5rem] border border-amber-400/40 bg-gradient-to-br from-amber-950/25 via-zinc-950 to-black p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-amber-300">
            Today&apos;s watchlist
          </p>
          <h2 className="text-3xl font-black text-white md:text-5xl">
            Must-watch tennis matches today
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400 md:text-base">
            A fast fan-first shortlist: live matches, stars, Grand Slam stakes and important rounds first.
          </p>
        </div>
        <a
          href="/best-tennis-matches-today"
          className="rounded-full border border-amber-300/50 px-5 py-3 text-sm font-black text-amber-200 hover:border-amber-200"
        >
          Full ranked list →
        </a>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[2rem] border border-amber-400/40 bg-black/55 p-5 md:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-black">
              #1 match to open first
            </span>
            <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-bold text-zinc-300">
              {heroPick.category}
            </span>
            <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-bold text-zinc-300">
              {heroPick.status}
            </span>
          </div>

          <h3 className="mb-3 text-3xl font-black leading-tight text-white md:text-4xl">
            {heroPick.player1} vs {heroPick.player2}
          </h3>

          <p className="mb-4 text-sm leading-6 text-zinc-400">
            {heroPick.tournament} · {heroPick.round || "Round TBC"} · {formatTime(heroPick.startTime)}
          </p>

          {heroPick.score ? (
            <p className="mb-4 rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-black text-white">
              Current score: {heroPick.score}
            </p>
          ) : null}

          <div className="mb-5 flex flex-wrap gap-2">
            {reasonsFor(heroPick).map((reason) => (
              <span key={reason} className="rounded-full bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-200">
                {reason}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`/watch/${matchSlug(heroPick)}`}
              className="rounded-full bg-white px-5 py-3 text-sm font-black text-black hover:bg-zinc-200"
            >
              Open match hub →
            </a>
            <a
              href={`/vs/${slugify(heroPick.player1)}-vs-${slugify(heroPick.player2)}`}
              className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-black text-white hover:border-amber-300"
            >
              Compare players
            </a>
            {heroProvider ? (
              <a
                href={withTracking(heroProvider.url, "must_watch_matches_today")}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="rounded-full border border-emerald-500/40 px-5 py-3 text-sm font-black text-emerald-300 hover:border-emerald-300"
              >
                Watch info
              </a>
            ) : null}
          </div>
        </article>

        <div className="grid gap-3">
          {picks.slice(1).map((match, index) => (
            <a
              key={match.id}
              href={`/watch/${matchSlug(match)}`}
              className="rounded-3xl border border-zinc-800 bg-black/45 p-4 hover:border-amber-300/70"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-black text-amber-200">
                  #{index + 2} pick
                </span>
                <span className="text-xs font-bold text-zinc-500">{match.category}</span>
              </div>
              <h3 className="mb-2 text-xl font-black text-white">
                {match.player1} vs {match.player2}
              </h3>
              <p className="text-sm leading-6 text-zinc-400">
                {match.tournament} · {match.round || match.status} · {formatTime(match.startTime)}
              </p>
              <p className="mt-2 text-xs font-bold text-amber-200">
                {reasonsFor(match).join(" · ") || "Daily match pick"}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

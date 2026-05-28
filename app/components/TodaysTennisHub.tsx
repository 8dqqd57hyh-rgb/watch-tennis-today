"use client";

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

type HubProps = {
  matches: Match[];
};

function safeDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function formatTime(value?: string) {
  const date = safeDate(value);
  if (!date) return "Time TBC";

  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

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
  const readablePart = slugify(`${match.player1}-vs-${match.player2}`);
  const numericId = match.id.split(":").pop();

  return `${readablePart}-${numericId}`;
}

function isUpcoming(match: Match) {
  const date = safeDate(match.startTime);
  if (!date) return false;

  return date.getTime() > Date.now() && match.status !== "FINISHED";
}

export default function TodaysTennisHub({ matches }: HubProps) {
  const liveMatches = matches
    .filter((match) => match.status === "LIVE")
    .slice(0, 4);

  const startingSoon = matches
    .filter(isUpcoming)
    .sort((a, b) => {
      const aTime = safeDate(a.startTime)?.getTime() || 0;
      const bTime = safeDate(b.startTime)?.getTime() || 0;
      return aTime - bTime;
    })
    .slice(0, 5);

  const tournaments = [
    ...new Set(
      matches
        .map((match) => match.tournament)
        .filter(Boolean)
        .slice(0, 12)
    ),
  ];

  return (
    <section className="mb-12 rounded-[2.5rem] border border-sky-500/40 bg-sky-950/20 p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-sky-400 px-4 py-2 text-sm font-black text-black">
          ⚡ Today&apos;s Tennis Hub
        </span>
        <span className="text-sm text-zinc-400">
          Built for daily SEO, returning visitors and match discovery
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-zinc-800 bg-black/40 p-5">
          <h2 className="mb-4 text-2xl font-black text-white">Live now</h2>
          {liveMatches.length > 0 ? (
            <div className="space-y-3">
              {liveMatches.map((match) => (
                <a
                  key={match.id}
                  href={`/watch/${matchSlug(match)}`}
                  className="block rounded-2xl border border-zinc-800 bg-zinc-950 p-4 hover:border-red-400"
                >
                  <p className="text-xs font-black uppercase text-red-400">🔴 {match.category}</p>
                  <p className="mt-1 font-black text-white">{match.player1} vs {match.player2}</p>
                  <p className="mt-1 text-sm text-zinc-400">{match.tournament}</p>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-zinc-400 leading-7">
              No highlighted live matches detected right now. Check the live tennis page for the full match list.
            </p>
          )}
          <a href="/live-tennis" className="mt-4 inline-block text-sm font-black text-sky-300 hover:text-sky-200">
            Open live tennis →
          </a>
        </div>

        <div className="rounded-[2rem] border border-zinc-800 bg-black/40 p-5">
          <h2 className="mb-4 text-2xl font-black text-white">Starting soon</h2>
          {startingSoon.length > 0 ? (
            <div className="space-y-3">
              {startingSoon.map((match) => (
                <a
                  key={match.id}
                  href={`/watch/${matchSlug(match)}`}
                  className="block rounded-2xl border border-zinc-800 bg-zinc-950 p-4 hover:border-green-400"
                >
                  <p className="text-xs font-black uppercase text-green-400">⏱ {formatTime(match.startTime)}</p>
                  <p className="mt-1 font-black text-white">{match.player1} vs {match.player2}</p>
                  <p className="mt-1 text-sm text-zinc-400">{match.tournament}</p>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-zinc-400 leading-7">
              Upcoming match times are not available from the current feed yet.
            </p>
          )}
          <a href="/tennis-schedule-today" className="mt-4 inline-block text-sm font-black text-sky-300 hover:text-sky-200">
            See today&apos;s schedule →
          </a>
        </div>

        <div className="rounded-[2rem] border border-zinc-800 bg-black/40 p-5">
          <h2 className="mb-4 text-2xl font-black text-white">Daily tennis guides</h2>
          <div className="grid gap-3">
            <a href="/tennis-schedule-today" className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-bold hover:border-sky-400">Today&apos;s tennis schedule</a>
            <a href="/tennis-order-of-play-today" className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-bold hover:border-sky-400">Order of play today</a>
            <a href="/tennis-results-today" className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-bold hover:border-sky-400">Tennis results today</a>
            <a href="/watch-tennis-live-today" className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-bold hover:border-sky-400">Watch tennis live today</a>
          </div>
          {tournaments.length > 0 ? (
            <p className="mt-4 text-sm leading-6 text-zinc-500">
              Current feed includes: {tournaments.slice(0, 4).join(", ")}.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

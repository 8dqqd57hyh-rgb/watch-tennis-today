type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score: string;
  startTime: string;
  round?: string;
};

type HomepageGrowthEngineProps = {
  matches: Match[];
};

const grandSlamLinks = [
  {
    name: "Wimbledon",
    href: "/wimbledon-live",
    scheduleHref: "/tennis-schedule-today",
    tvHref: "/watch-tennis-in/uk",
    terms: ["wimbledon"],
  },
  {
    name: "US Open",
    href: "/grand-slam-live",
    scheduleHref: "/tennis-schedule-today",
    tvHref: "/watch-tennis-in/usa",
    terms: ["us open"],
  },
  {
    name: "Australian Open",
    href: "/grand-slam-live",
    scheduleHref: "/tennis-schedule-today",
    tvHref: "/watch-tennis-in/australia",
    terms: ["australian open"],
  },
];

const priorityTerms = [
  "sinner",
  "alcaraz",
  "djokovic",
  "swiatek",
  "sabalenka",
  "gauff",
  "zverev",
  "medvedev",
  "fonseca",
  "mensik",
  "michelsen",
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

function matchSlug(match: Match) {
  const readablePart = slugify(`${match.player1}-vs-${match.player2}`);
  const numericId = match.id.split(":").pop();
  return `${readablePart}-${numericId}`;
}

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
    month: "short",
    day: "numeric",
  }).format(date);
}

function scoreMatch(match: Match) {
  const text = `${match.player1} ${match.player2} ${match.tournament} ${match.round || ""}`.toLowerCase();
  const status = (match.status || "").toUpperCase();
  const category = (match.category || "").toUpperCase();
  let score = 0;

  if (status === "LIVE") score += 100;
  if (category === "ATP") score += 25;
  if (category === "WTA") score += 25;
  if (category === "CHALLENGER") score += 8;
  if (priorityTerms.some((term) => text.includes(term))) score += 45;
  if (grandSlamLinks.some((slam) => slam.terms.some((term) => text.includes(term)))) score += 35;
  if ((match.round || "").toLowerCase().includes("final")) score += 35;
  if ((match.round || "").toLowerCase().includes("semi")) score += 20;

  const startTime = safeDate(match.startTime)?.getTime();
  if (startTime && startTime > Date.now()) {
    const hoursAway = (startTime - Date.now()) / 36e5;
    if (hoursAway <= 4) score += 25;
    else if (hoursAway <= 12) score += 12;
  }

  return score;
}

function getFeaturedSlam(matches: Match[]) {
  const activeSlam = grandSlamLinks.find((slam) =>
    matches.some((match) =>
      slam.terms.some((term) => match.tournament.toLowerCase().includes(term))
    )
  );

  return activeSlam || {
    name: "Grand Slam spotlight",
    href: "/grand-slam-live",
    scheduleHref: "/tennis-schedule-today",
    tvHref: "/tennis-streaming-services",
    terms: [],
  };
}

function getTopTournaments(matches: Match[]) {
  const counts = new Map<string, number>();

  matches.forEach((match) => {
    if (!match.tournament) return;
    counts.set(match.tournament, (counts.get(match.tournament) || 0) + scoreMatch(match) + 1);
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name]) => name);
}

export default function HomepageGrowthEngine({ matches }: HomepageGrowthEngineProps) {
  const filteredMatches = [...matches].filter((match) => {
    const status = (match.status || "").toUpperCase();
    return status !== "FINISHED" && status !== "CANCELLED";
  });

  const bestMatches = filteredMatches
    .sort((a, b) => scoreMatch(b) - scoreMatch(a))
    .slice(0, 6);

  const fallbackMatches = filteredMatches.slice(0, 6);
  const displayMatches = bestMatches.length > 0 ? bestMatches : fallbackMatches;

  const featuredSlam = getFeaturedSlam(matches);
  const topTournaments = getTopTournaments(matches);
  const liveCount = matches.filter((match) => (match.status || "").toUpperCase() === "LIVE").length;
  const upcomingCount = matches.filter((match) => {
    const status = (match.status || "").toUpperCase();
    return status !== "LIVE" && status !== "FINISHED" && status !== "CANCELLED";
  }).length;

  return (
    <section className="mb-12 space-y-6">
      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[2.5rem] border border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-950/40 via-zinc-950 to-black p-6 md:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-fuchsia-400 px-4 py-2 text-sm font-black text-black">
              🔥 Trending now
            </span>
            <span className="text-sm text-zinc-400">
              A cleaner homepage layer for daily SEO, deeper sessions and match discovery
            </span>
          </div>

          <h2 className="mb-4 text-4xl font-black md:text-5xl">
            Best tennis matches to follow today
          </h2>

          <p className="mb-6 max-w-3xl text-zinc-300 leading-7">
            Use this daily hub to jump from the homepage into the strongest match pages,
            tournament guides and legal viewing routes instead of leaving after one result.
          </p>

          {displayMatches.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {displayMatches.map((match, index) => (
                <a
                  key={match.id}
                  href={`/watch/${matchSlug(match)}`}
                  className="rounded-3xl border border-zinc-800 bg-black/45 p-5 transition-all hover:border-fuchsia-300 hover:bg-zinc-950"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-black text-fuchsia-200">
                      #{index + 1} Match pick
                    </span>
                    <span className="text-xs font-bold text-zinc-500">{match.category}</span>
                  </div>

                  <h3 className="mb-3 text-2xl font-black leading-tight">
                    {match.player1} vs {match.player2}
                  </h3>

                  <p className="mb-3 text-sm leading-6 text-zinc-400">
                    {match.tournament}{match.round ? ` · ${match.round}` : ""}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-full bg-red-500/15 px-3 py-1 font-bold text-red-300">
                      {match.status}
                    </span>
                    <span className="rounded-full bg-zinc-900 px-3 py-1 font-bold text-zinc-300">
                      {formatTime(match.startTime)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-black/40 p-6 text-zinc-400">
              No strong match picks are available from the current feed yet. Check the schedule pages for updates.
            </div>
          )}
        </div>

        <aside className="rounded-[2.5rem] border border-orange-500/40 bg-gradient-to-br from-orange-950/35 to-black p-6 md:p-8">
          <span className="mb-4 inline-flex rounded-full bg-orange-400 px-4 py-2 text-sm font-black text-black">
            🏆 Grand Slam spotlight
          </span>

          <h2 className="mb-4 text-3xl font-black">{featuredSlam.name}</h2>

          <p className="mb-6 text-zinc-300 leading-7">
            Grand Slam rights are country-specific. Send users to tournament,
            schedule and TV pages before they bounce back to Google.
          </p>

          <div className="grid gap-3">
            <a href={featuredSlam.href} className="rounded-2xl bg-orange-400 px-5 py-4 font-black text-black hover:bg-orange-300">
              Open tournament hub →
            </a>
            <a href={featuredSlam.scheduleHref} className="rounded-2xl border border-zinc-700 px-5 py-4 font-bold hover:border-orange-300">
              Check schedule
            </a>
            <a href={featuredSlam.tvHref} className="rounded-2xl border border-zinc-700 px-5 py-4 font-bold hover:border-orange-300">
              Find TV channels
            </a>
          </div>
        </aside>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-green-400">Live demand</p>
          <h3 className="mb-3 text-3xl font-black">{liveCount} live matches</h3>
          <p className="mb-5 text-zinc-400 leading-7">
            Keep users moving from homepage to live match pages, not generic search results.
          </p>
          <a href="/live-tennis" className="font-black text-green-300 hover:text-green-200">Open live hub →</a>
        </div>

        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-yellow-400">Schedule intent</p>
          <h3 className="mb-3 text-3xl font-black">{upcomingCount} upcoming</h3>
          <p className="mb-5 text-zinc-400 leading-7">
            Capture users who search before a match starts with schedule and TV links.
          </p>
          <a href="/tennis-schedule-today" className="font-black text-yellow-300 hover:text-yellow-200">Today&apos;s schedule →</a>
        </div>

        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <p className="mb-2 text-sm font-black uppercase tracking-[0.2em] text-cyan-400">Money path</p>
          <h3 className="mb-3 text-3xl font-black">Streaming check</h3>
          <p className="mb-5 text-zinc-400 leading-7">
            Route users from match intent to legal services, country guides and travel viewing help.
          </p>
          <a href="/tennis-streaming-services" className="font-black text-cyan-300 hover:text-cyan-200">Compare services →</a>
        </div>
      </div>

      {topTournaments.length > 0 ? (
        <div className="rounded-[2rem] border border-zinc-800 bg-zinc-950/80 p-6">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-black">
              🎾 Tournament paths
            </span>
            <span className="text-sm text-zinc-400">
              Internal links from homepage to tournament intent
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {topTournaments.map((tournament) => (
              <a
                key={tournament}
                href={`/tournament/${slugify(tournament)}`}
                className="rounded-2xl border border-zinc-800 bg-black px-5 py-3 font-bold hover:border-white"
              >
                {tournament}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

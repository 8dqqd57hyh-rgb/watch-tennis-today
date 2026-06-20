import { withTracking } from "@/app/lib/tracking";
import { affiliateLinks } from "@/app/lib/affiliateLinks";
import { safePlayerUrl } from "@/data/playerSlugs";

type WatchProvider = {
  name: string;
  url: string;
  accessType?: string;
  verificationStatus?: string;
  note?: string;
};

type Match = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score?: string;
  startTime?: string;
  watchProviders?: WatchProvider[];
  round?: string;
};

type Props = {
  matches: Match[];
};

const priorityPlayers = [
  "Jannik Sinner",
  "Carlos Alcaraz",
  "Novak Djokovic",
  "Daniil Medvedev",
  "Alexander Zverev",
  "Iga Swiatek",
  "Aryna Sabalenka",
  "Coco Gauff",
  "Elena Rybakina",
  "Naomi Osaka",
];

const grandSlamKeywords = [
  "roland",
  "french open",
  "wimbledon",
  "us open",
  "australian open",
];

const popularVsLinks = [
  ["Carlos Alcaraz", "Jannik Sinner"],
  ["Novak Djokovic", "Carlos Alcaraz"],
  ["Novak Djokovic", "Jannik Sinner"],
  ["Iga Swiatek", "Aryna Sabalenka"],
  ["Coco Gauff", "Iga Swiatek"],
  ["Daniil Medvedev", "Alexander Zverev"],
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
  const numericId = String(match.id).split(":").pop();

  return `${readablePart}-${numericId}`;
}

function formatTime(value?: string) {
  if (!value) return "Time TBC";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Time TBC";

  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(date);
}

function containsPriorityPlayer(match: Match) {
  const text = `${match.player1} ${match.player2}`.toLowerCase();

  return priorityPlayers.some((player) => text.includes(player.toLowerCase().split(" ").pop() || ""));
}

function isGrandSlam(match: Match) {
  const tournament = match.tournament.toLowerCase();

  return grandSlamKeywords.some((keyword) => tournament.includes(keyword));
}

function matchScore(match: Match) {
  let score = 0;
  const status = match.status.toUpperCase();
  const category = match.category.toUpperCase();
  const round = (match.round || "").toLowerCase();

  if (status === "LIVE") score += 100;
  if (status === "UPCOMING") score += 45;
  if (status === "SUSPENDED") score += 35;
  if (containsPriorityPlayer(match)) score += 35;
  if (isGrandSlam(match)) score += 30;
  if (category === "ATP" || category === "WTA") score += 20;
  if (round.includes("final")) score += 30;
  if (round.includes("semi")) score += 18;

  return score;
}

function bestOfficialProvider(match: Match) {
  const providers = match.watchProviders || [];

  return providers.find((provider) => {
    const status = `${provider.verificationStatus || ""} ${provider.note || ""}`.toLowerCase();
    return status.includes("official") || status.includes("verified") || status.includes("broadcaster");
  }) || providers[0];
}

export default function BestMatchesTodayEngine({ matches }: Props) {
  const bestMatches = [...matches]
    .filter((match) => match.player1 && match.player2 && match.tournament)
    .sort((a, b) => matchScore(b) - matchScore(a))
    .slice(0, 6);

  const topPlayers = priorityPlayers.slice(0, 8);

  return (
    <section className="mb-12 rounded-[2.5rem] border border-fuchsia-500/40 bg-gradient-to-br from-fuchsia-950/30 via-zinc-950 to-black p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-fuchsia-400 px-4 py-2 text-sm font-black text-black">
          📈 Best Matches Today Engine
        </span>
        <span className="text-sm text-zinc-400">
          Prioritizes live matches, stars, Grand Slams and finals for stronger daily SEO
        </span>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div>
          <h2 className="mb-5 text-3xl font-black text-white md:text-4xl">
            Best Tennis Matches to Watch Today
          </h2>

          {bestMatches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {bestMatches.map((match, index) => {
                const provider = bestOfficialProvider(match);

                return (
                  <article
                    key={match.id}
                    className="rounded-3xl border border-zinc-800 bg-black/50 p-5 hover:border-fuchsia-400"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-fuchsia-500/20 px-3 py-1 text-xs font-black text-fuchsia-200">
                        #{index + 1} pick
                      </span>
                      <span className="text-xs font-bold text-zinc-500">{match.category}</span>
                    </div>

                    <h3 className="mb-3 text-2xl font-black leading-tight text-white">
                      {match.player1} vs {match.player2}
                    </h3>

                    <p className="mb-3 text-sm leading-6 text-zinc-400">
                      {match.tournament} · {match.round || match.status} · {formatTime(match.startTime)}
                    </p>

                    {match.score ? (
                      <p className="mb-4 rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-black text-white">
                        Score: {match.score}
                      </p>
                    ) : null}

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`/watch/${matchSlug(match)}`}
                        className="rounded-full bg-white px-4 py-2 text-sm font-black text-black hover:bg-zinc-200"
                      >
                        Match hub →
                      </a>

                      <a
                        href={`/vs/${slugify(match.player1)}-vs-${slugify(match.player2)}`}
                        className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-black text-white hover:border-fuchsia-400"
                      >
                        H2H page
                      </a>

                      {provider ? (
                        <a
                          href={withTracking(provider.url, "best_matches_today_engine")}
                          target="_blank"
                          rel="nofollow sponsored noopener noreferrer"
                          className="rounded-full border border-emerald-500/40 px-4 py-2 text-sm font-black text-emerald-300 hover:border-emerald-300"
                        >
                          Watch info
                        </a>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-black/50 p-6">
              <h3 className="mb-2 text-2xl font-black text-white">No ranked matches from the feed right now</h3>
              <p className="text-zinc-400">
                The live feed may be empty or between tournament sessions. Use the daily schedule pages and official tournament sources for confirmation.
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-5">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
              Money bridge
            </p>
            <h3 className="mb-3 text-2xl font-black text-white">
              Watching from another country?
            </h3>
            <p className="mb-4 text-sm leading-6 text-zinc-400">
              Daily tennis traffic often comes from fans who cannot find the right broadcaster. Send them to safe travel-viewing guides instead of letting them bounce.
            </p>
            <div className="grid gap-3">
              <a href="/watch-tennis-abroad" className="rounded-2xl bg-emerald-400 px-4 py-3 text-center font-black text-black hover:bg-emerald-300">
                Watch Tennis Abroad →
              </a>
              <a href="/best-vpn-for-tennis-streaming" className="rounded-2xl border border-zinc-700 px-4 py-3 text-center font-black text-white hover:border-emerald-400">
                Best VPN for Tennis
              </a>
              <a
                href={affiliateLinks.nordvpn}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="rounded-2xl border border-zinc-700 px-4 py-3 text-center font-black text-white hover:border-emerald-400"
              >
                View VPN Deal
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-black/50 p-5">
            <h3 className="mb-4 text-2xl font-black text-white">Trending player hubs</h3>
            <div className="flex flex-wrap gap-2">
              {topPlayers.map((player) => {
                const href = safePlayerUrl(player);
                if (!href) return null;

                return (
                  <a
                    key={player}
                    href={href}
                    className="rounded-full border border-zinc-700 px-3 py-2 text-sm font-bold text-zinc-200 hover:border-yellow-400 hover:text-yellow-300"
                  >
                    {player}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-black/50 p-5">
            <h3 className="mb-4 text-2xl font-black text-white">Popular H2H pages</h3>
            <div className="grid gap-2">
              {popularVsLinks.map(([playerA, playerB]) => (
                <a
                  key={`${playerA}-${playerB}`}
                  href={`/vs/${slugify(playerA)}-vs-${slugify(playerB)}`}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-black text-zinc-200 hover:border-fuchsia-400"
                >
                  {playerA} vs {playerB}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

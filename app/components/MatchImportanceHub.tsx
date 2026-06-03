import Link from "next/link";

export type IntelligenceMatch = {
  id?: string;
  player1?: string;
  player2?: string;
  tournament?: string;
  category?: string;
  status?: string;
  score?: string;
  startTime?: string;
  date?: string;
  time?: string;
  round?: string;
};

type Props = {
  matches: IntelligenceMatch[];
  compact?: boolean;
  title?: string;
  subtitle?: string;
};

const GRAND_SLAM_KEYWORDS = ["roland", "french open", "wimbledon", "us open", "australian open"];

const STAR_PLAYERS = [
  "Alcaraz",
  "Sinner",
  "Djokovic",
  "Nadal",
  "Zverev",
  "Medvedev",
  "Tsitsipas",
  "Rune",
  "Ruud",
  "Shelton",
  "Sabalenka",
  "Swiatek",
  "Gauff",
  "Osaka",
  "Rybakina",
  "Pegula",
  "Zheng",
  "Andreeva",
  "Paolini",
];

const RIVALRY_PAIRS = [
  ["alcaraz", "sinner"],
  ["djokovic", "alcaraz"],
  ["djokovic", "sinner"],
  ["sabalenka", "swiatek"],
  ["gauff", "swiatek"],
  ["sabalenka", "gauff"],
  ["zverev", "alcaraz"],
  ["medvedev", "sinner"],
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

function matchSlug(match: IntelligenceMatch) {
  const readablePart = slugify(`${match.player1 || "player"}-vs-${match.player2 || "player"}`);
  const numericId = String(match.id || "match").split(":").pop() || "match";

  return `${readablePart}-${numericId}`;
}

function normalizeStatus(status?: string) {
  return String(status || "").toUpperCase();
}

function isFinished(match: IntelligenceMatch) {
  const status = normalizeStatus(match.status).toLowerCase();

  return status.includes("finished") || status.includes("completed") || status.includes("cancelled") || status.includes("final");
}

function isGrandSlam(match: IntelligenceMatch) {
  const tournament = String(match.tournament || "").toLowerCase();
  return GRAND_SLAM_KEYWORDS.some((keyword) => tournament.includes(keyword));
}

function getRoundWeight(match: IntelligenceMatch) {
  const round = String(match.round || "").toLowerCase();

  if (round.includes("final") && !round.includes("semi") && !round.includes("quarter")) return 25;
  if (round.includes("semi")) return 22;
  if (round.includes("quarter")) return 18;
  if (round.includes("round of 16") || round.includes("1/8") || round.includes("r16")) return 14;
  if (round.includes("round of 32") || round.includes("1/16") || round.includes("r32")) return 8;

  return 0;
}

function hasStarPlayer(match: IntelligenceMatch) {
  const text = `${match.player1 || ""} ${match.player2 || ""}`.toLowerCase();

  return STAR_PLAYERS.some((player) => text.includes(player.toLowerCase()));
}

function isHighProfileMatch(match: IntelligenceMatch) {
  const text = `${match.player1 || ""} ${match.player2 || ""}`.toLowerCase();

  return RIVALRY_PAIRS.some(([first, second]) => text.includes(first) && text.includes(second));
}

function isMainTourSingles(match: IntelligenceMatch) {
  const category = String(match.category || "").toUpperCase();
  return category === "ATP" || category === "WTA";
}

function getImportanceScore(match: IntelligenceMatch) {
  const status = normalizeStatus(match.status);
  let score = 10;

  if (isGrandSlam(match)) score += 30;
  score += getRoundWeight(match);
  if (hasStarPlayer(match)) score += 20;
  if (isHighProfileMatch(match)) score += 12;
  if (status === "LIVE") score += 12;
  if (status === "UPCOMING" || status === "SCHEDULED") score += 7;
  if (isMainTourSingles(match)) score += 6;
  if (match.score && status === "LIVE") score += 3;

  return Math.min(score, 100);
}

function getReasons(match: IntelligenceMatch) {
  const status = normalizeStatus(match.status);
  const reasons: string[] = [];

  if (status === "LIVE") reasons.push("Live right now");
  if (isGrandSlam(match)) reasons.push("Grand Slam match");
  if (getRoundWeight(match) >= 18) reasons.push(match.round || "High-stakes round");
  if (getRoundWeight(match) > 0 && getRoundWeight(match) < 18) reasons.push(match.round || "Important round");
  if (hasStarPlayer(match)) reasons.push("star player involved");
  if (isHighProfileMatch(match)) reasons.push("high-profile matchup");
  if (isMainTourSingles(match)) reasons.push(`${match.category} singles`);
  if (match.score && status === "LIVE") reasons.push("score moving now");

  return [...new Set(reasons)].slice(0, 4);
}

function getWhyWatch(match: IntelligenceMatch) {
  const reasons = getReasons(match);

  if (reasons.length === 0) return "Worth checking because it is part of today’s active tennis schedule.";

  return reasons
    .map((reason) => reason.charAt(0).toUpperCase() + reason.slice(1))
    .join(" · ");
}

function getTimeLabel(match: IntelligenceMatch) {
  if (match.time) return match.time;
  if (match.date && match.time) return `${match.date} · ${match.time}`;
  if (!match.startTime) return "Time TBC";

  const date = new Date(match.startTime);
  if (Number.isNaN(date.getTime())) return "Time TBC";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function pickMatches(matches: IntelligenceMatch[], compact: boolean) {
  return [...matches]
    .filter((match) => match.player1 && match.player2 && match.tournament)
    .filter((match) => !isFinished(match))
    .sort((a, b) => getImportanceScore(b) - getImportanceScore(a))
    .slice(0, compact ? 4 : 7);
}

export default function MatchImportanceHub({
  matches,
  compact = false,
  title = "Must-watch matches today",
  subtitle = "Ranked by tournament weight, round, star power, live status and player context.",
}: Props) {
  const importantMatches = pickMatches(matches, compact);

  if (importantMatches.length === 0) return null;

  const hero = importantMatches[0];
  const heroScore = getImportanceScore(hero);

  return (
    <section className="mb-12 rounded-[2.5rem] border border-orange-500/40 bg-gradient-to-br from-orange-950/35 via-zinc-950 to-black p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 inline-flex rounded-full bg-orange-500 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-black">
            Tennis intelligence
          </p>
          <h2 className="text-3xl font-black text-white md:text-5xl">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400 md:text-base">{subtitle}</p>
        </div>
        <Link
          href="/best-tennis-matches-today"
          className="rounded-full border border-orange-500/50 px-5 py-3 text-sm font-black text-orange-100 hover:border-orange-300"
        >
          Full match ranking →
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[2rem] border border-orange-500/40 bg-black/60 p-5 md:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-black text-black">
              Importance {heroScore}/100
            </span>
            <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-bold text-zinc-300">
              {hero.status || "Scheduled"}
            </span>
            <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-bold text-zinc-300">
              {hero.category || "Tennis"}
            </span>
          </div>

          <h3 className="mb-3 text-3xl font-black leading-tight text-white md:text-4xl">
            {hero.player1} vs {hero.player2}
          </h3>

          <p className="mb-4 text-sm leading-6 text-zinc-400">
            {hero.tournament} · {hero.round || "Round TBC"} · {getTimeLabel(hero)}
          </p>

          {hero.score ? (
            <p className="mb-4 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm font-black text-white">
              Current score: {hero.score}
            </p>
          ) : null}

          <div className="mb-5 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-orange-300">Why watch</p>
            <p className="text-sm leading-6 text-zinc-200">{getWhyWatch(hero)}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/watch/${matchSlug(hero)}`}
              className="rounded-full bg-white px-5 py-3 text-sm font-black text-black hover:bg-zinc-200"
            >
              Open match hub →
            </Link>
            <Link
              href={`/vs/${slugify(hero.player1 || "player")}-vs-${slugify(hero.player2 || "player")}`}
              className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-black text-white hover:border-orange-300"
            >
              Compare players
            </Link>
          </div>
        </article>

        <div className="grid gap-3">
          {importantMatches.slice(1).map((match, index) => {
            const score = getImportanceScore(match);

            return (
              <Link
                key={`${match.id || match.player1}-${match.player2}-${index}`}
                href={`/watch/${matchSlug(match)}`}
                className="rounded-3xl border border-zinc-800 bg-black/45 p-4 transition hover:border-orange-400/80"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-black text-orange-200">
                    #{index + 2} · {score}/100
                  </span>
                  <span className="text-xs font-bold text-zinc-500">{match.status || match.category || "Tennis"}</span>
                </div>
                <h3 className="mb-2 text-xl font-black text-white">
                  {match.player1} vs {match.player2}
                </h3>
                <p className="text-sm leading-6 text-zinc-400">
                  {match.tournament} · {match.round || "Round TBC"} · {getTimeLabel(match)}
                </p>
                <p className="mt-2 text-xs font-bold text-orange-200">{getWhyWatch(match)}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

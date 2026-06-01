import Link from "next/link";
import { safePlayerUrl } from "@/data/playerSlugs";

type MatchInput = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category?: string;
  status: string;
  score?: string | null;
  startTime?: string | null;
  round?: string | null;
  winner?: string | null;
};

type PathStep = {
  key: string;
  label: string;
  title: string;
  href?: string | null;
  meta: string;
  tone: "done" | "current" | "future";
};

const ROUND_FLOW = [
  { test: /round of 128|r128|1\/64|first round/i, next: ["Round of 64", "Round of 32", "Round of 16", "Quarterfinal", "Semifinal", "Final"] },
  { test: /round of 64|r64|1\/32|second round/i, next: ["Round of 32", "Round of 16", "Quarterfinal", "Semifinal", "Final"] },
  { test: /round of 32|r32|1\/16|third round/i, next: ["Round of 16", "Quarterfinal", "Semifinal", "Final"] },
  { test: /round of 16|r16|fourth round/i, next: ["Quarterfinal", "Semifinal", "Final"] },
  { test: /quarter/i, next: ["Semifinal", "Final"] },
  { test: /semi/i, next: ["Final"] },
  { test: /final/i, next: [] },
];

function normalize(value?: string | null) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function getLastName(player: string) {
  const clean = player.replace(/\([^)]*\)/g, "").trim();
  const parts = clean.split(/\s+/).filter(Boolean);

  return normalize(parts.at(-1) || clean);
}

function matchHasPlayer(match: Pick<MatchInput, "player1" | "player2">, player: string) {
  const playerName = normalize(player);
  const lastName = getLastName(player);
  const sides = `${match.player1} ${match.player2}`;

  return normalize(sides).includes(playerName) || (!!lastName && normalize(sides).includes(lastName));
}

function isCompletedStatus(status: string) {
  const value = status.toUpperCase();

  return ["FINISHED", "COMPLETED", "RETIRED", "WALKOVER"].includes(value);
}

function isFutureStatus(status: string) {
  const value = status.toUpperCase();

  return ["UPCOMING", "SCHEDULED", "LIVE", "SUSPENDED"].includes(value);
}

function getTime(match: MatchInput) {
  if (!match.startTime) return 0;
  const parsed = new Date(match.startTime).getTime();

  return Number.isNaN(parsed) ? 0 : parsed;
}

function getOpponent(player: string, match: MatchInput) {
  if (matchHasPlayer({ player1: match.player1, player2: "" }, player)) return match.player2;

  return match.player1;
}

function getWinnerName(match: MatchInput) {
  const winner = normalize(match.winner);

  if (!winner) return null;
  if (["1", "first", "first player", "player 1"].includes(winner)) return match.player1;
  if (["2", "second", "second player", "player 2"].includes(winner)) return match.player2;
  if (normalize(match.player1).includes(winner) || winner.includes(normalize(match.player1))) return match.player1;
  if (normalize(match.player2).includes(winner) || winner.includes(normalize(match.player2))) return match.player2;

  return match.winner;
}

function playerWonMatch(player: string, match: MatchInput) {
  const winnerName = getWinnerName(match);

  if (!winnerName) return false;

  return matchHasPlayer({ player1: winnerName, player2: "" }, player);
}

function cleanRoundLabel(match: MatchInput) {
  const rawRound = String(match.round || "").trim();
  const tournament = String(match.tournament || "").trim();

  if (!rawRound) return "Current round";

  const withoutTournament = tournament
    ? rawRound.replace(new RegExp(tournament.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), "")
    : rawRound;

  return withoutTournament
    .replace(/^\s*[-–—:|]\s*/, "")
    .replace(/^\s*(ATP|WTA)\s*/i, "")
    .trim() || rawRound;
}

function makeVsSlug(player1: string, player2: string) {
  const makeSlug = (value: string) =>
    normalize(value)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  return `${makeSlug(player1)}-vs-${makeSlug(player2)}`;
}

function getRemainingRounds(currentRound: string) {
  const match = ROUND_FLOW.find((item) => item.test.test(currentRound));

  return match?.next || [];
}

function buildPlayerPath(currentMatch: MatchInput, matches: MatchInput[], player: string) {
  const currentTime = getTime(currentMatch);
  const tournament = normalize(currentMatch.tournament);
  const currentRound = cleanRoundLabel(currentMatch);

  const completedWins = matches
    .filter((item) => item.id !== currentMatch.id)
    .filter((item) => normalize(item.tournament) === tournament)
    .filter((item) => matchHasPlayer(item, player))
    .filter((item) => isCompletedStatus(item.status))
    .filter((item) => !currentTime || !getTime(item) || getTime(item) <= currentTime)
    .filter((item) => playerWonMatch(player, item))
    .sort((a, b) => getTime(a) - getTime(b))
    .map((item) => {
      const opponent = getOpponent(player, item);

      return {
        key: `win-${item.id}`,
        label: cleanRoundLabel(item),
        title: `def. ${opponent}`,
        href: safePlayerUrl(opponent),
        meta: item.score ? `Score: ${item.score}` : "Completed win",
        tone: "done" as const,
      };
    });

  const currentOpponent = getOpponent(player, currentMatch);
  const currentStep: PathStep = {
    key: `current-${currentMatch.id}-${player}`,
    label: currentRound,
    title: `vs ${currentOpponent}`,
    href: safePlayerUrl(currentOpponent),
    meta: currentMatch.status === "LIVE" ? "Live now" : currentMatch.startTime ? new Date(currentMatch.startTime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "Current listed match",
    tone: "current",
  };

  const confirmedFutureSteps = matches
    .filter((item) => item.id !== currentMatch.id)
    .filter((item) => normalize(item.tournament) === tournament)
    .filter((item) => matchHasPlayer(item, player))
    .filter((item) => isFutureStatus(item.status))
    .filter((item) => getTime(item) > currentTime)
    .sort((a, b) => getTime(a) - getTime(b))
    .slice(0, 3)
    .map((item) => {
      const opponent = getOpponent(player, item);

      return {
        key: `future-${item.id}`,
        label: cleanRoundLabel(item),
        title: `vs ${opponent}`,
        href: safePlayerUrl(opponent),
        meta: item.startTime ? new Date(item.startTime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "Confirmed by fixture feed",
        tone: "future" as const,
      };
    });

  const genericFutureSteps = confirmedFutureSteps.length
    ? []
    : getRemainingRounds(currentRound).map((round) => ({
        key: `tba-${player}-${round}`,
        label: round,
        title: "Opponent TBA",
        href: null,
        meta: "Updates when the draw feed publishes this round",
        tone: "future" as const,
      }));

  return {
    player,
    steps: [...completedWins, currentStep, ...confirmedFutureSteps, ...genericFutureSteps].slice(-7),
    completedWins: completedWins.length,
    remainingRounds: confirmedFutureSteps.length + genericFutureSteps.length,
  };
}

function PathItem({ step }: { step: PathStep }) {
  const badgeClass =
    step.tone === "done"
      ? "bg-emerald-400/15 text-emerald-200"
      : step.tone === "current"
        ? "bg-sky-400/15 text-sky-200"
        : "bg-zinc-800 text-zinc-300";

  const title = step.href ? (
    <Link href={step.href} className="text-white underline decoration-sky-400/50 underline-offset-4 hover:text-sky-200">
      {step.title}
    </Link>
  ) : (
    <span className="text-white">{step.title}</span>
  );

  return (
    <li className="flex gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
      <span className={`mt-0.5 h-fit rounded-full px-2.5 py-1 text-xs font-black uppercase tracking-wide ${badgeClass}`}>
        {step.tone === "done" ? "✓" : step.tone === "current" ? "Now" : "TBA"}
      </span>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-zinc-500">{step.label}</p>
        <p className="mt-1 text-sm font-black leading-6">{title}</p>
        <p className="mt-1 text-xs font-bold leading-5 text-zinc-500">{step.meta}</p>
      </div>
    </li>
  );
}

function PathColumn({ path }: { path: ReturnType<typeof buildPlayerPath> }) {
  return (
    <article className="rounded-3xl border border-zinc-800 bg-black/55 p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-white">{path.player}</h3>
          <p className="mt-1 text-sm font-bold text-zinc-500">
            {path.completedWins} completed win{path.completedWins === 1 ? "" : "s"} · {path.remainingRounds} possible round{path.remainingRounds === 1 ? "" : "s"} left
          </p>
        </div>
        {safePlayerUrl(path.player) ? (
          <Link href={safePlayerUrl(path.player) || "#"} className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-zinc-300 hover:border-sky-300 hover:text-white">
            Player page
          </Link>
        ) : null}
      </div>
      <ol className="space-y-3">
        {path.steps.map((step) => (
          <PathItem key={step.key} step={step} />
        ))}
      </ol>
    </article>
  );
}

export default function PathToTitle({ match, matches }: { match: MatchInput; matches: MatchInput[] }) {
  const tournament = String(match.tournament || "");
  const currentRound = cleanRoundLabel(match);
  const remainingRounds = getRemainingRounds(currentRound);

  if (!tournament || remainingRounds.length === 0) return null;

  const playerA = buildPlayerPath(match, matches, match.player1);
  const playerB = buildPlayerPath(match, matches, match.player2);
  const vsHref = `/vs/${makeVsSlug(match.player1, match.player2)}`;

  return (
    <section className="mb-12 overflow-hidden rounded-[2rem] border border-sky-500/30 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_34%),#09090b] p-6 md:p-7">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-sky-300">Path to the title</p>
          <h2 className="text-3xl font-black text-white">What each player still has to survive</h2>
          <p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-zinc-400">
            Built from the current tournament feed. Confirmed opponents are linked when available; future opponents stay TBA until the draw publishes the next round.
          </p>
        </div>
        <Link href={vsHref} className="rounded-2xl border border-sky-400/40 bg-sky-400/10 px-4 py-2 text-sm font-black text-sky-100 hover:border-sky-200">
          Full vs hub →
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <PathColumn path={playerA} />
        <PathColumn path={playerB} />
      </div>
    </section>
  );
}

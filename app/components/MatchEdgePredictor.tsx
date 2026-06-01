import Link from "next/link";
import { safePlayerUrl } from "@/data/playerSlugs";

type MatchEdgeInput = {
  id: string;
  player1: string;
  player2: string;
  tournament: string;
  category: string;
  status: string;
  score?: string | null;
  startTime?: string | null;
  round?: string | null;
  winner?: string | null;
};

type RoadStep = {
  id: string;
  round: string;
  opponent: string;
  opponentHref: string | null;
  score: string | null;
  startTime: number;
};

type PlayerRoad = {
  player: string;
  steps: RoadStep[];
};

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

function matchHasPlayer(match: Pick<MatchEdgeInput, "player1" | "player2">, player: string) {
  const playerName = normalize(player);
  const lastName = getLastName(player);
  const sides = `${match.player1} ${match.player2}`;

  return normalize(sides).includes(playerName) || (!!lastName && normalize(sides).includes(lastName));
}

function isCompletedStatus(status: string) {
  return ["FINISHED", "COMPLETED", "RETIRED"].includes(status.toUpperCase());
}

function getTime(match: MatchEdgeInput) {
  if (!match.startTime) return 0;
  const time = new Date(match.startTime).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function getOpponent(player: string, match: MatchEdgeInput) {
  if (matchHasPlayer({ player1: match.player1, player2: "" }, player)) return match.player2;
  return match.player1;
}

function getWinnerName(match: MatchEdgeInput) {
  const winner = normalize(match.winner);

  if (!winner) return null;
  if (["1", "first", "first player", "player 1"].includes(winner)) return match.player1;
  if (["2", "second", "second player", "player 2"].includes(winner)) return match.player2;
  if (normalize(match.player1).includes(winner) || winner.includes(normalize(match.player1))) return match.player1;
  if (normalize(match.player2).includes(winner) || winner.includes(normalize(match.player2))) return match.player2;

  return match.winner;
}

function playerWonMatch(player: string, match: MatchEdgeInput) {
  const winnerName = getWinnerName(match);
  if (!winnerName) return false;

  return matchHasPlayer({ player1: winnerName, player2: "" }, player);
}

function cleanRoundLabel(match: MatchEdgeInput) {
  const rawRound = String(match.round || "").trim();
  const tournament = String(match.tournament || "").trim();

  if (!rawRound) return "Completed match";

  const withoutTournament = tournament
    ? rawRound.replace(new RegExp(tournament.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), "")
    : rawRound;

  return withoutTournament
    .replace(/^\s*[-–—:|]\s*/, "")
    .replace(/^\s*(ATP|WTA)\s*/i, "")
    .trim() || rawRound;
}

function buildPlayerRoad(currentMatch: MatchEdgeInput, matches: MatchEdgeInput[], player: string): PlayerRoad {
  const currentTime = getTime(currentMatch);
  const tournament = normalize(currentMatch.tournament);

  const steps = matches
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
        id: item.id,
        round: cleanRoundLabel(item),
        opponent,
        opponentHref: safePlayerUrl(opponent),
        score: item.score || null,
        startTime: getTime(item),
      };
    });

  return { player, steps };
}

function makeVsSlug(player1: string, player2: string) {
  const makeSlug = (value: string) =>
    normalize(value)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  return `${makeSlug(player1)}-vs-${makeSlug(player2)}`;
}

function StepText({ step }: { step: RoadStep }) {
  const opponent = step.opponentHref ? (
    <Link href={step.opponentHref} className="text-white underline decoration-emerald-400/50 underline-offset-4 hover:text-emerald-200">
      {step.opponent}
    </Link>
  ) : (
    <span className="text-white">{step.opponent}</span>
  );

  return (
    <li className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
      <div className="flex flex-wrap items-center gap-2 text-sm font-black text-white">
        <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs uppercase tracking-wide text-emerald-300">✓ {step.round}</span>
        <span>defeated</span>
        {opponent}
      </div>
      {step.score ? <p className="mt-2 text-xs font-bold text-zinc-500">Score: {step.score}</p> : null}
    </li>
  );
}

function RoadColumn({ road }: { road: PlayerRoad }) {
  return (
    <article className="rounded-3xl border border-zinc-800 bg-black/60 p-5">
      <h3 className="mb-4 text-2xl font-black text-white">{road.player}</h3>
      <ol className="space-y-3">
        {road.steps.map((step) => (
          <StepText key={step.id} step={step} />
        ))}
      </ol>
    </article>
  );
}

export default function MatchEdgePredictor({
  match,
  matches,
}: {
  match: MatchEdgeInput;
  matches: MatchEdgeInput[];
}) {
  const playerA = buildPlayerRoad(match, matches, match.player1);
  const playerB = buildPlayerRoad(match, matches, match.player2);

  if (!playerA.steps.length || !playerB.steps.length) {
    return null;
  }

  const vsHref = `/vs/${makeVsSlug(match.player1, match.player2)}`;
  const hasSummary = playerA.steps.length >= 2 && playerB.steps.length >= 2;
  const currentRound = cleanRoundLabel(match);

  return (
    <section className="mb-12 overflow-hidden rounded-[2rem] border border-emerald-500/30 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_34%),#09090b] p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-400">
            Road to this match
          </p>
          <h2 className="text-3xl font-black text-white">
            How they reached {currentRound}
          </h2>
        </div>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-200">
          Completed matches only
        </span>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <RoadColumn road={playerA} />
        <RoadColumn road={playerB} />
      </div>

      <div className="mb-6 rounded-3xl border border-zinc-800 bg-black/50 p-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Next</p>
        <p className="mt-2 text-lg font-black leading-8 text-white">
          {match.player1} vs {match.player2}
          {match.round ? <span className="text-zinc-400"> · {currentRound}</span> : null}
        </p>
      </div>

      {hasSummary ? (
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          {[playerA, playerB].map((road) => (
            <div key={road.player} className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
              <p className="text-sm font-bold leading-7 text-zinc-300">
                <span className="font-black text-white">{road.player}</span> reached {currentRound} by defeating {road.steps.map((step) => step.opponent).join(", ")}.
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link href={vsHref} className="rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black transition hover:bg-emerald-300">
          Open full vs hub
        </Link>
        <Link href="/tennis-spoiler-free-scores" className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 font-black text-white transition hover:bg-white/15">
          Spoiler-free scores
        </Link>
      </div>
    </section>
  );
}

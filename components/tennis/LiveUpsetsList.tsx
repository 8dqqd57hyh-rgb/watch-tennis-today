import Link from "next/link";
import type { UpsetCandidate } from "@/lib/tennis/upsets";

type LiveUpsetsListProps = {
  candidates: UpsetCandidate[];
  title?: string;
  description?: string;
  emptyTitle?: string;
  emptyDescription?: string;
};

function PlayerName({ name, href }: { name: string; href: string | null }) {
  if (!href) return <span>{name}</span>;

  return (
    <Link href={href} className="hover:text-emerald-300" data-testid="upset-player-link">
      {name}
    </Link>
  );
}

function statusLabel(candidate: UpsetCandidate) {
  if (candidate.badgeLabel) return candidate.badgeLabel;
  if (candidate.type === "completed") return "Completed Upset";
  if (candidate.scoreBreakdown.underdogSetLeadBonus > 0) return "Live Upset Alert";

  return "Potential Upset";
}

function statusClass(candidate: UpsetCandidate) {
  if (candidate.badgeTone === "scare") return "border-amber-300/60 bg-amber-300 text-black";
  if (candidate.badgeTone === "live") return "border-red-500/60 bg-red-500 text-white";
  if (candidate.badgeTone === "completed") return "border-emerald-400/50 bg-emerald-400 text-black";
  if (candidate.type === "completed") return "border-emerald-400/50 bg-emerald-400 text-black";
  if (candidate.scoreBreakdown.underdogSetLeadBonus > 0) return "border-red-500/60 bg-red-500 text-white";

  return "border-amber-300/60 bg-amber-300 text-black";
}

function formatStartTime(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function EmptyUpsets({ title, description }: { title: string; description: string }) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6" data-testid="live-upsets-empty">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <p className="mt-3 max-w-3xl leading-7 text-zinc-400">{description}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/today" className="rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black hover:bg-emerald-300">
          Today&apos;s schedule
        </Link>
        <Link href="/live-tennis" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-emerald-400">
          Live tennis
        </Link>
        <Link href="/tennis-results-today" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-emerald-400">
          Tennis results today
        </Link>
      </div>
    </section>
  );
}

export default function LiveUpsetsList({
  candidates,
  title = "Live upset candidates",
  description,
  emptyTitle = "No ranking-based upsets found right now",
  emptyDescription = "The current match feed does not show a lower-ranked player leading or beating a higher-ranked opponent with usable ranking data. Check live scores and today's schedule for the latest match status.",
}: LiveUpsetsListProps) {
  if (candidates.length === 0) {
    return <EmptyUpsets title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <section data-testid="live-upsets-list">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black text-white">{title}</h2>
          {description ? <p className="mt-2 max-w-3xl leading-7 text-zinc-400">{description}</p> : null}
        </div>
        <span className="rounded-full border border-zinc-800 px-4 py-2 text-sm font-black text-zinc-300">
          {candidates.length} {candidates.length === 1 ? "match" : "matches"}
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {candidates.map((candidate) => {
          const detailHref = candidate.watchUrl || candidate.matchUrl || "/live-tennis";
          const startTime = formatStartTime(candidate.startTime);

          return (
            <article
              key={`${candidate.type}-${candidate.id}`}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5 shadow-lg shadow-black/20"
              data-testid="live-upset-card"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wide ${statusClass(candidate)}`}>
                  {statusLabel(candidate)}
                </span>
                <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs font-black text-zinc-300">
                  Upset score {candidate.upsetScore}
                </span>
              </div>

              <h3 className="text-2xl font-black leading-tight text-white">
                <PlayerName name={candidate.underdog.name} href={candidate.underdog.url} />
                <span className="mx-2 text-zinc-600">vs</span>
                <PlayerName name={candidate.favorite.name} href={candidate.favorite.url} />
              </h3>

              <p className="mt-3 text-sm font-bold text-emerald-300">{candidate.scoreExplanation}</p>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-zinc-800 bg-black/50 px-3 py-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">Ranking gap</p>
                  <p className="mt-1 text-sm font-bold text-zinc-100">
                    No. {candidate.underdogRank} vs No. {candidate.favoriteRank} ({candidate.rankingGap} places)
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-black/50 px-3 py-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">Score</p>
                  <p className="mt-1 text-sm font-bold text-zinc-100">{candidate.currentScore || "Score unavailable"}</p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-black/50 px-3 py-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">Tournament</p>
                  <p className="mt-1 text-sm font-bold text-zinc-100">{candidate.tournamentName}</p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-black/50 px-3 py-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">Round</p>
                  <p className="mt-1 text-sm font-bold text-zinc-100">{candidate.round || "Round unavailable"}</p>
                </div>
                {candidate.surface ? (
                  <div className="rounded-2xl border border-zinc-800 bg-black/50 px-3 py-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">Surface</p>
                    <p className="mt-1 text-sm font-bold text-zinc-100">{candidate.surface}</p>
                  </div>
                ) : null}
                {startTime ? (
                  <div className="rounded-2xl border border-zinc-800 bg-black/50 px-3 py-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">Start</p>
                    <p className="mt-1 text-sm font-bold text-zinc-100">{startTime}</p>
                  </div>
                ) : null}
              </div>

              <p className="mt-4 text-sm leading-6 text-zinc-400">
                {candidate.scoreBreakdown.reasons.join(". ")}.
              </p>

              {candidate.source ? (
                <div className="mt-4 rounded-2xl border border-zinc-800 bg-black/40 px-3 py-2 text-xs leading-5 text-zinc-400">
                  <span className="font-black uppercase tracking-[0.16em] text-zinc-500">Source checked</span>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                    <a href={candidate.source.url} className="font-bold text-emerald-300 hover:text-emerald-200">
                      {candidate.source.label}
                    </a>
                    {candidate.source.secondaryUrl && candidate.source.secondaryLabel ? (
                      <a href={candidate.source.secondaryUrl} className="font-bold text-emerald-300 hover:text-emerald-200">
                        {candidate.source.secondaryLabel}
                      </a>
                    ) : null}
                    {candidate.source.checkedAt ? <span>{candidate.source.checkedAt}</span> : null}
                  </div>
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={detailHref} className="rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black hover:bg-emerald-300">
                  {candidate.watchUrl ? "Watch options" : "Match info"}
                </Link>
                <Link href="/tennis-live-scores-explained" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-emerald-400">
                  Scores explained
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

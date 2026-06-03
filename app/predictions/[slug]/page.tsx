import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { safePlayerUrl } from "@/data/playerSlugs";
import AdSlot from "@/app/components/AdSlot";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import ContentQualityNotice from "@/app/components/ContentQualityNotice";
import EmailSignup from "@/app/components/EmailSignup";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import RevenueConversionPanel from "@/app/components/RevenueConversionPanel";
import StreamingLinksGrid from "@/app/components/StreamingLinksGrid";
import {
  getServerMatchById,
  getServerMatches,
  getServerMatchesForPlayer,
  type ServerMatch,
} from "@/app/lib/serverMatches";

export const revalidate = 120;

const BASE_URL = "https://watchtennistoday.com";

type Props = {
  params: Promise<{ slug: string }>;
};

type PredictionSignal = {
  label: string;
  player1Value: string;
  player2Value: string;
  note: string;
};

function normalize(value?: string | null) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function slugify(value: string) {
  return normalize(value)
    .replace(/,/g, "")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function titleCase(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => (part.length <= 2 ? part.toUpperCase() : part.charAt(0).toUpperCase() + part.slice(1)))
    .join(" ");
}

function parsePredictionSlug(slug: string) {
  const readableSlug = slug.replace(/-\d+$/, "");
  const parts = readableSlug.split("-vs-");

  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;

  return {
    player1: titleCase(parts[0]),
    player2: titleCase(parts[1]),
  };
}

function getLastName(player: string) {
  const clean = player.replace(/\([^)]*\)/g, "").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  return normalize(parts.at(-1) || clean);
}

function matchHasPlayer(match: Pick<ServerMatch, "player1" | "player2">, player: string) {
  const playerName = normalize(player);
  const lastName = getLastName(player);
  const sides = `${match.player1} ${match.player2}`;

  return normalize(sides).includes(playerName) || (!!lastName && normalize(sides).includes(lastName));
}

function isCompleted(match: ServerMatch) {
  return ["FINISHED", "COMPLETED", "RETIRED"].includes(String(match.status || "").toUpperCase());
}

function isLive(match: ServerMatch) {
  return String(match.status || "").toUpperCase() === "LIVE";
}

function getTime(match: ServerMatch) {
  if (!match.startTime) return 0;
  const time = new Date(match.startTime).getTime();
  return Number.isFinite(time) ? time : 0;
}

const STALE_LIVE_MATCH_MS = 6 * 60 * 60 * 1000;
const UPCOMING_LOOKBACK_MS = 90 * 60 * 1000;

function getMatchAgeMs(match: ServerMatch) {
  const time = getTime(match);
  if (!time) return 0;
  return Date.now() - time;
}

function isCompletedOrCancelled(match: ServerMatch) {
  const status = String(match.status || "").toUpperCase();
  return [
    "FINISHED",
    "COMPLETED",
    "CANCELLED",
    "CANCELED",
    "POSTPONED",
    "RETIRED",
    "WALKOVER",
    "WO",
    "ABANDONED",
  ].some((value) => status.includes(value));
}

function isPredictionReadyTiming(match: ServerMatch) {
  if (isCompletedOrCancelled(match)) return false;

  const time = getTime(match);
  if (!time) return true;

  const ageMs = getMatchAgeMs(match);
  const status = String(match.status || "").toUpperCase();

  if (status.includes("LIVE")) {
    return ageMs <= STALE_LIVE_MATCH_MS;
  }

  return ageMs <= UPCOMING_LOOKBACK_MS;
}

function getPredictionSlug(player1: string, player2: string, matchId?: string) {
  const base = `${slugify(player1)}-vs-${slugify(player2)}`;
  const id = matchId ? String(matchId).split(":").pop() : null;
  return id ? `${base}-${id}` : base;
}


function getMatchIdFromPredictionSlug(slug: string) {
  return slug.match(/(\d+)$/)?.[1] ?? null;
}

function mergeMatches(...groups: ServerMatch[][]) {
  return Array.from(
    new Map(groups.flat().map((match) => [String(match.id), match])).values()
  );
}

function hasUsefulPredictionData(player1Recent: ServerMatch[], player2Recent: ServerMatch[]) {
  return player1Recent.length + player2Recent.length >= 2;
}

function hasStaleLiveStatus(match: ServerMatch) {
  return isLive(match) && getMatchAgeMs(match) > STALE_LIVE_MATCH_MS;
}

function getDisplayStatus(match: ServerMatch) {
  if (hasStaleLiveStatus(match)) return "Status needs refresh";
  return match.status || "Scheduled";
}

function getWatchSlug(match: ServerMatch) {
  const readablePart = slugify(`${match.player1}-vs-${match.player2}`);
  const numericId = String(match.id).split(":").pop();
  return `${readablePart}-${numericId}`;
}

function formatDateTime(value?: string | null) {
  if (!value) return "Time to be confirmed";

  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getPlayerMatches(matches: ServerMatch[], player: string, currentMatch?: ServerMatch) {
  return matches
    .filter((match) => !currentMatch || match.id !== currentMatch.id)
    .filter((match) => matchHasPlayer(match, player))
    .sort((a, b) => getTime(b) - getTime(a));
}

function getRecentCompleted(matches: ServerMatch[], player: string, currentMatch?: ServerMatch) {
  return getPlayerMatches(matches, player, currentMatch)
    .filter(isCompleted)
    .slice(0, 5);
}

function getSameTournamentCompleted(matches: ServerMatch[], player: string, tournament: string, currentMatch?: ServerMatch) {
  const tournamentKey = normalize(tournament);

  return getPlayerMatches(matches, player, currentMatch)
    .filter((match) => normalize(match.tournament) === tournamentKey)
    .filter(isCompleted)
    .slice(0, 5);
}

function buildSignals(match: ServerMatch, matches: ServerMatch[]): PredictionSignal[] {
  const player1Recent = getRecentCompleted(matches, match.player1, match);
  const player2Recent = getRecentCompleted(matches, match.player2, match);
  const player1Tournament = getSameTournamentCompleted(matches, match.player1, match.tournament, match);
  const player2Tournament = getSameTournamentCompleted(matches, match.player2, match.tournament, match);

  return [
    {
      label: "Recent completed matches in feed",
      player1Value: String(player1Recent.length),
      player2Value: String(player2Recent.length),
      note: "Uses completed matches currently available from the tennis data feed.",
    },
    {
      label: "Same-tournament completed matches",
      player1Value: String(player1Tournament.length),
      player2Value: String(player2Tournament.length),
      note: "Useful during tournaments because it shows who has more visible route data.",
    },
    {
      label: "Current match status",
      player1Value: match.status || "Scheduled",
      player2Value: match.status || "Scheduled",
      note: "Live and near-live pages are refreshed more often than evergreen pages.",
    },
  ];
}

function calculateLean(match: ServerMatch, matches: ServerMatch[]) {
  const player1Tournament = getSameTournamentCompleted(matches, match.player1, match.tournament, match).length;
  const player2Tournament = getSameTournamentCompleted(matches, match.player2, match.tournament, match).length;
  const player1Recent = getRecentCompleted(matches, match.player1, match).length;
  const player2Recent = getRecentCompleted(matches, match.player2, match).length;

  const player1Score = player1Tournament * 2 + player1Recent;
  const player2Score = player2Tournament * 2 + player2Recent;
  const diff = Math.abs(player1Score - player2Score);

  if (diff < 2) {
    return {
      winner: "Too close to call",
      confidence: "Low",
      reason: "The available feed data does not show a strong edge for either player.",
    };
  }

  const winner = player1Score > player2Score ? match.player1 : match.player2;

  return {
    winner,
    confidence: diff >= 5 ? "Medium" : "Low",
    reason: `${winner} has a stronger visible route or recent-match footprint in the current feed.`,
  };
}

function findBestMatch(matches: ServerMatch[], parsed: { player1: string; player2: string }, slug: string) {
  const idFromSlug = slug.match(/(\d+)$/)?.[1] ?? null;

  const directMatches = matches
    .filter(isPredictionReadyTiming)
    .filter((match) => {
      if (idFromSlug && String(match.id).split(":").pop() === idFromSlug) return true;

      return (
        matchHasPlayer(match, parsed.player1) &&
        matchHasPlayer(match, parsed.player2)
      );
    })
    .sort((a, b) => {
      if (isLive(a) && !isLive(b)) return -1;
      if (!isLive(a) && isLive(b)) return 1;
      return getTime(b) - getTime(a);
    });

  return directMatches[0] || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parsePredictionSlug(slug);

  if (!parsed) {
    return {
      title: "Tennis Prediction Not Found | Watch Tennis Today",
      robots: { index: false, follow: true },
    };
  }

  const title = `${parsed.player1} vs ${parsed.player2}`;

  return {
    title: `${title} Prediction, Preview & Match Info | Watch Tennis Today`,
    description: `Preview ${title} with match context, recent form signals, tournament route, start time and official viewing options.`,
    alternates: {
      canonical: `${BASE_URL}/predictions/${slug}`,
    },
    openGraph: {
      title: `${title} Prediction & Preview`,
      description: `Data-led tennis preview for ${title}: route, form signals, match time and legal watch options.`,
      url: `${BASE_URL}/predictions/${slug}`,
      type: "article",
    },
  };
}

export default async function PredictionPage({ params }: Props) {
  const { slug } = await params;
  const parsed = parsePredictionSlug(slug);

  if (!parsed) notFound();

  const matchId = getMatchIdFromPredictionSlug(slug);
  const [matches, directMatch, parsedPlayer1History, parsedPlayer2History] = await Promise.all([
    getServerMatches(120),
    matchId ? getServerMatchById(matchId, 30) : Promise.resolve(null),
    getServerMatchesForPlayer(parsed.player1, { daysBack: 365, revalidateSeconds: 900 }),
    getServerMatchesForPlayer(parsed.player2, { daysBack: 365, revalidateSeconds: 900 }),
  ]);

  const readyDirectMatch = directMatch && isPredictionReadyTiming(directMatch) ? directMatch : null;
  const match = readyDirectMatch || findBestMatch(matches, parsed, slug) || directMatch;

  if (!match) notFound();

  const [player1History, player2History] = await Promise.all([
    match.player1 === parsed.player1 ? Promise.resolve(parsedPlayer1History) : getServerMatchesForPlayer(match.player1, { daysBack: 365, revalidateSeconds: 900 }),
    match.player2 === parsed.player2 ? Promise.resolve(parsedPlayer2History) : getServerMatchesForPlayer(match.player2, { daysBack: 365, revalidateSeconds: 900 }),
  ]);

  const enrichedMatches = mergeMatches(matches, player1History, player2History, match ? [match] : []);
  const title = `${match.player1} vs ${match.player2}`;
  const signals = buildSignals(match, enrichedMatches);
  const lean = calculateLean(match, enrichedMatches);
  const player1Recent = getRecentCompleted(enrichedMatches, match.player1, match);
  const player2Recent = getRecentCompleted(enrichedMatches, match.player2, match);
  const hasData = hasUsefulPredictionData(player1Recent, player2Recent);
  const canonicalUrl = `${BASE_URL}/predictions/${getPredictionSlug(match.player1, match.player2, match.id)}`;

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Predictions", url: `${BASE_URL}/predictions` },
          { name: `${title} Prediction`, url: canonicalUrl },
        ]}
      />

      <div className="mx-auto max-w-6xl">
        <Link href="/predictions" className="text-zinc-400 transition hover:text-white">
          ← All tennis predictions
        </Link>

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-emerald-500/30 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_35%),#09090b] p-6 md:p-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
            Tennis prediction hub
          </p>
          <h1 className="mb-5 text-4xl font-black leading-tight md:text-6xl">
            {title} Prediction, Preview & Match Info
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-zinc-300">
            A practical match hub for {title}: tournament context, visible form signals,
            current score when available, match time and official ways to follow the match. This is not betting advice.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-black/60 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Tournament</p>
              <p className="mt-2 font-black text-white">{match.tournament}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/60 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Category</p>
              <p className="mt-2 font-black text-white">{match.category || "Tennis"}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/60 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Status</p>
              <p className="mt-2 font-black text-white">{getDisplayStatus(match)}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/60 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Start time</p>
              <p className="mt-2 font-black text-white">{formatDateTime(match.startTime)}</p>
            </div>
          </div>
        </section>

        <AdSlot className="my-8" />

        <section className="mb-8 grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-emerald-400">
              {hasData ? "Prediction lean" : "Preview data"}
            </p>
            <h2 className="mb-4 text-3xl font-black">{hasData ? lean.winner : "More data needed"}</h2>
            <p className="mb-5 leading-8 text-zinc-300">
              {hasData
                ? lean.reason
                : "The public feed does not currently expose enough completed form data for this matchup. Instead of showing a fake winner, this page keeps the verified match details, links and alerts."}
            </p>
            {match.score ? (
              <p className="mb-5 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 font-black text-white">
                Current score: {match.score}
              </p>
            ) : null}
            <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-200">
              {hasData ? `Confidence: ${lean.confidence}` : "Prediction paused until form data appears"}
            </span>
          </article>

          <article className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-zinc-500">
              Follow the match
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href={`/watch/${getWatchSlug(match)}`}
                className="rounded-2xl bg-emerald-400 px-5 py-4 text-center font-black text-black transition hover:bg-emerald-300"
              >
                Open live match page →
              </Link>
              <Link
                href={`/vs/${slugify(match.player1)}-vs-${slugify(match.player2)}`}
                className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-center font-black text-white transition hover:bg-white/15"
              >
                Open matchup hub
              </Link>
            </div>
          </article>
        </section>

        {hasData ? (
          <section className="mb-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="mb-5 text-3xl font-black">Key prediction signals</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="border-b border-zinc-800 py-3 pr-4">Signal</th>
                    <th className="border-b border-zinc-800 py-3 pr-4">{match.player1}</th>
                    <th className="border-b border-zinc-800 py-3 pr-4">{match.player2}</th>
                    <th className="border-b border-zinc-800 py-3">How to read it</th>
                  </tr>
                </thead>
                <tbody>
                  {signals.map((signal) => (
                    <tr key={signal.label} className="text-zinc-300">
                      <td className="border-b border-zinc-900 py-4 pr-4 font-black text-white">{signal.label}</td>
                      <td className="border-b border-zinc-900 py-4 pr-4">{signal.player1Value}</td>
                      <td className="border-b border-zinc-900 py-4 pr-4">{signal.player2Value}</td>
                      <td className="border-b border-zinc-900 py-4 text-zinc-400">{signal.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="mb-8 rounded-[2rem] border border-amber-400/20 bg-amber-400/5 p-6">
            <p className="mb-2 text-xs font-black uppercase tracking-[0.22em] text-amber-200">
              Prediction unavailable
            </p>
            <h2 className="mb-4 text-3xl font-black">Not enough verified form data yet</h2>
            <p className="max-w-3xl leading-8 text-zinc-300">
              The current public tennis feed has no completed recent matches for one or both players, so this page intentionally avoids a misleading winner pick. Use the live match page for the latest score, start time and watch links.
            </p>
          </section>
        )}

        {hasData ? (
          <section className="mb-8 grid gap-5 md:grid-cols-2">
            {[{ player: match.player1, recent: player1Recent }, { player: match.player2, recent: player2Recent }].map((item) => (
              <article key={item.player} className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">Recent feed form</p>
                    <h3 className="mt-2 text-2xl font-black">{item.player}</h3>
                  </div>
                  {safePlayerUrl(item.player) ? (
                    <Link href={safePlayerUrl(item.player) || "/players"} className="rounded-full border border-white/10 px-4 py-2 text-sm font-black text-zinc-200 hover:bg-white/10">
                      Player page
                    </Link>
                  ) : null}
                </div>

                <div className="space-y-3">
                  {item.recent.map((recentMatch) => (
                    <Link
                      key={recentMatch.id}
                      href={`/watch/${getWatchSlug(recentMatch)}`}
                      className="block rounded-2xl border border-zinc-800 bg-black/60 p-4 transition hover:border-emerald-400/50"
                    >
                      <p className="font-black text-white">{recentMatch.player1} vs {recentMatch.player2}</p>
                      <p className="mt-1 text-sm text-zinc-500">{recentMatch.tournament} · {recentMatch.score || "Score unavailable"}</p>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="mb-8 grid gap-5 md:grid-cols-2">
            {[match.player1, match.player2].map((player) => (
              <article key={player} className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">Player context</p>
                <h3 className="mt-2 text-2xl font-black">{player}</h3>
                <p className="mt-4 leading-8 text-zinc-400">
                  Recent completed form is not available in the public feed right now. Check the player page or come back closer to match time.
                </p>
                {safePlayerUrl(player) ? (
                  <Link href={safePlayerUrl(player) || "/players"} className="mt-5 inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-black text-zinc-200 hover:bg-white/10">
                    Open player page
                  </Link>
                ) : null}
              </article>
            ))}
          </section>
        )}

        <RevenueConversionPanel context="matchup" playerName={match.player1} opponentName={match.player2} />

        <section className="mb-8 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-4 text-3xl font-black">Get match alerts</h2>
          <p className="mb-5 max-w-3xl leading-8 text-zinc-300">
            Want to come back when the match is closer? Join the tennis alerts list and use the live match page for schedule changes.
          </p>
          <EmailSignup source={`prediction:${getPredictionSlug(match.player1, match.player2, match.id)}`} />
        </section>

        <StreamingLinksGrid />
        <RelatedMoneyLinks />
        <ContentQualityNotice />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsEvent",
              name: title,
              sport: "Tennis",
              eventStatus: isLive(match) && !hasStaleLiveStatus(match) ? "https://schema.org/EventInProgress" : "https://schema.org/EventScheduled",
              startDate: match.startTime || undefined,
              location: {
                "@type": "Place",
                name: match.tournament,
              },
              competitor: [
                { "@type": "Person", name: match.player1 },
                { "@type": "Person", name: match.player2 },
              ],
              url: canonicalUrl,
            }),
          }}
        />
      </div>
    </main>
  );
}

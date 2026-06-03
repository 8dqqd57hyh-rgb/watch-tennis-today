import Link from "next/link";
import type { Metadata } from "next";
import AdSlot from "@/app/components/AdSlot";
import ContentQualityNotice from "@/app/components/ContentQualityNotice";
import RelatedMoneyLinks from "@/app/components/RelatedMoneyLinks";
import { getServerMatches, type ServerMatch } from "@/app/lib/serverMatches";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Tennis Predictions Today | Match Previews & Form Signals",
  description:
    "Browse tennis predictions and match previews for today's ATP and WTA matches with form signals, tournament context, start times and official watch links.",
  alternates: {
    canonical: "https://watchtennistoday.com/predictions",
  },
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

function getPredictionSlug(match: ServerMatch) {
  const base = `${slugify(match.player1)}-vs-${slugify(match.player2)}`;
  const id = String(match.id).split(":").pop();
  return `${base}-${id}`;
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

function isSingles(match: ServerMatch) {
  return !match.player1.includes("/") && !match.player2.includes("/");
}

function isAtpOrWta(match: ServerMatch) {
  const category = String(match.category || "").toUpperCase();
  return category === "ATP" || category === "WTA";
}

function hasUsefulNames(match: ServerMatch) {
  return [match.player1, match.player2].every((name) => {
    const slug = slugify(name);
    return slug.length >= 6 && !["tbd", "bye", "qualifier", "unknown"].includes(slug);
  });
}

function formatDateTime(value?: string | null) {
  if (!value) return "Time TBC";

  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function PredictionsPage() {
  const matches = await getServerMatches(120);
  const predictionMatches = matches
    .filter(isSingles)
    .filter(isAtpOrWta)
    .filter(hasUsefulNames)
    .filter(isPredictionReadyTiming)
    .sort((a, b) => getTime(a) - getTime(b))
    .slice(0, 30);

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-zinc-400 transition hover:text-white">
          ← Home
        </Link>

        <section className="mt-8 rounded-[2rem] border border-emerald-500/30 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_35%),#09090b] p-6 md:p-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-emerald-300">
            Match previews
          </p>
          <h1 className="mb-5 text-4xl font-black md:text-6xl">Tennis Predictions Today</h1>
          <p className="max-w-3xl text-lg leading-8 text-zinc-300">
            Data-led tennis previews for ATP and WTA singles matches: form signals,
            tournament route, start time and legal ways to follow the match.
          </p>
        </section>

        <AdSlot className="my-8" />

        {predictionMatches.length > 0 ? (
          <section className="grid gap-4 md:grid-cols-2">
            {predictionMatches.map((match) => (
              <Link
                key={match.id}
                href={`/predictions/${getPredictionSlug(match)}`}
                className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6 transition hover:border-emerald-400/60"
              >
                <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-wide text-zinc-500">
                  <span>{match.category}</span>
                  <span>•</span>
                  <span>{match.status || "Scheduled"}</span>
                </div>
                <h2 className="mb-3 text-2xl font-black text-white">
                  {match.player1} vs {match.player2}
                </h2>
                <p className="mb-2 text-zinc-400">{match.tournament}</p>
                <p className="text-sm font-bold text-emerald-300">{formatDateTime(match.startTime)}</p>
              </Link>
            ))}
          </section>
        ) : (
          <section className="rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="mb-3 text-3xl font-black">No prediction-ready matches right now</h2>
            <p className="leading-8 text-zinc-400">
              Check back when ATP or WTA singles matches are available in the current feed.
            </p>
          </section>
        )}

        <RelatedMoneyLinks />
        <ContentQualityNotice />
      </div>
    </main>
  );
}

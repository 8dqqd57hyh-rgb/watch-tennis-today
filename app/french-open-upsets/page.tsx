import FrenchOpenConversionCluster from "@/app/components/FrenchOpenConversionCluster";
import JsonLd from "@/app/components/JsonLd";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "French Open Upset Tracker 2026 | Roland Garros Shock Results",
  description:
    "Track French Open upsets, seeded player exits and Roland Garros shock results with match scores and next-step links.",
  alternates: { canonical: "https://watchtennistoday.com/french-open-upsets" },
};

type Upset = {
  id: string;
  tour: "ATP" | "WTA";
  tournament: string;
  round: string;
  date: string;
  time: string;
  court?: string;
  winner: string;
  loser: string;
  score: string;
  loserSeed: number;
  winnerSeed?: number | null;
  label: string;
  severity: "major" | "big" | "watchlist";
  href: string;
};

type UpsetResponse = {
  success?: boolean;
  error?: string;
  dateStart?: string;
  dateStop?: string;
  count?: number;
  seedSource?: string;
  apiFixtureCount?: number;
  normalizedMatchCount?: number;
  archiveFixtureCount?: number;
  liveUpsetCount?: number;
  verifiedUpsetCount?: number;
  dynamicSeedCount?: number;
  upsets?: Upset[];
};


function fallbackResponse(error = "Upset API did not return usable data."): UpsetResponse {
  return {
    success: false,
    error,
    count: 0,
    seedSource: "No client-side fake fallback rows are used. Check /api/french-open-upsets source counts.",
    upsets: [],
  };
}

function severityLabel(severity: Upset["severity"]) {
  if (severity === "major") return "Major shock";
  if (severity === "big") return "Big upset";
  return "Seed watch";
}

function seedText(seed?: number | null) {
  return seed ? `#${seed}` : "Unseeded / lower seed";
}

function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function getUpsets(): Promise<UpsetResponse> {
  const baseUrl = getSiteUrl();

  try {
    const response = await fetch(`${baseUrl}/api/french-open-upsets`, { cache: "no-store" });
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) return fallbackResponse("Upset API returned a non-JSON response.");

    const data = await response.json();
    if (!Array.isArray(data?.upsets)) {
      return fallbackResponse(data?.error || "Upset API did not include an upsets array.");
    }

    return data;
  } catch {
    return fallbackResponse();
  }
}

export default async function FrenchOpenUpsetsPage() {
  const data = await getUpsets();
  const upsets = data.upsets || [];
  const majorUpsets = upsets.filter((upset) => upset.severity === "major");
  const menUpsets = upsets.filter((upset) => upset.tour === "ATP");
  const womenUpsets = upsets.filter((upset) => upset.tour === "WTA");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "French Open Upset Tracker",
    description: "Roland Garros seeded player exits and shock results.",
    url: "https://watchtennistoday.com/french-open-upsets",
    isPartOf: {
      "@type": "WebSite",
      name: "Watch Tennis Today",
      url: "https://watchtennistoday.com",
    },
  };

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <JsonLd data={jsonLd} />
      <div className="mx-auto max-w-7xl">
        <section className="mb-10 rounded-[2.5rem] border border-red-500/50 bg-gradient-to-br from-red-950/45 via-black to-zinc-950 p-8 md:p-10">
          <div className="mb-5 inline-flex rounded-full bg-red-500 px-4 py-2 text-sm font-black text-black">
            Roland Garros upset tracker
          </div>

          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            French Open Upsets:
            <br />
            Seeded Player Exits
          </h1>

          <p className="mb-8 max-w-3xl text-lg leading-8 text-zinc-300">
            A quick fan board for shock Roland Garros results: seeded players who lost, who beat them, the score and where to follow the tournament next.
          </p>

          {data.dateStart && data.dateStop ? (
            <p className="mb-8 text-sm font-bold text-zinc-500">
              Result window: {data.dateStart} → {data.dateStop}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-4">
            <a href="#upset-list" className="rounded-2xl bg-red-500 px-6 py-4 text-lg font-black text-black transition hover:bg-red-400">
              View upsets →
            </a>
            <a href="/french-open-survivors" className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition hover:border-red-400">
              Who is still alive?
            </a>
            <a href="/roland-garros-recap" className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition hover:border-red-400">
              Daily recap
            </a>
          </div>
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">Tracked upsets</p>
            <p className="mt-2 text-4xl font-black text-red-400">{upsets.length}</p>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">Major shocks</p>
            <p className="mt-2 text-4xl font-black">{majorUpsets.length}</p>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">Men / ATP</p>
            <p className="mt-2 text-4xl font-black">{menUpsets.length}</p>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">Women / WTA</p>
            <p className="mt-2 text-4xl font-black">{womenUpsets.length}</p>
          </div>
        </section>

        <FrenchOpenConversionCluster compact title="After a shock result" />

        <section id="upset-list" className="mb-12">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-4xl font-black">Latest seeded exits</h2>
              <p className="mt-2 max-w-3xl text-zinc-400">
                The board focuses on top seeded players because those exits have the strongest news, search and fan intent.
              </p>
            </div>
            <a href="/french-open-results" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-bold transition hover:border-red-400">
              Full results →
            </a>
          </div>

          {upsets.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {upsets.map((upset) => (
                <a key={upset.id} href={upset.href} className="rounded-3xl border border-red-500/25 bg-zinc-950 p-6 transition hover:border-red-400 hover:bg-zinc-900">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-red-500/15 px-3 py-1 text-sm font-black text-red-300">
                      {severityLabel(upset.severity)}
                    </span>
                    <span className="text-sm font-bold text-zinc-500">{upset.tour}</span>
                  </div>

                  <h3 className="mb-4 text-2xl font-black leading-tight">
                    {seedText(upset.winnerSeed)} {upset.winner}
                    <br />
                    <span className="text-zinc-500">def.</span>
                    <br />
                    #{upset.loserSeed} {upset.loser}
                  </h3>

                  <div className="space-y-2 text-sm font-bold text-zinc-400">
                    <p>Score: <span className="text-white">{upset.score}</span></p>
                    <p>{[upset.round, upset.date, upset.time].filter(Boolean).join(" · ")}</p>
                    {upset.court ? <p>Court: {upset.court}</p> : null}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-zinc-300">
              <h3 className="mb-3 text-2xl font-black text-white">No seeded upsets detected right now.</h3>
              <p className="leading-8">
                This means the live feeds did not detect a top-32 loser from the data they returned. The route now checks API-Tennis fixtures, your existing /api/matches feed, match_archive, and a verified 2026 seeded-exit layer instead of leaving the page empty.
              </p>
              <p className="mt-4 text-sm font-bold text-zinc-500">
                Source check: API fixtures {data.apiFixtureCount ?? 0} · /api/matches {data.normalizedMatchCount ?? 0} · archive {data.archiveFixtureCount ?? 0} · live detected {data.liveUpsetCount ?? 0} · verified {data.verifiedUpsetCount ?? 0} · seeds {data.dynamicSeedCount ?? 0}
              </p>
              {data.seedSource ? <p className="mt-2 text-sm text-zinc-500">{data.seedSource}</p> : null}
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/french-open-results" className="rounded-2xl bg-white px-5 py-3 font-black text-black">Open results</a>
                <a href="/french-open-survivors" className="rounded-2xl border border-zinc-700 px-5 py-3 font-black text-white">Open survivors</a>
              </div>
            </div>
          )}
        </section>

        <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-8">
          <h2 className="mb-4 text-3xl font-black">How this tracker works</h2>
          <p className="max-w-4xl leading-8 text-zinc-300">
            The page checks finished main-draw French Open singles matches and highlights cases where a known top seed loses to an unseeded or lower-seeded opponent. It is designed as a fast fan signal, not as an official tournament seed database.
          </p>
        </section>
      </div>
    </main>
  );
}

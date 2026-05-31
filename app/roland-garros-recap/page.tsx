import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Roland Garros Recap: Yesterday’s French Open Results & Highlights",
  description:
    "Missed Roland Garros yesterday? Catch up with the previous day’s French Open results, long matches, retirements, storylines and official viewing links.",
  alternates: { canonical: "https://watchtennistoday.com/roland-garros-recap" },
};

type Match = {
  id?: string;
  player1?: string;
  player2?: string;
  tournament?: string;
  category?: string;
  status?: string;
  rawStatus?: string;
  score?: string;
  setScore?: string;
  winner?: string;
  round?: string;
  date?: string;
  time?: string;
  startTime?: string;
  court?: string;
  setCount?: number;
  isLongMatch?: boolean;
  isRetirementOrWalkover?: boolean;
};

type AdvancementSummary = {
  id?: string;
  category?: string;
  round?: string;
  winner?: string;
  eliminated?: string;
  score?: string;
  nextOpponent?: string;
  nextMatchRound?: string;
  nextMatchDate?: string;
};

type RecapData = {
  recapDate?: string;
  timezone?: string;
  count?: number;
  storylines?: string[];
  advancementSummaries?: AdvancementSummary[];
  topResults?: Match[];
  menMatches?: Match[];
  womenMatches?: Match[];
  longMatches?: Match[];
  retirements?: Match[];
  matches?: Match[];
};

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
  const readablePart = slugify(
    `${match.player1 || "player"}-vs-${match.player2 || "player"}`,
  );
  const numericId = match.id?.split(":").pop() || "match";

  return `${readablePart}-${numericId}`;
}

function formatMatchDate(match: Match) {
  if (!match.date && !match.time) return "Time not listed";
  return [match.date, match.time].filter(Boolean).join(" · ");
}

function formatReadableDate(value?: string) {
  if (!value) return "yesterday";

  const date = new Date(`${value}T12:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function MatchCard({
  match,
  compact = false,
}: {
  match: Match;
  compact?: boolean;
}) {
  return (
    <a
      href={`/watch/${matchSlug(match)}`}
      className="block rounded-3xl border border-orange-500/25 bg-zinc-950 p-5 transition hover:border-orange-500 hover:bg-zinc-900"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="rounded-full bg-green-500/10 px-3 py-1 font-black text-green-300">
          {match.status || "Finished"}
        </span>
        <span className="text-zinc-500">{match.category || "Tennis"}</span>
      </div>

      <h3
        className={
          compact
            ? "mb-3 text-lg font-black"
            : "mb-4 text-2xl font-black leading-tight"
        }
      >
        {match.player1 || "TBD"}
        <span className="text-zinc-500"> vs </span>
        {match.player2 || "TBD"}
      </h3>

      <p className="mb-2 font-bold text-zinc-200">
        {match.score || match.setScore || "Score not available"}
      </p>

      {match.winner ? (
        <p className="mb-2 text-sm text-orange-300">Winner: {match.winner}</p>
      ) : null}

      <p className="text-sm leading-6 text-zinc-500">
        {[match.round, match.court, formatMatchDate(match)]
          .filter(Boolean)
          .join(" · ")}
      </p>
    </a>
  );
}

function AdvancementCard({ item }: { item: AdvancementSummary }) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="rounded-full bg-orange-500/10 px-3 py-1 font-black text-orange-300">
          {item.category || "Roland Garros"}
        </span>
        <span className="text-zinc-500">{item.round || "Completed match"}</span>
      </div>

      <div className="space-y-3">
        <p className="text-lg font-black text-green-300">
          ✅ {item.winner || "Winner"} advanced
        </p>
        <p className="text-zinc-400">
          ❌ {item.eliminated || "Opponent"} was eliminated
        </p>
        {item.score ? (
          <p className="text-sm font-bold text-zinc-300">Score: {item.score}</p>
        ) : null}
        <div className="rounded-2xl bg-zinc-900 p-4">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-zinc-500">
            Next match
          </p>
          <p className="font-black">
            vs{" "}
            {item.nextOpponent && item.nextOpponent !== "TBD"
              ? item.nextOpponent
              : "TBD"}
          </p>
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            {[item.nextMatchRound, item.nextMatchDate]
              .filter(Boolean)
              .join(" · ") ||
              "Opponent will be updated when the draw data is available."}
          </p>
        </div>
      </div>
    </div>
  );
}

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) {
    return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  }

  const protocol =
    host.includes("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https";

  return `${protocol}://${host}`;
}

async function getRecapData(): Promise<RecapData> {
  const baseUrl = await getBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/api/roland-garros-recap`, {
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") || "";

    if (!res.ok || !contentType.includes("application/json")) {
      return {};
    }

    const json = await res.json();

    return json && typeof json === "object" ? json : {};
  } catch {
    return {};
  }
}

export default async function RolandGarrosRecapPage() {
  const data = await getRecapData();

  const matches = Array.isArray(data.matches) ? data.matches : [];
  const topResults = Array.isArray(data.topResults)
    ? data.topResults
    : matches.slice(0, 12);
  const menMatches = Array.isArray(data.menMatches) ? data.menMatches : [];
  const womenMatches = Array.isArray(data.womenMatches)
    ? data.womenMatches
    : [];
  const longMatches = Array.isArray(data.longMatches) ? data.longMatches : [];
  const retirements = Array.isArray(data.retirements) ? data.retirements : [];
  const storylines = Array.isArray(data.storylines) ? data.storylines : [];
  const advancementSummaries = Array.isArray(data.advancementSummaries)
    ? data.advancementSummaries
    : [];
  const readableDate = formatReadableDate(data.recapDate);

  const statCards = [
    { label: "Completed matches", value: data.count ?? matches.length },
    { label: "Men’s matches", value: menMatches.length },
    { label: "Women’s matches", value: womenMatches.length },
    { label: "Long matches", value: longMatches.length },
  ];

  const relatedLinks = [
    ["Today at Roland Garros", "/french-open-today"],
    ["French Open Results", "/french-open-results"],
    ["Order of Play", "/french-open-order-of-play"],
    ["TV Schedule", "/french-open-tv-schedule"],
    ["Where to Watch", "/where-to-watch-french-open"],
    ["Best VPN for Roland Garros", "/best-vpn-for-roland-garros"],
  ];

  const faq = [
    {
      q: "What is the Roland Garros recap page?",
      a: "It is a quick daily catch-up page for fans who missed the previous French Open day, summarising completed matches and notable match-data storylines.",
    },
    {
      q: "Does this page show real French Open results?",
      a: "The page is built from tennis fixture data and only lists matches that are marked as completed, retired or walkover in the available data source.",
    },
    {
      q: "Where can I watch the next Roland Garros matches?",
      a: "Use the French Open TV schedule, where-to-watch guide and country streaming pages to find official broadcasters for your location.",
    },
  ];

  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="mb-10 rounded-[2.5rem] border border-orange-500/50 bg-gradient-to-br from-orange-950/60 via-black to-black p-8">
          <div className="mb-5 inline-flex rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-black">
            Daily Roland Garros catch-up
          </div>

          <h1 className="mb-6 text-5xl font-black leading-tight md:text-7xl">
            Roland Garros Recap:
            <br />
            What Happened Yesterday
          </h1>

          <p className="mb-8 max-w-3xl text-lg leading-8 text-zinc-300">
            Missed the French Open yesterday? Catch up with the previous
            tournament day’s biggest results, long matches, retirements,
            walkovers and useful links for today’s Roland Garros action.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#who-advanced"
              className="rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-black transition hover:bg-orange-400"
            >
              Who advanced? →
            </a>
            <a
              href="/french-open-today"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition hover:border-orange-500"
            >
              See today’s matches
            </a>
            <a
              href="/french-open-tv-schedule"
              className="rounded-2xl border border-zinc-700 px-6 py-4 text-lg font-bold transition hover:border-orange-500"
            >
              TV schedule
            </a>
          </div>
        </section>

        <section className="mb-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-zinc-500">
            Recap date
          </p>
          <h2 className="text-3xl font-black">{readableDate}</h2>
          <p className="mt-3 max-w-3xl leading-8 text-zinc-400">
            This page uses the Europe/Paris tournament day. It is a match-data
            recap, not a video highlights feed.
          </p>
        </section>

        <section
          className="mb-10 rounded-[2rem] border border-zinc-800 bg-zinc-950 p-6"
          id="who-advanced"
        >
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-zinc-500">
                Fast catch-up
              </p>
              <h2 className="text-3xl font-black">
                Who advanced and who went out
              </h2>
              <p className="mt-3 max-w-3xl leading-8 text-zinc-400">
                A quick list of yesterday’s winners, eliminated players and
                their next listed opponent when the draw data is already
                available.
              </p>
            </div>
            <a
              href="#recap-results"
              className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-bold transition hover:border-orange-500"
            >
              See full results →
            </a>
          </div>

          {advancementSummaries.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {advancementSummaries.slice(0, 9).map((item) => (
                <AdvancementCard
                  key={`advanced-${item.id}-${item.winner}`}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
              <p className="leading-8 text-zinc-300">
                Advancement details are not available yet. The section will
                populate after completed matches are linked with winner data.
              </p>
            </div>
          )}
        </section>

        <section className="mb-10 grid gap-4 md:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-zinc-500">
                {card.label}
              </p>
              <p className="text-4xl font-black text-orange-400">
                {card.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mb-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="mb-5 text-3xl font-black">Top storylines</h2>
            {storylines.length > 0 ? (
              <div className="space-y-3">
                {storylines.map((storyline) => (
                  <p
                    key={storyline}
                    className="rounded-2xl bg-zinc-900 p-4 leading-7 text-zinc-300"
                  >
                    {storyline}
                  </p>
                ))}
              </div>
            ) : (
              <p className="leading-8 text-zinc-400">
                No recap storylines are available yet. Check back after the
                previous Roland Garros day has completed.
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="mb-5 text-3xl font-black">Catch up fast</h2>
            <div className="grid gap-3">
              {relatedLinks.map(([title, href]) => (
                <a
                  key={href}
                  href={href}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 font-bold transition hover:border-orange-500"
                >
                  {title} →
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="recap-results" className="mb-12">
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h2 className="text-4xl font-black">Yesterday’s main results</h2>
              <p className="mt-2 text-zinc-400">
                Completed Roland Garros matches from the previous tournament
                day.
              </p>
            </div>
            <a
              href="/french-open-results"
              className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-bold transition hover:border-orange-500"
            >
              All French Open results →
            </a>
          </div>

          {topResults.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {topResults.map((match) => (
                <MatchCard
                  key={`${match.id}-${match.player1}-${match.player2}`}
                  match={match}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
              <p className="leading-8 text-zinc-300">
                No completed Roland Garros matches are listed for yesterday in
                the available data. Use the French Open results page for the
                latest completed matches.
              </p>
            </div>
          )}
        </section>

        <section className="mb-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="mb-5 text-3xl font-black">
              Matches that went the distance
            </h2>
            {longMatches.length > 0 ? (
              <div className="space-y-4">
                {longMatches.slice(0, 6).map((match) => (
                  <MatchCard
                    key={`long-${match.id}-${match.player1}`}
                    match={match}
                    compact
                  />
                ))}
              </div>
            ) : (
              <p className="leading-8 text-zinc-400">
                No full-distance matches are detected in the available score
                data.
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="mb-5 text-3xl font-black">
              Retirements and walkovers
            </h2>
            {retirements.length > 0 ? (
              <div className="space-y-4">
                {retirements.slice(0, 6).map((match) => (
                  <MatchCard
                    key={`retirement-${match.id}-${match.player1}`}
                    match={match}
                    compact
                  />
                ))}
              </div>
            ) : (
              <p className="leading-8 text-zinc-400">
                No retirements or walkovers are detected for the previous day.
              </p>
            )}
          </div>
        </section>

        <section className="mb-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="mb-5 text-3xl font-black">Men’s recap</h2>
            <div className="space-y-4">
              {(menMatches.length ? menMatches : matches)
                .slice(0, 6)
                .map((match) => (
                  <MatchCard
                    key={`men-${match.id}-${match.player1}`}
                    match={match}
                    compact
                  />
                ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="mb-5 text-3xl font-black">Women’s recap</h2>
            <div className="space-y-4">
              {(womenMatches.length ? womenMatches : matches)
                .slice(0, 6)
                .map((match) => (
                  <MatchCard
                    key={`women-${match.id}-${match.player1}`}
                    match={match}
                    compact
                  />
                ))}
            </div>
          </div>
        </section>

        <section className="mb-12 rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-950 to-black p-8">
          <h2 className="mb-5 text-3xl font-black">Why this recap exists</h2>
          <div className="max-w-4xl space-y-5 leading-8 text-zinc-300">
            <p>
              Roland Garros days are long: multiple courts, men’s and women’s
              matches, delays, retirements and late finishes. This page is built
              for fans who missed a day and want the essential match-data recap
              before watching today’s schedule.
            </p>
            <p>
              For video highlights and official live coverage, use the TV
              schedule and where-to-watch guides linked above. French Open
              streaming rights vary by country.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-5 text-3xl font-black">Roland Garros recap FAQ</h2>
          <div className="space-y-4">
            {faq.map((item) => (
              <div key={item.q} className="rounded-2xl bg-zinc-900 p-5">
                <h3 className="mb-2 font-black">{item.q}</h3>
                <p className="leading-7 text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.a,
                },
              })),
            }),
          }}
        />
      </div>
    </main>
  );
}

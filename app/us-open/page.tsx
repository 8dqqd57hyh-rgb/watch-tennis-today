import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/app/components/JsonLd";
import BreadcrumbSchema from "@/app/components/BreadcrumbSchema";
import LegalStreamingOptions from "@/components/LegalStreamingOptions";
import { getServerMatchesWindow, type ServerMatch } from "@/app/lib/serverMatches";
import { isUsOpenTournament } from "@/app/lib/matchNormalization";
import { isFinishedMatch, isLiveMatch, isRetiredMatch, isSuspendedMatch, isUpcomingMatch, normalizeMatchStatus } from "@/app/lib/matchStatus";

const title = "US Open 2026 Live: Matches, Schedule, Results & How to Watch";
const description = "Follow US Open 2026 live matches, today's schedule, upcoming fixtures, latest results and legal streaming options.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://watchtennistoday.com/us-open" },
  openGraph: { title, description, url: "https://watchtennistoday.com/us-open", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

function dateKey(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString("en-CA");
}

function timeValue(match: ServerMatch) {
  const value = match.startTime ? new Date(match.startTime).getTime() : Number.MAX_SAFE_INTEGER;
  return Number.isNaN(value) ? Number.MAX_SAFE_INTEGER : value;
}

function MatchCard({ match }: { match: ServerMatch }) {
  const status = normalizeMatchStatus(match.status);
  const statusClass = status === "LIVE" ? "bg-red-600 text-white" : status === "SUSPENDED" ? "bg-amber-400 text-black" : "bg-zinc-800 text-zinc-200";
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
      <div className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-wide">
        <span className={`rounded-full px-3 py-1 ${statusClass}`}>{status === "LIVE" ? "Live now" : status === "UNKNOWN" ? "Status unknown" : status}</span>
        <span className="text-zinc-400">{match.category}</span>
      </div>
      <h3 className="mt-4 text-xl font-black text-white">{match.player1}<span className="block text-sm font-medium text-zinc-500">vs</span>{match.player2}</h3>
      <p className="mt-3 text-sm text-zinc-400">{match.round || match.tournament}{match.startTime ? ` · ${new Date(match.startTime).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}` : ""}</p>
      <div className="mt-4 flex gap-2">
        <Link href={`/watch/${encodeURIComponent(match.id)}`} className="rounded-xl bg-green-500 px-4 py-2 text-sm font-black text-black hover:bg-green-400">Watch options</Link>
        <Link href="/today" className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-bold text-white hover:border-green-400">Full schedule</Link>
      </div>
    </article>
  );
}

function MatchSection({ id, title: sectionTitle, matches, empty }: { id: string; title: string; matches: ServerMatch[]; empty: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-10">
      <div className="mb-4 flex items-end justify-between gap-3"><h2 id={`${id}-title`} className="text-2xl font-black text-white md:text-3xl">{sectionTitle}</h2><span className="text-sm text-zinc-400">{matches.length} matches</span></div>
      {matches.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{matches.slice(0, 12).map((match) => <MatchCard key={match.id} match={match} />)}</div> : <p className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-300">{empty}</p>}
    </section>
  );
}

export default async function Page() {
  const matches = (await getServerMatchesWindow({ includeFinished: true, daysBack: 3, daysForward: 7, revalidateSeconds: 30, timeoutMs: 8000, noStore: true })).filter((match) => isUsOpenTournament(match.tournament));
  const today = dateKey(new Date().toISOString());
  const live = matches.filter((match) => isLiveMatch(match.status)).sort((a, b) => timeValue(a) - timeValue(b));
  const todayMatches = matches.filter((match) => dateKey(match.startTime) === today).sort((a, b) => timeValue(a) - timeValue(b));
  const upcoming = matches.filter((match) => isUpcomingMatch(match.status)).sort((a, b) => timeValue(a) - timeValue(b));
  const results = matches.filter((match) => isFinishedMatch(match.status) || isRetiredMatch(match.status)).sort((a, b) => timeValue(b) - timeValue(a));
  const suspended = matches.filter((match) => isSuspendedMatch(match.status));
  const webPageSchema = { "@context": "https://schema.org", "@type": "WebPage", name: title, description, url: "https://watchtennistoday.com/us-open", about: { "@type": "SportsEvent", name: "US Open 2026", sport: "Tennis", location: { "@type": "Place", name: "USTA Billie Jean King National Tennis Center, New York" } } };

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white">
      <div className="mx-auto max-w-7xl">
        <JsonLd data={webPageSchema} />
        <nav aria-label="Breadcrumb" className="mb-5 flex gap-2 text-sm text-zinc-400"><Link href="/" className="hover:text-white">Home</Link><span aria-hidden="true">/</span><span>US Open</span></nav>
        <header className="rounded-3xl border border-blue-400/30 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),transparent_45%),#09090b] p-7 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-green-400">US Open 2026</p>
          <h1 className="mt-3 max-w-5xl text-4xl font-black leading-tight md:text-6xl">US Open 2026: Live Matches, Schedule &amp; Results</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300">Follow today&apos;s US Open matches, upcoming fixtures, recent results and legal viewing options.</p>
          <div className="mt-6 flex flex-wrap gap-3"><Link href="/today" className="rounded-xl bg-green-500 px-5 py-3 font-black text-black hover:bg-green-400">View today&apos;s matches</Link><a href="#how-to-watch" className="rounded-xl border border-zinc-700 px-5 py-3 font-black text-white hover:border-green-400">Watch US Open</a></div>
        </header>

        <section aria-labelledby="snapshot-title" className="mt-8"><h2 id="snapshot-title" className="text-2xl font-black">Current tournament snapshot</h2><div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-5"><strong className="text-3xl">{live.length}</strong><span className="mt-1 block text-sm text-zinc-300">Live matches</span></div><div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"><strong className="text-3xl">{upcoming.length}</strong><span className="mt-1 block text-sm text-zinc-300">Upcoming matches</span></div><div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"><strong className="text-3xl">{results.length}</strong><span className="mt-1 block text-sm text-zinc-300">Recently finished</span></div></div>{suspended.length ? <p className="mt-3 text-sm text-amber-300">{suspended.length} match{suspended.length === 1 ? " is" : "es are"} suspended or delayed and excluded from live counts.</p> : null}</section>

        <MatchSection id="live-now" title="Live now" matches={live} empty="No US Open matches are live right now." />
        <MatchSection id="todays-matches" title="Today’s US Open matches" matches={todayMatches} empty="No US Open matches are listed for today right now." />
        <MatchSection id="upcoming" title="Upcoming matches" matches={upcoming} empty="No upcoming US Open fixtures are listed right now." />
        <MatchSection id="recent-results" title="Recent results" matches={results} empty="No recent US Open results are available right now." />

        <section id="how-to-watch" className="mt-10 text-zinc-900"><LegalStreamingOptions title="How to watch the US Open legally" /><p className="mt-3 rounded-2xl bg-zinc-950 p-5 text-sm text-zinc-300">Broadcast and streaming availability depends on your country or region. Confirm the tournament, court and subscription tier with the licensed provider before subscribing.</p></section>
        <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-6"><h2 className="text-2xl font-black">Useful tennis navigation</h2><div className="mt-4 flex flex-wrap gap-3">{[["/today", "Tennis Today"], ["/live-tennis", "Live Tennis"], ["/players", "Players"], ["/watch-tennis-online", "Legal watch guide"], ["/grand-slams", "Grand Slams"]].map(([href, label]) => <Link key={href} href={href} className="rounded-xl border border-zinc-700 px-4 py-3 font-bold hover:border-green-400">{label}</Link>)}</div></section>
        <BreadcrumbSchema items={[{ name: "Home", url: "https://watchtennistoday.com" }, { name: "US Open", url: "https://watchtennistoday.com/us-open" }]} />
      </div>
    </main>
  );
}
